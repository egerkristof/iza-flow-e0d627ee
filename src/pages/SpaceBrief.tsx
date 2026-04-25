import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Shield,
  Rocket,
  RefreshCw,
  FileQuestion,
  Clock,
  TrendingUp,
} from "lucide-react";
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
      "Decades of mission heritage and chief-engineer judgment sit in retiring NASA, ESA, and European aerospace experts. Most of it is never codified in a form anyone else can use.",
    source: "LIZA OS field engagements",
  },
  {
    stat: "6–12 mo",
    label: "Onboarding drag",
    detail:
      "New mission engineers take 6–12 months to become productive. Standards, history, and prior decisions live across people and folders — not in one governed place.",
    source: "Aerospace HR benchmarks",
  },
  {
    stat: "30–40%",
    label: "Lessons don't propagate",
    detail:
      "Of aerospace non-conformances repeat known root causes across programs. What one team learned doesn't reach the next, and the same mistake gets paid for twice.",
    source: "Aerospace quality benchmarks",
  },
];

const loop = [
  {
    step: "Capture",
    short: "Define the expertise.",
    desc: "Turn standards, decisions, and senior judgment into clear written rules — once.",
    Icon: BookOpen,
  },
  {
    step: "Enforce",
    short: "Check every AI output.",
    desc: "AI answers are gated against ECSS, AS9100, and program rules.",
    Icon: Shield,
  },
  {
    step: "Apply",
    short: "Everyone ramps faster.",
    desc: "New and senior engineers run trade studies, reviews, and docs inside your rules.",
    Icon: Rocket,
  },
  {
    step: "Improve",
    short: "Lessons compound.",
    desc: "Every mission feeds new learnings back. The next one starts smarter.",
    Icon: RefreshCw,
  },
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
          Space programs run<br className="hidden sm:block" />
          <span> </span>on expertise.<br />
          Most of it is{" "}
          <span style={{ color: `hsl(${TEAL})` }}>never written down.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-6 sm:mt-8 text-lg sm:text-2xl text-muted-foreground leading-snug max-w-2xl"
        >
          Knowledge stays in senior heads. Onboarding drags on. AI doesn't know your standards.
        </motion.p>

        {/* Visual: the lifecycle gap — three symptoms of undefined expertise */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-10 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-6 max-w-3xl"
        >
          {[
            { Icon: FileQuestion, label: "Never defined", sub: "Lives in senior heads" },
            { Icon: Clock, label: "Slow onboarding", sub: "6–12 months to ramp" },
            { Icon: TrendingUp, label: "Doesn't scale", sub: "One team's wins stay there" },
          ].map((item) => {
            const Icon = item.Icon;
            return (
              <div key={item.label} className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center border-2"
                  style={{ borderColor: `hsl(${TEAL} / 0.3)`, background: `hsl(${TEAL} / 0.06)` }}
                >
                  <Icon className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: `hsl(${TEAL})` }} />
                </div>
                <p className="mt-3 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-foreground">
                  {item.label}
                </p>
                <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground leading-snug max-w-[140px]">
                  {item.sub}
                </p>
              </div>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-10 sm:mt-12 text-base sm:text-xl font-bold max-w-2xl"
          style={{ color: `hsl(${TEAL})` }}
        >
          LIZA OS makes mission expertise an operating asset — defined, scalable, and governed across every AI output.
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

          {/* Flow diagram with connectors */}
          <div className="relative">
            {/* Desktop horizontal connector line */}
            <div
              className="hidden sm:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
              style={{ background: `hsl(${TEAL} / 0.25)` }}
              aria-hidden
            />
            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-3 sm:gap-x-4">
              {loop.map((s, i) => {
                const Icon = s.Icon;
                return (
                  <motion.div
                    key={s.step}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Icon node */}
                    <div
                      className="relative w-16 h-16 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border-2 bg-white"
                      style={{ borderColor: `hsl(${TEAL})`, color: `hsl(${TEAL})` }}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span
                        className="absolute -top-2 -right-2 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center text-white"
                        style={{ background: `hsl(${TEAL})` }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <p className="mt-3 font-black text-base sm:text-lg tracking-tight">{s.step}</p>
                    <p className="mt-1 text-xs sm:text-sm font-semibold" style={{ color: `hsl(${TEAL})` }}>
                      {s.short}
                    </p>
                    <p className="mt-1.5 text-xs sm:text-[13px] text-muted-foreground leading-snug max-w-[180px]">
                      {s.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Loop-back arrow on desktop */}
            <div className="hidden sm:flex items-center justify-center mt-8 gap-2 text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Each cycle makes the next mission smarter</span>
            </div>
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
