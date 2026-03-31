import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Building2, Rocket,
  UserPlus, Target, Handshake, MessageSquare, ShieldCheck, FileText,
  Sparkles, Briefcase, Microscope, ChevronRight
} from "lucide-react";
import { SectionTag, CAL_URL } from "./shared";

/* ── Capability atoms ─────────────────────────────────────────── */

interface Capability {
  id: string;
  icon: React.ReactNode;
  label: string;
  shortDesc: string;
  color: string;
}

const ALL_CAPABILITIES: Capability[] = [
  { id: "onboarding", icon: <UserPlus className="w-4 h-4" />, label: "Onboarding Playbooks", shortDesc: "New hires execute at senior level from day one.", color: "200 75% 48%" },
  { id: "sales", icon: <Target className="w-4 h-4" />, label: "Sales Playbooks", shortDesc: "Same winning methodology, every rep, every deal.", color: "155 65% 42%" },
  { id: "account", icon: <Handshake className="w-4 h-4" />, label: "Account Management", shortDesc: "Consistent client delivery without senior oversight.", color: "42 85% 50%" },
  { id: "marketing", icon: <Sparkles className="w-4 h-4" />, label: "Marketing Playbooks", shortDesc: "Brand voice enforced across every piece of content.", color: "280 60% 55%" },
  { id: "meetings", icon: <MessageSquare className="w-4 h-4" />, label: "Meeting Intelligence", shortDesc: "Structured prep, live context, automated follow-through.", color: "340 65% 50%" },
  { id: "audit", icon: <ShieldCheck className="w-4 h-4" />, label: "Security Audit Engine", shortDesc: "Framework compliance checked in hours, not weeks.", color: "12 75% 55%" },
  { id: "briefs", icon: <FileText className="w-4 h-4" />, label: "Smart Briefs", shortDesc: "AI-generated briefs grounded in your team's actual context.", color: "200 45% 55%" },
  { id: "services", icon: <Briefcase className="w-4 h-4" />, label: "Services Delivery", shortDesc: "Repeatable delivery playbooks that compound across engagements.", color: "155 45% 35%" },
];

const capMap = new Map(ALL_CAPABILITIES.map(c => [c.id, c]));

/* ── Lifecycle chains ─────────────────────────────────────────── */

interface LifecycleChain {
  key: string;
  label: string;
  icon: React.ReactNode;
  subtitle: string;
  chain: string[];
  lizaValue: string;
}

const LIFECYCLE_CHAINS: LifecycleChain[] = [
  {
    key: "consulting",
    label: "Professional Services",
    icon: <Briefcase className="w-4 h-4" />,
    subtitle: "From engagement kick-off to compounding delivery",
    chain: ["onboarding", "briefs", "meetings", "services", "account", "marketing"],
    lizaValue: "Every engagement compounds — what you learn on one project raises the bar for the next.",
  },
  {
    key: "saas",
    label: "SaaS Revenue Engine",
    icon: <Rocket className="w-4 h-4" />,
    subtitle: "From first touch to expansion",
    chain: ["marketing", "sales", "onboarding", "meetings", "account", "briefs"],
    lizaValue: "Your sales methodology and product knowledge flow seamlessly from marketing to CS.",
  },
  {
    key: "regulated",
    label: "Regulated Lifecycles",
    icon: <Microscope className="w-4 h-4" />,
    subtitle: "From R&D to compliant release",
    chain: ["audit", "briefs", "services", "meetings", "onboarding", "account"],
    lizaValue: "Turn compliance documentation into executable, auditable workflows.",
  },
  {
    key: "enterprise",
    label: "Enterprise Operations",
    icon: <Building2 className="w-4 h-4" />,
    subtitle: "Cross-functional governance at scale",
    chain: ["onboarding", "sales", "account", "services", "audit", "marketing", "meetings", "briefs"],
    lizaValue: "One management layer across every team, every lifecycle, every geography.",
  },
];

const CYCLE_INTERVAL = 5000;

/* ── Component ────────────────────────────────────────────────── */

