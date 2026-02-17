import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Check, X, Plus, Pencil, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface SyncOperation {
  op: "create" | "update" | "delete";
  id?: string;
  title?: string;
  category?: string;
  content_full?: string;
  parent_playbook_id?: string | null;
  /** For updates, the previous title */
  prev_title?: string;
  /** For updates, the previous content */
  prev_content?: string;
}

interface SyncConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  operations: SyncOperation[];
  summary: string;
  onConfirm: (selectedOps: SyncOperation[]) => void;
  confirming: boolean;
}

const opConfig = {
  create: { label: "Create", icon: Plus, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  update: { label: "Update", icon: Pencil, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  delete: { label: "Remove", icon: Trash2, color: "text-red-400 border-red-500/30 bg-red-500/10" },
};

function InlineDiff({ prev, next }: { prev?: string; next?: string }) {
  if (!prev && !next) return null;
  if (!prev) return <p className="text-[10px] text-emerald-400 font-mono whitespace-pre-wrap line-clamp-4">{next}</p>;
  if (!next) return <p className="text-[10px] text-red-400 font-mono whitespace-pre-wrap line-through line-clamp-4">{prev}</p>;

  return (
    <div className="space-y-1">
      <p className="text-[10px] text-red-400/70 font-mono whitespace-pre-wrap line-clamp-3 line-through">{prev.substring(0, 200)}</p>
      <p className="text-[10px] text-emerald-400 font-mono whitespace-pre-wrap line-clamp-3">{next.substring(0, 200)}</p>
    </div>
  );
}

export function SyncConfirmationDialog({
  open, onOpenChange, operations, summary, onConfirm, confirming,
}: SyncConfirmationDialogProps) {
  const [selected, setSelected] = useState<Set<number>>(() => new Set(operations.map((_, i) => i)));

  const toggle = (idx: number) => {
    const next = new Set(selected);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    setSelected(next);
  };

  const creates = operations.filter(o => o.op === "create").length;
  const updates = operations.filter(o => o.op === "update").length;
  const deletes = operations.filter(o => o.op === "delete").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Confirm Sync to Playbooks</DialogTitle>
          <p className="text-xs text-muted-foreground">{summary}</p>
          <div className="flex items-center gap-2 pt-1">
            {creates > 0 && <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">{creates} new</Badge>}
            {updates > 0 && <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/30">{updates} updated</Badge>}
            {deletes > 0 && <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/30">{deletes} removed</Badge>}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[400px]">
          <div className="space-y-1 pr-2">
            {operations.map((op, idx) => {
              const config = opConfig[op.op];
              const Icon = config.icon;
              const isSelected = selected.has(idx);
              return (
                <Collapsible key={idx}>
                  <div className={`rounded-md border ${isSelected ? "border-border/50" : "border-border/20 opacity-50"} overflow-hidden`}>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <button
                        onClick={() => toggle(idx)}
                        className={`h-4 w-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                          isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                        }`}
                      >
                        {isSelected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                      </button>
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 gap-0.5 ${config.color}`}>
                        <Icon className="h-2.5 w-2.5" /> {config.label}
                      </Badge>
                      <span className="text-xs font-medium truncate flex-1">{op.title || op.id}</span>
                      {op.category && <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">{op.category}</Badge>}
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-5 w-5 shrink-0">
                          <ChevronRight className="h-3 w-3 transition-transform [[data-state=open]_&]:rotate-90" />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="px-3 pb-2 pt-0 border-t border-border/30">
                        {op.op === "update" && (
                          <InlineDiff prev={op.prev_content || op.prev_title} next={op.content_full || op.title} />
                        )}
                        {op.op === "create" && (
                          <p className="text-[10px] text-muted-foreground font-mono whitespace-pre-wrap line-clamp-4 mt-1">
                            {op.content_full?.substring(0, 300)}
                          </p>
                        )}
                        {op.op === "delete" && (
                          <p className="text-[10px] text-red-400/70 font-mono mt-1">This item will be soft-deleted.</p>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={confirming}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => onConfirm(operations.filter((_, i) => selected.has(i)))}
            disabled={confirming || selected.size === 0}
            className="gap-1"
          >
            {confirming ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
            Apply {selected.size} change{selected.size !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
