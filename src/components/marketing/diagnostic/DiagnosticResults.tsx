import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { CAL_URL } from "@/components/marketing/home/shared";
import type { DiagnosticResult } from "@/lib/diagnostic-scoring";
import { ArrowRight, Mail, TrendingDown, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  result: DiagnosticResult;
  answers: Record<string, number>;
}

const BENCHMARK_AVG = 38;
const BENCHMARK_HIGH = 72;

const COST_TRANSLATIONS: Record<string, { low: string; mid: string; high: string }> = {
  standard_internalization: {
    low: "Every AI session starts from zero. Across a 10-person team, that's roughly 5–10 hours per week spent re-explaining context that already exists in your firm's methodology docs, past projects, and senior people's heads.",
    mid: "Some standards reach AI sessions, but inconsistently. You're likely seeing 2–3 hours per person per week lost to partial re-prompting — and the output quality gap between your best and newest people keeps widening.",
    high: "Your standards are actively shaping AI sessions — that's rare. New hires ramp faster, senior review shifts from correction to strategy, and your methodology travels with the process, not individual people.",
  },
  output_consistency: {
    low: "If two people on your team get the same brief, you'll get two very different outputs. That means rework cycles of 3–5 hours per deliverable, plus a client trust problem: they can tell when your A-team isn't in the room.",
    mid: "Outputs are recognisable but uneven. Senior review time is likely 30–40% higher than it needs to be, because reviewers can't trust that AI-assisted work followed the firm's approach.",
    high: "Clients get your firm's quality standard regardless of who delivers — that's a genuine competitive moat. You can grow the team without diluting what makes your work distinctive.",
  },
  knowledge_compounding: {
    low: "Your firm pays for the same learning curve every project. When someone figures out a better prompting approach or workflow, it stays with them. Multiply that by your team size — you're funding individual experiments, not building organisational capability.",
    mid: "Knowledge spreads, but it takes 4–6 weeks for a good technique to reach the whole team, if it ever does. Meanwhile, 2–3 people are solving problems someone else already cracked last month.",
    high: "Each project genuinely makes the next one better. This compounding effect is what separates high-growth firms from the rest — you're building institutional intelligence, not just individual skill.",
  },
  collective_visibility: {
    low: "You have zero visibility into how your team uses AI day-to-day. You can't answer: who's struggling, who found a breakthrough, or whether AI is actually improving output quality. You're managing a black box.",
    mid: "You have anecdotal visibility — hallway conversations, occasional Slack shares. But you couldn't produce a report on AI usage patterns, effectiveness, or ROI for your leadership team if asked today.",
    high: "Your team can see how colleagues navigate complexity with AI — especially juniors learning from seniors. This is how institutional expertise actually transfers in the AI age. Well done.",
  },
  learning_velocity: {
    low: "Projects end and lessons vanish. After 6+ months of AI tool investment, your team's approach hasn't meaningfully changed. You're spending on licenses but not building capability — that's a negative ROI trajectory.",
    mid: "Some learning happens, but it takes a quarter to change how the team works. At current velocity, you'll need 18+ months to reach the maturity that structured firms achieve in 3–4 months.",
    high: "New techniques reach your whole team within days. In a landscape where AI capabilities change monthly, this speed of adaptation is a genuine strategic advantage.",
  },
};

