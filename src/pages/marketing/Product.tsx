import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ArrowRight, FileText, Mic, Zap, CheckCircle2, ArrowDown } from "lucide-react";

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

// ── The Pipeline Visual ───────────────────────────────────────────────────────

const PIPELINE_STEPS = [
  {
    icon: <Mic className="w-7 h-7" />,
    label: "INPUT",
    title: "Your Existing Knowledge",
    desc: "Existing process documents, protocols, meeting transcripts, and structured interviews with your senior experts. The raw material your organisation already has.",
    col: "200 90% 52%",
    visual: (
      <div className="rounded-xl p-5 border font-mono text-xs leading-relaxed" style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
        <p className="mb-2 opacity-60">// Process documentation</p>
        <p>"Client Scoping SOP v4.2: When a client pushes for speed, apply the qualification checklist before proceeding..."</p>
        <p className="mt-2 opacity-60">// Meeting transcript</p>
        <p>"...the margin risk isn't in the deliverable, it's in the change requests. So I always build a clause that..."</p>
        <p className="mt-2 opacity-60">// Senior interview excerpt</p>
        <p>"...when I see that pattern, I slow them down with three questions before we even talk about scope..."</p>
      </div>
    ),
  },
  {
    icon: <Zap className="w-7 h-7" />,
    label: "PROCESS",
    title: "LIZA Context Engine",
    desc: "Our AI engine analyses, categorises, and structures every piece of expertise into the five knowledge types: Playbooks, Procedures, Directives, Principles, and Knowledge items.",
    col: "155 72% 46%",
    visual: (
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "hsl(155 72% 46% / 0.3)" }}>
        <div className="px-5 py-3 border-b flex items-center gap-2" style={{ background: "hsl(155 72% 46% / 0.08)", borderColor: "hsl(155 72% 46% / 0.2)" }}>
          <Zap className="w-4 h-4" style={{ color: "hsl(155 72% 46%)" }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(155 72% 46%)" }}>Semantic Analysis</span>
        </div>
        <div className="p-5 flex flex-col gap-3" style={{ background: "hsl(var(--background))" }}>
          {[
            { type: "PLAYBOOK", text: "Client Scoping Protocol", col: "200 90% 52%" },
            { type: "DIRECTIVE", text: "Always include change-request clause", col: "38 92% 50%" },
            { type: "PRINCIPLE", text: "Speed pressure = internal misalignment", col: "270 60% 65%" },
            { type: "PROCEDURE", text: "3-Question Slowdown Framework", col: "155 72% 46%" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-[10px] font-black tracking-widest px-2 py-1 rounded-full flex-shrink-0" style={{ background: `hsl(${item.col} / 0.15)`, color: `hsl(${item.col})` }}>
                {item.type}
              </span>
              <span style={{ color: "hsl(var(--foreground))" }}>{item.text}</span>
              <CheckCircle2 className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: "hsl(155 72% 46%)" }} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: <FileText className="w-7 h-7" />,
    label: "OUTPUT",
    title: "Your Master Protocol",
    desc: "A structured, versioned, executable protocol document. Ready to deploy into AI workbooks, delegate to your team, or run as automated workflows.",
    col: "38 92% 50%",
    visual: (
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "hsl(38 92% 50% / 0.3)" }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ background: "hsl(38 92% 50% / 0.08)", borderColor: "hsl(38 92% 50% / 0.2)" }}>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: "hsl(38 92% 50%)" }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(38 92% 50%)" }}>Master Protocol</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "hsl(155 72% 46% / 0.15)", color: "hsl(155 72% 46%)" }}>v1.0</span>
        </div>
        <div className="p-5 flex flex-col gap-4 text-sm" style={{ background: "hsl(var(--background))" }}>
          <div>
            <p className="font-bold mb-1">1. Client Scoping Protocol</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>When a client pushes for speed, apply the 3-Question Slowdown Framework before proceeding to SOW drafting.</p>
          </div>
          <div className="h-px" style={{ background: "hsl(var(--border))" }} />
          <div>
            <p className="font-bold mb-1">2. Margin Protection Gates</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>DIRECTIVE: Every SOW must include change-request clause with escalation triggers. Non-negotiable.</p>
          </div>
          <div className="h-px" style={{ background: "hsl(var(--border))" }} />
          <div>
            <p className="font-bold mb-1">3. Red Flag Detection</p>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>PRINCIPLE: Client speed pressure signals internal misalignment. Slow down. Qualify deeper.</p>
          </div>
        </div>
      </div>
    ),
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProductPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, hsl(200 90% 52% / 0.07) 0%, transparent 65%)" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <SectionTag>The Product</SectionTag>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            We input your knowledge.
            <br />
            <GradientText>LIZA outputs your Operating System.</GradientText>
          </h1>
          <p className="text-lg mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
            See exactly what happens when your existing documentation and expertise meet the LIZA Context Engine. Messy knowledge goes in. Structured, executable protocols come out.
          </p>
          <p className="text-base mb-10" style={{ color: "hsl(var(--muted-foreground))" }}>
            Standardising best practices has always been the challenge. AI didn't create the problem. It just made solving it both urgent and possible.
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
            Book a Protocol Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* The Pipeline */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <SectionTag>How it works</SectionTag>
            <h2 className="text-4xl font-black mb-4">
              Your knowledge in.
              <br />
              <GradientText>Executable protocol out.</GradientText>
            </h2>
          </div>

          <div className="flex flex-col">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={i}>
                <div
                  className="relative rounded-3xl border overflow-hidden"
                  style={{
                    background: `hsl(${step.col} / 0.03)`,
                    borderColor: `hsl(${step.col} / 0.2)`,
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${step.col})` }} />
                  <div className="p-10 md:p-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `hsl(${step.col} / 0.15)`, color: `hsl(${step.col})` }}
                      >
                        {step.icon}
                      </div>
                      <span
                        className="text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full"
                        style={{ background: `hsl(${step.col} / 0.12)`, color: `hsl(${step.col})` }}
                      >
                        {step.label}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black mb-3">{step.title}</h3>
                    <p className="text-sm md:text-base leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>{step.desc}</p>
                    {step.visual}
                  </div>
                </div>

                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="flex flex-col items-center gap-2 py-3">
                    <div className="w-px h-6" style={{ background: `linear-gradient(to bottom, hsl(${step.col} / 0.4), hsl(${PIPELINE_STEPS[i + 1].col} / 0.4))` }} />
                    <ArrowDown className="w-5 h-5" style={{ color: "hsl(var(--primary) / 0.5)" }} />
                    <div className="w-px h-6" style={{ background: `linear-gradient(to bottom, hsl(${PIPELINE_STEPS[i + 1].col} / 0.4), hsl(${PIPELINE_STEPS[i + 1].col} / 0.6))` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-24 px-6" style={{ background: "hsl(var(--card))" }}>
        <div className="max-w-4xl mx-auto text-center">
          <SectionTag>The deliverable</SectionTag>
          <h2 className="text-4xl font-black mb-4">
            A working system
            <br />
            <GradientText>you deploy on day one.</GradientText>
          </h2>
          <p className="text-lg mb-12 max-w-2xl mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
            Your Master Protocol isn't a PDF that sits in a drawer. It's a living, versioned, executable asset that runs inside LIZA workbooks, guides your AI agents, and gets smarter with every use.
          </p>

          <div className="grid md:grid-cols-3 gap-5 text-left">
            {[
              { title: "Executable", desc: "Deploy directly into AI workbooks. Your protocols run as structured workflows with gate logic and compliance checks." },
              { title: "Versioned", desc: "Every change is tracked. Roll back, compare, audit. Your intellectual property is governed and protected." },
              { title: "Compounding", desc: "Every execution captures new learning back into the system. Your protocols get smarter with every use." },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl p-7 border"
                style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
              >
                <h3 className="text-base font-bold mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">
            See it run on <GradientText>your expertise.</GradientText>
          </h2>
          <p className="text-sm mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
            Book a 30-minute protocol assessment. We'll show you exactly what your Master Protocol would look like.
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
              Book a Protocol Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/for-professional-services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium border"
              style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
            >
              The 5-Day Sprint →
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
