import { cn } from "@/lib/utils";
import { DIMENSION_SHORT } from "@/lib/diagnostic-scoring";
import type { DiagnosticQuestion as QType } from "@/lib/diagnostic-scoring";
import { BookOpen, Eye, Layers, Users, Zap } from "lucide-react";
import type { Dimension } from "@/lib/diagnostic-scoring";

const DIMENSION_ICONS: Record<Dimension, React.ReactNode> = {
  standard_internalization: <BookOpen className="w-3.5 h-3.5" />,
  output_consistency: <Layers className="w-3.5 h-3.5" />,
  knowledge_compounding: <Zap className="w-3.5 h-3.5" />,
  collective_visibility: <Eye className="w-3.5 h-3.5" />,
  learning_velocity: <Users className="w-3.5 h-3.5" />,
};

const SCORE_LABELS = ["A", "B", "C", "D"];

interface Props {
  question: QType;
  selectedScore: number | undefined;
  onSelect: (questionId: string, score: number) => void;
}

export function DiagnosticQuestion({ question, selectedScore, onSelect }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Dimension tag with icon */}
      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.15em] uppercase text-primary/80 mb-5 px-2.5 py-1 rounded-full border border-primary/15 bg-primary/5">
        {DIMENSION_ICONS[question.dimension]}
        {DIMENSION_SHORT[question.dimension]}
      </div>

      {/* Scene-setting context — callout card */}
      <div className="rounded-xl bg-muted/60 border border-border/60 px-4 py-3.5 mb-6">
        <p className="text-[13px] md:text-sm text-muted-foreground leading-relaxed">
          {question.context}
        </p>
      </div>

      {/* Question — large & bold */}
      <h2 className="text-xl md:text-[1.65rem] font-bold text-foreground mb-8 leading-snug tracking-tight">
        {question.question}
      </h2>

      {/* Answer options with left-rail letter markers */}
      <div className="flex flex-col gap-3">
        {question.options.map((opt, idx) => {
          const isSelected = selectedScore === opt.score;
          return (
            <button
              key={opt.score}
              onClick={() => onSelect(question.id, opt.score)}
              className={cn(
                "w-full text-left flex items-start gap-3.5 px-4 py-3.5 rounded-xl border-2 transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/8 shadow-[0_0_20px_-6px_hsl(var(--primary)/0.25)]"
                  : "border-border bg-card hover:border-primary/40 hover:bg-primary/4"
              )}
            >
              {/* Letter marker */}
              <span
                className={cn(
                  "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors duration-200",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {SCORE_LABELS[idx]}
              </span>
              <span className={cn(
                "text-sm md:text-[15px] leading-relaxed pt-0.5",
                isSelected ? "text-foreground font-medium" : "text-muted-foreground"
              )}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
