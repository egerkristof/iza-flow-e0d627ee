import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Mail } from "lucide-react";

const SECTIONS = [
  {
    h: "What the sprint is for",
    p: [
      "You have the LLMs. You have a strategy doc. Your team has been trained. And yet output drifts, adoption stalls, and every AI investment behaves like a one-off. Three weeks in, we will tell you why and where to put your budget so it stops happening.",
      "Every part of an AI stack — your LLMs, your RAG, your prompts, your agents, your operators, your tools — needs the same input to work as a system. A clear, governed, current definition of how your company actually decides. Quality standards. Decision logic. Playbooks that hold across teams. We call this layer executable knowledge.",
      "Today this layer does not exist anywhere a tool can reach. It lives in your best operators' heads, in scattered Notion pages, in Slack threads, in old strategy decks. That is why your AI cannot execute to your standard. The sprint is the work of mapping this layer for your business and showing you exactly where investing in it pays back.",
      "We have a strong, specific point of view. The reactive tools you already own (Notion stores, Slack chats, ChatGPT answers) cannot govern or enforce this layer. Static documentation cannot keep up with operational reality. You need an active enforcement layer, the kind we built into LIZA OS. The sprint proves the necessity of that infrastructure on your data. The build is the obvious next step. If it is not obvious by the readout, you owe us nothing past the kickoff.",
    ],
  },
];

const DELIVERABLES = [
  "Your executable knowledge map: the 3 to 5 workflows where codifying your judgment as enforceable standards unlocks the most value, and a draft structure of that layer for your business.",
  "Your cost of inaction, quantified: where today's static documentation is failing to govern AI output. Most mid-market orgs we measure carry 400k to 700k EUR per year in rework, inconsistency, and lost expertise.",
  "Your AI budget allocation: a direct recommendation on where to spend (and where to stop spending) so the next 12 months of AI investment compounds around a single source of judgment instead of fragmenting further.",
  "A human-AI adoption plan: how to roll governed workflows out so your best operators pull them in instead of resisting them. Change management built into the architecture, not bolted on.",
  "A CEO-ready business case: conservative, expected, and aggressive ROI scenarios. Slide-ready, defensible, sized for the board conversation that follows.",
  "One executive readout (60 min) with you and, if you choose, your CEO or COO.",
];

const TIMELINE = [
  {
    week: "Week 1",
    activity: "Discovery: 4 to 6 interviews with you and your key operators, workflow shadowing, surfacing the standards and decision logic that currently live only in people's heads.",
    output: "Workflow inventory and knowledge gap map.",
  },
  {
    week: "Week 2",
    activity: "Design: drafting the executable knowledge layer for your top workflows. Prioritisation workshop with you to quantify the ROI model and budget allocation.",
    output: "Draft executable knowledge map and ROI model.",
  },
  {
    week: "Week 3",
    activity: "Refinement and delivery. Final map, business case, executive readout.",
    output: "Final deliverables and a clear next decision.",
  },
];

const NEEDS = [
  "One internal sponsor (you) for ~4 hours/week across the 3 weeks.",
  "Access to 4–6 operators for 45-minute interviews.",
  "Read-only sight of your current AI strategy doc, playbooks, and any usage telemetry.",
  "One 60-minute executive readout slot in Week 3.",
];

const NOT = [
  "Not a tool selection survey. We assume you have the base models. We work on the layer above them.",
  "Not another strategy doc. You already have a strategy. The sprint produces the executable layer your strategy needs in order to land.",
  "Not vendor-neutral. We have a point of view. An active enforcement layer is the only thing that makes this work at scale, and LIZA OS is what we built to be that layer. The sprint proves the necessity of this infrastructure on your data.",
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
            The AI Execution Blueprint
          </h1>
          <p className="text-lg text-muted-foreground">
            Three weeks. We map the executable knowledge layer your AI strategy is missing — the codified, governed definition of how your company decides — and show you exactly where to direct AI budget so it compounds instead of evaporating.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">€15,000 fixed fee · Remote delivery · Starts within 2 weeks · One sponsor, four to six operators.</p>
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