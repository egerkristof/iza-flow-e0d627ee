import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  ArrowRight, CheckCircle2, Brain, Layers, Zap, Shield, Lock,
  FileText, Mic, Cpu, BookOpen, TrendingUp, Target, BarChart3,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
            Book an Assessment Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <button
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-base font-medium border text-muted-foreground"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            See how it works ↓
          </button>
        </div>
      </div>
    </section>
  );
}

// ── WHAT YOU'RE DOING NOW vs LIZA ────────────────────────────────────────────
function Comparison() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="The Problem" />
          <h2 className="text-4xl font-black mb-4">
            How organisations try to scale expertise today.
            <br />
            <GradientText>None of it works.</GradientText>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              label: "Traditional consulting", cross: true,
              items: [
                "Months of workshops and interviews",
                "Delivered as a PDF on a shelf",
                "Stale the day it's written",
              ],
            },
            {
              label: "AI tool rollout", cross: true,
              items: [
                "Everyone prompts their own way",
                "No shared methodology or standard",
                "Knowledge stays in people's heads",
              ],
            },
            {
              label: "LIZA OS", cross: false,
              items: [
                "Expertise extracted into executable protocols",
                "Enforced at the point of work, not a shelf",
                "Every session feeds learning back into the system",
              ],
            },
          ].map((col, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden p-7"
              style={{
                background: col.cross ? "hsl(var(--muted) / 0.3)" : `hsl(${GRN} / 0.07)`,
                borderColor: col.cross ? "hsl(var(--border))" : `hsl(${GRN} / 0.4)`,
                boxShadow: col.cross ? "none" : `0 0 28px -8px hsl(${GRN} / 0.2)`,
              }}
            >
              <p className="font-bold text-sm mb-4" style={{ color: col.cross ? "hsl(var(--muted-foreground))" : `hsl(${GRN})` }}>{col.label}</p>
              <ul className="flex flex-col gap-2.5">
                {col.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    {col.cross
                      ? <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-muted-foreground/50" />
                      : <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: `hsl(${GRN})` }} />
                    }
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PRODUCT IN ACTION — Screenshots ──────────────────────────────────────────
function ProductInAction() {
  const screens = [
    { src: "/images/product-domains.png", label: "Design", desc: "Structure expertise into domain playbooks" },
    { src: "/images/product-playbooks.png", label: "Build", desc: "Codify protocols with executable steps" },
    { src: "/images/product-oversight.png", label: "Oversee", desc: "Track execution and detect drift" },
    { src: "/images/product-workbook.png", label: "Execute", desc: "Teams run protocols in AI workbooks" },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="The Product" icon={<Zap className="w-3 h-3" />} />
          <h2 className="text-4xl font-black mb-4">
            Your knowledge in.
            <br />
            <GradientText>Your operating system out.</GradientText>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From raw expertise to governed execution in four moves.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {screens.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden"
              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={s.src}
                  alt={`LIZA OS — ${s.label}`}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-black tracking-widest uppercase mb-1" style={{ color: "hsl(var(--primary))" }}>
                  {s.label}
                </p>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS — Pipeline ──────────────────────────────────────────────────
function Pipeline() {
  const steps = [
    { icon: <Mic className="w-6 h-6" />, label: "INPUT", title: "Your Existing Knowledge", desc: "Process documents, protocols, transcripts, and structured senior interviews.", col: "200 90% 52%" },
    { icon: <Cpu className="w-6 h-6" />, label: "PROCESS", title: "LIZA Context Engine", desc: "Analyses, categorises, and structures expertise into Playbooks, Procedures, Directives, Principles, and Knowledge items.", col: "155 72% 46%" },
    { icon: <FileText className="w-6 h-6" />, label: "OUTPUT", title: "Your Master Protocol", desc: "A structured, versioned, executable protocol. Ready to deploy into AI workbooks or run as automated workflows.", col: "38 92% 50%" },
  ];

  return (
    <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="The Engine" icon={<Cpu className="w-3 h-3" />} />
          <h2 className="text-4xl font-black mb-4">
            Messy knowledge in.
            <br />
            <GradientText>Executable protocol out.</GradientText>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex flex-col items-center text-center w-52">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 border-2"
                  style={{
                    background: `hsl(${s.col} / 0.1)`,
                    borderColor: `hsl(${s.col} / 0.3)`,
                    color: `hsl(${s.col})`,
                    boxShadow: i === 1 ? `0 0 24px -6px hsl(${s.col} / 0.3)` : "none",
                  }}
                >
                  {s.icon}
                </div>
                <span className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: `hsl(${s.col})` }}>{s.label}</span>
                <p className="font-bold text-sm leading-tight mb-1">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
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

// ── EXECUTE → LEARN → ENCODE cycle ──────────────────────────────────────────
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

// ── TWO WAYS TO GET STARTED ──────────────────────────────────────────────────
function GetStarted() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <SectionTag label="Get Started" />
          <h2 className="text-4xl font-black mb-4">
            Two ways to <GradientText>onboard your organisation.</GradientText>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We help you get LIZA running with your knowledge. Pick the scope that fits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Codify */}
          <div className="relative rounded-2xl border overflow-hidden flex flex-col"
            style={{ background: `hsl(var(--primary) / 0.04)`, borderColor: `hsl(var(--primary) / 0.3)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "hsl(var(--primary))" }} />
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
                  Codify Your Expertise
                </span>
              </div>
              <h3 className="text-2xl font-black mb-2">The Knowledge Extraction Sprint</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Turn one senior expert's judgment into an executable digital protocol in 5 days. Fixed scope, no surprises.
              </p>
              <div className="flex flex-col gap-2 mb-6 flex-1">
                {[
                  "Document intake + 90-min structured interview",
                  "Semantic analysis & codification via LIZA OS",
                  "Master Protocol: PDF + live digital system",
                ].map((d, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: `hsl(${GRN})` }} />
                    <p className="text-sm text-muted-foreground">{d}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="rounded-lg border px-4 py-2" style={{ borderColor: "hsl(var(--primary) / 0.15)" }}>
                  <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Timeline</p>
                  <p className="text-lg font-black" style={{ color: "hsl(var(--primary))" }}>1 Week</p>
                </div>
                <div className="rounded-lg border px-4 py-2" style={{ borderColor: "hsl(var(--primary) / 0.15)" }}>
                  <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Best for</p>
                  <p className="text-sm font-semibold">Partners & Practice Leads</p>
                </div>
              </div>
              <Link
                to="/codify"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                style={{ borderColor: "hsl(var(--primary) / 0.4)", color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.08)" }}
              >
                Learn more about the Sprint <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Scale */}
          <div className="relative rounded-2xl border overflow-hidden flex flex-col"
            style={{ background: `hsl(${GRN} / 0.04)`, borderColor: `hsl(${GRN} / 0.3)` }}>
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${GRN})` }} />
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(${GRN} / 0.1)`, color: `hsl(${GRN})` }}>
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: `hsl(${GRN})` }}>
                  Scale Your AI Motion
                </span>
              </div>
              <h3 className="text-2xl font-black mb-2">The AI Operating Model Programme</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Build the governed AI operating model across your whole team. Shared standards, visible governance, compounding knowledge.
              </p>
              <div className="flex flex-col gap-2 mb-6 flex-1">
                {[
                  "Surface → Structure → Embed across your function",
                  "Business teams own their protocols inside LIZA OS",
                  "Full governance framework your execs can explain",
                ].map((d, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: `hsl(${GRN})` }} />
                    <p className="text-sm text-muted-foreground">{d}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="rounded-lg border px-4 py-2" style={{ borderColor: `hsl(${GRN} / 0.15)` }}>
                  <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Timeline</p>
                  <p className="text-lg font-black" style={{ color: `hsl(${GRN})` }}>8 Weeks</p>
                </div>
                <div className="rounded-lg border px-4 py-2" style={{ borderColor: `hsl(${GRN} / 0.15)` }}>
                  <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Best for</p>
                  <p className="text-sm font-semibold">COOs & Heads of Function</p>
                </div>
              </div>
              <Link
                to="/scale"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border transition-all hover:opacity-80"
                style={{ borderColor: `hsl(${GRN} / 0.4)`, color: `hsl(${GRN})`, background: `hsl(${GRN} / 0.08)` }}
              >
                Learn more about the Programme <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Not sure which fits? <span className="font-semibold text-foreground">Book an assessment call</span> — we'll help you figure out the right path.
          </p>
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
            Book an Assessment Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
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
              Book an Assessment Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
      <Comparison />
      <ProductInAction />
      <Pipeline />
      <ExecutionCycle />
      <Outcomes />
      <GetStarted />
      <Features />
      <FinalCTA />
    </MarketingLayout>
  );
}
