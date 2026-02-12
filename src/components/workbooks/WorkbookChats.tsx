import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Plus, Users, User, X, Hash } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ChatToolbar } from "./ChatToolbar";
import { type WorkbookResource } from "./WorkbookResources";
import { FileText, Link2, Type as TypeIcon, ExternalLink } from "lucide-react";

interface ChatThread {
  id: string;
  type: "private" | "group";
  title: string;
  participants: { id: string; name: string; initials: string }[];
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

interface ChatMessage {
  id: string;
  sender: { name: string; initials: string };
  content: string;
  time: string;
  isOwn: boolean;
  attachment?: { id: string; title: string; type: string; url?: string; content?: string };
}

const MOCK_THREADS: ChatThread[] = [
  { id: "t1", type: "private", title: "Sarah Chen", participants: [{ id: "u1", name: "Sarah Chen", initials: "SC" }], lastMessage: "Updated the pricing section, can you review?", lastMessageAt: "2m ago", unread: 2 },
  { id: "t2", type: "group", title: "Deal Strategy", participants: [{ id: "u1", name: "Sarah Chen", initials: "SC" }, { id: "u2", name: "Mike Ross", initials: "MR" }, { id: "u3", name: "Lisa Park", initials: "LP" }], lastMessage: "Let's align on the timeline before Friday", lastMessageAt: "1h ago", unread: 0 },
  { id: "t3", type: "private", title: "Mike Ross", participants: [{ id: "u2", name: "Mike Ross", initials: "MR" }], lastMessage: "The compliance check passed ✅", lastMessageAt: "3h ago", unread: 0 },
  { id: "t4", type: "group", title: "Onboarding Sync", participants: [{ id: "u3", name: "Lisa Park", initials: "LP" }, { id: "u4", name: "James Ko", initials: "JK" }], lastMessage: "Client confirmed the kickoff date", lastMessageAt: "1d ago", unread: 1 },
];

const MOCK_MESSAGES: ChatMessage[] = [
  { id: "m1", sender: { name: "Sarah Chen", initials: "SC" }, content: "I've finished the first draft of the pricing model. Can you take a look?", time: "10:30 AM", isOwn: false },
  { id: "m2", sender: { name: "You", initials: "ME" }, content: "Sure, pulling it up now. Which version did you base it on?", time: "10:32 AM", isOwn: true },
  { id: "m3", sender: { name: "Sarah Chen", initials: "SC" }, content: "v2.1 — the one with the enterprise tier adjustments. I also added the volume discount thresholds we discussed.", time: "10:33 AM", isOwn: false },
  { id: "m4", sender: { name: "You", initials: "ME" }, content: "Got it, reviewing now. The margins look good on first glance.", time: "10:38 AM", isOwn: true },
  { id: "m5", sender: { name: "Sarah Chen", initials: "SC" }, content: "Updated the pricing section, can you review?", time: "10:45 AM", isOwn: false },
];

export function WorkbookChats({ workbookId, focusChatId, onFocusChatHandled }: { workbookId: string; focusChatId?: string | null; onFocusChatHandled?: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [threads] = useState(MOCK_THREADS);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [typeFilter, setTypeFilter] = useState<"all" | "private" | "group">("all");
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [highlightedChatId, setHighlightedChatId] = useState<string | null>(null);

  const filtered = threads.filter(t => typeFilter === "all" || t.type === typeFilter);

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
  const active = threads.find(t => t.id === activeThread);

  const handleSend = (extra?: { attachment?: WorkbookResource }) => {
    if (!messageInput.trim() && !extra?.attachment) return;

    const attachment = extra?.attachment ? {
      id: extra.attachment.id,
      title: extra.attachment.title,
      type: extra.attachment.resource_type,
      url: extra.attachment.file_path
        ? supabase.storage.from("workbook-resources").getPublicUrl(extra.attachment.file_path).data.publicUrl
        : undefined,
      content: extra.attachment.content ?? undefined,
    } : undefined;

    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      sender: { name: "You", initials: "ME" },
      content: messageInput || (attachment ? `📎 Shared: ${attachment.title}` : ""),
      time: "Just now",
      isOwn: true,
      attachment,
    }]);
    setMessageInput("");
  };


  if (active) {
    return (
      <div className="flex flex-col h-[500px] rounded-lg border border-border/50 bg-card overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setActiveThread(null)}>
              <X className="h-3.5 w-3.5" />
            </Button>
            <div className="flex items-center gap-2">
              {active.type === "group" ? <Users className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-primary" />}
              <span className="text-sm font-medium">{active.title}</span>
            </div>
            {active.type === "group" && (
              <div className="flex -space-x-1.5">
                {active.participants.map(p => (
                  <Avatar key={p.id} className="h-5 w-5 border border-background">
                    <AvatarFallback className="text-[8px] bg-primary/10 text-primary">{p.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            )}
          </div>
          <Badge variant="outline" className="text-[10px]">{active.type}</Badge>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.isOwn ? "justify-end" : ""}`}>
                {!msg.isOwn && (
                  <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                    <AvatarFallback className="text-[9px] bg-secondary">{msg.sender.initials}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${msg.isOwn ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {!msg.isOwn && <p className="text-[10px] font-medium mb-0.5 opacity-70">{msg.sender.name}</p>}
                  {msg.attachment && (
                    <div className={`flex items-center gap-2 rounded-md px-2 py-1.5 mb-1.5 text-xs ${msg.isOwn ? "bg-primary-foreground/10" : "bg-muted/50"}`}>
                      {msg.attachment.type === "link" ? <Link2 className="h-3 w-3 shrink-0" /> : msg.attachment.type === "file" ? <FileText className="h-3 w-3 shrink-0" /> : <TypeIcon className="h-3 w-3 shrink-0" />}
                      <span className="font-medium truncate">{msg.attachment.title}</span>
                      {msg.attachment.url && (
                        <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer" className="shrink-0"><ExternalLink className="h-3 w-3" /></a>
                      )}
                      {msg.attachment.type === "link" && msg.attachment.content && (
                        <a href={msg.attachment.content} target="_blank" rel="noopener noreferrer" className="shrink-0"><ExternalLink className="h-3 w-3" /></a>
                      )}
                    </div>
                  )}
                  {msg.content && <p>{msg.content}</p>}
                  <p className={`text-[10px] mt-1 ${msg.isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
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
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(["all", "private", "group"] as const).map(type => (
            <Badge key={type} variant={typeFilter === type ? "default" : "outline"} className="text-xs cursor-pointer hover:bg-primary/10" onClick={() => setTypeFilter(type)}>
              {type === "all" ? "All" : type === "private" ? "Private" : "Group"}
            </Badge>
          ))}
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setNewChatOpen(true)}>
          <Plus className="h-3 w-3" /> New Chat
        </Button>
      </div>

      <div className="space-y-2">
        {filtered.map(thread => (
          <button
            key={thread.id}
            onClick={() => setActiveThread(thread.id)}
            ref={el => {
              if (highlightedChatId === thread.id && el) {
                setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
              }
            }}
            className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all ${
              highlightedChatId === thread.id
                ? "border-primary bg-primary/15 ring-2 ring-primary/40 animate-pulse"
                : "border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5"
            }`}
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-md shrink-0 ${thread.type === "group" ? "bg-primary/10 text-primary" : "bg-secondary"}`}>
              {thread.type === "group" ? <Hash className="h-4 w-4" /> : <User className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{thread.title}</span>
                <span className="text-[10px] text-muted-foreground">{thread.lastMessageAt}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{thread.lastMessage}</p>
              {thread.type === "group" && (
                <div className="flex -space-x-1 mt-1.5">
                  {thread.participants.map(p => (
                    <Avatar key={p.id} className="h-4 w-4 border border-background">
                      <AvatarFallback className="text-[7px] bg-primary/10 text-primary">{p.initials}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              )}
            </div>
            {thread.unread > 0 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shrink-0">{thread.unread}</div>
            )}
          </button>
        ))}
      </div>

      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Start New Chat</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Select team members to start a private or group conversation within this workbook.</p>
          <div className="space-y-2 pt-2">
            {[{ name: "Sarah Chen", initials: "SC" }, { name: "Mike Ross", initials: "MR" }, { name: "Lisa Park", initials: "LP" }, { name: "James Ko", initials: "JK" }].map(m => (
              <label key={m.name} className="flex items-center gap-3 rounded-md border border-border/50 px-4 py-3 cursor-pointer hover:bg-primary/5">
                <input type="checkbox" className="rounded border-primary" />
                <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px] bg-primary/10 text-primary">{m.initials}</AvatarFallback></Avatar>
                <span className="text-sm">{m.name}</span>
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewChatOpen(false)}>Cancel</Button>
            <Button onClick={() => setNewChatOpen(false)}>Start Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** Compact chat list for the right sidebar during active sessions */
export function ChatSidebarPanel({ workbookId }: { workbookId: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium text-muted-foreground">Recent Threads</p>
      {MOCK_THREADS.slice(0, 3).map(t => (
        <div key={t.id} className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2 text-xs cursor-pointer hover:bg-secondary/80">
          {t.type === "group" ? <Hash className="h-3 w-3 text-primary" /> : <User className="h-3 w-3 text-muted-foreground" />}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{t.title}</p>
            <p className="text-muted-foreground truncate text-[10px]">{t.lastMessage}</p>
          </div>
          {t.unread > 0 && <div className="h-4 w-4 rounded-full bg-primary text-[9px] font-bold text-primary-foreground flex items-center justify-center">{t.unread}</div>}
        </div>
      ))}
    </div>
  );
}
