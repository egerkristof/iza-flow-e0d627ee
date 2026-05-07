export type IndustryKey =
  | "generic"
  | "pharma"
  | "banking"
  | "space-defense"
  | "automotive"
  | "aec"
  | "professional-services"
  | "gtm";

export type DetailItem = { label: string; detail: string };
export type Kpi = { label: string; value: string; delta: string; positive?: boolean };

export type IndustryLexicon = {
  key: IndustryKey;
  label: string;
  short: string;
  href: string;
  sourceSystems: { title: string; sub: string; items: string[] };
  connectedTools: { title: string; sub: string; items: string[] };
  nativeSurfaces: { sub: string };
  judgmentCore: {
    systemic: string;
    artifacts: string;
    systemicItems: DetailItem[];
    artifactItems: DetailItem[];
    /** Propagation chain — what changes when one node changes. */
    chain: { trigger: string; nodes: string[]; outcome: string };
  };
  leadership: {
    sub: string;
    pushItems: DetailItem[];
    upItems: DetailItem[];
    kpis: Kpi[];
  };
  scenario: {
    front: string;
    backOutcome: string;
    backDetail: string;
    /** Longer narrative shown when scenario card is expanded. */
    backLong: string;
  };
};

const GENERIC: IndustryLexicon = {
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
    systemicItems: [
      { label: "Decision logic & playbooks", detail: "Concepts, standards, and the relationships between them." },
      { label: "Mandates & directives", detail: "Non-negotiables enforced as runtime checks, not PDFs." },
      { label: "Process intelligence", detail: "How work actually flows, captured from systems and people." },
    ],
    artifactItems: [
      { label: "Native artifacts (inside Liza)", detail: "Versioned, governed, linked to the standard that produced them." },
      { label: "Non-native artifacts (in your stack)", detail: "Files, records, drafts in your existing tools — tracked and synced." },
      { label: "Sync & propagation chain", detail: "Change one node, every dependent artifact updates — not just flagged." },
    ],
    chain: {
      trigger: "Standard changes",
      nodes: ["Requirement", "Spec", "Test case", "Report", "Stakeholder doc"],
      outcome: "All updated, in lockstep, across systems.",
    },
  },
  leadership: {
    sub: "Where leaders set direction and see reality. Push governance, mandates, playbooks down. Live signal flows up from execution. Strategy and execution stop being two timelines.",
    pushItems: [
      { label: "Governance & mandates", detail: "Policy enters the standard as runtime constraints. Every surface inherits them the day they ship." },
      { label: "Strategic playbooks", detail: "New strategic moves become executable playbooks. The org runs the new plan immediately." },
      { label: "Sensing engine jobs", detail: "Standing research and signal-detection jobs deployed across markets and the regulatory landscape." },
    ],
    upItems: [
      { label: "Execution telemetry", detail: "What teams actually run, where drift happens, where the standard is failing." },
      { label: "Outcome metrics", detail: "Cycle times, rework rates, conversion, audit findings. Tied to the standard version that produced them." },
      { label: "Live business-model loop", detail: "Strategy designs the system. Execution updates the system. The model is continuously tuned." },
    ],
    kpis: [
      { label: "Cycle time on critical work", value: "−62%", delta: "vs baseline", positive: true },
      { label: "Rework / contradictions caught", value: "+4.1×", delta: "before release", positive: true },
      { label: "Standard adoption across surfaces", value: "94%", delta: "of executions" },
      { label: "Audit prep time", value: "−78%", delta: "per cycle", positive: true },
    ],
  },
  scenario: {
    front: "A real moment in any team",
    backOutcome: "Hours instead of days. Same standard everywhere.",
    backDetail: "A new mandate ships from leadership. The standard updates. Every Workbook, every connected AI tool, every dependent artifact reflects it the same day.",
    backLong: "Leadership ships a policy update at 09:00. By 09:01 the standard is versioned in the core. Every Workbook in flight loads the new bundle. Copilot, Glean, and your vendor RAG inherit the change automatically. Every artifact downstream of that policy — drafts, reviews, dashboards — is identified, queued, and updated, not just flagged. The audit trail is recorded against the new version.",
  },
};

