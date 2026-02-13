import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CATEGORY_COLORS, CATEGORY_DESCRIPTIONS, type ContextCategory } from "@/lib/knowledge-schema";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";

interface CategoryBadgeProps {
  category: ContextCategory | string;
  /** Extra classes on the badge */
  className?: string;
  /** Hide the tooltip icon for compact layouts */
  compact?: boolean;
}

export function CategoryBadge({ category, className, compact }: CategoryBadgeProps) {
  const description = CATEGORY_DESCRIPTIONS[category as ContextCategory];
  const color = CATEGORY_COLORS[category as ContextCategory] || "";

  const badge = (
    <Badge variant="outline" className={cn("text-[10px] gap-0.5", color, className)}>
      {category}
      {!compact && description && <HelpCircle className="h-2.5 w-2.5 opacity-50" />}
    </Badge>
  );

  if (!description) return badge;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px] text-xs">
          <p className="font-medium mb-0.5">{category}</p>
          <p className="text-muted-foreground">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
