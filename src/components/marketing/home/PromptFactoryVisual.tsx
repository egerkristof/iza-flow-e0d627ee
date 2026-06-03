import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Check, RotateCw, Users } from "lucide-react";
import { SectionTag, GradientText } from "./shared";

/**
 * Anatomy of a prompt at org scale.
 * One template → many runs → one standard → signed outputs → loop back.
 * Visual-first, minimal copy. Sits between the problem and the plan.
 */

// People row: one prompt, many runs across the org
const PEOPLE = 24;

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
          <span className="text-[11px] font-bold tracking-wider uppercase text-primary">Prompt template</span>
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
    <div className="relative h-20 flex items-center justify-center">
      {/* Funnel guide lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 80" preserveAspectRatio="none">
        <motion.path
          d="M 200 0 L 40 80"
          stroke="hsl(var(--primary) / 0.25)"
          strokeWidth="1"
          strokeDasharray="3 4"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.path
          d="M 200 0 L 360 80"
          stroke="hsl(var(--primary) / 0.25)"
          strokeWidth="1"
          strokeDasharray="3 4"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </svg>
      <div className="relative grid grid-cols-12 gap-1.5 w-full max-w-2xl px-4">
        {Array.from({ length: PEOPLE }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.025 }}
            className="w-5 h-5 mx-auto rounded-full flex items-center justify-center"
            style={{
              background: "hsl(var(--primary) / 0.12)",
              border: "1px solid hsl(var(--primary) / 0.35)",
            }}
          >
            <Users className="w-2.5 h-2.5 text-primary" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StandardBar() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.9 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mx-auto w-full max-w-3xl rounded-lg border flex items-center justify-between px-5 py-3"
      style={{
        borderColor: "hsl(var(--brand-green) / 0.4)",
        background: "hsl(var(--brand-green) / 0.06)",
        boxShadow: "0 0 24px -8px hsl(var(--brand-green) / 0.3)",
      }}
    >
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4" style={{ color: "hsl(var(--brand-green))" }} />
        <span className="text-xs font-black tracking-[0.15em] uppercase" style={{ color: "hsl(var(--brand-green))" }}>
          Standard #03 / discovery-call
        </span>
      </div>
      <div className="hidden sm:flex items-center gap-3 text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
        <span>data scope</span>
        <span>·</span>
        <span>token cap</span>
        <span>·</span>
        <span>output schema</span>
      </div>
    </motion.div>
  );
}

function SignedOutputs() {
  return (
    <div className="relative h-16 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 64" preserveAspectRatio="none">
        <motion.path
          d="M 40 0 L 200 64"
          stroke="hsl(var(--brand-green) / 0.3)"
          strokeWidth="1"
          strokeDasharray="3 4"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />
        <motion.path
          d="M 360 0 L 200 64"
          stroke="hsl(var(--brand-green) / 0.3)"
          strokeWidth="1"
          strokeDasharray="3 4"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />
      </svg>
      <div className="relative grid grid-cols-12 gap-1.5 w-full max-w-2xl px-4">
        {Array.from({ length: PEOPLE }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.85 + i * 0.02 }}
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
    </div>
  );
}

function FeedbackLoop() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="mx-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border"
      style={{
        borderColor: "hsl(var(--primary) / 0.3)",
        background: "hsl(var(--primary) / 0.05)",
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <RotateCw className="w-3.5 h-3.5 text-primary" />
      </motion.div>
      <span className="text-[11px] font-bold tracking-wider uppercase text-primary">
        Every run teaches the standard. v7 today. v12 next quarter.
      </span>
    </motion.div>
  );
}

const LABELS = [
  { side: "left", top: "5%", title: "One template", body: "Defined once. Versioned." },
  { side: "right", top: "30%", title: "847 runs / week", body: "23 teams. Same prompt." },
  { side: "left", top: "55%", title: "One standard", body: "Boundaries enforced every run." },
  { side: "right", top: "78%", title: "Signed outputs", body: "Lineage on every line." },
] as const;

export function PromptFactoryVisual() {
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: "hsl(var(--card))" }}>
      {/* ambient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 30%, hsl(var(--primary) / 0.05), transparent 70%)",
        }}
      />
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <SectionTag label="Anatomy of a prompt at org scale" />
          <h2 className="text-2xl md:text-4xl font-black leading-[1.1] tracking-tight mb-4">
            One prompt. Hundreds of runs.{" "}
            <GradientText>One standard learning every week.</GradientText>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            This is how AI stops being scattered chats and starts being infrastructure.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Side labels (desktop) */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none">
            {LABELS.map((l, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: l.side === "left" ? -16 : 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                className={`absolute ${l.side === "left" ? "-left-44" : "-right-44"} w-40 ${l.side === "right" ? "text-left" : "text-right"}`}
                style={{ top: l.top }}
              >
                <p className="text-[11px] font-black tracking-[0.18em] uppercase text-primary mb-1">
                  {l.title}
                </p>
                <p className="text-xs text-muted-foreground leading-snug">{l.body}</p>
              </motion.div>
            ))}
          </div>

          <div className="space-y-2">
            <PromptCard />
            <PeopleSwarm />
            <StandardBar />
            <SignedOutputs />
            <div className="pt-2 text-center">
              <FeedbackLoop />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}