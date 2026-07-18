"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Load BlogEditor dynamically to avoid SSR mismatch on canvas/document reference
const BlogEditor = dynamic(() => import("@/components/BlogEditor"), {
  ssr: false,
  loading: () => <div className="h-[350px] bg-zinc-950 border border-white/10 rounded-lg flex items-center justify-center text-zinc-500 font-mono text-xs uppercase animate-pulse">Loading Editor...</div>
});

export default function NewBlogPost() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    cover_image: "",
    status: "draft",
    publish_date: new Date().toISOString().substring(0, 16), // YYYY-MM-DDTHH:MM
  });
  const [content, setContent] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // remove special characters
      .replace(/\s+/g, "-") // replace spaces with hyphens
      .replace(/-+/g, "-"); // remove double hyphens
      
    setFormData(prev => ({
      ...prev,
      title,
      slug
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !content) {
      alert("Please fill in the title, slug, and body content.");
      return;
    }

    setSaving(true);
    const postData = {
      title: formData.title,
      slug: formData.slug,
      cover_image: formData.cover_image || null,
      body_content: content,
      status: formData.status,
      publish_date: new Date(formData.publish_date).toISOString(),
    };

    const { error } = await supabase.from("blogs").insert([postData]);

    if (error) {
      alert("Error saving blog post: " + error.message);
    } else {
      router.push("/admin/blogs");
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs" className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-white">New Blog Post</h2>
            <p className="text-gray-500 text-xs">Create a new article or editorial for the label.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Post Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Enter a descriptive title..."
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold font-mono">Slug (URL endpoint)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/ /g, "-") }))}
                placeholder="post-url-slug"
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors font-mono"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Body Content (Rich Text)</label>
              <BlogEditor 
                content={content}
                onChange={setContent}
              />
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6 bg-zinc-950 p-6 border border-white/10 rounded-lg h-fit">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Cover Image URL</label>
              <input
                type="text"
                value={formData.cover_image}
                onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                placeholder="https://cloudinary.com/..."
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors"
              />
              {formData.cover_image && (
                <div className="mt-3 aspect-video bg-zinc-900 border border-white/5 rounded-lg overflow-hidden relative">
                  <img 
                    src={formData.cover_image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Publication Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors uppercase tracking-widest font-mono"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Publish Date</label>
              <input
                type="datetime-local"
                value={formData.publish_date}
                onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
                className="w-full bg-[#0e0e0e] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Post
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
