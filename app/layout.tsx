import type { Metadata } from "next";
import { CurrencyProvider } from "@/lib/currency-context";
import CurrencyToggle from "@/components/CurrencyToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Where Is Venom? — Queen Xtelle",
  description:
    "A true story of faith and recovery. Support Venom's journey with a donation or sponsor a cup toward his surgery fund.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Jost:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CurrencyProvider>
          <CurrencyToggle />
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
