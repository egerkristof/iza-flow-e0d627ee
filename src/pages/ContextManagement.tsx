import { useState, useMemo, useRef } from "react";
import {
  Search, Plus, Filter, X, Layers, Upload, AlertTriangle, ChevronRight,
  Archive, FileText, Check, Gauge,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ContextItemRow } from "@/components/context/ContextItemRow";
import { BundleCard } from "@/components/context/BundleCard";
import {
  MOCK_CONTEXT_ITEMS, MOCK_BUNDLES, ALL_DOMAIN_TAGS, ALL_CATEGORIES,
  type MockBundle,
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
  const [itemSearch, setItemSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Bundles state
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

  // Filter items
  const filteredItems = useMemo(() => {
    return MOCK_CONTEXT_ITEMS.filter(item => {
      if (itemSearch && !item.title.toLowerCase().includes(itemSearch.toLowerCase()) && !item.content_preview.toLowerCase().includes(itemSearch.toLowerCase())) return false;
      if (categoryFilter && item.category !== categoryFilter) return false;
      if (domainFilter && !item.domain_tags.includes(domainFilter)) return false;
      if (selectedBundleId && item.bundle_id !== selectedBundleId) return false;
      return true;
    });
  }, [itemSearch, categoryFilter, domainFilter, selectedBundleId]);

  const filteredBundles = useMemo(() => {
    return bundles.filter(b => !bundleSearch || b.title.toLowerCase().includes(bundleSearch.toLowerCase()));
  }, [bundles, bundleSearch]);

  const selectedItem = MOCK_CONTEXT_ITEMS.find(i => i.id === selectedItemId);

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
  const totalItems = MOCK_CONTEXT_ITEMS.length;
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
          <Button onClick={() => { setEditingBundle(null); setBundleDialog(true); }} className="gap-1.5">
            <Plus className="h-4 w-4" /> New Bundle
          </Button>
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
                      <ContextItemRow key={item.id} item={item} selected={selectedItemId === item.id} onClick={() => setSelectedItemId(selectedItemId === item.id ? null : item.id)} />
                    ))}
                  </div>
                </ScrollArea>
                {selectedItem && (
                  <div className="shrink-0 border-t border-border/50 p-4 bg-card/50 max-h-48 overflow-auto">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold">{selectedItem.title}</h3>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedItemId(null)}><X className="h-3 w-3" /></Button>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{selectedItem.content_preview}</p>
                    <div className="flex gap-2 mt-2 text-[10px] text-muted-foreground">
                      <span>Version: {selectedItem.version}</span><span>·</span><span>Trigger: {selectedItem.trigger_intent ?? "None"}</span>
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
    </div>
  );
}
