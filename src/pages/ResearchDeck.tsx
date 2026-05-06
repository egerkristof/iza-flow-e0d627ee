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
        <h1 className="font-black mb-10" style={{ fontSize: 96, lineHeight: 1.04, color: TEXT }}>
          The research memory layer.<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Structured field. Your judgment. AI inside the map.
          </span>
        </h1>
        <p style={{ fontSize: 18, color: SUBTLE, letterSpacing: "0.18em" }}>
          FOR THE INDIVIDUAL RESEARCHER
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
        <h2 className="font-black mt-5 mb-8" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          The same researcher. <span style={{ color: `hsl(${TEAL})` }}>Four places today's tools quietly break.</span>
        </h2>
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
        <h2 className="font-black mt-5 mb-8" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          Obsidian is the benchmark. <span style={{ color: `hsl(${TEAL})` }}>Three structural things it does not do.</span>
        </h2>
        <div className="grid grid-cols-12 gap-6 flex-1">
          <div className="col-span-4 rounded-2xl border-2 p-7 flex flex-col" style={{ borderColor: `hsl(${AMBER} / 0.45)`, background: `hsl(${AMBER} / 0.04)` }}>
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.25em", color: `hsl(${AMBER})` }}>BENCHMARK</p>
            <p className="font-black mt-3 mb-2" style={{ fontSize: 30, color: TEXT, lineHeight: 1.1 }}>Obsidian + plugins</p>
            <ul className="space-y-3 mb-5 mt-4">
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
  // 0 = absent, 1 = partial, 2 = present
  const tools = [
    { name: "ChatGPT / Claude / Gemini",          role: "General writing assistants", caps: [0, 0, 2, 0, 0, 0, 0] },
    { name: "Elicit / Consensus / Scite",         role: "Search and summarisation",   caps: [1, 0, 1, 0, 0, 0, 0] },
    { name: "Zotero / Mendeley",                  role: "Reference managers",         caps: [0, 0, 0, 0, 0, 0, 2] },
    { name: "Notion / Evernote",                  role: "Note managers",              caps: [0, 1, 0, 0, 0, 0, 0] },
    { name: "Research Rabbit / Connected Papers", role: "Citation graphs",            caps: [1, 1, 0, 0, 0, 0, 1] },
    { name: "Obsidian / Roam",                    role: "Personal knowledge graphs · the benchmark", caps: [1, 2, 1, 0, 0, 1, 2], benchmark: true },
  ];
  const capCols = [
    "Field map of the corpus",
    "Personal knowledge graph",
    "AI assistance",
    "Typed primitives (school, stance, rebuttal)",
    "AI reasons over the structure",
    "Captures judgment & why-not-this",
    "Portable / LLM-agnostic",
  ];
  const Dot = ({ v }: { v: number }) => {
    if (v === 2) return <div className="rounded-full mx-auto" style={{ width: 18, height: 18, background: `hsl(${TEAL})` }} />;
    if (v === 1) return <div className="rounded-full mx-auto" style={{ width: 18, height: 18, background: `hsl(${TEAL} / 0.35)`, border: `2px solid hsl(${TEAL} / 0.7)` }} />;
    return <div className="rounded-full mx-auto" style={{ width: 18, height: 18, border: `2px solid hsl(${SUBTLE} / 0.45)` }} />;
  };
  return (
    <div className="w-full h-full relative px-20 py-14" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="04" text="HEAD TO HEAD" />
        <h2 className="font-black mt-5 mb-8" style={{ fontSize: 52, lineHeight: 1.05, color: TEXT }}>
          Each tool fixes a slice. <span style={{ color: `hsl(${TEAL})` }}>One stack holds them together.</span>
        </h2>
        <div className="rounded-2xl border-2 overflow-hidden flex-1 flex flex-col" style={{ borderColor: CHROME_BORDER, background: BG }}>
          {/* Header */}
          <div className="grid items-end px-7 pt-6 pb-4" style={{ gridTemplateColumns: `360px repeat(${capCols.length}, 1fr)`, background: CARD_ALT, borderBottom: `2px solid ${CHROME_BORDER}` }}>
            <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.22em", color: SUBTLE, textTransform: "uppercase" }}>Tool</p>
            {capCols.map(c => (
              <p key={c} className="text-center px-2" style={{ fontSize: 13, fontWeight: 800, color: TEXT, lineHeight: 1.25 }}>{c}</p>
            ))}
          </div>
          {/* Tool rows */}
          <div className="flex-1 flex flex-col">
            {tools.map((t, idx) => (
              <div key={t.name} className="grid items-center px-7 flex-1" style={{ gridTemplateColumns: `360px repeat(${capCols.length}, 1fr)`, borderBottom: idx < tools.length - 1 ? `1px solid ${CHROME_BORDER}` : "none", background: t.benchmark ? `hsl(${AMBER} / 0.05)` : "transparent", borderLeft: t.benchmark ? `4px solid hsl(${AMBER})` : "4px solid transparent" }}>
                <div>
                  <p style={{ fontSize: 18, color: t.benchmark ? `hsl(${AMBER})` : TEXT, fontWeight: 800, lineHeight: 1.15 }}>{t.name}</p>
                  <p className="mt-1" style={{ fontSize: 13, color: SUBTLE, fontWeight: 600, letterSpacing: "0.04em" }}>{t.role}</p>
                </div>
                {t.caps.map((v, i) => (
                  <div key={i} className="flex justify-center"><Dot v={v} /></div>
                ))}
              </div>
            ))}
            {/* LIZA OS hero row with continuous line */}
            <div className="grid items-center px-7 relative" style={{ gridTemplateColumns: `360px repeat(${capCols.length}, 1fr)`, background: `hsl(${TEAL} / 0.08)`, borderTop: `3px solid hsl(${TEAL})`, minHeight: 100 }}>
              <div>
                <p className="font-black" style={{ fontSize: 22, color: `hsl(${TEAL})`, letterSpacing: "0.04em" }}>LIZA OS</p>
                <p className="mt-1" style={{ fontSize: 13, color: `hsl(${TEAL} / 0.85)`, fontWeight: 700, letterSpacing: "0.04em" }}>The full stack, by design</p>
              </div>
              <div className="absolute" style={{ left: 388, right: 28, top: "50%", transform: "translateY(-50%)", height: 14, borderRadius: 999, background: `linear-gradient(90deg, hsl(${TEAL}), hsl(${MINT}))`, boxShadow: `0 0 0 6px hsl(${TEAL} / 0.15)` }} />
              {capCols.map((_, i) => (
                <div key={i} className="flex justify-center relative z-10">
                  <div className="rounded-full" style={{ width: 22, height: 22, background: BG, border: `4px solid hsl(${TEAL})`, boxShadow: `0 2px 8px hsl(${TEAL} / 0.4)` }} />
                </div>
              ))}
            </div>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-between px-7 py-3" style={{ background: CARD_ALT, borderTop: `1px solid ${CHROME_BORDER}` }}>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ background: `hsl(${TEAL})` }} /><span style={{ fontSize: 12, color: SUBTLE, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Present</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ background: `hsl(${TEAL} / 0.35)`, border: `2px solid hsl(${TEAL} / 0.7)` }} /><span style={{ fontSize: 12, color: SUBTLE, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Partial</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full" style={{ border: `2px solid hsl(${SUBTLE} / 0.5)` }} /><span style={{ fontSize: 12, color: SUBTLE, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Absent</span></div>
            </div>
            <p className="font-bold" style={{ fontSize: 13, color: `hsl(${TEAL})`, letterSpacing: "0.05em" }}>Obsidian / Roam set the bar. The four right columns are the structural deltas.</p>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S05Thesis() {
  const items = [
    { title: "Structure beats canvas", body: "Obsidian gives the researcher a brilliant blank canvas. We give them the structure of how a field actually argues with itself: typed schools, stances, rebuttals, supersessions. The ontology is the product.", Icon: Network },
    { title: "Resolution, not retrieval", body: "Smart Connections retrieves notes by similarity. We resolve the corpus into the field. The researcher walks into a structured map on day one, not after thirty hours of patient setup.", Icon: Sparkles },
    { title: "The researcher stays the author", body: "Every claim, every judgment, every disagreement remains the researcher\\'s own. The system surfaces trade-offs and counter-arguments inside the structured map. It never writes the work.", Icon: Brain },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="05" text="THE THESIS" />
        <h2 className="font-black mt-5 mb-10" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          Three commitments. <span style={{ color: `hsl(${TEAL})` }}>One worldview.</span>
        </h2>
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
      context: "Mean of 67.3 weeks from registration to publication across 195 PROSPERO-registered reviews. Why it matters: in fields like AI, biotech, and climate science the literature now doubles every 2 to 3 years. A researcher who spends 15 months catching up to a frontier that has already moved is no longer doing original work. The strategic act is the synthesis above the review, not the review itself.",
      source: "Borah, Brown, Capers & Kaiser. BMJ Open, 2017. Analysis of the time and workers needed to conduct systematic reviews (PROSPERO).",
    },
    {
      stat: "~30%",
      label: "Of researchers already use generative AI in their writing",
      context: "Of 1,600+ scientists Nature surveyed, roughly a third use generative AI to draft manuscripts, refine text, or summarise the literature. Why it matters: it is happening with no structured way for the individual researcher to map the field or preserve their own judgment. Without that structure, the researcher learns to produce the model's voice instead of forming their own. Speed at the cost of becoming a thinker.",
      source: "Van Noorden & Perkel. Nature, 2023. AI and science: what 1,600 researchers think (n = 1,600+).",
    },
    {
      stat: "12%",
      label: "Of scientific papers receive zero citations five years after publication",
      context: "A Web of Science study finds about 12% of articles remain uncited after five years, with the share much higher in several fields. Why it matters: not reading the field is no longer a quality gap, it is now a structural certainty. The corpus grows faster than any individual can read it, so entire schools of thought stay invisible. Without a structured map, the researcher restarts from a partial view every time.",
      source: "Hovden et al. Scientometrics, 2019. Zero impact: a large-scale study of uncitedness (Web of Science corpus).",
    },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="06" text="WHY NOW" />
        <h2 className="font-black mt-5 mb-8" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          The cost of doing nothing <span style={{ color: `hsl(${TEAL})` }}>is already paid — every day.</span>
        </h2>
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

function S07Shift() {
  const passive = [
    "You build the structure alone, note by note",
    "Tools retrieve, you reason in isolation",
    "Graph rots without daily discipline",
    "Expertise lives only in your head",
    "Output is a folder of notes",
  ];
  const active = [
    "Pre-installed research expertise structures the field for you",
    "Agents reason inside the map and push back on your stance",
    "Anchors keep your judgment versioned and alive",
    "Pick your field and your preferred thinkers, the system maps them",
    "Output is a compounding asset you own",
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="07" text="THE SHIFT" />
        <h2 className="font-black mt-4 mb-3" style={{ fontSize: 52, lineHeight: 1.05, color: TEXT }}>
          A graph is not enough.{" "}
          <span style={{ color: `hsl(${TEAL})` }}>You need a nervous system around it.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 18, color: MUTED, lineHeight: 1.5, maxWidth: 1500 }}>
          Obsidian, Roam, and RAG vaults give you a container. They are passive. They do not know what good thinking looks like in your field, they do not push back, they do not guide the structure. The map only compounds when expertise is installed around it.
        </p>
        <div className="grid grid-cols-2 gap-7 flex-1">
          {/* ── BEFORE: Passive container ─────────────────────────── */}
          <div className="rounded-2xl border p-7 flex flex-col relative overflow-hidden" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
            <div className="flex items-baseline justify-between">
              <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.25em", color: SUBTLE }}>BEFORE</p>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: SUBTLE }}>OBSIDIAN · ROAM · RAG</p>
            </div>
            <p className="mt-2 font-black" style={{ fontSize: 28, color: TEXT, lineHeight: 1.15 }}>Passive knowledge container</p>
            <p className="mt-1 mb-3" style={{ fontSize: 14, color: SUBTLE, fontStyle: "italic" }}>A vault. No expertise. No guidance. No reasoning.</p>

            {/* Visual: bare graph inside a thin container, no surrounding system */}
            <div className="rounded-xl border my-2 relative" style={{ borderColor: GRID_LINE, background: BG, height: 250 }}>
              <p className="absolute top-2 left-3" style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: SUBTLE }}>VAULT</p>
              <svg viewBox="0 0 500 250" className="w-full h-full">
                {/* sparse, mostly disconnected nodes in clusters that never meet */}
                {(() => {
                  const nodes: [number, number, number][] = [
                    [70, 70, 6], [110, 50, 5], [140, 95, 5], [85, 130, 5],
                    [240, 60, 6], [275, 95, 5], [220, 110, 5],
                    [380, 80, 6], [420, 115, 5], [350, 130, 5],
                    [110, 195, 5], [180, 200, 5], [320, 200, 5], [400, 195, 5],
                  ];
                  const edges: [number, number, number, number][] = [
                    [70, 70, 110, 50], [110, 50, 140, 95], [140, 95, 85, 130],
                    [240, 60, 275, 95], [275, 95, 220, 110],
                    [380, 80, 420, 115], [420, 115, 350, 130],
                    [110, 195, 180, 200], [320, 200, 400, 195],
                  ];
                  return (
                    <>
                      {edges.map(([x1, y1, x2, y2], i) => (
                        <line key={`e${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GRID_LINE} strokeWidth="1" strokeDasharray="3 4" />
                      ))}
                      {nodes.map(([x, y, r], i) => (
                        <circle key={`n${i}`} cx={x} cy={y} r={r} fill={BG} stroke={SUBTLE} strokeWidth="1.2" />
                      ))}
                      {/* tiny stray notes */}
                      <text x={70} y={232} fontSize="9" fill={SUBTLE} fontStyle="italic">untitled note</text>
                      <text x={300} y={232} fontSize="9" fill={SUBTLE} fontStyle="italic">draft 2024-03</text>
                    </>
                  );
                })()}
              </svg>
              {/* No surrounding ring. No external input. Static. */}
              <p className="absolute bottom-2 right-3" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: SUBTLE }}>NO REASONING LAYER</p>
            </div>

            <ul className="space-y-2 mt-3">
              {passive.map(p => (
                <li key={p} className="flex gap-3 items-start">
                  <X size={15} style={{ color: `hsl(${RED})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── AFTER: Graph + nervous system ─────────────────────── */}
          <div className="rounded-2xl border-2 p-7 flex flex-col relative overflow-hidden" style={{ borderColor: `hsl(${TEAL} / 0.55)`, background: `hsl(${TEAL} / 0.05)` }}>
            <div className="flex items-baseline justify-between">
              <p style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.25em", color: `hsl(${TEAL})` }}>AFTER</p>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: `hsl(${TEAL})` }}>LIZA RESEARCH MEMORY LAYER</p>
            </div>
            <p className="mt-2 font-black" style={{ fontSize: 28, color: TEXT, lineHeight: 1.15 }}>Graph plus nervous system</p>
            <p className="mt-1 mb-3" style={{ fontSize: 14, color: `hsl(${TEAL})`, fontStyle: "italic", fontWeight: 700 }}>Surrounded by expertise. Fed by your field. Reasoned over by agents.</p>

            {/* Visual: structured graph at center, surrounded by labeled rings, with external input lines */}
            <div className="rounded-xl border-2 my-2 relative overflow-hidden" style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: BG, height: 250 }}>
              <svg viewBox="0 0 500 250" className="w-full h-full">
                <defs>
                  <radialGradient id="halo-aft" cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor={`hsl(${TEAL} / 0.18)`} />
                    <stop offset="100%" stopColor={`hsl(${TEAL} / 0)`} />
                  </radialGradient>
                  <marker id="arrow-aft" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill={`hsl(${TEAL})`} />
                  </marker>
                </defs>

                {/* halo */}
                <ellipse cx="250" cy="125" rx="160" ry="95" fill="url(#halo-aft)" />

                {/* nervous-system rings */}
                <ellipse cx="250" cy="125" rx="138" ry="82" fill="none" stroke={`hsl(${TEAL} / 0.45)`} strokeWidth="1.2" strokeDasharray="2 4" />
                <ellipse cx="250" cy="125" rx="108" ry="64" fill="none" stroke={`hsl(${TEAL} / 0.6)`} strokeWidth="1" />

                {/* ring labels */}
                <text x="250" y="38" textAnchor="middle" fontSize="9" fontWeight="800" fill={`hsl(${TEAL})`} letterSpacing="2">EXPERTISE  ·  ANCHORS  ·  AGENTS</text>
                <text x="250" y="220" textAnchor="middle" fontSize="9" fontWeight="800" fill={`hsl(${TEAL})`} letterSpacing="2">VERSIONING  ·  JUDGMENT LOG  ·  COMPOUNDING</text>

                {/* graph nodes (clustered into 3 schools) */}
                {(() => {
                  type N = [number, number, number, string];
                  const nodes: N[] = [
                    // school A (top-left)
                    [200, 95, 5, "a"], [220, 80, 4, "a"], [185, 115, 4, "a"], [215, 110, 4, "a"],
                    // school B (top-right)
                    [295, 95, 5, "b"], [315, 110, 4, "b"], [285, 115, 4, "b"],
                    // school C (bottom)
                    [235, 160, 5, "c"], [265, 160, 5, "c"], [250, 175, 4, "c"],
                  ];
                  const edges: [number, number, number, number, number][] = [
                    [200, 95, 220, 80, 0.55], [200, 95, 185, 115, 0.55], [220, 80, 215, 110, 0.55], [185, 115, 215, 110, 0.55],
                    [295, 95, 315, 110, 0.55], [295, 95, 285, 115, 0.55], [315, 110, 285, 115, 0.55],
                    [235, 160, 265, 160, 0.55], [235, 160, 250, 175, 0.55], [265, 160, 250, 175, 0.55],
                    // anchor → schools
                    [250, 125, 200, 95, 0.7], [250, 125, 295, 95, 0.7], [250, 125, 250, 160, 0.7],
                    // cross-school disagreements
                    [215, 110, 285, 115, 0.4], [215, 110, 235, 160, 0.4], [285, 115, 265, 160, 0.4],
                  ];
                  return (
                    <>
                      {edges.map(([x1, y1, x2, y2, o], i) => (
                        <line key={`ae${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`hsl(${TEAL} / ${o})`} strokeWidth="1.1" />
                      ))}
                      {nodes.map(([x, y, r], i) => (
                        <circle key={`an${i}`} cx={x} cy={y} r={r} fill={BG} stroke={`hsl(${TEAL})`} strokeWidth="1.6" />
                      ))}
                      {/* anchor center */}
                      <circle cx="250" cy="125" r="9" fill={`hsl(${TEAL})`} />
                      <circle cx="250" cy="125" r="14" fill="none" stroke={`hsl(${TEAL} / 0.5)`} strokeDasharray="2 2" />
                      <text x="250" y="148" textAnchor="middle" fontSize="8" fontWeight="800" fill={`hsl(${TEAL})`} letterSpacing="1.5">ANCHOR</text>
                      {/* school labels */}
                      <text x="200" y="74" textAnchor="middle" fontSize="8" fontWeight="700" fill={MUTED} letterSpacing="1">SCHOOL A</text>
                      <text x="300" y="74" textAnchor="middle" fontSize="8" fontWeight="700" fill={MUTED} letterSpacing="1">SCHOOL B</text>
                      <text x="250" y="195" textAnchor="middle" fontSize="8" fontWeight="700" fill={MUTED} letterSpacing="1">SCHOOL C</text>
                    </>
                  );
                })()}

                {/* external inputs feeding the system */}
                {/* left: Corpus */}
                <g>
                  <rect x="14" y="105" width="78" height="22" rx="4" fill={BG} stroke={`hsl(${TEAL} / 0.7)`} />
                  <text x="53" y="120" textAnchor="middle" fontSize="9" fontWeight="800" fill={`hsl(${TEAL})`} letterSpacing="1.2">YOUR CORPUS</text>
                  <line x1="92" y1="116" x2="138" y2="125" stroke={`hsl(${TEAL})`} strokeWidth="1.4" markerEnd="url(#arrow-aft)" />
                </g>
                {/* top: Field */}
                <g>
                  <rect x="80" y="14" width="78" height="22" rx="4" fill={BG} stroke={`hsl(${TEAL} / 0.7)`} />
                  <text x="119" y="29" textAnchor="middle" fontSize="9" fontWeight="800" fill={`hsl(${TEAL})`} letterSpacing="1.2">YOUR FIELD</text>
                  <line x1="135" y1="36" x2="172" y2="78" stroke={`hsl(${TEAL})`} strokeWidth="1.4" markerEnd="url(#arrow-aft)" />
                </g>
                {/* right: Preferred Thinkers */}
                <g>
                  <rect x="408" y="14" width="84" height="22" rx="4" fill={BG} stroke={`hsl(${TEAL} / 0.7)`} />
                  <text x="450" y="29" textAnchor="middle" fontSize="9" fontWeight="800" fill={`hsl(${TEAL})`} letterSpacing="1.2">PREFERRED THINKERS</text>
                  <line x1="408" y1="36" x2="332" y2="78" stroke={`hsl(${TEAL})`} strokeWidth="1.4" markerEnd="url(#arrow-aft)" />
                </g>
                {/* right side: Your Stance */}
                <g>
                  <rect x="408" y="105" width="78" height="22" rx="4" fill={BG} stroke={`hsl(${TEAL} / 0.7)`} />
                  <text x="447" y="120" textAnchor="middle" fontSize="9" fontWeight="800" fill={`hsl(${TEAL})`} letterSpacing="1.2">YOUR STANCE</text>
                  <line x1="408" y1="116" x2="362" y2="125" stroke={`hsl(${TEAL})`} strokeWidth="1.4" markerEnd="url(#arrow-aft)" />
                </g>
              </svg>
            </div>

            <ul className="space-y-2 mt-3">
              {active.map(p => (
                <li key={p} className="flex gap-3 items-start">
                  <Check size={15} style={{ color: `hsl(${TEAL})`, marginTop: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: TEXT, lineHeight: 1.4, fontWeight: 600 }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S08Loop() {
  const loop = [
    {
      step: "1 · Map",
      short: "See the field, not a list.",
      researcher: "Drop in your corpus. The agentic environment reads it through pre-installed research expertise and resolves it into a structured field, not a folder.",
      does: [
        "Clusters the literature into schools of thought",
        "Surfaces lineages of ideas across decades",
        "Flags where authors actually disagree, and on what",
      ],
      Icon: Network,
    },
    {
      step: "2 · Anchor",
      short: "Codify your stance.",
      researcher: "Your hypothesis, framework, and assumptions become explicit anchors inside the map. Every claim is tied to your position, not a generic average of the internet.",
      does: [
        "Captures hypothesis, framework, assumptions as typed anchors",
        "Locates your stance against the schools and lineages",
        "Records why-not-this on the alternatives you reject",
      ],
      Icon: BookOpen,
    },
    {
      step: "3 · Augment",
      short: "Think further, faster.",
      researcher: "You stay the author. The agents reason over the structure of the field and push back from inside the map.",
      does: [
        "Surfaces counter-arguments and trade-offs against your anchors",
        "Names gaps in your reading and lineages you have not placed",
        "Drafts only against your stance, never instead of it",
      ],
      Icon: Sparkles,
    },
    {
      step: "4 · Compound",
      short: "Knowledge accumulates.",
      researcher: "Every reading, note, and judgment feeds back into the map. Your thinking becomes a portable asset you own across projects.",
      does: [
        "Writes new claims and rebuttals back as typed primitives",
        "Versions your stance as the field and your thinking move",
        "Exportable, LLM-agnostic, no lock-in",
      ],
      Icon: RefreshCw,
    },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="08" text="HOW IT WORKS" />
        <h2 className="font-black mt-5 mb-10" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          Map → Anchor → Augment → <span style={{ color: `hsl(${TEAL})` }}>Compound.</span>
        </h2>
        <div className="rounded-xl border-2 px-6 py-4 mb-7 flex items-center gap-5" style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: `hsl(${TEAL} / 0.06)` }}>
          <p className="font-black flex-shrink-0" style={{ fontSize: 12, letterSpacing: "0.22em", color: `hsl(${TEAL})`, textTransform: "uppercase" }}>The engine</p>
          <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.45 }}>
            A pre-installed agentic environment with research expertise built in. It manages the knowledge graph of your field and reasons inside it as you work.
          </p>
        </div>
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
                <p className="mt-1 mb-3 font-bold" style={{ fontSize: 17, color: `hsl(${TEAL})` }}>{s.short}</p>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.45 }}>{s.researcher}</p>
                <div className="mt-4 pt-3 border-t flex flex-col gap-2" style={{ borderColor: CHROME_BORDER }}>
                  <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", color: SUBTLE, textTransform: "uppercase" }}>What it does</p>
                  {s.does.map(d => (
                    <div key={d} className="flex gap-2 items-start">
                      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: `hsl(${TEAL})` }} />
                      <p style={{ fontSize: 13, color: TEXT, lineHeight: 1.4, fontWeight: 600 }}>{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S09Architecture() {
  const layers = [
    { tag: "L4", scope: "Reasoning", title: "Augmentation Loop", body: "Counter-arguments, gaps, and trade-offs surface in dialogue. The researcher stays the author of every claim.", Icon: Workflow, opacity: 1.0 },
    { tag: "L3", scope: "Researcher", title: "Stance & Judgment Log", body: "Your framework, assumptions, prior work, and why-not-this decisions captured as executable context. Portable and LLM-agnostic.", Icon: FileText, opacity: 0.85 },
    { tag: "L2", scope: "Structure", title: "Typed Primitives", body: "School, stance, rebuttal, supersession, why-not-this. The ontology of how a field actually argues with itself.", Icon: GitBranch, opacity: 0.7 },
    { tag: "L1", scope: "Corpus", title: "Field Map", body: "Papers, books, citations, datasets ingested and resolved into schools, lineages, and authors with their disagreements.", Icon: Layers, opacity: 0.55 },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="09" text="ARCHITECTURE" />
        <h2 className="font-black mt-5 mb-10" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          Four layers. <span style={{ color: `hsl(${TEAL})` }}>One memory.</span>
        </h2>
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

function S13Outcomes() {
  const tiers = [
    {
      tag: "ON DAY ONE",
      stat: "Day 1",
      statLabel: "vs 6 to 12 months of solo PDF reading",
      headline: "Walk into a structured field",
      bullets: [
        "Schools, lineages, and disagreements typed and visible from the start.",
        "Zero setup tax. The structure exists before you do the work.",
        "You start judging the field, not cataloguing it.",
      ],
    },
    {
      tag: "WHILE YOU WORK",
      stat: "10x",
      statLabel: "more hours judging and writing, fewer hours searching",
      headline: "Augmented, not replaced",
      bullets: [
        "AI surfaces counter-arguments and trade-offs inside the structured map.",
        "Every claim stays attributable to you. No model voice in your thesis.",
        "Your why-not-this decisions get captured as you reason, not lost in a notebook.",
      ],
    },
    {
      tag: "AT THE END",
      stat: "100%",
      statLabel: "portable, LLM-agnostic, owned by you",
      headline: "A portable asset that is yours",
      bullets: [
        "A structured graph of how you connect ideas. Yours, across projects and years.",
        "Travels with you to the next paper, the next field, the next role.",
        "The thinking compounds. The next project starts where this one ended.",
      ],
    },
  ];
  return (
    <div className="w-full h-full relative px-28 py-16" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="10" text="OUTCOMES" />
        <h2 className="font-black mt-5 mb-8" style={{ fontSize: 52, lineHeight: 1.05, color: TEXT }}>
          What changes <span style={{ color: `hsl(${TEAL})` }}>for the researcher.</span>
        </h2>
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
              <p className="mt-3 font-black leading-none tracking-tight" style={{ fontSize: 80, color: `hsl(${TEAL})` }}>{t.stat}</p>
              <p className="mt-2" style={{ fontSize: 14, fontWeight: 700, color: MUTED, lineHeight: 1.4 }}>{t.statLabel}</p>
              <div className="mt-5 mb-4 h-px" style={{ background: CHROME_BORDER }} />
              <p className="mb-4 font-black" style={{ fontSize: 22, color: TEXT, lineHeight: 1.2 }}>{t.headline}</p>
              <ul className="space-y-3">
                {t.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3" style={{ fontSize: 14, color: TEXT, lineHeight: 1.45 }}>
                    <span style={{ color: `hsl(${TEAL})`, fontWeight: 800, flexShrink: 0 }}>›</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
        <Eyebrow n="11" text="HOW TO START" />
        <h2 className="font-black mt-5 mb-10" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          Be the first researcher <span style={{ color: `hsl(${TEAL})` }}>to co-build it.</span>
        </h2>
        <div className="flex-1 flex">
          <div className="rounded-2xl p-14 flex flex-col w-full" style={{ background: TEXT, color: BG }}>
            <p style={{ fontSize: 18, fontWeight: 800, letterSpacing: "0.25em", color: `hsl(${MINT})` }}>DESIGN PARTNER · ONE RESEARCHER</p>
            <p className="font-black mt-5 mb-7" style={{ fontSize: 56, lineHeight: 1.05 }}>Run the semester pilot</p>
            <p style={{ fontSize: 26, color: "hsl(0 0% 100% / 0.85)", lineHeight: 1.5, maxWidth: 1300 }}>
              One researcher. One field. Sixteen weeks. We co-build the Research Memory Layer alongside you and leave you with a usable field map, a judgment log, and a portable structured graph that is yours after the pilot ends.
            </p>
            <div className="mt-auto pt-10 flex items-center gap-3">
              <p style={{ fontSize: 16, color: "hsl(0 0% 100% / 0.6)", letterSpacing: "0.18em" }}>NO INSTITUTIONAL COMMITMENT REQUIRED</p>
            </div>
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
          The structure of a field, on day one. AI that reasons inside it. A portable record of how you think. That is what we are building.
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
  { id: 7, title: "The Shift", component: <S07Shift /> },
  { id: 8, title: "How It Works", component: <S08Loop /> },
  { id: 9, title: "Architecture", component: <S09Architecture /> },
  { id: 10, title: "Outcomes", component: <S13Outcomes /> },
  { id: 11, title: "How to Start", component: <S14TwoDoor /> },
  { id: 12, title: "Close", component: <S15Close /> },
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