import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  ChevronLeft, Save, History, Clock, Download, Eye, Edit3, Columns,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

/** Reusable markdown renderer with nice formatting */
function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-sm prose-invert max-w-none
      [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:border-b [&_h1]:border-border/40 [&_h1]:pb-2 [&_h1]:mb-4
      [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3
      [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2
      [&_h4]:text-base [&_h4]:font-medium [&_h4]:mt-4 [&_h4]:mb-2
      [&_p]:my-3 [&_p]:leading-7 [&_p]:text-muted-foreground
      [&_ul]:my-3 [&_ul]:pl-6 [&_ul]:list-disc
      [&_ol]:my-3 [&_ol]:pl-6 [&_ol]:list-decimal
      [&_li]:my-1.5 [&_li]:leading-7 [&_li]:text-muted-foreground
      [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-primary/80
      [&_strong]:text-foreground [&_strong]:font-semibold
      [&_em]:text-foreground/80
      [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:bg-primary/5 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:rounded-r-md [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
      [&_hr]:border-border/40 [&_hr]:my-8
      [&_table]:border-collapse [&_table]:w-full [&_table]:my-4
      [&_th]:border [&_th]:border-border/40 [&_th]:bg-secondary/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:text-foreground
      [&_td]:border [&_td]:border-border/40 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm [&_td]:text-muted-foreground
      [&_img]:rounded-md [&_img]:border [&_img]:border-border/40 [&_img]:my-4
      [&_code:not(pre_code)]:text-xs [&_code:not(pre_code)]:bg-secondary [&_code:not(pre_code)]:text-primary [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:font-mono
      [&_pre]:my-4 [&_pre]:rounded-lg [&_pre]:overflow-hidden
    ">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeStr = String(children).replace(/\n$/, "");
            if (match) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, borderRadius: "0.5rem", fontSize: "0.8rem" }}
                >
                  {codeStr}
                </SyntaxHighlighter>
              );
            }
            return <code className={className} {...props}>{children}</code>;
          },
        }}
      >
        {content || "*No content yet*"}
      </ReactMarkdown>
    </div>
  );
}

interface ResourceVersion {
  id: string;
  resource_id: string;
  version_number: number;
  content: string | null;
  created_by: string;
  created_at: string;
  change_note: string | null;
}

