import { cn } from "@/lib/utils";
import { DIMENSION_SHORT } from "@/lib/diagnostic-scoring";
import type { DiagnosticQuestion as QType } from "@/lib/diagnostic-scoring";
import { BookOpen, Eye, Layers, Users, Zap, ChevronDown } from "lucide-react";
import type { Dimension } from "@/lib/diagnostic-scoring";

const DIMENSION_ICONS: Record<Dimension, React.ReactNode> = {
  standard_internalization: <BookOpen className="w-5 h-5" />,
  output_consistency: <Layers className="w-5 h-5" />,
  knowledge_compounding: <Zap className="w-5 h-5" />,
  collective_visibility: <Eye className="w-5 h-5" />,
  learning_velocity: <Users className="w-5 h-5" />,
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
      {/* === ZONE 1: Scene-setting context — hero treatment === */}
      <div
        className="rounded-t-2xl border border-border px-6 py-7 md:px-8 md:py-9 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, hsl(var(--card)) 60%, hsl(var(--primary) / 0.04) 100%)",
        }}
      >
        {/* Decorative glow orb */}
        <div
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none"
          style={{ background: "hsl(var(--primary) / 0.12)" }}
        />

        {/* Dimension pill */}
        <div
          className="relative inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.15em] uppercase mb-5 px-4 py-2 rounded-full border shadow-sm"
          style={{
            color: "hsl(var(--primary))",
            borderColor: "hsl(var(--primary) / 0.3)",
            background: "hsl(var(--primary) / 0.1)",
            boxShadow: "0 0 16px -4px hsl(var(--primary) / 0.2)",
          }}
        >
          {DIMENSION_ICONS[question.dimension]}
          {DIMENSION_SHORT[question.dimension]}
        </div>

        {/* Scene-setting text — large and prominent */}
        <p className="relative text-base md:text-lg text-foreground font-medium leading-relaxed tracking-tight">
          {question.context}
        </p>
      </div>

      {/* === Visual connector === */}
      <div className="flex justify-center -my-2 relative z-10">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: "var(--gradient-brand-btn)",
            boxShadow: "0 4px 20px -4px hsl(var(--primary) / 0.4)",
          }}
        >
          <ChevronDown className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>

      {/* === ZONE 2: Question + answers === */}
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
