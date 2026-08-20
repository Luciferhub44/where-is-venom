"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Currency } from "./types";
import { DEFAULT_CURRENCY, LOCAL_STORAGE_CURRENCY_KEY } from "./currency";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_CURRENCY_KEY);
      if (raw === "NGN" || raw === "USD") setCurrencyState(raw);
    } catch {
      // localStorage unavailable — fall back to default silently.
    }
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(LOCAL_STORAGE_CURRENCY_KEY, c);
    } catch {
      // ignore
    }
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within a CurrencyProvider");
  return ctx;
}
