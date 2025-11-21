/* Universal UX Enhancements Script */

// 1. Add Lazy Loading to All Images
function addLazyLoading() {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
}

// 2. Calculate and Display Reading Time
function calculateReadingTime() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // List of hub pages that should NOT show reading time
    const hubPages = [
        'index.html',
        'index-1.html',
        'blog.html',
        'blog-1.html',
        'blog-2.html',
        'blog-3.html',
        'blog-4.html',
        'blog-5.html',
        'blog-6.html',
        'blog-7.html',
        'blog-8.html',
        'blog-9.html',
        'blog-10.html',
        'archive.html',
        'about.html',
        'search-results.html',
        'privacy-en.html',
        'privacy-bn.html'
    ];

    // Don't show reading time on hub pages
    if (hubPages.includes(currentPage)) {
        return;
    }

    // Only show on individual blog posts - target only the actual content
    const article = document.querySelector('.blog-post-body');
    if (!article) return;

    const text = article.innerText || article.textContent;
    const wordCount = text.trim().split(/\s+/).length;
    const totalReadingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/min

    // Convert number to Bengali numerals
    const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const toBengaliNumber = (num) => num.toString().split('').map(digit => bengaliNumerals[parseInt(digit)]).join('');

    // Remove any existing badge to prevent duplicates
    const existingBadge = document.querySelector('.reading-time-badge');
    if (existingBadge) {
        existingBadge.remove();
    }

    // Create reading time badge
    const badge = document.createElement('div');
    badge.className = 'reading-time-badge';
    badge.innerHTML = `<i class="fas fa-clock"></i> ${toBengaliNumber(totalReadingTime)} মিনিট পড়ার সময়`;
    badge.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #EDA73B;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        display: block;
        opacity: 1;
        transition: opacity 0.3s ease;
    `;

    document.body.appendChild(badge);

    // Calculate time remaining based on scroll position
    function updateTimeRemaining() {
        // Get article position and height
        const articleRect = article.getBoundingClientRect();
        const articleTop = window.scrollY + articleRect.top;
        const articleHeight = articleRect.height;
        const articleBottom = articleTop + articleHeight;

        // Current scroll position (bottom of viewport)
        const viewportBottom = window.scrollY + window.innerHeight;
        const viewportTop = window.scrollY;

        // Calculate how much of the article has been scrolled past
        let scrollPercentage = 0;
        if (viewportBottom > articleTop) {
            const scrolledAmount = viewportBottom - articleTop;
            scrollPercentage = Math.min(100, (scrolledAmount / articleHeight) * 100);
        }

        const timeRemaining = Math.ceil(totalReadingTime * (1 - scrollPercentage / 100));

        // Check if the bottom of the article is visible in viewport
        const isArticleEndVisible = articleRect.bottom <= window.innerHeight;

        // Check if we're at the beginning (article top is visible in viewport)
        const isAtBeginning = articleRect.top >= 0 && articleRect.top <= window.innerHeight;

        if (isArticleEndVisible || viewportBottom >= articleBottom) {
            badge.innerHTML = `<i class="fas fa-check-circle"></i> পড়া শেষ!`;
        } else if (isAtBeginning) {
            // At the beginning - show total time
            badge.innerHTML = `<i class="fas fa-clock"></i> ${toBengaliNumber(totalReadingTime)} মিনিট পড়ার সময়`;
        } else if (timeRemaining > 0) {
            // In the middle - show remaining time
            badge.innerHTML = `<i class="fas fa-hourglass-half"></i> আরও ${toBengaliNumber(timeRemaining)} মিনিট বাকি`;
        } else {
            badge.innerHTML = `<i class="fas fa-clock"></i> ${toBengaliNumber(totalReadingTime)} মিনিট পড়ার সময়`;
        }
    }

    // Show badge when scrolling and update time
    let scrollTimeout;
    let hasScrolled = false;

    window.addEventListener('scroll', () => {
        hasScrolled = true;
        badge.style.opacity = '1';
        updateTimeRemaining();
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            badge.style.opacity = '0';
        }, 3000);
    });

    // Auto-hide initial badge after 5 seconds if user hasn't scrolled
    setTimeout(() => {
        if (!hasScrolled) {
            badge.style.opacity = '0';
        }
    }, 5000);
}

// 3. Back to Top Button
function createBackToTopButton() {
    const button = document.createElement('button');
    button.id = 'backToTop';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.setAttribute('aria-label', 'Back to top');
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #EDA73B;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        line-height: 1;
    `;

    document.body.appendChild(button);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });

    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
        button.style.background = '#d89530';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.background = '#EDA73B';
    });
}

