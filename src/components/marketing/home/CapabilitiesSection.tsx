import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain, Cpu, Users, ArrowDown,
  UserPlus, Target, Handshake, MessageSquare, ShieldCheck, FileText,
  Sparkles, Briefcase, Rocket, Microscope, Building2,
} from "lucide-react";
import { SectionTag } from "./shared";

/* ── Data ─────────────────────────────────────────────────────── */

const EXPERTISE_TAGS = [
  "Playbooks", "Tribal knowledge", "Compliance frameworks",
  "Decision logic", "Quality standards",
];

const CAPABILITIES = [
  { id: "onboarding", label: "Onboarding", icon: <UserPlus className="w-3 h-3" />, color: "200 75% 48%" },
  { id: "sales", label: "Sales", icon: <Target className="w-3 h-3" />, color: "155 65% 42%" },
  { id: "account", label: "Account Mgmt", icon: <Handshake className="w-3 h-3" />, color: "42 85% 50%" },
  { id: "marketing", label: "Marketing", icon: <Sparkles className="w-3 h-3" />, color: "280 60% 55%" },
  { id: "meetings", label: "Meetings", icon: <MessageSquare className="w-3 h-3" />, color: "340 65% 50%" },
  { id: "audit", label: "Compliance", icon: <ShieldCheck className="w-3 h-3" />, color: "12 75% 55%" },
  { id: "briefs", label: "Briefs", icon: <FileText className="w-3 h-3" />, color: "200 45% 55%" },
  { id: "services", label: "Delivery", icon: <Briefcase className="w-3 h-3" />, color: "155 45% 35%" },
];

const capMap = new Map(CAPABILITIES.map(c => [c.id, c]));

const LIFECYCLES = [
  { key: "consulting", label: "Professional Services", icon: <Briefcase className="w-3.5 h-3.5" />, chain: ["onboarding", "briefs", "meetings", "services", "account"] },
  { key: "saas", label: "SaaS & Tech", icon: <Rocket className="w-3.5 h-3.5" />, chain: ["marketing", "sales", "onboarding", "meetings", "account"] },
  { key: "regulated", label: "Regulated Industries", icon: <Microscope className="w-3.5 h-3.5" />, chain: ["audit", "briefs", "services", "meetings", "onboarding"] },
  { key: "enterprise", label: "Enterprise Ops", icon: <Building2 className="w-3.5 h-3.5" />, chain: ["onboarding", "sales", "account", "services", "audit", "marketing"] },
];

/* ── Animated flow connector ─────────────────────────────────── */

function FlowConnector({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1 py-3"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
    >
      <motion.div
        className="w-px h-6"
        style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.4), hsl(var(--primary) / 0.1))" }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.1, duration: 0.4 }}
      />
      <motion.div
        className="flex items-center gap-1.5"
        initial={{ opacity: 0, y: -4 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.3, duration: 0.3 }}
      >
        <ArrowDown className="w-3 h-3" style={{ color: "hsl(var(--primary) / 0.5)" }} />
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "hsl(var(--primary) / 0.6)" }}>
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ── Layer cards ──────────────────────────────────────────────── */

function LayerCard({
  index,
  icon,
  title,
  subtitle,
  children,
  isHero,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  isHero?: boolean;
}) {
  return (
    <motion.div
      className="relative rounded-2xl border overflow-hidden"
      style={{
        background: isHero
          ? "linear-gradient(135deg, hsl(var(--card)), hsl(var(--primary) / 0.03))"
          : "hsl(var(--card))",
        borderColor: isHero ? "hsl(var(--primary) / 0.2)" : "hsl(var(--border))",
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
    >
      {isHero && (
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "var(--gradient-brand, hsl(var(--primary)))" }}
        />
      )}

      <div className="px-6 py-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: isHero ? "hsl(var(--primary) / 0.12)" : "hsl(var(--muted))",
              color: isHero ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
            }}
            whileHover={{ scale: 1.05 }}
          >
            {icon}
          </motion.div>
          <div>
            <p className="text-sm font-black text-foreground">{title}</p>
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">{subtitle}</p>
          </div>
        </div>

        {children}
      </div>
    </motion.div>
  );
}

/* ── Main component ───────────────────────────────────────────── */

