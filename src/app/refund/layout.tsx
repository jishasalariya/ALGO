import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Return Policy | KYU? Streetwear",
  description: "KYU?'s refund and return policy — clear, simple, no runaround.",
  openGraph: {
    title: "Refund & Return Policy | KYU? Streetwear",
    description: "KYU?'s refund and return policy — clear, simple, no runaround.",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
