/**
 * /factory-floor. Council Review #4. NO TYPING.
 *  - One screen. Three rows of chips.
 *  - Click three times, the verdict generates below.
 *  - Verdict letter, gated call request.
 */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Verdict = {
  headline: string;
  gap_named: string;
  breaks_next_quarter: string[];
  the_call: string;
  signoff_quote: string;
};

type Choice = { id: string; label: string; sub?: string };

const PROMISES: Choice[] = [
  { id: "productivity", label: "X% productivity gain", sub: "e.g. 30% faster, 20% time saved" },
  { id: "cost", label: "Cost or headcount reduction", sub: "Replace seats, reduce spend" },
  { id: "revenue", label: "New AI-powered product or revenue line", sub: "Customer-facing capability" },
  { id: "rollout", label: "Org-wide Copilot or LLM rollout", sub: "Everyone gets a seat" },
  { id: "deflection", label: "Service or support automation", sub: "Tickets, calls, requests deflected" },
  { id: "vague", label: "Honestly, it is vague", sub: "We should be doing more with AI" },
];

const WORKFLOWS: Choice[] = [
  { id: "doc-review", label: "Document review or drafting", sub: "Contracts, RFPs, reports, memos" },
  { id: "research", label: "Research and summarization", sub: "Market, technical, internal knowledge" },
  { id: "support", label: "Customer or employee support", sub: "Tickets, IT helpdesk, HR queries" },
  { id: "sales", label: "Sales or marketing content", sub: "Outreach, briefs, enablement" },
  { id: "code", label: "Code, data, or analytics", sub: "Copilots, SQL, reporting" },
  { id: "none", label: "Nothing in production yet", sub: "Pilots and experiments only" },
];

const GRADING: Choice[] = [
  { id: "automated", label: "An automated check, with a written rubric", sub: "Runs in-line, every output" },
  { id: "reviewer", label: "A human reviewer, against a clear standard", sub: "Same standard, every time" },
  { id: "informal", label: "Someone eyeballs it when they notice", sub: "No written rubric" },
  { id: "nobody", label: "Honestly, nobody is grading it", sub: "If no one complains, it shipped" },
];

