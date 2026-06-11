/**
 * /factory-floor — diagnostic landing page.
 *
 * Visual + copy contract:
 *   docs/factory-floor-copy.md
 *   docs/storyboards/factory-floor-v2.svg
 *
 * Council notes baked in:
 *  1. Cross-section (not 2x2). Horizontal production line.
 *  2. Progressive build — stations fill as user answers.
 *  3. Three-noun verdict line. Workshop. Missing: QA. Install in 30 days.
 *  4. Verdict-shift = Today + 6 months side-by-side, sequenced (~500ms beat).
 *  5. Leak drops on missing stations (irregular teardrops, not circles).
 *  6. Grid-paper background on every result surface.
 *  7. No black "VERDICT" bar — verdict lives inside the diagram surface.
 *  8. Email gate at the end only — no signup to start.
 *  9. Scene 0 (scale anchor) first. Drives State A/B/C.
 * 10. "AI task" language throughout (not "workflow" / "use case").
 * 11. Bonus number ("23 stations") emphasized as emotional spike in 6-month pane.
 */
import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
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

// ---------------------------------------------------------------------------
// Types & data
// ---------------------------------------------------------------------------

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
      "Pick one AI task running in your org today (or the first one you're about to run). Is there a written, agreed definition of what a good output looks like, that the AI is held to?",
    options: [
      { value: "yes", label: "Yes, written and used" },
      { value: "partial", label: "Sort of, in people's heads" },
      { value: "no", label: "No" },
    ],
    reframe:
      "Every factory starts with a spec sheet. Without one, every AI output is a craftsman's opinion, and every reviewer is grading on vibes.",
  },
  {
    key: "line", n: "02", title: "The Line",
    prompt: "When two different people run that same AI task, do they get the same shape of output?",
    options: [
      { value: "yes", label: "Yes, it's templated" },
      { value: "partial", label: "Roughly, depends on the person" },
      { value: "no", label: "No, every output looks different" },
    ],
    reframe:
      "A factory line produces the same part a thousand times. A workshop produces a thousand different parts. Workshops don't scale by hiring more craftsmen. They collapse.",
  },
  {
    key: "qa", n: "03", title: "The QA",
    prompt:
      "When that AI task produces a wrong or off-brand output, what catches it before it reaches a customer or decision?",
    options: [
      { value: "yes", label: "An automated check" },
      { value: "partial", label: "A human reviewer, every time" },
      { value: "no", label: "Whoever happens to notice" },
    ],
    reframe:
      "Factories ship at scale because QA runs in-line, not as heroics. If your only QA is someone noticing, your error rate is whatever your most tired employee allows.",
  },
  {
    key: "meter", n: "04", title: "The Meter",
    prompt:
      "For that AI task, do you know both what one output costs (model plus human time) and how often an output has to be redone?",
    options: [
      { value: "yes", label: "Yes, both" },
      { value: "partial", label: "One of them" },
      { value: "no", label: "Neither" },
    ],
    reframe:
      "Cost without rework is a half-truth. Rework without cost is a complaint. Together they're the only honest answer to: is this AI task working?",
  },
];

// ---------------------------------------------------------------------------
// Verdict engine
// ---------------------------------------------------------------------------

