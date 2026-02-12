import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, BookUp, Loader2, Sparkles, Package, ChevronDown, ChevronRight, FolderPlus, Pencil, Check, Brain, Globe, Users, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  type ExtractionResult,
  type ExtractedPreference,
  type ExtractedContextItem,
  type ExtractedBundle,
  type ImportCopilotProps,
  type ContextCategory,
  CONTEXT_CATEGORIES,
  CATEGORY_COLORS,
  PREFERENCE_KEY_LABELS,
} from "@/lib/knowledge-schema";

const SOURCE_TYPE_LABELS: Record<string, string> = {
  document: "Document",
  chat: "Chat",
  task: "Task",
  research: "Research",
  manual: "Manual",
  loom: "Knowledge Loom",
};

export function ImportCopilotDialog({ open, onOpenChange, data, sourceName, sourceType }: ImportCopilotProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [selectedPrefs, setSelectedPrefs] = useState<Set<number>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectedBundles, setSelectedBundles] = useState<Set<number>>(new Set());
  const [expandedBundles, setExpandedBundles] = useState<Set<number>>(new Set());
  const [itemBundleAssignment, setItemBundleAssignment] = useState<Record<number, string>>({});

  const [itemEdits, setItemEdits] = useState<Record<number, Partial<ExtractedContextItem>>>({});
  const [bundleItemEdits, setBundleItemEdits] = useState<Record<string, Partial<ExtractedContextItem>>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const { data: existingBundles = [] } = useQuery({
    queryKey: ["bundles", user?.id],
    enabled: !!user && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bundles")
        .select("id, title, scope_level")
        .eq("owner_id", user!.id)
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  const resolveItem = (original: ExtractedContextItem, edits?: Partial<ExtractedContextItem>): ExtractedContextItem => ({
    ...original,
    ...edits,
  });

  const initSelections = () => {
    if (data) {
      setSelectedPrefs(new Set(data.preferences.map((_, i) => i)));
      setSelectedItems(new Set(data.context_items.map((_, i) => i)));
      setSelectedBundles(new Set((data.bundles || []).map((_, i) => i)));
      setExpandedBundles(new Set());
      setItemBundleAssignment({});
      setItemEdits({});
      setBundleItemEdits({});
      setEditingKey(null);
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
  const setItemAssignment = (itemIdx: number, value: string) => {
    setItemBundleAssignment(prev => ({ ...prev, [itemIdx]: value }));
  };

  const updateItemEdit = (idx: number, field: keyof ExtractedContextItem, value: string) => {
    setItemEdits(prev => ({ ...prev, [idx]: { ...prev[idx], [field]: value } }));
  };

  const updateBundleItemEdit = (bundleIdx: number, itemIdx: number, field: keyof ExtractedContextItem, value: string) => {
    const key = `${bundleIdx}-${itemIdx}`;
    setBundleItemEdits(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user || !data) return;

      const prefsToSave = data.preferences.filter((_, i) => selectedPrefs.has(i));
      if (prefsToSave.length > 0) {
        const { error } = await supabase.from("working_preferences").insert(
          prefsToSave.map(p => ({
            user_id: user.id,
            preference_key: p.preference_key,
            preference_value: p.preference_value,
            condition_label: p.condition_label || null,
            description: `Extracted from ${sourceType}: ${sourceName}`,
            scope_type: "global",
          }))
        );
        if (error) throw error;
      }

      const createdBundleIds: Record<number, string> = {};
      const extractedBundles = data.bundles || [];
      for (const [i, bundle] of extractedBundles.entries()) {
        if (!selectedBundles.has(i)) continue;

        const { data: newBundle, error: bundleErr } = await supabase
          .from("bundles")
          .insert({
            owner_id: user.id,
            title: bundle.title,
            description: bundle.description,
            scope_level: bundle.scope_suggestion || "draft",
          })
          .select("id")
          .single();
        if (bundleErr) throw bundleErr;
        createdBundleIds[i] = newBundle.id;

        if (bundle.items.length > 0) {
          const { error: itemsErr } = await supabase.from("context_items").insert(
            bundle.items.map((ci, j) => {
              const resolved = resolveItem(ci, bundleItemEdits[`${i}-${j}`]);
              return {
                owner_id: user.id,
                title: resolved.title,
                content_full: resolved.content,
                category: resolved.category as any,
                action_type: "APPEND" as any,
                bundle_id: newBundle.id,
              };
            })
          );
          if (itemsErr) throw itemsErr;
        }
      }

      const itemsToSave = data.context_items
        .map((ci, i) => ({ ci, i }))
        .filter(({ i }) => selectedItems.has(i));

      if (itemsToSave.length > 0) {
        const rows = itemsToSave.map(({ ci, i }) => {
          const resolved = resolveItem(ci, itemEdits[i]);
          const assignment = itemBundleAssignment[i];
          let bundleId: string | null = null;
          if (assignment && assignment !== "none") {
            if (assignment.startsWith("new-")) {
              const bundleIdx = parseInt(assignment.replace("new-", ""), 10);
              bundleId = createdBundleIds[bundleIdx] || null;
            } else {
              bundleId = assignment;
            }
          }
          return {
            owner_id: user.id,
            title: resolved.title,
            content_full: resolved.content,
            category: resolved.category as any,
            action_type: "APPEND" as any,
            bundle_id: bundleId,
          };
        });
        const { error } = await supabase.from("context_items").insert(rows);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["working-preferences"] });
      qc.invalidateQueries({ queryKey: ["context-items"] });
      qc.invalidateQueries({ queryKey: ["bundles"] });
      const parts: string[] = [];
      if (selectedPrefs.size > 0) parts.push(`${selectedPrefs.size} preference${selectedPrefs.size !== 1 ? "s" : ""}`);
      if (selectedItems.size > 0) parts.push(`${selectedItems.size} context item${selectedItems.size !== 1 ? "s" : ""}`);
      if (selectedBundles.size > 0) parts.push(`${selectedBundles.size} bundle${selectedBundles.size !== 1 ? "s" : ""}`);
      toast({ title: "Import complete", description: `${parts.join(", ")} added to your knowledge graph.` });
      onOpenChange(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  if (!data) return null;

  const bundles = data.bundles || [];
  const totalSelected = selectedPrefs.size + selectedItems.size + selectedBundles.size;
  const totalBundleItems = bundles.reduce((sum, b, i) => sum + (selectedBundles.has(i) ? b.items.length : 0), 0);
  const assignedCount = Object.entries(itemBundleAssignment).filter(
    ([idx, val]) => selectedItems.has(Number(idx)) && val && val !== "none"
  ).length;

  const renderEditableItem = (
    item: ExtractedContextItem,
    edits: Partial<ExtractedContextItem> | undefined,
    editKey: string,
    onUpdate: (field: keyof ExtractedContextItem, value: string) => void,
    compact?: boolean,
  ) => {
    const resolved = resolveItem(item, edits);
    const isEditing = editingKey === editKey;
    const textSize = compact ? "text-xs" : "text-sm";
    const contentSize = compact ? "text-[11px]" : "text-xs";

    if (isEditing) {
      return (
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Input
              value={resolved.title}
              onChange={e => onUpdate("title", e.target.value)}
              className="h-7 text-xs"
              placeholder="Title"
            />
            <Select
              value={resolved.category}
              onValueChange={v => onUpdate("category", v)}
            >
              <SelectTrigger className="h-7 text-[11px] w-36 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTEXT_CATEGORIES.map(c => (
                  <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingKey(null); }}
            >
              <Check className="h-3 w-3 text-primary" />
            </Button>
          </div>
          <Textarea
            value={resolved.content}
            onChange={e => onUpdate("content", e.target.value)}
            rows={2}
            className="text-xs resize-none"
            placeholder="Content"
          />
        </div>
      );
    }

    return (
      <div className="min-w-0 flex-1 group/edit">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`${textSize} font-medium`}>{resolved.title}</span>
          <Badge variant="outline" className={`text-[${compact ? "9" : "10"}px] ${CATEGORY_COLORS[resolved.category] || ""}`}>
            {resolved.category}
          </Badge>
          {edits && Object.keys(edits).length > 0 && (
            <Badge variant="secondary" className="text-[9px]">edited</Badge>
          )}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingKey(editKey); }}
            className="opacity-0 group-hover/edit:opacity-100 transition-opacity p-0.5 rounded hover:bg-secondary/50"
            title="Edit"
          >
            <Pencil className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
        <p className={`${contentSize} mt-1 text-muted-foreground ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
          {resolved.content}
        </p>
      </div>
    );
  };

  const sourceLabel = SOURCE_TYPE_LABELS[sourceType] || sourceType;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Import Copilot — {sourceName}
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            <Badge variant="secondary" className="text-[9px] mr-1.5">{sourceLabel}</Badge>
            AI extracted {data.preferences.length} preferences, {data.context_items.length} standalone items, and {bundles.length} bundles.
            Select what to keep — hover any item to edit.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 -mx-6 px-6" style={{ maxHeight: "calc(85vh - 200px)" }}>
          {/* AI Analysis Notes */}
          {data.analysis_notes && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex gap-2.5">
              <Brain className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-primary mb-1">Knowledge Architect Analysis</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{data.analysis_notes}</p>
              </div>
            </div>
          )}

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
                        {PREFERENCE_KEY_LABELS[p.preference_key as keyof typeof PREFERENCE_KEY_LABELS] ?? p.preference_key}
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
                        {bundle.scope_suggestion && (
                          <Badge variant="secondary" className="text-[9px] gap-0.5">
                            {bundle.scope_suggestion === "organization" ? <Globe className="h-2.5 w-2.5" /> : bundle.scope_suggestion === "team" ? <Users className="h-2.5 w-2.5" /> : <User className="h-2.5 w-2.5" />}
                            {bundle.scope_suggestion}
                          </Badge>
                        )}
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

                  {expandedBundles.has(i) && (
                    <div className="border-t border-border/30 px-3 pb-3 pt-2 space-y-1.5 ml-8">
                      {bundle.items.map((item, j) => (
                        <div
                          key={j}
                          className="rounded border border-border/30 bg-background/50 p-2.5"
                        >
                          {renderEditableItem(
                            item,
                            bundleItemEdits[`${i}-${j}`],
                            `bundle-${i}-${j}`,
                            (field, value) => updateBundleItemEdit(i, j, field, value),
                            true,
                          )}
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
                <div
                  key={i}
                  className={`rounded-md border p-3 transition-colors ${
                    selectedItems.has(i) ? "border-primary/30 bg-primary/5" : "border-border/50 bg-muted/10 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox checked={selectedItems.has(i)} onCheckedChange={() => toggleItem(i)} className="mt-0.5" />
                    {renderEditableItem(
                      ci,
                      itemEdits[i],
                      `standalone-${i}`,
                      (field, value) => updateItemEdit(i, field, value),
                    )}
                  </div>

                  {selectedItems.has(i) && (existingBundles.length > 0 || bundles.length > 0) && (
                    <div className="mt-2 ml-8 flex items-center gap-2">
                      <FolderPlus className="h-3 w-3 text-muted-foreground shrink-0" />
                      <Select
                        value={itemBundleAssignment[i] || "none"}
                        onValueChange={(v) => setItemAssignment(i, v)}
                      >
                        <SelectTrigger className="h-7 text-[11px] w-56">
                          <SelectValue placeholder="No bundle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" className="text-xs">No bundle (standalone)</SelectItem>
                          {existingBundles.length > 0 && (
                            <>
                              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                Existing Bundles
                              </div>
                              {existingBundles.map(b => (
                                <SelectItem key={b.id} value={b.id} className="text-xs">
                                  {b.title}
                                  <span className="text-muted-foreground ml-1">({b.scope_level})</span>
                                </SelectItem>
                              ))}
                            </>
                          )}
                          {bundles.length > 0 && (
                            <>
                              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                New Bundles (from this extraction)
                              </div>
                              {bundles.map((b, bi) => (
                                <SelectItem key={`new-${bi}`} value={`new-${bi}`} className="text-xs">
                                  ✨ {b.title}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border/50 pt-3">
          <div className="flex items-center gap-2 flex-1 text-[10px] text-muted-foreground">
            {totalBundleItems > 0 && (
              <span>{selectedBundles.size} bundle{selectedBundles.size !== 1 ? "s" : ""} ({totalBundleItems} items)</span>
            )}
            {assignedCount > 0 && (
              <span>· {assignedCount} item{assignedCount !== 1 ? "s" : ""} assigned to bundles</span>
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
