import { motion } from "framer-motion";
import { BUNDLE_TYPES, type BundleStatus, type BundleTypeId } from "@/lib/operator-framework";
import { Check, Minus, X } from "lucide-react";

const STATUS_COLOR: Record<BundleStatus, string> = {
  have: "155 72% 46%",
  partial: "38 92% 50%",
  missing: "0 70% 55%",
};

const STATUS_ICON: Record<BundleStatus, typeof Check> = {
  have: Check,
  partial: Minus,
  missing: X,
};

const STATUS_LABEL: Record<BundleStatus, string> = {
  have: "In place",
  partial: "Partial",
  missing: "Missing",
};

export function BundleGap({
  gaps,
  examples,
}: {
  gaps: { type: BundleTypeId; status: BundleStatus; why: string }[];
  examples?: Record<BundleTypeId, string>;
}) {
  const byType = Object.fromEntries(gaps.map((g) => [g.type, g])) as Record<
    BundleTypeId,
    { type: BundleTypeId; status: BundleStatus; why: string }
  >;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {BUNDLE_TYPES.map((b, i) => {
        const g = byType[b.id] ?? { status: "missing" as BundleStatus, why: "Not in place." };
        const color = STATUS_COLOR[g.status];
        const Icon = STATUS_ICON[g.status];
        const example = examples?.[b.id];
        return (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i }}
            className="rounded-xl border p-4"
            style={{
              background: "hsl(var(--card))",
              borderColor: `hsl(${color} / 0.4)`,
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {b.label}
                </p>
                <p className="text-sm font-bold leading-snug mt-0.5">{b.role}</p>
              </div>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0"
                style={{ background: `hsl(${color} / 0.15)`, color: `hsl(${color})` }}
              >
                <Icon className="w-2.5 h-2.5" strokeWidth={3} />
                {STATUS_LABEL[g.status]}
              </span>
            </div>
            {example && (
              <p className="text-[11px] leading-snug text-foreground/80 mb-1.5">{example}</p>
            )}
            <p
              className="text-[11px] leading-snug pt-1.5 mt-1.5 border-t"
              style={{
                borderColor: "hsl(var(--border))",
                color: g.status === "missing" ? `hsl(${color})` : "hsl(var(--muted-foreground))",
              }}
            >
              {g.status === "missing" ? "Without it: " : "Note: "}
              <span className="text-muted-foreground">{g.why || b.what}</span>
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}