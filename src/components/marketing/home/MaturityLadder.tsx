import { SectionTag, GradientText } from "./shared";
import { TrendingUp } from "lucide-react";

const LEVELS = [
  {
    level: 1,
    state: "Solo AI, nothing shared",
    cost: "Everyone reinvents every workflow. Your best consultant leaves — 14 months of client-specific judgment, pricing intuition, and relationship context walks out with them.",
    active: false,
  },
  {
    level: 2,
    state: "Shared prompts, personal context",
    cost: "Same prompt, different outputs. You asked two people to draft the same proposal and got two completely different approaches. The client noticed.",
    active: false,
  },
  {
    level: 3,
    state: "Shared docs, static knowledge",
    cost: "6 months to ramp a new hire. Your Notion wiki was outdated the week it was written. Nobody reads the playbook because it doesn't match how work actually happens.",
    active: false,
  },
  {
    level: 4,
    state: "Live, shared, executable context",
    cost: "Consistency without micromanagement. New hires handle complex deals the way your veterans would — because your methodology is loaded into every session, live.",
    active: true,
  },
  {
    level: 5,
    state: "Context powers every decision",
    cost: "Your organisation's intelligence compounds automatically. Protocols execute your methodology. People focus on judgment, not process.",
    active: false,
  },
];

export function MaturityLadder() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Where are you?" icon={<TrendingUp className="w-3 h-3" />} />
          <h2 className="text-4xl font-black mb-4">
            How live is your context <GradientText>when you work?</GradientText>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most teams plateau at Level 2-3. AI is powerful individually. But without shared, live context, every new project — and every new hire — starts from scratch.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {LEVELS.map((l) => (
            <div
              key={l.level}
              className="relative rounded-xl border p-5 flex flex-col md:flex-row md:items-start gap-3 md:gap-6 overflow-hidden transition-all"
              style={{
                borderColor: l.active ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))",
                background: l.active ? "hsl(var(--primary) / 0.06)" : "transparent",
              }}
            >
              {l.active && (
                <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: "var(--gradient-brand)" }} />
              )}
              <div className="flex items-center gap-3 shrink-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                  style={{
                    background: l.active ? "var(--gradient-brand-btn)" : "hsl(var(--muted))",
                    color: l.active ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  L{l.level}
                </div>
                {l.active && (
                  <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
                    LIZA
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${l.active ? "text-foreground" : "text-muted-foreground"}`}>{l.state}</p>
                <p className={`text-sm mt-1 leading-relaxed ${l.active ? "text-foreground/80" : "text-muted-foreground/70"}`}>{l.cost}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}