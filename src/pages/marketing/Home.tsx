import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { ThreeReasonsSection } from "@/components/marketing/home/ThreeReasonsSection";
import { BuyerRouterFAQ } from "@/components/marketing/home/BuyerRouterFAQ";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";
import { SectionDivider } from "@/components/marketing/home/SectionDivider";
import { ArchitectureTeaser } from "@/components/marketing/home/ArchitectureTeaser";
import { TrustStrip } from "@/components/marketing/home/TrustStrip";

/* Homepage = 4 acts. Hook → Story → Proof → Ask. Anatomy lives on /os. */
export default function HomePage() {
  return (
    <MarketingLayout>
      {/* 1. Hook */}
      <HeroSection />
      <TrustStrip />
      <SectionDivider />
      {/* 2. Story (the Stories player, now responsive) */}
      <ArchitectureTeaser />
      <SectionDivider />
      {/* 3. Proof */}
      <ThreeReasonsSection />
      {/* 4. Ask */}
      <BuyerRouterFAQ />
      <BetaCTASection />
    </MarketingLayout>
  );
}
