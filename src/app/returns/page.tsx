import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, CheckCircle2, Ruler, HelpCircle } from "lucide-react";
import type { Metadata } from "next";
import { getBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Returns & Exchanges Policy | KYU? Streetwear",
  description: "KYU? Streetwear returns and exchanges guide. Understand our all sales final policy, sizing guidance, and defective item support.",
  alternates: {
    canonical: "/returns",
  },
  openGraph: {
    title: "Returns & Exchanges Policy | KYU? Streetwear",
    description: "Official returns and exchange policy for KYU? Streetwear apparel.",
    url: "https://kyuwear.vercel.app/returns",
  },
};

export default function ReturnsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyuwear.vercel.app';

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Returns Policy", url: `${siteUrl}/returns` }
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
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">Returns &amp; Exchanges</h1>
          <p className="text-gray-400 text-sm mb-12 font-light">Official guidance on return eligibility, size selections, and replacements.</p>
          
          <div className="space-y-10 text-gray-300 leading-relaxed text-sm md:text-base">
            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-gray-400" /> 1. Return Eligibility
              </h2>
              <p className="text-gray-400 text-sm">
                All sales at KYU? are final. Because we release limited small-batch seasonal drops, we do not accept returns or voluntary exchanges.
              </p>
            </section>

            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider flex items-center gap-2">
                <Ruler className="w-5 h-5 text-gray-400" /> 2. Getting the Right Size
              </h2>
              <p className="text-gray-400 text-sm">
                To prevent sizing issues, please check our <Link href="/sizing" className="text-white underline underline-offset-4 hover:text-gray-300">Official Size &amp; Fit Guide</Link> before placing an order. Our pieces are cut with an intentional oversized drop-shoulder silhouette.
              </p>
            </section>

            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-gray-400" /> 3. Damaged or Defective Items
              </h2>
              <p className="text-gray-400 text-sm">
                If your order arrives damaged or with a manufacturing defect, contact us within 48 hours at <a href="mailto:kyuwear.in@gmail.com" className="text-white underline font-mono">kyuwear.in@gmail.com</a> with photographic evidence for an expedited replacement. Read our full <Link href="/refund" className="text-white underline underline-offset-4 hover:text-gray-300">Cancellation &amp; Refund Policy</Link>.
              </p>
            </section>

            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gray-400" /> 4. Customer Support
              </h2>
              <p className="text-gray-400 text-sm">
                Our support desk is available Monday–Friday, 10:00 AM – 7:00 PM IST via <a href="mailto:kyuwear.in@gmail.com" className="text-white underline font-mono">kyuwear.in@gmail.com</a> and <a href="tel:+919001913162" className="text-white underline font-mono">+91 9001913162</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
