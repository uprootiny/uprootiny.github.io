#!/usr/bin/env python3
"""
Auto-parse images and update titles.yml metadata.
Uses Jekyll-compatible parsing logic to ensure consistency.
"""

import os
import re
import yaml
from pathlib import Path
from typing import List, Dict, Set, Tuple, Optional

# Configuration
DEFAULT_DIMENSIONS = "220x120cm"
SUPPORTED_EXTENSIONS = {'.jpg', '.jpeg', '.png'}
IMAGE_DIRECTORIES = ['paintings', 'linocuts', 'installation2025']
TITLES_FILE = '_data/titles.yml'

def parse_filename_flexible(filename: str, directory: str) -> Tuple[Optional[int], str]:
    """
    Parse filename flexibly - extract what we can, provide appropriate defaults.
    Different strategies for different directories.
    """
    # Remove extension
    name_without_ext = os.path.splitext(filename)[0]
    
    # Strategy 1: Standard "YYYY Title" format
    parts = name_without_ext.split(' ')
    if parts and len(parts) >= 2:
        try:
            potential_year = int(parts[0])
            if 1900 <= potential_year <= 2100:
                title = ' '.join(parts[1:])
                return potential_year, title
        except ValueError:
            pass
    
    # Strategy 2: Look for 4-digit year anywhere in filename
    import re
    year_matches = re.findall(r'\b(19|20)\d{2}\b', name_without_ext)
    if year_matches:
        year = int(year_matches[0])  # Use first valid year found
        # Remove year from title
        title = re.sub(r'\b' + str(year) + r'\b', '', name_without_ext).strip()
        title = re.sub(r'\s+', ' ', title)  # Clean up multiple spaces
        if not title:
            title = f"untitled {year}"
        return year, title
    
    # Strategy 3: No year found - handle based on directory
    title = name_without_ext
    
    if directory == 'paintings':
        # For paintings, use current year as fallback
        from datetime import datetime
        current_year = datetime.now().year
        print(f"⚠ No year found in painting '{filename}', using {current_year}")
        return current_year, title
    else:
        # For linocuts, installations, etc. - no automatic year assignment
        print(f"⚠ No year found in '{filename}' ({directory}), using None")
        return None, title

def find_image_files() -> List[Tuple[str, str, Optional[int], str]]:
    """
    Find all image files and parse them.
    Returns: [(directory, filename, year, title), ...]
    """
    images = []
    
    for directory in IMAGE_DIRECTORIES:
        if not os.path.exists(directory):
            continue
            
        for filename in os.listdir(directory):
            file_path = os.path.join(directory, filename)
            
            # Skip directories and non-image files
            if not os.path.isfile(file_path):
                continue
                
            ext = os.path.splitext(filename)[1].lower()
            if ext not in SUPPORTED_EXTENSIONS:
                continue
            
            year, title = parse_filename_flexible(filename, directory)
            images.append((directory, filename, year, title))
            year_display = year if year is not None else "no year"
            print(f"✓ Parsed: {filename} -> {year_display}, '{title}'")
    
    return images

def load_existing_titles() -> List[Dict]:
    """Load existing titles.yml data."""
    if not os.path.exists(TITLES_FILE):
        print(f"Creating new {TITLES_FILE}")
        return []
    
    try:
        with open(TITLES_FILE, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f) or []
        print(f"✓ Loaded {len(data)} existing entries from {TITLES_FILE}")
        return data
    except Exception as e:
        print(f"⚠ Error loading {TITLES_FILE}: {e}")
        return []

