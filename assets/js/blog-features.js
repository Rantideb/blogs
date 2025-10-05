/**
 * Blog Features - Comprehensive functionality enhancements
 * Author: Rantideb
 * Date: October 2025
 */

// ==================== 1. READING TIME ESTIMATOR ====================
function calculateReadingTime() {
    const article = document.querySelector('.blog-post-body');
    if (!article) return;
    
    const text = article.innerText || article.textContent;
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    // Create metadata container if it doesn't exist
    let metaContainer = article.querySelector('.blog-meta-container');
    if (!metaContainer) {
        metaContainer = document.createElement('div');
        metaContainer.className = 'blog-meta-container';
        metaContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin: 20px 0;
            max-width: 100%;
        `;
        article.insertBefore(metaContainer, article.firstChild);
    }
    
    // Create and insert reading time badge
    if (!document.querySelector('.reading-time')) {
        const badge = document.createElement('div');
        badge.className = 'reading-time';
        badge.innerHTML = `<i class="fas fa-clock"></i> ${readingTime} min read`;
        badge.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 8px 15px;
            background: linear-gradient(135deg, #223142 0%, #EEA73B 100%);
            color: white;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            text-align: center;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(34, 49, 66, 0.3);
            transition: all 0.3s ease;
            cursor: default;
        `;
        
        // Add hover effect
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'translateY(-2px)';
            badge.style.boxShadow = '0 4px 12px rgba(34, 49, 66, 0.4)';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'translateY(0)';
            badge.style.boxShadow = '0 2px 8px rgba(34, 49, 66, 0.3)';
        });
        
        metaContainer.appendChild(badge);
    }
}

// ==================== 2. READING PROGRESS BAR ====================
function createReadingProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #223142 0%, #EEA73B 100%);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

// ==================== 3. TABLE OF CONTENTS ====================
function generateTableOfContents() {
    const article = document.querySelector('.blog-post-body');
    if (!article) return;
    
    const headings = article.querySelectorAll('h1, h2, h3, h4');
    if (headings.length < 3) return; // Only show if there are multiple sections
    
    const tocContainer = document.createElement('div');
    tocContainer.id = 'table-of-contents';
    tocContainer.innerHTML = '<h3 style="margin-bottom: 15px;">সূচিপত্র</h3>';
    tocContainer.style.cssText = `
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        border-left: 4px solid #223142;
    `;
    
    const tocList = document.createElement('ul');
    tocList.style.cssText = `
        list-style: none;
        padding: 0;
        margin: 0;
    `;
    
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        const li = document.createElement('li');
        li.style.cssText = `
            margin: 8px 0;
            padding-left: ${(parseInt(heading.tagName.charAt(1)) - 1) * 15}px;
        `;
        
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        link.style.cssText = `
            color: #223142;
            text-decoration: none;
            transition: all 0.3s;
        `;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        
        li.appendChild(link);
        tocList.appendChild(li);
    });
    
    tocContainer.appendChild(tocList);
    article.insertBefore(tocContainer, article.firstChild);
}

