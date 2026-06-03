import { Link } from "react-router-dom";
import { ArrowRight, FlaskConical, Banknote, Building2, ShieldCheck, Rocket, Cpu, Zap, Briefcase, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { CAL_URL } from "./shared";

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

/* ── Fast-moving / transactional teams ── */
const FAST_MOVING = [
  { icon: Briefcase, label: "Consulting & Professional Services", sub: "Delivery lifecycle" },
  { icon: Zap, label: "SaaS & Digital Business", sub: "Product lifecycle" },
  { icon: TrendingUp, label: "Sales & GTM", sub: "Revenue lifecycle" },
  { icon: Cpu, label: "Enterprise IT & AI", sub: "Delivery lifecycle" },
];

/* ── Regulated / high-stakes lifecycles ── */
const REGULATED = [
  { icon: FlaskConical, label: "Pharma & Life Sciences", sub: "GxP lifecycle" },
  { icon: Building2, label: "AEC", sub: "Project lifecycle" },
  { icon: Banknote, label: "Financial Services", sub: "Risk & compliance" },
  { icon: ShieldCheck, label: "Regulated Manufacturing", sub: "Quality lifecycle" },
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
        <motion.p
          className="text-[11px] md:text-xs font-bold tracking-[0.22em] uppercase mb-5 text-primary"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          For the person in charge of AI rollout
        </motion.p>
        <motion.h1
          className="text-3xl md:text-5xl lg:text-[3.5rem] font-black mb-5 leading-[1.08] tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your org went all-in on AI.
          <br />
          <span className="text-primary">Now stand behind every output.</span>
        </motion.h1>

        <motion.p
          className="text-base md:text-lg mb-9 text-muted-foreground max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          LIZA is how you roll out AI as a system, not a thousand
          disconnected chats. Every token, every output, every workflow
          tied to a standard you own.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
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
            Book a call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            to="/diagnostic"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Score your AI execution <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

      </div>

      {/* ── Industry coverage (slim) ── */}
      <motion.div
        className="relative z-10 mt-2 w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
      >
        <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold mb-4 text-center">
          Built for fast-moving and regulated teams alike
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-2.5">
          {[...FAST_MOVING, ...REGULATED].map((ind, i) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={ind.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.5 + i * 0.04 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background/50 backdrop-blur-sm hover:border-primary/40 transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                <span className="text-[11px] md:text-[12px] font-medium text-foreground">
                  {ind.label}
                </span>
              </motion.div>
            );
          })}
        </div>
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
