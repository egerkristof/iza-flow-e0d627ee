import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  ArrowRight, Shield, Clock, Target, CheckCircle2, FileSpreadsheet,
  Search, PenLine, LayoutTemplate, Users, TrendingUp, Zap,
  XCircle, ArrowDownRight,
} from "lucide-react";

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

function GradientText({ children }: { children: React.ReactNode }) {
  return <span className="brand-gradient-text">{children}</span>;
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-6"
      style={{ color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.25)", background: "hsl(var(--primary) / 0.06)" }}
    >
      {children}
    </p>
  );
}

/* ── Data ────────────────────────────────────────────────────────────────────── */

const PAIN_STEPS = [
  { icon: <FileSpreadsheet className="w-5 h-5" />, text: "Open Excel audit checklist" },
  { icon: <Search className="w-5 h-5" />, text: "Read question" },
  { icon: <Search className="w-5 h-5" />, text: "Search client documentation" },
  { icon: <Target className="w-5 h-5" />, text: "Find evidence" },
  { icon: <PenLine className="w-5 h-5" />, text: "Draft structured answer" },
  { icon: <LayoutTemplate className="w-5 h-5" />, text: "Repeat 500–3,800 times" },
];

const NOT_LIST = [
  "Not a GRC suite",
  "Not a vendor-side questionnaire tool",
  "Not replacing senior auditors",
  "Not replacing your existing tools or automation",
  "Not limited to one audit type",
];

const REPLACES = ["Question Search", "Document Lookup", "Answer Drafting", "Formatting & Assembly"];

const WHY_IT_MATTERS = [
  { icon: <Users className="w-5 h-5" />, text: "Reduce subcontractor dependency" },
  { icon: <TrendingUp className="w-5 h-5" />, text: "Increase audit throughput" },
  { icon: <Zap className="w-5 h-5" />, text: "Improve margin per audit" },
  { icon: <CheckCircle2 className="w-5 h-5" />, text: "Standardise first-pass quality" },
  { icon: <Clock className="w-5 h-5" />, text: "Shorten turnaround time dramatically" },
];

const DEPLOYMENT = [
  "Works with your existing Excel/spreadsheet workflow",
  "No platform migration required",
  "White-label option available",
  "Pay-per-audit packages",
];

const STEPS_TO_START = [
  { num: "1", label: "20-minute intro call", desc: "We understand your audit workflow and answer your questions." },
  { num: "2", label: "Live walkthrough", desc: "See the engine run on a real audit question set." },
  { num: "3", label: "Pilot on one real audit", desc: "Measure the time saved on your actual workload." },
];

/* ── Page ────────────────────────────────────────────────────────────────────── */

