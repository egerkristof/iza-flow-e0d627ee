import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { CAL_URL } from "@/components/marketing/home/shared";
import type { DiagnosticResult } from "@/lib/diagnostic-scoring";
import { ArrowRight, Mail, TrendingDown, ChevronDown, ChevronUp, Loader2, Info, Copy, Check, Users, Zap } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Props {
  result: DiagnosticResult;
  answers: Record<string, number>;
  existingRecordId?: string | null;
  sessionId?: string | null;
}

const BENCHMARK_AVG = 35;

const COST_TRANSLATIONS: Record<string, { low: string; mid: string; high: string }> = {
  standard_internalization: {
    low: "Every AI session starts from zero. Across a 10-person team, that's roughly 5 to 10 hours per week spent re-explaining context that already exists in your team's methodology docs, past projects, and senior people's heads.",
    mid: "Some standards reach AI sessions, but inconsistently. The 2 to 3 hours per person per week lost to re-prompting is the visible cost. The hidden cost: your best people's judgment isn't reaching the work, so output quality depends on who's prompting rather than what the team collectively knows. Your strongest operators end up supervising instead of doing their highest-value creative and strategic work.",
    high: "Your standards are actively shaping AI sessions. That's rare. New hires ramp faster, senior review shifts from correction to strategy, and your methodology travels with the process, not individual people. Your strongest operators are freed to focus on the creative, strategic work that actually moves the business forward.",
  },
  output_consistency: {
    low: "If two people on your team get the same brief, you'll get two very different outputs. That means rework cycles of 3 to 5 hours per deliverable, plus a trust problem: stakeholders can tell when quality depends on who did the work.",
    mid: "Outputs are recognisable but uneven. The 30 to 40% excess senior review time is a symptom, not the root cause. The real issue: your team's quality ceiling is determined by individual capability, not collective knowledge. Your best people's approaches aren't compounding into team-wide standards. They're locked in individual workflows, and every project starts from scratch instead of building on the last.",
    high: "Stakeholders get your team's quality standard regardless of who delivers. That's a genuine competitive moat. You can grow the team without diluting what makes your work distinctive, and your strongest people push the quality frontier instead of maintaining the baseline.",
  },
  knowledge_compounding: {
    low: "Your team pays for the same learning curve every project. When someone figures out a better prompting approach or workflow, it stays with them. Multiply that by your team size: you're funding individual experiments, not building collective capability.",
    mid: "Knowledge spreads, but it takes 4 to 6 weeks for a good technique to reach the whole team, if it ever does. The real cost isn't the delay. It's that each project starts from scratch instead of standing on the shoulders of the last one. Your team is improving linearly when it should be compounding. And every person who leaves takes learned capability with them.",
    high: "Each project genuinely makes the next one better. Your team's collective capability compounds rather than resets, and survives turnover. This is what separates high-growth teams from the rest: not individual brilliance, but shared intelligence that accelerates over time.",
  },
  collective_visibility: {
    low: "You have zero visibility into how your team uses AI day-to-day. You can't answer: who's struggling, who found a breakthrough, or whether AI is actually improving output quality. You're managing a black box.",
    mid: "You have anecdotal visibility through hallway conversations and occasional Slack shares. But the question that matters is unanswerable: is your AI investment making the team more capable, or just faster at mediocre work? Without systematic visibility, your strongest people's breakthroughs stay siloed, and juniors can't learn from how seniors navigate complexity.",
    high: "Your team can see how colleagues navigate complexity with AI, especially juniors learning from seniors. This is how institutional expertise actually transfers in the AI age. Your collective intelligence is observable, shareable, and continuously improving.",
  },
  learning_velocity: {
    low: "Projects end and lessons vanish. After 6+ months of AI tool investment, your team's approach hasn't meaningfully changed. You're spending on licenses but not building capability. That's a negative ROI trajectory.",
    mid: "Some learning happens, but it takes a quarter to change how the team works. The real cost: while your team iterates slowly, competitors who learn faster compound their advantage every month. After 12 months, that gap isn't linear, it's exponential. And the creative, strategic potential your people have is consumed by re-solving problems that should already be solved.",
    high: "New techniques reach your whole team within days. In a landscape where AI capabilities change monthly, this speed of adaptation is a genuine strategic advantage. Your team's capacity for higher-order, creative work grows with every improvement cycle.",
  },
};

