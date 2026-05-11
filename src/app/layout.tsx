import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import CartSidebar from "@/components/CartSidebar";

import Script from "next/script";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALGO | Bad Decisions & Broken Algorithms",
  description: "Premium modern streetwear ecommerce brand. Life runs on broken algorithms.",
  keywords: ["streetwear", "algo", "fashion", "oversized", "premium streetwear"],
  openGraph: {
    title: "ALGO Streetwear - Season One",
    description: "Life runs on bad decisions & broken algorithms. Explore our latest drops.",
    url: "https://algo-streetwear.vercel.app",
    siteName: "ALGO",
    images: [
      {
        url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "ALGO Streetwear",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ALGO Streetwear",
    description: "Life runs on bad decisions & broken algorithms.",
    images: ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-white selection:bg-white selection:text-black">
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-W568QW21ED" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-W568QW21ED');
          `}
        </Script>

        <CartProvider>
          {children}
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}
