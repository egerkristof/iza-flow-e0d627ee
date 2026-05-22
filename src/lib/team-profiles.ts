// Team-specific profiles for The Brief.
// Selecting a team pre-populates the typical use cases, tools, and limitations
// so the leader can mostly click instead of write.

export type TeamId =
  | "sales"
  | "marketing"
  | "customer_success"
  | "operations"
  | "product_engineering"
  | "rnd"
  | "finance"
  | "people"
  | "strategy"
  | "general";

export type TeamProfile = {
  id: TeamId;
  label: string;
  sub: string;
  use_cases: string[];
  tools: string[];
  limitations: string[];
};

// Cross-team tool universe; teams surface a curated subset.
const COMMON_TOOLS = {
  chatgpt: "ChatGPT",
  claude: "Claude",
  gemini: "Gemini",
  copilot: "Copilot (M365)",
  notion: "Notion AI",
  customGpts: "Custom GPTs",
  internalRag: "Internal RAG / chat-with-docs",
  ghCopilot: "GitHub Copilot",
  cursor: "Cursor",
  glean: "Glean",
  agents: "Agent framework (LangChain, CrewAI)",
  none: "None yet",
};

// Universal in-the-moment limitations, framed for non-technical leaders.
const UNIVERSAL_LIMITS = [
  "Every prompt starts from a blank slate",
  "Output drifts from our brand or standard",
  "Hallucinates facts under pressure",
  "No memory of past sessions or decisions",
  "Cannot enforce internal policies",
  "Adoption is patchy across the team",
  "No audit trail of what was used or generated",
  "Each person works in their own silo",
];

