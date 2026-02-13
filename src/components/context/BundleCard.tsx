import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MockBundle } from "@/data/mockContextItems";
import { Pencil, Trash2 } from "lucide-react";

const scopeColors: Record<string, string> = {
  org: "border-warning/30 text-warning",
  domain: "border-info/30 text-info",
  team: "border-success/30 text-success",
  draft: "border-muted-foreground/30 text-muted-foreground",
};

interface BundleCardProps {
  bundle: MockBundle;
  selected: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function BundleCard({ bundle, selected, onClick, onEdit, onDelete }: BundleCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg border p-4 space-y-2 transition-all ${
        selected
          ? "border-primary/40 bg-primary/5 glow-sm"
          : "border-border/50 bg-card hover:border-primary/20"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium truncate">{bundle.title}</h4>
            <Badge variant="outline" className="text-[10px] font-mono">{bundle.version}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{bundle.description}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant="outline" className={`text-[10px] ${scopeColors[bundle.scope_level] ?? ""}`}>
          {bundle.scope_level}
        </Badge>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{bundle.item_count} items</span>
          <span className={bundle.health_score > 0.8 ? "text-emerald-400" : bundle.health_score >= 0.5 ? "text-yellow-400" : "text-red-400"}>
            {Math.round(bundle.health_score * 100)}%
          </span>
        </div>
      </div>

      <div className="h-1 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${bundle.health_score > 0.8 ? "bg-success" : bundle.health_score > 0.6 ? "bg-warning" : "bg-destructive"}`}
          style={{ width: `${bundle.health_score * 100}%` }}
        />
      </div>

      <div className="flex gap-1 flex-wrap">
        {bundle.domain_tags.map(tag => (
          <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0 h-4">{tag}</Badge>
        ))}
      </div>
    </div>
  );
}
