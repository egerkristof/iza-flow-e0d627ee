import { ArrowRight, FileText, Users, RotateCcw } from "lucide-react";
import { CAL_URL } from "./shared";

const PROOF_POINTS = [
  "15 years of methodology refinement",
  "200+ consulting engagements",
  "8 countries",
];

function ConceptDiagram() {
  const steps = [
    { icon: <FileText className="w-4 h-4" />, label: "Capture your playbooks", sub: "From docs, chats & tribal knowledge" },
    { icon: <Users className="w-4 h-4" />, label: "Run AI sessions together", sub: "Same living standards, every time" },
    { icon: <RotateCcw className="w-4 h-4" />, label: "Harvest what works", sub: "Learnings feed back automatically" },
  ];

  return (
    <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
      {steps.map((step, i) => (
        <div key={i} className="flex flex-row items-center gap-3 sm:gap-4">
          <div
            className="flex flex-col items-center gap-1.5 px-3 sm:px-6 py-3 sm:py-4 rounded-xl border"
            style={{
              borderColor: "hsl(var(--border))",
              background: "hsl(var(--card))",
            }}
          >
            <span style={{ color: "hsl(var(--primary))" }}>{step.icon}</span>
            <span className="text-[11px] sm:text-sm font-semibold text-foreground text-center leading-tight">{step.label}</span>
            <span className="text-[10px] sm:text-xs text-muted-foreground text-center leading-tight">{step.sub}</span>
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
        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black mb-4 leading-[1.1] tracking-tight">
          Your team gets wildly different
          <br />
          <span className="text-muted-foreground">results from AI.</span>
          <br />
          <span className="text-primary">Fix that.</span>
        </h1>

        {/* Category line */}
        <p className="text-base md:text-lg font-semibold mb-6">
          LIZA OS: The <span className="text-primary">management layer</span> for AI-powered teams.
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