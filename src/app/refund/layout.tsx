import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | KYU? Streetwear",
  description: "KYU?'s refund and return policy — clear, simple, no runaround.",
  alternates: {
    canonical: "/refund",
  },
  openGraph: {
    title: "Cancellation & Refund Policy | KYU? Streetwear",
    description: "KYU?'s refund and return policy — clear, simple, no runaround.",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
