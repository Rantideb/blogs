/**
 * Global Search & Filter
 * Search across all blog posts from any page
 */

// Complete list of all blog posts
const allBlogPosts = [
    { title: 'পুরুষতন্ত্র', url: 'man.html', tags: ['জুয়েল', 'মুখবইয়ের পৃষ্ঠা'], excerpt: 'পুরুষ জানে না তার বুকে কেন এতো বেদনা, সে প্রতি মুহূর্তে ব্যস্ত পরিবারের বেদনা তাড়ানোয়।', image: 'assets/images/blog/man.jpg', content: 'পুরুষ জানে না তার বুকে কেন এতো বেদনা সে প্রতি মুহূর্তে ব্যস্ত পরিবারের বেদনা তাড়ানোয় পরিবার পরিজন সমাজ সংসার দায়িত্ব কর্তব্য নারী শিশু সন্তান বাবা মা' },
    { title: 'হারিয়ে গিয়েছি', url: 'lost.html', tags: ['চলতে পথে', 'উপেক্ষিত ক্রেঙ্কার'], excerpt: 'এখানে নয়, যতটা পথ তুমি হেঁটে এসেছো, তার কোথাও না কোথাও তুমি ঠিক দাঁড়িয়ে পড়তে পারতে!', image: 'assets/images/blog/broken-blog.jpg', content: 'হারিয়ে যাওয়া পথ খোঁজা জীবন সংগ্রাম দিশা দিক চলা হাঁটা থামা দাঁড়ানো' },
    { title: 'Philosophy Of My Life, You Should Probably Ignore', url: 'life.html', tags: ['Life & Philosophy', 'The Sands of Time'], excerpt: "I've put you on an podestal it's true, Now I want to kick it from under you.", image: 'assets/images/blog/life.jpg', content: 'philosophy life living thoughts thinking existence meaning purpose love hate happiness sadness' },
    { title: 'প্রাক্তন প্রেমিকাকে', url: 'estrangement.html', tags: ['দুঃখের পরিহাস', 'উপেক্ষিত ক্রেঙ্কার'], excerpt: 'তোমার ব্যস্ততা, আমার শূন্যতা- চারিদিকে তোমার সুখের নিয়ন আলো, আমার দুঃখ গুলো মৃত্যুঞ্জয়ী, বড্ড ভালবাসে আমায়।', image: 'assets/images/blog/estrangementblog.jpeg', content: 'প্রাক্তন প্রেমিকা ভালোবাসা বিরহ দুঃখ সুখ একাকীত্ব স্মৃতি বিচ্ছেদ ব্যস্ততা শূন্যতা' },
    { title: 'আমার অস্থিরতা', url: 'amar-osthirota.html', tags: ['পরিহাস', 'উপেক্ষিত ক্রেঙ্কার'], excerpt: 'তোমার চারপাশে এতো এতো মানুষ, তারা সবাই কি কথা বলতে জানে? ভালবাসতে জানে? তুমি প্রতিদিন সন্ধ্যায় বেরোও, বাইরে গিয়ে তুমি হাসো, কান্না করো, তুমি কি আলো পাও?', image: 'assets/images/blog/amar-3.jpeg', content: 'প্লেগ থেকে পালানো বন্ধুদের কাছে যাওয়া রক্ষা পেয়েছিল অজানা অসুস্থতা মৃত্যুর দিন জানালা খোলা ঝাড়ুদার রাস্তার আবর্জনা জীবন ক্লাব ইনস্টিটিউট তরুণ তরুণী পার্ক সিনেমা শহরটা ভাঙচুর ভালোবেসেছি আগুন জ্বালিয়ে ছাই দেবী বরণ ধ্বংসাত্মক নিরীহ উত্তেজিত হৃদরোগ ব্লাড প্রেশার মহাবিপদ সংকেত জাহাজ ভূমধ্যসাগর ঢেউ সাহসী চোখে চোখ রেখে গৌতম বোধিবৃক্ষ মুহম্মদ হেরা অশোক জীবনানন্দ ধর্মতলা অস্থিরতা' },
    { title: 'সমর্পণ', url: 'somorpan.html', tags: ['প্রেম', 'কবিতা'], excerpt: 'তোমায় চাওয়ার কোন স্বপ্ন ছিল না আমার, তুমি এসেছিলে অপ্রত্যাশিত', image: 'assets/images/blog/somorpan.jpg', content: 'সমর্পণ আত্মসমর্পণ ভালোবাসা প্রেম স্বপ্ন অপ্রত্যাশিত হৃদয় মন দেওয়া নেওয়া' },
    { title: 'যাকে ভালোবাসনী', url: 'kauke-valobashoni.html', tags: ['প্রেম', 'বিরহ'], excerpt: 'আমি যাকে ভালোবাসনি তার চোখে সমুদ্র ছিল না, আকাশ ছিল না, কোন মেঘেরও দেখা পাইনি', image: 'assets/images/blog/kauke-valobashoni.jpg' },
    { title: 'কেউ তো নয়', url: 'keutonoy.html', tags: ['একাকীত্ব', 'জীবন'], excerpt: 'প্রত্যেকটা মানুষই আসলে নিজের কাছে একা, পাশের মানুষটা শুধু একটা ভ্রম', image: 'assets/images/blog/keutonoy.jpg' },
    { title: 'সাথী', url: 'sathi.html', tags: ['বন্ধুত্ব', 'জীবন'], excerpt: 'আমার সাথীরা আমাকে ছেড়ে চলে যায়নি, আমিই তাদের ছেড়ে এসেছি নিজের অহংকারে', image: 'assets/images/blog/sathi.jpg' },
    { title: 'অপ্রাপ্তি', url: 'oprapti.html', tags: ['দুঃখ', 'জীবন'], excerpt: 'জীবনে সব কিছু পাওয়া যায় না, কিছু স্বপ্ন শুধু স্বপ্নই থেকে যায়', image: 'assets/images/blog/oprapti.jpg' },
    { title: 'প্রেম', url: 'prem.html', tags: ['প্রেম', 'কবিতা'], excerpt: 'প্রেম মানে শুধু ভালোবাসা নয়, প্রেম মানে একসাথে বেড়ে ওঠা', image: 'assets/images/blog/prem.jpg' },
    { title: 'প্রিয়তা', url: 'priyota.html', tags: ['প্রেম', 'স্মৃতি'], excerpt: 'তুমি আমার প্রিয়তা, আমার সব চাওয়া পাওয়ার কেন্দ্রবিন্দু', image: 'assets/images/blog/priyota.jpg' },
    { title: 'হরিণী', url: 'horini.html', tags: ['প্রকৃতি', 'কবিতা'], excerpt: 'হরিণীর মতো চঞ্চল তুমি, ধরতে গেলেই পালিয়ে যাও', image: 'assets/images/blog/horini.jpg' },
    { title: 'নির্বাসন', url: 'nirbashon.html', tags: ['একাকীত্ব', 'জীবন'], excerpt: 'নির্বাসিত মানুষ আমি, নিজের দেশেই পরবাসী', image: 'assets/images/blog/nirbashon.jpg' },
    { title: 'বন্ধু', url: 'friend.html', tags: ['বন্ধুত্ব', 'জীবন'], excerpt: 'সত্যিকারের বন্ধু মানে যে সব সময় পাশে থাকে', image: 'assets/images/blog/friend.jpg' },
    { title: 'হেম', url: 'hem.html', tags: ['প্রকৃতি', 'ঋতু'], excerpt: 'হেমন্তের সকাল মানে কুয়াশায় ঢাকা এক অন্য জগত', image: 'assets/images/blog/hem.jpeg' },
    { title: 'কোপ্পা', url: 'koppa.html', tags: ['হাস্যরস', 'জীবন'], excerpt: 'জীবনের কোপ্পাগুলো নিয়েই তো আসল মজা', image: 'assets/images/blog/koppa.jpg' },
    { title: 'পাপ', url: 'pap.html', tags: ['চিন্তা', 'দর্শন'], excerpt: 'পাপ-পুণ্য মানুষের তৈরি সংজ্ঞা, প্রকৃতির কাছে সব সমান', image: 'assets/images/blog/pap.jpg' },
    { title: 'প্রশান্ত', url: 'prashanta.html', tags: ['শান্তি', 'জীবন'], excerpt: 'প্রশান্তি খুঁজে পাওয়া যায় না, নিজের ভেতরে তৈরি করতে হয়', image: 'assets/images/blog/prashanta.jpg' },
    { title: 'মন', url: 'mon.html', tags: ['চিন্তা', 'আত্মা'], excerpt: 'মন মানে শুধু মস্তিষ্ক নয়, মন মানে অনুভূতির সমষ্টি', image: 'assets/images/blog/mon.jpg' },
    { title: 'গান্ধারী', url: 'gandhari.html', tags: ['পৌরাণিক', 'কবিতা'], excerpt: 'গান্ধারীর চোখ বাঁধা ছিল, কিন্তু তিনি সবকিছু দেখতে পেতেন', image: 'assets/images/blog/gandhari.jpg' },
    { title: 'ইরাবতী', url: 'iraboti.html', tags: ['নদী', 'প্রকৃতি'], excerpt: 'ইরাবতীর বুকে ভেসে যেতে ইচ্ছে করে', image: 'assets/images/blog/iraboti.jpg' },
    { title: 'মাধবী', url: 'madhovi.html', tags: ['প্রকৃতি', 'ফুল'], excerpt: 'মাধবী ফুলের মতো সুন্দর তুমি', image: 'assets/images/blog/madhovi.jpg' },
    { title: 'অরুন্ধতী', url: 'arundhuti.html', tags: ['প্রেম', 'তারা'], excerpt: 'অরুন্ধতীর মতো দূরে, কিন্তু সবসময় দৃষ্টিতে', image: 'assets/images/blog/arundhuti.jpg' },
    { title: 'রঙ্গবতী', url: 'rangobati.html', tags: ['রং', 'জীবন'], excerpt: 'জীবন রঙিন করতে চাই, রঙ্গবতীর মতো', image: 'assets/images/blog/rangobati.jpg' },
    { title: 'সাপ', url: 'snake.html', tags: ['প্রকৃতি', 'ভয়'], excerpt: 'সাপ ভয়ংকর, কিন্তু সুন্দরও', image: 'assets/images/blog/snake.jpg' },
    { title: 'হাসপাতালের দিনগুলো', url: 'hospital-days.html', tags: ['জীবন', 'অসুস্থতা'], excerpt: 'হাসপাতালে কাটানো দিনগুলো শেখায় জীবনের মূল্য', image: 'assets/images/blog/hospital-days.jpg' },
    { title: 'যারে কাছ ছা ওতুমি', url: 'karechaotumi.html', tags: ['প্রেম', 'আবেগ'], excerpt: 'তোমাকে কাছে চাই, কিন্তু পাই না', image: 'assets/images/blog/karechaotumi.jpg' },
    { title: 'সে যদি জান্তো', url: 'se-jodi-janto.html', tags: ['অনুশোচনা', 'প্রেম'], excerpt: 'সে যদি জানতো আমি কতটা ভালোবাসি', image: 'assets/images/blog/se-jodi-janto.jpg' },
    { title: 'বিদায় বলা', url: 'sayinggoodbye.html', tags: ['বিরহ', 'জীবন'], excerpt: 'বিদায় বলা সবচেয়ে কঠিন কাজ', image: 'assets/images/blog/sayinggoodbye.jpg' },
    { title: 'জীবন সাহ্যানে', url: 'jibon-sahyane.html', tags: ['জীবন', 'সংগ্রাম'], excerpt: 'জীবন মানেই সংগ্রাম, এটাই সহ্য করতে হয়', image: 'assets/images/blog/jibon-sahyane.jpg' },
    { title: 'তোমার', url: 'tomar.html', tags: ['প্রেম', 'আবেগ'], excerpt: 'তোমার জন্যই এই লেখা, এই জীবন', image: 'assets/images/blog/tomar.jpg' },
    { title: 'দুর্যোধন', url: 'durjhodhon.html', tags: ['পৌরাণিক', 'মহাভারত'], excerpt: 'দুর্যোধনও ছিলেন এক বীর, শুধু পথ ভুল ছিল', image: 'assets/images/blog/durjhodhon.jpg' },
    { title: 'অপরিণত', url: 'unfortunate.html', tags: ['জীবন', 'বেদনা'], excerpt: 'কিছু ভালোবাসা অপরিণত থেকে যায়', image: 'assets/images/blog/unfortunate.jpg' },
    { title: 'হারানো, হেরে যাওয়া নাকি ছেড়ে দেওয়া', url: 'lostloseorleft.html', tags: ['দুঃখ', 'জীবন'], excerpt: 'হারানো, হেরে যাওয়া আর ছেড়ে দেওয়া - তিনটাই আলাদা', image: 'assets/images/blog/lostloseorleft.jpg' },
    { title: 'কে', url: 'who.html', tags: ['প্রশ্ন', 'আত্মা'], excerpt: 'আমি কে? এই প্রশ্নের উত্তর খুঁজছি সারাজীবন', image: 'assets/images/blog/who.jpg' },
    { title: 'দোষী', url: 'guilty.html', tags: ['অনুশোচনা', 'জীবন'], excerpt: 'নিজের কাছেই দোষী মনে হয় নিজেকে', image: 'assets/images/blog/guilty.jpg' },
    { title: 'জীবন এবং ভালোবাসা', url: 'lifeandlove.html', tags: ['জীবন', 'প্রেম'], excerpt: 'জীবন মানে ভালোবাসা, ভালোবাসা মানে জীবন', image: 'assets/images/blog/lifeandlove.jpg' },
    { title: 'বেঁচে থাকো এবং বেড়ে ওঠো', url: 'liveandgrow.html', tags: ['জীবন', 'অনুপ্রেরণা'], excerpt: 'শুধু বেঁচে থাকলেই হয় না, বেড়ে উঠতে হয়', image: 'assets/images/blog/liveandgrow.jpg' },
    { title: 'রান্তী', url: 'ranti.html', tags: ['আত্মজীবনী', 'জীবন'], excerpt: 'আমি রান্তী, আমার গল্প এই', image: 'assets/images/blog/ranti.jpg' },
    { title: 'সংবেদন', url: 'submission.html', tags: ['আবেগ', 'জীবন'], excerpt: 'সংবেদনশীল হওয়া মানে দুর্বল হওয়া নয়', image: 'assets/images/blog/submission.jpg' },
    { title: 'অ আমার', url: 'o-amar.html', tags: ['প্রেম', 'আবেগ'], excerpt: 'অ আমার প্রিয়, তুমি কোথায়?', image: 'assets/images/blog/o-amar.jpg' },
    { title: 'দেবী নাকি বেশ্যা', url: 'goddessorhoe.html', tags: ['সমাজ', 'নারী'], excerpt: 'সমাজ নারীকে দেবী বানায়, আবার বেশ্যাও বলে', image: 'assets/images/blog/goddessorhoe.jpg' },
    { title: 'এসসি', url: 'sc.html', tags: ['সমাজ', 'জাতিভেদ'], excerpt: 'জাতিভেদ প্রথা আজও আমাদের পিছু ছাড়েনি', image: 'assets/images/blog/sc.jpg' },
    { title: 'আর্যতীর্থ', url: 'aryotirtho.html', tags: ['ধর্ম', 'তীর্থ'], excerpt: 'তীর্থ মানে শুধু জায়গা নয়, মনের অবস্থাও', image: 'assets/images/blog/aryotirtho.jpg' },
    { title: 'রুট', url: 'root.html', tags: ['পরিচয়', 'শেকড়'], excerpt: 'নিজের রুট, শেকড় ভুলে গেলে হারিয়ে যাওয়ার ভয়', image: 'assets/images/blog/root.jpg' }
];

