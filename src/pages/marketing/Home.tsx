import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { ThreeReasonsSection } from "@/components/marketing/home/ThreeReasonsSection";
import { TrustBar } from "@/components/marketing/home/TrustBar";
import { AIFragmentationSection } from "@/components/marketing/home/AIFragmentationSection";
import { ProblemSection } from "@/components/marketing/home/ProblemSection";
import { LizaLoopSection } from "@/components/marketing/home/LizaLoopSection";
import { CategoryComparison } from "@/components/marketing/home/CategoryComparison";
import { FAQSection } from "@/components/marketing/home/FAQSection";
import { GettingStartedStrip } from "@/components/marketing/home/GettingStartedStrip";
import { GuideSection } from "@/components/marketing/home/GuideSection";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";
import { SectionDivider } from "@/components/marketing/home/SectionDivider";

export default function HomePage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <TrustBar />
      <ThreeReasonsSection />
      <ProblemSection />
      <SectionDivider />
      <LizaLoopSection />
      <SectionDivider />
      <CategoryComparison />
      <SectionDivider />
      <FAQSection />
      <SectionDivider />
      <GuideSection />
      <SectionDivider />
      <GettingStartedStrip />
      <SectionDivider />
      <BetaCTASection />
    </MarketingLayout>
  );
}
