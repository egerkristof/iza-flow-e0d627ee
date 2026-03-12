import { useEffect, useState } from "react";
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
import { Users, ClipboardList, Send, ChevronDown, ChevronUp, LogOut, ShieldCheck, Mail, MailX, MessageSquareText } from "lucide-react";
import { format } from "date-fns";
import { QUESTIONS, DIMENSION_LABELS, calculateResults, type Dimension } from "@/lib/diagnostic-scoring";

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
}

interface UserRole {
  user_id: string;
  role: string;
}

type AdminView = "members" | "diagnostics";

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

  useEffect(() => {
    if (isArchitect) loadData();
  }, [isArchitect]);

  const loadData = async () => {
    setLoadingData(true);
    const [profilesRes, rolesRes, diagRes] = await Promise.all([
      supabase.from("profiles").select("user_id, display_name, avatar_url, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("diagnostic_results").select("*").order("created_at", { ascending: false }),
    ]);
    if (profilesRes.data) setProfiles(profilesRes.data);
    if (rolesRes.data) setUserRoles(rolesRes.data as UserRole[]);
    if (diagRes.data) setResults(diagRes.data as DiagnosticResult[]);
    setLoadingData(false);
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

  const dimensionLabels: Record<string, string> = {
    standards: "Standards Adoption",
    capture: "Knowledge Capture",
    reuse: "Knowledge Reuse",
    delegation: "Delegation Readiness",
    learning: "Learning Loops",
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
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 border-r border-border bg-muted/30 flex flex-col">
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
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
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
                  <div className="flex items-end gap-3 flex-wrap">
                    <div className="space-y-1.5 flex-1 min-w-[200px]">
                      <Label htmlFor="invite-email">Email</Label>
                      <Input id="invite-email" type="email" placeholder="colleague@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                    </div>
                    <div className="space-y-1.5 w-40">
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
                    <Button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()} className="gap-2">
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
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {activeView === "diagnostics" && (
            <>
              <div>
                <h1 className="text-xl font-bold text-foreground">Diagnostic Results</h1>
                <p className="text-sm text-muted-foreground">Review submissions from the AI Execution Diagnostic.</p>
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Archetype</TableHead>
                          <TableHead className="text-right">Score</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((r) => (
                          <>
                            <TableRow key={r.id} className="cursor-pointer" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                              <TableCell className="text-sm">{format(new Date(r.created_at), "MMM d, yyyy HH:mm")}</TableCell>
                              <TableCell className="text-sm">{r.email || <span className="text-muted-foreground italic">anonymous</span>}</TableCell>
                              <TableCell><Badge variant="outline" className="text-xs">{r.archetype}</Badge></TableCell>
                              <TableCell className="text-right font-mono font-semibold">{r.overall_score}</TableCell>
                              <TableCell className="w-8">
                                {expandedId === r.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                              </TableCell>
                            </TableRow>
                            {expandedId === r.id && (
                              <TableRow key={`${r.id}-detail`}>
                                <TableCell colSpan={5} className="bg-muted/30 p-4">
                                  <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-foreground">Dimension Scores</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                      {Object.entries(r.scores as Record<string, number>).map(([key, val]) => (
                                        <div key={key} className="rounded-md border border-border bg-background p-3">
                                          <p className="text-xs text-muted-foreground">{dimensionLabels[key] || key}</p>
                                          <p className="text-lg font-bold text-foreground">{val}<span className="text-xs text-muted-foreground">/100</span></p>
                                        </div>
                                      ))}
                                    </div>
                                    <h4 className="text-sm font-semibold text-foreground pt-2">Raw Answers</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                      {Object.entries(r.answers as Record<string, number>).map(([qKey, aVal]) => (
                                        <div key={qKey} className="text-xs">
                                          <span className="text-muted-foreground">Q{qKey}: </span>
                                          <span className="font-medium">{aVal}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
