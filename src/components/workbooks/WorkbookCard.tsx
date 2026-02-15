import { MessageSquare, Users, Clock, MoreHorizontal, Trash2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface WorkbookCardData {
  id: string;
  title: string;
  description: string;
  status: "draft" | "active" | "review" | "completed" | "archived";
  driftScore: number;
  memberAvatars: string[];
  commentCount: number;
  updatedAt: string;
  strategicOutcome: string | null;
  lockedPlaybook: string | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
  active: { label: "Active", className: "bg-primary/15 text-primary border-primary/30" },
  review: { label: "Review", className: "bg-warning/15 text-warning border-warning/30" },
  completed: { label: "Done", className: "bg-success/15 text-success border-success/30" },
  archived: { label: "Archived", className: "bg-muted text-muted-foreground" },
};

export function WorkbookCard({
  workbook,
  onClick,
  onDelete,
}: {
  workbook: WorkbookCardData;
  onClick: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const st = statusConfig[workbook.status] ?? statusConfig.draft;
  const driftColor =
    workbook.driftScore < 0.2
      ? "bg-success"
      : workbook.driftScore < 0.5
      ? "bg-warning"
      : "bg-destructive";

  return (
    <button
      onClick={() => onClick(workbook.id)}
      className="group flex flex-col justify-between rounded-lg border border-border/50 bg-card p-5 text-left transition-all hover:border-primary/30 hover:glow-sm min-h-[180px]"
    >
      {/* Top section */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-tight line-clamp-2">{workbook.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onClick(workbook.id)}>
                <ExternalLink className="h-3.5 w-3.5 mr-2" /> Open
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(workbook.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {workbook.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {workbook.description}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={`text-[10px] ${st.className}`}>
            {st.label}
          </Badge>
          {workbook.lockedPlaybook && (
            <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">
              🔒 {workbook.lockedPlaybook}
            </Badge>
          )}
          {workbook.driftScore > 0 && (
            <span
              className={`h-2 w-2 rounded-full ${driftColor}`}
              title={`Drift: ${Math.round(workbook.driftScore * 100)}%`}
            />
          )}
        </div>
      </div>

      {/* Bottom section — metadata */}
      <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3">
        <div className="flex items-center gap-3">
          {/* Member avatars */}
          <div className="flex -space-x-1.5">
            {workbook.memberAvatars.slice(0, 3).map((initials, i) => (
              <div
                key={i}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-secondary text-[9px] font-medium text-secondary-foreground"
              >
                {initials}
              </div>
            ))}
            {workbook.memberAvatars.length > 3 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[9px] text-muted-foreground">
                +{workbook.memberAvatars.length - 3}
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3" />
            <span>{workbook.commentCount}</span>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{workbook.updatedAt}</span>
        </div>
      </div>
    </button>
  );
}
