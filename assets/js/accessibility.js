/**
 * Accessibility Improvements
 * ARIA labels, semantic HTML, and keyboard navigation enhancements
 */

function improveAccessibility() {
    // Add skip to content link
    addSkipToContent();
    
    // Improve navigation ARIA
    improveNavigationARIA();
    
    // Add ARIA labels to interactive elements
    addARIALabels();
    
    // Improve focus indicators
    improveFocusIndicators();
    
    // Add keyboard shortcuts info
    addKeyboardShortcutsInfo();
    
    // Improve image alt texts
    improveImageAltTexts();
    
    // Add language attributes
    addLanguageAttributes();
}

function addSkipToContent() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'মূল কন্টেন্টে যান';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #223142;
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        z-index: 10001;
        border-radius: 0 0 5px 0;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add ID to main content
    const mainContent = document.querySelector('.blog-post-body') || document.querySelector('.main-wrapper');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
        mainContent.setAttribute('role', 'main');
    }
}

function improveNavigationARIA() {
    // Header navigation
    const header = document.querySelector('.header');
    if (header) {
        header.setAttribute('role', 'banner');
    }
    
    // Main navigation
    const nav = document.querySelector('.navbar');
    if (nav) {
        nav.setAttribute('role', 'navigation');
        nav.setAttribute('aria-label', 'প্রধান নেভিগেশন');
    }
    
    // Blog navigation (prev/next)
    const blogNav = document.querySelector('.blog-nav');
    if (blogNav) {
        blogNav.setAttribute('role', 'navigation');
        blogNav.setAttribute('aria-label', 'ব্লগ পোস্ট নেভিগেশন');
        
        const prevLink = blogNav.querySelector('.nav-link-prev');
        const nextLink = blogNav.querySelector('.nav-link-next');
        
        if (prevLink) {
            prevLink.setAttribute('aria-label', 'পূর্ববর্তী পোস্ট');
        }
        if (nextLink) {
            nextLink.setAttribute('aria-label', 'পরবর্তী পোস্ট');
        }
    }
    
    // Article
    const article = document.querySelector('.blog-post');
    if (article) {
        article.setAttribute('role', 'article');
    }
}

function addARIALabels() {
    // Social links
    const socialLinks = document.querySelectorAll('.social-list a');
    const socialLabels = {
        'twitter': 'টুইটার',
        'linkedin': 'লিংকডইন',
        'github': 'গিটহাব',
        'facebook': 'ফেসবুক'
    };
    
    socialLinks.forEach(link => {
        const href = link.href.toLowerCase();
        Object.keys(socialLabels).forEach(platform => {
            if (href.includes(platform) && !link.getAttribute('aria-label')) {
                link.setAttribute('aria-label', `${socialLabels[platform]}-এ ফলো করুন`);
            }
        });
    });
    
    // Share buttons
    setTimeout(() => {
        const shareButtons = document.querySelectorAll('.share-button');
        shareButtons.forEach(btn => {
            const text = btn.textContent.trim();
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', `${text}-এ শেয়ার করুন`);
            }
        });
    }, 1000);
    
    // Dark mode toggle
    setTimeout(() => {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle && !darkModeToggle.getAttribute('aria-label')) {
            darkModeToggle.setAttribute('aria-label', 'ডার্ক মোড টগল করুন');
            darkModeToggle.setAttribute('role', 'switch');
            darkModeToggle.setAttribute('aria-checked', document.body.classList.contains('dark-mode'));
            
            darkModeToggle.addEventListener('click', () => {
                const isDark = document.body.classList.contains('dark-mode');
                darkModeToggle.setAttribute('aria-checked', isDark);
            });
        }
    }, 1000);
    
    // Search input
    setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput && !searchInput.getAttribute('aria-label')) {
            searchInput.setAttribute('aria-label', 'ব্লগ পোস্ট খুঁজুন');
            searchInput.setAttribute('role', 'searchbox');
        }
    }, 1000);
}

