"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Download } from "lucide-react";

interface Lead {
  id: string;
  name: string | null;
  email: string;
  phone: string;
  created_at: string;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching leads from database:", error);
      } else if (data) {
        setLeads(data);
      }
      setLoading(false);
    }
    fetchLeads();
  }, []);

  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ["Name", "Email", "Phone Number", "Submission Date & Time"];
    
    const rows = leads.map((lead) => [
      lead.name || "N/A",
      lead.email,
      lead.phone,
      new Date(lead.created_at).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => {
            // Escape double quotes and wrap in quotes to preserve formatting and handle commas
            const escaped = String(value).replace(/"/g, '""');
            return `"${escaped}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `algo_leads_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="text-gray-500 font-mono text-sm uppercase">Loading Database...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-widest">Early Access Leads</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
            Total Submissions: {leads.length}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={leads.length === 0}
          className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-white bg-transparent hover:bg-white/5 disabled:border-white/10 disabled:text-gray-600 disabled:bg-transparent disabled:cursor-not-allowed transition-all duration-300 rounded-lg text-xs uppercase tracking-widest font-semibold"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white/5 uppercase tracking-widest text-xs text-gray-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">Submission Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 uppercase tracking-widest text-xs font-mono">
                    No leads collected yet.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{lead.name || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-300 font-mono text-xs">{lead.email}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{lead.phone}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                      {new Date(lead.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
