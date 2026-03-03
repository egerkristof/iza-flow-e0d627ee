import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  ArrowRight, Zap, Brain, Users, TrendingUp, ShieldCheck, Briefcase,
  AlertTriangle, XCircle, Layers,
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
        <SectionTag label="Context infrastructure for AI teams" icon={<Zap className="w-3 h-3" />} />
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-[1.08]">
          Everyone has AI.
          <br />
          <GradientText>Nobody has context.</GradientText>
        </h1>
        <p className="text-lg leading-relaxed mb-8 text-muted-foreground max-w-2xl mx-auto">
          Your AI tools are only as good as the context behind them. LIZA is the live context layer that makes your team's AI actually work together.
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
            onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth", block: "start" })}
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

// ── THE PROBLEM — AI tools have memory now, but it's all siloed ─────────────
const AI_TOOLS = [
  { name: "ChatGPT", col: "171 76% 46%", icon: "🤖", feature: "Memory" },
  { name: "Claude", col: "24 80% 55%", icon: "🧠", feature: "Projects" },
  { name: "Gemini", col: "217 80% 55%", icon: "✨", feature: "Gems" },
  { name: "Copilot", col: "200 90% 52%", icon: "💡", feature: "Notebooks" },
  { name: "Perplexity", col: "270 60% 65%", icon: "🔍", feature: "Spaces" },
];

