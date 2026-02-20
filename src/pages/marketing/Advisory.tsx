import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  ArrowRight, CheckCircle2, XCircle, Layers, Brain,
  TrendingUp, Target, Zap, BookOpen, Shield,
} from "lucide-react";

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

// ── 3-step LIZA OS flow (hero card) ──────────────────────────────────────────

const STEPS = [
  {
    n: "01",
    tag: "Surface",
    title: "Identify the tacit layer",
    desc: "Structured sessions with your 2–3 most senior practitioners. We surface the judgment that isn't written down anywhere — inside LIZA OS capture tools.",
    col: "var(--brand-green, 155 72% 46%)",
    colHsl: "155 72% 46%",
  },
  {
    n: "02",
    tag: "Codify",
    title: "Build executable bundles",
    desc: "We structure everything into Playbooks, Procedures, Directives, and Principles inside LIZA OS — versioned, governed, and ready to run.",
    col: "200 90% 52%",
    colHsl: "200 90% 52%",
  },
  {
    n: "03",
    tag: "Productise",
    title: "Turn expertise into a scalable offering",
    desc: "We define how your codified knowledge becomes a licensable product or internal operating system — with a go-to-market plan and packaging format.",
    col: "38 92% 55%",
    colHsl: "38 92% 55%",
  },
];

// ── Weeks ────────────────────────────────────────────────────────────────────

const WEEKS = [
  {
    n: "Week 1",
    title: "Audit & Discovery",
    desc: "We map your existing knowledge assets and identify the highest-value tacit layer — the judgment that isn't captured anywhere.",
    tag: "Surface",
    tagCol: "155 72% 46%",
  },
  {
    n: "Week 2",
    title: "Extraction Sessions",
    desc: "Structured interviews with your senior practitioners. LIZA OS capture tools accelerate and structure the process in real time.",
    tag: "Surface → Codify",
    tagCol: "200 90% 52%",
  },
  {
    n: "Week 3",
    title: "Codification in LIZA OS",
    desc: "We build your knowledge bundles — categorised, versioned, and structured as executable protocols stress-tested against real scenarios.",
    tag: "Codify",
    tagCol: "200 90% 52%",
  },
  {
    n: "Week 4",
    title: "Productisation Strategy",
    desc: "We define how your packaged expertise becomes a scalable offering: licensing model, go-to-market approach, and packaging format.",
    tag: "Productise",
    tagCol: "38 92% 55%",
  },
];

// ── What you leave with ───────────────────────────────────────────────────────

const DELIVERABLES = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Methodology Audit",
    desc: "A structured analysis of your current knowledge assets — what's explicit, what's tacit, and where the most critical judgment gaps are.",
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "2 Executable Knowledge Bundles",
    desc: "Two fully structured bundles inside LIZA OS — Playbooks, Procedures, Directives, and Principles — built from your senior expertise. Ready to run.",
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "30-Day Productisation Roadmap",
    desc: "A concrete plan for turning your codified expertise into a licensable knowledge product — with target buyer, packaging format, and go-to-market steps.",
  },
];

const WHO = [
  "Agency founders or Managing Partners who see margin compression on standard deliverables",
  "Consultancies worried about losing IP when senior practitioners retire or leave",
  "Professional services firms that want to scale capacity without adding headcount",
  "Practice leads looking to create a recurring revenue stream from existing expertise",
];

