import { motion } from "framer-motion";
import { Briefcase, Headphones, FlaskConical } from "lucide-react";

const BRUISES = [
  {
    icon: Briefcase,
    persona: "Sales Lead",
    line: "Every rep writes their own pitch with AI. Half of them off-message by Wednesday.",
  },
  {
    icon: Headphones,
    persona: "Consulting Partner",
    line: "Your senior playbook lives in five people's heads. New hires take six months to ramp.",
  },
  {
    icon: FlaskConical,
    persona: "Function Owner",
    line: "Your team uses AI like a Ouija board. Output looks confident, drifts from policy.",
  },
];

export function ThreeBruisesStrip() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <p
          className="text-[11px] font-black tracking-[0.25em] uppercase mb-8 text-center"
          style={{ color: "hsl(var(--primary))" }}
        >
          One enemy. Different bruise depending on the function you run.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BRUISES.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.persona}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
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