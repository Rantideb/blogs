/**
 * Bengali Comment System (No Login Required)
 * Simple comment system with Bengali language support
 */

function createBengaliCommentSystem() {
    const article = document.querySelector('.blog-post');
    if (!article) return;
    
    const pageUrl = window.location.pathname.split('/').pop();
    
    const commentsSection = document.createElement('div');
    commentsSection.id = 'bengali-comments-section';
    commentsSection.style.cssText = `
        margin: 40px 0;
        padding: 30px;
        background: #f8f9fa;
        border-radius: 10px;
    `;
    
    commentsSection.innerHTML = `
        <h3 style="margin: 0 0 25px 0; color: #333; border-bottom: 3px solid #223142; padding-bottom: 10px;">
            <i class="fas fa-comments"></i> মন্তব্য (<span id="comment-count">0</span>)
        </h3>
        
        <!-- Comment Form -->
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <h4 style="margin: 0 0 15px 0; color: #223142;">আপনার মন্তব্য লিখুন</h4>
            <form id="comment-form">
                <div style="margin-bottom: 15px;">
                    <input 
                        type="text" 
                        id="commenter-name" 
                        placeholder="আপনার নাম *" 
                        required
                        style="
                            width: 100%;
                            padding: 12px 15px;
                            border: 2px solid #ddd;
                            border-radius: 8px;
                            font-size: 16px;
                            outline: none;
                            transition: border-color 0.3s;
                        "
                    />
                </div>
                <div style="margin-bottom: 15px;">
                    <textarea 
                        id="comment-text" 
                        placeholder="বাংলায় আপনার মন্তব্য লিখুন... *" 
                        required
                        rows="4"
                        style="
                            width: 100%;
                            padding: 12px 15px;
                            border: 2px solid #ddd;
                            border-radius: 8px;
                            font-size: 16px;
                            outline: none;
                            resize: vertical;
                            transition: border-color 0.3s;
                            font-family: inherit;
                        "
                    ></textarea>
                    <div style="font-size: 12px; color: #999; margin-top: 5px;">
                        <i class="fas fa-info-circle"></i> দয়া করে বাংলায় মন্তব্য করুন
                    </div>
                </div>
                <button 
                    type="submit"
                    style="
                        padding: 12px 30px;
                        background: linear-gradient(135deg, #223142 0%, #EEA73B 100%);
                        color: white;
                        border: none;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                    "
                    onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.4)'"
                    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
                >
                    <i class="fas fa-paper-plane"></i> মন্তব্য জমা দিন
                </button>
            </form>
        </div>
        
        <!-- Comments List -->
        <div id="comments-list"></div>
    `;
    
    const nav = article.querySelector('.blog-nav');
    const newsletter = article.querySelector('#newsletter-subscription');
    const relatedPosts = article.querySelector('#related-posts');
    
    if (relatedPosts) {
        relatedPosts.parentNode.insertBefore(commentsSection, relatedPosts.nextSibling);
    } else if (newsletter) {
        newsletter.parentNode.insertBefore(commentsSection, newsletter);
    } else if (nav) {
        nav.parentNode.insertBefore(commentsSection, nav);
    } else {
        article.appendChild(commentsSection);
    }
    
    // Load existing comments
    loadComments(pageUrl);
    
    // Handle form submission
    setupCommentForm(pageUrl);
    
    // Add input focus styles
    setupInputStyles();
}

function loadComments(pageUrl) {
    const commentsKey = `comments_${pageUrl}`;
    const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
    
    displayComments(comments);
    updateCommentCount(comments.length);
}

