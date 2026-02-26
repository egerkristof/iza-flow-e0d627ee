import { useState } from "react";
import {
  Package, FileText, BarChart3, ArrowRight, ChevronDown, ChevronRight,
  Layers, MessageCircleQuestion, Users, BookOpen, Lightbulb, Sparkles,
  Shield, Play, CheckCircle2, Brain, AlertTriangle, Target,
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

// ── Shared small components ──────────────────────────────────────────────────

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
      <div className="flex h-3 rounded-full overflow-hidden bg-muted">
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

function NarrativeBridge({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-5 my-8"
      style={{ borderColor: "hsl(var(--primary) / 0.15)", background: "hsl(var(--primary) / 0.03)" }}>
      <p className="text-sm text-muted-foreground leading-relaxed italic">{children}</p>
    </div>
  );
}

function SectionHeader({ icon: Icon, label, title, subtitle }: { icon: any; label: string; title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border"
        style={{ borderColor: "hsl(var(--primary) / 0.3)", color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.08)" }}>
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-2xl">{subtitle}</p>
    </div>
  );
}

function ActDivider() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-px flex-1 bg-border" />
      <div className="w-2 h-2 rounded-full mx-4" style={{ background: "hsl(var(--primary))" }} />
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

// ── Act 1: Surface (Extraction Results) ──────────────────────────────────────

function ItemRow({ item }: { item: ExtractedContextItem }) {
  const [open, setOpen] = useState(false);
  const colors = CATEGORY_COLORS[item.category] || "";
  return (
    <div className="border rounded-lg border-border">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/50 transition-colors">
        {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${colors}`}>{CATEGORY_LABELS[item.category]}</span>
        <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
        {item.step_order_hint && <span className="ml-auto text-[10px] font-mono text-muted-foreground shrink-0">Step {item.step_order_hint}</span>}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1">
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{item.content}</p>
        </div>
      )}
    </div>
  );
}

function BundleCard({ bundle, readinessExplanation }: { bundle: ExtractedBundle; readinessExplanation?: string }) {
  const [expanded, setExpanded] = useState(false);
  const readiness = computeBundleReadiness(bundle.items, bundle.content_completeness);
  const meta = BUNDLE_READINESS_META[readiness];
  const categoryCounts: Record<string, number> = {};
  for (const item of bundle.items) categoryCounts[item.category] = (categoryCounts[item.category] ?? 0) + 1;

  return (
    <div className="rounded-xl border overflow-hidden border-border bg-card">
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-accent/30 transition-colors">
        <Package className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{bundle.title}</h3>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${meta.color}`}>{meta.icon} {meta.label}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{bundle.description}</p>
        </div>
        <span className="text-xs font-mono text-muted-foreground shrink-0">{bundle.items.length} items</span>
        {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {expanded && (
        <div className="px-5 pb-5 border-t border-border">
          {readinessExplanation && (
            <p className="text-xs text-muted-foreground italic pt-3 pb-2">{readinessExplanation}</p>
          )}
          <div className="pt-3 pb-3"><CategoryBar categories={categoryCounts} /></div>
          {bundle.coverage_gaps && bundle.coverage_gaps.length > 0 && (
            <div className="p-3 rounded-lg border mb-3 border-amber-500/20 bg-amber-500/5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1">Coverage Gaps</p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {bundle.coverage_gaps.map((g, i) => <li key={i}>• {g}</li>)}
              </ul>
            </div>
          )}
          <div className="flex flex-col gap-2">{bundle.items.map((item, i) => <ItemRow key={i} item={item} />)}</div>
        </div>
      )}
    </div>
  );
}

function ActSurface({ result }: { result: ExtractionResult }) {
  const bundles = result.bundles ?? [];
  const standaloneItems = result.context_items ?? [];
  const totalItems = standaloneItems.length + bundles.reduce((sum, b) => sum + b.items.length, 0);
  const allCategories: Record<string, number> = {};
  for (const item of standaloneItems) allCategories[item.category] = (allCategories[item.category] ?? 0) + 1;
  for (const bundle of bundles) for (const item of bundle.items) allCategories[item.category] = (allCategories[item.category] ?? 0) + 1;

  // Separate bundles by readiness
  const protocolReady: ExtractedBundle[] = [];
  const contextOnly: ExtractedBundle[] = [];
  const needsWork: ExtractedBundle[] = [];

  for (const b of bundles) {
    const r = computeBundleReadiness(b.items, b.content_completeness);
    if (r === "protocol-ready") protocolReady.push(b);
    else if (r === "context-only") contextOnly.push(b);
    else needsWork.push(b);
  }

  return (
    <section>
      <SectionHeader icon={Layers} label="Act 1 · Surface" title="Your knowledge, extracted"
        subtitle="LIZA identified and structured every piece of operational intelligence from your document into categorised bundles." />

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Bundles", value: bundles.length, icon: Package },
          { label: "Items Extracted", value: totalItems, icon: FileText },
          { label: "Categories", value: Object.keys(allCategories).length, icon: BarChart3 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border p-5 text-center border-border bg-card">
            <Icon className="w-5 h-5 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-semibold text-foreground mb-3">Category Distribution</h3>
        <CategoryBar categories={allCategories} />
      </div>

      {result.analysis_notes && (
        <div className="rounded-xl border p-5 mb-8" style={{ borderColor: "hsl(var(--primary) / 0.2)", background: "hsl(var(--primary) / 0.05)" }}>
          <h3 className="text-sm font-semibold text-foreground mb-2">AI Analysis</h3>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{result.analysis_notes}</p>
        </div>
      )}

      {/* Readiness explanation */}
      <div className="rounded-xl border p-5 mb-8 border-border bg-card">
        <h3 className="text-sm font-semibold text-foreground mb-3">What do these readiness levels mean?</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {([
            { key: "protocol-ready" as BundleReadiness, icon: CheckCircle2, count: protocolReady.length,
              desc: "Contains a playbook with execution steps. Your team can start executing these immediately as structured protocols." },
            { key: "needs-steps" as BundleReadiness, icon: AlertTriangle, count: needsWork.length,
              desc: "Has a playbook but lacks detailed steps. LIZA would coach the missing procedural knowledge out of your team." },
            { key: "context-only" as BundleReadiness, icon: BookOpen, count: contextOnly.length,
              desc: "Valuable reference knowledge (facts, principles, research) that enriches protocols but isn't executable on its own." },
          ]).map(({ key, icon: Icon, count, desc }) => {
            const m = BUNDLE_READINESS_META[key];
            return (
              <div key={key} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: key === "protocol-ready" ? "hsl(155 72% 46%)" : key === "needs-steps" ? "hsl(38 92% 50%)" : "hsl(217 91% 60%)" }} />
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${m.color}`}>{m.icon} {m.label}</span>
                  <span className="text-xs font-mono text-muted-foreground ml-auto">{count}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Protocol-ready bundles first */}
      {protocolReady.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" style={{ color: "hsl(155 72% 46%)" }} />
            <h3 className="text-sm font-semibold text-foreground">Protocol-Ready ({protocolReady.length})</h3>
          </div>
          <p className="text-xs text-muted-foreground -mt-1 ml-6">These bundles have complete playbooks with execution steps — they can be deployed as team protocols immediately.</p>
          {protocolReady.map((bundle, i) => <BundleCard key={`pr-${i}`} bundle={bundle}
            readinessExplanation="This bundle contains a playbook driver and procedural steps — it's ready to become an executable protocol for your team." />)}
        </div>
      )}

      {/* Needs-steps bundles */}
      {needsWork.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" style={{ color: "hsl(38 92% 50%)" }} />
            <h3 className="text-sm font-semibold text-foreground">Needs Coaching ({needsWork.length})</h3>
          </div>
          <p className="text-xs text-muted-foreground -mt-1 ml-6">These have a playbook but lack detailed steps — LIZA would ask targeted questions to extract the missing procedural knowledge from your experts.</p>
          {needsWork.map((bundle, i) => <BundleCard key={`ns-${i}`} bundle={bundle}
            readinessExplanation="This bundle has a playbook but needs detailed execution steps. LIZA's coaching engine would extract the missing procedures from your team's tacit knowledge." />)}
        </div>
      )}

      {/* Context-only bundles */}
      {contextOnly.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: "hsl(217 91% 60%)" }} />
            <h3 className="text-sm font-semibold text-foreground">Context Knowledge ({contextOnly.length})</h3>
          </div>
          <p className="text-xs text-muted-foreground -mt-1 ml-6">Reference material — facts, principles, and research that LIZA injects into protocols as context when your team executes.</p>
          {contextOnly.map((bundle, i) => <BundleCard key={`co-${i}`} bundle={bundle}
            readinessExplanation="This is reference knowledge that LIZA automatically injects into relevant protocol steps as context for your team and AI agents." />)}
        </div>
      )}
    </section>
  );
}

// ── Act 2: Structure (Protocols) ─────────────────────────────────────────────

function ProtocolCard({ protocol }: { protocol: ProtocolPreview }) {
  const [expanded, setExpanded] = useState(false);
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
          <p className="text-xs text-muted-foreground mb-4 italic">
            Source: {protocol.source_playbook} {protocol.estimated_duration ? `· Est. ${protocol.estimated_duration}` : ""}
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
            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1">Compliance Gates</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {protocol.compliance_gates.map((g, i) => <li key={i}>• {g}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ActStructure({ protocols }: { protocols: ProtocolPreview[] }) {
  if (protocols.length === 0) return null;
  return (
    <section>
      <SectionHeader icon={BookOpen} label="Act 2 · Structure" title="Protocols generated"
        subtitle="Each protocol-ready playbook becomes an executable workflow — ordered steps your team follows with AI assistance at each stage and compliance gates that enforce your directives." />
      <div className="rounded-xl border p-5 mb-6 border-border bg-card">
        <div className="flex items-start gap-3">
          <Target className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">How protocols work in LIZA</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When your team executes a protocol, LIZA provides AI-generated drafts at each step, automatically injects relevant context (directives, knowledge, preferences), and enforces compliance gates before allowing the team to proceed. Every execution is tracked for quality and learning.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {protocols.map((p, i) => <ProtocolCard key={i} protocol={p} />)}
      </div>
    </section>
  );
}

// ── Act 3: Refine (Coaching Questions) ───────────────────────────────────────

function ActRefine({ questions }: { questions: CoachingQuestion[] }) {
  if (questions.length === 0) return null;
  return (
    <section>
      <SectionHeader icon={MessageCircleQuestion} label="Act 3 · Refine" title="Coaching questions"
        subtitle="These are the questions LIZA would ask your team to close knowledge gaps — turning the 'needs coaching' bundles into protocol-ready ones and deepening existing protocols." />
      <div className="grid gap-4">
        {questions.map((q, i) => (
          <div key={i} className="rounded-xl border p-5 border-border bg-card">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0"
                style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">{q.question}</p>
                <p className="text-xs text-muted-foreground mb-2">{q.context}</p>
                <div className="flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-mono text-muted-foreground">Targets: {q.targets}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Act 4: Deploy (Protocol Execution Walkthrough) ───────────────────────────

function ActDeploy({ preview, protocols }: { preview: ExperiencePreview["workbook_preview"]; protocols: ProtocolPreview[] }) {
  // Pick the first protocol with steps to show a walkthrough
  const demoProtocol = protocols.find(p => p.steps.length >= 3) || protocols[0];
  const demoStep = demoProtocol?.steps.find(s => s.type === "ai_assist") || demoProtocol?.steps[1] || demoProtocol?.steps[0];
  const demoStepIndex = demoStep ? demoProtocol.steps.indexOf(demoStep) : 0;

  return (
    <section>
      <SectionHeader icon={Users} label="Act 4 · Deploy" title="Your team's workbook"
        subtitle="When protocols are deployed, your team works inside a structured workbook. Here's what execution looks like — step by step, with AI assistance at every stage." />

      <div className="rounded-xl border overflow-hidden border-border bg-card">
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

        {/* Deployed protocols list */}
        <div className="px-6 py-3 border-b border-border bg-muted/30">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Deployed Protocols</p>
          <div className="flex flex-wrap gap-2">
            {preview.active_protocols.map((p, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-primary/5">{p}</span>
            ))}
          </div>
        </div>

        {/* Protocol execution walkthrough */}
        {demoProtocol && demoStep && (
          <div className="px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Protocol Execution Walkthrough</span>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              When {preview.team_members[0]?.name || "a team member"} executes "{demoProtocol.title}", here's what happens at each step:
            </p>

            {/* Show steps with the current one highlighted */}
            <div className="flex flex-col gap-1.5 mb-5">
              {demoProtocol.steps.map((step, i) => {
                const isCurrent = i === demoStepIndex;
                const isPast = i < demoStepIndex;
                return (
                  <div key={step.order} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isCurrent ? "bg-primary/10 border border-primary/20" : isPast ? "opacity-60" : "opacity-40"
                  }`}>
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                      isPast ? "bg-emerald-500/20 text-emerald-400" : isCurrent ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {isPast ? <CheckCircle2 className="w-3 h-3" /> : step.order}
                    </span>
                    <span className={`text-xs ${isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{step.title}</span>
                    {step.type === "gate" && <Shield className="w-3 h-3 ml-auto" style={{ color: "hsl(38 92% 50%)" }} />}
                    {step.type === "ai_assist" && <Sparkles className="w-3 h-3 ml-auto text-primary" />}
                    {isCurrent && <span className="text-[9px] font-mono text-primary ml-auto">Current Step</span>}
                  </div>
                );
              })}
            </div>

            {/* AI draft for the current step */}
            {preview.current_session.ai_draft_output && (
              <div className="rounded-lg border p-4 border-border bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">AI Draft for This Step</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-2 italic">
                  LIZA generates this draft using your directives, knowledge, and preferences as context — then your team reviews, edits, and approves.
                </p>
                <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none border-t border-border pt-3 mt-2">
                  <ReactMarkdown>{preview.current_session.ai_draft_output}</ReactMarkdown>
                </div>
              </div>
            )}

            {preview.current_session.compliance_score != null && (
              <div className="flex items-center gap-2 mt-3">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs text-muted-foreground">Compliance Score: <strong className="text-foreground">{Math.round(preview.current_session.compliance_score * 100)}%</strong></span>
                <span className="text-[10px] text-muted-foreground italic ml-1">— measures adherence to your directives</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Act 5: Learn (Projected Learnings) ───────────────────────────────────────

const LEARNING_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  efficiency: { bg: "hsl(200 90% 52% / 0.1)", text: "hsl(200 90% 52%)", label: "How your team gets faster" },
  quality: { bg: "hsl(155 72% 46% / 0.1)", text: "hsl(155 72% 46%)", label: "How output quality improves" },
  compliance: { bg: "hsl(38 92% 50% / 0.1)", text: "hsl(38 92% 50%)", label: "How adherence strengthens" },
  collaboration: { bg: "hsl(271 81% 56% / 0.1)", text: "hsl(271 81% 56%)", label: "How teamwork evolves" },
};

function ActLearn({ learnings }: { learnings: ProjectedLearning[] }) {
  if (learnings.length === 0) return null;
  return (
    <section>
      <SectionHeader icon={Lightbulb} label="Act 5 · Learn" title="Projected learnings"
        subtitle="After your team executes these protocols 3-5 times, LIZA captures operational insights and automatically refines your knowledge base. Here's what that looks like." />
      <div className="rounded-xl border p-5 mb-6 border-border bg-card">
        <div className="flex items-start gap-3">
          <Brain className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">The learning loop</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every protocol execution generates data: what worked, what didn't, where teams deviated, and what they discovered. LIZA synthesises these into actionable refinements — updating procedures, tightening directives, and surfacing new knowledge automatically.
            </p>
          </div>
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

// ── CTA Section ──────────────────────────────────────────────────────────────

function CTASection({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-2xl border p-8 text-center"
      style={{ borderColor: "hsl(var(--primary) / 0.3)", background: "hsl(var(--primary) / 0.05)" }}>
      <h3 className="text-xl font-bold text-foreground mb-2">Ready to operationalise your knowledge?</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
        You've just seen a preview. The full LIZA OS turns this into a living system your team executes on daily — with AI-assisted protocols, compliance tracking, and continuous learning.
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
  const hasQuestions = experiencePreview.coaching_questions.length > 0;
  const hasLearnings = experiencePreview.projected_learnings.length > 0;

  return (
    <div className="max-w-4xl mx-auto">
      <ActSurface result={extractionResult} />

      {hasProtocols && (
        <>
          <NarrativeBridge>
            Now that LIZA has identified what your organisation knows, the next step is turning that knowledge into something your team can actually execute.
            The protocol-ready bundles above become structured workflows — here's what they look like as executable protocols.
          </NarrativeBridge>
          <ActStructure protocols={experiencePreview.protocols} />
        </>
      )}

      {hasQuestions && (
        <>
          <NarrativeBridge>
            Not everything in a document captures the full picture. The bundles that need coaching contain strategic intent but lack the detailed "how."
            LIZA's coaching engine surfaces the right questions to extract that tacit knowledge from your experts.
          </NarrativeBridge>
          <ActRefine questions={experiencePreview.coaching_questions} />
        </>
      )}

      {hasProtocols && (
        <>
          <NarrativeBridge>
            With protocols defined and knowledge gaps identified, your team is ready to operate.
            Here's what it looks like when these protocols are deployed into a live team workbook.
          </NarrativeBridge>
          <ActDeploy preview={experiencePreview.workbook_preview} protocols={experiencePreview.protocols} />
        </>
      )}

      {hasLearnings && (
        <>
          <NarrativeBridge>
            Execution generates data. Every time your team runs a protocol, LIZA captures what happened — deviations, discoveries, and improvements.
            Over time, your knowledge base becomes smarter. Here's what those learnings look like.
          </NarrativeBridge>
          <ActLearn learnings={experiencePreview.projected_learnings} />
        </>
      )}

      <ActDivider />
      <CTASection onReset={onReset} />
    </div>
  );
}
