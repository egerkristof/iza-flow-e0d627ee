import { useNavigate } from "react-router-dom";
import { Zap, ArrowRight, Clock, Target, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScoredFeedItem } from "@/lib/priority-scoring";
import { formatDistanceToNow } from "date-fns";

interface WhereYouLeftOffProps {
  item: ScoredFeedItem;
}

export function WhereYouLeftOff({ item }: WhereYouLeftOffProps) {
  const navigate = useNavigate();

  const typeIcon = item.type === "session" ? (
    <Target className="h-5 w-5 text-primary" />
  ) : (
    <ListTodo className="h-5 w-5 text-info" />
  );

  let timeAgo = "—";
  try { timeAgo = formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true }); } catch {}

  return (
    <div className="rounded-lg border-r border-t border-b border-primary/20 border-l-2 border-l-primary bg-primary/5 p-4 glow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-4 w-4 text-primary" />
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary">
          Active Protocol
        </span>
        <span className="ml-auto inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-widest uppercase text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse inline-block" />
          Protocol Active
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {typeIcon}
          <div>
            <p className="text-sm font-medium">{item.title}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-muted-foreground">{item.workbookTitle}</span>
              {item.type === "session" && item.totalSteps && (
                <>
                  <span className="text-[11px] text-muted-foreground">·</span>
                  <span className="text-[11px] text-primary">Step {item.completedSteps ?? 0}/{item.totalSteps}</span>
                </>
              )}
              <span className="text-[11px] text-muted-foreground">·</span>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> {timeAgo}
              </span>
            </div>
            {item.sessionSummary && (
              <p className="text-[11px] text-muted-foreground italic mt-1 max-w-lg">
                {item.sessionSummary}
              </p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="brand"
          className="shrink-0"
          onClick={() => navigate(`/workbooks/${item.workbookId}`)}
        >
          Resume <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