// ==================== 4. SOCIAL SHARE BUTTONS ====================
function createShareButtons() {
    const article = document.querySelector('.blog-post-body');
    if (!article) return;
    
    const shareContainer = document.createElement('div');
    shareContainer.className = 'share-buttons';
    shareContainer.style.cssText = `
        display: flex;
        gap: 10px;
        margin: 20px 0;
        flex-wrap: wrap;
        justify-content: center;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
    `;
    
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    
    const shareButtons = [
        {
            name: 'Facebook',
            icon: 'fab fa-facebook-f',
            color: '#1877f2',
            url: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`
        },
        {
            name: 'Twitter',
            icon: 'fab fa-twitter',
            color: '#1da1f2',
            url: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`
        },
        {
            name: 'WhatsApp',
            icon: 'fab fa-whatsapp',
            color: '#25d366',
            url: `https://wa.me/?text=${pageTitle}%20${pageUrl}`
        },
        {
            name: 'LinkedIn',
            icon: 'fab fa-linkedin-in',
            color: '#0077b5',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`
        },
        {
            name: 'Copy Link',
            icon: 'fas fa-link',
            color: '#6c757d',
            action: 'copy'
        }
    ];
    
    const title = document.createElement('div');
    title.textContent = 'শেয়ার করুন:';
    title.style.cssText = `
        width: 100%;
        font-weight: 600;
        margin-bottom: 10px;
        color: #333;
    `;
    shareContainer.appendChild(title);
    
    shareButtons.forEach(button => {
        const btn = document.createElement('a');
        btn.className = 'share-button';
        btn.innerHTML = `<i class="${button.icon}"></i> ${button.name}`;
        btn.style.cssText = `
            background: ${button.color};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
            cursor: pointer;
        `;
        
        if (button.action === 'copy') {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(window.location.href).then(() => {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                });
            });
        } else {
            btn.href = button.url;
            btn.target = '_blank';
        }
        
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = 'none';
        });
        
        shareContainer.appendChild(btn);
    });
    
    article.appendChild(shareContainer);
}

// ==================== DARK MODE HELPER ====================
function fixDarkModeElements() {
    // Fix all elements with inline white backgrounds
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        const style = el.getAttribute('style');
        if (style) {
            // Check for white backgrounds
            if (style.includes('background: white') || 
                style.includes('background:white') ||
                style.includes('background-color: white') ||
                style.includes('background-color:white') ||
                style.includes('background: #fff') ||
                style.includes('background:#fff') ||
                style.includes('background-color: #fff') ||
                style.includes('background-color:#fff') ||
                style.includes('background: #ffffff') ||
                style.includes('background-color: #ffffff')) {
                
                // Don't override if it's an image or has specific exceptions
                if (!el.tagName.match(/^(IMG|SVG)$/i)) {
                    el.dataset.originalBg = 'white';
                }
            }
            
            // Check for light text colors that won't be visible on dark bg
            if (style.includes('color: white') || 
                style.includes('color:#fff') ||
                style.includes('color: #fff')) {
                el.dataset.originalColor = 'white';
            }
        }
    });
}

// ==================== 5. DARK MODE TOGGLE ====================
function createDarkModeToggle() {
    const toggle = document.createElement('button');
    toggle.id = 'dark-mode-toggle';
    toggle.innerHTML = '<i class="fas fa-moon"></i>';
    toggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #223142;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9998;
        transition: all 0.3s;
    `;
    
    // Check for saved preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
        fixDarkModeElements();
        
        // Force blog title to be visible on page load
        setTimeout(() => {
            const blogTitle = document.querySelector('.blog-name a');
            if (blogTitle) {
                blogTitle.style.setProperty('color', '#EEA73B', 'important');
                blogTitle.style.setProperty('opacity', '1', 'important');
                blogTitle.style.setProperty('visibility', 'visible', 'important');
            }
        }, 100);
    }
    
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkNow = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkNow);
        toggle.innerHTML = isDarkNow ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Fix all elements with inline white backgrounds
        if (isDarkNow) {
            fixDarkModeElements();
            
            // Force blog title to be visible
            const blogTitle = document.querySelector('.blog-name a');
            if (blogTitle) {
                blogTitle.style.setProperty('color', '#EEA73B', 'important');
                blogTitle.style.setProperty('opacity', '1', 'important');
                blogTitle.style.setProperty('visibility', 'visible', 'important');
            }
        } else {
            // Reset blog title color in light mode
            const blogTitle = document.querySelector('.blog-name a');
            if (blogTitle) {
                blogTitle.style.color = '';
            }
        }
    });
    
    toggle.addEventListener('mouseenter', () => {
        toggle.style.transform = 'scale(1.1)';
    });
    
    toggle.addEventListener('mouseleave', () => {
        toggle.style.transform = 'scale(1)';
    });
    
    document.body.appendChild(toggle);
    
    // Add dark mode styles
    if (!document.getElementById('dark-mode-styles')) {
        const style = document.createElement('style');
        style.id = 'dark-mode-styles';
        style.textContent = `
            /* Base Styles */
            body.dark-mode {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
            }
            
            body.dark-mode * {
                border-color: #3d3d3d !important;
            }
            
            /* Header & Navigation */
            body.dark-mode .header {
                background-color: #223142 !important;
                color: #e0e0e0 !important;
            }
            
            body.dark-mode .header a {
                color: #EEA73B !important;
            }
            
            body.dark-mode .navbar,
            body.dark-mode nav.navbar {
                background-color: #223142 !important;
            }
            
            body.dark-mode .navbar-toggler {
                background-color: #2d2d2d !important;
                border-color: #EEA73B !important;
            }
            
            body.dark-mode .navbar-toggler-icon {
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%23EEA73B' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
            }
            
            body.dark-mode .navbar-collapse,
            body.dark-mode #navigation {
                background-color: #223142 !important;
            }
            
            body.dark-mode .profile-section {
                background-color: #223142 !important;
            }
            
            /* Blog Title - Multiple selectors for maximum specificity */
            body.dark-mode .header .blog-name,
            body.dark-mode .header .blog-name a,
            body.dark-mode .header h1.blog-name,
            body.dark-mode .header h1.blog-name a,
            body.dark-mode .header .blog-name a.no-text-decoration,
            body.dark-mode .header h1.blog-name a.no-text-decoration,
            body.dark-mode header.header .blog-name a,
            body.dark-mode header.header h1.blog-name a.no-text-decoration {
                color: #EEA73B !important;
                opacity: 1 !important;
                visibility: visible !important;
                text-decoration: none !important;
                display: inline !important;
            }
            
            body.dark-mode .header .blog-name a:hover,
            body.dark-mode .header h1.blog-name a:hover,
            body.dark-mode .header .blog-name a.no-text-decoration:hover {
                color: #ffffff !important;
            }
            
            body.dark-mode .navbar-nav .nav-link,
            body.dark-mode .navbar-nav a.nav-link,
            body.dark-mode ul.navbar-nav .nav-link {
                color: #ffffff !important;
                pointer-events: auto !important;
                cursor: pointer !important;
                opacity: 1 !important;
                visibility: visible !important;
            }
            
            body.dark-mode .navbar-nav .nav-link:hover,
            body.dark-mode .navbar-nav .nav-link.active {
                color: #EEA73B !important;
                background-color: rgba(238, 167, 59, 0.1) !important;
            }
            
            body.dark-mode .navbar-nav .nav-link svg,
            body.dark-mode .navbar-nav .nav-link .svg-inline--fa {
                color: #ffffff !important;
                fill: currentColor !important;
            }
            
            body.dark-mode .navbar-nav .nav-link:hover svg,
            body.dark-mode .navbar-nav .nav-link:hover .svg-inline--fa {
                color: #EEA73B !important;
            }
            
            body.dark-mode .navbar-nav .nav-link:hover svg {
                color: #EEA73B !important;
            }
            
            body.dark-mode .bio {
                color: #d0d0d0 !important;
            }
            
            body.dark-mode .social-list a {
                color: #e0e0e0 !important;
            }
            
            body.dark-mode .social-list a:hover {
                color: #EEA73B !important;
            }
            
            body.dark-mode .btn-primary {
                background-color: #EEA73B !important;
                border-color: #EEA73B !important;
                color: #223142 !important;
            }
            
            body.dark-mode .btn-primary:hover {
                background-color: #d89528 !important;
                border-color: #d89528 !important;
            }
            
            /* Main Content Areas */
            body.dark-mode .blog-post-body {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
            }
            
            body.dark-mode .container {
                background-color: transparent !important;
            }
            
            body.dark-mode .main-wrapper {
                background-color: #1a1a1a !important;
            }
            
            body.dark-mode section {
                background-color: transparent !important;
            }
            
            body.dark-mode .cta-section {
                background-color: #223142 !important;
            }
            
            body.dark-mode .theme-bg-light {
                background-color: #223142 !important;
            }
            
            body.dark-mode .heading,
            body.dark-mode h1, body.dark-mode h2, body.dark-mode h3, 
            body.dark-mode h4, body.dark-mode h5, body.dark-mode h6 {
                color: #e0e0e0 !important;
            }
            
            body.dark-mode p {
                color: #d0d0d0 !important;
            }
            
            /* Blog List & Items */
            body.dark-mode .blog-list {
                background-color: #1a1a1a !important;
            }
            
            body.dark-mode .item {
                background-color: #2d2d2d !important;
                border: 1px solid #3d3d3d !important;
                border-radius: 8px;
                padding: 15px;
            }
            
            body.dark-mode .title,
            body.dark-mode .title a {
                color: #EEA73B !important;
            }
            
            body.dark-mode .intro {
                color: #d0d0d0 !important;
            }
            
            body.dark-mode .text-link {
                color: #EEA73B !important;
            }
            
            body.dark-mode .date,
            body.dark-mode .time {
                color: #b0b0b0 !important;
            }
            
            /* Meta Tags */
            body.dark-mode .meta span {
                background-color: #223142 !important;
                color: #EEA73B !important;
            }
            
            /* Cards, Boxes, Containers */
            body.dark-mode .card,
            body.dark-mode .box {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
            }
            
            /* All white/light backgrounds */
            body.dark-mode [style*="background: white"],
            body.dark-mode [style*="background:white"],
            body.dark-mode [style*="background-color: white"],
            body.dark-mode [style*="background-color:white"],
            body.dark-mode [style*="background: #fff"],
            body.dark-mode [style*="background:#fff"],
            body.dark-mode [style*="background-color: #fff"],
            body.dark-mode [style*="background-color:#fff"] {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
            }
            
            /* Table of Contents */
            body.dark-mode #table-of-contents {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
                border: 1px solid #3d3d3d !important;
            }
            
            body.dark-mode #table-of-contents a {
                color: #EEA73B !important;
            }
            
            body.dark-mode #table-of-contents li:hover {
                background-color: #3d3d3d !important;
            }
            
            /* Share Buttons */
            body.dark-mode .share-buttons {
                background-color: #2d2d2d !important;
            }
            
            body.dark-mode .share-buttons > div:first-child {
                color: #e0e0e0 !important;
            }
            
            body.dark-mode .share-buttons button,
            body.dark-mode .share-buttons a {
                background-color: #223142 !important;
                color: #e0e0e0 !important;
            }
            
            body.dark-mode .share-buttons button:hover,
            body.dark-mode .share-buttons a:hover {
                background-color: #EEA73B !important;
            }
            
            /* Print Button */
            body.dark-mode .print-button {
                color: #ffffff !important;
                background: transparent !important;
                background-color: transparent !important;
                border: none !important;
                border-radius: 0 !important;
                box-shadow: none !important;
                outline: none !important;
            }
            
            body.dark-mode .print-button:hover {
                color: #EEA73B !important;
                background: transparent !important;
                background-color: transparent !important;
                box-shadow: none !important;
                transform: none !important;
            }
            
            body.dark-mode .print-button:focus {
                outline: none !important;
                box-shadow: none !important;
            }
            
            /* Forms & Inputs */
            body.dark-mode input,
            body.dark-mode textarea,
            body.dark-mode select {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
                border-color: #3d3d3d !important;
            }
            
            body.dark-mode input::placeholder,
            body.dark-mode textarea::placeholder {
                color: #888 !important;
            }
            
            body.dark-mode input:focus,
            body.dark-mode textarea:focus {
                border-color: #EEA73B !important;
            }
            
            /* Buttons */
            body.dark-mode button {
                background-color: #223142 !important;
                color: #e0e0e0 !important;
                border-color: #3d3d3d !important;
            }
            
            body.dark-mode button:hover {
                background-color: #EEA73B !important;
            }
            
            body.dark-mode .btn-primary {
                background-color: #223142 !important;
                border-color: #223142 !important;
                color: #fff !important;
            }
            
            body.dark-mode .btn-primary:hover {
                background-color: #EEA73B !important;
                border-color: #EEA73B !important;
            }
            
            /* Font Size Adjuster */
            body.dark-mode #font-size-adjuster {
                background-color: #2d2d2d !important;
            }
            
            body.dark-mode #font-size-adjuster button {
                background-color: #223142 !important;
                color: #e0e0e0 !important;
            }
            
            /* Navigation Links */
            body.dark-mode .blog-nav .nav-link {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
                border-color: #3d3d3d !important;
            }
            
            body.dark-mode .blog-nav .nav-link:hover {
                background-color: #223142 !important;
                color: #EEA73B !important;
            }
            
            /* Footer */
            body.dark-mode .footer {
                background-color: #223142 !important;
                color: #e0e0e0 !important;
            }
            
            body.dark-mode .theme-bg-dark {
                background-color: #223142 !important;
            }
            
            /* Search & Filter Sections */
            body.dark-mode #search-filter-section {
                background-color: #2d2d2d !important;
            }
            
            body.dark-mode #search-results-count {
                background-color: #223142 !important;
                color: #EEA73B !important;
            }
            
            body.dark-mode .filter-tag {
                background-color: #223142 !important;
                color: #e0e0e0 !important;
            }
            
            body.dark-mode .filter-tag.active {
                background: linear-gradient(135deg, #EEA73B 0%, #223142 100%) !important;
            }
            
            /* Related Posts */
            body.dark-mode #related-posts {
                background-color: #2d2d2d !important;
            }
            
            body.dark-mode .related-post-card {
                background-color: #1a1a1a !important;
                border: 1px solid #3d3d3d !important;
            }
            
            /* Comments Section */
            body.dark-mode #bengali-comments-section {
                background-color: #2d2d2d !important;
            }
            
            body.dark-mode .comment-item {
                background-color: #1a1a1a !important;
                border: 1px solid #3d3d3d !important;
            }
            
            body.dark-mode .comment-header {
                color: #e0e0e0 !important;
            }
            
            body.dark-mode .comment-text {
                color: #d0d0d0 !important;
            }
            
            /* Images */
            body.dark-mode img {
                opacity: 0.9;
            }
            
            body.dark-mode img:hover {
                opacity: 1;
            }
            
            /* Code Blocks */
            body.dark-mode code,
            body.dark-mode pre {
                background-color: #2d2d2d !important;
                color: #EEA73B !important;
            }
            
            /* Tables */
            body.dark-mode table {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
            }
            
            body.dark-mode th {
                background-color: #223142 !important;
                color: #e0e0e0 !important;
            }
            
            body.dark-mode td {
                border-color: #3d3d3d !important;
            }
            
            /* Scrollbar */
            body.dark-mode::-webkit-scrollbar {
                width: 12px;
            }
            
            body.dark-mode::-webkit-scrollbar-track {
                background: #1a1a1a;
            }
            
            body.dark-mode::-webkit-scrollbar-thumb {
                background: #223142;
                border-radius: 6px;
            }
            
            body.dark-mode::-webkit-scrollbar-thumb:hover {
                background: #EEA73B;
            }
            
            /* Light backgrounds that need to be dark */
            body.dark-mode .bg-light {
                background-color: #2d2d2d !important;
            }
            
            body.dark-mode .bg-white {
                background-color: #2d2d2d !important;
            }
            
            /* Modals & Popups */
            body.dark-mode .modal-content,
            body.dark-mode .popup-content {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
            }
            
            body.dark-mode .modal-header {
                background-color: #223142 !important;
                border-color: #3d3d3d !important;
            }
            
            /* Alerts */
            body.dark-mode .alert {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
                border-color: #3d3d3d !important;
            }
            
            /* HR lines */
            body.dark-mode hr {
                border-color: #3d3d3d !important;
            }
            
            /* Force text visibility - catch any white/light text on dark backgrounds */
            body.dark-mode [style*="color: #333"],
            body.dark-mode [style*="color:#333"],
            body.dark-mode [style*="color: #666"],
            body.dark-mode [style*="color:#666"] {
                color: #d0d0d0 !important;
            }
            
            /* Ensure all divs, sections with inline white backgrounds are dark */
            body.dark-mode div[style*="background"],
            body.dark-mode section[style*="background"] {
                background-color: #2d2d2d !important;
            }
            
            /* Fix any remaining light colored elements */
            body.dark-mode .text-dark {
                color: #e0e0e0 !important;
            }
            
            body.dark-mode .text-muted {
                color: #b0b0b0 !important;
            }
            
            /* Blog meta and button containers - responsive dark mode */
            body.dark-mode .blog-meta-container,
            body.dark-mode .blog-action-buttons {
                background-color: transparent !important;
            }
            
            body.dark-mode .blog-meta-container > div,
            body.dark-mode .blog-action-buttons > button {
        
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add responsive styles for blog meta and buttons
    if (!document.getElementById('blog-responsive-styles')) {
        const responsiveStyle = document.createElement('style');
        responsiveStyle.id = 'blog-responsive-styles';
        responsiveStyle.textContent = `
            /* Responsive layout for meta badges and action buttons */
            .blog-meta-container {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important;
                gap: 10px !important;
                margin: 20px 0 !important;
            }
            
            .blog-action-buttons {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important;
                gap: 10px !important;
                margin: 20px 0 !important;
            }
            
            /* Mobile optimization - force 2 columns max */
            @media (max-width: 768px) {
                .blog-meta-container {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 8px !important;
                }
                
                .blog-action-buttons {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 8px !important;
                }
                
                .blog-meta-container > div,
                .blog-action-buttons > button {
                    font-size: 12px !important;
                    padding: 6px 10px !important;
                }
                
                .blog-meta-container > div i,
                .blog-action-buttons > button i {
                    font-size: 11px !important;
                }
            }
            
            /* Extra small devices - stack properly */
            @media (max-width: 480px) {
                .blog-meta-container {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 6px !important;
                }
                
                .blog-action-buttons {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 6px !important;
                }
                
                .blog-meta-container > div,
                .blog-action-buttons > button {
                    font-size: 11px !important;
                    padding: 5px 8px !important;
                    gap: 4px !important;
                }
            }
        `;
        document.head.appendChild(responsiveStyle);
    }
}

// ==================== 6. FONT SIZE ADJUSTER ====================
function createFontSizeAdjuster() {
    const adjuster = document.createElement('div');
    adjuster.id = 'font-size-adjuster';
    adjuster.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: white;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9998;
        display: flex;
        flex-direction: column;
        gap: 5px;
    `;
    
    const sizes = [
        { label: 'A+', size: 1.2, title: 'বড়' },
        { label: 'A', size: 1.0, title: 'স্বাভাবিক' },
        { label: 'A-', size: 0.9, title: 'ছোট' }
    ];
    
    const currentSize = parseFloat(localStorage.getItem('fontSize')) || 1.0;
    
    sizes.forEach(({ label, size, title }) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.title = title;
        btn.style.cssText = `
            padding: 8px 12px;
            border: 2px solid ${size === currentSize ? '#223142' : '#ddd'};
            background: ${size === currentSize ? '#223142' : 'white'};
            color: ${size === currentSize ? 'white' : '#333'};
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        `;
        
        btn.addEventListener('click', () => {
            document.querySelectorAll('.blog-post-body p').forEach(p => {
                p.style.fontSize = `${size}em`;
            });
            localStorage.setItem('fontSize', size);
            
            // Update button styles
            adjuster.querySelectorAll('button').forEach(b => {
                b.style.border = '2px solid #ddd';
                b.style.background = 'white';
                b.style.color = '#333';
            });
            btn.style.border = '2px solid #223142';
            btn.style.background = '#223142';
            btn.style.color = 'white';
        });
        
        adjuster.appendChild(btn);
    });
    
    document.body.appendChild(adjuster);
    
    // Apply saved font size
    if (currentSize !== 1.0) {
        document.querySelectorAll('.blog-post-body p').forEach(p => {
            p.style.fontSize = `${currentSize}em`;
        });
    }
}

