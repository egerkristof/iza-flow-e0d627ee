import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionTag, GradientText, CAL_URL } from "./shared";

/**
 * Merged Stakes + Transformation section.
 * Single argument: today (ungoverned) → day 90 (signed off).
 * Replaces AccountableAIStrip and NinetyDayBeat.
 */

const SHIFTS = [
  {
    today: "Token spend you cannot explain to finance.",
    day90: "Every euro tied to a named outcome on a P&L line.",
    metric: "Cost per outcome",
  },
  {
    today: "Outputs shipped without lineage or owner.",
    day90: "Every output replayable for Legal, audit, the board.",
    metric: "% replayable",
  },
  {
    today: "Adoption flat. Heavy users stuck at 15%.",
    day90: "Governed AI in daily production across the teams that matter.",
    metric: "Policy drift rate",
  },
];

export function StakesAndTransform() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Two ways this ends" />
          <h2 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tight">
            Unaudited AI today. Or{" "}
            <GradientText>AI your board can read in 90 days.</GradientText>
          </h2>
        </div>

        <div className="space-y-3 mb-10">
          {SHIFTS.map((s, i) => (
            <motion.div
              key={s.metric}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative grid md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-5 items-center rounded-2xl border border-border bg-card p-5 md:p-6 pl-6 overflow-hidden"
            >
              <motion.span
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ background: "hsl(var(--brand-green))", transformOrigin: "top" }}
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
              />
              <div>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground/70 mb-1">
                  Today
                </p>
                <p className="text-sm text-muted-foreground/80 line-through decoration-muted-foreground/40 leading-snug">
                  {s.today}
                </p>
              </div>
              <div
                className="hidden md:flex w-8 h-8 rounded-full items-center justify-center mx-auto"
                style={{
                  background: "hsl(var(--brand-green) / 0.12)",
                  color: "hsl(var(--brand-green))",
                }}
              >
                <ArrowRight className="w-4 h-4" />
              </div>
              <div>
                <p
                  className="text-[10px] font-black tracking-[0.2em] uppercase mb-1"
                  style={{ color: "hsl(var(--brand-green))" }}
                >
                  Day 90 . {s.metric}
                </p>
                <p
                  className="text-sm md:text-base font-bold leading-snug text-foreground"
                >
                  {s.day90}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Book a call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <p className="mt-3 text-xs text-muted-foreground">
            Defensible to your CFO, your board, your regulator.
          </p>
        </div>
      </div>
    </section>
  );
}
