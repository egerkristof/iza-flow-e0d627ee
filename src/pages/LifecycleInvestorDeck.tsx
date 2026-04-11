import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  ArrowRight, BookOpen, Network, Zap, RefreshCw,
  AlertTriangle, CheckCircle2, DollarSign,
  Users, Globe, Briefcase, Building2, TrendingUp, Target, Shield,
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

        <h1 className="font-black mb-10" style={{ fontSize: 88, lineHeight: 1.05, color: DARK_TEXT }}>
          Your best people's expertise<br />
          runs your business.<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI is about to break that.
          </span>
        </h1>

        <p className="mb-14" style={{ fontSize: 32, color: DARK_MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          We're building the management layer for organizational expertise<br />
          in the age of AI.
        </p>

        <p style={{ fontSize: 20, color: DARK_SUBTLE }}>
          Confidential &nbsp;·&nbsp; Seed Round &nbsp;·&nbsp; €300K
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — TWO SYSTEMS EXIST TODAY
// ═══════════════════════════════════════════════════════════════════════════════

function Slide02() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>The Starting Point</p>

        <h2 className="font-black mb-4" style={{ fontSize: 55, color: TEXT, lineHeight: 1.05 }}>
          Every company runs on two things:<br />
          <span style={{ color: `hsl(${BLUE})` }}>what you produce</span> and{" "}
          <span style={{ color: `hsl(${TEAL})` }}>how you produce it.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 24, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          And for each side, there are billion-dollar systems. But they solve fundamentally different problems.
        </p>

        <div className="flex-1 flex gap-10 items-stretch">
          {/* WHAT side */}
          <div className="flex-1 rounded-2xl border p-10 flex flex-col" style={{ borderColor: `hsl(${BLUE} / 0.25)`, background: `hsl(${BLUE} / 0.04)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-4" style={{ fontSize: 18, color: `hsl(${BLUE})` }}>
              "What" Systems — manage your outputs
            </p>
            <div className="flex flex-col gap-3 flex-1">
              {[
                { label: "ALM", desc: "Application Lifecycle Management — code, releases, CI/CD" },
                { label: "PLM", desc: "Product Lifecycle Management — parts, BOMs, change orders" },
                { label: "GxP", desc: "Regulated docs — audit trails, SOPs, compliance records" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 px-5 py-4 rounded-lg" style={{ background: `hsl(${BLUE} / 0.06)` }}>
                  <span className="font-black shrink-0 mt-0.5" style={{ fontSize: 18, color: `hsl(${BLUE})` }}>{item.label}</span>
                  <span className="font-medium" style={{ fontSize: 20, color: TEXT }}>{item.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 px-5 py-3 rounded-lg" style={{ background: `hsl(${BLUE} / 0.08)` }}>
              <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${BLUE})` }}>
                Strength: governs the output criteria. Quality gates, versioning, approvals.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex flex-col items-center justify-center gap-3 px-2">
            <div className="w-0.5 flex-1" style={{ background: `hsl(215 10% 85%)` }} />
            <p className="font-bold text-center" style={{ fontSize: 15, color: SUBTLE }}>separate<br/>worlds</p>
            <div className="w-0.5 flex-1" style={{ background: `hsl(215 10% 85%)` }} />
          </div>

          {/* HOW side */}
          <div className="flex-1 rounded-2xl border p-10 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.04)` }}>
            <p className="font-bold tracking-[0.2em] uppercase mb-4" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>
              "How" Systems — manage your expertise
            </p>
            <div className="flex flex-col gap-3 flex-1">
              {[
                { label: "Wiki", desc: "Confluence, Notion — process docs, playbooks, how-to guides" },
                { label: "Tribal", desc: "Expertise that lives in people's heads — never written down" },
                { label: "Training", desc: "Onboarding decks, mentorship, shadowing, 'ask Sarah'" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 px-5 py-4 rounded-lg" style={{ background: `hsl(${TEAL} / 0.06)` }}>
                  <span className="font-black shrink-0 mt-0.5" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>{item.label}</span>
                  <span className="font-medium" style={{ fontSize: 20, color: TEXT }}>{item.desc}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 px-5 py-3 rounded-lg" style={{ background: `hsl(${TEAL} / 0.08)` }}>
              <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${TEAL})` }}>
                Strength: captures some of the inputs. But incomplete, static, open-ended.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p style={{ fontSize: 22, color: MUTED }}>
            <span className="font-bold" style={{ color: `hsl(${BLUE})` }}>$100B+</span> manages the outputs.{" "}
            <span className="font-bold" style={{ color: `hsl(${TEAL})` }}>Near $0</span> manages the expertise.{" "}
            For decades, it didn't matter — because of one thing.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — THE HUMAN BRIDGE (seniors connected the two sides)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide03() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>The Human Era</p>

        <h2 className="font-black mb-4" style={{ fontSize: 55, color: DARK_TEXT, lineHeight: 1.05 }}>
          Senior people were the bridge<br/>
          <span style={{ color: `hsl(${GREEN})` }}>between How and What.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 23, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Your best people read incomplete docs, filled in the gaps from experience, and slowly produced
          quality outputs. Even if only 50-80% of expertise was written down, it was enough — they carried the rest.
        </p>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-5 w-full max-w-[1500px]">
            {/* How side */}
            <div className="w-[280px] rounded-2xl border p-7 text-center" style={{ borderColor: `hsl(200 15% 16%)`, background: `hsl(200 25% 10%)` }}>
              <p className="font-bold tracking-[0.15em] uppercase mb-3" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>How Side</p>
              <p style={{ fontSize: 48 }}>📄</p>
              <p className="font-bold mt-3" style={{ fontSize: 20, color: DARK_TEXT }}>50-80% captured</p>
              <p className="mt-1" style={{ fontSize: 16, color: DARK_MUTED }}>Wikis, SOPs, tribal knowledge</p>
              <p className="mt-2 font-semibold" style={{ fontSize: 15, color: `hsl(${WARM})` }}>Incomplete. Static. Implicit.</p>
            </div>

            <ArrowRight size={24} style={{ color: DARK_MUTED, flexShrink: 0 }} />

            {/* The Bridge */}
            <div className="flex-1 rounded-2xl border-2 p-8 text-center" style={{ borderColor: `hsl(${GREEN} / 0.4)`, background: `hsl(${GREEN} / 0.08)` }}>
              <p style={{ fontSize: 48 }}>🧠</p>
              <p className="font-bold mt-3" style={{ fontSize: 26, color: `hsl(${GREEN})` }}>The Human Bridge</p>
              <p className="mt-2" style={{ fontSize: 19, color: DARK_TEXT }}>
                Senior people <strong>read</strong> the incomplete docs,<br/>
                <strong>filled in</strong> the missing 20-50% from experience,<br/>
                and <strong>slowly produced</strong> each output manually.
              </p>
              <div className="mt-4 flex gap-3 justify-center">
                <span className="px-4 py-2 rounded-lg font-semibold" style={{ fontSize: 15, background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})` }}>
                  Interprets ambiguity
                </span>
                <span className="px-4 py-2 rounded-lg font-semibold" style={{ fontSize: 15, background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})` }}>
                  Fills in gaps
                </span>
                <span className="px-4 py-2 rounded-lg font-semibold" style={{ fontSize: 15, background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})` }}>
                  Quality-checks output
                </span>
              </div>
            </div>

            <ArrowRight size={24} style={{ color: DARK_MUTED, flexShrink: 0 }} />

            {/* What side */}
            <div className="w-[280px] rounded-2xl border p-7 text-center" style={{ borderColor: `hsl(200 15% 16%)`, background: `hsl(200 25% 10%)` }}>
              <p className="font-bold tracking-[0.15em] uppercase mb-3" style={{ fontSize: 14, color: `hsl(${BLUE})` }}>What Side</p>
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
            Slow execution. Incomplete documentation. But humans <strong style={{ color: DARK_TEXT }}>compensated for both</strong>.
          </p>
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — LLMs BREAK BOTH SIDES
// ═══════════════════════════════════════════════════════════════════════════════

