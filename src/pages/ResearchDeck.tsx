import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ArrowRight, BookOpen, Brain, ChevronLeft, ChevronRight, Eye, FileText,
  GitBranch, Globe, Grid3x3, Layers, Lightbulb, Maximize2, Network,
  RefreshCw, Sparkles, Target, Users, Workflow, X, Check, AlertTriangle,
} from "lucide-react";
import { ExportMenu } from "@/components/ExportMenu";
import { Button } from "@/components/ui/button";
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
const RED = "0 72% 50%";
const AMBER = "38 92% 50%";
const NAVY = "222 47% 22%";

function SlideGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.06]" style={{
      backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
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
function Eyebrow({ n, text }: { n: string; text: string }) {
  return (
    <div className="px-3 py-1 rounded-md inline-block" style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})`, fontSize: 18, fontWeight: 800, letterSpacing: "0.2em" }}>
      {n} · {text}
    </div>
  );
}

// ─── Inline iceberg (deck scale) ─────────────────────────────────────────────
function DeckIceberg({ above, below, aboveLabel, belowLabel }: {
  above: string[]; below: string[]; aboveLabel: string; belowLabel: string;
}) {
  const C = TEAL;
  const W = 800, H = 560, WATER_Y = 200;
  const tipAnchors = above.slice(0, 4).map((_, i, arr) => {
    const t = arr.length === 1 ? 0.5 : i / (arr.length - 1);
    return { x: 430 + t * 22, y: 188 - t * 70 };
  });
  const massAnchors = below.slice(0, 4).map((_, i, arr) => {
    const t = arr.length === 1 ? 0.5 : i / (arr.length - 1);
    return { x: 360 - t * 90, y: 240 + t * 250 };
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto">
      <defs>
        <linearGradient id="rd-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`hsl(${C} / 0.04)`} />
          <stop offset="100%" stopColor={`hsl(${C} / 0.14)`} />
        </linearGradient>
        <linearGradient id="rd-tip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`hsl(${C} / 0.55)`} />
          <stop offset="100%" stopColor={`hsl(${C} / 0.78)`} />
        </linearGradient>
        <linearGradient id="rd-mass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`hsl(${C} / 0.32)`} />
          <stop offset="100%" stopColor={`hsl(${C} / 0.55)`} />
        </linearGradient>
      </defs>
      <rect x="0" y={WATER_Y} width={W} height={H - WATER_Y} fill="url(#rd-water)" />
      <line x1="0" y1={WATER_Y} x2={W} y2={WATER_Y} stroke={`hsl(${C} / 0.4)`} strokeDasharray="4 6" />
      <text x={W - 14} y={WATER_Y - 8} textAnchor="end" fontSize="13" fontWeight="700" fill={`hsl(${C})`} style={{ letterSpacing: "0.18em" }}>WATERLINE</text>
      {/* Tip */}
      <path d="M380 200 L420 110 L450 140 L470 90 L490 160 L520 200 Z" fill="url(#rd-tip)" />
      {/* Mass */}
      <path d="M340 200 L240 380 L320 540 L520 540 L560 380 L520 200 Z" fill="url(#rd-mass)" />
      {/* Above labels */}
      {above.slice(0, 4).map((t, i) => {
        const a = tipAnchors[i];
        const lx = 600, ly = 60 + i * 32;
        return (
          <g key={`a-${i}`}>
            <line x1={a.x} y1={a.y} x2={lx - 6} y2={ly} stroke={`hsl(${C} / 0.5)`} />
            <text x={lx} y={ly + 4} fontSize="14" fontWeight="600" fill="hsl(222 20% 18%)">{t}</text>
          </g>
        );
      })}
      {/* Below labels */}
      {below.slice(0, 4).map((t, i) => {
        const m = massAnchors[i];
        const lx = 30, ly = 280 + i * 38;
        return (
          <g key={`b-${i}`}>
            <line x1={m.x} y1={m.y} x2={lx + 4} y2={ly} stroke={`hsl(${C} / 0.5)`} />
            <text x={lx} y={ly + 4} fontSize="14" fontWeight="600" fill="hsl(222 20% 18%)">{t}</text>
          </g>
        );
      })}
      <text x={W / 2} y={28} textAnchor="middle" fontSize="13" fontWeight="800" fill={`hsl(${C})`} style={{ letterSpacing: "0.2em" }}>{aboveLabel.toUpperCase()}</text>
      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="13" fontWeight="800" fill={`hsl(${C})`} style={{ letterSpacing: "0.2em" }}>{belowLabel.toUpperCase()}</text>
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SLIDES
// ═════════════════════════════════════════════════════════════════════════════

function S01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)` }} />
      <div className="relative z-10 flex flex-col items-center text-center px-28">
        <div className="flex items-center gap-3 mb-14 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.1)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${TEAL})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 26, color: `hsl(${TEAL})` }}>
            LIZA OS · Research Memory Layer · Concept Deck
          </span>
        </div>
        <h1 className="font-black mb-6" style={{ fontSize: 84, lineHeight: 1.04, color: TEXT }}>
          Obsidian was the benchmark.<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Now reason inside the map.
          </span>
        </h1>
        <p className="mb-10" style={{ fontSize: 26, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          A research memory layer for the individual researcher. Obsidian and Roam already prove the appetite: thousands of researchers building knowledge graphs by hand. We pick up where they stop. <span style={{ color: `hsl(${TEAL})` }}>Structured field, on day one. AI that reasons over it, not around it.</span>
        </p>
        <p style={{ fontSize: 18, color: SUBTLE, letterSpacing: "0.18em" }}>
          BUILT FOR THE INDIVIDUAL · OPTIONAL FOR THE LAB
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

function S02WhoBreaks() {
  const personas = [
    {
      who: "Day one in a new field",
      today: "6 to 12 months in PDFs to build a private bibliography. The map of the field stays in your head, partially.",
      withAI: "ChatGPT gives you fluent summaries. Obsidian gives you a blank vault. Either way, you still hand-build the structure of the field.",
      win: "Walk into a structured field map. Schools, lineages, and disagreements already typed. You start judging, not cataloguing.",
      Icon: BookOpen,
    },
    {
      who: "Reading paper number 200",
      today: "You sense the disagreements between authors but cannot see them. Every reread is a tax.",
      withAI: "Smart Connections shows related notes by similarity. It does not show you who argues against whom or which decision a school rejected.",
      win: "Disagreement, supersession, and rebuttal as first-class objects. The structure of the debate is visible.",
      Icon: GitBranch,
    },
    {
      who: "Forming your own position",
      today: "Your why-not-this decisions live in your head and in scattered notes. They rarely make it into the thesis.",
      withAI: "Plugins retrieve text. They do not capture how you reasoned to discard an alternative or place a school against another.",
      win: "The judgment log is the work product. Every decision is captured against the structured map as you reason.",
      Icon: Brain,
    },
    {
      who: "Owning what you built",
      today: "Your reading and notes are yours, but your thinking is not portable across projects.",
      withAI: "Obsidian solved one half: markdown on your disk, no lock-in. The other half is open: the structure of how you think about a field travels with no one.",
      win: "Your field map and judgment log are exportable, LLM-agnostic, and travel with you across projects, labs, and decades.",
      Icon: GitBranch,
    },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="02" text="FOUR MOMENTS IN ONE PHD" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          The same researcher. <span style={{ color: `hsl(${TEAL})` }}>Four places today's tools quietly break.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 20, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          One individual researcher across a PhD. Obsidian solved the canvas. AI assistants solved retrieval. Neither solved the structure of the field, the structure of disagreement, or the structure of judgment.
        </p>
        <div className="grid grid-cols-2 gap-5 flex-1">
          {personas.map(p => {
            const Icon = p.Icon;
            return (
              <div key={p.who} className="rounded-2xl border p-6 flex flex-col" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
                    <Icon size={24} />
                  </div>
                  <p className="font-black" style={{ fontSize: 26, color: TEXT }}>{p.who}</p>
                </div>
                <p className="mb-2" style={{ fontSize: 16, color: MUTED }}>
                  <span style={{ color: TEXT, fontWeight: 800 }}>Today: </span>{p.today}
                </p>
                <p className="mb-2" style={{ fontSize: 16, color: MUTED }}>
                  <span style={{ color: `hsl(${AMBER})`, fontWeight: 800 }}>With AI / Obsidian: </span>{p.withAI}
                </p>
                <p style={{ fontSize: 16, color: TEXT }}>
                  <span style={{ color: `hsl(${TEAL})`, fontWeight: 800 }}>With LIZA OS: </span>{p.win}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S03Iceberg() {
  const obsidian = [
    "Markdown on your disk, yours forever",
    "Bidirectional links and graph view",
    "Smart Connections and Copilot for embeddings + chat",
    "Zotero plugin pulls bibliographies",
    "30+ hours of patient, disciplined setup",
  ];
  const liza = [
    { title: "Typed reasoning primitives", body: "School, stance, rebuttal, supersession, why-not-this are first-class objects. Obsidian gives you a canvas and freeform notes. We give you the ontology of how a field actually argues with itself." },
    { title: "Field-map resolution as an operation", body: "Drop in your corpus. Get a structured map of schools, lineages, and disagreements back. Obsidian gives you a blank vault and an embeddings plugin. You still hand-build the structure." },
    { title: "AI that reasons over the structure", body: "Counter-arguments, gaps, and lineage placements computed against the typed map. Smart Connections retrieves notes by similarity. We reason over the structure of the field." },
  ];
  return (
    <div className="w-full h-full relative px-28 py-14" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="03" text="OUR HONEST BENCHMARK" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          Obsidian is the benchmark. <span style={{ color: `hsl(${TEAL})` }}>Three structural things it does not do.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 18, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          Obsidian, with Smart Connections, Copilot, and Zotero plugins, is the closest tool in spirit to what we are building. A serious researcher gets to roughly 70 percent of the individual experience inside it. We say that openly. The remaining 30 percent is structural, and it is the entire reason LIZA OS exists.
        </p>
        <div className="grid grid-cols-12 gap-6 flex-1">
          <div className="col-span-4 rounded-2xl border-2 p-7 flex flex-col" style={{ borderColor: `hsl(${AMBER} / 0.45)`, background: `hsl(${AMBER} / 0.04)` }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.25em", color: `hsl(${AMBER})` }}>BENCHMARK</p>
            <p className="font-black mt-3 mb-2" style={{ fontSize: 30, color: TEXT, lineHeight: 1.1 }}>Obsidian + plugins</p>
            <p className="mb-5" style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>The serious individual researcher\'s stack today. Free, local, portable, vibrant plugin ecosystem.</p>
            <ul className="space-y-3 mb-5">
              {obsidian.map(o => (
                <li key={o} className="flex gap-3 items-start" style={{ fontSize: 15, color: TEXT, lineHeight: 1.4 }}>
                  <Check size={16} color={`hsl(${AMBER})`} strokeWidth={3} className="mt-1 flex-shrink-0" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto rounded-lg p-3" style={{ background: `hsl(${AMBER} / 0.1)` }}>
              <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 800, color: `hsl(${AMBER})` }}>Honest gets-you-to: </span>~70% of the individual experience, after the work.
              </p>
            </div>
          </div>
          <div className="col-span-8 flex flex-col gap-4">
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.25em", color: `hsl(${TEAL})` }}>THE THREE STRUCTURAL DELTAS · LIZA OS</p>
            {liza.map((l, i) => (
              <div key={l.title} className="rounded-xl border-2 p-5 flex gap-5 items-start flex-1" style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.06)` }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black flex-shrink-0" style={{ background: `hsl(${TEAL})`, color: BG, fontSize: 20 }}>{i + 1}</div>
                <div>
                  <p className="font-black mb-1.5" style={{ fontSize: 22, color: TEXT, lineHeight: 1.15 }}>{l.title}</p>
                  <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.5 }}>{l.body}</p>
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

function S04ThirdPath() {
  const cols = [
    {
      tag: "PATH 1",
      title: "Manual review",
      what: "What it is: months in PDFs, hand-built bibliographies, notes in private docs.",
      limit: "Why it falls short: 6 to 12 months per researcher. The field gets flattened into a citation list. Hierarchies between schools, lineages of ideas, and the disagreements that actually matter never get mapped. Tacit judgment lives in the researcher's head and leaves with them.",
      tone: RED,
      verdict: "FLATTENS THE FIELD",
      icon: X,
      meters: [
        { label: "Speed", v: 1 },
        { label: "Reaches the depth", v: 2 },
        { label: "Extractable / portable", v: 1 },
        { label: "Compounds for the lab", v: 1 },
      ],
    },
    {
      tag: "PATH 2",
      title: "AI shortcuts and personal graphs",
      what: "What it is: two halves of the same gap. ChatGPT, Claude, Elicit, Consensus produce fluent summaries with no map. Obsidian and Roam do build real knowledge graphs of how a researcher connects ideas, which is closer in spirit to what the field actually needs.",
      limit: "Why it falls short: AI assistants stay shallow and the thesis drifts into the model's voice. Personal graphs reach the depth, but the knowledge is locked in one user's vault, glued to the tool, and never reaches the cohort. In both cases the researcher's reasoning is not extractable, not shared, and not portable. Nothing compounds for the lab.",
      tone: AMBER,
      verdict: "SHALLOW OR TRAPPED",
      icon: AlertTriangle,
      meters: [
        { label: "Speed", v: 5 },
        { label: "Reaches the depth", v: 3 },
        { label: "Extractable / portable", v: 1 },
        { label: "Compounds for the lab", v: 1 },
      ],
    },
    {
      tag: "PATH 3",
      title: "LIZA OS, the Research Memory Layer",
      what: "What it is: a shared map of the field that the researcher builds with the system, and an extractable record of how they reason on top of it.",
      limit: "Why it works: reaches the depth that personal graphs reach, and goes one step further. The map, the judgment log, and the way you connect ideas are first-class objects that scale to the cohort, are exportable, and stay yours. LLM-agnostic by design. The researcher stays the author of every claim, and the lab's reasoning becomes an asset that compounds.",
      tone: TEAL,
      verdict: "DEEP · EXTRACTABLE · SHARED",
      icon: Check,
      meters: [
        { label: "Speed", v: 4 },
        { label: "Reaches the depth", v: 5 },
        { label: "Extractable / portable", v: 5 },
        { label: "Compounds for the lab", v: 5 },
      ],
    },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="04" text="THE THIRD PATH" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          Researchers are forced to <span style={{ color: `hsl(${RED})` }}>flatten</span> or be <span style={{ color: `hsl(${AMBER})` }}>replaced.</span><br />
          <span style={{ color: `hsl(${TEAL})` }}>There is a third option.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 20, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          Two paths exist today. Both are real attempts. Both fail the researcher in a specific, structural way. The third path keeps what each tries to do and removes the cost.
        </p>
        <div className="grid grid-cols-3 gap-6 flex-1">
          {cols.map(c => (
            <div key={c.tag} className="rounded-2xl border-2 p-7 flex flex-col" style={{ borderColor: `hsl(${c.tone} / 0.5)`, background: `hsl(${c.tone} / 0.04)` }}>
              <div className="flex items-center justify-between">
                <p style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.25em", color: `hsl(${c.tone})` }}>{c.tag}</p>
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `hsl(${c.tone} / 0.15)`, color: `hsl(${c.tone})` }}>
                  <c.icon size={20} strokeWidth={3} />
                </div>
              </div>
              <p className="mt-3 mb-2 font-black" style={{ fontSize: 26, lineHeight: 1.15, color: TEXT }}>{c.title}</p>
              <p className="mb-4" style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", color: `hsl(${c.tone})` }}>{c.verdict}</p>
              <p className="mb-3" style={{ fontSize: 16, color: TEXT, lineHeight: 1.45 }}>{c.what}</p>
              <div className="my-3 h-px" style={{ background: `hsl(${c.tone} / 0.25)` }} />
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.5 }}>{c.limit}</p>
              <div className="mt-auto pt-5 space-y-2">
                {c.meters.map(m => (
                  <div key={m.label} className="flex items-center gap-3">
                    <p className="w-44" style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>{m.label}</p>
                    <div className="flex-1 flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="flex-1 h-1.5 rounded-full" style={{ background: i <= m.v ? `hsl(${c.tone})` : `hsl(${c.tone} / 0.12)` }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S05Thesis() {
  const items = [
    { title: "Understand the field, don't flatten it", body: "A literature review is not a bibliography task. It is the act of mapping a field: the schools, the lineages, the disagreements between authors, the why-not-this decisions in past debates. The researcher needs to see that map.", Icon: Network },
    { title: "Augment, don't automate", body: "A tool that writes the thesis for the PhD is a regression. A tool that helps the researcher see further — and stay the author — is the only direction worth building.", Icon: Sparkles },
    { title: "The researcher stays the author", body: "Every claim, every judgment, every disagreement remains the researcher's own. The system surfaces trade-offs and counter-arguments inside the map. It does not write the work.", Icon: Brain },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="05" text="THE THESIS" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          Three commitments. <span style={{ color: `hsl(${TEAL})` }}>One worldview.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          Built around how researchers actually work — not a productivity gimmick. The product is downstream of one conviction: the field comes first, the researcher stays the author.
        </p>
        <div className="grid grid-cols-3 gap-6 flex-1">
          {items.map(i => {
            const Icon = i.Icon;
            return (
              <div key={i.title} className="rounded-2xl border p-8 flex flex-col" style={{ borderColor: CHROME_BORDER, background: BG }}>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center mb-5" style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
                  <Icon size={32} />
                </div>
                <p className="font-black mb-3" style={{ fontSize: 28, color: TEXT }}>{i.title}</p>
                <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.5 }}>{i.body}</p>
              </div>
            );
          })}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S06WhyNow() {
  const stats = [
    {
      stat: "67 wks",
      label: "Average time to complete a systematic review",
      context: "Mean of 67.3 weeks from registration to publication across 195 PROSPERO-registered reviews. Why it matters: in fields like AI, biotech, and climate science the literature now doubles every 2 to 3 years. A PhD that spends 15 months catching up to a frontier that has already moved is no longer doing original work. The strategic act is the synthesis above the review, not the review itself.",
      source: "Borah, Brown, Capers & Kaiser. BMJ Open, 2017. Analysis of the time and workers needed to conduct systematic reviews (PROSPERO).",
    },
    {
      stat: "~30%",
      label: "Of researchers already use generative AI in their writing",
      context: "Of 1,600+ scientists Nature surveyed, roughly a third use generative AI to draft manuscripts, refine text, or summarise the literature. Why it matters: this is happening with no institutional standard for how the field gets mapped or how judgment is preserved. Without one, the next generation learns to produce the model's voice instead of forming their own. That is the hollowing-out: speed at the cost of the next generation of thinkers.",
      source: "Van Noorden & Perkel. Nature, 2023. AI and science: what 1,600 researchers think (n = 1,600+).",
    },
    {
      stat: "12%",
      label: "Of scientific papers receive zero citations five years after publication",
      context: "A Web of Science study finds about 12% of articles remain uncited after five years, with the share much higher in several fields. Why it matters: not reading the field is no longer a quality gap, it is now a structural certainty. The corpus grows faster than any cohort can read it, so entire schools of thought stay invisible. Without a shared map, every researcher restarts from a partial view, and the institution never builds a position on the field.",
      source: "Hovden et al. Scientometrics, 2019. Zero impact: a large-scale study of uncitedness (Web of Science corpus).",
    },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="06" text="WHY NOW" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          The cost of doing nothing <span style={{ color: `hsl(${TEAL})` }}>is already paid — every day.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 18, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          Three numbers, three sources. Each describes a structural pressure on research today: time lost, AI used without a standard, and a literature growing faster than it can be read.
        </p>
        <div className="grid grid-cols-3 gap-6 flex-1">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl border p-7 flex flex-col" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <p className="font-black leading-none tracking-tight" style={{ fontSize: 88, color: `hsl(${TEAL})` }}>{s.stat}</p>
              <p className="mt-4 mb-3" style={{ fontSize: 17, fontWeight: 800, letterSpacing: "0.08em", color: TEXT, textTransform: "uppercase", lineHeight: 1.25 }}>{s.label}</p>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.5 }}>{s.context}</p>
              <div className="flex-1" />
              <div className="mt-4 pt-3 border-t" style={{ borderColor: CHROME_BORDER }}>
                <p style={{ fontSize: 12, color: SUBTLE, fontStyle: "italic", lineHeight: 1.45 }}>Source: {s.source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S07Loop() {
  const loop = [
    {
      step: "1 · Map",
      short: "See the field, not a list.",
      researcher: "Drop in your corpus: PDFs, citations, your supervisor's reading list, your own past notes. LIZA OS clusters the literature into schools of thought, surfaces lineages of ideas across decades, and flags where authors actually disagree. The PhD walks into a structured field on day one.",
      institution: "The lab gets a living map of its domain that any new student inherits. The map is no longer locked in one professor's head.",
      Icon: Network,
    },
    {
      step: "2 · Anchor",
      short: "Codify your stance.",
      researcher: "Your hypothesis, framework, and assumptions become explicit anchors the system reasons against. Every claim is tied to your position, not a generic average of the internet.",
      institution: "The group's methodology, prior critiques, and standards of evidence are captured as shared anchors that newcomers can read, challenge, and extend.",
      Icon: BookOpen,
    },
    {
      step: "3 · Augment",
      short: "Think further, faster.",
      researcher: "The researcher stays the author. The system surfaces counter-arguments, trade-offs, gaps in their reading, and lineages they have not yet placed. Less time searching and re-summarising. More time judging and writing.",
      institution: "Cohorts converge on a shared standard for AI-augmented research. The institution can show how AI is used to deepen judgment, not replace it.",
      Icon: Sparkles,
    },
    {
      step: "4 · Compound",
      short: "Knowledge accumulates.",
      researcher: "Every reading, note, and decision feeds back into the map. The researcher's own thinking becomes a structured asset they own across projects, not a folder of dead PDFs.",
      institution: "Each cohort hands off a richer field map and a deeper judgment log to the next. The lab's reasoning becomes a compounding institutional asset, not something that leaves with each graduate.",
      Icon: RefreshCw,
    },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="07" text="HOW IT WORKS" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          Map → Anchor → Augment → <span style={{ color: `hsl(${TEAL})` }}>Compound.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 18, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          One loop, two beneficiaries. Each step does work for the individual researcher today, and leaves a structured asset behind for the lab and the institution.
        </p>
        <div className="relative flex-1">
          {/* Connector spine */}
          <div className="absolute left-0 right-0 top-[58px] h-0.5" style={{ background: `linear-gradient(90deg, hsl(${TEAL} / 0), hsl(${TEAL} / 0.45) 8%, hsl(${TEAL} / 0.45) 92%, hsl(${TEAL} / 0))` }} />
          <div className="grid grid-cols-4 gap-5 h-full relative">
          {loop.map((s, idx) => {
            const Icon = s.Icon;
            return (
              <div key={s.step} className="rounded-2xl border p-6 flex flex-col relative" style={{ borderColor: CHROME_BORDER, background: BG }}>
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center font-black" style={{ background: `hsl(${TEAL})`, color: BG, fontSize: 18, boxShadow: `0 4px 12px hsl(${TEAL} / 0.35)` }}>
                  {idx + 1}
                </div>
                {idx < loop.length - 1 && (
                  <div className="absolute -right-5 top-[58px] z-10 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: BG, color: `hsl(${TEAL})` }}>
                    <ArrowRight size={22} strokeWidth={3} />
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mt-4" style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
                  <Icon size={24} />
                </div>
                <p className="font-black" style={{ fontSize: 22, color: TEXT }}>{s.step}</p>
                <p className="mt-1 mb-3 font-bold" style={{ fontSize: 16, color: `hsl(${TEAL})` }}>{s.short}</p>
                <div className="rounded-lg p-3 mb-3" style={{ background: `hsl(${TEAL} / 0.06)`, border: `1px solid hsl(${TEAL} / 0.18)` }}>
                  <p className="mb-1" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: `hsl(${TEAL})`, textTransform: "uppercase" }}>For the researcher</p>
                  <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.45 }}>{s.researcher}</p>
                </div>
                <div className="rounded-lg p-3" style={{ background: CARD_ALT, border: `1px solid ${CHROME_BORDER}` }}>
                  <p className="mb-1" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: SUBTLE, textTransform: "uppercase" }}>For the institution</p>
                  <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.45 }}>{s.institution}</p>
                </div>
              </div>
            );
          })}
          </div>
        </div>
        <p className="mt-6 text-center" style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.2em", color: MUTED, textTransform: "uppercase" }}>
          Individual productivity today · Institutional memory tomorrow
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

function S08Landscape() {
  const tools = [
    {
      name: "Elicit / Consensus / Scite",
      role: "Search + summarisation",
      missing: "A map of the field",
      gap: "Returns ranked papers and one-line summaries. Treats the literature as a list, not as schools, lineages, and disagreements between authors.",
      liza: "Resolves the same corpus into a structured field map the researcher can navigate, challenge, and extend.",
      caps: [1, 0, 0, 0, 0],
    },
    {
      name: "ChatGPT / Claude / Gemini",
      role: "General writing assistants",
      missing: "The researcher's own judgment",
      gap: "Generates fluent prose from the average of the internet. No memory of the lab, the prior cohort, or the open debates. Speed at the cost of the researcher's voice.",
      liza: "Augments the researcher's own thinking inside their map. Every claim stays attributable to the researcher, not the model.",
      caps: [0, 0, 0, 0, 0],
    },
    {
      name: "Zotero / Mendeley / Notion",
      role: "Reference and note managers",
      missing: "Reasoning over the artifacts",
      gap: "Stores PDFs, citations, and notes as files in folders. Does not reason about the relations between them or surface contradictions.",
      liza: "Treats every artifact as a node in a living map. Relations, lineages, and contradictions become first-class.",
      caps: [0, 0, 0, 0, 0],
    },
    {
      name: "Research Rabbit / Connected Papers",
      role: "Citation graphs",
      missing: "Tacit disagreement and judgment",
      gap: "Maps who cited whom. Cannot see why authors disagree, which decisions a school rejected, or what the lab's own stance is.",
      liza: "Captures the why-not-this decisions and the lab's own judgment, alongside the citation structure.",
      caps: [1, 0, 0, 0, 0],
    },
    {
      name: "Obsidian / Roam",
      role: "Personal knowledge graphs",
      missing: "Cohort scale and portability",
      gap: "The closest in spirit: they actually do build knowledge graphs of how a researcher connects ideas. Two structural limits: solo by design (one user's vault, no cohort or lab layer), and locked to the tool. The graph cannot be lifted out and reused elsewhere.",
      liza: "Cohort-first and portable by default. The researcher's graph is exportable and the system is LLM-agnostic, so the way you connect ideas travels with you, with no lock-in to LIZA OS or to any single model.",
      caps: [1, 1, 0, 0, 0],
    },
  ];
  const capCols = ["Field map", "Researcher graph", "Cohort layer", "Judgment log", "Portable / LLM-agnostic"];
  return (
    <div className="w-full h-full relative px-28 py-16" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="08" text="THE LANDSCAPE" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 52, lineHeight: 1.05, color: TEXT }}>
          Each tool fixes a slice. <span style={{ color: `hsl(${TEAL})` }}>None hold the field, the judgment, or the lab.</span>
        </h2>
        <p className="mb-4" style={{ fontSize: 18, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          For each category, one core thing is missing. That missing thing is what LIZA OS is built around.
        </p>
        {/* Capability matrix */}
        <div className="rounded-xl border mb-4 overflow-hidden" style={{ borderColor: CHROME_BORDER, background: BG }}>
          <div className="grid grid-cols-12 gap-3 px-5 py-3" style={{ background: CARD_ALT, borderBottom: `1px solid ${CHROME_BORDER}` }}>
            <p className="col-span-3" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: SUBTLE, textTransform: "uppercase" }}>Capability coverage</p>
            {capCols.map(c => (
              <p key={c} className="col-span-1 text-center" style={{ fontSize: 11, fontWeight: 800, color: SUBTLE, lineHeight: 1.2 }}>{c}</p>
            ))}
            <p className="col-span-4 text-right" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", color: `hsl(${TEAL})`, textTransform: "uppercase" }}>● = present  ○ = absent</p>
          </div>
          {tools.map(t => (
            <div key={t.name} className="grid grid-cols-12 gap-3 px-5 py-2.5 items-center border-b last:border-b-0" style={{ borderColor: CHROME_BORDER }}>
              <p className="col-span-3" style={{ fontSize: 13, color: TEXT, fontWeight: 700 }}>{t.name}</p>
              {t.caps.map((v, i) => (
                <div key={i} className="col-span-1 flex justify-center">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ background: v ? `hsl(${TEAL})` : "transparent", border: v ? "none" : `1.5px solid hsl(${SUBTLE} / 0.5)` }} />
                </div>
              ))}
              <p className="col-span-4 text-right" style={{ fontSize: 12, color: MUTED, fontStyle: "italic" }}>missing: {t.missing}</p>
            </div>
          ))}
          <div className="grid grid-cols-12 gap-3 px-5 py-3 items-center" style={{ background: `hsl(${TEAL} / 0.07)`, borderTop: `2px solid hsl(${TEAL} / 0.4)` }}>
            <p className="col-span-3 font-black" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>LIZA OS</p>
            {[1,1,1,1,1].map((_, i) => (
              <div key={i} className="col-span-1 flex justify-center">
                <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${TEAL})`, boxShadow: `0 0 0 3px hsl(${TEAL} / 0.18)` }} />
              </div>
            ))}
            <p className="col-span-4 text-right font-bold" style={{ fontSize: 12, color: `hsl(${TEAL})`, letterSpacing: "0.05em" }}>The full stack, by design</p>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 gap-2">
          {tools.map(t => (
            <div key={t.name} className="rounded-xl border p-3 grid grid-cols-12 gap-5 items-stretch" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <div className="col-span-3 flex flex-col justify-center">
                <p className="font-black" style={{ fontSize: 16, color: TEXT, lineHeight: 1.2 }}>{t.name}</p>
                <p className="mt-1" style={{ fontSize: 13, fontWeight: 700, color: SUBTLE, letterSpacing: "0.05em" }}>{t.role}</p>
              </div>
              <p className="col-span-5 flex items-center" style={{ fontSize: 13, color: MUTED, lineHeight: 1.4 }}>{t.gap}</p>
              <div className="col-span-4 rounded-lg px-3 py-2 flex flex-col justify-center" style={{ background: `hsl(${TEAL} / 0.08)`, border: `1px solid hsl(${TEAL} / 0.25)` }}>
                <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: `hsl(${TEAL})`, textTransform: "uppercase" }}>What LIZA OS adds</p>
                <p className="mt-0.5" style={{ fontSize: 13, color: TEXT, lineHeight: 1.35 }}>{t.liza}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S09Architecture() {
  const layers = [
    { tag: "L4", scope: "Reasoning", title: "Augmentation Loop", body: "Counter-arguments, gaps, and trade-offs surface in dialogue. The researcher stays the author of every claim.", Icon: Workflow, opacity: 1.0 },
    { tag: "L3", scope: "Cohort", title: "Commons of the Lab", body: "Group's collective reading, dialogues, and disagreements compound across cohorts. Tacit knowledge survives the PhD.", Icon: Users, opacity: 0.85 },
    { tag: "L2", scope: "Researcher", title: "Stance & Judgment Log", body: "The researcher's framework, assumptions, prior work, and why-not-this decisions captured as executable context.", Icon: FileText, opacity: 0.7 },
    { tag: "L1", scope: "Corpus", title: "Field Map", body: "Papers, books, citations, datasets — ingested and resolved into schools, lineages, and authors with their disagreements.", Icon: Layers, opacity: 0.55 },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="09" text="ARCHITECTURE" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          Four layers. <span style={{ color: `hsl(${TEAL})` }}>One memory.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          The Research Memory Layer is not a chatbot wrapped around papers. It is a stack: corpus, researcher, cohort, reasoning — each compounding into the next.
        </p>
        <div className="flex-1 flex gap-10 items-stretch">
          {/* Stacked layers */}
          <div className="flex-1 flex flex-col gap-3">
            {layers.map((l, idx) => {
              const Icon = l.Icon;
              return (
                <div key={l.tag} className="rounded-xl flex items-center gap-6 px-7 py-5 relative" style={{ background: `hsl(${TEAL} / ${0.06 + idx * 0.04})`, border: `1px solid hsl(${TEAL} / ${0.25 + idx * 0.1})` }}>
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${TEAL} / 0.18)`, color: `hsl(${TEAL})` }}>
                    <Icon size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <p className="font-black" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>{l.tag}</p>
                      <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", color: SUBTLE, textTransform: "uppercase" }}>{l.scope}</p>
                    </div>
                    <p className="font-black mt-1" style={{ fontSize: 22, color: TEXT }}>{l.title}</p>
                  </div>
                  <p className="flex-[1.5]" style={{ fontSize: 15, color: MUTED, lineHeight: 1.45 }}>{l.body}</p>
                </div>
              );
            })}
          </div>
          {/* Compounding axis */}
          <div className="w-16 flex flex-col items-center">
            <p className="font-black" style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", color: `hsl(${TEAL})`, textTransform: "uppercase", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>Compounds upward →</p>
            <div className="flex-1 my-3 w-1 rounded-full" style={{ background: `linear-gradient(to top, hsl(${TEAL} / 0.15), hsl(${TEAL}))` }} />
            <div className="w-3 h-3 rounded-full" style={{ background: `hsl(${TEAL})` }} />
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S10SECI() {
  const phases = [
    { tag: "Capture the conversation", body: "Reading group discussions, advisor-student exchanges, lab debates. The system listens and keeps them, instead of letting them disappear into private notebooks.", color: TEAL },
    { tag: "Externalise the judgment", body: "The disagreements, the why-not-this decisions, the half-formed positions become first-class objects on the field map — not lost in a drawer.", color: MINT },
    { tag: "Connect across the field", body: "Those judgments get linked to the schools, the lineages, the authors they argue with. The map deepens with every reading.", color: NAVY },
    { tag: "Hand off to the next cohort", body: "The next PhD does not start from zero. They inherit the group's map and judgment, and form their own positions from there — faster, and deeper.", color: TEAL },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="10" text="HOW THE GROUP'S MEMORY FORMS" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          The conversation is the work. <span style={{ color: `hsl(${TEAL})` }}>We keep it.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          Most of what makes a research group good lives in conversation: between supervisor and student, in reading groups, in late corridor debates. Today it dies with the cohort. LIZA OS treats that conversation as the asset and carries it forward.
        </p>
        <div className="relative flex-1">
          <div className="absolute left-0 right-0 top-[68px] h-0.5" style={{ background: `linear-gradient(90deg, hsl(${TEAL} / 0.4), hsl(${TEAL} / 0.4))`, opacity: 0.4 }} />
          <div className="grid grid-cols-4 gap-5 h-full relative">
            {phases.map((p, i) => (
              <div key={p.tag} className="rounded-2xl p-8 pt-12 flex flex-col relative" style={{ background: `hsl(${p.color} / 0.06)`, border: `1px solid hsl(${p.color} / 0.3)` }}>
                <div className="absolute -top-6 left-8 w-14 h-14 rounded-full flex items-center justify-center font-black" style={{ background: `hsl(${p.color})`, color: BG, fontSize: 22, boxShadow: `0 6px 16px hsl(${p.color} / 0.3)` }}>
                  {i + 1}
                </div>
                {i < phases.length - 1 && (
                  <div className="absolute -right-5 top-[58px] z-10 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: BG, color: `hsl(${TEAL})` }}>
                    <ArrowRight size={22} strokeWidth={3} />
                  </div>
                )}
                <p className="font-black mb-4" style={{ fontSize: 24, color: TEXT, lineHeight: 1.15 }}>{p.tag}</p>
                <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-6 text-center" style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.25em", color: `hsl(${TEAL})`, textTransform: "uppercase" }}>
          ↻ Each cohort feeds the next · the loop tightens with every cycle
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

function S11JointVision() {
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="11" text="UNIT OF VALUE" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          Not the solo researcher. <span style={{ color: `hsl(${TEAL})` }}>The Joint Vision of the group.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          Productivity tools optimise individuals. We refuse that frame. The unit of value in research is the lab, the cohort, the school of thought — the people who think together over years and leave a tradition behind them.
        </p>
        <div className="grid grid-cols-2 gap-6 flex-1">
          <div className="rounded-2xl border p-10 flex flex-col" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <p className="font-black mb-5" style={{ fontSize: 32, color: `hsl(${RED})` }}>Atomised default</p>
            <ul className="space-y-3" style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>
              <li>· Individual productivity metrics</li>
              <li>· Each PhD restarts from zero</li>
              <li>· Tacit judgment dies with the cohort</li>
              <li>· The institution loses its tradition</li>
            </ul>
          </div>
          <div className="rounded-2xl border-2 p-10 flex flex-col" style={{ borderColor: `hsl(${TEAL})`, background: `hsl(${MINT} / 0.06)` }}>
            <p className="font-black mb-5" style={{ fontSize: 32, color: `hsl(${TEAL})` }}>Joint Vision</p>
            <ul className="space-y-3" style={{ fontSize: 20, color: TEXT, lineHeight: 1.5 }}>
              <li>· Group-level field map and judgment log</li>
              <li>· Each cohort starts where the last one left off</li>
              <li>· Tacit disagreements survive as first-class objects</li>
              <li>· The institution compounds a school of thought</li>
            </ul>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S12Pilot() {
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="12" text="COHORT PILOT" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          One research group. One field. <span style={{ color: `hsl(${TEAL})` }}>One semester.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          We co-build the Research Memory Layer with one PhD cohort or one research group as design partner. Not a 30-day trial — a semester-long cycle that produces a usable field map, a judgment log, and a measurable return of deep-work hours.
        </p>
        <div className="relative flex-1 flex flex-col justify-center">
          {/* Week ruler */}
          <div className="relative h-2 rounded-full mb-2 mx-6" style={{ background: `hsl(${TEAL} / 0.12)` }}>
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: "100%", background: `linear-gradient(90deg, hsl(${TEAL}), hsl(${MINT}))` }} />
            {[0, 25, 62.5, 100].map((pct, i) => (
              <div key={i} className="absolute -top-1 w-4 h-4 rounded-full" style={{ left: `calc(${pct}% - 8px)`, background: BG, border: `3px solid hsl(${TEAL})` }} />
            ))}
          </div>
          <div className="flex justify-between mx-3 mb-10" style={{ fontSize: 12, fontWeight: 700, color: SUBTLE, letterSpacing: "0.18em" }}>
            <span>WEEK 1</span><span>WEEK 4</span><span>WEEK 10</span><span>WEEK 16</span>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { tag: "Weeks 1–4", title: "Map the field", body: "Ingest the group's corpus. Surface schools, lineages, disagreements. Researcher reviews and corrects.", deliverable: "Living field map (v1)" },
              { tag: "Weeks 5–10", title: "Anchor & augment", body: "Researcher's stance and judgments captured. Dialogues run inside the map. Counter-arguments surface in real time.", deliverable: "Judgment log + augmented dialogue" },
              { tag: "Weeks 11–16", title: "Compound & hand off", body: "The map and judgment log become the cohort's shared memory. Next student starts from there.", deliverable: "Cohort handoff package" },
            ].map((p, i) => (
              <div key={p.tag} className="rounded-2xl border-2 p-7 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: BG }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black" style={{ background: `hsl(${TEAL})`, color: BG, fontSize: 18 }}>{i + 1}</div>
                  <p style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.22em", color: `hsl(${TEAL})` }}>{p.tag}</p>
                </div>
                <p className="font-black mb-3" style={{ fontSize: 26, color: TEXT }}>{p.title}</p>
                <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>{p.body}</p>
                <div className="mt-auto pt-5">
                  <div className="rounded-lg px-3 py-2 inline-flex items-center gap-2" style={{ background: `hsl(${TEAL} / 0.1)` }}>
                    <Check size={14} color={`hsl(${TEAL})`} strokeWidth={3} />
                    <p style={{ fontSize: 13, fontWeight: 700, color: `hsl(${TEAL})` }}>{p.deliverable}</p>
                  </div>
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

function S13Outcomes() {
  const tiers = [
    {
      tag: "FOR THE INDIVIDUAL",
      headline: "The researcher",
      bullets: [
        "Walks into a structured field map on day one instead of 6 to 12 months of solo PDF reading.",
        "Spends more hours judging, writing, and forming a position. Less hours searching and re-summarising.",
        "Stays the author of every claim. No model voice in the thesis.",
        "Owns a portable graph of how they connect ideas. It travels with them after the PhD.",
      ],
    },
    {
      tag: "FOR THE TEAM",
      headline: "The cohort and lab",
      bullets: [
        "Shared field map and judgment log that every member can read, challenge, and extend.",
        "Disagreements between authors and prior critiques are visible, not stuck in one professor's head.",
        "New students reach productive contribution in weeks, not in their second year.",
        "The group converges on a shared standard for how AI is used in their research.",
      ],
    },
    {
      tag: "FOR THE INSTITUTION",
      headline: "The faculty and university",
      bullets: [
        "An institutional standard for AI-augmented research that protects the formation of judgment.",
        "Cohort-to-cohort knowledge stops leaving with each graduate. The lab's reasoning becomes a compounding asset.",
        "A defensible position on what good academic AI use looks like, with the artefacts to show it.",
        "No vendor or model lock-in. Field maps and judgment logs are exportable. The system is LLM-agnostic.",
      ],
    },
  ];
  return (
    <div className="w-full h-full relative px-28 py-16" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="13" text="OUTCOMES" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 52, lineHeight: 1.05, color: TEXT }}>
          What changes, <span style={{ color: `hsl(${TEAL})` }}>at three levels.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 18, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          These are the working assumptions we hold today. The semester pilot is how we validate or revise each one with a real cohort.
        </p>
        <div className="grid grid-cols-3 gap-6 flex-1">
          {tiers.map((t, idx) => (
            <div
              key={t.tag}
              className="rounded-2xl border-2 p-7 flex flex-col"
              style={{
                borderColor: idx === 2 ? `hsl(${TEAL} / 0.5)` : CHROME_BORDER,
                background: idx === 2 ? `hsl(${TEAL} / 0.05)` : CARD_ALT,
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.25em", color: `hsl(${TEAL})` }}>{t.tag}</p>
              <p className="mt-2 mb-5 font-black" style={{ fontSize: 26, color: TEXT, lineHeight: 1.15 }}>{t.headline}</p>
              <ul className="space-y-3">
                {t.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3" style={{ fontSize: 15, color: TEXT, lineHeight: 1.5 }}>
                    <span style={{ color: `hsl(${TEAL})`, fontWeight: 800, flexShrink: 0 }}>›</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-5 text-center" style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: SUBTLE, textTransform: "uppercase" }}>
          Working assumptions · To be validated by the semester pilot
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

function S14TwoDoor() {
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="14" text="TWO WAYS TO START" />
        <h2 className="font-black mt-5 mb-10" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          Co-build with us. <span style={{ color: `hsl(${TEAL})` }}>As a partner, or a sponsor.</span>
        </h2>
        <div className="grid grid-cols-2 gap-6 flex-1">
          <div className="rounded-2xl p-10 flex flex-col" style={{ background: TEXT, color: BG }}>
            <p style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.25em", color: `hsl(${MINT})` }}>OPTION A · COHORT PARTNER</p>
            <p className="font-black mt-4 mb-5" style={{ fontSize: 40 }}>Run the semester pilot</p>
            <p style={{ fontSize: 22, color: "hsl(0 0% 100% / 0.85)", lineHeight: 1.5 }}>
              One research group. One field. Sixteen weeks. We co-build the Research Memory Layer alongside your cohort and leave you with a usable field map, a judgment log, and a measurable return of deep-work hours.
            </p>
          </div>
          <div className="rounded-2xl p-10 flex flex-col text-white" style={{ background: `hsl(${TEAL})` }}>
            <p style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.25em", color: "hsl(0 0% 100% / 0.7)" }}>OPTION B · INSTITUTIONAL SPONSOR</p>
            <p className="font-black mt-4 mb-5" style={{ fontSize: 40 }}>Co-define the standard</p>
            <p style={{ fontSize: 22, color: "hsl(0 0% 100% / 0.9)", lineHeight: 1.5 }}>
              Build the academic version of LIZA OS with us. Anchor it for your university and faculty, take a strategic position, and set the global reference for AI-augmented research.
            </p>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S15Close() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07]"
        style={{ background: `radial-gradient(circle, hsl(${TEAL}), transparent 70%)` }} />
      <div className="relative z-10 flex flex-col items-center text-center px-28">
        <p className="mb-8" style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.3em", color: `hsl(${TEAL})`, textTransform: "uppercase" }}>
          The Research Memory Layer
        </p>
        <h1 className="font-black mb-10" style={{ fontSize: 92, lineHeight: 1.04, color: TEXT, maxWidth: 1500 }}>
          Augment the researcher.<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Compound the field.
          </span>
        </h1>
        <p style={{ fontSize: 26, color: MUTED, maxWidth: 1100, lineHeight: 1.5 }}>
          The next great PhD should inherit the last one's judgment — not just their bibliography. That is what we are building.
        </p>
        <p className="mt-12" style={{ fontSize: 18, color: SUBTLE, letterSpacing: "0.2em" }}>
          lizaos.ai/research-brief
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide list ──────────────────────────────────────────────────────────────
const SLIDES = [
  { id: 1, title: "Cover", component: <S01Cover /> },
  { id: 2, title: "Personas", component: <S02WhoBreaks /> },
  { id: 3, title: "The Iceberg", component: <S03Iceberg /> },
  { id: 4, title: "The Third Path", component: <S04ThirdPath /> },
  { id: 5, title: "The Thesis", component: <S05Thesis /> },
  { id: 6, title: "Why Now", component: <S06WhyNow /> },
  { id: 7, title: "How It Works", component: <S07Loop /> },
  { id: 8, title: "The Landscape", component: <S08Landscape /> },
  { id: 9, title: "Architecture", component: <S09Architecture /> },
  { id: 10, title: "Group Memory", component: <S10SECI /> },
  { id: 11, title: "Joint Vision", component: <S11JointVision /> },
  { id: 12, title: "Cohort Pilot", component: <S12Pilot /> },
  { id: 13, title: "Outcomes", component: <S13Outcomes /> },
  { id: 14, title: "Two Doors", component: <S14TwoDoor /> },
  { id: 15, title: "Close", component: <S15Close /> },
];

// ─── Main page (mirrors SpaceDefenseHoldingsDeck shell) ──────────────────────
export default function ResearchDeck() {
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

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
  };

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
              <Eye size={28} color={`hsl(${TEAL})`} />
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
              style={{ background: "linear-gradient(90deg, hsl(0 0% 0% / 0.06), transparent)" }}>
              <ChevronLeft size={32} style={{ color: `hsl(215 15% 42% / 0.5)` }} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); showMobileControls(); }} disabled={current === SLIDES.length - 1}
              className="absolute right-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-end pr-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(270deg, hsl(0 0% 0% / 0.06), transparent)" }}>
              <ChevronRight size={32} style={{ color: `hsl(215 15% 42% / 0.5)` }} />
            </button>
          </>
        )}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full transition-opacity duration-300"
          style={{
            background: "hsl(0 0% 100% / 0.9)", border: `1px solid ${CHROME_BORDER}`, backdropFilter: "blur(8px)",
            opacity: mobileControlsVisible ? 1 : 0, pointerEvents: mobileControlsVisible ? "auto" : "none",
          }} onClick={(e) => e.stopPropagation()}>
          <button onClick={prev} disabled={current === 0} className="p-1.5 rounded-lg disabled:opacity-20"><ChevronLeft size={18} style={{ color: TEXT }} /></button>
          <span className="font-mono text-xs px-1" style={{ color: MUTED }}>{current + 1}/{SLIDES.length}</span>
          <button onClick={next} disabled={current === SLIDES.length - 1} className="p-1.5 rounded-lg disabled:opacity-20"><ChevronRight size={18} style={{ color: TEXT }} /></button>
          <div className="w-px h-4" style={{ background: CHROME_BORDER }} />
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Research-Concept-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
        </div>
        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
          {SLIDES.map(s => (<div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>))}
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
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg disabled:opacity-20"><ChevronLeft size={20} style={{ color: TEXT }} /></button>
            <span className="font-mono text-sm min-w-[60px] text-center" style={{ color: MUTED }}>{current + 1} / {SLIDES.length}</span>
            <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg disabled:opacity-20"><ChevronRight size={20} style={{ color: TEXT }} /></button>
            <div className="w-px h-5" style={{ background: CHROME_BORDER }} />
            <button onClick={() => document.exitFullscreen?.()} className="p-2 rounded-lg"><X size={18} style={{ color: MUTED }} /></button>
          </div>
        )}
        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
          {SLIDES.map(s => (<div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>))}
        </div>
      </div>
    );
  }

  if (showGrid) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-auto" style={{ background: CHROME_BG }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: CHROME_BORDER, background: BG }}>
          <h2 className="font-bold" style={{ fontSize: 20, color: TEXT }}>LIZA OS · Research Concept Deck</h2>
          <div className="flex items-center gap-3">
            <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Research-Concept-Deck" slideCount={SLIDES.length} />
            <Button variant="outline" size="sm" onClick={() => setShowGrid(false)}><X size={16} className="mr-1.5" /> Close</Button>
          </div>
        </div>
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-5 p-6">
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)}
              className={cn("rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg text-left", i === current ? "ring-2 ring-offset-2" : "")}
              style={{ borderColor: i === current ? `hsl(${TEAL})` : CHROME_BORDER, aspectRatio: "16/9" }}>
              <div className="w-full h-full relative">
                <ScaledSlide>{s.component}</ScaledSlide>
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2" style={{ background: "hsl(0 0% 100% / 0.9)" }}>
                  <p className="font-semibold truncate" style={{ fontSize: 13, color: TEXT }}>{i + 1}. {s.title}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
          {SLIDES.map(s => (<div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: CHROME_BG }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: CHROME_BORDER, background: BG }}>
        <div className="flex items-center gap-4">
          <span className="font-bold" style={{ fontSize: 16, color: TEXT }}>LIZA OS · Research Concept Deck</span>
          <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: CARD_ALT, color: MUTED }}>{current + 1} / {SLIDES.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Research-Concept-Deck" slideCount={SLIDES.length} />
          <Button variant="ghost" size="sm" onClick={() => setShowGrid(true)}><Grid3x3 size={16} className="mr-1.5" /> Grid</Button>
          <Button variant="ghost" size="sm" onClick={enterFullscreen}><Maximize2 size={16} className="mr-1.5" /> Present</Button>
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
          <button key={i} onClick={() => goTo(i)} className="w-2.5 h-2.5 rounded-full transition-all"
            style={{ background: i === current ? `hsl(${TEAL})` : `hsl(215 10% 80%)` }} />
        ))}
      </div>
      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
        {SLIDES.map(s => (<div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>))}
      </div>
    </div>
  );
}