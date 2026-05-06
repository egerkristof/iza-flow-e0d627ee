import { Link } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Shield,
  Database,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import BriefIceberg from "@/components/marketing/BriefIceberg";

/**
 * /space-defense-holdings-brief — Responsive one-page summary of the
 * Space & Defence Holdings deck. Lifecycle-first framing: capture & bid,
 * engineering & qualification, sustainment & ILS. Dual CTA: customer
 * pilot, strategic round, or both.
 */

const TEAL = "174 97% 28%";
const MINT = "160 96% 39%";

const verticalProblems = [
  {
    stat: "+27%",
    label: "DOD schedule growth",
    detail:
      "Average schedule growth on major DOD weapon programmes since baseline. Late requirements changes, ECR backlog, and engineering rework are the repeatedly named drivers.",
    source: "GAO-25-107569, Weapon Systems Annual Assessment, 2025",
  },
  {
    stat: "$7.6B",
    label: "NASA cost overruns",
    detail:
      "Cumulative cost overruns across NASA's portfolio of major projects in development. Engineering rework and late requirements changes among the largest drivers.",
    source: "GAO-23-106021, NASA Assessments of Major Projects",
  },
  {
    stat: "100x",
    label: "Late-defect cost",
    detail:
      "Cost amplification of fixing a requirements or interface defect after qualification versus catching it at design. The canonical late-defect curve in systems engineering.",
    source: "INCOSE / NASA, Error Cost Escalation",
  },
];

const lifecycle = [
  {
    step: "Capture & Bid",
    short: "Win-themes that compound.",
    desc: "RFPs, compliance matrices, and prior-bid memory grounded in what actually closed deals across the holding.",
    Icon: FileText,
  },
  {
    step: "Engineering",
    short: "Design intent, governed.",
    desc: "ICDs, ECRs, qualification packages, and chief-engineer judgment available at issue time, not after rework.",
    Icon: Shield,
  },
  {
    step: "Sustainment",
    short: "Operator memory closes the loop.",
    desc: "As-built deviations, field workarounds, and reliability patterns flow back into the next capture and the next build.",
    Icon: Database,
  },
  {
    step: "Compound",
    short: "Across every subsidiary.",
    desc: "One context layer across acquired engineering memory. Each programme makes the next subsidiary smarter.",
    Icon: RefreshCw,
  },
];

export default function SpaceDefenseHoldingsBrief() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <header className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b border-border">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="block w-7 h-1 rounded-full shrink-0" style={{ background: `hsl(${TEAL})` }} />
            <span className="font-bold tracking-tight text-sm">LIZA OS</span>
            <span className="hidden sm:inline text-[11px] tracking-widest uppercase text-muted-foreground ml-3">
              Space &amp; Defence Holdings · Brief
            </span>
          </div>
          <Link
            to="/space-defense-holdings"
            className="group inline-flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-all hover:opacity-90"
            style={{ background: `hsl(${TEAL})`, color: "white" }}
          >
            <span>View full deck</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 sm:px-8 pt-10 sm:pt-16 pb-24">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-5"
          style={{ color: `hsl(${TEAL})` }}
        >
          For Space &amp; Defence Holdings · 2-Minute Brief
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-black tracking-tight leading-[1.02] text-[40px] sm:text-7xl lg:text-8xl max-w-5xl"
        >
          Programmes don&apos;t slip<br className="hidden sm:block" />
          <span> </span>on engineering.<br />
          They slip on{" "}
          <span style={{ color: `hsl(${TEAL})` }}>context that was never codified.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-6 sm:mt-8 text-lg sm:text-2xl text-muted-foreground leading-snug max-w-2xl"
        >
          Win-themes leave with the capture team. Engineering judgment dies between phases. Each acquisition becomes a knowledge silo. AI inherits none of it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-10 sm:mt-12 max-w-3xl"
        >
          <BriefIceberg
            teal={TEAL}
            aboveLabel="What AI is given today"
            belowLabel="What actually wins, builds, and sustains the programme"
            above={["Specifications", "ICDs", "Standards (AS9100, AQAP, ECSS)", "Qualification packages"]}
            below={[
              "Win-themes that closed the last bid",
              "Customer authority interpretation on this programme",
              "Chief-engineer judgment per subsystem",
              "Field workarounds operators never wrote down",
            ]}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-10 sm:mt-12 text-base sm:text-xl font-bold max-w-2xl"
          style={{ color: `hsl(${TEAL})` }}
        >
          LIZA OS is the Programme Memory Layer. One context layer across capture, engineering, and sustainment. Across every subsidiary in the holding.
        </motion.p>

        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            What missing context costs
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

        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            One context layer across the lifecycle
          </p>

          <div className="relative">
            <div
              className="hidden sm:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
              style={{ background: `hsl(${TEAL} / 0.25)` }}
              aria-hidden
            />
            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-3 sm:gap-x-4">
              {lifecycle.map((s, i) => {
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
              <span>Each programme makes the next subsidiary smarter</span>
            </div>
          </div>
        </section>

        <section
          className="mt-14 sm:mt-20 rounded-2xl border-2 p-6 sm:p-10"
          style={{ borderColor: `hsl(${TEAL})`, background: `hsl(${MINT} / 0.06)` }}
        >
          <p
            className="text-[11px] font-bold tracking-widest uppercase mb-2"
            style={{ color: `hsl(${TEAL})` }}
          >
            30-Day Lifecycle Pilot
          </p>
          <p className="font-black text-2xl sm:text-4xl tracking-tight">
            One subsidiary. One stage. Live programme.
          </p>
          <p className="mt-3 text-sm sm:text-lg text-muted-foreground leading-snug max-w-2xl">
            We pick one stage of the lifecycle inside one subsidiary. Capture, engineering, or sustainment. We encode it against your standards on a real programme and measure the rework hours saved. Fixed scope. Fixed price. You own the context layer.
          </p>
        </section>

        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            Two ways to come on board
          </p>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-foreground text-background p-6 sm:p-8">
              <p
                className="text-[10px] font-bold tracking-widest uppercase mb-2"
                style={{ color: `hsl(${MINT})` }}
              >
                Option A · Customer
              </p>
              <p className="font-bold text-lg sm:text-xl">Run a 30-day lifecycle pilot</p>
              <p className="mt-2 text-sm sm:text-base opacity-80 leading-snug">
                One subsidiary. One lifecycle stage. One live programme. Fixed scope, fixed price. Convert to platform plus usage credits only if the savings are real.
              </p>
            </div>
            <div
              className="rounded-2xl p-6 sm:p-8 text-white"
              style={{ background: `hsl(${TEAL})` }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-white/70">
                Option B · Investor
              </p>
              <p className="font-bold text-lg sm:text-xl">Take a strategic stake</p>
              <p className="mt-2 text-sm sm:text-base text-white/85 leading-snug">
                €3M strategic minority. 18-month runway. Build the Space &amp; Defence reference architecture across the holding and the wider European market with us.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14 sm:mt-20">
          <Link
            to="/space-defense-holdings"
            className="group flex items-center justify-between gap-4 rounded-2xl px-6 sm:px-8 py-5 sm:py-7 font-bold text-lg sm:text-2xl transition-all hover:opacity-95 hover:translate-y-[-1px]"
            style={{ background: `hsl(${TEAL})`, color: "white" }}
          >
            <span>See the full deck</span>
            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>

        <footer className="mt-16 pt-6 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-bold text-foreground">LIZA OS · Programme memory, governed.</span>
          <span>lizaos.ai/space-defense-holdings-brief</span>
        </footer>
      </main>
    </div>
  );
}