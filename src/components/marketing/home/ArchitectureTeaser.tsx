import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Database, Workflow, Sparkles, ScrollText, ShieldCheck, GitBranch } from "lucide-react";
import { SectionTag, GradientText } from "./shared";

const TILES = [
  {
    label: "Systems of record",
    sub: "Drive, databases, docs, email, ticketing",
    icon: <Database className="w-4 h-4" />,
  },
  {
    label: "Where work happens",
    sub: "Guided workspace, workbooks, agents",
    icon: <Workflow className="w-4 h-4" />,
  },
  {
    label: "Your AI tools",
    sub: "Copilot, Glean, Claude, vendor RAG",
    icon: <Sparkles className="w-4 h-4" />,
  },
];

const LIZA_PILLARS = [
  { icon: <ScrollText className="w-3 h-3" />, label: "Mandates & playbooks" },
  { icon: <ShieldCheck className="w-3 h-3" />, label: "Policy & guardrails" },
  { icon: <GitBranch className="w-3 h-3" />, label: "Versioned & auditable" },
];

const INDUSTRIES = [
  "Industry-agnostic",
  "Pharma & Life Sciences",
  "Financial Services",
  "AEC",
  "Regulated Manufacturing",
  "Healthcare",
  "Enterprise IT & AI",
];

export function ArchitectureTeaser() {
  const [active, setActive] = useState(0);
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <SectionTag label="Where Liza fits" />
          <h2 className="text-3xl md:text-5xl font-black leading-[1.08] tracking-tight">
            One standard.{" "}
            <GradientText>Every surface inherits it.</GradientText>
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
            Liza sits between your records, your work, and every AI tool you already use. Nothing gets ripped out.
          </p>
        </div>

        {/* Industry toggle */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-6">
          {INDUSTRIES.map((ind, i) => {
            const isActive = active === i;
            return (
              <button
                key={ind}
                type="button"
                onClick={() => setActive(i)}
                className="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all border"
                style={{
                  background: isActive ? "hsl(var(--primary))" : "hsl(var(--background))",
                  color: isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  borderColor: isActive ? "hsl(var(--primary))" : "hsl(var(--border))",
                }}
              >
                {ind}
              </button>
            );
          })}
        </div>
        <p className="text-center text-[11px] text-muted-foreground mb-5">
          Same architecture across every industry. The standard inside is yours.
        </p>

        {/* Mini teaser diagram */}
        <div className="relative max-w-3xl mx-auto rounded-2xl border p-6 md:p-8"
          style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
        >
          {/* Decision Standard core — what Liza is */}
          <div className="mb-6">
            <div
              className="mx-auto max-w-md rounded-xl px-5 py-4 text-center"
              style={{
                background: "hsl(var(--primary) / 0.08)",
                border: "1px solid hsl(var(--primary) / 0.35)",
              }}
            >
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[0.18em] uppercase mb-2"
                style={{
                  background: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                Liza · Decision Standard
              </div>
              <p className="text-[13px] font-bold text-foreground leading-snug">
                The governed core your leadership owns
              </p>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                Liza captures how your company decides and delivers work, then enforces it on every AI request.
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                {LIZA_PILLARS.map((p) => (
                  <span
                    key={p.label}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{
                      background: "hsl(var(--background))",
                      color: "hsl(var(--primary))",
                      border: "1px solid hsl(var(--primary) / 0.25)",
                    }}
                  >
                    {p.icon} {p.label}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-bold mt-4">
              Inherited by everything below
            </p>
          </div>

          {/* Three connected surfaces */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            {TILES.map((t) => (
              <div
                key={t.label}
                className="rounded-xl border p-4 text-center"
                style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                  style={{ background: "hsl(var(--primary) / 0.08)", color: "hsl(var(--primary))" }}
                >
                  {t.icon}
                </div>
                <p className="text-sm font-bold text-foreground leading-tight">{t.label}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{t.sub}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-5">
            Read in. Write back. Propagate everywhere.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/os"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Explore the full platform
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}