import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Globe, Users, BookOpen, MessageSquare, User } from "lucide-react";

interface ContextLayer {
  level: string;
  label: string;
  icon: React.ReactNode;
  items: { title: string; category: string; action: string; overridden?: boolean }[];
  color: string;
}

const MOCK_STACK: ContextLayer[] = [
  {
    level: "org", label: "Organization", icon: <Globe className="h-4 w-4" />, color: "border-warning/40 bg-warning/5",
    items: [
      { title: "GDPR Data Handling Directive", category: "DIRECTIVE", action: "OVERRIDE" },
      { title: "Never Discount Below 15%", category: "DIRECTIVE", action: "BLOCK" },
      { title: "Brand Voice Guidelines", category: "PREFERENCE", action: "APPEND" },
    ],
  },
  {
    level: "domain", label: "Domain — Sales", icon: <Users className="h-4 w-4" />, color: "border-info/40 bg-info/5",
    items: [
      { title: "Enterprise Pricing Protocol", category: "PLAYBOOK", action: "OVERRIDE" },
      { title: "Competitor Battlecard: Acme", category: "KNOWLEDGE", action: "APPEND" },
    ],
  },
  {
    level: "workbook", label: "Workbook — Q1 OKR Planning", icon: <BookOpen className="h-4 w-4" />, color: "border-primary/40 bg-primary/5",
    items: [
      { title: "Q1 Success Metrics", category: "KNOWLEDGE", action: "APPEND" },
      { title: "OKR Template v2", category: "PROCEDURE", action: "APPEND" },
      { title: "Discount Floor Override", category: "DIRECTIVE", action: "OVERRIDE", overridden: true },
    ],
  },
  {
    level: "chat", label: "Active Chat Session", icon: <MessageSquare className="h-4 w-4" />, color: "border-success/40 bg-success/5",
    items: [
      { title: "Pinned: Industry Benchmark 2026", category: "KNOWLEDGE", action: "APPEND" },
    ],
  },
  {
    level: "user", label: "User Preferences", icon: <User className="h-4 w-4" />, color: "border-muted-foreground/40 bg-muted/50",
    items: [
      { title: "Preferred Communication Style", category: "PREFERENCE", action: "APPEND" },
    ],
  },
];

const actionColors: Record<string, string> = {
  OVERRIDE: "border-destructive/30 text-destructive",
  BLOCK: "border-destructive/30 text-destructive",
  APPEND: "border-primary/30 text-primary",
};

const categoryColors: Record<string, string> = {
  DIRECTIVE: "text-destructive",
  KNOWLEDGE: "text-info",
  PROCEDURE: "text-success",
  PLAYBOOK: "text-warning",
  PREFERENCE: "text-muted-foreground",
};

interface ContextStackViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContextStackViewer({ open, onOpenChange }: ContextStackViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Context Stack — Active Inheritance</DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Items flow top-down. OVERRIDE and BLOCK actions at lower levels replace higher-level items.
          </p>
        </DialogHeader>

        <div className="space-y-1 mt-2">
          {MOCK_STACK.map((layer, idx) => (
            <div key={layer.level}>
              {/* Inheritance arrow */}
              {idx > 0 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
                </div>
              )}

              {/* Layer card */}
              <div className={`rounded-lg border p-3 ${layer.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  {layer.icon}
                  <span className="text-xs font-semibold uppercase tracking-wider">{layer.label}</span>
                  <Badge variant="outline" className="text-[9px] ml-auto">{layer.items.length} items</Badge>
                </div>

                <div className="space-y-1">
                  {layer.items.map(item => (
                    <div
                      key={item.title}
                      className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs ${
                        item.overridden ? "opacity-40 line-through" : ""
                      } bg-background/50`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`font-medium truncate ${item.overridden ? "" : categoryColors[item.category] ?? ""}`}>
                          {item.title}
                        </span>
                        <Badge variant="outline" className="text-[8px] shrink-0">{item.category}</Badge>
                      </div>
                      <Badge variant="outline" className={`text-[8px] shrink-0 ${actionColors[item.action] ?? ""}`}>
                        {item.action}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-md bg-secondary/50 p-3">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">How inheritance works:</strong> Items flow from Org → Domain → Workbook → Chat → User.
            An <Badge variant="outline" className="text-[8px] border-destructive/30 text-destructive mx-0.5 inline">OVERRIDE</Badge> at a lower level replaces the same item from above.
            A <Badge variant="outline" className="text-[8px] border-destructive/30 text-destructive mx-0.5 inline">BLOCK</Badge> prevents the item from being injected entirely.
            Strikethrough items have been overridden by a lower level.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
