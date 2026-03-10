import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { CAL_URL } from "@/components/marketing/home/shared";
import type { DiagnosticResult } from "@/lib/diagnostic-scoring";
import { ArrowRight, Mail, TrendingDown, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  result: DiagnosticResult;
  answers: Record<string, number>;
}

export function DiagnosticResults({ result, answers }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedDim, setExpandedDim] = useState<string | null>(null);

  const radarData = result.dimensions.map((d) => ({
    subject: d.label.length > 28 ? d.label.split(" ").slice(0, 4).join(" ") + "…" : d.label,
    score: d.score,
    fullMark: 100,
  }));

  const scoreColor =
    result.overall <= 30
      ? "hsl(0 72% 51%)"
      : result.overall <= 55
        ? "hsl(38 92% 50%)"
        : result.overall <= 75
          ? "hsl(200 90% 40%)"
          : "hsl(155 72% 36%)";

  // Find weakest dimension for targeted CTA
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
      setSubmitted(true);
    } catch {
      // fail silently
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
      </div>

      {/* Radar chart */}
      <Card className="border-border">
        <CardContent className="p-4 md:p-6">
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* What to do first — archetype action */}
      <Card className="border-primary/20 bg-primary/4">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-foreground mb-1">Your #1 next move</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.archetype.action}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dimension breakdown with implications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Where you stand</h3>
        {result.dimensions.map((d) => {
          const isExpanded = expandedDim === d.dimension;
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

                {/* Expand to see business implication */}
                <button
                  onClick={() => setExpandedDim(isExpanded ? null : d.dimension)}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors pt-1"
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  {isExpanded ? "Hide" : "What this means for your firm"}
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {isExpanded && (
                  <p className="text-sm text-foreground/80 bg-muted/50 rounded-lg p-3 mt-1 animate-in fade-in slide-in-from-top-2 duration-200 leading-relaxed">
                    {d.implication}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Email capture — gated action plan */}
      {!submitted ? (
        <Card className="border-primary/20 bg-primary/4">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm font-semibold text-foreground">
              Get a prioritized 3-step action plan tailored to your "{result.archetype.label}" profile
            </p>
            <p className="text-xs text-muted-foreground">
              Based on your weakest dimension ({weakest.label} at {weakest.score}/100), we'll send specific recommendations you can act on this week.
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

      {/* CTA — conditional based on score */}
      <div className="text-center space-y-4 pb-8">
        {result.overall <= 55 ? (
          <>
            <p className="text-base md:text-lg font-semibold text-foreground">
              Your team is leaving compound value on the table
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We'll walk through your results and show you the one structural change that would have the highest impact — in 20 minutes.
            </p>
          </>
        ) : (
          <>
            <p className="text-base md:text-lg font-semibold text-foreground">
              You're ahead of most firms — let's close the remaining gaps
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              We'll show you where your system has the most room to compound — and what it would take to get there.
            </p>
          </>
        )}
        <a href={CAL_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="brand" size="lg" className="text-base mt-2">
            Book a 20-Min Review <ArrowRight className="w-4 h-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}
