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

export function BundleGap({
  gaps,
}: {
  gaps: { type: BundleTypeId; status: BundleStatus; why: string }[];
}) {
  const byType = Object.fromEntries(gaps.map((g) => [g.type, g])) as Record<
    BundleTypeId,
    { type: BundleTypeId; status: BundleStatus; why: string }
  >;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {BUNDLE_TYPES.map((b, i) => {
        const g = byType[b.id] ?? { status: "missing" as BundleStatus, why: "Not in place." };
        const color = STATUS_COLOR[g.status];
        const Icon = STATUS_ICON[g.status];
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
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-bold">{b.label}</p>
              <span
                className="inline-flex items-center justify-center w-5 h-5 rounded-full"
                style={{ background: `hsl(${color} / 0.18)`, color: `hsl(${color})` }}
              >
                <Icon className="w-3 h-3" strokeWidth={3} />
              </span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              {b.role}
            </p>
            <p className="text-[11px] leading-snug text-muted-foreground">{g.why || b.what}</p>
          </motion.div>
        );
      })}
    </div>
  );
}