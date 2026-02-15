import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Brain, Sparkles, CheckCircle2, X, GitMerge, ScanSearch, Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export type ExtractionPhase = "uploading" | "detecting-structure" | "optimizing-structure" | "analyzing" | "extracting" | "matching" | "done";

interface ExtractionProgressDialogProps {
  open: boolean;
  fileName: string;
  phase: ExtractionPhase;
  chunkProgress?: { current: number; total: number } | null;
  onCancel?: () => void;
}

const PHASE_CONFIG: Record<ExtractionPhase, { label: string; subtitle: string; icon: typeof FileText; progress: number }> = {
  uploading: {
    label: "Uploading document",
    subtitle: "Securely storing your file…",
    icon: FileText,
    progress: 10,
  },
  "detecting-structure": {
    label: "Detecting structure",
    subtitle: "Mapping document architecture (ToC, sections, phases)…",
    icon: ScanSearch,
    progress: 20,
  },
  "optimizing-structure": {
    label: "Optimizing structure",
    subtitle: "Semantic analysis — merging related sections, defining hierarchy…",
    icon: ScanSearch,
    progress: 35,
  },
  analyzing: {
    label: "Generating advisor",
    subtitle: "Creating a domain-specific advisor…",
    icon: Brain,
    progress: 40,
  },
  extracting: {
    label: "Extracting knowledge",
    subtitle: "Identifying items, bundles & preferences…",
    icon: Sparkles,
    progress: 70,
  },
  matching: {
    label: "Matching bundles",
    subtitle: "Finding existing bundles to merge with…",
    icon: GitMerge,
    progress: 90,
  },
  done: {
    label: "Extraction complete",
    subtitle: "Your knowledge is ready for review",
    icon: CheckCircle2,
    progress: 100,
  },
};

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function ExtractionProgressDialog({ open, fileName, phase, chunkProgress, onCancel }: ExtractionProgressDialogProps) {
  const config = PHASE_CONFIG[phase];
  const Icon = config.icon;

  const showChunks = phase === "extracting" && chunkProgress && chunkProgress.total > 1;

  // Elapsed timer — starts when dialog opens, resets on close
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (open && phase !== "done") {
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [open, phase === "done"]);

  // Smooth progress animation — slowly fills within each phase
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (!open) { setDisplayProgress(0); return; }
    const target = config.progress;
    const timer = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev >= target) return target;
        const step = Math.max(0.3, (target - prev) * 0.08);
        return Math.min(prev + step, target);
      });
    }, 100);
    return () => clearInterval(timer);
  }, [open, phase, config.progress]);

  // Pulse dots for loading phases
  const [dots, setDots] = useState("");
  useEffect(() => {
    if (phase === "done") { setDots(""); return; }
    const timer = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 500);
    return () => clearInterval(timer);
  }, [phase]);

  // Indeterminate shimmer for long-running phases without chunk progress
  const showIndeterminate = phase === "extracting" && !showChunks;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-lg border-border/50 bg-card"
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <div className="flex flex-col items-center py-6 gap-6">
          {/* Animated icon */}
          <div className="relative">
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${
              phase === "done" 
                ? "bg-emerald-500/10 border border-emerald-500/30" 
                : "bg-primary/10 border border-primary/30"
            }`}>
              <Icon className={`h-9 w-9 ${
                phase === "done" ? "text-emerald-400" : "text-primary"
              } ${phase !== "done" ? "animate-pulse" : ""}`} />
            </div>
            {phase !== "done" && (
              <div className="absolute -inset-2 rounded-3xl border border-primary/10 animate-ping opacity-20" />
            )}
          </div>

          {/* Phase text */}
          <div className="text-center space-y-1.5">
            <h3 className="text-lg font-semibold">
              {config.label}{dots}
            </h3>
            <p className="text-sm text-muted-foreground">
              {showChunks
                ? `Processing chunk ${chunkProgress!.current} of ${chunkProgress!.total}…`
                : config.subtitle}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs space-y-2">
            {showIndeterminate ? (
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/10">
                <div
                  className="absolute inset-y-0 w-1/3 rounded-full bg-primary/60"
                  style={{
                    animation: "shimmer-slide 1.8s ease-in-out infinite",
                  }}
                />
                <style>{`
                  @keyframes shimmer-slide {
                    0% { left: -33%; }
                    50% { left: 100%; }
                    100% { left: -33%; }
                  }
                `}</style>
              </div>
            ) : (
              <Progress value={displayProgress} className="h-2" />
            )}
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span className="truncate max-w-[180px]">{fileName}</span>
              {showIndeterminate ? (
                <span className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {formatElapsed(elapsed)}
                </span>
              ) : (
                <span>{Math.round(displayProgress)}%</span>
              )}
            </div>
            {showChunks && (
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="font-medium text-primary">{chunkProgress!.current}</span>
                <span>/</span>
                <span>{chunkProgress!.total} chunks</span>
              </div>
            )}
          </div>

          {/* Elapsed time badge for non-extracting phases */}
          {phase !== "done" && !showIndeterminate && elapsed >= 5 && (
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground animate-fade-in">
              <Timer className="h-3 w-3" />
              <span>Elapsed: {formatElapsed(elapsed)}</span>
            </div>
          )}

          {/* Phase steps */}
          <div className="flex items-center gap-3 text-[11px]">
            {(["uploading", "detecting-structure", "optimizing-structure", "analyzing", "extracting", "matching"] as ExtractionPhase[]).map((p, i) => {
              const isActive = p === phase;
              const isDone = config.progress > PHASE_CONFIG[p].progress || phase === "done";
              const shortLabel = p === "uploading" ? "Upload" : p === "detecting-structure" ? "Structure" : p === "optimizing-structure" ? "Optimize" : p === "analyzing" ? "Advisor" : p === "matching" ? "Match" : "Extract";
              return (
                <div key={p} className="flex items-center gap-1.5">
                  {i > 0 && <div className={`w-4 h-px ${isDone ? "bg-emerald-500/50" : "bg-border"}`} />}
                  <div className={`flex items-center gap-1 ${
                    isDone ? "text-emerald-400" : isActive ? "text-primary font-medium" : "text-muted-foreground"
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <div className={`h-2 w-2 rounded-full ${isActive ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
                    )}
                    <span>{shortLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cancel button */}
          {phase !== "done" && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
              onClick={onCancel}
            >
              <X className="h-3 w-3" /> Cancel extraction
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
