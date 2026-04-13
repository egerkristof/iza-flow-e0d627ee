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
// SLIDE 1 — COVER
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
            LIZA OS · Seed
          </span>
        </div>

        <h1 className="font-black mb-10" style={{ fontSize: 84, lineHeight: 1.05, color: DARK_TEXT }}>
          The missing infrastructure<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            between knowing and doing.
          </span>
        </h1>

        <p className="mb-14" style={{ fontSize: 32, color: DARK_MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          Organizations have Systems of Record and Systems of Output.<br />
          They've never had a System of Intelligence.
        </p>

        <p style={{ fontSize: 20, color: DARK_SUBTLE }}>
          Confidential &nbsp;·&nbsp; Seed Round &nbsp;·&nbsp; €1.5M
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — THE THREE LAYERS
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>The Starting Point</p>

        <h2 className="font-black mb-4" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          Every organization runs on{" "}
          <span style={{ color: `hsl(${TEAL})` }}>three layers.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 23, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Where you store what you know. Where you produce what you deliver.
          And the intelligence that connects them.
        </p>

        <div className="flex-1 flex gap-6 items-stretch">
          {/* Systems of Record */}
          <div className="flex-1 rounded-2xl border p-7 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.04)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-2" style={{ fontSize: 17, color: `hsl(${TEAL})` }}>
              Systems of Record
            </p>
            <p className="mb-4" style={{ fontSize: 16, color: MUTED }}>Where knowledge is stored</p>
            <div className="flex flex-col gap-2 flex-1">
              {[
                { label: "Wiki", desc: "Confluence, Notion — process docs" },
                { label: "DMS", desc: "SharePoint, Google Drive — files" },
                { label: "LMS", desc: "Training programs, onboarding" },
                { label: "SOP", desc: "Standard operating procedures" },
                { label: "Tribal", desc: "In people's heads — never written" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 px-4 py-2.5 rounded-lg" style={{ background: `hsl(${TEAL} / 0.05)` }}>
                  <span className="font-black shrink-0" style={{ fontSize: 15, color: `hsl(${TEAL})`, width: 50 }}>{item.label}</span>
                  <span style={{ fontSize: 17, color: TEXT }}>{item.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 px-4 py-3 rounded-lg" style={{ background: `hsl(${TEAL} / 0.08)` }}>
              <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>
                $50B+ invested. But these are filing cabinets — static, disconnected, not executable.
              </p>
            </div>
          </div>

          {/* System of Intelligence */}
          <div className="w-[300px] rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center"
            style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.04)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-3" style={{ fontSize: 15, color: `hsl(${GREEN})` }}>
              System of Intelligence
            </p>
            <p style={{ fontSize: 52 }}>🧠</p>
            <p className="font-black mt-3" style={{ fontSize: 22, color: `hsl(${GREEN})` }}>The Bridge</p>
            <p className="mt-2" style={{ fontSize: 16, color: MUTED, lineHeight: 1.45 }}>
              Takes what's in the records,<br />
              applies judgment & context,<br />
              produces the right output.
            </p>
            <div className="mt-4 w-full px-3 py-2 rounded-lg" style={{ background: `hsl(${WARM} / 0.08)` }}>
              <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${WARM})` }}>
                $0 invested in infrastructure.
              </p>
            </div>
          </div>

          {/* Systems of Output */}
          <div className="flex-1 rounded-2xl border p-7 flex flex-col" style={{ borderColor: `hsl(${BLUE} / 0.25)`, background: `hsl(${BLUE} / 0.04)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-2" style={{ fontSize: 17, color: `hsl(${BLUE})` }}>
              Systems of Output
            </p>
            <p className="mb-4" style={{ fontSize: 16, color: MUTED }}>Where deliverables are produced & governed</p>
            <div className="flex flex-col gap-2 flex-1">
              {[
                { label: "ALM", desc: "Code, releases, CI/CD pipelines" },
                { label: "PLM", desc: "Products, BOMs, change orders" },
                { label: "GxP", desc: "Regulated docs, audit trails" },
                { label: "CRM", desc: "Deals, proposals, contracts" },
                { label: "ERP", desc: "Financials, procurement, invoices" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 px-4 py-2.5 rounded-lg" style={{ background: `hsl(${BLUE} / 0.05)` }}>
                  <span className="font-black shrink-0" style={{ fontSize: 15, color: `hsl(${BLUE})`, width: 42 }}>{item.label}</span>
                  <span style={{ fontSize: 17, color: TEXT }}>{item.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 px-4 py-3 rounded-lg" style={{ background: `hsl(${BLUE} / 0.08)` }}>
              <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${BLUE})` }}>
                $100B+ invested. Quality gates, versioning, approvals — all mature.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p style={{ fontSize: 22, color: MUTED }}>
            Two layers have massive infrastructure. The middle layer? <strong style={{ color: TEXT }}>It was never built.</strong>
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — HUMANS WERE THE SYSTEM OF INTELLIGENCE
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>The Human Era</p>

        <h2 className="font-black mb-4" style={{ fontSize: 55, color: DARK_TEXT, lineHeight: 1.05 }}>
          Your people{" "}
          <span style={{ color: `hsl(${GREEN})` }}>were the system of intelligence.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 23, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          It didn't matter that wikis were incomplete or that SOPs were outdated.
          Senior staff read the docs, filled the gaps from experience, and slowly produced each output by hand.
        </p>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-5 w-full max-w-[1500px]">
            <div className="w-[280px] rounded-2xl border p-7 text-center" style={{ borderColor: `hsl(200 15% 16%)`, background: `hsl(200 25% 10%)` }}>
              <p className="font-bold tracking-[0.15em] uppercase mb-3" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>System of Record</p>
              <p style={{ fontSize: 48 }}>📄</p>
              <p className="font-bold mt-3" style={{ fontSize: 20, color: DARK_TEXT }}>Incomplete. Static.</p>
              <p className="mt-1" style={{ fontSize: 16, color: DARK_MUTED }}>Wikis, SOPs, tribal knowledge</p>
              <p className="mt-2 font-semibold" style={{ fontSize: 15, color: `hsl(${WARM})` }}>Never designed for machines</p>
            </div>
            <ArrowRight size={24} style={{ color: DARK_MUTED, flexShrink: 0 }} />
            <div className="flex-1 rounded-2xl border-2 p-8 text-center" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.08)` }}>
              <p style={{ fontSize: 48 }}>🧠</p>
              <p className="font-bold mt-3" style={{ fontSize: 26, color: `hsl(${GREEN})` }}>Your Senior People</p>
              <p className="font-semibold mt-1" style={{ fontSize: 18, color: DARK_MUTED }}>The living System of Intelligence</p>
              <p className="mt-2" style={{ fontSize: 18, color: DARK_TEXT }}>
                They <strong>interpreted</strong> incomplete records,<br/>
                <strong>applied</strong> judgment & context,<br/>
                and <strong>produced</strong> quality outputs — one at a time.
              </p>
              <div className="mt-4 flex gap-3 justify-center">
                {["Filled gaps", "Applied judgment", "Caught errors"].map(tag => (
                  <span key={tag} className="px-4 py-2 rounded-lg font-semibold" style={{ fontSize: 15, background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <ArrowRight size={24} style={{ color: DARK_MUTED, flexShrink: 0 }} />
            <div className="w-[280px] rounded-2xl border p-7 text-center" style={{ borderColor: `hsl(200 15% 16%)`, background: `hsl(200 25% 10%)` }}>
              <p className="font-bold tracking-[0.15em] uppercase mb-3" style={{ fontSize: 14, color: `hsl(${BLUE})` }}>System of Output</p>
              <p style={{ fontSize: 48 }}>✅</p>
              <p className="font-bold mt-3" style={{ fontSize: 20, color: DARK_TEXT }}>Quality output</p>
              <p className="mt-1" style={{ fontSize: 16, color: DARK_MUTED }}>Slow, manual, one at a time</p>
              <p className="mt-2 font-semibold" style={{ fontSize: 15, color: `hsl(${GREEN})` }}>But it worked.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center px-20">
          <p style={{ fontSize: 22, color: DARK_MUTED }}>
            The system was <span className="font-bold" style={{ color: `hsl(${GREEN})` }}>in balance</span>.
            Slow execution. Incomplete records. But humans{" "}
            <strong style={{ color: DARK_TEXT }}>were the intelligence layer</strong> that compensated.
          </p>
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — THE INTELLIGENCE LAYER SHIFTED SPECIES
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${WARM})` }}>The AI Shift</p>

        <h2 className="font-black mb-4" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          The intelligence layer{" "}
          <span style={{ color: `hsl(${WARM})` }}>changed species.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 22, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          AI is now the system of intelligence — semantic, fast, scalable.
          But neither the records nor the outputs were designed for it.
        </p>

        <div className="flex-1 flex gap-6 items-stretch">
          {/* Before column */}
          <div className="flex-1 rounded-2xl border p-6 flex flex-col" style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.04)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-3" style={{ fontSize: 15, color: `hsl(${GREEN})` }}>Before: Human Intelligence</p>
            <div className="flex flex-col gap-3 flex-1 justify-center items-center text-center">
              <div className="w-full rounded-lg px-4 py-3" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
                <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>System of Record</p>
                <p style={{ fontSize: 14, color: MUTED }}>Designed for humans to read</p>
              </div>
              <ArrowRight size={20} style={{ color: `hsl(${GREEN})`, transform: "rotate(90deg)" }} />
              <div className="w-full rounded-lg px-4 py-4 border-2" style={{ background: `hsl(${GREEN} / 0.06)`, borderColor: `hsl(${GREEN} / 0.3)` }}>
                <p style={{ fontSize: 28 }}>🧠</p>
                <p className="font-bold mt-1" style={{ fontSize: 18, color: `hsl(${GREEN})` }}>Human interprets, applies, produces</p>
                <p style={{ fontSize: 14, color: MUTED }}>Slow but compensates for gaps</p>
              </div>
              <ArrowRight size={20} style={{ color: `hsl(${GREEN})`, transform: "rotate(90deg)" }} />
              <div className="w-full rounded-lg px-4 py-3" style={{ background: `hsl(${BLUE} / 0.06)`, border: `1px solid hsl(${BLUE} / 0.15)` }}>
                <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${BLUE})` }}>System of Output</p>
                <p style={{ fontSize: 14, color: MUTED }}>Designed for human speed</p>
              </div>
              <div className="mt-2 px-4 py-2 rounded-lg w-full" style={{ background: `hsl(${GREEN} / 0.08)` }}>
                <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${GREEN})` }}>✓ Balanced. Slow but functional.</p>
              </div>
            </div>
          </div>

          {/* Shift arrow */}
          <div className="flex flex-col items-center justify-center gap-3 px-2">
            <div className="w-0.5 flex-1" style={{ background: `hsl(${WARM} / 0.3)` }} />
            <div className="px-4 py-3 rounded-xl" style={{ background: `hsl(${WARM} / 0.08)`, border: `1px solid hsl(${WARM} / 0.25)` }}>
              <p className="font-black text-center" style={{ fontSize: 16, color: `hsl(${WARM})` }}>LLMs<br/>arrive</p>
            </div>
            <ArrowRight size={28} style={{ color: `hsl(${WARM})` }} />
            <div className="w-0.5 flex-1" style={{ background: `hsl(${WARM} / 0.3)` }} />
          </div>

          {/* After column */}
          <div className="flex-1 rounded-2xl border p-6 flex flex-col" style={{ borderColor: `hsl(${WARM} / 0.25)`, background: `hsl(${WARM} / 0.04)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-3" style={{ fontSize: 15, color: `hsl(${WARM})` }}>Now: AI + Human Intelligence</p>
            <div className="flex flex-col gap-3 flex-1 justify-center items-center text-center">
              <div className="w-full rounded-lg px-4 py-3" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${WARM} / 0.2)` }}>
                <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>System of Record</p>
                <p style={{ fontSize: 14, color: `hsl(${WARM})` }}>❌ Not designed for AI to query</p>
              </div>
              <ArrowRight size={20} style={{ color: `hsl(${WARM})`, transform: "rotate(90deg)" }} />
              <div className="w-full rounded-lg px-4 py-4 border-2 border-dashed" style={{ background: `hsl(${WARM} / 0.06)`, borderColor: `hsl(${WARM} / 0.4)` }}>
                <p style={{ fontSize: 28 }}>🤖 + 🧠</p>
                <p className="font-bold mt-1" style={{ fontSize: 18, color: `hsl(${WARM})` }}>AI executes literally. Instantly.</p>
                <p style={{ fontSize: 14, color: MUTED }}>Humans only at design & review loops</p>
              </div>
              <ArrowRight size={20} style={{ color: `hsl(${WARM})`, transform: "rotate(90deg)" }} />
              <div className="w-full rounded-lg px-4 py-3" style={{ background: `hsl(${BLUE} / 0.06)`, border: `1px solid hsl(${WARM} / 0.2)` }}>
                <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${BLUE})` }}>System of Output</p>
                <p style={{ fontSize: 14, color: `hsl(${WARM})` }}>❌ Not designed for AI speed</p>
              </div>
              <div className="mt-2 px-4 py-2 rounded-lg w-full" style={{ background: `hsl(${WARM} / 0.1)` }}>
                <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${WARM})` }}>✗ Broken. Both sides built for humans.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl px-8 py-3 text-center"
          style={{ background: `hsl(${WARM} / 0.06)`, border: `1px solid hsl(${WARM} / 0.2)` }}>
          <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>
            The system of intelligence upgraded from biological to hybrid.{" "}
            <span style={{ color: `hsl(${WARM})` }}>But the infrastructure around it didn't.</span>
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — WHAT BREAKS: THE CONSEQUENCES
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${WARM})` }}>The Consequence</p>

        <h2 className="font-black mb-4" style={{ fontSize: 52, color: DARK_TEXT, lineHeight: 1.05 }}>
          Everyone is adding AI.{" "}
          <span style={{ color: `hsl(${WARM})` }}>Nobody is solving this.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 22, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Both sides are trying to bolt AI onto systems designed for humans.
          Neither can solve a problem that exists <em>between</em> them.
        </p>

        <div className="flex-1 flex gap-6 items-stretch">
          {/* Record side attempts */}
          <div className="flex-1 rounded-2xl border p-6 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.06)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-3" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>Record-Side AI</p>
            <p className="font-bold mb-4" style={{ fontSize: 19, color: DARK_TEXT }}>Adding AI to where knowledge is stored</p>
            <div className="flex flex-col gap-2 flex-1">
              {[
                { name: "Notion AI", what: "Searches your docs" },
                { name: "Confluence AI", what: "Summarizes your pages" },
                { name: "Glean / Guru", what: "Enterprise search" },
                { name: "Microsoft Copilot", what: "Finds things in SharePoint" },
              ].map(item => (
                <div key={item.name} className="flex items-center gap-3 px-4 py-2 rounded-lg" style={{ background: `hsl(${TEAL} / 0.08)` }}>
                  <span className="font-bold shrink-0" style={{ fontSize: 15, color: `hsl(${TEAL})`, width: 130 }}>{item.name}</span>
                  <span style={{ fontSize: 16, color: DARK_TEXT }}>{item.what}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg px-4 py-3" style={{ background: `hsl(${WARM} / 0.08)` }}>
              <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${WARM})` }}>
                ✗ They help you <em>find</em> knowledge. They can't make it executable, versionable, or govern what AI does with it.
              </p>
            </div>
          </div>

          {/* The gap */}
          <div className="w-[180px] flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: `hsl(${WARM} / 0.5)`, background: `hsl(${WARM} / 0.08)` }}>
              <span style={{ fontSize: 36 }}>⚡</span>
            </div>
            <p className="font-black" style={{ fontSize: 20, color: `hsl(${WARM})` }}>THE GAP</p>
            <p style={{ fontSize: 14, color: DARK_MUTED, lineHeight: 1.4 }}>
              No system governs<br />the intelligence<br />in between
            </p>
          </div>

          {/* Output side attempts */}
          <div className="flex-1 rounded-2xl border p-6 flex flex-col" style={{ borderColor: `hsl(${BLUE} / 0.2)`, background: `hsl(${BLUE} / 0.06)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-3" style={{ fontSize: 15, color: `hsl(${BLUE})` }}>Output-Side AI</p>
            <p className="font-bold mb-4" style={{ fontSize: 19, color: DARK_TEXT }}>Adding AI to where outputs are produced</p>
            <div className="flex flex-col gap-2 flex-1">
              {[
                { name: "GitHub Copilot", what: "Generates code faster" },
                { name: "Salesforce AI", what: "Drafts proposals, emails" },
                { name: "Veeva Vault AI", what: "Speeds up submissions" },
                { name: "ServiceNow AI", what: "Automates workflows" },
              ].map(item => (
                <div key={item.name} className="flex items-center gap-3 px-4 py-2 rounded-lg" style={{ background: `hsl(${BLUE} / 0.08)` }}>
                  <span className="font-bold shrink-0" style={{ fontSize: 15, color: `hsl(${BLUE})`, width: 130 }}>{item.name}</span>
                  <span style={{ fontSize: 16, color: DARK_TEXT }}>{item.what}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg px-4 py-3" style={{ background: `hsl(${WARM} / 0.08)` }}>
              <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${WARM})` }}>
                ✗ They speed up <em>creation</em>. They can't encode your judgment or propagate expertise changes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl px-8 py-3 text-center"
          style={{ background: `hsl(${WARM} / 0.08)`, border: `1px solid hsl(${WARM} / 0.25)` }}>
          <p className="font-bold" style={{ fontSize: 20, color: DARK_TEXT }}>
            Whatever you don't define,{" "}
            <span style={{ color: `hsl(${WARM})` }}>AI fills from generic training data.</span>{" "}
            The output looks right — but it's not <em style={{ color: `hsl(${TEAL})` }}>yours</em>.
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — THE NEW CATEGORY: SYSTEM OF INTELLIGENCE
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>The Opportunity</p>

        <h2 className="font-black mb-4" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          Build the{" "}
          <span style={{ color: `hsl(${TEAL})` }}>System of Intelligence.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 22, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Not a better wiki. Not a faster output tool. A new layer of infrastructure — the semantically intelligent
          bridge that makes organizational expertise queryable, versionable, and executable by AI.
        </p>

        <div className="flex gap-5 flex-1 min-h-0 items-stretch">
          {/* Left: the old model */}
          <div className="w-[38%] rounded-2xl border p-6 flex flex-col" style={{ borderColor: `hsl(215 10% 85%)`, background: CARD_ALT }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-3" style={{ fontSize: 14, color: SUBTLE }}>Today: No Infrastructure</p>
            <div className="flex flex-col gap-3 flex-1 justify-center items-center">
              <div className="w-full rounded-lg p-3 text-center" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.15)` }}>
                <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>Records (Static)</p>
              </div>
              <div className="w-full rounded-lg p-4 text-center border-2 border-dashed" style={{ borderColor: `hsl(${WARM} / 0.35)`, background: `hsl(${WARM} / 0.04)` }}>
                <p className="font-bold" style={{ fontSize: 16, color: `hsl(${WARM})` }}>🤖 AI executes literally</p>
                <p style={{ fontSize: 13, color: MUTED }}>Fills gaps from training data</p>
              </div>
              <div className="w-full rounded-lg p-3 text-center" style={{ background: `hsl(${BLUE} / 0.06)`, border: `1px solid hsl(${BLUE} / 0.15)` }}>
                <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${BLUE})` }}>Outputs (Ungoverned)</p>
              </div>
            </div>
            <p className="text-center mt-3" style={{ fontSize: 14, color: MUTED }}>Fast but dangerously generic.</p>
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center justify-center gap-3">
            <ArrowRight size={32} style={{ color: `hsl(${TEAL})` }} />
          </div>

          {/* Right: the new model with LIZA */}
          <div className="flex-1 rounded-2xl border-2 p-7 flex flex-col"
            style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.04)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-4" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>With Infrastructure: The System of Intelligence</p>
            <div className="flex flex-col gap-3 flex-1 justify-center items-center">
              <div className="w-full rounded-lg p-3 text-center" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.2)` }}>
                <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>Records → Semantically queryable & connected</p>
              </div>
              <div className="w-full rounded-lg p-5 text-center border-2" style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.08)` }}>
                <p className="font-black" style={{ fontSize: 24, color: `hsl(${TEAL})` }}>LIZA OS</p>
                <p className="mt-1 font-semibold" style={{ fontSize: 16, color: TEXT }}>The System of Intelligence</p>
                <p className="mt-2" style={{ fontSize: 15, color: MUTED, lineHeight: 1.45 }}>
                  Captures expertise · Versions & connects it · Governs AI execution · Learns from every use
                </p>
              </div>
              <div className="w-full rounded-lg p-3 text-center" style={{ background: `hsl(${BLUE} / 0.06)`, border: `1px solid hsl(${BLUE} / 0.2)` }}>
                <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${BLUE})` }}>Outputs → Governed, traceable, expert-quality</p>
              </div>
            </div>
            <div className="mt-3 flex gap-3">
              {[
                "Semantically queryable",
                "Versionable & propagating",
                "AI-native execution",
                "Continuous learning",
              ].map(tag => (
                <span key={tag} className="flex-1 text-center px-2 py-2 rounded-lg font-semibold" style={{ fontSize: 14, background: `hsl(${TEAL} / 0.08)`, color: `hsl(${TEAL})` }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p style={{ fontSize: 20, color: MUTED }}>
            <strong style={{ color: TEXT }}>$50B+ in Records. $100B+ in Outputs. $0 in Intelligence infrastructure.</strong>{" "}
            <span className="font-bold" style={{ color: `hsl(${TEAL})` }}>Until now.</span>
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — THE SOLUTION (LIZA)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide07() {
  const steps = [
    {
      icon: <BookOpen size={36} />, num: "01", title: "Capture",
      desc: "Extract how your best people actually work — from documents, conversations, and live AI execution.",
    },
    {
      icon: <Network size={36} />, num: "02", title: "Organize",
      desc: "Structure expertise into governed, versioned bundles that AI can follow — connecting the how to the what.",
    },
    {
      icon: <Zap size={36} />, num: "03", title: "Execute",
      desc: "AI generates outputs with your organizational judgment built in. Both dimensions — expertise and quality — governed as one.",
    },
    {
      icon: <RefreshCw size={36} />, num: "04", title: "Learn",
      desc: "When your people execute with AI, LIZA learns. Expertise evolves. Outputs improve. The loop compounds.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL} / 0.8)` }}>The Solution</p>

        <h2 className="font-black mb-3" style={{ fontSize: 55, color: DARK_TEXT, lineHeight: 1.05 }}>
          LIZA fuses expertise and execution{" "}
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            into one layer.
          </span>
        </h2>
        <p className="mb-5" style={{ fontSize: 23, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Not a chatbot. Not a wiki. The infrastructure that captures both how your people think AND what they produce — and governs the AI in between.
        </p>

        <div className="flex-1 grid grid-cols-4 gap-7">
          {steps.map((s, i) => (
            <div key={s.num} className="rounded-2xl border p-8 flex flex-col relative"
              style={{ borderColor: i === 3 ? `hsl(${TEAL} / 0.4)` : `hsl(200 15% 16%)`, background: i === 3 ? `hsl(${TEAL} / 0.08)` : `hsl(200 25% 10%)` }}>
              <span className="font-black tracking-[0.2em] mb-5" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>
                STEP {s.num}
              </span>
              <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
                {s.icon}
              </div>
              <p className="font-black mb-3" style={{ fontSize: 30, color: DARK_TEXT }}>{s.title}</p>
              <p style={{ fontSize: 19, color: DARK_MUTED, lineHeight: 1.55 }}>{s.desc}</p>
              {i < 3 && (
                <div className="absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight size={24} style={{ color: `hsl(${TEAL} / 0.4)` }} />
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
// SLIDE 8 — CATEGORY VALIDATION ($98M+ invested)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide08() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Category Validation</p>

        <h2 className="font-black mb-4" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          $98M+ invested into this category.<br />
          <span style={{ color: `hsl(${GREEN})` }}>Four approaches. One missing layer.</span>
        </h2>

        <div className="grid grid-cols-4 gap-4 mb-6 flex-1 min-h-0">
          {[
            {
              name: "Interloom", funding: "$19.5M", investors: "DN Capital, Air Street",
              approach: "Back-Office Automation", color: BLUE,
              desc: "Context graphs for repeatable ops. Facility mgmt, insurance, banking.",
              gap: "Handles the predictable. Not judgment.",
            },
            {
              name: "Edra.ai", funding: "$30M", investors: "Sequoia, 8VC, HubSpot",
              approach: "Process Mining", color: GREEN,
              desc: "Ex-Palantir. Mines IT tickets and data exhaust to auto-generate SOPs.",
              gap: "Mines what happened. Doesn't govern what should.",
            },
            {
              name: "Mem0.ai", funding: "$44.5M", investors: "Basis Set, YC, Peak XV",
              approach: "Memory Infrastructure", color: SEAFOAM,
              desc: "Developer tooling. Gives AI agents persistent memory across sessions.",
              gap: "Remembers what was said. Doesn't encode expertise.",
            },
            {
              name: "Paradox", funding: "~$3.8M", investors: "Speedinvest",
              approach: "Organizational Theory", color: GOLD,
              desc: "Copenhagen. Researches strategic drift and shared world models. Pre-product.",
              gap: "Studies why alignment breaks. Doesn't fix it.",
            },
          ].map(({ name, funding, investors, approach, color, desc, gap }) => (
            <div key={name} className="rounded-2xl border p-6 flex flex-col"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.03)` }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>{name}</p>
                <span className="font-black" style={{ fontSize: 18, color: `hsl(${color})` }}>{funding}</span>
              </div>
              <p style={{ fontSize: 13, color: SUBTLE, marginBottom: 6 }}>{investors}</p>
              <p className="font-semibold mb-2" style={{ fontSize: 15, color: `hsl(${color})` }}>{approach}</p>
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.4, flex: 1 }}>{desc}</p>
              <div className="mt-3 pt-3 border-t" style={{ borderColor: `hsl(${color} / 0.15)` }}>
                <p className="font-semibold" style={{ fontSize: 14, color: `hsl(${WARM})` }}>{gap}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border p-6 flex items-center gap-8"
          style={{ borderColor: `hsl(${TEAL} / 0.3)`, background: `hsl(${TEAL} / 0.04)` }}>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <p className="font-black" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>LIZA OS</p>
              <span className="font-semibold px-3 py-1 rounded-full" style={{ fontSize: 13, background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>The Governance Layer</span>
            </div>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.5 }}>
              Only LIZA governs the messy reality — encoding judgment, propagating changes, and fusing How and What
              into governed AI execution. <strong style={{ color: TEXT }}>Infrastructure, not features.</strong>
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-1 px-6 py-4 rounded-xl" style={{ background: `hsl(${GREEN} / 0.06)` }}>
            <p className="font-black" style={{ fontSize: 36, color: `hsl(${GREEN})` }}>$98M+</p>
            <p style={{ fontSize: 14, color: MUTED }}>Category investment</p>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — EARLY VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

function Slide09() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-14">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Early Validation</p>

        <h2 className="font-black mb-8" style={{ fontSize: 50, color: DARK_TEXT, lineHeight: 1.05 }}>
          Not theoretical demand.<br />
          <span style={{ color: `hsl(${GREEN})` }}>Real-world signal across verticals.</span>
        </h2>

        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          {[
            {
              title: "Enterprise A — Global AEC Software (€6B Group)",
              color: TEAL,
              stats: "200+ employees · 16 VP-level attendees · 107-min first session",
              points: [
                "Design partnership: post-merger integration across 4 departments",
                "AI learned governance rules in real-time during first session",
                "VP Product now serves as Strategic Advisor to LIZA OS",
              ],
            },
            {
              title: "Enterprise B — Executive Search Firm",
              color: GREEN,
              stats: "Boutique firm · Senior partner engagement",
              points: [
                "Encoded senior partner's candidate evaluation judgment into playbooks",
                "New associates running searches at senior quality from week 2",
                "Validated onboarding accelerator use case",
              ],
            },
            {
              title: "Enterprise C — Professional Services Consultancy",
              color: GOLD,
              stats: "Mid-market · Multi-team deployment",
              points: [
                "Delivery methodology encoded into executable protocols",
                "Client communication playbooks reduced escalations",
                "Validated professional services delivery use case",
              ],
            },
            {
              title: "Enterprise D — B2B Sales Organization",
              color: TEAL,
              stats: "SaaS company · Sales team pilot",
              points: [
                "Top seller's deal qualification judgment encoded for entire team",
                "Competitive positioning playbooks updated from live deal feedback",
                "Validated sales playbook use case",
              ],
            },
          ].map(({ title, color, stats, points }) => (
            <div key={title} className="rounded-2xl border p-7"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
              <p className="font-bold mb-1" style={{ fontSize: 22, color: DARK_TEXT }}>{title}</p>
              <p className="mb-3" style={{ fontSize: 17, color: `hsl(${color})` }}>{stats}</p>
              {points.map((p, i) => (
                <p key={i} className="flex items-start gap-2.5 mb-1.5" style={{ fontSize: 18, color: DARK_MUTED }}>
                  <span className="font-bold shrink-0" style={{ color: `hsl(${color})` }}>→</span> {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border px-8 py-4 flex items-center gap-6"
          style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.04)` }}>
          <Target size={28} style={{ color: `hsl(${GOLD})`, flexShrink: 0 }} />
          <p style={{ fontSize: 19, color: DARK_MUTED }}>
            <strong style={{ color: DARK_TEXT }}>Same core problem in every vertical:</strong> How and What are separated.
            AI amplifies the gap. LIZA closes it.
          </p>
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — VERTICAL EXPANSION (problem-first framing)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide10() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Vertical Expansion</p>

        <h2 className="font-black mb-6" style={{ fontSize: 50, color: TEXT, lineHeight: 1.05 }}>
          Every industry has this problem.<br/>
          <span style={{ color: `hsl(${GREEN})` }}>Here's what the new way looks like.</span>
        </h2>

        <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">
          {[
            {
              vertical: "Professional Services", status: "Deployed", color: GREEN,
              problem: "Senior consultants carry the delivery methodology in their heads. Juniors can't replicate quality without years of shadowing.",
              newWay: "LIZA captures senior judgment into executable protocols. New consultants deliver at senior quality from week 2.",
            },
            {
              vertical: "Sales Operations", status: "Deployed", color: GREEN,
              problem: "Top sellers have instincts for deal qualification, objection handling, competitive positioning. Rest of the team guesses.",
              newWay: "LIZA encodes the best seller's playbook. AI executes with their judgment. The whole team levels up.",
            },
            {
              vertical: "Pharma & Biotech", status: "Validated", color: GOLD,
              problem: "GxP compliance requires audit-ready documentation. Every AI-generated output needs traceable expertise provenance.",
              newWay: "LIZA connects regulatory expertise to AI execution. Audit trails built in. 18-day audits compressed to hours.",
            },
            {
              vertical: "Food Safety & Manufacturing", status: "Validated", color: GOLD,
              problem: "Supplier audits depend on senior inspectors' judgment. ISO 22000/HACCP expertise doesn't scale to junior staff.",
              newWay: "LIZA encodes audit judgment into governed AI protocols. Junior inspectors execute at expert quality.",
            },
          ].map(({ vertical, status, color, problem, newWay }) => (
            <div key={vertical} className="rounded-xl border p-6 flex flex-col"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.03)` }}>
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>{vertical}</p>
                <span className="px-2.5 py-1 rounded-full font-semibold" style={{ fontSize: 13, background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}>{status}</span>
              </div>
              <div className="flex items-start gap-2.5 mb-3">
                <AlertTriangle size={18} style={{ color: `hsl(${WARM})`, flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.45 }}><strong style={{ color: TEXT }}>The problem:</strong> {problem}</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={18} style={{ color: `hsl(${color})`, flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.45 }}><strong style={{ color: `hsl(${color})` }}>With LIZA:</strong> {newWay}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border px-6 py-4 flex items-center gap-5"
          style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.04)` }}>
          <TrendingUp size={24} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
          <p style={{ fontSize: 18, color: MUTED }}>
            <strong style={{ color: TEXT }}>Same core engine. Industry-specific expertise packs.</strong>{" "}
            Each vertical deepens the moat. Capital-efficient expansion into multi-billion-dollar compliance markets.
          </p>
        </div>
      </div>
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — WHAT'S ALREADY BUILT
// ═══════════════════════════════════════════════════════════════════════════════

function Slide11() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>What's Already Built</p>
        <h2 className="font-bold mb-8" style={{ fontSize: 64, color: TEXT, lineHeight: 1.1 }}>
          This isn't a slide deck.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>The product is live.</span>
        </h2>

        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          {[
            {
              layer: "Knowledge Graph", color: ACCENT,
              icon: <Layers size={36} />,
              desc: "Living organizational memory. Standards, playbooks, cultural principles. Versioned, auditable, propagated in real-time.",
            },
            {
              layer: "Context Engine (AACE v3.1)", color: GREEN,
              icon: <Workflow size={36} />,
              desc: "Proprietary specification. Intent-locking ensures AI stays on-task. Hierarchical knowledge injection. The IP moat.",
            },
            {
              layer: "Protocol-Driven Workbooks", color: GOLD,
              icon: <Target size={36} />,
              desc: "Model-agnostic execution (GPT, Gemini, Claude). Group collaboration with AI and humans in the same workspace.",
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
                <p className="font-bold mb-2" style={{ fontSize: 26, color: TEXT }}>{layer}</p>
                <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6 mt-5">
          {[
            { label: "AI Standards Diagnostic", desc: "Live lead-gen tool. Teams self-assess AI maturity across 5 dimensions.", color: GOLD },
            { label: "Marketing Website + Use Cases", desc: "7 compounding use cases. Full positioning live at lizaos.ai.", color: ACCENT },
          ].map(({ label, desc, color }) => (
            <div key={label} className="flex-1 rounded-xl border px-6 py-4 flex items-center gap-4"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
              <Lightbulb size={24} style={{ color: `hsl(${color})`, flexShrink: 0 }} />
              <div>
                <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>{label}</p>
                <p style={{ fontSize: 17, color: MUTED }}>{desc}</p>
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
// SLIDE 12 — TEAM & TRACTION
// ═══════════════════════════════════════════════════════════════════════════════

function Slide12() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>Team & Traction</p>

        <h2 className="font-black mb-8" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          Built by practitioners.<br/>
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

          <div className="w-[480px] flex flex-col gap-5">
            <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${GREEN})`, letterSpacing: "0.15em" }}>TRACTION</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { stat: "15+", label: "Clients", icon: <Users size={20} /> },
                { stat: "8", label: "Countries", icon: <Globe size={20} /> },
                { stat: "15+ yrs", label: "Consulting depth", icon: <Briefcase size={20} /> },
              ].map(({ stat, label, icon }) => (
                <div key={label} className="text-center rounded-xl px-3 py-4" style={{ background: `hsl(${TEAL} / 0.05)`, border: `1px solid hsl(${TEAL} / 0.12)` }}>
                  <div className="flex justify-center mb-2" style={{ color: `hsl(${TEAL})` }}>{icon}</div>
                  <p className="font-black" style={{ fontSize: 32, color: TEXT }}>{stat}</p>
                  <p style={{ fontSize: 14, color: MUTED }}>{label}</p>
                </div>
              ))}
            </div>
            {[
              { title: "Capital Efficiency", desc: "Built entire product, marketing, diagnostic tool, and enterprise pipeline with near-zero burn.", color: GREEN },
              { title: "AACE v3.1 Spec", desc: "Proprietary context specification. Intent-locking, hierarchical knowledge injection, drift detection.", color: TEAL },
              { title: "AI Standards Diagnostic", desc: "Live lead-gen tool. Funnel from self-assessment to pilot engagement.", color: GREEN },
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
// SLIDE 13 — USE OF FUNDS (€1.5M from seed deck)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide13() {
  const allocations = [
    { label: "Customer Acquisition", pct: 40, amt: "€600K", desc: "Close 15-20 pilot customers via diagnostic-to-pilot funnel. Convert enterprise validation into revenue. Prove retention and expansion.", color: ACCENT },
    { label: "Product Hardening", pct: 30, amt: "€450K", desc: "Stabilize core platform. Complete SECI flywheel (after-action synthesis, smart ingestion). Production-grade multi-tenant deployment.", color: GREEN },
    { label: "GTM Foundation", pct: 20, amt: "€300K", desc: "Case study production. Diagnostic funnel optimization. First channel partner program. Industry-specific playbook packs.", color: GOLD },
    { label: "Operations", pct: 10, amt: "€150K", desc: "Legal, IP protection, EU AI Act compliance groundwork, financial management.", color: MUTED },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>Use of Funds</p>
        <h2 className="font-bold mb-10" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
          €1.5M. 18-month runway.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>From validation to scale.</span>
        </h2>

        <div className="flex gap-12 flex-1">
          <div className="flex flex-col items-center justify-center w-[360px] shrink-0">
            <svg width="320" height="320" viewBox="0 0 320 320">
              {(() => {
                const total = 100; let startAngle = -90;
                const colors = [`hsl(${ACCENT})`, `hsl(${GREEN})`, `hsl(${GOLD})`, "hsl(215 10% 65%)"];
                return allocations.map(({ pct, label }, i) => {
                  const angle = (pct / total) * 360;
                  const endAngle = startAngle + angle;
                  const r = 140; const cx = 160; const cy = 160; const inner = 85;
                  const toRad = (deg: number) => (deg * Math.PI) / 180;
                  const x1 = cx + r * Math.cos(toRad(startAngle));
                  const y1 = cy + r * Math.sin(toRad(startAngle));
                  const x2 = cx + r * Math.cos(toRad(endAngle));
                  const y2 = cy + r * Math.sin(toRad(endAngle));
                  const xi1 = cx + inner * Math.cos(toRad(startAngle));
                  const yi1 = cy + inner * Math.sin(toRad(startAngle));
                  const xi2 = cx + inner * Math.cos(toRad(endAngle));
                  const yi2 = cy + inner * Math.sin(toRad(endAngle));
                  const largeArc = angle > 180 ? 1 : 0;
                  const d = `M${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} L${xi2},${yi2} A${inner},${inner} 0 ${largeArc},0 ${xi1},${yi1} Z`;
                  startAngle = endAngle;
                  return <path key={label} d={d} fill={colors[i]} opacity={0.8} />;
                });
              })()}
              <text x="160" y="152" textAnchor="middle" fill={TEXT} fontSize="34" fontWeight="900">€1.5M</text>
              <text x="160" y="180" textAnchor="middle" fill={MUTED} fontSize="20">Seed</text>
            </svg>
            <div className="flex flex-col gap-2 mt-3">
              {allocations.map(({ label, pct, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${color})` }} />
                  <span style={{ fontSize: 20, color: MUTED }}>{pct}% {label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5 flex-1">
            {allocations.map(({ label, pct, amt, desc, color }) => (
              <div key={label} className="flex gap-6 rounded-xl border p-6"
                style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
                <div className="shrink-0 flex flex-col items-center gap-1 w-24">
                  <span className="font-black" style={{ fontSize: 36, color: `hsl(${color})`, lineHeight: 1 }}>{pct}%</span>
                  <span className="font-bold" style={{ fontSize: 22, color: `hsl(${color} / 0.7)` }}>{amt}</span>
                </div>
                <div>
                  <p className="font-bold mb-1" style={{ fontSize: 26, color: TEXT }}>{label}</p>
                  <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>{desc}</p>
                </div>
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
// SLIDE 14 — THE ASK (€1.5M)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide14() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${MINT}), transparent 70%)` }} />

      <div className="relative z-10 w-full px-28">
        <div className="text-center mb-10">
          <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 24, color: `hsl(${GREEN} / 0.8)` }}>Seed Round</p>
          <h2 className="font-black mb-4" style={{ fontSize: 96, color: DARK_TEXT }}>€1.5M</h2>
          <p style={{ fontSize: 26, color: DARK_MUTED }}>
            Post-money SAFE &nbsp;·&nbsp; 18-month runway &nbsp;·&nbsp; Series A readiness
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { month: "Month 1-6", target: "€200-400K ARR", milestone: "5-8 paying customers. First 2 case studies. Diagnostic funnel converting.", color: TEAL },
            { month: "Month 7-12", target: "€600K-1M ARR", milestone: "15+ customers across 3+ verticals. Net retention >120%. Channel partner live.", color: SEAFOAM },
            { month: "Month 13-18", target: "€1-1.5M ARR", milestone: "25+ customers. Series A raise. First vertical playbook packs shipping.", color: MINT },
          ].map(({ month, target, milestone, color }) => (
            <div key={month} className="rounded-xl border p-6"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
              <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{month}</p>
              <p className="font-black mt-2" style={{ fontSize: 32, color: DARK_TEXT }}>{target}</p>
              <p className="mt-3" style={{ fontSize: 17, color: DARK_MUTED, lineHeight: 1.45 }}>{milestone}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { label: "Structure", val: "SAFE", sub: "Standard post-money SAFE. Clean, fast, founder-friendly.", color: GREEN },
            { label: "What We Need", val: "Smart Capital", sub: "Investors who understand that the next platform company won't look like a SaaS tool.", color: ACCENT },
            { label: "What You Get", val: "Ground Floor", sub: "The instruction layer for AI-native organizations. Pre-revenue valuation. Maximum upside.", color: GOLD },
          ].map(({ label, val, sub, color }) => (
            <div key={label} className="rounded-xl border p-6"
              style={{ borderColor: `hsl(${color} / 0.25)`, background: `hsl(${color} / 0.08)` }}>
              <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{label}</p>
              <p className="font-black mt-1" style={{ fontSize: 36, color: DARK_TEXT, lineHeight: 1.1 }}>{val}</p>
              <p className="mt-2" style={{ fontSize: 17, color: DARK_MUTED, lineHeight: 1.45 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl px-10 py-5 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
          <p style={{ fontSize: 22, color: DARK_TEXT, lineHeight: 1.5 }}>
            AI does what you tell it. $100B+ manages outputs. Zero manages the instructions.<br />
            <strong style={{ color: `hsl(${TEAL})` }}>We're building the instruction layer.</strong>
          </p>
        </div>

        <p className="mt-6 text-center" style={{ fontSize: 18, color: DARK_SUBTLE }}>
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
  { id: 2, title: "Outputs vs Instructions", component: <Slide02 /> },
  { id: 3, title: "The Human Instruction Layer", component: <Slide03 /> },
  { id: 4, title: "AI Invents the Rest", component: <Slide04 /> },
  { id: 5, title: "The Proof", component: <Slide05 /> },
  { id: 6, title: "The Instruction Layer", component: <Slide06 /> },
  { id: 7, title: "The Solution", component: <Slide07 /> },
  { id: 8, title: "Category Validation", component: <Slide08 /> },
  { id: 9, title: "Early Validation", component: <Slide09 /> },
  { id: 10, title: "Vertical Problems", component: <Slide10 /> },
  { id: 11, title: "What's Built", component: <Slide11 /> },
  { id: 12, title: "Team & Traction", component: <Slide12 /> },
  { id: 13, title: "Use of Funds", component: <Slide13 /> },
  { id: 14, title: "The Ask", component: <Slide14 /> },
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Lifecycle-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <h2 className="font-bold" style={{ fontSize: 20, color: TEXT }}>LIZA OS — Lifecycle Investor Deck</h2>
          <div className="flex items-center gap-3">
            <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Lifecycle-Deck" slideCount={SLIDES.length} />
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
          <span className="font-bold" style={{ fontSize: 16, color: TEXT }}>LIZA OS — Lifecycle Deck</span>
          <span className="font-mono text-sm px-3 py-1 rounded-lg" style={{ background: CHROME_BG, color: MUTED }}>
            {current + 1} / {SLIDES.length}
          </span>
          <span className="font-medium" style={{ fontSize: 14, color: SUBTLE }}>{slide.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Lifecycle-Deck" slideCount={SLIDES.length} />
          <Button variant="outline" size="sm" onClick={() => setShowGrid(true)}>
            <Grid3x3 size={16} className="mr-1.5" /> Grid
          </Button>
          <Button variant="outline" size="sm" onClick={enterFullscreen}>
            <Maximize2 size={16} className="mr-1.5" /> Present
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 min-h-0">
        <button onClick={prev} disabled={current === 0} className="p-2 mr-4 rounded-full disabled:opacity-20 hover:bg-white/60 transition shrink-0">
          <ChevronLeft size={28} style={{ color: MUTED }} />
        </button>
        <div className="flex-1 max-w-[1400px] rounded-xl overflow-hidden shadow-lg border" style={{ borderColor: CHROME_BORDER, aspectRatio: "16/9" }}>
          <ScaledSlide>{slide.component}</ScaledSlide>
        </div>
        <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 ml-4 rounded-full disabled:opacity-20 hover:bg-white/60 transition shrink-0">
          <ChevronRight size={28} style={{ color: MUTED }} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 py-3">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className="rounded-full transition-all"
            style={{
              width: i === current ? 28 : 10, height: 10,
              background: i === current ? `hsl(${TEAL})` : `hsl(215 10% 80%)`,
            }} />
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
