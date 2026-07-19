import React from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Calendar, ArrowRight, FileText } from "lucide-react";
import { Syne } from "next/font/google";

const syne = Syne({
  weight: ["800"],
  subsets: ["latin"],
  display: "swap",
});

// Revalidate the page cache every 60 seconds (ISR)
export const revalidate = 60;

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal | KYU? Streetwear",
  description: "Style guides, drop stories, and the thinking behind KYU?. Read the Journal for everything streetwear, fabric, fit, and the culture we're building.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "KYU? Journal",
    description: "Stories, style guides, and behind-the-scenes from KYU? Streetwear.",
  },
  twitter: {
    title: "KYU? Journal",
    description: "Stories, style guides, and behind-the-scenes from KYU? Streetwear.",
  }
};

export default async function BlogListingPage() {
  // Fetch published blog posts from Supabase database
  const { data: posts } = await supabase
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .order("publish_date", { ascending: false });

  const publishedPosts = posts || [];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32 font-sans selection:bg-white selection:text-black">
      {/* Navigation (simplified for inner pages) */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-lg md:text-2xl font-bold tracking-tighter uppercase">
          KYU?
        </Link>
        <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-medium">
          <Link href="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
          <Link href="/about" className="hover:text-gray-400 transition-colors">About</Link>
          <Link href="/account" className="hover:text-gray-400 transition-colors">Account</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-12">
        <header className="mb-12 md:mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block mb-3 font-semibold font-mono">Editorials</span>
          <h1 className={`${syne.className} text-4xl md:text-7xl font-bold tracking-tighter uppercase mb-4`}>
            Stories &<br/>Drops.
          </h1>
          <p className="text-gray-400 max-w-lg text-sm md:text-base">
            Behind the scenes of Drop One. Design processes, material engineering, and counterculture inspiration.
          </p>
        </header>

        {publishedPosts.length === 0 ? (
          <div className="text-center py-24 text-gray-500 border-t border-white/10">
            <FileText className="w-12 h-12 mx-auto mb-4 text-zinc-800" />
            <div className="font-mono uppercase text-xs tracking-widest">
              No stories published yet.
            </div>
            <p className="text-zinc-600 text-xs mt-2">Check back soon for upcoming editorials.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 border-t border-white/10 pt-12">
            {publishedPosts.map((post) => (
              <article key={post.id} className="group flex flex-col justify-between">
                <Link href={`/blog/${post.slug}`} className="cursor-pointer block">
                  {/* Image wrapper */}
                  <div className="relative aspect-[16/10] bg-[#111] overflow-hidden mb-6 border border-white/5">
                    {post.cover_image ? (
                      <img 
                        src={post.cover_image} 
                        alt={post.title}
                        className="w-full h-full object-cover opacity-100 md:opacity-80 grayscale-0 md:grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-750 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs font-mono">
                        No Cover Image
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(post.publish_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Title & Excerpt */}
                  <h3 className="text-lg md:text-xl font-medium tracking-wide uppercase group-hover:text-gray-300 transition-colors mb-3 leading-tight">
                    {post.title}
                  </h3>
                  
                  {/* Read Article link */}
                  <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest font-semibold text-white/60 group-hover:text-white transition-colors mt-3">
                    Read Article <span className="sr-only">: {post.title}</span> <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
