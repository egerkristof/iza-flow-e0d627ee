import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { TeamSection } from "@/components/marketing/TeamSection";
import {
  ArrowRight, Brain, Zap, Shield, Users, Layers, BookOpen, Target, BarChart3,
  ClipboardCheck, MessageSquare, TrendingUp, GitBranch,
} from "lucide-react";

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
        style={{ background: "radial-gradient(ellipse, hsl(200 90% 52% / 0.08) 0%, transparent 65%)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(155 72% 46% / 0.05) 0%, transparent 70%)" }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
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
            Your Organisational Intelligence
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black leading-[1.02] mb-8 tracking-tight">
          Standardise your best people's
          <br />
          <GradientText>judgment across every team.</GradientText>
        </h1>

        <p className="text-lg md:text-xl leading-relaxed mb-4 max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
          LIZA OS extracts senior expertise and turns it into executable protocols your entire organisation can run on. Audits 23x faster. Sales reps productive in 8 weeks, not 9 months.
        </p>
        <p className="text-base leading-relaxed mb-12 max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
          The problem of standardising best practices existed before AI. AI just made the gap impossible to ignore.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/platform"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(200 90% 52% / 0.45)",
            }}
          >
            See the Platform
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border transition-all hover:border-primary/40 hover:text-foreground"
            style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
          >
            Book a Discovery Call
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--primary)))" }} />
      </div>
    </section>
  );
}

// ── Our Story ─────────────────────────────────────────────────────────────────

function OurStory() {
  return (
    <section className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <SectionTag>Our Story</SectionTag>
        <p className="text-2xl md:text-3xl font-semibold leading-relaxed mb-8">
          Collaborating with our partners, we kept seeing the same pattern: companies are full of senior expertise, but struggling to scale it.
        </p>
        <p className="text-base md:text-lg leading-relaxed mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
          The knowledge stayed trapped in heads. Handoffs broke. Junior team members couldn't execute with the same judgment. Existing tools capture tasks, not thinking. They miss the decisions, the pattern recognition, the "why" that makes expert work valuable.
        </p>
        <p className="text-base md:text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
          So we built infrastructure specifically for this: execution systems that capture and run on tacit human knowledge. Not just documentation, but working systems.
        </p>
      </div>
    </section>
  );
}

// ── The Problem ───────────────────────────────────────────────────────────────

function TheProblem() {
  return (
    <section className="py-32 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionTag>The Challenge</SectionTag>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Knowledge stays
              <br />
              <GradientText>trapped in heads.</GradientText>
            </h2>
            <p className="text-base leading-relaxed mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
              Companies are full of senior expertise, but struggling to scale it. Handoffs break. Junior teams can't execute with the same judgment. Tools capture tasks, not thinking.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
              They miss the decisions, the pattern recognition, the "why" that makes expert work valuable. That tacit layer walks out the door every time someone leaves the room.
            </p>
            <Link
              to="/manifesto"
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: "hsl(var(--primary))" }}
            >
              Read our thinking <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                icon: <BookOpen className="w-4 h-4" />,
                label: "What gets captured",
                value: "Documents, SOPs, templates, task lists",
                dim: true,
              },
              {
                icon: <Brain className="w-4 h-4" />,
                label: "What actually drives outcomes",
                value: "Pattern recognition · Judgment · Heuristics · Contextual decision-making",
                highlight: true,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-7 border overflow-hidden"
                style={{
                  background: item.highlight ? "hsl(var(--primary) / 0.04)" : "hsl(var(--background))",
                  borderColor: item.highlight ? "hsl(var(--primary) / 0.35)" : "hsl(var(--border))",
                  opacity: item.dim ? 0.6 : 1,
                }}
              >
                {item.highlight && (
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
                )}
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: item.highlight ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}>{item.icon}</span>
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: item.highlight ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}>
                    {item.label}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{item.value}</p>
              </div>
            ))}
            <div className="flex items-center gap-3 px-1">
              <div className="flex-1 h-px" style={{ background: "hsl(var(--primary) / 0.25)" }} />
              <span className="text-xs font-bold" style={{ color: "hsl(var(--primary))" }}>LIZA bridges this gap</span>
              <div className="flex-1 h-px" style={{ background: "hsl(var(--primary) / 0.25)" }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── What LIZA Is ──────────────────────────────────────────────────────────────

const PILLARS = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Knowledge Infrastructure",
    desc: "Capture and structure the tacit judgment that drives real outcomes: Playbooks, Procedures, Directives, and Principles. Not just documents.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Execution Engine",
    desc: "Run knowledge in real workflows. Context-aware protocols guide teams through complex decisions with the right intelligence at every step.",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Oversight & Learning",
    desc: "Every execution feeds back into your knowledge base. The system learns, improves, and compounds, turning every run into institutional memory.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Governance & Control",
    desc: "Mandates, compliance layers, and delegation tracking ensure your standards are upheld even as you scale capacity across teams.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Team Collaboration",
    desc: "Workbooks bring teams together around shared context. Not chat, but structured collaboration with the right knowledge injected at the right moment.",
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Scalable by Design",
    desc: "A small, high-agency team runs on LIZA and achieves what a large, disconnected workforce can't. Build once, scale infinitely.",
  },
];

