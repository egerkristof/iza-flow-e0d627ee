import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Plus, Users, User, X, Hash, Search, Loader2, Sparkles, GitCompareArrows, BookUp, Package, Play, CheckCircle2, PauseCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ChatToolbar } from "./ChatToolbar";
import { type WorkbookResource } from "./WorkbookResources";
import { MandateContextBanner } from "./MandateContextBanner";
import { ResourceAttachmentCard } from "./ResourceAttachmentCard";
import { ImportCopilotDialog } from "@/components/knowledge/ImportCopilotDialog";
import { ExtractionDepthSelector } from "@/components/knowledge/ExtractionDepthSelector";
import { CompareExtractionsDialog } from "@/components/knowledge/CompareExtractionsDialog";
import type { ExtractionResult, ExtractionDepth, AdvisorPersona } from "@/lib/knowledge-schema";
import { EXTRACTION_DEPTH_META } from "@/lib/knowledge-schema";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ReactMarkdown from "react-markdown";

// ── Types ──
interface DbChat {
  id: string;
  title: string | null;
  chat_type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface DbMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface DbParticipant {
  id: string;
  chat_id: string;
  user_id: string;
  joined_at: string;
}

// ── Helpers ──
function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(diff / 86400000);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

// ── Hooks ──
function useWorkbookChats(workbookId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["workbook-chats", workbookId],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_chats")
        .select("*")
        .eq("workbook_id", workbookId)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as DbChat[];
    },
  });

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`wb-chats-${workbookId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "workbook_chats",
        filter: `workbook_id=eq.${workbookId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["workbook-chats", workbookId] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [workbookId, queryClient]);

  return query;
}

function useChatMessages(chatId: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["chat-messages", chatId],
    enabled: !!chatId && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_chat_messages")
        .select("*")
        .eq("chat_id", chatId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as DbMessage[];
    },
  });

  // Realtime
  useEffect(() => {
    if (!chatId) return;
    const channel = supabase
      .channel(`chat-msgs-${chatId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "workbook_chat_messages",
        filter: `chat_id=eq.${chatId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [chatId, queryClient]);

  return query;
}

// ── Profiles cache hook ──
function useProfiles(userIds: string[]) {
  const unique = [...new Set(userIds.filter(Boolean))];
  return useQuery({
    queryKey: ["profiles", unique.sort().join(",")],
    enabled: unique.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", unique);
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const p of data) {
        map[p.user_id] = p.display_name ?? "User";
      }
      return map;
    },
    staleTime: 60000,
  });
}

// ── Last message per chat (for list view) ──
function useLastMessages(chatIds: string[]) {
  return useQuery({
    queryKey: ["last-messages", chatIds.sort().join(",")],
    enabled: chatIds.length > 0,
    queryFn: async () => {
      // Get last message per chat by fetching recent messages
      const { data, error } = await supabase
        .from("workbook_chat_messages")
        .select("chat_id, content, created_at")
        .in("chat_id", chatIds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      // Keep only last message per chat
      const map: Record<string, { content: string; created_at: string }> = {};
      for (const msg of data) {
        if (!map[msg.chat_id]) {
          map[msg.chat_id] = { content: msg.content, created_at: msg.created_at };
        }
      }
      return map;
    },
    staleTime: 10000,
  });
}

// ── Protocol Executions hook for Sessions list ──
interface ProtocolExecutionSession {
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
  created_at: string;
  updated_at: string;
  protocol_title?: string;
  total_steps?: number;
  completed_steps?: number;
}

function useProtocolExecutionSessions(workbookId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["protocol-execution-sessions", workbookId],
    enabled: !!user,
    queryFn: async () => {
      // Fetch executions for this workbook
      const { data: executions, error } = await supabase
        .from("protocol_executions")
        .select("*, workbook_protocols(title)")
        .eq("workbook_id", workbookId)
        .order("created_at", { ascending: false });
      if (error) throw error;

      // For each execution, get step counts
      const results: ProtocolExecutionSession[] = [];
      for (const exec of executions ?? []) {
        const proto = (exec as any).workbook_protocols;
        const { count: totalSteps } = await supabase
          .from("step_executions")
          .select("*", { count: "exact", head: true })
          .eq("execution_id", exec.id);
        const { count: completedSteps } = await supabase
          .from("step_executions")
          .select("*", { count: "exact", head: true })
          .eq("execution_id", exec.id)
          .eq("status", "completed");

        results.push({
          ...exec,
          updated_at: exec.completed_at ?? exec.started_at ?? exec.created_at,
          protocol_title: proto?.title ?? "Playbook",
          total_steps: totalSteps ?? 0,
          completed_steps: completedSteps ?? 0,
        } as ProtocolExecutionSession);
      }
      return results;
    },
  });
}

