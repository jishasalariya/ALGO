"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32">
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">ALGO</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 mt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-12">Terms & Conditions</h1>
        
        <div className="space-y-8 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">1. General</h2>
            <p>By placing an order with ALGO, you agree to be bound by these terms and conditions. These terms apply to all orders placed via our website.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">2. Pricing and Payment</h2>
            <p>All prices are listed in INR. We reserve the right to change pricing without notice. Payment must be completed in full before an order is dispatched.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">3. Intellectual Property</h2>
            <p>All designs, graphics, and content on this website are the intellectual property of ALGO and may not be reproduced without explicit permission.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
