import React from "react";
import Link from "next/link";
import { Syne } from "next/font/google";
import { MoveRight, Sparkles, Flame, Eye } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | KYU? Streetwear",
  description: "KYU? isn't just a name — it's a question. Discover the story behind India's newest streetwear brand, built on curiosity, bold identity, and premium craft.",
  openGraph: {
    title: "Why We Created KYU?",
    description: "The story behind the question mark. Learn what KYU? stands for and why every piece we make asks something of you.",
  },
  twitter: {
    title: "Why We Created KYU?",
    description: "The story behind the question mark. Learn what KYU? stands for and why every piece we make asks something of you.",
  }
};

const syne = Syne({
  weight: ["800"],
  subsets: ["latin"],
  display: "swap",
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pt-24 pb-32 font-sans">
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-lg md:text-2xl font-bold tracking-tighter uppercase">
          KYU?
        </Link>
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-medium">
          <Link href="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
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

          {/* Section 1: The Anatomy of a Question */}
          <div className="space-y-6">
            <h2 className="text-white text-lg md:text-2xl uppercase tracking-wider font-semibold font-sans">The Anatomy of a Question</h2>
            <p>
              We didn&apos;t set out to build another clothing brand that chases fleeting trends or tells anyone how to curate their identity. We set out to build a platform for the curious. The name &ldquo;KYU?&rdquo; is more than a clever play on phonetics—it is a manifesto. It represents the relentless pursuit of understanding.
            </p>
            <p>
              Every design we bring to life is born from a desire to spark curiosity, invite conversation, and bridge the gap between different perspectives. Fashion is one of the most powerful forms of communication; it is how people introduce themselves to the world before they ever speak a word.
            </p>
          </div>

          {/* Section 2: Unapologetically Fluid */}
          <div className="space-y-6">
            <h2 className="text-white text-lg md:text-2xl uppercase tracking-wider font-semibold font-sans">Unapologetically Fluid</h2>
            <p>
              One of the most restrictive forces in modern style is the pressure to &ldquo;niche down.&rdquo; Society often insists on picking a style, defining an aesthetic, and staying within the lines. At KYU?, we refuse to live in that box. Human beings are complex, layered, and constantly evolving. Why should a wardrobe be any different? We believe in the freedom to be everything at once:
            </p>

            {/* Three Columns of Style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 border-t border-b border-white/5 py-10 bg-zinc-950/30 p-6 rounded-lg">
              <div className="flex flex-col gap-3">
                <Sparkles className="w-5 h-5 text-white" />
                <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">The Minimalist</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Seeking perfection in the essential, the premium, and the understated.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Flame className="w-5 h-5 text-white" />
                <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">The Bold</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Embracing heavy graphics and streetwear that demand attention.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Eye className="w-5 h-5 text-white" />
                <h3 className="text-white text-xs uppercase tracking-[0.2em] font-semibold">The Storyteller</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Honoring heritage through pieces that celebrate cultural and traditional roots.
                </p>
              </div>
            </div>

            <p className="pt-4">
              Our commitment is to individuality. No one needs to justify their style or fit into a single &ldquo;vibe.&rdquo; Each piece is designed to mirror human complexity—versatile, timeless, and bold enough to stand on its own, regardless of aesthetic.
            </p>
          </div>

          {/* Section 3: Our Promise to You */}
          <div className="space-y-6">
            <h2 className="text-white text-lg md:text-2xl uppercase tracking-wider font-semibold font-sans">Our Promise to You</h2>
            <p>
              When someone wears KYU?, they aren&apos;t just wearing a logo. They are wearing a badge of inquiry. It signals to the world that curiosity is alive and that there is courage in looking beneath the surface. Our logo was crafted to reflect this philosophy—a symbol that holds its own on a plain, premium essential just as well as it does on a piece of high-impact wearable art.
            </p>
            <p>
              We exist to provide the canvas for each journey. Whether leading a conversation or observing the world with a fresh perspective, KYU? invites everyone to wear their curiosity on their sleeve.
            </p>
            <p className="font-medium text-white tracking-widest uppercase text-xs">
              Thank you for being part of the movement.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-24 text-center flex flex-col items-center gap-6">
          <h2 className="text-xl md:text-2xl uppercase tracking-widest font-medium">Explore Drop One</h2>
          <Link href="/shop" className="group flex items-center gap-3 px-8 py-4 border border-white hover:bg-white hover:text-black transition-all uppercase tracking-widest text-xs font-semibold">
            View Collection <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
