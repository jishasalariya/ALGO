"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32">
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">ALGO</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 mt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-12">Cancellation & Refund Policy</h1>
        
        <div className="space-y-8 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">1. Cancellations</h2>
            <p>Orders can only be cancelled within 24 hours of placement. Once an order is processed for shipping, it cannot be cancelled.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">2. Returns & Exchanges</h2>
            <p>We accept returns for exchanges within 7 days of delivery only if the product is defective or the wrong size was delivered. Items must be unworn, unwashed, and in original packaging.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">3. Refunds</h2>
            <p>Approved refunds will be processed within 5-7 business days to the original method of payment.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
