import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ConditionTile, TileStatus } from "./frame-data";

const STATUS_DOT: Record<TileStatus, string> = {
  empty: "bg-destructive",
  partial: "bg-amber-500",
  ready: "bg-emerald-500",
};

const STATUS_LABEL: Record<TileStatus, string> = {
  empty: "Undefined",
  partial: "Partial",
  ready: "Defined",
};

interface Props {
  tile: ConditionTile;
  expanded: boolean;
  onToggle: () => void;
  onDefine: () => void;
}

export function FrameTile({ tile, expanded, onToggle, onDefine }: Props) {
  const Icon = tile.icon;
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground transition-all",
        expanded ? "border-primary/40 shadow-[0_0_20px_-8px_hsl(var(--primary)/0.4)]" : "hover:border-border",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-3 text-left"
      >
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", STATUS_DOT[tile.status])} />
            <span className="text-sm font-semibold truncate">{tile.label}</span>
            <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
              {tile.persona}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{tile.state}</p>
        </div>
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform mt-2",
            expanded && "rotate-90",
          )}
        />
      </button>

      {expanded && (
        <div className="border-t bg-muted/30 p-3 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Status
            </span>
            <span className="text-xs font-medium">{STATUS_LABEL[tile.status]}</span>
          </div>
          <p className="text-xs leading-relaxed text-foreground/80">{tile.detail}</p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" variant="default" className="h-7 text-xs" onClick={onDefine}>
              {tile.cta}
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
              <Link to={tile.conditionsPath}>Open in Conditions</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}