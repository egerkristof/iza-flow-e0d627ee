import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  ArrowRight, Zap, FileText, Play, Users, Brain,
  TrendingUp, ShieldCheck, Briefcase, MessageSquare,
  Sparkles, Target, Layers,
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
        <SectionTag label="Execution infrastructure" icon={<Zap className="w-3 h-3" />} />
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-[1.08]">
          Your expertise is documented.
          <br />
          <GradientText>It's not operational.</GradientText>
        </h1>
        <p className="text-lg leading-relaxed mb-8 text-muted-foreground max-w-2xl mx-auto">
          Confluence pages, SOPs, playbooks on paper. But every project is still a fresh start. LIZA turns what your organisation knows into what it actually does.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/beta"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: `0 0 32px -4px hsl(var(--primary) / 0.4)`,
            }}
          >
            Join the Private Beta <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={() => document.getElementById("semantic-debt")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border text-muted-foreground hover:text-foreground transition-colors"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            See the problem ↓
          </button>
        </div>
      </div>
    </section>
  );
}

// ── SEMANTIC DEBT ────────────────────────────────────────────────────────────
function SemanticDebt() {
  return (
    <section id="semantic-debt" className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="The gap" />
          <h2 className="text-4xl font-black mb-4">
            Semantic debt. <GradientText>The real bottleneck.</GradientText>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The gap between what your organisation knows and what it actually does. It compounds silently, then shows up as inconsistency, rework, and dependency on key people.
          </p>
        </div>

        {/* Visual: Documented ←→ Operational gap */}
        <div className="flex flex-col md:flex-row items-stretch gap-4 mb-12 max-w-3xl mx-auto">
          <div className="flex-1 rounded-2xl border p-7 text-center"
            style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--muted) / 0.3)" }}>
            <FileText className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Documented</p>
            <p className="text-lg font-black">What you know</p>
            <p className="text-xs text-muted-foreground mt-2">Confluence, SOPs, PDFs, wikis, tribal knowledge</p>
          </div>
          <div className="flex items-center justify-center px-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-16 h-[2px] bg-destructive/40" />
              <span className="text-[10px] font-black tracking-widest uppercase text-destructive">Gap</span>
              <div className="w-16 h-[2px] bg-destructive/40" />
            </div>
          </div>
          <div className="flex-1 rounded-2xl border p-7 text-center"
            style={{ borderColor: `hsl(${GRN} / 0.35)`, background: `hsl(${GRN} / 0.06)` }}>
            <Play className="w-8 h-8 mx-auto mb-3" style={{ color: `hsl(${GRN})` }} />
            <p className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: `hsl(${GRN})` }}>Operational</p>
            <p className="text-lg font-black">What you do</p>
            <p className="text-xs text-muted-foreground mt-2">How projects actually run, decisions get made, work gets done</p>
          </div>
        </div>

        {/* Symptoms */}
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: "Every project is a fresh start",
              desc: "Despite best-in-class processes on paper, teams reinvent the wheel because the knowledge isn't wired into how they work.",
              col: "38 92% 50%",
            },
            {
              title: "Results depend on who runs it",
              desc: "Your best people carry the methodology in their heads. Everyone else follows the document, misses the judgment.",
              col: "200 90% 52%",
            },
            {
              title: "AI made this worse, not better",
              desc: "Now everyone has their own ChatGPT memory, Claude project, Copilot setup. More tools, same gap. More silos, less consistency.",
              col: "270 60% 65%",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="relative rounded-2xl border p-7 overflow-hidden"
              style={{ background: `hsl(${c.col} / 0.03)`, borderColor: `hsl(${c.col} / 0.2)` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${c.col})` }} />
              <h3 className="text-lg font-bold mb-2">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── WHAT LIZA IS — The bridge ───────────────────────────────────────────────
function WhatLizaIs() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl border p-8 md:p-12 relative overflow-hidden"
          style={{ borderColor: `hsl(${GRN} / 0.3)`, background: `hsl(${GRN} / 0.03)` }}>
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${GRN})` }} />
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `hsl(${GRN} / 0.12)`, color: `hsl(${GRN})` }}>
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-3">
                LIZA turns static documents into <GradientText>executable knowledge.</GradientText>
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                Not another project management tool. Not another wiki. LIZA is execution infrastructure. It takes your existing processes, playbooks, and expertise, and makes them operational.
              </p>
              <p className="text-sm font-semibold">
                The bridge between knowing what to do and actually doing it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CAPABILITIES (bottom-up) ────────────────────────────────────────────────
const CAPABILITIES = [
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Co-prompt with your team",
    desc: "Group chats with shared context. Not just messaging. AI-assisted collaboration where the system understands what everyone is working on.",
    col: "200 90% 52%",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "LIZA learns from every interaction",
    desc: "Your best practices, prohibitions, standards, purpose. The system absorbs them. Next time you work, it's faster and more accurate.",
    col: "38 92% 50%",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Others learn from you. You learn from others.",
    desc: "Context isn't locked in one person's AI tool. What the best consultant knows becomes available to the whole team, structured and live.",
    col: GRN,
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Delegate your thinking, not just your tasks",
    desc: "Generate briefs that carry your intent, judgment, and standards. People execute correctly because they have the full context.",
    col: "270 60% 65%",
  },
];

