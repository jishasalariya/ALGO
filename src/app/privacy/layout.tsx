import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | KYU? Streetwear",
  description: "How KYU? collects, uses, and protects your data.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | KYU? Streetwear",
    description: "How KYU? collects, uses, and protects your data.",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
