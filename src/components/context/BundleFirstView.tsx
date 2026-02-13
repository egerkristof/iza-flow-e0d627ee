import { useState, useMemo } from "react";
import {
  Package, ChevronDown, ChevronRight, Search, Filter, Plus,
  FileText, Pencil, Trash2, Sparkles, Inbox, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CategoryBadge } from "@/components/knowledge/CategoryBadge";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { type MockBundle, type MockContextItem, ALL_CATEGORIES } from "@/data/mockContextItems";

interface BundleFirstViewProps {
  items: MockContextItem[];
  bundles: MockBundle[];
  onEditItem: (item: MockContextItem) => void;
  onDestroyItem: (item: MockContextItem) => void;
  onEditBundle: (bundle: MockBundle) => void;
  onDeleteBundle: (id: string) => void;
  onCreateItem: () => void;
  onCreateBundle: () => void;
}

const scopeColors: Record<string, string> = {
  org: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  domain: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  team: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  draft: "border-muted-foreground/30 bg-muted/50 text-muted-foreground",
};

function BundleExpandable({
  bundle,
  bundleItems,
  onEditItem,
  onDestroyItem,
  onEditBundle,
  onDeleteBundle,
}: {
  bundle: MockBundle;
  bundleItems: MockContextItem[];
  onEditItem: (item: MockContextItem) => void;
  onDestroyItem: (item: MockContextItem) => void;
  onEditBundle: (bundle: MockBundle) => void;
  onDeleteBundle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-lg border border-border/50 bg-card overflow-hidden transition-all hover:border-primary/20">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-3 p-4 text-left group">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 shrink-0">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold truncate">{bundle.title}</h3>
                <Badge variant="outline" className={`text-[10px] ${scopeColors[bundle.scope_level] ?? ""}`}>
                  {bundle.scope_level}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{bundle.description}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <span className="text-xs font-medium">{bundleItems.length} items</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${bundle.health_score > 0.8 ? "bg-emerald-500" : bundle.health_score > 0.5 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${bundle.health_score * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{Math.round(bundle.health_score * 100)}%</span>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); onEditBundle(bundle); }}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); onDeleteBundle(bundle.id); }}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border/30 bg-secondary/5">
            {bundleItems.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground">
                No items in this bundle yet.
              </div>
            ) : (
              <div className="divide-y divide-border/20">
                {bundleItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-2.5 group/item hover:bg-secondary/20 transition-colors">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium truncate">{item.title}</span>
                        <CategoryBadge category={item.category} />
                      </div>
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{item.content_preview}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 shrink-0">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onEditItem(item)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => onDestroyItem(item)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function BundleFirstView({
  items,
  bundles,
  onEditItem,
  onDestroyItem,
  onEditBundle,
  onDeleteBundle,
  onCreateItem,
  onCreateBundle,
}: BundleFirstViewProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Items grouped by bundle
  const bundledItemsMap = useMemo(() => {
    const map = new Map<string, MockContextItem[]>();
    for (const item of items) {
      if (item.bundle_id) {
        const existing = map.get(item.bundle_id) || [];
        existing.push(item);
        map.set(item.bundle_id, existing);
      }
    }
    return map;
  }, [items]);

  const looseItems = useMemo(() =>
    items.filter(i => !i.bundle_id),
  [items]);

  // Apply search & category filter
  const matchesFilter = (item: MockContextItem) => {
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.content_preview.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && item.category !== categoryFilter) return false;
    return true;
  };

  const filteredBundles = useMemo(() => {
    if (!search && !categoryFilter) return bundles;
    return bundles.filter(b => {
      if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.description.toLowerCase().includes(search.toLowerCase())) {
        // Check if any items inside match
        const bItems = bundledItemsMap.get(b.id) || [];
        return bItems.some(matchesFilter);
      }
      if (categoryFilter) {
        const bItems = bundledItemsMap.get(b.id) || [];
        return bItems.some(i => i.category === categoryFilter);
      }
      return true;
    });
  }, [bundles, search, categoryFilter, bundledItemsMap]);

  const filteredLooseItems = useMemo(() =>
    looseItems.filter(matchesFilter),
  [looseItems, search, categoryFilter]);

  const filteredBundleItems = (bundleId: string) => {
    const bItems = bundledItemsMap.get(bundleId) || [];
    if (!search && !categoryFilter) return bItems;
    return bItems.filter(matchesFilter);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="shrink-0 p-4 space-y-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bundles & items…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={onCreateBundle}>
            <Package className="h-3.5 w-3.5" /> New Bundle
          </Button>
          <Button size="sm" className="gap-1.5 text-xs" onClick={onCreateItem}>
            <Plus className="h-3.5 w-3.5" /> New Item
          </Button>
        </div>
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
          {categoryFilter && (
            <button
              className="text-[10px] text-muted-foreground hover:text-foreground ml-1"
              onClick={() => setCategoryFilter(null)}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {/* Summary */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{bundles.length} bundles · {looseItems.length} unbundled items</span>
        </div>

        {/* Bundles */}
        {filteredBundles.map(bundle => (
          <BundleExpandable
            key={bundle.id}
            bundle={bundle}
            bundleItems={filteredBundleItems(bundle.id)}
            onEditItem={onEditItem}
            onDestroyItem={onDestroyItem}
            onEditBundle={onEditBundle}
            onDeleteBundle={onDeleteBundle}
          />
        ))}

        {filteredBundles.length === 0 && !search && !categoryFilter && (
          <div className="rounded-lg border border-dashed border-border/50 p-8 text-center">
            <Package className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No bundles yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create a bundle to group related knowledge items, or upload a document to auto-generate them.
            </p>
            <Button size="sm" className="mt-3 gap-1.5" onClick={onCreateBundle}>
              <Plus className="h-3 w-3" /> Create First Bundle
            </Button>
          </div>
        )}

        {/* Loose Items */}
        {filteredLooseItems.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Inbox className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-muted-foreground">Unbundled Items</h3>
              <Badge variant="secondary" className="text-[10px]">{filteredLooseItems.length}</Badge>
              {filteredLooseItems.length >= 3 && (
                <div className="flex items-center gap-1 ml-auto text-[10px] text-primary">
                  <Sparkles className="h-3 w-3" />
                  <span>AI can group these into bundles</span>
                </div>
              )}
            </div>
            <div className="rounded-lg border border-dashed border-border/40 bg-card/50 divide-y divide-border/20">
              {filteredLooseItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3 group hover:bg-secondary/20 transition-colors">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{item.title}</span>
                      <CategoryBadge category={item.category} />
                      {item.priority === "CRITICAL" && (
                        <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-400">CRITICAL</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.content_preview}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEditItem(item)}>
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDestroyItem(item)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
