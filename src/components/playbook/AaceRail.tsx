import { Check, Lock, Loader2, Coins } from "lucide-react";
import {
  PILLARS,
  pillarStatus,
  estimateTokens,
  builderProgress,
  type Answers,
} from "./aace-builder";

export function AaceRail({ answers }: { answers: Answers }) {
  const status = pillarStatus(answers);
  const tokens = estimateTokens(answers);
  const pct = builderProgress(answers);

  return (
    <aside className="w-[340px] shrink-0 overflow-auto bg-muted/20 border-l">
      {/* Top: token counter + progress */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Coins className="h-3.5 w-3.5" />
            <span>AACE prompt size</span>
          </div>
          <span className="text-sm font-semibold tabular-nums">{tokens.toLocaleString()} tok</span>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
            <span>Playbook compiled</span>
            <span className="font-semibold text-foreground">{pct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div className="p-3 space-y-2">
        <div className="px-1 pb-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            AACE Playbook
          </span>
        </div>
        {PILLARS.map((p) => {
          const s = status[p.id];
          const Icon = p.icon;
          const isLiza = s === "liza";
          const isDone = s === "defined";
          return (
            <div
              key={p.id}
              className={`rounded-lg border p-3 transition-colors ${
                isDone
                  ? "border-primary/30 bg-primary/5"
                  : isLiza
                    ? "border-dashed bg-background/50"
                    : "bg-background"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                    isDone
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold leading-tight">{p.label}</span>
                    {isDone && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                    {isLiza && <Lock className="h-3 w-3 text-muted-foreground shrink-0" />}
                    {s === "pending" && (
                      <Loader2 className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                    )}
                  </div>
                  <p
                    className={`mt-0.5 text-[10px] uppercase tracking-wider ${
                      isLiza ? "text-amber-600 dark:text-amber-400 font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {p.aaceTag}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                    {isDone
                      ? "Defined."
                      : isLiza
                        ? "Not in this builder. Set inside LIZA."
                        : "Waiting on your answer."}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}