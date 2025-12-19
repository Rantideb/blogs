"use strict";

document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('#archive-container');
    
    if (!container) {
        console.error('Archive container not found');
        return;
    }

    // Pagination settings
    const POSTS_PER_PAGE = 10;
    let currentPage = 1;
    let allPosts = [];
    let filteredPosts = [];

    // Create search input
    const searchDiv = document.createElement('div');
    searchDiv.className = 'mb-4';
    searchDiv.innerHTML = `
        <input type="text" id="archive-search" class="form-control" placeholder="খুঁজুন...">
    `;
    container.appendChild(searchDiv);

    // Create posts container
    const postsList = document.createElement('div');
    postsList.id = 'archive-posts-list';
    container.appendChild(postsList);

    // Create pagination container
    const paginationDiv = document.createElement('nav');
    paginationDiv.className = 'blog-nav nav my-5';
    paginationDiv.setAttribute('aria-label', 'Page navigation');
    paginationDiv.id = 'pagination-container';
    container.appendChild(paginationDiv);

    // Fetch posts data
    fetch('assets/data/posts-metadata.json')
        .then(response => response.json())
        .then(posts => {
            allPosts = posts;
            filteredPosts = posts;
            renderPosts(currentPage);
            renderPagination();

            // Search functionality
            document.getElementById('archive-search').addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                filteredPosts = allPosts.filter(post =>
                    post.title.toLowerCase().includes(searchTerm) ||
                    (post.description && post.description.toLowerCase().includes(searchTerm)) ||
                    (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm))
                );
                currentPage = 1;
                renderPosts(currentPage);
                renderPagination();
            });
        })
        .catch(error => {
            console.error('Error loading posts:', error);
            postsList.innerHTML = '<p class="text-center">Error loading archive. Please try again later.</p>';
        });

    function renderPosts(page) {
        const startIndex = (page - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);

        if (postsToShow.length === 0) {
            postsList.innerHTML = '<p class="text-center">No posts found.</p>';
            return;
        }

        let html = '';
        postsToShow.forEach(post => {
            // Get post image or use default
            const postImage = post.image || 'assets/images/blog/default.jpg';
            
            // Get excerpt (longer version if available)
            const excerpt = post.excerpt || post.description || 'No description available.';
            
            // Get meta information
            const metaDate = post.meta_date || '';
            const metaTime = post.meta_time || '';
            
            // Build meta HTML if we have meta info
            let metaHtml = '';
            if (metaDate || metaTime) {
                metaHtml = `<div class="meta mb-1">`;
                if (metaDate) metaHtml += `<span class="date">${metaDate}</span>`;
                if (metaTime) metaHtml += `<span class="time">${metaTime}</span>`;
                metaHtml += `</div>`;
            }
            
            html += `
                <div class="item mb-5">
                    <div class="row g-3 g-xl-0">
                        <div class="col-2 col-xl-3">
                            <img class="img-fluid post-thumb" src="${postImage}" alt="${post.title}">
                        </div>
                        <div class="col">
                            <h3 class="title mb-1"><a class="text-link" href="${post.url}">${post.title}</a></h3>
                            ${metaHtml}
                            <div class="intro"><p align="justify">${excerpt}</p></div>
                            <a class="text-link" href="${post.url}">সম্পূর্ণ পড়ুন &rarr;</a>
                        </div><!--//col-->
                    </div><!--//row-->
                </div><!--//item-->
            `;
        });
        postsList.innerHTML = html;

        // Scroll to top of posts list
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderPagination() {
        const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
        
        if (totalPages <= 1) {
            paginationDiv.innerHTML = '';
            return;
        }

        let html = '<ul class="pagination justify-content-center">';
        
        // Previous button
        if (currentPage > 1) {
            html += `<li class="page-item">
                <a class="page-link" href="#" data-page="${currentPage - 1}">
                    <i class="fas fa-arrow-left me-2"></i>পূর্ববর্তী
                </a>
            </li>`;
        }

        // Page numbers
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        if (startPage > 1) {
            html += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
            if (startPage > 2) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            html += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
        }

        // Next button
        if (currentPage < totalPages) {
            html += `<li class="page-item">
                <a class="page-link" href="#" data-page="${currentPage + 1}">
                    পরবর্তী<i class="fas fa-arrow-right ms-2"></i>
                </a>
            </li>`;
        }

        html += '</ul>';
        paginationDiv.innerHTML = html;

        // Add click handlers to pagination links
        paginationDiv.querySelectorAll('a.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.getAttribute('data-page'));
                if (page && page !== currentPage) {
                    currentPage = page;
                    renderPosts(currentPage);
                    renderPagination();
                }
            });
        });
    }
});
