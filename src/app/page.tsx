"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Image as DreiImage } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { ArrowRight, MoveRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

// --- 3D Floating Fashion Gallery ---
function FloatingImage({ url, position, scale, speed, offset }: { url: string, position: [number, number, number], scale: number, speed: number, offset: number }) {
  const ref = useRef<any>();
  const { mouse, viewport } = useThree();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.position.y = position[1] + Math.sin(t * speed + offset) * 0.5;
    const targetX = (mouse.x * viewport.width) / 5;
    ref.current.position.x += (targetX + position[0] - ref.current.position.x) * 0.05;
    ref.current.rotation.y = (mouse.x * Math.PI) / 10;
    ref.current.rotation.x = -(mouse.y * Math.PI) / 10;
  });

  return (
    <DreiImage
      ref={ref}
      url={url}
      transparent
      position={position}
      scale={[scale, scale * 1.5, 1]}
      zoom={1}
      grayscale={0.2}
    />
  );
}

function FloatingGallery() {
  const images = [
    { url: "/images/gallery/1.png", pos: [-4, 1, -2], scale: 3, speed: 0.5, offset: 0 },
    { url: "/images/gallery/2.png", pos: [4, -1, -3], scale: 4, speed: 0.4, offset: 2 },
    { url: "/images/gallery/3.png", pos: [0, 2, -5], scale: 5, speed: 0.3, offset: 4 },
    { url: "/images/gallery/4.png", pos: [-6, -2, -6], scale: 3.5, speed: 0.6, offset: 1 },
    { url: "/images/gallery/5.png", pos: [5, 2, -4], scale: 4.5, speed: 0.45, offset: 3 },
  ];

  return (
    <>
      {images.map((img, i) => (
        <FloatingImage 
          key={i} 
          url={img.url} 
          position={img.pos as [number, number, number]} 
          scale={img.scale} 
          speed={img.speed}
          offset={img.offset}
        />
      ))}
    </>
  );
}

// --- Fashion Product Card ---
function FashionCard({ product, isLarge = false }: { product: any, isLarge?: boolean }) {
  if (!product) return null;
  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col cursor-pointer w-full">
      <div className={`relative overflow-hidden bg-[#111] ${isLarge ? 'aspect-[3/4]' : 'aspect-[4/5]'} w-full mb-6`}>
        <motion.img 
          src={product.images?.[0] || "/images/gallery/1.png"}
          alt={product.product_name}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
        />
      </div>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium tracking-wide uppercase">{product.product_name}</h3>
        <span className="text-sm font-medium tracking-widest text-gray-400">₹{product.price}</span>
      </div>
    </Link>
  );
}

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setProducts(data);
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-white selection:text-black">
      {/* 3D WebGL Hero Section (100vh) */}
      <div className="relative h-screen w-full overflow-hidden sticky top-0 z-0">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <fog attach="fog" args={['#050505', 5, 15]} />
            <ambientLight intensity={1} />
            <React.Suspense fallback={null}>
              <FloatingGallery />
            </React.Suspense>
          </Canvas>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_100%)] pointer-events-none" />
        </div>

        <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-6 md:py-8 pointer-events-auto">
          <div className="flex gap-6 md:gap-12 text-xs uppercase tracking-[0.2em] font-medium">
            <Link href="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
            <Link href="/collections" className="hover:text-gray-400 transition-colors hidden md:block">Archive</Link>
          </div>
          <div className="flex gap-6 md:gap-12 text-xs uppercase tracking-[0.2em] font-medium">
            <Link href="/account" className="hover:text-gray-400 transition-colors">Account</Link>
            <Link href="/shop" className="hover:text-gray-400 transition-colors">Cart</Link>
          </div>
        </nav>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-[18vw] font-black tracking-tighter leading-none uppercase mix-blend-difference text-white"
          >
            ALGO
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
            className="mt-4 text-sm tracking-[0.4em] uppercase font-medium mix-blend-difference"
          >
            Life runs on bad decisions
          </motion.p>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center gap-4">
          <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent" />
        </div>
      </div>

      <div className="relative z-20 bg-[#050505] w-full">
        <section className="w-full px-4 md:px-8 py-32 bg-[#050505] border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-white/10 pb-8">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Season<br/>One.
              </h2>
              <Link href="/shop" className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] hover:text-gray-400 transition-colors mt-8 md:mt-0">
                View Entire Drop <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-24">
              <div className="md:col-span-7">
                {products[0] && <FashionCard product={products[0]} isLarge={true} />}
              </div>

              <div className="md:col-span-5 flex flex-col gap-24 md:mt-32">
                {products[1] && <FashionCard product={products[1]} />}
                {products[2] && <FashionCard product={products[2]} />}
              </div>
            </div>
          </div>
        </section>

        <footer className="w-full bg-[#020202] py-24 px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
            <div>
              <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4 text-white">ALGO</h2>
              <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
                © 2026 ALGO Streetwear.<br/>Life runs on broken algorithms.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-16 text-xs uppercase tracking-[0.2em] font-medium text-gray-500">
              <div className="flex flex-col gap-6">
                <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
                <Link href="/account" className="hover:text-white transition-colors">Account</Link>
              </div>
              <div className="flex flex-col gap-6">
                <a href="https://instagram.com/algo.inn" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
                <a href="mailto:algowear.co@gmail.com" className="hover:text-white transition-colors">Email</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
