// LIZA Operator Framework — the dominant logic behind The Brief.
//
// Sources:
//   - TechDDDeck S07bUnique (the four-stream radial)
//   - TechDDDeck S08bClassifier (decision classes)
//   - Platform.tsx CATEGORIES + mem/architecture/aace-engine.md (knowledge types)
//
// This file defines:
//   - 4 streams that converge at the moment of work
//   - 5 governance audits that run inside the container
//   - 6 knowledge types in the bundle (Principle and Preference kept separate)
//   - 3 decision classes that price decisions by weight
//   - Team-tailored example phrasings so the diagnostic speaks the user's language

import type { TeamId } from "./team-profiles";

// ─── Triggers (what brought you here today) ──────────────────────────────────

export type TriggerId =
  | "incident"
  | "board"
  | "pilot_stalled"
  | "audit"
  | "exploring";

export const TRIGGERS: { id: TriggerId; label: string; sub: string }[] = [
  { id: "incident", label: "Recent incident or near-miss", sub: "Something went wrong with AI output." },
  { id: "board", label: "Board or exec pressure on ROI", sub: "Need to show what AI is returning." },
  { id: "pilot_stalled", label: "Pilot stalled or did not scale", sub: "Worked once. Will not generalise." },
  { id: "audit", label: "Audit, compliance, or risk finding", sub: "Governance gap flagged." },
  { id: "exploring", label: "Exploring, no specific trigger", sub: "Mapping the territory first." },
];

// ─── Streams ─────────────────────────────────────────────────────────────────

export type StreamId = "strategy" | "market" | "state" | "signal";
export type StreamStatus = "lit" | "partial" | "dark";

export type StreamDef = {
  id: StreamId;
  label: string;
  position: "top" | "left" | "right" | "bottom";
  // hsl color tokens reused from the deck
  color: string;
  what: string; // canonical definition
};

export const STREAMS: StreamDef[] = [
  {
    id: "strategy",
    label: "Strategy",
    position: "top",
    color: "270 60% 65%",
    what: "Mandates, OKRs, policy, risk. What leadership has decided.",
  },
  {
    id: "market",
    label: "Market",
    position: "left",
    color: "38 92% 50%",
    what: "External signals. Regulation, competitor moves, best practice.",
  },
  {
    id: "state",
    label: "State",
    position: "right",
    color: "200 90% 52%",
    what: "Prior artifacts, dependencies, decisions already taken.",
  },
  {
    id: "signal",
    label: "Signal",
    position: "bottom",
    color: "155 72% 46%",
    what: "KPIs, drift, anomalies, incidents. What the numbers say now.",
  },
];

