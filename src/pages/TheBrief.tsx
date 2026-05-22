import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import {
  FUNCTIONS,
  UNIT_SHAPES,
  SCALES,
  DOMAINS,
  TIERS,
  getProbe,
  DOMAIN_CHOICES,
  type FunctionId,
  type UnitShape,
  type Scale,
  type DomainId,
} from "@/lib/brief-framework";

type Seat = {
  function_id: FunctionId;
  function_label: string;
  unit_shape: UnitShape;
  scale: Scale;
};

type Answers = {
  signal_tier?: 0 | 1 | 2 | 3;
  signal_label?: string;
  signal_note?: string;
  substrate_tier?: 0 | 1 | 2 | 3;
  substrate_label?: string;
  substrate_note?: string;
};
type DomainAnswers = Partial<Record<DomainId, Answers>>;

type DomainScore = {
  current_tier: 0 | 1 | 2 | 3;
  target_tier: 0 | 1 | 2 | 3;
  justification: string;
  bridge: string;
  effort_weeks: number;
  effort_role: string;
  unlock: string;
};

type Diagnosis = {
  title: string;
  narrative: string[];
  ai_ranking: { domain: DomainId; roi: "high" | "medium" | "low"; why: string }[];
  start_here: { domain: DomainId; reason: string };
  trade_off: string;
};

type Phase =
  | "intro"
  | "seat"
  | "probe"
  | "scoring"
  | "synthesizing"
  | "diagnosis";

const DOMAIN_ORDER: DomainId[] = ["demand", "capacity", "quality", "economics"];

const DOMAIN_BRIDGES: Record<DomainId, { bridge: string; unlock: string; role: string }> = {
  demand: {
    bridge: "Create one owned demand backlog with a clear intake rule, priority rule, and weekly decision cadence.",
    unlock: "Demand stops arriving as noise. The leader can trade off work before the unit is already committed.",
    role: "unit lead plus one operations analyst",
  },
  capacity: {
    bridge: "Create one capacity view that connects skills, allocation, bottlenecks, and the next planning cycle.",
    unlock: "Capacity becomes visible before work breaks. The leader can move people and scope with evidence.",
    role: "unit lead plus people or planning partner",
  },
  quality: {
    bridge: "Turn the quality bar into one current playbook with review triggers, ownership, and consequences.",
    unlock: "Quality moves from late escalation to early control. The team sees drift before customers do.",
    role: "domain owner plus delivery or quality lead",
  },
  economics: {
    bridge: "Build one unit economics view that shows margin, cost drivers, and low-yield work at decision level.",
    unlock: "The leader can stop subsidising bad work and put capacity behind the work that pays back.",
    role: "unit lead plus finance partner",
  },
};

const clampTier = (value: number): 0 | 1 | 2 | 3 => Math.max(0, Math.min(3, Math.round(value))) as 0 | 1 | 2 | 3;

const buildDomainScore = (domain: DomainId, a: Answers, scale: Scale): DomainScore => {
  const current = clampTier(Math.min(a.signal_tier ?? 0, a.substrate_tier ?? 0));
  const target = clampTier(current + (scale === "<50" || scale === "50-200" ? 1 : 2));
  const gap = Math.max(1, target - current);
  const sizeMultiplier = scale === "<50" ? 1 : scale === "50-200" ? 1.5 : scale === "200-500" ? 2 : 3;
  const weeks = Math.min(26, Math.max(2, Math.round(gap * 3 * sizeMultiplier)));
  const bridge = DOMAIN_BRIDGES[domain];

  return {
    current_tier: current,
    target_tier: target,
    justification: `The signal is "${a.signal_label}" and the system is "${a.substrate_label}".`,
    bridge: bridge.bridge,
    effort_weeks: weeks,
    effort_role: bridge.role,
    unlock: bridge.unlock,
  };
};

