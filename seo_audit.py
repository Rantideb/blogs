import os
import re
import json
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote

class SEOAuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = None
        self.description = None
        self.canonical = None
        self.h1_count = 0
        self.images_without_alt = []
        self.internal_links = []
        self.og_tags = {}
        self.json_ld_scripts = []
        self.in_script = False
        self.in_title = False
        self.current_script_type = None

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        if tag == 'title':
            self.in_title = True
        elif tag == 'meta':
            name = attrs_dict.get('name')
            prop = attrs_dict.get('property')
            content = attrs_dict.get('content')
            
            if name == 'description':
                self.description = content
            elif prop and prop.startswith('og:'):
                self.og_tags[prop] = content

        elif tag == 'link':
            if attrs_dict.get('rel') == 'canonical':
                self.canonical = attrs_dict.get('href')

        elif tag == 'h1':
            self.h1_count += 1

        elif tag == 'img':
            src = attrs_dict.get('src')
            alt = attrs_dict.get('alt')
            if not alt:
                self.images_without_alt.append(src)

        elif tag == 'a':
            href = attrs_dict.get('href')
            if href:
                self.internal_links.append(href)

        elif tag == 'script':
            self.in_script = True
            self.current_script_type = attrs_dict.get('type')

    def handle_endtag(self, tag):
        if tag == 'script':
            self.in_script = False
            self.current_script_type = None
        elif tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title and data.strip():
            self.title = data.strip()
        
        if self.in_script and self.current_script_type == 'application/ld+json':
            self.json_ld_scripts.append(data)


def analyze_file(filepath, root_dir):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return [f"Error reading file: {e}"]

    parser = SEOAuditParser()
    parser.feed(content)
    
    issues = []
    
    # Check Metadata
    if not parser.title:
        issues.append("Missing <title>")
    if not parser.description:
        issues.append("Missing meta description")
    if not parser.canonical:
        issues.append("Missing canonical tag")
    
    # Check Heading Hierarchy
    if parser.h1_count == 0:
        issues.append("Missing <h1> tag")
    elif parser.h1_count > 1:
        issues.append(f"Multiple <h1> tags found ({parser.h1_count})")
        
    # Check Images
    for img in parser.images_without_alt:
        issues.append(f"Image missing alt text: {img}")
        
    # Check Schema
    has_breadcrumb = False
    
    for i, script_content in enumerate(parser.json_ld_scripts):
        try:
            data = json.loads(script_content)
            
            schemas_to_check = []
            
            # Normalize to list of objects
            if isinstance(data, list):
                schemas_to_check.extend(data)
            else:
                schemas_to_check.append(data)
            
            # Flatten @graph if present
            final_schemas = []
            for item in schemas_to_check:
                if '@graph' in item and isinstance(item['@graph'], list):
                    final_schemas.extend(item['@graph'])
                else:
                    final_schemas.append(item)
                
            for schema in final_schemas:
                schema_type = schema.get('@type')
                
                if schema_type == 'BreadcrumbList':
                    has_breadcrumb = True
                    
                if schema_type == 'BlogPosting':
                    if not schema.get('author'):
                        issues.append(f"BlogPosting missing 'author'")
                    if not schema.get('datePublished'):
                        issues.append(f"BlogPosting missing 'datePublished'")
                    if not schema.get('mainEntityOfPage'):
                        issues.append(f"BlogPosting missing 'mainEntityOfPage'")

        except json.JSONDecodeError as e:
            issues.append(f"Malformed JSON-LD schema (Script #{i+1}): {e}")

    # Only flag missing breadcrumbs for likely blog posts (files with BlogPosting or long content)
    # Heuristic: if filename is not index/about/contact and has .html
    is_likely_post = 'blog' in filepath or (filepath.endswith('.html') and 'index' not in filepath and 'search' not in filepath)
    if is_likely_post and not has_breadcrumb:
        # Check if it actually has a BlogPosting schema before complaining about breadcrumbs
        # (Avoid flagging utility pages)
        has_blogposting = False
        for script_content in parser.json_ld_scripts:
            if 'BlogPosting' in script_content:
                has_blogposting = True
                break
        
        if has_blogposting:
             issues.append("Missing BreadcrumbList schema")

    # Check Internal Links (Basic existence check)
    for link in parser.internal_links:
        parsed = urlparse(link)
        if not parsed.scheme and not parsed.netloc: # Relative link
            path = parsed.path
            if path.startswith('#') or path.startswith('mailto:') or path.startswith('tel:'):
                continue
            
            # Remove query params and anchors
            clean_path = path.split('?')[0].split('#')[0]
            
            if not clean_path: 
                continue

            # Construct potential disk paths
            # Assuming flat structure for simplicity based on previous observations, 
            # or relative to current file.
            
            # If path starts with /, it's relative to root
            if clean_path.startswith('/'):
                 target_path = os.path.join(root_dir, clean_path.lstrip('/'))
            else:
                 # Relative to current file
                 target_path = os.path.join(os.path.dirname(filepath), clean_path)
            
            if not os.path.exists(target_path):
                 # Try adding .html if not present
                 if not target_path.endswith('.html') and os.path.exists(target_path + '.html'):
                     pass
                 elif os.path.isdir(target_path) and os.path.exists(os.path.join(target_path, 'index.html')):
                     pass
                 else:
                     # One last check: might be just a filename in the same dir
                     issues.append(f"Broken internal link: {link}")

    return issues

def main():
    root_dir = '/Users/rantideb/Downloads/blogs'
    all_issues = {}
    
    print(f"Starting Deep SEO Audit for: {root_dir}")
    print("-" * 50)

    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, root_dir)
                
                # Skip some known non-content files if necessary
                if 'google' in file and 'html' in file: # e.g. google verification
                    continue
                
                if file == 'head.html': # Partial file
                    continue
                
                file_issues = analyze_file(filepath, root_dir)
                if file_issues:
                    all_issues[rel_path] = file_issues

    if all_issues:
        print(f"Found issues in {len(all_issues)} files:")
        for file, issues in all_issues.items():
            print(f"\n📄 {file}:")
            for issue in issues:
                print(f"  ❌ {issue}")
    else:
        print("\n✅ Zero issues found! The codebase is clean.")

if __name__ == "__main__":
    main()
