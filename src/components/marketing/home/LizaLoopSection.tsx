import { useState } from "react";
import { Link } from "react-router-dom";
import { Layers, ArrowRight, Shield, Cpu, Brain, BarChart3 } from "lucide-react";
import { CAL_URL } from "./shared";
import { SectionTag } from "./shared";

const STEPS = [
  {
    key: "capture",
    tag: "Capture",
    icon: <Brain className="w-4 h-4" />,
    headline: "Turn expertise into executable knowledge.",
    line: "Your team's domain knowledge — playbooks, decision logic, compliance rules, tribal knowledge — gets extracted and structured into governed capabilities. Not filed. Executable.",
    before: "Expertise lives in people's heads and static documents nobody opens",
    after: "Every piece of domain knowledge becomes a governed, executable capability",
  },
  {
    key: "govern",
    tag: "Govern",
    icon: <Shield className="w-4 h-4" />,
    headline: "Standards enforced in every workflow. Every department.",
    line: "Capabilities carry governance with them — quality gates, compliance checks, approval flows. No more hoping teams follow the SOP. The SOP is the execution.",
    before: "Standards exist on paper. Execution varies by team, by person, by day",
    after: "Governance is embedded in the capability itself — consistent by design",
  },
  {
    key: "execute",
    tag: "Execute",
    icon: <Cpu className="w-4 h-4" />,
    headline: "Humans and AI execute together. Departments stay autonomous.",
    line: "Each team composes the capabilities they need into their workflows. No central bottleneck. Same standards, independent execution. The Head of AI becomes a strategist, not a firefighter.",
    before: "Central AI team is the bottleneck. Departments wait or go rogue",
    after: "Governed autonomy — every team executes independently, within shared standards",
  },
  {
    key: "compound",
    tag: "Compound",
    icon: <BarChart3 className="w-4 h-4" />,
    headline: "What works gets better. Automatically.",
    line: "Every execution feeds back into the knowledge base. What Sales discovers upgrades Marketing's capabilities. What one engagement teaches compounds into the next. Adoption becomes measurable.",
    before: "Great insights discovered Tuesday are forgotten by Thursday",
    after: "Cross-department learning loops. Measurable adoption. Compounding returns",
  },
];

export function LizaLoopSection() {
  return (
    <section id="liza-loop" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="How it works" icon={<Layers className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Capture. Govern. Execute. Compound.
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Four steps. One loop. Your organization's expertise becomes self-improving infrastructure.
          </p>
        </div>

        <div className="space-y-12">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className="flex flex-col md:flex-row gap-6 items-start rounded-xl border p-6 md:p-8"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
            >
              {/* Step indicator */}
              <div className="flex items-center gap-3 md:flex-col md:items-center md:w-20 shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black"
                  style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
                >
                  {i + 1}
                </div>
                <span className="text-xs font-black tracking-[0.15em] uppercase text-primary">{s.tag}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: "hsl(var(--primary))" }}>{s.icon}</span>
                  <h3 className="text-lg font-bold text-foreground">{s.headline}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.line}</p>

                <div
                  className="rounded-lg border px-4 py-2.5 space-y-0.5"
                  style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
                >
                  <p className="text-xs text-muted-foreground line-through decoration-1">{s.before}</p>
                  <p className="text-xs font-semibold" style={{ color: "hsl(var(--success))" }}>→ {s.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mid-page CTA — Diagnostic (lower commitment) */}
        <div className="mt-14 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            How ready is your organization? Find out in 90 seconds.
          </p>
          <Link
            to="/diagnostic"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 24px -4px hsl(var(--primary) / 0.3)",
            }}
          >
            Take the 90s Diagnostic <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
