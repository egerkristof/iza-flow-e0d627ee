import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Maximize2, Grid3x3, X,
  Brain, Target, Zap, BookOpen, TrendingUp, CheckCircle2,
  ArrowRight, AlertTriangle, Clock, Users, Shield, BarChart3,
  Layers, GitBranch, Radio, Shuffle, Lock, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Scaled slide container ───────────────────────────────────────────────────

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

const BG   = "hsl(222 22% 5%)";
const BG2  = "hsl(222 18% 8%)";
const C    = "210 18% 92%";
const MUT  = "215 10% 50%";
const PRI  = "200 90% 52%";  // LIZA teal/blue
const GRN  = "155 72% 46%";  // secondary green
const RED  = "0 72% 63%";
const AMB  = "38 92% 55%";

function Grid() {
  return (
    <div className="absolute inset-0 opacity-[0.025]" style={{
      backgroundImage: `linear-gradient(hsl(${PRI}) 1px, transparent 1px), linear-gradient(90deg, hsl(${PRI}) 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}

function Bar() {
  return <div className="absolute bottom-0 left-0 right-0 h-[3px]"
    style={{ background: `linear-gradient(90deg, hsl(${PRI}), hsl(${GRN}))` }} />;
}

function LeftAccent() {
  return <div className="absolute left-0 top-0 bottom-0 w-[5px]"
    style={{ background: `linear-gradient(180deg, hsl(${PRI}), hsl(${GRN}))` }} />;
}

function Tag({ label }: { label: string }) {
  return (
    <p className="font-bold tracking-[0.22em] uppercase mb-8"
      style={{ fontSize: 22, color: `hsl(${PRI})` }}>{label}</p>
  );
}

// ─── Slide 01 — Cover ─────────────────────────────────────────────────────────

function Slide01Cover() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="absolute right-0 top-0 w-[900px] h-[900px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${PRI}), transparent 70%)`, transform: "translate(25%, -25%)" }} />

      {/* Left */}
      <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[1040px] relative z-10">
        <div className="mb-10">
          <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border font-semibold"
            style={{ fontSize: 21, borderColor: `hsl(${PRI} / 0.4)`, background: `hsl(${PRI} / 0.07)`, color: `hsl(${PRI})` }}>
            <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${PRI})` }} />
            For Enterprise Teams
          </span>
        </div>

        <h1 className="font-black leading-[1.02] mb-10" style={{ fontSize: 100, color: `hsl(${C})` }}>
          Your teams are using
          <br />
          AI.{" "}
          <span style={{
            background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            Not yours.
          </span>
        </h1>

        <p style={{ fontSize: 34, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 860 }}>
          Every team member is prompting their own way.
          <br />No standards. No memory. No oversight.
          <br /><strong style={{ color: `hsl(${C})` }}>And you can't see any of it.</strong>
        </p>

        <div className="flex items-center gap-6 mt-14">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border font-semibold"
            style={{ fontSize: 20, borderColor: `hsl(${PRI} / 0.4)`, background: `hsl(${PRI} / 0.08)`, color: `hsl(${PRI})` }}>
            AI Governance Infrastructure
          </span>
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border font-semibold"
            style={{ fontSize: 20, borderColor: `hsl(${GRN} / 0.4)`, background: `hsl(${GRN} / 0.08)`, color: `hsl(${GRN})` }}>
            Knowledge Operationalisation
          </span>
        </div>
      </div>

      {/* Right — the chaos visual */}
      <div className="flex flex-col justify-center flex-1 pr-[100px] gap-5 relative z-10">
        <p className="font-bold tracking-widest uppercase mb-2" style={{ fontSize: 19, color: `hsl(${MUT})` }}>
          What's happening right now
        </p>
        {[
          { icon: <Shuffle size={28} />, label: "23 different prompting styles", sub: "Same task, wildly different outputs", col: RED },
          { icon: <Radio size={28} />, label: "AI running on public data only", sub: "None of your org's context, standards, or judgment", col: AMB },
          { icon: <MessageSquare size={28} />, label: "Zero institutional memory", sub: "Every session starts from scratch", col: MUT },
          { icon: <Shield size={28} />, label: "No compliance visibility", sub: "GDPR, IP, confidentiality — all unmanaged", col: RED },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-6 rounded-2xl px-8 py-6 border"
            style={{ background: BG2, borderColor: `hsl(${item.col} / 0.2)` }}>
            <div style={{ color: `hsl(${item.col})`, flexShrink: 0 }}>{item.icon}</div>
            <div>
              <p className="font-bold" style={{ fontSize: 26, color: `hsl(${C})` }}>{item.label}</p>
              <p style={{ fontSize: 21, color: `hsl(${MUT})` }}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 02 — The Burning Problem ──────────────────────────────────────────

function Slide02Problem() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="The Problem" />
        <h2 className="font-black mb-6" style={{ fontSize: 84, color: `hsl(${C})`, lineHeight: 1.05 }}>
          You've adopted AI.
          <br />
          <span style={{ color: `hsl(${RED})` }}>You haven't operationalised it.</span>
        </h2>
        <p className="mb-14" style={{ fontSize: 32, color: `hsl(${MUT})`, maxWidth: 900, lineHeight: 1.6 }}>
          AI tools are in your stack. But how they're used is entirely up to each individual — their creativity, their risk appetite, their understanding of what's appropriate.
        </p>

        <div className="grid grid-cols-3 gap-7">
          {[
            {
              icon: <GitBranch size={36} />,
              title: "No consistency",
              desc: "The same brief produces 12 different outputs depending on who ran it and how they prompted. You can't manage what you can't standardise.",
              col: RED,
            },
            {
              icon: <Brain size={36} />,
              title: "No institutional context",
              desc: "AI is operating on generic internet knowledge. Your standards, your client context, your methodology — none of it is in the loop.",
              col: AMB,
            },
            {
              icon: <TrendingUp size={36} />,
              title: "No compounding value",
              desc: "Every AI session is disposable. Insights evaporate. The organisation learns nothing. You're spending on AI but not investing in intelligence.",
              col: PRI,
            },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl p-10 border relative overflow-hidden"
              style={{ background: `hsl(${c.col} / 0.05)`, borderColor: `hsl(${c.col} / 0.25)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${c.col})` }} />
              <div className="mb-6" style={{ color: `hsl(${c.col})` }}>{c.icon}</div>
              <h3 className="font-bold mb-4" style={{ fontSize: 32, color: `hsl(${C})` }}>{c.title}</h3>
              <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 03 — The Signals ───────────────────────────────────────────────────

function Slide03Signals() {
  const signals = [
    { q: "\"We're all using AI differently — how do we align?\"", type: "Manager, Strategy Team" },
    { q: "\"How do I know what our AI outputs are based on?\"", type: "Head of Compliance" },
    { q: "\"We onboarded a tool. Adoption is low and quality is patchy.\"", type: "COO, 800-person firm" },
    { q: "\"Everyone's experimenting but nothing's improving systematically.\"", type: "Chief of Staff" },
  ];

  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      {/* Left */}
      <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[820px] relative z-10">
        <Tag label="You Know This Feeling" />
        <h2 className="font-black leading-tight mb-10" style={{ fontSize: 78, color: `hsl(${C})` }}>
          The conversations
          <br />already happening
          <br />
          <span style={{ color: `hsl(${PRI})` }}>in your building.</span>
        </h2>
        <p style={{ fontSize: 28, color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          AI adoption without infrastructure creates a specific kind of organisational friction. It feels like productivity — but it's actually entropy.
        </p>
      </div>

      {/* Right — quotes */}
      <div className="flex flex-col justify-center flex-1 pr-[120px] gap-7 relative z-10">
        {signals.map((s, i) => (
          <div key={i} className="rounded-2xl p-8 border" style={{ background: BG2, borderColor: `hsl(${PRI} / 0.12)` }}>
            <p className="font-semibold mb-3" style={{ fontSize: 26, color: `hsl(${C})`, lineHeight: 1.4 }}>"{s.q}"</p>
            <p className="font-bold tracking-widest uppercase" style={{ fontSize: 17, color: `hsl(${PRI})` }}>{s.type}</p>
          </div>
        ))}
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 04 — What's Been Tried ────────────────────────────────────────────

function Slide04Tried() {
  const tried = [
    { label: "Prompt libraries & wikis", why: "Static. No one updates them. Out of date before they're shared." },
    { label: "AI tool rollouts (Copilot, ChatGPT Teams)", why: "Access without architecture. Great tools, no institutional context." },
    { label: "Training & workshops", why: "Skills decay. No reinforcement. Back to individual habits within 2 weeks." },
    { label: "Policy documents & AI guidelines", why: "Compliance theatre. No system enforces them at the point of use." },
    { label: "Centre of Excellence teams", why: "Siloed. Slow to respond. Becomes an internal consulting bottleneck, not a platform." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="What You've Tried" />
        <h2 className="font-black mb-4" style={{ fontSize: 76, color: `hsl(${C})` }}>
          None of it sticks.
        </h2>
        <p className="mb-12" style={{ fontSize: 30, color: `hsl(${MUT})` }}>
          The problem isn't access to AI. It's the absence of a system that governs how it's used.
        </p>

        <div className="space-y-4">
          {tried.map((t, i) => (
            <div key={i} className="flex items-start gap-8 px-8 py-6 rounded-xl border"
              style={{ background: BG2, borderColor: `hsl(${RED} / 0.1)` }}>
              <AlertTriangle style={{ width: 30, height: 30, flexShrink: 0, marginTop: 4, color: `hsl(${RED} / 0.55)` }} />
              <div className="flex items-start gap-8 flex-1">
                <p className="font-bold flex-shrink-0 w-[460px]" style={{ fontSize: 26, color: `hsl(${C})` }}>{t.label}</p>
                <div className="w-[1px] self-stretch" style={{ background: `hsl(${RED} / 0.15)` }} />
                <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.4 }}>→ {t.why}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-7 rounded-2xl border" style={{ background: `hsl(${PRI} / 0.06)`, borderColor: `hsl(${PRI} / 0.3)` }}>
          <p style={{ fontSize: 26, color: `hsl(${C})`, lineHeight: 1.5 }}>
            <strong style={{ color: `hsl(${PRI})` }}>The root issue:</strong>{" "}
            You're trying to solve an infrastructure problem with a training problem. Until AI is embedded with your organisation's context, standards, and governance — at the point of use — the results will always be inconsistent.
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

      <div className="absolute w-[700px] h-[700px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${PRI}), transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

      {/* Left */}
      <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[900px] relative z-10">
        <Tag label="The Root Cause" />
        <h2 className="font-black leading-tight mb-10" style={{ fontSize: 76, color: `hsl(${C})` }}>
          AI is running
          <br />in a vacuum.
          <br />
          <span style={{ color: `hsl(${PRI})` }}>Your org's intelligence<br />is not in the loop.</span>
        </h2>
        <p style={{ fontSize: 27, color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          Generic AI produces generic outputs. The only way to get consistent, high-quality, on-brand, compliant results is to inject your organisation's knowledge into every workflow — automatically, at the right moment.
          <br /><br />
          Right now, that injection doesn't exist. So your teams compensate with individual effort, inconsistent habits, and tribal workarounds.
        </p>
      </div>

      {/* Right — two states */}
      <div className="flex flex-col justify-center flex-1 pr-[120px] gap-6 relative z-10">
        <div className="rounded-2xl p-10 border" style={{ background: BG2, borderColor: `hsl(${RED} / 0.2)`, opacity: 0.8 }}>
          <div className="flex items-center gap-4 mb-5">
            <Shuffle style={{ width: 34, height: 34, color: `hsl(${RED})` }} />
            <span className="font-bold tracking-widest uppercase" style={{ fontSize: 18, color: `hsl(${RED})` }}>Without LIZA OS</span>
          </div>
          <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
            Generic AI + Individual improvisation
            <br />= Inconsistent outputs, zero learning, growing compliance risk
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px]" style={{ background: `hsl(${PRI} / 0.3)` }} />
          <span className="font-bold" style={{ fontSize: 20, color: `hsl(${PRI})` }}>the shift</span>
          <div className="flex-1 h-[1px]" style={{ background: `hsl(${PRI} / 0.3)` }} />
        </div>

        <div className="rounded-2xl p-10 border relative overflow-hidden" style={{ background: `hsl(${PRI} / 0.06)`, borderColor: `hsl(${PRI} / 0.4)` }}>
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, hsl(${PRI}), hsl(${GRN}))` }} />
          <div className="flex items-center gap-4 mb-5">
            <Brain style={{ width: 34, height: 34, color: `hsl(${PRI})` }} />
            <span className="font-bold tracking-widest uppercase" style={{ fontSize: 18, color: `hsl(${PRI})` }}>With LIZA OS</span>
          </div>
          <p style={{ fontSize: 24, color: `hsl(${C})`, lineHeight: 1.55 }}>
            Organisation-aware AI + Protocol-governed workflows
            <br />= Consistent outputs, compounding intelligence, full visibility
          </p>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 06 — The Solution ──────────────────────────────────────────────────

