import React from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { Syne } from "next/font/google";

const syne = Syne({
  weight: ["800"],
  subsets: ["latin"],
  display: "swap",
});

// Revalidate blog cache every 60 seconds (ISR)
export const revalidate = 60;

export async function generateStaticParams() {
  // Query strictly published posts to build paths at build time
  const { data: posts } = await supabase
    .from("blogs")
    .select("slug")
    .eq("status", "published");

  return posts?.map((post) => ({
    slug: post.slug,
  })) || [];
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch the blog by slug, ensuring it is published
  const { data: post } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32 font-sans selection:bg-white selection:text-black">
      {/* Navigation (simplified for inner pages) */}
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

      <div className="max-w-3xl mx-auto px-6 mt-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Editorials
        </Link>

        <article className="space-y-8">
          {/* Post Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {new Date(post.publish_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <h1 className={`${syne.className} text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter uppercase leading-tight text-white`}>
              {post.title}
            </h1>
          </header>

          {/* Cover Image */}
          {post.cover_image && (
            <div className="relative aspect-[16/9] w-full bg-[#111] overflow-hidden border border-white/5 my-8">
              <img 
                src={post.cover_image} 
                alt={post.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}

          {/* Article Body Content */}
          <div 
            className="prose prose-invert max-w-none text-gray-300 text-sm md:text-base leading-relaxed tracking-wide font-light space-y-6"
            dangerouslySetInnerHTML={{ __html: post.body_content }}
          />
        </article>
      </div>

      {/* Styled class styling for custom HTML nodes inside article */}
      <style>{`
        .prose h1, .prose h2, .prose h3 {
          color: #ffffff;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: -0.025em;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose h1 { font-size: 1.5rem; }
        .prose h2 { font-size: 1.25rem; }
        .prose h3 { font-size: 1.125rem; }
        .prose p {
          margin-bottom: 1.5rem;
          color: #d1d5db;
        }
        .prose ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .prose ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
        .prose blockquote {
          border-left: 4px solid rgba(255, 255, 255, 0.2);
          padding-left: 1rem;
          font-style: italic;
          color: #9ca3af;
          margin: 1.5rem 0;
        }
        .prose pre {
          background-color: #0c0c0c;
          padding: 1rem;
          border-radius: 0.375rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .prose code {
          background-color: #0c0c0c;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: monospace;
          color: #f87171;
        }
        .prose iframe {
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin: 1.5rem 0;
        }
        .prose img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  );
}
