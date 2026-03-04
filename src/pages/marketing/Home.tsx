import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { ProblemSection } from "@/components/marketing/home/ProblemSection";
import { GuideSection } from "@/components/marketing/home/GuideSection";
import { LizaLoopSection } from "@/components/marketing/home/LizaLoopSection";
import { TransformationSection } from "@/components/marketing/home/TransformationSection";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";

export default function HomePage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <ProblemSection />
      <GuideSection />
      <LizaLoopSection />
      <TransformationSection />
      <BetaCTASection />
    </MarketingLayout>
  );
}
