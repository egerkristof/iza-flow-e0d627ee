import { SectionTag, GradientText } from "./shared";
import { TrendingUp, Zap } from "lucide-react";

const LEVELS = [
  { level: 1, label: "It lives in their heads", desc: "Your best people just know. When they're unavailable, quality drops. Nothing written down actually helps.", emoji: "🔴" },
  { level: 2, label: "We wrote it down once", desc: "There are SOPs, playbooks, maybe a wiki. They were accurate when someone wrote them. Nobody updates them. Nobody reads them.", emoji: "🟠" },
  { level: 3, label: "Everyone has their own AI now", desc: "Individuals are fast — but everyone prompts differently, uses different shortcuts, gets different results. More fragmented than before.", emoji: "🟡" },
  { level: 4, label: "One living playbook", desc: "The team's accumulated judgment runs in every session. New hires perform like veterans. Always current.", emoji: "🟢", active: true },
  { level: 5, label: "Gets smarter every week", desc: "Every engagement improves the playbook. Methodology leads see what's working and evolve it. The team compounds.", emoji: "🔵" },
];

const SCENARIOS = [
  "Your senior consultant is on vacation — the junior delivers something the client pushes back on immediately.",
  "You onboard someone new and spend 3 weeks just getting them to 'how we do things here.'",
  "A key person leaves and you realize half your methodology walked out with them.",
];

export function MaturityLadder() {
  return (
    <section id="the-problem" className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="Where does your team sit?" icon={<TrendingUp className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Every team hits the same wall.{" "}
            <GradientText>Most just hit it faster now.</GradientText>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            The demand to make know-how transferable isn't new. AI just raised the stakes.
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

        {/* Mobile: vertical climb */}
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
                  background: l.active ? "hsl(var(--primary) / 0.06)" : "hsl(var(--background))",
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

        {/* Sound familiar? scenarios */}
        <div className="mt-12">
          <p className="text-sm font-black tracking-[0.15em] uppercase text-center mb-4" style={{ color: "hsl(var(--destructive))" }}>
            Sound familiar?
          </p>
          <div className="grid md:grid-cols-3 gap-3">
            {SCENARIOS.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border px-5 py-4 text-sm text-foreground/80 leading-relaxed"
                style={{ borderColor: "hsl(var(--destructive) / 0.2)", background: "hsl(var(--destructive) / 0.04)" }}
              >
                "{s}"
              </div>
            ))}
          </div>
        </div>

        {/* What's missing callout */}
        <div
          className="mt-10 rounded-2xl border-2 px-8 py-8 text-center"
          style={{ borderColor: "hsl(var(--primary) / 0.35)", background: "hsl(var(--primary) / 0.04)" }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-xs font-black tracking-[0.2em] uppercase text-primary">What's missing</span>
          </div>
          <p className="text-xl md:text-2xl font-black leading-snug">
            A system where your team's know-how stays current
            <br className="hidden md:block" />
            and runs in every session.
          </p>
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
        background: active ? "hsl(var(--primary) / 0.06)" : "hsl(var(--background))",
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
