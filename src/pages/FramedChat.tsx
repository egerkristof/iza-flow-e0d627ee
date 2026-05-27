import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Send, Lock, ShieldCheck, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FrameTile } from "@/components/frame/FrameTile";
import { FrameScore } from "@/components/frame/FrameScore";
import { ChatList } from "@/components/frame/ChatList";
import {
  INITIAL_TILES,
  frameScore,
  nextStatus,
  deriveSignals,
  type ConditionTile,
  type CopilotSignal,
  type TileId,
  type TileStatus,
} from "@/components/frame/frame-data";
import {
  listChats,
  getChat,
  saveChat,
  deleteChat,
  newChat,
  deriveTitle,
  addSanctioned,
  type StoredChat,
  type StoredMessage,
  type Visibility,
} from "@/components/frame/chat-storage";

const TOKENS_PER_MESSAGE = 250;
const MAX_UNREAD = 2;

function applyTileStatus(overrides: Partial<Record<TileId, TileStatus>>): ConditionTile[] {
  return INITIAL_TILES.map((t) => ({ ...t, status: overrides[t.id] ?? t.status }));
}

export default function FramedChatPage() {
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();

  const [chats, setChats] = useState<StoredChat[]>(() => listChats());
  const [chat, setChat] = useState<StoredChat | null>(null);
  const [expanded, setExpanded] = useState<TileId | null>(null);
  const [unread, setUnread] = useState<Set<TileId>>(new Set());
  const [draft, setDraft] = useState("");
  const [sanctionOpen, setSanctionOpen] = useState(false);
  const [pendingVisibility, setPendingVisibility] = useState<Visibility>("private");
  const [shared, setShared] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) {
      const all = listChats();
      if (all.length > 0) {
        navigate(`/framed-chat/${all[0].id}`, { replace: true });
      } else {
        const c = newChat();
        saveChat(c);
        setChats([c]);
        navigate(`/framed-chat/${c.id}`, { replace: true });
      }
      return;
    }
    const existing = getChat(chatId);
    if (existing) {
      setChat(existing);
      setShared(false);
    } else {
      const c: StoredChat = { ...newChat(), id: chatId };
      saveChat(c);
      setChats(listChats());
      setChat(c);
    }
    setExpanded(null);
    setUnread(new Set());
    setDraft("");
  }, [chatId, navigate]);

  const tiles = useMemo<ConditionTile[]>(
    () => applyTileStatus(chat?.tileStatus ?? {}),
    [chat?.tileStatus],
  );
  const score = useMemo(() => frameScore(tiles), [tiles]);

  const signals = useMemo<Record<TileId, CopilotSignal[]>>(() => {
    const msgs = chat?.messages ?? [];
    return Object.fromEntries(
      INITIAL_TILES.map((t) => [t.id, deriveSignals(t.id, msgs)]),
    ) as Record<TileId, CopilotSignal[]>;
  }, [chat?.messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages.length]);

  const updateChat = useCallback((mut: (c: StoredChat) => StoredChat) => {
    setChat((prev) => {
      if (!prev) return prev;
      const next = { ...mut(prev), updatedAt: Date.now() };
      saveChat(next);
      setChats(listChats());
      return next;
    });
  }, []);

  const handleNewChat = () => {
    const c = newChat();
    saveChat(c);
    setChats(listChats());
    navigate(`/framed-chat/${c.id}`);
  };

  const handleDelete = (id: string) => {
    deleteChat(id);
    const remaining = listChats();
    setChats(remaining);
    if (id === chatId) {
      if (remaining.length > 0) navigate(`/framed-chat/${remaining[0].id}`);
      else navigate(`/framed-chat`);
    }
  };

  const send = () => {
    const text = draft.trim();
    if (!text || !chat) return;
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const msg: StoredMessage = {
      id: crypto.randomUUID(),
      author: "You",
      initials: "YO",
      role: "user",
      text,
      ts,
    };
    const nextMessages = [...chat.messages, msg];
    const prevSignals = signals;
    const newUnread: TileId[] = [];
    for (const t of INITIAL_TILES) {
      const next = deriveSignals(t.id, nextMessages);
      if (next.length > prevSignals[t.id].length && expanded !== t.id) newUnread.push(t.id);
    }
    updateChat((c) => ({
      ...c,
      messages: nextMessages,
      tokenCount: c.tokenCount + TOKENS_PER_MESSAGE,
      title: c.messages.length === 0 ? deriveTitle(nextMessages) : c.title,
    }));
    setDraft("");
    setUnread((prev) => {
      const combined = new Set([...prev, ...newUnread]);
      return new Set([...combined].slice(0, MAX_UNREAD) as TileId[]);
    });
  };

  const handleToggle = (id: TileId) => {
    setExpanded((prev) => (prev === id ? null : id));
    setUnread((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const advance = (id: TileId) => {
    updateChat((c) => {
      const current = c.tileStatus[id] ?? INITIAL_TILES.find((t) => t.id === id)!.status;
      return { ...c, tileStatus: { ...c.tileStatus, [id]: nextStatus(current) } };
    });
  };

  const handleSaveSignal = (tileId: TileId) => (signalId: string) => {
    updateChat((c) => {
      const current = c.tileStatus[tileId] ?? INITIAL_TILES.find((t) => t.id === tileId)!.status;
      const nextS: TileStatus = current === "empty" ? "partial" : current;
      return {
        ...c,
        savedSignalIds: [...c.savedSignalIds, signalId],
        tileStatus: { ...c.tileStatus, [tileId]: nextS },
      };
    });
    toast.success("Saved to monitor", { description: "Review in Conditions to refine." });
  };

  const handleDismissSignal = (signalId: string) => {
    updateChat((c) => ({ ...c, dismissedSignalIds: [...c.dismissedSignalIds, signalId] }));
  };

  const handleShare = () => {
    setShared(true);
    toast.success("Shared with team", { description: "Teammates can now view this chat." });
  };

  const handleConfirmSanction = () => {
    if (!chat) return;
    const workflow = {
      id: crypto.randomUUID(),
      chatId: chat.id,
      title: chat.title,
      frameScore: score,
      visibility: pendingVisibility,
      sanctionedAt: Date.now(),
    };
    addSanctioned(workflow);
    updateChat((c) => ({
      ...c,
      sanctioned: { at: workflow.sanctionedAt, visibility: pendingVisibility, score },
    }));
    setSanctionOpen(false);
    toast.success("Chat sanctioned", { description: "Added to Sanctioned Workflows." });
    navigate("/sanctioned");
  };

  if (!chat) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  const VisIcon = chat.sanctioned
    ? chat.sanctioned.visibility === "private"
      ? Lock
      : chat.sanctioned.visibility === "team"
        ? Users
        : Globe
    : Lock;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-12 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="h-8 -ml-2">
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-1" /> Home</Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Framed Chat</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground rounded border px-1.5 py-0.5">
              Beta
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
            <Link to="/sanctioned">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Sanctioned
            </Link>
          </Button>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <VisIcon className="h-3 w-3" />
            <span className="capitalize">
              {chat.sanctioned ? chat.sanctioned.visibility : "Private chat"}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ChatList
          chats={chats}
          activeId={chat.id}
          onSelect={(id) => navigate(`/framed-chat/${id}`)}
          onNew={handleNewChat}
          onDelete={handleDelete}
        />

        <section className="flex flex-1 flex-col border-r min-w-0">
          <div className="flex-1 overflow-auto px-6 py-6">
            <div className="mx-auto max-w-2xl space-y-5">
              {chat.messages.length === 0 ? (
                <div className="mt-24 text-center">
                  <p className="text-sm text-muted-foreground">
                    This chat is private. The five monitors on the right read what you write.
                  </p>
                </div>
              ) : (
                chat.messages.map((m) => <MessageRow key={m.id} m={m} />)
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div className="border-t bg-background/80 p-4">
            <div className="mx-auto max-w-2xl">
              <div className="rounded-lg border bg-card p-2">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={2}
                  placeholder="What are you trying to get done?"
                  className="border-0 shadow-none focus-visible:ring-0 resize-none p-2"
                />
                <div className="flex items-center justify-between px-1 pt-1">
                  <span className="text-[11px] text-muted-foreground">
                    Cmd/Ctrl + Enter to send
                  </span>
                  <Button size="sm" className="h-7" onClick={send} disabled={!draft.trim()}>
                    <Send className="h-3.5 w-3.5 mr-1.5" /> Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="w-[340px] shrink-0 overflow-auto bg-muted/20 p-3 space-y-3">
          <FrameScore
            score={score}
            tokenCount={chat.tokenCount}
            onSanction={() => setSanctionOpen(true)}
            onShare={handleShare}
            shared={shared}
            sanctioned={!!chat.sanctioned}
          />
          <div>
            <div className="px-1 pb-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Live Monitors
              </span>
            </div>
            <div className="space-y-2">
              {tiles.map((t) => (
                <FrameTile
                  key={t.id}
                  tile={t}
                  signals={signals[t.id] ?? []}
                  hasUnread={unread.has(t.id)}
                  expanded={expanded === t.id}
                  onToggle={() => handleToggle(t.id)}
                  onDefine={() => advance(t.id)}
                  onSaveSignal={handleSaveSignal(t.id)}
                  onDismissSignal={handleDismissSignal}
                  savedSignalIds={chat.savedSignalIds}
                  dismissedSignalIds={chat.dismissedSignalIds}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>

      <Dialog open={sanctionOpen} onOpenChange={setSanctionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sanction this chat as a workflow</DialogTitle>
            <DialogDescription>
              Choose who can see this sanctioned workflow. This decision is recorded with the workflow.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {(["private", "team", "org"] as Visibility[]).map((v) => {
              const Icon = v === "private" ? Lock : v === "team" ? Users : Globe;
              const label =
                v === "private"
                  ? "Private — only me"
                  : v === "team"
                    ? "Team — my immediate teammates"
                    : "Organization — anyone in the org";
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setPendingVisibility(v)}
                  className={`w-full flex items-center gap-3 rounded-md border p-3 text-left text-sm transition ${
                    pendingVisibility === v ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1">{label}</span>
                  {pendingVisibility === v && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSanctionOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSanction}>
              <ShieldCheck className="h-4 w-4 mr-1.5" /> Sanction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MessageRow({ m }: { m: StoredMessage }) {
  const tone =
    m.role === "ai"
      ? "bg-muted/40"
      : m.role === "teammate"
        ? "bg-amber-500/5 border-amber-500/20"
        : "bg-primary/5 border-primary/20";
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-semibold">
        {m.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold">{m.author}</span>
          <span className="text-[10px] text-muted-foreground">{m.ts}</span>
        </div>
        <div className={`mt-1 rounded-lg border px-3 py-2 ${tone}`}>
          <p className="text-sm leading-relaxed text-foreground/90">{m.text}</p>
        </div>
      </div>
    </div>
  );
}