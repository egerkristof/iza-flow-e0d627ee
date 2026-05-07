import { motion } from "framer-motion";

const STATS = [
  { value: "85%", label: "of enterprises adopted AI. Almost none govern what it produces.", source: "McKinsey State of AI, 2025" },
  { value: "40%", label: "of AI productivity gains lost to rework and review.", source: "Workday, 2026" },
  { value: "90%", label: "of operating knowledge stays tacit, in people and threads.", source: "Observed across regulated deployments" },
  { value: "$280B", label: "lost yearly to rework in US construction alone.", source: "FMI / industry analyses" },
];

export function TrustStrip() {
  return (
    <section className="py-10 md:py-14 px-6 border-y" style={{ borderColor: "hsl(var(--border))" }}>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-6">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="text-center"
          >
            <div className="text-3xl md:text-4xl font-black text-primary leading-none mb-2">
              {s.value}
            </div>
            <p className="text-[12px] md:text-[13px] font-semibold text-muted-foreground leading-snug">
              {s.label}
            </p>
            <p className="text-[10px] mt-1.5 text-muted-foreground/70 italic">
              {s.source}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}