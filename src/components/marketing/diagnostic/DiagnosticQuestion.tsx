import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { DiagnosticQuestion as QType } from "@/lib/diagnostic-scoring";
import { INDUSTRY_CONTEXTS, type IndustryKey } from "@/lib/diagnostic-industries";

const SCORE_LABELS = ["A", "B", "C", "D"];

/** Deterministic shuffle seeded by question id — stable across re-renders */
function shuffleOptions(options: QType["options"], seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  const arr = [...options];
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) | 0;
    const j = ((h >>> 0) % (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Props {
  question: QType;
  selectedScore: number | undefined;
  onSelect: (questionId: string, score: number) => void;
  industryKey?: IndustryKey | null;
}

export function DiagnosticQuestion({ question, selectedScore, onSelect, industryKey }: Props) {
  const shuffledOptions = useMemo(
    () => shuffleOptions(question.options, question.id),
    [question.id, question.options]
  );

  // Use industry-specific context if available, otherwise fall back to generic
  const contextText = useMemo(() => {
    if (industryKey && industryKey !== "other") {
      const industryContexts = INDUSTRY_CONTEXTS[industryKey];
      if (industryContexts?.[question.id]) {
        return industryContexts[question.id];
      }
    }
    return question.context;
  }, [industryKey, question.id, question.context]);

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-right-3 duration-400">
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          borderColor: "hsl(var(--border))",
          boxShadow: "0 8px 40px -12px hsl(var(--foreground) / 0.08), 0 2px 8px -2px hsl(var(--primary) / 0.06)",
        }}
      >
        {/* Scene-setting context — the "story" */}
        <div
          className="px-5 py-4 md:px-8 md:py-7 relative overflow-hidden"
          style={{
            background: "linear-gradient(145deg, hsl(var(--primary) / 0.06) 0%, hsl(var(--card)) 50%, hsl(var(--primary) / 0.03) 100%)",
          }}
        >
          {/* Subtle decorative orb */}
          <div
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none hidden md:block"
            style={{ background: "hsl(var(--primary) / 0.08)" }}
          />
          <p className="relative text-base md:text-[1.4rem] text-foreground font-bold leading-snug md:leading-[1.45] tracking-tight">
            {contextText}
          </p>
        </div>

        {/* Visual separator */}
        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.2) 30%, hsl(var(--primary) / 0.2) 70%, transparent)" }}
        />

        {/* Question + answer options */}
        <div className="bg-background px-5 py-4 md:px-8 md:py-6">
          <h2 className="text-sm md:text-base font-medium text-foreground/80 mb-4 md:mb-5 leading-snug tracking-tight">
            {question.question}
          </h2>

          <div className="flex flex-col gap-2 md:gap-2.5">
            {shuffledOptions.map((opt, idx) => {
              const isSelected = selectedScore === opt.score;
              return (
                <button
                  key={opt.score}
                  onClick={() => onSelect(question.id, opt.score)}
                  className={cn(
                    "group w-full text-left flex items-start gap-3 px-3 py-2.5 md:px-4 md:py-3.5 rounded-xl border transition-all duration-200 ease-out",
                    isSelected
                      ? "border-primary bg-primary/[0.06] shadow-[0_0_0_1px_hsl(var(--primary)/0.2),0_4px_16px_-6px_hsl(var(--primary)/0.2)]"
                      : "border-border/60 bg-card hover:border-primary/30 hover:bg-primary/[0.02] hover:shadow-[0_2px_8px_-4px_hsl(var(--foreground)/0.06)]"
                  )}
                >
                  <span
                    className={cn(
                      "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all duration-200",
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-[0_0_8px_-2px_hsl(var(--primary)/0.4)]"
                        : "bg-muted/70 text-muted-foreground group-hover:bg-muted"
                    )}
                  >
                    {SCORE_LABELS[idx]}
                  </span>
                  <span
                    className={cn(
                      "text-[13px] md:text-[15px] leading-snug md:leading-relaxed pt-0.5 transition-colors duration-200",
                      isSelected ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground/70"
                    )}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
