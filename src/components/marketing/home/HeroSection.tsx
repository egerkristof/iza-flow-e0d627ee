import { Link } from "react-router-dom";
import { ArrowRight, Shield, Check, X, BookOpen, Brain, ShieldCheck } from "lucide-react";
import { GradientText } from "./shared";

const COMPARE_PILLARS = [
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    label: "Your best practices live in someone's head",
    description: "Standards exist in docs nobody opens mid-task. Every person improvises their own version.",
    wiki: false,
    wikiNote: "Static pages nobody reads mid-task",
    ai: false,
    aiNote: "No awareness of your standards",
    liza: true,
    lizaNote: "Enforced live, every session",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    label: "Every session starts from zero",
    description: "What one person learns never reaches the rest. Your team repeats mistakes instead of compounding wins.",
    wiki: false,
    wikiNote: "Updates are manual and rare",
    ai: false,
    aiNote: "No memory across users",
    liza: true,
    lizaNote: "Team-wide learning loops",
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    label: "Quality depends on who's doing the work",
    description: "Your best performer delivers—everyone else wings it. No system ensures consistency across the team.",
    wiki: "partial",
    wikiNote: "Depends on who reads what",
    ai: false,
    aiNote: "Varies by user's prompt skill",
    liza: true,
    lizaNote: "Same standard, every time",
  },
];

function StatusBadge({ value, note }: { value: boolean | string; note?: string }) {
  if (value === true)
    return (
      <span
        className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
        style={{ background: "hsl(var(--success) / 0.12)", color: "hsl(var(--success))" }}
      >
        <Check className="w-3.5 h-3.5" /> Yes
      </span>
    );
  if (value === "partial")
    return (
      <div className="text-right">
        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
          Partial
        </span>
        {note && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{note}</p>}
      </div>
    );
  return (
    <div className="text-right">
      <span
        className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
        style={{ background: "hsl(var(--destructive) / 0.08)", color: "hsl(var(--destructive) / 0.5)" }}
      >
        <X className="w-3.5 h-3.5" /> No
      </span>
      {note && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{note}</p>}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 65%)", transform: "translate(20%, -20%)" }}
      />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-primary mb-5">
          <Shield className="w-3 h-3" />
          For leaders who own execution quality
        </p>

        <h1 className="text-5xl md:text-7xl font-black mb-5 leading-[1.05]">
          From individual AI speed
          <br />
          <GradientText>to scaled team execution.</GradientText>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-3">
          The platform to define, enforce, and continuously update how your team works—
          <span className="relative inline font-semibold text-foreground">
            with and without AI.
            <span className="absolute bottom-0 left-0 w-full h-[2px] rounded-full" style={{ background: "var(--gradient-brand-btn)" }} />
          </span>
        </p>


        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
          <Link
            to="/beta"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Join the Private Beta <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={() => document.getElementById("the-problem")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            Where is your team? ↓
          </button>
        </div>

        {/* Three-pillar comparison — large, felt */}
        <div className="max-w-4xl mx-auto mb-14">
          <h2 className="text-lg md:text-xl font-black mb-2 text-foreground">
            Three reasons your current tools can't scale your team.
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-lg mx-auto">
            Wikis store knowledge. AI tools execute in silos. Neither makes your whole team better.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {COMPARE_PILLARS.map((p, i) => (
              <div
                key={i}
                className="rounded-xl border p-5 text-left flex flex-col"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <div className="flex items-center gap-2.5 mb-3 text-foreground">
                  <div className="p-1.5 rounded-lg" style={{ background: "hsl(var(--primary) / 0.08)" }}>
                    {p.icon}
                  </div>
                  <span className="text-base font-bold leading-tight">{p.label}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed flex-1">
                  {p.description}
                </p>
                <div
                  className="space-y-2.5 pt-4 border-t"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-muted-foreground leading-tight">
                      Wikis & Docs
                      <span className="block text-[10px] text-muted-foreground/50">Confluence, Notion…</span>
                    </span>
                    <StatusBadge value={p.wiki} note={p.wikiNote} />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs text-muted-foreground leading-tight">
                      AI Tools
                      <span className="block text-[10px] text-muted-foreground/50">ChatGPT, Claude…</span>
                    </span>
                    <StatusBadge value={p.ai} note={p.aiNote} />
                  </div>
                  <div
                    className="flex items-start justify-between gap-2 rounded-lg px-2 py-1.5 -mx-2"
                    style={{ background: "hsl(var(--primary) / 0.05)" }}
                  >
                    <span className="text-xs font-bold leading-tight" style={{ color: "hsl(var(--primary))" }}>
                      LIZA
                      {p.lizaNote && <span className="block text-[10px] font-normal" style={{ color: "hsl(var(--primary) / 0.7)" }}>{p.lizaNote}</span>}
                    </span>
                    <StatusBadge value={p.liza} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
