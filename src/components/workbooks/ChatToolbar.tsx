import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  ListTodo, Paperclip, Plus, X, Send, FileText, Link2,
  Type as TypeIcon, ExternalLink,
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
}

export function ChatToolbar({
  workbookId,
  messageInput,
  setMessageInput,
  onSend,
  compact = false,
  placeholder = "Type a message or /task <title>…",
  onTaskCreated,
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
  const [pendingAttachment, setPendingAttachment] = useState<WorkbookResource | null>(null);

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

  // Handle send with /task parsing
  const handleSend = () => {
    if (!messageInput.trim() && !pendingAttachment) return;

    // /task slash command
    if (messageInput.trim().startsWith("/task ")) {
      const title = messageInput.trim().slice(6).trim();
      if (title) {
        createTask.mutate(title);
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

        {/* Create Resource button */}
        <Button
          variant="ghost"
          size="icon"
          className={`${btnSize} shrink-0`}
          title="Add to repository"
          onClick={() => setResourceDialogOpen(true)}
        >
          <Plus className={iconSize} />
        </Button>

        {/* Attach existing resource */}
        <Popover open={attachPopoverOpen} onOpenChange={setAttachPopoverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className={`${btnSize} shrink-0`} title="Attach from repository">
              <Paperclip className={iconSize} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="start">
            <p className="text-xs font-medium text-muted-foreground px-2 py-1">Attach from repository</p>
            {resources.length === 0 ? (
              <p className="text-xs text-muted-foreground px-2 py-3 text-center">Repository is empty.</p>
            ) : (
              <ScrollArea className="max-h-48">
                <div className="space-y-0.5">
                  {resources.map(r => (
                    <button
                      key={r.id}
                      className="flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-xs text-left hover:bg-primary/5 transition-colors"
                      onClick={() => { setPendingAttachment(r); setAttachPopoverOpen(false); }}
                    >
                      {r.resource_type === "link" ? <Link2 className="h-3 w-3 text-blue-400 shrink-0" /> : r.resource_type === "file" ? <FileText className="h-3 w-3 text-amber-400 shrink-0" /> : <TypeIcon className="h-3 w-3 text-primary shrink-0" />}
                      <span className="truncate">{r.title}</span>
                      <Badge variant="outline" className="text-[9px] ml-auto shrink-0">{r.resource_type}</Badge>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
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
        <p className="text-[10px] text-muted-foreground mt-1 ml-[8.5rem]">
          <ListTodo className="h-2.5 w-2.5 inline" /> tasks · <Plus className="h-2.5 w-2.5 inline" /> repository · <Paperclip className="h-2.5 w-2.5 inline" /> attach · <code className="bg-muted px-1 rounded">/task</code> slash command
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

      {/* Create Resource dialog */}
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
    </>
  );
}

export { type WorkbookResource };
