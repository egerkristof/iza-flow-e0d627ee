import { X, Check, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const REASONS = [
  {
    number: "01",
    claim: "No way to define and enforce how AI work gets done.",
    explanation:
      "Your playbooks exist in wikis and shared drives. They never reach the actual AI session. Every person improvises their own version of \"best practice\" inside ChatGPT.",
    align: "left" as const,
    comparisons: [
      { label: "Notion / Confluence", status: "no" as const, why: "Static pages nobody opens mid-task" },
      { label: "Prompt libraries", status: "no" as const, why: "Copy-paste, no enforcement or versioning" },
      { label: "LIZA OS", status: "yes" as const, why: "Living playbooks enforced in every session" },
    ],
  },
  {
    number: "02",
    claim: "No way to execute as a team inside AI.",
    explanation:
      "Everyone prompts alone. Insights stay in individual chats. What one person learns never reaches the rest. Your team operates as a collection of soloists, not a unit.",
    align: "right" as const,
    comparisons: [
      { label: "ChatGPT / Claude", status: "no" as const, why: "Individual silos, zero shared context" },
      { label: "Slack / Teams", status: "partial" as const, why: "Conversations about AI, not inside AI" },
      { label: "LIZA OS", status: "yes" as const, why: "Team-wide context injected in every session" },
    ],
  },
  {
    number: "03",
    claim: "No way to learn and compound across engagements.",
    explanation:
      "Every session starts from scratch. Nothing compounds. Your system never gets smarter no matter how many projects your team completes.",
    align: "left" as const,
    comparisons: [
      { label: "Retrospective tools", status: "partial" as const, why: "Depends on who writes post-mortems" },
      { label: "AI memory features", status: "no" as const, why: "Per-user, no team-level learning" },
      { label: "LIZA OS", status: "yes" as const, why: "Continuous learning loops across the team" },
    ],
  },
];

function StatusBadge({ status }: { status: "yes" | "no" | "partial" }) {
  if (status === "yes")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
        style={{ background: "hsl(var(--success) / 0.15)", color: "hsl(var(--success))" }}>
        <Check className="w-3 h-3" /> Yes
      </span>
    );
  if (status === "no")
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
        style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive) / 0.6)" }}>
        <X className="w-3 h-3" /> No
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
      <AlertTriangle className="w-3 h-3" /> Partial
    </span>
  );
}

function ComparisonRow({ label, status, why, isLiza }: { label: string; status: "yes" | "no" | "partial"; why: string; isLiza: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5"
      style={isLiza ? { background: "hsl(var(--primary) / 0.08)" } : { background: "hsl(0 0% 50% / 0.04)" }}>
      <span className={`text-sm font-semibold ${isLiza ? "" : "text-muted-foreground"}`}
        style={isLiza ? { color: "hsl(var(--primary))" } : undefined}>
        {label}
      </span>
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={status} />
        <span className="text-[11px] text-muted-foreground/60 max-w-[160px] text-right leading-tight hidden sm:block">{why}</span>
      </div>
    </div>
  );
}

function ReasonBand({ number, claim, explanation, align, comparisons }: typeof REASONS[number]) {
  const isRight = align === "right";
  return (
    <div className={`flex flex-col ${isRight ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-16 items-start`}>
      <div className="flex-1 min-w-0">
        <span className="text-5xl md:text-6xl font-black leading-none block mb-4"
          style={{ color: "hsl(var(--primary) / 0.12)" }}>
          {number}
        </span>
        <h3 className="text-xl md:text-2xl font-black text-foreground leading-tight mb-4">{claim}</h3>
        <p className="text-base text-muted-foreground leading-relaxed">{explanation}</p>
      </div>
      <div className="flex-1 min-w-0 w-full space-y-2">
        {comparisons.map((c) => (
          <ComparisonRow key={c.label} {...c} isLiza={c.label === "LIZA OS"} />
        ))}
      </div>
    </div>
  );
}

export function ThreeReasonsSection() {
  return (
    <section id="three-reasons" className="relative py-24 md:py-32 px-6"
      style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-sm font-bold tracking-[0.2em] uppercase text-primary mb-4">The root cause</p>
        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-3 leading-[1.1]">
          Three structural gaps
          <br />
          <span className="text-muted-foreground">no AI tool was built to close.</span>
        </h2>
        <p className="text-base text-muted-foreground max-w-lg mb-20">
          It's not the people. It's not the AI. It's the missing infrastructure between them.
        </p>

        <div className="space-y-20 md:space-y-28">
          {REASONS.map((r) => (
            <ReasonBand key={r.number} {...r} />
          ))}
        </div>

        {/* Closing bridge + inline CTA */}
        <div className="mt-24 text-center">
          <p className="text-2xl md:text-3xl font-black text-foreground mb-2">
            LIZA OS closes all three.
          </p>
          <p className="text-base text-muted-foreground mb-6">
            One platform to define, execute, and adapt AI usage. As a team.
          </p>
          <Link
            to="/diagnostic"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 24px -4px hsl(var(--primary) / 0.3)",
            }}
          >
            Find out where your team stands <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
