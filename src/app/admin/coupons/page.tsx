"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2, X, Search, ToggleLeft, ToggleRight, Ticket } from "lucide-react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_value: "0",
    max_discount: "",
    start_date: "",
    expiry_date: "",
    max_uses: "100",
    max_uses_per_customer: "1",
    is_active: true,
    description: ""
  });

  const fetchCoupons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching coupons:", error.message);
    } else if (data) {
      setCoupons(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Helper to format ISO datetime-local input
  const toLocalDatetime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const discountVal = Number(formData.discount_value);
    if (isNaN(discountVal) || discountVal <= 0) {
      alert("Discount value must be greater than 0.");
      setSaving(false);
      return;
    }
    if (formData.discount_type === "percentage" && discountVal > 100) {
      alert("Percentage discount value cannot be greater than 100%.");
      setSaving(false);
      return;
    }

    const startDate = new Date(formData.start_date);
    const expiryDate = new Date(formData.expiry_date);
    if (expiryDate <= startDate) {
      alert("Expiry Date must be after the Start Date.");
      setSaving(false);
      return;
    }

    const couponData = {
      code: formData.code.trim().toUpperCase(),
      name: formData.name.trim() || null,
      discount_type: formData.discount_type,
      discount_value: discountVal,
      min_order_value: Number(formData.min_order_value) || 0,
      max_discount: formData.max_discount ? Number(formData.max_discount) : null,
      start_date: startDate.toISOString(),
      expiry_date: expiryDate.toISOString(),
      max_uses: Number(formData.max_uses) || 100,
      max_uses_per_customer: formData.max_uses_per_customer ? Number(formData.max_uses_per_customer) : null,
      is_active: formData.is_active,
      description: formData.description.trim() || null
    };

    let error;
    if (editingId) {
      const res = await supabase.from("coupons").update(couponData).eq("id", editingId);
      error = res.error;
    } else {
      // Check duplicate code first
      const { data: duplicate } = await supabase
        .from("coupons")
        .select("id")
        .eq("code", couponData.code)
        .maybeSingle();

      if (duplicate) {
        alert(`A coupon with code "${couponData.code}" already exists.`);
        setSaving(false);
        return;
      }

      const res = await supabase.from("coupons").insert([couponData]);
      error = res.error;
    }

    if (!error) {
      setIsModalOpen(false);
      setEditingId(null);
      resetForm();
      fetchCoupons(); // Refresh
    } else {
      alert("Error saving coupon: " + error.message);
    }
    setSaving(false);
  };

  const handleEditClick = (coupon: any) => {
    setEditingId(coupon.id);
    setFormData({
      code: coupon.code,
      name: coupon.name || "",
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      min_order_value: coupon.min_order_value.toString(),
      max_discount: coupon.max_discount ? coupon.max_discount.toString() : "",
      start_date: toLocalDatetime(coupon.start_date),
      expiry_date: toLocalDatetime(coupon.expiry_date),
      max_uses: coupon.max_uses.toString(),
      max_uses_per_customer: coupon.max_uses_per_customer ? coupon.max_uses_per_customer.toString() : "",
      is_active: coupon.is_active,
      description: coupon.description || ""
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    const now = new Date();
    const inOneWeek = new Date();
    inOneWeek.setDate(now.getDate() + 7);

    setFormData({
      code: "",
      name: "",
      discount_type: "percentage",
      discount_value: "",
      min_order_value: "0",
      max_discount: "",
      start_date: toLocalDatetime(now.toISOString()),
      expiry_date: toLocalDatetime(inOneWeek.toISOString()),
      max_uses: "100",
      max_uses_per_customer: "1",
      is_active: true,
      description: ""
    });
  };

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon? This will prevent it from being used in future orders.")) {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) {
        alert("Error deleting coupon: " + error.message);
      } else {
        fetchCoupons();
      }
    }
  };

  const handleToggleActive = async (coupon: any) => {
    const { error } = await supabase
      .from("coupons")
      .update({ is_active: !coupon.is_active })
      .eq("id", coupon.id);
    
    if (error) {
      alert("Error updating coupon status: " + error.message);
    } else {
      fetchCoupons();
    }
  };

  // Filter coupons locally for quick feedback
  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (coupon.name && coupon.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (coupon.description && coupon.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Statistics calculation
  const totalCouponsCount = coupons.length;
  const activeCouponsCount = coupons.filter(c => c.is_active).length;
  const totalTimesUsed = coupons.reduce((sum, c) => sum + (c.times_used || 0), 0);

  const stats = [
    { name: "Total Coupons", value: totalCouponsCount },
    { name: "Active Coupons", value: activeCouponsCount },
    { name: "Total Usage Count", value: totalTimesUsed },
  ];

  if (loading && coupons.length === 0) {
    return <div className="text-gray-500 font-mono text-sm uppercase">Loading Database...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-[#111] border border-white/10 rounded-xl">
            <p className="text-sm text-gray-400 font-medium">{stat.name}</p>
            <p className="text-3xl font-semibold text-white mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold uppercase tracking-widest">Promotion & Coupons</h2>
        <div className="flex w-full sm:w-auto gap-3">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="SEARCH COUPONS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/20 rounded pl-9 pr-3 py-2 text-white text-xs uppercase tracking-widest focus:border-white focus:outline-none placeholder-gray-500"
            />
          </div>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Coupon
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-white/5 uppercase tracking-widest text-xs text-gray-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Code / Name</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Min. Spend</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Validity Period</th>
                <th className="px-6 py-4">Uses (Used / Rem.)</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    {searchQuery ? "No coupons match your search query." : "No coupons found. Click 'Add Coupon' to create one."}
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => {
                  const isExpired = new Date() > new Date(coupon.expiry_date);
                  const maxUsesText = coupon.max_uses;
                  const remainingUses = Math.max(0, coupon.max_uses - (coupon.times_used || 0));

                  return (
                    <tr key={coupon.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium">
                        <div className="text-white text-sm flex items-center gap-1.5">
                          <Ticket className="w-3.5 h-3.5 text-gray-500" />
                          {coupon.code}
                        </div>
                        {coupon.name && <div className="text-xs text-gray-500 font-sans mt-0.5">{coupon.name}</div>}
                      </td>
                      <td className="px-6 py-4">
                        {coupon.discount_type === "percentage" ? (
                          <div className="font-semibold text-white">
                            {coupon.discount_value}%
                            {coupon.max_discount && <span className="text-xs text-gray-500 font-sans font-normal ml-1">(Max ₹{coupon.max_discount})</span>}
                          </div>
                        ) : (
                          <div className="font-semibold text-white">₹{coupon.discount_value}</div>
                        )}
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest">{coupon.discount_type}</div>
                      </td>
                      <td className="px-6 py-4 font-mono">₹{coupon.min_order_value}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-widest border ${
                          isExpired 
                            ? 'border-red-500/20 text-red-500 bg-red-500/5' 
                            : coupon.is_active 
                              ? 'border-green-500/20 text-green-500 bg-green-500/5' 
                              : 'border-gray-500/20 text-gray-500 bg-gray-500/5'
                        }`}>
                          {isExpired ? 'expired' : coupon.is_active ? 'active' : 'inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                        <div>S: {new Date(coupon.start_date).toLocaleDateString()}</div>
                        <div className="mt-0.5">E: {new Date(coupon.expiry_date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        <span className="text-white">{coupon.times_used}</span> / <span className="text-gray-400">{maxUsesText}</span>
                        <div className="text-[10px] text-gray-500 mt-0.5">Rem: {remainingUses}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                        {new Date(coupon.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3 items-center">
                          <button 
                            onClick={() => handleToggleActive(coupon)} 
                            title={coupon.is_active ? "Deactivate" : "Activate"}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {coupon.is_active ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-gray-600" />}
                          </button>
                          <button onClick={() => handleEditClick(coupon)} className="text-gray-400 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteCoupon(coupon.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/10 rounded-xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto pr-6">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-6">
              {editingId ? "Edit Coupon" : "Create Promotional Coupon"}
            </h3>
            
            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Coupon Code (e.g. SUMMER50)</label>
                  <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none uppercase font-mono tracking-widest" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Coupon Name (Optional)</label>
                  <input type="text" placeholder="e.g. 20% off Summer clothes" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Discount Type</label>
                  <select value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Discount Value</label>
                  <input required type="number" step="any" placeholder={formData.discount_type === "percentage" ? "e.g. 20" : "e.g. 500"} value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Min Order Value (₹)</label>
                  <input required type="number" value={formData.min_order_value} onChange={e => setFormData({...formData, min_order_value: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Max Discount (₹) (For % type)</label>
                  <input type="number" placeholder="Leave empty for no cap" disabled={formData.discount_type !== "percentage"} value={formData.max_discount} onChange={e => setFormData({...formData, max_discount: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none disabled:opacity-30 font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Start Date & Time</label>
                  <input required type="datetime-local" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Expiry Date & Time</label>
                  <input required type="datetime-local" value={formData.expiry_date} onChange={e => setFormData({...formData, expiry_date: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Maximum Total Uses</label>
                  <input required type="number" value={formData.max_uses} onChange={e => setFormData({...formData, max_uses: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Max Uses Per Customer</label>
                  <input type="number" placeholder="Leave empty for unlimited" value={formData.max_uses_per_customer} onChange={e => setFormData({...formData, max_uses_per_customer: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Description / Notes</label>
                <textarea rows={3} placeholder="Promotional notes or rules..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-white/20 rounded px-3 py-2 text-white focus:border-cyan-400 focus:outline-none" />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={e => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 text-black focus:ring-black border-white/20 bg-black rounded"
                />
                <label htmlFor="is_active" className="text-xs uppercase tracking-widest text-gray-400 cursor-pointer">
                  Enable coupon immediately (Active status)
                </label>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full bg-white text-black font-bold uppercase tracking-widest text-xs py-3 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingId ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
