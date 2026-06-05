import { ScrollReveal } from "@/components/marketing/ScrollReveal";

/**
 * Editorial pull-quote section.
 * Inspired by Ogilvy's principle: the less it looks like an ad, the more people read it.
 * Treats a single statement as op-ed typography on a quiet page.
 */
export function EditorialQuote() {
  return (
    <section className="relative bg-background py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <ScrollReveal>
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="h-px w-10 bg-foreground/20" />
            <span className="text-[10px] md:text-[11px] font-bold tracking-[0.28em] uppercase text-foreground/50">
              Field Note
            </span>
            <div className="h-px w-10 bg-foreground/20" />
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <blockquote
            className="font-serif text-[1.75rem] md:text-[2.4rem] leading-[1.25] tracking-[-0.01em] text-foreground"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Whatever you do not define, AI invents.
            <br className="hidden md:block" />
            <span className="text-foreground/60">
              {" "}The Context Gap is not a model problem. It is a management problem.
            </span>
          </blockquote>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-10 space-y-1">
            <p className="text-sm font-semibold text-foreground tracking-wide">
              LIZA OS
            </p>
            <p
              className="text-xs italic text-foreground/50"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Findings from rollouts across regulated industries
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}