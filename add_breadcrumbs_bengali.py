#!/usr/bin/env python3
"""
Add breadcrumbs and BreadcrumbList schema to Bengali blog posts.
"""

import os
import re
from pathlib import Path

# List of Bengali blog post files (exclude DevOps posts which already have breadcrumbs)
DEVOPS_POSTS = [
    'devops-projects-for-beginners.html',
    'github-actions-cicd-tutorial.html',
    'docker-tutorial-for-beginners.html',
    'cloud-fundamentals-for-devops.html',
    'devops-engineer-roadmap-guide.html'
]

EXCLUDED_FILES = [
    'index.html', 'index-1.html', 'index_old.html',
    'about.html', 'archive.html', 'search-results.html',
    'blog.html', 'blog-post.html', 'head.html', 'root.html',
    '404.html', 'privacy-bn.html', 'privacy-en.html',
    'test-reading-time.html'
] + DEVOPS_POSTS

def create_breadcrumb_html(page_title, page_url):
    """Create HTML breadcrumb navigation."""
    return f'''
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="index.html">হোম</a></li>
                        <li class="breadcrumb-item"><a href="archive.html">আর্কাইভ</a></li>
                        <li class="breadcrumb-item active" aria-current="page">{page_title}</li>
                    </ol>
                </nav>
'''

def create_breadcrumb_schema(page_title, page_url):
    """Create BreadcrumbList JSON-LD schema."""
    return f'''
    <!-- Breadcrumb Schema -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{
          "@type": "ListItem",
          "position": 1,
          "name": "হোম",
          "item": "https://textandtech.me/"
        }},
        {{
          "@type": "ListItem",
          "position": 2,
          "name": "আর্কাইভ",
          "item": "https://textandtech.me/archive.html"
        }},
        {{
          "@type": "ListItem",
          "position": 3,
          "name": "{page_title}",
          "item": "https://textandtech.me/{page_url}"
        }}
      ]
    }}
    </script>
'''

def extract_title(content):
    """Extract title from HTML content."""
    match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
    if match:
        return match.group(1).strip()
    return "Blog Post"

def add_breadcrumbs_to_file(filepath):
    """Add breadcrumbs to a Bengali blog post."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has breadcrumbs
        if 'breadcrumb' in content.lower():
            return False
        
        filename = os.path.basename(filepath)
        page_title = extract_title(content)
        
        # Add breadcrumb schema in <head> before </head>
        schema = create_breadcrumb_schema(page_title, filename)
        if '</head>' in content:
            content = content.replace('</head>', f'{schema}\n</head>')
        
        # Add HTML breadcrumbs after <article class="blog-post
        breadcrumb_html = create_breadcrumb_html(page_title, filename)
        
        # Find the article opening and container div
        pattern = r'(<article class="blog-post[^>]*>[\s\S]*?<div class="container[^>]*>)'
        if re.search(pattern, content):
            content = re.sub(
                pattern,
                r'\1' + breadcrumb_html,
                content,
                count=1
            )
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    """Add breadcrumbs to all Bengali blog posts."""
    current_dir = Path('.')
    html_files = list(current_dir.glob('*.html'))
    
    updated_count = 0
    skipped_count = 0
    
    for html_file in html_files:
        filename = html_file.name
        
        # Skip excluded files
        if filename in EXCLUDED_FILES:
            continue
        
        print(f"Processing: {filename}")
        if add_breadcrumbs_to_file(html_file):
            updated_count += 1
            print(f"  ✓ Added breadcrumbs")
        else:
            skipped_count += 1
            print(f"  ⊘ Skipped (already has breadcrumbs or invalid structure)")
    
    print(f"\n✓ Updated: {updated_count} files")
    print(f"⊘ Skipped: {skipped_count} files")

if __name__ == '__main__':
    main()
