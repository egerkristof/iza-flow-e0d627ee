import { useState, useCallback } from "react";
import {
  Plus, FileText, Pencil, Trash2, Loader2, Clock, ArrowLeft,
  Save, History, ChevronDown, Upload, BookOpen, Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

interface KnowledgeSource {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  content: string;
  source_type: string;
  original_document_id: string | null;
  domain_tag: string | null;
  status: string;
  tags: string[] | null;
  current_version: number;
  created_at: string;
  updated_at: string;
}

interface SourceVersion {
  id: string;
  source_id: string;
  version_number: number;
  content: string;
  change_note: string | null;
  changed_by: string;
  created_at: string;
}

export function KnowledgeSources() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State
  const [editingSource, setEditingSource] = useState<KnowledgeSource | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<KnowledgeSource | null>(null);
  const [saving, setSaving] = useState(false);

  // Create form
  const [createForm, setCreateForm] = useState({ title: "", description: "" });

  // Editor state
  const [editorContent, setEditorContent] = useState("");
  const [editorDirty, setEditorDirty] = useState(false);
  const [changeNote, setChangeNote] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  // Fetch sources
  const { data: sources = [], isPending } = useQuery({
    queryKey: ["knowledge-sources", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("knowledge_sources")
        .select("*")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as KnowledgeSource[];
    },
  });

  // Fetch versions for editing source
  const { data: versions = [] } = useQuery({
    queryKey: ["knowledge-source-versions", editingSource?.id],
    enabled: !!editingSource,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("knowledge_source_versions")
        .select("*")
        .eq("source_id", editingSource!.id)
        .order("version_number", { ascending: false });
      if (error) throw error;
      return data as SourceVersion[];
    },
  });

  // Fetch linked context items count for a source
  const { data: linkedItemCounts = {} } = useQuery({
    queryKey: ["knowledge-source-linked-counts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("context_items")
        .select("source_knowledge_id")
        .not("source_knowledge_id", "is", null)
        .eq("owner_id", user!.id)
        .is("deleted_at", null);
      if (error) throw error;
      const counts: Record<string, number> = {};
      for (const row of data || []) {
        const kid = (row as any).source_knowledge_id as string;
        counts[kid] = (counts[kid] || 0) + 1;
      }
      return counts;
    },
  });

  // Create new source
  const handleCreate = async () => {
    if (!user || !createForm.title.trim()) return;
    setSaving(true);
    const { data, error } = await supabase.from("knowledge_sources").insert({
      owner_id: user.id,
      title: createForm.title.trim(),
      description: createForm.description.trim() || null,
      content: "",
      source_type: "blank",
    } as any).select().single();
    setSaving(false);
    if (error) {
      toast({ title: "Failed to create", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Source created" });
    setCreateOpen(false);
    setCreateForm({ title: "", description: "" });
    queryClient.invalidateQueries({ queryKey: ["knowledge-sources"] });
    // Open editor
    if (data) {
      setEditingSource(data as KnowledgeSource);
      setEditorContent("");
      setEditorDirty(false);
    }
  };

  // Open editor for existing source
  const openEditor = (source: KnowledgeSource) => {
    setEditingSource(source);
    setEditorContent(source.content);
    setEditorDirty(false);
    setChangeNote("");
    setHistoryOpen(false);
  };

  // Save content
  const handleSave = async () => {
    if (!editingSource || !user) return;
    setSaving(true);
    const nextVersion = editingSource.current_version + 1;

    // Save version snapshot
    await supabase.from("knowledge_source_versions").insert({
      source_id: editingSource.id,
      version_number: nextVersion,
      content: editorContent,
      change_note: changeNote.trim() || null,
      changed_by: user.id,
    } as any);

    // Update source
    const { error } = await supabase.from("knowledge_sources").update({
      content: editorContent,
      current_version: nextVersion,
    } as any).eq("id", editingSource.id);

    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Saved", description: `Version ${nextVersion}` });
    setEditorDirty(false);
    setChangeNote("");
    setEditingSource({ ...editingSource, content: editorContent, current_version: nextVersion });
    queryClient.invalidateQueries({ queryKey: ["knowledge-sources"] });
    queryClient.invalidateQueries({ queryKey: ["knowledge-source-versions", editingSource.id] });
  };

  // Delete
  const handleDelete = async (source: KnowledgeSource) => {
    const { error } = await supabase.from("knowledge_sources").delete().eq("id", source.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Source deleted" });
    }
    setDeleteConfirm(null);
    if (editingSource?.id === source.id) setEditingSource(null);
    queryClient.invalidateQueries({ queryKey: ["knowledge-sources"] });
  };

  // Restore version
  const restoreVersion = (version: SourceVersion) => {
    setEditorContent(version.content);
    setEditorDirty(true);
    setHistoryOpen(false);
    toast({ title: `Restored version ${version.version_number}`, description: "Save to apply." });
  };

  // ──── Editor view ────
  if (editingSource) {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => setEditingSource(null)} className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{editingSource.title}</h2>
            <p className="text-xs text-muted-foreground">
              v{editingSource.current_version} · Updated {formatDistanceToNow(new Date(editingSource.updated_at), { addSuffix: true })}
              {(linkedItemCounts[editingSource.id] ?? 0) > 0 && (
                <span className="ml-2">
                  · <BookOpen className="h-3 w-3 inline" /> {linkedItemCounts[editingSource.id]} linked items
                </span>
              )}
            </p>
          </div>
          <Button
            variant="outline" size="sm" className="gap-1.5"
            onClick={() => setHistoryOpen(!historyOpen)}
          >
            <History className="h-3.5 w-3.5" /> History
          </Button>
          <Button
            size="sm" className="gap-1.5"
            onClick={handleSave}
            disabled={!editorDirty || saving}
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Save
          </Button>
        </div>

        <div className="flex gap-4">
          {/* Editor */}
          <div className="flex-1 space-y-3">
            {editorDirty && (
              <div className="flex items-center gap-2">
                <Input
                  value={changeNote}
                  onChange={e => setChangeNote(e.target.value)}
                  placeholder="What changed? (optional note)"
                  className="text-xs h-8"
                />
              </div>
            )}
            <Textarea
              value={editorContent}
              onChange={e => { setEditorContent(e.target.value); setEditorDirty(true); }}
              placeholder="Start writing your knowledge source content here...&#10;&#10;Use this space to document your expertise, processes, and thinking. When you're ready, you can extract context items from this content."
              className="min-h-[500px] font-mono text-sm leading-relaxed resize-y"
            />
          </div>

          {/* Version history sidebar */}
          {historyOpen && (
            <div className="w-72 shrink-0 border rounded-lg p-3 space-y-2 max-h-[560px] overflow-auto">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Version History</h3>
              {versions.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">No versions yet. Save to create the first version.</p>
              ) : (
                versions.map(v => (
                  <Card key={v.id} className="bg-secondary/20">
                    <CardContent className="p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px]">v{v.version_number}</Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(v.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      {v.change_note && (
                        <p className="text-[11px] text-muted-foreground">{v.change_note}</p>
                      )}
                      <Button
                        variant="ghost" size="sm" className="h-6 text-[10px] w-full"
                        onClick={() => restoreVersion(v)}
                      >
                        Restore this version
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ──── List view ────
  if (isPending) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Knowledge Sources</h2>
          <p className="text-xs text-muted-foreground">
            Living documents where you develop and maintain your expertise. Edit here, then extract context items.
          </p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> New Source
        </Button>
      </div>

      {sources.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center space-y-3">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-sm font-medium">No knowledge sources yet</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Create a knowledge source to document your expertise, processes, and thinking. 
                Sources are living documents that you can edit and version over time.
              </p>
            </div>
            <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Create your first source
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sources.map(source => {
            const linkedCount = linkedItemCounts[source.id] ?? 0;
            return (
              <Card
                key={source.id}
                className="group cursor-pointer hover:border-primary/40 transition-all hover:shadow-sm"
                onClick={() => openEditor(source)}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold truncate">{source.title}</h3>
                      {source.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{source.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Button
                        variant="ghost" size="icon" className="h-6 w-6 text-destructive"
                        onClick={e => { e.stopPropagation(); setDeleteConfirm(source); }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-[10px]">v{source.current_version}</Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {source.status}
                    </Badge>
                    {linkedCount > 0 && (
                      <Badge variant="outline" className="text-[10px] gap-0.5">
                        <BookOpen className="h-2.5 w-2.5" /> {linkedCount} items
                      </Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      <Clock className="h-2.5 w-2.5 inline mr-0.5" />
                      {formatDistanceToNow(new Date(source.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                  {source.content && (
                    <p className="text-[11px] text-muted-foreground line-clamp-2 pt-1 border-t border-border/50">
                      {source.content.substring(0, 200)}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Knowledge Source</DialogTitle>
            <DialogDescription>
              Create a living document to develop and maintain your expertise.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                value={createForm.title}
                onChange={e => setCreateForm({ ...createForm, title: e.target.value })}
                placeholder="e.g. Sales Process Guide"
              />
            </div>
            <div>
              <Label className="text-xs">Description (optional)</Label>
              <Textarea
                value={createForm.description}
                onChange={e => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="What is this source about?"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving || !createForm.title.trim()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Create & Open Editor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={open => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteConfirm?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this knowledge source and its version history. Linked context items will not be deleted but will lose their source reference.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
