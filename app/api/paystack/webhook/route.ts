import { NextRequest, NextResponse } from "next/server";
import { isValidWebhookSignature } from "@/lib/paystack";
import { incrementCupsSponsored } from "@/lib/kv";

export const runtime = "nodejs";

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
    const data = event.data as {
      reference: string;
      metadata?: { type?: string; qty?: number };
    };

    console.log(`Paystack charge.success — reference ${data.reference}`);

    if (data.metadata?.type === "cup" && typeof data.metadata.qty === "number" && data.metadata.qty > 0) {
      await incrementCupsSponsored(data.metadata.qty);
    }
  }

  // Always 200 quickly so Paystack doesn't retry unnecessarily.
  return NextResponse.json({ received: true });
}
