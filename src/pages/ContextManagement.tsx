import { useState, useMemo, useRef } from "react";
import {
  Search, Plus, Filter, X, Layers, Upload, AlertTriangle, ChevronRight,
  Archive, FileText, Check, Gauge, GitBranch, Zap, Pencil, Shield, Loader2,
  Sparkles, LayoutGrid, List,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { ContextItemRow } from "@/components/context/ContextItemRow";
import { BundleCard } from "@/components/context/BundleCard";
import { BundleFirstView } from "@/components/context/BundleFirstView";
import { ContextStackViewer } from "@/components/governance/ContextStackViewer";
import { ImpactSimulator } from "@/components/governance/ImpactSimulator";
import { MandatesDashboard } from "@/components/mandates/MandatesDashboard";
import { ImportCopilotDialog } from "@/components/knowledge/ImportCopilotDialog";
import { ExtractionProgressDialog, type ExtractionPhase } from "@/components/knowledge/ExtractionProgressDialog";
import { ContextCopilotPanel } from "@/components/knowledge/ContextCopilotPanel";
import { type ExtractionResult } from "@/lib/knowledge-schema";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ALL_CATEGORIES,
  type MockBundle, type MockContextItem, type ContextCategory,
} from "@/data/mockContextItems";
import type { Json } from "@/integrations/supabase/types";

// Helper: parse domain_scope jsonb to string[]
function parseDomainTags(domainScope: Json | null): string[] {
  if (Array.isArray(domainScope)) return domainScope.filter((t): t is string => typeof t === "string");
  return ["general"];
}

