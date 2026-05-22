import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Loader2,
  Sparkles,
  Wrench,
  AlertTriangle,
  Eye,
  Check,
  Share2,
  RotateCcw,
} from "lucide-react";
import { OperatingGrid, type GridState, type GridStatus } from "@/components/brief/OperatingGrid";
import { TEAM_PROFILES, TEAM_BY_ID, type TeamId } from "@/lib/team-profiles";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

type Diagnosis = {
  title: string;
  current_model_read: string;
  tool_limitations: { tool: string; limitation: string }[];
  grid_status: {
    intent: { status: GridStatus; why: string };
    knowledge: { status: GridStatus; why: string };
    execution: { status: GridStatus; why: string };
  };
  blind_spots: { title: string; why: string }[];
  correction: { move: string; scope: string; liza_capability: string };
};

type Inputs = {
  team: TeamId | null;
  use_cases: string[];
  goal: string;
  tools: string[];
  limitations: string[];
  free_text: string;
};

type Phase = "input" | "diagnosing" | "result";

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs md:text-sm font-medium px-3 py-1.5 rounded-full border transition-all"
      style={{
        background: selected ? "hsl(var(--primary))" : "hsl(var(--card))",
        color: selected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
        borderColor: selected ? "hsl(var(--primary))" : "hsl(var(--border))",
      }}
    >
      {selected ? <Check className="inline w-3 h-3 mr-1 -mt-0.5" /> : null}
      {label}
    </button>
  );
}

