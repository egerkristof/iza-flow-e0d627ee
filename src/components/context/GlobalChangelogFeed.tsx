import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Clock, Plus, Pencil, Trash2, ChevronDown, ChevronRight, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, formatDistanceToNow } from "date-fns";

interface GlobalChangelogFeedProps {
  /** Map of bundle IDs to titles for display */
  bundleTitles: Map<string, string>;
}

export function GlobalChangelogFeed({ bundleTitles }: GlobalChangelogFeedProps) {
  const [open, setOpen] = useState(false);

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["global-sync-changelog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("document_sync_logs")
        .select("*")
        .order("synced_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data || [];
    },
    refetchInterval: open ? 30000 : false,
  });

  const totalChanges = logs.reduce(
    (acc, l) => acc + (l.items_created || 0) + (l.items_updated || 0) + (l.items_deleted || 0),
    0
  );

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className="flex items-center gap-2 w-full rounded-lg border border-border/40 bg-card/50 px-3 py-2 hover:bg-secondary/30 transition-colors text-left">
          <Activity className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs font-medium text-foreground">Change Feed</span>
          {logs.length > 0 && (
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
              {logs.length} syncs · {totalChanges} changes
            </Badge>
          )}
          <div className="flex-1" />
          {open ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 rounded-lg border border-border/30 bg-card/30 overflow-hidden">
          {isLoading ? (
            <div className="py-4 text-center text-xs text-muted-foreground">Loading…</div>
          ) : logs.length === 0 ? (
            <div className="py-4 text-center text-xs text-muted-foreground">
              No sync history yet. Changes will appear here after you sync documents to playbooks.
            </div>
          ) : (
            <ScrollArea className="max-h-[250px]">
              <div className="divide-y divide-border/20">
                {logs.map((log) => {
                  const bundleTitle = bundleTitles.get(log.bundle_id) || "Unknown domain";
                  const changeset = (log.changeset as any) || {};
                  const ops = changeset.operations || [];
                  const timeAgo = formatDistanceToNow(new Date(log.synced_at), { addSuffix: true });

                  return (
                    <div key={log.id} className="px-3 py-2 hover:bg-secondary/10 transition-colors">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground shrink-0" />
                        <span className="text-[11px] font-medium text-foreground truncate">
                          {bundleTitle}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo}</span>
                        <div className="flex-1" />
                        <div className="flex items-center gap-1 shrink-0">
                          {(log.items_created || 0) > 0 && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 gap-0.5 text-emerald-400 border-emerald-500/30">
                              <Plus className="h-2 w-2" /> {log.items_created}
                            </Badge>
                          )}
                          {(log.items_updated || 0) > 0 && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 gap-0.5 text-amber-400 border-amber-500/30">
                              <Pencil className="h-2 w-2" /> {log.items_updated}
                            </Badge>
                          )}
                          {(log.items_deleted || 0) > 0 && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 gap-0.5 text-red-400 border-red-500/30">
                              <Trash2 className="h-2 w-2" /> {log.items_deleted}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {log.summary && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 ml-5 line-clamp-1">
                          {log.summary}
                        </p>
                      )}
                      {ops.length > 0 && (
                        <div className="ml-5 mt-1 space-y-0.5">
                          {ops.slice(0, 3).map((op: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5 text-[10px]">
                              {op.op === "create" && <Plus className="h-2.5 w-2.5 text-emerald-400" />}
                              {op.op === "update" && <Pencil className="h-2.5 w-2.5 text-amber-400" />}
                              {op.op === "delete" && <Trash2 className="h-2.5 w-2.5 text-red-400" />}
                              <span className="text-muted-foreground truncate">{op.title || op.id}</span>
                            </div>
                          ))}
                          {ops.length > 3 && (
                            <span className="text-[9px] text-muted-foreground ml-4">…and {ops.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
