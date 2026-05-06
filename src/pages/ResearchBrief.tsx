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
    desc: "Drop in your corpus. The agentic environment reads it through pre-installed research expertise and resolves it into a structured field, not a folder.",
    does: [
      "Clusters the literature into schools of thought",
      "Surfaces lineages of ideas across decades",
      "Flags where authors actually disagree, and on what",
    ],
    Icon: Network,
  },
  {
    step: "Anchor",
    short: "Codify your stance.",
    desc: "Your hypothesis, framework, and assumptions become explicit anchors inside the map. Every claim ties to your position, not a generic average of the internet.",
    does: [
      "Captures hypothesis, framework, assumptions as typed anchors",
      "Locates your stance against the schools and lineages",
      "Records why-not-this on the alternatives you reject",
    ],
    Icon: BookOpen,
  },
  {
    step: "Augment",
    short: "Think further, faster.",
    desc: "You stay the author. The agents reason over the structure of the field and push back from inside the map.",
    does: [
      "Surfaces counter-arguments and trade-offs against your anchors",
      "Names gaps in your reading and lineages you have not placed",
      "Drafts only against your stance, never instead of it",
    ],
    Icon: Sparkles,
  },
  {
    step: "Compound",
    short: "Knowledge accumulates.",
    desc: "Every reading, note, and judgment feeds back into the map. Your thinking becomes a portable asset you own across projects.",
    does: [
      "Writes new claims and rebuttals back as typed primitives",
      "Versions your stance as the field and your thinking move",
      "Exportable, LLM-agnostic, no lock-in",
    ],
    Icon: RefreshCw,
  },
];

const outcomes = [
  {
    tag: "On day one",
    stat: "Day 1",
    statLabel: "vs 6 to 12 months of solo PDF reading",
    headline: "Walk into a structured field",
  },
  {
    tag: "While you work",
    stat: "10x",
    statLabel: "more hours judging and writing, fewer hours searching",
    headline: "Augmented, not replaced",
  },
  {
    tag: "At the end",
    stat: "100%",
    statLabel: "portable, LLM-agnostic, owned by you",
    headline: "A portable asset that is yours",
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
          The research<br className="hidden sm:block" />
          <span> </span>memory layer.<br />
          <span style={{ color: `hsl(${TEAL})` }}>Structured field. Your judgment. AI inside the map.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-6 sm:mt-8 text-lg sm:text-2xl text-muted-foreground leading-snug max-w-2xl"
        >
          For the individual researcher. Obsidian and Roam set the bar for personal knowledge graphs. LIZA OS is the next step: a pre-installed agentic environment with research expertise, reasoning inside your map.
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
          LIZA OS is the Research Memory Layer. It maps the relations between ideas, schools, and authors, then augments the researcher's own thinking inside that map.
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
            Map. Anchor. Augment. Compound.
          </p>
          <div
            className="rounded-2xl border-2 px-5 sm:px-6 py-4 mb-6 flex items-start sm:items-center gap-4"
            style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.06)` }}
          >
            <p className="font-black text-[10px] sm:text-[11px] tracking-widest uppercase shrink-0" style={{ color: `hsl(${TEAL})` }}>
              The engine
            </p>
            <p className="text-sm sm:text-base leading-snug">
              A pre-installed agentic environment with research expertise built in. It manages the knowledge graph of your field and reasons inside it as you work.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loop.map((s, i) => {
              const Icon = s.Icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                  className="rounded-2xl border border-border p-5 sm:p-6 flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="font-black text-base sm:text-lg tracking-tight">{i + 1} · {s.step}</p>
                  </div>
                  <p className="font-bold text-sm" style={{ color: `hsl(${TEAL})` }}>{s.short}</p>
                  <p className="mt-2 text-[13px] text-muted-foreground leading-snug">{s.desc}</p>
                  <ul className="mt-4 pt-3 border-t border-border space-y-2">
                    {s.does.map(d => (
                      <li key={d} className="flex gap-2 text-[12px] text-foreground leading-snug">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: `hsl(${TEAL})` }} />
                        <span className="font-semibold">{d}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Outcomes */}
        <section className="mt-14 sm:mt-20">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-5">
            What changes for the researcher
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {outcomes.map((o, i) => (
              <motion.div
                key={o.tag}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
                className="rounded-2xl border-2 p-6 sm:p-7 flex flex-col"
                style={{
                  borderColor: i === 2 ? `hsl(${TEAL} / 0.5)` : "hsl(var(--border))",
                  background: i === 2 ? `hsl(${TEAL} / 0.05)` : "transparent",
                }}
              >
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: `hsl(${TEAL})` }}>
                  {o.tag}
                </p>
                <p
                  className="mt-3 font-black leading-none tracking-tight text-5xl sm:text-6xl"
                  style={{ color: `hsl(${TEAL})` }}
                >
                  {o.stat}
                </p>
                <p className="mt-2 text-[13px] font-bold text-muted-foreground leading-snug">{o.statLabel}</p>
                <div className="mt-4 mb-3 h-px bg-border" />
                <p className="font-black text-lg sm:text-xl tracking-tight">{o.headline}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-14 sm:mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border p-6 sm:p-8">
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: `hsl(${TEAL})` }}>
              The full concept
            </p>
            <p className="font-black text-lg sm:text-2xl tracking-tight">
              See the Research Concept Deck
            </p>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              The four moments in a PhD, the head-to-head against Obsidian, Roam, Elicit, Notion and the rest, the four-layer architecture, and what changes for the researcher on day one.
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