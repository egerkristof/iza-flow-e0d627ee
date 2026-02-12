import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowRight, FileEdit, Play, Eye, CheckCircle, Archive } from "lucide-react";
import { toast } from "sonner";

type WorkbookStatus = "draft" | "active" | "review" | "completed" | "archived";

interface StatusConfig {
  label: string;
  color: string;
  icon: React.ReactNode;
  description: string;
}

const STATUS_CONFIG: Record<WorkbookStatus, StatusConfig> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground", icon: <FileEdit className="h-3 w-3" />, description: "Setup phase — defining scope, protocols, and team." },
  active: { label: "Active", color: "bg-info/10 text-info", icon: <Play className="h-3 w-3" />, description: "Live execution — tasks running, drift tracked." },
  review: { label: "Review", color: "bg-warning/10 text-warning", icon: <Eye className="h-3 w-3" />, description: "Paused for assessment and quality check." },
  completed: { label: "Completed", color: "bg-success/10 text-success", icon: <CheckCircle className="h-3 w-3" />, description: "Outcome achieved — preserved as reference." },
  archived: { label: "Archived", color: "bg-muted text-muted-foreground/60", icon: <Archive className="h-3 w-3" />, description: "Hidden from active views, kept for audit." },
};

// Allowed transitions from each status
const TRANSITIONS: Record<WorkbookStatus, WorkbookStatus[]> = {
  draft: ["active"],
  active: ["review", "completed"],
  review: ["active", "completed"],
  completed: ["archived"],
  archived: [],
};

interface WorkbookStatusTransitionProps {
  workbookId: string;
  currentStatus: WorkbookStatus;
  isOwner: boolean;
  onStatusChanged?: (newStatus: WorkbookStatus) => void;
}

export function WorkbookStatusTransition({ workbookId, currentStatus, isOwner, onStatusChanged }: WorkbookStatusTransitionProps) {
  const [confirmTarget, setConfirmTarget] = useState<WorkbookStatus | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newStatus: WorkbookStatus) => {
      const { error } = await supabase
        .from("workbooks")
        .update({ status: newStatus })
        .eq("id", workbookId);
      if (error) throw error;
      return newStatus;
    },
    onSuccess: (newStatus) => {
      toast.success(`Workbook moved to ${STATUS_CONFIG[newStatus].label}`);
      queryClient.invalidateQueries({ queryKey: ["workbook", workbookId] });
      queryClient.invalidateQueries({ queryKey: ["oversight-tasks"] });
      onStatusChanged?.(newStatus);
    },
    onError: () => {
      toast.error("Failed to update workbook status");
    },
  });

  const availableTransitions = TRANSITIONS[currentStatus];
  const current = STATUS_CONFIG[currentStatus];

  return (
    <>
      <div className="flex items-center gap-2">
        <Badge className={`text-[10px] gap-1 ${current.color}`}>
          {current.icon} {current.label}
        </Badge>

        {isOwner && availableTransitions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2">
                Move to <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {availableTransitions.map((target) => {
                const cfg = STATUS_CONFIG[target];
                return (
                  <DropdownMenuItem key={target} onClick={() => setConfirmTarget(target)} className="gap-2 text-xs">
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    {cfg.icon}
                    {cfg.label}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <AlertDialog open={!!confirmTarget} onOpenChange={(open) => !open && setConfirmTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base">
              Move workbook to {confirmTarget ? STATUS_CONFIG[confirmTarget].label : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Badge className={`text-[10px] gap-1 ${current.color}`}>{current.icon} {current.label}</Badge>
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                {confirmTarget && (
                  <Badge className={`text-[10px] gap-1 ${STATUS_CONFIG[confirmTarget].color}`}>
                    {STATUS_CONFIG[confirmTarget].icon} {STATUS_CONFIG[confirmTarget].label}
                  </Badge>
                )}
              </div>
              <p>{confirmTarget ? STATUS_CONFIG[confirmTarget].description : ""}</p>
              {confirmTarget === "archived" && (
                <p className="text-destructive text-xs font-medium">
                  Archived workbooks are hidden from all active views. This can be undone from the database.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (confirmTarget) mutation.mutate(confirmTarget); setConfirmTarget(null); }}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Updating…" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
