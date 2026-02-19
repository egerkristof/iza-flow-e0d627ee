import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  Brain, Target, Users, Clock, CheckCircle2, ArrowRight,
  AlertTriangle, Zap, BookOpen, TrendingUp, BarChart3, Award, Briefcase, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Scaled slide container ──────────────────────────────────────────────────

function ScaledSlide({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setScale(Math.min(width / 1920, height / 1080));
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden w-full h-full">
      <div style={{
        position: "absolute", width: 1920, height: 1080,
        left: "50%", top: "50%", marginLeft: -960, marginTop: -540,
        transform: `scale(${scale})`, transformOrigin: "center center",
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Design tokens ───────────────────────────────────────────────────────────

const BG    = "hsl(222 20% 4%)";
const BG2   = "hsl(222 18% 6%)";
const C     = "210 18% 92%";   // foreground
const MUT   = "215 10% 50%";   // muted

// Brand: deep teal + warm amber (different from cyan/green investor deck)
const TEAL  = "180 60% 42%";
const AMBER = "38 92% 58%";
const SLATE = "215 20% 25%";

function Grid() {
  return (
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `linear-gradient(hsl(${TEAL}) 1px, transparent 1px), linear-gradient(90deg, hsl(${TEAL}) 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}

function Bar() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[3px]"
      style={{ background: `linear-gradient(90deg, hsl(${TEAL}), hsl(${AMBER}))` }} />
  );
}

function Tag({ label }: { label: string }) {
  return (
    <p className="font-semibold tracking-[0.25em] uppercase mb-6"
      style={{ fontSize: 26, color: `hsl(${TEAL})` }}>{label}</p>
  );
}

function Pill({ children, color = TEAL }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border font-semibold"
      style={{
        fontSize: 22, borderColor: `hsl(${color} / 0.5)`,
        background: `hsl(${color} / 0.08)`, color: `hsl(${color})`
      }}>
      {children}
    </span>
  );
}

// ─── Slide 01 — Cover ────────────────────────────────────────────────────────

function Slide01Cover() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />

      {/* Left accent strip */}
      <div className="absolute left-0 top-0 bottom-0 w-[6px]"
        style={{ background: `linear-gradient(180deg, hsl(${TEAL}), hsl(${AMBER}))` }} />

      {/* Glow */}
      <div className="absolute top-0 right-0 w-[900px] h-[900px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)`, transform: "translate(30%, -30%)" }} />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: `hsl(${TEAL})` }} />
          <span className="font-semibold tracking-[0.3em] uppercase" style={{ fontSize: 24, color: `hsl(${TEAL})` }}>
            AI Effectiveness Sprint
          </span>
        </div>

        <h1 className="font-bold leading-[1.05] mb-10"
          style={{ fontSize: 96, color: `hsl(${C})` }}>
          Your AI has your documents.
          <br />
          <span style={{
            background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${AMBER}))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            Does it have your expertise?
          </span>
        </h1>

        <p className="mb-14 leading-relaxed max-w-[1060px]"
          style={{ fontSize: 36, color: `hsl(${MUT})` }}>
          Companies load their best <strong style={{ color: `hsl(${C})` }}>explicit</strong> knowledge into AI. What stays locked away
          is the <strong style={{ color: `hsl(${C})` }}>tacit layer</strong> — how your best people actually think, adapt, and decide.
          <br />
          We surface that layer and turn it into <strong style={{ color: `hsl(${C})` }}>2 executable playbooks</strong> your team runs from day one.
        </p>

        <div className="flex items-center gap-8">
          <Pill color={AMBER}>3–4 Weeks</Pill>
          <Pill color={TEAL}>€25k – €35k</Pill>
          <Pill color={SLATE}>2 Playbooks. Delivered.</Pill>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 02 — The Problem ──────────────────────────────────────────────────

function Slide02Problem() {
  const pains = [
    {
      icon: <BookOpen style={{ width: 52, height: 52 }} />,
      title: "AI Already Loaded With Explicit Knowledge",
      desc: "Most teams have connected AI to their documents, SOPs, and manuals. That's the easy part — and your competitors have done it too. Explicit knowledge is table stakes.",
    },
    {
      icon: <Brain style={{ width: 52, height: 52 }} />,
      title: "The Tacit Layer Is Still Locked Away",
      desc: "What your best people actually do — their judgment calls, their heuristics, the way they adapt when things don't go to plan — none of that is in any document. So it never reaches the AI.",
    },
    {
      icon: <AlertTriangle style={{ width: 52, height: 52 }} />,
      title: "Generic Output Despite Great Tools",
      desc: "The result: AI that sounds competent but misses the nuance. It produces what the manual says, not what your expert would do. Good enough to demo. Not good enough to deploy.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute left-0 top-0 bottom-0 w-[6px]"
        style={{ background: `linear-gradient(180deg, hsl(${TEAL}), hsl(${AMBER}))` }} />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="The Real Problem" />
        <h2 className="font-bold mb-14" style={{ fontSize: 72, color: `hsl(${C})` }}>
          Your AI has your documents.
          <br />
          <span style={{
            background: `linear-gradient(135deg, hsl(0 72% 63%), hsl(${AMBER}))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>It doesn't have your expertise.</span>
        </h2>

        <div className="grid grid-cols-3 gap-10">
          {pains.map((p, i) => (
            <div key={i} className="rounded-2xl p-10 border"
              style={{ background: BG2, borderColor: `hsl(${TEAL} / 0.15)` }}>
              <div className="mb-6" style={{ color: `hsl(${AMBER})` }}>{p.icon}</div>
              <h3 className="font-bold mb-4" style={{ fontSize: 32, color: `hsl(${C})` }}>{p.title}</h3>
              <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 03 — Who This Is For ──────────────────────────────────────────────

function Slide03ICP() {
  const profiles = [
    {
      role: "Head of Operations / COO",
      firm: "Professional services firm (30–150 staff)",
      pain: "\"We have AI tools, we have a prompt library, people use it — but outputs are all over the place. Our best people still get better results than everyone else and we don't know why.\"",
      fit: "Primary Buyer",
      color: TEAL,
    },
    {
      role: "Managing Partner",
      firm: "Consulting or agency (10–60 consultants)",
      pain: "\"I want AI to think like our best consultants, not like a smart intern who read our website. The gap is always in the judgment — the stuff that's never written down.\"",
      fit: "Primary Buyer",
      color: TEAL,
    },
    {
      role: "L&D / Enablement Lead",
      firm: "Scale-up or mid-market (post Series A)",
      pain: "\"We've done the AI training. People know how to prompt. But we haven't cracked how to capture what makes our seniors effective and make it replicable by juniors.\"",
      fit: "Strong Fit",
      color: AMBER,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute left-0 top-0 bottom-0 w-[6px]"
        style={{ background: `linear-gradient(180deg, hsl(${TEAL}), hsl(${AMBER}))` }} />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="Ideal Client Profile" />
        <h2 className="font-bold mb-14" style={{ fontSize: 72, color: `hsl(${C})` }}>
          You have tools. You may even have a process.
          <br />
          <span style={{ color: `hsl(${TEAL})` }}>But you're missing the expert layer.</span>
        </h2>

        <div className="grid grid-cols-3 gap-10">
          {profiles.map((p, i) => (
            <div key={i} className="rounded-2xl p-10 border relative overflow-hidden"
              style={{ background: BG2, borderColor: `hsl(${p.color} / 0.2)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `hsl(${p.color})` }} />
              <div className="mb-4">
                <span className="px-3 py-1 rounded-full font-semibold"
                  style={{ fontSize: 20, background: `hsl(${p.color} / 0.12)`, color: `hsl(${p.color})` }}>
                  {p.fit}
                </span>
              </div>
              <h3 className="font-bold mb-1" style={{ fontSize: 30, color: `hsl(${C})` }}>{p.role}</h3>
              <p className="mb-6" style={{ fontSize: 20, color: `hsl(${MUT})` }}>{p.firm}</p>
              <p className="italic" style={{ fontSize: 22, color: `hsl(210 18% 75%)`, lineHeight: 1.5 }}>{p.pain}</p>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 04 — The Insight ──────────────────────────────────────────────────

function Slide04Insight() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute left-0 top-0 bottom-0 w-[6px]"
        style={{ background: `linear-gradient(180deg, hsl(${TEAL}), hsl(${AMBER}))` }} />

      <div className="absolute w-[800px] h-[800px] rounded-full opacity-[0.07]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

      <div className="relative z-10 flex h-full">
        {/* Left column — the concept */}
        <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[960px] flex-shrink-0">
          <Tag label="The Core Insight" />
          <p className="font-bold leading-tight mb-10" style={{ fontSize: 74, color: `hsl(${C})` }}>
            AI gives you access
            <br />to explicit knowledge.
            <br />
            <span style={{
              background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${AMBER}))`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              We surface the tacit layer.
            </span>
          </p>
          <p style={{ fontSize: 28, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
            Every organisation has loaded AI with what's written down.
            The gap — and the real value — is in what's <em style={{ color: `hsl(${C})` }}>not</em> written down:
            the judgment, the heuristics, the way your best people adapt when reality doesn't match the plan.
          </p>
        </div>

        {/* Right column — the two-layer diagram */}
        <div className="flex flex-col justify-center flex-1 pr-[120px] gap-6">
          {/* Explicit block */}
          <div className="rounded-2xl p-10 border" style={{ background: BG2, borderColor: `hsl(${MUT} / 0.2)` }}>
            <div className="flex items-center gap-4 mb-4">
              <BookOpen style={{ width: 36, height: 36, color: `hsl(${MUT})` }} />
              <span className="font-bold tracking-widest uppercase" style={{ fontSize: 20, color: `hsl(${MUT})` }}>Explicit Layer — What AI Already Has</span>
            </div>
            <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
              Documents · SOPs · Manuals · FAQs · Email templates<br />
              <em>Your competitors have connected the same things.</em>
            </p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-[2px] h-8" style={{ background: `hsl(${TEAL} / 0.4)` }} />
              <span style={{ fontSize: 20, color: `hsl(${TEAL})`, fontWeight: 600 }}>What we unlock</span>
              <div className="w-[2px] h-8" style={{ background: `hsl(${TEAL} / 0.4)` }} />
            </div>
          </div>

          {/* Tacit block */}
          <div className="rounded-2xl p-10 border" style={{ background: `hsl(${TEAL} / 0.06)`, borderColor: `hsl(${TEAL} / 0.35)` }}>
            <div className="flex items-center gap-4 mb-4">
              <Brain style={{ width: 36, height: 36, color: `hsl(${TEAL})` }} />
              <span className="font-bold tracking-widest uppercase" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>Tacit Layer — What Lives in Expert Heads</span>
            </div>
            <p style={{ fontSize: 24, color: `hsl(${C})`, lineHeight: 1.5 }}>
              Judgment calls · Adaptive heuristics · Situational pattern-matching<br />
              <em style={{ color: `hsl(${TEAL})` }}>Structured into executable playbooks — for everyone on the team.</em>
            </p>
          </div>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 05 — The Sprint ───────────────────────────────────────────────────

function Slide05Sprint() {
  const weeks = [
    {
      wk: "Week 1",
      label: "Diagnose",
      icon: <Search style={{ width: 44, height: 44 }} />,
      action: "AI Effectiveness Audit",
      desc: "We map exactly how your team currently uses LLMs — what works, what doesn't, and where the biggest value gap is. Interviews + workflow shadowing.",
      output: "Gap Map",
      color: TEAL,
    },
    {
      wk: "Week 2",
      label: "Extract",
      icon: <Brain style={{ width: 44, height: 44 }} />,
      action: "Playbook Design",
      desc: "We work with your best performers to extract what they actually do. We turn those patterns into two structured, step-by-step AI playbooks for your specific use cases.",
      output: "2 Core Playbooks",
      color: AMBER,
    },
    {
      wk: "Week 3",
      label: "Test",
      icon: <Zap style={{ width: 44, height: 44 }} />,
      action: "Execution Run",
      desc: "The team runs the playbooks live in our sandbox. We measure output quality and refine until results are consistent — not just for the expert, but for everyone.",
      output: "Validated Playbooks",
      color: TEAL,
    },
    {
      wk: "Week 4",
      label: "Embed",
      icon: <BookOpen style={{ width: 44, height: 44 }} />,
      action: "Handover & Activation",
      desc: "Playbooks are embedded in your actual workflow. Your team knows exactly when to trigger them, how to run them, and how to keep them improving.",
      output: "Live in Your Workflow",
      color: AMBER,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute left-0 top-0 bottom-0 w-[6px]"
        style={{ background: `linear-gradient(180deg, hsl(${TEAL}), hsl(${AMBER}))` }} />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="How It Works" />
        <h2 className="font-bold mb-14" style={{ fontSize: 72, color: `hsl(${C})` }}>
          3–4 weeks. 2 playbooks. Running.
        </h2>

        <div className="grid grid-cols-4 gap-8">
          {weeks.map((w, i) => (
            <div key={i} className="rounded-2xl border relative overflow-hidden"
              style={{ background: BG2, borderColor: `hsl(${w.color} / 0.2)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `hsl(${w.color})` }} />
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div style={{ color: `hsl(${w.color})` }}>{w.icon}</div>
                  <span className="font-mono font-bold" style={{ fontSize: 20, color: `hsl(${w.color})` }}>{w.wk}</span>
                </div>
                <h3 className="font-bold mb-1" style={{ fontSize: 36, color: `hsl(${C})` }}>{w.label}</h3>
                <p className="font-semibold mb-5" style={{ fontSize: 22, color: `hsl(${w.color})` }}>{w.action}</p>
                <p className="mb-8" style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{w.desc}</p>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg"
                  style={{ background: `hsl(${w.color} / 0.08)` }}>
                  <CheckCircle2 style={{ width: 20, height: 20, color: `hsl(${w.color})` }} />
                  <span style={{ fontSize: 20, color: `hsl(${w.color})`, fontWeight: 600 }}>{w.output}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 06 — The Differentiator ──────────────────────────────────────────

function Slide06Differentiator() {
  const rows = [
    { label: "Connect docs to AI (RAG/Copilot)", a: "Explicit layer only", b: "AI knows your manuals — not your judgment", us: false },
    { label: "AI Training / Prompt Courses", a: "Explicit instruction on technique", b: "Individual skill, no institutional memory", us: false },
    { label: "Bring in Another AI Tool", a: "Different interface, same explicit layer", b: "Better UI, same knowledge gap underneath", us: false },
    { label: "Traditional Consulting", a: "Recommendations based on interviews", b: "A report — not a system that runs", us: false },
    { label: "AI Effectiveness Sprint", a: "Surface & encode the tacit expert layer", b: "Playbooks that carry expert judgment — executable by anyone", us: true },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute left-0 top-0 bottom-0 w-[6px]"
        style={{ background: `linear-gradient(180deg, hsl(${TEAL}), hsl(${AMBER}))` }} />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="Why We're Different" />
        <h2 className="font-bold mb-10" style={{ fontSize: 68, color: `hsl(${C})` }}>
          Every approach gets you the explicit layer.
          <br />
          <span style={{ color: `hsl(${TEAL})` }}>Only we surface the tacit layer underneath.</span>
        </h2>

        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: `hsl(${TEAL} / 0.15)` }}>
          {/* Header */}
          <div className="grid grid-cols-4 gap-0"
            style={{ background: `hsl(${TEAL} / 0.08)`, borderBottom: `1px solid hsl(${TEAL} / 0.15)` }}>
            {["Approach", "What They Deliver", "What You Get", ""].map((h, i) => (
              <div key={i} className="px-8 py-5">
                <span className="font-semibold tracking-widest uppercase" style={{ fontSize: 20, color: `hsl(${MUT})` }}>{h}</span>
              </div>
            ))}
          </div>
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-4"
              style={{
                borderBottom: i < rows.length - 1 ? `1px solid hsl(${TEAL} / 0.08)` : "none",
                background: r.us ? `hsl(${TEAL} / 0.05)` : "transparent",
              }}>
              <div className="px-8 py-6">
                <span className="font-semibold" style={{ fontSize: 26, color: r.us ? `hsl(${TEAL})` : `hsl(${C})` }}>{r.label}</span>
              </div>
              <div className="px-8 py-6">
                <span style={{ fontSize: 26, color: `hsl(${MUT})` }}>{r.a}</span>
              </div>
              <div className="px-8 py-6">
                <span style={{ fontSize: 26, color: r.us ? `hsl(${C})` : `hsl(${MUT})` }}>{r.b}</span>
              </div>
              <div className="px-8 py-6 flex items-center">
                {r.us && (
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full"
                    style={{ background: `hsl(${TEAL} / 0.15)` }}>
                    <CheckCircle2 style={{ width: 22, height: 22, color: `hsl(${TEAL})` }} />
                    <span className="font-bold" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>This is us</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 07 — The Sandbox ──────────────────────────────────────────────────

function Slide07Sandbox() {
  const features = [
    {
      icon: <BookOpen style={{ width: 42, height: 42 }} />,
      title: "Built Live, Not After the Fact",
      desc: "Playbooks are constructed in real-time during working sessions with your team — not written up in a back office based on notes.",
    },
    {
      icon: <Zap style={{ width: 42, height: 42 }} />,
      title: "Run in a Structured Sandbox",
      desc: "Your team executes the playbooks in a controlled environment. We see exactly what's working, what breaks down, and where output quality drops.",
    },
    {
      icon: <Target style={{ width: 42, height: 42 }} />,
      title: "Refined Until Consistent",
      desc: "We iterate until the same playbook produces strong output regardless of who runs it — senior or junior. That's when it's done.",
    },
    {
      icon: <TrendingUp style={{ width: 42, height: 42 }} />,
      title: "Yours to Keep and Evolve",
      desc: "The playbooks don't live in our system. They're handed over in formats your team can use, update, and expand without us.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute left-0 top-0 bottom-0 w-[6px]"
        style={{ background: `linear-gradient(180deg, hsl(${TEAL}), hsl(${AMBER}))` }} />

      {/* Right-side glow */}
      <div className="absolute right-0 top-0 w-[700px] h-[700px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${AMBER}), transparent 70%)`, transform: "translate(30%, -20%)" }} />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="How We're Different" />
        <h2 className="font-bold mb-6" style={{ fontSize: 78, color: `hsl(${C})` }}>
          We don't train.
          <br />
          <span style={{ color: `hsl(${TEAL})` }}>We build with you and test it.</span>
        </h2>
        <p className="mb-14" style={{ fontSize: 34, color: `hsl(${MUT})` }}>
          Our proprietary infrastructure lets us capture, run, and validate your playbooks in real-time — so you leave with something that actually works.
        </p>

        <div className="grid grid-cols-2 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex gap-6 p-8 rounded-2xl border"
              style={{ background: BG2, borderColor: `hsl(${TEAL} / 0.15)` }}>
              <div className="flex-shrink-0 mt-1" style={{ color: `hsl(${TEAL})` }}>{f.icon}</div>
              <div>
                <h4 className="font-bold mb-3" style={{ fontSize: 30, color: `hsl(${C})` }}>{f.title}</h4>
                <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 08 — Deliverables ─────────────────────────────────────────────────

function Slide08Deliverables() {
  const deliverables = [
    { n: "01", title: "Playbook #1: [Your Use Case A]", desc: "A step-by-step AI workflow for your highest-value, most repeatable task. Structured for team-wide use from day one." },
    { n: "02", title: "Playbook #2: [Your Use Case B]", desc: "A second executable playbook targeting a different use case — identified during the audit as the next highest-value target." },
    { n: "03", title: "AI Effectiveness Gap Report", desc: "A clear map of where your team is losing value from AI today, and a prioritised list of next improvements." },
    { n: "04", title: "Execution Quality Baseline", desc: "Measured output consistency before and after. The benchmark you use to know if the playbooks are actually working." },
    { n: "05", title: "Sandbox Access (90 days)", desc: "Your playbooks stay live in the environment for 90 days — use it for onboarding, refinement, and training new hires." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute left-0 top-0 bottom-0 w-[6px]"
        style={{ background: `linear-gradient(180deg, hsl(${TEAL}), hsl(${AMBER}))` }} />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="What You Walk Away With" />
        <h2 className="font-bold mb-14" style={{ fontSize: 78, color: `hsl(${C})` }}>
          Specific. Runnable. Yours.
        </h2>

        <div className="space-y-5">
          {deliverables.map((d, i) => (
            <div key={i} className="flex items-center gap-8 p-7 rounded-xl border"
              style={{ background: BG2, borderColor: `hsl(${TEAL} / 0.12)` }}>
              <span className="font-mono font-bold flex-shrink-0 w-[56px]"
                style={{ fontSize: 28, color: `hsl(${TEAL})` }}>{d.n}</span>
              <div className="w-[1px] self-stretch" style={{ background: `hsl(${TEAL} / 0.2)` }} />
              <h4 className="font-bold flex-shrink-0 w-[480px]" style={{ fontSize: 28, color: `hsl(${C})` }}>{d.title}</h4>
              <p style={{ fontSize: 24, color: `hsl(${MUT})` }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

function Slide09Pricing() {
  const tiers = [
    {
      name: "Proof of Concept",
      price: "€15k",
      duration: "2 weeks",
      desc: "AI Effectiveness Audit + 1 executable playbook. Ideal for a first engagement to prove value before committing.",
      items: ["AI usage audit", "Team interviews", "1 validated playbook", "Gap report"],
      color: AMBER,
      tag: "Entry Point",
    },
    {
      name: "AI Effectiveness Sprint",
      price: "€28k",
      duration: "3–4 weeks",
      desc: "Full engagement. 2 tailored playbooks, validated in a live sandbox with your team, handed over ready to run.",
      items: ["AI effectiveness audit", "2 custom playbooks", "Sandbox validation", "Execution baseline", "90-day access"],
      color: TEAL,
      tag: "Most Impactful",
    },
    {
      name: "Embedded Advisor",
      price: "€5k/mo",
      duration: "Ongoing retainer",
      desc: "We stay close. Monthly review of how the playbooks perform, quarterly updates as your AI tools and workflows evolve.",
      items: ["Monthly playbook review", "Quarterly updates", "New use case scoping", "Priority access"],
      color: SLATE,
      tag: "Long-Term",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute left-0 top-0 bottom-0 w-[6px]"
        style={{ background: `linear-gradient(180deg, hsl(${TEAL}), hsl(${AMBER}))` }} />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="Investment" />
        <h2 className="font-bold mb-14" style={{ fontSize: 78, color: `hsl(${C})` }}>
          Structured for how you buy.
        </h2>

        <div className="grid grid-cols-3 gap-10">
          {tiers.map((t, i) => (
            <div key={i} className="rounded-2xl border relative overflow-hidden flex flex-col"
              style={{ background: BG2, borderColor: `hsl(${t.color} / 0.25)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${t.color})` }} />
              <div className="p-10 flex flex-col flex-1">
                <div className="mb-2">
                  <span className="px-3 py-1 rounded-full font-semibold"
                    style={{ fontSize: 19, background: `hsl(${t.color} / 0.12)`, color: `hsl(${t.color})` }}>
                    {t.tag}
                  </span>
                </div>
                <h3 className="font-bold mt-4" style={{ fontSize: 34, color: `hsl(${C})` }}>{t.name}</h3>
                <p className="mb-2" style={{ fontSize: 22, color: `hsl(${MUT})` }}>{t.duration}</p>
                <div className="mt-2 mb-6">
                  <span className="font-bold" style={{ fontSize: 56, color: `hsl(${t.color})` }}>{t.price}</span>
                </div>
                <p className="mb-8" style={{ fontSize: 23, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{t.desc}</p>
                <div className="space-y-3 mt-auto">
                  {t.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <CheckCircle2 style={{ width: 22, height: 22, color: `hsl(${t.color})` }} />
                      <span style={{ fontSize: 22, color: `hsl(${C})` }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 10 — About / Credibility ─────────────────────────────────────────

function Slide10About() {
  const signals = [
    { n: "Domain", label: "We only work in areas where we have deep domain expertise — so the playbooks we build are grounded in how the work actually gets done." },
    { n: "Specific", label: "No generic frameworks. Every playbook is built for your use cases, your tools, your team. You couldn't get this off-the-shelf." },
    { n: "Tested", label: "We validate in a live sandbox — not a workshop. You see the output quality before we hand anything over." },
    { n: "Infra", label: "Our proprietary execution infrastructure lets us capture, run, and refine protocols in real-time. No other consultant can do this." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute left-0 top-0 bottom-0 w-[6px]"
        style={{ background: `linear-gradient(180deg, hsl(${TEAL}), hsl(${AMBER}))` }} />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="Why Us" />
        <h2 className="font-bold mb-6" style={{ fontSize: 78, color: `hsl(${C})` }}>
          Not a course. Not a consultant.
          <br />
          <span style={{ color: `hsl(${TEAL})` }}>A builder who tests what they build.</span>
        </h2>
        <p className="mb-16 max-w-[900px]"
          style={{ fontSize: 34, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
          We combine domain expertise with proprietary infrastructure
          to deliver something no traditional consultant can.
        </p>

        <div className="grid grid-cols-2 gap-8">
          {signals.map((s, i) => (
            <div key={i} className="flex gap-8 p-8 rounded-2xl border items-start"
              style={{ background: BG2, borderColor: `hsl(${TEAL} / 0.15)` }}>
              <span className="font-mono font-bold flex-shrink-0"
                style={{ fontSize: 38, color: `hsl(${TEAL})` }}>{s.n}</span>
              <p style={{ fontSize: 26, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 11 — Call to Action ───────────────────────────────────────────────

function Slide11CTA() {
  const steps = [
    { n: "01", label: "30-min call to assess your current AI usage" },
    { n: "02", label: "We scope 2 use cases with your team" },
    { n: "03", label: "Sprint kicks off within 2 weeks" },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute left-0 top-0 bottom-0 w-[6px]"
        style={{ background: `linear-gradient(180deg, hsl(${TEAL}), hsl(${AMBER}))` }} />

      <div className="absolute w-[1000px] h-[1000px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)` }} />

      <div className="relative z-10 text-center px-40 max-w-[1500px]">
        <Tag label="Next Step" />
        <h2 className="font-bold mb-8" style={{ fontSize: 96, color: `hsl(${C})` }}>
          Your team could be running
          <br />
          <span style={{
            background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${AMBER}))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>2 AI playbooks in 4 weeks.</span>
        </h2>

        <p className="mb-16" style={{ fontSize: 36, color: `hsl(${MUT})` }}>
          It starts with a 30-minute conversation.
        </p>

        <div className="flex items-center justify-center gap-10 mb-16">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border"
                style={{ background: BG2, borderColor: `hsl(${TEAL} / 0.2)`, minWidth: 300 }}>
                <span className="font-mono font-bold" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>{s.n}</span>
                <span style={{ fontSize: 26, color: `hsl(${C})` }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight style={{ width: 36, height: 36, color: `hsl(${MUT})`, flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-8">
          <div className="px-12 py-6 rounded-2xl border font-bold"
            style={{ fontSize: 32, background: `hsl(${TEAL} / 0.12)`, borderColor: `hsl(${TEAL} / 0.4)`, color: `hsl(${TEAL})` }}>
            AI Effectiveness Sprint
          </div>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────

const SLIDES: { label: string; component: React.ComponentType }[] = [
  { label: "Cover",            component: Slide01Cover },
  { label: "Problem",          component: Slide02Problem },
  { label: "ICP",              component: Slide03ICP },
  { label: "Insight",          component: Slide04Insight },
  { label: "Sprint Arc",       component: Slide05Sprint },
  { label: "Differentiator",   component: Slide06Differentiator },
  { label: "Sandbox",          component: Slide07Sandbox },
  { label: "Deliverables",     component: Slide08Deliverables },
  { label: "Pricing",          component: Slide09Pricing },
  { label: "Why Us",           component: Slide10About },
  { label: "Next Step",        component: Slide11CTA },
];

const TOTAL = SLIDES.length;

// ─── Thumbnail ───────────────────────────────────────────────────────────────

function Thumbnail({ idx, active, onClick }: { idx: number; active: boolean; onClick: () => void }) {
  const { component: Comp } = SLIDES[idx];
  return (
    <button
      onClick={onClick}
      className={cn("relative w-full rounded-lg overflow-hidden border-2 transition-all text-left flex-shrink-0",
        active ? "border-teal-400 shadow-[0_0_16px_-4px_hsl(180_60%_42%/0.6)]" : "border-transparent hover:border-white/20"
      )}
      style={{ aspectRatio: "16/9" }}
    >
      <ScaledSlide><Comp /></ScaledSlide>
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-1.5 py-1"
        style={{ background: "hsl(222 20% 4% / 0.85)" }}>
        <span className="text-[8px] font-medium text-white/60 truncate">{SLIDES[idx].label}</span>
        <span className="text-[8px] font-mono text-white/40 ml-1 flex-shrink-0">{idx + 1}</span>
      </div>
    </button>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ConsultingDeck() {
  const [current, setCurrent]     = useState(0);
  const [gridView, setGridView]   = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const fsRef = useRef<HTMLDivElement>(null);

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent(c => Math.min(TOTAL - 1, c + 1)), []);

  const toggleFS = useCallback(async () => {
    if (!document.fullscreenElement) {
      await fsRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gridView) { if (e.key === "Escape") setGridView(false); return; }
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "f" || e.key === "F") toggleFS();
      if (e.key === "g" || e.key === "G") setGridView(v => !v);
      if (e.key === "Escape") document.exitFullscreen().catch(() => {});
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, toggleFS, gridView]);

  useEffect(() => {
    const onFS = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFS);
    return () => document.removeEventListener("fullscreenchange", onFS);
  }, []);

  const CurrentSlide = SLIDES[current].component;

  return (
    <div ref={fsRef} className="flex flex-col h-screen w-screen overflow-hidden select-none"
      style={{ background: "hsl(222 22% 2%)", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between h-11 px-4 flex-shrink-0 border-b"
        style={{ background: "hsl(222 20% 4%)", borderColor: "hsl(222 16% 10%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${TEAL})` }} />
          <span className="text-[11px] font-semibold tracking-widest uppercase"
            style={{ color: `hsl(${TEAL})` }}>AI Effectiveness Sprint</span>
          <span className="text-[10px] font-mono ml-2" style={{ color: `hsl(${MUT})` }}>
            {current + 1} / {TOTAL}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white"
            onClick={() => setGridView(v => !v)} title="Grid (G)">
            <Grid3x3 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-white/40 hover:text-white"
            onClick={toggleFS} title="Fullscreen (F)">
            {fullscreen ? <X className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar thumbnails ── */}
        {!gridView && (
          <div className="w-[170px] flex-shrink-0 flex flex-col gap-2 p-2 overflow-y-auto border-r"
            style={{ background: "hsl(222 22% 3%)", borderColor: "hsl(222 16% 9%)" }}>
            {SLIDES.map((_, i) => (
              <Thumbnail key={i} idx={i} active={i === current} onClick={() => setCurrent(i)} />
            ))}
          </div>
        )}

        {/* ── Main canvas ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {gridView ? (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-4 gap-6 max-w-[1400px] mx-auto">
                {SLIDES.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrent(i); setGridView(false); }}
                    className={cn("rounded-xl overflow-hidden border-2 transition-all text-left",
                      i === current ? "border-teal-400" : "border-white/10 hover:border-white/30"
                    )}
                    style={{ aspectRatio: "16/9" }}>
                    {(() => { const C2 = SLIDES[i].component; return <ScaledSlide><C2 /></ScaledSlide>; })()}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden p-6">
              <div className="w-full h-full rounded-xl overflow-hidden border"
                style={{ borderColor: "hsl(222 14% 12%)" }}>
                <ScaledSlide><CurrentSlide /></ScaledSlide>
              </div>
            </div>
          )}

          {/* ── Nav bar ── */}
          {!gridView && (
            <div className="flex items-center justify-center gap-4 h-12 flex-shrink-0 border-t"
              style={{ borderColor: "hsl(222 16% 10%)" }}>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white"
                onClick={prev} disabled={current === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-1.5">
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)}
                    className="transition-all rounded-full"
                    style={{
                      width: i === current ? 20 : 6, height: 6,
                      background: i === current ? `hsl(${TEAL})` : "hsl(215 10% 30%)"
                    }} />
                ))}
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white"
                onClick={next} disabled={current === TOTAL - 1}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

