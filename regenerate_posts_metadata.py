#!/usr/bin/env python3
"""
Generate complete posts metadata from ALL HTML files in the directory.
Extracts proper title from <title> tag, not filename.
"""

import json
import re
import os
from pathlib import Path
from bs4 import BeautifulSoup

# Exclude non-post files
EXCLUDED_FILES = [
    'index.html', 'index-1.html', 'index_old.html',
    'about.html', 'archive.html', 'search-results.html',
    'blog.html', 'blog-post.html', 'head.html', 'root.html',
    '404.html', 'privacy-bn.html', 'privacy-en.html',
    'test-reading-time.html', 'google32f4039fea15063c.html'
]

# Also exclude blog pagination pages and DevOps main pages  
EXCLUDED_PATTERNS = [
    r'^blog-\d+\.html$',  # blog-1.html, blog-2.html, etc.
]

def should_exclude(filename):
    """Check if file should be excluded."""
    if filename in EXCLUDED_FILES:
        return True
    for pattern in EXCLUDED_PATTERNS:
        if re.match(pattern, filename):
            return True
    return False

def clean_text(text):
    """Clean up extracted text."""
    if not text:
        return ""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove HTML entities
    text = text.replace('&nbsp;', ' ')
    return text.strip()

def extract_post_info(html_file):
    """Extract complete information from HTML file."""
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Extract title from <title> tag (CORRECT WAY)
        title_tag = soup.find('title')
        title = clean_text(title_tag.get_text()) if title_tag else os.path.basename(html_file)
        
        # Extract meta description
        meta_desc = soup.find('meta', {'name': 'description'})
        description = clean_text(meta_desc['content']) if meta_desc and meta_desc.get('content') else ''
        
        # Extract image from og:image or twitter:image
        image = None
        og_image = soup.find('meta', {'property': 'og:image'})
        if og_image and og_image.get('content'):
            image = og_image['content']
        else:
            twitter_image = soup.find('meta', {'name': 'twitter:image'})
            if twitter_image and twitter_image.get('content'):
                image = twitter_image['content']
        
        # Extract long excerpt from first paragraph in blog-post-body
        excerpt = description  # Default to meta description
        
        blog_body = soup.find('div', class_='blog-post-body')
        if blog_body:
            first_p = blog_body.find('p')
            if first_p:
                p_text = clean_text(first_p.get_text())
                if len(p_text) > len(excerpt):
                    excerpt = p_text
        
        # Limit excerpt length for performance
        if len(excerpt) > 500:
            excerpt = excerpt[:500] + '...'
        
        return {
            'url': os.path.basename(html_file),
            'title': title,
            'description': description[:200] if description else excerpt[:200],
            'image': image,
            'excerpt': excerpt,
            'meta_date': '',
            'meta_time': ''
        }
    
    except Exception as e:
        print(f"Error processing {html_file}: {e}")
        return None

def main():
    """Generate complete posts metadata."""
    
    current_dir = Path('.')
    html_files = sorted(current_dir.glob('*.html'))
    
    posts = []
    skipped = []
    
    print(f"Scanning {len(html_files)} HTML files...\n")
    
    for html_file in html_files:
        filename = html_file.name
        
        if should_exclude(filename):
            skipped.append(filename)
            continue
        
        print(f"Processing: {filename}")
        info = extract_post_info(html_file)
        
        if info:
            posts.append(info)
            print(f"  ✓ Title: {info['title'][:50]}...")
            if info['image']:
                print(f"  ✓ Image: {info['image']}")
        else:
            print(f"  ⊘ Failed")
    
    # Save metadata
    metadata_file = 'assets/data/posts-metadata.json'
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    
    print(f"\n" + "="*60)
    print(f"✓ Successfully processed: {len(posts)} posts")
    print(f"⊘ Skipped: {len(skipped)} files")
    print(f"📁 Saved to: {metadata_file}")
    print("="*60)

if __name__ == '__main__':
    main()
