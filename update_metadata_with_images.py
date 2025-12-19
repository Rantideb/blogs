#!/usr/bin/env python3
"""
Extract complete post information from HTML files and update posts-metadata.json
Extracts: image, title, meta tags, and full excerpt
"""

import json
import re
import os
from pathlib import Path

def extract_post_info(html_file):
    """Extract image, title, meta, and excerpt from HTML file."""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract image from og:image or blog-banner
        image = None
        
        # Try og:image first
        og_image = re.search(r'<meta property="og:image" content="([^"]+)"', content)
        if og_image:
            image = og_image.group(1)
        
        # Try twitter:image
        if not image:
            twitter_image = re.search(r'<meta name="twitter:image" content="([^"]+)"', content)
            if twitter_image:
                image = twitter_image.group(1)
        
        # Try blog-banner img
        if not image:
            banner = re.search(r'<figure class="blog-banner">.*?<img[^>]+src="([^"]+)"', content, re.DOTALL)
            if banner:
                image = banner.group(1)
        
        # Extract title
        title = None
        title_match = re.search(r'<title>([^<]+)</title>', content)
        if title_match:
            title = title_match.group(1).strip()
        
        # Extract meta tags (date and category from blog list pages)
        # These are in the format: <span class="date">দুঃখের পরিহাস</span><span class="time">উপেক্ষিত ক্রেঙ্কার</span>
        meta_date = ""
        meta_time = ""
        
        # Extract long excerpt from intro div
        excerpt = None
        
        # Look for div class="intro" with paragraph
        intro_match = re.search(r'<div class="intro">.*?<p[^>]*>(.*?)</p>', content, re.DOTALL)
        if intro_match:
            excerpt = intro_match.group(1).strip()
            # Remove extra whitespace but keep Bengali text formatting
            excerpt = re.sub(r'\s+', ' ', excerpt)
            excerpt = re.sub(r'<[^>]+>', '', excerpt)  # Remove any remaining HTML tags
        
        # If no intro div, try meta description
        if not excerpt:
            meta_desc = re.search(r'<meta name="description" content="([^"]+)"', content)
            if meta_desc:
                excerpt = meta_desc.group(1).strip()
        
        # If still no excerpt, try first paragraph in blog-post-body
        if not excerpt:
            first_p = re.search(r'<div class="blog-post-body">.*?<p[^>]*>(.*?)</p>', content, re.DOTALL)
            if first_p:
                excerpt = first_p.group(1).strip()
                excerpt = re.sub(r'<[^>]+>', '', excerpt)
                excerpt = re.sub(r'\s+', ' ', excerpt)
        
        return {
            'image': image,
            'title': title,
            'excerpt': excerpt,
            'meta_date': meta_date,
            'meta_time': meta_time
        }
    
    except Exception as e:
        print(f"Error processing {html_file}: {e}")
        return None

def main():
    """Update posts-metadata.json with complete post information."""
    
    # Load existing metadata
    metadata_file = 'assets/data/posts-metadata.json'
    with open(metadata_file, 'r', encoding='utf-8') as f:
        posts = json.load(f)
    
    print(f"Updating {len(posts)} posts with images and excerpts...\n")
    
    updated_count = 0
    for post in posts:
        url = post['url']
        
        if not os.path.exists(url):
            print(f"⊘ Skipped {url} (file not found)")
            continue
        
        info = extract_post_info(url)
        if info:
            # Update image
            if info['image']:
                post['image'] = info['image']
            
            # Update excerpt - prefer longer extracted excerpt
            if info['excerpt']:
                if len(info['excerpt']) > len(post.get('description', '')):
                    post['excerpt'] = info['excerpt']
                else:
                    post['excerpt'] = post.get('description', info['excerpt'])
            
            # Keep short description for SEO
            if not post.get('description'):
                post['description'] = info['excerpt'][:200] if info['excerpt'] else ''
            
            # Add meta fields
            post['meta_date'] = info.get('meta_date', '')
            post['meta_time'] = info.get('meta_time', '')
            
            print(f"✓ {url}")
            if info['image']:
                print(f"  Image: {info['image']}")
            if info['excerpt']:
                print(f"  Excerpt: {len(info['excerpt'])} chars")
            updated_count += 1
        else:
            print(f"⊘ Failed to extract info from {url}")
    
    # Save updated metadata
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    
    print(f"\n✓ Updated {updated_count} posts in {metadata_file}")

if __name__ == '__main__':
    main()
