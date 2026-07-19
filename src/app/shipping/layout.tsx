import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery | KYU? Streetwear",
  description: "Everything you need to know about KYU? shipping — timelines, charges, and tracking.",
  alternates: {
    canonical: "/shipping",
  },
  openGraph: {
    title: "Shipping & Delivery | KYU? Streetwear",
    description: "Everything you need to know about KYU? shipping — timelines, charges, and tracking.",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
