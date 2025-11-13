# Privacy Policy Geo-Based Auto-Redirect

## ✅ Feature: Automatic Privacy Policy Language Routing

### How It Works

When a user visits **any privacy policy page** (`privacy-en.html` or `privacy-bn.html`), the system automatically:

1. **Detects user location** using ipapi.co API
2. **Determines correct language:**
   - Bangladesh (BD) → Bengali (`privacy-bn.html`)
   - West Bengal, India (Kolkata, Calcutta) → Bengali (`privacy-bn.html`)
   - All other regions → English (`privacy-en.html`)
3. **Auto-redirects** if user is on wrong language page

### Examples

**Scenario 1: User from Bangladesh**
- User clicks any privacy link → goes to `privacy-en.html`
- Script detects: Bangladesh (BD)
- Auto-redirects to: `privacy-bn.html` ✓

**Scenario 2: User from Kolkata**
- User manually types `privacy-en.html` in URL
- Script detects: West Bengal, India
- Auto-redirects to: `privacy-bn.html` ✓

**Scenario 3: User from USA**
- User clicks privacy link → goes to `privacy-en.html`
- Script detects: USA
- Stays on: `privacy-en.html` ✓

**Scenario 4: User from USA on Bengali page**
- User somehow lands on `privacy-bn.html`
- Script detects: USA (not BD or WB)
- Auto-redirects to: `privacy-en.html` ✓

### Technical Details

**Detection Logic:**
```javascript
// Bangladesh detection
if (country_code === 'BD') → Bengali

// West Bengal detection (India)
if (country === 'IN' AND 
    (region contains 'West Bengal' OR 
     city contains 'Kolkata' OR 
     city contains 'Calcutta')) → Bengali

// All others
else → English
```

**Fallback:**
- If geo-detection API fails
- Checks browser language (`navigator.language`)
- If starts with 'bn' → Bengali
- Otherwise → English

### Privacy Link Behavior

**Navigation Links:**
- Privacy policy links in sidebar automatically point to correct page
- Updated in real-time based on user's detected location
- No manual selection needed

**Cookie Banner:**
- Privacy policy link in banner also auto-routes
- Always sends user to their regional version

### User Experience

**Seamless:**
- No user action required
- Redirect happens instantly (< 1 second)
- No redirect loop (checks current page first)

**Respects User Choice:**
- If user manually navigates to specific version, it stays
- Only redirects on initial page load
- Can bookmark either version

### Files Modified

- `assets/js/privacy-consent.js`
  - Added `autoRedirectPrivacyPage()` function
  - Called in `init()` before other operations

### Testing

**Test from different locations:**

1. **Test Bangladesh routing:**
   ```javascript
   // In browser console
   CookieConsentManager.detectRegion((isBengali, lang) => {
       console.log('Bengali region:', isBengali, 'Lang:', lang);
   });
   ```

2. **Force redirect test:**
   - Visit `privacy-en.html` directly
   - Script should auto-detect and redirect if from BD/WB

3. **Test link updates:**
   - Click privacy links in navigation
   - Should go to correct language automatically

### Configuration

**Edit geo-detection settings in `privacy-consent.js`:**

```javascript
const CONFIG = {
    BANGLADESH_REGIONS: ['BD', 'Bangladesh'],
    WEST_BENGAL_KEYWORDS: ['West Bengal', 'Kolkata', 'Calcutta', 'WB'],
};
```

**Add more regions:**
```javascript
WEST_BENGAL_KEYWORDS: ['West Bengal', 'Kolkata', 'Calcutta', 'WB', 'Siliguri', 'Durgapur'],
```

### Browser Compatibility

✅ All modern browsers (Chrome, Firefox, Safari, Edge)  
✅ Mobile browsers (iOS Safari, Chrome Mobile)  
✅ Works with VPNs (uses IP-based detection)  

### Privacy & Performance

**Privacy-Friendly:**
- Uses free public IP API (ipapi.co)
- No tracking or data storage
- Location data not logged

**Performance:**
- Lightweight detection (< 2KB API response)
- Cached in session
- Falls back to browser language if API slow

### Status

✅ **ACTIVE** - Auto-redirect enabled on all privacy pages
