import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings2, BookUp, Loader2, Sparkles, Package, ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExtractedPreference {
  preference_key: string;
  preference_value: string;
  condition_label?: string;
}

interface ExtractedContextItem {
  title: string;
  content: string;
  category: "KNOWLEDGE" | "RESEARCH" | "DIRECTIVE" | "PRINCIPLE" | "PROCEDURE";
}

interface ExtractedBundle {
  title: string;
  description: string;
  items: ExtractedContextItem[];
}

interface ExtractionResult {
  preferences: ExtractedPreference[];
  context_items: ExtractedContextItem[];
  bundles?: ExtractedBundle[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ExtractionResult | null;
  documentName: string;
}

const KEY_LABELS: Record<string, string> = {
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
};

const CATEGORY_COLORS: Record<string, string> = {
  KNOWLEDGE: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  RESEARCH: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  DIRECTIVE: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  PRINCIPLE: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  PROCEDURE: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
};

export function ExtractionReviewDialog({ open, onOpenChange, data, documentName }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedPrefs, setSelectedPrefs] = useState<Set<number>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectedBundles, setSelectedBundles] = useState<Set<number>>(new Set());
  const [expandedBundles, setExpandedBundles] = useState<Set<number>>(new Set());

  const initSelections = () => {
    if (data) {
      setSelectedPrefs(new Set(data.preferences.map((_, i) => i)));
      setSelectedItems(new Set(data.context_items.map((_, i) => i)));
      setSelectedBundles(new Set((data.bundles || []).map((_, i) => i)));
      setExpandedBundles(new Set());
    }
  };

  const handleOpenChange = (v: boolean) => {
    if (v && data) initSelections();
    onOpenChange(v);
  };

  const togglePref = (i: number) => {
    setSelectedPrefs(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };
  const toggleItem = (i: number) => {
    setSelectedItems(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };
  const toggleBundle = (i: number) => {
    setSelectedBundles(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };
  const toggleBundleExpand = (i: number) => {
    setExpandedBundles(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user || !data) return;

      // Save selected preferences
      const prefsToSave = data.preferences.filter((_, i) => selectedPrefs.has(i));
      if (prefsToSave.length > 0) {
        const { error } = await supabase.from("working_preferences").insert(
          prefsToSave.map(p => ({
            user_id: user.id,
            preference_key: p.preference_key,
            preference_value: p.preference_value,
            condition_label: p.condition_label || null,
            description: `Extracted from ${documentName}`,
            scope_type: "global",
          }))
        );
        if (error) throw error;
      }

      // Save selected standalone context items
      const itemsToSave = data.context_items.filter((_, i) => selectedItems.has(i));
      if (itemsToSave.length > 0) {
        const { error } = await supabase.from("context_items").insert(
          itemsToSave.map(ci => ({
            owner_id: user.id,
            title: ci.title,
            content_full: ci.content,
            category: ci.category as any,
            action_type: "APPEND" as any,
          }))
        );
        if (error) throw error;
      }

      // Save selected bundles — create the bundle, then its items linked to it
      const bundles = data.bundles || [];
      for (const [i, bundle] of bundles.entries()) {
        if (!selectedBundles.has(i)) continue;

        // Create the bundle
        const { data: newBundle, error: bundleErr } = await supabase
          .from("bundles")
          .insert({
            owner_id: user.id,
            title: bundle.title,
            description: bundle.description,
            scope_level: "draft",
          })
          .select("id")
          .single();
        if (bundleErr) throw bundleErr;

        // Create all items linked to this bundle
        if (bundle.items.length > 0) {
          const { error: itemsErr } = await supabase.from("context_items").insert(
            bundle.items.map(ci => ({
              owner_id: user.id,
              title: ci.title,
              content_full: ci.content,
              category: ci.category as any,
              action_type: "APPEND" as any,
              bundle_id: newBundle.id,
            }))
          );
          if (itemsErr) throw itemsErr;
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["working-preferences"] });
      qc.invalidateQueries({ queryKey: ["context-items"] });
      qc.invalidateQueries({ queryKey: ["bundles"] });
      const prefCount = selectedPrefs.size;
      const itemCount = selectedItems.size;
      const bundleCount = selectedBundles.size;
      const parts: string[] = [];
      if (prefCount > 0) parts.push(`${prefCount} preference${prefCount !== 1 ? "s" : ""}`);
      if (itemCount > 0) parts.push(`${itemCount} context item${itemCount !== 1 ? "s" : ""}`);
      if (bundleCount > 0) parts.push(`${bundleCount} bundle${bundleCount !== 1 ? "s" : ""}`);
      toast({
        title: "Extraction saved",
        description: `${parts.join(", ")} created.`,
      });
      onOpenChange(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (!data) return null;

  const bundles = data.bundles || [];
  const totalSelected = selectedPrefs.size + selectedItems.size + selectedBundles.size;
  const totalBundleItems = bundles.reduce((sum, b, i) => sum + (selectedBundles.has(i) ? b.items.length : 0), 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Review Extracted Items — {documentName}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            AI extracted {data.preferences.length} preferences, {data.context_items.length} standalone items, and {bundles.length} bundles. Select what to keep.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 -mx-6 px-6" style={{ maxHeight: "calc(85vh - 200px)" }}>
          {/* Preferences section */}
          {data.preferences.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Settings2 className="h-3 w-3" /> Working Preferences ({data.preferences.length})
              </h3>
              {data.preferences.map((p, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors ${
                    selectedPrefs.has(i) ? "border-primary/30 bg-primary/5" : "border-border/50 bg-muted/10 opacity-60"
                  }`}
                >
                  <Checkbox checked={selectedPrefs.has(i)} onCheckedChange={() => togglePref(i)} className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-[10px]">
                        {KEY_LABELS[p.preference_key] ?? p.preference_key}
                      </Badge>
                      {p.condition_label && (
                        <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
                          {p.condition_label}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs mt-1 text-foreground">{p.preference_value}</p>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Bundles section */}
          {bundles.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Package className="h-3 w-3" /> Bundles ({bundles.length})
              </h3>
              {bundles.map((bundle, i) => (
                <div
                  key={i}
                  className={`rounded-md border transition-colors ${
                    selectedBundles.has(i) ? "border-primary/30 bg-primary/5" : "border-border/50 bg-muted/10 opacity-60"
                  }`}
                >
                  {/* Bundle header */}
                  <div className="flex items-start gap-3 p-3">
                    <Checkbox
                      checked={selectedBundles.has(i)}
                      onCheckedChange={() => toggleBundle(i)}
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Package className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="text-sm font-medium">{bundle.title}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {bundle.items.length} item{bundle.items.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground">{bundle.description}</p>
                    </div>
                    <button
                      onClick={(e) => { e.preventDefault(); toggleBundleExpand(i); }}
                      className="p-1 rounded hover:bg-secondary/50 shrink-0"
                    >
                      {expandedBundles.has(i) ? (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Expanded bundle items */}
                  {expandedBundles.has(i) && (
                    <div className="border-t border-border/30 px-3 pb-3 pt-2 space-y-1.5 ml-8">
                      {bundle.items.map((item, j) => (
                        <div
                          key={j}
                          className="rounded border border-border/30 bg-background/50 p-2.5"
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-medium">{item.title}</span>
                            <Badge variant="outline" className={`text-[9px] ${CATEGORY_COLORS[item.category] || ""}`}>
                              {item.category}
                            </Badge>
                          </div>
                          <p className="text-[11px] mt-1 text-muted-foreground line-clamp-2">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Standalone Context Items section */}
          {data.context_items.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookUp className="h-3 w-3" /> Standalone Context Items ({data.context_items.length})
              </h3>
              {data.context_items.map((ci, i) => (
                <label
                  key={i}
                  className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer transition-colors ${
                    selectedItems.has(i) ? "border-primary/30 bg-primary/5" : "border-border/50 bg-muted/10 opacity-60"
                  }`}
                >
                  <Checkbox checked={selectedItems.has(i)} onCheckedChange={() => toggleItem(i)} className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{ci.title}</span>
                      <Badge variant="outline" className={`text-[10px] ${CATEGORY_COLORS[ci.category] || ""}`}>
                        {ci.category}
                      </Badge>
                    </div>
                    <p className="text-xs mt-1 text-muted-foreground line-clamp-3">{ci.content}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border/50 pt-3">
          <div className="flex items-center gap-2 flex-1 text-[10px] text-muted-foreground">
            {totalBundleItems > 0 && (
              <span>{selectedBundles.size} bundle{selectedBundles.size !== 1 ? "s" : ""} ({totalBundleItems} items)</span>
            )}
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={totalSelected === 0 || saveMutation.isPending}
            className="gap-1.5"
          >
            {saveMutation.isPending ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</>
            ) : (
              <>Save {totalSelected} item{totalSelected !== 1 ? "s" : ""}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { ExtractionResult };
