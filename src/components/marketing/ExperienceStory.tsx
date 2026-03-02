import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Package, FileText, ArrowRight, ChevronDown, ChevronRight,
  Layers, BookOpen, Sparkles,
  Shield, Play, CheckCircle2, Brain, ArrowLeft,
  MessageCircleQuestion, RefreshCw, Link2,
  User, Users,
} from "lucide-react";
import {
  CATEGORY_COLORS, CATEGORY_LABELS,
  type ExtractedBundle, type ExtractedContextItem,
  type ExtractionResult, type ContextCategory,
} from "@/lib/knowledge-schema";
import type {
  ExperiencePreview, ProtocolPreview, CoachingQuestion,
  ProjectedLearning,
} from "@/lib/experience-schema";
import ReactMarkdown from "react-markdown";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

// ── Shared constants ─────────────────────────────────────────────────────────

const CATEGORY_BAR_COLORS: Record<string, string> = {
  PLAYBOOK: "hsl(25 95% 53%)", PROCEDURE: "hsl(185 85% 45%)",
  DIRECTIVE: "hsl(38 92% 50%)", KNOWLEDGE: "hsl(217 91% 60%)",
  PRINCIPLE: "hsl(271 81% 56%)", RESEARCH: "hsl(155 72% 46%)",
  PREFERENCE: "hsl(330 81% 60%)",
};

const CATEGORY_ICONS: Record<string, string> = {
  PLAYBOOK: "📘", PROCEDURE: "⚙️", DIRECTIVE: "⚡", KNOWLEDGE: "📚",
  PRINCIPLE: "🧭", RESEARCH: "🔬", PREFERENCE: "🎯",
};

// Human-readable category labels for the stats summary
const HUMAN_CATEGORY_LABELS: Record<string, string> = {
  PLAYBOOK: "process", PROCEDURE: "step", DIRECTIVE: "rule",
  KNOWLEDGE: "insight", PRINCIPLE: "principle", RESEARCH: "research item",
  PREFERENCE: "preference",
};

const TAB_KEYS = ["map", "playbooks", "execution", "learning"] as const;
type TabKey = typeof TAB_KEYS[number];

const TAB_META: Record<TabKey, { label: string; icon: React.ElementType; step: number }> = {
  map: { label: "What's Inside", icon: Layers, step: 1 },
  playbooks: { label: "Your Playbooks", icon: BookOpen, step: 2 },
  execution: { label: "In Action", icon: Play, step: 3 },
  learning: { label: "What Improves", icon: RefreshCw, step: 4 },
};

const AVATAR_COLORS = [
  "hsl(200 70% 50%)", "hsl(240 70% 60%)", "hsl(320 70% 55%)",
  "hsl(150 60% 45%)", "hsl(30 80% 55%)",
];

// ── Next Step Button ─────────────────────────────────────────────────────────

function NextStepButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="mt-8 pt-6 border-t border-border flex justify-end">
      <button onClick={onClick}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary/10 text-primary hover:bg-primary/15 transition-colors">
        {label} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Team Persona Strip (only used in Act 3) ──────────────────────────────────

