import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FrameTile } from "@/components/frame/FrameTile";
import { FrameScore } from "@/components/frame/FrameScore";
import {
  INITIAL_TILES,
  frameScore,
  nextStatus,
  deriveSignals,
  type ConditionTile,
  type CopilotSignal,
  type TileId,
} from "@/components/frame/frame-data";

interface Message {
  id: string;
  author: string;
  initials: string;
  role: "user" | "ai" | "teammate";
  text: string;
  ts: string;
}

const SEED_MESSAGES: Message[] = [
  {
    id: "m1",
    author: "You",
    initials: "YO",
    role: "user",
    text: "Let's draft an outbound campaign to 50 enterprise CFOs about our new metered AI pricing. Use the call transcripts from last week.",
    ts: "09:14",
  },
  {
    id: "m2",
    author: "AI",
    initials: "AI",
    role: "ai",
    text: "Ready to draft. I can see the campaign scope and the transcript reference. Check the monitors on the right — a few conditions need your attention before the output is sanction-ready.",
    ts: "09:14",
  },
  {
    id: "m3",
    author: "Maya (Legal)",
    initials: "MA",
    role: "teammate",
    text: "Before this goes out we need the EU AI Act risk tier bound and a CFO-comms disclosure clause. Can we set that now?",
    ts: "09:16",
  },
];

const TOKENS_PER_MESSAGE = 250;
const SEED_TOKEN_COUNT = SEED_MESSAGES.length * TOKENS_PER_MESSAGE;
const MAX_UNREAD = 2;

export default function FramedChatPage() {
  const [tiles, setTiles] = useState<ConditionTile[]>(INITIAL_TILES);
  const [expanded, setExpanded] = useState<TileId | null>("compliance");
  const [messages, setMessages] = useState<Message[]>(SEED_MESSAGES);
  const [draft, setDraft] = useState("");
  const [tokenCount, setTokenCount] = useState(SEED_TOKEN_COUNT);
  const [signals, setSignals] = useState<Record<TileId, CopilotSignal[]>>(() =>
    Object.fromEntries(
      INITIAL_TILES.map((t) => [t.id, deriveSignals(t.id, SEED_MESSAGES)]),
    ) as Record<TileId, CopilotSignal[]>,
  );
  const [unread, setUnread] = useState<Set<TileId>>(() => {
    const ids = INITIAL_TILES.map((t) => t.id).filter(
      (id) => deriveSignals(id, SEED_MESSAGES).length > 0,
    );
    return new Set(ids.slice(0, MAX_UNREAD) as TileId[]);
  });

  const score = useMemo(() => frameScore(tiles), [tiles]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const advance = (id: TileId) => {
    setTiles((prev) =>
      prev.map((t) => (t.id !== id ? t : { ...t, status: nextStatus(t.status) })),
    );
  };

  const handleToggle = (id: TileId) => {
    setExpanded((prev) => (prev === id ? null : id));
    setUnread((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = {
      id: crypto.randomUUID(),
      author: "You",
      initials: "YO",
      role: "user",
      text,
      ts,
    };
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setTokenCount((c) => c + TOKENS_PER_MESSAGE);
    setDraft("");

    // Re-derive signals and apply WIP limit for unread
    const newUnread: TileId[] = [];
    const newSignals: Record<TileId, CopilotSignal[]> = { ...signals };
    for (const tile of INITIAL_TILES) {
      const prev = signals[tile.id];
      const next = deriveSignals(tile.id, updatedMessages);
      newSignals[tile.id] = next;
      if (next.length > prev.length && expanded !== tile.id) {
        newUnread.push(tile.id);
      }
    }
    setSignals(newSignals);
    setUnread((prev) => {
      const combined = new Set([...prev, ...newUnread]);
      const limited = [...combined].slice(0, MAX_UNREAD);
      return new Set(limited as TileId[]);
    });
  };

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
              Prototype
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>You · Maya (Legal) · Jonas (Finance)</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat column */}
        <section className="flex flex-1 flex-col border-r min-w-0">
          <div className="flex-1 overflow-auto px-6 py-6">
            <div className="mx-auto max-w-2xl space-y-5">
              <div className="rounded-lg border border-dashed bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Campaign · Q2 CFO Outbound
                </p>
                <p className="text-sm text-foreground/80">
                  The five monitors on the right read this conversation and surface what is defined,
                  what is missing, and what to do next.
                </p>
              </div>
              {messages.map((m) => (
                <MessageRow key={m.id} m={m} />
              ))}
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
                  placeholder="Chat here. The five monitors on the right read what you write."
                  className="border-0 shadow-none focus-visible:ring-0 resize-none p-2"
                />
                <div className="flex items-center justify-between px-1 pt-1">
                  <span className="text-[11px] text-muted-foreground">Cmd/Ctrl + Enter to send</span>
                  <Button size="sm" className="h-7" onClick={send} disabled={!draft.trim()}>
                    <Send className="h-3.5 w-3.5 mr-1.5" /> Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conditions rail */}
        <aside className="w-[340px] shrink-0 overflow-auto bg-muted/20 p-3 space-y-3">
          <FrameScore score={score} tokenCount={tokenCount} onSanction={() =>
            toast.success("Chat sanctioned", {
              description: "This conversation is now a reusable workflow.",
            })
          } />
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
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MessageRow({ m }: { m: Message }) {
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
