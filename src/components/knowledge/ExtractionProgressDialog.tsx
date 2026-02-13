import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Brain, Sparkles, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export type ExtractionPhase = "uploading" | "analyzing" | "extracting" | "done";

interface ExtractionProgressDialogProps {
  open: boolean;
  fileName: string;
  phase: ExtractionPhase;
}

const PHASE_CONFIG: Record<ExtractionPhase, { label: string; subtitle: string; icon: typeof FileText; progress: number }> = {
  uploading: {
    label: "Uploading document",
    subtitle: "Securely storing your file…",
    icon: FileText,
    progress: 15,
  },
  analyzing: {
    label: "Analyzing content",
    subtitle: "Reading and understanding your document…",
    icon: Brain,
    progress: 45,
  },
  extracting: {
    label: "Extracting knowledge",
    subtitle: "Identifying items, bundles & preferences…",
    icon: Sparkles,
    progress: 80,
  },
  done: {
    label: "Extraction complete",
    subtitle: "Your knowledge is ready for review",
    icon: CheckCircle2,
    progress: 100,
  },
};

export function ExtractionProgressDialog({ open, fileName, phase }: ExtractionProgressDialogProps) {
  const config = PHASE_CONFIG[phase];
  const Icon = config.icon;

  // Smooth progress animation — slowly fills within each phase
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (!open) { setDisplayProgress(0); return; }
    const target = config.progress;
    const timer = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev >= target) return target;
        // Ease toward target, slower as we approach
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

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md border-border/50 bg-card"
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
              {config.subtitle}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs space-y-2">
            <Progress value={displayProgress} className="h-2" />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span className="truncate max-w-[180px]">{fileName}</span>
              <span>{Math.round(displayProgress)}%</span>
            </div>
          </div>

          {/* Phase steps */}
          <div className="flex items-center gap-3 text-[11px]">
            {(["uploading", "analyzing", "extracting"] as ExtractionPhase[]).map((p, i) => {
              const isActive = p === phase;
              const isDone = config.progress > PHASE_CONFIG[p].progress || phase === "done";
              return (
                <div key={p} className="flex items-center gap-1.5">
                  {i > 0 && <div className={`w-6 h-px ${isDone ? "bg-emerald-500/50" : "bg-border"}`} />}
                  <div className={`flex items-center gap-1 ${
                    isDone ? "text-emerald-400" : isActive ? "text-primary font-medium" : "text-muted-foreground"
                  }`}>
                    {isDone ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <div className={`h-2 w-2 rounded-full ${isActive ? "bg-primary animate-pulse" : "bg-muted-foreground/30"}`} />
                    )}
                    <span className="capitalize">{p === "uploading" ? "Upload" : p === "analyzing" ? "Analyze" : "Extract"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
