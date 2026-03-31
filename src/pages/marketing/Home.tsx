import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { PathSelector } from "@/components/marketing/home/PathSelector";
import { ThreeReasonsSection } from "@/components/marketing/home/ThreeReasonsSection";
import { LizaLoopSection } from "@/components/marketing/home/LizaLoopSection";
import { TwoTrackValue } from "@/components/marketing/home/TwoTrackValue";
import { CategoryComparison } from "@/components/marketing/home/CategoryComparison";
import { GuideSection } from "@/components/marketing/home/GuideSection";
import { FAQSection } from "@/components/marketing/home/FAQSection";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";
import { SectionDivider } from "@/components/marketing/home/SectionDivider";

export default function HomePage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <PathSelector />
      <ThreeReasonsSection />
      <SectionDivider />
      <LizaLoopSection />
      <TwoTrackValue />
      <SectionDivider />
      <CategoryComparison />
      <GuideSection />
      <FAQSection />
      <BetaCTASection />
    </MarketingLayout>
  );
}
