import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { ThreeReasonsSection } from "@/components/marketing/home/ThreeReasonsSection";
import { BuyerRouterFAQ } from "@/components/marketing/home/BuyerRouterFAQ";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";
import { SectionDivider } from "@/components/marketing/home/SectionDivider";
import { TrustStrip } from "@/components/marketing/home/TrustStrip";
import { ThreeBruisesStrip } from "@/components/marketing/home/ThreeBruisesStrip";
import { PersonaLensExpander } from "@/components/marketing/home/PersonaLensExpander";
import { ProductMomentStrip } from "@/components/marketing/home/ProductMomentStrip";
import { WhoItsForStrip } from "@/components/marketing/home/WhoItsForStrip";

/* Homepage = 4 acts. Hook -> Story -> Proof -> Ask. Anatomy lives on /os. */
export default function HomePage() {
  return (
    <MarketingLayout>
      {/* 1. Hook */}
      <HeroSection />
      <TrustStrip />
      {/* Operator hook: 3 steps to your playbook */}
      <ProductMomentStrip />
      <SectionDivider />
      {/* 2. Story */}
      <ThreeBruisesStrip />
      <WhoItsForStrip />
      <SectionDivider />
      {/* 3. Proof */}
      <ThreeReasonsSection />
      <PersonaLensExpander />
      {/* 4. Ask */}
      <BuyerRouterFAQ />
      <BetaCTASection />
    </MarketingLayout>
  );
}
