import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  ArrowRight, BookOpen, Network, Zap, RefreshCw,
  AlertTriangle, CheckCircle2, DollarSign,
  Users, Globe, Briefcase, Building2, TrendingUp, Target, Shield,
  Layers, Eye, Workflow, Lightbulb, Award,
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

// ─── Palette ─────────────────────────────────────────────────────────────────

const BG = "hsl(0 0% 100%)";
const TEXT = "hsl(222 20% 10%)";
const MUTED = "hsl(215 15% 42%)";
const SUBTLE = "hsl(215 10% 56%)";
const CARD_ALT = "hsl(220 15% 97%)";
const GRID_LINE = "hsl(215 15% 75%)";
const CHROME_BG = "hsl(220 15% 97%)";
const CHROME_BORDER = "hsl(220 12% 90%)";

const TEAL = "174 97% 28%";
const MINT = "160 96% 39%";
const WARM = "15 85% 55%";
const DARK_BG = "hsl(200 30% 6%)";
const DARK_TEXT = "hsl(0 0% 95%)";
const DARK_MUTED = "hsl(200 15% 60%)";
const DARK_SUBTLE = "hsl(200 10% 45%)";
const RED = "0 72% 50%";
const GREEN = "155 72% 38%";
const BLUE = "220 80% 50%";
const SEAFOAM = "170 100% 33%";
const GOLD = "45 95% 42%";
const ACCENT = "200 90% 42%";

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

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 01 — COVER
// ═══════════════════════════════════════════════════════════════════════════════

