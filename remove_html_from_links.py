#!/usr/bin/env python3
"""
Remove .html from internal navigation links
This updates href attributes in HTML files to use clean URLs
"""

import os
import re
from pathlib import Path

def fix_internal_links(filepath):
    """Remove .html from internal navigation links in a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Fix href links: href="filename.html" -> href="filename"
        # Only for internal links (not starting with http:// or https://)
        def fix_href(match):
            full_match = match.group(0)
            url = match.group(1)
            
            # Skip external links
            if url.startswith('http://') or url.startswith('https://'):
                return full_match
            
            # Skip anchors, mailto, tel, etc.
            if url.startswith('#') or url.startswith('mailto:') or url.startswith('tel:'):
                return full_match
            
            # Remove .html extension
            if url.endswith('.html'):
                new_url = url[:-5]  # Remove last 5 characters (.html)
                # Special case: index.html becomes just /
                if new_url == 'index' or new_url.endswith('/index'):
                    new_url = new_url.replace('index', '')
                    if not new_url:
                        new_url = '/'
                return f'href="{new_url}"'
            
            return full_match
        
        # Apply the fix to all href attributes
        content = re.sub(r'href="([^"]*)"', fix_href, content)
        
        # Check if any changes were made
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Main function to process all HTML files"""
    current_dir = Path(__file__).parent
    html_files = list(current_dir.glob("*.html"))
    
    print(f"Found {len(html_files)} HTML files to process")
    print("Removing .html from internal navigation links...")
    print("-" * 60)
    
    updated_count = 0
    
    for html_file in html_files:
        if fix_internal_links(html_file):
            print(f"✓ Updated: {html_file.name}")
            updated_count += 1
        else:
            print(f"  Skipped: {html_file.name} (no changes needed)")
    
    print("-" * 60)
    print(f"\nSummary:")
    print(f"  Total files: {len(html_files)}")
    print(f"  Updated: {updated_count}")
    print(f"  Unchanged: {len(html_files) - updated_count}")
    print("\n✅ Internal link cleanup complete!")
    print("\nNow when users click links, they'll see clean URLs without .html")

if __name__ == "__main__":
    main()
