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

  let productKeywords = ["Kyu oversized t-shirt", "Kyu premium t-shirt", "240 GSM t-shirt"];
  if (slug === 'karikala-chola') {
    productKeywords = ["240 GSM t-shirt", "Heavyweight t-shirt", "premium cotton t-shirt", "Kyu oversized t-shirt"];
  }

  return {
    title: `${product.product_name} — Kyu Oversized T-Shirt, 240 GSM Cotton`,
    description: metaDescription,
    keywords: productKeywords,
    alternates: {
      canonical: `/product/${slug}`,
    },
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyu-wear.vercel.app';

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.product_name,
    "image": product.images?.[0] || "",
    "description": product.description || `Premium 240 GSM heavyweight cotton ${product.product_name} drop-shoulder oversized fit from KYU? Season One.`,
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "KYU?"
    },
    "offers": {
      "@type": "Offer",
      "url": `${siteUrl}/product/${product.slug}`,
      "priceCurrency": "INR",
      "price": String(product.price),
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${siteUrl}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": `${siteUrl}/shop`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.product_name,
        "item": `${siteUrl}/product/${product.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductClient product={product} />
    </>
  );
}
