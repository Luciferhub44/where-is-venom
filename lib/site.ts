// Canonical site URL, used for metadata, sitemap, and robots.txt.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
