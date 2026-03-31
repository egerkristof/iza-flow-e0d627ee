import { Upload, FileText, Users } from "lucide-react";

const MOMENTS = [
  {
    icon: <Upload className="w-4 h-4" />,
    step: "Upload a document",
    result: "LIZA extracts structured playbooks, decision logic, and compliance rules — automatically.",
  },
  {
    icon: <FileText className="w-4 h-4" />,
    step: "Your team opens a workbook",
    result: "Your standards are already there. Governance is built in. No copy-pasting, no guessing.",
  },
  {
    icon: <Users className="w-4 h-4" />,
    step: "Someone discovers a better approach",
    result: "It feeds back into the shared capability. The whole team levels up — without a meeting.",
  },
];

export function ProductMomentStrip() {
  return (
    <section className="py-16 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-8">
          What it feels like on Monday morning
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