const STRATEGIC_CONSEQUENCES: Record<string, { low: string; mid: string; high: string }> = {
  standard_internalization: {
    low: "Which means you can't scale output without scaling your most experienced people. Every new hire multiplies supervision load instead of reducing it.",
    mid: "Which means your growth is throttled by onboarding speed. New people take months to reach the quality bar your best people hit naturally.",
    high: "Which means you can take on more work without proportionally adding senior oversight. Your methodology is doing the quality control, not your calendar.",
  },
  output_consistency: {
    low: "Which means your team's output quality is unpredictable. You're investing in AI tools but getting individual-level variance instead of team-level consistency. Stakeholders notice, even if they don't say it yet.",
    mid: "Which means your capacity ceiling is set by your strongest operators, not your team size. You can't grow output without growing your key-person dependency.",
    high: "Which means your output quality holds as you grow. Consistency lets you systematise execution, reduce review overhead, and focus senior time on strategy rather than correction.",
  },
  knowledge_compounding: {
    low: "Which means your team is getting linearly better at best while competitors who compound knowledge are improving exponentially. After 12 months, that gap is not incremental. It's a different league.",
    mid: "Which means you're one resignation away from losing capabilities you can't rebuild. Tribal knowledge that isn't codified is organisational risk, not organisational memory.",
    high: "Which means your competitive advantage accelerates over time. Every project deposits knowledge that makes the next one faster, cheaper, or higher quality. That's a compounding asset on your balance sheet.",
  },
  collective_visibility: {
    low: "Which means your leadership decisions about AI investment are based on anecdote, not evidence. You're allocating budget to tools you can't measure and training you can't evaluate.",
    mid: "Which means you're making workforce and resource planning decisions blind. You don't know which roles AI is genuinely augmenting and which are just using it as a fancy search engine.",
    high: "Which means you can make data-informed decisions about where AI creates value and where it doesn't. That's the difference between strategic AI adoption and expensive experimentation.",
  },
  learning_velocity: {
    low: "Which means competitors who learn faster will compound their advantage every quarter. The gap between a learning team and a static one after 12 months is not linear. It's exponential.",
    mid: "Which means you're adopting AI capabilities 3 to 6 months behind the curve. In a market where tools and techniques shift quarterly, that delay translates directly to lost competitive positioning.",
    high: "Which means you're turning AI evolution speed into a strategic advantage, not just keeping pace. Speed of adaptation is the meta-skill that makes every other capability more valuable.",
  },
};

import { DIMENSION_LABELS, DIMENSION_DESCRIPTIONS } from "@/lib/diagnostic-scoring";

/* ── Prescriptive next-steps keyed by dimension ── */
const NEXT_STEPS: Record<string, { action: string; detail: string }> = {
  standard_internalization: {
    action: "Codify your top 3 workflows",
    detail: "Pick the 3 AI tasks your team runs most often. Document the context, constraints, and quality bar for each. Turn these into reusable prompt templates that any team member can execute consistently.",
  },
  output_consistency: {
    action: "Create a shared quality checklist",
    detail: "Define what 'good' looks like for your most common deliverables. Make it a living document your team reviews AI outputs against before sending. This eliminates the 'it depends who did it' problem.",
  },
  knowledge_compounding: {
    action: "Start a weekly 'What I learned' ritual",
    detail: "Dedicate 15 minutes each week for the team to share one AI technique, prompt improvement, or workflow shortcut they discovered. Capture these in a shared repository so knowledge survives turnover.",
  },
  collective_visibility: {
    action: "Run a monthly AI usage audit",
    detail: "Survey your team on which AI tools they use, for what tasks, and what's working or not. Aggregate the results to spot patterns: who's struggling, who found a breakthrough, and where investment is wasted.",
  },
  learning_velocity: {
    action: "Assign an 'AI scout' rotation",
    detail: "Each week, one team member spends 30 minutes testing a new AI capability or technique and reports back. This ensures your team stays current without everyone having to track the landscape individually.",
  },
};

