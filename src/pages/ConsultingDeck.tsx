import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Maximize2, Grid3x3, X,
  Brain, Target, Zap, BookOpen, TrendingUp, CheckCircle2,
  ArrowRight, AlertTriangle, Clock, Award, Layers, Lock,
  Download, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import istvanPhoto from "@/assets/istvan-boscha.png";
import kristofPhoto from "@/assets/kristof-eger.png";

// ─── Scale container ──────────────────────────────────────────────────────────

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

// ─── Design tokens ────────────────────────────────────────────────────────────

const BG   = "hsl(20 8% 4%)";
const BG2  = "hsl(20 6% 7%)";
const C    = "30 20% 92%";
const MUT  = "25 8% 50%";
const ORG  = "28 95% 55%";   // amber/orange — DriveImpact brand
const TEAL = "180 55% 40%";  // LizaOS teal
const RED  = "0 70% 58%";

function Grid() {
  return (
    <div className="absolute inset-0 opacity-[0.025]" style={{
      backgroundImage: `linear-gradient(hsl(${ORG}) 1px, transparent 1px), linear-gradient(90deg, hsl(${ORG}) 1px, transparent 1px)`,
      backgroundSize: "100px 100px"
    }} />
  );
}

function Bar() {
  return <div className="absolute bottom-0 left-0 right-0 h-[3px]"
    style={{ background: `linear-gradient(90deg, hsl(${ORG}), hsl(${TEAL}))` }} />;
}

function LeftAccent() {
  return <div className="absolute left-0 top-0 bottom-0 w-[5px]"
    style={{ background: `linear-gradient(180deg, hsl(${ORG}), hsl(${TEAL}))` }} />;
}

function Tag({ label }: { label: string }) {
  return (
    <p className="font-bold tracking-[0.22em] uppercase mb-8"
      style={{ fontSize: 22, color: `hsl(${ORG})` }}>{label}</p>
  );
}

function Chip({ children, color = ORG }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border font-semibold"
      style={{ fontSize: 21, borderColor: `hsl(${color} / 0.45)`, background: `hsl(${color} / 0.08)`, color: `hsl(${color})` }}>
      {children}
    </span>
  );
}

// ─── Slide 01 — Gut Punch Cover ───────────────────────────────────────────────

