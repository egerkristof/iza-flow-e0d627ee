import { motion } from "framer-motion";
import { Compass } from "lucide-react";

const PROOFS = [
  { k: "15+ yrs", v: "Building AI systems for regulated and high-stakes orgs" },
  { k: "Design partners", v: "Live in consulting, pharma, AEC, B2B scale-ups" },
  { k: "Diagnostic", v: "Run by AI leaders across hundreds of functions" },
];

export function GuideStrip() {
  return (
    <section className="py-14 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm px-7 py-7 md:px-9 md:py-8"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-start gap-4 md:flex-1">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                }}
              >
                <Compass className="w-5 h-5" />
              </div>
              <p className="text-base md:text-lg font-semibold text-foreground leading-snug">
                You were hired to make AI stick. We built the layer that lets it.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 md:gap-6 md:max-w-md md:border-l md:border-border md:pl-6">
              {PROOFS.map((p) => (
                <div key={p.k}>
                  <p className="text-[10px] font-black tracking-[0.18em] uppercase text-primary mb-1">
                    {p.k}
                  </p>
                  <p className="text-[11px] md:text-xs text-muted-foreground leading-snug">
                    {p.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}