function SharePrompt({ variant }: { variant: "inline" | "card" }) {
  const [copied, setCopied] = useState(false);
  const diagnosticUrl = `${window.location.origin}/diagnostic`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(diagnosticUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === "inline") {
    return (
      <div className="flex items-center justify-center gap-2 pt-1">
        <Users className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          When 2+ people from your org complete this, we generate a{" "}
          <span className="font-semibold text-foreground">free team maturity report</span>.
        </p>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1 shrink-0" onClick={handleCopy}>
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy link"}
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-dashed border-primary/20">
      <CardContent className="p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <Users className="w-5 h-5 text-primary shrink-0 mt-0.5 sm:mt-0" />
        <div className="flex-1 space-y-0.5">
          <p className="text-sm font-semibold text-foreground">Send this to your team</p>
          <p className="text-xs text-muted-foreground">
            When 2+ people from your organisation take the diagnostic, we generate a free team-level AI maturity report automatically.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5 shrink-0 w-full sm:w-auto" onClick={handleCopy}>
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Link copied!" : "Copy diagnostic link"}
        </Button>
      </CardContent>
    </Card>
  );
}

/* ── Lightweight email capture: "Save as shareable PDF" ── */
function EmailCapture({
  email,
  setEmail,
  loading,
  submitted,
  onSubmit,
}: {
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  submitted: boolean;
  onSubmit: () => void;
}) {
  if (loading) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5 md:p-6 text-center space-y-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin mx-auto" />
          <p className="text-sm font-semibold text-foreground">Generating your report…</p>
        </CardContent>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5 md:p-6 text-center space-y-3">
          <p className="text-base font-semibold text-foreground">✓ Your results report is on its way.</p>
          <p className="text-xs text-muted-foreground">Check your spam or junk folder if it doesn't arrive within a couple of minutes.</p>
          <SharePrompt variant="inline" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardContent className="p-5 md:p-6 space-y-3">
        <div className="flex items-start gap-3">
          <div
            className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
            style={{ background: "hsl(var(--primary) / 0.1)" }}
          >
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">
              Get your detailed AI execution report
            </p>
            <p className="text-xs text-muted-foreground">
              Includes a personalised 3-step action plan, success metrics to track, a cost-of-inaction estimate, and a comparison you can forward to leadership.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="email"
            placeholder="your@work-email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-11"
          />
          <Button
            onClick={onSubmit}
            disabled={loading || !email.trim()}
            variant="default"
            className="w-full sm:w-auto"
          >
            <Mail className="w-4 h-4" />
            Send Report
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground/60">
          We may follow up to discuss your results. Read our{" "}
          <a href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
        </p>
      </CardContent>
    </Card>
  );
}

/* ── Ungated Action Plan based on weakest dimensions ── */
function ActionPlan({
  weakest,
  secondWeakest,
  overall,
}: {
  weakest: { dimension: string; score: number };
  secondWeakest: { dimension: string; score: number };
  overall: number;
}) {
  const steps = [weakest, secondWeakest]
    .map((d) => {
      const step = NEXT_STEPS[d.dimension];
      if (!step) return null;
      const label = DIMENSION_LABELS[d.dimension as keyof typeof DIMENSION_LABELS] || d.dimension;
      return { ...step, label, score: d.score, dimension: d.dimension };
    })
    .filter(Boolean) as { action: string; detail: string; label: string; score: number; dimension: string }[];

  return (
    <Card className="border-primary/30 overflow-hidden shadow-[0_0_30px_-8px_hsl(var(--primary)/0.12)]"
      style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, hsl(var(--card)) 50%, hsl(var(--primary) / 0.04) 100%)" }}
    >
      <CardContent className="p-5 md:p-7 space-y-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-primary/70">
              Your Action Plan
            </p>
          </div>
          <p className="text-lg md:text-xl font-bold text-foreground">
            {overall >= 55
              ? "Two moves to reach the top 1%"
              : "Start here to close your biggest gaps"}
          </p>
          <p className="text-sm text-muted-foreground">
            Based on your two weakest dimensions. These are the highest-leverage changes your team can make this month.
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={step.dimension} className="rounded-xl border border-border bg-background p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-primary text-primary-foreground shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm font-bold text-foreground">{step.action}</p>
                </div>
                <span
                  className="text-xs font-bold tabular-nums px-2 py-0.5 rounded-full"
                  style={{
                    background: step.score <= 33 ? "hsl(0 72% 51% / 0.1)" : "hsl(38 92% 50% / 0.1)",
                    color: step.score <= 33 ? "hsl(0 72% 51%)" : "hsl(38 92% 50%)",
                  }}
                >
                  {step.label}: {step.score}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                {step.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Teaser for the debrief */}
        <p className="text-xs text-muted-foreground/70 text-center pt-1">
          These are starting points. In a diagnostic debrief, we build the full roadmap together.
        </p>
      </CardContent>
    </Card>
  );
}

