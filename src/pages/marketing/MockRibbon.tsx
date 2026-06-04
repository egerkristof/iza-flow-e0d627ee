import { StandardRibbon } from "@/components/marketing/shared/StandardRibbon";

/**
 * Mock-only preview route for the StandardRibbon hero diagram.
 * Visit /mock/ribbon to review before promoting into /factory.
 */
export default function MockRibbonPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-[10px] font-black tracking-[0.22em] uppercase text-muted-foreground mb-4">
            Mock · Factory hero diagram
          </span>
          <h1 className="text-3xl md:text-5xl font-black leading-[1.05] tracking-tight max-w-3xl mx-auto">
            Records. AI. Work. Outcomes.{" "}
            <span style={{ color: "hsl(var(--primary))" }}>
              The Standard is the layer nobody built.
            </span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto">
            Read it left to right. Four blocks you already own. One block we install.
          </p>
        </div>

        <StandardRibbon />

        <p className="text-center text-xs text-muted-foreground mt-8">
          Mock preview · not wired into /factory yet.
        </p>
      </div>
    </div>
  );
}
