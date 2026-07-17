"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Copy, Check, Ticket, ArrowLeft, RefreshCw, Calendar } from "lucide-react";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchUserCoupons = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await fetch(`/api/coupons/user?userId=${session.user.id}`);
      const data = await response.json();
      if (data && data.coupons) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error("Error loading user coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCoupons();
  }, []);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-widest text-xs">
        Loading Your Coupons...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/85 backdrop-blur-md border-b border-white/10">
        <Link href="/account" className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-gray-400 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Account
        </Link>
        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase absolute left-1/2 -translate-x-1/2">
          KYU?
        </Link>
        <div className="flex items-center gap-6 text-sm uppercase tracking-widest font-medium">
          <Link href="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-8">
        <div className="flex justify-between items-end border-b border-white/10 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">My Coupons</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              Available offers and reward discounts for your next purchase.
            </p>
          </div>
          <button 
            onClick={fetchUserCoupons}
            className="flex items-center gap-2 text-xs uppercase tracking-widest border border-white/20 px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {coupons.length === 0 ? (
          <div className="text-center py-20 bg-[#0a0a0a] border border-white/10 rounded-xl space-y-4">
            <Ticket className="w-12 h-12 text-gray-600 mx-auto" />
            <h3 className="text-lg font-bold uppercase tracking-widest">No Coupons Available</h3>
            <p className="text-gray-500 text-xs max-w-sm mx-auto leading-relaxed">
              We couldn't find any promotional coupons or referral rewards. You can earn a 20% OFF coupon by inviting friends in the <Link href="/refer-and-earn" className="text-cyan-400 hover:underline">Refer & Earn</Link> dashboard!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.map((coupon) => {
              const isUsed = coupon.status === "used";
              const isExpired = coupon.status === "expired";
              const isClosed = isUsed || isExpired;

              return (
                <div 
                  key={coupon.id} 
                  className={`p-6 bg-[#0a0a0a] border rounded-xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                    isClosed 
                      ? "border-white/5 opacity-50" 
                      : coupon.type === "reward" 
                        ? "border-cyan-500/30 hover:border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.05)]" 
                        : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Decorative side cuts for coupon feel */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-[#050505] rounded-full border-r border-white/10" />
                  <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-[#050505] rounded-full border-l border-white/10" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className={`text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded ${
                          coupon.type === "reward" 
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                            : "bg-white/5 text-gray-400 border border-white/10"
                        }`}>
                          {coupon.type === "reward" ? "Referral Reward" : "Promotion"}
                        </span>
                        <h3 className="text-lg font-bold font-mono tracking-widest text-white mt-2 uppercase">{coupon.code}</h3>
                      </div>
                      
                      <span className={`px-2.5 py-0.5 rounded text-[9px] uppercase tracking-widest border font-semibold ${
                        isUsed
                          ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/5"
                          : isExpired
                            ? "border-red-500/30 text-red-500 bg-red-500/5"
                            : "border-green-500/30 text-green-500 bg-green-500/5"
                      }`}>
                        {coupon.status}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-gray-300">
                      {coupon.discountType === "percentage" 
                        ? `${coupon.discountValue}% OFF` 
                        : `₹${coupon.discountValue} OFF`
                      }
                      {coupon.minOrderValue > 0 && (
                        <span className="text-xs text-gray-500 font-normal block mt-0.5">
                          Min. order: ₹{coupon.minOrderValue}
                        </span>
                      )}
                    </p>

                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {coupon.description}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Exp: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                    </div>

                    <button
                      onClick={() => handleCopy(coupon.code, coupon.id)}
                      disabled={isClosed}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold font-sans transition-all select-none ${
                        isClosed
                          ? "bg-transparent border border-white/5 text-gray-600 cursor-not-allowed"
                          : copiedId === coupon.id
                            ? "bg-green-500 text-black"
                            : "bg-white text-black hover:bg-gray-200"
                      }`}
                    >
                      {copiedId === coupon.id ? (
                        <>
                          <Check className="w-3 h-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
