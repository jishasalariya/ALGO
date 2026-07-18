import { supabase } from "@/lib/supabase";
import ShopClient from "./ShopClient";

// Revalidate the page cache every 60 seconds (Incremental Static Regeneration)
export const revalidate = 60;

export default async function ShopPage() {
  // Fetch strictly published products from the Supabase database
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published");

  return <ShopClient initialProducts={products || []} />;
}
