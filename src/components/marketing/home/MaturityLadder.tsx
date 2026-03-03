import { SectionTag, GradientText } from "./shared";
import { TrendingUp } from "lucide-react";

const LEVELS = [
  {
    level: 1,
    state: "Everyone uses AI solo",
    pain: "Every person reinvents every workflow. No shared knowledge, no consistency across client work.",
    active: false,
  },
  {
    level: 2,
    state: "Shared prompts, but personal context",
    pain: "You share prompt templates, but everyone's AI has different context. Same question, different answers.",
    active: false,
  },
  {
    level: 3,
    state: "Docs and wikis feed the AI",
    pain: "You connected your Notion or knowledge base. But it was outdated the week it was written. AI gives plausible-sounding answers based on stale information.",
    active: false,
  },
  {
    level: 4,
    state: "Live context, shared across the team",
    pain: "Your methodology, your client knowledge, your team's actual judgment — live in every AI session. New hire on day one works like a 2-year veteran.",
    active: true,
  },
  {
    level: 5,
    state: "Your methodology runs itself",
    pain: "Protocols encode your best people's decision-making. The system gets smarter with every engagement. You focus on exceptions, not process.",
    active: false,
  },
];

export function MaturityLadder() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="Where does your team sit?" icon={<TrendingUp className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Most teams are stuck at Level 2–3.{" "}
            <GradientText>LIZA gets you to 4.</GradientText>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Your AI is only as good as the context it works with. Here's where the gap is — and where it closes.
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
