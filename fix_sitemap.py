#!/usr/bin/env python3
"""
Script to fix sitemap.xml: remove duplicates, normalize URLs, and ensure proper formatting.
"""

import re
from pathlib import Path

def fix_sitemap():
    sitemap_path = Path("/Users/rantideb/Downloads/blogs/sitemap.xml")
    
    if not sitemap_path.exists():
        print("sitemap.xml not found")
        return

    with open(sitemap_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract all URLs
    urls = re.findall(r'<loc>(.*?)</loc>', content)
    
    # Normalize URLs
    normalized_urls = set()
    for url in urls:
        url = url.strip()
        
        # Skip the sitemap itself
        if url.endswith('sitemap.xml'):
            continue
            
        # Handle root
        if url == 'https://textandtech.me/' or url == 'https://textandtech.me' or url.endswith('/index.html'):
            normalized_urls.add('https://textandtech.me/')
            continue
            
        # Ensure .html extension for files
        if not url.endswith('.html') and not url.endswith('/'):
            url += '.html'
            
        normalized_urls.add(url)

    # Sort URLs for consistency
    sorted_urls = sorted(list(normalized_urls))
    
    # Generate new XML content
    new_content = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    
    for url in sorted_urls:
        priority = "0.7"
        changefreq = "monthly"
        
        if url == 'https://textandtech.me/':
            priority = "1.0"
            changefreq = "weekly"
        elif 'about.html' in url or 'archive.html' in url:
            priority = "0.8"
            changefreq = "monthly"
            
        entry = f"""    <url>
        <loc>{url}</loc>
        <changefreq>{changefreq}</changefreq>
        <priority>{priority}</priority>
    </url>"""
        new_content.append(entry)
        
    new_content.append('</urlset>')
    
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_content))
        
    print(f"✓ Fixed sitemap.xml: {len(sorted_urls)} unique URLs")

if __name__ == "__main__":
    fix_sitemap()
