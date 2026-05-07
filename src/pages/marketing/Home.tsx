import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { ThreeReasonsSection } from "@/components/marketing/home/ThreeReasonsSection";
import { GuideSection } from "@/components/marketing/home/GuideSection";
import { FAQSection } from "@/components/marketing/home/FAQSection";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";
import { SectionDivider } from "@/components/marketing/home/SectionDivider";
import { FourMovesStrip } from "@/components/marketing/os/FourMovesStrip";
import { ArchitectureTeaser } from "@/components/marketing/home/ArchitectureTeaser";

export default function HomePage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <FourMovesStrip />
      <SectionDivider />
      <ArchitectureTeaser />
      <SectionDivider />
      <ThreeReasonsSection />
      <GuideSection />
      <FAQSection />
      <BetaCTASection />
    </MarketingLayout>
  );
}
