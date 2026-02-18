import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, ChevronRight, BookOpen, Zap, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface SynthesizedCapture {
  title: string;
  content: string;
  capture_type: string;
  severity: string;
}

interface AfterActionReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  executionId: string;
  protocolTitle: string;
  workbookTitle: string;
  onComplete?: () => void;
}

const captureTypeConfig: Record<string, { label: string; color: string; icon: typeof BookOpen }> = {
  best_practice: { label: "Best Practice", color: "text-success border-success/30 bg-success/10", icon: CheckCircle2 },
  friction: { label: "Friction", color: "text-warning border-warning/30 bg-warning/10", icon: AlertTriangle },
  enhancement: { label: "Enhancement", color: "text-primary border-primary/30 bg-primary/10", icon: TrendingUp },
  learning: { label: "Learning", color: "text-info border-info/30 bg-info/10", icon: Zap },
};

const QUESTIONS = [
  {
    key: "what_worked" as const,
    label: "What worked well?",
    hint: "Steps, approaches, or decisions that went smoothly and should be repeated.",
    placeholder: "e.g. The stakeholder alignment step was well-structured and saved us from rework later...",
  },
  {
    key: "what_didnt" as const,
    label: "What caused friction or didn't work?",
    hint: "Blockers, unclear instructions, missing context, or steps that felt wasteful.",
    placeholder: "e.g. The approval gate required information we didn't have until step 5 — the order felt off...",
  },
  {
    key: "would_do_differently" as const,
    label: "What would you do differently next time?",
    hint: "Specific changes to the process, sequence, or preparation that would improve outcomes.",
    placeholder: "e.g. I'd pre-gather the budget data before starting — it's needed in 3 different steps...",
  },
];

export function AfterActionReviewModal({
  open,
  onOpenChange,
  executionId,
  protocolTitle,
  workbookTitle,
  onComplete,
}: AfterActionReviewModalProps) {
  const { toast } = useToast();
  const qc = useQueryClient();

  const [step, setStep] = useState<"form" | "synthesizing" | "results">("form");
  const [answers, setAnswers] = useState({ what_worked: "", what_didnt: "", would_do_differently: "" });
  const [synthesizedCaptures, setSynthesizedCaptures] = useState<SynthesizedCapture[]>([]);

  const canSubmit = answers.what_worked.trim() || answers.what_didnt.trim() || answers.would_do_differently.trim();

  const handleSubmit = async () => {
    setStep("synthesizing");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Not authenticated");

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-aar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            execution_id: executionId,
            ...answers,
          }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error((err as any).error || `Error ${resp.status}`);
      }

      const data = await resp.json();
      setSynthesizedCaptures(data.synthesized_captures ?? []);
      setStep("results");

      // Invalidate relevant queries so captures panel updates
      qc.invalidateQueries({ queryKey: ["execution-captures", executionId] });
    } catch (err: any) {
      toast({ title: "Review failed", description: err.message, variant: "destructive" });
      setStep("form");
    }
  };

  const handleDone = () => {
    setStep("form");
    setAnswers({ what_worked: "", what_didnt: "", would_do_differently: "" });
    setSynthesizedCaptures([]);
    onOpenChange(false);
    onComplete?.();
  };

  const handleSkip = () => {
    setStep("form");
    setAnswers({ what_worked: "", what_didnt: "", would_do_differently: "" });
    onOpenChange(false);
    onComplete?.();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleSkip(); else onOpenChange(o); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* ── Header ── */}
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base leading-tight">After-Action Review</DialogTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {protocolTitle} · {workbookTitle}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* ── FORM STEP ── */}
        {step === "form" && (
          <div className="space-y-5 pt-1">
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <p className="text-xs text-primary font-medium">
                Protocol complete. Capture what you learned — your insights will be synthesized into organizational knowledge.
              </p>
            </div>

            {QUESTIONS.map((q) => (
              <div key={q.key} className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0" />
                  {q.label}
                </label>
                <p className="text-[11px] text-muted-foreground pl-5">{q.hint}</p>
                <Textarea
                  value={answers[q.key]}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [q.key]: e.target.value }))}
                  placeholder={q.placeholder}
                  rows={3}
                  className="text-sm resize-none"
                />
              </div>
            ))}

            <div className="flex items-center justify-between pt-1">
              <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
                Skip for now
              </Button>
              <Button size="sm" onClick={handleSubmit} disabled={!canSubmit}>
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Synthesize Learnings
              </Button>
            </div>
          </div>
        )}

        {/* ── SYNTHESIZING STEP ── */}
        {step === "synthesizing" && (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-7 w-7 text-primary animate-spin" />
              </div>
              <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-30" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">Synthesizing your review</p>
              <p className="text-xs text-muted-foreground">Extracting actionable knowledge from your debrief…</p>
            </div>
          </div>
        )}

        {/* ── RESULTS STEP ── */}
        {step === "results" && (
          <div className="space-y-4 pt-1">
            <div className="rounded-lg border border-success/20 bg-success/5 px-4 py-3 flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-success">Learnings captured</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {synthesizedCaptures.length} knowledge item{synthesizedCaptures.length !== 1 ? "s" : ""} extracted and added to this session's captures.
                </p>
              </div>
            </div>

            {synthesizedCaptures.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-muted-foreground">Synthesized Captures</p>
                {synthesizedCaptures.map((capture, i) => {
                  const cfg = captureTypeConfig[capture.capture_type] ?? captureTypeConfig.learning;
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={i}
                      className="rounded-lg border border-border/50 bg-card p-3 space-y-1"
                    >
                      <div className="flex items-start gap-2">
                        <Icon className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${cfg.color.split(" ")[0]}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">{capture.title}</span>
                            <Badge
                              variant="outline"
                              className={`text-[9px] font-semibold tracking-wider uppercase ${cfg.color}`}
                            >
                              {cfg.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{capture.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {synthesizedCaptures.length === 0 && (
              <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-6 text-center">
                <p className="text-sm text-muted-foreground">No specific captures were extracted. Your review has been saved.</p>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <Button size="sm" onClick={handleDone}>
                Done <CheckCircle2 className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