const PHARMA: IndustryLexicon = {
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
    systemicItems: [
      { label: "SOPs & quality mandates", detail: "Procedures and GxP constraints become runtime checks the operator cannot bypass." },
      { label: "CAPA logic & precedent", detail: "Past root causes and corrective actions inform every new deviation review." },
      { label: "Regulatory rulesets", detail: "FDA, EMA, ICH constraints applied at the moment of execution." },
    ],
    artifactItems: [
      { label: "Native artifacts (inside Liza)", detail: "Deviation reports, batch reviews, dossier sections drafted under live SOPs." },
      { label: "Non-native artifacts (Veeva, LIMS, eTMF)", detail: "Canonical records updated, never duplicated." },
      { label: "Sync & propagation chain", detail: "An SOP change cascades to dependent CAPAs, batch records, and dossier sections — none get missed." },
    ],
    chain: {
      trigger: "SOP revised",
      nodes: ["Affected CAPAs", "Open deviations", "Batch records", "Dossier sections", "Training records"],
      outcome: "Every dependent artifact updated and re-approved, audit-ready.",
    },
  },
  leadership: {
    sub: "Where Quality and Operations leadership set the standard and see live execution reality. Mandates push down as runtime constraints; deviation and drift signals flow up.",
    pushItems: [
      { label: "Quality mandates & GxP policy", detail: "Pushed into the standard. Operators cannot run outside the constraint envelope." },
      { label: "Inspection-readiness playbooks", detail: "How to handle FDA / EMA inspection scenarios, executable on demand." },
      { label: "Sensing jobs on regulatory change", detail: "Standing scans for guidance updates and competitor enforcement actions." },
    ],
    upItems: [
      { label: "Deviation & drift signal", detail: "Where SOPs are being worked around, where rework is concentrated." },
      { label: "Cycle time & release metrics", detail: "Batch release time, deviation closure time, CAPA aging — by site." },
      { label: "Inspection-readiness score", detail: "Live readiness across products and sites, not a quarterly snapshot." },
    ],
    kpis: [
      { label: "Batch release time", value: "−71%", delta: "vs prior 12 months", positive: true },
      { label: "Deviation closure", value: "4 hrs", delta: "vs 3 days median", positive: true },
      { label: "Inspection-readiness", value: "98%", delta: "across sites" },
      { label: "Repeat deviations", value: "−62%", delta: "quarter on quarter", positive: true },
    ],
  },
  scenario: {
    front: "A deviation hits the floor at 14:00",
    backOutcome: "Approved release in 4 hours, not 3 days.",
    backDetail: "Operator opens a Workbook. The SOP, the CAPA history, the relevant guidance bundle is already loaded. AI drafts the deviation report. QA reviews. Veeva, LIMS, and eTMF all reflect the closure the same shift.",
    backLong: "14:00 — operator opens a Workbook. The active SOP version, the last six similar deviations and their CAPAs, the relevant ICH guidance, and the batch's full history are loaded as one governed bundle. AI drafts the deviation report against the SOP. 15:30 — QA reviews and signs. The closure propagates: Veeva Vault gets the deviation record, LIMS gets the disposition, eTMF gets the linked CAPA reference, the affected SOP gets a usage signal back to Quality. Operator, supervisor, and QA all worked from the same standard version. Audit trail is generated automatically.",
  },
};

