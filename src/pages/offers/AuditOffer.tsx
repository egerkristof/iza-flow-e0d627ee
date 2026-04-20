import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Mail } from "lucide-react";

const SECTIONS = [
  {
    h: "Why this exists",
    p: [
      "You were hired 3–9 months ago to lead AI inside a 50–250 person company. You have the strategy. You have the playbooks. You have the LLM licences. But adoption is stalling, the CEO is starting to ask about ROI, and the gap between your roadmap and what the team actually does every day is widening.",
      "The problem is not your strategy. It is that you are trying to enforce a 2026 operating model on 2015 infrastructure. There is no system of record for AI execution, so nothing compounds.",
      "The AI Opportunity Audit gives you, in three weeks, the evidence and the CEO-ready business case you need to unlock real budget for an Operationalization Sprint. It is the artifact that turns you from \u201cthe AI person\u201d into the executive your CEO trusts with the AI mandate.",
    ],
  },
];

const DELIVERABLES = [
  "A prioritized map of the 5–8 highest-leverage AI workflows in your org, ranked by ROI potential and adoption risk.",
  "A quantified \u201ccost of inaction\u201d model: hours lost to rework, knowledge leakage, inconsistent output, and shadow AI usage.",
  "A CEO-ready ROI business case (PDF + slide-ready) with conservative, expected, and aggressive scenarios.",
  "A 90-day operational roadmap your team can execute, with or without LIZA OS.",
  "A diagnostic of your current execution stack — where Notion, Slack, ChatGPT, and bespoke tools are creating semantic debt.",
  "One executive readout (60 min) with you and, if you choose, your CEO or COO.",
];

const TIMELINE = [
  {
    week: "Week 1",
    activity: "Discovery: 4–6 interviews (you + key operators), workflow shadowing, current-state mapping.",
    output: "Workflow inventory + adoption barrier map.",
  },
  {
    week: "Week 2",
    activity: "Synthesis: Quantification of cost-of-inaction. Prioritization workshop with you. Draft of CEO business case.",
    output: "Draft ROI model + ranked opportunity list.",
  },
  {
    week: "Week 3",
    activity: "Refinement and executive readout. Final business case and 90-day roadmap delivered.",
    output: "Final business case PDF, roadmap, executive readout.",
  },
];

const NEEDS = [
  "One internal sponsor (you) for ~4 hours/week across the 3 weeks.",
  "Access to 4–6 operators for 45-minute interviews.",
  "Read-only sight of your current AI strategy doc, playbooks, and any usage telemetry.",
  "One 60-minute executive readout slot in Week 3.",
];

const NOT = [
  "Not a strategy doc. You already have one.",
  "Not a generic AI maturity assessment. We measure your specific workflows.",
  "Not a software pitch. The audit is product-agnostic; LIZA OS is one option in the roadmap, never the conclusion.",
  "Not a 6-month consulting retainer. Three weeks, fixed price, then we leave.",
];

export default function AuditOffer() {
  useEffect(() => {
    const prev = document.title;
    document.title = "AI Opportunity Audit — LIZA OS";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        <div className="mb-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span>lizaos.ai</span>
          </Link>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <a href="/downloads/liza-os-ai-opportunity-audit.pdf" download>
              <Download className="h-4 w-4" />
              Download PDF
            </a>
          </Button>
        </div>

        <header className="mb-12 border-b border-border pb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">LIZA OS · Offer Brief</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">AI Opportunity Audit</h1>
          <p className="text-lg text-muted-foreground">
            A 3-week diagnostic for Heads of AI who need to prove ROI before the next board cycle.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">€15,000 fixed fee · Remote delivery · Starts within 2 weeks.</p>
        </header>

        {SECTIONS.map((s) => (
          <section key={s.h} className="mb-10">
            <h2 className="mb-4 text-xl font-semibold text-foreground">{s.h}</h2>
            {s.p.map((p, i) => (
              <p key={i} className="mb-3 text-base leading-relaxed text-foreground/90">
                {p}
              </p>
            ))}
          </section>
        ))}

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-foreground">What you get</h2>
          <ul className="space-y-2">
            {DELIVERABLES.map((d) => (
              <li key={d} className="flex gap-3 text-foreground/90">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Timeline</h2>
          <div className="space-y-3">
            {TIMELINE.map((t) => (
              <Card key={t.week} className="border-border/60">
                <CardContent className="grid gap-3 p-5 md:grid-cols-[100px_1fr_1fr] md:gap-6">
                  <p className="text-sm font-semibold text-primary">{t.week}</p>
                  <p className="text-sm text-foreground/90">{t.activity}</p>
                  <p className="text-sm text-muted-foreground">{t.output}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-foreground">What we need from you</h2>
          <ul className="space-y-2">
            {NEEDS.map((d) => (
              <li key={d} className="flex gap-3 text-foreground/90">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Pricing</h2>
          <p className="mb-3 text-foreground/90">
            <strong>€15,000</strong> fixed fee, invoiced 50% on kickoff, 50% on delivery of the executive readout. No success
            fees, no add-ons during the engagement.
          </p>
          <p className="text-foreground/90">
            If, by the end of Week 1, you do not have full clarity on the scope and direction of the audit, we refund the kickoff
            invoice in full. No questions.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-foreground">What this is not</h2>
          <ul className="space-y-2">
            {NOT.map((d) => (
              <li key={d} className="flex gap-3 text-foreground/90">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground/60" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-foreground">What happens after</h2>
          <p className="text-foreground/90">
            You walk out with a CEO-ready business case. Most clients use it to unlock a €25k+ Operationalization Sprint where we
            deploy LIZA OS to encode and enforce the top 3 workflows from the audit. But you are under no obligation. The audit
            stands alone.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Who we are</h2>
          <p className="text-foreground/90">
            LIZA OS is the operating system for AI-native organizations. We are practitioners with 15+ years of building data and
            AI systems for enterprise clients including aliz.ai and Alverad. We do not write strategy decks; we operationalize the
            strategy you already have.
          </p>
        </section>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 md:p-8">
          <p className="mb-4 text-base text-foreground">To start, reply to the email or book a 30-minute scoping call.</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="gap-2">
              <a href="mailto:kristof.eger@lizaos.ai?subject=AI%20Opportunity%20Audit">
                <Mail className="h-4 w-4" />
                Email Kristóf
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <a href="/downloads/liza-os-ai-opportunity-audit.pdf" download>
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Kristóf Éger · LIZA OS · kristof.eger@lizaos.ai · lizaos.ai</p>
        </div>
      </div>
    </div>
  );
}