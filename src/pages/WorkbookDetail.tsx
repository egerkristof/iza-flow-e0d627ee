import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Lock, Unlock, Play, ChevronRight, ChevronLeft, FileText, Zap, Target,
  Search as SearchIcon, BarChart, Users, MessageSquare, Settings, TrendingUp,
} from "lucide-react";
import { AreaChart, Area, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";

// ── MOCK PLAYBOOKS (from old Launchpad) ──
interface Playbook {
  id: string; title: string; subtitle: string; icon: React.ReactNode;
  steps: { id: string; label: string; instruction: string }[];
  assets: string[];
}

const MOCK_PLAYBOOKS: Playbook[] = [
  { id: "presales_intro_intel", title: "Draft Proposal", subtitle: "MEDIC Method", icon: <FileText className="h-5 w-5" />, steps: [{ id: "s1", label: "Internal Memory Audit", instruction: "Query internal CRM and drive for existing client data…" }, { id: "s2", label: "External Demand Pull", instruction: "Research competitor landscape and market positioning…" }, { id: "s3", label: "Synthesis & Output", instruction: "Compile findings into the proposal template…" }], assets: ["Client History (CRM)", "Pricing Matrix v2.1", "Brand Guidelines"] },
  { id: "client_research", title: "Client Research", subtitle: "Deep Intel Protocol", icon: <SearchIcon className="h-5 w-5" />, steps: [{ id: "s1", label: "Company Profile Scan", instruction: "Pull financials, org chart, and recent news…" }, { id: "s2", label: "Stakeholder Mapping", instruction: "Identify key decision makers and influencers…" }], assets: ["Account Database", "LinkedIn Intel", "News Feed"] },
  { id: "deal_review", title: "Deal Review", subtitle: "Win/Loss Analysis", icon: <Target className="h-5 w-5" />, steps: [{ id: "s1", label: "Deal Metrics Review", instruction: "Analyze pipeline velocity, conversion rates…" }, { id: "s2", label: "Risk Assessment", instruction: "Flag blockers, competitor threats, timeline risks…" }, { id: "s3", label: "Action Plan", instruction: "Generate next-steps with owner assignments…" }], assets: ["Deal Pipeline", "Competitor Matrix", "Risk Register"] },
  { id: "pricing_analysis", title: "Pricing Analysis", subtitle: "Value Engineering", icon: <BarChart className="h-5 w-5" />, steps: [{ id: "s1", label: "Cost Model Review", instruction: "Validate cost assumptions against current rates…" }, { id: "s2", label: "Market Benchmark", instruction: "Compare against industry pricing data…" }], assets: ["Pricing Matrix", "Market Data", "Margin Calculator"] },
  { id: "competitive_intel", title: "Competitive Intel", subtitle: "Battlecard Builder", icon: <Zap className="h-5 w-5" />, steps: [{ id: "s1", label: "Competitor Sweep", instruction: "Scan web, news, product launches for competitor updates…" }, { id: "s2", label: "Battlecard Update", instruction: "Update strengths/weaknesses/positioning matrix…" }], assets: ["Battlecards v3", "Product Comparison", "Win/Loss DB"] },
  { id: "onboarding_setup", title: "Onboarding Setup", subtitle: "Client Success", icon: <Users className="h-5 w-5" />, steps: [{ id: "s1", label: "Kick-off Prep", instruction: "Prepare agenda, stakeholder introductions, success metrics…" }, { id: "s2", label: "System Configuration", instruction: "Set up client workspace, integrations, access permissions…" }, { id: "s3", label: "Handoff Brief", instruction: "Compile transition doc for the delivery team…" }], assets: ["Onboarding Checklist", "Integration Guide", "SLA Template"] },
];

// Mock workbook data lookup
const MOCK_WORKBOOK_DATA: Record<string, { title: string; description: string; strategicOutcome: string; status: string }> = {
  "1": { title: "Q1 OKR Planning", description: "Define success metrics and align team objectives for Q1 growth targets.", strategicOutcome: "Growth 30% YoY", status: "active" },
  "2": { title: "Market Expansion APAC", description: "Feasibility study and go-to-market strategy for Southeast Asia entry.", strategicOutcome: "Enter 3 new markets", status: "active" },
  "3": { title: "Client Onboarding — Acme Corp", description: "90-day activation plan including system setup, training, and SLA alignment.", strategicOutcome: "90-day activation", status: "active" },
  "4": { title: "Proposal Pipeline — Enterprise", description: "Enterprise deal pipeline with pricing, technical scope, and executive summary.", strategicOutcome: "Close by Q1", status: "review" },
  "5": { title: "Deal Retrospective — Beta Inc", description: "Win/loss analysis and process improvement documentation.", strategicOutcome: "Process Improvement", status: "completed" },
  "6": { title: "Annual Contract Renewal", description: "Contract renewal processing for key accounts, terms negotiation.", strategicOutcome: "100% renewal rate", status: "completed" },
  "7": { title: "Competitive Intel — Q1", description: "Battlecard updates and competitive positioning refresh.", strategicOutcome: "Market awareness", status: "draft" },
  "8": { title: "Product Launch — v3.0", description: "Cross-functional launch plan including messaging, enablement, and rollout.", strategicOutcome: "Launch by March", status: "draft" },
};

export default function WorkbookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeRole } = useAuth();
  const wb = MOCK_WORKBOOK_DATA[id ?? ""] ?? { title: "Unknown Workbook", description: "", strategicOutcome: "", status: "draft" };

  const showAnalytics = activeRole === "manager" || activeRole === "architect";
  const showSettings = activeRole === "architect";

  const [lockedPlaybook, setLockedPlaybook] = useState<Playbook | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([]);

  const handleLock = (playbook: Playbook) => {
    setLockedPlaybook(playbook);
    setCurrentStepIndex(0);
    setChatMessages([]);
  };

  const handleUnlock = () => {
    setLockedPlaybook(null);
    setCurrentStepIndex(0);
    setChatMessages([]);
  };

  const handleSend = () => {
    if (!chatInput.trim() || !lockedPlaybook) return;
    const step = lockedPlaybook.steps[currentStepIndex];
    setChatMessages(prev => [
      ...prev,
      { role: "user", text: chatInput },
      { role: "assistant", text: `[Step ${currentStepIndex + 1}: ${step.label}] Processing your input for "${lockedPlaybook.title}"…` },
    ]);
    setChatInput("");
    if (currentStepIndex < lockedPlaybook.steps.length - 1) setCurrentStepIndex(i => i + 1);
  };

  // ── LOCKED STATE ──
  if (lockedPlaybook) {
    const step = lockedPlaybook.steps[currentStepIndex];
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col" style={{ background: "hsl(205 85% 55% / 0.03)" }}>
        {/* Protocol Banner */}
        <div className="flex items-center justify-between border-b border-primary/20 bg-primary/5 px-6 py-3">
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Active Protocol: {lockedPlaybook.title}</span>
            <Badge variant="outline" className="border-primary/30 text-primary text-xs">Step {currentStepIndex + 1} of {lockedPlaybook.steps.length}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleUnlock} className="text-xs text-muted-foreground hover:text-destructive">
            <Unlock className="mr-1 h-3 w-3" /> Release Lock
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col">
            {/* Step progress */}
            <div className="flex gap-1 border-b border-border/50 px-6 py-3">
              {lockedPlaybook.steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1">
                  <div className={`flex h-6 items-center rounded-full px-3 text-xs font-medium transition-all ${i === currentStepIndex ? "bg-primary text-primary-foreground" : i < currentStepIndex ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                    {s.label}
                  </div>
                  {i < lockedPlaybook.steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                </div>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-6 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-sm text-muted-foreground italic">Protocol locked. Begin by providing input for: <strong>{step.label}</strong></div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${msg.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-border/50 p-4">
              <div className="flex gap-2">
                <Input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder={step.instruction} className="flex-1 bg-secondary/50" />
                <Button onClick={handleSend} size="icon"><Play className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          {/* Mission Assets sidebar */}
          <div className="w-64 border-l border-border/50 bg-card/50 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mission Assets</h3>
            <div className="space-y-2">
              {lockedPlaybook.assets.map(asset => (
                <div key={asset} className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2 text-xs">
                  <FileText className="h-3 w-3 text-primary" /><span>{asset}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── IDLE STATE — Action Grid inside the workbook ──
  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Back + Header */}
      <div>
        <Button variant="ghost" size="sm" className="mb-3 -ml-2 text-xs text-muted-foreground gap-1" onClick={() => navigate("/workbooks")}>
          <ChevronLeft className="h-3 w-3" /> Back to Workbooks
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{wb.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{wb.description}</p>
            {wb.strategicOutcome && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-[10px] border-primary/30 text-primary">🎯 {wb.strategicOutcome}</Badge>
                <Badge variant="outline" className="text-[10px]">{wb.status}</Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabbed sections — role-filtered */}
      <Tabs defaultValue="protocols" className="w-full">
        <TabsList>
          <TabsTrigger value="protocols">Protocols</TabsTrigger>
          {showAnalytics && <TabsTrigger value="analytics"><TrendingUp className="mr-1.5 h-3.5 w-3.5" />Analytics</TabsTrigger>}
          {showSettings && <TabsTrigger value="settings"><Settings className="mr-1.5 h-3.5 w-3.5" />Settings</TabsTrigger>}
        </TabsList>

        <TabsContent value="protocols" className="mt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Select a Protocol</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_PLAYBOOKS.map(pb => (
              <button key={pb.id} onClick={() => handleLock(pb)} className="group flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-5 text-left transition-all hover:border-primary/30 hover:glow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">{pb.icon}</div>
                  <div>
                    <h3 className="font-medium">{pb.title}</h3>
                    <p className="text-xs text-muted-foreground">{pb.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{pb.steps.length} steps</span><span>·</span><span>{pb.assets.length} assets</span>
                </div>
              </button>
            ))}
          </div>
        </TabsContent>

        {showAnalytics && (
          <TabsContent value="analytics" className="mt-4 space-y-6">
            <WorkbookAnalytics workbookId={id ?? "1"} />
          </TabsContent>
        )}

        {showSettings && (
          <TabsContent value="settings" className="mt-4">
            <div className="rounded-lg border border-border/50 bg-card p-8 text-center">
              <Settings className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
              <h3 className="font-medium mb-1">Workbook Configuration</h3>
              <p className="text-sm text-muted-foreground">Bundle assignments, playbook ordering, and context overrides — visible to Process Owners only.</p>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

// ── ANALYTICS COMPONENT ──
const CHART_COLORS = ["hsl(205, 85%, 55%)", "hsl(142, 60%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)", "hsl(265, 60%, 55%)", "hsl(180, 60%, 45%)"];

function generateDriftData(workbookId: string) {
  const seed = workbookId.charCodeAt(0) || 49;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon+1", "Tue+1", "Wed+1", "Thu+1", "Fri+1", "Sat+1", "Sun+1"];
  let score = 15 + (seed % 20);
  return days.map((day) => {
    score = Math.max(0, Math.min(100, score + (Math.sin(seed + day.length) * 8 + (Math.random() - 0.5) * 12)));
    return { day, drift: Math.round(score), threshold: 40 };
  });
}

function generateProtocolUsage() {
  return [
    { name: "Draft Proposal", runs: 34, completions: 28, avgTime: 12 },
    { name: "Client Research", runs: 27, completions: 25, avgTime: 8 },
    { name: "Deal Review", runs: 19, completions: 15, avgTime: 18 },
    { name: "Pricing Analysis", runs: 14, completions: 12, avgTime: 10 },
    { name: "Competitive Intel", runs: 11, completions: 9, avgTime: 6 },
    { name: "Onboarding Setup", runs: 8, completions: 7, avgTime: 15 },
  ];
}

function generateCompletionPie() {
  return [
    { name: "Completed", value: 68 },
    { name: "In Progress", value: 18 },
    { name: "Abandoned", value: 14 },
  ];
}

function WorkbookAnalytics({ workbookId }: { workbookId: string }) {
  const driftData = useMemo(() => generateDriftData(workbookId), [workbookId]);
  const protocolUsage = useMemo(() => generateProtocolUsage(), []);
  const completionData = useMemo(() => generateCompletionPie(), []);

  const currentDrift = driftData[driftData.length - 1]?.drift ?? 0;
  const prevDrift = driftData[driftData.length - 3]?.drift ?? currentDrift;
  const driftDelta = currentDrift - prevDrift;
  const totalRuns = protocolUsage.reduce((s, p) => s + p.runs, 0);
  const totalCompletions = protocolUsage.reduce((s, p) => s + p.completions, 0);
  const completionRate = totalRuns > 0 ? Math.round((totalCompletions / totalRuns) * 100) : 0;
  const avgTime = Math.round(protocolUsage.reduce((s, p) => s + p.avgTime, 0) / protocolUsage.length);

  return (
    <>
      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Current Drift", value: `${currentDrift}%`, sub: `${driftDelta >= 0 ? "+" : ""}${driftDelta.toFixed(0)}% vs 3d ago`, color: currentDrift > 40 ? "text-destructive" : "text-green-400" },
          { label: "Total Protocol Runs", value: totalRuns.toString(), sub: "last 14 days" },
          { label: "Completion Rate", value: `${completionRate}%`, sub: `${totalCompletions}/${totalRuns} finished` },
          { label: "Avg Session Time", value: `${avgTime} min`, sub: "across all protocols" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-border/50 bg-card p-4">
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
            <p className={`text-2xl font-semibold mt-1 ${kpi.color ?? ""}`}>{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Drift Score Over Time */}
      <div className="rounded-lg border border-border/50 bg-card p-5">
        <h3 className="text-sm font-semibold mb-4">Drift Score — 14 Day Trend</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={driftData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="driftGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(205, 85%, 55%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(205, 85%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 15%)" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(215, 12%, 52%)" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "hsl(215, 12%, 52%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(225, 22%, 9%)", border: "1px solid hsl(225, 15%, 15%)", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="threshold" stroke="hsl(0, 72%, 51%)" strokeDasharray="5 3" strokeWidth={1.5} fill="none" name="Danger Threshold" />
            <Area type="monotone" dataKey="drift" stroke="hsl(205, 85%, 55%)" fill="url(#driftGrad)" strokeWidth={2} name="Drift Score" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Protocol Usage Bar Chart */}
        <div className="rounded-lg border border-border/50 bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Protocol Usage</h3>
          <ResponsiveContainer width="100%" height={260}>
            <ReBarChart data={protocolUsage} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 15%, 15%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(215, 12%, 52%)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(215, 12%, 52%)" }} width={110} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(225, 22%, 9%)", border: "1px solid hsl(225, 15%, 15%)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="runs" fill="hsl(205, 85%, 55%)" radius={[0, 4, 4, 0]} name="Runs" barSize={14} />
              <Bar dataKey="completions" fill="hsl(142, 60%, 45%)" radius={[0, 4, 4, 0]} name="Completions" barSize={14} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>

        {/* Completion Pie */}
        <div className="rounded-lg border border-border/50 bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Session Outcomes</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={completionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {completionData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i]} />
                ))}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(225, 22%, 9%)", border: "1px solid hsl(225, 15%, 15%)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
