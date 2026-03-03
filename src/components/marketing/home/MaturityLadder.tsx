import { SectionTag, GradientText } from "./shared";
import { TrendingUp } from "lucide-react";

const LEVELS = [
  { level: 1, label: "Solo AI", desc: "Everyone trains their own ChatGPT", emoji: "🔴" },
  { level: 2, label: "Shared prompts", desc: "Same prompt, different outputs", emoji: "🟠" },
  { level: 3, label: "Static docs", desc: "Wiki feeds AI — already outdated", emoji: "🟡" },
  { level: 4, label: "Live context", desc: "Team knowledge in every session", emoji: "🟢", active: true },
  { level: 5, label: "Self-running", desc: "Methodology executes itself", emoji: "🔵" },
];

export function MaturityLadder() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="Where is your team?" icon={<TrendingUp className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Most teams plateau at Level 2–3.{" "}
            <GradientText>LIZA gets you to 4.</GradientText>
          </h2>
        </div>

        {/* Horizontal ladder */}
        <div className="relative">
          {/* Progress bar behind */}
          <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-1 rounded-full" style={{ background: "hsl(var(--muted))" }}>
            <div className="h-full rounded-full" style={{ width: "75%", background: "var(--gradient-brand)" }} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-2 relative z-10">
            {LEVELS.map((l) => (
              <div
                key={l.level}
                className={`rounded-xl border p-4 text-center transition-all ${l.active ? "ring-2" : ""}`}
                style={{
                  borderColor: l.active ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))",
                  background: l.active ? "hsl(var(--primary) / 0.06)" : "hsl(var(--card))",
                  ...(l.active ? { ringColor: "hsl(var(--primary) / 0.2)" } : {}),
                }}
              >
                <div className="text-2xl mb-1">{l.emoji}</div>
                <div
                  className="inline-block text-[10px] font-black tracking-widest uppercase mb-1 px-2 py-0.5 rounded-full"
                  style={{
                    background: l.active ? "var(--gradient-brand-btn)" : "hsl(var(--muted))",
                    color: l.active ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  L{l.level}
                </div>
                <p className={`text-sm font-bold mb-0.5 ${l.active ? "text-foreground" : "text-muted-foreground"}`}>{l.label}</p>
                <p className={`text-xs leading-snug ${l.active ? "text-foreground/70" : "text-muted-foreground/60"}`}>{l.desc}</p>
                {l.active && (
                  <span className="inline-block mt-2 text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full" style={{ background: "hsl(var(--primary) / 0.15)", color: "hsl(var(--primary))" }}>
                    LIZA
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
