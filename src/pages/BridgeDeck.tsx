import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import {
  CheckCircle2, AlertTriangle, Zap, Target, TrendingUp,
  Building2, FlaskConical, Shield, Briefcase, ArrowRight,
  Users, Wand2, Rocket, Crosshair,
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  Layers, Cpu, GitBranch, Calendar, Coins, FileSignature, Clock, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
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
      }}>{children}</div>
    </div>
  );
}

// ─── Tokens ──────────────────────────────────────────────────────────────────
const BG = "hsl(0 0% 100%)";
const TEXT = "hsl(222 20% 10%)";
const MUTED = "hsl(215 15% 42%)";
const SUBTLE = "hsl(215 10% 56%)";
const CARD_ALT = "hsl(220 15% 97%)";
const GRID_LINE = "hsl(215 15% 75%)";
const CHROME_BG = "hsl(220 15% 97%)";
const CHROME_BORDER = "hsl(220 12% 90%)";
const ACCENT = "200 90% 42%";
const GREEN = "155 72% 38%";
const GOLD = "45 95% 42%";
const RED = "0 72% 50%";
const DARK_BG = "hsl(222 25% 8%)";
const DARK_TEXT = "hsl(0 0% 95%)";
const DARK_MUTED = "hsl(215 15% 60%)";

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
      backgroundImage: `linear-gradient(hsl(215 15% 25%) 1px, transparent 1px), linear-gradient(90deg, hsl(215 15% 25%) 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}
function SlideBar({ from = ACCENT, to = GREEN }: { from?: string; to?: string }) {
  return <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(90deg, hsl(${from}), hsl(${to}))` }} />;
}
function Tag({ label, color = ACCENT }: { label: string; color?: string }) {
  return <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 26, color: `hsl(${color})` }}>{label}</p>;
}

