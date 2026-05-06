import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Link } from "react-router-dom";
import {
  ArrowRight, Shield, Rocket, FileCheck, CheckCircle2,
  Microscope, Cpu, Satellite, Factory, Globe, Users,
  BookOpen, Eye, RefreshCw, Zap, AlertTriangle, Clock,
} from "lucide-react";
import { SectionTag, CAL_URL } from "@/components/marketing/home/shared";

/* ── Mission lifecycle ───────────────────────────────────────────────────── */

const LIFECYCLE = [
  { icon: <BookOpen className="w-5 h-5" />, label: "Concept & Mission Design", color: "200 75% 36%" },
  { icon: <Cpu className="w-5 h-5" />, label: "Phase A/B Trade Studies", color: "170 65% 32%" },
  { icon: <FileCheck className="w-5 h-5" />, label: "PDR / CDR Reviews", color: "42 85% 45%" },
  { icon: <Factory className="w-5 h-5" />, label: "AIT & Qualification", color: "12 75% 55%" },
  { icon: <Rocket className="w-5 h-5" />, label: "Launch & Commissioning", color: "280 60% 50%" },
  { icon: <Satellite className="w-5 h-5" />, label: "Operations & LEOP", color: "340 65% 47%" },
  { icon: <Globe className="w-5 h-5" />, label: "Lessons & Heritage", color: "200 35% 12%" },
];

/* ── Pain points ─────────────────────────────────────────────────────────── */

const PAIN_POINTS = [
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Heritage Walking Out",
    desc: "30–40 years of chief-engineer judgment retires with a generation of NASA, ESA, and European primes. Most of it is never codified.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Onboarding Drag",
    desc: "New mission engineers take 6–12 months to become productive. Standards, history, and prior decisions live across people and folders.",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "Lessons Don't Propagate",
    desc: "30–40% of aerospace non-conformances repeat known root causes across programs. The same mistake gets paid for twice.",
  },
];

/* ── How LIZA works ──────────────────────────────────────────────────────── */

const HOW_IT_WORKS = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    step: "01",
    title: "Capture",
    desc: "Mission heritage, prior trade studies, ECSS/AS9100 standards, and senior judgment become structured, reusable rules.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    step: "02",
    title: "Govern",
    desc: "AI outputs across trade studies, reviews, and documents are gated against your standards and program rules.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    step: "03",
    title: "Execute",
    desc: "Engineers ramp faster and run faster. New hires onboard inside the same governed standard, not around it.",
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    step: "04",
    title: "Learn",
    desc: "Every NCR, anomaly, and mission feeds new memory back. The next program starts smarter than the last.",
  },
];

/* ── Compliance / standards ──────────────────────────────────────────────── */

const COMPLIANCE = ["ECSS", "AS9100D", "NASA-STD", "MIL-STD", "ITAR-aware", "EAR-aware", "DO-178C", "DO-254"];

/* ── Adjacent verticals (space neighbours) ───────────────────────────────── */

const ADJACENT_VERTICALS = [
  {
    icon: <Rocket className="w-5 h-5" />,
    title: "NewSpace Primes & Integrators",
    desc: "Mission design, AIT, and qualification governed end-to-end for sovereign-space and commercial constellations.",
    tags: ["ECSS", "AS9100", "PDR/CDR"],
  },
  {
    icon: <Satellite className="w-5 h-5" />,
    title: "Satellite Operators",
    desc: "Fleet operations, anomaly playbooks, and procurement governance for 15-year missions. See the Satcom view.",
    tags: ["LEOP", "SLA", "ITU"],
    href: "/industries/satcom",
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "Defense & Dual-Use",
    desc: "Sovereign-capability programs with classified standards, vendor governance, and long-lived heritage requirements.",
    tags: ["MIL-STD", "DO-178C", "ITAR-aware"],
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Research Agencies & Labs",
    desc: "Mission heritage capture across multi-decade programs where chief-engineer judgment cannot retire with the team.",
    tags: ["NASA-STD", "ESA ECSS", "Heritage"],
  },
];

export default function IndustrySpacePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-16 pb-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionTag label="Space Engineering & Mission Operations" icon={<Rocket className="w-3.5 h-3.5" />} />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            The Mission Memory Layer for
            <br />
            <span className="text-primary">AI-Native Space Programs.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Mission heritage is walking out the door. AI is making it worse, not better. LIZA codifies the
            chief-engineer judgment, then governs every AI output against it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/space"
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
              Book a discovery call
            </a>
          </div>
        </div>
      </section>

      {/* Lifecycle visual */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-black tracking-[0.2em] uppercase text-center mb-6 text-primary">
            The Mission Lifecycle
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
            LIZA governs AI execution across every stage, from concept to lessons-learned.
          </p>
        </div>
      </section>

      {/* Pain points */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            Where AI breaks space programs without governance
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
            How LIZA governs AI across the mission lifecycle
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            The same four-step system of reasoning, built for ECSS, AS9100, and program-specific standards.
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
              Designed for aerospace standards, not certified
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              LIZA is architected around ECSS, AS9100, and NASA/ESA program standards. Your validated
              environment stays yours. LIZA governs the AI layer on top.
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
            One pattern, many programs
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            Wherever heritage knowledge meets long-lived programs, LIZA governs the AI in between. Builders,
            operators, and dual-use programs run on the same memory layer.
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
            Two doors into the Mission Memory Layer
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Option A — come on board as a customer with a 30-day pilot on a single mission workflow.
            Option B — co-invest in the category and help define the European reference architecture.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/space"
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