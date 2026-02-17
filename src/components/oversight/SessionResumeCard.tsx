import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Target, Clock, ArrowRight, Zap, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getStaleness, getStalenessColor, type ScoredFeedItem } from "@/lib/priority-scoring";
import { formatDistanceToNow } from "date-fns";

function formatRelative(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return "—";
  }
}

interface SessionResumeCardProps {
  item: ScoredFeedItem;
}

export function SessionResumeCard({ item }: SessionResumeCardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const staleness = getStaleness(item.updatedAt);
  const stalenessColor = getStalenessColor(staleness);
  const progress = item.totalSteps && item.totalSteps > 0
    ? ((item.completedSteps ?? 0) / item.totalSteps) * 100
    : 0;

  // Auto-trigger summary generation for sessions without one
  const generateSummary = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("summarize-session", {
        body: { execution_id: item.executionId ?? item.id },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nerve-center-sessions"] });
    },
  });

  // Auto-generate summary if missing
  useEffect(() => {
    if (!item.sessionSummary && item.executionId && !generateSummary.isPending && !generateSummary.isSuccess) {
      generateSummary.mutate();
    }
  }, [item.sessionSummary, item.executionId]);

  return (
    <div
      className="rounded-lg border border-border/50 bg-card p-4 hover:border-primary/30 transition-all cursor-pointer group"
      onClick={() => navigate(`/workbooks/${item.workbookId}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary shrink-0" />
          <div>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{item.workbookTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`text-[9px] capitalize ${
              item.status === "in_progress" ? "border-info/30 text-info"
              : item.status === "paused" ? "border-warning/30 text-warning"
              : "border-border text-muted-foreground"
            }`}
          >
            {item.status.replace("_", " ")}
          </Badge>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Progress */}
      {item.totalSteps && item.totalSteps > 0 && (
        <div className="flex items-center gap-2 mt-3">
          <Progress value={progress} className="h-1.5 flex-1" />
          <span className="text-[10px] text-muted-foreground shrink-0">
            {item.completedSteps ?? 0}/{item.totalSteps} steps
          </span>
        </div>
      )}

      {/* Drift warning */}
      {(item.driftScore ?? 0) > 0.3 && (
        <div className="flex items-center gap-1 mt-2">
          <Zap className="h-3 w-3 text-warning" />
          <span className="text-[10px] text-warning">Drift: {Math.round((item.driftScore ?? 0) * 100)}%</span>
        </div>
      )}

      {/* AI summary */}
      {item.sessionSummary ? (
        <p className="text-[11px] text-muted-foreground italic mt-2 line-clamp-2">
          {item.sessionSummary}
        </p>
      ) : generateSummary.isPending ? (
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Generating summary…
        </div>
      ) : null}

      {/* Footer */}
      <div className={`flex items-center gap-1 mt-2 text-[10px] ${stalenessColor}`}>
        <Clock className="h-3 w-3" />
        Last active {formatRelative(item.updatedAt)}
      </div>
    </div>
  );
}
