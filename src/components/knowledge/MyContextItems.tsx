import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen, Trash2, Plus, Search, Microscope, Sparkles,
  Tag, FileText, Shield, Loader2, MoreHorizontal, RefreshCw, CheckSquare, X, GitMerge, PackagePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryBadge } from "@/components/knowledge/CategoryBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ContextCopilotPanel } from "@/components/knowledge/ContextCopilotPanel";
import { DuplicateResolutionDialog, type ResolutionResult } from "@/components/knowledge/DuplicateResolutionDialog";
import { ImportCopilotDialog } from "@/components/knowledge/ImportCopilotDialog";
import { findDuplicates, type DuplicateMatch } from "@/lib/dedup";
import { type ExtractionResult } from "@/lib/knowledge-schema";
import { MergeItemsDialog } from "@/components/knowledge/MergeItemsDialog";

const CATEGORY_COLORS: Record<string, string> = {
  DIRECTIVE: "bg-destructive/10 text-destructive",
  KNOWLEDGE: "bg-info/10 text-info",
  PROCEDURE: "bg-warning/10 text-warning",
  PLAYBOOK: "bg-primary/10 text-primary",
  PREFERENCE: "bg-secondary text-secondary-foreground",
  RESEARCH: "bg-purple-500/10 text-purple-500",
};