const VERDICT_COPY: Record<VerdictState, {
  headline: string;
  posture: string;
  diagnosis: string;
  futureScene: string;
  futureCount: string;
  futureDelta: string;
  nextMove: string;
  pdfTitle: string;
}> = {
  "pre-factory": {
    headline: "You're one hire away from the most expensive mistake of your AI program.",
    posture: "Pre-factory",
    diagnosis:
      "AI in your org is a few smart people doing impressive things by hand. That's the workshop stage, and it's the right stage for about six months. The trap is the next decision: most leaders respond to early wins by greenlighting more pilots and hiring more AI people. That's hiring more craftsmen for a workshop that has no spec sheet, no line, no QA, no meter. It doesn't scale. It multiplies the chaos.",
    futureScene:
      "A Monday in May. 12 AI initiatives live across 5 teams. No two produce output the same way. Three have quietly stopped. Your CFO asks what the cloud bill bought. You don't have an answer that survives the meeting.",
    futureCount: "12",
    futureDelta: "from 1",
    nextMove: "In the next 14 days, write one Standard for the first AI task you'll run. One page. Before any new pilot is greenlit.",
    pdfTitle: "The Pre-Factory Brief",
  },
  workshop: {
    headline: "You have a workshop. It's already bruising. You have months, not years, to install the line.",
    posture: "Workshop",
    diagnosis:
      "You're past the demo phase. AI is producing real work, used by real people, on real customer-facing surfaces. The cracks are appearing in the places cracks always appear in a workshop being asked to behave like a factory: outputs drift between users, review is a bottleneck, costs creep without a story, and you personally are the QA function. None of this is a tooling problem. It's structural. Goodwill expires the quarter after the CFO asks for unit economics.",
    futureScene:
      "A Monday in May. Your best AI task now runs 800 times a week. You're reviewing 30 percent of outputs personally because no one else can hold the bar. You stop a launch on Wednesday because two outputs went out wrong on Tuesday and you can't tell whether it's the model, the prompt, or the user. The CEO asks if AI is ready for the next department. You hedge.",
    futureCount: "800/wk",
    futureDelta: "from 60/wk",
    nextMove: "In the next 30 days, pick your highest-volume AI task. Install one automated check. One task, one check. That's how the line begins.",
    pdfTitle: "The Workshop Brief",
  },
  "workshop-at-scale": {
    headline: "You are running a factory with no Standard, no QA, no Meter. The cost is compounding monthly.",
    posture: "Workshop at scale",
    diagnosis:
      "You have ten or more AI tasks live, hundreds of people using them, and a monthly spend that shows up on the CFO's radar. The structure underneath has not kept up. Every new initiative inherits the missing structure and compounds the rework. The right move is not another pilot. The right move is to stop launching, install the Meter first so you can see the bleeding, and only then rebuild the line.",
    futureScene:
      "A Monday in May. A board member asks for the ROI of your AI program. 23 tasks live, no defensible number for any of them. The CTO has started routing around you. Two of your best AI engineers have left because no one knows what good looks like here.",
    futureCount: "23",
    futureDelta: "from 12",
    nextMove: "In the next 30 days, stop launching new AI tasks. Install the Meter on your top 3 by spend. You cannot fix what you cannot see.",
    pdfTitle: "The Workshop-at-Scale Brief",
  },
};

function pickVerdictState(scale: ScaleBand): VerdictState {
  if (scale === "0-2") return "pre-factory";
  if (scale === "3-9") return "workshop";
  return "workshop-at-scale";
}

