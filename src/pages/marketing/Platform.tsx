import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ArrowRight, Brain, Layers, Zap, BookOpen, CheckCircle2, Lock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

// ── Beta signup form ──────────────────────────────────────────────────────────

function BetaForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const { error: dbErr } = await supabase
        .from("beta_signups" as any)
        .insert({ email, role_description: role });

      if (dbErr) throw dbErr;

      // Fire email notification (best-effort, don't block on failure)
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      fetch(`https://${projectId}.supabase.co/functions/v1/notify-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role_description: role }),
      }).catch(() => {/* silent */});

      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="rounded-2xl p-10 border text-center"
        style={{ background: "hsl(var(--primary) / 0.04)", borderColor: "hsl(var(--primary) / 0.3)" }}
      >
        <CheckCircle2 className="w-12 h-12 mx-auto mb-4" style={{ color: "hsl(var(--brand-green))" }} />
        <h3 className="text-xl font-bold mb-2">You're on the list.</h3>
        <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
          We'll reach out as we open beta access. In the meantime, book a discovery call to move faster.
        </p>
        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
          style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
        >
          Skip the queue: book a call <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-2xl p-10 border overflow-hidden"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--primary) / 0.2)" }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
      <div className="relative z-10">
        <h3 className="text-2xl font-bold mb-2">Join the Beta</h3>
        <p className="text-sm mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
          Early access for professional services firms. We're onboarding a small cohort of design partners.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--foreground))",
            }}
          />
          <input
            type="text"
            placeholder="Your role (e.g. Managing Partner, Head of Strategy)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--foreground))",
            }}
          />
          {error && <p className="text-xs" style={{ color: "hsl(var(--destructive))" }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 20px -4px hsl(200 90% 52% / 0.3)",
            }}
          >
            {loading ? "Submitting…" : "Request Beta Access"}
          </button>
        </form>
        <p className="text-xs mt-4 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
          No spam. We'll only email you about access.
        </p>
      </div>
    </div>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Knowledge Extraction Engine",
    desc: "Learns from your existing process documentation, protocols, meeting transcripts, and senior expert interviews to surface the tacit layer: the judgment that was never written down.",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Context Bundles",
    desc: "Package extracted knowledge into bundles: Playbooks, Procedures, Directives, and Principles. Versioned, governed, and always up to date.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Protocol Execution",
    desc: "Deploy knowledge bundles as executable protocols inside AI workbooks. Your expertise runs as infrastructure: consistent, auditable, and scalable.",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Institutional Memory",
    desc: "Every execution captures new learning back into the system. The SECI flywheel: Execution → Learning → Encoding. Knowledge compounds over time.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Governance & Access Control",
    desc: "Role-based access, mandate enforcement, and audit trails. Your intellectual property stays protected and under your control.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Operator Oversight",
    desc: "A dedicated nerve centre for operators to track what their team is executing, where drift happens, and what needs to be re-encoded.",
  },
];

// ── Knowledge Architecture — upgraded visual ───────────────────────────────

const CATEGORIES = [
  {
    label: "PLAYBOOK",
    tagline: "The strategic driver",
    desc: "Defines WHAT the work is and WHY it matters. Each bundle has exactly one Playbook: the north star that governs all other items.",
    col: "200 90% 52%",
    role: "Strategic",
  },
  {
    label: "PROCEDURE",
    tagline: "Ordered executable steps",
    desc: "Step-by-step action sequences with gate logic. Atomic, sequenced, and designed to run inside AI workflows without interpretation.",
    col: "155 72% 46%",
    role: "Operational",
  },
  {
    label: "DIRECTIVE",
    tagline: "Compliance gates",
    desc: "Rules requiring explicit acknowledgment before execution continues. Contains 'must', 'never', 'always': non-negotiable constraints.",
    col: "38 92% 50%",
    role: "Compliance",
  },
  {
    label: "PRINCIPLE",
    tagline: "Core beliefs",
    desc: "The values and heuristics that guide decision-making at judgment points. Not rules, but the wisdom that underpins how rules are applied.",
    col: "270 60% 65%",
    role: "Contextual",
  },
  {
    label: "KNOWLEDGE",
    tagline: "Reference context",
    desc: "Factual information injected into AI execution as background. Frameworks, definitions, market data: the reference layer that informs, not directs.",
    col: "215 10% 60%",
    role: "Reference",
  },
];

export default function PlatformPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, hsl(200 90% 52% / 0.07) 0%, transparent 65%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(200 90% 52%) 1px, transparent 1px), linear-gradient(90deg, hsl(200 90% 52%) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <SectionTag>The Platform</SectionTag>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            The execution engine
            <br />
            <GradientText>for expert judgment.</GradientText>
          </h1>
          <p className="text-lg mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
            LIZA OS standardises your best practices and scales them across your organisation. Consistently, at every level. Not stored. Not searchable. <span className="text-foreground font-medium">Executable.</span>
          </p>
          <p className="text-base mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
            The challenge of standardising how your best people work existed long before AI. AI just made the cost of not solving it impossible to absorb.
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
                boxShadow: "0 0 32px -4px hsl(200 90% 52% / 0.4)",
              }}
            >
              Book a Protocol Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/for-professional-services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border"
              style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
            >
              Start with the Sprint
            </Link>
          </div>
        </div>
      </section>

      {/* What it does — outcomes first */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag>Already running</SectionTag>
            <h2 className="text-4xl font-black mb-4">
              Real outcomes.
              <br />
              <GradientText>Real numbers.</GradientText>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              Four use cases we've deployed, with the numbers to prove it.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {[
              { tag: "Sales Protocol Engine", stat: "8 wks vs 9 months", desc: "Encode your best seller's judgment. Every rep executes at senior level from day one.", col: "38 92% 50%" },
              { tag: "Audit Automation", stat: "23× faster", desc: "Encode every criterion and rule. Run audits with 80% less groundwork and 72% higher accuracy.", col: "200 90% 52%" },
              { tag: "Decision Extraction", stat: "Week 1 ready", desc: "Not transcripts. Structured decisions, routed to where they matter. Start with last Monday's meetings.", col: "155 72% 46%" },
              { tag: "Smart Briefing", stat: "0 check-ins", desc: "Don't delegate tasks. Generate briefs with full context. People execute correctly first time.", col: "270 60% 65%" },
            ].map((uc, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-7 border overflow-hidden"
                style={{ background: `hsl(${uc.col} / 0.03)`, borderColor: `hsl(${uc.col} / 0.2)` }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${uc.col})` }} />
                <span className="text-xs font-black tracking-widest uppercase" style={{ color: `hsl(${uc.col})` }}>{uc.tag}</span>
                <p className="text-2xl font-black mt-3 mb-2">{uc.stat}</p>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{uc.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/use-cases" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(var(--primary))" }}>
              See all use cases in detail <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Knowledge Architecture — below outcomes */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag>The Knowledge Architecture</SectionTag>
            <h2 className="text-4xl font-black mb-4">
              Five types of knowledge.
              <br />
              <GradientText>Every piece has a job.</GradientText>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              Every piece of expertise is categorised, structured, and given a specific role in the execution engine.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((c, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-7 border overflow-hidden ${i === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
                style={{
                  background: `hsl(${c.col} / 0.04)`,
                  borderColor: `hsl(${c.col} / 0.25)`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `hsl(${c.col})` }}
                />
                <div className="flex items-start justify-between mb-4">
                  <span
                    className="text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full"
                    style={{ background: `hsl(${c.col} / 0.15)`, color: `hsl(${c.col})` }}
                  >
                    {c.label}
                  </span>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded"
                    style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
                  >
                    {c.role}
                  </span>
                </div>
                <p className="text-base font-bold mb-2">{c.tagline}</p>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag>Platform Features</SectionTag>
            <h2 className="text-4xl font-black">
              Everything you need to
              <br />
              <GradientText>institutionalise judgment.</GradientText>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl p-8 border"
                style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                >
                  {f.icon}
                </div>
                <h3 className="text-base font-bold mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beta signup */}
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto">
          <BetaForm />
        </div>
      </section>
    </MarketingLayout>
  );
}
