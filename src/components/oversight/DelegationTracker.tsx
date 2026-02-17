import { useNavigate } from "react-router-dom";
import { Users, AlertTriangle, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ScoredFeedItem } from "@/lib/priority-scoring";

interface DelegationTrackerProps {
  items: ScoredFeedItem[];
}

export function DelegationTracker({ items }: DelegationTrackerProps) {
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border/50 bg-card p-6 text-center text-sm text-muted-foreground">
        <Users className="h-5 w-5 mx-auto mb-2 text-muted-foreground/50" />
        No delegated tasks. Tasks you assign to others will appear here.
      </div>
    );
  }

  const blocked = items.filter(i => i.status === "blocked");
  const done = items.filter(i => i.status === "done");
  const inProgress = items.filter(i => i.status === "in_progress" || i.status === "todo");

  const sections = [
    { label: "Needs Your Attention", items: blocked, color: "text-destructive", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
    { label: "Ready for Review", items: done, color: "text-success", icon: <CheckCircle className="h-3.5 w-3.5" /> },
    { label: "In Progress", items: inProgress, color: "text-info", icon: <Clock className="h-3.5 w-3.5" /> },
  ].filter(s => s.items.length > 0);

  return (
    <div className="space-y-3">
      {sections.map(section => (
        <div key={section.label}>
          <div className={`flex items-center gap-1.5 mb-2 ${section.color}`}>
            {section.icon}
            <span className="text-xs font-semibold uppercase tracking-wider">{section.label}</span>
            <Badge variant="outline" className="text-[9px] ml-1">{section.items.length}</Badge>
          </div>
          <div className="space-y-1.5">
            {section.items.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-2.5 hover:border-primary/30 transition-colors cursor-pointer group"
                onClick={() => navigate(`/workbooks/${item.workbookId}`)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground truncate">{item.workbookTitle}</span>
                    {item.assigneeName && (
                      <>
                        <span className="text-[10px] text-muted-foreground">·</span>
                        <span className="text-[10px] text-muted-foreground">Assigned to {item.assigneeName}</span>
                      </>
                    )}
                  </div>
                </div>
                <Badge
                  className={`text-[9px] ${
                    item.priority === "critical" ? "bg-destructive/10 text-destructive"
                    : item.priority === "high" ? "bg-warning/10 text-warning"
                    : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.priority}
                </Badge>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
