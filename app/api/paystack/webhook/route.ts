import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  // Medical campaign has concluded. Webhook accepts signals without processing new charges.
  return NextResponse.json({
    received: true,
    status: "campaign_concluded",
  });
}
