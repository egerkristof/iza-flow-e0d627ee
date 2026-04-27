import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Link } from "react-router-dom";
import {
  ArrowRight, Shield, Building2, FileCheck, CheckCircle2,
  HardHat, Ruler, Hammer, Layers, Network, Briefcase,
  BookOpen, Eye, RefreshCw, Zap, AlertTriangle, Clock, FileText,
} from "lucide-react";
import { SectionTag, CAL_URL } from "@/components/marketing/home/shared";

/* ── AEC project lifecycle ───────────────────────────────────────────────── */

const LIFECYCLE = [
  { icon: <BookOpen className="w-5 h-5" />, label: "Pre-Design & Owner Standards", color: "200 75% 36%" },
  { icon: <Ruler className="w-5 h-5" />, label: "Design & BIM", color: "170 65% 32%" },
  { icon: <FileText className="w-5 h-5" />, label: "Specs & Submittals", color: "42 85% 45%" },
  { icon: <FileCheck className="w-5 h-5" />, label: "RFIs & Reviews", color: "12 75% 55%" },
  { icon: <Hammer className="w-5 h-5" />, label: "Construction & Field", color: "280 60% 50%" },
  { icon: <Layers className="w-5 h-5" />, label: "Closeout & Handover", color: "340 65% 47%" },
  { icon: <Building2 className="w-5 h-5" />, label: "Operations & O&M", color: "200 35% 12%" },
];

/* ── Pain points ─────────────────────────────────────────────────────────── */

const PAIN_POINTS = [
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Context Lives Across Silos",
    desc: "Specs, submittals, RFIs, drawings, and owner standards each live in their own system. AI without all of them produces plausible answers that still need rework.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Rework, Rework, Rework",
    desc: "U.S. construction loses tens of billions a year to rework, conflict resolution, and searching for project data (FMI / PlanGrid). The same answer gets paid for twice.",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Owner Standards Drift",
    desc: "Owner-specific standards, addenda, and field decisions don't propagate. Each project re-learns what the last one already knew.",
  },
];

/* ── How LIZA works ──────────────────────────────────────────────────────── */

const HOW_IT_WORKS = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    step: "01",
    title: "Capture",
    desc: "Owner standards, prior addenda, RFI precedent, and submittal logic become structured, reusable rules — once, then reused across projects.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    step: "02",
    title: "Govern",
    desc: "AI outputs across RFIs, spec reviews, submittals, and handover are gated against the full project context.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    step: "03",
    title: "Execute",
    desc: "PMs, estimators, BIM leads, and principals work inside the same governed standard — not around it.",
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    step: "04",
    title: "Learn",
    desc: "Every RFI, submittal, and field decision feeds new memory back. The next project starts smarter than the last.",
  },
];

/* ── Standards ───────────────────────────────────────────────────────────── */

const COMPLIANCE = ["ISO 19650", "NBS / MasterFormat", "BIM Level 2/3", "AHJ-aware", "Owner standards", "Submittal protocols", "ISO 9001", "AIA / RIBA stages"];

/* ── Adjacent ────────────────────────────────────────────────────────────── */

const ADJACENT_VERTICALS = [
  {
    icon: <Building2 className="w-5 h-5" />,
    title: "General Contractors",
    desc: "RFI, submittal, and closeout governance across multi-project portfolios. Owner standards never drift.",
    tags: ["RFI", "Submittals", "Closeout"],
  },
  {
    icon: <Ruler className="w-5 h-5" />,
    title: "Architecture & Engineering",
    desc: "Design judgment, code interpretation, and prior-project precedent encoded into governed rules across studios.",
    tags: ["BIM", "Design Review", "Code"],
  },
  {
    icon: <HardHat className="w-5 h-5" />,
    title: "Owners & Developers",
    desc: "Portfolio-level standards that propagate from one project to the next, with full traceability across the supply chain.",
    tags: ["Owner Std", "Portfolio", "FM"],
  },
  {
    icon: <Network className="w-5 h-5" />,
    title: "AEC Software & BIM Platforms",
    desc: "Partner with the platforms your teams already use. LIZA is the governance layer on top of BIM and document systems.",
    tags: ["BIM", "CDE", "Integration"],
  },
];

export default function IndustryAECPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-16 pb-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionTag label="Architecture, Engineering & Construction" icon={<Building2 className="w-3.5 h-3.5" />} />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            The Project Memory Layer for
            <br />
            <span className="text-primary">AI-Native Construction.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Specs, submittals, RFIs, drawings, and owner standards live in different systems. AI without
            full project context just makes rework faster. LIZA codifies the project knowledge, then
            governs every AI output against it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/investor-aec"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              View the AEC deck <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Book a discovery call
            </a>
          </div>
        </div>
      </section>

      {/* Lifecycle */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-black tracking-[0.2em] uppercase text-center mb-6 text-primary">
            The Built-Environment Lifecycle
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {LIFECYCLE.map((stage, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <span style={{ color: `hsl(${stage.color})` }}>{stage.icon}</span>
                <span className="font-medium text-foreground">{stage.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            From owner intent through O&M — the memory layer that survives every handover.
          </p>
        </div>
      </section>

      {/* Pain points */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            Where AI breaks AEC workflows without governance
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl border p-6"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}
                >
                  {p.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How LIZA works */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-foreground">
            How LIZA governs AI across project delivery
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            The same four-step system of reasoning, built for ISO 19650, BIM workflows, and owner-specific standards.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border p-6 relative"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <span className="text-[10px] font-black tracking-widest text-primary mb-3 block">
                  STEP {step.step}
                </span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                  {step.icon}
                </div>
                <h3 className="font-bold text-foreground mb-1.5">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="rounded-2xl border p-8"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
          >
            <Shield className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              Designed around AEC standards and owner protocols
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              LIZA is architected around ISO 19650, BIM workflows, and owner-specific submittal and RFI
              protocols. Your CDE and BIM platforms stay yours. LIZA governs the AI layer on top.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {COMPLIANCE.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
                  style={{ background: "hsl(var(--primary) / 0.08)", color: "hsl(var(--primary))" }}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Adjacent */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-foreground">
            One pattern, every AEC role
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            From general contractors to design studios to owners and BIM platforms — the project memory
            layer is the same.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {ADJACENT_VERTICALS.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border p-6"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                  >
                    {v.icon}
                  </div>
                  <h3 className="font-bold text-foreground">{v.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{v.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {v.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                      style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            Two doors into the AEC Memory Layer
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Option A — come on board as a customer with a 30-day pilot on one project workflow (RFI,
            submittal, or handover). Option B — co-invest in the category and help define the AEC
            reference architecture with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/investor-aec"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              View the AEC deck <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Book a discovery call <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}