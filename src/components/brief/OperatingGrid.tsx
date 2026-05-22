import { motion } from "framer-motion";
import { Target, Layers, Zap, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";

export type GridStatus = "missing" | "partial" | "working";

export type GridState = {
  goal: string;
  tools: string[];
  intent: { status: GridStatus; why: string };
  knowledge: { status: GridStatus; why: string };
  execution: { status: GridStatus; why: string };
};

const STATUS_STYLES: Record<GridStatus, { ring: string; chip: string; label: string; Icon: typeof AlertTriangle }> = {
  missing: {
    ring: "hsl(0 72% 50%)",
    chip: "hsl(0 72% 50% / 0.12)",
    label: "Missing",
    Icon: AlertTriangle,
  },
  partial: {
    ring: "hsl(38 92% 50%)",
    chip: "hsl(38 92% 50% / 0.12)",
    label: "Partial",
    Icon: AlertCircle,
  },
  working: {
    ring: "hsl(155 72% 38%)",
    chip: "hsl(155 72% 38% / 0.12)",
    label: "Working",
    Icon: CheckCircle2,
  },
};

function Layer({
  index,
  Icon,
  label,
  sub,
  status,
  why,
  children,
}: {
  index: number;
  Icon: typeof Target;
  label: string;
  sub: string;
  status: GridStatus;
  why: string;
  children?: React.ReactNode;
}) {
  const s = STATUS_STYLES[status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.45, ease: "easeOut" }}
      className="relative rounded-2xl border p-5 md:p-6"
      style={{
        background: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        boxShadow: `inset 4px 0 0 0 ${s.ring}`,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: s.chip, color: s.ring }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold tracking-tight">{label}</h3>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full"
              style={{ background: s.chip, color: s.ring }}
            >
              <s.Icon className="w-3 h-3 inline mr-1 -mt-0.5" />
              {s.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          <p className="text-sm mt-3 leading-relaxed">{why}</p>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

export function OperatingGrid({ state }: { state: GridState }) {
  return (
    <div className="space-y-3">
      <Layer
        index={0}
        Icon={Target}
        label="Intent"
        sub="What you are trying to achieve"
        status={state.intent.status}
        why={state.intent.why}
      >
        {state.goal ? (
          <div
            className="mt-3 text-sm italic px-3 py-2 rounded-lg border-l-2"
            style={{
              background: "hsl(var(--muted) / 0.4)",
              borderColor: "hsl(var(--primary))",
            }}
          >
            "{state.goal}"
          </div>
        ) : null}
      </Layer>

      <div className="flex justify-center">
        <div className="w-px h-4" style={{ background: "hsl(var(--border))" }} />
      </div>

      <Layer
        index={1}
        Icon={Layers}
        label="Knowledge layer"
        sub="The executable context every AI surface inherits"
        status={state.knowledge.status}
        why={state.knowledge.why}
      />

      <div className="flex justify-center">
        <div className="w-px h-4" style={{ background: "hsl(var(--border))" }} />
      </div>

      <Layer
        index={2}
        Icon={Zap}
        label="Execution"
        sub="The tools and agents doing the work in the moment"
        status={state.execution.status}
        why={state.execution.why}
      >
        {state.tools.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {state.tools.map((t) => (
              <span
                key={t}
                className="text-[11px] font-medium px-2 py-1 rounded-md"
                style={{
                  background: "hsl(var(--muted))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </Layer>
    </div>
  );
}