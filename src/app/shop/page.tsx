import { supabase } from "@/lib/supabase";
import ShopClient from "./ShopClient";
import type { Metadata } from "next";

// Revalidate the page cache every 15 seconds (Incremental Static Regeneration)
export const revalidate = 15;

export const metadata: Metadata = {
  title: "Shop Oversized T-Shirts India | 240 GSM Streetwear — KYU?",
  description: "Buy oversized t-shirts online — 240 GSM heavyweight cotton, boxy drop-shoulder fit. Karikala Chola, Spill the Tea, Vintage Torque Tee. Oversized streetwear, India.",
  keywords: ["Oversized t-shirt India", "Buy oversized t-shirt online", "oversized streetwear tee"],
  openGraph: {
    title: "Shop KYU? Season One",
    description: "Minimal designs engineered for maximum impact. Browse the full Season One collection of premium oversized streetwear.",
  },
  twitter: {
    title: "Shop KYU? Season One",
    description: "Minimal designs engineered for maximum impact. Browse the full Season One collection of premium oversized streetwear.",
  }
};

export default async function ShopPage() {
  // Fetch strictly published products from the Supabase database
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published");

  return <ShopClient initialProducts={products || []} />;
}
