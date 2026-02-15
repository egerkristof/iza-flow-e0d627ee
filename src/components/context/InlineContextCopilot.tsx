import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles, X, Send, Loader2, AtSign, ChevronDown, Check, Pencil,
  Plus, History, Trash2, Clock, MessageSquare, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryBadge } from "@/components/knowledge/CategoryBadge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CopilotScope = "bundle" | "playbook" | "step";

export interface CopilotHierarchy {
  bundle: { id: string; title: string; description?: string };
  playbooks: {
    id: string;
    title: string;
    content?: string;
    children: { id: string; title: string; content?: string; category: string }[];
  }[];
  sharedItems: { id: string; title: string; content?: string; category: string }[];
  currentItem?: { id: string; title: string; content?: string; category: string };
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ParsedSuggestion {
  title?: string;
  content?: string;
}

interface MentionableItem {
  id: string;
  title: string;
  category: string;
  level: "bundle" | "playbook" | "step" | "shared";
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface InlineContextCopilotProps {
  scope: CopilotScope;
  scopeId: string;
  scopeTitle: string;
  hierarchy: CopilotHierarchy;
  /** All items in the bundle, flattened, for @ mention resolution */
  allItems: MentionableItem[];
  onClose: () => void;
  className?: string;
}

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

// ─── Component ───────────────────────────────────────────────────────────────

export function InlineContextCopilot({
  scope,
  scopeId,
  scopeTitle,
  hierarchy,
  allItems,
  onClose,
  className,
}: InlineContextCopilotProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionStart, setMentionStart] = useState(-1);
  const [applyingIdx, setApplyingIdx] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // ─── Persistence state ──────────────────────────────────────────────────
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historySearch, setHistorySearch] = useState("");

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

