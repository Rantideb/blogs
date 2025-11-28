#!/usr/bin/env python3
"""
Script to generate a rich JSON index of all blog posts with metadata.
"""

import json
import re
from pathlib import Path
from datetime import datetime

def extract_metadata(filepath):
    """Extract title, description, and date from HTML content."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract Title
        title_match = re.search(r'<title>(.*?)</title>', content)
        title = title_match.group(1).split('|')[0].strip() if title_match else filepath.stem.replace('-', ' ').title()
        
        # Extract Description
        desc_match = re.search(r'<meta name="description" content="(.*?)">', content)
        description = desc_match.group(1) if desc_match else ""
        
        # Extract Date (if available in meta or content)
        # Try to find a date pattern like "Published 2 days ago" or similar if it was static
        # But for now, we might just use file modification time or a placeholder
        # Let's try to find a date in the content if possible, otherwise skip
        
        return {
            "url": filepath.name,
            "title": title,
            "description": description
        }
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None

def main():
    base_dir = Path("/Users/rantideb/Downloads/blogs")
    output_file = base_dir / "assets/data/posts-metadata.json"
    
    # Ensure assets/data exists
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    # List of known blog posts (can be derived from posts-index.json or scanned)
    # Using the list from posts-index.json plus others we know
    with open(base_dir / "posts-index.json", 'r') as f:
        post_files = json.load(f)
        
    posts_data = []
    
    for filename in post_files:
        filepath = base_dir / filename
        if filepath.exists():
            metadata = extract_metadata(filepath)
            if metadata:
                posts_data.append(metadata)
    
    # Sort by title for now, or we could add dates later
    posts_data.sort(key=lambda x: x['title'])
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(posts_data, f, ensure_ascii=False, indent=2)
        
    print(f"Generated metadata for {len(posts_data)} posts in {output_file}")

if __name__ == "__main__":
    main()