export default function AuditExecutionSolution() {
  const accentCol = "200 90% 52%";

  return (
    <MarketingLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ background: `radial-gradient(ellipse, hsl(${accentCol} / 0.07) 0%, transparent 65%)` }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-6"
            style={{ color: `hsl(${accentCol})`, borderColor: `hsl(${accentCol} / 0.25)`, background: `hsl(${accentCol} / 0.06)` }}
          >
            <Shield className="w-3.5 h-3.5" /> Ready to Deploy
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
            Reduce 18 days of audit work
            <br />
            <GradientText>to 1.5 hours.</GradientText>
          </h1>
          <p className="text-lg mb-4 max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            An AI-powered execution engine for compliance, security, and operational audits. Any question-and-evidence audit format — from ISO 27001 to SOC 2 to internal controls.
          </p>
          <p className="text-sm font-medium mb-2" style={{ color: `hsl(${accentCol})` }}>
            Proven on real cybersecurity audits with ~800 questions each.
          </p>
          <p className="text-sm font-medium mb-10" style={{ color: "hsl(var(--muted-foreground))" }}>
            Senior auditors keep judgment. AI handles the repetition.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: `0 0 32px -4px hsl(${accentCol} / 0.4)`,
              }}
            >
              Book a 20-Min Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border"
              style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
            >
              See How It Works ↓
            </a>
          </div>
        </div>
      </section>

      {/* ── Proof stats ───────────────────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "18 days", label: "Subcontractor baseline", sub: "per audit (cybersecurity)" },
            { value: "1.5 hrs", label: "AI-assisted first pass", sub: "generation time" },
            { value: "84%", label: "First-pass accuracy", sub: "vs 76% manual" },
            { value: "~800", label: "Questions per audit", sub: "proven at scale" },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl md:text-4xl font-black mb-1" style={{ color: `hsl(${accentCol})` }}>{s.value}</p>
              <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>{s.label}</p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Current Reality ────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionTag>The current reality</SectionTag>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Most audits are still <GradientText>executed manually.</GradientText>
          </h2>
          <p className="text-base mb-10 max-w-2xl" style={{ color: "hsl(var(--muted-foreground))" }}>
            Whether it's cybersecurity, compliance, or operational audits — each one follows the same punishing loop, repeated hundreds or thousands of times.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PAIN_STEPS.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border p-4"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}
                >
                  {step.icon}
                </div>
                <p className="text-sm font-medium">{step.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm italic" style={{ color: "hsl(var(--muted-foreground))" }}>
            Like searching for a needle in a haystack — every single time.
          </p>
        </div>
      </section>

      {/* ── What We Built ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-4xl mx-auto">
          <SectionTag>What we built</SectionTag>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            A focused AI execution engine <GradientText>for audit firms.</GradientText>
          </h2>
          <p className="text-base mb-10 max-w-2xl" style={{ color: "hsl(var(--muted-foreground))" }}>
            Feed it your audit question set and client evidence. Get back structured, traceable answers ready for senior review.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Input */}
            <div className="rounded-2xl border p-7" style={{ borderColor: `hsl(${accentCol} / 0.2)`, background: `hsl(${accentCol} / 0.03)` }}>
              <p className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: `hsl(${accentCol})` }}>Input</p>
              <ul className="space-y-3">
                {["Excel/Spreadsheet audit question set", "Client documentation (evidence)"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: `hsl(${accentCol})` }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Output */}
            <div className="rounded-2xl border p-7" style={{ borderColor: "hsl(var(--success) / 0.2)", background: "hsl(var(--success) / 0.03)" }}>
              <p className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: "hsl(var(--success))" }}>Output</p>
              <ul className="space-y-3">
                {[
                  "Structured answers per question",
                  "Evidence traceability",
                  "Confidence scoring",
                  "Quality assurance validation pass",
                  "Completed audit-ready Excel",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--success))" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-sm font-semibold text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
            Senior auditors review and sign off. The judgment stays human.
          </p>
        </div>
      </section>

      {/* ── What This Is Not ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <SectionTag>What this is not</SectionTag>
              <h2 className="text-2xl md:text-3xl font-black mb-6">Clear boundaries.</h2>
              <ul className="space-y-3">
                {NOT_LIST.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--destructive))" }} />
                    <span style={{ color: "hsl(var(--muted-foreground))" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <SectionTag>What it replaces</SectionTag>
              <h2 className="text-2xl md:text-3xl font-black mb-6">The mechanical layer.</h2>
              <div className="grid grid-cols-2 gap-3">
                {REPLACES.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border p-4 text-center text-sm font-medium"
                    style={{ borderColor: `hsl(${accentCol} / 0.2)`, background: `hsl(${accentCol} / 0.05)`, color: `hsl(${accentCol})` }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                The senior keeps judgment. AI handles the repetition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why It Matters ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-4xl mx-auto text-center">
          <SectionTag>Why it matters</SectionTag>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            One senior can supervise <GradientText>multiple audits in parallel.</GradientText>
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10 max-w-3xl mx-auto">
            {WHY_IT_MATTERS.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border p-4 text-left"
                style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `hsl(${accentCol} / 0.12)`, color: `hsl(${accentCol})` }}
                >
                  {item.icon}
                </div>
                <p className="text-sm font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deployment Model ──────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <SectionTag>Deployment model</SectionTag>
              <h2 className="text-2xl md:text-3xl font-black mb-6">
                Zero friction. <GradientText>Immediate value.</GradientText>
              </h2>
              <ul className="space-y-3">
                {DEPLOYMENT.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--success))" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border p-8" style={{ borderColor: `hsl(${accentCol} / 0.2)`, background: `hsl(${accentCol} / 0.03)` }}>
              <p className="text-xs font-black tracking-widest uppercase mb-6" style={{ color: `hsl(${accentCol})` }}>
                Get started in 3 steps
              </p>
              <div className="space-y-6">
                {STEPS_TO_START.map((step) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black"
                      style={{ background: `hsl(${accentCol} / 0.15)`, color: `hsl(${accentCol})` }}
                    >
                      {step.num}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{step.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Measure the time saved.
          </h2>
          <p className="text-base mb-10" style={{ color: "hsl(var(--muted-foreground))" }}>
            Pilot on one real audit. See the results before you commit.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: `0 0 32px -4px hsl(${accentCol} / 0.4)`,
              }}
            >
              Book a 20-Min Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/use-cases"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border"
              style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
            >
              ← Back to Use Cases
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