// Helper: format relative time
function formatRelativeTime(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

// ── Drift & Stale mock data (from Process Studio) ──
interface DriftCluster {
  id: string; label: string; count: number; severity: "low" | "medium" | "high"; excerpts: string[];
}
const MOCK_DRIFT: DriftCluster[] = [
  { id: "d1", label: "Pricing Step deviations", count: 5, severity: "high", excerpts: ["User skipped discount approval gate", "Non-standard pricing tier applied", "Volume discount exceeded threshold", "Manual override on enterprise rate", "Pricing template version mismatch"] },
  { id: "d2", label: "Onboarding Flow edits", count: 3, severity: "medium", excerpts: ["SLA template modified", "Kick-off agenda reordered", "Integration step skipped"] },
  { id: "d3", label: "Compliance rule drift", count: 2, severity: "low", excerpts: ["Data retention note missing", "GDPR clause outdated"] },
];

interface StaleItem {
  id: string; title: string; category: string; lastUsed: string; reason: string;
}
const MOCK_STALE: StaleItem[] = [
  { id: "s1", title: "Legacy Pricing Model v1", category: "KNOWLEDGE", lastUsed: "8 months ago", reason: "Superseded by v2" },
  { id: "s2", title: "Old Competitor Battlecard", category: "KNOWLEDGE", lastUsed: "6 months ago", reason: "Company acquired" },
  { id: "s3", title: "Beta Onboarding Flow", category: "PROCEDURE", lastUsed: "7 months ago", reason: "Replaced by GA flow" },
];

export default function ContextManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"simplified" | "classic">("simplified");

  // Fetch real DB items
  const { data: dbItems = [] } = useQuery({
    queryKey: ["context-items-all", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("context_items")
        .select("*")
        .is("deleted_at", null)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch real DB bundles
  const { data: dbBundles = [] } = useQuery({
    queryKey: ["bundles-all", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bundles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Map DB rows → MockContextItem shape for component compatibility
  const items: MockContextItem[] = useMemo(() =>
    dbItems.map(row => ({
      id: row.id,
      title: row.title,
      category: row.category as ContextCategory,
      priority: row.priority,
      security_level: row.security_level,
      action_type: row.action_type,
      bundle_id: row.bundle_id,
      bundle_ids: row.bundle_id ? [row.bundle_id] : [],
      domain_tags: parseDomainTags(row.domain_scope),
      trigger_intent: row.trigger_intent,
      content_preview: row.content_full,
      last_used_at: formatRelativeTime(row.last_used_at),
      version: row.version ?? "v1.0",
      created_at: row.created_at,
    })),
  [dbItems]);

  // Map DB rows → MockBundle shape
  const bundles: MockBundle[] = useMemo(() =>
    dbBundles.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description ?? "",
      scope_level: row.scope_level,
      version: row.version ?? "v1.0",
      health_score: Number(row.health_score ?? 1),
      item_count: dbItems.filter(i => i.bundle_id === row.id).length,
      domain_tags: Array.from(new Set(dbItems.filter(i => i.bundle_id === row.id).flatMap(i => parseDomainTags(i.domain_scope)))),
      created_at: row.created_at,
    })),
  [dbBundles, dbItems]);

  // Derived domain tags from real data
  const allDomainTags = useMemo(() =>
    Array.from(new Set(items.flatMap(i => i.domain_tags))).sort(),
  [items]);

  // Items state
  const [itemSearch, setItemSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemDialog, setItemDialog] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // New item form state
  const emptyItem: {
    title: string; content_preview: string;
    category: ContextCategory;
    priority: "STANDARD" | "CRITICAL";
    security_level: "INTERNAL" | "CONFIDENTIAL" | "ADMIN_ONLY";
    action_type: "APPEND" | "OVERRIDE" | "BLOCK";
    trigger_intent: string; domain_tags_input: string; bundle_ids: string[];
  } = {
    title: "", content_preview: "", category: "KNOWLEDGE", priority: "STANDARD",
    security_level: "INTERNAL", action_type: "APPEND",
    trigger_intent: "", domain_tags_input: "", bundle_ids: [],
  };
  const [newItem, setNewItem] = useState(emptyItem);
  const [bundleSearch, setBundleSearch] = useState("");
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(null);
  const [bundleDialog, setBundleDialog] = useState(false);
  const [editingBundle, setEditingBundle] = useState<MockBundle | null>(null);

  // Drift state
  const [expandedDrift, setExpandedDrift] = useState<string | null>(null);

  // Ingestion / extraction state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loomExtracting, setLoomExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [extractionDocName, setExtractionDocName] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [extractionPhase, setExtractionPhase] = useState<ExtractionPhase>("uploading");
  const extractionAbortRef = useRef<AbortController | null>(null);
  // Governance state
  const [stackViewerOpen, setStackViewerOpen] = useState(false);
  const [impactSimOpen, setImpactSimOpen] = useState(false);
  const [impactTarget, setImpactTarget] = useState("");

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (itemSearch && !item.title.toLowerCase().includes(itemSearch.toLowerCase()) && !item.content_preview.toLowerCase().includes(itemSearch.toLowerCase())) return false;
      if (categoryFilter && item.category !== categoryFilter) return false;
      if (domainFilter && !item.domain_tags.includes(domainFilter)) return false;
      if (selectedBundleId && !item.bundle_ids.includes(selectedBundleId)) return false;
      return true;
    });
  }, [items, itemSearch, categoryFilter, domainFilter, selectedBundleId]);

  const filteredBundles = useMemo(() => {
    return bundles.filter(b => !bundleSearch || b.title.toLowerCase().includes(bundleSearch.toLowerCase()));
  }, [bundles, bundleSearch]);

  const selectedItem = items.find(i => i.id === selectedItemId);

  // Handle create/update item — writes to DB
  const handleSaveItem = async () => {
    if (!user) return;
    const domainTags = newItem.domain_tags_input.split(",").map(t => t.trim()).filter(Boolean);
    const domainScope = domainTags.length > 0 ? domainTags : ["general"];

    if (editingItemId) {
      const { error } = await supabase.from("context_items").update({
        title: newItem.title,
        content_full: newItem.content_preview,
        category: newItem.category,
        priority: newItem.priority,
        security_level: newItem.security_level,
        action_type: newItem.action_type,
        trigger_intent: newItem.trigger_intent || null,
        domain_scope: domainScope,
        bundle_id: newItem.bundle_ids[0] ?? null,
      }).eq("id", editingItemId);
      if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
      setItemDialog(false);
      setEditingItemId(null);
      setNewItem(emptyItem);
      queryClient.invalidateQueries({ queryKey: ["context-items-all"] });
      toast({ title: "Context item updated", description: `"${newItem.title}" saved.` });
    } else {
      const { error } = await supabase.from("context_items").insert({
        owner_id: user.id,
        title: newItem.title,
        content_full: newItem.content_preview,
        category: newItem.category,
        priority: newItem.priority,
        security_level: newItem.security_level,
        action_type: newItem.action_type,
        trigger_intent: newItem.trigger_intent || null,
        domain_scope: domainScope,
        bundle_id: newItem.bundle_ids[0] ?? null,
      });
      if (error) { toast({ title: "Create failed", description: error.message, variant: "destructive" }); return; }
      setItemDialog(false);
      setNewItem(emptyItem);
      queryClient.invalidateQueries({ queryKey: ["context-items-all"] });
      toast({ title: "Context item created", description: `"${newItem.title}" added.` });
    }
  };

  // Open edit dialog pre-populated
  const openEditDialog = (item: MockContextItem) => {
    setEditingItemId(item.id);
    setNewItem({
      title: item.title,
      content_preview: item.content_preview,
      category: item.category,
      priority: item.priority,
      security_level: item.security_level,
      action_type: item.action_type,
      trigger_intent: item.trigger_intent ?? "",
      domain_tags_input: item.domain_tags.join(", "),
      bundle_ids: [...item.bundle_ids],
    });
    setItemDialog(true);
  };

  const handleDeleteBundle = async (id: string) => {
    const { error } = await supabase.from("bundles").delete().eq("id", id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    if (selectedBundleId === id) setSelectedBundleId(null);
    queryClient.invalidateQueries({ queryKey: ["bundles-all"] });
    toast({ title: "Bundle deleted" });
  };

  const handleSaveBundle = async () => {
    if (!user) return;
    if (editingBundle?.id) {
      const { error } = await supabase.from("bundles").update({
        title: editingBundle.title,
        description: editingBundle.description,
      }).eq("id", editingBundle.id);
      if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Bundle updated" });
    } else {
      const { error } = await supabase.from("bundles").insert({
        owner_id: user.id,
        title: editingBundle?.title || "New Bundle",
        description: editingBundle?.description || "Description",
        scope_level: "draft",
      });
      if (error) { toast({ title: "Create failed", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Bundle created" });
    }
    setBundleDialog(false);
    setEditingBundle(null);
    queryClient.invalidateQueries({ queryKey: ["bundles-all"] });
  };

  const handleDestroyItem = async (item: MockContextItem) => {
    // Soft-delete: set deleted_at timestamp
    const { error } = await supabase.from("context_items").update({ deleted_at: new Date().toISOString() } as any).eq("id", item.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    if (selectedItemId === item.id) setSelectedItemId(null);
    queryClient.invalidateQueries({ queryKey: ["context-items-all"] });
    toast({
      title: "Item destroyed",
      description: `"${item.title}" removed.`,
      action: (
        <ToastAction altText="Undo delete" onClick={async () => {
          await supabase.from("context_items").update({ deleted_at: null } as any).eq("id", item.id);
          queryClient.invalidateQueries({ queryKey: ["context-items-all"] });
          toast({ title: "Restored", description: `"${item.title}" has been restored.` });
        }}>
          Undo
        </ToastAction>
      ),
    });
  };

  const clearFilters = () => { setCategoryFilter(null); setDomainFilter(null); setSelectedBundleId(null); setItemSearch(""); };
  const hasFilters = categoryFilter || domainFilter || selectedBundleId || itemSearch;

  const handleLoomFile = async (file: File) => {
    if (!user) {
      toast({ title: "Not authenticated", variant: "destructive" });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 20MB", variant: "destructive" });
      return;
    }
    const abortController = new AbortController();
    extractionAbortRef.current = abortController;
    setExtractionPhase("uploading");
    setExtractionDocName(file.name);
    setLoomExtracting(true);
    let filePath: string | null = null;
    let docId: string | null = null;
    try {
      filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadErr } = await supabase.storage
        .from("personal-documents")
        .upload(filePath, file);
      if (uploadErr) throw uploadErr;
      if (abortController.signal.aborted) throw new Error("Cancelled");

      setExtractionPhase("analyzing");

      const { data: docRow, error: insertErr } = await supabase
        .from("personal_documents")
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type || "application/octet-stream",
          document_category: "other",
          parsed_status: "pending",
        })
        .select("id")
        .single();
      if (insertErr || !docRow) throw insertErr ?? new Error("Insert failed");
      docId = docRow.id;
      if (abortController.signal.aborted) throw new Error("Cancelled");

      setExtractionPhase("extracting");

      const { data, error } = await supabase.functions.invoke("extract-knowledge", {
        body: { documentId: docRow.id, source_type: "loom" },
      });
      if (abortController.signal.aborted) throw new Error("Cancelled");
      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setExtractionPhase("done");
      await new Promise(r => setTimeout(r, 800));

      setExtractionResult(data as ExtractionResult);
      setReviewOpen(true);
    } catch (err: any) {
      if (err.message === "Cancelled") {
        // Cleanup uploaded file & document row
        if (filePath) {
          await supabase.storage.from("personal-documents").remove([filePath]).catch(() => {});
        }
        if (docId) {
          try { await supabase.from("personal_documents").delete().eq("id", docId); } catch {}
        }
        toast({ title: "Extraction cancelled" });
      } else {
        toast({ title: "Extraction failed", description: err.message, variant: "destructive" });
      }
    } finally {
      extractionAbortRef.current = null;
      setLoomExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleCancelExtraction = () => {
    extractionAbortRef.current?.abort();
    extractionAbortRef.current = null;
    setLoomExtracting(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleLoomFile(file);
  };

  const handleLoomFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("[Knowledge Loom] File selected:", file?.name, file?.size);
    if (file) handleLoomFile(file);
  };

  // Health metrics
  const totalItems = items.length;
  const avgHealth = bundles.reduce((acc, m) => acc + m.health_score, 0) / (bundles.length || 1);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Hidden file input for Knowledge Loom (shared by both views) */}
      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.csv,.json" onChange={handleLoomFileInput} />
      {/* Header */}
      <div className="shrink-0 p-6 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            📚 Context
            <span className="text-sm font-normal text-muted-foreground ml-3">
              {totalItems} items · {bundles.length} bundles · <span className={Math.round(avgHealth * 100) > 80 ? "text-emerald-400" : Math.round(avgHealth * 100) >= 50 ? "text-yellow-400" : "text-red-400"}>{Math.round(avgHealth * 100)}% health</span>
            </span>
          </h1>
          {/* View toggle in header */}
          <div className="flex items-center gap-1 rounded-lg border border-border/50 p-0.5 bg-secondary/30">
            <Button
              variant={viewMode === "simplified" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs gap-1.5 px-3"
              onClick={() => setViewMode("simplified")}
            >
              <LayoutGrid className="h-3 w-3" /> Bundles
            </Button>
            <Button
              variant={viewMode === "classic" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs gap-1.5 px-3"
              onClick={() => setViewMode("classic")}
            >
              <List className="h-3 w-3" /> Classic
            </Button>
          </div>
        </div>

        {viewMode === "classic" ? (
          <div className="flex items-center gap-2 flex-wrap mt-3">
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => setCopilotOpen(!copilotOpen)}>
              <Sparkles className="h-3.5 w-3.5" /> {copilotOpen ? "Hide Copilot" : "AI Copilot"}
            </Button>
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => setStackViewerOpen(true)}>
              <GitBranch className="h-3.5 w-3.5" /> Context Stack
            </Button>
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => { setImpactTarget("Selected Item"); setImpactSimOpen(true); }}>
              <Zap className="h-3.5 w-3.5" /> Impact Sim
            </Button>
            <Button onClick={() => { setEditingBundle(null); setBundleDialog(true); }} variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" /> New Bundle
            </Button>
            <Button onClick={() => { setEditingItemId(null); setNewItem(emptyItem); setItemDialog(true); }} className="gap-1.5">
              <Plus className="h-4 w-4" /> New Item
            </Button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground mt-2">
            Organize and deploy your knowledge bundles. Expand a bundle to see its items.
          </p>
        )}
      </div>

      {/* ─── SIMPLIFIED (BUNDLES) MODE ─── */}
      {viewMode === "simplified" ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {copilotOpen && (
            <div className="px-4 pt-3 shrink-0">
              <ContextCopilotPanel items={dbItems} onClose={() => setCopilotOpen(false)} />
            </div>
          )}
          <BundleFirstView
            items={items}
            bundles={bundles}
            allDomainTags={allDomainTags}
            onEditItem={openEditDialog}
            onDestroyItem={handleDestroyItem}
            onEditBundle={(bundle) => { setEditingBundle(bundle); setBundleDialog(true); }}
            onDeleteBundle={handleDeleteBundle}
            onCreateItem={() => { setEditingItemId(null); setNewItem(emptyItem); setItemDialog(true); }}
            onCreateBundle={() => { setEditingBundle(null); setBundleDialog(true); }}
            onOpenCopilot={() => setCopilotOpen(!copilotOpen)}
            copilotOpen={copilotOpen}
            onOpenLoom={() => fileInputRef.current?.click()}
            loomExtracting={loomExtracting}
          />
        </div>
      ) : (
        /* ─── CLASSIC MODE ─── */
        <Tabs defaultValue="items" className="flex-1 flex flex-col overflow-hidden">
          <div className="shrink-0 px-6 pt-3">
            <TabsList>
              <TabsTrigger value="items">Items & Bundles</TabsTrigger>
              <TabsTrigger value="mandates" className="gap-1"><Shield className="h-3 w-3" />Mandates</TabsTrigger>
              <TabsTrigger value="drift">Drift Inbox</TabsTrigger>
              <TabsTrigger value="ingest">Knowledge Loom</TabsTrigger>
              <TabsTrigger value="stale">Garbage Collection</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="mandates" className="flex-1 overflow-auto mt-0 p-4">
            <MandatesDashboard />
          </TabsContent>

          <TabsContent value="items" className="flex-1 overflow-auto mt-0">
            {copilotOpen && (
              <div className="px-4 pt-3">
                <ContextCopilotPanel items={dbItems} onClose={() => setCopilotOpen(false)} />
              </div>
            )}
            <ResizablePanelGroup direction="horizontal" className="min-h-[500px]">
              <ResizablePanel defaultSize={55} minSize={35}>
                <div className="flex flex-col h-full">
                  <div className="shrink-0 p-4 space-y-3 border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search items…" value={itemSearch} onChange={e => setItemSearch(e.target.value)} className="pl-9 h-9" />
                      </div>
                      {hasFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs gap-1"><X className="h-3 w-3" /> Clear</Button>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Filter className="h-3 w-3 text-muted-foreground" />
                      {ALL_CATEGORIES.map(cat => (
                        <Badge key={cat} variant={categoryFilter === cat ? "default" : "outline"} className="text-[10px] cursor-pointer hover:bg-primary/10" onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}>{cat}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Layers className="h-3 w-3 text-muted-foreground" />
                      {allDomainTags.map(tag => (
                        <Badge key={tag} variant={domainFilter === tag ? "default" : "secondary"} className="text-[9px] cursor-pointer hover:bg-primary/10" onClick={() => setDomainFilter(domainFilter === tag ? null : tag)}>{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-2">
                      {filteredItems.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground text-sm">No items match your filters</div>
                      ) : filteredItems.map(item => (
                        <ContextItemRow key={item.id} item={item} selected={selectedItemId === item.id} onClick={() => setSelectedItemId(selectedItemId === item.id ? null : item.id)} onEdit={openEditDialog} onDestroy={handleDestroyItem} />
                      ))}
                    </div>
                  </ScrollArea>
                  {selectedItem && (
                    <div className="shrink-0 border-t border-border/50 p-4 bg-card/50 max-h-48 overflow-auto">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold">{selectedItem.title}</h3>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-6 text-xs gap-1" onClick={() => openEditDialog(selectedItem)}>
                            <Pencil className="h-3 w-3" /> Edit
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedItemId(null)}><X className="h-3 w-3" /></Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{selectedItem.content_preview}</p>
                      <div className="flex gap-2 mt-2 text-[10px] text-muted-foreground">
                        <span>Version: {selectedItem.version}</span><span>·</span><span>Trigger: {selectedItem.trigger_intent ?? "None"}</span><span>·</span><span>Bundles: {selectedItem.bundle_ids.length > 0 ? selectedItem.bundle_ids.map(bid => bundles.find(b => b.id === bid)?.title ?? bid).join(", ") : "None"}</span>
                      </div>
                    </div>
                  )}
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={45} minSize={30}>
                <div className="flex flex-col h-full">
                  <div className="shrink-0 p-4 border-b border-border/30">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search bundles…" value={bundleSearch} onChange={e => setBundleSearch(e.target.value)} className="pl-9 h-9" />
                    </div>
                  </div>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {filteredBundles.map(bundle => (
                        <BundleCard key={bundle.id} bundle={bundle} selected={selectedBundleId === bundle.id} onClick={() => setSelectedBundleId(selectedBundleId === bundle.id ? null : bundle.id)} onEdit={() => { setEditingBundle(bundle); setBundleDialog(true); }} onDelete={() => handleDeleteBundle(bundle.id)} />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>

        {/* ── DRIFT INBOX TAB ── */}
        <TabsContent value="drift" className="flex-1 overflow-auto mt-0 p-6">
          <div className="space-y-3">
            {MOCK_DRIFT.map(cluster => (
              <div key={cluster.id} className="rounded-lg border border-border/50 bg-card overflow-hidden">
                <button className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors" onClick={() => setExpandedDrift(expandedDrift === cluster.id ? null : cluster.id)}>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`h-4 w-4 ${cluster.severity === "high" ? "text-destructive" : cluster.severity === "medium" ? "text-warning" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">{cluster.count} {cluster.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] ${cluster.severity === "high" ? "border-destructive/30 text-destructive" : cluster.severity === "medium" ? "border-warning/30 text-warning" : ""}`}>{cluster.severity}</Badge>
                    <ChevronRight className={`h-4 w-4 transition-transform text-muted-foreground ${expandedDrift === cluster.id ? "rotate-90" : ""}`} />
                  </div>
                </button>
                {expandedDrift === cluster.id && (
                  <div className="border-t border-border/50 px-4 py-3 space-y-2 bg-secondary/10">
                    {cluster.excerpts.map((ex, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-1 w-1 rounded-full bg-muted-foreground" />{ex}
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="text-xs">Promote Update</Button>
                      <Button variant="outline" size="sm" className="text-xs">Dismiss</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── KNOWLEDGE LOOM TAB ── */}
        <TabsContent value="ingest" className="flex-1 overflow-auto mt-0 p-6">
          <div

            className={`rounded-lg border-2 border-dashed p-12 text-center transition-all ${loomExtracting ? "border-primary/50 bg-primary/5" : dragOver ? "border-primary bg-primary/5" : "border-border/50 bg-card/50 hover:border-primary/30 cursor-pointer"}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !loomExtracting && fileInputRef.current?.click()}
          >
            {loomExtracting ? (
              <>
                <Loader2 className="mx-auto h-8 w-8 text-primary animate-spin mb-3" />
                <p className="text-sm font-medium">Extracting items with AI…</p>
                <p className="text-xs text-muted-foreground mt-1">This may take a moment depending on document size</p>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Drop documents here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">AI will extract Preferences, Context Items & Bundles for your review</p>
              </>
            )}
          </div>
        </TabsContent>

        {/* ── GARBAGE COLLECTION TAB ── */}
        <TabsContent value="stale" className="flex-1 overflow-auto mt-0 p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{MOCK_STALE.length} items flagged for archive</p>
              <Button size="sm" variant="outline" className="text-xs gap-1"><Archive className="h-3 w-3" /> Archive All</Button>
            </div>
            {MOCK_STALE.map(item => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm font-medium">{item.title}</span>
                    <div className="flex gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                      <span className="text-[10px] text-muted-foreground">{item.lastUsed}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-warning">{item.reason}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><Archive className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        </Tabs>
      )}

      {/* Bundle CRUD Dialog */}
      <Dialog open={bundleDialog} onOpenChange={setBundleDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingBundle ? "Edit Bundle" : "Create Bundle"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Bundle title" value={editingBundle?.title ?? ""} onChange={e => setEditingBundle(prev => prev ? { ...prev, title: e.target.value } : { id: "", title: e.target.value, description: "", scope_level: "draft", version: "v0.1", health_score: 1, item_count: 0, domain_tags: [], created_at: new Date().toISOString() })} />
            <Input placeholder="Description" value={editingBundle?.description ?? ""} onChange={e => setEditingBundle(prev => prev ? { ...prev, description: e.target.value } : null)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBundleDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveBundle}>{editingBundle?.id ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Extraction Progress Dialog */}
      <ExtractionProgressDialog
        open={loomExtracting}
        fileName={extractionDocName}
        phase={extractionPhase}
        onCancel={handleCancelExtraction}
      />

      {/* Import Copilot (Knowledge Loom) */}
      <ImportCopilotDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        data={extractionResult}
        sourceName={extractionDocName}
        sourceType="loom"
      />

      {/* Governance Modals */}
      <ContextStackViewer open={stackViewerOpen} onOpenChange={setStackViewerOpen} />
      <ImpactSimulator open={impactSimOpen} onOpenChange={setImpactSimOpen} itemTitle={impactTarget} changeType="update" />

      {/* New Item Dialog */}
      <Dialog open={itemDialog} onOpenChange={v => { setItemDialog(v); if (!v) setEditingItemId(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingItemId ? "Edit Context Item" : "Create Context Item"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Title</Label>
              <Input placeholder="e.g. Enterprise Pricing Protocol" value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Content</Label>
              <Textarea placeholder="Full content or preview…" rows={3} value={newItem.content_preview} onChange={e => setNewItem(p => ({ ...p, content_preview: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Select value={newItem.category} onValueChange={v => setNewItem(p => ({ ...p, category: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ALL_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Priority</Label>
                <Select value={newItem.priority} onValueChange={v => setNewItem(p => ({ ...p, priority: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDARD">STANDARD</SelectItem>
                    <SelectItem value="CRITICAL">CRITICAL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Security Level</Label>
                <Select value={newItem.security_level} onValueChange={v => setNewItem(p => ({ ...p, security_level: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INTERNAL">INTERNAL</SelectItem>
                    <SelectItem value="CONFIDENTIAL">CONFIDENTIAL</SelectItem>
                    <SelectItem value="ADMIN_ONLY">ADMIN_ONLY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Action Type</Label>
                <Select value={newItem.action_type} onValueChange={v => setNewItem(p => ({ ...p, action_type: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPEND">APPEND</SelectItem>
                    <SelectItem value="OVERRIDE">OVERRIDE</SelectItem>
                    <SelectItem value="BLOCK">BLOCK</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Trigger Intent</Label>
              <Input placeholder="e.g. pricing negotiation (optional)" value={newItem.trigger_intent} onChange={e => setNewItem(p => ({ ...p, trigger_intent: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Domain Tags</Label>
              <Input placeholder="Comma-separated: sales, pricing" value={newItem.domain_tags_input} onChange={e => setNewItem(p => ({ ...p, domain_tags_input: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Assign to Bundles</Label>
              <div className="rounded-md border border-border/50 p-3 space-y-2 max-h-36 overflow-y-auto">
                {bundles.length === 0 && <p className="text-xs text-muted-foreground">No bundles available</p>}
                {bundles.map(b => (
                  <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={newItem.bundle_ids.includes(b.id)}
                      onCheckedChange={(checked) => {
                        setNewItem(p => ({
                          ...p,
                          bundle_ids: checked ? [...p.bundle_ids, b.id] : p.bundle_ids.filter(id => id !== b.id),
                        }));
                      }}
                    />
                    <span className="text-sm">{b.title}</span>
                    <Badge variant="outline" className="text-[9px] ml-auto">{b.scope_level}</Badge>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveItem} disabled={!newItem.title.trim() || !newItem.content_preview.trim()}>{editingItemId ? "Save Changes" : "Create Item"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
