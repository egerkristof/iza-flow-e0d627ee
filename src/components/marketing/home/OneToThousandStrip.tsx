import { motion } from "framer-motion";
import { MessageSquare, ArrowRight } from "lucide-react";
import { SectionTag, GradientText } from "./shared";

/**
 * "One chat → One thousand chats"
 *
 * Core insight: one chat is easy. The problem starts at chat 1,000.
 * Context engineering and fine-tuning hit a ceiling. A standards layer
 * — every prompt through the same guardrails — is what scales.
 */

const GUARDRAILS = ["Strategy", "KPIs", "Tokens", "Data", "Policy"];

export function OneToThousandStrip() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <SectionTag label="The real problem" />
          <h2 className="text-3xl md:text-5xl font-black leading-[1.05] tracking-tight max-w-3xl mx-auto">
            One chat is easy.{" "}
            <GradientText>One thousand is the business.</GradientText>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Context engineering hits a ceiling. Fine-tuning hits a ceiling.
            Every AI conversation in your company has to pass through the same
            guardrails — and teach the system back. That layer is what scales.
          </p>
        </div>

        {/* Visual: one bubble → guardrail line → many bubbles */}
        <div className="relative rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm p-8 md:p-12">
          <div className="grid md:grid-cols-[1fr_auto_1.5fr] gap-8 md:gap-10 items-center">
            {/* LEFT — one chat */}
            <div className="flex flex-col items-center text-center">
              <p className="text-[10px] font-black tracking-[0.22em] uppercase text-muted-foreground mb-4">
                One chat
              </p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center border"
                style={{
                  background: "hsl(var(--primary) / 0.08)",
                  borderColor: "hsl(var(--primary) / 0.3)",
                  color: "hsl(var(--primary))",
                }}
              >
                <MessageSquare className="w-7 h-7" />
              </motion.div>
              <p className="mt-4 text-sm font-semibold text-foreground">Easy.</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-[180px]">
                Anyone can prompt a model and get something useful.
              </p>
            </div>

            {/* MIDDLE — arrow */}
            <div className="hidden md:flex flex-col items-center text-muted-foreground/50">
              <ArrowRight className="w-8 h-8" />
            </div>

            {/* RIGHT — one thousand chats through the guardrail layer */}
            <div className="flex flex-col items-center text-center">
              <p className="text-[10px] font-black tracking-[0.22em] uppercase text-muted-foreground mb-4">
                One thousand chats
              </p>

              {/* Grid of bubbles */}
              <div className="grid grid-cols-10 gap-1.5 mb-5">
                {Array.from({ length: 40 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.012 }}
                    className="w-3.5 h-3.5 rounded-md"
                    style={{
                      background: "hsl(var(--primary) / 0.18)",
                      border: "1px solid hsl(var(--primary) / 0.3)",
                    }}
                  />
                ))}
              </div>

              {/* Guardrail layer */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0.6 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full relative my-3"
              >
                <div
                  className="h-[3px] w-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, hsl(var(--brand-green)), transparent)",
                    boxShadow: "0 0 24px hsl(var(--brand-green) / 0.5)",
                  }}
                />
                <p
                  className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3 py-0.5 text-[9px] font-black tracking-[0.22em] uppercase rounded-full border"
                  style={{
                    background: "hsl(var(--background))",
                    borderColor: "hsl(var(--brand-green) / 0.4)",
                    color: "hsl(var(--brand-green))",
                  }}
                >
                  The standards layer
                </p>
              </motion.div>

              {/* Guardrails */}
              <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                {GUARDRAILS.map((g, i) => (
                  <motion.span
                    key={g}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                    className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border"
                    style={{
                      borderColor: "hsl(var(--brand-green) / 0.3)",
                      background: "hsl(var(--brand-green) / 0.06)",
                      color: "hsl(var(--brand-green))",
                    }}
                  >
                    {g}
                  </motion.span>
                ))}
              </div>

              <p className="mt-5 text-sm font-semibold text-foreground">
                Every prompt. Every output. Every action.
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-[280px]">
                Tied to a standard. Traced to a source. Teaching the system back.
              </p>
            </div>
          </div>
        </div>

        {/* Closing line */}
        <div className="mt-10 text-center max-w-2xl mx-auto">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Context engineering and fine-tuning don't scale.{" "}
            <span className="text-foreground font-semibold">
              A standards layer does.
            </span>{" "}
            That is LIZA.{" "}
            <a
              href="/platform"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              See the layer <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}