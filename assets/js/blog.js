"use strict";

/* ======= Highlight.js Plugin ======= */
/* Ref: https://highlightjs.org/usage/ */
document.addEventListener('DOMContentLoaded', (event) => {
  hljs.highlightAll();
  loadAds();
});

function loadAds() {
  if (!document.querySelector('link[href*="smart-ads.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'assets/css/smart-ads.css';
    document.head.appendChild(link);
  }
  if (!document.querySelector('script[src*="smart-ads.js"]')) {
    const script = document.createElement('script');
    script.src = 'assets/js/smart-ads.js';
    script.async = true;
    document.body.appendChild(script);
  }
}