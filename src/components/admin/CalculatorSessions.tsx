import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Mail, MailX } from "lucide-react";
import { format } from "date-fns";

interface CalcSession {
  id: string;
  session_id: string;
  team_size: number;
  department: string;
  hourly_cost: number;
  rework_annual: number;
  total_gap: number;
  recoverable: number;
  email: string | null;
  name: string | null;
  company: string | null;
  email_captured_at: string | null;
  referrer: string | null;
  created_at: string;
  updated_at: string;
}

function formatEur(n: number) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CalculatorSessions() {
  const [sessions, setSessions] = useState<CalcSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data, error } = await (supabase as any)
        .from("calculator_sessions")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(200);
      if (!active) return;
      if (!error && data) setSessions(data as CalcSession[]);
      setLoading(false);
    };
    void load();
    const interval = setInterval(load, 15_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const stats = useMemo(() => {
    const total = sessions.length;
    const withEmail = sessions.filter((s) => s.email).length;
    const avgGap = total
      ? Math.round(sessions.reduce((a, s) => a + Number(s.total_gap), 0) / total)
      : 0;
    const deptCounts: Record<string, number> = {};
    for (const s of sessions) deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
    const topDept = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const conversionRate = total ? Math.round((withEmail / total) * 100) : 0;
    return { total, withEmail, avgGap, topDept, conversionRate };
  }, [sessions]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Calculator usage</CardTitle>
            <CardDescription>
              Engaged sessions on the Instruction Gap calculator (10s + interaction).
            </CardDescription>
          </div>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Stats */}
        <div className="grid gap-3 md:grid-cols-5">
          <StatBox label="Sessions" value={String(stats.total)} />
          <StatBox label="Email captured" value={`${stats.withEmail} (${stats.conversionRate}%)`} />
          <StatBox label="Avg gap" value={formatEur(stats.avgGap)} />
          <StatBox label="Top dept" value={stats.topDept} />
          <StatBox label="Showing" value={`Last ${Math.min(sessions.length, 200)}`} />
        </div>

        {/* Table */}
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No calculator sessions yet. Engagement is logged after 10 seconds + at least one input change.
          </p>
        ) : (
          <div className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Lead</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Team</TableHead>
                  <TableHead className="text-right">€/hr</TableHead>
                  <TableHead className="text-right">Total gap</TableHead>
                  <TableHead className="text-right">Recoverable</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      {s.email ? (
                        <Mail className="h-4 w-4 text-primary" />
                      ) : (
                        <MailX className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </TableCell>
                    <TableCell>
                      {s.email ? (
                        <div>
                          <p className="text-sm font-medium text-foreground">{s.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {[s.name, s.company].filter(Boolean).join(" · ") || "Anonymous lead"}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground font-mono">
                          {s.session_id.slice(0, 8)}…
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {s.department}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{s.team_size}</TableCell>
                    <TableCell className="text-right tabular-nums">€{s.hourly_cost}</TableCell>
                    <TableCell className="text-right tabular-nums font-semibold">
                      {formatEur(Number(s.total_gap))}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-primary">
                      {formatEur(Number(s.recoverable))}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[160px] truncate">
                      {s.referrer || "Direct"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(s.updated_at), "MMM d, h:mm a")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
