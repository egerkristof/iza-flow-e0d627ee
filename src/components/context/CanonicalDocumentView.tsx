import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  Edit3, Eye, Columns, Download, RefreshCw, ArrowUpFromLine,
  Loader2, AlertTriangle, Save, FileCheck, History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { MarkdownToolbar, markdownTools, type ToolAction } from "@/components/workbooks/MarkdownToolbar";
import { DocumentCopilot } from "@/components/context/DocumentCopilot";
import { MarkdownPreview } from "@/components/context/MarkdownPreview";
import { GutterDiffEditor } from "@/components/context/GutterDiffEditor";
import { SyncConfirmationDialog, type SyncOperation } from "@/components/context/SyncConfirmationDialog";
import { SyncHistoryDialog } from "@/components/context/SyncHistoryDialog";
import { supabase } from "@/integrations/supabase/client";
import type { MockBundle, MockContextItem } from "@/data/mockContextItems";

// ── Generate canonical markdown from bundle items ──
export function generateCanonicalDocument(bundle: MockBundle, items: MockContextItem[]): string {
  const lines: string[] = [];

  lines.push(`# ${bundle.title}`);
  if (bundle.description) {
    lines.push("", bundle.description);
  }
  lines.push("");

  const playbooks = items.filter(i => i.category === "PLAYBOOK");
  const ownedByPlaybook = new Map<string, MockContextItem[]>();
  const sharedItems: MockContextItem[] = [];

  for (const item of items) {
    if (item.category === "PLAYBOOK") continue;
    if (item.parent_playbook_id && playbooks.some(p => p.id === item.parent_playbook_id)) {
      const existing = ownedByPlaybook.get(item.parent_playbook_id) || [];
      existing.push(item);
      ownedByPlaybook.set(item.parent_playbook_id, existing);
    } else if (item.category === "PROCEDURE" && !item.parent_playbook_id && playbooks.length === 1) {
      const pbId = playbooks[0].id;
      const existing = ownedByPlaybook.get(pbId) || [];
      existing.push(item);
      ownedByPlaybook.set(pbId, existing);
    } else {
      sharedItems.push(item);
    }
  }

  for (const pb of playbooks) {
    lines.push(`## ${pb.title}`);
    if (pb.content_preview) lines.push("", pb.content_preview);
    lines.push("");

    const children = ownedByPlaybook.get(pb.id) || [];
    const procedures = children.filter(i => i.category === "PROCEDURE").sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
    const principles = children.filter(i => i.category === "PRINCIPLE");
    const directives = children.filter(i => i.category === "DIRECTIVE");
    const knowledge = children.filter(i => i.category === "KNOWLEDGE");
    const research = children.filter(i => i.category === "RESEARCH");
    const other = children.filter(i => !["PROCEDURE", "PRINCIPLE", "DIRECTIVE", "KNOWLEDGE", "RESEARCH"].includes(i.category));

    if (procedures.length > 0) {
      lines.push("### Steps", "");
      procedures.forEach((proc, idx) => {
        lines.push(`${idx + 1}. **${proc.title}**`);
        if (proc.content_preview) {
          for (const cl of proc.content_preview.split("\n")) lines.push(`   ${cl}`);
        }
        lines.push("");
      });
    }

    if (directives.length > 0) {
      lines.push("### Gates & Directives", "");
      for (const d of directives) {
        lines.push(`> **⚠️ ${d.title}**`);
        if (d.content_preview) lines.push(`> ${d.content_preview.replace(/\n/g, "\n> ")}`);
        lines.push("");
      }
    }

    if (knowledge.length > 0) {
      lines.push("### Knowledge", "");
      for (const k of knowledge) {
        lines.push(`#### ${k.title}`);
        if (k.content_preview) lines.push("", k.content_preview);
        lines.push("");
      }
    }

    if (principles.length > 0) {
      lines.push("### Principles", "");
      for (const p of principles) {
        lines.push(`> **${p.title}**`);
        if (p.content_preview) lines.push(`> ${p.content_preview.replace(/\n/g, "\n> ")}`);
        lines.push("");
      }
    }

    if (research.length > 0) {
      lines.push("### Research", "");
      for (const r of research) {
        lines.push(`#### ${r.title}`);
        if (r.content_preview) lines.push("", r.content_preview);
        lines.push("");
      }
    }

    if (other.length > 0) {
      for (const o of other) {
        lines.push(`#### ${o.title}`);
        if (o.content_preview) lines.push("", o.content_preview);
        lines.push("");
      }
    }

    lines.push("---", "");
  }

  if (sharedItems.length > 0) {
    lines.push("## Shared Context", "");
    for (const item of sharedItems) {
      if (item.category === "PRINCIPLE") {
        lines.push(`> **${item.title}**`);
        if (item.content_preview) lines.push(`> ${item.content_preview.replace(/\n/g, "\n> ")}`);
      } else {
        lines.push(`### ${item.title}`);
        if (item.content_preview) lines.push("", item.content_preview);
      }
      lines.push("");
    }
  }

  return lines.join("\n").trim();
}

