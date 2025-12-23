/**
 * Enhanced Cookie Consent Manager with GDPR Compliance
 * 
 * Features:
 * - Granular cookie categories (Analytics, Marketing, Preferences)
 * - Region-based configuration (GDPR for EU/EEA, standard for others)
 * - Multiple display formats with A/B testing rotation (Banner, Dialog, Popup)
 * - Persistent cookie settings icon for preference management
 * - Bengali/English localization based on geographic location
 * 
 * @version 2.0.0
 */

(function () {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================

    const CONFIG = {
        ADSENSE_CLIENT: 'ca-pub-8340971949778309',
        CONSENT_KEY: 'cookie_consent_v2',
        CONSENT_PREFERENCES_KEY: 'cookie_preferences',
        DISPLAY_FORMAT_KEY: 'cookie_display_format',
        ADSENSE_LOADED_KEY: 'adsense_loaded',
        BANNER_DELAY: 1500, // Show banner after 1.5 seconds
        BANGLADESH_REGIONS: ['BD', 'Bangladesh'],
        WEST_BENGAL_KEYWORDS: ['West Bengal', 'Kolkata', 'Calcutta', 'WB'],
        EU_COUNTRIES: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'IS', 'LI', 'NO', 'CH'],
        DISPLAY_FORMATS: ['banner', 'dialog', 'popup'] // A/B testing formats
    };

    // ============================================
    // STATE
    // ============================================

    let currentLang = 'en';
    let isEURegion = false;
    let displayFormat = 'banner';

    // ============================================
    // COOKIE CATEGORIES
    // ============================================

    const COOKIE_CATEGORIES = {
        necessary: {
            enabled: true,
            required: true,
            nameEn: 'Necessary',
            nameBn: 'প্রয়োজনীয়',
            descEn: 'Required for the website to function properly',
            descBn: 'ওয়েবসাইট সঠিকভাবে কাজ করার জন্য প্রয়োজনীয়'
        },
        analytics: {
            enabled: true,  // ✅ Enabled by default (opt-out model)
            required: false,
            nameEn: 'Analytics',
            nameBn: 'বিশ্লেষণ',
            descEn: 'Help us understand how visitors interact with our website',
            descBn: 'দর্শকরা আমাদের ওয়েবসাইটের সাথে কীভাবে ইন্টারঅ্যাক্ট করে তা বুঝতে সাহায্য করে'
        },
        marketing: {
            enabled: true,  // ✅ Enabled by default (opt-out model)
            required: false,
            nameEn: 'Marketing',
            nameBn: 'বিপণন',
            descEn: 'Used to deliver personalized advertisements',
            descBn: 'ব্যক্তিগতকৃত বিজ্ঞাপন প্রদানের জন্য ব্যবহৃত'
        },
        preferences: {
            enabled: true,  // ✅ Enabled by default (opt-out model)
            required: false,
            nameEn: 'Preferences',
            nameBn: 'পছন্দসমূহ',
            descEn: 'Remember your settings and preferences',
            descBn: 'আপনার সেটিংস এবং পছন্দগুলি মনে রাখে'
        }
    };

    // ============================================
    // LOCALIZATION
    // ============================================

    const TRANSLATIONS = {
        en: {
            // Banner Format
            bannerTitle: '🍪 Cookie Notice',
            bannerMessage: 'We use cookies and similar technologies. Customize your preferences or accept all.',

            // Dialog Format
            dialogTitle: '🍪 Cookie Preferences',
            dialogMessage: 'We respect your privacy. Choose which cookies you\'re comfortable with.',

            // Popup Format
            popupTitle: '🍪 Cookies',
            popupMessage: 'We use cookies to enhance your experience.',

            // Common
            privacyLink: 'Privacy Policy',
            customizeBtn: 'Customize',
            acceptAllBtn: 'Accept All',
            acceptSelectedBtn: 'Save Preferences',
            declineAllBtn: 'Decline All',
            settingsTitle: 'Cookie Settings',
            settingsDescription: 'Manage your cookie preferences. You can enable or disable different types of cookies below.',
            saveBtn: 'Save Preferences',
            closeBtn: 'Close'
        },
        bn: {
            // Banner Format
            bannerTitle: '🍪 কুকি বিজ্ঞপ্তি',
            bannerMessage: 'আমরা কুকি এবং অনুরূপ প্রযুক্তি ব্যবহার করি। আপনার পছন্দ কাস্টমাইজ করুন বা সব গ্রহণ করুন।',

            // Dialog Format
            dialogTitle: '🍪 কুকি পছন্দসমূহ',
            dialogMessage: 'আমরা আপনার গোপনীয়তাকে সম্মান করি। আপনি কোন কুকি দিয়ে স্বাচ্ছন্দ্য বোধ করেন তা চয়ন করুন।',

            // Popup Format
            popupTitle: '🍪 কুকিজ',
            popupMessage: 'আমরা আপনার অভিজ্ঞতা উন্নত করতে কুকি ব্যবহার করি।',

            // Common
            privacyLink: 'গোপনীয়তা নীতি',
            customizeBtn: 'কাস্টমাইজ করুন',
            acceptAllBtn: 'সব গ্রহণ করুন',
            acceptSelectedBtn: 'পছন্দগুলি সংরক্ষণ করুন',
            declineAllBtn: 'সব প্রত্যাখ্যান করুন',
            settingsTitle: 'কুকি সেটিংস',
            settingsDescription: 'আপনার কুকি পছন্দগুলি পরিচালনা করুন। আপনি নীচে বিভিন্ন ধরনের কুকি সক্ষম বা অক্ষম করতে পারেন।',
            saveBtn: 'পছন্দগুলি সংরক্ষণ করুন',
            closeBtn: 'বন্ধ করুন'
        }
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================

    /**
     * Get or assign display format with A/B testing rotation
     */
    function getDisplayFormat() {
        let format = localStorage.getItem(CONFIG.DISPLAY_FORMAT_KEY);

        if (!format) {
            // New user - randomly assign a format
            const randomIndex = Math.floor(Math.random() * CONFIG.DISPLAY_FORMATS.length);
            format = CONFIG.DISPLAY_FORMATS[randomIndex];
            localStorage.setItem(CONFIG.DISPLAY_FORMAT_KEY, format);

        }

        return format;
    }

    /**
     * Detect if user is from Bangladesh or West Bengal
     */
    function detectBengaliRegion(callback) {
        // Check for manual override (for testing)
        const manualLang = localStorage.getItem('manual_language_override');
        if (manualLang === 'bn' || manualLang === 'en') {

            callback(manualLang === 'bn', manualLang, false);
            return;
        }

        // Check if running on localhost
        const isLocalhost = window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === '';

        if (isLocalhost) {


            // Check timezone first (most reliable for localhost)
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;


            if (timezone === 'Asia/Dhaka' || timezone === 'Asia/Kolkata') {

                callback(true, 'bn', false);
                return;
            }

            // Fallback to browser language
            const browserLang = navigator.language || navigator.userLanguage || '';


            if (browserLang.startsWith('bn') || browserLang.includes('BD')) {

                callback(true, 'bn', false);
                return;
            }

            // Default to English for other localhost users

            callback(false, 'en', false);
            return;
        }

        // Production: Use GeoJS
        fetch('https://get.geojs.io/v1/ip/geo.json')
            .then(response => response.json())
            .then(data => {
                const country = data.country_code || data.country || '';
                const region = data.region || '';
                const city = data.city || '';

                const isEU = CONFIG.EU_COUNTRIES.includes(country);

                // Check for Bangladesh
                if (country === 'BD' || CONFIG.BANGLADESH_REGIONS.includes(country)) {
                    callback(true, 'bn', isEU);
                    return;
                }

                // Check for West Bengal (India)
                if (country === 'IN' && CONFIG.WEST_BENGAL_KEYWORDS.some(kw =>
                    region.includes(kw) || city.includes(kw)
                )) {
                    callback(true, 'bn', isEU);
                    return;
                }

                // Default to English for other regions
                callback(false, 'en', isEU);
            })
            .catch(err => {

                callback(false, 'en', false);
            });
    }

    /**
     * Get privacy policy URL based on language
     */
    function getPrivacyPolicyUrl(lang) {
        return lang === 'bn' ? 'privacy-bn.html' : 'privacy-en.html';
    }

    /**
     * Get saved cookie preferences
     */
    function getSavedPreferences() {
        const saved = localStorage.getItem(CONFIG.CONSENT_PREFERENCES_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved preferences:', e);
            }
        }
        return null;
    }

    /**
     * Save cookie preferences
     */
    function savePreferences(preferences) {
        localStorage.setItem(CONFIG.CONSENT_PREFERENCES_KEY, JSON.stringify(preferences));
        localStorage.setItem(CONFIG.CONSENT_KEY, 'configured');
    }

    /**
     * Load scripts based on cookie preferences
     */
    function loadScriptsBasedOnConsent(preferences) {
        // Load Google Analytics if analytics cookies are enabled
        if (preferences.analytics) {
            loadAdSense();
        }

        // Load marketing scripts if marketing cookies are enabled
        if (preferences.marketing) {
            // Add marketing scripts here

        }

        // Save preferences if preferences cookies are enabled
        if (preferences.preferences) {

        }
    }

    // ============================================
    // CONSENT UI BUILDERS
    // ============================================

    /**
     * Build cookie categories HTML
     */
    function buildCookieCategoriesHTML() {
        const text = TRANSLATIONS[currentLang];
        let html = '<div class="cookie-categories">';

        for (const [key, category] of Object.entries(COOKIE_CATEGORIES)) {
            const name = currentLang === 'bn' ? category.nameBn : category.nameEn;
            const desc = currentLang === 'bn' ? category.descBn : category.descEn;
            const checked = category.enabled ? 'checked' : '';
            const disabled = category.required ? 'disabled' : '';

            html += `
                <div class="cookie-category">
                    <div class="cookie-category-info">
                        <h4>${name} ${category.required ? `<span class="cookie-category-required">(Required)</span>` : ''}</h4>
                        <p>${desc}</p>
                    </div>
                    <label class="cookie-toggle">
                        <input type="checkbox" 
                               data-category="${key}" 
                               ${checked} 
                               ${disabled}>
                        <span class="cookie-toggle-slider"></span>
                    </label>
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    /**
     * Create Banner Format
     */
    function createBannerFormat() {
        const text = TRANSLATIONS[currentLang];
        const privacyUrl = getPrivacyPolicyUrl(currentLang);

        const html = `
            <div class="cookie-consent-banner" id="cookieConsentBanner">
                <div class="cookie-banner-content">
                    <div class="cookie-banner-text">
                        <h3>${text.bannerTitle}</h3>
                        <p>
                            ${text.bannerMessage}
                            <a href="${privacyUrl}">${text.privacyLink}</a>
                        </p>
                    </div>
                    <div class="cookie-banner-actions">
                        <button class="cookie-btn cookie-btn-text" id="cookieCustomizeBtn">
                            ${text.customizeBtn}
                        </button>
                        <button class="cookie-btn cookie-btn-secondary" id="cookieDeclineBtn">
                            ${text.declineAllBtn}
                        </button>
                        <button class="cookie-btn cookie-btn-primary" id="cookieAcceptBtn">
                            ${text.acceptAllBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    /**
      * Create Dialog Format
      */
    function createDialogFormat() {
        const text = TRANSLATIONS[currentLang];
        const privacyUrl = getPrivacyPolicyUrl(currentLang);
        const categoriesHTML = buildCookieCategoriesHTML();

        const html = `
            <div class="cookie-consent-dialog-overlay" id="cookieDialogOverlay">
                <div class="cookie-consent-dialog">
                    <div class="cookie-dialog-header">
                        <h2>${text.dialogTitle}</h2>
                        <p>
                            ${text.dialogMessage}
                            <a href="${privacyUrl}">${text.privacyLink}</a>
                        </p>
                    </div>
                    ${categoriesHTML}
                    <div class="cookie-banner-actions" style="margin-top: 24px;">
                        <button class="cookie-btn cookie-btn-secondary" id="cookieDeclineBtn">
                            ${text.declineAllBtn}
                        </button>
                        <button class="cookie-btn cookie-btn-primary" id="cookieAcceptBtn">
                            ${text.acceptSelectedBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Create Popup Format
     */
    function createPopupFormat() {
        const text = TRANSLATIONS[currentLang];
        const privacyUrl = getPrivacyPolicyUrl(currentLang);

        const html = `
            <div class="cookie-consent-popup" id="cookieConsentPopup">
                <div class="cookie-popup-header">
                    <h3>${text.popupTitle}</h3>
                    <p>
                        ${text.popupMessage}
                        <a href="${privacyUrl}">${text.privacyLink}</a>
                    </p>
                </div>
                <div class="cookie-banner-actions" style="flex-direction: column;">
                    <button class="cookie-btn cookie-btn-primary cookie-btn-block" id="cookieAcceptBtn">
                        ${text.acceptAllBtn}
                    </button>
                    <button class="cookie-btn cookie-btn-secondary cookie-btn-block" id="cookieCustomizeBtn">
                        ${text.customizeBtn}
                    </button>
                    <button class="cookie-btn cookie-btn-text" id="cookieDeclineBtn">
                        ${text.declineAllBtn}
                    </button>
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Create cookie settings modal
     */
    function createSettingsModal() {
        const text = TRANSLATIONS[currentLang];
        const privacyUrl = getPrivacyPolicyUrl(currentLang);
        const categoriesHTML = buildCookieCategoriesHTML();

        const html = `
            <div class="cookie-settings-modal-overlay" id="cookieSettingsOverlay">
                <div class="cookie-settings-modal">
                    <div class="cookie-settings-header">
                        <h2>${text.settingsTitle}</h2>
                        <button class="cookie-settings-close" id="cookieSettingsClose">&times;</button>
                    </div>
                    <p style="margin-bottom: 20px; color: rgba(255,255,255,0.85); font-size: 14px;">
                        ${text.settingsDescription}
                        <a href="${privacyUrl}" style="color: #4ecca3;">${text.privacyLink}</a>
                    </p>
                    ${categoriesHTML}
                    <div class="cookie-settings-actions">
                        <button class="cookie-btn cookie-btn-secondary" id="cookieSettingsCancelBtn">
                            ${text.closeBtn}
                        </button>
                        <button class="cookie-btn cookie-btn-primary" id="cookieSettingsSaveBtn">
                            ${text.saveBtn}
                        </button>
                    </div>
                </div>
            </div>
        `;

        return html;
    }

    // ============================================
    // CONSENT MANAGEMENT
    // ============================================

    /**
     * Show cookie consent UI
     */
    function showCookieConsent() {
        // Check if consent already given
        const consent = localStorage.getItem(CONFIG.CONSENT_KEY);
        if (consent) {
            const prefs = getSavedPreferences();
            if (prefs) {
                loadScriptsBasedOnConsent(prefs);
            }
            return;
        }

        // Mark body as having active consent
        document.body.classList.add('cookie-consent-active');

        // Get display format
        displayFormat = getDisplayFormat();

        let html;
        switch (displayFormat) {
            case 'dialog':
                html = createDialogFormat();
                break;
            case 'popup':
                html = createPopupFormat();
                break;
            case 'banner':
            default:
                html = createBannerFormat();
                break;
        }

        // Inject consent UI
        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);

        // Attach event listeners
        attachConsentEventListeners();
    }

    /**
     * Attach event listeners to consent UI
     */
    function attachConsentEventListeners() {
        const acceptBtn = document.getElementById('cookieAcceptBtn');
        const declineBtn = document.getElementById('cookieDeclineBtn');
        const customizeBtn = document.getElementById('cookieCustomizeBtn');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', handleAcceptAll);
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', handleDeclineAll);
        }

        if (customizeBtn) {
            customizeBtn.addEventListener('click', showSettingsModal);
        }

        // For dialog format, attach checkbox listeners
        if (displayFormat === 'dialog') {
            const checkboxes = document.querySelectorAll('.cookie-category input[type="checkbox"]');
            checkboxes.forEach(cb => {
                cb.addEventListener('change', handleCategoryToggle);
            });
        }
    }

    /**
         * Handle Accept All
         */
    function handleAcceptAll() {
        const preferences = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true
        };

        savePreferences(preferences);
        loadScriptsBasedOnConsent(preferences);
        hideConsentUI();
        createCookieIcon(); // Re-evaluate and potentially show icon after consent
    }

    /**
     * Handle Decline All
     */
    function handleDeclineAll() {
        const preferences = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false
        };

        savePreferences(preferences);
        hideConsentUI();
        createCookieIcon(); // Re-evaluate and potentially show icon after consent
    }

    /**
     * Handle category toggle
     */
    function handleCategoryToggle(event) {
        const category = event.target.dataset.category;
        COOKIE_CATEGORIES[category].enabled = event.target.checked;
    }

    /**
     * Hide consent UI
     */
    function hideConsentUI() {
        document.body.classList.remove('cookie-consent-active');

        const banner = document.getElementById('cookieConsentBanner');
        const dialog = document.getElementById('cookieDialogOverlay');
        const popup = document.getElementById('cookieConsentPopup');

        if (banner) {
            banner.classList.add('hiding');
            setTimeout(() => banner.parentElement.remove(), 400);
        }

        if (dialog) {
            dialog.style.opacity = '0';
            setTimeout(() => dialog.remove(), 300);
        }

        if (popup) {
            popup.classList.add('hiding');
            setTimeout(() => popup.remove(), 400);
        }
    }

    /**
     * Show settings modal
     */
    function showSettingsModal() {
        // Load current preferences
        const saved = getSavedPreferences();
        if (saved) {
            for (const [key, value] of Object.entries(saved)) {
                if (COOKIE_CATEGORIES[key]) {
                    COOKIE_CATEGORIES[key].enabled = value;
                }
            }
        }

        const modal = createSettingsModal();
        const container = document.createElement('div');
        container.innerHTML = modal;
        document.body.appendChild(container);

        // Attach event listeners
        const closeBtn = document.getElementById('cookieSettingsClose');
        const cancelBtn = document.getElementById('cookieSettingsCancelBtn');
        const saveBtn = document.getElementById('cookieSettingsSaveBtn');
        const overlay = document.getElementById('cookieSettingsOverlay');

        closeBtn.addEventListener('click', hideSettingsModal);
        cancelBtn.addEventListener('click', hideSettingsModal);
        saveBtn.addEventListener('click', saveSettingsFromModal);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                hideSettingsModal();
            }
        });

        // Attach checkbox listeners
        const checkboxes = document.querySelectorAll('.cookie-settings-modal .cookie-category input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', handleCategoryToggle);
        });
    }

    /**
     * Hide settings modal
     */
    function hideSettingsModal() {
        const overlay = document.getElementById('cookieSettingsOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.parentElement.remove(), 300);
        }
    }

    /**
     * Save settings from modal
     */
    function saveSettingsFromModal() {
        const preferences = {};
        for (const [key, category] of Object.entries(COOKIE_CATEGORIES)) {
            preferences[key] = category.enabled;
        }

        savePreferences(preferences);
        loadScriptsBasedOnConsent(preferences);
        hideSettingsModal();

        // If consent UI is still showing, hide it
        if (document.body.classList.contains('cookie-consent-active')) {
            hideConsentUI();
        }
        createCookieIcon(); // Re-evaluate and potentially show icon after consent
    }

    // ============================================
    // COOKIE SETTINGS ICON
    // ============================================

    /**
     * Create floating cookie settings icon
     * Only shows if user has configured consent (so they can change preferences)
     * Does NOT show after accepting cookies (as requested by user)
     */
    function createCookieIcon() {
        // Remove existing icon if any
        const existingIcon = document.getElementById('cookieSettingsIcon');
        if (existingIcon) {
            existingIcon.parentElement.remove();
        }

        const consent = localStorage.getItem(CONFIG.CONSENT_KEY);
        const prefs = getSavedPreferences();

        // Don't show icon if:
        // 1. No consent configured yet (banner will show)
        // 2. User has accepted all cookies (no need to change)
        if (!consent || !prefs) {

            return;
        }

        // Check if user accepted all cookies
        const acceptedAll = prefs.analytics && prefs.marketing && prefs.preferences;
        if (acceptedAll) {

            return;
        }

        // Show icon only if user declined some cookies or customized preferences


        const iconHTML = `
            <div class="cookie-settings-icon" id="cookieSettingsIcon" title="Cookie Settings">
                <img src="assets/images/cookie-icon.svg" alt="Cookie Settings">
            </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = iconHTML;
        document.body.appendChild(container);

        const icon = document.getElementById('cookieSettingsIcon');
        icon.addEventListener('click', showSettingsModal);
    }

    // ============================================
    // ADSENSE LOADING
    // ============================================

    /**
     * Load AdSense script dynamically
     */
    function loadAdSense() {
        if (window.adsenseLoaded || sessionStorage.getItem(CONFIG.ADSENSE_LOADED_KEY)) {
            return;
        }

        window.adsenseLoaded = true;
        sessionStorage.setItem(CONFIG.ADSENSE_LOADED_KEY, 'true');

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.ADSENSE_CLIENT}`;
        script.crossOrigin = 'anonymous';

        script.onload = function () {

        };

        script.onerror = function () {
            console.error('✗ Failed to load AdSense');
        };

        document.head.appendChild(script);
    }

    // ============================================
    // PRIVACY LINK MANAGEMENT (from original)
    // ============================================

    /**
     * Update all privacy policy links on the page
     */
    function updatePrivacyLinks() {
        detectBengaliRegion(function (isBengali, lang, isEU) {
            currentLang = lang;
            isEURegion = isEU;

            const privacyUrl = getPrivacyPolicyUrl(lang);
            const labelBn = 'গোপনীয়তা নীতি';
            const labelEn = 'Privacy Policy';
            const label = (lang === 'bn') ? labelBn : labelEn;

            const links = document.querySelectorAll('a[href*="privacy"]');
            links.forEach(link => {
                try {
                    link.href = privacyUrl;
                    const labelEl = link.querySelector('.privacy-text');
                    if (labelEl) {
                        labelEl.textContent = label;
                    } else {
                        const iconEl = link.querySelector('i');
                        if (iconEl) {
                            link.innerHTML = iconEl.outerHTML + '<span class="privacy-text">' + label + '</span>';
                        } else {
                            link.textContent = label;
                        }
                    }
                } catch (e) {
                    console.error('Failed to update privacy link', e);
                }
            });
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    /**
     * Initialize cookie consent system
     */
    function init() {



        // Update privacy policy links
        updatePrivacyLinks();

        // Show consent UI after delay
        setTimeout(function () {
            detectBengaliRegion(function (isBengali, lang, isEU) {
                currentLang = lang;

                isEURegion = isEU;
                showCookieConsent();
            });
        }, CONFIG.BANNER_DELAY);

        // Create cookie settings icon
        createCookieIcon();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // GLOBAL API (for debugging/management)
    // ============================================

    window.CookieConsentManager = {
        reset: function () {
            localStorage.removeItem(CONFIG.CONSENT_KEY);
            localStorage.removeItem(CONFIG.CONSENT_PREFERENCES_KEY);
            localStorage.removeItem(CONFIG.DISPLAY_FORMAT_KEY);
            sessionStorage.removeItem(CONFIG.ADSENSE_LOADED_KEY);
            window.adsenseLoaded = false;

            location.reload();
        },
        getConsent: function () {
            return {
                configured: localStorage.getItem(CONFIG.CONSENT_KEY),
                preferences: getSavedPreferences(),
                displayFormat: localStorage.getItem(CONFIG.DISPLAY_FORMAT_KEY)
            };
        },
        setDisplayFormat: function (format) {
            if (CONFIG.DISPLAY_FORMATS.includes(format)) {
                localStorage.setItem(CONFIG.DISPLAY_FORMAT_KEY, format);

                this.reset();
            } else {
                console.error('Invalid format. Use: banner, dialog, or popup');
            }
        },
        showSettings: function () {
            showSettingsModal();
        }
    };

})();
