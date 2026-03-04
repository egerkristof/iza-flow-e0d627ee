import { useState } from "react";
import { SectionTag, GradientText } from "./shared";
import { Layers, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

const LEVELS = [
  {
    level: 1,
    title: "In their heads",
    short: "Quality depends on who's available",
    detail: "A senior's absence means visible quality drops. Everyone prompts their own way — same question, different answers. No shared standard exists.",
    symptom: "\"It's fine when Sarah runs it\"",
  },
  {
    level: 2,
    title: "Static playbooks",
    short: "The docs are 18 months old",
    detail: "The methodology doc was good once. Nobody follows it because it doesn't match today's reality. Each person builds their own prompts. Official process ≠ real process.",
    symptom: "\"We have a wiki somewhere…\"",
  },
  {
    level: 3,
    title: "Pockets of sharing",
    short: "Some transfer, inconsistently",
    detail: "Post-project reviews happen sometimes. A few people share prompts in Slack. No curation, no way to know what's current or proven.",
    symptom: "\"Check #random for that prompt\"",
  },
  {
    level: 4,
    title: "Live shared context",
    short: "One living knowledge base",
    detail: "AI sessions start pre-loaded with accumulated judgment. Everyone executes from the same standard. Onboarding takes weeks, not months.",
    symptom: "\"The system already knew\"",
  },
  {
    level: 5,
    title: "Governed intelligence",
    short: "The team compounds weekly",
    detail: "AI usage is visible and governed. The weakest performer benefits from the strongest insight. Methodology evolves with every engagement.",
    symptom: "\"We're better this quarter than last\"",
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

        {/* Staircase infographic */}
        <div className="relative mb-6">
          {/* Zone labels - large, prominent */}
          <div className="flex mb-4">
            <div className="flex-[3] flex items-center justify-center gap-2 rounded-lg py-2 mr-1"
              style={{ background: "hsl(var(--destructive) / 0.06)", border: "1px dashed hsl(var(--destructive) / 0.2)" }}>
              <AlertTriangle className="w-3.5 h-3.5" style={{ color: "hsl(var(--destructive))" }} />
              <span className="text-xs font-black tracking-[0.12em] uppercase" style={{ color: "hsl(var(--destructive))" }}>
                Most teams today
              </span>
            </div>
            <div className="flex-[2] flex items-center justify-center gap-2 rounded-lg py-2 ml-1"
              style={{ background: "hsl(var(--primary) / 0.06)", border: "1px dashed hsl(var(--primary) / 0.25)" }}>
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-black tracking-[0.12em] uppercase text-primary">
                LIZA zone
              </span>
            </div>
          </div>

          {/* Staircase steps */}
          <div className="flex items-end gap-2" style={{ height: "340px" }}>
            {LEVELS.map((l) => {
              const isTarget = l.level >= 4;
              const isActive = activeLevel === l.level;
              // Heights: 28%, 42%, 58%, 78%, 100%
              const heights = [28, 42, 58, 78, 100];
              const h = heights[l.level - 1];

              const bgColor = isTarget
                ? isActive ? "var(--gradient-brand-btn)" : "hsl(var(--primary) / 0.08)"
                : l.level === 3
                  ? isActive ? "hsl(var(--warning) / 0.18)" : "hsl(var(--warning) / 0.06)"
                  : isActive ? "hsl(var(--destructive) / 0.14)" : "hsl(var(--destructive) / 0.05)";

              const borderColor = isActive
                ? isTarget ? "hsl(var(--primary))" : l.level === 3 ? "hsl(var(--warning) / 0.5)" : "hsl(var(--destructive) / 0.4)"
                : isTarget ? "hsl(var(--primary) / 0.2)" : l.level === 3 ? "hsl(var(--warning) / 0.15)" : "hsl(var(--destructive) / 0.12)";

              const accentColor = isTarget
                ? "hsl(var(--primary))"
                : l.level === 3 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

              return (
                <button
                  key={l.level}
                  onClick={() => setActiveLevel(isActive ? null : l.level)}
                  className="flex-1 rounded-t-xl transition-all duration-300 cursor-pointer relative overflow-hidden group"
                  style={{
                    height: `${h}%`,
                    background: bgColor,
                    border: `2px solid ${borderColor}`,
                    borderBottom: "none",
                  }}
                >
                  {/* Content inside the bar */}
                  <div className="absolute inset-0 flex flex-col items-center justify-start pt-3 md:pt-4 px-1.5 md:px-3">
                    {/* Level badge */}
                    <div
                      className="text-base md:text-lg font-black mb-1"
                      style={{
                        color: isTarget && isActive ? "hsl(var(--primary-foreground))" : accentColor,
                      }}
                    >
                      L{l.level}
                    </div>

                    {/* Title */}
                    <div
                      className="text-[10px] md:text-xs font-bold leading-tight text-center mb-1.5"
                      style={{
                        color: isTarget && isActive ? "hsl(var(--primary-foreground) / 0.95)" : "hsl(var(--foreground) / 0.85)",
                      }}
                    >
                      {l.title}
                    </div>

                    {/* Short description - visible on larger steps */}
                    {l.level >= 2 && (
                      <div
                        className="text-[8px] md:text-[10px] leading-snug text-center hidden sm:block px-1"
                        style={{
                          color: isTarget && isActive ? "hsl(var(--primary-foreground) / 0.8)" : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {l.short}
                      </div>
                    )}

                    {/* Symptom quote - visible on taller steps */}
                    {l.level >= 3 && (
                      <div
                        className="mt-auto mb-3 text-[8px] md:text-[9px] italic text-center hidden md:block px-1"
                        style={{
                          color: isTarget && isActive ? "hsl(var(--primary-foreground) / 0.7)" : "hsl(var(--foreground) / 0.45)",
                        }}
                      >
                        {l.symptom}
                      </div>
                    )}
                  </div>

                  {/* Hover / active indicator */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-200"
                    style={{
                      background: accentColor,
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* Base line */}
          <div className="h-1 rounded-full" style={{ background: "hsl(var(--border))" }} />
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[10px] text-muted-foreground font-medium">← Fragmented</span>
            <span className="text-[10px] font-semibold text-primary">Compounding →</span>
          </div>
        </div>

        {/* Tap hint */}
        {activeLevel === null && (
          <p className="text-center text-xs text-muted-foreground mt-2 mb-4 flex items-center justify-center gap-1 animate-bounce">
            <ChevronDown className="w-3.5 h-3.5" /> Tap a level to learn more
          </p>
        )}

        {/* Expanded detail card */}
        {activeLevel !== null && (() => {
          const l = LEVELS[activeLevel - 1];
          const isTarget = l.level >= 4;
          const accentColor = isTarget
            ? "hsl(var(--primary))"
            : l.level === 3 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

          return (
            <div
              className="rounded-xl border-2 p-5 mt-4 mb-4 animate-fade-in"
              style={{
                borderColor: isTarget ? "hsl(var(--primary) / 0.3)" : l.level === 3 ? "hsl(var(--warning) / 0.3)" : "hsl(var(--destructive) / 0.3)",
                background: isTarget ? "hsl(var(--primary) / 0.04)" : "hsl(var(--background))",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
                    style={{
                      background: isTarget ? "var(--gradient-brand-btn)" : `hsl(var(--${l.level === 3 ? "warning" : l.level >= 4 ? "primary" : "destructive"}) / 0.12)`,
                      color: isTarget ? "hsl(var(--primary-foreground))" : accentColor,
                    }}
                  >
                    L{l.level}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base font-bold">{l.title}</span>
                      <span
                        className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                        style={{
                          background: isTarget ? "hsl(var(--primary) / 0.1)" : `hsl(var(--${l.level === 3 ? "warning" : "destructive"}) / 0.1)`,
                          color: accentColor,
                        }}
                      >
                        {isTarget ? "Target" : l.level === 3 ? "Transitional" : "At risk"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{l.short}</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">{l.detail}</p>
                    <p className="text-xs italic mt-2" style={{ color: "hsl(var(--foreground) / 0.5)" }}>
                      You'll hear: {l.symptom}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveLevel(null)}
                  className="p-1.5 rounded-lg hover:bg-accent transition-colors shrink-0"
                >
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          );
        })()}

        {/* Bottom summary cards */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div
            className="flex-1 rounded-xl border-2 px-6 py-5 text-center"
            style={{ borderColor: "hsl(var(--destructive) / 0.25)", background: "hsl(var(--destructive) / 0.04)" }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" style={{ color: "hsl(var(--destructive))" }} />
              <span className="text-xs font-black tracking-[0.15em] uppercase" style={{ color: "hsl(var(--destructive))" }}>
                Where you probably are
              </span>
            </div>
            <p className="text-sm text-foreground/80">
              Level 2–3. Your best people are fast. Your team is fragmented. Knowledge lives in personal AI accounts.
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
              Level 4–5. Live shared context. Governed methodology. Every engagement makes the whole team smarter.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
