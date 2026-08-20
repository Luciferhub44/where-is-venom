import { Currency } from "./types";

export interface DonationTier {
  amount: number;
  label: string;
  featured?: boolean;
}

export const DONATION_TIERS: Record<Currency, DonationTier[]> = {
  NGN: [
    { amount: 10000, label: "A meal & comfort items for a day of therapy" },
    { amount: 20000, label: "One physical therapy session & supplies", featured: true },
    { amount: 40000, label: "A week of essential medications & care" },
    { amount: 100000, label: "A full month of rehabilitation support" },
  ],
  USD: [
    { amount: 25, label: "A meal & comfort items for a day of therapy" },
    { amount: 50, label: "One physical therapy session & supplies", featured: true },
    { amount: 100, label: "A week of essential medications & care" },
    { amount: 250, label: "A full month of rehabilitation support" },
  ],
};
