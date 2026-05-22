import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

type Intake = { unit: string; scope: string; kpi: string };
type Turn = { question: string; label: string; helper?: string; answer: string };

type Brief = {
  title: string;
  the_unit_today: string;
  the_number: string;
  the_eighteen_month_picture: string[];
  the_three_moves: string[];
  the_trade_off: string;
  what_it_takes_underneath: string[];
};

type Step = "intro" | "intake" | "session" | "loading_question" | "generating_brief" | "brief";

const TOTAL_QUESTIONS = 5;

export default function TheBrief() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("intro");
  const [intake, setIntake] = useState<Intake>({ unit: "", scope: "", kpi: "" });
  const [turns, setTurns] = useState<Turn[]>([]);
  const [pendingQuestion, setPendingQuestion] = useState<{
    label: string;
    question: string;
    helper?: string;
  } | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [brief, setBrief] = useState<Brief | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const sessionRef = useRef<HTMLDivElement>(null);
  const briefRef = useRef<HTMLDivElement>(null);

  // Load shared brief by id
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from("briefs")
        .select("inputs, output")
        .eq("id", id)
        .maybeSingle();
      if (error || !data) {
        toast.error("Brief not found.");
        navigate("/the-brief", { replace: true });
        return;
      }
      const inputs = data.inputs as { intake: Intake; turns: Turn[] };
      setIntake(inputs.intake);
      setTurns(inputs.turns);
      setBrief(data.output as Brief);
      setSavedId(id);
      setStep("brief");
    })();
  }, [id, navigate]);

  const scrollTo = (el: HTMLElement | null) => {
    setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const startSession = async () => {
    if (!intake.unit.trim() || !intake.scope.trim() || !intake.kpi.trim()) {
      toast.error("Fill the three lines to start.");
      return;
    }
    setStep("loading_question");
    scrollTo(sessionRef.current);
    await fetchNextQuestion([]);
  };

  const fetchNextQuestion = async (history: Turn[]) => {
    try {
      const { data, error } = await supabase.functions.invoke("generate-brief", {
        body: {
          mode: "next_question",
          intake,
          history: history.map((t) => ({ question: t.question, answer: t.answer })),
        },
      });
      if (error) throw error;
      if (!data?.question) throw new Error("No question returned.");
      setPendingQuestion(data.question);
      setCurrentAnswer("");
      setStep("session");
      scrollTo(sessionRef.current);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Could not load the next question.");
      setStep(history.length === 0 ? "intake" : "session");
    }
  };

  const submitAnswer = async () => {
    if (!pendingQuestion) return;
    if (currentAnswer.trim().length < 10) {
      toast.error("Give it a real sentence.");
      return;
    }
    const newTurn: Turn = {
      label: pendingQuestion.label,
      question: pendingQuestion.question,
      helper: pendingQuestion.helper,
      answer: currentAnswer.trim(),
    };
    const nextTurns = [...turns, newTurn];
    setTurns(nextTurns);
    setPendingQuestion(null);
    setCurrentAnswer("");

    if (nextTurns.length >= TOTAL_QUESTIONS) {
      await generateBrief(nextTurns);
    } else {
      setStep("loading_question");
      await fetchNextQuestion(nextTurns);
    }
  };

  const generateBrief = async (finalTurns: Turn[]) => {
    setStep("generating_brief");
    scrollTo(briefRef.current);
    try {
      const { data, error } = await supabase.functions.invoke("generate-brief", {
        body: {
          mode: "final_brief",
          intake,
          history: finalTurns.map((t) => ({ question: t.question, answer: t.answer })),
        },
      });
      if (error) throw error;
      if (!data?.brief) throw new Error("No brief returned.");
      setBrief(data.brief);
      setStep("brief");
      setTimeout(() => scrollTo(briefRef.current), 100);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Could not write the brief. Try again.");
      setStep("session");
    }
  };

  const saveAndShare = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Add an email to save the brief.");
      return;
    }
    if (!brief) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("briefs")
        .insert({
          email,
          inputs: { intake, turns } as any,
          output: brief as any,
        })
        .select("id")
        .single();
      if (error) throw error;
      setSavedId(data.id);
      const url = `${window.location.origin}/the-brief/${data.id}`;
      await navigator.clipboard.writeText(url).catch(() => {});
      toast.success("Saved. Link copied to clipboard.");
      navigate(`/the-brief/${data.id}`, { replace: true });
    } catch (e: any) {
      console.error(e);
      toast.error("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const answeredCount = turns.length;
  const progressIndex = step === "session" || step === "loading_question" ? answeredCount : answeredCount;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Intro */}
      <section className="min-h-screen flex items-center px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">The Brief</div>
          <h1 className="text-4xl md:text-6xl font-light leading-[1.05] tracking-tight text-foreground mb-8">
            A working brief on the unit you actually run, for the next 18 months.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            Built for GMs and heads of business units who already run a private model of how the unit should
            work, and want it on the page.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-12 max-w-2xl">
            Ten minutes. Three intake lines, five questions shaped by what you say. One brief at the end you
            could hand to your boss.
          </p>
          {step === "intro" && (
            <Button
              size="lg"
              onClick={() => {
                setStep("intake");
                scrollTo(sessionRef.current);
              }}
              className="rounded-full px-8 h-12"
            >
              Start the session
            </Button>
          )}
          {step !== "intro" && (
            <div className="text-sm text-muted-foreground">
              {step === "brief" ? "Brief ready below." : "Scroll down."}
            </div>
          )}
        </div>
      </section>

      {/* Intake + Session */}
      {step !== "intro" && !id && step !== "brief" && step !== "generating_brief" && (
        <section
          ref={sessionRef}
          className="min-h-screen flex items-center px-6 md:px-12 border-t border-border/40"
        >
          <div className="max-w-3xl mx-auto w-full py-20">
            {step === "intake" && (
              <>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
                  Three lines to start
                </div>
                <h2 className="text-2xl md:text-4xl font-light leading-tight text-foreground mb-3">
                  Tell me what you run.
                </h2>
                <p className="text-sm text-muted-foreground mb-10">
                  Not the slide version. The version you would say in a room with two people.
                </p>

                <div className="space-y-8">
                  <IntakeField
                    label="Your unit"
                    helper="Region, product line, segment, BU. One line."
                    placeholder="EMEA mid-market. Or: the underwriting unit. Or: the cardiology product line."
                    value={intake.unit}
                    onChange={(v) => setIntake({ ...intake, unit: v })}
                  />
                  <IntakeField
                    label="Scope and size"
                    helper="Revenue, headcount, customers. Whatever frames it fastest."
                    placeholder="80M EUR, 220 people, 400 active accounts."
                    value={intake.scope}
                    onChange={(v) => setIntake({ ...intake, scope: v })}
                  />
                  <IntakeField
                    label="The number you are measured on"
                    helper="The one your boss tracks every quarter. Not a list."
                    placeholder="Net new ARR. Or: contribution margin. Or: on-time deliveries above 95%."
                    value={intake.kpi}
                    onChange={(v) => setIntake({ ...intake, kpi: v })}
                  />
                </div>

                <div className="flex items-center justify-end mt-10">
                  <Button onClick={startSession} className="rounded-full px-8">
                    Start the session
                  </Button>
                </div>
              </>
            )}

            {step === "loading_question" && (
              <div className="py-20">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
                  {answeredCount === 0 ? "Opening question" : "Next question"}
                </div>
                <div className="text-2xl font-light text-foreground mb-3">
                  {answeredCount === 0
                    ? "Reading your unit."
                    : "Reading what you just said."}
                </div>
                <div className="text-muted-foreground">A few seconds.</div>
                <div className="mt-10">
                  <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
                </div>
              </div>
            )}

            {step === "session" && pendingQuestion && (
              <>
                <div className="flex items-center justify-between mb-12">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {pendingQuestion.label}
                  </div>
                  <div className="text-xs text-muted-foreground tabular-nums">
                    {answeredCount + 1} of {TOTAL_QUESTIONS}
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-light leading-tight text-foreground mb-4">
                  {pendingQuestion.question}
                </h2>
                {pendingQuestion.helper && (
                  <p className="text-sm text-muted-foreground mb-8">{pendingQuestion.helper}</p>
                )}
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="min-h-[200px] text-base leading-relaxed resize-none bg-card border-border/60 focus-visible:ring-1"
                  placeholder="Say what you actually think. The more concrete, the sharper the brief."
                  autoFocus
                />
                <div className="flex items-center justify-between mt-8">
                  <div className="text-xs text-muted-foreground">
                    {turns.length > 0 && (
                      <span>
                        Last: <span className="text-foreground/70">{turns[turns.length - 1].label}</span>
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={submitAnswer}
                    disabled={currentAnswer.trim().length < 10}
                    className="rounded-full px-8"
                  >
                    {answeredCount + 1 === TOTAL_QUESTIONS ? "Write the brief" : "Next"}
                  </Button>
                </div>
                <div className="mt-10 flex gap-1">
                  {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 transition-colors ${
                        i <= progressIndex ? "bg-foreground/60" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Generating */}
      {step === "generating_brief" && (
        <section className="min-h-screen flex items-center px-6 md:px-12 border-t border-border/40">
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Writing the brief
            </div>
            <div className="text-2xl font-light text-foreground mb-3">
              Reading your five answers against your unit.
            </div>
            <div className="text-muted-foreground">About thirty seconds.</div>
            <div className="mt-12 flex justify-center">
              <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
            </div>
          </div>
        </section>
      )}

      {/* Brief */}
      {step === "brief" && brief && (
        <section
          ref={briefRef}
          className="px-6 md:px-12 border-t border-border/40 py-20 md:py-32"
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-10">
              The Brief
            </div>

            <article
              className="prose-brief"
              style={{ fontFamily: 'Georgia, "Iowan Old Style", "Apple Garamond", serif' }}
            >
              <h1 className="text-3xl md:text-4xl font-normal leading-tight text-foreground mb-12">
                {brief.title}
              </h1>

              <Section heading="The unit today">{brief.the_unit_today}</Section>
              <Section heading="The number">{brief.the_number}</Section>

              <SectionHeading>Eighteen months out</SectionHeading>
              <div className="space-y-6">
                {brief.the_eighteen_month_picture.map((p, i) => (
                  <p key={i} className="text-lg leading-[1.75] text-foreground">
                    {p}
                  </p>
                ))}
              </div>

              <SectionHeading>The three moves</SectionHeading>
              <ol className="space-y-5 list-none pl-0">
                {brief.the_three_moves.map((p, i) => (
                  <li key={i} className="text-lg leading-[1.75] text-foreground flex gap-4">
                    <span className="text-muted-foreground tabular-nums shrink-0 w-6">
                      {i + 1}.
                    </span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>

              <SectionHeading>The trade-off you are avoiding</SectionHeading>
              <p className="text-lg leading-[1.75] text-foreground">{brief.the_trade_off}</p>

              <SectionHeading>What it takes underneath</SectionHeading>
              <ul className="space-y-4 list-none pl-0">
                {brief.what_it_takes_underneath.map((p, i) => (
                  <li key={i} className="text-lg leading-[1.75] text-foreground flex gap-4">
                    <span className="text-muted-foreground shrink-0 w-6">·</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </article>

            {/* Handoff */}
            <div className="mt-24 pt-12 border-t border-border/40 font-sans">
              <p className="text-xl font-light text-foreground leading-snug mb-3">
                The brief points at a system underneath it. That system is what LIZA is.
              </p>
              <p className="text-muted-foreground mb-8">
                Defined context for the unit, captured standards from the people doing the work, one place
                that holds them and feeds every tool. The brief names the shape. LIZA is the build.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate("/")} variant="outline" className="rounded-full">
                  See LIZA
                </Button>
                {!savedId && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-64 rounded-full"
                    />
                    <Button onClick={saveAndShare} disabled={saving} className="rounded-full">
                      {saving ? "Saving" : "Save and share"}
                    </Button>
                  </div>
                )}
                {savedId && (
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      const url = `${window.location.origin}/the-brief/${savedId}`;
                      navigator.clipboard.writeText(url).catch(() => {});
                      toast.success("Link copied.");
                    }}
                  >
                    Copy share link
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function IntakeField({
  label,
  helper,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  helper: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">{label}</div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-card border-border/60 h-12 text-base"
      />
      <div className="text-xs text-muted-foreground mt-2">{helper}</div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-14 mb-5 font-sans font-medium">
      {children}
    </h2>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <>
      <SectionHeading>{heading}</SectionHeading>
      <p className="text-lg leading-[1.75] text-foreground">{children}</p>
    </>
  );
}