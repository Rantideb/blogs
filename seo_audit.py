import os
import re
from glob import glob

def audit_files():
    html_files = glob("*.html")
    print(f"Found {len(html_files)} HTML files.")
    
    report = []
    
    # Sort files to put index/blog-X first for visibility
    html_files.sort()
    
    # Exclude partials and utility files
    EXCLUDED_FILES = [
        "head.html", "google32f4039fea15063c.html", "index_old.html", 
        "test-reading-time.html", "search-results.html"
    ]

    for file_path in html_files:
        if file_path in EXCLUDED_FILES:
            continue
            
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        issues = []
        is_pagination_page = re.match(r'blog-\d+\.html', file_path)
        
        # 1. Title Check
        title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
        if not title_match:
            issues.append("❌ Missing <title>")
        elif is_pagination_page and "Page" not in title_match.group(1):
             issues.append(f"⚠️ Title might be duplicate (needs 'Page X'): {title_match.group(1).strip()}")

        # 2. Meta Description
        if '<meta name="description"' not in content:
            issues.append("❌ Missing <meta name='description'>")
            
        # 3. Meta Keywords
        if '<meta name="keywords"' not in content:
            issues.append("❌ Missing <meta name='keywords'>")

        # 4. H1 Check
        h1_matches = re.findall(r'<h1', content, re.IGNORECASE | re.DOTALL)
        if len(h1_matches) == 0:
            issues.append("❌ Missing <h1>")
        elif len(h1_matches) > 1:
            issues.append(f"⚠️ Multiple <h1> tags found: {len(h1_matches)}")

        # 5. Canonical Check
        if '<link rel="canonical"' not in content:
             issues.append("❌ Missing <link rel='canonical'>")
             
        # 6. Images Alt Check
        # specific check for img tags without alt
        img_tags = re.finditer(r'<img([^>]*)>', content, re.IGNORECASE)
        missing_alt_count = 0
        for img in img_tags:
            attrs = img.group(1)
            if 'alt=' not in attrs:
                missing_alt_count += 1
        if missing_alt_count > 0:
            issues.append(f"⚠️ {missing_alt_count} images missing 'alt' text")
            
        # 7. Pagination Checks (blog-X pages)
        if is_pagination_page:
            if '<link rel="prev"' not in content and '<link rel="next"' not in content:
                issues.append("❌ Missing rel='prev'/'next' pagination links")

        # 8. OG Tags
        if 'property="og:image"' not in content:
             issues.append("⚠️ Missing og:image")

        if issues:
            report.append(f"\nPAGE: {file_path}")
            for issue in issues:
                report.append(f"  {issue}")
                
    report_str = "\n".join(report)
    with open("seo_audit_report.txt", "w") as f:
        f.write(report_str)
        
    print(report_str)

if __name__ == "__main__":
    audit_files()
