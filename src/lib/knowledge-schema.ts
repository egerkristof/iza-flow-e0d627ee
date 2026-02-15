/**
 * knowledge-schema.ts — Single source of truth for the AACE knowledge graph taxonomy.
 *
 * Every UI component, edge function prompt, and extraction flow references these
 * definitions. Edit HERE to change categories, labels, or extraction interfaces.
 */

// ─── Context Categories ──────────────────────────────────────────────────────
export const CONTEXT_CATEGORIES = [
  "DIRECTIVE",
  "KNOWLEDGE",
  "PROCEDURE",
  "PLAYBOOK",
  "PREFERENCE",
  "RESEARCH",
  "PRINCIPLE",
] as const;

export type ContextCategory = (typeof CONTEXT_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<ContextCategory, string> = {
  DIRECTIVE: "Directive",
  KNOWLEDGE: "Knowledge",
  PROCEDURE: "Procedure",
  PLAYBOOK: "Playbook",
  PREFERENCE: "Preference",
  RESEARCH: "Research",
  PRINCIPLE: "Principle",
};

export const CATEGORY_DESCRIPTIONS: Record<ContextCategory, string> = {
  DIRECTIVE: "Explicit rules, mandates, or constraints that MUST be followed",
  KNOWLEDGE: "Factual information, domain expertise, or institutional memory",
  PROCEDURE: "Step-by-step processes, workflows, or checklists",
  PLAYBOOK: "Strategic approaches or methodologies bundling multiple elements",
  PREFERENCE: "Working style, communication tone, or operational defaults",
  RESEARCH: "Findings, analyses, competitive intelligence, or market data",
  PRINCIPLE: "Core beliefs, values, or guiding tenets for decision-making",
};

/** Describes how each category relates to others in the taxonomy. */
export const CATEGORY_RELATIONSHIPS: Record<ContextCategory, string> = {
  DIRECTIVE: "Enforced within Playbooks & Procedures; derived from Principles",
  KNOWLEDGE: "Referenced by Playbooks, Procedures & Directives",
  PROCEDURE: "Part of a Playbook; may enforce Directives; uses Knowledge",
  PLAYBOOK: "Bundles Procedures, Directives & Knowledge into a strategy",
  PREFERENCE: "Shapes how Procedures & Playbooks are executed",
  RESEARCH: "Feeds into Knowledge; informs Directives & Playbooks",
  PRINCIPLE: "Guides Directives & Playbooks; shapes Preferences",
};


export const CATEGORY_COLORS: Record<ContextCategory, string> = {
  KNOWLEDGE: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  RESEARCH: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  DIRECTIVE: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  PRINCIPLE: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  PROCEDURE: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  PLAYBOOK: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  PREFERENCE: "bg-pink-500/10 text-pink-400 border-pink-500/30",
};

// ─── Preference Keys ─────────────────────────────────────────────────────────
export const PREFERENCE_KEYS = [
  "tone",
  "communication_style",
  "response_depth",
  "focus_areas",
  "excluded_topics",
  "preferred_frameworks",
  "output_format",
  "principles",
  "prohibitions",
  "expertise",
  "past_experiences",
  "tools_and_platforms",
  "collaboration_style",
  "decision_style",
] as const;

export type PreferenceKey = (typeof PREFERENCE_KEYS)[number];

export const PREFERENCE_KEY_LABELS: Record<PreferenceKey, string> = {
  tone: "Tone & Voice",
  communication_style: "Communication Style",
  response_depth: "Response Depth",
  focus_areas: "Focus Areas",
  excluded_topics: "Topics to Skip",
  preferred_frameworks: "Preferred Frameworks",
  output_format: "Output Format",
  principles: "Principles",
  prohibitions: "Prohibitions",
  expertise: "Expertise",
  past_experiences: "Past Experiences",
  tools_and_platforms: "Tools & Platforms",
  collaboration_style: "Collaboration Style",
  decision_style: "Decision Style",
};

// ─── Scope Levels ────────────────────────────────────────────────────────────
export const SCOPE_LEVELS = ["personal", "team", "organization"] as const;
export type ScopeLevel = (typeof SCOPE_LEVELS)[number];

// ─── Extraction Source Types ─────────────────────────────────────────────────
export const EXTRACTION_SOURCE_TYPES = [
  "document",     // Personal document upload
  "chat",         // From a workbook chat conversation
  "task",         // From workbook task output
  "research",     // From research lens findings
  "manual",       // User-initiated capture
  "loom",         // Knowledge Loom bulk import
] as const;

export type ExtractionSourceType = (typeof EXTRACTION_SOURCE_TYPES)[number];

// ─── Extraction Data Interfaces ──────────────────────────────────────────────
export interface ExtractedPreference {
  preference_key: string;
  preference_value: string;
  condition_label?: string;
}

export interface ExtractedContextItem {
  title: string;
  content: string;
  category: ContextCategory;
  /** Suggested execution order within a playbook's protocol (1-based). Only meaningful for PROCEDURE items. */
  step_order_hint?: number;
  /** true if this content was AI-generated to fill a gap, not from the source document */
  is_suggestion?: boolean;
  /** EXACT title of the parent PLAYBOOK this item belongs to within the same bundle.
   *  REQUIRED for PROCEDURE and DIRECTIVE items. Unset for PLAYBOOKs themselves and shared context items. */
  parent_playbook_title?: string;
}

// ─── Bundle Readiness ────────────────────────────────────────────────────────
export type BundleReadiness = "protocol-ready" | "needs-steps" | "context-only" | "skeleton";

export const BUNDLE_READINESS_META: Record<BundleReadiness, { label: string; icon: string; color: string; description: string }> = {
  "protocol-ready": { label: "Protocol-Ready", icon: "🟢", color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10", description: "Has a driver + execution steps — ready to deploy" },
  "needs-steps":    { label: "Needs Steps",    icon: "🟡", color: "border-amber-500/30 text-amber-400 bg-amber-500/10",     description: "Has a driver but no execution steps" },
  "context-only":   { label: "Context Only",   icon: "🔵", color: "border-blue-500/30 text-blue-400 bg-blue-500/10",        description: "No protocol driver — passive context only" },
  "skeleton":       { label: "Skeleton",       icon: "⚪", color: "border-muted-foreground/30 text-muted-foreground bg-muted/30", description: "Structure detected, content pending" },
};

/** Compute readiness from a bundle's items */
export function computeBundleReadiness(items: ExtractedContextItem[], completeness?: string): BundleReadiness {
  if (completeness === "skeleton") return "skeleton";
  const playbookCount = items.filter(i => i.category === "PLAYBOOK").length;
  const hasProcedure = items.some(i => i.category === "PROCEDURE");
  if (playbookCount > 0 && hasProcedure) return "protocol-ready";
  if (playbookCount > 0) return "needs-steps";
  return "context-only";
}

export interface ExtractedBundle {
  title: string;
  description: string;
  scope_suggestion?: ScopeLevel;
  content_completeness?: "full" | "partial" | "skeleton";
  coverage_gaps?: string[];
  items: ExtractedContextItem[];
}

export interface AdvisorPersona {
  persona_title: string;
  domain: string;
  expertise_areas: string[];
  extraction_guidance: string;
  category_hints: {
    likely_playbooks: string;
    likely_procedures: string;
    likely_directives: string;
    likely_knowledge: string;
  };
  icon_suggestion: string;
}

export type ExtractionDepth = "quick" | "guided" | "deep";

export const EXTRACTION_DEPTH_META: Record<ExtractionDepth, { label: string; description: string; icon: string }> = {
  quick: { label: "Quick Scan", description: "Fast extraction, no domain advisor", icon: "⚡" },
  guided: { label: "Guided Extract", description: "Domain advisor enhances categorization", icon: "🎯" },
  deep: { label: "Deep Analysis", description: "Thorough extraction + advisor + refinement", icon: "🔬" },
};

// ─── Bundle Match Types ──────────────────────────────────────────────────────
export type BundleMatchType = "exact" | "consolidate" | "new" | "absorb";

export interface BundleMatch {
  extracted_index: number;
  match_type: BundleMatchType;
  target_bundle_id?: string;
  target_bundle_title?: string;
  consolidate_with?: number[];
  confidence: number;
  reason: string;
  suggested_merged_title?: string;
}

export interface SkeletonSection {
  label: string;
  level: number;
  is_bundle_candidate: boolean;
  playbook_candidates?: { title: string; rationale: string }[];
  content_density: "rich" | "moderate" | "sparse" | "empty";
  child_count: number;
  page_or_slide_range?: string;
}

export interface DocumentStructureSkeleton {
  structure_type: "toc" | "presentation" | "hierarchical" | "phased" | "tabular" | "flat";
  confidence: "high" | "medium" | "low";
  total_sections_detected: number;
  skeleton?: SkeletonSection[];
  notes?: string;
}

export interface ExtractionResult {
  analysis_notes?: string;
  preferences: ExtractedPreference[];
  context_items: ExtractedContextItem[];
  bundles?: ExtractedBundle[];
  advisor?: AdvisorPersona;
  extraction_depth?: ExtractionDepth;
  /** Bundle match suggestions from the matching engine */
  bundle_matches?: BundleMatch[];
  /** Document structure detected in pre-pass */
  document_structure?: DocumentStructureSkeleton;
  /** Chunk processing info (for multi-chunk extractions) */
  chunk_info?: { total: number; processed: number };
}

// ─── Import Copilot Props ────────────────────────────────────────────────────
export interface ImportCopilotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ExtractionResult | null;
  /** Display label for the source (e.g. filename, chat title, task title) */
  sourceName: string;
  /** Where this extraction originated */
  sourceType: ExtractionSourceType;
}
