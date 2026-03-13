import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { CAL_URL } from "@/components/marketing/home/shared";
import type { DiagnosticResult } from "@/lib/diagnostic-scoring";
import { ArrowRight, Mail, TrendingDown, ChevronDown, ChevronUp, Loader2, Sparkles, Info, Copy, Check, Users } from "lucide-react";
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
const BENCHMARK_HIGH = 55;

const COST_TRANSLATIONS: Record<string, { low: string; mid: string; high: string }> = {
  standard_internalization: {
    low: "Every AI session starts from zero. Across a 10-person team, that's roughly 5 to 10 hours per week spent re-explaining context that already exists in your team's methodology docs, past projects, and senior people's heads.",
    mid: "Some standards reach AI sessions, but inconsistently. You're likely seeing 2 to 3 hours per person per week lost to partial re-prompting, and the output quality gap between your best and newest people keeps widening.",
    high: "Your standards are actively shaping AI sessions. That's rare. New hires ramp faster, senior review shifts from correction to strategy, and your methodology travels with the process, not individual people.",
  },
  output_consistency: {
    low: "If two people on your team get the same brief, you'll get two very different outputs. That means rework cycles of 3 to 5 hours per deliverable, plus a trust problem: stakeholders can tell when quality depends on who did the work.",
    mid: "Outputs are recognisable but uneven. Senior review time is likely 30 to 40% higher than it needs to be, because reviewers can't trust that AI-assisted work followed the team's approach.",
    high: "Stakeholders get your team's quality standard regardless of who delivers. That's a genuine competitive moat. You can grow the team without diluting what makes your work distinctive.",
  },
  knowledge_compounding: {
    low: "Your team pays for the same learning curve every project. When someone figures out a better prompting approach or workflow, it stays with them. Multiply that by your team size: you're funding individual experiments, not building collective capability.",
    mid: "Knowledge spreads, but it takes 4–6 weeks for a good technique to reach the whole team, if it ever does. Meanwhile, 2–3 people are solving problems someone else already cracked last month.",
    high: "Each project genuinely makes the next one better. This compounding effect is what separates high-growth teams from the rest. You're building collective intelligence, not just individual skill.",
  },
  collective_visibility: {
    low: "You have zero visibility into how your team uses AI day-to-day. You can't answer: who's struggling, who found a breakthrough, or whether AI is actually improving output quality. You're managing a black box.",
    mid: "You have anecdotal visibility through hallway conversations and occasional Slack shares. But you couldn't produce a report on AI usage patterns, effectiveness, or ROI for your leadership team if asked today.",
    high: "Your team can see how colleagues navigate complexity with AI, especially juniors learning from seniors. This is how institutional expertise actually transfers in the AI age. Well done.",
  },
  learning_velocity: {
    low: "Projects end and lessons vanish. After 6+ months of AI tool investment, your team's approach hasn't meaningfully changed. You're spending on licenses but not building capability. That's a negative ROI trajectory.",
    mid: "Some learning happens, but it takes a quarter to change how the team works. At current velocity, you'll need 18+ months to reach the maturity that structured teams achieve in 3–4 months.",
    high: "New techniques reach your whole team within days. In a landscape where AI capabilities change monthly, this speed of adaptation is a genuine strategic advantage.",
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
            When 2+ people from your organisation take the diagnostic, we can generate a free team-level AI maturity report.
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

function EmailCapture({
  email,
  setEmail,
  respondentRole,
  setRespondentRole,
  teamSize,
  setTeamSize,
  loading,
  submitted,
  onSubmit,
  weakestLabel,
  weakestScore,
  secondWeakestLabel,
  secondWeakestScore,
  variant = "primary",
}: {
  email: string;
  setEmail: (v: string) => void;
  respondentRole: string;
  setRespondentRole: (v: string) => void;
  teamSize: string;
  setTeamSize: (v: string) => void;
  loading: boolean;
  submitted: boolean;
  onSubmit: () => void;
  weakestLabel: string;
  weakestScore: number;
  secondWeakestLabel: string;
  secondWeakestScore: number;
  variant?: "primary" | "secondary";
}) {
  if (loading) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6 md:p-8 text-center space-y-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
          <p className="text-sm font-semibold text-foreground">Generating your action plan…</p>
          <p className="text-xs text-muted-foreground">This may take a few seconds while we personalise your results.</p>
        </CardContent>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6 md:p-8 text-center space-y-3">
          <p className="text-base font-semibold text-foreground">✓ Your action plan is on its way.</p>
          <p className="text-xs text-muted-foreground">Check your spam or junk folder if it doesn't arrive within a couple of minutes.</p>
          <SharePrompt variant="inline" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={
        variant === "primary"
          ? "border-primary/30 shadow-[0_0_30px_-8px_hsl(var(--primary)/0.15)]"
          : "border-primary/20 bg-primary/4"
      }
      style={
        variant === "primary"
          ? { background: "linear-gradient(135deg, hsl(var(--primary) / 0.08) 0%, hsl(var(--card)) 50%, hsl(var(--primary) / 0.05) 100%)" }
          : undefined
      }
    >
      <CardContent className={variant === "primary" ? "p-6 md:p-8 space-y-5" : "p-5 md:p-6 space-y-3"}>
        {/* Context: why this plan exists */}
        {variant === "primary" && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{
                background: weakestScore <= 33 ? "hsl(0 72% 51% / 0.1)" : "hsl(38 92% 50% / 0.1)",
                color: weakestScore <= 33 ? "hsl(0 72% 51%)" : "hsl(38 92% 50%)",
              }}
            >
              {weakestLabel}: {weakestScore}/100
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
              style={{
                background: secondWeakestScore <= 33 ? "hsl(0 72% 51% / 0.1)" : "hsl(38 92% 50% / 0.1)",
                color: secondWeakestScore <= 33 ? "hsl(0 72% 51%)" : "hsl(38 92% 50%)",
              }}
            >
              {secondWeakestLabel}: {secondWeakestScore}/100
            </span>
            <span className="text-xs text-muted-foreground">← driving your action plan</span>
          </div>
        )}

        <div className="flex items-start gap-3">
          {variant === "primary" && (
            <div
              className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5"
              style={{ background: "var(--gradient-brand-btn)" }}
            >
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
          <div className="space-y-1">
            <p className={variant === "primary" ? "text-xl font-bold text-foreground" : "text-sm font-semibold text-foreground"}>
              {variant === "primary"
                ? "Get your 3-step action plan"
                : "Want the action plan in your inbox?"}
            </p>
            <p className={variant === "primary" ? "text-sm text-muted-foreground leading-relaxed" : "text-xs text-muted-foreground"}>
              Based on your two weakest areas, we'll send a concrete plan showing what teams like yours changed to close these gaps and reach 55+.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Your role (e.g. CTO, VP Ops, Team Lead)"
              value={respondentRole}
              onChange={(e) => setRespondentRole(e.target.value.slice(0, 100))}
              className={variant === "primary" ? "flex-1 h-10 text-sm" : "flex-1 h-9 text-sm"}
            />
            <Select value={teamSize} onValueChange={setTeamSize}>
              <SelectTrigger className={variant === "primary" ? "sm:w-52 h-10 text-sm" : "sm:w-48 h-9 text-sm"}>
                <SelectValue placeholder="Your team's size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-10">2–10 people</SelectItem>
                <SelectItem value="11-50">11–50 people</SelectItem>
                <SelectItem value="51-200">51–200 people</SelectItem>
                <SelectItem value="200+">200+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={variant === "primary" ? "flex-1 h-12 text-base" : "flex-1 h-11"}
            />
            <Button
              onClick={onSubmit}
              disabled={loading || !email.trim() || !respondentRole.trim() || !teamSize}
              variant={variant === "primary" ? "brand" : "default"}
              size={variant === "primary" ? "lg" : "default"}
              className="w-full sm:w-auto"
            >
              <Mail className="w-4 h-4" />
              {variant === "primary" ? "Send My Action Plan" : "Send Results"}
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          💡 Check your spam/junk folder if you don't see it within a minute. We may follow up to discuss your results. Read our{" "}
          <a href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
        </p>
      </CardContent>
    </Card>
  );
}

export function DiagnosticResults({ result, answers, existingRecordId, sessionId }: Props) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [respondentRole, setRespondentRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
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
  const weakestLabel = DIMENSION_LABELS[weakest.dimension as keyof typeof DIMENSION_LABELS] || weakest.label;
  const secondWeakestLabel = DIMENSION_LABELS[secondWeakest.dimension as keyof typeof DIMENSION_LABELS] || secondWeakest.label;

  async function handleEmailSubmit() {
    if (!email.trim() || !respondentRole.trim() || !teamSize) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-diagnostic-report", {
        body: {
          email: email.trim(),
          respondent_role: respondentRole.trim(),
          team_size: teamSize,
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

      {/* === UNIFIED: Score + Dimensions in one card === */}
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

            {/* Benchmark context */}
            <div className="flex items-center justify-center gap-6 pt-2">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Industry average</p>
                <p className="text-sm font-bold text-muted-foreground">{BENCHMARK_AVG}</p>
                <p className="text-[10px] text-muted-foreground/60 max-w-[120px]">ServiceNow AI Maturity Index 2025 (4,500 execs)</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">You</p>
                <p className="text-sm font-black" style={{ color: scoreColor }}>
                  {result.overall}
                </p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
               <p className="text-xs text-muted-foreground">Codified teams</p>
                <p className="text-sm font-bold text-primary">{BENCHMARK_HIGH}+</p>
                <p className="text-[10px] text-muted-foreground/60 max-w-[120px]">Teams with shared AI standards</p>
              </div>
            </div>

            {/* Scoring methodology */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-1.5 mx-auto text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors pt-1">
                <Info className="h-3 w-3" />
                How is this scored?
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <div className="text-[11px] text-muted-foreground/70 max-w-lg mx-auto space-y-1.5 text-left bg-muted/30 rounded-lg p-3">
                  <p><strong className="text-muted-foreground">10 scenario-based questions</strong> across 5 dimensions, each scored 1–4 based on observable team behaviours (not aspirations).</p>
                  <p><strong className="text-muted-foreground">Dimension scores</strong> are the normalised average of 2 questions per dimension, scaled to 0–100. Equal weighting across all dimensions.</p>
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



      {/* Dimension breakdown with business cost framing */}
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

      {/* === Email capture, after breakdown === */}
      <EmailCapture
        email={email}
        setEmail={setEmail}
        respondentRole={respondentRole}
        setRespondentRole={setRespondentRole}
        teamSize={teamSize}
        setTeamSize={setTeamSize}
        loading={loading}
        submitted={submitted}
        onSubmit={handleEmailSubmit}
        weakestLabel={weakestLabel}
        weakestScore={weakest.score}
        secondWeakestLabel={secondWeakestLabel}
        secondWeakestScore={secondWeakest.score}
        variant="primary"
      />

      {/* === You vs 55+ contrast + CTA === */}
      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          <div className="px-5 pt-5 pb-3">
            <p className="text-sm font-bold text-foreground mb-3">Your team today vs. codified teams (55+)</p>
          </div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-t border-b border-border bg-muted/40">
                <th className="text-left py-2 px-4 font-semibold text-muted-foreground"></th>
                <th className="text-center py-2 px-4 font-semibold" style={{ color: scoreColor }}>You ({result.overall})</th>
                <th className="text-center py-2 px-4 font-semibold text-primary">55+ teams</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "AI session prep", you: "Re-explain from scratch", them: "Standards loaded automatically" },
                { label: "Output quality", you: "Depends who does it", them: "Consistent regardless of person" },
                { label: "New technique found", you: "Stays with one person", them: "Reaches whole team in days" },
                { label: "Senior review time", you: "Catching basic errors", them: "Focused on strategy" },
                { label: "AI ROI visibility", you: "Can't measure it", them: "Tracked and reported" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-2 px-4 font-medium text-muted-foreground">{row.label}</td>
                  <td className="py-2 px-4 text-center text-destructive/80">{row.you}</td>
                  <td className="py-2 px-4 text-center text-primary font-medium">{row.them}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-center px-5 py-5 space-y-3">
            <p className="text-sm text-muted-foreground">
              20 min · We'll unpack your score and show you what teams scoring 55+ do differently.
            </p>
            <a href={CAL_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="brand" size="lg" className="text-base">
                Book your Diagnostic Debrief <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Share prompt */}
      <SharePrompt variant="card" />
    </div>
  );
}
