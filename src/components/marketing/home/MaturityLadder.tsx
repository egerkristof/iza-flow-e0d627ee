import { SectionTag, GradientText } from "./shared";
import { TrendingUp } from "lucide-react";

const LEVELS = [
  { level: 1, label: "Winging it", desc: "Everyone uses their own AI. No shared playbook. Wildly inconsistent output.", emoji: "🔴" },
  { level: 2, label: "Copy-pasting prompts", desc: "The team shares templates — but every person still adds their own spin. Results vary.", emoji: "🟠" },
  { level: 3, label: "Docs nobody reads", desc: "There's a knowledge base, maybe even Notion. It was accurate six months ago.", emoji: "🟡" },
  { level: 4, label: "Live team playbook", desc: "Your team's accumulated judgment — injected into every work session, always current.", emoji: "🟢", active: true },
  { level: 5, label: "Self-improving system", desc: "Every engagement makes the playbook better. New hires perform like veterans in weeks.", emoji: "🔵" },
];

export function MaturityLadder() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="Where does your team sit?" icon={<TrendingUp className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Most teams plateau at Level 2–3.{" "}
            <GradientText>LIZA gets you to 4.</GradientText>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            If you're at Level 2, here's what Level 4 looks like in practice — and what it takes to get there.
          </p>
        </div>

        {/* Desktop: horizontal ladder */}
        <div className="relative hidden md:block">
          <div className="absolute top-6 left-[10%] right-[10%] h-1 rounded-full" style={{ background: "hsl(var(--muted))" }}>
            <div className="h-full rounded-full" style={{ width: "75%", background: "var(--gradient-brand)" }} />
          </div>

          <div className="grid grid-cols-5 gap-2 relative z-10">
            {LEVELS.map((l) => (
              <LevelCard key={l.level} {...l} />
            ))}
          </div>
        </div>

        {/* Mobile: vertical stack preserving "climbing" feeling */}
        <div className="md:hidden space-y-2 relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 rounded-full" style={{ background: "hsl(var(--muted))" }}>
            <div className="w-full rounded-full" style={{ height: "75%", background: "var(--gradient-brand)" }} />
          </div>
          {LEVELS.map((l) => (
            <div key={l.level} className="flex items-start gap-3 relative z-10 pl-10">
              <div
                className="absolute left-3.5 w-3 h-3 rounded-full mt-4 border-2"
                style={{
                  borderColor: l.active ? "hsl(var(--primary))" : "hsl(var(--border))",
                  background: l.active ? "hsl(var(--primary))" : "hsl(var(--card))",
                }}
              />
              <div
                className={`flex-1 rounded-xl border p-4 transition-all ${l.active ? "ring-2" : ""}`}
                style={{
                  borderColor: l.active ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))",
                  background: l.active ? "hsl(var(--primary) / 0.06)" : "hsl(var(--card))",
                  ...(l.active ? { ringColor: "hsl(var(--primary) / 0.2)" } : {}),
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{l.emoji}</span>
                  <span
                    className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
                    style={{
                      background: l.active ? "var(--gradient-brand-btn)" : "hsl(var(--muted))",
                      color: l.active ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                    }}
                  >
                    L{l.level}
                  </span>
                  <span className={`text-sm font-bold ${l.active ? "text-foreground" : "text-muted-foreground"}`}>{l.label}</span>
                </div>
                <p className={`text-xs leading-snug ${l.active ? "text-foreground/70" : "text-muted-foreground/60"}`}>{l.desc}</p>
                {l.active && (
                  <span className="inline-block mt-2 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
                    LIZA
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LevelCard({ level, label, desc, emoji, active }: {
  level: number; label: string; desc: string; emoji: string; active?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 text-center transition-all ${active ? "ring-2" : ""}`}
      style={{
        borderColor: active ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))",
        background: active ? "hsl(var(--primary) / 0.06)" : "hsl(var(--card))",
        ...(active ? { ringColor: "hsl(var(--primary) / 0.2)" } : {}),
      }}
    >
      <div className="text-2xl mb-1">{emoji}</div>
      <div
        className="inline-block text-[10px] font-black tracking-widest uppercase mb-1 px-2 py-0.5 rounded-full"
        style={{
          background: active ? "var(--gradient-brand-btn)" : "hsl(var(--muted))",
          color: active ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
        }}
      >
        L{level}
      </div>
      <p className={`text-sm font-bold mb-0.5 ${active ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
      <p className={`text-xs leading-snug ${active ? "text-foreground/70" : "text-muted-foreground/60"}`}>{desc}</p>
      {active && (
        <span className="inline-block mt-2 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
          LIZA
        </span>
      )}
    </div>
  );
}
