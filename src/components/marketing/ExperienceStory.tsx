import { useState, useEffect, useRef, useCallback } from "react";
import {
  Package, FileText, BarChart3, ArrowRight, ChevronDown, ChevronRight,
  Layers, Users, BookOpen, Lightbulb, Sparkles,
  Shield, Play, CheckCircle2, Brain, AlertTriangle, Target,
  MessageCircleQuestion, RefreshCw,
} from "lucide-react";
import {
  CATEGORY_COLORS, CATEGORY_LABELS, BUNDLE_READINESS_META,
  computeBundleReadiness, type ExtractedBundle, type ExtractedContextItem,
  type ExtractionResult, type ContextCategory, type BundleReadiness,
} from "@/lib/knowledge-schema";
import type {
  ExperiencePreview, ProtocolPreview, CoachingQuestion,
  ProjectedLearning,
} from "@/lib/experience-schema";
import ReactMarkdown from "react-markdown";

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

// ── Animation Hooks ──────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current || started.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ── Shared Components ────────────────────────────────────────────────────────

const CATEGORY_BAR_COLORS: Record<string, string> = {
  PLAYBOOK: "hsl(25 95% 53%)", PROCEDURE: "hsl(185 85% 45%)",
  DIRECTIVE: "hsl(38 92% 50%)", KNOWLEDGE: "hsl(217 91% 60%)",
  PRINCIPLE: "hsl(271 81% 56%)", RESEARCH: "hsl(155 72% 46%)",
  PREFERENCE: "hsl(330 81% 60%)",
};

