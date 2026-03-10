import { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { CAL_URL } from "@/components/marketing/home/shared";
import type { DiagnosticResult } from "@/lib/diagnostic-scoring";
import { ArrowRight, Mail } from "lucide-react";

interface Props {
  result: DiagnosticResult;
  answers: Record<string, number>;
}

export function DiagnosticResults({ result, answers }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const radarData = result.dimensions.map((d) => ({
    subject: d.label.replace(" ", "\n"),
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

  async function handleEmailSubmit() {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await supabase.from("diagnostic_results").insert({
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
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500 space-y-8">
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
        <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto italic">
          "{result.archetype.tagline}"
        </p>
      </div>

      {/* Radar chart */}
      <Card className="border-border">
        <CardContent className="p-4 md:p-6">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
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

      {/* Dimension breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Breakdown</h3>
        {result.dimensions.map((d) => (
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
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Email capture */}
      {!submitted ? (
        <Card className="border-primary/20 bg-primary/4">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm font-semibold text-foreground">
              Get your full report + actionable recommendations
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
            <p className="text-xs text-muted-foreground">No spam. We'll send insights relevant to your score.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary/20 bg-primary/4">
          <CardContent className="p-6 text-center">
            <p className="text-sm font-semibold text-foreground">✓ We'll send your detailed report shortly.</p>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <div className="text-center space-y-4 pb-8">
        <p className="text-base md:text-lg font-semibold text-foreground">
          Want to fix this? Let's walk through your results.
        </p>
        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="brand" size="lg" className="text-base">
            Book a Discovery Call <ArrowRight className="w-4 h-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}
