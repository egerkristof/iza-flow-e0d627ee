import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  ListTodo, Paperclip, Plus, X, Send, FileText, Link2, Search,
  Type as TypeIcon, ExternalLink, Lightbulb, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useWorkbookResources, type WorkbookResource } from "./WorkbookResources";

interface ChatToolbarProps {
  workbookId: string;
  messageInput: string;
  setMessageInput: (v: string) => void;
  onSend: (extra?: { attachment?: WorkbookResource }) => void;
  /** Compact mode for subchat (smaller buttons) */
  compact?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** If provided, the /task slash command is parsed automatically */
  onTaskCreated?: () => void;
  /** Chat ID for capture source tracking */
  chatId?: string;
  /** Parent task ID — subtasks created here will be nested under this task */
  parentTaskId?: string;
}

interface ClassificationResult {
  category: string;
  title: string;
  content: string;
  principles: string[];
  related_item_ids: string[];
  is_duplicate: boolean;
  duplicate_of_id?: string;
  confidence: number;
}

export function ChatToolbar({
  workbookId,
  messageInput,
  setMessageInput,
  onSend,
  compact = false,
  placeholder = "Type a message, /task <title>, or /capture <text>…",
  onTaskCreated,
  chatId,
  parentTaskId,
}: ChatToolbarProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Task dialog
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");

  // Resource creation dialog
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false);
  const [newResType, setNewResType] = useState<"text" | "link">("text");
  const [newResTitle, setNewResTitle] = useState("");
  const [newResContent, setNewResContent] = useState("");

  // Resource attachment popover
  const [attachPopoverOpen, setAttachPopoverOpen] = useState(false);
  const [attachSearch, setAttachSearch] = useState("");
  const [attachTypeFilter, setAttachTypeFilter] = useState<"all" | "text" | "link" | "file">("all");
  const [pendingAttachment, setPendingAttachment] = useState<WorkbookResource | null>(null);

  // Capture dialog
  const [captureDialogOpen, setCaptureDialogOpen] = useState(false);
  const [captureText, setCaptureText] = useState("");
  const [classifying, setClassifying] = useState(false);
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [captureTitle, setCaptureTitle] = useState("");
  const [captureContent, setCaptureContent] = useState("");
  const [captureCategory, setCaptureCategory] = useState("RESEARCH");

  const { data: resources = [] } = useWorkbookResources(workbookId);

  // ── Create Task ──
  const createTask = useMutation({
    mutationFn: async (title: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("workbook_tasks").insert({
        workbook_id: workbookId,
        title,
        created_by: user.id,
        assigned_to: user.id,
        ...(parentTaskId ? { parent_task_id: parentTaskId } : {}),
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workbook-tasks", workbookId] });
      toast({ title: "Task created" });
      setTaskDialogOpen(false);
      setTaskTitle("");
      onTaskCreated?.();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // ── Create Resource ──
  const createResource = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("workbook_resources").insert({
        workbook_id: workbookId,
        created_by: user.id,
        title: newResTitle,
        resource_type: newResType,
        content: newResContent || null,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workbook-resources", workbookId] });
      toast({ title: "Added to repository" });
      setResourceDialogOpen(false);
      setNewResTitle("");
      setNewResContent("");
      setNewResType("text");
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // ── Classify Finding via AI ──
  const classifyFinding = async (text: string) => {
    setClassifying(true);
    setClassification(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("Not authenticated");

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/classify-finding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message_text: text,
            workbook_id: workbookId,
            chat_id: chatId,
          }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Classification failed" }));
        throw new Error(err.error || "Classification failed");
      }

      const { classification: result } = await resp.json();
      setClassification(result);
      setCaptureTitle(result.title);
      setCaptureContent(result.content);
      setCaptureCategory(result.category);
    } catch (e: any) {
      toast({ title: "Classification failed", description: e.message, variant: "destructive" });
      // Fall back to manual entry
      setCaptureTitle("");
      setCaptureContent(text);
      setCaptureCategory("RESEARCH");
    } finally {
      setClassifying(false);
    }
  };

  // ── Save Capture ──
  const saveCapture = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("context_items").insert({
        owner_id: user.id,
        title: captureTitle,
        content_full: captureContent,
        category: captureCategory,
        capture_status: "draft",
        source_workbook_id: workbookId,
        source_chat_id: chatId || null,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["captures-inbox"] });
      queryClient.invalidateQueries({ queryKey: ["captures-inbox-count"] });
      toast({ title: "Finding captured!", description: "Review it in My Knowledge → Captures." });
      resetCaptureDialog();
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const resetCaptureDialog = () => {
    setCaptureDialogOpen(false);
    setCaptureText("");
    setClassification(null);
    setCaptureTitle("");
    setCaptureContent("");
    setCaptureCategory("RESEARCH");
  };

  const openCaptureDialog = (text?: string) => {
    const initialText = text || "";
    setCaptureText(initialText);
    setCaptureDialogOpen(true);
    if (initialText.trim()) {
      classifyFinding(initialText);
    }
  };

  // Handle send with /task and /capture parsing
  const handleSend = () => {
    if (!messageInput.trim() && !pendingAttachment) return;

    const trimmed = messageInput.trim();

    // /task slash command
    if (trimmed.startsWith("/task ")) {
      const title = trimmed.slice(6).trim();
      if (title) {
        createTask.mutate(title);
        setMessageInput("");
        return;
      }
    }

    // /capture slash command
    if (trimmed.startsWith("/capture ")) {
      const text = trimmed.slice(9).trim();
      if (text) {
        openCaptureDialog(text);
        setMessageInput("");
        return;
      }
    }

    onSend({ attachment: pendingAttachment ?? undefined });
    setPendingAttachment(null);
  };

  const btnSize = compact ? "h-8 w-8" : "h-10 w-10";
  const iconSize = compact ? "h-3 w-3" : "h-4 w-4";
  const inputHeight = compact ? "h-8 text-xs" : "";

  return (
    <>
      {/* Pending attachment banner */}
      {pendingAttachment && (
        <div className="flex items-center gap-2 mb-2 rounded-md bg-secondary/50 px-3 py-1.5 text-xs">
          <Paperclip className="h-3 w-3 text-primary shrink-0" />
          <span className="font-medium truncate">{pendingAttachment.title}</span>
          <Badge variant="outline" className="text-[9px] shrink-0">{pendingAttachment.resource_type}</Badge>
          <button onClick={() => setPendingAttachment(null)} className="ml-auto shrink-0">
            <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      )}

      <div className="flex gap-2">
        {/* Create Task button */}
        <Button
          variant="ghost"
          size="icon"
          className={`${btnSize} shrink-0`}
          title="Create task"
          onClick={() => setTaskDialogOpen(true)}
        >
          <ListTodo className={iconSize} />
        </Button>

        {/* Capture Finding button */}
        <Button
          variant="ghost"
          size="icon"
          className={`${btnSize} shrink-0`}
          title="Capture finding"
          onClick={() => openCaptureDialog()}
        >
          <Lightbulb className={iconSize} />
        </Button>

        {/* Add to Repository button */}
        <Button
          variant="ghost"
          size="icon"
          className={`${btnSize} shrink-0`}
          title="Add to repository"
          onClick={() => setResourceDialogOpen(true)}
        >
          <Plus className={iconSize} />
        </Button>

        {/* Attach from repository */}
        <Popover open={attachPopoverOpen} onOpenChange={setAttachPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className={`${btnSize} shrink-0`} title="Attach from repository">
              <Paperclip className={iconSize} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2" align="start">
            <p className="text-xs font-medium text-muted-foreground px-2 py-1">Attach from repository</p>
            {resources.length > 0 && (
              <div className="px-1 pb-1.5 space-y-1.5">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Search items…"
                    value={attachSearch}
                    onChange={e => setAttachSearch(e.target.value)}
                    className="h-7 pl-7 text-xs bg-secondary/50"
                  />
                </div>
                <div className="flex gap-1">
                  {(["all", "text", "link", "file"] as const).map(t => (
                    <Badge
                      key={t}
                      variant={attachTypeFilter === t ? "default" : "outline"}
                      className="text-[10px] cursor-pointer hover:bg-primary/10"
                      onClick={() => setAttachTypeFilter(t)}
                    >
                      {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {resources.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2 py-3 text-center">Repository is empty.</p>
            ) : (() => {
              const filtered = resources.filter(r => {
                const matchesType = attachTypeFilter === "all" || r.resource_type === attachTypeFilter;
                const matchesSearch = !attachSearch || r.title.toLowerCase().includes(attachSearch.toLowerCase());
                return matchesType && matchesSearch;
              });
              return filtered.length === 0 ? (
                <p className="text-xs text-muted-foreground px-2 py-3 text-center">No matching items.</p>
              ) : (
                <ScrollArea className="max-h-48">
                  <div className="space-y-0.5">
                    {filtered.map(r => (
                      <button
                        key={r.id}
                        className="flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-xs text-left hover:bg-primary/5 transition-colors"
                        onClick={() => { setPendingAttachment(r); setAttachPopoverOpen(false); setAttachSearch(""); setAttachTypeFilter("all"); }}
                      >
                        {r.resource_type === "link" ? <Link2 className="h-3 w-3 text-primary shrink-0" /> : r.resource_type === "file" ? <FileText className="h-3 w-3 text-primary shrink-0" /> : <TypeIcon className="h-3 w-3 text-primary shrink-0" />}
                        <span className="truncate">{r.title}</span>
                        <Badge variant="outline" className="text-[9px] ml-auto shrink-0">{r.resource_type}</Badge>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              );
            })()}
          </PopoverContent>
        </Popover>

        {/* Message input */}
        <Input
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder={placeholder}
          className={`flex-1 bg-secondary/50 ${inputHeight}`}
        />
        <Button onClick={handleSend} size="icon" className={compact ? "h-8 w-8" : ""} disabled={!messageInput.trim() && !pendingAttachment}>
          <Send className={iconSize} />
        </Button>
      </div>

      {!compact && (
        <p className="text-[10px] text-muted-foreground mt-1 ml-[10.5rem]">
          <ListTodo className="h-2.5 w-2.5 inline" /> tasks · <Lightbulb className="h-2.5 w-2.5 inline" /> capture · <Plus className="h-2.5 w-2.5 inline" /> repository · <Paperclip className="h-2.5 w-2.5 inline" /> attach · <code className="bg-muted px-1 rounded">/task</code> · <code className="bg-muted px-1 rounded">/capture</code>
        </p>
      )}

      {/* Create Task dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="text-base">Create Task</DialogTitle></DialogHeader>
          <Input
            placeholder="Task title"
            value={taskTitle}
            onChange={e => setTaskTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && taskTitle.trim() && createTask.mutate(taskTitle)}
          />
          <DialogFooter>
            <Button onClick={() => createTask.mutate(taskTitle)} disabled={!taskTitle.trim()}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Repository dialog */}
      <Dialog open={resourceDialogOpen} onOpenChange={setResourceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-base">Add to Repository</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Select value={newResType} onValueChange={(v) => setNewResType(v as "text" | "link")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="link">Link / URL</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Item title" value={newResTitle} onChange={e => setNewResTitle(e.target.value)} />
            {newResType === "link" ? (
              <Input placeholder="https://..." value={newResContent} onChange={e => setNewResContent(e.target.value)} />
            ) : (
              <Textarea placeholder="Content…" value={newResContent} onChange={e => setNewResContent(e.target.value)} rows={4} />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => createResource.mutate()} disabled={!newResTitle.trim()}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Capture Finding dialog */}
      <Dialog open={captureDialogOpen} onOpenChange={(open) => { if (!open) resetCaptureDialog(); else setCaptureDialogOpen(true); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" /> Capture Finding
            </DialogTitle>
          </DialogHeader>

          {/* Step 1: Input text if not pre-filled */}
          {!classification && !classifying && !captureTitle && (
            <div className="space-y-3">
              <Textarea
                placeholder="Paste or type the insight, directive, or knowledge you want to capture…"
                value={captureText}
                onChange={e => setCaptureText(e.target.value)}
                rows={4}
              />
              <Button
                onClick={() => classifyFinding(captureText)}
                disabled={!captureText.trim()}
                className="gap-1.5 w-full"
              >
                <Lightbulb className="h-3.5 w-3.5" /> Classify with AI
              </Button>
            </div>
          )}

          {/* Loading state */}
          {classifying && (
            <div className="flex flex-col items-center py-8 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Analyzing and classifying…</p>
            </div>
          )}

          {/* Step 2: Review classification */}
          {!classifying && (captureTitle || classification) && (
            <div className="space-y-3">
              {classification && (
                <div className="rounded-md bg-muted/50 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      AI Confidence: {Math.round((classification.confidence || 0) * 100)}%
                    </Badge>
                    {classification.is_duplicate && (
                      <Badge variant="destructive" className="text-[10px]">Possible duplicate</Badge>
                    )}
                  </div>
                  {classification.principles.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium text-muted-foreground mb-1">Extracted principles:</p>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {classification.principles.map((p, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-primary mt-0.5">•</span> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {classification.related_item_ids.length > 0 && (
                    <p className="text-[10px] text-muted-foreground">
                      {classification.related_item_ids.length} related item{classification.related_item_ids.length !== 1 ? "s" : ""} found in your knowledge
                    </p>
                  )}
                </div>
              )}

              <Input
                placeholder="Title"
                value={captureTitle}
                onChange={e => setCaptureTitle(e.target.value)}
              />
              <Select value={captureCategory} onValueChange={setCaptureCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["DIRECTIVE", "KNOWLEDGE", "PROCEDURE", "PLAYBOOK", "PREFERENCE", "RESEARCH", "PRINCIPLE"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Rewritten knowledge statement…"
                value={captureContent}
                onChange={e => setCaptureContent(e.target.value)}
                rows={4}
              />
            </div>
          )}

          {!classifying && (captureTitle || classification) && (
            <DialogFooter>
              <Button variant="outline" onClick={resetCaptureDialog}>Cancel</Button>
              <Button
                onClick={() => saveCapture.mutate()}
                disabled={!captureTitle.trim() || !captureContent.trim()}
                className="gap-1.5"
              >
                <Lightbulb className="h-3.5 w-3.5" /> Capture as Draft
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export { type WorkbookResource };
