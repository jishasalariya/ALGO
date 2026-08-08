import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Privacy Policy | KYU? Streetwear",
  description: "KYU? Streetwear customer data privacy policy. Details on personal information protection, order encryption, and secure checkout practices.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | KYU? Streetwear",
    description: "Official customer privacy and data security policies of KYU? Streetwear.",
    url: "https://kyuwear.vercel.app/privacy",
  },
};

export default function PrivacyPolicy() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyuwear.vercel.app';

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Privacy Policy", url: `${siteUrl}/privacy` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-black text-white pt-24 pb-32 font-sans selection:bg-white selection:text-black">
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
          <Link href="/" className="text-lg md:text-2xl font-bold tracking-tighter uppercase">KYU?</Link>
          <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-medium">
            <Link href="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
            <Link href="/sizing" className="hover:text-gray-400 transition-colors">Sizing</Link>
            <Link href="/faq" className="hover:text-gray-400 transition-colors">FAQ</Link>
            <Link href="/about" className="hover:text-gray-400 transition-colors">About</Link>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 mt-12">
          <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-12 font-light">How KYU? protects and manages your personal information and transaction data.</p>
          
          <div className="space-y-10 text-gray-300 leading-relaxed text-sm md:text-base">
            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider">1. Information We Collect</h2>
              <p className="text-gray-400 text-sm">
                We collect essential contact information provided during checkout (full name, shipping address, email address, and phone number) exclusively to fulfill your orders and transmit delivery tracking updates.
              </p>
            </section>

            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider">2. Payment Security</h2>
              <p className="text-gray-400 text-sm">
                We do not store your credit card or bank credentials on our servers. All monetary transactions are processed through encrypted, PCI-DSS compliant payment gateways.
              </p>
            </section>

            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider">3. Data Protection</h2>
              <p className="text-gray-400 text-sm">
                KYU? does not sell, rent, or trade your personal data to third-party marketing networks. For inquiries regarding your customer record, email us at <a href="mailto:kyuwear.in@gmail.com" className="text-white underline font-mono">kyuwear.in@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
