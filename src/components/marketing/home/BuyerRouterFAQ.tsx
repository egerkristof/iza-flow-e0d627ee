import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { SectionTag } from "./shared";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* Persona-routed FAQ. Same answers, but the order and emphasis change to
   match the buyer's role. Beats a flat accordion on conversion. */

type Persona = "ai-strategy" | "regulated" | "evaluator";

const PERSONAS: { key: Persona; label: string; sub: string }[] = [
  { key: "ai-strategy", label: "I run AI strategy", sub: "Head of AI / VP Ops / CTO" },
  { key: "regulated", label: "I run a regulated function", sub: "Quality / Risk / Compliance" },
  { key: "evaluator", label: "I'm evaluating tools", sub: "Innovation / Procurement" },
];

const QA: Record<string, { q: string; a: string }> = {
  governance: {
    q: "How is this different from Copilot or ChatGPT for our team?",
    a: "Copilot and ChatGPT generate outputs. LIZA OS governs the standards those tools run on. Your decision logic, mandates, and playbooks are enforced in every session, not left to each person's prompting skills.",
  },
  vs_workflow: {
    q: "How is this different from workflow automation (Zapier, n8n, Make)?",
    a: "Automation platforms execute tasks. LIZA encodes the judgment behind decisions and enforces it on every output. Automation is a subset of what runs on top.",
  },
  sops: {
    q: "We already have SOPs. Why do we need this?",
    a: "Documentation without execution is filing. LIZA makes your SOPs runtime: every standard is enforced inside the work, not stored next to it.",
  },
  replace: {
    q: "Does this replace our existing AI tools?",
    a: "No. LIZA is the governance layer above them. Copilot, Claude, vendor RAG all keep working. They just answer in your standard.",
  },
  rollout: {
    q: "How long until we are operational?",
    a: "Most teams are operational within days. Existing documents are extracted into structured standards automatically.",
  },
  security: {
    q: "Is our knowledge secure? Where does it live?",
    a: "Your standards stay in your environment. We do not train on your data. SOC2-aligned controls.",
  },
  audit: {
    q: "Can we prove which standard produced which output?",
    a: "Yes. Every execution records the bundle, the version, and the mandate. Auditing happens inside execution.",
  },
  central: {
    q: "How do departments adopt this without a central bottleneck?",
    a: "Capabilities are modular. Each department composes the ones it needs. Same governance, independent execution.",
  },
  vendor: {
    q: "What about vendor lock-in on the model?",
    a: "Models are interchangeable. Your standard is the asset. Swap providers without rewriting a single rule.",
  },
};

const ORDER: Record<Persona, string[]> = {
  "ai-strategy":  ["governance", "central", "rollout", "vendor", "vs_workflow", "replace", "sops", "security", "audit"],
  "regulated":    ["audit", "sops", "security", "governance", "rollout", "replace", "vendor", "central", "vs_workflow"],
  "evaluator":    ["replace", "governance", "vs_workflow", "vendor", "rollout", "central", "security", "audit", "sops"],
};

export function BuyerRouterFAQ() {
  const [persona, setPersona] = useState<Persona>("ai-strategy");
  const items = ORDER[persona].map((k) => ({ key: k, ...QA[k] }));
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <SectionTag label="FAQ" icon={<HelpCircle className="w-3 h-3" />} />
          <h2 className="text-2xl md:text-3xl font-black mb-3">Common questions</h2>
          <p className="text-sm text-muted-foreground">Pick what describes you. Same answers, ordered for your role.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
          {PERSONAS.map((p) => {
            const isActive = p.key === persona;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => setPersona(p.key)}
                className="text-left rounded-xl border p-3 transition-all hover:-translate-y-0.5"
                style={{
                  background: isActive ? "hsl(var(--primary) / 0.08)" : "hsl(var(--card))",
                  borderColor: isActive ? "hsl(var(--primary) / 0.55)" : "hsl(var(--border))",
                  boxShadow: isActive ? "0 8px 24px -12px hsl(var(--primary) / 0.5)" : "none",
                }}
              >
                <div
                  className="text-[13px] font-black"
                  style={{ color: isActive ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}
                >
                  {p.label}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{p.sub}</div>
              </button>
            );
          })}
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {items.map((it) => (
            <AccordionItem
              key={`${persona}-${it.key}`}
              value={`${persona}-${it.key}`}
              className="rounded-xl border px-5 py-1"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
            >
              <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline py-4">
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}