// Per-team phrasings of each stream, so the question lands in the user's world.
// Returns one short example sentence per stream for a given team.
export function streamExamples(team: TeamId | null): Record<StreamId, string> {
  const generic: Record<StreamId, string> = {
    strategy: "Your goals, policies, and the standard you want held.",
    market: "What is happening outside that should change how you act.",
    state: "What has already been decided, written, or shipped.",
    signal: "What the latest numbers and incidents are telling you.",
  };
  const byTeam: Partial<Record<TeamId, Record<StreamId, string>>> = {
    sales: {
      strategy: "ICP, quota, deal qualification rules, pricing guardrails.",
      market: "Competitor pricing, regulation, prospect industry moves.",
      state: "Account history, prior calls, open opportunities, won deals.",
      signal: "Pipeline health, win rates, stage drift, call coaching flags.",
    },
    marketing: {
      strategy: "Brand voice, messaging hierarchy, campaign objectives.",
      market: "Category trends, competitor launches, audience shifts.",
      state: "Existing assets, what is published, what is in flight.",
      signal: "Channel performance, CAC, content engagement, brand sentiment.",
    },
    customer_success: {
      strategy: "Retention targets, escalation policy, account tier rules.",
      market: "Customer industry pressure, regulation, competitor moves.",
      state: "Account history, contract terms, prior tickets, playbooks used.",
      signal: "Health scores, usage drift, NPS, churn risk flags.",
    },
    operations: {
      strategy: "Operating standard, SLA, safety and compliance policy.",
      market: "Vendor market, regulation, benchmark practice.",
      state: "Open work, capacity, prior decisions, current SOPs.",
      signal: "Throughput, incidents, quality defects, backlog drift.",
    },
    product_engineering: {
      strategy: "Roadmap, architecture principles, quality bar.",
      market: "Standards, security advisories, competitor product moves.",
      state: "Codebase, prior PRs, ADRs, incidents post-mortems.",
      signal: "Build health, error rates, latency, on-call signal.",
    },
    rnd: {
      strategy: "Research priorities, IP policy, regulated protocols.",
      market: "Literature, prior art, regulator guidance.",
      state: "Internal experimental data, prior results, lab notebooks.",
      signal: "Run quality, anomalies, reproducibility flags.",
    },
    finance: {
      strategy: "Plan, capital policy, chart of accounts, control framework.",
      market: "Rates, FX, sector benchmarks, regulator guidance.",
      state: "Closed books, prior commentary, contracts in force.",
      signal: "Variances, cash flow, AR aging, covenant headroom.",
    },
    people: {
      strategy: "Competency framework, comp policy, hiring bar.",
      market: "Talent market, regulation, peer practice.",
      state: "Org structure, prior assessments, role scorecards.",
      signal: "Engagement, attrition, performance distribution.",
    },
    strategy: {
      strategy: "Mandates, OKRs, board commitments, capital allocation.",
      market: "Macro, regulation, competitor strategy, M&A activity.",
      state: "Prior decisions, plans in flight, commitments made.",
      signal: "Execution drift, KPI movement, leading indicators.",
    },
  };
  return byTeam[team as TeamId] ?? generic;
}

// ─── Governance audits ───────────────────────────────────────────────────────

export type AuditId = "cost" | "best_practice" | "security" | "decision" | "drift";
export type AuditStatus = "green" | "amber" | "red";

export type AuditDef = {
  id: AuditId;
  label: string;
  governs: string; // canonical definition
  question: string; // plain-language probe shown in the input
};

export const AUDITS: AuditDef[] = [
  {
    id: "cost",
    label: "Token & Cost",
    governs: "Prompt envelope, model routing, COGS per call.",
    question: "Do you know what AI costs per decision, per team?",
  },
  {
    id: "best_practice",
    label: "Best Practice",
    governs: "Output conforms to the locked standard or playbook.",
    question: "Does every output get checked against your standard before it ships?",
  },
  {
    id: "security",
    label: "Data Security",
    governs: "PII, residency, role scope, retention.",
    question: "Do you control what data each AI surface can see, and what it retains?",
  },
  {
    id: "decision",
    label: "Decision Audit",
    governs: "Rationale chain, evidence, decision class.",
    question: "Can you reconstruct why an AI-assisted decision was made, weeks later?",
  },
  {
    id: "drift",
    label: "Drift & Standards",
    governs: "Standard freshness, deviation from prior decisions.",
    question: "Does the system catch when your standards have gone stale?",
  },
];

// ─── Knowledge bundle types (6 — Principle and Preference kept separate) ─────

export type BundleTypeId =
  | "playbook"
  | "procedure"
  | "directive"
  | "principle"
  | "preference"
  | "knowledge";

export type BundleStatus = "have" | "partial" | "missing";

export type BundleTypeDef = {
  id: BundleTypeId;
  label: string;
  role: string;
  what: string;
};

