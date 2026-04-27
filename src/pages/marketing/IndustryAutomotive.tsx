import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Link } from "react-router-dom";
import {
  ArrowRight, Shield, Car, FileCheck, CheckCircle2,
  Cpu, Users, ScrollText, BarChart3, Network,
  BookOpen, Eye, RefreshCw, Zap, AlertTriangle, Clock,
  Wrench, ShieldCheck, Cog,
} from "lucide-react";
import { SectionTag, CAL_URL } from "@/components/marketing/home/shared";

/* ── Automotive R&D lifecycle ────────────────────────────────────────────── */

const LIFECYCLE = [
  { icon: <ScrollText className="w-5 h-5" />, label: "Concept & HARA", color: "200 75% 36%" },
  { icon: <BookOpen className="w-5 h-5" />, label: "Requirements", color: "330 70% 55%" },
  { icon: <Network className="w-5 h-5" />, label: "Architecture", color: "170 65% 32%" },
  { icon: <Cog className="w-5 h-5" />, label: "Design & Implementation", color: "42 85% 45%" },
  { icon: <BarChart3 className="w-5 h-5" />, label: "Verification & Validation", color: "280 60% 50%" },
  { icon: <FileCheck className="w-5 h-5" />, label: "Safety Case & Release", color: "12 75% 55%" },
  { icon: <ShieldCheck className="w-5 h-5" />, label: "SOP & Field Learning", color: "200 35% 12%" },
];

/* ── Pain points (entry wedge: HQ→Europe engineering onboarding) ─────────── */

const PAIN_POINTS = [
  {
    icon: <Clock className="w-5 h-5" />,
    title: "9-12 months to ramp a new engineer",
    desc: "Chassis-control, EMB and wheel-hub motor judgment lives in HQ veterans' heads. New new engineering hires re-derive the same design choices from scratch, slide decks, and Slack threads.",
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "HQ design intent gets lost in translation",
    desc: "Why a tuning constant, a safety goal, or a supplier choice exists rarely survives the trip from HQ to a new R&D site. Generic AI copilots fill the gap with plausible, wrong answers.",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "ISO 26262 / ASPICE evidence is rebuilt every program",
    desc: "HARA logic, safety-goal rationale, and ASPICE work-product traceability are reconstructed program-by-program. The next platform starts from zero instead of the last safety case.",
  },
];

/* ── How LIZA works ──────────────────────────────────────────────────────── */

const HOW_IT_WORKS = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    step: "01",
    title: "Capture",
    desc: "HQ chief-engineer judgment, chassis-control IP, safety-goal rationale, and supplier learnings become structured, reusable context — not 200-page PDFs and tribal knowledge.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    step: "02",
    title: "Govern",
    desc: "Every AI-assisted requirement, HARA entry, design rationale, and V&V plan is gated against the full functional-safety + architecture + supplier context.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    step: "03",
    title: "Execute",
    desc: "HQ and regional R&D site engineers work inside the same governed standard. Onboarding compresses from 9-12 months to weeks; design intent stops drifting between sites.",
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    step: "04",
    title: "Learn",
    desc: "Every approved safety case, field issue, and supplier exception feeds back. The next platform — and the next site — starts smarter than the last.",
  },
];

/* ── Standards ───────────────────────────────────────────────────────────── */

const COMPLIANCE = [
  "ISO 26262", "ASPICE", "ISO 21434 (Cybersecurity)",
  "ISO/PAS 21448 (SOTIF)", "IATF 16949", "UNECE R155 / R156",
  "AUTOSAR", "GDPR",
];

/* ── Adjacent ────────────────────────────────────────────────────────────── */

const ADJACENT_VERTICALS = [
  {
    icon: <Users className="w-5 h-5" />,
    title: "HQ → Europe Engineering Onboarding (entry wedge)",
    desc: "Codify chassis-control IP and HQ design intent so new engineering hires reach productivity in weeks, not 9-12 months. The fastest-ROI surface in a greenfield R&D site.",
    tags: ["Onboarding", "Chassis Control", "Knowledge Transfer"],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Functional Safety & Safety-Case Authoring",
    desc: "HARA, safety goals, ASIL decomposition, and ISO 26262 work-product evidence — encoded once, reused across platforms instead of rebuilt per program.",
    tags: ["ISO 26262", "HARA", "Safety Case"],
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "ASPICE & Software Process Governance",
    desc: "Requirements traceability, architecture rationale, and V&V evidence governed against ASPICE expectations — without the per-audit scramble.",
    tags: ["ASPICE", "Traceability", "V&V"],
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    title: "OEM RFQ & Supplier Memory",
    desc: "What was promised, won, and lost across Tier-1 bids and supplier programs. Group-level memory across HQ and every regional R&D site. One architecture, every site.",
    tags: ["RFQ", "Supplier", "Group Memory"],
  },
];

export default function IndustryAutomotivePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="pt-16 pb-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionTag label="Automotive R&D · Functional Safety" icon={<Car className="w-3.5 h-3.5" />} />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-[1.1]">
            The Engineering Memory Layer for
            <br />
            <span className="text-primary">Cross-Border Automotive R&D.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Chassis-control IP, HQ design intent, and ISO 26262 judgment live in veterans' heads
            and program slide decks. Generic AI copilots fill the gap with plausible — and
            wrong — answers. LIZA codifies the engineering judgment, then governs every AI output
            against it — starting with HQ → Europe onboarding.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/investor-automotive"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              View the Automotive deck <ArrowRight className="w-4 h-4" />
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
            The Automotive R&D Lifecycle
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
            We start at HQ → Europe onboarding — the highest-friction, highest-cost surface in a
            greenfield R&D site — and extend the same memory layer across the V-cycle.
          </p>
        </div>
      </section>

      {/* Pain points */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-foreground">
            Where AI breaks cross-border automotive R&D without governance
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
            How LIZA governs AI across automotive R&D
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            The same four-step system of reasoning, built for ISO 26262, ASPICE, ISO 21434 and the
            cross-site reality of HQ-plus-greenfield engineering.
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
              Designed around automotive-grade standards
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              LIZA is architected around ISO 26262, ASPICE, ISO 21434, SOTIF, and IATF 16949. Your
              PLM, ALM, and toolchain stay yours. LIZA governs the AI layer on top.
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
            Start with onboarding. Extend across the V-cycle.
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8 max-w-lg mx-auto">
            HQ → Europe onboarding is the wedge — fastest ROI, lowest risk to pilot in a greenfield
            site. The same memory layer then extends to safety case, ASPICE, and group-level
            engineering governance.
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
            Two doors into the Automotive R&D Memory Layer
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Option A — come on board as a customer with a 30-day onboarding pilot for a single R&D team at one site on one chassis-control or functional-safety workflow. Option B —
            co-invest in the category and help define the cross-border engineering reference
            architecture across the four sites with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/investor-automotive"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              View the Automotive deck <ArrowRight className="w-4 h-4" />
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
