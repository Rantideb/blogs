#!/usr/bin/env python3
"""
Script to refine sitemap.xml by removing invalid and utility pages.
"""

from pathlib import Path

def refine_sitemap():
    sitemap_path = Path("/Users/rantideb/Downloads/blogs/sitemap.xml")
    
    if not sitemap_path.exists():
        print("sitemap.xml not found")
        return

    with open(sitemap_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    new_lines = []
    skip_block = False
    
    # Files to exclude
    exclude_patterns = [
        '.json.html',       # Invalid generated URLs
        'head.html',        # Partial file
        'test-reading-time.html', # Test file
        'google',           # Verification file
        'privacy-en.html'   # Duplicate/Alternative language (optional, but let's keep it clean if user only uses BN)
    ]

    i = 0
    while i < len(lines):
        line = lines[i]
        
        if '<url>' in line:
            # Check the next few lines for <loc>
            block = []
            is_excluded = False
            
            # Read ahead to capture the block
            j = i
            while j < len(lines) and '</url>' not in lines[j]:
                block.append(lines[j])
                if '<loc>' in lines[j]:
                    url = lines[j]
                    for pattern in exclude_patterns:
                        if pattern in url:
                            is_excluded = True
                            break
                j += 1
            
            if j < len(lines):
                block.append(lines[j]) # Add </url>
                
            if not is_excluded:
                new_lines.extend(block)
            else:
                print(f"Removed: {url.strip()}")
                
            i = j + 1
        else:
            new_lines.append(line)
            i += 1

    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
        
    print("✓ Refined sitemap.xml")

if __name__ == "__main__":
    refine_sitemap()
