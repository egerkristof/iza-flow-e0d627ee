import { ChevronRight, Check, X, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ConditionTile, TileStatus, CopilotSignal } from "./frame-data";
import { emptyObservationLine } from "./frame-data";

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
  signals: CopilotSignal[];
  hasUnread: boolean;
  expanded: boolean;
  onToggle: () => void;
  onDefine: () => void;
  onSaveSignal: (signalId: string) => void;
  onDismissSignal: (signalId: string) => void;
  savedSignalIds: string[];
  dismissedSignalIds: string[];
}

export function FrameTile({
  tile,
  signals,
  hasUnread,
  expanded,
  onToggle,
  onDefine,
  onSaveSignal,
  onDismissSignal,
  savedSignalIds,
  dismissedSignalIds,
}: Props) {
  const Icon = tile.icon;
  const visibleSignals = signals.filter((s) => !dismissedSignalIds.includes(s.id));
  const latest = visibleSignals[visibleSignals.length - 1];
  const subtitle = latest ? latest.text : tile.state;
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
        <div className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {hasUnread && !expanded && (
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-card animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", STATUS_DOT[tile.status])} />
            <span className="text-sm font-semibold truncate">{tile.label}</span>
            <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
              {tile.persona}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{subtitle}</p>
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
              Copilot feed
            </span>
            <span className="text-xs font-medium">{STATUS_LABEL[tile.status]}</span>
          </div>
          {visibleSignals.length === 0 ? (
            <p className="text-xs italic text-muted-foreground">
              {emptyObservationLine(tile.id)}
            </p>
          ) : (
            <ul className="space-y-2">
              {visibleSignals.map((s) => {
                const saved = savedSignalIds.includes(s.id);
                return (
                  <li key={s.id} className="text-xs leading-relaxed">
                    <div className="flex gap-2">
                      <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground pt-0.5">
                        {s.ts}
                      </span>
                      <span
                        className={cn(
                          "flex-1",
                          s.tone === "offer"
                            ? "text-foreground font-medium"
                            : s.tone === "warn"
                              ? "text-destructive"
                              : "text-foreground/70",
                        )}
                      >
                        {s.text}
                      </span>
                    </div>
                    {s.tone === "offer" && !saved && (
                      <div className="mt-1.5 ml-6 flex flex-wrap gap-1">
                        <Button
                          size="sm"
                          variant="default"
                          className="h-6 px-2 text-[11px]"
                          onClick={() => onSaveSignal(s.id)}
                        >
                          <Check className="h-3 w-3 mr-1" /> Save as standard
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-[11px]"
                          asChild
                        >
                          <Link to={tile.conditionsPath}>
                            <Pencil className="h-3 w-3 mr-1" /> Edit first
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-[11px] text-muted-foreground"
                          onClick={() => onDismissSignal(s.id)}
                        >
                          <X className="h-3 w-3 mr-1" /> Dismiss
                        </Button>
                      </div>
                    )}
                    {s.tone === "offer" && saved && (
                      <p className="mt-1 ml-6 text-[11px] text-emerald-600 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Saved to {tile.label}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
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