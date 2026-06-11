/**
 * /factory-floor. Council Review #3 applied. Conversation, not quiz.
 *  - Hero: sober, declarative, no Anglo sales energy.
 *  - 3 free-text prompts (promise, workflow, grading). No multiple choice.
 *  - Verdict: AI-generated letter, second person, signed. No metaphor in hero, earned in verdict.
 *  - CTA: gated 20-min call request (name/company/role), founder vets, sends Cal link.
 */
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Step = "intro" | "promise" | "workflow" | "grading" | "thinking" | "verdict" | "requested";

type Verdict = {
  headline: string;
  gap_named: string;
  breaks_next_quarter: string[];
  the_call: string;
  signoff_quote: string;
};

const PROMPTS = {
  promise: {
    eyebrow: "01 / THE PROMISE",
    question: "In one sentence, what has your CEO or board promised about AI for next quarter?",
    hint: "What they said out loud. The number, the date, the deliverable. Their words, not yours.",
    placeholder:
      "e.g. 30 percent faster contract turnaround by end of Q2, using AI across legal ops.",
  },
  workflow: {
    eyebrow: "02 / THE WORKFLOW",
    question: "Name the one AI workflow you would point to if they asked tomorrow.",
    hint: "The one actually running. Not the slide deck. Not the pilot you wish was live.",
    placeholder: "e.g. NDA first-pass review. Drafts go to legal counsel for final sign-off.",
  },
  grading: {
    eyebrow: "03 / THE GRADING",
    question: "Who graded its last output. And against what.",
    hint: "Name the person and the standard. If neither, write that. The vague answer is the diagnosis.",
    placeholder:
      "e.g. Two junior associates eyeball it. There is no written rubric. We call it good if no one complains.",
  },
} as const;

export default function FactoryFloor() {
  const [step, setStep] = useState<Step>("intro");
  const [promise, setPromise] = useState("");
  const [workflow, setWorkflow] = useState("");
  const [grading, setGrading] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "Factory Floor. The 90 seconds before next quarter.";
    return () => { document.title = prev; };
  }, []);

  async function runVerdict() {
    setStep("thinking");
    try {
      const { data, error } = await supabase.functions.invoke("factory-verdict", {
        body: { promise, workflow, grading },
      });
      if (error) throw error;
      const v = (data as { verdict?: Verdict })?.verdict;
      if (!v?.headline) throw new Error("empty verdict");

      // Persist the submission, capture id for the call-request follow-up
      const { data: inserted, error: insErr } = await supabase
        .from("factory_floor_submissions")
        .insert({
          promise,
          workflow,
          grading,
          verdict: v as unknown as Record<string, unknown>,
          user_agent: navigator.userAgent.slice(0, 240),
        })
        .select("id")
        .single();
      if (!insErr && inserted?.id) setSubmissionId(inserted.id);

      setVerdict(v);
      setStep("verdict");
    } catch (err) {
      console.error(err);
      toast({
        title: "The verdict engine stalled.",
        description: "Try again in a moment. Your answers are still here.",
      });
      setStep("grading");
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
      const { error } = await supabase.functions.invoke("factory-call-request", {
        body: { name, email, company, role, promise, workflow, grading, verdict, submission_id: submissionId },
      });
      if (error) throw error;
      setStep("requested");
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
    setStep("intro");
    setPromise(""); setWorkflow(""); setGrading("");
    setVerdict(null); setSubmissionId(null);
    setName(""); setEmail(""); setCompany(""); setRole("");
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

      <main className="mx-auto max-w-3xl px-6 py-14 md:py-24">
        <AnimatePresence mode="wait">
          {step === "intro" && <Intro key="intro" onStart={() => setStep("promise")} />}

          {step === "promise" && (
            <Prompt
              key="promise"
              {...PROMPTS.promise}
              value={promise}
              onChange={setPromise}
              onNext={() => setStep("workflow")}
              onBack={() => setStep("intro")}
              minLen={12}
            />
          )}

          {step === "workflow" && (
            <Prompt
              key="workflow"
              {...PROMPTS.workflow}
              value={workflow}
              onChange={setWorkflow}
              onNext={() => setStep("grading")}
              onBack={() => setStep("promise")}
              minLen={8}
            />
          )}

          {step === "grading" && (
            <Prompt
              key="grading"
              {...PROMPTS.grading}
              value={grading}
              onChange={setGrading}
              onNext={runVerdict}
              onBack={() => setStep("workflow")}
              nextLabel="Generate the verdict"
              minLen={6}
            />
          )}

          {step === "thinking" && <Thinking key="thinking" />}

          {step === "verdict" && verdict && (
            <VerdictLetter
              key="verdict"
              verdict={verdict}
              name={name} email={email} company={company} role={role}
              onName={setName} onEmail={setEmail} onCompany={setCompany} onRole={setRole}
              onSubmit={requestCall}
              submitting={requesting}
              onReset={reset}
            />
          )}

          {step === "requested" && <Requested key="requested" name={name} onReset={reset} />}
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

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <motion.section {...fade} className="text-left">
      <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">
        FOR HEADS OF AI / DACH
      </p>
      <h1 className="mt-6 text-4xl md:text-[3.4rem] font-bold leading-[1.05] tracking-tight">
        Next quarter, your board expects AI results.
        <br />
        <span className="text-foreground/70">
          90 seconds tells you whether your operation can deliver them.
        </span>
      </h1>

      <div className="mt-10 space-y-4 max-w-2xl text-[15px] leading-relaxed text-foreground/80">
        <p>
          Three questions. You type the answers in your own words. We write you a one-page letter
          naming the specific gap between what was promised and what your operation can actually
          govern.
        </p>
        <p>
          No score. No PDF nurture sequence. Read it on screen, decide if a 20 minute call with
          us is worth your Monday.
        </p>
      </div>

      <div className="mt-12 flex items-center gap-6">
        <Button size="lg" onClick={onStart} className="text-base px-7 h-12">
          Begin <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="text-xs text-muted-foreground">
          Your answers are private. Letter is generated in ~5 seconds.
        </p>
      </div>
    </motion.section>
  );
}

