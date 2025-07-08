#!/usr/bin/env python3
"""
Pre-deploy regression tests for the gallery website.
Tests core functionality to ensure deployments don't break essential features.
"""

import os
import sys
import yaml
import re
from pathlib import Path
from typing import List, Dict, Tuple
import subprocess

# Test configuration
TEST_BUILD_DIR = "_site"
REQUIRED_PAGES = [
    "index.html",
    "paintings/index.html", 
    "linocuts/index.html",
    "studio/index.html",
    "about/index.html",
    "cv/index.html"
]

class SiteIntegrityTests:
    """Test suite for validating site integrity before deployment."""
    
    def __init__(self):
        self.failures = []
        self.warnings = []
        self.build_dir = Path(TEST_BUILD_DIR)
        
    def log_failure(self, test_name: str, message: str):
        """Log a test failure."""
        self.failures.append(f"❌ {test_name}: {message}")
        
    def log_warning(self, test_name: str, message: str):
        """Log a test warning."""
        self.warnings.append(f"⚠️  {test_name}: {message}")
        
    def log_success(self, test_name: str, message: str = ""):
        """Log a test success."""
        msg = f"✅ {test_name}"
        if message:
            msg += f": {message}"
        print(msg)

    def test_jekyll_build(self) -> bool:
        """Test that Jekyll can build the site without errors."""
        print("🔨 Testing Jekyll build...")
        
        try:
            result = subprocess.run(
                ["bundle", "exec", "jekyll", "build", "--trace"],
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result.returncode != 0:
                self.log_failure("Jekyll Build", f"Build failed with exit code {result.returncode}")
                self.log_failure("Jekyll Build", f"Error output: {result.stderr}")
                return False
                
            if not self.build_dir.exists():
                self.log_failure("Jekyll Build", f"Build directory {self.build_dir} not created")
                return False
                
            self.log_success("Jekyll Build", "Site builds successfully")
            return True
            
        except subprocess.TimeoutExpired:
            self.log_failure("Jekyll Build", "Build timed out after 120 seconds")
            return False
        except Exception as e:
            self.log_failure("Jekyll Build", f"Build error: {str(e)}")
            return False

    def test_required_pages_exist(self) -> bool:
        """Test that all required pages are generated."""
        print("📄 Testing required pages exist...")
        
        all_exist = True
        for page in REQUIRED_PAGES:
            page_path = self.build_dir / page
            if not page_path.exists():
                self.log_failure("Required Pages", f"Missing page: {page}")
                all_exist = False
            else:
                self.log_success("Required Pages", f"Found {page}")
                
        return all_exist

    def test_root_redirect_or_paintings(self) -> bool:
        """Test that root page either mirrors /paintings/ or redirects to it."""
        print("🏠 Testing root page behavior...")
        
        index_path = self.build_dir / "index.html"
        if not index_path.exists():
            self.log_failure("Root Page", "index.html not found")
            return False
            
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check for redirect
        if 'http-equiv="refresh"' in content or 'window.location' in content:
            if '/paintings/' in content or '/paintings' in content:
                self.log_success("Root Page", "Contains redirect to paintings")
                return True
            else:
                self.log_failure("Root Page", "Redirect found but not to paintings")
                return False
                
        # Check for paintings content
        if 'class="gallery"' in content or 'class="painting"' in content:
            self.log_success("Root Page", "Contains paintings gallery content")
            return True
            
        self.log_failure("Root Page", "Neither redirects to paintings nor contains gallery content")
        return False

    def load_paintings_metadata(self) -> List[Dict]:
        """Load paintings metadata from titles.yml."""
        titles_path = Path("_data/titles.yml")
        if not titles_path.exists():
            return []
            
        try:
            with open(titles_path, 'r', encoding='utf-8') as f:
                return yaml.safe_load(f) or []
        except Exception as e:
            self.log_warning("Metadata Loading", f"Could not load titles.yml: {e}")
            return []

    def find_painting_files(self) -> List[Tuple[str, int, str]]:
        """Find all painting files and extract metadata."""
        paintings_dir = Path("paintings")
        if not paintings_dir.exists():
            return []
            
        paintings = []
        for file_path in paintings_dir.glob("*.jpg"):
            filename = file_path.name
            name_without_ext = file_path.stem
            
            # Parse using Jekyll logic (space-splitting)
            parts = name_without_ext.split(' ')
            if len(parts) >= 2:
                try:
                    year = int(parts[0])
                    if 1900 <= year <= 2100:
                        title = ' '.join(parts[1:])
                        paintings.append((filename, year, title))
                except ValueError:
                    continue
                    
        return paintings

    def test_paintings_appear_on_page(self) -> bool:
        """Test that all paintings appear on the paintings page."""
        print("🎨 Testing all paintings appear on page...")
        
        paintings_page = self.build_dir / "paintings" / "index.html"
        if not paintings_page.exists():
            self.log_failure("Paintings Page", "/paintings/index.html not found")
            return False
            
        with open(paintings_page, 'r', encoding='utf-8') as f:
            page_content = f.read()
            
        # Find all painting files
        painting_files = self.find_painting_files()
        if not painting_files:
            self.log_warning("Paintings Page", "No painting files found to test")
            return True
            
        missing_paintings = []
        found_paintings = []
        
        for filename, year, title in painting_files:
            # Check if painting appears in HTML (by filename or title)
            if filename in page_content or title in page_content:
                found_paintings.append(f"{year} {title}")
            else:
                missing_paintings.append(f"{filename} ({year} {title})")
                
        if missing_paintings:
            self.log_failure("Paintings Page", f"Missing paintings: {', '.join(missing_paintings)}")
            return False
        else:
            self.log_success("Paintings Page", f"All {len(found_paintings)} paintings appear on page")
            return True

    def test_title_below_image_layout(self) -> bool:
        """Test that painting titles appear below images, not above."""
        print("📝 Testing title placement (below images)...")
        
        paintings_page = self.build_dir / "paintings" / "index.html"
        if not paintings_page.exists():
            self.log_failure("Title Layout", "/paintings/index.html not found")
            return False
            
        with open(paintings_page, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Look for the pattern: img tag followed by painting-info div
        # This indicates titles are below images
        correct_pattern = r'<img[^>]*>\s*<div class="painting-info">'
        incorrect_pattern = r'<div class="painting-header">[^<]*<img'
        
        if re.search(correct_pattern, content, re.MULTILINE | re.DOTALL):
            self.log_success("Title Layout", "Titles correctly placed below images")
            return True
        elif re.search(incorrect_pattern, content, re.MULTILINE | re.DOTALL):
            self.log_failure("Title Layout", "Titles incorrectly placed above images")
            return False
        else:
            self.log_warning("Title Layout", "Could not determine title placement pattern")
            return True

    def test_centered_awareness_basics(self) -> bool:
        """Test basic centered awareness checks."""
        print("🎯 Testing centered awareness basics...")
        
        issues = []
        
        # Check for common anti-patterns
        paintings_page = self.build_dir / "paintings" / "index.html"
        if paintings_page.exists():
            with open(paintings_page, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Check for proper painting structure
            if 'class="painting-header"' in content:
                issues.append("Found painting-header (titles above images)")
            
            if 'class="painting-info"' not in content:
                issues.append("Missing painting-info (titles below images)")
                
            # Check for proper navigation
            nav_items = ["Paintings", "Linocuts", "About", "CV"]
            for item in nav_items:
                if item not in content:
                    issues.append(f"Missing navigation item: {item}")
                    
            # Check Studio is not in main navigation
            if '>Studio<' in content:
                issues.append("Studio should not be in main navigation")
        
        if issues:
            self.log_failure("Centered Awareness", f"Issues found: {'; '.join(issues)}")
            return False
        else:
            self.log_success("Centered Awareness", "Basic patterns check passed")
            return True

    def test_paintings_chronological_order(self) -> bool:
        """Test that paintings appear in reverse chronological order (newest first)."""
        print("📅 Testing painting chronological order...")
        
        paintings_page = self.build_dir / "paintings" / "index.html"
        if not paintings_page.exists():
            self.log_failure("Painting Order", "/paintings/index.html not found")
            return False
            
        with open(paintings_page, 'r', encoding='utf-8') as f:
            page_content = f.read()
            
        # Extract years from the page in order they appear
        year_pattern = r'<div class="year">(\d{4})</div>'
        years_on_page = [int(match) for match in re.findall(year_pattern, page_content)]
        
        if not years_on_page:
            self.log_warning("Painting Order", "No years found on page to test order")
            return True
            
        # Check if sorted in reverse chronological order (newest first)
        is_reverse_chronological = all(
            years_on_page[i] >= years_on_page[i + 1] 
            for i in range(len(years_on_page) - 1)
        )
        
        if is_reverse_chronological:
            self.log_success("Painting Order", f"Paintings in correct order: {years_on_page[0]} to {years_on_page[-1]}")
            return True
        else:
            self.log_failure("Painting Order", f"Paintings not in reverse chronological order: {years_on_page}")
            return False

    def test_metadata_consistency(self) -> bool:
        """Test that titles.yml metadata is consistent with actual files."""
        print("📊 Testing metadata consistency...")
        
        metadata = self.load_paintings_metadata()
        painting_files = self.find_painting_files()
        
        if not metadata and not painting_files:
            self.log_success("Metadata Consistency", "No metadata or files to check")
            return True
            
        # Create lookup sets
        metadata_pairs = set((entry['year'], entry['title']) for entry in metadata if 'year' in entry and 'title' in entry)
        file_pairs = set((year, title) for _, year, title in painting_files)
        
        # Find mismatches
        missing_metadata = file_pairs - metadata_pairs
        orphaned_metadata = metadata_pairs - file_pairs
        
        issues = []
        if missing_metadata:
            issues.append(f"Files without metadata: {missing_metadata}")
        if orphaned_metadata:
            issues.append(f"Metadata without files: {orphaned_metadata}")
            
        if issues:
            self.log_failure("Metadata Consistency", "; ".join(issues))
            return False
        else:
            self.log_success("Metadata Consistency", f"All {len(file_pairs)} paintings have matching metadata")
            return True

    def test_navigation_structure(self) -> bool:
        """Test that navigation structure is present and functional."""
        print("🧭 Testing navigation structure...")
        
        index_path = self.build_dir / "index.html"
        if not index_path.exists():
            self.log_failure("Navigation", "index.html not found")
            return False
            
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check for navigation elements
        nav_links = ["Paintings", "Linocuts", "Studio", "About", "CV"]
        missing_links = []
        
        for link in nav_links:
            if link not in content:
                missing_links.append(link)
                
        if missing_links:
            self.log_failure("Navigation", f"Missing navigation links: {', '.join(missing_links)}")
            return False
        else:
            self.log_success("Navigation", "All navigation links present")
            return True

    def test_image_paths_valid(self) -> bool:
        """Test that image paths in HTML point to existing files."""
        print("🖼️  Testing image paths...")
        
        paintings_page = self.build_dir / "paintings" / "index.html"
        if not paintings_page.exists():
            self.log_warning("Image Paths", "/paintings/index.html not found")
            return True
            
        with open(paintings_page, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Find all image src attributes
        img_pattern = r'<img[^>]+src="([^"]+)"'
        image_paths = re.findall(img_pattern, content)
        
        missing_images = []
        for img_path in image_paths:
            # Convert relative path to absolute and handle URL encoding
            if img_path.startswith('/'):
                # URL decode the path for file system lookup
                import urllib.parse
                decoded_path = urllib.parse.unquote(img_path.lstrip('/'))
                full_path = self.build_dir / decoded_path
            else:
                # Handle relative paths
                decoded_path = urllib.parse.unquote(img_path)
                full_path = self.build_dir / "paintings" / decoded_path
                
            if not full_path.exists():
                missing_images.append(img_path)
                
        if missing_images:
            self.log_failure("Image Paths", f"Missing images: {', '.join(missing_images[:5])}")
            return False
        else:
            self.log_success("Image Paths", f"All {len(image_paths)} image paths valid")
            return True

    def run_all_tests(self) -> bool:
        """Run all tests and return True if all pass."""
        print("🧪 Running pre-deploy regression tests...\n")
        
        tests = [
            self.test_jekyll_build,
            self.test_required_pages_exist,
            self.test_root_redirect_or_paintings,
            self.test_paintings_appear_on_page,
            self.test_title_below_image_layout,
            self.test_paintings_chronological_order,
            self.test_metadata_consistency,
            self.test_navigation_structure,
            self.test_image_paths_valid,
            self.test_centered_awareness_basics
        ]
        
        all_passed = True
        for test in tests:
            try:
                result = test()
                if not result:
                    all_passed = False
            except Exception as e:
                self.log_failure(test.__name__, f"Test crashed: {str(e)}")
                all_passed = False
                
        # Print summary
        print("\n" + "="*60)
        print("📋 TEST SUMMARY")
        print("="*60)
        
        if self.failures:
            print("\n❌ FAILURES:")
            for failure in self.failures:
                print(f"   {failure}")
                
        if self.warnings:
            print("\n⚠️  WARNINGS:")
            for warning in self.warnings:
                print(f"   {warning}")
                
        if all_passed:
            print("\n🎉 ALL TESTS PASSED - SAFE TO DEPLOY")
        else:
            print(f"\n🚫 {len(self.failures)} TESTS FAILED - DO NOT DEPLOY")
            
        return all_passed

def main():
    """Main test runner."""
    tests = SiteIntegrityTests()
    success = tests.run_all_tests()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()