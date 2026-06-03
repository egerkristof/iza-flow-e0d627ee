import { motion } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  Check,
  Users,
  AlertTriangle,
  X,
  MessageSquare,
  GitBranch,
  ArrowDown,
  Bot,
  Database,
  Cpu,
} from "lucide-react";
import { SectionTag, GradientText } from "./shared";

/**
 * Anatomy of a prompt at org scale — standalone story.
 * Reads top to bottom as a single narrative:
 *   1. Someone writes a prompt.
 *   2. Today: 800 versions of it scatter across the org. No control.
 *   3. LIZA wraps it in a standard your business owns.
 *   4. Every run comes back signed: source, model, cost, version.
 *   5. The standard learns every week.
 * Every stage carries its own label + caption so it makes sense alone.
 */

const PEOPLE = 24;

function StageHeader({ n, title, caption }: { n: string; title: string; caption: string }) {
  return (
    <div className="flex items-start gap-3 mb-3">
      <span
        className="shrink-0 w-7 h-7 rounded-full grid place-items-center text-[11px] font-black"
        style={{ background: "hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary) / 0.3)" }}
      >
        {n}
      </span>
      <div>
        <p className="text-sm md:text-base font-black tracking-tight text-foreground leading-tight">{title}</p>
        <p className="text-xs md:text-sm text-muted-foreground leading-snug mt-0.5">{caption}</p>
      </div>
    </div>
  );
}

function PromptCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto w-full max-w-md rounded-xl border bg-background shadow-[0_8px_32px_-12px_hsl(var(--primary)/0.25)]"
      style={{ borderColor: "hsl(var(--primary) / 0.35)" }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "hsl(var(--primary) / 0.2)" }}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] font-bold tracking-wider uppercase text-primary">What someone types into ChatGPT / Copilot</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">v7</span>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-foreground leading-snug">
          "Summarise the discovery call. Surface budget, decision timeline, stakeholders."
        </p>
      </div>
    </motion.div>
  );
}

