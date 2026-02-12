import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowDown, Globe, Users, BookOpen, MessageSquare, User,
  ChevronRight, Eye, Shield, X, Layers,
} from "lucide-react";

export interface StackItem {
  id: string;
  title: string;
  category: string;
  action: "APPEND" | "OVERRIDE" | "BLOCK";
  overridden?: boolean;
  overriddenBy?: string;
  content?: string;
  origin?: string;
  version?: string;
}

export interface ContextLayer {
  level: string;
  label: string;
  icon: React.ReactNode;
  items: StackItem[];
  color: string;
}

// ── Mock stacks for different scopes ──

const GLOBAL_STACK: ContextLayer[] = [
  {
    level: "org", label: "Organization", icon: <Globe className="h-4 w-4" />, color: "border-warning/40 bg-warning/5",
    items: [
      { id: "g1", title: "GDPR Data Handling Directive", category: "DIRECTIVE", action: "OVERRIDE", content: "All data processing must comply with GDPR articles 5-9. Personal data retention limited to 24 months unless explicit consent obtained.", origin: "Legal Team", version: "v2.1" },
      { id: "g2", title: "Never Discount Below 15%", category: "DIRECTIVE", action: "BLOCK", content: "Minimum discount floor set at 15% for all products and services. Exceptions require VP approval.", origin: "CFO Office", version: "v1.3" },
      { id: "g3", title: "Brand Voice Guidelines", category: "PREFERENCE", action: "APPEND", content: "Professional yet approachable tone. Avoid jargon. Lead with value propositions.", origin: "Marketing", version: "v3.0" },
    ],
  },
  {
    level: "domain", label: "Domain — Sales", icon: <Users className="h-4 w-4" />, color: "border-info/40 bg-info/5",
    items: [
      { id: "g4", title: "Enterprise Pricing Protocol", category: "PLAYBOOK", action: "OVERRIDE", content: "Multi-tier pricing model for enterprise accounts. Volume discounts calculated based on ACV commitments.", origin: "Revenue Ops", version: "v2.0" },
      { id: "g5", title: "Competitor Battlecard: Acme", category: "KNOWLEDGE", action: "APPEND", content: "Acme strengths: lower entry price, broader API. Weaknesses: no enterprise SLA, limited integrations, slower support.", origin: "Competitive Intel", version: "v4.1" },
    ],
  },
  {
    level: "workbook", label: "Workbook", icon: <BookOpen className="h-4 w-4" />, color: "border-primary/40 bg-primary/5",
    items: [
      { id: "g6", title: "Q1 Success Metrics", category: "KNOWLEDGE", action: "APPEND", content: "ARR target: $12M. Net retention: 115%. New logos: 25. Pipeline coverage: 3.5x.", origin: "Strategy", version: "v1.0" },
      { id: "g7", title: "OKR Template v2", category: "PROCEDURE", action: "APPEND", content: "Use SMART format. Each objective: 2-4 key results. Quarterly check-ins mandatory.", origin: "Operations", version: "v2.0" },
      { id: "g8", title: "Discount Floor Override", category: "DIRECTIVE", action: "OVERRIDE", overridden: true, overriddenBy: "Never Discount Below 15%", content: "Attempted override of org-level discount floor — blocked by BLOCK action.", origin: "Sales Manager", version: "v1.0" },
    ],
  },
  {
    level: "chat", label: "Active Chat Session", icon: <MessageSquare className="h-4 w-4" />, color: "border-success/40 bg-success/5",
    items: [
      { id: "g9", title: "Pinned: Industry Benchmark 2026", category: "KNOWLEDGE", action: "APPEND", content: "Industry growth rate: 23% YoY. Average deal size increasing 18%. Cloud adoption: 89% of enterprises.", origin: "Pinned by User", version: "v1.0" },
    ],
  },
  {
    level: "user", label: "User Preferences", icon: <User className="h-4 w-4" />, color: "border-muted-foreground/40 bg-muted/50",
    items: [
      { id: "g10", title: "Preferred Communication Style", category: "PREFERENCE", action: "APPEND", content: "Direct and data-driven. Prefer bullet points over paragraphs. Include metrics where possible.", origin: "Personal", version: "v1.0" },
    ],
  },
];

function getWorkbookStack(workbookTitle: string): ContextLayer[] {
  return GLOBAL_STACK.filter(l => ["org", "domain", "workbook"].includes(l.level)).map(l => {
    if (l.level === "workbook") return { ...l, label: `Workbook — ${workbookTitle}` };
    return l;
  });
}

function getChatStack(workbookTitle: string, chatTitle?: string): ContextLayer[] {
  return GLOBAL_STACK.map(l => {
    if (l.level === "workbook") return { ...l, label: `Workbook — ${workbookTitle}` };
    if (l.level === "chat") return { ...l, label: chatTitle ? `Chat — ${chatTitle}` : "Active Chat Session" };
    return l;
  });
}

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

export interface ContextStackViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Scope: undefined = global, workbookTitle = workbook-level, chatTitle = chat-level */
  scope?: "global" | "workbook" | "chat";
  workbookTitle?: string;
  chatTitle?: string;
}

