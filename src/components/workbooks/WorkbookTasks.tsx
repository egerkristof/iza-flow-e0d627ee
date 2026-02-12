import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus, ChevronRight, ChevronDown, Circle, CheckCircle2, Clock, AlertTriangle,
  XCircle, Settings2, Trash2, Play, X, MessageSquare, Zap, FileText, Send,
  Minimize2, Maximize2,
} from "lucide-react";
import { ChatToolbar } from "./ChatToolbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

type TaskStatus = "todo" | "in_progress" | "blocked" | "done" | "cancelled";
type TaskPriority = "low" | "medium" | "high" | "critical";

interface ContextConfig {
  inherit_preferences: boolean;
  inherit_intents: boolean;
  inherit_history_summary: boolean;
  depth_limit: number;
}

interface WorkbookTask {
  id: string;
  workbook_id: string;
  parent_task_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to: string | null;
  created_by: string;
  source_protocol_id: string | null;
  sort_order: number;
  context_config: ContextConfig;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  children?: WorkbookTask[];
}

interface SubchatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: string;
}

const STATUS_CONFIG: Record<TaskStatus, { icon: React.ReactNode; label: string; color: string }> = {
  todo: { icon: <Circle className="h-3.5 w-3.5" />, label: "To Do", color: "text-muted-foreground" },
  in_progress: { icon: <Clock className="h-3.5 w-3.5" />, label: "In Progress", color: "text-info" },
  blocked: { icon: <AlertTriangle className="h-3.5 w-3.5" />, label: "Blocked", color: "text-destructive" },
  done: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: "Done", color: "text-success" },
  cancelled: { icon: <XCircle className="h-3.5 w-3.5" />, label: "Cancelled", color: "text-muted-foreground" },
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-info/10 text-info",
  high: "bg-warning/10 text-warning",
  critical: "bg-destructive/10 text-destructive",
};

