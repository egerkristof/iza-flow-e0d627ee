import { Link } from "react-router-dom";
import { ArrowRight, Shield, Check, X, Minus } from "lucide-react";
import { GradientText } from "./shared";

const COMPARE_ROWS = [
  { feature: "Standards enforced live in every session", wiki: false, ai: false, liza: true },
  { feature: "Team learns from every engagement", wiki: false, ai: false, liza: true },
  { feature: "Quality consistent across the whole team", wiki: "partial", ai: false, liza: true },
];

function MiniCell({ value }: { value: boolean | string }) {
  if (value === true)
    return <Check className="w-3.5 h-3.5" style={{ color: "hsl(var(--success))" }} />;
  if (value === "partial")
    return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  return <X className="w-3.5 h-3.5" style={{ color: "hsl(var(--destructive) / 0.4)" }} />;
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

        <p className="text-base text-muted-foreground max-w-lg mx-auto mb-4">
          Your team's best judgment, applied in every AI session—automatically.
        </p>

        <p className="text-xs text-muted-foreground/70 max-w-sm mx-auto mb-8 tracking-wide">
          Define, enforce, and continuously update how your team works—with and without AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
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

        {/* Compressed comparison strip */}
        <div
          className="max-w-xl mx-auto rounded-xl border overflow-hidden mb-10"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-4 text-[10px] md:text-xs font-bold tracking-wide uppercase"
            style={{ background: "hsl(var(--card))" }}
          >
            <div className="px-3 py-2.5 text-muted-foreground" />
            <div className="px-2 py-2.5 text-center text-muted-foreground border-l" style={{ borderColor: "hsl(var(--border))" }}>
              Wikis
            </div>
            <div className="px-2 py-2.5 text-center text-muted-foreground border-l" style={{ borderColor: "hsl(var(--border))" }}>
              AI Tools
            </div>
            <div
              className="px-2 py-2.5 text-center font-black border-l"
              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.06)" }}
            >
              LIZA
            </div>
          </div>

          {/* Rows */}
          {COMPARE_ROWS.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-4 border-t text-[11px] md:text-sm"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <div className="px-3 py-2.5 text-foreground/80 text-left">{r.feature}</div>
              <div className="px-2 py-2.5 flex items-center justify-center border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <MiniCell value={r.wiki} />
              </div>
              <div className="px-2 py-2.5 flex items-center justify-center border-l" style={{ borderColor: "hsl(var(--border))" }}>
                <MiniCell value={r.ai} />
              </div>
              <div
                className="px-2 py-2.5 flex items-center justify-center border-l"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--primary) / 0.03)" }}
              >
                <MiniCell value={r.liza} />
              </div>
            </div>
          ))}
        </div>

        {/* Product glimpse */}
        <div
          className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border"
          style={{ borderColor: "hsl(var(--border))", boxShadow: "0 20px 60px -15px hsl(var(--primary) / 0.15)" }}
        >
          <img
            src="/images/product-mission-control.png"
            alt="LIZA OS - Mission Control dashboard with playbooks, active sessions, and insights"
            className="w-full h-auto block"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
