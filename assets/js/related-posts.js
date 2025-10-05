/**
 * Related Posts, Tags/Categories, and Archive Features
 */

// ==================== EXTRACT TAGS FROM CURRENT PAGE ====================
function getCurrentPageTags() {
    // Get current page URL filename
    const currentPage = window.location.pathname.split('/').pop();
    
    // Try to get tags from global search data if available
    if (typeof allBlogPosts !== 'undefined') {
        const currentPost = allBlogPosts.find(post => post.url === currentPage);
        if (currentPost && currentPost.tags) {
            return currentPost.tags;
        }
    }
    
    // Fallback: Try to find tags from meta section in blog list format
    // Pattern: <div class="meta mb-1"><span class="date">Tag1</span><span class="time">Tag2</span></div>
    const metaSection = document.querySelector('.meta.mb-1');
    if (metaSection) {
        const tags = [];
        const dateSpan = metaSection.querySelector('span.date');
        const timeSpan = metaSection.querySelector('span.time');
        
        if (dateSpan && dateSpan.textContent.trim()) {
            tags.push(dateSpan.textContent.trim());
        }
        if (timeSpan && timeSpan.textContent.trim()) {
            tags.push(timeSpan.textContent.trim());
        }
        
        if (tags.length > 0) {
            return tags;
        }
    }
    
    return [];
}

