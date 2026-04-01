import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ArrowRight, FileText, Mic, Zap, CheckCircle2, ArrowDown, Brain, Layers, BookOpen, Lock, Shield } from "lucide-react";
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

// ── The Pipeline Visual ───────────────────────────────────────────────────────

const PIPELINE_STEPS = [
  {
    icon: <Mic className="w-7 h-7" />,
    label: "INPUT",
    title: "Your Existing Knowledge",
    desc: "Process documents, protocols, transcripts, and structured senior interviews. The raw material you already have.",
    col: "200 90% 52%",
    visual: (
      <div className="rounded-xl p-5 border font-mono text-xs leading-relaxed" style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
        <p className="mb-2 opacity-60">// Process documentation</p>
        <p>"Client Scoping SOP v4.2: When a client pushes for speed, apply the qualification checklist before proceeding..."</p>
        <p className="mt-2 opacity-60">// Meeting transcript</p>
        <p>"...the margin risk isn't in the deliverable, it's in the change requests. So I always build a clause that..."</p>
        <p className="mt-2 opacity-60">// Senior interview excerpt</p>
        <p>"...when I see that pattern, I slow them down with three questions before we even talk about scope..."</p>
      </div>
    ),
  },
  {
    icon: <Zap className="w-7 h-7" />,
    label: "PROCESS",
    title: "LIZA Context Engine",
    desc: "Analyses, categorises, and structures every piece of expertise into Playbooks, Procedures, Directives, Principles, and Knowledge items.",
    col: "155 72% 46%",
    visual: (
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "hsl(155 72% 46% / 0.3)" }}>
        <div className="px-5 py-3 border-b flex items-center gap-2" style={{ background: "hsl(155 72% 46% / 0.08)", borderColor: "hsl(155 72% 46% / 0.2)" }}>
          <Zap className="w-4 h-4" style={{ color: "hsl(155 72% 46%)" }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(155 72% 46%)" }}>Semantic Analysis</span>
        </div>
        <div className="p-5 flex flex-col gap-3" style={{ background: "hsl(var(--background))" }}>
          {[
            { type: "PLAYBOOK", text: "Client Scoping Protocol", col: "200 90% 52%" },
            { type: "DIRECTIVE", text: "Always include change-request clause", col: "38 92% 50%" },
            { type: "PRINCIPLE", text: "Speed pressure = internal misalignment", col: "270 60% 65%" },
            { type: "PROCEDURE", text: "3-Question Slowdown Framework", col: "155 72% 46%" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-[10px] font-black tracking-widest px-2 py-1 rounded-full flex-shrink-0" style={{ background: `hsl(${item.col} / 0.15)`, color: `hsl(${item.col})` }}>
                {item.type}
              </span>
              <span style={{ color: "hsl(var(--foreground))" }}>{item.text}</span>
              <CheckCircle2 className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: "hsl(155 72% 46%)" }} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: <FileText className="w-7 h-7" />,
    label: "OUTPUT",
    title: "Your Master Protocol",
    desc: "A structured, versioned, executable protocol. Ready to deploy into AI workbooks or run as automated workflows.",
    col: "38 92% 50%",
    visual: (
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "hsl(38 92% 50% / 0.3)" }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ background: "hsl(38 92% 50% / 0.08)", borderColor: "hsl(38 92% 50% / 0.2)" }}>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: "hsl(38 92% 50%)" }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(38 92% 50%)" }}>Master Protocol</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "hsl(155 72% 46% / 0.15)", color: "hsl(155 72% 46%)" }}>v1.0</span>
        </div>
        <div className="p-5 flex flex-col gap-4 text-sm" style={{ background: "hsl(var(--background))" }}>
          <div>
            <p className="font-bold mb-1">1. Client Scoping Protocol</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>When a client pushes for speed, apply the 3-Question Slowdown Framework before proceeding to SOW drafting.</p>
          </div>
          <div className="h-px" style={{ background: "hsl(var(--border))" }} />
          <div>
            <p className="font-bold mb-1">2. Margin Protection Gates</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>DIRECTIVE: Every SOW must include change-request clause with escalation triggers. Non-negotiable.</p>
          </div>
          <div className="h-px" style={{ background: "hsl(var(--border))" }} />
          <div>
            <p className="font-bold mb-1">3. Red Flag Detection</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>PRINCIPLE: Client speed pressure signals internal misalignment. Slow down. Qualify deeper.</p>
          </div>
        </div>
      </div>
    ),
  },
];

// ── Features ──────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Knowledge Extraction Engine",
    desc: "Surfaces the tacit layer from your process docs, transcripts, and senior interviews. The judgment never written down.",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Context Bundles",
    desc: "Playbooks, Procedures, Directives, and Principles. Versioned, governed, always current.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Protocol Execution",
    desc: "Deploy bundles as executable protocols inside AI workbooks. Consistent, auditable, scalable.",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Institutional Memory",
    desc: "Every execution captures learning back into the system. Knowledge compounds over time.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Governance & Access Control",
    desc: "Role-based access, mandate enforcement, and audit trails. Your IP stays protected.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Operator Oversight",
    desc: "Track what your team executes, where drift happens, and what needs re-encoding.",
  },
];

