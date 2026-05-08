"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      const { data } = await supabase.from("users").select("*").eq("role", "user").order("created_at", { ascending: false });
      if (data) setCustomers(data);
      setLoading(false);
    }
    fetchCustomers();
  }, []);

  if (loading) return <div className="text-gray-500 font-mono text-sm uppercase">Loading Database...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-widest">Customer Database</h2>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 uppercase tracking-widest text-xs text-gray-400 border-b border-white/10">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {customers.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No customers found.</td></tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{customer.full_name || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-400">{customer.email}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(customer.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
