import { motion } from "framer-motion";

const STATS = [
  { value: "85%", label: "AI adoption, 0% governed" },
  { value: "40%", label: "AI output reworked" },
  { value: "0", label: "platforms govern expert knowledge" },
  { value: "100%", label: "knowledge portability" },
];

export function TrustStrip() {
  return (
    <section className="py-10 md:py-14 px-6 border-y" style={{ borderColor: "hsl(var(--border))" }}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
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
            <p className="text-[11px] md:text-xs font-semibold tracking-[0.04em] uppercase text-muted-foreground leading-snug">
              {s.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}