import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import {
  ArrowRight, ClipboardCheck, MessageSquare, TrendingUp, GitBranch,
  X, ArrowDownRight, Shield, Clock, Zap,
} from "lucide-react";

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

function GradientText({ children }: { children: React.ReactNode }) {
  return <span className="brand-gradient-text">{children}</span>;
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-6"
      style={{ color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.25)", background: "hsl(var(--primary) / 0.06)" }}
    >
      {children}
    </p>
  );
}

// ── Connector between use cases ───────────────────────────────────────────────

function FlowConnector({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.6))" }} />
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold"
        style={{
          color: "hsl(var(--primary))",
          borderColor: "hsl(var(--primary) / 0.3)",
          background: "hsl(var(--primary) / 0.06)",
        }}
      >
        <ArrowDownRight className="w-3.5 h-3.5" />
        {text}
      </div>
      <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.6), hsl(var(--primary) / 0.3))" }} />
    </div>
  );
}

// ── Use case data ─────────────────────────────────────────────────────────────

const USE_CASES = [
  {
    icon: <TrendingUp className="w-7 h-7" />,
    tag: "01 · The Sales Protocol Engine",
    col: "38 92% 50%",
    headline: "Onboard sales reps in 8 weeks, not 6–9 months.",
    subheading: "Scale your senior seller's judgment across your entire go-to-market team.",
    competitors: ["Gong", "Chorus", "Highspot", "Seismic", "Salesforce Playbooks"],
    competitorNote: "They capture what happened. They don't transfer the judgment that wins deals.",
    body: [
      "Complex B2B sales are expertise-driven. Your best sellers pattern-match, read signals, and apply judgment that takes years to develop. That's tacit knowledge — and it typically takes 6–9 months before a new hire delivers meaningful pipeline.",
      "LIZA encodes that judgment into executable protocols. Every team member runs on that intelligence from week one. The insights feed back into your knowledge base, sharpening everything from positioning to hiring.",
    ],
    carries: "Sales patterns reveal what your market actually values. That insight shapes your playbooks, your onboarding, and eventually your product.",
    stats: [
      { value: "8 wks", label: "To full productivity (vs 6–9 months)" },
      { value: "Senior", label: "Skill level from day one" },
      { value: "100%", label: "Team consistency, every deal" },
    ],
  },
  {
    icon: <ClipboardCheck className="w-7 h-7" />,
    tag: "02 · Audit Automation",
    col: "200 90% 52%",
    headline: "Make audits 23× faster.",
    subheading: "If we can handle compliance audits, we can handle your marketing briefs.",
    competitors: ["Workiva", "AuditBoard", "TeamMate+", "Excel"],
    competitorNote: "They manage the audit process. They can't encode the expertise driving it.",
    body: [
      "Auditing is expertise-dense and detail-critical. Current tools manage the process but don't capture the knowledge behind it.",
      "LIZA encodes every criterion, compliance gate, and domain heuristic into executable protocols. Audits run 23× faster with 72% higher accuracy — and every execution feeds new findings back into your knowledge base.",
    ],
    carries: "Audits surface issues. Those issues become tasks, structured, contextualised, and delegated with full intent.",
    stats: [
      { value: "23×", label: "Faster audit execution" },
      { value: "72%", label: "Accuracy improvement" },
      { value: "80%", label: "Groundwork eliminated" },
    ],
  },
  {
    icon: <MessageSquare className="w-7 h-7" />,
    tag: "03 · The Decision Extractor",
    col: "155 72% 46%",
    headline: "Extract decisions. Route them where they matter.",
    subheading: "Your meetings are already building your knowledge base. You just can't see it yet.",
    competitors: ["Otter.ai", "Fireflies", "Fathom", "Notion AI", "Grain"],
    competitorNote: "They give you transcripts and summaries. They don't understand what it means or route it anywhere actionable.",
    body: [
      "Every week, dozens of meetings packed with decisions, rationale, and strategic signal — and most of it evaporates. Transcript tools give you a wall of text. Summaries give you three bullets. Neither builds anything.",
      "LIZA extracts structured intelligence: what was decided and why, what principles emerged, what needs encoding. Start with last Monday's meetings — within a week, you have the foundations of your knowledge base.",
    ],
    carries: "Meetings surface tacit knowledge. That knowledge gets encoded. Encoded knowledge powers your sales team, your auditors, your delegated work.",
    stats: [
      { value: "Week 1", label: "Knowledge base starts immediately" },
      { value: "0", label: "Hours lost reading summaries" },
      { value: "100%", label: "Decisions captured with context" },
    ],
  },
  {
    icon: <GitBranch className="w-7 h-7" />,
    tag: "04 · The Smart Brief",
    col: "270 60% 65%",
    headline: "Don't delegate tasks. Generate briefs.",
    subheading: "The infrastructure for working through others at the highest standard.",
    competitors: ["Asana", "Monday.com", "ClickUp", "Linear", "Jira"],
    competitorNote: "They track what needs doing. They don't transfer why, in what sequence, or with what judgment.",
    body: [
      "Delegation breaks not because people are incapable, but because context doesn't transfer. They execute the letter, not the intent.",
      "LIZA packages your intent, standards, and judgment into every delegated task. The recipient gets full context — fewer check-ins, fewer clarification spirals, results that match your standard.",
    ],
    carries: null,
    stats: [
      { value: "0", label: "Check-ins needed" },
      { value: "100%", label: "Intent transferred with every brief" },
      { value: "∞", label: "Scalable across your organisation" },
    ],
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UseCasesPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, hsl(200 90% 52% / 0.07) 0%, transparent 65%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.018]"
          style={{
            backgroundImage: `linear-gradient(hsl(200 90% 52%) 1px, transparent 1px), linear-gradient(90deg, hsl(200 90% 52%) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <SectionTag>How organisations build with LIZA</SectionTag>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Every use case
            <br />
            <GradientText>builds the next one.</GradientText>
          </h1>
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            Start with one. Within months, you're running all four — because each one compounds the last.
          </p>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(200 90% 52% / 0.4)",
            }}
          >
            Book a Discovery Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* ── Ready to Deploy ─────────────────────────────────────────────── */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "hsl(var(--success) / 0.12)", color: "hsl(var(--success))" }}
            >
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black">Ready to Deploy</h2>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Proven solutions you can run this month</p>
            </div>
          </div>

          <Link
            to="/solutions/security-audit"
            className="group relative block rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg"
            style={{
              borderColor: "hsl(var(--success) / 0.3)",
              background: "hsl(var(--success) / 0.03)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg, hsl(var(--success)), hsl(var(--primary)))" }} />
            <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full"
                    style={{ background: "hsl(var(--success) / 0.12)", color: "hsl(var(--success))" }}
                  >
                    <Shield className="w-3.5 h-3.5" /> Security Audit Engine
                  </span>
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full"
                    style={{ background: "hsl(var(--success) / 0.15)", color: "hsl(var(--success))" }}
                  >
                    Live
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-2">Reduce 18 days of audit work to 1.5 hours.</h3>
                <p className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
                  A focused AI execution engine for cybersecurity audit firms. Proven on real audits with ~800 questions, 84% first-pass accuracy.
                </p>
                <p className="text-sm font-semibold group-hover:underline" style={{ color: "hsl(var(--primary))" }}>
                  See full solution details <ArrowRight className="inline w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </p>
              </div>
              <div className="flex flex-row md:flex-col gap-3 md:w-48">
                {[
                  { icon: <Clock className="w-4 h-4" />, value: "18 days → 1.5 hrs", label: "Time reduction" },
                  { icon: <Shield className="w-4 h-4" />, value: "84%", label: "First-pass accuracy" },
                  { icon: <Zap className="w-4 h-4" />, value: "0", label: "Platform migrations" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="rounded-xl border p-3 text-center flex-1"
                    style={{ borderColor: "hsl(var(--success) / 0.2)", background: "hsl(var(--success) / 0.06)" }}
                  >
                    <p className="text-lg font-black" style={{ color: "hsl(var(--success))" }}>{s.value}</p>
                    <p className="text-[10px] font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
          <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border"
            style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
          >
            Coming soon
          </span>
          <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
        </div>
      </div>

      {/* Use Cases — narrative flow */}
      <div className="pb-32 px-6">
        <div className="max-w-6xl mx-auto flex flex-col">
          {USE_CASES.map((uc, i) => (
            <div key={i}>
              <section
                className="relative rounded-3xl border overflow-hidden"
                style={{
                  background: `hsl(${uc.col} / 0.03)`,
                  borderColor: `hsl(${uc.col} / 0.2)`,
                }}
              >
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${uc.col})` }} />

                <div className="p-10 md:p-14">
                  <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: narrative */}
                    <div className="flex-1">
                      {/* Tag + icon */}
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `hsl(${uc.col} / 0.15)`, color: `hsl(${uc.col})` }}
                        >
                          {uc.icon}
                        </div>
                        <span
                          className="text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full"
                          style={{ background: `hsl(${uc.col} / 0.12)`, color: `hsl(${uc.col})` }}
                        >
                          {uc.tag}
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-black mb-2 leading-tight">{uc.headline}</h2>
                      <p className="text-base font-semibold mb-8" style={{ color: `hsl(${uc.col})` }}>{uc.subheading}</p>

                      {/* Competitive context */}
                      <div
                        className="rounded-xl p-5 mb-8 border"
                        style={{
                          background: "hsl(var(--background) / 0.5)",
                          borderColor: "hsl(var(--border))",
                        }}
                      >
                        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                          What you're probably already using
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {uc.competitors.map((c) => (
                            <span
                              key={c}
                              className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border"
                              style={{
                                borderColor: "hsl(var(--border))",
                                color: "hsl(var(--muted-foreground))",
                                background: "hsl(var(--muted) / 0.5)",
                              }}
                            >
                              <X className="w-3 h-3 opacity-50" />
                              {c}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                          {uc.competitorNote}
                        </p>
                      </div>

                      {/* Body */}
                      <div className="flex flex-col gap-4">
                        {uc.body.map((para, j) => (
                          <p key={j} className="text-sm md:text-base leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                            {para}
                          </p>
                        ))}
                      </div>

                      {/* Carries forward */}
                      {uc.carries && (
                        <div
                          className="mt-8 rounded-xl p-5 border-l-2 flex items-start gap-3"
                          style={{
                            borderLeftColor: `hsl(${uc.col})`,
                            background: `hsl(${uc.col} / 0.04)`,
                          }}
                        >
                          <ArrowDownRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: `hsl(${uc.col})` }} />
                          <p className="text-sm font-medium leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
                            {uc.carries}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right: stats */}
                    <div className="lg:w-64 flex flex-col gap-4">
                      {uc.stats.map((s, j) => (
                        <div
                          key={j}
                          className="rounded-2xl p-6 border text-center"
                          style={{
                            background: `hsl(${uc.col} / 0.06)`,
                            borderColor: `hsl(${uc.col} / 0.2)`,
                          }}
                        >
                          <p className="text-3xl md:text-4xl font-black mb-1" style={{ color: `hsl(${uc.col})` }}>
                            {s.value}
                          </p>
                          <p className="text-xs font-medium leading-snug" style={{ color: "hsl(var(--muted-foreground))" }}>
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Flow connector between use cases */}
              {i < USE_CASES.length - 1 && (
                <FlowConnector text={
                  i === 0 ? "Playbooks run → audits execute with encoded judgment" :
                  i === 1 ? "Issues surface → knowledge encodes from every meeting" :
                  "Knowledge compounds → work gets delegated with intent"
                } />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* The flywheel — closing narrative */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag>The bigger picture</SectionTag>
            <h2 className="text-4xl font-black mb-4">
              One operating system.
              <br />
              <GradientText>Four compounding results.</GradientText>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              Each use case feeds the next. Together, they close the knowledge spiral, turning tacit expertise into organisational infrastructure that compounds over time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-14">
            {[
              {
                step: "Tacit → Explicit",
                desc: "Meeting transcripts and senior expertise get extracted, structured, and encoded. Knowledge that was invisible becomes accessible.",
                col: "200 90% 52%",
              },
              {
                step: "Explicit → Infrastructure",
                desc: "Encoded knowledge becomes executable protocols: audit criteria, sales playbooks, delegation packages. It stops being documentation and starts being a system.",
                col: "155 72% 46%",
              },
              {
                step: "Infrastructure → Execution",
                desc: "Your team runs on that infrastructure. Audits execute faster. Sales reps onboard in weeks. Delegated work lands correctly.",
                col: "38 92% 50%",
              },
              {
                step: "Execution → New Knowledge",
                desc: "Every execution generates new learning, captured, reviewed, and re-encoded. The system gets smarter with every run. Your organisational intelligence compounds.",
                col: "270 60% 65%",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-7 border overflow-hidden"
                style={{
                  background: `hsl(${item.col} / 0.03)`,
                  borderColor: `hsl(${item.col} / 0.2)`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${item.col})` }} />
                <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: `hsl(${item.col})` }}>
                  {item.step}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-base font-semibold mb-8">
              Most organisations start with one use case.
              <br />
              <span style={{ color: "hsl(var(--primary))" }}>Within months, they're running the full OS.</span>
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: "0 0 32px -4px hsl(200 90% 52% / 0.4)",
                }}
              >
                Book a Discovery Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border"
                style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
              >
                See the Platform →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