function buildTree(tasks: WorkbookTask[]): WorkbookTask[] {
  const map = new Map<string, WorkbookTask>();
  const roots: WorkbookTask[] = [];
  tasks.forEach(t => map.set(t.id, { ...t, children: [] }));
  tasks.forEach(t => {
    const node = map.get(t.id)!;
    if (t.parent_task_id && map.has(t.parent_task_id)) {
      map.get(t.parent_task_id)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

/** Generate context injection summary based on task's context_config */
function buildContextSummary(task: WorkbookTask): string[] {
  const items: string[] = [];
  const cfg = task.context_config;
  if (cfg.inherit_preferences) items.push("Working preferences inherited");
  if (cfg.inherit_intents) items.push("Parent intents forwarded");
  if (cfg.inherit_history_summary) items.push("Conversation history summary included");
  items.push(`Depth limit: ${cfg.depth_limit} level${cfg.depth_limit > 1 ? "s" : ""}`);
  return items;
}

// ── Build ancestor breadcrumb trail ──
function getAncestorTrail(taskId: string, allTasks: WorkbookTask[]): WorkbookTask[] {
  const map = new Map(allTasks.map(t => [t.id, t]));
  const trail: WorkbookTask[] = [];
  let current = map.get(taskId);
  while (current) {
    trail.unshift(current);
    current = current.parent_task_id ? map.get(current.parent_task_id) : undefined;
  }
  return trail;
}

// ── SUBCHAT COMPONENT ──
function TaskSubchat({ task, workbookId, allTasks, onClose, onMinimize, minimized, onNavigateToTask }: {
  task: WorkbookTask;
  workbookId: string;
  allTasks: WorkbookTask[];
  onClose: () => void;
  onMinimize: () => void;
  minimized: boolean;
  onNavigateToTask: (taskId: string) => void;
}) {
  const [messages, setMessages] = useState<SubchatMessage[]>(() => {
    const contextItems = buildContextSummary(task);
    return [{
      id: "sys-1",
      role: "system" as const,
      text: `🔗 Subchat spawned for task: **${task.title}**\n\nContext inherited:\n${contextItems.map(i => `• ${i}`).join("\n")}${task.description ? `\n\nTask description: ${task.description}` : ""}`,
      timestamp: new Date().toISOString(),
    }];
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: SubchatMessage = { id: `u${Date.now()}`, role: "user", text: input, timestamp: new Date().toISOString() };
    const assistantMsg: SubchatMessage = {
      id: `a${Date.now()}`,
      role: "assistant",
      text: `Working on "${input.slice(0, 50)}${input.length > 50 ? "…" : ""}" within task **${task.title}**.\n\n💡 Context config active: ${task.context_config.inherit_preferences ? "preferences ✓" : ""}${task.context_config.inherit_intents ? " · intents ✓" : ""}${task.context_config.inherit_history_summary ? " · history ✓" : ""}\n\nHow would you like to proceed?`,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput("");
  };

  const breadcrumbs = getAncestorTrail(task.id, allTasks);

  if (minimized) {
    return (
      <div className="flex items-center justify-between rounded-md border border-info/30 bg-info/5 px-3 py-2 ml-10">
        <div className="flex items-center gap-2 text-xs">
          <MessageSquare className="h-3 w-3 text-info" />
          <span className="font-medium text-info">Subchat: {task.title}</span>
          <Badge variant="outline" className="text-[9px]">{messages.filter(m => m.role !== "system").length} msgs</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onMinimize}><Maximize2 className="h-3 w-3" /></Button>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={onClose}><X className="h-3 w-3" /></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-info/30 bg-info/5 overflow-hidden ml-10 mb-2">
      {/* Breadcrumb header */}
      <div className="flex items-center justify-between border-b border-info/20 px-3 py-2 bg-info/10">
        <div className="flex items-center gap-1 min-w-0 overflow-hidden">
          <MessageSquare className="h-3.5 w-3.5 text-info shrink-0" />
          <nav className="flex items-center gap-0.5 text-xs overflow-x-auto no-scrollbar">
            {breadcrumbs.map((ancestor, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <span key={ancestor.id} className="flex items-center gap-0.5 shrink-0">
                  {idx > 0 && <ChevronRight className="h-2.5 w-2.5 text-muted-foreground shrink-0" />}
                  {isLast ? (
                    <span className="font-medium text-info truncate max-w-[160px]">{ancestor.title}</span>
                  ) : (
                    <button
                      onClick={() => onNavigateToTask(ancestor.id)}
                      className="text-muted-foreground hover:text-info hover:underline truncate max-w-[120px] transition-colors"
                      title={`Go to: ${ancestor.title}`}
                    >
                      {ancestor.title}
                    </button>
                  )}
                </span>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onMinimize}><Minimize2 className="h-3 w-3" /></Button>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={onClose}><X className="h-3 w-3" /></Button>
        </div>
      </div>

      {/* Context badges */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-info/10 flex-wrap">
        {task.context_config.inherit_preferences && (
          <Badge variant="outline" className="text-[9px] border-info/30 text-info gap-0.5"><Settings2 className="h-2 w-2" /> Preferences</Badge>
        )}
        {task.context_config.inherit_intents && (
          <Badge variant="outline" className="text-[9px] border-info/30 text-info gap-0.5"><Zap className="h-2 w-2" /> Intents</Badge>
        )}
        {task.context_config.inherit_history_summary && (
          <Badge variant="outline" className="text-[9px] border-info/30 text-info gap-0.5"><FileText className="h-2 w-2" /> History</Badge>
        )}
        <Badge variant="outline" className="text-[9px] gap-0.5">Depth: {task.context_config.depth_limit}</Badge>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="max-h-64 overflow-y-auto p-3 space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className={`${msg.role === "user" ? "ml-auto max-w-[80%]" : msg.role === "system" ? "max-w-full" : "max-w-[80%]"}`}>
            <div className={`rounded-lg px-3 py-2 text-xs whitespace-pre-line ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground"
                : msg.role === "system"
                  ? "bg-info/10 text-info border border-info/20 text-[11px]"
                  : "bg-secondary text-secondary-foreground"
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input — reuses ChatToolbar for task/resource creation */}
      <div className="border-t border-info/20 p-2">
        <ChatToolbar
          workbookId={workbookId}
          messageInput={input}
          setMessageInput={setInput}
          onSend={handleSend}
          compact
          placeholder={`Work on: ${task.title}…`}
        />
      </div>
    </div>
  );
}

export function WorkbookTasks({ workbookId }: { workbookId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [createDialog, setCreateDialog] = useState(false);
  const [parentForNew, setParentForNew] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [contextDialog, setContextDialog] = useState<WorkbookTask | null>(null);

  // Subchat state: map of task ID → { minimized }
  const [activeSubchats, setActiveSubchats] = useState<Map<string, { minimized: boolean }>>(new Map());

  const openSubchat = (taskId: string) => {
    setActiveSubchats(prev => {
      const next = new Map(prev);
      next.set(taskId, { minimized: false });
      return next;
    });
  };

  const closeSubchat = (taskId: string) => {
    setActiveSubchats(prev => {
      const next = new Map(prev);
      next.delete(taskId);
      return next;
    });
  };

  const toggleMinimize = (taskId: string) => {
    setActiveSubchats(prev => {
      const next = new Map(prev);
      const current = next.get(taskId);
      if (current) next.set(taskId, { minimized: !current.minimized });
      return next;
    });
  };

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["workbook-tasks", workbookId],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_tasks")
        .select("*")
        .eq("workbook_id", workbookId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data as unknown as WorkbookTask[]);
    },
  });

  // Realtime subscription for live task updates
  useEffect(() => {
    const channel = supabase
      .channel(`workbook-tasks-${workbookId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "workbook_tasks",
        filter: `workbook_id=eq.${workbookId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["workbook-tasks", workbookId] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [workbookId, queryClient]);

  const createTask = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("workbook_tasks").insert({
        workbook_id: workbookId,
        parent_task_id: parentForNew,
        title: newTitle,
        description: newDesc || null,
        priority: newPriority,
        created_by: user!.id,
        assigned_to: user!.id,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workbook-tasks", workbookId] });
      toast({ title: "Task created" });
      setCreateDialog(false);
      setNewTitle("");
      setNewDesc("");
      setNewPriority("medium");
      setParentForNew(null);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
      const update: any = { status };
      if (status === "done") update.completed_at = new Date().toISOString();
      const { error } = await supabase.from("workbook_tasks").update(update).eq("id", id);
      if (error) throw error;
      return { id, status };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["workbook-tasks", workbookId] });
      // Auto-spawn subchat when task moves to in_progress
      if (result.status === "in_progress") {
        openSubchat(result.id);
        toast({ title: "Task started", description: "Subchat spawned with inherited context" });
      }
      // Close subchat when task is done
      if (result.status === "done") {
        closeSubchat(result.id);
      }
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("workbook_tasks").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["workbook-tasks", workbookId] });
      closeSubchat(id);
      toast({ title: "Task deleted" });
    },
  });

  const updateContextConfig = useMutation({
    mutationFn: async ({ id, config }: { id: string; config: any }) => {
      const { error } = await supabase.from("workbook_tasks").update({ context_config: config } as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workbook-tasks", workbookId] });
      toast({ title: "Context config updated" });
      setContextDialog(null);
    },
  });

  const tree = useMemo(() => buildTree(tasks), [tasks]);
  const toggleExpand = (id: string) => setExpandedTasks(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  // Stats
  const total = tasks.length;
  const done = tasks.filter(t => t.status === "done").length;
  const inProgress = tasks.filter(t => t.status === "in_progress").length;
  const blocked = tasks.filter(t => t.status === "blocked").length;

  const renderTask = (task: WorkbookTask, depth = 0) => {
    const hasChildren = task.children && task.children.length > 0;
    const isExpanded = expandedTasks.has(task.id);
    const sc = STATUS_CONFIG[task.status];
    const subchatState = activeSubchats.get(task.id);
    const hasSubchat = !!subchatState;

    return (
      <div key={task.id}>
        <div
          className={`group flex items-center gap-2 rounded-md px-3 py-2 hover:bg-secondary/30 transition-colors ${hasSubchat ? "bg-info/5" : ""}`}
          style={{ paddingLeft: `${12 + depth * 24}px` }}
        >
          {hasChildren ? (
            <button onClick={() => toggleExpand(task.id)} className="shrink-0">
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            </button>
          ) : (
            <span className="w-3.5" />
          )}

          <button
            onClick={() => {
              const next: TaskStatus = task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "done" : task.status;
              if (next !== task.status) updateStatus.mutate({ id: task.id, status: next });
            }}
            className={`shrink-0 ${sc.color}`}
            title={sc.label}
          >
            {sc.icon}
          </button>

          <span className={`flex-1 text-sm ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
            {task.title}
          </span>

          {hasSubchat && (
            <Badge variant="outline" className="text-[9px] border-info/30 text-info gap-0.5 animate-pulse">
              <MessageSquare className="h-2 w-2" /> subchat
            </Badge>
          )}

          <Badge className={`text-[10px] ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</Badge>

          <div className="hidden group-hover:flex items-center gap-0.5">
            {task.status === "in_progress" && !hasSubchat && (
              <Button variant="ghost" size="icon" className="h-6 w-6 text-info" onClick={() => openSubchat(task.id)} title="Open subchat">
                <MessageSquare className="h-3 w-3" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setParentForNew(task.id); setCreateDialog(true); }} title="Add subtask">
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setContextDialog(task)} title="Context config">
              <Settings2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteTask.mutate(task.id)} title="Delete">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Subchat panel */}
        {hasSubchat && (
          <TaskSubchat
            task={task}
            workbookId={workbookId}
            allTasks={tasks}
            onClose={() => closeSubchat(task.id)}
            onMinimize={() => toggleMinimize(task.id)}
            minimized={subchatState!.minimized}
            onNavigateToTask={(targetId) => {
              // Expand ancestors and scroll to the target task
              setExpandedTasks(prev => {
                const next = new Set(prev);
                const trail = getAncestorTrail(targetId, tasks);
                trail.forEach(t => next.add(t.id));
                return next;
              });
              // Open subchat on the target if it's in_progress
              const target = tasks.find(t => t.id === targetId);
              if (target?.status === "in_progress") {
                openSubchat(targetId);
              }
            }}
          />
        )}

        {hasChildren && isExpanded && task.children!.map(child => renderTask(child, depth + 1))}
      </div>
    );
  };

  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Loading tasks…</div>;

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>{total} tasks</span>
        <span className="text-success">✓ {done} done</span>
        <span className="text-info">⏳ {inProgress} active</span>
        {blocked > 0 && <span className="text-destructive">⚠ {blocked} blocked</span>}
        {activeSubchats.size > 0 && (
          <span className="text-info flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {activeSubchats.size} subchat{activeSubchats.size > 1 ? "s" : ""}</span>
        )}
        {total > 0 && (
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-success" style={{ width: `${(done / total) * 100}%` }} />
            </div>
            <span>{Math.round((done / total) * 100)}%</span>
          </div>
        )}
      </div>

      {/* Task list */}
      <div className="rounded-lg border border-border/50 bg-card divide-y divide-border/30">
        {tree.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No tasks yet. Create one to start tracking work in this workbook.
          </div>
        ) : (
          tree.map(task => renderTask(task))
        )}
      </div>

      {/* Add task button */}
      <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => { setParentForNew(null); setCreateDialog(true); }}>
        <Plus className="h-3.5 w-3.5" /> Add Task
      </Button>

      {/* Create Task Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">{parentForNew ? "Add Subtask" : "New Task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Task title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <Textarea placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2} />
            <Select value={newPriority} onValueChange={(v) => setNewPriority(v as TaskPriority)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={() => createTask.mutate()} disabled={!newTitle.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Context Config Dialog */}
      <Dialog open={!!contextDialog} onOpenChange={() => setContextDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Context Inheritance</DialogTitle>
          </DialogHeader>
          {contextDialog && (
            <ContextConfigEditor
              config={contextDialog.context_config}
              onSave={(config) => updateContextConfig.mutate({ id: contextDialog.id, config })}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ContextConfigEditor({ config, onSave }: {
  config: ContextConfig;
  onSave: (c: ContextConfig) => void;
}) {
  const [local, setLocal] = useState({ ...config });

  return (
    <div className="space-y-4">
      {[
        { key: "inherit_preferences" as const, label: "Inherit Preferences", desc: "Apply parent workbook preferences to subtask context" },
        { key: "inherit_intents" as const, label: "Inherit Intents", desc: "Pass detected intents from parent chat" },
        { key: "inherit_history_summary" as const, label: "Inherit History Summary", desc: "Include conversation summary from parent" },
      ].map(item => (
        <div key={item.key} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{item.label}</p>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
          <Switch checked={local[item.key]} onCheckedChange={(v) => setLocal(prev => ({ ...prev, [item.key]: v }))} />
        </div>
      ))}
      <div>
        <p className="text-sm font-medium mb-1">Depth Limit</p>
        <Select value={String(local.depth_limit)} onValueChange={(v) => setLocal(prev => ({ ...prev, depth_limit: parseInt(v) }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 5, 10].map(n => <SelectItem key={n} value={String(n)}>{n} level{n > 1 ? "s" : ""}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={() => onSave(local)} className="w-full">Save</Button>
    </div>
  );
}

// Inline compact indicator for use in chat/protocol views
export function TaskInlineIndicator({ workbookId }: { workbookId: string }) {
  const { user } = useAuth();
  const { data: tasks = [] } = useQuery({
    queryKey: ["workbook-tasks", workbookId],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_tasks")
        .select("id, status")
        .eq("workbook_id", workbookId);
      if (error) throw error;
      return data;
    },
  });

  if (tasks.length === 0) return null;
  const done = tasks.filter(t => t.status === "done").length;
  const total = tasks.length;

  return (
    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
      <CheckCircle2 className="h-3 w-3 text-success" />
      <span>{done}/{total} tasks</span>
    </div>
  );
}
