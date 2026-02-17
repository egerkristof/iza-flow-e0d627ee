import { useState, useRef, useCallback, useMemo } from "react";
import {
  Edit3, Eye, Columns, Download, RefreshCw, ArrowUpFromLine,
  Loader2, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { MarkdownToolbar, markdownTools, type ToolAction } from "@/components/workbooks/MarkdownToolbar";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { MockBundle, MockContextItem } from "@/data/mockContextItems";

/** Reusable markdown renderer */
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

// ── Generate canonical markdown from bundle items ──
function generateCanonicalDocument(bundle: MockBundle, items: MockContextItem[]): string {
  const lines: string[] = [];

  lines.push(`# ${bundle.title}`);
  if (bundle.description) {
    lines.push("", bundle.description);
  }
  lines.push("");

  // Group items by playbook ownership
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
      // Auto-nest orphan procedures under single playbook
      const pbId = playbooks[0].id;
      const existing = ownedByPlaybook.get(pbId) || [];
      existing.push(item);
      ownedByPlaybook.set(pbId, existing);
    } else {
      sharedItems.push(item);
    }
  }

  // Render each playbook as a section
  for (const pb of playbooks) {
    lines.push(`## ${pb.title}`);
    if (pb.content_preview) {
      lines.push("", pb.content_preview);
    }
    lines.push("");

    const children = ownedByPlaybook.get(pb.id) || [];
    const procedures = children
      .filter(i => i.category === "PROCEDURE")
      .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
    const principles = children.filter(i => i.category === "PRINCIPLE");
    const directives = children.filter(i => i.category === "DIRECTIVE");
    const knowledge = children.filter(i => i.category === "KNOWLEDGE");
    const research = children.filter(i => i.category === "RESEARCH");
    const other = children.filter(i =>
      !["PROCEDURE", "PRINCIPLE", "DIRECTIVE", "KNOWLEDGE", "RESEARCH"].includes(i.category)
    );

    // Procedures as numbered steps
    if (procedures.length > 0) {
      lines.push("### Steps");
      lines.push("");
      procedures.forEach((proc, idx) => {
        lines.push(`${idx + 1}. **${proc.title}**`);
        if (proc.content_preview) {
          // Indent content under the numbered item
          const contentLines = proc.content_preview.split("\n");
          for (const cl of contentLines) {
            lines.push(`   ${cl}`);
          }
        }
        lines.push("");
      });
    }

    // Directives as callouts
    if (directives.length > 0) {
      lines.push("### Gates & Directives");
      lines.push("");
      for (const d of directives) {
        lines.push(`> **⚠️ ${d.title}**`);
        if (d.content_preview) {
          lines.push(`> ${d.content_preview.replace(/\n/g, "\n> ")}`);
        }
        lines.push("");
      }
    }

    // Knowledge items
    if (knowledge.length > 0) {
      lines.push("### Knowledge");
      lines.push("");
      for (const k of knowledge) {
        lines.push(`#### ${k.title}`);
        if (k.content_preview) lines.push("", k.content_preview);
        lines.push("");
      }
    }

    // Principles as blockquotes
    if (principles.length > 0) {
      lines.push("### Principles");
      lines.push("");
      for (const p of principles) {
        lines.push(`> **${p.title}**`);
        if (p.content_preview) {
          lines.push(`> ${p.content_preview.replace(/\n/g, "\n> ")}`);
        }
        lines.push("");
      }
    }

    // Research
    if (research.length > 0) {
      lines.push("### Research");
      lines.push("");
      for (const r of research) {
        lines.push(`#### ${r.title}`);
        if (r.content_preview) lines.push("", r.content_preview);
        lines.push("");
      }
    }

    // Other
    if (other.length > 0) {
      for (const o of other) {
        lines.push(`#### ${o.title}`);
        if (o.content_preview) lines.push("", o.content_preview);
        lines.push("");
      }
    }

    lines.push("---");
    lines.push("");
  }

  // Shared context at the bottom
  if (sharedItems.length > 0) {
    lines.push("## Shared Context");
    lines.push("");
    for (const item of sharedItems) {
      const prefix = item.category === "PRINCIPLE" ? "> " : "";
      if (item.category === "PRINCIPLE") {
        lines.push(`> **${item.title}**`);
        if (item.content_preview) {
          lines.push(`> ${item.content_preview.replace(/\n/g, "\n> ")}`);
        }
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
  onClose: () => void;
}

export function CanonicalDocumentView({ bundle, items, onClose }: CanonicalDocumentViewProps) {
  const { toast } = useToast();
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Generate the canonical document on first render
  const generatedContent = useMemo(() => generateCanonicalDocument(bundle, items), [bundle, items]);

  const [content, setContent] = useState(generatedContent);
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("split");
  const [dirty, setDirty] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleContentChange = (v: string) => {
    setContent(v);
    setDirty(true);
  };

  const handleRegenerate = useCallback(() => {
    const fresh = generateCanonicalDocument(bundle, items);
    setContent(fresh);
    setDirty(false);
    toast({ title: "Document regenerated", description: "Content rebuilt from current playbook items." });
  }, [bundle, items, toast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bundle.title.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [content, bundle.title]);

  const handleSyncToPlaybooks = useCallback(async () => {
    setSyncing(true);
    // For now, show a toast indicating this will be available soon
    toast({
      title: "Coming soon",
      description: "Re-extraction from edited document to playbooks will be available in a future update.",
    });
    setSyncing(false);
  }, [toast]);

  // Detect divergence from generated
  const isDiverged = content !== generatedContent;

  return (
    <div className="flex flex-col h-[600px] border-t border-border/30 bg-card/50">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2 bg-card/80 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-semibold truncate">📖 {bundle.title} — Document View</h3>
          {dirty && (
            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 shrink-0">
              Edited
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

          {dirty && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] gap-1 border-primary/30 text-primary"
              onClick={handleSyncToPlaybooks}
              disabled={syncing}
            >
              {syncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowUpFromLine className="h-3 w-3" />}
              Sync to Playbooks
            </Button>
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
          <span>Your document has been edited. Use "Sync to Playbooks" to push changes, or "Regenerate" to reset from current playbook state.</span>
        </div>
      )}

      {/* Editor body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Edit pane */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div className={`min-w-0 flex flex-col ${viewMode === "split" ? "w-1/2 border-r border-border/50" : "flex-1"}`}>
            <MarkdownToolbar textareaRef={editorRef} content={content} onChange={handleContentChange} />
            <Textarea
              ref={editorRef}
              value={content}
              onChange={e => handleContentChange(e.target.value)}
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
              }}
              className="flex-1 w-full resize-none border-none rounded-none bg-transparent px-6 py-4 font-mono text-sm focus-visible:ring-0 leading-relaxed"
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
      </div>
    </div>
  );
}
