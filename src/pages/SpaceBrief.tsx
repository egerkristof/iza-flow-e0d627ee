import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

/**
 * /space-brief — Responsive one-page summary of the Space Strategic Deck.
 * Works on mobile (CEO opens on phone, 30 seconds) and desktop.
 *
 * Narrative reframe: Lead with the SPACE-VERTICAL problem (mission cost
 * overruns, heritage knowledge walking out the door, retention crisis).
 * AI is positioned as the horizontal layer that — without governance —
 * makes the vertical knowledge problem worse. LIZA OS encodes the
 * mission-critical knowledge first, then governs AI on top.
 *
 * Single CTA: View the full deck (/space).
 */

const TEAL = "174 97% 28%";
const MINT = "160 96% 39%";

const verticalProblems = [
  {
    stat: "30–40 yrs",
    label: "Heritage at risk",
    detail:
      "Mission heritage and chief-engineer judgment locked in retiring NASA, ESA, and European aerospace experts. Most of it never codified in a queryable form.",
    source: "LIZA OS field engagements",
  },
  {
    stat: "~50%",
    label: "Smallsat failures",
    detail:
      "Of small-satellite and CubeSat missions experience partial or total failure within their first year. Most root causes trace to known precedent that did not propagate.",
    source: "Industry studies, 2023–24",
  },
  {
    stat: "30–40%",
    label: "Repeat NCRs",
    detail:
      "Of aerospace non-conformances repeat known root causes across programs and sites. FRACAS knowledge does not propagate batch-to-batch.",
    source: "Aerospace quality benchmarks",
  },
];

const loop = [
  { step: "Encode", desc: "Capture mission heritage as executable standards." },
  { step: "Govern", desc: "Gate every AI output against ECSS, MAIT, and program rules." },
  { step: "Execute", desc: "Run trade studies and reviews inside governed bounds." },
  { step: "Evolve", desc: "Each build refines the standard. Knowledge compounds." },
];

const proofs = [
  {
    label: "Standards Lock",
    claim: "Encodes ECSS, MAIT, and program-specific procedures as automated gates.",
  },
  {
    label: "Heritage Capture",
    claim: "Bottles senior judgment before it walks out the door. Repeatable across missions.",
  },
  {
    label: "Governed AI",
    claim: "AI accelerates execution without inventing physics or skipping reviews.",
  },
];

