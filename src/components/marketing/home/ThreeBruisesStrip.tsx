import { motion } from "framer-motion";
import { Activity, Receipt, FileWarning } from "lucide-react";
import { SectionTag } from "./shared";

const BRUISES = [
  {
    icon: Activity,
    persona: "Production",
    stat: "95%",
    statLabel: "of GenAI pilots never reach production. POCs stall 6–12 months.",
    line: "Your pilots have become a graveyard. The board wants shipped outcomes, not another sandbox demo.",
    source: "MIT / BCG, 2024",
    severity: "warning" as const,
  },
  {
    icon: Receipt,
    persona: "Spend",
    stat: "40%",
    statLabel: "of AI spend is burned on rework, hallucination, and shadow tooling.",
    line: "Token bills 4x. No one on your team can map a single euro to a named business outcome.",
    source: "Workday, AI at Work 2025",
    severity: "destructive-mid" as const,
  },
  {
    icon: FileWarning,
    persona: "Control",
    stat: "0",
    statLabel: "replayable outputs. No lineage, no owner, no audit trail.",
    line: "Outputs ship without context. One audit, one client question, and it lands on you personally.",
    source: "LIZA OS intake, 2025",
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
          <SectionTag label="Where the rollout breaks" />
          <h2 className="text-2xl md:text-3xl font-black leading-[1.15] tracking-tight">
            Three numbers your board is already asking about.
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
                <div
                  className="text-5xl md:text-6xl font-black leading-none mb-2"
                  style={{ color: s.text }}
                >
                  {b.stat}
                </div>
                <p className="text-[13px] font-semibold text-foreground/90 leading-snug mb-3">
                  {b.statLabel}
                </p>
                <p className="text-[13px] text-muted-foreground leading-snug border-t border-border/60 pt-3">
                  {b.line}
                </p>
                <p className="text-[10px] mt-3 text-muted-foreground/70 uppercase tracking-wider">
                  {b.source}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}