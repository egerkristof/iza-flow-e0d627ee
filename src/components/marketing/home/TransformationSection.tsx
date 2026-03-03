import { SectionTag } from "./shared";
import { ArrowRight } from "lucide-react";

const ROWS = [
  { before: "Context lives in people's heads", after: "Context lives in the system" },
  { before: "Every meeting starts with catch-up", after: "Every session starts with full context" },
  { before: "New hires shadow for months", after: "New hires execute from day one" },
  { before: "When experts leave, knowledge disappears", after: "Expertise compounds — permanently" },
];

export function TransformationSection() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="The shift" icon={<ArrowRight className="w-3 h-3" />} />
          <h2 className="text-3xl font-black">What changes</h2>
        </div>

        <div className="space-y-4">
          {ROWS.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-xl border px-5 py-4"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
            >
              <p className="text-sm text-muted-foreground line-through decoration-1">{r.before}</p>
              <ArrowRight className="w-4 h-4 text-primary shrink-0" />
              <p className="text-sm font-semibold" style={{ color: "hsl(var(--success))" }}>{r.after}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