export function ContextStackViewer({ open, onOpenChange, scope = "global", workbookTitle, chatTitle }: ContextStackViewerProps) {
  const { activeRole } = useAuth();
  const isProcessOwner = activeRole === "architect";

  const [inspectedItem, setInspectedItem] = useState<StackItem | null>(null);
  const [overrideAction, setOverrideAction] = useState<string>("");

  const stack: ContextLayer[] =
    scope === "chat" ? getChatStack(workbookTitle ?? "Workbook", chatTitle) :
    scope === "workbook" ? getWorkbookStack(workbookTitle ?? "Workbook") :
    GLOBAL_STACK;

  const scopeLabel =
    scope === "chat" ? `Chat-Level Stack` :
    scope === "workbook" ? `Workbook-Level Stack` :
    "Full Context Stack";

  const totalItems = stack.reduce((s, l) => s + l.items.length, 0);
  const overrides = stack.reduce((s, l) => s + l.items.filter(i => i.action === "OVERRIDE" || i.action === "BLOCK").length, 0);

  const handleApplyOverride = () => {
    if (!inspectedItem || !overrideAction) return;
    // Mock: in production this would create a workbook-level override
    setInspectedItem(null);
    setOverrideAction("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setInspectedItem(null); }}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            {scopeLabel}
          </DialogTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
            <span>{stack.length} layers</span>
            <span>·</span>
            <span>{totalItems} items</span>
            <span>·</span>
            <span>{overrides} overrides/blocks</span>
            {isProcessOwner && (
              <Badge variant="outline" className="text-[9px] border-primary/30 text-primary ml-auto">
                <Shield className="h-2 w-2 mr-0.5" /> Edit Mode
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Inspection panel */}
        {inspectedItem && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold">{inspectedItem.title}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setInspectedItem(null)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{inspectedItem.content}</p>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span>Origin: {inspectedItem.origin}</span>
              <span>·</span>
              <span>Version: {inspectedItem.version}</span>
              <span>·</span>
              <Badge variant="outline" className={`text-[8px] ${actionColors[inspectedItem.action]}`}>{inspectedItem.action}</Badge>
            </div>
            {inspectedItem.overridden && inspectedItem.overriddenBy && (
              <div className="rounded-md bg-destructive/10 px-2.5 py-1.5 text-[10px] text-destructive">
                ⚠ Overridden by: {inspectedItem.overriddenBy}
              </div>
            )}

            {/* Override controls for Process Owners */}
            {isProcessOwner && !inspectedItem.overridden && (
              <div className="flex items-center gap-2 pt-1 border-t border-primary/20">
                <Select value={overrideAction} onValueChange={setOverrideAction}>
                  <SelectTrigger className="h-7 text-[10px] w-32">
                    <SelectValue placeholder="Action…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OVERRIDE">OVERRIDE</SelectItem>
                    <SelectItem value="BLOCK">BLOCK</SelectItem>
                    <SelectItem value="APPEND">APPEND</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" className="h-7 text-[10px]" disabled={!overrideAction} onClick={handleApplyOverride}>
                  Apply at {scope === "chat" ? "Chat" : scope === "workbook" ? "Workbook" : "Current"} Level
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="-mx-6 px-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 220px)' }}>
          <div className="space-y-1 mt-2 pb-4">
            {stack.map((layer, idx) => (
              <div key={layer.level}>
                {idx > 0 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
                  </div>
                )}

                <div className={`rounded-lg border p-3 ${layer.color}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {layer.icon}
                    <span className="text-xs font-semibold uppercase tracking-wider">{layer.label}</span>
                    <Badge variant="outline" className="text-[9px] ml-auto">{layer.items.length} items</Badge>
                  </div>

                  <div className="space-y-1">
                    {layer.items.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setInspectedItem(inspectedItem?.id === item.id ? null : item)}
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition-all ${
                          item.overridden ? "opacity-40 line-through" : ""
                        } ${inspectedItem?.id === item.id ? "bg-primary/10 ring-1 ring-primary/30" : "bg-background/50 hover:bg-background/80"}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ChevronRight className={`h-3 w-3 shrink-0 transition-transform ${inspectedItem?.id === item.id ? "rotate-90 text-primary" : "text-muted-foreground"}`} />
                          <span className={`font-medium truncate ${item.overridden ? "" : categoryColors[item.category] ?? ""}`}>
                            {item.title}
                          </span>
                          <Badge variant="outline" className="text-[8px] shrink-0">{item.category}</Badge>
                        </div>
                        <Badge variant="outline" className={`text-[8px] shrink-0 ${actionColors[item.action] ?? ""}`}>
                          {item.action}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md bg-secondary/50 p-3">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Inheritance:</strong> Org → Domain → Workbook → Chat → User.
            Click any item to inspect its content and origin.
            {isProcessOwner && (
              <> As a <span className="text-primary font-medium">Process Owner</span>, you can apply OVERRIDE or BLOCK actions at the current scope level.</>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
