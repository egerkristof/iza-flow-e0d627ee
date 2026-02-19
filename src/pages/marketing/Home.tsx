import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ArrowRight, Brain, Layers, Zap, Lock, TrendingUp, BookOpen, Quote } from "lucide-react";

// ── Shared accent primitives ──────────────────────────────────────────────────

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

function GradientText({ children }: { children: React.ReactNode }) {
  return <span className="brand-gradient-text">{children}</span>;
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-6"
      style={{
        color: "hsl(var(--primary))",
        borderColor: "hsl(var(--primary) / 0.25)",
        background: "hsl(var(--primary) / 0.06)",
      }}
    >
      {children}
    </p>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background glows */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, hsl(200 90% 52% / 0.08) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(155 72% 46% / 0.05) 0%, transparent 70%)",
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(200 90% 52%) 1px, transparent 1px), linear-gradient(90deg, hsl(200 90% 52%) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-6">
          <span
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border"
            style={{
              color: "hsl(var(--primary))",
              borderColor: "hsl(var(--primary) / 0.3)",
              background: "hsl(var(--primary) / 0.06)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "hsl(var(--primary))" }} />
            Private beta — 4 sprint slots remaining
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-[1.0] mb-8 tracking-tight">
          Your expertise is
          <br />
          <GradientText>your last moat.</GradientText>
        </h1>

        <p className="text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
          LIZA OS turns the judgment in your seniors' heads into executable infrastructure —
          so your firm scales without losing what makes you different.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(200 90% 52% / 0.45)",
            }}
          >
            Book a Discovery Call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            to="/platform"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border transition-all hover:border-primary/40 hover:text-foreground"
            style={{
              color: "hsl(var(--muted-foreground))",
              borderColor: "hsl(var(--border))",
            }}
          >
            See the platform
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--primary)))" }} />
      </div>
    </section>
  );
}

// ── Problem ───────────────────────────────────────────────────────────────────

function Problem() {
  const cols = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Replicable by AI",
      title: "Frameworks & templates",
      desc: "The deliverables your clients used to pay €300/hr for. ChatGPT does it in 30 seconds.",
      tag: "Commoditised",
      dim: true,
    },
    {
      icon: <Lock className="w-5 h-5" />,
      label: "Hard to scale",
      title: "Senior expert time",
      desc: "The judgment your clients really pay for. Can't be replicated — but can't scale without the person in the room.",
      tag: "Bottlenecked",
      dim: true,
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "What's left — packaged",
      title: "Codified expertise",
      desc: "Your unique value, turned into executable protocols that run without you in the room. License it. Embed it. Scale it.",
      tag: "Your new defensible asset",
      highlight: true,
    },
  ];

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionTag>The Three-Layer Problem</SectionTag>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Clients won't pay for what
            <br />
            <GradientText>ChatGPT can do.</GradientText>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            See where your value sits — and what it takes to protect it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cols.map((c, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-8 border overflow-hidden"
              style={{
                background: c.highlight ? "hsl(var(--primary) / 0.04)" : "hsl(var(--card))",
                borderColor: c.highlight ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))",
                opacity: c.dim ? 0.65 : 1,
              }}
            >
              {c.highlight && (
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: "var(--gradient-brand)" }}
                />
              )}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-5"
                style={{
                  background: c.highlight ? "hsl(var(--primary) / 0.12)" : "hsl(var(--muted))",
                  color: c.highlight ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                }}
              >
                {c.icon}
              </div>
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: c.highlight ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}>
                {c.label}
              </p>
              <h3 className="text-xl font-bold mb-3">{c.title}</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>{c.desc}</p>
              <span
                className="text-xs font-bold px-3 py-1.5 rounded-full"
                style={{
                  background: c.highlight ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted))",
                  color: c.highlight ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                }}
              >
                {c.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { n: "01", title: "Audit the Judgment Gap", desc: "We map what your seniors know that isn't written down anywhere — the heuristics, pattern recognition, and decision logic that drive real outcomes." },
    { n: "02", title: "Extract the Tacit Layer", desc: "Through structured interviews and LIZA OS capture tools, we surface and codify the judgment that lives in your senior heads." },
    { n: "03", title: "Build Executable Protocols", desc: "Your knowledge becomes structured protocols inside LIZA OS — not static documents, but living instruction sets that run in AI workflows." },
    { n: "04", title: "Scale Without You in the Room", desc: "Your packaged expertise runs through juniors, clients, and partner firms. The institutional knowledge is now infrastructure." },
  ];

  return (
    <section className="py-32 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionTag>How LIZA OS Works</SectionTag>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            From judgment to
            <br />
            <GradientText>infrastructure.</GradientText>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            A four-step system that turns tacit expertise into scalable, executable knowledge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-8 border"
              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
            >
              <div className="flex items-start gap-5">
                <span
                  className="text-4xl font-black tabular-nums flex-shrink-0 leading-none"
                  style={{ color: "hsl(var(--primary) / 0.25)" }}
                >
                  {s.n}
                </span>
                <div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Concept: Tacit vs Explicit ────────────────────────────────────────────────

function TacitExplicit() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionTag>The Core Insight</SectionTag>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              AI already has
              <br />
              your documents.
              <br />
              <GradientText>Not your judgment.</GradientText>
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              Every competitor loads the same frameworks, SOPs, and templates into their AI. The explicit layer is commoditised by default.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
              What clients actually pay for — the pattern recognition, contextual judgment, and heuristics your seniors carry — was never written down. That's the tacit layer. And it's your only real defensible asset.
            </p>
            <Link
              to="/manifesto"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              style={{ color: "hsl(var(--primary))" }}
            >
              Read our manifesto <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {/* Explicit */}
            <div
              className="rounded-2xl p-7 border"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))", opacity: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-5 h-5" style={{ color: "hsl(var(--muted-foreground))" }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Explicit Layer — Already Commoditised
                </span>
              </div>
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                Documents · Frameworks · Templates · SOPs · Research reports
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "hsl(var(--primary) / 0.3)" }} />
              <span className="text-xs font-bold" style={{ color: "hsl(var(--primary))" }}>LIZA OS surfaces this</span>
              <div className="flex-1 h-px" style={{ background: "hsl(var(--primary) / 0.3)" }} />
            </div>

            {/* Tacit */}
            <div
              className="relative rounded-2xl p-7 border overflow-hidden"
              style={{ background: "hsl(var(--primary) / 0.04)", borderColor: "hsl(var(--primary) / 0.35)" }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "var(--gradient-brand)" }}
              />
              <div className="flex items-center gap-3 mb-3">
                <Brain className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
                  Tacit Layer — Your Real Moat
                </span>
              </div>
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                Pattern recognition · Contextual judgment · Decision heuristics · Risk intuition · Senior expertise
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Social Proof / Case Study ─────────────────────────────────────────────────

