# Related Posts with Card Style - Implementation Guide

## What's New? ✨

Now your blog posts show **related posts with the same tags** in beautiful card style with images!

## Features

1. **Tag Display**: Shows current post tags with clickable badges
2. **Related Posts Cards**: Displays up to 3 related posts with:
   - Post image from metadata
   - Post title
   - Post excerpt
   - Post tags
   - Hover effects
3. **Responsive Design**: Cards adapt to mobile, tablet, and desktop
4. **Dark Mode Support**: Works in both light and dark modes

## How to Add Images to Posts

### Step 1: Add image to `global-search.js`

Open `/assets/js/global-search.js` and add the `image` field to each post:

```javascript
const allBlogPosts = [
    { 
        title: 'আমার অস্থিরতা', 
        url: 'amar-osthirota.html', 
        tags: ['পরিহাস', 'উপেক্ষিত ক্রেঙ্কার'], 
        excerpt: 'তোমার চারপাশে এতো এতো মানুষ...', 
        image: 'assets/images/blog/amar-3.jpeg',  // <-- ADD THIS LINE
        content: '...' 
    },
    // Add image to all other posts...
];
```

### Step 2: Extract image URL from HTML metadata

Each post HTML has this meta tag:

```html
<meta property="og:image" content="assets/images/blog/hem.jpeg">
```

Copy the `content` value and use it as the `image` field in `global-search.js`.

### Example Format

```javascript
{ title: 'হেম', url: 'hem.html', tags: ['প্রকৃতি', 'ঋতু'], excerpt: '...', image: 'assets/images/blog/hem.jpeg' },
```

## How It Works

1. **related-posts.js** reads current page tags from `global-search.js`
2. Finds all posts with matching tags
3. Creates card-style display with images
4. Shows tags and "Click to see more posts" message

## Already Included

✅ The CSS file `blog-responsive-fix.css` is already linked in `amar-osthirota.html`
✅ The JavaScript files are loaded in correct order:
   - `global-search.js` (data source)
   - `related-posts.js` (display logic)

## To Apply to Other Posts

Just add these lines to any blog post HTML `<head>`:

```html
<!-- Blog Responsive Fix CSS -->
<link rel="stylesheet" href="assets/css/blog-responsive-fix.css">
```

And before closing `</body>`:

```html
<script src="assets/js/global-search.js"></script>
<script src="assets/js/related-posts.js"></script>
```

## Example Output

```
ট্যাগ: [পরিহাস] [উপেক্ষিত ক্রেঙ্কার]
ℹ️ এই ট্যাগগুলোতে ক্লিক করে আরও পোস্ট দেখুন

একই ট্যাগের আরও পোস্ট
┌─────────────────┬─────────────────┬─────────────────┐
│  [Image]        │  [Image]        │  [Image]        │
│  Post Title 1   │  Post Title 2   │  Post Title 3   │
│  Excerpt...     │  Excerpt...     │  Excerpt...     │
│  [Tag1] [Tag2]  │  [Tag1] [Tag2]  │  [Tag1] [Tag2]  │
└─────────────────┴─────────────────┴─────────────────┘
```

## Customization

Edit `/assets/js/related-posts.js` to customize:
- Number of related posts (currently 3)
- Card styling
- Image size
- Tag display
- Colors and hover effects

---

**Created**: October 3, 2025  
**File**: `related-posts.js`  
**Dependencies**: `global-search.js`, `blog-responsive-fix.css`
