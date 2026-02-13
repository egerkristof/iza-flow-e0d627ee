import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CATEGORY_COLORS, CATEGORY_DESCRIPTIONS, CATEGORY_LABELS, type ContextCategory } from "@/lib/knowledge-schema";
import { cn } from "@/lib/utils";
import {
  HelpCircle, Gavel, BookOpen, ListChecks, Map, SlidersHorizontal,
  FlaskConical, Compass,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  DIRECTIVE: Gavel,
  KNOWLEDGE: BookOpen,
  PROCEDURE: ListChecks,
  PLAYBOOK: Map,
  PREFERENCE: SlidersHorizontal,
  RESEARCH: FlaskConical,
  PRINCIPLE: Compass,
};

const CATEGORY_EXAMPLES: Record<string, string> = {
  DIRECTIVE: 'e.g. "Never discount below 15%"',
  KNOWLEDGE: 'e.g. competitor intel, domain facts',
  PROCEDURE: 'e.g. onboarding checklist, review steps',
  PLAYBOOK: 'e.g. sales methodology, deal strategy',
  PREFERENCE: 'e.g. tone of voice, output format',
  RESEARCH: 'e.g. market analysis, benchmarks',
  PRINCIPLE: 'e.g. "Customer-first in every decision"',
};

interface CategoryFilterBadgeProps {
  category: string;
  isActive: boolean;
  onClick: () => void;
}

export function CategoryFilterBadge({ category, isActive, onClick }: CategoryFilterBadgeProps) {
  const Icon = CATEGORY_ICONS[category] ?? HelpCircle;
  const label = CATEGORY_LABELS[category as ContextCategory] ?? category;
  const description = CATEGORY_DESCRIPTIONS[category as ContextCategory];
  const color = CATEGORY_COLORS[category as ContextCategory] || "";
  const example = CATEGORY_EXAMPLES[category] ?? "";

  const badge = (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors cursor-pointer gap-1 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isActive
          ? "border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
          : cn("text-foreground hover:bg-primary/10", color),
      )}
    >
      <Icon className="h-2.5 w-2.5 shrink-0" />
      {label}
    </button>
  );

  if (!description) return badge;

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[260px] text-xs p-3 space-y-1.5 z-[100]">
          <div className="flex items-center gap-1.5">
            <Icon className={cn("h-3.5 w-3.5 shrink-0", color.split(" ").find(c => c.startsWith("text-")))} />
            <span className="font-semibold">{label}</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
          {example && (
            <p className="text-[10px] text-muted-foreground/70 italic">{example}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