function CategoryBar({ categories }: { categories: Record<string, number> }) {
  const total = Object.values(categories).reduce((s, n) => s + n, 0);
  if (total === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-2.5 rounded-full overflow-hidden bg-muted">
        {Object.entries(categories).filter(([, n]) => n > 0).map(([cat, n]) => (
          <div key={cat} style={{ width: `${(n / total) * 100}%`, background: CATEGORY_BAR_COLORS[cat] || "hsl(var(--muted-foreground))" }}
            title={`${CATEGORY_LABELS[cat as ContextCategory] || cat}: ${n}`} />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {Object.entries(categories).filter(([, n]) => n > 0).map(([cat, n]) => (
          <span key={cat} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full" style={{ background: CATEGORY_BAR_COLORS[cat] }} />
            {CATEGORY_LABELS[cat as ContextCategory] || cat} ({n})
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, step, title, subtitle }: { icon: any; step: string; title: string; subtitle: string }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`mb-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border"
        style={{ borderColor: "hsl(var(--primary) / 0.3)", color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.08)" }}>
        <Icon className="w-3.5 h-3.5" /> {step}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-2xl">{subtitle}</p>
    </div>
  );
}

function ActDivider() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-px flex-1 bg-border" />
      <div className="w-2 h-2 rounded-full mx-4" style={{ background: "hsl(var(--primary))" }} />
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function StatCard({ icon: Icon, label, target }: { icon: any; label: string; target: number }) {
  const { value, ref } = useCountUp(target);
  return (
    <div ref={ref} className="rounded-xl border p-5 text-center border-border bg-card">
      <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
      <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

// ── Progress Nav ─────────────────────────────────────────────────────────────

const ACT_LABELS = ["Document Map", "Playbooks", "Workbook", "Learning"];

function ProgressNav({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="sticky top-4 z-30 flex justify-center mb-10">
      <div className="inline-flex items-center gap-1 px-3 py-2 rounded-full border bg-card/80 backdrop-blur-md border-border shadow-lg">
        {ACT_LABELS.map((label, i) => (
          <a key={label} href={`#act-${i}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              i === activeIndex
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Act 1: Document Map ──────────────────────────────────────────────────────

function ActDocumentMap({ result }: { result: ExtractionResult }) {
  const bundles = result.bundles ?? [];
  const standaloneItems = result.context_items ?? [];
  const totalItems = standaloneItems.length + bundles.reduce((sum, b) => sum + b.items.length, 0);
  const allCategories: Record<string, number> = {};
  for (const item of standaloneItems) allCategories[item.category] = (allCategories[item.category] ?? 0) + 1;
  for (const bundle of bundles) for (const item of bundle.items) allCategories[item.category] = (allCategories[item.category] ?? 0) + 1;

  const protocolReady = bundles.filter(b => computeBundleReadiness(b.items, b.content_completeness) === "protocol-ready").length;
  const needsSteps = bundles.filter(b => computeBundleReadiness(b.items, b.content_completeness) === "needs-steps").length;
  const contextOnly = bundles.filter(b => computeBundleReadiness(b.items, b.content_completeness) === "context-only").length;

  return (
    <section id="act-0">
      <SectionHeader icon={Layers} step="1 · Document Map" title="Your document, decoded"
        subtitle="LIZA scanned your document and identified every piece of operational knowledge — structured into categories and readiness levels." />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Bundles" target={bundles.length} />
        <StatCard icon={FileText} label="Items Extracted" target={totalItems} />
        <StatCard icon={BarChart3} label="Categories" target={Object.keys(allCategories).length} />
        <StatCard icon={CheckCircle2} label="Protocol-Ready" target={protocolReady} />
      </div>

      <div className="mb-8">
        <CategoryBar categories={allCategories} />
      </div>

      {result.analysis_notes && (
        <div className="rounded-xl border p-5 mb-8" style={{ borderColor: "hsl(var(--primary) / 0.2)", background: "hsl(var(--primary) / 0.05)" }}>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.analysis_notes}</p>
        </div>
      )}

      {/* Readiness summary — compact inline */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Protocol-Ready", count: protocolReady, color: "hsl(155 72% 46%)", icon: CheckCircle2, desc: "Complete playbooks with steps" },
          { label: "Needs Coaching", count: needsSteps, color: "hsl(38 92% 50%)", icon: AlertTriangle, desc: "Playbooks missing procedures" },
          { label: "Context", count: contextOnly, color: "hsl(217 91% 60%)", icon: BookOpen, desc: "Reference knowledge" },
        ].map(({ label, count, color, icon: Icon, desc }) => (
          <div key={label} className="rounded-lg border p-3 border-border bg-card">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-xs font-semibold text-foreground">{label}</span>
              <span className="text-xs font-mono text-muted-foreground ml-auto">{count}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>

      {/* Bundle list — collapsed */}
      <div className="flex flex-col gap-2">
        {bundles.map((bundle, i) => {
          const readiness = computeBundleReadiness(bundle.items, bundle.content_completeness);
          const meta = BUNDLE_READINESS_META[readiness];
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors">
              <Package className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm font-medium text-foreground truncate flex-1">{bundle.title}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${meta.color}`}>{meta.icon} {meta.label}</span>
              <span className="text-[10px] font-mono text-muted-foreground">{bundle.items.length}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── Act 2: Executable Playbooks ──────────────────────────────────────────────

function PlaybookCard({ protocol, coachingQuestions }: { protocol: ProtocolPreview; coachingQuestions: CoachingQuestion[] }) {
  const [expanded, setExpanded] = useState(false);
  // Find coaching questions that target this protocol
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

          {/* Steps */}
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

          {/* Compliance gates */}
          {protocol.compliance_gates.length > 0 && (
            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 mb-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1">Compliance Gates</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {protocol.compliance_gates.map((g, i) => <li key={i}>• {g}</li>)}
              </ul>
            </div>
          )}

          {/* Inline coaching questions for this playbook */}
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

function ActPlaybooks({ protocols, coachingQuestions, unmatchedQuestions }: {
  protocols: ProtocolPreview[];
  coachingQuestions: CoachingQuestion[];
  unmatchedQuestions: CoachingQuestion[];
}) {
  if (protocols.length === 0) return null;
  return (
    <section id="act-1">
      <SectionHeader icon={BookOpen} step="2 · Executable Playbooks" title="Protocols your team can run"
        subtitle="Each playbook becomes a structured workflow with AI assistance and compliance gates. Knowledge gaps are flagged inline." />
      <div className="flex flex-col gap-3">
        {protocols.map((p, i) => <PlaybookCard key={i} protocol={p} coachingQuestions={coachingQuestions} />)}
      </div>

      {/* Unmatched coaching questions */}
      {unmatchedQuestions.length > 0 && (
        <div className="mt-6 rounded-xl border p-5 border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircleQuestion className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Additional Knowledge Gaps</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            These questions would help LIZA build additional protocols from your expertise.
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
    </section>
  );
}

// ── Act 3: Workbook Preview ──────────────────────────────────────────────────

function ActWorkbook({ preview, protocols }: { preview: ExperiencePreview["workbook_preview"]; protocols: ProtocolPreview[] }) {
  const demoProtocol = protocols.find(p => p.steps.length >= 3) || protocols[0];
  const demoStep = demoProtocol?.steps.find(s => s.type === "ai_assist") || demoProtocol?.steps[1] || demoProtocol?.steps[0];
  const demoStepIndex = demoStep ? demoProtocol.steps.indexOf(demoStep) : 0;
  const [activeStepIndex, setActiveStepIndex] = useState(demoStepIndex);
  const { ref, visible } = useReveal();

  // Pulse effect on active step
  useEffect(() => {
    if (!visible || !demoProtocol) return;
    // Auto-advance through steps for a "live" feel
    const timer = setInterval(() => {
      setActiveStepIndex(prev => {
        const next = prev + 1;
        return next >= demoProtocol.steps.length ? 0 : next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [visible, demoProtocol]);

  if (!demoProtocol) return null;

  return (
    <section id="act-2" ref={ref}>
      <SectionHeader icon={Users} step="3 · Workbook" title="What execution looks like"
        subtitle="Protocols are deployed into team workbooks. Here's a live preview of your team running one." />

      <div className={`rounded-xl border overflow-hidden border-border bg-card transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        {/* Workbook header */}
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-lg">{preview.title || "Team Workbook"}</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex -space-x-2">
              {preview.team_members.map((m, i) => (
                <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-card"
                  style={{ background: `hsl(${200 + i * 40} 70% 50% / 0.2)`, color: `hsl(${200 + i * 40} 70% 50%)` }}>
                  {m.name.split(" ").map(w => w[0]).join("")}
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{preview.team_members.map(m => `${m.name} (${m.role})`).join(" · ")}</span>
          </div>
        </div>

        {/* Active protocols pills */}
        <div className="px-6 py-3 border-b border-border bg-muted/30">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Deployed Protocols</p>
          <div className="flex flex-wrap gap-2">
            {preview.active_protocols.map((p, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-primary/5">{p}</span>
            ))}
          </div>
        </div>

        {/* Step-by-step execution */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Executing: {demoProtocol.title}</span>
          </div>

          <div className="flex flex-col gap-1.5 mb-5">
            {demoProtocol.steps.map((step, i) => {
              const isCurrent = i === activeStepIndex;
              const isPast = i < activeStepIndex;
              return (
                <div key={step.order} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-500 ${
                  isCurrent ? "bg-primary/10 border border-primary/20" : isPast ? "opacity-60" : "opacity-40"
                }`}>
                  <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold transition-all duration-500 ${
                    isPast ? "bg-emerald-500/20 text-emerald-400" : isCurrent ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    {isPast ? <CheckCircle2 className="w-3 h-3" /> : step.order}
                  </span>
                  <span className={`text-xs ${isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{step.title}</span>
                  {step.type === "gate" && <Shield className="w-3 h-3 ml-auto" style={{ color: "hsl(38 92% 50%)" }} />}
                  {step.type === "ai_assist" && <Sparkles className="w-3 h-3 ml-auto text-primary" />}
                  {isCurrent && (
                    <span className="text-[9px] font-mono text-primary ml-auto flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI draft output */}
          {preview.current_session.ai_draft_output && (
            <div className="rounded-lg border p-4 border-border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">AI-Generated Draft</span>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none border-t border-border pt-3 mt-2">
                <ReactMarkdown>{preview.current_session.ai_draft_output}</ReactMarkdown>
              </div>
            </div>
          )}

          {preview.current_session.compliance_score != null && (
            <div className="flex items-center gap-2 mt-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Compliance: <strong className="text-foreground">{Math.round(preview.current_session.compliance_score * 100)}%</strong></span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Act 4: Learning Loop ─────────────────────────────────────────────────────

const LEARNING_COLORS: Record<string, { bg: string; text: string }> = {
  efficiency: { bg: "hsl(200 90% 52% / 0.1)", text: "hsl(200 90% 52%)" },
  quality: { bg: "hsl(155 72% 46% / 0.1)", text: "hsl(155 72% 46%)" },
  compliance: { bg: "hsl(38 92% 50% / 0.1)", text: "hsl(38 92% 50%)" },
  collaboration: { bg: "hsl(271 81% 56% / 0.1)", text: "hsl(271 81% 56%)" },
};

function ActLearn({ learnings }: { learnings: ProjectedLearning[] }) {
  if (learnings.length === 0) return null;
  const { ref, visible } = useReveal();

  return (
    <section id="act-3" ref={ref}>
      <SectionHeader icon={RefreshCw} step="4 · Learning Loop" title="Knowledge that gets smarter"
        subtitle="Every execution generates insights. LIZA automatically refines your playbooks based on what your team discovers." />

      {/* Cycle visualization */}
      <div className={`rounded-xl border p-6 mb-8 border-border bg-card transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {["Execute Protocol", "Capture Learnings", "Refine Knowledge", "Improve Next Run"].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
                style={{
                  transitionDelay: `${i * 200}ms`,
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
    </section>
  );
}

// ── CTA ──────────────────────────────────────────────────────────────────────

function CTASection({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border p-8 text-center"
      style={{ borderColor: "hsl(var(--primary) / 0.3)", background: "hsl(var(--primary) / 0.05)" }}>
      <h3 className="text-xl font-bold text-foreground mb-2">Ready to operationalise your expertise?</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
        You've seen the preview. The full LIZA OS turns this into a living system — with AI-assisted protocols, compliance tracking, and continuous learning.
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

  // Split coaching questions: matched vs unmatched to protocols
  const allQuestions = experiencePreview.coaching_questions;
  const protocolTitles = experiencePreview.protocols.map(p => p.title.toLowerCase());
  const protocolSources = experiencePreview.protocols.map(p => p.source_playbook.toLowerCase());

  const unmatchedQuestions = allQuestions.filter(q => {
    const t = q.targets.toLowerCase();
    return !protocolTitles.some(pt => t.includes(pt)) && !protocolSources.some(ps => t.includes(ps));
  });

  // Determine which act is visible (simplified: use scroll-based)
  const [activeAct, setActiveAct] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      for (let i = 3; i >= 0; i--) {
        const el = document.getElementById(`act-${i}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.5) {
            setActiveAct(i);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressNav activeIndex={activeAct} />

      <ActDocumentMap result={extractionResult} />

      {hasProtocols && (
        <>
          <ActDivider />
          <ActPlaybooks protocols={experiencePreview.protocols} coachingQuestions={allQuestions} unmatchedQuestions={unmatchedQuestions} />
        </>
      )}

      {hasProtocols && (
        <>
          <ActDivider />
          <ActWorkbook preview={experiencePreview.workbook_preview} protocols={experiencePreview.protocols} />
        </>
      )}

      {hasLearnings && (
        <>
          <ActDivider />
          <ActLearn learnings={experiencePreview.projected_learnings} />
        </>
      )}

      <ActDivider />
      <CTASection onReset={onReset} />
    </div>
  );
}
