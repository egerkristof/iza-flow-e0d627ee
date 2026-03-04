import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { MaturityLadder } from "@/components/marketing/home/MaturityLadder";
import { LizaLoopSection } from "@/components/marketing/home/LizaLoopSection";
import { TransformationSection } from "@/components/marketing/home/TransformationSection";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";

export default function HomePage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <MaturityLadder />
      <LizaLoopSection />
      <TransformationSection />
      <BetaCTASection />
    </MarketingLayout>
  );
}
