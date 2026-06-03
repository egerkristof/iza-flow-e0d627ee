import { motion } from "framer-motion";

/**
 * Hero-foot device. Names the product mechanism in 3 nodes:
 * Token → Standard → Output. Replaces the generic floating dot scatter.
 */
const NODES = [
  { label: "Token", tone: "primary" as const },
  { label: "Standard", tone: "primary" as const },
  { label: "Output", tone: "green" as const },
];

const color = (t: "primary" | "green") =>
  t === "green" ? "hsl(var(--brand-green))" : "hsl(var(--primary))";

export function GovernanceRail() {
  return (
    <motion.div
      className="flex items-center justify-center gap-0 mt-10 mb-2"
      initial={{ opacity: 0, scaleX: 0.92 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ duration: 0.6, delay: 0.55, ease: "easeOut" }}
      aria-label="Token to Standard to Output"
    >
      {NODES.map((n, i) => (
        <div key={n.label} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5" style={{ minWidth: 76 }}>
            <motion.div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: color(n.tone), boxShadow: `0 0 10px ${color(n.tone)}` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.35, delay: 0.65 + i * 0.18 }}
            />
            <span
              className="text-[10px] font-black tracking-[0.18em] uppercase"
              style={{ color: color(n.tone) }}
            >
              {n.label}
            </span>
          </div>
          {i < NODES.length - 1 && (
            <motion.div
              className="h-[1px] w-12 sm:w-20 mx-1"
              style={{
                background:
                  "repeating-linear-gradient(90deg, hsl(var(--primary)/0.45) 0 4px, transparent 4px 8px)",
              }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.45, delay: 0.75 + i * 0.18, ease: "easeOut" }}
            />
          )}
        </div>
      ))}
    </motion.div>
  );
}
