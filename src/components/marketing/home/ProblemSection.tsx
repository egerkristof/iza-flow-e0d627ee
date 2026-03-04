import { useState } from "react";
import { SectionTag, GradientText } from "./shared";
import { Layers, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

const LEVELS = [
  {
    level: 1,
    title: "In their heads",
    short: "Quality depends on who does the work",
    withoutAI: "A senior's absence means visible quality drops. Knowledge is locked in individual experience.",
    withAI: "Everyone prompts their own way. Same question, different answers. No shared standard.",
    color: "destructive" as const,
  },
  {
    level: 2,
    title: "Static playbooks",
    short: "Someone wrote the docs — 18 months ago",
    withoutAI: "The methodology doc was good once. Nobody follows it because it doesn't match today's reality.",
    withAI: "Each person builds their own prompts. The 'official' process and the real process have diverged.",
    color: "destructive" as const,
  },
  {
    level: 3,
    title: "Pockets of sharing",
    short: "Some knowledge transfers, but inconsistently",
    withoutAI: "Post-project reviews happen sometimes. Best practices get shared in meetings, slowly.",
    withAI: "A few people share prompts in Slack. No curation, no way to know what's current.",
    color: "warning" as const,
  },
  {
    level: 4,
    title: "Live shared context",
    short: "The team operates from a living knowledge base",
    withoutAI: "Knowledge base updated after every engagement. Onboarding takes weeks, not months.",
    withAI: "AI sessions start pre-loaded with accumulated judgment. Everyone executes from the same standard.",
    color: "primary" as const,
  },
  {
    level: 5,
    title: "Governed intelligence",
    short: "Leadership shapes the standard. The team compounds.",
    withoutAI: "Methodology evolves continuously. The whole team gets smarter with every engagement.",
    withAI: "AI usage is visible and governed. The weakest performer benefits from the strongest insight.",
    color: "primary" as const,
  },
];

export function ProblemSection() {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  const toggle = (level: number) => {
    setExpandedLevel(expandedLevel === level ? null : level);
  };

  return (
    <section id="maturity-ladder" className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionTag label="The diagnostic" icon={<Layers className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Where is your team on the{" "}
            <GradientText>knowledge maturity scale?</GradientText>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            AI didn't create the problem. It amplified wherever you already were.
          </p>
        </div>

        {/* Horizontal progress bar */}
        <div className="mb-10">
          <div className="flex items-stretch gap-1 mb-2">
            {LEVELS.map((l) => {
              const isTarget = l.level >= 4;
              const isExpanded = expandedLevel === l.level;
              return (
                <button
                  key={l.level}
                  onClick={() => toggle(l.level)}
                  className={`flex-1 rounded-lg py-3 px-2 text-center transition-all cursor-pointer border-2 ${
                    isExpanded ? "ring-2 ring-offset-1" : ""
                  }`}
                  style={{
                    background: isTarget
                      ? "hsl(var(--primary) / 0.08)"
                      : l.color === "warning"
                      ? "hsl(var(--warning) / 0.08)"
                      : "hsl(var(--destructive) / 0.08)",
                    borderColor: isExpanded
                      ? isTarget
                        ? "hsl(var(--primary) / 0.5)"
                        : l.color === "warning"
                        ? "hsl(var(--warning) / 0.5)"
                        : "hsl(var(--destructive) / 0.5)"
                      : "transparent",
                  }}
                >
                  <div
                    className="text-xs font-black mb-0.5"
                    style={{
                      color: isTarget
                        ? "hsl(var(--primary))"
                        : l.color === "warning"
                        ? "hsl(var(--warning))"
                        : "hsl(var(--destructive))",
                    }}
                  >
                    L{l.level}
                  </div>
                  <div className="text-[10px] font-semibold leading-tight hidden sm:block">{l.title}</div>
                </button>
              );
            })}
          </div>

          {/* Progress track */}
          <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--border))" }}>
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
              style={{
                width: expandedLevel ? `${(expandedLevel / 5) * 100}%` : "50%",
                background: "var(--gradient-brand)",
                opacity: expandedLevel && expandedLevel >= 4 ? 1 : 0.5,
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2"
              style={{
                left: "calc(50% - 6px)",
                background: "hsl(var(--background))",
                borderColor: "hsl(var(--destructive))",
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground">Fragmented</span>
            <span className="text-[10px] font-semibold" style={{ color: "hsl(var(--destructive))" }}>
              ← Most teams
            </span>
            <span className="text-[10px] font-semibold text-primary">Compounding →</span>
          </div>
        </div>

        {/* Expandable detail card */}
        {expandedLevel !== null && (
          <div
            className="rounded-xl border-2 p-5 mb-6 animate-fade-in"
            style={{
              borderColor:
                LEVELS[expandedLevel - 1].color === "primary"
                  ? "hsl(var(--primary) / 0.3)"
                  : LEVELS[expandedLevel - 1].color === "warning"
                  ? "hsl(var(--warning) / 0.3)"
                  : "hsl(var(--destructive) / 0.3)",
              background:
                LEVELS[expandedLevel - 1].color === "primary"
                  ? "hsl(var(--primary) / 0.04)"
                  : "hsl(var(--background))",
            }}
          >
            {(() => {
              const l = LEVELS[expandedLevel - 1];
              const isTarget = l.level >= 4;
              return (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
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
                        <p className="text-xs text-muted-foreground">{l.short}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedLevel(null)}
                      className="p-1 rounded-lg hover:bg-accent transition-colors"
                    >
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="rounded-lg border px-4 py-3" style={{ borderColor: "hsl(var(--border))" }}>
                      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
                        Without AI
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{l.withoutAI}</p>
                    </div>
                    <div
                      className="rounded-lg px-4 py-3"
                      style={{
                        background: isTarget ? "hsl(var(--primary) / 0.06)" : "hsl(var(--destructive) / 0.04)",
                        border: `1px solid ${isTarget ? "hsl(var(--primary) / 0.15)" : "hsl(var(--destructive) / 0.12)"}`,
                      }}
                    >
                      <p
                        className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1"
                        style={{ color: isTarget ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}
                      >
                        {isTarget ? "With AI + LIZA" : "With AI (unmanaged)"}
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{l.withAI}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Tap-to-explore hint — animated */}
        {expandedLevel === null && (
          <p className="text-center text-xs text-muted-foreground mb-6 flex items-center justify-center gap-1 animate-bounce">
            <ChevronDown className="w-3.5 h-3.5" /> Tap a level to explore
          </p>
        )}

        {/* Where most teams sit */}
        <div className="flex flex-col md:flex-row gap-4">
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
