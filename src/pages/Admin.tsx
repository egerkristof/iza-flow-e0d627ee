import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
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
  if (n < 10) return { label: "Early Signal", color: "bg-amber-500/20 text-amber-700 border-amber-300", description: `${n} submissions — directional only` };
  if (n < 30) return { label: "Growing Dataset", color: "bg-blue-500/20 text-blue-700 border-blue-300", description: `${n} submissions — patterns emerging` };
  return { label: "Benchmark-Ready", color: "bg-emerald-500/20 text-emerald-700 border-emerald-300", description: `${n} submissions — statistically meaningful` };
}

const CATEGORY_META: Record<ResearchCategory, { label: string; icon: React.ReactNode; description: string }> = {
  icp_reality_check: {
    label: "ICP Reality Check",
    icon: <Crosshair className="h-4 w-4" />,
    description: "What 50-150 person teams actually do with AI today — the messy truth",
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

  // Auth check
  const [isArchitect, setIsArchitect] = useState<boolean | null>(null);

  // Members state
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("operator");
  const [inviting, setInviting] = useState(false);

  // Diagnostic state
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Insights Lab state
  const [pastResearch, setPastResearch] = useState<ResearchEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState<ResearchCategory>("icp_reality_check");
  const [researching, setResearching] = useState(false);
  const [liveResult, setLiveResult] = useState<string | null>(null);

  // Check if current user is architect
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

  // Always-on realtime + polling for diagnostic results (regardless of active tab)
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

  /* ── Aggregate computation ── */
  const isFounder = (email: string | null) => {
    if (!email) return false;
    const lower = email.toLowerCase();
    return lower.startsWith("kristof.eger@") || lower === "istvan.boscha@aliz.ai";
  };

  const aggregate = useMemo(() => {
    // 1. Exclude founder test submissions
    const nonFounder = results.filter((r) => !isFounder(r.email));

    // 2. Deduplicate: keep latest submission per email (or per session_id for anonymous)
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

    // Org count: unique email domains (all domains count now)
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

    // Segmentation helpers
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
      {/* ── Mobile Header + Tab Bar ── */}
      <div className="md:hidden flex flex-col border-b border-border bg-muted/30">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-base font-bold tracking-tight brand-gradient-text">Admin</span>
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            <span className="text-xs">Sign out</span>
          </Button>
        </div>
        <nav className="flex border-t border-border overflow-x-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveView(item.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-b-2 whitespace-nowrap px-2 ${
                activeView === item.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-border bg-muted/30 flex-col">
        <div className="flex h-14 items-center border-b border-border px-4 gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="text-base font-bold tracking-tight brand-gradient-text">Admin</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveView(item.key)}
              className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                activeView === item.key
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {activeView === "members" && (
            <>
              <div>
                <h1 className="text-xl font-bold text-foreground">Members</h1>
                <p className="text-sm text-muted-foreground">Invite people and manage who has access.</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Invite a new member</CardTitle>
                  <CardDescription>They will receive an email with a magic link to set up their account.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <Label htmlFor="invite-email">Email</Label>
                      <Input id="invite-email" type="email" placeholder="colleague@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                    </div>
                    <div className="space-y-1.5 w-full sm:w-40">
                      <Label>Role</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operator">Operator</SelectItem>
                          <SelectItem value="manager">Leader</SelectItem>
                          <SelectItem value="architect">Process Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()} className="gap-2 w-full sm:w-auto">
                      <Send className="h-4 w-4" />
                      {inviting ? "Sending…" : "Send Invite"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Current members</CardTitle>
                  <CardDescription>{profiles.length} member{profiles.length !== 1 ? "s" : ""} registered</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  ) : (
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Roles</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profiles.map((p) => (
                          <TableRow key={p.user_id}>
                            <TableCell className="font-medium">{p.display_name || "-"}</TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                {getRolesForUser(p.user_id).map((r) => (
                                  <Badge key={r} variant="secondary" className="text-xs capitalize">{r}</Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {format(new Date(p.created_at), "MMM d, yyyy")}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {activeView === "org-insights" && (
            <OrgInsights results={results} />
          )}

          {activeView === "diagnostics" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-foreground">Diagnostic Results</h1>
                  <p className="text-sm text-muted-foreground">Review submissions from the AI Execution Diagnostic.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => void loadData()} disabled={loadingData} className="gap-1.5">
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Submissions</CardTitle>
                  <CardDescription>{results.length} submission{results.length !== 1 ? "s" : ""} total</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingData ? (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  ) : results.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No submissions yet.</p>
                  ) : (
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                    <Table className="min-w-[700px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Team</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Archetype</TableHead>
                          <TableHead className="text-right">Score</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((r) => (
                          <Fragment key={r.id}>
                            <TableRow className="cursor-pointer" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                              <TableCell className="text-sm">{format(new Date(r.created_at), "MMM d, yyyy HH:mm")}</TableCell>
                              <TableCell className="text-sm">{r.email || <span className="text-muted-foreground italic">anonymous</span>}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{r.respondent_role || "–"}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{r.team_size || "–"}</TableCell>
                              <TableCell className="text-sm">
                                {r.company_name ? (
                                  <span className="text-foreground">{r.company_name}{(r.industry_refined || r.industry) ? <span className="text-muted-foreground text-xs ml-1">({r.industry_refined || r.industry})</span> : ""}</span>
                                ) : <span className="text-muted-foreground">–</span>}
                              </TableCell>
                              <TableCell><Badge variant="outline" className="text-xs">{r.archetype}</Badge></TableCell>
                              <TableCell className="text-right font-mono font-semibold">{r.overall_score}</TableCell>
                              <TableCell className="w-8">
                                {expandedId === r.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                              </TableCell>
                            </TableRow>
                            {expandedId === r.id && (
                              <TableRow>
                                <TableCell colSpan={8} className="bg-muted/30 p-0">
                                  <div className="p-5 space-y-6">
                                    {/* Results Preview */}
                                    <div>
                                      <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3">Results Preview</h4>
                                      <div className="flex items-start gap-6 flex-wrap">
                                        <div className="text-center">
                                          <p className="text-4xl font-black tabular-nums" style={{
                                            color: r.overall_score <= 30 ? "hsl(0 72% 51%)" : r.overall_score <= 55 ? "hsl(38 92% 50%)" : r.overall_score <= 75 ? "hsl(200 90% 40%)" : "hsl(155 72% 36%)"
                                          }}>{r.overall_score}</p>
                                          <p className="text-xs text-muted-foreground mt-1">Overall Score</p>
                                        </div>
                                        <div className="flex-1 min-w-[200px] space-y-1.5">
                                          {Object.entries(r.scores as Record<string, number>).map(([key, val]) => (
                                            <div key={key} className="flex items-center gap-2">
                                              <span className="text-[11px] text-muted-foreground w-20 shrink-0 text-right">{SHORT_LABELS[key] || key}</span>
                                              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                                                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${val}%` }} />
                                              </div>
                                              <span className="text-[11px] font-bold tabular-nums w-6">{val}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Email Status */}
                                    <div>
                                      <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">Email Report</h4>
                                      {r.email ? (
                                        <div className="flex items-center gap-2 text-sm">
                                          <Mail className="h-4 w-4 text-primary" />
                                          <span className="text-foreground">Sent to <span className="font-medium">{r.email}</span></span>
                                          <Badge variant="secondary" className="text-[10px]">Delivered</Badge>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <MailX className="h-4 w-4" />
                                          <span>No email provided. No report sent.</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Results Page Recommendations */}
                                    <div>
                                      <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
                                        <Eye className="h-3.5 w-3.5" />
                                        What They Saw (Results Page)
                                      </h4>
                                      {(() => {
                                        const computed = calculateResults(r.answers);
                                        return (
                                          <div className="space-y-3">
                                            <div className="rounded-lg border border-border bg-background p-3">
                                              <p className="text-xs text-muted-foreground mb-1">Archetype</p>
                                              <p className="text-sm font-semibold text-foreground">{computed.archetype.label}</p>
                                              <p className="text-xs text-muted-foreground mt-1">{computed.archetype.tagline}</p>
                                              <p className="text-xs text-primary mt-2 font-medium">Recommended action: {computed.archetype.action}</p>
                                            </div>
                                            {computed.dimensions.map((d) => (
                                              <div key={d.dimension} className="rounded-lg border border-border bg-background p-3 space-y-1">
                                                <div className="flex items-center justify-between">
                                                  <p className="text-xs font-semibold text-foreground">{d.label}</p>
                                                  <span className="text-xs font-bold tabular-nums" style={{
                                                    color: d.score <= 33 ? "hsl(0 72% 51%)" : d.score <= 66 ? "hsl(38 92% 50%)" : "hsl(155 72% 36%)"
                                                  }}>{d.score}/100</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{d.insight}</p>
                                                <div className="flex items-start gap-1.5 pt-1">
                                                  <TrendingDown className="h-3 w-3 shrink-0 mt-0.5 text-muted-foreground" />
                                                  <p className="text-[11px] text-foreground/70">{d.implication}</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        );
                                      })()}
                                    </div>

                                    {/* Email Action Plan */}
                                    <div>
                                      <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
                                        <Lightbulb className="h-3.5 w-3.5" />
                                        Email Action Plan (AI-Generated)
                                      </h4>
                                      {r.email_action_plan?.steps ? (
                                        <div className="space-y-3">
                                          {r.email_action_plan.steps.map((step, i) => (
                                            <div key={i} className="rounded-lg border border-border bg-background p-3 space-y-1.5 border-l-2 border-l-primary">
                                              <p className="text-xs font-bold text-foreground">Step {i + 1}: {step.title}</p>
                                              <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground">Start here:</span> {step.manual_how}</p>
                                              <p className="text-xs text-primary/80">🏗️ {step.platform_how}</p>
                                            </div>
                                          ))}
                                        </div>
                                      ) : r.email ? (
                                        <p className="text-xs text-muted-foreground italic">Action plan was sent but not stored (submitted before tracking was added).</p>
                                      ) : (
                                        <p className="text-xs text-muted-foreground italic">No email submitted. No action plan generated.</p>
                                      )}
                                    </div>

                                    {/* Exact Questions & Answers */}
                                    <div>
                                      <h4 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
                                        <MessageSquareText className="h-3.5 w-3.5" />
                                        Questions & Answers
                                      </h4>
                                      <div className="space-y-4">
                                        {Object.entries(r.answers as Record<string, number>).map(([qId, score]) => {
                                          const meta = getQuestionText(qId);
                                          if (!meta) return null;
                                          return (
                                            <div key={qId} className="rounded-lg border border-border bg-background p-3 space-y-1.5">
                                              <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[10px] shrink-0">{meta.dimension}</Badge>
                                                <span className="text-[10px] text-muted-foreground uppercase font-medium">{qId}</span>
                                              </div>
                                              <p className="text-xs text-muted-foreground italic">{meta.context}</p>
                                              <p className="text-sm font-medium text-foreground">{meta.question}</p>
                                              <div className="flex items-start gap-2 pt-1">
                                                <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                                                  style={{
                                                    background: score <= 1 ? "hsl(0 72% 51% / 0.12)" : score <= 2 ? "hsl(38 92% 50% / 0.12)" : score <= 3 ? "hsl(200 90% 40% / 0.12)" : "hsl(155 72% 36% / 0.12)",
                                                    color: score <= 1 ? "hsl(0 72% 51%)" : score <= 2 ? "hsl(38 92% 50%)" : score <= 3 ? "hsl(200 90% 40%)" : "hsl(155 72% 36%)",
                                                  }}
                                                >{score}</span>
                                                <p className="text-sm text-foreground/80">{getAnswerLabel(qId, score)}</p>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>

                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {activeView === "content-insights" && (
            <>
              {loadingData ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading data…
                </div>
              ) : !aggregate ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No diagnostic submissions yet. Content tools will appear once data flows in.
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Aggregate Dashboard */}
                  <div>
                    <h1 className="text-xl font-bold text-foreground mb-1">Content &amp; Insights</h1>
                    <p className="text-sm text-muted-foreground">
                      Proprietary data from {aggregate.totalSubmissions} submissions across {aggregate.orgCount} organizations — use it to generate LinkedIn posts and research angles.
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

                  {/* Segmentation Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SegmentCard title="By Role" segments={aggregate.roleSegments} />
                    <SegmentCard title="By Seniority" segments={aggregate.roleTierSegments} />
                    <SegmentCard title="By Team Size" segments={aggregate.teamSizeSegments} />
                    <SegmentCard title="By Industry" segments={aggregate.industrySegments} />
                  </div>

                  <div className="border-t border-border pt-6">
                    <LinkedInContentEngine />
                  </div>

                  {/* Research Angles Engine */}
                  <div className="border-t border-border pt-6">
                    <h2 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Research &amp; Content Angles
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate ICP-targeted, polarizing content angles from your proprietary data.
                    </p>

                    {/* Category Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {(Object.entries(CATEGORY_META) as [ResearchCategory, typeof CATEGORY_META[ResearchCategory]][]).map(
                        ([key, meta]) => (
                          <button
                            key={key}
                            onClick={() => { setActiveCategory(key); setLiveResult(null); }}
                            className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left ${
                              activeCategory === key
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            }`}
                          >
                            {meta.icon}
                            <div>
                              <div>{meta.label}</div>
                              <div className="text-xs font-normal opacity-70">{meta.description}</div>
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

                  {/* Past Research */}
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
            </>
          )}

          {activeView === "team-builder" && (
            <TeamBuilder results={results} onRefresh={() => void loadData()} />
          )}

          {activeView === "consulting" && <ConsultingReference />}

          {activeView === "client-prep" && <PersonalizedConsulting results={results} />}

          {activeView === "presentations" && (
            <>
              <div>
                <h1 className="text-xl font-bold text-foreground">Presentations</h1>
                <p className="text-sm text-muted-foreground">Quick links to all existing decks and presentations.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: "Pitch Deck", path: "/pitch", description: "Core startup pitch deck" },
                  { title: "Investor Deck", path: "/investor", description: "Detailed investor presentation" },
                  { title: "Seed Investor Deck", path: "/investor-seed", description: "Pre-seed / seed stage deck" },
                  { title: "Sales Deck", path: "/sales", description: "Consulting sales presentation" },
                  { title: "Training Deck", path: "/training", description: "Architecting the AI-Native Organization" },
                  { title: "LinkedIn Card", path: "/linkedin-card", description: "LinkedIn image card generator" },
                ].map((deck) => (
                  <Card key={deck.path} className="group hover:border-primary/40 transition-colors cursor-pointer" onClick={() => window.open(deck.path, "_blank")}>
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