const BANKING: IndustryLexicon = {
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
    systemicItems: [
      { label: "Credit policy & risk appetite", detail: "Underwriting rules and limits enforced at the point of decision, not after." },
      { label: "KYC / AML rulesets", detail: "Live regulatory rules applied to every onboarding and review." },
      { label: "Regulator-facing playbooks", detail: "How the bank explains itself, executable and consistent." },
    ],
    artifactItems: [
      { label: "Native artifacts (inside Liza)", detail: "Credit memos, KYC files, risk reports, regulator briefs drafted under live policy." },
      { label: "Non-native artifacts (Core, CRM, Risk)", detail: "Updated in place as the canonical record." },
      { label: "Sync & propagation chain", detail: "A policy change ripples through every open file, every draft memo, every dashboard." },
    ],
    chain: {
      trigger: "Risk appetite updated",
      nodes: ["Open credit cases", "Draft memos", "KYC reviews", "Risk dashboards", "Regulator pack"],
      outcome: "Re-scored, re-drafted, re-reported under the new appetite — same day.",
    },
  },
  leadership: {
    sub: "Where CRO, Compliance and Heads of Credit set policy and see live exposure. Policy and appetite push down; exception, drift and exposure signals flow up.",
    pushItems: [
      { label: "Risk appetite & credit policy", detail: "Set once, enforced at every workbook execution." },
      { label: "Regulator-facing playbooks", detail: "How to respond to MRA, MRIA, supervisory letter — executable." },
      { label: "Sensing jobs on regulation", detail: "Standing scans on regulatory change and peer-bank enforcement." },
    ],
    upItems: [
      { label: "Exception & override telemetry", detail: "Where teams override policy, with reasons and patterns." },
      { label: "Decision quality metrics", detail: "Time to memo, rework, post-decision performance." },
      { label: "Live exposure to drift", detail: "Where the live book is drifting from stated appetite." },
    ],
    kpis: [
      { label: "Time to credit memo", value: "−68%", delta: "complex cases", positive: true },
      { label: "Policy override rate", value: "−47%", delta: "QoQ", positive: true },
      { label: "Audit findings (internal)", value: "−81%", delta: "year on year", positive: true },
      { label: "Decisions traced to policy version", value: "100%", delta: "auditable" },
    ],
  },
  scenario: {
    front: "A complex credit case lands Monday morning",
    backOutcome: "Memo drafted same day, fully traceable.",
    backDetail: "Analyst opens a Workbook. Policy bundle, comparable cases, and risk constraints are loaded. AI drafts the memo. Risk reviews. The decision and its rationale are recorded against the policy version that produced it.",
    backLong: "Monday 08:30 — a complex mid-market case arrives. Analyst opens a Workbook. Live credit policy version, current risk appetite, the five most comparable past cases, and the borrower's full file across CRM and the risk warehouse load as one bundle. AI drafts the memo. By 14:00 risk has reviewed and the committee has the pack. The decision is recorded against the exact policy version that produced it. If the policy is later updated, every dependent open case is automatically queued for re-review.",
  },
};

const SPACE: IndustryLexicon = {
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
    systemicItems: [
      { label: "Mission rules & certification", detail: "Constraints enforced as runtime checks across program and supplier." },
      { label: "Supplier mandates & IP boundary", detail: "What can flow where, applied automatically to every artifact." },
      { label: "Anomaly response playbooks", detail: "How the program responds when integration surprises hit." },
    ],
    artifactItems: [
      { label: "Native artifacts (inside Liza)", detail: "Anomaly reports, review packs, certification narratives." },
      { label: "Non-native artifacts (PLM, requirements)", detail: "Canonical engineering records updated in place." },
      { label: "Sync & propagation chain", detail: "A requirement change cascades to specs, test cases, supplier briefs and certification artifacts." },
    ],
    chain: {
      trigger: "Requirement updated",
      nodes: ["Spec", "Test case", "Supplier brief", "Review pack", "Cert dossier"],
      outcome: "Whole chain re-issued under the new requirement — no orphans.",
    },
  },
  leadership: {
    sub: "Where program leadership sets mission constraints and sees live engineering reality. Constraints push down; anomaly and risk signals flow up.",
    pushItems: [
      { label: "Mission rules & cert standards", detail: "Set as constraints in the standard, applied at every Workbook execution." },
      { label: "Supplier mandates & IP boundary", detail: "What is permitted in which surface, enforced automatically." },
      { label: "Sensing jobs on supplier & regulator", detail: "Standing scans on supplier risk and regulator posture." },
    ],
    upItems: [
      { label: "Anomaly & rework telemetry", detail: "Where anomalies cluster, where requirement churn drives rework." },
      { label: "Cert-readiness", detail: "How close every artifact is to certification, live." },
      { label: "Cross-program drift", detail: "Where different programs diverge from the same standard." },
    ],
    kpis: [
      { label: "Anomaly closure time", value: "1 shift", delta: "vs 5 days median", positive: true },
      { label: "Requirement-driven rework", value: "−58%", delta: "per program", positive: true },
      { label: "Cert-readiness across programs", value: "92%", delta: "live" },
      { label: "Supplier brief turnaround", value: "−64%", delta: "vs prior", positive: true },
    ],
  },
  scenario: {
    front: "Anomaly during integration test",
    backOutcome: "Root cause and corrective action in one shift.",
    backDetail: "Engineer opens a Workbook. Anomaly history, mission constraints, supplier specs are loaded. AI drafts the report. Lead reviews. PLM, requirements, and the mission file all reflect the closure.",
    backLong: "Anomaly fires during integration test at 10:00. Engineer opens a Workbook. Past anomalies on this subsystem, the mission rule that was hit, supplier specs, and the affected requirements load as one bundle. AI drafts the anomaly report and proposes corrective action. Lead reviews by 16:00. Closure propagates: PLM updates the part record, requirements get the corrective change, the supplier brief gets re-issued, the cert dossier gets the new evidence link. One shift, full chain.",
  },
};