// ─── Slide 01 — Cover ────────────────────────────────────────────────────────
function S01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 text-center px-32">
        <p className="font-semibold tracking-[0.3em] uppercase mb-10" style={{ fontSize: 24, color: `hsl(${GOLD})` }}>
          €200K Bridge Round · Confidential
        </p>
        <h1 className="font-bold leading-[1.02] mb-10" style={{ fontSize: 132, color: DARK_TEXT, letterSpacing: "-0.03em" }}>
          Traction to Scale
        </h1>
        <p className="leading-[1.2] mb-12" style={{ fontSize: 56, color: `hsl(${ACCENT} / 0.95)`, fontWeight: 500 }}>
          Unlocking Zero-Touch Onboarding
        </p>
        <div className="inline-flex items-center gap-8 px-10 py-5 rounded-2xl"
          style={{ background: "hsl(0 0% 100% / 0.05)", border: `1px solid hsl(0 0% 100% / 0.12)` }}>
          <div className="text-left">
            <p style={{ fontSize: 18, color: DARK_MUTED, letterSpacing: "0.15em" }} className="uppercase font-semibold">Round Size</p>
            <p style={{ fontSize: 32, color: DARK_TEXT, fontWeight: 700 }}>€200,000</p>
          </div>
          <div className="w-px h-12" style={{ background: "hsl(0 0% 100% / 0.15)" }} />
          <div className="text-left">
            <p style={{ fontSize: 18, color: DARK_MUTED, letterSpacing: "0.15em" }} className="uppercase font-semibold">Check Size</p>
            <p style={{ fontSize: 32, color: DARK_TEXT, fontWeight: 700 }}>€10K – €30K</p>
          </div>
          <div className="w-px h-12" style={{ background: "hsl(0 0% 100% / 0.15)" }} />
          <div className="text-left">
            <p style={{ fontSize: 18, color: DARK_MUTED, letterSpacing: "0.15em" }} className="uppercase font-semibold">For</p>
            <p style={{ fontSize: 32, color: DARK_TEXT, fontWeight: 700 }}>Operators · Angels · Micro-Funds</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-12 left-0 right-0 text-center" style={{ fontSize: 18, color: DARK_MUTED }}>
        LIZA OS — The Context Layer for AI-Native Organizations
      </div>
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ─── Slide 02 — Traction ─────────────────────────────────────────────────────
function S02Traction() {
  const clients = [
    { icon: Building2, label: "AEC", desc: "Engineering & design firm", color: ACCENT },
    { icon: FlaskConical, label: "Pharma", desc: "Regulated lifecycle ops", color: GREEN },
    { icon: Shield, label: "Cybersecurity", desc: "Audit & compliance", color: GOLD },
    { icon: Briefcase, label: "Consulting", desc: "Professional services", color: "280 60% 50%" },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="Traction · The Core Is Built & Validated" color={GREEN} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 84, color: TEXT, letterSpacing: "-0.02em" }}>
          AACE v3.1 is live. <span style={{ color: `hsl(${GREEN})` }}>Clients are paying.</span>
        </h2>
        <p style={{ fontSize: 28, color: MUTED, maxWidth: 1400 }} className="mb-14">
          Four paid enterprise clients across four industries. The Context Gap thesis is proven, and rework reductions are measurable in days, not percentages.
        </p>

        <div className="grid grid-cols-4 gap-6 mb-14">
          {clients.map((c) => (
            <div key={c.label} className="rounded-2xl p-7"
              style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `hsl(${c.color} / 0.12)`, border: `1px solid hsl(${c.color} / 0.3)` }}>
                <c.icon size={28} style={{ color: `hsl(${c.color})` }} />
              </div>
              <p style={{ fontSize: 30, color: TEXT, fontWeight: 700 }}>{c.label}</p>
              <p style={{ fontSize: 19, color: MUTED, marginTop: 6 }}>{c.desc}</p>
              <div className="mt-5 flex items-center gap-2">
                <CheckCircle2 size={18} style={{ color: `hsl(${GREEN})` }} />
                <span style={{ fontSize: 16, color: `hsl(${GREEN})`, fontWeight: 600 }}>Paid · In production</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-2xl p-8" style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.25)` }}>
            <p style={{ fontSize: 17, color: `hsl(${GREEN})`, fontWeight: 700, letterSpacing: "0.15em" }} className="uppercase mb-3">Audit workflow</p>
            <p style={{ fontSize: 56, color: TEXT, fontWeight: 700, lineHeight: 1 }}>18 days <span style={{ color: MUTED, fontSize: 32 }}>→</span> 1 day</p>
            <p style={{ fontSize: 19, color: MUTED, marginTop: 10 }}>Cycle-time collapse on a live cybersecurity engagement.</p>
          </div>
          <div className="rounded-2xl p-8" style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px solid hsl(${ACCENT} / 0.25)` }}>
            <p style={{ fontSize: 17, color: `hsl(${ACCENT})`, fontWeight: 700, letterSpacing: "0.15em" }} className="uppercase mb-3">Product-market fit</p>
            <p style={{ fontSize: 56, color: TEXT, fontWeight: 700, lineHeight: 1 }}>4 / 4 verticals</p>
            <p style={{ fontSize: 19, color: MUTED, marginTop: 10 }}>Same Context Layer thesis validated across every paid pilot.</p>
          </div>
          <div className="rounded-2xl p-8" style={{ background: `hsl(${GOLD} / 0.08)`, border: `1px solid hsl(${GOLD} / 0.25)` }}>
            <p style={{ fontSize: 17, color: `hsl(${GOLD})`, fontWeight: 700, letterSpacing: "0.15em" }} className="uppercase mb-3">Revenue</p>
            <p style={{ fontSize: 56, color: TEXT, fontWeight: 700, lineHeight: 1 }}>Early ARR</p>
            <p style={{ fontSize: 19, color: MUTED, marginTop: 10 }}>Generating revenue from enterprise pilots — not a research project.</p>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── Slide 03 — Bottleneck ───────────────────────────────────────────────────
function S03Bottleneck() {
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="The Bottleneck · The Problem" color={RED} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 84, color: TEXT, letterSpacing: "-0.02em" }}>
          Demand outruns our <span style={{ color: `hsl(${RED})` }}>manual onboarding.</span>
        </h2>
        <p style={{ fontSize: 28, color: MUTED, maxWidth: 1500 }} className="mb-12">
          Today every new client requires a high-touch Guided Kickstart. The platform works — the adoption motion does not yet scale.
        </p>

        {/* Funnel diagram */}
        <div className="rounded-2xl p-10 mb-10" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <div className="flex items-center justify-between gap-4">
            {/* Wide top */}
            <div className="flex-1 text-center">
              <div className="mx-auto mb-4 rounded-xl flex items-center justify-center"
                style={{ width: "100%", height: 110, background: `hsl(${ACCENT} / 0.1)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
                <Users size={42} style={{ color: `hsl(${ACCENT})` }} />
              </div>
              <p style={{ fontSize: 26, color: TEXT, fontWeight: 700 }}>Inbound demand</p>
              <p style={{ fontSize: 18, color: MUTED, marginTop: 4 }}>Pipeline well above capacity</p>
            </div>
            <ArrowRight size={36} style={{ color: SUBTLE }} />
            {/* Choke */}
            <div className="flex-1 text-center">
              <div className="mx-auto mb-4 rounded-xl flex items-center justify-center"
                style={{ width: "55%", height: 110, background: `hsl(${RED} / 0.08)`, border: `2px solid hsl(${RED} / 0.5)` }}>
                <AlertTriangle size={42} style={{ color: `hsl(${RED})` }} />
              </div>
              <p style={{ fontSize: 26, color: TEXT, fontWeight: 700 }}>Guided Kickstart</p>
              <p style={{ fontSize: 18, color: `hsl(${RED})`, marginTop: 4, fontWeight: 600 }}>The bottleneck — high-touch advisory</p>
            </div>
            <ArrowRight size={36} style={{ color: SUBTLE }} />
            {/* Trickle */}
            <div className="flex-1 text-center">
              <div className="mx-auto mb-4 rounded-xl flex items-center justify-center"
                style={{ width: "32%", height: 110, background: `hsl(${GREEN} / 0.1)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
                <CheckCircle2 size={42} style={{ color: `hsl(${GREEN})` }} />
              </div>
              <p style={{ fontSize: 26, color: TEXT, fontWeight: 700 }}>Live customers</p>
              <p style={{ fontSize: 18, color: MUTED, marginTop: 4 }}>Activated one at a time</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { t: "Manual deployment", d: "Each client needs hands-on configuration of bundles and standards." },
            { t: "Founder-time gated", d: "Kickstarts pull senior team off product and platform work." },
            { t: "Linear, not SaaS", d: "Revenue scales with people, not with software — a classic services trap." },
          ].map(b => (
            <div key={b.t} className="rounded-xl p-6" style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>
              <p style={{ fontSize: 22, color: TEXT, fontWeight: 700 }}>{b.t}</p>
              <p style={{ fontSize: 18, color: MUTED, marginTop: 6 }}>{b.d}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={RED} to={GOLD} />
    </div>
  );
}

// ─── Slide 04 — €200k Unlock ─────────────────────────────────────────────────
function S04Unlock() {
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="The €200K Unlock · The Bridge Solution" color={ACCENT} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 84, color: TEXT, letterSpacing: "-0.02em" }}>
          From Consulting Kickstart to <span style={{ color: `hsl(${ACCENT})` }}>Self-Serve Wizard.</span>
        </h2>
        <p style={{ fontSize: 28, color: MUTED, maxWidth: 1500 }} className="mb-12">
          €200K funds the engineering runway to remove the human bottleneck from our own deployment — a frictionless, AI-native SaaS onboarding flow.
        </p>

        {/* Before / After */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-8 items-stretch mb-10">
          <div className="rounded-2xl p-8" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <p style={{ fontSize: 17, color: MUTED, fontWeight: 700, letterSpacing: "0.15em" }} className="uppercase mb-4">Today</p>
            <p style={{ fontSize: 34, color: TEXT, fontWeight: 700, marginBottom: 18 }}>Guided Kickstart</p>
            {/* Mock UI */}
            <div className="rounded-xl p-5" style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `hsl(${RED})` }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `hsl(${GOLD})` }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `hsl(${GREEN})` }} />
                <span className="ml-2" style={{ fontSize: 14, color: SUBTLE }}>liza · advisory session</span>
              </div>
              {[
                "Workshop: map your context",
                "Manual bundle configuration",
                "Founder review of standards",
                "Hand-off to delivery team",
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: `hsl(${RED} / 0.1)`, color: `hsl(${RED})`, fontSize: 14, fontWeight: 700 }}>{i + 1}</div>
                  <span style={{ fontSize: 19, color: TEXT }}>{l}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: CHROME_BORDER }}>
                <span style={{ fontSize: 16, color: `hsl(${RED})`, fontWeight: 700 }}>~4–6 weeks · founder time</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 px-6 py-8 rounded-2xl"
              style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px dashed hsl(${ACCENT} / 0.4)` }}>
              <Wand2 size={40} style={{ color: `hsl(${ACCENT})` }} />
              <p style={{ fontSize: 22, color: `hsl(${ACCENT})`, fontWeight: 700 }}>€200K</p>
              <p style={{ fontSize: 16, color: MUTED, textAlign: "center", maxWidth: 160 }}>Engineering runway to ship the self-serve flow</p>
            </div>
          </div>

          <div className="rounded-2xl p-8" style={{ background: `hsl(${ACCENT} / 0.05)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
            <p style={{ fontSize: 17, color: `hsl(${ACCENT})`, fontWeight: 700, letterSpacing: "0.15em" }} className="uppercase mb-4">After bridge</p>
            <p style={{ fontSize: 34, color: TEXT, fontWeight: 700, marginBottom: 18 }}>Self-Serve Wizard</p>
            <div className="rounded-xl p-5" style={{ background: BG, border: `1px solid hsl(${ACCENT} / 0.25)` }}>
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} style={{ color: `hsl(${ACCENT})` }} />
                <span style={{ fontSize: 14, color: `hsl(${ACCENT})`, fontWeight: 700 }}>liza · self-serve onboarding</span>
              </div>
              {[
                "Connect your sources",
                "AI proposes your context map",
                "Approve standards in-app",
                "Go live — no humans required",
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})`, fontSize: 14, fontWeight: 700 }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <span style={{ fontSize: 19, color: TEXT }}>{l}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: CHROME_BORDER }}>
                <span style={{ fontSize: 16, color: `hsl(${GREEN})`, fontWeight: 700 }}>Minutes · zero founder time</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { t: "Platform stabilisation", d: "Harden the AACE core for unattended deployment." },
            { t: "Onboarding wizard", d: "AI-native flow that proposes the customer's first Context Layer." },
            { t: "Activation telemetry", d: "Instrument every step to remove friction continuously." },
          ].map(b => (
            <div key={b.t} className="rounded-xl p-6" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <p style={{ fontSize: 22, color: TEXT, fontWeight: 700 }}>{b.t}</p>
              <p style={{ fontSize: 18, color: MUTED, marginTop: 6 }}>{b.d}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ─── Slide 05 — Wedge & Milestone ────────────────────────────────────────────
function S05Wedge() {
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 26, color: `hsl(${GOLD} / 0.9)` }}>
          The Vertical Wedge · The Goal
        </p>
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 84, color: DARK_TEXT, letterSpacing: "-0.02em" }}>
          One arrow. <span style={{ color: `hsl(${GOLD})` }}>One bullseye.</span>
        </h2>
        <p style={{ fontSize: 28, color: DARK_MUTED, maxWidth: 1500 }} className="mb-12">
          The self-serve capability is pointed at one proven, repeatable industry: <span style={{ color: DARK_TEXT, fontWeight: 700 }}>Professional Services / Consulting.</span>
        </p>

        {/* Arrow → Bullseye */}
        <div className="rounded-2xl p-10 mb-10 flex items-center gap-10"
          style={{ background: "hsl(0 0% 100% / 0.04)", border: `1px solid hsl(0 0% 100% / 0.1)` }}>
          <div className="flex-1 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: `hsl(${ACCENT} / 0.15)`, border: `1px solid hsl(${ACCENT} / 0.4)` }}>
              <Rocket size={42} style={{ color: `hsl(${ACCENT})` }} />
            </div>
            <div>
              <p style={{ fontSize: 17, color: DARK_MUTED, letterSpacing: "0.15em" }} className="uppercase font-semibold">Self-Serve Capability</p>
              <p style={{ fontSize: 32, color: DARK_TEXT, fontWeight: 700 }}>The €200K build</p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <ArrowRight size={64} style={{ color: `hsl(${GOLD})` }} />
          </div>

          <div className="flex-1 flex items-center gap-6 justify-end">
            <div>
              <p style={{ fontSize: 17, color: DARK_MUTED, letterSpacing: "0.15em" }} className="uppercase font-semibold text-right">Target Vertical</p>
              <p style={{ fontSize: 32, color: DARK_TEXT, fontWeight: 700 }} className="text-right">Professional Services</p>
            </div>
            <div className="relative w-28 h-28 rounded-full flex items-center justify-center"
              style={{ background: `radial-gradient(circle, hsl(${GOLD} / 0.5) 0%, hsl(${GOLD} / 0.15) 50%, transparent 75%)` }}>
              <div className="absolute inset-3 rounded-full" style={{ border: `2px solid hsl(${GOLD} / 0.5)` }} />
              <div className="absolute inset-7 rounded-full" style={{ border: `2px solid hsl(${GOLD} / 0.7)` }} />
              <Crosshair size={36} style={{ color: `hsl(${GOLD})` }} />
            </div>
          </div>
        </div>

        {/* Milestone */}
        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-2xl p-7" style={{ background: "hsl(0 0% 100% / 0.05)", border: `1px solid hsl(${GREEN} / 0.35)` }}>
            <Target size={28} style={{ color: `hsl(${GREEN})` }} className="mb-4" />
            <p style={{ fontSize: 17, color: `hsl(${GREEN})`, fontWeight: 700, letterSpacing: "0.15em" }} className="uppercase mb-2">Q4 Milestone</p>
            <p style={{ fontSize: 30, color: DARK_TEXT, fontWeight: 700, lineHeight: 1.15 }}>100% self-serve ARR growth in Professional Services</p>
          </div>
          <div className="rounded-2xl p-7" style={{ background: "hsl(0 0% 100% / 0.05)", border: `1px solid hsl(${ACCENT} / 0.35)` }}>
            <TrendingUp size={28} style={{ color: `hsl(${ACCENT})` }} className="mb-4" />
            <p style={{ fontSize: 17, color: `hsl(${ACCENT})`, fontWeight: 700, letterSpacing: "0.15em" }} className="uppercase mb-2">Engine</p>
            <p style={{ fontSize: 30, color: DARK_TEXT, fontWeight: 700, lineHeight: 1.15 }}>Repeatable, hyper-scalable SaaS revenue motion</p>
          </div>
          <div className="rounded-2xl p-7" style={{ background: "hsl(0 0% 100% / 0.05)", border: `1px solid hsl(${GOLD} / 0.4)` }}>
            <Rocket size={28} style={{ color: `hsl(${GOLD})` }} className="mb-4" />
            <p style={{ fontSize: 17, color: `hsl(${GOLD})`, fontWeight: 700, letterSpacing: "0.15em" }} className="uppercase mb-2">Tee-Up</p>
            <p style={{ fontSize: 30, color: DARK_TEXT, fontWeight: 700, lineHeight: 1.15 }}>Premium Seed / Series A markup on proven self-serve metrics</p>
          </div>
        </div>
      </div>
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ─── Slide 06 — Thesis (Context Gap) ─────────────────────────────────────────
function S06Thesis() {
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="The Thesis · Why This Wins" color={ACCENT} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 84, color: TEXT, letterSpacing: "-0.02em" }}>
          Whatever you don't define, <span style={{ color: `hsl(${RED})` }}>AI invents.</span>
        </h2>
        <p style={{ fontSize: 28, color: MUTED, maxWidth: 1500 }} className="mb-12">
          Every enterprise is paying a Context Gap Tax: rework, drift, and silent risk because expertise lives in heads, not in the system. LIZA OS is the Context Layer that closes it.
        </p>

        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { i: AlertTriangle, c: RED, t: "The Tax", d: "€550K+/year per org in hidden rework, retraining, and bad AI output." },
            { i: BookOpen, c: GOLD, t: "The Cause", d: "AI inherits no standards. Generic models guess your judgment, badly." },
            { i: Layers, c: GREEN, t: "The Fix", d: "A Context Layer that turns expertise into executable, governed standards." },
          ].map(b => (
            <div key={b.t} className="rounded-2xl p-7" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `hsl(${b.c} / 0.12)`, border: `1px solid hsl(${b.c} / 0.3)` }}>
                <b.i size={28} style={{ color: `hsl(${b.c})` }} />
              </div>
              <p style={{ fontSize: 28, color: TEXT, fontWeight: 700 }}>{b.t}</p>
              <p style={{ fontSize: 20, color: MUTED, marginTop: 8 }}>{b.d}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8 flex items-center gap-8" style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px solid hsl(${ACCENT} / 0.25)` }}>
          <div style={{ fontSize: 64, fontWeight: 700, color: `hsl(${ACCENT})`, lineHeight: 1 }}>4 / 4</div>
          <p style={{ fontSize: 24, color: TEXT, lineHeight: 1.3, fontWeight: 500 }}>
            Verticals where the same Context Layer pattern produced measurable cycle-time and quality wins. The thesis is no longer a hypothesis.
          </p>
        </div>
      </div>
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ─── Slide 07 — What's Built (Product) ───────────────────────────────────────
function S07Product() {
  const layers = [
    { i: BookOpen, c: ACCENT, t: "Knowledge Capture", d: "Bundles, playbooks, and standards extracted from documents and experts." },
    { i: Cpu, c: GREEN, t: "AACE Reasoning Engine", d: "v3.1 live. Routes every AI action through your codified context and rules." },
    { i: GitBranch, c: GOLD, t: "Governance & Audit", d: "Versioned standards, change history, and full reasoning trail per output." },
    { i: Layers, c: "280 60% 50%", t: "Workbooks & Mandates", d: "Where teams actually run AI work, with context attached by default." },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="What's Built · AACE v3.1" color={GREEN} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 84, color: TEXT, letterSpacing: "-0.02em" }}>
          The platform is <span style={{ color: `hsl(${GREEN})` }}>shipped, not slideware.</span>
        </h2>
        <p style={{ fontSize: 28, color: MUTED, maxWidth: 1500 }} className="mb-12">
          Four layers, in production today, running paid enterprise workloads.
        </p>

        <div className="grid grid-cols-2 gap-6">
          {layers.map(l => (
            <div key={l.t} className="rounded-2xl p-8 flex items-start gap-5" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `hsl(${l.c} / 0.12)`, border: `1px solid hsl(${l.c} / 0.3)` }}>
                <l.i size={32} style={{ color: `hsl(${l.c})` }} />
              </div>
              <div>
                <p style={{ fontSize: 28, color: TEXT, fontWeight: 700 }}>{l.t}</p>
                <p style={{ fontSize: 20, color: MUTED, marginTop: 6 }}>{l.d}</p>
                <div className="mt-4 inline-flex items-center gap-2">
                  <CheckCircle2 size={16} style={{ color: `hsl(${GREEN})` }} />
                  <span style={{ fontSize: 15, color: `hsl(${GREEN})`, fontWeight: 600, letterSpacing: "0.1em" }} className="uppercase">Live in production</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── Slide 08 — Use of Funds ─────────────────────────────────────────────────
function S08UseOfFunds() {
  const lines = [
    { c: ACCENT, pct: 55, label: "Engineering · Self-Serve Wizard + AACE hardening", amt: "€110K" },
    { c: GREEN, pct: 25, label: "Vertical packaging · Professional Services bundles", amt: "€50K" },
    { c: GOLD, pct: 12, label: "Activation telemetry & growth instrumentation", amt: "€24K" },
    { c: "280 60% 50%", pct: 8, label: "Legal, infra, and round-close costs", amt: "€16K" },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="Use of Funds · €200,000" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 84, color: TEXT, letterSpacing: "-0.02em" }}>
          Every euro buys <span style={{ color: `hsl(${GOLD})` }}>self-serve velocity.</span>
        </h2>
        <p style={{ fontSize: 28, color: MUTED, maxWidth: 1500 }} className="mb-12">
          No vanity hires, no marketing burn. Pure engineering and packaging runway to remove the human bottleneck.
        </p>

        {/* Stacked bar */}
        <div className="rounded-2xl p-8 mb-8" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <div className="flex w-full h-16 rounded-xl overflow-hidden mb-8" style={{ border: `1px solid ${CHROME_BORDER}` }}>
            {lines.map(l => (
              <div key={l.label} style={{ width: `${l.pct}%`, background: `hsl(${l.c})` }} className="flex items-center justify-center">
                <span style={{ fontSize: 22, fontWeight: 700, color: "white" }}>{l.pct}%</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-5">
            {lines.map(l => (
              <div key={l.label} className="flex items-start gap-4">
                <div className="w-4 h-4 rounded-sm mt-1.5 shrink-0" style={{ background: `hsl(${l.c})` }} />
                <div className="flex-1">
                  <p style={{ fontSize: 22, color: TEXT, fontWeight: 700 }}>{l.amt} <span style={{ color: MUTED, fontWeight: 500, fontSize: 18 }}>· {l.pct}%</span></p>
                  <p style={{ fontSize: 19, color: MUTED, marginTop: 2 }}>{l.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { i: Clock, t: "6 months", d: "Runway to ship and activate the self-serve flow." },
            { i: Coins, t: "Capital efficient", d: "Bridge spend tied directly to a measurable ARR motion." },
            { i: Target, t: "One vertical", d: "Funds focused on Professional Services, no scope sprawl." },
          ].map(b => (
            <div key={b.t} className="rounded-xl p-6 flex items-start gap-4" style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>
              <b.i size={26} style={{ color: `hsl(${ACCENT})` }} className="mt-1 shrink-0" />
              <div>
                <p style={{ fontSize: 22, color: TEXT, fontWeight: 700 }}>{b.t}</p>
                <p style={{ fontSize: 18, color: MUTED, marginTop: 4 }}>{b.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ─── Slide 09 — Roadmap to Series A ──────────────────────────────────────────
function S09Roadmap() {
  const stages = [
    {
      tag: "Now", c: GOLD, t: "€200K Bridge",
      bullets: ["Ship Self-Serve Wizard", "Harden AACE for unattended deploy", "Instrument activation funnel"],
    },
    {
      tag: "Q4 2026", c: GREEN, t: "Self-Serve ARR",
      bullets: ["100% self-serve growth in Pro Services", "Repeatable activation metrics", "Reference logos at scale"],
    },
    {
      tag: "2027", c: ACCENT, t: "Premium Seed / Series A",
      bullets: ["€2M+ round on proven SaaS metrics", "Expand to second vertical", "Horizontal OS thesis funded"],
    },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="Roadmap · Bridge → Markup" color={ACCENT} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 84, color: TEXT, letterSpacing: "-0.02em" }}>
          A clear path to a <span style={{ color: `hsl(${ACCENT})` }}>premium markup.</span>
        </h2>
        <p style={{ fontSize: 28, color: MUTED, maxWidth: 1500 }} className="mb-12">
          The bridge isn't survival capital. It's the precise spend that converts paid pilots into a financeable SaaS engine.
        </p>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-8 left-[8%] right-[8%] h-0.5" style={{ background: `linear-gradient(90deg, hsl(${GOLD}), hsl(${GREEN}), hsl(${ACCENT}))` }} />
          <div className="grid grid-cols-3 gap-8 relative">
            {stages.map(s => (
              <div key={s.tag} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 z-10"
                  style={{ background: BG, border: `3px solid hsl(${s.c})` }}>
                  <Calendar size={26} style={{ color: `hsl(${s.c})` }} />
                </div>
                <div className="rounded-2xl p-7 w-full" style={{ background: CARD_ALT, border: `1px solid hsl(${s.c} / 0.3)` }}>
                  <p style={{ fontSize: 16, color: `hsl(${s.c})`, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase mb-2">{s.tag}</p>
                  <p style={{ fontSize: 30, color: TEXT, fontWeight: 700, marginBottom: 16 }}>{s.t}</p>
                  <ul className="space-y-3">
                    {s.bullets.map(b => (
                      <li key={b} className="flex items-start gap-3">
                        <CheckCircle2 size={18} style={{ color: `hsl(${s.c})` }} className="mt-1 shrink-0" />
                        <span style={{ fontSize: 19, color: TEXT }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ─── Slide 10 — Team & The Ask ───────────────────────────────────────────────
function S10Ask() {
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 26, color: `hsl(${GOLD} / 0.9)` }}>
          The Team · The Ask
        </p>
        <h2 className="font-bold leading-[1.05] mb-12" style={{ fontSize: 84, color: DARK_TEXT, letterSpacing: "-0.02em" }}>
          €200K. <span style={{ color: `hsl(${GOLD})` }}>SAFE. Closing now.</span>
        </h2>

        <div className="grid grid-cols-[1.1fr_1fr] gap-10">
          {/* Team */}
          <div className="rounded-2xl p-8" style={{ background: "hsl(0 0% 100% / 0.04)", border: `1px solid hsl(0 0% 100% / 0.1)` }}>
            <p style={{ fontSize: 17, color: DARK_MUTED, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase mb-5">Built by operators</p>
            <div className="space-y-5">
              {[
                { n: "István Boscha", r: "Founder & CEO", d: "15+ years building data and AI systems for enterprise. Sold and scaled prior ventures." },
                { n: "Kristóf Éger", r: "Engineering", d: "AACE architect. Shipped v3.1 to four paid enterprise clients across regulated verticals." },
                { n: "Zoltán Kauker", r: "Delivery & Standards", d: "Codifies expert judgment into governed bundles. Runs every paid pilot end-to-end." },
              ].map(p => (
                <div key={p.n} className="flex items-start gap-4 pb-5 last:pb-0 last:border-0 border-b" style={{ borderColor: "hsl(0 0% 100% / 0.06)" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `hsl(${ACCENT} / 0.18)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
                    <Users size={22} style={{ color: `hsl(${ACCENT})` }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 22, color: DARK_TEXT, fontWeight: 700 }}>{p.n} <span style={{ color: `hsl(${GOLD})`, fontSize: 17, fontWeight: 600, marginLeft: 8 }}>{p.r}</span></p>
                    <p style={{ fontSize: 18, color: DARK_MUTED, marginTop: 4 }}>{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The Ask */}
          <div className="rounded-2xl p-8 flex flex-col" style={{ background: `hsl(${GOLD} / 0.08)`, border: `1px solid hsl(${GOLD} / 0.4)` }}>
            <FileSignature size={32} style={{ color: `hsl(${GOLD})` }} className="mb-4" />
            <p style={{ fontSize: 17, color: `hsl(${GOLD})`, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase mb-3">The Ask</p>
            <p style={{ fontSize: 64, color: DARK_TEXT, fontWeight: 700, lineHeight: 1 }}>€200,000</p>
            <p style={{ fontSize: 22, color: DARK_MUTED, marginTop: 8, marginBottom: 24 }}>Bridge round · Self-Serve Capability</p>

            <div className="space-y-3 mb-auto">
              {[
                { k: "Instrument", v: "SAFE, post-money" },
                { k: "Check size", v: "€10K – €30K" },
                { k: "For", v: "Operators, angels, micro-funds" },
                { k: "Close", v: "Rolling, target 6 weeks" },
              ].map(r => (
                <div key={r.k} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: "hsl(0 0% 100% / 0.08)" }}>
                  <span style={{ fontSize: 18, color: DARK_MUTED }}>{r.k}</span>
                  <span style={{ fontSize: 20, color: DARK_TEXT, fontWeight: 700 }}>{r.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl p-5" style={{ background: "hsl(0 0% 100% / 0.05)", border: `1px solid hsl(0 0% 100% / 0.1)` }}>
              <p style={{ fontSize: 18, color: DARK_TEXT, fontWeight: 600 }}>What you back</p>
              <p style={{ fontSize: 17, color: DARK_MUTED, marginTop: 4, lineHeight: 1.4 }}>
                A shipped product, four paid clients, and the precise spend that converts manual onboarding into a financeable SaaS engine.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────
const SLIDES = [
  { id: "cover", title: "Cover", component: <S01Cover /> },
  { id: "thesis", title: "Thesis", component: <S06Thesis /> },
  { id: "traction", title: "Traction", component: <S02Traction /> },
  { id: "product", title: "What's Built", component: <S07Product /> },
  { id: "bottleneck", title: "Bottleneck", component: <S03Bottleneck /> },
  { id: "unlock", title: "€200K Unlock", component: <S04Unlock /> },
  { id: "wedge", title: "Wedge & Milestone", component: <S05Wedge /> },
  { id: "funds", title: "Use of Funds", component: <S08UseOfFunds /> },
  { id: "roadmap", title: "Roadmap", component: <S09Roadmap /> },
  { id: "ask", title: "Team & The Ask", component: <S10Ask /> },
];

// ─── Deck shell ──────────────────────────────────────────────────────────────
export default function BridgeDeck() {
  const [current, setCurrent] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const exportRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobileViewport();
  const isPortrait = useIsPortrait();

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, SLIDES.length - 1)), []);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);
  const goTo = useCallback((i: number) => { setCurrent(i); setShowGrid(false); }, []);

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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Bridge-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${GOLD})` }} />
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS — €200K Bridge Deck</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GOLD} / 0.12)`, color: `hsl(${GOLD})` }}>
            Bridge · {SLIDES.length} slides
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Bridge-Deck" slideCount={SLIDES.length} variant="desktop" />
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
                      background: i === current ? `hsl(${GOLD})` : CHROME_BORDER,
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