export function DiagnosticResults({ result, answers }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedDim, setExpandedDim] = useState<string | null>(null);

  const SHORT_LABELS: Record<string, string> = {
    standard_internalization: "Standards Adoption",
    output_consistency: "Output Consistency",
    knowledge_compounding: "Knowledge Compounding",
    collective_visibility: "Team Visibility",
    learning_velocity: "Learning Velocity",
  };

  const scoreColor =
    result.overall <= 30
      ? "hsl(0 72% 51%)"
      : result.overall <= 55
        ? "hsl(38 92% 50%)"
        : result.overall <= 75
          ? "hsl(200 90% 40%)"
          : "hsl(155 72% 36%)";

  const weakest = [...result.dimensions].sort((a, b) => a.score - b.score)[0];

  async function handleEmailSubmit() {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await (supabase as any).from("diagnostic_results").insert({
        email: email.trim(),
        answers,
        scores: Object.fromEntries(result.dimensions.map((d) => [d.dimension, d.score])),
        archetype: result.archetype.label,
        overall_score: result.overall,
      });

      const reportUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-diagnostic-report`;
      await fetch(reportUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          email: email.trim(),
          overall: result.overall,
          archetype: result.archetype,
          dimensions: result.dimensions,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Email submit error:", err);
      setSubmitted(true);
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500 space-y-10">
      {/* Score hero */}
      <div className="text-center space-y-3">
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
            <p className="text-xs text-muted-foreground">Average firm</p>
            <p className="text-sm font-bold text-muted-foreground">{BENCHMARK_AVG}</p>
            <p className="text-[10px] text-muted-foreground/60 max-w-[100px]">based on early diagnostic responses</p>
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
            <p className="text-xs text-muted-foreground">Structured firms</p>
            <p className="text-sm font-bold text-primary">{BENCHMARK_HIGH}+</p>
            <p className="text-[10px] text-muted-foreground/60 max-w-[100px]">firms with codified AI standards</p>
          </div>
        </div>
      </div>

      {/* Dimension bars overview */}
      <Card className="border-border">
        <CardContent className="p-4 md:p-6 space-y-3">
          {result.dimensions.map((d) => {
            const label = SHORT_LABELS[d.dimension] || d.label;
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
        </CardContent>
      </Card>

      {/* Email capture */}
      {loading ? (
        <Card className="border-primary/20 bg-primary/4">
          <CardContent className="p-6 text-center space-y-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" />
            <p className="text-sm font-semibold text-foreground">Sending your results…</p>
            <p className="text-xs text-muted-foreground">This may take a few seconds while we generate your personalised action plan.</p>
          </CardContent>
        </Card>
      ) : !submitted ? (
        <Card className="border-primary/20 bg-primary/4">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm font-semibold text-foreground">
              Get your personalised action plan
            </p>
            <p className="text-xs text-muted-foreground">
              We'll email your results and a 3-step plan based on your weakest dimension ({SHORT_LABELS[weakest.dimension] || weakest.label} at {weakest.score}/100). If you'd like, we can also follow up to discuss them.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleEmailSubmit} disabled={loading || !email.trim()}>
                <Mail className="w-4 h-4" />
                Send My Results
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              💡 Check your spam/junk folder if you don't see it within a minute. We'll send your results and may follow up to discuss them. Read our{" "}
              <Link to="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</Link>.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary/20 bg-primary/4">
          <CardContent className="p-6 text-center space-y-2">
            <p className="text-sm font-semibold text-foreground">✓ Your action plan is on its way.</p>
            <p className="text-xs text-muted-foreground">Check your spam or junk folder if it doesn't arrive within a couple of minutes.</p>
          </CardContent>
        </Card>
      )}

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
                  <p className="text-sm font-semibold text-foreground">{d.label}</p>
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
                  {isExpanded ? "Hide" : isPositive ? "What this means for your firm" : "What this costs your firm"}
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {isExpanded && (
                  <p className="text-sm text-foreground/80 bg-muted/50 rounded-lg p-3 mt-1 animate-in fade-in slide-in-from-top-2 duration-200 leading-relaxed">
                    {costText}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 pb-8">
        <p className="text-base md:text-lg font-semibold text-foreground">
          See what 70+ looks like for your firm
        </p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We'll walk through your results and show you how firms like yours made their AI investment compound.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a href={CAL_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="brand" size="lg" className="text-base">
              Book a 30-Min Walkthrough <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
          <Link to="/">
            <Button variant="outline" size="lg" className="text-base">
              Explore the Platform
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
