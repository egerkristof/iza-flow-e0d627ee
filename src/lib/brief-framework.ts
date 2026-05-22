// The Brief v2 framework
// Four decision domains × four maturity tiers × function-specific question bank.

export type DomainId = "demand" | "capacity" | "quality" | "economics";
export type Tier = 0 | 1 | 2 | 3;

export type FunctionId =
  | "gm"
  | "ops"
  | "commercial"
  | "delivery"
  | "rnd"
  | "finance"
  | "people";

export type UnitShape = "pnl" | "shared_service" | "product_line" | "region";
export type Scale = "<50" | "50-200" | "200-500" | "500-2000" | "2000+";

export interface FunctionProfile {
  id: FunctionId;
  label: string;
  blurb: string;
}

export interface DomainDef {
  id: DomainId;
  label: string;
  one_liner: string;
  decision: string;
}

export interface TierDef {
  tier: Tier;
  label: string;
  description: string;
}

export interface DomainQuestion {
  prompt: string;
  helper: string;
  placeholder: string;
}

export interface DomainProbe {
  signal: DomainQuestion;
  substrate: DomainQuestion;
}

export const FUNCTIONS: FunctionProfile[] = [
  { id: "gm", label: "General Manager / Head of Business Unit", blurb: "P&L owner of a unit, region, or segment." },
  { id: "ops", label: "Head of Operations / COO-1", blurb: "Runs the machine. Knows where work breaks." },
  { id: "commercial", label: "Head of Commercial / Sales", blurb: "Owns pipeline, conversion, and revenue." },
  { id: "delivery", label: "Head of Delivery / Client Services", blurb: "Owns what gets shipped to customers." },
  { id: "rnd", label: "Head of R&D / Product", blurb: "Owns what gets built next." },
  { id: "finance", label: "Head of Finance / FP&A", blurb: "Owns the unit math and capital allocation." },
  { id: "people", label: "Head of People / HR", blurb: "Owns capacity, capability, and culture." },
];

export const UNIT_SHAPES: { id: UnitShape; label: string }[] = [
  { id: "pnl", label: "P&L slice (region, segment, BU)" },
  { id: "product_line", label: "Product line" },
  { id: "shared_service", label: "Shared service / function" },
  { id: "region", label: "Geography / region" },
];

export const SCALES: { id: Scale; label: string }[] = [
  { id: "<50", label: "Under 50 people" },
  { id: "50-200", label: "50 to 200" },
  { id: "200-500", label: "200 to 500" },
  { id: "500-2000", label: "500 to 2,000" },
  { id: "2000+", label: "Over 2,000" },
];

export const DOMAINS: DomainDef[] = [
  {
    id: "demand",
    label: "Demand",
    one_liner: "What is coming at the unit.",
    decision: "What you take, what you refuse, what you price up.",
  },
  {
    id: "capacity",
    label: "Capacity",
    one_liner: "What the unit can actually deliver.",
    decision: "Where you add, where you stretch, where you cut.",
  },
  {
    id: "quality",
    label: "Quality",
    one_liner: "Whether the output meets the bar.",
    decision: "What the standard is, who enforces it, what the consequence is.",
  },
  {
    id: "economics",
    label: "Economics",
    one_liner: "Whether the unit math works.",
    decision: "What you kill, what you double down on, where you invest.",
  },
];

export const TIERS: TierDef[] = [
  { tier: 0, label: "Tacit", description: "Lives in someone's head. Cannot be handed off." },
  { tier: 1, label: "Recorded", description: "Exists in scattered files, decks, or people. Not one source." },
  { tier: 2, label: "Standardised", description: "One place. One version. Everyone references it." },
  { tier: 3, label: "Executable", description: "Runs as code or AI can use it directly. Decisions can be made by the system." },
];

// Pre-defined answer ladder per (domain × question). Each option carries the
// maturity tier it implies. Lets the leader click instead of write, while still
// giving the AI a clean signal to score against.
export interface TierChoice {
  tier: Tier;
  label: string;
  sub?: string;
}

