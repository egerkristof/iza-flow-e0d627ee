import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  TrendingUp, Users, Zap, Target, BarChart3,
  Shield, ArrowRight, Layers, Briefcase,
  RefreshCw, BookOpen, AlertTriangle,
  Network, FileText, Eye, CheckCircle2,
  Brain, GitBranch, Workflow, Database,
  DollarSign, Rocket, Globe, Cog,
  Link2, GitMerge, Settings2, Box
} from "lucide-react";
import { ExportMenu } from "@/components/ExportMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import istvanPhoto from "@/assets/istvan-boscha.png";
import kristofPhoto from "@/assets/kristof-eger.png";
import zoltanPhoto from "@/assets/zoltan-kauker.png";

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

// ─── Teal Trust palette ──────────────────────────────────────────────────────

const BG = "hsl(0 0% 100%)";
const TEXT = "hsl(222 20% 10%)";
const MUTED = "hsl(215 15% 42%)";
const SUBTLE = "hsl(215 10% 56%)";
const CARD_ALT = "hsl(220 15% 97%)";
const GRID_LINE = "hsl(215 15% 75%)";
const CHROME_BG = "hsl(220 15% 97%)";
const CHROME_BORDER = "hsl(220 12% 90%)";

const TEAL = "174 97% 28%";
const SEAFOAM = "170 100% 33%";
const MINT = "160 96% 39%";
const WARM = "15 85% 55%";
const DARK_BG = "hsl(200 30% 6%)";
const DARK_TEXT = "hsl(0 0% 95%)";
const DARK_MUTED = "hsl(200 15% 60%)";
const DARK_SUBTLE = "hsl(200 10% 45%)";
const DARK_CARD = "hsl(200 25% 10%)";
const RED = "0 72% 50%";
const GOLD = "45 95% 42%";
const GREEN = "155 72% 38%";
const BLUE = "220 80% 50%";

function SlideGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.06]" style={{
      backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}

function DarkGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.08]" style={{
      backgroundImage: `linear-gradient(hsl(200 15% 20%) 1px, transparent 1px), linear-gradient(90deg, hsl(200 15% 20%) 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}

function SlideBar({ from = TEAL, to = MINT }: { from?: string; to?: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1.5"
      style={{ background: `linear-gradient(90deg, hsl(${from}), hsl(${to}))` }} />
  );
}

function Tag({ label, color = TEAL }: { label: string; color?: string }) {
  return (
    <p className="font-semibold tracking-[0.25em] uppercase mb-5"
      style={{ fontSize: 28, color: `hsl(${color})` }}>{label}</p>
  );
}

function DarkTag({ label, color = TEAL }: { label: string; color?: string }) {
  return (
    <p className="font-semibold tracking-[0.25em] uppercase mb-5"
      style={{ fontSize: 28, color: `hsl(${color} / 0.8)` }}>{label}</p>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 01 — COVER
// ═══════════════════════════════════════════════════════════════════════════════

function Slide01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)` }} />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${MINT}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-28">
        <div className="flex items-center gap-3 mb-10 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.1)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${TEAL})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>
            LIZA OS
          </span>
        </div>

        <h1 className="font-black mb-8" style={{ fontSize: 82, lineHeight: 1.0, color: DARK_TEXT }}>
          AI scales output.<br />
          Nothing scales the<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            judgment behind it.
          </span>
        </h1>

        <p style={{ fontSize: 30, color: DARK_MUTED, maxWidth: 1100, lineHeight: 1.55 }}>
          Every organization runs on expertise: how to sell, how to deliver,
          how to stay compliant. AI can execute all of it — but only if someone
          manages <strong style={{ color: DARK_TEXT }}>what it should know and when that knowledge changes.</strong>
        </p>

        <div className="mt-16 flex items-center gap-16">
          {[
            ["The problem", "AI creates 100x more output — but disconnected from the expertise that should govern it"],
            ["The proof", "Software solved this with lifecycle management. It created a $34B market."],
            ["LIZA OS", "The first system that manages the lifecycle of organizational judgment"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col items-center gap-2 max-w-[380px]">
              <span className="font-black uppercase tracking-wider" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>{k}</span>
              <span className="text-center" style={{ fontSize: 19, color: DARK_SUBTLE }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 02 — THIS HAPPENS EVERY WEEK (moved up for emotional hook)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02SoundFamiliar() {
  const scenarios = [
    {
      icon: <Users size={32} />,
      title: "Your best person left.",
      desc: "They took 8 years of expertise with them. The wiki they wrote is outdated. New hires make the same mistakes for months. There was no system to capture what they knew.",
      color: WARM,
    },
    {
      icon: <Zap size={32} />,
      title: "AI made everyone faster — and less consistent.",
      desc: "Each team member prompts differently, uses different shortcuts, gets different results. Output volume is up 10x. Quality consistency is down. Nobody defined what 'good' looks like.",
      color: TEAL,
    },
    {
      icon: <AlertTriangle size={32} />,
      title: "A standard changed. Nothing downstream updated.",
      desc: "The compliance team updated the methodology last month. The 23 proposals, 8 training decks, and 4 client contracts that depend on it are still using the old version. Nobody even knows which ones.",
      color: RED,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="The Problem" color={WARM} />
        <h2 className="font-black mb-6" style={{ fontSize: 64, color: DARK_TEXT, lineHeight: 1.1 }}>
          These aren't edge cases.<br />
          <span style={{ color: `hsl(${WARM})` }}>They happen every week.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 26, color: DARK_MUTED, maxWidth: 950 }}>
          Every organization that runs on expertise — consulting, pharma, engineering, enterprise sales —
          has the same three problems. None have a system to solve them.
        </p>

        <div className="flex-1 grid grid-cols-3 gap-8">
          {scenarios.map((s) => (
            <div key={s.title} className="rounded-2xl border p-8 flex flex-col"
              style={{ borderColor: `hsl(${s.color} / 0.25)`, background: `hsl(${s.color} / 0.06)` }}>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `hsl(${s.color} / 0.15)`, color: `hsl(${s.color})` }}>
                {s.icon}
              </div>
              <p className="font-bold mb-4" style={{ fontSize: 28, color: DARK_TEXT }}>{s.title}</p>
              <p className="flex-1" style={{ fontSize: 21, color: DARK_MUTED, lineHeight: 1.55 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl px-10 py-6 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
          <p style={{ fontSize: 24, color: DARK_TEXT }}>
            These problems share a root cause:
            <strong style={{ color: `hsl(${TEAL})` }}> expertise lives in people's heads. It has no system, no versioning, no lifecycle.</strong>
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 03 — THE SHIFT: AI Changed What "Work" Is
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03TheShift() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="The Shift" color={WARM} />
        <h2 className="font-black mb-6" style={{ fontSize: 62, color: TEXT, lineHeight: 1.1 }}>
          AI doesn't just assist work.<br />
          <span style={{ color: `hsl(${WARM})` }}>It executes it.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 26, color: MUTED, maxWidth: 1050, lineHeight: 1.5 }}>
          The question is no longer "can AI do this?" — it's "does AI know what <em>good</em> looks like
          for <em>our</em> organization?" That's the context problem.
        </p>

        <div className="flex-1 grid grid-cols-2 gap-10">
          {/* Left: Before AI */}
          <div className="rounded-2xl border p-8" style={{ borderColor: `hsl(215 10% 88%)`, background: CARD_ALT }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: SUBTLE }}>
              Before: Output was slow, managed by people
            </p>
            <div className="flex flex-col gap-4">
              {[
                "One proposal per week — senior person reviewed it",
                "One onboarding program — HR updated it annually",
                "One compliance report — the expert who wrote it owned it",
                "Knowledge lived in people. It worked because output was slow.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-3 rounded-lg"
                  style={{ background: `hsl(215 10% 94%)` }}>
                  <span style={{ fontSize: 22, color: MUTED }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: After AI */}
          <div className="rounded-2xl border-2 p-8" style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.04)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-6" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>
              Now: Output is instant, but disconnected from expertise
            </p>
            <div className="flex flex-col gap-4">
              {[
                "50 proposals per week — AI generates them in minutes",
                "Custom onboarding per hire — AI builds it on the fly",
                "Continuous compliance — AI drafts reports in real time",
                "But whose expertise governs what AI produces? Nobody's.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-3 rounded-lg"
                  style={{ background: `hsl(${TEAL} / 0.06)` }}>
                  <span style={{ fontSize: 22, color: TEXT }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p style={{ fontSize: 24, color: MUTED }}>
            AI turned every repeating workflow into something that runs continuously —
            <strong style={{ color: TEXT }}> like software. But without any of the systems software has.</strong>
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 04 — THE CONSEQUENCE: Unmanaged Lifecycles = Defects
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04UnmanagedLifecycles() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="The Consequence" color={WARM} />
        <h2 className="font-black mb-6" style={{ fontSize: 62, color: DARK_TEXT, lineHeight: 1.1 }}>
          When knowledge changes,<br />
          <span style={{ color: `hsl(${WARM})` }}>nothing downstream knows.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 26, color: DARK_MUTED, maxWidth: 1050, lineHeight: 1.5 }}>
          Your pricing model changed. Your compliance framework updated. Your best practice evolved.
          But every proposal, report, and deliverable that depends on them? Still using the old version.
        </p>

        <div className="flex-1 flex gap-10 items-center">
          {/* Fan-out diagram */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-[700px] h-[400px]">
              <div className="absolute left-[300px] top-[160px] w-[120px] h-[80px] rounded-xl flex items-center justify-center font-bold"
                style={{ fontSize: 20, background: `hsl(${WARM} / 0.15)`, color: `hsl(${WARM})`, border: `2px solid hsl(${WARM} / 0.3)` }}>
                <AlertTriangle size={20} className="mr-2" /> Change
              </div>
              {[
                { label: "Proposal A", x: 0, y: 0 },
                { label: "Training Deck", x: 0, y: 120 },
                { label: "Client Brief", x: 0, y: 240 },
                { label: "SOP v4.2", x: 0, y: 340 },
                { label: "Onboarding", x: 560, y: 0 },
                { label: "Pricing Sheet", x: 560, y: 120 },
                { label: "Audit Report", x: 560, y: 240 },
                { label: "Board Memo", x: 560, y: 340 },
              ].map((node) => (
                <div key={node.label} className="absolute flex items-center gap-2 px-5 py-3 rounded-lg"
                  style={{
                    left: node.x, top: node.y, fontSize: 18, color: DARK_MUTED,
                    background: `hsl(${RED} / 0.06)`, border: `1px dashed hsl(${RED} / 0.3)`,
                  }}>
                  <FileText size={16} style={{ color: `hsl(${RED} / 0.5)` }} />
                  {node.label}
                  <X size={14} style={{ color: `hsl(${RED} / 0.4)` }} />
                </div>
              ))}
            </div>
            <p className="text-center mt-4" style={{ fontSize: 22, color: DARK_SUBTLE }}>
              One methodology update should reach every connected output.<br />
              <strong style={{ color: `hsl(${WARM})` }}>Today, it reaches zero.</strong>
            </p>
          </div>

          <div className="w-[380px] flex flex-col gap-6">
            {[
              { stat: "Dozens", unit: "of outputs", label: "depend on any single piece of organizational knowledge", color: WARM },
              { stat: "Zero", unit: "of them", label: "update automatically when that knowledge evolves", color: RED },
              { stat: "100x", unit: "more", label: "output from AI — meaning 100x more things drifting out of sync", color: TEAL },
            ].map(({ stat, unit, label, color }) => (
              <div key={stat} className="rounded-xl border p-6"
                style={{ borderColor: `hsl(${color} / 0.25)`, background: `hsl(${color} / 0.06)` }}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-black" style={{ fontSize: 40, color: `hsl(${color})` }}>{stat}</span>
                  <span className="font-semibold" style={{ fontSize: 20, color: `hsl(${color} / 0.7)` }}>{unit}</span>
                </div>
                <p style={{ fontSize: 18, color: DARK_MUTED, lineHeight: 1.4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 05 — THIS WAS SOLVED BEFORE (ALM as proof, not anchor)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05ProvenModel() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="The Precedent" />
        <h2 className="font-black mb-4" style={{ fontSize: 60, color: TEXT, lineHeight: 1.1 }}>
          This exact problem was solved before.<br />
          <span style={{ color: `hsl(${TEAL})` }}>For software. It created a $34B market.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          In the 1990s, software projects had the same chaos: missed requirements, untraceable changes,
          no quality control. Then Application Lifecycle Management (ALM) brought four disciplines
          that transformed the industry. The same disciplines apply now — to a much larger domain.
        </p>

        <div className="flex-1 grid grid-cols-4 gap-6">
          {[
            { icon: <GitBranch size={28} />, title: "Traceability", desc: "Every requirement traced from source through code and tests. Nothing fell through the cracks.", now: "Every piece of expertise traced to every output it governs." },
            { icon: <RefreshCw size={28} />, title: "Change Propagation", desc: "When a requirement changed, every dependency was flagged and updated.", now: "When knowledge changes, every proposal, report, and deliverable that depends on it updates." },
            { icon: <GitMerge size={28} />, title: "Version Control", desc: "Every file, every change, every decision — versioned and auditable.", now: "Every methodology, standard, and best practice — versioned and auditable." },
            { icon: <Shield size={28} />, title: "Quality Gates", desc: "No code shipped without passing defined reviews and approvals.", now: "No deliverable goes out without passing human review at critical steps." },
          ].map((p) => (
            <div key={p.title} className="rounded-2xl border p-6 flex flex-col"
              style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: CARD_ALT }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `hsl(${TEAL} / 0.1)`, color: `hsl(${TEAL})` }}>
                {p.icon}
              </div>
              <p className="font-bold mb-2" style={{ fontSize: 24, color: TEXT }}>{p.title}</p>
              <p className="mb-3" style={{ fontSize: 18, color: SUBTLE, lineHeight: 1.45 }}>{p.desc}</p>
              <div className="mt-auto pt-3 border-t" style={{ borderColor: `hsl(${TEAL} / 0.15)` }}>
                <p style={{ fontSize: 17, color: `hsl(${TEAL})`, lineHeight: 1.4 }}>
                  <strong>Now:</strong> {p.now}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 text-center">
          <p style={{ fontSize: 20, color: SUBTLE }}>
            IBM, PTC, Siemens, and Microsoft built multi-billion dollar businesses on these disciplines for code.
            <strong style={{ color: TEXT }}> Nobody has built them for the rest of work.</strong>
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 06 — THE INSIGHT: Two Layers That Must Stay in Sync
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06TwoLayers() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="The Insight" color={TEAL} />
        <h2 className="font-black mb-6" style={{ fontSize: 60, color: DARK_TEXT, lineHeight: 1.05 }}>
          Every organization has two layers.<br />
          <span style={{ color: `hsl(${TEAL})` }}>Today, nothing connects them.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1000, lineHeight: 1.5 }}>
          When knowledge changes, every output should know. When an output reveals
          something new, the knowledge base should update. This is the loop that's missing.
        </p>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-8">
            {/* Left: Knowledge layer */}
            <div className="w-[520px] rounded-2xl p-10" style={{ background: `hsl(${TEAL} / 0.1)`, border: `2px solid hsl(${TEAL} / 0.3)` }}>
              <div className="flex items-center gap-3 mb-6">
                <Brain size={28} style={{ color: `hsl(${TEAL})` }} />
                <span className="font-bold" style={{ fontSize: 28, color: DARK_TEXT }}>What Your Organization Knows</span>
              </div>
              <p className="mb-5" style={{ fontSize: 18, color: DARK_SUBTLE }}>Expertise, standards, methodologies, best practices</p>
              <div className="flex flex-col gap-3">
                {["Sales methodology updated", "Compliance standard revised", "Pricing model changed", "New best practice discovered"].map((item) => (
                  <div key={item} className="px-5 py-3 rounded-lg flex items-center gap-3"
                    style={{ background: `hsl(${TEAL} / 0.08)` }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${TEAL})` }} />
                    <span style={{ fontSize: 20, color: DARK_TEXT }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrows */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <ArrowRight size={36} style={{ color: `hsl(${MINT})` }} />
              </div>
              <div className="px-4 py-2 rounded-lg" style={{ background: `hsl(${MINT} / 0.15)` }}>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${MINT})` }}>PROPAGATE</span>
              </div>
              <div className="flex items-center gap-2 rotate-180">
                <ArrowRight size={36} style={{ color: `hsl(${SEAFOAM})` }} />
              </div>
              <div className="px-4 py-2 rounded-lg" style={{ background: `hsl(${SEAFOAM} / 0.15)` }}>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${SEAFOAM})` }}>LEARN</span>
              </div>
            </div>

            {/* Right: Artifact layer */}
            <div className="w-[520px] rounded-2xl p-10" style={{ background: `hsl(${SEAFOAM} / 0.1)`, border: `2px solid hsl(${SEAFOAM} / 0.3)` }}>
              <div className="flex items-center gap-3 mb-6">
                <Layers size={28} style={{ color: `hsl(${SEAFOAM})` }} />
                <span className="font-bold" style={{ fontSize: 28, color: DARK_TEXT }}>What Your Organization Produces</span>
              </div>
              <p className="mb-5" style={{ fontSize: 18, color: DARK_SUBTLE }}>Proposals, reports, deliverables, training materials</p>
              <div className="flex flex-col gap-3">
                {["Proposals auto-updated", "Training decks flagged", "SOPs version-bumped", "Client briefs synced"].map((item) => (
                  <div key={item} className="px-5 py-3 rounded-lg flex items-center gap-3"
                    style={{ background: `hsl(${SEAFOAM} / 0.08)` }}>
                    <CheckCircle2 size={18} style={{ color: `hsl(${SEAFOAM})` }} />
                    <span style={{ fontSize: 20, color: DARK_TEXT }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={TEAL} to={SEAFOAM} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 07 — THE SOLUTION: LIZA OS
// ═══════════════════════════════════════════════════════════════════════════════

function Slide07LizaOS() {
  const steps = [
    {
      icon: <BookOpen size={32} />, step: "01", title: "Capture",
      desc: "Your best people's expertise — playbooks, standards, methodologies — becomes structured, versionable, and alive. Not a wiki that rots. A living system that evolves.",
    },
    {
      icon: <Network size={32} />, step: "02", title: "Organize",
      desc: "Knowledge is organized into governed bundles scoped to roles, teams, and workflows. Dependencies are mapped so you know what connects to what.",
    },
    {
      icon: <Zap size={32} />, step: "03", title: "Execute",
      desc: "AI-assisted work runs with your team's best judgment built in. Quality gates ensure human review at critical decision points. Consistency at scale.",
    },
    {
      icon: <RefreshCw size={32} />, step: "04", title: "Propagate",
      desc: "When knowledge changes, every connected output knows. When outputs reveal patterns, knowledge improves. The system compounds over time.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="The Solution" />
        <h2 className="font-black mb-4" style={{ fontSize: 60, color: TEXT, lineHeight: 1.05 }}>
          LIZA: The lifecycle management system<br />
          <span style={{ color: `hsl(${TEAL})` }}>for organizational judgment.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1000, lineHeight: 1.5 }}>
          Four steps. One loop. The disciplines that made software reliable —
          traceability, versioning, change propagation, quality gates —
          applied to how your organization thinks, decides, and delivers.
        </p>

        <div className="flex-1 grid grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.step} className="rounded-2xl border p-7 flex flex-col relative"
              style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: i === 3 ? `hsl(${TEAL} / 0.06)` : CARD_ALT }}>
              <span className="font-black tracking-[0.2em] mb-4" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>
                STEP {s.step}
              </span>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
                {s.icon}
              </div>
              <p className="font-bold mb-3" style={{ fontSize: 28, color: TEXT }}>{s.title}</p>
              <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.55 }}>{s.desc}</p>
              {i < 3 && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight size={24} style={{ color: `hsl(${TEAL} / 0.4)` }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <RefreshCw size={20} style={{ color: `hsl(${MINT})` }} />
          <p style={{ fontSize: 22, color: MUTED }}>
            Step 4 feeds back into Step 1 — <strong style={{ color: TEXT }}>the system gets smarter with every use.</strong>
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 08 — HOW IT WORKS IN PRACTICE
// ═══════════════════════════════════════════════════════════════════════════════

function Slide08InPractice() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="In Practice" color={MINT} />
        <h2 className="font-black mb-6" style={{ fontSize: 60, color: DARK_TEXT, lineHeight: 1.1 }}>
          Change one standard.<br />
          <span style={{ color: `hsl(${MINT})` }}>Every connected output updates.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1050, lineHeight: 1.5 }}>
          AI coding tools already do this for code — change one component and the system
          flags every other file that needs updating. LIZA does the same thing for organizational
          knowledge: methodologies, standards, and every deliverable that depends on them.
        </p>

        <div className="flex-1 grid grid-cols-2 gap-10">
          {/* Without LIZA */}
          <div className="rounded-2xl border p-8" style={{ borderColor: `hsl(${RED} / 0.2)`, background: `hsl(${RED} / 0.04)` }}>
            <p className="font-bold mb-6" style={{ fontSize: 24, color: DARK_TEXT }}>Without LIZA</p>
            <div className="flex flex-col gap-4">
              {[
                { step: "Compliance team updates a methodology", icon: <FileText size={20} /> },
                { step: "Email sent: 'Please update your materials'", icon: <AlertTriangle size={20} /> },
                { step: "3 teams update. 5 teams miss it.", icon: <X size={20} /> },
                { step: "Client receives proposal with old standards", icon: <X size={20} /> },
                { step: "Discovered during audit — 4 months later", icon: <AlertTriangle size={20} /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 rounded-lg"
                  style={{ background: `hsl(${RED} / 0.06)` }}>
                  <span style={{ color: `hsl(${RED} / 0.6)` }}>{item.icon}</span>
                  <span style={{ fontSize: 20, color: DARK_MUTED }}>{item.step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* With LIZA */}
          <div className="rounded-2xl border-2 p-8" style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.06)` }}>
            <p className="font-bold mb-6" style={{ fontSize: 24, color: DARK_TEXT }}>With LIZA</p>
            <div className="flex flex-col gap-4">
              {[
                { step: "Compliance team updates methodology in LIZA", icon: <BookOpen size={20} /> },
                { step: "System identifies 23 connected outputs", icon: <Network size={20} /> },
                { step: "Each output flagged with specific changes needed", icon: <Eye size={20} /> },
                { step: "Teams review and approve updated versions", icon: <CheckCircle2 size={20} /> },
                { step: "Full audit trail from standard to deliverable", icon: <Shield size={20} /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 rounded-lg"
                  style={{ background: `hsl(${TEAL} / 0.08)` }}>
                  <span style={{ color: `hsl(${TEAL})` }}>{item.icon}</span>
                  <span style={{ fontSize: 20, color: DARK_TEXT }}>{item.step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={MINT} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 09 — COMPETITIVE LANDSCAPE
// ═══════════════════════════════════════════════════════════════════════════════

function Slide09Competition() {
  const competitors = [
    {
      name: "Edra", raised: "$30M", focus: "Repeatable Ops",
      desc: "Automates predictable, back-office processes. Payroll, onboarding, procurement.",
      limitation: "Only handles standardized tasks. No judgment, no expertise capture.",
    },
    {
      name: "Mem0", raised: "$44.5M", focus: "Memory Layer",
      desc: "Persistent memory for AI agents. Remembers preferences and conversation history.",
      limitation: "Memory without governance. Stores what happened — doesn't manage what should happen.",
    },
    {
      name: "Interloom", raised: "$16.5M", focus: "Knowledge Graphs",
      desc: "Maps tacit knowledge into navigable graphs for discovery and search.",
      limitation: "Captures knowledge but doesn't connect it to live outputs or execution.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="The Market" />
        <h2 className="font-black mb-4" style={{ fontSize: 58, color: TEXT, lineHeight: 1.1 }}>
          $98M+ in funding validates the problem.<br />
          <span style={{ color: `hsl(${TEAL})` }}>Nobody is building the full system.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1000 }}>
          Every competitor solves one piece. None deliver the full lifecycle — capture, govern, execute, and propagate.
        </p>

        <div className="flex-1 flex gap-5">
          {competitors.map((c) => (
            <div key={c.name} className="flex-1 rounded-2xl border p-6 flex flex-col"
              style={{ borderColor: `hsl(215 10% 88%)`, background: CARD_ALT }}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold" style={{ fontSize: 26, color: TEXT }}>{c.name}</span>
                <span className="px-3 py-1 rounded-lg font-bold" style={{ fontSize: 16, background: `hsl(${GREEN} / 0.1)`, color: `hsl(${GREEN})` }}>{c.raised}</span>
              </div>
              <span className="font-semibold mb-3 px-3 py-1 rounded-lg self-start"
                style={{ fontSize: 15, background: `hsl(${TEAL} / 0.08)`, color: `hsl(${TEAL})` }}>{c.focus}</span>
              <p className="mb-4" style={{ fontSize: 19, color: MUTED, lineHeight: 1.5 }}>{c.desc}</p>
              <div className="mt-auto pt-4 border-t" style={{ borderColor: `hsl(215 10% 90%)` }}>
                <p className="flex items-start gap-2" style={{ fontSize: 17, color: SUBTLE }}>
                  <X size={16} style={{ color: `hsl(${RED})`, marginTop: 3, flexShrink: 0 }} />
                  {c.limitation}
                </p>
              </div>
            </div>
          ))}

          <div className="flex-1 rounded-2xl border-2 p-6 flex flex-col"
            style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.04)` }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold" style={{ fontSize: 26, color: TEXT }}>LIZA OS</span>
              <span className="px-3 py-1 rounded-lg font-bold" style={{ fontSize: 16, background: `hsl(${TEAL} / 0.15)`, color: `hsl(${TEAL})` }}>Full System</span>
            </div>
            <span className="font-semibold mb-3 px-3 py-1 rounded-lg self-start"
              style={{ fontSize: 15, background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>Lifecycle Management</span>
            <p className="mb-4" style={{ fontSize: 19, color: MUTED, lineHeight: 1.5 }}>
              Captures expertise, governs it, executes with it, and propagates changes across all connected outputs.
            </p>
            <div className="mt-auto pt-4 border-t" style={{ borderColor: `hsl(${TEAL} / 0.2)` }}>
              <p className="flex items-start gap-2" style={{ fontSize: 17, color: `hsl(${TEAL})` }}>
                <CheckCircle2 size={16} style={{ marginTop: 3, flexShrink: 0 }} />
                The only system managing the full knowledge lifecycle.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — TRACTION & GTM
// ═══════════════════════════════════════════════════════════════════════════════

function Slide10Traction() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Traction" color={SEAFOAM} />
        <h2 className="font-black mb-6" style={{ fontSize: 60, color: DARK_TEXT, lineHeight: 1.1 }}>
          Consulting as the wedge.<br />
          <span style={{ color: `hsl(${SEAFOAM})` }}>Platform as the moat.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1000 }}>
          We land with consulting — solving real lifecycle problems and capturing institutional knowledge firsthand.
          We expand with the platform — making the solution permanent, scalable, and self-improving.
        </p>

        <div className="flex-1 flex gap-10">
          <div className="flex-1 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-5">
              {[
                { stat: "15+", label: "Clients across industries", icon: <Users size={24} /> },
                { stat: "8", label: "Countries served", icon: <Globe size={24} /> },
                { stat: "15+", label: "Years of domain expertise", icon: <Briefcase size={24} /> },
              ].map(({ stat, label, icon }) => (
                <div key={stat} className="rounded-xl p-6 flex flex-col items-center text-center"
                  style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
                  <div className="mb-3" style={{ color: `hsl(${TEAL})` }}>{icon}</div>
                  <p className="font-black mb-1" style={{ fontSize: 40, color: DARK_TEXT }}>{stat}</p>
                  <p style={{ fontSize: 17, color: DARK_MUTED }}>{label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-6" style={{ background: DARK_CARD, border: `1px solid hsl(200 15% 16%)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 22, color: DARK_TEXT }}>Named Clients</p>
              <div className="flex gap-4">
                {["aliz.ai (AI Consulting)", "Alverad (Cybersecurity)"].map((c) => (
                  <div key={c} className="px-4 py-2 rounded-lg" style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
                    <span style={{ fontSize: 18, color: DARK_MUTED }}>{c}</span>
                  </div>
                ))}
                <div className="px-4 py-2 rounded-lg" style={{ background: `hsl(200 10% 12%)` }}>
                  <span style={{ fontSize: 18, color: DARK_SUBTLE }}>+ confidential enterprise clients</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[420px] flex flex-col gap-5">
            <p className="font-bold mb-1" style={{ fontSize: 22, color: DARK_TEXT }}>Vertical Expansion</p>
            {[
              { vertical: "Professional Services", stage: "Active", color: GREEN },
              { vertical: "Pharma — Medicine Lifecycle", stage: "Pilot", color: SEAFOAM },
              { vertical: "AEC — Architecture & Engineering", stage: "Design Partner", color: TEAL },
              { vertical: "Enterprise GTM", stage: "Pipeline", color: GOLD },
            ].map((v) => (
              <div key={v.vertical} className="flex items-center justify-between rounded-xl px-6 py-4"
                style={{ background: DARK_CARD, border: `1px solid hsl(200 15% 16%)` }}>
                <span style={{ fontSize: 20, color: DARK_TEXT }}>{v.vertical}</span>
                <span className="px-3 py-1 rounded-lg font-semibold" style={{ fontSize: 16, background: `hsl(${v.color} / 0.15)`, color: `hsl(${v.color})` }}>{v.stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={SEAFOAM} to={MINT} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — TEAM
// ═══════════════════════════════════════════════════════════════════════════════

function Slide11Team() {
  const team = [
    {
      name: "István Boscha", role: "Product & CEO",
      bio: "Product leader who has spent 15+ years at the intersection of consulting and technology. Built and scaled teams across enterprise software, AI, and digital transformation.",
      photo: istvanPhoto,
    },
    {
      name: "Kristóf Éger", role: "Enterprise Narrative & GTM",
      bio: "Enterprise strategist with deep experience in category creation, go-to-market, and positioning complex B2B platforms for executive audiences.",
      photo: kristofPhoto,
    },
    {
      name: "Zoltán Kauker", role: "Scalable AI Architecture",
      bio: "Engineering leader specializing in AI infrastructure, knowledge systems, and scalable architectures for enterprise-grade applications.",
      photo: zoltanPhoto,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="The Team" />
        <h2 className="font-black mb-4" style={{ fontSize: 60, color: TEXT, lineHeight: 1.1 }}>
          Practitioners who've lived the problem.
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: MUTED, maxWidth: 1000 }}>
          We've spent our careers helping organizations standardize expertise and scale quality.
          LIZA is the system we wished existed for the work we do every day.
        </p>

        <div className="flex-1 grid grid-cols-3 gap-8">
          {team.map((t) => (
            <div key={t.name} className="rounded-2xl border p-8 flex flex-col items-center text-center"
              style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: CARD_ALT }}>
              <img src={t.photo} alt={t.name}
                className="w-32 h-32 rounded-full object-cover mb-6"
                style={{ border: `3px solid hsl(${TEAL} / 0.3)` }} />
              <p className="font-bold mb-1" style={{ fontSize: 28, color: TEXT }}>{t.name}</p>
              <p className="font-semibold mb-5" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>{t.role}</p>
              <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.55 }}>{t.bio}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p style={{ fontSize: 20, color: SUBTLE }}>
            Core team supported by specialist consultants depending on engagement scope.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — BUSINESS MODEL
// ═══════════════════════════════════════════════════════════════════════════════

function Slide12BusinessModel() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="The Model" color={GOLD} />
        <h2 className="font-black mb-6" style={{ fontSize: 60, color: DARK_TEXT, lineHeight: 1.1 }}>
          Land with consulting.<br />
          <span style={{ color: `hsl(${GOLD})` }}>Expand with the platform.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1000 }}>
          Consulting captures real institutional knowledge and proves value.
          The platform makes it permanent, scalable, and self-improving.
        </p>

        <div className="flex-1 grid grid-cols-2 gap-10">
          <div className="rounded-2xl border p-8 flex flex-col"
            style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.06)` }}>
            <div className="flex items-center gap-3 mb-6">
              <Briefcase size={28} style={{ color: `hsl(${TEAL})` }} />
              <span className="font-bold" style={{ fontSize: 28, color: DARK_TEXT }}>Consulting Wedge</span>
            </div>
            <div className="flex flex-col gap-4">
              {[
                "4-week Assess, Align, Apply engagement",
                "Captures institutional knowledge firsthand",
                "Builds trust through measurable outcomes",
                "Natural expansion: more teams, more workflows",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} style={{ color: `hsl(${TEAL})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 21, color: DARK_MUTED }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <p className="font-bold" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>Revenue from day one.</p>
            </div>
          </div>

          <div className="rounded-2xl border p-8 flex flex-col"
            style={{ borderColor: `hsl(${GOLD} / 0.25)`, background: `hsl(${GOLD} / 0.06)` }}>
            <div className="flex items-center gap-3 mb-6">
              <Rocket size={28} style={{ color: `hsl(${GOLD})` }} />
              <span className="font-bold" style={{ fontSize: 28, color: DARK_TEXT }}>Platform Moat</span>
            </div>
            <div className="flex flex-col gap-4">
              {[
                "SaaS per-seat + usage-based pricing",
                "Knowledge compounds — switching cost grows over time",
                "Network effects within organizations",
                "Vertical expansion: same system, new industries",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} style={{ color: `hsl(${GOLD})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 21, color: DARK_MUTED }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <p className="font-bold" style={{ fontSize: 22, color: `hsl(${GOLD})` }}>Compounding retention.</p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={GOLD} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 13 — THE ASK
// ═══════════════════════════════════════════════════════════════════════════════

function Slide13TheAsk() {
  const allocation = [
    { label: "Product & Engineering", pct: "50%", color: TEAL },
    { label: "Design Partnerships", pct: "25%", color: SEAFOAM },
    { label: "GTM & Category Building", pct: "15%", color: MINT },
    { label: "Operations", pct: "10%", color: GOLD },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)` }} />
      <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(circle, hsl(${MINT}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <div className="flex items-center gap-3 mb-8 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.1)` }}>
          <DollarSign size={22} style={{ color: `hsl(${TEAL})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 24, color: `hsl(${TEAL})` }}>
            Seed Round
          </span>
        </div>

        <h2 className="font-black mb-6" style={{ fontSize: 88, color: DARK_TEXT }}>
          €300K
        </h2>
        <p className="mb-10" style={{ fontSize: 28, color: DARK_MUTED, maxWidth: 900, lineHeight: 1.5 }}>
          To complete the platform, onboard design partners,<br />and establish the category.
        </p>

        <div className="flex gap-6 mb-14">
          {allocation.map((a) => (
            <div key={a.label} className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl"
              style={{ background: `hsl(${a.color} / 0.08)`, border: `1px solid hsl(${a.color} / 0.2)`, minWidth: 200 }}>
              <span className="font-black" style={{ fontSize: 36, color: `hsl(${a.color})` }}>{a.pct}</span>
              <span style={{ fontSize: 18, color: DARK_MUTED }}>{a.label}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl px-12 py-6 mb-10"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
          <p style={{ fontSize: 26, color: DARK_TEXT, lineHeight: 1.5 }}>
            Lifecycle management created a $34B market for software.<br />
            <strong style={{ color: `hsl(${TEAL})` }}>We're building it for everything else.</strong>
          </p>
        </div>

        <p style={{ fontSize: 18, color: DARK_SUBTLE }}>
          lizaos.ai &nbsp;·&nbsp; kristof.eger@lizaos.ai &nbsp;·&nbsp; Confidential
        </p>
      </div>
      <SlideBar from={MINT} to={TEAL} />
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, title: "Cover", component: <Slide01Cover /> },
  { id: 2, title: "The Problem", component: <Slide02SoundFamiliar /> },
  { id: 3, title: "The Shift", component: <Slide03TheShift /> },
  { id: 4, title: "The Consequence", component: <Slide04UnmanagedLifecycles /> },
  { id: 5, title: "The Precedent", component: <Slide05ProvenModel /> },
  { id: 6, title: "Two Layers", component: <Slide06TwoLayers /> },
  { id: 7, title: "LIZA OS", component: <Slide07LizaOS /> },
  { id: 8, title: "In Practice", component: <Slide08InPractice /> },
  { id: 9, title: "The Market", component: <Slide09Competition /> },
  { id: 10, title: "Traction & GTM", component: <Slide10Traction /> },
  { id: 11, title: "Team", component: <Slide11Team /> },
  { id: 12, title: "Business Model", component: <Slide12BusinessModel /> },
  { id: 13, title: "The Ask", component: <Slide13TheAsk /> },
];

// ─── Main page ───────────────────────────────────────────────────────────────

export default function LifecycleInvestorDeck() {
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

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999]" style={{ background: BG }}
        onClick={() => { if (!isPortrait) showMobileControls(); }}>
        {isPortrait && (
          <div className="absolute inset-0 z-[10000] flex flex-col items-center justify-center gap-4 px-8"
            style={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(8px)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `hsl(${TEAL} / 0.1)`, border: `1px solid hsl(${TEAL} / 0.3)` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`hsl(${TEAL})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <path d="M12 18h.01" />
              </svg>
            </div>
            <p className="text-center font-semibold" style={{ fontSize: 18, color: TEXT }}>Rotate your device to landscape</p>
            <p className="text-center" style={{ fontSize: 14, color: MUTED }}>for the best viewing experience</p>
          </div>
        )}
        <ScaledSlide>{slide.component}</ScaledSlide>
        {!isPortrait && (
          <>
            <button onClick={(e) => { e.stopPropagation(); prev(); showMobileControls(); }} disabled={current === 0}
              className="absolute left-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-start pl-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(90deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Previous slide">
              <ChevronLeft size={32} style={{ color: `hsl(215 15% 42% / 0.5)` }} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); showMobileControls(); }} disabled={current === SLIDES.length - 1}
              className="absolute right-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-end pr-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(270deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Next slide">
              <ChevronRight size={32} style={{ color: `hsl(215 15% 42% / 0.5)` }} />
            </button>
          </>
        )}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full transition-opacity duration-300"
          style={{ background: "hsl(0 0% 100% / 0.9)", border: `1px solid ${CHROME_BORDER}`, backdropFilter: "blur(8px)",
            opacity: mobileControlsVisible ? 1 : 0, pointerEvents: mobileControlsVisible ? "auto" : "none" }}
          onClick={(e) => e.stopPropagation()}>
          <button onClick={prev} disabled={current === 0} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronLeft size={18} style={{ color: TEXT }} />
          </button>
          <span className="font-mono text-xs px-1" style={{ color: MUTED }}>{current + 1}/{SLIDES.length}</span>
          <button onClick={next} disabled={current === SLIDES.length - 1} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronRight size={18} style={{ color: TEXT }} />
          </button>
          <div className="w-px h-4" style={{ background: CHROME_BORDER }} />
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Investor-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
        </div>
        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
          {SLIDES.map(s => (
            <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
          ))}
        </div>
      </div>
    );
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-white z-[9999]" style={{ cursor: showNav ? "default" : "none" }}>
        <ScaledSlide>{slide.component}</ScaledSlide>
        {showNav && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full shadow-lg"
            style={{ background: "hsl(0 0% 100% / 0.95)", border: `1px solid ${CHROME_BORDER}` }}>
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30">
              <ChevronLeft size={20} style={{ color: TEXT }} />
            </button>
            <span className="text-sm font-mono px-2" style={{ color: MUTED }}>{current + 1} / {SLIDES.length}</span>
            <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30">
              <ChevronRight size={20} style={{ color: TEXT }} />
            </button>
            <button onClick={() => { document.exitFullscreen?.(); setIsFullscreen(false); }} className="p-2 rounded-lg hover:bg-black/5 ml-2">
              <X size={20} style={{ color: MUTED }} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: CARD_ALT }}>
      <div className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${TEAL})` }} />
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS — Investor Deck</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${TEAL} / 0.1)`, color: `hsl(${TEAL})` }}>
            {SLIDES.length} slides
          </span>
          <span className="text-xs px-2 py-0.5 rounded ml-1"
            style={{ background: "hsl(0 72% 50% / 0.08)", color: "hsl(0 72% 50%)" }}>
            Confidential
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Investor-Deck" slideCount={SLIDES.length} variant="desktop" />
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
              <p className="text-[10px] px-1.5 py-1" style={{ color: SUBTLE }}>
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

          {!showGrid && (
            <div className="flex items-center justify-between px-8 py-3 border-t shrink-0"
              style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
              <button onClick={prev} disabled={current === 0}
                className="flex items-center gap-1 text-sm disabled:opacity-30 hover:opacity-70 transition-opacity"
                style={{ color: MUTED }}>
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="text-sm font-mono" style={{ color: SUBTLE }}>
                {current + 1} / {SLIDES.length}
              </span>
              <button onClick={next} disabled={current === SLIDES.length - 1}
                className="flex items-center gap-1 text-sm disabled:opacity-30 hover:opacity-70 transition-opacity"
                style={{ color: MUTED }}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
        ))}
      </div>
    </div>
  );
}
