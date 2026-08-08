import React from "react";
import Link from "next/link";
import { Syne } from "next/font/google";
import { ArrowLeft, MoveRight, HelpCircle, Package, Ruler, Truck, RotateCcw, Mail } from "lucide-react";
import type { Metadata } from "next";
import { getFAQPageSchema, getBreadcrumbSchema, FAQItem } from "@/lib/schema";

const syne = Syne({
  weight: ["800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | KYU? Streetwear",
  description: "Find answers to frequently asked questions about KYU? Streetwear. Learn about our 240 GSM oversized tees, sizing, shipping across India, care, and customer support.",
  keywords: ["KYU FAQ", "KYU streetwear questions", "KYU size help", "KYU shipping info"],
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | KYU? Streetwear",
    description: "Everything you need to know about KYU? products, 240 GSM heavyweight cotton fit, shipping, sizing, and order support.",
    url: "https://kyuwear.vercel.app/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | KYU? Streetwear",
    description: "Everything you need to know about KYU? products, 240 GSM heavyweight cotton fit, shipping, sizing, and order support.",
  },
};

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

export default function FAQPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kyuwear.vercel.app';

  const faqCategories: FAQCategory[] = [
    {
      title: "About KYU?",
      icon: <HelpCircle className="w-5 h-5 text-gray-400" />,
      items: [
        {
          question: "What is KYU?",
          answer: "KYU? is an independent Indian streetwear brand founded in 2026 by Jisha Salariya and Tanisha Joshi in Indore. The brand creates heavyweight 240 GSM apparel centered around inquiry, bold visual identity, and cultural storytelling."
        },
        {
          question: "Who founded KYU?",
          answer: "KYU? was founded by Jisha Salariya and Tanisha Joshi in Indore, Madhya Pradesh, India."
        },
        {
          question: "What does KYU? mean?",
          answer: "KYU? represents the question 'Why?' (क्यों?). It serves as our creative manifesto — asking why blend into the background when fashion can make a statement and spark conversation."
        },
        {
          question: "What kind of brand is KYU?",
          answer: "KYU? is an Indian oversized streetwear label specializing in heavyweight fabrics, minimal front designs with bold back graphic prints, and structured boxy silhouettes."
        },
        {
          question: "Where is KYU? based?",
          answer: "KYU? is based and headquartered in Indore, Madhya Pradesh, India, shipping nationwide."
        }
      ]
    },
    {
      title: "Products & Materials",
      icon: <Package className="w-5 h-5 text-gray-400" />,
      items: [
        {
          question: "What does KYU? sell?",
          answer: "KYU? currently offers Season One premium oversized t-shirts featuring minimal fronts and bold back graphic artwork."
        },
        {
          question: "What GSM are KYU? T-shirts?",
          answer: "KYU? Season One t-shirts are crafted using 240 GSM (Grams per Square Meter) heavyweight cotton fabric for substantial drape and durability."
        },
        {
          question: "What fabric are KYU? T-shirts made from?",
          answer: "KYU? Season One t-shirts are constructed from 240 GSM Terry Cotton, providing a comfortable interior loop knit texture, breathability, and structural durability."
        },
        {
          question: "Are KYU? T-shirts oversized?",
          answer: "Yes. All KYU? Season One t-shirts feature an intentional drop-shoulder, relaxed boxy cut."
        },
        {
          question: "What fit do KYU? T-shirts have?",
          answer: "KYU? t-shirts have a relaxed, drop-shoulder boxy fit designed to drape naturally without clinging to the body."
        },
        {
          question: "What sizes are available?",
          answer: "KYU? Season One t-shirts are available in sizes Small (S), Medium (M), Large (L), and Extra Large (XL)."
        }
      ]
    },
    {
      title: "Sizing & Fit Guidance",
      icon: <Ruler className="w-5 h-5 text-gray-400" />,
      items: [
        {
          question: "How do I choose my KYU? size?",
          answer: "Because our tees have built-in oversized volume, order your usual true size for our signature relaxed drop-shoulder streetwear fit. For a closer fit, size down one size. For an exaggerated baggy silhouette, size up one size."
        },
        {
          question: "Where can I find the KYU? size guide?",
          answer: "You can access the comprehensive KYU? size guide at https://kyuwear.vercel.app/sizing for in-depth fit guidance and proportion details."
        },
        {
          question: "Are KYU? T-shirts oversized or regular fit?",
          answer: "KYU? pieces are cut as relaxed, drop-shoulder oversized streetwear tees rather than standard regular-fit tees."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      icon: <Truck className="w-5 h-5 text-gray-400" />,
      items: [
        {
          question: "Where does KYU? ship?",
          answer: "KYU? currently ships to addresses across India."
        },
        {
          question: "How long does KYU? shipping take?",
          answer: "Orders are processed within 1-3 business days. Standard delivery within India generally takes 3-7 business days from the dispatch date."
        },
        {
          question: "How much does shipping cost?",
          answer: "KYU? offers Free Shipping on all orders containing 2 or more products. For single-product orders, a flat shipping fee of ₹50 is applied at checkout."
        }
      ]
    },
    {
      title: "Cancellation & Refunds",
      icon: <RotateCcw className="w-5 h-5 text-gray-400" />,
      items: [
        {
          question: "What is KYU?'s return policy?",
          answer: "At KYU?, all sales are final. We do not offer returns, exchanges, or refunds under standard circumstances."
        },
        {
          question: "What if I receive a defective or damaged product?",
          answer: "Every piece is inspected prior to shipping. In the rare event you receive a damaged or defective item, contact our support team immediately at kyuwear.in@gmail.com with photos and order details."
        },
        {
          question: "Can I cancel my order?",
          answer: "Orders are queued for prompt fulfillment. Please contact our support team immediately at kyuwear.in@gmail.com or +91 9001913162 if you have any questions regarding your order."
        }
      ]
    },
    {
      title: "Contact & Support",
      icon: <Mail className="w-5 h-5 text-gray-400" />,
      items: [
        {
          question: "How can I contact KYU?",
          answer: "You can reach our team by email at kyuwear.in@gmail.com or by phone at +91 9001913162 / +91 7566696374 (Monday to Friday, 10:00 AM – 7:00 PM IST)."
        },
        {
          question: "How can I get help with my order?",
          answer: "For order assistance, visit our contact page at https://kyuwear.vercel.app/contact or email us directly at kyuwear.in@gmail.com with your order number."
        }
      ]
    }
  ];

  // Flatten all questions and answers for exact matching FAQPage schema
  const allFaqItems: FAQItem[] = faqCategories.flatMap(c => c.items);

  const faqPageJsonLd = getFAQPageSchema(allFaqItems);

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: `${siteUrl}/` },
    { name: "FAQ", url: `${siteUrl}/faq` }
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="min-h-screen bg-[#050505] text-white selection:bg-white selection:text-black pt-24 pb-32 font-sans">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 py-5 md:py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
          <Link href="/" className="text-lg md:text-2xl font-bold tracking-tighter uppercase">
            KYU?
          </Link>
          <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 text-[10px] sm:text-xs md:text-sm uppercase tracking-widest font-medium">
            <Link href="/shop" className="hover:text-gray-400 transition-colors">Shop</Link>
            <Link href="/sizing" className="hover:text-gray-400 transition-colors">Sizing</Link>
            <Link href="/blog" className="hover:text-gray-400 transition-colors">Blog</Link>
            <Link href="/about" className="hover:text-gray-400 transition-colors">About</Link>
            <Link href="/account" className="hover:text-gray-400 transition-colors">Account</Link>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 mt-12 md:mt-20">
          <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          {/* Header Title */}
          <header className="mb-16 md:mb-20 border-b border-white/10 pb-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 block mb-3 font-semibold font-mono">Knowledge Base</span>
            <h1 className={`${syne.className} text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-6`}>
              FREQUENTLY ASKED<br />QUESTIONS.
            </h1>
            <p className="text-gray-400 text-sm md:text-base font-light max-w-2xl leading-relaxed">
              Direct answers to common questions about KYU? Streetwear, Season One 240 GSM heavyweight cotton apparel, sizing, shipping, and order assistance.
            </p>
          </header>

          {/* FAQ Sections */}
          <div className="space-y-16">
            {faqCategories.map((category, catIdx) => (
              <section key={catIdx} className="space-y-8">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  {category.icon}
                  <h2 className="text-white text-lg md:text-xl font-bold uppercase tracking-wider">
                    {category.title}
                  </h2>
                </div>

                <div className="space-y-6">
                  {category.items.map((item, qIdx) => (
                    <div key={qIdx} className="bg-[#111] border border-white/10 p-6 md:p-8 space-y-3">
                      <h3 className="text-white text-base md:text-lg font-semibold tracking-tight">
                        {item.question}
                      </h3>
                      <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed">
                        {item.answer}
                      </p>
                      {item.question.includes("size guide") && (
                        <div className="pt-2">
                          <Link 
                            href="/sizing" 
                            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white border border-white/20 hover:border-white px-4 py-2 transition-colors font-mono"
                          >
                            Open Size Guide <MoveRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                      {item.question.includes("defective") && (
                        <div className="pt-2">
                          <Link 
                            href="/refund" 
                            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-white underline underline-offset-4 transition-colors font-mono"
                          >
                            Read Full Refund Policy
                          </Link>
                        </div>
                      )}
                      {item.question.includes("shipping cost") && (
                        <div className="pt-2">
                          <Link 
                            href="/shipping" 
                            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-white underline underline-offset-4 transition-colors font-mono"
                          >
                            Read Full Shipping Policy
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Quick Links Footer */}
          <div className="mt-24 pt-16 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-2">Have More Questions?</h3>
              <p className="text-gray-400 text-xs md:text-sm font-light">Our support team is happy to assist with sizing or orders.</p>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/contact" 
                className="px-6 py-3.5 border border-white bg-white text-black hover:bg-transparent hover:text-white transition-all text-xs font-semibold uppercase tracking-widest"
              >
                Contact Us
              </Link>
              <Link 
                href="/shop" 
                className="px-6 py-3.5 border border-white/20 hover:border-white text-white transition-all text-xs font-semibold uppercase tracking-widest"
              >
                Shop Collection
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
