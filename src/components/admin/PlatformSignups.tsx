import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2, Users } from "lucide-react";

interface PlatformSignup {
  id: string;
  created_at: string;
  name: string | null;
  email: string;
  company: string | null;
  role: string | null;
  team_size: string | null;
  primary_interest: string | null;
  additional_notes: string | null;
}

const INTEREST_LABELS: Record<string, string> = {
  governance: "🧠 Standardize AI",
  playbooks: "📋 Playbooks",
  oversight: "🔍 Visibility",
  all: "🚀 Full platform",
};

const ROLE_LABELS: Record<string, string> = {
  "c-level": "C-Level",
  "vp-director": "VP / Director",
  manager: "Manager / Lead",
  ic: "IC",
};

export default function PlatformSignups() {
  const [signups, setSignups] = useState<PlatformSignup[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSignups = async () => {
    const { data } = await supabase
      .from("platform_signups")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSignups(data as PlatformSignup[]);
    setLoading(false);
  };

  useEffect(() => {
    loadSignups();

    const channel = supabase
      .channel("admin-platform-signups")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "platform_signups" }, () => {
        loadSignups();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Platform Signups</h1>
        <p className="text-sm text-muted-foreground">People who requested early access to LIZA OS.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-2xl font-bold text-foreground">{signups.length}</p>
            <p className="text-xs text-muted-foreground">Total signups</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-2xl font-bold text-foreground">
              {new Set(signups.map(s => s.company?.toLowerCase()).filter(Boolean)).size}
            </p>
            <p className="text-xs text-muted-foreground">Companies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-2xl font-bold text-foreground">
              {signups.filter(s => s.role === "c-level" || s.role === "vp-director").length}
            </p>
            <p className="text-xs text-muted-foreground">Senior leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-2xl font-bold text-foreground">
              {signups.filter(s => s.primary_interest === "all").length}
            </p>
            <p className="text-xs text-muted-foreground">Full platform interest</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" /> All signups
          </CardTitle>
          <CardDescription>{signups.length} requests received</CardDescription>
        </CardHeader>
        <CardContent>
          {signups.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No signups yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signups.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name || "—"}</TableCell>
                      <TableCell className="text-sm">{s.email}</TableCell>
                      <TableCell className="text-sm">{s.company || "—"}</TableCell>
                      <TableCell>
                        {s.role ? (
                          <Badge variant="outline" className="text-xs">
                            {ROLE_LABELS[s.role] || s.role}
                          </Badge>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-sm">{s.team_size || "—"}</TableCell>
                      <TableCell className="text-sm">
                        {s.primary_interest ? (INTEREST_LABELS[s.primary_interest] || s.primary_interest) : "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(s.created_at), "MMM d, HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