export function CapabilitiesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Track which step in the chain is currently "lit" for sequential animation
  const [activeStep, setActiveStep] = useState(-1);

  const activeLifecycle = LIFECYCLE_CHAINS[activeIndex];
  const highlighted = new Set(activeLifecycle.chain);

  // Auto-cycle through lifecycles
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % LIFECYCLE_CHAINS.length);
      setActiveStep(-1);
    }, CYCLE_INTERVAL);
    return () => clearInterval(timer);
  }, [paused]);

  // Sequential step animation within a lifecycle
  useEffect(() => {
    setActiveStep(-1);
    const chain = LIFECYCLE_CHAINS[activeIndex].chain;
    const stepTimers: ReturnType<typeof setTimeout>[] = [];
    chain.forEach((_, i) => {
      stepTimers.push(setTimeout(() => setActiveStep(i), 300 + i * 400));
    });
    return () => stepTimers.forEach(clearTimeout);
  }, [activeIndex]);

  const selectChain = useCallback((index: number) => {
    setActiveIndex(index);
    setPaused(true);
    setActiveStep(-1);
    // Resume auto-cycle after 12s of inactivity
    const resume = setTimeout(() => setPaused(false), 12000);
    return () => clearTimeout(resume);
  }, []);

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <SectionTag label="Capabilities" />
          <h2 className="text-2xl md:text-3xl font-black mb-3 text-foreground">
            Your expertise becomes infrastructure.
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            If your team has domain expertise, LIZA turns it into a governed, compounding capability.
            These building blocks chain into full end-to-end lifecycles — automatically.
          </p>
        </div>

        {/* ── Capability grid — always visible, highlights follow lifecycle ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {ALL_CAPABILITIES.map((c) => {
            const isLit = highlighted.has(c.id);
            const stepIdx = activeLifecycle.chain.indexOf(c.id);
            const isRevealed = isLit && stepIdx <= activeStep;

            return (
              <motion.div
                key={c.id}
                className="rounded-xl border p-4 transition-colors duration-300"
                animate={{
                  opacity: isLit ? 1 : 0.3,
                  scale: isRevealed ? 1.03 : 1,
                  borderColor: isRevealed
                    ? `hsl(${c.color} / 0.5)`
                    : "hsl(var(--border))",
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                  background: isRevealed
                    ? `hsl(${c.color} / 0.06)`
                    : "hsl(var(--card))",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-colors duration-300"
                  style={{
                    background: `hsl(${c.color} / ${isRevealed ? 0.15 : 0.08})`,
                    color: `hsl(${c.color} / ${isRevealed ? 1 : 0.5})`,
                  }}
                >
                  {c.icon}
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">{c.label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{c.shortDesc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Lifecycle showcase — auto-cycles ── */}
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}
        >
          {/* Lifecycle tabs with progress indicator */}
          <div className="flex items-center gap-1 mb-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-auto">
              End-to-end lifecycles
            </p>
            <button
              onClick={() => setPaused(p => !p)}
              className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors px-2 py-1 rounded"
            >
              {paused ? "▶ Resume" : "❚❚ Pause"}
            </button>
          </div>

          <div className="grid sm:grid-cols-4 gap-2 mb-4">
            {LIFECYCLE_CHAINS.map((lc, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={lc.key}
                  onClick={() => selectChain(i)}
                  className="relative flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all text-xs font-semibold overflow-hidden"
                  style={
                    isActive
                      ? {
                          background: "hsl(var(--primary) / 0.1)",
                          color: "hsl(var(--primary))",
                          border: "1px solid hsl(var(--primary) / 0.25)",
                        }
                      : {
                          background: "transparent",
                          color: "hsl(var(--muted-foreground))",
                          border: "1px solid hsl(var(--border))",
                        }
                  }
                >
                  {/* Auto-cycle progress bar */}
                  {isActive && !paused && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] rounded-full"
                      style={{ background: "hsl(var(--primary))" }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: CYCLE_INTERVAL / 1000, ease: "linear" }}
                      key={`progress-${activeIndex}`}
                    />
                  )}
                  {lc.icon}
                  <div>
                    <span className="block">{lc.label}</span>
                    <span className="block font-normal text-[10px] opacity-70">{lc.subtitle}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Animated chain flow */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLifecycle.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="pt-4 border-t"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {/* Chain flow — nodes light up sequentially */}
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {activeLifecycle.chain.map((id, i) => {
                  const cap = capMap.get(id);
                  if (!cap) return null;
                  const isRevealed = i <= activeStep;
                  return (
                    <motion.span
                      key={id}
                      className="inline-flex items-center gap-1"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: isRevealed ? 1 : 0.3,
                        scale: isRevealed ? 1 : 0.9,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-300"
                        style={{
                          background: isRevealed
                            ? `hsl(${cap.color} / 0.12)`
                            : `hsl(${cap.color} / 0.04)`,
                          color: isRevealed
                            ? `hsl(${cap.color})`
                            : `hsl(${cap.color} / 0.4)`,
                          border: `1px solid hsl(${cap.color} / ${isRevealed ? 0.25 : 0.1})`,
                        }}
                      >
                        {cap.icon}
                        {cap.label}
                      </span>
                      {i < activeLifecycle.chain.length - 1 && (
                        <ChevronRight
                          className="w-3 h-3 transition-colors duration-300"
                          style={{
                            color: isRevealed
                              ? "hsl(var(--muted-foreground))"
                              : "hsl(var(--muted-foreground) / 0.2)",
                          }}
                        />
                      )}
                    </motion.span>
                  );
                })}
              </div>

              {/* LIZA value add */}
              <motion.div
                className="rounded-lg px-4 py-3 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeStep >= activeLifecycle.chain.length - 1 ? 1 : 0.4 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: "hsl(var(--primary) / 0.05)",
                  border: "1px solid hsl(var(--primary) / 0.15)",
                }}
              >
                <span className="font-bold text-primary text-xs">What LIZA adds →</span>{" "}
                <span className="text-muted-foreground text-xs">{activeLifecycle.lizaValue}</span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Two tracks CTA */}
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <Link
            to="/use-cases"
            className="flex items-center justify-between gap-3 rounded-xl border px-5 py-4 group transition-colors hover:border-primary/30"
            style={{
              borderColor: "hsl(155 65% 42% / 0.2)",
              background: "hsl(155 65% 42% / 0.03)",
            }}
          >
            <div>
              <p className="text-sm font-bold text-foreground">I want to get started now</p>
              <p className="text-xs text-muted-foreground">Pick capabilities, self-serve, grow as you go</p>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(155 65% 42%)" }} />
          </Link>

          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 rounded-xl border px-5 py-4 group transition-colors hover:border-primary/30"
            style={{
              borderColor: "hsl(200 75% 48% / 0.2)",
              background: "hsl(200 75% 48% / 0.03)",
            }}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-4 h-4 shrink-0" style={{ color: "hsl(200 75% 48%)" }} />
              <div>
                <p className="text-sm font-bold text-foreground">I need end-to-end deployment</p>
                <p className="text-xs text-muted-foreground">Assessment, change management, lifecycle rollout</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" style={{ color: "hsl(200 75% 48%)" }} />
          </a>
        </div>
      </div>
    </section>
  );
}
