import Hero from "@/components/Hero";
import StoryTimeline from "@/components/StoryTimeline";
import ImpactStats from "@/components/ImpactStats";
import CupsCampaign from "@/components/CupsCampaign";
import TwoWaysToSupport from "@/components/TwoWaysToSupport";
import DonateSection from "@/components/DonateSection";
import Footer from "@/components/Footer";
import { getCupsSponsored } from "@/lib/kv";
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

export default async function HomePage() {
  const cupsSponsored = await getCupsSponsored();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(episodesJsonLd()) }}
      />
      <Hero />
      <CupsCampaign initialCupsSponsored={cupsSponsored} variant="full" />
      <StoryTimeline />
      <CupsCampaign initialCupsSponsored={cupsSponsored} variant="recap" />
      <ImpactStats />
      <TwoWaysToSupport />
      <DonateSection />
      <Footer />
    </>
  );
}
