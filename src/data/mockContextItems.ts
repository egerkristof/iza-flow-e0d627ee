import type { Database } from "@/integrations/supabase/types";

export type ContextCategory = Database["public"]["Enums"]["context_category"] | "RESEARCH";
type ActionLogic = Database["public"]["Enums"]["action_logic"];
type PriorityLevel = Database["public"]["Enums"]["priority_level"];
type SecurityScope = Database["public"]["Enums"]["security_scope"];

export interface MockContextItem {
  id: string;
  title: string;
  category: ContextCategory;
  priority: PriorityLevel;
  security_level: SecurityScope;
  action_type: ActionLogic;
  bundle_id: string | null;
  bundle_ids: string[];
  domain_tags: string[];
  trigger_intent: string | null;
  content_preview: string;
  last_used_at: string | null;
  version: string;
  created_at: string;
  parent_playbook_id?: string | null;
  sort_order?: number;
  target_reference_id?: string | null;
}

export interface MockBundle {
  id: string;
  title: string;
  description: string;
  scope_level: string;
  version: string;
  health_score: number;
  item_count: number;
  domain_tags: string[];
  created_at: string;
}

export const MOCK_BUNDLES: MockBundle[] = [
  { id: "b1", title: "Sales Playbook Suite", description: "Core sales processes, pricing models, and proposal templates", scope_level: "org", version: "v2.3", health_score: 0.92, item_count: 8, domain_tags: ["sales", "pricing"], created_at: "2025-12-01" },
  { id: "b2", title: "Client Success Kit", description: "Onboarding flows, health monitoring, retention strategies", scope_level: "domain", version: "v1.8", health_score: 0.85, item_count: 6, domain_tags: ["cs", "onboarding"], created_at: "2025-11-15" },
  { id: "b3", title: "Compliance & Governance", description: "Regulatory directives, data handling, audit procedures", scope_level: "org", version: "v3.0", health_score: 0.78, item_count: 5, domain_tags: ["legal", "compliance"], created_at: "2025-10-20" },
  { id: "b4", title: "Engineering Standards", description: "Code review guidelines, deployment checklists, architecture decisions", scope_level: "team", version: "v1.2", health_score: 0.65, item_count: 4, domain_tags: ["engineering"], created_at: "2026-01-10" },
];

