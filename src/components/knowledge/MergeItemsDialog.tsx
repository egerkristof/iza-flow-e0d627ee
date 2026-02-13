import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CategoryBadge } from "@/components/knowledge/CategoryBadge";
import { GitMerge, ArrowRight } from "lucide-react";
import { mergeContent } from "@/lib/dedup";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ContextItem {
  id: string;
  title: string;
  content_full: string;
  category: string;
  priority: string;
  bundle_id: string | null;
  owner_id: string;
}

interface MergeItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemA: ContextItem;
  itemB: ContextItem;
  onComplete: () => void;
}

const CATEGORIES = ["RESEARCH", "KNOWLEDGE", "DIRECTIVE", "PROCEDURE", "PLAYBOOK", "PREFERENCE", "PRINCIPLE"];

export function MergeItemsDialog({
  open,
  onOpenChange,
  itemA,
  itemB,
  onComplete,
}: MergeItemsDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const merged = mergeContent(itemA.content_full, itemB.content_full);
  const [title, setTitle] = useState(itemA.title);
  const [content, setContent] = useState(merged);
  const [category, setCategory] = useState(itemA.category);
  const [saving, setSaving] = useState(false);

  // Reset state when dialog opens with new items
  const resetState = () => {
    const m = mergeContent(itemA.content_full, itemB.content_full);
    setTitle(itemA.title);
    setContent(m);
    setCategory(itemA.category);
  };

  const handleMerge = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // 1. Collect bundle assignments from both items
      const { data: bundleRows } = await supabase
        .from("context_item_bundles")
        .select("bundle_id")
        .in("context_item_id", [itemA.id, itemB.id]);
      const bundleIds = Array.from(
        new Set([
          ...(bundleRows?.map(r => r.bundle_id) ?? []),
          ...(itemA.bundle_id ? [itemA.bundle_id] : []),
          ...(itemB.bundle_id ? [itemB.bundle_id] : []),
        ].filter(Boolean))
      );

      // 2. Soft-delete both originals
      const now = new Date().toISOString();
      await supabase
        .from("context_items")
        .update({ deleted_at: now } as any)
        .in("id", [itemA.id, itemB.id]);

      // 3. Create new merged item
      const { data: newItem, error: insertErr } = await supabase
        .from("context_items")
        .insert({
          owner_id: user.id,
          title,
          content_full: content,
          category,
          bundle_id: bundleIds[0] ?? null,
        } as any)
        .select("id")
        .single();
      if (insertErr) throw insertErr;

      // 4. Re-assign all bundle associations
      if (newItem && bundleIds.length > 0) {
        const rows = bundleIds.map(bid => ({
          context_item_id: newItem.id,
          bundle_id: bid,
        }));
        await supabase.from("context_item_bundles").insert(rows as any);
      }

      queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
      queryClient.invalidateQueries({ queryKey: ["context-items"] });
      toast({ title: "Items merged", description: "Both originals archived; new consolidated item created." });
      onOpenChange(false);
      onComplete();
    } catch (e: any) {
      toast({ title: "Merge failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <GitMerge className="h-4 w-4 text-primary" />
            Merge Two Context Items
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground">
          Both originals will be archived and a new consolidated item will be created, inheriting all bundle assignments.
        </p>

        {/* Source items side-by-side */}
        <div className="grid grid-cols-2 gap-3 min-h-0">
          {[itemA, itemB].map((item, i) => (
            <div key={item.id} className="rounded-md border border-border/50 flex flex-col">
              <div className="p-2 border-b border-border/30 flex items-center justify-between">
                <span className="text-xs font-medium">Item {i + 1}</span>
                <CategoryBadge category={item.category} />
              </div>
              <ScrollArea className="flex-1 p-2 max-h-32">
                <p className="text-xs font-medium mb-1">{item.title}</p>
                <p className="text-[11px] text-muted-foreground whitespace-pre-wrap">
                  {item.content_full}
                </p>
              </ScrollArea>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
        </div>

        {/* Merged result editor */}
        <div className="rounded-md border border-primary/20 p-3 space-y-2">
          <span className="text-xs font-medium flex items-center gap-1.5">
            <GitMerge className="h-3 w-3 text-primary" /> Merged Result
          </span>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              className="h-8 text-xs"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={5}
            className="text-xs"
          />
        </div>

        <DialogFooter className="gap-1.5">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="gap-1.5 text-xs"
            onClick={handleMerge}
            disabled={!title.trim() || !content.trim() || saving}
          >
            <GitMerge className="h-3 w-3" />
            {saving ? "Merging…" : "Merge Items"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
