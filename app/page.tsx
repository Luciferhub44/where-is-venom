import Hero from "@/components/Hero";
import StoryTimeline from "@/components/StoryTimeline";
import ImpactStats from "@/components/ImpactStats";
import CupsCampaign from "@/components/CupsCampaign";
import TwoWaysToSupport from "@/components/TwoWaysToSupport";
import DonateSection from "@/components/DonateSection";
import Footer from "@/components/Footer";
import { getCupsSponsored } from "@/lib/kv";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cupsSponsored = await getCupsSponsored();

  return (
    <>
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
