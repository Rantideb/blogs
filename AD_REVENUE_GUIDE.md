# Ad Revenue Optimization Guide

You have upgraded your site to a **Smart Ad Management System**. This setup allows you to run **Header Bidding-like** setups with premium networks alongside AdSense to maximize your revenue.

## 1. Sign Up for Premium Networks
To get better rates than AdSense, sign up for these recommended networks:

*   **Adsterra** (Great for Popunders & Social Bar) - [Sign Up](https://adsterra.com/)
*   **Ezoic** (AI Optimization, good for long term) - [Sign Up](https://ezoic.com/)
*   **PropellerAds** (Push & Interstitials) - [Sign Up](https://propellerads.com/)
*   **Media.net** (Contextual Native Ads) - [Sign Up](https://media.net/)

## 2. Get Your Ad Codes
Once approved, go to the dashboard of the network and:
1.  **Create a New Ad Unit**.
2.  Choose the format:
    *   **Native Banner** (for inside articles).
    *   **Popunder** (for high revenue hidden ads).
    *   **Social Bar / Sticky Footer** (for mobile engagement).
3.  Copy the **Script Code** or **Direct Link**.


## 4. Co-existing with AdSense Auto Ads

You asked about **AdSense Auto Ads** (specifically the "popup" or Vignette ads between pages).

*   **Good News:** My system works **perfectly** alongside AdSense Auto Ads.
*   **Vignettes (Popups):** These will continue to show up automatically. My script does **not** block them. They are high-revenue, so definitely keep them on!
*   **Recommendation:**
    1.  **Keep "Vignettes" ON** in your AdSense Dashboard.
    2.  **Keep "Anchor Ads" (Sticky) ON** in AdSense if you want AdSense to manage the footer. *However*, if you want to show **other** networks in the footer sometimes, use my "Sticky Footer" and turn off AdSense Anchors.
    3.  **In-Page Ads:** AdSense might try to insert ads near mine. This is usually fine (more ads = more money), but if it looks too cluttered, you can go to AdSense Settings -> Auto Ads -> **Load** and reduce the number of ads.

1.  Open `assets/js/smart-ads.js` in your editor.
2.  Locate the `placements` object at the top.
3.  **Paste your codes**:

```javascript
    placements: {
        
        // PASTE POPUNDER CODE HERE
        popunder: {
            enabled: true, // Change to true
            code: `<script type='text/javascript' src='//pl12345.com/....'></script>` 
        },

        // PASTE NATIVE BANNER CODE HERE
        inContent: {
            enabled: true,
            provider: 'custom', // Switch from 'adsense' to 'custom'
            customCode: `<div id="amzn-assoc-ad-..." ...>...</div>` // Paste code here
        },
        // ...
    }
```

## 4. How It Works
*   **In-Content Ads**: The system automatically inserts an ad slot after every **3rd paragraph** in your blog posts.
*   **Sticky Footer**: A high-paying sticky ad appears at the bottom of the screen with a "Close" button, compliant with "Better Ads Standards".
*   **Popunder**: If enabled, this script loads silently and triggers when the user clicks anywhere, offering high CPM.

## Tips for Higher Revenue
*   **Combine Networks**: Use AdSense for the Header/Sidebar and Adsterra/PropellerAds for Popunders.
*   **Video Ads**: If you sign up for **Adsterra**, use their "Social Bar" which supports video skins.
*   **Refresh**: The current setup loads ads once. For "Header Bidding" proper, you normally need a wrapper like Prebid.js, but this "Smart Manager" mimics the *waterfall* approach by allowing you to manually prioritize which network tag to show.

**Note**: Since you are using a static site, this manual control is often more performant than complex header bidding wrappers.
