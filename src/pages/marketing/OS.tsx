import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Layers, Workflow, ShieldCheck } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { SectionTag, GradientText, CAL_URL } from "@/components/marketing/home/shared";
import { LizaOSStack } from "@/components/marketing/os/LizaOSStack";

const PRINCIPLES = [
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "A Judgment Core, not another app",
    body: "Your knowledge graph plus governance. Every AI surface that touches your company has to read from it to act with judgment.",
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: "Native surfaces, plus everything you already own",
    body: "Liza ships Workbooks, Extraction, and Oversight. ChatGPT, Claude, and custom agents run inside them. Copilot, Glean, Veeva connect from outside.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Governance is enforced, not documented",
    body: "Mandates, versioning, audit trail. The same standard runs everywhere AI executes.",
  },
  {
    icon: <Workflow className="w-5 h-5" />,
    title: "Model-agnostic. Knowledge portable.",
    body: "Swap LLMs without rewriting your standards. Bundles are versioned, exportable, vendor-neutral. The asset is yours.",
  },
];

export default function OSPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.07) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, hsl(var(--primary) / 0.08) 0%, transparent 65%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <SectionTag label="The Liza Framework" />
          <h1 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight mb-6">
            The <GradientText>Judgment Core</GradientText>
            <br />
            for AI-native organizations.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Your decision logic, standards, and process intelligence become the Judgment Core.
            Every AI surface — the ones we build, the ones you already own — runs against it.
            Consistent behaviour everywhere AI executes.
          </p>
          <p className="text-xs text-muted-foreground/70 max-w-xl mx-auto italic mb-8">
            Think of it the way you think of an operating system for your AI estate. The language we use is our own.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold"
              style={{
                background: "var(--gradient-brand-btn)",
                color: "hsl(var(--primary-foreground))",
                boxShadow: "0 0 32px -4px hsl(var(--primary) / 0.4)",
              }}
            >
              Map your stack <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/diagnostic"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              Score your AI execution
            </Link>
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionTag label="The Liza framework" />
            <h2 className="text-3xl md:text-4xl font-black mb-3">
              One core.
              <br />
              <GradientText>Every AI surface inherits it.</GradientText>
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Source Systems feed in from the side. The Judgment Core governs every surface above it. The Model Fabric below is interchangeable.
            </p>
          </div>
          <LizaOSStack />
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionTag label="What makes it a Judgment Core" />
            <h2 className="text-3xl md:text-4xl font-black">
              Not a tool.{" "}
              <GradientText>A layer everything else runs against.</GradientText>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {PRINCIPLES.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border p-6"
                style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "hsl(var(--primary) / 0.1)", color: "hsl(var(--primary))" }}
                >
                  {p.icon}
                </div>
                <h3 className="text-base font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reframe */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionTag label="The reframe" />
          <h2 className="text-2xl md:text-3xl font-black leading-tight mb-5">
            Copilot, Glean, vendor RAG are not competitors.
            <br />
            <GradientText>They are surfaces that get better when they read from the Judgment Core.</GradientText>
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            None of them define how your company decides. Liza does. Connect them and they
            inherit your standards, your mandates, and your audit trail.
          </p>
        </div>
      </section>
    </MarketingLayout>
  );
}