import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { CurrencyProvider } from "@/lib/currency-context";
import CurrencyToggle from "@/components/CurrencyToggle";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const TITLE = "Where Is Venom? — Queen Xtelle";
const DESCRIPTION =
  "A true story of faith and recovery. Support Venom's journey to surgery — buy or sponsor a cup of XS Skin Glow Herbal Soap through the 2,000 Cups for Venom campaign, or give any amount toward his medical care.";
const OG_IMAGE = "/images/cup.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Where Is Venom?",
  },
  description: DESCRIPTION,
  keywords: [
    "Where Is Venom",
    "Queen Xtelle",
    "Venom surgery fund",
    "2000 Cups for Venom",
    "XS Skin Glow Herbal Soap",
    "Xtelle Secrets",
    "medical fundraiser Nigeria",
    "donate surgery fund",
  ],
  authors: [{ name: "Queen Xtelle" }],
  creator: "Queen Xtelle",
  publisher: "Queen Xtelle",
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "Where Is Venom?",
    images: [{ url: OG_IMAGE, width: 1044, height: 1507, alt: "XS Skin Glow Herbal Soap — 2,000 Cups for Venom" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Where Is Venom?",
    url: SITE_URL,
    description: DESCRIPTION,
    author: { "@type": "Person", name: "Queen Xtelle" },
  };

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Jost:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CurrencyProvider>
          <CurrencyToggle />
          {children}
        </CurrencyProvider>
        <Analytics />
      </body>
    </html>
  );
}
