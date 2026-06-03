import { motion } from "framer-motion";
import { BookOpen, Check, X, Bot, Database, Cpu } from "lucide-react";
import { SectionTag, GradientText } from "./shared";
import type { ReactNode } from "react";

/**
 * Anatomy of a prompt at org scale.
 * Reweighted for the Head of AI Strategy ICP:
 *   1. The seed prompt.
 *   2. The CHAOS at scale (primary pain, sized up).
 *   3. The SIGNED output (primary product moment, sized up).
 *   4. The audit log evolution (versioned standard, replayable).
 *   5. Closing: production infrastructure vs siloed POC graveyard.
 */

function StageRow({
  n,
  numberTone = "neutral",
  title,
  caption,
  children,
}: {
  n: string;
  numberTone?: "neutral" | "danger" | "primary" | "success";
  title: ReactNode;
  caption: string;
  children: ReactNode;
}) {
  const tones = {
    neutral: { bg: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))", border: "transparent" },
    danger: { bg: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))", border: "hsl(var(--destructive) / 0.25)" },
    primary: { bg: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))", border: "hsl(var(--primary))" },
    success: { bg: "hsl(var(--brand-green) / 0.12)", color: "hsl(var(--brand-green))", border: "hsl(var(--brand-green) / 0.35)" },
  }[numberTone];
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="flex items-start gap-5 md:gap-8">
        <div
          className="flex-none w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border"
          style={{ background: tones.bg, color: tones.color, borderColor: tones.border }}
        >
          {n}
        </div>
        <div className="flex-1 min-w-0 space-y-5">
          <div className="space-y-1.5">
            <h3 className="text-xl md:text-2xl font-black tracking-tight text-foreground leading-tight">
              {title}
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-snug">{caption}</p>
          </div>
          {children}
        </div>
      </div>
    </motion.section>
  );
}

function PromptCard() {
  return (
    <div className="bg-background border border-border rounded-xl p-5 md:p-6 shadow-sm max-w-lg">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          Draft v1
        </span>
        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
      </div>
      <p className="text-base md:text-lg font-medium text-foreground leading-snug">
        "Summarise the discovery call. Surface budget, decision timeline, stakeholders."
      </p>
    </div>
  );
}

