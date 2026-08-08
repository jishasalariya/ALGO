import React from "react";
import Link from "next/link";
import { ArrowLeft, Truck, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import type { Metadata } from "next";
import { getBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | KYU? Streetwear",
  description: "KYU? Streetwear shipping policy. Orders process in 1–3 business days with standard 3–7 day delivery across India. Free shipping on orders of 2+ items.",
  alternates: {
    canonical: "/shipping",
  },
  openGraph: {
    title: "Shipping & Delivery Policy | KYU? Streetwear",
    description: "Orders process in 1–3 business days with 3–7 day delivery across India. Free shipping on 2+ items.",
    url: "https://kyuwear.vercel.app/shipping",
  },
};

export default function ShippingPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyuwear.vercel.app';

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Shipping Policy", url: `${siteUrl}/shipping` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-black text-white pt-24 pb-32 font-sans selection:bg-white selection:text-black">
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
          <Link href="/" className="text-lg md:text-2xl font-bold tracking-tighter uppercase">KYU?</Link>
          <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-medium">
            <Link href="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
            <Link href="/sizing" className="hover:text-gray-400 transition-colors">Sizing</Link>
            <Link href="/faq" className="hover:text-gray-400 transition-colors">FAQ</Link>
            <Link href="/about" className="hover:text-gray-400 transition-colors">About</Link>
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 mt-12">
          <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">Shipping &amp; Delivery</h1>
          <p className="text-gray-400 text-sm mb-12 font-light">Official delivery timelines, fulfillment standards, and shipping charges across India.</p>
          
          <div className="space-y-10 text-gray-300 leading-relaxed text-sm md:text-base">
            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" /> 1. Processing Time
              </h2>
              <p className="text-gray-400 text-sm">
                All orders are processed and packed within <strong>1–3 business days</strong> (Monday to Friday, excluding national holidays). You will receive an automated email and SMS notification containing your shipment tracking details once dispatched.
              </p>
            </section>

            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-5 h-5 text-gray-400" /> 2. Shipping Rates &amp; Delivery Timelines
              </h2>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>• <strong>Orders with 2 or more products:</strong> Free Standard Shipping across India.</li>
                <li>• <strong>Single-product orders:</strong> Flat shipping fee of ₹50 charged at checkout.</li>
                <li>• <strong>Standard Transit Time:</strong> 3–7 business days depending on delivery destination and regional logistics connectivity.</li>
              </ul>
            </section>

            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gray-400" /> 3. Real-Time Tracking &amp; Couriers
              </h2>
              <p className="text-gray-400 text-sm">
                Once dispatched from our Indore fulfillment center, an active tracking link is emailed to you. You can monitor the real-time movement of your parcel through our courier partner portal.
              </p>
            </section>

            <section className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
              <h2 className="text-white text-lg font-semibold uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-gray-400" /> 4. Shipping Queries
              </h2>
              <p className="text-gray-400 text-sm">
                If you have questions regarding an existing shipment or delivery address correction, reach out to our team at <a href="mailto:kyuwear.in@gmail.com" className="text-white hover:underline font-mono">kyuwear.in@gmail.com</a> or call <a href="tel:+919001913162" className="text-white hover:underline font-mono">+91 9001913162</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
