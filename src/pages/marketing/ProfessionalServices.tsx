import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  ArrowRight, CheckCircle2, XCircle, Brain, Layers, TrendingUp,
  BookOpen, Lock, Quote, Zap, Shield, BarChart3, Mic, Cpu, FileText, ClipboardCheck,
} from "lucide-react";
import { TeamSection } from "@/components/marketing/TeamSection";

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

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
            <SectionTag label="The Knowledge Extraction Sprint" />
            <p className="text-sm font-semibold mb-4" style={{ color: `hsl(var(--primary) / 0.8)` }}>
              For Managing Partners &amp; Practice Leaders
            </p>
            <h1 className="text-5xl font-black mb-6 leading-[1.08]">
              Productize your
              <br />
              senior judgment
              <br />
              <GradientText>in 5 days.</GradientText>
            </h1>
            <p className="text-lg leading-relaxed mb-5 text-muted-foreground">
              Stop relying on your Senior Partner's brain as a bottleneck. We feed your existing process documentation, protocols, meeting transcripts, and a structured senior interview into the <span className="font-semibold text-foreground">Liza Context Engine</span>, and it outputs an executable Digital Protocol.
            </p>
            <p className="text-base leading-relaxed mb-5 text-muted-foreground">
              You walk in with knowledge trapped in people.{" "}
              <span className="font-semibold text-foreground">You walk out with a system that standardises their best practices across your entire team.</span>
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
                Book a Protocol Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                  5 days. Delivered inside LIZA OS. Yours to keep, no lock-in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PROCESS VISUALIZATION ("The Asset") ───────────────────────────────────────