const buildFallbackDiagnosis = (seat: Seat, scores: Partial<Record<DomainId, DomainScore>>): Diagnosis => {
  const completeScores = DOMAIN_ORDER.map((domain) => ({ domain, score: scores[domain]! })).filter((x) => x.score);
  const lowest = completeScores.reduce((pick, item) => item.score.current_tier < pick.score.current_tier ? item : pick, completeScores[0]);
  const bestReady = [...completeScores].sort((a, b) => b.score.current_tier - a.score.current_tier)[0] || lowest;
  const start = lowest?.score.current_tier <= 1 ? lowest : bestReady;

  return {
    title: `${seat.function_label} operating diagnosis`,
    narrative: [
      `This ${seat.unit_shape.replace("_", " ")} is run through a mix of judgement, recorded artefacts, and partial systems. The work is visible enough to manage, but not yet structured enough for the system to carry routine decisions without the leader in the loop.`,
      `The practical constraint is substrate quality. Where the unit is still at Tier 0 or Tier 1, AI will amplify gaps rather than produce reliable leverage. Where the unit reaches Tier 2, the same AI spend starts converting into faster prioritisation, routing, control, and margin decisions.`,
      `The next move is not a broad AI programme. It is one domain bridge, owned clearly, with the operating rule written down and wired into the cadence the unit already uses.`,
    ],
    ai_ranking: completeScores
      .sort((a, b) => b.score.current_tier - a.score.current_tier)
      .map(({ domain, score }) => ({
        domain,
        roi: score.current_tier >= 2 ? "high" : score.current_tier === 1 ? "medium" : "low",
        why: score.current_tier >= 2
          ? `${DOMAINS.find((x) => x.id === domain)?.label} has enough structure for AI to work against the operating system.`
          : `${DOMAINS.find((x) => x.id === domain)?.label} needs a stronger substrate before AI spend becomes reliable.`,
      })),
    start_here: {
      domain: start?.domain || "demand",
      reason: start ? `${DOMAINS.find((x) => x.id === start.domain)?.label} is the clearest bridge from today's Tier ${start.score.current_tier} state to a more executable operating rhythm.` : "Start with Demand because it shapes what the rest of the unit has to absorb.",
    },
    trade_off: "The trade-off is speed versus explicitness. The unit has to slow down long enough to name the rule, or it will keep paying for ambiguity later.",
  };
};

