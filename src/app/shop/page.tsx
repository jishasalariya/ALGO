import { supabase } from "@/lib/supabase";
import ShopClient from "./ShopClient";

// Revalidate the page cache every 15 seconds (Incremental Static Regeneration)
export const revalidate = 15;

export default async function ShopPage() {
  // Fetch strictly published products from the Supabase database
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published");

  return <ShopClient initialProducts={products || []} />;
}