export default function ResourceEditorPage() {
  const { workbookId, resourceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [changeNote, setChangeNote] = useState("");
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("edit");
  const [showHistory, setShowHistory] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Fetch resource
  const { data: resource, isLoading } = useQuery({
    queryKey: ["resource-edit", resourceId],
    enabled: !!resourceId && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_resources")
        .select("*")
        .eq("id", resourceId!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Fetch versions
  const { data: versions = [] } = useQuery({
    queryKey: ["resource-versions", resourceId],
    enabled: !!resourceId && !!user && showHistory,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_resource_versions")
        .select("*")
        .eq("resource_id", resourceId!)
        .order("version_number", { ascending: false });
      if (error) throw error;
      return data as unknown as ResourceVersion[];
    },
  });

  // Seed form
  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      setContent(resource.content ?? "");
      setDirty(false);
    }
  }, [resource]);

  const handleTitleChange = (v: string) => { setTitle(v); setDirty(true); };
  const handleContentChange = (v: string) => { setContent(v); setDirty(true); };

  // Save mutation — snapshots old version then updates
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!resource || !user) throw new Error("Missing data");

      // Snapshot current version
      const maxVersion = versions.length > 0 ? versions[0].version_number : 0;

      if (resource.content !== null) {
        await supabase.from("workbook_resource_versions").insert({
          resource_id: resource.id,
          version_number: maxVersion + 1,
          content: resource.content,
          created_by: user.id,
          change_note: changeNote || null,
          metadata: resource.metadata as any,
        } as any);
      }

      // Update resource
      const { error } = await supabase
        .from("workbook_resources")
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq("id", resource.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resource-edit", resourceId] });
      queryClient.invalidateQueries({ queryKey: ["resource-versions", resourceId] });
      queryClient.invalidateQueries({ queryKey: ["workbook-resources", workbookId] });
      toast({ title: "Saved", description: `Version ${(versions[0]?.version_number ?? 0) + 2} saved` });
      setDirty(false);
      setChangeNote("");
    },
    onError: (e: any) => {
      toast({ title: "Error saving", description: e.message, variant: "destructive" });
    },
  });

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content, title]);

  const restoreVersion = useCallback((v: ResourceVersion) => {
    if (v.content) {
      setContent(v.content);
      setDirty(true);
      toast({ title: "Version restored", description: `Content from v${v.version_number} loaded. Save to apply.` });
    }
  }, [toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-[60vh] text-sm text-muted-foreground">Loading…</div>;
  }

  if (!resource) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <p className="text-sm text-muted-foreground">Resource not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-3 bg-card/50 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => navigate(`/workbooks/${workbookId}`)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Input
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            className="text-lg font-semibold border-none bg-transparent p-0 h-auto focus-visible:ring-0 max-w-md"
            placeholder="Untitled"
          />
          {dirty && <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 shrink-0">Unsaved</Badge>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center rounded-md border border-border/50 overflow-hidden">
            <button
              onClick={() => setViewMode("edit")}
              className={`px-2.5 py-1.5 text-xs flex items-center gap-1 transition-colors ${viewMode === "edit" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Edit3 className="h-3 w-3" /> Edit
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`px-2.5 py-1.5 text-xs flex items-center gap-1 transition-colors border-x border-border/50 ${viewMode === "split" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Columns className="h-3 w-3" /> Split
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`px-2.5 py-1.5 text-xs flex items-center gap-1 transition-colors ${viewMode === "preview" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Eye className="h-3 w-3" /> Preview
            </button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1.5"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-3 w-3" />
            History
          </Button>
          <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={handleDownload}>
            <Download className="h-3 w-3" /> .md
          </Button>
          <div className="flex items-center gap-2">
            <Input
              value={changeNote}
              onChange={e => setChangeNote(e.target.value)}
              placeholder="Change note (optional)"
              className="h-8 w-44 text-xs"
            />
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => saveMutation.mutate()}
              disabled={!dirty || saveMutation.isPending}
            >
              <Save className="h-3 w-3" />
              {saveMutation.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Editor pane */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div className={`min-w-0 ${viewMode === "split" ? "w-1/2 border-r border-border/50" : "flex-1"}`}>
            <Textarea
              value={content}
              onChange={e => handleContentChange(e.target.value)}
              className="h-full w-full resize-none border-none rounded-none bg-transparent p-8 font-mono text-sm focus-visible:ring-0 leading-relaxed"
              placeholder="Start writing in Markdown…"
            />
          </div>
        )}

        {/* Preview pane */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className={`min-w-0 ${viewMode === "split" ? "w-1/2" : "flex-1"}`}>
            <ScrollArea className="h-full">
              <div className="max-w-3xl mx-auto p-8">
                <MarkdownPreview content={content} />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Version history sidebar */}
        {showHistory && (
          <div className="w-64 border-l border-border/50 bg-card/50 shrink-0">
            <div className="p-3 border-b border-border/50">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <History className="h-3 w-3" /> Version History
              </h3>
            </div>
            <ScrollArea className="h-[calc(100%-3rem)]">
              <div className="p-2 space-y-1">
                {/* Current version */}
                <div className="rounded-md bg-primary/10 border border-primary/20 px-3 py-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Badge variant="outline" className="text-[8px] border-primary/30 text-primary px-1">Current</Badge>
                    <span className="font-medium text-primary">v{(versions[0]?.version_number ?? 0) + 1}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                    <Clock className="h-2.5 w-2.5" />
                    {resource.updated_at
                      ? new Date(resource.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                      : "—"}
                  </div>
                </div>

                {versions.map(v => (
                  <button
                    key={v.id}
                    onClick={() => restoreVersion(v)}
                    className="w-full text-left rounded-md px-3 py-2 text-xs hover:bg-secondary transition-colors"
                  >
                    <span className="font-medium">v{v.version_number}</span>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                      <Clock className="h-2.5 w-2.5" />
                      {new Date(v.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                    {v.change_note && (
                      <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{v.change_note}</p>
                    )}
                    <span className="text-[10px] text-primary mt-1 inline-block">Click to restore</span>
                  </button>
                ))}

                {versions.length === 0 && (
                  <p className="text-[10px] text-muted-foreground p-2">No previous versions yet.</p>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}