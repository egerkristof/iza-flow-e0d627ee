import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { DiagnosticQuestion } from "@/components/marketing/diagnostic/DiagnosticQuestion";
import { DiagnosticResults } from "@/components/marketing/diagnostic/DiagnosticResults";
import { QUESTIONS, calculateResults } from "@/lib/diagnostic-scoring";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import type { DiagnosticResult } from "@/lib/diagnostic-scoring";

type Phase = "intro" | "questions" | "calculating" | "results";

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function DiagnosticPage() {
  const [searchParams] = useSearchParams();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [submissionCount, setSubmissionCount] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [diagnosticRecordId, setDiagnosticRecordId] = useState<string | null>(null);
  const [curtainLifting, setCurtainLifting] = useState(false);
  const answersRef = useRef<Record<string, number>>({});
  const finishingRef = useRef(false);
  const recordIdRef = useRef<string | null>(null);
  const sessionId = useMemo(() => generateSessionId(), []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await (supabase as any).rpc("get_diagnostic_submission_count");
        const count = typeof data === "number" ? data : Number(data);
        if (Number.isFinite(count) && count > 5) setSubmissionCount(count);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const resultId = searchParams.get("result");
    if (!resultId) return;
    (async () => {
      try {
        const { data } = await (supabase as any).rpc("get_diagnostic_result_public", {
          result_id: resultId,
        });
        const row = Array.isArray(data) ? data[0] : data;
        if (!row) return;
        const r = calculateResults(row.answers || {});
        setResult(r);
        setAnswers(row.answers || {});
        setDiagnosticRecordId(resultId);
        recordIdRef.current = resultId;
        setPhase("results");
      } catch {}
    })();
  }, [searchParams]);

  const handleLiftCurtain = useCallback(() => {
    setCurtainLifting(true);
    setTimeout(() => setPhase("questions"), 700);
  }, []);

  const finishDiagnostic = useCallback(async (finalAnswers: Record<string, number>) => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setPhase("calculating");

    try {
      const r = calculateResults(finalAnswers);

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

      await new Promise((res) => setTimeout(res, 2200));
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

  const progress = phase === "questions" ? ((currentQ + 1) / QUESTIONS.length) * 100 : 0;
  const safeQ = Math.min(currentQ, QUESTIONS.length - 1);
  const currentQuestion = QUESTIONS[safeQ];
  const currentAnswered = currentQuestion ? answers[currentQuestion.id] != null : false;
  const firstQuestion = QUESTIONS[0];

  const showCurtain = phase === "intro";
  const showQuestions = phase === "questions" || phase === "intro";

  return (
    <MarketingLayout>
      <div className="min-h-[85vh] flex flex-col relative overflow-hidden">
        {/* === Progress bar — refined floating bar === */}
        {phase === "questions" && (
          <div className="sticky top-16 z-40 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="bg-card/90 backdrop-blur-md border-b border-border/50 px-6 py-3">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                    Question {safeQ + 1} / {QUESTIONS.length}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground/60">
                    ~{Math.ceil((QUESTIONS.length - safeQ) * 8 / 60)} min left
                  </span>
                </div>
                {/* Custom progress bar with brand gradient + glow */}
                <div className="h-1.5 w-full rounded-full bg-border/50 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${progress}%`,
                      background: "var(--gradient-brand-btn)",
                      boxShadow: "0 0 12px 2px hsl(var(--primary) / 0.3)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === Question layer — visible behind curtain during intro === */}
        {showQuestions && (
          <div
            className="flex-1 flex items-center justify-center px-4 md:px-6 py-12 md:py-16 transition-all duration-500"
            style={{
              // Subtle scale-up when curtain lifts
              transform: phase === "intro" ? "scale(0.96)" : "scale(1)",
              opacity: phase === "intro" ? 0.4 : 1,
              filter: phase === "intro" ? "blur(2px)" : "none",
              transition: "transform 700ms ease-out, opacity 700ms ease-out, filter 700ms ease-out",
            }}
          >
            <div className="w-full space-y-6 md:space-y-8">
              <DiagnosticQuestion
                key={phase === "intro" ? firstQuestion.id : currentQuestion.id}
                question={phase === "intro" ? firstQuestion : currentQuestion}
                selectedScore={phase === "intro" ? undefined : answers[currentQuestion.id]}
                onSelect={handleSelect}
              />
              {phase === "questions" && (
                <div className="max-w-2xl mx-auto flex items-center justify-between animate-in fade-in duration-300">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1.5"
                    disabled={safeQ === 0}
                    onClick={() => setCurrentQ((q) => Math.max(q - 1, 0))}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </Button>
                  {safeQ < QUESTIONS.length - 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1.5"
                      disabled={!currentAnswered}
                      onClick={() => setCurrentQ((q) => Math.min(q + 1, QUESTIONS.length - 1))}
                    >
                      Next <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* === Frosted curtain — full viewport, slides up to reveal Q1 === */}
        {showCurtain && (
          <div
            className={`absolute inset-0 z-30 flex flex-col items-center justify-center transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${
              curtainLifting
                ? "opacity-0 -translate-y-[110%] pointer-events-none"
                : "opacity-100 translate-y-0"
            }`}
            style={{
              backdropFilter: "blur(20px) saturate(1.4)",
              WebkitBackdropFilter: "blur(20px) saturate(1.4)",
              background: "linear-gradient(180deg, hsl(var(--background) / 0.97) 0%, hsl(var(--background) / 0.92) 60%, hsl(var(--background) / 0.75) 100%)",
              transitionDuration: "800ms",
            }}
          >
            {/* Decorative glow orbs */}
            <div
              className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px] pointer-events-none opacity-30"
              style={{ background: "radial-gradient(ellipse, hsl(var(--primary) / 0.15), transparent 70%)" }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-[300px] h-[200px] rounded-full blur-[80px] pointer-events-none opacity-20"
              style={{ background: "radial-gradient(ellipse, hsl(var(--brand-green) / 0.12), transparent 70%)" }}
            />

            <div className="relative max-w-xl text-center space-y-6 md:space-y-8 px-6 animate-in fade-in duration-700">
              {/* Category label */}
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-primary/30" />
                <span className="text-[10px] md:text-[11px] font-bold tracking-[0.25em] uppercase text-primary/70">
                  Field Study · AI Execution
                </span>
                <div className="h-px w-8 bg-primary/30" />
              </div>

              {/* Headline */}
              <h1 className="text-3xl md:text-[3.2rem] font-black tracking-tight text-foreground leading-[1.08] md:leading-[1.06]">
                Why does your team's AI work{" "}
                <span className="brand-gradient-text">still need so much fixing?</span>
              </h1>

              {/* Symptoms → Reframe */}
              <div className="max-w-md mx-auto space-y-2">
                <p className="text-sm md:text-base font-semibold text-foreground/75 leading-relaxed">
                  Hallucinations. Inconsistent quality. The same mistakes on repeat.
                </p>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  It's not the AI. Your team has no shared standard for using it.
                </p>
              </div>

              {/* CTA */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="brand"
                  size="lg"
                  className="text-sm md:text-base px-8 md:px-10 h-12 md:h-13 w-full sm:w-auto shadow-[0_0_30px_-6px_hsl(200_90%_52%/0.4)] hover:shadow-[0_0_40px_-6px_hsl(200_90%_52%/0.6)]"
                  onClick={handleLiftCurtain}
                >
                  Score Your AI Execution <ArrowRight className="w-4 h-4" />
                </Button>
                <p className="text-[10px] md:text-[11px] text-muted-foreground/60 tracking-wide">
                  No signup · 90 seconds · Immediate results
                  {submissionCount != null && (
                    <>
                      {" · "}
                      <span className="font-semibold text-muted-foreground">{submissionCount}+ teams</span> assessed
                    </>
                  )}
                </p>
              </div>

              {/* Peek hint — subtle indicator that content is behind */}
              <div className="pt-4 flex flex-col items-center gap-1 animate-bounce" style={{ animationDuration: "2.5s" }}>
                <div className="w-5 h-5 rounded-full border border-primary/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === Calculating phase === */}
        {phase === "calculating" && (
          <div className="flex-1 flex items-center justify-center px-6 py-16">
            <div className="text-center space-y-8 animate-in fade-in duration-500 max-w-md">
              {/* Concentric ring spinner */}
              <div className="relative mx-auto w-24 h-24">
                <div
                  className="absolute inset-0 rounded-full border-2 animate-spin"
                  style={{
                    borderColor: "hsl(var(--primary) / 0.1)",
                    borderTopColor: "hsl(var(--primary) / 0.6)",
                    animationDuration: "1.2s",
                  }}
                />
                <div
                  className="absolute inset-2 rounded-full border-2 animate-spin"
                  style={{
                    borderColor: "hsl(var(--brand-green) / 0.1)",
                    borderTopColor: "hsl(var(--brand-green) / 0.5)",
                    animationDuration: "1.8s",
                    animationDirection: "reverse",
                  }}
                />
                <div
                  className="absolute inset-4 rounded-full border-2 animate-spin"
                  style={{
                    borderColor: "hsl(var(--primary) / 0.1)",
                    borderTopColor: "hsl(var(--primary) / 0.4)",
                    animationDuration: "2.4s",
                  }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-3 h-3 rounded-full bg-primary/60 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-base md:text-lg font-bold text-foreground tracking-tight">
                  Analysing your responses…
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Scoring across 5 dimensions of AI execution maturity
                </p>
              </div>

              {/* Dimension pills — staggered reveal */}
              <div className="flex flex-wrap justify-center gap-2">
                {["Standards Adoption", "Delivery Consistency", "Knowledge Sharing", "Team Visibility", "Improvement Speed"].map((dim, i) => (
                  <span
                    key={dim}
                    className="px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide animate-in fade-in slide-in-from-bottom-2"
                    style={{
                      border: "1px solid hsl(var(--primary) / 0.15)",
                      background: "hsl(var(--primary) / 0.05)",
                      color: "hsl(var(--primary) / 0.7)",
                      animationDelay: `${i * 300}ms`,
                      animationFillMode: "backwards",
                      animationDuration: "500ms",
                    }}
                  >
                    {dim}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === Results === */}
        {phase === "results" && result && (
          <div className="flex-1 flex items-center justify-center px-4 md:px-6 py-12 md:py-16">
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
