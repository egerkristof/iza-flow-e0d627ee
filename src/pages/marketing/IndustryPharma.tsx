import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Link } from "react-router-dom";
import {
  ArrowRight, Shield, Pill, FileCheck, Activity, CheckCircle2,
  Microscope, FlaskConical, Truck, Factory, HeartPulse, Globe,
  BookOpen, Eye, RefreshCw, Zap, AlertTriangle, Clock,
  Beaker, Apple, Stethoscope
} from "lucide-react";
import { SectionTag, CAL_URL } from "@/components/marketing/home/shared";

/* ── Lifecycle stages ────────────────────────────────────────────────────── */

const LIFECYCLE = [
  { icon: <Microscope className="w-5 h-5" />, label: "Discovery & R&D", color: "200 75% 36%" },
  { icon: <FlaskConical className="w-5 h-5" />, label: "Clinical Trials", color: "170 65% 32%" },
  { icon: <FileCheck className="w-5 h-5" />, label: "Regulatory Submission", color: "42 85% 45%" },
  { icon: <Factory className="w-5 h-5" />, label: "Manufacturing & QA", color: "12 75% 55%" },
  { icon: <Truck className="w-5 h-5" />, label: "Supply & Distribution", color: "280 60% 50%" },
  { icon: <HeartPulse className="w-5 h-5" />, label: "Pharmacovigilance", color: "340 65% 47%" },
  { icon: <Globe className="w-5 h-5" />, label: "Post-Market Surveillance", color: "200 35% 12%" },
];

/* ── Pain points ─────────────────────────────────────────────────────────── */

const PAIN_POINTS = [
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "The Judgment Gap",
    desc: "AI drafts documents fast, but without your SOPs and quality standards injected, outputs vary wildly between teams.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Audit Readiness is Manual",
    desc: "Preparing for audits still takes weeks of cross-referencing documents, chasing sign-offs, and compiling evidence binders.",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "No Visibility Across Teams",
    desc: "Leaders can't see which teams follow standards and which drift until an observation is raised.",
  },
];

/* ── How LIZA works ──────────────────────────────────────────────────────── */

const HOW_IT_WORKS = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    step: "01",
    title: "Capture",
    desc: "SOPs, quality standards, and tribal knowledge become structured, reusable context. Not static PDFs.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    step: "02",
    title: "Govern",
    desc: "Context is organised into governed bundles scoped to roles, teams, and GxP processes.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    step: "03",
    title: "Execute",
    desc: "AI-assisted workflows run at machine speed with quality gates ensuring human review at every critical step.",
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    step: "04",
    title: "Learn",
    desc: "Exceptions, feedback, and successful patterns feed back into the knowledge base automatically.",
  },
];

/* ── Compliance badges ───────────────────────────────────────────────────── */

const COMPLIANCE = ["GAMP 5 Category 1", "21 CFR Part 11", "Annex 11", "ALCOA+ Principles", "EU GMP", "ICH Q10", "ISO 17025", "GLP"];

/* ── Adjacent verticals ──────────────────────────────────────────────────── */

const ADJACENT_VERTICALS = [
  {
    icon: <Pill className="w-5 h-5" />,
    title: "Pharma & Biotech",
    desc: "Medicine lifecycle from discovery through pharmacovigilance. GMP, GCP, GVP compliance.",
    tags: ["GMP", "21 CFR Part 11", "GAMP 5"],
  },
  {
    icon: <Apple className="w-5 h-5" />,
    title: "Food Safety & Consumer Health",
    desc: "Quality assurance across manufacturing, testing, and supply chain. HACCP and GMP governed.",
    tags: ["GMP", "ISO 22000", "HACCP"],
  },
  {
    icon: <FlaskConical className="w-5 h-5" />,
    title: "Lab Governance & Testing",
    desc: "Method validation, CAPA workflows, and accreditation readiness for analytical and clinical labs.",
    tags: ["ISO 17025", "GLP", "LIMS"],
  },
  {
    icon: <Stethoscope className="w-5 h-5" />,
    title: "Medical Devices",
    desc: "Design controls, risk management, and post-market surveillance governed by quality systems.",
    tags: ["ISO 13485", "FDA QSR", "MDR"],
  },
];

export default function IndustryPharmaPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-16 pb-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionTag label="Regulated Science & Manufacturing" icon={<Pill className="w-3.5 h-3.5" />} />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            The Operating System for
            <br />
            <span className="text-primary">Regulated Lifecycle Management.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Whether it's pharma, food safety, or lab governance — your teams keep their expertise. 
            AI gives them speed. LIZA makes sure nothing falls through the cracks.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              Book a Discovery Call <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/diagnostic"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Take the Diagnostic
            </Link>
          </div>
        </div>
      </section>

      {/* Lifecycle visual */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-black tracking-[0.2em] uppercase text-center mb-6 text-primary">
            The Regulated Product Lifecycle
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {LIFECYCLE.map((stage, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm"
                style={{
                  borderColor: "hsl(var(--border))",
                  background: "hsl(var(--card))",
                }}
              >
                <span style={{ color: `hsl(${stage.color})` }}>{stage.icon}</span>
                <span className="font-medium text-foreground">{stage.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            LIZA governs AI execution across every stage — pharma, food safety, clinical labs, and beyond.
          </p>
        </div>
      </section>

      {/* Pain points */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            Where AI breaks regulated operations without governance
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
            How LIZA governs AI across regulated lifecycles
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            The same four-step system of reasoning — built for GxP, ISO, and GLP compliance.
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

      {/* Compliance */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="rounded-2xl border p-8"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
          >
            <Shield className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              Designed for compliance, not certified
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              LIZA is architected around regulated industry standards. Your validated environment stays yours — LIZA governs the AI layer on top.
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

      {/* The Pattern Repeats */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-foreground">
            The pattern repeats across regulated industries
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            Wherever standards meet execution, LIZA governs the AI in between. Pharma is our deepest vertical, but the lifecycle architecture is the same.
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
            Ready to govern AI across your lifecycle?
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Start with a 90-day pilot on a single process. See results before you scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              Book a Discovery Call <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/pharma-pitch"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              View the full pitch deck <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
