import { useRef, useEffect, useState, useMemo, forwardRef, useImperativeHandle } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

interface GutterDiffEditorProps {
  value: string;
  baseline: string;
  onChange: (v: string) => void;
  onMouseUp?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  className?: string;
  placeholder?: string;
  /** Lines recently replaced by the AI copilot (start, end inclusive, 0-indexed) */
  copilotRange?: { start: number; end: number } | null;
}

type LineStatus = "unchanged" | "modified" | "added" | "deleted";

function diffLines(baseline: string, current: string): { status: LineStatus; lineNum: number }[] {
  const baseLines = baseline.split("\n");
  const currLines = current.split("\n");
  const result: { status: LineStatus; lineNum: number }[] = [];

  const maxLen = Math.max(baseLines.length, currLines.length);
  for (let i = 0; i < maxLen; i++) {
    if (i >= baseLines.length) {
      result.push({ status: "added", lineNum: i });
    } else if (i >= currLines.length) {
      result.push({ status: "deleted", lineNum: i });
    } else if (baseLines[i] !== currLines[i]) {
      result.push({ status: "modified", lineNum: i });
    } else {
      result.push({ status: "unchanged", lineNum: i });
    }
  }
  return result;
}

const statusColors: Record<LineStatus, string> = {
  unchanged: "bg-transparent",
  modified: "bg-amber-500",
  added: "bg-emerald-500",
  deleted: "bg-red-500",
};

const statusLabels: Record<LineStatus, string> = {
  unchanged: "",
  modified: "Modified",
  added: "Added",
  deleted: "Removed",
};

export const GutterDiffEditor = forwardRef<HTMLTextAreaElement, GutterDiffEditorProps>(
  ({ value, baseline, onChange, onMouseUp, onKeyDown, className = "", placeholder, copilotRange }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const gutterRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);

    useImperativeHandle(ref, () => textareaRef.current!);

    // Sync gutter scroll with textarea scroll
    useEffect(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      const handler = () => {
        setScrollTop(ta.scrollTop);
        if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
      };
      ta.addEventListener("scroll", handler);
      return () => ta.removeEventListener("scroll", handler);
    }, []);

    const lineDiffs = useMemo(() => diffLines(baseline, value), [baseline, value]);
    const lineCount = value.split("\n").length;
    const hasChanges = lineDiffs.some(d => d.status !== "unchanged");

    // Compute line height (approx 20px for text-sm mono)
    const lineHeight = 20;

    // Copilot highlight fade effect
    const [fadingRange, setFadingRange] = useState<{ start: number; end: number } | null>(null);
    useEffect(() => {
      if (copilotRange) {
        setFadingRange(copilotRange);
        const timer = setTimeout(() => setFadingRange(null), 2000);
        return () => clearTimeout(timer);
      }
    }, [copilotRange]);

    return (
      <div className={`flex flex-1 min-h-0 ${className}`}>
        {/* Gutter */}
        <div
          ref={gutterRef}
          className="w-6 shrink-0 overflow-hidden relative border-r border-border/30 bg-card/30"
          style={{ paddingTop: "16px" }}
        >
          <div style={{ transform: `translateY(-${scrollTop}px)` }}>
            <TooltipProvider delayDuration={150}>
              {Array.from({ length: lineCount }, (_, i) => {
                const diff = lineDiffs[i];
                const status = diff?.status ?? "unchanged";
                if (status === "unchanged") {
                  return <div key={i} style={{ height: lineHeight }} />;
                }
                return (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div style={{ height: lineHeight }} className="flex items-center justify-center">
                        <div className={`w-1.5 h-3 rounded-sm ${statusColors[status]} opacity-80`} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="text-[10px] py-0.5 px-1.5">
                      {statusLabels[status]} (line {i + 1})
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        </div>

        {/* Textarea with optional copilot highlight overlay */}
        <div className="flex-1 relative">
          {fadingRange && (
            <div
              className="absolute left-0 right-0 pointer-events-none z-10 bg-emerald-500/15 transition-opacity duration-2000"
              style={{
                top: `${16 + fadingRange.start * lineHeight}px`,
                height: `${(fadingRange.end - fadingRange.start + 1) * lineHeight}px`,
                transform: `translateY(-${scrollTop}px)`,
              }}
            />
          )}
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onMouseUp={onMouseUp}
            onKeyDown={onKeyDown}
            className="flex-1 w-full h-full resize-none border-none rounded-none bg-transparent px-4 py-4 font-mono text-sm focus-visible:ring-0 leading-[20px]"
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  }
);

GutterDiffEditor.displayName = "GutterDiffEditor";
