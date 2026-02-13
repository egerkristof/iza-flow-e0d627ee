import { useState, useMemo } from "react";
import type { ExtractionDepth } from "@/lib/knowledge-schema";
import {
  Package, ChevronDown, ChevronRight, Search, Plus,
  FileText, Pencil, Trash2, Sparkles, Inbox, Upload, SlidersHorizontal,
  Layers, Tag, Loader2, Rocket, BookOpen, Circle, CheckCircle2, ArrowUpCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CategoryBadge } from "@/components/knowledge/CategoryBadge";
import { CategoryFilterBadge } from "@/components/knowledge/CategoryFilterBadge";
import { ExtractionDepthSelector } from "@/components/knowledge/ExtractionDepthSelector";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { type MockBundle, type MockContextItem, ALL_CATEGORIES } from "@/data/mockContextItems";
import { DeployToWorkbookDialog } from "@/components/context/DeployToWorkbookDialog";

interface BundleFirstViewProps {
  items: MockContextItem[];
  bundles: MockBundle[];
  allDomainTags: string[];
  onEditItem: (item: MockContextItem) => void;
  onDestroyItem: (item: MockContextItem) => void;
  onEditBundle: (bundle: MockBundle) => void;
  onDeleteBundle: (id: string) => void;
  onCreateItem: () => void;
  onCreateBundle: () => void;
  onOpenCopilot: () => void;
  copilotOpen: boolean;
  onOpenLoom: () => void;
  loomExtracting: boolean;
  extractionDepth: ExtractionDepth;
  onExtractionDepthChange: (depth: ExtractionDepth) => void;
}

const scopeColors: Record<string, string> = {
  org: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  domain: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  team: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  draft: "border-muted-foreground/30 bg-muted/50 text-muted-foreground",
};

const MAX_VISIBLE_WORKBOOKS = 3;

type ReadinessState = "draft" | "ready" | "deployed";

const readinessConfig: Record<ReadinessState, { label: string; icon: typeof Circle; className: string }> = {
  draft: { label: "Draft", icon: Circle, className: "border-muted-foreground/30 text-muted-foreground bg-muted/30" },
  ready: { label: "Ready", icon: ArrowUpCircle, className: "border-primary/30 text-primary bg-primary/10" },
  deployed: { label: "Deployed", icon: CheckCircle2, className: "border-emerald-500/30 text-emerald-500 bg-emerald-500/10" },
};

function useDeployments(bundleId: string) {
  return useQuery({
    queryKey: ["bundle-deployments", bundleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_resources")
        .select("workbook_id, workbooks!workbook_resources_workbook_id_fkey(title)")
        .eq("resource_type", "bundle")
        .contains("metadata", { bundle_id: bundleId } as any);
      if (error) throw error;
      return (data || []).map((r: any) => ({
        workbook_id: r.workbook_id,
        title: r.workbooks?.title ?? "Untitled",
      }));
    },
  });
}

function getReadiness(scopeLevel: string, deploymentCount: number): ReadinessState {
  if (deploymentCount > 0) return "deployed";
  if (scopeLevel === "draft") return "draft";
  return "ready";
}

