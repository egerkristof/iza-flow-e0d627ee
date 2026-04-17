import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, Grid3x3, X,
  Brain, Target, Zap, BookOpen, TrendingUp, CheckCircle2,
  ArrowRight, AlertTriangle, Clock, Award, Layers, Lock,
  Loader2, Users, BarChart3, Shield, Workflow
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ExportMenu } from "@/components/ExportMenu";
import { Button } from "@/components/ui/button";
import istvanPhoto from "@/assets/istvan-boscha.png";
import kristofPhoto from "@/assets/kristof-eger.png";
import zoltanPhoto from "@/assets/zoltan-kauker.png";

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

const BG   = "hsl(0 0% 100%)";
const BG2  = "hsl(220 15% 97%)";
const C    = "222 20% 10%";
const MUT  = "215 15% 42%";
const BLUE = "200 90% 42%";
const TEAL = "155 72% 38%";
const GOLD = "38 92% 42%";
const RED  = "0 72% 50%";

function Grid() {
  return (
    <div className="absolute inset-0 opacity-[0.06]" style={{
      backgroundImage: `linear-gradient(hsl(215 15% 75%) 1px, transparent 1px), linear-gradient(90deg, hsl(215 15% 75%) 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}

function Bar() {
  return <div className="absolute bottom-0 left-0 right-0 h-1"
    style={{ background: `linear-gradient(90deg, hsl(${BLUE}), hsl(${TEAL}))` }} />;
}

function Tag({ label, color = BLUE }: { label: string; color?: string }) {
  return (
    <p className="font-bold tracking-[0.22em] uppercase mb-6"
      style={{ fontSize: 22, color: `hsl(${color})` }}>{label}</p>
  );
}

function Chip({ children, color = BLUE }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="inline-flex items-center gap-2 px-5 rounded-full border font-semibold"
      style={{ fontSize: 21, lineHeight: "44px", height: 44, borderColor: `hsl(${color} / 0.45)`, background: `hsl(${color} / 0.08)`, color: `hsl(${color})` }}>
      {children}
    </span>
  );
}

// ─── Slide 01 — Cover ─────────────────────────────────────────────────────────

function Slide01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${BLUE}), transparent 70%)` }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <div className="flex items-center gap-3 mb-12 px-7 rounded-full border"
          style={{ borderColor: `hsl(${BLUE} / 0.35)`, background: `hsl(${BLUE} / 0.07)`, height: 52, lineHeight: "52px" }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${BLUE})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 28, color: `hsl(${BLUE})`, lineHeight: "52px" }}>LIZA OS</span>
        </div>

        <h1 className="font-black mb-10" style={{ fontSize: 104, lineHeight: 1.0, color: `hsl(${C})` }}>
          Your Team Gets Wildly
          <br />
          Different Results
          <br />
          <span style={{ background: `linear-gradient(135deg, hsl(${BLUE}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            From AI.
          </span>
        </h1>

        <p style={{ fontSize: 36, color: `hsl(${MUT})`, maxWidth: 1200, lineHeight: 1.55 }}>
          The management layer for AI-native teams.
          <br />Define standards. Enforce execution. <strong style={{ color: `hsl(${C})` }}>Compound intelligence.</strong>
        </p>

        <div className="mt-16 flex items-center gap-8">
          <Chip color={BLUE}>Define & Enforce</Chip>
          <Chip color={TEAL}>Execute Together</Chip>
          <Chip color={GOLD}>Learn & Compound</Chip>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 02 — The Context Gap ─────────────────────────────────────────────

function Slide02Problem() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <div className="relative z-10 flex flex-col justify-center h-full px-28">
        <Tag label="The Context Gap" color={RED} />
        <h2 className="font-bold mb-12" style={{ fontSize: 72, color: `hsl(${C})`, lineHeight: 1.1 }}>
          AI doesn't create inconsistency.
          <br />
          <span style={{ color: `hsl(${RED})` }}>It amplifies it.</span>
        </h2>

        <div className="grid grid-cols-3 gap-7">
          {[
            {
              icon: <Users size={48} />, color: RED,
              title: "Everyone has their own setup",
              body: "Custom GPTs, Claude Projects, personal prompts. Your team's AI usage is a collection of disconnected silos."
            },
            {
              icon: <Target size={48} />, color: GOLD,
              title: "Same brief, 14 outputs",
              body: "Quality depends on who runs it. No shared standard reaches the actual AI session. Each person improvises \"best practice.\""
            },
            {
              icon: <BarChart3 size={48} />, color: RED,
              title: "Nothing compounds",
              body: "Breakthroughs stay in individual chat histories. Tuesday's insight is forgotten by Thursday. Your system never gets smarter."
            },
          ].map(({ icon, color, title, body }) => (
            <div key={title} className="flex flex-col gap-5 rounded-2xl border p-10"
              style={{ background: `hsl(${color} / 0.05)`, borderColor: `hsl(${color} / 0.2)` }}>
              <div style={{ color: `hsl(${color})` }}>{icon}</div>
              <p className="font-bold" style={{ fontSize: 34, color: `hsl(${C})` }}>{title}</p>
              <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.55 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 03 — Maturity Model ────────────────────────────────────────────────

function Slide03RootCause() {
  const levels = [
    { n: "L1", label: "Individual habits", desc: "Execution depends on who runs it. AI scales personal habits, making inconsistency faster.", color: RED },
    { n: "L2", label: "Static playbooks", desc: "Standards exist but execution has moved past them. Nobody checks the wiki anymore.", color: RED },
    { n: "L3", label: "Distributed AI silos", desc: "Everyone uses AI, but disconnected. Custom GPTs, personal setups. None connected to team standards.", color: GOLD },
    { n: "L4", label: "Living playbooks", desc: "Shared standards enforced in every session, updated continuously. The system knows your latest approach.", color: TEAL },
    { n: "L5", label: "Compounding intelligence", desc: "Every engagement makes the team sharper. The weakest performer benefits from the strongest insight.", color: BLUE },
  ];

  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />

      {/* Left */}
      <div className="flex flex-col justify-center pl-[120px] pr-[60px] w-[750px] relative z-10">
        <Tag label="The Maturity Model" />
        <h2 className="font-black leading-tight mb-8" style={{ fontSize: 72, color: `hsl(${C})` }}>
          Where is your team
          <br />
          <span style={{ color: `hsl(${BLUE})` }}>on this ladder?</span>
        </h2>
        <p style={{ fontSize: 26, color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          Most teams are stuck at Level 2 or 3.
          AI tools made them faster individually,
          but the gap between best and worst output
          keeps widening.
        </p>

        <div className="mt-8 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: `hsl(${RED})` }} />
            <span style={{ fontSize: 18, color: `hsl(${MUT})` }}>Unmanaged</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: `hsl(${GOLD})` }} />
            <span style={{ fontSize: 18, color: `hsl(${MUT})` }}>Most teams today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: `hsl(${BLUE})` }} />
            <span style={{ fontSize: 18, color: `hsl(${MUT})` }}>With LIZA OS</span>
          </div>
        </div>
      </div>

      {/* Right — levels */}
      <div className="flex flex-col justify-center flex-1 pr-[100px] gap-3 relative z-10">
        {levels.map((l) => (
          <div key={l.n} className="flex items-start gap-5 p-5 rounded-xl border"
            style={{ background: `hsl(${l.color} / 0.05)`, borderColor: `hsl(${l.color} / 0.25)` }}>
            <span className="font-black shrink-0 mt-0.5" style={{ fontSize: 28, color: `hsl(${l.color})`, lineHeight: 1 }}>{l.n}</span>
            <div className="flex-1">
              <p className="font-bold mb-1" style={{ fontSize: 26, color: `hsl(${C})` }}>{l.label}</p>
              <p style={{ fontSize: 20, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{l.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 04 — Three Gaps ────────────────────────────────────────────────────

function Slide04Tried() {
  const gaps = [
    {
      n: "01", title: "No way to define and enforce how AI work gets done",
      current: "Playbooks live in wikis and shared drives. They never reach the actual AI session.",
      tools: "Notion, Confluence, prompt libraries",
      liza: "Living playbooks enforced in every session",
    },
    {
      n: "02", title: "No way to execute as a team inside AI",
      current: "Everyone prompts alone. Insights stay in individual chats. Your team operates as soloists.",
      tools: "ChatGPT, Claude, Slack channels",
      liza: "Team-wide context injected in every session",
    },
    {
      n: "03", title: "No way to learn and compound across engagements",
      current: "Every session starts from scratch. Nothing compounds. Your system never gets smarter.",
      tools: "Retrospective tools, AI memory features",
      liza: "Continuous learning loops across the team",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />

      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="The Three Gaps" />
        <h2 className="font-black mb-3" style={{ fontSize: 62, color: `hsl(${C})` }}>
          What's missing between your team and AI.
        </h2>
        <p className="mb-8" style={{ fontSize: 24, color: `hsl(${MUT})` }}>
          Every tool solves a piece. None solve the system.
        </p>

        <div className="space-y-5">
          {gaps.map((g) => (
            <div key={g.n} className="flex gap-6 p-7 rounded-2xl border"
              style={{ background: BG2, borderColor: `hsl(${BLUE} / 0.15)` }}>
              <span className="font-black shrink-0 mt-1" style={{ fontSize: 40, color: `hsl(${BLUE} / 0.2)`, lineHeight: 1 }}>{g.n}</span>
              <div className="flex-1">
                <p className="font-bold mb-2" style={{ fontSize: 26, color: `hsl(${C})` }}>{g.title}</p>
                <p className="mb-3" style={{ fontSize: 20, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{g.current}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg border"
                    style={{ borderColor: `hsl(${RED} / 0.15)`, background: `hsl(${RED} / 0.05)` }}>
                    <X style={{ width: 16, height: 16, color: `hsl(${RED} / 0.6)` }} />
                    <span style={{ fontSize: 17, color: `hsl(${MUT})` }}>{g.tools}</span>
                  </div>
                  <ArrowRight style={{ width: 20, height: 20, color: `hsl(${MUT} / 0.4)` }} />
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg border"
                    style={{ borderColor: `hsl(${BLUE} / 0.3)`, background: `hsl(${BLUE} / 0.07)` }}>
                    <CheckCircle2 style={{ width: 16, height: 16, color: `hsl(${BLUE})` }} />
                    <span className="font-semibold" style={{ fontSize: 17, color: `hsl(${BLUE})` }}>{g.liza}</span>
                  </div>
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

// ─── Slide 05 — The LIZA Loop ────────────────────────────────────────────────

function Slide05Solution() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${BLUE}), transparent 70%)` }} />

      <div className="relative z-10 px-28 w-full">
        <div className="text-center mb-14">
          <Tag label="The LIZA Loop" />
          <h2 className="font-black" style={{ fontSize: 82, color: `hsl(${C})`, lineHeight: 1.05 }}>
            The loop that makes it stick.
          </h2>
          <p className="mt-4" style={{ fontSize: 34, color: `hsl(${MUT})` }}>
            Three steps. One loop. Your team's best thinking becomes the default for everyone.
          </p>
        </div>

        <div className="flex gap-8 justify-center mb-8">
          {[
            {
              icon: <Shield size={40} />, color: BLUE, step: "01",
              title: "Define & Enforce",
              desc: "Turn scattered prompts and tribal knowledge into living playbooks. Enforced in every session, updated continuously.",
            },
            {
              icon: <Users size={40} />, color: TEAL, step: "02",
              title: "Execute Together",
              desc: "One person's insight becomes the whole team's advantage. Context injected in every session, not copy-pasted.",
            },
            {
              icon: <Brain size={40} />, color: BLUE, step: "03",
              title: "Learn & Compound",
              desc: "Every engagement feeds back into living playbooks. The team compounds. Tuesday's insight is Wednesday's default.",
            },
          ].map(({ icon, color, step, title, desc }) => (
            <div key={title} className="flex-1 rounded-2xl border p-7 flex flex-col gap-4"
              style={{ background: `hsl(${color} / 0.06)`, borderColor: `hsl(${color} / 0.25)` }}>
              <div className="flex items-center gap-4">
                <span className="font-black" style={{ fontSize: 48, color: `hsl(${color} / 0.2)`, lineHeight: 1 }}>{step}</span>
                <div style={{ color: `hsl(${color})` }}>{icon}</div>
              </div>
              <p className="font-bold" style={{ fontSize: 34, color: `hsl(${C})` }}>{title}</p>
              <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 px-10 py-5 rounded-xl border"
          style={{ borderColor: `hsl(${BLUE} / 0.2)`, background: `hsl(${BLUE} / 0.05)` }}>
          <TrendingUp size={28} style={{ color: `hsl(${BLUE})`, flexShrink: 0 }} />
          <p style={{ fontSize: 24, color: `hsl(${MUT})` }}>
            Whether your team uses AI tools or not, <strong style={{ color: `hsl(${C})` }}>the loop works</strong>. AI just accelerates the compounding.
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 06 — How It Works ─────────────────────────────────────────────────

function Slide06HowItWorks() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />

      <div className="absolute right-0 top-0 w-[700px] h-[700px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)`, transform: "translate(20%, -20%)" }} />

      {/* Left */}
      <div className="flex flex-col justify-center pl-[140px] pr-[80px] w-[820px] relative z-10">
        <Tag label="How It Works" />
        <h2 className="font-black leading-tight mb-8" style={{ fontSize: 74, color: `hsl(${C})` }}>
          Three modes.
          <br />
          <span style={{ color: `hsl(${BLUE})` }}>One platform.</span>
        </h2>
        <p style={{ fontSize: 26, color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          LIZA adapts to each role.
          Leaders define standards. Teams execute with them.
          The system tracks alignment. All in one place.
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-col justify-center flex-1 pr-[100px] gap-5 relative z-10">
        {[
          {
            icon: <Target size={32} />, label: "The Launchpad",
            sub: "For team members",
            desc: "Protocol-mapped action cards replace blank-page prompting. AI adapts to each step. Every session runs the team's latest, best playbook.",
            col: BLUE,
          },
          {
            icon: <Brain size={32} />, label: "The Process Studio",
            sub: "For team leads & experts",
            desc: "Drag-and-drop playbook creation from documents, chats, and tribal knowledge. Define standards that actually reach the AI session.",
            col: TEAL,
          },
          {
            icon: <BarChart3 size={32} />, label: "The Command Center",
            sub: "For leaders",
            desc: "Drift detection, execution analytics, outcome tracking. See who's on-standard and where judgment is deviating. Without micromanaging.",
            col: GOLD,
          },
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-6 p-7 rounded-xl border"
            style={{ background: `hsl(${s.col} / 0.05)`, borderColor: `hsl(${s.col} / 0.25)` }}>
            <div className="flex-shrink-0 mt-1" style={{ color: `hsl(${s.col})` }}>{s.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold" style={{ fontSize: 28, color: `hsl(${C})` }}>{s.label}</span>
                <span className="font-medium" style={{ fontSize: 20, color: `hsl(${s.col})` }}>— {s.sub}</span>
              </div>
              <p style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          </div>
        ))}

        <div className="p-5 rounded-xl border mt-2" style={{ background: `hsl(${BLUE} / 0.05)`, borderColor: `hsl(${BLUE} / 0.2)` }}>
          <p style={{ fontSize: 21, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
            <strong style={{ color: `hsl(${C})` }}>Start in days, not months.</strong>{" "}
            Your team leads build playbooks directly in the platform. No consultants required. No implementation project.
          </p>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 07 — Two Entry Points ─────────────────────────────────────────────

function Slide07TwoPaths() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />

      <div className="relative z-10 flex flex-col justify-center h-full px-[120px]">
        <Tag label="Two Ways to Start" />
        <h2 className="font-black mb-3" style={{ fontSize: 68, color: `hsl(${C})`, lineHeight: 1.05 }}>
          Choose your entry point.
        </h2>
        <p className="mb-8" style={{ fontSize: 26, color: `hsl(${MUT})` }}>
          Both paths lead to the same outcome: your team executing on shared, living standards.
        </p>

        <div className="grid grid-cols-2 gap-8">
          {/* Path 1 */}
          <div className="rounded-2xl border p-9 flex flex-col relative overflow-hidden"
            style={{ background: `hsl(${BLUE} / 0.05)`, borderColor: `hsl(${BLUE} / 0.35)` }}>
            <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: `hsl(${BLUE})` }} />
            <Chip color={BLUE}>Path 1</Chip>
            <h3 className="font-black mt-4 mb-2" style={{ fontSize: 42, color: `hsl(${C})` }}>
              Take the Diagnostic
            </h3>
            <p className="mb-5" style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
              90 seconds. Find out where your team sits on the maturity ladder.
              Get a personalised report with your Context Gap score.
            </p>
            <div className="space-y-3 flex-1">
              {[
                "Identify your team's current maturity level",
                "See which gaps are costing you the most",
                "Get a prioritised improvement roadmap",
                "Share results with leadership",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={20} style={{ color: `hsl(${BLUE})`, flexShrink: 0 }} />
                  <p style={{ fontSize: 21, color: `hsl(${C})` }}>{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 px-5 py-3 rounded-xl" style={{ background: `hsl(${BLUE} / 0.1)` }}>
              <p className="font-semibold" style={{ fontSize: 19, color: `hsl(${BLUE})` }}>
                Best for: Teams that want to understand before they commit
              </p>
            </div>
          </div>

          {/* Path 2 */}
          <div className="rounded-2xl border p-9 flex flex-col relative overflow-hidden"
            style={{ background: `hsl(${TEAL} / 0.05)`, borderColor: `hsl(${TEAL} / 0.35)` }}>
            <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: `hsl(${TEAL})` }} />
            <Chip color={TEAL}>Path 2</Chip>
            <h3 className="font-black mt-4 mb-2" style={{ fontSize: 42, color: `hsl(${C})` }}>
              Book a Discovery Call
            </h3>
            <p className="mb-5" style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
              30-minute session with our team. Map your team's AI landscape
              and identify the highest-impact playbook to build first.
            </p>
            <div className="space-y-3 flex-1">
              {[
                "Map your team's current AI workflows",
                "Identify the standards your team needs most",
                "Build your first living playbook together",
                "Deploy across your team in days",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={20} style={{ color: `hsl(${TEAL})`, flexShrink: 0 }} />
                  <p style={{ fontSize: 21, color: `hsl(${C})` }}>{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 px-5 py-3 rounded-xl" style={{ background: `hsl(${TEAL} / 0.1)` }}>
              <p className="font-semibold" style={{ fontSize: 19, color: `hsl(${TEAL})` }}>
                Best for: Teams ready to start building standards immediately
              </p>
            </div>
          </div>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 08 — Product Capabilities ─────────────────────────────────────────

function Slide08Capabilities() {
  const features = [
    { label: "Living Playbooks", desc: "Define execution standards that evolve with every engagement. Not static docs. Living, enforced, always current.", color: BLUE, icon: <BookOpen size={28} /> },
    { label: "Intent Lock", desc: "Full AI alignment to the current protocol step. Context injection, not prompt engineering.", color: TEAL, icon: <Lock size={28} /> },
    { label: "Knowledge Bundles", desc: "Structured context inheritance. Org → Domain → Team → Session. Everyone gets the right context.", color: BLUE, icon: <Layers size={28} /> },
    { label: "Smart Ingestion", desc: "Drag-and-drop documents. AI extracts candidate playbooks for one-click approval. Tribal knowledge captured.", color: TEAL, icon: <Zap size={28} /> },
    { label: "Drift Detection", desc: "Real-time deviation scoring against locked playbooks. Catch inconsistency before it ships.", color: BLUE, icon: <Shield size={28} /> },
    { label: "Learning Loops", desc: "After-action synthesis captures what worked, what didn't, and feeds back into the team's playbooks.", color: TEAL, icon: <Brain size={28} /> },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <div className="relative z-10 flex flex-col h-full px-[120px] pt-14 pb-10">
        <Tag label="Product Capabilities" />
        <h2 className="font-bold mb-8" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Built for how teams
          <span style={{ color: `hsl(${BLUE})` }}> actually work with AI.</span>
        </h2>

        <div className="grid grid-cols-3 gap-5 flex-1 min-h-0">
          {features.map(({ label, desc, color, icon }) => (
            <div key={label} className="rounded-xl border p-6 flex flex-col gap-3"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.05)` }}>
              <div className="flex items-center gap-3">
                <div style={{ color: `hsl(${color})` }}>{icon}</div>
                <p className="font-bold" style={{ fontSize: 25, color: `hsl(${C})` }}>{label}</p>
              </div>
              <p style={{ fontSize: 20, color: `hsl(${MUT})`, lineHeight: 1.45 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 px-7 py-4 rounded-xl border"
          style={{ borderColor: `hsl(${BLUE} / 0.2)`, background: `hsl(${BLUE} / 0.05)` }}>
          <Award size={24} style={{ color: `hsl(${BLUE})`, flexShrink: 0 }} />
          <p style={{ fontSize: 20, color: `hsl(${MUT})` }}>
            Powered by <strong style={{ color: `hsl(${C})` }}>AACE v3.1</strong>. Proprietary AI context architecture with intent-locking, knowledge injection, and drift detection.
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 09 — The Fork ─────────────────────────────────────────────────────

function Slide09Stakes() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />

      <div className="relative z-10 flex h-full items-center px-[140px] gap-16 w-full">
        {/* Center label */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0 w-[180px]">
          <Tag label="The Fork" />
          <Clock style={{ width: 56, height: 56, color: `hsl(${BLUE})` }} />
          <p className="text-center font-bold" style={{ fontSize: 22, color: `hsl(${BLUE})` }}>Every month compounds</p>
        </div>

        {/* Without */}
        <div className="flex-1 rounded-2xl p-10 border relative overflow-hidden" style={{ background: BG2, borderColor: `hsl(${RED} / 0.2)` }}>
          <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: `hsl(${RED})` }} />
          <p className="font-bold tracking-widest uppercase mb-5" style={{ fontSize: 18, color: `hsl(${RED})` }}>Without standards</p>
          <h3 className="font-bold mb-7" style={{ fontSize: 38, color: `hsl(${C})` }}>Widening Gap</h3>
          {[
            "AI silos multiply. Each person drifts further from the team",
            "Best practices decay. Nobody knows which version is current",
            "Quality depends on who's in the room, not the system",
            "Every new tool adds speed without adding consistency",
          ].map((l, i) => (
            <div key={i} className="flex items-start gap-4 mb-3.5">
              <X style={{ width: 22, height: 22, flexShrink: 0, marginTop: 3, color: `hsl(${RED})` }} />
              <p style={{ fontSize: 23, color: `hsl(${MUT})` }}>{l}</p>
            </div>
          ))}
        </div>

        <ArrowRight style={{ width: 44, height: 44, flexShrink: 0, color: `hsl(${MUT} / 0.4)` }} />

        {/* With LIZA */}
        <div className="flex-1 rounded-2xl p-10 border relative overflow-hidden" style={{ background: `hsl(${BLUE} / 0.05)`, borderColor: `hsl(${BLUE} / 0.4)` }}>
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${BLUE})` }} />
          <p className="font-bold tracking-widest uppercase mb-5" style={{ fontSize: 18, color: `hsl(${BLUE})` }}>With LIZA OS</p>
          <h3 className="font-bold mb-7" style={{ fontSize: 38, color: `hsl(${C})` }}>Compounding Intelligence</h3>
          {[
            "Every team member executes with the latest, best playbook",
            "Standards evolve continuously with every engagement",
            "Consistent quality regardless of who runs the session",
            "The team measurably improves quarter over quarter",
          ].map((l, i) => (
            <div key={i} className="flex items-start gap-4 mb-3.5">
              <CheckCircle2 style={{ width: 22, height: 22, flexShrink: 0, marginTop: 3, color: `hsl(${BLUE})` }} />
              <p style={{ fontSize: 23, color: `hsl(${C})` }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 10 — Who Built This ───────────────────────────────────────────────

function Slide10Who() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />

      <div className="absolute left-[50%] top-[50%] w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)`, transform: "translate(-50%, -50%)" }} />

      <div className="relative z-10 flex h-full">
        {/* Left */}
        <div className="flex flex-col justify-center pl-[120px] pr-[60px] w-[700px]">
          <Tag label="Who Built This" />
          <h2 className="font-black leading-tight mb-6" style={{ fontSize: 62, color: `hsl(${C})` }}>
            Built by practitioners.
            <br />Guided by
            <span style={{ color: `hsl(${TEAL})` }}> industry leaders.</span>
          </h2>
          <p style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 560 }}>
            15 years building data and AI solutions. 15+ clients across 8 countries. We lived the Context Gap before we built the fix.
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col justify-center flex-1 pr-[80px] gap-3">
          <p className="font-bold tracking-widest uppercase mb-0.5" style={{ fontSize: 16, color: `hsl(${BLUE})` }}>Founding Team</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "István Boscha", role: "Product Vision & CEO", bio: "Founder of Aliz.ai (Google Cloud Partner). 15 years in AI transformation.", photo: istvanPhoto, initials: "IB", color: BLUE },
              { name: "Kristóf Éger", role: "Narrative & Go-to-Market", bio: "AI-driven business strategist, embedding AI into decision workflows.", photo: kristofPhoto, initials: "KÉ", color: TEAL },
              { name: "Zoltán Kauker", role: "AI Architecture & Security", bio: "Deep-tech AI and data engineering expert, leading decision systems.", photo: zoltanPhoto, initials: "ZK", color: GOLD },
            ].map((p, i) => (
              <div key={i} className="rounded-xl p-4 border" style={{ background: BG2, borderColor: `hsl(${p.color} / 0.2)` }}>
                <div className="flex items-center gap-2.5 mb-2">
                  {p.photo ? (
                    <img src={p.photo} alt={p.name} className="w-10 h-10 rounded-full object-cover shrink-0"
                      style={{ border: `2px solid hsl(${p.color} / 0.3)` }} />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
                      style={{ background: `hsl(${p.color} / 0.15)`, color: `hsl(${p.color})`, fontSize: 15 }}>
                      {p.initials}
                    </div>
                  )}
                  <div>
                    <p className="font-bold" style={{ fontSize: 18, color: `hsl(${C})` }}>{p.name}</p>
                    <p style={{ fontSize: 13, color: `hsl(${p.color})` }}>{p.role}</p>
                  </div>
                </div>
                <p style={{ fontSize: 15, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{p.bio}</p>
              </div>
            ))}
          </div>

          <p className="font-bold tracking-widest uppercase mt-1.5 mb-0.5" style={{ fontSize: 16, color: `hsl(${GOLD})` }}>Strategic Advisory Board</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Tom Ray", role: "Chairman, Aliz.ai; Founding CEO, EdgeCore", bio: "Scaling global tech service companies and enterprise infrastructure." },
              { name: "Enterprise Advisor", role: "VP Product, Global AEC Software Company (€6B Group)", bio: "15+ years product strategy across global enterprise software. Oxford CS." },
            ].map((a, i) => (
              <div key={i} className="rounded-xl p-4 border" style={{ background: `hsl(${GOLD} / 0.04)`, borderColor: `hsl(${GOLD} / 0.2)` }}>
                <p className="font-bold mb-0.5" style={{ fontSize: 18, color: `hsl(${C})` }}>{a.name}</p>
                <p className="mb-1.5" style={{ fontSize: 13, color: `hsl(${GOLD})` }}>{a.role}</p>
                <p style={{ fontSize: 15, color: `hsl(${MUT})`, lineHeight: 1.4 }}>{a.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 11 — CTA ──────────────────────────────────────────────────────────

function Slide11CTA() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <Grid />

      <div className="absolute w-[1000px] h-[1000px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${BLUE}), transparent 70%)` }} />

      <div className="relative z-10 text-center px-40 max-w-[1500px]">
        <div className="flex items-center justify-center gap-3 mb-10 px-7 rounded-full border mx-auto w-fit"
          style={{ borderColor: `hsl(${BLUE} / 0.35)`, background: `hsl(${BLUE} / 0.07)`, height: 48, lineHeight: "48px" }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${BLUE})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 24, color: `hsl(${BLUE})`, lineHeight: "48px" }}>LIZA OS</span>
        </div>

        <h2 className="font-black mb-6" style={{ fontSize: 96, color: `hsl(${C})`, lineHeight: 1.0 }}>
          Your team's AI results
          <br />
          <span style={{
            background: `linear-gradient(135deg, hsl(${BLUE}), hsl(${TEAL}))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>should be consistent.</span>
        </h2>

        <p className="mb-12" style={{ fontSize: 32, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
          Find out where your team stands. Close the Context Gap.
          <br />
          Start in days, not months. See results in weeks.
        </p>

        <div className="flex items-center justify-center gap-8 mb-14">
          {[
            { n: "01", label: "Take the 90s diagnostic", sub: "See your Context Gap score" },
            { n: "02", label: "Review your report", sub: "Personalised improvement roadmap" },
            { n: "03", label: "Build your first playbook", sub: "Deploy across your team" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-2 px-8 py-6 rounded-2xl border"
                style={{ background: BG2, borderColor: `hsl(${BLUE} / 0.2)`, minWidth: 260 }}>
                <span className="font-mono font-bold" style={{ fontSize: 24, color: `hsl(${BLUE})` }}>{s.n}</span>
                <span className="font-bold" style={{ fontSize: 22, color: `hsl(${C})` }}>{s.label}</span>
                <span style={{ fontSize: 18, color: `hsl(${MUT})` }}>{s.sub}</span>
              </div>
              {i < 2 && <ArrowRight style={{ width: 28, height: 28, color: `hsl(${MUT})`, flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6">
          <a href="https://calendar.app.google/3v8jevUcsgRQnLyL9" target="_blank" rel="noopener noreferrer"
            className="px-10 py-5 rounded-2xl border font-bold inline-block hover:opacity-90 transition-opacity"
            style={{ fontSize: 28, background: `hsl(${BLUE} / 0.12)`, borderColor: `hsl(${BLUE} / 0.4)`, color: `hsl(${BLUE})` }}>
            Book a Discovery Call
          </a>
          <span style={{ fontSize: 22, color: `hsl(${MUT})` }}>kristof.eger@lizaos.ai</span>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide registry ───────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, title: "Cover", component: <Slide01Cover /> },
  { id: 2, title: "The Context Gap", component: <Slide02Problem /> },
  { id: 3, title: "Maturity Model", component: <Slide03RootCause /> },
  { id: 4, title: "Three Gaps", component: <Slide04Tried /> },
  { id: 5, title: "The LIZA Loop", component: <Slide05Solution /> },
  { id: 6, title: "How It Works", component: <Slide06HowItWorks /> },
  { id: 7, title: "Two Paths", component: <Slide07TwoPaths /> },
  { id: 8, title: "Capabilities", component: <Slide08Capabilities /> },
  { id: 9, title: "The Fork", component: <Slide09Stakes /> },
  { id: 10, title: "Who Built This", component: <Slide10Who /> },
  { id: 11, title: "Next Steps", component: <Slide11CTA /> },
];

// ─── Shell ────────────────────────────────────────────────────────────────────

const CHROME_BG = "hsl(220 15% 97%)";
const CHROME_BORDER = "hsl(220 12% 90%)";

export default function ConsultingDeck() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const exportRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobileViewport();
  const isPortrait = useIsPortrait();

  const goTo = useCallback((idx: number) => {
    setCurrent(Math.max(0, Math.min(SLIDES.length - 1, idx)));
    setShowGrid(false);
  }, []);

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  useSwipe(next, prev);

  // Export handled by ExportMenu component

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

  const [mobileControlsVisible, setMobileControlsVisible] = useState(true);
  const mobileTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const showMobileControls = useCallback(() => {
    setMobileControlsVisible(true);
    clearTimeout(mobileTimerRef.current);
    mobileTimerRef.current = setTimeout(() => setMobileControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    if (isMobile && !isPortrait) showMobileControls();
    return () => clearTimeout(mobileTimerRef.current);
  }, [isMobile, isPortrait, showMobileControls]);

  // ─── Mobile ─────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999]" style={{ background: BG }}
        onClick={() => { if (!isPortrait) showMobileControls(); }}>
        {isPortrait && (
          <div className="absolute inset-0 z-[10000] flex flex-col items-center justify-center gap-4 px-8"
            style={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(8px)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `hsl(${BLUE} / 0.1)`, border: `1px solid hsl(${BLUE} / 0.3)` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`hsl(${BLUE})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <path d="M12 18h.01" />
              </svg>
            </div>
            <p className="text-center font-semibold" style={{ fontSize: 18, color: `hsl(${C})` }}>
              Rotate your device to landscape
            </p>
            <p className="text-center" style={{ fontSize: 14, color: `hsl(${MUT})` }}>
              for the best viewing experience
            </p>
          </div>
        )}

        <ScaledSlide>{slide.component}</ScaledSlide>

        {!isPortrait && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); showMobileControls(); }}
              disabled={current === 0}
              className="absolute left-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-start pl-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(90deg, hsl(0 0% 0% / 0.06), transparent)" }}
              aria-label="Previous slide"
            >
              <ChevronLeft size={32} style={{ color: `hsl(${MUT} / 0.5)` }} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); showMobileControls(); }}
              disabled={current === SLIDES.length - 1}
              className="absolute right-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-end pr-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(270deg, hsl(0 0% 0% / 0.06), transparent)" }}
              aria-label="Next slide"
            >
              <ChevronRight size={32} style={{ color: `hsl(${MUT} / 0.5)` }} />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full transition-opacity duration-300"
          style={{
            background: "hsl(0 0% 100% / 0.9)", border: `1px solid ${CHROME_BORDER}`, backdropFilter: "blur(8px)",
            opacity: mobileControlsVisible ? 1 : 0, pointerEvents: mobileControlsVisible ? "auto" : "none",
          }}
          onClick={(e) => e.stopPropagation()}>
          <button onClick={prev} disabled={current === 0} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronLeft size={18} style={{ color: `hsl(${C})` }} />
          </button>
          <span className="font-mono text-xs px-1" style={{ color: `hsl(${MUT})` }}>
            {current + 1}/{SLIDES.length}
          </span>
          <button onClick={next} disabled={current === SLIDES.length - 1} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronRight size={18} style={{ color: `hsl(${C})` }} />
          </button>
          <div className="w-px h-4" style={{ background: `hsl(${MUT} / 0.3)` }} />
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Sales-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={`hsl(${MUT})`} />
        </div>

        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
          {SLIDES.map(s => (
            <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>
              {s.component}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Fullscreen ─────────────────────────────────────────────────────────────
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-white z-[9999]" style={{ cursor: showNav ? "default" : "none" }}>
        <ScaledSlide>{slide.component}</ScaledSlide>
        {showNav && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full shadow-lg"
            style={{ background: "hsl(0 0% 100% / 0.95)", border: `1px solid ${CHROME_BORDER}` }}>
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30">
              <ChevronLeft size={20} style={{ color: `hsl(${C})` }} />
            </button>
            <span className="text-sm font-mono px-2" style={{ color: `hsl(${MUT})` }}>{current + 1} / {SLIDES.length}</span>
            <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30">
              <ChevronRight size={20} style={{ color: `hsl(${C})` }} />
            </button>
            <button onClick={() => { document.exitFullscreen?.(); setIsFullscreen(false); }} className="p-2 rounded-lg hover:bg-black/5 ml-2">
              <X size={20} style={{ color: `hsl(${MUT})` }} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── Desktop ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen" style={{ background: CHROME_BG }}>
      <div className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${BLUE})` }} />
          <span className="text-sm font-semibold" style={{ color: `hsl(${C})` }}>LIZA OS — Sales Deck</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${BLUE} / 0.1)`, color: `hsl(${BLUE})` }}>
            {SLIDES.length} slides
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Sales-Deck" slideCount={SLIDES.length} variant="desktop" />
          <Button size="sm" variant="ghost" onClick={enterFullscreen}>
            <Maximize2 size={15} className="mr-1.5" /> Present
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-44 flex flex-col gap-2 p-3 overflow-y-auto border-r shrink-0"
          style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)}
              className={cn("w-full rounded-lg overflow-hidden border-2 transition-all text-left shrink-0 flex flex-col",
                i === current ? "border-primary" : "border-transparent opacity-60 hover:opacity-90"
              )}>
              <div className="w-full" style={{ aspectRatio: "16/9", pointerEvents: "none" }}>
                <ScaledSlide>{s.component}</ScaledSlide>
              </div>
              <p className="text-[10px] px-1.5 py-1" style={{ color: `hsl(${MUT})` }}>
                {String(i + 1).padStart(2, "0")} {s.title}
              </p>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {showGrid ? (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-3 gap-6">
                {SLIDES.map((s, i) => (
                  <button key={s.id} onClick={() => goTo(i)}
                    className={cn("flex flex-col gap-2 rounded-xl overflow-hidden border-2 transition-all",
                      i === current ? "border-primary" : "border-transparent hover:border-border"
                    )}>
                    <div className="w-full" style={{ aspectRatio: "16/9" }}>
                      <ScaledSlide>{s.component}</ScaledSlide>
                    </div>
                    <p className="text-xs px-2 pb-2" style={{ color: `hsl(${MUT})` }}>
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

          {!showGrid && (
            <div className="flex items-center justify-between px-8 py-3 border-t shrink-0"
              style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
              <div className="flex gap-2">
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === current ? 32 : 8,
                      background: i === current ? `hsl(${BLUE})` : CHROME_BORDER,
                    }} />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline" onClick={prev} disabled={current === 0}>
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-xs font-mono" style={{ color: `hsl(${MUT})` }}>
                  {current + 1} / {SLIDES.length}
                </span>
                <Button size="sm" variant="outline" onClick={next} disabled={current === SLIDES.length - 1}>
                  <ChevronRight size={16} />
                </Button>
              </div>
              <p className="text-xs" style={{ color: `hsl(${MUT})` }}>← → navigate &nbsp; G grid &nbsp; F present</p>
            </div>
          )}
        </div>
      </div>

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>
            {s.component}
          </div>
        ))}
      </div>
    </div>
  );
}
