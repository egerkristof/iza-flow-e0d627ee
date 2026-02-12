import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Eye, ArrowRight, AlertTriangle, CheckCircle, Clock, LayoutGrid, Columns,
  ListTodo, TrendingUp, Target, Users, ChevronRight, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Shared workbook data (same source as Workbooks grid)
interface OversightWorkbook {
  id: string; title: string; status: "draft" | "active" | "review" | "completed";
  driftScore: number; lastActivity: string; activeProtocol: string | null;
  lastTasks: string[]; lineage: { decision: string; mandate: string; task: string };
}

const MOCK_WORKBOOKS: OversightWorkbook[] = [
  { id: "1", title: "Q1 OKR Planning", status: "active", driftScore: 0.12, lastActivity: "2h ago", activeProtocol: "Strategic Planning v2", lastTasks: ["Define success metrics", "Align team objectives", "Budget allocation"], lineage: { decision: "Board Q1 Directive", mandate: "Growth 30% YoY", task: "OKR Draft Review" } },
  { id: "2", title: "Market Expansion APAC", status: "active", driftScore: 0.45, lastActivity: "5h ago", activeProtocol: "Market Analysis", lastTasks: ["Competitor mapping", "Regulatory review"], lineage: { decision: "Expansion Initiative", mandate: "Enter 3 new markets", task: "APAC Feasibility" } },
  { id: "3", title: "Client Onboarding — Acme Corp", status: "active", driftScore: 0.08, lastActivity: "30m ago", activeProtocol: "Onboarding Setup", lastTasks: ["Kick-off call scheduled", "Integration configured", "SLA signed"], lineage: { decision: "Deal Closed", mandate: "90-day activation", task: "System Setup" } },
  { id: "4", title: "Proposal Pipeline — Enterprise", status: "review", driftScore: 0.62, lastActivity: "1h ago", activeProtocol: "Draft Proposal", lastTasks: ["Pricing review", "Technical scope", "Executive summary"], lineage: { decision: "Sales Qualified", mandate: "Close by Q1", task: "Proposal Finalization" } },
  { id: "5", title: "Deal Retrospective — Beta Inc", status: "completed", driftScore: 0.03, lastActivity: "1d ago", activeProtocol: null, lastTasks: ["Win/loss analysis complete", "Lessons documented"], lineage: { decision: "Deal Won", mandate: "Process Improvement", task: "Retrospective" } },
  { id: "6", title: "Annual Contract Renewal", status: "completed", driftScore: 0.0, lastActivity: "3d ago", activeProtocol: null, lastTasks: ["Renewal signed", "Terms updated"], lineage: { decision: "Retention Priority", mandate: "100% renewal rate", task: "Contract Processing" } },
];

const statusColumns = [
  { key: "active", label: "Active", color: "text-info" },
  { key: "review", label: "Review", color: "text-warning" },
  { key: "completed", label: "Completed", color: "text-success" },
  { key: "draft", label: "Draft", color: "text-muted-foreground" },
];

