import { Plus, MessageSquare, Trash2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StoredChat } from "./chat-storage";

interface Props {
  chats: StoredChat[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

function relTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function ChatList({ chats, activeId, onSelect, onNew, onDelete }: Props) {
  return (
    <div className="flex h-full w-[220px] shrink-0 flex-col border-r bg-muted/10">
      <div className="border-b p-2">
        <Button size="sm" variant="outline" className="w-full h-8 text-xs justify-start" onClick={onNew}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> New chat
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-1">
        {chats.length === 0 ? (
          <p className="px-2 py-3 text-[11px] text-muted-foreground">No chats yet.</p>
        ) : (
          <ul className="space-y-0.5">
            {chats.map((c) => {
              const active = c.id === activeId;
              return (
                <li key={c.id}>
                  <div
                    className={cn(
                      "group flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs cursor-pointer",
                      active ? "bg-primary/10 text-foreground" : "hover:bg-muted text-foreground/80",
                    )}
                    onClick={() => onSelect(c.id)}
                  >
                    {c.sanctioned ? (
                      <Lock className="h-3 w-3 shrink-0 text-emerald-600" />
                    ) : (
                      <MessageSquare className="h-3 w-3 shrink-0 text-muted-foreground" />
                    )}
                    <span className="flex-1 truncate">{c.title}</span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {relTime(c.updatedAt)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete chat"
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}