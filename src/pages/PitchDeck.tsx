import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, Grid3x3, ArrowRight, Zap, Brain, Target, TrendingUp, Users, Shield, BarChart3, CheckCircle2, AlertTriangle, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Theme constants ────────────────────────────────────────────────────────

const BG = "hsl(0 0% 100%)";
const TEXT = "hsl(222 20% 10%)";
const MUTED = "hsl(215 15% 42%)";
const SUBTLE = "hsl(215 10% 56%)";
const CARD_ALT = "hsl(220 15% 97%)";
const CHROME_BG = "hsl(220 15% 97%)";
const CHROME_BORDER = "hsl(220 12% 90%)";
const ACCENT = "200 90% 42%";
const GREEN = "155 72% 38%";
const RED = "0 72% 50%";
const AMBER = "38 92% 42%";

const TOTAL_SLIDES = 11;

// ─── Scaled slide container ─────────────────────────────────────────────────

function ScaledSlide({ children, className }: { children: React.ReactNode; className?: string }) {
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
    <div ref={containerRef} className={cn("relative overflow-hidden w-full h-full", className)}>
      <div
        style={{
          position: "absolute",
          width: 1920,
          height: 1080,
          left: "50%",
          top: "50%",
          marginLeft: -960,
          marginTop: -540,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Shared helpers ─────────────────────────────────────────────────────────

function SlideGrid({ color = ACCENT }: { color?: string }) {
  return (
    <div className="absolute inset-0 opacity-[0.06]" style={{
      backgroundImage: `linear-gradient(hsl(215 15% 75%) 1px, transparent 1px), linear-gradient(90deg, hsl(215 15% 75%) 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}

function SlideBar({ color = ACCENT }: { color?: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1"
      style={{ background: `linear-gradient(90deg, hsl(${ACCENT}), hsl(${GREEN}))` }} />
  );
}

// ─── Slide components ────────────────────────────────────────────────────────

function Slide01Title() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full opacity-[0.03]"
        style={{ background: `radial-gradient(circle, hsl(${GREEN}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-40">
        <div className="flex items-center gap-3 mb-10 px-6 py-2.5 rounded-full border"
          style={{ borderColor: `hsl(${ACCENT} / 0.35)`, background: `hsl(${ACCENT} / 0.07)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${ACCENT})` }} />
          <span className="text-3xl font-semibold tracking-[0.3em] uppercase" style={{ color: `hsl(${ACCENT})` }}>LIZA OS</span>
        </div>

        <h1 className="font-bold leading-[1.05] mb-8" style={{ fontSize: 108, color: TEXT }}>
          Make Expertise
          <br />
          <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Scalable.
          </span>
        </h1>

        <p className="leading-relaxed max-w-3xl" style={{ fontSize: 36, color: MUTED }}>
          The operating system that turns your organization's best thinking
          into a living, executable system.
        </p>

        <div className="mt-20 flex items-center gap-10">
          {[["Execution", "Protocol-driven workflows"], ["Learning", "Automated after-action capture"], ["Memory", "Institutional knowledge graph"]].map(([label, sub]) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <span className="text-2xl font-semibold" style={{ color: TEXT }}>{label}</span>
              <span className="text-xl" style={{ color: MUTED }}>{sub}</span>
            </div>
          ))}
        </div>
      </div>

      <SlideBar />
    </div>
  );
}

function Slide02Problem() {
  const pains = [
    { icon: <Users size={52} />, title: "Quality depends on 3 people", sub: "Remove them and delivery collapses", color: RED },
    { icon: <Clock size={52} />, title: "6-month ramp time", sub: "Junior talent takes forever to become useful", color: AMBER },
    { icon: <AlertTriangle size={52} />, title: "Knowledge walks out the door", sub: "Every resignation is an institutional memory loss event", color: RED },
    { icon: <BarChart3 size={52} />, title: "Inconsistent execution", sub: "Strategy is set quarterly, but drift happens daily", color: AMBER },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <div className="mb-16">
          <p className="text-2xl font-semibold tracking-[0.25em] uppercase mb-5" style={{ color: `hsl(${RED})` }}>The Problem</p>
          <h2 className="font-bold" style={{ fontSize: 80, color: TEXT, lineHeight: 1.1 }}>
            Scaling a professional firm<br />
            <span style={{ color: `hsl(${RED})` }}>breaks the model.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-8 flex-1">
          {pains.map(({ icon, title, sub, color }) => (
            <div key={title} className="flex flex-col gap-5 rounded-2xl p-10 border"
              style={{ background: `hsl(${color} / 0.04)`, borderColor: `hsl(${color} / 0.18)` }}>
              <div style={{ color: `hsl(${color})` }}>{icon}</div>
              <div>
                <p className="font-bold mb-3" style={{ fontSize: 36, color: TEXT }}>{title}</p>
                <p style={{ fontSize: 26, color: MUTED }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, hsl(${RED}), hsl(${AMBER}))` }} />
    </div>
  );
}

function Slide03Cost() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 px-28 w-full">
        <p className="text-2xl font-semibold tracking-[0.25em] uppercase mb-6 text-center" style={{ color: `hsl(${AMBER})` }}>The Cost</p>
        <h2 className="font-bold text-center mb-20" style={{ fontSize: 78, color: TEXT, lineHeight: 1.1 }}>
          This isn't a productivity problem.<br />
          <span style={{ color: `hsl(${AMBER})` }}>It's a compounding liability.</span>
        </h2>

        <div className="flex items-stretch gap-12 justify-center">
          {[
            { stat: "40%", label: "of organizational knowledge lost on each senior departure", color: RED },
            { stat: "6×", label: "cost to re-create tacit expertise vs. retaining it systematically", color: AMBER },
            { stat: "73%", label: "of professional firms report inconsistent delivery as their #1 growth blocker", color: ACCENT },
          ].map(({ stat, label, color }) => (
            <div key={stat} className="flex-1 flex flex-col items-center text-center rounded-2xl border p-12"
              style={{ background: `hsl(${color} / 0.04)`, borderColor: `hsl(${color} / 0.2)` }}>
              <span className="font-black mb-6" style={{ fontSize: 96, color: `hsl(${color})`, lineHeight: 1 }}>{stat}</span>
              <p style={{ fontSize: 28, color: MUTED, lineHeight: 1.4 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, hsl(${AMBER}), hsl(${ACCENT}))` }} />
    </div>
  );
}

function Slide04Insight() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <SlideGrid />

      {/* Left */}
      <div className="relative z-10 flex flex-col justify-center px-28 pt-16 pb-16 w-1/2">
        <p className="text-2xl font-semibold tracking-[0.25em] uppercase mb-6" style={{ color: `hsl(${ACCENT})` }}>The Reframe</p>
        <h2 className="font-bold mb-10" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
          Knowledge doesn't<br />disappear.
          <br />
          <span style={{ color: `hsl(${ACCENT})` }}>It just never gets<br />captured.</span>
        </h2>
        <p style={{ fontSize: 30, color: MUTED, lineHeight: 1.6 }}>
          Every senior consultant has judgment encoded in<br />
          their intuition. Every team has patterns in their<br />
          decisions. Every delivery has lessons.
          <br /><br />
          The SECI model shows us how knowledge actually<br />
          moves — and where it leaks.
        </p>
      </div>

      {/* Right — SECI spiral */}
      <div className="relative z-10 flex flex-col justify-center items-center w-1/2 gap-6 pr-20">
        <div className="relative w-[520px] h-[520px]">
          {[480, 360, 240, 120].map((size, i) => (
            <div key={size} className="absolute rounded-full border"
              style={{
                width: size, height: size,
                top: (480 - size) / 2, left: (480 - size) / 2,
                borderColor: `hsl(${ACCENT} / ${0.08 + i * 0.07})`,
              }} />
          ))}
          {[
            { label: "SOCIALIZATION", sub: "Tacit → Tacit", angle: -135, color: GREEN },
            { label: "EXTERNALIZATION", sub: "Tacit → Explicit", angle: -45, color: ACCENT },
            { label: "INTERNALIZATION", sub: "Explicit → Tacit", angle: 135, color: GREEN },
            { label: "COMBINATION", sub: "Explicit → Explicit", angle: 45, color: ACCENT },
          ].map(({ label, sub, angle, color }) => {
            const rad = (angle * Math.PI) / 180;
            const r = 195;
            const x = 240 + r * Math.cos(rad);
            const y = 240 + r * Math.sin(rad);
            return (
              <div key={label} className="absolute flex flex-col items-center text-center"
                style={{ left: x - 80, top: y - 35, width: 160 }}>
                <span className="font-bold text-xl leading-tight" style={{ color: `hsl(${color})` }}>{label}</span>
                <span className="text-lg" style={{ color: MUTED }}>{sub}</span>
              </div>
            );
          })}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))` }}>
              <Brain size={28} color="white" />
            </div>
            <span className="mt-3 text-xl font-bold" style={{ color: TEXT }}>SECI</span>
            <span className="text-lg" style={{ color: MUTED }}>Spiral</span>
          </div>
        </div>
        <p className="text-center text-2xl" style={{ color: MUTED }}>
          Nonaka & Takeuchi — the mechanism behind<br />every learning organization
        </p>
      </div>

      <SlideBar />
    </div>
  );
}

function Slide05Solution() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-28">
        <p className="text-2xl font-semibold tracking-[0.25em] uppercase mb-8" style={{ color: `hsl(${ACCENT})` }}>The Solution</p>
        <h2 className="font-black mb-8" style={{ fontSize: 96, lineHeight: 1.05, color: TEXT }}>
          LIZA OS
        </h2>
        <p className="mb-14" style={{ fontSize: 38, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          A knowledge-activated execution engine that embeds your firm's<br />
          best thinking directly into daily workflows.
        </p>

        <div className="flex gap-10 w-full justify-center">
          {[
            { icon: <Target size={44} />, label: "Execute", desc: "Protocol-driven workflows ensure every team member follows your best process — not just their own intuition.", color: ACCENT },
            { icon: <Brain size={44} />, label: "Learn", desc: "After every session, the system captures what worked, what didn't, and synthesizes it into institutional intelligence.", color: GREEN },
            { icon: <Zap size={44} />, label: "Encode", desc: "Learnings automatically update the knowledge graph — making the organization smarter with every project.", color: ACCENT },
          ].map(({ icon, label, desc, color }) => (
            <div key={label} className="flex-1 flex flex-col rounded-2xl border p-10"
              style={{ background: `hsl(${color} / 0.04)`, borderColor: `hsl(${color} / 0.2)` }}>
              <div className="mb-6" style={{ color: `hsl(${color})` }}>{icon}</div>
              <p className="font-bold mb-4" style={{ fontSize: 38, color: TEXT }}>{label}</p>
              <p style={{ fontSize: 24, color: MUTED, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function Slide06HowItWorks() {
  const steps = [
    { n: "01", title: "Operator opens a Workbook", desc: "A guided Action Grid replaces the blank page — protocol cards map to your firm's methodologies.", color: ACCENT },
    { n: "02", title: "Protocol locks intent", desc: "Clicking a card activates a step-by-step protocol. AI adapts to the current step. No prompt engineering needed.", color: GREEN },
    { n: "03", title: "System captures insights", desc: "Deviations, findings, and decisions are captured in real time — tagged to the protocol step.", color: ACCENT },
    { n: "04", title: "After-action review fires", desc: "On session close, structured reflection synthesizes what happened into reusable institutional knowledge.", color: GREEN },
    { n: "05", title: "Knowledge graph updates", desc: "Approved learnings flow back into the playbook — improving the next operator's starting point.", color: ACCENT },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <div className="mb-14">
          <p className="text-2xl font-semibold tracking-[0.25em] uppercase mb-5" style={{ color: `hsl(${ACCENT})` }}>How It Works</p>
          <h2 className="font-bold" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
            The SECI Flywheel in action.
          </h2>
        </div>

        <div className="flex flex-col gap-5 flex-1 justify-center">
          {steps.map(({ n, title, desc, color }, i) => (
            <div key={n} className="flex items-center gap-8">
              <span className="font-black shrink-0 w-20 text-right" style={{ fontSize: 44, color: `hsl(${color} / 0.2)` }}>{n}</span>
              <div className="w-1.5 self-stretch rounded-full" style={{ background: `hsl(${color} / 0.3)` }} />
              <div className="flex items-center gap-6 flex-1 rounded-xl border px-8 py-6"
                style={{ background: `hsl(${color} / 0.03)`, borderColor: `hsl(${color} / 0.15)` }}>
                <p className="font-bold shrink-0" style={{ fontSize: 30, color: TEXT, width: 440 }}>{title}</p>
                <p style={{ fontSize: 24, color: MUTED, lineHeight: 1.4 }}>{desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight size={24} style={{ color: `hsl(${color} / 0.3)` }} className="shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function Slide07ForWho() {
  const personas = [
    {
      role: "The Operator", tag: "Frontline", icon: <Target size={48} />, color: ACCENT,
      pains: ["Blank-page paralysis", "No guidance on what to do next", "Prompt engineering instead of working"],
      gains: ["Action Grid replaces blank chat", "Step-by-step protocol guidance", "AI adapts to current task context"],
    },
    {
      role: "The Architect", tag: "Expert / T-Shaped", icon: <Brain size={48} />, color: GREEN,
      pains: ["Manual knowledge curation", "Duplicates and stale items everywhere", "No way to detect drift at scale"],
      gains: ["Smart ingestion from documents", "Automated drift detection inbox", "Impact simulation before changes"],
    },
    {
      role: "The Manager", tag: "Leader / COO", icon: <BarChart3 size={48} />, color: AMBER,
      pains: ["No visibility into execution quality", "Strategy and delivery drift apart", "Depends on meetings to know status"],
      gains: ["Nerve Center live oversight", "Drift scoring per workbook", "Delegation with coaching context"],
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <div className="mb-12">
          <p className="text-2xl font-semibold tracking-[0.25em] uppercase mb-5" style={{ color: `hsl(${ACCENT})` }}>Who It's For</p>
          <h2 className="font-bold" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
            Three personas. One operating system.
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-8 flex-1">
          {personas.map(({ role, tag, icon, color, pains, gains }) => (
            <div key={role} className="flex flex-col rounded-2xl border overflow-hidden"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.03)` }}>
              <div className="px-8 pt-8 pb-6 border-b" style={{ borderColor: `hsl(${color} / 0.15)` }}>
                <div className="mb-4" style={{ color: `hsl(${color})` }}>{icon}</div>
                <p className="font-bold mb-1" style={{ fontSize: 34, color: TEXT }}>{role}</p>
                <span className="text-xl px-3 py-1 rounded-full border font-medium"
                  style={{ color: `hsl(${color})`, borderColor: `hsl(${color} / 0.3)`, background: `hsl(${color} / 0.08)` }}>
                  {tag}
                </span>
              </div>
              <div className="px-8 pt-6 pb-8 flex flex-col gap-5">
                <div>
                  <p className="text-xl font-semibold mb-3" style={{ color: `hsl(${RED})` }}>Before LIZA</p>
                  {pains.map(p => <p key={p} className="text-xl mb-1.5" style={{ color: MUTED }}>— {p}</p>)}
                </div>
                <div>
                  <p className="text-xl font-semibold mb-3" style={{ color: `hsl(${GREEN})` }}>After LIZA</p>
                  {gains.map(g => <p key={g} className="text-xl mb-1.5 flex items-start gap-2" style={{ color: "hsl(222 15% 25%)" }}>
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" style={{ color: `hsl(${color})` }} /> {g}
                  </p>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function Slide08Differentiation() {
  const rows = [
    { capability: "Protocol-driven execution", liza: true, notion: false, copilot: false, glean: false },
    { capability: "After-action knowledge capture", liza: true, notion: false, copilot: false, glean: false },
    { capability: "Context inheritance (Bundle → Workbook)", liza: true, notion: false, copilot: false, glean: false },
    { capability: "Drift detection & impact simulation", liza: true, notion: false, copilot: false, glean: false },
    { capability: "Role-based operating modes", liza: true, notion: false, copilot: false, glean: false },
    { capability: "Knowledge graph auto-updates", liza: true, notion: false, copilot: false, glean: true },
    { capability: "AI-assisted document synthesis", liza: true, notion: true, copilot: true, glean: true },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <div className="mb-12">
          <p className="text-2xl font-semibold tracking-[0.25em] uppercase mb-5" style={{ color: `hsl(${ACCENT})` }}>Why LIZA</p>
          <h2 className="font-bold" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
            This category doesn't exist yet.
          </h2>
        </div>

        <div className="flex-1 overflow-hidden rounded-2xl border" style={{ borderColor: CHROME_BORDER }}>
          <table className="w-full h-full">
            <thead>
              <tr style={{ background: CARD_ALT }}>
                <th className="text-left px-10 py-7 text-2xl font-medium" style={{ color: MUTED, width: "40%" }}>Capability</th>
                {[
                  { name: "LIZA OS", highlight: true },
                  { name: "Notion AI", highlight: false },
                  { name: "M365 Copilot", highlight: false },
                  { name: "Glean", highlight: false },
                ].map(({ name, highlight }) => (
                  <th key={name} className="px-8 py-7 text-2xl font-bold text-center"
                    style={{ color: highlight ? `hsl(${ACCENT})` : MUTED }}>
                    {name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ capability, liza, notion, copilot, glean }, i) => (
                <tr key={capability} style={{ background: i % 2 === 0 ? "transparent" : CARD_ALT }}>
                  <td className="px-10 py-5 text-2xl" style={{ color: "hsl(222 15% 30%)" }}>{capability}</td>
                  {[
                    { val: liza, highlight: true },
                    { val: notion, highlight: false },
                    { val: copilot, highlight: false },
                    { val: glean, highlight: false },
                  ].map(({ val, highlight }, j) => (
                    <td key={j} className="px-8 py-5 text-center">
                      {val
                        ? <CheckCircle2 size={30} className="mx-auto" style={{ color: highlight ? `hsl(${GREEN})` : "hsl(215 10% 60%)" }} />
                        : <X size={30} className="mx-auto" style={{ color: "hsl(215 10% 82%)" }} />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function Slide09ICP() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <SlideGrid />

      {/* Left */}
      <div className="relative z-10 flex flex-col justify-center px-28 w-1/2 pr-16">
        <p className="text-2xl font-semibold tracking-[0.25em] uppercase mb-8" style={{ color: `hsl(${ACCENT})` }}>Ideal Customer</p>
        <h2 className="font-bold mb-10" style={{ fontSize: 68, color: TEXT, lineHeight: 1.1 }}>
          Mid-market<br />professional services<br />
          <span style={{ color: `hsl(${ACCENT})` }}>at an inflection point.</span>
        </h2>
        <p style={{ fontSize: 28, color: MUTED, lineHeight: 1.6 }}>
          Firms between 50–500 people who are scaling faster
          than their capability to maintain quality. The buyer
          is a <strong style={{ color: "hsl(222 15% 20%)" }}>COO, Chief of Staff, or Managing Partner</strong> who feels
          the friction of inconsistency every day.
        </p>
      </div>

      {/* Right */}
      <div className="relative z-10 flex flex-col justify-center pr-28 pl-12 w-1/2 gap-6">
        {[
          { label: "Industry", value: "Management consulting, executive search, legal advisory, sales orgs", color: ACCENT },
          { label: "Size", value: "50–500 people, $10M–$200M revenue", color: GREEN },
          { label: "Trigger", value: "Series B/growth phase, new leadership, quality complaints, rapid headcount growth", color: ACCENT },
          { label: "Buyer", value: "COO, Chief of Staff, Head of Consulting Excellence, Managing Partner", color: GREEN },
          { label: "Wedge use case", value: "Consistent high-stakes deliverable quality + expert onboarding acceleration", color: ACCENT },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border p-7" style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.03)` }}>
            <p className="text-xl font-semibold mb-2" style={{ color: `hsl(${color})` }}>{label}</p>
            <p style={{ fontSize: 25, color: "hsl(222 15% 28%)", lineHeight: 1.4 }}>{value}</p>
          </div>
        ))}
      </div>

      <SlideBar />
    </div>
  );
}

function Slide10GTM() {
  const hooks = [
    { n: "Hook 1", title: "Consistent Deliverable Quality", hook: "Stop delivery quality depending on who touches the work", color: ACCENT },
    { n: "Hook 2", title: "Knowledge Retention", hook: "Every resignation is a knowledge loss event — stop losing IP when people leave", color: GREEN },
    { n: "Hook 3", title: "Onboarding Acceleration", hook: "Junior talent becomes useful in 2 weeks, not 6 months", color: ACCENT },
    { n: "Hook 4", title: "Execution Consistency", hook: "Your strategy was set in Q1. It's now Q3. Are your teams still aligned?", color: GREEN },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <div className="mb-12">
          <p className="text-2xl font-semibold tracking-[0.25em] uppercase mb-5" style={{ color: `hsl(${ACCENT})` }}>Go To Market</p>
          <h2 className="font-bold" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
            Trojan Horse strategy:<br />
            <span style={{ color: `hsl(${ACCENT})` }}>sell Level 1 pain, deliver Level 4 value.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10">
          {hooks.map(({ n, title, hook, color }) => (
            <div key={n} className="flex gap-6 rounded-xl border p-8"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.03)` }}>
              <span className="font-black text-3xl shrink-0 mt-1" style={{ color: `hsl(${color} / 0.3)` }}>{n}</span>
              <div>
                <p className="font-bold mb-2" style={{ fontSize: 30, color: TEXT }}>{title}</p>
                <p className="italic" style={{ fontSize: 24, color: MUTED }}>"{hook}"</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-8 flex items-center gap-10"
          style={{ borderColor: `hsl(${ACCENT} / 0.25)`, background: `hsl(${ACCENT} / 0.04)` }}>
          <BookOpen size={40} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
          <p style={{ fontSize: 27, color: "hsl(222 15% 25%)", lineHeight: 1.5 }}>
            <strong style={{ color: `hsl(${ACCENT})` }}>Partnership wedge:</strong> Partner with methodology holders (MEDDIC, McKinsey frameworks, ESG standards)
            to deliver pre-built execution template libraries — accelerating time-to-value for new customers.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function Slide11CTA() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.04]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <div className="mb-10 px-8 py-3 rounded-full border flex items-center gap-3"
          style={{ borderColor: `hsl(${ACCENT} / 0.35)`, background: `hsl(${ACCENT} / 0.07)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${ACCENT})` }} />
          <span className="text-2xl font-semibold tracking-widest uppercase" style={{ color: `hsl(${ACCENT})` }}>LIZA OS</span>
        </div>

        <h2 className="font-black mb-8" style={{ fontSize: 100, color: TEXT, lineHeight: 1.05 }}>
          Your expertise is an asset.
          <br />
          <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Stop letting it evaporate.
          </span>
        </h2>

        <p className="mb-16" style={{ fontSize: 34, color: MUTED, maxWidth: 1000, lineHeight: 1.6 }}>
          LIZA turns your best thinking into a living system — so every consultant,
          every project, every client interaction reflects your highest standards.
        </p>

        <div className="flex gap-8">
          <div className="px-16 py-6 rounded-xl font-bold text-3xl"
            style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))`, color: "white" }}>
            Request Early Access
          </div>
          <div className="px-16 py-6 rounded-xl font-bold text-3xl border"
            style={{ borderColor: `hsl(${ACCENT} / 0.35)`, color: `hsl(${ACCENT})`, background: `hsl(${ACCENT} / 0.04)` }}>
            Book a Demo
          </div>
        </div>

        <p className="mt-12 text-2xl" style={{ color: SUBTLE }}>
          liza.ai &nbsp;·&nbsp; Knowledge-Activated Execution
        </p>
      </div>

      <SlideBar />
    </div>
  );
}

const SLIDES = [
  { id: 1, title: "Title", component: <Slide01Title /> },
  { id: 2, title: "The Problem", component: <Slide02Problem /> },
  { id: 3, title: "The Cost", component: <Slide03Cost /> },
  { id: 4, title: "The Reframe", component: <Slide04Insight /> },
  { id: 5, title: "The Solution", component: <Slide05Solution /> },
  { id: 6, title: "How It Works", component: <Slide06HowItWorks /> },
  { id: 7, title: "Who It's For", component: <Slide07ForWho /> },
  { id: 8, title: "Why LIZA", component: <Slide08Differentiation /> },
  { id: 9, title: "Ideal Customer", component: <Slide09ICP /> },
  { id: 10, title: "Go To Market", component: <Slide10GTM /> },
  { id: 11, title: "Call to Action", component: <Slide11CTA /> },
];

// ─── Main PitchDeck Page ─────────────────────────────────────────────────────

export default function PitchDeck() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showNav, setShowNav] = useState(true);

  const goTo = useCallback((idx: number) => {
    setCurrent(Math.max(0, Math.min(SLIDES.length - 1, idx)));
    setShowGrid(false);
  }, []);

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); prev(); }
      if (e.key === "Escape") { setIsFullscreen(false); setShowGrid(false); }
      if (e.key === "g" || e.key === "G") setShowGrid(v => !v);
      if (e.key === "f" || e.key === "F5") { e.preventDefault(); enterFullscreen(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
  };

  useEffect(() => {
    const onFsc = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener("fullscreenchange", onFsc);
    return () => document.removeEventListener("fullscreenchange", onFsc);
  }, []);

  useEffect(() => {
    if (!isFullscreen) { setShowNav(true); return; }
    let timer: ReturnType<typeof setTimeout>;
    const show = () => { setShowNav(true); clearTimeout(timer); timer = setTimeout(() => setShowNav(false), 2500); };
    window.addEventListener("mousemove", show);
    show();
    return () => { window.removeEventListener("mousemove", show); clearTimeout(timer); };
  }, [isFullscreen]);

  const slide = SLIDES[current];

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-white z-[9999]" style={{ cursor: showNav ? "default" : "none" }}>
        <ScaledSlide>{slide.component}</ScaledSlide>
        {showNav && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full shadow-lg"
            style={{ background: "hsl(0 0% 100% / 0.95)", border: `1px solid ${CHROME_BORDER}` }}>
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg transition-colors hover:bg-black/5 disabled:opacity-30">
              <ChevronLeft size={20} style={{ color: TEXT }} />
            </button>
            <span className="text-sm font-mono px-2" style={{ color: MUTED }}>{current + 1} / {SLIDES.length}</span>
            <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg transition-colors hover:bg-black/5 disabled:opacity-30">
              <ChevronRight size={20} style={{ color: TEXT }} />
            </button>
            <button onClick={() => { document.exitFullscreen?.(); setIsFullscreen(false); }} className="p-2 rounded-lg transition-colors hover:bg-black/5 ml-2">
              <X size={20} style={{ color: MUTED }} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: CARD_ALT }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${ACCENT})` }} />
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS — Product Deck</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: `hsl(${ACCENT} / 0.08)`, color: `hsl(${ACCENT})` }}>
            {SLIDES.length} slides
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <Button size="sm" variant="ghost" onClick={enterFullscreen}>
            <Maximize2 size={15} className="mr-1.5" /> Present
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnail sidebar */}
        <div className="w-44 flex flex-col gap-2 p-3 overflow-y-auto border-r shrink-0"
          style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)}
              className={cn("w-full rounded-lg overflow-hidden border-2 transition-all text-left shrink-0",
                i === current ? "border-primary" : "border-transparent opacity-60 hover:opacity-90"
              )} style={{ aspectRatio: "16/9" }}>
              <div className="w-full h-full" style={{ pointerEvents: "none" }}>
                <ScaledSlide>{s.component}</ScaledSlide>
              </div>
            </button>
          ))}
        </div>

        {/* Main canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showGrid ? (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-3 gap-6">
                {SLIDES.map((s, i) => (
                  <button key={s.id} onClick={() => goTo(i)}
                    className={cn("flex flex-col gap-2 rounded-xl overflow-hidden border-2 transition-all text-left",
                      i === current ? "border-primary" : "border-transparent hover:border-border"
                    )}>
                    <div className="w-full" style={{ aspectRatio: "16/9" }}>
                      <ScaledSlide>{s.component}</ScaledSlide>
                    </div>
                    <p className="text-xs px-2 pb-2" style={{ color: MUTED }}>
                      <span className="font-mono">{String(i + 1).padStart(2, "0")}</span> — {s.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden p-6">
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg border"
                style={{ borderColor: CHROME_BORDER }}>
                <ScaledSlide>{slide.component}</ScaledSlide>
              </div>
            </div>
          )}

          {/* Bottom nav */}
          {!showGrid && (
            <div className="flex items-center justify-between px-8 py-3 border-t shrink-0"
              style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
              <div className="flex gap-2">
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === current ? 32 : 8,
                      background: i === current ? `hsl(${ACCENT})` : CHROME_BORDER,
                    }} />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline" onClick={prev} disabled={current === 0}>
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-xs font-mono" style={{ color: MUTED }}>
                  {current + 1} / {SLIDES.length}
                </span>
                <Button size="sm" variant="outline" onClick={next} disabled={current === SLIDES.length - 1}>
                  <ChevronRight size={16} />
                </Button>
              </div>
              <p className="text-xs" style={{ color: SUBTLE }}>← → navigate &nbsp; G grid &nbsp; F present</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
