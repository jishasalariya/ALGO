"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

const BlogEditor = dynamic(() => import("@/components/BlogEditor"), {
  ssr: false,
  loading: () => <div className="h-[350px] bg-zinc-950 border border-white/10 rounded-lg flex items-center justify-center text-zinc-500 font-mono text-xs uppercase animate-pulse">Loading Editor...</div>
});

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  
  const [loadingPost, setLoadingPost] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    cover_image: "",
    status: "draft",
    publish_date: "",
  });
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      setLoadingPost(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("Error loading post: " + error.message);
        router.push("/admin/blogs");
      } else if (data) {
        setFormData({
          title: data.title,
          slug: data.slug,
          cover_image: data.cover_image || "",
          status: data.status,
          publish_date: new Date(data.publish_date).toISOString().substring(0, 16),
        });
        setContent(data.body_content);
      }
      setLoadingPost(false);
    };

    if (id) fetchPost();
  }, [id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !content.trim()) {
      alert("Please fill in the title, slug, and body content.");
      return;
    }

    if (formData.status === "published" && !formData.cover_image) {
      const confirmNoCover = window.confirm("Notice: Publishing without a cover image will use the default brand logo in SEO/OpenGraph previews. Proceed?");
      if (!confirmNoCover) return;
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

    const { error } = await supabase
      .from("blogs")
      .update(postData)
      .eq("id", id);

    if (error) {
      alert("Error saving blog post: " + error.message);
    } else {
      router.push("/admin/blogs");
      router.refresh();
    }
    setSaving(false);
  };

  if (loadingPost) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-white" /> Loading Post Content...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs" className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-white">Edit Blog Post</h2>
            <p className="text-gray-500 text-xs">Update your dynamic article or counterculture editorial.</p>
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
              <p className="text-[10px] text-zinc-500 font-mono">Public URL: https://kyuwear.vercel.app/blog/{formData.slug || "..."}</p>
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