export const DOMAIN_CHOICES: Record<DomainId, { signal: TierChoice[]; substrate: TierChoice[] }> = {
  demand: {
    signal: [
      { tier: 0, label: "Gut feel plus what my team tells me in 1:1s", sub: "No number I would defend in a board meeting." },
      { tier: 1, label: "A spreadsheet or report I update by hand", sub: "Stale within a week. Multiple versions in circulation." },
      { tier: 2, label: "One dashboard everyone in the unit references", sub: "Same number whoever you ask. Updated automatically." },
      { tier: 3, label: "A live system that flags changes and triggers action", sub: "The routine call gets made without me being in the room." },
    ],
    substrate: [
      { tier: 0, label: "Lives in my head and a few senior people", sub: "If I'm out, the picture goes with me." },
      { tier: 1, label: "Scattered across files, decks, and email threads", sub: "Findable, but only if you know who to ask." },
      { tier: 2, label: "One named system, one version, everyone uses it", sub: "CRM, ERP, planning tool, with hygiene rules enforced." },
      { tier: 3, label: "Structured data the AI can read and act on directly", sub: "Decisions can be made by the system, not just reported." },
    ],
  },
  capacity: {
    signal: [
      { tier: 0, label: "I ask the team leads and trust their read", sub: "No system view. People-mediated." },
      { tier: 1, label: "A planning spreadsheet I review periodically", sub: "Out of date the moment something shifts." },
      { tier: 2, label: "One workforce or planning view everyone trusts", sub: "Skills, allocations, bench in one place." },
      { tier: 3, label: "Live capacity signal that re-allocates work itself", sub: "Shifts, queues, or assignments adjust automatically." },
    ],
    substrate: [
      { tier: 0, label: "Lives in the team leads' heads", sub: "Re-built from scratch every quarter." },
      { tier: 1, label: "Spreadsheets and HRIS exports that disagree", sub: "Two sources, neither current." },
      { tier: 2, label: "Workforce or PSA tool everyone updates", sub: "One source of truth, kept current." },
      { tier: 3, label: "Capacity data wired into planning and routing", sub: "AI can reason over it without a human export." },
    ],
  },
  quality: {
    signal: [
      { tier: 0, label: "I find out when a customer escalates", sub: "Reactive. Always after the fact." },
      { tier: 1, label: "A monthly review surfaces issues after they happen", sub: "Pattern visible only in hindsight." },
      { tier: 2, label: "A live quality dashboard the team watches", sub: "Drift caught within days, not months." },
      { tier: 3, label: "Automated checks block work that fails the bar", sub: "The system enforces the standard, not a person." },
    ],
    substrate: [
      { tier: 0, label: "The standard lives in senior people's judgement", sub: "Different reviewers, different bars." },
      { tier: 1, label: "Standards docs exist but nobody updates them", sub: "Real practice diverges from written practice." },
      { tier: 2, label: "One playbook everyone follows, kept current", sub: "Reviewed, owned, versioned." },
      { tier: 3, label: "Standards encoded as checks the system runs", sub: "Compliance is a property of the workflow." },
    ],
  },
  economics: {
    signal: [
      { tier: 0, label: "Instinct about where margin leaks", sub: "No number that proves the leak." },
      { tier: 1, label: "A finance report once a quarter, often late", sub: "Aggregated, not actionable per unit." },
      { tier: 2, label: "Live unit economics by segment, deal, or job", sub: "I can point at the line that hurts." },
      { tier: 3, label: "The system flags low-yield spend and routes around it", sub: "Margin is defended without me intervening." },
    ],
    substrate: [
      { tier: 0, label: "Lives in finance's head and one ugly spreadsheet", sub: "Re-derived every time someone asks." },
      { tier: 1, label: "Reports exist but the per-unit math is opaque", sub: "Totals, not breakdowns." },
      { tier: 2, label: "Unit economics modelled and refreshed automatically", sub: "Same number across finance, ops, commercial." },
      { tier: 3, label: "Cost and margin data wired into operational decisions", sub: "Pricing, staffing, routing react to the math." },
    ],
  },
};

