#!/usr/bin/env python3
"""
Script to remove Archive navigation link from all HTML pages.
"""

import re
from pathlib import Path

# All HTML pages to check
all_pages = [
    # Blog hub pages
    "index-1.html", "blog.html", "blog-1.html", "blog-2.html", "blog-3.html",
    "blog-4.html", "blog-5.html", "blog-6.html", "blog-7.html", "blog-8.html",
    "blog-9.html", "blog-10.html",
    # Blog post pages
    "arundhuti.html", "aryotirtho.html", "blog-post.html", "durjhodhon.html",
    "estrangement.html", "friend.html", "gandhari.html", "goddessorhoe.html",
    "guilty.html", "hem.html", "horini.html", "hospital-days.html",
    "iraboti.html", "jibon-sahyane.html", "kauke-valobashoni.html",
    "keutonoy.html", "koppa.html", "life.html", "lifeandlove.html",
    "liveandgrow.html", "lost.html", "lostloseorleft.html", "madhovi.html",
    "mon.html", "nirbashon.html", "o-amar.html", "prashanta.html",
    "prem-paliye-jai.html", "root.html", "sayinggoodbye.html",
    # Other important pages
    "about.html", "archive.html", "amar-osthirota.html", "who.html",
    "pap.html", "unfortunate.html", "man.html", "submission.html",
    "tomar.html", "karechaotumi.html", "oprapti.html"
]

def remove_archive_link(filepath):
    """Remove Archive link from navigation."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Regex to match the archive nav item
        # We need to be careful to match exactly what we added or variations of it
        # The added code was:
        # <li class="nav-item">
        #     <a class="nav-link" href="archive.html"><i class="fas fa-archive fa-fw me-2"></i>সংরক্ষণাগার</a>
        # </li>
        
        pattern = r'\s*<li class="nav-item">\s*<a class="nav-link" href="archive\.html"><i class="fas fa-archive fa-fw me-2"></i>সংরক্ষণাগার</a>\s*</li>'
        
        if re.search(pattern, content):
            content = re.sub(pattern, '', content)
            
            # Write back
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✓ Removed Archive link from {filepath.name}")
            return True
        else:
            # Try a looser pattern just in case of formatting changes
            pattern_loose = r'<li class="nav-item">[\s\S]*?href="archive\.html"[\s\S]*?</li>'
            if re.search(pattern_loose, content):
                 content = re.sub(pattern_loose, '', content)
                 with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                 print(f"✓ Removed Archive link (loose match) from {filepath.name}")
                 return True

            print(f"  No Archive link found in {filepath.name}")
            return False
        
    except Exception as e:
        print(f"✗ Error processing {filepath.name}: {e}")
        return False

def main():
    base_dir = Path("/Users/rantideb/Downloads/blogs")
    
    print("Removing Archive navigation link from all pages...\n")
    
    success_count = 0
    
    for filename in all_pages:
        filepath = base_dir / filename
        
        if not filepath.exists():
            continue
        
        if remove_archive_link(filepath):
            success_count += 1
    
    print(f"\nSuccessfully removed from {success_count} files.")

if __name__ == "__main__":
    main()
