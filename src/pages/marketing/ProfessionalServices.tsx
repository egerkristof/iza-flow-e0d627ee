import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  ArrowRight, CheckCircle2, XCircle, Brain, Layers, TrendingUp,
  BookOpen, Lock, Quote, Zap, Shield, BarChart3,
} from "lucide-react";
import { TeamSection } from "@/components/marketing/TeamSection";

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

// ── Semantic color: desired = green, undesired = muted ────────────────────────
const GRN = "155 72% 46%";

function GradientText({ children }: { children: React.ReactNode }) {
  return <span className="brand-gradient-text">{children}</span>;
}

function SectionTag({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <p
      className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-6"
      style={{ color: `hsl(var(--primary))`, borderColor: `hsl(var(--primary) / 0.25)`, background: `hsl(var(--primary) / 0.06)` }}
    >
      {icon}{label}
    </p>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div
        className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 65%)`, transform: "translate(20%, -20%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionTag label="AI Effectiveness Sprint" />
            <p className="text-sm font-semibold mb-4" style={{ color: `hsl(var(--primary) / 0.8)` }}>
              For Managing Partners &amp; Practice Leaders in professional services
            </p>
            <h1 className="text-5xl font-black mb-6 leading-[1.08]">
              Your expertise is
              <br />
              <GradientText>your last moat.</GradientText>
            </h1>
            <p className="text-lg leading-relaxed mb-5 text-muted-foreground">
              Clients won't pay for what ChatGPT can do. The frameworks and templates your firm used to charge €300/hr for are commoditised by default.
            </p>
            <p className="text-base leading-relaxed mb-5 text-muted-foreground">
              What they actually pay for — the pattern recognition, contextual judgment, and heuristics your seniors carry — was never written down.{" "}
              <span className="font-semibold text-foreground">We help you change that. In 4 weeks.</span>
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
                  boxShadow: `0 0 32px -4px hsl(var(--primary) / 0.4)`,
                }}
              >
                Book a Discovery Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/platform"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border text-muted-foreground"
                style={{ borderColor: "hsl(var(--border))" }}
              >
                See the Platform
              </Link>
            </div>
          </div>

          {/* Journey A → B card */}
          <div
            className="relative rounded-2xl border overflow-hidden"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
            <div className="p-8">
              <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: `hsl(var(--primary))` }}>
                Where firms start vs. where they end up
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { from: "Senior judgment trapped in individuals", to: "Expertise codified & executable" },
                  { from: "Margin shrinking on commoditised deliverables", to: "Premium positioning on unique IP" },
                  { from: "Capacity bottlenecked by senior availability", to: "Juniors executing at senior standard" },
                  { from: "IP walks out the door when partners leave", to: "Institutional knowledge that compounds" },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
                    <div
                      className="rounded-lg p-3 text-xs leading-snug text-muted-foreground"
                      style={{ background: "hsl(var(--muted) / 0.5)", borderLeft: "2px solid hsl(var(--muted-foreground) / 0.3)" }}
                    >
                      {row.from}
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: `hsl(${GRN})` }} />
                    <div
                      className="rounded-lg p-3 text-xs leading-snug font-medium"
                      style={{ background: `hsl(${GRN} / 0.08)`, color: `hsl(${GRN})`, borderLeft: `2px solid hsl(${GRN} / 0.5)` }}
                    >
                      {row.to}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="mt-6 rounded-lg px-4 py-3 flex items-center gap-3"
                style={{ background: `hsl(${GRN} / 0.08)`, borderLeft: `3px solid hsl(${GRN})` }}
              >
                <Zap className="w-4 h-4 shrink-0" style={{ color: `hsl(${GRN})` }} />
                <p className="text-xs font-semibold" style={{ color: `hsl(${GRN})` }}>
                  4 weeks. Delivered inside LIZA OS. Yours to keep, no lock-in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PROOF: Sound familiar? ────────────────────────────────────────────────────
function Proof() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Sound familiar?" />
          <h2 className="text-4xl font-black mb-4">
            The problem isn't your expertise.
            <br />
            <GradientText>It's that it can't scale without you.</GradientText>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            Every professional services firm faces the same ceiling.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: <BookOpen className="w-5 h-5" />,
              tag: "Layer 1 — Commoditised",
              title: "Frameworks & templates",
              desc: "The structured deliverables your firm built over years. ChatGPT produces them in seconds. Clients know it.",
              desired: false,
            },
            {
              icon: <Lock className="w-5 h-5" />,
              tag: "Layer 2 — Bottlenecked",
              title: "Senior expert judgment",
              desc: "The real differentiator. Pattern recognition built over decades. But it lives inside two or three people — and can't scale without them in the room.",
              desired: false,
            },
            {
              icon: <TrendingUp className="w-5 h-5" />,
              tag: "Layer 3 — The Opportunity",
              title: "Codified expertise",
              desc: "Your unique value, turned into executable protocols that run without you. This is the layer that protects your margin and lets your firm scale.",
              desired: true,
            },
          ].map((c, i) => (
            <div
              key={i}
              className="relative rounded-2xl border overflow-hidden p-7"
              style={{
                background: c.desired ? `hsl(${GRN} / 0.06)` : "hsl(var(--muted) / 0.3)",
                borderColor: c.desired ? `hsl(${GRN} / 0.35)` : "hsl(var(--border))",
                boxShadow: c.desired ? `0 0 28px -8px hsl(${GRN} / 0.2)` : "none",
              }}
            >
              {c.desired && <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${GRN})` }} />}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: c.desired ? `hsl(${GRN} / 0.12)` : "hsl(var(--muted))",
                    color: c.desired ? `hsl(${GRN})` : "hsl(var(--muted-foreground))",
                  }}>
                  {c.icon}
                </div>
                <span className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: c.desired ? `hsl(${GRN})` : "hsl(var(--muted-foreground))" }}>{c.tag}</span>
              </div>
              <h3 className="text-lg font-bold mb-2">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── LIZA OS DIFFERENTIATOR ────────────────────────────────────────────────────
