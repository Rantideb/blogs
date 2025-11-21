import os
import re

# The directory to search
directory = '/Users/rantideb/Downloads/blogs'

# The corrected navbar content using <i> tags instead of raw <svg>
# This prevents the FOUC/glitch caused by unstyled SVGs loading before FontAwesome JS
new_navbar = """<ul class="navbar-nav flex-column text-start">
					<li class="nav-item">
					    <a class="nav-link" href="index-1.html"><i class="fas fa-home fa-fw me-2"></i>প্রলাপের পত্রসূচি <span class="sr-only">(current)</span></a>
					</li>

					<li class="nav-item">
					    <a class="nav-link" href="about.html"><i class="fas fa-user fa-fw me-2"></i>প্রলাপের ভুতপত্তি</a>
					</li>

					<li class="nav-item">
					    <a class="nav-link" href="privacy-bn.html" id="privacy-policy-link"><i class="fas fa-shield-alt fa-fw me-2"></i><span class="privacy-text">গোপনীয়তা নীতি</span></a>
					</li>
				</ul>"""

# Regex to find the navbar block (matches the one with SVGs we just added)
# Matches <ul class="navbar-nav flex-column text-start"> ... </ul>
navbar_regex = re.compile(r'<ul class="navbar-nav flex-column text-start">[\s\S]*?</ul>', re.MULTILINE)

count = 0
for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if navbar_regex.search(content):
            new_content = navbar_regex.sub(new_navbar, content)
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
                count += 1

print(f"Total files updated: {count}")
