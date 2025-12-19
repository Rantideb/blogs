#!/usr/bin/env python3
"""
Fix breadcrumbs to match actual blog page structure.
Scans blog pages to find where each post is linked from.
"""

import os
import re
from pathlib import Path

# Map of posts to their parent blog pages
POST_TO_BLOG_PAGE = {}

def scan_blog_pages():
    """Scan blog pages to find which posts belong where."""
    blog_pages = ['blog.html', 'blog-1.html', 'blog-2.html', 'blog-3.html', 
                  'blog-4.html', 'blog-5.html', 'blog-6.html', 'blog-7.html',
                  'blog-8.html', 'blog-9.html', 'blog-10.html', 'blog-11.html']
    
    for blog_page in blog_pages:
        if not os.path.exists(blog_page):
            continue
        
        try:
            with open(blog_page, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find all post links in this blog page
            post_links = re.findall(r'href="([a-z0-9-]+\.html)"', content)
            
            for post_link in post_links:
                # Skip self-references and navigation links
                if post_link in blog_pages or post_link in ['index.html', 'about.html', 
                                                              'archive.html', 'search-results.html',
                                                              'privacy-bn.html', 'privacy-en.html']:
                    continue
                
                # Map post to blog page
                if post_link not in POST_TO_BLOG_PAGE:
                    POST_TO_BLOG_PAGE[post_link] = blog_page
                    
        except Exception as e:
            print(f"Error scanning {blog_page}: {e}")

def get_blog_page_name(blog_page):
    """Get display name for blog page."""
    if blog_page == 'blog.html':
        return 'ব্লগ'
    else:
        # blog-1.html -> ব্লগ ১
        num = blog_page.replace('blog-', '').replace('.html', '')
        bengali_nums = {'1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫',
                       '6': '৬', '7': '৭', '8': '৮', '9': '৯', '10': '১০', '11': '১১'}
        return f'ব্লগ {bengali_nums.get(num, num)}'

def create_breadcrumb_schema(page_title, page_url, blog_page):
    """Create BreadcrumbList JSON-LD schema."""
    blog_name = get_blog_page_name(blog_page)
    
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
          "name": "{blog_name}",
          "item": "https://textandtech.me/{blog_page}"
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

def create_breadcrumb_html(page_title, blog_page):
    """Create HTML breadcrumb navigation."""
    blog_name = get_blog_page_name(blog_page)
    
    return f'''
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="index.html">হোম</a></li>
                        <li class="breadcrumb-item"><a href="{blog_page}">{blog_name}</a></li>
                        <li class="breadcrumb-item active" aria-current="page">{page_title}</li>
                    </ol>
                </nav>
'''

def fix_breadcrumbs_in_file(filepath, blog_page):
    """Fix breadcrumbs in a post file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        filename = os.path.basename(filepath)
        page_title = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
        if page_title:
            page_title = page_title.group(1).strip()
        else:
            page_title = "Blog Post"
        
        # Remove old breadcrumb schema
        content = re.sub(
            r'<!-- Breadcrumb Schema -->.*?</script>\s*',
            '',
            content,
            flags=re.DOTALL
        )
        
        # Add new breadcrumb schema before </head>
        new_schema = create_breadcrumb_schema(page_title, filename, blog_page)
        if '</head>' in content:
            content = content.replace('</head>', f'{new_schema}\n</head>')
        
        # Replace HTML breadcrumbs
        breadcrumb_html = create_breadcrumb_html(page_title, blog_page)
        
        # Find and replace existing breadcrumb nav
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
    """Fix breadcrumbs for all posts."""
    print("Scanning blog pages to find post locations...")
    scan_blog_pages()
    
    print(f"\nFound {len(POST_TO_BLOG_PAGE)} posts mapped to blog pages")
    
    updated_count = 0
    skipped_count = 0
    
    for post_file, blog_page in POST_TO_BLOG_PAGE.items():
        if not os.path.exists(post_file):
            continue
        
        print(f"Fixing {post_file} -> {blog_page}")
        if fix_breadcrumbs_in_file(post_file, blog_page):
            updated_count += 1
        else:
            skipped_count += 1
    
    print(f"\n✓ Updated: {updated_count} files")
    print(f"⊘ Skipped: {skipped_count} files")

if __name__ == '__main__':
    main()
