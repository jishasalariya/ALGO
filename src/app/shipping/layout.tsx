import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Info | KYU? Streetwear",
  description: "Everything you need to know about KYU? shipping — timelines, charges, and tracking.",
  openGraph: {
    title: "Shipping Info | KYU? Streetwear",
    description: "Everything you need to know about KYU? shipping — timelines, charges, and tracking.",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
