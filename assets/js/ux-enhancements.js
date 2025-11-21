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

// 4. Mobile-specific adjustments
function mobileAdjustments() {
    if (window.innerWidth <= 768) {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.style.bottom = '20px';
            backToTop.style.right = '20px';
            backToTop.style.width = '45px';
            backToTop.style.height = '45px';
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
    mobileAdjustments();
});

// Re-adjust on window resize
window.addEventListener('resize', mobileAdjustments);
