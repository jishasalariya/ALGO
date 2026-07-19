import HomeClient from "./HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KYU? | Kyu Streetwear — Premium Oversized T-Shirts, India",
  description: "Kyu clothing for the bold and curious. Premium oversized t-shirts, 240 GSM heavyweight cotton, minimal fronts, bold backs. Shop Kyu streetwear — Season One is live.",
  keywords: ["Kyu streetwear", "Kyu clothing", "streetwear brand India"],
  openGraph: {
    title: "KYU? — Wear Your Curiosity",
    description: "Premium oversized streetwear from India. Season One is live — heavyweight 240 GSM tees built for the bold and the curious.",
    url: "https://kyu-wear.vercel.app",
    siteName: "KYU?",
    images: [
      {
        url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "KYU? Streetwear",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KYU? — Wear Your Curiosity",
    description: "Premium oversized streetwear from India. Season One is live — heavyweight 240 GSM tees built for the bold and the curious.",
    images: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop"],
  },
};

export default function Home() {
  return <HomeClient />;
}
