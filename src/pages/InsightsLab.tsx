import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck, LogOut, TrendingUp, BarChart3, Zap, Target,
  RefreshCw, Lightbulb, ArrowLeft, Loader2, BookOpen, Layers,
} from "lucide-react";
import { DIMENSION_LABELS, type Dimension } from "@/lib/diagnostic-scoring";
import ReactMarkdown from "react-markdown";

/* ── Types ── */
interface DiagnosticResult {
  id: string;
  email: string | null;
  archetype: string;
  overall_score: number;
  scores: Record<string, number>;
  answers: Record<string, number>;
  created_at: string;
}

interface ResearchEntry {
  id: string;
  category: string;
  result_content: string;
  submission_count: number;
  created_at: string;
}

type ResearchCategory = "execution_stack_shifts" | "maturity_benchmarks";

/* ── Helpers ── */
const FREE_DOMAINS = new Set([
  "gmail.com","yahoo.com","hotmail.com","outlook.com","aol.com",
  "icloud.com","mail.com","protonmail.com","zoho.com","live.com",
]);

function getConfidenceTier(n: number): { label: string; color: string; description: string } {
  if (n < 10) return { label: "Early Signal", color: "bg-amber-500/20 text-amber-700 border-amber-300", description: `${n} submissions — directional only` };
  if (n < 30) return { label: "Growing Dataset", color: "bg-blue-500/20 text-blue-700 border-blue-300", description: `${n} submissions — patterns emerging` };
  return { label: "Benchmark-Ready", color: "bg-emerald-500/20 text-emerald-700 border-emerald-300", description: `${n} submissions — statistically meaningful` };
}

const CATEGORY_META: Record<ResearchCategory, { label: string; icon: React.ReactNode; description: string }> = {
  execution_stack_shifts: {
    label: "Execution Stack Shifts",
    icon: <Zap className="h-4 w-4" />,
    description: "New tools, agent frameworks, workflow changes relevant to your data",
  },
  maturity_benchmarks: {
    label: "Maturity Benchmarks",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "Industry reports you can contrast with your proprietary findings",
  },
};

const DIM_KEYS: Dimension[] = [
  "standard_internalization",
  "output_consistency",
  "knowledge_compounding",
  "collective_visibility",
  "learning_velocity",
];

