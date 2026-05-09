"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { addItem, setIsCartOpen, items } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isZoomedMobile, setIsZoomedMobile] = useState(false);

  const handleDragEnd = (e: any, info: any) => {
    if (!product || !product.images) return;
    const swipeThreshold = 50;
    const currentIndex = product.images.indexOf(mainImage);
    if (info.offset.x < -swipeThreshold) {
      const nextIndex = (currentIndex + 1) % product.images.length;
      setMainImage(product.images[nextIndex]);
    } else if (info.offset.x > swipeThreshold) {
      const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
      setMainImage(product.images[prevIndex]);
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (data) {
        setProduct(data);
        setMainImage(data.images?.[0] || "");
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      alert("Please select a size first.");
      return;
    }
    
    setIsAdding(true);
    addItem({
      id: `${product.id}-${selectedSize || 'OS'}`,
      productId: product.id,
      name: product.product_name,
      price: product.price,
      size: selectedSize || 'OS',
      quantity: quantity,
      image: product.images?.[0] || ""
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 400);
  };

  if (loading) return <div className="min-h-screen bg-black text-white pt-24 flex justify-center items-center font-mono uppercase text-sm">Loading Product...</div>;
  if (!product) return <div className="min-h-screen bg-black text-white pt-24 flex justify-center items-center font-mono uppercase text-sm">Product not found.</div>;


  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black pt-24 pb-32">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link href="/" className="text-2xl font-bold tracking-tighter uppercase">
          ALGO
        </Link>
        <div className="flex items-center gap-6 text-sm uppercase tracking-widest font-medium">
          <Link href="/shop" className="hover:text-gray-400 transition-colors hidden sm:block">Shop</Link>
          <Link href="/account" className="hover:text-gray-400 transition-colors">Account</Link>
          <button onClick={() => setIsCartOpen(true)} className="hover:text-gray-400 transition-colors">
            Cart ({cartItemsCount})
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 mt-8">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-24">
          {/* Images Section */}
          <div className="w-full md:w-1/2 flex flex-col lg:flex-row gap-4">
            {/* Desktop Thumbnail Column */}
            <div className="flex-col gap-4 w-20 hidden lg:flex">
              {product.images?.map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => setMainImage(img)}
                  className={`relative aspect-[3/4] bg-[#111] overflow-hidden border-2 transition-colors ${mainImage === img ? 'border-white' : 'border-transparent'}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover transition-all" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="w-full flex-1 flex flex-col gap-4">
              <motion.div 
                key={mainImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative aspect-[3/4] w-full bg-[#111] overflow-hidden cursor-crosshair group touch-pan-y"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                onDoubleClick={() => setIsZoomedMobile(!isZoomedMobile)}
                onMouseMove={(e) => {
                  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - left) / width) * 100;
                  const y = ((e.clientY - top) / height) * 100;
                  e.currentTarget.style.setProperty('--x', `${x}%`);
                  e.currentTarget.style.setProperty('--y', `${y}%`);
                }}
              >
                <img 
                  src={mainImage} 
                  alt={product.product_name} 
                  style={{ transformOrigin: 'var(--x, 50%) var(--y, 50%)' }}
                  className={`w-full h-full object-cover transition-all duration-300 ease-out group-hover:scale-[2] pointer-events-none ${isZoomedMobile ? 'scale-[2]' : 'scale-100'}`} 
                />
              </motion.div>

              {/* Mobile Thumbnail Row */}
              <div className="flex gap-4 w-full lg:hidden overflow-x-auto pb-2 no-scrollbar">
                {product.images?.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setMainImage(img)}
                    className={`relative w-20 flex-shrink-0 aspect-[3/4] bg-[#111] overflow-hidden border-2 transition-colors ${mainImage === img ? 'border-white' : 'border-transparent'}`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter uppercase mb-4">{product.product_name}</h1>
              <p className="text-2xl font-medium mb-8">₹{product.price}</p>
              
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                    {product.description || "Minimal streetwear engineered for maximum impact."}
                  </p>
                </div>

                {/* Size Selector */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="uppercase tracking-widest text-sm font-medium">Select Size</h3>
                    <button className="text-xs uppercase tracking-widest text-gray-500 hover:text-white underline decoration-gray-500 hover:decoration-white transition-colors">
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(product.sizes || ["S", "M", "L", "XL"]).map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-14 h-14 flex items-center justify-center border font-medium transition-all ${
                          selectedSize === size 
                            ? "bg-white text-black border-white" 
                            : "border-white/20 text-white hover:border-white"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="uppercase tracking-widest text-sm font-medium mb-4">Quantity</h3>
                  <div className="flex items-center border border-white/20 w-32 h-12">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="flex-1 flex justify-center items-center hover:bg-white/10 transition-colors h-full"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="flex-1 flex justify-center items-center hover:bg-white/10 transition-colors h-full"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full flex justify-center items-center gap-3 bg-white text-black py-5 uppercase tracking-widest font-semibold hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isAdding ? "Adding..." : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>

                {/* Bullet Points */}
                <div className="pt-8 border-t border-white/10">
                  <ul className="space-y-2 text-sm text-gray-400">
                    {(product.details || ["Premium Terry Cotton Fabric", "240 GSM Heavyweight Quality", "Oversized Relaxed Fit", "Soft & Breathable Material"]).map((detail: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