const AUTO: IndustryLexicon = {
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
    systemicItems: [
      { label: "Engineering standards & DFMEA", detail: "Design rules and failure-mode logic applied at decision time." },
      { label: "Supplier mandates", detail: "What suppliers must meet, applied to every change request." },
      { label: "Homologation rulesets", detail: "Market-specific rules enforced as runtime constraints." },
    ],
    artifactItems: [
      { label: "Native artifacts (inside Liza)", detail: "Change memos, impact assessments, supplier briefs." },
      { label: "Non-native artifacts (PLM, MES)", detail: "Canonical engineering and quality records updated in place." },
      { label: "Sync & propagation chain", detail: "A spec change cascades to drawings, test plans, supplier briefs and homologation packs." },
    ],
    chain: {
      trigger: "Spec change accepted",
      nodes: ["Drawings", "Test plan", "Supplier brief", "Homologation pack", "Service manual"],
      outcome: "Whole chain re-issued, suppliers notified, homologation impact assessed automatically.",
    },
  },
  leadership: {
    sub: "Where program directors and Quality VPs set the standard and see live program reality. Standards push down; quality and supplier signals flow up.",
    pushItems: [
      { label: "Engineering & quality standards", detail: "Set as runtime constraints across program and suppliers." },
      { label: "Program governance playbooks", detail: "Stage-gate logic executable inside every workbook." },
      { label: "Sensing jobs on regulation & competitors", detail: "Standing scans on homologation rules and competitor moves." },
    ],
    upItems: [
      { label: "Spec change & rework telemetry", detail: "Where churn concentrates, what it costs." },
      { label: "Supplier performance signal", detail: "Live view of supplier compliance to standard." },
      { label: "Homologation-readiness", detail: "Live readiness by market and program." },
    ],
    kpis: [
      { label: "Spec change cycle", value: "−66%", delta: "median", positive: true },
      { label: "Supplier brief turnaround", value: "hours", delta: "vs days", positive: true },
      { label: "Homologation-readiness", value: "95%", delta: "across markets" },
      { label: "Late-stage rework cost", value: "−43%", delta: "per program", positive: true },
    ],
  },
  scenario: {
    front: "Supplier proposes a spec change late in program",
    backOutcome: "Impact assessed and decided in hours.",
    backDetail: "Engineer opens a Workbook. The impacted requirements, the homologation constraints, the supplier history are loaded. AI drafts impact and decision memo. The change propagates to PLM and the supplier brief.",
    backLong: "Supplier proposes a late spec change. Engineer opens a Workbook. Affected requirements, homologation impact, this supplier's prior changes and quality record, and the program timeline all load as one bundle. AI drafts the impact assessment and proposed decision against engineering and homologation standards. Program lead reviews by end of day. Decision propagates: PLM updates, drawings get the change ticket, the supplier brief is re-issued, homologation gets the new test obligation, the service manual is queued for revision.",
  },
};

