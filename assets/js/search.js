/**
 * Blog Search Functionality
 * Client-side search implementation
 */

// Blog posts database - Update this with your actual posts
const blogPosts = [
    {
        title: "আমার অস্থিরতা যদি তুমি দেখতে!",
        url: "amar-osthirota.html",
        excerpt: "গৌতম স্থির হলো বোধিবৃক্ষে, মুহম্মদ হেরায় কলিঙ্গে, অশোক জীবনানন্দ ধর্মতলায়",
        tags: ["প্রেম", "অস্থিরতা", "জীবন"]
    },
    {
        title: "সাথী",
        url: "sathi.html",
        excerpt: "কেউ হাহাকার করছে ছেড়ে যাওয়া মানুষটির স্মৃতিতে",
        tags: ["সাথী", "প্রেম", "স্মৃতি"]
    },
    {
        title: "অপ্রাপ্তি",
        url: "oprapti.html",
        excerpt: "অপ্রাপ্তি সম্পর্কে চিন্তাভাবনা",
        tags: ["অপ্রাপ্তি", "দুঃখ"]
    },
    {
        title: "প্রেম",
        url: "prem.html",
        excerpt: "প্রেম সম্পর্কে",
        tags: ["প্রেম", "ভালোবাসা"]
    },
    {
        title: "জীবন",
        url: "life.html",
        excerpt: "জীবনের গল্প",
        tags: ["জীবন", "দর্শন"]
    }
    // Add more posts here
];

function createSearchBar() {
    // Check if we're on the index page
    const isIndexPage = window.location.pathname.includes('index') || window.location.pathname === '/' || window.location.pathname === '/blogs/';
    
    if (!isIndexPage) return;
    
    const header = document.querySelector('.header');
    if (!header) return;
    
    const searchContainer = document.createElement('div');
    searchContainer.id = 'search-container';
    searchContainer.style.cssText = `
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
    `;
    
    const searchBox = document.createElement('div');
    searchBox.style.cssText = `
        position: relative;
        display: flex;
        align-items: center;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'search-input';
    searchInput.placeholder = 'ব্লগ খুঁজুন...';
    searchInput.style.cssText = `
        width: 100%;
        padding: 12px 40px 12px 15px;
        border: 2px solid #223142;
        border-radius: 25px;
        font-size: 16px;
        outline: none;
        transition: all 0.3s;
    `;
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search';
    searchIcon.style.cssText = `
        position: absolute;
        right: 15px;
        color: #223142;
        font-size: 18px;
    `;
    
    searchBox.appendChild(searchInput);
    searchBox.appendChild(searchIcon);
    searchContainer.appendChild(searchBox);
    
    const searchResults = document.createElement('div');
    searchResults.id = 'search-results';
    searchResults.style.cssText = `
        margin-top: 20px;
        display: none;
    `;
    searchContainer.appendChild(searchResults);
    
    // Insert after navigation
    const navigation = header.querySelector('.navbar');
    if (navigation) {
        navigation.parentNode.insertBefore(searchContainer, navigation.nextSibling);
    } else {
        header.appendChild(searchContainer);
    }
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        const results = blogPosts.filter(post => 
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query))
        );
        
        displaySearchResults(results, query);
    });
    
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#EEA73B';
        searchInput.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = '#223142';
        searchInput.style.boxShadow = 'none';
    });
}

function displaySearchResults(results, query) {
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #666;">
                <i class="fas fa-search" style="font-size: 40px; margin-bottom: 10px; opacity: 0.5;"></i>
                <p>কোন ফলাফল পাওয়া যায়নি "${query}" এর জন্য</p>
            </div>
        `;
        searchResults.style.display = 'block';
        return;
    }
    
    searchResults.innerHTML = `
        <div style="padding: 10px 0; color: #223142; font-weight: 600;">
            ${results.length} টি ফলাফল পাওয়া গেছে
        </div>
    `;
    
    results.forEach(post => {
        const resultItem = document.createElement('a');
        resultItem.href = post.url;
        resultItem.style.cssText = `
            display: block;
            padding: 15px;
            margin: 10px 0;
            background: white;
            border-radius: 8px;
            text-decoration: none;
            color: #333;
            transition: all 0.3s;
            border: 1px solid #e0e0e0;
        `;
        
        resultItem.innerHTML = `
            <h4 style="margin: 0 0 8px 0; color: #223142;">${highlightText(post.title, query)}</h4>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${highlightText(post.excerpt, query)}</p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${post.tags.map(tag => `<span style="background: #f0f0f0; padding: 4px 10px; border-radius: 12px; font-size: 12px;">${tag}</span>`).join('')}
            </div>
        `;
        
        resultItem.addEventListener('mouseenter', () => {
            resultItem.style.transform = 'translateY(-2px)';
            resultItem.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            resultItem.style.borderColor = '#223142';
        });
        
        resultItem.addEventListener('mouseleave', () => {
            resultItem.style.transform = 'translateY(0)';
            resultItem.style.boxShadow = 'none';
            resultItem.style.borderColor = '#e0e0e0';
        });
        
        searchResults.appendChild(resultItem);
    });
    
    searchResults.style.display = 'block';
}

function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background: #fff3cd; padding: 2px 4px; border-radius: 3px;">$1</mark>');
}

// Initialize search on page load
document.addEventListener('DOMContentLoaded', () => {
    createSearchBar();
    console.log('✅ Search functionality loaded!');
});