// ==================== 7. PRINT FUNCTIONALITY ====================
function createPrintButton() {
    const article = document.querySelector('.blog-post-body');
    if (!article) return;
    
    // Create button container if it doesn't exist
    let buttonContainer = article.querySelector('.blog-action-buttons');
    if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.className = 'blog-action-buttons';
        buttonContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin: 20px 0;
            max-width: 100%;
        `;
        
        // Responsive: ensure 2 columns max on all devices
        const style = document.createElement('style');
        style.textContent = `
            @media (min-width: 769px) {
                .blog-action-buttons {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
            @media (max-width: 768px) {
                .blog-action-buttons {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
            @media (max-width: 480px) {
                .blog-action-buttons {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Insert after meta container if exists, otherwise at the start
        const metaContainer = article.querySelector('.blog-meta-container');
        if (metaContainer) {
            metaContainer.parentNode.insertBefore(buttonContainer, metaContainer.nextSibling);
        } else {
            article.insertBefore(buttonContainer, article.firstChild);
        }
    }
    
    const printBtn = document.createElement('button');
    printBtn.className = 'print-button';
    printBtn.innerHTML = '<i class="fas fa-print"></i> প্রিন্ট করুন';
    printBtn.style.cssText = `
        padding: 8px 12px;
        background: transparent;
        color: #223142;
        border: none;
        border-radius: 0;
        cursor: pointer;
        font-size: 15px;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
        transition: color 0.15s ease-in-out;
        white-space: nowrap;
        min-width: 0;
        text-decoration: none;
        font-weight: normal;
    `;
    
    printBtn.addEventListener('click', () => {
        window.print();
    });
    
    printBtn.addEventListener('mouseenter', () => {
        printBtn.style.color = '#EEA73B';
    });
    
    printBtn.addEventListener('mouseleave', () => {
        printBtn.style.color = '#223142';
    });
    
    buttonContainer.appendChild(printBtn);
    
    // Add print styles
    if (!document.getElementById('print-styles')) {
        const style = document.createElement('style');
        style.id = 'print-styles';
        style.textContent = `
            @media print {
                .header, .navbar, .share-buttons, .print-button, 
                #dark-mode-toggle, #font-size-adjuster, #reading-progress-bar,
                .blog-nav, .blog-action-buttons { display: none !important; }
                body { background: white !important; color: black !important; }
                .blog-post-body { max-width: 100% !important; }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==================== 8. IMAGE LIGHTBOX ====================
function createImageLightbox() {
    const images = document.querySelectorAll('.blog-post-body img');
    if (images.length === 0) return;
    
    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.id = 'image-lightbox';
    lightbox.style.cssText = `
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 10000;
        justify-content: center;
        align-items: center;
    `;
    
    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 40px;
        font-size: 40px;
        color: white;
        background: none;
        border: none;
        cursor: pointer;
    `;
    
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
    
    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    // Add click handlers to images
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.style.display = 'flex';
        });
    });
}

// ==================== 10. VIEW COUNTER ====================
function implementViewCounter() {
    const pageUrl = window.location.href;
    const viewKey = `views_${pageUrl}`;
    
    let views = parseInt(localStorage.getItem(viewKey)) || 0;
    views++;
    localStorage.setItem(viewKey, views);
    
    const article = document.querySelector('.blog-post-body');
    if (!article) return;
    
    const metaContainer = article.querySelector('.blog-meta-container');
    if (!metaContainer) return;
    
    const viewCounter = document.createElement('div');
    viewCounter.className = 'view-counter';
    viewCounter.innerHTML = `<i class="fas fa-eye"></i> ${views} বার পড়া হয়েছে`;
    viewCounter.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 8px 15px;
        background: #28a745;
        color: white;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
        text-align: center;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
        transition: all 0.3s ease;
        cursor: default;
    `;
    
    // Add hover effect
    viewCounter.addEventListener('mouseenter', () => {
        viewCounter.style.transform = 'translateY(-2px)';
        viewCounter.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.4)';
    });
    
    viewCounter.addEventListener('mouseleave', () => {
        viewCounter.style.transform = 'translateY(0)';
        viewCounter.style.boxShadow = '0 2px 8px rgba(40, 167, 69, 0.3)';
    });
    
    metaContainer.appendChild(viewCounter);
}

// ==================== 11. LAZY LOADING IMAGES ====================
function implementLazyLoading() {
    const images = document.querySelectorAll('.blog-post-body img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ==================== 12. KEYBOARD NAVIGATION ====================
function implementKeyboardNavigation() {
    const prevLink = document.querySelector('.nav-link-prev');
    const nextLink = document.querySelector('.nav-link-next');
    
    document.addEventListener('keydown', (e) => {
        // J or Left Arrow - Previous post
        if ((e.key === 'j' || e.key === 'ArrowLeft') && prevLink) {
            window.location.href = prevLink.href;
        }
        // K or Right Arrow - Next post
        if ((e.key === 'k' || e.key === 'ArrowRight') && nextLink && !nextLink.classList.contains('d-none')) {
            window.location.href = nextLink.href;
        }
    });
}

// ==================== 13. LAST UPDATED DATE ====================
// ==================== 14. COMMENTS SECTION (BENGALI) ====================
function addCommentsSection() {
    // Bengali comment system is loaded separately via bengali-comments.js
    // This function is kept for compatibility but does nothing
    console.log('Bengali comment system will be loaded by bengali-comments.js');
}

// ==================== INITIALIZE ALL FEATURES ====================
document.addEventListener('DOMContentLoaded', () => {
    // Execute all features
    calculateReadingTime();
    createReadingProgressBar();
    generateTableOfContents();
    createShareButtons();
    // createDarkModeToggle(); // Disabled as per user request
    createFontSizeAdjuster();
    createPrintButton();
    createImageLightbox();
    implementViewCounter();
    implementLazyLoading();
    implementKeyboardNavigation();
    addCommentsSection();
    // Highlight.js fallback loader (fixes protocol-relative // URL issue in local file mode)
    (function ensureHighlightJs() {
        const existing = document.querySelector('script[src*="highlight.min.js"]');
        const hasHljs = typeof window.hljs !== 'undefined';
        if (hasHljs) return;
        // If existing tag used protocol-relative and failed under file://, load explicitly via https
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js';
        script.onload = () => {
            if (window.hljs && hljs.highlightAll) {
                hljs.highlightAll();
                console.log('✅ highlight.js loaded via fallback');
            }
        };
        script.onerror = () => console.warn('highlight.js fallback failed to load');
        document.head.appendChild(script);
    })();
    
    console.log('✅ All blog features loaded successfully!');
});
