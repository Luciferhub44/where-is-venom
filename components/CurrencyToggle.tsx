"use client";

import { useCurrency } from "@/lib/currency-context";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className="wv-currency-fixed">
      <div className="wv-currency-toggle">
        {SUPPORTED_CURRENCIES.map((c) => (
          <button
            key={c}
            className={c === currency ? "active" : ""}
            onClick={() => setCurrency(c)}
            type="button"
          >
            {c}
          </button>
        ))}
      </div>
      {currency === "USD" && (
        <div className="wv-currency-note">No Nigerian bank account needed — international cards accepted.</div>
      )}
    </div>
  );
}