const AEC: IndustryLexicon = {
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
    systemicItems: [
      { label: "Design standards & code", detail: "Applied at decision time, not just at review." },
      { label: "Contract clauses", detail: "Risk-bearing clauses become runtime checks on every RFI and change order." },
      { label: "Project governance playbooks", detail: "How decisions get made and recorded across firm and JV." },
    ],
    artifactItems: [
      { label: "Native artifacts (inside Liza)", detail: "RFI responses, change orders, submittals, review packs." },
      { label: "Non-native artifacts (BIM, project drive)", detail: "Canonical project record updated in place." },
      { label: "Sync & propagation chain", detail: "A design change cascades to drawings, submittals, schedule and contract impact." },
    ],
    chain: {
      trigger: "Design change",
      nodes: ["Drawings", "Submittals", "Schedule", "RFIs", "Contract impact note"],
      outcome: "Full project chain re-issued, contract risk surfaced automatically.",
    },
  },
  leadership: {
    sub: "Where project directors and Heads of Delivery set the standard across projects and see live delivery reality. Standards push down; risk and rework signals flow up.",
    pushItems: [
      { label: "Design & QA standards", detail: "Firm-wide standards applied to every project workbook." },
      { label: "Contract & risk playbooks", detail: "Risk-bearing logic executable in every RFI and change order." },
      { label: "Sensing jobs on code & regulation", detail: "Standing scans on code change and contract precedent." },
    ],
    upItems: [
      { label: "RFI / change order telemetry", detail: "Where projects are absorbing risk, where rework concentrates." },
      { label: "Schedule & cost signal", detail: "Live impact of decisions on schedule and cost." },
      { label: "Cross-project drift", detail: "Where projects diverge from firm standard." },
    ],
    kpis: [
      { label: "RFI response time", value: "same day", delta: "vs 4-day median", positive: true },
      { label: "Change-order risk caught early", value: "+3.2×", delta: "vs prior", positive: true },
      { label: "Standard adoption across projects", value: "91%", delta: "live" },
      { label: "Rework per project", value: "−39%", delta: "year on year", positive: true },
    ],
  },
  scenario: {
    front: "RFI lands from site at 09:00",
    backOutcome: "Answered same day, contract-aware.",
    backDetail: "PM opens a Workbook. Drawing pack, contract clauses, prior RFIs are loaded. AI drafts the response. Lead reviews. BIM and project drive reflect the answer.",
    backLong: "RFI lands at 09:00 from site. PM opens a Workbook. The drawing pack, the relevant contract clauses, prior RFIs on this project and similar past projects load as one bundle. AI drafts the response against design standards and flags the contract clauses at risk. Lead reviews and signs by 15:00. Response propagates: project drive gets the response, BIM gets the linked annotation, schedule gets a flag if the response affects sequencing, contract risk is recorded against the response.",
  },
};

const PS: IndustryLexicon = {
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
    systemicItems: [
      { label: "Method & framework library", detail: "The firm's IP applied at the moment of work, not after partner review." },
      { label: "Quality standards", detail: "What 'partner-ready' means, executable on every draft." },
      { label: "Engagement playbooks", detail: "How the firm runs an engagement of this type, from kickoff to closeout." },
    ],
    artifactItems: [
      { label: "Native artifacts (inside Liza)", detail: "Proposals, analyses, decks drafted under firm method." },
      { label: "Non-native artifacts (Drive, CRM)", detail: "Canonical engagement record updated in place." },
      { label: "Sync & propagation chain", detail: "A method update lifts the standard across every active engagement." },
    ],
    chain: {
      trigger: "Method updated",
      nodes: ["Active proposals", "Live deliverables", "Internal training", "Past engagement library", "Quality reviews"],
      outcome: "Every active engagement lifts to the new standard, immediately.",
    },
  },
  leadership: {
    sub: "Where managing partners set firm standard and see live engagement reality. Method and quality push down; utilization, drift and quality signals flow up.",
    pushItems: [
      { label: "Method & quality standards", detail: "The firm's IP becomes runtime, not partner memory." },
      { label: "Engagement playbooks", detail: "How the firm runs each engagement type, executable." },
      { label: "Sensing jobs on market & competitor", detail: "Standing scans on client industries and competitor moves." },
    ],
    upItems: [
      { label: "Quality & rework telemetry", detail: "Where partner edits concentrate — what the method should absorb." },
      { label: "Utilization & throughput", detail: "What the team actually delivered under the standard." },
      { label: "Win/loss signal", detail: "Which propositions land, which don't, tied to method version." },
    ],
    kpis: [
      { label: "Time to first senior-quality draft", value: "day 1", delta: "vs week 1", positive: true },
      { label: "Partner edits per deliverable", value: "−54%", delta: "vs prior", positive: true },
      { label: "Method adoption across teams", value: "96%", delta: "of engagements" },
      { label: "Proposal win rate", value: "+22%", delta: "QoQ", positive: true },
    ],
  },
  scenario: {
    front: "New engagement kicks off Monday",
    backOutcome: "Senior-quality first draft on day one.",
    backDetail: "Team opens a Workbook. Method bundle, comparable engagements, client context are loaded. AI drafts to the firm's standard. Partner reviews. Drive and CRM reflect the live artifact.",
    backLong: "Engagement kicks off Monday. Team opens a Workbook. The method bundle for this type, the three most comparable past engagements, the client's CRM history and prior deliverables load as one bundle. AI drafts the analysis to the firm standard. Partner reviews by Tuesday — far closer to senior quality than a junior week-one draft. Drive and CRM reflect the live artifact, time gets booked against the engagement, and any method drift partner flags is captured back to the standard.",
  },
};

