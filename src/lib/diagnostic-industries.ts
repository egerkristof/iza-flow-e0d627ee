export type IndustryKey = "pharma" | "profservices" | "tech" | "manufacturing" | "other";

export interface IndustryOption {
  key: IndustryKey;
  label: string;
  description: string;
  teams: { key: string; label: string }[];
}

export const INDUSTRIES: IndustryOption[] = [
  {
    key: "pharma",
    label: "Pharma & Life Sciences",
    description: "Biotech, clinical trials, regulatory, medical devices",
    teams: [
      { key: "rd", label: "R&D / Discovery" },
      { key: "regulatory", label: "Regulatory Affairs" },
      { key: "clinical", label: "Clinical Operations" },
      { key: "quality", label: "Quality & Compliance" },
      { key: "medical", label: "Medical Affairs" },
      { key: "other", label: "Other" },
    ],
  },
  {
    key: "profservices",
    label: "Professional Services",
    description: "Consulting, legal, accounting, advisory",
    teams: [
      { key: "strategy", label: "Strategy / Management Consulting" },
      { key: "legal", label: "Legal" },
      { key: "accounting", label: "Accounting / Audit" },
      { key: "advisory", label: "Advisory / Risk" },
      { key: "other", label: "Other" },
    ],
  },
  {
    key: "tech",
    label: "Tech & SaaS",
    description: "Software, engineering, data, product",
    teams: [
      { key: "engineering", label: "Engineering" },
      { key: "product", label: "Product" },
      { key: "data", label: "Data Science / ML" },
      { key: "devops", label: "DevOps / Platform" },
      { key: "cs", label: "Customer Success" },
      { key: "other", label: "Other" },
    ],
  },
  {
    key: "manufacturing",
    label: "Manufacturing & Engineering",
    description: "Quality, supply chain, design, compliance",
    teams: [
      { key: "rd", label: "R&D / Design" },
      { key: "quality", label: "Quality / QA" },
      { key: "operations", label: "Operations" },
      { key: "supply", label: "Supply Chain / Logistics" },
      { key: "other", label: "Other" },
    ],
  },
  {
    key: "other",
    label: "Other Industry",
    description: "Financial services, education, government, etc.",
    teams: [
      { key: "operations", label: "Operations" },
      { key: "strategy", label: "Strategy" },
      { key: "it", label: "IT / Technology" },
      { key: "hr", label: "People / HR" },
      { key: "other", label: "Other" },
    ],
  },
];

/**
 * Industry-specific context overrides for question stories.
 * If an industry key is not found, or a question id is not found, the generic context is used.
 */
