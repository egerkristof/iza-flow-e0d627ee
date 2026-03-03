import { SectionTag } from "./shared";
import { AlertTriangle } from "lucide-react";

const TOOLS = [
  { name: "ChatGPT", feature: "Memory", fail: "Personal. Your colleague learns different things." },
  { name: "Claude", feature: "Projects", fail: "Siloed. Two people, two different doc sets." },
  { name: "Gemini", feature: "Gems", fail: "Individual. Zero team awareness." },
  { name: "Copilot", feature: "Notebooks", fail: "Private. Insights stay in one person's head." },
];

export function AIFragmentationSection() {
  return (
    <section className="py-16 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto text-center">
        <SectionTag label="The problem" icon={<AlertTriangle className="w-3 h-3" />} />
        <h2 className="text-3xl font-black mb-10">
          Everyone has AI. <span className="text-muted-foreground">Nobody shares context.</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TOOLS.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border p-4 text-left"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
            >
              <p className="font-black text-sm mb-0.5">{t.name}</p>
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wide mb-2">{t.feature}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.fail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
