import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { MockContextItem } from "@/data/mockContextItems";

// ── Types ──

export interface DocBlock {
  id: string; // item UUID or "__header__"
  title: string;
  body: string;
  /** Markdown heading level: 1 for H1, 2 for H2, etc. */
  level: number;
  /** Original category from the item for rendering hints */
  category?: string;
  /** Whether this is a blockquote-style item (principles) */
  isBlockquote?: boolean;
  /** Whether this is a numbered step */
  isStep?: boolean;
  stepNumber?: number;
}

export interface BlockDiff {
  titleChanged: boolean;
  bodyChanged: boolean;
  isNew: boolean;
  isDeleted: boolean;
  /** Word-level diffs for the body */
  bodyWordDiffs?: WordDiff[];
  /** Word-level diffs for the title */
  titleWordDiffs?: WordDiff[];
}

interface WordDiff {
  text: string;
  type: "unchanged" | "added" | "removed";
}

// ── Parsing: markdown with markers → blocks ──

const ITEM_MARKER_RE = /<!-- item:([a-f0-9-]+) -->/g;

export function parseMarkdownToBlocks(md: string, items: MockContextItem[]): DocBlock[] {
  const blocks: DocBlock[] = [];
  const markers = [...md.matchAll(ITEM_MARKER_RE)];

  // Header block (content before first marker)
  const headerEnd = markers.length > 0 ? markers[0].index! : md.length;
  const headerContent = md.slice(0, headerEnd).trimEnd();
  if (headerContent) {
    const { title, body, level } = parseSection(headerContent);
    blocks.push({ id: "__header__", title, body, level: level || 1 });
  }

  // Item blocks
  for (let i = 0; i < markers.length; i++) {
    const markerId = markers[i][1];
    const start = markers[i].index! + markers[i][0].length;
    const end = i + 1 < markers.length ? markers[i + 1].index! : md.length;
    const sectionContent = md.slice(start, end).trim();

    const item = items.find(it => it.id === markerId);
    const { title, body, level, isBlockquote, isStep, stepNumber } = parseSection(sectionContent);

    blocks.push({
      id: markerId,
      title,
      body,
      level: level || 3,
      category: item?.category,
      isBlockquote,
      isStep,
      stepNumber,
    });
  }

  return blocks;
}

