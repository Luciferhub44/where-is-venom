import { NextResponse } from "next/server";
import { getCupsSponsored } from "@/lib/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cupsSponsored = await getCupsSponsored();
  return NextResponse.json({ cupsSponsored });
}
