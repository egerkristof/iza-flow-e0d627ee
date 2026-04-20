import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Download, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BRIEF_PATH = "/downloads/liza-os-ai-opportunity-audit.pdf";
const STORAGE_KEY = "audit_brief_unlocked";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid work email").max(255),
  company: z.string().trim().min(1, "Company is required").max(150),
  role: z.string().trim().max(150).optional(),
});

const SYMPTOMS = [
  "You bought the LLMs, wrote the playbooks, ran the training. Adoption still stalls.",
  "The same prompt does not produce the same standard twice. Quality drifts by operator.",
  "Your best people work around the agents because the agents do not know how you decide.",
  "Governance lives in Notion. Execution happens in ChatGPT. Nothing connects the two.",
  "Every team has its own prompts, its own context, its own version of the truth.",
  "When someone leaves, their judgment leaves with them. Nothing compounds.",
];

const WHAT_YOU_GET = [
  {
    h: "Your executable knowledge layer, mapped",
    p: "We identify the 3 to 5 workflows where codifying your judgment as enforceable standards unlocks the most value, and we draft the structure of that layer for your business.",
  },
  {
    h: "Your cost of inaction, quantified",
    p: "Where static docs are failing to govern AI output today. Most mid-market orgs we measure carry €400k to €700k a year in rework, inconsistency, and lost expertise.",
  },
  {
    h: "A human-AI adoption plan",
    p: "How to roll governed workflows out so your best operators pull them in instead of resisting them. Change management built into the architecture, not bolted on.",
  },
  {
    h: "A CEO-ready business case",
    p: "Conservative, expected, and aggressive ROI scenarios. Slide-ready, defensible, sized for the board conversation that follows.",
  },
];

export default function AuditLanding() {
  const { toast } = useToast();
  const [unlocked, setUnlocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "" });

  useEffect(() => {
    const prev = document.title;
    document.title = "AgOps Design Sprint — Architect your AI execution layer | LIZA OS";
    if (typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "1") {
      setUnlocked(true);
    }
    return () => {
      document.title = prev;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        variant: "destructive",
        title: "Check the form",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("platform_signups").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      role: parsed.data.role || null,
      primary_interest: "audit-brief",
      additional_notes: "Requested AI Opportunity Audit brief from /audit",
    });
    setSubmitting(false);
    if (error) {
      toast({ variant: "destructive", title: "Could not send", description: error.message });
      return;
    }
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "1");
    setUnlocked(true);
    toast({
      title: "Brief unlocked",
      description: "Opening the audit brief — also bookmark this page for later.",
    });
    // Auto-open the PDF
    setTimeout(() => window.open(BRIEF_PATH, "_blank", "noopener"), 250);
  };

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">
            AI Execution Blueprint · 3 weeks · Fixed scope
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            You bought the AI.
            <br />
            <span className="text-muted-foreground">Your knowledge never reached it.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Three weeks. We map the one piece every AI strategy is missing: the codified, governed
            knowledge layer your LLMs, RAG, agents, and operators all need to execute against. We
            call it executable knowledge. Without it, every AI investment stays disconnected. With
            it, they all compound around a single source of judgment.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <a href="#request">
                Request the brief
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href="https://calendar.app.google/3v8jevUcsgRQnLyL9"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book a 30-min scoping call
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Symptoms */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <h2 className="mb-3 text-2xl font-semibold text-foreground md:text-3xl">
            If any of these sound familiar, you have an AgOps problem.
          </h2>
          <p className="mb-8 text-base text-muted-foreground">
            Not a model problem. Not a strategy problem. A missing infrastructure layer between human
            judgment and AI execution.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {SYMPTOMS.map((s) => (
              <Card key={s} className="border-border/60">
                <CardContent className="flex gap-3 p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-foreground/90">{s}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <h2 className="mb-3 text-2xl font-semibold text-foreground md:text-3xl">
            What the sprint produces
          </h2>
          <p className="mb-8 max-w-2xl text-base text-muted-foreground">
            Three weeks of practitioner-led architecture. Four artifacts you can take into a board
            meeting on Monday morning.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            {WHAT_YOU_GET.map((item, i) => (
              <div key={item.h} className="flex gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                  {i + 1}
                </div>
                <div>
                  <p className="mb-1 font-semibold text-foreground">{item.h}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us strip */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">
            Why us
          </p>
          <p className="text-lg leading-relaxed text-foreground/90 md:text-xl">
            We built LIZA OS because every tool in the AI stack reacts — Notion stores, Slack
            chats, ChatGPT answers. None of them <em>enforce</em>. The audit is run by the
            practitioners who built that category, with 15+ years of shipping data and AI systems
            for enterprise. We are not here to give you options. We are here to design the only
            operational architecture we believe works.
          </p>
        </div>
      </section>

      {/* Request the brief — lead capture */}
      <section id="request" className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 md:p-10">
            {unlocked ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-primary" />
                <h2 className="mb-2 text-2xl font-bold text-foreground">Brief unlocked</h2>
                <p className="mb-6 text-muted-foreground">
                  The full scope, timeline, pricing, and engagement terms.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <a href={BRIEF_PATH} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                      Download PDF
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/offers/audit">View web version</Link>
                  </Button>
                </div>
                <p className="mt-6 text-xs text-muted-foreground">
                  Questions? Email{" "}
                  <a
                    href="mailto:kristof.eger@lizaos.ai?subject=AI%20Opportunity%20Audit"
                    className="underline hover:text-foreground"
                  >
                    kristof.eger@lizaos.ai
                  </a>
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground md:text-2xl">
                      Request the full sprint brief
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Scope, week-by-week timeline, pricing, deliverables, and engagement terms.
                      Sent to your inbox and opened in a new tab.
                    </p>
                  </div>
                </div>
                <form onSubmit={onSubmit} className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      maxLength={100}
                    />
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      maxLength={255}
                    />
                    <Input
                      placeholder="Company"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      required
                      maxLength={150}
                    />
                    <Input
                      placeholder="Role (e.g. Head of AI)"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      maxLength={150}
                    />
                  </div>
                  <Button type="submit" size="lg" disabled={submitting} className="gap-2">
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    {submitting ? "Sending…" : "Send me the brief"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    No spam. We use this to send the brief and follow up if you book a call.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}