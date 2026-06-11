/**
 * /factory-floor. Council Review #2 applied.
 *  1. Demand-side hero ("CEO promised, can you ship?")
 *  2. "AI task" replaced with "AI workflow" everywhere
 *  3. Scale sub-headline cut
 *  4. Question prompts rewritten (Q1 rule-set framing, Q2 skill-dependency, Q4 tokens)
 *  5. Diagram is a payoff (verdict only). No progressive companion during Qs.
 *  6. Verdict restructured into 4 blocks: label, meaning, 3 bullets, next move.
 */
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  EMPTY_ANSWERS,
  FactoryAnswers,
  FactoryDiagram,
  StationKey,
  StationState,
} from "@/components/factory/FactoryDiagram";

type ScaleBand = "0-2" | "3-9" | "10+";
type VerdictState = "pre-factory" | "workshop" | "workshop-at-scale";

type QuestionDef = {
  key: StationKey;
  n: string;
  title: string;
  prompt: string;
  options: { value: StationState; label: string }[];
  reframe: string;
};

const QUESTIONS: QuestionDef[] = [
  {
    key: "standard", n: "01", title: "The Standard",
    prompt:
      "Across the AI workflows, use cases, or experiments running in your org, is there a written, agreed rule-set the AI is held to. A spec, a rubric, a definition of a good output. Something graded against, not just vibes.",
    options: [
      { value: "yes", label: "Yes, written and used" },
      { value: "partial", label: "Sort of, in people's heads" },
      { value: "no", label: "No" },
    ],
    reframe:
      "Every factory starts with a spec sheet. Without one, every AI output is a craftsman opinion and every reviewer is grading on vibes.",
  },
  {
    key: "line", n: "02", title: "The Line",
    prompt:
      "When a more skilled team member and a less skilled one both use AI for the same kind of work, do they produce the same shape of output. Or wildly different ones.",
    options: [
      { value: "yes", label: "Same shape, every time" },
      { value: "partial", label: "Roughly similar, depends on the person" },
      { value: "no", label: "Completely different outputs" },
    ],
    reframe:
      "A factory line produces the same part a thousand times. A workshop produces a thousand different parts. Workshops do not scale by hiring more craftsmen. They collapse.",
  },
  {
    key: "qa", n: "03", title: "The QA",
    prompt:
      "When AI produces a wrong or off-brand output, what catches it before it reaches a customer or a real decision.",
    options: [
      { value: "yes", label: "An automated check, in-line" },
      { value: "partial", label: "A human reviewer, every time" },
      { value: "no", label: "Whoever happens to notice" },
    ],
    reframe:
      "Factories ship at scale because QA runs in-line, not as heroics. If your only QA is someone noticing, your error rate is whatever your most tired employee allows.",
  },
  {
    key: "meter", n: "04", title: "The Meter",
    prompt:
      "For your highest-volume AI workflow, do you know what one output actually costs (tokens plus reviewer time) and how often it has to be redone or fixed.",
    options: [
      { value: "yes", label: "Yes, both numbers" },
      { value: "partial", label: "One of them" },
      { value: "no", label: "Neither" },
    ],
    reframe:
      "Cost without rework is a half-truth. Rework without cost is a complaint. Together they are the only honest answer to: is this workflow working.",
  },
];

// 4-block verdict copy. Each bullet is what breaks NEXT QUARTER.
const VERDICT_COPY: Record<VerdictState, {
  label: string;
  meaning: string;
  breaks: string[];
  nextMove: string;
  pdfTitle: string;
}> = {
  "pre-factory": {
    label: "Pre-factory",
    meaning:
      "AI is a few smart people doing impressive things by hand. Right stage for six months. Wrong stage to scale from.",
    breaks: [
      "More pilots get greenlit. None converge on a shared output standard.",
      "Cloud spend climbs. No one in the room can answer what it bought.",
      "Two of your best people leave because no one defines what good looks like.",
    ],
    nextMove:
      "Next 14 days: write one Standard for the first AI workflow you will run. One page. Before any new pilot is approved.",
    pdfTitle: "The Pre-Factory Brief",
  },
  workshop: {
    label: "Workshop",
    meaning:
      "AI is producing real work used by real people. The cracks are structural, not tooling. Goodwill expires the quarter your CFO asks for unit economics.",
    breaks: [
      "Output drift between users becomes a launch-blocker, not a backlog item.",
      "You become the QA function. Personally. On evenings.",
      "Costs creep without a story. The CFO discovers it before you do.",
    ],
    nextMove:
      "Next 30 days: pick your highest-volume workflow. Install one automated check. One workflow. One check. That is how the line begins.",
    pdfTitle: "The Workshop Brief",
  },
  "workshop-at-scale": {
    label: "Workshop at scale",
    meaning:
      "Ten or more workflows live. Hundreds of users. Monthly spend on the CFO radar. Underlying structure has not kept up. Every new initiative compounds the rework.",
    breaks: [
      "A board member asks for ROI. No defensible number for any of the 20+ workflows.",
      "The CTO starts routing around you because nobody can vouch for output quality.",
      "Best AI engineers leave. No one knows what good looks like here.",
    ],
    nextMove:
      "Next 30 days: stop launching new workflows. Install the Meter on your top 3 by spend. You cannot fix what you cannot see.",
    pdfTitle: "The Workshop-at-Scale Brief",
  },
};

