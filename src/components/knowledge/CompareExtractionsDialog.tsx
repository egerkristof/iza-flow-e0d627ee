import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CategoryBadge } from "./CategoryBadge";
import {
  type ExtractionResult,
  type ExtractionDepth,
  type ImportCopilotProps,
  EXTRACTION_DEPTH_META,
} from "@/lib/knowledge-schema";

interface CompareExtractionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The document ID to extract from */
  documentId: string;
  documentName: string;
  /** Called when user picks a result to import */
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

export function CompareExtractionsDialog({
  open,
  onOpenChange,
  documentId,
  documentName,
  onSelectResult,
}: CompareExtractionsDialogProps) {
  const [runs, setRuns] = useState<Record<ExtractionDepth, DepthRun>>({
    quick: { state: "idle", result: null, error: null, durationMs: null },
    guided: { state: "idle", result: null, error: null, durationMs: null },
    deep: { state: "idle", result: null, error: null, durationMs: null },
  });
  const [started, setStarted] = useState(false);

  const runAll = useCallback(async () => {
    setStarted(true);
    setRuns({
      quick: { state: "running", result: null, error: null, durationMs: null },
      guided: { state: "running", result: null, error: null, durationMs: null },
      deep: { state: "running", result: null, error: null, durationMs: null },
    });

    const runOne = async (depth: ExtractionDepth) => {
      const t0 = performance.now();
      try {
        // For guided/deep: generate advisor first
        let advisorPersona = null;
        if (depth !== "quick") {
          const { data: advisorData, error: advisorError } = await supabase.functions.invoke(
            "generate-advisor",
            { body: { content: documentName, meta: { title: documentName } } }
          );
          if (!advisorError && advisorData && !advisorData.error) {
            advisorPersona = advisorData;
          }
        }

        const { data, error } = await supabase.functions.invoke("extract-knowledge", {
          body: {
            documentId,
            source_type: "document",
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

    // Run all three in parallel
    await Promise.allSettled(DEPTHS.map((d) => runOne(d)));
  }, [documentId, documentName]);

  const allDone = DEPTHS.every((d) => runs[d].state === "done" || runs[d].state === "error");

  const countItems = (r: ExtractionResult | null) => {
    if (!r) return { prefs: 0, items: 0, bundles: 0, bundleItems: 0, total: 0 };
    const prefs = r.preferences?.length ?? 0;
    const items = r.context_items?.length ?? 0;
    const bundles = r.bundles?.length ?? 0;
    const bundleItems = (r.bundles || []).reduce((s, b) => s + b.items.length, 0);
    return { prefs, items, bundles, bundleItems, total: prefs + items + bundleItems };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            Compare Extraction Depths
            <Badge variant="outline" className="text-xs font-normal">{documentName}</Badge>
          </DialogTitle>
        </DialogHeader>

        {!started ? (
          <div className="flex flex-col items-center gap-4 py-10">
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Run all three extraction depths on this document simultaneously and compare the results side-by-side.
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
              <Loader2 className="h-4 w-4 hidden" />
              Run All Three
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1 min-h-0">
            <div className="grid grid-cols-3 gap-3 pb-4">
              {DEPTHS.map((depth) => {
                const meta = EXTRACTION_DEPTH_META[depth];
                const run = runs[depth];
                const counts = countItems(run.result);

                return (
                  <div key={depth} className="rounded-lg border border-border bg-card flex flex-col">
                    {/* Header */}
                    <div className="p-3 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span>{meta.icon}</span>
                        <span className="text-sm font-semibold">{meta.label}</span>
                      </div>
                      {run.state === "running" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                      {run.state === "done" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      {run.state === "error" && <XCircle className="h-4 w-4 text-destructive" />}
                    </div>

                    {/* Content */}
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
                          {/* Stats */}
                          <div className="flex flex-wrap gap-1.5">
                            <Badge variant="secondary" className="text-[10px]">
                              {counts.total} total items
                            </Badge>
                            {counts.prefs > 0 && (
                              <Badge variant="outline" className="text-[10px]">
                                {counts.prefs} prefs
                              </Badge>
                            )}
                            {counts.items > 0 && (
                              <Badge variant="outline" className="text-[10px]">
                                {counts.items} standalone
                              </Badge>
                            )}
                            {counts.bundles > 0 && (
                              <Badge variant="outline" className="text-[10px]">
                                {counts.bundles} bundles ({counts.bundleItems} items)
                              </Badge>
                            )}
                            {run.durationMs && (
                              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                                {(run.durationMs / 1000).toFixed(1)}s
                              </Badge>
                            )}
                          </div>

                          {/* Advisor */}
                          {run.result.advisor && (
                            <div className="rounded border border-amber-500/20 bg-amber-500/5 p-2">
                              <p className="font-medium text-amber-400 text-[11px]">
                                {run.result.advisor.icon_suggestion || "🎯"} {run.result.advisor.persona_title}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {run.result.advisor.domain}
                              </p>
                            </div>
                          )}

                          {/* Category breakdown */}
                          <div>
                            <p className="font-medium text-muted-foreground mb-1">Categories</p>
                            <CategoryBreakdown result={run.result} />
                          </div>

                          {/* Sample items */}
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
                                <p className="text-[10px] text-muted-foreground italic pl-1">
                                  +{counts.total - 6} more…
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Use this button */}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-1.5 mt-1"
                            onClick={() => {
                              onSelectResult(run.result!, depth);
                              onOpenChange(false);
                            }}
                          >
                            Use this result <ArrowRight className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** Mini category breakdown chart */
function CategoryBreakdown({ result }: { result: ExtractionResult }) {
  const allItems = [
    ...result.context_items,
    ...(result.bundles || []).flatMap((b) => b.items),
  ];
  const counts: Record<string, number> = {};
  for (const item of allItems) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = allItems.length || 1;

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
