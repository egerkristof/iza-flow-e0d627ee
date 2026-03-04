import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/home/HeroSection";
import { TrustBar } from "@/components/marketing/home/TrustBar";
import { ProblemSection } from "@/components/marketing/home/ProblemSection";
import { LizaLoopSection } from "@/components/marketing/home/LizaLoopSection";
import { TransformationSection } from "@/components/marketing/home/TransformationSection";
import { GettingStartedStrip } from "@/components/marketing/home/GettingStartedStrip";
import { TestimonialSection } from "@/components/marketing/home/TestimonialSection";
import { GuideSection } from "@/components/marketing/home/GuideSection";
import { LearnMoreSection } from "@/components/marketing/home/LearnMoreSection";
import { BetaCTASection } from "@/components/marketing/home/BetaCTASection";
import { SectionDivider } from "@/components/marketing/home/SectionDivider";

export default function HomePage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <TrustBar />
      <SectionDivider />
      <ProblemSection />
      <SectionDivider />
      <LizaLoopSection />
      <SectionDivider />
      <TransformationSection />
      <SectionDivider />
      <GettingStartedStrip />
      <SectionDivider />
      <TestimonialSection />
      <SectionDivider />
      <GuideSection />
      <SectionDivider />
      <LearnMoreSection />
      <SectionDivider />
      <BetaCTASection />
    </MarketingLayout>
  );
}