function Prompt({
  eyebrow, question, hint, placeholder, value, onChange, onNext, onBack, nextLabel, minLen,
}: {
  eyebrow: string;
  question: string;
  hint: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  nextLabel?: string;
  minLen: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const ready = value.trim().length >= minLen;

  return (
    <motion.section {...fade}>
      <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">{eyebrow}</p>
      <h2 className="mt-4 text-2xl md:text-[2rem] font-bold tracking-tight leading-[1.15]">
        {question}
      </h2>
      <p className="mt-3 text-sm text-muted-foreground max-w-2xl">{hint}</p>

      <Textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-8 text-base leading-relaxed bg-card border-border focus-visible:ring-foreground"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && ready) onNext();
        }}
      />

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground"
        >
          BACK
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            {ready ? "press Cmd+Enter" : `at least ${minLen} characters`}
          </span>
          <Button onClick={onNext} disabled={!ready} size="lg" className="h-11">
            {nextLabel ?? "Next"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.section>
  );
}

function Thinking() {
  return (
    <motion.section {...fade} className="text-left py-16">
      <Loader2 className="h-6 w-6 animate-spin text-foreground/60" />
      <h2 className="mt-6 text-2xl font-bold tracking-tight">Reading your three answers.</h2>
      <p className="mt-3 text-muted-foreground max-w-xl">
        Naming the structural gap between the promise and the workflow. Drafting the letter.
      </p>
    </motion.section>
  );
}

function VerdictLetter({
  verdict, name, email, company, role,
  onName, onEmail, onCompany, onRole, onSubmit, submitting, onReset,
}: {
  verdict: Verdict;
  name: string; email: string; company: string; role: string;
  onName: (v: string) => void; onEmail: (v: string) => void;
  onCompany: (v: string) => void; onRole: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  onReset: () => void;
}) {
  return (
    <motion.section {...fade}>
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
      <div className="mt-12 rounded-sm border-2 border-foreground bg-background p-8 md:p-10">
        <p className="text-[10px] tracking-[0.3em] text-foreground font-bold">REQUEST THE CALL</p>
        <h3 className="mt-3 text-xl md:text-2xl font-bold tracking-tight">
          We do not run a calendar widget. We vet first, then send a slot within 24 hours.
        </h3>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
          Three details. If your situation matches what we work on, you get a private link the
          same day.
        </p>

        <form onSubmit={onSubmit} className="mt-6 grid gap-3 md:grid-cols-2">
          <Input value={name} onChange={(e) => onName(e.target.value)} placeholder="Full name" className="h-11" required />
          <Input type="email" value={email} onChange={(e) => onEmail(e.target.value)} placeholder="Work email" className="h-11" required />
          <Input value={company} onChange={(e) => onCompany(e.target.value)} placeholder="Company" className="h-11" required />
          <Input value={role} onChange={(e) => onRole(e.target.value)} placeholder="Role (e.g. Head of AI)" className="h-11" />
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

      <div className="mt-10 text-center">
        <button onClick={onReset} className="text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground">
          START OVER
        </button>
      </div>
    </motion.section>
  );
}

function Requested({ name, onReset }: { name: string; onReset: () => void }) {
  return (
    <motion.section {...fade} className="py-12">
      <div className="inline-flex items-center gap-3 rounded-full border border-foreground bg-accent px-4 py-2">
        <Check className="h-4 w-4" />
        <span className="text-xs tracking-[0.15em] font-bold">REQUEST RECEIVED</span>
      </div>
      <h2 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight leading-tight">
        Thank you{name ? `, ${name.split(" ")[0]}` : ""}. We will reply within 24 hours.
      </h2>
      <p className="mt-4 text-muted-foreground max-w-xl">
        If the fit is right, you receive a private booking link from kristof.eger@lizaos.ai. If
        not, you receive a short note pointing you to the one thing worth doing this month.
        Either way, a human reads your answers before we respond.
      </p>
      <button
        onClick={onReset}
        className="mt-8 text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground"
      >
        RUN ANOTHER &rarr;
      </button>
    </motion.section>
  );
}