function Slide01Cover() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      {/* Glow */}
      <div className="absolute right-0 top-0 w-[900px] h-[900px] rounded-full opacity-[0.07]"
        style={{ background: `radial-gradient(circle, hsl(${ORG}), transparent 70%)`, transform: "translate(25%, -25%)" }} />

      {/* Left — main message */}
      <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[1080px] relative z-10">
        <div className="mb-10 flex items-center gap-4">
          <Chip>DriveImpact × LIZA OS</Chip>
          <Chip color={TEAL}>For agencies & consultancies</Chip>
        </div>

        <h1 className="font-black leading-[1.0] mb-10" style={{ fontSize: 108, color: `hsl(${C})` }}>
          Clients won't pay
          <br />
          for what{" "}
          <span style={{
            background: `linear-gradient(135deg, hsl(${ORG}), hsl(28 100% 70%))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>ChatGPT</span>
          <br />
          can do.
        </h1>

        <p style={{ fontSize: 36, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 860 }}>
          Frameworks are commodities.
          <br />
          We help you identify and package{" "}
          <strong style={{ color: `hsl(${C})` }}>what's left that only you can deliver.</strong>
        </p>

        <div className="flex items-center gap-6 mt-14">
          <Chip color={ORG}>4-Week Sprint</Chip>
          <Chip color={TEAL}>Identify → Package → Defend</Chip>
        </div>
      </div>

      {/* Right — three-tier visual */}
      <div className="flex flex-col justify-center flex-1 pr-[120px] gap-5 relative z-10">
        {[
          { label: "Replicable by AI", sub: "Your frameworks & templates", price: "€0", note: "What clients will pay for this", col: RED, dim: true },
          { label: "Hard to scale", sub: "Your senior expert time", price: "Requires your presence", note: "Limited by headcount", col: MUT, dim: true },
          { label: "What's left, packaged", sub: "Your unique value, codified", price: "€6K+/mo", note: "Recurring license revenue", col: ORG, dim: false },
        ].map((t, i) => (
          <div key={i} className="rounded-2xl p-8 border relative overflow-hidden"
            style={{ background: t.dim ? "transparent" : `hsl(${ORG} / 0.06)`, borderColor: `hsl(${t.col} / ${t.dim ? "0.18" : "0.5"})`, opacity: t.dim ? 0.6 : 1 }}>
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `hsl(${t.col})` }} />
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold tracking-widest uppercase mb-1" style={{ fontSize: 18, color: `hsl(${t.col})` }}>{t.label}</p>
                <p className="font-semibold" style={{ fontSize: 28, color: `hsl(${C})` }}>{t.sub}</p>
                <p style={{ fontSize: 20, color: `hsl(${MUT})`, marginTop: 4 }}>{t.note}</p>
              </div>
              <div className="text-right">
                <p className="font-black" style={{ fontSize: 32, color: `hsl(${t.col})` }}>{t.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 02 — The New Reality ───────────────────────────────────────────────

function Slide02Reality() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="The New Reality" />
        <h2 className="font-black mb-6" style={{ fontSize: 88, color: `hsl(${C})`, lineHeight: 1.05 }}>
          What's left that
          <br />
          <span style={{ color: `hsl(${ORG})` }}>only you can deliver?</span>
        </h2>
        <p className="mb-16" style={{ fontSize: 34, color: `hsl(${MUT})` }}>
          See what AI has commoditized, what remains uniquely yours, and how to package it.
        </p>

        <div className="grid grid-cols-3 gap-8">
          {[
            {
              label: "Replicable by AI",
              col: RED,
              title: "Your frameworks & templates",
              desc: "The standard deliverables your clients used to pay premium rates for. Strategy decks, campaign briefs, research reports — AI produces these in seconds.",
              tag: "€0 · commodity",
            },
            {
              label: "Hard to scale",
              col: MUT,
              title: "Your senior expert time",
              desc: "The judgment calls, the pattern recognition, the contextual decision-making. AI can't do this, but it doesn't scale without you in the room.",
              tag: "Limited by headcount",
            },
            {
              label: "What's left, packaged",
              col: ORG,
              title: "Your judgment, standardised",
              desc: "Turn senior expertise into executable protocols that run without you in the room. Standardise judgment across every team member.",
              tag: "€6K+/mo recurring",
            },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl p-10 border relative overflow-hidden"
              style={{ background: i === 2 ? `hsl(${ORG} / 0.06)` : BG2, borderColor: `hsl(${c.col} / ${i === 2 ? "0.5" : "0.2"})` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${c.col})` }} />
              <p className="font-bold tracking-widest uppercase mb-3" style={{ fontSize: 18, color: `hsl(${c.col})` }}>{c.label}</p>
              <h3 className="font-bold mb-4" style={{ fontSize: 30, color: `hsl(${C})` }}>{c.title}</h3>
              <p style={{ fontSize: 23, color: `hsl(${MUT})`, lineHeight: 1.55 }}>{c.desc}</p>
              <div className="mt-6 px-4 py-2 rounded-lg inline-block" style={{ background: `hsl(${c.col} / 0.1)` }}>
                <span className="font-bold" style={{ fontSize: 20, color: `hsl(${c.col})` }}>{c.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 03 — The Urgency ───────────────────────────────────────────────────

function Slide03Urgency() {
  const signals = [
    { q: "\"Can't we just use AI for this?\"", desc: "Clients are already questioning your deliverables. The conversation has started, whether you're ready or not." },
    { q: "Fee pressure on standard work", desc: "What used to be premium is becoming commodity. Margins are compressing on your most common deliverables." },
    { q: "Competitors are moving", desc: "The first movers in your space will define what 'productized expertise' looks like. Everyone else competes on price." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex h-full">
        {/* Left */}
        <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[860px] flex-shrink-0">
          <Tag label="The Urgency" />
          <h2 className="font-black leading-tight mb-10" style={{ fontSize: 82, color: `hsl(${C})` }}>
            The window is
            <br />
            <span style={{ color: `hsl(${ORG})` }}>12–18 months.</span>
          </h2>
          <p style={{ fontSize: 32, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
            This is the period where market positions get defined.
            The firms that codify their expertise now will be the ones clients see as <em style={{ color: `hsl(${C})` }}>"the standard."</em>
            <br /><br />
            Everyone else competes on price.
          </p>
        </div>

        {/* Right — signals */}
        <div className="flex flex-col justify-center flex-1 pr-[120px] gap-7">
          <p className="font-bold tracking-widest uppercase mb-2" style={{ fontSize: 20, color: `hsl(${MUT})` }}>You might be feeling these already</p>
          {signals.map((s, i) => (
            <div key={i} className="rounded-2xl p-8 border" style={{ background: BG2, borderColor: `hsl(${ORG} / 0.15)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 28, color: `hsl(${C})` }}>"{s.q}"</p>
              <p style={{ fontSize: 23, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 04 — What You've Tried ────────────────────────────────────────────

function Slide04Tried() {
  const tried = [
    { label: "AI workshops & prompt training", why: "Skills without infrastructure. Knowledge evaporates without a system to embed it." },
    { label: "Workflow automation", why: "You accelerated what AI will do for free. Efficiency without differentiation." },
    { label: "AI agents & assistants", why: "They run on public data. They can't access the judgment in your senior heads." },
    { label: "Documentation & playbooks", why: "Static docs capture 'what' but not 'why.' Out of date the moment they're written." },
    { label: "Knowledge bases & wikis", why: "Searchable information, not executable judgment. You organised your frameworks, the commoditisable part." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="What You've Probably Tried" />
        <h2 className="font-black mb-4" style={{ fontSize: 76, color: `hsl(${C})` }}>
          And why it hasn't worked.
        </h2>
        <p className="mb-12" style={{ fontSize: 30, color: `hsl(${MUT})` }}>
          Every approach focuses on the wrong data: your frameworks and processes. That's exactly what AI commoditises.
        </p>

        <div className="space-y-4">
          {tried.map((t, i) => (
            <div key={i} className="flex items-start gap-8 px-8 py-6 rounded-xl border"
              style={{ background: BG2, borderColor: `hsl(${RED} / 0.12)` }}>
              <AlertTriangle style={{ width: 32, height: 32, flexShrink: 0, marginTop: 4, color: `hsl(${RED} / 0.6)` }} />
              <div className="flex items-start gap-8 flex-1">
                <p className="font-bold flex-shrink-0 w-[440px]" style={{ fontSize: 26, color: `hsl(${C})` }}>{t.label}</p>
                <div className="w-[1px] self-stretch" style={{ background: `hsl(${RED} / 0.15)` }} />
                <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.4 }}>→ {t.why}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-7 rounded-2xl border" style={{ background: `hsl(${ORG} / 0.06)`, borderColor: `hsl(${ORG} / 0.3)` }}>
          <p style={{ fontSize: 26, color: `hsl(${C})`, lineHeight: 1.5 }}>
            <strong style={{ color: `hsl(${ORG})` }}>The systemic issue:</strong>{" "}
            All these approaches catch the fringes of what makes you different, not the core.
            The real value is the judgment, pattern recognition, and decision-making logic in your senior heads.
            That's what AI can't replicate. And none of these approaches touch it.
          </p>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 05 — The Root Cause ────────────────────────────────────────────────

function Slide05RootCause() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="absolute w-[700px] h-[700px] rounded-full opacity-[0.07]"
        style={{ background: `radial-gradient(circle, hsl(${ORG}), transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

      {/* Left */}
      <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[900px] relative z-10">
        <Tag label="The Root Cause" />
        <h2 className="font-black leading-tight mb-10" style={{ fontSize: 78, color: `hsl(${C})` }}>
          Everything you've documented
          <br />is already commoditised.
          <br />
          <span style={{ color: `hsl(${ORG})` }}>The tacit layer is untouched.</span>
        </h2>
        <p style={{ fontSize: 28, color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          Your documents, SOPs, and frameworks are explicit knowledge.
          AI can approximate them today.
          <br /><br />
          What clients <em style={{ color: `hsl(${C})` }}>actually</em> pay for is the tacit layer:
          the judgment, pattern recognition, and decision logic your seniors carry in their heads. Never written down.
        </p>
      </div>

      {/* Right — two layers */}
      <div className="flex flex-col justify-center flex-1 pr-[120px] gap-6 relative z-10">
        {/* Explicit */}
        <div className="rounded-2xl p-10 border" style={{ background: BG2, borderColor: `hsl(${MUT} / 0.2)`, opacity: 0.7 }}>
          <div className="flex items-center gap-4 mb-5">
            <BookOpen style={{ width: 36, height: 36, color: `hsl(${MUT})` }} />
            <span className="font-bold tracking-widest uppercase" style={{ fontSize: 19, color: `hsl(${MUT})` }}>Explicit Layer: What AI Already Has</span>
          </div>
          <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
            Documents · Frameworks · Templates · SOPs · Playbooks
            <br />
            <span style={{ fontSize: 20 }}>Replicable. Commoditised. What your competitors load too.</span>
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px]" style={{ background: `hsl(${ORG} / 0.3)` }} />
          <span className="font-bold" style={{ fontSize: 20, color: `hsl(${ORG})` }}>What we surface</span>
          <div className="flex-1 h-[1px]" style={{ background: `hsl(${ORG} / 0.3)` }} />
        </div>

        {/* Tacit */}
        <div className="rounded-2xl p-10 border" style={{ background: `hsl(${ORG} / 0.06)`, borderColor: `hsl(${ORG} / 0.5)` }}>
          <div className="flex items-center gap-4 mb-5">
            <Brain style={{ width: 36, height: 36, color: `hsl(${ORG})` }} />
            <span className="font-bold tracking-widest uppercase" style={{ fontSize: 19, color: `hsl(${ORG})` }}>Tacit Layer: What Lives in Expert Heads</span>
          </div>
          <p style={{ fontSize: 24, color: `hsl(${C})`, lineHeight: 1.5 }}>
            Judgment calls · Adaptive heuristics · Pattern recognition · Decision logic
            <br />
            <span style={{ fontSize: 20, color: `hsl(${ORG})` }}>This is what clients pay for. And what no competitor can replicate.</span>
          </p>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 06 — The Mechanism (LizaOS) ───────────────────────────────────────

function Slide06Mechanism() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      {/* Teal glow */}
      <div className="absolute right-0 top-0 w-[700px] h-[700px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)`, transform: "translate(20%, -20%)" }} />

      {/* Left */}
      <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[860px] relative z-10">
        <Tag label="Why This Works — The Infrastructure" />
        <h2 className="font-black leading-tight mb-8" style={{ fontSize: 76, color: `hsl(${C})` }}>
          Not interviews
          <br />with a PDF at the end.
          <br />
          <span style={{ color: `hsl(${TEAL})` }}>Everything runs in LizaOS.</span>
        </h2>
        <p style={{ fontSize: 28, color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          Most consultants extract knowledge through workshops and hand you a document.
          We embed into your actual work using LizaOS: execution infrastructure built specifically for complex human judgment.
          <br /><br />
          <strong style={{ color: `hsl(${C})` }}>You extract by doing, not by documenting.</strong>
        </p>

        <div className="mt-10 p-6 rounded-xl border" style={{ background: `hsl(${TEAL} / 0.06)`, borderColor: `hsl(${TEAL} / 0.3)` }}>
          <p style={{ fontSize: 22, color: `hsl(${TEAL})`, lineHeight: 1.5 }}>
            "Your methodology becomes operational, not theoretical. Built over 4 years specifically for this. No other consultant has it."
          </p>
        </div>
      </div>

      {/* Right — system diagram */}
      <div className="flex flex-col justify-center flex-1 pr-[100px] gap-5 relative z-10">
        <p className="font-bold tracking-widest uppercase mb-2" style={{ fontSize: 19, color: `hsl(${MUT})` }}>How tacit knowledge becomes executable</p>

        {[
          {
            n: "1", icon: <Target style={{ width: 32, height: 32 }} />, label: "Surface",
            desc: "Map your methodology landscape. Identify what's uniquely yours vs. what AI already commoditises.",
            col: ORG,
          },
          {
            n: "2", icon: <Brain style={{ width: 32, height: 32 }} />, label: "Structure",
            desc: "Your experts work in LizaOS on their hardest tasks. Tacit judgment becomes structured playbooks: executable, not theoretical.",
            col: ORG,
          },
          {
            n: "3", icon: <Layers style={{ width: 32, height: 32 }} />, label: "Embed",
            desc: "Playbooks run in real workflows. Every team member follows your best methodology, with AI adapting at each step.",
            col: TEAL,
          },
          {
            n: "4", icon: <Lock style={{ width: 32, height: 32 }} />, label: "Package",
            desc: "Final audit, 30-day implementation roadmap. You own everything. No lock-in.",
            col: TEAL,
          },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-6 p-6 rounded-xl border"
            style={{ background: BG2, borderColor: `hsl(${s.col} / 0.2)` }}>
            <div className="flex-shrink-0 w-10 flex items-center justify-center" style={{ color: `hsl(${s.col})` }}>
              {s.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-mono font-bold" style={{ fontSize: 18, color: `hsl(${s.col})` }}>Step {s.n}</span>
                <span className="font-bold" style={{ fontSize: 24, color: `hsl(${C})` }}>{s.label}</span>
              </div>
              <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 07 — What You Get ──────────────────────────────────────────────────

function Slide07Deliverables() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="What You Walk Away With" />
        <h2 className="font-black mb-14" style={{ fontSize: 84, color: `hsl(${C})` }}>
          3 deliverables. Yours forever.
        </h2>

        <div className="grid grid-cols-3 gap-10">
          {[
            {
              n: "01", icon: <BookOpen style={{ width: 52, height: 52 }} />,
              label: "Document",
              title: "Methodology Audit",
              desc: "Complete map of what makes you distinctive. Your unique judgment, decision logic, and heuristics — surfaced and named.",
              col: ORG,
            },
            {
              n: "02", icon: <Zap style={{ width: 52, height: 52 }} />,
              label: "Executable",
              title: "Digital Playbooks",
              desc: "Your expertise as executable protocols that run without you in the room, standardising judgment across every team member.",
              col: TEAL,
            },
            {
              n: "03", icon: <TrendingUp style={{ width: 52, height: 52 }} />,
              label: "Roadmap",
              title: "30-Day Implementation Plan",
              desc: "How to deploy, scale, and license what you've built. Week 7, 14, and 30 milestones. You own it completely.",
              col: ORG,
            },
          ].map((d, i) => (
            <div key={i} className="rounded-2xl p-10 border relative overflow-hidden flex flex-col"
              style={{ background: BG2, borderColor: `hsl(${d.col} / 0.25)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${d.col})` }} />
              <div className="mb-4" style={{ color: `hsl(${d.col})` }}>{d.icon}</div>
              <span className="font-bold tracking-widest uppercase mb-2" style={{ fontSize: 18, color: `hsl(${d.col})` }}>{d.label}</span>
              <h3 className="font-bold mb-5" style={{ fontSize: 36, color: `hsl(${C})` }}>{d.title}</h3>
              <p style={{ fontSize: 25, color: `hsl(${MUT})`, lineHeight: 1.55 }}>{d.desc}</p>
            </div>
          ))}
        </div>

        {/* Proof bar */}
        <div className="mt-10 flex items-center gap-10 p-8 rounded-2xl border"
          style={{ background: `hsl(${ORG} / 0.05)`, borderColor: `hsl(${ORG} / 0.2)` }}>
          <span style={{ fontSize: 22, color: `hsl(${MUT})` }}>Recent engagement · B2B Marketing Agency · 80 staff</span>
          {[
            { n: "4 weeks", label: "to first knowledge product" },
            { n: "3×", label: "margin on packaged methodology" },
            { n: "35%", label: "avg. productivity gain" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-[1px] self-stretch" style={{ background: `hsl(${ORG} / 0.2)` }} />
              <div>
                <p className="font-black" style={{ fontSize: 36, color: `hsl(${ORG})` }}>{s.n}</p>
                <p style={{ fontSize: 19, color: `hsl(${MUT})` }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 08 — The Stakes ────────────────────────────────────────────────────

function Slide08Stakes() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex h-full items-center pl-[160px] pr-[120px] gap-20 w-full">
        {/* Center label */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0 w-[200px]">
          <Tag label="12–18 months" />
          <Clock style={{ width: 64, height: 64, color: `hsl(${ORG})` }} />
          <p className="text-center font-bold" style={{ fontSize: 24, color: `hsl(${ORG})` }}>The window closes</p>
        </div>

        {/* If you wait */}
        <div className="flex-1 rounded-2xl p-12 border" style={{ background: BG2, borderColor: `hsl(${RED} / 0.2)` }}>
          <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: `hsl(${RED})` }} />
          <p className="font-bold tracking-widest uppercase mb-6" style={{ fontSize: 20, color: `hsl(${RED})` }}>If you wait</p>
          <h3 className="font-bold mb-8" style={{ fontSize: 42, color: `hsl(${C})` }}>Obsolescence</h3>
          {[
            "What you deliver becomes indistinguishable from AI",
            "Clients stop paying premium for your expertise",
            "Nothing left that only you can deliver",
            "Margins collapse as you compete with free",
          ].map((l, i) => (
            <div key={i} className="flex items-start gap-4 mb-4">
              <X style={{ width: 24, height: 24, flexShrink: 0, marginTop: 3, color: `hsl(${RED})` }} />
              <p style={{ fontSize: 25, color: `hsl(${MUT})` }}>{l}</p>
            </div>
          ))}
        </div>

        <ArrowRight style={{ width: 52, height: 52, flexShrink: 0, color: `hsl(${MUT} / 0.4)` }} />

        {/* If you act */}
        <div className="flex-1 rounded-2xl p-12 border relative overflow-hidden" style={{ background: `hsl(${ORG} / 0.05)`, borderColor: `hsl(${ORG} / 0.4)` }}>
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${ORG})` }} />
          <p className="font-bold tracking-widest uppercase mb-6" style={{ fontSize: 20, color: `hsl(${ORG})` }}>If you act now</p>
          <h3 className="font-bold mb-8" style={{ fontSize: 42, color: `hsl(${C})` }}>Defensible Position</h3>
          {[
            "What's left that's yours becomes a scalable product",
            "Your unique value is clear — and priced accordingly",
            "New revenue from licensing what only you can deliver",
            "AI amplifies your edge instead of erasing it",
          ].map((l, i) => (
            <div key={i} className="flex items-start gap-4 mb-4">
              <CheckCircle2 style={{ width: 24, height: 24, flexShrink: 0, marginTop: 3, color: `hsl(${ORG})` }} />
              <p style={{ fontSize: 25, color: `hsl(${C})` }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 09 — Your Options ──────────────────────────────────────────────────

function Slide09Options() {
  const opts = [
    {
      label: "Bring in consultants / training",
      col: MUT,
      tag: "⚠ Wrong data",
      items: [
        "Workshops on prompts, agents, automation",
        "Doesn't solve the wrong-data problem",
        "No infrastructure to make it stick",
      ],
      warn: "You learn tactics, but your core differentiator stays untouched.",
      us: false,
    },
    {
      label: "Build it internally",
      col: MUT,
      tag: "⚠ Three hard things at once",
      items: [
        "Deploy new tech + change management",
        "Upfront investment in unknowns",
        "Senior time on trial and error",
      ],
      warn: "You're combining three hard things at once, with no proven path.",
      us: false,
    },
    {
      label: "Work with us",
      col: ORG,
      tag: "✓ Fast, combined, testable",
      items: [
        "4 weeks to first knowledge product",
        "Everything runs in LizaOS. Test immediately.",
        "We handle tech + change management together",
      ],
      warn: "You keep everything you build. No lock-in after.",
      us: true,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="Your Options" />
        <h2 className="font-black mb-14" style={{ fontSize: 84, color: `hsl(${C})` }}>
          Three paths. Different risk profiles.
        </h2>

        <div className="grid grid-cols-3 gap-10">
          {opts.map((o, i) => (
            <div key={i} className="rounded-2xl p-10 border relative overflow-hidden flex flex-col"
              style={{ background: o.us ? `hsl(${ORG} / 0.06)` : BG2, borderColor: `hsl(${o.col} / ${o.us ? "0.5" : "0.2"})` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${o.col})` }} />
              <p className="font-bold mb-4" style={{ fontSize: 18, color: `hsl(${o.col})` }}>{o.tag}</p>
              <h3 className="font-bold mb-8" style={{ fontSize: 30, color: `hsl(${C})` }}>{o.label}</h3>
              <div className="space-y-4 flex-1">
                {o.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <ArrowRight style={{ width: 20, height: 20, flexShrink: 0, marginTop: 4, color: `hsl(${o.col})` }} />
                    <p style={{ fontSize: 23, color: `hsl(${MUT})` }}>{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-5 rounded-xl" style={{ background: `hsl(${o.col} / 0.08)` }}>
                <p style={{ fontSize: 22, color: o.us ? `hsl(${ORG})` : `hsl(${MUT})`, fontWeight: o.us ? 600 : 400 }}>{o.warn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 10 — Who Built This ────────────────────────────────────────────────

function Slide10Who() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="absolute left-[50%] top-[50%] w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)`, transform: "translate(-50%, -50%)" }} />

      <div className="relative z-10 flex h-full">
        {/* Left */}
        <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[800px]">
          <Tag label="Who Built This" />
          <h2 className="font-black leading-tight mb-8" style={{ fontSize: 72, color: `hsl(${C})` }}>
            Built by Experts,
            <br />Guided by
            <br />
            <span style={{ color: `hsl(${TEAL})` }}>Industry Leaders.</span>
          </h2>
          <p style={{ fontSize: 26, color: `hsl(${MUT})`, lineHeight: 1.65, maxWidth: 640 }}>
            We kept seeing the same pattern: firms full of senior expertise, no way to scale it.
            Knowledge trapped in heads. Handoffs broken. Junior staff unable to execute with senior judgment.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col justify-center flex-1 pr-[100px] gap-4">
          <p className="font-bold tracking-widest uppercase mb-1" style={{ fontSize: 18, color: `hsl(${ORG})` }}>Founding Team</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: "István Boscha", role: "Product Vision & Capital-Efficient CEO", bio: "Founder of Aliz.ai, a Google Cloud Professional Services Partner. 15 years in AI transformation globally.", photo: istvanPhoto, initials: "IB" },
              { name: "Kristóf Éger", role: "Enterprise Narrative & Go-to-Market", bio: "AI-driven business strategist, embedding AI into decision-making workflows.", photo: kristofPhoto, initials: "KÉ" },
              { name: "Zoltán Kauker", role: "Scalable AI Architecture & Enterprise Security", bio: "Deep-tech AI and data engineering expert, leading AI-driven decision systems.", photo: null as string | null, initials: "ZK" },
            ].map((p, i) => (
              <div key={i} className="rounded-xl p-5 border" style={{ background: BG2, borderColor: `hsl(${TEAL} / 0.2)` }}>
                <div className="flex items-center gap-3 mb-3">
                  {p.photo ? (
                    <img src={p.photo} alt={p.name} className="w-10 h-10 rounded-full object-cover shrink-0"
                      style={{ border: `2px solid hsl(${TEAL} / 0.3)` }} />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
                      style={{ background: `hsl(${TEAL} / 0.15)`, color: `hsl(${TEAL})`, fontSize: 16 }}>
                      {p.initials}
                    </div>
                  )}
                  <div>
                    <p className="font-bold" style={{ fontSize: 20, color: `hsl(${C})` }}>{p.name}</p>
                    <p style={{ fontSize: 14, color: `hsl(${ORG})` }}>{p.role}</p>
                  </div>
                </div>
                <p style={{ fontSize: 16, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{p.bio}</p>
              </div>
            ))}
          </div>

          <p className="font-bold tracking-widest uppercase mt-2 mb-1" style={{ fontSize: 18, color: `hsl(${ORG})` }}>Strategic Advisory Board</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Tom Ray", role: "Chairman, Aliz.ai; Founding CEO, EdgeCore Data Centers", bio: "Leader in scaling global tech service companies and building enterprise infrastructure." },
              { name: "Sylwester Pawluk", role: "Former Head of a Major US Tech Platform (Austria)", bio: "Proven GTM leadership, scaled tech giant in European market (>$100M P&L)." },
            ].map((a, i) => (
              <div key={i} className="rounded-xl p-5 border" style={{ background: `hsl(${ORG} / 0.04)`, borderColor: `hsl(${ORG} / 0.2)` }}>
                <p className="font-bold mb-1" style={{ fontSize: 20, color: `hsl(${C})` }}>{a.name}</p>
                <p className="mb-2" style={{ fontSize: 14, color: `hsl(${ORG})` }}>{a.role}</p>
                <p style={{ fontSize: 16, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{a.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 11 — CTA ───────────────────────────────────────────────────────────

function Slide11CTA() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="absolute w-[1000px] h-[1000px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${ORG}), transparent 70%)` }} />

      <div className="relative z-10 text-center px-40 max-w-[1500px]">
        <Tag label="Next Step" />
        <h2 className="font-black mb-6" style={{ fontSize: 100, color: `hsl(${C})`, lineHeight: 1.0 }}>
          The window is
          <br />
          <span style={{
            background: `linear-gradient(135deg, hsl(${ORG}), hsl(28 100% 72%))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>12–18 months.</span>
        </h2>

        <p className="mb-6" style={{ fontSize: 36, color: `hsl(${MUT})`, lineHeight: 1.6 }}>
          The firms that identify and package their unique expertise first
          <br />
          will define their categories. Everyone else competes on price.
        </p>

        <p className="mb-14" style={{ fontSize: 30, color: `hsl(${C})` }}>
          <strong>30 minutes.</strong> We'll map your expertise landscape and identify what's worth protecting.
          <br />
          <span style={{ color: `hsl(${MUT})` }}>No pitch. No obligation. Just clarity on whether this applies to you.</span>
        </p>

        <div className="flex items-center justify-center gap-12 mb-14">
          {[
            { n: "01", label: "30-min call to map your expertise" },
            { n: "02", label: "Identify what's uniquely yours & at risk" },
            { n: "03", label: "Scope the 4-week engagement" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border"
                style={{ background: BG2, borderColor: `hsl(${ORG} / 0.2)`, minWidth: 280 }}>
                <span className="font-mono font-bold" style={{ fontSize: 26, color: `hsl(${ORG})` }}>{s.n}</span>
                <span style={{ fontSize: 24, color: `hsl(${C})` }}>{s.label}</span>
              </div>
              {i < 2 && <ArrowRight style={{ width: 32, height: 32, color: `hsl(${MUT})`, flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6">
          <a href="https://calendar.app.google/3v8jevUcsgRQnLyL9" target="_blank" rel="noopener noreferrer"
            className="px-10 py-5 rounded-2xl border font-bold inline-block hover:opacity-90 transition-opacity"
            style={{ fontSize: 28, background: `hsl(${ORG} / 0.12)`, borderColor: `hsl(${ORG} / 0.4)`, color: `hsl(${ORG})` }}>
            Free Discovery Call — Book Now
          </a>
          <div className="flex flex-col items-center gap-2 px-6 py-5 rounded-2xl border"
            style={{ borderColor: `hsl(${MUT} / 0.2)` }}>
            <div className="flex items-center gap-3">
              <Award style={{ width: 24, height: 24, color: `hsl(${MUT})` }} />
              <span style={{ fontSize: 22, color: `hsl(${MUT})` }}>Limited capacity — few firms per quarter</span>
            </div>
            <span style={{ fontSize: 18, color: `hsl(${MUT} / 0.7)` }}>kristof.eger@lizaos.ai</span>
          </div>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide registry ───────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, label: "The Hook", component: Slide01Cover },
  { id: 2, label: "The Reality", component: Slide02Reality },
  { id: 3, label: "The Urgency", component: Slide03Urgency },
  { id: 4, label: "What You've Tried", component: Slide04Tried },
  { id: 5, label: "Root Cause", component: Slide05RootCause },
  { id: 6, label: "The Mechanism", component: Slide06Mechanism },
  { id: 7, label: "Deliverables", component: Slide07Deliverables },
  { id: 8, label: "The Stakes", component: Slide08Stakes },
  { id: 9, label: "Your Options", component: Slide09Options },
  { id: 10, label: "Who Built This", component: Slide10Who },
  { id: 11, label: "Next Step", component: Slide11CTA },
];

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function ConsultingDeck() {
  const [current, setCurrent] = useState(0);
  const [grid, setGrid] = useState(false);
  const [fs, setFs] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 200));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(undefined))));
    await new Promise(r => setTimeout(r, 300));
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const container = exportRef.current;
      if (!container) return;
      const slideEls = Array.from(container.children) as HTMLElement[];
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] });
      for (let i = 0; i < slideEls.length; i++) {
        if (i > 0) pdf.addPage([1920, 1080], 'landscape');
        const gradientEls = slideEls[i].querySelectorAll<HTMLElement>('[style*="background-clip"]');
        const origStyles: string[] = [];
        gradientEls.forEach((el) => {
          origStyles.push(el.style.cssText);
          el.style.background = 'none';
          el.style.webkitBackgroundClip = 'unset';
          el.style.webkitTextFillColor = 'hsl(180, 80%, 60%)';
        });
        const canvas = await html2canvas(slideEls[i], { width: 1920, height: 1080, scale: 2, useCORS: true, backgroundColor: null });
        gradientEls.forEach((el, j) => { el.style.cssText = origStyles[j]; });
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 1920, 1080);
      }
      pdf.save('LIZA-OS-Sales-Deck.pdf');
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") setCurrent(c => Math.min(c + 1, SLIDES.length - 1));
      if (e.key === "ArrowLeft") setCurrent(c => Math.max(c - 1, 0));
      if (e.key === "g" || e.key === "G") setGrid(v => !v);
      if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
        else document.exitFullscreen().catch(() => {});
      }
      if (e.key === "Escape") setGrid(false);
    };
    window.addEventListener("keydown", handler);
    const onFsChange = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => { window.removeEventListener("keydown", handler); document.removeEventListener("fullscreenchange", onFsChange); };
  }, []);

  const Slide = SLIDES[current].component;

  return (
    <div className="flex flex-col h-screen" style={{ background: "hsl(20 8% 3%)" }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
        style={{ borderColor: "hsl(25 8% 12%)", background: "hsl(20 8% 4%)" }}>
        <div className="flex items-center gap-4">
          <div className="w-7 h-7 rounded flex items-center justify-center font-black text-sm"
            style={{ background: `hsl(${ORG})`, color: "hsl(20 8% 4%)" }}>D</div>
          <span className="font-semibold" style={{ fontSize: 14, color: `hsl(${C})` }}>DriveImpact Advisory</span>
          <span style={{ fontSize: 12, color: `hsl(${MUT})` }}>·</span>
          <span style={{ fontSize: 13, color: `hsl(${MUT})` }}>{SLIDES[current].label}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setGrid(v => !v)}
            className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              grid ? "text-white" : "text-gray-400 hover:text-white")}
            style={{ background: grid ? `hsl(${ORG} / 0.15)` : "transparent" }}>
            <Grid3x3 size={15} /> Grid
          </button>
          <button onClick={handleExportPdf} disabled={exporting}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-50">
            {exporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            {exporting ? "Exporting..." : "PDF"}
          </button>
          <button onClick={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {}); else document.exitFullscreen().catch(() => {}); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors">
            <Maximize2 size={15} /> {fs ? "Exit" : "Present"}
          </button>
          <span className="font-mono text-sm" style={{ color: `hsl(${MUT})` }}>
            {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[180px] flex-shrink-0 overflow-y-auto py-4 px-3 border-r space-y-2"
          style={{ borderColor: "hsl(25 8% 10%)", background: "hsl(20 8% 3%)" }}>
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => { setCurrent(i); setGrid(false); }}
              className="w-full rounded-lg overflow-hidden border transition-all"
              style={{
                borderColor: i === current ? `hsl(${ORG} / 0.6)` : "hsl(25 8% 12%)",
                background: i === current ? `hsl(${ORG} / 0.06)` : "transparent",
              }}>
              <div className="w-full aspect-video">
                <ScaledSlide><s.component /></ScaledSlide>
              </div>
              <div className="px-2 py-1.5 flex items-center gap-2">
                <span className="font-mono font-bold" style={{ fontSize: 10, color: i === current ? `hsl(${ORG})` : `hsl(${MUT})` }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="truncate" style={{ fontSize: 10, color: i === current ? `hsl(${C})` : `hsl(${MUT})` }}>
                  {s.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {grid ? (
            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-3 gap-6"
              style={{ background: "hsl(20 8% 3%)" }}>
              {SLIDES.map((s, i) => (
                <button key={s.id} onClick={() => { setCurrent(i); setGrid(false); }}
                  className="rounded-xl overflow-hidden border transition-all"
                  style={{ borderColor: i === current ? `hsl(${ORG} / 0.6)` : "hsl(25 8% 14%)" }}>
                  <div className="w-full aspect-video">
                    <ScaledSlide><s.component /></ScaledSlide>
                  </div>
                  <div className="px-4 py-2 flex items-center gap-3" style={{ background: "hsl(20 8% 5%)" }}>
                    <span className="font-mono font-bold" style={{ fontSize: 13, color: `hsl(${ORG})` }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 13, color: `hsl(${MUT})` }}>{s.label}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-6">
                <ScaledSlide><Slide /></ScaledSlide>
              </div>
              {/* Nav */}
              <div className="flex items-center justify-between px-8 py-4 border-t flex-shrink-0"
                style={{ borderColor: "hsl(25 8% 10%)" }}>
                <button onClick={() => setCurrent(c => Math.max(c - 1, 0))}
                  disabled={current === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-30"
                  style={{ color: `hsl(${C})`, background: "hsl(25 8% 10%)", fontSize: 14 }}>
                  <ChevronLeft size={18} /> Previous
                </button>

                <div className="flex items-center gap-2">
                  {SLIDES.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                      className="rounded-full transition-all"
                      style={{
                        width: i === current ? 24 : 8, height: 8,
                        background: i === current ? `hsl(${ORG})` : `hsl(${MUT} / 0.4)`,
                      }} />
                  ))}
                </div>

                <button onClick={() => setCurrent(c => Math.min(c + 1, SLIDES.length - 1))}
                  disabled={current === SLIDES.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-30"
                  style={{ color: `hsl(${C})`, background: "hsl(25 8% 10%)", fontSize: 14 }}>
                  Next <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, visibility: exporting ? 'visible' : 'hidden', pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>
            <s.component />
          </div>
        ))}
      </div>
    </div>
  );
}