const CHAOS_TAGS = [
  "Different wording.",
  "Different data scope.",
  "No token cap.",
  "No audit trail.",
  "No owner.",
  "Shadow AI cost.",
];
function ChaosBlock() {
  return (
    <div
      className="relative rounded-2xl border p-6 md:p-8 overflow-hidden"
      style={{ borderColor: "hsl(var(--destructive) / 0.2)", background: "hsl(var(--destructive) / 0.04)" }}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 relative z-10">
        {CHAOS_TAGS.map((t, i) => (
          <motion.div
            key={t}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
            className="bg-background/80 backdrop-blur p-3 rounded-md border text-xs font-black uppercase tracking-wider flex items-center gap-2"
            style={{ borderColor: "hsl(var(--destructive) / 0.3)", color: "hsl(var(--destructive))" }}
          >
            <X className="w-3.5 h-3.5" />
            {t}
          </motion.div>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <p
          className="font-mono text-[10px] md:text-[11px] uppercase tracking-wider"
          style={{ color: "hsl(var(--destructive) / 0.75)" }}
        >
          Warning. 847 unmanaged runs this week. No governance detected.
        </p>
      </div>
    </div>
  );
}

const RECEIPT_FIELDS = [
  { k: "Model", v: "GPT-5", mono: true, primary: false },
  { k: "Token cost", v: "€0.142", mono: true, primary: false },
  { k: "Playbook", v: "discovery.v9", mono: true, primary: true },
  { k: "Data read", v: "crm.opp_4821", mono: true, primary: false },
  { k: "Role", v: "AI + human", mono: false, primary: false },
];
function SignedReceipt() {
  return (
    <div
      className="relative bg-background rounded-2xl p-7 md:p-9 overflow-hidden shadow-[0_24px_64px_-24px_hsl(var(--brand-green)/0.35)]"
      style={{ border: "3px solid hsl(var(--brand-green))" }}
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.08] pointer-events-none">
        <Check className="w-32 h-32" style={{ color: "hsl(var(--brand-green))" }} strokeWidth={3} />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 md:gap-6 relative">
        {RECEIPT_FIELDS.map((f, i) => (
          <motion.div
            key={f.k}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.15 + i * 0.08 }}
            className="space-y-1"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              {f.k}
            </p>
            <p
              className={`text-sm font-bold ${f.mono ? "font-mono" : ""}`}
              style={f.primary ? { color: "hsl(var(--primary))" } : { color: "hsl(var(--foreground))" }}
            >
              {f.v}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="mt-7 pt-6 border-t border-border flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "hsl(var(--brand-green))", color: "hsl(var(--primary-foreground))" }}
        >
          <Check className="w-5 h-5" strokeWidth={3} />
        </div>
        <p className="text-sm md:text-base font-bold text-foreground leading-snug">
          Production-grade output. Every standard met. Replayable on demand.
        </p>
      </div>
    </div>
  );
}

const AUDIT_ROWS = [
  { v: "v7", label: "Initial release", meta: "1,240 runs", state: "past" as const },
  { v: "v8", label: "Added CRM context", meta: "+ data_field: 'rfp_value'", state: "past" as const },
  { v: "v9", label: "Human-in-loop override applied", meta: "ACTIVE", state: "active" as const },
];
function AuditLog() {
  return (
    <div className="space-y-2 font-mono">
      {AUDIT_ROWS.map((r, i) => {
        const active = r.state === "active";
        return (
          <motion.div
            key={r.v}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: active ? 1 : 0.6, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.1 + i * 0.1 }}
            className="bg-background p-3.5 md:p-4 rounded-lg flex items-center justify-between text-xs gap-3 flex-wrap"
            style={{
              border: active ? "2px solid hsl(var(--primary))" : "1px solid hsl(var(--border))",
            }}
          >
            <span className="font-bold" style={active ? { color: "hsl(var(--primary))" } : undefined}>
              {r.v} . {r.label}
            </span>
            {active ? (
              <span
                className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider"
                style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
              >
                {r.meta}
              </span>
            ) : (
              <span className="text-muted-foreground">{r.meta}</span>
            )}
          </motion.div>
        );
      })}
      <p className="mt-3 text-[11px] text-muted-foreground leading-snug font-sans">
        Any auditor can replay any run from any week. The standard that was in force is stamped on
        the output.
      </p>
    </div>
  );
}

const COMPARE = [
  {
    icon: BookOpen,
    name: "Playbook (LIZA)",
    what: "Your business rules: data scope, budget, output, who can edit.",
    when: "Changes the moment a human says so. Versioned. Per workflow.",
    accent: "hsl(var(--primary))",
    highlight: true,
  },
  {
    icon: Bot,
    name: "Agent",
    what: "A runner that executes steps. Needs a playbook to know how.",
    when: "Without LIZA, every agent invents its own rules.",
    accent: "hsl(var(--foreground))",
    highlight: false,
  },
  {
    icon: Database,
    name: "RAG / context",
    what: "Pulls documents into the prompt. Doesn't decide what's allowed.",
    when: "Change your RAG and nothing tells the agents.",
    accent: "hsl(var(--foreground))",
    highlight: false,
  },
  {
    icon: Cpu,
    name: "Fine-tune",
    what: "Re-trains the model weights. Slow, expensive, opaque.",
    when: "Weeks to update. Can't show auditors what changed.",
    accent: "hsl(var(--foreground))",
    highlight: false,
  },
];

function ComparisonBlock() {
  return (
    <div className="mt-20 max-w-5xl mx-auto">
      <div className="text-center mb-6">
        <p className="text-[11px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-2">
          So what is a playbook, exactly
        </p>
        <h3 className="text-xl md:text-2xl font-black tracking-tight">
          The playbook is where your business decides.{" "}
          <span className="text-muted-foreground font-bold">Everything else just runs.</span>
        </h3>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {COMPARE.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.name}
              className="rounded-xl border p-4"
              style={{
                borderColor: c.highlight ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))",
                background: c.highlight ? "hsl(var(--primary) / 0.04)" : "hsl(var(--background))",
                boxShadow: c.highlight ? "0 0 24px -10px hsl(var(--primary) / 0.4)" : undefined,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4" style={{ color: c.accent }} />
                <p className="text-xs font-black tracking-wider uppercase" style={{ color: c.accent }}>
                  {c.name}
                </p>
              </div>
              <p className="text-xs text-foreground leading-snug mb-2">{c.what}</p>
              <p className="text-[11px] text-muted-foreground leading-snug">{c.when}</p>
            </div>
          );
        })}
      </div>
      <p className="text-center mt-6 text-sm text-muted-foreground max-w-2xl mx-auto">
        Agents run. RAG fetches. Models predict. The playbook is the only place your business
        keeps control of what's allowed, what's true, and what changed.
      </p>
    </div>
  );
}

