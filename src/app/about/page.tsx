import React from "react";
import Link from "next/link";
import { Syne } from "next/font/google";
import { MoveRight, Sparkles, Flame, Eye, MapPin, Calendar, Users, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { getBreadcrumbSchema, getOrganizationSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About KYU? | Indian Oversized Streetwear Brand",
  description: "Learn about KYU?, an independent Indian streetwear brand founded in 2026 in Indore by Jisha Salariya and Tanisha Joshi. Heavyweight 240 GSM tees built on curiosity and bold design.",
  keywords: ["KYU streetwear", "KYU brand story", "streetwear brand India", "Indian streetwear label Indore"],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About KYU? — Indian Oversized Streetwear",
    description: "Founded in 2026 in Indore by Jisha Salariya and Tanisha Joshi. Discover the story, design philosophy, and heavyweight craftsmanship behind KYU?.",
    url: "https://kyuwear.vercel.app/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About KYU? — Indian Oversized Streetwear",
    description: "Founded in 2026 in Indore by Jisha Salariya and Tanisha Joshi. Discover the story, design philosophy, and heavyweight craftsmanship behind KYU?.",
  }
};

const syne = Syne({
  weight: ["800"],
  subsets: ["latin"],
  display: "swap",
});

export default function AboutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyuwear.vercel.app';

  const aboutPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About KYU?",
    "url": `${siteUrl}/about`,
    "description": "Story, founders, and philosophy of KYU? Streetwear.",
    "mainEntity": getOrganizationSchema()
  };

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "About", url: `${siteUrl}/about` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pt-24 pb-32 font-sans">
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
          <Link href="/" className="text-lg md:text-2xl font-bold tracking-tighter uppercase">
            KYU?
          </Link>
          <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-medium">
            <Link href="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
            <Link href="/sizing" className="hover:text-gray-400 transition-colors">Sizing</Link>
            <Link href="/faq" className="hover:text-gray-400 transition-colors">FAQ</Link>
            <Link href="/blog" className="hover:text-gray-400 transition-colors">Blog</Link>
            <Link href="/account" className="hover:text-gray-400 transition-colors">Account</Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 mt-12 md:mt-20">
          {/* Header Title */}
          <header className="mb-16 md:mb-20 border-b border-white/10 pb-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block mb-3 font-semibold font-mono">The Manifesto</span>
            <h1 className={`${syne.className} text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none`}>
              WEAR YOUR<br/>CURIOSITY.
            </h1>
          </header>

          {/* Narrative / Story */}
          <div className="space-y-16 text-gray-300 text-sm md:text-base leading-relaxed tracking-wide font-light">
            {/* Welcome section */}
            <div className="space-y-6">
              <h2 className="text-white text-lg md:text-2xl uppercase tracking-wider font-semibold font-sans">Welcome</h2>
              <p className="text-gray-400 border-l-2 border-white/20 pl-6 italic">
                If you&apos;ve found your way to this page, you&apos;re likely more than just a casual browser. You&apos;re someone who values substance, someone who looks at the world and wonders, &ldquo;Why?&rdquo; That question is the heartbeat of KYU?
              </p>
            </div>

            {/* Entity Summary Card (GEO Organization Signals) */}
            <div className="bg-[#111] border border-white/10 p-6 md:p-8 rounded-none">
              <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold mb-6 flex items-center gap-2 font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Brand Identity & Foundation
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono">
                <div>
                  <dt className="text-gray-500 uppercase flex items-center gap-1.5 mb-1">
                    <Users className="w-3.5 h-3.5 text-gray-400" /> Founders
                  </dt>
                  <dd className="text-white font-medium">Jisha Salariya &amp; Tanisha Joshi</dd>
                </div>
                <div>
                  <dt className="text-gray-500 uppercase flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> Founded
                  </dt>
                  <dd className="text-white font-medium">2026</dd>
                </div>
                <div>
                  <dt className="text-gray-500 uppercase flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> Headquarters
                  </dt>
                  <dd className="text-white font-medium">Indore, India</dd>
                </div>
                <div>
                  <dt className="text-gray-500 uppercase mb-1">Category</dt>
                  <dd className="text-white font-medium">Indian Streetwear</dd>
                </div>
              </dl>
            </div>

            {/* Section 1: The Anatomy of a Question */}
            <div className="space-y-6">
              <h2 className="text-white text-lg md:text-2xl uppercase tracking-wider font-semibold font-sans">The Anatomy of a Question</h2>
              <p>
                KYU? was founded in 2026 by Jisha Salariya and Tanisha Joshi in Indore, India. We didn&apos;t set out to build another fast-fashion label that chases fleeting trends or tells anyone how to curate their identity. We set out to build a platform for the curious. The name &ldquo;KYU?&rdquo; (क्यों?) is a manifesto: why blend in when your clothing can spark inquiry?
              </p>
              <p>
                Every design we bring to life is born from a desire to spark curiosity, invite conversation, and bridge the gap between distinct perspectives. Streetwear is one of the most powerful forms of personal expression—it introduces your mindset to the room before you ever speak a word.
              </p>
            </div>

            {/* Section 2: Unapologetically Fluid */}
            <div className="space-y-6">
              <h2 className="text-white text-lg md:text-2xl uppercase tracking-wider font-semibold font-sans">Design Philosophy & Craft</h2>
              <p>
                KYU? engineering centers on substance: 240 GSM heavyweight cotton fabrics, drop-shoulder silhouettes, and high-density graphic narratives. Human beings are complex, layered, and constantly evolving. We believe in the freedom to be everything at once:
              </p>

              {/* Three Columns of Style */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 border-t border-b border-white/5 py-10 bg-zinc-950/30 p-6 rounded-none">
                <div className="flex flex-col gap-3">
                  <Sparkles className="w-5 h-5 text-white" />
                  <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">The Minimalist</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Understated front aesthetics with precision typography and clean negative space.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Flame className="w-5 h-5 text-white" />
                  <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">The Bold</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    High-impact graphic backplates inspired by automotive heritage and raw streetwear attitude.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Eye className="w-5 h-5 text-white" />
                  <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">The Storyteller</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Indian cultural narratives, imperial history, and Hindi typography woven into modern street silhouettes.
                  </p>
                </div>
              </div>

              <p className="pt-4">
                Our commitment is to individuality. No one needs to justify their style or fit into a single box. Each piece is designed to mirror human complexity—versatile, heavyweight, and bold enough to stand on its own.
              </p>
            </div>

            {/* Section 3: Our Promise to You */}
            <div className="space-y-6">
              <h2 className="text-white text-lg md:text-2xl uppercase tracking-wider font-semibold font-sans">Our Promise</h2>
              <p>
                When you wear KYU?, you wear a question mark. It signals that curiosity is alive and that there is courage in looking beneath the surface. Our logo mark reflects this stance—engineered to hold its ground on an essential drop-shoulder tee just as well as on high-impact wearable art.
              </p>
              <div className="flex justify-center py-6">
                <div className="relative bg-zinc-950 p-8 rounded-none shadow-2xl max-w-[240px] aspect-square flex flex-col items-center justify-center group overflow-hidden border border-white/10">
                  <img 
                    src="/images/logo_white.png" 
                    alt="KYU? Streetwear Logo Mark" 
                    className="w-32 h-32 object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="mt-4 text-[9px] font-mono uppercase tracking-[0.2em] text-zinc-500">Official Logo Mark</span>
                </div>
              </div>
              <p>
                We exist to provide the canvas for your journey. Whether leading a conversation or observing the world with a fresh perspective, KYU? invites you to wear your curiosity.
              </p>
            </div>
          </div>

          {/* Call to Action & Navigation */}
          <div className="mt-24 text-center flex flex-col items-center gap-6 border-t border-white/10 pt-16">
            <h2 className="text-xl md:text-2xl uppercase tracking-widest font-medium">Explore Drop One</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/shop" className="group flex items-center gap-3 px-8 py-4 border border-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-xs font-semibold">
                View Collection <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/faq" className="px-8 py-4 border border-white/20 hover:border-white text-gray-400 hover:text-white transition-all uppercase tracking-widest text-xs font-semibold">
                Have Questions? View FAQ
              </Link>
              <Link href="/contact" className="px-8 py-4 border border-white/20 hover:border-white text-gray-400 hover:text-white transition-all uppercase tracking-widest text-xs font-semibold">
                Contact Founders &amp; Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