// Get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        tag: params.get('tag'),
        query: params.get('q')
    };
}

// Initialize search page
function initGlobalSearch() {
    const { tag, query } = getUrlParams();
    const searchInput = document.getElementById('global-search-input');
    const resultsContainer = document.getElementById('results-container');
    const searchTitle = document.getElementById('search-title');
    const searchSubtitle = document.getElementById('search-subtitle');
    
    // Display all unique tags
    displayAllTags();
    
    // If tag parameter exists, filter by that tag
    if (tag) {
        searchTitle.textContent = `"${decodeURIComponent(tag)}" ট্যাগের পোস্ট`;
        searchSubtitle.textContent = 'নিচে সব পোস্ট দেখানো হচ্ছে';
        const filteredPosts = filterByTag(decodeURIComponent(tag));
        displayResults(filteredPosts, `"${decodeURIComponent(tag)}" ট্যাগে`);
    } 
    // If query parameter exists, search
    else if (query) {
        searchInput.value = decodeURIComponent(query);
        searchTitle.textContent = 'সার্চ ফলাফল';
        searchSubtitle.textContent = `"${decodeURIComponent(query)}" খুঁজছেন`;
        
        // Show quick results first
        const quickResults = searchPostsSync(decodeURIComponent(query));
        displayResults(quickResults, `"${decodeURIComponent(query)}" এর জন্য খুঁজছি...`);
        
        // Then do full HTML search
        searchPosts(decodeURIComponent(query)).then(searchResults => {
            displayResults(searchResults, `"${decodeURIComponent(query)}" এর জন্য`);
        });
    }
    // Otherwise show all posts
    else {
        searchTitle.textContent = 'সব পোস্ট';
        searchSubtitle.textContent = 'নিচে সব পোস্ট দেখানো হচ্ছে';
        displayResults(allBlogPosts, '');
    }
    
    // Add search input listener with debouncing for performance
    let searchTimeout;
    searchInput.addEventListener('input', async (e) => {
        const searchQuery = e.target.value.toLowerCase().trim();
        
        // Clear previous timeout
        if (searchTimeout) clearTimeout(searchTimeout);
        
        if (searchQuery) {
            // Show immediate results from metadata
            const quickResults = searchPostsSync(searchQuery);
            displayResults(quickResults, `"${searchQuery}" এর জন্য খুঁজছি...`);
            
            // Debounce the full HTML content search (wait 500ms after user stops typing)
            searchTimeout = setTimeout(async () => {
                const fullResults = await searchPosts(searchQuery);
                displayResults(fullResults, `"${searchQuery}" এর জন্য`);
            }, 500);
        } else {
            displayResults(allBlogPosts, '');
        }
    });
    
    // Focus styling
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#EEA73B';
        searchInput.style.boxShadow = '0 0 0 3px rgba(238, 167, 59, 0.2)';
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = '#223142';
        searchInput.style.boxShadow = 'none';
    });
}

