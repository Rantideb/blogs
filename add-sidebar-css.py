#!/usr/bin/env python3
"""
Add sidebar scroll fix CSS to all HTML files
"""

import os
import re
import sys

def add_sidebar_css(filepath):
    """Add sidebar scroll fix CSS to HTML file"""
    
    # Skip these files
    skip_files = ['google32f4039fea15063c.html', 'head.html', 'index.html']
    if any(skip in filepath for skip in skip_files):
        return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False
    
    original_content = content
    
    # Check if already added
    if 'sidebar-scroll-fix.css' in content:
        return False
    
    # Find the theme CSS link and add our CSS after it
    pattern = r'(<link id="theme-style" rel="stylesheet" href="assets/css/theme-\d+\.css">)'
    
    if re.search(pattern, content):
        replacement = r'''\1
    
    <!-- Sidebar Scroll Fix -->
    <link rel="stylesheet" href="assets/css/sidebar-scroll-fix.css">'''
        
        content = re.sub(pattern, replacement, content, count=1)
    
    # Write back if modified
    if content != original_content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"Error writing {filepath}: {e}")
            return False
    
    return False

def main():
    """Main function"""
    blog_dir = '/Users/rantideb/Downloads/blogs'
    
    if not os.path.exists(blog_dir):
        print(f"Directory not found: {blog_dir}")
        sys.exit(1)
    
    updated_count = 0
    total_count = 0
    
    html_files = [f for f in os.listdir(blog_dir) if f.endswith('.html')]
    
    print(f"Adding sidebar scroll fix to {len(html_files)} HTML files...\n")
    
    for filename in sorted(html_files):
        filepath = os.path.join(blog_dir, filename)
        total_count += 1
        
        if add_sidebar_css(filepath):
            updated_count += 1
            print(f"✓ Updated: {filename}")
        else:
            print(f"  Skipped: {filename}")
    
    print(f"\n{'='*60}")
    print(f"Summary: Updated {updated_count} out of {total_count} files")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
