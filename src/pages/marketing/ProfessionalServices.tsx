import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ArrowRight, CheckCircle2, Brain, Layers, Target, TrendingUp, BookOpen, Lock, Quote } from "lucide-react";

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
    <section className="relative py-32 px-6 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(200 90% 52% / 0.06) 0%, transparent 65%)", transform: "translate(20%, -20%)" }}
      />
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionTag>For Professional Services</SectionTag>
            <p className="text-sm font-semibold mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
              For Managing Partners &amp; Practice Leaders
            </p>
            <h1 className="text-5xl font-black mb-6 leading-tight">
              Your expertise is
              <br />
              <GradientText>your last moat.</GradientText>
            </h1>
            <p className="text-lg leading-relaxed mb-5" style={{ color: "hsl(var(--muted-foreground))" }}>
              Clients won't pay for what ChatGPT can do. The frameworks and templates your firm used to charge €300/hr for are commoditised by default.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
              What they actually pay for — the pattern recognition, contextual judgment, and heuristics your seniors carry — was never written down. We help you change that.
            </p>

            <div className="flex flex-col gap-3 mb-10">
              {[
                "€20,000 – €35,000 engagement fee",
                "2–3 senior practitioners required",
                "4 weeks, structured sprints",
                "Delivered inside LIZA OS — yours to keep",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(var(--brand-green))" }} />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
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
                Apply for a Sprint <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/platform"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border"
                style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
              >
                See the Platform
              </Link>
            </div>
          </div>

          {/* Pricing card */}
          <div
            className="relative rounded-2xl p-10 border overflow-hidden"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--primary) / 0.25)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>Engagement Fee</p>
            <p className="text-5xl font-black mb-2">€20–35k</p>
            <p className="text-sm mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>Fixed price. No hourly billing. No scope creep.</p>
            <div className="h-px mb-8" style={{ background: "hsl(var(--border))" }} />
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>What's included</p>
            {[
              { icon: <Brain className="w-5 h-5" />, title: "Methodology Audit", desc: "A structured analysis of your current knowledge assets — what's explicit, what's tacit, and where the most critical judgment gaps are." },
              { icon: <Layers className="w-5 h-5" />, title: "2 Executable Knowledge Bundles", desc: "Two fully structured bundles inside LIZA OS — Playbooks, Procedures, Directives, and Principles — built from your senior expertise." },
              { icon: <Target className="w-5 h-5" />, title: "30-Day Productisation Roadmap", desc: "A concrete plan for turning your codified expertise into a licensable knowledge product — with pricing model, target buyer, and packaging format." },
            ].map((d, i) => (
              <div key={i} className="flex items-start gap-3 mb-5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                >
                  {d.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold">{d.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Three-Layer Problem ───────────────────────────────────────────────────────

function ThreeLayers() {
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
    <section className="py-32 px-6" style={{ background: "hsl(var(--card))" }}>
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
                background: c.highlight ? "hsl(var(--primary) / 0.04)" : "hsl(var(--background))",
                borderColor: c.highlight ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))",
                opacity: c.dim ? 0.65 : 1,
              }}
            >
              {c.highlight && <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />}
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

// ── 4-Week Sprint ─────────────────────────────────────────────────────────────

const WEEKS = [
  { n: "Week 1", title: "Audit & Discovery", desc: "We map your existing knowledge assets and identify the highest-value tacit layer — the judgment that isn't captured anywhere." },
  { n: "Week 2", title: "Extraction Sessions", desc: "Structured interviews with your 2–3 most senior practitioners. LIZA OS capture tools accelerate and structure the process." },
  { n: "Week 3", title: "Codification in LIZA OS", desc: "We build your knowledge bundles — categorised, versioned, and structured as executable protocols ready to deploy." },
  { n: "Week 4", title: "Productisation Strategy", desc: "We define how your packaged expertise becomes a scalable offering: licensing model, pricing, and go-to-market." },
];

function SprintStructure() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag>The 4-Week Structure</SectionTag>
          <h2 className="text-4xl font-black">How the sprint works.</h2>
        </div>
        <div className="relative">
          <div
            className="absolute left-[27px] top-4 bottom-4 w-px"
            style={{ background: "hsl(var(--primary) / 0.15)" }}
          />
          <div className="flex flex-col gap-10">
            {WEEKS.map((w, i) => (
              <div key={i} className="flex items-start gap-7">
                <div
                  className="w-14 h-14 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-black text-sm relative z-10"
                  style={{
                    background: "hsl(var(--background))",
                    borderColor: "hsl(var(--primary) / 0.4)",
                    color: "hsl(var(--primary))",
                  }}
                >
                  {i + 1}
                </div>
                <div className="pt-2">
                  <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "hsl(var(--primary))" }}>{w.n}</p>
                  <h3 className="text-lg font-bold mb-2">{w.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Social Proof ──────────────────────────────────────────────────────────────

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
          {[
            {
              firm: "12-person strategy consultancy · EU market",
              quote: "\"We had two founding partners whose judgment was the firm. After the sprint, those decision patterns were running inside every junior client engagement — without them in the room.\"",
              metrics: [{ v: "2×", l: "senior leverage within 60 days" }, { v: "€8K", l: "MRR from packaged knowledge product" }],
            },
            {
              firm: "Boutique M&A advisory · 8 practitioners",
              quote: "\"Our most experienced partner was planning to retire. We ran the sprint to capture her deal intuition. Now that judgment is embedded in how we qualify and structure every new mandate.\"",
              metrics: [{ v: "35%", l: "faster deal qualification cycle" }, { v: "100%", l: "of tacit IP retained after retirement" }],
            },
          ].map((cs, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-10 border overflow-hidden"
              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
              <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>{cs.firm}</p>
              <Quote className="w-8 h-8 mb-4" style={{ color: "hsl(var(--primary) / 0.4)" }} />
              <p className="text-base leading-relaxed mb-8 font-medium">{cs.quote}</p>
              <div className="grid grid-cols-2 gap-6">
                {cs.metrics.map((m, j) => (
                  <div key={j}>
                    <p className="text-3xl font-black brand-gradient-text">{m.v}</p>
                    <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{m.l}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Outcomes card */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { metric: "35%", label: "avg productivity gain in execution teams within 60 days" },
            { metric: "2×", label: "senior leverage — same team, double the output capacity" },
            { metric: "€6K+", label: "monthly recurring potential once expertise is productised" },
          ].map((o, i) => (
            <div
              key={i}
              className="rounded-2xl p-8 border text-center"
              style={{ background: "hsl(var(--primary) / 0.03)", borderColor: "hsl(var(--primary) / 0.15)" }}
            >
              <p className="text-5xl font-black brand-gradient-text mb-2">{o.metric}</p>
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{o.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Who It's For ──────────────────────────────────────────────────────────────

const WHO = [
  "Agency founders or Managing Partners who see margin compression on standard deliverables",
  "Consultancies worried about losing IP when senior practitioners retire or leave",
  "Professional services firms that want to scale capacity without adding headcount",
  "Practice leads looking to create a recurring revenue stream from existing expertise",
];

function WhoItsFor() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionTag>Who It's For</SectionTag>
            <h2 className="text-4xl font-black mb-6">
              Built for senior
              <br />
              <GradientText>professional services leaders.</GradientText>
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
              This engagement is not for teams that haven't started thinking about AI. It's for leaders who've already seen the margin pressure and are ready to act on it.
            </p>
            <div className="flex flex-col gap-4">
              {WHO.map((w, i) => (
                <div key={i} className="flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: "hsl(var(--primary))" }} />
                  <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{w}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Founder note */}
          <div
            className="relative rounded-2xl p-10 border overflow-hidden"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--primary) / 0.15)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black mb-6"
              style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
            >
              LO
            </div>
            <p className="text-sm font-semibold mb-3">Built by practitioners, for practitioners.</p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              LIZA OS was built by a team with 15+ years across management consulting, AI systems design, and organisational knowledge management. We've run the sprint ourselves — and built the platform on what we learned.
            </p>
            <p className="text-xs font-bold" style={{ color: "hsl(var(--primary))" }}>
              We take on 3 sprint engagements per quarter. Currently booking Q2.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────

function CTABand() {
  return (
    <section className="py-32 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-3xl mx-auto text-center">
        <div
          className="relative rounded-3xl p-16 border overflow-hidden"
          style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--primary) / 0.2)" }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, hsl(200 90% 52% / 0.07) 0%, transparent 65%)" }}
          />
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "var(--gradient-brand)" }} />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">
              Ready to <GradientText>protect your moat?</GradientText>
            </h2>
            <p className="text-base mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
              Book a 30-minute discovery call. We'll assess whether the sprint is right for your firm — no commitment required.
            </p>
            <p className="text-xs mb-8 font-semibold" style={{ color: "hsl(var(--primary))" }}>
              We take on 3 sprint engagements per quarter. Currently booking Q2.
            </p>
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
              Apply for a Sprint <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfessionalServicesPage() {
  return (
    <MarketingLayout>
      <Hero />
      <ThreeLayers />
      <SprintStructure />
      <SocialProof />
      <WhoItsFor />
      <CTABand />
    </MarketingLayout>
  );
}
