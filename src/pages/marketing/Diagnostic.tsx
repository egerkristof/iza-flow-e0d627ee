import { useState, useCallback, useRef } from "react";
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
  const answersRef = useRef<Record<string, number>>({});
  const finishingRef = useRef(false);

  const finishDiagnostic = useCallback(async (finalAnswers: Record<string, number>) => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setPhase("calculating");
    try {
      await new Promise((res) => setTimeout(res, 2200));
      const r = calculateResults(finalAnswers);
      setResult(r);
      setPhase("results");
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
    } catch {
      // If calculation fails, reset so user can retry
      finishingRef.current = false;
      setPhase("questions");
    }
  }, []);

  const handleSelect = useCallback(
    (questionId: string, score: number) => {
      if (finishingRef.current) return;

      const updatedAnswers = { ...answersRef.current, [questionId]: score };
      answersRef.current = updatedAnswers;
      setAnswers(updatedAnswers);

      setCurrentQ((prevQ) => {
        const isLastQuestion = prevQ === QUESTIONS.length - 1;
        const allNowAnswered = QUESTIONS.every((q) => updatedAnswers[q.id] != null);

        if (isLastQuestion && allNowAnswered) {
          setTimeout(() => finishDiagnostic(updatedAnswers), 500);
          return prevQ;
        } else if (!isLastQuestion) {
          setTimeout(() => {
            setCurrentQ((q) => Math.min(q + 1, QUESTIONS.length - 1));
          }, 400);
        }
        return prevQ;
      });
    },
    [finishDiagnostic]
  );

  const progress = phase === "questions" ? ((currentQ + 1) / QUESTIONS.length) * 100 : 0;
  const safeQ = Math.min(currentQ, QUESTIONS.length - 1);
  const currentQuestion = QUESTIONS[safeQ];
  const currentAnswered = currentQuestion ? answers[currentQuestion.id] != null : false;

  return (
    <MarketingLayout>
      <div className="min-h-[80vh] flex flex-col">
        {phase === "questions" && (
          <div className="sticky top-16 z-40 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 shadow-sm">
            <div className="max-w-2xl mx-auto space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wide text-foreground">
                  Question {safeQ + 1} of {QUESTIONS.length}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  ~{Math.ceil((QUESTIONS.length - safeQ) * 8 / 60)} min left
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center px-6 py-16">
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
                AI Execution Score
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                Your team has AI tools.
                <br />
                <span className="brand-gradient-text">Do they have a shared way of using them?</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
                You've made the investment. Now the management question: is every team member using AI with the same standards, the same judgment, the same quality bar—or is each session a solo experiment?
              </p>

              <div className="flex flex-col gap-3 max-w-sm mx-auto text-left">
                <div className="flex items-start gap-3">
                  <Eye className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Is your AI investment compounding</span> or resetting every Monday?
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Can your team deliver your best work</span> with AI, without you in the room?
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground font-medium">Where exactly is the gap</span> between what your firm knows and what AI sessions use?
                  </p>
                </div>
              </div>

              <Button
                variant="brand"
                size="lg"
                className="text-base"
                onClick={() => setPhase("questions")}
              >
                Get Your Score <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-muted-foreground">
                90 seconds · No signup · Score across 5 management dimensions
              </p>
            </div>
          )}

          {phase === "questions" && currentQuestion && (
            <div className="w-full space-y-8">
              <DiagnosticQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                selectedScore={answers[currentQuestion.id]}
                onSelect={handleSelect}
              />
              <div className="max-w-2xl mx-auto flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={safeQ === 0}
                  onClick={() => setCurrentQ((q) => Math.max(q - 1, 0))}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                {safeQ < QUESTIONS.length - 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!currentAnswered}
                    onClick={() => setCurrentQ((q) => Math.min(q + 1, QUESTIONS.length - 1))}
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

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

          {phase === "results" && result && (
            <DiagnosticResults result={result} answers={answers} />
          )}
        </div>
      </div>
    </MarketingLayout>
  );
}
