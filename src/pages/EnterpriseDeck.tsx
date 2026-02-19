import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Maximize2, Grid3x3, X,
  Brain, Target, Zap, BookOpen, TrendingUp, CheckCircle2,
  ArrowRight, AlertTriangle, Clock, Users, Shield, BarChart3,
  Layers, GitBranch, Shuffle, Lock, MessageSquare, Calendar,
  Award, Lightbulb, FileText
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
const PRI  = "200 90% 52%";
const GRN  = "155 72% 46%";
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
      <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[1060px] relative z-10">
        <div className="mb-10">
          <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border font-semibold"
            style={{ fontSize: 21, borderColor: `hsl(${PRI} / 0.4)`, background: `hsl(${PRI} / 0.07)`, color: `hsl(${PRI})` }}>
            <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${PRI})` }} />
            AI Operating Model · Enterprise Teams
          </span>
        </div>

        <h1 className="font-black leading-[1.02] mb-10" style={{ fontSize: 88, color: `hsl(${C})` }}>
          Your teams are using AI.
          <br />Nobody knows how.
          <br />
          <span style={{
            background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>
            We help you build the system.
          </span>
        </h1>

        <p style={{ fontSize: 30, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 880 }}>
          A structured engagement where we work directly with your teams — mapping workflows, surfacing tacit knowledge, and turning it into a shared operating model that governs how AI gets used.
        </p>

        <div className="flex items-center gap-6 mt-14">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border font-semibold"
            style={{ fontSize: 20, borderColor: `hsl(${PRI} / 0.4)`, background: `hsl(${PRI} / 0.08)`, color: `hsl(${PRI})` }}>
            <GitBranch size={18} /> Multi-session engagement
          </span>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border font-semibold"
            style={{ fontSize: 20, borderColor: `hsl(${GRN} / 0.4)`, background: `hsl(${GRN} / 0.08)`, color: `hsl(${GRN})` }}>
            <Users size={18} /> Team-level, not individual
          </span>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border font-semibold"
            style={{ fontSize: 20, borderColor: `hsl(${AMB} / 0.4)`, background: `hsl(${AMB} / 0.08)`, color: `hsl(${AMB})` }}>
            <FileText size={18} /> Infrastructure you keep
          </span>
        </div>
      </div>

      {/* Right — urgency stats */}
      <div className="flex flex-col justify-center flex-1 pr-[100px] gap-6 relative z-10">
        {[
          { stat: "78%", desc: "of enterprise employees are using AI tools their employer hasn't approved", col: RED },
          { stat: "14×", desc: "variance in output quality when AI is used without shared standards", col: AMB },
          { stat: "0%", desc: "of those sessions feed back into institutional knowledge — it evaporates", col: PRI },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl px-10 py-8 border"
            style={{ background: BG2, borderColor: `hsl(${item.col} / 0.2)` }}>
            <p className="font-black mb-2" style={{ fontSize: 64, color: `hsl(${item.col})`, lineHeight: 1 }}>{item.stat}</p>
            <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 02 — The Problem ───────────────────────────────────────────────────

function Slide02Problem() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="What's Actually Happening" />
        <h2 className="font-black mb-6" style={{ fontSize: 82, color: `hsl(${C})`, lineHeight: 1.05 }}>
          AI adoption happened.
          <br />
          <span style={{ color: `hsl(${RED})` }}>AI alignment didn't.</span>
        </h2>
        <p className="mb-14" style={{ fontSize: 30, color: `hsl(${MUT})`, maxWidth: 960, lineHeight: 1.6 }}>
          Licences got bought. Tools got rolled out. Now every team member prompts their own way, with no shared standards, no institutional context, and no visibility for the people responsible for outcomes.
        </p>

        <div className="grid grid-cols-3 gap-7">
          {[
            {
              icon: <Shuffle size={36} />,
              title: "No shared standard",
              desc: "Same task, wildly different outputs. Who you ask determines what you get. That's not a capability gap — it's a governance gap.",
              col: RED,
            },
            {
              icon: <Brain size={36} />,
              title: "AI with no context",
              desc: "Your standards, methodology, brand voice, compliance requirements — none of it reaches the model. Teams get generic when they need specific.",
              col: AMB,
            },
            {
              icon: <BarChart3 size={36} />,
              title: "Zero visibility",
              desc: "Managers can see deliverables. Not how they were made. Not what AI contributed. Not where the risk is. Oversight is blind.",
              col: PRI,
            },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl p-10 border relative overflow-hidden"
              style={{ background: `hsl(${c.col} / 0.05)`, borderColor: `hsl(${c.col} / 0.25)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${c.col})` }} />
              <div className="mb-6" style={{ color: `hsl(${c.col})` }}>{c.icon}</div>
              <h3 className="font-bold mb-4" style={{ fontSize: 30, color: `hsl(${C})` }}>{c.title}</h3>
              <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 03 — The Conversations ────────────────────────────────────────────

function Slide03Signals() {
  const signals = [
    { q: "\"We all use AI, but we get completely different results for the same brief.\"", type: "Head of Strategy, Financial Services" },
    { q: "\"I've got no idea what our AI outputs are actually based on. That scares me.\"", type: "Chief Compliance Officer, 1,200-person firm" },
    { q: "\"We bought Copilot for everyone. Three months later, adoption is 20% and quality is patchy.\"", type: "COO, Professional Services Group" },
    { q: "\"My team uses AI constantly but I don't know if it's making us better or just faster at being inconsistent.\"", type: "Managing Director, Internal Consulting Division" },
  ];

  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      {/* Left */}
      <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[800px] relative z-10">
        <Tag label="Sound familiar?" />
        <h2 className="font-black leading-tight mb-10" style={{ fontSize: 74, color: `hsl(${C})` }}>
          These conversations
          <br />are already
          <br />
          <span style={{ color: `hsl(${PRI})` }}>happening<br />in your org.</span>
        </h2>
        <p style={{ fontSize: 27, color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          The problem isn't that people aren't using AI. It's that everyone's using it differently — and nobody has a clear answer when the exec team asks "how are we governing this?"
        </p>
      </div>

      {/* Right — quotes */}
      <div className="flex flex-col justify-center flex-1 pr-[120px] gap-6 relative z-10">
        {signals.map((s, i) => (
          <div key={i} className="rounded-2xl p-7 border" style={{ background: BG2, borderColor: `hsl(${PRI} / 0.12)` }}>
            <p className="font-semibold mb-3" style={{ fontSize: 24, color: `hsl(${C})`, lineHeight: 1.4 }}>"{s.q}"</p>
            <p className="font-bold tracking-widest uppercase" style={{ fontSize: 16, color: `hsl(${PRI})` }}>{s.type}</p>
          </div>
        ))}
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 04 — Why Training Doesn't Work ────────────────────────────────────

function Slide04WhyTraining() {
  const tried = [
    { label: "Prompt engineering courses", why: "Individual skill. No shared standard. Back to 23 different styles by Monday." },
    { label: "AI tool rollouts (Copilot, ChatGPT Teams)", why: "Access without architecture. Licences ≠ alignment." },
    { label: "Internal AI champions / CoE", why: "Siloed. Slow. Becomes a bottleneck, not a multiplier." },
    { label: "Policy documents & usage guidelines", why: "Compliance theatre. No enforcement at the point of use." },
    { label: "One-off awareness workshops", why: "Awareness without operating model. Excitement fades in 2 weeks." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="Why Previous Efforts Didn't Stick" />
        <h2 className="font-black mb-4" style={{ fontSize: 74, color: `hsl(${C})` }}>
          Awareness isn't an operating model.
        </h2>
        <p className="mb-12" style={{ fontSize: 29, color: `hsl(${MUT})` }}>
          Every approach to date has built skill in individuals. None have built a shared system for teams.
        </p>

        <div className="space-y-4">
          {tried.map((t, i) => (
            <div key={i} className="flex items-start gap-8 px-8 py-6 rounded-xl border"
              style={{ background: BG2, borderColor: `hsl(${RED} / 0.1)` }}>
              <AlertTriangle style={{ width: 28, height: 28, flexShrink: 0, marginTop: 4, color: `hsl(${RED} / 0.55)` }} />
              <div className="flex items-start gap-8 flex-1">
                <p className="font-bold flex-shrink-0 w-[500px]" style={{ fontSize: 25, color: `hsl(${C})` }}>{t.label}</p>
                <div className="w-[1px] self-stretch" style={{ background: `hsl(${RED} / 0.15)` }} />
                <p style={{ fontSize: 23, color: `hsl(${MUT})`, lineHeight: 1.4 }}>→ {t.why}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-7 rounded-2xl border" style={{ background: `hsl(${PRI} / 0.06)`, borderColor: `hsl(${PRI} / 0.3)` }}>
          <p style={{ fontSize: 26, color: `hsl(${C})`, lineHeight: 1.5 }}>
            <strong style={{ color: `hsl(${PRI})` }}>The missing piece:</strong>{" "}
            A shared operating model — agreed standards, defined workflows, and the infrastructure to make them stick in daily practice. That's what the workshop builds.
          </p>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 05 — The Engagement ───────────────────────────────────────────────

function Slide05TheWorkshop() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07]"
        style={{ background: `radial-gradient(circle, hsl(${PRI}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-24">
        <p className="font-bold tracking-[0.22em] uppercase mb-8" style={{ fontSize: 22, color: `hsl(${PRI})` }}>The Offer</p>
        <h2 className="font-black mb-6" style={{ fontSize: 84, lineHeight: 1.05, color: `hsl(${C})` }}>
          The AI Operating Model
          <br />
          <span style={{
            background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>Programme</span>
        </h2>
        <p className="mb-14" style={{ fontSize: 30, color: `hsl(${MUT})`, maxWidth: 1200, lineHeight: 1.55 }}>
          A structured, multi-session engagement where we work inside your teams — mapping how work actually happens, what knowledge drives good decisions, and turning that into a governed operating model for AI.
        </p>

        <div className="flex gap-8 w-full justify-center">
          {[
            { icon: <Target size={40} />, label: "Surface", desc: "We observe and interview your teams to map real workflows — the tacit logic, judgment calls, and quality standards that currently live only in people's heads.", color: RED },
            { icon: <Lightbulb size={40} />, label: "Structure", desc: "Together we externalise what we find: agreed standards, workflow protocols, and quality criteria — co-authored by the people who need to use them.", color: PRI },
            { icon: <Zap size={40} />, label: "Embed", desc: "The model gets built into how work is done. Protocols run inside LIZA OS. Knowledge compounds. New team members onboard to a standard, not tribal habits.", color: GRN },
          ].map(({ icon, label, desc, color }, i) => (
            <div key={i} className="flex-1 flex flex-col rounded-2xl border p-10 relative overflow-hidden"
              style={{ background: `hsl(${color} / 0.06)`, borderColor: `hsl(${color} / 0.25)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${color})` }} />
              <div className="mb-6" style={{ color: `hsl(${color})` }}>{icon}</div>
              <p className="font-black mb-4" style={{ fontSize: 44, color: `hsl(${C})` }}>{label}</p>
              <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 06 — The Programme Structure ──────────────────────────────────────

function Slide06Agenda() {
  const sessions = [
    { n: "Phase 1", title: "Workflow Discovery", desc: "We embed with your team leads across 2–3 working sessions. We observe how work is done, what AI is being used for, and — critically — where undocumented judgment calls are being made. The goal: make the invisible visible.", col: RED },
    { n: "Phase 2", title: "Knowledge Mapping", desc: "We run structured workshops to externalise what we found. Teams articulate the decision logic, quality standards, and operating principles that currently live only in people's heads — not in any system.", col: AMB },
    { n: "Phase 3", title: "Operating Model Design", desc: "Working collaboratively, we structure those insights into usable artefacts: workflow protocols, AI usage standards, governance checkpoints, and a shared vocabulary for how AI work gets done in your function.", col: PRI },
    { n: "Phase 4", title: "Embed & Activate", desc: "The model goes live inside LIZA OS. Teams run protocols. Knowledge accumulates. Managers get visibility. The operating model stops being a document and becomes the default way work happens.", col: GRN },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex flex-col h-full pl-[160px] pr-[120px] pt-14 pb-12">
        <div className="mb-12">
          <Tag label="Programme Structure" />
          <h2 className="font-black" style={{ fontSize: 68, color: `hsl(${C})`, lineHeight: 1.1 }}>
            Four phases. One coherent system.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-6 flex-1">
          {sessions.map(({ n, title, desc, col }) => (
            <div key={title} className="rounded-2xl p-9 border relative overflow-hidden"
              style={{ background: `hsl(${col} / 0.05)`, borderColor: `hsl(${col} / 0.22)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${col})` }} />
              <div className="flex items-center gap-4 mb-4">
                <span className="font-bold tracking-widest uppercase" style={{ fontSize: 16, color: `hsl(${col})` }}>{n}</span>
              </div>
              <h3 className="font-black mb-4" style={{ fontSize: 38, color: `hsl(${C})` }}>{title}</h3>
              <p style={{ fontSize: 23, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 07 — What You Walk Away With ──────────────────────────────────────

function Slide07Deliverables() {
  const items = [
    { icon: <FileText size={30} />, title: "Workflow maps", desc: "Documented maps of how work actually happens — the real sequence, the key decision points, and where AI fits in each.", col: PRI },
    { icon: <BookOpen size={30} />, title: "Executable protocol library", desc: "Your most critical workflows converted into structured protocols inside LIZA OS — ready to run, not just reference.", col: GRN },
    { icon: <Brain size={30} />, title: "Codified judgment layer", desc: "The heuristics, quality standards, and decision logic that senior team members carry — externalised, structured, and usable by everyone.", col: PRI },
    { icon: <Shield size={30} />, title: "AI governance framework", desc: "Clarity on what's appropriate, what's risky, and who decides — with escalation paths your team actually understands.", col: GRN },
    { icon: <TrendingUp size={30} />, title: "Knowledge capture loop", desc: "A feedback mechanism so that every execution makes the system smarter — learnings flow back into the operating model.", col: PRI },
    { icon: <Users size={30} />, title: "Team ownership", desc: "A model built by the people who use it. Shared language. Shared standards. Designed to outlast any individual.", col: GRN },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="What You Get" />
        <h2 className="font-black mb-12" style={{ fontSize: 72, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Not a report. A working system.
        </h2>

        <div className="grid grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-4 rounded-2xl border px-8 py-7"
              style={{ background: BG2, borderColor: `hsl(${item.col} / 0.2)` }}>
              <div style={{ color: `hsl(${item.col})` }}>{item.icon}</div>
              <div>
                <p className="font-bold mb-2" style={{ fontSize: 26, color: `hsl(${C})` }}>{item.title}</p>
                <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}


// ─── Slide 08 — Who This Is For ───────────────────────────────────────────────

function Slide08WhoFor() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      {/* Left */}
      <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[860px] relative z-10">
        <Tag label="Who This Is For" />
        <h2 className="font-black leading-tight mb-10" style={{ fontSize: 72, color: `hsl(${C})` }}>
          Managers who own
          <br />
          <span style={{ color: `hsl(${PRI})` }}>the output quality<br />of their teams.</span>
        </h2>
        <p style={{ fontSize: 27, color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          This isn't a session for IT or innovation teams. It's for the people responsible for delivery quality — who need their function to operate with consistent standards, regardless of which tools or models their team chooses to use.
        </p>
      </div>

      {/* Right — personas */}
      <div className="flex flex-col justify-center flex-1 pr-[120px] gap-5 relative z-10">
        {[
          { role: "Heads of Function", context: "Strategy, Operations, Finance, Legal, Marketing", fit: "You set the standards. This session operationalises them for an AI-augmented team.", col: PRI },
          { role: "COOs & Chiefs of Staff", context: "Responsible for cross-functional execution quality", fit: "You need visibility and consistency. This builds the infrastructure for both.", col: GRN },
          { role: "Managing Directors & Practice Leads", context: "Professional services, consulting, advisory divisions", fit: "Your team's judgment is the product. This session protects and scales it.", col: PRI },
          { role: "Transformation & Change Leads", context: "Running AI adoption programmes across the org", fit: "You need a model that sticks beyond the rollout. This is the missing layer.", col: GRN },
        ].map((item, i) => (
          <div key={i} className="rounded-2xl px-8 py-6 border"
            style={{ background: `hsl(${item.col} / 0.05)`, borderColor: `hsl(${item.col} / 0.2)` }}>
            <p className="font-bold mb-1" style={{ fontSize: 26, color: `hsl(${C})` }}>{item.role}</p>
            <p className="mb-2" style={{ fontSize: 19, color: `hsl(${item.col})` }}>{item.context}</p>
            <p style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{item.fit}</p>
          </div>
        ))}
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 09 — What Changes ──────────────────────────────────────────────────

function Slide09BeforeAfter() {
  const items = [
    { before: "Everyone prompts their own way", after: "Shared workflow standards across the function", icon: <Shuffle size={24} /> },
    { before: "AI operating on generic public data", after: "Context-loaded with your standards and methodology", icon: <Brain size={24} /> },
    { before: "No visibility for managers", after: "A governance model you can explain to any exec", icon: <BarChart3 size={24} /> },
    { before: "Knowledge evaporating after every session", after: "Structured capture baked into the workflow", icon: <TrendingUp size={24} /> },
    { before: "New hires take months to reach team standard", after: "Onboarding to a defined operating model, not tribal habits", icon: <Clock size={24} /> },
    { before: "\"How are we governing AI?\" has no clear answer", after: "A framework you own, authored by your own leads", icon: <Shield size={24} /> },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="relative z-10 flex flex-col justify-center h-full pl-[160px] pr-[120px]">
        <Tag label="The Shift" />
        <h2 className="font-black mb-12" style={{ fontSize: 72, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Structured engagement. Lasting change.
        </h2>

        <div className="grid grid-cols-2 gap-5">
          {items.map((item, i) => (
            <div key={i} className="flex gap-5 items-start rounded-xl border px-8 py-6"
              style={{ background: BG2, borderColor: `hsl(${PRI} / 0.12)` }}>
              <div className="flex-shrink-0 mt-1" style={{ color: `hsl(${PRI})` }}>{item.icon}</div>
              <div className="flex-1">
                <p style={{ fontSize: 21, color: `hsl(${RED} / 0.65)`, textDecoration: "line-through", marginBottom: 5 }}>{item.before}</p>
                <p className="font-semibold flex items-center gap-2" style={{ fontSize: 22, color: `hsl(${C})` }}>
                  <CheckCircle2 size={17} style={{ color: `hsl(${GRN})`, flexShrink: 0 }} />
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

// ─── Slide 10 — The Facilitators ─────────────────────────────────────────────

function Slide10Facilitators() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />
      <LeftAccent />

      <div className="absolute w-[700px] h-[700px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(circle, hsl(${PRI}), transparent 70%)`, top: "50%", left: "55%", transform: "translate(-50%, -50%)" }} />

      {/* Left */}
      <div className="flex flex-col justify-center pl-[160px] pr-[80px] w-[900px] relative z-10">
        <Tag label="Why Us" />
        <h2 className="font-black leading-tight mb-10" style={{ fontSize: 74, color: `hsl(${C})` }}>
          We built the infrastructure
          <br />
          <span style={{ color: `hsl(${PRI})` }}>this workshop runs on.</span>
        </h2>
        <p style={{ fontSize: 27, color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          LIZA OS is an operating system for knowledge-intensive organisations — built specifically to solve the problem of inconsistent AI usage, missing institutional context, and knowledge that never gets captured.
          <br /><br />
          We don't teach generic AI skills. We help organisations build the governance layer that makes AI work at the team level — and we've structured a workshop that gets you there in a single focused day.
        </p>
      </div>

      {/* Right — differentiators */}
      <div className="flex flex-col justify-center flex-1 pr-[120px] gap-6 relative z-10">
        {[
          { icon: <Award size={28} />, title: "Demand-first, not tool-first", desc: "We start with what your organisation actually needs, not a product demo. The operating model you build works regardless of which AI tools you use.", col: PRI },
          { icon: <Layers size={28} />, title: "Built around your context", desc: "Every workshop is tailored to your work types, your governance constraints, and your team's existing habits — not a generic template.", col: GRN },
          { icon: <Lock size={28} />, title: "Artefacts you own", desc: "Everything produced in the session is yours. We don't lock deliverables to a platform or subscription.", col: PRI },
          { icon: <TrendingUp size={28} />, title: "Infrastructure if you want it", desc: "For teams that want to go further, LIZA OS provides the technical layer to operationalise the model at scale. No obligation — but it's there.", col: GRN },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-6 rounded-2xl px-8 py-6 border"
            style={{ background: `hsl(${item.col} / 0.05)`, borderColor: `hsl(${item.col} / 0.2)` }}>
            <div style={{ color: `hsl(${item.col})`, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
            <div>
              <p className="font-bold mb-1" style={{ fontSize: 25, color: `hsl(${C})` }}>{item.title}</p>
              <p style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{item.desc}</p>
            </div>
          </div>
        ))}
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
        <div className="w-[1100px] h-[700px] rounded-full opacity-[0.07]"
          style={{ background: `radial-gradient(ellipse, hsl(${PRI}), transparent 65%)` }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-40">
        <span className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border mb-10"
          style={{ borderColor: `hsl(${PRI} / 0.4)`, background: `hsl(${PRI} / 0.07)` }}>
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${PRI})` }} />
          <span className="font-bold tracking-[0.25em] uppercase" style={{ fontSize: 20, color: `hsl(${PRI})` }}>Start the Engagement</span>
        </span>

        <h2 className="font-black mb-8" style={{ fontSize: 88, color: `hsl(${C})`, lineHeight: 1.05 }}>
          Your team's knowledge is
          <br />
          <span style={{
            background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>already there. Let's build with it.</span>
        </h2>

        <p className="mb-10" style={{ fontSize: 30, color: `hsl(${MUT})`, maxWidth: 1100, lineHeight: 1.55 }}>
          We start with a scoping call to understand your team structure, workflows, and what a successful operating model looks like for your context. No commitments — just clarity.
        </p>

        {/* Logistics bar */}
        <div className="flex items-center gap-10 mb-12 px-12 py-6 rounded-2xl border"
          style={{ background: BG2, borderColor: `hsl(${PRI} / 0.2)` }}>
          {[
            { label: "Format", value: "Multi-session, embedded engagement" },
            { label: "Who", value: "Teams + managers, not individuals" },
            { label: "Location", value: "On-site or remote" },
            { label: "Output", value: "A live system, not a report" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <p className="font-bold tracking-widest uppercase" style={{ fontSize: 15, color: `hsl(${PRI})` }}>{item.label}</p>
              <p className="font-semibold" style={{ fontSize: 22, color: `hsl(${C})` }}>{item.value}</p>
            </div>
          ))}
        </div>

        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-xl font-bold"
          style={{
            fontSize: 30, padding: "24px 56px",
            background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
            color: "hsl(222 22% 5%)",
            boxShadow: `0 0 48px -8px hsl(${PRI} / 0.5)`,
          }}
        >
          Book a scoping call
          <ArrowRight size={28} />
        </a>

        <p className="mt-8" style={{ fontSize: 22, color: `hsl(${MUT})` }}>
          30 minutes. We map your team's needs and scope the right engagement.
        </p>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slides registry ──────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1,  label: "Cover",          component: Slide01Cover },
  { id: 2,  label: "The Problem",    component: Slide02Problem },
  { id: 3,  label: "Signals",        component: Slide03Signals },
  { id: 4,  label: "Why Training",   component: Slide04WhyTraining },
  { id: 5,  label: "The Workshop",   component: Slide05TheWorkshop },
  { id: 6,  label: "Agenda",         component: Slide06Agenda },
  { id: 7,  label: "Deliverables",   component: Slide07Deliverables },
  { id: 8,  label: "Who It's For",   component: Slide08WhoFor },
  { id: 9,  label: "Before / After", component: Slide09BeforeAfter },
  { id: 10, label: "Why Us",         component: Slide10Facilitators },
  { id: 11, label: "Book It",        component: Slide11CTA },
];

const TOTAL = SLIDES.length;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EnterpriseDeck() {
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [grid, setGrid] = useState(false);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(TOTAL - 1, c + 1));

  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      delta > 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

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
      className={cn("flex flex-col", fullscreen ? "fixed inset-0 z-50" : "h-screen")}
      style={{ background: "hsl(222 22% 3%)" }}
    >
      {/* Grid overlay */}
      {grid && (
        <div className="fixed inset-0 z-50 p-6 overflow-auto" style={{ background: "hsl(222 22% 3%)" }}>
          <div className="grid grid-cols-4 gap-3" style={{ minHeight: "100%" }}>
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setCurrent(i); setGrid(false); }}
                className={cn(
                  "relative rounded-xl overflow-hidden border-2 transition-all aspect-video",
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
            className="fixed top-4 right-4 rounded-full p-3"
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
            <span style={{ fontSize: 13, color: "hsl(215 10% 45%)" }}>AI Operating Model Workshop</span>
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
        <div
          className="flex-1 relative"
          style={{ minHeight: 0 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
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