  // Load a conversation
  const loadConversation = useCallback(async (convId: string) => {
    const { data, error } = await supabase
      .from("copilot_messages")
      .select("role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    if (error) { toast({ title: "Load failed", description: error.message, variant: "destructive" }); return; }
    setMessages((data || []).map(m => ({ role: m.role as "user" | "assistant", content: m.content })));
    setActiveConversationId(convId);
    setShowHistory(false);
  }, [toast]);

  // Start new chat
  const startNewChat = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("copilot_conversations")
      .insert({ user_id: user.id, title: "New Chat" })
      .select("id")
      .single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setMessages([]);
    setActiveConversationId(data.id);
    setShowHistory(false);
    refetchConversations();
  }, [user, toast, refetchConversations]);

  // Delete conversation
  const deleteConversation = async (convId: string) => {
    await supabase.from("copilot_conversations").delete().eq("id", convId);
    if (activeConversationId === convId) {
      setMessages([]);
      setActiveConversationId(null);
    }
    refetchConversations();
  };

  // Persist messages to DB
  const persistMessages = useCallback(async (convId: string, userMsg: ChatMessage, assistantMsg: ChatMessage) => {
    await supabase.from("copilot_messages").insert([
      { conversation_id: convId, role: userMsg.role, content: userMsg.content },
      { conversation_id: convId, role: assistantMsg.role, content: assistantMsg.content },
    ]);
    const { data: conv } = await supabase.from("copilot_conversations").select("title").eq("id", convId).single();
    if (conv?.title === "New Chat") {
      const autoTitle = userMsg.content.slice(0, 60) + (userMsg.content.length > 60 ? "…" : "");
      await supabase.from("copilot_conversations").update({ title: autoTitle }).eq("id", convId);
    }
    await supabase.from("copilot_conversations").update({ updated_at: new Date().toISOString() } as any).eq("id", convId);
    refetchConversations();
  }, [refetchConversations]);

  // Parse apply-title / apply-content blocks from assistant messages
  const parseSuggestion = useCallback((text: string): ParsedSuggestion | null => {
    const titleMatch = text.match(/```apply-title\s*\n([\s\S]*?)```/);
    const contentMatch = text.match(/```apply-content\s*\n([\s\S]*?)```/);
    if (!titleMatch && !contentMatch) return null;
    return {
      title: titleMatch?.[1]?.trim(),
      content: contentMatch?.[1]?.trim(),
    };
  }, []);

  // Strip apply blocks from display text
  const stripApplyBlocks = useCallback((text: string): string => {
    return text
      .replace(/```apply-title\s*\n[\s\S]*?```/g, "")
      .replace(/```apply-content\s*\n[\s\S]*?```/g, "")
      .trim();
  }, []);

  // Apply suggestion to the context item
  const applySuggestion = async (suggestion: ParsedSuggestion, msgIdx: number) => {
    if (!scopeId) return;
    setApplyingIdx(msgIdx);
    try {
      const update: Record<string, string> = {};
      if (suggestion.title) update.title = suggestion.title;
      if (suggestion.content) update.content_full = suggestion.content;

      const { error } = await supabase
        .from("context_items")
        .update(update as any)
        .eq("id", scopeId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["context-items"] });
      queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
      toast({ title: "Suggestion applied", description: `Updated "${suggestion.title || scopeTitle}"` });
    } catch (e: any) {
      toast({ title: "Apply failed", description: e.message, variant: "destructive" });
    } finally {
      setApplyingIdx(null);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter mentionable items
  const filteredMentions = useMemo(() => {
    if (!showMentions) return [];
    const q = mentionQuery.toLowerCase();
    return allItems
      .filter(i => i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
      .slice(0, 8);
  }, [allItems, mentionQuery, showMentions]);

  // Extract @ references from text
  const extractReferences = useCallback((text: string): string[] => {
    const refs: string[] = [];
    const regex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      refs.push(match[2]); // the ID
    }
    return refs;
  }, []);

  // Handle input changes for @ mention detection
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);

    const cursorPos = e.target.selectionStart || 0;
    const textBeforeCursor = val.slice(0, cursorPos);
    const lastAtIdx = textBeforeCursor.lastIndexOf("@");

    if (lastAtIdx >= 0) {
      const textAfterAt = textBeforeCursor.slice(lastAtIdx + 1);
      if (!textAfterAt.includes("]") && !textAfterAt.includes("\n")) {
        setShowMentions(true);
        setMentionQuery(textAfterAt);
        setMentionStart(lastAtIdx);
        return;
      }
    }
    setShowMentions(false);
  };

  // Insert mention
  const insertMention = (item: MentionableItem) => {
    const before = input.slice(0, mentionStart);
    const after = input.slice((inputRef.current?.selectionStart || mentionStart) + mentionQuery.length);
    const mention = `@[${item.title}](${item.id})`;
    setInput(before + mention + " " + after);
    setShowMentions(false);
    setMentionQuery("");
    inputRef.current?.focus();
  };

  // Send message with streaming
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    // Resolve @ references
    const refIds = extractReferences(text);
    const referencedItems = refIds
      .map(id => {
        const item = allItems.find(i => i.id === id);
        if (!item) return null;
        const allHierarchyItems = [
          ...hierarchy.sharedItems,
          ...hierarchy.playbooks.flatMap(pb => [
            { id: pb.id, title: pb.title, content: pb.content, category: "PLAYBOOK" },
            ...pb.children,
          ]),
        ];
        const full = allHierarchyItems.find(hi => hi.id === id);
        return full ? { id: full.id, title: full.title, content: full.content || "", category: full.category } : null;
      })
      .filter(Boolean);

    const displayText = text.replace(/@\[([^\]]+)\]\([^)]+\)/g, "@$1");

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

    setInput("");
    const userMsg: ChatMessage = { role: "user", content: displayText };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setIsStreaming(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
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
        toast({ title: "Not authenticated", variant: "destructive" });
        setIsStreaming(false);
        return;
      }

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/enhance-context`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          scope: { level: scope, id: scopeId, title: scopeTitle },
          hierarchy,
          referencedItems,
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) { toast({ title: "Rate limited", variant: "destructive" }); setIsStreaming(false); return; }
        if (resp.status === 402) { toast({ title: "Credits exhausted", variant: "destructive" }); setIsStreaming(false); return; }
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

      // Persist to DB
      if (convId && assistantSoFar) {
        await persistMessages(convId, userMsg, { role: "assistant", content: assistantSoFar });
      }
    } catch (e: any) {
      console.error("Copilot error:", e);
      toast({ title: "Copilot error", description: e.message, variant: "destructive" });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions && filteredMentions.length > 0) {
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        insertMention(filteredMentions[0]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowMentions(false);
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scopeLabels: Record<CopilotScope, string> = {
    bundle: "Bundle Copilot",
    playbook: "Playbook Copilot",
    step: "Step Copilot",
  };

  const scopeIcons: Record<CopilotScope, string> = {
    bundle: "📦",
    playbook: "🎯",
    step: "⚡",
  };

  const activeConvTitle = conversations.find(c => c.id === activeConversationId)?.title;

  // Filtered conversations for history search
  const filteredConversations = useMemo(() => {
    const q = historySearch.toLowerCase().trim();
    return q ? conversations.filter(c => c.title.toLowerCase().includes(q)) : conversations;
  }, [conversations, historySearch]);

  return (
    <div className={cn(
      "border border-primary/20 rounded-lg bg-card/95 backdrop-blur-sm flex flex-col overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-primary/5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm">{scopeIcons[scope]}</span>
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold">{scopeLabels[scope]}</span>
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 truncate max-w-[120px]">
            {activeConvTitle && activeConvTitle !== "New Chat" ? activeConvTitle : scopeTitle}
          </Badge>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <Button variant="ghost" size="icon" className="h-6 w-6" title="New Chat" onClick={startNewChat}>
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-6 w-6", showHistory && "bg-primary/10")}
            title="History"
            onClick={() => { setShowHistory(!showHistory); setHistorySearch(""); }}
          >
            <History className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {showHistory ? (
        /* ─── History Panel ─────────────────────────────────────────────── */
        <div className="flex-1 flex flex-col min-h-0" style={{ maxHeight: "280px" }}>
          <div className="px-3 pt-2 pb-1.5">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                value={historySearch}
                onChange={e => setHistorySearch(e.target.value)}
                placeholder="Search conversations…"
                className="h-7 text-[11px] pl-7 pr-2"
                autoFocus
              />
            </div>
          </div>
          <ScrollArea className="flex-1 px-3 pb-2">
            <div className="space-y-0.5">
              {filteredConversations.length === 0 ? (
                <p className="text-[11px] text-muted-foreground text-center py-4">
                  {historySearch.trim() ? "No matching chats" : "No previous chats"}
                </p>
              ) : filteredConversations.map(conv => (
                <div
                  key={conv.id}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 cursor-pointer transition-colors group",
                    conv.id === activeConversationId
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted/50 border border-transparent"
                  )}
                  onClick={() => loadConversation(conv.id)}
                >
                  <MessageSquare className="h-3 w-3 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium truncate">{conv.title}</p>
                    <p className="text-[9px] text-muted-foreground flex items-center gap-0.5">
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
        /* ─── Chat Messages ─────────────────────────────────────────────── */
        <>
          <ScrollArea className="flex-1 min-h-0 overflow-y-auto" style={{ height: "280px" }}>
            <div className="p-3 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <Sparkles className="h-6 w-6 mx-auto mb-2 text-primary/30" />
                  <p className="text-[11px] text-muted-foreground">
                    Ask me to enhance this {scope}. Use <kbd className="px-1 py-0.5 bg-muted rounded text-[9px]">@</kbd> to reference items.
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {scope === "bundle" && (
                      <>
                        <SuggestionChip onClick={() => setInput("What gaps exist in this bundle?")}>Find gaps</SuggestionChip>
                        <SuggestionChip onClick={() => setInput("Suggest a new playbook for this bundle")}>Suggest playbook</SuggestionChip>
                      </>
                    )}
                    {scope === "playbook" && (
                      <>
                        <SuggestionChip onClick={() => setInput("Break this playbook into detailed steps")}>Detail steps</SuggestionChip>
                        <SuggestionChip onClick={() => setInput("What context items should each step reference?")}>Map context</SuggestionChip>
                      </>
                    )}
                    {scope === "step" && (
                      <>
                        <SuggestionChip onClick={() => setInput("Enhance this step's description for better AI execution")}>Enhance</SuggestionChip>
                        <SuggestionChip onClick={() => setInput("Should this step trigger a research action?")}>Research check</SuggestionChip>
                        <SuggestionChip onClick={() => setInput("What context items should be injected for this step?")}>Context refs</SuggestionChip>
                      </>
                    )}
                  </div>
                </div>
              )}
              {messages.map((msg, idx) => {
                const suggestion = msg.role === "assistant" ? parseSuggestion(msg.content) : null;
                const displayContent = msg.role === "assistant" ? stripApplyBlocks(msg.content) : msg.content;
                const isApplying = applyingIdx === idx;

                return (
                  <div key={idx} className={cn("text-xs", msg.role === "user" ? "text-right" : "")}>
                    {msg.role === "user" ? (
                      <div className="inline-block bg-primary/10 rounded-lg px-3 py-2 text-left max-w-[90%]">
                        <p className="whitespace-pre-wrap">{displayContent}</p>
                      </div>
                    ) : (
                      <div>
                        <div className="prose prose-sm prose-invert max-w-none text-xs [&>*]:text-xs [&_p]:text-xs [&_li]:text-xs [&_h1]:text-sm [&_h2]:text-xs [&_h3]:text-xs [&_code]:text-[10px]">
                          <ReactMarkdown>{displayContent}</ReactMarkdown>
                        </div>
                        {suggestion && !isStreaming && (
                          <div className="mt-2 flex items-center gap-2 p-2 rounded-md border border-primary/20 bg-primary/5">
                            <Pencil className="h-3 w-3 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] text-muted-foreground">
                                Suggested changes:{" "}
                                {suggestion.title && <span className="font-medium text-foreground">title</span>}
                                {suggestion.title && suggestion.content && " + "}
                                {suggestion.content && <span className="font-medium text-foreground">content</span>}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              className="h-6 text-[10px] px-2 gap-1"
                              disabled={isApplying}
                              onClick={() => applySuggestion(suggestion, idx)}
                            >
                              {isApplying ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                              Apply
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Thinking…
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          {/* Input with @ mention support */}
          <div className="relative border-t border-border/50">
            {/* Mention dropdown */}
            {showMentions && filteredMentions.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 bg-popover border border-border rounded-t-lg shadow-lg max-h-48 overflow-auto z-50">
                {filteredMentions.map(item => (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-accent transition-colors"
                    onClick={() => insertMention(item)}
                  >
                    <CategoryBadge category={item.category} />
                    <span className="text-xs truncate flex-1">{item.title}</span>
                    <span className="text-[9px] text-muted-foreground">{item.level}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-end gap-1 p-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => {
                  setInput(prev => prev + "@");
                  setShowMentions(true);
                  setMentionQuery("");
                  setMentionStart(input.length);
                  inputRef.current?.focus();
                }}
              >
                <AtSign className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={`Enhance this ${scope}… (@ to reference)`}
                className="flex-1 min-h-[32px] max-h-[80px] resize-none bg-transparent text-xs outline-none placeholder:text-muted-foreground/50 py-1.5"
                rows={1}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
              >
                {isStreaming ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Suggestion Chip ─────────────────────────────────────────────────────────

function SuggestionChip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[10px] px-2 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
    >
      {children}
    </button>
  );
}
