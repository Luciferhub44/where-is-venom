// Thin wrapper around Upstash Redis (what Vercel's "Redis" / "KV" storage
// integration is backed by) for the "cups sponsored" live counter.
// Falls back gracefully (no crash) when it isn't configured, so the app
// works out of the box with just Paystack keys — this is an optional upgrade.
import { CAMPAIGN_FALLBACK_CUPS_SPONSORED } from "./campaign";

const CUPS_KEY = "wiv:cups_sponsored";

// Support both the newer Upstash-native var names and the legacy Vercel KV
// names, since either can show up depending on how the integration was added.
function getCredentials(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

export async function getCupsSponsored(): Promise<number> {
  const creds = getCredentials();
  if (!creds) return CAMPAIGN_FALLBACK_CUPS_SPONSORED;
  try {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis(creds);
    const value = await redis.get<number>(CUPS_KEY);
    return value ?? CAMPAIGN_FALLBACK_CUPS_SPONSORED;
  } catch (err) {
    console.error("Redis read failed, falling back to static count:", err);
    return CAMPAIGN_FALLBACK_CUPS_SPONSORED;
  }
}

export async function incrementCupsSponsored(by: number): Promise<number | null> {
  const creds = getCredentials();
  if (!creds) return null;
  try {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis(creds);
    return await redis.incrby(CUPS_KEY, by);
  } catch (err) {
    console.error("Redis increment failed:", err);
    return null;
  }
}
