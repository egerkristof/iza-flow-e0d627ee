import type { ComponentType } from "react";
import InvestorDeck from "@/pages/InvestorDeck";
import SeedInvestorDeck from "@/pages/SeedInvestorDeck";
import ConsultingDeck from "@/pages/ConsultingDeck";
import ConsultingTrainingDeck from "@/pages/ConsultingTrainingDeck";
import PharmaPitchDeck from "@/pages/PharmaPitchDeck";
import LinkedInImageCard from "@/pages/LinkedInImageCard";
import LifecycleInvestorDeck from "@/pages/LifecycleInvestorDeck";
import AuditOffer from "@/pages/offers/AuditOffer";

export type PresentationRoute = {
  id: string;
  title: string;
  path: string;
  description: string;
  component: ComponentType;
  showInAdmin?: boolean;
};

export const presentationRoutes: PresentationRoute[] = [
  {
    id: "investor",
    title: "Investor Deck",
    path: "/investor",
    description: "Primary investor presentation (Seed Round)",
    component: LifecycleInvestorDeck,
    showInAdmin: true,
  },
  {
    id: "investor-archive",
    title: "Investor Deck (Archive)",
    path: "/investor-archive",
    description: "Previous investor deck version",
    component: InvestorDeck,
    showInAdmin: true,
  },
  {
    id: "investor-seed",
    title: "Seed Investor Deck",
    path: "/investor-seed",
    description: "Pre-seed and seed stage deck",
    component: SeedInvestorDeck,
    showInAdmin: true,
  },
  {
    id: "sales",
    title: "Sales Deck",
    path: "/sales",
    description: "Consulting sales presentation",
    component: ConsultingDeck,
    showInAdmin: true,
  },
  {
    id: "transform",
    title: "Training Deck",
    path: "/transform",
    description: "Architecting the AI-native organization",
    component: ConsultingTrainingDeck,
    showInAdmin: true,
  },
  {
    id: "pharma-pitch",
    title: "Pharma Pitch Deck",
    path: "/pharma-pitch",
    description: "Medicine lifecycle management pitch for pharma",
    component: PharmaPitchDeck,
    showInAdmin: true,
  },
  {
    id: "linkedin-card",
    title: "LinkedIn Card",
    path: "/linkedin-card",
    description: "LinkedIn image card generator",
    component: LinkedInImageCard,
    showInAdmin: true,
  },
  {
    id: "offer-audit-15k",
    title: "AI Opportunity Audit (€15k Offer)",
    path: "/offers/audit",
    description: "3-week audit brief for Heads of AI. Web page + downloadable PDF.",
    component: AuditOffer,
    showInAdmin: true,
  },
];

export const adminPresentationItems = presentationRoutes.filter((item) => item.showInAdmin !== false);