export default function TheBrief() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("intro");
  const [seat, setSeat] = useState<Seat>({
    function_id: "gm",
    function_label: FUNCTIONS[0].label,
    unit_shape: "pnl",
    scale: "200-500",
  });
  const [domainIndex, setDomainIndex] = useState(0);
  const [answers, setAnswers] = useState<DomainAnswers>({});
  const [scores, setScores] = useState<Partial<Record<DomainId, DomainScore>>>({});
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [scoringDomain, setScoringDomain] = useState<DomainId | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const probeRef = useRef<HTMLDivElement>(null);
  const diagnosisRef = useRef<HTMLDivElement>(null);

  // Load saved diagnosis
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
      const inputs = data.inputs as { seat: Seat; answers: DomainAnswers; scores: typeof scores };
      const output = data.output as Diagnosis;
      setSeat(inputs.seat);
      setAnswers(inputs.answers);
      setScores(inputs.scores);
      setDiagnosis(output);
      setSavedId(id);
      setPhase("diagnosis");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const scrollTo = (el: HTMLElement | null) =>
    setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);

  const currentDomain = DOMAIN_ORDER[domainIndex];
  const currentProbe = currentDomain ? getProbe(seat.function_id, currentDomain) : null;
  const currentAnswers: Answers = currentDomain ? answers[currentDomain] || {} : {};
  const currentChoices = currentDomain ? DOMAIN_CHOICES[currentDomain] : null;

  const pickChoice = (which: "signal" | "substrate", choice: { tier: 0 | 1 | 2 | 3; label: string }) => {
    if (!currentDomain) return;
    setAnswers((prev) => ({
      ...prev,
      [currentDomain]: {
        ...(prev[currentDomain] || {}),
        [`${which}_tier`]: choice.tier,
        [`${which}_label`]: choice.label,
      },
    }));
  };

  const setNote = (which: "signal" | "substrate", value: string) => {
    if (!currentDomain) return;
    setAnswers((prev) => ({
      ...prev,
      [currentDomain]: { ...(prev[currentDomain] || {}), [`${which}_note`]: value },
    }));
  };

  const answerComplete = (a: Answers) =>
    a.signal_tier !== undefined && a.substrate_tier !== undefined;

  const startProbe = () => {
    setPhase("probe");
    setDomainIndex(0);
    scrollTo(probeRef.current);
  };

  const scoreDomain = async (domain: DomainId): Promise<DomainScore | null> => {
    const probe = getProbe(seat.function_id, domain);
    const a = answers[domain];
    if (!a || !answerComplete(a)) return null;
    const signalText = `[Tier ${a.signal_tier}] ${a.signal_label}${a.signal_note ? ` — Note: ${a.signal_note}` : ""}`;
    const substrateText = `[Tier ${a.substrate_tier}] ${a.substrate_label}${a.substrate_note ? ` — Note: ${a.substrate_note}` : ""}`;
    setScoringDomain(domain);
    try {
      const { data, error } = await supabase.functions.invoke("generate-brief", {
        body: {
          mode: "score_domain",
          seat,
          domain,
          probe: { signal_prompt: probe.signal.prompt, substrate_prompt: probe.substrate.prompt },
          answers: { signal: signalText, substrate: substrateText },
        },
      });
      if (error) throw error;
      if (!data?.score) throw new Error("No score returned.");
      return data.score as DomainScore;
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || `Could not score ${domain}.`);
      return null;
    } finally {
      setScoringDomain(null);
    }
  };

  const advance = async () => {
    if (!currentDomain) return;
    if (!answerComplete(currentAnswers)) {
      toast.error("Pick an option for both questions.");
      return;
    }
    if (domainIndex < DOMAIN_ORDER.length - 1) {
      setDomainIndex(domainIndex + 1);
      scrollTo(probeRef.current);
    } else {
      // All four answered. Score each, then synthesise.
      setPhase("scoring");
      scrollTo(diagnosisRef.current);
      const collected: Partial<Record<DomainId, DomainScore>> = {};
      for (const d of DOMAIN_ORDER) {
        const s = await scoreDomain(d);
        if (!s) {
          setPhase("probe");
          return;
        }
        collected[d] = s;
        setScores({ ...collected });
      }
      // Synthesise
      setPhase("synthesizing");
      try {
        const { data, error } = await supabase.functions.invoke("generate-brief", {
          body: {
            mode: "synthesize_diagnosis",
            seat,
            scores: collected,
            raw_answers: answers,
          },
        });
        if (error) throw error;
        if (!data?.diagnosis) throw new Error("No diagnosis returned.");
        setDiagnosis(data.diagnosis);
        setPhase("diagnosis");
        scrollTo(diagnosisRef.current);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || "Could not synthesise diagnosis.");
        setPhase("probe");
      }
    }
  };

  const back = () => {
    if (domainIndex > 0) {
      setDomainIndex(domainIndex - 1);
      scrollTo(probeRef.current);
    }
  };

  const saveAndShare = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Add an email to save.");
      return;
    }
    if (!diagnosis) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("briefs")
        .insert({
          email,
          inputs: { seat, answers, scores } as any,
          output: diagnosis as any,
        })
        .select("id")
        .single();
      if (error) throw error;
      setSavedId(data.id);
      const url = `${window.location.origin}/the-brief/${data.id}`;
      await navigator.clipboard.writeText(url).catch(() => {});
      toast.success("Saved. Link copied.");
      navigate(`/the-brief/${data.id}`, { replace: true });
    } catch (e) {
      console.error(e);
      toast.error("Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Intro */}
      <section className="min-h-screen flex items-center px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">The Brief</div>
          <h1 className="text-4xl md:text-6xl font-light leading-[1.05] tracking-tight text-foreground mb-8">
            A working diagnosis of the unit you run, and where AI actually earns its keep.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4 max-w-2xl">
            Built for operating leaders who already run a private model of how the unit should work,
            and want it on the page with the next move named.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-12 max-w-2xl">
            Eight questions across the four domains every operator decides on: demand, capacity, quality,
            economics. Out comes a maturity tier per domain, the bridge to the next tier, and the one place
            to start so token spend converts to margin.
          </p>
          {phase === "intro" && (
            <Button size="lg" onClick={() => { setPhase("seat"); scrollTo(probeRef.current); }} className="rounded-full px-8 h-12">
              Start the diagnosis
            </Button>
          )}
          {phase !== "intro" && (
            <div className="text-sm text-muted-foreground">
              {phase === "diagnosis" ? "Diagnosis ready below." : "Scroll down."}
            </div>
          )}
        </div>
      </section>

      {/* Seat + Probe */}
      {phase !== "intro" && phase !== "diagnosis" && phase !== "scoring" && phase !== "synthesizing" && !id && (
        <section
          ref={probeRef}
          className="min-h-screen px-6 md:px-12 border-t border-border/40 pt-20 pb-32"
        >
          <div className="max-w-3xl mx-auto w-full">
            {phase === "seat" && (
              <>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Act 1 of 4 . Seat</div>
                <h2 className="text-2xl md:text-4xl font-light leading-tight text-foreground mb-3">
                  Which seat are you in?
                </h2>
                <p className="text-sm text-muted-foreground mb-10">
                  Three picks. They bound every question that follows. The examination for a Head of Ops is
                  not the examination for a Head of Commercial.
                </p>

                <div className="space-y-8">
                  <SelectField
                    label="1. Function — the role you sit in"
                    value={seat.function_id}
                    onChange={(v) => {
                      const fn = FUNCTIONS.find((f) => f.id === v);
                      setSeat({ ...seat, function_id: v as FunctionId, function_label: fn?.label || "" });
                    }}
                    options={FUNCTIONS.map((f) => ({ value: f.id, label: f.label, helper: f.blurb }))}
                    columns={2}
                  />
                  <SelectField
                    label="2. What you are accountable for"
                    helperText="The shape of the unit you run. Pick the closest match."
                    value={seat.unit_shape}
                    onChange={(v) => setSeat({ ...seat, unit_shape: v as UnitShape })}
                    options={UNIT_SHAPES.map((s) => ({ value: s.id, label: s.label }))}
                    columns={2}
                  />
                  <SelectField
                    label="3. Scale — total headcount of the company"
                    value={seat.scale}
                    onChange={(v) => setSeat({ ...seat, scale: v as Scale })}
                    options={SCALES.map((s) => ({ value: s.id, label: s.label }))}
                    columns={5}
                  />
                </div>

                <div className="sticky bottom-4 mt-12 flex justify-end">
                  <div className="rounded-full bg-background/90 backdrop-blur border border-border/60 shadow-lg p-1.5">
                    <Button onClick={startProbe} className="rounded-full px-8">
                      Begin the four domains
                    </Button>
                  </div>
                </div>
              </>
            )}

            {phase === "probe" && currentDomain && currentProbe && currentAnswers && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Act 2 of 4 . Examination . {DOMAINS[domainIndex].label}
                  </div>
                  <div className="text-xs text-muted-foreground tabular-nums">
                    Domain {domainIndex + 1} of {DOMAIN_ORDER.length}
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-light leading-tight text-foreground mb-3">
                  {DOMAINS[domainIndex].label}
                </h2>
                <p className="text-base text-muted-foreground mb-2">{DOMAINS[domainIndex].one_liner}</p>
                <p className="text-sm text-muted-foreground mb-12">
                  Decision you own here: {DOMAINS[domainIndex].decision}
                </p>

                <div className="space-y-10">
                  {currentChoices && (
                    <>
                      <ChoiceField
                        label="The signal you trust"
                        prompt={currentProbe.signal.prompt}
                        helper={currentProbe.signal.helper}
                        choices={currentChoices.signal}
                        selectedTier={currentAnswers.signal_tier}
                        onPick={(c) => pickChoice("signal", c)}
                        note={currentAnswers.signal_note || ""}
                        onNoteChange={(v) => setNote("signal", v)}
                      />
                      <ChoiceField
                        label="The system that produces it"
                        prompt={currentProbe.substrate.prompt}
                        helper={currentProbe.substrate.helper}
                        choices={currentChoices.substrate}
                        selectedTier={currentAnswers.substrate_tier}
                        onPick={(c) => pickChoice("substrate", c)}
                        note={currentAnswers.substrate_note || ""}
                        onNoteChange={(v) => setNote("substrate", v)}
                      />
                    </>
                  )}
                </div>

                <div className="sticky bottom-4 mt-12 flex items-center justify-between gap-2 rounded-full bg-background/90 backdrop-blur border border-border/60 shadow-lg p-1.5">
                  <Button variant="ghost" onClick={back} disabled={domainIndex === 0} className="rounded-full">
                    Back
                  </Button>
                  <Button
                    onClick={advance}
                    disabled={!answerComplete(currentAnswers)}
                    className="rounded-full px-8"
                  >
                    {domainIndex === DOMAIN_ORDER.length - 1 ? "Score the diagnosis" : "Next domain"}
                  </Button>
                </div>

                <div className="mt-10 flex gap-1">
                  {DOMAIN_ORDER.map((d, i) => (
                    <div
                      key={d}
                      className={`h-0.5 flex-1 transition-colors ${i <= domainIndex ? "bg-foreground/60" : "bg-border"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* Scoring / synthesising */}
      {(phase === "scoring" || phase === "synthesizing") && (
        <section
          ref={diagnosisRef}
          className="min-h-screen flex items-center px-6 md:px-12 border-t border-border/40"
        >
          <div className="max-w-2xl mx-auto py-20 w-full">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Act 3 of 4 . Diagnosis . {phase === "scoring" ? "Scoring" : "Synthesising"}
            </div>
            <div className="text-2xl font-light text-foreground mb-8">
              {phase === "scoring"
                ? scoringDomain
                  ? `Reading your ${scoringDomain} answers against the four-tier scale.`
                  : "Reading your answers."
                : "Synthesising the four domains into one page."}
            </div>
            <div className="space-y-3">
              {DOMAIN_ORDER.map((d) => {
                const done = !!scores[d];
                const active = scoringDomain === d;
                return (
                  <div
                    key={d}
                    className={`flex items-center justify-between py-2 px-4 rounded-md border ${
                      done ? "border-emerald-500/40 bg-emerald-500/5" : active ? "border-foreground/40" : "border-border/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          done ? "bg-emerald-500" : active ? "bg-foreground animate-pulse" : "bg-border"
                        }`}
                      />
                      <span className="text-sm font-medium">{DOMAINS.find((x) => x.id === d)?.label}</span>
                    </div>
                    {done && (
                      <span className="text-xs text-muted-foreground">
                        Tier {scores[d]!.current_tier} . target Tier {scores[d]!.target_tier}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Diagnosis */}
      {phase === "diagnosis" && diagnosis && (
        <section
          ref={diagnosisRef}
          className="px-6 md:px-12 border-t border-border/40 py-20 md:py-32"
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
              Act 4 of 4 . Diagnosis and Prescription . {seat.function_label}
            </div>

            <h1
              className="text-3xl md:text-4xl font-normal leading-tight text-foreground mb-12"
              style={{ fontFamily: 'Georgia, "Iowan Old Style", serif' }}
            >
              {diagnosis.title}
            </h1>

            {/* Narrative */}
            <SectionHeading>The unit today</SectionHeading>
            <div className="space-y-6" style={{ fontFamily: 'Georgia, "Iowan Old Style", serif' }}>
              {diagnosis.narrative.map((p, i) => (
                <p key={i} className="text-lg leading-[1.75] text-foreground">{p}</p>
              ))}
            </div>

            {/* Bridge per domain */}
            <SectionHeading>The four domains, scored</SectionHeading>
            <div className="space-y-6">
              {DOMAIN_ORDER.map((d) => {
                const s = scores[d];
                const def = DOMAINS.find((x) => x.id === d)!;
                if (!s) return null;
                return (
                  <div key={d} className="border border-border/60 rounded-lg p-6">
                    <div className="flex items-baseline justify-between mb-3">
                      <h3 className="text-lg font-medium text-foreground">{def.label}</h3>
                      <div className="text-xs tabular-nums text-muted-foreground">
                        Tier {s.current_tier} {TIERS[s.current_tier].label} → Tier {s.target_tier} {TIERS[s.target_tier].label}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-4">"{s.justification}"</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground uppercase tracking-wider text-xs mr-2">Bridge</span>
                        <span className="text-foreground">{s.bridge}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground uppercase tracking-wider text-xs mr-2">Effort</span>
                        <span className="text-foreground">{s.effort_weeks} weeks, {s.effort_role}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground uppercase tracking-wider text-xs mr-2">Unlock</span>
                        <span className="text-foreground">{s.unlock}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI economics */}
            <SectionHeading>Where AI earns its keep in your unit</SectionHeading>
            <div className="border border-border/60 rounded-lg overflow-hidden">
              {diagnosis.ai_ranking.map((r, i) => {
                const def = DOMAINS.find((x) => x.id === r.domain);
                const roiColor =
                  r.roi === "high"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : r.roi === "medium"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-muted-foreground";
                return (
                  <div
                    key={r.domain}
                    className={`p-5 ${i > 0 ? "border-t border-border/40" : ""}`}
                  >
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-medium text-foreground">{def?.label}</span>
                      <span className={`text-xs uppercase tracking-wider font-semibold ${roiColor}`}>
                        {r.roi} ROI
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{r.why}</p>
                  </div>
                );
              })}
            </div>

            {/* Start here */}
            <SectionHeading>Start here</SectionHeading>
            <div className="border-l-2 border-foreground pl-5 py-2">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-1">
                {DOMAINS.find((x) => x.id === diagnosis.start_here.domain)?.label}
              </div>
              <p className="text-lg leading-snug text-foreground">{diagnosis.start_here.reason}</p>
            </div>

            {/* Trade-off */}
            <SectionHeading>The trade-off you are avoiding</SectionHeading>
            <p className="text-lg leading-[1.75] text-foreground" style={{ fontFamily: 'Georgia, "Iowan Old Style", serif' }}>
              {diagnosis.trade_off}
            </p>

            {/* Handoff */}
            <div className="mt-24 pt-12 border-t border-border/40">
              <p className="text-xl font-light text-foreground leading-snug mb-3">
                The diagnosis points at a substrate underneath. That substrate is what LIZA is.
              </p>
              <p className="text-muted-foreground mb-8">
                Defined context for the unit, captured standards from the people doing the work, one system
                that holds them and feeds every tool. The diagnosis names the gap. LIZA is the build.
              </p>
              <div className="flex flex-wrap gap-3 items-center">
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

function SelectField({
  label,
  value,
  onChange,
  options,
  columns = 1,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; helper?: string }[];
  columns?: 1 | 2 | 3 | 5;
  helperText?: string;
}) {
  const colClass =
    columns === 5
      ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-3"
        : columns === 2
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-1";
  return (
    <div>
      <div className="text-sm font-medium text-foreground mb-1">{label}</div>
      {helperText && (
        <div className="text-xs text-muted-foreground mb-3">{helperText}</div>
      )}
      {!helperText && <div className="mb-3" />}
      <div className={`grid gap-2 ${colClass}`}>
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={selected}
              className={`text-left px-4 py-3 rounded-md border transition-colors cursor-pointer flex items-start gap-3 ${
                selected
                  ? "border-foreground bg-foreground/5"
                  : "border-border/60 hover:border-foreground/60 hover:bg-foreground/[0.02]"
              }`}
            >
              <span
                className={`mt-1 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                  selected ? "border-foreground" : "border-border"
                }`}
              >
                {selected && <span className="h-2 w-2 rounded-full bg-foreground" />}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-foreground">{o.label}</span>
                {o.helper && (
                  <span className="block text-xs text-muted-foreground mt-0.5">{o.helper}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChoiceField({
  label,
  prompt,
  helper,
  choices,
  selectedTier,
  onPick,
  note,
  onNoteChange,
}: {
  label: string;
  prompt: string;
  helper: string;
  choices: { tier: 0 | 1 | 2 | 3; label: string; sub?: string }[];
  selectedTier: 0 | 1 | 2 | 3 | undefined;
  onPick: (c: { tier: 0 | 1 | 2 | 3; label: string }) => void;
  note: string;
  onNoteChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">{label}</div>
      <div className="text-base text-foreground mb-1">{prompt}</div>
      <div className="text-xs text-muted-foreground mb-4">{helper}</div>
      <div className="grid gap-2">
        {choices.map((c) => {
          const selected = selectedTier === c.tier;
          return (
            <button
              key={c.tier}
              type="button"
              onClick={() => onPick({ tier: c.tier, label: c.label })}
              aria-pressed={selected}
              className={`text-left px-4 py-3 rounded-md border transition-colors cursor-pointer flex items-start gap-3 ${
                selected
                  ? "border-foreground bg-foreground/5"
                  : "border-border/60 hover:border-foreground/60 hover:bg-foreground/[0.02]"
              }`}
            >
              <span
                className={`mt-1 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                  selected ? "border-foreground" : "border-border"
                }`}
              >
                {selected && <span className="h-2 w-2 rounded-full bg-foreground" />}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-foreground leading-snug">{c.label}</span>
                {c.sub && (
                  <span className="block text-xs text-muted-foreground mt-0.5">{c.sub}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      <details className="mt-3 group">
        <summary className="text-xs text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
          Add a sentence of context (optional)
        </summary>
        <Textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          className="mt-2 min-h-[70px] text-sm leading-relaxed resize-none bg-card border-border/60 focus-visible:ring-1"
          placeholder="Anything specific about how this actually shows up in your unit."
        />
      </details>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-16 mb-5 font-medium">
      {children}
    </h2>
  );
}