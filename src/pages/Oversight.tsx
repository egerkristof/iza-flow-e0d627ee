import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, ArrowRight, AlertTriangle, CheckCircle, Clock, LayoutGrid, Columns } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Shared workbook data (same source as Workbooks grid)
interface OversightWorkbook {
  id: string; title: string; status: "draft" | "active" | "review" | "completed";
  driftScore: number; lastActivity: string; activeProtocol: string | null;
  lastTasks: string[]; lineage: { decision: string; mandate: string; task: string };
}

const MOCK_WORKBOOKS: OversightWorkbook[] = [
  { id: "1", title: "Q1 OKR Planning", status: "active", driftScore: 0.12, lastActivity: "2h ago", activeProtocol: "Strategic Planning v2", lastTasks: ["Define success metrics", "Align team objectives", "Budget allocation"], lineage: { decision: "Board Q1 Directive", mandate: "Growth 30% YoY", task: "OKR Draft Review" } },
  { id: "2", title: "Market Expansion APAC", status: "active", driftScore: 0.45, lastActivity: "5h ago", activeProtocol: "Market Analysis", lastTasks: ["Competitor mapping", "Regulatory review"], lineage: { decision: "Expansion Initiative", mandate: "Enter 3 new markets", task: "APAC Feasibility" } },
  { id: "3", title: "Client Onboarding — Acme Corp", status: "active", driftScore: 0.08, lastActivity: "30m ago", activeProtocol: "Onboarding Setup", lastTasks: ["Kick-off call scheduled", "Integration configured", "SLA signed"], lineage: { decision: "Deal Closed", mandate: "90-day activation", task: "System Setup" } },
  { id: "4", title: "Proposal Pipeline — Enterprise", status: "review", driftScore: 0.62, lastActivity: "1h ago", activeProtocol: "Draft Proposal", lastTasks: ["Pricing review", "Technical scope", "Executive summary"], lineage: { decision: "Sales Qualified", mandate: "Close by Q1", task: "Proposal Finalization" } },
  { id: "5", title: "Deal Retrospective — Beta Inc", status: "completed", driftScore: 0.03, lastActivity: "1d ago", activeProtocol: null, lastTasks: ["Win/loss analysis complete", "Lessons documented"], lineage: { decision: "Deal Won", mandate: "Process Improvement", task: "Retrospective" } },
  { id: "6", title: "Annual Contract Renewal", status: "completed", driftScore: 0.0, lastActivity: "3d ago", activeProtocol: null, lastTasks: ["Renewal signed", "Terms updated"], lineage: { decision: "Retention Priority", mandate: "100% renewal rate", task: "Contract Processing" } },
];

const statusColumns = [
  { key: "active", label: "Active", color: "text-info" },
  { key: "review", label: "Review", color: "text-warning" },
  { key: "completed", label: "Completed", color: "text-success" },
  { key: "draft", label: "Draft", color: "text-muted-foreground" },
];

export default function OversightPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<"board" | "grid">("board");
  const [peekWorkbook, setPeekWorkbook] = useState<OversightWorkbook | null>(null);

  const getDriftColor = (score: number) => score < 0.2 ? "bg-success" : score < 0.5 ? "bg-warning" : "bg-destructive";

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">📊 Oversight</h1>
          <p className="mt-1 text-sm text-muted-foreground">Strategic overview — workbooks by outcome, drift indicators & lineage.</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          <Button variant={view === "board" ? "default" : "ghost"} size="sm" className="text-xs" onClick={() => setView("board")}>
            <Columns className="mr-1 h-3 w-3" /> Board
          </Button>
          <Button variant={view === "grid" ? "default" : "ghost"} size="sm" className="text-xs" onClick={() => setView("grid")}>
            <LayoutGrid className="mr-1 h-3 w-3" /> Grid
          </Button>
        </div>
      </div>

      {view === "board" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusColumns.map(col => {
            const items = MOCK_WORKBOOKS.filter(w => w.status === col.key);
            return (
              <div key={col.key} className="flex min-w-[300px] flex-col gap-3">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-semibold uppercase tracking-wider ${col.color}`}>{col.label}</h3>
                  <Badge variant="outline" className="text-[10px]">{items.length}</Badge>
                </div>
                {items.map(wb => (
                  <OversightCard key={wb.id} workbook={wb} getDriftColor={getDriftColor} onPeek={setPeekWorkbook} onOpen={() => navigate(`/workbooks/${wb.id}`)} />
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_WORKBOOKS.map(wb => (
            <OversightCard key={wb.id} workbook={wb} getDriftColor={getDriftColor} onPeek={setPeekWorkbook} onOpen={() => navigate(`/workbooks/${wb.id}`)} />
          ))}
        </div>
      )}

      {/* Lineage Peek Modal */}
      <Dialog open={!!peekWorkbook} onOpenChange={() => setPeekWorkbook(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-base">{peekWorkbook?.title}</DialogTitle></DialogHeader>
          {peekWorkbook && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Active Protocol</p>
                <p className="text-sm">{peekWorkbook.activeProtocol ? <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-success" /> {peekWorkbook.activeProtocol}</span> : <span className="text-muted-foreground italic">None — Idle</span>}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Drift Score</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full ${getDriftColor(peekWorkbook.driftScore)}`} style={{ width: `${peekWorkbook.driftScore * 100}%` }} />
                  </div>
                  <span className="text-xs">{Math.round(peekWorkbook.driftScore * 100)}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Recent Tasks</p>
                <ul className="space-y-1">{peekWorkbook.lastTasks.map((task, i) => <li key={i} className="flex items-center gap-2 text-sm"><div className="h-1.5 w-1.5 rounded-full bg-primary" />{task}</li>)}</ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Task Lineage</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded bg-secondary px-2 py-1">{peekWorkbook.lineage.decision}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="rounded bg-secondary px-2 py-1">{peekWorkbook.lineage.mandate}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                  <span className="rounded bg-primary/10 text-primary px-2 py-1 font-medium">{peekWorkbook.lineage.task}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OversightCard({ workbook, getDriftColor, onPeek, onOpen }: { workbook: OversightWorkbook; getDriftColor: (s: number) => string; onPeek: (wb: OversightWorkbook) => void; onOpen: () => void }) {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:glow-sm cursor-pointer" onClick={onOpen}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{workbook.title}</span>
            <span className={`h-2 w-2 rounded-full ${getDriftColor(workbook.driftScore)}`} title={`Drift: ${Math.round(workbook.driftScore * 100)}%`} />
          </div>
          {workbook.activeProtocol && <p className="mt-1 text-xs text-primary">{workbook.activeProtocol}</p>}
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {workbook.lastActivity}</p>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={e => { e.stopPropagation(); onPeek(workbook); }}>
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
