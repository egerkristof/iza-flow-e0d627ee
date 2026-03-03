import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { LizaLoopSection } from "@/components/marketing/home/LizaLoopSection";
import { MaturityLadder } from "@/components/marketing/home/MaturityLadder";
import { DelegateSection } from "@/components/marketing/home/DelegateSection";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";

export default function HomePage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <LizaLoopSection />
      <MaturityLadder />
      <DelegateSection />
      <BetaCTASection />
    </MarketingLayout>
  );
}
