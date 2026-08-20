import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/admin", req.url), { status: 303 });
  res.cookies.delete(ADMIN_COOKIE_NAME);
  return res;
}
