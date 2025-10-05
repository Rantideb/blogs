/**
 * Firebase Comments System
 * Universal comment system for all blog posts
 * Automatically creates comment section and handles all interactions
 */

// Firebase Configuration - UPDATE THESE VALUES AFTER CREATING YOUR FIREBASE PROJECT
  const firebaseConfig = {
    apiKey: "AIzaSyBWeJbZIE6uPhQlhmuLX17uj-3wv5KFwEc",
    authDomain: "ranti-blog-comments.firebaseapp.com",
    projectId: "ranti-blog-comments",
    storageBucket: "ranti-blog-comments.firebasestorage.app",
    messagingSenderId: "146118500825",
    appId: "1:146118500825:web:05a72cde19fd346eab39c8"
  };

// Initialize Firebase (only if config is set)
let db = null;
let isFirebaseConfigured = false;

function initializeFirebase() {
    // Check if Firebase config is properly set
    if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
        console.warn('Firebase not configured yet. Please update firebaseConfig in firebase-comments.js');
        createPlaceholderComments();
        return false;
    }
    
    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        isFirebaseConfigured = true;
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        createPlaceholderComments();
        return false;
    }
}

// Get current page identifier
function getCurrentPageUrl() {
    return window.location.pathname;
}

// Resolve best container and anchor inside the single column content area
function getCommentsInsertionPoint() {
    // Core single-column container inside a blog post
    const container = document.querySelector(
        '.blog-post .container.single-col-max-width, ' +
        'article .container.single-col-max-width, ' +
        '.main-wrapper .container.single-col-max-width, ' +
        '.container.single-col-max-width'
    );
    if (container) {
        // Prefer to insert after a post navigation bar if it exists (keeps comments at the end of content but before unrelated footers)
        const nav = container.querySelector('.blog-nav.nav');
        if (nav) return { container, afterNode: nav };
        // Otherwise after the main body
        const body = container.querySelector('.blog-post-body');
        if (body) return { container, afterNode: body };
        return { container, afterNode: container.lastElementChild };
    }
    // Fallbacks
    const article = document.querySelector('.blog-post, article');
    if (article) return { container: article, afterNode: article.lastElementChild };
    const main = document.querySelector('.main-wrapper') || document.body;
    return { container: main, afterNode: main.lastElementChild };
}

// Create comment section HTML structure automatically
function createCommentSection() {
    // Prevent duplicates
    if (document.getElementById('firebase-comments-root')) return;

    // Determine insertion point aligned with page layout
    const { container, afterNode } = getCommentsInsertionPoint();
    if (!container) return;

    // Create comments container
    const commentsSection = document.createElement('div');
    commentsSection.id = 'firebase-comments-root';
    commentsSection.className = 'comments-section';
    commentsSection.style.cssText = `
        width: 100%;
        margin: 2.5rem 0 1rem 0;
    `;

    commentsSection.innerHTML = `
        <h3 style="color: #223142; border-bottom: 3px solid #EEA73B; padding-bottom: 10px; margin-bottom: 30px; font-size: 24px;">
            <i class="fas fa-comments" style="margin-right: 10px;"></i>মন্তব্য করুন
        </h3>
        
        <!-- Comment Form -->
        <form id="firebase-comment-form" style="margin: 30px 0; padding: 25px; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(34, 49, 66, 0.1); border-left: 4px solid #EEA73B;">
            <div style="margin-bottom: 20px;">
                <label for="firebase-comment-name" style="display: block; margin-bottom: 8px; color: #223142; font-weight: bold; font-size: 14px;">
                    নাম <span style="color: #EEA73B;">*</span>
                </label>
                <input 
                    type="text" 
                    id="firebase-comment-name" 
                    required 
                    placeholder="আপনার নাম লিখুন"
                    style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 14px; transition: border-color 0.3s; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#EEA73B'"
                    onblur="this.style.borderColor='#e0e0e0'"
                >
            </div>
            
            <div style="margin-bottom: 20px;">
                <label for="firebase-comment-email" style="display: block; margin-bottom: 8px; color: #223142; font-weight: bold; font-size: 14px;">
                    ইমেইল <span style="color: #999; font-weight: normal;">(ঐচ্ছিক)</span>
                </label>
                <input 
                    type="email" 
                    id="firebase-comment-email" 
                    placeholder="your@email.com (প্রয়োজন নেই)"
                    style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 14px; transition: border-color 0.3s; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#EEA73B'"
                    onblur="this.style.borderColor='#e0e0e0'"
                >
            </div>
            
            <div style="margin-bottom: 20px;">
                <label for="firebase-comment-text" style="display: block; margin-bottom: 8px; color: #223142; font-weight: bold; font-size: 14px;">
                    মন্তব্য <span style="color: #EEA73B;">*</span>
                </label>
                <textarea 
                    id="firebase-comment-text" 
                    rows="5" 
                    required 
                    placeholder="আপনার মন্তব্য লিখুন..."
                    maxlength="2000"
                    style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 6px; font-size: 14px; resize: vertical; font-family: inherit; transition: border-color 0.3s; box-sizing: border-box;"
                    onfocus="this.style.borderColor='#EEA73B'"
                    onblur="this.style.borderColor='#e0e0e0'"
                ></textarea>
                <div style="text-align: right; color: #999; font-size: 12px; margin-top: 5px;">
                    <span id="char-count">0</span>/2000
                </div>
            </div>
            
            <button 
                type="submit" 
                id="firebase-submit-comment" 
                style="background: linear-gradient(135deg, #EEA73B 0%, #d89429 100%); color: white; padding: 14px 35px; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; font-weight: bold; transition: all 0.3s; box-shadow: 0 4px 6px rgba(238, 167, 59, 0.3);"
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(238, 167, 59, 0.4)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(238, 167, 59, 0.3)'"
            >
                <i class="fas fa-paper-plane" style="margin-right: 8px;"></i>মন্তব্য পাঠান
            </button>
        </form>
        
        <!-- Comments Count -->
        <div id="firebase-comments-count" style="margin: 30px 0; padding: 15px; background: #f8f9fa; border-radius: 6px; text-align: center; color: #223142; font-weight: bold;">
            <i class="fas fa-spinner fa-spin"></i> মন্তব্য লোড হচ্ছে...
        </div>
        
        <!-- Comments List -->
        <div id="firebase-comments-list" style="margin-top: 20px;">
        </div>
    `;
    
    // Insert comments section right after the main content inside the single-column container
    if (afterNode && afterNode.parentNode === container) {
        afterNode.insertAdjacentElement('afterend', commentsSection);
    } else {
        container.appendChild(commentsSection);
    }
    
    // Add character counter
    const textarea = document.getElementById('firebase-comment-text');
    const charCount = document.getElementById('char-count');
    if (textarea && charCount) {
        textarea.addEventListener('input', () => {
            charCount.textContent = textarea.value.length;
        });
    }
}