/* ── Component ── */
export default function InsightsLab() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isArchitect, setIsArchitect] = useState<boolean | null>(null);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [pastResearch, setPastResearch] = useState<ResearchEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ResearchCategory>("execution_stack_shifts");
  const [researching, setResearching] = useState(false);
  const [liveResult, setLiveResult] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "architect")
      .then(({ data }) => setIsArchitect(!!data && data.length > 0));
  }, [user]);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    const [diagRes, researchRes] = await Promise.all([
      supabase.from("diagnostic_results").select("*").order("created_at", { ascending: false }),
      supabase.from("insights_research").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    if (diagRes.data) setResults(diagRes.data as DiagnosticResult[]);
    if (researchRes.data) setPastResearch(researchRes.data as ResearchEntry[]);
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (isArchitect) loadData();
  }, [isArchitect, loadData]);

  /* ── Aggregate computation ── */
  const aggregate = useMemo(() => {
    if (!results.length) return null;

    const overallAvg = Math.round(results.reduce((s, r) => s + r.overall_score, 0) / results.length);

    // Dimension averages
    const dimSums: Record<string, number[]> = {};
    for (const r of results) {
      for (const [key, val] of Object.entries(r.scores as Record<string, number>)) {
        if (!dimSums[key]) dimSums[key] = [];
        dimSums[key].push(val);
      }
    }
    const dimensions: Record<string, number> = {};
    let weakest = { key: "", score: 100 };
    let strongest = { key: "", score: 0 };
    for (const [key, vals] of Object.entries(dimSums)) {
      const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
      dimensions[key] = avg;
      if (avg < weakest.score) weakest = { key, score: avg };
      if (avg > strongest.score) strongest = { key, score: avg };
    }

    // Org count
    const orgDomains = new Set<string>();
    for (const r of results) {
      if (!r.email) continue;
      const domain = r.email.split("@")[1]?.toLowerCase();
      if (domain && !FREE_DOMAINS.has(domain)) orgDomains.add(domain);
    }

    // Top archetype
    const archCounts: Record<string, number> = {};
    for (const r of results) archCounts[r.archetype] = (archCounts[r.archetype] || 0) + 1;
    const topArchetype = Object.entries(archCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const confidence = getConfidenceTier(results.length);

    return {
      totalSubmissions: results.length,
      orgCount: orgDomains.size,
      overallAvg,
      dimensions,
      weakestDimension: DIMENSION_LABELS[weakest.key as Dimension] || weakest.key,
      strongestDimension: DIMENSION_LABELS[strongest.key as Dimension] || strongest.key,
      topArchetype,
      confidenceTier: confidence.label,
      confidence,
    };
  }, [results]);

  /* ── Research trigger ── */
  const runResearch = async () => {
    if (!aggregate) return;
    setResearching(true);
    setLiveResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("run-insights-research", {
        body: {
          category: activeCategory,
          aggregate_data: {
            totalSubmissions: aggregate.totalSubmissions,
            orgCount: aggregate.orgCount,
            overallAvg: aggregate.overallAvg,
            dimensions: aggregate.dimensions,
            weakestDimension: aggregate.weakestDimension,
            strongestDimension: aggregate.strongestDimension,
            topArchetype: aggregate.topArchetype,
            confidenceTier: aggregate.confidenceTier,
          },
        },
      });

      if (error) throw error;
      setLiveResult(data.content);
      // Refresh past research
      const { data: refreshed } = await supabase
        .from("insights_research")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (refreshed) setPastResearch(refreshed as ResearchEntry[]);
    } catch (err: any) {
      console.error("Research error:", err);
      setLiveResult(`**Error:** ${err.message || "Research failed. Please try again."}`);
    } finally {
      setResearching(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (isArchitect === null) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Checking access…</div>;
  if (!isArchitect) return <Navigate to="/app" replace />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-4 md:px-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/admin/manage")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span className="text-base font-bold tracking-tight brand-gradient-text">Insights Lab</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">Sign out</span>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {loadingData ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading data…
          </div>
        ) : !aggregate ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No diagnostic submissions yet. Research angles will appear once data flows in.
            </CardContent>
          </Card>
        ) : (
          <>
            {/* ── Aggregate Dashboard ── */}
            <div>
              <h1 className="text-xl font-bold text-foreground mb-1">Aggregate Intelligence</h1>
              <p className="text-sm text-muted-foreground">
                Proprietary data from {aggregate.totalSubmissions} submissions across {aggregate.orgCount} organizations
              </p>
            </div>

            {/* Confidence Tier */}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={`${aggregate.confidence.color} text-xs px-3 py-1 border`}>
                {aggregate.confidence.label}
              </Badge>
              <span className="text-xs text-muted-foreground">{aggregate.confidence.description}</span>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Overall Average</p>
                  <p className="text-3xl font-bold text-foreground">{aggregate.overallAvg}</p>
                  <p className="text-xs text-muted-foreground mt-1">/100</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Submissions</p>
                  <p className="text-3xl font-bold text-foreground">{aggregate.totalSubmissions}</p>
                  <p className="text-xs text-muted-foreground mt-1">total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Top Archetype</p>
                  <p className="text-lg font-semibold text-foreground leading-tight">{aggregate.topArchetype}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Organizations</p>
                  <p className="text-3xl font-bold text-foreground">{aggregate.orgCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">unique domains</p>
                </CardContent>
              </Card>
            </div>

            {/* Dimension Bars */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Dimension Averages</CardTitle>
                <CardDescription>Cumulative scores across all submissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {DIM_KEYS.map((dim) => {
                  const score = aggregate.dimensions[dim] ?? 0;
                  const isWeakest = DIMENSION_LABELS[dim] === aggregate.weakestDimension;
                  const isStrongest = DIMENSION_LABELS[dim] === aggregate.strongestDimension;
                  return (
                    <div key={dim} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className={`font-medium ${isWeakest ? "text-destructive" : isStrongest ? "text-primary" : "text-foreground"}`}>
                          {DIMENSION_LABELS[dim]}
                          {isWeakest && <TrendingUp className="inline h-3 w-3 ml-1 rotate-180" />}
                          {isStrongest && <TrendingUp className="inline h-3 w-3 ml-1" />}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">{score}/100</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isWeakest ? "bg-destructive" : isStrongest ? "bg-primary" : "bg-primary/60"}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* ── Research Angles Engine ── */}
            <div className="border-t border-border pt-6">
              <h2 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Research Angles Engine
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Cross-reference your proprietary data with market signals for thought leadership content.
              </p>

              {/* Category Selector */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {(Object.entries(CATEGORY_META) as [ResearchCategory, typeof CATEGORY_META[ResearchCategory]][]).map(
                  ([key, meta]) => (
                    <button
                      key={key}
                      onClick={() => { setActiveCategory(key); setLiveResult(null); }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        activeCategory === key
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {meta.icon}
                      <div className="text-left">
                        <div>{meta.label}</div>
                        <div className="text-xs font-normal opacity-70 hidden sm:block">{meta.description}</div>
                      </div>
                    </button>
                  )
                )}
              </div>

              {/* Run Button */}
              <Button
                onClick={runResearch}
                disabled={researching}
                className="gap-2 mb-4"
              >
                {researching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {researching ? "Researching…" : "Generate Research Angles"}
              </Button>

              {/* Live Result */}
              {liveResult && (
                <Card className="border-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        Fresh Research — {CATEGORY_META[activeCategory].label}
                      </CardTitle>
                      <Badge variant="outline" className={aggregate.confidence.color}>
                        n={aggregate.totalSubmissions}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{liveResult}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* ── Past Research ── */}
            {pastResearch.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Research History
                </h3>
                <div className="space-y-3">
                  {pastResearch.map((entry) => (
                    <ResearchHistoryCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* ── History Card ── */
function ResearchHistoryCard({ entry }: { entry: ResearchEntry }) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[entry.category as ResearchCategory] || CATEGORY_META.execution_stack_shifts;
  const date = new Date(entry.created_at);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <Card className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {meta.icon}
            <span className="text-sm font-medium">{meta.label}</span>
            <Badge variant="secondary" className="text-xs">n={entry.submission_count}</Badge>
          </div>
          <span className="text-xs text-muted-foreground">{dateStr}</span>
        </div>
        {expanded && (
          <div className="mt-3 pt-3 border-t border-border prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{entry.result_content}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