function InfrastructureCloser() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-20 rounded-3xl p-10 md:p-14 text-center space-y-8 max-w-5xl mx-auto"
      style={{ background: "hsl(222 20% 4%)" }}
    >
      <div className="space-y-4">
        <h3
          className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          style={{ color: "hsl(0 0% 100%)" }}
        >
          This is how AI ships to production.
        </h3>
        <p
          className="text-base md:text-xl max-w-2xl mx-auto leading-relaxed"
          style={{ color: "hsl(0 0% 100% / 0.65)" }}
        >
          Stop building siloed AI POC hellholes. Start building infrastructure your CFO, board and
          regulator can defend. LIZA is the standard.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-2">
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-[10px] uppercase font-black tracking-[0.2em]"
            style={{ color: "hsl(0 0% 100% / 0.4)" }}
          >
            The old way
          </span>
          <div
            className="px-6 py-3 rounded-full font-bold line-through"
            style={{
              border: "1px solid hsl(0 0% 100% / 0.15)",
              color: "hsl(0 0% 100% / 0.45)",
            }}
          >
            Siloed POC graveyard
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-[10px] uppercase font-black tracking-[0.2em]"
            style={{ color: "hsl(var(--brand-green))" }}
          >
            The LIZA way
          </span>
          <div
            className="px-6 py-3 rounded-full font-bold"
            style={{
              background: "hsl(var(--brand-green))",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            Production infrastructure
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PromptFactoryVisual() {
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: "hsl(var(--card))" }}>
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 30%, hsl(var(--primary) / 0.05), transparent 70%)",
        }}
      />
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <SectionTag label="How LIZA actually works · one prompt at org scale" />
          <h2 className="text-2xl md:text-4xl font-black leading-[1.1] tracking-tight mb-4">
            One prompt. 847 runs this week.{" "}
            <GradientText>
              LIZA turns every one into infrastructure you can defend.
            </GradientText>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Follow it top to bottom. Where it breaks. What replaces it. What ships.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto space-y-20 md:space-y-24">
          <StageRow
            n="1"
            numberTone="neutral"
            title="One prompt. Someone on your team writes it."
            caption="Today it lives in a single chat history. Invisible to the organisation. Impossible to scale."
          >
            <PromptCard />
          </StageRow>

          <StageRow
            n="2"
            numberTone="danger"
            title="The scaling failure. Chaos at 4,000 seats."
            caption="Without infrastructure, every team invents their own risk. Zero visibility for the board. This is what most AI rollouts actually look like today."
          >
            <ChaosBlock />
          </StageRow>

          <StageRow
            n="3"
            numberTone="success"
            title={
              <>
                The signed output.{" "}
                <span className="text-muted-foreground font-bold">Every. Single. Run.</span>
              </>
            }
            caption="The product moment. Every output stamped with the model used, the token cost, the playbook version, the data read, and the role of human vs AI. CFO and Legal can read it without translation."
          >
            <SignedReceipt />
          </StageRow>

          <StageRow
            n="4"
            numberTone="primary"
            title="The playbook evolves. The audit log proves it."
            caption="Someone corrects the AI in chat. LIZA captures the correction, ships it as the next playbook version, and stamps every future run with which version was in force."
          >
            <AuditLog />
          </StageRow>
        </div>

        <ComparisonBlock />

        <InfrastructureCloser />
      </div>
    </section>
  );
}