def find_missing_entries(images: List[Tuple[str, str, Optional[int], str]], 
                        existing_titles: List[Dict]) -> List[Dict]:
    """Find images that don't have entries in titles.yml."""
    
    # Create set of existing (year, title) pairs
    existing_pairs = set()
    for entry in existing_titles:
        if 'year' in entry and 'title' in entry:
            existing_pairs.add((entry['year'], entry['title']))
    
    missing = []
    
    for directory, filename, year, title in images:
        # Only process paintings directory for main titles.yml
        if directory != 'paintings':
            continue
        
        # Skip if no year could be determined 
        if year is None:
            print(f"⚠ Skipping '{filename}' - no year determined")
            continue
            
        if (year, title) not in existing_pairs:
            missing.append({
                'year': year,
                'title': title,
                'dimensions': DEFAULT_DIMENSIONS,
                'filename': filename  # For debugging
            })
            print(f"+ Missing entry: {year} '{title}'")
    
    return missing

def update_titles_file(existing_titles: List[Dict], missing_entries: List[Dict]) -> bool:
    """Update titles.yml with missing entries. Returns True if changes made."""
    
    if not missing_entries:
        print("✓ No missing entries found")
        return False
    
    # Combine existing and new entries
    all_entries = existing_titles.copy()
    
    for entry in missing_entries:
        # Remove filename field (used only for debugging)
        clean_entry = {k: v for k, v in entry.items() if k != 'filename'}
        all_entries.append(clean_entry)
    
    # Sort by year, then by title
    all_entries.sort(key=lambda x: (x.get('year', 0), x.get('title', '')))
    
    # Write back to file
    try:
        os.makedirs(os.path.dirname(TITLES_FILE), exist_ok=True)
        
        with open(TITLES_FILE, 'w', encoding='utf-8') as f:
            yaml.dump(all_entries, f, default_flow_style=False, 
                     allow_unicode=True, sort_keys=False)
        
        print(f"✓ Updated {TITLES_FILE} with {len(missing_entries)} new entries")
        return True
        
    except Exception as e:
        print(f"✗ Error writing {TITLES_FILE}: {e}")
        return False

def validate_consistency(images: List[Tuple[str, str, Optional[int], str]], 
                        titles: List[Dict]) -> List[str]:
    """Validate consistency between filenames and titles.yml."""
    
    warnings = []
    
    # Create lookup for existing titles
    title_lookup = {}
    for entry in titles:
        if 'year' in entry and 'title' in entry:
            key = (entry['year'], entry['title'])
            title_lookup[key] = entry
    
    # Check each painting file
    for directory, filename, year, title in images:
        if directory != 'paintings':
            continue
        
        # Skip files without determined years
        if year is None:
            continue
            
        key = (year, title)
        
        if key in title_lookup:
            # Entry exists - could check for inconsistencies here
            pass
        else:
            # This should have been caught by find_missing_entries
            warnings.append(f"Inconsistency: {filename} not found in titles.yml")
    
    return warnings

def main():
    """Main execution function."""
    print("🎨 Auto-parsing images...")
    
    # Check if we're forcing an update
    force_update = os.environ.get('FORCE_UPDATE', 'false').lower() == 'true'
    if force_update:
        print("🔄 Force update mode enabled")
    
    try:
        # Find all image files
        images = find_image_files()
        print(f"📁 Found {len(images)} total image files")
        
        # Load existing metadata
        existing_titles = load_existing_titles()
        
        # Find missing entries
        missing_entries = find_missing_entries(images, existing_titles)
        
        # Validate consistency
        warnings = validate_consistency(images, existing_titles)
        for warning in warnings:
            print(f"⚠ {warning}")
        
        # Update titles.yml if needed
        changes_made = update_titles_file(existing_titles, missing_entries)
        
        if changes_made:
            print("✅ Successfully updated metadata")
        else:
            print("✅ All images already have metadata entries")
            
        # Summary
        paintings_count = len([img for img in images if img[0] == 'paintings'])
        print(f"\n📊 Summary:")
        print(f"   • Paintings: {paintings_count}")
        print(f"   • Existing entries: {len(existing_titles)}")
        print(f"   • New entries added: {len(missing_entries)}")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        exit(1)

if __name__ == '__main__':
    main()