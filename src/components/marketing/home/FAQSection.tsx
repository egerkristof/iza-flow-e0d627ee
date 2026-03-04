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
    q: "Do I need to upload all my documents before getting started?",
    a: "No. You can start blank and define rules as you work. Or upload existing methodology docs — LIZA extracts structured knowledge from them. Most teams start with one playbook and expand from there.",
  },
  {
    q: "How is this different from giving my team a shared ChatGPT account?",
    a: "ChatGPT doesn't know your standards. LIZA injects your team's best practices, edge cases, and quality criteria into every AI session automatically. The difference: consistency at scale vs. individual improvisation.",
  },
  {
    q: "What AI models does LIZA work with?",
    a: "LIZA is model-agnostic. It works with GPT-4, Claude, Gemini, and others. The value isn't in the model — it's in the context layer that ensures your team's judgment runs in every session.",
  },
  {
    q: "How long does onboarding take?",
    a: "Most teams are operational within a day. If you have existing methodology docs, the extraction engine structures them automatically. If you're starting fresh, your first working session begins building your knowledge base.",
  },
  {
    q: "Is my team's knowledge secure?",
    a: "Yes. Your context stays in your organisation's environment. We don't train on your data, and your proprietary methodology never leaves your control.",
  },
  {
    q: "What's the Beta pricing?",
    a: "The Private Beta is free for the first month. After that, pricing scales with team size. We're limiting each cohort to 10 teams to ensure hands-on support.",
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
