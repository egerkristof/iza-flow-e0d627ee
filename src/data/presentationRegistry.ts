import type { ComponentType } from "react";
import SeedInvestorDeck from "@/pages/SeedInvestorDeck";
import ConsultingDeck from "@/pages/ConsultingDeck";
import ConsultingTrainingDeck from "@/pages/ConsultingTrainingDeck";
import PharmaPitchDeck from "@/pages/PharmaPitchDeck";
import LinkedInImageCard from "@/pages/LinkedInImageCard";
import LifecycleInvestorDeck from "@/pages/LifecycleInvestorDeck";
import LCVInvestorDeck from "@/pages/LCVInvestorDeck";
import AuditOffer from "@/pages/offers/AuditOffer";
import AECInvestorDeck from "@/pages/AECInvestorDeck";

export type PresentationRoute = {
  id: string;
  title: string;
  path: string;
  sourcePath: string;
  description: string;
  component: ComponentType;
  showInAdmin?: boolean;
};

export const presentationRoutes: PresentationRoute[] = [
  {
    id: "investor",
    title: "Investor Deck",
    path: "/investor",
    sourcePath: "src/pages/LifecycleInvestorDeck.tsx",
    description: "Primary investor presentation (Seed Round)",
    component: LifecycleInvestorDeck,
    showInAdmin: true,
  },
  {
    id: "investor-aec",
    title: "AEC Investor Deck (Nemetschek)",
    path: "/investor-aec",
    sourcePath: "src/pages/AECInvestorDeck.tsx",
    description: "AEC-focused variant for Nemetschek Group strategic round + partnership",
    component: AECInvestorDeck,
    showInAdmin: true,
  },
  {
    id: "investor-lcv",
    title: "LCV Investor Deck",
    path: "/investor-lcv",
    sourcePath: "src/pages/LCVInvestorDeck.tsx",
    description: "PE-focused investor variant for LCV Partners centered on audits, operational continuity, and post-merger integration",
    component: LCVInvestorDeck,
    showInAdmin: true,
  },
  {
    id: "investor-seed",
    title: "Seed Investor Deck",
    path: "/investor-seed",
    sourcePath: "src/pages/SeedInvestorDeck.tsx",
    description: "Pre-seed and seed stage deck",
    component: SeedInvestorDeck,
    showInAdmin: true,
  },
  {
    id: "sales",
    title: "Sales Deck",
    path: "/sales",
    sourcePath: "src/pages/ConsultingDeck.tsx",
    description: "Consulting sales presentation",
    component: ConsultingDeck,
    showInAdmin: true,
  },
  {
    id: "transform",
    title: "Training Deck",
    path: "/transform",
    sourcePath: "src/pages/ConsultingTrainingDeck.tsx",
    description: "Architecting the AI-native organization",
    component: ConsultingTrainingDeck,
    showInAdmin: true,
  },
  {
    id: "pharma-pitch",
    title: "Pharma Pitch Deck",
    path: "/pharma-pitch",
    sourcePath: "src/pages/PharmaPitchDeck.tsx",
    description: "Medicine lifecycle management pitch for pharma",
    component: PharmaPitchDeck,
    showInAdmin: true,
  },
  {
    id: "linkedin-card",
    title: "LinkedIn Card",
    path: "/linkedin-card",
    sourcePath: "src/pages/LinkedInImageCard.tsx",
    description: "LinkedIn image card generator",
    component: LinkedInImageCard,
    showInAdmin: true,
  },
  {
    id: "offer-audit-15k",
    title: "AI Opportunity Audit (€15k Offer)",
    path: "/offers/audit",
    sourcePath: "src/pages/offers/AuditOffer.tsx",
    description: "3-week audit brief for Heads of AI. Web page + downloadable PDF.",
    component: AuditOffer,
    showInAdmin: true,
  },
];

export const adminPresentationItems = presentationRoutes.filter((item) => item.showInAdmin !== false);
