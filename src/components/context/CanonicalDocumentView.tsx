import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Download, RefreshCw, ArrowUpFromLine,
  Loader2, AlertTriangle, Save, FileCheck, History,
} from "lucide-react";
import { OUTPUT_TYPE_LABELS, OUTPUT_TYPE_ICONS, type OutputType } from "@/lib/knowledge-schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SyncConfirmationDialog, type SyncOperation } from "@/components/context/SyncConfirmationDialog";
import { SyncHistoryDialog } from "@/components/context/SyncHistoryDialog";
import { BlockDocumentEditor, parseMarkdownToBlocks, computeBlockDiffs, type DocBlock } from "@/components/context/BlockDocumentEditor";
import { DocumentCopilot } from "@/components/context/DocumentCopilot";
import { supabase } from "@/integrations/supabase/client";
import type { MockBundle, MockContextItem } from "@/data/mockContextItems";

// Item marker format: <!-- item:UUID -->
const ITEM_MARKER_RE = /<!-- item:([a-f0-9-]+) -->/g;

/** Strip item markers from markdown (for display) */
export function stripItemMarkers(md: string): string {
  return md.replace(/<!-- item:[a-f0-9-]+ -->\n?/g, "");
}

/** Parse a marked document into a map of item-id → content block.
 *  The special key "__header__" captures content before the first marker. */
export function parseMarkedSections(doc: string): Map<string, string> {
  const sections = new Map<string, string>();
  const markers = [...doc.matchAll(ITEM_MARKER_RE)];

  // Capture header (everything before the first marker)
  if (markers.length > 0) {
    const headerContent = doc.slice(0, markers[0].index!).trimEnd();
    sections.set("__header__", headerContent);
  } else {
    sections.set("__header__", doc.trimEnd());
  }

  for (let i = 0; i < markers.length; i++) {
    const id = markers[i][1];
    const start = markers[i].index! + markers[i][0].length;
    const end = i + 1 < markers.length ? markers[i + 1].index! : doc.length;
    sections.set(id, doc.slice(start, end).replace(/^\n/, "").trimEnd());
  }
  return sections;
}

/** Deterministic diff: compare marked sections between baseline and edited document.
 *  Returns operations for items whose content actually changed. */
export function diffMarkedDocuments(
  baseline: string,
  edited: string,
  items: { id: string; title: string; category: string }[]
): { op: "update"; id: string; title: string; newContent: string; oldContent: string }[] {
  const baseSections = parseMarkedSections(baseline);
  const editSections = parseMarkedSections(edited);
  const ops: { op: "update"; id: string; title: string; newContent: string; oldContent: string }[] = [];

  // Check header (bundle title/description) changes
  const baseHeader = baseSections.get("__header__") || "";
  const editHeader = editSections.get("__header__") || "";
  if (baseHeader !== editHeader) {
    ops.push({
      op: "update",
      id: "__header__",
      title: "Bundle Title / Description",
      newContent: editHeader,
      oldContent: baseHeader,
    });
  }

  for (const [id, editContent] of editSections) {
    if (id === "__header__") continue;
    const baseContent = baseSections.get(id);
    if (baseContent === undefined) continue;
    if (editContent !== baseContent) {
      const item = items.find(i => i.id === id);
      ops.push({
        op: "update",
        id,
        title: item?.title || id,
        newContent: editContent,
        oldContent: baseContent,
      });
    }
  }

  // Detect deleted markers
  for (const [id] of baseSections) {
    if (id === "__header__") continue;
    if (!editSections.has(id)) {
      const item = items.find(i => i.id === id);
      ops.push({
        op: "update" as const,
        id,
        title: item?.title || id,
        newContent: "",
        oldContent: baseSections.get(id) || "",
      });
    }
  }

  return ops;
}

