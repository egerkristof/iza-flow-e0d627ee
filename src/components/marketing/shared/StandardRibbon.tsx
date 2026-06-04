import { motion } from "framer-motion";
import { Globe2, Radio, ShieldCheck, Zap, Trophy } from "lucide-react";

/**
 * StandardRibbon — one-glance hero diagram.
 *
 * 5 blocks, left to right. Four are dim (commodity layers everyone has).
 * One is lit (The Standard — the missing piece LIZA provides).
 *
 * Inspired by the "missing layer" diagram convention: read it like a sentence,
 * eye lands on the lit block, gap is felt before product is named.
 */

type Block = {
  id: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
  lit?: boolean;
};

const BLOCKS: Block[] = [
  {
    id: "reality",
    label: "Reality",
    sub: "Your records, systems, documents. The world as it is.",
    icon: <Globe2 className="w-4 h-4" />,
  },
  {
    id: "signal",
    label: "Signal",
    sub: "What Copilot, Claude and RAG surface from it.",
    icon: <Radio className="w-4 h-4" />,
  },
  {
    id: "standard",
    label: "The Standard",
    sub: "How your company decides. The rule signal must pass through.",
    icon: <ShieldCheck className="w-4 h-4" />,
    lit: true,
  },
  {
    id: "action",
    label: "Action",
    sub: "The work that gets done. Drafts, approvals, deliverables.",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "result",
    label: "Result",
    sub: "Outcomes your board and regulator can defend.",
    icon: <Trophy className="w-4 h-4" />,
  },
];

export function StandardRibbon() {
  return (
    <div
      className="relative w-full rounded-2xl border p-6 md:p-10"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
      }}
    >
      {/* subtle dotted grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none rounded-2xl"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Top eyebrow */}
      <div className="relative flex items-center justify-between mb-6 md:mb-8">
        <span className="text-[10px] font-black tracking-[0.22em] uppercase text-muted-foreground">
          The stack
        </span>
        <span className="text-[10px] font-black tracking-[0.22em] uppercase text-muted-foreground">
          Four words everyone knows. One layer nobody built.
        </span>
      </div>

      {/* Ribbon */}
      <div className="relative grid grid-cols-5 gap-2 md:gap-3 items-stretch">
        {BLOCKS.map((b, i) => (
          <BlockCard key={b.id} block={b} index={i} />
        ))}

        {/* Connector line behind blocks */}
        <div
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(90deg, hsl(var(--muted-foreground)/0.3) 0 4px, transparent 4px 8px)",
            zIndex: 0,
          }}
        />
      </div>

      {/* Caption under the lit block */}
      <div className="relative grid grid-cols-5 gap-2 md:gap-3 mt-6">
        <div className="col-span-2" />
        <div className="col-span-1 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-center"
          >
            <div
              className="inline-block w-px h-4 mb-1"
              style={{ background: "hsl(var(--primary))" }}
            />
            <p className="text-[11px] font-black tracking-[0.18em] uppercase" style={{ color: "hsl(var(--primary))" }}>
              Liza
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[140px] mx-auto leading-snug">
              The only layer you don't already own
            </p>
          </motion.div>
        </div>
        <div className="col-span-2" />
      </div>
    </div>
  );
}

function BlockCard({ block, index }: { block: Block; index: number }) {
  const lit = !!block.lit;
  const accent = "hsl(var(--primary))";
  const dimFg = "hsl(var(--muted-foreground))";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 * index, ease: "easeOut" }}
      className="relative rounded-xl border flex flex-col items-center text-center px-2 md:px-3 py-4 md:py-5 z-10"
      style={
        lit
          ? {
              background: "hsl(var(--background))",
              borderColor: accent,
              boxShadow:
                "0 0 0 1px hsl(var(--primary) / 0.4), 0 24px 60px -20px hsl(var(--primary) / 0.55), 0 0 40px -8px hsl(var(--primary) / 0.35)",
            }
          : {
              background: "hsl(var(--muted) / 0.4)",
              borderColor: "hsl(var(--border))",
              opacity: 0.55,
            }
      }
    >
      {/* pulse halo for lit block */}
      {lit && (
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ border: `1px solid ${accent}` }}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      <span
        className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
        style={{
          background: lit ? `${accent}1a` : "hsl(var(--background))",
          color: lit ? accent : dimFg,
          border: `1px solid ${lit ? accent + "44" : "hsl(var(--border))"}`,
        }}
      >
        {block.icon}
      </span>

      <p
        className="text-[11px] md:text-sm font-black leading-tight"
        style={{ color: lit ? "hsl(var(--foreground))" : dimFg }}
      >
        {block.label}
      </p>
      <p
        className="text-[10px] md:text-[11px] leading-snug mt-1 max-w-[140px]"
        style={{ color: lit ? "hsl(var(--muted-foreground))" : dimFg, opacity: lit ? 1 : 0.85 }}
      >
        {block.sub}
      </p>

      {lit && (
        <span
          className="mt-2 text-[9px] font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
          style={{ background: accent, color: "hsl(var(--primary-foreground))" }}
        >
          The gap
        </span>
      )}
    </motion.div>
  );
}
