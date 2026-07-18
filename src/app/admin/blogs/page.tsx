"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2, Calendar, FileText } from "lucide-react";
import Link from "next/link";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("publish_date", { ascending: false });

    if (error) {
      console.error("Error fetching blogs:", error.message);
    } else if (data) {
      setBlogs(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post? This cannot be undone.")) {
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) {
        alert("Error deleting blog: " + error.message);
      } else {
        fetchBlogs();
      }
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-white">Blog Posts</h2>
          <p className="text-gray-500 text-sm">Manage articles and editorials for the label.</p>
        </div>
        <Link 
          href="/admin/blogs/new" 
          className="flex items-center gap-2 bg-white text-black px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Post
        </Link>
      </div>

      <div className="bg-[#0e0e0e] border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 text-sm font-mono uppercase tracking-widest animate-pulse">
            Loading Blog Posts...
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-zinc-700" />
            <p className="text-sm font-mono uppercase tracking-widest mb-1">No articles found</p>
            <p className="text-xs text-zinc-600">Create your first blog post to begin sharing stories.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest font-semibold bg-zinc-950/40">
                  <th className="p-4 pl-6">Cover</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Publish Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {blogs.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="w-16 h-10 bg-zinc-900 border border-white/10 overflow-hidden relative">
                        {post.cover_image ? (
                          <img 
                            src={post.cover_image} 
                            alt={post.title} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[10px]">
                            No Image
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-white max-w-xs truncate">{post.title}</td>
                    <td className="p-4 text-gray-400 font-mono text-xs">{post.slug}</td>
                    <td className="p-4 text-gray-400">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {new Date(post.publish_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono tracking-wider ${
                        post.status === "published" 
                          ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/admin/blogs/edit/${post.id}`} 
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="Edit Post"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete Post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
