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

type Phase = "curtain" | "questions" | "calculating" | "results";

/** Generate a stable session ID per page load to deduplicate submissions */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function DiagnosticPage() {
  const [searchParams] = useSearchParams();
  const [phase, setPhase] = useState<Phase>("curtain");
  const [currentQ, setCurrentQ] = useState(0);
  const [submissionCount, setSubmissionCount] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [diagnosticRecordId, setDiagnosticRecordId] = useState<string | null>(null);
  const answersRef = useRef<Record<string, number>>({});
  const finishingRef = useRef(false);
  const recordIdRef = useRef<string | null>(null);
  const sessionId = useMemo(() => generateSessionId(), []);

  // Fetch submission count for social proof
  useEffect(() => {
    (async () => {
      try {
        const { count } = await (supabase as any)
          .from("diagnostic_results")
          .select("id", { count: "exact", head: true });
        if (count != null && count > 5) setSubmissionCount(count);
      } catch {}
    })();
  }, []);

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

  const progress = (phase === "questions" || phase === "curtain") ? ((currentQ + 1) / QUESTIONS.length) * 100 : 0;
  const safeQ = Math.min(currentQ, QUESTIONS.length - 1);
  const currentQuestion = QUESTIONS[safeQ];
  const currentAnswered = currentQuestion ? answers[currentQuestion.id] != null : false;
  const [curtainLifting, setCurtainLifting] = useState(false);

  const handleStartDiagnostic = useCallback(() => {
    setCurtainLifting(true);
    setTimeout(() => setPhase("questions"), 700);
  }, []);

  return (
    <MarketingLayout>
      <div className="min-h-[80vh] flex flex-col relative">
        {/* Questions layer — always rendered behind curtain so it's visible through translucency */}
        {(phase === "curtain" || phase === "questions") && (
          <>
            {phase === "questions" && (
              <div className="sticky top-16 z-40 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-3 shadow-sm animate-in fade-in duration-500">
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
              {currentQuestion && (
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
            </div>
          </>
        )}

        {/* Curtain overlay — translucent, slides up to reveal Q1 */}
        {(phase === "curtain" || curtainLifting) && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              transform: curtainLifting ? "translateY(-100%)" : "translateY(0)",
              background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.97) 40%, hsl(var(--background) / 0.92) 100%)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="max-w-2xl text-center space-y-6 px-6 animate-in fade-in duration-500">
              <h1 className="text-2xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                Why does your team's AI work{" "}
                <span className="brand-gradient-text">still need so much fixing?</span>
              </h1>

              <div className="max-w-lg mx-auto space-y-1">
                <p className="text-sm md:text-lg font-semibold text-foreground/80">
                  Hallucinations. Inconsistent quality. The same mistakes on repeat.
                </p>
                <p className="text-sm md:text-base text-muted-foreground">
                  It's not the AI. Your team has no shared standard for using it.
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  variant="brand"
                  size="lg"
                  className="text-sm md:text-base w-full sm:w-auto"
                  onClick={handleStartDiagnostic}
                >
                  Start Diagnostic <ArrowRight className="w-4 h-4" />
                </Button>
                <p className="text-[11px] md:text-xs text-muted-foreground">
                  No signup · 90 seconds · Immediate results
                  {submissionCount != null && (
                    <>
                      {" · "}
                      <span className="font-semibold text-foreground">{submissionCount}+ teams</span> assessed
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Calculating phase */}
        {phase === "calculating" && (
          <div className="flex-1 flex items-center justify-center px-6 py-16">
            <div className="text-center space-y-6 animate-in fade-in duration-300">
              <div className="relative mx-auto w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-foreground">Analysing your responses…</p>
                <p className="text-sm text-muted-foreground">Scoring your team across 5 dimensions</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {["Standards Adoption", "Delivery Consistency", "Knowledge Sharing", "Team Visibility", "Improvement Speed"].map((dim, i) => (
                  <span
                    key={dim}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border animate-pulse"
                    style={{
                      borderColor: "hsl(var(--primary) / 0.2)",
                      background: "hsl(var(--primary) / 0.06)",
                      color: "hsl(var(--primary))",
                      animationDelay: `${i * 200}ms`,
                    }}
                  >
                    {dim}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results phase */}
        {phase === "results" && result && (
          <div className="flex-1 flex items-center justify-center px-6 py-16">
            <DiagnosticResults
              result={result}
              answers={answers}
              existingRecordId={recordIdRef.current}
              sessionId={sessionId}
            />
          </div>
        )}
      </div>
    </MarketingLayout>
  );
}
