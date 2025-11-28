"use strict";

document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.container.single-col-max-width');

    // Create search input
    const searchDiv = document.createElement('div');
    searchDiv.className = 'mb-5';
    searchDiv.innerHTML = `
        <input type="text" id="archive-search" class="form-control" placeholder="Search posts...">
    `;
    container.appendChild(searchDiv);

    // Create posts container
    const postsList = document.createElement('div');
    postsList.id = 'archive-posts-list';
    container.appendChild(postsList);

    // Fetch posts data
    fetch('assets/data/posts-metadata.json')
        .then(response => response.json())
        .then(posts => {
            renderPosts(posts);

            // Search functionality
            document.getElementById('archive-search').addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const filteredPosts = posts.filter(post =>
                    post.title.toLowerCase().includes(searchTerm) ||
                    post.description.toLowerCase().includes(searchTerm)
                );
                renderPosts(filteredPosts);
            });
        })
        .catch(error => {
            console.error('Error loading posts:', error);
            postsList.innerHTML = '<p class="text-center">Error loading archive. Please try again later.</p>';
        });

    function renderPosts(posts) {
        if (posts.length === 0) {
            postsList.innerHTML = '<p class="text-center">No posts found.</p>';
            return;
        }

        let html = '';
        posts.forEach(post => {
            html += `
                <div class="item mb-5">
                    <div class="row g-3 g-xl-0">
                        <div class="col">
                            <h3 class="title mb-1"><a class="text-link" href="${post.url}">${post.title}</a></h3>
                            <div class="intro">${post.description}</div>
                            <a class="text-link" href="${post.url}">Read more &rarr;</a>
                        </div>
                    </div>
                </div>
            `;
        });
        postsList.innerHTML = html;
    }
});
