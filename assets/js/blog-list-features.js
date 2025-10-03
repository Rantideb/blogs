/**
 * Blog List Page Features
 * Search and Filter functionality for blog listing pages
 */

function createSearchAndFilter() {
    const blogList = document.querySelector('.blog-list');
    if (!blogList) return;
    
    const container = blogList.querySelector('.container');
    if (!container) return;
    
    // Create search and filter section
    const searchFilterSection = document.createElement('div');
    searchFilterSection.id = 'search-filter-section';
    searchFilterSection.style.cssText = `
        background: white;
        padding: 25px;
        border-radius: 10px;
        margin-bottom: 30px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    
    searchFilterSection.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4 style="margin: 0 0 15px 0; color: #223142;">
                <i class="fas fa-search"></i> খুঁজুন এবং ফিল্টার করুন
            </h4>
            <div style="position: relative;">
                <input 
                    type="text" 
                    id="blog-search-input" 
                    placeholder="ব্লগ পোস্ট খুঁজুন..." 
                    style="
                        width: 100%;
                        padding: 12px 45px 12px 15px;
                        border: 2px solid #223142;
                        border-radius: 25px;
                        font-size: 16px;
                        outline: none;
                        transition: all 0.3s;
                    "
                />
                <i class="fas fa-search" style="
                    position: absolute;
                    right: 18px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #223142;
                    font-size: 18px;
                "></i>
            </div>
        </div>
        
        <div id="filter-tags" style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            <strong style="color: #223142;">
                <i class="fas fa-filter"></i> ফিল্টার:
            </strong>
            <button class="filter-tag active" data-tag="all" style="
                padding: 8px 18px;
                background: linear-gradient(135deg, #223142 0%, #EEA73B 100%);
                color: white;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s;
            ">সব দেখুন</button>
        </div>
        
        <div id="search-results-count" style="
            margin-top: 15px;
            padding: 10px;
            background: #f0f7ff;
            border-radius: 5px;
            display: none;
        "></div>
    `;
    
    // Insert before the first blog item
    const firstItem = container.querySelector('.item');
    if (firstItem) {
        container.insertBefore(searchFilterSection, firstItem);
    }
    
    // Extract all unique tags from blog posts
    extractAndDisplayTags();
    
    // Implement search functionality
    implementSearch();
    
    // Implement filter functionality
    implementFilter();
}

function extractAndDisplayTags() {
    const items = document.querySelectorAll('.item');
    const tagsSet = new Set();
    
    items.forEach(item => {
        const metaSpans = item.querySelectorAll('.meta span');
        metaSpans.forEach(span => {
            const tag = span.textContent.trim();
            if (tag) {
                tagsSet.add(tag);
            }
        });
    });
    
    const filterTagsContainer = document.getElementById('filter-tags');
    const tags = Array.from(tagsSet).sort();
    
    tags.forEach(tag => {
        const tagButton = document.createElement('button');
        tagButton.className = 'filter-tag';
        tagButton.setAttribute('data-tag', tag);
        tagButton.textContent = tag;
        tagButton.style.cssText = `
            padding: 8px 18px;
            background: white;
            color: #223142;
            border: 2px solid #223142;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
        `;
        
        tagButton.addEventListener('mouseenter', () => {
            if (!tagButton.classList.contains('active')) {
                tagButton.style.background = '#FFF5E6';
            }
        });
        
        tagButton.addEventListener('mouseleave', () => {
            if (!tagButton.classList.contains('active')) {
                tagButton.style.background = 'white';
            }
        });
        
        filterTagsContainer.appendChild(tagButton);
    });
    
    // Add info text about global search
    const infoText = document.createElement('div');
    infoText.style.cssText = `
        margin-top: 10px;
        padding: 10px;
        background: #E3F2FD;
        border-left: 4px solid #223142;
        border-radius: 5px;
        font-size: 13px;
        color: #223142;
    `;
    infoText.innerHTML = `
        <i class="fas fa-info-circle"></i> 
        <strong>টিপস:</strong> পুরো সাইট জুড়ে কোন ট্যাগ খুঁজতে 
        <a href="search-results.html" style="color: #EEA73B; text-decoration: underline;">গ্লোবাল সার্চ পেজ</a> ব্যবহার করুন
    `;
    filterTagsContainer.parentElement.appendChild(infoText);
}

function implementSearch() {
    const searchInput = document.getElementById('blog-search-input');
    const items = document.querySelectorAll('.item');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        let visibleCount = 0;
        
        items.forEach(item => {
            const title = item.querySelector('.title')?.textContent.toLowerCase() || '';
            const intro = item.querySelector('.intro')?.textContent.toLowerCase() || '';
            const meta = item.querySelector('.meta')?.textContent.toLowerCase() || '';
            
            const matches = title.includes(query) || intro.includes(query) || meta.includes(query);
            
            if (query === '' || matches) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        updateResultsCount(query, visibleCount);
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

function implementFilter() {
    const filterButtons = document.querySelectorAll('.filter-tag');
    const items = document.querySelectorAll('.item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedTag = button.getAttribute('data-tag');
            
            // If it's not "all", offer to search globally
            if (selectedTag !== 'all') {
                // Check if user wants to search globally (Ctrl/Cmd + Click)
                if (event.ctrlKey || event.metaKey) {
                    window.location.href = `search-results.html?tag=${encodeURIComponent(selectedTag)}`;
                    return;
                }
            }
            
            // Update active state
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = 'white';
                btn.style.color = '#223142';
                btn.style.border = '2px solid #223142';
            });
            
            button.classList.add('active');
            button.style.background = 'linear-gradient(135deg, #223142 0%, #EEA73B 100%)';
            button.style.color = 'white';
            button.style.border = 'none';
            
            // Filter items
            let visibleCount = 0;
            
            items.forEach(item => {
                const metaSpans = item.querySelectorAll('.meta span');
                let hasTag = false;
                
                metaSpans.forEach(span => {
                    if (span.textContent.trim() === selectedTag) {
                        hasTag = true;
                    }
                });
                
                if (selectedTag === 'all' || hasTag) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            updateResultsCount(selectedTag, visibleCount, true);
            
            // Clear search input
            const searchInput = document.getElementById('blog-search-input');
            if (searchInput) {
                searchInput.value = '';
            }
        });
        
        // Add tooltip on hover
        if (button.getAttribute('data-tag') !== 'all') {
            button.title = 'ক্লিক করে এই পেজে ফিল্টার করুন | Ctrl/Cmd + ক্লিক করে পুরো সাইটে খুঁজুন';
        }
    });
}

function updateResultsCount(query, count, isFilter = false) {
    const resultsCount = document.getElementById('search-results-count');
    
    if (query === '' || query === 'all') {
        resultsCount.style.display = 'none';
        return;
    }
    
    const message = isFilter 
        ? `"${query}" ট্যাগে ${count} টি পোস্ট পাওয়া গেছে`
        : `"${query}" এর জন্য ${count} টি ফলাফল পাওয়া গেছে`;
    
    resultsCount.textContent = message;
    resultsCount.style.display = 'block';
    
    if (count === 0) {
        resultsCount.style.background = '#ffebee';
        resultsCount.style.color = '#c62828';
    } else {
        resultsCount.style.background = '#f0f7ff';
        resultsCount.style.color = '#1976d2';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    createSearchAndFilter();
    console.log('✅ Blog list search and filter loaded!');
});
