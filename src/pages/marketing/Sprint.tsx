import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  ArrowRight, CheckCircle2, FileText, Mic, Cpu, Zap,
  Clock, Users, Package, Brain, ChevronRight,
} from "lucide-react";

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";
const GRN = "155 72% 46%";

function GradientText({ children }: { children: React.ReactNode }) {
  return <span className="brand-gradient-text">{children}</span>;
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 65%)`, transform: "translate(20%, -20%)" }}
      />
      <div className="max-w-4xl mx-auto relative z-10">
        <p
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-6"
          style={{ color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.25)", background: "hsl(var(--primary) / 0.06)" }}
        >
          <Zap className="w-3 h-3" /> 5-Day Engagement
        </p>
        <h1 className="text-4xl md:text-5xl font-black mb-5 leading-[1.1]">
          The Protocol Sprint.
          <br />
          <GradientText>€5,000. One week. Done.</GradientText>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
          We take one critical process from your best person's head and turn it into an executable protocol your entire team can run. Fixed scope, fixed price, no surprises.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Book a Sprint Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            to="/extract"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border text-muted-foreground hover:text-foreground transition-colors"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            Try the Extraction Engine first
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── WHAT YOU GET ─────────────────────────────────────────────────────────────
function Deliverables() {
  const items = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Your Master Protocol",
      desc: "A structured, versioned document containing every playbook, procedure, gate, and principle extracted from your expert's methodology.",
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      title: "Live in LIZA OS",
      desc: "Your protocol deployed as an executable system. Team members launch playbooks, follow guided steps, and the AI generates drafts using your context.",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Knowledge Gap Report",
      desc: "A structured list of questions your documentation doesn't answer. The implicit expertise that needs to be made explicit.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Team-Ready from Day 6",
      desc: "Your team opens LIZA OS and sees action cards, not a blank page. They pick a playbook and execute. No training required.",
    },
  ];

  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3">
            What you walk away with.
          </h2>
          <p className="text-muted-foreground">Everything you need to go from "it's in my head" to "anyone can run it."</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <div key={i} className="rounded-2xl border p-7" style={{ borderColor: "hsl(var(--border))" }}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
              >
                {item.icon}
              </div>
              <h3 className="text-base font-bold mb-2">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── THE 5 DAYS ───────────────────────────────────────────────────────────────
function Timeline() {
  const days = [
    {
      day: "Day 1",
      title: "Document Intake",
      desc: "Send us your process docs, SOPs, playbooks, templates. Whatever your expert uses. We run the extraction engine.",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      day: "Day 2",
      title: "Expert Interview",
      desc: "90-minute structured interview with your senior person. We surface the judgment layer that never makes it into documents.",
      icon: <Mic className="w-5 h-5" />,
    },
    {
      day: "Day 3",
      title: "Codification",
      desc: "We structure everything into playbooks, procedures, compliance gates, and principles. Your methodology becomes versioned infrastructure.",
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      day: "Day 4",
      title: "Review & Refine",
      desc: "Walk-through with your expert. We validate the protocol matches their judgment. Adjustments are made in real-time.",
      icon: <Users className="w-5 h-5" />,
    },
    {
      day: "Day 5",
      title: "Deploy & Handoff",
      desc: "Protocol goes live in LIZA OS. Your team gets access. We show them how to launch their first session.",
      icon: <Package className="w-5 h-5" />,
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black mb-3">
            Five days. <GradientText>Start to finish.</GradientText>
          </h2>
          <p className="text-muted-foreground">No multi-month discovery. No 200-page report. A working system.</p>
        </div>
        <div className="flex flex-col gap-0">
          {days.map((d, i) => (
            <div key={i} className="flex gap-5">
              {/* Timeline rail */}
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2"
                  style={{
                    borderColor: "hsl(var(--primary) / 0.4)",
                    background: "hsl(var(--primary) / 0.08)",
                    color: "hsl(var(--primary))",
                  }}
                >
                  {d.icon}
                </div>
                {i < days.length - 1 && (
                  <div className="w-[2px] flex-1 min-h-[24px]" style={{ background: "hsl(var(--primary) / 0.15)" }} />
                )}
              </div>
              {/* Content */}
              <div className="pb-8">
                <span className="text-xs font-black tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
                  {d.day}
                </span>
                <h3 className="text-lg font-bold mt-1 mb-1">{d.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PRICING ──────────────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-3xl mx-auto">
        <div
          className="relative rounded-2xl border overflow-hidden p-10"
          style={{ borderColor: "hsl(var(--primary) / 0.3)", background: "hsl(var(--primary) / 0.03)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "var(--gradient-brand)" }} />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <h3 className="text-2xl font-black mb-2">Protocol Sprint</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                One process. One expert. One week. Everything included.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: <Clock className="w-3.5 h-3.5" />, label: "5 working days" },
                  { icon: <Mic className="w-3.5 h-3.5" />, label: "90-min expert interview" },
                  { icon: <Package className="w-3.5 h-3.5" />, label: "Deployed in LIZA OS" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {f.icon} {f.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center md:text-right shrink-0">
              <p className="text-4xl font-black" style={{ color: "hsl(var(--primary))" }}>€5,000</p>
              <p className="text-xs text-muted-foreground mt-1">Fixed price, no surprises</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Extraction engine analysis of all documents",
                "90-minute structured expert interview",
                "Full Master Protocol (PDF + digital)",
                "Live deployment in LIZA OS",
                "Knowledge gap report",
                "Team onboarding session",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: `hsl(${GRN})` }} />
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── WHO IT'S FOR ─────────────────────────────────────────────────────────────
function WhoItsFor() {
  const personas = [
    { title: "Practice Leads & Partners", desc: "You've built the methodology. Now make it run without you in the room." },
    { title: "Sales Leaders", desc: "Your top seller's instinct shouldn't retire when they do." },
    { title: "Heads of Operations", desc: "Consistency across 50 people shouldn't depend on 3 seniors." },
    { title: "Founders scaling past 20", desc: "The way you do things is your competitive advantage. Encode it before it dilutes." },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3">
            Built for people who <GradientText>know what good looks like.</GradientText>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {personas.map((p, i) => (
            <div key={i} className="rounded-xl border p-6" style={{ borderColor: "hsl(var(--border))" }}>
              <h3 className="font-bold text-sm mb-1">{p.title}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── WHAT HAPPENS NEXT ────────────────────────────────────────────────────────
function WhatsNext() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3">
            After the Sprint. <GradientText>The system compounds.</GradientText>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The Sprint gives you one protocol. But every execution generates learning that feeds back into the system.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { step: "Week 1", title: "Sprint delivers", desc: "Your first protocol is live. Team starts executing." },
            { step: "Week 2–4", title: "System learns", desc: "Execution data surfaces drift, patterns, and gaps. Your protocol improves." },
            { step: "Month 2+", title: "Expand", desc: "Add more processes. Each one is faster because the system already knows your organisation." },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border p-7" style={{ borderColor: "hsl(var(--primary) / 0.2)", background: "hsl(var(--primary) / 0.03)" }}>
              <span className="text-xs font-black tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>{s.step}</span>
              <h3 className="text-lg font-bold mt-2 mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FINAL CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative rounded-3xl p-16 border overflow-hidden" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, hsl(var(--primary) / 0.07) 0%, transparent 65%)" }} />
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "var(--gradient-brand)" }} />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">
              One process. One week.
              <br />
              <GradientText>Your team runs it forever.</GradientText>
            </h2>
            <p className="text-base mb-8 text-muted-foreground">
              30-minute call. We'll confirm the Sprint is right for your use case and schedule it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
                }}>
                Book a Sprint Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/extract"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border text-muted-foreground hover:text-foreground transition-colors"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                Try the Extraction Engine
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function SprintPage() {
  return (
    <MarketingLayout>
      <Hero />
      <Deliverables />
      <Timeline />
      <Pricing />
      <WhoItsFor />
      <WhatsNext />
      <FinalCTA />
    </MarketingLayout>
  );
}
