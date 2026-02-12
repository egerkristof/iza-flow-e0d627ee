import { Pin, LogOut, Archive, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface DeleteDisambiguationProps {
  itemTitle: string;
  onUnpin?: () => void;
  onEject?: () => void;
  onDeprecate?: () => void;
  onDestroy?: () => void;
  children: React.ReactNode;
}

const actions = [
  {
    key: "unpin" as const,
    label: "Unpin",
    description: "Remove from this session only. The item stays in the graph.",
    icon: Pin,
    color: "text-muted-foreground",
    destructive: false,
  },
  {
    key: "eject" as const,
    label: "Eject from Bundle",
    description: "Remove from the current bundle. The item remains in the graph unassigned.",
    icon: LogOut,
    color: "text-warning",
    destructive: false,
  },
  {
    key: "deprecate" as const,
    label: "Deprecate",
    description: "Mark as legacy/archived. It won't be injected into new workbooks but remains searchable.",
    icon: Archive,
    color: "text-warning",
    destructive: false,
  },
  {
    key: "destroy" as const,
    label: "Destroy",
    description: "Permanently delete from the knowledge graph. This cannot be undone.",
    icon: Trash2,
    color: "text-destructive",
    destructive: true,
  },
];

export function DeleteDisambiguation({
  itemTitle, onUnpin, onEject, onDeprecate, onDestroy, children,
}: DeleteDisambiguationProps) {
  const { toast } = useToast();
  const [confirmAction, setConfirmAction] = useState<typeof actions[number] | null>(null);

  const handlers: Record<string, (() => void) | undefined> = {
    unpin: onUnpin, eject: onEject, deprecate: onDeprecate, destroy: onDestroy,
  };

  const handleSelect = (action: typeof actions[number]) => {
    if (action.destructive) {
      setConfirmAction(action);
    } else {
      handlers[action.key]?.();
      toast({ title: `${action.label}`, description: `"${itemTitle}" — ${action.description.split(".")[0]}.` });
    }
  };

  const handleConfirm = () => {
    if (confirmAction) {
      handlers[confirmAction.key]?.();
      toast({
        title: confirmAction.label,
        description: `"${itemTitle}" has been permanently destroyed.`,
        variant: "destructive",
      });
    }
    setConfirmAction(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Remove "{itemTitle}"
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actions.map(action => (
            <DropdownMenuItem
              key={action.key}
              onClick={() => handleSelect(action)}
              className={`flex flex-col items-start gap-0.5 py-2.5 ${action.destructive ? "text-destructive focus:text-destructive" : ""}`}
            >
              <div className="flex items-center gap-2">
                <action.icon className={`h-3.5 w-3.5 ${action.color}`} />
                <span className="text-sm font-medium">{action.label}</span>
              </div>
              <span className="text-[11px] text-muted-foreground ml-[22px] leading-tight">
                {action.description}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Destroy confirmation */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Permanently Destroy Item?
            </DialogTitle>
            <DialogDescription>
              You are about to permanently delete <strong>"{itemTitle}"</strong> from the entire knowledge graph.
              This action cannot be undone and will affect all workbooks and bundles referencing this item.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirm}>Destroy Permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