function WhatLizaIs() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionTag>The Platform</SectionTag>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Execution infrastructure
            <br />
            <GradientText>for complex organisations.</GradientText>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            LIZA synthesises the fluid reality of human collaboration with the precision of structured process. Not another tool. A working system.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PILLARS.map((p, i) => (
            <div
              key={i}
              className="rounded-2xl p-8 border"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
              >
                {p.icon}
              </div>
              <h3 className="text-base font-bold mb-3">{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/platform"
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: "hsl(var(--primary))" }}
          >
            Explore the full platform <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Purpose ───────────────────────────────────────────────────────────────────

function Purpose() {
  return (
    <section className="py-32 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionTag>Our Purpose</SectionTag>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              Scale your
              <br />
              <GradientText>best thinking.</GradientText>
            </h2>
            <p className="text-base leading-relaxed mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
              We believe the true value of an organisation lies in scaling its best thinking, not just managing its tasks.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
              LIZA creates the conditions where a small, high-agency team can achieve exponentially more than a massive, disconnected workforce. We're here to turn intentions into outcomes, creating the space where human potential truly comes to life.
            </p>
            <Link
              to="/manifesto"
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: "hsl(var(--primary))" }}
            >
              Read the manifesto <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Vision + Mission stat cards */}
          <div className="flex flex-col gap-5">
            {[
              {
                label: "Vision",
                text: "Transform the friction of complex organisational growth into a smooth, high-speed superhighway for the agentic era.",
              },
              {
                label: "Mission",
                text: "Build the execution infrastructure for complex businesses. A holistic OS that synthesises human communication with the precision of process.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-7 border overflow-hidden"
                style={{
                  background: i === 0 ? "hsl(var(--primary) / 0.04)" : "hsl(var(--background))",
                  borderColor: i === 0 ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border))",
                }}
              >
                {i === 0 && <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />}
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "hsl(var(--primary))" }}>
                  {item.label}
                </p>
                <p className="text-sm leading-relaxed font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Who It's For ──────────────────────────────────────────────────────────────

const WHO_FOR = [
  {
    icon: <Target className="w-5 h-5" />,
    title: "Knowledge-intensive teams",
    desc: "Legal, consulting, research, and finance. Anywhere expertise is the product and scale is the constraint.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Scaling organisations",
    desc: "Growing fast without losing institutional memory. LIZA ensures your best practices compound as your team grows.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Operators of complex processes",
    desc: "Firms running repeatable, high-stakes workflows that need consistency, governance, and continuous improvement built in.",
  },
];

