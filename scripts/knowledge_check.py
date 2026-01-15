#!/usr/bin/env python3
"""
Knowledge validation script - ensures project knowledge is encoded in the codebase.
Run this to validate that the project follows its own documented patterns.
"""

import os
import re
import yaml
from pathlib import Path
from typing import List, Dict, Tuple

def check_title_placement() -> Tuple[bool, str]:
    """Verify titles are below images in templates."""
    issues = []
    
    templates = ['paintings.md', 'index.md', 'studio.md']
    for template in templates:
        if not os.path.exists(template):
            continue
            
        with open(template, 'r') as f:
            content = f.read()
            
        # Check for correct pattern: img followed by painting-info
        if 'painting-info' not in content:
            issues.append(f"{template}: Missing painting-info class")
            
        # Check for incorrect pattern: painting-header
        if 'painting-header' in content:
            issues.append(f"{template}: Found painting-header (titles above images)")
    
    return len(issues) == 0, "; ".join(issues)

def check_navigation_cleanliness() -> Tuple[bool, str]:
    """Verify navigation follows documented principles."""
    if not os.path.exists('_config.yml'):
        return False, "_config.yml not found"
        
    with open('_config.yml', 'r') as f:
        config = yaml.safe_load(f)
    
    nav_links = config.get('nav_links', [])
    nav_titles = [link['title'] for link in nav_links]
    
    # Check main navigation items
    required_items = ['Paintings', 'Linocuts', 'About', 'CV']
    forbidden_items = ['Studio', 'Terminal']
    
    issues = []
    for item in required_items:
        if item not in nav_titles:
            issues.append(f"Missing required nav item: {item}")
    
    for item in forbidden_items:
        if item in nav_titles:
            issues.append(f"Forbidden nav item found: {item}")
    
    if len(nav_links) > 8:  # Allowing for social links
        issues.append(f"Navigation too long: {len(nav_links)} items")
    
    return len(issues) == 0, "; ".join(issues)

def check_metadata_consistency() -> Tuple[bool, str]:
    """Check that filenames match titles.yml entries."""
    if not os.path.exists('paintings') or not os.path.exists('_data/titles.yml'):
        return False, "Missing paintings directory or titles.yml"
    
    # Load metadata
    with open('_data/titles.yml', 'r') as f:
        titles_data = yaml.safe_load(f) or []
    
    # Create set of metadata entries
    metadata_entries = set()
    for entry in titles_data:
        if 'year' in entry and 'title' in entry:
            metadata_entries.add((entry['year'], entry['title']))
    
    # Check painting files
    paintings_dir = Path('paintings')
    file_entries = set()
    
    for file_path in paintings_dir.glob('*.jpg'):
        filename = file_path.name
        stem = file_path.stem
        
        # Parse filename (space-splitting like Jekyll)
        parts = stem.split(' ')
        if len(parts) >= 2:
            try:
                year = int(parts[0])
                if 1900 <= year <= 2100:
                    title = ' '.join(parts[1:])
                    file_entries.add((year, title))
            except ValueError:
                pass
    
    # Find mismatches
    missing_metadata = file_entries - metadata_entries
    orphaned_metadata = metadata_entries - file_entries
    
    issues = []
    if missing_metadata:
        issues.append(f"Files without metadata: {missing_metadata}")
    if orphaned_metadata:
        issues.append(f"Metadata without files: {orphaned_metadata}")
    
    return len(issues) == 0, "; ".join(issues)

def check_css_architecture() -> Tuple[bool, str]:
    """Verify CSS follows documented patterns."""
    if not os.path.exists('styles.css'):
        return False, "styles.css not found"
    
    with open('styles.css', 'r') as f:
        css_content = f.read()
    
    required_classes = ['.painting', '.painting-info', '.gallery', '.horizontal-list']
    forbidden_classes = ['.painting-header']
    
    issues = []
    for class_name in required_classes:
        if class_name not in css_content:
            issues.append(f"Missing required CSS class: {class_name}")
    
    for class_name in forbidden_classes:
        if class_name in css_content:
            issues.append(f"Forbidden CSS class found: {class_name}")
    
    return len(issues) == 0, "; ".join(issues)

def check_file_structure() -> Tuple[bool, str]:
    """Verify expected file structure exists."""
    required_files = [
        'paintings.md', 'index.md', 'linocuts.md', 'about.md', 'cv.md',
        'styles.css', '_config.yml', '_data/titles.yml',
        'PROJECT_KNOWLEDGE.md', 'CENTERED_AWARENESS_CHECKLIST.md'
    ]
    
    required_dirs = ['paintings', 'linocuts', '_data', 'tests', 'scripts']
    
    issues = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            issues.append(f"Missing required file: {file_path}")
    
    for dir_path in required_dirs:
        if not os.path.exists(dir_path):
            issues.append(f"Missing required directory: {dir_path}")
    
    return len(issues) == 0, "; ".join(issues)

def check_workflow_health() -> Tuple[bool, str]:
    """Check that workflows are configured correctly."""
    workflow_dir = Path('.github/workflows')
    if not workflow_dir.exists():
        return False, "No workflows directory found"
    
    required_workflows = ['test-and-deploy.yml']
    issues = []
    
    for workflow in required_workflows:
        workflow_path = workflow_dir / workflow
        if not workflow_path.exists():
            issues.append(f"Missing workflow: {workflow}")
        else:
            with open(workflow_path, 'r') as f:
                content = f.read()
                
            # Check for deprecated actions
            if 'actions/upload-artifact@v3' in content:
                issues.append(f"Deprecated action in {workflow}")
    
    return len(issues) == 0, "; ".join(issues)

def main():
    """Run all knowledge validation checks."""
    print("🧠 Validating Project Knowledge Encoding...\n")
    
    checks = [
        ("Title Placement", check_title_placement),
        ("Navigation Cleanliness", check_navigation_cleanliness),
        ("Metadata Consistency", check_metadata_consistency),
        ("CSS Architecture", check_css_architecture),
        ("File Structure", check_file_structure),
        ("Workflow Health", check_workflow_health)
    ]
    
    all_passed = True
    for check_name, check_func in checks:
        try:
            passed, message = check_func()
            if passed:
                print(f"✅ {check_name}: OK")
            else:
                print(f"❌ {check_name}: {message}")
                all_passed = False
        except Exception as e:
            print(f"💥 {check_name}: Error - {str(e)}")
            all_passed = False
    
    print("\n" + "="*50)
    if all_passed:
        print("🎉 All knowledge validation checks passed!")
        print("📚 Project knowledge is properly encoded.")
    else:
        print("🚨 Some knowledge validation checks failed!")
        print("📋 Review PROJECT_KNOWLEDGE.md for patterns.")
    
    return all_passed

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)