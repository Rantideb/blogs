#!/usr/bin/env python3
"""
Fix breadcrumbs for posts on index.html
Posts on index.html should have: হোম → Post (2 levels)
Posts on blog-*.html should have: হোম → ব্লগ X → Post (3 levels)
"""

import os
import re
from pathlib import Path

# Posts that appear on index.html should have 2-level breadcrumbs
INDEX_POSTS = ['ranti.html', 'prashanta.html', 'durjhodhon.html', 'friend.html']

def get_blog_page_name(blog_page):
    """Get display name for blog page."""
    if blog_page == 'blog.html':
        return 'ব্লগ'
    else:
        num = blog_page.replace('blog-', '').replace('.html', '')
        bengali_nums = {'1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫',
                       '6': '৬', '7': '৭', '8': '৮', '9': '৯', '10': '১০', '11': '১১'}
        return f'ব্লগ {bengali_nums.get(num, num)}'

def create_2level_breadcrumb_schema(page_title, page_url):
    """Create 2-level breadcrumb for index.html posts."""
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
          "name": "{page_title}",
          "item": "https://textandtech.me/{page_url}"
        }}
      ]
    }}
    </script>
'''

def create_2level_breadcrumb_html(page_title):
    """Create 2-level HTML breadcrumb."""
    return f'''
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="index.html">হোম</a></li>
                        <li class="breadcrumb-item active" aria-current="page">{page_title}</li>
                    </ol>
                </nav>
'''

def fix_breadcrumbs(filepath):
    """Fix breadcrumbs for a post file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        filename = os.path.basename(filepath)
        
        # Extract title
        title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
        if title_match:
            page_title = title_match.group(1).strip()
        else:
            page_title = "Blog Post"
        
        # Remove old breadcrumb schema
        content = re.sub(
            r'<!-- Breadcrumb Schema -->.*?</script>\s*',
            '',
            content,
            flags=re.DOTALL
        )
        
        # Add new 2-level breadcrumb schema
        new_schema = create_2level_breadcrumb_schema(page_title, filename)
        if '</head>' in content:
            content = content.replace('</head>', f'{new_schema}\n</head>')
        
        # Replace HTML breadcrumbs with 2-level version
        breadcrumb_html = create_2level_breadcrumb_html(page_title)
        
        pattern = r'<nav aria-label="breadcrumb">.*?</nav>\s*'
        if re.search(pattern, content, re.DOTALL):
            content = re.sub(pattern, breadcrumb_html, content, count=1, flags=re.DOTALL)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
        
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")
        return False

def main():
    """Fix breadcrumbs for index.html posts."""
    print("Fixing breadcrumbs for index.html posts...\n")
    
    updated_count = 0
    
    for post_file in INDEX_POSTS:
        if not os.path.exists(post_file):
            print(f"⊘ {post_file} not found")
            continue
        
        print(f"Updating {post_file}")
        if fix_breadcrumbs(post_file):
            updated_count += 1
            print(f"  ✓ Changed to: হোম → Post")
        else:
            print(f"  ⊘ Failed")
    
    print(f"\n✓ Updated {updated_count} posts")

if __name__ == '__main__':
    main()
