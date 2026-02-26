import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ExperienceStory } from "@/components/marketing/ExperienceStory";
import type { ExtractionResult } from "@/lib/knowledge-schema";
import type { ExperiencePreview } from "@/lib/experience-schema";

const MOCK_EXTRACTION: ExtractionResult = {
  analysis_notes:
    "This document describes a structured enterprise sales methodology with clear playbook-level processes, compliance requirements, and supporting knowledge. The methodology covers the full sales cycle from prospecting through close, with particular depth in discovery and proposal stages.",
  preferences: [],
  context_items: [],
  bundles: [
    {
      title: "Enterprise Discovery Process",
      description: "End-to-end framework for qualifying and discovering enterprise opportunities",
      scope_suggestion: "team",
      content_completeness: "full",
      coverage_gaps: ["No explicit handling of multi-threaded stakeholder mapping"],
      items: [
        { title: "Enterprise Discovery Playbook", content: "A structured approach to enterprise discovery that ensures consistent qualification and deep understanding of client needs before solution design.", category: "PLAYBOOK" },
        { title: "Stakeholder Identification", content: "Step 1: Identify all decision-makers, influencers, and blockers within the target organisation. Map their priorities, pain points, and political dynamics.", category: "PROCEDURE", step_order_hint: 1, parent_playbook_title: "Enterprise Discovery Playbook", output_type: "analysis_brief", output_description: "Stakeholder map with influence scores" },
        { title: "Pain Point Deep-Dive", content: "Step 2: Conduct structured interviews with each stakeholder to uncover explicit and latent pain points. Use the SPIN framework adapted for enterprise contexts.", category: "PROCEDURE", step_order_hint: 2, parent_playbook_title: "Enterprise Discovery Playbook", output_type: "document_section", output_description: "Pain point matrix with priority ranking" },
        { title: "Budget & Timeline Validation", content: "Step 3: Validate budget availability, procurement process, and decision timeline. Flag deals where budget is unconfirmed or timeline exceeds 6 months.", category: "PROCEDURE", step_order_hint: 3, parent_playbook_title: "Enterprise Discovery Playbook", output_type: "checklist" },
        { title: "Minimum Qualification Criteria", content: "All enterprise opportunities must meet: (1) Annual contract value ≥ €50K, (2) Identified executive sponsor, (3) Defined problem statement, (4) Budget confirmed or budgeting cycle aligned.", category: "DIRECTIVE", parent_playbook_title: "Enterprise Discovery Playbook" },
        { title: "SPIN Framework Adaptation", content: "Our SPIN adaptation emphasises Implication questions over Situation questions. Senior sellers should spend 60% of discovery on Implication and Need-payoff.", category: "KNOWLEDGE" },
      ],
    },
    {
      title: "Proposal & Solution Design",
      description: "Structured approach to building winning proposals with compliance checkpoints",
      scope_suggestion: "team",
      content_completeness: "full",
      coverage_gaps: [],
      items: [
        { title: "Proposal Development Playbook", content: "A repeatable process for creating enterprise proposals that align solution design with discovered pain points and include all required compliance elements.", category: "PLAYBOOK" },
        { title: "Solution Architecture Review", content: "Step 1: Map client requirements to product capabilities. Identify gaps and prepare mitigation strategies. Involve technical pre-sales for complex integrations.", category: "PROCEDURE", step_order_hint: 1, parent_playbook_title: "Proposal Development Playbook", output_type: "document_section", output_description: "Solution architecture document" },
        { title: "Commercial Modelling", content: "Step 2: Build pricing model using approved rate cards. Apply volume discounts per policy. Flag any non-standard terms for legal review.", category: "PROCEDURE", step_order_hint: 2, parent_playbook_title: "Proposal Development Playbook", output_type: "slide_outline", output_description: "Commercial proposal deck" },
        { title: "Executive Summary Draft", content: "Step 3: Write a 1-page executive summary connecting client pain points to proposed outcomes. Include 3 quantified benefits and implementation timeline.", category: "PROCEDURE", step_order_hint: 3, parent_playbook_title: "Proposal Development Playbook", output_type: "document_section", output_description: "Executive summary" },
        { title: "Legal Review Gate", content: "All proposals with ACV > €100K or non-standard terms must pass legal review before client submission. Turnaround: 48 hours.", category: "DIRECTIVE", parent_playbook_title: "Proposal Development Playbook" },
        { title: "Pricing Authority Matrix", content: "Discounts up to 10%: Sales Manager. 10-20%: VP Sales. >20%: CRO approval required. No discounts on professional services.", category: "DIRECTIVE" },
      ],
    },
    {
      title: "Client Relationship Principles",
      description: "Guiding principles for long-term enterprise client relationships",
      scope_suggestion: "organization",
      content_completeness: "partial",
      items: [
        { title: "Trust-First Engagement", content: "Always lead with value delivery before commercial discussions. Build credibility through insight sharing, not product pushing.", category: "PRINCIPLE" },
        { title: "Transparency Mandate", content: "Never hide limitations or risks from clients. Proactive disclosure of constraints builds long-term trust and reduces churn.", category: "PRINCIPLE" },
        { title: "Competitive Intelligence Protocol", content: "Maintain updated profiles of top 5 competitors. Track their pricing, product releases, and client wins quarterly.", category: "RESEARCH" },
        { title: "Communication Preferences", content: "Enterprise clients prefer structured, agenda-driven meetings. Always send pre-reads 24h before and follow-up notes within 4h after.", category: "PREFERENCE" },
      ],
    },
  ],
};

