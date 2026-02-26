import { useState } from "react";
import {
  Package, FileText, BarChart3, ArrowRight, ChevronDown, ChevronRight,
  Layers, MessageCircleQuestion, Users, BookOpen, Lightbulb, Sparkles,
  Shield, Play, CheckCircle2, Brain,
} from "lucide-react";
import {
  CATEGORY_COLORS, CATEGORY_LABELS, BUNDLE_READINESS_META,
  computeBundleReadiness, type ExtractedBundle, type ExtractedContextItem,
  type ExtractionResult, type ContextCategory,
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

function BundleCard({ bundle }: { bundle: ExtractedBundle }) {
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
          <div className="pt-4 pb-3"><CategoryBar categories={categoryCounts} /></div>
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

  return (
    <section>
      <SectionHeader icon={Layers} label="Act 1 · Surface" title="Your knowledge, extracted" subtitle="LIZA identified and structured every piece of operational intelligence from your document." />
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
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-foreground">Extracted Bundles ({bundles.length})</h3>
        {bundles.map((bundle, i) => <BundleCard key={i} bundle={bundle} />)}
      </div>
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
                  <p className="text-sm font-medium text-foreground">{step.title}</p>
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
  return (
    <section>
      <SectionHeader icon={BookOpen} label="Act 2 · Structure" title="Protocols generated"
        subtitle="Each playbook becomes an executable protocol — ordered steps your team follows with AI assistance and compliance gates." />
      <div className="flex flex-col gap-3">
        {protocols.map((p, i) => <ProtocolCard key={i} protocol={p} />)}
      </div>
    </section>
  );
}

// ── Act 3: Refine (Coaching Questions) ───────────────────────────────────────

function ActRefine({ questions }: { questions: CoachingQuestion[] }) {
  return (
    <section>
      <SectionHeader icon={MessageCircleQuestion} label="Act 3 · Refine" title="Coaching questions"
        subtitle="LIZA would ask these questions to deepen your knowledge and close gaps — turning implicit expertise into explicit, reusable intelligence." />
      <div className="grid gap-4">
        {questions.map((q, i) => (
          <div key={i} className="rounded-xl border p-5 border-border bg-card">
            <div className="flex items-start gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0"
                style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}>{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">{q.question}</p>
                <p className="text-xs text-muted-foreground mb-2">{q.context}</p>
                <span className="text-[10px] font-mono text-muted-foreground">Targets: {q.targets}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Act 4: Deploy (Workbook Preview) ─────────────────────────────────────────

function ActDeploy({ preview }: { preview: ExperiencePreview["workbook_preview"] }) {
  const session = preview.current_session;
  return (
    <section>
      <SectionHeader icon={Users} label="Act 4 · Deploy" title="Your team's workbook"
        subtitle="Here's what it looks like when your team operates on this knowledge — a live workbook with protocols, team members, and AI-assisted execution." />
      <div className="rounded-xl border overflow-hidden border-border bg-card">
        {/* Workbook header */}
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-lg">{preview.title}</h3>
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

        {/* Active protocols */}
        <div className="px-6 py-3 border-b border-border bg-muted/30">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Active Protocols</p>
          <div className="flex flex-wrap gap-2">
            {preview.active_protocols.map((p, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full border border-primary/30 text-primary bg-primary/5">{p}</span>
            ))}
          </div>
        </div>

        {/* Current session */}
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-foreground">Live Session — {session.executor_name}</span>
            <span className="text-[10px] text-muted-foreground">executing "{session.protocol_title}"</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(session.step_number / session.total_steps) * 100}%`, background: "var(--gradient-brand)" }} />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">Step {session.step_number}/{session.total_steps}</span>
          </div>
          <div className="rounded-lg border p-4 border-border bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">AI Draft Output</span>
              <span className="text-[10px] text-muted-foreground">— {session.current_step}</span>
            </div>
            <div className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none">
              <ReactMarkdown>{session.ai_draft_output}</ReactMarkdown>
            </div>
          </div>
          {session.compliance_score != null && (
            <div className="flex items-center gap-2 mt-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Compliance Score: <strong className="text-foreground">{Math.round(session.compliance_score * 100)}%</strong></span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Act 5: Learn (Projected Learnings) ───────────────────────────────────────

const LEARNING_COLORS: Record<string, { bg: string; text: string }> = {
  efficiency: { bg: "hsl(200 90% 52% / 0.1)", text: "hsl(200 90% 52%)" },
  quality: { bg: "hsl(155 72% 46% / 0.1)", text: "hsl(155 72% 46%)" },
  compliance: { bg: "hsl(38 92% 50% / 0.1)", text: "hsl(38 92% 50%)" },
  collaboration: { bg: "hsl(271 81% 56% / 0.1)", text: "hsl(271 81% 56%)" },
};

function ActLearn({ learnings }: { learnings: ProjectedLearning[] }) {
  return (
    <section>
      <SectionHeader icon={Lightbulb} label="Act 5 · Learn" title="Projected learnings"
        subtitle="After your team executes these protocols 3-5 times, LIZA would capture insights like these — automatically refining your knowledge base." />
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
                <p className="text-[11px] text-foreground">{l.refinement_action}</p>
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
          Try Again
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
  return (
    <div className="max-w-4xl mx-auto">
      <ActSurface result={extractionResult} />
      <ActDivider />
      <ActStructure protocols={experiencePreview.protocols} />
      <ActDivider />
      <ActRefine questions={experiencePreview.coaching_questions} />
      <ActDivider />
      <ActDeploy preview={experiencePreview.workbook_preview} />
      <ActDivider />
      <ActLearn learnings={experiencePreview.projected_learnings} />
      <ActDivider />
      <CTASection onReset={onReset} />
    </div>
  );
}