export function CapabilitiesSection() {
  const [hoveredLC, setHoveredLC] = useState<string | null>(null);

  const activeChain = hoveredLC
    ? new Set(LIFECYCLES.find(l => l.key === hoveredLC)?.chain ?? [])
    : null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionTag label="The missing layer" />
          <h2 className="text-2xl md:text-3xl font-black mb-3 text-foreground">
            Between what your experts know
            <br />
            <span className="brand-gradient-text">and what AI actually does.</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Executable knowledge isn't a document or a prompt. It's the structured, governed
            layer that captures expertise once, enforces it everywhere, and improves with every use.
          </p>
        </motion.div>

        {/* ── Three-layer transformation ── */}
        <div className="flex flex-col items-center">

          {/* LAYER 1: Your expertise — the hero */}
          <LayerCard
            index={0}
            isHero
            icon={<Brain className="w-5 h-5" />}
            title="It starts with what your people know"
            subtitle="Domain expertise that no AI has"
          >
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_TAGS.map((tag, i) => (
                <motion.span
                  key={tag}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium"
                  style={{
                    background: "hsl(var(--primary) / 0.07)",
                    color: "hsl(var(--primary))",
                    border: "1px solid hsl(var(--primary) / 0.15)",
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.3 }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </LayerCard>

          <FlowConnector label="encoded into" delay={0.2} />

          {/* LAYER 2: Modular capabilities */}
          <LayerCard
            index={1}
            icon={<Cpu className="w-5 h-5" />}
            title="Becomes modular, executable capabilities"
            subtitle="Executed by humans + AI together"
          >
            <div className="flex flex-wrap gap-2">
              {CAPABILITIES.map((c, i) => {
                const dimmed = activeChain && !activeChain.has(c.id);
                return (
                  <motion.span
                    key={c.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: `hsl(${c.color} / 0.08)`,
                      color: `hsl(${c.color})`,
                      border: `1px solid hsl(${c.color} / 0.15)`,
                      opacity: dimmed ? 0.15 : 1,
                      transition: "opacity 0.5s ease",
                    }}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: dimmed ? 0.15 : 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 + i * 0.04, duration: 0.3 }}
                  >
                    {c.icon}
                    {c.label}
                  </motion.span>
                );
              })}
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "hsl(var(--muted))",
                  color: "hsl(var(--muted-foreground))",
                  border: "1px dashed hsl(var(--border))",
                  opacity: activeChain ? 0.15 : 1,
                  transition: "opacity 0.5s ease",
                }}
              >
                + yours
              </span>
            </div>
          </LayerCard>

          <FlowConnector label="composed into" delay={0.35} />

          {/* LAYER 3: End-to-end lifecycles */}
          <LayerCard
            index={2}
            icon={<Users className="w-5 h-5" />}
            title="Powers governed, end-to-end lifecycles"
            subtitle="Auditable and compounding over time"
          >
            <div className="grid sm:grid-cols-2 gap-2">
              {LIFECYCLES.map(lc => {
                const isHovered = hoveredLC === lc.key;
                return (
                  <motion.div
                    key={lc.key}
                    className="flex items-start gap-3 px-4 py-3 rounded-xl cursor-default"
                    onMouseEnter={() => setHoveredLC(lc.key)}
                    onMouseLeave={() => setHoveredLC(null)}
                    style={{
                      background: isHovered ? "hsl(var(--primary) / 0.06)" : "transparent",
                      border: `1px solid ${isHovered ? "hsl(var(--primary) / 0.2)" : "hsl(var(--border) / 0.5)"}`,
                      transition: "all 0.3s ease",
                    }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: isHovered ? "hsl(var(--primary) / 0.1)" : "hsl(var(--muted))",
                        color: isHovered ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {lc.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{lc.label}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {lc.chain.map(id => {
                          const cap = capMap.get(id);
                          if (!cap) return null;
                          return (
                            <span
                              key={id}
                              className="text-[10px] px-1.5 py-0.5 rounded"
                              style={{
                                background: isHovered ? `hsl(${cap.color} / 0.1)` : "hsl(var(--muted))",
                                color: isHovered ? `hsl(${cap.color})` : "hsl(var(--muted-foreground))",
                                transition: "all 0.3s ease",
                              }}
                            >
                              {cap.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </LayerCard>
        </div>
      </div>
    </section>
  );
}
