import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { BookOpen, Check, X, Bot, Database, Cpu, Shield, Coins, Users, FileCheck, ScanLine, Building2, Workflow, ArrowDown } from "lucide-react";
import { SectionTag, GradientText } from "./shared";
import { useEffect, useRef, useState, type ReactNode } from "react";

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
  children,
}: {
  n: string;
  numberTone?: "neutral" | "danger" | "primary" | "success";
  title: ReactNode;
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
          <h3 className="text-xl md:text-2xl font-black tracking-tight text-foreground leading-tight">
            {title}
          </h3>
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

const LIVE_PROMPTS = [
  { who: "Account Exec . Berlin", text: "Summarise the discovery call. Surface budget, stakeholders, decision timeline." },
  { who: "RevOps . Munich", text: "Pull every Q3 opportunity over €50k and flag the ones without a champion." },
  { who: "Marketing . Vienna", text: "Rewrite this whitepaper for a CFO audience. Keep regulatory references intact." },
  { who: "Legal Intern . Zurich", text: "Compare this MSA to our template. List every deviation and rate the risk." },
  { who: "Customer Success", text: "Draft the QBR deck for ACME. Pull usage, NPS, open tickets, expansion signals." },
  { who: "Finance . Frankfurt", text: "Reconcile this expense file against policy. Flag anything above threshold." },
  { who: "Product Manager", text: "Cluster last quarter's feature requests. Rank by revenue impact and effort." },
  { who: "HR Business Partner", text: "Summarise the engagement survey. Pull the three themes leadership must hear." },
];
function PromptStream() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % LIVE_PROMPTS.length), 2200);
    return () => clearInterval(id);
  }, []);
  const current = LIVE_PROMPTS[idx];
  return (
    <div className="space-y-3 max-w-xl">
      <div className="bg-background border border-border rounded-xl p-5 md:p-6 shadow-sm relative overflow-hidden min-h-[150px]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse" />
            Live . {String(idx + 1).padStart(2, "0")} / {String(LIVE_PROMPTS.length).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/70">prompt stream</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2">
              {current.who}
            </p>
            <p className="text-base md:text-lg font-medium text-foreground leading-snug">
              "{current.text}"
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="text-xs text-muted-foreground leading-snug">
        Multiply this by every team, every hour, every week. That is your real AI footprint.
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
      <div className="mb-5 flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: "hsl(var(--destructive))" }}>
          Scale 1 prompt to 4,000 seats . this is what you get
        </span>
      </div>
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
      <p className="mt-4 text-xs md:text-sm text-foreground/70 leading-snug text-center max-w-2xl mx-auto">
        Every foundation your company normally requires to put something into production is missing. So nothing ships. Or everything ships, ungoverned.
      </p>
    </div>
  );
}