function WhoItsFor() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionTag>Who it's for</SectionTag>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Built for teams where
            <br />
            <GradientText>expertise is the edge.</GradientText>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            If your competitive advantage lives in how your people think, not just what they do, LIZA is your operating infrastructure.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {WHO_FOR.map((w, i) => (
            <div
              key={i}
              className="rounded-2xl p-8 border"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
              >
                {w.icon}
              </div>
              <h3 className="text-base font-bold mb-2">{w.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{w.desc}</p>
            </div>
          ))}
        </div>

        {/* Professional services callout */}
        <div
          className="relative rounded-2xl p-8 border overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6"
          style={{ background: "hsl(var(--primary) / 0.03)", borderColor: "hsl(var(--primary) / 0.2)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
          <div className="flex-1">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "hsl(var(--primary))" }}>
              Professional Services
            </p>
            <p className="text-base font-semibold mb-1">Managing partner at a consultancy or advisory firm?</p>
            <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              We have a dedicated engagement for firms that need to capture, codify, and package their senior expertise into a scalable knowledge product. In 5 days.
            </p>
          </div>
          <Link
            to="/for-professional-services"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold flex-shrink-0 transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 20px -4px hsl(200 90% 52% / 0.35)",
            }}
          >
            See the Sprint
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Use Cases teaser ──────────────────────────────────────────────────────────

const USE_CASE_TEASERS = [
  {
    icon: <TrendingUp className="w-5 h-5" />,
    col: "38 92% 50%",
    tag: "Sales Protocol Engine",
    stat: "8 weeks vs 9 months",
    desc: "Encode your best seller's judgment. Every team member executes at senior level from day one.",
  },
  {
    icon: <ClipboardCheck className="w-5 h-5" />,
    col: "200 90% 52%",
    tag: "Audit Automation",
    stat: "23× faster",
    desc: "Encode every auditing criterion and rule. Run audits with 80% less groundwork and 72% higher accuracy.",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    col: "155 72% 46%",
    tag: "Decision Extraction",
    stat: "Week 1 ready",
    desc: "Not transcripts. Structured decisions, routed to where they matter. Start with last Monday's meetings.",
  },
  {
    icon: <GitBranch className="w-5 h-5" />,
    col: "270 60% 65%",
    tag: "Smart Briefing",
    stat: "0 check-ins needed",
    desc: "Don't delegate tasks. Generate briefs with full context. People execute correctly first time.",
  },
];

function UseCasesTeaser() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag>Real-world results</SectionTag>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Not theory.
            <br />
            <GradientText>Already running.</GradientText>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            Four use cases we've already deployed, with numbers to prove it.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {USE_CASE_TEASERS.map((uc, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-7 border overflow-hidden"
              style={{ background: `hsl(${uc.col} / 0.03)`, borderColor: `hsl(${uc.col} / 0.2)` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${uc.col})` }} />
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `hsl(${uc.col} / 0.15)`, color: `hsl(${uc.col})` }}
                >
                  {uc.icon}
                </div>
                <span className="text-xs font-black tracking-widest uppercase" style={{ color: `hsl(${uc.col})` }}>
                  {uc.tag}
                </span>
              </div>
              <p className="text-2xl font-black mb-2">{uc.stat}</p>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{uc.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/use-cases"
            className="group inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: "hsl(var(--primary))" }}
          >
            See all use cases in detail <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────

function CTABand() {
  return (
    <section className="py-32 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="relative rounded-3xl p-16 border overflow-hidden"
          style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--primary) / 0.2)" }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, hsl(200 90% 52% / 0.07) 0%, transparent 65%)" }}
          />
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "var(--gradient-brand)" }} />

          <div className="relative z-10">
            <SectionTag>Get started</SectionTag>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              The infrastructure
              <br />
              <GradientText>shaping organisations.</GradientText>
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              Book a 30-minute discovery call to see how LIZA fits your team. No commitment required.
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
                Book a Discovery Call
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/platform"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border transition-all hover:border-primary/40"
                style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
              >
                Explore the Platform →
              </Link>
              <Link
                to="/enterprise"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border transition-all hover:border-primary/40"
                style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
              >
                Enterprise Programme →
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
      <UseCasesTeaser />
      <OurStory />
      <TheProblem />
      <WhatLizaIs />
      <Purpose />
      <TeamSection />
      <WhoItsFor />
      <CTABand />
    </MarketingLayout>
  );
}