export function MyContextItems() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("RESEARCH");
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [inlineLoading, setInlineLoading] = useState<string | null>(null);
  const [dupMatches, setDupMatches] = useState<DuplicateMatch[]>([]);
  const [dupDialogOpen, setDupDialogOpen] = useState(false);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [reanalyzing, setReanalyzing] = useState(false);

  // Import Copilot state for re-analysis results
  const [reanalysisResult, setReanalysisResult] = useState<ExtractionResult | null>(null);
  const [reanalysisOpen, setReanalysisOpen] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [autoBundling, setAutoBundling] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["my-context-items", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("context_items")
        .select("*")
        .eq("owner_id", user!.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch all bundle memberships for the user's items via junction table
  const { data: bundleMemberships = [] } = useQuery({
    queryKey: ["item-bundle-memberships", user?.id],
    enabled: !!user && items.length > 0,
    queryFn: async () => {
      const itemIds = items.map(i => i.id);
      const { data, error } = await supabase
        .from("context_item_bundles")
        .select("context_item_id, bundle_id, bundles(title)")
        .in("context_item_id", itemIds);
      if (error) throw error;
      return data ?? [];
    },
  });

  // Build a lookup: itemId -> bundle names
  const bundlesByItem = new Map<string, { id: string; title: string }[]>();
  for (const row of bundleMemberships) {
    const list = bundlesByItem.get(row.context_item_id) ?? [];
    const title = (row as any).bundles?.title ?? "Untitled";
    list.push({ id: row.bundle_id, title });
    bundlesByItem.set(row.context_item_id, list);
  }

  // Compute unbundled items (no junction table entries AND no legacy bundle_id)
  const bundledItemIds = new Set(bundleMemberships.map(r => r.context_item_id));
  const unbundledItems = items.filter(i => !bundledItemIds.has(i.id) && !i.bundle_id);


  const handleAutoBundle = async () => {
    if (unbundledItems.length < 3) return;
    setAutoBundling(true);
    try {
      const composedContent = unbundledItems.map(item =>
        `## ${item.title}\n**Category:** ${item.category} | **Priority:** ${item.priority}\n\n${item.content_full}`
      ).join("\n\n---\n\n");

      const { data, error } = await supabase.functions.invoke("extract-knowledge", {
        body: {
          source_type: "manual",
          content: composedContent,
          meta: {
            title: `Auto-Bundle analysis of ${unbundledItems.length} unbundled items`,
            source: "auto-bundle",
          },
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setReanalysisResult(data as ExtractionResult);
      setReanalysisOpen(true);
    } catch (e: any) {
      toast({ title: "Auto-Bundle failed", description: e.message, variant: "destructive" });
    } finally {
      setAutoBundling(false);
    }
  };

  // ── Bulk re-analyze ──
  const handleBulkReanalyze = async () => {
    const selected = items.filter(i => selectedIds.has(i.id));
    if (selected.length === 0) return;

    setReanalyzing(true);
    try {
      // Compose content from selected items for the extract-knowledge engine
      const composedContent = selected.map(item =>
        `## ${item.title}\n**Category:** ${item.category} | **Priority:** ${item.priority}\n\n${item.content_full}`
      ).join("\n\n---\n\n");

      const { data, error } = await supabase.functions.invoke("extract-knowledge", {
        body: {
          source_type: "manual",
          content: composedContent,
          meta: {
            title: `Re-analysis of ${selected.length} items`,
            source: "bulk-reanalyze",
          },
        },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setReanalysisResult(data as ExtractionResult);
      setReanalysisOpen(true);
      // Clear selection after successful re-analysis
      setSelectedIds(new Set());
      setSelectMode(false);
    } catch (e: any) {
      toast({ title: "Re-analysis failed", description: e.message, variant: "destructive" });
    } finally {
      setReanalyzing(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(i => i.id)));
    }
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  // ── Create / dedup logic ──
  const doInsert = async () => {
    const { error } = await supabase.from("context_items").insert({
      owner_id: user!.id,
      title: newTitle,
      content_full: newContent,
      category: newCategory,
    } as any);
    if (error) throw error;
  };

  const createItem = useMutation({
    mutationFn: async () => {
      const matches = await findDuplicates(user!.id, newTitle, newContent);
      if (matches.length > 0) {
        setDupMatches(matches);
        setDupDialogOpen(true);
        return;
      }
      await doInsert();
    },
    onSuccess: () => {
      if (dupDialogOpen) return;
      queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
      toast({ title: "Context item created" });
      setCreateOpen(false);
      setNewTitle("");
      setNewContent("");
      setNewCategory("RESEARCH");
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const handleDupResolution = async (result: ResolutionResult) => {
    setDupDialogOpen(false);
    setDupMatches([]);
    try {
      if (result.action === "cancel") return;
      if (result.action === "keep_both") {
        await doInsert();
      } else if (result.action === "replace" && result.targetId) {
        await supabase.from("context_items").update({
          title: newTitle,
          content_full: newContent,
          category: newCategory,
        } as any).eq("id", result.targetId);
      } else if (result.action === "merge" && result.targetId && result.mergedContent) {
        // Delete the original item
        await supabase.from("context_items").delete().eq("id", result.targetId);

        // Create the new merged item
        const { data: newItem, error: insertErr } = await supabase.from("context_items").insert({
          owner_id: user!.id,
          title: newTitle,
          content_full: result.mergedContent,
          category: newCategory,
          bundle_id: result.bundleIds?.[0] ?? null,
        } as any).select("id").single();
        if (insertErr) throw insertErr;

        // Assign to all source bundles via junction table
        if (newItem && result.bundleIds && result.bundleIds.length > 0) {
          const rows = result.bundleIds.map(bid => ({
            context_item_id: newItem.id,
            bundle_id: bid,
          }));
          await supabase.from("context_item_bundles").insert(rows as any);
        }
      }
      queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
      queryClient.invalidateQueries({ queryKey: ["context-items"] });
      toast({ title: result.action === "keep_both" ? "Item created" : result.action === "merge" ? "Items merged" : `Item ${result.action}d` });
      setCreateOpen(false);
      setNewTitle("");
      setNewContent("");
      setNewCategory("RESEARCH");
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("context_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
      toast({ title: "Context item removed" });
    },
  });

  // Inline AI actions
  const handleInlineAction = async (itemId: string, action: string) => {
    setInlineLoading(itemId);
    try {
      if (action === "promote_mandate") {
        const { data, error } = await supabase.functions.invoke("audit-context", {
          body: { action: "apply_promote_mandate", item_id: itemId, enforcement_level: "required_ack" },
        });
        if (error) throw error;
        if (data.error) throw new Error(data.error);
        queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
        queryClient.invalidateQueries({ queryKey: ["mandates"] });
        toast({ title: "Promoted to Mandate", description: "Item is now a draft mandate with Required Ack enforcement." });
      } else if (action === "enrich") {
        const item = items.find(i => i.id === itemId);
        if (!item) return;
        const { data, error } = await supabase.functions.invoke("audit-context", {
          body: {
            action: "audit",
            items: [{ id: item.id, title: item.title, content_full: item.content_full, category: item.category, priority: item.priority }],
          },
        });
        if (error) throw error;
        if (data.error) throw new Error(data.error);
        const enrichSuggestion = (data.suggestions || []).find((s: any) => s.type === "enrich");
        if (enrichSuggestion?.suggested_content) {
          const { error: applyErr } = await supabase.functions.invoke("audit-context", {
            body: { action: "apply_enrich", item_id: itemId, enriched_content: enrichSuggestion.suggested_content },
          });
          if (applyErr) throw applyErr;
          queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
          toast({ title: "Content enriched", description: "AI has expanded the item's content." });
        } else {
          toast({ title: "Already rich", description: "AI found no enrichment needed for this item." });
        }
      } else if (action === "suggest_category") {
        const item = items.find(i => i.id === itemId);
        if (!item) return;
        const { data, error } = await supabase.functions.invoke("audit-context", {
          body: {
            action: "audit",
            items: [{ id: item.id, title: item.title, content_full: item.content_full, category: item.category, priority: item.priority }],
          },
        });
        if (error) throw error;
        if (data.error) throw new Error(data.error);
        const recatSuggestion = (data.suggestions || []).find((s: any) => s.type === "recategorize");
        if (recatSuggestion?.suggested_category) {
          const { error: applyErr } = await supabase.functions.invoke("audit-context", {
            body: { action: "apply_recategorize", item_id: itemId, new_category: recatSuggestion.suggested_category },
          });
          if (applyErr) throw applyErr;
          queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
          toast({ title: "Recategorized", description: `Changed to ${recatSuggestion.suggested_category}: ${recatSuggestion.reason}` });
        } else {
          toast({ title: "Category correct", description: "AI confirms the current category is appropriate." });
        }
      }
    } catch (e: any) {
      toast({ title: "AI action failed", description: e.message, variant: "destructive" });
    } finally {
      setInlineLoading(null);
    }
  };

  const filtered = items.filter(i => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.content_full.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || i.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const categories = ["all", "DIRECTIVE", "KNOWLEDGE", "PROCEDURE", "PLAYBOOK", "PREFERENCE", "RESEARCH", "PRINCIPLE"];

  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search items…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {categories.map(c => (
              <Badge
                key={c}
                variant={categoryFilter === c ? "default" : "outline"}
                className="text-[10px] cursor-pointer"
                onClick={() => setCategoryFilter(c)}
              >
                {c === "all" ? "All" : c}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => {
              if (selectMode) exitSelectMode();
              else setSelectMode(true);
            }}
          >
            <CheckSquare className="h-3 w-3" />
            {selectMode ? "Cancel Select" : "Select"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setCopilotOpen(!copilotOpen)}
          >
            <Sparkles className="h-3 w-3" />
            {copilotOpen ? "Hide Copilot" : "AI Copilot"}
          </Button>
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3 w-3" /> New Item
          </Button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectMode && (
        <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-4 py-2">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedIds.size === filtered.length && filtered.length > 0}
              onCheckedChange={toggleSelectAll}
            />
            <span className="text-xs text-muted-foreground">
              {selectedIds.size} of {filtered.length} selected
            </span>
          </div>
           <div className="flex items-center gap-2">
              {selectedIds.size === 2 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={() => setMergeOpen(true)}
                >
                  <GitMerge className="h-3 w-3" />
                  Merge 2 Items
                </Button>
              )}
              <Button
                size="sm"
                className="gap-1.5 text-xs"
                onClick={handleBulkReanalyze}
                disabled={selectedIds.size === 0 || reanalyzing}
              >
                {reanalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                Re-analyze ({selectedIds.size})
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={exitSelectMode}>
                <X className="h-3 w-3" />
              </Button>
            </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""} · Promote personal knowledge into context items to share with workbooks and bundles.
        </p>
        {unbundledItems.length >= 3 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={handleAutoBundle}
            disabled={autoBundling}
          >
            {autoBundling ? <Loader2 className="h-3 w-3 animate-spin" /> : <PackagePlus className="h-3 w-3" />}
            Auto-Bundle ({unbundledItems.length} unbundled)
          </Button>
        )}
      </div>

      {/* Copilot Panel */}
      {copilotOpen && (
        <ContextCopilotPanel items={items} onClose={() => setCopilotOpen(false)} />
      )}

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/50 p-8 text-center text-sm text-muted-foreground">
          {items.length === 0
            ? "No context items yet. Create one or promote from your personal knowledge."
            : "No items match your filters."}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`group flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                selectedIds.has(item.id)
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/50 bg-card hover:border-primary/20"
              }`}
              onClick={selectMode ? () => toggleSelect(item.id) : undefined}
            >
              {selectMode && (
                <Checkbox
                  checked={selectedIds.has(item.id)}
                  onCheckedChange={() => toggleSelect(item.id)}
                  className="mt-1 shrink-0"
                  onClick={e => e.stopPropagation()}
                />
              )}
              <div className={`flex h-8 w-8 items-center justify-center rounded-md shrink-0 ${CATEGORY_COLORS[item.category] || "bg-secondary"}`}>
                {item.category === "RESEARCH" ? <Microscope className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.title}</span>
                  <CategoryBadge category={item.category} />
                  <Badge variant="outline" className="text-[10px]">{item.priority}</Badge>
                  {item.is_mandate && (
                    <Badge variant="outline" className="text-[9px] border-amber-500/30 bg-amber-500/10 text-amber-400 gap-0.5">
                      <Shield className="h-2 w-2" /> Mandate
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.content_full}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[10px] text-muted-foreground">
                  <span>{item.security_level}</span>
                  <span>v{item.version}</span>
                  {(bundlesByItem.get(item.id) ?? []).map(b => (
                    <Badge key={b.id} variant="secondary" className="text-[9px] px-1.5 py-0 h-4 gap-0.5">
                      📦 {b.title}
                    </Badge>
                  ))}
                  {(bundlesByItem.get(item.id) ?? []).length === 0 && item.bundle_id && (
                    <span className="text-primary">📦 In bundle</span>
                  )}
                </div>
              </div>
              {!selectMode && (
                <div className="flex items-center gap-1 shrink-0">
                  {inlineLoading === item.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                          <Sparkles className="h-3.5 w-3.5 text-primary" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleInlineAction(item.id, "suggest_category")} className="text-xs gap-2">
                          <Tag className="h-3 w-3" /> Suggest Category
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleInlineAction(item.id, "enrich")} className="text-xs gap-2">
                          <FileText className="h-3 w-3" /> Enrich Content
                        </DropdownMenuItem>
                        {item.category === "DIRECTIVE" && !item.is_mandate && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleInlineAction(item.id, "promote_mandate")} className="text-xs gap-2 text-amber-400">
                              <Shield className="h-3 w-3" /> Promote to Mandate
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive"
                    onClick={() => deleteItem.mutate(item.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">New Context Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["RESEARCH", "KNOWLEDGE", "DIRECTIVE", "PROCEDURE", "PLAYBOOK", "PREFERENCE"].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea placeholder="Content…" value={newContent} onChange={e => setNewContent(e.target.value)} rows={4} />
          </div>
          <DialogFooter>
            <Button onClick={() => createItem.mutate()} disabled={!newTitle.trim() || !newContent.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Duplicate Resolution Dialog */}
      <DuplicateResolutionDialog
        open={dupDialogOpen}
        onOpenChange={setDupDialogOpen}
        newItem={{ title: newTitle, content: newContent, category: newCategory }}
        matches={dupMatches}
        onResolve={handleDupResolution}
      />

      {/* Import Copilot for Re-analysis Results */}
      <ImportCopilotDialog
        open={reanalysisOpen}
        onOpenChange={setReanalysisOpen}
        data={reanalysisResult}
        sourceName={`Re-analysis of ${selectedIds.size || "selected"} items`}
        sourceType="manual"
      />

      {/* Merge Items Dialog */}
      {selectedIds.size === 2 && (() => {
        const ids = Array.from(selectedIds);
        const a = items.find(i => i.id === ids[0]);
        const b = items.find(i => i.id === ids[1]);
        if (!a || !b) return null;
        return (
          <MergeItemsDialog
            open={mergeOpen}
            onOpenChange={setMergeOpen}
            itemA={a as any}
            itemB={b as any}
            onComplete={() => {
              setSelectedIds(new Set());
              setSelectMode(false);
            }}
          />
        );
      })()}
    </div>
  );
}
