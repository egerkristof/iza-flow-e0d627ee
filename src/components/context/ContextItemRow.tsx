import { Badge } from "@/components/ui/badge";
import { MockContextItem } from "@/data/mockContextItems";
import { Shield, Zap, Clock } from "lucide-react";

const categoryColors: Record<string, string> = {
  DIRECTIVE: "border-destructive/40 text-destructive",
  KNOWLEDGE: "border-info/40 text-info",
  PROCEDURE: "border-success/40 text-success",
  PLAYBOOK: "border-warning/40 text-warning",
  PREFERENCE: "border-muted-foreground/40 text-muted-foreground",
};

const actionIcons: Record<string, string> = {
  OVERRIDE: "⚡",
  BLOCK: "🚫",
  APPEND: "➕",
};

interface ContextItemRowProps {
  item: MockContextItem;
  selected: boolean;
  onClick: () => void;
}

export function ContextItemRow({ item, selected, onClick }: ContextItemRowProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border p-3 transition-all ${
        selected
          ? "border-primary/40 bg-primary/5 glow-sm"
          : "border-border/50 bg-card hover:border-primary/20"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{item.title}</span>
            {item.priority === "CRITICAL" && (
              <Zap className="h-3 w-3 text-warning shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {item.content_preview}
          </p>
        </div>
        <Badge variant="outline" className={`text-[10px] shrink-0 ${categoryColors[item.category] ?? ""}`}>
          {item.category}
        </Badge>
      </div>

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="text-[10px] text-muted-foreground">
          {actionIcons[item.action_type]} {item.action_type}
        </span>
        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
          <Shield className="h-2.5 w-2.5" /> {item.security_level}
        </span>
        {item.last_used_at && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
            <Clock className="h-2.5 w-2.5" /> {item.last_used_at}
          </span>
        )}
        {item.domain_tags.map(tag => (
          <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
            {tag}
          </Badge>
        ))}
      </div>
    </button>
  );
}