function pickWeakest(answers: FactoryAnswers, state: VerdictState): StationKey | null {
  // Workshop-at-scale forces Meter first (per copy doc).
  if (state === "workshop-at-scale") return "meter";
  // Otherwise rank by missing > partial > yes, in factory order.
  const order: StationKey[] = ["standard", "line", "qa", "meter"];
  const score = (s: StationState) => (s === "no" ? 0 : s === "partial" ? 1 : 2);
  const sorted = [...order].sort((a, b) => score(answers[a]) - score(answers[b]));
  return sorted[0] ?? null;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

type Step = "intro" | "scale" | "q1" | "q2" | "q3" | "q4" | "verdict";

export default function FactoryFloor() {
  const [step, setStep] = useState<Step>("intro");
  const [scale, setScale] = useState<ScaleBand | null>(null);
  const [answers, setAnswers] = useState<FactoryAnswers>(EMPTY_ANSWERS);
  const [showFuture, setShowFuture] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const verdictState = useMemo(() => (scale ? pickVerdictState(scale) : null), [scale]);
  const weakest = useMemo(
    () => (verdictState ? pickWeakest(answers, verdictState) : null),
    [answers, verdictState],
  );
  const copy = verdictState ? VERDICT_COPY[verdictState] : null;
  const weakestLabel = weakest
    ? QUESTIONS.find((q) => q.key === weakest)?.title.replace("The ", "")
    : "";

  // ----- handlers -----
  function answer(key: StationKey, value: StationState, nextStep: Step) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep(nextStep);
    if (nextStep === "verdict") {
      // Reveal "Today" first, then "6 months" after the council's ~500ms beat.
      setShowFuture(false);
      window.setTimeout(() => setShowFuture(true), 700);
    }
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
    setShowFuture(false);
    setEmail("");
    setSubmitted(false);
  }

  const progress = (() => {
    const order: Step[] = ["intro", "scale", "q1", "q2", "q3", "q4", "verdict"];
    return Math.round((order.indexOf(step) / (order.length - 1)) * 100);
  })();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Factory Floor — workshop or factory? A 90-second AI diagnostic.</title>
        <meta
          name="description"
          content="4 questions. 90 seconds. See whether your AI operation is a workshop or a factory, and what's missing to scale it."
        />
        <link rel="canonical" href="https://lizaos.ai/factory-floor" />
        <meta property="og:title" content="Workshop or factory? A 90-second AI diagnostic." />
        <meta
          property="og:description"
          content="Most orgs scale AI like a craft workshop. See what's missing to run it like a factory floor."
        />
        <meta property="og:url" content="https://lizaos.ai/factory-floor" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Top progress strip */}
      <div className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <a href="/" className="text-xs tracking-[0.2em] font-bold text-foreground">LIZA OS</a>
          <div className="text-[10px] tracking-[0.2em] text-muted-foreground">FACTORY FLOOR / DIAGNOSTIC</div>
        </div>
        <div className="h-[2px] w-full bg-muted">
          <motion.div
            className="h-full bg-foreground"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {step === "intro" && <IntroStep key="intro" onStart={() => setStep("scale")} />}

          {step === "scale" && (
            <ScaleStep
              key="scale"
              onPick={(v) => {
                setScale(v);
                setStep("q1");
              }}
            />
          )}

          {step === "q1" && (
            <QuestionStep key="q1" q={QUESTIONS[0]} progressLabel="1 of 4" answers={answers} weakest={weakest}
              onAnswer={(v) => answer("standard", v, "q2")} />
          )}
          {step === "q2" && (
            <QuestionStep key="q2" q={QUESTIONS[1]} progressLabel="2 of 4" answers={answers} weakest={weakest}
              onAnswer={(v) => answer("line", v, "q3")} />
          )}
          {step === "q3" && (
            <QuestionStep key="q3" q={QUESTIONS[2]} progressLabel="3 of 4" answers={answers} weakest={weakest}
              onAnswer={(v) => answer("qa", v, "q4")} />
          )}
          {step === "q4" && (
            <QuestionStep key="q4" q={QUESTIONS[3]} progressLabel="4 of 4" answers={answers} weakest={weakest}
              onAnswer={(v) => answer("meter", v, "verdict")} />
          )}

          {step === "verdict" && copy && weakest && (
            <VerdictStep
              key="verdict"
              copy={copy}
              answers={answers}
              weakest={weakest}
              weakestLabel={weakestLabel ?? ""}
              showFuture={showFuture}
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
          <span>LIZA OS — Standards engineering for AI-native organizations.</span>
          <a href="/" className="hover:text-foreground">lizaos.ai</a>
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

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
        You're running AI like a craft workshop.
        <br />
        Scaling needs a factory floor.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        4 questions. 90 seconds. A verdict you can show your CEO on Monday. No email, no signup to start.
      </p>
      <div className="mt-10">
        <Button size="lg" onClick={onStart} className="text-base px-8 h-12">
          Run the check <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        What you'll leave with: a four-station diagram of your AI operation, named gaps, and a single next move.
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
      <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">SCALE / ASKED FIRST</p>
      <h2 className="mt-4 text-2xl md:text-4xl font-bold tracking-tight">
        Roughly how many AI tasks are live in your org today?
      </h2>
      <p className="mt-3 text-muted-foreground">
        This sets the posture of the verdict. The next four answers decide which gap gets named.
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
  q,
  progressLabel,
  answers,
  weakest,
  onAnswer,
}: {
  q: QuestionDef;
  progressLabel: string;
  answers: FactoryAnswers;
  weakest: StationKey | null;
  onAnswer: (v: StationState) => void;
}) {
  return (
    <motion.section {...fade} className="mx-auto max-w-4xl">
      <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">
        STATION {q.n} / {q.title.toUpperCase()} — {progressLabel}
      </p>
      <h2 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">{q.prompt}</h2>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
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

      <div className="mt-10">
        <FactoryDiagram answers={answers} weakest={weakest} size="lg" />
      </div>
    </motion.section>
  );
}

