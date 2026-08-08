import HomeClient from "./HomeClient";
import type { Metadata } from "next";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "KYU? Streetwear — Indian Oversized T-Shirts & Apparel",
  description: "Indian oversized streetwear by KYU?. Heavyweight 240 GSM cotton tees featuring minimal fronts and bold back graphic designs. Shop Season One now.",
  keywords: ["KYU?", "KYU? streetwear", "Indian streetwear", "oversized t-shirts India"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KYU? — Wear Your Curiosity",
    description: "Premium oversized streetwear from India. Season One is live — heavyweight 240 GSM tees built for the bold and the curious.",
    url: "https://kyuwear.vercel.app",
    siteName: "KYU?",
    images: [
      {
        url: "https://res.cloudinary.com/du3nga7zg/image/upload/v1777835099/final_black_front_mdjizc.jpg",
        width: 1200,
        height: 630,
        alt: "KYU? Streetwear Season One Campaign",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KYU? — Wear Your Curiosity",
    description: "Premium oversized streetwear from India. Season One is live — heavyweight 240 GSM tees built for the bold and the curious.",
    images: ["https://res.cloudinary.com/du3nga7zg/image/upload/v1777835099/final_black_front_mdjizc.jpg"],
  },
};

export default function Home() {
  const organizationJsonLd = getOrganizationSchema();
  const websiteJsonLd = getWebSiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <h1 className="sr-only">KYU? — Wear Your Curiosity</h1>
      <HomeClient />
    </>
  );
}
