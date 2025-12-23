import os
import re
from glob import glob

# --- Configuration ---
SITE_NAME = "Rantideb"
BASE_URL = "https://textandtech.me"
GLOBAL_KEYWORDS = "Technology Blog, Bengali Blog, DevOps Tutorials, Literature, Rantideb, Docker, Kubernetes, CI/CD, GitHub Actions, Python, Bengali Poetry, Philosophy"

FAQ_CONTENT_DEVOPS = """
<section class="faq-section py-5 theme-bg-light">
    <div class="container single-col-max-width">
        <h3 class="text-center mb-4">Frequently Asked Questions</h3>
        <div class="accordion" id="faqAccordion">
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        What is the best way to start with DevOps in 2025?
                    </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                    <div class="accordion-body">
                        Start by mastering Linux basics and Git. Then move to Docker and CI/CD concepts. This roadmap guides you through each step.
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Is coding required for DevOps?
                    </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                    <div class="accordion-body">
                        Yes, basic scripting knowledge in Python or Bash is essential for automation, but you don't need to be a software developer.
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
"""

# --- Helpers ---

def is_bengali(text):
    # Checks if text contains Bengali characters
    return bool(re.search(r'[\u0980-\u09FF]', text))

def fix_title(content, filename):
    # 1. Check for multiple titles and clean up
    # Regex with DOTALL to catch multi-line titles
    title_matches = list(re.finditer(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL))
    
    if len(title_matches) > 1:
        print(f"⚠️ {filename}: Found {len(title_matches)} titles. Cleaning up...")
        kept_title = None
        # Find a Bengali title
        for match in title_matches:
            t_text = match.group(1).strip()
            if is_bengali(t_text):
                kept_title = t_text
                break
        
        # If no Bengali title found, use the last one
        if not kept_title:
             kept_title = title_matches[-1].group(1).strip()

        # Remove ALL titles
        content = re.sub(r'<title>.*?</title>\s*', '', content, flags=re.IGNORECASE | re.DOTALL)
        
        # Inject the kept title
        new_tag = f"<title>{kept_title}</title>"
        if '<head>' in content:
            content = content.replace('<head>', f'<head>\n\t{new_tag}')
        else:
            content = new_tag + "\n" + content
            
        print(f"   -> Restored title: {kept_title}")
        
    # 2. Now process the single title (existing or restored)
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    
    if title_match:
        current_title = title_match.group(1).strip()
        
        # Language Check
        if is_bengali(current_title):
            # It's Bengali. Do NOT append English branding.
            return content
        else:
            # It's English (or other). Check branding.
            if SITE_NAME not in current_title:
                 clean_title = current_title.replace(" - ", "").strip()
                 new_title = f"{clean_title} | {SITE_NAME}"
                 content = content.replace(title_match.group(0), f"<title>{new_title}</title>")
    else:
        # No title exists. Try to find H1
        h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.IGNORECASE | re.DOTALL)
        
        new_title_text = ""
        if h1_match:
            raw_h1 = h1_match.group(1)
            # Remove HTML tags from H1 text
            clean_h1 = re.sub(r'<[^>]+>', '', raw_h1).strip()
            new_title_text = clean_h1
        else:
            # No H1. Check content language before using filename.
            if is_bengali(content):
                print(f"⚠️ {filename}: Bengali content but No Title/H1. Skipping English filename generation.")
                return content
            else:
                new_title_text = filename.replace(".html", "").replace("-", " ").title()

        # Branding
        if new_title_text:
            if is_bengali(new_title_text):
                final_title = new_title_text
            else:
                final_title = f"{new_title_text} | {SITE_NAME}"
            
            # Inject
            content = content.replace("<head>", f"<head>\n\t<title>{final_title}</title>")
        
    return content

