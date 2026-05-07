import type { ReactNode } from "react";

export type IndustryKey =
  | "generic"
  | "pharma"
  | "banking"
  | "space-defense"
  | "automotive"
  | "aec"
  | "professional-services"
  | "gtm";

export type IndustryLexicon = {
  key: IndustryKey;
  label: string;          // tab label
  short: string;          // 2-3 letters for compact tab
  href: string;           // /industries/<slug>
  // diagram label overrides
  sourceSystems: { title: string; sub: string; items: string[] };
  connectedTools: { title: string; sub: string; items: string[] };
  nativeSurfaces: { sub: string };
  judgmentCore: { systemic: string; artifacts: string };
  // flip card
  scenario: { front: string; backOutcome: string; backDetail: string };
};

export const INDUSTRIES: IndustryLexicon[] = [
  {
    key: "generic",
    label: "Generic view",
    short: "All",
    href: "/industries",
    sourceSystems: {
      title: "Your systems of record",
      sub: "Drive, ERP, databases, the docs your business actually runs on. Read in for context, written back when work changes them.",
      items: ["Drive / SharePoint", "Databases", "Documents", "Email & chat", "Senior interviews"],
    },
    connectedTools: {
      title: "Your AI tools",
      sub: "Copilot, Glean, ChatGPT, vendor RAG. Connected so they answer in your standards instead of generic training data.",
      items: ["Microsoft Copilot", "Glean", "Vendor RAG", "Notion AI"],
    },
    nativeSurfaces: {
      sub: "Where work happens. Guided work, knowledge capture, and live oversight in one place. Your AI agents run inside, against the right governed standard.",
    },
    judgmentCore: {
      systemic: "How your company decides. Rules, playbooks, mandates.",
      artifacts: "What your company produces. Every output, kept in sync everywhere it lives.",
    },
    scenario: {
      front: "A real moment in any team",
      backOutcome: "Hours instead of days. Same standard everywhere.",
      backDetail: "A new mandate ships from leadership. The Decision Standard updates. Every Workbook, every connected AI tool, every dependent artifact reflects it the same day.",
    },
  },
  {
    key: "pharma",
    label: "Pharma & Life Sciences",
    short: "Rx",
    href: "/industries/regulated",
    sourceSystems: {
      title: "Your regulated estate",
      sub: "Veeva, LIMS, eTMF, SharePoint quality. Read in for context. Governed updates written back so the canonical record stays current.",
      items: ["Veeva Vault", "LIMS / ELN", "eTMF", "Quality SharePoint", "SME interviews"],
    },
    connectedTools: {
      title: "Your AI tools",
      sub: "Copilot, NesGPT, Veeva AI. They inherit your SOPs, GxP constraints, and CAPA history instead of inventing answers.",
      items: ["Microsoft Copilot", "Veeva AI", "NesGPT", "ChatGPT Enterprise"],
    },
    nativeSurfaces: {
      sub: "Where regulated work happens. Deviation handling, batch review, dossier prep. AI runs inside, with GxP enforced at the standard, not the operator.",
    },
    judgmentCore: {
      systemic: "SOPs, CAPAs, quality mandates, GxP constraints. How your quality system actually decides.",
      artifacts: "Batch records, deviations, CAPA reports, dossier sections. Synced across Veeva, LIMS, and the work surface.",
    },
    scenario: {
      front: "A deviation hits the floor at 14:00",
      backOutcome: "Approved release in 4 hours, not 3 days.",
      backDetail: "Operator opens a Workbook. The SOP, the CAPA history, the relevant guidance bundle is already loaded. AI drafts the deviation report. QA reviews. Veeva, LIMS, and eTMF all reflect the closure the same shift.",
    },
  },
  {
    key: "banking",
    label: "Banking & Insurance",
    short: "Fin",
    href: "/industries/banking",
    sourceSystems: {
      title: "Your regulated data estate",
      sub: "Core banking, risk warehouses, policy libraries, customer files. Read in. Governed outputs written back as records.",
      items: ["Core banking", "Risk warehouse", "Policy library", "CRM", "Email & calls"],
    },
    connectedTools: {
      title: "Your AI tools",
      sub: "Copilot, vendor risk-AI, internal copilots. They inherit your risk appetite and policy stack instead of guessing.",
      items: ["Microsoft Copilot", "Vendor risk-AI", "Internal copilots", "Notion AI"],
    },
    nativeSurfaces: {
      sub: "Where credit, KYC, and risk decisions get made. AI runs inside, with policy enforced as a runtime check, not a checklist.",
    },
    judgmentCore: {
      systemic: "Credit policy, risk appetite, KYC rules, regulatory mandates. How your bank actually decides.",
      artifacts: "Credit memos, KYC files, risk reports, regulator submissions. Synced everywhere they live.",
    },
    scenario: {
      front: "A complex credit case lands Monday morning",
      backOutcome: "Memo drafted same day, fully traceable.",
      backDetail: "Analyst opens a Workbook. Policy bundle, comparable cases, and risk constraints are loaded. AI drafts the memo. Risk reviews. The decision and its rationale are recorded against the policy version that produced it.",
    },
  },
  {
    key: "space-defense",
    label: "Space & Defense",
    short: "S&D",
    href: "/industries/space-defense",
    sourceSystems: {
      title: "Your engineering estate",
      sub: "PLM, requirements, mission docs, supplier files. Read in. Updates written back so the canonical record stays current.",
      items: ["PLM / requirements", "Mission docs", "Supplier files", "SharePoint", "SME interviews"],
    },
    connectedTools: {
      title: "Your AI tools",
      sub: "Copilot, vendor engineering-AI, internal assistants. They inherit your mission constraints and IP boundary.",
      items: ["Microsoft Copilot", "Vendor eng-AI", "Internal assistants", "ChatGPT Enterprise"],
    },
    nativeSurfaces: {
      sub: "Where mission-critical work happens. Requirements, reviews, anomaly response. AI runs inside, with mission rules and IP boundaries enforced.",
    },
    judgmentCore: {
      systemic: "Mission rules, certification standards, supplier mandates, IP boundaries.",
      artifacts: "Requirements, review packs, anomaly reports, certification dossiers. Synced across PLM and your stack.",
    },
    scenario: {
      front: "Anomaly during integration test",
      backOutcome: "Root cause and corrective action in one shift.",
      backDetail: "Engineer opens a Workbook. Anomaly history, mission constraints, supplier specs are loaded. AI drafts the report. Lead reviews. PLM, requirements, and the mission file all reflect the closure.",
    },
  },
  {
    key: "automotive",
    label: "Automotive",
    short: "Auto",
    href: "/industries/automotive",
    sourceSystems: {
      title: "Your engineering & ops estate",
      sub: "PLM, MES, supplier portals, homologation files. Read in. Updates written back to the canonical record.",
      items: ["PLM", "MES / quality", "Supplier portal", "Homologation", "SME interviews"],
    },
    connectedTools: {
      title: "Your AI tools",
      sub: "Copilot, vendor engineering-AI, internal copilots. They inherit your engineering standards and supplier rules.",
      items: ["Microsoft Copilot", "Vendor eng-AI", "Internal copilots", "ChatGPT Enterprise"],
    },
    nativeSurfaces: {
      sub: "Where program and quality decisions get made. AI runs inside, against the right engineering standard.",
    },
    judgmentCore: {
      systemic: "Engineering standards, supplier rules, homologation mandates, program governance.",
      artifacts: "Specs, change requests, supplier briefs, homologation docs. Synced across PLM, MES, and your stack.",
    },
    scenario: {
      front: "Supplier proposes a spec change late in program",
      backOutcome: "Impact assessed and decided in hours.",
      backDetail: "Engineer opens a Workbook. The impacted requirements, the homologation constraints, the supplier history are loaded. AI drafts impact and decision memo. The change propagates to PLM and the supplier brief.",
    },
  },
  {
    key: "aec",
    label: "AEC & Construction",
    short: "AEC",
    href: "/industries/aec",
    sourceSystems: {
      title: "Your project estate",
      sub: "BIM, project drives, contracts, RFIs, schedules. Read in. Governed updates written back.",
      items: ["BIM models", "Project drive", "Contracts", "RFIs / submittals", "SME interviews"],
    },
    connectedTools: {
      title: "Your AI tools",
      sub: "Copilot, vendor design-AI, internal assistants. They inherit your standards and contract terms.",
      items: ["Microsoft Copilot", "Vendor design-AI", "Internal copilots", "ChatGPT Enterprise"],
    },
    nativeSurfaces: {
      sub: "Where project decisions get made. RFIs, change orders, design reviews. AI runs inside against the live standard.",
    },
    judgmentCore: {
      systemic: "Design standards, contract clauses, code mandates, project governance.",
      artifacts: "RFIs, change orders, submittals, review packs. Synced across BIM and the project drive.",
    },
    scenario: {
      front: "RFI lands from site at 09:00",
      backOutcome: "Answered same day, contract-aware.",
      backDetail: "PM opens a Workbook. Drawing pack, contract clauses, prior RFIs are loaded. AI drafts the response. Lead reviews. BIM and project drive reflect the answer.",
    },
  },
  {
    key: "professional-services",
    label: "Professional Services",
    short: "PS",
    href: "/industries/professional-services",
    sourceSystems: {
      title: "Your engagement estate",
      sub: "Drive, CRM, time, prior decks and methods. Read in. Updates written back to canonical artifacts.",
      items: ["Drive / SharePoint", "CRM", "Methods library", "Time & billing", "Senior interviews"],
    },
    connectedTools: {
      title: "Your AI tools",
      sub: "Copilot, ChatGPT, internal assistants. They inherit your method, your IP, your client context.",
      items: ["Microsoft Copilot", "ChatGPT Enterprise", "Internal copilots", "Notion AI"],
    },
    nativeSurfaces: {
      sub: "Where engagement work happens. Proposals, analyses, deliverables. AI runs inside against your method.",
    },
    judgmentCore: {
      systemic: "Methods, frameworks, quality standards, the IP that makes the firm.",
      artifacts: "Proposals, analyses, decks, deliverables. Synced across drive, CRM, and the engagement room.",
    },
    scenario: {
      front: "New engagement kicks off Monday",
      backOutcome: "Senior-quality first draft on day one.",
      backDetail: "Team opens a Workbook. Method bundle, comparable engagements, client context are loaded. AI drafts to the firm's standard. Partner reviews. Drive and CRM reflect the live artifact.",
    },
  },
  {
    key: "gtm",
    label: "GTM & Sales",
    short: "GTM",
    href: "/industries/gtm",
    sourceSystems: {
      title: "Your revenue estate",
      sub: "CRM, call recordings, decks, product docs, support tickets. Read in. Governed updates written back.",
      items: ["CRM", "Call recordings", "Decks & collateral", "Product docs", "Support history"],
    },
    connectedTools: {
      title: "Your AI tools",
      sub: "Copilot, Gong/Clari AI, sales copilots. They inherit your ICP, your messaging, your playbook.",
      items: ["Microsoft Copilot", "Revenue-AI", "Sales copilots", "ChatGPT Enterprise"],
    },
    nativeSurfaces: {
      sub: "Where pipeline gets worked. Account plans, prep, follow-ups. AI runs inside against the live playbook.",
    },
    judgmentCore: {
      systemic: "ICP, qualification rules, messaging, win-loss patterns, the live sales playbook.",
      artifacts: "Account plans, prep notes, follow-ups, proposals. Synced across CRM and the rep workspace.",
    },
    scenario: {
      front: "Big account meeting tomorrow at 10:00",
      backOutcome: "Senior-rep prep in 15 minutes, not 2 hours.",
      backDetail: "Rep opens a Workbook. Account history, the live playbook, the latest messaging are loaded. AI drafts the prep brief and follow-ups. CRM updates after the call.",
    },
  },
];

export const INDUSTRY_BY_KEY: Record<IndustryKey, IndustryLexicon> = INDUSTRIES.reduce(
  (acc, ind) => { acc[ind.key] = ind; return acc; },
  {} as Record<IndustryKey, IndustryLexicon>,
);
