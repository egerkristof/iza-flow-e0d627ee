import { motion, AnimatePresence } from "framer-motion";
import { Activity, Receipt, FileWarning, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { SectionTag } from "./shared";

const BRUISES = [
  {
    icon: Activity,
    persona: "Production",
    stat: "95%",
    statLabel: "of GenAI pilots never reach production.",
    rootCause: "No org-wide infrastructure.",
    source: "MIT / BCG, 2024",
    severity: "warning" as const,
    detail:
      "Every team rebuilds rules, prompts and guardrails from scratch. Nothing is governed by design, so Legal, Risk and IT block at the production gate.",
  },
  {
    icon: Receipt,
    persona: "Spend",
    stat: "40%",
    statLabel: "of AI spend burned on rework and shadow tooling.",
    rootCause: "No shared standard.",
    source: "Workday, AI at Work 2025",
    severity: "destructive-mid" as const,
    detail:
      "The same task is re-prompted ten ways across ten teams. No versioned playbook anchors model, data or guardrails. No euro traces back to a named outcome.",
  },
  {
    icon: FileWarning,
    persona: "Control",
    stat: "0",
    statLabel: "outputs you can defend to Legal, Finance, or a regulator.",
    rootCause: "No compliance boundary at prompt time.",
    source: "LIZA OS intake, 2025",
    severity: "destructive" as const,
    detail:
      "No enforcement of your own rules at the moment AI runs. Regulatory (SOC 2, ISO, EU AI Act, GDPR), financial (token ROI, budget caps), and operational (brand, best practice, data scope) all sit outside the loop. Audit cannot reconstruct what shipped, on which playbook version, or who approved it.",
  },
];

const SEVERITY = {
  warning: { bar: "hsl(var(--warning) / 0.85)", soft: "hsl(var(--warning) / 0.12)", text: "hsl(var(--warning))" },
  "destructive-mid": { bar: "hsl(var(--destructive) / 0.7)", soft: "hsl(var(--destructive) / 0.1)", text: "hsl(var(--destructive))" },
  destructive: { bar: "hsl(var(--destructive))", soft: "hsl(var(--destructive) / 0.14)", text: "hsl(var(--destructive))" },
} as const;

export function ThreeBruisesStrip() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Where the rollout breaks" />
          <h2 className="text-2xl md:text-3xl font-black leading-[1.15] tracking-tight">
            Three numbers your board is already asking about.
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            The stats are symptoms. Tap a card for the root cause.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BRUISES.map((b, i) => {
            const Icon = b.icon;
            const s = SEVERITY[b.severity];
            const isOpen = open === i;
            return (
              <motion.button
                key={b.persona}
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group relative rounded-2xl border border-border bg-background p-6 pl-7 overflow-hidden text-left hover:border-primary/40 hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <motion.span
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                  style={{ background: s.bar, transformOrigin: "top" }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: "easeOut" }}
                />
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
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
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center border text-muted-foreground group-hover:text-foreground group-hover:border-foreground/40 transition-colors"
                    style={{ borderColor: "hsl(var(--border))" }}
                    aria-hidden
                  >
                    {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </span>
                </div>
                <div
                  className="text-6xl md:text-7xl font-black leading-none mb-3 tabular-nums"
                  style={{ color: s.text }}
                >
                  {b.stat}
                </div>
                <p className="text-sm font-semibold text-foreground/90 leading-snug">
                  {b.statLabel}
                </p>
                <p
                  className="mt-4 text-[11px] font-black uppercase tracking-[0.18em]"
                  style={{ color: s.text }}
                >
                  Root cause . {b.rootCause}
                </p>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="detail"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-4 pt-4 border-t"
                        style={{ borderColor: "hsl(var(--border))" }}
                      >
                        <p className="text-[13px] text-foreground/85 leading-relaxed font-medium">
                          {b.detail}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="text-[10px] mt-4 text-muted-foreground/60 uppercase tracking-wider">
                  {b.source}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}