import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { ThreeReasonsSection } from "@/components/marketing/home/ThreeReasonsSection";

import { LizaLoopSection } from "@/components/marketing/home/LizaLoopSection";
import { CategoryComparison } from "@/components/marketing/home/CategoryComparison";
import { FAQSection } from "@/components/marketing/home/FAQSection";
import { GuideSection } from "@/components/marketing/home/GuideSection";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";
import { SectionDivider } from "@/components/marketing/home/SectionDivider";

export default function HomePage() {
  return (
    <MarketingLayout>
      <HeroSection />
      
      <ThreeReasonsSection />
      <SectionDivider />
      <LizaLoopSection />
      <CategoryComparison />
      <SectionDivider />
      <FAQSection />
      <GuideSection />
      <BetaCTASection />
    </MarketingLayout>
  );
}
