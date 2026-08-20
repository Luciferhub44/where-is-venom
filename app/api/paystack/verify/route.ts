import { NextRequest, NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/paystack";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }
  try {
    const result = await verifyTransaction(reference);
    return NextResponse.json({
      status: result.data.status,
      amount: result.data.amount / 100,
      currency: result.data.currency,
      email: result.data.customer.email,
      metadata: result.data.metadata,
      paidAt: result.data.paid_at,
      reference: result.data.reference,
    });
  } catch (err) {
    console.error("Paystack verify failed:", err);
    const message = err instanceof Error ? err.message : "Failed to verify payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
