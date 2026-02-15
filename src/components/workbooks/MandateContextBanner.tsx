import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield, ShieldAlert, ShieldCheck, ShieldOff,
  ChevronDown, ChevronUp, AlertTriangle, Info, Ban, Check,
  Eye, EyeOff,
} from "lucide-react";

interface Mandate {
  id: string;
  title: string;
  content_full: string;
  enforcement_level: "advisory" | "required_ack" | "blocking";
  mandate_description: string | null;
  mandate_scope: any;
  priority: string;
  category: string;
}

const ENFORCEMENT_CONFIG = {
  advisory: {
    icon: <Info className="h-3 w-3" />,
    label: "Advisory",
    color: "text-info",
    bgColor: "bg-info/10 border-info/30",
    badgeColor: "bg-info/15 text-info border-info/30",
    description: "Guidance — agent considers this but won't block actions",
  },
  required_ack: {
    icon: <AlertTriangle className="h-3 w-3" />,
    label: "Requires Acknowledgment",
    color: "text-warning",
    bgColor: "bg-warning/10 border-warning/30",
    badgeColor: "bg-warning/15 text-warning border-warning/30",
    description: "Must be acknowledged before workbook can progress",
  },
  blocking: {
    icon: <Ban className="h-3 w-3" />,
    label: "Blocking",
    color: "text-destructive",
    bgColor: "bg-destructive/10 border-destructive/30",
    badgeColor: "bg-destructive/15 text-destructive border-destructive/30",
    description: "Hard gate — blocks status transitions until resolved",
  },
};

