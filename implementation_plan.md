# Ad System Upgrade Implementation Plan

## Goal
To ensure that all future pages added to the blog automatically include the Smart Ad Management System without requiring manual HTML edits or running a script.

## Proposed Changes
We will modify `assets/js/blog.js`, which is already included in all pages, to act as a "Loader".

### `assets/js/blog.js`
- **Current Content**: Initializes `hljs` for syntax highlighting.
- **New Content**:
    - Keep existing initialization.
    - Add a `loadAds()` function.
    - Check if `smart-ads.css` is loaded; if not, inject it.
    - Check if `smart-ads.js` is loaded; if not, inject it.

## Verification Plan
### Manual Verification
1.  **Create a Test Page**: Create `test-new-page.html` with basic HTML and include only `blog.js`.
2.  **Open in Browser**: Open this file.
3.  **Inspect Elements**: Verify that `smart-ads.css` and `smart-ads.js` are injected into the DOM.
4.  **Check Ads**: Verify that ad slots (sticky footer, etc.) appear.
