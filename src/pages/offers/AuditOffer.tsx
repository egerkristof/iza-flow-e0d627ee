import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Mail } from "lucide-react";

const SECTIONS = [
  {
    h: "Why this sprint is different",
    p: [
      "You have procured the LLMs and written the strategy. The moment those tools hit the reality of daily operations, the friction begins. Output quality is erratic, governance is a black box, and your best operators resist adoption because the tools have no idea how your company actually makes decisions.",
      "The problem is not the model. It is the missing layer between the human and the agent. We call it Agentic Operations, or AgOps: the precise engineering of how human judgment and AI execution interact inside a governed workflow. We do not audit your failures. We design the operational blueprint to fix them.",
      "We have a strong, specific point of view: running 2026 AI capabilities on 2015 static infrastructure (Notion docs, Slack, isolated chat windows) guarantees failure. You need an active enforcement layer. We built one. It is called LIZA OS.",
      "This sprint is the paid first step of an inevitable partnership. In three weeks we map your most critical, broken workflows and redesign them for the agentic age. By the executive readout, the business case for deploying this infrastructure with us will be self-evident. If it is not, you owe us nothing past the kickoff.",
    ],
  },
];

const DELIVERABLES = [
  "The AgOps Blueprint: an architectural redesign of your 3 to 5 highest-leverage workflows, mapping the exact handoffs between human context, AI execution, and human review.",
  "The Instruction Gap diagnostic: a quantification of where your current static documentation is failing to govern AI output, driving rework, margin bleed, and risk. Most mid-market orgs we measure carry 400k to 700k EUR per year in this hidden cost.",
  "The Change Management roadmap: a tactical plan for introducing this new infrastructure to your team in a way that drives enthusiastic adoption rather than resistance.",
  "A CEO-ready business case (PDF and slide-ready) quantifying cost of inaction vs. ROI of governed, enforceable workflows. Conservative, expected, and aggressive scenarios.",
  "One executive readout (60 min) with you and, if you choose, your CEO or COO.",
];

const TIMELINE = [
  {
    week: "Week 1",
    activity: "Discovery and mapping: 4–6 interviews (you + key operators), workflow shadowing, identification of Instruction Gaps in current operations.",
    output: "Workflow inventory + gap map.",
  },
  {
    week: "Week 2",
    activity: "AgOps design: redesign of selected workflows for optimal human–AI collaboration. Prioritization workshop with you to quantify the ROI model.",
    output: "Draft AgOps Blueprint + ROI model.",
  },
  {
    week: "Week 3",
    activity: "Refinement and delivery. Final AgOps Blueprint, business case, and executive readout.",
    output: "Final blueprint, business case, executive readout.",
  },
];

const NEEDS = [
  "One internal sponsor (you) for ~4 hours/week across the 3 weeks.",
  "Access to 4–6 operators for 45-minute interviews.",
  "Read-only sight of your current AI strategy doc, playbooks, and any usage telemetry.",
  "One 60-minute executive readout slot in Week 3.",
];

const NOT = [
  "Not a tool selection survey. We assume you have the base models. We engineer the operational layer above them.",
  "Not a generic strategy doc. You already have a strategy. This sprint produces the operational blueprint to actually execute it.",
  "Not a vendor-neutral diagnostic. We have a point of view: an active enforcement layer is the only thing that makes AgOps possible at scale. LIZA OS is the infrastructure we built to do exactly that. The sprint proves the necessity of this architecture on your data.",
  "Not a 6-month consulting retainer. Three weeks, fixed price, then either we deploy together or we walk.",
];

export default function AuditOffer() {
  useEffect(() => {
    const prev = document.title;
    document.title = "AgOps Design Sprint — LIZA OS";
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
            The AgOps Design Sprint
          </h1>
          <p className="text-lg text-muted-foreground">
            Your AI strategy is sound. Your human–AI workflows are breaking. A 3-week intensive design sprint to architect the execution infrastructure that makes your AI investments operational, governable, and adopted by your team.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">AgOps Design Sprint · €15,000 fixed fee · Remote delivery · Starts within 2 weeks.</p>
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
          <p className="mb-3 text-foreground/90">
            The sprint ends with a decision, not a deliverable on a shelf. By the executive readout you have a CEO-ready
            business case for closing the Instruction Gap and a 90-day plan for the first three workflows we deploy together in
            LIZA OS.
          </p>
          <p className="mb-3 text-foreground/90">
            Post-sprint engagements are priced to deliver a minimum 3x ROI on the hidden cost we identify in the diagnostic.
            For most mid-market orgs, that means the initial 3-workflow enforcement build lands in the <strong>€35k–€50k</strong>{" "}
            range, scaling from there as additional workflows are encoded.
          </p>
          <p className="text-foreground/90">
            We are upfront about this because the alternative — trying to build an enforcement layer internally or with another
            vendor — is the slowest, most expensive way to close a gap we have already mapped, in a category we defined.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Why us</h2>
          <p className="text-foreground/90">
            We built LIZA OS because every tool in the AI stack reacts: Notion stores, Slack chats, ChatGPT answers. None of
            them <em>enforce</em>. The execution infrastructure that turns strategy into daily, governed work simply did not
            exist, so we built it. This sprint is run by the practitioners who built that category, with 15+ years of shipping
            data and AI systems for enterprise. We are not here to give you options. We are here to design the only operational
            architecture we believe works.
          </p>
        </section>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 md:p-8">
          <p className="mb-4 text-base text-foreground">To start, reply to the email or book a 30-minute scoping call.</p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="gap-2">
              <a href="mailto:kristof.eger@lizaos.ai?subject=AgOps%20Design%20Sprint">
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