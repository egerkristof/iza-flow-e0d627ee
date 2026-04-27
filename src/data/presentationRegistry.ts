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
import PharmaInvestorDeck from "@/pages/PharmaInvestorDeck";
import SpaceDeck from "@/pages/SpaceDeck";
import SpaceBrief from "@/pages/SpaceBrief";
import SatcomDeck from "@/pages/SatcomDeck";
import SatcomBrief from "@/pages/SatcomBrief";
import PharmaBrief from "@/pages/PharmaBrief";

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
    id: "investor-pharma",
    title: "Pharma Investor Deck",
    path: "/investor-pharma",
    sourcePath: "src/pages/PharmaInvestorDeck.tsx",
    description: "Life sciences variant for pharma sponsors and CROs centered on GxP-native deviation, CAPA, and CSR memory",
    component: PharmaInvestorDeck,
    showInAdmin: true,
  },
  {
    id: "space",
    title: "Space Strategic Deck",
    path: "/space",
    sourcePath: "src/pages/SpaceDeck.tsx",
    description: "Space-vertical strategic deck for NewSpace primes and satellite integrators. Pilot-first, sovereign-space framing.",
    component: SpaceDeck,
    showInAdmin: true,
  },
  {
    id: "space-brief",
    title: "Space Brief (Mobile + Desktop)",
    path: "/space-brief",
    sourcePath: "src/pages/SpaceBrief.tsx",
    description: "Responsive short-form brief of the Space deck. Leads with sector-specific cost overruns and heritage-knowledge loss, reframes AI as a horizontal layer on a vertical knowledge problem. Single CTA to the full deck.",
    component: SpaceBrief,
    showInAdmin: true,
  },
  {
    id: "satcom",
    title: "Satcom Operator Strategic Deck",
    path: "/satcom",
    sourcePath: "src/pages/SatcomDeck.tsx",
    description: "Satellite-operator variant of the Space deck. Reframes the Mission Memory Layer as the Operator Memory Layer for fleet operations, procurement governance, and spectrum continuity. Open-canvas / first-customer angle for operators like Hispasat, SES, Eutelsat, Inmarsat.",
    component: SatcomDeck,
    showInAdmin: true,
  },
  {
    id: "satcom-brief",
    title: "Satcom Brief (Mobile + Desktop)",
    path: "/satcom-brief",
    sourcePath: "src/pages/SatcomBrief.tsx",
    description: "Responsive short-form brief of the Satcom deck. Leads with operator-specific risks (fleet memory, procurement learning loop, SLA exposure) and the open-canvas hook. Single CTA to the full deck.",
    component: SatcomBrief,
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
    description: "Medicine lifecycle pitch for pharma. Open-canvas / first-customer framing: become a customer with a 30-day GxP pilot, then optionally co-define the GxP memory standard as a design partner with a strategic stake. Mirrors the satcom deck's two-door mechanic.",
    component: PharmaPitchDeck,
    showInAdmin: true,
  },
  {
    id: "pharma-brief",
    title: "Pharma Brief (Mobile + Desktop)",
    path: "/pharma-brief",
    sourcePath: "src/pages/PharmaBrief.tsx",
    description: "Responsive short-form brief that funnels into the Pharma Investor Deck. Leads with sector-specific cost of uncodified GxP judgment (repeat deviations, $2.6B per drug, 10% Phase I→approval) and reframes AI as a horizontal layer on a vertical knowledge problem. Single CTA to /investor-pharma.",
    component: PharmaBrief,
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
