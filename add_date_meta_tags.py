#!/usr/bin/env python3
"""
Add article:published_time and article:modified_time meta tags to all posts.
"""

import os
import re
from datetime import datetime
from pathlib import Path

EXCLUDED = ['index.html', 'about.html', 'archive.html', '404.html', 'privacy-bn.html', 'privacy-en.html']

def add_date_meta_tags(filepath):
    """Add published/modified date meta tags."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already has article:published_time
        if 'article:published_time' in content:
            return False
        
        # Use today's date
        date_str = datetime.now().strftime('%Y-%m-%d')
        
        # Add meta tags after og:type
        meta_tags = f'''
    <meta property="article:published_time" content="{date_str}T00:00:00+00:00">
    <meta property="article:modified_time" content="{date_str}T00:00:00+00:00">
    <meta property="article:author" content="Rantideb">'''
        
        # Insert after og:type
        pattern = r'(<meta property="og:type" content="[^"]+">)'
        if re.search(pattern, content):
            content = re.sub(pattern, r'\1' + meta_tags, content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
        
    except Exception as e:
        print(f"Error: {e}")
        return False

def main():
    """Add date meta tags to all posts."""
    html_files = list(Path('.').glob('*.html'))
    updated = 0
    
    for html_file in html_files:
        if html_file.name in EXCLUDED or html_file.name.startswith('blog-'):
            continue
        
        if add_date_meta_tags(html_file):
            print(f"✓ {html_file.name}")
            updated += 1
    
    print(f"\n✓ Added date meta tags to {updated} files")

if __name__ == '__main__':
    main()
