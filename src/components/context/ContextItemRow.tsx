import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockContextItem } from "@/data/mockContextItems";
import { Shield, Zap, Clock, MoreVertical, Pencil } from "lucide-react";
import { DeleteDisambiguation } from "@/components/governance/DeleteDisambiguation";
import { CategoryBadge } from "@/components/knowledge/CategoryBadge";

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
  onEdit?: (item: MockContextItem) => void;
  onDestroy?: (item: MockContextItem) => void;
}

export function ContextItemRow({ item, selected, onClick, onEdit, onDestroy }: ContextItemRowProps) {
  return (
    <div
      onClick={onClick}
      className={`w-full text-left rounded-lg border p-3 transition-all cursor-pointer ${
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
        <div className="flex items-center gap-1 shrink-0">
          <CategoryBadge category={item.category} />
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              style={{ opacity: selected ? 1 : 0 }}
              onClick={e => { e.stopPropagation(); onEdit(item); }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          )}
          <DeleteDisambiguation itemTitle={item.title} onDestroy={() => onDestroy?.(item)}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
              style={{ opacity: selected ? 1 : undefined }}
              onClick={e => e.stopPropagation()}
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DeleteDisambiguation>
        </div>
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
    </div>
  );
}