function ProcessVisualization() {
  const steps = [
    { icon: <FileText className="w-6 h-6" />, label: "Your Existing\nKnowledge", sub: "Docs, protocols, transcripts, interviews" },
    { icon: <Cpu className="w-6 h-6" />, label: "Liza Context\nEngine", sub: "Semantic analysis & structuring" },
    { icon: <FileText className="w-6 h-6" />, label: "Master\nProtocol", sub: "PDF + Digital executable system" },
  ];

  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="How It Works" icon={<Zap className="w-3 h-3" />} />
          <h2 className="text-4xl font-black mb-4">
            We input your knowledge.
            <br />
            <GradientText>Liza outputs your Operating System.</GradientText>
          </h2>
        </div>

        {/* Pipeline diagram */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex flex-col items-center text-center w-48">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 border-2"
                  style={{
                    background: i === 1 ? `hsl(var(--primary) / 0.1)` : i === 2 ? `hsl(${GRN} / 0.08)` : "hsl(var(--muted) / 0.5)",
                    borderColor: i === 1 ? `hsl(var(--primary) / 0.3)` : i === 2 ? `hsl(${GRN} / 0.3)` : "hsl(var(--border))",
                    color: i === 1 ? `hsl(var(--primary))` : i === 2 ? `hsl(${GRN})` : "hsl(var(--muted-foreground))",
                    boxShadow: i === 1 ? `0 0 24px -6px hsl(var(--primary) / 0.3)` : "none",
                  }}
                >
                  {s.icon}
                </div>
                <p className="font-bold text-sm whitespace-pre-line leading-tight mb-1">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="w-6 h-6 shrink-0 hidden md:block" style={{ color: `hsl(var(--primary) / 0.4)` }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PRODUCT BOX (The Menu) ────────────────────────────────────────────────────
function ProductBox() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div
          className="relative rounded-3xl border-2 overflow-hidden"
          style={{ borderColor: `hsl(var(--primary) / 0.3)`, background: "hsl(var(--card))" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "var(--gradient-brand)" }} />
          <div
            className="absolute top-0 right-0 w-[400px] h-[300px] pointer-events-none"
            style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.06), transparent 65%)`, transform: "translate(30%, -20%)" }}
          />

          <div className="relative z-10 p-10 md:p-14">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `hsl(var(--primary) / 0.1)`, color: `hsl(var(--primary))` }}
              >
                <ClipboardCheck className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: `hsl(var(--primary))` }}>
                The Product
              </p>
            </div>

            <h2 className="text-3xl md:text-4xl font-black mb-3">
              The Knowledge Extraction Sprint
            </h2>
            <p className="text-muted-foreground text-base mb-10 max-w-lg">
              A fixed-scope engagement that turns senior expert judgment into a governed, executable digital protocol.
            </p>

            {/* Deliverables */}
            <div className="mb-10">
              <p className="text-xs font-bold tracking-widest uppercase mb-4 text-muted-foreground">Deliverables</p>
              <div className="grid gap-3">
                {[
                  "Document intake: your existing process docs, protocols, and meeting transcripts",
                  "90-minute structured interview with your senior practitioner",
                  "Liza Semantic Analysis & Structuring: automated codification",
                  'The "Master Protocol": delivered as PDF & live digital system in LIZA OS',
                  "Implementation Guide: rollout plan for your team",
                ].map((d, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: `hsl(${GRN})` }} />
                    <p className="text-sm">{d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline + Price row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div
                className="rounded-xl border p-5"
                style={{ background: `hsl(var(--primary) / 0.04)`, borderColor: `hsl(var(--primary) / 0.15)` }}
              >
                <p className="text-xs font-bold tracking-widest uppercase mb-1 text-muted-foreground">Timeline</p>
                <p className="text-2xl font-black" style={{ color: `hsl(var(--primary))` }}>1 Week</p>
                <p className="text-xs text-muted-foreground mt-1">From kickoff to delivered protocol</p>
              </div>
              <div
                className="rounded-xl border p-5"
                style={{ background: `hsl(var(--primary) / 0.04)`, borderColor: `hsl(var(--primary) / 0.15)` }}
              >
                <p className="text-xs font-bold tracking-widest uppercase mb-1 text-muted-foreground">Investment</p>
                <p className="text-2xl font-black" style={{ color: `hsl(var(--primary))` }}>On enquiry</p>
                <p className="text-xs text-muted-foreground mt-1">Fixed scope, no surprises</p>
              </div>
            </div>

            {/* CTA */}
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
              Book a Protocol Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PROOF: Sound familiar? ────────────────────────────────────────────────────
function Proof() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Sound familiar?" />
          <h2 className="text-4xl font-black mb-4">
            The problem isn't your expertise.
            <br />
            <GradientText>It's that your best practices don't scale.</GradientText>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            Every professional services firm faces the same ceiling.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: <BookOpen className="w-5 h-5" />,
              tag: "Layer 1: Commoditised",
              title: "Frameworks & templates",
              desc: "The structured deliverables your firm built over years. ChatGPT produces them in seconds. Clients know it.",
              desired: false,
            },
            {
              icon: <Lock className="w-5 h-5" />,
              tag: "Layer 2: Bottlenecked",
              title: "Senior expert judgment",
              desc: "The real differentiator. Pattern recognition built over decades. But it lives inside two or three people and can't be standardised across the firm.",
              desired: false,
            },
            {
              icon: <TrendingUp className="w-5 h-5" />,
              tag: "Layer 3: The Opportunity",
              title: "Codified expertise",
              desc: "Your unique value, turned into executable protocols that standardise your best practices. This is the layer that protects your margin and lets your firm scale.",
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
          <SectionTag label="Why this isn't consulting" icon={<Zap className="w-3 h-3" />} />
          <h2 className="text-4xl font-black mb-4">
            Not interviews with a report at the end.
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">
            The extraction, codification, and governance all happen{" "}
            <span className="font-semibold text-foreground">inside LIZA OS</span>, so you leave with a system that actually runs, not a slide deck.
          </p>
          <p className="text-base max-w-2xl mx-auto mt-4 text-muted-foreground">
            This isn't about AI. Firms have struggled to standardise senior expertise for decades. AI just made the extraction possible at a speed and depth that wasn't feasible before.
          </p>
        </div>

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
              items: ["Experts define knowledge inside LIZA OS", "Tacit judgment becomes executable playbooks", "Protocols run live, enforced at point of use", "Every session feeds back into the system"],
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
              quote: "\"We had two founding partners whose judgment was the firm. After the sprint, those decision patterns were standardised inside every junior client engagement, consistently and at scale.\"",
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
              { metric: "2×", label: "senior leverage: same team, double the output capacity" },
              { metric: "5 days", label: "from kickoff to a fully governed knowledge protocol" },
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
              Ready to <GradientText>productize your judgment?</GradientText>
            </h2>
            <p className="text-base mb-2 text-muted-foreground">
              Book a 30-minute Protocol Assessment. We'll diagnose whether your expertise is extractable and show you exactly what the output looks like.
            </p>
            <p className="text-xs mb-8 font-semibold" style={{ color: `hsl(var(--primary))` }}>
              We take on 4 sprint engagements per month. Currently booking March.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: `0 0 32px -4px hsl(var(--primary) / 0.4)`,
                }}>
                Book a Protocol Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
      <ProcessVisualization />
      <ProductBox />
      <Proof />
      <LizaDifferentiator />
      <SocialProof />
      <WhoItsFor />
      <TeamSection />
      <CTA />
    </MarketingLayout>
  );
}
