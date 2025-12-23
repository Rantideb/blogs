import os
import re
from glob import glob
from datetime import datetime
import xml.etree.ElementTree as ET
from xml.dom import minidom

# --- Configuration ---
BASE_URL = "https://textandtech.me"
SITE_TITLE = "Text and Tech"
SITE_DESCRIPTION = "Rantideb's personal blog on technology, philosophy, and literature."
AUTHOR = "Rantideb"
EXCLUDED_FILES = [
    "index.html", "about.html", "404.html", "search-results.html", 
    "archive.html", "privacy-bn.html", "privacy-en.html", 
    "google32f4039fea15063c.html", "blog.html", "head.html", "root.html", "sathi.html" 
]
# Exclude pagination pages
EXCLUDE_PATTERNS = [r"blog-\d+\.html", r"index-\d+\.html", r"index_old.html"]

def should_exclude(filename):
    if filename in EXCLUDED_FILES:
        return True
    for pattern in EXCLUDE_PATTERNS:
        if re.match(pattern, filename):
            return True
    return False

def generate_feed():
    html_files = glob("*.html")
    items = []
    
    print(f"Scanning {len(html_files)} files for RSS feed...")

    for file_path in html_files:
        if should_exclude(file_path):
            continue
            
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Extract Metadata
        title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
        title = title_match.group(1).split("|")[0].strip() if title_match else "No Title"
        
        desc_match = re.search(r'<meta name="description" content="(.*?)">', content, re.IGNORECASE | re.DOTALL)
        description = desc_match.group(1).strip() if desc_match else ""
        
        date_match = re.search(r'<meta property="article:published_time" content="(.*?)">', content, re.IGNORECASE)
        pub_date = date_match.group(1) if date_match else None
        
        if not pub_date:
            # Fallback to file modification time if no date meta
            # Or skip? Better to include with mtime for now to populate feed
            mtime = os.path.getmtime(file_path)
            pub_date = datetime.fromtimestamp(mtime).strftime("%Y-%m-%dT%H:%M:%S+00:00")
            
        # Format date for RSS (RFC 822)
        # 2025-12-19T00:00:00+00:00 -> Fri, 19 Dec 2025 00:00:00 GMT
        try:
            dt = datetime.fromisoformat(pub_date.replace("Z", "+00:00"))
            rss_date = dt.strftime("%a, %d %b %Y %H:%M:%S +0000")
        except ValueError:
             rss_date = pub_date # Fallback
            
        items.append({
            "title": title,
            "link": f"{BASE_URL}/{file_path}",
            "description": description,
            "pubDate": rss_date,
            "guid": f"{BASE_URL}/{file_path}"
        })

    # Sort items by date (descending)
    # Using simple string sort on pubDate might be wrong format, let's rely on insertion order or sort if possible
    # Ideally should parse date to sort.
    # We'll skip complex sorting for now or sort by filename/mtime implicit?
    
    # Build XML
    ET.register_namespace("atom", "http://www.w3.org/2005/Atom")
    rss = ET.Element("rss", {"version": "2.0", "xmlns:atom": "http://www.w3.org/2005/Atom"})
    channel = ET.SubElement(rss, "channel")
    
    ET.SubElement(channel, "title").text = SITE_TITLE
    ET.SubElement(channel, "link").text = BASE_URL
    ET.SubElement(channel, "description").text = SITE_DESCRIPTION
    ET.SubElement(channel, "language").text = "en-us"
    ET.SubElement(channel, "lastBuildDate").text = datetime.now().strftime("%a, %d %b %Y %H:%M:%S +0000")
    
    # Atom Link
    atom_link = ET.Element("atom:link", {
        "href": f"{BASE_URL}/feed.xml", 
        "rel": "self", 
        "type": "application/rss+xml"
    })
    channel.append(atom_link)
    
    for item in items:
        item_node = ET.SubElement(channel, "item")
        ET.SubElement(item_node, "title").text = item["title"]
        ET.SubElement(item_node, "link").text = item["link"]
        ET.SubElement(item_node, "description").text = item["description"]
        ET.SubElement(item_node, "pubDate").text = item["pubDate"]
        ET.SubElement(item_node, "guid", isPermaLink="true").text = item["guid"]
        
    # Pretty Print
    xmlstr = minidom.parseString(ET.tostring(rss)).toprettyxml(indent="  ")
    
    # Fix Atom namespace in simple ElementTree usage
    xmlstr = xmlstr.replace('xmlns__atom', 'xmlns:atom')
    
    with open("feed.xml", "w", encoding="utf-8") as f:
        f.write(xmlstr)
        
    print(f"✅ Generated feed.xml with {len(items)} items")

if __name__ == "__main__":
    generate_feed()
