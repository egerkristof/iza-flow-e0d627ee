import { useState, useMemo, useRef } from "react";
import {
  Search, Plus, Filter, X, Layers, Upload, AlertTriangle, ChevronRight,
  Archive, FileText, Check, Gauge, GitBranch, Zap, Pencil,
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
import { ContextItemRow } from "@/components/context/ContextItemRow";
import { BundleCard } from "@/components/context/BundleCard";
import { ContextStackViewer } from "@/components/governance/ContextStackViewer";
import { ImpactSimulator } from "@/components/governance/ImpactSimulator";
import {
  MOCK_CONTEXT_ITEMS, MOCK_BUNDLES, ALL_DOMAIN_TAGS, ALL_CATEGORIES,
  type MockBundle, type MockContextItem,
} from "@/data/mockContextItems";

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
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Items state
  const [items, setItems] = useState(MOCK_CONTEXT_ITEMS);
  const [itemSearch, setItemSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemDialog, setItemDialog] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // New item form state
  const emptyItem: {
    title: string; content_preview: string;
    category: "DIRECTIVE" | "KNOWLEDGE" | "PROCEDURE" | "PLAYBOOK" | "PREFERENCE";
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
  const [bundles, setBundles] = useState(MOCK_BUNDLES);

  // Drift state
  const [expandedDrift, setExpandedDrift] = useState<string | null>(null);

  // Ingestion state
  const [dragOver, setDragOver] = useState(false);
  const [ingestionModal, setIngestionModal] = useState(false);
  const [candidates, setCandidates] = useState<{ title: string; type: string; approved: boolean }[]>([]);

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

  // Handle create/update item
  const handleSaveItem = () => {
    const domainTags = newItem.domain_tags_input.split(",").map(t => t.trim()).filter(Boolean);
    if (editingItemId) {
      // Update existing
      setItems(prev => prev.map(i => i.id === editingItemId ? {
        ...i,
        title: newItem.title,
        content_preview: newItem.content_preview,
        category: newItem.category,
        priority: newItem.priority,
        security_level: newItem.security_level,
        action_type: newItem.action_type,
        trigger_intent: newItem.trigger_intent || null,
        domain_tags: domainTags.length > 0 ? domainTags : ["general"],
        bundle_id: newItem.bundle_ids[0] ?? null,
        bundle_ids: newItem.bundle_ids,
      } : i));
      setItemDialog(false);
      setEditingItemId(null);
      setNewItem(emptyItem);
      toast({ title: "Context item updated", description: `"${newItem.title}" saved.` });
    } else {
      const item: MockContextItem = {
        id: `ci${Date.now()}`,
        title: newItem.title,
        content_preview: newItem.content_preview,
        category: newItem.category,
        priority: newItem.priority,
        security_level: newItem.security_level,
        action_type: newItem.action_type,
        bundle_id: newItem.bundle_ids[0] ?? null,
        bundle_ids: newItem.bundle_ids,
        domain_tags: domainTags.length > 0 ? domainTags : ["general"],
        trigger_intent: newItem.trigger_intent || null,
        last_used_at: null,
        version: "v1.0",
        created_at: new Date().toISOString(),
      };
      setItems(prev => [item, ...prev]);
      setItemDialog(false);
      setNewItem(emptyItem);
      toast({ title: "Context item created", description: `"${item.title}" added${item.bundle_ids.length > 0 ? ` to ${item.bundle_ids.length} bundle(s)` : ""}` });
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

  const handleDeleteBundle = (id: string) => {
    setBundles(prev => prev.filter(b => b.id !== id));
    if (selectedBundleId === id) setSelectedBundleId(null);
    toast({ title: "Bundle deleted" });
  };

  const handleSaveBundle = () => {
    if (editingBundle?.id) {
      setBundles(prev => prev.map(b => b.id === editingBundle.id ? editingBundle : b));
      toast({ title: "Bundle updated" });
    } else {
      setBundles(prev => [...prev, { id: `b${Date.now()}`, title: "New Bundle", description: "Description", scope_level: "draft", version: "v0.1", health_score: 1, item_count: 0, domain_tags: [], created_at: new Date().toISOString() }]);
      toast({ title: "Bundle created" });
    }
    setBundleDialog(false);
    setEditingBundle(null);
  };

  const clearFilters = () => { setCategoryFilter(null); setDomainFilter(null); setSelectedBundleId(null); setItemSearch(""); };
  const hasFilters = categoryFilter || domainFilter || selectedBundleId || itemSearch;

  const simulateIngestion = () => {
    setCandidates([
      { title: "Enterprise Pricing Protocol", type: "PLAYBOOK", approved: false },
      { title: "Data Security Directive", type: "DIRECTIVE", approved: false },
      { title: "Product Comparison Matrix", type: "KNOWLEDGE", approved: false },
      { title: "Quarterly Review Procedure", type: "PROCEDURE", approved: false },
    ]);
    setIngestionModal(true);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); simulateIngestion(); };
  const toggleCandidate = (idx: number) => setCandidates(prev => prev.map((c, i) => (i === idx ? { ...c, approved: !c.approved } : c)));
  const approveAll = () => {
    toast({ title: "Ingestion Complete", description: `${candidates.filter(c => c.approved).length} items added.` });
    setIngestionModal(false);
  };

  // Health metrics
  const totalItems = items.length;
  const avgHealth = bundles.reduce((acc, m) => acc + m.health_score, 0) / (bundles.length || 1);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="shrink-0 p-6 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">📚 Context</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Curate, organize, and manage the knowledge graph — {totalItems} items · {bundles.length} bundles · {Math.round(avgHealth * 100)}% health
            </p>
          </div>
          <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Tabs for merged views */}
      <Tabs defaultValue="items" className="flex-1 flex flex-col overflow-hidden">
        <div className="shrink-0 px-6 pt-3">
          <TabsList>
            <TabsTrigger value="items">Items & Bundles</TabsTrigger>
            <TabsTrigger value="drift">Drift Inbox</TabsTrigger>
            <TabsTrigger value="ingest">Knowledge Loom</TabsTrigger>
            <TabsTrigger value="stale">Garbage Collection</TabsTrigger>
          </TabsList>
        </div>

        {/* ── ITEMS & BUNDLES TAB (split panel) ── */}
        <TabsContent value="items" className="flex-1 overflow-hidden mt-0">
          <ResizablePanelGroup direction="horizontal" className="h-full">
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
                    {ALL_DOMAIN_TAGS.map(tag => (
                      <Badge key={tag} variant={domainFilter === tag ? "default" : "secondary"} className="text-[9px] cursor-pointer hover:bg-primary/10" onClick={() => setDomainFilter(domainFilter === tag ? null : tag)}>{tag}</Badge>
                    ))}
                  </div>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-2">
                    {filteredItems.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground text-sm">No items match your filters</div>
                    ) : filteredItems.map(item => (
                      <ContextItemRow key={item.id} item={item} selected={selectedItemId === item.id} onClick={() => setSelectedItemId(selectedItemId === item.id ? null : item.id)} onEdit={openEditDialog} />
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
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={simulateIngestion} />
          <div
            className={`rounded-lg border-2 border-dashed p-12 text-center transition-all cursor-pointer ${dragOver ? "border-primary bg-primary/5" : "border-border/50 bg-card/50 hover:border-primary/30"}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Drop documents here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">Smart Ingestion will auto-extract Playbooks, Directives & Knowledge items</p>
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

      {/* Ingestion Modal */}
      <Dialog open={ingestionModal} onOpenChange={setIngestionModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Import Wizard — Candidate Items</DialogTitle></DialogHeader>
          <div className="space-y-2">
            {candidates.map((c, i) => (
              <button key={i} className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition-all ${c.approved ? "bg-primary/10 border border-primary/30" : "bg-secondary/50 border border-transparent"}`} onClick={() => toggleCandidate(i)}>
                <div className="flex items-center gap-2">
                  {c.approved ? <Check className="h-4 w-4 text-primary" /> : <div className="h-4 w-4 rounded border border-border" />}
                  <span>{c.title}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIngestionModal(false)}>Cancel</Button>
            <Button onClick={approveAll} disabled={!candidates.some(c => c.approved)}>Approve & Bundle ({candidates.filter(c => c.approved).length})</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
