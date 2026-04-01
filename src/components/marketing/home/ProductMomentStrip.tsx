import { Upload, FileText, Users } from "lucide-react";

const MOMENTS = [
  {
    icon: <Upload className="w-4 h-4" />,
    step: "1. Upload and capture",
    result: "Upload your playbooks, best practices, and decision logic. LIZA converts them into executable knowledge for your human-AI environment, fast and guided.",
  },
  {
    icon: <FileText className="w-4 h-4" />,
    step: "2. Execute at AI speed, safely",
    result: "When anyone works with AI, your standards are already built in. Full speed, full governance. No drift, no risk.",
  },
  {
    icon: <Users className="w-4 h-4" />,
    step: "3. Learn and compound",
    result: "Every discovery feeds back into shared standards. Knowledge compounds across the team, permanently.",
  },
];

export function ProductMomentStrip() {
  return (
    <section className="py-16 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-8">
          What executable knowledge looks like in practice
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