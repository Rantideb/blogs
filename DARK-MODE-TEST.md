# Dark Mode Testing Guide

## Quick Test Checklist

Visit any page and toggle dark mode (click moon icon). Everything should turn dark with visible text.

### ✅ Areas to Check

1. **Header Section**
   - [ ] Background turns to #223142 (dark blue)
   - [ ] Blog name visible in #EEA73B (orange)
   - [ ] Navigation links visible in light gray

2. **Main Content**
   - [ ] Body background is #1a1a1a (black)
   - [ ] No white sections visible
   - [ ] All text readable in light colors

3. **Blog List Pages** (blog.html, blog-1.html, etc.)
   - [ ] Search box has dark background
   - [ ] Filter tags are dark themed
   - [ ] Each blog item card is #2d2d2d (dark gray)
   - [ ] Post titles in #EEA73B (orange)
   - [ ] Intro text visible

4. **Individual Posts** (amar-osthirota.html, etc.)
   - [ ] Post content area is dark
   - [ ] Table of contents is dark
   - [ ] Share buttons are dark
   - [ ] All text readable

5. **Interactive Elements**
   - [ ] Input boxes: dark background, light text
   - [ ] Buttons: #223142 background
   - [ ] Button hover: turns #EEA73B
   - [ ] Links: #EEA73B color

6. **Special Features**
   - [ ] Comments section: dark themed
   - [ ] Related posts: dark cards
   - [ ] Search results: dark themed
   - [ ] Font adjuster: dark popup

7. **Footer**
   - [ ] Background #223142 (dark blue)
   - [ ] Text visible in light color

### Test Pages

1. **blog.html** - Blog list with search/filter
2. **amar-osthirota.html** - Full blog post with all features
3. **search-results.html** - Global search page
4. **index-1.html** - Homepage

### Expected Result

**NO WHITE BACKGROUNDS** should be visible in dark mode.

All backgrounds should be:
- #1a1a1a (body, main areas)
- #2d2d2d (cards, boxes, inputs)
- #223142 (header, footer, buttons)

All text should be visible in:
- #e0e0e0 (primary text)
- #d0d0d0 (secondary text)
- #EEA73B (links, headings)

### If Something is Wrong

1. Check browser console for errors
2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Make sure blog-features.js is loaded
4. Check if element has inline styles overriding CSS

### Toggle Dark Mode

- **Button Location**: Bottom-right corner (floating button)
- **Icon**: Moon = Light mode, Sun = Dark mode
- **Persistence**: Saves to localStorage, remembers on reload
