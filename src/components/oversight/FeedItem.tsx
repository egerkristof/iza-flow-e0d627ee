import { useNavigate } from "react-router-dom";
import {
  Clock, AlertTriangle, CheckCircle, ListTodo, Play, Users, ArrowRight,
  Zap, Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  type ScoredFeedItem, getStaleness, getStalenessColor,
} from "@/lib/priority-scoring";
import { formatDistanceToNow } from "date-fns";

function getActionSummary(item: ScoredFeedItem): string {
  if (item.type === "session") {
    const progress = item.totalSteps ? `${item.completedSteps ?? 0}/${item.totalSteps} steps done` : "";
    const who = item.protocolTitle ? `Protocol: ${item.protocolTitle}` : "";
    const parts = [who, progress].filter(Boolean);
    if (item.status === "paused") return `Resume session — ${parts.join(" · ")}`;
    if (item.status === "in_progress") return `Continue working — ${parts.join(" · ")}`;
    return `Start session — ${parts.join(" · ")}`;
  }
  if (item.type === "delegation") {
    const who = item.assigneeName ? `Assigned to ${item.assigneeName}` : "Delegated";
    if (item.status === "done") return `${who} — review their completed work`;
    if (item.status === "blocked") return `${who} — needs your help to unblock`;
    return `${who} — awaiting progress`;
  }
  // task
  if (item.status === "blocked") return `Unblock this task in ${item.workbookTitle}`;
  if (item.status === "in_progress") return `Continue working on this task`;
  if (item.status === "todo") return `Pick up this task in ${item.workbookTitle}`;
  return `Review this task`;
}

function formatRelative(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "—";
  }
}

const statusIcons: Record<string, React.ReactNode> = {
  todo: <ListTodo className="h-4 w-4" />,
  in_progress: <Clock className="h-4 w-4" />,
  blocked: <AlertTriangle className="h-4 w-4" />,
  done: <CheckCircle className="h-4 w-4" />,
  not_started: <Play className="h-4 w-4" />,
  paused: <Clock className="h-4 w-4" />,
  completed: <CheckCircle className="h-4 w-4" />,
};

const statusColors: Record<string, string> = {
  todo: "text-muted-foreground",
  in_progress: "text-info",
  blocked: "text-destructive",
  done: "text-success",
  not_started: "text-muted-foreground",
  paused: "text-warning",
  completed: "text-success",
};

export function FeedItem({ item }: { item: ScoredFeedItem }) {
  const navigate = useNavigate();
  const staleness = getStaleness(item.updatedAt);
  const stalenessColor = getStalenessColor(staleness);

  const typeIcon = item.type === "session" ? (
    <Target className="h-4 w-4 text-primary" />
  ) : item.type === "delegation" ? (
    <Users className="h-4 w-4 text-accent-foreground" />
  ) : (
    <ListTodo className="h-4 w-4 text-info" />
  );

  const typeLabel = item.type === "session" ? "Session" : item.type === "delegation" ? "Delegated" : "Task";

  const handleClick = () => {
    navigate(`/workbooks/${item.workbookId}`);
  };

  return (
    <div
      className="flex items-center gap-3 rounded-lg border border-border/50 bg-card px-4 py-3 hover:border-primary/30 transition-colors cursor-pointer group"
      onClick={handleClick}
    >
      {/* Score indicator */}
      <div className="flex flex-col items-center gap-0.5 shrink-0 w-10">
        <span className={`text-xs font-bold ${item.score >= 60 ? "text-destructive" : item.score >= 30 ? "text-warning" : "text-muted-foreground"}`}>
          {item.score}
        </span>
        <div className="h-1 w-8 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full ${item.score >= 60 ? "bg-destructive" : item.score >= 30 ? "bg-warning" : "bg-muted-foreground"}`}
            style={{ width: `${item.score}%` }}
          />
        </div>
      </div>

      {/* Status icon */}
      <div className={statusColors[item.status] ?? "text-muted-foreground"}>
        {statusIcons[item.status] ?? <ListTodo className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{item.title}</p>
          {item.priority && (
            <Badge
              className={`text-[9px] shrink-0 ${
                item.priority === "critical"
                  ? "bg-destructive/10 text-destructive"
                  : item.priority === "high"
                    ? "bg-warning/10 text-warning"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {item.priority}
            </Badge>
          )}
        </div>

        {/* Action summary line */}
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
          {getActionSummary(item)}
        </p>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            {typeIcon}
            {typeLabel}
          </span>
          <span className="text-[10px] text-muted-foreground">·</span>
          <span className="text-[10px] text-muted-foreground truncate">{item.workbookTitle}</span>
          {item.type === "session" && item.totalSteps && (
            <>
              <span className="text-[10px] text-muted-foreground">·</span>
              <span className="text-[10px] text-primary">
                Step {item.completedSteps ?? 0}/{item.totalSteps}
              </span>
            </>
          )}
          {item.type === "delegation" && item.assigneeName && (
            <>
              <span className="text-[10px] text-muted-foreground">·</span>
              <span className="text-[10px] text-muted-foreground">→ {item.assigneeName}</span>
            </>
          )}
        </div>
        {/* Session progress bar */}
        {item.type === "session" && item.totalSteps && item.totalSteps > 0 && (
          <Progress
            value={((item.completedSteps ?? 0) / item.totalSteps) * 100}
            className="h-1 mt-1.5"
          />
        )}
        {/* AI summary preview */}
        {item.sessionSummary && (
          <p className="text-[11px] text-muted-foreground italic mt-1 line-clamp-1">
            {item.sessionSummary}
          </p>
        )}
      </div>

      {/* Staleness + action */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-[10px] flex items-center gap-1 ${stalenessColor}`}>
          <Clock className="h-3 w-3" />
          {formatRelative(item.updatedAt)}
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
