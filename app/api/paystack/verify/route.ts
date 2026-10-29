import { NextResponse } from "next/server";

// Fundraising campaign has concluded: verification is disabled.
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      error: "The medical fundraising campaign has concluded.",
    },
    { status: 410 }
  );
}
