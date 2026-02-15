import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles, X, Check, Shield, RefreshCw, Loader2,
  Tag, FileText, Scissors, Merge, Archive, ChevronDown, ChevronUp,
  Send, MessageSquare, Pencil, Plus, History, Trash2, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/knowledge/CategoryBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface AuditSuggestion {
  item_id: string;
  type: "recategorize" | "enrich" | "split" | "merge" | "promote_mandate" | "archive";
  reason: string;
  suggested_category?: string;
  suggested_content?: string;
  merge_with_id?: string;
  enforcement_level?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ContextCopilotPanelProps {
  items: any[];
  onClose: () => void;
}

const CATEGORIES = ["DIRECTIVE", "KNOWLEDGE", "PROCEDURE", "PLAYBOOK", "PREFERENCE", "RESEARCH", "PRINCIPLE"];
const ENFORCEMENT_LEVELS = ["advisory", "required_ack", "blocking"];

const TYPE_META: Record<string, { icon: any; label: string; color: string }> = {
  recategorize: { icon: Tag, label: "Recategorize", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
  enrich: { icon: FileText, label: "Enrich", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  split: { icon: Scissors, label: "Split", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  merge: { icon: Merge, label: "Merge", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
  promote_mandate: { icon: Shield, label: "Promote to Mandate", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  archive: { icon: Archive, label: "Archive", color: "text-muted-foreground bg-muted/50 border-border" },
};

function formatRelative(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export function ContextCopilotPanel({ items, onClose }: ContextCopilotPanelProps) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<AuditSuggestion[]>([]);
  const [summary, setSummary] = useState("");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editedSuggestions, setEditedSuggestions] = useState<Map<number, Partial<AuditSuggestion>>>(new Map());

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("suggestions");

  // Persistence state
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Fetch conversation list
  const { data: conversations = [], refetch: refetchConversations } = useQuery({
    queryKey: ["copilot-conversations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("copilot_conversations")
        .select("id, title, created_at, updated_at")
        .eq("user_id", user!.id)
        .order("updated_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as Conversation[];
    },
  });

  // Load messages for active conversation
  const loadConversation = useCallback(async (convId: string) => {
    const { data, error } = await supabase
      .from("copilot_messages")
      .select("role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    if (error) { toast({ title: "Load failed", description: error.message, variant: "destructive" }); return; }
    setChatMessages((data || []).map(m => ({ role: m.role as "user" | "assistant", content: m.content })));
    setActiveConversationId(convId);
    setShowHistory(false);
    setActiveTab("chat");
  }, [toast]);

  // Create new conversation
  const startNewChat = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("copilot_conversations")
      .insert({ user_id: user.id, title: "New Chat" })
      .select("id")
      .single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setChatMessages([]);
    setActiveConversationId(data.id);
    setShowHistory(false);
    setActiveTab("chat");
    refetchConversations();
  }, [user, toast, refetchConversations]);

  // Delete conversation
  const deleteConversation = async (convId: string) => {
    await supabase.from("copilot_conversations").delete().eq("id", convId);
    if (activeConversationId === convId) {
      setChatMessages([]);
      setActiveConversationId(null);
    }
    refetchConversations();
  };

  // Save messages to DB after send
  const persistMessages = useCallback(async (convId: string, userMsg: ChatMessage, assistantMsg: ChatMessage) => {
    await supabase.from("copilot_messages").insert([
      { conversation_id: convId, role: userMsg.role, content: userMsg.content },
      { conversation_id: convId, role: assistantMsg.role, content: assistantMsg.content },
    ]);
    // Auto-title from first user message
    const { data: conv } = await supabase.from("copilot_conversations").select("title").eq("id", convId).single();
    if (conv?.title === "New Chat") {
      const autoTitle = userMsg.content.slice(0, 60) + (userMsg.content.length > 60 ? "…" : "");
      await supabase.from("copilot_conversations").update({ title: autoTitle }).eq("id", convId);
      refetchConversations();
    }
    // Touch updated_at
    await supabase.from("copilot_conversations").update({ updated_at: new Date().toISOString() } as any).eq("id", convId);
    refetchConversations();
  }, [refetchConversations]);

  // Get the effective suggestion (with edits applied)
  const getEffective = (idx: number, s: AuditSuggestion): AuditSuggestion => {
    const edits = editedSuggestions.get(idx);
    return edits ? { ...s, ...edits } : s;
  };

  const updateEdit = (idx: number, patch: Partial<AuditSuggestion>) => {
    setEditedSuggestions(prev => {
      const next = new Map(prev);
      next.set(idx, { ...(next.get(idx) || {}), ...patch });
      return next;
    });
  };

  const auditMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("audit-context", {
        body: {
          action: "audit",
          items: items.map(i => ({
            id: i.id, title: i.title, content_full: i.content_full,
            category: i.category, priority: i.priority, is_mandate: i.is_mandate,
          })),
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return data as { summary: string; suggestions: AuditSuggestion[] };
    },
    onSuccess: (data) => {
      setSuggestions(data.suggestions || []);
      setSummary(data.summary || "");
      setDismissed(new Set());
      setApplied(new Set());
      setEditedSuggestions(new Map());
      setEditingIdx(null);
    },
    onError: (e: any) => toast({ title: "Audit failed", description: e.message, variant: "destructive" }),
  });

  const applyMutation = useMutation({
    mutationFn: async ({ suggestion, idx }: { suggestion: AuditSuggestion; idx: number }) => {
      const effective = getEffective(idx, suggestion);
      let action = "";
      let body: any = { item_id: effective.item_id };

      if (effective.type === "recategorize") {
        action = "apply_recategorize";
        body.new_category = effective.suggested_category;
      } else if (effective.type === "enrich") {
        action = "apply_enrich";
        body.enriched_content = effective.suggested_content;
      } else if (effective.type === "promote_mandate") {
        action = "apply_promote_mandate";
        body.enforcement_level = effective.enforcement_level || "required_ack";
      } else if (effective.type === "merge") {
        action = "apply_merge";
        body.merge_with_id = effective.merge_with_id;
      } else if (effective.type === "split") {
        action = "apply_split";
        body.suggested_content = effective.suggested_content;
      } else {
        throw new Error(`Apply not yet supported for ${effective.type} — use as guidance`);
      }

      const { data, error } = await supabase.functions.invoke("audit-context", { body: { action, ...body } });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      return effective;
    },
    onSuccess: (effective) => {
      setApplied(prev => new Set(prev).add(effective.item_id + effective.type));
      qc.invalidateQueries({ queryKey: ["my-context-items"] });
      qc.invalidateQueries({ queryKey: ["context-items"] });
      qc.invalidateQueries({ queryKey: ["mandates"] });
      toast({ title: "Applied", description: `${TYPE_META[effective.type].label} applied successfully.` });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // Streaming chat
  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || isStreaming) return;
    setChatInput("");

    // Auto-create conversation if none active
    let convId = activeConversationId;
    if (!convId && user) {
      const { data, error } = await supabase
        .from("copilot_conversations")
        .insert({ user_id: user.id, title: "New Chat" })
        .select("id")
        .single();
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
      convId = data.id;
      setActiveConversationId(convId);
      refetchConversations();
    }

    const userMsg: ChatMessage = { role: "user", content: text };
    const allMessages = [...chatMessages, userMsg];
    setChatMessages(allMessages);
    setIsStreaming(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setChatMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) {
        toast({ title: "Not authenticated", description: "Please log in to use the copilot.", variant: "destructive" });
        setIsStreaming(false);
        return;
      }

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/audit-context`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          action: "chat",
          messages: allMessages,
          graph_context: items.map(i => ({ title: i.title, category: i.category })),
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) { toast({ title: "Rate limited", description: "Please try again shortly.", variant: "destructive" }); setIsStreaming(false); return; }
        if (resp.status === 402) { toast({ title: "Credits exhausted", description: "Please add funds.", variant: "destructive" }); setIsStreaming(false); return; }
        throw new Error("Stream failed");
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

      // Check for re-audit trigger
      if (assistantSoFar.includes("[TRIGGER_REAUDIT]")) {
        const cleaned = assistantSoFar.replace(/\s*\[TRIGGER_REAUDIT\]\s*/g, "").trim();
        setChatMessages(prev =>
          prev.map((m, i) => (i === prev.length - 1 && m.role === "assistant" ? { ...m, content: cleaned } : m))
        );
        assistantSoFar = cleaned;
        setActiveTab("suggestions");
        setTimeout(() => auditMutation.mutate(), 300);
      }

      // Persist to DB
      if (convId && assistantSoFar) {
        await persistMessages(convId, userMsg, { role: "assistant", content: assistantSoFar });
      }
    } catch (e: any) {
      console.error("Chat error:", e);
      toast({ title: "Chat error", description: e.message, variant: "destructive" });
    } finally {
      setIsStreaming(false);
    }
  };

  const getItemTitle = (id: string) => items.find(i => i.id === id)?.title || "Unknown";
  const activeSuggestions = suggestions.filter(s => !dismissed.has(s.item_id + s.type));

  const activeConvTitle = conversations.find(c => c.id === activeConversationId)?.title;

  return (
    <div className="border border-primary/20 rounded-lg bg-card/80 backdrop-blur-sm flex flex-col" style={{ maxHeight: '70vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Knowledge Graph Copilot</span>
          {activeSuggestions.length > 0 && (
            <Badge variant="secondary" className="text-[10px]">
              {activeSuggestions.length}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1"
            onClick={() => auditMutation.mutate()}
            disabled={auditMutation.isPending || items.length === 0}
          >
            {auditMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            {suggestions.length > 0 ? "Re-audit" : "Run Audit"}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <TabsList className="mx-3 mt-2 h-8">
          <TabsTrigger value="suggestions" className="text-xs gap-1 h-7">
            <Sparkles className="h-3 w-3" /> Suggestions
          </TabsTrigger>
          <TabsTrigger value="chat" className="text-xs gap-1 h-7">
            <MessageSquare className="h-3 w-3" /> Chat
          </TabsTrigger>
        </TabsList>

        {/* Suggestions Tab */}
        <TabsContent value="suggestions" className="flex-1 overflow-hidden m-0 p-3 pt-2 flex flex-col min-h-0" style={{ minHeight: 0 }}>
          {auditMutation.isPending ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing {items.length} items…
            </div>
          ) : suggestions.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>Click <strong>Run Audit</strong> to analyze your knowledge graph.</p>
              <p className="text-[10px] mt-1">The AI will scan {items.length} items and suggest improvements.</p>
            </div>
          ) : (
            <div className="flex flex-col flex-1 min-h-0 gap-2">
              {summary && (
                <p className="text-xs text-muted-foreground bg-muted/30 rounded-md p-2 shrink-0">{summary}</p>
              )}
              <div className="flex-1 min-h-0 overflow-auto">
                <div className="space-y-2 pr-2">
                  {activeSuggestions.map((s, idx) => {
                    const meta = TYPE_META[s.type];
                    const Icon = meta.icon;
                    const key = s.item_id + s.type;
                    const isApplied = applied.has(key);
                    const isExpanded = expandedIdx === idx;
                    const isEditing = editingIdx === idx;
                    const effective = getEffective(idx, s);
                    const canApply = ["recategorize", "enrich", "promote_mandate", "merge", "split"].includes(s.type);

                    return (
                      <div key={key} className={cn("rounded-md border p-2.5 transition-colors", isApplied ? "opacity-50" : "")}>
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className={cn("text-[9px] gap-0.5 shrink-0 mt-0.5", meta.color)}>
                            <Icon className="h-2.5 w-2.5" />
                            {meta.label}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{getItemTitle(s.item_id)}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{s.reason}</p>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            {isExpanded && !isApplied && (
                              <button onClick={() => setEditingIdx(isEditing ? null : idx)} className={cn("text-muted-foreground hover:text-foreground", isEditing && "text-primary")}>
                                <Pencil className="h-3 w-3" />
                              </button>
                            )}
                            <button onClick={() => setExpandedIdx(isExpanded ? null : idx)} className="text-muted-foreground hover:text-foreground">
                              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-2 pt-2 border-t border-border/30 space-y-2">
                            {s.type === "recategorize" && (
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-muted-foreground">Category:</span>
                                {isEditing ? (
                                  <Select value={effective.suggested_category || ""} onValueChange={(v) => updateEdit(idx, { suggested_category: v })}>
                                    <SelectTrigger className="h-6 text-[11px] w-36"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-popover z-50">
                                      {CATEGORIES.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <CategoryBadge category={effective.suggested_category || ""} />
                                )}
                              </div>
                            )}
                            {s.type === "enrich" && (
                              isEditing ? (
                                <Textarea
                                  className="text-[11px] min-h-[80px] bg-muted/30"
                                  value={effective.suggested_content || ""}
                                  onChange={(e) => updateEdit(idx, { suggested_content: e.target.value })}
                                />
                              ) : (
                                <p className="text-[11px] bg-muted/30 rounded p-2 whitespace-pre-wrap max-h-32 overflow-auto">{effective.suggested_content}</p>
                              )
                            )}
                            {s.type === "promote_mandate" && (
                              <div className="flex items-center gap-2 text-xs">
                                <Shield className="h-3 w-3 text-amber-400" />
                                <span className="text-muted-foreground">Enforcement:</span>
                                {isEditing ? (
                                  <Select value={effective.enforcement_level || "required_ack"} onValueChange={(v) => updateEdit(idx, { enforcement_level: v })}>
                                    <SelectTrigger className="h-6 text-[11px] w-36"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-popover z-50">
                                      {ENFORCEMENT_LEVELS.map(l => <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <Badge variant="outline" className="text-[9px]">{effective.enforcement_level || "required_ack"}</Badge>
                                )}
                              </div>
                            )}
                            {s.type === "split" && (
                              isEditing ? (
                                <Textarea
                                  className="text-[11px] min-h-[60px] bg-muted/30"
                                  value={effective.suggested_content || ""}
                                  onChange={(e) => updateEdit(idx, { suggested_content: e.target.value })}
                                />
                              ) : (
                                s.suggested_content && <p className="text-[11px] bg-muted/30 rounded p-2">{effective.suggested_content}</p>
                              )
                            )}
                            {s.type === "merge" && s.merge_with_id && (
                              <p className="text-[11px] text-muted-foreground">Merge with: <strong>{getItemTitle(s.merge_with_id)}</strong></p>
                            )}

                            <div className="flex items-center gap-1.5 justify-end">
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2"
                                onClick={() => setDismissed(prev => new Set(prev).add(key))}
                              >
                                Dismiss
                              </Button>
                              {canApply && !isApplied && (
                                <Button size="sm" className="h-6 text-[10px] px-2 gap-1"
                                  onClick={() => applyMutation.mutate({ suggestion: s, idx })}
                                  disabled={applyMutation.isPending}
                                >
                                  {applyMutation.isPending ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Check className="h-2.5 w-2.5" />}
                                  Apply{editedSuggestions.has(idx) ? " (edited)" : ""}
                                </Button>
                              )}
                              {isApplied && (
                                <Badge variant="outline" className="text-[9px] text-emerald-400 border-emerald-500/30">
                                  <Check className="h-2 w-2 mr-0.5" /> Applied
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
          {showHistory ? (
            /* History panel */
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between px-3 pt-2 pb-1">
                <span className="text-xs font-medium text-muted-foreground">Chat History</span>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1" onClick={() => setShowHistory(false)}>
                  <X className="h-2.5 w-2.5" /> Close
                </Button>
              </div>
              <ScrollArea className="flex-1 px-3 pb-2">
                <div className="space-y-1">
                  {conversations.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No previous chats</p>
                  ) : conversations.map(conv => (
                    <div
                      key={conv.id}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2.5 py-2 cursor-pointer transition-colors group",
                        conv.id === activeConversationId
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-muted/50 border border-transparent"
                      )}
                      onClick={() => loadConversation(conv.id)}
                    >
                      <MessageSquare className="h-3 w-3 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{conv.title}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {formatRelative(conv.updated_at)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 opacity-0 group-hover:opacity-100 shrink-0 text-destructive"
                        onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            /* Chat messages */
            <>
              {/* Chat toolbar */}
              <div className="flex items-center gap-1 px-3 pt-2 pb-1">
                <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={startNewChat}>
                  <Plus className="h-2.5 w-2.5" /> New Chat
                </Button>
                <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={() => setShowHistory(true)}>
                  <History className="h-2.5 w-2.5" /> History
                  {conversations.length > 0 && (
                    <Badge variant="secondary" className="text-[8px] h-3.5 px-1 ml-0.5">{conversations.length}</Badge>
                  )}
                </Button>
                {activeConvTitle && activeConvTitle !== "New Chat" && (
                  <span className="text-[10px] text-muted-foreground truncate ml-1 flex-1">{activeConvTitle}</span>
                )}
              </div>

              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p>Ask the copilot about your knowledge graph.</p>
                      <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                        {["How should I audit my graph?", "Which items need attention?", "Tips for better organization"].map(q => (
                          <button key={q} onClick={() => { setChatInput(q); }} className="text-[10px] px-2 py-1 rounded-full border border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((m, i) => (
                    <div key={i} className={cn("text-xs", m.role === "user" ? "text-right" : "")}>
                      <div className={cn(
                        "inline-block max-w-[90%] rounded-lg px-3 py-2 text-left",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-foreground"
                      )}>
                        {m.role === "user" ? (
                          <p className="whitespace-pre-wrap">{m.content}</p>
                        ) : (
                          <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-sm [&_h2]:text-xs [&_h3]:text-xs [&_code]:text-[10px] [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded">
                            <ReactMarkdown
                              components={{
                                code({ className, children, ...props }) {
                                  const match = /language-(\w+)/.exec(className || "");
                                  const code = String(children).replace(/\n$/, "");
                                  return match ? (
                                    <SyntaxHighlighter
                                      style={oneDark}
                                      language={match[1]}
                                      PreTag="div"
                                      customStyle={{ fontSize: "10px", borderRadius: "6px", margin: "4px 0", padding: "8px" }}
                                    >
                                      {code}
                                    </SyntaxHighlighter>
                                  ) : (
                                    <code className={className} {...props}>{children}</code>
                                  );
                                },
                              }}
                            >
                              {m.content}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isStreaming && chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>
              <div className="p-3 pt-0 border-t border-border/50">
                <div className="flex gap-1.5 mt-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                    placeholder="Ask about auditing, organizing, deduplication…"
                    className="text-xs h-8"
                    disabled={isStreaming}
                  />
                  <Button size="icon" className="h-8 w-8 shrink-0" onClick={sendChatMessage} disabled={isStreaming || !chatInput.trim()}>
                    {isStreaming ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
