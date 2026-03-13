import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { DiagnosticQuestion } from "@/components/marketing/diagnostic/DiagnosticQuestion";
import { DiagnosticResults } from "@/components/marketing/diagnostic/DiagnosticResults";
import { QUESTIONS, calculateResults } from "@/lib/diagnostic-scoring";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import type { DiagnosticResult } from "@/lib/diagnostic-scoring";

type Phase = "intro" | "questions" | "calculating" | "results";

/** Generate a stable session ID per page load to deduplicate submissions */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function DiagnosticPage() {
  const [searchParams] = useSearchParams();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [diagnosticRecordId, setDiagnosticRecordId] = useState<string | null>(null);
  const answersRef = useRef<Record<string, number>>({});
  const finishingRef = useRef(false);
  const recordIdRef = useRef<string | null>(null);
  const sessionId = useMemo(() => generateSessionId(), []);

  // Handle ?result=<id> for re-engagement links from email
  useEffect(() => {
    const resultId = searchParams.get("result");
    if (!resultId) return;
    (async () => {
      try {
        const { data } = await (supabase as any)
          .from("diagnostic_results")
          .select("answers, scores, archetype, overall_score")
          .eq("id", resultId)
          .single();
        if (!data) return;
        const r = calculateResults(data.answers || {});
        setResult(r);
        setAnswers(data.answers || {});
        setDiagnosticRecordId(resultId);
        recordIdRef.current = resultId;
        setPhase("results");
      } catch {
        // Invalid ID, just show intro
      }
    })();
  }, [searchParams]);

  const finishDiagnostic = useCallback(async (finalAnswers: Record<string, number>) => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setPhase("calculating");

    try {
      // 1. Calculate results immediately (client-side, no network)
      const r = calculateResults(finalAnswers);

      // 2. Pre-emptive insert DURING calculating phase (before results render)
      //    Uses session_id unique constraint for dedup — safe to retry
      try {
        const payload = {
          session_id: sessionId,
          answers: finalAnswers,
          scores: Object.fromEntries(r.dimensions.map((d) => [d.dimension, d.score])),
          archetype: r.archetype.label,
          overall_score: r.overall,
        };

        const { data, error } = await (supabase as any)
          .from("diagnostic_results")
          .insert(payload)
          .select("id")
          .single();

        if (error) {
          console.error("Diagnostic insert failed:", error);
        } else if (data?.id) {
          setDiagnosticRecordId(data.id);
          recordIdRef.current = data.id;
        }
      } catch (err) {
        console.error("Diagnostic insert exception:", err);
      }

      // 3. Brief animation delay, then show results
      await new Promise((res) => setTimeout(res, 1800));
      setResult(r);
      setPhase("results");
    } catch {
      // If calculation fails, reset so user can retry
      finishingRef.current = false;
      setPhase("questions");
    }
  }, [sessionId]);

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
        } else if (isLastQuestion && !allNowAnswered) {
          const firstUnanswered = QUESTIONS.findIndex((q) => updatedAnswers[q.id] == null);
          if (firstUnanswered >= 0) {
            setTimeout(() => setCurrentQ(firstUnanswered), 400);
          }
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
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                Why does your team's AI work
                <br />
                <span className="brand-gradient-text">still need so much fixing?</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Hallucinations. Inconsistent quality. The same mistakes repeated across people. It's not the AI. It's that your team has no shared standard for using it.
              </p>

              <Button
                variant="brand"
                size="lg"
                className="text-base"
                onClick={() => setPhase("questions")}
              >
                Score Your Team <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-muted-foreground">
                90 seconds. No signup. Just the truth.
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
            <DiagnosticResults
              result={result}
              answers={answers}
              existingRecordId={recordIdRef.current}
              sessionId={sessionId}
            />
          )}
        </div>
      </div>
    </MarketingLayout>
  );
}
