import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen, ArrowUpRight, Trash2, Plus, Search, Microscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_COLORS: Record<string, string> = {
  DIRECTIVE: "bg-destructive/10 text-destructive",
  KNOWLEDGE: "bg-info/10 text-info",
  PROCEDURE: "bg-warning/10 text-warning",
  PLAYBOOK: "bg-primary/10 text-primary",
  PREFERENCE: "bg-secondary text-secondary-foreground",
  RESEARCH: "bg-purple-500/10 text-purple-500",
};

export function MyContextItems() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("RESEARCH");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["my-context-items", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("context_items")
        .select("*")
        .eq("owner_id", user!.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createItem = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("context_items").insert({
        owner_id: user!.id,
        title: newTitle,
        content_full: newContent,
        category: newCategory,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
      toast({ title: "Context item created" });
      setCreateOpen(false);
      setNewTitle("");
      setNewContent("");
      setNewCategory("RESEARCH");
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("context_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
      toast({ title: "Context item removed" });
    },
  });

  const filtered = items.filter(i => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.content_full.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || i.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const categories = ["all", "DIRECTIVE", "KNOWLEDGE", "PROCEDURE", "PLAYBOOK", "PREFERENCE", "RESEARCH"];

  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search items…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {categories.map(c => (
              <Badge
                key={c}
                variant={categoryFilter === c ? "default" : "outline"}
                className="text-[10px] cursor-pointer"
                onClick={() => setCategoryFilter(c)}
              >
                {c === "all" ? "All" : c}
              </Badge>
            ))}
          </div>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3 w-3" /> New Item
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} item{filtered.length !== 1 ? "s" : ""} · Promote personal knowledge into context items to share with workbooks and bundles.
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/50 p-8 text-center text-sm text-muted-foreground">
          {items.length === 0
            ? "No context items yet. Create one or promote from your personal knowledge."
            : "No items match your filters."}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className="group flex items-start gap-3 rounded-lg border border-border/50 bg-card p-4 hover:border-primary/20 transition-colors">
              <div className={`flex h-8 w-8 items-center justify-center rounded-md shrink-0 ${CATEGORY_COLORS[item.category] || "bg-secondary"}`}>
                {item.category === "RESEARCH" ? <Microscope className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{item.title}</span>
                  <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                  <Badge variant="outline" className="text-[10px]">{item.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.content_full}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                  <span>{item.security_level}</span>
                  <span>v{item.version}</span>
                  {item.bundle_id && <span className="text-primary">📦 In bundle</span>}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive"
                onClick={() => deleteItem.mutate(item.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">New Context Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["RESEARCH", "KNOWLEDGE", "DIRECTIVE", "PROCEDURE", "PLAYBOOK", "PREFERENCE"].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea placeholder="Content…" value={newContent} onChange={e => setNewContent(e.target.value)} rows={4} />
          </div>
          <DialogFooter>
            <Button onClick={() => createItem.mutate()} disabled={!newTitle.trim() || !newContent.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