function fallbackDiagnosis(inputs: Inputs): Diagnosis {
  const tools = inputs.tools.length ? inputs.tools : ["a mixed set of consumer AI tools"];
  return {
    title: "Your AI operating model today",
    current_model_read: `You are trying to ${inputs.goal.toLowerCase()}. Today the work runs through ${tools.join(", ")} sitting on top of individual judgement. There is no shared layer between what you want and what the tools produce, so every output starts from a blank slate.`,
    tool_limitations: inputs.tools.map((tool) => ({
      tool,
      limitation: "No persistent context, no enforced standard, every session restarts.",
    })),
    grid_status: {
      intent: {
        status: inputs.goal ? "working" : "missing",
        why: "You know what you want. The goal is stated.",
      },
      knowledge: {
        status: "missing",
        why: "There is no executable knowledge layer between your intent and the tools. Standards, decisions, and policies live in heads and scattered docs.",
      },
      execution: {
        status: inputs.tools.length ? "partial" : "missing",
        why: inputs.tools.length
          ? "Tools are deployed but each one operates on its own context."
          : "No tools in place yet.",
      },
    },
    blind_spots: [
      {
        title: "Every tool is reinventing your standard",
        why: "Without one place to publish decision logic, each tool guesses. The cost shows up as inconsistency, not error.",
      },
      {
        title: "Nothing compounds",
        why: "Good prompts and good answers leave with the person who wrote them. The next user starts from zero.",
      },
    ],
    correction: {
      move: "Publish your operating standards as an executable knowledge layer that every AI surface reads from.",
      scope: "Two to four weeks. One owner. One bundle that covers your three highest-value decisions.",
      liza_capability: "LIZA knowledge layer plus context bundles wired into the tools you already use.",
    },
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────

export default function TheBrief() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("input");
  const [inputs, setInputs] = useState<Inputs>({
    team: null,
    use_cases: [],
    goal: "",
    tools: [],
    limitations: [],
    free_text: "",
  });
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  // Load existing diagnosis from URL
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from("briefs")
        .select("inputs, output")
        .eq("id", id)
        .maybeSingle();
      if (error || !data?.output) {
        toast.error("Diagnosis not found.");
        navigate("/the-brief", { replace: true });
        return;
      }
      setInputs(data.inputs as unknown as Inputs);
      setDiagnosis(data.output as unknown as Diagnosis);
      setSavedId(id);
      setPhase("result");
    })();
  }, [id, navigate]);

  const toggle = (key: "tools" | "limitations" | "use_cases", value: string) => {
    setInputs((p) => ({
      ...p,
      [key]: p[key].includes(value)
        ? p[key].filter((x) => x !== value)
        : [...p[key], value],
    }));
  };

  const canSubmit =
    !!inputs.team && (inputs.use_cases.length > 0 || inputs.goal.trim().length > 10);

  const runDiagnosis = async () => {
    if (!canSubmit) {
      toast.error("Pick your team and at least one use case to continue.");
      return;
    }
    setPhase("diagnosing");
    try {
      const team = inputs.team ? TEAM_BY_ID[inputs.team] : null;
      const derivedGoal =
        inputs.goal.trim() ||
        (team
          ? `Help our ${team.label} team with: ${inputs.use_cases.join("; ")}.`
          : inputs.use_cases.join("; "));
      const { data, error } = await supabase.functions.invoke("generate-brief", {
        body: {
          team: team?.label || null,
          team_sub: team?.sub || null,
          use_cases: inputs.use_cases,
          goal: derivedGoal,
          tools: inputs.tools,
          limitations: inputs.limitations,
          free_text: inputs.free_text,
        },
      });
      let result: Diagnosis;
      if (error || !data?.diagnosis) {
        console.warn("AI diagnosis unavailable, using fallback:", error);
        result = fallbackDiagnosis(inputs);
      } else {
        result = data.diagnosis as Diagnosis;
      }
      setDiagnosis(result);
      setPhase("result");
    } catch (e) {
      console.error(e);
      setDiagnosis(fallbackDiagnosis(inputs));
      setPhase("result");
    }
  };

  const saveAndShare = async () => {
    if (!diagnosis) return;
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      toast.error("Enter a work email to save.");
      return;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("briefs")
        .insert({
          email,
          inputs: inputs as unknown as Json,
          output: diagnosis as unknown as Json,
        })
        .select("id")
        .single();
      if (error) throw error;
      setSavedId(data.id);
      navigate(`/the-brief/${data.id}`, { replace: true });
      toast.success("Diagnosis saved. Link is shareable.");
    } catch (e) {
      console.error(e);
      toast.error("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setDiagnosis(null);
    setSavedId(null);
    setEmail("");
    setPhase("input");
    setInputs({ team: null, use_cases: [], goal: "", tools: [], limitations: [], free_text: "" });
    navigate("/the-brief", { replace: true });
  };

  const gridState: GridState | null = diagnosis
    ? {
        goal:
          inputs.goal ||
          (inputs.team
            ? `${TEAM_BY_ID[inputs.team].label} team: ${inputs.use_cases.slice(0, 3).join(", ")}`
            : ""),
        tools: inputs.tools,
        ...diagnosis.grid_status,
      }
    : null;

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <header className="mb-10 md:mb-14">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Liza
          </Link>
          <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight">
            The Brief
          </h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl">
            Tell us what you are trying to achieve with AI and what is breaking
            today. Get back a read on your operating model and the one move that
            closes the gap.
          </p>
        </header>

        {phase === "input" && (
          <InputView
            inputs={inputs}
            setInputs={setInputs}
            toggle={toggle}
            canSubmit={canSubmit}
            onSubmit={runDiagnosis}
          />
        )}

        {phase === "diagnosing" && <DiagnosingView />}

        {phase === "result" && diagnosis && gridState && (
          <ResultView
            diagnosis={diagnosis}
            gridState={gridState}
            savedId={savedId}
            email={email}
            setEmail={setEmail}
            saving={saving}
            onSave={saveAndShare}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-views
// ────────────────────────────────────────────────────────────────────────────

function InputView({
  inputs,
  setInputs,
  toggle,
  canSubmit,
  onSubmit,
}: {
  inputs: Inputs;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  toggle: (key: "tools" | "limitations" | "use_cases", value: string) => void;
  canSubmit: boolean;
  onSubmit: () => void;
}) {
  const team = inputs.team ? TEAM_BY_ID[inputs.team] : null;
  const [showGoal, setShowGoal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Step 1 — Team */}
      <section
        className="rounded-2xl border p-6 md:p-8"
        style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
      >
        <StepHeader n={1} title="Which team are you running?" />
        <p className="text-sm text-muted-foreground mb-4">
          We tailor the next questions to your team. Pick the closest fit.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {TEAM_PROFILES.map((t) => {
            const selected = inputs.team === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setInputs((p) => ({
                    ...p,
                    team: t.id,
                    // reset downstream selections when switching team
                    use_cases: p.team === t.id ? p.use_cases : [],
                    tools: p.team === t.id ? p.tools : [],
                    limitations: p.team === t.id ? p.limitations : [],
                  }));
                }}
                className="text-left rounded-xl border p-3 transition-all"
                style={{
                  background: selected ? "hsl(var(--primary) / 0.08)" : "hsl(var(--card))",
                  borderColor: selected ? "hsl(var(--primary))" : "hsl(var(--border))",
                  boxShadow: selected ? "0 0 0 1px hsl(var(--primary))" : "none",
                }}
              >
                <p className="text-sm font-bold">{t.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{t.sub}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Subsequent steps appear only after team is picked */}
      {team && (
        <>
          {/* Step 2 — Use cases */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border p-6 md:p-8"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
          >
            <StepHeader n={2} title={`What is your ${team.label} team using AI for?`} />
            <p className="text-sm text-muted-foreground mb-4">
              Pick the use cases that apply. These are the typical ones for {team.label}.
            </p>
            <div className="flex flex-wrap gap-2">
              {team.use_cases.map((u) => (
                <Chip
                  key={u}
                  label={u}
                  selected={inputs.use_cases.includes(u)}
                  onClick={() => toggle("use_cases", u)}
                />
              ))}
            </div>
          </motion.section>

          {/* Step 3 — Tools */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border p-6 md:p-8"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
          >
            <StepHeader n={3} title="Which tools are in use today?" />
            <p className="text-sm text-muted-foreground mb-4">
              The usual stack for {team.label}. Pick all that apply.
            </p>
            <div className="flex flex-wrap gap-2">
              {team.tools.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  selected={inputs.tools.includes(t)}
                  onClick={() => toggle("tools", t)}
                />
              ))}
            </div>
          </motion.section>

          {/* Step 4 — Limitations */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border p-6 md:p-8"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
          >
            <StepHeader n={4} title="Where is it falling short?" />
            <p className="text-sm text-muted-foreground mb-4">
              The shortcomings we see most often for {team.label} teams.
            </p>
            <div className="flex flex-wrap gap-2">
              {team.limitations.map((l) => (
                <Chip
                  key={l}
                  label={l}
                  selected={inputs.limitations.includes(l)}
                  onClick={() => toggle("limitations", l)}
                />
              ))}
            </div>
          </motion.section>

          {/* Optional context */}
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border p-6 md:p-8"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-bold">Add your own context (optional)</h2>
              <button
                type="button"
                onClick={() => setShowGoal((v) => !v)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {showGoal ? "Hide" : "Open"}
              </button>
            </div>
            {showGoal && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Specific goal
                  </label>
                  <Textarea
                    value={inputs.goal}
                    onChange={(e) => setInputs((p) => ({ ...p, goal: e.target.value }))}
                    placeholder={`Example for ${team.label}: ${team.use_cases[0]?.toLowerCase()}, but at half the cycle time.`}
                    rows={2}
                    className="resize-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Anything else worth knowing
                  </label>
                  <Textarea
                    value={inputs.free_text}
                    onChange={(e) => setInputs((p) => ({ ...p, free_text: e.target.value }))}
                    placeholder="Industry, team size, a recent failed pilot, a constraint we should know."
                    rows={2}
                    className="resize-none mt-1"
                  />
                </div>
              </div>
            )}
          </motion.section>
        </>
      )}

      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="font-semibold"
        >
          Diagnose my operating model
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function StepHeader({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span
        className="inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold"
        style={{
          background: "hsl(var(--primary) / 0.12)",
          color: "hsl(var(--primary))",
        }}
      >
        {n}
      </span>
      <h2 className="text-lg md:text-xl font-bold">{title}</h2>
    </div>
  );
}

function DiagnosingView() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">
        Reading your stack, mapping the gaps, naming the correction.
      </p>
    </div>
  );
}

function ResultView({
  diagnosis,
  gridState,
  savedId,
  email,
  setEmail,
  saving,
  onSave,
  onReset,
}: {
  diagnosis: Diagnosis;
  gridState: GridState;
  savedId: string | null;
  email: string;
  setEmail: (v: string) => void;
  saving: boolean;
  onSave: () => void;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-10"
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-2">
          Your diagnosis
        </p>
        <h2 className="text-2xl md:text-4xl font-black tracking-tight">
          {diagnosis.title}
        </h2>
        <p className="mt-4 text-base md:text-lg leading-relaxed text-foreground/85 max-w-3xl">
          {diagnosis.current_model_read}
        </p>
      </div>

      {/* Grid */}
      <section>
        <SectionHeading icon={Eye} label="Mapped to the LIZA grid" />
        <OperatingGrid state={gridState} />
      </section>

      {/* Tool limitations */}
      {diagnosis.tool_limitations.length > 0 && (
        <section>
          <SectionHeading icon={Wrench} label="What your tools cannot do for this goal" />
          <div className="grid md:grid-cols-2 gap-3">
            {diagnosis.tool_limitations.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="rounded-xl border p-4"
                style={{
                  background: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
              >
                <p className="text-sm font-bold">{t.tool}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {t.limitation}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Blind spots */}
      <section>
        <SectionHeading icon={AlertTriangle} label="What you probably have not thought about" />
        <div className="space-y-2">
          {diagnosis.blind_spots.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="rounded-xl border p-5"
              style={{
                background: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
              }}
            >
              <p className="text-sm font-bold">{b.title}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {b.why}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Correction */}
      <section
        className="rounded-2xl p-6 md:p-8 border-2"
        style={{
          background: "hsl(var(--primary) / 0.04)",
          borderColor: "hsl(var(--primary) / 0.3)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            The correction
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold leading-snug">
          {diagnosis.correction.move}
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mt-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">
              Scope
            </p>
            <p className="text-sm leading-relaxed">{diagnosis.correction.scope}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-1">
              How LIZA delivers it
            </p>
            <p className="text-sm leading-relaxed">{diagnosis.correction.liza_capability}</p>
          </div>
        </div>
      </section>

      {/* Save / share / restart */}
      <section
        className="rounded-2xl border p-6 md:p-8"
        style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
      >
        {savedId ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold">Saved. Share this link.</p>
              <p className="text-xs text-muted-foreground mt-1 break-all">
                {window.location.origin}/the-brief/{savedId}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/the-brief/${savedId}`);
                  toast.success("Link copied.");
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Copy link
              </Button>
              <Button variant="ghost" onClick={onReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Run another
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1">
              <p className="text-sm font-bold mb-1">Save this diagnosis</p>
              <p className="text-xs text-muted-foreground mb-3">
                Get a shareable link and we will send the brief to your inbox.
              </p>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={onSave} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save and share
              </Button>
              <Button variant="ghost" onClick={onReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Run another
              </Button>
            </div>
          </div>
        )}
      </section>
    </motion.div>
  );
}

function SectionHeading({
  icon: Icon,
  label,
}: {
  icon: typeof Eye;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}