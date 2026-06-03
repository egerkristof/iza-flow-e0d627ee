import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { TrustStrip } from "@/components/marketing/home/TrustStrip";
import { ThreeBruisesStrip } from "@/components/marketing/home/ThreeBruisesStrip";
import { GuideStrip } from "@/components/marketing/home/GuideStrip";
import { GetStartedPlan } from "@/components/marketing/home/GetStartedPlan";
import { AccountableAIStrip } from "@/components/marketing/home/AccountableAIStrip";
import { NinetyDayBeat } from "@/components/marketing/home/NinetyDayBeat";
import { ThreeReasonsSection } from "@/components/marketing/home/ThreeReasonsSection";
import { PersonaLensExpander } from "@/components/marketing/home/PersonaLensExpander";
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
      {/* 1. Character + promise */}
      <HeroSection />
      <TrustStrip />

      {/* 2. Problem: name the villain */}
      <ThreeBruisesStrip />

      {/* 3. Guide: empathy + authority */}
      <GuideStrip />

      <SectionDivider />

      {/* 4. Plan: 3 steps, co-built, with the metrics step 3 surfaces */}
      <GetStartedPlan />

      {/* 5. Stakes: two ways this ends */}
      <AccountableAIStrip />

      {/* 6. Transformation: 90 days in */}
      <NinetyDayBeat />

      <SectionDivider />

      {/* 7. Proof */}
      <ThreeReasonsSection />
      <PersonaLensExpander />

      {/* 8. Final ask */}
      <BetaCTASection />
    </MarketingLayout>
  );
}
