import os

# Configuration
target_dir = "."
css_link = '    <!-- Smart Ads CSS -->\n    <link rel="stylesheet" href="assets/css/smart-ads.css">\n'
js_script = '    <!-- Smart Ad Manager -->\n    <script src="assets/js/smart-ads.js"></script>\n'

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already updated
    if 'smart-ads.js' in content:
        print(f"Skipping {filepath} (already updated)")
        return

    # Check for head and body
    if '</head>' not in content or '</body>' not in content:
        print(f"Skipping {filepath} (invalid structure)")
        return

    # Inject CSS
    new_content = content.replace('</head>', css_link + '</head>')
    
    # Inject JS
    new_content = new_content.replace('</body>', js_script + '</body>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Updated {filepath}")

def main():
    for root, dirs, files in os.walk(target_dir):
        # Exclude hidden dirs
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        for file in files:
            if file.endswith('.html'):
                update_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
