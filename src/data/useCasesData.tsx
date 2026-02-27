import {
  Users, TrendingUp, ShieldCheck, Megaphone, Briefcase, Radio, GitBranch,
} from "lucide-react";

export interface UseCaseStat {
  value: string;
  label: string;
}

export interface UseCase {
  icon: React.ReactNode;
  tag: string;
  col: string;
  headline: string;
  subheading: string;
  competitors: string[];
  competitorNote: string;
  body: string[];
  carries: string | null;
  stats: UseCaseStat[];
}

export const USE_CASES: UseCase[] = [
  {
    icon: <Users className="w-7 h-7" />,
    tag: "01 · The Onboarding Accelerator",
    col: "200 90% 52%",
    headline: "Onboard anyone in weeks, not months.",
    subheading: "Encode your best people's judgment into protocols that make every new hire perform like a veteran.",
    competitors: ["Lessonly", "WorkRamp", "Trainual", "Confluence", "Internal wikis"],
    competitorNote: "They store training materials. They don't transfer the judgment that makes someone effective.",
    body: [
      "Onboarding fails because it transfers information, not judgment. Your best people know when to push, when to pause, what signals matter. That expertise takes months or years to absorb through osmosis.",
      "LIZA extracts that judgment and encodes it into executable onboarding protocols, whether it's a new sales rep learning deal qualification, an account manager inheriting a portfolio, or a marketing hire learning your positioning logic. Every new hire runs on senior-level intelligence from week one.",
    ],
    carries: "Onboarding surfaces what your best people actually know. That expertise becomes the raw material for function-specific playbooks.",
    stats: [
      { value: "8 wks", label: "To full productivity (vs 6-9 months)" },
      { value: "Any role", label: "Sales, AM, marketing, services" },
      { value: "Senior", label: "Judgment from day one" },
    ],
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    tag: "02 · Sales Playbooks",
    col: "38 92% 50%",
    headline: "Your best seller's instincts, running on every deal.",
    subheading: "Scale your senior seller's judgment across your entire go-to-market team.",
    competitors: ["Gong", "Chorus", "Highspot", "Seismic", "Salesforce Playbooks"],
    competitorNote: "They capture what happened. They don't transfer the judgment that wins deals.",
    body: [
      "Complex B2B sales are expertise-driven. Your best sellers pattern-match, read signals, and apply judgment that takes years to develop. That's tacit knowledge, and it walks out the door every evening.",
      "LIZA encodes deal qualification, objection handling, pricing judgment, and competitive positioning into living playbooks. They update as your team learns. Every rep runs on the same intelligence that makes your best seller effective.",
    ],
    carries: "Sales patterns reveal what your market actually values. That insight shapes how account management protects and expands revenue.",
    stats: [
      { value: "100%", label: "Team consistency, every deal" },
      { value: "Living", label: "Playbooks that update as you learn" },
      { value: "0", label: "Tribal knowledge dependencies" },
    ],
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    tag: "03 · Account Management Playbooks",
    col: "155 72% 46%",
    headline: "Protect revenue before the data tells you it's at risk.",
    subheading: "Encode renewal signals, expansion timing, and risk detection into every account interaction.",
    competitors: ["Gainsight", "Totango", "ChurnZero", "Vitally", "Spreadsheets"],
    competitorNote: "They track health scores from lagging indicators. They don't encode the judgment that spots risk early.",
    body: [
      "Your best account managers sense risk before the dashboard turns red. They read tone shifts in emails, notice when a champion goes quiet, spot the early signs of a competitive evaluation. That instinct is invisible to every tool in your stack.",
      "LIZA encodes those patterns into executable playbooks. Every AM inherits the judgment of your best performer: when to escalate, how to position an expansion, what signals mean a renewal is at risk. The playbook updates with every interaction, getting sharper over time.",
    ],
    carries: "Account patterns reveal what clients actually value and where positioning resonates. That insight feeds your marketing playbooks.",
    stats: [
      { value: "Early", label: "Risk detection, before dashboards" },
      { value: "100%", label: "Consistent account coverage" },
      { value: "Living", label: "Playbooks sharpen with every renewal" },
    ],
  },
  {
    icon: <Megaphone className="w-7 h-7" />,
    tag: "04 · Marketing Playbooks",
    col: "330 70% 55%",
    headline: "Stop guessing which message lands. Encode what works.",
    subheading: "Positioning logic, segment-specific messaging, campaign judgment. All encoded.",
    competitors: ["HubSpot", "Marketo", "Notion", "Google Docs", "Brand guidelines PDFs"],
    competitorNote: "They automate distribution. They don't encode the positioning judgment behind the message.",
    body: [
      "Your best marketer knows which message will resonate with which segment, which angle works for enterprise vs. mid-market, which proof points close the gap between interest and action. That judgment lives in their head, shared informally, lost when they leave.",
      "LIZA extracts positioning logic, segment insights, and campaign judgment into living playbooks. New hires learn why certain messages work, not just what to say. The playbooks evolve as your market shifts, keeping your entire team aligned on what actually lands.",
    ],
    carries: "Marketing insights reveal how the market perceives your value. That understanding feeds how professional services positions and delivers engagements.",
    stats: [
      { value: "0", label: "Guesswork in positioning" },
      { value: "Encoded", label: "Segment-specific messaging logic" },
      { value: "Living", label: "Playbooks that evolve with the market" },
    ],
  },
  {
    icon: <Briefcase className="w-7 h-7" />,
    tag: "05 · Professional Services Delivery",
    col: "270 60% 65%",
    headline: "Deliver every engagement like your best consultant ran it.",
    subheading: "Project scoping, methodology, client communication, escalation judgment. All encoded.",
    competitors: ["Mavenlink", "Kantata", "Teamwork", "Internal methodology docs", "Senior consultant shadowing"],
    competitorNote: "They track project timelines. They don't transfer the methodology judgment that determines delivery quality.",
    body: [
      "Your best consultants know how to scope accurately, when to push back on a client request, how to structure a deliverable that lands. That judgment takes years to develop, and every new hire learns it through expensive trial and error.",
      "LIZA encodes delivery methodology, client communication cadence, scoping judgment, and escalation logic into executable playbooks. Every consultant delivers with the same quality and consistency, regardless of seniority. The playbooks capture lessons from every engagement, building organisational delivery intelligence.",
    ],
    carries: "Delivery patterns surface client needs, friction points, and new knowledge. That intelligence flows into the meeting engine, where it gets captured and connected.",
    stats: [
      { value: "100%", label: "Delivery consistency across the team" },
      { value: "Encoded", label: "Scoping and methodology judgment" },
      { value: "Compounding", label: "Every engagement makes the next better" },
    ],
  },
  {
    icon: <Radio className="w-7 h-7" />,
    tag: "06 · The Meeting Intelligence Engine",
    col: "180 65% 45%",
    headline: "Every meeting builds your organisation's memory.",
    subheading: "From 1:1s to team syncs, extract the decisions, detect the drift, and drive the follow-through.",
    competitors: ["Otter.ai", "Fireflies", "Fathom", "Notion AI", "Grain"],
    competitorNote: "They give you transcripts and summaries. They don't connect meetings to each other, detect drift, or route intelligence anywhere actionable.",
    body: [
      "A single meeting transcript tells you what was said. But the real intelligence is in the patterns across meetings: the commitment made in Monday's 1:1 that contradicts Wednesday's team sync, the friction between two workstreams that only surfaces when you read both transcripts side by side, the follow-up task that was agreed but never landed.",
      "LIZA extracts structured intelligence from every meeting and connects it to your wider context. A team lead can oversee all their team's conversations without attending every call: detecting drifts in direction, spotting communication friction early, tracking whether decisions actually convert into execution. It turns meetings from information loss events into knowledge accumulation infrastructure.",
    ],
    carries: "Meeting intelligence surfaces decisions and context that need to be acted on. That intelligence flows directly into structured delegation.",
    stats: [
      { value: "100%", label: "Decisions captured with context" },
      { value: "Cross-meeting", label: "Drift and friction detection" },
      { value: "0", label: "Meetings you need to attend to stay informed" },
    ],
  },
  {
    icon: <GitBranch className="w-7 h-7" />,
    tag: "07 · The Smart Brief",
    col: "15 80% 55%",
    headline: "Don't delegate tasks. Generate briefs.",
    subheading: "The infrastructure for working through others at the highest standard.",
    competitors: ["Asana", "Monday.com", "ClickUp", "Linear", "Jira"],
    competitorNote: "They track what needs doing. They don't transfer why, in what sequence, or with what judgment.",
    body: [
      "Delegation breaks not because people are incapable, but because context doesn't transfer. They execute the letter, not the intent.",
      "LIZA packages your intent, standards, and judgment into every delegated task. The recipient gets full context, fewer check-ins, fewer clarification spirals, results that match your standard.",
    ],
    carries: null,
    stats: [
      { value: "0", label: "Check-ins needed" },
      { value: "100%", label: "Intent transferred with every brief" },
      { value: "∞", label: "Scalable across your organisation" },
    ],
  },
];

export const FLOW_CONNECTOR_TEXTS = [
  "Onboarding surfaces expertise → Playbooks encode it",
  "Sales patterns reveal market value → AM protects and expands it",
  "Account signals shape positioning → Marketing encodes what works",
  "Marketing insights feed delivery → Services runs on encoded methodology",
  "Delivery generates new knowledge → Meetings capture and connect it",
  "Meeting intelligence surfaces decisions → Smart Briefs delegate them",
];

export const FLYWHEEL_ITEMS = USE_CASES.map((uc, i) => ({
  num: `0${i + 1}`,
  title: uc.tag.replace(/^\d+\s*·\s*/, ""),
  col: uc.col,
  oneLiner: uc.subheading,
}));