function VerdictStep({
  copy,
  answers,
  weakest,
  weakestLabel,
  showFuture,
  email,
  onEmail,
  submitted,
  onSubmit,
  onReset,
}: {
  copy: typeof VERDICT_COPY[VerdictState];
  answers: FactoryAnswers;
  weakest: StationKey;
  weakestLabel: string;
  showFuture: boolean;
  email: string;
  onEmail: (v: string) => void;
  submitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}) {
  return (
    <motion.section {...fade} className="mx-auto max-w-6xl">
      {/* Three-noun verdict line (council note 4) */}
      <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">YOUR VERDICT</p>
      <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight leading-[1.1]">
        {copy.posture}.{" "}
        <span className="text-destructive">Missing: {weakestLabel}.</span>{" "}
        <span className="text-foreground/70">Install in 30 days.</span>
      </h2>

      <p className="mt-6 max-w-3xl text-lg text-foreground">{copy.headline}</p>
      <p className="mt-4 max-w-3xl text-base text-muted-foreground leading-relaxed">{copy.diagnosis}</p>

      {/* Verdict-shift: Today vs Monday in 6 months */}
      <div className="mt-12 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
        {/* Today */}
        <div>
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold mb-3">TODAY</p>
          <FactoryDiagram answers={answers} weakest={weakest} size="md" />
        </div>

        {/* Arrow / 6 months */}
        <div className="flex flex-col items-center text-center px-2">
          <div className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">6 MONTHS</div>
          <div className="text-[10px] tracking-[0.3em] text-muted-foreground">NO CHANGE</div>
          <ArrowRight className="my-2 h-10 w-10 text-foreground" />
        </div>

        {/* 6 months */}
        <AnimatePresence>
          {showFuture && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex items-baseline justify-between mb-3">
                <p className="text-[10px] tracking-[0.3em] text-destructive font-bold">MONDAY IN 6 MONTHS</p>
                <div className="text-right">
                  <div className="text-2xl font-bold text-destructive leading-none">{copy.futureCount}</div>
                  <div className="text-[10px] tracking-wide text-muted-foreground">{copy.futureDelta}</div>
                </div>
              </div>
              <FactoryDiagram answers={answers} weakest={weakest} size="md" futureState />
              <p className="mt-3 text-sm text-foreground/80 italic leading-relaxed">{copy.futureScene}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Next move */}
      <div className="mt-14 rounded-lg border-2 border-foreground bg-background p-8">
        <p className="text-[10px] tracking-[0.3em] text-foreground font-bold">NEXT MOVE</p>
        <p className="mt-3 text-xl md:text-2xl font-bold leading-snug">{copy.nextMove}</p>
      </div>

      {/* Email gate */}
      <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-center rounded-lg border border-border bg-card p-8">
        <div>
          <p className="text-[10px] tracking-[0.3em] text-muted-foreground font-bold">THE BRIEF</p>
          <h3 className="mt-2 text-2xl font-bold">{copy.pdfTitle}</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            2 pages. Diagnosis, the named gap, and one template you can use without us. Drop your work email. One PDF. No sequence, no nurture.
          </p>
        </div>
        <div>
          {!submitted ? (
            <form onSubmit={onSubmit} className="flex gap-2">
              <Input
                type="email"
                required
                placeholder="work@company.com"
                value={email}
                onChange={(e) => onEmail(e.target.value)}
                className="h-12"
              />
              <Button type="submit" size="lg" className="h-12">
                Send PDF
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-3 rounded-md border border-foreground bg-accent px-4 py-3">
              <Check className="h-5 w-5" />
              <span className="text-sm font-medium">
                On its way. Check your inbox in a minute.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Reset */}
      <div className="mt-10 text-center">
        <button onClick={onReset} className="text-xs tracking-[0.2em] text-muted-foreground hover:text-foreground">
          RUN AGAIN
        </button>
      </div>
    </motion.section>
  );
}