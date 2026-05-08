import type { ComponentType } from "react";
import SeedInvestorDeck from "@/pages/SeedInvestorDeck";
import ConsultingDeck from "@/pages/ConsultingDeck";
import ConsultingTrainingDeck from "@/pages/ConsultingTrainingDeck";
import PharmaPitchDeck from "@/pages/PharmaPitchDeck";
import LinkedInImageCard from "@/pages/LinkedInImageCard";
import LifecycleInvestorDeck from "@/pages/LifecycleInvestorDeck";
import LifecycleInvestorDeckV2 from "@/pages/LifecycleInvestorDeckV2";
import LCVInvestorDeck from "@/pages/LCVInvestorDeck";
import AuditOffer from "@/pages/offers/AuditOffer";
import AECInvestorDeck from "@/pages/AECInvestorDeck";
import PharmaInvestorDeck from "@/pages/PharmaInvestorDeck";
import SpaceDeck from "@/pages/SpaceDeck";
import SpaceBrief from "@/pages/SpaceBrief";
import SatcomDeck from "@/pages/SatcomDeck";
import SatcomBrief from "@/pages/SatcomBrief";
import MADeck from "@/pages/MADeck";
import PharmaBrief from "@/pages/PharmaBrief";
import BankingInvestorDeck from "@/pages/BankingInvestorDeck";
import AutomotiveInvestorDeck from "@/pages/AutomotiveInvestorDeck";
import SpaceDefenseHoldingsDeck from "@/pages/SpaceDefenseHoldingsDeck";
import SpaceDefenseHoldingsBrief from "@/pages/SpaceDefenseHoldingsBrief";
import ResearchBrief from "@/pages/ResearchBrief";
import ResearchDeck from "@/pages/ResearchDeck";

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
    sourcePath: "src/pages/LifecycleInvestorDeckV2.tsx",
    description: "Primary investor presentation (Seed Round). Context Gap narrative arc — promoted from V2.",
    component: LifecycleInvestorDeckV2,
    showInAdmin: true,
  },
  {
    id: "investor-classic",
    title: "Investor Deck (Classic / Archive)",
    path: "/investor-classic",
    sourcePath: "src/pages/LifecycleInvestorDeck.tsx",
    description: "Previous primary investor deck — archived for reference. The new primary deck lives at /investor.",
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
    description: "Life sciences deck for pharma sponsors, CROs, and CMOs. Open-canvas / first-customer framing: become a customer with a 30-day GxP pilot on deviations, CAPA, or CSR sections, then optionally take a strategic stake (€3M strategic minority) to co-define the GxP memory layer. Mirrors the satcom deck's two-door mechanic.",
    component: PharmaInvestorDeck,
    showInAdmin: true,
  },
  {
    id: "investor-banking",
    title: "Banking Investor Deck",
    path: "/investor-banking",
    sourcePath: "src/pages/BankingInvestorDeck.tsx",
    description: "Retail-banking lifecycle deck. Marketing wedge framing for retail-bank marketing leaders (e.g. OTP). 30-day pilot on a marketing workflow → expansion to KYC, complaints, credit, group governance. Two-door CTA: become a customer first, optional strategic stake to co-define the CEE banking reference architecture.",
    component: BankingInvestorDeck,
    showInAdmin: true,
  },
  {
    id: "investor-automotive",
    title: "Automotive R&D Investor Deck (VIE)",
    path: "/investor-automotive",
    sourcePath: "src/pages/AutomotiveInvestorDeck.tsx",
    description: "Generic automotive R&D vertical deck for cross-border Tier-1 R&D centers (HQ + greenfield sites). Wedge: HQ → site engineering onboarding for chassis-control IP and ISO 26262 / ASPICE judgment. Two-door CTA: 30-day onboarding pilot at one R&D team → optional €3M strategic stake to co-define the cross-border engineering reference architecture across HQ and regional R&D sites.",
    component: AutomotiveInvestorDeck,
    showInAdmin: true,
  },
  {
    id: "space-defense-holdings",
    title: "Space & Defence Holdings Deck (Customer + Investor)",
    path: "/space-defense-holdings",
    sourcePath: "src/pages/SpaceDefenseHoldingsDeck.tsx",
    description: "Generic dual-path deck for federated Space & Defence holding companies (Hensoldt, Leonardo, Saab, KNDS, Rheinmetall, 4iG SDT-style portfolios). One context layer across the full programme lifecycle: capture & bid, engineering & qualification, sustainment & ILS. Wedge: post-merger engineering knowledge capture across newly-acquired subsidiaries; NATO AQAP / AS9100 / ISO 27001 / ECSS as executable standards. Two-door CTA: 30-day lifecycle pilot inside one subsidiary, or €3M strategic stake in the platform that scales it across the holding.",
    component: SpaceDefenseHoldingsDeck,
    showInAdmin: true,
  },
  {
    id: "space-defense-holdings-brief",
    title: "Space & Defence Holdings Brief (Mobile + Desktop)",
    path: "/space-defense-holdings-brief",
    sourcePath: "src/pages/SpaceDefenseHoldingsBrief.tsx",
    description: "Responsive 2-minute brief of the Space & Defence Holdings deck. Lifecycle framing (capture, engineering, sustainment), GAO/INCOSE benchmarks, dual customer + investor CTA. Funnels to /space-defense-holdings.",
    component: SpaceDefenseHoldingsBrief,
    showInAdmin: true,
  },
  {
    id: "research-brief",
    title: "Research Brief (Universities & Research Groups)",
    path: "/research-brief",
    sourcePath: "src/pages/ResearchBrief.tsx",
    description: "Responsive 2-minute brief positioning LIZA OS as a Research Memory Layer for PhDs, early-career researchers, and faculty. Reframes literature review as field-mapping (hierarchies and relations between schools, lineages, authors), grounded in relational theory of knowledge (Polanyi, Nonaka/SECI, Csíkszentmihályi flow, neuroscience of social cognition). Augmentation, not automation. Two-door CTA: 30-day pilot inside one research group, or sponsor relationship to co-define the academic standard.",
    component: ResearchBrief,
    showInAdmin: true,
  },
  {
    id: "research-deck",
    title: "Research Concept Deck (Universities & Research Groups)",
    path: "/research-deck",
    sourcePath: "src/pages/ResearchDeck.tsx",
    description: "Full concept deck behind the /research-brief page. 15 slides: personas (PhD, ECR, PI, faculty), the iceberg gap (review vs. field), three-path framing (manual / generative / Research Memory Layer), thesis (relational knowledge, augmentation, flow), competitive landscape (Elicit, Consensus, Scite, ChatGPT/Claude, Zotero/Mendeley, Research Rabbit, Obsidian), 4-layer architecture, SECI as product, Joint Vision (group not solo), semester-long cohort pilot, outcomes, two-door CTA (cohort partner / institutional sponsor).",
    component: ResearchDeck,
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
    id: "ma",
    title: "Corp Dev / M&A Strategic Deck",
    path: "/ma",
    sourcePath: "src/pages/MADeck.tsx",
    description: "Corporate development / M&A variant. Reframed around the actual corp dev workflow (per Fernando, Hispasat): generalist 360° company view, expert routing to internal mission/regulatory/finance teams, and partnership/market memory. Three pillars: 360° Company View, Expert Routing, Market & Partnership Memory. Two-door CTA: 30-day pilot on a live target or sector scan, or strategic stake in the deal-memory layer.",
    component: MADeck,
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
