import { cn } from "@/lib/utils";
import { DIMENSION_SHORT } from "@/lib/diagnostic-scoring";
import type { DiagnosticQuestion as QType } from "@/lib/diagnostic-scoring";
import { BookOpen, Eye, Layers, Users, Zap, ChevronDown } from "lucide-react";
import type { Dimension } from "@/lib/diagnostic-scoring";

const DIMENSION_ICONS: Record<Dimension, React.ReactNode> = {
  standard_internalization: <BookOpen className="w-4 h-4" />,
  output_consistency: <Layers className="w-4 h-4" />,
  knowledge_compounding: <Zap className="w-4 h-4" />,
  collective_visibility: <Eye className="w-4 h-4" />,
  learning_velocity: <Users className="w-4 h-4" />,
};

const SCORE_LABELS = ["A", "B", "C", "D"];

interface Props {
  question: QType;
  selectedScore: number | undefined;
  onSelect: (questionId: string, score: number) => void;
}

export function DiagnosticQuestion({ question, selectedScore, onSelect }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-300 space-y-0">
      {/* === ZONE 1: Scene-setting context card === */}
      <div className="rounded-t-2xl border border-border bg-card px-5 py-5 md:px-7 md:py-6">
        {/* Dimension pill */}
        <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase text-primary mb-4 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/20">
          {DIMENSION_ICONS[question.dimension]}
          {DIMENSION_SHORT[question.dimension]}
        </div>

        <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
          {question.context}
        </p>
      </div>

      {/* === Visual connector: chevron arrow === */}
      <div className="flex justify-center -my-1.5 relative z-10">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
          <ChevronDown className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>

      {/* === ZONE 2: Question + answers card === */}
      <div className="rounded-b-2xl border border-primary/20 bg-background px-5 py-5 md:px-7 md:py-6 shadow-[0_4px_24px_-4px_hsl(var(--primary)/0.08)]">
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-6 leading-snug tracking-tight">
          {question.question}
        </h2>

        <div className="flex flex-col gap-2.5">
          {question.options.map((opt, idx) => {
            const isSelected = selectedScore === opt.score;
            return (
              <button
                key={opt.score}
                onClick={() => onSelect(question.id, opt.score)}
                className={cn(
                  "w-full text-left flex items-start gap-3.5 px-4 py-3 rounded-xl border-2 transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/8 shadow-[0_0_20px_-6px_hsl(var(--primary)/0.25)]"
                    : "border-border bg-card hover:border-primary/40 hover:bg-primary/4"
                )}
              >
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
    </div>
  );
}
