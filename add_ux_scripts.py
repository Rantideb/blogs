#!/usr/bin/env python3
"""
Add UX Enhancement Scripts to All HTML Files
This script adds the UX enhancement and article schema scripts to all HTML files
"""

import os
import re
from pathlib import Path

def add_ux_scripts(filepath):
    """Add UX enhancement scripts to a single HTML file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Check if scripts are already added
        if 'ux-enhancements.js' in content and 'article-schema.js' in content:
            return False
        
        # Find the closing </body> tag
        body_close_pattern = r'(\s*</body>)'
        
        # Scripts to add before </body>
        scripts_to_add = '''
    <!-- UX Enhancements -->
    <script src="assets/js/ux-enhancements.js"></script>
    <script src="assets/js/article-schema.js"></script>
'''
        
        # Add scripts before </body>
        if re.search(body_close_pattern, content):
            content = re.sub(body_close_pattern, scripts_to_add + r'\1', content, count=1)
        else:
            # If no </body> tag, add at the end
            content += scripts_to_add
        
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
    
    # Exclude head.html as it's a template
    html_files = [f for f in html_files if f.name != 'head.html']
    
    print(f"Found {len(html_files)} HTML files to process")
    print("Adding UX enhancement scripts...")
    print("-" * 60)
    
    updated_count = 0
    
    for html_file in html_files:
        if add_ux_scripts(html_file):
            print(f"✓ Updated: {html_file.name}")
            updated_count += 1
        else:
            print(f"  Skipped: {html_file.name} (already has scripts)")
    
    print("-" * 60)
    print(f"\nSummary:")
    print(f"  Total files: {len(html_files)}")
    print(f"  Updated: {updated_count}")
    print(f"  Unchanged: {len(html_files) - updated_count}")
    print("\n✅ UX enhancements added!")
    print("\nFeatures added:")
    print("  • Lazy loading for images")
    print("  • Reading time calculator")
    print("  • Back-to-top button")
    print("  • Article schema for SEO")

if __name__ == "__main__":
    main()
