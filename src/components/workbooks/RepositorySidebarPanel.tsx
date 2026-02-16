import { useNavigate } from "react-router-dom";
import { Package, FileText, Link2, Type, Edit3, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkbookResources, type WorkbookResource } from "@/components/workbooks/WorkbookResources";

const TYPE_ICON: Record<string, React.ReactNode> = {
  text: <Type className="h-3 w-3" />,
  link: <Link2 className="h-3 w-3" />,
  file: <FileText className="h-3 w-3" />,
};

export function RepositorySidebarPanel({ workbookId }: { workbookId: string }) {
  const navigate = useNavigate();
  const { data: resources = [], isLoading } = useWorkbookResources(workbookId);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
          <Package className="h-3 w-3" /> Repository
        </p>
        <Badge variant="outline" className="text-[9px]">{resources.length}</Badge>
      </div>
      {isLoading ? (
        <p className="text-[10px] text-muted-foreground">Loading…</p>
      ) : resources.length === 0 ? (
        <p className="text-[10px] text-muted-foreground">No items yet</p>
      ) : (
        <ScrollArea className="max-h-48">
          <div className="space-y-1">
            {resources.slice(0, 10).map(r => (
              <div
                key={r.id}
                className="group flex items-center gap-2 rounded-md bg-secondary/50 px-2.5 py-1.5 text-xs hover:bg-secondary transition-colors cursor-pointer"
                onClick={() => {
                  if (r.resource_type === "text") {
                    navigate(`/workbooks/${workbookId}/resources/${r.id}`);
                  }
                }}
              >
                {TYPE_ICON[r.resource_type] ?? <FileText className="h-3 w-3" />}
                <span className="truncate flex-1">{r.title}</span>
                {r.resource_type === "text" && (
                  <Edit3 className="h-2.5 w-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                )}
              </div>
            ))}
            {resources.length > 10 && (
              <p className="text-[10px] text-muted-foreground text-center py-1">
                +{resources.length - 10} more
              </p>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}