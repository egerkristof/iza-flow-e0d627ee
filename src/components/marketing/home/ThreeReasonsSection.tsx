import { X, Check, AlertTriangle } from "lucide-react";

const REASONS = [
  {
    number: "01",
    claim: "Expertise stays locked in people.",
    explanation:
      "Your best operators carry the playbooks in their heads. When they're unavailable, quality drops. When they leave, it walks out the door. No amount of documentation fixes this — because documentation without execution is just filing.",
    align: "left" as const,
    comparisons: [
      { label: "SOPs & Wikis", status: "no" as const, why: "Written once, never reaches the workflow" },
      { label: "Training programs", status: "partial" as const, why: "Transfers knowledge, not ongoing governance" },
      { label: "LIZA OS", status: "yes" as const, why: "Expertise encoded into executable capabilities" },
    ],
  },
  {
    number: "02",
    claim: "No governance layer across departments.",
    explanation:
      "Every team picks their own tools, builds their own processes, defines their own standards. You get tool sprawl, inconsistent quality, and no way to measure adoption. The Head of AI becomes a firefighter, not a strategist.",
    align: "right" as const,
    comparisons: [
      { label: "Automation platforms", status: "partial" as const, why: "Automates tasks, doesn't govern quality" },
      { label: "AI tool policies", status: "no" as const, why: "Rules on paper, no enforcement in execution" },
      { label: "LIZA OS", status: "yes" as const, why: "Governed standards enforced across every team" },
    ],
  },
  {
    number: "03",
    claim: "Nothing compounds across teams.",
    explanation:
      "What Sales discovers never reaches Marketing. What one project team learns doesn't upgrade the next engagement. You have adoption metrics but no learning infrastructure. Every department starts from scratch.",
    align: "left" as const,
    comparisons: [
      { label: "Retrospectives", status: "partial" as const, why: "Insights captured, rarely operationalized" },
      { label: "Knowledge bases", status: "no" as const, why: "Static repositories that decay over time" },
      { label: "LIZA OS", status: "yes" as const, why: "Execution feeds back into capabilities automatically" },
    ],
  },
];

function StatusBadge({ status }: { status: "yes" | "no" | "partial" }) {
  if (status === "yes")
    return (
      <span
        className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
        style={{ background: "hsl(var(--success) / 0.15)", color: "hsl(var(--success))" }}
      >
        <Check className="w-3 h-3" /> Yes
      </span>
    );
  if (status === "no")
    return (
      <span
        className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
        style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive) / 0.6)" }}
      >
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
    <div
      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5"
      style={isLiza ? { background: "hsl(var(--primary) / 0.08)" } : { background: "hsl(0 0% 50% / 0.04)" }}
    >
      <span
        className={`text-sm font-semibold ${isLiza ? "" : "text-muted-foreground"}`}
        style={isLiza ? { color: "hsl(var(--primary))" } : undefined}
      >
        {label}
      </span>
      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={status} />
        <span className="text-[11px] text-muted-foreground/60 max-w-[180px] text-right leading-tight hidden sm:block">{why}</span>
      </div>
    </div>
  );
}

function ReasonBand({ number, claim, explanation, align, comparisons }: typeof REASONS[number]) {
  const isRight = align === "right";
  return (
    <div className={`flex flex-col ${isRight ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-16 items-start`}>
      <div className="flex-1 min-w-0">
        <span
          className="text-5xl md:text-6xl font-black leading-none block mb-4"
          style={{ color: "hsl(var(--primary) / 0.12)" }}
        >
          {number}
        </span>
        <h3 className="text-xl md:text-2xl font-black text-foreground leading-tight mb-4">
          {claim}
        </h3>
        <p className="text-base text-muted-foreground leading-relaxed">
          {explanation}
        </p>
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
    <section
      id="three-reasons"
      className="relative py-24 md:py-32 px-6"
      style={{ background: "hsl(var(--card))" }}
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-sm font-bold tracking-[0.2em] uppercase text-primary mb-4">The root cause</p>
        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-3 leading-[1.1]">
          Three structural gaps
          <br />
          <span className="text-muted-foreground">that no tool was built to close.</span>
        </h2>
        <p className="text-base text-muted-foreground max-w-lg mb-20">
          It's not the people. It's not the AI. It's the missing infrastructure between expertise and execution.
        </p>

        <div className="space-y-20 md:space-y-28">
          {REASONS.map((r) => (
            <ReasonBand key={r.number} {...r} />
          ))}
        </div>

        <div className="mt-24 text-center">
          <div className="inline-block">
            <p className="text-2xl md:text-3xl font-black text-foreground mb-2">
              LIZA OS closes all three.
            </p>
            <p className="text-base text-muted-foreground">
              One platform to capture expertise, govern execution, and compound what works — across every department.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
