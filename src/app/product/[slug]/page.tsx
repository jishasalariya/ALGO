import { supabase } from "@/lib/supabase";
import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

// Revalidate product cache every 15 seconds (Incremental Static Regeneration)
export const revalidate = 15;

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