function Slide04() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${WARM})` }}>The AI Disruption</p>

        <h2 className="font-black mb-4" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          LLMs sit right in the middle —<br/>
          <span style={{ color: `hsl(${WARM})` }}>and they break both sides.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 23, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          LLMs are designed to fill in missing context. Whatever you don't define, they pull from general knowledge.
          This is both their power and their danger.
        </p>

        <div className="flex-1 flex gap-6 items-stretch">
          {/* HOW side problem */}
          <div className="flex-1 rounded-2xl border p-8 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.04)` }}>
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle size={22} style={{ color: `hsl(${WARM})` }} />
              <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>From the "How" side</p>
            </div>
            <p className="font-bold mb-4" style={{ fontSize: 22, color: TEXT }}>Not all your expertise is written down.</p>
            <div className="flex flex-col gap-2.5 flex-1">
              {[
                "Good documentation captures 80-90% of knowledge",
                "Average companies capture maybe 50%",
                "That was fine when humans filled the gap",
                "But LLMs can't fill what they don't know",
                "The missing 20-50% becomes ungoverned AI behavior",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: i >= 3 ? `hsl(${WARM} / 0.06)` : `hsl(${TEAL} / 0.06)` }}>
                  {i >= 3 ? <X size={16} style={{ color: `hsl(${WARM})`, flexShrink: 0 }} /> : <CheckCircle2 size={16} style={{ color: `hsl(${TEAL})`, flexShrink: 0 }} />}
                  <span style={{ fontSize: 18, color: TEXT }}>{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-semibold text-center" style={{ fontSize: 16, color: `hsl(${WARM})` }}>
              Problem: Missing knowledge = ungoverned AI execution
            </p>
          </div>

          {/* LLM in the middle */}
          <div className="w-[260px] rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center"
            style={{ borderColor: `hsl(${WARM} / 0.5)`, background: `hsl(${WARM} / 0.04)` }}>
            <p style={{ fontSize: 56 }}>🤖</p>
            <p className="font-black mt-3" style={{ fontSize: 26, color: `hsl(${WARM})` }}>The LLM</p>
            <p className="mt-3 font-semibold" style={{ fontSize: 17, color: TEXT }}>
              Undefined how
            </p>
            <p className="font-bold" style={{ fontSize: 15, color: MUTED }}>creates</p>
            <p className="font-semibold" style={{ fontSize: 17, color: TEXT }}>
              undefined whats
            </p>
            <div className="mt-5 px-4 py-3 rounded-lg w-full" style={{ background: `hsl(${WARM} / 0.1)` }}>
              <p style={{ fontSize: 14, color: `hsl(${WARM})`, lineHeight: 1.4 }}>
                LLMs fill in whatever context you don't provide — from general training data, not your expertise
              </p>
            </div>
          </div>

          {/* WHAT side problem */}
          <div className="flex-1 rounded-2xl border p-8 flex flex-col" style={{ borderColor: `hsl(${BLUE} / 0.25)`, background: `hsl(${BLUE} / 0.04)` }}>
            <div className="flex items-center gap-3 mb-5">
              <AlertTriangle size={22} style={{ color: `hsl(${WARM})` }} />
              <p className="font-bold tracking-[0.15em] uppercase" style={{ fontSize: 16, color: `hsl(${BLUE})` }}>From the "What" side</p>
            </div>
            <p className="font-bold mb-4" style={{ fontSize: 22, color: TEXT }}>Your output systems aren't designed for AI speed.</p>
            <div className="flex flex-col gap-2.5 flex-1">
              {[
                "Output criteria are defined well — quality gates, approvals",
                "But humans had time for revisions and manual reviews",
                "AI produces 50 artifacts in an hour, not 1 per week",
                "Your What systems can't govern at that velocity",
                "AI fills missing context from general knowledge — uncontrolled",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: i >= 2 ? `hsl(${WARM} / 0.06)` : `hsl(${BLUE} / 0.06)` }}>
                  {i >= 2 ? <X size={16} style={{ color: `hsl(${WARM})`, flexShrink: 0 }} /> : <CheckCircle2 size={16} style={{ color: `hsl(${BLUE})`, flexShrink: 0 }} />}
                  <span style={{ fontSize: 18, color: TEXT }}>{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-semibold text-center" style={{ fontSize: 16, color: `hsl(${WARM})` }}>
              Problem: Missing governance = ungoverned AI outputs
            </p>
          </div>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — THE CONSEQUENCE + THE FUSION
// ═══════════════════════════════════════════════════════════════════════════════

function Slide05() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${WARM})` }}>The Consequence</p>

        <h2 className="font-black mb-4" style={{ fontSize: 50, color: DARK_TEXT, lineHeight: 1.05 }}>
          You can't solve this from either side alone.<br/>
          <span style={{ color: `hsl(${WARM})` }}>AI fused the How and the What.</span>
        </h2>

        <div className="flex gap-6 mb-6">
          {/* Regulated consequence */}
          <div className="flex-1 rounded-2xl border p-7" style={{ borderColor: `hsl(${BLUE} / 0.2)`, background: `hsl(${BLUE} / 0.06)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-3" style={{ fontSize: 15, color: `hsl(${BLUE})` }}>Highly Regulated Industries</p>
            <p className="font-bold mb-3" style={{ fontSize: 24, color: DARK_TEXT }}>Pharma, Aviation, Finance, Software</p>
            <p className="mb-3" style={{ fontSize: 18, color: DARK_MUTED, lineHeight: 1.5 }}>
              Traditionally: slow, painstaking process to ensure every output meets quality standards.
              Months of manual reviews and approvals.
            </p>
            <div className="px-4 py-3 rounded-lg" style={{ background: `hsl(${WARM} / 0.08)` }}>
              <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${WARM})` }}>
                With AI: Speed is possible — but the quality infrastructure wasn't built for it.
                AI can produce fast, but who governs correctness?
              </p>
            </div>
          </div>

          {/* Non-regulated consequence */}
          <div className="flex-1 rounded-2xl border p-7" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.06)` }}>
            <p className="font-bold tracking-[0.15em] uppercase mb-3" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>Less Regulated Industries</p>
            <p className="font-bold mb-3" style={{ fontSize: 24, color: DARK_TEXT }}>Sales, Marketing, Consulting, Services</p>
            <p className="mb-3" style={{ fontSize: 18, color: DARK_MUTED, lineHeight: 1.5 }}>
              Traditionally: hard to get consistently good outputs.
              Quality varied by person, by day, by mood.
            </p>
            <div className="px-4 py-3 rounded-lg" style={{ background: `hsl(${WARM} / 0.08)` }}>
              <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${WARM})` }}>
                With AI: Inconsistency at scale. AI produces more, faster — but without
                encoded expertise, quality is even more unpredictable.
              </p>
            </div>
          </div>
        </div>

        {/* The fusion insight */}
        <div className="flex-1 flex gap-6">
          <div className="flex-1 rounded-2xl border p-7 flex items-center gap-8"
            style={{ borderColor: `hsl(${WARM} / 0.3)`, background: `hsl(${WARM} / 0.06)` }}>
            <div className="shrink-0">
              <AlertTriangle size={44} style={{ color: `hsl(${WARM})` }} />
            </div>
            <div>
              <p className="font-black mb-2" style={{ fontSize: 24, color: DARK_TEXT }}>
                Build on your "How" infrastructure?
              </p>
              <p style={{ fontSize: 18, color: DARK_MUTED, lineHeight: 1.5 }}>
                Notion, Confluence, wikis — they were never designed to feed AI.
                You'll struggle to make outputs governed and aligned as things change.
              </p>
            </div>
          </div>
          <div className="flex-1 rounded-2xl border p-7 flex items-center gap-8"
            style={{ borderColor: `hsl(${WARM} / 0.3)`, background: `hsl(${WARM} / 0.06)` }}>
            <div className="shrink-0">
              <AlertTriangle size={44} style={{ color: `hsl(${WARM})` }} />
            </div>
            <div>
              <p className="font-black mb-2" style={{ fontSize: 24, color: DARK_TEXT }}>
                Build on your "What" infrastructure?
              </p>
              <p style={{ fontSize: 18, color: DARK_MUTED, lineHeight: 1.5 }}>
                ALM, PLM, GxP — they manage outputs, not expertise.
                You'll never scale the "how" good enough from the output side.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl px-8 py-4 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
          <p className="font-bold" style={{ fontSize: 22, color: DARK_TEXT }}>
            In the age of AI, How and What are <span style={{ color: `hsl(${TEAL})` }}>fused</span>.
            You need new infrastructure that <span style={{ color: `hsl(${TEAL})` }}>joins them</span>.
            And you can't afford not to — because the world has already sped up.
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — THIS PROBLEM HAS BEEN SOLVED BEFORE (ALM → PLM → ??? pattern)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide06() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL})` }}>The Opportunity</p>

        <h2 className="font-black mb-6" style={{ fontSize: 55, color: TEXT, lineHeight: 1.05 }}>
          This exact problem has been solved before —<br />
          <span style={{ color: `hsl(${TEAL})` }}>and each time, it created a massive market.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 23, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Whenever a critical business layer got version control, governance, and change management, it became a multi-billion dollar
          infrastructure category. Expertise is the next layer.
        </p>

        <div className="flex gap-4 mb-8">
          {[
            { era: "1990s", name: "ALM", what: "Code", market: "$34B", color: BLUE, desc: "Developers needed version control, testing, CI/CD. Git and Jira were born." },
            { era: "2000s", name: "PLM", what: "Physical Products", market: "$65B", color: GREEN, desc: "Engineers needed bill-of-materials tracking and change orders. Siemens, PTC emerged." },
            { era: "2010s", name: "GxP", what: "Regulated Docs", market: "$18B", color: SEAFOAM, desc: "Pharma needed audit trails and compliance management. Veeva Vault was born." },
            { era: "Now", name: "???", what: "Expertise", market: "Nothing", color: WARM, highlight: true, desc: "AI executes from organizational expertise. No infrastructure manages it." },
          ].map((item, i) => (
            <div key={item.name} className="flex-1 flex items-center gap-3">
              <div className="rounded-xl px-5 py-5 flex-1 text-center" style={{
                background: item.highlight ? `hsl(${item.color} / 0.06)` : CARD_ALT,
                border: item.highlight ? `2px dashed hsl(${item.color} / 0.4)` : `1px solid hsl(215 10% 90%)`,
              }}>
                <p className="font-bold mb-1" style={{ fontSize: 14, color: `hsl(${item.color})` }}>{item.era}</p>
                <p className="font-black" style={{ fontSize: 28, color: item.highlight ? `hsl(${item.color})` : TEXT }}>{item.name}</p>
                <p className="font-semibold" style={{ fontSize: 16, color: MUTED }}>{item.what}</p>
                <p className="font-bold mt-1" style={{ fontSize: 18, color: `hsl(${item.color})` }}>{item.market}</p>
                <p className="mt-2" style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>{item.desc}</p>
              </div>
              {i < 3 && <ArrowRight size={20} style={{ color: SUBTLE, flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        <div className="flex-1 flex gap-8">
          <div className="flex-1 rounded-2xl border-2 border-dashed p-8 flex items-center gap-8"
            style={{ borderColor: `hsl(${WARM} / 0.4)`, background: `hsl(${WARM} / 0.04)` }}>
            <AlertTriangle size={48} style={{ color: `hsl(${WARM})`, flexShrink: 0 }} />
            <div>
              <p className="font-black mb-2" style={{ fontSize: 48, color: `hsl(${WARM})`, lineHeight: 1 }}>$0</p>
              <p className="font-bold" style={{ fontSize: 22, color: TEXT }}>is spent managing the expertise that AI now executes from</p>
              <p className="mt-2" style={{ fontSize: 18, color: MUTED }}>$100B+ manages code, products, and compliance. Zero manages the expertise behind AI outputs.</p>
            </div>
          </div>
          <div className="flex-1 rounded-2xl border p-8 flex flex-col justify-center"
            style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: `hsl(${TEAL} / 0.04)` }}>
            <p className="font-bold mb-3" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>The pattern is clear</p>
            <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.6 }}>
              Every time organizations said "this is too important to manage informally,"
              an infrastructure category emerged.
              <strong style={{ color: TEXT }}> Organizational expertise is next.</strong>
            </p>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — THE SOLUTION (LIZA's 4-step loop)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide07() {
  const steps = [
    {
      icon: <BookOpen size={36} />, num: "01", title: "Capture",
      desc: "Extract how your best people actually work — from documents, conversations, and live execution.",
    },
    {
      icon: <Network size={36} />, num: "02", title: "Organize",
      desc: "Structure expertise into governed, versioned bundles that AI can actually read and follow correctly.",
    },
    {
      icon: <Zap size={36} />, num: "03", title: "Execute",
      desc: "AI generates outputs with organizational judgment built in — not from generic training, but from your expertise.",
    },
    {
      icon: <RefreshCw size={36} />, num: "04", title: "Propagate",
      desc: "When expertise evolves, every downstream output updates. When execution reveals gaps, the expertise improves.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${TEAL} / 0.8)` }}>The Solution</p>

        <h2 className="font-black mb-3" style={{ fontSize: 55, color: DARK_TEXT, lineHeight: 1.05 }}>
          LIZA makes organizational expertise{" "}
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            machine-ready.
          </span>
        </h2>
        <p className="mb-5" style={{ fontSize: 23, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          Not a chatbot. Not a wiki. The management infrastructure that makes sure AI executes with the same judgment as your best people.
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
              Only LIZA governs the messy reality — encoding judgment, propagating changes, and ensuring every LLM-generated What
              is grounded in the latest How. <strong style={{ color: TEXT }}>Infrastructure, not features.</strong>
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
// SLIDE 9 — EARLY VALIDATION (Real enterprise proof across verticals)
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
                "Design partnership: post-merger integration across 4 departments (Strategy, HR, R&D, Change Mgmt)",
                "AI learned governance rules in real-time during first engagement session",
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
            <strong style={{ color: DARK_TEXT }}>Same core problem in every vertical:</strong> scaling senior judgment beyond the individuals who carry it.
            15+ clients across 8 countries. 15+ years of consulting depth behind the platform.
          </p>
        </div>
      </div>
      <SlideBar from={GREEN} to={TEAL} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — VERTICAL EXPANSION (Honest: what's live, what's thesis)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide10() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>Vertical Expansion</p>

        <h2 className="font-black mb-6" style={{ fontSize: 52, color: TEXT, lineHeight: 1.05 }}>
          Wherever <span style={{ color: `hsl(${BLUE})` }}>Whats</span> are managed but <span style={{ color: `hsl(${TEAL})` }}>Hows</span> are not,<br/>
          <span style={{ color: `hsl(${GREEN})` }}>we're the missing layer.</span>
        </h2>

        <div className="flex gap-5 flex-1 min-h-0">
          <div className="w-[38%] flex flex-col gap-4 justify-center">
            <div className="rounded-2xl border p-6" style={{ borderColor: `hsl(${TEAL} / 0.2)`, background: `hsl(${TEAL} / 0.04)` }}>
              <p className="font-semibold mb-2" style={{ fontSize: 16, color: `hsl(${TEAL})`, letterSpacing: "0.1em" }}>THE PATTERN</p>
              <p className="font-bold mb-2" style={{ fontSize: 24, color: TEXT }}>Wherever $B infrastructure governs Whats, a How Layer is missing.</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.5 }}>
                LIZA becomes the "System of Reasoning" above existing Systems of Record. Each vertical uses the same engine
                with industry-specific playbook packs.
              </p>
            </div>
            <div className="rounded-2xl border p-6" style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.04)` }}>
              <p className="font-semibold mb-2" style={{ fontSize: 16, color: `hsl(${GOLD})`, letterSpacing: "0.1em" }}>EXPANSION STRATEGY</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.5 }}>
                Land horizontally with AI-native teams (ProServ, Sales, Consulting). Expand vertically with industry-specific compliance frameworks.
                Each vertical deepens the moat.
              </p>
            </div>
          </div>

          <div className="w-[62%] grid grid-cols-2 gap-4">
            {[
              {
                vertical: "Professional Services", status: "Deployed", color: GREEN,
                label: "Delivery Lifecycle Management",
                whatSystem: "Salesforce, HubSpot, Notion",
                example: "Senior judgment encoded into delivery protocols",
              },
              {
                vertical: "Sales Operations", status: "Deployed", color: GREEN,
                label: "Sales Execution Management",
                whatSystem: "CRM, Content Tools",
                example: "Top-seller playbooks scaled to entire team",
              },
              {
                vertical: "Pharma & Biotech", status: "Thesis", color: GOLD,
                label: "Medicine Lifecycle Management",
                whatSystem: "Veeva Vault, LIMS ($65B PLM)",
                example: "GxP audit judgment at scale — validated opportunity",
              },
              {
                vertical: "Food Safety & Manufacturing", status: "Thesis", color: GOLD,
                label: "Quality Lifecycle Management",
                whatSystem: "SAP QM, TraceGains ($18B GxP)",
                example: "Supplier audit judgment scaled to junior inspectors",
              },
            ].map(({ vertical, status, color, label, whatSystem, example }) => (
              <div key={vertical} className="rounded-xl border p-5 flex flex-col"
                style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.03)` }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold" style={{ fontSize: 20, color: TEXT }}>{vertical}</p>
                  <span className="px-2 py-0.5 rounded-full font-semibold" style={{ fontSize: 12, background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}>{status}</span>
                </div>
                <p className="font-semibold mb-2" style={{ fontSize: 15, color: `hsl(${color})` }}>{label}</p>
                <p className="mb-1" style={{ fontSize: 14, color: MUTED }}>Sits above: {whatSystem}</p>
                <p className="italic mt-auto" style={{ fontSize: 14, color: SUBTLE }}>"{example}"</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-xl border px-6 py-4 flex items-center gap-5"
          style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.04)` }}>
          <TrendingUp size={24} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
          <p style={{ fontSize: 18, color: MUTED }}>
            <strong style={{ color: TEXT }}>Each vertical is a separate wedge into a multi-billion-dollar market.</strong>{" "}
            Same core engine. Industry-specific playbooks. Capital-efficient expansion.
          </p>
        </div>
      </div>
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — TEAM & TRACTION (Real data)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide11() {
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
          {/* Team */}
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

          {/* What's Built + Traction */}
          <div className="w-[480px] flex flex-col gap-5">
            <p className="font-semibold" style={{ fontSize: 18, color: `hsl(${GREEN})`, letterSpacing: "0.15em" }}>WHAT'S ALREADY BUILT</p>
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
              { title: "Live Product", desc: "Platform with knowledge graph, protocol execution, role-based modes, AI edge functions.", color: TEAL },
              { title: "AACE v3.1 Spec", desc: "Proprietary context specification. Intent-locking, hierarchical knowledge injection, drift detection. The IP moat.", color: GREEN },
              { title: "AI Standards Diagnostic", desc: "Live lead-gen tool. Teams self-assess AI maturity across 5 dimensions. Funnel to pilot.", color: TEAL },
              { title: "Capital Efficiency", desc: "Built product, marketing site, diagnostic tool, and enterprise pipeline with near-zero burn.", color: GREEN },
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
// SLIDE 12 — THE ASK (€300K with SAFE, allocation, milestones)
// ═══════════════════════════════════════════════════════════════════════════════

function Slide12() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${MINT}), transparent 70%)` }} />

      <div className="relative z-10 w-full px-28">
        <div className="text-center mb-10">
          <p className="font-semibold tracking-[0.25em] uppercase mb-4" style={{ fontSize: 24, color: `hsl(${TEAL} / 0.8)` }}>Seed Round</p>
          <h2 className="font-black mb-4" style={{ fontSize: 96, color: DARK_TEXT }}>€300K</h2>
          <p style={{ fontSize: 26, color: DARK_MUTED }}>
            Post-money SAFE &nbsp;·&nbsp; 12-month runway &nbsp;·&nbsp; Series Seed at month 12
          </p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { pct: "40%", amt: "€120K", label: "First Paying Customers", desc: "Close 3-5 pilots. Convert validation into revenue.", color: TEAL },
            { pct: "30%", amt: "€90K", label: "Product Hardening", desc: "Stabilize core. Complete SECI flywheel. Production-grade.", color: SEAFOAM },
            { pct: "20%", amt: "€60K", label: "GTM Foundation", desc: "Case studies. Diagnostic funnel. Channel partner conversations.", color: MINT },
            { pct: "10%", amt: "€30K", label: "Operations", desc: "Legal, IP protection, EU AI Act groundwork.", color: GOLD },
          ].map((a) => (
            <div key={a.label} className="rounded-xl border p-5 text-center"
              style={{ borderColor: `hsl(${a.color} / 0.2)`, background: `hsl(${a.color} / 0.06)` }}>
              <p className="font-black" style={{ fontSize: 36, color: `hsl(${a.color})`, lineHeight: 1 }}>{a.pct}</p>
              <p className="font-bold mt-1" style={{ fontSize: 16, color: `hsl(${a.color} / 0.7)` }}>{a.amt}</p>
              <p className="font-bold mt-3" style={{ fontSize: 17, color: DARK_TEXT }}>{a.label}</p>
              <p className="mt-1" style={{ fontSize: 14, color: DARK_MUTED }}>{a.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { month: "Month 1-4", target: "€50-80K ARR", milestone: "2-3 paying pilots. First case study.", color: TEAL },
            { month: "Month 5-8", target: "€120-180K ARR", milestone: "5 customers across 2+ verticals. Net retention >100%.", color: SEAFOAM },
            { month: "Month 9-12", target: "€200-300K ARR", milestone: "8-10 customers. Series Seed raise with proof, not projections.", color: MINT },
          ].map(({ month, target, milestone, color }) => (
            <div key={month} className="rounded-xl border p-5"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
              <p className="font-semibold" style={{ fontSize: 16, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{month}</p>
              <p className="font-black mt-1" style={{ fontSize: 28, color: DARK_TEXT }}>{target}</p>
              <p className="mt-2" style={{ fontSize: 15, color: DARK_MUTED }}>{milestone}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl px-10 py-5 text-center"
          style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
          <p style={{ fontSize: 22, color: DARK_TEXT, lineHeight: 1.5 }}>
            $100B+ manages code, products, and compliance. Zero manages the expertise AI executes from.<br />
            <strong style={{ color: `hsl(${TEAL})` }}>We're building that infrastructure.</strong>
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
  { id: 2, title: "Two Systems Exist", component: <Slide02 /> },
  { id: 3, title: "The Human Bridge", component: <Slide03 /> },
  { id: 4, title: "LLMs Break Both Sides", component: <Slide04 /> },
  { id: 5, title: "The Fusion Problem", component: <Slide05 /> },
  { id: 6, title: "Solved Before ($B Markets)", component: <Slide06 /> },
  { id: 7, title: "The Solution", component: <Slide07 /> },
  { id: 8, title: "Category Validation", component: <Slide08 /> },
  { id: 9, title: "Early Validation", component: <Slide09 /> },
  { id: 10, title: "Vertical Expansion", component: <Slide10 /> },
  { id: 11, title: "Team & Traction", component: <Slide11 /> },
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-How-Layer-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS — The How Layer</span>
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-How-Layer-Deck" slideCount={SLIDES.length} variant="desktop" />
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
              className={cn("rounded-lg overflow-hidden border text-left transition-all", i === current ? "ring-2" : "hover:border-gray-300")}
              style={{
                borderColor: i === current ? `hsl(${TEAL})` : CHROME_BORDER,
                ...(i === current ? { boxShadow: `0 0 0 2px hsl(${TEAL} / 0.25)` } : {}),
              }}>
              <div className="aspect-video w-full relative">
                <ScaledSlide>{s.component}</ScaledSlide>
              </div>
              <p className="text-[10px] font-medium px-2 py-1 truncate" style={{ color: MUTED }}>{i + 1}. {s.title}</p>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          {showGrid ? (
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-3 gap-6 max-w-6xl mx-auto">
                {SLIDES.map((s, i) => (
                  <button key={s.id} onClick={() => goTo(i)}
                    className={cn("rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg", i === current ? "ring-2" : "")}
                    style={{ borderColor: i === current ? `hsl(${TEAL})` : CHROME_BORDER }}>
                    <div className="aspect-video relative"><ScaledSlide>{s.component}</ScaledSlide></div>
                    <p className="text-xs font-medium px-3 py-2" style={{ color: MUTED, background: CHROME_BG }}>{i + 1}. {s.title}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-xl border" style={{ borderColor: CHROME_BORDER }}>
                <ScaledSlide>{slide.component}</ScaledSlide>
              </div>
            </div>
          )}

          {!showGrid && (
            <div className="flex items-center justify-center gap-4 py-3 border-t shrink-0" style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
              <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30">
                <ChevronLeft size={18} style={{ color: TEXT }} />
              </button>
              <span className="text-sm font-mono" style={{ color: MUTED }}>{current + 1} / {SLIDES.length}</span>
              <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg hover:bg-black/5 disabled:opacity-30">
                <ChevronRight size={18} style={{ color: TEXT }} />
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