// Create placeholder when Firebase is not configured
function createPlaceholderComments() {
    // Prevent duplicates
    if (document.getElementById('firebase-comments-root')) return;

    const { container, afterNode } = getCommentsInsertionPoint();
    if (!container) return;

    const placeholder = document.createElement('div');
    placeholder.id = 'firebase-comments-root';
    placeholder.style.cssText = `
        width: 100%;
        margin: 2.5rem 0 1rem 0;
        padding: 30px;
        background: #fff5e6;
        border: 2px dashed #EEA73B;
        border-radius: 8px;
        text-align: center;
        box-sizing: border-box;
    `;
    placeholder.innerHTML = `
        <i class="fas fa-cog fa-3x" style="color: #EEA73B; margin-bottom: 20px;"></i>
        <h3 style="color: #223142; margin-bottom: 15px;">মন্তব্য সিস্টেম সেটআপ করুন</h3>
        <p style="color: #666; margin-bottom: 10px;">Firebase কনফিগারেশন সম্পূর্ণ করুন মন্তব্য সক্রিয় করতে।</p>
        <p style="color: #999; font-size: 14px;">
            <code>assets/js/firebase-comments.js</code> ফাইলে <code>firebaseConfig</code> আপডেট করুন।
        </p>
    `;
    // Insert placeholder at the same aligned position
    if (afterNode && afterNode.parentNode === container) {
        afterNode.insertAdjacentElement('afterend', placeholder);
    } else {
        container.appendChild(placeholder);
    }
}

