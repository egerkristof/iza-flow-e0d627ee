import { ArrowRight } from "lucide-react";
import { CAL_URL } from "./shared";

const PROOF_POINTS = [
  "15 years combined methodology",
  "200+ consulting engagements",
  "8 countries",
];

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 65%)",
          transform: "translate(20%, -20%)",
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10 text-center">
        {/* Eyebrow — struggle trigger, not role label */}
        <p
          className="text-[11px] font-black tracking-[0.25em] uppercase mb-8"
          style={{ color: "hsl(var(--primary))" }}
        >
          Your team uses AI. Nothing compounds.
        </p>

        {/* Headline — 2 visual lines + category anchor */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-[1.1] tracking-tight">
          The management layer
          <br />
          <span className="text-muted-foreground">your AI stack is missing.</span>
        </h1>

        {/* Category anchor */}
        <p className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-6">
          LIZA OS is the AI execution layer for teams.
        </p>

        {/* Subhead — the A→B transformation */}
        <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-10">
          Define your team's standards once. Every AI session enforces them.
          <br className="hidden md:block" />
          <span className="font-semibold text-foreground">Your best thinking scales to everyone.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Book a Discovery Call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <button
            onClick={() =>
              document
                .getElementById("three-reasons")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            See how it works ↓
          </button>
        </div>

        {/* Inline trust proof */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {PROOF_POINTS.map((point, i) => (
            <span key={i} className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              {i > 0 && (
                <span
                  className="w-1 h-1 rounded-full hidden sm:block"
                  style={{ background: "hsl(var(--primary) / 0.4)" }}
                />
              )}
              {point}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
