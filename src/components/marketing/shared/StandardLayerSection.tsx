import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { StandardLayerDiagram } from "./StandardLayerDiagram";
import { SectionTag, GradientText } from "@/components/marketing/home/shared";

/**
 * Canonical "category" section. Drop into any marketing page above the fold
 * (or as the first explainer below the hero) so every surface tells the same
 * one-sentence story: Reality → AI Layer → [The Decision Layer] → Execution → Outcomes.
 *
 * Do NOT remix per page. The whole point is repetition.
 */
export function StandardLayerSection({
  eyebrow = "The category",
  headline = "The missing layer",
  subhead = "Between every AI output and every real-world action sits the standard your org runs on. Make it explicit, version it, and every model in your stack inherits it.",
  collapsible = false,
}: {
  eyebrow?: string;
  headline?: string;
  subhead?: string;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(!collapsible);

  if (collapsible) {
    return (
      <section className="py-10 md:py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-4 rounded-xl border bg-card px-5 py-4 text-left transition-colors hover:border-primary/40"
            style={{ borderColor: "hsl(var(--border))" }}
            aria-expanded={open}
          >
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-primary mb-1">
                {eyebrow}
              </p>
              <p className="text-base md:text-lg font-bold text-foreground">
                Want to see the category map? {headline}.
              </p>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
          {open && (
            <div className="mt-8">
              <div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-black leading-[1.06] tracking-tight">
                  <GradientText>{headline}</GradientText>
                </h2>
                <p className="mt-4 text-base md:text-lg text-muted-foreground">{subhead}</p>
              </div>
              <StandardLayerDiagram />
            </div>
          )}
        </div>
      </section>
    );
  }

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
