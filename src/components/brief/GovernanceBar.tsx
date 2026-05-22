import { motion } from "framer-motion";
import { AUDITS, type AuditCoverage, type AuditStatus } from "@/lib/operator-framework";

const STATUS_COLOR: Record<AuditStatus, string> = {
  green: "155 72% 46%",
  amber: "38 92% 50%",
  red: "0 70% 55%",
};

const STATUS_LABEL: Record<AuditStatus, string> = {
  green: "In place",
  amber: "Partial",
  red: "Not in place",
};

export function GovernanceBar({ coverage }: { coverage: AuditCoverage }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
      {AUDITS.map((a, i) => {
        const status = coverage[a.id]?.status ?? "red";
        const why = coverage[a.id]?.why ?? "";
        const color = STATUS_COLOR[status];
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-xl border p-3"
            style={{
              background: `hsl(${color} / 0.05)`,
              borderColor: `hsl(${color} / 0.4)`,
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: `hsl(${color})` }}
              />
              <p className="text-[10px] font-bold uppercase tracking-wider">{a.label}</p>
            </div>
            <p
              className="text-[10px] font-bold mb-1"
              style={{ color: `hsl(${color})` }}
            >
              {STATUS_LABEL[status]}
            </p>
            <p className="text-[11px] leading-snug text-muted-foreground">{why || a.governs}</p>
          </motion.div>
        );
      })}
    </div>
  );
}