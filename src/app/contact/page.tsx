import React from "react";
import ContactClient from "./ContactClient";
import type { Metadata } from "next";
import { getBreadcrumbSchema, getOrganizationSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact KYU? | Customer Support & Headquarters, Indore",
  description: "Get in touch with KYU? Streetwear customer care in Indore, India. Direct email (kyuwear.in@gmail.com) and phone support (+91 9001913162) for sizing and order inquiries.",
  keywords: ["Contact KYU", "KYU customer care", "KYU streetwear phone number", "KYU Indore headquarters"],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact KYU? | Customer Support & Headquarters",
    description: "Reach the KYU? Streetwear founding team in Indore, India for order support, sizing inquiries, and collaboration.",
    url: "https://kyuwear.vercel.app/contact",
  },
};

export default function ContactPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyuwear.vercel.app';

  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact KYU?",
    "url": `${siteUrl}/contact`,
    "description": "Contact channels and headquarters of KYU? Streetwear in Indore, India.",
    "mainEntity": getOrganizationSchema()
  };

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Contact", url: `${siteUrl}/contact` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ContactClient />
    </>
  );
}
