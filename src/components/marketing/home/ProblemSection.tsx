import { SectionTag, GradientText } from "./shared";
import { Layers, AlertTriangle } from "lucide-react";

const LEVELS = [
  {
    level: 1,
    title: "It lives in their heads",
    withoutAI: "Quality depends entirely on who does the work. A senior's absence means visible quality drops. Knowledge is locked in individual experience.",
    withAI: "Everyone prompts their own way. Same question, different answers. There's no shared standard — just personal shortcuts.",
    color: "var(--destructive)",
  },
  {
    level: 2,
    title: "Static playbooks exist",
    withoutAI: "Someone wrote the methodology doc. It was good — 18 months ago. Nobody follows it because it doesn't match today's reality.",
    withAI: "The team uses AI, but each person builds their own prompts and templates. The 'official' process and the real process have diverged completely.",
    color: "var(--destructive)",
  },
  {
    level: 3,
    title: "Pockets of sharing",
    withoutAI: "Post-project reviews happen sometimes. Best practices get shared in meetings. Some knowledge transfers, but it's inconsistent and slow.",
    withAI: "A few people share useful prompts in Slack. But there's no structure, no curation, no way to know what's current. Tribal knowledge, just faster.",
    color: "hsl(38 92% 50%)",
  },
  {
    level: 4,
    title: "Live, shared context",
    withoutAI: "The team operates from a living knowledge base that's updated after every engagement. Onboarding takes weeks, not months.",
    withAI: "AI sessions start pre-loaded with the team's accumulated judgment. Every person executes from the same up-to-date standard — automatically.",
    color: "hsl(var(--primary))",
  },
  {
    level: 5,
    title: "Governed, compounding intelligence",
    withoutAI: "Methodology evolves continuously. Leadership sees what's working and shapes the standard. The whole team gets smarter with every engagement.",
    withAI: "AI usage is visible, governed, and improving. The weakest performer benefits from the strongest insight. Knowledge compounds across the entire team.",
    color: "hsl(var(--primary))",
  },
];

export function ProblemSection() {
  return (
    <section id="maturity-ladder" className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <SectionTag label="The maturity ladder" icon={<Layers className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Where is your team on the{" "}
            <GradientText>knowledge maturity scale?</GradientText>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Every team sits somewhere on this ladder. AI didn't create the problem — it amplified wherever you already were. Most teams are stuck at Level 2 or 3.
          </p>
        </div>

        {/* Maturity levels */}
        <div className="space-y-3 mb-12">
          {LEVELS.map((l) => {
            const isTarget = l.level >= 4;
            return (
              <div
                key={l.level}
                className="rounded-xl border p-5 transition-all"
                style={{
                  borderColor: isTarget ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border))",
                  background: isTarget ? "hsl(var(--primary) / 0.04)" : "hsl(var(--background))",
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Level badge */}
                  <div className="flex items-center gap-3 md:w-56 shrink-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                      style={{
                        background: isTarget ? "var(--gradient-brand-btn)" : `${l.color} / 0.12)`.startsWith("hsl") ? `${l.color.replace(")", " / 0.12)")}` : `hsl(${l.color} / 0.12)`,
                        color: isTarget ? "hsl(var(--primary-foreground))" : l.color.startsWith("hsl") ? l.color : `hsl(${l.color})`,
                        ...(isTarget ? {} : { background: `hsl(var(--destructive) / 0.1)`, color: l.level === 3 ? "hsl(38 92% 50%)" : "hsl(var(--destructive))" }),
                      }}
                    >
                      L{l.level}
                    </div>
                    <span className="text-sm font-bold">{l.title}</span>
                  </div>

                  {/* Two columns: without AI / with AI */}
                  <div className="grid md:grid-cols-2 gap-3 flex-1">
                    <div>
                      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">Without AI</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{l.withoutAI}</p>
                    </div>
                    <div
                      className="rounded-lg px-3 py-2.5"
                      style={{
                        background: isTarget ? "hsl(var(--primary) / 0.06)" : "hsl(var(--destructive) / 0.04)",
                        border: `1px solid ${isTarget ? "hsl(var(--primary) / 0.15)" : "hsl(var(--destructive) / 0.12)"}`,
                      }}
                    >
                      <p className="text-[10px] font-bold tracking-[0.15em] uppercase mb-1"
                        style={{ color: isTarget ? "hsl(var(--primary))" : "hsl(var(--destructive))" }}
                      >
                        {isTarget ? "With AI + LIZA" : "With AI (unmanaged)"}
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{l.withAI}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Where most teams sit */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
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
              Stuck at Level 2–3. Fast individuals, fragmented team. Knowledge scattered across personal AI accounts, outdated docs, and tribal memory.
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
              Level 4–5. Live shared context, governed methodology, compounding team intelligence. Every engagement makes the whole team smarter.
            </p>
          </div>
        </div>

        {/* Infrastructure callout */}
        <div
          className="rounded-2xl border-2 px-8 py-8 text-center"
          style={{ borderColor: "hsl(var(--primary) / 0.35)", background: "hsl(var(--primary) / 0.04)" }}
        >
          <p className="text-xl md:text-2xl font-black leading-snug">
            To get there, you need infrastructure that makes your team
            <br className="hidden md:block" />
            execute, learn, and evolve as one — with you at the helm.
          </p>
        </div>
      </div>
    </section>
  );
}