// Question bank: function × domain × { signal, substrate }
// Signal = what input they trust today. Substrate = the system that produces it. The substrate question is the maturity tell.
const Q: Record<FunctionId, Record<DomainId, DomainProbe>> = {
  gm: {
    demand: {
      signal: {
        prompt: "How do you actually know what is coming at the unit next quarter?",
        helper: "Pipeline, orders, requests, whatever flows in. The signal you trust.",
        placeholder: "I look at the CRM weekly, plus a spreadsheet my sales lead keeps.",
      },
      substrate: {
        prompt: "Where does that picture live, and who would I ask to see it without you in the room?",
        helper: "Name the system or the person. Be honest.",
        placeholder: "Half in Salesforce, half in my head and my sales lead's notes.",
      },
    },
    capacity: {
      signal: {
        prompt: "How do you know whether the unit has the people to hit the next two quarters?",
        helper: "Headcount, skill mix, bench, attrition. The capacity read.",
        placeholder: "I do a quarterly review with HR. Between reviews I guess.",
      },
      substrate: {
        prompt: "What system tells you that today, and how out of date is it usually?",
        helper: "HRIS, planning spreadsheet, finance model, head count.",
        placeholder: "Workday is current on names but useless for skills.",
      },
    },
    quality: {
      signal: {
        prompt: "How do you know the work going out of the unit meets the bar?",
        helper: "Defects, SLA, churn, escalations, NPS. The quality read.",
        placeholder: "I find out when a customer escalates or a deal closes late.",
      },
      substrate: {
        prompt: "What is the system or ritual that surfaces quality problems early, not late?",
        helper: "QBR, ops review, dashboard, weekly check-in.",
        placeholder: "There isn't one. We catch it in the monthly review.",
      },
    },
    economics: {
      signal: {
        prompt: "Where does the unit leak margin today, in your gut?",
        helper: "Mix, discounting, hidden cost, rework, over-servicing.",
        placeholder: "We over-service the bottom quartile of accounts.",
      },
      substrate: {
        prompt: "Can you point at the number that proves the leak, or is it instinct?",
        helper: "Be honest. Instinct counts as Tier 0.",
        placeholder: "Instinct, plus one ugly spreadsheet finance ran last year.",
      },
    },
  },
  ops: {
    demand: {
      signal: { prompt: "How do you see what work is hitting the ops queue this week?", helper: "Tickets, jobs, orders, requests.", placeholder: "Service desk plus what my team lead tells me." },
      substrate: { prompt: "Where does that queue live, and is it the same view your team has?", helper: "ITSM, ERP, Jira, spreadsheet.", placeholder: "ServiceNow, but team uses a parallel spreadsheet for priority." },
    },
    capacity: {
      signal: { prompt: "How do you know whether you can absorb the next two weeks of work?", helper: "Hours, skills, shifts, bench.", placeholder: "I look at the schedule and ask the leads." },
      substrate: { prompt: "What tells you that, and how often is it wrong?", helper: "Schedule, WFM, planning sheet.", placeholder: "Excel schedule. Wrong about 30% of the time." },
    },
    quality: {
      signal: { prompt: "How does a defect or rework event reach you?", helper: "QA, escalation, customer report.", placeholder: "Customer escalation, usually after the third occurrence." },
      substrate: { prompt: "Is there a system that catches the pattern, or only the incident?", helper: "Pattern vs incident matters.", placeholder: "Incidents only. No one looks across them." },
    },
    economics: {
      signal: { prompt: "Where does cost per unit of work creep up?", helper: "Overtime, rework, escalations, vendor spend.", placeholder: "Overtime on the night shift, every month-end." },
      substrate: { prompt: "Do you have the unit cost broken down, or is it a finance black box?", helper: "Unit economics visibility.", placeholder: "Black box. Finance gives me totals, not per-unit." },
    },
  },
  commercial: {
    demand: {
      signal: { prompt: "How do you read pipeline quality, not just pipeline volume?", helper: "Stage, ICP fit, velocity, conversion.", placeholder: "Stage report in CRM, gut check on which deals are real." },
      substrate: { prompt: "What system tells you pipeline quality without a human filter?", helper: "CRM hygiene, scoring, forecast tool.", placeholder: "CRM data is dirty. Real number lives in my head." },
    },
    capacity: {
      signal: { prompt: "How do you know whether the team can sell what is in front of them?", helper: "Coverage, ramp, attainment, skill gaps.", placeholder: "Attainment report and my read on the ramp of new hires." },
      substrate: { prompt: "What tracks rep capability beyond attainment numbers?", helper: "Enablement, call review, scorecards.", placeholder: "Nothing systematic. I listen to calls when I can." },
    },
    quality: {
      signal: { prompt: "How do you know whether the team is selling the right deals?", helper: "Win/loss, churn after sale, expansion.", placeholder: "Win rate by segment, plus complaints from delivery." },
      substrate: { prompt: "Where does the win/loss truth live?", helper: "Postmortem, CRM field, CS handoff.", placeholder: "Slack threads and tribal memory." },
    },
    economics: {
      signal: { prompt: "Where does deal economics get eroded between offer and signature?", helper: "Discounting, scope creep, payment terms.", placeholder: "Discount drift on big deals at quarter end." },
      substrate: { prompt: "Is discount and term governance enforced by a system or by you saying no?", helper: "CPQ, approval workflow, manual.", placeholder: "Manual. Mostly me on Friday afternoons." },
    },
  },
  delivery: {
    demand: {
      signal: { prompt: "How do you see the pipeline of work landing on delivery?", helper: "Backlog, signed deals, scope.", placeholder: "Handover doc from sales, plus a kickoff meeting." },
      substrate: { prompt: "Is there one source of truth for scope, or does each project define its own?", helper: "PSA, project tool, freeform.", placeholder: "Each PM uses their own template." },
    },
    capacity: {
      signal: { prompt: "How do you know whether you can staff the next 90 days?", helper: "Bench, skills, allocations, ramp.", placeholder: "Resourcing call every Monday. Half of it is guesswork." },
      substrate: { prompt: "What system holds skills and availability together?", helper: "PSA, RM tool, spreadsheet.", placeholder: "Two spreadsheets that disagree." },
    },
    quality: {
      signal: { prompt: "How do you know whether the work shipped is what was promised?", helper: "Acceptance, CSAT, escalation rate.", placeholder: "Customer feedback and escalation count." },
      substrate: { prompt: "Where do quality standards for delivery actually live?", helper: "Playbook, methodology, none.", placeholder: "In senior PMs' heads." },
    },
    economics: {
      signal: { prompt: "Where does project margin leak between sold and delivered?", helper: "Scope creep, overruns, write-offs.", placeholder: "Scope creep on enterprise accounts." },
      substrate: { prompt: "Can you see margin per project in real time, or only at close?", helper: "PSA reporting, finance close.", placeholder: "Only at close. Then it's too late." },
    },
  },
  rnd: {
    demand: {
      signal: { prompt: "How do you know what the business actually needs from R&D next?", helper: "Requests, roadmap pressure, customer signals.", placeholder: "Quarterly intake from commercial plus my own bets." },
      substrate: { prompt: "Is there one prioritised list, or do stakeholders each push their own?", helper: "Roadmap tool, governance forum.", placeholder: "Everyone has their own list." },
    },
    capacity: {
      signal: { prompt: "How do you know whether the team can deliver the roadmap?", helper: "Velocity, skill mix, dependency load.", placeholder: "Velocity trend and tech lead's read." },
      substrate: { prompt: "What system shows you skill gaps versus the roadmap?", helper: "Skills matrix, planning tool.", placeholder: "Nothing. I rely on the tech leads." },
    },
    quality: {
      signal: { prompt: "How do you know whether what you ship is rigorous, not just shipped?", helper: "Defects, post-launch issues, rework.", placeholder: "Defect rate post-release." },
      substrate: { prompt: "Where do engineering or experimental standards live?", helper: "Standards doc, code review, none.", placeholder: "Scattered docs and tribal practice." },
    },
    economics: {
      signal: { prompt: "Where does R&D spend produce no return?", helper: "Abandoned features, rebuilds, vendor lock-in.", placeholder: "Two abandoned features a year, easily." },
      substrate: { prompt: "Do you measure cost per insight or cost per shipped feature, or is it opaque?", helper: "Unit economics of R&D.", placeholder: "Opaque. We measure spend, not yield." },
    },
  },
  finance: {
    demand: {
      signal: { prompt: "How do you see what financial requests are coming at the function?", helper: "Forecasts, capital asks, deal reviews.", placeholder: "Monthly forecast cycle plus ad-hoc deal reviews." },
      substrate: { prompt: "Where do those requests live before they reach you?", helper: "Planning tool, ERP, spreadsheets.", placeholder: "Spreadsheets emailed in." },
    },
    capacity: {
      signal: { prompt: "How do you know whether the finance team can absorb the close plus everything else?", helper: "Headcount, automation, manual load.", placeholder: "We feel the strain every month-end." },
      substrate: { prompt: "What tracks team load versus calendar load?", helper: "Workflow tool, ticketing, none.", placeholder: "None. I ask the controllers." },
    },
    quality: {
      signal: { prompt: "How do you know whether the numbers leaving finance are right?", helper: "Restatements, audit findings, late discoveries.", placeholder: "Audit catches things. Sometimes we catch them late ourselves." },
      substrate: { prompt: "Where do close standards and controls actually live?", helper: "Documented process vs tribal.", placeholder: "Documented for SOX. Tribal for the rest." },
    },
    economics: {
      signal: { prompt: "Where does the company waste money that finance can see but cannot stop?", helper: "Vendor sprawl, low-yield spend, dead SaaS.", placeholder: "SaaS sprawl and dead vendor contracts." },
      substrate: { prompt: "Do you have a system that flags low-yield spend, or only an annual review?", helper: "Spend management, manual review.", placeholder: "Annual review at budget time." },
    },
  },
  people: {
    demand: {
      signal: { prompt: "How do you know what the business needs from people next?", helper: "Hiring asks, skill requests, retention risk.", placeholder: "Hiring plan from leadership plus exit risk gut feel." },
      substrate: { prompt: "Is there one place where workforce demand lives?", helper: "HRIS, planning, workforce tool.", placeholder: "Spreadsheet I update monthly." },
    },
    capacity: {
      signal: { prompt: "How do you know whether the people function can deliver the hiring and development load?", helper: "Recruiter load, L&D capacity.", placeholder: "Recruiter load is visible. L&D capacity is not." },
      substrate: { prompt: "What system holds people-function workload?", helper: "ATS, LMS, project tracker.", placeholder: "ATS for hiring. Nothing for the rest." },
    },
    quality: {
      signal: { prompt: "How do you know whether you are hiring and developing the right people, not just enough?", helper: "Quality of hire, time to productivity, retention.", placeholder: "Manager feedback after 6 months." },
      substrate: { prompt: "Where do hiring and development standards actually live?", helper: "Scorecards, frameworks, tribal.", placeholder: "Scorecards in some teams. Tribal in most." },
    },
    economics: {
      signal: { prompt: "Where does people spend produce the least return?", helper: "Mishires, attrition, dead training.", placeholder: "Mishires at senior IC level cost us most." },
      substrate: { prompt: "Do you have a system that tracks cost of mishire and attrition?", helper: "Workforce analytics, manual.", placeholder: "Manual. Calculated once a year." },
    },
  },
};

export function getProbe(fn: FunctionId, domain: DomainId): DomainProbe {
  return Q[fn][domain];
}

// Static per-domain AI economics rationale. The diagnosis layer adds the
// unit-specific overlay; this is the base position.
export const DOMAIN_AI_ECONOMICS: Record<DomainId, { roi: "high" | "medium" | "low"; why: string }> = {
  demand: {
    roi: "high",
    why: "Demand decisions are repetitive, high-volume, and structured. Highest token-to-margin conversion in most units.",
  },
  quality: {
    roi: "high",
    why: "Pattern detection at scale. AI catches drift and defect signal humans miss between reviews.",
  },
  capacity: {
    roi: "medium",
    why: "Needs human judgement on people and shifts. AI augments planning but cannot own the call.",
  },
  economics: {
    roi: "low",
    why: "Until economics data is at Tier 2 the AI has nothing reliable to reason over. Fix substrate first, then ROI flips to high.",
  },
};