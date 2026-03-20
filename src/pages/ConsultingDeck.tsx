import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, Grid3x3, X,
  Brain, Target, Zap, BookOpen, TrendingUp, CheckCircle2,
  ArrowRight, AlertTriangle, Clock, Award, Layers, Lock,
  Download, Loader2, Users, BarChart3, Shield, Workflow
} from "lucide-react";
import { cn } from "@/lib/utils";
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

        <h1 className="font-black mb-10" style={{ fontSize: 108, lineHeight: 1.0, color: `hsl(${C})` }}>
          Your Best People
          <br />
          <span style={{ background: `linear-gradient(135deg, hsl(${BLUE}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Can't Be Everywhere.
          </span>
        </h1>

        <p style={{ fontSize: 36, color: `hsl(${MUT})`, maxWidth: 1200, lineHeight: 1.55 }}>
          LIZA extracts senior expertise and turns it into executable protocols
          <br />your entire organisation can run on. <strong style={{ color: `hsl(${C})` }}>Consistently.</strong>
        </p>

        <div className="mt-16 flex items-center gap-8">
          <Chip color={BLUE}>Standards Engineering</Chip>
          <Chip color={TEAL}>Codify Senior Judgment</Chip>
          <Chip color={GOLD}>Scale What Makes You Different</Chip>
        </div>
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
      <div className="relative z-10 flex flex-col justify-center h-full px-28">
        <Tag label="The Problem" color={RED} />
        <h2 className="font-bold mb-12" style={{ fontSize: 72, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Professional firms scale headcount.
          <br />
          <span style={{ color: `hsl(${RED})` }}>Not capability.</span>
        </h2>

        <div className="grid grid-cols-3 gap-7">
          {[
            {
              icon: <Users size={48} />, color: RED,
              title: "Knowledge walks out the door",
              body: "Your best people carry methodology in their heads. Every resignation erases years of accumulated judgment."
            },
            {
              icon: <Target size={48} />, color: GOLD,
              title: "Execution is inconsistent",
              body: "Same brief, 14 different outputs. Quality depends on who supervises. No shared standard."
            },
            {
              icon: <BarChart3 size={48} />, color: RED,
              title: "AI accelerates the problem",
              body: "Generic AI gives everyone content generation — with zero organisational context. Faster at producing the wrong thing."
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

// ─── Slide 03 — Root Cause ────────────────────────────────────────────────────

function Slide03RootCause() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />

      <div className="absolute w-[700px] h-[700px] rounded-full opacity-[0.07]"
        style={{ background: `radial-gradient(circle, hsl(${BLUE}), transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />

      {/* Left */}
      <div className="flex flex-col justify-center pl-[140px] pr-[80px] w-[900px] relative z-10">
        <Tag label="The Root Cause" />
        <h2 className="font-black leading-tight mb-10" style={{ fontSize: 76, color: `hsl(${C})` }}>
          Everything you've documented is already commoditised.
          <br />
          <span style={{ color: `hsl(${BLUE})` }}>The tacit layer is untouched.</span>
        </h2>
        <p style={{ fontSize: 27, color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          Your documents, SOPs, and frameworks are explicit knowledge.
          AI can approximate them today.
          <br /><br />
          What clients <em style={{ color: `hsl(${C})` }}>actually</em> pay for is the tacit layer:
          the judgment, pattern recognition, and decision logic your seniors carry in their heads. Never written down.
        </p>
      </div>

      {/* Right — two layers */}
      <div className="flex flex-col justify-center flex-1 pr-[120px] gap-6 relative z-10">
        <div className="rounded-2xl p-10 border" style={{ background: BG2, borderColor: `hsl(${MUT} / 0.2)`, opacity: 0.7 }}>
          <div className="flex items-center gap-4 mb-5">
            <BookOpen style={{ width: 36, height: 36, color: `hsl(${MUT})` }} />
            <span className="font-bold tracking-widest uppercase" style={{ fontSize: 19, color: `hsl(${MUT})` }}>Explicit Layer — What AI Already Has</span>
          </div>
          <p style={{ fontSize: 24, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
            Documents · Frameworks · Templates · SOPs · Playbooks
            <br />
            <span style={{ fontSize: 20 }}>Replicable. Commoditised. What your competitors load too.</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px]" style={{ background: `hsl(${BLUE} / 0.3)` }} />
          <span className="font-bold" style={{ fontSize: 20, color: `hsl(${BLUE})` }}>What LIZA surfaces</span>
          <div className="flex-1 h-[1px]" style={{ background: `hsl(${BLUE} / 0.3)` }} />
        </div>

        <div className="rounded-2xl p-10 border" style={{ background: `hsl(${BLUE} / 0.06)`, borderColor: `hsl(${BLUE} / 0.5)` }}>
          <div className="flex items-center gap-4 mb-5">
            <Brain style={{ width: 36, height: 36, color: `hsl(${BLUE})` }} />
            <span className="font-bold tracking-widest uppercase" style={{ fontSize: 19, color: `hsl(${BLUE})` }}>Tacit Layer — What Lives in Expert Heads</span>
          </div>
          <p style={{ fontSize: 24, color: `hsl(${C})`, lineHeight: 1.5 }}>
            Judgment calls · Adaptive heuristics · Pattern recognition · Decision logic
            <br />
            <span style={{ fontSize: 20, color: `hsl(${BLUE})` }}>This is what clients pay for. And what no competitor can replicate.</span>
          </p>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 04 — What Hasn't Worked ───────────────────────────────────────────

function Slide04Tried() {
  const tried = [
    { label: "AI workshops & prompt training", why: "Skills without infrastructure. Knowledge evaporates." },
    { label: "Workflow automation", why: "You accelerated what AI will do for free." },
    { label: "AI agents & assistants", why: "They run on public data, not your judgment." },
    { label: "Documentation & playbooks", why: "Static docs capture 'what' but not 'why.'" },
    { label: "Knowledge bases & wikis", why: "Searchable info, not executable judgment." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />

      <div className="relative z-10 flex flex-col justify-center h-full px-[140px]">
        <Tag label="What You've Probably Tried" />
        <h2 className="font-black mb-2" style={{ fontSize: 62, color: `hsl(${C})` }}>
          And why it hasn't worked.
        </h2>
        <p className="mb-6" style={{ fontSize: 24, color: `hsl(${MUT})` }}>
          Every approach focuses on your frameworks and processes. That's exactly what AI commoditises.
        </p>

        <div className="space-y-2.5">
          {tried.map((t, i) => (
            <div key={i} className="flex items-center gap-5 px-6 py-3.5 rounded-xl border"
              style={{ background: BG2, borderColor: `hsl(${RED} / 0.12)` }}>
              <AlertTriangle style={{ width: 22, height: 22, flexShrink: 0, color: `hsl(${RED} / 0.6)` }} />
              <p className="font-bold flex-shrink-0 w-[380px]" style={{ fontSize: 21, color: `hsl(${C})` }}>{t.label}</p>
              <div className="w-[1px] h-5" style={{ background: `hsl(${RED} / 0.15)` }} />
              <p style={{ fontSize: 20, color: `hsl(${MUT})`, lineHeight: 1.4 }}>→ {t.why}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 p-4 rounded-2xl border" style={{ background: `hsl(${BLUE} / 0.06)`, borderColor: `hsl(${BLUE} / 0.3)` }}>
          <p style={{ fontSize: 21, color: `hsl(${C})`, lineHeight: 1.5 }}>
            <strong style={{ color: `hsl(${BLUE})` }}>The systemic issue:</strong>{" "}
            All these approaches catch the fringes of what makes you different, not the core.
          </p>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 05 — The Solution ─────────────────────────────────────────────────

function Slide05Solution() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <Grid />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${BLUE}), transparent 70%)` }} />

      <div className="relative z-10 px-28 w-full">
        <div className="text-center mb-14">
          <Tag label="The Solution" />
          <h2 className="font-black" style={{ fontSize: 92, color: `hsl(${C})`, lineHeight: 1.05 }}>
            LIZA OS
          </h2>
          <p className="mt-4" style={{ fontSize: 34, color: `hsl(${MUT})` }}>
            The platform that turns senior expertise into a scalable operating system.
          </p>
        </div>

        <div className="flex gap-8 justify-center mb-8">
          {[
            {
              icon: <Target size={40} />, color: BLUE, step: "01",
              title: "Execute",
              desc: "Protocol-driven workflows replace blank-page guessing. Every team member runs your best methodology.",
            },
            {
              icon: <Brain size={40} />, color: TEAL, step: "02",
              title: "Learn",
              desc: "After every session, the system captures decisions and deviations. Structured reviews synthesise patterns.",
            },
            {
              icon: <Zap size={40} />, color: BLUE, step: "03",
              title: "Encode",
              desc: "Approved learnings flow back into the knowledge graph. The organisation compounds with each project.",
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
          <Brain size={28} style={{ color: `hsl(${BLUE})`, flexShrink: 0 }} />
          <p style={{ fontSize: 24, color: `hsl(${MUT})` }}>
            Grounded in the <strong style={{ color: `hsl(${C})` }}>SECI model</strong> (Nonaka & Takeuchi) — the proven mechanism behind every learning organization.
            LIZA operationalizes it at software speed.
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
          Three operating modes.
          <br />
          <span style={{ color: `hsl(${BLUE})` }}>One platform.</span>
        </h2>
        <p style={{ fontSize: 26, color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          LIZA adapts to each role in your organisation.
          Seniors define the standard. Teams execute it.
          Leaders track alignment. All in the same system.
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-col justify-center flex-1 pr-[100px] gap-5 relative z-10">
        {[
          {
            icon: <Target size={32} />, label: "The Launchpad",
            sub: "For frontline teams",
            desc: "Protocol-mapped action cards replace blank-page guessing. AI adapts to each step. Every team member runs your best methodology.",
            col: BLUE,
          },
          {
            icon: <Brain size={32} />, label: "The Process Studio",
            sub: "For senior experts",
            desc: "Smart document ingestion, drag-and-drop playbook creation, after-action synthesis. Your experts define the standard, the platform scales it.",
            col: TEAL,
          },
          {
            icon: <BarChart3 size={32} />, label: "The Command Center",
            sub: "For leaders",
            desc: "Drift detection, execution analytics, outcome tracking. See who's on-standard and where judgment is deviating — without micromanaging.",
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
            <strong style={{ color: `hsl(${C})` }}>Self-service from day one.</strong>{" "}
            Your senior experts build playbooks directly in the platform. No consultants required. No implementation project. Start in hours.
          </p>
        </div>
      </div>

      <Bar />
    </div>
  );
}

// ─── Slide 07 — Two Paths ────────────────────────────────────────────────────

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
          Both paths lead to the same outcome: your organisation running on standardised senior judgment.
        </p>

        <div className="grid grid-cols-2 gap-8">
          {/* Path 1 */}
          <div className="rounded-2xl border p-9 flex flex-col relative overflow-hidden"
            style={{ background: `hsl(${BLUE} / 0.05)`, borderColor: `hsl(${BLUE} / 0.35)` }}>
            <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: `hsl(${BLUE})` }} />
            <Chip color={BLUE}>Path 1</Chip>
            <h3 className="font-black mt-4 mb-2" style={{ fontSize: 42, color: `hsl(${C})` }}>
              Codify Your Expertise
            </h3>
            <p className="mb-5" style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
              Start with your core methodology. Surface what makes your senior people exceptional.
              Turn it into executable protocols your entire team can run.
            </p>
            <div className="space-y-3 flex-1">
              {[
                "Identify your unique tacit knowledge",
                "Build executable playbooks in the platform",
                "Deploy across teams in weeks, not months",
                "Every new project compounds your knowledge base",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={20} style={{ color: `hsl(${BLUE})`, flexShrink: 0 }} />
                  <p style={{ fontSize: 21, color: `hsl(${C})` }}>{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 px-5 py-3 rounded-xl" style={{ background: `hsl(${BLUE} / 0.1)` }}>
              <p className="font-semibold" style={{ fontSize: 19, color: `hsl(${BLUE})` }}>
                Best for: Firms with strong methodology that needs to scale beyond the founders
              </p>
            </div>
          </div>

          {/* Path 2 */}
          <div className="rounded-2xl border p-9 flex flex-col relative overflow-hidden"
            style={{ background: `hsl(${TEAL} / 0.05)`, borderColor: `hsl(${TEAL} / 0.35)` }}>
            <div className="absolute top-0 left-0 right-0 h-[4px]" style={{ background: `hsl(${TEAL})` }} />
            <Chip color={TEAL}>Path 2</Chip>
            <h3 className="font-black mt-4 mb-2" style={{ fontSize: 42, color: `hsl(${C})` }}>
              Scale Your AI Motion
            </h3>
            <p className="mb-5" style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.5 }}>
              Already using AI tools across teams? LIZA gives them organisational context.
              Stop teams producing the wrong thing faster.
            </p>
            <div className="space-y-3 flex-1">
              {[
                "Inject your standards into every AI interaction",
                "Protocol-driven workflows replace prompt guessing",
                "Drift detection catches when teams go off-standard",
                "After-action synthesis captures what's working",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={20} style={{ color: `hsl(${TEAL})`, flexShrink: 0 }} />
                  <p style={{ fontSize: 21, color: `hsl(${C})` }}>{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 px-5 py-3 rounded-xl" style={{ background: `hsl(${TEAL} / 0.1)` }}>
              <p className="font-semibold" style={{ fontSize: 19, color: `hsl(${TEAL})` }}>
                Best for: Organisations already deploying AI that need governance and consistency
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
    { label: "Action Grid", desc: "Protocol-mapped action cards replace blank chat. One click activates the right methodology.", color: BLUE, icon: <Target size={28} /> },
    { label: "Intent Lock", desc: "Full AI alignment to the current protocol step. Context injection, not prompt engineering.", color: TEAL, icon: <Lock size={28} /> },
    { label: "Knowledge Bundles", desc: "Structured context inheritance. Org → Domain → Team → Workbook. Everyone gets the right context.", color: BLUE, icon: <Layers size={28} /> },
    { label: "Smart Ingestion", desc: "Drag-and-drop documents. AI extracts candidate playbooks for one-click approval.", color: TEAL, icon: <Zap size={28} /> },
    { label: "Drift Detection", desc: "Real-time deviation scoring against locked playbooks. Catch inconsistency before it ships.", color: BLUE, icon: <Shield size={28} /> },
    { label: "After-Action Synthesis", desc: "AI-powered session review captures what worked, what didn't, and feeds the knowledge graph.", color: TEAL, icon: <Brain size={28} /> },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <Grid />
      <div className="relative z-10 flex flex-col h-full px-[120px] pt-14 pb-10">
        <Tag label="Product Capabilities" />
        <h2 className="font-bold mb-8" style={{ fontSize: 64, color: `hsl(${C})`, lineHeight: 1.1 }}>
          Built for how professionals
          <span style={{ color: `hsl(${BLUE})` }}> actually work.</span>
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
            Powered by <strong style={{ color: `hsl(${C})` }}>AACE v3.1</strong> — proprietary AI context architecture with intent-locking, knowledge injection, and drift detection.
          </p>
        </div>
      </div>
      <Bar />
    </div>
  );
}

// ─── Slide 09 — The Stakes ───────────────────────────────────────────────────

function Slide09Stakes() {
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <Grid />

      <div className="relative z-10 flex h-full items-center px-[140px] gap-16 w-full">
        {/* Center label */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0 w-[180px]">
          <Tag label="12–18 months" />
          <Clock style={{ width: 56, height: 56, color: `hsl(${BLUE})` }} />
          <p className="text-center font-bold" style={{ fontSize: 22, color: `hsl(${BLUE})` }}>The window</p>
        </div>

        {/* If you wait */}
        <div className="flex-1 rounded-2xl p-10 border relative overflow-hidden" style={{ background: BG2, borderColor: `hsl(${RED} / 0.2)` }}>
          <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: `hsl(${RED})` }} />
          <p className="font-bold tracking-widest uppercase mb-5" style={{ fontSize: 18, color: `hsl(${RED})` }}>Without a system</p>
          <h3 className="font-bold mb-7" style={{ fontSize: 38, color: `hsl(${C})` }}>Knowledge Entropy</h3>
          {[
            "Senior expertise stays trapped in individual heads",
            "AI tools produce outputs with no organisational context",
            "Quality depends on who's in the room",
            "Every departure is a capability loss event",
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
            "Senior expertise becomes a reusable organisational asset",
            "Every AI interaction carries your methodology context",
            "Consistent quality regardless of who executes",
            "The organisation gets smarter with every project",
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
            Built by Experts,
            <br />Guided by
            <span style={{ color: `hsl(${TEAL})` }}> Industry Leaders.</span>
          </h2>
          <p style={{ fontSize: 22, color: `hsl(${MUT})`, lineHeight: 1.6, maxWidth: 560 }}>
            Firms full of senior expertise, no way to scale it.
            Knowledge trapped in heads. Handoffs broken. We built the fix.
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
              { name: "Sylwester Pawluk", role: "VP Product, GRAPHISOFT", bio: "15+ years product strategy at GE Healthcare & GRAPHISOFT. Oxford CS." },
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
          The best organisations
          <br />don't just hire experts.
          <br />
          <span style={{
            background: `linear-gradient(135deg, hsl(${BLUE}), hsl(${TEAL}))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>They build systems that think.</span>
        </h2>

        <p className="mb-12" style={{ fontSize: 32, color: `hsl(${MUT})`, lineHeight: 1.55 }}>
          Start codifying your senior expertise today.
          <br />
          Self-service. No implementation project. Results in weeks.
        </p>

        <div className="flex items-center justify-center gap-8 mb-14">
          {[
            { n: "01", label: "30-min discovery call", sub: "Map your expertise landscape" },
            { n: "02", label: "Self-service onboarding", sub: "Build your first playbook" },
            { n: "03", label: "Deploy across teams", sub: "Standardise and scale" },
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
  { id: 1, label: "Cover", component: Slide01Cover },
  { id: 2, label: "The Problem", component: Slide02Problem },
  { id: 3, label: "Root Cause", component: Slide03RootCause },
  { id: 4, label: "What Hasn't Worked", component: Slide04Tried },
  { id: 5, label: "The Solution", component: Slide05Solution },
  { id: 6, label: "How It Works", component: Slide06HowItWorks },
  { id: 7, label: "Two Paths", component: Slide07TwoPaths },
  { id: 8, label: "Capabilities", component: Slide08Capabilities },
  { id: 9, label: "The Stakes", component: Slide09Stakes },
  { id: 10, label: "Who Built This", component: Slide10Who },
  { id: 11, label: "Get Started", component: Slide11CTA },
];

// ─── Shell ────────────────────────────────────────────────────────────────────

export default function ConsultingDeck() {
  const [current, setCurrent] = useState(0);
  const [grid, setGrid] = useState(false);
  const [fs, setFs] = useState(false);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobileViewport();
  const isPortrait = useIsPortrait();

  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);
  const next = useCallback(() => setCurrent(c => Math.min(c + 1, SLIDES.length - 1)), []);
  useSwipe(next, prev);

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
        const gradientEls = slideEls[i].querySelectorAll<HTMLElement>('span');
        const origStyles: string[] = [];
        const affected: HTMLElement[] = [];
        gradientEls.forEach((el) => {
          const cs = el.style.cssText;
          if (cs.includes('background-clip') || cs.includes('BackgroundClip') || cs.includes('text-fill-color') || cs.includes('TextFillColor')) {
            origStyles.push(cs);
            affected.push(el);
            el.style.cssText = `color: hsl(${BLUE}); font: inherit;`;
          }
        });
        const canvas = await html2canvas(slideEls[i], { width: 1920, height: 1080, scale: 2, useCORS: true, backgroundColor: null });
        affected.forEach((el, j) => { el.style.cssText = origStyles[j]; });
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 1920, 1080);
      }
      pdf.save('LIZA-OS-Sales-Deck.pdf');
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
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
  }, [next, prev]);

  const Slide = SLIDES[current].component;

  // ─── Mobile: auto-hide controls ─────────────────────────────────────────────
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

  // ─── Mobile: clean present mode ─────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999]" style={{ background: "hsl(0 0% 100%)" }}
        onClick={() => { if (!isPortrait) showMobileControls(); }}>
        {/* Rotate hint overlay */}
        {isPortrait && (
          <div className="absolute inset-0 z-[10000] flex flex-col items-center justify-center gap-4 px-8"
            style={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(8px)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `hsl(${BLUE} / 0.15)`, border: `1px solid hsl(${BLUE} / 0.3)` }}>
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

        {/* Full-bleed slide */}
        <ScaledSlide><Slide /></ScaledSlide>

        {/* Landscape tap-zone arrows */}
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

        {/* Minimal floating controls — auto-hide */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full transition-opacity duration-300"
          style={{
            background: "hsl(0 0% 100% / 0.9)", border: "1px solid hsl(220 12% 90%)", backdropFilter: "blur(8px)",
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
          <button onClick={handleExportPdf} disabled={exporting} className="p-1.5 rounded-lg disabled:opacity-50">
            {exporting ? <Loader2 size={16} className="animate-spin" style={{ color: `hsl(${MUT})` }} /> : <Download size={16} style={{ color: `hsl(${MUT})` }} />}
          </button>
        </div>

        {/* Export container */}
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

  // ─── Desktop: full chrome ───────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen" style={{ background: "hsl(220 15% 97%)" }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b flex-shrink-0"
        style={{ borderColor: "hsl(220 12% 90%)", background: "hsl(220 15% 97%)" }}>
        <div className="flex items-center gap-4">
          <div className="w-7 h-7 rounded flex items-center justify-center font-black text-sm"
            style={{ background: `hsl(${BLUE})`, color: "hsl(0 0% 100%)" }}>L</div>
          <span className="font-semibold" style={{ fontSize: 14, color: `hsl(${C})` }}>LIZA OS — Sales Deck</span>
          <span style={{ fontSize: 12, color: `hsl(${MUT})` }}>·</span>
          <span style={{ fontSize: 13, color: `hsl(${MUT})` }}>{SLIDES[current].label}</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setGrid(v => !v)}
            className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              grid ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
            style={{ background: grid ? `hsl(${BLUE} / 0.1)` : "transparent" }}>
            <Grid3x3 size={15} /> Grid
          </button>
          <button onClick={handleExportPdf} disabled={exporting}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
            {exporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            {exporting ? "Exporting..." : "PDF"}
          </button>
          <button onClick={() => { if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {}); else document.exitFullscreen().catch(() => {}); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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
          style={{ borderColor: "hsl(220 12% 90%)", background: "hsl(220 15% 97%)" }}>
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => { setCurrent(i); setGrid(false); }}
              className="w-full rounded-lg overflow-hidden border transition-all"
              style={{
                borderColor: i === current ? `hsl(${BLUE} / 0.6)` : "hsl(220 12% 90%)",
                background: i === current ? `hsl(${BLUE} / 0.06)` : "transparent",
              }}>
              <div className="w-full aspect-video">
                <ScaledSlide><s.component /></ScaledSlide>
              </div>
              <div className="px-2 py-1.5 flex items-center gap-2">
                <span className="font-mono font-bold" style={{ fontSize: 10, color: i === current ? `hsl(${BLUE})` : `hsl(${MUT})` }}>
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
              style={{ background: "hsl(220 15% 97%)" }}>
              {SLIDES.map((s, i) => (
                <button key={s.id} onClick={() => { setCurrent(i); setGrid(false); }}
                  className="rounded-xl overflow-hidden border transition-all"
                  style={{ borderColor: i === current ? `hsl(${BLUE} / 0.6)` : "hsl(220 12% 90%)" }}>
                  <div className="w-full aspect-video">
                    <ScaledSlide><s.component /></ScaledSlide>
                  </div>
                  <div className="px-4 py-2 flex items-center gap-3" style={{ background: "hsl(220 15% 95%)" }}>
                    <span className="font-mono font-bold" style={{ fontSize: 13, color: `hsl(${BLUE})` }}>{String(i + 1).padStart(2, "0")}</span>
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
                style={{ borderColor: "hsl(220 12% 90%)" }}>
                <button onClick={prev}
                  disabled={current === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-30"
                  style={{ color: `hsl(${C})`, background: "hsl(220 15% 93%)", fontSize: 14 }}>
                  <ChevronLeft size={18} /> Previous
                </button>

                <div className="flex items-center gap-2">
                  {SLIDES.map((_, i) => (
                    <button key={i} onClick={() => setCurrent(i)}
                      className="rounded-full transition-all"
                      style={{
                        width: i === current ? 24 : 8, height: 8,
                        background: i === current ? `hsl(${BLUE})` : `hsl(${MUT} / 0.4)`,
                      }} />
                  ))}
                </div>

                <button onClick={next}
                  disabled={current === SLIDES.length - 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-30"
                  style={{ color: `hsl(${C})`, background: "hsl(220 15% 93%)", fontSize: 14 }}>
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
