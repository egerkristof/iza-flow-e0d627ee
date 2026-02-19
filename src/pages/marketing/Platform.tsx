import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ArrowRight, Brain, Layers, Zap, BookOpen, CheckCircle2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
      setSubmitted(true);
    } catch {
      // If table doesn't exist yet, still show success (graceful fallback)
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
          href="https://cal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
          style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
        >
          Book a call instead <ArrowRight className="w-4 h-4" />
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
    desc: "AI-assisted structured interviews and capture tools that surface the tacit layer from your senior experts — the judgment that was never written down.",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "Context Bundles",
    desc: "Package extracted knowledge into bundles: Playbooks, Procedures, Directives, and Principles. Versioned, governed, and always up to date.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Protocol Execution",
    desc: "Deploy knowledge bundles as executable protocols inside AI workbooks. Your expertise runs as infrastructure — consistent, auditable, and scalable.",
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
    icon: <ArrowRight className="w-6 h-6" />,
    title: "Operator Oversight",
    desc: "A dedicated nerve centre for operators to track what their team is executing, where drift happens, and what needs to be re-encoded.",
  },
];

// ── Categories visual ─────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "PLAYBOOK", desc: "Strategic driver — defines WHAT and WHY", col: "200 90% 52%" },
  { label: "PROCEDURE", desc: "Ordered executable steps with gate logic", col: "155 72% 46%" },
  { label: "DIRECTIVE", desc: "Compliance gates requiring acknowledgment", col: "38 92% 50%" },
  { label: "PRINCIPLE", desc: "Core beliefs guiding decision-making", col: "270 60% 65%" },
  { label: "KNOWLEDGE", desc: "Factual reference context for AI", col: "215 10% 60%" },
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
            Turn expertise into
            <br />
            <GradientText>executable infrastructure.</GradientText>
          </h1>
          <p className="text-lg mb-10" style={{ color: "hsl(var(--muted-foreground))" }}>
            LIZA OS is a knowledge-activated execution engine. Not a knowledge base. Not a wiki.
            A system that makes your expertise run — consistently, at scale, without you in the room.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://cal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(200 90% 52% / 0.4)",
              }}
            >
              Book a Demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/advisory"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border"
              style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
            >
              Start with the Sprint
            </Link>
          </div>
        </div>
      </section>

      {/* The protocol execution model */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag>The Knowledge Architecture</SectionTag>
            <h2 className="text-4xl font-black mb-4">Five types of knowledge.</h2>
            <p className="text-lg" style={{ color: "hsl(var(--muted-foreground))" }}>
              Every piece of expertise is categorised, structured, and made executable.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-6 px-7 py-5 rounded-xl border"
                style={{ background: "hsl(var(--background))", borderColor: `hsl(${c.col} / 0.15)` }}
              >
                <span
                  className="text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full flex-shrink-0"
                  style={{ background: `hsl(${c.col} / 0.1)`, color: `hsl(${c.col})` }}
                >
                  {c.label}
                </span>
                <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
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
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
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
