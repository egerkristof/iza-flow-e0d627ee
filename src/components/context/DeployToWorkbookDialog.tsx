import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen, Plus, Loader2, Rocket, Search, FolderOpen,
} from "lucide-react";

interface DeployToWorkbookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bundleId: string;
  bundleTitle: string;
}

export function DeployToWorkbookDialog({
  open,
  onOpenChange,
  bundleId,
  bundleTitle,
}: DeployToWorkbookDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [deploying, setDeploying] = useState(false);
  const [selectedWorkbookId, setSelectedWorkbookId] = useState<string | null>(null);

  // Create-inline state
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const { data: workbooks = [], isLoading } = useQuery({
    queryKey: ["workbooks-for-deploy", user?.id],
    enabled: !!user && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbooks")
        .select("id, title, status")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = workbooks.filter(
    (w) => !search || w.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDeploy = async (workbookId: string) => {
    if (!user) return;
    setDeploying(true);
    try {
      // Create a workbook_resource of type "bundle" linking the bundle
      const { error } = await supabase.from("workbook_resources").insert({
        workbook_id: workbookId,
        created_by: user.id,
        resource_type: "bundle",
        title: bundleTitle,
        content: null,
        metadata: { bundle_id: bundleId },
      });
      if (error) throw error;

      // Auto-generate protocols from the bundle
      try {
        await supabase.functions.invoke("generate-protocols", {
          body: { workbook_id: workbookId, bundle_id: bundleId },
        });
      } catch (protoErr) {
        console.warn("Protocol generation failed (non-blocking):", protoErr);
      }

      const wb = workbooks.find((w) => w.id === workbookId);
      toast({
        title: "Domain deployed",
        description: `"${bundleTitle}" attached to "${wb?.title ?? "workbook"}". Protocols generated.`,
      });
      qc.invalidateQueries({ queryKey: ["workbook-resources"] });
      qc.invalidateQueries({ queryKey: ["workbook-protocols"] });
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: "Deploy failed", description: err.message, variant: "destructive" });
    } finally {
      setDeploying(false);
    }
  };

  const handleCreateAndDeploy = async () => {
    if (!user || !newTitle.trim()) return;
    setCreating(true);
    try {
      const { data: wb, error } = await supabase
        .from("workbooks")
        .insert({ owner_id: user.id, title: newTitle.trim() })
        .select("id")
        .single();
      if (error || !wb) throw error ?? new Error("Failed to create workbook");

      // Also add user as a member
      await supabase.from("workbook_members").insert({
        workbook_id: wb.id,
        user_id: user.id,
        role: "owner",
      });

      qc.invalidateQueries({ queryKey: ["workbooks"] });
      await handleDeploy(wb.id);
    } catch (err: any) {
      toast({ title: "Create failed", description: err.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const noWorkbooks = !isLoading && workbooks.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Rocket className="h-4 w-4 text-primary" />
            Deploy Domain to Workbook
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Attach <span className="font-medium text-foreground">"{bundleTitle}"</span> to a workbook so its context is available during execution.
          </p>
        </DialogHeader>

        {noWorkbooks ? (
          /* ── Empty state: no workbooks exist ── */
          <div className="py-6 space-y-4">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">No workbooks yet</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Create your first workbook and this domain will be deployed to it automatically.
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="New workbook title…"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateAndDeploy()}
                className="flex-1"
                autoFocus
              />
              <Button
                onClick={handleCreateAndDeploy}
                disabled={!newTitle.trim() || creating}
                className="gap-1.5"
              >
                {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Create & Deploy
              </Button>
            </div>
          </div>
        ) : (
          /* ── Workbook picker ── */
          <div className="space-y-3">
            {workbooks.length > 5 && (
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search workbooks…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            )}

            <ScrollArea className="max-h-60">
              <div className="space-y-1">
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
                {filtered.map((wb) => (
                  <button
                    key={wb.id}
                    onClick={() => setSelectedWorkbookId(wb.id)}
                    className={`w-full flex items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                      selectedWorkbookId === wb.id
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-secondary/50 border border-transparent"
                    }`}
                  >
                    <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium truncate flex-1">{wb.title}</span>
                    <Badge variant="outline" className="text-[9px] shrink-0">{wb.status}</Badge>
                  </button>
                ))}
                {!isLoading && filtered.length === 0 && search && (
                  <p className="text-xs text-muted-foreground text-center py-4">No workbooks match "{search}"</p>
                )}
              </div>
            </ScrollArea>

            {/* Inline create */}
            <div className="border-t border-border/50 pt-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Or create a new workbook</p>
              <div className="flex gap-2">
                <Input
                  placeholder="New workbook title…"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateAndDeploy()}
                  className="flex-1 h-8 text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCreateAndDeploy}
                  disabled={!newTitle.trim() || creating}
                  className="gap-1 text-xs h-8"
                >
                  {creating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                  Create & Deploy
                </Button>
              </div>
            </div>
          </div>
        )}

        {!noWorkbooks && (
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button
              size="sm"
              onClick={() => selectedWorkbookId && handleDeploy(selectedWorkbookId)}
              disabled={!selectedWorkbookId || deploying}
              className="gap-1.5"
            >
              {deploying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Rocket className="h-3.5 w-3.5" />}
              Deploy
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
