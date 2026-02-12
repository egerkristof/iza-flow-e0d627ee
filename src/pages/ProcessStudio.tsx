import { useState, useRef } from "react";
import {
  Upload, FileText, Check, X, AlertTriangle, Archive, ChevronRight,
  Gauge, Trash2, Eye, Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── SCOPE RADIAL ──
function ScopeRadial({ level }: { level: string }) {
  const stops = ["draft", "team", "domain", "org"];
  const colors = ["hsl(var(--muted-foreground))", "hsl(var(--success))", "hsl(var(--info))", "hsl(var(--warning))"];
  const idx = stops.indexOf(level);
  return (
    <div className="flex items-center gap-1">
      {stops.map((s, i) => (
        <div
          key={s}
          className="h-2 w-2 rounded-full transition-all"
          style={{
            background: i <= idx ? colors[idx] : "hsl(var(--border))",
            boxShadow: i === idx ? `0 0 6px ${colors[idx]}` : "none",
          }}
          title={s.charAt(0).toUpperCase() + s.slice(1)}
        />
      ))}
      <span className="ml-1 text-[10px] uppercase text-muted-foreground">{level}</span>
    </div>
  );
}

// ── MOCK DATA ──
interface DriftCluster {
  id: string;
  label: string;
  count: number;
  severity: "low" | "medium" | "high";
  excerpts: string[];
}

const MOCK_DRIFT: DriftCluster[] = [
  {
    id: "d1", label: "Pricing Step deviations", count: 5, severity: "high",
    excerpts: [
      "User skipped discount approval gate",
      "Non-standard pricing tier applied",
      "Volume discount exceeded threshold",
      "Manual override on enterprise rate",
      "Pricing template version mismatch",
    ],
  },
  {
    id: "d2", label: "Onboarding Flow edits", count: 3, severity: "medium",
    excerpts: ["SLA template modified", "Kick-off agenda reordered", "Integration step skipped"],
  },
  {
    id: "d3", label: "Compliance rule drift", count: 2, severity: "low",
    excerpts: ["Data retention note missing", "GDPR clause outdated"],
  },
];

interface ModuleCard {
  id: string;
  title: string;
  description: string;
  scope: string;
  version: string;
  itemCount: number;
  healthScore: number;
  lastUsed: string;
}

const MOCK_MODULES: ModuleCard[] = [
  { id: "m1", title: "Sales Hub", description: "Core sales processes, pricing, proposals", scope: "org", version: "v2.3", itemCount: 24, healthScore: 0.92, lastUsed: "2h ago" },
  { id: "m2", title: "Client Success", description: "Onboarding, retention, health monitoring", scope: "domain", version: "v1.8", itemCount: 18, healthScore: 0.85, lastUsed: "5h ago" },
  { id: "m3", title: "Strategy & Planning", description: "OKRs, market analysis, competitive intel", scope: "team", version: "v3.1", itemCount: 31, healthScore: 0.78, lastUsed: "1d ago" },
  { id: "m4", title: "Engineering Playbooks", description: "Technical processes, code review, deployment", scope: "draft", version: "v0.9", itemCount: 12, healthScore: 0.65, lastUsed: "3d ago" },
];

interface StaleItem {
  id: string;
  title: string;
  category: string;
  lastUsed: string;
  reason: string;
}

const MOCK_STALE: StaleItem[] = [
  { id: "s1", title: "Legacy Pricing Model v1", category: "KNOWLEDGE", lastUsed: "8 months ago", reason: "Superseded by v2" },
  { id: "s2", title: "Old Competitor Battlecard", category: "KNOWLEDGE", lastUsed: "6 months ago", reason: "Company acquired" },
  { id: "s3", title: "Beta Onboarding Flow", category: "PROCEDURE", lastUsed: "7 months ago", reason: "Replaced by GA flow" },
];

const ProcessStudioPage = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [ingestionModal, setIngestionModal] = useState(false);
  const [expandedDrift, setExpandedDrift] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<{ title: string; type: string; approved: boolean }[]>([]);

  const simulateIngestion = () => {
    setCandidates([
      { title: "Enterprise Pricing Protocol", type: "PLAYBOOK", approved: false },
      { title: "Data Security Directive", type: "DIRECTIVE", approved: false },
      { title: "Product Comparison Matrix", type: "KNOWLEDGE", approved: false },
      { title: "Quarterly Review Procedure", type: "PROCEDURE", approved: false },
    ]);
    setIngestionModal(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    simulateIngestion();
  };

  const toggleCandidate = (idx: number) => {
    setCandidates((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, approved: !c.approved } : c))
    );
  };

  const approveAll = () => {
    const approved = candidates.filter((c) => c.approved).length;
    toast({ title: "Ingestion Complete", description: `${approved} items added to the knowledge graph.` });
    setIngestionModal(false);
  };

  // Health metrics
  const totalItems = MOCK_MODULES.reduce((acc, m) => acc + m.itemCount, 0);
  const avgHealth = MOCK_MODULES.reduce((acc, m) => acc + m.healthScore, 0) / MOCK_MODULES.length;

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">🏗️ Process Studio</h1>
        <p className="mt-1 text-muted-foreground">Define, curate, and manage the knowledge graph.</p>
      </div>

      {/* Health Dashboard */}
      <div className="grid gap-4 sm:grid-cols-4">
        <HealthStat label="Overall Health" value={`${Math.round(avgHealth * 100)}%`} color={avgHealth > 0.8 ? "text-success" : "text-warning"} />
        <HealthStat label="Active Items" value={totalItems.toString()} color="text-foreground" />
        <HealthStat label="Stale Items" value={MOCK_STALE.length.toString()} color="text-warning" />
        <HealthStat label="Active Bundles" value={MOCK_MODULES.length.toString()} color="text-primary" />
      </div>

      <Tabs defaultValue="modules">
        <TabsList>
          <TabsTrigger value="modules">Capability Modules</TabsTrigger>
          <TabsTrigger value="drift">Drift Inbox</TabsTrigger>
          <TabsTrigger value="ingest">Knowledge Loom</TabsTrigger>
          <TabsTrigger value="stale">Garbage Collection</TabsTrigger>
        </TabsList>

        {/* ── MODULES TAB ── */}
        <TabsContent value="modules">
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            {MOCK_MODULES.map((mod) => (
              <div
                key={mod.id}
                className="rounded-lg border border-border/50 bg-card p-5 space-y-3 transition-all hover:border-primary/20"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{mod.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{mod.description}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">{mod.version}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <ScopeRadial level={mod.scope} />
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{mod.itemCount} items</span>
                    <span>·</span>
                    <span className={mod.healthScore > 0.8 ? "text-success" : "text-warning"}>
                      {Math.round(mod.healthScore * 100)}% health
                    </span>
                  </div>
                </div>
                {/* Health bar */}
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${mod.healthScore > 0.8 ? "bg-success" : mod.healthScore > 0.6 ? "bg-warning" : "bg-destructive"}`}
                    style={{ width: `${mod.healthScore * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── DRIFT INBOX TAB ── */}
        <TabsContent value="drift">
          <div className="space-y-3 mt-4">
            {MOCK_DRIFT.map((cluster) => (
              <div key={cluster.id} className="rounded-lg border border-border/50 bg-card overflow-hidden">
                <button
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
                  onClick={() => setExpandedDrift(expandedDrift === cluster.id ? null : cluster.id)}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={`h-4 w-4 ${
                        cluster.severity === "high" ? "text-destructive" : cluster.severity === "medium" ? "text-warning" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-sm font-medium">{cluster.count} {cluster.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        cluster.severity === "high" ? "border-destructive/30 text-destructive" : cluster.severity === "medium" ? "border-warning/30 text-warning" : ""
                      }`}
                    >
                      {cluster.severity}
                    </Badge>
                    <ChevronRight className={`h-4 w-4 transition-transform text-muted-foreground ${expandedDrift === cluster.id ? "rotate-90" : ""}`} />
                  </div>
                </button>
                {expandedDrift === cluster.id && (
                  <div className="border-t border-border/50 px-4 py-3 space-y-2 bg-secondary/10">
                    {cluster.excerpts.map((ex, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                        {ex}
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="text-xs">Promote Update</Button>
                      <Button variant="outline" size="sm" className="text-xs">Dismiss</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── KNOWLEDGE LOOM TAB ── */}
        <TabsContent value="ingest">
          <div className="mt-4">
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={simulateIngestion} />
            <div
              className={`rounded-lg border-2 border-dashed p-12 text-center transition-all cursor-pointer ${
                dragOver ? "border-primary bg-primary/5" : "border-border/50 bg-card/50 hover:border-primary/30"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Drop documents here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">
                Smart Ingestion will auto-extract Playbooks, Directives & Knowledge items
              </p>
            </div>
          </div>
        </TabsContent>

        {/* ── STALE / GARBAGE COLLECTION TAB ── */}
        <TabsContent value="stale">
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{MOCK_STALE.length} items flagged for archive</p>
              <Button size="sm" variant="outline" className="text-xs gap-1">
                <Archive className="h-3 w-3" /> Archive All
              </Button>
            </div>
            {MOCK_STALE.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm font-medium">{item.title}</span>
                    <div className="flex gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                      <span className="text-[10px] text-muted-foreground">{item.lastUsed}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-warning">{item.reason}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Archive className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ── INGESTION MODAL ── */}
      <Dialog open={ingestionModal} onOpenChange={setIngestionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Wizard — Candidate Items</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {candidates.map((c, i) => (
              <button
                key={i}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm transition-all ${
                  c.approved ? "bg-primary/10 border border-primary/30" : "bg-secondary/50 border border-transparent"
                }`}
                onClick={() => toggleCandidate(i)}
              >
                <div className="flex items-center gap-2">
                  {c.approved ? <Check className="h-4 w-4 text-primary" /> : <div className="h-4 w-4 rounded border border-border" />}
                  <span>{c.title}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIngestionModal(false)}>Cancel</Button>
            <Button onClick={approveAll} disabled={!candidates.some((c) => c.approved)}>
              Approve & Bundle ({candidates.filter((c) => c.approved).length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function HealthStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

export default ProcessStudioPage;