interface CanonicalDocumentViewProps {
  bundle: MockBundle;
  items: MockContextItem[];
  allBundles?: MockBundle[];
  onClose: () => void;
  onDraftChange?: (bundleId: string, hasDraft: boolean) => void;
}

export function CanonicalDocumentView({ bundle, items, allBundles = [], onClose, onDraftChange }: CanonicalDocumentViewProps) {
  const { toast } = useToast();
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const generatedContent = useMemo(() => generateCanonicalDocument(bundle, items), [bundle, items]);

  // Stable baseline: captured at generation time, only updated on regenerate/sync success
  const baselineRef = useRef(generatedContent);
  // Update baseline only when generatedContent changes AND content hasn't been edited (no draft)
  useEffect(() => {
    const hasDraft = localStorage.getItem(`doc-draft-${bundle.id}`);
    if (!hasDraft) {
      baselineRef.current = generatedContent;
    }
  }, [generatedContent, bundle.id]);

  const [content, setContent] = useState(generatedContent);
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("split");
  const [dirty, setDirty] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // Copilot state
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [copilotPosition, setCopilotPosition] = useState({ top: 0, left: 0 });
  const [copilotRange, setCopilotRange] = useState<{ start: number; end: number } | null>(null);

  // Sync confirmation
  const [syncOps, setSyncOps] = useState<SyncOperation[]>([]);
  const [syncSummary, setSyncSummary] = useState("");
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Sync history
  const [historyOpen, setHistoryOpen] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`doc-draft-${bundle.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.content && parsed.content !== generatedContent) {
          setContent(parsed.content);
          setDirty(true);
          setDraftSaved(true);
        }
      } catch { /* ignore */ }
    }
  }, [bundle.id, generatedContent]);

  const handleContentChange = (v: string) => {
    setContent(v);
    setDirty(true);
    setDraftSaved(false);
  };

  const handleRegenerate = useCallback(() => {
    const fresh = generateCanonicalDocument(bundle, items);
    setContent(fresh);
    setDirty(false);
    setDraftSaved(false);
    localStorage.removeItem(`doc-draft-${bundle.id}`);
    baselineRef.current = fresh;
    onDraftChange?.(bundle.id, false);
    toast({ title: "Document regenerated", description: "Content rebuilt from current playbook items." });
  }, [bundle, items, toast, onDraftChange]);

  const handleSaveDraft = useCallback(() => {
    localStorage.setItem(`doc-draft-${bundle.id}`, JSON.stringify({
      content,
      savedAt: new Date().toISOString(),
    }));
    setDraftSaved(true);
    onDraftChange?.(bundle.id, true);
    toast({ title: "Draft saved", description: "Your edits are saved locally." });
  }, [content, bundle.id, toast, onDraftChange]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bundle.title.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content, bundle.title]);

  // Step 1: Request AI to compute operations (preview mode)
  const handleRequestSync = useCallback(async () => {
    setSyncing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Not authenticated", variant: "destructive" });
        setSyncing(false);
        return;
      }

      const existingItems = items.map(i => ({
        id: i.id,
        title: i.title,
        category: i.category,
        parent_playbook_id: i.parent_playbook_id,
        content_full: i.content_preview || "",
      }));

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-document-to-playbooks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            document_markdown: content,
            original_document: baselineRef.current,
            bundle_id: bundle.id,
            bundle_title: bundle.title,
            existing_items: existingItems,
            preview_only: true,
          }),
        }
      );

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: "Sync failed" }));
        toast({ title: "Sync failed", description: errData.error, variant: "destructive" });
        setSyncing(false);
        return;
      }

      const result = await resp.json();
      setSyncOps(result.operations || []);
      setSyncSummary(result.summary || "Changes detected");
      setSyncDialogOpen(true);
    } catch (err) {
      toast({ title: "Sync error", description: String(err), variant: "destructive" });
    } finally {
      setSyncing(false);
    }
  }, [content, bundle, items, toast]);

  // Step 2: Apply confirmed operations
  const handleConfirmSync = useCallback(async (selectedOps: SyncOperation[]) => {
    setConfirming(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({ title: "Not authenticated", variant: "destructive" });
        setConfirming(false);
        return;
      }

      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sync-document-to-playbooks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            document_markdown: content,
            bundle_id: bundle.id,
            bundle_title: bundle.title,
            existing_items: items.map(i => ({
              id: i.id, title: i.title, category: i.category,
              parent_playbook_id: i.parent_playbook_id, content_preview: i.content_preview,
            })),
            apply_operations: selectedOps,
          }),
        }
      );

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ error: "Apply failed" }));
        toast({ title: "Apply failed", description: errData.error, variant: "destructive" });
        setConfirming(false);
        return;
      }

      const result = await resp.json();
      toast({
        title: "Synced to Playbooks",
        description: `${result.summary}. Updated: ${result.results.updated}, Created: ${result.results.created}, Removed: ${result.results.deleted}`,
      });

      localStorage.removeItem(`doc-draft-${bundle.id}`);
      baselineRef.current = content; // Update baseline to current content after successful sync
      setDirty(false);
      setDraftSaved(false);
      onDraftChange?.(bundle.id, false);
      setSyncDialogOpen(false);
    } catch (err) {
      toast({ title: "Sync error", description: String(err), variant: "destructive" });
    } finally {
      setConfirming(false);
    }
  }, [content, bundle, items, toast, onDraftChange]);

  // Text selection handler for copilot
  const handleMouseUp = useCallback(() => {
    if (viewMode === "preview") return;
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) return;

    const selected = content.substring(start, end);
    if (selected.trim().length < 5) return;

    setSelectedText(selected);
    const rect = textarea.getBoundingClientRect();
    setCopilotPosition({
      top: rect.top + 60,
      left: rect.left + rect.width / 2 - 180,
    });
    setCopilotOpen(true);
  }, [content, viewMode]);

  const handleCopilotReplace = useCallback((newText: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const newContent = before + newText + after;

    // Calculate line range for the highlight
    const startLine = before.split("\n").length - 1;
    const endLine = startLine + newText.split("\n").length - 1;
    setCopilotRange({ start: startLine, end: endLine });

    handleContentChange(newContent);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + newText.length);
    });
  }, [content]);

  const isDiverged = content !== generatedContent;
  const otherBundles = allBundles.filter(b => b.id !== bundle.id).map(b => ({ title: b.title, description: b.description }));

  return (
    <div className="flex flex-col h-[600px] border-t border-border/30 bg-card/50">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2 bg-card/80 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-semibold truncate">📖 {bundle.title} — Document View</h3>
          {dirty && !draftSaved && (
            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 shrink-0">
              Unsaved
            </Badge>
          )}
          {draftSaved && (
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 shrink-0 flex items-center gap-1">
              <FileCheck className="h-2.5 w-2.5" /> Draft Saved
            </Badge>
          )}
          {isDiverged && !dirty && (
            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 shrink-0 flex items-center gap-1">
              <AlertTriangle className="h-2.5 w-2.5" /> Out of sync
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* View mode toggle */}
          <div className="flex items-center rounded-md border border-border/50 overflow-hidden">
            <button
              onClick={() => setViewMode("edit")}
              className={`px-2 py-1 text-[11px] flex items-center gap-1 transition-colors ${viewMode === "edit" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Edit3 className="h-3 w-3" /> Edit
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`px-2 py-1 text-[11px] flex items-center gap-1 transition-colors border-x border-border/50 ${viewMode === "split" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Columns className="h-3 w-3" /> Split
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`px-2 py-1 text-[11px] flex items-center gap-1 transition-colors ${viewMode === "preview" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Eye className="h-3 w-3" /> Read
            </button>
          </div>

          <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1" onClick={handleRegenerate}>
            <RefreshCw className="h-3 w-3" /> Regenerate
          </Button>

          <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1" onClick={() => setHistoryOpen(true)}>
            <History className="h-3 w-3" /> History
          </Button>

          {dirty && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[11px] gap-1 border-emerald-500/30 text-emerald-400"
                onClick={handleSaveDraft}
              >
                <Save className="h-3 w-3" /> Save Draft
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[11px] gap-1 border-primary/30 text-primary"
                onClick={handleRequestSync}
                disabled={syncing}
              >
                {syncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowUpFromLine className="h-3 w-3" />}
                Sync to Playbooks
              </Button>
            </>
          )}

          <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1" onClick={handleDownload}>
            <Download className="h-3 w-3" /> .md
          </Button>
        </div>
      </div>

      {/* Divergence banner */}
      {isDiverged && dirty && (
        <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-400 text-[11px]">
          <AlertTriangle className="h-3 w-3 shrink-0" />
          <span>Your document has been edited. Use "Save Draft" to preserve edits, or "Sync to Playbooks" to push changes back.</span>
        </div>
      )}

      {/* Editor body */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Edit pane */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div className={`min-w-0 flex flex-col ${viewMode === "split" ? "w-1/2 border-r border-border/50" : "flex-1"}`}>
            <MarkdownToolbar textareaRef={editorRef} content={content} onChange={handleContentChange} />
            <GutterDiffEditor
              ref={editorRef}
              value={content}
              baseline={baselineRef.current}
              onChange={handleContentChange}
              onMouseUp={handleMouseUp}
              copilotRange={copilotRange}
              onKeyDown={e => {
                const mod = e.ctrlKey || e.metaKey;
                const key = e.key.toLowerCase();
                const shortcuts: Record<string, string> = { b: "Bold", i: "Italic", k: "Link" };
                if (mod && shortcuts[key]) {
                  e.preventDefault();
                  const tool = markdownTools.find(t => t !== "sep" && (t as ToolAction).label === shortcuts[key]) as ToolAction | undefined;
                  if (tool && editorRef.current) {
                    const { newContent, cursorStart, cursorEnd } = tool.action(editorRef.current, content);
                    handleContentChange(newContent);
                    requestAnimationFrame(() => {
                      editorRef.current?.focus();
                      editorRef.current?.setSelectionRange(cursorStart, cursorEnd);
                    });
                  }
                }
                if (mod && key === "s") {
                  e.preventDefault();
                  handleSaveDraft();
                }
              }}
              placeholder="Start writing…"
            />
          </div>
        )}

        {/* Preview pane */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className={`min-w-0 ${viewMode === "split" ? "w-1/2" : "flex-1"}`}>
            <ScrollArea className="h-full">
              <div className="max-w-3xl mx-auto p-6">
                <MarkdownPreview content={content} />
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Inline AI Copilot */}
        {copilotOpen && selectedText && (
          <DocumentCopilot
            selectedText={selectedText}
            fullDocument={content}
            bundle={bundle}
            items={items}
            otherBundles={otherBundles}
            position={copilotPosition}
            onReplace={handleCopilotReplace}
            onClose={() => setCopilotOpen(false)}
          />
        )}
      </div>

      {/* Sync Confirmation Dialog */}
      <SyncConfirmationDialog
        open={syncDialogOpen}
        onOpenChange={setSyncDialogOpen}
        operations={syncOps}
        summary={syncSummary}
        onConfirm={handleConfirmSync}
        confirming={confirming}
      />

      {/* Sync History Dialog */}
      <SyncHistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        bundleId={bundle.id}
        bundleTitle={bundle.title}
      />
    </div>
  );
}
