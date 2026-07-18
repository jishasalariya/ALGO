"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/components/CartProvider";

type Product = {
  id: string;
  product_name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
};

export default function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { setIsCartOpen, items } = useCart();
  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = activeCategory === "All"
    ? initialProducts
    : initialProducts.filter(product => product.category === activeCategory);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32">
      {/* Navigation (simplified for inner pages) */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-xl md:text-2xl font-bold tracking-tighter uppercase">
          KYU?
        </Link>
        <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm uppercase tracking-widest font-medium">
          <Link href="/account" className="hover:text-gray-400 transition-colors">Account</Link>
          <button onClick={() => setIsCartOpen(true)} className="hover:text-gray-400 transition-colors">
            Cart ({cartItemsCount})
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        <header className="mb-12 md:mb-16">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase mb-4">Collection</h1>
          <p className="text-gray-400 max-w-lg text-sm md:text-base">
            Explore our latest drops. Minimal designs engineered for maximum impact.
          </p>
        </header>

        {/* Dynamic Filters */}
        <div className="flex gap-6 md:gap-8 border-b border-white/10 pb-4 md:pb-6 mb-8 md:mb-12 text-xs md:text-sm uppercase tracking-widest text-gray-400 overflow-x-auto whitespace-nowrap no-scrollbar">
          <button onClick={() => setActiveCategory("All")} className={`transition-colors ${activeCategory === "All" ? "text-white" : "hover:text-white"}`}>All</button>
          <button onClick={() => setActiveCategory("T-Shirts")} className={`transition-colors ${activeCategory === "T-Shirts" ? "text-white" : "hover:text-white"}`}>T-Shirts</button>
          <button onClick={() => setActiveCategory("Outerwear")} className={`transition-colors ${activeCategory === "Outerwear" ? "text-white" : "hover:text-white"}`}>Outerwear</button>
          <button onClick={() => setActiveCategory("Bottoms")} className={`transition-colors ${activeCategory === "Bottoms" ? "text-white" : "hover:text-white"}`}>Bottoms</button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-mono uppercase text-sm">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-[3/4] bg-[#111] overflow-hidden mb-6">
                    {product.images && product.images[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.product_name}
                        className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium uppercase tracking-wider mb-2">{product.product_name}</h3>
                      <p className="text-gray-400 text-sm">{product.category}</p>
                    </div>
                    <span className="text-lg font-medium">₹{product.price}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
