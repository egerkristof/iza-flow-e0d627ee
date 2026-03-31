import { Link } from "react-router-dom";
import { ArrowRight, Brain, Layers, Zap } from "lucide-react";
import { CAL_URL } from "./shared";

const PILLARS = [
  {
    icon: <Brain className="w-4 h-4" />,
    title: "Expertise becomes infrastructure",
    desc: "Your standards, SOPs, and senior judgment become governed capabilities — not static docs nobody opens.",
  },
  {
    icon: <Layers className="w-4 h-4" />,
    title: "Every workflow compounds",
    desc: "What one team learns feeds back into the system. Knowledge accumulates across departments, not just individuals.",
  },
  {
    icon: <Zap className="w-4 h-4" />,
    title: "Departments become self-sufficient",
    desc: "No central bottleneck. Each team operates with governed autonomy — same standards, independent execution.",
  },
];

const PROOF_POINTS = [
  "15 years building execution infrastructure",
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
          Make every team execute
          <br />
          <span className="text-primary">like your best team.</span>
        </h1>

        <p className="text-lg md:text-xl font-semibold mb-6 text-muted-foreground max-w-2xl mx-auto">
          The governance layer for AI-native organizations.
        </p>

        <p className="text-sm md:text-base mb-8 text-muted-foreground/80 max-w-xl mx-auto leading-relaxed">
          LIZA OS turns your domain expertise into governed, modular capabilities
          that scale across departments — without a central bottleneck.
          Every workflow compounds. Every team stays aligned.
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

        {/* Value pillars — integrated into hero */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          {PILLARS.map((p) => (
            <div key={p.title}>
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5"
                style={{
                  background: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                }}
              >
                {p.icon}
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
