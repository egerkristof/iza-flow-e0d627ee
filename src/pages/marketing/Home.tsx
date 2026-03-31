import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { CoreLoopStrip } from "@/components/marketing/home/CoreLoopStrip";
import { TwoEntryPoints } from "@/components/marketing/home/TwoEntryPoints";
import { ThreeReasonsSection } from "@/components/marketing/home/ThreeReasonsSection";
import { LizaLoopSection } from "@/components/marketing/home/LizaLoopSection";
import { CategoryComparison } from "@/components/marketing/home/CategoryComparison";
import { GuideSection } from "@/components/marketing/home/GuideSection";
import { FAQSection } from "@/components/marketing/home/FAQSection";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";
import { SectionDivider } from "@/components/marketing/home/SectionDivider";

export default function HomePage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <CoreLoopStrip />
      <TwoEntryPoints />
      <SectionDivider />
      <ThreeReasonsSection />
      <LizaLoopSection />
      <SectionDivider />
      <CategoryComparison />
      <GuideSection />
      <FAQSection />
      <BetaCTASection />
    </MarketingLayout>
  );
}
