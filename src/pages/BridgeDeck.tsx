import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import {
  CheckCircle2, AlertTriangle, Zap, Target, TrendingUp,
  Building2, FlaskConical, Shield, Briefcase, ArrowRight,
  Users, Wand2, Rocket, Crosshair, ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  Layers, Cpu, GitBranch, Calendar, Coins, FileSignature, Clock, BookOpen, Brain,
  Globe, Sparkles, Hammer, LineChart, User, UsersRound, Network,
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
const PURPLE = "280 60% 50%";
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
function DarkTag({ label, color = GOLD }: { label: string; color?: string }) {
  return <p className="font-semibold tracking-[0.3em] uppercase mb-6" style={{ fontSize: 24, color: `hsl(${color} / 0.95)` }}>{label}</p>;
}
function FooterBridge({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <div className="absolute left-28 right-28 bottom-7 flex items-center gap-3"
      style={{ color: dark ? DARK_MUTED : SUBTLE, fontSize: 16, letterSpacing: "0.02em" }}>
      <span style={{ width: 32, height: 1, background: dark ? "hsl(0 0% 100% / 0.2)" : CHROME_BORDER }} />
      <span>{text}</span>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 01 — COVER
// ═════════════════════════════════════════════════════════════════════════════
function S01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 text-center px-32">
        <p className="font-semibold tracking-[0.3em] uppercase mb-10" style={{ fontSize: 24, color: `hsl(${GOLD})` }}>
          €200K Bridge Round · Confidential
        </p>
        <h1 className="font-bold leading-[1.02] mb-10" style={{ fontSize: 132, color: DARK_TEXT, letterSpacing: "-0.03em" }}>
          €200K. 6 weeks.
        </h1>
        <p className="leading-[1.2] mb-14" style={{ fontSize: 56, color: `hsl(${ACCENT} / 0.95)`, fontWeight: 500 }}>
          The bridge to self-serve.
        </p>
        <p className="mx-auto mb-14" style={{ fontSize: 26, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.4 }}>
          Funding the engineering runway that turns four paid design partnerships into a self-serve SaaS engine.
        </p>
        <div className="inline-flex items-center gap-8 px-10 py-5 rounded-2xl"
          style={{ background: "hsl(0 0% 100% / 0.05)", border: `1px solid hsl(0 0% 100% / 0.12)` }}>
          {[
            { k: "Round size", v: "€200,000" },
            { k: "Check size", v: "€10K to €30K" },
            { k: "Close window", v: "6 weeks, rolling" },
            { k: "For", v: "Operators · Angels · Micro-funds" },
          ].map((x, i, arr) => (
            <div key={x.k} className="flex items-center gap-8">
              <div className="text-left">
                <p style={{ fontSize: 16, color: DARK_MUTED, letterSpacing: "0.15em" }} className="uppercase font-semibold">{x.k}</p>
                <p style={{ fontSize: 28, color: DARK_TEXT, fontWeight: 700 }}>{x.v}</p>
              </div>
              {i < arr.length - 1 && <div className="w-px h-12" style={{ background: "hsl(0 0% 100% / 0.15)" }} />}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-12 left-0 right-0 text-center" style={{ fontSize: 18, color: DARK_MUTED }}>
        LIZA OS · The Context Layer for AI-Native Organizations
      </div>
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 02 — THE MOMENT (market · company · capital)
// ═════════════════════════════════════════════════════════════════════════════
function S02Moment() {
  const sideCols = [
    {
      icon: Globe, c: ACCENT, label: "Market moment",
      head: "AI inherits no standards.",
      body: "Drop AI into a company and it inherits no expertise, no memory of how work is done, no link to decisions. Generic models guess. Nobody owns the layer that defines the standards. That is the next platform shift.",
    },
    {
      icon: Coins, c: GOLD, label: "Capital moment",
      head: "Cheapest entry we will offer.",
      body: "€200K bridges paid pilots to a financeable Seed. First-mover SAFE terms. Not raised again at this price.",
    },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="The Moment" color={ACCENT} />
        <h2 className="font-bold leading-[1.05] mb-8" style={{ fontSize: 80, color: TEXT, letterSpacing: "-0.02em" }}>
          Three windows are <span style={{ color: `hsl(${GOLD})` }}>open at the same time.</span>
        </h2>
        <div className="grid grid-cols-[1fr_1.5fr] gap-7 mt-10 items-stretch">
          {/* Featured: Company moment = LIZA today */}
          <div className="rounded-2xl p-9 flex flex-col col-start-2 row-span-2"
            style={{ background: `hsl(${GREEN} / 0.06)`, border: `2px solid hsl(${GREEN} / 0.4)` }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ background: `hsl(${GREEN} / 0.14)`, border: `1px solid hsl(${GREEN} / 0.4)` }}>
                <Sparkles size={34} style={{ color: `hsl(${GREEN})` }} />
              </div>
              <p style={{ fontSize: 18, color: `hsl(${GREEN})`, fontWeight: 800, letterSpacing: "0.22em" }} className="uppercase">Company moment · LIZA today</p>
            </div>
            <p style={{ fontSize: 44, color: TEXT, fontWeight: 800, lineHeight: 1.1, marginBottom: 18 }}>
              The engine works. Self-serve is the unlock.
            </p>
            <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.5, marginBottom: 18 }}>
              LIZA is the Context Layer for AI-native organizations. We capture expert know-how, govern it as versioned standards, and run every AI action through that context with full audit. The full loop is live in <span style={{ color: TEXT, fontWeight: 700 }}>four paid partnerships across four industries</span>: Consulting, AEC, Pharma, Cybersecurity.
            </p>
            <p style={{ fontSize: 22, color: TEXT, fontWeight: 600, lineHeight: 1.4 }}>
              What's missing: the self-serve flow that lets the next 100 customers start without us in the room.
            </p>
          </div>

          {sideCols.map(c => (
            <div key={c.label} className="rounded-2xl p-7 flex flex-col col-start-1"
              style={{ background: CARD_ALT, border: `1px solid hsl(${c.c} / 0.25)` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `hsl(${c.c} / 0.12)`, border: `1px solid hsl(${c.c} / 0.3)` }}>
                <c.icon size={24} style={{ color: `hsl(${c.c})` }} />
              </div>
              <p style={{ fontSize: 14, color: `hsl(${c.c})`, fontWeight: 700, letterSpacing: "0.2em" }} className="uppercase mb-2">{c.label}</p>
              <p style={{ fontSize: 26, color: TEXT, fontWeight: 700, lineHeight: 1.15, marginBottom: 10 }}>{c.head}</p>
              <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.45 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
      <FooterBridge text="Next: the proof. Same loop, four industries, paying." />
      <SlideBar from={ACCENT} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 03 — PROOF (Knowledge Cycle, 4/4)
// ═════════════════════════════════════════════════════════════════════════════
function S03Proof() {
  const stages = [
    { i: BookOpen, c: ACCENT, t: "Capture", d: "Pull expert know-how out of docs, calls, and people's heads." },
    { i: Shield, c: GREEN, t: "Govern", d: "Turn it into versioned, owned standards the org can trust." },
    { i: Zap, c: GOLD, t: "Execute", d: "Run AI work through those standards, with sources cited." },
    { i: TrendingUp, c: PURPLE, t: "Evolve", d: "Feedback from real use updates the standards. Loop closes." },
  ];
  const industries = [
    { i: Briefcase, c: PURPLE, t: "Consulting", d: "Engagement methodology" },
    { i: Building2, c: ACCENT, t: "AEC", d: "Architecture, Engineering & Construction" },
    { i: FlaskConical, c: GREEN, t: "Pharma", d: "Regulated lifecycle" },
    { i: Shield, c: GOLD, t: "Cybersecurity", d: "Audit & compliance" },
  ];
  return (
    <div className="w-full h-full relative px-28 py-16" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="Proof" color={GREEN} />
        <h2 className="font-bold leading-[1.05] mb-7" style={{ fontSize: 72, color: TEXT, letterSpacing: "-0.02em" }}>
          Here's how this all works. <span style={{ color: `hsl(${GREEN})` }}>One loop, four paid partnerships.</span>
        </h2>

        {/* The cycle diagram */}
        <div className="rounded-2xl p-7 mb-6" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <div className="flex items-center justify-between gap-2">
            {stages.map((s, idx) => (
              <div key={s.t} className="flex items-center gap-3 flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: `hsl(${s.c} / 0.12)`, border: `2px solid hsl(${s.c} / 0.4)` }}>
                    <s.i size={36} style={{ color: `hsl(${s.c})` }} />
                  </div>
                  <p style={{ fontSize: 14, color: SUBTLE, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase">Step {idx + 1}</p>
                  <p style={{ fontSize: 26, color: TEXT, fontWeight: 700 }}>{s.t}</p>
                  <p style={{ fontSize: 15, color: MUTED, marginTop: 6, lineHeight: 1.35, maxWidth: 220 }}>{s.d}</p>
                </div>
                {idx < stages.length - 1 && <ArrowRight size={28} style={{ color: SUBTLE }} className="shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Industries + metrics */}
        <div className="grid grid-cols-[1.4fr_1fr] gap-6">
          <div>
            <p style={{ fontSize: 16, color: SUBTLE, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase mb-4">Loop ran end-to-end in</p>
            <div className="grid grid-cols-2 gap-4">
              {industries.map(ind => (
                <div key={ind.t} className="rounded-xl p-5 flex items-center gap-4"
                  style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `hsl(${ind.c} / 0.12)`, border: `1px solid hsl(${ind.c} / 0.3)` }}>
                    <ind.i size={22} style={{ color: `hsl(${ind.c})` }} />
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize: 22, color: TEXT, fontWeight: 700 }}>{ind.t}</p>
                    <p style={{ fontSize: 16, color: MUTED }}>{ind.d}</p>
                  </div>
                  <CheckCircle2 size={22} style={{ color: `hsl(${GREEN})` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-xl p-4" style={{ background: `hsl(${GREEN} / 0.08)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
              <p style={{ fontSize: 13, color: `hsl(${GREEN})`, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase mb-1">Cycle-time win</p>
              <p style={{ fontSize: 32, color: TEXT, fontWeight: 700, lineHeight: 1 }}>18 days <span style={{ color: MUTED, fontSize: 22 }}>→</span> 1 day</p>
              <p style={{ fontSize: 15, color: MUTED, marginTop: 3 }}>Live cybersecurity partnership.</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px solid hsl(${ACCENT} / 0.25)` }}>
              <p style={{ fontSize: 13, color: `hsl(${ACCENT})`, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase mb-1">Pattern fit</p>
              <p style={{ fontSize: 32, color: TEXT, fontWeight: 700, lineHeight: 1 }}>4 / 4 industries</p>
              <p style={{ fontSize: 15, color: MUTED, marginTop: 3 }}>Same loop, repeatable.</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: `hsl(${GOLD} / 0.08)`, border: `1px solid hsl(${GOLD} / 0.25)` }}>
              <p style={{ fontSize: 13, color: `hsl(${GOLD})`, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase mb-1">Revenue</p>
              <p style={{ fontSize: 32, color: TEXT, fontWeight: 700, lineHeight: 1 }}>Early ARR</p>
              <p style={{ fontSize: 15, color: MUTED, marginTop: 3 }}>Paid, not pilot-ware.</p>
            </div>
          </div>
        </div>
      </div>
      <FooterBridge text="Next: what we already shipped to make this loop run." />
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 04 — WHAT WE BUILT (core infra + native UIs, plain English)
// ═════════════════════════════════════════════════════════════════════════════
function S04Built() {
  const layers = [
    {
      i: BookOpen, c: ACCENT, t: "Knowledge Capture",
      d: "Bundles, playbooks, and standards extracted from documents and experts.",
      mock: ["📥  Source: process-handbook.pdf", "Detected: 12 playbooks · 38 standards", "Reviewed by Zoltán · Approved"],
    },
    {
      i: Cpu, c: GREEN, t: "Reasoning Engine",
      d: "Every AI action runs through your codified context and rules.",
      mock: ["AI request · audit-prep.workbook", "Context loaded: 4 bundles · 12 standards", "Output cited 7 standards · 0 drift"],
    },
    {
      i: GitBranch, c: GOLD, t: "Governance & Audit",
      d: "Versioned standards, change history, full reasoning trail per output.",
      mock: ["Standard v3 · pricing-rules", "Diff: +2 lines, minus 1 line · approved", "32 outputs re-run on new version"],
    },
    {
      i: Layers, c: PURPLE, t: "Workbooks & Mandates",
      d: "Where teams actually run AI work, with context attached by default.",
      mock: ["Workbook: Q4-audit-engagement", "Mandate: 'follow ISO 20700'", "3 teammates · context auto-loaded"],
    },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="What we built" color={GREEN} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 80, color: TEXT, letterSpacing: "-0.02em" }}>
          The engine works. <span style={{ color: `hsl(${GREEN})` }}>You can use it today.</span>
        </h2>
        <p style={{ fontSize: 26, color: MUTED, maxWidth: 1500 }} className="mb-12">
          Four core layers, each with a native UI on top. Live with paying partners. The engine is not the bottleneck.
        </p>

        <div className="grid grid-cols-2 gap-6">
          {layers.map(l => (
            <div key={l.t} className="rounded-2xl p-7 flex gap-5"
              style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `hsl(${l.c} / 0.12)`, border: `1px solid hsl(${l.c} / 0.3)` }}>
                <l.i size={28} style={{ color: `hsl(${l.c})` }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 26, color: TEXT, fontWeight: 700 }}>{l.t}</p>
                <p style={{ fontSize: 17, color: MUTED, marginTop: 4, lineHeight: 1.4 }}>{l.d}</p>
                {/* mini mock UI */}
                <div className="rounded-lg p-3 mt-4" style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${RED})` }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${GOLD})` }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${GREEN})` }} />
                  </div>
                  {l.mock.map((m, i) => (
                    <p key={i} style={{ fontSize: 14, color: i === l.mock.length - 1 ? `hsl(${l.c})` : TEXT, fontFamily: "ui-monospace, monospace", lineHeight: 1.6 }}>
                      {m}
                    </p>
                  ))}
                </div>
                <div className="mt-3 inline-flex items-center gap-2">
                  <CheckCircle2 size={14} style={{ color: `hsl(${GREEN})` }} />
                  <span style={{ fontSize: 13, color: `hsl(${GREEN})`, fontWeight: 700, letterSpacing: "0.15em" }} className="uppercase">Live with paid partners</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterBridge text="Next: why the engine alone is not yet a SaaS." />
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 05 — THE GAP (bottleneck funnel)
// ═════════════════════════════════════════════════════════════════════════════
function S05Gap() {
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="The gap to scale" color={RED} />
        <h2 className="font-bold leading-[1.05] mb-10" style={{ fontSize: 80, color: TEXT, letterSpacing: "-0.02em" }}>
          Onboarding still <span style={{ color: `hsl(${RED})` }}>needs us in the room.</span>
        </h2>

        <div className="rounded-2xl p-10 mb-8" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <div className="mx-auto mb-4 rounded-xl flex items-center justify-center"
                style={{ width: "100%", height: 110, background: `hsl(${ACCENT} / 0.1)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
                <Layers size={42} style={{ color: `hsl(${ACCENT})` }} />
              </div>
              <p style={{ fontSize: 24, color: TEXT, fontWeight: 700 }}>Complex deployment</p>
              <p style={{ fontSize: 17, color: MUTED, marginTop: 4 }}>Standing up AI-native infrastructure inside a real org. Genuinely hard. The engine handles it.</p>
            </div>
            <ArrowRight size={36} style={{ color: SUBTLE }} />
            <div className="flex-1 text-center">
              <div className="mx-auto mb-4 rounded-xl flex items-center justify-center"
                style={{ width: "55%", height: 110, background: `hsl(${RED} / 0.08)`, border: `2px solid hsl(${RED} / 0.5)` }}>
                <AlertTriangle size={42} style={{ color: `hsl(${RED})` }} />
              </div>
              <p style={{ fontSize: 24, color: TEXT, fontWeight: 700 }}>Guided Kickstart</p>
              <p style={{ fontSize: 17, color: `hsl(${RED})`, marginTop: 4, fontWeight: 600 }}>A founder still has to walk every customer in. The only step that does not scale.</p>
            </div>
            <ArrowRight size={36} style={{ color: SUBTLE }} />
            <div className="flex-1 text-center">
              <div className="mx-auto mb-4 rounded-xl flex items-center justify-center"
                style={{ width: "32%", height: 110, background: `hsl(${GREEN} / 0.1)`, border: `1px solid hsl(${GREEN} / 0.3)` }}>
                <CheckCircle2 size={42} style={{ color: `hsl(${GREEN})` }} />
              </div>
              <p style={{ fontSize: 24, color: TEXT, fontWeight: 700 }}>Live customers</p>
              <p style={{ fontSize: 17, color: MUTED, marginTop: 4 }}>Paying, using, expanding. But activated one at a time, not as a funnel.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { i: Hammer, t: "Manual deployment", d: "Every customer is configured by hand. Bundles, standards, workspaces, all set up in the room with the team. Repeatable, not yet packaged." },
            { i: Calendar, t: "Founder-time gated", d: "Each kickstart pulls a founder out of building. The number of customers we add per month is capped by our calendar, not by demand." },
            { i: User, t: "No smallest unit", d: "Today's flow assumes a full org rollout. There is no one-person, one-playbook entry point that one team can self-serve and grow from." },
          ].map(b => (
            <div key={b.t} className="rounded-2xl p-7" style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `hsl(${RED} / 0.08)`, border: `1px solid hsl(${RED} / 0.3)` }}>
                <b.i size={26} style={{ color: `hsl(${RED})` }} />
              </div>
              <p style={{ fontSize: 26, color: TEXT, fontWeight: 700 }}>{b.t}</p>
              <p style={{ fontSize: 19, color: MUTED, marginTop: 8, lineHeight: 1.45 }}>{b.d}</p>
            </div>
          ))}
        </div>

        {/* Bottleneck visual: today vs after bridge */}
        <div className="rounded-2xl p-7 flex items-center gap-8"
          style={{ background: `hsl(${GOLD} / 0.06)`, border: `1px solid hsl(${GOLD} / 0.3)` }}>
          <div className="flex items-center gap-4">
            <Calendar size={42} style={{ color: `hsl(${RED})` }} />
            <div>
              <p style={{ fontSize: 14, color: `hsl(${RED})`, fontWeight: 700, letterSpacing: "0.2em" }} className="uppercase">Today</p>
              <p style={{ fontSize: 26, color: TEXT, fontWeight: 700 }}>~2 customers / month</p>
              <p style={{ fontSize: 16, color: MUTED }}>Capped by founder calendar.</p>
            </div>
          </div>
          <ArrowRight size={36} style={{ color: SUBTLE }} className="shrink-0" />
          <div className="flex items-center gap-4">
            <Rocket size={42} style={{ color: `hsl(${GREEN})` }} />
            <div>
              <p style={{ fontSize: 14, color: `hsl(${GREEN})`, fontWeight: 700, letterSpacing: "0.2em" }} className="uppercase">After the bridge</p>
              <p style={{ fontSize: 26, color: TEXT, fontWeight: 700 }}>n customers / month</p>
              <p style={{ fontSize: 16, color: MUTED }}>Wizard, telemetry, no founder required.</p>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p style={{ fontSize: 14, color: SUBTLE, fontWeight: 700, letterSpacing: "0.2em" }} className="uppercase">Bottleneck</p>
            <p style={{ fontSize: 22, color: TEXT, fontWeight: 700, lineHeight: 1.2, maxWidth: 360 }}>One linear, founder-gated step between us and a real funnel.</p>
          </div>
        </div>
      </div>
      <FooterBridge text="Next: exactly what €200K removes from this picture." />
      <SlideBar from={RED} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 06 — THE €200K UNLOCK
// ═════════════════════════════════════════════════════════════════════════════
function S06Unlock() {
  return (
    <div className="w-full h-full relative px-28 py-16" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="The €200K Unlock" color={ACCENT} />
        <h2 className="font-bold leading-[1.05] mb-5" style={{ fontSize: 76, color: TEXT, letterSpacing: "-0.02em" }}>
          Core infrastructure works. <span style={{ color: `hsl(${ACCENT})` }}>Now ship self-serve.</span>
        </h2>
        <p style={{ fontSize: 24, color: MUTED, maxWidth: 1600 }} className="mb-9">
          €200K buys the wizard, the workspace flow, and the activation telemetry that lets a single team launch a playbook on day one and grow from there.
        </p>

        {/* Before / After + smallest unit ladder */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-stretch mb-7">
          <div className="rounded-2xl p-6" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
            <p style={{ fontSize: 15, color: MUTED, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase mb-3">Today</p>
            <p style={{ fontSize: 28, color: TEXT, fontWeight: 700, marginBottom: 14 }}>Guided Kickstart</p>
            <div className="rounded-xl p-4" style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${RED})` }} />
                <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${GOLD})` }} />
                <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${GREEN})` }} />
                <span className="ml-2" style={{ fontSize: 13, color: SUBTLE }}>liza · advisory session</span>
              </div>
              {["Workshop: map the context", "Manual bundle configuration", "Founder review of standards", "Hand-off to delivery team"].map((l, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `hsl(${RED} / 0.1)`, color: `hsl(${RED})`, fontSize: 13, fontWeight: 700 }}>{i + 1}</div>
                  <span style={{ fontSize: 17, color: TEXT }}>{l}</span>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t" style={{ borderColor: CHROME_BORDER }}>
                <span style={{ fontSize: 15, color: `hsl(${RED})`, fontWeight: 700 }}>4 to 6 weeks · founder time</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 px-5 py-7 rounded-2xl"
              style={{ background: `hsl(${ACCENT} / 0.06)`, border: `1px dashed hsl(${ACCENT} / 0.4)` }}>
              <Wand2 size={36} style={{ color: `hsl(${ACCENT})` }} />
              <p style={{ fontSize: 20, color: `hsl(${ACCENT})`, fontWeight: 700 }}>€200K</p>
              <p style={{ fontSize: 14, color: MUTED, textAlign: "center", maxWidth: 140 }}>Engineering runway to ship the self-serve flow</p>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: `hsl(${ACCENT} / 0.05)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
            <p style={{ fontSize: 15, color: `hsl(${ACCENT})`, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase mb-3">After bridge</p>
            <p style={{ fontSize: 28, color: TEXT, fontWeight: 700, marginBottom: 14 }}>Self-Serve Wizard</p>
            <div className="rounded-xl p-4" style={{ background: BG, border: `1px solid hsl(${ACCENT} / 0.25)` }}>
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} style={{ color: `hsl(${ACCENT})` }} />
                <span style={{ fontSize: 13, color: `hsl(${ACCENT})`, fontWeight: 700 }}>liza · self-serve onboarding</span>
              </div>
              {["Connect your sources", "AI proposes your context map", "Approve standards in-app", "Launch your first playbook"].map((l, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})` }}>
                    <CheckCircle2 size={14} />
                  </div>
                  <span style={{ fontSize: 17, color: TEXT }}>{l}</span>
                </div>
              ))}
              <div className="mt-3 pt-3 border-t" style={{ borderColor: CHROME_BORDER }}>
                <span style={{ fontSize: 15, color: `hsl(${GREEN})`, fontWeight: 700 }}>Minutes · zero founder time</span>
              </div>
            </div>
          </div>
        </div>

        {/* Smallest unit ladder */}
        <div className="rounded-2xl p-5" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <p style={{ fontSize: 14, color: SUBTLE, fontWeight: 700, letterSpacing: "0.2em" }} className="uppercase mb-3">Land small, grow naturally</p>
          <div className="flex items-center gap-3">
            {[
              { i: User, t: "1 person" },
              { i: BookOpen, t: "1 playbook" },
              { i: UsersRound, t: "1 team" },
              { i: Network, t: "1 org" },
            ].map((s, idx, arr) => (
              <div key={s.t} className="flex items-center gap-3 flex-1">
                <div className="flex-1 flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: BG, border: `1px solid ${CHROME_BORDER}` }}>
                  <s.i size={22} style={{ color: `hsl(${ACCENT})` }} />
                  <span style={{ fontSize: 18, color: TEXT, fontWeight: 600 }}>{s.t}</span>
                </div>
                {idx < arr.length - 1 && <ArrowRight size={20} style={{ color: SUBTLE }} className="shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterBridge text="Next: where every euro actually goes." />
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 07 — USE OF FUNDS (with people on it)
// ═════════════════════════════════════════════════════════════════════════════
function S07Funds() {
  const lines = [
    { c: ACCENT, pct: 40, label: "Engineering salary · ship self-serve wizard", amt: "€80K" },
    { c: GREEN, pct: 25, label: "Go-to-market · early sales, design partner outreach, demand gen", amt: "€50K" },
    { c: GOLD, pct: 18, label: "Vertical packaging · AEC, Pharma, Cyber, Consulting", amt: "€36K" },
    { c: PURPLE, pct: 10, label: "Activation telemetry · funnel instrumentation", amt: "€20K" },
    { c: RED, pct: 7, label: "Legal, infra, round-close costs", amt: "€14K" },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="Use of Funds" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 80, color: TEXT, letterSpacing: "-0.02em" }}>
          Every euro buys <span style={{ color: `hsl(${GOLD})` }}>self-serve velocity.</span>
        </h2>
        <p style={{ fontSize: 26, color: MUTED, maxWidth: 1600 }} className="mb-10">
          No vanity hires. Four engineers keep shipping the self-serve wizard, an early go-to-market motion fills the funnel, and every line is tied to a measurable activation milestone.
        </p>

        {/* Stacked bar */}
        <div className="rounded-2xl p-7 mb-8" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
          <div className="flex w-full h-14 rounded-xl overflow-hidden mb-7" style={{ border: `1px solid ${CHROME_BORDER}` }}>
            {lines.map(l => (
              <div key={l.label} style={{ width: `${l.pct}%`, background: `hsl(${l.c})` }} className="flex items-center justify-center">
                <span style={{ fontSize: 20, fontWeight: 700, color: "white" }}>{l.pct}%</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-x-10 gap-y-4">
            {lines.map(l => (
              <div key={l.label} className="flex items-start gap-4">
                <div className="w-4 h-4 rounded-sm mt-1.5 shrink-0" style={{ background: `hsl(${l.c})` }} />
                <div className="flex-1">
                  <p style={{ fontSize: 22, color: TEXT, fontWeight: 700 }}>{l.amt} <span style={{ color: MUTED, fontWeight: 500, fontSize: 18 }}>· {l.pct}%</span></p>
                  <p style={{ fontSize: 18, color: MUTED, marginTop: 2 }}>{l.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { i: Clock, t: "6 months runway", d: "From close to Seed-ready metrics. No salary cliff in the middle." },
            { i: Users, t: "Early go-to-market", d: "Sales motion and design partner outreach funded for the bridge window." },
            { i: Hammer, t: "Four engineers shipping", d: "Salaried, not contracted. Self-serve wizard from day one of close." },
          ].map(b => (
            <div key={b.t} className="rounded-xl p-6 flex items-start gap-4" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
              <b.i size={26} style={{ color: `hsl(${ACCENT})` }} className="mt-1 shrink-0" />
              <div>
                <p style={{ fontSize: 22, color: TEXT, fontWeight: 700 }}>{b.t}</p>
                <p style={{ fontSize: 17, color: MUTED, marginTop: 4 }}>{b.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterBridge text="Next: the 6-month plan that turns this spend into Seed metrics." />
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 08 — ROADMAP TO MARKUP (Bridge → Seed → A)
// ═════════════════════════════════════════════════════════════════════════════
function S10Roadmap() {
  const stages = [
    { tag: "Now · €200K Bridge", c: GOLD, t: "Ship self-serve", val: "Today's price",
      bullets: ["Wizard, telemetry, hardening", "Founders + 4 engineers", "Bridge to Seed metrics"] },
    { tag: "Q4 2026 · Self-Serve ARR", c: GREEN, t: "Paid self-serve cohort", val: "Implied step-up",
      bullets: ["Paid teams via wizard", "Activation metrics live", "Reference logos at scale"] },
    { tag: "2027 · Seed / Series A", c: ACCENT, t: "Premium markup", val: "Seed-priced",
      bullets: ["Priced on real self-serve traction", "Expand the OS across verticals", "Horizontal Context Layer thesis funded"] },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10">
        <Tag label="Path to markup" color={ACCENT} />
        <h2 className="font-bold leading-[1.05] mb-6" style={{ fontSize: 80, color: TEXT, letterSpacing: "-0.02em" }}>
          A clear path to a <span style={{ color: `hsl(${ACCENT})` }}>premium markup.</span>
        </h2>
        <p style={{ fontSize: 26, color: MUTED, maxWidth: 1600 }} className="mb-12">
          The bridge is not survival capital. It is the precise spend that converts paid pilots into a financeable SaaS engine, on a clear price step-up.
        </p>

        <div className="relative">
          <div className="absolute top-8 left-[8%] right-[8%] h-0.5"
            style={{ background: `linear-gradient(90deg, hsl(${GOLD}), hsl(${GREEN}), hsl(${ACCENT}))` }} />
          <div className="grid grid-cols-3 gap-8 relative">
            {stages.map((s, idx) => (
              <div key={s.tag} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 z-10"
                  style={{ background: BG, border: `3px solid hsl(${s.c})` }}>
                  <Calendar size={26} style={{ color: `hsl(${s.c})` }} />
                </div>
                <div className="rounded-2xl p-7 w-full" style={{ background: CARD_ALT, border: `1px solid hsl(${s.c} / 0.3)` }}>
                  <p style={{ fontSize: 14, color: `hsl(${s.c})`, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase mb-2">{s.tag}</p>
                  <p style={{ fontSize: 28, color: TEXT, fontWeight: 700, marginBottom: 6 }}>{s.t}</p>
                  <p style={{ fontSize: 16, color: `hsl(${s.c})`, fontWeight: 700, marginBottom: 14 }}>{s.val}</p>
                  <ul className="space-y-3">
                    {s.bullets.map(b => (
                      <li key={b} className="flex items-start gap-3">
                        <CheckCircle2 size={18} style={{ color: `hsl(${s.c})` }} className="mt-1 shrink-0" />
                        <span style={{ fontSize: 18, color: TEXT }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {idx < stages.length - 1 && (
                  <div className="absolute" style={{
                    top: 24, left: `${(idx + 1) * 33.33 - 4}%`,
                    transform: "translateX(-50%)",
                  }}>
                    <ArrowRight size={28} style={{ color: SUBTLE }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-2xl p-6 flex items-center gap-5"
          style={{ background: `hsl(${GOLD} / 0.06)`, border: `1px solid hsl(${GOLD} / 0.3)` }}>
          <TrendingUp size={28} style={{ color: `hsl(${GOLD})` }} />
          <p style={{ fontSize: 22, color: TEXT, fontWeight: 600, lineHeight: 1.35 }}>
            <span style={{ fontWeight: 800 }}>Bridge investors are first in line</span>
            <span style={{ color: MUTED, fontWeight: 500 }}> at SAFE terms that reprice on the next round. The markup math works on a single Seed step-up.</span>
          </p>
        </div>
      </div>
      <FooterBridge text="Next: the team shipping it." />
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — TEAM
// ═════════════════════════════════════════════════════════════════════════════
function S11Team() {
  const team = [
    {
      n: "István Boscha", r: "Founder & CEO",
      role: "Closes paid partnerships",
      d: "15+ years building data and AI systems for enterprise. Sold and scaled prior ventures. Owns the partner conversations and the round.",
    },
    {
      n: "Kristóf Éger", r: "Engineering",
      role: "Ships the engine",
      d: "Architect of the platform. Shipped the four core layers to four paid partnerships across regulated verticals.",
    },
    {
      n: "Zoltán Kauker", r: "Delivery & Standards",
      role: "Codifies what customers pay for",
      d: "Turns expert judgment into governed bundles. Runs every paid pilot end-to-end. Same hands will package the wizard.",
    },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10">
        <DarkTag label="Team" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-4" style={{ fontSize: 80, color: DARK_TEXT, letterSpacing: "-0.02em" }}>
          Same team that built the proof <span style={{ color: `hsl(${GOLD})` }}>will ship the self-serve.</span>
        </h2>
        <p style={{ fontSize: 26, color: DARK_MUTED, maxWidth: 1600 }} className="mb-10">
          No new hires required. The people who designed and shipped the engine are the people activating self-serve.
        </p>

        <div className="grid grid-cols-3 gap-6">
          {team.map(p => (
            <div key={p.n} className="rounded-2xl p-7 flex flex-col"
              style={{ background: "hsl(0 0% 100% / 0.04)", border: `1px solid hsl(0 0% 100% / 0.1)` }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                style={{ background: `hsl(${ACCENT} / 0.18)`, border: `1px solid hsl(${ACCENT} / 0.35)` }}>
                <Users size={28} style={{ color: `hsl(${ACCENT})` }} />
              </div>
              <p style={{ fontSize: 26, color: DARK_TEXT, fontWeight: 700 }}>{p.n}</p>
              <p style={{ fontSize: 17, color: `hsl(${GOLD})`, fontWeight: 600, marginTop: 2 }}>{p.r}</p>
              <p style={{ fontSize: 18, color: DARK_TEXT, fontWeight: 600, marginTop: 14, lineHeight: 1.3 }}>
                <span style={{ color: `hsl(${ACCENT})` }}>{p.role}</span>
              </p>
              <p style={{ fontSize: 17, color: DARK_MUTED, marginTop: 8, lineHeight: 1.5 }}>{p.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-3 gap-6">
          {[
            { i: Hammer, t: "15 months self-funded", d: "Built to four paid partnerships without external capital" },
            { i: Coins, t: "Capital efficient", d: "Shipped a working engine on a fraction of the typical seed spend" },
            { i: Brain, t: "Practitioners", d: "Built AI inside enterprise. Lived this exact gap for 15 years." },
          ].map(b => (
            <div key={b.t} className="rounded-2xl p-7 flex flex-col"
              style={{ background: "hsl(0 0% 100% / 0.05)", border: `1px solid hsl(${GOLD} / 0.3)` }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `hsl(${GOLD} / 0.12)`, border: `1px solid hsl(${GOLD} / 0.35)` }}>
                <b.i size={28} style={{ color: `hsl(${GOLD})` }} />
              </div>
              <p style={{ fontSize: 28, color: DARK_TEXT, fontWeight: 700 }}>{b.t}</p>
              <p style={{ fontSize: 20, color: DARK_MUTED, marginTop: 6, lineHeight: 1.4 }}>{b.d}</p>
            </div>
          ))}
        </div>
      </div>
      <FooterBridge text="Next: the ask, and how to wire." dark />
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — THE ASK
// ═════════════════════════════════════════════════════════════════════════════
function S12Ask() {
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10">
        <DarkTag label="The Ask" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-8" style={{ fontSize: 80, color: DARK_TEXT, letterSpacing: "-0.02em" }}>
          €200K. SAFE. <span style={{ color: `hsl(${GOLD})` }}>Closing now.</span>
        </h2>

        <div className="grid grid-cols-[1.1fr_1fr] gap-8">
          {/* Terms */}
          <div className="rounded-2xl p-8" style={{ background: `hsl(${GOLD} / 0.06)`, border: `1px solid hsl(${GOLD} / 0.4)` }}>
            <FileSignature size={32} style={{ color: `hsl(${GOLD})` }} className="mb-4" />
            <p style={{ fontSize: 16, color: `hsl(${GOLD})`, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase mb-3">The terms</p>
            <p style={{ fontSize: 64, color: DARK_TEXT, fontWeight: 700, lineHeight: 1 }}>€200,000</p>
            <p style={{ fontSize: 20, color: DARK_MUTED, marginTop: 6, marginBottom: 22 }}>Bridge round · Self-serve capability</p>

            <div className="space-y-2.5">
              {[
                { k: "Instrument", v: "SAFE, post-money" },
                { k: "Valuation now", v: "€10M post-money" },
                { k: "At next round", v: "20% cheaper than Seed price" },
                { k: "Check size", v: "€10K to €30K" },
                { k: "Close window", v: "6 weeks, rolling" },
                { k: "Converts on", v: "The Seed round" },
              ].map(r => (
                <div key={r.k} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: "hsl(0 0% 100% / 0.08)" }}>
                  <span style={{ fontSize: 18, color: DARK_MUTED }}>{r.k}</span>
                  <span style={{ fontSize: 20, color: DARK_TEXT, fontWeight: 700 }}>{r.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What you back + close */}
          <div className="flex flex-col gap-5">
            <div className="rounded-2xl p-7"
              style={{ background: "hsl(0 0% 100% / 0.04)", border: `1px solid hsl(0 0% 100% / 0.1)` }}>
              <p style={{ fontSize: 16, color: `hsl(${ACCENT})`, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase mb-3">What you back</p>
              {[
                "A shipped product running paid workloads",
                "Four paid design partnerships across knowledge industries",
                "A 6-month plan with monthly milestones",
                "The team that built the proof, full-time",
                "Enter at €10M today. Buy Seed shares 20% cheaper than the next investor.",
              ].map(b => (
                <div key={b} className="flex items-start gap-3 py-2">
                  <CheckCircle2 size={20} style={{ color: `hsl(${GREEN})` }} className="mt-0.5 shrink-0" />
                  <span style={{ fontSize: 19, color: DARK_TEXT }}>{b}</span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-6"
              style={{ background: `hsl(${RED} / 0.08)`, border: `1px solid hsl(${RED} / 0.3)` }}>
              <p style={{ fontSize: 16, color: `hsl(${RED})`, fontWeight: 700, letterSpacing: "0.18em" }} className="uppercase mb-2">Close mechanics</p>
              <p style={{ fontSize: 24, color: DARK_TEXT, fontWeight: 700, lineHeight: 1.3 }}>
                Reply with check size. SAFE in your inbox within 48 hours.
              </p>
              <p style={{ fontSize: 18, color: DARK_MUTED, marginTop: 8, lineHeight: 1.4 }}>
                Two slots remaining at first-mover terms. After they close, the round caps and the next entry is the priced Seed.
              </p>
            </div>
          </div>
        </div>

        <SlideBar from={GOLD} to={ACCENT} />
      </div>
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────
const SLIDES = [
  { id: "cover", title: "Cover", component: <S01Cover /> },
  { id: "moment", title: "The Moment", component: <S02Moment /> },
  { id: "proof", title: "Proof", component: <S03Proof /> },
  { id: "built", title: "What we built", component: <S04Built /> },
  { id: "gap", title: "The Gap", component: <S05Gap /> },
  { id: "unlock", title: "€200K Unlock", component: <S06Unlock /> },
  { id: "funds", title: "Use of Funds", component: <S07Funds /> },
  { id: "roadmap", title: "Path to Markup", component: <S10Roadmap /> },
  { id: "roadmap", title: "Path to Markup", component: <S10Roadmap /> },
  { id: "team", title: "Team", component: <S11Team /> },
  { id: "ask", title: "The Ask", component: <S12Ask /> },
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

  const enterFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
  }, []);

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
  }, [next, prev, enterFullscreen]);

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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · €200K Bridge Deck</span>
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
                      <span className="font-mono">{String(i + 1).padStart(2, "0")}</span> · {s.title}
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
