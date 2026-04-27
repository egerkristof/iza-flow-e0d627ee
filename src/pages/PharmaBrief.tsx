import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Shield,
  Pill,
  RefreshCw,
  FileQuestion,
  Clock,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * /pharma-brief — Responsive one-page summary of the Pharma Investor Deck.
 * Mirrors /space-brief and /satcom-brief in tone and structure, but reframes
 * the narrative for regulated life sciences:
 *
 *   - The vertical problem is GxP knowledge that never gets codified:
 *     deviation precedent, CAPA outcomes, sponsor SOP nuance, agency
 *     feedback. It lives in senior QA / med-writer / monitor heads.
 *   - AI without governance amplifies the gap: plausible answers inside
 *     deviations, CSRs, PV narratives that QA still has to catch and rework.
 *   - LIZA OS is the GxP Memory Layer — encodes the judgment, governs the
 *     AI output, and turns every batch / study / case into reusable memory.
 *
 * Single CTA: View the full deck (/investor-pharma).
 */

const TEAL = "200 75% 36%";   // pharma blue, matches PharmaPitchDeck ACCENT
const MINT = "170 65% 32%";

const verticalProblems = [
  {
    stat: "30–40%",
    label: "Repeat deviations",
    detail:
      "A material share of pharma quality events repeat known root causes across batches and sites. CAPA knowledge does not propagate. The same exception is paid for again and again.",
    source: "Industry quality benchmarks",
  },
  {
    stat: "$2.6B",
    label: "Cost per approved drug",
    detail:
      "Average capitalised cost to bring one new molecule to approval. Every avoidable deviation, re-write, and audit loop adds directly to that number — and to time-to-patient.",
    source: "Tufts CSDD, 2016 (DiMasi et al.)",
  },
  {
    stat: "~10%",
    label: "Phase I → approval rate",
    detail:
      "Roughly one in ten investigational drugs that enter Phase I reaches approval. Sponsor judgment, prior agency feedback, and protocol precedent are the difference — and most of it is uncodified.",
    source: "BIO / Informa Phase Transition benchmarks",
  },
];

const loop = [
  {
    step: "Codify",
    short: "Capture sponsor & QA judgment.",
    desc: "Turn SOP nuance, deviation precedent, CAPA outcomes, and agency feedback into governed, reusable rules.",
    Icon: BookOpen,
  },
  {
    step: "Govern",
    short: "Check every AI output.",
    desc: "AI answers inside deviations, CAPAs, CSR sections, and PV narratives are gated against your validated GxP context.",
    Icon: Shield,
  },
  {
    step: "Apply",
    short: "Teams ramp and run faster.",
    desc: "QA, medical writers, and monitors work inside the same governed standard — with full audit trail, not around it.",
    Icon: Pill,
  },
  {
    step: "Improve",
    short: "Lessons compound batch by batch.",
    desc: "Every deviation, CAPA, and inspection feeds new memory back. The next study and the next lot start smarter.",
    Icon: RefreshCw,
  },
];

export default function PharmaBrief() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b border-border">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="block w-7 h-1 rounded-full shrink-0" style={{ background: `hsl(${TEAL})` }} />
            <span className="font-bold tracking-tight text-sm">LIZA OS</span>
            <span className="hidden sm:inline text-[11px] tracking-widest uppercase text-muted-foreground ml-3">
              Pharma · Brief
            </span>
          </div>
          <Link
            to="/investor-pharma"
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
          For Pharma & Life Sciences · 2-Minute Brief
        </motion.p>

        {/* Hero */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-black tracking-tight leading-[1.02] text-[40px] sm:text-7xl lg:text-8xl max-w-5xl"
        >
          Drugs don't fail<br className="hidden sm:block" />
          <span> </span>on chemistry.<br />
          They fail on{" "}
          <span style={{ color: `hsl(${TEAL})` }}>judgment that was never codified.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-6 sm:mt-8 text-lg sm:text-2xl text-muted-foreground leading-snug max-w-2xl"
        >
          SOP nuance, deviation precedent, and sponsor standards live in senior QA and medical heads. AI doesn't have it either.
        </motion.p>

        {/* Three symptoms */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-10 sm:mt-12 grid grid-cols-3 gap-2 sm:gap-6 max-w-3xl"
        >
          {[
            { Icon: FileQuestion, label: "Not codified", sub: "Lives in senior QA heads" },
            { Icon: Clock, label: "Slow to onboard", sub: "Months to ramp a new monitor" },
            { Icon: TrendingUp, label: "Doesn't propagate", sub: "Lessons stay in one site" },
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
          LIZA OS is the GxP Memory Layer — codifies sponsor and QA judgment, ramps new teams faster, and governs every AI output against your validated standards.
        </motion.p>

        {/* Vertical problem evidence */}
        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            Why this matters now
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {verticalProblems.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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

          <div className="relative">
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

            <div className="hidden sm:flex items-center justify-center mt-8 gap-2 text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Each cycle makes the next batch, study, and submission smarter</span>
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
            One workflow. 30 days. Audit-ready proof.
          </p>
          <p className="mt-3 text-sm sm:text-lg text-muted-foreground leading-snug max-w-2xl">
            We pick one critical workflow — a deviation, a CAPA loop, a CSR section, or a PV narrative — encode it against your validated standards, and measure the rework hours saved and review cycles cut. You get a clear before-and-after, plus a full audit trail.
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
                One workflow on one site or one study. Fixed scope, fixed price.
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
              <p className="font-bold text-lg sm:text-xl">Become a design partner</p>
              <p className="mt-2 text-sm sm:text-base text-white/85 leading-snug">
                Co-develop the GxP-native version of LIZA OS with us. Anchor it as the memory layer for your sponsor, CRO, or CMO operations.
              </p>
            </div>
          </div>
        </section>

        {/* Single CTA — full deck */}
        <section className="mt-14 sm:mt-20">
          <Link
            to="/investor-pharma"
            className="group flex items-center justify-between gap-4 rounded-2xl px-6 sm:px-8 py-5 sm:py-7 font-bold text-lg sm:text-2xl transition-all hover:opacity-95 hover:translate-y-[-1px]"
            style={{ background: `hsl(${TEAL})`, color: "white" }}
          >
            <span>See the full deck</span>
            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-bold text-foreground">LIZA OS · GxP knowledge, governed.</span>
          <span>lizaos.ai/pharma-brief</span>
        </footer>
      </main>
    </div>
  );
}