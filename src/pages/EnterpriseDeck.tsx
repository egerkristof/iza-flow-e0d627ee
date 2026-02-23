import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  Brain, ArrowRight, CheckCircle2, XCircle, AlertTriangle,
  Users, Shield, TrendingUp, Layers, Lock, Award, BookOpen,
  Map, ChevronRight, Star, BarChart3, Zap,
} from "lucide-react";
import { TeamSection } from "@/components/marketing/TeamSection";

// ─── Design tokens ────────────────────────────────────────────────────────────
// Semantic: GRN = desired/positive, NEU = undesired/neutral
const GRN  = "155 72% 46%";
const NEU  = "var(--muted-foreground)";  // neutral for undesired states
const PRI  = "var(--primary)";

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 px-6">
      <div className="absolute inset-0 opacity-[0.022]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />
      <div className="absolute right-0 top-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.07), transparent 65%)`, transform: "translate(35%, -30%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-8"
          style={{ borderColor: `hsl(var(--primary) / 0.35)`, background: `hsl(var(--primary) / 0.07)`, color: `hsl(var(--primary))` }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: `hsl(var(--primary))` }} />
          AI Operating Model Programme · For COOs, Heads of Function & Managing Directors
        </div>

        <h1 className="font-black leading-[1.05] mb-6 text-foreground" style={{ fontSize: "clamp(2.75rem, 5.5vw, 4.5rem)" }}>
          Your team uses AI.{" "}
          <br className="hidden md:block" />
          <span className="brand-gradient-text">But not the same AI.</span>
        </h1>
        <p className="text-xl mb-4 max-w-2xl mx-auto text-muted-foreground" style={{ lineHeight: 1.7 }}>
          You want consistent, confident AI usage across your team. Instead, you have individuals improvising — same brief, 14 different outputs, zero institutional benefit.
        </p>
        <p className="text-base mb-6 max-w-xl mx-auto text-muted-foreground">
          We build the operating model that changes that. In weeks, not years.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-9 py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: `0 0 40px -8px hsl(var(--primary) / 0.45)`,
            }}>
            Book a scoping call <ArrowRight size={20} />
          </a>
          <button
            onClick={() => document.getElementById("maturity")?.scrollIntoView({ behavior: "smooth", block: "start" })}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base border transition-all hover:border-primary/40 text-muted-foreground"
            style={{ borderColor: "hsl(var(--border))", background: "transparent" }}>
            Find out where your org sits ↓
          </button>
        </div>
      </div>

      <div className="h-px w-full mt-20" style={{ background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.4), hsl(${GRN} / 0.4), transparent)` }} />
    </section>
  );
}

// ─── AI MATURITY LADDER ───────────────────────────────────────────────────────
const STEPS = [
  {
    n: 1, label: "Experimenting", sub: "Individuals using ChatGPT ad-hoc",
    pct: 22, desired: false, tag: "most start here", tagPulse: true, liza: null,
  },
  {
    n: 2, label: "Piloting", sub: "Departmental proofs of concept",
    pct: 40, desired: false, tag: "largest group", tagPulse: false, liza: null,
  },
  {
    n: 3, label: "Optimising", sub: "Fragmented workflow integration",
    pct: 28, desired: false, tag: "where most get stuck", tagPulse: false, liza: null,
  },
  {
    n: 4, label: "Transforming", sub: "Governed AI operating model",
    pct: 8, desired: true, tag: "← LIZA takes you here", tagPulse: false,
    liza: "Consulting + LIZA OS platform",
  },
  {
    n: 5, label: "Leading", sub: "Organisational intelligence",
    pct: 2, desired: true, tag: "North Star", tagPulse: false,
    liza: "LIZA OS compounds your knowledge",
  },
];

function MaturityInfographic() {
  return (
    <section id="maturity" className="py-24 px-4 sm:px-6 relative overflow-hidden" style={{ background: "hsl(var(--card))" }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[280px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${GRN} / 0.07), transparent 65%)` }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-bold tracking-[0.2em] uppercase text-xs mb-4" style={{ color: `hsl(var(--primary))` }}>
            AI Maturity Ladder · EY · McKinsey · Oxford Economics
          </p>
          <h2 className="font-black mb-4 text-foreground" style={{ fontSize: "clamp(1.85rem, 4vw, 3rem)", lineHeight: 1.1 }}>
            Where does your organisation sit?
          </h2>
          <p className="text-base max-w-lg mx-auto text-muted-foreground" style={{ lineHeight: 1.7 }}>
            90% of enterprises are at Level 1–3. The gap to Level 4 isn't about tools — it's about governance.
          </p>
        </div>

        {/* ═══ DESKTOP: True staircase ═══ */}
        <div className="hidden lg:block mb-6">
          <div className="flex flex-col gap-1.5">
            {[...STEPS].reverse().map((step, idx) => {
              const indent = (4 - idx) * 5;
              const col = step.desired ? GRN : "var(--muted-foreground)";
              const colHsl = step.desired ? `hsl(${GRN})` : "hsl(var(--muted-foreground))";
              return (
                <div key={step.n} className="flex items-stretch rounded-xl border overflow-hidden"
                  style={{
                    marginLeft: `${indent}%`,
                    background: step.desired ? `hsl(${GRN} / 0.08)` : "hsl(var(--muted) / 0.5)",
                    borderColor: step.desired ? `hsl(${GRN} / 0.4)` : "hsl(var(--border))",
                    boxShadow: step.desired ? `0 0 24px -8px hsl(${GRN} / 0.25)` : "none",
                  }}>
                  <div className="w-1 shrink-0" style={{ background: colHsl, opacity: step.desired ? 1 : 0.3 }} />
                  <div className="shrink-0 w-14 flex items-center justify-center border-r py-4"
                    style={{ borderColor: step.desired ? `hsl(${GRN} / 0.15)` : "hsl(var(--border))", background: step.desired ? `hsl(${GRN} / 0.06)` : "transparent" }}>
                    <div className="text-center">
                      <div className="text-[9px] font-black" style={{ color: colHsl, opacity: 0.55 }}>L</div>
                      <div className="font-black text-2xl leading-none" style={{ color: colHsl }}>{step.n}</div>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center px-5 py-4 gap-4 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-foreground">{step.label}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${step.tagPulse ? "animate-pulse" : ""}`}
                          style={{
                            background: step.desired ? `hsl(${GRN} / 0.1)` : "hsl(var(--muted))",
                            borderColor: step.desired ? `hsl(${GRN} / 0.35)` : "hsl(var(--border))",
                            color: colHsl,
                          }}>
                          {step.tag}
                        </span>
                        {step.liza && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1"
                            style={{ background: `hsl(${GRN} / 0.08)`, borderColor: `hsl(${GRN} / 0.4)`, color: `hsl(${GRN})` }}>
                            <Zap size={9} /> {step.liza}
                          </span>
                        )}
                      </div>
                      <p className="text-xs mt-0.5 text-muted-foreground">{step.sub}</p>
                    </div>
                    <div className="shrink-0 text-right min-w-[56px]">
                      <div className="font-black text-lg leading-none" style={{ color: colHsl }}>~{step.pct}%</div>
                      <div className="text-[9px] mt-0.5 text-muted-foreground">of orgs</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mt-4 pl-1">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-0 h-0" style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderBottom: `6px solid hsl(${GRN})` }} />
              <div className="w-px h-5 rounded" style={{ background: `linear-gradient(to top, hsl(${GRN}), transparent)` }} />
            </div>
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: `hsl(${GRN} / 0.6)` }}>
              Increasing maturity → consistent output · faster onboarding · compounding institutional value
            </p>
          </div>
        </div>

        {/* ═══ MOBILE: Vertical stack ═══ */}
        <div className="lg:hidden flex flex-col gap-2 mb-6">
          {[...STEPS].reverse().map((step) => {
            const colHsl = step.desired ? `hsl(${GRN})` : "hsl(var(--muted-foreground))";
            return (
              <div key={step.n} className="rounded-xl border overflow-hidden"
                style={{
                  background: step.desired ? `hsl(${GRN} / 0.07)` : "hsl(var(--muted) / 0.3)",
                  borderColor: step.desired ? `hsl(${GRN} / 0.4)` : "hsl(var(--border))",
                }}>
                <div className="flex items-center gap-3 p-4">
                  <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg border"
                    style={{ background: step.desired ? `hsl(${GRN} / 0.1)` : "hsl(var(--muted))", borderColor: step.desired ? `hsl(${GRN} / 0.3)` : "hsl(var(--border))", color: colHsl }}>
                    {step.n}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-black text-sm text-foreground">{step.label}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${step.tagPulse ? "animate-pulse" : ""}`}
                        style={{ background: step.desired ? `hsl(${GRN}/0.1)` : "hsl(var(--muted))", borderColor: step.desired ? `hsl(${GRN}/0.3)` : "hsl(var(--border))", color: colHsl }}>
                        {step.tag}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 text-muted-foreground">{step.sub}</p>
                    {step.liza && (
                      <p className="text-[11px] mt-1 font-semibold flex items-center gap-1" style={{ color: `hsl(${GRN})` }}>
                        <Zap size={10} /> {step.liza}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 font-black text-base" style={{ color: colHsl }}>~{step.pct}%</div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[11px] mb-10 text-muted-foreground/50">
          Distribution estimates based on EY GenAI Maturity Model (2024), McKinsey State of AI Survey (2025) &amp; Oxford Economics / ServiceNow Enterprise AI Maturity Index (2024)
        </p>

        {/* ═══ TIMELINE COMPARISON ═══ */}
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="h-[3px]" style={{ background: "var(--gradient-brand)" }} />
          <div className="p-8">
            <p className="font-bold tracking-widest uppercase text-xs mb-2" style={{ color: `hsl(var(--primary))` }}>The journey to Level 4</p>
            <h3 className="font-black text-xl mb-8 text-foreground" style={{ lineHeight: 1.15 }}>
              Two very different timelines.
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {/* With LIZA — desired */}
              <div className="rounded-xl border p-5" style={{ background: `hsl(${GRN} / 0.05)`, borderColor: `hsl(${GRN} / 0.3)` }}>
                <p className="font-bold text-sm mb-1" style={{ color: `hsl(${GRN})` }}>With LIZA OS</p>
                <p className="font-black" style={{ fontSize: "2.5rem", color: `hsl(${GRN})`, lineHeight: 1 }}>8 wks</p>
                <p className="text-xs mt-1 mb-4 text-muted-foreground">Surface → Structure → Embed. Operating model live.</p>
                <div className="flex gap-1">
                  {["Wk 1–2 Surface", "Wk 3–5 Structure", "Wk 6–8 Embed", "✓ Level 4"].map((m, i) => (
                    <div key={i} className="flex-1 rounded text-center py-1.5 text-[9px] font-bold"
                      style={{
                        background: `hsl(${GRN} / ${i === 3 ? 0.18 : 0.08})`,
                        color: `hsl(${GRN})`,
                        border: `1px solid hsl(${GRN} / ${i === 3 ? 0.4 : 0.2})`,
                      }}>
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              {/* Without — undesired */}
              <div className="rounded-xl border p-5" style={{ background: "hsl(var(--muted) / 0.3)", borderColor: "hsl(var(--border))" }}>
                <p className="font-bold text-sm mb-1 text-muted-foreground">Self-guided</p>
                <p className="font-black text-muted-foreground" style={{ fontSize: "2.5rem", lineHeight: 1 }}>2–3 yrs</p>
                <p className="text-xs mt-1 mb-4 text-muted-foreground">Pilots. Policy docs. Committees. Stalls at L2–3.</p>
                <div className="flex gap-1">
                  {["Pilots", "Policy docs", "Committees", "Stalls…"].map((m, i) => (
                    <div key={i} className="flex-1 rounded text-center py-1.5 text-[9px] font-bold"
                      style={{
                        background: "hsl(var(--muted) / 0.5)",
                        color: "hsl(var(--muted-foreground))",
                        border: "1px solid hsl(var(--border))",
                        opacity: 0.6 + i * 0.1,
                      }}>
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3 stat cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { n: "8", unit: "weeks", sub: "to a live operating model", desired: true },
                { n: "2–3", unit: "years", sub: "self-guided (if reached at all)", desired: false },
                { n: "14×", unit: "variance", sub: "output spread with no shared standard", desired: false },
              ].map((s, i) => (
                <div key={i} className="rounded-xl border text-center px-4 py-5"
                  style={{
                    background: s.desired ? `hsl(${GRN} / 0.05)` : "hsl(var(--muted) / 0.3)",
                    borderColor: s.desired ? `hsl(${GRN} / 0.2)` : "hsl(var(--border))",
                  }}>
                  <p className="font-black leading-none mb-1" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: s.desired ? `hsl(${GRN})` : "hsl(var(--muted-foreground))" }}>{s.n}</p>
                  <p className="font-bold text-xs mb-1 text-foreground">{s.unit}</p>
                  <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA prompt */}
        <div className="mt-10 text-center">
          <p className="text-sm mb-5 text-muted-foreground">
            Most clients come in at <span className="font-bold text-foreground">Level 2–3</span>. Some at Level 1. A few at 3 but fragmented. Wherever you are, we start there.
          </p>
          <button
            onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: `0 0 32px -8px hsl(var(--primary) / 0.4)`,
            }}>
            Book a scoping call <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── PROOF / PROBLEM ──────────────────────────────────────────────────────────
function Proof() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="font-bold tracking-[0.2em] uppercase text-sm mb-4 text-muted-foreground">Sound familiar?</p>
        <h2 className="font-black mb-4 text-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}>
          AI happened fast.<br />Governance didn't follow.
        </h2>
        <p className="text-lg mb-14 max-w-2xl text-muted-foreground" style={{ lineHeight: 1.65 }}>
          These aren't hypothetical risks. We hear these conversations in every engagement.
        </p>

        {/* Quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
          {[
            { q: "We all use AI, but we get completely different results for the same brief.", role: "Head of Strategy, Financial Services" },
            { q: "I've got no idea what our AI outputs are based on. That scares me.", role: "Chief Compliance Officer, 1,200-person firm" },
            { q: "We bought Copilot for everyone. Three months later, adoption is 20% and quality is patchy.", role: "COO, Professional Services Group" },
            { q: "My team uses AI constantly — I don't know if it's making us better or just faster at being inconsistent.", role: "Managing Director, Internal Consulting" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-7 border relative overflow-hidden"
              style={{ background: `hsl(var(--primary) / 0.04)`, borderColor: `hsl(var(--primary) / 0.15)` }}>
              <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: `hsl(var(--primary) / 0.5)` }} />
              <p className="font-semibold mb-3 text-base leading-relaxed text-foreground">"{s.q}"</p>
              <p className="font-bold tracking-widest uppercase text-xs text-muted-foreground">{s.role}</p>
            </div>
          ))}
        </div>

        {/* 3 problem dimensions — visually distinct */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { type: "The visibility gap", icon: <BarChart3 size={22} />, title: "Same brief, 14 outputs", desc: "Every person prompts differently. No shared standard. You're responsible for delivery quality, but you can't see what AI is contributing.", accent: "38 92% 50%" },
            { type: "The governance gap", icon: <Brain size={22} />, title: "Accountable but blind", desc: "AI is running in your organisation right now. You can't explain how it's being used, what it's based on, or whether it's making you better or just faster.", accent: "0 72% 55%" },
            { type: "The adoption gap", icon: <AlertTriangle size={22} />, title: "You paid. It should work.", desc: "Licences bought. Training done. Adoption at 20%. The same brief still produces wildly different outputs. The tools aren't the problem.", accent: "var(--primary)" },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl p-7 border relative overflow-hidden"
              style={{ background: `hsl(${c.accent} / 0.05)`, borderColor: `hsl(${c.accent} / 0.2)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${c.accent} / 0.6)` }} />
              <p className="font-bold tracking-widest uppercase text-xs mb-4" style={{ color: `hsl(${c.accent})` }}>{c.type}</p>
              <div className="mb-4" style={{ color: `hsl(${c.accent})` }}>{c.icon}</div>
              <h3 className="font-black text-lg mb-3 text-foreground">{c.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── LIZA OS DIFFERENTIATOR ─────────────────────────────────────────────────
function LizaDifferentiator() {
  return (
    <section className="py-20 px-6 border-t border-b border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold mb-6"
            style={{ borderColor: `hsl(var(--primary) / 0.3)`, background: `hsl(var(--primary) / 0.06)`, color: `hsl(var(--primary))` }}>
            <Zap size={11} /> What makes LIZA OS the differentiator
          </div>
          <h2 className="font-black mb-4 text-foreground" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.1 }}>
            Not interviews with a report at the end.
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground" style={{ lineHeight: 1.65 }}>
            The extraction, codification, and governance all happen{" "}
            <span className="text-foreground font-semibold">inside LIZA OS</span> — where we stress-test your methodology in real scenarios, so you leave with a system that actually runs.
          </p>
        </div>

        {/* Three-column contrast: undesired = muted, desired = green */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              label: "Traditional consulting", cross: true,
              items: ["Interviews and workshops", "Knowledge captured in notes", "Delivered as a PDF report", "Sits on a shelf after handoff"],
              outcome: "A document you own",
              icon: <BookOpen size={20} />,
            },
            {
              label: "AI tool rollout", cross: true,
              items: ["Licences bought, training run", "Each person prompts their own way", "No shared standard or governance", "Knowledge stays in individual heads"],
              outcome: "Access without alignment",
              icon: <Brain size={20} />,
            },
            {
              label: "LIZA OS programme", cross: false,
              items: ["Your experts define knowledge inside LIZA OS", "Tacit judgment becomes executable playbooks", "Protocols run live — enforced at point of use", "Every session feeds back into the system"],
              outcome: "A living operating model",
              icon: <Zap size={20} />,
            },
          ].map((col, i) => (
            <div key={i} className="rounded-2xl border overflow-hidden flex flex-col"
              style={{
                background: col.cross ? "hsl(var(--muted) / 0.3)" : `hsl(${GRN} / 0.07)`,
                borderColor: col.cross ? "hsl(var(--border))" : `hsl(${GRN} / 0.4)`,
                boxShadow: col.cross ? "none" : `0 0 28px -8px hsl(${GRN} / 0.2)`,
              }}>
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
                        ? <XCircle size={13} className="shrink-0 mt-0.5 text-muted-foreground/50" />
                        : <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: `hsl(${GRN})` }} />
                      }
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="rounded-lg px-4 py-3 border"
                  style={{
                    background: col.cross ? "hsl(var(--muted) / 0.5)" : `hsl(${GRN} / 0.12)`,
                    borderColor: col.cross ? "hsl(var(--border))" : `hsl(${GRN} / 0.4)`,
                  }}>
                  <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: col.cross ? "hsl(var(--muted-foreground))" : `hsl(${GRN})` }}>Result</p>
                  <p className="font-semibold text-sm" style={{ color: col.cross ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))" }}>{col.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* What "inside LIZA OS" actually means — progression uses primary */}
        <div className="rounded-2xl border p-8 relative overflow-hidden"
          style={{ background: `hsl(var(--primary) / 0.05)`, borderColor: `hsl(var(--primary) / 0.25)` }}>
          <div className="absolute right-0 top-0 w-[400px] h-[300px] pointer-events-none"
            style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.08), transparent 65%)`, transform: "translate(30%, -20%)" }} />
          <div className="relative z-10">
            <p className="font-bold tracking-widest uppercase text-xs mb-4" style={{ color: `hsl(var(--primary))` }}>
              What "inside LIZA OS" means in practice
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: "1", tag: "Surface", label: "Your experts describe their highest-value tasks in plain language — inside LIZA OS." },
                { step: "2", tag: "Codify", label: "LIZA OS structures that into playbooks: intent, protocol steps, and knowledge injection." },
                { step: "3", tag: "Test", label: "We run real-work scenarios inside LIZA OS — stress-testing the playbooks before go-live." },
                { step: "4", tag: "Embed", label: "Your teams execute against the live protocols. Every session compresses back in." },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border p-5"
                  style={{ background: `hsl(var(--primary) / 0.05)`, borderColor: `hsl(var(--primary) / 0.2)` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center font-black text-xs"
                      style={{ background: `hsl(var(--primary) / 0.15)`, color: `hsl(var(--primary))` }}>{item.step}</div>
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
              <Link to="/platform"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:opacity-80 whitespace-nowrap"
                style={{ borderColor: `hsl(var(--primary) / 0.4)`, color: `hsl(var(--primary))`, background: `hsl(var(--primary) / 0.08)` }}>
                Explore the platform <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── GUIDE: Why We're Different ───────────────────────────────────────────────
function Guide() {
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: "hsl(var(--card))" }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.05), transparent 70%)` }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <p className="font-bold tracking-[0.2em] uppercase text-sm mb-4" style={{ color: `hsl(var(--primary))` }}>Why We're Different</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-black mb-6 text-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}>
              Not a training programme.{" "}
              <span style={{ color: `hsl(var(--primary))` }}>An operating model you own.</span>
            </h2>
            <p className="text-lg mb-6 text-muted-foreground" style={{ lineHeight: 1.7 }}>
              We've worked inside these organisations. We built LIZA OS because we couldn't find anything that could hold organisational knowledge and make it executable — not a document, not a wiki, not a chat tool.
            </p>
            <p className="text-base mb-8 text-muted-foreground" style={{ lineHeight: 1.7 }}>
              You get senior consulting expertise to surface and codify your organisation's judgment — <em className="text-foreground">and</em> LIZA OS to operationalise it at scale. The consulting without the platform gives you a report. The platform without the consulting gives you an empty system. The combination gets you to Level 4.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Senior consultants embedded in your workflows", icon: <Award size={16} /> },
                { label: "LIZA OS platform — your standards, live and enforced", icon: <Layers size={16} /> },
                { label: "Infrastructure you own — not locked to us", icon: <Lock size={16} /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div style={{ color: `hsl(${GRN})` }}>{item.icon}</div>
                  <p className="font-semibold text-sm text-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { stat: "78%", label: "of employees are using unapproved AI tools right now" },
              { stat: "14×", label: "output variance when there's no shared standard" },
              { stat: "0%", label: "of AI sessions feed back into institutional knowledge by default" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 rounded-2xl px-7 py-5 border"
                style={{ background: "hsl(var(--muted) / 0.3)", borderColor: "hsl(var(--border))" }}>
                <p className="font-black shrink-0 w-20 text-right text-muted-foreground" style={{ fontSize: "2.25rem", lineHeight: 1 }}>{item.stat}</p>
                <div className="w-px self-stretch" style={{ background: "hsl(var(--border))" }} />
                <p className="font-semibold text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PLAN ─────────────────────────────────────────────────────────────────────
function Plan() {
  const phases = [
    {
      n: "1", label: "Surface",
      lizaTag: null,
      title: "We map how your team actually works",
      steps: [
        "Embed with your teams — not to audit, but to observe",
        "Surface tacit knowledge: shortcuts, judgment calls, unwritten rules",
        "Name where inconsistency lives and where AI risk is invisible",
      ],
      output: "A prioritised map of the highest-value knowledge and workflows",
      outputSub: "Consulting-led. LIZA OS captures the transcript and maps your methodology.",
    },
    {
      n: "2", label: "Structure",
      lizaTag: "Inside LIZA OS",
      title: "Expert judgment becomes executable playbooks",
      steps: [
        "Your senior leads define their highest-value tasks inside LIZA OS",
        "Tacit judgment is turned into instruction sets — intent, steps, governance",
        "We stress-test protocols in real scenarios before they go live",
      ],
      output: "An executable protocol library inside LIZA OS",
      outputSub: "Built by your people. Runs on any AI. Owned by you.",
    },
    {
      n: "3", label: "Embed",
      lizaTag: "Live in LIZA OS",
      title: "The model runs, and gets smarter every day",
      steps: [
        "Teams execute against shared standards — enforced at point of use",
        "Every session feeds back in. Knowledge compounds across runs.",
        "New hires onboard to a living model, not tribal habits",
      ],
      output: "A self-improving operating model",
      outputSub: "Full ownership. No lock-in. Export or continue independently.",
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-6xl mx-auto">
        <p className="font-bold tracking-[0.2em] uppercase text-sm mb-4" style={{ color: `hsl(${GRN})` }}>How It Works</p>
        <h2 className="font-black mb-4 text-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}>
          Three phases. Eight weeks.
        </h2>
        <p className="text-lg mb-14 max-w-2xl text-muted-foreground" style={{ lineHeight: 1.65 }}>
          At the end, your team has an operating model they built — and that actually runs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {phases.map((s, i) => (
            <div key={i} className="rounded-2xl border relative overflow-hidden flex flex-col"
              style={{ background: `hsl(var(--primary) / 0.04)`, borderColor: `hsl(var(--primary) / 0.2)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(var(--primary))` }} />
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl"
                      style={{ background: `hsl(var(--primary) / 0.15)`, color: `hsl(var(--primary))` }}>{s.n}</div>
                    <span className="font-bold tracking-widest uppercase text-xs" style={{ color: `hsl(var(--primary))` }}>{s.label}</span>
                  </div>
                  {s.lizaTag && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full border flex items-center gap-1 shrink-0"
                      style={{ background: `hsl(var(--primary) / 0.1)`, borderColor: `hsl(var(--primary) / 0.35)`, color: `hsl(var(--primary))` }}>
                      <Zap size={9} /> {s.lizaTag}
                    </span>
                  )}
                </div>
                <h3 className="font-black text-lg mb-4 text-foreground">{s.title}</h3>
                <ul className="flex flex-col gap-2.5 flex-1">
                  {s.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <ChevronRight size={14} className="shrink-0 mt-0.5" style={{ color: `hsl(var(--primary))` }} />
                      {step}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-5 border-t" style={{ borderColor: `hsl(var(--primary) / 0.15)` }}>
                  <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: `hsl(var(--primary))` }}>Output</p>
                  <p className="font-semibold text-sm mb-1 text-foreground">{s.output}</p>
                  <p className="text-xs text-muted-foreground">{s.outputSub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* What you walk away with */}
        <div className="rounded-2xl border p-8" style={{ background: `hsl(${GRN} / 0.04)`, borderColor: `hsl(${GRN} / 0.2)` }}>
          <p className="font-bold tracking-widest uppercase text-xs mb-6" style={{ color: `hsl(${GRN})` }}>What you walk away with</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <Map size={18} />, label: "Workflow maps of how work actually happens" },
              { icon: <BookOpen size={18} />, label: "Executable protocol library inside LIZA OS" },
              { icon: <Brain size={18} />, label: "Codified judgment layer from your senior leads" },
              { icon: <Shield size={18} />, label: "AI governance framework your execs can explain" },
              { icon: <TrendingUp size={18} />, label: "A knowledge capture loop that compounds" },
              { icon: <Users size={18} />, label: "A model built by the people who use it" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div style={{ color: `hsl(${GRN})`, flexShrink: 0 }}>{item.icon}</div>
                <p className="font-semibold text-sm text-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── AVOID FAILURE ────────────────────────────────────────────────────────────
function AvoidFailure() {
  return (
    <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-6xl mx-auto">
        <p className="font-bold tracking-[0.2em] uppercase text-sm mb-4 text-muted-foreground">What's at Stake</p>
        <h2 className="font-black mb-4 text-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}>
          What happens if nothing changes.
        </h2>
        <p className="text-lg mb-12 max-w-2xl text-muted-foreground" style={{ lineHeight: 1.65 }}>
          Ungoverned AI doesn't stay still. The risk compounds quietly — until it doesn't.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            { label: "AI inconsistency becomes a compliance liability", icon: <Shield size={18} /> },
            { label: "Your best people carry knowledge that evaporates when they leave", icon: <Users size={18} /> },
            { label: "Competitors who govern AI well start outperforming you structurally", icon: <TrendingUp size={18} /> },
            { label: "AI tools get banned or restricted after an embarrassing incident", icon: <Lock size={18} /> },
            { label: "You remain unable to answer: 'How are we governing AI?'", icon: <AlertTriangle size={18} /> },
            { label: "Every new AI rollout hits the same wall — adoption without alignment", icon: <Layers size={18} /> },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border px-6 py-5"
              style={{ background: "hsl(0 72% 55% / 0.05)", borderColor: "hsl(0 72% 55% / 0.18)" }}>
              <XCircle size={18} className="shrink-0" style={{ color: "hsl(0 72% 55% / 0.6)" }} />
              <p className="font-semibold text-sm text-foreground/85">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Why other approaches fail */}
        <div className="rounded-2xl border p-8" style={{ background: "hsl(var(--muted) / 0.2)", borderColor: "hsl(var(--border))" }}>
          <p className="font-bold tracking-widest uppercase text-xs mb-5 text-muted-foreground">Why other approaches haven't worked</p>
          <div className="flex flex-col gap-3">
            {[
              { label: "Prompt engineering courses", why: "Individual skill. No shared standard. Back to 23 different styles by Monday." },
              { label: "AI tool rollouts (Copilot, ChatGPT Teams)", why: "Access without architecture. Licences ≠ alignment." },
              { label: "Internal AI champions / CoE", why: "Siloed. Slow. Becomes a bottleneck, not a multiplier." },
              { label: "Policy documents & usage guidelines", why: "Compliance theatre. No enforcement at the point of use." },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-5 py-3 border-b last:border-0 border-border">
                <AlertTriangle className="shrink-0 mt-0.5 text-muted-foreground/50" size={16} />
                <div className="flex flex-col sm:flex-row sm:gap-6 flex-1">
                  <p className="font-bold text-sm shrink-0 sm:w-64 text-foreground">{t.label}</p>
                  <p className="text-sm text-muted-foreground">→ {t.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SUCCESS STATE ────────────────────────────────────────────────────────────
function Success() {
  const transformations = [
    { before: "Everyone prompts their own way", after: "Shared workflow standards across the function" },
    { before: "AI operating on generic public data", after: "Context-loaded with your standards and methodology" },
    { before: "No visibility for managers", after: "A governance model you can explain to any exec" },
    { before: "Knowledge evaporating after every session", after: "Structured capture baked into the workflow" },
    { before: "New hires take months to reach standard", after: "Onboarding to a defined operating model, not tribal habits" },
    { before: '"How are we governing AI?" has no clear answer', after: "A framework your team owns, authored by your own leads" },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="font-bold tracking-[0.2em] uppercase text-sm mb-4" style={{ color: `hsl(${GRN})` }}>The Success State</p>
        <h2 className="font-black mb-4 text-foreground" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1 }}>
          Here's what your function looks like{" "}
          <span style={{ color: `hsl(${GRN})` }}>on the other side.</span>
        </h2>
        <p className="text-lg mb-14 max-w-2xl text-muted-foreground" style={{ lineHeight: 1.65 }}>
          Not a better-trained team. A structurally different one.
        </p>

        {/* Before/After grid — muted vs green */}
        <div className="rounded-2xl border overflow-hidden mb-12" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="grid grid-cols-2 border-b border-border">
            <div className="px-6 py-4 border-r border-border" style={{ background: "hsl(var(--muted) / 0.3)" }}>
              <p className="font-bold tracking-widest uppercase text-xs text-muted-foreground">Before</p>
            </div>
            <div className="px-6 py-4" style={{ background: `hsl(${GRN} / 0.07)` }}>
              <p className="font-bold tracking-widest uppercase text-xs" style={{ color: `hsl(${GRN})` }}>After · Level 4</p>
            </div>
          </div>
          {transformations.map((item, i) => (
            <div key={i} className="grid grid-cols-2 border-b last:border-0 border-border">
              <div className="px-6 py-4 border-r border-border flex items-center gap-3" style={{ background: i % 2 === 0 ? "hsl(var(--muted) / 0.15)" : "transparent" }}>
                <XCircle size={14} className="shrink-0 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground line-through">{item.before}</p>
              </div>
              <div className="px-6 py-4 flex items-center gap-3" style={{ background: i % 2 === 0 ? `hsl(${GRN} / 0.03)` : "transparent" }}>
                <CheckCircle2 size={14} className="shrink-0" style={{ color: `hsl(${GRN})` }} />
                <p className="font-semibold text-sm text-foreground">{item.after}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Who it's for + final CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <p className="font-bold tracking-widest uppercase text-xs mb-4" style={{ color: `hsl(var(--primary))` }}>This is for you if you are…</p>
            <div className="flex flex-col gap-3">
              {[
                { role: "Head of Function", context: "Strategy, Operations, Finance, Legal — you set the standards. This operationalises them." },
                { role: "COO or Chief of Staff", context: "Responsible for cross-functional execution quality. This builds the infrastructure for consistency and visibility." },
                { role: "Managing Director or Practice Lead", context: "Your team's judgment is the product. This protects and scales it." },
                { role: "Transformation or Change Lead", context: "Running AI adoption programmes. This is the governance layer that makes them stick." },
              ].map((item, i) => (
                <div key={i} className="rounded-xl px-5 py-4 border"
                  style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}>
                  <p className="font-bold text-sm mb-1 text-foreground">{item.role}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.context}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div id="cta" className="rounded-2xl border p-10 flex flex-col items-center text-center relative overflow-hidden"
            style={{ background: `hsl(var(--primary) / 0.06)`, borderColor: `hsl(var(--primary) / 0.3)` }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.1), transparent 60%)` }} />
            <div className="relative z-10">
              <Star size={32} className="mx-auto mb-4" style={{ color: `hsl(var(--primary))` }} />
              <h3 className="font-black text-2xl mb-3 text-foreground" style={{ lineHeight: 1.1 }}>
                Your team's knowledge is already there.{" "}
                <span style={{ color: `hsl(var(--primary))` }}>Let's build with it.</span>
              </h3>
              <p className="text-base mb-8 text-muted-foreground" style={{ lineHeight: 1.65 }}>
                30 minutes. We scope the right engagement for your team's size and complexity.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8 text-left">
                {[
                  { label: "Format", value: "Multi-session, embedded" },
                  { label: "Who", value: "Teams + managers" },
                  { label: "Location", value: "On-site or remote" },
                  { label: "Output", value: "A live operating model" },
                ].map((item, i) => (
                  <div key={i} className="rounded-lg border px-3 py-3"
                    style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}>
                    <p className="font-bold tracking-widest uppercase text-[10px]" style={{ color: `hsl(var(--primary))` }}>{item.label}</p>
                    <p className="font-semibold text-sm mt-0.5 text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
              <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90 w-full justify-center"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: `0 0 32px -8px hsl(var(--primary) / 0.4)`,
                }}>
                Book a scoping call <ArrowRight size={18} />
              </a>
              <p className="text-xs mt-3 text-muted-foreground">No commitments. No pitch deck.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── LOGO STRIP ───────────────────────────────────────────────────────────────
function LogoStrip() {
  const sectors = [
    "Financial Services", "Management Consulting", "Legal & Compliance",
    "Technology", "Professional Services", "Private Equity",
  ];

  return (
    <section className="py-16 px-6 border-t border-b border-border" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-8 text-muted-foreground">
          Trusted by knowledge-intensive organisations across
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {sectors.map((s, i) => (
            <div key={i} className="px-5 py-2.5 rounded-lg border font-semibold text-sm"
              style={{
                background: `hsl(var(--primary) / 0.04)`,
                borderColor: "hsl(var(--border))",
                color: "hsl(var(--muted-foreground))",
              }}>
              {s}
            </div>
          ))}
        </div>
        <p className="text-xs mt-6 text-muted-foreground/50">
          Client names withheld under NDA — references available on request.
        </p>
      </div>
    </section>
  );
}


// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EnterpriseDeck() {
  return (
    <MarketingLayout>
      <Hero />
      <MaturityInfographic />
      <LizaDifferentiator />
      <Proof />
      <Guide />
      <Plan />
      <AvoidFailure />
      <Success />
      <TeamSection />
      <LogoStrip />
    </MarketingLayout>
  );
}
