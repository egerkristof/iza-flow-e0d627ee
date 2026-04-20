import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Mail } from "lucide-react";

const SECTIONS = [
  {
    h: "Why this audit is different",
    p: [
      "You wrote the AI strategy. You picked the tools. You shipped the playbooks. And six months in, adoption is uneven, output quality drifts week to week, and you cannot point to where the gap actually lives.",
      "We have a strong, specific point of view about why: every AI strategy fails at the same place. The standards you wrote down never reach the prompt. They sit in Notion docs, Slack threads, and isolated ChatGPT windows that have no idea what your standards are. We call this the Instruction Gap, and we do not believe any amount of training, prompting, or tool selection closes it. Only an enforcement layer does. We built one. It is called LIZA OS.",
      "This audit is not a neutral diagnostic. It is the paid first step of an inevitable partnership. In three weeks we prove, with your data, exactly where your Instruction Gap lives, what it costs you, and what closing it is worth. By the executive readout, the business case for deploying the enforcement layer with us will be self-evident. If it is not, you owe us nothing past the kickoff.",
    ],
  },
];

const DELIVERABLES = [
  "A map of where your team is improvising: the workflows where your written standards are not making it into daily execution, and why.",
  "A diagnostic of your current execution stack (Notion, Slack, ChatGPT, Copilot, bespoke tools) showing where contradictions and undefined standards are quietly degrading every AI output.",
  "The 5 to 8 highest-leverage workflows where an enforcement layer would compound fastest, ranked by ROI and adoption risk.",
  "A quantified cost-of-inaction: hours lost to rework, knowledge leakage, inconsistent output, and shadow AI. Most mid-market orgs we measure carry 400k to 700k EUR per year in this hidden cost.",
  "A CEO-ready business case (PDF and slide-ready) with conservative, expected, and aggressive scenarios for closing the gap.",
  "A 90-day deployment plan: the first three workflows we encode into LIZA OS, the governance model around them, and the adoption milestones.",
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
  "Not a tool adoption survey. Glean, Guru, and the consultancies already do that. We measure the layer underneath.",
  "Not a generic AI maturity score. We map your specific Instruction Gap and quantify your specific cost of inaction.",
  "Not a strategy doc. You already have one. This produces the evidence and the deployment plan to actually execute it.",
  "Not a vendor-neutral diagnostic. We have a point of view: enforcement is the only thing that closes the Instruction Gap, and LIZA OS is the enforcement layer we built. The audit proves it on your data.",
  "Not a 6-month consulting retainer. Three weeks, fixed price, then either we deploy together or we walk.",
];

export default function AuditOffer() {
  useEffect(() => {
    const prev = document.title;
    document.title = "AI Opportunity Audit — LIZA OS";
    // Prevent indexing — this page is for outbound/post-capture only
    let robots = document.querySelector('meta[name="robots"]');
    const created = !robots;
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    const prevRobots = robots.getAttribute("content");
    robots.setAttribute("content", "noindex, nofollow");
    return () => {
      document.title = prev;
      if (created) robots?.remove();
      else if (prevRobots !== null) robots?.setAttribute("content", prevRobots);
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
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Your AI strategy is right. Your team isn't executing it.
          </h1>
          <p className="text-lg text-muted-foreground">
            A 3-week audit that pinpoints where adoption breaks, quantifies what it costs, and gives you the business case to fix it.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">AI Opportunity Audit · €15,000 fixed fee · Remote delivery · Starts within 2 weeks.</p>
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
            The audit ends with a decision, not a deliverable on a shelf. By the executive readout you have a CEO-ready business
            case for closing the Instruction Gap and a 90-day plan for the first three workflows we deploy together in LIZA OS.
            Typical post-audit engagement starts at €25k for the deployment sprint and scales from there. We are upfront about
            this because the alternative — taking your roadmap to an internal team or another vendor — is the slowest, most
            expensive way to close a gap we have already mapped, in a category we built.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Why us</h2>
          <p className="text-foreground/90">
            We built LIZA OS because every tool in the AI stack reacts: Notion stores, Slack chats, ChatGPT answers. None of
            them enforce. The execution layer that turns strategy into daily, governed work simply did not exist, so we built
            it. This audit is run by the practitioners who built that category, with 15+ years of shipping data and AI systems
            for enterprise. We are not here to give you options. We are here to prove the diagnosis on your data and architect
            the only solution we believe works.
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