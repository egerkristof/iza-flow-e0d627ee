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
}

export interface ExtractedBundle {
  title: string;
  description: string;
  scope_suggestion?: ScopeLevel;
  items: ExtractedContextItem[];
}

export interface ExtractionResult {
  analysis_notes?: string;
  preferences: ExtractedPreference[];
  context_items: ExtractedContextItem[];
  bundles?: ExtractedBundle[];
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
