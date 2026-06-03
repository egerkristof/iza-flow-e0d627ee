import { motion } from "framer-motion";

/**
 * Tension strip, not vanity strip. Three sourced numbers that name the
 * questions the AI rollout owner is being asked this quarter.
 */
const STATS = [
  {
    value: "85%",
    label: "of enterprises deployed AI. Under 15% of seats are active weekly.",
    source: "McKinsey, State of AI 2025",
  },
  {
    value: "40%",
    label: "of AI productivity gains lost to rework, hallucination review, version conflict.",
    source: "Workday, AI at Work 2025",
  },
  {
    value: "0",
    label: "outputs most rollout owners can replay for Legal, audit, or the CFO.",
    source: "LIZA OS intake, 2025",
  },
];

export function TrustStrip() {
  return (
    <section
      className="py-12 md:py-16 px-6 border-y"
      style={{ borderColor: "hsl(var(--border))" }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="text-center"
          >
            <div className="text-4xl md:text-5xl font-black text-primary leading-none mb-3">
              {s.value}
            </div>
            <p className="text-[13px] md:text-sm font-semibold text-foreground leading-snug max-w-[260px] mx-auto">
              {s.label}
            </p>
            <p className="text-[11px] mt-2 text-muted-foreground/80">
              {s.source}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}