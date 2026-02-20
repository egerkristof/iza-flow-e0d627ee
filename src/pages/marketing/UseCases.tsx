import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ArrowRight, ClipboardCheck, MessageSquare, TrendingUp, GitBranch } from "lucide-react";

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

const USE_CASES = [
  {
    icon: <ClipboardCheck className="w-7 h-7" />,
    tag: "Audit Automation",
    col: "200 90% 52%",
    headline: "Make audits 23× faster.",
    subheading: "We made auditing great again.",
    body: "Auditing is one of the most expertise-dense, detail-critical activities in any organisation — long criteria checklists, best-practice frameworks, domain rules that live entirely in the heads of specialists with glasses buried in Excel sheets.\n\nWith LIZA OS, we encode all those rules. Every criterion, every compliance gate, every domain-specific heuristic gets structured and packaged into executable protocols. The system then applies all criteria automatically, eliminating up to 80% of the groundwork entirely.\n\nThe result: audits run 23× faster with 72% higher accuracy.",
    stats: [
      { value: "23×", label: "Faster audit execution" },
      { value: "72%", label: "Accuracy improvement" },
      { value: "80%", label: "Groundwork eliminated" },
    ],
  },
  {
    icon: <MessageSquare className="w-7 h-7" />,
    tag: "Meeting Intelligence",
    col: "155 72% 46%",
    headline: "Turn every transcript into organisational knowledge.",
    subheading: "Your meetings are full of tacit knowledge. We surface it.",
    body: "Every week, your organisation runs dozens of meetings. Each one is packed with decisions, rationale, pattern recognition, and strategic insight — and most of it evaporates. Existing transcription tools give you a wall of text nobody reads.\n\nLIZA OS takes your meeting transcripts and extracts the contextual intelligence within them: what was decided, what principles were applied, what new knowledge was generated. You get a synthesised view of what actually happened across your organisation — without sitting in every meeting or reading every summary.\n\nThis is how you kick off a knowledge-base transformation. Not with a months-long project — with your next Monday morning.",
    stats: [
      { value: "100%", label: "Meetings captured" },
      { value: "0", label: "Hours reading summaries" },
      { value: "1 week", label: "To start your knowledge transformation" },
    ],
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    tag: "Sales Playbook Automation",
    col: "38 92% 50%",
    headline: "Onboard sales reps in 8 weeks, not 6–9 months.",
    subheading: "Scale your senior seller's judgment across your entire go-to-market team.",
    body: "Complex B2B sales are expertise-driven. Your best sellers aren't following a script — they're pattern-matching, reading signals, knowing exactly when to push and when to wait. That's tacit knowledge, and it typically takes 6–9 months of full-time salary before a new hire delivers any meaningful pipeline.\n\nWith LIZA OS, you encode your senior sellers' playbooks: their discovery frameworks, objection-handling logic, qualification criteria, stakeholder mapping instincts. Every sales team member then executes at that senior level from week one.\n\nOnboarding time drops from 6–9 months to 8 weeks. Your go-to-market team functions at the highest skill level — consistently.",
    stats: [
      { value: "8 wks", label: "To full productivity (vs 6–9 months)" },
      { value: "Senior", label: "Skill level from day one" },
      { value: "100%", label: "Sales team consistency" },
    ],
  },
  {
    icon: <GitBranch className="w-7 h-7" />,
    tag: "Smart Delegation",
    col: "270 60% 65%",
    headline: "Delegate once. Get it done right.",
    subheading: "The greatest delegation tool ever built.",
    body: "Every working day, leaders face the same frustrating choice: do it yourself, or delegate and spend more time chasing than it would have taken to just do it. Delegation breaks because context doesn't transfer — people execute the letter, not the intent.\n\nLIZA OS solves this by packaging your intent, your standards, and your judgment into every delegated task. The recipient gets the full context: the 'what', the 'why', the sequencing logic, the quality gates. They execute correctly — without check-ins, without clarification spirals, without the end result being something you'd have done differently.\n\nThis is delegation at the speed of trust. We're bringing it to every team, every organisation, everywhere.",
    stats: [
      { value: "0", label: "Check-in meetings needed" },
      { value: "100%", label: "Intent transferred with every task" },
      { value: "∞", label: "Scalable across your entire organisation" },
    ],
  },
];

export default function UseCasesPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
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
          <SectionTag>Real-world results</SectionTag>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            What LIZA OS
            <br />
            <GradientText>actually does.</GradientText>
          </h1>
          <p className="text-lg mb-10" style={{ color: "hsl(var(--muted-foreground))" }}>
            Not hypothetical capabilities. Real use cases we've already run — with measurable results that change how organisations operate.
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

      {/* Use Cases */}
      <div className="pb-32 px-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          {USE_CASES.map((uc, i) => (
            <section
              key={i}
              className="relative rounded-3xl border overflow-hidden"
              style={{
                background: `hsl(${uc.col} / 0.03)`,
                borderColor: `hsl(${uc.col} / 0.2)`,
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${uc.col})` }} />

              <div className="p-10 md:p-14">
                <div className="flex flex-col lg:flex-row gap-12">
                  {/* Left: content */}
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

                    <h2 className="text-3xl md:text-4xl font-black mb-3 leading-tight">{uc.headline}</h2>
                    <p className="text-base font-semibold mb-6" style={{ color: `hsl(${uc.col})` }}>{uc.subheading}</p>

                    <div className="flex flex-col gap-4">
                      {uc.body.split("\n\n").map((para, j) => (
                        <p key={j} className="text-sm md:text-base leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Right: stats */}
                  <div className="lg:w-72 flex flex-col gap-4">
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
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-3xl mx-auto text-center">
          <SectionTag>Get started</SectionTag>
          <h2 className="text-4xl font-black mb-4">
            Ready to see this
            <br />
            <GradientText>in your organisation?</GradientText>
          </h2>
          <p className="text-lg mb-10" style={{ color: "hsl(var(--muted-foreground))" }}>
            Book a 30-minute discovery call. We'll show you exactly which use case fits your team first.
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
              to="/platform"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border"
              style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
            >
              Explore the Platform →
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
