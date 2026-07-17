"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32">
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">KYU?</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 mt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-12">Cancellation & Refund Policy</h1>
        
        <div className="space-y-8 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">1. All Sales Final</h2>
            <p>At KYU?, all sales are final. We do not offer returns, exchanges, or refunds under any circumstances.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">2. Defective Items</h2>
            <p>We carefully inspect every item before shipping. In the rare event that you receive a defective or damaged product, please contact us immediately so we can investigate the issue.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
