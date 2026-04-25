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
      "Decades of mission know-how sit inside the heads of retiring NASA, ESA, and European aerospace engineers. When they leave, the judgment leaves with them.",
    source: "LIZA OS field engagements",
  },
  {
    stat: "~50%",
    label: "Smallsat failures",
    detail:
      "Roughly half of small-satellite missions fail in their first year. Most causes are already known on a previous mission, but the lesson never reaches the next team.",
    source: "Industry studies, 2023–24",
  },
  {
    stat: "30–40%",
    label: "Repeat defects",
    detail:
      "Of aerospace quality issues repeat across programs and sites. The same mistake gets paid for twice because lessons learned don't travel between projects.",
    source: "Aerospace quality benchmarks",
  },
];

const loop = [
  { step: "Capture", desc: "Turn senior engineers' know-how into clear, written rules — before they retire." },
  { step: "Enforce", desc: "Every AI answer is checked against your standards (ECSS, AS9100, program rules) before it reaches an engineer." },
  { step: "Apply", desc: "Engineers use AI for trade studies, reviews, and documentation — inside your rules, not around them." },
  { step: "Improve", desc: "Every mission feeds new lessons back into the rules. The next mission starts smarter." },
];

export default function SpaceBrief() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b border-border">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="block w-7 h-1 rounded-full shrink-0" style={{ background: `hsl(${TEAL})` }} />
            <span className="font-bold tracking-tight text-sm">LIZA OS</span>
            <span className="hidden sm:inline text-[11px] tracking-widest uppercase text-muted-foreground ml-3">
              Space · Brief
            </span>
          </div>
          <Link
            to="/space"
            className="group inline-flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-all hover:opacity-90"
            style={{ background: `hsl(${TEAL})`, color: "white" }}
          >
            <span>View full deck</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
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
          For Space Programs · 2-Minute Brief
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
          Senior engineers retire. Standards drift between programs.
          AI tools can speed up the work — but they don't know your standards,
          your mission history, or the calls your chief engineer would have made.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-base sm:text-xl font-bold"
          style={{ color: `hsl(${TEAL})` }}
        >
          LIZA OS captures your mission knowledge and uses it to govern every AI output.
        </motion.p>

        {/* Vertical problem evidence — three cards */}
        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            Why this matters now
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

        {/* Loop */}
        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            How LIZA OS works
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

        {/* Pilot */}
        <section
          className="mt-14 sm:mt-20 rounded-2xl border-2 p-6 sm:p-10"
          style={{ borderColor: `hsl(${TEAL})`, background: `hsl(${MINT} / 0.06)` }}
        >
          <p
            className="text-[11px] font-bold tracking-widest uppercase mb-2"
            style={{ color: `hsl(${TEAL})` }}
          >
            30-Day Pilot
          </p>
          <p className="font-black text-2xl sm:text-4xl tracking-tight">
            One workflow. 30 days. Proven savings.
          </p>
          <p className="mt-3 text-sm sm:text-lg text-muted-foreground leading-snug max-w-2xl">
            We pick one critical workflow on one of your missions, encode it against your
            standards, and measure the rework hours saved. You get a clear before-and-after,
            and an audit trail you can show your customer.
          </p>
        </section>

        {/* Ask */}
        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            Two ways to start
          </p>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-foreground text-background p-6 sm:p-8">
              <p
                className="text-[10px] font-bold tracking-widest uppercase mb-2"
                style={{ color: `hsl(${MINT})` }}
              >
                Option A
              </p>
              <p className="font-bold text-lg sm:text-xl">Run a 30-day pilot</p>
              <p className="mt-2 text-sm sm:text-base opacity-80 leading-snug">
                One workflow on one mission. Fixed scope, fixed price.
                You only continue if the savings are real.
              </p>
            </div>
            <div
              className="rounded-2xl p-6 sm:p-8 text-white"
              style={{ background: `hsl(${TEAL})` }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-white/70">
                Option B
              </p>
              <p className="font-bold text-lg sm:text-xl">Become a strategic partner</p>
              <p className="mt-2 text-sm sm:text-base text-white/85 leading-snug">
                Co-develop the space version of LIZA OS with us. Take an equity
                position and anchor it for your national and European missions.
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
            <span>See the full deck</span>
            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-bold text-foreground">LIZA OS · Mission knowledge, governed.</span>
          <span>lizaos.ai/space-brief</span>
        </footer>
      </main>
    </div>
  );
}
