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
    role: "The work itself",
    what: "Names what the work is and why it matters. Without it, every person invents their own version of the job.",
  },
  {
    id: "procedure",
    label: "Procedure",
    role: "The steps you actually take",
    what: "The sequence of moves that produces the output. Without it, AI guesses the order and skips the gates.",
  },
  {
    id: "directive",
    label: "Directive",
    role: "The things you must never do",
    what: "Hard constraints. Cannot be overridden at run time. Without it, AI quietly breaks your policy on the user's behalf.",
  },
  {
    id: "principle",
    label: "Principle",
    role: "How you decide when it is grey",
    what: "Judgment rules for the cases the procedure does not cover. Without it, AI defaults to the safest bland answer.",
  },
  {
    id: "preference",
    label: "Preference",
    role: "How it has to sound and look",
    what: "Voice, format, register. Soft constraint. Without it, output drifts off-brand within a week.",
  },
  {
    id: "knowledge",
    label: "Knowledge",
    role: "What you know that AI does not",
    what: "Frameworks, ICP, prior wins, market data. Informs the answer. Without it, AI uses the public internet as your truth.",
  },
];

// Per-team concrete example for each bundle type. One sentence in the user's world.
export function bundleExamples(
  team: TeamId | null,
): Record<BundleTypeId, string> {
  const generic: Record<BundleTypeId, string> = {
    playbook: "Example: how your team actually runs its weekly cycle.",
    procedure: "Example: the steps from request to shipped output.",
    directive: "Example: never share customer data outside approved tools.",
    principle: "Example: when in doubt, escalate before automating.",
    preference: "Example: short sentences, no jargon, active voice.",
    knowledge: "Example: your ICP definition, your pricing logic, your wins.",
  };
  const byTeam: Partial<Record<TeamId, Record<BundleTypeId, string>>> = {
    sales: {
      playbook: "Example: Discovery to proposal in five touches.",
      procedure: "Example: Call notes to CRM update to follow-up draft.",
      directive: "Example: Never quote pricing without deal-desk approval.",
      principle: "Example: When a deal stalls two weeks, change the sponsor.",
      preference: "Example: First-person, no hype words, three sentences max.",
      knowledge: "Example: ICP, won-deal anatomy, competitor traps.",
    },
    marketing: {
      playbook: "Example: Campaign brief to launch in 14 days.",
      procedure: "Example: Insight to angle to draft to QA to publish.",
      directive: "Example: Never publish without legal review on claims.",
      principle: "Example: Lead with the buyer's loss, not our gain.",
      preference: "Example: Brand voice, headline cadence, hero asset rules.",
      knowledge: "Example: Audience segments, prior campaign results.",
    },
    customer_success: {
      playbook: "Example: From renewal flag to retained account.",
      procedure: "Example: Health check to QBR to expansion plan.",
      directive: "Example: Never commit to roadmap items in writing.",
      principle: "Example: Solve the unspoken problem first.",
      preference: "Example: Calm, specific, never defensive.",
      knowledge: "Example: Account history, prior incidents, comparables.",
    },
    operations: {
      playbook: "Example: Incident to root cause to standard update.",
      procedure: "Example: Ticket triage and escalation ladder.",
      directive: "Example: Never bypass change control on production.",
      principle: "Example: When in doubt, restore service before explaining.",
      preference: "Example: Status updates every 15 minutes during incident.",
      knowledge: "Example: Runbooks, dependency map, vendor SLAs.",
    },
    product_engineering: {
      playbook: "Example: Idea to PRD to ship in two sprints.",
      procedure: "Example: ADR to PR to review to deploy.",
      directive: "Example: Never merge without test coverage on critical paths.",
      principle: "Example: Reversible decisions move fast, irreversible slow.",
      preference: "Example: Naming conventions, commit format, doc tone.",
      knowledge: "Example: Architecture, ADR history, incident post-mortems.",
    },
    rnd: {
      playbook: "Example: Hypothesis to experiment to validated finding.",
      procedure: "Example: Protocol design, run, analysis, report.",
      directive: "Example: Never publish before peer review on regulated work.",
      principle: "Example: Prefer reproducibility over novelty.",
      preference: "Example: Lab notebook format, figure conventions.",
      knowledge: "Example: Prior art, internal datasets, regulator guidance.",
    },
    finance: {
      playbook: "Example: Month-end close to commentary in five days.",
      procedure: "Example: Reconcile, classify, review, sign-off.",
      directive: "Example: Never override controls without dual approval.",
      principle: "Example: Materiality threshold over rules of thumb.",
      preference: "Example: Variance commentary in plain language.",
      knowledge: "Example: Chart of accounts, prior commentary, covenants.",
    },
    people: {
      playbook: "Example: From open role to filled in 45 days.",
      procedure: "Example: Scorecard, sourcing, interview loop, offer.",
      directive: "Example: Never share comp data outside approved channels.",
      principle: "Example: Hire for the role one year from now.",
      preference: "Example: Inclusive language, no superlatives.",
      knowledge: "Example: Competency framework, comp bands, exit data.",
    },
    strategy: {
      playbook: "Example: Question to evidence to recommendation in three weeks.",
      procedure: "Example: Hypothesis, data pull, synthesis, readout.",
      directive: "Example: Never present without prior counter-argument.",
      principle: "Example: Anchor on cost of inaction, not cost of action.",
      preference: "Example: Single-page memo, claim then evidence.",
      knowledge: "Example: Prior decisions, board commitments, market map.",
    },
  };
  return byTeam[team as TeamId] ?? generic;
}

