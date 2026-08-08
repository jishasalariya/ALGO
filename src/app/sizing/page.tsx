import React from "react";
import Link from "next/link";
import { Syne } from "next/font/google";
import { ArrowLeft, MoveRight, Ruler, CheckCircle2, HelpCircle } from "lucide-react";
import type { Metadata } from "next";
import { getBreadcrumbSchema } from "@/lib/schema";

const syne = Syne({
  weight: ["800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Size Guide | KYU? Streetwear — Oversized Fit & Sizing",
  description: "Find your ideal fit with the official KYU? Streetwear size guide. Learn about our signature 240 GSM heavyweight cotton, drop-shoulder relaxed boxy fit, and available sizes.",
  keywords: ["KYU size guide", "oversized t-shirt sizing", "240 GSM oversized fit", "streetwear sizing India"],
  alternates: {
    canonical: "/sizing",
  },
  openGraph: {
    title: "KYU? Size Guide — Oversized Streetwear Fit",
    description: "Official sizing and fit guide for KYU? Streetwear. Discover how our 240 GSM drop-shoulder oversized tees fit.",
    url: "https://kyuwear.vercel.app/sizing",
  },
  twitter: {
    card: "summary_large_image",
    title: "KYU? Size Guide — Oversized Streetwear Fit",
    description: "Official sizing and fit guide for KYU? Streetwear. Discover how our 240 GSM drop-shoulder oversized tees fit.",
  },
};

export default function SizingPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyuwear.vercel.app';

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "KYU? Size Guide",
    "url": `${siteUrl}/sizing`,
    "description": "Official sizing and fit guide for KYU? Streetwear oversized t-shirts.",
    "publisher": {
      "@type": "Organization",
      "name": "KYU?",
      "url": siteUrl
    }
  };

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Size Guide", url: `${siteUrl}/sizing` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      
      <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pt-24 pb-32 font-sans">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
          <Link href="/" className="text-lg md:text-2xl font-bold tracking-tighter uppercase">
            KYU?
          </Link>
          <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-medium">
            <Link href="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
            <Link href="/blog" className="hover:text-gray-400 transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-gray-400 transition-colors">About</Link>
            <Link href="/account" className="hover:text-gray-400 transition-colors">Account</Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 mt-12 md:mt-20">
          <Link href="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>

          {/* Header Title */}
          <header className="mb-16 md:mb-20 border-b border-white/10 pb-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block mb-3 font-semibold font-mono">Fit & Proportions</span>
            <h1 className={`${syne.className} text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-6`}>
              SIZE GUIDE.
            </h1>
            <p className="text-gray-400 text-sm md:text-base font-light max-w-2xl leading-relaxed">
              Every KYU? garment is engineered around a signature oversized aesthetic. We design our pieces with deliberate volume, dropped shoulders, and a structured drape to make a statement straight out of the box.
            </p>
          </header>

          {/* Narrative / Content */}
          <div className="space-y-16 text-gray-300 text-sm md:text-base leading-relaxed tracking-wide font-light">
            
            {/* Section 1: How KYU? Fits */}
            <section className="space-y-6">
              <h2 className="text-white text-xl md:text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                <Ruler className="w-5 h-5 text-gray-400" /> How KYU? Fits
              </h2>
              <p>
                KYU? t-shirts are intentionally designed with an <strong>oversized, relaxed boxy cut</strong>. Unlike standard regular-fit tees that hug the body, our pieces feature:
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-white mt-1 shrink-0" />
                  <span><strong>Drop-Shoulder Silhouette:</strong> Lowered shoulder seams that create a natural, relaxed streetwear drape.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-white mt-1 shrink-0" />
                  <span><strong>Wider Chest & Body:</strong> Generous ease through the torso for unrestricted movement and airflow.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-white mt-1 shrink-0" />
                  <span><strong>240 GSM Heavyweight Cotton:</strong> Substantial fabric weight that holds its structured, boxy shape without clinging.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-white mt-1 shrink-0" />
                  <span><strong>Proportional Hem Length:</strong> Calibrated to complement wide-leg pants, cargos, and relaxed bottoms.</span>
                </li>
              </ul>
            </section>

            {/* Section 2: Available Sizes */}
            <section className="space-y-6 pt-6 border-t border-white/10">
              <h2 className="text-white text-xl md:text-2xl font-bold uppercase tracking-tight">
                Available Sizes
              </h2>
              <p>
                KYU? Season One pieces are currently produced in four core sizes:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <div key={size} className="bg-[#111] border border-white/10 p-6 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl md:text-3xl font-bold text-white mb-1">{size}</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Oversized Cut</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: How to Choose Your Size */}
            <section className="space-y-6 pt-6 border-t border-white/10">
              <h2 className="text-white text-xl md:text-2xl font-bold uppercase tracking-tight">
                How to Choose Your Size
              </h2>
              <p>
                Because our garments already feature built-in oversized proportions, you do not need to size up to achieve an oversized look:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="bg-[#111] border border-white/10 p-6 rounded-none space-y-3">
                  <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">True to Size</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Choose your usual standard size for our intended signature drop-shoulder, relaxed boxy streetwear fit.
                  </p>
                </div>
                <div className="bg-[#111] border border-white/10 p-6 rounded-none space-y-3">
                  <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">Size Down (1 Size)</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    If you prefer a closer, more tailored appearance with moderate shoulder drape and less body volume.
                  </p>
                </div>
                <div className="bg-[#111] border border-white/10 p-6 rounded-none space-y-3">
                  <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">Size Up (1 Size)</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    If you desire an exaggerated, ultra-loose silhouette with extra sleeve length and deep drop-shoulders.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4: Oversized vs Regular Fit */}
            <section className="space-y-6 pt-6 border-t border-white/10">
              <h2 className="text-white text-xl md:text-2xl font-bold uppercase tracking-tight">
                Oversized vs Regular Fit
              </h2>
              <p>
                A standard regular t-shirt follows the body&apos;s natural contours with snug armholes and set-in shoulders. In contrast, KYU? oversized t-shirts feature extended chest dimensions and lowered shoulder lines. 
              </p>
              <p>
                For a deeper dive into fit comparisons and outfit styling, explore our editorial:
              </p>
              <div className="pt-2">
                <Link 
                  href="/blog/oversized-vs-regular-fit-which-one-actually-suits-you" 
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white border border-white/20 hover:border-white px-5 py-3 transition-colors"
                >
                  Read: Oversized vs Regular Fit Guide <MoveRight className="w-4 h-4" />
                </Link>
              </div>
            </section>

            {/* Section 5: Garment Measurements Notice */}
            {/* TODO: Insert exact numerical garment measurement chart (Chest, Length, Shoulder, Sleeve in inches/cm) once officially published */}
            <section className="space-y-4 pt-6 border-t border-white/10 bg-zinc-950/40 p-6 border border-white/5">
              <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">Garment Measurements</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Detailed flat-lay garment dimension charts (chest width, body length, shoulder span, and sleeve length) will be updated with each seasonal release. If you require exact centimeter or inch measurements for a specific drop, our team is available to assist.
              </p>
            </section>

            {/* Section 6: Need Help */}
            <section className="space-y-6 pt-6 border-t border-white/10">
              <h2 className="text-white text-xl md:text-2xl font-bold uppercase tracking-tight flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-gray-400" /> Need Help?
              </h2>
              <p>
                Still uncertain about which size to choose? Contact our support team for guidance before placing your order:
              </p>
              <div className="space-y-2 text-sm text-gray-300 font-mono">
                <p>Email: <a href="mailto:kyuwear.in@gmail.com" className="text-white hover:underline">kyuwear.in@gmail.com</a></p>
                <p>Phone: <a href="tel:+919001913162" className="text-white hover:underline">+91 9001913162</a> / <a href="tel:+917566696374" className="text-white hover:underline">+91 7566696374</a></p>
                <p className="text-gray-500 text-xs">Hours: Mon-Fri, 10:00 AM - 7:00 PM IST</p>
              </div>
            </section>

          </div>

          {/* Call to Action */}
          <div className="mt-24 text-center flex flex-col items-center gap-6 border-t border-white/10 pt-16">
            <h2 className="text-xl md:text-2xl uppercase tracking-widest font-medium">Ready to Shop?</h2>
            <Link href="/shop" className="group flex items-center gap-3 px-8 py-4 border border-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-xs font-semibold">
              Browse Season One <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
