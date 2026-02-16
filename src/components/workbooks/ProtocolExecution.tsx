import { useState, useMemo, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { type WorkbookResource } from "./WorkbookResources";
import { ResourceAttachmentCard } from "./ResourceAttachmentCard";
import { useToast } from "@/hooks/use-toast";
import {
  Play, ChevronRight, ChevronLeft, Lock, Unlock, Check, Shield,
  AlertTriangle, Ban, Info, Loader2, Package, FileText, MessageSquare,
  Zap, GitBranch, Clock, CheckCircle2, Circle, PauseCircle, XCircle,
  Sparkles, Flag, BookOpen, Search, Copy, Save, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CategoryBadge } from "@/components/knowledge/CategoryBadge";
import { ChatToolbar } from "@/components/workbooks/ChatToolbar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ── Types ──────────────────────────────────────────────────────────
interface Protocol {
  id: string;
  workbook_id: string;
  bundle_id: string;
  source_playbook_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

interface ProtocolStep {
  id: string;
  protocol_id: string;
  source_item_id: string | null;
  title: string;
  description: string | null;
  step_type: string;
  step_order: number;
  is_required: boolean;
  gate_enforcement: string | null;
  agent_prompt: string | null;
  estimated_minutes: number | null;
  research_template_id: string | null;
  output_type: string | null;
  output_description: string | null;
}

interface ProtocolContextItem {
  id: string;
  protocol_id: string;
  context_item_id: string;
  injection_scope: string;
  context_items?: {
    title: string;
    category: string;
    content_full: string;
  };
}

interface ProtocolExecution {
  id: string;
  protocol_id: string;
  workbook_id: string;
  executed_by: string;
  status: string;
  current_step_id: string | null;
  started_at: string | null;
  completed_at: string | null;
  drift_score: number;
  compliance_score: number;
  notes: string | null;
  created_at: string;
}

interface StepExecution {
  id: string;
  execution_id: string;
  step_id: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;
  gate_acknowledged: boolean;
  output_notes: string | null;
}

interface CaptureItem {
  id: string;
  execution_id: string;
  step_id: string | null;
  capture_type: string;
  title: string;
  content: string;
  severity: string;
  resolution_status: string;
  created_at: string;
}

// ── Hooks ──────────────────────────────────────────────────────────
export function useWorkbookProtocols(workbookId: string) {
  return useQuery({
    queryKey: ["workbook-protocols", workbookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_protocols")
        .select("*")
        .eq("workbook_id", workbookId)
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as Protocol[];
    },
  });
}

function useProtocolSteps(protocolId: string | null) {
  return useQuery({
    queryKey: ["protocol-steps", protocolId],
    enabled: !!protocolId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("protocol_steps")
        .select("*")
        .eq("protocol_id", protocolId!)
        .order("step_order");
      if (error) throw error;
      return (data ?? []) as unknown as ProtocolStep[];
    },
  });
}

function useProtocolContext(protocolId: string | null) {
  return useQuery({
    queryKey: ["protocol-context", protocolId],
    enabled: !!protocolId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("protocol_context_items")
        .select("*, context_items(title, category, content_full)")
        .eq("protocol_id", protocolId!);
      if (error) throw error;
      return (data ?? []) as unknown as ProtocolContextItem[];
    },
  });
}

