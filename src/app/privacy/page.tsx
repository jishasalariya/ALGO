"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32">
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">KYU?</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-8 mt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-4xl font-bold tracking-tighter uppercase mb-12">Privacy Policy</h1>
        
        <div className="space-y-8 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, including your name, email address, postal address, phone number, and payment information when you make a purchase.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to fulfill your orders, communicate with you about your orders, and notify you about new drops and campaigns if you opt in.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold uppercase tracking-widest mb-4">3. Data Security</h2>
            <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access. Payments are processed securely via our payment partners.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