export const BUNDLE_TYPES: BundleTypeDef[] = [
  {
    id: "playbook",
    label: "Playbook",
    role: "Strategic driver",
    what: "What the work is and why it matters. One per bundle.",
  },
  {
    id: "procedure",
    label: "Procedure",
    role: "Executable steps",
    what: "Atomic, sequenced action steps with gate logic.",
  },
  {
    id: "directive",
    label: "Directive",
    role: "Compliance gate",
    what: "Non-negotiable constraints. Cannot be overridden at run time.",
  },
  {
    id: "principle",
    label: "Principle",
    role: "Judgment heuristic",
    what: "How to decide at ambiguous points. Wisdom, not rules.",
  },
  {
    id: "preference",
    label: "Preference",
    role: "Style and voice",
    what: "Soft constraint. Format, tone, register.",
  },
  {
    id: "knowledge",
    label: "Knowledge",
    role: "Reference context",
    what: "Frameworks, definitions, market data. Informs, does not direct.",
  },
];

// ─── Decision classes ────────────────────────────────────────────────────────

export type DecisionClassId = "od" | "gc" | "ss";

export type DecisionClassDef = {
  id: DecisionClassId;
  label: string;
  multiplier: string;
  scope: string;
  approver: string;
};

export const DECISION_CLASSES: DecisionClassDef[] = [
  {
    id: "od",
    label: "Operational Decision",
    multiplier: "1x",
    scope: "Single artifact. Reversible.",
    approver: "None or peer.",
  },
  {
    id: "gc",
    label: "Governed Change",
    multiplier: "5x",
    scope: "Standard or playbook. Affects every future run.",
    approver: "Senior owner sign-off.",
  },
  {
    id: "ss",
    label: "Strategic Simulation",
    multiplier: "25x",
    scope: "Sandbox. Informs investment or M&A.",
    approver: "Partner or C-level.",
  },
];

// ─── Diagnosis shape ─────────────────────────────────────────────────────────

export type StreamCoverage = Record<StreamId, { status: StreamStatus; why: string }>;
export type AuditCoverage = Record<AuditId, { status: AuditStatus; why: string }>;

export type OperatorDiagnosis = {
  title: string;
  verdict: string;
  current_model_read: string;
  stream_coverage: StreamCoverage;
  audit_coverage: AuditCoverage;
  bundle_gaps: { type: BundleTypeId; status: BundleStatus; why: string }[];
  decision_class_read: {
    governed_today: DecisionClassId[]; // which classes they currently govern
    exposed: string; // what they are exposed on
  };
  cost_of_gap: {
    headline: string;
    math: string;
  };
  blind_spots: { title: string; why: string }[];
  correction: {
    move: string;
    scope: string;
    liza_capability: string;
    sequence: {
      now: { label: string; what: string };
      next: { label: string; what: string };
      later: { label: string; what: string };
    };
  };
};

// ─── User input shape ────────────────────────────────────────────────────────

export type StreamAnswer = Record<StreamId, StreamStatus | null>;
export type AuditAnswer = Record<AuditId, AuditStatus | null>;

export function emptyStreamAnswer(): StreamAnswer {
  return { strategy: null, market: null, state: null, signal: null };
}

export function emptyAuditAnswer(): AuditAnswer {
  return { cost: null, best_practice: null, security: null, decision: null, drift: null };
}

// ─── Deterministic fallback ──────────────────────────────────────────────────
// Used when the AI gateway times out or errors. Pure function of inputs.

