import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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

const TRUST_STATS = [
  { value: "15+", label: "years of methodology" },
  { value: "8", label: "countries" },
  { value: "3", label: "industries validated" },
  { value: "100%", label: "knowledge portability" },
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
          No AI tool was built to
          <br />
          <span className="text-primary">define your knowledge.</span>
        </motion.h1>

        <motion.p
          className="text-base md:text-lg mb-9 text-muted-foreground max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          LIZA OS turns what your best people know into{" "}
          <span className="font-black text-foreground">executable standards</span>,{" "}
          <span className="font-black text-foreground">governed in every AI workflow</span>,{" "}
          shared across teams, and{" "}
          <span className="brand-gradient-text font-black">always yours to take with you</span>.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/diagnostic"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
            }}
          >
            Score your AI execution
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            Book a Discovery Call <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* ── Trust strip ── */}
        <motion.div
          className="flex flex-wrap justify-center gap-x-8 gap-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-1.5">
              <span
                className="text-lg md:text-xl font-black"
                style={{ color: "hsl(var(--primary))" }}
              >
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
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