const MOCK_EXPERIENCE: ExperiencePreview = {
  protocols: [
    {
      title: "Enterprise Discovery Protocol",
      source_playbook: "Enterprise Discovery Playbook",
      description: "A 4-step protocol for qualifying and deeply understanding enterprise opportunities before committing resources to solution design.",
      estimated_duration: "45-60 min per opportunity",
      steps: [
        { order: 1, title: "Stakeholder Mapping", type: "action", description: "Identify and map all decision-makers, influencers, and blockers with their priorities and political dynamics.", output_type: "analysis_brief" },
        { order: 2, title: "Pain Point Deep-Dive", type: "ai_assist", description: "Conduct structured SPIN-based interviews. LIZA generates interview guides tailored to each stakeholder's role and industry.", output_type: "document_section" },
        { order: 3, title: "Qualification Gate", type: "gate", description: "Verify minimum qualification criteria: ACV ≥ €50K, executive sponsor identified, problem defined, budget confirmed." },
        { order: 4, title: "Budget & Timeline Validation", type: "action", description: "Validate procurement process, confirm budget cycle alignment, and document decision timeline.", output_type: "checklist" },
      ],
      compliance_gates: [
        "Minimum ACV threshold (€50K) must be met before advancing",
        "Executive sponsor must be identified and documented",
        "Budget confirmation or aligned budgeting cycle required",
      ],
    },
    {
      title: "Proposal Development Protocol",
      source_playbook: "Proposal Development Playbook",
      description: "A structured 4-step workflow for creating enterprise proposals with built-in compliance checkpoints and AI-assisted drafting.",
      estimated_duration: "2-3 hours",
      steps: [
        { order: 1, title: "Solution Architecture Review", type: "action", description: "Map client requirements to product capabilities and identify gaps with mitigation strategies.", output_type: "document_section" },
        { order: 2, title: "Commercial Modelling", type: "ai_assist", description: "Build pricing model using approved rate cards. LIZA auto-applies volume discounts and flags non-standard terms.", output_type: "slide_outline" },
        { order: 3, title: "Executive Summary", type: "ai_assist", description: "LIZA drafts a 1-page executive summary connecting pain points to quantified outcomes.", output_type: "document_section" },
        { order: 4, title: "Legal Review Gate", type: "gate", description: "Proposals with ACV > €100K or non-standard terms must pass legal review (48h turnaround)." },
      ],
      compliance_gates: [
        "Legal review required for ACV > €100K",
        "Pricing authority matrix must be respected",
        "All non-standard terms flagged for approval",
      ],
    },
  ],
  coaching_questions: [
    { question: "What happens when you discover competing priorities among stakeholders during discovery?",
      context: "Your discovery playbook covers stakeholder identification but doesn't address conflict resolution between stakeholders with opposing goals.",
      targets: "Enterprise Discovery Playbook" },
    { question: "How do you handle opportunities where the budget exists but the procurement process is undefined?",
      context: "Budget validation assumes a clear procurement path, but many enterprise clients have informal or evolving purchasing processes.",
      targets: "Enterprise Discovery Playbook" },
    { question: "What's your process for re-engaging a deal that stalls after proposal submission?",
      context: "The proposal playbook ends at submission. There's no defined follow-up cadence or re-engagement strategy.",
      targets: "Proposal Development Playbook" },
    { question: "How do you adapt your competitive positioning when a client is already using a competitor's product?",
      context: "Your competitive intelligence is tracked quarterly, but there's no playbook for displacement scenarios.",
      targets: "Competitive Intelligence Protocol" },
    { question: "What are your criteria for escalating a client relationship issue to executive leadership?",
      context: "Your principles cover trust and transparency but don't define escalation thresholds or processes.",
      targets: "Client Relationship Principles" },
  ],
  workbook_preview: {
    title: "Q1 Enterprise Pipeline Workbook",
    team_members: [
      { name: "Sarah Chen", role: "Account Executive" },
      { name: "Marcus Webb", role: "Solutions Architect" },
      { name: "Lisa Park", role: "Sales Manager" },
    ],
    active_protocols: ["Enterprise Discovery Protocol", "Proposal Development Protocol"],
    current_session: {
      executor_name: "Sarah Chen",
      protocol_title: "Enterprise Discovery Protocol",
      current_step: "Pain Point Deep-Dive",
      step_number: 2,
      total_steps: 4,
      ai_draft_output: "## Interview Guide: CTO — Acme Corp\n\n**Context:** Acme Corp is evaluating solutions for their data pipeline modernisation. The CTO, James Liu, is technically influential but not the budget holder.\n\n### Recommended SPIN Questions\n\n**Situation (brief — 2 questions max):**\n- What does your current data pipeline architecture look like?\n- How many teams interact with the pipeline daily?\n\n**Implication (focus here — 60% of time):**\n- When the pipeline fails, what's the downstream impact on your ML team's delivery timeline?\n- How does pipeline unreliability affect your ability to make commitments to the board?\n- What happens to your team's morale when they spend 30% of their time on infrastructure firefighting?\n\n**Need-Payoff:**\n- If pipeline reliability went from 94% to 99.9%, what would your team be able to deliver that they can't today?\n- How would predictable data delivery change your roadmap planning process?",
      compliance_score: 0.87,
    },
  },
  projected_learnings: [
    { title: "Discovery Efficiency Gains", insight: "After 5 discovery cycles, teams using the structured SPIN approach complete qualification 35% faster while maintaining quality scores.", category: "efficiency", refinement_action: "Auto-update SPIN question templates based on which implication questions generated the strongest client responses." },
    { title: "Proposal Win-Rate Correlation", insight: "Proposals that include quantified pain-point data from discovery have a 2.3x higher win rate than those relying on generic value propositions.", category: "quality", refinement_action: "Add a mandatory 'quantified impact' field to the executive summary step, pre-populated from discovery outputs." },
    { title: "Compliance Adherence Trend", insight: "Legal review gate compliance improved from 72% to 96% after 3 months. The remaining 4% are time-sensitive competitive deals.", category: "compliance", refinement_action: "Create an expedited legal review track for competitive displacement deals with a 24h SLA." },
    { title: "Cross-Functional Handoff Quality", insight: "Solutions Architects report that discovery notes from the structured process give them 80% of what they need, versus 40% from unstructured discovery.", category: "collaboration", refinement_action: "Add a 'SA Readiness Checklist' output to the final discovery step that auto-generates from captured data." },
  ],
};

export default function ExperienceTestPage() {
  return (
    <MarketingLayout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <p className="text-sm text-amber-500 font-semibold">🧪 Test Page — Populated with dummy data for rapid iteration</p>
        </div>
        <ExperienceStory
          extractionResult={MOCK_EXTRACTION}
          experiencePreview={MOCK_EXPERIENCE}
          onReset={() => window.location.reload()}
        />
      </div>
    </MarketingLayout>
  );
}
