import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Lightbulb, Check, X, Pencil, Microscope, BookOpen, ArrowRight,
  Sparkles, Link2, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/knowledge/CategoryBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_COLORS: Record<string, string> = {
  DIRECTIVE: "bg-destructive/10 text-destructive",
  KNOWLEDGE: "bg-blue-500/10 text-blue-500",
  PROCEDURE: "bg-amber-500/10 text-amber-500",
  PLAYBOOK: "bg-primary/10 text-primary",
  PREFERENCE: "bg-secondary text-secondary-foreground",
  RESEARCH: "bg-purple-500/10 text-purple-500",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  RESEARCH: <Microscope className="h-3.5 w-3.5" />,
  DIRECTIVE: <AlertTriangle className="h-3.5 w-3.5" />,
  default: <BookOpen className="h-3.5 w-3.5" />,
};

interface DraftCapture {
  id: string;
  title: string;
  content_full: string;
  category: string;
  source_workbook_id: string | null;
  source_chat_id: string | null;
  capture_status: string;
  created_at: string;
  priority: string;
}

export function CapturesInbox() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<DraftCapture | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("RESEARCH");

  const { data: drafts = [], isLoading } = useQuery({
    queryKey: ["captures-inbox", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("context_items")
        .select("*")
        .eq("owner_id", user!.id)
        .eq("capture_status", "draft")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as DraftCapture[];
    },
  });

  const acceptCapture = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("context_items")
        .update({ capture_status: "accepted" } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["captures-inbox"] });
      queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
      toast({ title: "Finding accepted into knowledge" });
    },
  });

  const rejectCapture = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("context_items")
        .update({ capture_status: "rejected" } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["captures-inbox"] });
      toast({ title: "Finding dismissed" });
    },
  });

  const updateCapture = useMutation({
    mutationFn: async () => {
      if (!editItem) return;
      const { error } = await supabase
        .from("context_items")
        .update({
          title: editTitle,
          content_full: editContent,
          category: editCategory,
          capture_status: "accepted",
        } as any)
        .eq("id", editItem.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["captures-inbox"] });
      queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
      toast({ title: "Finding refined and accepted" });
      setEditOpen(false);
      setEditItem(null);
    },
  });

  const openEdit = (item: DraftCapture) => {
    setEditItem(item);
    setEditTitle(item.title);
    setEditContent(item.content_full);
    setEditCategory(item.category);
    setEditOpen(true);
  };

  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Loading captures…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <p className="text-xs text-muted-foreground">
          {drafts.length} pending capture{drafts.length !== 1 ? "s" : ""} — review, refine, and accept findings into your knowledge graph.
        </p>
      </div>

      {drafts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/50 p-8 text-center text-sm text-muted-foreground">
          <Lightbulb className="h-8 w-8 mx-auto mb-3 text-primary/40" />
          <p className="font-medium">No pending captures</p>
          <p className="text-xs mt-1">Use the 💡 button or <code className="bg-muted px-1 rounded">/capture</code> in any chat to capture findings.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {drafts.map(item => (
            <div key={item.id} className="group flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 transition-colors hover:border-primary/30">
              <div className={`flex h-8 w-8 items-center justify-center rounded-md shrink-0 ${CATEGORY_COLORS[item.category] || "bg-secondary"}`}>
                {CATEGORY_ICONS[item.category] || CATEGORY_ICONS.default}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.title}</span>
                  <CategoryBadge category={item.category} />
                  <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">draft</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.content_full}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Captured {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  title="Edit & accept"
                  onClick={() => openEdit(item)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                  title="Accept as-is"
                  onClick={() => acceptCapture.mutate(item.id)}
                >
                  <Check className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  title="Dismiss"
                  onClick={() => rejectCapture.mutate(item.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit & Accept Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Refine & Accept Finding</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Title"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
            />
            <Select value={editCategory} onValueChange={setEditCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["DIRECTIVE", "KNOWLEDGE", "PROCEDURE", "PLAYBOOK", "PREFERENCE", "RESEARCH", "PRINCIPLE"].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Content…"
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              onClick={() => updateCapture.mutate()}
              disabled={!editTitle.trim() || !editContent.trim()}
              className="gap-1.5"
            >
              <Check className="h-3.5 w-3.5" /> Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