function SocialProof() {
  return (
    <section className="py-32 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionTag>Client Outcomes</SectionTag>
          <h2 className="text-4xl font-black mb-4">
            What happens when you
            <br />
            <GradientText>codify the judgment layer.</GradientText>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Case Study 1 */}
          <div
            className="relative rounded-2xl p-10 border overflow-hidden"
            style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
            <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              12-person strategy consultancy · EU market
            </p>
            <Quote className="w-8 h-8 mb-4" style={{ color: "hsl(var(--primary) / 0.4)" }} />
            <p className="text-base leading-relaxed mb-8 font-medium">
              "We had two founding partners whose judgment was the firm. After the sprint, those decision patterns were running inside every junior client engagement — without them in the room."
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-black brand-gradient-text">2×</p>
                <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>senior leverage within 60 days</p>
              </div>
              <div>
                <p className="text-3xl font-black brand-gradient-text">€8K</p>
                <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>MRR from packaged knowledge product</p>
              </div>
            </div>
          </div>

          {/* Case Study 2 */}
          <div
            className="relative rounded-2xl p-10 border overflow-hidden"
            style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
            <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              Boutique M&A advisory · 8 practitioners
            </p>
            <Quote className="w-8 h-8 mb-4" style={{ color: "hsl(var(--primary) / 0.4)" }} />
            <p className="text-base leading-relaxed mb-8 font-medium">
              "Our most experienced partner was planning to retire. We ran the sprint to capture her deal intuition. Now that judgment is embedded in how we qualify and structure every new mandate."
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-black brand-gradient-text">35%</p>
                <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>faster deal qualification cycle</p>
              </div>
              <div>
                <p className="text-3xl font-black brand-gradient-text">100%</p>
                <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>of tacit IP retained after retirement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Founder credibility note */}
        <div
          className="rounded-2xl p-8 border flex flex-col md:flex-row items-start md:items-center gap-6"
          style={{ background: "hsl(var(--primary) / 0.03)", borderColor: "hsl(var(--primary) / 0.15)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black flex-shrink-0"
            style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
          >
            LO
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1">Built by practitioners, for practitioners.</p>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              LIZA OS was built by a team with 15+ years across management consulting, AI systems design, and organisational knowledge management. We've run the sprint ourselves — and built the platform on what we learned.
            </p>
          </div>
          <Link
            to="/manifesto"
            className="inline-flex items-center gap-2 text-sm font-semibold flex-shrink-0 transition-colors"
            style={{ color: "hsl(var(--primary))" }}
          >
            Our thinking <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── CTA Band ──────────────────────────────────────────────────────────────────

function CTABand() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="relative rounded-3xl p-16 border overflow-hidden"
          style={{
            background: "hsl(var(--card))",
            borderColor: "hsl(var(--primary) / 0.2)",
          }}
        >
          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, hsl(200 90% 52% / 0.07) 0%, transparent 65%)" }}
          />
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: "var(--gradient-brand)" }}
          />

          <div className="relative z-10">
            <SectionTag>Ready to start?</SectionTag>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              The window is
              <br />
              <GradientText>12–18 months.</GradientText>
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              The firms that codify their expertise now will be the ones clients see as "the standard." Everyone else competes on price.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: "0 0 32px -4px hsl(200 90% 52% / 0.4)",
                }}
              >
                Book a 30-min Discovery Call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/advisory"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border transition-all hover:border-primary/40"
                style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
              >
                See the Sprint →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LizaHome() {
  return (
    <MarketingLayout>
      <Hero />
      <Problem />
      <HowItWorks />
      <TacitExplicit />
      <SocialProof />
      <CTABand />
    </MarketingLayout>
  );
}
