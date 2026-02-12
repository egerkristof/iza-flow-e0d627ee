import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Shield, Plus, Send, Eye, CheckCircle2, AlertTriangle, Clock, ChevronRight,
  FileText, Users, Globe, Target, BarChart3, Pencil, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── Types ──
interface Mandate {
  id: string;
  title: string;
  content_full: string;
  category: string;
  mandate_status: string | null;
  enforcement_level: string | null;
  mandate_scope: any;
  mandate_description: string | null;
  published_at: string | null;
  published_by: string | null;
  created_at: string;
  owner_id: string;
  priority: string;
}

interface Acknowledgment {
  id: string;
  mandate_id: string;
  workbook_id: string;
  acknowledged_by: string;
  acknowledged_at: string;
  status: string;
  notes: string | null;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", color: "text-muted-foreground border-muted", icon: <FileText className="h-3 w-3" /> },
  published: { label: "Published", color: "text-warning border-warning/30", icon: <Send className="h-3 w-3" /> },
  active: { label: "Active", color: "text-success border-success/30", icon: <CheckCircle2 className="h-3 w-3" /> },
  superseded: { label: "Superseded", color: "text-muted-foreground border-muted", icon: <Clock className="h-3 w-3" /> },
  revoked: { label: "Revoked", color: "text-destructive border-destructive/30", icon: <X className="h-3 w-3" /> },
};

const ENFORCEMENT_CONFIG: Record<string, { label: string; description: string; color: string }> = {
  advisory: { label: "Advisory", description: "Visual indicator only", color: "text-info" },
  required_ack: { label: "Required Ack", description: "Must be acknowledged", color: "text-warning" },
  blocking: { label: "Blocking", description: "Blocks status transitions", color: "text-destructive" },
};

