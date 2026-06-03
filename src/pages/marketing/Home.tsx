import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { TrustStrip } from "@/components/marketing/home/TrustStrip";
import { ThreeBruisesStrip } from "@/components/marketing/home/ThreeBruisesStrip";
import { GuideStrip } from "@/components/marketing/home/GuideStrip";
import { PromptFactoryVisual } from "@/components/marketing/home/PromptFactoryVisual";
import { GetStartedPlan } from "@/components/marketing/home/GetStartedPlan";
import { AccountableAIStrip } from "@/components/marketing/home/AccountableAIStrip";
import { NinetyDayBeat } from "@/components/marketing/home/NinetyDayBeat";
import { ThreeReasonsSection } from "@/components/marketing/home/ThreeReasonsSection";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";
import { SectionDivider } from "@/components/marketing/home/SectionDivider";

/*
 * Homepage built on StoryBrand for the AI Rollout Owner.
 * Hero -> Problem -> Guide -> Plan -> Stakes -> Transformation -> Proof -> CTA.
 * Single primary CTA across the page: Book a call.
 */
export default function HomePage() {
  return (
    <MarketingLayout>
      {/* 1. Character + promise: AI rollout owner */}
      <HeroSection />

      {/* 2. Tension stat strip: the questions you are being asked this quarter */}
      <TrustStrip />

      {/* 3. Problem: three places it breaks (escalating severity) */}
      <ThreeBruisesStrip />

      {/* 4. Guide: empathy + authority */}
      <GuideStrip />

      {/* 4b. Visual centerpiece: anatomy of a prompt at org scale */}
      <PromptFactoryVisual />

      {/* 5. Plan: 3 steps, co-built, with the metrics that surface at 90d */}
      <GetStartedPlan />

      {/* 6. Stakes: two ways this ends */}
      <AccountableAIStrip />

      {/* 7. Transformation: 90 days in */}
      <NinetyDayBeat />

      <SectionDivider />

      {/* 8. Proof: structural reasons existing tools cannot close the gap */}
      <ThreeReasonsSection />

      {/* 9. Final ask: one CTA, no fragmentation */}
      <BetaCTASection />
    </MarketingLayout>
  );
}