export function deterministicDiagnosis(args: {
  team: string | null;
  use_cases: string[];
  tools: string[];
  streams: StreamAnswer;
  audits: AuditAnswer;
  trigger?: TriggerId | null;
}): OperatorDiagnosis {
  const teamLabel = args.team || "your team";
  const litStreams = (Object.keys(args.streams) as StreamId[]).filter(
    (s) => args.streams[s] === "lit",
  );
  const darkStreams = (Object.keys(args.streams) as StreamId[]).filter(
    (s) => args.streams[s] === "dark",
  );
  const redAudits = (Object.keys(args.audits) as AuditId[]).filter(
    (a) => args.audits[a] === "red",
  );

  const stream_coverage: StreamCoverage = (Object.keys(args.streams) as StreamId[]).reduce(
    (acc, s) => {
      const status = args.streams[s] ?? "dark";
      acc[s] = {
        status,
        why:
          status === "lit"
            ? "AI surfaces in this team see this stream."
            : status === "partial"
            ? "Partially visible. Pulled in by some people, missed by others."
            : "AI is operating blind on this stream today.",
      };
      return acc;
    },
    {} as StreamCoverage,
  );

  const audit_coverage: AuditCoverage = (Object.keys(args.audits) as AuditId[]).reduce(
    (acc, a) => {
      const status = args.audits[a] ?? "red";
      acc[a] = {
        status,
        why:
          status === "green"
            ? "In place and enforced."
            : status === "amber"
            ? "Partial. Some teams do this, not all."
            : "Not in place. The risk is uncontained.",
      };
      return acc;
    },
    {} as AuditCoverage,
  );

  return {
    title: `${teamLabel}: operating on ${litStreams.length} of 4 streams`,
    verdict: `${teamLabel} runs AI on ${args.tools.length || "a handful of"} surfaces with no shared standard between them. ${
      darkStreams.length
        ? `Your AI is blind on ${darkStreams.join(" and ")}. `
        : ""
    }${
      redAudits.length
        ? `${redAudits.length} of 5 governance audits are not in place. `
        : ""
    }The cost shows up as inconsistency, not failure.`,
    current_model_read: `${teamLabel} runs AI on top of ${
      args.tools.length ? args.tools.join(", ") : "consumer AI tools"
    }. ${
      darkStreams.length
        ? `The system is blind on ${darkStreams.join(", ")}. `
        : ""
    }${
      redAudits.length
        ? `Governance is uncontained on ${redAudits.length} of 5 audits. `
        : ""
    }There is no executable knowledge layer between intent and execution, so every tool reinvents the standard.`,
    stream_coverage,
    audit_coverage,
    bundle_gaps: BUNDLE_TYPES.map((b) => ({
      type: b.id,
      status: "missing" as BundleStatus,
      why: `No ${b.label.toLowerCase()} layer in place for ${teamLabel}.`,
    })),
    decision_class_read: {
      governed_today: ["od"],
      exposed:
        "Operational decisions run free. Governed changes and strategic simulations are not classified, so the wrong decisions get the same oversight as the trivial ones.",
    },
    cost_of_gap: {
      headline: "Roughly 1 FTE of quiet rework per 20 people on the team.",
      math: "Estimate: 2 hours per person per week reinventing standards, rewriting prompts, and reconciling AI output against the actual operating rule. At 20 people that is ~40 hours per week. Over a quarter, that compounds into one full-time-equivalent of work that produces nothing new.",
    },
    blind_spots: [
      {
        title: "Every tool reinvents your standard",
        why: "Without one place to publish decision logic, each surface guesses. The cost shows up as inconsistency, not error.",
      },
      {
        title: "Nothing compounds",
        why: "Good prompts and good answers leave with the person who wrote them. The next user starts from zero.",
      },
    ],
    correction: {
      move: `Publish ${teamLabel}'s operating standard as an executable bundle that every AI surface reads from.`,
      scope: "Two to four weeks. One owner. One bundle covering your three highest-value decisions.",
      liza_capability:
        "LIZA Knowledge Bundle plus state-locked Playbooks wired into the tools you already use.",
      sequence: {
        now: {
          label: "Next 30 days",
          what: `Pick the three highest-value decisions ${teamLabel} makes weekly. Write the standard for each as one Playbook plus Directives.`,
        },
        next: {
          label: "60 days",
          what: "Wire the bundle into the two AI surfaces with the highest usage. Every output reads from the standard before it ships.",
        },
        later: {
          label: "90 days",
          what: "Turn on the audit container. Drift, cost, and decision-class are tracked per output. Standards get versioned.",
        },
      },
    },
  };
}