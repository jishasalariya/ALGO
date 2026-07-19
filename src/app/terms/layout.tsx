import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | KYU? Streetwear",
  description: "Terms and conditions for shopping with KYU? Streetwear.",
  openGraph: {
    title: "Terms of Service | KYU? Streetwear",
    description: "Terms and conditions for shopping with KYU? Streetwear.",
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
