import HomeClient from "./HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KYU? Streetwear — Premium Oversized T-Shirts, India",
  description: "Premium oversized streetwear by Kyu clothing. Heavyweight 240 GSM cotton tees featuring minimal fronts and bold back graphic designs. Shop Kyu Season One live now.",
  keywords: ["Kyu streetwear", "Kyu clothing", "streetwear brand India"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KYU? — Wear Your Curiosity",
    description: "Premium oversized streetwear from India. Season One is live — heavyweight 240 GSM tees built for the bold and the curious.",
    url: "https://kyu-wear.vercel.app",
    siteName: "KYU?",
    images: [
      {
        url: "https://res.cloudinary.com/du3nga7zg/image/upload/v1777835099/final_black_front_mdjizc.jpg",
        width: 1200,
        height: 630,
        alt: "KYU? Streetwear Season One Campaign",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KYU? — Wear Your Curiosity",
    description: "Premium oversized streetwear from India. Season One is live — heavyweight 240 GSM tees built for the bold and the curious.",
    images: ["https://res.cloudinary.com/du3nga7zg/image/upload/v1777835099/final_black_front_mdjizc.jpg"],
  },
};

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyu-wear.vercel.app';
  
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KYU?",
    "url": siteUrl,
    "logo": `${siteUrl}/images/logo.png`,
    "sameAs": [
      "https://instagram.com/algo.inn"
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KYU?",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${siteUrl}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <h1 className="sr-only">KYU? Streetwear — Premium Heavyweight Oversized T-Shirts in India</h1>
      <HomeClient />
    </>
  );
}
