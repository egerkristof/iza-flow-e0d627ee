import { useState, useCallback } from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { DiagnosticQuestion } from "@/components/marketing/diagnostic/DiagnosticQuestion";
import { DiagnosticResults } from "@/components/marketing/diagnostic/DiagnosticResults";
import { QUESTIONS, calculateResults } from "@/lib/diagnostic-scoring";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ArrowLeft, Zap } from "lucide-react";
import type { DiagnosticResult } from "@/lib/diagnostic-scoring";

type Phase = "intro" | "questions" | "results";

export default function DiagnosticPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  const handleSelect = useCallback(
    (questionId: string, score: number) => {
      setAnswers((prev) => ({ ...prev, [questionId]: score }));
      // Auto-advance after brief delay
      setTimeout(() => {
        if (currentQ < QUESTIONS.length - 1) {
          setCurrentQ((q) => q + 1);
        }
      }, 300);
    },
    [currentQ]
  );

  const handleFinish = useCallback(async () => {
    const r = calculateResults(answers);
    setResult(r);
    setPhase("results");
    // Store anonymous result
    try {
      await supabase.from("diagnostic_results").insert({
        answers,
        scores: Object.fromEntries(r.dimensions.map((d) => [d.dimension, d.score])),
        archetype: r.archetype.label,
        overall_score: r.overall,
      });
    } catch {
      // fail silently
    }
  }, [answers]);

  const progress = phase === "questions" ? ((currentQ + 1) / QUESTIONS.length) * 100 : 0;
  const allAnswered = QUESTIONS.every((q) => answers[q.id] != null);
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
                {" "}or just{" "}
                <span className="text-muted-foreground">AI soloists</span>?
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
                10 questions. No signup. Get your AI Execution Score and see exactly where your team's AI usage breaks down.
              </p>
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
                {currentQ < QUESTIONS.length - 1 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!currentAnswered}
                    onClick={() => setCurrentQ((q) => q + 1)}
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    variant="brand"
                    size="sm"
                    disabled={!allAnswered}
                    onClick={handleFinish}
                  >
                    See My Results <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
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
