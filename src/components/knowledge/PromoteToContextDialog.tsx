import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BookUp, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PromoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-filled title */
  defaultTitle: string;
  /** Pre-filled content */
  defaultContent: string;
  /** Source label shown in the dialog, e.g. "Document" or "Goal" */
  sourceLabel: string;
}

export function PromoteToContextDialog({
  open,
  onOpenChange,
  defaultTitle,
  defaultContent,
  sourceLabel,
}: PromoteDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [title, setTitle] = useState(defaultTitle);
  const [content, setContent] = useState(defaultContent);
  const [priority, setPriority] = useState<"STANDARD" | "CRITICAL">("STANDARD");
  const [security, setSecurity] = useState<"INTERNAL" | "CONFIDENTIAL" | "ADMIN_ONLY">("INTERNAL");
  const [selectedBundleId, setSelectedBundleId] = useState<string>("");

  // Reset form when dialog opens
  const handleOpenChange = (v: boolean) => {
    if (v) {
      setTitle(defaultTitle);
      setContent(defaultContent);
      setPriority("STANDARD");
      setSecurity("INTERNAL");
      setSelectedBundleId("");
    }
    onOpenChange(v);
  };

  // Fetch user's bundles for assignment
  const { data: bundles = [] } = useQuery({
    queryKey: ["bundles-for-promote", user?.id],
    enabled: !!user && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bundles")
        .select("id, title, scope_level")
        .eq("owner_id", user!.id)
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  const promoteMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("context_items").insert({
        owner_id: user.id,
        title: title.trim(),
        content_full: content.trim(),
        category: "RESEARCH" as any,
        priority,
        security_level: security,
        bundle_id: selectedBundleId || null,
        action_type: "APPEND" as any,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["context-items"] });
      toast({ title: "Promoted to Context Item", description: `"${title}" saved as RESEARCH context item.` });
      onOpenChange(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <BookUp className="h-4 w-4 text-primary" />
            Promote {sourceLabel} to Context Item
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Create a RESEARCH-type context item from this {sourceLabel.toLowerCase()}. It will be available for injection into workbook sessions.
          </p>
        </DialogHeader>

        <div className="space-y-3 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Context item title" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Content</label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="Curated knowledge content…" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Priority</label>
              <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Security</label>
              <Select value={security} onValueChange={(v) => setSecurity(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNAL">Internal</SelectItem>
                  <SelectItem value="CONFIDENTIAL">Confidential</SelectItem>
                  <SelectItem value="ADMIN_ONLY">Admin Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Package className="h-3 w-3" /> Assign to Bundle (optional)
            </label>
            <Select value={selectedBundleId} onValueChange={setSelectedBundleId}>
              <SelectTrigger><SelectValue placeholder="No bundle — standalone item" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">No bundle</SelectItem>
                {bundles.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    <span className="flex items-center gap-2">
                      {b.title}
                      <Badge variant="outline" className="text-[9px] ml-1">{b.scope_level}</Badge>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {bundles.length === 0 && (
              <p className="text-[10px] text-muted-foreground">No bundles found. Create one in Context Management first.</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => promoteMutation.mutate()}
            disabled={!title.trim() || !content.trim() || promoteMutation.isPending}
            className="gap-1.5"
          >
            <BookUp className="h-3.5 w-3.5" />
            {promoteMutation.isPending ? "Saving…" : "Promote to RESEARCH"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
