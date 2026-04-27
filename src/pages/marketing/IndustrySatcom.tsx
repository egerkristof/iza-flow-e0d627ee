import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Link } from "react-router-dom";
import {
  ArrowRight, Shield, Satellite, FileCheck, CheckCircle2,
  Radio, Cpu, Globe, Users, Briefcase,
  BookOpen, Eye, RefreshCw, Zap, AlertTriangle, Clock,
} from "lucide-react";
import { SectionTag, CAL_URL } from "@/components/marketing/home/shared";

/* ── Operator lifecycle ──────────────────────────────────────────────────── */

const LIFECYCLE = [
  { icon: <Briefcase className="w-5 h-5" />, label: "Procurement & Acceptance", color: "200 95% 38%" },
  { icon: <FileCheck className="w-5 h-5" />, label: "ITU Filings & Spectrum", color: "180 90% 42%" },
  { icon: <Satellite className="w-5 h-5" />, label: "Launch & LEOP", color: "42 85% 45%" },
  { icon: <Radio className="w-5 h-5" />, label: "Fleet Operations", color: "12 75% 55%" },
  { icon: <Shield className="w-5 h-5" />, label: "SLA & Service Continuity", color: "280 60% 50%" },
  { icon: <AlertTriangle className="w-5 h-5" />, label: "Anomaly Response", color: "340 65% 47%" },
  { icon: <Globe className="w-5 h-5" />, label: "EOL & Replacement", color: "200 35% 12%" },
];

/* ── Pain points ─────────────────────────────────────────────────────────── */

const PAIN_POINTS = [
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Fleet Memory at Risk",
    desc: "Operations engineers who know each satellite's quirks — its drift, its anomalies, its workarounds — retire with the bird. The next generation starts from zero.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Procurement Learning Loop",
    desc: "Replacement satellites arrive every 7–10 years. The contract managers and acceptance leads who learned the last cycle are rarely the ones running the next.",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Outage Exposure in $M / hour",
    desc: "Broadcast, government, and IFC SLAs convert anomaly response time directly into revenue and contract penalties. The playbook lives in one or two heads.",
  },
];

/* ── How LIZA works ──────────────────────────────────────────────────────── */

const HOW_IT_WORKS = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    step: "01",
    title: "Codify",
    desc: "Anomaly playbooks, SOPs, vendor SOWs, and ITU precedent become governed, reusable rules — once, then reused.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    step: "02",
    title: "Govern",
    desc: "AI outputs are gated against your operations procedures, regulatory commitments, and SLA framework.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    step: "03",
    title: "Apply",
    desc: "Ops engineers, contract managers, and analysts work inside the same governed standard — not around it.",
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    step: "04",
    title: "Learn",
    desc: "Every anomaly, procurement cycle, and regulatory filing feeds new memory back. The next satellite starts smarter.",
  },
];

/* ── Standards ───────────────────────────────────────────────────────────── */

const COMPLIANCE = ["ITU-R", "FCC Part 25", "ETSI", "ISO 27001", "ECSS-E-ST-70", "SLA frameworks", "Sovereign-comm", "Export-aware"];

/* ── Adjacent operator types ─────────────────────────────────────────────── */

const ADJACENT_VERTICALS = [
  {
    icon: <Satellite className="w-5 h-5" />,
    title: "GEO Broadcast & Connectivity",
    desc: "Long-lived GEO assets with multi-decade SLAs, where one anomaly playbook can swing quarter revenue.",
    tags: ["GEO", "Ku/Ka", "DTH"],
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "LEO / MEO Constellations",
    desc: "Hundreds of birds, automated ops, and continuous procurement cycles. Memory layer is the only way to scale judgment.",
    tags: ["LEO", "Mega-constellation", "Auto-ops"],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Sovereign / Government Satcom",
    desc: "National operators answering to defense, civil-protection, and EU sovereignty mandates. Heritage and continuity are existential.",
    tags: ["GovSat", "Sovereign", "Mission-critical"],
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "NewSpace Builders & Primes",
    desc: "The other side of procurement. See the Space-engineering view for AIT, ECSS, and chief-engineer heritage capture.",
    tags: ["ECSS", "AS9100", "AIT"],
    href: "/industries/space",
  },
];

export default function IndustrySatcomPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-16 pb-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionTag label="Satellite Operators & Fleet Operations" icon={<Satellite className="w-3.5 h-3.5" />} />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            The Operator Memory Layer for
            <br />
            <span className="text-primary">15-Year Satellite Fleets.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Operators don't build the satellite — they procure it, fly it for 15 years, and answer to regulators
            and customers the whole way. LIZA captures the fleet, procurement, and spectrum memory before it
            walks out the door.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/satcom-brief"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              Read the brief <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/satcom"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              View the full deck
            </Link>
          </div>
        </div>
      </section>

      {/* Lifecycle visual */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-black tracking-[0.2em] uppercase text-center mb-6 text-primary">
            The Operator Lifecycle
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
            From procurement to EOL — the memory layer that survives every operations and contract cycle.
          </p>
        </div>
      </section>

      {/* Pain points */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            Where AI breaks operator workflows without governance
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
            How LIZA governs AI across the operator lifecycle
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            The same four-step system of reasoning, built for ITU, FCC, and operator-specific SLA frameworks.
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
              Designed around operator and regulatory frameworks
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              LIZA is architected around ITU, FCC, ETSI, and ECSS commitments your fleet already runs against.
              Your validated environment stays yours. LIZA governs the AI layer on top.
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
            One pattern, every operator footprint
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            From GEO broadcast to LEO mega-constellations and sovereign government satcom — the memory
            layer is the same. Operators are the buyer; builders run the same loop on the other side.
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
                <div className="flex flex-wrap items-center gap-1.5">
                  {v.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md"
                      style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                    >
                      {tag}
                    </span>
                  ))}
                  {v.href && (
                    <Link
                      to={v.href}
                      className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      Explore <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
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
            Two doors into the Operator Memory Layer
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Option A — come on board as a customer with a 30-day pilot on one fleet workflow (anomaly,
            procurement, or spectrum). Option B — co-invest in the category and help define the operator
            memory standard.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/satcom"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              View the full deck <ArrowRight className="w-4 h-4" />
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