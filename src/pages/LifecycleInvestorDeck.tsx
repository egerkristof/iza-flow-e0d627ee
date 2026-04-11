import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  TrendingUp, Users, Zap, Target, BarChart3,
  Shield, ArrowRight, Layers, Briefcase,
  RefreshCw, GitBranch, BookOpen, AlertTriangle,
  Link2, Database, Workflow, Brain, Network, FileText,
  Repeat, Settings, Eye, CheckCircle2
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

const TEAL = "174 97% 28%";       // #028090
const SEAFOAM = "170 100% 33%";   // #00A896
const MINT = "160 96% 39%";       // #02C39A
const WARM = "15 85% 55%";        // warm accent for contrast
const DARK_BG = "hsl(200 30% 6%)";
const DARK_TEXT = "hsl(0 0% 95%)";
const DARK_MUTED = "hsl(200 15% 60%)";
const DARK_SUBTLE = "hsl(200 10% 45%)";
const DARK_CARD = "hsl(200 25% 10%)";

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

// ─── Slide 01 — Cover ────────────────────────────────────────────────────────

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
            LIZA OS · Lifecycle Intelligence
          </span>
        </div>

        <p className="font-semibold mb-5" style={{ fontSize: 32, color: DARK_MUTED, maxWidth: 1100 }}>
          Everyone's adopting AI. But more output doesn't mean better outcomes.
        </p>

        <h1 className="font-black mb-8" style={{ fontSize: 88, lineHeight: 1.0, color: DARK_TEXT }}>
          AI is beginning to<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            scale judgment.
          </span>
        </h1>

        <p style={{ fontSize: 34, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.55 }}>
          The infrastructure to govern it is just forming.<br />
          <strong style={{ color: DARK_TEXT }}>We're building the complete version.</strong>
        </p>

        <div className="mt-16 flex items-center gap-16">
          {[
            ["The Problem", "AI produces faster than organizations can govern"],
            ["The Shift", "A new category is forming to solve this — with $98M+ invested"],
            ["Our Edge", "We govern the full lifecycle, not just memory or context"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col items-center gap-2 max-w-[360px]">
              <span className="font-black" style={{ fontSize: 26, color: `hsl(${TEAL})` }}>{k}</span>
              <span className="text-center" style={{ fontSize: 21, color: DARK_SUBTLE }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 02 — The Problem (Plain Language) ────────────────────────────────

function Slide02LifecycleProblem() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="The Problem" color={WARM} />
        <h2 className="font-bold mb-6" style={{ fontSize: 68, color: TEXT, lineHeight: 1.1 }}>
          Work doesn't happen in isolation.<br />
          <span style={{ color: `hsl(${WARM})` }}>But every tool treats it like it does.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 26, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          In any business, work flows through stages. A sales team scopes a deal, marketing creates materials for it,
          delivery executes on it. These stages are connected — but the tools people use aren't.
        </p>

        <div className="flex-1 flex gap-8">
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-10">
              {["Scope", "Plan", "Execute", "Deliver", "Review"].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="px-6 py-4 rounded-xl font-bold"
                    style={{ fontSize: 24, background: `hsl(${TEAL} / ${0.08 + i * 0.04})`, color: `hsl(${TEAL})`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
                    {step}
                  </div>
                  {i < 4 && <ArrowRight size={24} style={{ color: `hsl(${TEAL} / 0.4)` }} />}
                </div>
              ))}
            </div>

            <div className="rounded-2xl border p-8" style={{ background: `hsl(${WARM} / 0.04)`, borderColor: `hsl(${WARM} / 0.2)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 28, color: TEXT }}>When something changes in step 3, steps 4 and 5 don't know about it.</p>
              <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.55 }}>
                A client changes their requirements. The project plan doesn't update. The proposal stays the same.
                The invoice references the wrong scope. Nobody notices until it's too late.
              </p>
            </div>
          </div>

          <div className="w-[380px] flex flex-col gap-6">
            {[
              { stat: "73%", label: "of process failures trace back to changes that didn't reach the right people", color: WARM },
              { stat: "5.2x", label: "more rework when teams don't have a way to keep things in sync", color: WARM },
              { stat: "$0", label: "spent today on tools that connect these stages together", color: TEAL },
            ].map(({ stat, label, color }) => (
              <div key={stat} className="rounded-xl border p-6"
                style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
                <p className="font-black mb-1" style={{ fontSize: 40, color: `hsl(${color})` }}>{stat}</p>
                <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ─── Slide 03 — Two Things That Drift Apart ─────────────────────────────────

function Slide03TwoLayers() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="The Insight" color={SEAFOAM} />
        <h2 className="font-black mb-6" style={{ fontSize: 68, color: DARK_TEXT, lineHeight: 1.05 }}>
          Every organization has two types<br />
          of knowledge. <span style={{ color: `hsl(${SEAFOAM})` }}>They always drift apart.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 26, color: DARK_MUTED, maxWidth: 1050, lineHeight: 1.5 }}>
          Think of it this way: there's <strong style={{ color: DARK_TEXT }}>how your best people do things</strong> (their expertise, their playbooks) — and then there's <strong style={{ color: DARK_TEXT }}>what actually gets produced</strong> (the documents, decisions, deliverables). These two should match. They almost never do.
        </p>

        <div className="flex-1 grid grid-cols-2 gap-10">
          {/* Layer 1 */}
          <div className="rounded-2xl border p-10 flex flex-col"
            style={{ borderColor: `hsl(${TEAL} / 0.3)`, background: `hsl(${TEAL} / 0.06)` }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `hsl(${TEAL} / 0.2)` }}>
                <BookOpen size={28} style={{ color: `hsl(${TEAL})` }} />
              </div>
              <div>
                <p className="font-black" style={{ fontSize: 32, color: DARK_TEXT }}>What People Know</p>
                <p style={{ fontSize: 20, color: `hsl(${TEAL})` }}>The expertise, standards, and best practices</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {[
                "How your top salesperson qualifies a deal",
                "The delivery methodology your best PM follows",
                "Quality standards your team has learned from experience",
                "Rules and guidelines that prevent costly mistakes",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="mt-1 shrink-0" style={{ color: `hsl(${TEAL})` }} />
                  <p style={{ fontSize: 22, color: DARK_MUTED, lineHeight: 1.4 }}>{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 px-5 py-3 rounded-lg" style={{ background: `hsl(${TEAL} / 0.12)` }}>
              <p className="font-bold" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>
                Today this lives in people's heads, scattered docs, and tribal knowledge
              </p>
            </div>
          </div>

          {/* Layer 2 */}
          <div className="rounded-2xl border p-10 flex flex-col"
            style={{ borderColor: `hsl(${MINT} / 0.3)`, background: `hsl(${MINT} / 0.06)` }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `hsl(${MINT} / 0.2)` }}>
                <GitBranch size={28} style={{ color: `hsl(${MINT})` }} />
              </div>
              <div>
                <p className="font-black" style={{ fontSize: 32, color: DARK_TEXT }}>What Gets Produced</p>
                <p style={{ fontSize: 20, color: `hsl(${MINT})` }}>The documents, decisions, and deliverables</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              {[
                "The proposal your team sent to the client last week",
                "The project plan that drives a six-month engagement",
                "The campaign materials based on the latest positioning",
                "The compliance docs that reference current regulations",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="mt-1 shrink-0" style={{ color: `hsl(${MINT})` }} />
                  <p style={{ fontSize: 22, color: DARK_MUTED, lineHeight: 1.4 }}>{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 px-5 py-3 rounded-lg" style={{ background: `hsl(${MINT} / 0.12)` }}>
              <p className="font-bold" style={{ fontSize: 18, color: `hsl(${MINT})` }}>
                Today these are created once, then silently go stale
              </p>
            </div>
          </div>
        </div>

        {/* Connection */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="h-px flex-1" style={{ background: `hsl(${TEAL} / 0.3)` }} />
          <div className="flex items-center gap-3 px-6 py-3 rounded-full"
            style={{ background: `hsl(${SEAFOAM} / 0.1)`, border: `1px solid hsl(${SEAFOAM} / 0.3)` }}>
            <Link2 size={20} style={{ color: `hsl(${SEAFOAM})` }} />
            <span className="font-bold" style={{ fontSize: 20, color: `hsl(${SEAFOAM})` }}>
              LIZA keeps both in sync — automatically
            </span>
          </div>
          <div className="h-px flex-1" style={{ background: `hsl(${MINT} / 0.3)` }} />
        </div>
      </div>
      <SlideBar from={TEAL} to={MINT} />
    </div>
  );
}

// ─── Slide 04 — What Actually Happens ────────────────────────────────────────

function Slide04WhatBreaks() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Real Examples" color={WARM} />
        <h2 className="font-bold mb-12" style={{ fontSize: 68, color: TEXT, lineHeight: 1.1 }}>
          One thing changes. <span style={{ color: `hsl(${WARM})` }}>Ten things break.</span>
        </h2>

        <div className="flex-1 grid grid-cols-3 gap-8">
          {[
            {
              title: "Consulting",
              scenario: "A client changes scope halfway through",
              breaks: ["The project plan still references the old scope", "Team allocation doesn't match the new reality", "The invoice doesn't match what was actually delivered"],
              icon: <Briefcase size={40} />,
              cost: "Weeks of rework and uncomfortable client conversations",
            },
            {
              title: "Sales",
              scenario: "Market conditions change the forecast",
              breaks: ["Territory plans still target the old numbers", "Commission models are based on outdated goals", "Marketing is running campaigns for the wrong audience"],
              icon: <TrendingUp size={40} />,
              cost: "Misaligned teams chasing the wrong targets",
            },
            {
              title: "Marketing",
              scenario: "Research reveals a better positioning",
              breaks: ["The sales deck still uses the old messaging", "Website copy says something completely different", "Outreach scripts reference things you no longer believe"],
              icon: <Eye size={40} />,
              cost: "Your customer hears three different stories",
            },
          ].map(({ title, scenario, breaks, icon, cost }) => (
            <div key={title} className="rounded-2xl border p-8 flex flex-col"
              style={{ borderColor: `hsl(${WARM} / 0.15)`, background: `hsl(${WARM} / 0.03)` }}>
              <div className="mb-4" style={{ color: `hsl(${TEAL})` }}>{icon}</div>
              <p className="font-bold mb-2" style={{ fontSize: 28, color: TEXT }}>{title}</p>
              <p className="mb-5" style={{ fontSize: 20, color: `hsl(${WARM})`, fontStyle: "italic" }}>"{scenario}"</p>
              <div className="flex flex-col gap-3 flex-1">
                {breaks.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <AlertTriangle size={18} className="mt-1 shrink-0" style={{ color: `hsl(${WARM})` }} />
                    <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.4 }}>{b}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4" style={{ borderTop: `1px solid hsl(${WARM} / 0.15)` }}>
                <p className="font-bold" style={{ fontSize: 18, color: `hsl(${WARM})` }}>
                  {cost}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ─── Slide 05 — Why AI Makes It Worse ────────────────────────────────────────

function Slide05Propagation() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Why This Matters Now" color={WARM} />
        <h2 className="font-black mb-8" style={{ fontSize: 68, color: DARK_TEXT, lineHeight: 1.05 }}>
          AI is making this problem<br />
          <span style={{ color: `hsl(${WARM})` }}>dramatically worse.</span>
        </h2>

        <div className="flex-1 flex gap-10">
          {/* Before AI */}
          <div className="flex-1 rounded-2xl border p-10 flex flex-col"
            style={{ borderColor: "hsl(0 0% 100% / 0.08)", background: DARK_CARD }}>
            <p className="font-bold mb-6" style={{ fontSize: 30, color: DARK_MUTED }}>Before AI</p>
            <div className="flex flex-col gap-5 flex-1">
              {[
                "People create documents at a human pace",
                "When something changes, someone sends an email or calls a meeting",
                "Mistakes get caught in review cycles",
                "Maybe 5-10 important documents per person per week",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2.5 shrink-0" style={{ background: DARK_MUTED }} />
                  <p style={{ fontSize: 22, color: DARK_MUTED, lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center py-4 rounded-xl" style={{ background: "hsl(0 0% 100% / 0.04)" }}>
              <p className="font-black" style={{ fontSize: 48, color: DARK_MUTED }}>Manageable</p>
            </div>
          </div>

          <div className="flex items-center">
            <ArrowRight size={48} style={{ color: `hsl(${WARM})` }} />
          </div>

          {/* With AI */}
          <div className="flex-1 rounded-2xl border p-10 flex flex-col"
            style={{ borderColor: `hsl(${WARM} / 0.3)`, background: `hsl(${WARM} / 0.06)` }}>
            <p className="font-bold mb-6" style={{ fontSize: 30, color: `hsl(${WARM})` }}>With AI</p>
            <div className="flex flex-col gap-5 flex-1">
              {[
                "AI generates documents, plans, and analyses at 100x the speed",
                "But none of these outputs are connected to each other",
                "When the underlying facts change, nothing updates automatically",
                "One person can now trigger hundreds of outputs per week",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <AlertTriangle size={18} className="mt-1.5 shrink-0" style={{ color: `hsl(${WARM})` }} />
                  <p style={{ fontSize: 22, color: DARK_TEXT, lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center py-4 rounded-xl" style={{ background: `hsl(${WARM} / 0.15)` }}>
              <p className="font-black" style={{ fontSize: 48, color: `hsl(${WARM})` }}>Unsustainable</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-xl px-8 py-5 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
          <p className="font-bold" style={{ fontSize: 26, color: `hsl(${TEAL})` }}>
            The faster AI produces, the more you need a system to keep everything aligned. That system doesn't exist yet.
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ─── Slide 06 — How LIZA Works ───────────────────────────────────────────────

function Slide06Solution() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="How LIZA Works" color={TEAL} />
        <h2 className="font-bold mb-12" style={{ fontSize: 68, color: TEXT, lineHeight: 1.1 }}>
          Four steps. <span style={{ color: `hsl(${TEAL})` }}>One continuous loop.</span>
        </h2>

        <div className="flex-1 grid grid-cols-4 gap-6">
          {[
            {
              icon: <Brain size={36} />, step: "01", label: "Capture",
              desc: "Your best people's expertise gets turned into clear, structured playbooks — not just documents, but actual rules the system can use.",
              color: TEAL,
            },
            {
              icon: <Layers size={36} />, step: "02", label: "Organize",
              desc: "Playbooks are grouped by business function and linked together — so the system knows what depends on what across your lifecycle.",
              color: SEAFOAM,
            },
            {
              icon: <Workflow size={36} />, step: "03", label: "Execute",
              desc: "When people work, AI follows your playbooks — not generic training. Quality gates ensure standards are met at every step.",
              color: MINT,
            },
            {
              icon: <RefreshCw size={36} />, step: "04", label: "Update",
              desc: "When something changes — a new insight, a market shift, a client request — every connected document and decision gets flagged for review.",
              color: TEAL,
            },
          ].map(({ icon, step, label, desc, color }) => (
            <div key={step} className="rounded-2xl border p-8 flex flex-col"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `hsl(${color} / 0.12)` }}>
                <div style={{ color: `hsl(${color})` }}>{icon}</div>
              </div>
              <p className="font-mono mb-1" style={{ fontSize: 18, color: `hsl(${color} / 0.6)` }}>{step}</p>
              <p className="font-black mb-3" style={{ fontSize: 32, color: TEXT }}>{label}</p>
              <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-6">
          <Repeat size={24} style={{ color: `hsl(${TEAL})` }} />
          <p className="font-bold" style={{ fontSize: 24, color: `hsl(${TEAL})` }}>
            The more people use it, the smarter the system gets. Knowledge compounds over time.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 07 — What's Under the Hood ────────────────────────────────────────

function Slide07KnowledgeGraph() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Under the Hood" color={SEAFOAM} />
        <h2 className="font-black mb-8" style={{ fontSize: 68, color: DARK_TEXT, lineHeight: 1.05 }}>
          A connected system<br />
          <span style={{ color: `hsl(${SEAFOAM})` }}>that knows what depends on what.</span>
        </h2>

        <div className="flex-1 flex gap-10">
          <div className="flex-1 flex flex-col gap-6">
            {[
              { label: "Knowledge Bundles", desc: "Your team's expertise organized by business function — sales, delivery, marketing, compliance", icon: <Database size={28} />, color: TEAL },
              { label: "Step-by-Step Guides", desc: "Clear procedures with built-in checkpoints, so people follow best practices consistently", icon: <Settings size={28} />, color: SEAFOAM },
              { label: "Workspaces", desc: "Where work actually happens — every document, decision, and task tracked in one place", icon: <FileText size={28} />, color: MINT },
              { label: "The Connection Map", desc: "The system tracks how everything relates, so a change in one place surfaces everywhere it matters", icon: <Network size={28} />, color: TEAL },
            ].map(({ label, desc, icon, color }) => (
              <div key={label} className="flex items-center gap-6 rounded-xl border p-6"
                style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.06)` }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `hsl(${color} / 0.15)` }}>
                  <div style={{ color: `hsl(${color})` }}>{icon}</div>
                </div>
                <div>
                  <p className="font-bold" style={{ fontSize: 26, color: DARK_TEXT }}>{label}</p>
                  <p style={{ fontSize: 20, color: DARK_MUTED }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="w-[500px] rounded-2xl border p-10 flex flex-col justify-center"
            style={{ borderColor: `hsl(${SEAFOAM} / 0.25)`, background: `hsl(${SEAFOAM} / 0.06)` }}>
            <p className="font-black mb-6" style={{ fontSize: 36, color: DARK_TEXT }}>
              Two sides of the same coin.
            </p>
            <div className="flex flex-col gap-6">
              <div className="rounded-xl p-5" style={{ background: `hsl(${TEAL} / 0.12)` }}>
                <p className="font-bold mb-2" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>What Your People Know</p>
                <p style={{ fontSize: 18, color: DARK_MUTED }}>
                  Best practices, playbooks, standards, and lessons learned — continuously updated as the team gets smarter.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-px h-8" style={{ background: `hsl(${SEAFOAM} / 0.4)` }} />
                  <Link2 size={24} style={{ color: `hsl(${SEAFOAM})` }} />
                  <div className="w-px h-8" style={{ background: `hsl(${SEAFOAM} / 0.4)` }} />
                </div>
              </div>
              <div className="rounded-xl p-5" style={{ background: `hsl(${MINT} / 0.12)` }}>
                <p className="font-bold mb-2" style={{ fontSize: 22, color: `hsl(${MINT})` }}>What Gets Delivered</p>
                <p style={{ fontSize: 18, color: DARK_MUTED }}>
                  Proposals, plans, reports, and decisions — all connected. When knowledge updates, deliverables update too.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={SEAFOAM} to={TEAL} />
    </div>
  );
}

// ─── Slide 08 — Works Across Every Business Function ─────────────────────────

function Slide08Lifecycles() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Where It Applies" color={TEAL} />
        <h2 className="font-bold mb-10" style={{ fontSize: 64, color: TEXT, lineHeight: 1.1 }}>
          Same engine. <span style={{ color: `hsl(${TEAL})` }}>Any business function.</span>
        </h2>

        <div className="flex-1 grid grid-cols-2 gap-6">
          {[
            { title: "Sales", stages: "Qualify → Discover → Propose → Negotiate → Close", know: "How your best reps qualify deals and handle objections", produce: "Proposals, contracts, and forecasts that stay in sync when strategy changes" },
            { title: "Marketing", stages: "Research → Position → Create → Distribute → Measure", know: "Your messaging framework and brand guidelines", produce: "Campaigns, content, and enablement materials that update when positioning shifts" },
            { title: "Professional Services", stages: "Scope → Staff → Deliver → Review → Renew", know: "Delivery methodologies and quality standards from years of experience", produce: "SOWs, project plans, and status reports that reflect the current reality" },
            { title: "Regulated Industries", stages: "Research → Develop → Validate → Submit → Monitor", know: "Compliance procedures and audit standards that must be followed exactly", produce: "Validation documents and regulatory filings that stay current and traceable" },
          ].map(({ title, stages, know, produce }) => (
            <div key={title} className="rounded-xl border p-7 flex flex-col"
              style={{ borderColor: `hsl(${TEAL} / 0.15)` }}>
              <p className="font-bold mb-2" style={{ fontSize: 26, color: TEXT }}>{title}</p>
              <p className="font-mono mb-4" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>{stages}</p>
              <div className="flex gap-4 flex-1">
                <div className="flex-1 rounded-lg p-4" style={{ background: `hsl(${TEAL} / 0.05)` }}>
                  <p className="font-bold mb-1" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>WHAT PEOPLE KNOW</p>
                  <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.4 }}>{know}</p>
                </div>
                <div className="flex-1 rounded-lg p-4" style={{ background: `hsl(${MINT} / 0.05)` }}>
                  <p className="font-bold mb-1" style={{ fontSize: 14, color: `hsl(${MINT})` }}>WHAT GETS PRODUCED</p>
                  <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.4 }}>{produce}</p>
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

// ─── Slide 09 — Market Evolution ─────────────────────────────────────────────

function Slide09MarketEvolution() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="Market Context" color={SEAFOAM} />
        <h2 className="font-black mb-4" style={{ fontSize: 64, color: DARK_TEXT, lineHeight: 1.05 }}>
          What people buy today.<br />
          <span style={{ color: `hsl(${SEAFOAM})` }}>What's forming next.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: DARK_MUTED, maxWidth: 1000 }}>
          The market is evolving from stateless AI tools to intelligent systems that learn. LIZA is part of this next wave — with a specific edge.
        </p>

        <div className="flex-1 grid grid-cols-2 gap-8">
          {/* Wave 1 */}
          <div className="rounded-2xl border p-9 flex flex-col"
            style={{ borderColor: "hsl(0 0% 100% / 0.08)", background: DARK_CARD }}>
            <p className="font-bold mb-1" style={{ fontSize: 18, color: DARK_SUBTLE }}>WHAT PEOPLE BUY TODAY</p>
            <p className="font-black mb-5" style={{ fontSize: 36, color: DARK_MUTED }}>Wave 1: AI as Assistant</p>
            <div className="flex flex-col gap-4 flex-1">
              {[
                { tool: "ChatGPT / Gemini / Claude", what: "Answer questions, generate content on demand" },
                { tool: "Copilot / Cursor", what: "Autocomplete tasks in existing workflows" },
                { tool: "Agentic tools", what: "Execute multi-step tasks with some memory" },
              ].map(({ tool, what }) => (
                <div key={tool} className="flex items-start gap-3 rounded-lg p-4" style={{ background: "hsl(0 0% 100% / 0.03)" }}>
                  <div className="w-2 h-2 rounded-full mt-2.5 shrink-0" style={{ background: DARK_MUTED }} />
                  <div>
                    <p className="font-bold" style={{ fontSize: 22, color: DARK_TEXT }}>{tool}</p>
                    <p style={{ fontSize: 18, color: DARK_MUTED }}>{what}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl px-5 py-4" style={{ background: "hsl(0 0% 100% / 0.04)" }}>
              <p className="font-bold" style={{ fontSize: 18, color: DARK_SUBTLE }}>
                ⚡ Stateless. No standards. No organizational learning. Every session starts from zero.
              </p>
            </div>
          </div>

          {/* Wave 2 */}
          <div className="rounded-2xl border p-9 flex flex-col"
            style={{ borderColor: `hsl(${TEAL} / 0.3)`, background: `hsl(${TEAL} / 0.06)` }}>
            <p className="font-bold mb-1" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>WHAT'S FORMING NOW — $98M+ INVESTED</p>
            <p className="font-black mb-5" style={{ fontSize: 36, color: DARK_TEXT }}>Wave 2: AI with Intelligence</p>
            <div className="flex flex-col gap-4 flex-1">
              {[
                { tool: "Edra ($30M)", what: "Workflow memory & operational knowledge", focus: "Knowledge capture" },
                { tool: "Mem0.ai ($44.5M)", what: "Persistent AI memory infrastructure", focus: "Context injection" },
                { tool: "Interloom ($19.5M)", what: "Institutional knowledge for teams", focus: "Team knowledge" },
              ].map(({ tool, what, focus }) => (
                <div key={tool} className="flex items-start gap-3 rounded-lg p-4" style={{ background: `hsl(${TEAL} / 0.08)` }}>
                  <CheckCircle2 size={20} className="mt-1 shrink-0" style={{ color: `hsl(${TEAL})` }} />
                  <div>
                    <p className="font-bold" style={{ fontSize: 22, color: DARK_TEXT }}>{tool}</p>
                    <p style={{ fontSize: 18, color: DARK_MUTED }}>{what}</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block"
                      style={{ background: `hsl(${SEAFOAM} / 0.15)`, color: `hsl(${SEAFOAM})` }}>{focus}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl px-5 py-4" style={{ background: `hsl(${TEAL} / 0.12)` }}>
              <p className="font-bold" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>
                Each player has picked a slice. None governs the full lifecycle.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={SEAFOAM} to={TEAL} />
    </div>
  );
}

// ─── Slide 10 — LIZA's Edge in Wave 2 ───────────────────────────────────────

function Slide10LizaEdge() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Our Edge" color={TEAL} />
        <h2 className="font-bold mb-4" style={{ fontSize: 64, color: TEXT, lineHeight: 1.1 }}>
          Same thesis. <span style={{ color: `hsl(${TEAL})` }}>Two capabilities no one else has.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 24, color: MUTED, maxWidth: 1000 }}>
          We share the Wave 2 thesis: AI needs business intelligence to be useful. But we solve two problems the category hasn't touched yet.
        </p>

        <div className="flex-1 grid grid-cols-2 gap-10">
          {/* Differentiator 1 */}
          <div className="rounded-2xl border p-10 flex flex-col"
            style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.04)` }}>
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
              style={{ background: `hsl(${TEAL} / 0.12)` }}>
              <Brain size={32} style={{ color: `hsl(${TEAL})` }} />
            </div>
            <p className="font-black mb-3" style={{ fontSize: 34, color: TEXT }}>Continuous Learning</p>
            <p className="font-bold mb-4" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>
              How do you scale what's valuable about humans in the age of AI?
            </p>
            <div className="flex flex-col gap-3 flex-1">
              {[
                "Every execution cycle teaches the system something new",
                "Human judgment is captured and fed back into organizational standards",
                "Knowledge isn't static injection — it's a living, evolving flow",
                "Your best people's expertise becomes everyone's capability",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-1 shrink-0" style={{ color: `hsl(${TEAL})` }} />
                  <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.4 }}>{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 px-5 py-3 rounded-lg" style={{ background: `hsl(${TEAL} / 0.08)` }}>
              <p className="font-bold" style={{ fontSize: 17, color: `hsl(${TEAL})` }}>Others inject knowledge. We grow it.</p>
            </div>
          </div>

          {/* Differentiator 2 */}
          <div className="rounded-2xl border p-10 flex flex-col"
            style={{ borderColor: `hsl(${MINT} / 0.2)`, background: `hsl(${MINT} / 0.04)` }}>
            <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
              style={{ background: `hsl(${MINT} / 0.12)` }}>
              <RefreshCw size={32} style={{ color: `hsl(${MINT})` }} />
            </div>
            <p className="font-black mb-3" style={{ fontSize: 34, color: TEXT }}>Artifact Propagation</p>
            <p className="font-bold mb-4" style={{ fontSize: 22, color: `hsl(${MINT})` }}>
              When knowledge changes, everything downstream needs to know.
            </p>
            <div className="flex flex-col gap-3 flex-1">
              {[
                "A signal from the edge changes one node in your knowledge graph",
                "That change may affect dozens of connected artifacts across the lifecycle",
                "LIZA maps these dependencies and surfaces what needs updating",
                "No more silent drift between what you know and what you've built",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-1 shrink-0" style={{ color: `hsl(${MINT})` }} />
                  <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.4 }}>{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 px-5 py-3 rounded-lg" style={{ background: `hsl(${MINT} / 0.08)` }}>
              <p className="font-bold" style={{ fontSize: 17, color: `hsl(${MINT})` }}>Others store knowledge. We propagate change.</p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 10 — Traction ─────────────────────────────────────────────────────

function Slide10Traction() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="Traction" color={TEAL} />
        <h2 className="font-bold mb-12" style={{ fontSize: 68, color: TEXT, lineHeight: 1.1 }}>
          Built in production. <span style={{ color: `hsl(${TEAL})` }}>Validated in market.</span>
        </h2>

        <div className="grid grid-cols-4 gap-8 mb-12">
          {[
            { stat: "15+", label: "Enterprise clients across 8 countries" },
            { stat: "15+", label: "Years of consultancy expertise encoded" },
            { stat: "7", label: "Lifecycle modules deployed" },
            { stat: "€300K", label: "Seed raise target" },
          ].map(({ stat, label }) => (
            <div key={stat} className="text-center py-8 rounded-2xl border"
              style={{ borderColor: `hsl(${TEAL} / 0.15)`, background: `hsl(${TEAL} / 0.04)` }}>
              <p className="font-black mb-2" style={{ fontSize: 56, color: `hsl(${TEAL})` }}>{stat}</p>
              <p style={{ fontSize: 20, color: MUTED }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-2 gap-8">
          <div className="rounded-2xl border p-8"
            style={{ borderColor: `hsl(${TEAL} / 0.15)` }}>
            <p className="font-bold mb-4" style={{ fontSize: 26, color: TEXT }}>Deployed Lifecycle Modules</p>
            <div className="grid grid-cols-2 gap-3">
              {["Sales Playbooks", "Marketing Campaigns", "Account Management", "Professional Services", "Onboarding Accelerator", "Meeting Intelligence", "Smart Brief"].map((m) => (
                <div key={m} className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
                  style={{ background: `hsl(${TEAL} / 0.06)` }}>
                  <CheckCircle2 size={16} style={{ color: `hsl(${TEAL})` }} />
                  <span style={{ fontSize: 18, color: TEXT }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border p-8"
            style={{ borderColor: `hsl(${MINT} / 0.15)` }}>
            <p className="font-bold mb-4" style={{ fontSize: 26, color: TEXT }}>GTM Strategy</p>
            <div className="flex flex-col gap-4">
              {[
                { path: "Self-serve modules", desc: "Teams adopt specific lifecycle playbooks. Land with one, expand to many.", color: TEAL },
                { path: "Enterprise lifecycle", desc: "Full organizational transformation with consulting onboarding. High ACV.", color: MINT },
              ].map(({ path, desc, color }) => (
                <div key={path} className="rounded-xl p-5" style={{ background: `hsl(${color} / 0.06)` }}>
                  <p className="font-bold mb-1" style={{ fontSize: 22, color: TEXT }}>{path}</p>
                  <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.4 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 11 — Team ─────────────────────────────────────────────────────────

function Slide11Team() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="The Team" color={SEAFOAM} />
        <h2 className="font-black mb-14" style={{ fontSize: 68, color: DARK_TEXT, lineHeight: 1.05 }}>
          Built by practitioners,<br />
          <span style={{ color: `hsl(${SEAFOAM})` }}>not theorists.</span>
        </h2>

        <div className="flex-1 grid grid-cols-3 gap-10">
          {[
            {
              name: "István Boscha", role: "Product & CEO",
              bio: "15+ years building enterprise systems. Led digital transformations for global organizations. Designed the AACE framework from real operational pain.",
              photo: istvanPhoto,
            },
            {
              name: "Kristóf Éger", role: "Enterprise Narrative & GTM",
              bio: "Enterprise strategist who has closed and delivered complex consulting engagements. Bridges the gap between product capability and executive buyer language.",
              photo: kristofPhoto,
            },
            {
              name: "Zoltán Kauker", role: "Scalable AI Architecture",
              bio: "Systems architect specializing in AI-native infrastructure. Designed knowledge graph architectures that handle organizational-scale complexity.",
              photo: zoltanPhoto,
            },
          ].map(({ name, role, bio, photo }) => (
            <div key={name} className="rounded-2xl border p-8 flex flex-col items-center text-center"
              style={{ borderColor: "hsl(0 0% 100% / 0.08)", background: DARK_CARD }}>
              <div className="w-28 h-28 rounded-2xl overflow-hidden mb-6 border-2"
                style={{ borderColor: `hsl(${SEAFOAM} / 0.3)` }}>
                <img src={photo} alt={name} className="w-full h-full object-cover" />
              </div>
              <p className="font-bold" style={{ fontSize: 28, color: DARK_TEXT }}>{name}</p>
              <p className="mb-4" style={{ fontSize: 20, color: `hsl(${SEAFOAM})` }}>{role}</p>
              <p style={{ fontSize: 19, color: DARK_MUTED, lineHeight: 1.5 }}>{bio}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center" style={{ fontSize: 22, color: DARK_SUBTLE }}>
          Core team supported by specialist consultants depending on engagement scope
        </p>
      </div>
      <SlideBar from={SEAFOAM} to={MINT} />
    </div>
  );
}

// ─── Slide 12 — Closing / CTA ────────────────────────────────────────────────

function Slide12Closing() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)` }} />
      <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(circle, hsl(${MINT}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <div className="flex items-center gap-3 mb-10 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.1)` }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: `hsl(${TEAL})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 24, color: `hsl(${TEAL})` }}>
            LIZA OS
          </span>
        </div>

        <h2 className="font-black mb-8" style={{ fontSize: 80, color: DARK_TEXT, lineHeight: 1.05 }}>
          The management layer for<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            lifecycle intelligence.
          </span>
        </h2>

        <p style={{ fontSize: 32, color: DARK_MUTED, maxWidth: 1100, lineHeight: 1.6, marginBottom: 56 }}>
          Govern how your people work. Govern what they produce.<br />
          Keep both in sync as your organization scales.
        </p>

        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-3 px-14 py-8 rounded-2xl"
            style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))` }}>
            <Briefcase size={36} style={{ color: "white" }} />
            <span className="font-bold" style={{ fontSize: 28, color: "white" }}>Schedule a Founder Call</span>
          </div>
          <div className="flex flex-col items-center gap-3 px-14 py-8 rounded-2xl border"
            style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.08)` }}>
            <Shield size={36} style={{ color: `hsl(${TEAL})` }} />
            <span className="font-bold" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>Request Data Room</span>
          </div>
        </div>

        <p className="mt-14" style={{ fontSize: 26, color: DARK_SUBTLE }}>
          lizaos.ai &nbsp;·&nbsp; kristof.eger@lizaos.ai &nbsp;·&nbsp; Confidential · Not for distribution
        </p>
      </div>
      <SlideBar from={MINT} to={TEAL} />
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, title: "Cover", component: <Slide01Cover /> },
  { id: 2, title: "The Lifecycle Problem", component: <Slide02LifecycleProblem /> },
  { id: 3, title: "Two Knowledge Layers", component: <Slide03TwoLayers /> },
  { id: 4, title: "What Breaks Today", component: <Slide04WhatBreaks /> },
  { id: 5, title: "The Propagation Crisis", component: <Slide05Propagation /> },
  { id: 6, title: "The Solution", component: <Slide06Solution /> },
  { id: 7, title: "The Knowledge Graph", component: <Slide07KnowledgeGraph /> },
  { id: 8, title: "Every Lifecycle", component: <Slide08Lifecycles /> },
  { id: 9, title: "Market Evolution", component: <Slide09MarketEvolution /> },
  { id: 10, title: "Our Edge in Wave 2", component: <Slide10LizaEdge /> },
  { id: 11, title: "Traction & GTM", component: <Slide10Traction /> },
  { id: 12, title: "Team", component: <Slide11Team /> },
  { id: 13, title: "Closing", component: <Slide12Closing /> },
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Lifecycle-Investor-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS — Lifecycle Investor Deck</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${TEAL} / 0.1)`, color: `hsl(${TEAL})` }}>
            Lifecycle Intelligence · {SLIDES.length} slides
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Lifecycle-Investor-Deck" slideCount={SLIDES.length} variant="desktop" />
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
              <div className="flex gap-2">
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === current ? 32 : 8,
                      background: i === current ? `hsl(${TEAL})` : CHROME_BORDER,
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

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
        ))}
      </div>
    </div>
  );
}
