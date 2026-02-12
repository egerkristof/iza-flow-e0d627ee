import { useState, useCallback } from "react";
import { Lock, Unlock, Play, ChevronRight, Clock, FileText, Zap, Target, Search as SearchIcon, BarChart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface Playbook {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  steps: { id: string; label: string; instruction: string }[];
  assets: string[];
}

const MOCK_PLAYBOOKS: Playbook[] = [
  {
    id: "presales_intro_intel",
    title: "Draft Proposal",
    subtitle: "MEDIC Method",
    icon: <FileText className="h-5 w-5" />,
    steps: [
      { id: "s1", label: "Internal Memory Audit", instruction: "Query internal CRM and drive for existing client data…" },
      { id: "s2", label: "External Demand Pull", instruction: "Research competitor landscape and market positioning…" },
      { id: "s3", label: "Synthesis & Output", instruction: "Compile findings into the proposal template…" },
    ],
    assets: ["Client History (CRM)", "Pricing Matrix v2.1", "Brand Guidelines"],
  },
  {
    id: "client_research",
    title: "Client Research",
    subtitle: "Deep Intel Protocol",
    icon: <SearchIcon className="h-5 w-5" />,
    steps: [
      { id: "s1", label: "Company Profile Scan", instruction: "Pull financials, org chart, and recent news…" },
      { id: "s2", label: "Stakeholder Mapping", instruction: "Identify key decision makers and influencers…" },
    ],
    assets: ["Account Database", "LinkedIn Intel", "News Feed"],
  },
  {
    id: "deal_review",
    title: "Deal Review",
    subtitle: "Win/Loss Analysis",
    icon: <Target className="h-5 w-5" />,
    steps: [
      { id: "s1", label: "Deal Metrics Review", instruction: "Analyze pipeline velocity, conversion rates…" },
      { id: "s2", label: "Risk Assessment", instruction: "Flag blockers, competitor threats, timeline risks…" },
      { id: "s3", label: "Action Plan", instruction: "Generate next-steps with owner assignments…" },
    ],
    assets: ["Deal Pipeline", "Competitor Matrix", "Risk Register"],
  },
  {
    id: "pricing_analysis",
    title: "Pricing Analysis",
    subtitle: "Value Engineering",
    icon: <BarChart className="h-5 w-5" />,
    steps: [
      { id: "s1", label: "Cost Model Review", instruction: "Validate cost assumptions against current rates…" },
      { id: "s2", label: "Market Benchmark", instruction: "Compare against industry pricing data…" },
    ],
    assets: ["Pricing Matrix", "Market Data", "Margin Calculator"],
  },
  {
    id: "competitive_intel",
    title: "Competitive Intel",
    subtitle: "Battlecard Builder",
    icon: <Zap className="h-5 w-5" />,
    steps: [
      { id: "s1", label: "Competitor Sweep", instruction: "Scan web, news, product launches for competitor updates…" },
      { id: "s2", label: "Battlecard Update", instruction: "Update strengths/weaknesses/positioning matrix…" },
    ],
    assets: ["Battlecards v3", "Product Comparison", "Win/Loss DB"],
  },
  {
    id: "onboarding_setup",
    title: "Onboarding Setup",
    subtitle: "Client Success",
    icon: <Users className="h-5 w-5" />,
    steps: [
      { id: "s1", label: "Kick-off Prep", instruction: "Prepare agenda, stakeholder introductions, success metrics…" },
      { id: "s2", label: "System Configuration", instruction: "Set up client workspace, integrations, access permissions…" },
      { id: "s3", label: "Handoff Brief", instruction: "Compile transition doc for the delivery team…" },
    ],
    assets: ["Onboarding Checklist", "Integration Guide", "SLA Template"],
  },
];

interface Mission {
  id: string;
  playbookTitle: string;
  currentStep: number;
  totalSteps: number;
  startedAt: string;
}

const LaunchpadPage = () => {
  const [lockedPlaybook, setLockedPlaybook] = useState<Playbook | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; text: string }[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);

  const handleLock = (playbook: Playbook) => {
    setLockedPlaybook(playbook);
    setCurrentStepIndex(0);
    setChatMessages([]);
    setChatInput("");
  };

  const handleUnlock = () => {
    if (lockedPlaybook) {
      setMissions((prev) => [
        ...prev,
        {
          id: lockedPlaybook.id + "-" + Date.now(),
          playbookTitle: lockedPlaybook.title,
          currentStep: currentStepIndex + 1,
          totalSteps: lockedPlaybook.steps.length,
          startedAt: new Date().toLocaleTimeString(),
        },
      ]);
    }
    setLockedPlaybook(null);
    setCurrentStepIndex(0);
    setChatMessages([]);
  };

  const handleSend = () => {
    if (!chatInput.trim() || !lockedPlaybook) return;
    const step = lockedPlaybook.steps[currentStepIndex];
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: chatInput },
      { role: "assistant", text: `[Step ${currentStepIndex + 1}: ${step.label}] Processing your input for "${lockedPlaybook.title}"…` },
    ]);
    setChatInput("");
    if (currentStepIndex < lockedPlaybook.steps.length - 1) {
      setCurrentStepIndex((i) => i + 1);
    }
  };

  // LOCKED STATE — Guided execution view
  if (lockedPlaybook) {
    const step = lockedPlaybook.steps[currentStepIndex];
    return (
      <div className="flex h-full flex-col" style={{ background: "hsl(205 85% 55% / 0.03)" }}>
        {/* Protocol Banner */}
        <div className="flex items-center justify-between border-b border-primary/20 bg-primary/5 px-6 py-3">
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Active Protocol: {lockedPlaybook.title}
            </span>
            <Badge variant="outline" className="border-primary/30 text-primary text-xs">
              Step {currentStepIndex + 1} of {lockedPlaybook.steps.length}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={handleUnlock} className="text-xs text-muted-foreground hover:text-destructive">
            <Unlock className="mr-1 h-3 w-3" /> Release Lock
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat area */}
          <div className="flex flex-1 flex-col">
            {/* Step progress */}
            <div className="flex gap-1 border-b border-border/50 px-6 py-3">
              {lockedPlaybook.steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1">
                  <div
                    className={`flex h-6 items-center rounded-full px-3 text-xs font-medium transition-all ${
                      i === currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : i < currentStepIndex
                        ? "bg-primary/20 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </div>
                  {i < lockedPlaybook.steps.length - 1 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
                </div>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-auto p-6 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-sm text-muted-foreground italic">
                  Protocol locked. Begin by providing input for: <strong>{step.label}</strong>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
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
                  placeholder={step.instruction}
                  className="flex-1 bg-secondary/50"
                />
                <Button onClick={handleSend} size="icon">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mission Assets sidebar */}
          <div className="w-64 border-l border-border/50 bg-card/50 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mission Assets</h3>
            <div className="space-y-2">
              {lockedPlaybook.assets.map((asset) => (
                <div key={asset} className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2 text-xs">
                  <FileText className="h-3 w-3 text-primary" />
                  <span>{asset}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Local Memory</h3>
              <p className="text-xs text-muted-foreground italic">No pinned items yet</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // IDLE STATE — Action Grid
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">🚀 The Launchpad</h1>
        <p className="mt-1 text-muted-foreground">Select a protocol to lock into guided execution mode.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_PLAYBOOKS.map((pb) => (
          <button
            key={pb.id}
            onClick={() => handleLock(pb)}
            className="group flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-5 text-left transition-all hover:border-primary/30 hover:glow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                {pb.icon}
              </div>
              <div>
                <h3 className="font-medium">{pb.title}</h3>
                <p className="text-xs text-muted-foreground">{pb.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{pb.steps.length} steps</span>
              <span>·</span>
              <span>{pb.assets.length} assets</span>
            </div>
          </button>
        ))}
      </div>

      {/* Active Missions */}
      <div>
        <h2 className="mb-3 text-lg font-medium flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Active Missions
        </h2>
        {missions.length === 0 ? (
          <div className="rounded-lg border border-border/50 bg-card p-4 text-sm text-muted-foreground">
            No active missions. Click an action card above to begin a protocol.
          </div>
        ) : (
          <div className="space-y-2">
            {missions.map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-card px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                  <span className="text-sm font-medium">{m.playbookTitle}</span>
                  <Badge variant="outline" className="text-xs">
                    Step {m.currentStep}/{m.totalSteps}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">Started {m.startedAt}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LaunchpadPage;
