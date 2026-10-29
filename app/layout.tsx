import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Header from "@/components/Header";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const TITLE = "Where Is Venom? — A Life Remembered";
const DESCRIPTION =
  "A Life Remembered: The story, life, and legacy of Venom. A brother, a son, a father, and a creative spirit whose life touched so many. Preserved in faith, love, and remembrance by Queen Xtelle and family.";
const OG_IMAGE = "/images/venom-portrait.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Where Is Venom?",
  },
  description: DESCRIPTION,
  keywords: [
    "Where Is Venom",
    "Venom memorial",
    "Venom life remembered",
    "Queen Xtelle",
    "Venom documentary",
    "Venom legacy",
    "venomzcustomz",
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
    images: [
      {
        url: OG_IMAGE,
        width: 675,
        height: 1200,
        alt: "Venom — A Life Remembered",
      },
    ],
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
    name: "Where Is Venom? — A Life Remembered",
    url: SITE_URL,
    description: DESCRIPTION,
    author: { "@type": "Person", name: "Queen Xtelle" },
  };

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
