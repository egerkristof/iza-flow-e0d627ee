import { motion } from "framer-motion";
import { Settings, Workflow, TrendingUp, ArrowRight } from "lucide-react";
import { SectionTag, GradientText, CAL_URL } from "./shared";

const STEPS = [
  {
    n: "01",
    icon: Settings,
    title: "Set up your controls",
    body: "We co-build your first set of standards, token policies, and approved outputs inside LIZA. Light or comprehensive. Days, not months.",
    tag: "Co-built with you",
  },
  {
    n: "02",
    icon: Workflow,
    title: "Run your first workflows",
    body: "Put real work through it. Start with one team. Expand to multiple teams. Then cross-functional workflows. Every token tied back to a standard you own.",
    tag: "One team → many → cross-functional",
  },
  {
    n: "03",
    icon: TrendingUp,
    title: "Expand and prove it",
    body: "Roll across the org. The metrics that matter to the CFO and the board surface automatically.",
    tag: "Org rollout, with the numbers to defend it",
  },
];

const METRICS = [
  { from: "8%", to: "60%+", label: "workflows with governed AI in production" },
  { from: "18 mo", to: "30 days", label: "from licence purchase to measurable ROI" },
  { from: "0", to: "100%", label: "of outputs replayable for Legal and audit" },
  { from: "Baseline", to: "62% faster", label: "time-to-spec on workflows that moved first" },
];

export function GetStartedPlan() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="The plan" />
          <h2 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tight">
            Get started with LIZA in{" "}
            <GradientText>three steps.</GradientText>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            We build the first version of your rollout with you. You take it
            from there.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="rounded-2xl border border-border bg-card p-7 relative overflow-hidden hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{
                      background: "hsl(var(--primary) / 0.1)",
                      color: "hsl(var(--primary))",
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-black text-muted-foreground/20 leading-none">
                    {s.n}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {s.body}
                </p>
                <p className="text-[10px] font-black tracking-[0.18em] uppercase text-primary">
                  {s.tag}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Metrics surfaced by step 3 */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border p-7 md:p-8"
          style={{
            borderColor: "hsl(var(--brand-green) / 0.3)",
            background: "hsl(var(--brand-green) / 0.04)",
          }}
        >
          <p className="text-[10px] font-black tracking-[0.22em] uppercase text-muted-foreground mb-5 text-center">
            What step 3 surfaces, automatically
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {METRICS.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-xs text-muted-foreground/70 line-through mb-1">
                  {m.from}
                </p>
                <p
                  className="text-2xl md:text-3xl font-black mb-1"
                  style={{ color: "hsl(var(--brand-green))" }}
                >
                  {m.to}
                </p>
                <p className="text-[11px] text-foreground/70 leading-snug">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 text-center">
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Book a call to start step 1
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}