function Capabilities() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="How it works" icon={<Sparkles className="w-3 h-3" />} />
          <h2 className="text-4xl font-black mb-4">
            Work together. <GradientText>Get sharper together.</GradientText>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every interaction makes the system more accurate. Your organisation gets faster because the binding infrastructure is AI plus live context.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {CAPABILITIES.map((cap, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-7 border overflow-hidden"
              style={{ background: `hsl(${cap.col} / 0.03)`, borderColor: `hsl(${cap.col} / 0.2)` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${cap.col})` }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `hsl(${cap.col} / 0.12)`, color: `hsl(${cap.col})` }}>
                {cap.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{cap.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PRODUCT IN ACTION ────────────────────────────────────────────────────────
function ProductInAction() {
  const [lightbox, setLightbox] = useState<{ src: string; tag: string } | null>(null);

  const narrative = [
    {
      src: "/images/product-extract-blueprint.png",
      tag: "Extract",
      title: "Upload a process. Get a live playbook.",
      desc: "Drop in your Confluence page, SOP, or PDF. LIZA detects structure, resolves duplicates, and creates executable knowledge.",
      accent: "200 90% 52%",
    },
    {
      src: "/images/product-design-domains.png",
      tag: "Organise",
      title: "Your entire methodology. One map.",
      desc: "Every domain, every playbook, every procedure. Structured, versioned, and connected.",
      accent: GRN,
    },
    {
      src: "/images/product-design-playbook.png",
      tag: "Design",
      title: "Every step. Every gate. Every standard.",
      desc: "Drill into any playbook to see procedures, compliance gates, coaching notes, and output requirements.",
      accent: "38 92% 50%",
    },
    {
      src: "/images/product-execute-launchpad.png",
      tag: "Deploy",
      title: "Teams don't guess. They launch.",
      desc: "Operators see every playbook as an action card. No blank page. Pick a playbook, start a session with all context loaded.",
      accent: "var(--primary)",
    },
    {
      src: "/images/product-execute-protocol.png",
      tag: "Execute",
      title: "Guided execution. Step by step.",
      desc: "Each protocol walks the operator through procedures in sequence. AI generates drafts using your organisation's live context.",
      accent: "200 90% 52%",
    },
    {
      src: "/images/product-learn-debrief.png",
      tag: "Learn",
      title: "The system watches. Then it thinks.",
      desc: "After execution, LIZA synthesises patterns across sessions, surfacing drift, compliance gaps, and improvements.",
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
              From process on paper
              <br />
              <GradientText>to live playbooks.</GradientText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Six capabilities. One system. Static expertise becomes executable knowledge.
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
                      <img src={s.src} alt={`LIZA OS — ${s.tag}`} className="w-full h-auto block" loading="lazy" />
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

// ── USE CASES ────────────────────────────────────────────────────────────────
function UseCases() {
  const cases = [
    { icon: <Users className="w-5 h-5" />, title: "Onboard in weeks, not months", desc: "New hires run on senior-level judgment from week one. The playbook carries the expertise.", col: "200 90% 52%" },
    { icon: <TrendingUp className="w-5 h-5" />, title: "Every rep sells like your best", desc: "Deal qualification, objection handling, pricing judgment. Encoded and live for every rep.", col: "38 92% 50%" },
    { icon: <ShieldCheck className="w-5 h-5" />, title: "Protect revenue before dashboards turn red", desc: "Risk signals, renewal timing, expansion cues. Available to every AM, not just the best one.", col: GRN },
    { icon: <Briefcase className="w-5 h-5" />, title: "Delegate your thinking", desc: "Generate briefs that carry your intent, standards, and judgment. Zero check-ins needed.", col: "270 60% 65%" },
  ];

  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Already running" />
          <h2 className="text-4xl font-black mb-4">
            Executable knowledge <GradientText>in practice.</GradientText>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {cases.map((uc, i) => (
            <div key={i} className="relative rounded-2xl p-7 border overflow-hidden"
              style={{ background: `hsl(${uc.col} / 0.03)`, borderColor: `hsl(${uc.col} / 0.2)` }}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${uc.col})` }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `hsl(${uc.col} / 0.12)`, color: `hsl(${uc.col})` }}>
                {uc.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{uc.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{uc.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/use-cases" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "hsl(var(--primary))" }}>
            See all 7 use cases in detail <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── BETA CTA ─────────────────────────────────────────────────────────────────
function BetaCTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative rounded-3xl p-16 border overflow-hidden" style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] pointer-events-none"
            style={{ background: `radial-gradient(ellipse, hsl(var(--primary) / 0.07) 0%, transparent 65%)` }} />
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "var(--gradient-brand)" }} />
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-4">
              Stop documenting expertise.
              <br />
              <GradientText>Start executing it.</GradientText>
            </h2>
            <p className="text-base mb-4 text-muted-foreground">
              Private Beta. 1 month free. For teams of 5-30 where consistency matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/beta"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: `0 0 32px -4px hsl(var(--primary) / 0.4)`,
                }}>
                Join the Private Beta <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border text-muted-foreground hover:text-foreground transition-colors"
                style={{ borderColor: "hsl(var(--border))" }}>
                Book a Discovery Call
              </a>
            </div>
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
      <SemanticDebt />
      <WhatLizaIs />
      <Capabilities />
      <ProductInAction />
      <UseCases />
      <BetaCTA />
    </MarketingLayout>
  );
}
