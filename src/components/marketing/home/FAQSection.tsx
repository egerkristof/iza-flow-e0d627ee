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
    q: "How is this different from workflow automation (Zapier, Make, n8n)?",
    a: "Automation platforms execute tasks. LIZA OS governs how work gets done. It encodes your domain expertise — decision logic, quality standards, compliance rules — into capabilities that humans and AI execute together. Automation is a subset of what LIZA orchestrates.",
  },
  {
    q: "We already have SOPs and documented processes. Why do we need this?",
    a: "Because documentation without execution is filing. Your SOPs exist in one place, execution happens in another, and there's no governance connecting them. LIZA makes documentation executable — every standard is enforced in the workflow itself.",
  },
  {
    q: "Does this replace our existing AI tools and platforms?",
    a: "No. LIZA OS is the governance layer above your tools. It ensures your team's standards, playbooks, and compliance requirements are enforced regardless of which AI model, automation, or tool someone uses.",
  },
  {
    q: "How do departments adopt this without creating a central bottleneck?",
    a: "That's the core design principle. Capabilities are modular — each department composes the ones they need into their workflows. Same governance standards, independent execution. The Head of AI sets strategy, not day-to-day operations.",
  },
  {
    q: "How do we measure adoption across the organization?",
    a: "LIZA tracks which capabilities are deployed, how they're being used, and what's compounding across teams. You get measurable adoption metrics — not just 'we rolled out a tool' but '% of core workflows governed by capabilities.'",
  },
  {
    q: "How does this handle compliance and auditing?",
    a: "Governance is built into every capability — quality gates, approval flows, compliance checks. Auditing happens during execution, not after. Every decision point is traceable back to the governing standard.",
  },
  {
    q: "How long until we're operational?",
    a: "Most teams are operational within days. Upload existing documents, LIZA extracts structured capabilities automatically. No 6-week onboarding, no custom integration project.",
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
