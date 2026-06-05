import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { CAL_URL } from "./shared";
import { GovernanceRail } from "./GovernanceRail";

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
      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* WHO: the person under pressure */}
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
            For the person on the hook for AI this year
          </span>
        </motion.div>

        {/* HEADLINE: one clear sentence that passes the grunt test */}
        <motion.h1
          className="font-black tracking-tight leading-[0.98] mb-6 text-4xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Every AI experiment,
          <br />
          <span className="text-primary">production-ready. Day one.</span>
        </motion.h1>

        {/* SUBHEAD: one tight line, what LIZA is */}
        <motion.p
          className="text-base md:text-lg mb-7 text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          One governed standard your whole org runs on — across ChatGPT, Copilot, Claude and your internal models.
        </motion.p>

        {/* CTA: explicit next step + time anchor */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-2 mt-8"
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
            Show me how, in 30 min
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            to="/diagnostic"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Score your rollout in 5 min <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Governance rail: the product mechanism, named */}
        <GovernanceRail />
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 font-semibold mt-2">
          One playbook. Enforced across ChatGPT, Copilot, Claude and your internal models.
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
