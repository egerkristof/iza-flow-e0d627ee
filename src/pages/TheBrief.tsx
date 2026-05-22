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
  AlertTriangle,
  Check,
  Share2,
  RotateCcw,
  Compass,
  ShieldCheck,
  Layers,
  Scale,
  Coins,
  Calendar,
  TrendingUp,
  Info,
} from "lucide-react";
import { TEAM_PROFILES, TEAM_BY_ID, type TeamId } from "@/lib/team-profiles";
import {
  STREAMS,
  AUDITS,
  DECISION_CLASSES,
  TRIGGERS,
  MATURITY_STAGES,
  computeStage,
  bundleExamples,
  emptyStreamAnswer,
  emptyAuditAnswer,
  streamExamples,
  deterministicDiagnosis,
  type StreamId,
  type StreamStatus,
  type AuditId,
  type AuditStatus,
  type TriggerId,
  type OperatorDiagnosis,
} from "@/lib/operator-framework";
import { OperatorCompass } from "@/components/brief/OperatorCompass";
import { GovernanceBar } from "@/components/brief/GovernanceBar";
import { BundleGap } from "@/components/brief/BundleGap";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

type Inputs = {
  team: TeamId | null;
  use_cases: string[];
  tools: string[];
  streams: Record<StreamId, StreamStatus | null>;
  audits: Record<AuditId, AuditStatus | null>;
  trigger: TriggerId | null;
  free_text: string;
};

type Phase = "input" | "diagnosing" | "result";

// ────────────────────────────────────────────────────────────────────────────
// Small helpers
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

