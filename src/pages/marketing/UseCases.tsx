import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ArrowRight, ArrowDownRight, X } from "lucide-react";
import { USE_CASES, FLOW_CONNECTOR_TEXTS, FLYWHEEL_ITEMS } from "@/data/useCasesData";

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

function GradientText({ children }: { children: React.ReactNode }) {
  return <span className="brand-gradient-text">{children}</span>;
}

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-6"
      style={{ color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.25)", background: "hsl(var(--primary) / 0.06)" }}
    >
      {children}
    </p>
  );
}

function FlowConnector({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.6))" }} />
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold"
        style={{
          color: "hsl(var(--primary))",
          borderColor: "hsl(var(--primary) / 0.3)",
          background: "hsl(var(--primary) / 0.06)",
        }}
      >
        <ArrowDownRight className="w-3.5 h-3.5" />
        {text}
      </div>
      <div className="w-px h-8" style={{ background: "linear-gradient(to bottom, hsl(var(--primary) / 0.6), hsl(var(--primary) / 0.3))" }} />
    </div>
  );
}

export default function UseCasesPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, hsl(200 90% 52% / 0.07) 0%, transparent 65%)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.018]"
          style={{
            backgroundImage: `linear-gradient(hsl(200 90% 52%) 1px, transparent 1px), linear-gradient(90deg, hsl(200 90% 52%) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <SectionTag>How organisations build with LIZA</SectionTag>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Every use case
            <br />
            <GradientText>builds the next one.</GradientText>
          </h1>
          <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            Start with one. Within months, you're running all seven, because each one compounds the last.
          </p>
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
            style={{
              background: "var(--gradient-brand-btn)",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 0 32px -4px hsl(200 90% 52% / 0.4)",
            }}
          >
            Book a Discovery Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
          <span className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border"
            style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
          >
            Deployed · Being productised
          </span>
          <div className="h-px flex-1" style={{ background: "hsl(var(--border))" }} />
        </div>
      </div>

      {/* Use Cases */}
      <div className="pb-32 px-6">
        <div className="max-w-6xl mx-auto flex flex-col">
          {USE_CASES.map((uc, i) => (
            <div key={i}>
              <section
                className="relative rounded-3xl border overflow-hidden"
                style={{
                  background: `hsl(${uc.col} / 0.03)`,
                  borderColor: `hsl(${uc.col} / 0.2)`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${uc.col})` }} />
                <div className="p-10 md:p-14">
                  <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `hsl(${uc.col} / 0.15)`, color: `hsl(${uc.col})` }}
                        >
                          {uc.icon}
                        </div>
                        <span
                          className="text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full"
                          style={{ background: `hsl(${uc.col} / 0.12)`, color: `hsl(${uc.col})` }}
                        >
                          {uc.tag}
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl font-black mb-2 leading-tight">{uc.headline}</h2>
                      <p className="text-base font-semibold mb-8" style={{ color: `hsl(${uc.col})` }}>{uc.subheading}</p>

                      <div
                        className="rounded-xl p-5 mb-8 border"
                        style={{ background: "hsl(var(--background) / 0.5)", borderColor: "hsl(var(--border))" }}
                      >
                        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                          What you're probably already using
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {uc.competitors.map((c) => (
                            <span
                              key={c}
                              className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border"
                              style={{
                                borderColor: "hsl(var(--border))",
                                color: "hsl(var(--muted-foreground))",
                                background: "hsl(var(--muted) / 0.5)",
                              }}
                            >
                              <X className="w-3 h-3 opacity-50" />
                              {c}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                          {uc.competitorNote}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4">
                        {uc.body.map((para, j) => (
                          <p key={j} className="text-sm md:text-base leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                            {para}
                          </p>
                        ))}
                      </div>

                      {uc.carries && (
                        <div
                          className="mt-8 rounded-xl p-5 border-l-2 flex items-start gap-3"
                          style={{
                            borderLeftColor: `hsl(${uc.col})`,
                            background: `hsl(${uc.col} / 0.04)`,
                          }}
                        >
                          <ArrowDownRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: `hsl(${uc.col})` }} />
                          <p className="text-sm font-medium leading-relaxed" style={{ color: "hsl(var(--foreground))" }}>
                            {uc.carries}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="lg:w-64 flex flex-col gap-4">
                      {uc.stats.map((s, j) => (
                        <div
                          key={j}
                          className="rounded-2xl p-6 border text-center"
                          style={{
                            background: `hsl(${uc.col} / 0.06)`,
                            borderColor: `hsl(${uc.col} / 0.2)`,
                          }}
                        >
                          <p className="text-3xl md:text-4xl font-black mb-1" style={{ color: `hsl(${uc.col})` }}>
                            {s.value}
                          </p>
                          <p className="text-xs font-medium leading-snug" style={{ color: "hsl(var(--muted-foreground))" }}>
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {i < USE_CASES.length - 1 && (
                <FlowConnector text={FLOW_CONNECTOR_TEXTS[i]} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* The Bigger Picture */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag>The bigger picture</SectionTag>
            <h2 className="text-4xl font-black mb-4">
              One operating system.
              <br />
              <GradientText>Four compounding results.</GradientText>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              Each use case feeds the next. Together, they close the knowledge spiral, turning tacit expertise into organisational infrastructure that compounds over time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-14">
            {[
              {
                step: "Tacit → Explicit",
                desc: "Meeting transcripts and senior expertise get extracted, structured, and encoded. Knowledge that was invisible becomes accessible.",
                col: "200 90% 52%",
              },
              {
                step: "Explicit → Infrastructure",
                desc: "Encoded knowledge becomes executable protocols: audit criteria, sales playbooks, delegation packages. It stops being documentation and starts being a system.",
                col: "155 72% 46%",
              },
              {
                step: "Infrastructure → Execution",
                desc: "Your team runs on that infrastructure. Audits execute faster. Sales reps onboard in weeks. Delegated work lands correctly.",
                col: "38 92% 50%",
              },
              {
                step: "Execution → New Knowledge",
                desc: "Every execution generates new learning, captured, reviewed, and re-encoded. The system gets smarter with every run. Your organisational intelligence compounds.",
                col: "270 60% 65%",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-7 border overflow-hidden"
                style={{
                  background: `hsl(${item.col} / 0.03)`,
                  borderColor: `hsl(${item.col} / 0.2)`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${item.col})` }} />
                <p className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: `hsl(${item.col})` }}>
                  {item.step}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seven-Step Flywheel */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--background))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionTag>The flywheel</SectionTag>
            <h2 className="text-4xl font-black mb-4">
              Seven compounding results.
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              Each use case feeds the next. Start anywhere. The system compounds.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FLYWHEEL_ITEMS.map((item, i) => (
              <div
                key={i}
                className="relative rounded-2xl p-5 border overflow-hidden group"
                style={{
                  background: `hsl(${item.col} / 0.04)`,
                  borderColor: `hsl(${item.col} / 0.2)`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${item.col})` }} />
                <p className="text-2xl font-black mb-1" style={{ color: `hsl(${item.col})` }}>{item.num}</p>
                <p className="text-sm font-bold mb-2">{item.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{item.oneLiner}</p>
                {i < FLYWHEEL_ITEMS.length - 1 ? (
                  <ArrowRight className="absolute bottom-3 right-3 w-4 h-4 opacity-30" style={{ color: `hsl(${item.col})` }} />
                ) : (
                  <div
                    className="absolute bottom-3 right-3 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full"
                    style={{ background: `hsl(${item.col} / 0.15)`, color: `hsl(${item.col})` }}
                  >
                    ↻ Back to 01
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base font-semibold mb-8">
            Most organisations start with one use case.
            <br />
            <span style={{ color: "hsl(var(--primary))" }}>Within months, they're running the full OS.</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(200 90% 52% / 0.4)",
              }}
            >
              Book a Discovery Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border"
              style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
            >
              See LIZA OS →
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
