"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Eye } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (data) setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  if (loading) return <div className="text-gray-500 font-mono text-sm uppercase">Loading Database...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-widest">Order Fulfillment</h2>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 uppercase tracking-widest text-xs text-gray-400 border-b border-white/10">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {orders.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found. Check RLS policies if orders exist.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono">{order.order_id}</td>
                  <td className="px-6 py-4 text-white font-medium">
                    {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                    <div className="text-xs text-gray-500 mt-1">{order.shipping_address?.city}, {order.shipping_address?.state}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium">₹{order.total_amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs uppercase tracking-widest ${order.payment_status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {order.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs uppercase tracking-widest border border-white/20 bg-white/5">
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end">
                    <button className="text-gray-400 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
