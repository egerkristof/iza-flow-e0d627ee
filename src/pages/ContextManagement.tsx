import { useState, useMemo } from "react";
import { Search, Plus, Filter, X, Layers, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ContextItemRow } from "@/components/context/ContextItemRow";
import { BundleCard } from "@/components/context/BundleCard";
import {
  MOCK_CONTEXT_ITEMS, MOCK_BUNDLES, ALL_DOMAIN_TAGS, ALL_CATEGORIES,
  type MockContextItem, type MockBundle,
} from "@/data/mockContextItems";

export default function ContextManagementPage() {
  const { toast } = useToast();

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
    return bundles.filter(b =>
      !bundleSearch || b.title.toLowerCase().includes(bundleSearch.toLowerCase())
    );
  }, [bundles, bundleSearch]);

  const selectedItem = MOCK_CONTEXT_ITEMS.find(i => i.id === selectedItemId);

  const handleDeleteBundle = (id: string) => {
    setBundles(prev => prev.filter(b => b.id !== id));
    if (selectedBundleId === id) setSelectedBundleId(null);
    toast({ title: "Bundle deleted" });
  };

  const handleSaveBundle = () => {
    if (editingBundle) {
      setBundles(prev => prev.map(b => b.id === editingBundle.id ? editingBundle : b));
      toast({ title: "Bundle updated" });
    } else {
      const newBundle: MockBundle = {
        id: `b${Date.now()}`,
        title: "New Bundle",
        description: "Description",
        scope_level: "draft",
        version: "v0.1",
        health_score: 1,
        item_count: 0,
        domain_tags: [],
        created_at: new Date().toISOString(),
      };
      setBundles(prev => [...prev, newBundle]);
      toast({ title: "Bundle created" });
    }
    setBundleDialog(false);
    setEditingBundle(null);
  };

  const clearFilters = () => {
    setCategoryFilter(null);
    setDomainFilter(null);
    setSelectedBundleId(null);
    setItemSearch("");
  };

  const hasFilters = categoryFilter || domainFilter || selectedBundleId || itemSearch;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="shrink-0 p-6 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">📚 Context Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Curate, organize, and manage the knowledge graph — {MOCK_CONTEXT_ITEMS.length} items across {bundles.length} bundles
            </p>
          </div>
          <Button onClick={() => { setEditingBundle(null); setBundleDialog(true); }} className="gap-1.5">
            <Plus className="h-4 w-4" /> New Bundle
          </Button>
        </div>
      </div>

      {/* Split panel */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* LEFT: Items list */}
        <ResizablePanel defaultSize={55} minSize={35}>
          <div className="flex flex-col h-full">
            {/* Items toolbar */}
            <div className="shrink-0 p-4 space-y-3 border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items…"
                    value={itemSearch}
                    onChange={e => setItemSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                {hasFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs gap-1">
                    <X className="h-3 w-3" /> Clear
                  </Button>
                )}
              </div>

              {/* Category chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <Filter className="h-3 w-3 text-muted-foreground" />
                {ALL_CATEGORIES.map(cat => (
                  <Badge
                    key={cat}
                    variant={categoryFilter === cat ? "default" : "outline"}
                    className="text-[10px] cursor-pointer hover:bg-primary/10"
                    onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>

              {/* Domain tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <Layers className="h-3 w-3 text-muted-foreground" />
                {ALL_DOMAIN_TAGS.map(tag => (
                  <Badge
                    key={tag}
                    variant={domainFilter === tag ? "default" : "secondary"}
                    className="text-[9px] cursor-pointer hover:bg-primary/10"
                    onClick={() => setDomainFilter(domainFilter === tag ? null : tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Items list */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-2">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    No items match your filters
                  </div>
                ) : (
                  filteredItems.map(item => (
                    <ContextItemRow
                      key={item.id}
                      item={item}
                      selected={selectedItemId === item.id}
                      onClick={() => setSelectedItemId(selectedItemId === item.id ? null : item.id)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Item detail drawer */}
            {selectedItem && (
              <div className="shrink-0 border-t border-border/50 p-4 bg-card/50 max-h-48 overflow-auto">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">{selectedItem.title}</h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedItemId(null)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{selectedItem.content_preview}</p>
                <div className="flex gap-2 mt-2 text-[10px] text-muted-foreground">
                  <span>Version: {selectedItem.version}</span>
                  <span>·</span>
                  <span>Trigger: {selectedItem.trigger_intent ?? "None"}</span>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* RIGHT: Bundles */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <div className="flex flex-col h-full">
            <div className="shrink-0 p-4 border-b border-border/30">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bundles…"
                    value={bundleSearch}
                    onChange={e => setBundleSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {filteredBundles.map(bundle => (
                  <BundleCard
                    key={bundle.id}
                    bundle={bundle}
                    selected={selectedBundleId === bundle.id}
                    onClick={() => setSelectedBundleId(selectedBundleId === bundle.id ? null : bundle.id)}
                    onEdit={() => { setEditingBundle(bundle); setBundleDialog(true); }}
                    onDelete={() => handleDeleteBundle(bundle.id)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Bundle CRUD Dialog */}
      <Dialog open={bundleDialog} onOpenChange={setBundleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBundle ? "Edit Bundle" : "Create Bundle"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Bundle title"
              value={editingBundle?.title ?? ""}
              onChange={e => setEditingBundle(prev => prev ? { ...prev, title: e.target.value } : { id: "", title: e.target.value, description: "", scope_level: "draft", version: "v0.1", health_score: 1, item_count: 0, domain_tags: [], created_at: new Date().toISOString() })}
            />
            <Input
              placeholder="Description"
              value={editingBundle?.description ?? ""}
              onChange={e => setEditingBundle(prev => prev ? { ...prev, description: e.target.value } : null)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBundleDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveBundle}>
              {editingBundle?.id ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