export const INDUSTRY_CONTEXTS: Record<string, Record<string, string>> = {
  pharma: {
    si1: "A lead researcher prepares to draft a section of a Clinical Study Report or a regulatory submission. They open their validated AI environment to synthesize findings from recent trial data.",
    si2: "Your team has a rigorous, GxP-compliant protocol for analyzing adverse event reports that has been refined over decades.",
    oc1: "Two medical writers are tasked with summarizing the same patient outcomes data. Both use AI to generate the first draft of the narrative summary.",
    oc2: "The senior regulatory affairs lead, who built the team's custom AI prompts for FDA filings, is on leave during a critical submission window.",
    kc1: "A data scientist discovers a more efficient way to use AI to clean messy phenotypic data, reducing manual reconciliation by 40%.",
    kc2: "Reflect on how your clinical operations team handled site selection queries six months ago compared to their AI-assisted workflow today.",
    cv1: "A junior toxicologist wants to observe how a principal scientist prompts an AI to cross-reference legacy safety data with new molecular structures.",
    cv2: "While planning a Phase II trial, you are determining which literature review tasks can be handled by AI and which require clinical oversight.",
    lv1: "After a successful IND application that utilized AI for document mapping, the team gathers to analyze what worked and what didn't.",
    lv2: "A new generative AI model specifically pre-trained on medical journals and chemical patents is released for enterprise use.",
  },
  profservices: {
    si1: "A consultant sits down to draft a strategic transformation deck for a Tier-1 client. They open an AI assistant to structure the initial hypothesis and workstreams.",
    si2: "Your practice has a proprietary methodology for conducting due diligence or forensic accounting that defines your market reputation.",
    oc1: "Two analysts are asked to produce a competitor landscape report. Both use AI to pull insights from annual reports and earnings calls.",
    oc2: "The subject matter expert who developed the firm's AI-driven valuation model is out of the office during a major M&A closing.",
    kc1: "An auditor finds a way to use AI to instantly flag anomalies in thousands of procurement invoices, a task that previously took days.",
    kc2: "Compare your team's process for drafting master service agreements today versus the manual redlining process used six months ago.",
    cv1: "An associate seeks to understand how a partner uses AI to refine complex legal arguments or high-stakes advisory recommendations.",
    cv2: "As you resource a new engagement, you are deciding which parts of the tax audit or market analysis should be AI-augmented versus manually verified.",
    lv1: "A high-value project concludes where AI was used for everything from research to final presentation polish. The team reviews the billable efficiency.",
    lv2: "A specialized AI tool for automated legal discovery or real-time market sentiment analysis becomes available to the firm.",
  },
  tech: {
    si1: "An engineer starts a new feature branch and opens their IDE's AI co-pilot to skeleton out the boilerplate and unit tests.",
    si2: "Your engineering org has a battle-tested CI/CD pipeline and code review standard that ensures system stability.",
    oc1: "Two front-end devs are given a Figma file and asked to build the UI components. Both use AI to generate the React code.",
    oc2: "The DevOps lead who automated the team's incident response playbooks with AI is off-grid during a minor production outage.",
    kc1: "A backend engineer develops a way to use AI to automatically generate documentation from code comments that actually stays updated.",
    kc2: "Look back at how your product team drafted user stories and technical specs six months ago compared to your current AI-integrated flow.",
    cv1: "A junior developer wants to see the specific iterative prompts a senior engineer uses to debug a complex race condition with AI.",
    cv2: "During sprint planning, you are assigning which refactoring tasks should be handled by AI-driven automated agents versus the core dev team.",
    lv1: "The team completes a major microservices migration where AI assisted in code translation. You sit down for a post-mortem on code quality.",
    lv2: "A new LLM with a 1-million token context window is released, allowing for the analysis of entire codebases at once.",
  },
  manufacturing: {
    si1: "A quality engineer opens an AI tool to analyze a week's worth of sensor telemetry from the assembly line to find the root cause of a defect.",
    si2: "Your plant follows a strict Six Sigma or Lean methodology for supply chain optimization that has been standard for years.",
    oc1: "Two procurement specialists are asked to source raw materials under tight budget constraints. Both use AI to simulate different vendor scenarios.",
    oc2: "The engineer who tuned the AI-driven predictive maintenance system for the CNC machines is on vacation when a warning light flashes.",
    kc1: "A production designer discovers a way to use generative design AI to reduce the weight of a component without sacrificing structural integrity.",
    kc2: "Think about how your logistics team managed spare parts inventory six months ago versus the AI-forecasted model they use now.",
    cv1: "A shop floor apprentice wants to see how a veteran plant manager uses AI to predict equipment failure from subtle sound signatures.",
    cv2: "When reviewing the production schedule, you are deciding which logistics coordination roles can be assisted by AI to optimize inventory levels.",
    lv1: "A massive facility upgrade is finished where AI optimized the floor layout for throughput. The leadership team reviews the ROI.",
    lv2: "A new industrial AI standard emerges that allows for real-time computer vision integration across all safety cameras.",
  },
};

/** Industry-specific CTA routing */
export const INDUSTRY_CTA: Record<IndustryKey, { label: string; href: string } | null> = {
  pharma: { label: "See how LIZA OS works for regulated science", href: "/industries/regulated" },
  profservices: { label: "See how LIZA OS works for professional services", href: "/services" },
  tech: null, // default CTA
  manufacturing: { label: "See how LIZA OS works for regulated operations", href: "/industries/regulated" },
  other: null,
};
