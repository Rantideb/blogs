/**
 * Geo-based Privacy Policy Router and Cookie Consent Manager
 * Detects user location and routes to appropriate privacy policy
 * Manages cookie consent banner and AdSense loading
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        ADSENSE_CLIENT: 'ca-pub-8340971949778309',
        CONSENT_KEY: 'cookie_consent',
        ADSENSE_LOADED_KEY: 'adsense_loaded',
        BANNER_DELAY: 1000, // Show banner after 1 second
        BANGLADESH_REGIONS: ['BD', 'Bangladesh'],
        WEST_BENGAL_KEYWORDS: ['West Bengal', 'Kolkata', 'Calcutta', 'WB'],
    };

    /**
     * Detect if user is from Bangladesh or West Bengal
     */
    function detectBengaliRegion(callback) {
        // Check for manual override (for testing)
        const manualLang = localStorage.getItem('manual_language_override');
        if (manualLang === 'bn' || manualLang === 'en') {
            console.log('Using manual language override:', manualLang);
            callback(manualLang === 'bn', manualLang);
            return;
        }
        
        // Check if running on localhost - use multiple fallback methods
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' || 
                           window.location.hostname === '';
        
        if (isLocalhost) {
            console.log('Running on localhost - using fallback detection methods');
            
            // Method 1: Check browser language first
            const browserLang = navigator.language || navigator.userLanguage || '';
            console.log('Browser language:', browserLang);
            
            if (browserLang.startsWith('bn') || browserLang.includes('BD')) {
                console.log('Detected Bengali from browser language');
                callback(true, 'bn');
                return;
            }
            
            // Method 2: Check timezone as additional hint
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            console.log('Timezone:', timezone);
            
            if (timezone === 'Asia/Dhaka' || timezone === 'Asia/Kolkata') {
                console.log('Detected Bangladesh/West Bengal from timezone');
                callback(true, 'bn');
                return;
            }
            
            // Method 3: Try alternative geo API that works on localhost
            fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data => {
                    console.log('Geo-detection data:', data);
                    const country = data.country_code || data.country || '';
                    const region = data.region || '';
                    const city = data.city || '';
                    
                    if (country === 'BD' || CONFIG.BANGLADESH_REGIONS.includes(country)) {
                        console.log('Detected Bangladesh from geo API');
                        callback(true, 'bn');
                        return;
                    }
                    
                    if (country === 'IN' && CONFIG.WEST_BENGAL_KEYWORDS.some(kw => 
                        region.includes(kw) || city.includes(kw)
                    )) {
                        console.log('Detected West Bengal from geo API');
                        callback(true, 'bn');
                        return;
                    }
                    
                    // Default to English
                    console.log('Defaulting to English');
                    callback(false, 'en');
                })
                .catch(err => {
                    console.log('All detection methods failed on localhost, defaulting to English:', err);
                    callback(false, 'en');
                });
            
            return;
        }
        
        // Production: Use ipapi.co (free, no API key needed)
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                const country = data.country_code || data.country || '';
                const region = data.region || '';
                const city = data.city || '';
                
                // Check for Bangladesh
                if (country === 'BD' || CONFIG.BANGLADESH_REGIONS.includes(country)) {
                    callback(true, 'bn');
                    return;
                }
                
                // Check for West Bengal (India)
                if (country === 'IN' && CONFIG.WEST_BENGAL_KEYWORDS.some(kw => 
                    region.includes(kw) || city.includes(kw)
                )) {
                    callback(true, 'bn');
                    return;
                }
                
                // Default to English for other regions
                callback(false, 'en');
            })
            .catch(err => {
                console.log('Geo-detection failed, using fallback methods:', err);
                // Fallback 1: check browser language
                const browserLang = navigator.language || navigator.userLanguage || '';
                if (browserLang.startsWith('bn') || browserLang.includes('BD')) {
                    callback(true, 'bn');
                    return;
                }
                
                // Fallback 2: check timezone
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                if (timezone === 'Asia/Dhaka' || timezone === 'Asia/Kolkata') {
                    callback(true, 'bn');
                    return;
                }
                
                // Final fallback: English
                callback(false, 'en');
            });
    }

    /**
     * Get privacy policy URL based on language
     */
    function getPrivacyPolicyUrl(lang) {
        return lang === 'bn' ? 'privacy-bn.html' : 'privacy-en.html';
    }

    /**
     * Auto-redirect to correct privacy policy page based on user location
     */
    function autoRedirectPrivacyPage() {
        const currentPage = window.location.pathname;
        const isOnPrivacyPage = currentPage.includes('privacy-en.html') || currentPage.includes('privacy-bn.html');
        
        if (!isOnPrivacyPage) {
            return; // Not on a privacy page, no need to redirect
        }
        
        detectBengaliRegion(function(isBengali, lang) {
            const correctPage = getPrivacyPolicyUrl(lang);
            const onEnglishPage = currentPage.includes('privacy-en.html');
            const onBengaliPage = currentPage.includes('privacy-bn.html');
            
            // Redirect if on wrong language page
            if (lang === 'bn' && onEnglishPage) {
                // User is from Bangladesh/West Bengal but on English page - redirect to Bengali
                window.location.href = 'privacy-bn.html';
            } else if (lang === 'en' && onBengaliPage) {
                // User is from other region but on Bengali page - redirect to English
                window.location.href = 'privacy-en.html';
            }
            // Otherwise, user is on correct page, do nothing
        });
    }

    /**
     * Update all privacy policy links on the page
     */
    function updatePrivacyLinks() {
        detectBengaliRegion(function(isBengali, lang) {
            const privacyUrl = getPrivacyPolicyUrl(lang);
            const labelBn = 'গোপনীয়তা নীতি';
            const labelEn = 'Privacy Policy';
            const label = (lang === 'bn') ? labelBn : labelEn;

            const links = document.querySelectorAll('a[href*="privacy"]');
            links.forEach(link => {
                try {
                    // Always set the href to the language-specific page
                    link.href = privacyUrl;

                    // Preserve icon if present, update label text inside .privacy-text if exists
                    const labelEl = link.querySelector('.privacy-text');
                    if (labelEl) {
                        labelEl.textContent = label;
                    } else {
                        // If no .privacy-text, try to preserve any <i> icon, else replace innerHTML
                        const iconEl = link.querySelector('i');
                        if (iconEl) {
                            // Rebuild inner HTML keeping the icon
                            link.innerHTML = iconEl.outerHTML + '<span class="privacy-text">' + label + '</span>';
                        } else {
                            link.textContent = label;
                        }
                    }
                } catch (e) {
                    // Fail silently but log to console for debugging
                    console.error('Failed to update privacy link', e);
                }
            });
        });
    }

    /**
     * Create and inject cookie consent banner
     */
    function createCookieBanner() {
        // Check if consent already given
        const consent = localStorage.getItem(CONFIG.CONSENT_KEY);
        if (consent) {
            if (consent === 'accepted') {
                loadAdSense();
            }
            return; // Don't show banner if choice already made
        }

        // Detect region and create banner with appropriate language
        detectBengaliRegion(function(isBengali, lang) {
            const privacyUrl = getPrivacyPolicyUrl(lang);
            
            // Banner text in both languages
            const bannerText = {
                en: {
                    title: '🍪 Cookie Notice',
                    message: 'We use cookies and similar technologies for analytics and personalized ads. By clicking "Accept", you consent to our use of cookies.',
                    privacyLink: 'Privacy Policy',
                    acceptBtn: '✓ Accept All',
                    declineBtn: '✕ Decline'
                },
                bn: {
                    title: '🍪 কুকি বিজ্ঞপ্তি',
                    message: 'আমরা বিশ্লেষণ এবং ব্যক্তিগত বিজ্ঞাপনের জন্য কুকি এবং অনুরূপ প্রযুক্তি ব্যবহার করি। "গ্রহণ করুন" ক্লিক করে, আপনি আমাদের কুকি ব্যবহারে সম্মতি দিচ্ছেন।',
                    privacyLink: 'গোপনীয়তা নীতি',
                    acceptBtn: '✓ সব গ্রহণ করুন',
                    declineBtn: '✕ প্রত্যাখ্যান'
                }
            };
            
            const text = bannerText[lang];
            
            // Create banner HTML
            const bannerHTML = `
                <div id="cookie-consent-banner" style="
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    color: #fff;
                    padding: 20px;
                    box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
                    z-index: 99999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    border-top: 2px solid rgba(255,255,255,0.1);
                ">
                    <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 15px;">
                        <div style="flex: 1; min-width: 250px;">
                            <p style="margin: 0; font-size: 14px; line-height: 1.6;">
                                <strong style="color: #e94560; font-size: 15px;">${text.title}</strong><br>
                                ${text.message}
                                <a href="${privacyUrl}" id="privacy-link-banner" style="color: #4ecca3; text-decoration: underline;">${text.privacyLink}</a>
                            </p>
                        </div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button id="cookie-accept-btn" style="
                                background: linear-gradient(135deg, #4ecca3 0%, #3ba785 100%);
                                color: #fff;
                                border: none;
                                padding: 12px 28px;
                                font-size: 14px;
                                font-weight: 600;
                                border-radius: 6px;
                                cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 10px rgba(78, 204, 163, 0.3);
                        ">
                            ${text.acceptBtn}
                        </button>
                        <button id="cookie-decline-btn" style="
                            background: transparent;
                            color: #fff;
                            border: 2px solid rgba(255,255,255,0.3);
                            padding: 12px 28px;
                            font-size: 14px;
                            font-weight: 600;
                            border-radius: 6px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                        ">
                            ${text.declineBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Inject banner
        const bannerContainer = document.createElement('div');
        bannerContainer.innerHTML = bannerHTML;
        document.body.appendChild(bannerContainer);

        // Add hover effects
        const acceptBtn = document.getElementById('cookie-accept-btn');
        const declineBtn = document.getElementById('cookie-decline-btn');

        acceptBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 15px rgba(78, 204, 163, 0.4)';
        });
        acceptBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 10px rgba(78, 204, 163, 0.3)';
        });

        declineBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255,255,255,0.1)';
            this.style.borderColor = 'rgba(255,255,255,0.5)';
        });
        declineBtn.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.borderColor = 'rgba(255,255,255,0.3)';
        });

        // Handle Accept button
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem(CONFIG.CONSENT_KEY, 'accepted');
            hideBanner();
            loadAdSense();
        });

        // Handle Decline button
        declineBtn.addEventListener('click', function() {
            localStorage.setItem(CONFIG.CONSENT_KEY, 'declined');
            hideBanner();
            // Don't load AdSense if declined
        });

        function hideBanner() {
            const banner = document.getElementById('cookie-consent-banner');
            if (banner) {
                banner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                banner.style.opacity = '0';
                banner.style.transform = 'translateY(100%)';
                setTimeout(() => banner.remove(), 300);
            }
        }
    });
    }

    /**
     * Load AdSense script dynamically
     */
    function loadAdSense() {
        // Check if already loaded
        if (window.adsenseLoaded || sessionStorage.getItem(CONFIG.ADSENSE_LOADED_KEY)) {
            return;
        }

        window.adsenseLoaded = true;
        sessionStorage.setItem(CONFIG.ADSENSE_LOADED_KEY, 'true');

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.ADSENSE_CLIENT}`;
        script.crossOrigin = 'anonymous';
        
        script.onload = function() {
            console.log('AdSense loaded successfully');
            // Initialize any waiting ad units
            initializeWaitingAdUnits();
        };

        script.onerror = function() {
            console.error('Failed to load AdSense');
        };

        document.head.appendChild(script);
    }

    /**
     * Initialize ad units that are waiting for consent
     */
    function initializeWaitingAdUnits() {
        const waitingAds = document.querySelectorAll('ins.adsbygoogle[data-wait="1"]');
        waitingAds.forEach(function(adElement) {
            try {
                adElement.removeAttribute('data-wait');
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (e) {
                console.error('Failed to initialize ad unit:', e);
            }
        });
    }

    /**
     * Initialize on page load
     */
    function init() {
        // Auto-redirect to correct privacy page if needed
        autoRedirectPrivacyPage();
        
        // Update privacy policy links
        updatePrivacyLinks();

        // Show cookie banner after a delay
        setTimeout(function() {
            createCookieBanner();
        }, CONFIG.BANNER_DELAY);

        // If consent already given, load AdSense immediately
        const consent = localStorage.getItem(CONFIG.CONSENT_KEY);
        if (consent === 'accepted') {
            loadAdSense();
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose functions globally for debugging
    window.CookieConsentManager = {
        reset: function() {
            localStorage.removeItem(CONFIG.CONSENT_KEY);
            sessionStorage.removeItem(CONFIG.ADSENSE_LOADED_KEY);
            window.adsenseLoaded = false;
            location.reload();
        },
        getConsent: function() {
            return localStorage.getItem(CONFIG.CONSENT_KEY);
        },
        detectRegion: detectBengaliRegion,
        
        // Manual language override for testing
        setLanguage: function(lang) {
            if (lang === 'bn' || lang === 'bengali') {
                localStorage.setItem('manual_language_override', 'bn');
                console.log('✓ Language set to Bengali. Reloading page...');
                setTimeout(() => location.reload(), 500); // Auto-reload after 500ms
            } else if (lang === 'en' || lang === 'english') {
                localStorage.setItem('manual_language_override', 'en');
                console.log('✓ Language set to English. Reloading page...');
                setTimeout(() => location.reload(), 500); // Auto-reload after 500ms
            } else {
                console.error('Invalid language. Use "bn" or "en"');
            }
        },
        
        // Clear manual override
        clearLanguageOverride: function() {
            localStorage.removeItem('manual_language_override');
            console.log('✓ Language override cleared. Will use auto-detection.');
            console.log('Run: location.reload()');
        },
        
        // Check current settings
        getSettings: function() {
            return {
                consent: localStorage.getItem(CONFIG.CONSENT_KEY),
                languageOverride: localStorage.getItem('manual_language_override'),
                hostname: window.location.hostname,
                isLocalhost: window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1',
                browserLanguage: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            };
        }
    };

})();