function ReadinessBadge({ state, onClick }: { state: ReadinessState; onClick?: () => void }) {
  const config = readinessConfig[state];
  const Icon = config.icon;
  const isClickable = !!onClick && state !== "deployed";
  const hint = state === "draft" ? "Promote scope" : state === "ready" ? "Deploy to workbook" : "Deployed";
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`text-[9px] px-1.5 py-0 h-4 gap-0.5 ${config.className} ${isClickable ? "cursor-pointer hover:ring-1 hover:ring-primary/30 transition-shadow" : ""}`}
            onClick={isClickable ? (e) => { e.stopPropagation(); onClick(); } : undefined}
          >
            <Icon className="h-2.5 w-2.5" />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">{hint}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function DeploymentBadges({ deployments }: { deployments: { workbook_id: string; title: string }[] }) {
  if (deployments.length === 0) return null;

  const visible = deployments.slice(0, MAX_VISIBLE_WORKBOOKS);
  const overflow = deployments.length - MAX_VISIBLE_WORKBOOKS;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <BookOpen className="h-3 w-3 text-muted-foreground shrink-0" />
      {visible.map((d) => (
        <Badge key={d.workbook_id} variant="secondary" className="text-[9px] px-1.5 py-0 h-4 gap-1">
          {d.title}
        </Badge>
      ))}
      {overflow > 0 && (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 cursor-default">
                +{overflow} more
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <div className="space-y-0.5">
                {deployments.slice(MAX_VISIBLE_WORKBOOKS).map((d) => (
                  <div key={d.workbook_id} className="text-xs">{d.title}</div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

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
  const [deployOpen, setDeployOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: deployments = [] } = useDeployments(bundle.id);
  const readiness = getReadiness(bundle.scope_level, deployments.length);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="rounded-lg border border-border/50 bg-card overflow-hidden transition-all hover:border-primary/20">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-3 p-4 text-left group">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 shrink-0">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold truncate">{bundle.title}</h3>
                <Badge variant="outline" className={`text-[10px] ${scopeColors[bundle.scope_level] ?? ""}`}>
                  {bundle.scope_level}
                </Badge>
                <ReadinessBadge
                  state={readiness}
                  onClick={readiness === "draft" ? () => onEditBundle(bundle) : readiness === "ready" ? () => setDeployOpen(true) : undefined}
                />
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1">{bundle.description}</p>
              <DeploymentBadges deployments={deployments} />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right mr-1">
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
              {/* Always-visible Deploy button */}
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-[11px] border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
                onClick={(e) => { e.stopPropagation(); setDeployOpen(true); }}
              >
                <Rocket className="h-3 w-3" />
                Deploy
              </Button>
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
      <DeployToWorkbookDialog
        open={deployOpen}
        onOpenChange={setDeployOpen}
        bundleId={bundle.id}
        bundleTitle={bundle.title}
      />
    </Collapsible>
  );
}

export function BundleFirstView({
  items,
  bundles,
  allDomainTags,
  onEditItem,
  onDestroyItem,
  onEditBundle,
  onDeleteBundle,
  onCreateItem,
  onCreateBundle,
  onOpenCopilot,
  copilotOpen,
  onOpenLoom,
  loomExtracting,
  extractionDepth,
  onExtractionDepthChange,
}: BundleFirstViewProps) {
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [domainFilter, setDomainFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const activeFilterCount = (domainFilter ? 1 : 0) + (categoryFilter ? 1 : 0);

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

  // Apply search & filters
  const matchesFilter = (item: MockContextItem) => {
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.content_preview.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (domainFilter && !item.domain_tags.includes(domainFilter)) return false;
    return true;
  };

  const filteredBundles = useMemo(() => {
    if (!search && !categoryFilter && !domainFilter) return bundles;
    return bundles.filter(b => {
      const bItems = bundledItemsMap.get(b.id) || [];
      if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.description.toLowerCase().includes(search.toLowerCase())) {
        return bItems.some(matchesFilter);
      }
      if (categoryFilter || domainFilter) {
        return bItems.some(matchesFilter);
      }
      return true;
    });
  }, [bundles, search, categoryFilter, domainFilter, bundledItemsMap]);

  const filteredLooseItems = useMemo(() =>
    looseItems.filter(matchesFilter),
  [looseItems, search, categoryFilter, domainFilter]);

  const filteredBundleItems = (bundleId: string) => {
    const bItems = bundledItemsMap.get(bundleId) || [];
    if (!search && !categoryFilter && !domainFilter) return bItems;
    return bItems.filter(matchesFilter);
  };

  const clearFilters = () => {
    setDomainFilter(null);
    setCategoryFilter(null);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Toolbar */}
      <div className="shrink-0 px-4 pt-3 pb-2 space-y-2">
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

          {/* Collapsible filter toggle */}
          <Button
            variant={filtersOpen || activeFilterCount > 0 ? "secondary" : "ghost"}
            size="sm"
            className="h-9 gap-1.5 text-xs relative"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="default" className="h-4 w-4 p-0 flex items-center justify-center text-[9px] ml-0.5">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          <div className="h-5 w-px bg-border/50" />

          <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-xs" onClick={onOpenCopilot}>
            <Sparkles className="h-3.5 w-3.5" /> {copilotOpen ? "Hide AI" : "AI Copilot"}
          </Button>
          <div className="flex items-center gap-1 rounded-md border border-border/50 bg-secondary/20 px-1.5 py-0.5">
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs px-2" onClick={onOpenLoom} disabled={loomExtracting}>
              {loomExtracting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {loomExtracting ? "Extracting…" : "Import"}
            </Button>
            <div className="h-4 w-px bg-border/50" />
            <ExtractionDepthSelector
              value={extractionDepth}
              onChange={onExtractionDepthChange}
              disabled={loomExtracting}
              compact
            />
          </div>

          <div className="h-5 w-px bg-border/50" />

          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs" onClick={onCreateBundle}>
            <Package className="h-3.5 w-3.5" /> Bundle
          </Button>
          <Button size="sm" className="h-9 gap-1.5 text-xs" onClick={onCreateItem}>
            <Plus className="h-3.5 w-3.5" /> Item
          </Button>
        </div>

        {/* Collapsible two-level filter panel */}
        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleContent>
            <div className="rounded-lg border border-border/40 bg-card/50 p-3 space-y-3">
              {/* Level 1: Domain tags (more important) */}
              {allDomainTags.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    <Layers className="h-3 w-3" /> Domains
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {allDomainTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={domainFilter === tag ? "default" : "secondary"}
                        className="text-[10px] cursor-pointer hover:bg-primary/10"
                        onClick={() => setDomainFilter(domainFilter === tag ? null : tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Level 2: Categories (less important) */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  <Tag className="h-3 w-3" /> Categories
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                {ALL_CATEGORIES.map(cat => (
                    <CategoryFilterBadge
                      key={cat}
                      category={cat}
                      isActive={categoryFilter === cat}
                      onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                    />
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  className="text-[10px] text-muted-foreground hover:text-foreground underline"
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 pb-4 space-y-3">
        {/* Summary */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{bundles.length} bundles · {looseItems.length} unbundled items</span>
          {activeFilterCount > 0 && (
            <span className="text-primary">
              Filtered: {filteredBundles.length} bundles · {filteredLooseItems.length} loose items
            </span>
          )}
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

        {filteredBundles.length === 0 && !search && !categoryFilter && !domainFilter && (
          <div className="rounded-lg border border-dashed border-border/50 p-8 text-center">
            <Package className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No bundles yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create a bundle to group related knowledge items, or import a document to auto-generate them.
            </p>
            <div className="flex flex-col items-center gap-3 mt-3">
              <div className="flex items-center gap-2">
                <Button size="sm" className="gap-1.5" onClick={onCreateBundle}>
                  <Plus className="h-3 w-3" /> Create Bundle
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={onOpenLoom}>
                  <Upload className="h-3 w-3" /> Import Document
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">Extraction depth:</span>
                <ExtractionDepthSelector
                  value={extractionDepth}
                  onChange={onExtractionDepthChange}
                  disabled={loomExtracting}
                  compact
                />
              </div>
            </div>
          </div>
        )}

        {/* Loose Items */}
        {filteredLooseItems.length > 0 && (
          <div className="mt-4">
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
