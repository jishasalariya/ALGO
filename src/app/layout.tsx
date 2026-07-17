import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import CartSidebar from "@/components/CartSidebar";
import LeadCapturePopup from "@/components/LeadCapturePopup";

import Script from "next/script";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KYU?",
  description: "Premium modern streetwear ecommerce brand.",
  keywords: ["streetwear", "kyu?", "fashion", "oversized", "premium streetwear"],
  openGraph: {
    title: "KYU? Streetwear - Season One",
    description: "Explore our latest premium streetwear drops.",
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
    title: "KYU? Streetwear",
    description: "Explore our latest premium streetwear drops.",
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-PZRB7RKZ"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

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

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PZRB7RKZ');
          `}
        </Script>

        <CartProvider>
          {children}
          <CartSidebar />
          <LeadCapturePopup />
        </CartProvider>
      </body>
    </html>
  );
}
