import { SectionTag, GradientText } from "./shared";
import { TrendingUp } from "lucide-react";

const LEVELS = [
  {
    level: 1,
    state: "Solo AI, nothing shared",
    pain: "Everyone reinvents every workflow. Your best consultant leaves — 14 months of judgment walks out with them.",
    active: false,
  },
  {
    level: 2,
    state: "Shared prompts, personal context",
    pain: "Same prompt, different outputs. Two people draft the same proposal — two completely different approaches. The client noticed.",
    active: false,
  },
  {
    level: 3,
    state: "Shared docs, static knowledge",
    pain: "6 months to ramp a new hire. Your wiki was outdated the week it was written. Nobody reads the playbook because it doesn't match how work actually happens.",
    active: false,
  },
  {
    level: 4,
    state: "Live, shared, executable context",
    pain: "New hires handle complex work the way your veterans would — because your methodology is loaded into every session, live.",
    active: true,
  },
  {
    level: 5,
    state: "Knowledge compounds automatically",
    pain: "Every session feeds the system. Protocols execute your methodology. People focus on judgment, not process.",
    active: false,
  },
];

export function MaturityLadder() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="Where are you?" icon={<TrendingUp className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Most teams plateau at Level 2–3.{" "}
            <GradientText>LIZA takes you to 4.</GradientText>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            AI is powerful individually. Without shared, live knowledge infrastructure, every new project — and every new hire — starts from scratch.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {LEVELS.map((l) => (
            <div
              key={l.level}
              className="relative rounded-xl border px-5 py-4 flex items-start gap-4 overflow-hidden transition-all"
              style={{
                borderColor: l.active ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))",
                background: l.active ? "hsl(var(--primary) / 0.06)" : "transparent",
              }}
            >
              {l.active && (
                <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: "var(--gradient-brand)" }} />
              )}
              <div
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black mt-0.5"
                style={{
                  background: l.active ? "var(--gradient-brand-btn)" : "hsl(var(--muted))",
                  color: l.active ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                }}
              >
                L{l.level}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-bold ${l.active ? "text-foreground" : "text-muted-foreground"}`}>{l.state}</p>
                  {l.active && (
                    <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
                      LIZA
                    </span>
                  )}
                </div>
                <p className={`text-sm mt-0.5 leading-relaxed ${l.active ? "text-foreground/80" : "text-muted-foreground/70"}`}>{l.pain}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