function TheProblem() {
  return (
    <section id="problem" className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="The real problem" />
          <h2 className="text-4xl font-black mb-4">
            Every AI tool now has "memory."
            <br />
            <GradientText>None of them share it.</GradientText>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ChatGPT has Memory. Claude has Projects. Gemini has Gems. Each one creates a personal knowledge silo that nobody else on your team can access.
          </p>
        </div>

        {/* Tool bubbles with their "memory" feature */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {AI_TOOLS.map((t) => (
            <div key={t.name} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border"
              style={{ borderColor: `hsl(${t.col} / 0.3)`, background: `hsl(${t.col} / 0.06)` }}>
              <span className="text-lg">{t.icon}</span>
              <span className="text-sm font-semibold">{t.name}</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{ background: `hsl(${t.col} / 0.15)`, color: `hsl(${t.col})` }}>
                {t.feature}
              </span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive">siloed</span>
            </div>
          ))}
        </div>

        {/* Pain cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: <Users className="w-5 h-5" />,
              title: "Context doesn't transfer",
              desc: "Your best consultant built an amazing Claude Project. Nobody else on the team can access, learn from, or build on it.",
              col: "200 90% 52%",
            },
            {
              icon: <AlertTriangle className="w-5 h-5" />,
              title: "Same brief, different answers",
              desc: "Two people run the same client brief through their personal AI setups. They get contradictory outputs. Neither knows why.",
              col: "38 92% 50%",
            },
            {
              icon: <XCircle className="w-5 h-5" />,
              title: "Knowledge walks out the door",
              desc: "When someone leaves, their Custom GPTs, Claude Projects, and prompt libraries leave with them. The team starts over.",
              col: "270 60% 65%",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="relative rounded-2xl border p-7 overflow-hidden"
              style={{ background: `hsl(${c.col} / 0.03)`, borderColor: `hsl(${c.col} / 0.2)` }}
            >
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${c.col})` }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `hsl(${c.col} / 0.12)`, color: `hsl(${c.col})` }}>
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

// ── THE MISSING LAYER — Context infrastructure ──────────────────────────────
function MissingLayer() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl border p-8 md:p-12 relative overflow-hidden"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
          <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "var(--gradient-brand)" }} />
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-3">
                The problem isn't AI. <GradientText>It's the layer underneath.</GradientText>
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed mb-4">
                AI tools got smarter. But the context they run on is still scattered across docs, Slack threads, wikis, and people's heads. Every tool builds its own tiny memory. None of it connects.
              </p>
              <p className="text-sm font-semibold">
                LIZA is the shared context infrastructure that sits underneath all of them. Structure your team's expertise once. Every tool, every person, every decision runs on the same live context.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CONTEXT MATURITY LADDER ─────────────────────────────────────────────────
const MATURITY_STEPS = [
  { n: 1, label: "Personal", sub: "Everyone uses their own AI tool with their own context", desired: false, tag: "most teams start here", tagPulse: true },
  { n: 2, label: "Sharing", sub: "Teams share prompts and templates, but not the context behind them", desired: false, tag: null, tagPulse: false },
  { n: 3, label: "Embedded", sub: "AI is integrated, but each person's context is siloed", desired: false, tag: "where AI efforts plateau", tagPulse: false },
  { n: 4, label: "Connected", sub: "Live, shared context powers every AI interaction", desired: true, tag: "← LIZA takes you here", tagPulse: false },
  { n: 5, label: "Composable", sub: "Context is your operating system. AI executes your methodology.", desired: true, tag: "North Star", tagPulse: false },
];

function MaturityLadder() {
  return (
    <section id="maturity" className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Where does your team sit?" />
          <h2 className="text-4xl font-black mb-4">
            Five levels of <GradientText>AI context maturity.</GradientText>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most teams plateau at Level 3. Better prompts won't fix it. The missing layer is shared, live context.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {MATURITY_STEPS.map((step) => {
            const colHsl = step.desired ? `hsl(${GRN})` : "hsl(var(--muted-foreground))";
            return (
              <div key={step.n} className="flex items-stretch rounded-xl border overflow-hidden"
                style={{
                  marginLeft: `${(step.n - 1) * 4}%`,
                  background: step.desired ? `hsl(${GRN} / 0.06)` : "hsl(var(--muted) / 0.4)",
                  borderColor: step.desired ? `hsl(${GRN} / 0.35)` : "hsl(var(--border))",
                  boxShadow: step.desired ? `0 0 20px -8px hsl(${GRN} / 0.2)` : "none",
                }}>
                <div className="w-1 shrink-0" style={{ background: colHsl, opacity: step.desired ? 1 : 0.25 }} />
                <div className="shrink-0 w-12 flex items-center justify-center border-r py-3"
                  style={{ borderColor: step.desired ? `hsl(${GRN} / 0.15)` : "hsl(var(--border))" }}>
                  <span className="font-black text-xl" style={{ color: colHsl }}>{step.n}</span>
                </div>
                <div className="flex-1 flex items-center px-4 py-3 gap-3 min-w-0 flex-wrap">
                  <span className="font-bold text-sm">{step.label}</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">·</span>
                  <span className="text-xs text-muted-foreground">{step.sub}</span>
                  {step.tag && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto ${
                      step.desired
                        ? "bg-emerald-500/10 text-emerald-600"
                        : step.tagPulse
                          ? "bg-amber-500/10 text-amber-600 animate-pulse"
                          : "bg-muted text-muted-foreground"
                    }`}>
                      {step.tag}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
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
      title: "Upload a document. Get structured context.",
      desc: "Drop in a process document, policy, or playbook. LIZA detects structure, resolves duplicates, and creates live context your AI can actually use.",
      accent: "200 90% 52%",
    },
    {
      src: "/images/product-design-domains.png",
      tag: "Organise",
      title: "Your entire organisation's context. One map.",
      desc: "Extracted knowledge lands in domains. Each domain holds the playbooks that define how your organisation actually works.",
      accent: GRN,
    },
    {
      src: "/images/product-design-playbook.png",
      tag: "Design",
      title: "Every playbook. Every step. Every gate.",
      desc: "Drill into any playbook to see procedures, compliance gates, coaching notes, and output requirements. Version-controlled.",
      accent: "38 92% 50%",
    },
    {
      src: "/images/product-execute-launchpad.png",
      tag: "Deploy",
      title: "Teams launch with full context.",
      desc: "Operators see every playbook as an action card. No blank page. Pick a playbook, start a session with the context already loaded.",
      accent: "var(--primary)",
    },
    {
      src: "/images/product-execute-protocol.png",
      tag: "Execute",
      title: "Guided execution. Context at every step.",
      desc: "Each protocol walks the operator through procedures in sequence. AI generates drafts using your organisation's live context.",
      accent: "200 90% 52%",
    },
    {
      src: "/images/product-learn-debrief.png",
      tag: "Learn",
      title: "The system watches. Context gets sharper.",
      desc: "After execution, LIZA synthesises patterns across sessions, surfacing drift, compliance gaps, and improvement prompts.",
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
              The context layer
              <br />
              <GradientText>your AI tools are missing.</GradientText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              LIZA structures your team's expertise into live context that powers every decision and every tool.
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

// ── USE CASES (compact, "with full context") ─────────────────────────────────
const USE_CASE_CARDS = [
  { icon: <Users className="w-5 h-5" />, title: "Onboarding with full context", desc: "New hires run on senior-level judgment from week one. Not because they read a wiki.", col: "200 90% 52%" },
  { icon: <TrendingUp className="w-5 h-5" />, title: "Sales calls with full context", desc: "Every rep has the same deal intelligence, objection logic, and positioning. Live.", col: "38 92% 50%" },
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Account management with full context", desc: "Risk signals, renewal timing, expansion cues. Available to every AM, not just the best one.", col: GRN },
  { icon: <Briefcase className="w-5 h-5" />, title: "Delegation with full context", desc: "Generate briefs that carry your intent, standards, and judgment. Zero check-ins needed.", col: "270 60% 65%" },
];

function UseCases() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Already running" />
          <h2 className="text-4xl font-black mb-4">
            What "full context" <GradientText>looks like in practice.</GradientText>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {USE_CASE_CARDS.map((uc, i) => (
            <div
              key={i}
              className="relative rounded-2xl p-7 border overflow-hidden"
              style={{ background: `hsl(${uc.col} / 0.03)`, borderColor: `hsl(${uc.col} / 0.2)` }}
            >
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
              Your team has AI.
              <br />
              <GradientText>Give them context.</GradientText>
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
      <TheProblem />
      <MissingLayer />
      <MaturityLadder />
      <ProductInAction />
      <UseCases />
      <BetaCTA />
    </MarketingLayout>
  );
}
