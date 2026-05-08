import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical, Banknote, Building2, ShieldCheck, Rocket, Cpu, Zap, Briefcase, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

/* ── Floating ambient nodes ── */
const NODES = [
  { x: "12%", y: "18%", size: 6, delay: 0 },
  { x: "85%", y: "25%", size: 4, delay: 0.8 },
  { x: "72%", y: "72%", size: 5, delay: 1.6 },
  { x: "20%", y: "78%", size: 3, delay: 2.2 },
  { x: "50%", y: "12%", size: 4, delay: 0.4 },
  { x: "38%", y: "85%", size: 3, delay: 1.2 },
  { x: "92%", y: "55%", size: 5, delay: 1.8 },
  { x: "8%",  y: "50%", size: 4, delay: 0.6 },
];

const TRUST_STATS = [
  { value: "85%", label: "of enterprises adopted AI. Almost none govern what it produces." },
  { value: "40%", label: "of AI productivity gains lost to rework." },
  { value: "90%", label: "of operating knowledge stays tacit, in people and threads." },
  { value: "$280B", label: "lost yearly to rework in US construction alone." },
];

/* ── Industry lifecycles already covered ── */
const INDUSTRY_LIFECYCLES = [
  { icon: FlaskConical, label: "Pharma & Life Sciences", sub: "GxP lifecycle" },
  { icon: Rocket,       label: "Space Engineering & Operations", sub: "Mission lifecycle" },
  { icon: Building2,    label: "AEC",                    sub: "Project lifecycle" },
  { icon: ShieldCheck,  label: "Regulated Manufacturing",sub: "Quality lifecycle" },
  { icon: Banknote,     label: "Financial Services",     sub: "Risk & compliance" },
  { icon: Cpu,          label: "Enterprise IT & AI",     sub: "Delivery lifecycle" },
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

      {/* ── Floating nodes ── */}
      {NODES.map((node, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: node.x,
            top: node.y,
            width: node.size,
            height: node.size,
            background: `hsl(var(--primary) / 0.25)`,
            boxShadow: `0 0 ${node.size * 3}px hsl(var(--primary) / 0.15)`,
          }}
          animate={{
            y: [0, -12, 0, 8, 0],
            opacity: [0.3, 0.7, 0.4, 0.6, 0.3],
          }}
          transition={{
            duration: 6 + i * 0.5,
            repeat: Infinity,
            delay: node.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <motion.h1
          className="text-3xl md:text-5xl lg:text-[3.75rem] font-black mb-5 leading-[1.08] tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your team already uses AI.
          <br />
          <span className="text-primary">Your playbook lives in a PDF nobody reads.</span>
        </motion.h1>

        <motion.p
          className="text-base md:text-lg mb-9 text-muted-foreground max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Build your team playbook in three steps. LIZA turns how your function
          actually works into executable knowledge, so every person and every AI
          tool runs to the same standard from day one.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/by-function"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            See it for your function
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/diagnostic"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Score your AI execution <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

      </div>

      {/* ── Industry lifecycles we already cover ── */}
      <motion.div
        className="relative z-10 mt-2 w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-10 bg-border" />
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
            Built for the most demanding industry lifecycles
          </p>
          <div className="h-px w-10 bg-border" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {INDUSTRY_LIFECYCLES.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
                className="group flex items-center gap-3 px-3.5 py-3 md:px-4 md:py-3.5 rounded-xl border border-border bg-background/40 backdrop-blur-sm hover:border-primary/40 hover:bg-background/70 transition-all"
              >
                <div className="shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center bg-primary/8 text-primary">
                  <Icon className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-[12px] md:text-[13px] font-semibold text-foreground leading-tight truncate">
                    {ind.label}
                  </div>
                  <div className="text-[10px] md:text-[11px] text-muted-foreground leading-tight truncate">
                    {ind.sub}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-5 text-center text-[12px] md:text-[13px] text-muted-foreground">
          Trusted by <span className="font-semibold text-foreground">Heads of AI</span>,{" "}
          <span className="font-semibold text-foreground">CFOs</span>,{" "}
          <span className="font-semibold text-foreground">Function Owners</span>, and{" "}
          <span className="font-semibold text-foreground">Platform Leads</span>.
        </p>
      </motion.div>

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
