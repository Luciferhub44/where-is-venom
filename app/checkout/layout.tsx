import type { Metadata } from "next";

// Transaction-specific pages — never index, they carry payment references.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
