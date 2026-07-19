import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | KYU? Streetwear",
  description: "Questions about an order, sizing, or anything else? Get in touch with the KYU? team.",
  openGraph: {
    title: "Contact Us | KYU? Streetwear",
    description: "Questions about an order, sizing, or anything else? Get in touch with the KYU? team.",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
