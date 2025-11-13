# Quick Reference: Privacy & Cookie Consent

## 🎯 What Was Done

1. ✅ Created bilingual privacy policy pages (English + Bengali)
2. ✅ Added privacy links to all 63 blog pages (after "প্রলাপের ভুতপত্তি")
3. ✅ Implemented geo-detection (Bangladesh/West Bengal → Bengali, Others → English)
4. ✅ Added cookie consent banner with Accept/Decline buttons
5. ✅ Deferred AdSense loading (loads only after user consent)

## 📁 New Files

- `privacy-en.html` - English privacy policy
- `privacy-bn.html` - Bengali privacy policy (গোপনীয়তা নীতি)
- `assets/js/privacy-consent.js` - Consent manager & geo-detection
- `PRIVACY-IMPLEMENTATION-SUMMARY.md` - Full documentation

## 🧪 Quick Test Commands

### Test in Browser Console:

```javascript
// Check consent status
CookieConsentManager.getConsent()

// Reset banner (show again)
CookieConsentManager.reset()

// Test region detection
CookieConsentManager.detectRegion(function(isBengali, lang) {
    console.log('Bengali:', isBengali, 'Lang:', lang);
});
```

## 🚀 Deploy to GitHub

```bash
cd /Users/rantideb/Downloads/blogs

# Check what changed
git status

# Add all changes
git add .

# Commit
git commit -m "Add GDPR-compliant privacy policy and cookie consent"

# Push to GitHub Pages
git push origin main
```

## ✅ AdSense Review Checklist

After deploying:

1. ✅ Visit live site: https://rantideb.github.io/blogs/
2. ✅ Verify cookie banner appears
3. ✅ Test Accept/Decline buttons
4. ✅ Check privacy policy links work
5. ✅ Verify ads load after accepting
6. ✅ Check `ads.txt`: https://rantideb.github.io/blogs/ads.txt
7. ✅ Go to AdSense Policy Center
8. ✅ Mark violations as fixed
9. ✅ Request review with notes:

```
Privacy policy implemented (bilingual: English & Bengali).
Cookie consent banner added with user choice.
AdSense loads only after user acceptance.
All pages updated with privacy disclosures.
GDPR & CCPA compliant.
```

## 🎨 How It Works

**User Flow:**
1. User visits any page
2. Cookie banner appears after 1 second
3. User clicks "Accept All" → AdSense loads, ads show
4. OR User clicks "Decline" → No ads, no tracking
5. Choice saved in browser localStorage
6. Banner won't show again (until user clears data)

**Privacy Link:**
- Shows "Privacy Policy" in navigation
- Auto-routes based on location:
  - Bangladesh/West Bengal → `privacy-bn.html`
  - Other regions → `privacy-en.html`

## 🔧 Customization

### Change banner text:
Edit `assets/js/privacy-consent.js` line ~120

### Change colors:
Edit inline styles in `privacy-consent.js` line ~125

### Change delay:
Edit `BANNER_DELAY: 1000` in `privacy-consent.js` line ~12

## 📞 Support

**Questions?** Check:
- Full docs: `PRIVACY-IMPLEMENTATION-SUMMARY.md`
- Browser console for errors
- AdSense Help Center

**Your contact (in privacy policy):**
- Email: hello@ranti.dev
- Site: https://www.ranti.dev/

---

**Status:** ✅ Ready to deploy!
