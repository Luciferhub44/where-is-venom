import { NextRequest, NextResponse } from "next/server";
import { initializeTransaction } from "@/lib/paystack";
import { priceFor, toSubunit } from "@/lib/currency";
import { CUP_PRICE } from "@/lib/campaign";
import { Currency } from "@/lib/types";

export const runtime = "nodejs";

function isCurrency(v: unknown): v is Currency {
  return v === "NGN" || v === "USD";
}

function siteUrl(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
}

function randomRef(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

interface DonationBody {
  kind: "donation";
  email: string;
  currency: Currency;
  amount: number;
}

interface CupBody {
  kind: "cup";
  email: string;
  currency: Currency;
  qty: number;
  name: string;
  phone: string;
  shippingAddress: string;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DonationBody | CupBody;

    if (!body || !body.kind) {
      return NextResponse.json({ error: "Missing request body" }, { status: 400 });
    }
    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required" }, { status: 400 });
    }
    if (!isCurrency(body.currency)) {
      return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
    }

    if (body.kind === "donation") {
      const amount = Number(body.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 });
      }
      const reference = randomRef("wiv_donate");
      const result = await initializeTransaction({
        email: body.email,
        amountSubunit: toSubunit(amount),
        currency: body.currency,
        callbackUrl: `${siteUrl(req)}/checkout/success`,
        reference,
        metadata: {
          type: "donation",
          amount,
          currency: body.currency,
          custom_fields: [
            { display_name: "Type", variable_name: "type", value: "Donation" },
          ],
        },
      });
      return NextResponse.json({
        authorizationUrl: result.data.authorization_url,
        reference: result.data.reference,
      });
    }

    if (body.kind === "cup") {
      const qty = Math.floor(Number(body.qty));
      if (!Number.isFinite(qty) || qty <= 0) {
        return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
      }
      if (!body.name?.trim()) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }
      if (!body.phone?.trim()) {
        return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
      }
      if (!body.shippingAddress?.trim()) {
        return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
      }
      // Amount is always computed server-side from the fixed cup price —
      // never trust a price sent from the client.
      const unitPrice = priceFor(CUP_PRICE, body.currency);
      const amount = unitPrice * qty;

      const reference = randomRef("wiv_cup");
      const result = await initializeTransaction({
        email: body.email,
        amountSubunit: toSubunit(amount),
        currency: body.currency,
        callbackUrl: `${siteUrl(req)}/checkout/success`,
        reference,
        metadata: {
          type: "cup",
          qty,
          amount,
          currency: body.currency,
          name: body.name.trim(),
          phone: body.phone.trim(),
          shipping_address: body.shippingAddress.trim(),
          notes: body.notes?.trim() || "",
          custom_fields: [
            { display_name: "Type", variable_name: "type", value: "Cup Sponsorship" },
            { display_name: "Cups", variable_name: "cups", value: String(qty) },
            { display_name: "Name", variable_name: "name", value: body.name.trim() },
            { display_name: "Phone", variable_name: "phone", value: body.phone.trim() },
            { display_name: "Shipping Address", variable_name: "shipping_address", value: body.shippingAddress.trim() },
            { display_name: "Prayer / Note", variable_name: "notes", value: body.notes?.trim() || "—" },
          ],
        },
      });
      return NextResponse.json({
        authorizationUrl: result.data.authorization_url,
        reference: result.data.reference,
      });
    }

    return NextResponse.json({ error: "Unknown request kind" }, { status: 400 });
  } catch (err) {
    console.error("Paystack initialize failed:", err);
    const message = err instanceof Error ? err.message : "Failed to start payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