// ── Generate canonical markdown from bundle items ──
export function generateCanonicalDocument(bundle: MockBundle, items: MockContextItem[]): string {
  const lines: string[] = [];

  lines.push(`# ${bundle.title}`);
  if (bundle.description) {
    lines.push("", bundle.description);
  }
  lines.push("");

  // Sort all items by sort_order to match the playbook view ordering
  const sortedItems = [...items].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));

  const playbooks = sortedItems.filter(i => i.category === "PLAYBOOK");
  const ownedByPlaybook = new Map<string, MockContextItem[]>();
  const sharedItems: MockContextItem[] = [];

  for (const item of sortedItems) {
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
    lines.push(`<!-- item:${pb.id} -->`);
    lines.push(`## ${pb.title}`);
    if (pb.content_preview) lines.push("", pb.content_preview);
    lines.push("");

    const children = ownedByPlaybook.get(pb.id) || [];
    // Children are already sorted by sort_order from sortedItems
    const procedures = children.filter(i => i.category === "PROCEDURE");
    const principles = children.filter(i => i.category === "PRINCIPLE");
    const directives = children.filter(i => i.category === "DIRECTIVE");
    const knowledge = children.filter(i => i.category === "KNOWLEDGE");
    const research = children.filter(i => i.category === "RESEARCH");
    const other = children.filter(i => !["PROCEDURE", "PRINCIPLE", "DIRECTIVE", "KNOWLEDGE", "RESEARCH"].includes(i.category));

    if (procedures.length > 0) {
      lines.push("### Steps", "");
      let stepNum = 0;
      procedures.forEach((proc) => {
        // Skip empty procedures (no content and no output spec)
        const hasContent = !!proc.content_preview?.trim();
        const hasOutput = proc.output_type && proc.output_type !== "free_text";
        if (!hasContent && !hasOutput) return;

        stepNum++;
        lines.push(`<!-- item:${proc.id} -->`);
        lines.push(`${stepNum}. **${proc.title}**`);
        if (proc.content_preview) {
          for (const cl of proc.content_preview.split("\n")) lines.push(`   ${cl}`);
        }
        // Render output spec if present
        if (hasOutput) {
          const label = OUTPUT_TYPE_LABELS[proc.output_type as OutputType] || proc.output_type;
          const icon = OUTPUT_TYPE_ICONS[proc.output_type as OutputType] || "📄";
          const desc = proc.output_description ? `: ${proc.output_description}` : "";
          lines.push(`   **Output** → ${icon} ${label}${desc}`);
        }
        lines.push("");
      });
    }

    if (directives.length > 0) {
      lines.push("### Gates & Directives", "");
      for (const d of directives) {
        lines.push(`<!-- item:${d.id} -->`);
        lines.push(`> **⚠️ ${d.title}**`);
        if (d.content_preview) lines.push(`> ${d.content_preview.replace(/\n/g, "\n> ")}`);
        lines.push("");
      }
    }

    if (knowledge.length > 0) {
      lines.push("### Knowledge", "");
      for (const k of knowledge) {
        lines.push(`<!-- item:${k.id} -->`);
        lines.push(`#### ${k.title}`);
        if (k.content_preview) lines.push("", k.content_preview);
        lines.push("");
      }
    }

    if (principles.length > 0) {
      lines.push("### Principles", "");
      for (const p of principles) {
        lines.push(`<!-- item:${p.id} -->`);
        lines.push(`> **${p.title}**`);
        if (p.content_preview) lines.push(`> ${p.content_preview.replace(/\n/g, "\n> ")}`);
        lines.push("");
      }
    }

    if (research.length > 0) {
      lines.push("### Research", "");
      for (const r of research) {
        lines.push(`<!-- item:${r.id} -->`);
        lines.push(`#### ${r.title}`);
        if (r.content_preview) lines.push("", r.content_preview);
        lines.push("");
      }
    }

    if (other.length > 0) {
      for (const o of other) {
        lines.push(`<!-- item:${o.id} -->`);
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
      lines.push(`<!-- item:${item.id} -->`);
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
  const queryClient = useQueryClient();
  

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
  const [dirty, setDirty] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  // Sync confirmation
  const [syncOps, setSyncOps] = useState<SyncOperation[]>([]);
  const [syncSummary, setSyncSummary] = useState("");
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // Sync history
  const [historyOpen, setHistoryOpen] = useState(false);

  // Copilot state
  const [selectedText, setSelectedText] = useState("");
  const [copilotPos, setCopilotPos] = useState<{ top: number; left: number } | null>(null);

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

  /** Extract title from a marked section's markdown content based on category patterns */
  const extractTitleFromSection = (sectionContent: string): string | null => {
    const lines = sectionContent.split("\n").filter(l => l.trim());
    if (!lines.length) return null;
    const first = lines[0];
    // ## Heading or ### Heading or #### Heading
    const headingMatch = first.match(/^#{1,4}\s+(.+)/);
    if (headingMatch) return headingMatch[1].trim();
    // Numbered step: 1. **Title**
    const stepMatch = first.match(/^\d+\.\s+\*\*(.+?)\*\*/);
    if (stepMatch) return stepMatch[1].trim();
    // Blockquote: > **⚠️ Title** or > **Title**
    const bqMatch = first.match(/^>\s+\*\*(?:⚠️\s*)?(.+?)\*\*/);
    if (bqMatch) return bqMatch[1].trim();
    return null;
  };

  /** Extract body content (everything after the title line) from a section */
  const extractBodyFromSection = (sectionContent: string): string => {
    const lines = sectionContent.split("\n");
    // Skip the title line, join the rest, trimmed
    return lines.slice(1).join("\n").trim();
  };

  // Step 1: Block-level diff (no markdown reformatting issues)
  const handleRequestSync = useCallback(() => {
    setSyncing(true);
    try {
      const curBlocks = parseMarkdownToBlocks(content, items);
      const baseBlocks = parseMarkdownToBlocks(baselineRef.current, items);
      const blockDiffs = computeBlockDiffs(baseBlocks, curBlocks);

      if (blockDiffs.size === 0) {
        toast({ title: "No changes detected", description: "The document matches the current playbook items." });
        setSyncing(false);
        return;
      }

      const currentBlockMap = new Map<string, DocBlock>(curBlocks.map(b => [b.id, b]));
      const baselineBlockMap = new Map<string, DocBlock>(baseBlocks.map(b => [b.id, b]));

      const ops: SyncOperation[] = [];
      for (const [blockId, diff] of blockDiffs) {
        if (diff.isDeleted) {
          const base = baselineBlockMap.get(blockId);
          ops.push({ op: "delete", id: blockId, title: base?.title || blockId });
          continue;
        }
        if (diff.isNew) {
          const block = currentBlockMap.get(blockId);
          if (block) {
            ops.push({ op: "create", title: block.title, content_full: block.body, category: block.category });
          }
          continue;
        }
        const block = currentBlockMap.get(blockId);
        const base = baselineBlockMap.get(blockId);
        if (!block || !base) continue;

        if (blockId === "__header__") {
          ops.push({
            op: "update", id: "__header__", title: "Bundle Title / Description",
            content_full: block.title !== base.title ? block.title : undefined,
            prev_title: block.title !== base.title ? base.title : undefined,
            prev_content: block.body !== base.body ? base.body : undefined,
          });
          continue;
        }

        ops.push({
          op: "update", id: blockId,
          title: diff.titleChanged ? block.title : (base.title || blockId),
          prev_title: diff.titleChanged ? base.title : undefined,
          content_full: diff.bodyChanged ? block.body : undefined,
          prev_content: diff.bodyChanged ? base.body : undefined,
        });
      }

      setSyncOps(ops);
      setSyncSummary(`${ops.length} item(s) changed`);
      setSyncDialogOpen(true);
    } catch (err) {
      toast({ title: "Sync error", description: String(err), variant: "destructive" });
    } finally {
      setSyncing(false);
    }
  }, [content, items, toast]);

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

      // Handle header (bundle title/description) changes locally
      const headerOps = selectedOps.filter(op => op.id === "__header__");
      const itemOps = selectedOps.filter(op => op.id !== "__header__");

      for (const hop of headerOps) {
        if (hop.content_full !== undefined) {
          // Parse the new H1 title from content
          const titleMatch = hop.content_full.match(/^#\s+(.+)/m);
          if (titleMatch) {
            const newTitle = titleMatch[1].trim();
            await supabase.from("bundles").update({ title: newTitle }).eq("id", bundle.id);
          }
          // Parse description (lines after H1)
          const lines = hop.content_full.split("\n");
          const descLines = lines.slice(1).join("\n").trim();
          if (descLines) {
            await supabase.from("bundles").update({ description: descLines }).eq("id", bundle.id);
          }
        }
      }

      // If only header ops, skip edge function call
      if (itemOps.length === 0) {
        toast({ title: "Synced to Playbooks", description: "Bundle header updated." });
        queryClient.invalidateQueries({ queryKey: ["bundles-all"] });
        localStorage.removeItem(`doc-draft-${bundle.id}`);
        baselineRef.current = content;
        setDirty(false);
        setDraftSaved(false);
        onDraftChange?.(bundle.id, false);
        setSyncDialogOpen(false);
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
            apply_operations: itemOps,
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
      baselineRef.current = content;
      setDirty(false);
      setDraftSaved(false);
      onDraftChange?.(bundle.id, false);
      queryClient.invalidateQueries({ queryKey: ["bundles-all"] });
      queryClient.invalidateQueries({ queryKey: ["context-items-all"] });
      queryClient.invalidateQueries({ queryKey: ["context-item-bundles-all"] });
      setSyncDialogOpen(false);
    } catch (err) {
      toast({ title: "Sync error", description: String(err), variant: "destructive" });
    } finally {
      setConfirming(false);
    }
  }, [content, bundle, items, toast, onDraftChange]);

  const isDiverged = content !== generatedContent;

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

      {/* Block Document Editor */}
      <BlockDocumentEditor
        content={content}
        baseline={baselineRef.current}
        items={items}
        onChange={handleContentChange}
        className="flex-1 min-h-0"
        onTextSelect={(text, pos) => { setSelectedText(text); setCopilotPos(pos); }}
        onSelectionClear={() => { if (!copilotPos) return; /* keep open if copilot is showing */ }}
      />

      {/* Document Copilot (floating, triggered by text selection) */}
      {copilotPos && selectedText && (
        <DocumentCopilot
          selectedText={selectedText}
          fullDocument={content}
          bundle={bundle}
          items={items}
          otherBundles={allBundles.filter(b => b.id !== bundle.id).map(b => ({ title: b.title, description: b.description || "" }))}
          position={copilotPos}
          onReplace={(newText) => {
            const updated = content.replace(selectedText, newText);
            handleContentChange(updated);
          }}
          onClose={() => { setSelectedText(""); setCopilotPos(null); }}
        />
      )}

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
