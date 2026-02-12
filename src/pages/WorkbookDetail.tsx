import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Lock, Unlock, Play, ChevronRight, ChevronLeft, FileText, Zap, Target,
  Search as SearchIcon, BarChart, Users, MessageSquare, Settings, TrendingUp,
  GripVertical, ChevronUp, ChevronDown as ChevronDownIcon, Plus, X, Shield, AlertTriangle, Package, Trash2,
} from "lucide-react";
import { AreaChart, Area, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
  const [freeSession, setFreeSession] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([]);
  const [detectedIntents, setDetectedIntents] = useState<string[]>([]);

  const handleLock = (playbook: Playbook) => {
    setLockedPlaybook(playbook);
    setFreeSession(false);
    setCurrentStepIndex(0);
    setChatMessages([]);
    setDetectedIntents([]);
  };

  const handleStartFreeSession = () => {
    setFreeSession(true);
    setLockedPlaybook(null);
    setChatMessages([]);
    setDetectedIntents([]);
    setChatInput("");
  };

  const handleUnlock = () => {
    setLockedPlaybook(null);
    setFreeSession(false);
    setCurrentStepIndex(0);
    setChatMessages([]);
    setDetectedIntents([]);
  };

  // Mock intent detection from message content
  const detectIntents = (text: string): string[] => {
    const intentMap: Record<string, string[]> = {
      "create social media post": ["social", "post", "facebook", "linkedin", "instagram", "tweet"],
      "write proposal": ["proposal", "rfp", "pitch", "bid"],
      "draft email": ["email", "outreach", "follow-up", "follow up"],
      "analyze pricing": ["pricing", "cost", "rate", "margin", "discount"],
      "prepare report": ["report", "summary", "analysis", "review"],
      "create listing": ["listing", "property", "estate", "real estate"],
      "build presentation": ["presentation", "deck", "slides", "pptx"],
    };
    const lower = text.toLowerCase();
    return Object.entries(intentMap)
      .filter(([, keywords]) => keywords.some((k) => lower.includes(k)))
      .map(([intent]) => intent);
  };

  // Mock matching preferences based on detected intents
  const getMatchedPreferences = (intents: string[]): { key: string; value: string; condition: string }[] => {
    if (intents.length === 0) return [];
    const mockMatches: { key: string; value: string; condition: string }[] = [];
    if (intents.some((i) => i.includes("social") || i.includes("listing"))) {
      mockMatches.push(
        { key: "Tone", value: "Aspirational and premium for luxury; friendly and approachable for starter homes", condition: "luxury vs standard" },
      );
    }
    if (intents.some((i) => i.includes("proposal") || i.includes("email"))) {
      mockMatches.push(
        { key: "Communication Style", value: "Concise, data-backed, executive-friendly", condition: "business writing" },
      );
    }
    if (intents.some((i) => i.includes("pricing") || i.includes("report"))) {
      mockMatches.push(
        { key: "Output Format", value: "Structured tables with comparison columns", condition: "analytical work" },
      );
    }
    mockMatches.push({ key: "Focus Areas", value: "ROI, client value, market positioning", condition: "always active" });
    return mockMatches;
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;

    if (freeSession) {
      const newIntents = detectIntents(chatInput);
      const uniqueIntents = [...new Set([...detectedIntents, ...newIntents])];
      setDetectedIntents(uniqueIntents);
      const contextNote = newIntents.length > 0
        ? `\n\n💡 _Detected intent: ${newIntents.join(", ")}. Applying your matched preferences and workbook context._`
        : "";
      setChatMessages((prev) => [
        ...prev,
        { role: "user", text: chatInput },
        { role: "assistant", text: `Working on "${chatInput.slice(0, 60)}${chatInput.length > 60 ? "…" : ""}" within **${wb.title}**.${contextNote}\n\nI have your workbook context, personal knowledge, and matching preferences loaded. How would you like to proceed?` },
      ]);
      setChatInput("");
      return;
    }

    if (!lockedPlaybook) return;
    const step = lockedPlaybook.steps[currentStepIndex];
    setChatMessages(prev => [
      ...prev,
      { role: "user", text: chatInput },
      { role: "assistant", text: `[Step ${currentStepIndex + 1}: ${step.label}] Processing your input for "${lockedPlaybook.title}"…` },
    ]);
    setChatInput("");
    if (currentStepIndex < lockedPlaybook.steps.length - 1) setCurrentStepIndex(i => i + 1);
  };

  // ── FREE SESSION STATE ──
  if (freeSession) {
    const matchedPrefs = getMatchedPreferences(detectedIntents);
    return (
      <div className="flex h-[calc(100vh-3.5rem)] flex-col" style={{ background: "hsl(142 60% 45% / 0.03)" }}>
        {/* Free Session Banner */}
        <div className="flex items-center justify-between border-b border-green-500/20 bg-green-500/5 px-6 py-3">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Free Session — {wb.title}</span>
            {detectedIntents.length > 0 && (
              <div className="flex items-center gap-1">
                {detectedIntents.map((intent) => (
                  <Badge key={intent} variant="outline" className="border-green-500/30 text-green-400 text-[10px]">
                    <Zap className="h-2 w-2 mr-0.5" />{intent}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleUnlock} className="text-xs text-muted-foreground hover:text-destructive">
            <Unlock className="mr-1 h-3 w-3" /> End Session
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-auto p-6 space-y-3">
              {chatMessages.length === 0 && (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">No protocol needed — just start working.</p>
                    <p>Your personal knowledge, workbook context, and intent-based preferences are active. Simply describe what you'd like to do.</p>
                  </div>
                  <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Try something like:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Create a Facebook post for this listing", "Draft an email to the buyer", "Summarize our pricing strategy", "Prepare a market comparison"].map((s) => (
                        <button
                          key={s}
                          onClick={() => { setChatInput(s); }}
                          className="rounded-full border border-border/50 bg-card px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm whitespace-pre-line ${msg.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-border/50 p-4">
              <div className="flex gap-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Describe what you'd like to work on…"
                  className="flex-1 bg-secondary/50"
                />
                <Button onClick={handleSend} size="icon"><Play className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          {/* Context sidebar */}
          <div className="w-72 border-l border-border/50 bg-card/50 p-4 overflow-auto">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Context</h3>

            {/* Workbook context */}
            <div className="space-y-2 mb-4">
              <p className="text-[11px] font-medium text-muted-foreground">Workbook</p>
              <div className="rounded-md bg-secondary/50 px-3 py-2 text-xs space-y-1">
                <p className="font-medium">{wb.title}</p>
                {wb.strategicOutcome && <p className="text-muted-foreground">🎯 {wb.strategicOutcome}</p>}
              </div>
            </div>

            {/* Detected intents */}
            {detectedIntents.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-[11px] font-medium text-muted-foreground">Detected Intents</p>
                <div className="space-y-1">
                  {detectedIntents.map((intent) => (
                    <div key={intent} className="flex items-center gap-2 rounded-md bg-green-500/10 px-3 py-1.5 text-xs text-green-400">
                      <Zap className="h-3 w-3" />{intent}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matched preferences */}
            {matchedPrefs.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-[11px] font-medium text-muted-foreground">Matched Preferences</p>
                <div className="space-y-1.5">
                  {matchedPrefs.map((pref, i) => (
                    <div key={i} className="rounded-md border border-border/50 bg-muted/20 px-3 py-2 text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{pref.key}</span>
                        <Badge variant="outline" className="text-[9px]">{pref.condition}</Badge>
                      </div>
                      <p className="text-muted-foreground">{pref.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Knowledge sources */}
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-muted-foreground">Knowledge Sources</p>
              <div className="space-y-1">
                {["Personal Profile (CV)", "Goals & KPIs", "Working Preferences", "Workbook Context"].map((src) => (
                  <div key={src} className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-1.5 text-xs">
                    <FileText className="h-3 w-3 text-primary" />{src}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {/* Free Session card — always first */}
            <button onClick={handleStartFreeSession} className="group flex flex-col gap-3 rounded-lg border border-dashed border-green-500/30 bg-green-500/5 p-5 text-left transition-all hover:border-green-500/50 hover:bg-green-500/10">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-green-500/10 text-green-400 group-hover:bg-green-500/20 transition-colors">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Free Session</h3>
                  <p className="text-xs text-muted-foreground">No protocol — just start working</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Your context & preferences auto-applied</span>
              </div>
            </button>

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
          <TabsContent value="settings" className="mt-4 space-y-6">
            <WorkbookSettings workbookId={id ?? "1"} />
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

// ── SETTINGS COMPONENT (Process Owners only) ──

const MOCK_BUNDLES = [
  { id: "b1", title: "Presales Essentials", scope: "domain", health: 92, assigned: true },
  { id: "b2", title: "Client Success Pack", scope: "org", health: 87, assigned: true },
  { id: "b3", title: "Competitive Intel v2", scope: "domain", health: 76, assigned: false },
  { id: "b4", title: "Deal Desk Toolkit", scope: "org", health: 95, assigned: false },
  { id: "b5", title: "Legal & Compliance", scope: "org", health: 64, assigned: false },
];

const MOCK_OVERRIDES = [
  { id: "o1", title: "Skip competitor mention in proposals", action: "BLOCK" as const, scope: "workbook", active: true },
  { id: "o2", title: "Use metric format: EU (comma decimal)", action: "OVERRIDE" as const, scope: "workbook", active: true },
  { id: "o3", title: "Include NDA clause in all outputs", action: "APPEND" as const, scope: "workbook", active: false },
];

function WorkbookSettings({ workbookId }: { workbookId: string }) {
  const [playbooks, setPlaybooks] = useState(() =>
    MOCK_PLAYBOOKS.map((pb, i) => ({ ...pb, order: i, enabled: i < 4 }))
  );
  const [bundles, setBundles] = useState(MOCK_BUNDLES);
  const [overrides, setOverrides] = useState(MOCK_OVERRIDES);
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
  const [newOverride, setNewOverride] = useState({ title: "", action: "BLOCK" as "BLOCK" | "OVERRIDE" | "APPEND", scope: "workbook", description: "" });

  const movePlaybook = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= playbooks.length) return;
    const next = [...playbooks];
    [next[index], next[target]] = [next[target], next[index]];
    setPlaybooks(next.map((p, i) => ({ ...p, order: i })));
  };

  const toggleBundle = (id: string) => {
    setBundles((prev) => prev.map((b) => b.id === id ? { ...b, assigned: !b.assigned } : b));
  };

  const toggleOverride = (id: string) => {
    setOverrides((prev) => prev.map((o) => o.id === id ? { ...o, active: !o.active } : o));
  };

  const deleteOverride = (id: string) => {
    setOverrides((prev) => prev.filter((o) => o.id !== id));
  };

  const handleCreateOverride = () => {
    if (!newOverride.title.trim()) return;
    const id = `o${Date.now()}`;
    setOverrides((prev) => [...prev, { id, title: newOverride.title.trim(), action: newOverride.action, scope: newOverride.scope, active: true }]);
    setNewOverride({ title: "", action: "BLOCK", scope: "workbook", description: "" });
    setOverrideDialogOpen(false);
  };

  const actionColor = (action: string) => {
    switch (action) {
      case "BLOCK": return "text-destructive border-destructive/30";
      case "OVERRIDE": return "text-yellow-400 border-yellow-400/30";
      case "APPEND": return "text-green-400 border-green-400/30";
      default: return "";
    }
  };

  return (
    <>
      {/* ── Bundle Assignments ── */}
      <div className="rounded-lg border border-border/50 bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Bundle Assignments
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Attach or detach capability bundles from this workbook.</p>
          </div>
          <Badge variant="outline" className="text-xs">{bundles.filter(b => b.assigned).length} active</Badge>
        </div>
        <div className="space-y-2">
          {bundles.map((b) => (
            <div key={b.id} className={`flex items-center justify-between rounded-md border px-4 py-3 transition-colors ${b.assigned ? "border-primary/20 bg-primary/5" : "border-border/50 bg-muted/20"}`}>
              <div className="flex items-center gap-3 min-w-0">
                <Package className={`h-4 w-4 shrink-0 ${b.assigned ? "text-primary" : "text-muted-foreground"}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{b.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-[10px]">{b.scope}</Badge>
                    <span className={`text-[10px] ${b.health >= 80 ? "text-green-400" : b.health >= 60 ? "text-yellow-400" : "text-destructive"}`}>
                      Health: {b.health}%
                    </span>
                  </div>
                </div>
              </div>
              <Switch checked={b.assigned} onCheckedChange={() => toggleBundle(b.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Playbook Ordering ── */}
      <div className="rounded-lg border border-border/50 bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Playbook Ordering
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Reorder and enable/disable protocols shown to operators.</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {playbooks.map((pb, i) => (
            <div key={pb.id} className={`flex items-center gap-2 rounded-md border px-3 py-2.5 transition-colors ${pb.enabled ? "border-border/50 bg-muted/20" : "border-border/30 bg-muted/10 opacity-60"}`}>
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => movePlaybook(i, -1)} disabled={i === 0} className="p-0.5 rounded hover:bg-accent disabled:opacity-30">
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button onClick={() => movePlaybook(i, 1)} disabled={i === playbooks.length - 1} className="p-0.5 rounded hover:bg-accent disabled:opacity-30">
                  <ChevronDownIcon className="h-3 w-3" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground w-5 text-center">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium">{pb.title}</span>
                <span className="text-xs text-muted-foreground ml-2">{pb.subtitle}</span>
              </div>
              <Badge variant="outline" className="text-[10px] shrink-0">{pb.steps.length} steps</Badge>
              <Switch
                checked={pb.enabled}
                onCheckedChange={(checked) => setPlaybooks((prev) => prev.map((p) => p.id === pb.id ? { ...p, enabled: checked } : p))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Context Overrides ── */}
      <div className="rounded-lg border border-border/50 bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Context Overrides
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Workbook-level rules that override inherited context behavior.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{overrides.filter(o => o.active).length} active</Badge>
            <Dialog open={overrideDialogOpen} onOpenChange={setOverrideDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-1.5 text-xs"><Plus className="h-3 w-3" /> Create Override</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Context Override</DialogTitle>
                  <p className="text-xs text-muted-foreground mt-1">Define a rule that overrides inherited context for this workbook.</p>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Rule Description</label>
                    <Textarea
                      placeholder='e.g. "Skip competitor mention in proposals" or "Always include pricing disclaimer"'
                      rows={2}
                      value={newOverride.title}
                      onChange={(e) => setNewOverride({ ...newOverride, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Action Type</label>
                    <Select value={newOverride.action} onValueChange={(v) => setNewOverride({ ...newOverride, action: v as "BLOCK" | "OVERRIDE" | "APPEND" })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BLOCK">
                          <span className="flex items-center gap-2"><AlertTriangle className="h-3 w-3 text-destructive" /> BLOCK — Suppress matching context</span>
                        </SelectItem>
                        <SelectItem value="OVERRIDE">
                          <span className="flex items-center gap-2"><Zap className="h-3 w-3 text-yellow-400" /> OVERRIDE — Replace matching context</span>
                        </SelectItem>
                        <SelectItem value="APPEND">
                          <span className="flex items-center gap-2"><Plus className="h-3 w-3 text-green-400" /> APPEND — Add alongside existing context</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Scope</label>
                    <Select value={newOverride.scope} onValueChange={(v) => setNewOverride({ ...newOverride, scope: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workbook">📗 This Workbook only</SelectItem>
                        <SelectItem value="domain">🏢 Entire Domain</SelectItem>
                        <SelectItem value="global">🌍 Global (all workbooks)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button onClick={handleCreateOverride} disabled={!newOverride.title.trim()}>Create Override</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="space-y-2">
          {overrides.map((o) => (
            <div key={o.id} className={`flex items-center justify-between rounded-md border px-4 py-3 ${o.active ? "border-border/50 bg-muted/20" : "border-border/30 bg-muted/10 opacity-60"}`}>
              <div className="flex items-center gap-3 min-w-0">
                {o.action === "BLOCK" ? <AlertTriangle className="h-4 w-4 text-destructive shrink-0" /> :
                 o.action === "OVERRIDE" ? <Zap className="h-4 w-4 text-yellow-400 shrink-0" /> :
                 <Plus className="h-4 w-4 text-green-400 shrink-0" />}
                <div className="min-w-0">
                  <p className="text-sm font-medium">{o.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className={`text-[10px] ${actionColor(o.action)}`}>{o.action}</Badge>
                    <Badge variant="outline" className="text-[10px]">{o.scope}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Switch checked={o.active} onCheckedChange={() => toggleOverride(o.id)} />
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteOverride(o.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
          <AlertTriangle className="h-3 w-3" /> Overrides take precedence over inherited bundle and org-level context.
        </p>
      </div>
    </>
  );
}
