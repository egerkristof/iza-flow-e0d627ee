import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles, X, Check, ArrowRight, Shield, RefreshCw, Loader2,
  Tag, FileText, Scissors, Merge, Archive, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/knowledge/CategoryBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface AuditSuggestion {
  item_id: string;
  type: "recategorize" | "enrich" | "split" | "merge" | "promote_mandate" | "archive";
  reason: string;
  suggested_category?: string;
  suggested_content?: string;
  merge_with_id?: string;
  enforcement_level?: string;
}

interface ContextCopilotPanelProps {
  items: any[];
  onClose: () => void;
}

const TYPE_META: Record<string, { icon: any; label: string; color: string }> = {
  recategorize: { icon: Tag, label: "Recategorize", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  enrich: { icon: FileText, label: "Enrich", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  split: { icon: Scissors, label: "Split", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  merge: { icon: Merge, label: "Merge", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  promote_mandate: { icon: Shield, label: "Promote to Mandate", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  archive: { icon: Archive, label: "Archive", color: "text-muted-foreground bg-muted/50 border-border" },
};

export function ContextCopilotPanel({ items, onClose }: ContextCopilotPanelProps) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [suggestions, setSuggestions] = useState<AuditSuggestion[]>([]);
  const [summary, setSummary] = useState("");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const auditMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("audit-context", {
        body: {
          action: "audit",
          items: items.map(i => ({
            id: i.id,
            title: i.title,
            content_full: i.content_full,
            category: i.category,
            priority: i.priority,
            is_mandate: i.is_mandate,
          })),
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data as { summary: string; suggestions: AuditSuggestion[] };
    },
    onSuccess: (data) => {
      setSuggestions(data.suggestions || []);
      setSummary(data.summary || "");
      setDismissed(new Set());
      setApplied(new Set());
    },
    onError: (e: any) => toast({ title: "Audit failed", description: e.message, variant: "destructive" }),
  });

  const applyMutation = useMutation({
    mutationFn: async (suggestion: AuditSuggestion) => {
      let action = "";
      let body: any = { item_id: suggestion.item_id };

      if (suggestion.type === "recategorize") {
        action = "apply_recategorize";
        body.new_category = suggestion.suggested_category;
      } else if (suggestion.type === "enrich") {
        action = "apply_enrich";
        body.enriched_content = suggestion.suggested_content;
      } else if (suggestion.type === "promote_mandate") {
        action = "apply_promote_mandate";
        body.enforcement_level = suggestion.enforcement_level || "required_ack";
      } else {
        throw new Error(`Apply not yet supported for ${suggestion.type} — use as guidance`);
      }

      const { data, error } = await supabase.functions.invoke("audit-context", {
        body: { action, ...body },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return suggestion;
    },
    onSuccess: (suggestion) => {
      setApplied(prev => new Set(prev).add(suggestion.item_id + suggestion.type));
      qc.invalidateQueries({ queryKey: ["my-context-items"] });
      qc.invalidateQueries({ queryKey: ["context-items"] });
      qc.invalidateQueries({ queryKey: ["mandates"] });
      toast({ title: "Applied", description: `${TYPE_META[suggestion.type].label} applied successfully.` });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const getItemTitle = (id: string) => items.find(i => i.id === id)?.title || "Unknown";
  const activeSuggestions = suggestions.filter(s => !dismissed.has(s.item_id + s.type));

  return (
    <div className="border border-primary/20 rounded-lg bg-card/80 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Knowledge Graph Copilot</span>
          {suggestions.length > 0 && (
            <Badge variant="secondary" className="text-[10px]">
              {activeSuggestions.length} suggestion{activeSuggestions.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => auditMutation.mutate()}
            disabled={auditMutation.isPending || items.length === 0}
          >
            {auditMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            {suggestions.length > 0 ? "Re-audit" : "Run Audit"}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {auditMutation.isPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing {items.length} items…
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>Click <strong>Run Audit</strong> to analyze your knowledge graph.</p>
            <p className="text-[10px] mt-1">The AI will scan {items.length} items and suggest improvements.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {summary && (
              <p className="text-xs text-muted-foreground bg-muted/30 rounded-md p-2 mb-3">{summary}</p>
            )}
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-2 pr-2">
                {activeSuggestions.map((s, idx) => {
                  const meta = TYPE_META[s.type];
                  const Icon = meta.icon;
                  const key = s.item_id + s.type;
                  const isApplied = applied.has(key);
                  const isExpanded = expandedIdx === idx;
                  const canApply = ["recategorize", "enrich", "promote_mandate"].includes(s.type);

                  return (
                    <div key={key} className={cn("rounded-md border p-2.5 transition-colors", isApplied ? "opacity-50" : "")}>
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className={cn("text-[9px] gap-0.5 shrink-0 mt-0.5", meta.color)}>
                          <Icon className="h-2.5 w-2.5" />
                          {meta.label}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{getItemTitle(s.item_id)}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{s.reason}</p>
                        </div>
                        <button onClick={() => setExpandedIdx(isExpanded ? null : idx)} className="shrink-0 text-muted-foreground hover:text-foreground">
                          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-2 pt-2 border-t border-border/30 space-y-2">
                          {s.type === "recategorize" && s.suggested_category && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">Suggested:</span>
                              <CategoryBadge category={s.suggested_category} />
                            </div>
                          )}
                          {s.type === "enrich" && s.suggested_content && (
                            <p className="text-[11px] bg-muted/30 rounded p-2 whitespace-pre-wrap max-h-32 overflow-auto">{s.suggested_content}</p>
                          )}
                          {s.type === "promote_mandate" && (
                            <div className="flex items-center gap-2 text-xs">
                              <Shield className="h-3 w-3 text-amber-400" />
                              <span className="text-muted-foreground">Enforcement:</span>
                              <Badge variant="outline" className="text-[9px]">{s.enforcement_level || "required_ack"}</Badge>
                            </div>
                          )}
                          {s.type === "split" && s.suggested_content && (
                            <p className="text-[11px] bg-muted/30 rounded p-2">{s.suggested_content}</p>
                          )}
                          {s.type === "merge" && s.merge_with_id && (
                            <p className="text-[11px] text-muted-foreground">Merge with: <strong>{getItemTitle(s.merge_with_id)}</strong></p>
                          )}

                          <div className="flex items-center gap-1.5 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-[10px] px-2"
                              onClick={() => setDismissed(prev => new Set(prev).add(key))}
                            >
                              Dismiss
                            </Button>
                            {canApply && !isApplied && (
                              <Button
                                size="sm"
                                className="h-6 text-[10px] px-2 gap-1"
                                onClick={() => applyMutation.mutate(s)}
                                disabled={applyMutation.isPending}
                              >
                                {applyMutation.isPending ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Check className="h-2.5 w-2.5" />}
                                Apply
                              </Button>
                            )}
                            {isApplied && (
                              <Badge variant="outline" className="text-[9px] text-emerald-400 border-emerald-500/30">
                                <Check className="h-2 w-2 mr-0.5" /> Applied
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
