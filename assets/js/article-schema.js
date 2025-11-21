/**
 * Generate Article Schema for Blog Posts
 * This script automatically creates JSON-LD schema markup for better SEO
 */

function generateArticleSchema() {
    // Extract article information from the page
    const title = document.querySelector('h1, .title, .heading')?.innerText || document.title;
    const description = document.querySelector('meta[name="description"]')?.content || '';
    const author = document.querySelector('meta[name="author"]')?.content || 'Rantideb';
    const image = document.querySelector('meta[property="og:image"]')?.content || '';

    // Try to extract publish date from meta tags or content
    const datePublished = document.querySelector('meta[property="article:published_time"]')?.content ||
        document.querySelector('.date, .meta .date')?.innerText ||
        new Date().toISOString();

    // Get the canonical URL
    const url = document.querySelector('link[rel="canonical"]')?.href || window.location.href;

    // Create the schema object
    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "image": image.startsWith('http') ? image : `https://textandtech.me/${image}`,
        "author": {
            "@type": "Person",
            "name": "Rantideb"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Rantideb's Blog",
            "logo": {
                "@type": "ImageObject",
                "url": "https://textandtech.me/assets/images/profile.jpg"
            }
        },
        "datePublished": datePublished,
        "dateModified": datePublished,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        },
        "inLanguage": "bn"
    };

    // Check if schema already exists
    const existingSchema = document.querySelector('script[type="application/ld+json"]');
    if (existingSchema && existingSchema.textContent.includes('"@type": "BlogPosting"')) {
        return; // Schema already exists
    }

    // Create and inject the schema script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', generateArticleSchema);
