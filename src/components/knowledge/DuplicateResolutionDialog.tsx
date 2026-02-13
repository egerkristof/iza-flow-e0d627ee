import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryBadge } from "@/components/knowledge/CategoryBadge";
import { AlertTriangle, GitMerge, Replace, Copy, X } from "lucide-react";
import { mergeContent, type DuplicateMatch } from "@/lib/dedup";
import { cn } from "@/lib/utils";

export type ResolutionAction = "merge" | "replace" | "keep_both" | "cancel";

export interface ResolutionResult {
  action: ResolutionAction;
  targetId?: string; // existing item to merge into / replace
  mergedContent?: string;
}

interface DuplicateResolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newItem: { title: string; content: string; category: string };
  matches: DuplicateMatch[];
  onResolve: (result: ResolutionResult) => void;
}

export function DuplicateResolutionDialog({
  open,
  onOpenChange,
  newItem,
  matches,
  onResolve,
}: DuplicateResolutionDialogProps) {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(
    matches[0]?.id ?? null,
  );

  const selected = matches.find((m) => m.id === selectedMatch);

  const handleMerge = () => {
    if (!selected) return;
    const merged = mergeContent(selected.content_full, newItem.content);
    onResolve({ action: "merge", targetId: selected.id, mergedContent: merged });
  };

  const handleReplace = () => {
    if (!selected) return;
    onResolve({ action: "replace", targetId: selected.id });
  };

  const handleKeepBoth = () => {
    onResolve({ action: "keep_both" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Duplicate Detected
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground">
          We found {matches.length} existing item{matches.length !== 1 ? "s" : ""} similar to "{newItem.title}".
          Choose how to proceed.
        </p>

        {/* Match selector (if multiple) */}
        {matches.length > 1 && (
          <div className="flex gap-1.5 flex-wrap">
            {matches.map((m) => (
              <Badge
                key={m.id}
                variant={selectedMatch === m.id ? "default" : "outline"}
                className="text-[10px] cursor-pointer"
                onClick={() => setSelectedMatch(m.id)}
              >
                {m.title}
                {m.similarity === "exact" && (
                  <span className="ml-1 text-destructive">exact</span>
                )}
              </Badge>
            ))}
          </div>
        )}

        {/* Side-by-side diff */}
        <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
          {/* Existing */}
          <div className="rounded-md border border-border/50 flex flex-col">
            <div className="p-2 border-b border-border/30 flex items-center justify-between">
              <span className="text-xs font-medium">Existing Item</span>
              {selected && (
                <div className="flex items-center gap-1">
                  <CategoryBadge category={selected.category} />
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px]",
                      selected.similarity === "exact"
                        ? "border-destructive/30 text-destructive"
                        : "border-warning/30 text-warning",
                    )}
                  >
                    {selected.similarity}
                  </Badge>
                </div>
              )}
            </div>
            <ScrollArea className="flex-1 p-2">
              {selected ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium">{selected.title}</p>
                  <p className="text-[11px] text-muted-foreground whitespace-pre-wrap">
                    {selected.content_full}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Select a match</p>
              )}
            </ScrollArea>
          </div>

          {/* New */}
          <div className="rounded-md border border-primary/20 flex flex-col">
            <div className="p-2 border-b border-border/30 flex items-center justify-between">
              <span className="text-xs font-medium">New Item</span>
              <CategoryBadge category={newItem.category} />
            </div>
            <ScrollArea className="flex-1 p-2">
              <div className="space-y-2">
                <p className="text-xs font-medium">{newItem.title}</p>
                <p className="text-[11px] text-muted-foreground whitespace-pre-wrap">
                  {newItem.content}
                </p>
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => {
              onResolve({ action: "cancel" });
              onOpenChange(false);
            }}
          >
            <X className="h-3 w-3" /> Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={handleKeepBoth}
          >
            <Copy className="h-3 w-3" /> Keep Both
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={handleReplace}
            disabled={!selected}
          >
            <Replace className="h-3 w-3" /> Replace Existing
          </Button>
          <Button
            size="sm"
            className="gap-1.5 text-xs"
            onClick={handleMerge}
            disabled={!selected}
          >
            <GitMerge className="h-3 w-3" /> Merge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
