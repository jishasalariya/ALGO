"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Share2, Copy, Check, MessageSquare, ArrowLeft, Users, CheckCircle, Clock, Award } from "lucide-react";

// Custom brand SVGs because lucide-react doesn't export them in this version
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

export default function ReferAndEarnPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);
  const [referralData, setReferralData] = useState({
    referralCode: "",
    referralLink: "",
    stats: {
      totalReferrals: 0,
      successfulReferrals: 0,
      pendingReferrals: 0,
      rewardsEarned: 0
    },
    history: [] as Array<{
      id: string;
      friendName: string;
      date: string;
      status: "pending" | "successful" | "rewarded" | "rejected";
    }>
  });

  useEffect(() => {
    const fetchReferralInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      
      const uId = session.user.id;
      setUserId(uId);

      try {
        const response = await fetch(`/api/referral?userId=${uId}`);
        const data = await response.json();
        if (data && !data.error) {
          setReferralData(data);
        }
      } catch (err) {
        console.error("Error loading referral data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralInfo();
  }, []);

  const handleCopyCode = () => {
    if (!referralData.referralCode) return;
    navigator.clipboard.writeText(referralData.referralCode);
    setCopyCodeSuccess(true);
    setTimeout(() => setCopyCodeSuccess(false), 2000);
  };

  const handleCopyLink = () => {
    if (!referralData.referralLink) return;
    navigator.clipboard.writeText(referralData.referralLink);
    setCopyLinkSuccess(true);
    setTimeout(() => setCopyLinkSuccess(false), 2000);
  };

  const getShareText = () => {
    return encodeURIComponent(
      `Join KYU? and get premium streetwear. Use my referral code: ${referralData.referralCode} or sign up using this link: ${referralData.referralLink}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono uppercase tracking-widest text-xs">
        Loading Referral Dashboard...
      </div>
    );
  }

  const statCards = [
    { name: "Total Invites", value: referralData.stats.totalReferrals, icon: Users, color: "text-gray-400" },
    { name: "Successful", value: referralData.stats.successfulReferrals, icon: CheckCircle, color: "text-green-400" },
    { name: "Pending", value: referralData.stats.pendingReferrals, icon: Clock, color: "text-yellow-400" },
    { name: "Rewards Earned", value: `${referralData.stats.rewardsEarned} Coupons`, icon: Award, color: "text-cyan-400" },
  ];

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

      <div className="max-w-5xl mx-auto px-6 mt-12 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Refer & Earn</h1>
          <p className="text-gray-400 uppercase tracking-widest text-xs max-w-xl mx-auto leading-relaxed">
            Invite your friends to the movement. When they place their first order, they join the club and you get a 20% OFF coupon code.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="p-6 bg-[#0a0a0a] border border-white/10 rounded-xl flex flex-col justify-between hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">{stat.name}</span>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <span className="text-2xl md:text-3xl font-bold mt-4 font-mono">{stat.value}</span>
              </div>
            );
          })}
        </div>

        {/* Code & Link Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Share Box */}
          <div className="p-8 bg-[#0a0a0a] border border-white/10 rounded-xl space-y-6">
            <h3 className="text-sm uppercase tracking-widest font-bold">Your Unique Codes</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-2">Referral Code</label>
                <div className="flex bg-black border border-white/20 rounded-lg overflow-hidden">
                  <span className="flex-1 px-4 py-3 font-mono tracking-widest font-bold text-center text-sm md:text-base">
                    {referralData.referralCode}
                  </span>
                  <button 
                    onClick={handleCopyCode} 
                    className="px-4 bg-white/5 border-l border-white/20 hover:bg-white hover:text-black transition-colors"
                    title="Copy Code"
                  >
                    {copyCodeSuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-2">Referral Link</label>
                <div className="flex bg-black border border-white/20 rounded-lg overflow-hidden">
                  <span className="flex-1 px-4 py-3 font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap text-gray-400">
                    {referralData.referralLink}
                  </span>
                  <button 
                    onClick={handleCopyLink} 
                    className="px-4 bg-white/5 border-l border-white/20 hover:bg-white hover:text-black transition-colors"
                    title="Copy Link"
                  >
                    {copyLinkSuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social Share Box */}
          <div className="p-8 bg-[#0a0a0a] border border-white/10 rounded-xl flex flex-col justify-between">
            <div>
              <h3 className="text-sm uppercase tracking-widest font-bold mb-2">Share Directly</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Select your platform to spread the word.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-6">
              <a 
                href={`https://api.whatsapp.com/send?text=${getShareText()}`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-xs uppercase tracking-widest font-bold transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=${getShareText()}`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center gap-2 py-3 bg-neutral-900 hover:bg-neutral-800 border border-white/10 rounded-lg text-xs uppercase tracking-widest font-bold transition-colors"
              >
                <TwitterIcon className="w-4 h-4" /> Twitter / X
              </a>
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralData.referralLink)}`} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center gap-2 py-3 bg-blue-700 hover:bg-blue-800 rounded-lg text-xs uppercase tracking-widest font-bold transition-colors"
              >
                <FacebookIcon className="w-4 h-4" /> Facebook
              </a>
              <button 
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 py-3 bg-white text-black hover:bg-gray-200 rounded-lg text-xs uppercase tracking-widest font-bold transition-colors"
              >
                <Share2 className="w-4 h-4" /> {copyLinkSuccess ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>

        </div>

        {/* History Table */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold uppercase tracking-widest">Referral History</h3>
          
          <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-white/5 uppercase tracking-widest text-xs text-gray-400 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Friend Name</th>
                    <th className="px-6 py-4">Date Joined</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {referralData.history.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500 uppercase font-mono text-xs">
                        No referrals recorded yet. Share your code to get started!
                      </td>
                    </tr>
                  ) : (
                    referralData.history.map((record) => (
                      <tr key={record.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold">{record.friendName}</td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-400">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase tracking-widest border ${
                            record.status === "rewarded" || record.status === "successful"
                              ? "border-green-500/20 text-green-500 bg-green-500/5"
                              : record.status === "pending"
                                ? "border-yellow-500/20 text-yellow-500 bg-yellow-500/5"
                                : "border-red-500/20 text-red-500 bg-red-500/5"
                          }`}>
                            {record.status === "rewarded" ? "successful & rewarded" : record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
