import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Network,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import BriefIceberg from "@/components/marketing/BriefIceberg";

/**
 * /research-brief — Responsive 2-minute brief for the academic research vertical.
 *
 * Narrative:
 *  - PhDs, early-career researchers, and faculty don't fail on intelligence.
 *    They fail on the months lost to literature reviews that flatten the field
 *    instead of mapping it.
 *  - AI today automates the writing. That hollows out the researcher.
 *  - LIZA OS is a Research Memory Layer: it doesn't just review the literature,
 *    it surfaces the hierarchy and relationships between ideas, schools, and
 *    authors — so the researcher understands the field, then thinks further.
 *  - Grounded in a relational theory of knowledge (Polanyi, Nonaka/SECI,
 *    Csíkszentmihályi flow, neuroscience of social cognition): real knowledge
 *    is created in relation, not extracted in isolation.
 *
 * Two-door CTA: pilot inside one department / research group, or co-define the
 * standard with a sponsoring university.
 */

const TEAL = "174 97% 28%";
const MINT = "160 96% 39%";

const verticalProblems = [
  {
    stat: "6–12 mo",
    label: "Lost to literature review",
    detail:
      "Systematic and scoping reviews routinely consume 6–12 months of a PhD or early-career researcher's time before any original contribution begins.",
    source: "Cochrane / PRISMA guidance",
  },
  {
    stat: "30%+",
    label: "Of the field never read",
    detail:
      "Even rigorous reviews miss large portions of the relevant literature. Hierarchies between schools, authors, and lineages of ideas stay invisible.",
    source: "Meta-research on review coverage",
  },
  {
    stat: "1 in 2",
    label: "Hollowed out by automation",
    detail:
      "Generative AI tools today write the paper instead of helping the researcher think. The learning loop — and the researcher — is the casualty.",
    source: "HBR, 2025 · AI and knowledge work",
  },
];

const loop = [
  {
    step: "Map",
    short: "See the field, not a list.",
    desc: "Ingest the corpus and surface the schools, lineages, and disagreements between authors — not a flat bibliography.",
    Icon: Network,
  },
  {
    step: "Anchor",
    short: "Codify your stance.",
    desc: "Your assumptions, framework, and prior work become executable context the system reasons against.",
    Icon: BookOpen,
  },
  {
    step: "Augment",
    short: "Think further, faster.",
    desc: "Trade-offs, counter-arguments, and gaps surface in dialogue. The researcher stays the author.",
    Icon: Sparkles,
  },
  {
    step: "Compound",
    short: "Knowledge accumulates.",
    desc: "Every reading, note, and decision feeds the next project — for the researcher, the lab, and the institution.",
    Icon: RefreshCw,
  },
];