// ── Unified session item type ──
type SessionItem =
  | { kind: "chat"; data: DbChat; sortKey: string }
  | { kind: "execution"; data: ProtocolExecutionSession; sortKey: string };

// ── Main Component ──
export function WorkbookChats({ workbookId, focusChatId, onFocusChatHandled, onResumeProtocol }: { workbookId: string; focusChatId?: string | null; onFocusChatHandled?: () => void; onResumeProtocol?: (protocolId: string, executionId: string) => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "private" | "group">("all");
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [highlightedChatId, setHighlightedChatId] = useState<string | null>(null);
  const [chatSearch, setChatSearch] = useState("");

  // Knowledge extraction state
  const [extracting, setExtracting] = useState(false);
  const [extractingMsgId, setExtractingMsgId] = useState<string | null>(null);
  const [extractionData, setExtractionData] = useState<ExtractionResult | null>(null);
  const [extractionSourceName, setExtractionSourceName] = useState("");
  const [showImportCopilot, setShowImportCopilot] = useState(false);
  const [extractionDepth, setExtractionDepth] = useState<ExtractionDepth>("guided");
  const [compareOpen, setCompareOpen] = useState(false);

  // DB queries
  const { data: chats = [], isLoading: chatsLoading } = useWorkbookChats(workbookId);
  const { data: execSessions = [], isLoading: execLoading } = useProtocolExecutionSessions(workbookId);
  const { data: messages = [], isLoading: msgsLoading } = useChatMessages(activeThread);
  const { data: lastMessages = {} } = useLastMessages(chats.map(c => c.id));

  // Collect all sender IDs for profile lookup
  const senderIds = messages.map(m => m.sender_id);
  const chatCreatorIds = chats.map(c => c.created_by);
  const { data: profileMap = {} } = useProfiles([...senderIds, ...chatCreatorIds, user?.id ?? ""]);

  const activeChat = chats.find(c => c.id === activeThread);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-focus a chat when navigated from graph
  useEffect(() => {
    if (focusChatId) {
      setActiveThread(focusChatId);
      setHighlightedChatId(focusChatId);
      const timer = setTimeout(() => setHighlightedChatId(null), 2500);
      onFocusChatHandled?.();
      return () => clearTimeout(timer);
    }
  }, [focusChatId]);

  // ── Create chat mutation ──
  const createChat = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      // Create chat
      const { data: chat, error: chatErr } = await supabase
        .from("workbook_chats")
        .insert({
          workbook_id: workbookId,
          created_by: user.id,
          title: newChatTitle.trim() || null,
          chat_type: "private",
        })
        .select("id")
        .single();
      if (chatErr) throw chatErr;

      // Add creator as participant
      const { error: partErr } = await supabase
        .from("workbook_chat_participants")
        .insert({ chat_id: chat.id, user_id: user.id });
      if (partErr) throw partErr;

      return chat;
    },
    onSuccess: (chat) => {
      queryClient.invalidateQueries({ queryKey: ["workbook-chats", workbookId] });
      setNewChatOpen(false);
      setNewChatTitle("");
      setActiveThread(chat.id);
      toast({ title: "Chat created" });
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  // ── Send message mutation ──
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!user || !activeThread) throw new Error("Missing context");
      const { error } = await supabase
        .from("workbook_chat_messages")
        .insert({
          chat_id: activeThread,
          sender_id: user.id,
          content,
        });
      if (error) throw error;
      // Touch the chat's updated_at
      await supabase
        .from("workbook_chats")
        .update({ updated_at: new Date().toISOString() } as any)
        .eq("id", activeThread);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-messages", activeThread] });
      queryClient.invalidateQueries({ queryKey: ["workbook-chats", workbookId] });
    },
    onError: (e: any) => toast({ title: "Send failed", description: e.message, variant: "destructive" }),
  });

  // ── Knowledge extraction ──
  const generateAdvisor = async (content: string, title: string): Promise<AdvisorPersona | null> => {
    if (extractionDepth === "quick") return null;
    try {
      const { data, error } = await supabase.functions.invoke("generate-advisor", {
        body: { content, meta: { title } },
      });
      if (!error && data && !data.error) return data as AdvisorPersona;
    } catch {}
    return null;
  };

  const handleExtractChat = async () => {
    if (!activeChat || messages.length === 0) return;
    setExtracting(true);
    try {
      const content = messages
        .map(m => `[${profileMap[m.sender_id] ?? "User"} — ${new Date(m.created_at).toLocaleTimeString()}]: ${m.content}`)
        .join("\n");
      const advisorPersona = await generateAdvisor(content.slice(0, 2000), activeChat.title ?? "Chat");
      const { data, error } = await supabase.functions.invoke("extract-knowledge", {
        body: {
          source_type: "chat",
          content,
          extraction_depth: extractionDepth,
          ...(advisorPersona ? { advisor_persona: advisorPersona } : {}),
          meta: { title: activeChat.title ?? "Chat", workbook: workbookId },
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setExtractionData(data as ExtractionResult);
      setExtractionSourceName(`Chat: ${activeChat.title ?? "Untitled"}`);
      setShowImportCopilot(true);
    } catch (err: any) {
      toast({ title: "Extraction failed", description: err.message, variant: "destructive" });
    } finally {
      setExtracting(false);
    }
  };

  const handleExtractMessage = async (msg: DbMessage) => {
    if (!activeChat) return;
    setExtractingMsgId(msg.id);
    try {
      const content = `[${profileMap[msg.sender_id] ?? "User"}]: ${msg.content}`;
      const advisorPersona = await generateAdvisor(content, `${activeChat.title ?? "Chat"} — message`);
      const { data, error } = await supabase.functions.invoke("extract-knowledge", {
        body: {
          source_type: "chat",
          content,
          extraction_depth: extractionDepth,
          ...(advisorPersona ? { advisor_persona: advisorPersona } : {}),
          meta: { title: `${activeChat.title ?? "Chat"} — message`, workbook: workbookId },
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setExtractionData(data as ExtractionResult);
      setExtractionSourceName(`Message in ${activeChat.title ?? "Chat"}`);
      setShowImportCopilot(true);
    } catch (err: any) {
      toast({ title: "Extraction failed", description: err.message, variant: "destructive" });
    } finally {
      setExtractingMsgId(null);
    }
  };

  // ── Send handler ──
  const handleSend = (extra?: { attachment?: WorkbookResource }) => {
    const text = messageInput.trim();
    const attachmentText = extra?.attachment
      ? `📎 [${extra.attachment.title}]${extra.attachment.content ? "\n" + extra.attachment.content.slice(0, 500) : ""}`
      : "";
    const finalContent = [text, attachmentText].filter(Boolean).join("\n\n");
    if (!finalContent) return;
    sendMessage.mutate(finalContent);
    setMessageInput("");
  };

  // ── Build unified session list ──
  const filteredChats = chats.filter(c => {
    const matchesType = typeFilter === "all" || c.chat_type === typeFilter;
    const matchesSearch = !chatSearch || (c.title ?? "").toLowerCase().includes(chatSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  const filteredExecs = execSessions.filter(e => {
    if (typeFilter !== "all") return false; // protocol sessions only show on "all"
    const matchesSearch = !chatSearch || (e.protocol_title ?? "").toLowerCase().includes(chatSearch.toLowerCase());
    return matchesSearch;
  });

  const unifiedSessions: SessionItem[] = [
    ...filteredChats.map(c => ({ kind: "chat" as const, data: c, sortKey: c.updated_at })),
    ...filteredExecs.map(e => ({ kind: "execution" as const, data: e, sortKey: e.updated_at })),
  ].sort((a, b) => new Date(b.sortKey).getTime() - new Date(a.sortKey).getTime());

  // ── Active chat view ──
  if (activeChat) {
    return (
      <>
        <div className="flex flex-col h-[500px] rounded-lg border border-border/50 bg-card overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setActiveThread(null)}>
                <X className="h-3.5 w-3.5" />
              </Button>
              <div className="flex items-center gap-2">
                {activeChat.chat_type === "group" ? <Users className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-primary" />}
                <span className="text-sm font-medium">{activeChat.title || "Untitled Chat"}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ExtractionDepthSelector value={extractionDepth} onChange={setExtractionDepth} compact disabled={extracting} />
              <Button
                variant="ghost" size="sm" className="h-7 text-xs gap-1.5 text-primary hover:text-primary"
                onClick={handleExtractChat}
                disabled={extracting || messages.length === 0}
              >
                {extracting ? <Loader2 className="h-3 w-3 animate-spin" /> : <BookUp className="h-3 w-3" />}
                Capture
              </Button>
              <Button
                variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Compare extraction depths"
                onClick={() => setCompareOpen(true)}
                disabled={extracting || messages.length === 0}
              >
                <GitCompareArrows className="h-3.5 w-3.5" />
              </Button>
              <Badge variant="outline" className="text-[10px]">{activeChat.chat_type}</Badge>
            </div>
          </div>

          <MandateContextBanner workbookId={workbookId} />

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-3">
              {msgsLoading && <p className="text-xs text-muted-foreground text-center py-4">Loading messages…</p>}
              {!msgsLoading && messages.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">No messages yet. Start the conversation.</p>
              )}
              {messages.map(msg => {
                const isOwn = msg.sender_id === user?.id;
                const senderName = profileMap[msg.sender_id] ?? "User";
                const initials = getInitials(senderName);
                const time = new Date(msg.created_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

                return (
                  <div key={msg.id} className={`group/msg relative flex gap-2 ${isOwn ? "justify-end" : ""}`}>
                    {!isOwn && (
                      <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                        <AvatarFallback className="text-[9px] bg-secondary">{initials}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${isOwn ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                      {!isOwn && <p className="text-[10px] font-medium mb-0.5 opacity-70">{senderName}</p>}
                      <div className="prose prose-sm prose-invert max-w-none [&_p]:my-0.5 text-sm">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                      <p className={`text-[10px] mt-1 ${isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{time}</p>
                    </div>
                    {/* Per-message extract button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleExtractMessage(msg)}
                          disabled={extractingMsgId === msg.id}
                          className={`absolute ${isOwn ? "left-0 -translate-x-full" : "right-0 translate-x-full"} top-1/2 -translate-y-1/2 mx-1 opacity-0 group-hover/msg:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-primary/10 disabled:opacity-50`}
                        >
                          {extractingMsgId === msg.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                          ) : (
                            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side={isOwn ? "left" : "right"} className="text-xs">
                        Extract knowledge from this message
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="border-t border-border/50 p-3">
            <ChatToolbar
              workbookId={workbookId}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              onSend={handleSend}
            />
          </div>
        </div>

        <ImportCopilotDialog
          open={showImportCopilot}
          onOpenChange={setShowImportCopilot}
          data={extractionData}
          sourceName={extractionSourceName}
          sourceType="chat"
        />
        <CompareExtractionsDialog
          open={compareOpen}
          onOpenChange={setCompareOpen}
          sourceName={activeChat ? `Chat: ${activeChat.title ?? "Untitled"}` : ""}
          buildBody={() => {
            const content = messages
              .map(m => `[${profileMap[m.sender_id] ?? "User"}]: ${m.content}`)
              .join("\n");
            return {
              source_type: "chat",
              content,
              meta: { title: activeChat?.title ?? "", workbook: workbookId },
            };
          }}
          onSelectResult={(data, depth) => {
            setExtractionData(data);
            setExtractionSourceName(`Chat: ${activeChat?.title ?? ""} (${EXTRACTION_DEPTH_META[depth].label})`);
            setCompareOpen(false);
            setShowImportCopilot(true);
          }}
        />
      </>
    );
  }

  // ── Thread list view ──
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search sessions…"
            value={chatSearch}
            onChange={e => setChatSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
          {chatSearch && (
            <button onClick={() => setChatSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(["all", "private", "group"] as const).map(type => (
            <Badge key={type} variant={typeFilter === type ? "default" : "outline"} className="text-xs cursor-pointer hover:bg-primary/10" onClick={() => setTypeFilter(type)}>
              {type === "all" ? "All" : type === "private" ? "Private" : "Group"}
            </Badge>
          ))}
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setNewChatOpen(true)}>
          <Plus className="h-3 w-3" /> New Session
        </Button>
      </div>

      {(chatsLoading || execLoading) ? (
        <p className="text-sm text-muted-foreground text-center py-8">Loading sessions…</p>
      ) : unifiedSessions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/50 p-8 text-center text-sm text-muted-foreground">
          No sessions yet. Start a new session or run a playbook.
        </div>
      ) : (
        <div className="space-y-2">
          {unifiedSessions.map(session => {
            if (session.kind === "execution") {
              const exec = session.data;
              const progress = exec.total_steps ? Math.round((exec.completed_steps ?? 0) / exec.total_steps * 100) : 0;
              const statusIcon = exec.status === "completed"
                ? <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                : exec.status === "paused"
                ? <PauseCircle className="h-4 w-4 text-warning" />
                : exec.status === "in_progress"
                ? <Play className="h-4 w-4 text-primary" />
                : <Clock className="h-4 w-4 text-muted-foreground" />;
              const statusLabel = exec.status === "completed" ? "Completed"
                : exec.status === "paused" ? "Paused"
                : exec.status === "in_progress" ? "In Progress"
                : "Not Started";

              return (
                <button
                  key={`exec-${exec.id}`}
                  onClick={() => onResumeProtocol?.(exec.protocol_id, exec.id)}
                  className="flex w-full items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/10"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-md shrink-0 bg-primary/10 text-primary">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium truncate">{exec.protocol_title}</span>
                        <Badge variant="outline" className="text-[9px] border-primary/30 text-primary shrink-0">Playbook</Badge>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{timeAgo(exec.updated_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {statusIcon}
                        <span>{statusLabel}</span>
                      </div>
                      <span className="text-muted-foreground text-[10px]">·</span>
                      <span className="text-[10px] text-muted-foreground">{exec.completed_steps ?? 0}/{exec.total_steps ?? 0} steps</span>
                      {exec.total_steps ? (
                        <div className="flex-1 max-w-[80px] h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            }

            // Chat session
            const chat = session.data;
            const last = lastMessages[chat.id];
            return (
              <button
                key={chat.id}
                onClick={() => setActiveThread(chat.id)}
                ref={el => {
                  if (highlightedChatId === chat.id && el) {
                    setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
                  }
                }}
                className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                  highlightedChatId === chat.id
                    ? "border-primary bg-primary/15 ring-2 ring-primary/40 animate-pulse"
                    : "border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5"
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md shrink-0 bg-secondary">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm font-medium truncate">{chat.title || "Untitled Session"}</span>
                      <Badge variant="outline" className="text-[9px] border-muted-foreground/30 text-muted-foreground shrink-0">Free Session</Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{timeAgo(chat.updated_at)}</span>
                  </div>
                  {last && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{last.content.slice(0, 80)}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* New Chat Dialog */}
      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>New Session</DialogTitle></DialogHeader>
          <div className="space-y-3 pt-2">
            <Input
              placeholder="Session title (optional)"
              value={newChatTitle}
              onChange={e => setNewChatTitle(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Creates a free session within this workbook.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewChatOpen(false)}>Cancel</Button>
            <Button onClick={() => createChat.mutate()} disabled={createChat.isPending}>
              {createChat.isPending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Compact chat list for the right sidebar during active sessions */
export function ChatSidebarPanel({ workbookId }: { workbookId: string }) {
  const { data: chats = [] } = useWorkbookChats(workbookId);

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium text-muted-foreground">Recent Sessions</p>
      {chats.length === 0 ? (
        <p className="text-[10px] text-muted-foreground">No sessions yet</p>
      ) : (
        chats.slice(0, 3).map(c => (
          <div key={c.id} className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2 text-xs">
            {c.chat_type === "group" ? <Hash className="h-3 w-3 text-primary" /> : <User className="h-3 w-3 text-muted-foreground" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{c.title || "Untitled"}</p>
              <p className="text-muted-foreground text-[10px]">{timeAgo(c.updated_at)}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
