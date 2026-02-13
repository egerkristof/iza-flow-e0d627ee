import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type ExtractionDepth, EXTRACTION_DEPTH_META } from "@/lib/knowledge-schema";

interface ExtractionDepthSelectorProps {
  value: ExtractionDepth;
  onChange: (depth: ExtractionDepth) => void;
  disabled?: boolean;
  compact?: boolean;
}

const DEPTHS: ExtractionDepth[] = ["quick", "guided", "deep"];

export function ExtractionDepthSelector({ value, onChange, disabled, compact }: ExtractionDepthSelectorProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn("flex items-center gap-1", compact ? "gap-0.5" : "gap-1")}>
        {DEPTHS.map(depth => {
          const meta = EXTRACTION_DEPTH_META[depth];
          const isActive = value === depth;
          return (
            <Tooltip key={depth}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(depth)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-all cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
                    disabled && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <span>{meta.icon}</span>
                  {!compact && <span>{meta.label}</span>}
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs max-w-[200px]">
                <p className="font-semibold">{meta.icon} {meta.label}</p>
                <p className="text-muted-foreground mt-0.5">{meta.description}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