function pickVerdictState(scale: ScaleBand): VerdictState {
  if (scale === "0-2") return "pre-factory";
  if (scale === "3-9") return "workshop";
  return "workshop-at-scale";
}

function pickWeakest(answers: FactoryAnswers, state: VerdictState): StationKey | null {
  if (state === "workshop-at-scale") return "meter";
  const order: StationKey[] = ["standard", "line", "qa", "meter"];
  const score = (s: StationState) => (s === "no" ? 0 : s === "partial" ? 1 : 2);
  return [...order].sort((a, b) => score(answers[a]) - score(answers[b]))[0] ?? null;
}

type Step = "intro" | "scale" | "q1" | "q2" | "q3" | "q4" | "verdict";

export default function FactoryFloor() {
  const [step, setStep] = useState<Step>("intro");
  const [scale, setScale] = useState<ScaleBand | null>(null);
  const [answers, setAnswers] = useState<FactoryAnswers>(EMPTY_ANSWERS);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "Factory Floor. Can your operation ship what the CEO promised?";
    return () => { document.title = prev; };
  }, []);

  const verdictState = useMemo(() => (scale ? pickVerdictState(scale) : null), [scale]);
  const weakest = useMemo(
    () => (verdictState ? pickWeakest(answers, verdictState) : null),
    [answers, verdictState],
  );
  const copy = verdictState ? VERDICT_COPY[verdictState] : null;
  const weakestLabel = weakest
    ? QUESTIONS.find((q) => q.key === weakest)?.title.replace("The ", "")
    : "";

  function answer(key: StationKey, value: StationState, nextStep: Step) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep(nextStep);
  }

  function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast({ title: "Add a work email so we can send the brief." });
      return;
    }
    setSubmitted(true);
    toast({ title: "On its way.", description: "Two pages. One template. No nurture sequence." });
  }

  function reset() {
    setStep("intro");
    setScale(null);
    setAnswers(EMPTY_ANSWERS);
    setEmail("");
    setSubmitted(false);
  }

  const progress = (() => {
    const order: Step[] = ["intro", "scale", "q1", "q2", "q3", "q4", "verdict"];
    return Math.round((order.indexOf(step) / (order.length - 1)) * 100);
  })();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <a href="/" className="text-xs tracking-[0.2em] font-bold text-foreground">LIZA OS</a>
          <div className="text-[10px] tracking-[0.2em] text-muted-foreground">FACTORY FLOOR / DIAGNOSTIC</div>
        </div>
        <div className="h-[2px] w-full bg-muted">
          <motion.div className="h-full bg-foreground" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {step === "intro" && <IntroStep key="intro" onStart={() => setStep("scale")} />}
          {step === "scale" && (
            <ScaleStep key="scale" onPick={(v) => { setScale(v); setStep("q1"); }} />
          )}
          {step === "q1" && (
            <QuestionStep key="q1" q={QUESTIONS[0]} progressLabel="1 of 4"
              onAnswer={(v) => answer("standard", v, "q2")} />
          )}
          {step === "q2" && (
            <QuestionStep key="q2" q={QUESTIONS[1]} progressLabel="2 of 4"
              onAnswer={(v) => answer("line", v, "q3")} />
          )}
          {step === "q3" && (
            <QuestionStep key="q3" q={QUESTIONS[2]} progressLabel="3 of 4"
              onAnswer={(v) => answer("qa", v, "q4")} />
          )}
          {step === "q4" && (
            <QuestionStep key="q4" q={QUESTIONS[3]} progressLabel="4 of 4"
              onAnswer={(v) => answer("meter", v, "verdict")} />
          )}
          {step === "verdict" && copy && weakest && (
            <VerdictStep
              key="verdict"
              copy={copy}
              answers={answers}
              weakest={weakest}
              weakestLabel={weakestLabel ?? ""}
              email={email}
              onEmail={setEmail}
              submitted={submitted}
              onSubmit={handleEmail}
              onReset={reset}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>LIZA OS. Standards engineering for AI-native organizations.</span>
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
  transition: { duration: 0.3, ease: "easeOut" as const },
};

function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <motion.section {...fade} className="mx-auto max-w-3xl text-center">
      <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">FOR HEADS OF AI / DACH</p>
      <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
        Your CEO just promised AI results next quarter.
        <br />
        Can your operation actually ship them?
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        4 questions. 90 seconds. A verdict you can take into Monday&apos;s exec review.
      </p>
      <div className="mt-10">
        <Button size="lg" onClick={onStart} className="text-base px-8 h-12">
          Run the check <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        You leave with: a four-station diagram of your AI operation, the gap that breaks next, and a single 30-day move.
      </p>
    </motion.section>
  );
}