const CENTRAL_RULES = [
  { icon: Database, label: "Data scope & residency", note: "What every AI session may read. Where it may run." },
  { icon: Coins, label: "Token ROI cap", note: "CFO-set spend ceiling per run, per team, per outcome." },
  { icon: Shield, label: "Guardrails", note: "Regulatory, brand and policy lines AI must never cross." },
  { icon: Users, label: "Accountable owner", note: "Named human on the hook. Risk, Legal, DPO or function lead." },
];
const COMPLIANCE_DOMAINS = [
  "SOC 2",
  "ISO 27001",
  "EU AI Act",
  "GDPR",
  "CFO token ROI",
  "Internal best practice",
  "Brand & voice",
];
const WORKFLOW_PLAYBOOKS = [
  { name: "Discovery call recap", owner: "RevOps", version: "v9" },
  { name: "MSA risk review", owner: "Legal", version: "v4" },
  { name: "QBR draft", owner: "CS", version: "v6" },
];
function GovernanceGate() {
  return (
    <div className="space-y-3">
      {/* TIER 1 . Central governance */}
      <div
        className="relative rounded-2xl p-6 md:p-7 overflow-hidden"
        style={{
          border: "1px solid hsl(var(--primary) / 0.3)",
          background: "linear-gradient(180deg, hsl(var(--primary) / 0.05), transparent 70%)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
          <span className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: "hsl(var(--primary))" }}>
            Tier 1 . Central guardrails
          </span>
          <span className="ml-auto text-[10px] font-mono text-muted-foreground/70">applied to every AI session</span>
        </div>
        <p className="text-sm font-semibold text-foreground mb-4 leading-snug">
          Your rules, encoded once. Regulatory, financial, operational. Production readiness guaranteed at source.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {CENTRAL_RULES.map((g, i) => {
            const Icon = g.icon;
            return (
              <motion.div
                key={g.label}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                className="rounded-lg border bg-background px-3 py-2.5"
                style={{ borderColor: "hsl(var(--primary) / 0.25)" }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />
                  <span className="text-[11px] font-black uppercase tracking-wider text-foreground">{g.label}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-snug">{g.note}</p>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-1.5" style={{ borderColor: "hsl(var(--primary) / 0.15)" }}>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mr-1">
            Covers
          </span>
          {COMPLIANCE_DOMAINS.map((d, i) => (
            <motion.span
              key={d}
              initial={{ opacity: 0, y: 4 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: 0.05 + i * 0.04 }}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
              style={{
                borderColor: "hsl(var(--primary) / 0.25)",
                background: "hsl(var(--primary) / 0.06)",
                color: "hsl(var(--primary))",
              }}
            >
              {d}
            </motion.span>
          ))}
        </div>
      </div>

      {/* connector */}
      <div className="flex flex-col items-center gap-1">
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-px h-5"
          style={{ background: "hsl(var(--primary) / 0.4)", transformOrigin: "top" }}
        />
        <ArrowDown className="w-3.5 h-3.5 text-muted-foreground/60" />
      </div>

      {/* TIER 2 . Workflow playbooks */}
      <div
        className="relative rounded-2xl p-6 md:p-7 overflow-hidden"
        style={{
          border: "1px solid hsl(var(--brand-green) / 0.35)",
          background: "linear-gradient(180deg, hsl(var(--brand-green) / 0.05), transparent 70%)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Workflow className="w-4 h-4" style={{ color: "hsl(var(--brand-green))" }} />
          <span className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: "hsl(var(--brand-green))" }}>
            Tier 2 . Workflow playbooks
          </span>
          <span className="ml-auto text-[10px] font-mono text-muted-foreground/70">owned by the business</span>
        </div>
        <p className="text-sm font-semibold text-foreground mb-4 leading-snug">
          Each team writes the playbook that turns AI output into a real deliverable. Inherits every central rule above.
        </p>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {WORKFLOW_PLAYBOOKS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              className="rounded-lg border bg-background px-3 py-2.5"
              style={{ borderColor: "hsl(var(--brand-green) / 0.3)" }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <FileCheck className="w-3.5 h-3.5" style={{ color: "hsl(var(--brand-green))" }} />
                <span
                  className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded"
                  style={{
                    background: "hsl(var(--brand-green) / 0.12)",
                    color: "hsl(var(--brand-green))",
                  }}
                >
                  {p.version}
                </span>
              </div>
              <p className="text-[12px] font-bold text-foreground leading-snug">{p.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{p.owner}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* output connector */}
      <div className="flex justify-center pt-1">
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          whileInView={{ opacity: 1, scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="w-px h-8"
          style={{ background: "linear-gradient(180deg, hsl(var(--brand-green)), hsl(var(--brand-green) / 0.3))", transformOrigin: "top" }}
        />
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
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 30%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
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

        <div ref={trackRef} className="relative max-w-4xl mx-auto space-y-20 md:space-y-24">
          {/* Scroll-driven connecting spine */}
          <div
            className="hidden md:block absolute left-5 top-0 bottom-0 w-px pointer-events-none"
            style={{ background: "hsl(var(--border))" }}
            aria-hidden
          >
            <motion.div
              className="absolute top-0 left-0 w-full origin-top"
              style={{
                height: lineHeight,
                background:
                  "linear-gradient(180deg, hsl(var(--muted-foreground)) 0%, hsl(var(--destructive)) 28%, hsl(var(--primary)) 60%, hsl(var(--brand-green)) 100%)",
              }}
            />
          </div>
          <StageRow
            n="1"
            numberTone="neutral"
            title="It is not one prompt. People prompt all the time."
          >
            <PromptStream />
          </StageRow>

          <StageRow
            n="2"
            numberTone="danger"
            title="Scale those prompts. The foundations collapse."
          >
            <ChaosBlock />
          </StageRow>

          <StageRow
            n="3"
            numberTone="success"
            title={
              <>
                LIZA routes every prompt through the governance gate.{" "}
                <span className="text-muted-foreground font-bold">Then signs the output.</span>
              </>
            }
          >
            <div className="space-y-5">
              <GovernanceGate />
              <SignedReceipt />
            </div>
          </StageRow>

          <StageRow
            n="4"
            numberTone="primary"
            title="The playbook evolves. Every version is replayable."
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