function TeamPersonaStrip({ members, compact }: {
  members: ExperiencePreview["workbook_preview"]["team_members"];
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex -space-x-1.5">
          {members.map((m, i) => (
            <TooltipProvider key={i} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-card cursor-default"
                    style={{ background: `${AVATAR_COLORS[i % AVATAR_COLORS.length]}20`, color: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                    {m.name.split(" ").map(w => w[0]).join("")}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom"><p className="text-xs">{m.name} · {m.role}</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card/60 backdrop-blur-sm">
      <Users className="w-4 h-4 text-primary shrink-0" />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground shrink-0">Your Team</span>
      <div className="flex items-center gap-3 flex-wrap">
        {members.map((m, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ background: `${AVATAR_COLORS[i % AVATAR_COLORS.length]}20`, color: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
              {m.name.split(" ").map(w => w[0]).join("")}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground leading-tight">{m.name}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">{m.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Sticky Tab Navigation — numbered steps ───────────────────────────────────

function TabNav({ active, onChange, availableTabs, visitedTabs }: {
  active: TabKey;
  onChange: (t: TabKey) => void;
  availableTabs: TabKey[];
  visitedTabs: Set<TabKey>;
}) {
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-0" />
      <div className={`sticky top-16 z-40 flex justify-center py-3 transition-all duration-300 ${
        isSticky
          ? "bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : ""
      }`}>
        <div className="inline-flex items-center gap-1 px-3 py-2 rounded-full border bg-card/80 backdrop-blur-md border-border shadow-lg">
          {availableTabs.map((key) => {
            const meta = TAB_META[key];
            const Icon = meta.icon;
            const isActive = key === active;
            const isVisited = visitedTabs.has(key) && !isActive;
            return (
              <button key={key} onClick={() => onChange(key)}
                className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isVisited
                    ? "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}>
                <span className={`flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold ${
                  isActive ? "bg-primary-foreground/20" : isVisited ? "bg-primary/15 text-primary" : "bg-muted"
                }`}>{meta.step}</span>
                <Icon className="w-3.5 h-3.5 hidden sm:block" />
                <span className="hidden sm:inline">{meta.label}</span>
                {isVisited && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary/60" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ── Act 1: What's Inside — clean, jargon-free ────────────────────────────────

function BundleTreeItem({ item }: { item: ExtractedContextItem }) {
  const color = CATEGORY_BAR_COLORS[item.category] || "hsl(var(--muted-foreground))";
  const icon = CATEGORY_ICONS[item.category] || "📄";
  const label = CATEGORY_LABELS[item.category as ContextCategory] || item.category;
  const truncatedContent = item.content.length > 120 ? item.content.slice(0, 120) + "…" : item.content;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col gap-0.5 px-3 py-2 rounded-md hover:bg-accent/40 transition-colors cursor-default group">
            <div className="flex items-center gap-2.5">
              <span className="text-xs">{icon}</span>
              <span className="text-sm text-foreground truncate flex-1">{item.title}</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                style={{ background: `${color}15`, color }}>
                {label}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed pl-6 line-clamp-2">{truncatedContent}</p>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p className="text-xs font-semibold mb-1">{item.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{item.content}</p>
          {item.output_type && (
            <p className="text-[10px] text-primary mt-1">Output: {item.output_description || item.output_type}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function BundleTreeNode({ bundle, defaultOpen }: { bundle: ExtractedBundle; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const categoryCounts: Record<string, number> = {};
  for (const item of bundle.items) categoryCounts[item.category] = (categoryCounts[item.category] ?? 0) + 1;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-accent/30 transition-colors">
        <Package className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">{bundle.title}</h3>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{bundle.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-0.5">
            {Object.entries(categoryCounts).map(([cat, n]) => (
              <span key={cat} className="w-2 h-2 rounded-full" style={{ background: CATEGORY_BAR_COLORS[cat] }} title={`${CATEGORY_LABELS[cat as ContextCategory]}: ${n}`} />
            ))}
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">{bundle.items.length}</span>
          {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 border-t border-border pt-2">
          {bundle.items
            .sort((a, b) => (a.category === "PLAYBOOK" ? -1 : b.category === "PLAYBOOK" ? 1 : (a.step_order_hint ?? 99) - (b.step_order_hint ?? 99)))
            .map((item, i) => (
              <BundleTreeItem key={i} item={item} />
            ))}
          {bundle.coverage_gaps && bundle.coverage_gaps.length > 0 && (
            <div className="mt-2 px-3 py-2 rounded-md bg-amber-500/5 border border-amber-500/20">
              <p className="text-[10px] font-semibold text-amber-500 mb-1">Gaps detected</p>
              {bundle.coverage_gaps.map((g, i) => (
                <p key={i} className="text-[10px] text-muted-foreground">• {g}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabDocumentMap({ result, onNext }: {
  result: ExtractionResult;
  onNext: () => void;
}) {
  const bundles = result.bundles ?? [];
  const standaloneItems = result.context_items ?? [];

  // Build human-readable summary
  const categoryCounts: Record<string, number> = {};
  bundles.forEach(b => b.items.forEach(it => {
    categoryCounts[it.category] = (categoryCounts[it.category] ?? 0) + 1;
  }));
  standaloneItems.forEach(it => {
    const cat = (it as ExtractedContextItem).category;
    if (cat) categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
  });

  const totalGaps = bundles.reduce((sum, b) => sum + (b.coverage_gaps?.length ?? 0), 0);

  // Build summary chips: "3 processes · 5 rules · 2 gaps"
  const summaryParts: string[] = [];
  const playbooks = categoryCounts["PLAYBOOK"] ?? 0;
  const procedures = categoryCounts["PROCEDURE"] ?? 0;
  const directives = categoryCounts["DIRECTIVE"] ?? 0;
  const knowledge = (categoryCounts["KNOWLEDGE"] ?? 0) + (categoryCounts["PRINCIPLE"] ?? 0) + (categoryCounts["RESEARCH"] ?? 0) + (categoryCounts["PREFERENCE"] ?? 0);

  if (playbooks > 0) summaryParts.push(`${playbooks} process${playbooks > 1 ? "es" : ""}`);
  if (procedures > 0) summaryParts.push(`${procedures} step${procedures > 1 ? "s" : ""}`);
  if (directives > 0) summaryParts.push(`${directives} rule${directives > 1 ? "s" : ""}`);
  if (knowledge > 0) summaryParts.push(`${knowledge} insight${knowledge > 1 ? "s" : ""}`);
  if (totalGaps > 0) summaryParts.push(`${totalGaps} gap${totalGaps > 1 ? "s" : ""} detected`);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">What's inside your document</h2>
        <p className="text-muted-foreground mb-4">
          LIZA read your document and identified the structure, processes, and rules within it. Expand any section to see the details.
        </p>

        {/* Human-readable summary */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          {summaryParts.map((part, i) => (
            <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-card text-foreground">
              {part}
            </span>
          ))}
        </div>
      </div>

      {result.analysis_notes && (
        <div className="rounded-xl border p-5 mb-6" style={{ borderColor: "hsl(var(--primary) / 0.2)", background: "hsl(var(--primary) / 0.05)" }}>
          <p className="text-sm text-muted-foreground leading-relaxed">{result.analysis_notes}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {bundles.map((bundle, i) => (
          <BundleTreeNode key={i} bundle={bundle} defaultOpen={i === 0} />
        ))}
      </div>

      {standaloneItems.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Additional Items</h3>
          <div className="rounded-xl border border-border bg-card p-3">
            {standaloneItems.map((item, i) => (
              <BundleTreeItem key={i} item={item as ExtractedContextItem} />
            ))}
          </div>
        </div>
      )}

      <NextStepButton label="Next: See the playbooks LIZA built" onClick={onNext} />
    </div>
  );
}

// ── Act 2: Your Playbooks — no fabricated team, amber gaps ───────────────────

function PlaybookCard({ protocol, coachingQuestions, defaultOpen }: {
  protocol: ProtocolPreview;
  coachingQuestions: CoachingQuestion[];
  defaultOpen?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultOpen ?? false);
  const relatedQuestions = coachingQuestions.filter(q =>
    q.targets.toLowerCase().includes(protocol.title.toLowerCase()) ||
    q.targets.toLowerCase().includes(protocol.source_playbook.toLowerCase())
  );

  return (
    <div className="rounded-xl border overflow-hidden border-border bg-card">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-accent/30 transition-colors">
        <BookOpen className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{protocol.title}</h3>
          <p className="text-xs text-muted-foreground truncate">{protocol.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {relatedQuestions.length > 0 && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
              <MessageCircleQuestion className="w-3 h-3" />{relatedQuestions.length} to answer
            </span>
          )}
          <span className="text-xs font-mono text-muted-foreground">{protocol.steps.length} steps</span>
          {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>
      {expanded && (
        <div className="px-5 pb-5 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground mb-4">
            {protocol.estimated_duration ? `Est. ${protocol.estimated_duration} · ` : ""}{protocol.steps.length} steps · {protocol.compliance_gates.length} compliance gate{protocol.compliance_gates.length !== 1 ? "s" : ""}
          </p>

          <div className="flex flex-col gap-2 mb-4">
            {protocol.steps.map((step) => (
              <div key={step.order} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <span className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0"
                  style={{
                    background: step.type === "gate" ? "hsl(38 92% 50% / 0.15)" : step.type === "ai_assist" ? "hsl(var(--primary) / 0.15)" : "hsl(var(--muted))",
                    color: step.type === "gate" ? "hsl(38 92% 50%)" : step.type === "ai_assist" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}>
                  {step.type === "gate" ? <Shield className="w-3 h-3" /> : step.type === "ai_assist" ? <Sparkles className="w-3 h-3" /> : step.order}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{step.title}</p>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: step.type === "gate" ? "hsl(38 92% 50% / 0.1)" : step.type === "ai_assist" ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted))",
                        color: step.type === "gate" ? "hsl(38 92% 50%)" : step.type === "ai_assist" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                      }}>
                      {step.type === "gate"
                        ? "Compliance gate · LIZA checks criteria before the team can proceed"
                        : step.type === "ai_assist"
                        ? "AI-assisted · LIZA drafts this for your team to review"
                        : "Team action · LIZA tracks progress and captures learnings"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {protocol.compliance_gates.length > 0 && (
            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1">Compliance gates</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {protocol.compliance_gates.map((g, i) => <li key={i}>• {g}</li>)}
              </ul>
            </div>
          )}

          {/* Coaching questions — amber, opportunity framing */}
          {relatedQuestions.length > 0 && (
            <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircleQuestion className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-600">Questions worth answering</span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3">
                Answering these would make this playbook stronger. LIZA couldn't find the answers in your document.
              </p>
              <div className="flex flex-col gap-3">
                {relatedQuestions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-background/60">
                    <span className="text-xs font-bold text-amber-600 mt-0.5">{i + 1}</span>
                    <div>
                      <p className="text-xs font-medium text-foreground">{q.question}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{q.context}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabPlaybooks({ protocols, coachingQuestions, unmatchedQuestions, onNext }: {
  protocols: ProtocolPreview[];
  coachingQuestions: CoachingQuestion[];
  unmatchedQuestions: CoachingQuestion[];
  onNext: () => void;
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Playbooks</h2>
        <p className="text-muted-foreground mb-3">
          These are step-by-step workflows LIZA built from your document. Each one can be run by your team with AI support.
        </p>
        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-primary">How LIZA helped: </span>
            LIZA transformed your processes into executable playbooks with defined steps, compliance gates, and identified where AI can draft outputs for your team to review.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {protocols.map((p, i) => (
          <PlaybookCard key={i} protocol={p} coachingQuestions={coachingQuestions} defaultOpen={i === 0} />
        ))}
      </div>

      {unmatchedQuestions.length > 0 && (
        <div className="mt-6 rounded-xl border p-5 border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircleQuestion className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-600">More questions worth answering</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            These would help LIZA build additional playbooks from your expertise.
          </p>
          <div className="flex flex-col gap-3">
            {unmatchedQuestions.map((q, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background/60">
                <span className="text-xs font-bold text-amber-600 mt-0.5">{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{q.question}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{q.context}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <NextStepButton label="Next: See what execution looks like" onClick={onNext} />
    </div>
  );
}

// ── Act 3: In Action — team personas appear here ─────────────────────────────

function ExecutionDrillDown({ protocol, preview, onBack }: {
  protocol: ProtocolPreview;
  preview: ExperiencePreview["workbook_preview"];
  onBack: () => void;
}) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const teamMembers = preview.team_members;

  useEffect(() => {
    if (!isAutoPlaying) return;
    timerRef.current = setInterval(() => {
      setActiveStepIndex(prev => {
        const next = prev + 1;
        if (next >= protocol.steps.length) {
          setIsAutoPlaying(false);
          return prev;
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [isAutoPlaying, protocol.steps.length]);

  const handleStepClick = (index: number) => {
    setIsAutoPlaying(false);
    clearInterval(timerRef.current);
    setActiveStepIndex(index);
  };

  const activeStep = protocol.steps[activeStepIndex];
  const assignedMember = teamMembers[activeStepIndex % teamMembers.length];
  const memberColor = AVATAR_COLORS[activeStepIndex % AVATAR_COLORS.length];

  // Context accumulation — narrative style
  const previousSteps = protocol.steps.slice(0, activeStepIndex);
  const accumulationText = previousSteps.length > 0
    ? previousSteps.length === 1
      ? `With "${previousSteps[0].title}" complete, LIZA uses those findings here.`
      : `Building on the outputs from ${previousSteps.map(s => `"${s.title}"`).join(" and ")}.`
    : null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Choose a playbook
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
            <Play className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{protocol.title}</h3>
            <p className="text-xs text-muted-foreground">{protocol.estimated_duration ? `Est. ${protocol.estimated_duration}` : `${protocol.steps.length} steps`}</p>
          </div>
          <TeamPersonaStrip members={teamMembers} compact />
        </div>
      </div>

      {/* Horizontal timeline */}
      <div className="px-6 py-4 border-b border-border overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {protocol.steps.map((step, i) => {
            const isCurrent = i === activeStepIndex;
            const isPast = i < activeStepIndex;
            const member = teamMembers[i % teamMembers.length];
            const mColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <div key={step.order} className="flex items-center gap-1">
                <button onClick={() => handleStepClick(i)}
                  className={`relative flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg transition-all min-w-[90px] ${
                    isCurrent
                      ? "bg-primary/10 border border-primary/30 shadow-sm"
                      : isPast
                      ? "opacity-70 hover:opacity-90"
                      : "opacity-40 hover:opacity-60"
                  }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                    isCurrent ? "border-primary" : isPast ? "border-emerald-500/50" : "border-border"
                  }`}
                    style={{ background: `${mColor}20`, color: mColor }}>
                    {isPast ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : member.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <span className={`text-[11px] text-center leading-tight ${isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {step.title}
                  </span>
                  {step.type !== "action" && (
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        background: step.type === "gate" ? "hsl(38 92% 50% / 0.1)" : "hsl(var(--primary) / 0.1)",
                        color: step.type === "gate" ? "hsl(38 92% 50%)" : "hsl(var(--primary))",
                      }}>
                      {step.type === "gate" ? "Gate" : "AI"}
                    </span>
                  )}
                  {isCurrent && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />}
                </button>
                {i < protocol.steps.length - 1 && (
                  <div className={`w-6 h-px ${isPast ? "bg-emerald-500/50" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active step content */}
      <div className="p-6">
        {activeStep && (
          <div>
            {/* Who is doing this */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: `${memberColor}20`, color: memberColor }}>
                {assignedMember.name.split(" ").map(w => w[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{assignedMember.name} <span className="text-muted-foreground font-normal">· {assignedMember.role}</span></p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: activeStep.type === "gate" ? "hsl(38 92% 50% / 0.1)" : activeStep.type === "ai_assist" ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted))",
                      color: activeStep.type === "gate" ? "hsl(38 92% 50%)" : activeStep.type === "ai_assist" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                    }}>
                    {activeStep.type === "gate" ? "Compliance gate" : activeStep.type === "ai_assist" ? "AI-assisted step" : "Team action"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Step {activeStep.order} of {protocol.steps.length}</span>
                </div>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-foreground mb-2">{activeStep.title}</h4>

            {accumulationText && (
              <div className="flex items-start gap-2 mb-3 px-3 py-2 rounded-lg bg-muted/40 border border-border/50">
                <Link2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground">{accumulationText}</p>
              </div>
            )}

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{activeStep.description}</p>

            {activeStep.output_type && (
              <div className="text-xs text-primary mb-4 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Expected output: {activeStep.output_type}
              </div>
            )}

            {/* AI draft — only show full draft for the matching step */}
            {activeStep.type === "ai_assist" && preview.current_session.ai_draft_output && (
              <div className="rounded-lg border p-4 border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary">What LIZA generates</span>
                </div>
                {activeStep.title.toLowerCase().includes(preview.current_session.current_step.toLowerCase()) ? (
                  <>
                    <p className="text-xs text-muted-foreground mb-3">
                      {accumulationText ? `Using the outputs from previous steps and ` : "Using "}the context from your document, LIZA drafts this for {assignedMember.name} to review:
                    </p>
                    <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none border-t border-border pt-3 mt-2">
                      <ReactMarkdown>{preview.current_session.ai_draft_output}</ReactMarkdown>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    LIZA generates a contextualised {activeStep.output_type || "draft"} for this step, using your document's content{accumulationText ? " and the outputs from previous steps" : ""}. {assignedMember.name} reviews and refines before moving on.
                  </p>
                )}
              </div>
            )}

            {activeStep.type === "gate" && (
              <div className="rounded-lg border p-4 border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-500">Compliance check</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  The team cannot advance until these criteria are met:
                </p>
                {protocol.compliance_gates.length > 0 && (
                  <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                    {protocol.compliance_gates.map((g, i) => <li key={i}>• {g}</li>)}
                  </ul>
                )}
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10 mt-3">
                  <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-semibold text-primary mb-0.5">How LIZA helps</p>
                    <p className="text-[11px] text-muted-foreground">
                      LIZA automatically evaluates the gate criteria against the work completed so far, flagging what passes and what still needs attention before the team can proceed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeStep.type === "action" && (
              <div className="rounded-lg border p-4 border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-3.5 h-3.5 text-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground">Team action</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {assignedMember.name} completes this step following the playbook guidelines.
                </p>
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                  <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-semibold text-primary mb-0.5">How LIZA helps</p>
                    <p className="text-[11px] text-muted-foreground">
                      LIZA monitors this step in real-time — tracking progress, flagging when output drifts from the playbook, and capturing learnings that feed back into your knowledge base.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {preview.current_session.compliance_score != null && (
              <div className="flex items-center gap-2 mt-4">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs text-muted-foreground">Compliance: <strong className="text-foreground">{Math.round(preview.current_session.compliance_score * 100)}%</strong></span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TabExecution({ protocols, preview, onNext }: {
  protocols: ProtocolPreview[];
  preview: ExperiencePreview["workbook_preview"];
  onNext: () => void;
}) {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolPreview | null>(null);

  if (selectedProtocol) {
    return (
      <div>
        <ExecutionDrillDown protocol={selectedProtocol} preview={preview} onBack={() => setSelectedProtocol(null)} />
        <NextStepButton label="Next: See what improves over time" onClick={onNext} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Team in Action</h2>
        <p className="text-muted-foreground mb-4">
          Here's what it looks like when your team runs these playbooks. Click any playbook to walk through a live simulation.
        </p>
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border/50 mb-4">
          <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Example team: </span>
            {preview.team_members.map(m => `${m.name} (${m.role})`).join(", ")}. In production, these would be your actual team members.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {protocols.map((p, i) => (
          <button key={i} onClick={() => setSelectedProtocol(p)}
            className="rounded-xl border p-5 text-left border-border bg-card hover:border-primary/30 hover:shadow-md transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 group-hover:bg-primary/15 transition-colors">
                <Play className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{p.title}</h3>
                <p className="text-[10px] text-muted-foreground">{p.estimated_duration || `${p.steps.length} steps`}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{p.description}</p>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
              <span className="text-[10px] text-muted-foreground">{p.steps.length} steps</span>
              <span className="text-[10px] text-muted-foreground">{p.steps.filter(s => s.type === "ai_assist").length} AI-assisted</span>
              <span className="text-[10px] text-muted-foreground">{p.compliance_gates.length} gate{p.compliance_gates.length !== 1 ? "s" : ""}</span>
            </div>
          </button>
        ))}
      </div>

      <NextStepButton label="Next: See what improves over time" onClick={onNext} />
    </div>
  );
}

// ── Act 4: What Improves — no SECI jargon ────────────────────────────────────

const LEARNING_COLORS: Record<string, { bg: string; text: string }> = {
  efficiency: { bg: "hsl(200 90% 52% / 0.1)", text: "hsl(200 90% 52%)" },
  quality: { bg: "hsl(155 72% 46% / 0.1)", text: "hsl(155 72% 46%)" },
  compliance: { bg: "hsl(38 92% 50% / 0.1)", text: "hsl(38 92% 50%)" },
  collaboration: { bg: "hsl(271 81% 56% / 0.1)", text: "hsl(271 81% 56%)" },
};

function TabLearn({ learnings, onGoToMap }: { learnings: ProjectedLearning[]; onGoToMap: () => void }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">What Improves Over Time</h2>
        <p className="text-muted-foreground">
          Every time your team runs a playbook, LIZA captures what worked and what didn't. Your playbooks get smarter automatically.
        </p>
      </div>

      {/* Clean cycle — no academic labels */}
      <div className="rounded-xl border p-6 mb-8 border-border bg-card">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-4 text-center">The improvement loop</p>
        <div className="flex items-center justify-center gap-2 flex-wrap mb-4">
          {[
            { label: "Run a playbook", icon: Play },
            { label: "Capture learnings", icon: Users },
            { label: "Refine knowledge", icon: Brain },
            { label: "Better next time", icon: Sparkles },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg min-w-[100px]"
                style={{
                  background: "hsl(var(--primary) / 0.06)",
                  border: "1px solid hsl(var(--primary) / 0.15)",
                }}>
                <step.icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground text-center">{step.label}</span>
              </div>
              {i < 3 && <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />}
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <button onClick={onGoToMap}
            className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors font-medium px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5">
            <RefreshCw className="w-3 h-3" />
            This feeds back into your document
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {learnings.map((l, i) => {
          const colors = LEARNING_COLORS[l.category] || LEARNING_COLORS.efficiency;
          return (
            <div key={i} className="rounded-xl border p-5 border-border bg-card">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4" style={{ color: colors.text }} />
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: colors.bg, color: colors.text }}>{l.category}</span>
              </div>
              <h4 className="text-sm font-semibold text-foreground mb-1">{l.title}</h4>
              <p className="text-xs text-muted-foreground mb-3">{l.insight}</p>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50">
                <ArrowRight className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">LIZA will update your playbook to</p>
                  <p className="text-[11px] text-foreground">{l.refinement_action}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── CTA ──────────────────────────────────────────────────────────────────────

function CTASection({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border p-8 text-center mt-8"
      style={{ borderColor: "hsl(var(--primary) / 0.3)", background: "hsl(var(--primary) / 0.05)" }}>
      <h3 className="text-xl font-bold text-foreground mb-2">Ready to do this for real?</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
        The Protocol Sprint takes one process from your best person's head and turns it into a system your whole team runs. Five days. €5,000. Done.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/sprint"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold brand-gradient-btn"
          style={{ boxShadow: "0 0 20px -4px hsl(var(--primary) / 0.4)" }}>
          See the Protocol Sprint <ArrowRight className="w-4 h-4" />
        </Link>
        <button onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border text-muted-foreground hover:text-foreground transition-colors border-border">
          Try Another Document
        </button>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────

interface ExperienceStoryProps {
  extractionResult: ExtractionResult;
  experiencePreview: ExperiencePreview;
  onReset: () => void;
}

export function ExperienceStory({ extractionResult, experiencePreview, onReset }: ExperienceStoryProps) {
  const hasProtocols = experiencePreview.protocols.length > 0;
  const hasLearnings = experiencePreview.projected_learnings.length > 0;

  const allQuestions = experiencePreview.coaching_questions;
  const protocolTitles = experiencePreview.protocols.map(p => p.title.toLowerCase());
  const protocolSources = experiencePreview.protocols.map(p => p.source_playbook.toLowerCase());
  const unmatchedQuestions = allQuestions.filter(q => {
    const t = q.targets.toLowerCase();
    return !protocolTitles.some(pt => t.includes(pt)) && !protocolSources.some(ps => t.includes(ps));
  });

  const availableTabs: TabKey[] = ["map"];
  if (hasProtocols) availableTabs.push("playbooks", "execution");
  if (hasLearnings) availableTabs.push("learning");

  const [activeTab, setActiveTab] = useState<TabKey>("map");
  const [visitedTabs, setVisitedTabs] = useState<Set<TabKey>>(new Set(["map"]));

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setVisitedTabs(prev => new Set([...prev, tab]));
  };

  const goToNextTab = () => {
    const currentIndex = availableTabs.indexOf(activeTab);
    if (currentIndex < availableTabs.length - 1) {
      handleTabChange(availableTabs[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <TabNav active={activeTab} onChange={handleTabChange} availableTabs={availableTabs} visitedTabs={visitedTabs} />

      {activeTab === "map" && <TabDocumentMap result={extractionResult} onNext={goToNextTab} />}
      {activeTab === "playbooks" && (
        <TabPlaybooks protocols={experiencePreview.protocols} coachingQuestions={allQuestions} unmatchedQuestions={unmatchedQuestions} onNext={goToNextTab} />
      )}
      {activeTab === "execution" && (
        <TabExecution protocols={experiencePreview.protocols} preview={experiencePreview.workbook_preview} onNext={goToNextTab} />
      )}
      {activeTab === "learning" && (
        <TabLearn learnings={experiencePreview.projected_learnings} onGoToMap={() => handleTabChange("map")} />
      )}

      <CTASection onReset={onReset} />
    </div>
  );
}
