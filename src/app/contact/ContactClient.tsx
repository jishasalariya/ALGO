"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, ArrowRight, MapPin, Clock, ShieldCheck } from "lucide-react";

// Custom Instagram SVG
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ type: "error", message: "Please fill in all fields." });
      return;
    }
    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "Thank you for reaching out. We will get back to you shortly." });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setStatus({ type: "error", message: "Failed to send message. Please check your connection." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">KYU?</Link>
        <div className="flex items-center gap-6 text-sm uppercase tracking-widest font-medium">
          <Link href="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
          <Link href="/sizing" className="hover:text-gray-400 transition-colors">Sizing</Link>
          <Link href="/faq" className="hover:text-gray-400 transition-colors">FAQ</Link>
          <Link href="/about" className="hover:text-gray-400 transition-colors">About</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column - Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase mb-6 leading-none">
                Contact<br />KYU?
              </h1>
              <p className="text-gray-400 text-lg mb-12 max-w-md font-light leading-relaxed">
                Whether you have questions regarding sizing, custom orders, order tracking, or brand collaborations, our founding team in Indore is here to assist.
              </p>

              {/* Direct Info */}
              <div className="space-y-8 border-t border-white/10 pt-12">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1 font-mono">Email Support</h2>
                    <a href="mailto:kyuwear.in@gmail.com" className="text-white hover:text-gray-300 transition-colors text-base font-mono">kyuwear.in@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1 font-mono">Phone Support</h2>
                    <p className="text-white text-base font-mono">
                      <a href="tel:+919001913162" className="hover:text-gray-300 transition-colors">+91 9001913162</a>
                      <span className="text-gray-500 mx-2">/</span>
                      <a href="tel:+917566696374" className="hover:text-gray-300 transition-colors">+91 7566696374</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1 font-mono">Headquarters</h2>
                    <p className="text-white text-base">Indore, Madhya Pradesh, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <h2 className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1 font-mono">Hours of Operation</h2>
                    <p className="text-white text-sm">Monday – Friday: 10:00 AM – 7:00 PM IST</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4 text-xs font-mono uppercase tracking-widest text-gray-400">
                <Link href="/shipping" className="hover:text-white underline underline-offset-4">Shipping Info</Link>
                <span>•</span>
                <Link href="/refund" className="hover:text-white underline underline-offset-4">Returns Policy</Link>
                <span>•</span>
                <Link href="/sizing" className="hover:text-white underline underline-offset-4">Size Guide</Link>
                <span>•</span>
                <Link href="/faq" className="hover:text-white underline underline-offset-4">FAQ</Link>
              </div>

            </motion.div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-[#0a0a0a] border border-white/10 p-8 md:p-12 rounded-2xl relative">
            <h2 className="text-2xl font-bold tracking-tight uppercase mb-8">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-mono">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-mono">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-mono">Subject</label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Order inquiry, sizing, or general question"
                  className="w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2 font-mono">Message</label>
                <textarea 
                  rows={5} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you?"
                  className="w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors resize-none text-sm"
                ></textarea>
              </div>

              {status.message && (
                <div className={`p-4 rounded-lg text-sm font-medium border ${
                  status.type === "success" 
                    ? "bg-green-500/10 border-green-500/20 text-green-400" 
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}>
                  {status.message}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="group w-full md:w-auto px-12 py-4 bg-white text-black font-semibold uppercase tracking-widest text-xs rounded-none hover:bg-gray-200 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
              >
                {isSubmitting ? "Sending..." : "Submit Message"} 
                {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>
        </div>

        {/* Brand Community Section */}
        <div className="mt-40 border-t border-white/10 pt-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold tracking-tighter uppercase mb-2">Join the Movement</h2>
              <p className="text-gray-400 text-sm">Follow KYU? for official drop announcements, campaign editorials, and behind-the-scenes craft.</p>
            </div>
            {/* TODO: Insert official KYU? Instagram URL and handle here */}
            <a href="https://x.com/KyuWear" target="_blank" rel="noreferrer" className="mt-6 md:mt-0 px-6 py-3 border border-white/20 rounded-none flex items-center gap-2 hover:bg-white/5 transition-colors uppercase tracking-widest text-xs font-mono">
              Follow @KyuWear on X
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
