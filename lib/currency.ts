import { Currency } from "./types";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  NGN: "₦",
  USD: "$",
};

export const DEFAULT_CURRENCY: Currency = "NGN";
export const SUPPORTED_CURRENCIES: Currency[] = ["NGN", "USD"];

// Fixed FX rate used to derive USD prices from the canonical NGN amounts.
// No live FX lookup — update this constant when the rate needs to change.
export const NGN_PER_USD = 1360;

export function ngnToUsd(ngn: number): number {
  return Math.round(ngn / NGN_PER_USD);
}

export function formatMoney(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function priceFor(price: Record<Currency, number>, currency: Currency): number {
  return price[currency];
}

// Paystack expects amounts in the smallest currency unit (kobo for NGN,
// cents for USD).
export function toSubunit(amount: number): number {
  return Math.round(amount * 100);
}

export const LOCAL_STORAGE_CURRENCY_KEY = "wiv_currency";
