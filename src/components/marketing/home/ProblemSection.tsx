import { useState } from "react";
import { SectionTag, GradientText } from "./shared";
import { Layers, AlertTriangle, ChevronDown } from "lucide-react";

const LEVELS = [
  {
    level: 1,
    title: "In their heads",
    short: "Quality depends on who does the work",
    detail: "A senior's absence means visible quality drops. AI amplifies it — everyone prompts their own way, same question, different answers.",
    color: "destructive" as const,
  },
  {
    level: 2,
    title: "Static playbooks",
    short: "Someone wrote the docs — 18 months ago",
    detail: "The methodology doc was good once. Nobody follows it. Each person builds their own prompts. The 'official' process and the real process have diverged.",
    color: "destructive" as const,
  },
  {
    level: 3,
    title: "Pockets of sharing",
    short: "Some knowledge transfers, but inconsistently",
    detail: "Post-project reviews happen sometimes. A few people share prompts in Slack. No curation, no way to know what's current.",
    color: "warning" as const,
  },
  {
    level: 4,
    title: "Live shared context",
    short: "The team operates from a living knowledge base",
    detail: "AI sessions start pre-loaded with accumulated judgment. Everyone executes from the same standard. Onboarding takes weeks, not months.",
    color: "primary" as const,
  },
  {
    level: 5,
    title: "Governed intelligence",
    short: "Leadership shapes the standard. The team compounds.",
    detail: "AI usage is visible and governed. The weakest performer benefits from the strongest insight. Methodology evolves with every engagement.",
    color: "primary" as const,
  },
];

export function ProblemSection() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  return (
    <section id="the-problem" className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <SectionTag label="The diagnostic" icon={<Layers className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Where is your team on the{" "}
            <GradientText>knowledge maturity scale?</GradientText>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            AI didn't create the problem. It amplified wherever you already were.
          </p>
        </div>

        {/* Ascending staircase */}
        <div className="relative">
          {/* "You are here" marker */}
          <div className="hidden md:flex items-center gap-2 absolute top-2 left-[30%] -translate-x-1/2 z-10">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "hsl(var(--destructive))" }} />
            <span className="text-[10px] font-bold" style={{ color: "hsl(var(--destructive))" }}>
              ← Most teams
            </span>
          </div>

          {/* LIZA zone label */}
          <div className="hidden md:flex items-center gap-2 absolute top-2 right-4 z-10">
            <span className="text-[10px] font-bold text-primary">LIZA zone →</span>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "hsl(var(--primary))" }} />
          </div>

          {/* Staircase visual */}
          <div className="flex items-end gap-1.5 md:gap-2 mt-10 mb-4" style={{ minHeight: "220px" }}>
            {LEVELS.map((l) => {
              const isTarget = l.level >= 4;
              const isActive = activeLevel === l.level;
              const heightPercent = 20 + (l.level - 1) * 20; // 20%, 40%, 60%, 80%, 100%

              return (
                <button
                  key={l.level}
                  onClick={() => setActiveLevel(isActive ? null : l.level)}
                  className="flex-1 rounded-t-xl transition-all duration-300 cursor-pointer relative group"
                  style={{
                    height: `${heightPercent}%`,
                    background: isTarget
                      ? isActive
                        ? "var(--gradient-brand-btn)"
                        : "hsl(var(--primary) / 0.12)"
                      : l.color === "warning"
                        ? isActive ? "hsl(var(--warning) / 0.25)" : "hsl(var(--warning) / 0.1)"
                        : isActive ? "hsl(var(--destructive) / 0.2)" : "hsl(var(--destructive) / 0.08)",
                    border: `2px solid ${
                      isActive
                        ? isTarget
                          ? "hsl(var(--primary))"
                          : l.color === "warning"
                            ? "hsl(var(--warning) / 0.5)"
                            : "hsl(var(--destructive) / 0.5)"
                        : "transparent"
                    }`,
                    borderBottom: "none",
                  }}
                >
                  <div className="absolute inset-x-0 top-3 flex flex-col items-center px-1">
                    <div
                      className="text-sm md:text-base font-black mb-0.5"
                      style={{
                        color: isTarget && isActive
                          ? "hsl(var(--primary-foreground))"
                          : isTarget
                            ? "hsl(var(--primary))"
                            : l.color === "warning"
                              ? "hsl(var(--warning))"
                              : "hsl(var(--destructive))",
                      }}
                    >
                      L{l.level}
                    </div>
                    <div
                      className="text-[9px] md:text-[11px] font-semibold leading-tight text-center hidden sm:block"
                      style={{
                        color: isTarget && isActive
                          ? "hsl(var(--primary-foreground) / 0.9)"
                          : "hsl(var(--foreground) / 0.7)",
                      }}
                    >
                      {l.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Base line */}
          <div className="h-[3px] rounded-full" style={{ background: "hsl(var(--border))" }} />
          <div className="flex justify-between mt-1.5 px-1">
            <span className="text-[10px] text-muted-foreground">Fragmented</span>
            <span className="text-[10px] font-semibold text-primary">Compounding →</span>
          </div>
        </div>

        {/* Tap hint */}
        {activeLevel === null && (
          <p className="text-center text-xs text-muted-foreground mt-4 mb-6 flex items-center justify-center gap-1 animate-bounce">
            <ChevronDown className="w-3.5 h-3.5" /> Tap a level to explore
          </p>
        )}

        {/* Detail card */}
        {activeLevel !== null && (() => {
          const l = LEVELS[activeLevel - 1];
          const isTarget = l.level >= 4;
          return (
            <div
              className="rounded-xl border-2 p-5 mt-6 mb-6 animate-fade-in"
              style={{
                borderColor: isTarget
                  ? "hsl(var(--primary) / 0.3)"
                  : l.color === "warning"
                    ? "hsl(var(--warning) / 0.3)"
                    : "hsl(var(--destructive) / 0.3)",
                background: isTarget
                  ? "hsl(var(--primary) / 0.04)"
                  : "hsl(var(--background))",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                  style={{
                    background: isTarget ? "var(--gradient-brand-btn)" : `hsl(var(--${l.color}) / 0.12)`,
                    color: isTarget ? "hsl(var(--primary-foreground))" : `hsl(var(--${l.color}))`,
                  }}
                >
                  L{l.level}
                </div>
                <div>
                  <span className="text-sm font-bold">{l.title}</span>
                  <span className="text-xs text-muted-foreground ml-2">— {l.short}</span>
                  <p className="text-sm text-foreground/80 leading-relaxed mt-1.5">{l.detail}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Where most teams sit */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div
            className="flex-1 rounded-xl border-2 px-6 py-5 text-center"
            style={{ borderColor: "hsl(var(--destructive) / 0.25)", background: "hsl(var(--destructive) / 0.04)" }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />
              <span className="text-xs font-black tracking-[0.15em] uppercase" style={{ color: "hsl(var(--destructive))" }}>
                Most teams today
              </span>
            </div>
            <p className="text-sm text-foreground/80">
              Stuck at Level 2–3. Fast individuals, fragmented team. Knowledge scattered across personal AI accounts.
            </p>
          </div>
          <div
            className="flex-1 rounded-xl border-2 px-6 py-5 text-center"
            style={{ borderColor: "hsl(var(--primary) / 0.35)", background: "hsl(var(--primary) / 0.04)" }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-xs font-black tracking-[0.15em] uppercase text-primary">
                Where LIZA takes you
              </span>
            </div>
            <p className="text-sm text-foreground/80">
              Level 4–5. Live shared context, governed methodology, compounding team intelligence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
