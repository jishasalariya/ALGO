import { supabase } from "@/lib/supabase";
import ShopClient from "./ShopClient";
import type { Metadata } from "next";

// Revalidate the page cache every 15 seconds (Incremental Static Regeneration)
export const revalidate = 15;

export const metadata: Metadata = {
  title: "Shop Streetwear — T-Shirts, Outerwear & Bottoms | KYU?",
  description: "Shop premium oversized streetwear. Season One features heavyweight 240 GSM cotton drop-shoulder t-shirts. Buy premium boxy fit tees online in India with fast shipping.",
  keywords: ["Oversized t-shirt India", "Buy oversized t-shirt online", "oversized streetwear tee"],
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop KYU? Season One",
    description: "Minimal designs engineered for maximum impact. Browse the full Season One collection of premium oversized streetwear.",
    images: [
      {
        url: "https://res.cloudinary.com/du3nga7zg/image/upload/v1777835099/final_black_front_mdjizc.jpg",
        width: 1200,
        height: 630,
        alt: "KYU? Streetwear Shop Collection",
      }
    ]
  },
  twitter: {
    title: "Shop KYU? Season One",
    description: "Minimal designs engineered for maximum impact. Browse the full Season One collection of premium oversized streetwear.",
    images: ["https://res.cloudinary.com/du3nga7zg/image/upload/v1777835099/final_black_front_mdjizc.jpg"]
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
