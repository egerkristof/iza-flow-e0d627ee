import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ArrowRight, CheckCircle2, Layers, Brain, TrendingUp, Target } from "lucide-react";

const CAL_URL = "https://cal.com/lizaos/discovery";

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

// ── Deliverables ──────────────────────────────────────────────────────────────

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
    desc: "A concrete plan for turning your codified expertise into a licensable knowledge product — with pricing model, target buyer, and packaging format.",
  },
];

const WEEKS = [
  { n: "Week 1", title: "Audit & Discovery", desc: "We map your existing knowledge assets and identify the highest-value tacit layer — the judgment that isn't captured anywhere." },
  { n: "Week 2", title: "Extraction Sessions", desc: "Structured interviews with your 2–3 most senior practitioners. LIZA OS capture tools accelerate and structure the process." },
  { n: "Week 3", title: "Codification in LIZA OS", desc: "We build your knowledge bundles — categorised, versioned, and structured as executable protocols ready to deploy." },
  { n: "Week 4", title: "Productisation Strategy", desc: "We define how your packaged expertise becomes a scalable offering: licensing model, pricing, and go-to-market." },
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
      {/* Hero */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(200 90% 52% / 0.05) 0%, transparent 65%)", transform: "translate(20%, -20%)" }}
        />
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionTag>AI Effectiveness Sprint</SectionTag>
              {/* Above-the-fold buyer clarity */}
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
                {["€20,000 – €35,000 engagement fee", "2–3 senior practitioners required", "4 weeks, structured sprints", "Delivered inside LIZA OS — yours to keep"].map((item, i) => (
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
              <p className="text-sm mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
                Fixed price. No hourly billing. No scope creep.
              </p>
              <div className="h-px mb-8" style={{ background: "hsl(var(--border))" }} />
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>What's included</p>
              {DELIVERABLES.map((d, i) => (
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

      {/* 4-week timeline */}
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

      {/* Who it's for */}
      <section className="py-24 px-6">
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
                { metric: "€6K+", label: "monthly recurring potential once expertise is productised" },
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

      {/* CTA */}
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
    </MarketingLayout>
  );
}