// ─── Maturity arc ────────────────────────────────────────────────────────────

export type MaturityStageId =
  | "reactive"
  | "coordinated"
  | "standardised"
  | "governed"
  | "compounding";

export type MaturityStageDef = {
  id: MaturityStageId;
  label: string;
  what: string; // what life looks like at this stage
  next_shifts: string[]; // what it takes to reach the next stage
};

export const MATURITY_STAGES: MaturityStageDef[] = [
  {
    id: "reactive",
    label: "Reactive",
    what: "AI is used per-person. Each user invents their own prompts. Nothing is shared. Quality depends on who logged in.",
    next_shifts: [
      "Name the three decisions your team makes weekly that AI already touches.",
      "Write the standard for each as a one-page playbook.",
      "Pick one AI surface and pilot the standard there.",
    ],
  },
  {
    id: "coordinated",
    label: "Coordinated",
    what: "Some teams share prompts, custom GPTs, or templates. Standards exist as docs but no system enforces them.",
    next_shifts: [
      "Turn the shared docs into an executable bundle every AI surface can read.",
      "Add hard directives where policy must hold.",
      "Wire the bundle into your two highest-usage AI surfaces.",
    ],
  },
  {
    id: "standardised",
    label: "Standardised",
    what: "Standards are encoded and most AI surfaces read from them. Drift still happens because nothing audits the output.",
    next_shifts: [
      "Turn on the governance container: cost, best practice, security, decision audit, drift.",
      "Classify decisions by weight (operational, governed change, strategic).",
      "Make every output cite which standard it followed.",
    ],
  },
  {
    id: "governed",
    label: "Governed",
    what: "Every output runs under the five audits. You can reconstruct why any decision was made.",
    next_shifts: [
      "Version standards so you can prove what was true on any date.",
      "Feed run-time signal back into standards on a weekly cadence.",
      "Open the bundle to other teams so the knowledge compounds.",
    ],
  },
  {
    id: "compounding",
    label: "Compounding",
    what: "Standards improve from every run. New hires inherit your operating model on day one. AI is a true operating layer.",
    next_shifts: [],
  },
];

// Compute stage deterministically from inputs. Score: 0..9
// = lit streams (0..4) + green audits (0..5).
export function computeStage(args: {
  streams: StreamAnswer;
  audits: AuditAnswer;
}): { stage: MaturityStageId; score: number; next: MaturityStageId | null } {
  const lit = (Object.keys(args.streams) as StreamId[]).filter(
    (s) => args.streams[s] === "lit",
  ).length;
  const partials = (Object.keys(args.streams) as StreamId[]).filter(
    (s) => args.streams[s] === "partial",
  ).length;
  const green = (Object.keys(args.audits) as AuditId[]).filter(
    (a) => args.audits[a] === "green",
  ).length;
  const amber = (Object.keys(args.audits) as AuditId[]).filter(
    (a) => args.audits[a] === "amber",
  ).length;
  const score = lit + green + Math.floor((partials + amber) / 2);
  let stage: MaturityStageId;
  if (score <= 1) stage = "reactive";
  else if (score <= 3) stage = "coordinated";
  else if (score <= 5) stage = "standardised";
  else if (score <= 7) stage = "governed";
  else stage = "compounding";
  const order: MaturityStageId[] = [
    "reactive",
    "coordinated",
    "standardised",
    "governed",
    "compounding",
  ];
  const idx = order.indexOf(stage);
  const next = idx < order.length - 1 ? order[idx + 1] : null;
  return { stage, score, next };
}

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