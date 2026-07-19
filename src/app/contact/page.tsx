"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone, ArrowRight } from "lucide-react";

// Custom Instagram SVG since lucide-react doesn't export it in this version
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

export default function ContactPage() {
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
        setStatus({ type: "success", message: "Your message has been sent successfully!" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.error || "Failed to send message. Please try again." });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setStatus({ type: "error", message: "Something went wrong. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black pt-24 pb-32">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">
          KYU?
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
          <Link href="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
          <Link href="/shop" className="hover:text-gray-400 transition-colors">Collections</Link>
          <Link href="/about" className="hover:text-gray-400 transition-colors">About</Link>
          <Link href="/contact" className="text-white transition-colors border-b border-white pb-1">Contact</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 mt-12">
        <header className="mb-20 text-center md:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-6"
          >
            Contact
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-serif italic text-gray-400 max-w-2xl"
          >
            "Questions, collabs, problems, or just bad decisions."
          </motion.p>
        </header>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Contact Details */}
          <div className="w-full lg:w-1/3 space-y-12">
            <div>
              <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone
              </h3>
              <div className="space-y-2 text-lg">
                <p><a href="tel:+919001913162" className="hover:text-gray-300 transition-colors">+91 9001913162</a></p>
                <p><a href="tel:+917566696374" className="hover:text-gray-300 transition-colors">+91 7566696374</a></p>
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </h3>
              <p className="text-lg">
                <a href="mailto:algowear.co@gmail.com" className="hover:text-gray-300 transition-colors">algowear.co@gmail.com</a>
              </p>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                <InstagramIcon className="w-4 h-4" /> Instagram
              </h3>
              <p className="text-lg">
                <a href="https://www.instagram.com/algo.inn?igsh=MW5wa3dkYTRrOXJyZw==" target="_blank" rel="noreferrer" className="hover:text-gray-300 transition-colors inline-flex items-center gap-2">
                  @algo.inn <ArrowRight className="w-4 h-4" />
                </a>
              </p>
            </div>
            
            <div className="pt-8 border-t border-white/10">
              <p className="text-sm text-gray-500 uppercase tracking-widest">
                Support Hours: Mon-Fri, 10AM - 7PM IST
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full lg:w-2/3 bg-[#0a0a0a] p-8 md:p-12 border border-white/10 rounded-2xl">
            <h2 className="text-2xl font-bold tracking-tighter uppercase mb-8">Send a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Email</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Subject</label>
                <div className="relative">
                  <select 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-4 bg-black border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors text-white appearance-none"
                  >
                    <option value="" disabled className="text-gray-500">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="return">Returns / Exchange</option>
                    <option value="collab">Collaboration</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Message</label>
                <textarea 
                  rows={5} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-4 bg-transparent border border-white/20 rounded-lg focus:outline-none focus:border-white transition-colors resize-none"
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
                className="group w-full md:w-auto px-12 py-4 bg-white text-black font-semibold uppercase tracking-widest text-sm rounded-lg hover:bg-gray-200 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
              >
                {isSubmitting ? "Sending..." : "Submit"} 
                {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>
        </div>

        {/* Instagram Integration Section */}
        <div className="mt-40 border-t border-white/10 pt-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold tracking-tighter uppercase mb-2">Join the Cult</h2>
              <p className="text-gray-400">Follow us on Instagram for latest drops and campaigns.</p>
            </div>
            <a href="https://www.instagram.com/algo.inn?igsh=MW5wa3dkYTRrOXJyZw==" target="_blank" rel="noreferrer" className="mt-6 md:mt-0 px-6 py-3 border border-white/20 rounded-full flex items-center gap-2 hover:bg-white/5 transition-colors uppercase tracking-widest text-sm">
              <InstagramIcon className="w-4 h-4" /> @algo.inn
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <a key={i} href="https://www.instagram.com/algo.inn?igsh=MW5wa3dkYTRrOXJyZw==" target="_blank" rel="noreferrer" className="group relative aspect-square bg-[#111] overflow-hidden block">
                <img 
                  src={`https://images.unsplash.com/photo-${i === 1 ? '1529139574466-a30ab7300def' : i === 2 ? '1503342217505-b0a15ec3261c' : i === 3 ? '1521572163474-6864f9cf17ab' : '1556821840-3a63f95609a7'}?q=80&w=600&auto=format&fit=crop`} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  alt="Instagram Post"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <InstagramIcon className="w-8 h-8 text-white" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