// Display all unique tags
function displayAllTags() {
    const allTagsContainer = document.getElementById('all-tags');
    
    // Only display tags if the container exists (on search results page)
    if (!allTagsContainer) {
        return;
    }
    
    const tagsSet = new Set();
    
    allBlogPosts.forEach(post => {
        post.tags.forEach(tag => tagsSet.add(tag));
    });
    
    const sortedTags = Array.from(tagsSet).sort();
    
    sortedTags.forEach(tag => {
        const tagButton = document.createElement('a');
        tagButton.href = `search-results.html?tag=${encodeURIComponent(tag)}`;
        tagButton.textContent = tag;
        tagButton.style.cssText = `
            padding: 6px 15px;
            background: white;
            color: #223142;
            border: 2px solid #223142;
            border-radius: 20px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        `;
        
        tagButton.addEventListener('mouseenter', () => {
            tagButton.style.background = '#EEA73B';
            tagButton.style.color = 'white';
            tagButton.style.borderColor = '#EEA73B';
        });
        
        tagButton.addEventListener('mouseleave', () => {
            tagButton.style.background = 'white';
            tagButton.style.color = '#223142';
            tagButton.style.borderColor = '#223142';
        });
        
        allTagsContainer.appendChild(tagButton);
    });
}

// Filter posts by tag
function filterByTag(tag) {
    return allBlogPosts.filter(post => 
        post.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    );
}

