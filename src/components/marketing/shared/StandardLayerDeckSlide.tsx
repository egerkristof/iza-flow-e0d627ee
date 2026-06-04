import { StandardLayerDiagram } from "./StandardLayerDiagram";

/**
 * Canonical category slide for ScaledSlide (1920x1080) decks.
 * Identical visual to the marketing-page section, embedded on a white slide
 * with a deck-style eyebrow / footnote. Do NOT remix per deck.
 */
export function StandardLayerDeckSlide({
  eyebrow = "The category · One standard. Every AI surface inherits it.",
  footnote = "Reality → AI Layer → The Standard Layer → Execution → Outcomes.",
}: {
  eyebrow?: string;
  footnote?: string;
}) {
  return (
    <div
      className="w-full h-full flex flex-col relative"
      style={{ background: "hsl(0 0% 100%)", padding: "72px 96px" }}
    >
      <p
        className="font-mono uppercase"
        style={{
          fontSize: 14,
          letterSpacing: "0.32em",
          color: "hsl(200 90% 42%)",
          marginBottom: 24,
        }}
      >
        {eyebrow}
      </p>
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div style={{ width: "100%", maxWidth: 1500 }}>
          <StandardLayerDiagram />
        </div>
      </div>
      <p
        className="text-center"
        style={{
          fontSize: 16,
          color: "hsl(215 15% 42%)",
          marginTop: 24,
        }}
      >
        {footnote}
      </p>
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 6,
          background:
            "linear-gradient(90deg, hsl(200 90% 42%), hsl(155 72% 38%))",
        }}
      />
    </div>
  );
}
