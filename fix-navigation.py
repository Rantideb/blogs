#!/usr/bin/env python3
"""
Update navigation to have 4 items with the button after privacy policy
"""

import os
import re
import sys

def update_navigation(filepath):
    """Update navigation structure"""
    
    # Skip these files
    skip_files = ['google32f4039fea15063c.html', 'head.html', 'update-privacy-links.py']
    if any(skip in filepath for skip in skip_files):
        return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False
    
    original_content = content
    
    # Pattern: Find the navigation structure and update it
    # We want to ensure the button is AFTER the privacy link
    pattern = r'(<ul class="navbar-nav flex-column text-start">.*?</ul>)\s*<div class="my-2 my-md-3">\s*<a class="btn btn-primary"[^>]*>আমার নিরালা চরনভুমি</a>\s*</div>'
    
    replacement = r'''\1
				
				<div class="my-2 my-md-3">
				    <a class="btn btn-primary" href="https://www.ranti.dev/" target="_blank">আমার নিরালা চরনভুমি</a>
				</div>'''
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
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
    
    print(f"Checking {len(html_files)} HTML files...\n")
    
    for filename in sorted(html_files):
        filepath = os.path.join(blog_dir, filename)
        total_count += 1
        
        if update_navigation(filepath):
            updated_count += 1
            print(f"✓ Updated: {filename}")
    
    print(f"\n{'='*60}")
    print(f"Summary: Updated {updated_count} out of {total_count} files")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
