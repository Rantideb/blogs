# Testing Privacy Policy on Localhost

## Problem
When testing on localhost, geo-detection APIs can't detect your real location because they see `127.0.0.1` instead of your actual IP address.

## Solution
We've added multiple fallback detection methods AND manual override options for testing.

---

## Method 1: Manual Language Override (EASIEST)

### Force Bengali Version (for Bangladesh testing)

1. Open any page in your browser
2. Open browser console (F12 or Cmd+Option+I)
3. Type:
```javascript
CookieConsentManager.setLanguage('bn')
```
4. **Page will auto-reload in 0.5 seconds**
5. After reload, click "Privacy Policy" link
6. Should go to `privacy-bn.html` (Bengali version)

**Note:** The page automatically reloads after setting language!

### Force English Version

```javascript
CookieConsentManager.setLanguage('en')
// Page will auto-reload in 0.5 seconds
```

### Clear Override (return to auto-detection)

```javascript
CookieConsentManager.clearLanguageOverride()
// Then manually reload:
location.reload()
```

---

## Method 2: Check Current Settings

See what the system detects:

```javascript
CookieConsentManager.getSettings()
```

**Output example:**
```javascript
{
  consent: "accepted",
  languageOverride: "bn",        // Manual override active
  hostname: "localhost",
  isLocalhost: true,
  browserLanguage: "en-US",
  timezone: "Asia/Dhaka"
}
```

---

## Method 3: Test Region Detection

Check what region the system detects:

```javascript
CookieConsentManager.detectRegion((isBengali, lang) => {
    console.log('Bengali region:', isBengali);
    console.log('Language:', lang);
});
```

**Output examples:**

From Bangladesh:
```
Bengali region: true
Language: bn
```

From other country:
```
Bengali region: false
Language: en
```

---

## Automatic Fallback Methods

Even on localhost, the system tries to detect your location using:

### 1. Manual Override (if set)
- Highest priority
- Set via `CookieConsentManager.setLanguage('bn')`

### 2. Browser Language
- Checks: `navigator.language`
- If contains 'bn' or 'BD' → Bengali

### 3. Timezone
- Checks system timezone
- `Asia/Dhaka` → Bengali (Bangladesh)
- `Asia/Kolkata` → Bengali (India/West Bengal)

### 4. Geo-IP API
- Tries ipapi.co even on localhost
- May work if you have internet connection
- Shows console logs

### 5. Default Fallback
- If all else fails → English

---

## Testing Scenarios

### Scenario 1: Test Bengali Privacy Page

```javascript
// Set language to Bengali
CookieConsentManager.setLanguage('bn')

// Reload
location.reload()

// Visit privacy page - should go to privacy-bn.html
// Check console for logs
```

### Scenario 2: Test Auto-Redirect

```javascript
// Set Bengali
CookieConsentManager.setLanguage('bn')
location.reload()

// Now manually go to privacy-en.html
// Should auto-redirect to privacy-bn.html
```

### Scenario 3: Test English Version

```javascript
// Set English
CookieConsentManager.setLanguage('en')
location.reload()

// Visit privacy page - should go to privacy-en.html
```

### Scenario 4: Test Auto-Detection

```javascript
// Clear any manual override
CookieConsentManager.clearLanguageOverride()
location.reload()

// System will try browser language, timezone, etc.
// Check console for detection logs
```

---

## Console Logs

The system now shows detailed logs in console:

```
Running on localhost - using fallback detection methods
Browser language: en-US
Timezone: Asia/Dhaka
Detected Bangladesh/West Bengal from timezone
```

Or with manual override:
```
Using manual language override: bn
```

---

## Quick Testing Commands

### See All Settings
```javascript
CookieConsentManager.getSettings()
```

### Force Bengali
```javascript
CookieConsentManager.setLanguage('bn'); location.reload()
```

### Force English
```javascript
CookieConsentManager.setLanguage('en'); location.reload()
```

### Auto-Detect
```javascript
CookieConsentManager.clearLanguageOverride(); location.reload()
```

### Reset Everything
```javascript
CookieConsentManager.reset()
```

---

## Testing Checklist

✅ **Test Bengali Override:**
1. Run: `CookieConsentManager.setLanguage('bn')`
2. Reload page
3. Click "Privacy Policy" link
4. Should go to `privacy-bn.html`
5. Content should be in Bengali

✅ **Test English Override:**
1. Run: `CookieConsentManager.setLanguage('en')`
2. Reload page
3. Click "Privacy Policy" link
4. Should go to `privacy-en.html`
5. Content should be in English

✅ **Test Auto-Redirect:**
1. Set language to Bengali
2. Manually type `/privacy-en.html` in URL
3. Should auto-redirect to `privacy-bn.html`

✅ **Test Auto-Detection:**
1. Clear override
2. Check console logs
3. Verify detection method used
4. Check resulting language

---

## Browser Language Setting

If you want to test browser language detection:

### Chrome/Edge
1. Settings → Languages
2. Add "Bengali (বাংলা)" or "Bengali (Bangladesh)"
3. Move it to top of list
4. Restart browser
5. Clear override and test

### Firefox
1. Settings → Language
2. Add "Bengali [bn]"
3. Move to top
4. Restart browser

---

## Production Testing

Once deployed to GitHub Pages:

1. **From Bangladesh:** Should auto-detect and show Bengali
2. **From other countries:** Should show English
3. **With VPN:** Location will be VPN server location

Test with VPN:
- Connect to Bangladesh VPN → Should show Bengali
- Connect to US/UK VPN → Should show English

---

## Troubleshooting

### Privacy page not redirecting on localhost?

**Check:**
```javascript
CookieConsentManager.getSettings()
```

**Set manual override:**
```javascript
CookieConsentManager.setLanguage('bn')
location.reload()
```

### Cookie banner not showing?

**Reset:**
```javascript
CookieConsentManager.reset()
```

### Want to see detection logs?

**Open Console (F12) and reload page**
- Look for messages starting with:
  - "Running on localhost..."
  - "Using manual language override..."
  - "Detected Bangladesh/West Bengal from..."

---

## Summary

**For localhost testing in Bangladesh:**

1. **Easiest:** Use manual override
   ```javascript
   CookieConsentManager.setLanguage('bn')
   location.reload()
   ```

2. **Auto-detection:** Set browser language to Bengali or ensure timezone is `Asia/Dhaka`

3. **Production:** Deploy to GitHub Pages for real IP-based geo-detection

**All methods work! Choose what's easiest for your testing workflow.** 🚀