function parseSection(content: string): {
  title: string; body: string; level: number;
  isBlockquote?: boolean; isStep?: boolean; stepNumber?: number;
} {
  const lines = content.split("\n");
  const firstNonEmpty = lines.findIndex(l => l.trim());
  if (firstNonEmpty === -1) return { title: "", body: "", level: 3 };

  const first = lines[firstNonEmpty];

  // Heading: ## Title
  const headingMatch = first.match(/^(#{1,4})\s+(.+)/);
  if (headingMatch) {
    return {
      title: headingMatch[2].trim(),
      body: lines.slice(firstNonEmpty + 1).join("\n").trim(),
      level: headingMatch[1].length,
    };
  }

  // Numbered step: 1. **Title**
  const stepMatch = first.match(/^(\d+)\.\s+\*\*(.+?)\*\*(.*)/);
  if (stepMatch) {
    const rest = stepMatch[3] ? stepMatch[3].trim() : "";
    // Strip 3-space indentation that generateCanonicalDocument adds
    const bodyLines = lines.slice(firstNonEmpty + 1)
      .map(l => l.replace(/^   /, ""))
      .join("\n").trim();
    return {
      title: stepMatch[2].trim(),
      body: rest ? `${rest}\n${bodyLines}`.trim() : bodyLines,
      level: 4,
      isStep: true,
      stepNumber: parseInt(stepMatch[1]),
    };
  }

  // Blockquote: > **Title**
  const bqMatch = first.match(/^>\s+\*\*(?:⚠️\s*)?(.+?)\*\*/);
  if (bqMatch) {
    const bodyLines = lines.slice(firstNonEmpty + 1)
      .map(l => l.replace(/^>\s?/, ""))
      .join("\n").trim();
    return {
      title: bqMatch[1].trim(),
      body: bodyLines,
      level: 3,
      isBlockquote: true,
    };
  }

  // Horizontal rule (section separator) – treat as empty structural block
  if (first.trim() === "---") {
    return { title: "---", body: "", level: 0 };
  }

  // Fallback: first line as title
  return {
    title: first.trim(),
    body: lines.slice(firstNonEmpty + 1).join("\n").trim(),
    level: 3,
  };
}

// ── Reconstruct: blocks → markdown with markers ──

export function blocksToMarkdown(blocks: DocBlock[]): string {
  const lines: string[] = [];

  for (const block of blocks) {
    // Separator blocks
    if (block.title === "---" && block.level === 0) {
      lines.push("---", "");
      continue;
    }

    // Add marker (except header)
    if (block.id !== "__header__") {
      lines.push(`<!-- item:${block.id} -->`);
    }

    // Render based on type
    if (block.isBlockquote) {
      lines.push(`> **${block.title}**`);
      if (block.body) {
        lines.push(...block.body.split("\n").map(l => `> ${l}`));
      }
    } else if (block.isStep && block.stepNumber) {
      lines.push(`${block.stepNumber}. **${block.title}**`);
      if (block.body) {
        // Add 3-space indentation to match generateCanonicalDocument format
        lines.push(...block.body.split("\n").map(l => `   ${l}`));
      }
    } else {
      const hashes = "#".repeat(block.level || 2);
      lines.push(`${hashes} ${block.title}`);
      if (block.body) {
        lines.push("", block.body);
      }
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

// ── Word-level diff ──

function computeWordDiffs(oldText: string, newText: string): WordDiff[] {
  if (oldText === newText) return [{ text: newText, type: "unchanged" }];
  if (!oldText) return [{ text: newText, type: "added" }];
  if (!newText) return [{ text: oldText, type: "removed" }];

  const oldWords = oldText.split(/(\s+)/);
  const newWords = newText.split(/(\s+)/);

  // Simple LCS-based word diff
  const diffs: WordDiff[] = [];
  let oi = 0, ni = 0;

  while (oi < oldWords.length && ni < newWords.length) {
    if (oldWords[oi] === newWords[ni]) {
      diffs.push({ text: newWords[ni], type: "unchanged" });
      oi++; ni++;
    } else {
      // Look ahead to find match
      const lookNew = newWords.indexOf(oldWords[oi], ni);
      const lookOld = oldWords.indexOf(newWords[ni], oi);

      if (lookNew !== -1 && (lookOld === -1 || lookNew - ni <= lookOld - oi)) {
        // newWords has extra words before matching
        for (let j = ni; j < lookNew; j++) {
          diffs.push({ text: newWords[j], type: "added" });
        }
        ni = lookNew;
      } else if (lookOld !== -1) {
        // oldWords has extra words before matching
        for (let j = oi; j < lookOld; j++) {
          diffs.push({ text: oldWords[j], type: "removed" });
        }
        oi = lookOld;
      } else {
        diffs.push({ text: oldWords[oi], type: "removed" });
        diffs.push({ text: newWords[ni], type: "added" });
        oi++; ni++;
      }
    }
  }

  while (oi < oldWords.length) {
    diffs.push({ text: oldWords[oi++], type: "removed" });
  }
  while (ni < newWords.length) {
    diffs.push({ text: newWords[ni++], type: "added" });
  }

  return diffs;
}

// ── Compute block-level diffs ──

export function computeBlockDiffs(
  baselineBlocks: DocBlock[],
  currentBlocks: DocBlock[]
): Map<string, BlockDiff> {
  const diffs = new Map<string, BlockDiff>();
  const baseMap = new Map(baselineBlocks.map(b => [b.id, b]));

  for (const block of currentBlocks) {
    if (block.title === "---" && block.level === 0) continue;
    const base = baseMap.get(block.id);
    if (!base) {
      diffs.set(block.id, {
        titleChanged: false, bodyChanged: false,
        isNew: true, isDeleted: false,
      });
      continue;
    }

    const titleChanged = base.title !== block.title;
    const bodyChanged = base.body !== block.body;

    if (titleChanged || bodyChanged) {
      diffs.set(block.id, {
        titleChanged,
        bodyChanged,
        isNew: false,
        isDeleted: false,
        titleWordDiffs: titleChanged ? computeWordDiffs(base.title, block.title) : undefined,
        bodyWordDiffs: bodyChanged ? computeWordDiffs(base.body, block.body) : undefined,
      });
    }
  }

  // Detect deleted blocks
  const currentIds = new Set(currentBlocks.map(b => b.id));
  for (const base of baselineBlocks) {
    if (!currentIds.has(base.id) && base.title !== "---") {
      diffs.set(base.id, {
        titleChanged: false, bodyChanged: false,
        isNew: false, isDeleted: true,
      });
    }
  }

  return diffs;
}

// ── WordDiffDisplay: inline word-level highlights ──

function WordDiffDisplay({ diffs }: { diffs: WordDiff[] }) {
  return (
    <span>
      {diffs.map((d, i) => {
        if (d.type === "unchanged") return <span key={i}>{d.text}</span>;
        if (d.type === "added") {
          return (
            <span key={i} className="bg-emerald-500/25 text-emerald-300 rounded-sm px-0.5">
              {d.text}
            </span>
          );
        }
        if (d.type === "removed") {
          return (
            <span key={i} className="bg-red-500/25 text-red-400 line-through rounded-sm px-0.5 opacity-70">
              {d.text}
            </span>
          );
        }
        return null;
      })}
    </span>
  );
}

// ── Category label helper ──

const categoryIcons: Record<string, string> = {
  PLAYBOOK: "📋",
  PROCEDURE: "📝",
  DIRECTIVE: "⚡",
  PRINCIPLE: "💎",
  KNOWLEDGE: "📚",
  RESEARCH: "🔬",
  PREFERENCE: "⚙️",
};

// ── Block Component ──

interface BlockProps {
  block: DocBlock;
  diff?: BlockDiff;
  onTitleChange: (id: string, title: string) => void;
  onBodyChange: (id: string, body: string) => void;
  isEditing: string | null;
  onStartEdit: (id: string) => void;
}

function DocumentBlock({ block, diff, onTitleChange, onBodyChange, isEditing, onStartEdit }: BlockProps) {
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const isActive = isEditing === block.id;
  const isSeparator = block.title === "---" && block.level === 0;

  // Auto-resize textarea
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.style.height = "auto";
      bodyRef.current.style.height = bodyRef.current.scrollHeight + "px";
    }
  }, [block.body, isActive]);

  if (isSeparator) {
    return <hr className="border-border/40 my-6" />;
  }

  // Determine border/bg for diff status
  const borderClass = diff?.isNew
    ? "border-l-2 border-l-emerald-500 bg-emerald-500/5"
    : diff?.isDeleted
    ? "border-l-2 border-l-red-500 bg-red-500/5 opacity-60"
    : (diff?.titleChanged || diff?.bodyChanged)
    ? "border-l-2 border-l-amber-500 bg-amber-500/5"
    : "border-l-2 border-l-transparent";

  // Title element sizing
  const titleSizeClass = block.level === 1
    ? "text-2xl font-bold tracking-tight"
    : block.level === 2
    ? "text-xl font-semibold"
    : block.level === 3
    ? "text-lg font-semibold"
    : "text-base font-medium";

  const showCategory = block.category && block.id !== "__header__";

  return (
    <div
      className={cn(
        "group rounded-lg px-4 py-3 transition-all cursor-text",
        borderClass,
        isActive ? "ring-1 ring-primary/30 bg-card/80" : "hover:bg-card/40"
      )}
      onClick={() => !isActive && onStartEdit(block.id)}
    >
      {/* Category + diff badges */}
      <div className="flex items-center gap-2 mb-1">
        {showCategory && (
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 text-muted-foreground border-border/40">
            {categoryIcons[block.category!] || "📄"} {block.category}
          </Badge>
        )}
        {block.isStep && block.stepNumber && (
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 text-muted-foreground border-border/40">
            Step {block.stepNumber}
          </Badge>
        )}
        {diff?.isNew && (
          <Badge className="text-[9px] px-1.5 py-0 h-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            New
          </Badge>
        )}
        {diff?.titleChanged && !diff.isNew && (
          <Badge className="text-[9px] px-1.5 py-0 h-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
            Title changed
          </Badge>
        )}
        {diff?.bodyChanged && !diff.isNew && (
          <Badge className="text-[9px] px-1.5 py-0 h-4 bg-amber-500/20 text-amber-400 border-amber-500/30">
            Content changed
          </Badge>
        )}
      </div>

      {/* Title */}
      {isActive ? (
        <Input
          value={block.title}
          onChange={e => onTitleChange(block.id, e.target.value)}
          className={cn(
            "border-none bg-transparent p-0 h-auto focus-visible:ring-0 shadow-none",
            titleSizeClass
          )}
          autoFocus={diff?.titleChanged || !block.body}
        />
      ) : (
        <div className={cn(titleSizeClass, block.isBlockquote && "italic")}>
          {diff?.titleWordDiffs ? (
            <WordDiffDisplay diffs={diff.titleWordDiffs} />
          ) : (
            block.title
          )}
        </div>
      )}

      {/* Body */}
      {(block.body || isActive) && (
        <div className="mt-2">
          {isActive ? (
            <Textarea
              ref={bodyRef}
              value={block.body}
              onChange={e => onBodyChange(block.id, e.target.value)}
              className={cn(
                "border-none bg-transparent p-0 resize-none focus-visible:ring-0 shadow-none",
                "text-sm leading-7 text-muted-foreground min-h-[28px]",
                block.isBlockquote && "border-l-2 border-primary/40 pl-4 italic"
              )}
              placeholder="Add content..."
              rows={1}
            />
          ) : (
            <div className={cn(
              "text-sm leading-7 text-muted-foreground whitespace-pre-wrap",
              block.isBlockquote && "border-l-2 border-primary/40 pl-4 italic bg-primary/5 rounded-r-md py-2"
            )}>
              {diff?.bodyWordDiffs ? (
                <WordDiffDisplay diffs={diff.bodyWordDiffs} />
              ) : (
                block.body
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Block Editor ──

interface BlockDocumentEditorProps {
  content: string;
  baseline: string;
  items: MockContextItem[];
  onChange: (newMarkdown: string) => void;
  className?: string;
  /** Called when the user selects text, with the selected text and position */
  onTextSelect?: (selectedText: string, position: { top: number; left: number }) => void;
  /** Called when selection is cleared */
  onSelectionClear?: () => void;
}

export function BlockDocumentEditor({ content, baseline, items, onChange, className, onTextSelect, onSelectionClear }: BlockDocumentEditorProps) {
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentBlocks = useMemo(() => parseMarkdownToBlocks(content, items), [content, items]);
  const baselineBlocks = useMemo(() => parseMarkdownToBlocks(baseline, items), [baseline, items]);
  const diffs = useMemo(() => computeBlockDiffs(baselineBlocks, currentBlocks), [baselineBlocks, currentBlocks]);

  const hasChanges = diffs.size > 0;

  const handleTitleChange = useCallback((id: string, newTitle: string) => {
    const updated = currentBlocks.map(b => b.id === id ? { ...b, title: newTitle } : b);
    onChange(blocksToMarkdown(updated));
  }, [currentBlocks, onChange]);

  const handleBodyChange = useCallback((id: string, newBody: string) => {
    const updated = currentBlocks.map(b => b.id === id ? { ...b, body: newBody } : b);
    onChange(blocksToMarkdown(updated));
  }, [currentBlocks, onChange]);

  // Text selection detection for copilot
  useEffect(() => {
    const handler = () => {
      const sel = window.getSelection();
      if (sel && sel.toString().trim().length > 3 && containerRef.current?.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        onTextSelect?.(sel.toString(), { top: rect.bottom + 8, left: rect.left });
      } else {
        onSelectionClear?.();
      }
    };
    document.addEventListener("mouseup", handler);
    return () => document.removeEventListener("mouseup", handler);
  }, [onTextSelect, onSelectionClear]);

  // Click outside to deselect block editing
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditingBlock(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div ref={containerRef} className="max-w-3xl mx-auto p-6 space-y-1">
        {/* Diff summary bar */}
        {hasChanges && (
          <div className="flex items-center gap-3 px-3 py-2 mb-4 rounded-md bg-secondary/30 border border-border/30 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">Changes detected:</span>
            {[...diffs.values()].filter(d => d.isNew).length > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {[...diffs.values()].filter(d => d.isNew).length} new
              </span>
            )}
            {[...diffs.values()].filter(d => !d.isNew && !d.isDeleted && (d.titleChanged || d.bodyChanged)).length > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {[...diffs.values()].filter(d => !d.isNew && !d.isDeleted && (d.titleChanged || d.bodyChanged)).length} modified
              </span>
            )}
            {[...diffs.values()].filter(d => d.isDeleted).length > 0 && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {[...diffs.values()].filter(d => d.isDeleted).length} removed
              </span>
            )}
          </div>
        )}

        {currentBlocks.map(block => (
          <DocumentBlock
            key={block.id}
            block={block}
            diff={diffs.get(block.id)}
            onTitleChange={handleTitleChange}
            onBodyChange={handleBodyChange}
            isEditing={editingBlock}
            onStartEdit={setEditingBlock}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
