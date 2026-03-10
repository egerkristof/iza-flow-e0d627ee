import { useState, useCallback } from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { DiagnosticQuestion } from "@/components/marketing/diagnostic/DiagnosticQuestion";
import { DiagnosticResults } from "@/components/marketing/diagnostic/DiagnosticResults";
import { QUESTIONS, calculateResults } from "@/lib/diagnostic-scoring";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ArrowLeft, Zap, Eye, TrendingUp, Target, Loader2 } from "lucide-react";
import type { DiagnosticResult } from "@/lib/diagnostic-scoring";

type Phase = "intro" | "questions" | "calculating" | "results";

export default function DiagnosticPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const finishDiagnostic = useCallback(async (finalAnswers: Record<string, number>) => {
    setPhase("calculating");
    // Brief delay for the calculating animation
    await new Promise((res) => setTimeout(res, 2200));
    const r = calculateResults(finalAnswers);
    setResult(r);
    setPhase("results");
    // Store anonymous result
    try {
      await (supabase as any).from("diagnostic_results").insert({
        answers: finalAnswers,
        scores: Object.fromEntries(r.dimensions.map((d) => [d.dimension, d.score])),
        archetype: r.archetype.label,
        overall_score: r.overall,
      });
    } catch {
      // fail silently
    }
  }, []);

  const handleSelect = useCallback(
    (questionId: string, score: number) => {
      const updatedAnswers = { ...answers, [questionId]: score };
      setAnswers(updatedAnswers);

      const isLastQuestion = currentQ === QUESTIONS.length - 1;
      const allNowAnswered = QUESTIONS.every((q) => updatedAnswers[q.id] != null);

      if (isLastQuestion && allNowAnswered) {
        // Auto-finish after brief selection feedback
        setTimeout(() => finishDiagnostic(updatedAnswers), 500);
      } else if (!isLastQuestion) {
        // Auto-advance to next question
        setTimeout(() => setCurrentQ((q) => q + 1), 400);
      }
    },
    [currentQ, answers, finishDiagnostic]
  );

  const progress = phase === "questions" ? ((currentQ + 1) / QUESTIONS.length) * 100 : 0;
  const currentAnswered = answers[QUESTIONS[currentQ]?.id] != null;

  return (
    <MarketingLayout>
      <div className="min-h-[80vh] flex flex-col">
        {/* Progress bar during questions */}
        {phase === "questions" && (
          <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-3">
            <div className="max-w-2xl mx-auto flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                {currentQ + 1}/{QUESTIONS.length}
              </span>
              <Progress value={progress} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                ~{Math.ceil((QUESTIONS.length - currentQ) * 8 / 60)} min left
              </span>
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center px-6 py-16">
          {/* INTRO */}
          {phase === "intro" && (
            <div className="max-w-2xl text-center space-y-8 animate-in fade-in duration-500">
              <div
                className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-2"
                style={{
                  color: "hsl(var(--primary))",
                  borderColor: "hsl(var(--primary) / 0.25)",
                  background: "hsl(var(--primary) / 0.06)",
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                90-Second Diagnostic
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                Is your team an{" "}
                <span className="brand-gradient-text">AI team</span>
                {" "}— or just people{" "}
                <span className="text-muted-foreground">who happen to use AI?</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
                10 scenario-based questions. No signup. See exactly where your team's AI execution compounds — and where it resets every week.
              </p>

              {/* What you'll learn */}
              <div className="flex flex-col gap-3 max-w-sm mx-auto text-left">
                <div className="flex items-start gap-3">
                  <Eye className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Where knowledge disappears</span> between projects and people
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Whether your team compounds</span> or resets with every session
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Your #1 structural bottleneck</span> and what to fix first
                  </p>
                </div>
              </div>

              <Button
                variant="brand"
                size="lg"
                className="text-base"
                onClick={() => setPhase("questions")}
              >
                Start the Diagnostic <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-muted-foreground">
                Free · No account required · Results in 90 seconds
              </p>
            </div>
          )}

          {/* QUESTIONS */}
          {phase === "questions" && (
            <div className="w-full space-y-8">
              <DiagnosticQuestion
                key={QUESTIONS[currentQ].id}
                question={QUESTIONS[currentQ]}
                selectedScore={answers[QUESTIONS[currentQ].id]}
                onSelect={handleSelect}
              />
              <div className="max-w-2xl mx-auto flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={currentQ === 0}
                  onClick={() => setCurrentQ((q) => q - 1)}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                {currentQ < QUESTIONS.length - 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!currentAnswered}
                    onClick={() => setCurrentQ((q) => q + 1)}
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* CALCULATING */}
          {phase === "calculating" && (
            <div className="text-center space-y-6 animate-in fade-in duration-300">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-foreground">Analysing your responses…</p>
                <p className="text-sm text-muted-foreground">Mapping your team across 5 dimensions</p>
              </div>
            </div>
          )}

          {/* RESULTS */}
          {phase === "results" && result && (
            <DiagnosticResults result={result} answers={answers} />
          )}
        </div>
      </div>
    </MarketingLayout>
  );
}
