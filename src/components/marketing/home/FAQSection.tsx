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
    q: "I already use Claude Projects and Custom GPTs. Why do I need this?",
    a: "Those tools give you personal memory within a single conversation or project. But your colleague's breakthroughs stay in their threads. LIZA creates a shared, governed layer across your whole team — so everyone executes with the latest, best thinking, not just their own.",
  },
  {
    q: "ChatGPT now has memory. Doesn't that solve the same problem?",
    a: "ChatGPT memory is personal, fragile, and invisible to leadership. It learns one person's habits — including the bad ones. LIZA enforces team-approved standards, captures structured learnings, and gives leaders visibility into execution quality across the team.",
  },
  {
    q: "We built a prompt library in Notion. How is this different?",
    a: "Prompt libraries are static — someone has to remember to use them, and they don't evolve. LIZA automatically injects the right context into every AI session and learns from real execution. Your methodology stays current because it's connected to how your team actually works.",
  },
  {
    q: "What AI models does LIZA work with?",
    a: "LIZA is model-agnostic. It works with GPT-4, Claude, Gemini, and others. The value isn't in the model — it's in the context layer that ensures your team's judgment runs in every session, regardless of which model someone prefers.",
  },
  {
    q: "How long until my team is actually using it?",
    a: "Most teams are operational within a day. If you have existing methodology docs, the extraction engine structures them automatically. If you're starting fresh, your first working session begins building your knowledge base. No 6-week onboarding.",
  },
  {
    q: "Is my team's knowledge secure?",
    a: "Yes. Your context stays in your organisation's environment. We don't train on your data, and your proprietary methodology never leaves your control — unlike general-purpose AI tools that may use your conversations for training.",
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
