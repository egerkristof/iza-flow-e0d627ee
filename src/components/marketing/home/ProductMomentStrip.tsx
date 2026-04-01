import { Upload, Layers, TrendingUp, ArrowRight, CheckCircle2, Zap, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

const MOMENTS = [
  {
    icon: <Upload className="w-5 h-5" />,
    number: "01",
    step: "Upload and capture",
    result:
      "Upload your playbooks, best practices, and decision logic. LIZA converts them into executable knowledge for your human-AI environment, fast and guided.",
    visual: (
      <div className="relative w-full h-28 mb-4 overflow-hidden rounded-xl" style={{ background: "hsl(var(--primary) / 0.04)" }}>
        {/* Animated doc stack */}
        <motion.div
          className="absolute left-4 top-6 w-14 h-[68px] rounded-lg border-2 flex items-center justify-center"
          style={{ borderColor: "hsl(var(--primary) / 0.2)", background: "hsl(var(--background))" }}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="space-y-1.5 px-2 w-full">
            <div className="h-1 rounded-full w-full" style={{ background: "hsl(var(--muted-foreground) / 0.2)" }} />
            <div className="h-1 rounded-full w-3/4" style={{ background: "hsl(var(--muted-foreground) / 0.15)" }} />
            <div className="h-1 rounded-full w-5/6" style={{ background: "hsl(var(--muted-foreground) / 0.2)" }} />
            <div className="h-1 rounded-full w-2/3" style={{ background: "hsl(var(--muted-foreground) / 0.12)" }} />
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          className="absolute left-[82px] top-1/2 -translate-y-1/2"
          style={{ color: "hsl(var(--primary))" }}
          initial={{ opacity: 0, x: -6 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.3 }}
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>

        {/* Structured output */}
        <motion.div
          className="absolute right-4 top-5 w-[120px] space-y-2"
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.55, duration: 0.4 }}
        >
          {["Playbook", "Standard", "Decision"].map((label, i) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold"
              style={{
                background: `hsl(var(--primary) / ${0.08 + i * 0.04})`,
                color: "hsl(var(--primary))",
              }}
            >
              <CheckCircle2 className="w-2.5 h-2.5" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    ),
  },
  {
    icon: <Layers className="w-5 h-5" />,
    number: "02",
    step: "Execute at AI speed, safely",
    result:
      "When anyone works with AI, your standards are already built in. Full speed, full governance. No drift, no risk.",
    visual: (
      <div className="relative w-full h-28 mb-4 overflow-hidden rounded-xl" style={{ background: "hsl(var(--primary) / 0.04)" }}>
        {/* AI session box */}
        <motion.div
          className="absolute left-4 top-4 right-4 bottom-4 rounded-lg border flex flex-col"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b" style={{ borderColor: "hsl(var(--border))" }}>
            <Zap className="w-2.5 h-2.5" style={{ color: "hsl(var(--primary))" }} />
            <span className="text-[9px] font-bold text-muted-foreground">AI SESSION</span>
          </div>
          <div className="flex-1 px-3 py-2 space-y-1.5">
            <motion.div
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45, duration: 0.3 }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--success))" }} />
              <span className="text-[9px] font-medium text-muted-foreground">Standards enforced</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55, duration: 0.3 }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--success))" }} />
              <span className="text-[9px] font-medium text-muted-foreground">Governance active</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1.5"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65, duration: 0.3 }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--success))" }} />
              <span className="text-[9px] font-medium text-muted-foreground">Zero drift</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    number: "03",
    step: "Learn and compound",
    result:
      "Every discovery feeds back into shared standards. Knowledge compounds across the team, permanently.",
    visual: (
      <div className="relative w-full h-28 mb-4 overflow-hidden rounded-xl" style={{ background: "hsl(var(--primary) / 0.04)" }}>
        {/* Feedback loop visual */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="relative">
            {/* Center hub */}
            <motion.div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-5 h-5" />
            </motion.div>

            {/* Orbiting labels */}
            {[
              { label: "Discovery", angle: -30, delay: 0.3 },
              { label: "Feedback", angle: 90, delay: 0.45 },
              { label: "Upgrade", angle: 210, delay: 0.6 },
            ].map((item) => {
              const rad = (item.angle * Math.PI) / 180;
              const x = Math.cos(rad) * 52;
              const y = Math.sin(rad) * 36;
              return (
                <motion.span
                  key={item.label}
                  className="absolute text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
                  style={{
                    left: `calc(50% + ${x}px - 24px)`,
                    top: `calc(50% + ${y}px - 8px)`,
                    background: "hsl(var(--primary) / 0.08)",
                    color: "hsl(var(--primary))",
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: item.delay, duration: 0.3 }}
                >
                  {item.label}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
      </div>
    ),
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

export function ProductMomentStrip() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground mb-12">
          What executable knowledge looks like in practice
        </p>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting line (desktop only) */}
          <div
            className="hidden md:block absolute top-[52px] left-[16.6%] right-[16.6%] h-px z-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.25) 20%, hsl(var(--primary) / 0.25) 80%, transparent 100%)",
            }}
          />

          {MOMENTS.map((m, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={cardVariants}
              className="relative z-10 group rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                borderColor: "hsl(var(--border))",
                background: "hsl(var(--background))",
              }}
            >
              {/* Large gradient number */}
              <span
                className="text-4xl font-black leading-none block mb-3"
                style={{
                  background: "var(--gradient-brand)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  opacity: 0.8,
                }}
              >
                {m.number}
              </span>

              {/* Mini illustration */}
              {m.visual}

              <h3 className="text-base font-black text-foreground mb-2">
                {m.step}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {m.result}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
