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
    a: "Those tools make individuals fast. LIZA makes the team consistent. It connects everyone's AI usage through shared, living playbooks that update as fast as your team learns.",
  },
  {
    q: "We've built custom GPTs and prompt templates. How is this different?",
    a: "Custom GPTs are static: someone builds them, others copy them, they go stale. LIZA's playbooks are living, enforced automatically, and evolve from real execution.",
  },
  {
    q: "Our best practices change fast with AI. Can LIZA keep up?",
    a: "That's exactly the problem LIZA solves. When someone discovers a better approach mid-engagement, it feeds back into the shared playbook immediately. No quarterly review needed.",
  },
  {
    q: "Does LIZA replace our existing AI tools?",
    a: "No. LIZA is the management layer above your AI tools. It ensures your team's standards are injected into every session, regardless of which model someone prefers.",
  },
  {
    q: "How does leadership get visibility without micromanaging?",
    a: "LIZA gives leaders a bird's-eye view of execution quality, playbook health, and team learning velocity without sitting in every session.",
  },
  {
    q: "How long until my team is actually using it?",
    a: "Most teams are operational within a day. Upload existing docs, LIZA extracts structured playbooks automatically. No 6-week onboarding.",
  },
  {
    q: "What does it cost?",
    a: "We're in private beta. The first month is free for every team. After that, pricing scales with team size. Book your Diagnostic Debrief and we'll walk you through it.",
  },
  {
    q: "Is my team's knowledge secure?",
    a: "Yes. Your playbooks stay in your organisation's environment. We don't train on your data.",
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
