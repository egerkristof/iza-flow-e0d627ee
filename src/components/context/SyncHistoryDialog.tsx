import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Clock, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MarkdownPreview } from "@/components/context/MarkdownPreview";
import { format } from "date-fns";

interface SyncHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bundleId: string;
  bundleTitle: string;
}

export function SyncHistoryDialog({ open, onOpenChange, bundleId, bundleTitle }: SyncHistoryDialogProps) {
  const [viewingSnapshot, setViewingSnapshot] = useState<string | null>(null);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["sync-history", bundleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_sync_logs")
        .select("*")
        .eq("bundle_id", bundleId)
        .order("synced_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data || [];
    },
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Sync History — {bundleTitle}
          </DialogTitle>
        </DialogHeader>

        {viewingSnapshot ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Document snapshot</span>
              <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setViewingSnapshot(null)}>
                ← Back to list
              </Button>
            </div>
            <ScrollArea className="h-[400px] rounded-md border border-border/30 bg-card/50">
              <div className="p-4">
                <MarkdownPreview content={viewingSnapshot} />
              </div>
            </ScrollArea>
          </div>
        ) : (
          <ScrollArea className="max-h-[450px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground text-xs">
                <Loader2 className="h-3 w-3 animate-spin" /> Loading…
              </div>
            ) : logs.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No sync history yet. Changes will appear here after you sync to playbooks.
              </div>
            ) : (
              <div className="space-y-2 pr-2">
                {logs.map((log: any) => {
                  const changeset = log.changeset || {};
                  const ops = changeset.operations || [];
                  return (
                    <div key={log.id} className="rounded-md border border-border/50 overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 bg-card/50">
                        <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-xs font-medium">
                          {format(new Date(log.synced_at), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                        <div className="flex-1" />
                        <div className="flex items-center gap-1">
                          {log.items_created > 0 && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 gap-0.5 text-emerald-400 border-emerald-500/30">
                              <Plus className="h-2 w-2" /> {log.items_created}
                            </Badge>
                          )}
                          {log.items_updated > 0 && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 gap-0.5 text-amber-400 border-amber-500/30">
                              <Pencil className="h-2 w-2" /> {log.items_updated}
                            </Badge>
                          )}
                          {log.items_deleted > 0 && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 gap-0.5 text-red-400 border-red-500/30">
                              <Trash2 className="h-2 w-2" /> {log.items_deleted}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 shrink-0"
                          onClick={() => setViewingSnapshot(log.document_snapshot)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                      {log.summary && (
                        <div className="px-3 py-1.5 border-t border-border/30">
                          <p className="text-[10px] text-muted-foreground">{log.summary}</p>
                        </div>
                      )}
                      {ops.length > 0 && (
                        <div className="px-3 py-1.5 border-t border-border/30 space-y-0.5">
                          {ops.slice(0, 5).map((op: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10px]">
                              {op.op === "create" && <Plus className="h-2.5 w-2.5 text-emerald-400" />}
                              {op.op === "update" && <Pencil className="h-2.5 w-2.5 text-amber-400" />}
                              {op.op === "delete" && <Trash2 className="h-2.5 w-2.5 text-red-400" />}
                              <span className="text-muted-foreground truncate">{op.title || op.id}</span>
                            </div>
                          ))}
                          {ops.length > 5 && (
                            <span className="text-[9px] text-muted-foreground">…and {ops.length - 5} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
