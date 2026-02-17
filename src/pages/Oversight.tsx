import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Eye, AlertTriangle, CheckCircle, Clock, LayoutGrid, Columns,
  ListTodo, TrendingUp, Target, ChevronRight, ChevronDown, Archive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { NerveCenterFeed } from "@/components/oversight/NerveCenterFeed";
import { formatDistanceToNow } from "date-fns";

function formatRelativeTime(dateStr: string): string {
  try { return formatDistanceToNow(new Date(dateStr), { addSuffix: false }) + " ago"; }
  catch { return "—"; }
}

interface OversightWorkbook {
  id: string;
  title: string;
  status: "draft" | "active" | "review" | "completed" | "archived";
  driftScore: number;
  lastActivity: string;
  strategicOutcome: string | null;
  description: string | null;
}

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
  const [showArchived, setShowArchived] = useState(false);
  const [peekWorkbook, setPeekWorkbook] = useState<OversightWorkbook | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel("oversight-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "workbook_tasks" }, () => {
        queryClient.invalidateQueries({ queryKey: ["oversight-tasks"] });
        queryClient.invalidateQueries({ queryKey: ["nerve-center-tasks"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "workbooks" }, () => {
        queryClient.invalidateQueries({ queryKey: ["oversight-workbooks"] });
        queryClient.invalidateQueries({ queryKey: ["nerve-center-workbooks"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "protocol_executions" }, () => {
        queryClient.invalidateQueries({ queryKey: ["nerve-center-sessions"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  const { data: workbooks = [] } = useQuery({
    queryKey: ["oversight-workbooks"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbooks")
        .select("id, title, status, drift_score, strategic_outcome, description, updated_at");
      if (error) throw error;
      return data.map((wb): OversightWorkbook => ({
        id: wb.id,
        title: wb.title,
        status: wb.status as OversightWorkbook["status"],
        driftScore: Number(wb.drift_score ?? 0),
        lastActivity: formatRelativeTime(wb.updated_at),
        strategicOutcome: wb.strategic_outcome,
        description: wb.description,
      }));
    },
  });

  const { data: allTasks = [] } = useQuery({
    queryKey: ["oversight-tasks"],
    enabled: !!user && activeRole !== "operator",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_tasks")
        .select("id, workbook_id, status, priority, assigned_to, created_by, parent_task_id, title");
      if (error) throw error;
      return data;
    },
  });

  const getDriftColor = (score: number) => score < 0.2 ? "bg-success" : score < 0.5 ? "bg-warning" : "bg-destructive";

  const roleLabel = activeRole === "manager" ? "Leader" : activeRole === "architect" ? "Process Owner" : "Operator";
  const roleDescription = activeRole === "operator"
    ? "Your command center — prioritized tasks, active sessions, and delegations at a glance."
    : activeRole === "manager"
      ? "Cross-workbook oversight — monitor progress, drift, and task completion across your organization."
      : "Process health & task hierarchy — oversee workbook execution quality and system design.";

  // Leader/architect stats
  const totalTasks = allTasks.length;
  const doneTasks = allTasks.filter(t => t.status === "done").length;
  const blockedTasks = allTasks.filter(t => t.status === "blocked").length;
  const criticalTasks = allTasks.filter(t => t.priority === "critical" && t.status !== "done" && t.status !== "cancelled");

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

  // ─── Operator gets the Nerve Center ───
  if (activeRole === "operator") {
    return (
      <div className="flex flex-col gap-6 p-6 lg:p-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">⚡ Nerve Center</h1>
            <Badge variant="outline" className="text-[10px]">{roleLabel}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{roleDescription}</p>
        </div>
        <NerveCenterFeed />
      </div>
    );
  }

  // ─── Leader / Process Owner views (unchanged) ───
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">📊 Oversight</h1>
            <Badge variant="outline" className="text-[10px]">{roleLabel}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{roleDescription}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition-colors ${showArchived ? "border-primary/30 bg-primary/5 text-primary" : "border-border/50 text-muted-foreground hover:border-primary/20"}`}
          >
            <Archive className="h-3 w-3" />
            {showArchived ? "Hide Archived" : "Show Archived"}
          </button>
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            <Button variant={view === "board" ? "default" : "ghost"} size="sm" className="text-xs" onClick={() => setView("board")}>
              <Columns className="mr-1 h-3 w-3" /> Board
            </Button>
            <Button variant={view === "grid" ? "default" : "ghost"} size="sm" className="text-xs" onClick={() => setView("grid")}>
              <LayoutGrid className="mr-1 h-3 w-3" /> Grid
            </Button>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Tasks" value={totalTasks} sub={`${doneTasks} done`} icon={<ListTodo className="h-4 w-4 text-info" />} />
        <StatCard label="Completion" value={totalTasks > 0 ? `${Math.round((doneTasks / totalTasks) * 100)}%` : "—"} icon={<TrendingUp className="h-4 w-4 text-success" />} />
        <StatCard label="Blocked" value={blockedTasks} icon={<AlertTriangle className="h-4 w-4 text-destructive" />} />
        <StatCard label="Critical Open" value={criticalTasks.length} icon={<AlertTriangle className="h-4 w-4 text-warning" />} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="workbooks">
        <TabsList>
          <TabsTrigger value="workbooks"><Columns className="mr-1.5 h-3.5 w-3.5" />Workbooks</TabsTrigger>
          <TabsTrigger value="task-hierarchy"><Target className="mr-1.5 h-3.5 w-3.5" />Task Hierarchy</TabsTrigger>
        </TabsList>

        <TabsContent value="workbooks" className="mt-4">
          {view === "board" ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {statusColumns.map(col => {
                const items = workbooks.filter(w => w.status === col.key);
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
              {showArchived && (() => {
                const archivedItems = workbooks.filter(w => w.status === "archived");
                return (
                  <div className="flex min-w-[300px] flex-col gap-3 opacity-50">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Archive className="h-3.5 w-3.5" /> Archived</h3>
                      <Badge variant="outline" className="text-[10px]">{archivedItems.length}</Badge>
                    </div>
                    {archivedItems.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic px-2">No archived workbooks</p>
                    ) : archivedItems.map(wb => (
                      <OversightCard key={wb.id} workbook={wb} getDriftColor={getDriftColor} onPeek={setPeekWorkbook} onOpen={() => navigate(`/workbooks/${wb.id}`)} taskStats={tasksByWorkbook[wb.id]} />
                    ))}
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workbooks.filter(w => showArchived || w.status !== "archived").map(wb => (
                <div key={wb.id} className={wb.status === "archived" ? "opacity-50" : ""}>
                  <OversightCard workbook={wb} getDriftColor={getDriftColor} onPeek={setPeekWorkbook} onOpen={() => navigate(`/workbooks/${wb.id}`)} taskStats={tasksByWorkbook[wb.id]} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="task-hierarchy" className="mt-4">
          <TaskHierarchyView tasks={allTasks} workbooks={workbooks} onNavigate={(wbId) => navigate(`/workbooks/${wbId}`)} />
        </TabsContent>
      </Tabs>

      {/* Peek Modal */}
      <Dialog open={!!peekWorkbook} onOpenChange={() => setPeekWorkbook(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-base">{peekWorkbook?.title}</DialogTitle></DialogHeader>
          {peekWorkbook && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Strategic Outcome</p>
                <p className="text-sm">{peekWorkbook.strategicOutcome ?? <span className="text-muted-foreground italic">Not defined</span>}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Status</p>
                <Badge variant="outline" className="text-xs capitalize">{peekWorkbook.status}</Badge>
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
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Last Activity</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {peekWorkbook.lastActivity}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
          {workbook.strategicOutcome && <p className="mt-1 text-xs text-primary">{workbook.strategicOutcome}</p>}
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {workbook.lastActivity}</p>
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
        No tasks across workbooks yet.
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
        <span className={statusColor}>
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