function Slide01() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-28">
        <div className="flex items-center gap-3 mb-12 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.1)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${TEAL})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>
            LIZA OS · Seed Round
          </span>
        </div>

        <h1 className="font-black mb-10" style={{ fontSize: 80, lineHeight: 1.05, color: DARK_TEXT }}>
          The Operating System for<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI-Native Organizations.
          </span>
        </h1>

        <p className="mb-14" style={{ fontSize: 30, color: DARK_MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          Your best people's expertise should run the company. Not die in their inbox.
        </p>

        <p style={{ fontSize: 20, color: DARK_SUBTLE }}>
          Confidential &nbsp;·&nbsp; €1.5M Seed &nbsp;·&nbsp; Pre-Revenue
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 02 — THE PROBLEM (Bigger boxes, scaling kicker)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02() {
  const examples = [
    { role: "Senior Consultant", knows: "When to deviate from standard pricing for strategic accounts", ai: "Uses default pricing. Client gets the wrong offer.", emoji: "💼" },
    { role: "Lead Architect", knows: "Which framework fits which compliance environment", ai: "Picks the popular one. Project hits regulatory wall at month 4.", emoji: "🏗️" },
    { role: "Top Sales Rep", knows: "When to walk away from a deal that looks good on paper", ai: "Writes an enthusiastic follow-up. Team wastes 3 months.", emoji: "📊" },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-14 justify-center">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${WARM})` }}>The Problem</p>

        <h2 className="font-black mb-3" style={{ fontSize: 54, color: TEXT, lineHeight: 1.05 }}>
          Your best people know things{" "}
          <span style={{ color: `hsl(${WARM})` }}>your AI never will.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 22, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Every organization has people whose judgment makes the difference. AI can't access that judgment. So it guesses — and nobody downstream can tell.
        </p>

        {/* Three large example cards */}
        <div className="flex gap-6 mb-8 flex-1 min-h-0">
          {examples.map((ex, i) => (
            <div key={i} className="flex-1 rounded-2xl border p-7 flex flex-col" style={{ borderColor: `hsl(${WARM} / 0.18)`, background: `hsl(${WARM} / 0.03)` }}>
              <div className="flex items-center gap-3 mb-4">
                <span style={{ fontSize: 32 }}>{ex.emoji}</span>
                <p className="font-black" style={{ fontSize: 22, color: TEXT }}>{ex.role}</p>
              </div>
              <div className="rounded-xl px-5 py-4 mb-4 flex-1" style={{ background: `hsl(${TEAL} / 0.06)` }}>
                <p className="font-bold mb-2" style={{ fontSize: 14, color: `hsl(${TEAL})`, letterSpacing: "0.1em" }}>KNOWS</p>
                <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.5 }}>{ex.knows}</p>
              </div>
              <div className="rounded-xl px-5 py-4 flex-1" style={{ background: `hsl(${WARM} / 0.06)` }}>
                <p className="font-bold mb-2" style={{ fontSize: 14, color: `hsl(${WARM})`, letterSpacing: "0.1em" }}>AI DOES INSTEAD</p>
                <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.5 }}>{ex.ai}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Scaling kicker */}
        <div className="rounded-xl px-8 py-5 text-center"
          style={{ background: `hsl(${WARM} / 0.06)`, border: `1px solid hsl(${WARM} / 0.2)` }}>
          <p className="font-black" style={{ fontSize: 24, color: TEXT }}>
            Now multiply this across every AI interaction, every day, every team.{" "}
            <span style={{ color: `hsl(${WARM})` }}>This is what scaling with AI actually scales.</span>
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 03 — WHY THIS HAPPENS (Two parallel lanes: Old Way vs AI Way)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${WARM})` }}>Why This Happens</p>

        <h2 className="font-black mb-3" style={{ fontSize: 48, color: TEXT, lineHeight: 1.05 }}>
          The bridge between knowledge and output{" "}
          <span style={{ color: `hsl(${WARM})` }}>was always a person.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 20, color: MUTED, maxWidth: 1200 }}>
          AI didn't break the bridge. It removed it.
        </p>

        {/* Two parallel lanes */}
        <div className="flex gap-8 flex-1 min-h-0">
          {/* OLD WAY */}
          <div className="flex-1 rounded-2xl border p-6 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.03)` }}>
            <p className="font-black tracking-[0.2em] uppercase mb-5" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>The Old Way — Slow but Safe</p>
            
            <div className="flex items-center gap-4 flex-1">
              {/* Record */}
              <div className="flex-1 rounded-xl p-4 text-center" style={{ background: `hsl(${TEAL} / 0.06)` }}>
                <BookOpen size={28} className="mx-auto mb-2" style={{ color: `hsl(${TEAL})` }} />
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>System of Record</p>
                <p className="mt-1" style={{ fontSize: 13, color: MUTED }}>SOPs, Wikis, Playbooks</p>
              </div>

              <ArrowRight size={20} style={{ color: `hsl(215 10% 75%)` }} />

              {/* Human Bridge */}
              <div className="flex-1 rounded-xl border-2 p-4 text-center" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.06)` }}>
                <p style={{ fontSize: 28 }}>🧠</p>
                <p className="font-bold mt-1" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>Human Bridge</p>
                <p className="mt-1" style={{ fontSize: 13, color: MUTED }}>Reviews, mentoring, tribal knowledge</p>
              </div>

              <ArrowRight size={20} style={{ color: `hsl(215 10% 75%)` }} />

              {/* Output */}
              <div className="flex-1 rounded-xl p-4 text-center" style={{ background: `hsl(${BLUE} / 0.06)` }}>
                <Zap size={28} className="mx-auto mb-2" style={{ color: `hsl(${BLUE})` }} />
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>System of Output</p>
                <p className="mt-1" style={{ fontSize: 13, color: MUTED }}>CRM, ERP, Deliverables</p>
              </div>
            </div>

            <div className="rounded-lg px-5 py-3 mt-4 text-center" style={{ background: `hsl(${GREEN} / 0.06)` }}>
              <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>
                ✓ Slow, manual, expensive — but humans caught errors and applied judgment.
              </p>
            </div>
          </div>

          {/* AI WAY */}
          <div className="flex-1 rounded-2xl border p-6 flex flex-col" style={{ borderColor: `hsl(${WARM} / 0.25)`, background: `hsl(${WARM} / 0.03)` }}>
            <p className="font-black tracking-[0.2em] uppercase mb-5" style={{ fontSize: 16, color: `hsl(${WARM})` }}>The AI Way — Fast but Blind</p>

            <div className="flex items-center gap-4 flex-1">
              {/* Record */}
              <div className="flex-1 rounded-xl p-4 text-center" style={{ background: `hsl(${TEAL} / 0.06)` }}>
                <BookOpen size={28} className="mx-auto mb-2" style={{ color: `hsl(${TEAL})` }} />
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>System of Record</p>
                <p className="mt-1" style={{ fontSize: 13, color: MUTED }}>SOPs, Wikis, Playbooks</p>
              </div>

              <ArrowRight size={20} style={{ color: `hsl(215 10% 75%)` }} />

              {/* Missing Bridge */}
              <div className="flex-1 rounded-xl border-2 border-dashed p-4 text-center" style={{ borderColor: `hsl(${WARM} / 0.5)`, background: `hsl(${WARM} / 0.04)` }}>
                <p style={{ fontSize: 28 }}>⚡</p>
                <p className="font-bold mt-1" style={{ fontSize: 16, color: `hsl(${WARM})` }}>AI Skips This</p>
                <p className="mt-1" style={{ fontSize: 13, color: MUTED }}>No judgment, no context, no review</p>
              </div>

              <ArrowRight size={20} style={{ color: `hsl(215 10% 75%)` }} />

              {/* Output */}
              <div className="flex-1 rounded-xl p-4 text-center" style={{ background: `hsl(${WARM} / 0.06)` }}>
                <Zap size={28} className="mx-auto mb-2" style={{ color: `hsl(${WARM})` }} />
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>System of Output</p>
                <p className="mt-1" style={{ fontSize: 13, color: MUTED }}>Looks right. Isn't right.</p>
              </div>
            </div>

            <div className="rounded-lg px-5 py-3 mt-4 text-center" style={{ background: `hsl(${WARM} / 0.06)` }}>
              <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${WARM})` }}>
                ✗ Fast, scalable, cheap — but speed removes the safety net entirely.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom connector */}
        <div className="mt-5 rounded-xl px-8 py-4 text-center"
          style={{ background: `hsl(${WARM} / 0.06)`, border: `1px solid hsl(${WARM} / 0.15)` }}>
          <p className="font-black" style={{ fontSize: 22, color: TEXT }}>
            Whatever you don't define,{" "}
            <span style={{ color: `hsl(${WARM})` }}>AI invents.</span>{" "}
            This bridge needs its own infrastructure.
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 04 — THE SOLUTION (Simple: LIZA as the rebuilt bridge)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-14">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>The Solution</p>

        <h2 className="font-black mb-3" style={{ fontSize: 52, color: DARK_TEXT, lineHeight: 1.05 }}>
          LIZA rebuilds the bridge.{" "}
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            As infrastructure.
          </span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: DARK_MUTED, maxWidth: 1200 }}>
          The operating system that makes AI-native execution safe.
        </p>

        {/* The rebuilt bridge visual */}
        <div className="flex-1 flex items-center gap-0">
          {/* Record */}
          <div className="w-[300px] rounded-2xl border p-6 flex flex-col items-center text-center"
            style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.06)` }}>
            <BookOpen size={36} style={{ color: `hsl(${TEAL})` }} />
            <p className="font-black mt-3" style={{ fontSize: 22, color: DARK_TEXT }}>System of Record</p>
            <p className="mt-2" style={{ fontSize: 15, color: DARK_MUTED }}>SOPs, Wikis, Playbooks, Tribal Knowledge</p>
          </div>

          <div className="flex-shrink-0 px-2"><ArrowRight size={24} style={{ color: DARK_SUBTLE }} /></div>

          {/* LIZA — the new bridge */}
          <div className="flex-1 rounded-2xl border-2 p-7 flex flex-col items-center text-center mx-2"
            style={{ borderColor: `hsl(${TEAL} / 0.5)`, background: `hsl(${TEAL} / 0.1)`,
              boxShadow: `0 0 60px hsl(${TEAL} / 0.15)` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `hsl(${TEAL} / 0.2)` }}>
                <Network size={28} style={{ color: `hsl(${TEAL})` }} />
              </div>
              <p className="font-black" style={{ fontSize: 32, color: `hsl(${TEAL})` }}>LIZA OS</p>
            </div>
            <p className="font-bold mb-5" style={{ fontSize: 18, color: DARK_TEXT }}>
              The Instruction Layer
            </p>
            <div className="grid grid-cols-2 gap-3 w-full">
              {[
                { label: "Capture", desc: "Extracts how seniors actually think" },
                { label: "Organize", desc: "Structures into governed, versioned bundles" },
                { label: "Execute", desc: "AI generates with your judgment built in" },
                { label: "Learn", desc: "Every execution feeds back and improves" },
              ].map(item => (
                <div key={item.label} className="rounded-lg px-4 py-3 text-left" style={{ background: `hsl(${TEAL} / 0.1)` }}>
                  <p className="font-bold" style={{ fontSize: 15, color: `hsl(${MINT})` }}>{item.label}</p>
                  <p style={{ fontSize: 13, color: DARK_MUTED, lineHeight: 1.4 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 px-2"><ArrowRight size={24} style={{ color: DARK_SUBTLE }} /></div>

          {/* Output */}
          <div className="w-[300px] rounded-2xl border p-6 flex flex-col items-center text-center"
            style={{ borderColor: `hsl(${BLUE} / 0.2)`, background: `hsl(${BLUE} / 0.06)` }}>
            <Zap size={36} style={{ color: `hsl(${BLUE})` }} />
            <p className="font-black mt-3" style={{ fontSize: 22, color: DARK_TEXT }}>System of Output</p>
            <p className="mt-2" style={{ fontSize: 15, color: DARK_MUTED }}>CRM, ERP, Deliverables — now with expert-quality</p>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-6 rounded-xl px-8 py-4 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
          <p className="font-bold" style={{ fontSize: 20, color: DARK_TEXT }}>
            Same prompt. Same AI. But now it executes with{" "}
            <span style={{ color: `hsl(${TEAL})` }}>your organization's judgment built in.</span>
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 05 — THE SOLUTION DETAILED (Before/After comparison)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>The Solution</p>

        <h2 className="font-black mb-4" style={{ fontSize: 55, color: DARK_TEXT, lineHeight: 1.05 }}>
          LIZA OS: the{" "}
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            System of Intelligence.
          </span>
        </h2>
        <p className="mb-8" style={{ fontSize: 23, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Infrastructure that captures how your best people think, makes it executable by AI,
          and ensures every output reflects your organization's actual expertise — not generic training data.
        </p>

        <div className="flex-1 flex gap-6 items-stretch">
          {/* Before */}
          <div className="w-[380px] rounded-2xl border p-6 flex flex-col items-center justify-center text-center"
            style={{ borderColor: `hsl(${WARM} / 0.2)`, background: `hsl(${WARM} / 0.06)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-4" style={{ fontSize: 14, color: `hsl(${WARM})` }}>Without LIZA</p>
            <p style={{ fontSize: 22, color: DARK_TEXT, lineHeight: 1.5, marginBottom: 16 }}>
              "AI, write a proposal"
            </p>
            <div className="flex flex-col gap-2 w-full">
              {["Wrong pricing", "Generic methodology", "No client context", "Inconsistent across team"].map(item => (
                <div key={item} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: `hsl(${WARM} / 0.1)` }}>
                  <span style={{ color: `hsl(${WARM})` }}>✗</span>
                  <span style={{ fontSize: 16, color: DARK_TEXT }}>{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-semibold" style={{ fontSize: 16, color: `hsl(${WARM})` }}>
              AI invents. Output looks right but isn't.
            </p>
          </div>

          <div className="flex items-center"><ArrowRight size={32} style={{ color: `hsl(${TEAL})` }} /></div>

          {/* After */}
          <div className="flex-1 rounded-2xl border-2 p-7 flex flex-col"
            style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.08)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-4" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>With LIZA</p>
            <p style={{ fontSize: 22, color: DARK_TEXT, lineHeight: 1.5, marginBottom: 16 }}>
              "AI, write a proposal" — <strong>same prompt, different result</strong>
            </p>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {[
                { label: "Expertise captured", desc: "Pricing, methodology, tone — encoded from your senior people" },
                { label: "Context injected", desc: "AI receives the right playbook, client history, competitive stance" },
                { label: "Quality governed", desc: "Output follows your standards. Drift detected in real-time" },
                { label: "Team-wide consistency", desc: "Junior and senior get the same expert-quality output" },
              ].map(item => (
                <div key={item.label} className="rounded-xl px-5 py-4" style={{ background: `hsl(${TEAL} / 0.1)` }}>
                  <p className="font-bold mb-1" style={{ fontSize: 17, color: `hsl(${TEAL})` }}>{item.label}</p>
                  <p style={{ fontSize: 15, color: DARK_MUTED, lineHeight: 1.4 }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 px-5 py-3 rounded-lg" style={{ background: `hsl(${GREEN} / 0.1)` }}>
              <p className="font-bold" style={{ fontSize: 17, color: `hsl(${GREEN})` }}>
                ✓ Same prompt. Expert-quality output. Every time. Every person.
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
// SLIDE 06 — CATEGORY VALIDATION (Emerging players + TAM)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06() {
  const players = [
    { name: "Edra", funding: "$30M", round: "Series A · 2024", what: "Process mining → executable SOPs for AI agents", focus: "Predictable back-office processes", color: GREEN },
    { name: "Mem0.ai", funding: "$24M", round: "Series A · 2024", what: "AI memory layer — persistent context across sessions", focus: "Developer memory infrastructure", color: SEAFOAM },
    { name: "Interloom", funding: "$16.5M", round: "Series A · 2023", what: "Tacit knowledge capture for operations teams", focus: "Repeatable operational workflows", color: BLUE },
    { name: "Paradox.ai", funding: "~$3.8M", round: "Seed · 2024", what: "Knowledge governance for regulated industries", focus: "Compliance-first documentation", color: GOLD },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-14">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Category Validation</p>

        <h2 className="font-black mb-2" style={{ fontSize: 48, color: DARK_TEXT, lineHeight: 1.05 }}>
          We're not alone.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>$90M+ invested in 24 months.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 21, color: DARK_MUTED, maxWidth: 1200 }}>
          Smart money recognized the gap. These companies are building executable knowledge infrastructure. LIZA is built for the hardest, highest-value segment: where expertise requires <em>judgment</em>, not just retrieval.
        </p>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Emerging players */}
          <div className="flex-1 flex flex-col gap-3">
            <p className="font-bold tracking-[0.15em] uppercase mb-1" style={{ fontSize: 13, color: DARK_SUBTLE }}>The category players</p>
            {players.map(({ name, funding, round, what, focus, color }) => (
              <div key={name} className="flex items-center gap-4 rounded-xl border px-5 py-3"
                style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.06)` }}>
                <div className="w-[140px] shrink-0">
                  <p className="font-bold" style={{ fontSize: 18, color: DARK_TEXT }}>{name}</p>
                  <p className="font-black" style={{ fontSize: 14, color: `hsl(${color})` }}>{funding}</p>
                  <p style={{ fontSize: 12, color: DARK_SUBTLE }}>{round}</p>
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 15, color: DARK_MUTED }}>{what}</p>
                  <p className="mt-1 font-semibold" style={{ fontSize: 13, color: DARK_SUBTLE }}>Focus: {focus}</p>
                </div>
              </div>
            ))}

            {/* LIZA row */}
            <div className="rounded-xl border-2 px-5 py-4 mt-auto"
              style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.08)` }}>
              <div className="flex items-center gap-4">
                <div className="w-[140px] shrink-0">
                  <p className="font-black" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>LIZA OS</p>
                  <p className="font-semibold" style={{ fontSize: 13, color: `hsl(${TEAL})` }}>€1.5M Seed</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold" style={{ fontSize: 16, color: DARK_TEXT }}>
                    The Instruction Layer — governs <strong>judgment-heavy</strong> expertise where stakes are highest.
                  </p>
                  <p className="mt-1" style={{ fontSize: 14, color: DARK_MUTED }}>
                    They automate the predictable. We govern what isn't.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TAM/SAM/SOM */}
          <div className="w-[380px] rounded-2xl border p-6 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.06)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-4" style={{ fontSize: 13, color: `hsl(${TEAL})` }}>Market Size</p>
            <div className="flex flex-col gap-4 flex-1 justify-center">
              {[
                { label: "TAM", value: "$28B", desc: "Global AI governance & knowledge management infrastructure", size: "w-full" },
                { label: "SAM", value: "$4.2B", desc: "Mid-market knowledge-intensive orgs (50–1000 employees)", size: "w-[85%]" },
                { label: "SOM", value: "$120M", desc: "DACH professional services, consulting & regulated industries", size: "w-[60%]" },
              ].map(({ label, value, desc, size }) => (
                <div key={label}>
                  <div className={`${size} rounded-xl px-5 py-3`} style={{ background: `hsl(${TEAL} / 0.1)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-black" style={{ fontSize: 13, color: `hsl(${TEAL})`, letterSpacing: "0.15em" }}>{label}</span>
                      <span className="font-black" style={{ fontSize: 28, color: DARK_TEXT }}>{value}</span>
                    </div>
                    <p style={{ fontSize: 13, color: DARK_MUTED, lineHeight: 1.4 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 px-4 py-2.5 rounded-lg" style={{ background: `hsl(${GREEN} / 0.08)` }}>
              <p className="font-semibold" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>
                Wedge: Professional services → Regulated → Enterprise
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 07 — HOW IT WORKS (4-step loop)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide07() {
  const steps = [
    {
      icon: <BookOpen size={36} />, num: "01", title: "Capture",
      desc: "Extract how your best people actually work.",
      example: "Sarah's proposal approach → reusable playbook",
      screenshot: "/images/product-learn-extraction.png",
    },
    {
      icon: <Network size={36} />, num: "02", title: "Organize",
      desc: "Structure into governed, versioned bundles.",
      example: "Pricing + methodology + signals = one bundle",
      screenshot: "/images/product-playbooks.png",
    },
    {
      icon: <Zap size={36} />, num: "03", title: "Execute",
      desc: "AI generates with your judgment built in.",
      example: "Junior writes at senior quality. Automatically.",
      screenshot: "/images/product-execute-protocol.png",
    },
    {
      icon: <RefreshCw size={36} />, num: "04", title: "Learn",
      desc: "Every execution feeds back. Standards improve.",
      example: "Sarah's correction → tomorrow's default",
      screenshot: "/images/product-learn-debrief.png",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-14">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>How It Works</p>

        <h2 className="font-black mb-2" style={{ fontSize: 48, color: TEXT, lineHeight: 1.05 }}>
          Four steps.{" "}
          <span style={{ color: `hsl(${TEAL})` }}>One compounding loop.</span>
        </h2>
        <p className="mb-5" style={{ fontSize: 20, color: MUTED, maxWidth: 1000 }}>
          Each cycle makes your organization's AI smarter.
        </p>

        <div className="flex-1 grid grid-cols-4 gap-5 min-h-0">
          {steps.map((s, i) => (
            <div key={s.num} className="rounded-2xl border flex flex-col relative overflow-hidden"
              style={{ borderColor: i === 3 ? `hsl(${TEAL} / 0.4)` : `hsl(215 10% 88%)`, background: i === 3 ? `hsl(${TEAL} / 0.06)` : CARD_ALT }}>
              {/* Screenshot thumbnail */}
              <div className="h-[180px] overflow-hidden" style={{ borderBottom: `1px solid hsl(215 10% 90%)` }}>
                <img src={s.screenshot} alt={s.title} className="w-full h-full object-cover object-top" loading="lazy" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-black tracking-[0.2em]" style={{ fontSize: 13, color: `hsl(${TEAL})` }}>
                    STEP {s.num}
                  </span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `hsl(${TEAL} / 0.1)`, color: `hsl(${TEAL})` }}>
                    {s.icon}
                  </div>
                </div>
                <p className="font-black mb-1" style={{ fontSize: 24, color: TEXT }}>{s.title}</p>
                <p className="mb-3" style={{ fontSize: 15, color: MUTED, lineHeight: 1.45 }}>{s.desc}</p>
                <div className="mt-auto px-3 py-2 rounded-lg" style={{ background: `hsl(${TEAL} / 0.06)` }}>
                  <p style={{ fontSize: 13, color: `hsl(${TEAL})`, fontStyle: "italic" }}>
                    e.g. {s.example}
                  </p>
                </div>
              </div>
              {i < 3 && (
                <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight size={20} style={{ color: `hsl(${TEAL} / 0.35)` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 07 — PROOF (Validation with outcome metrics)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide08() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-14">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Early Validation</p>

        <h2 className="font-black mb-8" style={{ fontSize: 50, color: DARK_TEXT, lineHeight: 1.05 }}>
          Real organizations.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>Real outcomes.</span>
        </h2>

        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          {[
            {
              title: "Global AEC Software Company",
              subtitle: "€6B Group · 200+ employees",
              color: TEAL,
              outcome: "VP Product now serves as Strategic Advisor",
              points: [
                "16 VP-level attendees in first session (107 min)",
                "Post-merger governance across 4 departments",
                "AI learned governance rules live — in real time",
              ],
            },
            {
              title: "Executive Search Firm",
              subtitle: "Boutique · Senior partner engagement",
              color: GREEN,
              outcome: "New associates at senior quality from week 2",
              points: [
                "Encoded senior partner's candidate evaluation judgment",
                "Associates running searches at expert quality immediately",
                "Onboarding time compressed from months to days",
              ],
            },
            {
              title: "Professional Services Consultancy",
              subtitle: "Mid-market · Multi-team deployment",
              color: GOLD,
              outcome: "Client escalations reduced measurably",
              points: [
                "Delivery methodology encoded into executable protocols",
                "Client communication standardized across all consultants",
                "Quality consistency regardless of seniority",
              ],
            },
            {
              title: "B2B Sales Organization",
              subtitle: "SaaS · Sales team pilot",
              color: TEAL,
              outcome: "Entire team executing top seller's playbook",
              points: [
                "Best seller's deal qualification judgment encoded",
                "Competitive positioning updates from live deal feedback",
                "Ramp time for new hires cut significantly",
              ],
            },
          ].map(({ title, subtitle, color, outcome, points }) => (
            <div key={title} className="rounded-2xl border p-6 flex flex-col"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
              <p className="font-bold" style={{ fontSize: 20, color: DARK_TEXT }}>{title}</p>
              <p className="mb-2" style={{ fontSize: 15, color: `hsl(${color})` }}>{subtitle}</p>
              <div className="rounded-lg px-4 py-2 mb-3" style={{ background: `hsl(${color} / 0.1)` }}>
                <p className="font-bold" style={{ fontSize: 16, color: `hsl(${color})` }}>🎯 {outcome}</p>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                {points.map((p, i) => (
                  <p key={i} className="flex items-start gap-2" style={{ fontSize: 16, color: DARK_MUTED }}>
                    <span className="font-bold shrink-0" style={{ color: `hsl(${color})` }}>→</span> {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 08 — VERTICALS (Expansion path)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide09() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Expansion Path</p>

        <h2 className="font-black mb-6" style={{ fontSize: 50, color: TEXT, lineHeight: 1.05 }}>
          Same engine.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>Every knowledge-intensive industry.</span>
        </h2>

        <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">
          {[
            {
              vertical: "Professional Services", status: "Deployed", color: GREEN,
              problem: "Senior consultants carry methodology in their heads. Juniors can't replicate quality.",
              result: "New consultants deliver at senior quality from week 2.",
            },
            {
              vertical: "Sales Operations", status: "Deployed", color: GREEN,
              problem: "Top sellers have instincts for deal qualification. Rest of the team guesses.",
              result: "Entire team executes with top seller's judgment. Ramp time cut by 60%+.",
            },
            {
              vertical: "Pharma & Biotech", status: "Validated", color: GOLD,
              problem: "GxP compliance requires audit-ready documentation with traceable expertise.",
              result: "18-day audits compressed to hours. Full provenance trails.",
            },
            {
              vertical: "Food Safety & Manufacturing", status: "Validated", color: GOLD,
              problem: "ISO 22000/HACCP audit judgment doesn't scale to junior inspectors.",
              result: "Junior inspectors execute at expert quality. Consistent across sites.",
            },
          ].map(({ vertical, status, color, problem, result }) => (
            <div key={vertical} className="rounded-xl border p-6 flex flex-col"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.03)` }}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>{vertical}</p>
                <span className="px-2.5 py-1 rounded-full font-semibold" style={{ fontSize: 13, background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}>{status}</span>
              </div>
              <div className="flex items-start gap-2.5 mb-3">
                <AlertTriangle size={18} style={{ color: `hsl(${WARM})`, flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.45 }}>{problem}</p>
              </div>
              <div className="flex items-start gap-2.5 mt-auto">
                <CheckCircle2 size={18} style={{ color: `hsl(${color})`, flexShrink: 0, marginTop: 2 }} />
                <p className="font-semibold" style={{ fontSize: 17, color: `hsl(${color})`, lineHeight: 1.45 }}>{result}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border px-6 py-4 flex items-center gap-5"
          style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.04)` }}>
          <TrendingUp size={24} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
          <p style={{ fontSize: 18, color: MUTED }}>
            <strong style={{ color: TEXT }}>Same core engine. Industry-specific expertise packs.</strong>{" "}
            Each vertical deepens the moat. Capital-efficient expansion.
          </p>
        </div>
      </div>
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 09 — WHAT'S BUILT (Product is live)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide10() {
  const features = [
    {
      layer: "Knowledge Graph", color: ACCENT,
      icon: <Layers size={28} />,
      desc: "Living organizational memory — versioned, auditable, propagated.",
      screenshot: "/images/product-define-enforce.png",
    },
    {
      layer: "Protocol Workbooks", color: GOLD,
      icon: <Target size={28} />,
      desc: "Model-agnostic AI execution. Group collaboration in one workspace.",
      screenshot: "/images/product-execute-protocol.png",
    },
    {
      layer: "Context Engine (AACE v3.1)", color: GREEN,
      icon: <Workflow size={28} />,
      desc: "Proprietary spec. Intent-locking, knowledge injection. The IP moat.",
      screenshot: "/images/product-mission-control.png",
    },
    {
      layer: "Governance Loop", color: ACCENT,
      icon: <Eye size={28} />,
      desc: "Drift detection, compliance scoring, after-action synthesis.",
      screenshot: "/images/product-oversight.png",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>Product Status</p>
        <h2 className="font-bold mb-6" style={{ fontSize: 56, color: TEXT, lineHeight: 1.1 }}>
          This isn't a slide deck.{" "}
          <span style={{ color: `hsl(${ACCENT})` }}>The product is live.</span>
        </h2>

        <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">
          {features.map(({ layer, color, icon, desc, screenshot }) => (
            <div key={layer} className="flex flex-col rounded-2xl border overflow-hidden"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.03)` }}>
              {/* Product screenshot */}
              <div className="h-[200px] overflow-hidden" style={{ borderBottom: `1px solid hsl(${color} / 0.12)` }}>
                <img src={screenshot} alt={layer} className="w-full h-full object-cover object-top" loading="lazy" />
              </div>
              <div className="flex gap-4 p-5 flex-1">
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `hsl(${color} / 0.1)`, color: `hsl(${color})` }}>{icon}</div>
                <div>
                  <p className="font-bold mb-1" style={{ fontSize: 20, color: TEXT }}>{layer}</p>
                  <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.45 }}>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-5 mt-4">
          {[
            { label: "AI Standards Diagnostic", desc: "Live lead-gen tool. Teams self-assess AI maturity.", color: GOLD },
            { label: "Full Marketing Site", desc: "Positioning, 7 use cases, industries live at lizaos.ai.", color: ACCENT },
          ].map(({ label, desc, color }) => (
            <div key={label} className="flex-1 rounded-xl border px-5 py-3 flex items-center gap-3"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
              <Lightbulb size={22} style={{ color: `hsl(${color})`, flexShrink: 0 }} />
              <div>
                <p className="font-bold" style={{ fontSize: 16, color: TEXT }}>{label}</p>
                <p style={{ fontSize: 14, color: MUTED }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — BUSINESS MODEL
// ═══════════════════════════════════════════════════════════════════════════════

function Slide11() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Business Model</p>

        <h2 className="font-black mb-8" style={{ fontSize: 52, color: DARK_TEXT, lineHeight: 1.05 }}>
          Land with diagnostics.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>Expand with expertise packs.</span>
        </h2>

        <div className="flex gap-8 flex-1 min-h-0">
          {/* Pricing */}
          <div className="flex-1 flex flex-col gap-5">
            <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>Revenue Streams</p>

            <div className="rounded-xl border p-6" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: DARK_TEXT }}>Platform SaaS</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>€500–2,000/mo per team</span>
              </div>
              <p style={{ fontSize: 17, color: DARK_MUTED, lineHeight: 1.5 }}>
                Core platform access. Knowledge graph, workbooks, protocol execution, governance.
                Usage-based AI execution on top.
              </p>
            </div>

            <div className="rounded-xl border p-6" style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: DARK_TEXT }}>Expertise Packs</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${GREEN})` }}>€2,000–10,000 one-time</span>
              </div>
              <p style={{ fontSize: 17, color: DARK_MUTED, lineHeight: 1.5 }}>
                Industry-specific pre-built playbooks. Consulting frameworks, compliance templates,
                sales methodologies. High-margin, deepens lock-in.
              </p>
            </div>

            <div className="rounded-xl border p-6" style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.06)` }}>
              <div className="flex items-baseline gap-3 mb-2">
                <p className="font-black" style={{ fontSize: 28, color: DARK_TEXT }}>Onboarding Sprint</p>
                <span className="font-bold" style={{ fontSize: 18, color: `hsl(${GOLD})` }}>€5,000–15,000</span>
              </div>
              <p style={{ fontSize: 17, color: DARK_MUTED, lineHeight: 1.5 }}>
                White-glove expertise extraction. We encode your senior team's judgment into the platform.
                Converts to long-term SaaS.
              </p>
            </div>
          </div>

          {/* Unit economics */}
          <div className="w-[420px] flex flex-col gap-5">
            <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>Unit Economics Target</p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "ACV", value: "€18K", desc: "Average contract value" },
                { label: "CAC", value: "€3K", desc: "Diagnostic-to-pilot funnel" },
                { label: "LTV:CAC", value: "6:1", desc: "Target at steady state" },
                { label: "NRR", value: ">120%", desc: "Expansion via teams + packs" },
              ].map(({ label, value, desc }) => (
                <div key={label} className="rounded-xl px-5 py-5 text-center" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
                  <p className="font-black" style={{ fontSize: 36, color: DARK_TEXT }}>{value}</p>
                  <p className="font-bold mt-1" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>{label}</p>
                  <p style={{ fontSize: 13, color: DARK_MUTED }}>{desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border p-5 flex-1" style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.06)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 17, color: `hsl(${ACCENT})` }}>GTM Motion</p>
              <div className="flex flex-col gap-2">
                {[
                  "Free diagnostic → identifies gaps",
                  "Pilot sprint → encodes first playbooks",
                  "Platform subscription → ongoing execution",
                  "Expansion → more teams, more packs",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-black" style={{ fontSize: 14, color: `hsl(${ACCENT})` }}>{i + 1}.</span>
                    <span style={{ fontSize: 15, color: DARK_MUTED }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — TEAM
// ═══════════════════════════════════════════════════════════════════════════════

function Slide12() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>Team</p>

        <h2 className="font-black mb-8" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          Built by practitioners.{" "}
          <span style={{ color: `hsl(${TEAL})` }}>Not first-time founders.</span>
        </h2>

        <div className="flex gap-8 flex-1 min-h-0">
          <div className="flex-1 flex flex-col gap-5">
            <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${TEAL})`, letterSpacing: "0.15em" }}>FOUNDING TEAM</p>
            {[
              { name: "István Boscha", role: "Product & CEO", note: "Founder of Aliz.ai (Google Cloud Partner). 15+ years AI transformation globally.", photo: istvanPhoto, color: TEAL },
              { name: "Kristóf Éger", role: "Enterprise GTM", note: "Category creation, executive positioning, AI-driven business strategy.", photo: kristofPhoto, color: SEAFOAM },
              { name: "Zoltán Kauker", role: "AI Architecture", note: "Deep-tech AI/data engineering. Knowledge systems & scalable infrastructure.", photo: zoltanPhoto, color: MINT },
            ].map((t) => (
              <div key={t.name} className="flex items-center gap-5 rounded-xl border p-5"
                style={{ borderColor: `hsl(${t.color} / 0.2)`, background: `hsl(${t.color} / 0.03)` }}>
                <img src={t.photo} alt={t.name} className="w-16 h-16 rounded-full object-cover" style={{ border: `2px solid hsl(${t.color} / 0.3)` }} />
                <div>
                  <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>{t.name}</p>
                  <p style={{ fontSize: 16, color: `hsl(${t.color})` }}>{t.role}</p>
                  <p style={{ fontSize: 15, color: MUTED }}>{t.note}</p>
                </div>
              </div>
            ))}
            <div className="rounded-xl border p-4 flex items-center gap-4 mt-auto"
              style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.04)` }}>
              <Shield size={20} style={{ color: `hsl(${GOLD})`, flexShrink: 0 }} />
              <p style={{ fontSize: 15, color: MUTED }}>
                <strong style={{ color: TEXT }}>Advisory:</strong> Tom Ray (Chairman, Aliz.ai; Founding CEO, EdgeCore Data Centers)
                + Enterprise VP Product Advisor
              </p>
            </div>
          </div>

          <div className="w-[420px] flex flex-col gap-5">
            <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${GREEN})`, letterSpacing: "0.15em" }}>WHY US</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { stat: "15+", label: "Clients served", icon: <Users size={20} /> },
                { stat: "8", label: "Countries", icon: <Globe size={20} /> },
                { stat: "15+ yrs", label: "AI consulting", icon: <Briefcase size={20} /> },
              ].map(({ stat, label, icon }) => (
                <div key={label} className="text-center rounded-xl px-3 py-4" style={{ background: `hsl(${TEAL} / 0.05)`, border: `1px solid hsl(${TEAL} / 0.12)` }}>
                  <div className="flex justify-center mb-2" style={{ color: `hsl(${TEAL})` }}>{icon}</div>
                  <p className="font-black" style={{ fontSize: 30, color: TEXT }}>{stat}</p>
                  <p style={{ fontSize: 13, color: MUTED }}>{label}</p>
                </div>
              ))}
            </div>
            {[
              { title: "We lived this problem", desc: "Built AI practices at enterprise scale. Saw the expertise gap firsthand — across industries, countries, team sizes.", color: GREEN },
              { title: "Capital efficient", desc: "Entire product, marketing site, diagnostic tool, and enterprise pipeline built with near-zero burn.", color: TEAL },
              { title: "Proprietary IP", desc: "AACE v3.1 — the context specification. Intent-locking, knowledge injection, drift detection. Hard to replicate.", color: GREEN },
            ].map(({ title, desc, color }) => (
              <div key={title} className="rounded-xl border p-4"
                style={{ borderColor: `hsl(${color} / 0.15)`, background: `hsl(${color} / 0.03)` }}>
                <p className="font-bold mb-1" style={{ fontSize: 17, color: `hsl(${color})` }}>{title}</p>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.45 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — THE ASK (€1.5M + milestones + use of funds)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide13() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${MINT}), transparent 70%)` }} />

      <div className="relative z-10 w-full px-28">
        <div className="text-center mb-8">
          <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 24, color: `hsl(${GREEN} / 0.8)` }}>Seed Round</p>
          <h2 className="font-black mb-3" style={{ fontSize: 96, color: DARK_TEXT }}>€1.5M</h2>
          <p style={{ fontSize: 24, color: DARK_MUTED }}>
            Post-money SAFE &nbsp;·&nbsp; 18-month runway &nbsp;·&nbsp; Series A readiness
          </p>
        </div>

        {/* Use of funds */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Customer Acq.", pct: "40%", amt: "€600K", desc: "15-20 paying pilots", color: ACCENT },
            { label: "Product", pct: "30%", amt: "€450K", desc: "Production hardening", color: GREEN },
            { label: "GTM", pct: "20%", amt: "€300K", desc: "Case studies + channels", color: GOLD },
            { label: "Operations", pct: "10%", amt: "€150K", desc: "Legal, IP, compliance", color: MUTED },
          ].map(({ label, pct, amt, desc, color }) => (
            <div key={label} className="rounded-xl border px-5 py-4 text-center"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.06)` }}>
              <p className="font-black" style={{ fontSize: 32, color: DARK_TEXT }}>{pct}</p>
              <p className="font-bold" style={{ fontSize: 16, color: `hsl(${color})` }}>{label}</p>
              <p style={{ fontSize: 14, color: DARK_MUTED }}>{amt} — {desc}</p>
            </div>
          ))}
        </div>

        {/* Milestones */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { month: "Month 1-6", target: "€200-400K ARR", milestone: "5-8 paying customers. First case studies.", color: TEAL },
            { month: "Month 7-12", target: "€600K-1M ARR", milestone: "15+ customers, 3+ verticals. NRR >120%.", color: SEAFOAM },
            { month: "Month 13-18", target: "€1-1.5M ARR", milestone: "25+ customers. Series A raise.", color: MINT },
          ].map(({ month, target, milestone, color }) => (
            <div key={month} className="rounded-xl border px-5 py-4"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
              <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{month}</p>
              <p className="font-black mt-1" style={{ fontSize: 28, color: DARK_TEXT }}>{target}</p>
              <p className="mt-2" style={{ fontSize: 15, color: DARK_MUTED, lineHeight: 1.4 }}>{milestone}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl px-10 py-4 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
          <p style={{ fontSize: 22, color: DARK_TEXT, lineHeight: 1.5 }}>
            Your best people's expertise is your competitive advantage.{" "}
            <strong style={{ color: `hsl(${TEAL})` }}>We make it run the company.</strong>
          </p>
        </div>

        <p className="mt-5 text-center" style={{ fontSize: 18, color: DARK_SUBTLE }}>
          lizaos.ai &nbsp;·&nbsp; kristof.eger@lizaos.ai &nbsp;·&nbsp; Confidential
        </p>
      </div>
      <SlideBar from={MINT} to={TEAL} />
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, title: "Cover", component: <Slide01 /> },
  { id: 2, title: "The Problem", component: <Slide02 /> },
  { id: 3, title: "Why This Happens", component: <Slide03 /> },
  { id: 4, title: "The Emerging Category", component: <Slide04 /> },
  { id: 5, title: "The Solution", component: <Slide05 /> },
  { id: 6, title: "How It Works", component: <Slide06 /> },
  { id: 7, title: "Early Validation", component: <Slide07 /> },
  { id: 8, title: "Expansion Path", component: <Slide08 /> },
  { id: 9, title: "What's Built", component: <Slide09 /> },
  { id: 10, title: "Business Model", component: <Slide10 /> },
  { id: 11, title: "Team", component: <Slide11 /> },
  { id: 12, title: "The Ask", component: <Slide12 /> },
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
              style={{ background: "linear-gradient(90deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Previous">
              <ChevronLeft size={32} style={{ color: `hsl(215 15% 42% / 0.5)` }} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); showMobileControls(); }} disabled={current === SLIDES.length - 1}
              className="absolute right-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-end pr-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(270deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Next">
              <ChevronRight size={32} style={{ color: `hsl(215 15% 42% / 0.5)` }} />
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
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg disabled:opacity-20 hover:bg-gray-100">
              <ChevronLeft size={20} style={{ color: TEXT }} />
            </button>
            <span className="font-mono text-sm min-w-[60px] text-center" style={{ color: MUTED }}>
              {current + 1} / {SLIDES.length}
            </span>
            <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg disabled:opacity-20 hover:bg-gray-100">
              <ChevronRight size={20} style={{ color: TEXT }} />
            </button>
            <div className="w-px h-5" style={{ background: CHROME_BORDER }} />
            <button onClick={() => document.exitFullscreen?.()} className="p-2 rounded-lg hover:bg-gray-100">
              <X size={18} style={{ color: MUTED }} />
            </button>
          </div>
        )}
        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
          {SLIDES.map(s => (
            <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
          ))}
        </div>
      </div>
    );
  }

  if (showGrid) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-auto" style={{ background: CHROME_BG }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: CHROME_BORDER, background: BG }}>
          <h2 className="font-bold" style={{ fontSize: 20, color: TEXT }}>LIZA OS — Investor Deck</h2>
          <div className="flex items-center gap-3">
            <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Investor-Deck" slideCount={SLIDES.length} />
            <Button variant="outline" size="sm" onClick={() => setShowGrid(false)}>
              <X size={16} className="mr-1.5" /> Close
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-5 p-6">
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)}
              className={cn("rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg text-left",
                i === current ? "ring-2 ring-offset-2" : "")}
              style={{ borderColor: i === current ? `hsl(${TEAL})` : CHROME_BORDER, aspectRatio: "16/9" }}>
              <div className="w-full h-full relative">
                <ScaledSlide>{s.component}</ScaledSlide>
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2" style={{ background: "hsl(0 0% 100% / 0.9)" }}>
                  <p className="font-semibold truncate" style={{ fontSize: 13, color: TEXT }}>
                    {i + 1}. {s.title}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
          {SLIDES.map(s => (
            <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: CHROME_BG }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: CHROME_BORDER, background: BG }}>
        <div className="flex items-center gap-4">
          <span className="font-bold" style={{ fontSize: 16, color: TEXT }}>LIZA OS — Investor Deck</span>
          <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: CARD_ALT, color: MUTED }}>
            {current + 1} / {SLIDES.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Investor-Deck" slideCount={SLIDES.length} />
          <Button variant="ghost" size="sm" onClick={() => setShowGrid(true)}>
            <Grid3x3 size={16} className="mr-1.5" /> Grid
          </Button>
          <Button variant="ghost" size="sm" onClick={enterFullscreen}>
            <Maximize2 size={16} className="mr-1.5" /> Present
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        <button onClick={prev} disabled={current === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full disabled:opacity-10 hover:bg-white/80 transition-opacity z-10">
          <ChevronLeft size={24} style={{ color: MUTED }} />
        </button>

        <div className="w-full h-full max-w-[1200px] rounded-xl overflow-hidden shadow-lg border" style={{ borderColor: CHROME_BORDER, aspectRatio: "16/9" }}>
          <ScaledSlide>{slide.component}</ScaledSlide>
        </div>

        <button onClick={next} disabled={current === SLIDES.length - 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full disabled:opacity-10 hover:bg-white/80 transition-opacity z-10">
          <ChevronRight size={24} style={{ color: MUTED }} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 pb-4">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{ background: i === current ? `hsl(${TEAL})` : `hsl(215 10% 80%)` }} />
        ))}
      </div>

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
        ))}
      </div>
    </div>
  );
}
