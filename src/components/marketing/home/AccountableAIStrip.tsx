import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";
import { SectionTag, GradientText, CAL_URL } from "./shared";

const UNAUDITED = [
  "Token spend you cannot explain to finance",
  "Outputs you cannot trace back to a source",
  "Work that cannot be repeated by the next person",
  "Confident answers, drifting from policy",
];

const AUDITED = [
  "Every token tied to a playbook and an owner",
  "Every output traceable to the source it came from",
  "Every workflow repeatable across the team",
  "Every answer governed by the rules you set",
];

export function AccountableAIStrip() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="Two ways this ends" />
          <h2 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tight">
            Unaudited AI. Or{" "}
            <GradientText>AI your board can read.</GradientText>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            The CFO question arrives next quarter. Either every token maps to a
            named outcome, or it does not.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 items-stretch">
          {/* Unaudited */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border p-6 md:p-7"
            style={{
              borderColor: "hsl(var(--destructive) / 0.25)",
              background: "hsl(var(--destructive) / 0.04)",
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: "hsl(var(--destructive) / 0.12)",
                  color: "hsl(var(--destructive))",
                }}
              >
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.22em] uppercase text-muted-foreground">
                  Today
                </p>
                <p className="text-lg font-bold text-foreground">Unaudited AI</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {UNAUDITED.map((l) => (
                <li key={l} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed">
                  <span
                    className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "hsl(var(--destructive) / 0.6)" }}
                  />
                  {l}
                </li>
              ))}
            </ul>
            <p className="mt-5 pt-4 border-t border-border/50 text-xs font-semibold text-muted-foreground">
              Expensive. Inconsistent. Unrepeatable.
            </p>
          </motion.div>

          {/* Audited */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-2xl border p-6 md:p-7 relative overflow-hidden"
            style={{
              borderColor: "hsl(var(--brand-green) / 0.35)",
              background: "hsl(var(--brand-green) / 0.05)",
              boxShadow: "0 0 40px -12px hsl(var(--brand-green) / 0.25)",
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: "hsl(var(--brand-green) / 0.15)",
                  color: "hsl(var(--brand-green))",
                }}
              >
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.22em] uppercase text-muted-foreground">
                  With LIZA
                </p>
                <p className="text-lg font-bold text-foreground">Audited AI</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {AUDITED.map((l) => (
                <li key={l} className="flex items-start gap-2.5 text-sm text-foreground leading-relaxed font-medium">
                  <span
                    className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "hsl(var(--brand-green))" }}
                  />
                  {l}
                </li>
              ))}
            </ul>
            <p className="mt-5 pt-4 border-t border-border/50 text-xs font-semibold" style={{ color: "hsl(var(--brand-green))" }}>
              Defensible to your CFO, your board, your regulator.
            </p>
          </motion.div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm md:text-base text-foreground/80 max-w-xl mx-auto">
            LIZA ties every output to a playbook you own.{" "}
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              Book a call <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}