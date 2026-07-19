"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, User, MapPin, LogOut, Ticket, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "addresses">("orders");
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("user");
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = "/login";
        return;
      }
      setUser(session.user);

      // Process pending referral link if exists in sessionStorage
      const storedRef = sessionStorage.getItem("refCode");
      if (storedRef) {
        try {
          await fetch("/api/referral/register", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
              referralCode: storedRef
            })
          });
          sessionStorage.removeItem("refCode");
        } catch (err) {
          console.error("Failed to register referral on login:", err);
        }
      }

      // Fetch User Role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();
        
      if (userData) {
        setUserRole(userData.role);
      } else {
        // Fallback: Check if their email is exactly the store owner's email
        if (session.user.email === 'algowear.co@gmail.com') {
          setUserRole('admin');
        }
      }

      // Fetch Orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products ( product_name, images )
          )
        `)
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
        
      if (ordersData) setOrders(ordersData);

      // Fetch Addresses
      const { data: addressData } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
        
      if (addressData) setAddresses(addressData);

      setLoading(false);
    };
    checkUserAndFetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  const fullName = user?.user_metadata?.full_name || "KYU? Member";
  const phone = user?.user_metadata?.phone || "";

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">
          KYU?
        </Link>
        <div className="flex items-center gap-6 text-sm uppercase tracking-widest font-medium">
          <Link href="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 mt-12 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <h1 className="text-3xl font-bold tracking-tighter uppercase mb-8">My Account</h1>
          <nav className="flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm uppercase tracking-widest font-medium transition-colors ${activeTab === "orders" ? "bg-white text-black" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <Package className="w-4 h-4" /> Orders
            </button>
            <button 
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm uppercase tracking-widest font-medium transition-colors ${activeTab === "profile" ? "bg-white text-black" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <User className="w-4 h-4" /> Profile
            </button>
            <button 
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm uppercase tracking-widest font-medium transition-colors ${activeTab === "addresses" ? "bg-white text-black" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <MapPin className="w-4 h-4" /> Addresses
            </button>
            
            <Link 
              href="/coupons"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm uppercase tracking-widest font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Ticket className="w-4 h-4" /> My Coupons
            </Link>

            <Link 
              href="/refer-and-earn"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm uppercase tracking-widest font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Users className="w-4 h-4" /> Refer & Earn
            </Link>
            
            {userRole === "admin" && (
              <Link 
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm uppercase tracking-widest font-medium text-cyan-400 hover:bg-cyan-400/10 transition-colors mt-4 border border-cyan-400/30"
              >
                <User className="w-4 h-4" /> Admin Panel
              </Link>
            )}

            <button onClick={handleLogout} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm uppercase tracking-widest font-medium text-red-400 hover:bg-red-400/10 transition-colors ${userRole === "admin" ? "mt-2" : "mt-4"}`}>
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#050505] border border-white/10 rounded-xl p-8 min-h-[500px]">
          
          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Order History</h2>
              <div className="space-y-6">
                {orders.length === 0 ? (
                  <p className="text-gray-500">No orders found.</p>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="border border-white/10 rounded-lg p-6 bg-[#0a0a0a]">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order ID</p>
                          <p className="font-mono">{order.order_id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Date</p>
                          <p>{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Total</p>
                          <p className="font-medium">₹{order.total_amount}</p>
                        </div>
                        <div>
                          <span className={`px-3 py-1 rounded text-xs uppercase tracking-widest border ${order.order_status === 'processing' ? 'border-yellow-500/30 text-yellow-500' : 'border-green-500/30 text-green-500'}`}>
                            {order.order_status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-16 h-20 bg-[#111] overflow-hidden flex-shrink-0">
                              <img src={item.products?.images?.[0] || "/images/gallery/1.png"} alt="Product" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-bold uppercase tracking-widest text-sm">{item.products?.product_name || "Unknown Product"}</p>
                              <p className="text-gray-400 text-xs mt-1">Size: {item.selected_size} | Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Profile Details</h2>
              <form className="max-w-md space-y-6">
                <div>
                  <label className="block text-sm uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                  <input type="text" defaultValue={fullName} className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors text-white" />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                  <input type="email" defaultValue={user?.email} disabled className="w-full px-4 py-3 bg-transparent border border-white/10 rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-widest text-gray-400 mb-2">Phone Number</label>
                  <input type="tel" defaultValue={phone} className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors text-white" />
                </div>
                <div className="flex items-center gap-4">
                  <button type="button" className="px-8 py-3 bg-white text-black uppercase tracking-widest font-semibold text-sm rounded-lg hover:bg-gray-200 transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold uppercase tracking-widest">Saved Addresses</h2>
              </div>
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <p className="text-gray-500">No saved addresses.</p>
                ) : (
                  addresses.map(address => (
                    <div key={address.id} className="border border-white/10 rounded-lg p-6 bg-[#0a0a0a]">
                      <p className="font-bold uppercase tracking-widest mb-2">{address.full_name}</p>
                      <p className="text-gray-400 text-sm mb-1">{address.address_line}</p>
                      <p className="text-gray-400 text-sm mb-1">{address.city}, {address.state} - {address.pincode}</p>
                      <p className="text-gray-400 text-sm">Phone: {address.phone}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
