/**
 * Newsletter Subscription Feature
 */

function createNewsletterBox() {
    const article = document.querySelector('.blog-post');
    if (!article) return;
    
    const newsletterBox = document.createElement('div');
    newsletterBox.id = 'newsletter-subscription';
    newsletterBox.style.cssText = `
        background: linear-gradient(135deg, #223142 0%, #EEA73B 100%);
        color: white;
        padding: 30px;
        border-radius: 10px;
        margin: 40px 0;
        text-align: center;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    `;
    
    newsletterBox.innerHTML = `
        <div style="max-width: 500px; margin: 0 auto;">
            <i class="fas fa-envelope" style="font-size: 40px; margin-bottom: 15px; opacity: 0.9;"></i>
            <h3 style="margin: 0 0 10px 0; font-size: 24px;">লেখা মানে আমার আত্মকথন</h3>
            <p style="margin: 0 0 20px 0; opacity: 0.9;">ইচ্ছে করলে পড়বেন, না পড়লেও চলবে</p>
            <form id="newsletter-form" style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                <input 
                    type="email" 
                    id="newsletter-email" 
                    placeholder="আপনার ইমেইল ঠিকানা" 
                    required
                    style="
                        flex: 1;
                        min-width: 250px;
                        padding: 12px 20px;
                        border: none;
                        border-radius: 25px;
                        font-size: 16px;
                        outline: none;
                    "
                />
                <button 
                    type="submit"
                    style="
                        padding: 12px 30px;
                        background: white;
                        color: #223142;
                        border: none;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s;
                    "
                    onmouseover="this.style.transform='scale(1.05)'"
                    onmouseout="this.style.transform='scale(1)'"
                >
                    যা খুশি
                </button>
            </form>
            <p id="newsletter-message" style="margin: 15px 0 0 0; font-size: 14px; display: none;"></p>
            <p style="margin: 15px 0 0 0; font-size: 12px; opacity: 0.8;">
                যা হবে, তাই হবে—আপনার খেয়াল নেই, আমারও নেই।
            </p>
        </div>
    `;
    
    const nav = article.querySelector('.blog-nav');
    const comments = article.querySelector('#comments-section');
    
    if (comments) {
        comments.parentNode.insertBefore(newsletterBox, comments);
    } else if (nav) {
        nav.parentNode.insertBefore(newsletterBox, nav);
    } else {
        article.appendChild(newsletterBox);
    }
    
    // Handle form submission
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    const message = document.getElementById('newsletter-message');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email || !email.includes('@')) {
            showMessage('দয়া করে একটি সঠিক ইমেইল ঠিকানা দিন', 'error');
            return;
        }
        
        // Save to localStorage (in production, send to backend/Mailchimp)
        const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
        
        if (subscribers.includes(email)) {
            showMessage('এই ইমেইলটি ইতিমধ্যে সাবস্ক্রাইব করা আছে!', 'info');
            return;
        }
        
        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
        
        showMessage('✅ সফলভাবে সাবস্ক্রাইব হয়েছে! ধন্যবাদ!', 'success');
        emailInput.value = '';
        
        // In production, send to your backend or Mailchimp API
        // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    });
    
    function showMessage(text, type) {
        message.textContent = text;
        message.style.display = 'block';
        message.style.color = type === 'success' ? '#a8f5a8' : type === 'error' ? '#ff6b6b' : 'white';
        
        setTimeout(() => {
            message.style.display = 'none';
        }, 5000);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    createNewsletterBox();
    console.log('✅ Newsletter subscription loaded!');
});
