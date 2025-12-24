/**
 * Smart Ad Manager
 * Optimizes ad revenue by managing placements and supporting multiple networks.
 * 
 * INSTRUCTIONS FOR USER:
 * 1. Sign up for premium networks (Adsterra, Ezoic, PropellerAds, etc.).
 * 2. Get the "Script" or "Direct Link" codes from their dashboard.
 * 3. Pastel the codes in the 'placements' object below.
 * 4. Set 'enabled: true' for the networks you want to active.
 */

const SmartAds = {
    config: {
        // IN-ARTICLE INTERVAL: How many paragraphs between ads?
        paragraphInterval: 3,

        // STICKY FOOTER: Enable specific network for sticky footer?
        // Options: 'adsense', 'adsterra', 'custom'
        stickyFooterProvider: 'adsense',
    },

    // PASTE YOUR AD CODES HERE
    placements: {

        // 1. POP-UNDER / POP-UP (High CPM)
        // Networks: Adsterra, PropellerAds, HilltopAds
        popunder: {
            enabled: false,
            // Paste the full <script> tag here as a string
            code: ``
        },

        // 2. NATIVE BANNERS (In-Content)
        // Networks: AdSense, Media.net, Adsterra Native
        inContent: {
            enabled: true,
            provider: 'adsense', // or 'custom'
            // If custom, paste code here
            customCode: `<div style="background:#eee; padding:20px; text-align:center;">Premium Ad Placeholder</div>`
        },

        // NEW: Header Leaderboard
        header: {
            enabled: true,
            provider: 'adsense'
        },

        // NEW: Sidebar Ad
        sidebar: {
            enabled: true,
            provider: 'adsense'
        },

        // 3. SOCIAL BAR / STICKY FOOTER
        // Networks: Adsterra Social Bar is very effective here
        stickyFooter: {
            enabled: true,
            provider: 'adsense', // 'adsense' will use an anchor ad if auto-ads are on, or we can force a unit
            // Paste a specific 728x90 or 320x50 unit code here if using 'custom'
            customCode: ``
        },
        // 4. NATIVE RECOMMENDATION GRID (Bottom of Article)
        nativeBanner: {
            enabled: true,
            containerId: 'container-cb71fbd53cb8f907c27e68af7d11ac3f',
            // Code includes the script AND the container logic
            scriptUrl: 'https://pl28324851.effectivegatecpm.com/cb71fbd53cb8f907c27e68af7d11ac3f/invoke.js'
        }
    },

    init: function () {
        console.log('SmartAds: Initializing...');
        this.setupHeaderAd();
        this.setupSectionAds();
        this.setupInContentAds();
        this.setupNativeBanner(); // New: Native Grid
        this.setupListAds();
        this.setupStickyFooter();
        this.setupPopunder();
    },

    setupHeaderAd: function () {
        const mainWrapper = document.querySelector('.main-wrapper');
        if (!mainWrapper) return;

        const adContainer = document.createElement('div');
        adContainer.className = 'ad-slot-container header-ad';
        // Insert at the very top of main wrapper
        mainWrapper.insertBefore(adContainer, mainWrapper.firstChild);

        const label = document.createElement('span');
        label.className = 'ad-label';
        label.innerText = 'Advertisement';
        adContainer.appendChild(label);

        // Header Leaderboard (728x90 desktop, 320x100 mobile)
        const adContent = document.createElement('div');
        if (this.placements.header ? this.placements.header.provider === 'adsense' : true) {
            adContent.innerHTML = `
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-8340971949778309"
                     data-ad-format="horizontal"
                     data-full-width-responsive="true"></ins>
             `;
            setTimeout(() => { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { } }, 200);
        }

        adContainer.appendChild(adContent);
        this.monitorAdHeight(adContainer);
    },

    setupSectionAds: function () {
        // 1. Ad between Intro (CTA) and Content
        const ctaSection = document.querySelector('.cta-section');
        if (ctaSection && ctaSection.nextElementSibling) {
            const adContainer = document.createElement('div');
            adContainer.className = 'ad-slot-container section-ad';
            adContainer.style.margin = '40px auto';

            const label = document.createElement('span');
            label.className = 'ad-label';
            label.innerText = 'Sponsored';
            adContainer.appendChild(label);

            const adContent = document.createElement('div');
            // Re-use header placement logic for horizontal
            if (this.placements.header ? this.placements.header.provider === 'adsense' : true) {
                adContent.innerHTML = `
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="ca-pub-8340971949778309"
                         data-ad-format="horizontal"
                         data-full-width-responsive="true"></ins>
                 `;
                setTimeout(() => { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { } }, 300);
            }
            adContainer.appendChild(adContent);
            ctaSection.parentNode.insertBefore(adContainer, ctaSection.nextElementSibling);
            this.monitorAdHeight(adContainer);
        }

        // 2. Ad before Footer
        const footer = document.querySelector('.footer');
        if (footer) {
            const adContainer = document.createElement('div');
            adContainer.className = 'ad-slot-container footer-section-ad';
            adContainer.style.marginBottom = '40px';

            const label = document.createElement('span');
            label.className = 'ad-label';
            label.innerText = 'Advertisement';
            adContainer.appendChild(label);

            const adContent = document.createElement('div');
            // Re-use header placement logic for horizontal
            if (this.placements.header ? this.placements.header.provider === 'adsense' : true) {
                adContent.innerHTML = `
                    <ins class="adsbygoogle"
                         style="display:block"
                         data-ad-client="ca-pub-8340971949778309"
                         data-ad-format="horizontal"
                         data-full-width-responsive="true"></ins>
                 `;
                setTimeout(() => { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { } }, 400);
            }
            adContainer.appendChild(adContent);
            footer.parentNode.insertBefore(adContainer, footer);
            this.monitorAdHeight(adContainer);
        }
    },

    createAdUnit: function () {
        // Helper to create the ad HTML
        const adContent = document.createElement('div');
        if (this.placements.inContent.provider === 'adsense') {
            adContent.innerHTML = `
                 <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-8340971949778309"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            `;
            setTimeout(() => {
                try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { }
            }, 100);
        } else {
            adContent.innerHTML = this.placements.inContent.customCode;
        }
        return adContent;
    },

    monitorAdHeight: function (container) {
        // Poll for height change to detect ad load
        let attempts = 0;
        const maxAttempts = 20; // Try for 10 seconds (20 * 500ms)

        const check = setInterval(() => {
            attempts++;
            // Check if ANY child has height (iframe, ins, div)
            const hasHeight = container.offsetHeight > 10 ||
                Array.from(container.children).some(c => c.offsetHeight > 10);

            if (hasHeight) {
                container.classList.add('ad-loaded');
                clearInterval(check);
            } else if (attempts >= maxAttempts) {
                clearInterval(check); // Give up, keep hidden
            }
        }, 500);
    },

    setupInContentAds: function () {
        const contentBody = document.querySelector('.blog-post-body') ||
            document.querySelector('.about-section .container') ||
            document.querySelector('article');

        if (!contentBody) return;

        const paragraphs = contentBody.querySelectorAll('p');
        let pCount = 0;

        paragraphs.forEach((p, index) => {
            pCount++;
            if (pCount === this.config.paragraphInterval) {
                pCount = 0;

                const adContainer = document.createElement('div');
                adContainer.className = 'ad-slot-container in-content-ad';

                const label = document.createElement('span');
                label.className = 'ad-label';
                label.innerText = 'Advertisement';
                adContainer.appendChild(label);

                adContainer.appendChild(this.createAdUnit());
                p.parentNode.insertBefore(adContainer, p.nextSibling);

                // Only show label if height > 0
                this.monitorAdHeight(adContainer);
            }
        });
    },

    setupListAds: function () {
        const blogList = document.querySelector('.blog-list');
        if (!blogList) return;

        const items = blogList.querySelectorAll('.item');

        items.forEach((item, index) => {
            if ((index + 1) % 2 === 0) {
                const adContainer = document.createElement('div');
                adContainer.className = 'ad-slot-container list-ad';
                adContainer.style.marginBottom = '3rem';

                const label = document.createElement('span');
                label.className = 'ad-label';
                label.innerText = 'Sponsored';
                adContainer.appendChild(label);

                adContainer.appendChild(this.createAdUnit());
                item.parentNode.insertBefore(adContainer, item.nextSibling);

                // Only show label if height > 0
                this.monitorAdHeight(adContainer);
            }
        });
    },

    setupStickyFooter: function () {
        if (!this.placements.stickyFooter.enabled) return;

        const footerAd = document.createElement('div');
        footerAd.className = 'sticky-footer-ad';
        footerAd.id = 'smart-sticky-footer';

        const closeBtn = document.createElement('div');
        closeBtn.className = 'sticky-ad-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = function () {
            document.getElementById('smart-sticky-footer').classList.add('closed');
        };
        footerAd.appendChild(closeBtn);

        const adContent = document.createElement('div');

        if (this.placements.stickyFooter.provider === 'adsense') {
            adContent.innerHTML = `
                <ins class="adsbygoogle"
                     style="display:block; width:100vw; height:60px;"
                     data-ad-client="ca-pub-8340971949778309"
                     data-ad-format="horizontal"
                     data-full-width-responsive="true"></ins>
             `;
            setTimeout(() => {
                try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { }
            }, 500);
        } else {
            adContent.innerHTML = this.placements.stickyFooter.customCode;
        }

        footerAd.appendChild(adContent);
        document.body.appendChild(footerAd);
    },

    setupNativeBanner: function () {
        if (!this.placements.nativeBanner.enabled) return;

        // Target end of article content
        const contentBody = document.querySelector('.blog-post-body');
        if (!contentBody) return;

        const adContainer = document.createElement('div');
        adContainer.className = 'ad-slot-container native-ad';
        adContainer.style.margin = '40px 0'; // Vertical spacing

        // Label
        const label = document.createElement('span');
        label.className = 'ad-label';
        label.innerText = 'Recommended';
        adContainer.appendChild(label);

        // 1. Create the specific Container DIV required by the network
        const networkContainer = document.createElement('div');
        networkContainer.id = this.placements.nativeBanner.containerId;
        adContainer.appendChild(networkContainer);

        // Append to bottom of content
        contentBody.appendChild(adContainer);

        // 2. Inject the Script
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = this.placements.nativeBanner.scriptUrl;

        // Append script to body or container (usually body is safer for these globals)
        document.body.appendChild(script);

        this.monitorAdHeight(adContainer);
    },

    setupPopunder: function () {
        if (this.placements.popunder.enabled && this.placements.popunder.code) {
            const div = document.createElement('div');
            div.innerHTML = this.placements.popunder.code;

            const scripts = div.querySelectorAll('script');
            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                document.body.appendChild(newScript);
            });
        }
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    SmartAds.init();
});