export function DiagnosticResults({ result, answers, existingRecordId, sessionId }: Props) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const sorted0 = [...result.dimensions].sort((a, b) => a.score - b.score);
  const [expandedDim, setExpandedDim] = useState<string | null>(sorted0[0]?.dimension ?? null);

  const scoreColor =
    result.overall <= 30
      ? "hsl(0 72% 51%)"
      : result.overall <= 55
        ? "hsl(38 92% 50%)"
        : result.overall <= 75
          ? "hsl(200 90% 40%)"
          : "hsl(155 72% 36%)";

  const sorted = [...result.dimensions].sort((a, b) => a.score - b.score);
  const weakest = sorted[0];
  const secondWeakest = sorted[1];

  async function handleEmailSubmit() {
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-diagnostic-report", {
        body: {
          email: email.trim(),
          respondent_role: null,
          team_size: null,
          team_leader_email: null,
          overall: result.overall,
          archetype: result.archetype,
          dimensions: result.dimensions,
          answers,
          scores: Object.fromEntries(result.dimensions.map((d) => [d.dimension, d.score])),
          session_id: sessionId || null,
          diagnostic_result_id: existingRecordId || null,
          results_base_url: window.location.origin,
        },
      });

      if (error || data?.success !== true) {
        throw new Error(data?.error || error?.message || "Failed to send your report.");
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Email submit error:", err);
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: err?.message || "Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500 space-y-10">

      {/* === 1. SCORE HERO === */}
      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          {/* Score hero zone */}
          <div className="text-center space-y-3 px-6 pt-8 pb-6"
            style={{
              background: "linear-gradient(180deg, hsl(var(--primary) / 0.06) 0%, transparent 100%)",
            }}
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
              Your AI Execution Score
            </p>
            <div
              className="text-7xl md:text-8xl font-black tabular-nums"
              style={{ color: scoreColor }}
            >
              {result.overall}
            </div>
            <p className="text-lg md:text-xl font-semibold text-foreground">
              {result.archetype.label}
            </p>
            <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
              {result.archetype.tagline}
            </p>

            {/* Benchmark scale */}
            <div className="pt-4 max-w-md mx-auto space-y-3">
              <div className="relative h-2.5 rounded-full bg-secondary overflow-visible">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ width: `${Math.min(result.overall, 100)}%`, background: "var(--gradient-brand-btn)" }}
                />
                {[
                  { value: BENCHMARK_AVG, label: "Avg" },
                  { value: 55, label: "Top 10%" },
                  { value: 75, label: "Top 1%" },
                ].map((b) => (
                  <div key={b.value} className="absolute top-full flex flex-col items-center" style={{ left: `${b.value}%`, transform: "translateX(-50%)" }}>
                    <div className="w-px h-2 bg-border mt-0.5" />
                    <span className="text-[9px] text-muted-foreground/60 mt-0.5 whitespace-nowrap">{b.label}</span>
                    <span className="text-[10px] font-bold text-muted-foreground/70">{b.value}</span>
                  </div>
                ))}
                <div
                  className="absolute -top-1 flex flex-col items-center"
                  style={{ left: `${Math.min(result.overall, 100)}%`, transform: "translateX(-50%)" }}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-background shadow-md"
                    style={{ background: scoreColor }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-start pt-5 text-[10px] text-muted-foreground/50">
                <span>0</span>
                <span>100</span>
              </div>
              <p className="text-[10px] text-muted-foreground/50 text-center">
                Based on ServiceNow 2025 AI Maturity Index · 4,500 executives · 16 countries
              </p>
            </div>

            {/* Scoring methodology */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-1.5 mx-auto text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors pt-1">
                <Info className="h-3 w-3" />
                How is this scored?
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <div className="text-[11px] text-muted-foreground/70 max-w-lg mx-auto space-y-1.5 text-left bg-muted/30 rounded-lg p-3">
                  <p><strong className="text-muted-foreground">10 scenario-based questions</strong> across 5 dimensions, each scored 1-4 based on observable team behaviours (not aspirations).</p>
                  <p><strong className="text-muted-foreground">Dimension scores</strong> are the normalised average of 2 questions per dimension, scaled to 0-100. Equal weighting across all dimensions.</p>
                  <p><strong className="text-muted-foreground">Overall score</strong> = unweighted mean of all 5 dimension scores.</p>
                  <p><strong className="text-muted-foreground">Benchmarks</strong> are calibrated against the ServiceNow 2025 Enterprise AI Maturity Index (4,500 C-level executives, 16 countries), which found the global average at 35/100, down from 44 YoY, with fewer than 1% of organisations scoring above 50.</p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Dimension bars */}
          <div className="px-4 md:px-6 py-5 space-y-3">
            {result.dimensions.map((d) => {
              const label = DIMENSION_LABELS[d.dimension as keyof typeof DIMENSION_LABELS] || d.label;
              return (
                <div key={d.dimension} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted-foreground w-24 shrink-0 text-right">{label}</span>
                  <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${d.score}%`, background: "var(--gradient-brand-btn)" }}
                    />
                  </div>
                  <span className="text-xs font-bold tabular-nums w-8 text-foreground">{d.score}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* === 2. UNGATED ACTION PLAN === */}
      <ActionPlan
        weakest={weakest}
        secondWeakest={secondWeakest}
        overall={result.overall}
      />

      {/* === 3. DIMENSION BREAKDOWN === */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {result.overall >= 67
            ? "Where your AI execution is paying off"
            : result.overall >= 40
              ? "Where your AI investment is leaking value"
              : "Why your AI investment isn't compounding yet"}
        </h3>
        {result.dimensions.map((d) => {
          const isExpanded = expandedDim === d.dimension;
          const costs = COST_TRANSLATIONS[d.dimension];
          const tier = d.score <= 33 ? "low" : d.score <= 66 ? "mid" : "high";
          const costText = costs ? costs[tier] : d.implication;
          const isPositive = d.score > 66;

          return (
            <Card key={d.dimension} className="border-border">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {DIMENSION_LABELS[d.dimension as keyof typeof DIMENSION_LABELS] || d.label}
                  </p>
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{
                      color:
                        d.score <= 33
                          ? "hsl(0 72% 51%)"
                          : d.score <= 66
                            ? "hsl(38 92% 50%)"
                            : "hsl(155 72% 36%)",
                    }}
                  >
                    {d.score}/100
                  </span>
                </div>
                <p className="text-xs text-muted-foreground/70 italic">
                  {DIMENSION_DESCRIPTIONS[d.dimension as keyof typeof DIMENSION_DESCRIPTIONS] || ""}
                </p>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${d.score}%`,
                      background: "var(--gradient-brand-btn)",
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{d.insight}</p>

                <button
                  onClick={() => setExpandedDim(isExpanded ? null : d.dimension)}
                  className={`flex items-center gap-1 text-xs font-semibold transition-colors pt-1 ${isPositive ? "text-emerald-600 hover:text-emerald-500" : "text-primary hover:text-primary/80"}`}
                >
                  {isPositive ? null : <TrendingDown className="w-3.5 h-3.5" />}
                  {isExpanded ? "Hide" : isPositive ? "What this means for your team" : "What this costs your team"}
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {isExpanded && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-sm text-foreground/80 bg-muted/50 rounded-lg p-3 leading-relaxed">
                      {costText}
                    </p>
                    {STRATEGIC_CONSEQUENCES[d.dimension]?.[tier] && (
                      <p className="text-sm font-medium text-foreground/90 bg-primary/5 border border-primary/10 rounded-lg p-3 leading-relaxed">
                        {STRATEGIC_CONSEQUENCES[d.dimension][tier]}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* === 4. LIGHTWEIGHT EMAIL CAPTURE === */}
      <EmailCapture
        email={email}
        setEmail={setEmail}
        loading={loading}
        submitted={submitted}
        onSubmit={handleEmailSubmit}
      />

      {/* === 5. BOOK A DEBRIEF CTA === */}
      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          <div className="text-center px-5 py-6 md:py-8 space-y-4"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, hsl(var(--primary) / 0.02) 100%)" }}
          >
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-primary/70">
              Go deeper
            </p>
            <p className="text-lg md:text-xl font-bold text-foreground">
              Book your Diagnostic Debrief
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              20 minutes. We'll unpack your score, map your gaps to specific team behaviours, and build a prioritised roadmap to get from {result.overall} to 55+.
            </p>
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="brand" size="lg" className="text-base">
                Book your Debrief <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* === 6. SHARE / TEAM PROMPT === */}
      <SharePrompt variant="card" />
    </div>
  );
}
