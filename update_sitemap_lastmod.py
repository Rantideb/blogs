#!/usr/bin/env python3
"""
Add lastmod tags to sitemap.xml to prompt Google to recrawl the site.
"""

import xml.etree.ElementTree as ET
from datetime import datetime

def add_lastmod_to_sitemap(sitemap_file='sitemap.xml'):
    """Add lastmod tags to all URLs in the sitemap."""
    
    # Parse the sitemap
    tree = ET.parse(sitemap_file)
    root = tree.getroot()
    
    # Define the namespace
    namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    
    # Get today's date in W3C format
    today = datetime.now().strftime('%Y-%m-%d')
    
    # Process each URL
    urls_updated = 0
    for url in root.findall('ns:url', namespace):
        # Check if lastmod already exists
        lastmod = url.find('ns:lastmod', namespace)
        
        if lastmod is None:
            # Add lastmod as the second element (after loc)
            loc = url.find('ns:loc', namespace)
            loc_index = list(url).index(loc)
            
            lastmod = ET.Element('lastmod')
            lastmod.text = today
            url.insert(loc_index + 1, lastmod)
            urls_updated += 1
        else:
            # Update existing lastmod
            lastmod.text = today
            urls_updated += 1
    
    # Write the updated sitemap
    tree.write(sitemap_file, encoding='UTF-8', xml_declaration=True)
    
    print(f"✓ Updated {urls_updated} URLs in {sitemap_file}")
    print(f"  Last modified date set to: {today}")
    print("\nNext steps:")
    print("1. Deploy the updated sitemap to your website")
    print("2. Go to Google Search Console")
    print("3. Navigate to Sitemaps section")
    print("4. Resubmit your sitemap URL")
    print("5. Request indexing for important pages via URL Inspection tool")

if __name__ == '__main__':
    add_lastmod_to_sitemap()
