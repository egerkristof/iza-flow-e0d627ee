import { motion } from "framer-motion";
import { STREAMS, type StreamCoverage, type StreamStatus } from "@/lib/operator-framework";

const STATUS_COLOR: Record<StreamStatus, string> = {
  lit: "155 72% 46%",
  partial: "38 92% 50%",
  dark: "0 70% 55%",
};

const STATUS_LABEL: Record<StreamStatus, string> = {
  lit: "Lit",
  partial: "Partial",
  dark: "Dark",
};

function dotPosition(position: "top" | "left" | "right" | "bottom") {
  switch (position) {
    case "top":
      return { top: "4%", left: "50%", transform: "translateX(-50%)" };
    case "bottom":
      return { bottom: "4%", left: "50%", transform: "translateX(-50%)" };
    case "left":
      return { top: "50%", left: "3%", transform: "translateY(-50%)" };
    case "right":
      return { top: "50%", right: "3%", transform: "translateY(-50%)" };
  }
}

export function OperatorCompass({
  coverage,
  tools,
}: {
  coverage: StreamCoverage;
  tools: string[];
}) {
  return (
    <div
      className="relative w-full rounded-2xl border overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, hsl(var(--card)) 0%, hsl(var(--background)) 100%)",
        borderColor: "hsl(var(--border))",
        aspectRatio: "1.4 / 1",
        minHeight: 360,
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Connectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {STREAMS.map((s) => {
          const status = coverage[s.id]?.status ?? "dark";
          const color = STATUS_COLOR[status];
          const cx = "50%";
          const cy = "50%";
          const tx =
            s.position === "left" ? "10%" : s.position === "right" ? "90%" : "50%";
          const ty =
            s.position === "top" ? "12%" : s.position === "bottom" ? "88%" : "50%";
          return (
            <motion.line
              key={s.id}
              x1={cx}
              y1={cy}
              x2={tx}
              y2={ty}
              stroke={`hsl(${color})`}
              strokeWidth={status === "lit" ? 2 : 1}
              strokeDasharray={status === "dark" ? "3 4" : status === "partial" ? "6 3" : "0"}
              opacity={status === "dark" ? 0.35 : 0.75}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          );
        })}
      </svg>

      {/* Center node */}
      <div
        className="absolute z-10 rounded-2xl border-2 px-4 py-3 text-center"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "hsl(var(--background))",
          borderColor: "hsl(var(--primary))",
          boxShadow: "0 0 24px -4px hsl(var(--primary) / 0.4)",
          minWidth: 180,
        }}
      >
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-primary">
          The moment of work
        </p>
        <p className="text-sm font-bold mt-1">Audit container</p>
        {tools.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center mt-2 max-w-[200px]">
            {tools.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[10px] px-1.5 py-0.5 rounded border"
                style={{
                  background: "hsl(var(--muted))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--muted-foreground))",
                }}
              >
                {t}
              </span>
            ))}
            {tools.length > 4 && (
              <span className="text-[10px] text-muted-foreground">+{tools.length - 4}</span>
            )}
          </div>
        )}
      </div>

      {/* Stream nodes */}
      {STREAMS.map((s) => {
        const status = coverage[s.id]?.status ?? "dark";
        const why = coverage[s.id]?.why ?? "";
        const color = STATUS_COLOR[status];
        const pos = dotPosition(s.position);
        return (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute z-10 rounded-xl border px-3 py-2 max-w-[200px]"
            style={{
              ...pos,
              background: `hsl(${color} / 0.08)`,
              borderColor: `hsl(${color} / 0.5)`,
            }}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: `hsl(${color})` }}
              />
              <p className="text-xs font-bold">{s.label}</p>
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: `hsl(${color} / 0.2)`, color: `hsl(${color})` }}
              >
                {STATUS_LABEL[status]}
              </span>
            </div>
            <p className="text-[11px] leading-snug text-muted-foreground">{why || s.what}</p>
          </motion.div>
        );
      })}
    </div>
  );
}