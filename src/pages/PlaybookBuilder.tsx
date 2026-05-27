import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, Check, ArrowRight, RotateCcw, ShieldCheck, MessageSquare, FileCode2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AaceRail } from "@/components/playbook/AaceRail";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  STEPS,
  type Answers,
  type Step,
  type StepId,
  compilePlaybook,
} from "@/components/playbook/aace-builder";

type Turn =
  | { kind: "ai"; text: string; stepId?: StepId }
  | { kind: "user"; text: string }
  | { kind: "ai-summary"; answers: Answers };

function initialTurns(): Turn[] {
  return [
    {
      kind: "ai",
      text:
        "Hi — I'll help you stand up a playbook in about a minute. I'll ask a few short questions. Tap an option, or type if you'd rather.",
    },
    { kind: "ai", text: STEPS[0].prompt, stepId: STEPS[0].id },
  ];
}

export default function PlaybookBuilder() {
  const [turns, setTurns] = useState<Turn[]>(initialTurns);
  const [answers, setAnswers] = useState<Answers>({});
  const [stepIdx, setStepIdx] = useState(0);
  const [draft, setDraft] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [phase, setPhase] = useState<"flow" | "ready" | "testdrive">("flow");
  const [testDraft, setTestDraft] = useState("");
  const [tab, setTab] = useState<"chat" | "playbook">("chat");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const compiledPrompt = useMemo(() => compilePlaybook(answers), [answers]);

  const currentStep: Step | null = phase === "flow" && stepIdx < STEPS.length ? STEPS[stepIdx] : null;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns.length, phase]);

  // Reset chip selection on each new step
  useEffect(() => {
    setSelected([]);
    setDraft("");
  }, [stepIdx, phase]);

  const toggleChip = (opt: string) => {
    if (!currentStep) return;
    if (currentStep.multi) {
      setSelected((s) => (s.includes(opt) ? s.filter((x) => x !== opt) : [...s, opt]));
    } else {
      setSelected([opt]);
    }
  };

  const submitStep = (override?: string[]) => {
    if (!currentStep) return;
    const typed = draft.trim();
    const values = override ?? (typed ? [...selected, typed] : selected);
    if (values.length === 0) return;

    const userText = values.join(", ");
    const nextAnswers: Answers = { ...answers, [currentStep.id]: values };
    setAnswers(nextAnswers);

    const nextIdx = stepIdx + 1;
    const nextTurns: Turn[] = [
      ...turns,
      { kind: "user", text: userText },
    ];

    if (nextIdx < STEPS.length) {
      const ack = ackFor(currentStep.id, values);
      nextTurns.push({ kind: "ai", text: ack });
      nextTurns.push({ kind: "ai", text: STEPS[nextIdx].prompt, stepId: STEPS[nextIdx].id });
      setStepIdx(nextIdx);
    } else {
      nextTurns.push({ kind: "ai-summary", answers: nextAnswers });
      setPhase("ready");
    }
    setTurns(nextTurns);
  };

  const skipStep = () => {
    if (!currentStep) return;
    const nextIdx = stepIdx + 1;
    const nextTurns: Turn[] = [
      ...turns,
      { kind: "user", text: "Skip for now" },
    ];
    if (nextIdx < STEPS.length) {
      nextTurns.push({ kind: "ai", text: STEPS[nextIdx].prompt, stepId: STEPS[nextIdx].id });
      setStepIdx(nextIdx);
    } else {
      nextTurns.push({ kind: "ai-summary", answers });
      setPhase("ready");
    }
    setTurns(nextTurns);
  };

  const startTestDrive = () => {
    setTurns((t) => [
      ...t,
      {
        kind: "ai",
        text:
          "Playbook live. Try asking me to do the thing it was built for — I'll respond inside the standards, compliance, and voice you set.",
      },
    ]);
    setPhase("testdrive");
  };

  const sendTestMessage = async () => {
    const t = testDraft.trim();
    if (!t || sending) return;
    const history = turns
      .filter((x): x is { kind: "ai" | "user"; text: string } => x.kind === "ai" || x.kind === "user")
      .map((x) => ({ role: x.kind === "ai" ? "assistant" : "user", content: x.text }));
    setTurns((prev) => [...prev, { kind: "user", text: t }]);
    setTestDraft("");
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("playbook-chat", {
        body: {
          systemPrompt: compiledPrompt,
          messages: [...history, { role: "user", content: t }],
        },
      });
      if (error) throw error;
      const reply = (data as { reply?: string })?.reply ?? "(no response)";
      setTurns((prev) => [...prev, { kind: "ai", text: reply }]);
    } catch (e: any) {
      toast({ title: "Playbook run failed", description: e?.message ?? String(e), variant: "destructive" });
      setTurns((prev) => [...prev, { kind: "ai", text: "⚠️ Couldn't reach the model. Try again." }]);
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setTurns(initialTurns());
    setAnswers({});
    setStepIdx(0);
    setDraft("");
    setSelected([]);
    setPhase("flow");
    setTestDraft("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-12 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="h-8 -ml-2">
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-1" /> Home</Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-sm font-semibold">Playbook Builder</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground rounded border px-1.5 py-0.5">
              AACE
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {phase !== "flow" && (
            <div className="flex items-center rounded-md border p-0.5">
              <button
                onClick={() => setTab("chat")}
                className={`text-xs px-2 py-1 rounded ${tab === "chat" ? "bg-muted font-medium" : "text-muted-foreground"}`}
              >
                <MessageSquare className="h-3 w-3 inline mr-1" /> Chat
              </button>
              <button
                onClick={() => setTab("playbook")}
                className={`text-xs px-2 py-1 rounded ${tab === "playbook" ? "bg-muted font-medium" : "text-muted-foreground"}`}
              >
                <FileCode2 className="h-3 w-3 inline mr-1" /> Playbook
              </button>
            </div>
          )}
          {phase !== "flow" && (
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={reset}>
              <RotateCcw className="h-3 w-3 mr-1" /> Restart
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <section className="flex flex-1 flex-col min-w-0">
          {tab === "playbook" && phase !== "flow" ? (
            <PlaybookView prompt={compiledPrompt} />
          ) : (
          <>
          <div ref={scrollRef} className="flex-1 overflow-auto px-6 py-6">
            <div className="mx-auto max-w-2xl space-y-4">
              {turns.map((t, i) =>
                t.kind === "ai-summary" ? (
                  <SummaryCard
                    key={i}
                    answers={t.answers}
                    onTestDrive={startTestDrive}
                    isActive={phase === "ready"}
                  />
                ) : (
                  <ChatBubble key={i} role={t.kind} text={t.text} />
                ),
              )}
              {sending && (
                <div className="flex gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                  </div>
                  <div className="pt-1 text-sm text-muted-foreground">Running playbook…</div>
                </div>
              )}
            </div>
          </div>

          {/* Composer */}
          <div className="border-t bg-background/80 p-4">
            <div className="mx-auto max-w-2xl">
              {phase === "flow" && currentStep ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {currentStep.options.map((opt) => {
                      const on = selected.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            if (currentStep.multi) toggleChip(opt);
                            else submitStep([opt]);
                          }}
                          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                            on
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card hover:bg-muted border-border"
                          }`}
                        >
                          {on && <Check className="inline w-3 h-3 mr-1 -mt-0.5" />}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <div className="rounded-lg border bg-card p-2">
                    <Textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault();
                          submitStep();
                        }
                      }}
                      rows={2}
                      placeholder="…or type your own answer (optional)"
                      className="border-0 shadow-none focus-visible:ring-0 resize-none p-2 text-sm"
                    />
                    <div className="flex items-center justify-between px-1 pt-1">
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>Step {stepIdx + 1} of {STEPS.length}</span>
                        <span>·</span>
                        <button onClick={skipStep} className="hover:text-foreground underline underline-offset-2">
                          Skip
                        </button>
                      </div>
                      <Button
                        size="sm"
                        className="h-7"
                        onClick={() => submitStep()}
                        disabled={selected.length === 0 && !draft.trim()}
                      >
                        {currentStep.multi || draft.trim() ? "Continue" : "Continue"}
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : phase === "testdrive" ? (
                <div className="rounded-lg border bg-card p-2">
                  <Textarea
                    value={testDraft}
                    onChange={(e) => setTestDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        sendTestMessage();
                      }
                    }}
                    rows={2}
                    placeholder="Test-drive your playbook. Ask it to do the thing it was built for."
                    className="border-0 shadow-none focus-visible:ring-0 resize-none p-2 text-sm"
                  />
                  <div className="flex items-center justify-between px-1 pt-1">
                    <span className="text-[11px] text-muted-foreground">Cmd/Ctrl + Enter to send</span>
                    <Button size="sm" className="h-7" onClick={sendTestMessage} disabled={!testDraft.trim() || sending}>
                      <Send className="h-3.5 w-3.5 mr-1.5" /> Send
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs text-muted-foreground">
                  Playbook compiled. Hit "Test drive" above to try it.
                </div>
              )}
            </div>
          </div>
          </>
          )}
        </section>

        <AaceRail answers={answers} />
      </div>
    </div>
  );
}

function PlaybookView({ prompt }: { prompt: string }) {
  const copy = () => {
    navigator.clipboard.writeText(prompt);
    toast({ title: "Copied", description: "Compiled playbook copied to clipboard." });
  };
  return (
    <div className="flex-1 overflow-auto px-6 py-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold">Compiled playbook</h2>
            <p className="text-xs text-muted-foreground">This is the AACE system prompt the model runs under during test-drive.</p>
          </div>
          <Button size="sm" variant="outline" className="h-7" onClick={copy}>
            <Copy className="h-3 w-3 mr-1.5" /> Copy
          </Button>
        </div>
        <pre className="rounded-lg border bg-muted/40 p-4 text-xs leading-relaxed whitespace-pre-wrap font-mono">
          {prompt}
        </pre>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Subviews
// ────────────────────────────────────────────────────────────────────────────

function ChatBubble({ role, text }: { role: "ai" | "user"; text: string }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="max-w-[80%] pt-1">
        <p className="text-sm leading-relaxed text-foreground">{text}</p>
      </div>
    </div>
  );
}

function SummaryCard({
  answers,
  onTestDrive,
  isActive,
}: {
  answers: Answers;
  onTestDrive: () => void;
  isActive: boolean;
}) {
  return (
    <div className="flex gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 max-w-[80%]">
        <p className="text-sm leading-relaxed mb-3">
          Your playbook is compiled. The right rail shows what's defined and what would still be set inside LIZA.
        </p>
        <div className="rounded-xl border bg-card p-4 space-y-2">
          {STEPS.filter((s) => s.pillar).map((s) => {
            const v = answers[s.id];
            if (!v || v.length === 0) {
              return (
                <div key={s.id} className="flex items-start justify-between text-xs">
                  <span className="text-muted-foreground">{labelFor(s.id)}</span>
                  <span className="text-muted-foreground/60 italic">— skipped</span>
                </div>
              );
            }
            return (
              <div key={s.id} className="flex items-start justify-between gap-3 text-xs">
                <span className="text-muted-foreground shrink-0">{labelFor(s.id)}</span>
                <span className="text-right text-foreground font-medium">{v.join(", ")}</span>
              </div>
            );
          })}
        </div>
        {isActive && (
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" onClick={onTestDrive}>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Test drive
            </Button>
            <Button size="sm" variant="ghost" asChild className="text-xs">
              <Link to="/sanctioned">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Sanction later in LIZA
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Copy helpers
// ────────────────────────────────────────────────────────────────────────────

function labelFor(id: StepId): string {
  switch (id) {
    case "playbook": return "Procedure";
    case "intent": return "Strategic intent";
    case "standards": return "Standards";
    case "directives": return "Compliance";
    case "knowledge": return "Knowledge";
    case "preference": return "Voice & format";
    default: return id;
  }
}

function ackFor(id: StepId, values: string[]): string {
  const v = values.join(", ");
  switch (id) {
    case "department": return `Got it — ${v}.`;
    case "role": return `Thanks. Setting this up at your level.`;
    case "playbook": return `Locked. Procedure: ${v}.`;
    case "intent": return `Anchored to ${v}.`;
    case "standards": return values.length ? `Standards attached: ${v}.` : "Noted.";
    case "directives": return v.toLowerCase().includes("none")
      ? "No hard directives. The playbook will rely on standards alone."
      : `Directive in place: ${v}. The playbook will refuse to break these.`;
    case "knowledge": return `Reading from ${v}.`;
    case "preference": return `Voice set. ${v}.`;
  }
}