function ScaleStep({ onPick }: { onPick: (v: ScaleBand) => void }) {
  const options: { value: ScaleBand; label: string; sub: string }[] = [
    { value: "0-2", label: "0 to 2", sub: "Just starting." },
    { value: "3-9", label: "3 to 9", sub: "Real, but contained." },
    { value: "10+", label: "10 or more", sub: "Running at scale." },
  ];
  return (
    <motion.section {...fade} className="mx-auto max-w-3xl">
      <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">SCALE</p>
      <h2 className="mt-4 text-2xl md:text-4xl font-bold tracking-tight">
        Roughly how many AI workflows are live in your org today?
      </h2>
      <p className="mt-3 text-muted-foreground">
        Pick the closest number. You can be rough.
      </p>

      <div className="mt-8 grid gap-3">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onPick(o.value)}
            className="group flex items-center justify-between rounded-lg border border-border bg-background px-6 py-5 text-left transition-all hover:border-foreground hover:bg-accent"
          >
            <div>
              <div className="text-lg font-bold">{o.label}</div>
              <div className="text-sm text-muted-foreground">{o.sub}</div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
          </button>
        ))}
      </div>
    </motion.section>
  );
}

function QuestionStep({
  q, progressLabel, onAnswer,
}: {
  q: QuestionDef; progressLabel: string; onAnswer: (v: StationState) => void;
}) {
  return (
    <motion.section {...fade} className="mx-auto max-w-3xl">
      <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">
        STATION {q.n} / {q.title.toUpperCase()} / {progressLabel}
      </p>
      <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">{q.prompt}</h2>

      <div className="mt-8 grid gap-3">
        {q.options.map((o) => (
          <button
            key={o.value}
            onClick={() => onAnswer(o.value)}
            className="rounded-lg border border-border bg-background px-5 py-5 text-left transition-all hover:border-foreground hover:bg-accent"
          >
            <div className="text-sm font-bold">{o.label}</div>
          </button>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground italic max-w-2xl">{q.reframe}</p>
    </motion.section>
  );
}

function VerdictStep({
  copy, answers, weakest, weakestLabel, email, onEmail, submitted, onSubmit, onReset,
}: {
  copy: typeof VERDICT_COPY[VerdictState];
  answers: FactoryAnswers;
  weakest: StationKey;
  weakestLabel: string;
  email: string;
  onEmail: (v: string) => void;
  submitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}) {
  return (
    <motion.section {...fade} className="mx-auto max-w-5xl">
      {/* Block 1: THE LABEL */}
      <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">YOUR VERDICT</p>
      <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
        {copy.label}.{" "}
        <span className="text-destructive">Missing: {weakestLabel}.</span>{" "}
        <span className="text-foreground/70">Install in 30 days.</span>
      </h2>

      {/* Block 2: WHAT THIS MEANS */}
      <p className="mt-6 max-w-3xl text-lg text-foreground leading-snug">{copy.meaning}</p>

      {/* The diagram. Single payoff render. */}
      <div className="mt-10">
        <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold mb-3">
          YOUR OPERATION, TODAY
        </p>
        <FactoryDiagram answers={answers} weakest={weakest} size="lg" futureState />
      </div>

      {/* Block 3: WHAT BREAKS NEXT QUARTER */}
      <div className="mt-12">
        <p className="text-[10px] tracking-[0.3em] text-destructive font-bold mb-4">
          WHAT BREAKS NEXT QUARTER
        </p>
        <ul className="space-y-3 max-w-3xl">
          {copy.breaks.map((b, i) => (
            <li key={i} className="flex gap-4 text-base leading-snug">
              <span className="text-destructive font-bold tabular-nums">0{i + 1}</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Block 4: NEXT MOVE */}
      <div className="mt-12 rounded-lg border-2 border-foreground bg-background p-6 md:p-8">
        <p className="text-[10px] tracking-[0.3em] text-foreground font-bold">NEXT MOVE</p>
        <p className="mt-3 text-xl md:text-2xl font-bold leading-snug">{copy.nextMove}</p>
      </div>

      {/* Email gate */}
      <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-center rounded-lg border border-border bg-card p-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">THE BRIEF</p>
          <h3 className="mt-2 text-2xl font-bold">{copy.pdfTitle}</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            2 pages. The diagnosis, the named gap, and one template you can use without us. One PDF. No sequence.
          </p>
        </div>
        <div>
          {!submitted ? (
            <form onSubmit={onSubmit} className="flex gap-2">
              <Input
                type="email" required placeholder="work@company.com"
                value={email} onChange={(e) => onEmail(e.target.value)} className="h-12"
              />
              <Button type="submit" size="lg" className="h-12">Send PDF</Button>
            </form>
          ) : (
            <div className="flex items-center gap-3 rounded-md border border-foreground bg-accent px-4 py-3">
              <Check className="h-5 w-5" />
              <span className="text-sm font-medium">On its way. Check your inbox in a minute.</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 text-center">
        <button onClick={onReset} className="text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground">
          RUN AGAIN
        </button>
      </div>
    </motion.section>
  );
}
