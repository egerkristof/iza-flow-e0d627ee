import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BookOpen, ChevronDown, ChevronRight, Download, Sparkles, Zap, Hash, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateRule {
  preference_key: string;
  preference_value: string;
  condition_label?: string;
  trigger_intents?: string[];
  trigger_keywords?: string[];
  bound_playbook_ids?: string[];
  scope_type?: string;
  description?: string;
}

interface RoleTemplate {
  id: string;
  role: string;
  emoji: string;
  description: string;
  rules: TemplateRule[];
}

const TEMPLATES: RoleTemplate[] = [
  {
    id: "real_estate_agent",
    role: "Real Estate Agent",
    emoji: "🏠",
    description: "Listing descriptions, buyer communication, market analysis",
    rules: [
      { preference_key: "tone", preference_value: "Aspirational and premium for luxury properties; warm and inviting for family homes; practical and value-focused for investment properties", condition_label: "property listings", trigger_intents: ["create listing", "create social media post"], trigger_keywords: ["property", "listing", "real estate", "home"] },
      { preference_key: "communication_style", preference_value: "Personable, empathetic, highlight lifestyle benefits over specs. Lead with the dream, follow with the details.", condition_label: "buyer outreach", trigger_intents: ["draft email"], trigger_keywords: ["buyer", "client", "showing"] },
      { preference_key: "output_format", preference_value: "Comparative market analysis in structured tables with price/sqft, days-on-market, and trend indicators", condition_label: "market analysis", trigger_intents: ["analyze pricing", "prepare report"], trigger_keywords: ["market", "comps", "pricing", "valuation"] },
      { preference_key: "focus_areas", preference_value: "Location advantages, ROI potential, school districts, neighborhood trends, property condition", scope_type: "global" },
      { preference_key: "excluded_topics", preference_value: "Avoid specific financial advice, mortgage rate predictions, or guaranteed appreciation claims", scope_type: "global" },
    ],
  },
  {
    id: "sales_rep",
    role: "Sales Representative",
    emoji: "💼",
    description: "Proposals, discovery calls, competitive positioning, deal reviews",
    rules: [
      { preference_key: "tone", preference_value: "Confident, consultative, solution-oriented. Mirror the prospect's level of formality.", condition_label: "prospect communication", trigger_intents: ["draft email", "write proposal"], trigger_keywords: ["prospect", "deal", "pipeline"] },
      { preference_key: "communication_style", preference_value: "Lead with business impact and ROI. Use MEDDIC/BANT frameworks. Keep emails under 150 words.", condition_label: "outbound sales", trigger_intents: ["draft email"], trigger_keywords: ["outreach", "follow-up", "cold"] },
      { preference_key: "output_format", preference_value: "Executive summary format: problem → solution → proof points → next steps. Bullet points over paragraphs.", condition_label: "proposals", trigger_intents: ["write proposal"], trigger_keywords: ["proposal", "pitch", "rfp"] },
      { preference_key: "preferred_frameworks", preference_value: "MEDDIC for qualification, Challenger Sale for positioning, SPIN for discovery questions", scope_type: "global" },
      { preference_key: "focus_areas", preference_value: "Competitive differentiation, time-to-value, customer success stories, pricing justification", scope_type: "global" },
      { preference_key: "response_depth", preference_value: "Battlecard format: strengths, weaknesses, landmines, counter-objections in concise grid", condition_label: "competitive intel", trigger_intents: ["prepare report"], trigger_keywords: ["competitor", "battlecard", "objection"] },
    ],
  },
  {
    id: "consultant",
    role: "Management Consultant",
    emoji: "📊",
    description: "Structured analysis, client deliverables, strategic frameworks",
    rules: [
      { preference_key: "tone", preference_value: "Authoritative, precise, insight-driven. McKinsey-style clarity — every sentence must earn its place.", condition_label: "client deliverables", trigger_intents: ["prepare report", "build presentation"], trigger_keywords: ["deliverable", "client", "engagement"] },
      { preference_key: "preferred_frameworks", preference_value: "MECE for structuring, Porter's Five Forces for industry analysis, BCG Matrix for portfolio, OKRs for goal-setting", scope_type: "global" },
      { preference_key: "output_format", preference_value: "Pyramid principle: answer first, then supporting evidence. Use exhibit-style charts with clear 'so what' callouts.", condition_label: "presentations", trigger_intents: ["build presentation", "prepare report"] },
      { preference_key: "communication_style", preference_value: "Hypothesis-driven. State the recommendation upfront, then defend with data. Avoid hedging language.", condition_label: "strategic memos", trigger_intents: ["draft email", "prepare report"], trigger_keywords: ["memo", "strategy", "recommendation"] },
      { preference_key: "response_depth", preference_value: "Deep-dive with executive summary. Include implications, risks, and 3 concrete next steps.", scope_type: "global" },
    ],
  },
  {
    id: "marketing_manager",
    role: "Marketing Manager",
    emoji: "📢",
    description: "Campaign copy, content strategy, brand voice, analytics reporting",
    rules: [
      { preference_key: "tone", preference_value: "On-brand, audience-aware. Punchy for social, authoritative for thought leadership, conversational for email nurture.", condition_label: "content creation", trigger_intents: ["create social media post", "draft email"], trigger_keywords: ["content", "campaign", "copy", "brand"] },
      { preference_key: "output_format", preference_value: "Platform-specific formats: Twitter ≤280 chars, LinkedIn 1300 chars max, Instagram caption with hashtags, email with clear CTA", condition_label: "social media", trigger_intents: ["create social media post"], trigger_keywords: ["social", "post", "linkedin", "twitter"] },
      { preference_key: "focus_areas", preference_value: "Conversion metrics, audience engagement, brand consistency, A/B test insights, funnel stage alignment", scope_type: "global" },
      { preference_key: "response_depth", preference_value: "Dashboard-style: key metrics → trends → anomalies → recommended actions", condition_label: "analytics", trigger_intents: ["prepare report", "analyze pricing"], trigger_keywords: ["analytics", "metrics", "performance", "report"] },
    ],
  },
  {
    id: "project_manager",
    role: "Project Manager",
    emoji: "📋",
    description: "Status updates, stakeholder comms, risk management, planning",
    rules: [
      { preference_key: "communication_style", preference_value: "RAG status format (Red/Amber/Green). Lead with blockers and decisions needed. Keep updates scannable.", condition_label: "status updates", trigger_intents: ["prepare report", "draft email"], trigger_keywords: ["status", "update", "standup", "weekly"] },
      { preference_key: "output_format", preference_value: "Structured: milestones table, risk register with owner/impact/mitigation, RACI matrix for decisions", condition_label: "project planning", trigger_intents: ["prepare report", "build presentation"], trigger_keywords: ["plan", "milestone", "timeline", "roadmap"] },
      { preference_key: "tone", preference_value: "Direct, action-oriented, diplomatically honest about risks. No sugar-coating blockers.", scope_type: "global" },
      { preference_key: "focus_areas", preference_value: "Dependencies, critical path, resource allocation, risk mitigation, stakeholder alignment", scope_type: "global" },
    ],
  },
];

