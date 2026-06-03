import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { ThreeBruisesStrip } from "@/components/marketing/home/ThreeBruisesStrip";
import { GuideStrip } from "@/components/marketing/home/GuideStrip";
import { PromptFactoryVisual } from "@/components/marketing/home/PromptFactoryVisual";
import { GetStartedPlan } from "@/components/marketing/home/GetStartedPlan";
import { StakesAndTransform } from "@/components/marketing/home/StakesAndTransform";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";

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

      {/* 2. Problem: three numbers, expand for root cause */}
      <ThreeBruisesStrip />

      {/* 3. Guide: empathy + authority */}
      <GuideStrip />

      {/* 4. Product moment: anatomy of a prompt at org scale */}
      <PromptFactoryVisual />

      {/* 5. Plan: 3 co-built steps */}
      <GetStartedPlan />

      {/* 6. Stakes + transformation: today vs day 90 */}
      <StakesAndTransform />

      {/* 7. Final ask */}
      <BetaCTASection />
    </MarketingLayout>
  );
}
