/**
 * Structured Data (JSON-LD) Helper for KYU? Streetwear
 * Generates valid Schema.org objects for Organization, WebSite, Product, BreadcrumbList, and BlogPosting.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyuwear.vercel.app';

export interface ProductData {
  id: string;
  product_name: string;
  slug: string;
  description?: string | null;
  price: number;
  category?: string | null;
  stock_quantity: number;
  sizes?: string[] | null;
  images?: string[] | null;
}

export interface BlogData {
  id: string;
  title: string;
  slug: string;
  cover_image?: string | null;
  body_content?: string | null;
  publish_date?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Organization Schema
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KYU?",
    "alternateName": "KYU? Streetwear",
    "url": SITE_URL,
    "logo": `${SITE_URL}/images/logo.png`,
    "description": "Indian oversized streetwear brand founded in 2026 in Indore by Jisha Salariya and Tanisha Joshi. Creating heavyweight 240 GSM cotton t-shirts with minimal fronts and bold back graphic narratives.",
    "foundingDate": "2026",
    "founder": [
      {
        "@type": "Person",
        "name": "Jisha Salariya",
        "jobTitle": "Co-Founder & Creative Director",
        "worksFor": {
          "@type": "Organization",
          "name": "KYU?"
        },
        "knowsAbout": ["Streetwear Design", "Textile Proportions", "Visual Storytelling"]
      },
      {
        "@type": "Person",
        "name": "Tanisha Joshi",
        "jobTitle": "Co-Founder & Brand Strategist",
        "worksFor": {
          "@type": "Organization",
          "name": "KYU?"
        },
        "knowsAbout": ["Brand Strategy", "Streetwear Culture", "Product Operations"]
      }
    ],
    "knowsAbout": [
      "Heavyweight Streetwear",
      "240 GSM Cotton Knitwear",
      "Oversized Apparel Construction",
      "Indian Contemporary Fashion"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Indore",
      "addressRegion": "Madhya Pradesh",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9001913162",
      "contactType": "customer service",
      "email": "kyuwear.in@gmail.com",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      // TODO: Add official KYU? Instagram URL here when available
      "https://x.com/KyuWear",
      "https://www.linkedin.com/company/kyuwear/",
      "https://www.facebook.com/profile.php?id=61591930839027"
    ]
  };
}

/**
 * WebSite Schema
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KYU?",
    "alternateName": "KYU? Streetwear",
    "url": SITE_URL
  };
}

/**
 * Product Schema with Offer
 */
export function getProductSchema(product: ProductData) {
  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const images = (product.images && product.images.length > 0)
    ? product.images.filter(Boolean)
    : [`${SITE_URL}/images/logo.png`];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.product_name,
    "image": images,
    "description": product.description || `Premium 240 GSM heavyweight cotton ${product.product_name} drop-shoulder oversized fit from KYU? Season One.`,
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "KYU?"
    },
    "category": product.category || "T-Shirts",
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "INR",
      "price": String(product.price),
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "KYU?"
      }
    }
  };
}

/**
 * BreadcrumbList Schema
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * BlogPosting Schema
 */
export function getBlogPostingSchema(post: BlogData) {
  const articleUrl = `${SITE_URL}/blog/${post.slug}`;
  
  const cleanDescription = post.body_content
    ? post.body_content.replace(/<[^>]*>/g, '').slice(0, 160).trim() + '...'
    : `Read ${post.title} on KYU? Journal.`;

  const datePublished = post.publish_date 
    ? new Date(post.publish_date).toISOString() 
    : (post.created_at ? new Date(post.created_at).toISOString() : new Date().toISOString());

  const dateModified = post.updated_at 
    ? new Date(post.updated_at).toISOString() 
    : datePublished;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": cleanDescription,
    "image": post.cover_image ? [post.cover_image] : [`${SITE_URL}/images/logo.png`],
    "url": articleUrl,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "author": {
      "@type": "Organization",
      "name": "KYU? Streetwear",
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "KYU?",
      "url": SITE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/images/logo.png`
      }
    }
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * FAQPage Schema
 */
export function getFAQPageSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}
