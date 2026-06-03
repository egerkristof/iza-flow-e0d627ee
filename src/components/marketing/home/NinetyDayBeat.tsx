import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SectionTag, GradientText } from "./shared";

const SHIFTS = [
  {
    before: "Adoption is flat. Heavy users 15%.",
    after: "Governed AI is in production across teams that use it daily.",
  },
  {
    before: "Token bills no one can defend.",
    after: "Every euro of spend tied to a named outcome.",
  },
  {
    before: "Outputs ship without lineage.",
    after: "Every output replayable for Legal, audit, or the board.",
  },
];

export function NinetyDayBeat() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="90 days in" icon={<Sparkles className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tight">
            What your rollout looks like{" "}
            <GradientText>90 days in.</GradientText>
          </h2>
          <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto">
            Not a pilot. Not a slide. The rollout you were hired to deliver,
            finally compounding instead of drifting.
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
              className="grid md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-5 items-center rounded-2xl border border-border bg-background p-5 md:p-6"
            >
              <p className="text-sm text-muted-foreground line-through decoration-muted-foreground/40">
                {s.before}
              </p>
              <div
                className="hidden md:flex w-8 h-8 rounded-full items-center justify-center mx-auto text-xs font-black"
                style={{
                  background: "hsl(var(--brand-green) / 0.1)",
                  color: "hsl(var(--brand-green))",
                }}
              >
                →
              </div>
              <p
                className="text-sm md:text-base font-semibold leading-snug"
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