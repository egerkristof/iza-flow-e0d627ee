import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

interface Props {
  score: number;
  onSanction: () => void;
}

export function FrameScore({ score, onSanction }: Props) {
  const tone =
    score >= 90 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-destructive";
  const bar =
    score >= 90 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-destructive";
  const sanctioned = score >= 100;

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Frame Score
        </span>
        <span className={cn("text-lg font-bold tabular-nums", tone)}>{score}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full transition-all duration-500", bar)}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground leading-snug">
        {sanctioned
          ? "All conditions defined. This chat can be sanctioned as a reusable workflow."
          : score >= 50
            ? "Some conditions are partial. Resolve the remaining tiles to sanction this chat."
            : "This chat is operating without sufficient conditions. Define them to graduate it from a POC."}
      </p>
      <Button
        size="sm"
        variant={sanctioned ? "default" : "outline"}
        disabled={!sanctioned}
        onClick={onSanction}
        className="mt-3 w-full h-8 text-xs"
      >
        <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
        {sanctioned ? "Sanction as workflow" : "Sanction locked"}
      </Button>
    </div>
  );
}