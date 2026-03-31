import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { adminPresentationItems } from "@/data/presentationRegistry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Users, ClipboardList, Send, ChevronDown, ChevronUp, LogOut, ShieldCheck,
  Mail, MailX, MessageSquareText, Eye, Lightbulb, TrendingDown, Building2,
  RefreshCw, Zap, BarChart3, BookOpen, Layers, Loader2, Target, Crosshair,
  TrendingUp, Pen, Sparkles, Presentation, ExternalLink,
} from "lucide-react";
import OrgInsights from "@/components/admin/OrgInsights";
import LinkedInContentEngine from "@/components/admin/LinkedInContentEngine";
import ConsultingReference from "@/components/admin/ConsultingReference";
import PersonalizedConsulting from "@/components/admin/PersonalizedConsulting";
import TeamBuilder from "@/components/admin/TeamBuilder";
import { format } from "date-fns";
import { QUESTIONS, DIMENSION_LABELS, calculateResults, type Dimension } from "@/lib/diagnostic-scoring";
import ReactMarkdown from "react-markdown";

/* ── Types ── */
interface Profile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

interface DiagnosticResult {
  id: string;
  email: string | null;
  archetype: string;
  overall_score: number;
  scores: Record<string, number>;
  answers: Record<string, number>;
  created_at: string;
  session_id: string | null;
  email_action_plan: { steps: { title: string; manual_how: string; platform_how: string }[] } | null;
  respondent_role: string | null;
  role_tier: string | null;
  team_size: string | null;
  company_name: string | null;
  industry: string | null;
  industry_refined: string | null;
}

interface UserRole {
  user_id: string;
  role: string;
}

interface ResearchEntry {
  id: string;
  category: string;
  result_content: string;
  submission_count: number;
  created_at: string;
}

type AdminView = "members" | "diagnostics" | "org-insights" | "team-builder" | "content-insights" | "consulting" | "client-prep" | "presentations";
type ResearchCategory = "icp_reality_check" | "contrarian_positioning" | "execution_stack_shifts" | "maturity_benchmarks";

/* ── Helpers ── */

function getConfidenceTier(n: number): { label: string; color: string; description: string } {
  if (n < 10) return { label: "Early Signal", color: "bg-amber-500/20 text-amber-700 border-amber-300", description: `${n} submissions - directional only` };
  if (n < 30) return { label: "Growing Dataset", color: "bg-blue-500/20 text-blue-700 border-blue-300", description: `${n} submissions - patterns emerging` };
  return { label: "Benchmark-Ready", color: "bg-emerald-500/20 text-emerald-700 border-emerald-300", description: `${n} submissions - statistically meaningful` };
}