// ── Knowledge Architecture ────────────────────────────────────────────────────

const CATEGORIES = [
  {
    label: "PLAYBOOK",
    tagline: "The strategic driver",
    desc: "Defines WHAT the work is and WHY it matters. One per bundle: the north star governing all other items.",
    col: "200 90% 52%",
    role: "Strategic",
  },
  {
    label: "PROCEDURE",
    tagline: "Ordered executable steps",
    desc: "Atomic, sequenced action steps with gate logic. Designed to run inside AI workflows without interpretation.",
    col: "155 72% 46%",
    role: "Operational",
  },
  {
    label: "DIRECTIVE",
    tagline: "Compliance gates",
    desc: "Non-negotiable constraints requiring acknowledgment before execution continues.",
    col: "38 92% 50%",
    role: "Compliance",
  },
  {
    label: "PRINCIPLE",
    tagline: "Core beliefs",
    desc: "The heuristics that guide decision-making at judgment points. Not rules, wisdom.",
    col: "270 60% 65%",
    role: "Contextual",
  },
  {
    label: "KNOWLEDGE",
    tagline: "Reference context",
    desc: "Frameworks, definitions, market data: the reference layer that informs, not directs.",
    col: "215 10% 60%",
    role: "Reference",
  },
];

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

      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      fetch(`https://${projectId}.supabase.co/functions/v1/notify-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role_description: role }),
      }).catch(() => {});

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, hsl(200 90% 52% / 0.07) 0%, transparent 65%)" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <SectionTag>The Product</SectionTag>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Your knowledge in.
            <br />
            <GradientText>Your operating system out.</GradientText>
          </h1>
          <p className="text-lg mb-10" style={{ color: "hsl(var(--muted-foreground))" }}>
            Messy knowledge goes in. Structured, executable protocols come out.
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

      {/* The Pipeline — How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <SectionTag>How it works</SectionTag>
            <h2 className="text-4xl font-black mb-4">
              Your knowledge in.
              <br />
              <GradientText>Executable protocol out.</GradientText>
            </h2>
          </div>

          <div className="flex flex-col">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={i}>
                <div
                  className="relative rounded-3xl border overflow-hidden"
                  style={{
                    background: `hsl(${step.col} / 0.03)`,
                    borderColor: `hsl(${step.col} / 0.2)`,
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${step.col})` }} />
                  <div className="p-10 md:p-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${step.col} / 0.15)`, color: `hsl(${step.col})` }}
                      >
                        {step.icon}
                      </div>
                      <span
                        className="text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full"
                        style={{ background: `hsl(${step.col} / 0.12)`, color: `hsl(${step.col})` }}
                      >
                        {step.label}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black mb-3">{step.title}</h3>
                    <p className="text-sm md:text-base leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>{step.desc}</p>
                    {step.visual}
                  </div>
                </div>

                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="flex flex-col items-center gap-2 py-3">
                    <div className="w-px h-6" style={{ background: `linear-gradient(to bottom, hsl(${step.col} / 0.4), hsl(${PIPELINE_STEPS[i + 1].col} / 0.4))` }} />
                    <ArrowDown className="w-5 h-5" style={{ color: "hsl(var(--primary) / 0.5)" }} />
                    <div className="w-px h-6" style={{ background: `linear-gradient(to bottom, hsl(${PIPELINE_STEPS[i + 1].col} / 0.4), hsl(${PIPELINE_STEPS[i + 1].col} / 0.6))` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-4xl mx-auto text-center">
          <SectionTag>The deliverable</SectionTag>
          <h2 className="text-4xl font-black mb-4">
            A working system
            <br />
            <GradientText>you deploy on day one.</GradientText>
          </h2>
          <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            Not a PDF in a drawer. A living, versioned, executable asset that gets smarter with every use.
          </p>

          <div className="grid md:grid-cols-3 gap-5 text-left">
            {[
              { title: "Executable", desc: "Deploy directly into AI workbooks with gate logic and compliance checks." },
              { title: "Versioned", desc: "Every change tracked. Roll back, compare, audit. Your IP is governed." },
              { title: "Compounding", desc: "Every execution captures learning. Protocols get smarter with every use." },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-7 border"
                style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
              >
                <h3 className="text-base font-bold mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real outcomes */}
      <section className="py-24 px-6">
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

      {/* Knowledge Architecture — deeper */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
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

      {/* Platform Features grid */}
      <section className="py-24 px-6">
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

      {/* Beta signup + CTA */}
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-3xl font-black mb-4">
              See it run on <GradientText>your expertise.</GradientText>
            </h2>
            <p className="text-sm mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
              Book a 30-minute protocol assessment. We'll show you exactly what your Master Protocol would look like.
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
                The 5-Day Sprint →
              </Link>
            </div>
          </div>
          <BetaForm />
        </div>
      </section>
    </MarketingLayout>
  );
}
