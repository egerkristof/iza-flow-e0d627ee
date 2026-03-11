import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { CAL_URL } from "@/components/marketing/home/shared";
import type { DiagnosticResult } from "@/lib/diagnostic-scoring";
import { ArrowRight, Mail, TrendingDown, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  result: DiagnosticResult;
  answers: Record<string, number>;
}

const BENCHMARK_AVG = 38;
const BENCHMARK_HIGH = 72;

const COST_TRANSLATIONS: Record<string, { low: string; mid: string }> = {
  standard_internalization: {
    low: "Your team reinvents the approach every AI session. That's hours of redundant thinking each week, and the output depends on who happens to do the work.",
    mid: "Some standards reach AI sessions, but inconsistently. You're getting partial value from years of accumulated expertise.",
  },
  output_consistency: {
    low: "Quality depends on who does the work. That's a scalability ceiling: you can't grow the team without growing the variance.",
    mid: "Outputs are recognisable but uneven. Clients notice the difference between your A-team and everyone else.",
  },
  knowledge_compounding: {
    low: "Improvements stay with individuals. Your firm is paying for the same learning curve repeatedly, project after project.",
    mid: "Knowledge spreads, but slowly and unevenly. Good techniques take weeks to reach the whole team, if they ever do.",
  },
  collective_visibility: {
    low: "Everyone works in private AI sessions. You have no idea what's working, what's not, or who needs help.",
    mid: "Some visibility exists, but it's informal. You'd struggle to answer: 'How is the team actually using AI today?'",
  },
  learning_velocity: {
    low: "Projects end and lessons vanish. Six months of AI usage hasn't meaningfully changed how the team operates.",
    mid: "Some learning happens, but it doesn't consistently feed back into how the team works. Progress is anecdotal, not structural.",
  },
};

export function DiagnosticResults({ result, answers }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedDim, setExpandedDim] = useState<string | null>(null);

  const SHORT_LABELS: Record<string, string> = {
    "Do your standards shape behaviour?": "Standards",
    "Can anyone deliver your best work?": "Consistency",
    "Does your firm get smarter over time?": "Compounding",
    "Can your team see how each other thinks?": "Visibility",
    "How fast do improvements spread?": "Learning Speed",
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
          </div>
          <div
            className="w-px h-8"
            style={{ background: "hsl(var(--border))" }}
          />
          <div className="text-center">
            <p className="text-xs text-muted-foreground">You</p>
            <p className="text-sm font-black" style={{ color: scoreColor }}>
              {result.overall}
            </p>
          </div>
          <div
            className="w-px h-8"
            style={{ background: "hsl(var(--border))" }}
          />
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Firms with defined standards</p>
            <p className="text-sm font-bold text-primary">{BENCHMARK_HIGH}+</p>
          </div>
        </div>
      </div>

      {/* Dimension bars overview */}
      <Card className="border-border">
        <CardContent className="p-4 md:p-6 space-y-3">
          {result.dimensions.map((d) => {
            const label = SHORT_LABELS[d.label] || d.label.split(" ").slice(0, 2).join(" ");
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

      {/* Email capture — moved UP, gated action plan */}
      {!submitted ? (
        <Card className="border-primary/20 bg-primary/4">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm font-semibold text-foreground">
              See what firms who score 70+ do differently
            </p>
            <p className="text-xs text-muted-foreground">
              Get a personalised 3-step action plan based on your weakest dimension ({weakest.label} at {weakest.score}/100). Concrete steps you can start this week.
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
                Send
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">No spam. One email with your custom action plan.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary/20 bg-primary/4">
          <CardContent className="p-6 text-center">
            <p className="text-sm font-semibold text-foreground">✓ Your action plan is on its way.</p>
          </CardContent>
        </Card>
      )}

      {/* Dimension breakdown with business cost framing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Why your AI investment isn't compounding yet</h3>
        {result.dimensions.map((d) => {
          const isExpanded = expandedDim === d.dimension;
          const costs = COST_TRANSLATIONS[d.dimension];
          const costText = costs
            ? d.score <= 50 ? costs.low : costs.mid
            : d.implication;

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
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors pt-1"
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  {isExpanded ? "Hide" : "What this costs your firm"}
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
        {result.overall <= 55 ? (
          <>
            <p className="text-base md:text-lg font-semibold text-foreground">
              Your AI investment could be compounding. It isn't yet.
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We'll walk through your results and show you what a score of 70+ looks like for a firm like yours.
            </p>
          </>
        ) : (
          <>
            <p className="text-base md:text-lg font-semibold text-foreground">
              You're ahead of most firms. Let's close the remaining gaps.
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We'll show you where your system has the most room to compound and how LIZA OS accelerates what you've already built.
            </p>
          </>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a href={CAL_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="brand" size="lg" className="text-base">
              See What 70+ Looks Like <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
          <a href="/platform">
            <Button variant="outline" size="lg" className="text-base">
              Explore the Platform
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}