// Cache for loaded HTML content
const htmlContentCache = {};

// Extract text content from HTML
function extractTextFromHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove script, style, and navigation elements
    const elementsToRemove = doc.querySelectorAll('script, style, nav, header, .navbar, .blog-nav');
    elementsToRemove.forEach(el => el.remove());
    
    // Get text from blog-post-body or main content area
    const contentArea = doc.querySelector('.blog-post-body, article, .main-wrapper');
    if (contentArea) {
        return contentArea.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
    }
    
    return doc.body.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
}

// Load HTML content dynamically
async function loadHTMLContent(url) {
    if (htmlContentCache[url]) {
        return htmlContentCache[url];
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) return '';
        
        const html = await response.text();
        const textContent = extractTextFromHTML(html);
        htmlContentCache[url] = textContent;
        return textContent;
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
        return '';
    }
}

// Search posts with dynamic HTML content loading
async function searchPosts(query) {
    const queryLower = query.toLowerCase();
    const results = [];
    
    // First pass: search in metadata (title, excerpt, tags, cached content)
    for (const post of allBlogPosts) {
        const metadataText = [
            post.title.toLowerCase(),
            post.excerpt.toLowerCase(),
            ...post.tags.map(tag => tag.toLowerCase()),
            post.content ? post.content.toLowerCase() : ''
        ].join(' ');
        
        if (metadataText.includes(queryLower)) {
            results.push(post);
            continue;
        }
        
        // Second pass: load and search actual HTML content
        const htmlContent = await loadHTMLContent(post.url);
        if (htmlContent.includes(queryLower)) {
            results.push(post);
        }
    }
    
    return results;
}

