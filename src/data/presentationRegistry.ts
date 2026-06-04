import { createElement, type ComponentType } from "react";
import BridgeDeck from "@/pages/BridgeDeck";
import TechDDDeck from "@/pages/TechDDDeck";
import ImpactDeck from "@/pages/ImpactDeck";
import { ImpactGate } from "@/components/ImpactGate";
import HoldingDeck from "@/pages/HoldingDeck";
import { HoldingGate } from "@/components/HoldingGate";
import FactoryDeck from "@/pages/FactoryDeck";
import SeedPitchDeck from "@/pages/SeedPitchDeck";
import SeedPitchDeckSkeptic from "@/pages/SeedPitchDeckSkeptic";
import SeedPitchDeckLens from "@/pages/SeedPitchDeckLens";
import SeedPitchDeckInvestor from "@/pages/SeedPitchDeckInvestor";
import SalesDeckAIAdoption from "@/pages/SalesDeckAIAdoption";
import InsuranceDeck from "@/pages/InsuranceDeck";
import InsuranceUnderwritingDeck from "@/pages/InsuranceUnderwritingDeck";
import ConsultingDeck from "@/pages/ConsultingDeck";
import ConsultingTrainingDeck from "@/pages/ConsultingTrainingDeck";
import PharmaPitchDeck from "@/pages/PharmaPitchDeck";
import LinkedInImageCard from "@/pages/LinkedInImageCard";
import LifecycleInvestorDeck from "@/pages/LifecycleInvestorDeck";
import LifecycleInvestorDeckV2 from "@/pages/LifecycleInvestorDeckV2";
import LifecycleInvestorDeckV3 from "@/pages/LifecycleInvestorDeckV3";
import LCVInvestorDeck from "@/pages/LCVInvestorDeck";
import AuditOffer from "@/pages/offers/AuditOffer";
import AECInvestorDeck from "@/pages/AECInvestorDeck";
import PharmaInvestorDeck from "@/pages/PharmaInvestorDeck";
import SpaceDeck from "@/pages/SpaceDeck";
import SpaceBrief from "@/pages/SpaceBrief";
import SatcomDeck from "@/pages/SatcomDeck";
import SatcomBrief from "@/pages/SatcomBrief";
import MADeck from "@/pages/MADeck";
import StrategyOfficeDeck from "@/pages/StrategyOfficeDeck";
import PharmaBrief from "@/pages/PharmaBrief";
import BankingSalesDeck from "@/pages/BankingSalesDeck";
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
    sourcePath: "src/pages/SeedPitchDeckInvestor.tsx",
    description: "Primary investor deck. Airbnb-simple spine (one idea per slide, big type) with selective Market vs Operator lens. Designed for the cold investor who is tired of AI hype and has seen every chat wrapper.",
    component: SeedPitchDeckInvestor,
    showInAdmin: true,
  },
  {
    id: "sales-ai-adoption",
    title: "Sales Deck · Head of AI Adoption",
    path: "/getstarted",
    sourcePath: "src/pages/SalesDeckAIAdoption.tsx",
    description: "Sales-side mirror of /investor for the Head of AI Adoption persona (also VP/Director of AI, CAIO, Head of AI Transformation). Same lens grammar (left = what your rollout looks like today, right = what a rollout that compounds looks like) applied to the operator's reality: flat Copilot usage, shadow ChatGPT, pilot purgatory, board ROI pressure, IT-build temptation. Closes on a 30-day install with one workflow as the buying motion.",
    component: SalesDeckAIAdoption,
    showInAdmin: true,
  },
  {
    id: "investor-lifecycle-v2",
    title: "Investor Deck (Lifecycle V2 / Archive)",
    path: "/investor-lifecycle-v2",
    sourcePath: "src/pages/LifecycleInvestorDeckV2.tsx",
    description: "Previous primary investor deck (Lifecycle V2) — archived for reference. The new primary deck lives at /investor.",
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
    id: "investor-v3",
    title: "Investor Deck V3 (Draft)",
    path: "/investor-v3",
    sourcePath: "src/pages/LifecycleInvestorDeckV3.tsx",
    description: "Draft V3 spine. Operator-moment thesis (slides 2-3), Two-Shifts Why Now (4), Decision-class metering (11), Knowledge Sovereignty (16). Lifts visual language from /impact and /tech-dd.",
    component: LifecycleInvestorDeckV3,
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
    id: "sales-banking",
    title: "Banking Sales Deck",
    path: "/sales-banking",
    sourcePath: "src/pages/BankingSalesDeck.tsx",
    description: "Lean StoryBrand sales deck for retail banking. Same grammar as /get-started and /factory, retail-banking flavor. 14 slides: cover, reality, the job, category (Decision Layer), funnel, what we install, where it plugs in, 90-day plan, proof, buying committee, pricing & procurement, alternatives, risk-reversed pilot, close. Persona: Head of AI / Digital / Compliance at a retail bank.",
    component: BankingSalesDeck,
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
    id: "strategy-office",
    title: "Strategy Office Sales Deck",
    path: "/strategy-office",
    sourcePath: "src/pages/StrategyOfficeDeck.tsx",
    description: "Sales deck for Strategy / Corp Dev / Business Development teams. Problem-led 12-slide arc (rewritten from scratch, not redressed from M&A): leads with the human reality of the strategy team (every brief from zero, busy experts, lost prior work, senior memory walks out, Friday board demand), names structural reasons it stays broken, then introduces LIZA as the memory + routing layer (secondary, not the headline). Ends on a 30-day pilot with measured deltas (time-to-brief, expert response, reuse rate). Function page lives at /industries/strategy-office.",
    component: StrategyOfficeDeck,
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
    id: "investor-bridge",
    title: "€200K Bridge Deck (Traction to Scale)",
    path: "/investor-bridge",
    sourcePath: "src/pages/BridgeDeck.tsx",
    description: "5-slide €200K bridge round deck for $10K–$30K check writers (micro-funds, operator syndicates, angels). Narrative: AACE v3.1 is live with 4 paid enterprise clients (AEC, Pharma, Cyber, Consulting); growth gated by high-touch Guided Kickstart; €200K funds the Self-Serve Wizard to remove the human bottleneck; vertical wedge on Professional Services with a Q4 milestone of 100% self-serve ARR growth — teeing up a premium Seed/Series A markup.",
    component: BridgeDeck,
    showInAdmin: true,
  },
  {
    id: "tech-dd",
    title: "Tech Due Diligence Deck",
    path: "/tech-dd",
    sourcePath: "src/pages/TechDDDeck.tsx",
    description: "Technical deep-dive deck for investor TDD teams. Three-phase arc: (1) Paradigm. (2) Architecture (LIZA OS map, AACE v3.1 four-step loop with State-Locking, artifact propagation, Unified Rationale Log). (3) Commercial + Synthesis (Pricing Inversion, value-based metering, Augmentation Engine). Reused source-of-truth for /factory deck slides.",
    component: TechDDDeck,
    showInAdmin: true,
  },
  {
    id: "factory",
    title: "Factory Deck (Production-System Spine)",
    path: "/factory",
    sourcePath: "src/pages/FactoryDeck.tsx",
    description: "18-slide seed-round investor deck built on the production-system spine. \"AI is the machine. LIZA is the production system.\" Leads with the math ($0.40 per governed decision, 95% platform GM, €23 displaced labour cost). Toyota referenced once on slide 02; the rest of the deck demonstrates the factory floor without naming it. Absorbs the strongest material from /tech-dd and /impact and adds: 30-day install with metered Day 31 + post-Seed self-serve PLG resolution, AEC hero vertical (Nemetschek-scale partner) with the pattern-repeats grid, team slide grounded in 15+ years of data and AI architecture in production, and the €2M Seed ask with milestone-to-Series-A logic. AACE locked to v3.1.",
    component: FactoryDeck,
    showInAdmin: true,
  },
  {
    id: "seed-pitch",
    title: "Seed Pitch (Airbnb-style)",
    path: "/seed",
    sourcePath: "src/pages/SeedPitchDeck.tsx",
    description: "14-slide lean seed deck modelled on the early Airbnb deck. One idea per slide, huge typography, no prerequisites. Built for an investor opening the file cold without the founder in the room. Compresses the Factory Deck narrative into Cover, Problem, Solution, Why Now, Validation, Market, Product, Business Model, Adoption, Competition, Edge, Team, Ask, Close.",
    component: SeedPitchDeck,
    showInAdmin: true,
  },
  {
    id: "seed-skeptic",
    title: "Seed Pitch · Skeptic Edition",
    path: "/seed-skeptic",
    sourcePath: "src/pages/SeedPitchDeckSkeptic.tsx",
    description: "10-slide defensive seed deck built for the sharpest objection in the room: 'anyone builds this in a weekend' and 'Anthropic ships this next quarter'. Names both objections on slide 02 and spends the rest of the deck dismantling them: weekend-demo vs enterprise-grade table, four non-code assets that compound (vertical standards corpus, receipt &amp; lineage graph, drift loop, regulator-tested install), four structural reasons foundation labs do not build organizational governance (business model, incentive, trust, surface area), the two-lane diagram (lab lane vs governance lane), buyer veto quotes from regulated CTOs, production proof (127 standards, 3.4K governed decisions/month, 62% time-to-spec, 0 audit failures), €2M ask broken into corpus / self-serve / partner channel, and a close that draws the line: if you believe Claude will own organizational governance, do not invest.",
    component: SeedPitchDeckSkeptic,
    showInAdmin: true,
  },
  {
    id: "seed-lens",
    title: "Seed Pitch · Lens Edition",
    path: "/seed-lens",
    sourcePath: "src/pages/SeedPitchDeckLens.tsx",
    description: "13-slide seed deck built around one repeating frame: how the venture market grades each topic (red, dim, narrow) vs. what regulated operators are actually buying (green, bold, wide). Cover establishes the two lenses, slide 02 (The Split) names the dichotomy explicitly, slide 03 explains why it exists via the context explosion, then slides 04-12 apply the exact same split to Problem, Solution unit, Why now, Weekend objection, Lab objection, Business model, Proof, Moat and the €2M Ask. Slide 13 collapses both lenses into one statement. Designed for the cold investor who has never met the founder and is tired of weekend AI projects.",
    component: SeedPitchDeckLens,
    showInAdmin: true,
  },
  {
    id: "impact",
    title: "Impact Thesis Deck",
    path: "/impact",
    sourcePath: "src/pages/ImpactDeck.tsx",
    description: "11-slide internal impact-investing brief. Companion to /tech-dd. Frames the core question 'why keep humans in the age of AI', applies the IMP five dimensions (What/Who/HowMuch/Contribution/Risk), names the Portable Context Bundle as the unit of impact, lays out an explicit Theory of Change and a per-bundle measurement stack (outputs/outcomes/lagging impact), maps to WEF Core Skills 2030 and four UN SDG sub-targets, runs a counterfactual/additionality scan vs. big-tech AI, employer Copilots, personal memory tools, and public reskilling, then closes on a two-door decision: capital against the IMP scorecard, or strategic stake to co-define the open bundle schema.",
    component: () => createElement(ImpactGate, null, createElement(ImpactDeck)),
    showInAdmin: true,
  },
  {
    id: "holding",
    title: "Holding Thesis · Council Brief",
    path: "/holding",
    sourcePath: "src/pages/HoldingDeck.tsx",
    description: "Password-gated, no-bot council working brief on the LIZA Group holding thesis. Names the primitive (governed just-in-time operator moments — knowledge + data governance + token efficiency + lineage as one envelope), the foundry that manufactures it, the speedboat instantiations in markets enterprises can't serve, the compounding cross-vertical pattern library, real estate as worked example (dormant-buyer reactivation, 78-140M HUF ARR per agency), the L0/L1/L2 holding architecture, and an explicit position on what stays on vs. off the current investor deck. Closes with five decisions the council needs to make.",
    component: () => createElement(HoldingGate, null, createElement(HoldingDeck)),
    showInAdmin: true,
  },
  {
    id: "insurance",
    title: "Insurance Executive Brief (UAE / GCC)",
    path: "/insurance",
    sourcePath: "src/pages/InsuranceDeck.tsx",
    description: "10-slide draft executive brief for a leading Middle East insurance group. Four-section arc (Pull / Pivot / Push / Close) framed around CBUAE 2025/2026 mandates. Covers UAE Insurance Paradox, Digital Insider threat, Context Gap Tax, cognitive infrastructure iceberg, AACE v3.1 compliance loop, value-based metering (1x/5x/25x), three capability stories (Commercial P&C / High-Volume Claims / Actuarial Rehearsal) covering the likely lines of business, then a 90-Second Diagnostic + 30-Day Guided Kickstart wedge, closing on two doors (customer / design partner). Carries DRAFT and HIGHLY CONFIDENTIAL badges on every slide.",
    component: InsuranceDeck,
    showInAdmin: true,
  },
  {
    id: "insurance-uw",
    title: "Insurance Agentic Underwriting Brief (UAE · Proxy edition)",
    path: "/insurance-uw",
    sourcePath: "src/pages/InsuranceUnderwritingDeck.tsx",
    description: "7-slide editable working brief for a UAE carrier challenging a $1.2M internal agentic-underwriting build. Designed to travel through a design-proxy partner (proxy is the design + delivery authority; LIZA stays underneath as the execution layer). Side-by-side SME Commercial Property + Motor framing. Arc: cover, the underwriting trap (5 steps x 2 LOBs), why the internal build fails ($400k+$350k+$250k+$200k breakdown + year-2 maintenance trap), the agentic loop with the senior-underwriter feedback edge, who owns what (Proxy / LIZA / Carrier boundary), references carried from /insurance S9 (Generali, Prudential, MSIG), 2-week shape ending at the CRO readout. Strips all LIZA jargon (no AACE, no Unified Rationale Log as product, no Zero Hallucination). DRAFT + HIGHLY CONFIDENTIAL badges on every slide.",
    component: InsuranceUnderwritingDeck,
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
