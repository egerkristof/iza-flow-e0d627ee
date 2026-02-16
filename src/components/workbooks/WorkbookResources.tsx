import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus, FileText, Link2, Type, Trash2, ExternalLink, Upload, Image, File, Download,
  History, Clock, ChevronRight, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

interface ResourceVersion {
  id: string;
  resource_id: string;
  version_number: number;
  content: string | null;
  file_path: string | null;
  file_name: string | null;
  file_type: string | null;
  metadata: Record<string, unknown>;
  created_by: string;
  created_at: string;
  change_note: string | null;
}

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
  link: "bg-blue-500/10 text-blue-400",
  file: "bg-amber-500/10 text-amber-400",
};

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp", "image/svg+xml"];

function getPublicUrl(filePath: string) {
  const { data } = supabase.storage.from("workbook-resources").getPublicUrl(filePath);
  return data.publicUrl;
}

function isImageFile(fileType: string | null) {
  return fileType ? IMAGE_TYPES.includes(fileType) : false;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Resource Card ──
function ResourceCard({ resource, onDelete, onViewHistory }: { resource: WorkbookResource; onDelete: (id: string) => void; onViewHistory?: (r: WorkbookResource) => void }) {
  const isImage = isImageFile(resource.file_type);
  const publicUrl = resource.file_path ? getPublicUrl(resource.file_path) : null;

  return (
    <div className="group flex items-start gap-3 rounded-lg border border-border/50 bg-card p-4 hover:border-primary/20 transition-colors">
      {/* Preview / Icon */}
      {resource.resource_type === "file" && isImage && publicUrl ? (
        <div className="h-16 w-16 rounded-md overflow-hidden shrink-0 border border-border/30 bg-muted">
          <img src={publicUrl} alt={resource.title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className={`flex h-9 w-9 items-center justify-center rounded-md shrink-0 ${TYPE_COLOR[resource.resource_type] || "bg-secondary"}`}>
          {resource.resource_type === "file" ? (
            isImage ? <Image className="h-4 w-4" /> : <File className="h-4 w-4" />
          ) : (
            TYPE_ICON[resource.resource_type] || <FileText className="h-4 w-4" />
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{resource.title}</span>
          <Badge variant="outline" className="text-[10px] shrink-0">{resource.resource_type}</Badge>
          {resource.file_name && (
            <span className="text-[10px] text-muted-foreground truncate">{resource.file_name}</span>
          )}
        </div>
        {resource.content && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {resource.resource_type === "link" ? (
              <a href={resource.content} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                {resource.content} <ExternalLink className="h-3 w-3 inline" />
              </a>
            ) : (
              resource.content
            )}
          </p>
        )}
        <p className="text-[10px] text-muted-foreground mt-1">
          {new Date(resource.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {/* Version history button */}
        {resource.resource_type === "text" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100"
            onClick={() => onViewHistory?.(resource)}
            title="Version history"
          >
            <History className="h-3.5 w-3.5" />
          </Button>
        )}
        {resource.resource_type === "file" && publicUrl && (
          <a href={publicUrl} target="_blank" rel="noopener noreferrer" download={resource.file_name ?? undefined}>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
              <Download className="h-3.5 w-3.5" />
            </Button>
          </a>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive"
          onClick={() => onDelete(resource.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ── Version History Dialog ──
function VersionHistoryDialog({
  resource,
  open,
  onOpenChange,
}: {
  resource: WorkbookResource | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [selectedVersion, setSelectedVersion] = useState<ResourceVersion | null>(null);

  const { data: versions = [], isLoading } = useQuery({
    queryKey: ["resource-versions", resource?.id],
    enabled: !!resource?.id && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_resource_versions")
        .select("*")
        .eq("resource_id", resource!.id)
        .order("version_number", { ascending: false });
      if (error) throw error;
      return data as unknown as ResourceVersion[];
    },
  });

  // Include current version as "latest"
  const allVersions = resource
    ? [
        {
          id: "current",
          resource_id: resource.id,
          version_number: (versions[0]?.version_number ?? 0) + 1,
          content: resource.content,
          file_path: resource.file_path,
          file_name: resource.file_name,
          file_type: resource.file_type,
          metadata: resource.metadata,
          created_by: resource.created_by,
          created_at: resource.updated_at,
          change_note: "Current version",
        } as ResourceVersion,
        ...versions,
      ]
    : versions;

  const viewing = selectedVersion ?? allVersions[0] ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Version History — {resource?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
          {/* Version list */}
          <div className="w-48 shrink-0 border-r border-border/50 pr-3">
            <ScrollArea className="h-[400px]">
              <div className="space-y-1">
                {isLoading ? (
                  <p className="text-xs text-muted-foreground p-2">Loading…</p>
                ) : allVersions.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-2">No versions yet</p>
                ) : (
                  allVersions.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVersion(v.id === "current" ? null : v)}
                      className={`w-full text-left rounded-md px-3 py-2 text-xs transition-colors ${
                        (viewing?.id === v.id)
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {v.id === "current" && (
                          <Badge variant="outline" className="text-[8px] border-primary/30 text-primary px-1">
                            Latest
                          </Badge>
                        )}
                        <span className="font-medium">v{v.version_number}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {new Date(v.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      {v.change_note && v.id !== "current" && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                          {v.change_note}
                        </p>
                      )}
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Version content preview */}
          <div className="flex-1 min-w-0">
            <ScrollArea className="h-[400px]">
              {viewing?.content ? (
                <div className="prose prose-sm prose-invert max-w-none p-2 [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_h1]:text-sm [&_h2]:text-xs [&_h3]:text-xs [&_code]:text-[10px] [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded">
                  <ReactMarkdown>{viewing.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-4">No content for this version.</p>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ──
export function WorkbookResources({ workbookId }: { workbookId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newType, setNewType] = useState<"text" | "link" | "file">("text");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [historyResource, setHistoryResource] = useState<WorkbookResource | null>(null);

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
      if (newType === "file" && selectedFile) {
        setIsUploading(true);
        setUploadProgress(10);

        const filePath = `${user!.id}/${workbookId}/${Date.now()}-${selectedFile.name}`;
        
        setUploadProgress(30);
        const { error: uploadError } = await supabase.storage
          .from("workbook-resources")
          .upload(filePath, selectedFile, { upsert: false });
        if (uploadError) throw uploadError;

        setUploadProgress(70);

        const { error: dbError } = await supabase.from("workbook_resources").insert({
          workbook_id: workbookId,
          created_by: user!.id,
          title: newTitle || selectedFile.name,
          resource_type: "file",
          content: newContent || null,
          file_path: filePath,
          file_name: selectedFile.name,
          file_type: selectedFile.type,
          metadata: { size: selectedFile.size },
        } as any);
        if (dbError) throw dbError;

        setUploadProgress(100);
      } else {
        const { error } = await supabase.from("workbook_resources").insert({
          workbook_id: workbookId,
          created_by: user!.id,
          title: newTitle,
          resource_type: newType,
          content: newContent || null,
        } as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workbook-resources", workbookId] });
      toast({ title: "Item added to repository" });
      resetForm();
    },
    onError: (e: any) => {
      toast({ title: "Error", description: e.message, variant: "destructive" });
      setIsUploading(false);
      setUploadProgress(0);
    },
  });

  const deleteResource = useMutation({
    mutationFn: async (id: string) => {
      // Delete file from storage if it exists
      const resource = resources.find(r => r.id === id);
      if (resource?.file_path) {
        await supabase.storage.from("workbook-resources").remove([resource.file_path]);
      }
      const { error } = await supabase.from("workbook_resources").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workbook-resources", workbookId] });
      toast({ title: "Item removed from repository" });
    },
  });

  const resetForm = () => {
    setCreateOpen(false);
    setNewTitle("");
    setNewContent("");
    setNewType("text");
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum 20MB per file.", variant: "destructive" });
      return;
    }
    setSelectedFile(file);
    if (!newTitle) setNewTitle(file.name);
  };

  const canSubmit = newType === "file" ? !!selectedFile : !!newTitle.trim();

  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Loading repository…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{resources.length} item{resources.length !== 1 ? "s" : ""}</p>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={() => { setNewType("file"); setCreateOpen(true); }}
          >
            <Upload className="h-3 w-3" /> Upload File
          </Button>
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3 w-3" /> Add Item
          </Button>
        </div>
      </div>

      {resources.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/50 p-8 text-center text-sm text-muted-foreground">
          No items yet. Add text, links, or upload files to this workbook's repository.
        </div>
      ) : (
        <div className="space-y-2">
          {resources.map(r => (
            <ResourceCard key={r.id} resource={r} onDelete={(id) => deleteResource.mutate(id)} onViewHistory={(r) => setHistoryResource(r)} />
          ))}
        </div>
      )}

      {/* Create / Upload dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) resetForm(); else setCreateOpen(true); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
          <DialogTitle className="text-base">
              {newType === "file" ? "Upload File" : "Add Repository Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={newType} onValueChange={(v) => { setNewType(v as any); setSelectedFile(null); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="link">Link / URL</SelectItem>
                <SelectItem value="file">File Upload</SelectItem>
              </SelectContent>
            </Select>

            {newType === "file" ? (
              <>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/50 p-6 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  {selectedFile ? (
                    <>
                      {isImageFile(selectedFile.type) ? (
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Preview"
                          className="h-20 w-20 rounded-md object-cover border border-border/30"
                        />
                      ) : (
                        <File className="h-8 w-8 text-muted-foreground" />
                      )}
                      <div className="text-center">
                        <p className="text-sm font-medium truncate max-w-[250px]">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                      </div>
                      <p className="text-[10px] text-primary">Click to change</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to select a file</p>
                      <p className="text-[10px] text-muted-foreground">Max 20MB</p>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} />
                <Input
                  placeholder="Title (optional, defaults to filename)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  rows={2}
                />
                {isUploading && (
                  <div className="space-y-1">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-[10px] text-muted-foreground text-center">Uploading…</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <Input placeholder="Item title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                {newType === "link" ? (
                  <Input placeholder="https://..." value={newContent} onChange={e => setNewContent(e.target.value)} />
                ) : (
                  <Textarea
                    placeholder="Content…"
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    rows={4}
                  />
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => createResource.mutate()} disabled={!canSubmit || isUploading}>
              {newType === "file" ? "Upload" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version History Dialog */}
      <VersionHistoryDialog
        resource={historyResource}
        open={!!historyResource}
        onOpenChange={(open) => { if (!open) setHistoryResource(null); }}
      />
    </div>
  );
}

// ── Exported for chat attachment picker ──
export function useWorkbookResources(workbookId: string) {
  const { user } = useAuth();
  return useQuery({
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
}

export type { WorkbookResource };
