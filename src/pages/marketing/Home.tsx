import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  ArrowRight, CheckCircle2, Brain, Layers, Zap, Shield, Lock,
  BookOpen, TrendingUp, Target, BarChart3,
} from "lucide-react";


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
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <SectionTag label="The Knowledge Operating System" icon={<Zap className="w-3 h-3" />} />
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-[1.08]">
          Your best people
          <br />
          <GradientText>can't be everywhere.</GradientText>
        </h1>
        <p className="text-lg leading-relaxed mb-8 text-muted-foreground max-w-2xl mx-auto">
          LIZA extracts senior expertise and turns it into executable protocols your entire organisation runs on.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/extract"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: `0 0 32px -4px hsl(var(--primary) / 0.4)`,
            }}
          >
            Try the Extraction Engine <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border text-muted-foreground hover:text-foreground transition-colors"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            See How It Works ↓
          </a>
        </div>
      </div>
    </section>
  );
}

// ── THE PROBLEM — Pain cards ─────────────────────────────────────────────────
function Problem() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="The Problem" />
          <h2 className="text-4xl font-black mb-4">
            Your expertise doesn't scale.
            <br />
            <GradientText>AI makes it worse.</GradientText>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: <BookOpen className="w-5 h-5" />,
              title: "Knowledge walks out",
              desc: "Your best people carry methodology in their heads. Every resignation is a knowledge loss event.",
            },
            {
              icon: <Target className="w-5 h-5" />,
              title: "Execution is inconsistent",
              desc: "Same brief, 14 different outputs. Quality depends on who supervises. No shared standard.",
            },
            {
              icon: <BarChart3 className="w-5 h-5" />,
              title: "AI accelerates the mess",
              desc: "Generic AI gives everyone content generation — with zero organisational context. Faster at producing the wrong thing.",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="rounded-2xl border p-7"
              style={{ background: "hsl(var(--muted) / 0.3)", borderColor: "hsl(var(--border))" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                {c.icon}
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

// ── PRODUCT IN ACTION — Narrative Screenshot Flow ────────────────────────────
function ProductInAction() {
  const [lightbox, setLightbox] = useState<{ src: string; tag: string } | null>(null);

  const narrative = [
    {
      src: "/images/product-extract-blueprint.png",
      tag: "Extract",
      title: "Upload a document. Get a structured blueprint.",
      desc: "Drop in a process document, policy, or playbook PDF. LIZA detects bundles, playbooks, procedures, and merges duplicates — ready for review before a single line is written.",
      accent: "200 90% 52%",
    },
    {
      src: "/images/product-design-domains.png",
      tag: "Organise",
      title: "Your entire organisation's knowledge. One map.",
      desc: "Extracted expertise lands in domains — Sales, Operations, Finance, Legal. Each domain holds bundles of playbooks that define how your organisation actually works.",
      accent: "155 72% 46%",
    },
    {
      src: "/images/product-design-playbook.png",
      tag: "Design",
      title: "Every playbook. Every step. Every gate.",
      desc: "Drill into any playbook to see its procedures, compliance gates, coaching notes, and output requirements. This is your methodology — codified and version-controlled.",
      accent: "38 92% 50%",
    },
    {
      src: "/images/product-execute-launchpad.png",
      tag: "Deploy",
      title: "Teams don't guess. They launch.",
      desc: "Operators open a workbook and see every playbook available to them as an action card. No blank page. No prompt engineering. Just: pick a playbook, start a session.",
      accent: "var(--primary)",
    },
    {
      src: "/images/product-execute-protocol.png",
      tag: "Execute",
      title: "Guided execution. Step by step.",
      desc: "Each protocol session walks the operator through procedures in sequence. The AI generates drafts using your organisation's context — not generic output.",
      accent: "200 90% 52%",
    },
    {
      src: "/images/product-learn-debrief.png",
      tag: "Learn",
      title: "The system watches. Then it thinks.",
      desc: "After execution, LIZA synthesises patterns across all sessions — surfacing drift, compliance gaps, and deep work prompts that challenge your assumptions.",
      accent: "270 60% 65%",
    },
  ];

  return (
    <>
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionTag label="The Product" icon={<Zap className="w-3 h-3" />} />
            <h2 className="text-4xl font-black mb-4">
              Your knowledge in.
              <br />
              <GradientText>Your operating system out.</GradientText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From raw expertise to governed execution — told in six screens.
            </p>
          </div>

          <div className="flex flex-col gap-20">
            {narrative.map((s, i) => {
              const isEven = i % 2 === 0;
              const accentVal = s.accent.includes("--") ? `hsl(${s.accent})` : `hsl(${s.accent})`;
              return (
                <div
                  key={i}
                  className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-12`}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className="rounded-2xl border overflow-hidden shadow-2xl cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                      style={{
                        borderColor: `${accentVal.replace(")", " / 0.25)")}`,
                        boxShadow: `0 8px 40px -12px ${accentVal.replace(")", " / 0.15)")}`,
                      }}
                      onClick={() => setLightbox({ src: s.src, tag: s.tag })}
                    >
                      <img
                        src={s.src}
                        alt={`LIZA OS — ${s.tag}`}
                        className="w-full h-auto block"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 md:w-[320px] text-center md:text-left">
                    <span
                      className="inline-block text-[11px] font-black tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full border"
                      style={{
                        color: accentVal,
                        borderColor: `${accentVal.replace(")", " / 0.3)")}`,
                        background: `${accentVal.replace(")", " / 0.08)")}`,
                      }}
                    >
                      {s.tag}
                    </span>
                    <h3 className="text-xl font-black mb-3 leading-tight">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 cursor-pointer animate-fade-in"
          style={{ background: "hsla(0 0% 0% / 0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox.src}
            alt={`LIZA OS — ${lightbox.tag}`}
            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}


function ExecutionCycle() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="The Flywheel" />
          <h2 className="text-4xl font-black mb-4">
            Execute. Learn. <GradientText>Encode.</GradientText>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your organisation gets smarter with every project — automatically.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Target className="w-6 h-6" />,
              step: "01",
              title: "Execute",
              desc: "Protocol-driven workflows replace blank-page guessing. Every team member runs your best methodology.",
            },
            {
              icon: <Brain className="w-6 h-6" />,
              step: "02",
              title: "Learn",
              desc: "After every session, the system captures decisions and deviations. Structured reviews synthesise patterns.",
            },
            {
              icon: <Zap className="w-6 h-6" />,
              step: "03",
              title: "Encode",
              desc: "Approved learnings flow back into the knowledge graph. The organisation compounds with each project.",
            },
          ].map(({ icon, step, title, desc }) => (
            <div key={title} className="rounded-2xl border p-7 flex flex-col gap-4"
              style={{ background: `hsl(var(--primary) / 0.04)`, borderColor: `hsl(var(--primary) / 0.2)` }}>
              <div className="flex items-center gap-3">
                <span className="font-black text-3xl" style={{ color: `hsl(var(--primary) / 0.2)`, lineHeight: 1 }}>{step}</span>
                <div style={{ color: `hsl(var(--primary))` }}>{icon}</div>
              </div>
              <p className="font-bold text-lg">{title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── OUTCOMES ──────────────────────────────────────────────────────────────────
function Outcomes() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Already Running" />
          <h2 className="text-4xl font-black mb-4">
            Real outcomes. <GradientText>Real numbers.</GradientText>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { tag: "Sales Protocol Engine", stat: "8 wks vs 9 months", desc: "Encode your best seller's judgment. Every rep executes at senior level from day one.", col: "38 92% 50%" },
            { tag: "Audit Automation", stat: "23× faster", desc: "Encode every criterion and rule. Run audits with 80% less groundwork.", col: "200 90% 52%" },
            { tag: "Decision Extraction", stat: "Week 1 ready", desc: "Not transcripts. Structured decisions, routed to where they matter.", col: GRN },
            { tag: "Smart Briefing", stat: "0 check-ins", desc: "Generate briefs with full context. People execute correctly first time.", col: "270 60% 65%" },
          ].map((uc, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-7 border overflow-hidden"
              style={{ background: `hsl(${uc.col} / 0.03)`, borderColor: `hsl(${uc.col} / 0.2)` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${uc.col})` }} />
              <span className="text-xs font-black tracking-widest uppercase" style={{ color: `hsl(${uc.col})` }}>{uc.tag}</span>
              <p className="text-2xl font-black mt-3 mb-2">{uc.stat}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{uc.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/use-cases" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(var(--primary))" }}>
            See all use cases in detail <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── GET STARTED ──────────────────────────────────────────────────────────────
function GetStarted() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="Get Started" />
          <h2 className="text-4xl font-black mb-4">
            Start with <GradientText>one process.</GradientText>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The Protocol Sprint turns one senior expert's judgment into an executable protocol your team runs on. Five days, fixed scope.
          </p>
        </div>

        <div className="relative rounded-2xl border overflow-hidden"
          style={{ background: "hsl(var(--primary) / 0.04)", borderColor: "hsl(var(--primary) / 0.3)" }}>
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "var(--gradient-brand)" }} />
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
                The Protocol Sprint
              </span>
            </div>

            <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <div className="flex flex-col gap-2 mb-6">
                  {[
                    "Document intake + 90-min structured interview",
                    "Semantic analysis and codification via LIZA OS",
                    "Master Protocol: PDF + live digital system",
                    "Knowledge gap report + team onboarding",
                  ].map((d, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: `hsl(${GRN})` }} />
                      <p className="text-sm text-muted-foreground">{d}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/sprint"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
                  style={{
                    background: "var(--gradient-brand-btn)",
                    color: "hsl(var(--primary-foreground))",
                    boxShadow: "0 0 24px -4px hsl(var(--primary) / 0.4)",
                  }}
                >
                  See the Protocol Sprint <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                <div className="rounded-lg border px-5 py-3" style={{ borderColor: "hsl(var(--primary) / 0.15)" }}>
                  <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Timeline</p>
                  <p className="text-xl font-black" style={{ color: "hsl(var(--primary))" }}>5 Days</p>
                </div>
                <div className="rounded-lg border px-5 py-3" style={{ borderColor: "hsl(var(--primary) / 0.15)" }}>
                  <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Best for</p>
                  <p className="text-sm font-semibold">Any team with senior expertise to scale</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// ── PLATFORM FEATURES ────────────────────────────────────────────────────────
function Features() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Platform Capabilities" />
          <h2 className="text-4xl font-black">
            Everything you need to
            <br />
            <GradientText>institutionalise judgment.</GradientText>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: <Brain className="w-5 h-5" />, title: "Knowledge Extraction", desc: "Surfaces the tacit layer from process docs, transcripts, and interviews." },
            { icon: <Layers className="w-5 h-5" />, title: "Context Bundles", desc: "Playbooks, Procedures, Directives, and Principles — versioned and governed." },
            { icon: <Zap className="w-5 h-5" />, title: "Protocol Execution", desc: "Deploy bundles as executable protocols inside AI workbooks." },
            { icon: <TrendingUp className="w-5 h-5" />, title: "Institutional Memory", desc: "Every execution captures learning back into the system." },
            { icon: <Lock className="w-5 h-5" />, title: "Governance", desc: "Role-based access, mandate enforcement, and audit trails." },
            { icon: <Shield className="w-5 h-5" />, title: "Oversight", desc: "Track what your team executes and where drift happens." },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl p-7 border"
              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold mb-2">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FINAL CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative rounded-3xl p-16 border overflow-hidden" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] pointer-events-none"
            style={{ background: `radial-gradient(ellipse, hsl(var(--primary) / 0.07) 0%, transparent 65%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "var(--gradient-brand)" }} />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">
              Your team's knowledge is already there.
              <br />
              <GradientText>Let's build with it.</GradientText>
            </h2>
            <p className="text-base mb-8 text-muted-foreground">
              30 minutes. We'll scope the right engagement for your team's size and complexity.
            </p>
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: `0 0 32px -4px hsl(var(--primary) / 0.4)`,
              }}>
              Book a Discovery Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <MarketingLayout>
      <Hero />
      <Problem />
      <ProductInAction />
      <GetStarted />
      <Outcomes />
      <FinalCTA />
    </MarketingLayout>
  );
}
