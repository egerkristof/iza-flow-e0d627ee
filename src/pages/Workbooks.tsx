import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { WorkbookCard, type WorkbookCardData } from "@/components/workbooks/WorkbookCard";

// ── MOCK DATA ──
const MOCK_WORKBOOKS: WorkbookCardData[] = [
  {
    id: "1",
    title: "Q1 OKR Planning",
    description: "Define success metrics and align team objectives for Q1 growth targets.",
    status: "active",
    driftScore: 0.12,
    memberAvatars: ["IB", "KT", "AL"],
    commentCount: 8,
    updatedAt: "2h ago",
    strategicOutcome: "Growth 30% YoY",
    lockedPlaybook: "Strategic Planning",
  },
  {
    id: "2",
    title: "Market Expansion APAC",
    description: "Feasibility study and go-to-market strategy for Southeast Asia entry.",
    status: "active",
    driftScore: 0.45,
    memberAvatars: ["IB", "MR", "JP", "SL"],
    commentCount: 14,
    updatedAt: "5h ago",
    strategicOutcome: "Enter 3 new markets",
    lockedPlaybook: "Market Analysis",
  },
  {
    id: "3",
    title: "Client Onboarding — Acme Corp",
    description: "90-day activation plan including system setup, training, and SLA alignment.",
    status: "active",
    driftScore: 0.08,
    memberAvatars: ["KT", "AL"],
    commentCount: 5,
    updatedAt: "30m ago",
    strategicOutcome: "90-day activation",
    lockedPlaybook: "Onboarding Setup",
  },
  {
    id: "4",
    title: "Proposal Pipeline — Enterprise",
    description: "Enterprise deal pipeline with pricing, technical scope, and executive summary.",
    status: "review",
    driftScore: 0.62,
    memberAvatars: ["IB", "MR"],
    commentCount: 22,
    updatedAt: "1h ago",
    strategicOutcome: "Close by Q1",
    lockedPlaybook: "Draft Proposal",
  },
  {
    id: "5",
    title: "Deal Retrospective — Beta Inc",
    description: "Win/loss analysis and process improvement documentation.",
    status: "completed",
    driftScore: 0.03,
    memberAvatars: ["JP"],
    commentCount: 3,
    updatedAt: "1d ago",
    strategicOutcome: "Process Improvement",
    lockedPlaybook: null,
  },
  {
    id: "6",
    title: "Annual Contract Renewal",
    description: "Contract renewal processing for key accounts, terms negotiation.",
    status: "completed",
    driftScore: 0.0,
    memberAvatars: ["AL", "SL"],
    commentCount: 1,
    updatedAt: "3d ago",
    strategicOutcome: "100% renewal rate",
    lockedPlaybook: null,
  },
  {
    id: "7",
    title: "Competitive Intel — Q1",
    description: "Battlecard updates and competitive positioning refresh across all verticals.",
    status: "draft",
    driftScore: 0,
    memberAvatars: ["MR"],
    commentCount: 0,
    updatedAt: "5d ago",
    strategicOutcome: null,
    lockedPlaybook: null,
  },
  {
    id: "8",
    title: "Product Launch — v3.0",
    description: "Cross-functional launch plan including messaging, enablement, and rollout.",
    status: "draft",
    driftScore: 0,
    memberAvatars: ["IB", "KT", "JP", "AL", "MR"],
    commentCount: 2,
    updatedAt: "1w ago",
    strategicOutcome: "Launch by March",
    lockedPlaybook: null,
  },
];

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "review", label: "Review" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

const WorkbooksPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newOutcome, setNewOutcome] = useState("");

  const filtered = useMemo(() => {
    return MOCK_WORKBOOKS.filter((wb) => {
      const matchesSearch =
        !search ||
        wb.title.toLowerCase().includes(search.toLowerCase()) ||
        wb.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || wb.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const handleOpen = (id: string) => {
    navigate(`/workbooks/${id}`);
  };

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    toast({ title: "Workbook created", description: `"${newTitle}" has been created.` });
    setCreateOpen(false);
    setNewTitle("");
    setNewDescription("");
    setNewOutcome("");
  };

  const openCreateDialog = () => {
    setNewTitle("");
    setNewDescription("");
    setNewOutcome("");
    setCreateOpen(true);
  };

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Workbooks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filtered.length} workbook{filtered.length !== 1 ? "s" : ""} ·{" "}
            {MOCK_WORKBOOKS.filter((w) => w.status === "active").length} active
          </p>
        </div>
        <Button className="gap-2 self-start" onClick={openCreateDialog}>
          <Plus className="h-4 w-4" />
          New Workbook
        </Button>
      </div>

      {/* Toolbar: search + filters + view toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search workbooks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-secondary/50 text-xs">
              <SlidersHorizontal className="mr-1.5 h-3 w-3" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((f) => (
                <SelectItem key={f.value} value={f.value} className="text-xs">
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex rounded-lg bg-secondary p-0.5">
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setView("list")}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid / List */}
      {view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Create card */}
          <button
            onClick={openCreateDialog}
            className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border/50 bg-card/30 text-muted-foreground transition-all hover:border-primary/30 hover:text-primary"
          >
            <Plus className="h-8 w-8" />
            <span className="text-sm font-medium">New Workbook</span>
          </button>

          {filtered.map((wb) => (
            <WorkbookCard key={wb.id} workbook={wb} onClick={handleOpen} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((wb) => (
            <WorkbookListRow key={wb.id} workbook={wb} onClick={handleOpen} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p className="text-sm">No workbooks match your filters.</p>
          <Button
            variant="link"
            className="mt-2 text-xs"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      {/* Create Workbook Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Workbook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wb-title">Title</Label>
              <Input
                id="wb-title"
                placeholder="e.g. Q2 Pipeline Review"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wb-desc">Description</Label>
              <Textarea
                id="wb-desc"
                placeholder="What is this workbook about?"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                maxLength={500}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wb-outcome">Strategic Outcome</Label>
              <Input
                id="wb-outcome"
                placeholder="e.g. Close 5 enterprise deals by Q2"
                value={newOutcome}
                onChange={e => setNewOutcome(e.target.value)}
                maxLength={200}
              />
              <p className="text-[11px] text-muted-foreground">The measurable goal this workbook drives toward.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newTitle.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function WorkbookListRow({
  workbook,
  onClick,
}: {
  workbook: WorkbookCardData;
  onClick: (id: string) => void;
}) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    draft: { label: "Draft", className: "bg-muted text-muted-foreground" },
    active: { label: "Active", className: "bg-primary/15 text-primary border-primary/30" },
    review: { label: "Review", className: "bg-warning/15 text-warning border-warning/30" },
    completed: { label: "Done", className: "bg-success/15 text-success border-success/30" },
    archived: { label: "Archived", className: "bg-muted text-muted-foreground" },
  };
  const st = statusConfig[workbook.status] ?? statusConfig.draft;
  const driftColor =
    workbook.driftScore < 0.2 ? "bg-success" : workbook.driftScore < 0.5 ? "bg-warning" : "bg-destructive";

  return (
    <button
      onClick={() => onClick(workbook.id)}
      className="flex w-full items-center justify-between gap-4 rounded-lg border border-border/50 bg-card px-5 py-3 text-left transition-all hover:border-primary/30 hover:glow-sm"
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium truncate">{workbook.title}</span>
            {workbook.driftScore > 0 && (
              <span className={`h-2 w-2 shrink-0 rounded-full ${driftColor}`} />
            )}
          </div>
          {workbook.description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{workbook.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <Badge variant="outline" className={`text-[10px] ${st.className}`}>
          {st.label}
        </Badge>
        <div className="flex -space-x-1.5">
          {workbook.memberAvatars.slice(0, 3).map((initials, i) => (
            <div
              key={i}
              className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-secondary text-[9px] font-medium"
            >
              {initials}
            </div>
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground w-12 text-right">{workbook.updatedAt}</span>
      </div>
    </button>
  );
}

export default WorkbooksPage;