export default function SpaceBrief() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b border-border">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="block w-7 h-1 rounded-full" style={{ background: `hsl(${TEAL})` }} />
            <span className="font-bold tracking-tight text-sm">LIZA OS</span>
          </div>
          <span className="text-[11px] tracking-widest uppercase text-muted-foreground">
            Space · Brief
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 sm:px-8 pt-10 sm:pt-16 pb-24">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-5"
          style={{ color: `hsl(${TEAL})` }}
        >
          Mission Memory for Space
        </motion.p>

        {/* Hero — vertical-first framing */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-black tracking-tight leading-[1.02] text-[40px] sm:text-7xl lg:text-8xl max-w-5xl"
        >
          Space programs don't fail<br className="hidden sm:block" />
          <span> </span>on physics.<br />
          They fail on{" "}
          <span style={{ color: `hsl(${TEAL})` }}>knowledge that walked out.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-6 sm:mt-8 text-lg sm:text-2xl text-muted-foreground leading-snug max-w-3xl"
        >
          Mission heritage retires. Standards drift between programs. Reviews slip.
          AI is a horizontal accelerant — and without a governed knowledge layer
          underneath, it accelerates the wrong thing.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-base sm:text-xl font-bold"
          style={{ color: `hsl(${TEAL})` }}
        >
          LIZA OS is the Mission Memory Layer for AI-Native Space.
        </motion.p>

        {/* Vertical problem evidence — three cards */}
        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            What it costs the sector
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {verticalProblems.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="rounded-2xl border border-border p-6 sm:p-7 flex flex-col"
              >
                <div
                  className="text-5xl sm:text-6xl font-black leading-none tracking-tight"
                  style={{ color: `hsl(${TEAL})` }}
                >
                  {p.stat}
                </div>
                <p className="mt-3 text-[11px] font-bold tracking-widest uppercase text-foreground">
                  {p.label}
                </p>
                <p className="mt-2 text-sm sm:text-[15px] text-muted-foreground leading-snug flex-1">
                  {p.detail}
                </p>
                <p className="mt-4 text-[10px] italic text-muted-foreground/70">
                  Source: {p.source}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Reframe: AI is horizontal, knowledge is vertical */}
        <section className="mt-14 sm:mt-20 grid gap-4 sm:grid-cols-5">
          <div className="sm:col-span-2 rounded-2xl bg-muted/50 p-6 sm:p-8">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-3">
              The reframe
            </p>
            <p className="font-black text-2xl sm:text-3xl leading-tight tracking-tight">
              AI is horizontal.<br />
              Mission knowledge is{" "}
              <span style={{ color: `hsl(${TEAL})` }}>vertical.</span>
            </p>
          </div>

          <div className="sm:col-span-3 rounded-2xl border border-border p-6 sm:p-8 grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/80 mb-2">
                Today
              </p>
              <p className="font-bold text-base sm:text-lg">Best-effort copilots</p>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                Generic AI guesses at standards. Engineers re-do reviews. Heritage
                is locked in heads. Rework soars on every mission.
              </p>
            </div>
            <div>
              <p
                className="text-[10px] font-bold tracking-widest uppercase mb-2"
                style={{ color: `hsl(${TEAL})` }}
              >
                With LIZA OS
              </p>
              <p className="font-bold text-base sm:text-lg" style={{ color: `hsl(${TEAL})` }}>
                Governed Mission Memory
              </p>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                Standards are encoded. AI executes only inside them. Heritage
                compounds across programs instead of evaporating.
              </p>
            </div>
          </div>
        </section>

        {/* Loop */}
        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            The Loop
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {loop.map((s, i) => (
              <div key={s.step} className="rounded-xl border border-border p-4 sm:p-5">
                <p className="text-xs font-bold mb-1" style={{ color: `hsl(${TEAL})` }}>
                  0{i + 1}
                </p>
                <p className="font-bold text-base sm:text-lg">{s.step}</p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-snug">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Proof points */}
        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            Why It Works
          </p>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {proofs.map((p) => (
              <div key={p.label}>
                <div className="w-6 h-0.5 mb-3" style={{ background: `hsl(${TEAL})` }} />
                <p className="font-bold text-sm tracking-wide uppercase">{p.label}</p>
                <p className="mt-2 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                  {p.claim}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pilot */}
        <section
          className="mt-14 sm:mt-20 rounded-2xl border-2 p-6 sm:p-10"
          style={{ borderColor: `hsl(${TEAL})`, background: `hsl(${MINT} / 0.06)` }}
        >
          <p
            className="text-[11px] font-bold tracking-widest uppercase mb-2"
            style={{ color: `hsl(${TEAL})` }}
          >
            30-Day MAIT Pilot
          </p>
          <p className="font-black text-2xl sm:text-4xl tracking-tight">
            Codify · Govern · Prove
          </p>
          <p className="mt-3 text-sm sm:text-lg text-muted-foreground leading-snug max-w-2xl">
            One mission thread, encoded against your standards. Quantified rework
            reduction. A governed audit trail you can show the customer.
          </p>
        </section>

        {/* Ask */}
        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            The Ask
          </p>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-foreground text-background p-6 sm:p-8">
              <p
                className="text-[10px] font-bold tracking-widest uppercase mb-2"
                style={{ color: `hsl(${MINT})` }}
              >
                Door 1
              </p>
              <p className="font-bold text-lg sm:text-xl">Pilot Customer</p>
              <p className="mt-2 text-sm sm:text-base opacity-80 leading-snug">
                Run one MAIT thread with LIZA OS. Pay only if proven.
              </p>
            </div>
            <div
              className="rounded-2xl p-6 sm:p-8 text-white"
              style={{ background: `hsl(${TEAL})` }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-white/70">
                Door 2
              </p>
              <p className="font-bold text-lg sm:text-xl">Sovereign Partner</p>
              <p className="mt-2 text-sm sm:text-base text-white/85 leading-snug">
                Take a strategic stake. Anchor governance for national missions.
              </p>
            </div>
          </div>
        </section>

        {/* Single CTA — full deck */}
        <section className="mt-14 sm:mt-20">
          <Link
            to="/space"
            className="group flex items-center justify-between gap-4 rounded-2xl px-6 sm:px-8 py-5 sm:py-7 font-bold text-lg sm:text-2xl transition-all hover:opacity-95 hover:translate-y-[-1px]"
            style={{ background: `hsl(${TEAL})`, color: "white" }}
          >
            <span>View the full deck</span>
            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-bold text-foreground">Governed AI for Space Missions</span>
          <span>lizaos.ai/space-brief</span>
        </footer>
      </main>
    </div>
  );
}