// 4. Zen Mode (Focus Reading)
function createZenModeButton() {
    // Only show on individual blog posts - robust check
    if (!document.querySelector('.blog-post-body')) return;

    console.log('Initializing Zen Mode Button...'); // Debug

    const button = document.createElement('button');
    button.id = 'zenModeBtn';
    button.className = 'ux-floating-btn';
    button.innerHTML = '<i class="fas fa-spa"></i>';
    button.setAttribute('aria-label', 'Zen Mode');
    button.title = 'জেন মোড (Zen Mode)';

    // Add styles via class instead of inline for better responsiveness
    const style = document.createElement('style');
    style.textContent = `
        .ux-floating-btn {
            position: fixed;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #223142;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            line-height: 1;
        }
        
        /* Desktop Positioning (Left side, right of sidebar) */
        @media (min-width: 992px) {
            #zenModeBtn {
                left: 300px; /* 280px sidebar + 20px gap */
                bottom: 30px;
                right: auto;
            }
            #randomPostBtn {
                left: 300px;
                bottom: 90px; /* Stacked above Zen Mode */
                right: auto;
            }
        }

        /* Mobile Positioning (Left side) */
        @media (max-width: 991.98px) {
            #zenModeBtn {
                left: 20px;
                bottom: 30px; /* Same level as Back to Top but on left */
                right: auto;
            }
            #randomPostBtn {
                left: 20px;
                bottom: 90px; /* Stacked above Zen Mode */
                right: auto;
            }
        }

        /* Zen Mode Active Styles */
        body.zen-mode .header,
        body.zen-mode .navbar,
        body.zen-mode .blog-nav,
        body.zen-mode .related-posts,
        body.zen-mode .comments-section,
        body.zen-mode .share-buttons,
        body.zen-mode .newsletter-section,
        body.zen-mode .footer,
        body.zen-mode #backToTop,
        body.zen-mode #randomPostBtn {
            display: none !important;
        }
        body.zen-mode .main-wrapper {
            margin: 0 auto !important;
            max-width: 800px !important;
            padding: 60px 20px !important;
            background: #fdfdfd;
        }
        body.zen-mode {
            background: #fdfdfd !important;
            overflow-x: hidden; /* Prevent horizontal scroll */
        }
        body.zen-mode #zenModeBtn {
            background: #EDA73B;
            color: white;
            opacity: 1 !important; /* Always visible in Zen Mode */
            visibility: visible !important;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        document.body.classList.toggle('zen-mode');
        const isZen = document.body.classList.contains('zen-mode');
        button.innerHTML = isZen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-spa"></i>';

        // Notify user
        const msg = isZen ? 'জেন মোড চালু হয়েছে' : 'জেন মোড বন্ধ হয়েছে';
        showToast(msg);
    });

    // Show/hide logic
    window.addEventListener('scroll', () => {
        // Always show if in Zen Mode, otherwise follow scroll rule
        if (document.body.classList.contains('zen-mode')) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
            return;
        }

        if (window.pageYOffset > 100) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
}

// 5. Random Post (Serendipity)
function createRandomPostButton() {
    // Only show on individual blog posts - robust check
    if (!document.querySelector('.blog-post-body')) return;

    console.log('Initializing Random Post Button...'); // Debug

    const button = document.createElement('button');
    button.id = 'randomPostBtn';
    button.className = 'ux-floating-btn'; // Reuses styles defined in createZenModeButton
    button.innerHTML = '<i class="fas fa-dice"></i>';
    button.setAttribute('aria-label', 'Random Post');
    button.title = 'ভাগ্য পরীক্ষা (Random Post)';

    // No need to append style again as it's handled in createZenModeButton
    // But we need to ensure createZenModeButton runs first or we duplicate/miss styles.
    // To be safe, we can check if style exists or just rely on the fact that both run.
    // Actually, simpler to just append the button here. The CSS covers both IDs.

    document.body.appendChild(button);

    button.addEventListener('click', async () => {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        try {
            const response = await fetch('posts-index.json');
            const posts = await response.json();
            const currentPost = window.location.pathname.split('/').pop();

            // Filter out current post and non-blog pages
            const validPosts = posts.filter(post =>
                post !== currentPost &&
                post.endsWith('.html') &&
                !['index.html', 'about.html', 'contact.html'].includes(post)
            );

            if (validPosts.length > 0) {
                const randomPost = validPosts[Math.floor(Math.random() * validPosts.length)];
                window.location.href = randomPost;
            } else {
                showToast('আর কোন লেখা পাওয়া যায়নি!');
                button.innerHTML = '<i class="fas fa-dice"></i>';
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            showToast('দুঃখিত, কিছু ভুল হয়েছে!');
            button.innerHTML = '<i class="fas fa-dice"></i>';
        }
    });

    // Show/hide logic
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) { // Lowered threshold
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
}

// 6. Custom Text Selection
function applyCustomSelection() {
    const style = document.createElement('style');
    style.textContent = `
        ::selection {
            background: #EDA73B;
            color: white;
        }
        ::-moz-selection {
            background: #EDA73B;
            color: white;
        }
    `;
    document.head.appendChild(style);
}

// Helper: Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(34, 49, 66, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 30px;
        font-size: 14px;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(toast);

    // Trigger reflow
    toast.offsetHeight;
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// 7. Mobile-specific adjustments
function mobileAdjustments() {
    if (window.innerWidth <= 768) {
        const backToTop = document.getElementById('backToTop');
        const zenMode = document.getElementById('zenModeBtn');
        const randomPost = document.getElementById('randomPostBtn');

        if (backToTop) {
            backToTop.style.bottom = '20px';
            backToTop.style.right = '20px';
            backToTop.style.width = '45px';
            backToTop.style.height = '45px';
        }
        if (zenMode) {
            zenMode.style.bottom = '75px';
            zenMode.style.right = '20px';
            zenMode.style.width = '45px';
            zenMode.style.height = '45px';
        }
        if (randomPost) {
            randomPost.style.bottom = '130px';
            randomPost.style.right = '20px';
            randomPost.style.width = '45px';
            randomPost.style.height = '45px';
        }

        const readingBadge = document.querySelector('.reading-time-badge');
        if (readingBadge) {
            readingBadge.style.top = '10px';
            readingBadge.style.right = '10px';
            readingBadge.style.fontSize = '12px';
            readingBadge.style.padding = '6px 12px';
        }
    }
}

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    addLazyLoading();
    calculateReadingTime();
    createBackToTopButton();
    createZenModeButton();
    createRandomPostButton();
    applyCustomSelection();
    mobileAdjustments();
});

// Re-adjust on window resize
window.addEventListener('resize', mobileAdjustments);
