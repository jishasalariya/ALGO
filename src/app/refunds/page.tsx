import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, CheckCircle2, HelpCircle } from "lucide-react";
import type { Metadata } from "next";
import { getBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Refunds Policy | KYU? Streetwear",
  description: "KYU? Streetwear refunds and cancellation guidelines. Detailed information on return eligibility, damaged product support, and order cancellation.",
  alternates: {
    canonical: "/refunds",
  },
  openGraph: {
    title: "Refunds Policy | KYU? Streetwear",
    description: "All sales final policy and defective item replacement standards at KYU? Streetwear.",
    url: "https://kyuwear.vercel.app/refunds",
  },
};

export default function RefundsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyuwear.vercel.app';

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Refunds Policy", url: `${siteUrl}/refunds` }
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">Refund Policy</h1>
          <p className="text-gray-400 text-sm mb-12 font-light">Official terms regarding refunds, replacements, and defective goods.</p>
          
          <div className="space-y-10 text-gray-300 leading-relaxed text-sm md:text-base">
            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-gray-400" /> 1. Final Sale Policy
              </h2>
              <p className="text-gray-400 text-sm">
                At KYU?, all sales are final. We do not provide monetary refunds or accept returns for change of mind. Please check garment details and our <Link href="/sizing" className="text-white underline underline-offset-4 hover:text-gray-300">Size Guide</Link> prior to ordering.
              </p>
            </section>

            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-gray-400" /> 2. Defective Goods Resolution
              </h2>
              <p className="text-gray-400 text-sm">
                In the rare instance that a garment arrives damaged or incorrect, email <a href="mailto:kyuwear.in@gmail.com" className="text-white underline font-mono">kyuwear.in@gmail.com</a> within 48 hours with proof for a prompt replacement.
              </p>
            </section>

            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gray-400" /> 3. Contact Support
              </h2>
              <p className="text-gray-400 text-sm">
                For order support, contact <a href="mailto:kyuwear.in@gmail.com" className="text-white underline font-mono">kyuwear.in@gmail.com</a> or phone <a href="tel:+919001913162" className="text-white underline font-mono">+91 9001913162</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