export const TEAM_PROFILES: TeamProfile[] = [
  {
    id: "sales",
    label: "Sales",
    sub: "Pipeline, prospecting, deals",
    use_cases: [
      "Draft personalised outbound emails at scale",
      "Summarise discovery calls and update CRM",
      "Generate proposals and SOWs faster",
      "Research accounts before meetings",
      "Coach reps on objection handling",
      "Qualify and prioritise inbound leads",
    ],
    tools: [
      COMMON_TOOLS.chatgpt,
      COMMON_TOOLS.claude,
      COMMON_TOOLS.copilot,
      COMMON_TOOLS.gemini,
      COMMON_TOOLS.customGpts,
      COMMON_TOOLS.internalRag,
      COMMON_TOOLS.none,
    ],
    limitations: [
      "AI does not know our ICP or deal qualification rules",
      "Drafts sound generic, not on-brand",
      "Cannot reference recent wins or product changes",
      ...UNIVERSAL_LIMITS,
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    sub: "Content, campaigns, brand",
    use_cases: [
      "Draft long-form content and blogs",
      "Repurpose content across channels",
      "Generate ad and landing-page variants",
      "Brief and review creative work",
      "Run keyword and competitor research",
      "Personalise lifecycle email campaigns",
    ],
    tools: [
      COMMON_TOOLS.chatgpt,
      COMMON_TOOLS.claude,
      COMMON_TOOLS.gemini,
      COMMON_TOOLS.notion,
      COMMON_TOOLS.customGpts,
      COMMON_TOOLS.internalRag,
      COMMON_TOOLS.none,
    ],
    limitations: [
      "Output drifts from brand voice and positioning",
      "Cannot enforce our messaging hierarchy",
      "No view of what was already published",
      ...UNIVERSAL_LIMITS,
    ],
  },
  {
    id: "customer_success",
    label: "Customer Success",
    sub: "Onboarding, retention, support",
    use_cases: [
      "Draft replies to customer questions",
      "Summarise account health for QBRs",
      "Generate onboarding plans per customer",
      "Triage and tag inbound support tickets",
      "Spot churn risk from usage signals",
      "Build playbooks for at-risk accounts",
    ],
    tools: [
      COMMON_TOOLS.chatgpt,
      COMMON_TOOLS.claude,
      COMMON_TOOLS.copilot,
      COMMON_TOOLS.customGpts,
      COMMON_TOOLS.internalRag,
      COMMON_TOOLS.glean,
      COMMON_TOOLS.none,
    ],
    limitations: [
      "AI does not know customer history or contract terms",
      "Replies miss product nuance and edge cases",
      "Cannot escalate consistently",
      ...UNIVERSAL_LIMITS,
    ],
  },
  {
    id: "operations",
    label: "Operations",
    sub: "Process, planning, execution",
    use_cases: [
      "Draft and update SOPs",
      "Summarise weekly ops reviews",
      "Plan capacity and shift allocation",
      "Generate vendor and procurement briefs",
      "Triage incidents and route work",
      "Quality-check outputs against the standard",
    ],
    tools: [
      COMMON_TOOLS.chatgpt,
      COMMON_TOOLS.claude,
      COMMON_TOOLS.copilot,
      COMMON_TOOLS.notion,
      COMMON_TOOLS.customGpts,
      COMMON_TOOLS.internalRag,
      COMMON_TOOLS.agents,
      COMMON_TOOLS.none,
    ],
    limitations: [
      "AI cannot apply our operating playbook",
      "No grip on real-time capacity or load",
      "Outputs ignore safety or compliance constraints",
      ...UNIVERSAL_LIMITS,
    ],
  },
  {
    id: "product_engineering",
    label: "Product & Engineering",
    sub: "Build, ship, scale",
    use_cases: [
      "Pair-program and write code",
      "Review pull requests and flag risk",
      "Draft PRDs and tech specs",
      "Generate test coverage and fixtures",
      "Summarise incidents and post-mortems",
      "Triage and prioritise the backlog",
    ],
    tools: [
      COMMON_TOOLS.ghCopilot,
      COMMON_TOOLS.cursor,
      COMMON_TOOLS.claude,
      COMMON_TOOLS.chatgpt,
      COMMON_TOOLS.customGpts,
      COMMON_TOOLS.internalRag,
      COMMON_TOOLS.agents,
      COMMON_TOOLS.none,
    ],
    limitations: [
      "AI does not know our architecture or conventions",
      "Suggestions ignore internal libraries and patterns",
      "Cannot reason across the whole codebase",
      ...UNIVERSAL_LIMITS,
    ],
  },
  {
    id: "rnd",
    label: "R&D / Science",
    sub: "Research, experiments, IP",
    use_cases: [
      "Summarise literature and prior art",
      "Draft experimental protocols",
      "Analyse and interpret results",
      "Write up findings and patents",
      "Cross-check claims against sources",
      "Generate hypotheses from data",
    ],
    tools: [
      COMMON_TOOLS.claude,
      COMMON_TOOLS.chatgpt,
      COMMON_TOOLS.gemini,
      COMMON_TOOLS.customGpts,
      COMMON_TOOLS.internalRag,
      COMMON_TOOLS.none,
    ],
    limitations: [
      "Cannot cite internal experimental data",
      "Hallucinates references and figures",
      "No grip on regulated or controlled vocabularies",
      ...UNIVERSAL_LIMITS,
    ],
  },
  {
    id: "finance",
    label: "Finance",
    sub: "Reporting, planning, control",
    use_cases: [
      "Draft variance and board commentary",
      "Summarise monthly close",
      "Build forecasting and scenario models",
      "Review contracts and obligations",
      "Generate investor and lender updates",
      "Triage accounts payable and receivable",
    ],
    tools: [
      COMMON_TOOLS.chatgpt,
      COMMON_TOOLS.claude,
      COMMON_TOOLS.copilot,
      COMMON_TOOLS.customGpts,
      COMMON_TOOLS.internalRag,
      COMMON_TOOLS.none,
    ],
    limitations: [
      "AI does not know our chart of accounts or policy",
      "Cannot reconcile to source systems",
      "Numbers and narrative drift apart",
      ...UNIVERSAL_LIMITS,
    ],
  },
  {
    id: "people",
    label: "People & HR",
    sub: "Hiring, performance, culture",
    use_cases: [
      "Draft job descriptions and scorecards",
      "Screen and summarise candidates",
      "Write performance and feedback drafts",
      "Answer policy and benefits questions",
      "Generate L&D content and paths",
      "Summarise engagement signals",
    ],
    tools: [
      COMMON_TOOLS.chatgpt,
      COMMON_TOOLS.claude,
      COMMON_TOOLS.copilot,
      COMMON_TOOLS.notion,
      COMMON_TOOLS.customGpts,
      COMMON_TOOLS.internalRag,
      COMMON_TOOLS.none,
    ],
    limitations: [
      "AI cannot apply our competency framework",
      "Risks bias without governed prompts",
      "Cannot reference our policy library accurately",
      ...UNIVERSAL_LIMITS,
    ],
  },
  {
    id: "strategy",
    label: "Strategy / Exec",
    sub: "Cross-functional, leadership",
    use_cases: [
      "Summarise leadership inputs and decisions",
      "Translate strategy into team-level briefs",
      "Prepare board and investor narratives",
      "Run market and competitor scans",
      "Pressure-test plans and assumptions",
      "Track execution against intent",
    ],
    tools: [
      COMMON_TOOLS.chatgpt,
      COMMON_TOOLS.claude,
      COMMON_TOOLS.gemini,
      COMMON_TOOLS.copilot,
      COMMON_TOOLS.notion,
      COMMON_TOOLS.customGpts,
      COMMON_TOOLS.internalRag,
      COMMON_TOOLS.none,
    ],
    limitations: [
      "AI cannot see how intent is actually being executed",
      "Each function reframes the strategy differently",
      "No single source for cross-team standards",
      ...UNIVERSAL_LIMITS,
    ],
  },
  {
    id: "general",
    label: "Something else",
    sub: "Cross-team or hybrid unit",
    use_cases: [
      "Draft and edit documents",
      "Summarise meetings and threads",
      "Research and synthesise information",
      "Prepare client or partner outputs",
      "Automate repetitive admin",
    ],
    tools: [
      COMMON_TOOLS.chatgpt,
      COMMON_TOOLS.claude,
      COMMON_TOOLS.gemini,
      COMMON_TOOLS.copilot,
      COMMON_TOOLS.notion,
      COMMON_TOOLS.customGpts,
      COMMON_TOOLS.internalRag,
      COMMON_TOOLS.none,
    ],
    limitations: UNIVERSAL_LIMITS,
  },
];

export const TEAM_BY_ID: Record<TeamId, TeamProfile> = Object.fromEntries(
  TEAM_PROFILES.map((t) => [t.id, t]),
) as Record<TeamId, TeamProfile>;