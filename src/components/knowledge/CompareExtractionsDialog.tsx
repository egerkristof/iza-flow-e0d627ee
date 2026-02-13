import { useState, useCallback, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle2, XCircle, ArrowRight, Diff, LayoutGrid, Plus, Minus, Equal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CategoryBadge } from "./CategoryBadge";
import {
  type ExtractionResult,
  type ExtractionDepth,
  type ExtractedContextItem,
  type ExtractedBundle,
  EXTRACTION_DEPTH_META,
} from "@/lib/knowledge-schema";

interface CompareExtractionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceName: string;
  buildBody: () => Record<string, any>;
  onSelectResult: (data: ExtractionResult, depth: ExtractionDepth) => void;
}

type RunState = "idle" | "running" | "done" | "error";

interface DepthRun {
  state: RunState;
  result: ExtractionResult | null;
  error: string | null;
  durationMs: number | null;
}

const DEPTHS: ExtractionDepth[] = ["quick", "guided", "deep"];

/** Normalize title for fuzzy matching */
function normalizeTitle(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

/** Get all items (standalone + bundled) from a result */
function allItems(r: ExtractionResult | null): ExtractedContextItem[] {
  if (!r) return [];
  return [
    ...r.context_items,
    ...(r.bundles || []).flatMap((b) => b.items),
  ];
}

/** Compute diff: items in `target` not in `baseline` */
function computeNewItems(
  baseline: ExtractionResult | null,
  target: ExtractionResult | null
): ExtractedContextItem[] {
  const baseSet = new Set(allItems(baseline).map((i) => normalizeTitle(i.title)));
  return allItems(target).filter((i) => !baseSet.has(normalizeTitle(i.title)));
}

/** Compute items present in both */
function computeSharedItems(
  baseline: ExtractionResult | null,
  target: ExtractionResult | null
): ExtractedContextItem[] {
  const baseSet = new Set(allItems(baseline).map((i) => normalizeTitle(i.title)));
  return allItems(target).filter((i) => baseSet.has(normalizeTitle(i.title)));
}

/** Compute bundles in target but not in baseline */
function computeNewBundles(
  baseline: ExtractionResult | null,
  target: ExtractionResult | null
): ExtractedBundle[] {
  const baseSet = new Set((baseline?.bundles || []).map((b) => normalizeTitle(b.title)));
  return (target?.bundles || []).filter((b) => !baseSet.has(normalizeTitle(b.title)));
}

/** Compute prefs in target but not in baseline */
function computeNewPrefs(
  baseline: ExtractionResult | null,
  target: ExtractionResult | null
) {
  const baseSet = new Set((baseline?.preferences || []).map((p) => p.preference_key));
  return (target?.preferences || []).filter((p) => !baseSet.has(p.preference_key));
}

export function CompareExtractionsDialog({
  open,
  onOpenChange,
  sourceName,
  buildBody,
  onSelectResult,
}: CompareExtractionsDialogProps) {
  const [runs, setRuns] = useState<Record<ExtractionDepth, DepthRun>>({
    quick: { state: "idle", result: null, error: null, durationMs: null },
    guided: { state: "idle", result: null, error: null, durationMs: null },
    deep: { state: "idle", result: null, error: null, durationMs: null },
  });
  const [started, setStarted] = useState(false);
  const [viewTab, setViewTab] = useState<"side-by-side" | "diff">("side-by-side");

  const allDone = DEPTHS.every((d) => runs[d].state === "done" || runs[d].state === "error");

  const runAll = useCallback(async () => {
    setStarted(true);
    setRuns({
      quick: { state: "running", result: null, error: null, durationMs: null },
      guided: { state: "running", result: null, error: null, durationMs: null },
      deep: { state: "running", result: null, error: null, durationMs: null },
    });

    const baseBody = buildBody();

    const runOne = async (depth: ExtractionDepth) => {
      const t0 = performance.now();
      try {
        let advisorPersona = null;
        if (depth !== "quick") {
          const advisorContent = baseBody.content || baseBody.documentId || sourceName;
          const { data: advisorData, error: advisorError } = await supabase.functions.invoke(
            "generate-advisor",
            { body: { content: typeof advisorContent === "string" ? advisorContent.slice(0, 2000) : sourceName, meta: { title: sourceName } } }
          );
          if (!advisorError && advisorData && !advisorData.error) {
            advisorPersona = advisorData;
          }
        }

        const { data, error } = await supabase.functions.invoke("extract-knowledge", {
          body: {
            ...baseBody,
            extraction_depth: depth,
            ...(advisorPersona ? { advisor_persona: advisorPersona } : {}),
          },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        const elapsed = Math.round(performance.now() - t0);
        setRuns((prev) => ({
          ...prev,
          [depth]: { state: "done", result: data as ExtractionResult, error: null, durationMs: elapsed },
        }));
      } catch (err: any) {
        const elapsed = Math.round(performance.now() - t0);
        setRuns((prev) => ({
          ...prev,
          [depth]: { state: "error", result: null, error: err.message, durationMs: elapsed },
        }));
      }
    };

    await Promise.allSettled(DEPTHS.map((d) => runOne(d)));
  }, [buildBody, sourceName]);

  const countItems = (r: ExtractionResult | null) => {
    if (!r) return { prefs: 0, items: 0, bundles: 0, bundleItems: 0, total: 0 };
    const prefs = r.preferences?.length ?? 0;
    const items = r.context_items?.length ?? 0;
    const bundles = r.bundles?.length ?? 0;
    const bundleItems = (r.bundles || []).reduce((s, b) => s + b.items.length, 0);
    return { prefs, items, bundles, bundleItems, total: prefs + items + bundleItems };
  };

  // Diff computations
  const diffData = useMemo(() => {
    const quickResult = runs.quick.result;
    const guidedResult = runs.guided.result;
    const deepResult = runs.deep.result;

    return {
      guidedVsQuick: {
        newItems: computeNewItems(quickResult, guidedResult),
        sharedItems: computeSharedItems(quickResult, guidedResult),
        newBundles: computeNewBundles(quickResult, guidedResult),
        newPrefs: computeNewPrefs(quickResult, guidedResult),
      },
      deepVsQuick: {
        newItems: computeNewItems(quickResult, deepResult),
        sharedItems: computeSharedItems(quickResult, deepResult),
        newBundles: computeNewBundles(quickResult, deepResult),
        newPrefs: computeNewPrefs(quickResult, deepResult),
      },
      deepVsGuided: {
        newItems: computeNewItems(guidedResult, deepResult),
        sharedItems: computeSharedItems(guidedResult, deepResult),
        newBundles: computeNewBundles(guidedResult, deepResult),
        newPrefs: computeNewPrefs(guidedResult, deepResult),
      },
    };
  }, [runs]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            Compare Extraction Depths
            <Badge variant="outline" className="text-xs font-normal">{sourceName}</Badge>
          </DialogTitle>
        </DialogHeader>

        {!started ? (
          <div className="flex flex-col items-center gap-4 py-10">
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Run all three extraction depths simultaneously and compare the results side-by-side.
            </p>
            <div className="flex gap-3">
              {DEPTHS.map((d) => {
                const meta = EXTRACTION_DEPTH_META[d];
                return (
                  <div key={d} className="rounded-lg border border-border bg-muted/20 p-3 text-center w-40">
                    <span className="text-2xl">{meta.icon}</span>
                    <p className="text-sm font-medium mt-1">{meta.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{meta.description}</p>
                  </div>
                );
              })}
            </div>
            <Button onClick={runAll} className="mt-2 gap-2">
              Run All Three
            </Button>
          </div>
        ) : (
          <Tabs value={viewTab} onValueChange={(v) => setViewTab(v as any)} className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between shrink-0">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="side-by-side" className="gap-1.5 text-xs">
                  <LayoutGrid className="h-3 w-3" /> Side-by-Side
                </TabsTrigger>
                <TabsTrigger value="diff" className="gap-1.5 text-xs" disabled={!allDone}>
                  <Diff className="h-3 w-3" /> Diff View
                </TabsTrigger>
              </TabsList>
              {!allDone && (
                <span className="text-[10px] text-muted-foreground animate-pulse">
                  Running extractions…
                </span>
              )}
            </div>

            {/* ── SIDE-BY-SIDE TAB ── */}
            <TabsContent value="side-by-side" className="flex-1 min-h-0 mt-2">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-3 gap-3 pb-4">
                  {DEPTHS.map((depth) => (
                    <DepthColumn
                      key={depth}
                      depth={depth}
                      run={runs[depth]}
                      countItems={countItems}
                      onSelectResult={onSelectResult}
                      onOpenChange={onOpenChange}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* ── DIFF VIEW TAB ── */}
            <TabsContent value="diff" className="flex-1 min-h-0 mt-2">
              <ScrollArea className="h-full">
                <div className="space-y-4 pb-4">
                  {/* Summary bar */}
                  <div className="grid grid-cols-3 gap-3">
                    {DEPTHS.map((depth) => {
                      const run = runs[depth];
                      const counts = countItems(run.result);
                      const meta = EXTRACTION_DEPTH_META[depth];
                      return (
                        <div key={depth} className="rounded-lg border border-border bg-card p-3 text-center">
                          <p className="text-sm font-semibold">{meta.icon} {meta.label}</p>
                          <p className="text-2xl font-bold text-foreground mt-1">{counts.total}</p>
                          <p className="text-[10px] text-muted-foreground">total items extracted</p>
                          {run.durationMs && (
                            <Badge variant="outline" className="text-[10px] mt-1">{(run.durationMs / 1000).toFixed(1)}s</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Guided vs Quick */}
                  <DiffSection
                    title="🎯 Guided Extract vs ⚡ Quick Scan"
                    subtitle="What Guided found that Quick missed"
                    diff={diffData.guidedVsQuick}
                    targetDepth="guided"
                    targetResult={runs.guided.result}
                    onSelectResult={onSelectResult}
                    onOpenChange={onOpenChange}
                  />

                  {/* Deep vs Quick */}
                  <DiffSection
                    title="🔬 Deep Analysis vs ⚡ Quick Scan"
                    subtitle="What Deep found that Quick missed"
                    diff={diffData.deepVsQuick}
                    targetDepth="deep"
                    targetResult={runs.deep.result}
                    onSelectResult={onSelectResult}
                    onOpenChange={onOpenChange}
                    highlight
                  />

                  {/* Deep vs Guided */}
                  <DiffSection
                    title="🔬 Deep Analysis vs 🎯 Guided Extract"
                    subtitle="Additional items Deep found beyond Guided"
                    diff={diffData.deepVsGuided}
                    targetDepth="deep"
                    targetResult={runs.deep.result}
                    onSelectResult={onSelectResult}
                    onOpenChange={onOpenChange}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ─── Depth Column (side-by-side) ─── */
function DepthColumn({
  depth, run, countItems, onSelectResult, onOpenChange,
}: {
  depth: ExtractionDepth;
  run: DepthRun;
  countItems: (r: ExtractionResult | null) => { prefs: number; items: number; bundles: number; bundleItems: number; total: number };
  onSelectResult: (data: ExtractionResult, depth: ExtractionDepth) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const meta = EXTRACTION_DEPTH_META[depth];
  const counts = countItems(run.result);

  return (
    <div className="rounded-lg border border-border bg-card flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span>{meta.icon}</span>
          <span className="text-sm font-semibold">{meta.label}</span>
        </div>
        {run.state === "running" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        {run.state === "done" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        {run.state === "error" && <XCircle className="h-4 w-4 text-destructive" />}
      </div>

      <div className="p-3 flex-1 space-y-3 text-xs">
        {run.state === "running" && (
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Extracting…</span>
          </div>
        )}

        {run.state === "error" && (
          <div className="text-destructive py-4 text-center">
            <p className="font-medium">Failed</p>
            <p className="text-[10px] mt-1 opacity-70">{run.error}</p>
          </div>
        )}

        {run.state === "done" && run.result && (
          <>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-[10px]">{counts.total} total items</Badge>
              {counts.prefs > 0 && <Badge variant="outline" className="text-[10px]">{counts.prefs} prefs</Badge>}
              {counts.items > 0 && <Badge variant="outline" className="text-[10px]">{counts.items} standalone</Badge>}
              {counts.bundles > 0 && <Badge variant="outline" className="text-[10px]">{counts.bundles} bundles ({counts.bundleItems} items)</Badge>}
              {run.durationMs && <Badge variant="outline" className="text-[10px] text-muted-foreground">{(run.durationMs / 1000).toFixed(1)}s</Badge>}
            </div>

            {run.result.advisor && (
              <div className="rounded border border-amber-500/20 bg-amber-500/5 p-2">
                <p className="font-medium text-amber-400 text-[11px]">
                  {run.result.advisor.icon_suggestion || "🎯"} {run.result.advisor.persona_title}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{run.result.advisor.domain}</p>
              </div>
            )}

            <div>
              <p className="font-medium text-muted-foreground mb-1">Categories</p>
              <CategoryBreakdown result={run.result} />
            </div>

            <div>
              <p className="font-medium text-muted-foreground mb-1">Sample Items</p>
              <div className="space-y-1">
                {run.result.context_items.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5 rounded bg-muted/30 px-2 py-1">
                    <CategoryBadge category={item.category} compact />
                    <span className="truncate text-[11px]">{item.title}</span>
                  </div>
                ))}
                {(run.result.bundles || []).slice(0, 2).map((bundle, bi) => (
                  <div key={`b-${bi}`} className="rounded bg-muted/30 px-2 py-1">
                    <span className="text-[11px] font-medium">📦 {bundle.title}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">({bundle.items.length} items)</span>
                  </div>
                ))}
                {counts.total > 6 && (
                  <p className="text-[10px] text-muted-foreground italic pl-1">+{counts.total - 6} more…</p>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5 mt-1"
              onClick={() => { onSelectResult(run.result!, depth); onOpenChange(false); }}
            >
              Use this result <ArrowRight className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Diff Section ─── */
function DiffSection({
  title, subtitle, diff, highlight, targetDepth, targetResult, onSelectResult, onOpenChange,
}: {
  title: string;
  subtitle: string;
  diff: {
    newItems: ExtractedContextItem[];
    sharedItems: ExtractedContextItem[];
    newBundles: ExtractedBundle[];
    newPrefs: { preference_key: string; preference_value: string }[];
  };
  highlight?: boolean;
  targetDepth: ExtractionDepth;
  targetResult: ExtractionResult | null;
  onSelectResult: (data: ExtractionResult, depth: ExtractionDepth) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const totalNew = diff.newItems.length + diff.newBundles.reduce((s, b) => s + b.items.length, 0) + diff.newPrefs.length;
  const hasNew = totalNew > 0;

  return (
    <div className={`rounded-lg border ${highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card"} overflow-hidden`}>
      {/* Header */}
      <div className="p-3 border-b border-border/50 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          {hasNew ? (
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] gap-1">
              <Plus className="h-2.5 w-2.5" /> {totalNew} new
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] gap-1 text-muted-foreground">
              <Equal className="h-2.5 w-2.5" /> No difference
            </Badge>
          )}
          <Badge variant="outline" className="text-[10px] gap-1 text-muted-foreground">
            <Equal className="h-2.5 w-2.5" /> {diff.sharedItems.length} shared
          </Badge>
        </div>
      </div>

      {hasNew && (
        <div className="p-3 space-y-3">
          {/* New items */}
          {diff.newItems.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                New Context Items ({diff.newItems.length})
              </p>
              <div className="space-y-1">
                {diff.newItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-md bg-emerald-500/5 border border-emerald-500/15 px-2.5 py-1.5">
                    <Plus className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                    <CategoryBadge category={item.category} compact />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium truncate">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New bundles */}
          {diff.newBundles.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                New Bundles ({diff.newBundles.length})
              </p>
              <div className="space-y-1">
                {diff.newBundles.map((bundle, i) => (
                  <div key={i} className="rounded-md bg-emerald-500/5 border border-emerald-500/15 px-2.5 py-1.5">
                    <div className="flex items-center gap-2">
                      <Plus className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span className="text-[11px] font-medium">📦 {bundle.title}</span>
                      <Badge variant="outline" className="text-[9px] ml-auto">{bundle.items.length} items</Badge>
                    </div>
                    <div className="ml-5 mt-1 space-y-0.5">
                      {bundle.items.slice(0, 3).map((item, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <CategoryBadge category={item.category} compact />
                          <span className="truncate">{item.title}</span>
                        </div>
                      ))}
                      {bundle.items.length > 3 && (
                        <p className="text-[9px] text-muted-foreground italic">+{bundle.items.length - 3} more</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New preferences */}
          {diff.newPrefs.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
                New Preferences ({diff.newPrefs.length})
              </p>
              <div className="space-y-1">
                {diff.newPrefs.map((pref, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-md bg-emerald-500/5 border border-emerald-500/15 px-2.5 py-1.5">
                    <Plus className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium">{pref.preference_key}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">{pref.preference_value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Use this result */}
          {targetResult && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => { onSelectResult(targetResult, targetDepth); onOpenChange(false); }}
            >
              Use {EXTRACTION_DEPTH_META[targetDepth].icon} {EXTRACTION_DEPTH_META[targetDepth].label} result <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/** Mini category breakdown chart */
function CategoryBreakdown({ result }: { result: ExtractionResult }) {
  const items = allItems(result);
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = items.length || 1;

  return (
    <div className="space-y-1">
      {entries.map(([cat, count]) => (
        <div key={cat} className="flex items-center gap-1.5">
          <CategoryBadge category={cat} compact />
          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/60"
              style={{ width: `${(count / total) * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground w-4 text-right">{count}</span>
        </div>
      ))}
    </div>
  );
}
