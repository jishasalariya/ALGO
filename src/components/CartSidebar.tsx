"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "./CartProvider";
import Link from "next/link";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

export default function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeItem, totalAmount, shippingCharge, grandTotal } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "anticipate" }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold tracking-tighter uppercase flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Cart ({items.length})
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p className="uppercase tracking-widest text-sm">Your cart is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-6 py-2 border border-white/20 rounded-full text-white uppercase tracking-widest text-xs hover:bg-white/10 transition-colors"
                  >
                    Keep Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-32 bg-[#111] border border-white/10 flex-shrink-0">
                      <img src={getOptimizedImageUrl(item.image, 160)} alt={`KYU? ${item.name} — Black T-Shirt`} className="w-full h-full object-cover grayscale-0 md:grayscale" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium uppercase tracking-wider text-sm">{item.name}</h3>
                          <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">Size: {item.size}</p>
                        <p className="font-medium text-sm mt-2">₹{item.price}</p>
                      </div>
                      
                      <div className="flex items-center border border-white/20 w-24 h-8 mt-4">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex-1 flex justify-center items-center hover:bg-white/10 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="flex-1 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex-1 flex justify-center items-center hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-6 bg-[#050505]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Shipping</span>
                    <span>{shippingCharge === 0 ? <span className="text-green-400">FREE</span> : `₹${shippingCharge}`}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between text-white font-medium text-lg">
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>

                <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                  <button className="w-full flex justify-center items-center gap-2 bg-white text-black py-4 uppercase tracking-widest text-sm font-semibold hover:bg-gray-200 transition-colors">
                    Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
