"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";

export default function LeadCapturePopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  const [errorMsg, setErrorMsg] = useState("");

  // Determine if popup should be shown on this route
  const isExcludedRoute = 
    pathname ? (
      pathname.startsWith("/admin") || 
      pathname.startsWith("/login") || 
      pathname.startsWith("/signup")
    ) : false;

  useEffect(() => {
    // If we're on an excluded route, do not load popup
    if (isExcludedRoute) return;

    // Check localStorage
    const hasCaptured = localStorage.getItem("algo-lead-captured");
    if (hasCaptured === "true") return;

    // Trigger popup after 3 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isExcludedRoute]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMsg(""); // Clear errors on change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/;

    // Email validation
    if (!formData.email.trim()) {
      setErrorMsg("Email address is required.");
      return;
    }
    if (!emailRegex.test(formData.email.trim().toLowerCase())) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    // Phone validation
    if (!formData.phone.trim()) {
      setErrorMsg("Phone number is required.");
      return;
    }
    if (!phoneRegex.test(formData.phone.trim())) {
      setErrorMsg("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        localStorage.setItem("algo-lead-captured", "true");
        
        // Auto-close popup after 2 seconds
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      } else {
        setErrorMsg(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMsg("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render nothing if not open or if excluded route
  if (isExcludedRoute || (!isOpen && !showSuccess)) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.6 }}
            className="relative w-full max-w-md bg-[#050505] border border-white/10 rounded-2xl p-8 overflow-hidden shadow-2xl z-10 font-sans"
          >
            {/* Background design elements to fit ALGO theme */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/2 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/2 rounded-full blur-2xl pointer-events-none" />

            {!showSuccess ? (
              <>
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white hover:bg-white/5 p-1 rounded-full transition-all duration-300"
                  aria-label="Close early access popup"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none">
                    Early Access
                  </h3>
                  <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-gray-500 font-medium mt-2">
                    Enter the Algorithm
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm mt-3 leading-relaxed">
                    Be the first to know about Season Two drops. Bad decisions & broken algorithms.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white focus:bg-black/50 transition-all duration-300 placeholder:text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white focus:bg-black/50 transition-all duration-300 placeholder:text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1.5 font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white focus:bg-black/50 transition-all duration-300 placeholder:text-gray-700"
                    />
                  </div>

                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-medium"
                    >
                      {errorMsg}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs rounded-lg hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                  >
                    {isSubmitting ? "Processing..." : "Get Early Access"}
                    {!isSubmitting && (
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 mb-6"
                >
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-black tracking-tighter uppercase leading-none text-white">
                  ACCESS GRANTED.
                </h3>
                <p className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-gray-500 font-medium mt-2">
                  You are in the System
                </p>
                <p className="text-gray-400 text-xs md:text-sm mt-4 max-w-xs leading-relaxed">
                  Early access credentials have been saved. Keep an eye out for Drop Two details.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
