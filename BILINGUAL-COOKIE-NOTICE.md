# Bilingual Cookie Notice Implementation

## Overview
The cookie consent banner now displays in **Bengali** for users in Bangladesh and West Bengal, and in **English** for all other regions.

---

## Language Detection

The banner language is automatically detected based on:

1. **Manual Override** (if set via console)
2. **Geo-location** (Bangladesh or West Bengal)
3. **Browser Language** (if contains 'bn' or 'BD')
4. **Timezone** (Asia/Dhaka or Asia/Kolkata)
5. **Default**: English

---

## Banner Text

### English Version (Default)
```
🍪 Cookie Notice

We use cookies and similar technologies for analytics and personalized ads. 
By clicking "Accept", you consent to our use of cookies. Privacy Policy

[✓ Accept All]  [✕ Decline]
```

### Bengali Version (Bangladesh & West Bengal)
```
🍪 কুকি বিজ্ঞপ্তি

আমরা বিশ্লেষণ এবং ব্যক্তিগত বিজ্ঞাপনের জন্য কুকি এবং অনুরূপ প্রযুক্তি ব্যবহার করি। 
"গ্রহণ করুন" ক্লিক করে, আপনি আমাদের কুকি ব্যবহারে সম্মতি দিচ্ছেন। গোপনীয়তা নীতি

[✓ সব গ্রহণ করুন]  [✕ প্রত্যাখ্যান]
```

---

## Implementation Details

### File Modified
- **assets/js/privacy-consent.js**

### Changes Made

1. **Added Banner Text Dictionary**:
   ```javascript
   const bannerText = {
       en: {
           title: '🍪 Cookie Notice',
           message: 'We use cookies and similar technologies...',
           privacyLink: 'Privacy Policy',
           acceptBtn: '✓ Accept All',
           declineBtn: '✕ Decline'
       },
       bn: {
           title: '🍪 কুকি বিজ্ঞপ্তি',
           message: 'আমরা বিশ্লেষণ এবং ব্যক্তিগত বিজ্ঞাপনের...',
           privacyLink: 'গোপনীয়তা নীতি',
           acceptBtn: '✓ সব গ্রহণ করুন',
           declineBtn: '✕ প্রত্যাখ্যান'
       }
   };
   ```

2. **Dynamic Banner Creation**:
   - Calls `detectBengaliRegion()` to determine language
   - Uses detected language to select appropriate text
   - Generates banner HTML with localized content
   - Links to correct privacy page (privacy-bn.html or privacy-en.html)

3. **Consistent with Privacy Pages**:
   - Privacy link in banner matches page language
   - Same geo-detection logic for both banner and privacy pages

---

## Testing

### Test Bengali Banner (Localhost)

1. Open browser console (F12)
2. Reset cookies to see banner again:
   ```javascript
   CookieConsentManager.reset()
   ```
3. Set language to Bengali:
   ```javascript
   CookieConsentManager.setLanguage('bn')
   ```
4. Page will reload and show Bengali cookie banner

### Test English Banner

```javascript
CookieConsentManager.reset()
CookieConsentManager.setLanguage('en')
// Page will reload and show English banner
```

### Test Auto-Detection

```javascript
CookieConsentManager.reset()
CookieConsentManager.clearLanguageOverride()
location.reload()
// Banner language will be detected automatically
```

---

## Regional Behavior

| Region | Cookie Banner Language | Privacy Page |
|--------|----------------------|--------------|
| Bangladesh | Bengali (বাংলা) | privacy-bn.html |
| West Bengal (India) | Bengali (বাংলা) | privacy-bn.html |
| Kolkata | Bengali (বাংলা) | privacy-bn.html |
| All other regions | English | privacy-en.html |

---

## Features

✅ **Geo-based Language Detection**
- Automatically shows Bengali for BD and West Bengal
- English for all other regions

✅ **Consistent Privacy Links**
- Banner privacy link matches detected region
- Links to correct language privacy page

✅ **Manual Override Support**
- Can force language for testing
- Useful for localhost development

✅ **Same Design for Both Languages**
- Beautiful gradient background
- Smooth animations
- Hover effects on buttons
- Fully responsive

✅ **Full Localization**
- All text elements translated
- Accept/Decline buttons in local language
- Privacy Policy link in local language

---

## Console Commands

### View Current Settings
```javascript
CookieConsentManager.getSettings()
```

### Reset and Show Banner Again
```javascript
CookieConsentManager.reset()
location.reload()
```

### Force Bengali
```javascript
CookieConsentManager.setLanguage('bn')
// Auto-reloads page
```

### Force English
```javascript
CookieConsentManager.setLanguage('en')
// Auto-reloads page
```

### Clear Manual Override
```javascript
CookieConsentManager.clearLanguageOverride()
location.reload()
```

### Check Region Detection
```javascript
CookieConsentManager.detectRegion((isBengali, lang) => {
    console.log('Bengali region:', isBengali);
    console.log('Language:', lang);
});
```

---

## User Experience

### Bangladesh/West Bengal User Journey:
1. User visits site from Bangladesh or West Bengal
2. Cookie banner appears in **Bengali** (কুকি বিজ্ঞপ্তি)
3. All button text in Bengali
4. Privacy link points to **privacy-bn.html**
5. Sidebar privacy link also shows **"গোপনীয়তা নীতি"**

### Other Region User Journey:
1. User visits site from any other country
2. Cookie banner appears in **English**
3. All button text in English
4. Privacy link points to **privacy-en.html**
5. Sidebar privacy link shows **"Privacy Policy"**

---

## Technical Notes

- **No Page Reload Required**: Banner language is set during initial page load
- **Cached Detection**: Region detection happens once and is used for both banner and privacy links
- **Fallback Chain**: Multiple detection methods ensure reliable language selection
- **Localhost Support**: Manual override allows testing both languages locally

---

## Deployment Checklist

Before pushing to GitHub Pages:

✅ Test Bengali banner:
- Reset cookies
- Set language to 'bn'
- Verify all text is in Bengali
- Verify privacy link goes to privacy-bn.html

✅ Test English banner:
- Reset cookies
- Set language to 'en'
- Verify all text is in English
- Verify privacy link goes to privacy-en.html

✅ Test auto-detection:
- Clear manual override
- Check console logs
- Verify correct language detected

✅ Test buttons:
- Click "Accept" - banner should hide, ads should load
- Reset, click "Decline" - banner should hide, no ads

✅ Test responsive design:
- Mobile view
- Tablet view
- Desktop view

---

## Summary

The cookie consent banner is now **fully bilingual** and automatically adapts to the user's region:

- 🇧🇩 **Bangladesh** → Bengali banner
- 🇮🇳 **West Bengal/Kolkata** → Bengali banner  
- 🌍 **Rest of World** → English banner

All functionality (Accept, Decline, Privacy link) works identically in both languages! 🚀
