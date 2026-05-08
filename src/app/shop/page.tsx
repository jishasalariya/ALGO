"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/components/CartProvider";

type Product = {
  id: string;
  product_name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { setIsCartOpen, items } = useCart();
  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'published');
      
      if (data) setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-32">
      {/* Navigation (simplified for inner pages) */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-xl md:text-2xl font-bold tracking-tighter uppercase">
          ALGO
        </Link>
        <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm uppercase tracking-widest font-medium">
          <Link href="/account" className="hover:text-gray-400 transition-colors hidden sm:block">Account</Link>
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

        {/* Filters placeholder */}
        <div className="flex gap-6 md:gap-8 border-b border-white/10 pb-4 md:pb-6 mb-8 md:mb-12 text-xs md:text-sm uppercase tracking-widest text-gray-400 overflow-x-auto whitespace-nowrap no-scrollbar">
          <button className="text-white">All</button>
          <button className="hover:text-white transition-colors">T-Shirts</button>
          <button className="hover:text-white transition-colors">Outerwear</button>
          <button className="hover:text-white transition-colors">Bottoms</button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#111] mb-6"></div>
                <div className="h-4 bg-[#111] w-2/3 mb-2"></div>
                <div className="h-4 bg-[#111] w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-[3/4] bg-[#111] overflow-hidden mb-6">
                    <img 
                      src={product.images[0]} 
                      alt={product.product_name}
                      className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
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
