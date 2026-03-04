import { useState } from "react";
import { SectionTag, GradientText } from "./shared";
import { Layers, ChevronDown, ChevronUp, ArrowDown } from "lucide-react";

const LEVELS = [
  {
    level: 1,
    title: "Individual habits",
    short: "Execution depends on who's running it",
    ai: "AI scales individual habits, making inconsistency faster, not better",
    detail: "Your best people deliver great work. Others don't. There's no shared standard, just personal experience. When you add AI tools, each person gets faster at doing it their way. The gap between your best and worst output widens.",
    symptom: "\"It depends who runs it\"",
  },
  {
    level: 2,
    title: "Static playbooks",
    short: "Standards exist, but execution has moved past them",
    ai: "AI makes the gap worse: teams work faster than static docs can keep up with",
    detail: "You wrote down best practices once. Some people follow them, most don't. Now AI is changing how work actually gets done: faster iterations, more distributed tasks. Your documented process and your real process have fully diverged. Nobody knows which version is current.",
    symptom: "\"We have a wiki, but nobody checks it anymore\"",
    marker: "most-pre-ai",
  },
  {
    level: 3,
    title: "Distributed AI silos",
    short: "Everyone's using AI, but disconnected",
    ai: "Custom GPTs, Claude Projects, personal setups. None connected to team standards",
    detail: "Your team has embraced AI and they're productive. But each person has built their own setup, their own prompts, their own shortcuts. Breakthroughs stay in individual chat histories. Your playbooks are scattered across tools and people. You've gained speed but lost coherence.",
    symptom: "\"Everyone has their own ChatGPT setup\"",
    marker: "most-ai",
  },
  {
    level: 4,
    title: "Living playbooks",
    short: "Shared standards, always current, always enforced",
    ai: "AI sessions run the team's latest, best playbook automatically",
    detail: "Your execution standards are defined, shared, and enforced in every session, human or AI-assisted. When someone discovers a better approach, it updates the shared playbook. Every team member works with the latest version. No copy-pasting. No drift.",
    symptom: "\"The system already knew our latest approach\"",
    marker: "liza",
  },
  {
    level: 5,
    title: "Compounding intelligence",
    short: "Every engagement makes the team's standards sharper",
    ai: "Execution feeds back into playbooks. Methodology evolves continuously",
    detail: "Your team's standards improve with every engagement. The weakest performer benefits from the strongest insight. Leadership has visibility into what's working and what's drifting. The whole system compounds, whether your team uses AI tools or not.",
    symptom: "\"We're measurably better this quarter than last\"",
  },
];