// ── Create/Edit Dialog ──
function MandateFormDialog({
  open,
  onOpenChange,
  editMandate,
  workbooks,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editMandate?: Mandate | null;
  workbooks: { id: string; title: string }[];
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(editMandate?.title ?? "");
  const [content, setContent] = useState(editMandate?.content_full ?? "");
  const [description, setDescription] = useState(editMandate?.mandate_description ?? "");
  const [category, setCategory] = useState(editMandate?.category ?? "DIRECTIVE");
  const [enforcement, setEnforcement] = useState(editMandate?.enforcement_level ?? "required_ack");
  const [scopeType, setScopeType] = useState<string>(
    editMandate?.mandate_scope?.type ?? "organization"
  );
  const [selectedWorkbooks, setSelectedWorkbooks] = useState<string[]>(
    editMandate?.mandate_scope?.workbook_ids ?? []
  );
  const [priority, setPriority] = useState(editMandate?.priority ?? "CRITICAL");

  const createMandate = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const scope = scopeType === "organization"
        ? { type: "organization" }
        : { type: "targeted", workbook_ids: selectedWorkbooks };

      const payload: any = {
        owner_id: user.id,
        title,
        content_full: content,
        category,
        is_mandate: true,
        mandate_status: "draft",
        enforcement_level: enforcement,
        mandate_scope: scope,
        mandate_description: description,
        priority,
        capture_status: "accepted",
      };

      if (editMandate) {
        const { error } = await supabase.from("context_items").update(payload).eq("id", editMandate.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("context_items").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mandates"] });
      toast({ title: editMandate ? "Mandate updated" : "Mandate created", description: "You can publish it when ready." });
      onOpenChange(false);
    },
    onError: (e: any) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-warning" />
            {editMandate ? "Edit Mandate" : "Create Mandate"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. All deals above $50K require VP approval" />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description (for operators)</label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Why this mandate exists and what teams should know…"
              rows={2}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Content / Rule</label>
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="The detailed mandate text that will be injected into context…"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["DIRECTIVE", "PRINCIPLE", "PROCEDURE", "KNOWLEDGE"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STANDARD">Standard</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Enforcement Level</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ENFORCEMENT_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setEnforcement(key)}
                  className={`rounded-lg border p-2.5 text-left transition-all ${
                    enforcement === key
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <div className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{cfg.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Scope</label>
            <div className="flex gap-2 mb-2">
              <Button
                variant={scopeType === "organization" ? "default" : "outline"}
                size="sm"
                className="text-xs gap-1"
                onClick={() => setScopeType("organization")}
              >
                <Globe className="h-3 w-3" /> Organization-wide
              </Button>
              <Button
                variant={scopeType === "targeted" ? "default" : "outline"}
                size="sm"
                className="text-xs gap-1"
                onClick={() => setScopeType("targeted")}
              >
                <Target className="h-3 w-3" /> Targeted
              </Button>
            </div>
            {scopeType === "targeted" && workbooks.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto border border-border/50 rounded-md p-2">
                {workbooks.map(wb => (
                  <label key={wb.id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-secondary/50 rounded px-1.5 py-1">
                    <input
                      type="checkbox"
                      checked={selectedWorkbooks.includes(wb.id)}
                      onChange={() =>
                        setSelectedWorkbooks(prev =>
                          prev.includes(wb.id) ? prev.filter(id => id !== wb.id) : [...prev, wb.id]
                        )
                      }
                      className="rounded border-border"
                    />
                    {wb.title}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => createMandate.mutate()} disabled={!title.trim() || !content.trim()}>
            {editMandate ? "Save Changes" : "Create Draft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Mandate Card ──
function MandateCard({
  mandate,
  ackCount,
  totalWorkbooks,
  onEdit,
  onPublish,
  onSelect,
  isSelected,
}: {
  mandate: Mandate;
  ackCount: number;
  totalWorkbooks: number;
  onEdit: () => void;
  onPublish: () => void;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const statusCfg = STATUS_CONFIG[mandate.mandate_status ?? "draft"];
  const enforceCfg = ENFORCEMENT_CONFIG[mandate.enforcement_level ?? "advisory"];
  const compliancePercent = totalWorkbooks > 0 ? Math.round((ackCount / totalWorkbooks) * 100) : 0;
  const isActive = mandate.mandate_status === "active" || mandate.mandate_status === "published";

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-lg border p-4 transition-all hover:border-primary/30 ${
        isSelected ? "border-primary bg-primary/5" : "border-border/50 bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Shield className={`h-3.5 w-3.5 shrink-0 ${enforceCfg.color}`} />
            <h4 className="text-sm font-medium truncate">{mandate.title}</h4>
          </div>
          {mandate.mandate_description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{mandate.mandate_description}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant="outline" className={`text-[9px] gap-0.5 ${statusCfg.color}`}>
            {statusCfg.icon} {statusCfg.label}
          </Badge>
          <Badge variant="outline" className="text-[9px]">{mandate.category}</Badge>
        </div>
      </div>

      {/* Compliance bar — only for published/active mandates */}
      {isActive && (
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Compliance</span>
            <span className={compliancePercent === 100 ? "text-success" : compliancePercent > 50 ? "text-warning" : "text-destructive"}>
              {ackCount}/{totalWorkbooks} workbooks · {compliancePercent}%
            </span>
          </div>
          <Progress value={compliancePercent} className="h-1.5" />
        </div>
      )}

      <div className="flex items-center gap-2 mt-2.5">
        <Badge variant="secondary" className={`text-[9px] gap-0.5 ${enforceCfg.color}`}>
          {enforceCfg.label}
        </Badge>
        <Badge variant="secondary" className="text-[9px] gap-0.5">
          {mandate.mandate_scope?.type === "organization" ? (
            <><Globe className="h-2 w-2" /> Org-wide</>
          ) : (
            <><Target className="h-2 w-2" /> {mandate.mandate_scope?.workbook_ids?.length ?? 0} workbooks</>
          )}
        </Badge>
        <span className="text-[10px] text-muted-foreground ml-auto">
          {new Date(mandate.created_at).toLocaleDateString()}
        </span>
      </div>
    </button>
  );
}

// ── Main Mandates Dashboard ──
export function MandatesDashboard({ compact = false }: { compact?: boolean }) {
  const { user, activeRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isLeader = activeRole === "manager";

  const [createOpen, setCreateOpen] = useState(false);
  const [editMandate, setEditMandate] = useState<Mandate | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch mandates
  const { data: mandates = [], isLoading } = useQuery({
    queryKey: ["mandates"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("context_items")
        .select("*")
        .eq("is_mandate", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as Mandate[];
    },
  });

  // Fetch all acknowledgments
  const { data: acks = [] } = useQuery({
    queryKey: ["mandate-acknowledgments"],
    enabled: !!user && mandates.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mandate_acknowledgments")
        .select("*");
      if (error) throw error;
      return data as Acknowledgment[];
    },
  });

  // Fetch workbooks for scoping
  const { data: workbooks = [] } = useQuery({
    queryKey: ["all-workbooks-for-mandates"],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbooks")
        .select("id, title")
        .order("title");
      if (error) throw error;
      return data ?? [];
    },
  });

  const publishMandate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("context_items")
        .update({
          mandate_status: "active",
          published_at: new Date().toISOString(),
          published_by: user?.id,
        } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mandates"] });
      toast({ title: "Mandate published", description: "It is now active and visible to scoped workbooks." });
    },
  });

  const revokeMandate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("context_items")
        .update({ mandate_status: "revoked" } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mandates"] });
      toast({ title: "Mandate revoked" });
    },
  });

  const filtered = mandates.filter(m => statusFilter === "all" || m.mandate_status === statusFilter);
  const selected = mandates.find(m => m.id === selectedId);
  const selectedAcks = acks.filter(a => a.mandate_id === selectedId);

  // Stats
  const activeCount = mandates.filter(m => m.mandate_status === "active").length;
  const draftCount = mandates.filter(m => m.mandate_status === "draft").length;
  const totalAcks = acks.length;
  const pendingCompliance = mandates
    .filter(m => m.mandate_status === "active")
    .reduce((count, m) => {
      const scopedWbCount = m.mandate_scope?.type === "organization"
        ? workbooks.length
        : (m.mandate_scope?.workbook_ids?.length ?? 0);
      const ackCount = acks.filter(a => a.mandate_id === m.id).length;
      return count + Math.max(0, scopedWbCount - ackCount);
    }, 0);

  function getAckCount(mandateId: string) {
    return acks.filter(a => a.mandate_id === mandateId).length;
  }

  function getScopedWorkbookCount(mandate: Mandate) {
    return mandate.mandate_scope?.type === "organization"
      ? workbooks.length
      : (mandate.mandate_scope?.workbook_ids?.length ?? 0);
  }

  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Loading mandates…</div>;

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {/* Header */}
      {!compact && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-warning" />
              Mandates & Directives
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Organizational rules, principles, and compliance directives that cascade to workbooks
            </p>
          </div>
          {isLeader && (
            <Button onClick={() => { setEditMandate(null); setCreateOpen(true); }} className="gap-1.5">
              <Plus className="h-4 w-4" /> New Mandate
            </Button>
          )}
        </div>
      )}

      {/* Stats row */}
      <div className={`grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-4"}`}>
        <div className="rounded-lg border border-border/50 bg-card p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Active</div>
          <div className="text-xl font-bold text-success">{activeCount}</div>
        </div>
        <div className="rounded-lg border border-border/50 bg-card p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Drafts</div>
          <div className="text-xl font-bold text-muted-foreground">{draftCount}</div>
        </div>
        {!compact && (
          <>
            <div className="rounded-lg border border-border/50 bg-card p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Acknowledgments</div>
              <div className="text-xl font-bold text-info">{totalAcks}</div>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Pending Compliance</div>
              <div className={`text-xl font-bold ${pendingCompliance > 0 ? "text-warning" : "text-success"}`}>{pendingCompliance}</div>
            </div>
          </>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5">
        {["all", "draft", "active", "superseded", "revoked"].map(s => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            className="text-xs capitalize"
            onClick={() => setStatusFilter(s)}
          >
            {s === "all" ? `All (${mandates.length})` : `${s} (${mandates.filter(m => m.mandate_status === s).length})`}
          </Button>
        ))}
      </div>

      {/* Mandate list + detail split */}
      <div className={`grid gap-4 ${compact ? "" : "grid-cols-[1fr_1fr]"}`}>
        {/* List */}
        <ScrollArea className={compact ? "max-h-[400px]" : "max-h-[500px]"}>
          <div className="space-y-2 pr-2">
            {filtered.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {isLeader ? "No mandates yet. Create one to communicate organizational directives." : "No active mandates."}
              </div>
            )}
            {filtered.map(mandate => (
              <MandateCard
                key={mandate.id}
                mandate={mandate}
                ackCount={getAckCount(mandate.id)}
                totalWorkbooks={getScopedWorkbookCount(mandate)}
                onEdit={() => { setEditMandate(mandate); setCreateOpen(true); }}
                onPublish={() => publishMandate.mutate(mandate.id)}
                onSelect={() => setSelectedId(selectedId === mandate.id ? null : mandate.id)}
                isSelected={selectedId === mandate.id}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Detail panel */}
        {!compact && selected && (
          <div className="rounded-lg border border-border/50 bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-warning" />
                {selected.title}
              </h3>
              <div className="flex items-center gap-1">
                {isLeader && selected.mandate_status === "draft" && (
                  <>
                    <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => { setEditMandate(selected); setCreateOpen(true); }}>
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                    <Button size="sm" className="text-xs gap-1" onClick={() => publishMandate.mutate(selected.id)}>
                      <Send className="h-3 w-3" /> Publish
                    </Button>
                  </>
                )}
                {isLeader && selected.mandate_status === "active" && (
                  <Button variant="destructive" size="sm" className="text-xs gap-1" onClick={() => revokeMandate.mutate(selected.id)}>
                    <X className="h-3 w-3" /> Revoke
                  </Button>
                )}
              </div>
            </div>

            {selected.mandate_description && (
              <p className="text-xs text-muted-foreground">{selected.mandate_description}</p>
            )}

            <div className="rounded-md bg-secondary/50 p-3">
              <p className="text-xs whitespace-pre-wrap">{selected.content_full}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-[9px]">{selected.category}</Badge>
              <Badge variant="outline" className="text-[9px]">{selected.priority}</Badge>
              <Badge variant="outline" className={`text-[9px] ${ENFORCEMENT_CONFIG[selected.enforcement_level ?? "advisory"]?.color}`}>
                {ENFORCEMENT_CONFIG[selected.enforcement_level ?? "advisory"]?.label}
              </Badge>
              <Badge variant="outline" className="text-[9px]">
                {selected.mandate_scope?.type === "organization" ? "🌐 Org-wide" : `🎯 ${selected.mandate_scope?.workbook_ids?.length ?? 0} workbooks`}
              </Badge>
            </div>

            {/* Acknowledgment tracking */}
            {(selected.mandate_status === "active" || selected.mandate_status === "published") && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3 w-3" /> Acknowledgment Status
                </h4>
                <div className="space-y-1.5">
                  {(() => {
                    const scopedWbs = selected.mandate_scope?.type === "organization"
                      ? workbooks
                      : workbooks.filter(wb => selected.mandate_scope?.workbook_ids?.includes(wb.id));

                    if (scopedWbs.length === 0) {
                      return <p className="text-xs text-muted-foreground">No workbooks in scope.</p>;
                    }

                    return scopedWbs.map(wb => {
                      const ack = selectedAcks.find(a => a.workbook_id === wb.id);
                      return (
                        <div key={wb.id} className="flex items-center justify-between rounded-md border border-border/30 px-3 py-2">
                          <span className="text-xs">{wb.title}</span>
                          {ack ? (
                            <Badge variant="outline" className="text-[9px] text-success border-success/30 gap-0.5">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Acknowledged
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[9px] text-warning border-warning/30 gap-0.5">
                              <AlertTriangle className="h-2.5 w-2.5" /> Pending
                            </Badge>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <MandateFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        editMandate={editMandate}
        workbooks={workbooks}
      />
    </div>
  );
}
