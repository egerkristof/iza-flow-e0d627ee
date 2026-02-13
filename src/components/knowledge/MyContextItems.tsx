import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen, Trash2, Plus, Search, Microscope, Sparkles,
  Tag, FileText, Shield, Loader2, MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/knowledge/CategoryBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ContextCopilotPanel } from "@/components/knowledge/ContextCopilotPanel";

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
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [inlineLoading, setInlineLoading] = useState<string | null>(null);

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

  // Inline AI actions
  const handleInlineAction = async (itemId: string, action: string) => {
    setInlineLoading(itemId);
    try {
      if (action === "promote_mandate") {
        const { data, error } = await supabase.functions.invoke("audit-context", {
          body: { action: "apply_promote_mandate", item_id: itemId, enforcement_level: "required_ack" },
        });
        if (error) throw error;
        if (data.error) throw new Error(data.error);
        queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
        queryClient.invalidateQueries({ queryKey: ["mandates"] });
        toast({ title: "Promoted to Mandate", description: "Item is now a draft mandate with Required Ack enforcement." });
      } else if (action === "enrich") {
        // Run audit on single item to get enrichment suggestion
        const item = items.find(i => i.id === itemId);
        if (!item) return;
        const { data, error } = await supabase.functions.invoke("audit-context", {
          body: {
            action: "audit",
            items: [{ id: item.id, title: item.title, content_full: item.content_full, category: item.category, priority: item.priority }],
          },
        });
        if (error) throw error;
        if (data.error) throw new Error(data.error);
        const enrichSuggestion = (data.suggestions || []).find((s: any) => s.type === "enrich");
        if (enrichSuggestion?.suggested_content) {
          const { error: applyErr } = await supabase.functions.invoke("audit-context", {
            body: { action: "apply_enrich", item_id: itemId, enriched_content: enrichSuggestion.suggested_content },
          });
          if (applyErr) throw applyErr;
          queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
          toast({ title: "Content enriched", description: "AI has expanded the item's content." });
        } else {
          toast({ title: "Already rich", description: "AI found no enrichment needed for this item." });
        }
      } else if (action === "suggest_category") {
        const item = items.find(i => i.id === itemId);
        if (!item) return;
        const { data, error } = await supabase.functions.invoke("audit-context", {
          body: {
            action: "audit",
            items: [{ id: item.id, title: item.title, content_full: item.content_full, category: item.category, priority: item.priority }],
          },
        });
        if (error) throw error;
        if (data.error) throw new Error(data.error);
        const recatSuggestion = (data.suggestions || []).find((s: any) => s.type === "recategorize");
        if (recatSuggestion?.suggested_category) {
          const { error: applyErr } = await supabase.functions.invoke("audit-context", {
            body: { action: "apply_recategorize", item_id: itemId, new_category: recatSuggestion.suggested_category },
          });
          if (applyErr) throw applyErr;
          queryClient.invalidateQueries({ queryKey: ["my-context-items"] });
          toast({ title: "Recategorized", description: `Changed to ${recatSuggestion.suggested_category}: ${recatSuggestion.reason}` });
        } else {
          toast({ title: "Category correct", description: "AI confirms the current category is appropriate." });
        }
      }
    } catch (e: any) {
      toast({ title: "AI action failed", description: e.message, variant: "destructive" });
    } finally {
      setInlineLoading(null);
    }
  };

  const filtered = items.filter(i => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase()) || i.content_full.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || i.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const categories = ["all", "DIRECTIVE", "KNOWLEDGE", "PROCEDURE", "PLAYBOOK", "PREFERENCE", "RESEARCH", "PRINCIPLE"];

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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => setCopilotOpen(!copilotOpen)}
          >
            <Sparkles className="h-3 w-3" />
            {copilotOpen ? "Hide Copilot" : "AI Copilot"}
          </Button>
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3 w-3" /> New Item
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} item{filtered.length !== 1 ? "s" : ""} · Promote personal knowledge into context items to share with workbooks and bundles.
      </p>

      {/* Copilot Panel */}
      {copilotOpen && (
        <ContextCopilotPanel items={items} onClose={() => setCopilotOpen(false)} />
      )}

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
                  <CategoryBadge category={item.category} />
                  <Badge variant="outline" className="text-[10px]">{item.priority}</Badge>
                  {item.is_mandate && (
                    <Badge variant="outline" className="text-[9px] border-amber-500/30 bg-amber-500/10 text-amber-400 gap-0.5">
                      <Shield className="h-2 w-2" /> Mandate
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.content_full}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                  <span>{item.security_level}</span>
                  <span>v{item.version}</span>
                  {item.bundle_id && <span className="text-primary">📦 In bundle</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {inlineLoading === item.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleInlineAction(item.id, "suggest_category")} className="text-xs gap-2">
                        <Tag className="h-3 w-3" /> Suggest Category
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleInlineAction(item.id, "enrich")} className="text-xs gap-2">
                        <FileText className="h-3 w-3" /> Enrich Content
                      </DropdownMenuItem>
                      {item.category === "DIRECTIVE" && !item.is_mandate && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleInlineAction(item.id, "promote_mandate")} className="text-xs gap-2 text-amber-400">
                            <Shield className="h-3 w-3" /> Promote to Mandate
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive"
                  onClick={() => deleteItem.mutate(item.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
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
