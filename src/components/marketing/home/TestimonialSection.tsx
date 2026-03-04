import { Quote } from "lucide-react";

export function TestimonialSection() {
  return (
    <section className="py-16 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-2xl mx-auto text-center">
        <Quote className="w-8 h-8 mx-auto mb-4" style={{ color: "hsl(var(--primary) / 0.3)" }} />
        <blockquote className="text-lg md:text-xl font-medium italic leading-relaxed mb-5">
          "This is the tool I use instead of Perplexity because it actually builds knowledge at the team level."
        </blockquote>
        <div className="flex items-center justify-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
            }}
          >
            SP
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">VP of Product Management</p>
            <p className="text-xs text-muted-foreground">Enterprise Software · 15+ years in Product</p>
          </div>
        </div>
      </div>
    </section>
  );
}
