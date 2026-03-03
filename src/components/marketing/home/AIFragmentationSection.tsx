import { SectionTag } from "./shared";
import { AlertTriangle } from "lucide-react";

const TOOLS = [
  {
    name: "ChatGPT",
    feature: "Memory",
    fail: "Learns your preferences. Your colleague's Memory has completely different learnings. No merge, no team view.",
  },
  {
    name: "Claude",
    feature: "Projects",
    fail: "You share docs into a project. Your teammate creates their own with different docs. Two parallel realities.",
  },
  {
    name: "Gemini",
    feature: "Gems",
    fail: "Custom AI personas per person. Great for individual workflows. Zero awareness of what the team knows.",
  },
  {
    name: "Copilot",
    feature: "Notebooks",
    fail: "Personal reasoning spaces. Insights stay in one person's notebook. Nobody else benefits.",
  },
];

export function AIFragmentationSection() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <SectionTag label="The real problem" icon={<AlertTriangle className="w-3 h-3" />} />
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Five people. Five separate AIs.
            <br />
            <span className="text-muted-foreground font-bold">Five different versions of your methodology.</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Every AI tool now offers "memory" or "projects." They're brilliant — for one person. Here's what they don't tell you:
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {TOOLS.map((t) => (
            <div
              key={t.name}
              className="rounded-xl border p-5 transition-all"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
            >
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-black text-base">{t.name}</span>
                <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">{t.feature}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.fail}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-sm font-semibold text-muted-foreground max-w-lg mx-auto">
          The result? You asked two people to draft the same proposal and got completely different approaches. The client noticed.
        </p>
      </div>
    </section>
  );
}