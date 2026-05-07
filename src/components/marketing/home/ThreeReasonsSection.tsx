import { X, Check, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const REASONS = [
  {
    number: "01",
    claim: "Your standards never reach the AI.",
    explanation: (
      <>
        Today&apos;s tools let AI <span className="text-muted-foreground/80 line-through decoration-1">read</span> your documents. That is not the same as your <span className="font-black" style={{ color: "hsl(var(--primary))" }}>pricing rules, approval thresholds, and playbooks</span> being <span className="font-black" style={{ color: "hsl(var(--primary))" }}>enforced</span> inside every Copilot, Claude, and custom agent session. Retrieval is not governance. The gap is where consistency breaks.
      </>
    ),
    align: "left" as const,
    comparisons: [
      { label: "Glean, Notion AI", status: "partial" as const, why: "Retrieves text. Doesn't enforce rules." },
      { label: "Microsoft Copilot, Custom GPTs", status: "no" as const, why: "Per-tool prompts. No shared standard." },
      { label: "LIZA OS", status: "yes" as const, why: "One standard enforced across every AI tool." },
    ],
  },
  {
    number: "02",
    claim: "You can't decide as one company.",
    explanation: (
      <>
        ChatGPT and Claude give every employee private memory. Slack and Teams capture conversation, not decisions. <span className="font-black text-foreground">No tool is designed for collective decision-making by architecture.</span> You cannot have judgment that is both <span className="font-semibold" style={{ color: "hsl(var(--primary))" }}>shared across every team</span> and <span className="font-semibold" style={{ color: "hsl(var(--primary))" }}>owned by leadership</span>.
      </>
    ),
    align: "right" as const,
    comparisons: [
      { label: "ChatGPT Projects, Claude Projects", status: "partial" as const, why: "Per-user memory. Not collective by design." },
      { label: "Slack AI, Teams Copilot", status: "no" as const, why: "Conversations about AI. Not rules inside AI." },
      { label: "LIZA OS", status: "yes" as const, why: "Collective judgment, governed by leadership." },
    ],
  },
  {
    number: "03",
    claim: "Nothing compounds. Every prompt starts from zero.",
    explanation: (
      <>
        Memory features remember what <span className="font-semibold text-foreground">one person</span> told <span className="font-semibold text-foreground">one tool</span>. Confluence and Notion fill with stale pages nobody updates. <span className="text-foreground font-semibold">No intentional architecture is being built.</span> LIZA treats <span className="font-black" style={{ color: "hsl(var(--primary))" }}>standards as code</span>. Versioned, diffed, owned. A compounding asset that gets sharper every week.
      </>
    ),
    align: "left" as const,
    comparisons: [
      { label: "Mem, ChatGPT memory", status: "partial" as const, why: "Personal recall. No architecture." },
      { label: "Confluence, Notion, SharePoint", status: "partial" as const, why: "Static pages. Decay over time." },
      { label: "LIZA OS", status: "yes" as const, why: "Versioned standards. Compounding asset." },
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

function ReasonBand({ number, claim, explanation, align, comparisons }: { number: string; claim: string; explanation: React.ReactNode; align: "left" | "right"; comparisons: { label: string; status: "yes" | "no" | "partial"; why: string }[] }) {
  const isRight = align === "right";
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={`flex flex-col ${isRight ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-16 items-start`}
    >
      <div className="flex-1 min-w-0">
        <span
          className="text-5xl md:text-6xl font-black leading-none block mb-4"
          style={{
            background: "var(--gradient-brand)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: 0.35,
          }}
        >
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
    </motion.div>
  );
}

export function ThreeReasonsSection() {
  return (
    <section id="three-reasons" className="relative py-24 md:py-32 px-6"
      style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-sm font-bold tracking-[0.2em] uppercase text-primary mb-4">The Context Gap</p>
        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-3 leading-[1.1]">
          Three structural gaps
          <br />
          <span className="text-muted-foreground">between your judgment and your AI.</span>
        </h2>
        <p className="text-base text-muted-foreground max-w-xl mx-auto mt-4 leading-relaxed">
          Every AI tool you bought reads your <span className="line-through decoration-1">documents</span>.{" "}
          <span className="font-black text-foreground">None of them enforce your decisions.</span>{" "}
          That gap costs organizations an average of{" "}
          <span className="font-black" style={{ color: "hsl(var(--primary))" }}>€550K a year</span> in rework, inconsistent answers, and lost expertise.
        </p>

        <div className="mt-20 space-y-20 md:space-y-28">
          {REASONS.map((r) => (
            <ReasonBand key={r.number} {...r} />
          ))}
        </div>

        {/* Closing bridge + inline CTA */}
        <div className="mt-24 text-center">
          <p className="text-2xl md:text-3xl font-black text-foreground mb-2">
            LIZA OS closes all three.
          </p>
          <p className="text-base text-muted-foreground mb-2">
            One platform to capture expertise, govern execution, and compound what works.
          </p>
          <p className="text-sm font-semibold text-primary mb-6">
            And the knowledge it builds is yours. Extract it, take it anywhere. Zero lock-in.
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
            Score your AI execution <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
