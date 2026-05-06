import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ArrowRight, BookOpen, Brain, ChevronLeft, ChevronRight, Eye, FileText,
  GitBranch, Globe, Grid3x3, Layers, Lightbulb, Maximize2, Network,
  RefreshCw, Sparkles, Target, Users, Workflow, X,
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
        <h1 className="font-black mb-6" style={{ fontSize: 88, lineHeight: 1.04, color: TEXT }}>
          Don't review the literature.<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${TEAL}), hsl(${MINT}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Understand the field.
          </span>
        </h1>
        <p className="mb-12" style={{ fontSize: 28, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          A research memory layer for universities and research groups. Map the hierarchies between schools, lineages of ideas, and disagreements between authors — then think further inside that map. <span style={{ color: `hsl(${TEAL})` }}>Augmentation, not automation.</span>
        </p>
        <p style={{ fontSize: 20, color: SUBTLE }}>
          Concept · Cohort Pilot · Sponsor Track
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

function S02WhoBreaks() {
  const personas = [
    { who: "PhD candidate", pain: "6–12 months lost to a literature review that flattens the field", win: "Map the field in weeks. Stay the author.", Icon: BookOpen },
    { who: "Early-career researcher", pain: "Cannot see the lineages of disagreement between authors", win: "Surfaces schools, debates, and why-not-this decisions", Icon: GitBranch },
    { who: "PI / research group lead", pain: "Tacit judgment dies between cohorts; new students restart from zero", win: "Group's reasoning becomes a compounding asset", Icon: Users },
    { who: "Faculty / Vice-Rector", pain: "Generative AI hollows out the next generation of researchers", win: "An institutional standard for AI-augmented research", Icon: Globe },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="02" text="WHO THIS BREAKS FOR" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          Four people. <span style={{ color: `hsl(${TEAL})` }}>One missing layer.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          The literature review is not a bibliography task. It is the act of mapping a field — and right now every researcher does it alone, from scratch, in private.
        </p>
        <div className="grid grid-cols-2 gap-6 flex-1">
          {personas.map(p => {
            const Icon = p.Icon;
            return (
              <div key={p.who} className="rounded-2xl border p-8 flex flex-col" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
                    <Icon size={28} />
                  </div>
                  <p className="font-black" style={{ fontSize: 30, color: TEXT }}>{p.who}</p>
                </div>
                <p className="mb-3" style={{ fontSize: 19, color: `hsl(${RED})`, fontWeight: 700 }}>Today: {p.pain}</p>
                <p style={{ fontSize: 19, color: TEXT }}><span style={{ color: `hsl(${TEAL})`, fontWeight: 800 }}>With LIZA OS: </span>{p.win}</p>
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
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="03" text="THE GAP" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          A literature review captures the tip. <span style={{ color: `hsl(${TEAL})` }}>The field lives below.</span>
        </h2>
        <p className="mb-6" style={{ fontSize: 22, color: MUTED, maxWidth: 1400, lineHeight: 1.45 }}>
          Citations, abstracts, keywords, recent papers — all visible. The hierarchies, lineages, and tacit disagreements that actually constitute the field stay invisible. That is the layer LIZA OS makes legible.
        </p>
        <div className="flex-1 flex items-center justify-center">
          <div style={{ width: 1200 }}>
            <DeckIceberg
              aboveLabel="What a literature review captures"
              belowLabel="What actually constitutes the field"
              above={["Citation lists", "Abstracts", "Keywords", "Recent papers"]}
              below={[
                "Hierarchies between schools of thought",
                "Lineages of ideas across decades",
                "Tacit disagreements between authors",
                "Why-not-this decisions in past debates",
              ]}
            />
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S04ThirdPath() {
  const cols = [
    { tag: "PATH 1", title: "Manual review", body: "Months in PDFs. Field flattened to a bibliography. Tacit knowledge stays in the researcher's head and dies with the cohort.", tone: RED },
    { tag: "PATH 2", title: "Generative AI writes the thesis", body: "Speed, but the researcher is hollowed out. Judgment never forms. The institution loses its next generation of thinkers.", tone: AMBER },
    { tag: "PATH 3", title: "LIZA OS — Research Memory Layer", body: "Map the field. Surface relations between schools, authors, lineages. Augment the researcher's own thinking inside the map. Compound across cohorts.", tone: TEAL },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="04" text="THE THIRD PATH" />
        <h2 className="font-black mt-5 mb-10" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          Researchers are forced to <span style={{ color: `hsl(${RED})` }}>flatten</span> or be <span style={{ color: `hsl(${AMBER})` }}>replaced.</span><br />
          <span style={{ color: `hsl(${TEAL})` }}>There is a third option.</span>
        </h2>
        <div className="grid grid-cols-3 gap-6 flex-1">
          {cols.map(c => (
            <div key={c.tag} className="rounded-2xl border-2 p-8 flex flex-col" style={{ borderColor: `hsl(${c.tone} / 0.5)`, background: `hsl(${c.tone} / 0.04)` }}>
              <p style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.25em", color: `hsl(${c.tone})` }}>{c.tag}</p>
              <p className="mt-3 mb-5 font-black" style={{ fontSize: 32, lineHeight: 1.15, color: TEXT }}>{c.title}</p>
              <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.45 }}>{c.body}</p>
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
    { stat: "6–12 mo", label: "Lost to literature review", source: "Cochrane / PRISMA guidance" },
    { stat: "30%+", label: "Of the field never read", source: "Meta-research on review coverage" },
    { stat: "1 in 2", label: "Researchers hollowed out by automation", source: "HBR, 2025 · AI and knowledge work" },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="06" text="WHY NOW" />
        <h2 className="font-black mt-5 mb-10" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          The cost of doing nothing <span style={{ color: `hsl(${TEAL})` }}>is already paid — every day.</span>
        </h2>
        <div className="grid grid-cols-3 gap-6 flex-1">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl border p-10 flex flex-col" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <p className="font-black leading-none tracking-tight" style={{ fontSize: 110, color: `hsl(${TEAL})` }}>{s.stat}</p>
              <p className="mt-6" style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.12em", color: TEXT, textTransform: "uppercase" }}>{s.label}</p>
              <div className="flex-1" />
              <p style={{ fontSize: 16, color: SUBTLE, fontStyle: "italic" }}>Source: {s.source}</p>
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
    { step: "1 · Map", short: "See the field, not a list.", desc: "Ingest the corpus and surface schools, lineages, and disagreements between authors — not a flat bibliography.", Icon: Network },
    { step: "2 · Anchor", short: "Codify your stance.", desc: "Your assumptions, framework, and prior work become executable context the system reasons against.", Icon: BookOpen },
    { step: "3 · Augment", short: "Think further, faster.", desc: "Trade-offs, counter-arguments, and gaps surface in dialogue. The researcher stays the author.", Icon: Sparkles },
    { step: "4 · Compound", short: "Knowledge accumulates.", desc: "Every reading, note, and decision feeds the next project — for the researcher, the lab, and the institution.", Icon: RefreshCw },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="07" text="HOW IT WORKS" />
        <h2 className="font-black mt-5 mb-10" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          Map → Anchor → Augment → <span style={{ color: `hsl(${TEAL})` }}>Compound.</span>
        </h2>
        <div className="grid grid-cols-4 gap-5 flex-1">
          {loop.map((s) => {
            const Icon = s.Icon;
            return (
              <div key={s.step} className="rounded-2xl border p-7 flex flex-col" style={{ borderColor: CHROME_BORDER, background: BG }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 mb-5" style={{ borderColor: `hsl(${TEAL})`, color: `hsl(${TEAL})` }}>
                  <Icon size={30} />
                </div>
                <p className="font-black" style={{ fontSize: 26, color: TEXT }}>{s.step}</p>
                <p className="mt-2 mb-3 font-bold" style={{ fontSize: 20, color: `hsl(${TEAL})` }}>{s.short}</p>
                <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-center" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.2em", color: MUTED, textTransform: "uppercase" }}>
          Each project leaves the next researcher smarter
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

function S08Landscape() {
  const tools = [
    { name: "Elicit / Consensus / Scite", role: "Search + summarisation", gap: "Returns lists. Does not surface hierarchies between schools or lineages of ideas." },
    { name: "ChatGPT / Claude / Gemini", role: "General writing assistants", gap: "Generates the prose. Hollows out the researcher. No memory of the field, the lab, or prior work." },
    { name: "Zotero / Mendeley / Notion", role: "Reference + note managers", gap: "Stores artifacts. Does not reason about the relations between them." },
    { name: "Research Rabbit / Connected Papers", role: "Citation graphs", gap: "Maps citations. Does not capture tacit disagreement, judgment, or why-not-this decisions." },
    { name: "Obsidian / Roam", role: "Personal knowledge graphs", gap: "Solo by design. No cohort, no lab, no institution. Knowledge dies with the user." },
  ];
  return (
    <div className="w-full h-full relative px-28 py-16" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="08" text="THE LANDSCAPE" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          Existing tools handle artifacts. <span style={{ color: `hsl(${TEAL})` }}>None handle the field.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 20, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          Five categories of tooling already exist in research workflows. Each addresses a slice. None hold the map of the field, the group's accumulated judgment, or the institution's memory across cohorts.
        </p>
        <div className="flex-1 grid grid-cols-1 gap-3">
          {tools.map(t => (
            <div key={t.name} className="rounded-xl border p-5 grid grid-cols-12 gap-6 items-center" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <p className="col-span-3 font-black" style={{ fontSize: 22, color: TEXT }}>{t.name}</p>
              <p className="col-span-3" style={{ fontSize: 18, fontWeight: 700, color: `hsl(${TEAL})` }}>{t.role}</p>
              <p className="col-span-6" style={{ fontSize: 18, color: MUTED }}><span style={{ color: `hsl(${RED})`, fontWeight: 700 }}>Gap: </span>{t.gap}</p>
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
    { tag: "L1 · Corpus", title: "Field Map", body: "Papers, books, citations, datasets — ingested and resolved into schools, lineages, and authors with their disagreements.", Icon: Layers },
    { tag: "L2 · Researcher", title: "Stance & Judgment Log", body: "The researcher's framework, assumptions, prior work, and why-not-this decisions captured as executable context.", Icon: FileText },
    { tag: "L3 · Cohort", title: "Commons of the Lab", body: "Group's collective reading, dialogues, and disagreements compound across cohorts. Tacit knowledge survives the PhD.", Icon: Users },
    { tag: "L4 · Reasoning", title: "Augmentation Loop", body: "Counter-arguments, gaps, and trade-offs surface in dialogue. The researcher stays the author of every claim.", Icon: Workflow },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="09" text="ARCHITECTURE" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          Four layers. <span style={{ color: `hsl(${TEAL})` }}>One memory.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          The Research Memory Layer is not a chatbot wrapped around papers. It is a stack: corpus, researcher, cohort, reasoning — each compounding into the next.
        </p>
        <div className="grid grid-cols-4 gap-5 flex-1">
          {layers.map(l => {
            const Icon = l.Icon;
            return (
              <div key={l.tag} className="rounded-2xl border-2 p-7 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: BG }}>
                <p style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.25em", color: `hsl(${TEAL})` }}>{l.tag}</p>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center my-5" style={{ background: `hsl(${TEAL} / 0.12)`, color: `hsl(${TEAL})` }}>
                  <Icon size={28} />
                </div>
                <p className="font-black mb-3" style={{ fontSize: 26, color: TEXT }}>{l.title}</p>
                <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>{l.body}</p>
              </div>
            );
          })}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S10SECI() {
  const phases = [
    { tag: "Socialisation", body: "Tacit → tacit. Reading group dialogue, advisor-student conversation. The system listens, never replaces.", color: TEAL },
    { tag: "Externalisation", body: "Tacit → explicit. Judgments, disagreements, and why-not-this decisions captured as first-class objects.", color: MINT },
    { tag: "Combination", body: "Explicit → explicit. The field map links externalised judgments across schools, lineages, and decades.", color: NAVY },
    { tag: "Internalisation", body: "Explicit → tacit. The next cohort starts from the field map and forms their own judgment faster, deeper.", color: TEAL },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="10" text="THE LOOP THAT MAKES KNOWLEDGE" />
        <h2 className="font-black mt-5 mb-3" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          SECI as product. <span style={{ color: `hsl(${TEAL})` }}>Not a metaphor — a mechanism.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.45 }}>
          Nonaka's SECI loop describes how knowledge is actually created in groups. LIZA OS implements each phase as a primitive: dialogue capture, externalisation of judgment, combination through the field map, and re-internalisation in the next cohort.
        </p>
        <div className="grid grid-cols-4 gap-5 flex-1">
          {phases.map((p, i) => (
            <div key={p.tag} className="rounded-2xl p-8 flex flex-col" style={{ background: `hsl(${p.color} / 0.08)`, border: `1px solid hsl(${p.color} / 0.3)` }}>
              <p className="font-black" style={{ fontSize: 22, color: `hsl(${p.color})`, letterSpacing: "0.05em" }}>0{i + 1}</p>
              <p className="font-black mt-3 mb-4" style={{ fontSize: 28, color: TEXT }}>{p.tag}</p>
              <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.5 }}>{p.body}</p>
            </div>
          ))}
        </div>
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
        <div className="grid grid-cols-3 gap-6 flex-1">
          {[
            { tag: "Weeks 1–4", title: "Map the field", body: "Ingest the group's corpus. Surface schools, lineages, disagreements. Researcher reviews and corrects." },
            { tag: "Weeks 5–10", title: "Anchor & augment", body: "Researcher's stance and judgments captured. Dialogues run inside the map. Counter-arguments surface in real time." },
            { tag: "Weeks 11–16", title: "Compound & hand off", body: "The map and judgment log become the cohort's shared memory. Next student starts from there." },
          ].map(p => (
            <div key={p.tag} className="rounded-2xl border-2 p-8 flex flex-col" style={{ borderColor: `hsl(${TEAL} / 0.4)`, background: BG }}>
              <p style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.25em", color: `hsl(${TEAL})` }}>{p.tag}</p>
              <p className="font-black mt-3 mb-4" style={{ fontSize: 28, color: TEXT }}>{p.title}</p>
              <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.5 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

function S13Outcomes() {
  const k = [
    { v: "−60%", l: "Time to a credible field map", d: "From 6–12 months of solo review to 6–10 weeks of group dialogue inside the map." },
    { v: "+3×", l: "Deep-work hours returned", d: "Measured against baseline. Flow as the metric, not throughput." },
    { v: "1", l: "Compounding cohort memory", d: "First semester where the next PhD inherits the previous cohort's judgment, not just their files." },
  ];
  return (
    <div className="w-full h-full relative px-28 py-20" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <Eyebrow n="13" text="OUTCOMES" />
        <h2 className="font-black mt-5 mb-10" style={{ fontSize: 60, lineHeight: 1.05, color: TEXT }}>
          What changes <span style={{ color: `hsl(${TEAL})` }}>after one semester.</span>
        </h2>
        <div className="grid grid-cols-3 gap-6 flex-1">
          {k.map(s => (
            <div key={s.l} className="rounded-2xl border p-10 flex flex-col" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <p className="font-black leading-none" style={{ fontSize: 110, color: `hsl(${TEAL})` }}>{s.v}</p>
              <p className="mt-6" style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.1em", color: TEXT, textTransform: "uppercase" }}>{s.l}</p>
              <p className="mt-3" style={{ fontSize: 19, color: MUTED, lineHeight: 1.5 }}>{s.d}</p>
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
  { id: 10, title: "SECI as Product", component: <S10SECI /> },
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