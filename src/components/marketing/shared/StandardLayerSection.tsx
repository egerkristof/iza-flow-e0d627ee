import { StandardLayerDiagram } from "./StandardLayerDiagram";
import { SectionTag, GradientText } from "@/components/marketing/home/shared";

/**
 * Canonical "category" section. Drop into any marketing page above the fold
 * (or as the first explainer below the hero) so every surface tells the same
 * one-sentence story: Reality → AI Layer → [The Standard Layer] → Execution → Outcomes.
 *
 * Do NOT remix per page. The whole point is repetition.
 */
export function StandardLayerSection({
  eyebrow = "The category",
  headline = "The missing layer",
  subhead = "Between every AI output and every real-world action sits the standard your org runs on. Make it explicit, version it, and every model in your stack inherits it.",
}: {
  eyebrow?: string;
  headline?: string;
  subhead?: string;
}) {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
          <SectionTag label={eyebrow} />
          <h2 className="text-3xl md:text-5xl font-black leading-[1.06] tracking-tight">
            <GradientText>{headline}</GradientText>
          </h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            {subhead}
          </p>
        </div>
        <StandardLayerDiagram />
      </div>
    </section>
  );
}