function PeopleSwarm() {
  return (
    <div
      className="relative rounded-xl border px-4 py-5"
      style={{ borderColor: "hsl(var(--destructive) / 0.3)", background: "hsl(var(--destructive) / 0.04)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase" style={{ color: "hsl(var(--destructive))" }}>
          <AlertTriangle className="w-3 h-3" /> Today, without a standard
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">847 runs / week · 23 teams</span>
      </div>
      <svg className="absolute left-0 right-0 top-12 h-10 w-full pointer-events-none" viewBox="0 0 400 40" preserveAspectRatio="none">
        <motion.path
          d="M 200 0 L 40 40"
          stroke="hsl(var(--destructive) / 0.25)"
          strokeWidth="1"
          strokeDasharray="3 4"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.path
          d="M 200 0 L 360 40"
          stroke="hsl(var(--destructive) / 0.25)"
          strokeWidth="1"
          strokeDasharray="3 4"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </svg>
      <div className="relative grid grid-cols-12 gap-1.5 w-full">
        {Array.from({ length: PEOPLE }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.025 }}
            className="w-5 h-5 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: "hsl(var(--destructive) / 0.1)",
              border: "1px solid hsl(var(--destructive) / 0.35)",
            }}
          >
            <Users className="w-2.5 h-2.5" style={{ color: "hsl(var(--destructive))" }} />
          </motion.div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {["different wording", "different data scope", "no token cap", "no audit trail", "no owner"].map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded"
            style={{ background: "hsl(var(--destructive) / 0.08)", color: "hsl(var(--destructive))" }}
          >
            <X className="w-2.5 h-2.5" /> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function PlaybookBar() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.9 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mx-auto w-full rounded-xl border px-5 py-4"
      style={{
        borderColor: "hsl(var(--brand-green) / 0.4)",
        background: "hsl(var(--brand-green) / 0.06)",
        boxShadow: "0 0 24px -8px hsl(var(--brand-green) / 0.3)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" style={{ color: "hsl(var(--brand-green))" }} />
          <span className="text-xs font-black tracking-[0.15em] uppercase" style={{ color: "hsl(var(--brand-green))" }}>
            Playbook · discovery-call
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">owned by RevOps · v7</span>
      </div>
      <div className="grid sm:grid-cols-4 gap-2">
        {[
          { k: "Data scope", v: "CRM + call notes only" },
          { k: "Token cap", v: "€0.18 / run" },
          { k: "Approved models", v: "GPT-5, Claude 4" },
          { k: "Output schema", v: "JSON, 5 fields" },
        ].map((r) => (
          <div key={r.k} className="rounded-md border px-2.5 py-1.5" style={{ borderColor: "hsl(var(--brand-green) / 0.25)", background: "hsl(var(--background))" }}>
            <p className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">{r.k}</p>
            <p className="text-[11px] font-semibold text-foreground leading-tight">{r.v}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SignedOutputs() {
  return (
    <div
      className="relative rounded-xl border px-4 py-5"
      style={{ borderColor: "hsl(var(--brand-green) / 0.35)", background: "hsl(var(--brand-green) / 0.04)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-wider uppercase" style={{ color: "hsl(var(--brand-green))" }}>
          <Check className="w-3 h-3" /> Same 847 runs, with the playbook
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">every output signed</span>
      </div>
      <div className="relative grid grid-cols-12 gap-1.5 w-full">
        {Array.from({ length: PEOPLE }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.02 }}
            className="w-5 h-5 mx-auto rounded-md flex items-center justify-center"
            style={{
              background: "hsl(var(--brand-green) / 0.12)",
              border: "1px solid hsl(var(--brand-green) / 0.4)",
            }}
          >
            <Check className="w-2.5 h-2.5" style={{ color: "hsl(var(--brand-green))" }} />
          </motion.div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {[
          { k: "Source", v: "CRM-#4821" },
          { k: "Model", v: "GPT-5" },
          { k: "Cost", v: "€0.14" },
          { k: "Playbook", v: "discovery v7" },
        ].map((r) => (
          <div key={r.k} className="rounded-md border px-2 py-1" style={{ borderColor: "hsl(var(--brand-green) / 0.25)", background: "hsl(var(--background))" }}>
            <p className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground">{r.k}</p>
            <p className="text-[11px] font-mono text-foreground">{r.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverrideToPlaybook() {
  return (
    <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
      {/* Left: a real moment — chat override */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-xl border bg-background p-4 flex flex-col"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
            Sales rep, Tuesday 14:02
          </span>
        </div>
        <div className="space-y-2 text-xs leading-snug">
          <div className="rounded-lg px-3 py-2" style={{ background: "hsl(var(--muted))" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">AI output</p>
            <p className="text-foreground">Budget: not disclosed. Timeline: Q3.</p>
          </div>
          <div className="rounded-lg px-3 py-2 border-l-2" style={{ borderColor: "hsl(var(--brand-green))", background: "hsl(var(--brand-green) / 0.06)" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "hsl(var(--brand-green))" }}>
              Rep override
            </p>
            <p className="text-foreground">
              Budget signal lives in procurement slot, not the call. Always check field 'rfp_value'.
            </p>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground">LIZA captures the correction. No ticket. No re-prompting.</p>
      </motion.div>

      {/* Arrow */}
      <div className="hidden md:flex items-center justify-center text-primary">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-1"
        >
          <GitBranch className="w-5 h-5" />
          <span className="text-[9px] font-black tracking-widest uppercase">feeds</span>
        </motion.div>
      </div>
      <div className="md:hidden flex justify-center text-primary">
        <ArrowDown className="w-4 h-4" />
      </div>

      {/* Right: the playbook updates */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-xl border p-4"
        style={{
          borderColor: "hsl(var(--primary) / 0.35)",
          background: "hsl(var(--primary) / 0.04)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black tracking-wider uppercase text-primary">
              Playbook · discovery-call
            </span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground">v7 → v8</span>
        </div>
        <div className="space-y-1.5 font-mono text-[11px] leading-snug">
          <div className="rounded px-2 py-1" style={{ background: "hsl(var(--destructive) / 0.08)", color: "hsl(var(--destructive))" }}>
            <span className="opacity-70">- </span>read: call_notes
          </div>
          <div className="rounded px-2 py-1" style={{ background: "hsl(var(--brand-green) / 0.1)", color: "hsl(var(--brand-green))" }}>
            <span className="opacity-70">+ </span>read: call_notes, crm.rfp_value
          </div>
          <div className="rounded px-2 py-1" style={{ background: "hsl(var(--brand-green) / 0.1)", color: "hsl(var(--brand-green))" }}>
            <span className="opacity-70">+ </span>rule: budget := crm.rfp_value
          </div>
        </div>
        <p className="mt-3 text-[10px] text-muted-foreground">
          Next 846 runs use v8 automatically. Every team. Every tool. Same playbook.
        </p>
      </motion.div>
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
  },
  {
    icon: Database,
    name: "RAG / context",
    what: "Pulls documents into the prompt. Doesn't decide what's allowed.",
    when: "Change your RAG and nothing tells the agents.",
    accent: "hsl(var(--foreground))",
  },
  {
    icon: Cpu,
    name: "Fine-tune",
    what: "Re-trains the model weights. Slow, expensive, opaque.",
    when: "Weeks to update. Can't show auditors what changed.",
    accent: "hsl(var(--foreground))",
  },
];

function ComparisonBlock() {
  return (
    <div className="mt-16 max-w-5xl mx-auto">
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
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <SectionTag label="How LIZA actually works · one prompt at org scale" />
          <h2 className="text-2xl md:text-4xl font-black leading-[1.1] tracking-tight mb-4">
            The same prompt runs 847 times this week.{" "}
            <GradientText>LIZA turns those runs into infrastructure you can defend.</GradientText>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Follow one prompt through your org. Five steps, top to bottom.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto space-y-8">
          <div>
            <StageHeader
              n="1"
              title="One prompt. Someone on your team writes it."
              caption="A sales rep, a PM, an analyst. Today this lives in their head and their chat history."
            />
            <PromptCard />
          </div>

          <div>
            <StageHeader
              n="2"
              title="Then 23 teams run their own version of it."
              caption="Different wording. Different data pulled in. No cap on cost. No record of what was asked or answered."
            />
            <PeopleSwarm />
          </div>

          <div>
            <StageHeader
              n="3"
              title="LIZA wraps the prompt in a playbook your business owns."
              caption="One place where data scope, token cap, approved models and output shape are defined. Versioned. Auditable."
            />
            <PlaybookBar />
          </div>

          <div>
            <StageHeader
              n="4"
              title="Every run comes back signed."
              caption="Source data, model used, cost, and which version of the playbook it followed. Stamped on every output."
            />
            <SignedOutputs />
          </div>

          <div>
            <StageHeader
              n="5"
              title="Someone corrects the AI. The playbook learns."
              caption="A real moment from this week. A rep overrides a wrong answer in chat. LIZA turns the correction into the next version of the playbook. Every team running it gets the fix on the next prompt."
            />
            <OverrideToPlaybook />
          </div>
        </div>

        <ComparisonBlock />

        <div className="mt-12 max-w-3xl mx-auto rounded-2xl border px-6 py-5 text-center" style={{ borderColor: "hsl(var(--primary) / 0.25)", background: "hsl(var(--primary) / 0.04)" }}>
          <p className="text-sm md:text-base font-semibold text-foreground leading-snug">
            That is LIZA.{" "}
            <span className="text-muted-foreground font-normal">
              Not another chat tool. The control layer that sits over the ones you already use,
              so every AI run in your org has an owner, a budget, and a paper trail.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}