export default function FactoryFloor() {
  const [promise, setPromise] = useState<string | null>(null);
  const [workflow, setWorkflow] = useState<string | null>(null);
  const [grading, setGrading] = useState<string | null>(null);

  const [generating, setGenerating] = useState(false);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  const verdictRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.title;
    document.title = "Factory Floor. Three clicks before next quarter.";
    return () => { document.title = prev; };
  }, []);

  const allPicked = !!promise && !!workflow && !!grading;

  async function runVerdict() {
    if (!allPicked || generating) return;
    setGenerating(true);
    setVerdict(null);
    setRequested(false);
    try {
      const promiseLabel = PROMISES.find((p) => p.id === promise)?.label ?? promise!;
      const workflowLabel = WORKFLOWS.find((w) => w.id === workflow)?.label ?? workflow!;
      const gradingLabel = GRADING.find((g) => g.id === grading)?.label ?? grading!;

      const { data, error } = await supabase.functions.invoke("factory-verdict", {
        body: {
          promise: promiseLabel,
          workflow: workflowLabel,
          grading: gradingLabel,
        },
      });
      if (error) throw error;
      const v = (data as { verdict?: Verdict })?.verdict;
      if (!v?.headline) throw new Error("empty verdict");

      const { data: inserted } = await supabase
        .from("factory_floor_submissions")
        .insert([{
          promise: promiseLabel,
          workflow: workflowLabel,
          grading: gradingLabel,
          verdict: v as unknown as never,
          user_agent: navigator.userAgent.slice(0, 240),
        }])
        .select("id")
        .single();
      if (inserted?.id) setSubmissionId(inserted.id);

      setVerdict(v);
      // Scroll the verdict into view after a brief delay for the mount
      setTimeout(() => verdictRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      console.error(err);
      toast({
        title: "The verdict engine stalled.",
        description: "Try again in a moment. Your picks are still here.",
      });
    } finally {
      setGenerating(false);
    }
  }

  async function requestCall(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@") || !company.trim()) {
      toast({ title: "Name, work email, and company are required." });
      return;
    }
    setRequesting(true);
    try {
      if (submissionId) {
        await supabase
          .from("factory_floor_submissions")
          .update({ name, email, company, role, call_requested: true })
          .eq("id", submissionId);
      }
      const promiseLabel = PROMISES.find((p) => p.id === promise)?.label ?? "";
      const workflowLabel = WORKFLOWS.find((w) => w.id === workflow)?.label ?? "";
      const gradingLabel = GRADING.find((g) => g.id === grading)?.label ?? "";
      const { error } = await supabase.functions.invoke("factory-call-request", {
        body: { name, email, company, role, promise: promiseLabel, workflow: workflowLabel, grading: gradingLabel, verdict, submission_id: submissionId },
      });
      if (error) throw error;
      setRequested(true);
    } catch (err) {
      console.error(err);
      toast({
        title: "Could not send the request.",
        description: "Email kristof.eger@lizaos.ai directly and we will sort it.",
      });
    } finally {
      setRequesting(false);
    }
  }

  function reset() {
    setPromise(null); setWorkflow(null); setGrading(null);
    setVerdict(null); setSubmissionId(null);
    setName(""); setEmail(""); setCompany(""); setRole("");
    setRequested(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <a href="/" className="text-xs tracking-[0.2em] font-bold">LIZA OS</a>
          <div className="text-[10px] tracking-[0.2em] text-muted-foreground">
            FACTORY FLOOR / OPERATING DIAGNOSTIC
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        {/* Hero, compact, on the same screen as the picker */}
        <section>
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">
            FOR HEADS OF AI / DACH
          </p>
          <h1 className="mt-5 text-3xl md:text-[2.6rem] font-bold leading-[1.1] tracking-tight max-w-3xl">
            Next quarter, your board expects AI results.
            <span className="block text-foreground/60">
              Three clicks tells you whether your operation can deliver them.
            </span>
          </h1>
          <p className="mt-4 text-[15px] text-muted-foreground max-w-2xl">
            Pick the closest answer in each row. No typing. The verdict appears below in seconds.
          </p>
        </section>

        {/* The three pickers */}
        <div className="mt-10 space-y-8">
          <PickerRow
            n="01"
            label="THE PROMISE"
            question="What has your CEO or board promised about AI for next quarter?"
            choices={PROMISES}
            value={promise}
            onChange={setPromise}
          />
          <PickerRow
            n="02"
            label="THE WORKFLOW"
            question="Which AI workflow would you point to if asked tomorrow?"
            choices={WORKFLOWS}
            value={workflow}
            onChange={setWorkflow}
            disabled={!promise}
          />
          <PickerRow
            n="03"
            label="THE GRADING"
            question="How is its last output actually graded?"
            choices={GRADING}
            value={grading}
            onChange={setGrading}
            disabled={!workflow}
          />
        </div>

        {/* Generate button — sticky CTA */}
        <div className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">
            {!allPicked
              ? `${[promise, workflow, grading].filter(Boolean).length} of 3 picked.`
              : "Ready. The letter takes about 5 seconds."}
          </p>
          <Button
            size="lg"
            onClick={runVerdict}
            disabled={!allPicked || generating}
            className="h-12 px-6 text-base"
          >
            {generating ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating verdict</>
            ) : (
              <>Generate the verdict <ArrowRight className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        </div>

        {/* The verdict */}
        <AnimatePresence>
          {verdict && (
            <motion.div
              ref={verdictRef}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-16 scroll-mt-24"
            >
              <VerdictLetter
                verdict={verdict}
                name={name} email={email} company={company} role={role}
                onName={setName} onEmail={setEmail} onCompany={setCompany} onRole={setRole}
                onSubmit={requestCall}
                submitting={requesting}
                requested={requested}
                onReset={reset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>LIZA OS. The operating layer for AI-native organizations.</span>
          <a href="/" className="hover:text-foreground">lizaos.ai</a>
        </div>
      </footer>
    </div>
  );
}

function PickerRow({
  n, label, question, choices, value, onChange, disabled,
}: {
  n: string;
  label: string;
  question: string;
  choices: Choice[];
  value: string | null;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <section className={cn("transition-opacity", disabled && "opacity-40 pointer-events-none")}>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-[10px] tracking-[0.3em] font-bold text-muted-foreground tabular-nums">
          {n}
        </span>
        <span className="text-[10px] tracking-[0.3em] font-bold text-foreground">{label}</span>
      </div>
      <h2 className="text-lg md:text-xl font-bold tracking-tight mb-4 max-w-3xl">
        {question}
      </h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {choices.map((c) => {
          const selected = value === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              disabled={disabled}
              className={cn(
                "group text-left rounded-sm border px-4 py-3 transition-all",
                selected
                  ? "border-foreground bg-foreground text-background shadow-[0_2px_0_hsl(var(--foreground)/0.15)]"
                  : "border-border bg-card hover:border-foreground/60 hover:bg-accent",
              )}
            >
              <div className="text-sm font-bold leading-snug">{c.label}</div>
              {c.sub && (
                <div className={cn(
                  "text-xs mt-1 leading-snug",
                  selected ? "text-background/70" : "text-muted-foreground",
                )}>
                  {c.sub}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function VerdictLetter({
  verdict, name, email, company, role,
  onName, onEmail, onCompany, onRole, onSubmit, submitting, requested, onReset,
}: {
  verdict: Verdict;
  name: string; email: string; company: string; role: string;
  onName: (v: string) => void; onEmail: (v: string) => void;
  onCompany: (v: string) => void; onRole: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  requested: boolean;
  onReset: () => void;
}) {
  return (
    <section>
      {/* The letter */}
      <article className="rounded-sm border border-border bg-card p-8 md:p-12 shadow-[0_1px_0_hsl(var(--foreground)/0.04)]">
        <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">
          PRIVATE MEMO / TO THE HEAD OF AI
        </p>

        <h2 className="mt-5 text-2xl md:text-[2.1rem] font-bold tracking-tight leading-[1.15]">
          {verdict.headline}
        </h2>

        <p className="mt-6 text-[15px] md:text-base leading-relaxed text-foreground/90">
          {verdict.gap_named}
        </p>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold mb-4">
            WHAT BREAKS BEFORE THE QUARTER ENDS
          </p>
          <ol className="space-y-3">
            {verdict.breaks_next_quarter.map((b, i) => (
              <li key={i} className="flex gap-4 text-[15px] leading-relaxed">
                <span className="font-bold tabular-nums text-foreground/50 shrink-0 w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold mb-3">
            WHAT A 20 MINUTE CALL RESOLVES
          </p>
          <p className="text-[15px] leading-relaxed text-foreground/90">{verdict.the_call}</p>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="italic text-foreground/70 text-[15px]">
            &ldquo;{verdict.signoff_quote}&rdquo;
          </p>
          <p className="mt-4 text-xs tracking-[0.15em] text-muted-foreground">
            KRISTOF EGER &middot; LIZA OS
          </p>
        </div>
      </article>

      {/* Gated call request */}
      {requested ? (
        <div className="mt-12 rounded-sm border-2 border-foreground bg-accent p-8 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-3 py-1">
            <Check className="h-3.5 w-3.5" />
            <span className="text-[10px] tracking-[0.15em] font-bold">REQUEST RECEIVED</span>
          </div>
          <h3 className="mt-4 text-xl md:text-2xl font-bold tracking-tight">
            Thank you{name ? `, ${name.split(" ")[0]}` : ""}. A reply lands within 24 hours from kristof.eger@lizaos.ai.
          </h3>
        </div>
      ) : (
        <div className="mt-12 rounded-sm border-2 border-foreground bg-background p-8 md:p-10">
          <p className="text-[10px] tracking-[0.3em] text-foreground font-bold">REQUEST THE CALL</p>
          <h3 className="mt-3 text-xl md:text-2xl font-bold tracking-tight">
            We do not run a calendar widget. We vet first, then send a slot within 24 hours.
          </h3>
          <form onSubmit={onSubmit} className="mt-6 grid gap-3 md:grid-cols-2">
            <Input value={name} onChange={(e) => onName(e.target.value)} placeholder="Full name" className="h-11" required />
            <Input type="email" value={email} onChange={(e) => onEmail(e.target.value)} placeholder="Work email" className="h-11" required />
            <Input value={company} onChange={(e) => onCompany(e.target.value)} placeholder="Company" className="h-11" required />
            <Input value={role} onChange={(e) => onRole(e.target.value)} placeholder="Role (optional)" className="h-11" />
            <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2">
              <p className="text-[11px] text-muted-foreground">
                No newsletter. No sequence. One reply from a human.
              </p>
              <Button type="submit" size="lg" disabled={submitting} className="h-11">
                {submitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending</>
                ) : (
                  <>Request the call <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-10 text-center">
        <button onClick={onReset} className="text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground">
          START OVER
        </button>
      </div>
    </section>
  );
}