function improveFocusIndicators() {
    const style = document.createElement('style');
    style.textContent = `
        /* Enhanced focus indicators for accessibility */
        a:focus, button:focus, input:focus, select:focus, textarea:focus {
            outline: 3px solid #223142;
            outline-offset: 2px;
        }
        
        /* Focus visible for keyboard users only */
        a:focus:not(:focus-visible),
        button:focus:not(:focus-visible),
        input:focus:not(:focus-visible) {
            outline: none;
        }
        
        a:focus-visible, button:focus-visible, input:focus-visible {
            outline: 3px solid #223142;
            outline-offset: 2px;
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
            a, button {
                border: 2px solid currentColor;
            }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
}

function addKeyboardShortcutsInfo() {
    const shortcutsBtn = document.createElement('button');
    shortcutsBtn.innerHTML = '<i class="fas fa-keyboard"></i>';
    shortcutsBtn.setAttribute('aria-label', 'কীবোর্ড শর্টকাট দেখুন');
    shortcutsBtn.style.cssText = `
        position: fixed;
        bottom: 250px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #17a2b8;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9998;
        transition: all 0.3s;
    `;
    
    shortcutsBtn.addEventListener('click', () => {
        showKeyboardShortcutsModal();
    });
    
    document.body.appendChild(shortcutsBtn);
}

function showKeyboardShortcutsModal() {
    const modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-labelledby', 'shortcuts-title');
    modal.setAttribute('aria-modal', 'true');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        ">
            <h2 id="shortcuts-title" style="margin: 0 0 20px 0; color: #223142;">কীবোর্ড শর্টকাট</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px; font-weight: 600;">J বা ←</td>
                    <td style="padding: 10px;">পূর্ববর্তী পোস্ট</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px; font-weight: 600;">K বা →</td>
                    <td style="padding: 10px;">পরবর্তী পোস্ট</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px; font-weight: 600;">Tab</td>
                    <td style="padding: 10px;">পরবর্তী উপাদানে যান</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px; font-weight: 600;">Shift + Tab</td>
                    <td style="padding: 10px;">পূর্ববর্তী উপাদানে যান</td>
                </tr>
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px; font-weight: 600;">Enter</td>
                    <td style="padding: 10px;">লিঙ্ক বা বাটন সক্রিয় করুন</td>
                </tr>
                <tr>
                    <td style="padding: 10px; font-weight: 600;">Esc</td>
                    <td style="padding: 10px;">মোডাল বন্ধ করুন</td>
                </tr>
            </table>
            <button onclick="this.closest('#shortcuts-modal').remove()" style="
                margin-top: 20px;
                padding: 10px 20px;
                background: #223142;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
            ">বন্ধ করুন</button>
        </div>
    `;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('shortcuts-modal')) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
    
    // Focus the close button
    setTimeout(() => {
        modal.querySelector('button').focus();
    }, 100);
}

function improveImageAltTexts() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.alt || img.alt.toLowerCase() === 'image') {
            // Try to get alt from title or surrounding context
            const figure = img.closest('figure');
            const caption = figure ? figure.querySelector('figcaption') : null;
            
            if (caption) {
                img.alt = caption.textContent.trim();
            } else if (img.title) {
                img.alt = img.title;
            } else {
                img.alt = 'ব্লগ ছবি';
            }
        }
    });
}

function addLanguageAttributes() {
    // Set main language
    if (!document.documentElement.lang) {
        document.documentElement.lang = 'bn';
    }
    
    // Mark English text sections
    const article = document.querySelector('.blog-post-body');
    if (article) {
        const paragraphs = article.querySelectorAll('p');
        paragraphs.forEach(p => {
            const text = p.textContent;
            // Simple heuristic: if mostly Latin characters, mark as English
            const latinChars = text.match(/[a-zA-Z]/g);
            if (latinChars && latinChars.length / text.length > 0.7) {
                p.setAttribute('lang', 'en');
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    improveAccessibility();
    console.log('✅ Accessibility improvements loaded!');
});
