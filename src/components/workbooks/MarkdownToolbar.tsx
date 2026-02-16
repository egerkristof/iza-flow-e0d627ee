import { useCallback } from "react";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link2, Image, Minus, CheckSquare,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  content: string;
  onChange: (value: string) => void;
}

interface ToolAction {
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  action: (ta: HTMLTextAreaElement, content: string) => { newContent: string; cursorStart: number; cursorEnd: number };
}

function wrapSelection(
  ta: HTMLTextAreaElement,
  content: string,
  before: string,
  after: string,
  placeholder: string
) {
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = content.slice(start, end) || placeholder;
  const newContent = content.slice(0, start) + before + selected + after + content.slice(end);
  const cursorStart = start + before.length;
  const cursorEnd = cursorStart + selected.length;
  return { newContent, cursorStart, cursorEnd };
}

function prefixLine(
  ta: HTMLTextAreaElement,
  content: string,
  prefix: string
) {
  const start = ta.selectionStart;
  // Find the beginning of the current line
  const lineStart = content.lastIndexOf("\n", start - 1) + 1;
  const newContent = content.slice(0, lineStart) + prefix + content.slice(lineStart);
  const cursorStart = start + prefix.length;
  return { newContent, cursorStart, cursorEnd: cursorStart };
}

const tools: (ToolAction | "sep")[] = [
  {
    icon: Bold,
    label: "Bold",
    shortcut: "Ctrl+B",
    action: (ta, c) => wrapSelection(ta, c, "**", "**", "bold text"),
  },
  {
    icon: Italic,
    label: "Italic",
    shortcut: "Ctrl+I",
    action: (ta, c) => wrapSelection(ta, c, "_", "_", "italic text"),
  },
  {
    icon: Strikethrough,
    label: "Strikethrough",
    action: (ta, c) => wrapSelection(ta, c, "~~", "~~", "strikethrough"),
  },
  "sep",
  {
    icon: Heading1,
    label: "Heading 1",
    action: (ta, c) => prefixLine(ta, c, "# "),
  },
  {
    icon: Heading2,
    label: "Heading 2",
    action: (ta, c) => prefixLine(ta, c, "## "),
  },
  {
    icon: Heading3,
    label: "Heading 3",
    action: (ta, c) => prefixLine(ta, c, "### "),
  },
  "sep",
  {
    icon: List,
    label: "Bullet list",
    action: (ta, c) => prefixLine(ta, c, "- "),
  },
  {
    icon: ListOrdered,
    label: "Numbered list",
    action: (ta, c) => prefixLine(ta, c, "1. "),
  },
  {
    icon: CheckSquare,
    label: "Task list",
    action: (ta, c) => prefixLine(ta, c, "- [ ] "),
  },
  "sep",
  {
    icon: Quote,
    label: "Blockquote",
    action: (ta, c) => prefixLine(ta, c, "> "),
  },
  {
    icon: Code,
    label: "Code block",
    action: (ta, c) => wrapSelection(ta, c, "```\n", "\n```", "code"),
  },
  {
    icon: Minus,
    label: "Horizontal rule",
    action: (ta, c) => {
      const start = ta.selectionStart;
      const before = c.slice(0, start);
      const needsNewline = before.length > 0 && !before.endsWith("\n") ? "\n" : "";
      const insert = needsNewline + "---\n";
      const newContent = before + insert + c.slice(start);
      const cursorStart = start + insert.length;
      return { newContent, cursorStart, cursorEnd: cursorStart };
    },
  },
  "sep",
  {
    icon: Link2,
    label: "Link",
    action: (ta, c) => {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = c.slice(start, end) || "link text";
      const insert = `[${selected}](url)`;
      const newContent = c.slice(0, start) + insert + c.slice(end);
      // Select "url"
      const cursorStart = start + selected.length + 3;
      const cursorEnd = cursorStart + 3;
      return { newContent, cursorStart, cursorEnd };
    },
  },
  {
    icon: Image,
    label: "Image",
    action: (ta, c) => {
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = c.slice(start, end) || "alt text";
      const insert = `![${selected}](url)`;
      const newContent = c.slice(0, start) + insert + c.slice(end);
      const cursorStart = start + selected.length + 4;
      const cursorEnd = cursorStart + 3;
      return { newContent, cursorStart, cursorEnd };
    },
  },
];

export function MarkdownToolbar({ textareaRef, content, onChange }: MarkdownToolbarProps) {
  const handleAction = useCallback(
    (tool: ToolAction) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const { newContent, cursorStart, cursorEnd } = tool.action(ta, content);
      onChange(newContent);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(cursorStart, cursorEnd);
      });
    },
    [textareaRef, content, onChange]
  );

  return (
    <div className="flex items-center gap-0.5 border-b border-border/50 bg-secondary/30 px-3 py-1.5 shrink-0 flex-wrap">
      {tools.map((tool, i) => {
        if (tool === "sep") {
          return <Separator key={`sep-${i}`} orientation="vertical" className="h-5 mx-1" />;
        }
        const Icon = tool.icon;
        return (
          <Tooltip key={tool.label}>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => handleAction(tool)}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {tool.label}{tool.shortcut ? ` (${tool.shortcut})` : ""}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

export { tools as markdownTools };
export type { ToolAction };
