// Minimal single-password admin auth — no session store needed. The cookie
// value is a hash derived from ADMIN_PASSWORD, so a valid cookie can be
// checked without persisting sessions anywhere.
import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "wiv_admin";

function expectedToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function checkAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && password === expected;
}

export function adminCookieValue(): string | null {
  return expectedToken();
}

export async function isAdminAuthed(): Promise<boolean> {
  const token = expectedToken();
  if (!token) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value === token;
}
