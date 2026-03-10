import { cn } from "@/lib/utils";
import { DIMENSION_SHORT } from "@/lib/diagnostic-scoring";
import type { DiagnosticQuestion as QType } from "@/lib/diagnostic-scoring";

interface Props {
  question: QType;
  selectedScore: number | undefined;
  onSelect: (questionId: string, score: number) => void;
}

export function DiagnosticQuestion({ question, selectedScore, onSelect }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Dimension tag */}
      <span className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase text-primary/70 mb-4">
        {DIMENSION_SHORT[question.dimension]}
      </span>

      {/* Scene-setting context */}
      <p className="text-sm text-muted-foreground italic mb-3 leading-relaxed">
        {question.context}
      </p>

      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-8 leading-snug">
        {question.question}
      </h2>

      <div className="flex flex-col gap-3">
        {question.options.map((opt) => {
          const isSelected = selectedScore === opt.score;
          return (
            <button
              key={opt.score}
              onClick={() => onSelect(question.id, opt.score)}
              className={cn(
                "w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 text-sm md:text-base",
                isSelected
                  ? "border-primary bg-primary/8 text-foreground shadow-[0_0_16px_-4px_hsl(var(--primary)/0.3)]"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-primary/4"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
