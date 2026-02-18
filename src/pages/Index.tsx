import { useState, useMemo } from "react";
import { BookOpen, Library, BarChart3, Shield, Zap, ChevronRight, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MandatesDashboard } from "@/components/mandates/MandatesDashboard";
import { NerveCenterFeed } from "@/components/oversight/NerveCenterFeed";
import { QuickActionsBar } from "@/components/oversight/QuickActionsBar";
import { PlanMyTime } from "@/components/oversight/PlanMyTime";
import { WhereYouLeftOff } from "@/components/oversight/WhereYouLeftOff";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { computePriorityScore, sortByScore, type ScoredFeedItem } from "@/lib/priority-scoring";

const Index = () => {
  const { activeRole, user, profile } = useAuth();
  const isLeader = activeRole === "manager";
  const isOperator = activeRole === "operator";
  const [mandatesOpen, setMandatesOpen] = useState(false);
  const [feedOpen, setFeedOpen] = useState(false);

  // Fetch active mandate count
  const { data: activeMandateCount = 0 } = useQuery({
    queryKey: ["active-mandate-count", user?.id],
    enabled: !!user && isOperator,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("context_items")
        .select("id", { count: "exact", head: true })
        .eq("is_mandate", true)
        .eq("mandate_status", "active")
        .is("deleted_at", null);
      if (error) throw error;
      return count ?? 0;
    },
  });

  // Fetch top-priority session for hero card
  const { data: mySessions = [] } = useQuery({
    queryKey: ["operator-hero-sessions", user?.id],
    enabled: !!user && isOperator,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("protocol_executions")
        .select(`id, workbook_id, protocol_id, status, drift_score, updated_at, current_step_id, session_summary, workbook_protocols(title)`)
        .eq("executed_by", user!.id)
        .in("status", ["in_progress", "paused"])
        .order("updated_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: workbooks = [] } = useQuery({
    queryKey: ["operator-hero-workbooks", user?.id],
    enabled: !!user && isOperator,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbooks")
        .select("id, title, status, drift_score, updated_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  const sessionIds = mySessions.map(s => s.protocol_id);
  const { data: stepCounts = [] } = useQuery({
    queryKey: ["operator-hero-step-counts", sessionIds],
    enabled: sessionIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("protocol_steps")
        .select("protocol_id")
        .in("protocol_id", sessionIds);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: stepExecs = [] } = useQuery({
    queryKey: ["operator-hero-step-execs", mySessions.map(s => s.id)],
    enabled: mySessions.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("step_executions")
        .select("execution_id, status")
        .in("execution_id", mySessions.map(s => s.id));
      if (error) throw error;
      return data ?? [];
    },
  });

  const heroItem = useMemo((): ScoredFeedItem | null => {
    if (!mySessions.length) return null;
    const workbookMap: Record<string, string> = {};
    workbooks.forEach(wb => { workbookMap[wb.id] = wb.title; });

    const totalStepsByProtocol: Record<string, number> = {};
    stepCounts.forEach(s => {
      totalStepsByProtocol[s.protocol_id] = (totalStepsByProtocol[s.protocol_id] ?? 0) + 1;
    });

    const completedStepsByExecution: Record<string, number> = {};
    stepExecs.forEach(se => {
      if (se.status === "completed") {
        completedStepsByExecution[se.execution_id] = (completedStepsByExecution[se.execution_id] ?? 0) + 1;
      }
    });

    const items: ScoredFeedItem[] = mySessions.map(s => {
      const protocolTitle = (s as any).workbook_protocols?.title ?? "Session";
      const item: ScoredFeedItem = {
        id: s.id,
        type: "session",
        title: protocolTitle,
        workbookId: s.workbook_id,
        workbookTitle: workbookMap[s.workbook_id] ?? "Workbook",
        status: s.status,
        updatedAt: s.updated_at,
        driftScore: Number(s.drift_score ?? 0),
        totalSteps: totalStepsByProtocol[s.protocol_id] ?? 0,
        completedSteps: completedStepsByExecution[s.id] ?? 0,
        sessionSummary: (s as any).session_summary ?? null,
        executionId: s.id,
        protocolTitle,
        score: 0,
      };
      item.score = computePriorityScore(item);
      return item;
    });

    return sortByScore(items)[0] ?? null;
  }, [mySessions, workbooks, stepCounts, stepExecs]);

  // Greeting based on time
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const name = profile?.display_name?.split(" ")[0] ?? "there";
    if (hour < 12) return `Good morning, ${name}.`;
    if (hour < 17) return `Good afternoon, ${name}.`;
    return `Good evening, ${name}.`;
  }, [profile?.display_name]);

  // ─── Operator Dashboard ───
  if (isOperator) {
    return (
      <div
        className="flex flex-col gap-5 p-6 lg:p-8 relative min-h-screen"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% 0%, hsl(200 90% 52% / 0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 85% 20%, hsl(155 72% 46% / 0.03) 0%, transparent 50%),
            radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.04) 1px, transparent 0)
          `,
          backgroundSize: "100% 100%, 100% 100%, 28px 28px",
        }}
      >
        {/* ── 1. GREETING ── */}
        <div>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-1">Mission Briefing</p>
          <h1 className="text-3xl font-bold tracking-tight brand-gradient-text">{greeting}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Here's where you stand. Pick up where you left off, or set your horizon for today.
          </p>
        </div>

        {/* ── 2. RESUME HERO — top priority session ── */}
        {heroItem && (
          <WhereYouLeftOff item={heroItem} />
        )}

        {/* ── 3. OPERATIONAL HORIZON — open by default, the core ── */}
        <PlanMyTime />

        {/* ── 4. SIGNALS STRIP — mandates + quick actions in one row ── */}
        <div className="space-y-2">
          {/* Mandates — compact, collapsed by default */}
          <Collapsible open={mandatesOpen} onOpenChange={setMandatesOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full rounded-lg border border-border/50 bg-card px-4 py-2.5 hover:border-warning/30 transition-colors text-left">
              <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${mandatesOpen ? "rotate-90" : ""}`} />
              <Shield className="h-3.5 w-3.5 text-warning" />
              <span className="text-[11px] font-medium uppercase tracking-widest flex-1">Leadership Mandates</span>
              {activeMandateCount > 0 ? (
                <Badge className="text-[9px] bg-warning/15 text-warning border-warning/30 flex items-center gap-0.5">
                  <AlertTriangle className="h-2.5 w-2.5" />
                  {activeMandateCount} active
                </Badge>
              ) : (
                <span className="text-[10px] text-muted-foreground">None active</span>
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1.5">
              <MandatesDashboard compact />
            </CollapsibleContent>
          </Collapsible>

          {/* Quick nav */}
          <div className="px-1">
            <QuickActionsBar />
          </div>
        </div>

        {/* ── 5. PRIORITY FEED — full feed, collapsed ── */}
        <Collapsible open={feedOpen} onOpenChange={setFeedOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full rounded-lg border border-border/50 bg-card px-4 py-2.5 hover:border-primary/30 transition-colors text-left">
            <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${feedOpen ? "rotate-90" : ""}`} />
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] font-medium uppercase tracking-widest flex-1">Priority Feed</span>
            <span className="text-[10px] text-muted-foreground">All tasks & sessions</span>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1.5">
            <NerveCenterFeed />
          </CollapsibleContent>
        </Collapsible>

      </div>
    );
  }

  // ─── Leader / Process Owner Dashboard ───
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary mb-1">Your Organisational Intelligence</p>
        <h1 className="text-3xl font-bold tracking-tight brand-gradient-text">Good to have you back.</h1>
        <p className="mt-2 text-muted-foreground">
          Your team's best thinking, made executable. Not just documentation — working systems.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickCard
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          label="EXECUTE"
          title="Workbooks"
          description="Where expertise meets action. Run protocol-guided work and capture what you learn."
          href="/workbooks"
        />
        <QuickCard
          icon={<Library className="h-5 w-5 text-success" />}
          label="DESIGN"
          title="Playbooks"
          description="Combine explicit knowledge into reusable systems your whole team can execute with."
          href="/context"
        />
        <QuickCard
          icon={<BarChart3 className="h-5 w-5 text-warning" />}
          label="OVERSEE"
          title="Oversight"
          description="See the full picture — workbook progress, drift, and strategic intent in one view."
          href="/oversight"
        />
      </div>

      {isLeader && (
        <div className="rounded-lg border border-warning/20 bg-warning/5 p-5">
          <MandatesDashboard compact />
        </div>
      )}
    </div>
  );
};

function QuickCard({ icon, title, description, href, label }: { icon: React.ReactNode; title: string; description: string; href: string; label?: string }) {
  return (
    <a
      href={href}
      className="group flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:glow-sm relative overflow-hidden"
    >
      {label && (
        <span className="absolute top-4 right-4 text-[10px] font-semibold tracking-[0.15em] uppercase text-primary">
          {label}
        </span>
      )}
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 border border-primary/20">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </a>
  );
}

export default Index;
