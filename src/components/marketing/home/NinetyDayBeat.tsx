import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionTag, GradientText } from "./shared";

const SHIFTS = [
  {
    before: "Adoption flat. Heavy users 15%.",
    after: "Governed AI in daily production across the teams that use it most.",
  },
  {
    before: "Token bills no one can defend.",
    after: "Every euro of spend tied to a named outcome on a P&L line.",
  },
  {
    before: "Outputs ship without lineage.",
    after: "Every output replayable for Legal, for audit, for the board.",
  },
];

export function NinetyDayBeat() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="90 days in" />
          <h2 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tight">
            What your rollout looks like{" "}
            <GradientText>when it works.</GradientText>
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            Not a pilot. Not a slide deck. The rollout you were hired to deliver.
            In production. With numbers to defend it.
          </p>
        </div>

        <div className="space-y-3">
          {SHIFTS.map((s, i) => (
            <motion.div
              key={s.after}
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
              <p className="text-sm text-muted-foreground/70 line-through decoration-muted-foreground/40">
                {s.before}
              </p>
              <div
                className="hidden md:flex w-8 h-8 rounded-full items-center justify-center mx-auto"
                style={{
                  background: "hsl(var(--brand-green) / 0.12)",
                  color: "hsl(var(--brand-green))",
                }}
              >
                <ArrowRight className="w-4 h-4" />
              </div>
              <p
                className="text-sm md:text-base font-bold leading-snug"
                style={{ color: "hsl(var(--foreground))" }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-2 align-middle"
                  style={{ background: "hsl(var(--brand-green))" }}
                />
                {s.after}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}