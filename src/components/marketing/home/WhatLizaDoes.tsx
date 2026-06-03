import { motion } from "framer-motion";
import { FileCheck2, Network, Tag, BarChart3 } from "lucide-react";
import { SectionTag } from "./shared";

/**
 * Plain-language "what the product actually does" section.
 * Four concrete capabilities, ordered as the flow inside the product:
 * Define -> Route -> Tag -> Prove.
 */
const CAPABILITIES = [
  {
    icon: FileCheck2,
    step: "01 / Define",
    title: "Capture your standards",
    body: "Turn the rules, playbooks, and approved outputs your business already lives by into machine-readable standards LIZA can enforce.",
    artifact: "SOPs · Playbooks · Approved templates",
  },
  {
    icon: Network,
    step: "02 / Route",
    title: "Wrap every AI tool you use",
    body: "ChatGPT, Copilot, Claude, internal LLMs, agents. Every prompt is routed through your standards before it ever reaches the model.",
    artifact: "ChatGPT · Copilot · Claude · Internal LLMs",
  },
  {
    icon: Tag,
    step: "03 / Tag",
    title: "Tie every token to a standard",
    body: "Each output carries lineage: which prompt, which model, which standard, which version. Audit-ready by default, not after the fact.",
    artifact: "Prompt → Model → Standard → Output",
  },
  {
    icon: BarChart3,
    step: "04 / Prove",
    title: "Surface the numbers leadership asks for",
    body: "Token spend per outcome. Adoption per team. Standard adherence. Time-to-defensible-work. The dashboard you need before the next board review.",
    artifact: "Spend · Adoption · Adherence · ROI",
  },
];

export function WhatLizaDoes() {
  return (
    <section className="py-20 md:py-28 px-6 bg-card/30 border-y border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <SectionTag label="What LIZA does" />
          <h2 className="text-2xl md:text-4xl font-black leading-[1.1] tracking-tight mb-4">
            One control layer that sits between your teams and every AI tool they use.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Not another chat window. Not another wiki. The layer that
            turns scattered AI usage into governed, measurable output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CAPABILITIES.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative rounded-2xl border border-border bg-background p-7 md:p-8 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: "hsl(var(--primary) / 0.08)",
                      border: "1px solid hsl(var(--primary) / 0.2)",
                    }}
                  >
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-[0.22em] uppercase text-primary mb-1">
                      {c.step}
                    </p>
                    <h3 className="text-lg md:text-xl font-bold leading-tight">
                      {c.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm md:text-[15px] text-foreground/75 leading-relaxed mb-5">
                  {c.body}
                </p>
                <div
                  className="text-[11px] font-mono tracking-tight px-3 py-2 rounded-md inline-block"
                  style={{
                    background: "hsl(var(--muted) / 0.5)",
                    color: "hsl(var(--muted-foreground))",
                    border: "1px dashed hsl(var(--border))",
                  }}
                >
                  {c.artifact}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom anchor: one-line definition */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-sm md:text-base text-muted-foreground">
            <span className="text-foreground font-semibold">In one line:</span>{" "}
            LIZA is the standards layer that makes every AI output in your org
            traceable, defensible, and measurable.
          </p>
        </motion.div>
      </div>
    </section>
  );
}