const SUMMARY = [
  { level: "L1", label: "Individual habits", color: "destructive" },
  { level: "L2", label: "Outdated standards", color: "destructive" },
  { level: "L3", label: "AI silos", color: "warning" },
  { level: "L4", label: "Living playbooks", color: "primary" },
  { level: "L5", label: "Compounding team", color: "primary" },
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
            How well does your team{" "}
            <GradientText>manage execution?</GradientText>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Execution quality was always hard to manage. AI didn't fix it. It amplified whatever level you were already at.
          </p>
        </div>

        {/* Zone labels with integrated markers */}
        <div className="flex gap-1 mb-2">
          {/* Unmanaged zone */}
          <div className="flex-[3] flex flex-col items-center rounded-lg py-3 px-2"
            style={{ background: "hsl(var(--destructive) / 0.06)", border: "1px dashed hsl(var(--destructive) / 0.2)" }}>
            <span className="text-[9px] md:text-xs font-black px-2 md:px-3 py-1 rounded-full text-center leading-tight mb-1"
              style={{ color: "hsl(var(--destructive))", background: "hsl(var(--destructive) / 0.1)", border: "1px solid hsl(var(--destructive) / 0.2)" }}>
              <span className="hidden sm:inline">Most teams are here, trying to adopt AI</span>
              <span className="sm:hidden">Most teams</span>
            </span>
            <span className="text-[10px] md:text-xs font-black tracking-[0.1em] uppercase" style={{ color: "hsl(var(--destructive))" }}>
              Unmanaged execution
            </span>
            <svg width="80" height="20" viewBox="0 0 80 20" fill="none" className="block mt-1">
              <path d="M40 0 L40 5 Q40 10 32 13 L14 18" stroke="hsl(var(--destructive) / 0.4)" strokeWidth="1.5" fill="none" />
              <path d="M40 0 L40 5 Q40 10 48 13 L66 18" stroke="hsl(var(--destructive) / 0.4)" strokeWidth="1.5" fill="none" />
              <polygon points="11,16 14,20 17,16" fill="hsl(var(--destructive) / 0.5)" />
              <polygon points="63,16 66,20 69,16" fill="hsl(var(--destructive) / 0.5)" />
            </svg>
          </div>
          {/* Managed zone */}
          <div className="flex-[2] flex flex-col items-center rounded-lg py-3 px-2"
            style={{ background: "hsl(var(--primary) / 0.06)", border: "1px dashed hsl(var(--primary) / 0.25)" }}>
            <span className="text-[9px] md:text-xs font-black whitespace-nowrap px-2 md:px-3 py-1 rounded-full mb-1"
              style={{ color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.1)", border: "1px solid hsl(var(--primary) / 0.2)" }}>
              Day 1 with LIZA
            </span>
            <span className="text-[10px] md:text-xs font-black tracking-[0.1em] uppercase text-primary">
              Managed execution
            </span>
            <ArrowDown className="w-4 h-4 mt-1 text-primary opacity-50" />
          </div>
        </div>

        {/* Staircase */}
        <div className="relative">
          <div className="flex items-end gap-1.5 md:gap-2 mb-1" style={{ height: "380px" }}>
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
                    <div className="text-base md:text-lg font-black mb-0.5"
                      style={{ color: isTarget && isActive ? "hsl(var(--primary-foreground))" : accentColor }}>
                      L{l.level}
                    </div>
                    <div className="text-[10px] md:text-xs font-bold leading-tight text-center mb-1"
                      style={{ color: isTarget && isActive ? "hsl(var(--primary-foreground) / 0.95)" : "hsl(var(--foreground) / 0.85)" }}>
                      {l.title}
                    </div>
                    {l.level >= 2 && (
                      <div className="text-[8px] md:text-[10px] leading-snug text-center hidden sm:block px-1 mb-1.5"
                        style={{ color: isTarget && isActive ? "hsl(var(--primary-foreground) / 0.8)" : "hsl(var(--muted-foreground))" }}>
                        {l.short}
                      </div>
                    )}
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
                  <div className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-200"
                    style={{ background: accentColor, opacity: isActive ? 1 : 0 }} />
                </button>
              );
            })}
          </div>

          {/* Base */}
          <div className="h-1 rounded-full" style={{ background: "hsl(var(--border))" }} />
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[10px] text-muted-foreground font-medium">← Execution depends on individuals</span>
            <span className="text-[10px] font-semibold text-primary">Execution managed as a system →</span>
          </div>
        </div>

        {/* Summary strip */}
        <div className="mt-6 grid grid-cols-5 gap-1.5">
          {SUMMARY.map((s) => (
            <button
              key={s.level}
              onClick={() => setActiveLevel(activeLevel === parseInt(s.level[1]) ? null : parseInt(s.level[1]))}
              className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg transition-all text-center cursor-pointer"
              style={{
                background: activeLevel === parseInt(s.level[1])
                  ? `hsl(var(--${s.color}) / 0.12)`
                  : `hsl(var(--${s.color}) / 0.04)`,
                border: `1px solid ${activeLevel === parseInt(s.level[1])
                  ? `hsl(var(--${s.color}) / 0.3)`
                  : `hsl(var(--${s.color}) / 0.1)`}`,
              }}
            >
              <span className="text-[10px] font-black" style={{ color: `hsl(var(--${s.color}))` }}>
                {s.level}
              </span>
              <span className="text-[9px] md:text-[10px] leading-tight text-muted-foreground font-medium">
                {s.label}
              </span>
            </button>
          ))}
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
                        {isTarget ? "Target" : l.level === 3 ? "The AI ceiling" : "At risk"}
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