export const MOCK_CONTEXT_ITEMS: MockContextItem[] = [
  { id: "ci1", title: "Enterprise Pricing Protocol", category: "PLAYBOOK", priority: "CRITICAL", security_level: "CONFIDENTIAL", action_type: "OVERRIDE", bundle_id: "b1", bundle_ids: ["b1"], domain_tags: ["sales", "pricing"], trigger_intent: "pricing negotiation", content_preview: "When handling enterprise deals above $100K ARR, follow the tiered approval matrix…", last_used_at: "2h ago", version: "v2.1", created_at: "2025-12-05" },
  { id: "ci2", title: "Discovery Call Framework", category: "PROCEDURE", priority: "STANDARD", security_level: "INTERNAL", action_type: "APPEND", bundle_id: "b1", bundle_ids: ["b1"], domain_tags: ["sales"], trigger_intent: "discovery call", content_preview: "Structure discovery calls using the MEDDPICC framework: Metrics, Economic Buyer…", last_used_at: "5h ago", version: "v1.4", created_at: "2025-12-10" },
  { id: "ci3", title: "Competitor Battlecard: Acme Corp", category: "KNOWLEDGE", priority: "STANDARD", security_level: "CONFIDENTIAL", action_type: "APPEND", bundle_id: "b1", bundle_ids: ["b1"], domain_tags: ["sales", "competitive"], trigger_intent: "competitive deal", content_preview: "Acme Corp weaknesses: limited API integrations, no SOC2 compliance, higher TCO…", last_used_at: "1d ago", version: "v3.2", created_at: "2025-11-20" },
  { id: "ci4", title: "Never Discount Below 15%", category: "DIRECTIVE", priority: "CRITICAL", security_level: "ADMIN_ONLY", action_type: "BLOCK", bundle_id: "b1", bundle_ids: ["b1", "b3"], domain_tags: ["sales", "pricing"], trigger_intent: "discount request", content_preview: "Under no circumstances should reps offer discounts below 15% without VP approval…", last_used_at: "3h ago", version: "v1.0", created_at: "2025-10-01" },
  { id: "ci5", title: "Client Onboarding Checklist", category: "PROCEDURE", priority: "STANDARD", security_level: "INTERNAL", action_type: "APPEND", bundle_id: "b2", bundle_ids: ["b2"], domain_tags: ["cs", "onboarding"], trigger_intent: "new client setup", content_preview: "Week 1: Kickoff call, access provisioning. Week 2: Data migration…", last_used_at: "8h ago", version: "v2.0", created_at: "2025-11-15" },
  { id: "ci6", title: "Health Score Calculation", category: "KNOWLEDGE", priority: "STANDARD", security_level: "INTERNAL", action_type: "APPEND", bundle_id: "b2", bundle_ids: ["b2"], domain_tags: ["cs"], trigger_intent: null, content_preview: "Health score = 0.3*usage + 0.25*engagement + 0.2*support_tickets + 0.25*NPS…", last_used_at: "2d ago", version: "v1.1", created_at: "2025-11-20" },
  { id: "ci7", title: "GDPR Data Handling Directive", category: "DIRECTIVE", priority: "CRITICAL", security_level: "ADMIN_ONLY", action_type: "OVERRIDE", bundle_id: "b3", bundle_ids: ["b3"], domain_tags: ["legal", "compliance"], trigger_intent: "data processing", content_preview: "All PII must be encrypted at rest and in transit. Retention period: 36 months max…", last_used_at: "4d ago", version: "v3.0", created_at: "2025-10-20" },
  { id: "ci8", title: "Quarterly Audit Procedure", category: "PROCEDURE", priority: "STANDARD", security_level: "CONFIDENTIAL", action_type: "APPEND", bundle_id: "b3", bundle_ids: ["b3"], domain_tags: ["compliance"], trigger_intent: null, content_preview: "Run compliance audit every Q1/Q3. Checklist: access logs, data retention…", last_used_at: "2w ago", version: "v2.5", created_at: "2025-09-15" },
  { id: "ci9", title: "Code Review Standards", category: "PROCEDURE", priority: "STANDARD", security_level: "INTERNAL", action_type: "APPEND", bundle_id: "b4", bundle_ids: ["b4"], domain_tags: ["engineering"], trigger_intent: "code review", content_preview: "All PRs require 2 approvals. Security-sensitive changes require CODEOWNER review…", last_used_at: "6h ago", version: "v1.2", created_at: "2026-01-10" },
  { id: "ci10", title: "Preferred Communication Style", category: "PREFERENCE", priority: "STANDARD", security_level: "INTERNAL", action_type: "APPEND", bundle_id: null, bundle_ids: [], domain_tags: ["general"], trigger_intent: null, content_preview: "Use concise, bullet-point format. Avoid jargon. Lead with the recommendation…", last_used_at: "1h ago", version: "v1.0", created_at: "2026-01-20" },
  { id: "ci11", title: "Proposal Template v3", category: "PLAYBOOK", priority: "STANDARD", security_level: "INTERNAL", action_type: "APPEND", bundle_id: "b1", bundle_ids: ["b1"], domain_tags: ["sales"], trigger_intent: "proposal creation", content_preview: "Use the standard 8-section format: Exec Summary, Problem Statement, Solution…", last_used_at: "12h ago", version: "v3.0", created_at: "2025-12-15" },
  { id: "ci12", title: "Escalation Playbook", category: "PLAYBOOK", priority: "CRITICAL", security_level: "CONFIDENTIAL", action_type: "OVERRIDE", bundle_id: "b2", bundle_ids: ["b2", "b3"], domain_tags: ["cs", "support"], trigger_intent: "customer escalation", content_preview: "P1: Respond within 1h, VP notified. P2: Respond within 4h, Manager loop-in…", last_used_at: "3d ago", version: "v1.5", created_at: "2025-11-25" },
];

export const ALL_DOMAIN_TAGS = Array.from(new Set(MOCK_CONTEXT_ITEMS.flatMap(i => i.domain_tags))).sort();
export const ALL_CATEGORIES = ["DIRECTIVE", "KNOWLEDGE", "PROCEDURE", "PLAYBOOK", "PREFERENCE", "RESEARCH", "PRINCIPLE"] as string[];