def inject_meta_tags(content, filename):
    # 1. Keywords
    if '<meta name="keywords"' not in content:
        keywords_tag = f'\t<meta name="keywords" content="{GLOBAL_KEYWORDS}">'
        # Insert before </head> or after description
        # Use DOTALL to match multi-line descriptions
        if '<meta name="description"' in content:
            content = re.sub(r'(<meta name="description".*?>)', r'\1\n' + keywords_tag, content, flags=re.DOTALL | re.IGNORECASE)
        else:
             content = content.replace("</head>", f"{keywords_tag}\n</head>")

    # 2. Canonical
    if '<link rel="canonical"' not in content:
        canonical_tag = f'\t<link rel="canonical" href="{BASE_URL}/{filename}">'
        content = content.replace("</head>", f"{canonical_tag}\n</head>")
        
    return content

def inject_manifest(content):
    if '<link rel="manifest"' not in content:
        manifest_tag = '\t<link rel="manifest" href="manifest.json">'
        content = content.replace('</head>', f'{manifest_tag}\n</head>')
    return content

def fix_pagination(content, filename):
    match = re.match(r'blog-(\d+)\.html', filename)
    
    if filename == "blog.html":
        if '<link rel="next"' not in content:
            link_tag = f'\t<link rel="next" href="{BASE_URL}/blog-1.html">'
            content = content.replace("</head>", f"{link_tag}\n</head>")
            
    elif match:
        page_num = int(match.group(1))
        
        prev_link = ""
        next_link = ""
        actual_page_display = page_num + 1
        
        if page_num == 1:
            prev_link = "blog.html"
            next_link = "blog-2.html"
        else:
            prev_link = f"blog-{page_num - 1}.html"
            next_link = f"blog-{page_num + 1}.html"
            
        # Update Title: Only touch regex if title exists
        title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
        if title_match:
            curr_t = title_match.group(1)
            # Only append Page X if not already there AND not Bengali
            if f"Page {actual_page_display}" not in curr_t:
                if not is_bengali(curr_t):
                    content = re.sub(r'<title>(.*?)</title>', f"<title>\\1 - Page {actual_page_display}</title>", content, flags=re.IGNORECASE|re.DOTALL)

        # Inject Links
        links_html = ""
        if '<link rel="prev"' not in content:
            links_html += f'\t<link rel="prev" href="{BASE_URL}/{prev_link}">\n'
        if '<link rel="next"' not in content:
            if page_num < 20: 
                links_html += f'\t<link rel="next" href="{BASE_URL}/{next_link}">\n'
                
        if links_html:
            content = content.replace("</head>", f"{links_html}</head>")
            
    return content

def inject_lazy_loading(content):
    def replacer(match):
        tag = match.group(0)
        if 'loading=' not in tag:
            return tag.replace('<img ', '<img loading="lazy" ')
        return tag
        
    content = re.sub(r'<img[^>]+>', replacer, content)
    return content

def add_alt_text(content, filename):
    def replacer(match):
        tag = match.group(0)
        if 'alt=' not in tag or 'alt=""' in tag:
            readable_name = filename.replace(".html", "").replace("-", " ").title()
            return tag.replace('<img ', f'<img alt="{readable_name} Image" ')
        return tag
        
    content = re.sub(r'<img[^>]+>', replacer, content)
    return content

