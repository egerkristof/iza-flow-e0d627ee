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
    why: [
      "No org-wide infrastructure to harness AI's semantic power with rule-prompts and guardrail-prompts that are deterministic where they must be and flexible where they can be.",
      "Every team rebuilds rules, prompts and guardrails from scratch. Nothing was governed by design, so Legal, Risk and IT block at the production gate.",
    ],
  },
  {
    icon: Receipt,
    persona: "Spend",
    stat: "40%",
    statLabel: "of AI spend is burned on rework, hallucination, and shadow tooling.",
    line: "Token bills 4x. No one on your team can map a single euro to a named business outcome.",
    source: "Workday, AI at Work 2025",
    severity: "destructive-mid" as const,
    why: [
      "No org-wide standard means the same task is re-prompted ten ways across ten teams, with no versioned playbook to anchor model choice, data scope or guardrails.",
      "Shadow tools multiply seats and burn tokens. Outputs get redone because no one trusts the last run, and no euro can be traced to a named outcome.",
    ],
  },
  {
    icon: FileWarning,
    persona: "Control",
    stat: "0",
    statLabel: "replayable outputs. No lineage, no owner, no audit trail.",
    line: "Outputs ship without context. One audit, one client question, and it lands on you personally.",
    source: "LIZA OS intake, 2025",
    severity: "destructive" as const,
    why: [
      "Prompt, model, data, guardrails and output live in four disconnected places. No infrastructure ties them into a single signed, replayable run.",
      "No version, no owner, no lineage. Audit, Legal or a client question cannot reconstruct what shipped, on which playbook version, or who approved it.",
    ],
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
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The headline stats are symptoms. The real cause sits one layer deeper: no org-wide infrastructure for how AI is prompted, governed and signed off.
          </p>
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
                <div
                  className="mt-4 pt-4 rounded-xl px-3 py-3 border"
                  style={{ background: s.soft, borderColor: s.bar }}
                >
                  <p
                    className="text-[10px] font-black tracking-[0.22em] uppercase mb-2.5"
                    style={{ color: s.text }}
                  >
                    Why it actually happens
                  </p>
                  <ul className="space-y-2.5">
                    {b.why.map((w) => (
                      <li
                        key={w}
                        className="flex items-start gap-2.5 text-[13px] md:text-[13.5px] text-foreground leading-snug font-medium"
                      >
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: s.text }}
                        />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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