function ThreeWay<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; color: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className="text-[11px] md:text-xs font-semibold px-3 py-1.5 transition-colors"
            style={{
              background: selected ? `hsl(${o.color} / 0.18)` : "transparent",
              color: selected ? `hsl(${o.color})` : "hsl(var(--muted-foreground))",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

const STREAM_OPTS: { value: StreamStatus; label: string; color: string }[] = [
  { value: "lit", label: "Fully", color: "155 72% 46%" },
  { value: "partial", label: "Partially", color: "38 92% 50%" },
  { value: "dark", label: "Blind", color: "0 70% 55%" },
];

const AUDIT_OPTS: { value: AuditStatus; label: string; color: string }[] = [
  { value: "green", label: "Yes", color: "155 72% 46%" },
  { value: "amber", label: "Partly", color: "38 92% 50%" },
  { value: "red", label: "No", color: "0 70% 55%" },
];

// ────────────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────────────

export default function TheBrief() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("input");
  const [inputs, setInputs] = useState<Inputs>({
    team: null,
    use_cases: [],
    tools: [],
    streams: emptyStreamAnswer(),
    audits: emptyAuditAnswer(),
    trigger: null,
    free_text: "",
  });
  const [diagnosis, setDiagnosis] = useState<OperatorDiagnosis | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

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
      setDiagnosis(data.output as unknown as OperatorDiagnosis);
      setSavedId(id);
      setPhase("result");
    })();
  }, [id, navigate]);

  const toggle = (key: "tools" | "use_cases", value: string) => {
    setInputs((p) => ({
      ...p,
      [key]: p[key].includes(value)
        ? p[key].filter((x) => x !== value)
        : [...p[key], value],
    }));
  };

  const setStream = (s: StreamId, v: StreamStatus) =>
    setInputs((p) => ({ ...p, streams: { ...p.streams, [s]: v } }));
  const setAudit = (a: AuditId, v: AuditStatus) =>
    setInputs((p) => ({ ...p, audits: { ...p.audits, [a]: v } }));

  const streamsAnswered = STREAMS.every((s) => inputs.streams[s.id] !== null);
  const auditsAnswered = AUDITS.every((a) => inputs.audits[a.id] !== null);
  const canSubmit = !!inputs.team && streamsAnswered && auditsAnswered;

  const runDiagnosis = async () => {
    if (!canSubmit) {
      toast.error("Pick your team, then answer the four streams and five audits.");
      return;
    }
    setPhase("diagnosing");
    const team = inputs.team ? TEAM_BY_ID[inputs.team] : null;
    try {
      const { data, error } = await supabase.functions.invoke("generate-brief", {
        body: {
          team: team?.label || null,
          team_sub: team?.sub || null,
          use_cases: inputs.use_cases,
          tools: inputs.tools,
          streams: inputs.streams,
          audits: inputs.audits,
          trigger: inputs.trigger
            ? TRIGGERS.find((t) => t.id === inputs.trigger)?.label
            : null,
          free_text: inputs.free_text,
        },
      });
      let result: OperatorDiagnosis;
      if (error || !data?.diagnosis) {
        console.warn("AI diagnosis unavailable, using fallback:", error);
        result = deterministicDiagnosis({
          team: team?.label || null,
          use_cases: inputs.use_cases,
          tools: inputs.tools,
          streams: inputs.streams,
          audits: inputs.audits,
          trigger: inputs.trigger,
        });
      } else {
        result = data.diagnosis as OperatorDiagnosis;
      }
      setDiagnosis(result);
      setPhase("result");
    } catch (e) {
      console.error(e);
      setDiagnosis(
        deterministicDiagnosis({
          team: team?.label || null,
          use_cases: inputs.use_cases,
          tools: inputs.tools,
          streams: inputs.streams,
          audits: inputs.audits,
          trigger: inputs.trigger,
        }),
      );
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
    setInputs({
      team: null,
      use_cases: [],
      tools: [],
      streams: emptyStreamAnswer(),
      audits: emptyAuditAnswer(),
      trigger: null,
      free_text: "",
    });
    navigate("/the-brief", { replace: true });
  };

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
          <p className="mt-4 text-xs font-bold tracking-[0.18em] uppercase text-primary">
            The Brief
          </p>
          <h1 className="mt-2 text-3xl md:text-5xl font-black tracking-tight max-w-3xl">
            You have AI everywhere in your org. You cannot see what it is doing.
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
            Three minutes. Five sections. You get back a read on where your AI is blind,
            what it costs you, and the one move that closes the biggest gap.
          </p>
        </header>

        {phase === "input" && (
          <InputView
            inputs={inputs}
            setInputs={setInputs}
            toggle={toggle}
            setStream={setStream}
            setAudit={setAudit}
            canSubmit={canSubmit}
            onSubmit={runDiagnosis}
          />
        )}

        {phase === "diagnosing" && <DiagnosingView />}

        {phase === "result" && diagnosis && (
          <ResultView
            diagnosis={diagnosis}
            tools={inputs.tools}
            team={inputs.team}
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
// Input
// ────────────────────────────────────────────────────────────────────────────

function InputView({
  inputs,
  setInputs,
  toggle,
  setStream,
  setAudit,
  canSubmit,
  onSubmit,
}: {
  inputs: Inputs;
  setInputs: React.Dispatch<React.SetStateAction<Inputs>>;
  toggle: (key: "tools" | "use_cases", value: string) => void;
  setStream: (s: StreamId, v: StreamStatus) => void;
  setAudit: (a: AuditId, v: AuditStatus) => void;
  canSubmit: boolean;
  onSubmit: () => void;
}) {
  const team = inputs.team ? TEAM_BY_ID[inputs.team] : null;
  const [showExtra, setShowExtra] = useState(false);
  const examples = streamExamples(inputs.team);

  // Progress: 6 milestones (team, use_cases optional, tools optional, all streams, all audits, trigger)
  const milestones = [
    !!inputs.team,
    !!inputs.team, // we count team twice so progress starts moving
    STREAMS.every((s) => inputs.streams[s.id] !== null),
    AUDITS.every((a) => inputs.audits[a.id] !== null),
    !!inputs.trigger,
  ];
  const progress = Math.round(
    (milestones.filter(Boolean).length / milestones.length) * 100,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Sticky progress */}
      <div
        className="sticky top-0 z-20 -mx-4 md:-mx-8 px-4 md:px-8 py-3 backdrop-blur-sm"
        style={{ background: "hsl(var(--background) / 0.85)" }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            {progress < 100 ? "Diagnostic in progress" : "Ready to diagnose"}
          </p>
          <p className="text-[10px] font-bold tracking-wider text-muted-foreground">
            {progress}%
          </p>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
          <motion.div
            className="h-full"
            style={{ background: "hsl(var(--primary))" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Stage 1: About you */}
      <StageHeader stage="A" title="About you" sub="Two minutes. Pick. Pick. Pick." />

      {/* 1. Team */}
      <Section n={1} title="Which team are you running?">
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
                onClick={() =>
                  setInputs((p) => ({
                    ...p,
                    team: t.id,
                    use_cases: p.team === t.id ? p.use_cases : [],
                    tools: p.team === t.id ? p.tools : [],
                  }))
                }
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
      </Section>

      {team && (
        <>
          {/* 2. Use cases (optional context) */}
          <Section n={2} title={`What is your ${team.label} team using AI for today?`}>
            <p className="text-sm text-muted-foreground mb-4">
              Pick all that apply. Optional, but it sharpens the diagnosis.
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
          </Section>

          {/* 3. Tools */}
          <Section n={3} title="Your AI stack today">
            <p className="text-sm text-muted-foreground mb-4">
              Inventory, not preference. Pick everything actually in use.
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
          </Section>

          {/* Stage 2: The diagnostic */}
          <StageHeader
            stage="B"
            title="The diagnostic"
            sub="Two governance questions. Same answer pattern."
          />

          {/* 4. Streams */}
          <Section n={4} title="Which streams does your AI see?">
            <p className="text-sm text-muted-foreground mb-5">
              Every moment of work requires four streams to converge. Mark how much your AI
              currently sees of each.
            </p>
            <div className="space-y-3">
              {STREAMS.map((s) => (
                <div
                  key={s.id}
                  className="rounded-xl border p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
                  style={{
                    background: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: `hsl(${s.color})` }}
                      />
                      <p className="text-sm font-bold">{s.label}</p>
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-0.5">
                      {examples[s.id]}
                    </p>
                  </div>
                  <ThreeWay
                    options={STREAM_OPTS}
                    value={inputs.streams[s.id]}
                    onChange={(v) => setStream(s.id, v)}
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* 5. Audits */}
          <Section n={5} title="Which governance audits run on every AI output?">
            <p className="text-sm text-muted-foreground mb-5">
              These are the five live checks that stand between intent and outcome. Be
              honest. The diagnosis is only as sharp as the answers.
            </p>
            <div className="space-y-3">
              {AUDITS.map((a) => (
                <div
                  key={a.id}
                  className="rounded-xl border p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4"
                  style={{
                    background: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                  }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-bold">{a.label}</p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{a.question}</p>
                  </div>
                  <ThreeWay
                    options={AUDIT_OPTS}
                    value={inputs.audits[a.id]}
                    onChange={(v) => setAudit(a.id, v)}
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* Stage 3: Closing */}
          <StageHeader
            stage="C"
            title="One last thing"
            sub="Helps us tailor the read to your actual situation."
          />

          {/* 6. Trigger */}
          <Section n={6} title="What brought you here today?">
            <p className="text-sm text-muted-foreground mb-4">
              Pick one. Shapes the verdict.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {TRIGGERS.map((t) => {
                const selected = inputs.trigger === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setInputs((p) => ({ ...p, trigger: t.id }))}
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
          </Section>

          {/* Extra context (optional) */}
          <Section n={7} title="Anything else worth knowing? (optional)">
            <div className="flex items-center justify-between -mt-2 mb-3">
              <p className="text-sm text-muted-foreground">
                Industry, team size, a recent failed pilot, a constraint we should know.
              </p>
              <button
                type="button"
                onClick={() => setShowExtra((v) => !v)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {showExtra ? "Hide" : "Open"}
              </button>
            </div>
            {showExtra && (
              <Textarea
                value={inputs.free_text}
                onChange={(e) => setInputs((p) => ({ ...p, free_text: e.target.value }))}
                placeholder="One or two sentences are enough."
                rows={3}
                className="resize-none"
              />
            )}
          </Section>
        </>
      )}

      <div className="flex justify-end">
        <Button size="lg" onClick={onSubmit} disabled={!canSubmit} className="font-semibold">
          Diagnose my operating model
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function StageHeader({
  stage,
  title,
  sub,
}: {
  stage: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <span
        className="inline-flex w-7 h-7 rounded-full items-center justify-center text-[11px] font-black"
        style={{
          background: "hsl(var(--foreground))",
          color: "hsl(var(--background))",
        }}
      >
        {stage}
      </span>
      <div>
        <p className="text-sm md:text-base font-bold">{title}</p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </div>
      <div className="flex-1 h-px ml-2" style={{ background: "hsl(var(--border))" }} />
    </div>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-6 md:p-8"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold"
          style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}
        >
          {n}
        </span>
        <h2 className="text-lg md:text-xl font-bold">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Diagnosing
// ────────────────────────────────────────────────────────────────────────────

function DiagnosingView() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground">
        Reading your streams. Mapping your audits. Naming the correction.
      </p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Result
// ────────────────────────────────────────────────────────────────────────────

function ResultView({
  diagnosis,
  tools,
  team,
  savedId,
  email,
  setEmail,
  saving,
  onSave,
  onReset,
}: {
  diagnosis: OperatorDiagnosis;
  tools: string[];
  team: TeamId | null;
  savedId: string | null;
  email: string;
  setEmail: (v: string) => void;
  saving: boolean;
  onSave: () => void;
  onReset: () => void;
}) {
  // Derive maturity stage from the same answers powering the visuals
  const streamAns = Object.fromEntries(
    (Object.keys(diagnosis.stream_coverage) as StreamId[]).map((k) => [
      k,
      diagnosis.stream_coverage[k].status,
    ]),
  ) as Record<StreamId, StreamStatus | null>;
  const auditAns = Object.fromEntries(
    (Object.keys(diagnosis.audit_coverage) as AuditId[]).map((k) => [
      k,
      diagnosis.audit_coverage[k].status,
    ]),
  ) as Record<AuditId, AuditStatus | null>;
  const { stage, next } = computeStage({
    streams: streamAns,
    audits: auditAns,
  });
  const currentStage = MATURITY_STAGES.find((s) => s.id === stage)!;
  const nextStage = next ? MATURITY_STAGES.find((s) => s.id === next) : null;
  const examples = bundleExamples(team);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-12"
    >
      {/* 1. VERDICT — the line they would read aloud to their CEO */}
      <div
        className="rounded-2xl border-2 p-6 md:p-10"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, hsl(var(--card)) 60%)",
          borderColor: "hsl(var(--primary) / 0.4)",
        }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-2">
          The verdict
        </p>
        <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
          {diagnosis.verdict || diagnosis.title}
        </h2>
        <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground max-w-3xl">
          {diagnosis.current_model_read}
        </p>
      </div>

      {/* 1b. MATURITY ARC — pin them on the map */}
      <MaturityArc currentId={stage} />

      {/* 2. DIAGNOSIS — the compass tells the story */}
      <section>
        <SectionHeading icon={Compass} label="The moment of work / stream coverage" />
        <ReadAs>
          Every AI decision your team makes needs four streams of context to land. The
          arms below show how many of them your AI actually sees today. Dim arms are
          the parts of reality it is guessing at.
        </ReadAs>
        <OperatorCompass coverage={diagnosis.stream_coverage} tools={tools} />
      </section>

      {/* 3. COST OF THE GAP — turns diagnostic into budget */}
      {diagnosis.cost_of_gap && (
        <section
          className="rounded-2xl border p-6 md:p-8"
          style={{
            background: "hsl(0 70% 55% / 0.04)",
            borderColor: "hsl(0 70% 55% / 0.3)",
          }}
        >
          <SectionHeading icon={Coins} label="What this gap costs you" />
          <ReadAs tone="warn">
            Translation of the dim arms and missing audits above into hours and people.
            Not a quote, an order of magnitude.
          </ReadAs>
          <p className="text-lg md:text-2xl font-bold leading-snug">
            {diagnosis.cost_of_gap.headline}
          </p>
          <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl">
            {diagnosis.cost_of_gap.math}
          </p>
        </section>
      )}

      {/* 4. BLIND SPOTS — what you have not seen */}
      <section>
        <SectionHeading icon={AlertTriangle} label="What you probably have not seen" />
        <ReadAs>
          Second-order effects of the gaps above. The things that bite quietly because
          nothing in your current setup catches them.
        </ReadAs>
        <div className="space-y-2">
          {diagnosis.blind_spots.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="rounded-xl border p-5"
              style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            >
              <p className="text-sm font-bold">{b.title}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{b.why}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. THE MOVE — promoted, sequenced, CTA attached */}
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
            The move
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">
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

        {/* 30 / 60 / 90 sequence */}
        {diagnosis.correction.sequence && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                The sequence
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {(["now", "next", "later"] as const).map((k, i) => {
                const step = diagnosis.correction.sequence![k];
                return (
                  <div
                    key={k}
                    className="rounded-xl border p-4"
                    style={{
                      background: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="inline-flex w-5 h-5 rounded-full items-center justify-center text-[10px] font-black"
                        style={{
                          background: "hsl(var(--primary))",
                          color: "hsl(var(--primary-foreground))",
                        }}
                      >
                        {i + 1}
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {step.label}
                      </p>
                    </div>
                    <p className="text-sm leading-snug">{step.what}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Inline CTA at peak intent */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between pt-5 border-t" style={{ borderColor: "hsl(var(--primary) / 0.2)" }}>
          <p className="text-sm text-muted-foreground">
            Want this delivered? We can walk it through with you in 30 minutes.
          </p>
          <Button asChild className="font-semibold">
            <a href="/sprint">
              Book a 30-min readout
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* 6. THE UNDERNEATH — collapsed proof: audits, bundle, decision-class */}
      <section>
        <SectionHeading icon={Layers} label="The underneath / proof of diagnosis" />
        <div className="space-y-6">
          {/* Governance */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Governance audits / what runs on every output
              </p>
            </div>
            <GovernanceBar coverage={diagnosis.audit_coverage} />
          </div>

          {/* Bundle gap */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Knowledge bundle / what is encoded today
              </p>
            </div>
            <BundleGap gaps={diagnosis.bundle_gaps} />
          </div>

          {/* Decision class */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Decision-class read
              </p>
            </div>
            <p className="text-sm leading-relaxed text-foreground/85 mb-3 max-w-3xl">
              {diagnosis.decision_class_read.exposed}
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              {DECISION_CLASSES.map((c) => {
                const governed = diagnosis.decision_class_read.governed_today.includes(c.id);
                return (
                  <div
                    key={c.id}
                    className="rounded-xl border p-3"
                    style={{
                      background: governed ? "hsl(155 72% 46% / 0.06)" : "hsl(0 70% 55% / 0.04)",
                      borderColor: governed
                        ? "hsl(155 72% 46% / 0.4)"
                        : "hsl(0 70% 55% / 0.3)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold">{c.label}</p>
                      <span
                        className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          background: governed
                            ? "hsl(155 72% 46% / 0.18)"
                            : "hsl(0 70% 55% / 0.18)",
                          color: governed ? "hsl(155 72% 36%)" : "hsl(0 70% 50%)",
                        }}
                      >
                        {governed ? "Governed" : "Exposed"}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Weight {c.multiplier} / {c.scope}
                    </p>
                  </div>
                );
              })}
            </div>
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
                  navigator.clipboard.writeText(
                    `${window.location.origin}/the-brief/${savedId}`,
                  );
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
                Get a shareable link. We will send the brief to your inbox.
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
  icon: typeof Compass;
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