const CATEGORY_META: Record<ResearchCategory, { label: string; icon: React.ReactNode; description: string }> = {
  icp_reality_check: {
    label: "ICP Reality Check",
    icon: <Crosshair className="h-4 w-4" />,
    description: "What 50-150 person teams actually do with AI today, the messy truth",
  },
  contrarian_positioning: {
    label: "Contrarian Takes",
    icon: <Target className="h-4 w-4" />,
    description: "Polarizing angles that challenge mainstream AI productivity narratives",
  },
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

export default function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<AdminView>("members");

  const [isArchitect, setIsArchitect] = useState<boolean | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("operator");
  const [inviting, setInviting] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [diagnosticSearch, setDiagnosticSearch] = useState("");
  const [pastResearch, setPastResearch] = useState<ResearchEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<ResearchCategory>("icp_reality_check");
  const [researching, setResearching] = useState(false);
  const [liveResult, setLiveResult] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "architect")
      .then(({ data }) => {
        setIsArchitect(!!data && data.length > 0);
      });
  }, [user]);

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoadingData(true);

    try {
      const [profilesRes, rolesRes, diagRes, researchRes] = await Promise.all([
        supabase.from("profiles").select("user_id, display_name, avatar_url, created_at").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
        supabase.from("diagnostic_results").select("*").order("created_at", { ascending: false }),
        (supabase as any).from("insights_research").select("*").order("created_at", { ascending: false }).limit(20),
      ]);

      if (profilesRes.error || rolesRes.error || diagRes.error) {
        console.error("Admin loadData error", {
          profiles: profilesRes.error,
          roles: rolesRes.error,
          diagnostics: diagRes.error,
        });
        if (!silent) {
          toast({
            variant: "destructive",
            title: "Could not refresh submissions",
            description: "Please try again in a few seconds.",
          });
        }
        return;
      }

      if (profilesRes.data) setProfiles(profilesRes.data);
      if (rolesRes.data) setUserRoles(rolesRes.data as UserRole[]);
      if (diagRes.data) setResults(diagRes.data as unknown as DiagnosticResult[]);
      if (researchRes.data) setPastResearch(researchRes.data as ResearchEntry[]);
    } finally {
      if (!silent) setLoadingData(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isArchitect) loadData();
  }, [isArchitect, loadData]);

  useEffect(() => {
    if (!isArchitect) return;

    let isActive = true;
    let pollInterval = 5000;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      if (!isActive) return;
      await loadData(true);
      pollInterval = Math.min(pollInterval * 1.3, 15000);
      timeoutId = setTimeout(poll, pollInterval);
    };

    const channel = supabase
      .channel("admin-diagnostic-results-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "diagnostic_results",
        },
        () => {
          pollInterval = 5000;
          void loadData(true);
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          pollInterval = 5000;
        }
      });

    const onFocus = () => {
      void loadData(true);
    };

    window.addEventListener("focus", onFocus);
    timeoutId = setTimeout(poll, pollInterval);

    return () => {
      isActive = false;
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("focus", onFocus);
      supabase.removeChannel(channel);
    };
  }, [isArchitect, loadData]);

  const isFounder = (email: string | null) => {
    if (!email) return false;
    const lower = email.toLowerCase();
    return lower.startsWith("kristof.eger@") || lower === "istvan.boscha@aliz.ai";
  };

  const aggregate = useMemo(() => {
    const nonFounder = results.filter((r) => !isFounder(r.email));
    const seen = new Map<string, DiagnosticResult>();
    for (const r of nonFounder) {
      const key = r.email?.toLowerCase() || r.session_id || r.id;
      const existing = seen.get(key);
      if (!existing || new Date(r.created_at) > new Date(existing.created_at)) {
        seen.set(key, r);
      }
    }
    const filtered = Array.from(seen.values());
    if (!filtered.length) return null;

    const overallAvg = Math.round(filtered.reduce((s, r) => s + r.overall_score, 0) / filtered.length);
    const dimSums: Record<string, number[]> = {};
    for (const r of filtered) {
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

    const orgDomains = new Set<string>();
    for (const r of filtered) {
      if (!r.email) continue;
      const domain = r.email.split("@")[1]?.toLowerCase();
      if (domain) orgDomains.add(domain);
    }

    const archCounts: Record<string, number> = {};
    for (const r of filtered) archCounts[r.archetype] = (archCounts[r.archetype] || 0) + 1;
    const topArchetype = Object.entries(archCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
    const confidence = getConfidenceTier(filtered.length);

    const buildSegment = (extractor: (r: DiagnosticResult) => string | null | undefined) => {
      const groups: Record<string, { scores: number[]; count: number }> = {};
      for (const r of filtered) {
        const val = extractor(r)?.trim();
        if (!val) continue;
        if (!groups[val]) groups[val] = { scores: [], count: 0 };
        groups[val].scores.push(r.overall_score);
        groups[val].count += 1;
      }
      const result: Record<string, { count: number; avg: number }> = {};
      for (const [k, v] of Object.entries(groups)) {
        result[k] = { count: v.count, avg: Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length) };
      }
      return result;
    };

    const roleSegments = buildSegment((r) => r.respondent_role);
    const roleTierSegments = buildSegment((r) => r.role_tier);
    const teamSizeSegments = buildSegment((r) => r.team_size);
    const industrySegments = buildSegment((r) => r.industry_refined || r.industry);

    return {
      totalSubmissions: filtered.length,
      orgCount: orgDomains.size,
      overallAvg,
      dimensions,
      weakestDimension: DIMENSION_LABELS[weakest.key as Dimension] || weakest.key,
      strongestDimension: DIMENSION_LABELS[strongest.key as Dimension] || strongest.key,
      topArchetype,
      confidenceTier: confidence.label,
      confidence,
      roleSegments,
      roleTierSegments,
      teamSizeSegments,
      industrySegments,
    };
  }, [results]);

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
      const { data: refreshed } = await (supabase as any)
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

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      const { data, error } = await supabase.functions.invoke("invite-user", {
        body: { email: inviteEmail.trim(), role: inviteRole },
      });
      if (error) throw error;
      if (data?.success) {
        toast({ title: "Invitation sent", description: `Invited ${inviteEmail} as ${inviteRole}.` });
        setInviteEmail("");
        loadData();
      } else {
        throw new Error(data?.error || "Invitation failed");
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Invite failed", description: err.message });
    }
    setInviting(false);
  };

  const getRolesForUser = (userId: string) =>
    userRoles.filter((r) => r.user_id === userId).map((r) => r.role);

  const SHORT_LABELS: Record<string, string> = {
    standard_internalization: "Standards",
    output_consistency: "Consistency",
    knowledge_compounding: "Knowledge",
    collective_visibility: "Visibility",
    learning_velocity: "Learning",
  };

  const getAnswerLabel = (questionId: string, score: number): string => {
    const q = QUESTIONS.find((q) => q.id === questionId);
    if (!q) return `Score: ${score}`;
    const opt = q.options.find((o) => o.score === score);
    return opt?.label || `Score: ${score}`;
  };

  const getQuestionText = (questionId: string): { question: string; context: string; dimension: string } | null => {
    const q = QUESTIONS.find((q) => q.id === questionId);
    if (!q) return null;
    return { question: q.question, context: q.context, dimension: DIMENSION_LABELS[q.dimension] };
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (isArchitect === null) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Checking access…</div>;
  if (!isArchitect) return <Navigate to="/app" replace />;

  const sidebarItems: { key: AdminView; label: string; icon: React.ReactNode }[] = [
    { key: "members", label: "Members", icon: <Users className="h-4 w-4" /> },
    { key: "diagnostics", label: "Diagnostics", icon: <ClipboardList className="h-4 w-4" /> },
    { key: "org-insights", label: "Org Insights", icon: <Building2 className="h-4 w-4" /> },
    { key: "team-builder", label: "Team Builder", icon: <Users className="h-4 w-4" /> },
    { key: "content-insights", label: "Content & Insights", icon: <Pen className="h-4 w-4" /> },
    { key: "consulting", label: "Consulting", icon: <BookOpen className="h-4 w-4" /> },
    { key: "client-prep", label: "Client Prep", icon: <Sparkles className="h-4 w-4" /> },
    { key: "presentations", label: "Presentations", icon: <Presentation className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* existing admin layout content stays unchanged above presentation section */}
      // ... keep existing code

          {activeView === "presentations" && (
            <>
              <div>
                <h1 className="text-xl font-bold text-foreground">Presentations</h1>
                <p className="text-sm text-muted-foreground">This list is auto-generated from the shared presentation registry, so new decks appear here automatically.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {adminPresentationItems.map((deck) => (
                  <Card key={deck.path} className="group hover:border-primary/40 transition-colors cursor-pointer" onClick={() => window.open(deck.path, "_blank", "noopener,noreferrer")}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold">{deck.title}</CardTitle>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <CardDescription className="text-xs">{deck.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <code className="text-[11px] text-muted-foreground/60 font-mono">{deck.path}</code>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}


/* ── History Card ── */
function ResearchHistoryCard({ entry }: { entry: ResearchEntry }) {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[entry.category as ResearchCategory] || CATEGORY_META.icp_reality_check;
  const date = new Date(entry.created_at);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          {meta.icon}
          <div>
            <p className="text-sm font-medium text-foreground">{meta.label}</p>
            <p className="text-xs text-muted-foreground">{dateStr} · n={entry.submission_count}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {expanded && (
        <CardContent className="pt-0 border-t border-border">
          <div className="prose prose-sm max-w-none dark:prose-invert mt-3">
            <ReactMarkdown>{entry.result_content}</ReactMarkdown>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

/* ── Segment Card ── */
function SegmentCard({ title, segments }: { title: string; segments: Record<string, { count: number; avg: number }> }) {
  const entries = Object.entries(segments).sort((a, b) => b[1].count - a[1].count);
  if (!entries.length) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">No data yet</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {entries.map(([label, { count, avg }]) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-foreground truncate max-w-[180px]" title={label}>{label}</span>
              <span className="text-muted-foreground text-xs shrink-0">n={count}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary/60" style={{ width: `${avg}%` }} />
              </div>
              <span className="font-mono text-xs text-muted-foreground w-8 text-right">{avg}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