const PRESET_KEY_LABELS: Record<string, string> = {
  tone: "Tone & Voice", communication_style: "Communication Style", response_depth: "Response Depth",
  focus_areas: "Focus Areas", excluded_topics: "Topics to Skip", preferred_frameworks: "Preferred Frameworks",
  output_format: "Output Format",
};

export function PreferenceTemplateGallery() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());

  const importMutation = useMutation({
    mutationFn: async (template: RoleTemplate) => {
      const rows = template.rules.map((r) => ({
        user_id: user!.id,
        preference_key: r.preference_key,
        preference_value: r.preference_value,
        condition_label: r.condition_label ?? null,
        trigger_intents: r.trigger_intents ?? [],
        trigger_keywords: r.trigger_keywords ?? [],
        bound_playbook_ids: r.bound_playbook_ids ?? [],
        scope_type: r.scope_type ?? "global",
        description: r.description ?? `Imported from ${template.role} template`,
      }));
      const { error } = await supabase.from("working_preferences").insert(rows);
      if (error) throw error;
    },
    onSuccess: (_, template) => {
      qc.invalidateQueries({ queryKey: ["working-preferences"] });
      setImportedIds((prev) => new Set(prev).add(template.id));
      toast({ title: `${template.role} preferences imported`, description: `${template.rules.length} rules added to your working style.` });
    },
    onError: (e: any) => toast({ title: "Import failed", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => {
          const isImported = importedIds.has(t.id);
          const isExpanded = expandedTemplate === t.id;

          return (
            <div key={t.id} className="rounded-lg border border-border/50 bg-card overflow-hidden">
              <Collapsible open={isExpanded} onOpenChange={() => setExpandedTemplate(isExpanded ? null : t.id)}>
                <CollapsibleTrigger className="w-full text-left p-4 hover:bg-muted/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{t.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{t.role}</h4>
                        {isImported && <Badge className="bg-primary/20 text-primary text-[9px] gap-0.5"><Check className="h-2 w-2" />Imported</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-[10px]">{t.rules.length} rules</Badge>
                        {isExpanded ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="border-t border-border/50 px-4 py-3 space-y-2">
                    {t.rules.map((rule, i) => (
                      <div key={i} className="rounded-md bg-muted/20 px-3 py-2 text-xs space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{PRESET_KEY_LABELS[rule.preference_key] ?? rule.preference_key}</span>
                          {rule.condition_label && (
                            <Badge variant="outline" className="text-[9px] border-primary/30 text-primary">{rule.condition_label}</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{rule.preference_value}</p>
                        {(rule.trigger_intents?.length ?? 0) > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            <Zap className="h-2.5 w-2.5 text-primary shrink-0" />
                            {rule.trigger_intents!.map((intent) => (
                              <span key={intent} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{intent}</span>
                            ))}
                          </div>
                        )}
                        {(rule.trigger_keywords?.length ?? 0) > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            <Hash className="h-2.5 w-2.5 text-primary shrink-0" />
                            {rule.trigger_keywords!.map((kw) => (
                              <span key={kw} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{kw}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    <Button
                      size="sm"
                      className="w-full gap-1.5 mt-2"
                      disabled={isImported || importMutation.isPending}
                      onClick={(e) => { e.stopPropagation(); importMutation.mutate(t); }}
                    >
                      {isImported ? <><Check className="h-3.5 w-3.5" /> Imported</> : importMutation.isPending ? "Importing…" : <><Download className="h-3.5 w-3.5" /> Import {t.rules.length} Rules</>}
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </div>
  );
}
