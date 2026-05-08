"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, activeOrders: 0, productsCount: 0, customersCount: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      // Fetch total revenue
      const { data: revenueData } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("payment_status", "completed");
      const revenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      // Fetch active orders count
      const { count: activeOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .in("order_status", ["processing", "shipped"]);

      // Fetch total products
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Fetch total customers
      const { count: customersCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "user");

      setStats({
        revenue,
        activeOrders: activeOrders || 0,
        productsCount: productsCount || 0,
        customersCount: customersCount || 0
      });

      // Fetch recent 5 orders
      const { data: recent } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (recent) setRecentOrders(recent);

      // Fetch low stock products (less than 5)
      const { data: stockAlerts } = await supabase
        .from("products")
        .select("id, product_name, stock_quantity")
        .lt("stock_quantity", 5)
        .order("stock_quantity", { ascending: true })
        .limit(5);
      if (stockAlerts) setLowStock(stockAlerts);

      setLoading(false);
    }
    fetchDashboardData();
  }, []);

  if (loading) return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-white/10 rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-white/10 rounded col-span-2"></div><div className="h-2 bg-white/10 rounded col-span-1"></div></div><div className="h-2 bg-white/10 rounded"></div></div></div></div>;

  const statCards = [
    { name: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, change: "Live" },
    { name: "Active Orders", value: stats.activeOrders.toString(), change: "Live" },
    { name: "Products", value: stats.productsCount.toString(), change: "Live" },
    { name: "Total Customers", value: stats.customersCount.toString(), change: "Live" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="p-6 bg-[#111] border border-white/10 rounded-xl">
            <p className="text-sm text-gray-400 font-medium">{stat.name}</p>
            <div className="mt-2 flex items-baseline gap-4">
              <p className="text-3xl font-semibold text-white">{stat.value}</p>
              <span className="text-sm font-medium text-green-400">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent orders found.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-white/5">
                  <div>
                    <p className="font-medium">{order.order_id}</p>
                    <p className="text-sm text-gray-400">₹{order.total_amount}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 uppercase tracking-widest">
                      {order.order_status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-medium mb-6">Low Stock Alerts</h2>
          <div className="space-y-4">
            {lowStock.length === 0 ? (
              <p className="text-gray-500 text-sm">Inventory levels look healthy!</p>
            ) : (
              lowStock.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-black/50 rounded-lg border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded border border-white/10"></div>
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-red-400">Only {item.stock_quantity} left in stock</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