function Slide06Solution() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07]"
        style={{ background: `radial-gradient(circle, hsl(${PRI}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-28">
        <p className="font-bold tracking-[0.22em] uppercase mb-8" style={{ fontSize: 22, color: `hsl(${PRI})` }}>The Solution</p>
        <h2 className="font-black mb-8" style={{ fontSize: 92, lineHeight: 1.05 }}>
          <span style={{
            background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>LIZA OS</span>
        </h2>
        <p className="mb-14" style={{ fontSize: 36, color: `hsl(${MUT})`, maxWidth: 1200, lineHeight: 1.5 }}>
          An organisational intelligence layer that sits between your teams and AI — injecting your standards, your context, and your knowledge into every workflow.
        </p>

        <div className="flex gap-9 w-full justify-center">
          {[
            { icon: <BookOpen size={42} />, label: "Context-Aware AI", desc: "AI that knows your organisation — your standards, methodology, client context, and governance requirements — not just the internet.", color: PRI },
            { icon: <Target size={42} />, label: "Protocol-Driven Work", desc: "Every workflow runs against a defined playbook. Teams execute consistently. Managers see what's happening in real time.", color: GRN },
            { icon: <TrendingUp size={42} />, label: "Compounding Intelligence", desc: "Every session feeds back into your knowledge base. The system gets smarter. Your org's collective intelligence compounds.", color: PRI },
          ].map(({ icon, label, desc, color }, i) => (
            <div key={i} className="flex-1 flex flex-col rounded-2xl border p-10"
              style={{ background: `hsl(${color} / 0.06)`, borderColor: `hsl(${color} / 0.25)` }}>
              <div className="mb-6" style={{ color: `hsl(${color})` }}>{icon}</div>
              <p className="font-bold mb-4" style={{ fontSize: 36, color: `hsl(${C})` }}>{label}</p>
              <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 07 — How It Works ──────────────────────────────────────────────────

function Slide07HowItWorks() {
  const steps = [
    { n: "01", title: "Your knowledge goes in once", desc: "Playbooks, standards, methodologies, and governance rules are structured into a living knowledge base — not documents. Updated by practice, not by admin.", color: PRI },
    { n: "02", title: "Teams open a Workbook", desc: "Instead of a blank chat, teams work inside a structured protocol. AI is already loaded with the right context for that specific type of work.", color: GRN },
    { n: "03", title: "Every step is governed", desc: "Protocol steps guide the work. Mandates fire automatically. Compliance conditions are checked before moving forward. No workarounds.", color: PRI },
    { n: "04", title: "Insights are captured live", desc: "Decisions, deviations, and learnings are tagged in real time. Nothing valuable gets lost when the session closes.", color: GRN },
    { n: "05", title: "The org gets smarter", desc: "Reviewed learnings flow back into playbooks. The next team starts from a better place. Intelligence compounds across the organisation.", color: PRI },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex flex-col h-full pl-[160px] pr-[120px] pt-16 pb-12">
        <div className="mb-14">
          <Tag label="How It Works" />
          <h2 className="font-black" style={{ fontSize: 72, color: `hsl(${C})`, lineHeight: 1.1 }}>
            One system. End to end.
          </h2>
        </div>

        <div className="flex flex-col gap-5 flex-1 justify-center">
          {steps.map(({ n, title, desc, color }) => (
            <div key={n} className="flex items-center gap-8">
              <span className="font-black shrink-0 w-20 text-right" style={{ fontSize: 44, color: `hsl(${color} / 0.3)` }}>{n}</span>
              <div className="w-1.5 self-stretch rounded-full" style={{ background: `hsl(${color} / 0.4)` }} />
              <div className="flex items-center gap-6 flex-1 rounded-xl border px-8 py-6"
                style={{ background: `hsl(${color} / 0.05)`, borderColor: `hsl(${color} / 0.15)` }}>
                <div className="flex-1">
                  <p className="font-bold mb-2" style={{ fontSize: 28, color: `hsl(${C})` }}>{title}</p>
                  <p style={{ fontSize: 23, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{desc}</p>
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

// ─── Slide 08 — What This Solves ─────────────────────────────────────────────

function Slide08Solves() {
  const items = [
    { before: "23 prompting styles for the same task", after: "One governed protocol. Consistent outputs.", icon: <Shuffle size={26} /> },
    { before: "AI hallucinating on generic data", after: "Context-loaded with your standards and methodology", icon: <Brain size={26} /> },
    { before: "Zero visibility for managers", after: "Real-time protocol execution dashboards", icon: <BarChart3 size={26} /> },
    { before: "Compliance risk flying blind", after: "Mandates enforced automatically at point of use", icon: <Shield size={26} /> },
    { before: "Knowledge evaporating after sessions", after: "Structured capture feeding a compounding knowledge base", icon: <TrendingUp size={26} /> },
    { before: "New starters taking months to ramp", after: "Onboarding to protocols, not personalities", icon: <Clock size={26} /> },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="What Changes" />
        <h2 className="font-black mb-12" style={{ fontSize: 72, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Before → After
        </h2>

        <div className="grid grid-cols-2 gap-5">
          {items.map((item, i) => (
            <div key={i} className="flex gap-5 items-start rounded-xl border px-8 py-6"
              style={{ background: BG2, borderColor: `hsl(${PRI} / 0.12)` }}>
              <div className="flex-shrink-0 mt-1" style={{ color: `hsl(${PRI})` }}>{item.icon}</div>
              <div className="flex-1">
                <p style={{ fontSize: 22, color: `hsl(${RED} / 0.7)`, textDecoration: "line-through", marginBottom: 4 }}>{item.before}</p>
                <p className="font-semibold flex items-center gap-2" style={{ fontSize: 23, color: `hsl(${C})` }}>
                  <CheckCircle2 size={18} style={{ color: `hsl(${GRN})`, flexShrink: 0 }} />
                  {item.after}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 09 — For Managers ──────────────────────────────────────────────────

function Slide09ForManagers() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      {/* Left */}
      <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[900px] relative z-10">
        <Tag label="Built for Managers" />
        <h2 className="font-black leading-tight mb-10" style={{ fontSize: 76, color: `hsl(${C})` }}>
          Finally, visibility
          <br />
          <span style={{ color: `hsl(${PRI})` }}>into how your team<br />actually works.</span>
        </h2>
        <p style={{ fontSize: 27, color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          LIZA OS is not a tool for individual contributors to experiment with. It's the infrastructure layer that gives team leads and heads of function real-time oversight of how work is being done — not just what's being delivered.
        </p>
      </div>

      {/* Right — manager capabilities */}
      <div className="flex flex-col justify-center flex-1 pr-[120px] gap-6 relative z-10">
        {[
          { icon: <BarChart3 size={30} />, title: "Protocol compliance dashboards", desc: "See which steps are being followed, where teams deviate, and what patterns are emerging — across the whole function.", col: PRI },
          { icon: <Layers size={30} />, title: "Knowledge base as a living asset", desc: "Your team's best practice is captured, curated, and available to every new hire from day one. Not in a drive no one opens.", col: GRN },
          { icon: <Users size={30} />, title: "Mandate enforcement — automatic", desc: "Governance rules that actually fire at the point of work. No more policy theatre.", col: PRI },
          { icon: <Lock size={30} />, title: "AI usage governance", desc: "Full audit trail of what AI was used for, what context it had, and what it produced — across every workbook.", col: GRN },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-7 rounded-2xl px-8 py-7 border"
            style={{ background: `hsl(${item.col} / 0.05)`, borderColor: `hsl(${item.col} / 0.2)` }}>
            <div style={{ color: `hsl(${item.col})`, flexShrink: 0, marginTop: 4 }}>{item.icon}</div>
            <div>
              <p className="font-bold mb-2" style={{ fontSize: 26, color: `hsl(${C})` }}>{item.title}</p>
              <p style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 10 — The Compounding Case ─────────────────────────────────────────

function Slide10Compounding() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(ellipse, hsl(${PRI}), transparent 65%)` }} />

      <div className="relative z-10 px-28 w-full">
        <p className="font-bold tracking-[0.22em] uppercase mb-6 text-center" style={{ fontSize: 22, color: `hsl(${PRI})` }}>The Compounding Case</p>
        <h2 className="font-black text-center mb-16" style={{ fontSize: 78, color: `hsl(${C})`, lineHeight: 1.1 }}>
          This isn't a cost centre.
          <br />
          <span style={{ color: `hsl(${PRI})` }}>It's a compounding asset.</span>
        </h2>

        <div className="flex items-stretch gap-10 justify-center">
          {[
            {
              period: "Month 1–3",
              title: "Foundation",
              items: ["Core playbooks structured", "Teams onboarded to protocols", "Baseline consistency established"],
              color: PRI,
            },
            {
              period: "Month 3–6",
              title: "Acceleration",
              items: ["Ramp time cut by 60%", "Delivery variance drops", "Managers have real oversight"],
              color: GRN,
            },
            {
              period: "Month 6+",
              title: "Compounding",
              items: ["Every project improves the system", "Senior judgment encoded and accessible", "AI that actually knows your organisation"],
              color: PRI,
            },
          ].map((phase, i) => (
            <div key={i} className="flex-1 rounded-2xl border p-10 relative overflow-hidden"
              style={{ background: `hsl(${phase.color} / 0.06)`, borderColor: `hsl(${phase.color} / 0.3)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${phase.color})` }} />
              <p className="font-bold tracking-widest uppercase mb-2" style={{ fontSize: 18, color: `hsl(${phase.color})` }}>{phase.period}</p>
              <h3 className="font-black mb-6" style={{ fontSize: 42, color: `hsl(${C})` }}>{phase.title}</h3>
              <div className="space-y-3">
                {phase.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <CheckCircle2 size={22} style={{ color: `hsl(${phase.color})`, flexShrink: 0 }} />
                    <p style={{ fontSize: 24, color: `hsl(${MUT})` }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 11 — CTA ───────────────────────────────────────────────────────────

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

function Slide11CTA() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[1000px] h-[600px] rounded-full opacity-[0.08]"
          style={{ background: `radial-gradient(ellipse, hsl(${PRI}), transparent 65%)` }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-40">
        <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border mb-10"
          style={{ borderColor: `hsl(${PRI} / 0.4)`, background: `hsl(${PRI} / 0.07)` }}>
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${PRI})` }} />
          <span className="font-bold tracking-[0.25em] uppercase" style={{ fontSize: 20, color: `hsl(${PRI})` }}>Get Started</span>
        </span>

        <h2 className="font-black mb-8" style={{ fontSize: 96, color: `hsl(${C})`, lineHeight: 1.05 }}>
          Your team is already
          <br />
          <span style={{
            background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>using AI without you.</span>
        </h2>

        <p className="mb-16" style={{ fontSize: 34, color: `hsl(${MUT})`, maxWidth: 1100, lineHeight: 1.55 }}>
          The question isn't whether to operationalise AI. It's whether you do it now — while the window is open — or scramble to catch up once inconsistency has compounded into a structural problem.
        </p>

        <div className="flex items-center gap-8">
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-xl font-bold"
            style={{
              fontSize: 30, padding: "24px 52px",
              background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
              color: "hsl(222 22% 5%)",
              boxShadow: `0 0 48px -8px hsl(${PRI} / 0.5)`,
            }}
          >
            Book a 30-min conversation
            <ArrowRight size={28} />
          </a>
        </div>

        <p className="mt-10" style={{ fontSize: 24, color: `hsl(${MUT})` }}>
          No commitment. No demo script. Just a real conversation about what's happening in your organisation.
        </p>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slides registry ──────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, label: "Cover",        component: Slide01Cover },
  { id: 2, label: "Problem",      component: Slide02Problem },
  { id: 3, label: "Signals",      component: Slide03Signals },
  { id: 4, label: "What's Tried", component: Slide04Tried },
  { id: 5, label: "Root Cause",   component: Slide05RootCause },
  { id: 6, label: "Solution",     component: Slide06Solution },
  { id: 7, label: "How It Works", component: Slide07HowItWorks },
  { id: 8, label: "Before/After", component: Slide08Solves },
  { id: 9, label: "For Managers", component: Slide09ForManagers },
  { id: 10, label: "Compounding", component: Slide10Compounding },
  { id: 11, label: "Next Step",   component: Slide11CTA },
];

const TOTAL = SLIDES.length;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EnterpriseDeck() {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [grid, setGrid] = useState(false);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(TOTAL - 1, c + 1));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "f" || e.key === "F") setFullscreen(f => !f);
      if (e.key === "g" || e.key === "G") setGrid(g => !g);
      if (e.key === "Escape") { setFullscreen(false); setGrid(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const SlideComponent = SLIDES[current].component;

  return (
    <div
      className={cn("flex flex-col", fullscreen ? "fixed inset-0 z-50" : "min-h-screen")}
      style={{ background: "hsl(222 22% 3%)" }}
    >
      {/* Grid overlay */}
      {grid && (
        <div className="fixed inset-0 z-50 p-6" style={{ background: "hsl(222 22% 3%)" }}>
          <div className="grid grid-cols-4 gap-3 h-full">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setCurrent(i); setGrid(false); }}
                className={cn(
                  "relative rounded-xl overflow-hidden border-2 transition-all",
                  i === current ? "border-[hsl(200_90%_52%)]" : "border-transparent hover:border-white/20"
                )}
              >
                <ScaledSlide><s.component /></ScaledSlide>
                <div className="absolute bottom-0 left-0 right-0 p-2 text-center text-xs font-semibold"
                  style={{ background: "hsl(222 22% 8% / 0.9)", color: "hsl(215 10% 60%)" }}>
                  {s.id}. {s.label}
                </div>
              </button>
            ))}
          </div>
          <button
            className="absolute top-4 right-4 rounded-full p-3"
            style={{ background: "hsl(222 18% 12%)", color: "hsl(215 10% 70%)" }}
            onClick={() => setGrid(false)}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Toolbar */}
      {!grid && (
        <div className="flex items-center justify-between px-8 py-4 flex-shrink-0"
          style={{ background: "hsl(222 22% 4%)", borderBottom: "1px solid hsl(222 18% 10%)" }}>
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-widest" style={{ fontSize: 14, color: "hsl(200 90% 52%)" }}>LIZA OS</span>
            <span style={{ color: "hsl(215 10% 30%)" }}>·</span>
            <span style={{ fontSize: 13, color: "hsl(215 10% 45%)" }}>Enterprise Teams</span>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={prev} disabled={current === 0}
              className="p-2 rounded-lg disabled:opacity-30 transition-opacity hover:opacity-70"
              style={{ color: "hsl(215 10% 65%)" }}>
              <ChevronLeft size={20} />
            </button>
            <span style={{ fontSize: 14, color: "hsl(215 10% 50%)" }}>{current + 1} / {TOTAL}</span>
            <button onClick={next} disabled={current === TOTAL - 1}
              className="p-2 rounded-lg disabled:opacity-30 transition-opacity hover:opacity-70"
              style={{ color: "hsl(215 10% 65%)" }}>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setGrid(true)}
              className="p-2 rounded-lg hover:opacity-70 transition-opacity"
              style={{ color: "hsl(215 10% 55%)" }}>
              <Grid3x3 size={18} />
            </button>
            <button onClick={() => setFullscreen(f => !f)}
              className="p-2 rounded-lg hover:opacity-70 transition-opacity"
              style={{ color: "hsl(215 10% 55%)" }}>
              {fullscreen ? <X size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>
      )}

      {/* Slide */}
      {!grid && (
        <div className="flex-1 relative" style={{ minHeight: 0 }}>
          <ScaledSlide>
            <SlideComponent />
          </ScaledSlide>
        </div>
      )}

      {/* Progress bar */}
      {!grid && (
        <div className="flex-shrink-0 h-1" style={{ background: "hsl(222 18% 10%)" }}>
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((current + 1) / TOTAL) * 100}%`,
              background: `linear-gradient(90deg, hsl(${PRI}), hsl(${GRN}))`,
            }}
          />
        </div>
      )}
    </div>
  );
}
