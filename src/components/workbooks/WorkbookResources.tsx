import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus, FileText, Link2, Type, Trash2, ExternalLink, Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface WorkbookResource {
  id: string;
  workbook_id: string;
  created_by: string;
  title: string;
  resource_type: string;
  content: string | null;
  file_path: string | null;
  file_name: string | null;
  file_type: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  text: <Type className="h-4 w-4" />,
  link: <Link2 className="h-4 w-4" />,
  file: <FileText className="h-4 w-4" />,
};

const TYPE_COLOR: Record<string, string> = {
  text: "bg-primary/10 text-primary",
  link: "bg-info/10 text-info",
  file: "bg-warning/10 text-warning",
};

export function WorkbookResources({ workbookId }: { workbookId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [newType, setNewType] = useState<"text" | "link" | "file">("text");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["workbook-resources", workbookId],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_resources")
        .select("*")
        .eq("workbook_id", workbookId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as WorkbookResource[];
    },
  });

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel(`workbook-resources-${workbookId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "workbook_resources",
        filter: `workbook_id=eq.${workbookId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["workbook-resources", workbookId] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [workbookId, queryClient]);

  const createResource = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("workbook_resources").insert({
        workbook_id: workbookId,
        created_by: user!.id,
        title: newTitle,
        resource_type: newType,
        content: newContent || null,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workbook-resources", workbookId] });
      toast({ title: "Resource added" });
      setCreateOpen(false);
      setNewTitle("");
      setNewContent("");
      setNewType("text");
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteResource = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("workbook_resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workbook-resources", workbookId] });
      toast({ title: "Resource removed" });
    },
  });

  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Loading resources…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{resources.length} resource{resources.length !== 1 ? "s" : ""}</p>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3 w-3" /> Add Resource
        </Button>
      </div>

      {resources.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/50 p-8 text-center text-sm text-muted-foreground">
          No resources yet. Add text, links, or files to this workbook.
        </div>
      ) : (
        <div className="space-y-2">
          {resources.map(r => (
            <div key={r.id} className="group flex items-start gap-3 rounded-lg border border-border/50 bg-card p-4 hover:border-primary/20 transition-colors">
              <div className={`flex h-9 w-9 items-center justify-center rounded-md shrink-0 ${TYPE_COLOR[r.resource_type] || "bg-secondary"}`}>
                {TYPE_ICON[r.resource_type] || <FileText className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{r.title}</span>
                  <Badge variant="outline" className="text-[10px]">{r.resource_type}</Badge>
                </div>
                {r.content && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {r.resource_type === "link" ? (
                      <a href={r.content} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                        {r.content} <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      r.content
                    )}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive"
                onClick={() => deleteResource.mutate(r.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Add Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={newType} onValueChange={(v) => setNewType(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="link">Link / URL</SelectItem>
                <SelectItem value="file">File Reference</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Resource title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            {newType === "link" ? (
              <Input placeholder="https://..." value={newContent} onChange={e => setNewContent(e.target.value)} />
            ) : (
              <Textarea
                placeholder={newType === "text" ? "Content…" : "File path or description…"}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={4}
              />
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => createResource.mutate()} disabled={!newTitle.trim()}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
