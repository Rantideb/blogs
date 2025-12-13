#!/usr/bin/env python3
"""
Add cookie settings CSS to all HTML pages that use privacy-consent.js
"""

import os
import re
from pathlib import Path

# Configuration
BLOG_DIR = "/Users/rantideb/Downloads/blogs"
CSS_LINK = '    <!-- Cookie Settings CSS -->\n    <link rel="stylesheet" href="assets/css/cookie-settings.css">\n'
MARKER = 'privacy-consent.js'

def should_process_file(filepath):
    """Check if file should be processed"""
    # Skip backup files and non-HTML files
    if filepath.name.startswith('.') or not filepath.name.endswith('.html'):
        return False
    if '_old' in filepath.name or 'backup' in filepath.name.lower():
        return False
    return True

def has_privacy_consent_js(content):
    """Check if file includes privacy-consent.js"""
    return 'privacy-consent.js' in content

def has_cookie_settings_css(content):
    """Check if file already has cookie-settings.css"""
    return 'cookie-settings.css' in content

def add_css_link(content):
    """Add CSS link before privacy-consent.js script"""
    
    # Find the line with privacy-consent.js
    lines = content.split('\n')
    new_lines = []
    css_added = False
    
    for i, line in enumerate(lines):
        # Check if this line has privacy-consent.js script tag
        if 'privacy-consent.js' in line and not css_added:
            # Add CSS link before the script tag
            # Detect indentation
            indent = len(line) - len(line.lstrip())
            indent_str = ' ' * indent
            
            # Add CSS link with same indentation
            new_lines.append(f'{indent_str}<!-- Cookie Settings CSS -->')
            new_lines.append(f'{indent_str}<link rel="stylesheet" href="assets/css/cookie-settings.css">')
            new_lines.append('')  # Empty line for spacing
            css_added = True
        
        new_lines.append(line)
    
    return '\n'.join(new_lines)

def process_files():
    """Process all HTML files in the blog directory"""
    blog_path = Path(BLOG_DIR)
    html_files = list(blog_path.glob('*.html'))
    
    processed = 0
    skipped = 0
    already_has_css = 0
    no_privacy_js = 0
    
    for filepath in html_files:
        if not should_process_file(filepath):
            skipped += 1
            continue
        
        # Read file content
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception as e:
            print(f"Error reading {filepath.name}: {e}")
            skipped += 1
            continue
        
        # Check if file has privacy-consent.js
        if not has_privacy_consent_js(content):
            no_privacy_js += 1
            continue
        
        # Check if CSS already added
        if has_cookie_settings_css(content):
            already_has_css += 1
            continue
        
        # Add CSS link
        new_content = add_css_link(content)
        
        # Write back
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            processed += 1
            print(f"✓ Updated: {filepath.name}")
        except Exception as e:
            print(f"Error writing {filepath.name}: {e}")
            skipped += 1
    
    print(f"\n Summary:")
    print(f"  Processed: {processed}")
    print(f"  Already had CSS: {already_has_css}")
    print(f"  No privacy-consent.js: {no_privacy_js}")
    print(f"  Skipped: {skipped}")
    print(f"  Total HTML files: {len(html_files)}")

if __name__ == "__main__":
    process_files()
