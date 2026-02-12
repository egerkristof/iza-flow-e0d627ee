import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus, ChevronRight, ChevronDown, Circle, CheckCircle2, Clock, AlertTriangle,
  XCircle, Settings2, Trash2, Play, X, MessageSquare, Zap, FileText, Send,
  Minimize2, Maximize2, Search, Filter, Pencil,
} from "lucide-react";
import { ChatToolbar } from "./ChatToolbar";
import { MandateContextBanner } from "./MandateContextBanner";
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

/** Check if a task or any of its descendants match the search */
function taskMatchesSearch(task: WorkbookTask, query: string): boolean {
  const q = query.toLowerCase();
  if (task.title.toLowerCase().includes(q)) return true;
  if (task.description?.toLowerCase().includes(q)) return true;
  if (task.children?.some(c => taskMatchesSearch(c, q))) return true;
  return false;
}

/** Filter tree to only tasks matching search + status/priority filters */
function filterTree(
  tree: WorkbookTask[],
  search: string,
  statusFilter: TaskStatus | "all",
  priorityFilter: TaskPriority | "all",
): WorkbookTask[] {
  return tree.reduce<WorkbookTask[]>((acc, task) => {
    const filteredChildren = filterTree(task.children || [], search, statusFilter, priorityFilter);
    const matchesSearch = !search || task.title.toLowerCase().includes(search.toLowerCase()) || task.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    if ((matchesSearch && matchesStatus && matchesPriority) || filteredChildren.length > 0) {
      acc.push({ ...task, children: filteredChildren });
    }
    return acc;
  }, []);
}

// ── SUBCHAT COMPONENT ──
function TaskSubchat({ task, workbookId, workbookTitle, allTasks, onClose, onMinimize, minimized, onNavigateToTask }: {
  task: WorkbookTask;
  workbookId: string;
  workbookTitle?: string;
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
            {workbookTitle && (
              <span className="flex items-center gap-0.5 shrink-0">
                <span className="text-muted-foreground truncate max-w-[120px]">{workbookTitle}</span>
                <ChevronRight className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
              </span>
            )}
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

      {/* Active mandates in context */}
      <div className="px-2 py-1.5 border-b border-info/10">
        <MandateContextBanner workbookId={workbookId} compact />
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

      {/* Input */}
      <div className="border-t border-info/20 p-2">
        <ChatToolbar
          workbookId={workbookId}
          messageInput={input}
          setMessageInput={setInput}
          onSend={handleSend}
          compact
          placeholder={`Work on: ${task.title}…`}
          parentTaskId={task.id}
        />
      </div>
    </div>
  );
}

