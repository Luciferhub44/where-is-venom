import Hero from "@/components/Hero";
import StoryTimeline from "@/components/StoryTimeline";
import BeyondTheJourney from "@/components/BeyondTheJourney";
import ShareMemory from "@/components/ShareMemory";
import ThankYou from "@/components/ThankYou";
import Footer from "@/components/Footer";
import {
  EPISODES,
  EPISODES_UPLOAD_DATE,
  episodePosterSrc,
  episodeVideoSrc,
} from "@/lib/episodes";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

function episodesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": EPISODES.map((ep) => ({
      "@type": "VideoObject",
      name: `Where Is Venom? — Episode ${ep.num}: ${ep.title}`,
      description: ep.body,
      thumbnailUrl: [`${SITE_URL}${episodePosterSrc(ep.poster)}`],
      uploadDate: EPISODES_UPLOAD_DATE,
      duration: `PT${ep.durationSeconds}S`,
      contentUrl: `${SITE_URL}${episodeVideoSrc(ep.video)}`,
      embedUrl: `${SITE_URL}/#story`,
    })),
  };
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(episodesJsonLd()) }}
      />
      <Hero />
      <StoryTimeline />
      <BeyondTheJourney />
      <ShareMemory />
      <ThankYou />
      <Footer />
    </>
  );
}
