import {
  Target,
  BookOpen,
  ShieldCheck,
  Database,
  ListChecks,
  DollarSign,
  Lock,
  type LucideIcon,
} from "lucide-react";

// ─── AACE pillars rendered in the right rail ──────────────────────────────
// We map the 5 AACE categories (Directive, Knowledge, Procedure, Playbook,
// Preference) onto a business-leader-friendly vocabulary. Two extra cards
// (Unit Economics, Access Scope) are intentionally NOT covered by this
// lightweight builder — they're marked "Define in LIZA" so the user sees
// where the platform extends beyond this guided setup.

export type PillarId =
  | "intent"
  | "standards"
  | "directives"
  | "knowledge"
  | "procedure"
  | "preference"
  | "economics"
  | "access";

export interface Pillar {
  id: PillarId;
  label: string;
  aaceTag: string;
  icon: LucideIcon;
  // builder = filled by this flow; liza = "Define in LIZA" lock badge
  source: "builder" | "liza";
}

export const PILLARS: Pillar[] = [
  { id: "intent",     label: "Strategic Intent",  aaceTag: "PLAYBOOK · Trigger", icon: Target,      source: "builder" },
  { id: "standards",  label: "Standards",         aaceTag: "KNOWLEDGE",          icon: BookOpen,    source: "builder" },
  { id: "directives", label: "Compliance",        aaceTag: "DIRECTIVE",          icon: ShieldCheck, source: "builder" },
  { id: "knowledge",  label: "Knowledge Sources", aaceTag: "KNOWLEDGE",          icon: Database,    source: "builder" },
  { id: "procedure",  label: "Procedure",         aaceTag: "PROCEDURE",          icon: ListChecks,  source: "builder" },
  { id: "preference", label: "Voice & Format",    aaceTag: "PREFERENCE",         icon: BookOpen,    source: "builder" },
  { id: "economics",  label: "Unit Economics",    aaceTag: "Define in LIZA",     icon: DollarSign,  source: "liza" },
  { id: "access",     label: "Access Scope",      aaceTag: "Define in LIZA",     icon: Lock,        source: "liza" },
];

// ─── Guided step definitions ──────────────────────────────────────────────
// Each step asks one question. Chips are the primary input. A textarea is
// always allowed for free text. `pillar` says which rail card lights up.

export type StepId =
  | "department"
  | "role"
  | "playbook"
  | "intent"
  | "standards"
  | "directives"
  | "knowledge"
  | "preference";

export interface Step {
  id: StepId;
  pillar?: PillarId;
  prompt: string;
  multi: boolean;
  options: string[];
  allowOther: boolean;
}

export const STEPS: Step[] = [
  {
    id: "department",
    prompt: "Which part of the business are you setting this up for?",
    multi: false,
    allowOther: true,
    options: [
      "Sales", "Marketing", "Customer Success", "Operations",
      "Finance", "Strategy", "People", "R&D", "Product / Engineering",
    ],
  },
  {
    id: "role",
    prompt: "And your role in that team?",
    multi: false,
    allowOther: true,
    options: ["Function leader", "Team manager", "Individual contributor"],
  },
  {
    id: "playbook",
    pillar: "procedure",
    prompt: "What should this playbook actually do? Pick the closest fit.",
    multi: false,
    allowOther: true,
    options: [
      "Draft outbound to a named account",
      "Summarise a discovery call and update CRM",
      "Write a proposal or SOW from a brief",
      "Research a company before a meeting",
      "Triage and respond to an inbound request",
      "Draft an internal memo or update",
    ],
  },
  {
    id: "intent",
    pillar: "intent",
    prompt: "What outcome should it serve? Pick what matters most.",
    multi: true,
    allowOther: true,
    options: ["Revenue growth", "Cost reduction", "Quality / accuracy", "Speed to market", "Risk reduction"],
  },
  {
    id: "standards",
    pillar: "standards",
    prompt: "Which of your standards must it follow?",
    multi: true,
    allowOther: true,
    options: [
      "Brand voice guide",
      "ICP / qualification rules",
      "Output quality rubric",
      "Approved messaging library",
      "Pricing & discounting rules",
    ],
  },
  {
    id: "directives",
    pillar: "directives",
    prompt: "Any compliance or safety rules it must never break?",
    multi: true,
    allowOther: true,
    options: ["GDPR", "EU AI Act", "DORA", "Internal model-risk policy", "No customer PII in prompts", "None"],
  },
  {
    id: "knowledge",
    pillar: "knowledge",
    prompt: "What knowledge should it read from?",
    multi: true,
    allowOther: true,
    options: ["CRM records", "Internal knowledge base", "Past winning proposals", "Product documentation", "Public web"],
  },
  {
    id: "preference",
    pillar: "preference",
    prompt: "Last one — how should it sound and how long should answers be?",
    multi: true,
    allowOther: true,
    options: ["Direct & punchy", "Warm & consultative", "Formal", "Tight (≤150 words)", "Detailed (≥300 words)"],
  },
];

export type Answers = Partial<Record<StepId, string[]>>;

export function pillarStatus(answers: Answers): Record<PillarId, "defined" | "pending" | "liza"> {
  const byPillar: Record<PillarId, "defined" | "pending" | "liza"> = {
    intent: "pending",
    standards: "pending",
    directives: "pending",
    knowledge: "pending",
    procedure: "pending",
    preference: "pending",
    economics: "liza",
    access: "liza",
  };
  for (const step of STEPS) {
    if (!step.pillar) continue;
    const v = answers[step.id];
    if (v && v.length > 0) byPillar[step.pillar] = "defined";
  }
  return byPillar;
}

export function builderProgress(answers: Answers): number {
  const builderSteps = STEPS.filter((s) => s.pillar);
  const done = builderSteps.filter((s) => (answers[s.id]?.length ?? 0) > 0).length;
  return Math.round((done / builderSteps.length) * 100);
}

// Rough token estimate for the compiled AACE prompt that would be injected.
// Counts ~1 token per 4 chars across all selected values plus a base overhead.
export function estimateTokens(answers: Answers): number {
  let chars = 220; // base AACE wrapper
  for (const step of STEPS) {
    const v = answers[step.id];
    if (!v) continue;
    chars += step.prompt.length + v.join(", ").length + 24;
  }
  return Math.round(chars / 4);
}