# ব্লগ - বোধিদ্রুমে ধরেছে হতবুদ্ধির ঘুন

A feature-rich Bengali blog with comprehensive functionality.

## 🚀 New Features Added (October 2025)

### 📖 Content & Engagement
- **Comments Section** - GitHub-based comments using Utterances
- **Reading Time Estimator** - Displays estimated reading time for each post
- **Reading Progress Bar** - Visual indicator showing scroll progress
- **Table of Contents** - Auto-generated from headings with smooth scroll
- **Social Share Buttons** - Share to Facebook, Twitter, WhatsApp, LinkedIn, and copy link
- **Newsletter Subscription** - Email signup for new post notifications
- **Related Posts** - Shows similar articles based on tags
- **View Counter** - Tracks and displays post views

### 🔍 Navigation & Discovery
- **Search Functionality** - Client-side search to find posts by keywords
- **Tags/Categories System** - Organize and filter posts by topics
- **Archive/Timeline View** - Chronological listing grouped by year/month
- **Popular Posts** - Display most viewed articles
- **RSS Feed** - Subscribe to blog updates via RSS

### 🎨 User Experience
- **Dark Mode Toggle** - Switch between light and dark themes (persisted)
- **Font Size Adjuster** - Increase/decrease text size for readability
- **Print-Friendly Version** - Optimized for printing
- **Bookmark/Save Feature** - LocalStorage-based reading list
- **Image Lightbox** - Click to enlarge images with navigation
- **Lazy Loading** - Images load as you scroll for better performance

### ♿ Accessibility
- **ARIA Labels** - Proper labels for screen readers
- **Keyboard Navigation** - J/K keys for prev/next posts, Tab navigation
- **Skip to Content** - Quick jump to main content
- **Focus Indicators** - Enhanced visual feedback
- **Keyboard Shortcuts Info** - Help modal showing all shortcuts

## 🛠️ Technical Implementation

### JavaScript Files
- `blog-features.js` - Core features (reading time, progress bar, dark mode, etc.)
- `search.js` - Search functionality
- `newsletter.js` - Newsletter subscription
- `related-posts.js` - Related posts, tags, categories, archive
- `accessibility.js` - Accessibility improvements

### Key Files
- `feed.xml` - RSS feed for blog subscription
- `sitemap.xml` - SEO sitemap
- `archive.html` - Timeline/archive page

## 🎯 Usage

### For Readers
1. **Navigate**: Use J/K keys or arrow keys to move between posts
2. **Search**: Use the search bar on the homepage to find posts
3. **Dark Mode**: Click the moon/sun icon (bottom right) to toggle
4. **Font Size**: Use A+/A/A- buttons (bottom right) to adjust text size
5. **Share**: Click share buttons at the bottom of each post
6. **Bookmark**: Save posts for later reading
7. **Subscribe**: Enter email to get notified of new posts

### For Authors
1. **Update Post Metadata**: Edit `blogPostsMetadata` array in `related-posts.js`
2. **Add to Search**: Update `blogPosts` array in `search.js`
3. **RSS Feed**: Add new posts to `feed.xml`

## 📱 Mobile Responsive
All features are fully responsive and work on all devices.

## 👤 Author
**Rantideb**
- Website: [ranti.dev](https://www.ranti.dev/)
- GitHub: [@Rantideb](https://github.com/Rantideb)

---

**Last Updated**: October 3, 2025
