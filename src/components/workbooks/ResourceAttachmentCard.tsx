import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  FileText, Link2, Type as TypeIcon, ExternalLink,
  ChevronDown, ChevronUp, Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AttachmentData {
  id: string;
  title: string;
  type: string; // resource_type: text | link | file
  url?: string;
  content?: string;
  metadata?: Record<string, unknown>;
}

const TYPE_ICON_MAP: Record<string, React.ReactNode> = {
  text: <TypeIcon className="h-3 w-3 shrink-0" />,
  link: <Link2 className="h-3 w-3 shrink-0" />,
  file: <FileText className="h-3 w-3 shrink-0" />,
};

export function ResourceAttachmentCard({
  attachment,
  isOwn = false,
}: {
  attachment: AttachmentData;
  isOwn?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasPreviewableContent = attachment.type === "text" && attachment.content && attachment.content.length > 0;
  const isDraft = (attachment.metadata as any)?.source === "draft_factory";

  return (
    <div
      className={`rounded-md border text-xs mb-1.5 overflow-hidden transition-colors ${
        isOwn
          ? "border-primary-foreground/20 bg-primary-foreground/10"
          : "border-border/50 bg-muted/50"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 px-2.5 py-1.5">
        {TYPE_ICON_MAP[attachment.type] ?? <FileText className="h-3 w-3 shrink-0" />}
        <span className="font-medium truncate flex-1">{attachment.title}</span>
        {isDraft && (
          <Badge variant="outline" className="text-[8px] border-primary/30 text-primary px-1 shrink-0">
            Draft
          </Badge>
        )}
        {/* External links */}
        {attachment.type === "link" && attachment.content && (
          <a
            href={attachment.content}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 hover:text-primary"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {attachment.type === "file" && attachment.url && (
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 hover:text-primary"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {/* Expand/collapse for text content */}
        {hasPreviewableContent && (
          <button
            onClick={() => setExpanded(prev => !prev)}
            className="shrink-0 p-0.5 rounded hover:bg-primary/10 transition-colors"
            title={expanded ? "Collapse" : "Preview content"}
          >
            {expanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <Eye className="h-3 w-3" />
            )}
          </button>
        )}
      </div>

      {/* Expandable content preview */}
      {expanded && hasPreviewableContent && (
        <div className={`border-t px-2.5 py-2 ${isOwn ? "border-primary-foreground/15" : "border-border/40"}`}>
          <ScrollArea className="max-h-48">
            <div className="prose prose-sm prose-invert max-w-none text-[11px] leading-relaxed [&_p]:my-0.5 [&_ul]:my-0.5 [&_ol]:my-0.5 [&_li]:my-0 [&_h1]:text-xs [&_h2]:text-[11px] [&_h3]:text-[11px] [&_code]:text-[10px] [&_code]:bg-muted [&_code]:px-1 [&_code]:rounded">
              <ReactMarkdown>{attachment.content!}</ReactMarkdown>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Collapsed snippet for text */}
      {!expanded && hasPreviewableContent && (
        <div className={`border-t px-2.5 py-1 ${isOwn ? "border-primary-foreground/10" : "border-border/30"}`}>
          <p className="text-[10px] text-muted-foreground line-clamp-2">
            {attachment.content!.slice(0, 150)}{attachment.content!.length > 150 ? "…" : ""}
          </p>
        </div>
      )}
    </div>
  );
}

export type { AttachmentData };