// ==================== RELATED POSTS ====================
function createRelatedPosts() {
    const article = document.querySelector('.blog-post-body') || document.querySelector('.blog-post');
    if (!article) return;
    
    // Get current page URL and tags
    const currentPage = window.location.pathname.split('/').pop();
    const currentTags = getCurrentPageTags();
    
    if (currentTags.length === 0) {
        console.log('No tags found in meta section');
        return;
    }
    
    console.log('Current page tags:', currentTags);
    
    // Find related posts with same tags
    let relatedPosts = [];
    if (typeof allBlogPosts !== 'undefined') {
        // If any posts missing tags/image/excerpt, attempt auto-harvest from their HTML head
        const incomplete = allBlogPosts.filter(p => p.url !== currentPage && (!p.tags || p.tags.length === 0 || !p.image || !p.excerpt));
        // Harvest in parallel (limit concurrency lightly)
        Promise.all(incomplete.slice(0,10).map(p => autoHarvestPostMetadata(p)))
            .then(() => { /* metadata enriched */ })
            .catch(()=>{});
        relatedPosts = allBlogPosts.filter(post => {
            if (post.url === currentPage) return false;
            return post.tags && post.tags.some(tag => currentTags.includes(tag));
        }).slice(0, 3);
    }
    
    // Create tags section with related posts
    const tagsSection = document.createElement('div');
    tagsSection.id = 'current-tags';
    tagsSection.className = 'tags-section';
    tagsSection.style.cssText = `
        margin: 30px 0;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #223142;
    `;
    
    // Build tags display
    let tagsHTML = `
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <strong style="color: #223142;" class="tags-title">
                <i class="fas fa-tags"></i> ট্যাগ:
            </strong>
            ${currentTags.map(tag => `
                <a href="search-results.html?tag=${encodeURIComponent(tag)}" 
                   class="tag-link"
                   style="background: linear-gradient(135deg, #223142 0%, #EEA73B 100%); 
                          color: white; 
                          padding: 6px 15px; 
                          border-radius: 20px; 
                          font-size: 13px; 
                          text-decoration: none; 
                          transition: all 0.3s;
                          display: inline-block;
                          box-shadow: 0 2px 6px rgba(34, 49, 66, 0.3);"
                   onmouseenter="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(34, 49, 66, 0.4)'"
                   onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 6px rgba(34, 49, 66, 0.3)'">
                    ${tag}
                </a>
            `).join('')}
        </div>
        <p style="margin: 15px 0 0 0; color: #666; font-size: 14px;" class="tags-info">
            <i class="fas fa-info-circle"></i> 
            এই ট্যাগগুলোতে ক্লিক করে আরও পোস্ট দেখুন
        </p>
    `;
    
    // Add related posts cards if available
    if (relatedPosts.length > 0) {
        tagsHTML += `
            <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
                <h3 style="color: #223142; margin-bottom: 15px; font-size: 18px;">
                    <i class="fas fa-book"></i> একই ট্যাগের আরও পোস্ট
                </h3>
                <div class="related-posts-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    ${relatedPosts.map(post => {
                        // Extract image from og:image meta tag
                        const imageUrl = post.image || 'assets/images/blog/default.jpg';
                        
                        return `
                            <a href="${post.url}" style="text-decoration: none; display: block;">
                                <div class="related-post-card" style="
                                    background: white;
                                    border-radius: 8px;
                                    overflow: hidden;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                                    transition: all 0.3s;
                                    height: 100%;"
                                    onmouseenter="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.2)'"
                                    onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
                                    <div style="
                                        width: 100%;
                                        height: 150px;
                                        background: url('${imageUrl}') center/cover;
                                        background-color: #f0f0f0;">
                                    </div>
                                    <div style="padding: 15px;">
                                        <h4 style="
                                            color: #223142;
                                            font-size: 16px;
                                            margin: 0 0 8px 0;
                                            line-height: 1.4;
                                            display: -webkit-box;
                                            -webkit-line-clamp: 2;
                                            -webkit-box-orient: vertical;
                                            overflow: hidden;">
                                            ${post.title}
                                        </h4>
                                        <p style="
                                            color: #666;
                                            font-size: 13px;
                                            margin: 0;
                                            display: -webkit-box;
                                            -webkit-line-clamp: 2;
                                            -webkit-box-orient: vertical;
                                            overflow: hidden;">
                                            ${post.excerpt || ''}
                                        </p>
                                        <div style="margin-top: 10px; display: flex; gap: 5px; flex-wrap: wrap;">
                                            ${post.tags.slice(0, 2).map(tag => `
                                                <span style="
                                                    background: #EEA73B;
                                                    color: white;
                                                    padding: 3px 8px;
                                                    border-radius: 10px;
                                                    font-size: 11px;">
                                                    ${tag}
                                                </span>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    tagsSection.innerHTML = tagsHTML;
    
    // Add dark mode styles
    const darkModeStyle = document.createElement('style');
    darkModeStyle.textContent = `
        body.dark-mode .tags-section {
            background: #2d2d2d !important;
            border-left-color: #EEA73B !important;
        }
        body.dark-mode .tags-title {
            color: #e0e0e0 !important;
        }
        body.dark-mode .tags-info {
            color: #b0b0b0 !important;
        }
    `;
    document.head.appendChild(darkModeStyle);
    
    const nav = article.querySelector('.blog-nav');
    const newsletter = article.querySelector('#newsletter-subscription');
    
    if (newsletter) {
        newsletter.parentNode.insertBefore(tagsSection, newsletter);
    } else if (nav) {
        article.insertBefore(tagsSection, nav);
    } else {
        article.appendChild(tagsSection);
    }
}

// ==================== AUTO METADATA HARVEST ====================
const harvestCache = {};
async function autoHarvestPostMetadata(post) {
    if (!post || harvestCache[post.url]) return post;
    try {
        const res = await fetch(post.url);
        if (!res.ok) return post;
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        // Title
        if (!post.title) {
            const t = doc.querySelector('title');
            if (t) post.title = t.textContent.trim();
        }
        // OG Image / fallback first img
        if (!post.image) {
            const og = doc.querySelector('meta[property="og:image"]');
            if (og && og.content) post.image = og.content; else {
                const firstImg = doc.querySelector('img');
                if (firstImg && firstImg.getAttribute('src')) post.image = firstImg.getAttribute('src');
            }
        }
        // Description / excerpt
        if (!post.excerpt) {
            const desc = doc.querySelector('meta[name="description"]');
            if (desc && desc.content) post.excerpt = desc.content.trim();
            if (!post.excerpt) {
                const para = doc.querySelector('.blog-post-body p, article p, .intro, p');
                if (para) post.excerpt = para.textContent.trim().slice(0,160) + (para.textContent.length>160?'…':'');
            }
        }
        // Tags: try meta keywords or spans using existing pattern
        if (!post.tags || post.tags.length === 0) {
            let tags = [];
            const kw = doc.querySelector('meta[name="keywords"]');
            if (kw && kw.content) {
                tags = kw.content.split(',').map(s=>s.trim()).filter(Boolean);
            } else {
                const metaSpans = doc.querySelectorAll('.meta .date, .meta .time');
                metaSpans.forEach(s => { const txt = s.textContent.trim(); if (txt) tags.push(txt); });
            }
            post.tags = Array.from(new Set(tags)).slice(0,5);
        }
        // Build meta text for search integration if available
        if (!post._metaText && typeof normalizeText === 'function') {
            post._metaText = normalizeText([
                post.title||'', post.excerpt||'', (post.tags||[]).join(' ')
            ].join(' '));
        }
        harvestCache[post.url] = true;
        return post;
    } catch {
        return post;
    }
}

// ==================== TAGS DISPLAY ====================
function displayTags() {
    // Tags are already displayed by createRelatedPosts()
    // This function is kept for compatibility
    console.log('Tags displayed by createRelatedPosts()');
}

// ==================== CATEGORIES DISPLAY ====================
function displayCategories() {
    // Categories can be derived from tags if needed
    console.log('Categories feature - uses tags from meta section');
}

// ==================== CATEGORY DISPLAY ====================
function displayCategory() {
    const article = document.querySelector('.blog-post-body');
    if (!article) return;
    
    // Check if allBlogPosts is available from global-search.js
    if (typeof allBlogPosts === 'undefined') {
        console.warn('allBlogPosts not available for category display');
        return;
    }
    
    const currentUrl = window.location.pathname.split('/').pop();
    const currentPost = allBlogPosts.find(post => post.url === currentUrl);
    
    if (!currentPost || !currentPost.category) return;
    
    const categoryBadge = document.createElement('div');
    categoryBadge.className = 'category-badge';
    categoryBadge.innerHTML = `
        <i class="fas fa-folder"></i> ${currentPost.category}
    `;
    categoryBadge.style.cssText = `
        display: inline-block;
        padding: 5px 12px;
        background: #17a2b8;
        color: white;
        border-radius: 20px;
        font-size: 14px;
        margin: 10px 10px 10px 0;
        font-weight: 500;
    `;
    
    const lastUpdated = article.querySelector('.last-updated');
    if (lastUpdated) {
        lastUpdated.parentNode.insertBefore(categoryBadge, lastUpdated.nextSibling);
    }
}

// ==================== ARCHIVE/TIMELINE ====================
function createArchivePage() {
    // Only run on archive page
    if (!window.location.pathname.includes('archive') && !window.location.pathname.includes('timeline')) {
        return;
    }
    
    const container = document.querySelector('.container');
    if (!container) return;
    
    // Group posts by year and month
    const groupedPosts = {};
    
    blogPostsMetadata.forEach(post => {
        const date = new Date(post.date);
        const year = date.getFullYear();
        const month = date.toLocaleDateString('bn-BD', { month: 'long' });
        
        if (!groupedPosts[year]) {
            groupedPosts[year] = {};
        }
        if (!groupedPosts[year][month]) {
            groupedPosts[year][month] = [];
        }
        groupedPosts[year][month].push(post);
    });
    
    let archiveHTML = '<h2 style="text-align: center; margin-bottom: 30px; color: #223142;">আর্কাইভ</h2>';
    
    Object.keys(groupedPosts).sort((a, b) => b - a).forEach(year => {
        archiveHTML += `<div style="margin-bottom: 40px;">
            <h3 style="color: #223142; border-bottom: 2px solid #223142; padding-bottom: 10px; margin-bottom: 20px;">
                <i class="fas fa-calendar-alt"></i> ${year}
            </h3>`;
        
        Object.keys(groupedPosts[year]).forEach(month => {
            archiveHTML += `<div style="margin-bottom: 25px;">
                <h4 style="color: #EEA73B; margin-bottom: 15px;">${month}</h4>
                <ul style="list-style: none; padding: 0;">`;
            
            groupedPosts[year][month].forEach(post => {
                archiveHTML += `
                    <li style="margin-bottom: 15px; padding-left: 25px; position: relative;">
                        <i class="fas fa-circle" style="position: absolute; left: 0; top: 8px; font-size: 8px; color: #223142;"></i>
                        <a href="${post.url}" style="color: #333; text-decoration: none; transition: color 0.3s;">
                            ${post.title}
                        </a>
                        <span style="color: #999; font-size: 13px; margin-left: 10px;">
                            ${new Date(post.date).toLocaleDateString('bn-BD')}
                        </span>
                    </li>`;
            });
            
            archiveHTML += `</ul></div>`;
        });
        
        archiveHTML += `</div>`;
    });
    
    container.innerHTML = archiveHTML;
}

// ==================== POPULAR POSTS (based on view count) ====================
function showPopularPosts() {
    // Only on index page
    const isIndexPage = window.location.pathname.includes('index') || window.location.pathname === '/' || window.location.pathname === '/blogs/';
    if (!isIndexPage) return;
    
    const container = document.querySelector('.main-wrapper');
    if (!container) return;
    
    // Get view counts from localStorage
    const postsWithViews = blogPostsMetadata.map(post => {
        const viewKey = `views_${window.location.origin}/${post.url}`;
        const views = parseInt(localStorage.getItem(viewKey)) || 0;
        return { ...post, views };
    }).sort((a, b) => b.views - a.views).slice(0, 5);
    
    if (postsWithViews.every(post => post.views === 0)) return;
    
    const popularSection = document.createElement('div');
    popularSection.id = 'popular-posts';
    popularSection.style.cssText = `
        background: #f8f9fa;
        padding: 30px;
        border-radius: 10px;
        margin: 40px auto;
        max-width: 900px;
    `;
    
    popularSection.innerHTML = `
        <h3 style="margin: 0 0 20px 0; color: #223142; text-align: center;">
            <i class="fas fa-fire"></i> জনপ্রিয় লেখা
        </h3>
        <div style="display: flex; flex-direction: column; gap: 15px;">
            ${postsWithViews.map((post, index) => `
                <a href="${post.url}" style="
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 15px;
                    background: white;
                    border-radius: 8px;
                    text-decoration: none;
                    color: #333;
                    transition: all 0.3s;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                " class="popular-post-item">
                    <div style="
                        font-size: 24px;
                        font-weight: bold;
                        color: #223142;
                        min-width: 30px;
                    ">${index + 1}</div>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0; color: #223142; font-size: 16px;">${post.title}</h4>
                        <p style="margin: 0; color: #666; font-size: 13px;">
                            <i class="fas fa-eye"></i> ${post.views} বার পড়া হয়েছে
                        </p>
                    </div>
                </a>
            `).join('')}
        </div>
    `;
    
    // Add hover effect
    setTimeout(() => {
        document.querySelectorAll('.popular-post-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateX(5px)';
                item.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
                item.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
            });
        });
    }, 100);
    
    container.insertBefore(popularSection, container.firstChild);
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    createRelatedPosts();
    displayTags();
    displayCategory();
    createArchivePage();
    showPopularPosts();
    console.log('✅ Related posts, tags, and archive features loaded!');
});
