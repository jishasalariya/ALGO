"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32">
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">ALGO</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 mt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-12">Shipping & Delivery</h1>
        
        <div className="space-y-8 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">1. Processing Time</h2>
            <p>All orders are processed within 1-3 business days. You will receive an email confirmation once your order has shipped.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">2. Shipping Rates & Delivery Estimates</h2>
            <p>Standard delivery typically takes 3-7 business days within India depending on your location. Shipping charges are calculated and displayed at checkout.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">3. Tracking</h2>
            <p>Once your order is shipped, you will receive a tracking number via email which you can use to track the package via our shipping partner's portal.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