// Synchronous search for initial results (searches metadata only)
function searchPostsSync(query) {
    return allBlogPosts.filter(post => {
        // Search in title, excerpt, and tags
        const searchableText = [
            post.title.toLowerCase(),
            post.excerpt.toLowerCase(),
            ...post.tags.map(tag => tag.toLowerCase()),
            post.content ? post.content.toLowerCase() : ''
        ].join(' ');
        
        return searchableText.includes(query);
    });
}

// Display results
function displayResults(posts, searchInfo) {
    const resultsContainer = document.getElementById('results-container');
    
    if (posts.length === 0) {
        resultsContainer.innerHTML = `
            <div style="
                text-align: center;
                padding: 60px 20px;
                background: #fff5e6;
                border-radius: 10px;
                border: 2px dashed #EEA73B;
            ">
                <i class="fas fa-search" style="font-size: 60px; color: #EEA73B; margin-bottom: 20px;"></i>
                <h3 style="color: #223142; margin-bottom: 10px;">কোন ফলাফল পাওয়া যায়নি</h3>
                <p style="color: #666;">অন্য কিছু দিয়ে চেষ্টা করুন</p>
            </div>
        `;
        return;
    }
    
    const countMessage = searchInfo ? 
        `<div style="
            padding: 15px;
            background: #e8f5e9;
            border-left: 4px solid #223142;
            border-radius: 5px;
            margin-bottom: 25px;
            color: #223142;
            font-weight: 600;
        ">
            ${searchInfo} ${posts.length} টি পোস্ট পাওয়া গেছে
        </div>` : '';
    
    const postsHTML = posts.map(post => `
        <div class="item mb-5" style="
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s;
            border: 2px solid transparent;
        " onmouseenter="this.style.borderColor='#EEA73B'; this.style.boxShadow='0 4px 16px rgba(238,167,59,0.3)'" onmouseleave="this.style.borderColor='transparent'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)'">
            <h3 class="title mb-2">
                <a href="${post.url}" style="color: #223142; text-decoration: none; transition: color 0.3s;" onmouseenter="this.style.color='#EEA73B'" onmouseleave="this.style.color='#223142'">
                    ${post.title}
                </a>
            </h3>
            <div class="meta mb-2" style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${post.tags.map(tag => `
                    <a href="search-results.html?tag=${encodeURIComponent(tag)}" style="
                        background: #FFF5E6;
                        color: #223142;
                        padding: 4px 12px;
                        border-radius: 12px;
                        font-size: 12px;
                        text-decoration: none;
                        transition: all 0.3s;
                    " onmouseenter="this.style.background='#EEA73B'; this.style.color='white'" onmouseleave="this.style.background='#FFF5E6'; this.style.color='#223142'">
                        ${tag}
                    </a>
                `).join('')}
            </div>
            <div class="intro" style="color: #666; margin-bottom: 15px; line-height: 1.6;">
                ${post.excerpt}
            </div>
            <a href="${post.url}" style="
                color: #223142;
                text-decoration: none;
                font-weight: 600;
                transition: color 0.3s;
            " onmouseenter="this.style.color='#EEA73B'" onmouseleave="this.style.color='#223142'">
                সম্পূর্ণ পড়ুন →
            </a>
        </div>
    `).join('');
    
    resultsContainer.innerHTML = countMessage + postsHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initGlobalSearch();
    console.log('✅ Global search initialized!');
});
