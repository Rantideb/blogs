#!/usr/bin/env python3
"""
Bulk update all HTML files to add privacy policy link and cookie consent script
"""

import os
import re
import sys

def update_html_file(filepath):
    """Update a single HTML file with privacy link and consent script"""
    
    # Skip the privacy policy pages themselves and special files
    skip_files = ['privacy-en.html', 'privacy-bn.html', 'google32f4039fea15063c.html', 'head.html']
    if any(skip in filepath for skip in skip_files):
        return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False
    
    original_content = content
    modified = False
    
    # Pattern 1: Add privacy link after "প্রলাপের ভুতপত্তি" if not already present
    privacy_link_pattern = r'(<li class="nav-item">\s*<a class="nav-link"[^>]*>.*?প্রলাপের ভুতপত্তি.*?</a>\s*</li>)'
    
    if re.search(privacy_link_pattern, content, re.DOTALL):
        # Check if privacy link already exists
        if 'id="privacy-policy-link"' not in content and 'Privacy Policy' not in content and 'গোপনীয়তা নীতি' not in content:
            # Add privacy link
            privacy_link_html = r'''\1

					<li class="nav-item">
					    <a class="nav-link" href="privacy-en.html" id="privacy-policy-link"><i class="fas fa-shield-alt fa-fw me-2"></i><span class="privacy-text">Privacy Policy</span></a>
					</li>'''
            
            content = re.sub(privacy_link_pattern, privacy_link_html, content, count=1, flags=re.DOTALL)
            modified = True
    
    # Pattern 2: Add privacy-consent.js script before </body> if not already present
    if 'privacy-consent.js' not in content:
        # Find the last script tag before </body>
        body_close_pattern = r'(</body>\s*</html>)'
        
        if re.search(body_close_pattern, content, re.DOTALL | re.IGNORECASE):
            consent_script = r'''
    <!-- Privacy & Cookie Consent -->
    <script src="assets/js/privacy-consent.js"></script>

\1'''
            content = re.sub(body_close_pattern, consent_script, content, count=1, flags=re.DOTALL | re.IGNORECASE)
            modified = True
    
    # Write back if modified
    if modified and content != original_content:
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"Error writing {filepath}: {e}")
            return False
    
    return False

def main():
    """Main function to update all HTML files"""
    blog_dir = '/Users/rantideb/Downloads/blogs'
    
    if not os.path.exists(blog_dir):
        print(f"Directory not found: {blog_dir}")
        sys.exit(1)
    
    updated_count = 0
    total_count = 0
    
    # Get all HTML files in the directory
    html_files = [f for f in os.listdir(blog_dir) if f.endswith('.html')]
    
    print(f"Found {len(html_files)} HTML files")
    print("Updating files...\n")
    
    for filename in sorted(html_files):
        filepath = os.path.join(blog_dir, filename)
        total_count += 1
        
        if update_html_file(filepath):
            updated_count += 1
            print(f"✓ Updated: {filename}")
        else:
            print(f"  Skipped: {filename}")
    
    print(f"\n{'='*60}")
    print(f"Summary: Updated {updated_count} out of {total_count} files")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
