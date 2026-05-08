"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2, X } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    product_name: "",
    slug: "",
    price: "",
    category: "T-Shirts",
    stock_quantity: "10",
    image_url: "",
    description: "",
    sizes: "S, M, L, XL",
    status: "published"
  });

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase.from("products").insert([
      {
        product_name: formData.product_name,
        slug: formData.slug || formData.product_name.toLowerCase().replace(/ /g, "-"),
        price: Number(formData.price),
        category: formData.category,
        stock_quantity: Number(formData.stock_quantity),
        description: formData.description,
        sizes: formData.sizes.split(",").map(s => s.trim()).filter(Boolean),
        images: formData.image_url ? formData.image_url.split(",").map(url => url.trim()).filter(Boolean) : [],
        status: formData.status
      }
    ]);

    if (!error) {
      setIsModalOpen(false);
      setFormData({ product_name: "", slug: "", price: "", category: "T-Shirts", stock_quantity: "10", image_url: "", description: "", sizes: "S, M, L, XL", status: "published" });
      fetchProducts(); // Refresh list
    } else {
      alert("Error saving product: " + error.message);
    }
    setSaving(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product? This cannot be undone.")) {
      await supabase.from("products").delete().eq("id", id);
      fetchProducts();
    }
  };

  if (loading && products.length === 0) return <div className="text-gray-500 font-mono text-sm uppercase">Loading Database...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-widest">Inventory Management</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 uppercase tracking-widest text-xs text-gray-400 border-b border-white/10">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {products.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No products found.</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{product.product_name}</td>
                  <td className="px-6 py-4 text-gray-400 uppercase text-xs">{product.category}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${product.stock_quantity > 10 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs uppercase tracking-widest border ${product.status === 'published' ? 'border-green-500/30 text-green-500' : 'border-gray-500/30 text-gray-500'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-3">
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-xl p-8 max-w-md w-full relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6">Add New Product</h3>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Product Name</label>
                <input required type="text" value={formData.product_name} onChange={e => setFormData({...formData, product_name: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Price (₹)</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Stock</label>
                  <input required type="number" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Description</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Sizes</label>
                  <input type="text" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none" />
                  <p className="text-xs text-gray-500 mt-1">Comma separated (e.g. S, M, L)</p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none">
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Image URLs</label>
                <textarea required rows={3} placeholder="https://image1.jpg, https://image2.jpg" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none" />
                <p className="text-xs text-gray-500 mt-1">To add multiple photos, paste the links separated by a comma.</p>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs py-3 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Publish Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