function MandateItem({ mandate, workbookId, compact }: { mandate: Mandate; workbookId: string; compact?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const { user } = useAuth();
  const config = ENFORCEMENT_CONFIG[mandate.enforcement_level];

  // Check if already acknowledged
  const { data: ackData } = useQuery({
    queryKey: ["mandate-ack", mandate.id, workbookId],
    enabled: !!user && mandate.enforcement_level !== "advisory",
    queryFn: async () => {
      const { data } = await supabase
        .from("mandate_acknowledgments")
        .select("id, status")
        .eq("mandate_id", mandate.id)
        .eq("workbook_id", workbookId)
        .eq("acknowledged_by", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const isAcked = !!ackData || acknowledged;

  const handleAcknowledge = async () => {
    if (!user) return;
    await supabase.from("mandate_acknowledgments").insert({
      mandate_id: mandate.id,
      workbook_id: workbookId,
      acknowledged_by: user.id,
      status: "acknowledged",
    } as any);
    setAcknowledged(true);
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 rounded px-2 py-1 text-[10px] border ${config.bgColor}`}>
        <span className={config.color}>{config.icon}</span>
        <span className="font-medium truncate">{mandate.title}</span>
        {isAcked && <Check className="h-2.5 w-2.5 text-success shrink-0" />}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border overflow-hidden transition-all ${config.bgColor}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-3 py-2 text-left"
      >
        <span className={`shrink-0 ${config.color}`}>{config.icon}</span>
        <span className="flex-1 text-xs font-medium truncate">{mandate.title}</span>
        <Badge variant="outline" className={`text-[8px] shrink-0 ${config.badgeColor}`}>
          {config.label}
        </Badge>
        {isAcked && (
          <Badge variant="outline" className="text-[8px] bg-success/10 text-success border-success/30 gap-0.5 shrink-0">
            <Check className="h-2 w-2" /> Acknowledged
          </Badge>
        )}
        {expanded ? <ChevronUp className="h-3 w-3 text-muted-foreground shrink-0" /> : <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-inherit px-3 py-2.5 space-y-2">
          <p className="text-[11px] text-muted-foreground">{config.description}</p>
          
          <div className="rounded-md bg-background/50 p-2.5">
            <p className="text-xs leading-relaxed">{mandate.content_full}</p>
          </div>

          {mandate.mandate_description && (
            <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
              <Info className="h-3 w-3 shrink-0 mt-0.5" />
              <span>{mandate.mandate_description}</span>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[8px]">{mandate.category}</Badge>
            <Badge variant="outline" className="text-[8px]">{mandate.priority}</Badge>
            <Badge variant="outline" className="text-[8px]">
              Scope: {mandate.mandate_scope?.type || "organization"}
            </Badge>
          </div>

          {/* Context injection explanation */}
          <div className="rounded-md bg-background/80 border border-border/30 px-2.5 py-2 text-[10px] space-y-1">
            <p className="font-medium text-foreground/80">⚡ How this mandate is applied:</p>
            {mandate.enforcement_level === "advisory" && (
              <>
                <p className="text-muted-foreground">• Injected into agent context as a soft directive</p>
                <p className="text-muted-foreground">• Agent will factor this into recommendations</p>
                <p className="text-muted-foreground">• No workflow blocking — treated as best practice guidance</p>
              </>
            )}
            {mandate.enforcement_level === "required_ack" && (
              <>
                <p className="text-muted-foreground">• Pinned at top of every chat & subchat in scope</p>
                <p className="text-muted-foreground">• Agent will actively reference this in responses</p>
                <p className="text-muted-foreground">• Workbook cannot move to "completed" until acknowledged</p>
                {!isAcked && (
                  <Button 
                    size="sm" 
                    className="h-6 text-[10px] mt-1 gap-1"
                    onClick={(e) => { e.stopPropagation(); handleAcknowledge(); }}
                  >
                    <Check className="h-3 w-3" /> Acknowledge Mandate
                  </Button>
                )}
              </>
            )}
            {mandate.enforcement_level === "blocking" && (
              <>
                <p className="text-muted-foreground">• <strong>Hard gate</strong> — injected as a top-priority constraint</p>
                <p className="text-muted-foreground">• Agent will refuse to proceed with actions that violate this</p>
                <p className="text-muted-foreground">• Workbook status transitions blocked until compliance verified</p>
                <p className="text-muted-foreground">• Violations trigger automatic escalation to leadership</p>
                {!isAcked && (
                  <Button 
                    size="sm"
                    variant="destructive" 
                    className="h-6 text-[10px] mt-1 gap-1"
                    onClick={(e) => { e.stopPropagation(); handleAcknowledge(); }}
                  >
                    <ShieldCheck className="h-3 w-3" /> Acknowledge & Confirm Compliance
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function MandateContextBanner({ workbookId, compact = false }: { workbookId: string; compact?: boolean }) {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const { data: mandates = [] } = useQuery({
    queryKey: ["active-mandates", workbookId],
    enabled: !!user,
    queryFn: async () => {
      // Get all active mandates that apply to this workbook (org-wide + workbook-scoped)
      const { data, error } = await supabase
        .from("context_items")
        .select("id, title, content_full, enforcement_level, mandate_description, mandate_scope, priority, category")
        .eq("is_mandate", true)
        .eq("mandate_status", "active")
        .eq("owner_id", user!.id)
        .is("deleted_at", null);
      if (error) throw error;

      // Filter to mandates that apply to this workbook
      return (data || []).filter((m: any) => {
        const scope = m.mandate_scope;
        if (!scope || scope.type === "organization") return true;
        if (scope.type === "workbook" && scope.workbook_ids?.includes(workbookId)) return true;
        return false;
      }) as Mandate[];
    },
  });

  if (mandates.length === 0) return null;

  const blocking = mandates.filter(m => m.enforcement_level === "blocking");
  const required = mandates.filter(m => m.enforcement_level === "required_ack");
  const advisory = mandates.filter(m => m.enforcement_level === "advisory");

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <Shield className="h-3 w-3 text-muted-foreground shrink-0" />
        {mandates.slice(0, 3).map(m => (
          <MandateItem key={m.id} mandate={m} workbookId={workbookId} compact />
        ))}
        {mandates.length > 3 && (
          <Badge variant="outline" className="text-[8px]">+{mandates.length - 3} more</Badge>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/50 bg-card/50 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-secondary/30 transition-colors"
      >
        <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="text-xs font-semibold flex-1">Active Mandates</span>
        <div className="flex items-center gap-1.5">
          {blocking.length > 0 && (
            <Badge variant="outline" className="text-[8px] bg-destructive/10 text-destructive border-destructive/30 gap-0.5">
              <Ban className="h-2 w-2" /> {blocking.length} blocking
            </Badge>
          )}
          {required.length > 0 && (
            <Badge variant="outline" className="text-[8px] bg-warning/10 text-warning border-warning/30 gap-0.5">
              <AlertTriangle className="h-2 w-2" /> {required.length} required
            </Badge>
          )}
          {advisory.length > 0 && (
            <Badge variant="outline" className="text-[8px] bg-info/10 text-info border-info/30 gap-0.5">
              <Info className="h-2 w-2" /> {advisory.length} advisory
            </Badge>
          )}
        </div>
        {collapsed ? <Eye className="h-3 w-3 text-muted-foreground" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
      </button>

      {/* Mandate list */}
      {!collapsed && (
        <div className="border-t border-border/30 p-2 space-y-1.5">
          {/* Blocking first, then required, then advisory */}
          {[...blocking, ...required, ...advisory].map(mandate => (
            <MandateItem key={mandate.id} mandate={mandate} workbookId={workbookId} />
          ))}
        </div>
      )}
    </div>
  );
}
