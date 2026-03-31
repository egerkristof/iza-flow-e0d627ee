import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CAL_URL } from "./shared";

const PROOF_POINTS = [
  "15 years of methodology refinement",
  "15+ clients across 8 countries",
];

export function HeroSection() {
  return (
    <section className="relative pt-14 pb-20 md:pt-20 md:pb-28 px-6 overflow-hidden">
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
        <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black mb-4 leading-[1.1] tracking-tight">
          Domain expertise drives the AI.
          <br />
          <span className="text-primary">Not the other way around.</span>
        </h1>

        <p className="text-lg md:text-xl font-semibold mb-6 text-muted-foreground max-w-2xl mx-auto">
          The management layer for AI-native teams.
        </p>

        <p className="text-sm md:text-base mb-8 text-muted-foreground/80 max-w-xl mx-auto">
          Most AI platforms are built for developers and focused on automation.
          LIZA OS puts subject matter experts in control — they design workflows,
          set governance, and scale what actually matters.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            to="/diagnostic"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Take the 90s Diagnostic
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            Book a Discovery Call <ArrowRight className="w-4 h-4" />
          </a>
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
