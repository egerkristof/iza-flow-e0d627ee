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
    q: "We already use ChatGPT/Claude with our team. How is this different?",
    a: "AI tools generate outputs. LIZA OS governs the knowledge those tools run on. Your standards, playbooks, and decision logic are enforced in every session, not left to each person's prompting skills.",
  },
  {
    q: "How is this different from workflow automation (Zapier, Make, n8n)?",
    a: "Automation platforms execute tasks. LIZA OS encodes your domain expertise into capabilities that humans and AI execute together. Automation is a subset of what LIZA orchestrates.",
  },
  {
    q: "We already have SOPs and documented processes. Why do we need this?",
    a: "Because documentation without execution is filing. Your SOPs exist in one place, execution happens in another. LIZA makes documentation executable: every standard is enforced in the workflow itself.",
  },
  {
    q: "Does this replace our existing AI tools?",
    a: "No. LIZA OS is the governance layer above your tools. It ensures your standards and compliance requirements are enforced regardless of which AI model someone uses.",
  },
  {
    q: "How do departments adopt this without creating a central bottleneck?",
    a: "Capabilities are modular. Each department composes the ones they need. Same governance standards, independent execution.",
  },
  {
    q: "How long until we're operational?",
    a: "Most teams are operational within days. Upload existing documents, LIZA extracts structured capabilities automatically.",
  },
  {
    q: "Is our knowledge secure?",
    a: "Yes. Your domain expertise stays in your organization's environment. We don't train on your data.",
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
