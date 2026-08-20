import { Currency } from "./types";
import { ngnToUsd } from "./currency";

// "2,000 Cups for Venom" — a time-boxed campaign to fund Venom's surgery.
// Update CAMPAIGN_START_ISO to your real launch date/time before deploying;
// the countdown and progress bar are both driven from this file.

export const CAMPAIGN_GOAL_CUPS = 2000;
export const CAMPAIGN_DURATION_DAYS = 3;

// ISO timestamp (UTC) — edit this to when the campaign actually goes live.
export const CAMPAIGN_START_ISO = "2026-08-20T00:00:00Z";

// Shown until Redis is configured (see lib/kv.ts) or until it's caught up —
// set to the real number of cups already claimed so the bar isn't empty.
export const CAMPAIGN_FALLBACK_CUPS_SPONSORED = 60;

export const CUP_NAME = "XS Skin Glow Herbal Soap — Sponsor a Cup";
export const CUP_IMAGE = "/images/cup.png";

export const CUP_PRICE: Record<Currency, number> = {
  NGN: 16000,
  USD: ngnToUsd(16000),
};

export function getCampaignEndDate(): Date {
  const start = new Date(CAMPAIGN_START_ISO);
  return new Date(start.getTime() + CAMPAIGN_DURATION_DAYS * 24 * 60 * 60 * 1000);
}

export function getCampaignStatus() {
  const end = getCampaignEndDate();
  const now = new Date();
  const msRemaining = end.getTime() - now.getTime();
  return {
    isActive: msRemaining > 0,
    msRemaining: Math.max(0, msRemaining),
    endDate: end,
  };
}
