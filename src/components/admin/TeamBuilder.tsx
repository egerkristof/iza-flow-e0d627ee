import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserPlus, Pencil, Check, X, ChevronDown, ChevronUp, Unlink, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface DiagnosticResult {
  id: string;
  email: string | null;
  archetype: string;
  overall_score: number;
  scores: Record<string, number>;
  answers: Record<string, number>;
  created_at: string;
  respondent_role?: string | null;
  role_tier?: string | null;
  company_name?: string | null;
  industry?: string | null;
  industry_refined?: string | null;
  team_size?: string | null;
  team_leader_email?: string | null;
}

interface TeamGroup {
  leaderEmail: string;
  members: DiagnosticResult[];
  avgScore: number;
}

const FOUNDER_EMAILS = new Set(["kristof.eger@lizaos.ai", "kristof.eger@aliz.ai", "istvan.boscha@aliz.ai"]);

export default function TeamBuilder({ results, onRefresh }: { results: DiagnosticResult[]; onRefresh: () => void }) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"teams" | "all">("teams");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter out founders and anonymous
  const relevantResults = useMemo(() =>
    results.filter(r => r.email && !FOUNDER_EMAILS.has(r.email.toLowerCase())),
    [results]
  );

  // Search filter
  const matchesSearch = useCallback((r: DiagnosticResult) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (r.email || "").toLowerCase().includes(q) ||
      (r.respondent_role || "").toLowerCase().includes(q) ||
      (r.company_name || "").toLowerCase().includes(q) ||
      (r.industry || "").toLowerCase().includes(q) ||
      (r.industry_refined || "").toLowerCase().includes(q) ||
      (r.team_leader_email || "").toLowerCase().includes(q);
  }, [searchQuery]);

  // Team groups (filtered by search)
  const teams = useMemo(() => {
    const groups: Record<string, DiagnosticResult[]> = {};
    for (const r of relevantResults) {
      const leader = r.team_leader_email?.toLowerCase().trim();
      if (leader) {
        if (!groups[leader]) groups[leader] = [];
        groups[leader].push(r);
      }
    }
    const teamList: TeamGroup[] = Object.entries(groups).map(([leaderEmail, members]) => ({
      leaderEmail,
      members: members.sort((a, b) => b.overall_score - a.overall_score),
      avgScore: Math.round(members.reduce((s, m) => s + m.overall_score, 0) / members.length),
    }));

    // Filter teams: show team if leader email matches OR any member matches
    const q = searchQuery.toLowerCase().trim();
    const filtered = q
      ? teamList.filter(t => t.leaderEmail.includes(q) || t.members.some(matchesSearch))
      : teamList;

    return filtered.sort((a, b) => b.members.length - a.members.length);
  }, [relevantResults, searchQuery, matchesSearch]);

  const unassigned = useMemo(() => {
    const base = relevantResults.filter(r => !r.team_leader_email?.trim());
    return searchQuery.trim() ? base.filter(matchesSearch) : base;
  }, [relevantResults, searchQuery, matchesSearch]);

  const saveTeamLeader = useCallback(async (resultId: string, newLeader: string | null) => {
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from("diagnostic_results")
        .update({ team_leader_email: newLeader || null })
        .eq("id", resultId);
      if (error) throw error;
      toast({ title: "Team leader updated" });
      setEditingId(null);
      setEditValue("");
      onRefresh();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Update failed", description: err.message });
    } finally {
      setSaving(false);
    }
  }, [toast, onRefresh]);

  const startEdit = (r: DiagnosticResult) => {
    setEditingId(r.id);
    setEditValue(r.team_leader_email || "");
  };

  const getScoreColor = (score: number) =>
    score <= 30 ? "text-destructive" : score <= 55 ? "text-amber-500" : score <= 75 ? "text-primary" : "text-emerald-500";

  const renderMemberRow = (r: DiagnosticResult, showLeaderCol: boolean) => (
    <TableRow key={r.id}>
      <TableCell className="text-sm font-medium">{r.email}</TableCell>
      <TableCell className="text-sm text-muted-foreground">{r.respondent_role || "–"}</TableCell>
      <TableCell className="text-sm text-muted-foreground">{r.role_tier || "–"}</TableCell>
      <TableCell className="text-sm text-muted-foreground">{r.company_name || "–"}</TableCell>
      <TableCell className={`text-sm font-mono font-semibold text-right ${getScoreColor(r.overall_score)}`}>{r.overall_score}</TableCell>
      {showLeaderCol && (
        <TableCell className="text-sm">
          {editingId === r.id ? (
            <div className="flex items-center gap-1.5">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="leader@company.com"
                className="h-7 text-xs w-44"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-emerald-500 hover:text-emerald-600"
                disabled={saving}
                onClick={() => saveTeamLeader(r.id, editValue.trim())}
              >
                <Check className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground"
                onClick={() => setEditingId(null)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className={r.team_leader_email ? "text-foreground" : "text-muted-foreground italic"}>
                {r.team_leader_email || "none"}
              </span>
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => startEdit(r)}>
                <Pencil className="h-3 w-3" />
              </Button>
              {r.team_leader_email && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => saveTeamLeader(r.id, null)}
                >
                  <Unlink className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </TableCell>
      )}
    </TableRow>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Team Builder</h1>
          <p className="text-sm text-muted-foreground">
            {teams.length} team{teams.length !== 1 ? "s" : ""} · {unassigned.length} unassigned · {relevantResults.length} total respondents
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "teams" ? "default" : "outline"}
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setViewMode("teams")}
          >
            <Users className="h-3.5 w-3.5" /> Teams
          </Button>
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setViewMode("all")}
          >
            All Respondents
          </Button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by email, name, company, role…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {viewMode === "teams" ? (
        <div className="space-y-4">
          {/* Team Cards */}
          {teams.map((team) => {
            const isExpanded = expandedTeam === team.leaderEmail;
            const threshold = team.members.length >= 3;
            return (
              <Card key={team.leaderEmail} className={threshold ? "border-primary/20" : ""}>
                <button
                  className="w-full text-left"
                  onClick={() => setExpandedTeam(isExpanded ? null : team.leaderEmail)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold">{team.leaderEmail}</CardTitle>
                          <CardDescription className="text-xs">
                            {team.members.length} member{team.members.length !== 1 ? "s" : ""} · avg score {team.avgScore}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {threshold ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                            Report Ready
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/20">
                            {3 - team.members.length} more needed
                          </Badge>
                        )}
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>
                  </CardHeader>
                </button>
                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                      <Table className="min-w-[600px]">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Tier</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                            <TableHead>Team Leader</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {team.members.map(r => renderMemberRow(r, true))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {/* Unassigned */}
          {unassigned.length > 0 && (
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Unassigned</CardTitle>
                    <CardDescription className="text-xs">
                      {unassigned.length} respondent{unassigned.length !== 1 ? "s" : ""} without a team leader
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  <Table className="min-w-[600px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                        <TableHead>Team Leader</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {unassigned.map(r => renderMemberRow(r, true))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {teams.length === 0 && unassigned.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No diagnostic submissions with emails yet.
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* All respondents flat view */
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead>Team Leader</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relevantResults
                    .filter(matchesSearch)
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .map(r => renderMemberRow(r, true))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