const GTM: IndustryLexicon = {
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
    systemicItems: [
      { label: "ICP & qualification logic", detail: "Who you sell to and why, applied at every account decision." },
      { label: "Messaging & objection-handling", detail: "What the team says, executable in prep and follow-up." },
      { label: "Win-loss patterns", detail: "Past outcomes feeding present plays in real time." },
    ],
    artifactItems: [
      { label: "Native artifacts (inside Liza)", detail: "Account plans, prep briefs, follow-ups, proposals." },
      { label: "Non-native artifacts (CRM, decks)", detail: "Canonical revenue record updated in place." },
      { label: "Sync & propagation chain", detail: "A messaging update lifts every open account to the new pitch." },
    ],
    chain: {
      trigger: "Messaging updated",
      nodes: ["Open account plans", "Active proposals", "Outbound sequences", "Enablement decks", "Onboarding"],
      outcome: "Every active deal lifts to the new pitch, no rep left behind.",
    },
  },
  leadership: {
    sub: "Where CROs and VP Sales set the live playbook and see real pipeline reality. Playbook and messaging push down; pipeline, drift and win-loss signal flow up.",
    pushItems: [
      { label: "Live playbook & messaging", detail: "Set in the standard. Every rep workbook inherits it on next open." },
      { label: "ICP & qualification logic", detail: "What 'qualified' means, enforced not assumed." },
      { label: "Sensing jobs on accounts & market", detail: "Standing scans on target accounts and competitor moves." },
    ],
    upItems: [
      { label: "Pipeline & conversion telemetry", detail: "Live conversion by stage, by playbook version." },
      { label: "Messaging drift", detail: "Where reps are off-message and why." },
      { label: "Win-loss signal", detail: "What's winning, what's losing, tied to playbook version." },
    ],
    kpis: [
      { label: "Rep prep time", value: "15 min", delta: "vs 2 hrs", positive: true },
      { label: "Playbook adoption", value: "97%", delta: "of accounts" },
      { label: "Win rate on target accounts", value: "+31%", delta: "QoQ", positive: true },
      { label: "Time-to-proposal", value: "−59%", delta: "vs prior", positive: true },
    ],
  },
  scenario: {
    front: "Big account meeting tomorrow at 10:00",
    backOutcome: "Senior-rep prep in 15 minutes, not 2 hours.",
    backDetail: "Rep opens a Workbook. Account history, the live playbook, the latest messaging are loaded. AI drafts the prep brief and follow-ups. CRM updates after the call.",
    backLong: "Big account, meeting tomorrow at 10:00. Rep opens a Workbook. Account history, every prior touch, the live playbook for this segment, current messaging, and the three most comparable won and lost deals load as one bundle. AI drafts the prep brief, the discovery questions, the likely objections and responses. Rep reviews in 15 minutes. After the call, CRM updates from the transcript, the playbook gets a usage signal, and the next-step follow-up is drafted against what was actually said.",
  },
};

export const INDUSTRIES: IndustryLexicon[] = [
  GENERIC, PHARMA, BANKING, SPACE, AUTO, AEC, PS, GTM,
];

export const INDUSTRY_BY_KEY: Record<IndustryKey, IndustryLexicon> = INDUSTRIES.reduce(
  (acc, ind) => { acc[ind.key] = ind; return acc; },
  {} as Record<IndustryKey, IndustryLexicon>,
);
