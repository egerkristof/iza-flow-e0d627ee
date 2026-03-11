import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, ClipboardList, Send, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

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

export default function AdminPage() {
  const { activeRole, loading } = useAuth();
  const { toast } = useToast();

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

  useEffect(() => {
    if (activeRole !== "architect") return;
    loadData();
  }, [activeRole]);

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

  if (loading) return null;
  if (activeRole !== "architect") return <Navigate to="/app" replace />;

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Manage members and review diagnostic submissions.</p>
        </div>

        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members" className="gap-2"><Users className="h-4 w-4" /> Members</TabsTrigger>
            <TabsTrigger value="diagnostics" className="gap-2"><ClipboardList className="h-4 w-4" /> Diagnostics</TabsTrigger>
          </TabsList>

          {/* ── Members Tab ── */}
          <TabsContent value="members" className="space-y-6 mt-4">
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
                          <TableCell className="font-medium">{p.display_name || "—"}</TableCell>
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
          </TabsContent>

          {/* ── Diagnostics Tab ── */}
          <TabsContent value="diagnostics" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Diagnostic submissions</CardTitle>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
