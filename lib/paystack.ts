// Server-only helpers for talking to Paystack's REST API.
// NEVER import this file from a "use client" component — it uses the secret key.
import crypto from "crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not set. Add it to .env.local (dev) or your Vercel project's Environment Variables (production)."
    );
  }
  return key;
}

export interface InitializeTransactionArgs {
  email: string;
  amountSubunit: number; // kobo for NGN, cents for USD
  currency: "NGN" | "USD";
  callbackUrl: string;
  reference?: string;
  metadata?: Record<string, unknown>;
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializeTransaction(
  args: InitializeTransactionArgs
): Promise<PaystackInitializeResponse> {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: args.email,
      amount: args.amountSubunit,
      currency: args.currency,
      callback_url: args.callbackUrl,
      reference: args.reference,
      metadata: args.metadata,
    }),
    cache: "no-store",
  });

  const json = (await res.json()) as PaystackInitializeResponse;
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Failed to initialize Paystack transaction");
  }
  return json;
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    currency: string;
    customer: { email: string };
    metadata: Record<string, unknown>;
    paid_at: string | null;
  };
}

export async function verifyTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  const res = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${getSecretKey()}` },
      cache: "no-store",
    }
  );
  const json = (await res.json()) as PaystackVerifyResponse;
  if (!res.ok || !json.status) {
    throw new Error(json.message || "Failed to verify Paystack transaction");
  }
  return json;
}

// Verifies the `x-paystack-signature` header on incoming webhook requests.
// See https://paystack.com/docs/payments/webhooks/
export function isValidWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const hash = crypto
    .createHmac("sha512", getSecretKey())
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}
