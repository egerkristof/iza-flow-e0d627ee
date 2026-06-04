import { StandardLayerDiagram } from "@/components/marketing/shared/StandardLayerDiagram";

/**
 * Mock-only preview route. 1:1 logical adaptation of Regen AI's
 * "Decision Layer" infographic in LIZA's vocabulary and tokens.
 * Visit /mock/layer.
 */
export default function MockLayerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block text-[10px] font-black tracking-[0.22em] uppercase text-muted-foreground">
            Mock . Decision Layer diagram
          </span>
        </div>
        <StandardLayerDiagram />
        <p className="text-center text-xs text-muted-foreground mt-8">
          Mock preview . not wired into /factory, /investor or /os yet.
        </p>
      </div>
    </div>
  );
}