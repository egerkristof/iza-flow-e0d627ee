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

type Answers = { signal: string; substrate: string };
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
  const currentAnswers = currentDomain ? answers[currentDomain] || { signal: "", substrate: "" } : null;

  const setAnswer = (field: "signal" | "substrate", value: string) => {
    if (!currentDomain) return;
    setAnswers((prev) => ({
      ...prev,
      [currentDomain]: { ...(prev[currentDomain] || { signal: "", substrate: "" }), [field]: value },
    }));
  };

  const startProbe = () => {
    setPhase("probe");
    setDomainIndex(0);
    scrollTo(probeRef.current);
  };

  const scoreDomain = async (domain: DomainId): Promise<DomainScore | null> => {
    const probe = getProbe(seat.function_id, domain);
    const a = answers[domain];
    if (!a) return null;
    setScoringDomain(domain);
    try {
      const { data, error } = await supabase.functions.invoke("generate-brief", {
        body: {
          mode: "score_domain",
          seat,
          domain,
          probe: { signal_prompt: probe.signal.prompt, substrate_prompt: probe.substrate.prompt },
          answers: a,
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
    if (!currentDomain || !currentAnswers) return;
    if (currentAnswers.signal.trim().length < 8 || currentAnswers.substrate.trim().length < 8) {
      toast.error("Give both questions a real sentence.");
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
          className="min-h-screen flex items-center px-6 md:px-12 border-t border-border/40 py-20"
        >
          <div className="max-w-3xl mx-auto w-full">
            {phase === "seat" && (
              <>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">Step 1 of 5 . Seat</div>
                <h2 className="text-2xl md:text-4xl font-light leading-tight text-foreground mb-3">
                  Which seat are you in?
                </h2>
                <p className="text-sm text-muted-foreground mb-10">
                  This decides every question that follows. The probe for a Head of Ops is not the probe for a Head of Commercial.
                </p>

                <div className="space-y-8">
                  <SelectField
                    label="Function"
                    value={seat.function_id}
                    onChange={(v) => {
                      const fn = FUNCTIONS.find((f) => f.id === v);
                      setSeat({ ...seat, function_id: v as FunctionId, function_label: fn?.label || "" });
                    }}
                    options={FUNCTIONS.map((f) => ({ value: f.id, label: f.label, helper: f.blurb }))}
                  />
                  <SelectField
                    label="Unit shape"
                    value={seat.unit_shape}
                    onChange={(v) => setSeat({ ...seat, unit_shape: v as UnitShape })}
                    options={UNIT_SHAPES.map((s) => ({ value: s.id, label: s.label }))}
                  />
                  <SelectField
                    label="Scale"
                    value={seat.scale}
                    onChange={(v) => setSeat({ ...seat, scale: v as Scale })}
                    options={SCALES.map((s) => ({ value: s.id, label: s.label }))}
                  />
                </div>

                <div className="flex items-center justify-end mt-12">
                  <Button onClick={startProbe} className="rounded-full px-8">
                    Begin the four domains
                  </Button>
                </div>
              </>
            )}

            {phase === "probe" && currentDomain && currentProbe && currentAnswers && (
              <>
                <div className="flex items-center justify-between mb-8">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Step {domainIndex + 2} of 5 . {DOMAINS[domainIndex].label}
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
                  <ProbeField
                    label="The signal you trust"
                    prompt={currentProbe.signal.prompt}
                    helper={currentProbe.signal.helper}
                    placeholder={currentProbe.signal.placeholder}
                    value={currentAnswers.signal}
                    onChange={(v) => setAnswer("signal", v)}
                  />
                  <ProbeField
                    label="The system that produces it"
                    prompt={currentProbe.substrate.prompt}
                    helper={currentProbe.substrate.helper}
                    placeholder={currentProbe.substrate.placeholder}
                    value={currentAnswers.substrate}
                    onChange={(v) => setAnswer("substrate", v)}
                  />
                </div>

                <div className="flex items-center justify-between mt-12">
                  <Button variant="ghost" onClick={back} disabled={domainIndex === 0} className="rounded-full">
                    Back
                  </Button>
                  <Button
                    onClick={advance}
                    disabled={currentAnswers.signal.trim().length < 8 || currentAnswers.substrate.trim().length < 8}
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
              {phase === "scoring" ? "Scoring each domain" : "Writing the diagnosis"}
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
              The Diagnosis . {seat.function_label}
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; helper?: string }[];
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">{label}</div>
      <div className="grid gap-2">
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={`text-left px-4 py-3 rounded-md border transition-colors ${
                selected
                  ? "border-foreground bg-foreground/5"
                  : "border-border/60 hover:border-foreground/40"
              }`}
            >
              <div className="text-sm font-medium text-foreground">{o.label}</div>
              {o.helper && <div className="text-xs text-muted-foreground mt-0.5">{o.helper}</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProbeField({
  label,
  prompt,
  helper,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  prompt: string;
  helper: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">{label}</div>
      <div className="text-base text-foreground mb-1">{prompt}</div>
      <div className="text-xs text-muted-foreground mb-3">{helper}</div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[110px] text-base leading-relaxed resize-none bg-card border-border/60 focus-visible:ring-1"
        placeholder={placeholder}
      />
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