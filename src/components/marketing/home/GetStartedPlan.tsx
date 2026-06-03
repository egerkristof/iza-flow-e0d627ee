import { motion } from "framer-motion";
import { Settings, Workflow, TrendingUp, ArrowRight } from "lucide-react";
import { SectionTag, GradientText, CAL_URL } from "./shared";

const STEPS = [
  {
    n: "01",
    icon: Settings,
    title: "Wire your first standard",
    body: "We sit with your practitioners and encode five real decisions into LIZA. Not policy documents. Executable rules every AI tool you already pay for must follow.",
    tag: "Days 0–14 · co-built",
  },
  {
    n: "02",
    icon: Workflow,
    title: "Run one team on it",
    body: "Put real work through it. Every output signed. Every decision traceable. Legal sees the receipts. Finance sees cost per outcome.",
    tag: "Days 15–45 · one team live",
  },
  {
    n: "03",
    icon: TrendingUp,
    title: "Measure it. Then scale.",
    body: "The numbers your CFO and board are asking for surface automatically. You pick workflow two, team two, function two. The library compounds.",
    tag: "Days 46–90 · org rollout",
  },
];

const METRICS = [
  { from: "8%", to: "60%+", label: "AI workflows in governed production" },
  { from: "18 months", to: "30 days", label: "licence purchase to first measurable ROI" },
  { from: "0", to: "100%", label: "of outputs replayable for Legal or audit" },
  { from: "Scattered pilots", to: "One standard", label: "enforced across every AI surface" },
];

export function GetStartedPlan() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="How it works" />
          <h2 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tight">
            Three steps. We build the{" "}
            <GradientText>first one with you.</GradientText>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            One workflow. One team. A standard in production within fourteen days.
            Then you scale.
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
            What 90 days delivers
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
            Book a call to start
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}