function displayComments(comments) {
    const commentsList = document.getElementById('comments-list');
    
    if (comments.length === 0) {
        commentsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #999;">
                <i class="fas fa-comments" style="font-size: 50px; margin-bottom: 15px; opacity: 0.3;"></i>
                <p>এখনো কোন মন্তব্য নেই। প্রথম মন্তব্য করুন!</p>
            </div>
        `;
        return;
    }
    
    // Sort comments by date (newest first)
    comments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    commentsList.innerHTML = comments.map((comment, index) => `
        <div class="comment-item" style="
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            border-left: 4px solid #223142;
            position: relative;
        ">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #223142 0%, #EEA73B 100%);
                        color: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: 18px;
                    ">
                        ${comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div style="font-weight: 600; color: #333; font-size: 16px;">
                            ${escapeHtml(comment.name)}
                        </div>
                        <div style="font-size: 12px; color: #999;">
                            <i class="fas fa-clock"></i> ${formatDate(comment.date)}
                        </div>
                    </div>
                </div>
                <button 
                    onclick="deleteComment(${index})" 
                    style="
                        background: none;
                        border: none;
                        color: #dc3545;
                        cursor: pointer;
                        font-size: 18px;
                        padding: 5px;
                        transition: all 0.3s;
                    "
                    onmouseover="this.style.transform='scale(1.2)'"
                    onmouseout="this.style.transform='scale(1)'"
                    title="মুছে ফেলুন"
                >
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            <div style="
                color: #555;
                line-height: 1.6;
                font-size: 15px;
                word-wrap: break-word;
                white-space: pre-wrap;
            ">
                ${escapeHtml(comment.text)}
            </div>
        </div>
    `).join('');
}

function setupCommentForm(pageUrl) {
    const form = document.getElementById('comment-form');
    const nameInput = document.getElementById('commenter-name');
    const textInput = document.getElementById('comment-text');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = nameInput.value.trim();
        const text = textInput.value.trim();
        
        if (!name || !text) {
            showMessage('দয়া করে সব ফিল্ড পূরণ করুন', 'error');
            return;
        }
        
        // Check if comment is in Bengali (contains Bengali Unicode characters)
        const bengaliRegex = /[\u0980-\u09FF]/;
        if (!bengaliRegex.test(text)) {
            showMessage('দয়া করে বাংলায় মন্তব্য লিখুন', 'error');
            return;
        }
        
        const commentsKey = `comments_${pageUrl}`;
        const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
        
        const newComment = {
            name: name,
            text: text,
            date: new Date().toISOString(),
            id: Date.now()
        };
        
        comments.push(newComment);
        localStorage.setItem(commentsKey, JSON.stringify(comments));
        
        // Clear form
        nameInput.value = '';
        textInput.value = '';
        
        // Reload comments
        displayComments(comments);
        updateCommentCount(comments.length);
        
        showMessage('আপনার মন্তব্য সফলভাবে যুক্ত হয়েছে!', 'success');
        
        // Scroll to the new comment
        setTimeout(() => {
            document.getElementById('comments-list').scrollIntoView({ behavior: 'smooth' });
        }, 500);
    });
}

function deleteComment(index) {
    if (!confirm('আপনি কি এই মন্তব্যটি মুছে ফেলতে চান?')) {
        return;
    }
    
    const pageUrl = window.location.pathname.split('/').pop();
    const commentsKey = `comments_${pageUrl}`;
    const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
    
    comments.splice(index, 1);
    localStorage.setItem(commentsKey, JSON.stringify(comments));
    
    displayComments(comments);
    updateCommentCount(comments.length);
    
    showMessage('মন্তব্য মুছে ফেলা হয়েছে', 'success');
}

function updateCommentCount(count) {
    const countElement = document.getElementById('comment-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 1) {
        return 'এইমাত্র';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} মিনিট আগে`;
    } else if (diffHours < 24) {
        return `${diffHours} ঘন্টা আগে`;
    } else if (diffDays === 1) {
        return 'গতকাল';
    } else if (diffDays < 7) {
        return `${diffDays} দিন আগে`;
    } else {
        return date.toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function setupInputStyles() {
    const inputs = document.querySelectorAll('#commenter-name, #comment-text');
    
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.borderColor = '#223142';
            input.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        });
        
        input.addEventListener('blur', () => {
            input.style.borderColor = '#ddd';
            input.style.boxShadow = 'none';
        });
    });
}

function showMessage(text, type) {
    const existingMessage = document.getElementById('comment-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.id = 'comment-message';
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Make deleteComment global
window.deleteComment = deleteComment;

// Add animations
if (!document.getElementById('comment-animations')) {
    const style = document.createElement('style');
    style.id = 'comment-animations';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
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
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    createBengaliCommentSystem();
    console.log('✅ Bengali comment system loaded!');
});