// Load comments from Firestore
async function loadComments() {
    if (!isFirebaseConfigured) return;
    
    const commentsList = document.getElementById('firebase-comments-list');
    const commentsCount = document.getElementById('firebase-comments-count');
    const pageUrl = getCurrentPageUrl();
    
    try {
        // Simplified query - get all comments for this page, filter and sort in JavaScript
        const snapshot = await db.collection('comments')
            .where('pageUrl', '==', pageUrl)
            .get();
        
        // Filter approved comments and sort by timestamp
        const comments = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.approved === true) {
                comments.push({ id: doc.id, ...data });
            }
        });
        
        // Sort by timestamp descending (newest first)
        comments.sort((a, b) => b.timestamp - a.timestamp);
        
        const count = comments.length;
        
        // Update count
        if (count === 0) {
            commentsCount.innerHTML = `
                <i class="far fa-comment-dots"></i> এখনও কোন মন্তব্য নেই। প্রথম মন্তব্য করুন!
            `;
            commentsList.innerHTML = '';
            return;
        }
        
        commentsCount.innerHTML = `
            <i class="fas fa-comments"></i> মোট ${count} টি মন্তব্য
        `;
        
        // Build comments HTML
        let html = '';
        comments.forEach(comment => {
            const date = formatBengaliDate(new Date(comment.timestamp));
            const timeAgo = getTimeAgo(comment.timestamp);
            
            html += `
                <div class="comment-item" style="
                    border-left: 4px solid #EEA73B;
                    padding: 20px;
                    margin-bottom: 20px;
                    background: white;
                    border-radius: 6px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    transition: transform 0.2s, box-shadow 0.2s;
                " onmouseover="this.style.transform='translateX(5px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.1)'" onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.05)'">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #EEA73B, #d89429); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px;">
                                ${comment.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <strong style="color: #223142; font-size: 16px; display: block;">${escapeHtml(comment.name)}</strong>
                                <span style="color: #999; font-size: 12px;">${timeAgo}</span>
                            </div>
                        </div>
                        <span style="color: #666; font-size: 13px;">
                            <i class="far fa-calendar-alt"></i> ${date}
                        </span>
                    </div>
                    <p style="color: #333; margin: 0; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;">${escapeHtml(comment.comment)}</p>
                </div>
            `;
        });
        
        commentsList.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsCount.innerHTML = `
            <span style="color: #d32f2f;"><i class="fas fa-exclamation-triangle"></i> মন্তব্য লোড করতে সমস্যা হয়েছে।</span>
        `;
    }
}

// Submit new comment
async function submitComment(event) {
    event.preventDefault();
    
    if (!isFirebaseConfigured) {
        alert('Firebase কনফিগারেশন সম্পূর্ণ করুন।');
        return;
    }
    
    const name = document.getElementById('firebase-comment-name').value.trim();
    const email = document.getElementById('firebase-comment-email').value.trim();
    const commentText = document.getElementById('firebase-comment-text').value.trim();
    const submitBtn = document.getElementById('firebase-submit-comment');
    const pageUrl = getCurrentPageUrl();
    
    // Validation
    if (!name || name.length < 2) {
        alert('দয়া করে একটি সঠিক নাম লিখুন।');
        return;
    }
    
    if (!commentText || commentText.length < 3) {
        alert('দয়া করে একটি মন্তব্য লিখুন।');
        return;
    }
    
    if (commentText.length > 2000) {
        alert('মন্তব্য সর্বোচ্চ ২০০০ অক্ষরের হতে পারে।');
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> পাঠানো হচ্ছে...';
    
    try {
        // Add comment to Firestore
        await db.collection('comments').add({
            pageUrl: pageUrl,
            name: name,
            email: email || '',
            comment: commentText,
            timestamp: Date.now(),
            approved: true, // Set to false if you want manual approval
            userAgent: navigator.userAgent,
            ip: '' // Can be filled by backend if needed
        });
        
        // Clear form
        document.getElementById('firebase-comment-form').reset();
        document.getElementById('char-count').textContent = '0';
        
        // Show success message
        showNotification('আপনার মন্তব্য সফলভাবে পাঠানো হয়েছে! ধন্যবাদ।', 'success');
        
        // Reload comments
        await loadComments();
        
        // Scroll to comments
        document.getElementById('firebase-comments-list').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Error submitting comment:', error);
        showNotification('মন্তব্য পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> মন্তব্য পাঠান';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Format date in Bengali
function formatBengaliDate(date) {
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    
    const day = date.getDate().toString().split('').map(d => bengaliNumerals[d]).join('');
    const month = months[date.getMonth()];
    const year = date.getFullYear().toString().split('').map(d => bengaliNumerals[d]).join('');
    
    return `${day} ${month} ${year}`;
}

// Get time ago text
function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'এইমাত্র';
    if (minutes < 60) return `${minutes} মিনিট আগে`;
    if (hours < 24) return `${hours} ঘণ্টা আগে`;
    if (days < 30) return `${days} দিন আগে`;
    return `${Math.floor(days / 30)} মাস আগে`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add animation styles
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize comments system
function initializeCommentsSystem() {
    // Check if we're on a blog post page (has .blog-post or article)
    const isBlogPost = document.querySelector('.blog-post, article');
    if (!isBlogPost) return;
    
    // Add animation styles
    addAnimationStyles();
    
    // Initialize Firebase
    const firebaseInitialized = initializeFirebase();
    
    // Create comment section
    createCommentSection();
    
    // Load existing comments
    if (firebaseInitialized) {
        loadComments();
        
        // Setup form submission
        const form = document.getElementById('firebase-comment-form');
        if (form) {
            form.addEventListener('submit', submitComment);
        }
    }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCommentsSystem);
} else {
    initializeCommentsSystem();
}
