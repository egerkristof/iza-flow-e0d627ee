import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { CAL_URL } from "./shared";
import { GovernanceRail } from "./GovernanceRail";

const OUTCOMES = [
  "Defend the spend",
  "Prove the rollout",
  "Scale without losing control",
];

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* ── Ambient glow layers ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 30%, hsl(var(--primary) / 0.06) 0%, transparent 70%),
            radial-gradient(ellipse 40% 35% at 75% 60%, hsl(var(--brand-green) / 0.04) 0%, transparent 60%)
          `,
        }}
      />

      {/* ── Dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.08) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        {/* WHO: explicit audience badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6"
          style={{
            borderColor: "hsl(var(--primary) / 0.3)",
            background: "hsl(var(--primary) / 0.06)",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary">
            For Heads of AI &amp; VPs of AI Transformation
          </span>
        </motion.div>

        {/* WHAT: lead with the product + the outcome */}
        <motion.h1
          className="text-3xl md:text-5xl lg:text-[3.5rem] font-black mb-5 leading-[1.05] tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          The control layer that makes your{" "}
          <span className="text-primary">org's AI rollout defensible.</span>
        </motion.h1>

        {/* WHY IT MATTERS: one tight sentence */}
        <motion.p
          className="text-base md:text-lg mb-7 text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          LIZA ties every output from ChatGPT, Copilot, Claude, and your
          internal models to a standard your business owns. So you can prove
          the spend, the decisions, and the rollout.
        </motion.p>

        {/* OUTCOME CHIPS */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
        >
          {OUTCOMES.map((o) => (
            <span
              key={o}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
              style={{
                borderColor: "hsl(var(--border))",
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground) / 0.8)",
              }}
            >
              <Check className="w-3 h-3" style={{ color: "hsl(var(--brand-green))" }} />
              {o}
            </span>
          ))}
        </motion.div>

        {/* CTA: explicit next step + time anchor */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-2"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Book a 30-min call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            to="/diagnostic"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Take the 5-min diagnostic <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Governance rail: the product mechanism, named */}
        <GovernanceRail />
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 font-semibold mt-2">
          One standard. Enforced across every AI tool your teams already use.
        </p>
      </div>

      {/* ── Scroll hint ── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="w-5 h-8 rounded-full border-2 flex justify-center pt-1.5"
          style={{ borderColor: "hsl(var(--muted-foreground) / 0.3)" }}
        >
          <div
            className="w-1 h-1.5 rounded-full"
            style={{ background: "hsl(var(--muted-foreground) / 0.5)" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
