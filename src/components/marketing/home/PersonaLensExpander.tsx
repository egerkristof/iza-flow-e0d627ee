import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Banknote, Building2, Server } from "lucide-react";

type Persona = {
  id: string;
  label: string;
  icon: typeof Cpu;
  lines: string[];
  metric: { value: string; label: string };
  quote: { text: string; attribution: string };
};

const PERSONAS: Persona[] = [
  {
    id: "business-lead",
    label: "Business Lead",
    icon: Building2,
    lines: [
      "Your team uses AI like a Ouija board. Confident output, drifts from policy.",
      "New hires take months to ramp because the standard lives in people's heads.",
      "LIZA encodes how your function actually decides, so AI executes to it on day one.",
    ],
    metric: { value: "Days, not months", label: "to ramp on your standard" },
    quote: {
      text: "Our playbook stopped being a PDF nobody reads. It's now what AI runs on.",
      attribution: "Head of Operations, regulated manufacturer",
    },
  },
  {
    id: "head-of-ai",
    label: "Head of AI",
    icon: Cpu,
    lines: [
      "You shipped Copilot, Claude, and a vendor RAG. None of them know your policy.",
      "Every team forks its own prompts. You can't audit what got generated, or why.",
      "LIZA gives you one executable standard every tool reads before it answers.",
    ],
    metric: { value: "1 standard", label: "across every AI surface" },
    quote: {
      text: "We finally have a single source of truth our AI tools actually obey.",
      attribution: "VP AI, B2B SaaS scaleup",
    },
  },
  {
    id: "cfo",
    label: "CFO",
    icon: Banknote,
    lines: [
      "AI is shifting from flat seats to metered tokens. Your run-rate is now consumption.",
      "Without a standard, every token is unanchored spend with no defensible ROI.",
      "LIZA ties every token to a policy, workflow, or outcome you can put on a P&L line.",
    ],
    metric: { value: "ROI / token", label: "instead of cost / seat" },
    quote: {
      text: "We stopped buying AI tools and started owning AI unit economics.",
      attribution: "CFO, mid-market enterprise",
    },
  },
  {
    id: "infra",
    label: "Infra & Platform",
    icon: Server,
    lines: [
      "You sit on top of LLMs that change weekly. Your governance can't.",
      "Vendor lock-in is the new technical debt. Standards must outlive any model.",
      "LIZA is the model-agnostic governance layer your platform team owns, not a vendor.",
    ],
    metric: { value: "Zero lock-in", label: "swap models, keep the standard" },
    quote: {
      text: "It's the only piece of our AI stack we'd refuse to rip out.",
      attribution: "Platform Lead, enterprise IT",
    },
  },
];

export function PersonaLensExpander() {
  const [active, setActive] = useState<string>(PERSONAS[0].id);
  const persona = PERSONAS.find((p) => p.id === active)!;
  const Icon = persona.icon;

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p
            className="text-[11px] font-black tracking-[0.25em] uppercase mb-3"
            style={{ color: "hsl(var(--primary))" }}
          >
            See it through your lens
          </p>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">
            Who else cares once you bring this in.
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {PERSONAS.map((p) => {
            const isActive = p.id === active;
            const PIcon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <PIcon className="w-4 h-4" />
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={persona.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-border bg-card p-7 md:p-9"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {persona.label}
              </span>
            </div>

            <ul className="space-y-3 mb-7">
              {persona.lines.map((line, i) => (
                <li key={i} className="flex gap-3 text-base text-foreground leading-relaxed">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="grid md:grid-cols-2 gap-4 pt-5 border-t border-border">
              <div>
                <div className="text-2xl font-black text-primary mb-1">
                  {persona.metric.value}
                </div>
                <div className="text-xs text-muted-foreground">{persona.metric.label}</div>
              </div>
              <blockquote className="text-sm italic text-muted-foreground border-l-2 border-primary/40 pl-4">
                "{persona.quote.text}"
                <footer className="not-italic text-[11px] mt-1.5 font-semibold text-foreground/70">
                  {persona.quote.attribution}
                </footer>
              </blockquote>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}