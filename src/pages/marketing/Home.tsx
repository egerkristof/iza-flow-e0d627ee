import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { ThreeReasonsSection } from "@/components/marketing/home/ThreeReasonsSection";
import { LizaLoopSection } from "@/components/marketing/home/LizaLoopSection";
import { GuideSection } from "@/components/marketing/home/GuideSection";
import { CategoryComparison } from "@/components/marketing/home/CategoryComparison";
import { FAQSection } from "@/components/marketing/home/FAQSection";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";
import { SectionDivider } from "@/components/marketing/home/SectionDivider";
import { WhoItsForStrip } from "@/components/marketing/home/WhoItsForStrip";

export default function HomePage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <WhoItsForStrip />
      <ThreeReasonsSection />
      <SectionDivider />
      <LizaLoopSection />
      <GuideSection />
      <SectionDivider />
      <CategoryComparison />
      <FAQSection />
      <BetaCTASection />
    </MarketingLayout>
  );
}