export default function AdvisoryPage() {
  return (
    <MarketingLayout>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(200 90% 52% / 0.05) 0%, transparent 65%)", transform: "translate(20%, -20%)" }}
        />
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left — copy */}
            <div>
              <SectionTag>AI Effectiveness Sprint</SectionTag>
              <p className="text-sm font-semibold mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
                For Managing Partners &amp; Practice Leaders in professional services
              </p>
              <h1 className="text-5xl font-black mb-6 leading-tight">
                4 weeks to
                <br />
                <GradientText>packaged expertise.</GradientText>
              </h1>
              <p className="text-lg leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
                A hands-on advisory engagement where we work directly with your senior practitioners to extract, codify, and package the tacit knowledge that makes your firm different — before it walks out the door.
              </p>
              <div className="flex flex-col gap-3 mb-10">
                {[
                  "2–3 senior practitioners required",
                  "4 weeks, structured sprints",
                  "Delivered inside LIZA OS — yours to keep",
                  "No lock-in. Full IP ownership.",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "hsl(155 72% 46%)" }} />
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

            {/* Right — LIZA OS 3-step card */}
            <div
              className="relative rounded-2xl border overflow-hidden"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--primary) / 0.2)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
              <div className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                  <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
                    How it works inside LIZA OS
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {STEPS.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-xl border p-5"
                      style={{ background: `hsl(${s.colHsl} / 0.05)`, borderColor: `hsl(${s.colHsl} / 0.2)` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center font-black text-xs"
                          style={{ background: `hsl(${s.colHsl} / 0.15)`, color: `hsl(${s.colHsl})` }}
                        >
                          {s.n}
                        </div>
                        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: `hsl(${s.colHsl})` }}>
                          {s.tag}
                        </span>
                      </div>
                      <p className="font-semibold text-sm mb-1">{s.title}</p>
                      <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{s.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-5 font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                  Full ownership. No lock-in. The playbooks and protocols are yours — export or run independently at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What makes this different ──────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-b" style={{ borderColor: "hsl(var(--primary) / 0.08)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionTag><Zap className="w-3 h-3" /> What makes LIZA OS the differentiator</SectionTag>
            <h2 className="text-4xl font-black mb-4">
              Not interviews with a report at the end.
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              The extraction, codification, and governance all happen{" "}
              <span className="font-semibold" style={{ color: "hsl(var(--foreground))" }}>inside LIZA OS</span> — so you leave with a system that actually runs, not a slide deck.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Traditional consulting",
                items: ["Discovery interviews and workshops", "Insights captured in meeting notes", "Delivered as a PDF report", "Sits on a shelf after handoff"],
                outcome: "A document you own",
                colHsl: "0 72% 63%",
                icon: <BookOpen className="w-5 h-5" />,
                cross: true,
              },
              {
                label: "AI tool rollout",
                items: ["Licences bought, training run", "Each person prompts their own way", "No shared standard or governance", "Knowledge stays in individual heads"],
                outcome: "Access without alignment",
                colHsl: "38 92% 55%",
                icon: <Brain className="w-5 h-5" />,
                cross: true,
              },
              {
                label: "LIZA OS Sprint",
                items: ["Experts define knowledge inside LIZA OS", "Tacit judgment becomes executable playbooks", "Protocols run live — enforced at point of use", "Every session feeds back into the system"],
                outcome: "A living knowledge product",
                colHsl: "155 72% 46%",
                icon: <Zap className="w-5 h-5" />,
                cross: false,
              },
            ].map((col, i) => (
              <div
                key={i}
                className="rounded-2xl border overflow-hidden flex flex-col"
                style={{
                  background: col.cross ? `hsl(${col.colHsl} / 0.03)` : `hsl(${col.colHsl} / 0.07)`,
                  borderColor: col.cross ? `hsl(${col.colHsl} / 0.15)` : `hsl(${col.colHsl} / 0.4)`,
                  boxShadow: col.cross ? "none" : `0 0 28px -8px hsl(${col.colHsl} / 0.2)`,
                }}
              >
                <div className="h-[3px]" style={{ background: `hsl(${col.colHsl})`, opacity: col.cross ? 0.4 : 1 }} />
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-5">
                    <div style={{ color: `hsl(${col.colHsl})`, opacity: col.cross ? 0.6 : 1 }}>{col.icon}</div>
                    <p className="font-bold text-sm" style={{ color: col.cross ? `hsl(${col.colHsl} / 0.7)` : `hsl(${col.colHsl})` }}>{col.label}</p>
                  </div>
                  <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                    {col.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                        {col.cross
                          ? <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: `hsl(${col.colHsl} / 0.5)` }} />
                          : <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: `hsl(${col.colHsl})` }} />
                        }
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div
                    className="rounded-lg px-4 py-3 border"
                    style={{
                      background: col.cross ? `hsl(${col.colHsl} / 0.04)` : `hsl(${col.colHsl} / 0.12)`,
                      borderColor: col.cross ? `hsl(${col.colHsl} / 0.15)` : `hsl(${col.colHsl} / 0.4)`,
                    }}
                  >
                    <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: col.cross ? `hsl(${col.colHsl} / 0.6)` : `hsl(${col.colHsl})` }}>
                      Result
                    </p>
                    <p className="font-semibold text-sm" style={{ color: col.cross ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))" }}>{col.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4-week timeline ────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
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
                    className="w-14 h-14 rounded-full border-2 flex items-center justify-center flex-shrink-0 font-black text-xs relative z-10"
                    style={{
                      background: "hsl(var(--background))",
                      borderColor: "hsl(var(--primary) / 0.4)",
                      color: "hsl(var(--primary))",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="pt-2 flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>{w.n}</p>
                      <span
                        className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
                        style={{ background: `hsl(${w.tagCol} / 0.12)`, color: `hsl(${w.tagCol})` }}
                      >
                        {w.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{w.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What you leave with ────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag>What You Leave With</SectionTag>
            <h2 className="text-4xl font-black mb-4">
              Not a report. <GradientText>An operating system.</GradientText>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              Everything is built inside LIZA OS and handed to you — versioned, governed, and ready to run without us in the room.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {DELIVERABLES.map((d, i) => (
              <div
                key={i}
                className="rounded-2xl border p-8"
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                >
                  {d.icon}
                </div>
                <h3 className="text-base font-bold mb-2">{d.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{d.desc}</p>
              </div>
            ))}
          </div>

          {/* Ownership callout */}
          <div
            className="mt-8 rounded-2xl border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: "hsl(var(--primary) / 0.05)", borderColor: "hsl(var(--primary) / 0.2)" }}
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "hsl(var(--primary))" }} />
              <p className="text-sm font-medium">
                <span style={{ color: "hsl(var(--foreground))" }}>Full IP ownership. No lock-in.</span>{" "}
                <span style={{ color: "hsl(var(--muted-foreground))" }}>The protocols, playbooks, and knowledge base are yours — export or continue independently at any time.</span>
              </p>
            </div>
            <Link
              to="/platform"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80 whitespace-nowrap"
              style={{ borderColor: "hsl(var(--primary) / 0.4)", color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.08)" }}
            >
              Explore the platform <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Who it's for ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
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

            <div
              className="relative rounded-2xl p-10 border overflow-hidden"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--primary) / 0.15)" }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
              <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>Typical Client Outcomes</p>
              {[
                { metric: "35%", label: "avg productivity gain in execution teams within 60 days" },
                { metric: "2×", label: "senior leverage — same team, double the output capacity" },
                { metric: "4 wks", label: "from kickoff to a fully governed knowledge operating system" },
              ].map((o, i) => (
                <div key={i} className="mb-8">
                  <p className="text-5xl font-black brand-gradient-text mb-1">{o.metric}</p>
                  <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>{o.label}</p>
                  {i < 2 && <div className="mt-6 h-px" style={{ background: "hsl(var(--border))" }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="relative rounded-3xl p-16 border overflow-hidden"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--primary) / 0.2)" }}
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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
                  Explore LIZA OS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
