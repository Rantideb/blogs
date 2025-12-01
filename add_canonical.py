import os
import re

def add_canonical():
    base_url = "https://textandtech.me/"
    
    for root, dirs, files in os.walk("."):
        if ".git" in dirs:
            dirs.remove(".git")
            
        for file in files:
            if file.endswith(".html"):
                filepath = os.path.join(root, file)
                
                # Determine canonical URL
                if file == "index.html":
                    canonical_url = base_url
                else:
                    canonical_url = base_url + file
                
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    # Check if canonical already exists
                    if '<link rel="canonical"' in content:
                        # Update existing
                        new_content = re.sub(r'<link rel="canonical" href=".*?">', f'<link rel="canonical" href="{canonical_url}">', content)
                    else:
                        # Add new
                        canonical_tag = f'<link rel="canonical" href="{canonical_url}">'
                        if "</title>" in content:
                            new_content = content.replace("</title>", f"</title>\n    {canonical_tag}")
                        elif "<head>" in content:
                            new_content = content.replace("<head>", f"<head>\n    {canonical_tag}")
                        else:
                            print(f"Skipping {file}: No head or title tag")
                            continue
                    
                    if content != new_content:
                        with open(filepath, "w", encoding="utf-8") as f:
                            f.write(new_content)
                        print(f"Updated {file}")
                except Exception as e:
                    print(f"Error processing {file}: {e}")

if __name__ == "__main__":
    add_canonical()
