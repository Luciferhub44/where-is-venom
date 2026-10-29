import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    status: "concluded",
    message: "The previous fundraising campaign has concluded.",
  });
}
