import { useState, useEffect, useRef } from "react";
import {
  Package, FileText, ArrowRight, ChevronDown, ChevronRight,
  Layers, Users, BookOpen, Sparkles,
  Shield, Play, CheckCircle2, Brain, ArrowLeft,
  MessageCircleQuestion, RefreshCw,
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

// ── Shared ───────────────────────────────────────────────────────────────────

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

const TAB_KEYS = ["map", "playbooks", "execution", "learning"] as const;
type TabKey = typeof TAB_KEYS[number];

const TAB_META: Record<TabKey, { label: string; icon: React.ElementType }> = {
  map: { label: "Document Map", icon: Layers },
  playbooks: { label: "Playbooks", icon: BookOpen },
  execution: { label: "Execution", icon: Play },
  learning: { label: "Learning Loop", icon: RefreshCw },
};

// ── Tab Navigation ───────────────────────────────────────────────────────────

function TabNav({ active, onChange, availableTabs }: {
  active: TabKey;
  onChange: (t: TabKey) => void;
  availableTabs: TabKey[];
}) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex items-center gap-1 px-3 py-2 rounded-full border bg-card/80 backdrop-blur-md border-border shadow-lg">
        {availableTabs.map((key) => {
          const meta = TAB_META[key];
          const Icon = meta.icon;
          const isActive = key === active;
          return (
            <button key={key} onClick={() => onChange(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}>
              <Icon className="w-3.5 h-3.5" />
              {meta.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Act 1: Document Map — Visual Tree ────────────────────────────────────────

function BundleTreeItem({ item }: { item: ExtractedContextItem }) {
  const color = CATEGORY_BAR_COLORS[item.category] || "hsl(var(--muted-foreground))";
  const icon = CATEGORY_ICONS[item.category] || "📄";
  const label = CATEGORY_LABELS[item.category as ContextCategory] || item.category;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md hover:bg-accent/40 transition-colors cursor-default group">
            <span className="text-xs">{icon}</span>
            <span className="text-sm text-foreground truncate flex-1">{item.title}</span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
              style={{ background: `${color}15`, color }}>
              {label}
            </span>
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
          {/* Mini category dots */}
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
          {/* Items grouped: playbooks first, then rest */}
          {bundle.items
            .sort((a, b) => (a.category === "PLAYBOOK" ? -1 : b.category === "PLAYBOOK" ? 1 : (a.step_order_hint ?? 99) - (b.step_order_hint ?? 99)))
            .map((item, i) => (
              <BundleTreeItem key={i} item={item} />
            ))}
          {bundle.coverage_gaps && bundle.coverage_gaps.length > 0 && (
            <div className="mt-2 px-3 py-2 rounded-md bg-amber-500/5 border border-amber-500/20">
              <p className="text-[10px] font-semibold text-amber-500 mb-1">Coverage Gaps</p>
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

function TabDocumentMap({ result }: { result: ExtractionResult }) {
  const bundles = result.bundles ?? [];
  const standaloneItems = result.context_items ?? [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Your document, decoded</h2>
        <p className="text-muted-foreground">LIZA identified the structure and knowledge within your document. Hover over any item to see what was extracted.</p>
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
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Standalone Items</h3>
          <div className="rounded-xl border border-border bg-card p-3">
            {standaloneItems.map((item, i) => (
              <BundleTreeItem key={i} item={item as ExtractedContextItem} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Act 2: Playbooks ─────────────────────────────────────────────────────────

function PlaybookCard({ protocol, coachingQuestions }: { protocol: ProtocolPreview; coachingQuestions: CoachingQuestion[] }) {
  const [expanded, setExpanded] = useState(false);
  const relatedQuestions = coachingQuestions.filter(q =>
    q.targets.toLowerCase().includes(protocol.title.toLowerCase()) ||
    q.targets.toLowerCase().includes(protocol.source_playbook.toLowerCase())
  );

  return (
    <div className="rounded-xl border overflow-hidden border-border bg-card">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-accent/30 transition-colors">
        <Play className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{protocol.title}</h3>
          <p className="text-xs text-muted-foreground truncate">{protocol.description}</p>
        </div>
        <span className="text-xs font-mono text-muted-foreground shrink-0">{protocol.steps.length} steps</span>
        {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="px-5 pb-5 border-t border-border pt-4">
          <p className="text-xs text-muted-foreground mb-4">
            {protocol.estimated_duration ? `Est. ${protocol.estimated_duration} · ` : ""}{protocol.steps.length} steps · {protocol.compliance_gates.length} compliance gates
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
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{step.title}</p>
                    {step.type !== "action" && (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded"
                        style={{
                          background: step.type === "gate" ? "hsl(38 92% 50% / 0.1)" : "hsl(var(--primary) / 0.1)",
                          color: step.type === "gate" ? "hsl(38 92% 50%)" : "hsl(var(--primary))",
                        }}>
                        {step.type === "gate" ? "Compliance Gate" : "AI-Assisted"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {protocol.compliance_gates.length > 0 && (
            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1">Compliance Gates</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {protocol.compliance_gates.map((g, i) => <li key={i}>• {g}</li>)}
              </ul>
            </div>
          )}

          {relatedQuestions.length > 0 && (
            <div className="p-3 rounded-lg border border-border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircleQuestion className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">Knowledge Gaps Identified</span>
              </div>
              <div className="flex flex-col gap-2">
                {relatedQuestions.map((q, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-primary mt-0.5">{i + 1}</span>
                    <div>
                      <p className="text-xs font-medium text-foreground">{q.question}</p>
                      <p className="text-[10px] text-muted-foreground">{q.context}</p>
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

function TabPlaybooks({ protocols, coachingQuestions, unmatchedQuestions }: {
  protocols: ProtocolPreview[];
  coachingQuestions: CoachingQuestion[];
  unmatchedQuestions: CoachingQuestion[];
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Playbooks your team can run</h2>
        <p className="text-muted-foreground">Each playbook becomes a structured workflow with AI assistance and compliance gates. Knowledge gaps are flagged inline.</p>
      </div>

      <div className="flex flex-col gap-3">
        {protocols.map((p, i) => <PlaybookCard key={i} protocol={p} coachingQuestions={coachingQuestions} />)}
      </div>

      {unmatchedQuestions.length > 0 && (
        <div className="mt-6 rounded-xl border p-5 border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircleQuestion className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Additional Knowledge Gaps</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            These questions would help LIZA build additional playbooks from your expertise.
          </p>
          <div className="flex flex-col gap-3">
            {unmatchedQuestions.map((q, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <span className="flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold shrink-0"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>{i + 1}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{q.question}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{q.context}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Act 3: Execution — Drill-down ────────────────────────────────────────────

function ExecutionDrillDown({ protocol, preview }: {
  protocol: ProtocolPreview;
  preview: ExperiencePreview["workbook_preview"];
  onBack: () => void;
}) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Auto-advance through steps
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
    }, 3500);
    return () => clearInterval(timerRef.current);
  }, [isAutoPlaying, protocol.steps.length]);

  const handleStepClick = (index: number) => {
    setIsAutoPlaying(false);
    clearInterval(timerRef.current);
    setActiveStepIndex(prev => prev === index ? index : index);
  };

  const activeStep = protocol.steps[activeStepIndex];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
            <Play className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{protocol.title}</h3>
            <p className="text-xs text-muted-foreground">{protocol.estimated_duration ? `Est. ${protocol.estimated_duration}` : `${protocol.steps.length} steps`}</p>
          </div>
        </div>

        {/* Team members */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex -space-x-2">
            {preview.team_members.map((m, i) => (
              <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-card"
                style={{ background: `hsl(${200 + i * 40} 70% 50% / 0.2)`, color: `hsl(${200 + i * 40} 70% 50%)` }}>
                {m.name.split(" ").map(w => w[0]).join("")}
              </div>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">{preview.team_members.map(m => m.name).join(", ")}</span>
        </div>
      </div>

      {/* Steps & content */}
      <div className="flex flex-col md:flex-row">
        {/* Step list — left sidebar */}
        <div className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-border p-4">
          <div className="flex flex-col gap-1">
            {protocol.steps.map((step, i) => {
              const isCurrent = i === activeStepIndex;
              const isPast = i < activeStepIndex;
              return (
                <button key={step.order} onClick={() => handleStepClick(i)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all ${
                    isCurrent ? "bg-primary/10 border border-primary/20" : isPast ? "opacity-60 hover:opacity-80" : "opacity-40 hover:opacity-60"
                  }`}>
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                    isPast ? "bg-emerald-500/20 text-emerald-400" : isCurrent ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {isPast ? <CheckCircle2 className="w-3 h-3" /> : step.order}
                  </span>
                  <span className={`text-xs truncate ${isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{step.title}</span>
                  {step.type === "gate" && <Shield className="w-3 h-3 ml-auto shrink-0" style={{ color: "hsl(38 92% 50%)" }} />}
                  {step.type === "ai_assist" && <Sparkles className="w-3 h-3 ml-auto shrink-0 text-primary" />}
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active step content — right */}
        <div className="flex-1 p-6">
          {activeStep && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded"
                  style={{
                    background: activeStep.type === "gate" ? "hsl(38 92% 50% / 0.1)" : activeStep.type === "ai_assist" ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted))",
                    color: activeStep.type === "gate" ? "hsl(38 92% 50%)" : activeStep.type === "ai_assist" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  }}>
                  {activeStep.type === "gate" ? "Compliance Gate" : activeStep.type === "ai_assist" ? "AI-Assisted" : "Action"}
                </span>
                <span className="text-[10px] text-muted-foreground">Step {activeStep.order} of {protocol.steps.length}</span>
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">{activeStep.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{activeStep.description}</p>

              {activeStep.output_type && (
                <div className="text-xs text-primary mb-4 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Expected output: {activeStep.output_type}
                </div>
              )}

              {/* AI draft for ai_assist steps */}
              {activeStep.type === "ai_assist" && preview.current_session.ai_draft_output && (
                <div className="rounded-lg border p-4 border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">What LIZA will do</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Based on the context from your document and the previous steps, LIZA generates a contextualised draft for this step. Here's an example:
                  </p>
                  <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none border-t border-border pt-3 mt-2">
                    <ReactMarkdown>{preview.current_session.ai_draft_output}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Gate explanation */}
              {activeStep.type === "gate" && (
                <div className="rounded-lg border p-4 border-amber-500/20 bg-amber-500/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-500">Compliance Check</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This step requires verification before proceeding. The team cannot advance until the gate criteria are met, ensuring compliance with the standards defined in your document.
                  </p>
                  {protocol.compliance_gates.length > 0 && (
                    <ul className="mt-2 text-xs text-muted-foreground space-y-1">
                      {protocol.compliance_gates.map((g, i) => <li key={i}>• {g}</li>)}
                    </ul>
                  )}
                </div>
              )}

              {/* Action explanation */}
              {activeStep.type === "action" && (
                <div className="rounded-lg border p-4 border-border bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-3.5 h-3.5 text-foreground" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Team Action</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your team completes this step manually, following the structured guidance from your playbook. LIZA tracks progress and captures any learnings or exceptions.
                  </p>
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
    </div>
  );
}

function TabExecution({ protocols, preview }: {
  protocols: ProtocolPreview[];
  preview: ExperiencePreview["workbook_preview"];
}) {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolPreview | null>(null);

  if (selectedProtocol) {
    return (
      <div>
        <button onClick={() => setSelectedProtocol(null)}
          className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to playbooks
        </button>
        <ExecutionDrillDown protocol={selectedProtocol} preview={preview} onBack={() => setSelectedProtocol(null)} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">What execution looks like</h2>
        <p className="text-muted-foreground">Click on any playbook to see a live preview of how your team would execute it step-by-step.</p>
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
              <span className="text-[10px] text-muted-foreground">{p.compliance_gates.length} gates</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Act 4: Learning Loop ─────────────────────────────────────────────────────

const LEARNING_COLORS: Record<string, { bg: string; text: string }> = {
  efficiency: { bg: "hsl(200 90% 52% / 0.1)", text: "hsl(200 90% 52%)" },
  quality: { bg: "hsl(155 72% 46% / 0.1)", text: "hsl(155 72% 46%)" },
  compliance: { bg: "hsl(38 92% 50% / 0.1)", text: "hsl(38 92% 50%)" },
  collaboration: { bg: "hsl(271 81% 56% / 0.1)", text: "hsl(271 81% 56%)" },
};

function TabLearn({ learnings }: { learnings: ProjectedLearning[] }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Knowledge that gets smarter</h2>
        <p className="text-muted-foreground">Every execution generates insights. LIZA automatically refines your playbooks based on what your team discovers.</p>
      </div>

      {/* Cycle visualization */}
      <div className="rounded-xl border p-6 mb-8 border-border bg-card">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {["Execute Playbook", "Capture Learnings", "Refine Knowledge", "Improve Next Run"].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg text-xs font-semibold"
                style={{
                  background: "hsl(var(--primary) / 0.08)",
                  color: "hsl(var(--primary))",
                  border: "1px solid hsl(var(--primary) / 0.2)",
                }}>
                {step}
              </div>
              {i < 3 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          ))}
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
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Auto-refinement</p>
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
      <h3 className="text-xl font-bold text-foreground mb-2">Ready to operationalise your expertise?</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
        You've seen the preview. The full LIZA OS turns this into a living system — with AI-assisted playbooks, compliance tracking, and continuous learning.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold brand-gradient-btn"
          style={{ boxShadow: "0 0 20px -4px hsl(var(--primary) / 0.4)" }}>
          Book a Discovery Call <ArrowRight className="w-4 h-4" />
        </a>
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

  // Build available tabs
  const availableTabs: TabKey[] = ["map"];
  if (hasProtocols) availableTabs.push("playbooks", "execution");
  if (hasLearnings) availableTabs.push("learning");

  const [activeTab, setActiveTab] = useState<TabKey>("map");

  return (
    <div className="max-w-4xl mx-auto">
      <TabNav active={activeTab} onChange={setActiveTab} availableTabs={availableTabs} />

      {activeTab === "map" && <TabDocumentMap result={extractionResult} />}
      {activeTab === "playbooks" && (
        <TabPlaybooks protocols={experiencePreview.protocols} coachingQuestions={allQuestions} unmatchedQuestions={unmatchedQuestions} />
      )}
      {activeTab === "execution" && (
        <TabExecution protocols={experiencePreview.protocols} preview={experiencePreview.workbook_preview} />
      )}
      {activeTab === "learning" && <TabLearn learnings={experiencePreview.projected_learnings} />}

      <CTASection onReset={onReset} />
    </div>
  );
}
