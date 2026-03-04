import { Link } from "react-router-dom";
import { ArrowRight, Shield, Check, X, BookOpen, Brain, ShieldCheck } from "lucide-react";
import { GradientText } from "./shared";

const COMPARE_PILLARS = [
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    label: "Enforce your best standards",
    description: "Every session runs on your proven playbooks",
    wiki: false,
    ai: false,
    liza: true,
  },
  {
    icon: <Brain className="w-4 h-4" />,
    label: "Your team learns together",
    description: "Insights from every engagement flow back to everyone",
    wiki: false,
    ai: false,
    liza: true,
  },
  {
    icon: <BookOpen className="w-4 h-4" />,
    label: "Quality stays consistent",
    description: "Junior or senior—same standard, every time",
    wiki: "partial",
    ai: false,
    liza: true,
  },
];

function StatusBadge({ value }: { value: boolean | string }) {
  if (value === true)
    return (
      <span
        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
        style={{ background: "hsl(var(--success) / 0.12)", color: "hsl(var(--success))" }}
      >
        <Check className="w-3 h-3" /> Yes
      </span>
    );
  if (value === "partial")
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
        Partial
      </span>
    );
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
      style={{ background: "hsl(var(--destructive) / 0.08)", color: "hsl(var(--destructive) / 0.5)" }}
    >
      <X className="w-3 h-3" /> No
    </span>
  );
}

export function HeroSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 65%)", transform: "translate(20%, -20%)" }}
      />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-primary mb-5">
          <Shield className="w-3 h-3" />
          For leaders managing AI-driven teams
        </p>

        <h1 className="text-5xl md:text-7xl font-black mb-5 leading-[1.05]">
          From individual AI speed
          <br />
          <GradientText>to team intelligence.</GradientText>
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-3">
          Define, enforce, and continuously update how your team works—
          <span className="relative inline font-semibold text-foreground">
            with and without AI.
            <span className="absolute bottom-0 left-0 w-full h-[2px] rounded-full" style={{ background: "var(--gradient-brand-btn)" }} />
          </span>
        </p>

        <p className="text-sm text-muted-foreground/80 max-w-md mx-auto mb-9">
          So your best people's judgment isn't trapped in their heads—it's working in every session, for everyone.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
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

        {/* Three-pillar comparison */}
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Three things AI needs to work at team scale
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {COMPARE_PILLARS.map((p, i) => (
              <div
                key={i}
                className="rounded-xl border p-4 text-left"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <div className="flex items-center gap-2 mb-2 text-foreground">
                  {p.icon}
                  <span className="text-sm font-bold">{p.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  {p.description}
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Wikis & Docs</span>
                    <StatusBadge value={p.wiki} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">AI Tools</span>
                    <StatusBadge value={p.ai} />
                  </div>
                  <div
                    className="flex items-center justify-between rounded-md px-1.5 py-0.5 -mx-1.5"
                    style={{ background: "hsl(var(--primary) / 0.05)" }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "hsl(var(--primary))" }}>LIZA</span>
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
