import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, BookOpen, Users, ArrowRight, Radio } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImpactedWorkbook {
  id: string;
  title: string;
  status: string;
  lockedPlaybook: string | null;
  owner: string;
}

const MOCK_IMPACTED: ImpactedWorkbook[] = [
  { id: "1", title: "Q1 OKR Planning", status: "active", lockedPlaybook: "Strategic Planning v2", owner: "Ivan B." },
  { id: "2", title: "Market Expansion APAC", status: "active", lockedPlaybook: "Market Analysis", owner: "Maria R." },
  { id: "3", title: "Client Onboarding — Acme Corp", status: "active", lockedPlaybook: "Onboarding Setup", owner: "Kate T." },
  { id: "4", title: "Proposal Pipeline — Enterprise", status: "review", lockedPlaybook: "Draft Proposal", owner: "Ivan B." },
];

interface ImpactSimulatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemTitle: string;
  changeType: "update" | "delete" | "scope_change";
}

export function ImpactSimulator({ open, onOpenChange, itemTitle, changeType }: ImpactSimulatorProps) {
  const { toast } = useToast();
  const [pushMode, setPushMode] = useState<"soft" | "broadcast">("soft");

  const activelyLocked = MOCK_IMPACTED.filter(w => w.lockedPlaybook);
  const changeLabel = changeType === "update" ? "Update" : changeType === "delete" ? "Deletion" : "Scope Change";

  const handleConfirm = () => {
    toast({
      title: pushMode === "soft" ? "Soft Push Applied" : "Broadcast Applied",
      description: pushMode === "soft"
        ? `"${itemTitle}" updated. Changes apply to new workbooks only.`
        : `"${itemTitle}" broadcast to ${MOCK_IMPACTED.length} active workbooks.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Impact Simulation
          </DialogTitle>
          <DialogDescription>
            Previewing cascade effects of this {changeLabel.toLowerCase()} before committing.
          </DialogDescription>
        </DialogHeader>

        {/* Change summary */}
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{changeLabel}:</span>
            <span className="text-muted-foreground">"{itemTitle}"</span>
          </div>
        </div>

        {/* Impact stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border/50 bg-card p-3 text-center">
            <p className="text-xl font-bold">{MOCK_IMPACTED.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Workbooks Affected</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-3 text-center">
            <p className="text-xl font-bold text-warning">{activelyLocked.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Actively Locked</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-card p-3 text-center">
            <p className="text-xl font-bold">{new Set(MOCK_IMPACTED.map(w => w.owner)).size}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Users Impacted</p>
          </div>
        </div>

        {/* Affected workbooks */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Affected Workbooks</p>
          <div className="space-y-1.5 max-h-40 overflow-auto">
            {MOCK_IMPACTED.map(wb => (
              <div key={wb.id} className="flex items-center justify-between rounded-md border border-border/50 bg-card px-3 py-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">{wb.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {wb.lockedPlaybook && (
                    <Badge variant="outline" className="text-[9px] border-warning/30 text-warning gap-1">
                      <Radio className="h-2 w-2 animate-pulse" /> Locked
                    </Badge>
                  )}
                  <span className="text-[10px] text-muted-foreground">{wb.owner}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Versioning: Soft Push vs Broadcast (REQ-G-04) */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Push Strategy</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPushMode("soft")}
              className={`rounded-lg border p-3 text-left transition-all ${
                pushMode === "soft" ? "border-primary/40 bg-primary/5 glow-sm" : "border-border/50 bg-card hover:border-primary/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium">Soft Push</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                New workbooks get the update. Existing active locks are unaffected.
              </p>
            </button>
            <button
              onClick={() => setPushMode("broadcast")}
              className={`rounded-lg border p-3 text-left transition-all ${
                pushMode === "broadcast" ? "border-warning/40 bg-warning/5" : "border-border/50 bg-card hover:border-warning/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Radio className="h-3.5 w-3.5 text-warning" />
                <span className="text-xs font-medium">Broadcast</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                Force-update all {MOCK_IMPACTED.length} active workbooks. Users will see the change immediately.
              </p>
            </button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant={pushMode === "broadcast" ? "destructive" : "default"}
            onClick={handleConfirm}
          >
            {pushMode === "soft" ? "Apply Soft Push" : `Broadcast to ${MOCK_IMPACTED.length} Workbooks`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