export default function ResearchBrief() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b border-border">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="block w-7 h-1 rounded-full shrink-0" style={{ background: `hsl(${TEAL})` }} />
            <span className="font-bold tracking-tight text-sm">LIZA OS</span>
            <span className="hidden sm:inline text-[11px] tracking-widest uppercase text-muted-foreground ml-3">
              Research · Brief
            </span>
          </div>
          <Link
            to="/research-deck"
            className="group inline-flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-all hover:opacity-90"
            style={{ background: `hsl(${TEAL})`, color: "white" }}
          >
            <span>Open the deck</span>
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
          For Universities & Research Groups · 2-Minute Brief
        </motion.p>

        {/* Hero */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-black tracking-tight leading-[1.02] text-[40px] sm:text-7xl lg:text-8xl max-w-5xl"
        >
          Don't just review<br className="hidden sm:block" />
          <span> </span>the literature.<br />
          <span style={{ color: `hsl(${TEAL})` }}>Understand the field.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-6 sm:mt-8 text-lg sm:text-2xl text-muted-foreground leading-snug max-w-2xl"
        >
          Researchers lose months flattening a field into a bibliography.
          AI that writes for them hollows out the work. There is a third path.
        </motion.p>

        {/* Iceberg — what reviews capture vs. what actually constitutes the field */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-10 sm:mt-12 max-w-3xl"
        >
          <BriefIceberg
            teal={TEAL}
            aboveLabel="What a literature review captures"
            belowLabel="What actually constitutes the field"
            above={["Citation lists", "Abstracts", "Keywords", "Recent papers"]}
            below={[
              "Hierarchies between schools of thought",
              "Lineages of ideas across decades",
              "Tacit disagreements between authors",
              "Why-not-this decisions in past debates",
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
          LIZA OS is the Research Memory Layer — it maps the relations between ideas, schools, and authors, then augments the researcher's own thinking inside that map.
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

        {/* Foundations — relational theory, augmentation not automation */}
        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            The thesis
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border p-6 sm:p-7">
              <p className="font-black text-lg tracking-tight">Understand the field, don't flatten it</p>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                A literature review is not a bibliography task. It is the act
                of mapping a field: the schools, the lineages, the
                disagreements between authors, the why-not-this decisions in
                past debates. The researcher needs to see that map, not a
                flat list of citations.
              </p>
            </div>
            <div className="rounded-2xl border border-border p-6 sm:p-7">
              <p className="font-black text-lg tracking-tight">Augment, don't automate</p>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                A tool that writes the thesis for the PhD is a regression. A
                tool that helps the researcher see further — and stay the
                author — is the only direction worth building.
              </p>
            </div>
            <div className="rounded-2xl border border-border p-6 sm:p-7">
              <p className="font-black text-lg tracking-tight">The researcher stays the author</p>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">
                Every claim, every judgment, every disagreement remains the
                researcher's own. The system surfaces trade-offs and
                counter-arguments inside the map. It does not write the work,
                and it does not replace the thinking.
              </p>
            </div>
          </div>
        </section>

        {/* Loop */}
        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            How LIZA OS works for research
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
              <span>Each project leaves the next researcher smarter</span>
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
            One research group. One field. 30 days.
          </p>
          <p className="mt-3 text-sm sm:text-lg text-muted-foreground leading-snug max-w-2xl">
            We pick one PhD cohort or one research group, ingest their corpus,
            and deliver a live map of the field with measurable hours returned
            to the researchers. You see the difference between a literature
            review and an understood field — in weeks, not months.
          </p>
        </section>

        {/* Two-door ask */}
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
                Option A · Customer
              </p>
              <p className="font-bold text-lg sm:text-xl">Run a 30-day pilot</p>
              <p className="mt-2 text-sm sm:text-base opacity-80 leading-snug">
                One department, one research group, one field. Fixed scope,
                fixed price. Measured in hours of deep work returned to your
                researchers and a usable map of the field.
              </p>
            </div>
            <div
              className="rounded-2xl p-6 sm:p-8 text-white"
              style={{ background: `hsl(${TEAL})` }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-white/70">
                Option B · Sponsor
              </p>
              <p className="font-bold text-lg sm:text-xl">Co-define the standard</p>
              <p className="mt-2 text-sm sm:text-base text-white/85 leading-snug">
                Build the academic version of LIZA OS with us. Anchor it for
                your university and faculty, take a strategic position, and
                set the global reference for AI-augmented research.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-14 sm:mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border p-6 sm:p-8">
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: `hsl(${TEAL})` }}>
              The full concept
            </p>
            <p className="font-black text-lg sm:text-2xl tracking-tight">
              See the 15-slide Research Concept Deck
            </p>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              Personas, the landscape of existing tools, the four-layer architecture, how the group's memory forms across cohorts, the semester pilot, and the two-door ask — in one walkthrough.
            </p>
          </div>
          <Link
            to="/research-deck"
            className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition-all hover:opacity-90 shrink-0"
            style={{ background: `hsl(${TEAL})` }}
          >
            <span>Open the deck</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <footer className="mt-12 pt-6 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-bold text-foreground">LIZA OS · Research, understood.</span>
          <span>lizaos.ai/research-brief</span>
        </footer>
      </main>
    </div>
  );
}