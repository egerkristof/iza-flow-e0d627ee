import { ArrowRight, FileText, Shield, Users } from "lucide-react";
import { CAL_URL } from "./shared";

const PROOF_POINTS = [
  "15 years of methodology refinement",
  "200+ consulting engagements",
  "8 countries",
];

function ConceptDiagram() {
  const steps = [
    { icon: <FileText className="w-4 h-4" />, label: "Your standards", sub: "Playbooks & rules" },
    { icon: <Shield className="w-4 h-4" />, label: "LIZA enforces", sub: "Every AI session" },
    { icon: <Users className="w-4 h-4" />, label: "Team compounds", sub: "Consistent output" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-4">
          <div
            className="flex flex-col items-center gap-1.5 px-4 py-3 sm:px-6 sm:py-4 rounded-xl border"
            style={{
              borderColor: "hsl(var(--border))",
              background: "hsl(var(--card))",
            }}
          >
            <span style={{ color: "hsl(var(--primary))" }}>{step.icon}</span>
            <span className="text-xs sm:text-sm font-semibold text-foreground whitespace-nowrap">{step.label}</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{step.sub}</span>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 px-6 overflow-hidden">
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
        {/* Eyebrow — struggle trigger */}
        <p
          className="text-[11px] font-black tracking-[0.25em] uppercase mb-8"
          style={{ color: "hsl(var(--primary))" }}
        >
          Same tools. Same team. Wildly different results.
        </p>

        {/* Headline — 2 clean lines */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-[1.1] tracking-tight">
          The management layer{" "}
          <span className="text-muted-foreground">your AI is missing.</span>
        </h1>

        {/* Subhead — single clear promise */}
        <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-10">
          Capture your team's best thinking. Every AI session enforces it, and every session makes it sharper.
          {" "}
          <span className="font-semibold text-foreground">Standards that compound, not decay.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
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
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-14">
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

        {/* Conceptual product diagram */}
        <ConceptDiagram />
      </div>
    </section>
  );
}