def inject_static_schema(content, filename):
    import json
    from datetime import datetime
    
    # Remove existing static schema(s) if present
    # Use robust regex to catch all instances and slight variations
    if 'id="static-schema"' in content:
        content = re.sub(r'<script[^>]+id="static-schema"[^>]*>.*?</script>\s*', '', content, flags=re.DOTALL | re.IGNORECASE)

    # 1. Parse Metadata for Schema
    title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    title = title_match.group(1).split('|')[0].strip() if title_match else "No Title"
    
    desc_match = re.search(r'<meta name="description" content="(.*?)">', content, re.IGNORECASE | re.DOTALL)
    desc = desc_match.group(1).strip() if desc_match else ""
    
    date_match = re.search(r'<meta property="article:published_time" content="(.*?)">', content, re.IGNORECASE)
    pub_date = date_match.group(1) if date_match else datetime.now().isoformat()
    
    image_match = re.search(r'<meta property="og:image" content="(.*?)">', content, re.IGNORECASE)
    image_url = f"{BASE_URL}/{image_match.group(1)}" if image_match else f"{BASE_URL}/assets/images/profile.jpg"
    
    canonical_url = f"{BASE_URL}/{filename}"

    # 2. Build Schemas
    schemas = []
    
    # Organization
    schemas.append({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Text and Tech",
        "url": BASE_URL,
        "founder": {
            "@type": "Person",
            "name": "Rantideb",
            "url": "https://www.ranti.dev"
        },
        "logo": {
            "@type": "ImageObject",
            "url": f"{BASE_URL}/assets/images/profile.jpg"
        },
        "sameAs": [
            "https://twitter.com/r4ntide3",
            "https://www.linkedin.com/in/rantideb/",
            "https://github.com/Rantideb",
            "https://www.facebook.com/R4ntideb"
        ]
    })
    
    # Person
    schemas.append({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Rantideb",
        "url": "https://www.ranti.dev",
        "image": f"{BASE_URL}/assets/images/profile.jpg",
        "jobTitle": "DevOps Engineer & Writer",
        "owns": {
            "@type": "Organization",
            "name": "Text and Tech",
            "url": BASE_URL
        },
        "sameAs": [
            "https://twitter.com/r4ntide3",
            "https://www.linkedin.com/in/rantideb/",
            "https://github.com/Rantideb",
            "https://www.facebook.com/R4ntideb"
        ]
    })
    
    # WebSite
    schemas.append({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Text and Tech",
        "url": BASE_URL,
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": f"{BASE_URL}/search-results.html?q={{search_term_string}}"
            },
            "query-input": "required name=search_term_string"
        }
    })
    
    # BlogPosting (Only for content pages)
    is_blog = filename.startswith('blog-') or filename == 'blog.html' or filename.endswith('.html')
    # Filter out non-content pages usually
    is_content_page = filename not in ['index.html', 'about.html', '404.html', 'search-results.html', 'archive.html'] and not re.match(r'blog-\d+\.html', filename)
    
    if is_content_page:
        schemas.append({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": title,
            "description": desc,
            "image": image_url,
            "author": {
                "@type": "Person",
                "name": "Rantideb",
                "url": "https://www.ranti.dev"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Text and Tech",
                "logo": {
                    "@type": "ImageObject",
                    "url": f"{BASE_URL}/assets/images/profile.jpg"
                }
            },
            "datePublished": pub_date,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": canonical_url
            }
        })

    # 3. Inject
    json_ld = json.dumps(schemas, indent=2, ensure_ascii=False)
    script_block = f'<script type="application/ld+json" id="static-schema">\n{json_ld}\n</script>'
    
    # Inject before </head>
    return content.replace('</head>', f'{script_block}\n</head>')

def inject_faq(content, filename):
    return content

def update_scripts(content):
    if 'article-schema.js' in content:
        content = content.replace('article-schema.js', 'structured-data.js')
    elif 'structured-data.js' not in content:
        script_tag = '<script src="assets/js/structured-data.js"></script>'
        if '</body>' in content:
            content = content.replace('</body>', f'{script_tag}\n</body>')
        else:
             content += f"\n{script_tag}"
    return content

def run_update():
    html_files = glob("*.html")
    updated_count = 0
    
    for file_path in html_files:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        original_content = content
        
        content = fix_title(content, file_path)
        content = inject_meta_tags(content, file_path)
        content = fix_pagination(content, file_path)
        content = inject_lazy_loading(content)
        content = inject_manifest(content)
        content = inject_static_schema(content, file_path)
        content = add_alt_text(content, file_path)
        content = inject_faq(content, file_path)
        content = update_scripts(content)
        
        if content != original_content:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            updated_count += 1
            print(f"Updated: {file_path}")
            
    print(f"✅ Bulk Update Complete! Modified {updated_count} files.")

if __name__ == "__main__":
    run_update()
