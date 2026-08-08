import { supabase } from "@/lib/supabase";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductSchema, getBreadcrumbSchema } from "@/lib/schema";

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

  let metaDescription = `${product.product_name} — 240 GSM heavyweight cotton, drop-shoulder oversized fit from KYU? Season One. Buy oversized t-shirt online in India.`;
  if (slug === 'vintage-torque-tee') {
    metaDescription = "Vintage Torque Tee — a nod to raw horsepower and street heritage. 240 GSM heavyweight cotton, drop-shoulder oversized fit from KYU? Season One.";
  } else if (slug === 'karikala-chola') {
    metaDescription = "Karikala Chola — inspired by the Northern Rise, bold graphic storytelling on 240 GSM heavyweight cotton. Oversized fit from KYU? Season One.";
  } else if (slug === 'spill-the-tea') {
    metaDescription = "Spill the Tea — bold Hindi typography meets streetwear attitude. 240 GSM heavyweight cotton, oversized fit from KYU? Season One.";
  } else if (product.description) {
    metaDescription = `${product.product_name} — ${product.description.slice(0, 120)}. 240 GSM heavyweight cotton, drop-shoulder oversized fit from KYU?.`;
  }

  let productKeywords = ["KYU? oversized t-shirt", "KYU? streetwear", "240 GSM t-shirt India", "heavyweight cotton tee"];

  return {
    title: `${product.product_name} | KYU? — 240 GSM Oversized T-Shirt`,
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyuwear.vercel.app';

  const productJsonLd = getProductSchema(product);

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "Shop", url: `${siteUrl}/shop` },
    { name: product.product_name, url: `${siteUrl}/product/${product.slug}` }
  ]);

  // Fetch up to 4 other published products for "You May Also Like"
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .not("id", "eq", product.id)
    .limit(4);

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
      <ProductClient product={product} relatedProducts={relatedProducts || []} />
    </>
  );
}
