import { NextResponse } from "next/server";
import {
  EPISODES,
  EPISODES_UPLOAD_DATE,
  episodePosterSrc,
  episodeVideoSrc,
} from "@/lib/episodes";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Google video sitemap extension — all 12 episodes live on the homepage, so
// this is a single <url> entry with one <video:video> block per episode.
// https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps
export async function GET() {
  const videos = EPISODES.map(
    (ep) => `
    <video:video>
      <video:thumbnail_loc>${SITE_URL}${episodePosterSrc(ep.poster)}</video:thumbnail_loc>
      <video:title>${xmlEscape(`Where Is Venom? — Episode ${ep.num}: ${ep.title}`)}</video:title>
      <video:description>${xmlEscape(ep.body)}</video:description>
      <video:content_loc>${SITE_URL}${episodeVideoSrc(ep.video)}</video:content_loc>
      <video:duration>${ep.durationSeconds}</video:duration>
      <video:publication_date>${EPISODES_UPLOAD_DATE}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>`
  ).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${SITE_URL}/</loc>${videos}
  </url>
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
