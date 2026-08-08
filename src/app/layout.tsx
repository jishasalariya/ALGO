import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

import Script from "next/script";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyuwear.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "KYU? — Indian Oversized Streetwear | 240 GSM Cotton T-Shirts",
  description: "KYU? is an independent Indian streetwear brand founded in 2026 in Indore. Premium 240 GSM cotton oversized t-shirts with minimal fronts and bold graphic backs.",
  keywords: ["KYU?", "KYU? Streetwear", "streetwear brand India", "oversized t-shirts India", "240 GSM cotton"],
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "google9423182b0e28a606",
  },
  openGraph: {
    title: "KYU? — Wear Your Curiosity",
    description: "Premium oversized streetwear from India. Season One is live — heavyweight 240 GSM tees built for the bold and the curious.",
    url: "https://kyuwear.vercel.app",
    siteName: "KYU?",
    images: [
      {
        url: "https://res.cloudinary.com/du3nga7zg/image/upload/q_auto,f_auto,w_800/v1784404414/file_000000005f1071f4b5e86afe95af0140_e8hpiq.png",
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
    title: "KYU? — Wear Your Curiosity",
    description: "Premium oversized streetwear from India. Season One is live — heavyweight 240 GSM tees built for the bold and the curious.",
    images: ["https://res.cloudinary.com/du3nga7zg/image/upload/q_auto,f_auto,w_800/v1784404414/file_000000005f1071f4b5e86afe95af0140_e8hpiq.png"],
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
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-W568QW21ED" strategy="lazyOnload" />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-W568QW21ED');
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="lazyOnload">
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
        </CartProvider>
      </body>
    </html>
  );
}
