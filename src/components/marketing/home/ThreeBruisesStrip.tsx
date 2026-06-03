import { motion } from "framer-motion";
import { Activity, Receipt, FileWarning } from "lucide-react";
import { SectionTag } from "./shared";

const BRUISES = [
  {
    icon: Activity,
    persona: "Adoption",
    line: "Licences are paid. Heavy users 15%. The rest are back on Google. The rollout is flat.",
    severity: "warning" as const,
  },
  {
    icon: Receipt,
    persona: "Spend",
    line: "Token bills 4x. No one on your team can map a single euro to a named business outcome.",
    severity: "destructive-mid" as const,
  },
  {
    icon: FileWarning,
    persona: "Exposure",
    line: "Outputs ship without lineage. One audit, one client question, and it lands on you personally.",
    severity: "destructive" as const,
  },
];

const SEVERITY = {
  warning: { bar: "hsl(var(--warning) / 0.85)", soft: "hsl(var(--warning) / 0.12)", text: "hsl(var(--warning))" },
  "destructive-mid": { bar: "hsl(var(--destructive) / 0.7)", soft: "hsl(var(--destructive) / 0.1)", text: "hsl(var(--destructive))" },
  destructive: { bar: "hsl(var(--destructive))", soft: "hsl(var(--destructive) / 0.14)", text: "hsl(var(--destructive))" },
} as const;

export function ThreeBruisesStrip() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="The three places it breaks" />
          <h2 className="text-2xl md:text-3xl font-black leading-[1.15] tracking-tight">
            One problem. Three numbers your board is already asking about.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BRUISES.map((b, i) => {
            const Icon = b.icon;
            const s = SEVERITY[b.severity];
            return (
              <motion.div
                key={b.persona}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative rounded-2xl border border-border bg-background p-6 pl-7 overflow-hidden hover:border-primary/40 transition-colors"
              >
                {/* Severity rail (escalates left to right) */}
                <motion.span
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                  style={{ background: s.bar, transformOrigin: "top" }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: "easeOut" }}
                />
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: s.soft, color: s.text }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {b.persona}
                  </span>
                </div>
                <p className="text-base font-semibold text-foreground leading-snug">
                  {b.line}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}