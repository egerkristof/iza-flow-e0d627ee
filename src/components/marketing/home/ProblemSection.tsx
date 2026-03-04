import { useState } from "react";
import { SectionTag, GradientText } from "./shared";
import { Layers, ChevronDown, ChevronUp, ArrowDown } from "lucide-react";

const LEVELS = [
  {
    level: 1,
    title: "In their heads",
    short: "Knowledge lives in people's heads",
    ai: "Everyone prompts their own way — same question, different answers",
    detail: "A senior's absence means visible quality drops. There's no shared standard. AI just amplifies individual habits — good and bad.",
    symptom: "\"It's fine when Sarah runs it\"",
  },
  {
    level: 2,
    title: "Static playbooks",
    short: "Knowledge written down — 18 months ago",
    ai: "AI bypasses the docs entirely. Everyone builds their own prompts.",
    detail: "The methodology doc was good once. Nobody follows it. The official process and the real AI-assisted process have fully diverged.",
    symptom: "\"We have a wiki somewhere…\"",
    marker: "most",
  },
  {
    level: 3,
    title: "Pockets of sharing",
    short: "Some knowledge transfers, inconsistently",
    ai: "Prompt libraries grow in Slack — no curation, no governance",
    detail: "A few people share prompts. Post-project reviews happen sometimes. No way to know what's current, proven, or approved.",
    symptom: "\"Check #random for that prompt\"",
  },
  {
    level: 4,
    title: "Live shared context",
    short: "One living knowledge base for the team",
    ai: "AI enforces team standards in every session, automatically",
    detail: "Every AI session starts pre-loaded with your team's accumulated judgment. New hires execute at team standard from day one.",
    symptom: "\"The AI already knew our approach\"",
    marker: "liza",
  },
  {
    level: 5,
    title: "Governed intelligence",
    short: "The team compounds with every engagement",
    ai: "AI usage is visible, governed, and continuously improving",
    detail: "Every engagement feeds back into shared knowledge. The weakest performer benefits from the strongest insight. Methodology evolves automatically.",
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

        {/* Zone labels */}
        <div className="flex mb-3">
          <div className="flex-[3] flex items-center justify-center gap-2 rounded-lg py-2 mr-1"
            style={{ background: "hsl(var(--destructive) / 0.06)", border: "1px dashed hsl(var(--destructive) / 0.2)" }}>
            <span className="text-[10px] md:text-xs font-black tracking-[0.1em] uppercase" style={{ color: "hsl(var(--destructive))" }}>
              Fragmented
            </span>
          </div>
          <div className="flex-[2] flex items-center justify-center gap-2 rounded-lg py-2 ml-1"
            style={{ background: "hsl(var(--primary) / 0.06)", border: "1px dashed hsl(var(--primary) / 0.25)" }}>
            <span className="text-[10px] md:text-xs font-black tracking-[0.1em] uppercase text-primary">
              LIZA zone
            </span>
          </div>
        </div>

        {/* Staircase with markers */}
        <div className="relative">
          {/* Top-down arrow markers - prominent */}
          <div className="absolute z-20 flex flex-col items-center"
            style={{ left: "calc(20% + (20% - 4px) / 2)", transform: "translateX(-50%)", top: "-12px" }}>
            <div className="flex flex-col items-center">
              <span className="text-[10px] md:text-xs font-black whitespace-nowrap px-3 py-1 rounded-full"
                style={{ color: "hsl(var(--destructive))", background: "hsl(var(--destructive) / 0.1)", border: "1px solid hsl(var(--destructive) / 0.2)" }}>
                Most teams are here
              </span>
              <div className="w-0.5 h-6 md:h-10" style={{ background: "hsl(var(--destructive) / 0.4)" }} />
              <ArrowDown className="w-5 h-5 -mt-1" style={{ color: "hsl(var(--destructive))" }} />
            </div>
          </div>

          <div className="absolute z-20 flex flex-col items-center"
            style={{ left: "calc(60% + (20% - 4px) / 2)", transform: "translateX(-50%)", top: "-12px" }}>
            <div className="flex flex-col items-center">
              <span className="text-[10px] md:text-xs font-black whitespace-nowrap px-3 py-1 rounded-full"
                style={{ color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
                Day 1 with LIZA
              </span>
              <div className="w-0.5 h-6 md:h-10" style={{ background: "hsl(var(--primary) / 0.4)" }} />
              <ArrowDown className="w-5 h-5 -mt-1 text-primary" />
            </div>
          </div>

          {/* Staircase */}
          <div className="flex items-end gap-1.5 md:gap-2 pt-14 mb-1" style={{ height: "420px" }}>
            {LEVELS.map((l) => {
              const isTarget = l.level >= 4;
              const isActive = activeLevel === l.level;
              const heights = [24, 40, 58, 78, 100];
              const h = heights[l.level - 1];

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
                    background: isTarget
                      ? isActive ? "var(--gradient-brand-btn)" : "hsl(var(--primary) / 0.08)"
                      : l.level === 3
                        ? isActive ? "hsl(var(--warning) / 0.18)" : "hsl(var(--warning) / 0.06)"
                        : isActive ? "hsl(var(--destructive) / 0.14)" : "hsl(var(--destructive) / 0.05)",
                    border: `2px solid ${
                      isActive
                        ? isTarget ? "hsl(var(--primary))" : l.level === 3 ? "hsl(var(--warning) / 0.5)" : "hsl(var(--destructive) / 0.4)"
                        : isTarget ? "hsl(var(--primary) / 0.2)" : l.level === 3 ? "hsl(var(--warning) / 0.15)" : "hsl(var(--destructive) / 0.12)"
                    }`,
                    borderBottom: "none",
                  }}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-start pt-3 md:pt-4 px-1.5 md:px-3">
                    {/* Level */}
                    <div className="text-base md:text-lg font-black mb-0.5"
                      style={{ color: isTarget && isActive ? "hsl(var(--primary-foreground))" : accentColor }}>
                      L{l.level}
                    </div>

                    {/* Title */}
                    <div className="text-[10px] md:text-xs font-bold leading-tight text-center mb-1"
                      style={{ color: isTarget && isActive ? "hsl(var(--primary-foreground) / 0.95)" : "hsl(var(--foreground) / 0.85)" }}>
                      {l.title}
                    </div>

                    {/* Short - visible on L2+ */}
                    {l.level >= 2 && (
                      <div className="text-[8px] md:text-[10px] leading-snug text-center hidden sm:block px-1 mb-1.5"
                        style={{ color: isTarget && isActive ? "hsl(var(--primary-foreground) / 0.8)" : "hsl(var(--muted-foreground))" }}>
                        {l.short}
                      </div>
                    )}

                    {/* AI impact line - visible on L3+ */}
                    {l.level >= 3 && (
                      <div className="mt-auto mb-3 text-[8px] md:text-[9px] font-medium text-center hidden md:block px-1.5 py-1 rounded-md"
                        style={{
                          color: isTarget && isActive ? "hsl(var(--primary-foreground) / 0.85)" : accentColor,
                          background: isTarget && isActive ? "hsl(0 0% 100% / 0.15)" : `${accentColor}11`,
                        }}>
                        🤖 {l.ai}
                      </div>
                    )}
                  </div>

                  {/* Active bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-200"
                    style={{ background: accentColor, opacity: isActive ? 1 : 0 }} />
                </button>
              );
            })}
          </div>

          {/* Base */}
          <div className="h-1 rounded-full" style={{ background: "hsl(var(--border))" }} />
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[10px] text-muted-foreground font-medium">← Knowledge scattered</span>
            <span className="text-[10px] font-semibold text-primary">Knowledge compounding →</span>
          </div>
        </div>

        {/* Tap hint */}
        {activeLevel === null && (
          <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1 animate-bounce">
            <ChevronDown className="w-3.5 h-3.5" /> Tap a level to learn more
          </p>
        )}

        {/* Detail card */}
        {activeLevel !== null && (() => {
          const l = LEVELS[activeLevel - 1];
          const isTarget = l.level >= 4;
          const accentColor = isTarget
            ? "hsl(var(--primary))"
            : l.level === 3 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

          return (
            <div
              className="rounded-xl border-2 p-5 mt-4 animate-fade-in"
              style={{
                borderColor: isTarget ? "hsl(var(--primary) / 0.3)" : l.level === 3 ? "hsl(var(--warning) / 0.3)" : "hsl(var(--destructive) / 0.3)",
                background: isTarget ? "hsl(var(--primary) / 0.04)" : "hsl(var(--background))",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
                    style={{
                      background: isTarget ? "var(--gradient-brand-btn)" : `${accentColor}1a`,
                      color: isTarget ? "hsl(var(--primary-foreground))" : accentColor,
                    }}>
                    L{l.level}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-base font-bold">{l.title}</span>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                        style={{ background: `${accentColor}15`, color: accentColor }}>
                        {isTarget ? "Target" : l.level === 3 ? "Transitional" : "At risk"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{l.short}</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">{l.detail}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3">
                      <span className="text-xs italic" style={{ color: "hsl(var(--foreground) / 0.5)" }}>
                        {l.symptom}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                        style={{ background: `${accentColor}12`, color: accentColor }}>
                        🤖 {l.ai}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setActiveLevel(null)}
                  className="p-1.5 rounded-lg hover:bg-accent transition-colors shrink-0">
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
