import { Upload, FileText, Users } from "lucide-react";
import { motion } from "framer-motion";

const MOMENTS = [
  {
    icon: <Upload className="w-5 h-5" />,
    number: "01",
    step: "Upload and capture",
    result:
      "Upload your playbooks, best practices, and decision logic. LIZA converts them into executable knowledge for your human-AI environment, fast and guided.",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    number: "02",
    step: "Execute at AI speed, safely",
    result:
      "When anyone works with AI, your standards are already built in. Full speed, full governance. No drift, no risk.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    number: "03",
    step: "Learn and compound",
    result:
      "Every discovery feeds back into shared standards. Knowledge compounds across the team, permanently.",
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
              className="relative z-10 group rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{
                borderColor: "hsl(var(--border))",
                background: "hsl(var(--background))",
              }}
            >
              {/* Large gradient number */}
              <span
                className="text-5xl font-black leading-none block mb-4"
                style={{
                  background: "var(--gradient-brand)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  opacity: 0.8,
                }}
              >
                {m.number}
              </span>

              {/* Icon pill */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 group-hover:shadow-md"
                style={{
                  background: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                }}
              >
                {m.icon}
              </div>

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
