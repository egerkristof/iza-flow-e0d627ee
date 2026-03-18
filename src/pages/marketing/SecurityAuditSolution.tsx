import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  ArrowRight, Shield, Clock, Target, CheckCircle2, FileSpreadsheet,
  Search, PenLine, LayoutTemplate, Users, TrendingUp, Zap,
  XCircle, ArrowDownRight, BookOpen, Lightbulb, RefreshCw, DollarSign, Brain, LineChart,
  AlertTriangle, MessageSquare,
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
  "Not a ChatGPT wrapper. Purpose-built audit architecture",
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
            Not another ChatGPT wrapper. A purpose-built execution engine for compliance, security, and operational audits. Evidence traceability, structured output, and quality validation built in.
          </p>
          <p className="text-sm font-medium mb-2" style={{ color: `hsl(${accentCol})` }}>
            Proven on real cybersecurity audits with ~800 questions each.
          </p>
          <p className="text-sm font-medium mb-10" style={{ color: "hsl(var(--muted-foreground))" }}>
            Senior auditors keep judgment. AI handles the repetition, reliably.
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
            { value: "84%", label: "First-pass accuracy", sub: "vs ~40% with generic AI" },
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
            AI hasn't solved audits. <GradientText>It's just shifted the bottleneck.</GradientText>
          </h2>
          <p className="text-base mb-6 max-w-2xl" style={{ color: "hsl(var(--muted-foreground))" }}>
            Yes, teams are experimenting with ChatGPT and Copilot. But generic AI creates new problems: hallucinated evidence, no traceability, inconsistent formatting, and zero institutional memory. The "AI-assisted" workflow still looks like this:
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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

          {/* Generic AI limitations callout */}
          <div
            className="rounded-2xl border p-6 max-w-2xl"
            style={{ borderColor: "hsl(var(--warning, 45 93% 47%) / 0.3)", background: "hsl(var(--warning, 45 93% 47%) / 0.05)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4" style={{ color: "hsl(45 93% 47%)" }} />
              <p className="text-xs font-black tracking-widest uppercase" style={{ color: "hsl(45 93% 47%)" }}>
                The ChatGPT experiment
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: <MessageSquare className="w-4 h-4" />, text: "Copy-paste questions one at a time" },
                { icon: <AlertTriangle className="w-4 h-4" />, text: "Hallucinated or unverifiable evidence" },
                { icon: <Search className="w-4 h-4" />, text: "No traceability back to source documents" },
                { icon: <RefreshCw className="w-4 h-4" />, text: "Every session starts from zero. Nothing compounds" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  <span className="flex-shrink-0 mt-0.5" style={{ color: "hsl(45 93% 47%)" }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3 italic" style={{ color: "hsl(var(--muted-foreground))" }}>
              Faster than fully manual, but still unscalable. Introduces new risk.
            </p>
          </div>
        </div>
      </section>

      {/* ── What We Built ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-4xl mx-auto">
          <SectionTag>What we built</SectionTag>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Not generic AI. <GradientText>Purpose-built for audit execution.</GradientText>
          </h2>
          <p className="text-base mb-10 max-w-2xl" style={{ color: "hsl(var(--muted-foreground))" }}>
            Feed it your audit question set and client evidence. Get back structured, traceable, verifiable answers — not ChatGPT guesses — ready for senior review.
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
          <div className="flex flex-wrap justify-center gap-4 mt-10 max-w-3xl mx-auto">
            {WHY_IT_MATTERS.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border p-4 text-left w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.75rem)]"
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

      {/* ── Beyond the Audit — Revenue Flywheel ──────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionTag>Beyond the audit</SectionTag>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Your audits are already generating advisory revenue.
            <br />
            <GradientText>You just can't see it yet.</GradientText>
          </h2>
          <p className="text-base mb-12 max-w-2xl" style={{ color: "hsl(var(--muted-foreground))" }}>
            Every audit produces structured intelligence about client risk posture, operational gaps, and control maturity. Today, that insight lives in your auditors' heads and disappears when they move to the next engagement.
          </p>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: <Zap className="w-5 h-5" />, step: "01", title: "Execute", desc: "Complete audits 10× faster. The engine handles the mechanical layer — question search, evidence matching, answer drafting." },
              { icon: <Brain className="w-5 h-5" />, step: "02", title: "Capture", desc: "Every audit surfaces control gaps, client patterns, recurring weaknesses. This intelligence is currently lost in spreadsheets." },
              { icon: <DollarSign className="w-5 h-5" />, step: "03", title: "Advise", desc: "Findings become data-driven advisory proposals. \"We found 14 control gaps across your last 3 audits — here's a remediation programme.\"" },
              { icon: <RefreshCw className="w-5 h-5" />, step: "04", title: "Compound", desc: "Past audits inform future ones. New auditors inherit institutional memory. Cross-client patterns surface emerging risks." },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border p-6 relative"
                style={{ borderColor: `hsl(${accentCol} / 0.15)`, background: `hsl(${accentCol} / 0.03)` }}
              >
                <p className="text-[10px] font-black tracking-widest uppercase mb-3" style={{ color: `hsl(${accentCol} / 0.5)` }}>{item.step}</p>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `hsl(${accentCol} / 0.12)`, color: `hsl(${accentCol})` }}
                >
                  {item.icon}
                </div>
                <p className="text-sm font-bold mb-2">{item.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm font-semibold text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
            Your advisory pipeline becomes evidence-based, not relationship-dependent.
          </p>
        </div>
      </section>

      {/* ── Knowledge That Pays — Audit-to-Advisory Bridge ────────────────────── */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-4xl mx-auto">
          <SectionTag>Knowledge that pays</SectionTag>
          <h2 className="text-3xl md:text-4xl font-black mb-10">
            From lost insight to <GradientText>advisory revenue.</GradientText>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left — what's lost */}
            <div className="rounded-2xl border p-7" style={{ borderColor: "hsl(var(--destructive) / 0.2)", background: "hsl(var(--destructive) / 0.03)" }}>
              <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: "hsl(var(--destructive))" }}>
                What auditors learn but never capture
              </p>
              <ul className="space-y-3">
                {[
                  "Client-specific risk patterns",
                  "Recurring control failures across engagements",
                  "Evidence quality signals",
                  "Industry-specific gap clusters",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--destructive))" }} />
                    <span style={{ color: "hsl(var(--muted-foreground))" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Right — what it becomes */}
            <div className="rounded-2xl border p-7" style={{ borderColor: `hsl(${accentCol} / 0.2)`, background: `hsl(${accentCol} / 0.03)` }}>
              <p className="text-xs font-black tracking-widest uppercase mb-5" style={{ color: `hsl(${accentCol})` }}>
                What this becomes with LIZA
              </p>
              <ul className="space-y-3">
                {[
                  "Data-driven remediation proposals",
                  "Proactive risk briefings for clients",
                  "Cross-client benchmarking insights",
                  "Advisory engagement blueprints",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: `hsl(${accentCol})` }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Becomes Possible — Vision ────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionTag>What becomes possible</SectionTag>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            The audit firm of <GradientText>tomorrow.</GradientText>
          </h2>
          <p className="text-base mb-12 max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            As engagement data compounds, entirely new capabilities emerge.
          </p>
          <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto text-left">
            {[
              { icon: <LineChart className="w-5 h-5" />, title: "Predictive Scoping", desc: "The system suggests which controls are likely to fail based on client profile and historical patterns." },
              { icon: <BookOpen className="w-5 h-5" />, title: "Automated Remediation Tracking", desc: "Audit findings auto-generate follow-up tasks with full context — assigned, tracked, and closed." },
              { icon: <Lightbulb className="w-5 h-5" />, title: "Cross-Client Intelligence", desc: "Anonymised patterns across your client base surface emerging risks before they become findings." },
              { icon: <Users className="w-5 h-5" />, title: "New Auditor Acceleration", desc: "Junior staff execute at near-senior quality from day one, backed by institutional knowledge." },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 text-left"
                style={{ border: "1.5px dashed hsl(var(--border))", background: "hsl(var(--card) / 0.5)" }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `hsl(${accentCol} / 0.08)`, color: `hsl(${accentCol} / 0.7)` }}
                >
                  {item.icon}
                </div>
                <p className="text-sm font-bold mb-1">{item.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{item.desc}</p>
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