export default function OversightPage() {
  const navigate = useNavigate();
  const { activeRole, user } = useAuth();
  const queryClient = useQueryClient();
  const [view, setView] = useState<"board" | "grid">("board");
  const [peekWorkbook, setPeekWorkbook] = useState<OversightWorkbook | null>(null);

  // Realtime subscription for task updates
  useEffect(() => {
    const channel = supabase
      .channel("oversight-tasks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workbook_tasks" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["oversight-tasks"] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  // Fetch real tasks for stats
  const { data: allTasks = [] } = useQuery({
    queryKey: ["oversight-tasks"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_tasks")
        .select("id, workbook_id, status, priority, assigned_to, created_by, parent_task_id, title");
      if (error) throw error;
      return data;
    },
  });

  const getDriftColor = (score: number) => score < 0.2 ? "bg-success" : score < 0.5 ? "bg-warning" : "bg-destructive";

  // Role-based descriptions
  const roleLabel = activeRole === "manager" ? "Leader" : activeRole === "architect" ? "Process Owner" : "Operator";
  const roleDescription = activeRole === "manager"
    ? "Cross-workbook oversight — monitor progress, drift, and task completion across your organization."
    : activeRole === "architect"
      ? "Process health & task hierarchy — oversee workbook execution quality and system design."
      : "Your active tasks and workbooks — focus on what needs your attention next.";

  // Aggregate stats
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter(t => t.status === "done").length;
  const blockedTasks = allTasks.filter(t => t.status === "blocked").length;
  const inProgressTasks = allTasks.filter(t => t.status === "in_progress").length;
  const myTasks = allTasks.filter(t => t.assigned_to === user?.id || t.created_by === user?.id);
  const myActive = myTasks.filter(t => t.status === "in_progress" || t.status === "todo");
  const criticalTasks = allTasks.filter(t => t.priority === "critical" && t.status !== "done" && t.status !== "cancelled");

  // Tasks by workbook for stats overlay
  const tasksByWorkbook = useMemo(() => {
    const map: Record<string, { total: number; done: number; blocked: number; inProgress: number }> = {};
    allTasks.forEach(t => {
      if (!map[t.workbook_id]) map[t.workbook_id] = { total: 0, done: 0, blocked: 0, inProgress: 0 };
      map[t.workbook_id].total++;
      if (t.status === "done") map[t.workbook_id].done++;
      if (t.status === "blocked") map[t.workbook_id].blocked++;
      if (t.status === "in_progress") map[t.workbook_id].inProgress++;
    });
    return map;
  }, [allTasks]);

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header with role context */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">📊 Oversight</h1>
            <Badge variant="outline" className="text-[10px]">{roleLabel}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{roleDescription}</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          <Button variant={view === "board" ? "default" : "ghost"} size="sm" className="text-xs" onClick={() => setView("board")}>
            <Columns className="mr-1 h-3 w-3" /> Board
          </Button>
          <Button variant={view === "grid" ? "default" : "ghost"} size="sm" className="text-xs" onClick={() => setView("grid")}>
            <LayoutGrid className="mr-1 h-3 w-3" /> Grid
          </Button>
        </div>
      </div>

      {/* KPI strip — role-aware */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {activeRole === "operator" ? (
          <>
            <StatCard label="My Active Tasks" value={myActive.length} icon={<ListTodo className="h-4 w-4 text-info" />} />
            <StatCard label="My Done" value={myTasks.filter(t => t.status === "done").length} icon={<CheckCircle className="h-4 w-4 text-success" />} />
            <StatCard label="Blocked" value={myTasks.filter(t => t.status === "blocked").length} icon={<AlertTriangle className="h-4 w-4 text-destructive" />} />
            <StatCard label="Active Workbooks" value={MOCK_WORKBOOKS.filter(w => w.status === "active").length} icon={<Target className="h-4 w-4 text-primary" />} />
          </>
        ) : (
          <>
            <StatCard label="Total Tasks" value={totalTasks} sub={`${doneTasks} done`} icon={<ListTodo className="h-4 w-4 text-info" />} />
            <StatCard label="Completion" value={totalTasks > 0 ? `${Math.round((doneTasks / totalTasks) * 100)}%` : "—"} icon={<TrendingUp className="h-4 w-4 text-success" />} />
            <StatCard label="Blocked" value={blockedTasks} icon={<AlertTriangle className="h-4 w-4 text-destructive" />} />
            <StatCard label="Critical Open" value={criticalTasks.length} icon={<AlertTriangle className="h-4 w-4 text-warning" />} />
          </>
        )}
      </div>

      {/* Tabbed view: Workbooks vs My Tasks (operator gets tasks-first) */}
      <Tabs defaultValue={activeRole === "operator" ? "my-tasks" : "workbooks"}>
        <TabsList>
          {activeRole === "operator" && <TabsTrigger value="my-tasks"><ListTodo className="mr-1.5 h-3.5 w-3.5" />My Tasks</TabsTrigger>}
          <TabsTrigger value="workbooks"><Columns className="mr-1.5 h-3.5 w-3.5" />Workbooks</TabsTrigger>
          {(activeRole === "manager" || activeRole === "architect") && (
            <TabsTrigger value="task-hierarchy"><Target className="mr-1.5 h-3.5 w-3.5" />Task Hierarchy</TabsTrigger>
          )}
        </TabsList>

        {/* My Tasks tab — operator focus */}
        {activeRole === "operator" && (
          <TabsContent value="my-tasks" className="mt-4">
            <div className="space-y-2">
              {myActive.length === 0 ? (
                <div className="rounded-lg border border-border/50 bg-card p-8 text-center text-sm text-muted-foreground">
                  No active tasks assigned to you. Check your workbooks for new work.
                </div>
              ) : (
                myActive.map(task => (
                  <div key={task.id} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3 hover:border-primary/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/workbooks/${task.workbook_id}`)}>
                    <div className={`shrink-0 ${task.status === "in_progress" ? "text-info" : "text-muted-foreground"}`}>
                      {task.status === "in_progress" ? <Clock className="h-4 w-4" /> : <ListTodo className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {MOCK_WORKBOOKS.find(w => w.id === task.workbook_id)?.title ?? "Workbook"}
                      </p>
                    </div>
                    <Badge className={`text-[10px] ${task.priority === "critical" ? "bg-destructive/10 text-destructive" : task.priority === "high" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>
                      {task.priority}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        )}

        {/* Workbooks board/grid */}
        <TabsContent value="workbooks" className="mt-4">
          {view === "board" ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {statusColumns.map(col => {
                const items = MOCK_WORKBOOKS.filter(w => w.status === col.key);
                return (
                  <div key={col.key} className="flex min-w-[300px] flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-semibold uppercase tracking-wider ${col.color}`}>{col.label}</h3>
                      <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
                    </div>
                    {items.map(wb => (
                      <OversightCard key={wb.id} workbook={wb} getDriftColor={getDriftColor} onPeek={setPeekWorkbook} onOpen={() => navigate(`/workbooks/${wb.id}`)} taskStats={tasksByWorkbook[wb.id]} />
                    ))}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_WORKBOOKS.map(wb => (
                <OversightCard key={wb.id} workbook={wb} getDriftColor={getDriftColor} onPeek={setPeekWorkbook} onOpen={() => navigate(`/workbooks/${wb.id}`)} taskStats={tasksByWorkbook[wb.id]} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Task Hierarchy — leader/owner view */}
        {(activeRole === "manager" || activeRole === "architect") && (
          <TabsContent value="task-hierarchy" className="mt-4">
            <TaskHierarchyView tasks={allTasks} workbooks={MOCK_WORKBOOKS} onNavigate={(wbId) => navigate(`/workbooks/${wbId}`)} />
          </TabsContent>
        )}
      </Tabs>

      {/* Lineage Peek Modal */}
      <Dialog open={!!peekWorkbook} onOpenChange={() => setPeekWorkbook(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-base">{peekWorkbook?.title}</DialogTitle></DialogHeader>
          {peekWorkbook && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Active Protocol</p>
                <p className="text-sm">{peekWorkbook.activeProtocol ? <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-success" /> {peekWorkbook.activeProtocol}</span> : <span className="text-muted-foreground italic">None — Idle</span>}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Drift Score</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full ${getDriftColor(peekWorkbook.driftScore)}`} style={{ width: `${peekWorkbook.driftScore * 100}%` }} />
                  </div>
                  <span className="text-xs">{Math.round(peekWorkbook.driftScore * 100)}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Recent Tasks</p>
                <ul className="space-y-1">{peekWorkbook.lastTasks.map((task, i) => <li key={i} className="flex items-center gap-2 text-sm"><div className="h-1.5 w-1.5 rounded-full bg-primary" />{task}</li>)}</ul>
              </div>
              {/* Task stats in peek */}
              {tasksByWorkbook[peekWorkbook.id] && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Task Progress</p>
                  <div className="flex items-center gap-2">
                    <Progress value={tasksByWorkbook[peekWorkbook.id].total > 0 ? (tasksByWorkbook[peekWorkbook.id].done / tasksByWorkbook[peekWorkbook.id].total) * 100 : 0} className="h-2" />
                    <span className="text-xs">{tasksByWorkbook[peekWorkbook.id].done}/{tasksByWorkbook[peekWorkbook.id].total}</span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Task Lineage</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded bg-secondary px-2 py-1">{peekWorkbook.lineage.decision}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="rounded bg-secondary px-2 py-1">{peekWorkbook.lineage.mandate}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="rounded bg-primary/10 text-primary px-2 py-1 font-medium">{peekWorkbook.lineage.task}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Stat Card ──
function StatCard({ label, value, sub, icon }: { label: string; value: string | number; sub?: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Oversight Card with task stats ──
function OversightCard({ workbook, getDriftColor, onPeek, onOpen, taskStats }: {
  workbook: OversightWorkbook;
  getDriftColor: (s: number) => string;
  onPeek: (wb: OversightWorkbook) => void;
  onOpen: () => void;
  taskStats?: { total: number; done: number; blocked: number; inProgress: number };
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:glow-sm cursor-pointer" onClick={onOpen}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{workbook.title}</span>
            <span className={`h-2 w-2 rounded-full ${getDriftColor(workbook.driftScore)}`} title={`Drift: ${Math.round(workbook.driftScore * 100)}%`} />
          </div>
          {workbook.activeProtocol && <p className="mt-1 text-xs text-primary">{workbook.activeProtocol}</p>}
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {workbook.lastActivity}</p>
          {/* Task progress bar */}
          {taskStats && taskStats.total > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="h-1.5 flex-1 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-success" style={{ width: `${(taskStats.done / taskStats.total) * 100}%` }} />
              </div>
              <span className="text-[10px] text-muted-foreground">{taskStats.done}/{taskStats.total}</span>
            </div>
          )}
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={e => { e.stopPropagation(); onPeek(workbook); }}>
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ── Task Hierarchy View (Leaders & Process Owners) ──
function TaskHierarchyView({ tasks, workbooks, onNavigate }: {
  tasks: any[];
  workbooks: OversightWorkbook[];
  onNavigate: (wbId: string) => void;
}) {
  const [expandedWb, setExpandedWb] = useState<Set<string>>(new Set());

  const tasksByWb = useMemo(() => {
    const map: Record<string, any[]> = {};
    tasks.forEach(t => {
      if (!map[t.workbook_id]) map[t.workbook_id] = [];
      map[t.workbook_id].push(t);
    });
    return map;
  }, [tasks]);

  const toggleWb = (id: string) => setExpandedWb(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const workbooksWithTasks = workbooks.filter(wb => tasksByWb[wb.id]?.length > 0);

  if (workbooksWithTasks.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-card p-8 text-center text-sm text-muted-foreground">
        No tasks across workbooks yet. Tasks created within workbooks will appear here for oversight.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {workbooksWithTasks.map(wb => {
        const wbTasks = tasksByWb[wb.id] || [];
        const done = wbTasks.filter((t: any) => t.status === "done").length;
        const isExpanded = expandedWb.has(wb.id);
        const roots = wbTasks.filter((t: any) => !t.parent_task_id);

        return (
          <div key={wb.id} className="rounded-lg border border-border/50 bg-card overflow-hidden">
            <button
              className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary/20 transition-colors"
              onClick={() => toggleWb(wb.id)}
            >
              <div className="flex items-center gap-3">
                {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm font-medium">{wb.title}</span>
                <Badge variant="outline" className="text-[10px]">{wbTasks.length} tasks</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-20 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-success" style={{ width: `${wbTasks.length > 0 ? (done / wbTasks.length) * 100 : 0}%` }} />
                </div>
                <span className="text-xs text-muted-foreground">{done}/{wbTasks.length}</span>
                <Button variant="ghost" size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); onNavigate(wb.id); }}>
                  Open →
                </Button>
              </div>
            </button>
            {isExpanded && (
              <div className="border-t border-border/30 px-4 py-2 space-y-1">
                {roots.map((task: any) => (
                  <HierarchyTaskRow key={task.id} task={task} allTasks={wbTasks} depth={0} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function HierarchyTaskRow({ task, allTasks, depth }: { task: any; allTasks: any[]; depth: number }) {
  const [expanded, setExpanded] = useState(false);
  const children = allTasks.filter((t: any) => t.parent_task_id === task.id);
  const hasChildren = children.length > 0;
  const statusColor = task.status === "done" ? "text-success" : task.status === "in_progress" ? "text-info" : task.status === "blocked" ? "text-destructive" : "text-muted-foreground";

  return (
    <div>
      <div className="flex items-center gap-2 py-1.5" style={{ paddingLeft: `${depth * 20}px` }}>
        {hasChildren ? (
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronDown className="h-3 w-3 text-muted-foreground" /> : <ChevronRight className="h-3 w-3 text-muted-foreground" />}
          </button>
        ) : <span className="w-3" />}
        <span className={`${statusColor}`}>
          {task.status === "done" ? <CheckCircle className="h-3.5 w-3.5" /> : task.status === "in_progress" ? <Clock className="h-3.5 w-3.5" /> : task.status === "blocked" ? <AlertTriangle className="h-3.5 w-3.5" /> : <ListTodo className="h-3.5 w-3.5" />}
        </span>
        <span className={`text-sm ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>{task.title}</span>
        <Badge className={`text-[9px] ml-auto ${task.priority === "critical" ? "bg-destructive/10 text-destructive" : task.priority === "high" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"}`}>
          {task.priority}
        </Badge>
      </div>
      {hasChildren && expanded && children.map((child: any) => (
        <HierarchyTaskRow key={child.id} task={child} allTasks={allTasks} depth={depth + 1} />
      ))}
    </div>
  );
}