function LizaDifferentiator() {
  return (
    <section className="py-20 px-6 border-t border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="What makes LIZA OS the differentiator" icon={<Zap className="w-3 h-3" />} />
          <h2 className="text-4xl font-black mb-4">
            Not interviews with a report at the end.
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            The extraction, codification, and governance all happen{" "}
            <span className="font-semibold text-foreground">inside LIZA OS</span> — so you leave with a system that actually runs, not a slide deck.
          </p>
        </div>

        {/* 3-column comparison: undesired = muted, desired = green */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              label: "Traditional consulting", cross: true,
              items: ["Discovery workshops and interviews", "Insights captured in meeting notes", "Delivered as a PDF report", "Sits on a shelf after handoff"],
              outcome: "A document you own",
              icon: <BookOpen className="w-5 h-5" />,
            },
            {
              label: "AI tool rollout", cross: true,
              items: ["Licences bought, training run", "Each person prompts their own way", "No shared standard or governance", "Knowledge stays in individual heads"],
              outcome: "Access without alignment",
              icon: <Brain className="w-5 h-5" />,
            },
            {
              label: "LIZA OS Sprint", cross: false,
              items: ["Experts define knowledge inside LIZA OS", "Tacit judgment becomes executable playbooks", "Protocols run live — enforced at point of use", "Every session feeds back into the system"],
              outcome: "A living operating system",
              icon: <Zap className="w-5 h-5" />,
            },
          ].map((col, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden flex flex-col"
              style={{
                background: col.cross ? "hsl(var(--muted) / 0.3)" : `hsl(${GRN} / 0.07)`,
                borderColor: col.cross ? "hsl(var(--border))" : `hsl(${GRN} / 0.4)`,
                boxShadow: col.cross ? "none" : `0 0 28px -8px hsl(${GRN} / 0.2)`,
              }}
            >
              <div className="h-[3px]" style={{ background: col.cross ? "hsl(var(--muted-foreground) / 0.2)" : `hsl(${GRN})` }} />
              <div className="p-7 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-5">
                  <div style={{ color: col.cross ? "hsl(var(--muted-foreground))" : `hsl(${GRN})` }}>{col.icon}</div>
                  <p className="font-bold text-sm" style={{ color: col.cross ? "hsl(var(--muted-foreground))" : `hsl(${GRN})` }}>{col.label}</p>
                </div>
                <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                  {col.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      {col.cross
                        ? <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground/50" />
                        : <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: `hsl(${GRN})` }} />
                      }
                      {item}
                    </li>
                  ))}
                </ul>
                <div
                  className="rounded-lg px-4 py-3 border"
                  style={{
                    background: col.cross ? "hsl(var(--muted) / 0.5)" : `hsl(${GRN} / 0.12)`,
                    borderColor: col.cross ? "hsl(var(--border))" : `hsl(${GRN} / 0.4)`,
                  }}
                >
                  <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: col.cross ? "hsl(var(--muted-foreground))" : `hsl(${GRN})` }}>Result</p>
                  <p className="font-semibold text-sm" style={{ color: col.cross ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))" }}>{col.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* What "inside LIZA OS" means */}
        <div
          className="rounded-2xl border p-8 relative overflow-hidden"
          style={{ background: `hsl(var(--primary) / 0.05)`, borderColor: `hsl(var(--primary) / 0.25)` }}
        >
          <div
            className="absolute right-0 top-0 w-[400px] h-[300px] pointer-events-none"
            style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.08), transparent 65%)`, transform: "translate(30%, -20%)" }}
          />
          <div className="relative z-10">
            <p className="font-bold tracking-widest uppercase text-xs mb-4" style={{ color: `hsl(var(--primary))` }}>
              What "inside LIZA OS" means in practice
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: "1", tag: "Surface", label: "Your experts describe their highest-value client engagements — inside LIZA OS capture tools." },
                { step: "2", tag: "Codify", label: "LIZA OS structures that into playbooks: intent, protocol steps, and knowledge injection." },
                { step: "3", tag: "Test", label: "We run real client scenarios inside LIZA OS — stress-testing the playbooks before go-live." },
                { step: "4", tag: "Embed", label: "Your teams execute against the live protocols. Every session compresses learning back in." },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border p-5" style={{ background: `hsl(var(--primary) / 0.05)`, borderColor: `hsl(var(--primary) / 0.2)` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center font-black text-xs" style={{ background: `hsl(var(--primary) / 0.15)`, color: `hsl(var(--primary))` }}>
                      {item.step}
                    </div>
                    <span className="font-bold text-xs tracking-widest uppercase" style={{ color: `hsl(var(--primary))` }}>{item.tag}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
              <p className="text-sm font-semibold text-foreground">
                Full ownership. No lock-in.{" "}
                <span className="text-muted-foreground">The protocols, playbooks, and knowledge base are yours — export or continue independently at any time.</span>
              </p>
              <Link
                to="/platform"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80 whitespace-nowrap"
                style={{ borderColor: `hsl(var(--primary) / 0.4)`, color: `hsl(var(--primary))`, background: `hsl(var(--primary) / 0.08)` }}
              >
                Explore the platform <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 4-WEEK JOURNEY ────────────────────────────────────────────────────────────
function SprintJourney() {
  const weeks = [
    { n: "Week 1", title: "Audit & Discovery", tag: "Surface", desc: "We map your existing knowledge assets and identify the highest-value tacit layer — the judgment that isn't captured anywhere. You'll see clearly what's at risk and what's worth protecting." },
    { n: "Week 2", title: "Extraction Sessions", tag: "Surface → Codify", desc: "Structured sessions with your 2–3 most senior practitioners. LIZA OS capture tools accelerate the process — surfacing heuristics, decision rules, and judgment patterns in real time." },
    { n: "Week 3", title: "Codification in LIZA OS", tag: "Codify", desc: "We build your knowledge bundles — categorised, versioned, and stress-tested against real engagement scenarios. You see your expertise running live before the sprint ends." },
    { n: "Week 4", title: "Embed & Activate", tag: "Embed", desc: "Your teams execute against the live protocols inside LIZA OS. We define how this becomes a scalable capability — whether that's internal operating standard, client-facing product, or both." },
  ];

  return (
    <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="The 4-Week Structure" />
          <h2 className="text-4xl font-black mb-4">
            Your journey from{" "}
            <GradientText>trapped to scalable.</GradientText>
          </h2>
          <p className="text-base text-muted-foreground">
            Every week has a clear objective. Every output lives in LIZA OS, not in a slide deck.
          </p>
        </div>
        <div className="relative">
          <div className="absolute left-[27px] top-4 bottom-4 w-px" style={{ background: `hsl(var(--primary) / 0.15)` }} />
          <div className="flex flex-col gap-10">
            {weeks.map((w, i) => (
              <div key={i} className="flex items-start gap-7">
                <div
                  className="w-14 h-14 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-black text-sm relative z-10"
                  style={{ background: "hsl(var(--background))", borderColor: `hsl(var(--primary) / 0.4)`, color: `hsl(var(--primary))` }}
                >
                  {i + 1}
                </div>
                <div className="pt-2 flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <p className="text-xs font-bold tracking-widest uppercase" style={{ color: `hsl(var(--primary))` }}>{w.n}</p>
                    <span
                      className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                      style={{ background: `hsl(var(--primary) / 0.12)`, color: `hsl(var(--primary))` }}
                    >{w.tag}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{w.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── WHAT YOU LEAVE WITH ───────────────────────────────────────────────────────
function Deliverables() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="What You Leave With" />
          <h2 className="text-4xl font-black mb-4">
            Not a report. <GradientText>An operating system.</GradientText>
          </h2>
          <p className="text-lg max-w-xl mx-auto text-muted-foreground">
            Everything is built inside LIZA OS and handed to you — versioned, governed, and ready to run without us in the room.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: <BarChart3 className="w-5 h-5" />, title: "Methodology Audit", desc: "A structured analysis of your current knowledge assets — what's explicit, what's tacit, and where the most critical judgment gaps are." },
            { icon: <Layers className="w-5 h-5" />, title: "2 Executable Knowledge Bundles", desc: "Two fully structured bundles inside LIZA OS — Playbooks, Procedures, Directives, and Principles — built from your senior expertise. Ready to run." },
            { icon: <TrendingUp className="w-5 h-5" />, title: "90-Day Activation Roadmap", desc: "A concrete plan for how your codified expertise spreads across the firm — with rollout sequence, enablement approach, and governance model." },
          ].map((d, i) => (
            <div key={i} className="rounded-2xl border p-8" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: `hsl(var(--primary) / 0.1)`, color: `hsl(var(--primary))` }}>
                {d.icon}
              </div>
              <h3 className="text-base font-bold mb-2">{d.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: `hsl(${GRN} / 0.05)`, borderColor: `hsl(${GRN} / 0.2)` }}>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: `hsl(${GRN})` }} />
            <p className="text-sm font-medium">
              <span className="text-foreground">Full IP ownership. No lock-in.</span>{" "}
              <span className="text-muted-foreground">The protocols, playbooks, and knowledge base are yours — export or continue independently at any time.</span>
            </p>
          </div>
          <Link to="/platform"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80 whitespace-nowrap"
            style={{ borderColor: `hsl(var(--primary) / 0.4)`, color: `hsl(var(--primary))`, background: `hsl(var(--primary) / 0.08)` }}>
            Explore the platform <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── SOCIAL PROOF ──────────────────────────────────────────────────────────────
function SocialProof() {
  return (
    <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="Client Outcomes" />
          <h2 className="text-4xl font-black mb-4">
            What happens when you
            <br />
            <GradientText>codify the judgment layer.</GradientText>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {[
            {
              firm: "12-person strategy consultancy · EU market",
              quote: "\"We had two founding partners whose judgment was the firm. After the sprint, those decision patterns were running inside every junior client engagement — without them in the room.\"",
              metrics: [{ v: "2×", l: "senior leverage within 60 days" }, { v: "40%", l: "reduction in senior time per engagement" }],
            },
            {
              firm: "Boutique M&A advisory · 8 practitioners",
              quote: "\"Our most experienced partner was planning to retire. We ran the sprint to capture her deal intuition. Now that judgment is embedded in how we qualify and structure every new mandate.\"",
              metrics: [{ v: "35%", l: "faster deal qualification cycle" }, { v: "100%", l: "of tacit IP retained after retirement" }],
            },
          ].map((cs, i) => (
            <div key={i} className="relative rounded-2xl p-10 border overflow-hidden" style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
              <p className="text-xs font-bold tracking-widest uppercase mb-6 text-muted-foreground">{cs.firm}</p>
              <Quote className="w-8 h-8 mb-4" style={{ color: `hsl(var(--primary) / 0.4)` }} />
              <p className="text-base leading-relaxed mb-8 font-medium">{cs.quote}</p>
              <div className="grid grid-cols-2 gap-6">
                {cs.metrics.map((m, j) => (
                  <div key={j}>
                    <p className="text-3xl font-black brand-gradient-text">{m.v}</p>
                    <p className="text-xs mt-1 text-muted-foreground">{m.l}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── WHO IT'S FOR ──────────────────────────────────────────────────────────────
function WhoItsFor() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <SectionTag label="Who It's For" />
            <h2 className="text-4xl font-black mb-6">
              Built for senior
              <br />
              <GradientText>professional services leaders.</GradientText>
            </h2>
            <p className="text-base leading-relaxed mb-8 text-muted-foreground">
              This engagement is not for teams that haven't started thinking about AI. It's for leaders who've already seen the margin pressure and are ready to act on it.
            </p>
            <div className="flex flex-col gap-4">
              {[
                "Agency founders or Managing Partners who see margin compression on standard deliverables",
                "Consultancies worried about losing IP when senior practitioners retire or leave",
                "Professional services firms that want to scale capacity without adding headcount",
                "Practice leads whose best work is trapped inside the heads of two or three people",
              ].map((w, i) => (
                <div key={i} className="flex items-start gap-3">
                  <TrendingUp className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: `hsl(var(--primary))` }} />
                  <p className="text-sm leading-relaxed text-muted-foreground">{w}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl p-10 border overflow-hidden" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
            <p className="text-xs font-bold tracking-widest uppercase mb-6 text-muted-foreground">Typical Outcomes</p>
            {[
              { metric: "35%", label: "avg productivity gain in execution teams within 60 days" },
              { metric: "2×", label: "senior leverage — same team, double the output capacity" },
              { metric: "4 wks", label: "from kickoff to a fully governed knowledge operating system" },
            ].map((o, i) => (
              <div key={i} className="mb-8">
                <p className="text-5xl font-black brand-gradient-text mb-1">{o.metric}</p>
                <p className="text-sm text-muted-foreground">{o.label}</p>
                {i < 2 && <div className="mt-6 h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative rounded-3xl p-16 border overflow-hidden" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] pointer-events-none"
            style={{ background: `radial-gradient(ellipse, hsl(var(--primary) / 0.07) 0%, transparent 65%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "var(--gradient-brand)" }} />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">
              Ready to <GradientText>protect your moat?</GradientText>
            </h2>
            <p className="text-base mb-2 text-muted-foreground">
              Book a 30-minute discovery call. We'll assess whether the sprint is right for your firm — no commitment required.
            </p>
            <p className="text-xs mb-8 font-semibold" style={{ color: `hsl(var(--primary))` }}>
              We take on 3 sprint engagements per quarter. Currently booking Q2.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: `0 0 32px -4px hsl(var(--primary) / 0.4)`,
                }}>
                Book a Discovery Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link to="/platform"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border text-muted-foreground"
                style={{ borderColor: "hsl(var(--border))" }}>
                Explore LIZA OS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function ProfessionalServicesPage() {
  return (
    <MarketingLayout>
      <Hero />
      <Proof />
      <LizaDifferentiator />
      <SprintJourney />
      <Deliverables />
      <SocialProof />
      <WhoItsFor />
      <TeamSection />
      <CTA />
    </MarketingLayout>
  );
}
