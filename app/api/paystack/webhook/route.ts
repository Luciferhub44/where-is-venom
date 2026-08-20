import { NextRequest, NextResponse } from "next/server";
import { isValidWebhookSignature } from "@/lib/paystack";
import { incrementCupsSponsored, recordTransaction } from "@/lib/kv";

export const runtime = "nodejs";

interface ChargeSuccessData {
  reference: string;
  paid_at?: string;
  customer?: { email?: string };
  metadata?: {
    type?: "donation" | "cup";
    qty?: number;
    amount?: number;
    currency?: string;
    name?: string;
    phone?: string;
    shipping_street?: string;
    shipping_city?: string;
    shipping_state?: string;
    shipping_country?: string;
    notes?: string;
  };
}

// Configure this URL (https://<your-domain>/api/paystack/webhook) in
// Paystack Dashboard → Settings → API Keys & Webhooks.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!isValidWebhookSignature(rawBody, signature)) {
    console.warn("Rejected Paystack webhook: invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event: string; data: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.event === "charge.success") {
    const data = event.data as unknown as ChargeSuccessData;
    const metadata = data.metadata;

    console.log(`Paystack charge.success — reference ${data.reference}`);

    if (metadata?.type === "cup" && typeof metadata.qty === "number" && metadata.qty > 0) {
      await incrementCupsSponsored(metadata.qty);
    }

    if (metadata?.type === "donation" || metadata?.type === "cup") {
      await recordTransaction({
        reference: data.reference,
        type: metadata.type,
        amount: metadata.amount ?? 0,
        currency: metadata.currency ?? "NGN",
        email: data.customer?.email ?? "",
        name: metadata.name,
        phone: metadata.phone,
        qty: metadata.qty,
        street: metadata.shipping_street,
        city: metadata.shipping_city,
        state: metadata.shipping_state,
        country: metadata.shipping_country,
        notes: metadata.notes,
        paidAt: data.paid_at ?? new Date().toISOString(),
        recordedAt: new Date().toISOString(),
      });
    }
  }

  // Always 200 quickly so Paystack doesn't retry unnecessarily.
  return NextResponse.json({ received: true });
}