// ── TASK EDIT MODAL ──
function TaskEditModal({ task, open, onOpenChange, onSave }: {
  task: WorkbookTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: { title: string; description: string | null; status: TaskStatus; priority: TaskPriority; due_date: string | null }) => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState(task.due_date ? task.due_date.slice(0, 10) : "");

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.due_date ? task.due_date.slice(0, 10) : "");
  }, [task]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Pencil className="h-4 w-4" /> Edit Task
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
              <Select value={status} onValueChange={v => setStatus(v as TaskStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Priority</label>
              <Select value={priority} onValueChange={v => setPriority(v as TaskPriority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Due Date</label>
            <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              onSave({
                title,
                description: description || null,
                status,
                priority,
                due_date: dueDate ? new Date(dueDate).toISOString() : null,
              });
              onOpenChange(false);
            }}
            disabled={!title.trim()}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WorkbookTasks({ workbookId, workbookTitle, focusTaskId, onFocusTaskHandled }: { workbookId: string; workbookTitle?: string; focusTaskId?: string | null; onFocusTaskHandled?: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [highlightedTaskId, setHighlightedTaskId] = useState<string | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [parentForNew, setParentForNew] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [contextDialog, setContextDialog] = useState<WorkbookTask | null>(null);
  const [editTask, setEditTask] = useState<WorkbookTask | null>(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Subchat state
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

  // Auto-focus a task when navigated from graph
  useEffect(() => {
    if (focusTaskId && tasks.length > 0) {
      const parentChain: string[] = [];
      const findParents = (id: string) => {
        const t = tasks.find(tk => tk.id === id);
        if (t?.parent_task_id) {
          parentChain.push(t.parent_task_id);
          findParents(t.parent_task_id);
        }
      };
      findParents(focusTaskId);
      
      setExpandedTasks(prev => {
        const next = new Set(prev);
        parentChain.forEach(id => next.add(id));
        next.add(focusTaskId);
        return next;
      });
      openSubchat(focusTaskId);
      setHighlightedTaskId(focusTaskId);
      
      const timer = setTimeout(() => setHighlightedTaskId(null), 2500);
      onFocusTaskHandled?.();
      return () => clearTimeout(timer);
    }
  }, [focusTaskId, tasks]);

  // Realtime subscription
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

  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      if (updates.status === "done") updates.completed_at = new Date().toISOString();
      const { error } = await supabase.from("workbook_tasks").update(updates).eq("id", id);
      if (error) throw error;
      return { id, status: updates.status };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["workbook-tasks", workbookId] });
      toast({ title: "Task updated" });
      if (result.status === "in_progress") {
        openSubchat(result.id);
      }
      if (result.status === "done") {
        closeSubchat(result.id);
      }
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
      if (result.status === "in_progress") {
        openSubchat(result.id);
        toast({ title: "Task started", description: "Subchat spawned with inherited context" });
      }
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
  const filteredTree = useMemo(
    () => filterTree(tree, searchQuery, statusFilter, priorityFilter),
    [tree, searchQuery, statusFilter, priorityFilter]
  );

  const toggleExpand = (id: string) => setExpandedTasks(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const expandAll = () => {
    const allIds = new Set<string>();
    const collect = (t: WorkbookTask) => { allIds.add(t.id); t.children?.forEach(collect); };
    filteredTree.forEach(collect);
    setExpandedTasks(allIds);
  };

  const collapseAll = () => setExpandedTasks(new Set());

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
    const isHighlighted = highlightedTaskId === task.id;

    return (
      <div key={task.id}>
        <div
          ref={el => {
            if (isHighlighted && el) {
              setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
            }
          }}
          className={`group flex items-center gap-2 rounded-md px-3 py-2 transition-all cursor-pointer ${
            isHighlighted
              ? "bg-primary/15 ring-2 ring-primary/40 animate-pulse"
              : hasSubchat
                ? "bg-info/5 hover:bg-secondary/30"
                : "hover:bg-secondary/30"
          }`}
          style={{ paddingLeft: `${12 + depth * 24}px` }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditTask(task);
          }}
        >
          {hasChildren ? (
            <button onClick={(e) => { e.stopPropagation(); toggleExpand(task.id); }} className="shrink-0">
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            </button>
          ) : (
            <span className="w-3.5" />
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              const next: TaskStatus = task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "done" : task.status;
              if (next !== task.status) updateStatus.mutate({ id: task.id, status: next });
            }}
            className={`shrink-0 ${sc.color}`}
            title={sc.label}
          >
            {sc.icon}
          </button>

          <span className={`flex-1 text-sm truncate ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
            {task.title}
          </span>

          {depth > 0 && (
            <Badge variant="outline" className="text-[8px] text-muted-foreground/60 shrink-0">L{depth}</Badge>
          )}

          {hasSubchat && (
            <Badge variant="outline" className="text-[9px] border-info/30 text-info gap-0.5 animate-pulse">
              <MessageSquare className="h-2 w-2" /> subchat
            </Badge>
          )}

          <Badge className={`text-[10px] shrink-0 ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</Badge>

          <div className="hidden group-hover:flex items-center gap-0.5">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setEditTask(task); }} title="Edit">
              <Pencil className="h-3 w-3" />
            </Button>
            {task.status === "in_progress" && !hasSubchat && (
              <Button variant="ghost" size="icon" className="h-6 w-6 text-info" onClick={(e) => { e.stopPropagation(); openSubchat(task.id); }} title="Open subchat">
                <MessageSquare className="h-3 w-3" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setParentForNew(task.id); setCreateDialog(true); }} title="Add subtask">
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); setContextDialog(task); }} title="Context config">
              <Settings2 className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={(e) => { e.stopPropagation(); deleteTask.mutate(task.id); }} title="Delete">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Subchat panel */}
        {hasSubchat && (
          <TaskSubchat
            task={task}
            workbookId={workbookId}
            workbookTitle={workbookTitle}
            allTasks={tasks}
            onClose={() => closeSubchat(task.id)}
            onMinimize={() => toggleMinimize(task.id)}
            minimized={subchatState!.minimized}
            onNavigateToTask={(targetId) => {
              setExpandedTasks(prev => {
                const next = new Set(prev);
                const trail = getAncestorTrail(targetId, tasks);
                trail.forEach(t => next.add(t.id));
                return next;
              });
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
      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search tasks…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-3 w-3" />
            {(statusFilter !== "all" || priorityFilter !== "all") && (
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            )}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 text-[10px]" onClick={expandAll}>Expand All</Button>
          <Button variant="ghost" size="sm" className="h-8 text-[10px]" onClick={collapseAll}>Collapse</Button>
        </div>

        {showFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
              <SelectTrigger className="h-7 w-32 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={v => setPriorityFilter(v as any)}>
              <SelectTrigger className="h-7 w-28 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            {(statusFilter !== "all" || priorityFilter !== "all") && (
              <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => { setStatusFilter("all"); setPriorityFilter("all"); }}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
        <span>{total} tasks</span>
        <span className="text-success">✓ {done} done</span>
        <span className="text-info">⏳ {inProgress} active</span>
        {blocked > 0 && <span className="text-destructive">⚠ {blocked} blocked</span>}
        {activeSubchats.size > 0 && (
          <span className="text-info flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {activeSubchats.size} subchat{activeSubchats.size > 1 ? "s" : ""}</span>
        )}
        {searchQuery && <span className="text-primary">Showing {filteredTree.length} matches</span>}
        {total > 0 && (
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden">
              <div className="h-full rounded-full bg-success" style={{ width: `${(done / total) * 100}%` }} />
            </div>
            <span>{Math.round((done / total) * 100)}%</span>
          </div>
        )}
      </div>

      {/* Active Mandates */}
      <MandateContextBanner workbookId={workbookId} />

      {/* Task list */}
      <ScrollArea className="max-h-[600px]">
        <div className="rounded-lg border border-border/50 bg-card divide-y divide-border/30">
          {filteredTree.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                ? "No tasks match your filters."
                : "No tasks yet. Create one to start tracking work in this workbook."}
            </div>
          ) : (
            filteredTree.map(task => renderTask(task))
          )}
        </div>
      </ScrollArea>

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

      {/* Edit Task Dialog */}
      {editTask && (
        <TaskEditModal
          task={editTask}
          open={!!editTask}
          onOpenChange={(open) => { if (!open) setEditTask(null); }}
          onSave={(updates) => {
            updateTask.mutate({ id: editTask.id, updates });
            setEditTask(null);
          }}
        />
      )}

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
