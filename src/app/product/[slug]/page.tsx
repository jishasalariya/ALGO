import { supabase } from "@/lib/supabase";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Revalidate product cache every 15 seconds (Incremental Static Regeneration)
export const revalidate = 15;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!product) return {};

  let metaDescription = `${product.product_name} — Premium 240 GSM heavyweight cotton, drop-shoulder oversized fit. Kyu Season One. Buy oversized t-shirt online.`;
  if (slug === 'vintage-torque-tee') {
    metaDescription = "Vintage Torque Tee — a nod to raw horsepower and street heritage. Premium 240 GSM heavyweight cotton, drop-shoulder oversized fit. Kyu Season One. Buy online.";
  } else if (slug === 'karikala-chola') {
    metaDescription = "Karikala Chola — inspired by the Northern Rise, bold graphic storytelling on 240 GSM heavyweight cotton. Oversized fit. Shop Kyu Season One now.";
  } else if (slug === 'spill-the-tea') {
    metaDescription = "Spill the Tea — bold Hindi typography meets streetwear attitude. 240 GSM heavyweight cotton, oversized fit. Shop Kyu Season One — buy oversized t-shirt online.";
  } else if (product.description) {
    metaDescription = `${product.product_name} — ${product.description.slice(0, 120)}. Premium 240 GSM heavyweight cotton, drop-shoulder oversized fit.`;
  }

  return {
    title: `${product.product_name} — Kyu Oversized T-Shirt, 240 GSM Cotton`,
    description: metaDescription,
    openGraph: {
      title: `${product.product_name} | KYU?`,
      description: `240 GSM oversized tee. Minimal front, bold back. ₹${product.price}. Shop the KYU? Season One drop.`,
      images: product.images?.[0] ? [{ url: product.images[0] }] : []
    },
    twitter: {
      title: `${product.product_name} | KYU?`,
      description: `240 GSM oversized tee. Minimal front, bold back. ₹${product.price}. Shop the KYU? Season One drop.`,
      images: product.images?.[0] ? [product.images[0]] : []
    }
  };
}

export async function generateStaticParams() {
  // Query strictly published products to build paths at build time
  const { data: products } = await supabase
    .from("products")
    .select("slug")
    .eq("status", "published");

  return products?.map((product) => ({
    slug: product.slug,
  })) || [];
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch the product by slug, ensuring it is published
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}
