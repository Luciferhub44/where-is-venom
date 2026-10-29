import { NextResponse } from "next/server";

// Fundraising campaign has concluded: all payment initialization is disabled.
export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      error: "The medical fundraising campaign has concluded. This website now serves as a memorial in honour of Venom's life.",
    },
    { status: 410 }
  );
}
