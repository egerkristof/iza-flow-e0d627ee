import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";

type Brief = {
  title: string;
  shape_of_the_patch: string;
  what_is_coming: string;
  ai_shaped_future: string[];
  what_it_takes: string[];
};

type Inputs = { strategy: string; market: string; team: string; ai: string };

const PROMPTS: Array<{ key: keyof Inputs; label: string; question: string; helper: string }> = [
  {
    key: "strategy",
    label: "Strategy",
    question: "What is the organisation actually trying to become over the next 18 months?",
    helper: "Not the slide version. The version you would say in a room with two people.",
  },
  {
    key: "market",
    label: "Market reality",
    question: "What is moving in your market that your function will have to absorb?",
    helper: "Buyer behaviour, regulation, competitor moves, anything that is genuinely shifting.",
  },
  {
    key: "team",
    label: "Team reality",
    question: "What does your team actually do day to day, and where does the work currently break?",
    helper: "The work as it really runs. Where it stalls, where it gets redone, where knowledge sits in heads.",
  },
  {
    key: "ai",
    label: "AI reality",
    question: "What AI is already in and around your patch, and what is it doing or failing to do?",
    helper: "Copilots, ChatGPT habits, point tools. What it touches. Where it falls short.",
  },
];

export default function TheBrief() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [step, setStep] = useState<"intro" | "prompts" | "generating" | "brief">("intro");
  const [activePrompt, setActivePrompt] = useState(0);
  const [inputs, setInputs] = useState<Inputs>({ strategy: "", market: "", team: "", ai: "" });
  const [brief, setBrief] = useState<Brief | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const promptRef = useRef<HTMLDivElement>(null);
  const briefRef = useRef<HTMLDivElement>(null);

  // Load shared brief by id
  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from("briefs").select("inputs, output").eq("id", id).maybeSingle();
      if (error || !data) {
        toast.error("Brief not found.");
        navigate("/the-brief", { replace: true });
        return;
      }
      setInputs(data.inputs as Inputs);
      setBrief(data.output as Brief);
      setSavedId(id);
      setStep("brief");
    })();
  }, [id, navigate]);

  const scrollTo = (el: HTMLElement | null) => {
    setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const start = () => {
    setStep("prompts");
    scrollTo(promptRef.current);
  };

  const nextPrompt = () => {
    if (activePrompt < PROMPTS.length - 1) {
      setActivePrompt(activePrompt + 1);
      scrollTo(promptRef.current);
    } else {
      generate();
    }
  };

  const prevPrompt = () => {
    if (activePrompt > 0) setActivePrompt(activePrompt - 1);
  };

  const generate = async () => {
    setStep("generating");
    scrollTo(briefRef.current);
    try {
      const { data, error } = await supabase.functions.invoke("generate-brief", { body: { inputs } });
      if (error) throw error;
      if (!data?.brief) throw new Error("No brief returned.");
      setBrief(data.brief);
      setStep("brief");
      setTimeout(() => scrollTo(briefRef.current), 100);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Could not generate the brief. Try again.");
      setStep("prompts");
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
        .insert({ email, inputs, output: brief })
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

  const currentPrompt = PROMPTS[activePrompt];
  const currentValue = inputs[currentPrompt.key];
  const canAdvance = currentValue.trim().length > 10;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Intro */}
      <section className="min-h-screen flex items-center px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">The Brief</div>
          <h1 className="text-4xl md:text-6xl font-light leading-[1.05] tracking-tight text-foreground mb-8">
            A working brief on what comes next, for the patch you actually run.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 max-w-2xl">
            For the people in the org who already think in foundations, end to end, and need a frame to put it down.
          </p>
          {step === "intro" && (
            <Button size="lg" onClick={start} className="rounded-full px-8 h-12">
              Start the Brief
            </Button>
          )}
          {step !== "intro" && (
            <div className="text-sm text-muted-foreground">
              {step === "brief" ? "Brief ready below." : "Scroll down."}
            </div>
          )}
        </div>
      </section>

      {/* Prompts */}
      {(step === "prompts" || step === "generating" || step === "brief") && !id && (
        <section ref={promptRef} className="min-h-screen flex items-center px-6 md:px-12 border-t border-border/40">
          <div className="max-w-3xl mx-auto w-full py-20">
            {step === "prompts" && (
              <>
                <div className="flex items-center justify-between mb-12">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {currentPrompt.label}
                  </div>
                  <div className="text-xs text-muted-foreground tabular-nums">
                    {activePrompt + 1} of {PROMPTS.length}
                  </div>
                </div>
                <h2 className="text-2xl md:text-4xl font-light leading-tight text-foreground mb-4">
                  {currentPrompt.question}
                </h2>
                <p className="text-sm text-muted-foreground mb-8">{currentPrompt.helper}</p>
                <Textarea
                  value={currentValue}
                  onChange={(e) => setInputs({ ...inputs, [currentPrompt.key]: e.target.value })}
                  className="min-h-[200px] text-base leading-relaxed resize-none bg-card border-border/60 focus-visible:ring-1"
                  placeholder="Write what you actually think."
                  autoFocus
                />
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="ghost"
                    onClick={prevPrompt}
                    disabled={activePrompt === 0}
                    className="text-muted-foreground"
                  >
                    Back
                  </Button>
                  <Button onClick={nextPrompt} disabled={!canAdvance} className="rounded-full px-8">
                    {activePrompt === PROMPTS.length - 1 ? "Write the brief" : "Next"}
                  </Button>
                </div>
                <div className="mt-8 flex gap-1">
                  {PROMPTS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-0.5 flex-1 transition-colors ${
                        i <= activePrompt ? "bg-foreground/60" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            {step === "generating" && (
              <div className="text-center py-20">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
                  Writing the brief
                </div>
                <div className="text-2xl font-light text-foreground mb-3">Reading your four answers.</div>
                <div className="text-muted-foreground">This takes about twenty seconds.</div>
                <div className="mt-12 flex justify-center">
                  <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Brief */}
      {step === "brief" && brief && (
        <section ref={briefRef} className="px-6 md:px-12 border-t border-border/40 py-20 md:py-32">
          <div className="max-w-2xl mx-auto">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-10">The Brief</div>

            <article
              className="prose-brief"
              style={{
                fontFamily: 'Georgia, "Iowan Old Style", "Apple Garamond", serif',
              }}
            >
              <h1 className="text-3xl md:text-4xl font-normal leading-tight text-foreground mb-12">
                {brief.title}
              </h1>

              <Section heading="The shape of the patch">{brief.shape_of_the_patch}</Section>
              <Section heading="What is coming for it">{brief.what_is_coming}</Section>

              <SectionHeading>What an AI-shaped version of this function looks like</SectionHeading>
              <div className="space-y-6">
                {brief.ai_shaped_future.map((p, i) => (
                  <p key={i} className="text-lg leading-[1.75] text-foreground">
                    {p}
                  </p>
                ))}
              </div>

              <SectionHeading>What it would take to make this real</SectionHeading>
              <ol className="space-y-5 list-none pl-0">
                {brief.what_it_takes.map((p, i) => (
                  <li key={i} className="text-lg leading-[1.75] text-foreground flex gap-4">
                    <span className="text-muted-foreground tabular-nums shrink-0 w-6">{i + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ol>
            </article>

            {/* Handoff */}
            <div className="mt-24 pt-12 border-t border-border/40 font-sans">
              <p className="text-xl font-light text-foreground leading-snug mb-3">
                The brief points at a system underneath it. That system is what LIZA is.
              </p>
              <p className="text-muted-foreground mb-8">
                Defined context, captured standards, one place that holds them and feeds every tool. The brief
                names the shape. LIZA is the build.
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-14 mb-5 font-sans font-medium"
    >
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