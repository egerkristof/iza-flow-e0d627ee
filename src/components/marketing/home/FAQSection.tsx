import { SectionTag } from "./shared";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "My team already uses ChatGPT and Claude daily. What does LIZA add?",
    a: "Those tools make individuals fast. LIZA makes the team consistent. It connects everyone's AI usage through shared, living playbooks, so your best practices update as fast as your team learns and every session runs the latest standard.",
  },
  {
    q: "We've built custom GPTs and prompt templates. How is this different?",
    a: "Custom GPTs and prompt templates are static: someone builds them, others copy them, they gradually go stale. LIZA's playbooks are living. They're enforced automatically in every session and evolve from real execution. Your methodology stays current because it's connected to how your team actually works.",
  },
  {
    q: "Our best practices change fast with AI. Can LIZA keep up?",
    a: "That's exactly the problem LIZA solves. When someone discovers a better approach mid-engagement, it feeds back into the shared playbook immediately. No quarterly review needed. Your standards evolve at the speed of execution.",
  },
  {
    q: "Does LIZA replace our existing AI tools?",
    a: "No. LIZA is the layer above your AI tools. It works with GPT-4, Claude, Gemini, and others. Think of it as the management layer: it ensures your team's judgment, standards, and edge cases are injected into every AI session, regardless of which model someone prefers.",
  },
  {
    q: "How does leadership get visibility without micromanaging?",
    a: "LIZA gives leaders a bird's-eye view of execution quality, playbook health, and team learning velocity without sitting in every session. You see what's working, what's drifting, and where your standards need updating.",
  },
  {
    q: "How long until my team is actually using it?",
    a: "Most teams are operational within a day. Upload existing methodology docs and LIZA extracts structured playbooks automatically. Or start fresh: your first working session begins building your knowledge base. No 6-week onboarding.",
  },
  {
    q: "Is my team's knowledge secure?",
    a: "Yes. Your playbooks stay in your organisation's environment. We don't train on your data, and your proprietary methodology never leaves your control.",
  },
];

export function FAQSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="FAQ" icon={<HelpCircle className="w-3 h-3" />} />
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Common questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border px-5 py-1"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
            >
              <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