function useActiveExecution(protocolId: string | null, userId: string | undefined, resumeExecutionId?: string | null) {
  return useQuery({
    queryKey: ["protocol-execution", protocolId, userId, resumeExecutionId],
    enabled: !!protocolId && !!userId,
    queryFn: async () => {
      // If a specific execution ID is provided, fetch that one directly
      if (resumeExecutionId) {
        const { data, error } = await supabase
          .from("protocol_executions")
          .select("*")
          .eq("id", resumeExecutionId)
          .maybeSingle();
        if (error) throw error;
        return data as unknown as ProtocolExecution | null;
      }
      const { data, error } = await supabase
        .from("protocol_executions")
        .select("*")
        .eq("protocol_id", protocolId!)
        .eq("executed_by", userId!)
        .in("status", ["not_started", "in_progress", "paused"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as ProtocolExecution | null;
    },
  });
}

function useStepExecutions(executionId: string | null) {
  return useQuery({
    queryKey: ["step-executions", executionId],
    enabled: !!executionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("step_executions")
        .select("*")
        .eq("execution_id", executionId!);
      if (error) throw error;
      return (data ?? []) as unknown as StepExecution[];
    },
  });
}

function useExecutionCaptures(executionId: string | null) {
  return useQuery({
    queryKey: ["execution-captures", executionId],
    enabled: !!executionId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("execution_captures")
        .select("*")
        .eq("execution_id", executionId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as CaptureItem[];
    },
  });
}

// ── Step Type Config ───────────────────────────────────────────────
const stepTypeConfig: Record<string, { icon: typeof FileText; color: string; label: string }> = {
  action: { icon: Play, color: "text-primary", label: "Action" },
  gate: { icon: Shield, color: "text-destructive", label: "Compliance Gate" },
  checkpoint: { icon: Flag, color: "text-warning", label: "Checkpoint" },
  review: { icon: BookOpen, color: "text-info", label: "Review" },
  research: { icon: Search, color: "text-violet-500", label: "Research" },
};

const stepExecStatusConfig: Record<string, { icon: typeof Circle; color: string; label: string }> = {
  pending: { icon: Circle, color: "text-muted-foreground", label: "Pending" },
  in_progress: { icon: Loader2, color: "text-primary", label: "In Progress" },
  completed: { icon: CheckCircle2, color: "text-emerald-500", label: "Completed" },
  skipped: { icon: XCircle, color: "text-muted-foreground", label: "Skipped" },
  blocked: { icon: Ban, color: "text-destructive", label: "Blocked" },
};

// ── Protocol Card (for the grid) ─────────────────────────────────
export function ProtocolCard({
  protocol,
  onStart,
}: {
  protocol: Protocol;
  onStart: (protocol: Protocol) => void;
}) {
  const { data: steps = [] } = useProtocolSteps(protocol.id);
  const { user } = useAuth();
  const { data: execution } = useActiveExecution(protocol.id, user?.id);

  const gates = steps.filter(s => s.step_type === "gate");
  const actions = steps.filter(s => s.step_type !== "gate");
  const researchSteps = steps.filter(s => s.step_type === "research");

  return (
    <button
      onClick={() => onStart(protocol)}
      className="group flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-5 text-left transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
          <Package className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{protocol.title}</h3>
          {protocol.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">{protocol.description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
        <span>{actions.length} step{actions.length !== 1 ? "s" : ""}</span>
        {gates.length > 0 && (
          <>
            <span>·</span>
            <span className="flex items-center gap-0.5 text-amber-400">
              <Shield className="h-3 w-3" /> {gates.length} gate{gates.length !== 1 ? "s" : ""}
            </span>
          </>
        )}
        {researchSteps.length > 0 && (
          <>
            <span>·</span>
            <span className="flex items-center gap-0.5 text-violet-400">
              <Search className="h-3 w-3" /> {researchSteps.length} research
            </span>
          </>
        )}
        {execution && (
          <>
            <span>·</span>
            <Badge variant="outline" className="text-[9px] border-primary/30 text-primary">
              {execution.status === "in_progress" ? "In Progress" : "Resumable"}
            </Badge>
          </>
        )}
      </div>
    </button>
  );
}

// ── Capture Dialog ───────────────────────────────────────────────
function CaptureDialog({
  open,
  onOpenChange,
  executionId,
  stepId,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  executionId: string;
  stepId: string | null;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [captureType, setCaptureType] = useState("learning");
  const [severity, setSeverity] = useState("info");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user || !title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("execution_captures").insert({
        execution_id: executionId,
        step_id: stepId,
        captured_by: user.id,
        capture_type: captureType,
        title: title.trim(),
        content: content.trim(),
        severity,
      } as any);
      if (error) throw error;
      toast({ title: "Capture saved", description: "Knowledge captured for review." });
      qc.invalidateQueries({ queryKey: ["execution-captures", executionId] });
      setTitle("");
      setContent("");
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" /> Capture Knowledge
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Select value={captureType} onValueChange={setCaptureType}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="friction">Friction Point</SelectItem>
                <SelectItem value="drift">Drift Detected</SelectItem>
                <SelectItem value="best_practice">Best Practice</SelectItem>
                <SelectItem value="enhancement">Enhancement</SelectItem>
                <SelectItem value="exception">Exception</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <input
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Capture title…"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Describe what you observed, learned, or want to flag…"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave} disabled={!title.trim() || !content.trim() || saving}>
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Sparkles className="h-3.5 w-3.5 mr-1" />}
            Capture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Protocol Execution View ──────────────────────────────────────
export function ProtocolExecutionView({
  protocol,
  workbookId,
  workbookTitle,
  onExit,
  resumeExecutionId,
}: {
  protocol: Protocol;
  workbookId: string;
  workbookTitle: string;
  onExit: () => void;
  resumeExecutionId?: string | null;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: steps = [] } = useProtocolSteps(protocol.id);
  const { data: contextItems = [] } = useProtocolContext(protocol.id);
  const { data: activeExecution, refetch: refetchExecution } = useActiveExecution(protocol.id, user?.id, resumeExecutionId);
  const { data: stepExecs = [], refetch: refetchStepExecs } = useStepExecutions(activeExecution?.id ?? null);
  const { data: captures = [] } = useExecutionCaptures(activeExecution?.id ?? null);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string; attachment?: { id: string; title: string; type: string; url?: string; content?: string; metadata?: Record<string, unknown> } }[]>([]);
  const [captureOpen, setCaptureOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [savingDraftIdx, setSavingDraftIdx] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentStepIndex = useMemo(() => {
    if (!activeExecution?.current_step_id || steps.length === 0) return 0;
    const idx = steps.findIndex(s => s.id === activeExecution.current_step_id);
    return idx >= 0 ? idx : 0;
  }, [activeExecution?.current_step_id, steps]);

  const currentStep = steps[currentStepIndex];
  const currentStepExec = stepExecs.find(se => se.step_id === currentStep?.id);

  // Start or resume execution
  const startExecution = useMutation({
    mutationFn: async () => {
      if (activeExecution) return activeExecution;
      const { data, error } = await supabase
        .from("protocol_executions")
        .insert({
          protocol_id: protocol.id,
          workbook_id: workbookId,
          executed_by: user!.id,
          status: "in_progress",
          current_step_id: steps[0]?.id ?? null,
          started_at: new Date().toISOString(),
        } as any)
        .select()
        .single();
      if (error) throw error;

      // Create step execution records
      const stepExecInserts = steps.map(s => ({
        execution_id: data.id,
        step_id: s.id,
        status: "pending",
      }));
      if (stepExecInserts.length > 0) {
        await supabase.from("step_executions").insert(stepExecInserts as any);
      }
      return data;
    },
    onSuccess: () => {
      refetchExecution();
      refetchStepExecs();
    },
    onError: (e: any) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    },
  });

  const completeStep = useMutation({
    mutationFn: async (stepId: string) => {
      if (!activeExecution) return;
      // Update step execution
      await supabase
        .from("step_executions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        } as any)
        .eq("execution_id", activeExecution.id)
        .eq("step_id", stepId);

      // Move to next step or complete
      const nextIdx = currentStepIndex + 1;
      if (nextIdx < steps.length) {
        await supabase
          .from("protocol_executions")
          .update({
            current_step_id: steps[nextIdx].id,
          } as any)
          .eq("id", activeExecution.id);

        // Mark next step as in_progress
        await supabase
          .from("step_executions")
          .update({ status: "in_progress", started_at: new Date().toISOString() } as any)
          .eq("execution_id", activeExecution.id)
          .eq("step_id", steps[nextIdx].id);
      } else {
        // Protocol complete
        await supabase
          .from("protocol_executions")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            compliance_score: 1.0,
          } as any)
          .eq("id", activeExecution.id);
      }
    },
    onSuccess: () => {
      refetchExecution();
      refetchStepExecs();
      if (currentStepIndex + 1 >= steps.length) {
        toast({ title: "Protocol Complete", description: `"${protocol.title}" finished successfully.` });
      }
    },
  });

  const acknowledgeGate = useMutation({
    mutationFn: async (stepId: string) => {
      if (!activeExecution) return;
      await supabase
        .from("step_executions")
        .update({
          gate_acknowledged: true,
          gate_acknowledged_by: user!.id,
          gate_acknowledged_at: new Date().toISOString(),
        } as any)
        .eq("execution_id", activeExecution.id)
        .eq("step_id", stepId);
    },
    onSuccess: () => {
      refetchStepExecs();
      toast({ title: "Gate acknowledged" });
    },
  });

  const handleSend = useCallback(async (extra?: { attachment?: WorkbookResource }) => {
    const text = chatInput.trim();
    if (!text && !extra?.attachment) return;
    if (isStreaming) return;
    setChatInput("");

    const attachmentData = extra?.attachment ? {
      id: extra.attachment.id,
      title: extra.attachment.title,
      type: extra.attachment.resource_type,
      url: extra.attachment.file_path
        ? supabase.storage.from("workbook-resources").getPublicUrl(extra.attachment.file_path).data.publicUrl
        : undefined,
      content: extra.attachment.content ?? undefined,
      metadata: extra.attachment.metadata as Record<string, unknown> | undefined,
    } : undefined;

    const userMsg = { role: "user", text: text || (attachmentData ? `📎 Referenced: ${attachmentData.title}` : ""), attachment: attachmentData };
    setChatMessages(prev => [...prev, userMsg]);

    // If current step is a research step, invoke the AI research agent
    const isResearch = currentStep?.step_type === "research";
    if (isResearch) {
      setIsStreaming(true);
      let assistantSoFar = "";
      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setChatMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, text: assistantSoFar } : m);
          }
          return [...prev, { role: "assistant", text: assistantSoFar }];
        });
      };

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          toast({ title: "Not authenticated", variant: "destructive" });
          setIsStreaming(false);
          return;
        }

        // Build protocol context from injected context items
        const protocolCtx = contextItems
          .filter(ci => ci.context_items)
          .map(ci => ({
            title: ci.context_items!.title,
            category: ci.context_items!.category,
            content: ci.context_items!.content_full,
          }));

        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/run-research`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({
              research_template_id: currentStep.research_template_id,
              query: text,
              step_context: {
                title: currentStep.title,
                description: currentStep.description,
                agent_prompt: currentStep.agent_prompt,
              },
              protocol_context: protocolCtx,
            }),
          }
        );

        if (!resp.ok || !resp.body) {
          if (resp.status === 429) { toast({ title: "Rate limited", description: "Please try again shortly.", variant: "destructive" }); }
          else if (resp.status === 402) { toast({ title: "Credits exhausted", description: "Please add funds.", variant: "destructive" }); }
          else { const errData = await resp.json().catch(() => ({})); toast({ title: "Research failed", description: (errData as any).error || `Error ${resp.status}`, variant: "destructive" }); }
          setIsStreaming(false);
          return;
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIdx: number;
          while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIdx);
            buffer = buffer.slice(newlineIdx + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) upsert(content);
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }

        // Flush remaining
        if (buffer.trim()) {
          for (let raw of buffer.split("\n")) {
            if (!raw || raw.startsWith(":") || raw.trim() === "" || !raw.startsWith("data: ")) continue;
            if (raw.endsWith("\r")) raw = raw.slice(0, -1);
            const jsonStr = raw.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) upsert(content);
            } catch { /* ignore */ }
          }
        }
      } catch (e: any) {
        console.error("Research stream error:", e);
        toast({ title: "Research error", description: e.message, variant: "destructive" });
      } finally {
        setIsStreaming(false);
      }
    } else {
      // Action steps: use AI Draft Generator
      setIsStreaming(true);
      let assistantSoFar = "";
      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setChatMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, text: assistantSoFar } : m);
          }
          return [...prev, { role: "assistant", text: assistantSoFar }];
        });
      };

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          toast({ title: "Not authenticated", variant: "destructive" });
          setIsStreaming(false);
          return;
        }

        const protocolCtx = contextItems
          .filter(ci => ci.context_items)
          .map(ci => ({
            title: ci.context_items!.title,
            category: ci.context_items!.category,
            content: ci.context_items!.content_full,
          }));

        // Build conversation history for refinement (include attachment content)
        const history = chatMessages.map(m => ({
          role: m.role,
          text: m.attachment?.content
            ? `${m.text}\n\n[Referenced: ${m.attachment.title}]\n${m.attachment.content}`
            : m.text,
        }));

        // Include current attachment content if present
        const fullInput = attachmentData?.content
          ? `${text}\n\n[Referenced: ${attachmentData.title}]\n${attachmentData.content}`
          : text;

        const resp = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-draft`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({
              step_context: {
                title: currentStep.title,
                description: currentStep.description,
                agent_prompt: currentStep.agent_prompt,
                output_type: (currentStep as any).output_type ?? "free_text",
                output_description: (currentStep as any).output_description ?? null,
              },
              protocol_context: protocolCtx,
              user_input: fullInput,
              conversation_history: history,
            }),
          }
        );

        if (!resp.ok || !resp.body) {
          if (resp.status === 429) { toast({ title: "Rate limited", description: "Please try again shortly.", variant: "destructive" }); }
          else if (resp.status === 402) { toast({ title: "Credits exhausted", description: "Please add funds.", variant: "destructive" }); }
          else { const errData = await resp.json().catch(() => ({})); toast({ title: "Draft generation failed", description: (errData as any).error || `Error ${resp.status}`, variant: "destructive" }); }
          setIsStreaming(false);
          return;
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIdx: number;
          while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
            let line = buffer.slice(0, newlineIdx);
            buffer = buffer.slice(newlineIdx + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) upsert(content);
            } catch {
              buffer = line + "\n" + buffer;
              break;
            }
          }
        }

        // Flush remaining
        if (buffer.trim()) {
          for (let raw of buffer.split("\n")) {
            if (!raw || raw.startsWith(":") || raw.trim() === "" || !raw.startsWith("data: ")) continue;
            if (raw.endsWith("\r")) raw = raw.slice(0, -1);
            const jsonStr = raw.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) upsert(content);
            } catch { /* ignore */ }
          }
        }
      } catch (e: any) {
        console.error("Draft stream error:", e);
        toast({ title: "Draft error", description: e.message, variant: "destructive" });
      } finally {
        setIsStreaming(false);
      }
    }
  }, [chatInput, isStreaming, currentStep, contextItems, captures, currentStepIndex, protocol.title, toast]);

  // Auto-start execution
  if (!activeExecution && steps.length > 0) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4">
        <Package className="h-12 w-12 text-primary/50" />
        <h2 className="text-lg font-semibold">{protocol.title}</h2>
        {protocol.description && (
          <p className="text-sm text-muted-foreground max-w-md text-center">{protocol.description}</p>
        )}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{steps.filter(s => s.step_type !== "gate").length} steps</span>
          <span>·</span>
          <span>{steps.filter(s => s.step_type === "gate").length} compliance gates</span>
          <span>·</span>
          <span>{contextItems.length} context items</span>
        </div>
        <Button onClick={() => startExecution.mutate()} disabled={startExecution.isPending} className="gap-2">
          {startExecution.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Start Session
        </Button>
        <Button variant="ghost" size="sm" onClick={onExit} className="text-xs text-muted-foreground">
          ← Back to playbooks
        </Button>
      </div>
    );
  }

  if (activeExecution?.status === "completed") {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h2 className="text-lg font-semibold">Playbook Complete</h2>
        <p className="text-sm text-muted-foreground">{protocol.title} — finished successfully</p>
        <div className="flex items-center gap-3 text-sm">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-500">
            Compliance: {Math.round((activeExecution.compliance_score ?? 1) * 100)}%
          </Badge>
          {captures.length > 0 && (
            <Badge variant="outline" className="border-primary/30 text-primary">
              {captures.length} capture{captures.length !== 1 ? "s" : ""} recorded
            </Badge>
          )}
        </div>
        <Button onClick={onExit} className="gap-2">
          ← Back to playbooks
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col" style={{ background: "hsl(205 85% 55% / 0.03)" }}>
      {/* Playbook Session Banner */}
      <div className="flex items-center justify-between border-b border-primary/20 bg-primary/5 px-6 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onExit} title="Back to playbooks">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Lock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">{protocol.title}</span>
          <Badge variant="outline" className="border-primary/30 text-primary text-xs">
            Step {currentStepIndex + 1} of {steps.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => setCaptureOpen(true)}>
            <Sparkles className="h-3 w-3" /> Capture
          </Button>
          <Button variant="ghost" size="sm" onClick={onExit} className="text-xs text-muted-foreground hover:text-destructive">
            <Unlock className="mr-1 h-3 w-3" /> Release
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          {/* Step progress bar */}
          <div className="flex gap-1 border-b border-border/50 px-6 py-3 overflow-x-auto">
            {steps.map((s, i) => {
              const se = stepExecs.find(ex => ex.step_id === s.id);
              const isCompleted = se?.status === "completed";
              const isCurrent = i === currentStepIndex;
              const isGate = s.step_type === "gate";
              return (
                <div key={s.id} className="flex items-center gap-1 shrink-0">
                  <div className={`flex h-6 items-center rounded-full px-3 text-xs font-medium transition-all gap-1 ${
                    isCompleted ? "bg-emerald-500/20 text-emerald-500" :
                    isCurrent ? "bg-primary text-primary-foreground" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {isGate && <Shield className="h-2.5 w-2.5" />}
                    {s.step_type === "research" && <Search className="h-2.5 w-2.5" />}
                    {isCompleted && <Check className="h-2.5 w-2.5" />}
                    <span className="truncate max-w-[120px]">{s.title}</span>
                  </div>
                  {i < steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />}
                </div>
              );
            })}
          </div>

          {/* Current step detail + gate handling */}
          {currentStep && currentStep.step_type === "gate" && !(currentStepExec?.gate_acknowledged) && (
            <div className="mx-6 mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-destructive" />
                <h3 className="text-sm font-semibold text-destructive">Compliance Gate</h3>
                <Badge variant="outline" className="text-[9px] border-destructive/30 text-destructive">
                  {currentStep.gate_enforcement ?? "required_ack"}
                </Badge>
              </div>
              <p className="text-sm">{currentStep.description}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-1"
                  onClick={() => acknowledgeGate.mutate(currentStep.id)}
                  disabled={acknowledgeGate.isPending}
                >
                  {acknowledgeGate.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                  Acknowledge & Proceed
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="gap-1 text-xs"
                  onClick={() => setCaptureOpen(true)}
                >
                  <Flag className="h-3 w-3" /> Flag Issue
                </Button>
              </div>
            </div>
          )}

          {/* Research step handling */}
          {currentStep && currentStep.step_type === "research" && (
            <div className="mx-6 mt-4 rounded-lg border border-violet-500/30 bg-violet-500/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                {isStreaming ? (
                  <Loader2 className="h-5 w-5 text-violet-500 animate-spin" />
                ) : (
                  <Search className="h-5 w-5 text-violet-500" />
                )}
                <h3 className="text-sm font-semibold text-violet-400">Research Step</h3>
                <Badge variant="outline" className="text-[9px] border-violet-500/30 text-violet-400">
                  {isStreaming ? "Researching…" : "AI-Powered"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentStep.description ?? "Enter your research question below. The AI agent will gather and synthesize information."}
              </p>
              {currentStep.research_template_id && (
                <Badge variant="outline" className="text-[9px] border-primary/30 text-primary">
                  🔬 Research template attached
                </Badge>
              )}
            </div>
          )}

          {/* Draft Workspace banner for action steps */}
          {currentStep && currentStep.step_type === "action" && (
            <div className="mx-6 mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                {isStreaming ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <FileText className="h-5 w-5 text-primary" />
                )}
                <h3 className="text-sm font-semibold text-primary">
                  {isStreaming ? "Generating Draft…" : "Draft Workspace"}
                </h3>
                {(currentStep as any).output_type && (currentStep as any).output_type !== "free_text" && (
                  <Badge variant="outline" className="text-[9px] border-primary/30 text-primary">
                    📄 {((currentStep as any).output_type as string).replace(/_/g, " ")}
                  </Badge>
                )}
                <Badge variant="outline" className="text-[9px] border-primary/30 text-primary">
                  {isStreaming ? "Streaming…" : "AI-Powered"}
                </Badge>
              </div>
              {(currentStep as any).output_description && (
                <p className="text-sm text-primary/80 font-medium">
                  → Produces: {(currentStep as any).output_description}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {currentStep.description ?? "Describe what you need and the AI will generate a draft using your organization's context."}
              </p>
            </div>
          )}

          {/* Chat messages */}
          <div className="flex-1 overflow-auto p-6 space-y-3">
            {chatMessages.length === 0 && currentStep && (
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">{currentStep.title}</p>
                  <p>{currentStep.description ?? currentStep.agent_prompt ?? "Provide your input for this step."}</p>
                </div>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground whitespace-pre-line"
                  : "bg-secondary text-secondary-foreground"
              }`}>
                {msg.role === "assistant" ? (
                  <>
                    <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-sm [&_h2]:text-xs [&_h3]:text-xs [&_code]:text-[10px] [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    {/* Draft export actions */}
                    {!isStreaming && msg.text.length > 20 && (
                      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border/30">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(msg.text);
                              toast({ title: "Copied to clipboard" });
                            } catch {
                              toast({ title: "Copy failed", variant: "destructive" });
                            }
                          }}
                        >
                          <Copy className="h-3 w-3" /> Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
                          disabled={savingDraftIdx === i}
                          onClick={async () => {
                            if (!user) return;
                            setSavingDraftIdx(i);
                            try {
                              const stepTitle = currentStep?.title ?? "Draft";
                              const outputType = (currentStep as any)?.output_type ?? "free_text";
                              const draftTitle = `${stepTitle} — ${outputType.replace(/_/g, " ")} draft`;
                              const stepId = currentStep?.id;

                              // Check for existing resource from same step
                              const { data: existing } = await supabase
                                .from("workbook_resources")
                                .select("id, content, metadata")
                                .eq("workbook_id", workbookId)
                                .eq("resource_type", "text")
                                .order("created_at", { ascending: false });

                              const matchingResource = (existing ?? []).find((r: any) => {
                                const meta = r.metadata as Record<string, unknown> | null;
                                return meta?.step_id === stepId && meta?.source === "draft_factory";
                              });

                              if (matchingResource) {
                                // Snapshot previous content as a version
                                const { data: latestVersions } = await supabase
                                  .from("workbook_resource_versions")
                                  .select("version_number")
                                  .eq("resource_id", matchingResource.id)
                                  .order("version_number", { ascending: false })
                                  .limit(1);
                                const nextVersion = ((latestVersions as any)?.[0]?.version_number ?? 0) + 1;

                                await supabase.from("workbook_resource_versions").insert({
                                  resource_id: matchingResource.id,
                                  version_number: nextVersion,
                                  content: matchingResource.content,
                                  metadata: matchingResource.metadata,
                                  created_by: user.id,
                                  change_note: `Replaced by new generation`,
                                } as any);

                                // Update existing resource with new content
                                const { error: updateErr } = await supabase
                                  .from("workbook_resources")
                                  .update({
                                    content: msg.text,
                                    metadata: {
                                      ...((matchingResource.metadata as any) ?? {}),
                                      generated_at: new Date().toISOString(),
                                      version: nextVersion + 1,
                                    },
                                  } as any)
                                  .eq("id", matchingResource.id);
                                if (updateErr) throw updateErr;

                                qc.invalidateQueries({ queryKey: ["workbook-resources", workbookId] });
                                toast({ title: "Draft Updated (v" + (nextVersion + 1) + ")", description: `Previous version saved to history.` });
                              } else {
                                // Create new resource
                                const { error } = await supabase.from("workbook_resources").insert({
                                  workbook_id: workbookId,
                                  created_by: user.id,
                                  title: draftTitle,
                                  resource_type: "text",
                                  content: msg.text,
                                  metadata: {
                                    source: "draft_factory",
                                    protocol_id: protocol.id,
                                    step_id: stepId,
                                    output_type: outputType,
                                    generated_at: new Date().toISOString(),
                                    version: 1,
                                  },
                                } as any);
                                if (error) throw error;
                                qc.invalidateQueries({ queryKey: ["workbook-resources", workbookId] });
                                toast({ title: "Saved to Repository", description: `"${draftTitle}" added.` });
                              }
                            } catch (err: any) {
                              toast({ title: "Save failed", description: err.message, variant: "destructive" });
                            } finally {
                              setSavingDraftIdx(null);
                            }
                          }}
                        >
                          {savingDraftIdx === i ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                          Save to Repository
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            const blob = new Blob([msg.text], { type: "text/markdown" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${(currentStep?.title ?? "draft").replace(/\s+/g, "-").toLowerCase()}.md`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          <Download className="h-3 w-3" /> Download .md
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {msg.attachment && (
                      <ResourceAttachmentCard attachment={msg.attachment} isOwn />
                    )}
                    {msg.text && <span>{msg.text}</span>}
                  </>
                )}
              </div>
            ))}
            {isStreaming && chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Researching…
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input + step completion */}
          <div className="border-t border-border/50 p-4 space-y-2">
            <ChatToolbar
              workbookId={workbookId}
              messageInput={chatInput}
              setMessageInput={setChatInput}
              onSend={handleSend}
              placeholder={
                isStreaming ? "Generating draft…" :
                currentStep?.step_type === "research" ? "Ask your research question…" :
                currentStep?.step_type === "action" && (currentStep as any).output_type && (currentStep as any).output_type !== "free_text"
                  ? `Describe what to include in your ${((currentStep as any).output_type as string).replace(/_/g, " ")}…`
                  : currentStep?.step_type === "action" ? "Describe what you need — the AI will generate a draft…" :
                currentStep?.agent_prompt?.substring(0, 100) ?? "Enter your input…"
              }
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {currentStep?.estimated_minutes && (
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~{currentStep.estimated_minutes}min</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1"
                  onClick={() => setCaptureOpen(true)}
                >
                  <Sparkles className="h-3 w-3" /> Capture
                </Button>
                <Button
                  size="sm"
                  className="text-xs gap-1"
                  onClick={() => currentStep && completeStep.mutate(currentStep.id)}
                  disabled={
                    completeStep.isPending ||
                    (currentStep?.step_type === "gate" && !currentStepExec?.gate_acknowledged)
                  }
                >
                  {completeStep.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : currentStepIndex + 1 >= steps.length ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  {currentStepIndex + 1 >= steps.length ? "Complete Protocol" : "Next Step"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Context Sidebar */}
        <div className="w-72 border-l border-border/50 bg-card/50 p-4 overflow-auto space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Protocol Context</h3>

          {/* Context items by category */}
          {contextItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground">Knowledge Sources</p>
              {contextItems.map(ci => (
                <div key={ci.id} className="rounded-md bg-secondary/50 px-3 py-2 text-xs space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium truncate">{ci.context_items?.title}</span>
                  </div>
                  <CategoryBadge category={ci.context_items?.category ?? "KNOWLEDGE"} />
                  {ci.context_items?.content_full && (
                    <p className="text-muted-foreground line-clamp-2 text-[10px] mt-0.5">
                      {ci.context_items.content_full}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Captures */}
          {captures.length > 0 && (
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground">
                Captures ({captures.length})
              </p>
              {captures.slice(0, 5).map(c => (
                <div key={c.id} className="rounded-md border border-border/30 bg-muted/20 px-3 py-2 text-xs space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-[8px] px-1 py-0">{c.capture_type}</Badge>
                    <span className="font-medium truncate">{c.title}</span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-[10px]">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Step list */}
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-muted-foreground">All Steps</p>
            {steps.map((s, i) => {
              const se = stepExecs.find(ex => ex.step_id === s.id);
              const cfg = stepExecStatusConfig[se?.status ?? "pending"];
              const StepIcon = cfg.icon;
              return (
                <div key={s.id} className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${
                  i === currentStepIndex ? "bg-primary/10 border border-primary/20" : ""
                }`}>
                  <StepIcon className={`h-3 w-3 shrink-0 ${cfg.color} ${se?.status === "in_progress" ? "animate-spin" : ""}`} />
                  <span className="truncate flex-1">{s.title}</span>
                  {s.step_type === "gate" && <Shield className="h-2.5 w-2.5 text-destructive shrink-0" />}
                  {s.step_type === "research" && <Search className="h-2.5 w-2.5 text-violet-500 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Capture dialog */}
      {activeExecution && (
        <CaptureDialog
          open={captureOpen}
          onOpenChange={setCaptureOpen}
          executionId={activeExecution.id}
          stepId={currentStep?.id ?? null}
        />
      )}
    </div>
  );
}
