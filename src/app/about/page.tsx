import React from "react";
import Link from "next/link";
import { Syne } from "next/font/google";
import { MoveRight, Shield, RefreshCw, Sparkles } from "lucide-react";

const syne = Syne({
  weight: ["800"],
  subsets: ["latin"],
  display: "swap",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pt-24 pb-32 font-sans">
      {/* Navigation (Standard across inner pages) */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-xl md:text-2xl font-bold tracking-tighter uppercase">
          KYU?
        </Link>
        <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm uppercase tracking-widest font-medium">
          <Link href="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
          <Link href="/account" className="hover:text-gray-400 transition-colors">Account</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 mt-12 md:mt-20">
        {/* Header Title */}
        <header className="mb-16 md:mb-24 border-b border-white/10 pb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block mb-3 font-semibold">About The Label</span>
          <h1 className={`${syne.className} text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none`}>
            KYU?<br/>EST. 2026.
          </h1>
        </header>

        {/* Narrative / Story */}
        <div className="space-y-12 text-gray-400 text-sm md:text-base leading-relaxed tracking-wide font-light">
          <p>
            KYU? is a design collective and streetwear label engineered for impact. Operating at the intersection of architectural minimalism and modern counterculture, we make garments that serve as expressions of identity.
          </p>
          <p>
            Our name is derived from the word &ldquo;Queue&rdquo;—representing anticipation, sequence, and the constant evolution of culture. Every piece is constructed in limited drops, ensuring exclusivity and reducing waste. We reject fast fashion in favor of durable, heavy-weight silhouettes built to last.
          </p>
        </div>

        {/* Brand Columns / Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-20 md:mt-28 border-t border-b border-white/10 py-16">
          <div className="flex flex-col gap-4">
            <Sparkles className="w-6 h-6 text-white" />
            <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">Engineered Fit</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Oversized cuts drafted from scratch to achieve the perfect drape and street silhouette.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Shield className="w-6 h-6 text-white" />
            <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">Premium Craft</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Constructed using 240+ GSM heavyweight loopback Terry cotton and high-density branding.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <RefreshCw className="w-6 h-6 text-white" />
            <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">Sustainable Drops</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Released in hyper-limited series to eliminate deadstock and preserve true exclusivity.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 md:mt-28 text-center flex flex-col items-center gap-6">
          <h2 className="text-xl md:text-2xl uppercase tracking-widest font-medium">Explore Drop One</h2>
          <Link href="/shop" className="group flex items-center gap-3 px-8 py-4 border border-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-xs font-semibold">
            View Collection <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
