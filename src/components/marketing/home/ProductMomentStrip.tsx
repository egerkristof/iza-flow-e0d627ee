import { Upload, FileText, Users } from "lucide-react";

const MOMENTS = [
  {
    icon: <Upload className="w-4 h-4" />,
    step: "1. Define your standards",
    result: "Capture playbooks, best practices, and decision logic from your best people — so the organization never loses what works.",
  },
  {
    icon: <FileText className="w-4 h-4" />,
    step: "2. Your team executes with them built in",
    result: "When anyone opens a workbook, your standards are already there. No copy-pasting, no guessing, no drift.",
  },
  {
    icon: <Users className="w-4 h-4" />,
    step: "3. Everyone learns, the system improves",
    result: "When someone discovers a better way, it feeds back into the shared standard. The whole team levels up — without a meeting.",
  },
];

export function ProductMomentStrip() {
  return (
    <section className="py-16 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-8">
          What this looks like on Monday morning
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {MOMENTS.map((m, i) => (
            <div key={i} className="text-center md:text-left">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 mx-auto md:mx-0"
                style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
              >
                {m.icon}
              </div>
              <p className="text-sm font-bold text-foreground mb-1">{m.step}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{m.result}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}