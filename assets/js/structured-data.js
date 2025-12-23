/**
 * Comprehensive Structured Data Generation (AEO & SEO)
 * Handles: Person, Organization, WebSite, BreadcrumbList, BlogPosting, FAQPage
 * 
 * This script runs mostly on the client side to generate JSON-LD dynamically.
 * It is designated to replace article-schema.js.
 */

const SITE_URL = "https://textandtech.me";
const AUTHOR_NAME = "Rantideb";
const GLOBAL_IMAGE = "https://textandtech.me/assets/images/profile.jpg";
const SOCIAL_LINKS = [
    "https://twitter.com/r4ntide3",
    "https://www.linkedin.com/in/rantideb/",
    "https://github.com/Rantideb",
    "https://www.facebook.com/R4ntideb"
];

function injectSchema(schemaData) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);
}

function generateCommonSchema() {
    // 1. Organization Schema
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Text and Tech",
        "url": SITE_URL,
        "logo": {
            "@type": "ImageObject",
            "url": GLOBAL_IMAGE
        },
        "founder": {
            "@type": "Person",
            "name": AUTHOR_NAME,
            "url": "https://www.ranti.dev"
        },
        "sameAs": SOCIAL_LINKS
    };
    injectSchema(orgSchema);

    // 2. Person Schema (The Author)
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": AUTHOR_NAME,
        "url": "https://www.ranti.dev",
        "image": GLOBAL_IMAGE,
        "jobTitle": "DevOps Engineer & Writer",
        "owns": {
            "@type": "Organization",
            "name": "Text and Tech",
            "url": SITE_URL
        },
        "sameAs": SOCIAL_LINKS,
        "knowsAbout": ["DevOps", "Cloud Computing", "Bengali Literature", "Philosophy", "Python", "Docker"]
    };
    injectSchema(personSchema);

    // 3. WebSite Schema (with Search Action)
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Text and Tech",
        "url": SITE_URL,
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://textandtech.me/search-results.html?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };
    injectSchema(websiteSchema);
}

function generateArticleSchema() {
    // Only run on blog posts (check for existing schema or specific markers)
    const isBlogPost = document.querySelector('.blog-post, article');
    if (!isBlogPost) return;

    // Avoid duplicating if static JSON-LD exists (optional check)
    // const existing = document.querySelector('script[type="application/ld+json"]');
    // if (existing && existing.innerText.includes('BlogPosting')) return; 

    const title = document.querySelector('title')?.innerText.split('|')[0].trim() || "Blog Post";
    const description = document.querySelector('meta[name="description"]')?.content || "";
    // Access datePublished from meta tag or default to now
    let datePublished = document.querySelector('meta[property="article:published_time"]')?.content;
    if (!datePublished) datePublished = new Date().toISOString();

    const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;

    // Find Image (og:image or first img in post)
    let image = document.querySelector('meta[property="og:image"]')?.content;
    if (!image) {
        const firstImg = document.querySelector('.blog-post img');
        if (firstImg) image = firstImg.src;
    }
    if (image && !image.startsWith('http')) {
        image = SITE_URL + '/' + image.replace(/^\//, ''); // ensure absolute
    }

    const blogPosting = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": description,
        "image": image || GLOBAL_IMAGE,
        "author": {
            "@type": "Person",
            "name": AUTHOR_NAME,
            "url": SITE_URL
        },
        "publisher": {
            "@type": "Organization",
            "name": "Text and Tech",
            "logo": {
                "@type": "ImageObject",
                "url": GLOBAL_IMAGE
            }
        },
        "datePublished": datePublished,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonical
        }
    };
    injectSchema(blogPosting);
}

function generateFAQSchema() {
    // Look for bootstrap accordion or standard FAQ structure
    const accordion = document.querySelector('.accordion, #faqAccordion');
    if (!accordion) return;

    const faqItems = accordion.querySelectorAll('.accordion-item');
    if (faqItems.length === 0) return;

    const questions = [];
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.accordion-button');
        const answerBody = item.querySelector('.accordion-body');

        if (questionBtn && answerBody) {
            questions.push({
                "@type": "Question",
                "name": questionBtn.innerText.trim(),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": answerBody.innerHTML.trim() // Allows HTML in answer
                }
            });
        }
    });

    if (questions.length > 0) {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": questions
        };
        injectSchema(faqSchema);
    }
}

function generateBreadcrumbSchema() {
    // If a static breadcrumb schema exists in HTML, maybe skip? 
    // Usually static is better if accurate. 
    // But let's check if we have a visual breadcrumb to parse.
    const breadcrumbNav = document.querySelector('nav[aria-label="breadcrumb"] ol');
    if (!breadcrumbNav) return;

    const items = breadcrumbNav.querySelectorAll('li');
    const itemListElement = [];

    items.forEach((li, index) => {
        const link = li.querySelector('a');
        const name = li.innerText.trim();
        const itemUrl = link ? link.href : window.location.href;

        itemListElement.push({
            "@type": "ListItem",
            "position": index + 1,
            "name": name,
            "item": itemUrl
        });
    });

    if (itemListElement.length > 0) {
        const breadcrumbSchema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": itemListElement
        };
        injectSchema(breadcrumbSchema);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    try {
        generateCommonSchema();
        generateArticleSchema();
        generateFAQSchema();
        // generateBreadcrumbSchema(); // Optional: Enable if static schema is reliably missing
    } catch (e) {
        console.error("Schema Generation Error:", e);
    }
});
