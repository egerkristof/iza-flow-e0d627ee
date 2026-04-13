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
          Your best people's expertise<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            dies in their inbox.
          </span>
        </h1>

        <p className="mb-14" style={{ fontSize: 30, color: DARK_MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          We make it run the company.
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
// SLIDE 02 — THE PROBLEM (Concrete "Sarah" Scenario)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${WARM})` }}>The Problem</p>

        <h2 className="font-black mb-8" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          Meet Sarah. She's your best consultant.{" "}
          <span style={{ color: `hsl(${WARM})` }}>AI just made her job harder.</span>
        </h2>

        <div className="flex-1 flex gap-8 items-stretch">
          {/* The scenario */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="rounded-2xl border p-7 flex-1" style={{ borderColor: `hsl(${WARM} / 0.2)`, background: `hsl(${WARM} / 0.04)` }}>
              <p className="font-bold mb-4" style={{ fontSize: 22, color: TEXT }}>Monday morning. Sarah asks AI to draft a client proposal.</p>
              <div className="flex flex-col gap-4">
                {[
                  { emoji: "📄", text: "AI produces a polished 12-page proposal in 90 seconds." },
                  { emoji: "❌", text: "Wrong pricing model. Wrong methodology. Wrong tone for this client type." },
                  { emoji: "⏱️", text: "Sarah spends 2 hours fixing it. Same as writing from scratch." },
                  { emoji: "😰", text: "Her junior colleague gets the same output — but doesn't know what's wrong." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span style={{ fontSize: 28, flexShrink: 0 }}>{item.emoji}</span>
                    <p style={{ fontSize: 22, color: i === 0 ? MUTED : i === 3 ? `hsl(${WARM})` : TEXT, lineHeight: 1.45, fontWeight: i === 3 ? 700 : 400 }}>
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl px-6 py-4" style={{ background: `hsl(${RED} / 0.06)`, border: `1px solid hsl(${RED} / 0.15)` }}>
              <p className="font-bold" style={{ fontSize: 20, color: `hsl(${RED})` }}>
                He sends it. The client notices. Trust is damaged.
              </p>
            </div>
          </div>

          {/* The 7 dimensions */}
          <div className="w-[520px] rounded-2xl border p-7 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.04)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-2" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>
              What AI needed to know
            </p>
            <p className="mb-5" style={{ fontSize: 17, color: MUTED }}>
              To write Sarah's proposal correctly, AI needed access to <strong style={{ color: TEXT }}>7 dimensions of expertise</strong>:
            </p>
            <div className="flex flex-col gap-2.5 flex-1">
              {[
                { label: "Pricing model", detail: "Value-based, not hourly — for this client tier" },
                { label: "Methodology", detail: "Your firm's proprietary framework, not generic" },
                { label: "Tone & voice", detail: "Formal for enterprise, casual for startups" },
                { label: "Case studies", detail: "Which ones match this industry & problem" },
                { label: "Competitive stance", detail: "How you differentiate against Accenture here" },
                { label: "Scoping rules", detail: "Never propose Phase 2 before Phase 1 sign-off" },
                { label: "Client history", detail: "They rejected fixed-fee last time" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 px-4 py-2.5 rounded-lg" style={{ background: `hsl(${TEAL} / 0.06)` }}>
                  <span className="font-black shrink-0" style={{ fontSize: 15, color: `hsl(${TEAL})`, width: 130 }}>{item.label}</span>
                  <span style={{ fontSize: 16, color: TEXT }}>{item.detail}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 px-4 py-3 rounded-lg" style={{ background: `hsl(${WARM} / 0.08)` }}>
              <p className="font-bold" style={{ fontSize: 16, color: `hsl(${WARM})` }}>
                AI got none of this. It used generic training data instead.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 03 — WHY THIS HAPPENS (Three Layers — compressed)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>Why This Happens</p>

        <h2 className="font-black mb-4" style={{ fontSize: 52, color: DARK_TEXT, lineHeight: 1.05 }}>
          Expertise has{" "}
          <span style={{ color: `hsl(${WARM})` }}>no infrastructure.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 23, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Organizations invested heavily in where knowledge is <em>stored</em> and where outputs are <em>produced</em>.
          The intelligence that connects them? That was always just people.
        </p>

        <div className="flex-1 flex items-center">
          <div className="w-full flex gap-4 items-stretch">
            {/* Before */}
            <div className="flex-1 rounded-2xl border p-6" style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.06)` }}>
              <p className="font-bold tracking-[0.15em] uppercase mb-4" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>Before AI</p>
              <div className="flex flex-col items-center gap-3">
                <div className="w-full rounded-lg p-4 text-center" style={{ background: `hsl(${TEAL} / 0.08)` }}>
                  <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>📄 Systems of Record</p>
                  <p style={{ fontSize: 14, color: DARK_MUTED }}>Wikis, SOPs, SharePoint — $50B+</p>
                </div>
                <ArrowRight size={20} style={{ color: DARK_MUTED, transform: "rotate(90deg)" }} />
                <div className="w-full rounded-lg p-5 text-center border-2" style={{ borderColor: `hsl(${GREEN} / 0.3)`, background: `hsl(${GREEN} / 0.08)` }}>
                  <p style={{ fontSize: 36 }}>🧠</p>
                  <p className="font-bold mt-1" style={{ fontSize: 20, color: `hsl(${GREEN})` }}>Senior people</p>
                  <p style={{ fontSize: 15, color: DARK_MUTED }}>Read, interpreted, filled gaps, produced</p>
                </div>
                <ArrowRight size={20} style={{ color: DARK_MUTED, transform: "rotate(90deg)" }} />
                <div className="w-full rounded-lg p-4 text-center" style={{ background: `hsl(${BLUE} / 0.08)` }}>
                  <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${BLUE})` }}>✅ Systems of Output</p>
                  <p style={{ fontSize: 14, color: DARK_MUTED }}>CRM, ERP, ALM — $100B+</p>
                </div>
                <div className="mt-2 px-4 py-2 rounded-lg w-full text-center" style={{ background: `hsl(${GREEN} / 0.08)` }}>
                  <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${GREEN})` }}>✓ Slow but it worked. Humans compensated.</p>
                </div>
              </div>
            </div>

            {/* Shift */}
            <div className="flex flex-col items-center justify-center gap-3 px-3">
              <div className="w-0.5 flex-1" style={{ background: `hsl(${WARM} / 0.3)` }} />
              <div className="px-4 py-3 rounded-xl" style={{ background: `hsl(${WARM} / 0.1)`, border: `1px solid hsl(${WARM} / 0.3)` }}>
                <p className="font-black text-center" style={{ fontSize: 16, color: `hsl(${WARM})` }}>AI<br/>arrives</p>
              </div>
              <ArrowRight size={28} style={{ color: `hsl(${WARM})` }} />
              <div className="w-0.5 flex-1" style={{ background: `hsl(${WARM} / 0.3)` }} />
            </div>

            {/* After */}
            <div className="flex-1 rounded-2xl border p-6" style={{ borderColor: `hsl(${WARM} / 0.25)`, background: `hsl(${WARM} / 0.06)` }}>
              <p className="font-bold tracking-[0.15em] uppercase mb-4" style={{ fontSize: 14, color: `hsl(${WARM})` }}>Now</p>
              <div className="flex flex-col items-center gap-3">
                <div className="w-full rounded-lg p-4 text-center" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${WARM} / 0.2)` }}>
                  <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>📄 Same static records</p>
                  <p style={{ fontSize: 14, color: `hsl(${WARM})` }}>Not designed for AI to query</p>
                </div>
                <ArrowRight size={20} style={{ color: `hsl(${WARM})`, transform: "rotate(90deg)" }} />
                <div className="w-full rounded-lg p-5 text-center border-2 border-dashed" style={{ borderColor: `hsl(${WARM} / 0.4)`, background: `hsl(${WARM} / 0.08)` }}>
                  <p style={{ fontSize: 36 }}>🤖</p>
                  <p className="font-bold mt-1" style={{ fontSize: 20, color: `hsl(${WARM})` }}>AI executes literally</p>
                  <p style={{ fontSize: 15, color: DARK_MUTED }}>Fills gaps from generic training data</p>
                </div>
                <ArrowRight size={20} style={{ color: `hsl(${WARM})`, transform: "rotate(90deg)" }} />
                <div className="w-full rounded-lg p-4 text-center" style={{ background: `hsl(${BLUE} / 0.06)`, border: `1px solid hsl(${WARM} / 0.2)` }}>
                  <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${BLUE})` }}>⚠️ Outputs look right</p>
                  <p style={{ fontSize: 14, color: `hsl(${WARM})` }}>But they're not <em>yours</em></p>
                </div>
                <div className="mt-2 px-4 py-2 rounded-lg w-full text-center" style={{ background: `hsl(${WARM} / 0.1)` }}>
                  <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${WARM})` }}>✗ Fast but dangerously generic.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl px-8 py-3 text-center"
          style={{ background: `hsl(${WARM} / 0.08)`, border: `1px solid hsl(${WARM} / 0.2)` }}>
          <p className="font-bold" style={{ fontSize: 22, color: DARK_TEXT }}>
            Whatever you don't define,{" "}
            <span style={{ color: `hsl(${WARM})` }}>AI invents.</span>{" "}
            There's no infrastructure for the expertise in between.
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 04 — THE MARKET GAP (Competitors + TAM/SAM/SOM)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-14">
        <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Market Opportunity</p>

        <h2 className="font-black mb-6" style={{ fontSize: 48, color: TEXT, lineHeight: 1.05 }}>
          $98M+ invested around this problem.{" "}
          <span style={{ color: `hsl(${GREEN})` }}>Nobody owns the middle.</span>
        </h2>

        <div className="flex gap-6 flex-1 min-h-0">
          {/* Competitors */}
          <div className="flex-1 flex flex-col gap-3">
            <p className="font-bold tracking-[0.15em] uppercase mb-1" style={{ fontSize: 14, color: SUBTLE }}>Adjacent players</p>
            {[
              { name: "Mem0.ai", funding: "$44.5M", what: "AI memory — remembers conversations", gap: "Doesn't encode expertise", color: SEAFOAM },
              { name: "Edra.ai", funding: "$30M", what: "Process mining — mines what happened", gap: "Doesn't govern what should", color: GREEN },
              { name: "Interloom", funding: "$19.5M", what: "Back-office automation — repeatable ops", gap: "Doesn't handle judgment", color: BLUE },
              { name: "Glean / Guru", funding: "$300M+", what: "Enterprise search — finds knowledge", gap: "Can't make it executable", color: GOLD },
            ].map(({ name, funding, what, gap, color }) => (
              <div key={name} className="flex items-center gap-4 rounded-xl border px-5 py-3"
                style={{ borderColor: `hsl(${color} / 0.15)`, background: `hsl(${color} / 0.03)` }}>
                <div className="w-[120px] shrink-0">
                  <p className="font-bold" style={{ fontSize: 17, color: TEXT }}>{name}</p>
                  <p className="font-black" style={{ fontSize: 15, color: `hsl(${color})` }}>{funding}</p>
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: 15, color: MUTED }}>{what}</p>
                </div>
                <div className="w-[200px] shrink-0">
                  <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${WARM})` }}>✗ {gap}</p>
                </div>
              </div>
            ))}
            <div className="rounded-xl border-2 px-5 py-3 mt-auto"
              style={{ borderColor: `hsl(${TEAL} / 0.3)`, background: `hsl(${TEAL} / 0.04)` }}>
              <div className="flex items-center gap-4">
                <div className="w-[120px] shrink-0">
                  <p className="font-black" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>LIZA OS</p>
                  <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>Pre-Seed</p>
                </div>
                <p className="flex-1 font-semibold" style={{ fontSize: 16, color: TEXT }}>
                  The System of Intelligence — captures, versions, and governs expertise for AI execution
                </p>
              </div>
            </div>
          </div>

          {/* TAM/SAM/SOM */}
          <div className="w-[420px] rounded-2xl border p-7 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.04)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-5" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>Market Size</p>
            <div className="flex flex-col gap-5 flex-1 justify-center">
              {[
                { label: "TAM", value: "$28B", desc: "Global AI governance & knowledge management infrastructure", size: "w-full" },
                { label: "SAM", value: "$4.2B", desc: "Mid-market knowledge-intensive orgs (50-1000 employees) in Europe & US", size: "w-[85%]" },
                { label: "SOM", value: "$120M", desc: "DACH professional services, consulting & regulated industries — first 500 orgs", size: "w-[60%]" },
              ].map(({ label, value, desc, size }) => (
                <div key={label}>
                  <div className={`${size} rounded-xl px-5 py-4`} style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="font-black" style={{ fontSize: 14, color: `hsl(${TEAL})`, letterSpacing: "0.15em" }}>{label}</span>
                      <span className="font-black" style={{ fontSize: 32, color: TEXT }}>{value}</span>
                    </div>
                    <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 px-4 py-3 rounded-lg" style={{ background: `hsl(${GREEN} / 0.06)` }}>
              <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>
                Wedge: Professional services → Expand to regulated industries & enterprise
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
// SLIDE 05 — THE SOLUTION (LIZA = System of Intelligence)
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
// SLIDE 06 — HOW IT WORKS (4-step loop)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06() {
  const steps = [
    {
      icon: <BookOpen size={36} />, num: "01", title: "Capture",
      desc: "Extract how your best people actually work — from documents, conversations, and live AI sessions.",
      example: "Sarah's proposal approach becomes a reusable playbook",
    },
    {
      icon: <Network size={36} />, num: "02", title: "Organize",
      desc: "Structure expertise into governed, versioned bundles that AI can query and follow.",
      example: "Pricing rules + methodology + client signals = one bundle",
    },
    {
      icon: <Zap size={36} />, num: "03", title: "Execute",
      desc: "AI generates outputs with your organizational judgment built in. Governed, traceable.",
      example: "Junior writes proposal at senior quality. Automatically.",
    },
    {
      icon: <RefreshCw size={36} />, num: "04", title: "Learn",
      desc: "Every execution feeds back. Expertise evolves. Standards improve. The loop compounds.",
      example: "Sarah's correction becomes tomorrow's default",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>How It Works</p>

        <h2 className="font-black mb-3" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          Four steps.{" "}
          <span style={{ color: `hsl(${TEAL})` }}>One compounding loop.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 22, color: MUTED, maxWidth: 1000 }}>
          Each cycle makes your organization's AI smarter.
        </p>

        <div className="flex-1 grid grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="rounded-2xl border p-7 flex flex-col relative"
              style={{ borderColor: i === 3 ? `hsl(${TEAL} / 0.4)` : `hsl(215 10% 88%)`, background: i === 3 ? `hsl(${TEAL} / 0.06)` : CARD_ALT }}>
              <span className="font-black tracking-[0.2em] mb-4" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>
                STEP {s.num}
              </span>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `hsl(${TEAL} / 0.1)`, color: `hsl(${TEAL})` }}>
                {s.icon}
              </div>
              <p className="font-black mb-2" style={{ fontSize: 28, color: TEXT }}>{s.title}</p>
              <p className="mb-4" style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>{s.desc}</p>
              <div className="mt-auto px-4 py-2.5 rounded-lg" style={{ background: `hsl(${TEAL} / 0.06)` }}>
                <p style={{ fontSize: 14, color: `hsl(${TEAL})`, fontStyle: "italic" }}>
                  e.g. {s.example}
                </p>
              </div>
              {i < 3 && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight size={22} style={{ color: `hsl(${TEAL} / 0.35)` }} />
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

function Slide07() {
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

function Slide08() {
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

function Slide09() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>Product Status</p>
        <h2 className="font-bold mb-8" style={{ fontSize: 60, color: TEXT, lineHeight: 1.1 }}>
          This isn't a slide deck.{" "}
          <span style={{ color: `hsl(${ACCENT})` }}>The product is live.</span>
        </h2>

        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          {[
            {
              layer: "Knowledge Graph", color: ACCENT,
              icon: <Layers size={36} />,
              desc: "Living organizational memory. Standards, playbooks, cultural principles — versioned, auditable, propagated in real-time.",
            },
            {
              layer: "Context Engine (AACE v3.1)", color: GREEN,
              icon: <Workflow size={36} />,
              desc: "Proprietary specification. Intent-locking ensures AI stays on-task. Hierarchical knowledge injection. The IP moat.",
            },
            {
              layer: "Protocol-Driven Workbooks", color: GOLD,
              icon: <Target size={36} />,
              desc: "Model-agnostic AI execution (GPT, Gemini, Claude). Group collaboration with AI and humans in one workspace.",
            },
            {
              layer: "Governance & Learning Loop", color: ACCENT,
              icon: <Eye size={36} />,
              desc: "Drift detection, compliance scoring, after-action synthesis. Every execution feeds the knowledge graph.",
            },
          ].map(({ layer, color, icon, desc }) => (
            <div key={layer} className="flex gap-5 rounded-2xl border p-7"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
              <div className="shrink-0" style={{ color: `hsl(${color})` }}>{icon}</div>
              <div>
                <p className="font-bold mb-2" style={{ fontSize: 24, color: TEXT }}>{layer}</p>
                <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6 mt-5">
          {[
            { label: "AI Standards Diagnostic", desc: "Live lead-gen tool. Teams self-assess AI maturity.", color: GOLD },
            { label: "Marketing & Use Cases", desc: "Full positioning, 7 use cases live at lizaos.ai.", color: ACCENT },
          ].map(({ label, desc, color }) => (
            <div key={label} className="flex-1 rounded-xl border px-6 py-4 flex items-center gap-4"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
              <Lightbulb size={24} style={{ color: `hsl(${color})`, flexShrink: 0 }} />
              <div>
                <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>{label}</p>
                <p style={{ fontSize: 15, color: MUTED }}>{desc}</p>
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

function Slide10() {
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

function Slide11() {
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

function Slide12() {
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
  { id: 4, title: "Market Opportunity", component: <Slide04 /> },
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
