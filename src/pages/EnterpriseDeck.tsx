import { Link } from "react-router-dom";
import {
  Brain, ArrowRight, CheckCircle2, XCircle, AlertTriangle,
  Users, Shield, TrendingUp, Layers, Lock, Award, BookOpen,
  Map, ChevronRight, Star, BarChart3,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG   = "hsl(222 22% 5%)";
const BG2  = "hsl(222 18% 8%)";
const C    = "210 18% 92%";
const MUT  = "215 10% 50%";
const PRI  = "200 90% 52%";
const GRN  = "155 72% 46%";
const RED  = "0 72% 63%";
const AMB  = "38 92% 55%";

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b"
      style={{ background: "hsl(222 22% 4% / 0.95)", borderColor: "hsl(222 18% 10%)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`, color: "hsl(222 22% 5%)" }}>L</div>
          <span className="font-bold text-lg tracking-tight" style={{ color: `hsl(${C})` }}>LIZA <span style={{ color: `hsl(${MUT})`, fontWeight: 400 }}>OS</span></span>
        </Link>
        <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ background: `hsl(${PRI})`, color: "hsl(222 22% 5%)" }}>
          Book a scoping call <ArrowRight size={14} />
        </a>
      </div>
    </header>
  );
}

// ─── HERO: The Character ──────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 px-6" style={{ background: BG }}>
      <div className="absolute inset-0 opacity-[0.022]" style={{
        backgroundImage: `linear-gradient(hsl(${PRI}) 1px, transparent 1px), linear-gradient(90deg, hsl(${PRI}) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />
      <div className="absolute right-0 top-0 w-[700px] h-[700px] pointer-events-none"
        style={{ background: `radial-gradient(circle, hsl(${PRI} / 0.07), transparent 65%)`, transform: "translate(35%, -30%)" }} />
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: `radial-gradient(circle, hsl(${GRN} / 0.04), transparent 65%)`, transform: "translate(-30%, 30%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-8"
          style={{ borderColor: `hsl(${PRI} / 0.35)`, background: `hsl(${PRI} / 0.07)`, color: `hsl(${PRI})` }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: `hsl(${PRI})` }} />
          AI Operating Model Programme · For COOs, Heads of Function & Managing Directors
        </div>

        <h1 className="font-black leading-[1.05] mb-6" style={{ fontSize: "clamp(2.75rem, 5.5vw, 4.5rem)", color: `hsl(${C})` }}>
          Your team uses AI.{" "}
          <br className="hidden md:block" />
          <span style={{ background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            But not the same AI.
          </span>
        </h1>
        <p className="text-xl mb-4 max-w-2xl mx-auto" style={{ color: `hsl(${MUT})`, lineHeight: 1.7 }}>
          You want consistent, confident AI usage across your team. Instead, you have individuals improvising — same brief, 14 different outputs, zero institutional benefit.
        </p>
        <p className="text-base mb-12 max-w-xl mx-auto" style={{ color: `hsl(${MUT})` }}>
          We build the operating model that changes that. In weeks, not years.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-9 py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
              color: "hsl(222 22% 5%)",
              boxShadow: `0 0 40px -8px hsl(${PRI} / 0.45)`,
            }}>
            Book a scoping call <ArrowRight size={20} />
          </a>
          <a href="#maturity" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base border transition-all hover:border-primary/40"
            style={{ color: `hsl(${MUT})`, borderColor: `hsl(222 18% 18%)` }}>
            See where your org sits ↓
          </a>
        </div>
      </div>

      <div className="h-px w-full mt-20" style={{ background: `linear-gradient(90deg, transparent, hsl(${PRI} / 0.4), hsl(${GRN} / 0.4), transparent)` }} />
    </section>
  );
}

// ─── AI MATURITY VISUAL ───────────────────────────────────────────────────────
// The centrepiece infographic. Nuanced — orgs can identify their real level.
const LEVELS = [
  {
    n: 5,
    label: "Organisational Intelligence",
    tag: "The north star",
    desc: "AI compounds institutional knowledge. Every execution teaches the system. The organisation becomes a living learning entity.",
    signals: ["Knowledge compounds automatically", "Every run refines the standard", "New hires onboard to a living model"],
    col: GRN,
    icon: "◆",
    pct: 5,
  },
  {
    n: 4,
    label: "Governed AI Operating Model",
    tag: "Where we take you",
    desc: "Shared standards. Codified judgment. Governed usage. AI runs loaded with your organisation's context and agreed protocols.",
    signals: ["Shared prompt standards across teams", "Governance framework exec can explain", "AI loaded with institutional context"],
    col: PRI,
    icon: "▲",
    pct: 12,
    destination: true,
  },
  {
    n: 3,
    label: "Workflow Integration",
    tag: "Patchy adoption",
    desc: "AI is embedded in specific workflows. Some teams have personal standards. But it's undocumented, fragile, and siloed between people.",
    signals: ["Some power users emerge", "Inconsistency between team members", "No shared standard or governance"],
    col: AMB,
    icon: "◈",
    pct: 28,
  },
  {
    n: 2,
    label: "Departmental Tool Adoption",
    tag: "Individual improvisation",
    desc: "Departments use AI tools. Real productivity gains exist. But everyone prompts differently — same brief, wildly different outputs.",
    signals: ["Copilot / ChatGPT rolled out", "Adoption is patchy (20–40%)", "14× output variance per team"],
    col: AMB,
    icon: "◉",
    pct: 40,
  },
  {
    n: 1,
    label: "Chatbot Usage",
    tag: "Where most organisations start",
    desc: "AI is treated like a search engine. Individuals prompt for answers. No shared standards, no memory, no governance, no institutional benefit.",
    signals: ["Ad-hoc chatbot use by individuals", "No shared prompts or standards", "Zero institutional knowledge capture"],
    col: RED,
    icon: "●",
    pct: 15,
  },
];

function MaturityInfographic() {
  return (
    <section id="maturity" className="py-28 px-6 relative overflow-hidden" style={{ background: BG2 }}>
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${GRN} / 0.1), transparent 65%)` }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 100%, hsl(${RED} / 0.07), transparent 60%)` }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="font-bold tracking-[0.2em] uppercase text-sm mb-4" style={{ color: `hsl(${PRI})` }}>
            The AI Maturity Map
          </p>
          <h2 className="font-black mb-5" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
            Every organisation sits{" "}
            <span style={{ color: `hsl(${PRI})` }}>somewhere on this ladder.</span>
            <br />Where are you?
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
            It's not black and white. Most organisations are at Level 2–3 — with islands of progress. The gap to Level 4 isn't about tools. It's about governance and shared standards.
          </p>
        </div>

        {/* The ladder */}
        <div className="relative flex flex-col gap-0">
          {/* Vertical connector line */}
          <div className="absolute left-7 top-10 bottom-10 w-[2px] hidden lg:block"
            style={{ background: `linear-gradient(to top, hsl(${RED} / 0.45), hsl(${AMB} / 0.35) 40%, hsl(${PRI} / 0.6) 70%, hsl(${GRN} / 0.7))` }} />

          {LEVELS.map((level, idx) => {
            const isDestination = level.destination;
            const isNorthStar = level.n === 5;
            const isBottom = level.n === 1;

            return (
              <div
                key={level.n}
                className="relative flex gap-0 group"
                style={{ marginBottom: idx < LEVELS.length - 1 ? "0" : "0" }}
              >
                {/* Left: level node */}
                <div className="relative hidden lg:flex flex-col items-center" style={{ width: "60px", minWidth: "60px" }}>
                  {/* Connector dot */}
                  <div className="relative z-10 w-4 h-4 rounded-full border-2 mt-8 shrink-0 transition-all"
                    style={{
                      borderColor: `hsl(${level.col})`,
                      background: isDestination || isNorthStar ? `hsl(${level.col})` : `hsl(${level.col} / 0.25)`,
                      boxShadow: (isDestination || isNorthStar) ? `0 0 12px hsl(${level.col} / 0.6)` : "none",
                    }} />
                </div>

                {/* Right: card */}
                <div className="flex-1 mb-3">
                  <div
                    className="relative rounded-2xl border overflow-hidden transition-all"
                    style={{
                      background: isNorthStar
                        ? `hsl(${level.col} / 0.08)`
                        : isDestination
                        ? `hsl(${level.col} / 0.07)`
                        : isBottom
                        ? `hsl(${level.col} / 0.04)`
                        : `hsl(${level.col} / 0.03)`,
                      borderColor: (isDestination || isNorthStar)
                        ? `hsl(${level.col} / 0.5)`
                        : `hsl(${level.col} / 0.2)`,
                      boxShadow: (isDestination || isNorthStar) ? `0 0 32px -10px hsl(${level.col} / 0.3)` : "none",
                    }}>
                    {/* Top bar */}
                    <div className="absolute top-0 left-0 right-0 h-[2px]"
                      style={{ background: `hsl(${level.col})`, opacity: (isDestination || isNorthStar || isBottom) ? 1 : 0.3 }} />

                    <div className="p-6 flex flex-col lg:flex-row gap-6">
                      {/* Level number + tag */}
                      <div className="shrink-0 flex flex-row lg:flex-col items-center lg:items-start gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl border font-black text-2xl shrink-0"
                          style={{
                            background: `hsl(${level.col} / ${(isDestination || isNorthStar) ? 0.18 : 0.08})`,
                            borderColor: `hsl(${level.col} / ${(isDestination || isNorthStar) ? 0.5 : 0.25})`,
                            color: `hsl(${level.col})`,
                          }}>
                          {level.n}
                        </div>
                        {/* Pill badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {isBottom && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border"
                              style={{ background: `hsl(${RED} / 0.12)`, borderColor: `hsl(${RED} / 0.4)`, color: `hsl(${RED})` }}>
                              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: `hsl(${RED})` }} />
                              Many orgs start here
                            </span>
                          )}
                          {isDestination && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border"
                              style={{ background: `hsl(${PRI} / 0.12)`, borderColor: `hsl(${PRI} / 0.4)`, color: `hsl(${PRI})` }}>
                              ✦ We take you here
                            </span>
                          )}
                          {isNorthStar && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border"
                              style={{ background: `hsl(${GRN} / 0.12)`, borderColor: `hsl(${GRN} / 0.4)`, color: `hsl(${GRN})` }}>
                              ▲ North star
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Main content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: `hsl(${level.col} / 0.8)` }}>
                          Level {level.n} · {level.tag}
                        </p>
                        <h3 className="font-black text-lg mb-2" style={{ color: `hsl(${C})` }}>
                          {level.label}
                        </h3>
                        <p className="text-sm leading-relaxed mb-4" style={{ color: `hsl(${MUT})` }}>
                          {level.desc}
                        </p>
                        {/* Signals: what this looks like in practice */}
                        <div className="flex flex-wrap gap-2">
                          {level.signals.map((s, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border"
                              style={{
                                background: `hsl(${level.col} / 0.06)`,
                                borderColor: `hsl(${level.col} / 0.2)`,
                                color: `hsl(${level.col} / 0.9)`,
                              }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Prevalence bar: how common is this level */}
                      <div className="shrink-0 flex flex-row lg:flex-col items-center gap-2 min-w-[72px]">
                        <div className="hidden lg:block">
                          <p className="text-[10px] font-bold tracking-widest uppercase text-center mb-1.5" style={{ color: `hsl(${MUT})` }}>
                            Est. share
                          </p>
                          <div className="relative w-full h-[80px] flex items-end justify-center">
                            <div className="w-10 rounded-t-md" style={{
                              height: `${level.pct * 2}px`,
                              background: `linear-gradient(to top, hsl(${level.col} / 0.15), hsl(${level.col} / 0.45))`,
                              borderTop: `2px solid hsl(${level.col} / 0.6)`,
                            }} />
                          </div>
                          <p className="font-black text-base text-center" style={{ color: `hsl(${level.col})` }}>
                            ~{level.pct}%
                          </p>
                          <p className="text-[10px] text-center" style={{ color: `hsl(${MUT})` }}>of orgs</p>
                        </div>
                        <div className="lg:hidden flex items-center gap-2">
                          <div className="h-2 rounded-full" style={{
                            width: `${level.pct * 2}px`,
                            background: `hsl(${level.col} / 0.5)`,
                          }} />
                          <span className="text-xs font-bold" style={{ color: `hsl(${level.col})` }}>~{level.pct}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Journey Timeline Infographic */}
        <div className="mt-14 rounded-3xl border overflow-hidden" style={{ background: BG, borderColor: `hsl(${PRI} / 0.2)` }}>
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, hsl(${RED}), hsl(${AMB}), hsl(${PRI}), hsl(${GRN}))` }} />

          {/* Header */}
          <div className="px-8 pt-8 pb-0 border-b" style={{ borderColor: `hsl(${PRI} / 0.12)` }}>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-8">
              <div>
                <p className="font-bold tracking-widest uppercase text-xs mb-2" style={{ color: `hsl(${PRI})` }}>
                  The Journey Visualised
                </p>
                <h3 className="font-black text-2xl" style={{ color: `hsl(${C})`, lineHeight: 1.15 }}>
                  From where you are →{" "}
                  <span style={{ color: `hsl(${PRI})` }}>to Level 4.</span>
                  <br />
                  Two very different timelines.
                </h3>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: `hsl(${PRI})` }} />
                  <span className="text-xs font-semibold" style={{ color: `hsl(${MUT})` }}>With LIZA</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: `hsl(${RED} / 0.6)` }} />
                  <span className="text-xs font-semibold" style={{ color: `hsl(${MUT})` }}>Without</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline comparison */}
          <div className="px-8 py-10">
            {/* Visual timeline */}
            <div className="mb-10">
              {/* Track labels */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="rounded-xl px-5 py-4 border" style={{ background: `hsl(${PRI} / 0.05)`, borderColor: `hsl(${PRI} / 0.25)` }}>
                  <p className="font-bold text-sm mb-0.5" style={{ color: `hsl(${PRI})` }}>With LIZA OS · The Programme</p>
                  <p className="text-xs" style={{ color: `hsl(${MUT})` }}>Structured, embedded engagement. Weeks, not years.</p>
                </div>
                <div className="rounded-xl px-5 py-4 border" style={{ background: `hsl(${RED} / 0.04)`, borderColor: `hsl(${RED} / 0.15)` }}>
                  <p className="font-bold text-sm mb-0.5" style={{ color: `hsl(${RED})` }}>Without LIZA · Self-guided</p>
                  <p className="text-xs" style={{ color: `hsl(${MUT})` }}>Trial and error. Committees. Stalling at Level 2–3.</p>
                </div>
              </div>

              {/* Timeline bars */}
              <div className="flex flex-col gap-4">
                {/* With LIZA */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: `hsl(${PRI})` }} />
                    <p className="text-xs font-bold" style={{ color: `hsl(${PRI})` }}>WITH LIZA</p>
                  </div>
                  <div className="relative h-12 rounded-xl overflow-hidden border" style={{ borderColor: `hsl(${PRI} / 0.2)` }}>
                    {/* Full bar background */}
                    <div className="absolute inset-0" style={{ background: `hsl(${PRI} / 0.04)` }} />
                    {/* Progress: reaches L4 at ~week 8 (out of implied 2yr scale, show as short) */}
                    <div className="absolute left-0 top-0 bottom-0 rounded-xl flex items-center"
                      style={{ width: "22%", background: `linear-gradient(90deg, hsl(${RED} / 0.4), hsl(${PRI}))` }}>
                    </div>
                    {/* Milestone markers */}
                    {[
                      { pos: "7%", label: "Wk 2 · Surface", col: RED },
                      { pos: "14%", label: "Wk 4–5 · Structure", col: AMB },
                      { pos: "20%", label: "Wk 6–8 · Embed", col: PRI },
                      { pos: "22.5%", label: "L4 ✓", col: GRN },
                    ].map((m, i) => (
                      <div key={i} className="absolute top-0 bottom-0 flex flex-col items-center justify-center" style={{ left: m.pos }}>
                        <div className="w-px h-full opacity-60" style={{ background: `hsl(${m.col})` }} />
                      </div>
                    ))}
                    <div className="absolute inset-0 flex items-center px-4 gap-6">
                      {[
                        { label: "Wk 1–2", sub: "Surface" },
                        { label: "Wk 3–5", sub: "Structure" },
                        { label: "Wk 6–8", sub: "Embed" },
                        { label: "Level 4 ✓", sub: "Operating model live" },
                      ].map((m, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-[10px] font-black leading-tight" style={{ color: `hsl(${C})` }}>{m.label}</span>
                          <span className="text-[9px]" style={{ color: `hsl(${MUT})` }}>{m.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Without LIZA */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: `hsl(${RED} / 0.6)` }} />
                    <p className="text-xs font-bold" style={{ color: `hsl(${RED})` }}>WITHOUT LIZA</p>
                  </div>
                  <div className="relative h-12 rounded-xl overflow-hidden border" style={{ borderColor: `hsl(${RED} / 0.15)` }}>
                    <div className="absolute inset-0" style={{ background: `hsl(${RED} / 0.03)` }} />
                    {/* Stalls at ~L2/3 area, never reaches L4 in this time */}
                    <div className="absolute left-0 top-0 bottom-0 rounded-xl"
                      style={{ width: "38%", background: `linear-gradient(90deg, hsl(${RED} / 0.3), hsl(${AMB} / 0.35))` }}>
                    </div>
                    {/* Stall marker */}
                    <div className="absolute top-0 bottom-0" style={{ left: "38%" }}>
                      <div className="h-full w-[2px] opacity-60" style={{ background: `hsl(${AMB})` }} />
                    </div>
                    <div className="absolute inset-0 flex items-center px-4 gap-6">
                      {[
                        { label: "Months 1–3", sub: "Pilots & discussions" },
                        { label: "Months 4–6", sub: "Policy docs (unused)" },
                        { label: "Month 6+", sub: "Stalls at L2–L3" },
                        { label: "2–3 yrs", sub: "L4 (if ever)" },
                      ].map((m, i) => (
                        <div key={i} className="flex flex-col">
                          <span className="text-[10px] font-black leading-tight" style={{ color: `hsl(${RED} / 0.8)` }}>{m.label}</span>
                          <span className="text-[9px]" style={{ color: `hsl(${MUT})` }}>{m.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Big comparison numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border text-center px-6 py-7"
                style={{ background: `hsl(${PRI} / 0.06)`, borderColor: `hsl(${PRI} / 0.3)` }}>
                <p className="font-black" style={{ fontSize: "3rem", color: `hsl(${PRI})`, lineHeight: 1 }}>8</p>
                <p className="font-bold text-sm" style={{ color: `hsl(${C})` }}>weeks with us</p>
                <p className="text-xs mt-1" style={{ color: `hsl(${MUT})` }}>to a live operating model</p>
              </div>
              <div className="rounded-2xl border text-center px-6 py-7"
                style={{ background: `hsl(${RED} / 0.04)`, borderColor: `hsl(${RED} / 0.18)` }}>
                <p className="font-black" style={{ fontSize: "3rem", color: `hsl(${RED})`, lineHeight: 1 }}>2–3</p>
                <p className="font-bold text-sm" style={{ color: `hsl(${C})` }}>years alone</p>
                <p className="text-xs mt-1" style={{ color: `hsl(${MUT})` }}>if organisations get there at all</p>
              </div>
              <div className="rounded-2xl border text-center px-6 py-7"
                style={{ background: `hsl(${GRN} / 0.05)`, borderColor: `hsl(${GRN} / 0.2)` }}>
                <p className="font-black" style={{ fontSize: "3rem", color: `hsl(${GRN})`, lineHeight: 1 }}>14×</p>
                <p className="font-bold text-sm" style={{ color: `hsl(${C})` }}>output variance</p>
                <p className="text-xs mt-1" style={{ color: `hsl(${MUT})` }}>with no shared AI standard in place</p>
              </div>
            </div>
          </div>
        </div>

        {/* Self-identification prompt */}
        <div className="mt-10 text-center">
          <p className="text-base mb-6" style={{ color: `hsl(${MUT})` }}>
            Most of our clients come in at <span className="font-bold" style={{ color: `hsl(${AMB})` }}>Level 2–3</span>. Some at Level 1. A few at 3 but highly fragmented. Wherever you are, we start there.
          </p>
          <button
            onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
              color: "hsl(222 22% 5%)",
              boxShadow: `0 0 32px -8px hsl(${PRI} / 0.4)`,
            }}>
            Find out where your org sits <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── PROBLEM SECTION ──────────────────────────────────────────────────────────
function Problem() {
  return (
    <section className="py-24 px-6" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto">
        <p className="font-bold tracking-[0.2em] uppercase text-sm mb-4" style={{ color: `hsl(${RED})` }}>The Problem</p>
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          AI happened fast.<br />Governance didn't follow.
        </h2>
        <p className="text-lg mb-14 max-w-2xl" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          You're responsible for delivery quality — but you can't see what AI is contributing. And everyone's improvising differently.
        </p>

        {/* 3 problem dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              type: "External", icon: <BarChart3 size={24} />,
              title: "Uncontrolled usage",
              desc: "Every person prompts differently. Same brief, wildly different outputs. No shared standard. No governance.",
              col: RED,
            },
            {
              type: "Internal", icon: <Brain size={24} />,
              title: "Accountable but blind",
              desc: "You're responsible for outcomes. But you can't see what AI is contributing or whether it's making the team better or just faster at being inconsistent.",
              col: AMB,
            },
            {
              type: "Philosophical", icon: <AlertTriangle size={24} />,
              title: "You paid. It should work.",
              desc: "You bought the tools. The team uses them. And still nobody can answer: 'How are we governing this?'",
              col: PRI,
            },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl p-8 border relative overflow-hidden"
              style={{ background: `hsl(${c.col} / 0.05)`, borderColor: `hsl(${c.col} / 0.25)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${c.col})` }} />
              <p className="font-bold tracking-widest uppercase text-xs mb-4" style={{ color: `hsl(${c.col})` }}>{c.type} problem</p>
              <div className="mb-4" style={{ color: `hsl(${c.col})` }}>{c.icon}</div>
              <h3 className="font-black text-xl mb-3" style={{ color: `hsl(${C})` }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: `hsl(${MUT})` }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { q: "We all use AI, but we get completely different results for the same brief.", role: "Head of Strategy, Financial Services" },
            { q: "I've got no idea what our AI outputs are based on. That scares me.", role: "Chief Compliance Officer, 1,200-person firm" },
            { q: "We bought Copilot for everyone. Three months later, adoption is 20% and quality is patchy.", role: "COO, Professional Services Group" },
            { q: "My team uses AI constantly — I don't know if it's making us better or just faster at being inconsistent.", role: "Managing Director, Internal Consulting" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-7 border" style={{ background: BG2, borderColor: `hsl(${RED} / 0.12)` }}>
              <p className="font-semibold mb-3 text-base leading-relaxed" style={{ color: `hsl(${C})` }}>"{s.q}"</p>
              <p className="font-bold tracking-widest uppercase text-xs" style={{ color: `hsl(${RED})` }}>{s.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── GUIDE ────────────────────────────────────────────────────────────────────
function Guide() {
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: BG2 }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(circle, hsl(${PRI} / 0.05), transparent 70%)` }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <p className="font-bold tracking-[0.2em] uppercase text-sm mb-4" style={{ color: `hsl(${PRI})` }}>Why We're Different</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-black mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
              We've been inside these organisations.{" "}
              <span style={{ color: `hsl(${PRI})` }}>We built the answer.</span>
            </h2>
            <p className="text-lg mb-6" style={{ color: `hsl(${MUT})`, lineHeight: 1.7 }}>
              We understand what it feels like to be accountable for quality when everyone is improvising. We've worked inside those organisations. That's why we built LIZA OS — not as another AI tool, but as the governance infrastructure that makes AI work at the team level.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Built for knowledge-intensive teams", icon: <Award size={16} /> },
                { label: "Every engagement tailored to your actual workflows", icon: <Layers size={16} /> },
                { label: "Infrastructure you own — not locked to us", icon: <Lock size={16} /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div style={{ color: `hsl(${GRN})` }}>{item.icon}</div>
                  <p className="font-semibold text-sm" style={{ color: `hsl(${C})` }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { stat: "78%", label: "of employees are using unapproved AI tools right now", col: RED },
              { stat: "14×", label: "output variance when there's no shared standard", col: AMB },
              { stat: "0%", label: "of AI sessions feed back into institutional knowledge by default", col: PRI },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl px-7 py-5 border flex items-center gap-6"
                style={{ background: BG, borderColor: `hsl(${item.col} / 0.2)` }}>
                <p className="font-black shrink-0 w-20 text-right" style={{ fontSize: "2.25rem", color: `hsl(${item.col})`, lineHeight: 1 }}>{item.stat}</p>
                <div className="w-px self-stretch" style={{ background: `hsl(${item.col} / 0.2)` }} />
                <p className="font-semibold text-sm" style={{ color: `hsl(${MUT})` }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PLAN: The 3-phase journey ────────────────────────────────────────────────
function Plan() {
  const phases = [
    {
      n: "1", label: "Surface", col: RED,
      title: "We map how your team actually works",
      steps: [
        "Embed with your teams — not to audit, but to observe",
        "Surface tacit knowledge: shortcuts, judgment calls, unwritten rules",
        "Name where inconsistency lives and where AI risk is invisible",
      ],
      output: "A prioritised map of the highest-value knowledge and workflows",
    },
    {
      n: "2", label: "Structure", col: PRI,
      title: "We turn it into a governed operating model",
      steps: [
        "Co-author workflow protocols and AI usage standards with your senior leads",
        "Codify expert judgment into reusable, executable knowledge",
        "Design the governance layer: what's appropriate, who decides, what's risky",
      ],
      output: "An executable protocol library inside LIZA OS — built by your people",
    },
    {
      n: "3", label: "Embed", col: GRN,
      title: "The model goes live and compounds",
      steps: [
        "Protocols activate in LIZA OS — teams execute against shared standards",
        "Every session feeds back in. Knowledge compounds across runs.",
        "New hires onboard to a defined standard, not tribal habits",
      ],
      output: "A living operating model that gets smarter with every use",
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto">
        <p className="font-bold tracking-[0.2em] uppercase text-sm mb-4" style={{ color: `hsl(${GRN})` }}>How It Works</p>
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          Three phases. No guesswork.
        </h2>
        <p className="text-lg mb-14 max-w-2xl" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          At the end, your team has an operating model they built and actually use.
        </p>

        {/* Phase cards with connectors */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {phases.map((s, i) => (
              <div key={i} className="rounded-2xl border relative overflow-hidden flex flex-col"
                style={{ background: `hsl(${s.col} / 0.05)`, borderColor: `hsl(${s.col} / 0.25)` }}>
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${s.col})` }} />
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl"
                      style={{ background: `hsl(${s.col} / 0.15)`, color: `hsl(${s.col})` }}>{s.n}</div>
                    <span className="font-bold tracking-widest uppercase text-xs" style={{ color: `hsl(${s.col})` }}>{s.label}</span>
                  </div>
                  <h3 className="font-black text-lg mb-4" style={{ color: `hsl(${C})` }}>{s.title}</h3>
                  <ul className="flex flex-col gap-2.5 flex-1">
                    {s.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm" style={{ color: `hsl(${MUT})` }}>
                        <ChevronRight size={14} className="shrink-0 mt-0.5" style={{ color: `hsl(${s.col})` }} />
                        {step}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t" style={{ borderColor: `hsl(${s.col} / 0.15)` }}>
                    <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: `hsl(${s.col})` }}>Output</p>
                    <p className="text-sm font-semibold" style={{ color: `hsl(${C})` }}>{s.output}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Flow arrows between */}
          <div className="hidden md:flex items-center justify-between px-[33%] -mt-8 mb-8 relative" style={{ top: "-1.5rem" }}>
            {[0, 1].map(i => (
              <div key={i} className="flex items-center gap-1" style={{ color: `hsl(${MUT})` }}>
                <div className="w-8 h-px" style={{ background: `hsl(${MUT} / 0.4)` }} />
                <ArrowRight size={14} />
              </div>
            ))}
          </div>
        </div>

        {/* What you walk away with */}
        <div className="rounded-2xl border p-8" style={{ background: BG2, borderColor: `hsl(${GRN} / 0.2)` }}>
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
                <p className="font-semibold text-sm" style={{ color: `hsl(${C})` }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MID-PAGE CTA ─────────────────────────────────────────────────────────────
function MidCTA() {
  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: BG2 }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] rounded-full"
          style={{ background: `radial-gradient(ellipse, hsl(${PRI} / 0.07), transparent 65%)` }} />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          Ready to build your operating model?
        </h2>
        <p className="text-lg mb-10" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          30-minute scoping call. We map your situation, understand your workflows, and scope the right engagement. No pitch deck. No commitments.
        </p>
        <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
            color: "hsl(222 22% 5%)",
            boxShadow: `0 0 40px -10px hsl(${PRI} / 0.5)`,
          }}>
          Book a scoping call <ArrowRight size={20} />
        </a>
        <p className="text-sm mt-4" style={{ color: `hsl(${MUT})` }}>Or keep reading to see what's at stake.</p>
      </div>
    </section>
  );
}

// ─── AVOID FAILURE ────────────────────────────────────────────────────────────
function AvoidFailure() {
  return (
    <section className="py-24 px-6" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto">
        <p className="font-bold tracking-[0.2em] uppercase text-sm mb-4" style={{ color: `hsl(${RED})` }}>What's at Stake</p>
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          What happens if nothing changes.
        </h2>
        <p className="text-lg mb-12 max-w-2xl" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          Ungoverned AI doesn't stay still. The gap between your best and worst performers widens. The risk compounds quietly — until it doesn't.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {[
            { label: "AI inconsistency becomes a compliance liability", col: RED, icon: <Shield size={18} /> },
            { label: "Your best people carry knowledge that evaporates when they leave", col: RED, icon: <Users size={18} /> },
            { label: "Competitors who govern AI well start outperforming you structurally", col: AMB, icon: <TrendingUp size={18} /> },
            { label: "AI tools get banned or restricted after an embarrassing incident", col: RED, icon: <Lock size={18} /> },
            { label: "You remain unable to answer: 'How are we governing AI?'", col: AMB, icon: <AlertTriangle size={18} /> },
            { label: "Every new AI rollout hits the same wall — adoption without alignment", col: RED, icon: <Layers size={18} /> },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border px-6 py-5"
              style={{ background: BG2, borderColor: `hsl(${item.col} / 0.15)` }}>
              <XCircle size={18} className="shrink-0" style={{ color: `hsl(${item.col} / 0.65)` }} />
              <p className="font-semibold text-sm" style={{ color: `hsl(${C} / 0.85)` }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Why other approaches fail */}
        <div className="rounded-2xl border p-8" style={{ background: `hsl(${RED} / 0.04)`, borderColor: `hsl(${RED} / 0.18)` }}>
          <p className="font-bold tracking-widest uppercase text-xs mb-5" style={{ color: `hsl(${RED})` }}>Why other approaches haven't worked</p>
          <div className="flex flex-col gap-3">
            {[
              { label: "Prompt engineering courses", why: "Individual skill. No shared standard. Back to 23 different styles by Monday." },
              { label: "AI tool rollouts (Copilot, ChatGPT Teams)", why: "Access without architecture. Licences ≠ alignment." },
              { label: "Internal AI champions / CoE", why: "Siloed. Slow. Becomes a bottleneck, not a multiplier." },
              { label: "Policy documents & usage guidelines", why: "Compliance theatre. No enforcement at the point of use." },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-5 py-3 border-b last:border-0"
                style={{ borderColor: `hsl(${RED} / 0.1)` }}>
                <AlertTriangle className="shrink-0 mt-0.5" size={16} style={{ color: `hsl(${RED} / 0.5)` }} />
                <div className="flex flex-col sm:flex-row sm:gap-6 flex-1">
                  <p className="font-bold text-sm shrink-0 sm:w-64" style={{ color: `hsl(${C})` }}>{t.label}</p>
                  <p className="text-sm" style={{ color: `hsl(${MUT})` }}>→ {t.why}</p>
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
    <section className="py-24 px-6" style={{ background: BG2 }}>
      <div className="max-w-6xl mx-auto">
        <p className="font-bold tracking-[0.2em] uppercase text-sm mb-4" style={{ color: `hsl(${GRN})` }}>The Success State</p>
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          Here's what your function looks like{" "}
          <span style={{ color: `hsl(${GRN})` }}>on the other side.</span>
        </h2>
        <p className="text-lg mb-14 max-w-2xl" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          Not a better-trained team. A structurally different one — that gets more consistent and more capable with every use.
        </p>

        {/* Before/After grid */}
        <div className="rounded-2xl border overflow-hidden mb-12" style={{ borderColor: `hsl(${PRI} / 0.18)` }}>
          {/* Header row */}
          <div className="grid grid-cols-2 border-b" style={{ borderColor: `hsl(${PRI} / 0.12)` }}>
            <div className="px-6 py-4 border-r" style={{ borderColor: `hsl(${PRI} / 0.12)`, background: `hsl(${RED} / 0.08)` }}>
              <p className="font-bold tracking-widest uppercase text-xs" style={{ color: `hsl(${RED})` }}>Before</p>
            </div>
            <div className="px-6 py-4" style={{ background: `hsl(${GRN} / 0.07)` }}>
              <p className="font-bold tracking-widest uppercase text-xs" style={{ color: `hsl(${GRN})` }}>After · Level 4</p>
            </div>
          </div>
          {/* Rows */}
          {transformations.map((item, i) => (
            <div key={i} className="grid grid-cols-2 border-b last:border-0" style={{ borderColor: `hsl(${PRI} / 0.08)` }}>
              <div className="px-6 py-4 border-r flex items-center gap-3" style={{ borderColor: `hsl(${PRI} / 0.08)`, background: i % 2 === 0 ? `hsl(${RED} / 0.03)` : "transparent" }}>
                <XCircle size={14} className="shrink-0" style={{ color: `hsl(${RED} / 0.5)` }} />
                <p className="text-sm" style={{ color: `hsl(${C} / 0.55)`, textDecoration: "line-through" }}>{item.before}</p>
              </div>
              <div className="px-6 py-4 flex items-center gap-3" style={{ background: i % 2 === 0 ? `hsl(${GRN} / 0.03)` : "transparent" }}>
                <CheckCircle2 size={14} className="shrink-0" style={{ color: `hsl(${GRN})` }} />
                <p className="font-semibold text-sm" style={{ color: `hsl(${C})` }}>{item.after}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Who it's for + final CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <p className="font-bold tracking-widest uppercase text-xs mb-4" style={{ color: `hsl(${PRI})` }}>This is for you if you are…</p>
            <div className="flex flex-col gap-3">
              {[
                { role: "Head of Function", context: "Strategy, Operations, Finance, Legal — you set the standards. This operationalises them." },
                { role: "COO or Chief of Staff", context: "Responsible for cross-functional execution quality. This builds the infrastructure for consistency and visibility." },
                { role: "Managing Director or Practice Lead", context: "Your team's judgment is the product. This protects and scales it." },
                { role: "Transformation or Change Lead", context: "Running AI adoption programmes. This is the governance layer that makes them stick." },
              ].map((item, i) => (
                <div key={i} className="rounded-xl px-5 py-4 border"
                  style={{ background: BG, borderColor: `hsl(${PRI} / 0.12)` }}>
                  <p className="font-bold text-sm mb-1" style={{ color: `hsl(${C})` }}>{item.role}</p>
                  <p className="text-sm leading-relaxed" style={{ color: `hsl(${MUT})` }}>{item.context}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div id="cta" className="rounded-2xl border p-10 flex flex-col items-center text-center relative overflow-hidden"
            style={{ background: `hsl(${PRI} / 0.06)`, borderColor: `hsl(${PRI} / 0.3)` }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${PRI} / 0.1), transparent 60%)` }} />
            <div className="relative z-10">
              <Star size={32} className="mx-auto mb-4" style={{ color: `hsl(${PRI})` }} />
              <h3 className="font-black text-2xl mb-3" style={{ color: `hsl(${C})`, lineHeight: 1.1 }}>
                Your team's knowledge is already there.{" "}
                <span style={{ color: `hsl(${PRI})` }}>Let's build with it.</span>
              </h3>
              <p className="text-base mb-8" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
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
                    style={{ background: BG, borderColor: `hsl(${PRI} / 0.15)` }}>
                    <p className="font-bold tracking-widest uppercase text-[10px]" style={{ color: `hsl(${PRI})` }}>{item.label}</p>
                    <p className="font-semibold text-sm mt-0.5" style={{ color: `hsl(${C})` }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90 w-full justify-center"
                style={{
                  background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
                  color: "hsl(222 22% 5%)",
                  boxShadow: `0 0 32px -8px hsl(${PRI} / 0.4)`,
                }}>
                Book a scoping call <ArrowRight size={18} />
              </a>
              <p className="text-xs mt-3" style={{ color: `hsl(${MUT})` }}>No commitments. No pitch deck.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 border-t" style={{ background: BG, borderColor: "hsl(222 18% 10%)" }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-black tracking-widest text-sm" style={{ color: `hsl(${PRI})` }}>LIZA OS</span>
        <p className="text-xs" style={{ color: `hsl(${MUT})` }}>AI Operating Model Programme · Enterprise</p>
        <Link to="/" className="text-xs hover:opacity-80" style={{ color: `hsl(${MUT})` }}>← Back to liza.ai</Link>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EnterpriseDeck() {
  return (
    <div style={{ background: BG }}>
      <Nav />
      <Hero />
      <MaturityInfographic />
      <Problem />
      <Guide />
      <Plan />
      <MidCTA />
      <AvoidFailure />
      <Success />
      <Footer />
    </div>
  );
}
