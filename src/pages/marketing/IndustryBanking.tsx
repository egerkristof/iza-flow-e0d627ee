import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Link } from "react-router-dom";
import {
  ArrowRight, Shield, Landmark, FileCheck, CheckCircle2,
  Megaphone, Users, ScrollText, BarChart3, Network,
  BookOpen, Eye, RefreshCw, Zap, AlertTriangle, Clock,
  Banknote, ShieldCheck,
} from "lucide-react";
import { SectionTag, CAL_URL } from "@/components/marketing/home/shared";

/* ── Retail-banking lifecycle ────────────────────────────────────────────── */

const LIFECYCLE = [
  { icon: <ScrollText className="w-5 h-5" />, label: "Policy & Regulation", color: "200 75% 36%" },
  { icon: <Megaphone className="w-5 h-5" />, label: "Brand & Campaign", color: "330 70% 55%" },
  { icon: <Users className="w-5 h-5" />, label: "Onboarding & KYC", color: "170 65% 32%" },
  { icon: <Banknote className="w-5 h-5" />, label: "Underwriting & Decisioning", color: "42 85% 45%" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Servicing & CX", color: "280 60% 50%" },
  { icon: <FileCheck className="w-5 h-5" />, label: "Complaints & Conduct", color: "12 75% 55%" },
  { icon: <ShieldCheck className="w-5 h-5" />, label: "Audit & Reporting", color: "200 35% 12%" },
];

/* ── Pain points (entry wedge: marketing / retail banking) ───────────────── */

const PAIN_POINTS = [
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Every campaign re-litigates compliance",
    desc: "Marketing, legal, compliance, and product each hold a piece of the rulebook. Every campaign brief, landing page, and email goes through the same back-and-forth from scratch.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Brand drifts across products and countries",
    desc: "Tone, claims, segment messaging, and disclaimers vary by team and jurisdiction. Generic AI copilots speed it up — and amplify the drift.",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "No memory of what worked, or why",
    desc: "The judgment behind a winning campaign — segment, channel, hook, regulator-safe wording — lives in slides and people's heads. The next campaign starts from zero.",
  },
];

/* ── How LIZA works ──────────────────────────────────────────────────────── */

const HOW_IT_WORKS = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    step: "01",
    title: "Capture",
    desc: "Brand voice, product rules, regulator wording, segment logic, and prior approvals become structured, reusable context — not 200-page PDFs.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    step: "02",
    title: "Govern",
    desc: "Every AI-generated brief, headline, email, and landing page is gated against the full marketing + compliance + product context.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    step: "03",
    title: "Execute",
    desc: "Marketing, legal, and compliance work inside the same governed standard. Campaign cycle time collapses, drift stops at the source.",
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    step: "04",
    title: "Learn",
    desc: "Every approval, exception, and winning variant feeds back. The next campaign — and the next country rollout — starts smarter than the last.",
  },
];

/* ── Standards ───────────────────────────────────────────────────────────── */

const COMPLIANCE = [
  "EBA Marketing Guidelines", "MiFID II", "Consumer Duty (FCA)",
  "MNB / NBR / local regulators", "DORA", "AML6 / KYC",
  "GDPR", "ISO 27001",
];

/* ── Adjacent ────────────────────────────────────────────────────────────── */

const ADJACENT_VERTICALS = [
  {
    icon: <Megaphone className="w-5 h-5" />,
    title: "Marketing & Brand (entry wedge)",
    desc: "Campaign briefs, landing pages, email, in-app — every output gated against brand voice, product rules, and regulator wording.",
    tags: ["Brand", "Campaign Ops", "Compliance Review"],
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Onboarding, KYC & Complaints",
    desc: "Adverse-media adjudication, complaints triage, conduct-rule narratives — judgment-heavy work where copilots need full policy context.",
    tags: ["KYC", "AML", "Conduct"],
  },
  {
    icon: <Banknote className="w-5 h-5" />,
    title: "Credit, Risk & Model Governance",
    desc: "Credit memos, ICAAP narratives, model risk documentation under EBA / SR 11-7. Same governed-AI pattern, regulated workflow.",
    tags: ["Credit Memo", "Model Risk", "ICAAP"],
  },
  {
    icon: <Network className="w-5 h-5" />,
    title: "Multi-jurisdiction Group Functions",
    desc: "Group standards that propagate across CEE country units instead of being re-learned in each market. One memory layer, many regulators.",
    tags: ["Group", "CEE", "Localisation"],
  },
];

export default function IndustryBankingPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-16 pb-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionTag label="Retail Banking & Financial Services" icon={<Landmark className="w-3.5 h-3.5" />} />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            The Brand &amp; Compliance Memory Layer for
            <br />
            <span className="text-primary">AI-Native Retail Banking.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Brand voice, product rules, regulator wording, and segment judgment live in different
            teams and PDFs. Generic AI copilots speed up the drift. LIZA codifies the bank's
            judgment, then governs every AI output against it — starting with marketing.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/sales-banking"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              View the Banking deck <ArrowRight className="w-4 h-4" />
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
            The Retail Banking Lifecycle
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
            We start at Brand &amp; Campaign — the highest-volume, highest-friction AI surface — and
            extend the same memory layer across the lifecycle.
          </p>
        </div>
      </section>

      {/* Pain points */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            Where AI breaks retail-bank marketing without governance
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
            How LIZA governs AI across the bank
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            The same four-step system of reasoning, built for EBA, DORA, Consumer Duty, and
            local-regulator nuance across CEE.
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
              Designed around bank-grade standards and regulators
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              LIZA is architected around EBA guidelines, Consumer Duty, MiFID II, AML6, and
              local-regulator nuance. Your core banking, GRC, and Copilot stay yours. LIZA governs
              the AI layer on top.
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
            Start with marketing. Extend across the bank.
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            Marketing is the wedge — high volume, fast feedback, low risk to pilot. The same memory
            layer then extends to onboarding, complaints, credit, and group-level governance.
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
            Two doors into the Banking Memory Layer
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Option A — come on board as a customer with a 30-day pilot on one marketing workflow
            (campaign brief, landing page, or email under regulator review). Option B — co-invest in
            the category and help define the CEE banking reference architecture with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/sales-banking"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              View the Banking deck <ArrowRight className="w-4 h-4" />
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