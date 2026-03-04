import { SectionTag } from "./shared";
import { Compass, Quote } from "lucide-react";
import istvanPhoto from "@/assets/istvan-boscha.png";
import kristofPhoto from "@/assets/kristof-eger.png";

const TEAM = [
  {
    name: "István Boscha",
    role: "Data & AI Implementation",
    photo: istvanPhoto,
    linkedin: "https://www.linkedin.com/in/istv%C3%A1n-boscha-3a436328/",
  },
  {
    name: "Kristóf Éger",
    role: "Business Model Innovation",
    photo: kristofPhoto,
    linkedin: "https://www.linkedin.com/in/kristofeger/",
  },
];

const METRICS = [
  { value: "200+", label: "Consulting engagements" },
  { value: "4", label: "Continents" },
  { value: "15+", label: "Years combined methodology" },
  { value: "10", label: "Teams per Beta cohort" },
];

export function GuideSection() {
  return (
    <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="We've lived this" icon={<Compass className="w-3 h-3" />} />
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Built by practitioners, not theorists.
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We built LIZA because no tool connected execution, learning, and governance into one system.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-2xl md:text-3xl font-black brand-gradient-text mb-1">{m.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {TEAM.map((m) => (
            <a
              key={m.name}
              href={m.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl border px-5 py-3 transition-colors hover:border-primary/30"
              style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
            >
              <img
                src={m.photo}
                alt={m.name}
                className="w-10 h-10 rounded-full object-cover shrink-0"
                style={{ border: "2px solid hsl(var(--primary) / 0.3)" }}
              />
              <div>
                <p className="text-sm font-bold leading-tight">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-primary ml-1 shrink-0">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          ))}
        </div>

        {/* Embedded testimonial */}
        <div
          className="rounded-xl border p-6 max-w-2xl mx-auto"
          style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--background))" }}
        >
          <Quote className="w-6 h-6 mb-3" style={{ color: "hsl(var(--primary) / 0.3)" }} />
          <blockquote className="text-base md:text-lg font-medium italic leading-relaxed mb-4">
            "This is the tool I use instead of Perplexity — because it actually builds knowledge at the team level."
          </blockquote>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--gradient-brand-btn)", color: "hsl(var(--primary-foreground))" }}
            >
              SP
            </div>
            <div>
              <p className="text-sm font-semibold">VP of Product Management</p>
              <p className="text-xs text-muted-foreground">Enterprise Software · 15+ years in Product</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
