import { SectionTag } from "./shared";
import { AlertTriangle } from "lucide-react";

const BEATS = [
  "Your AI tools don't talk to each other. Every person on your team trains their own ChatGPT, their own Claude — and none of it connects.",
  "You've become the bottleneck. The one who repeats context in every meeting, every onboarding, every handoff. You carry the system in your head.",
  "When someone leaves, everything they learned leaves with them. Years of judgment, pattern recognition, hard-won intuition — gone overnight.",
];

export function AIFragmentationSection() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="The problem" icon={<AlertTriangle className="w-3 h-3" />} />
          <h2 className="text-3xl font-black">
            Everyone has AI.{" "}
            <span className="text-muted-foreground">Nobody shares context.</span>
          </h2>
        </div>

        <div className="space-y-6">
          {BEATS.map((text, i) => (
            <p
              key={i}
              className="text-base md:text-lg leading-relaxed"
              style={{
                color: i === BEATS.length - 1
                  ? "hsl(var(--foreground))"
                  : "hsl(var(--muted-foreground))",
                fontWeight: i === BEATS.length - 1 ? 600 : 400,
              }}
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
