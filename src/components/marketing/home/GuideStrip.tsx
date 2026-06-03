import { motion } from "framer-motion";
import { SectionTag } from "./shared";

const PROOFS = [
  { k: "Design partners", v: "Live in consulting, pharma, AEC, and B2B scale-ups" },
  { k: "15+ years", v: "AI systems shipped inside regulated and high-stakes environments" },
  { k: "Standards-aligned", v: "Controls map to SOC 2, ISO 27001, EU AI Act, GDPR, and your internal policy" },
];

export function GuideStrip() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <SectionTag label="Why LIZA" />
          <h2 className="text-2xl md:text-3xl font-black leading-[1.15] tracking-tight">
            Built by people who have run this rollout. We know where it stalls.
          </h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border rounded-2xl divide-y md:divide-y-0 md:divide-x divide-border bg-card/40"
        >
          {PROOFS.map((p, i) => (
            <motion.div
              key={p.k}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.08 }}
              className="px-6 py-6"
            >
              <p className="text-[11px] font-black tracking-[0.2em] uppercase text-primary mb-2">
                {p.k}
              </p>
              <p className="text-sm text-foreground/80 leading-snug">{p.v}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}