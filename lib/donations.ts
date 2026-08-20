import { Currency } from "./types";
import { ngnToUsd } from "./currency";

export interface DonationTier {
  amount: number;
  label: string;
  featured?: boolean;
}

// NGN amounts are canonical; USD is derived via the fixed FX rate in
// lib/currency.ts so the two currencies never drift out of sync.
const NGN_TIERS: DonationTier[] = [
  { amount: 20000, label: "One physical therapy session & supplies", featured: true },
  { amount: 40000, label: "A week of essential medications & care" },
  { amount: 100000, label: "A full month of rehabilitation support" },
];

export const DONATION_TIERS: Record<Currency, DonationTier[]> = {
  NGN: NGN_TIERS,
  USD: NGN_TIERS.map((tier) => ({ ...tier, amount: ngnToUsd(tier.amount) })),
};
