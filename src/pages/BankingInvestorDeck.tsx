import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  Check, Landmark, Megaphone, Users, Banknote, ShieldCheck,
  ScrollText, BarChart3,
} from "lucide-react";
import { ExportMenu } from "@/components/ExportMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ── Scaled slide container ──────────────────────────────────────────────── */
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

/* ── Palette (banking: deep navy + teal accent + warm gold) ──────────────── */
const BG = "hsl(0 0% 100%)";
const TEXT = "hsl(222 25% 10%)";
const MUTED = "hsl(215 15% 42%)";
const SUBTLE = "hsl(215 10% 56%)";
const CARD_ALT = "hsl(220 15% 97%)";
const GRID_LINE = "hsl(215 15% 75%)";
const CHROME_BG = "hsl(220 15% 97%)";
const CHROME_BORDER = "hsl(220 12% 90%)";

const NAVY = "220 70% 22%";
const TEAL = "190 85% 32%";
const GOLD = "38 92% 50%";
const WARM = "15 85% 55%";
const GREEN = "155 72% 38%";
const BLUE = "220 80% 50%";
const RED = "0 72% 50%";

function SlideGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.06]" style={{
      backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
      backgroundSize: "80px 80px",
    }} />
  );
}

function SlideBar({ from = NAVY, to = TEAL }: { from?: string; to?: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1.5"
      style={{ background: `linear-gradient(90deg, hsl(${from}), hsl(${to}))` }} />
  );
}

function SlideTag({ num, label }: { num: string; label: string }) {
  return (
    <div className="px-3 py-1 rounded-md text-xs font-bold tracking-[0.2em]"
      style={{ background: `hsl(${NAVY} / 0.1)`, color: `hsl(${NAVY})` }}>
      {num} · {label}
    </div>
  );
}

/* ═══ SLIDE 01 — COVER ═══════════════════════════════════════════════════ */
function Slide01() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/4 left-1/3 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${NAVY}), transparent 70%)` }} />
      <div className="relative z-10 flex flex-col items-center text-center px-28">
        <div className="flex items-center gap-3 mb-14 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${TEAL} / 0.35)`, background: `hsl(${TEAL} / 0.08)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${TEAL})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 26, color: `hsl(${TEAL})` }}>
            LIZA OS · Retail Banking · Customer First, Investor Optional
          </span>
        </div>
        <h1 className="font-black mb-6" style={{ fontSize: 80, lineHeight: 1.05, color: TEXT }}>
          The Brand &amp; Compliance Memory Layer<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${NAVY}), hsl(${TEAL}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            for AI-Native Retail Banking.
          </span>
        </h1>
        <p className="mb-14" style={{ fontSize: 28, color: MUTED, maxWidth: 1200, lineHeight: 1.5 }}>
          No bank has shipped the marketing &amp; compliance memory layer yet. The first retail bank to codify it with us defines the standard the rest of CEE — and beyond — adopts.<br />
          <span style={{ color: `hsl(${TEAL})` }}>Become a customer first. Take a strategic stake if you want to own the category with us.</span>
        </p>
        <p style={{ fontSize: 20, color: SUBTLE }}>
          Confidential &nbsp;·&nbsp; Two-Door Conversation &nbsp;·&nbsp; Marketing Pilot · Memory Layer · Optional Strategic Stake
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

/* ═══ SLIDE 02 — THE CONTEXT GAP (banking flavour) ═══════════════════════ */
function Slide02() {
  const inputs = ["Brand book", "Product rules", "Regulator guidelines", "Prior approvals", "Segment data", "Past campaigns"];
  const outputs = ["Campaign briefs", "Landing pages", "Email & in-app", "Disclosures", "Complaint responses", "Sales scripts"];
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col justify-center h-full px-28 py-10">
        <p className="font-semibold tracking-[0.25em] uppercase mb-3" style={{ fontSize: 24, color: `hsl(${WARM})` }}>
          The Context Gap · Retail Banking
        </p>
        <h2 className="font-black mb-10" style={{ fontSize: 52, color: TEXT, lineHeight: 1.08 }}>
          Banks have inputs. AI generates outputs.<br />
          <span style={{ color: `hsl(${WARM})` }}>There's no system that makes AI work to your brand and your regulators.</span>
        </h2>
        <div className="flex items-stretch gap-0 flex-1 min-h-0 max-h-[420px]">
          <div className="flex-1 rounded-l-2xl border-2 p-8 flex flex-col justify-center"
            style={{ borderColor: `hsl(${TEAL} / 0.3)`, background: `hsl(${TEAL} / 0.06)`, borderRight: "none" }}>
            <p className="font-black tracking-[0.15em] uppercase mb-1" style={{ fontSize: 13, color: `hsl(${TEAL})` }}>Input Artifacts</p>
            <p className="font-bold mb-6" style={{ fontSize: 22, color: TEXT }}>What banks feed AI today</p>
            <div className="flex flex-wrap gap-3">
              {inputs.map(item => (
                <span key={item} className="rounded-full px-5 py-2.5 font-bold"
                  style={{ fontSize: 16, background: `hsl(${TEAL} / 0.12)`, color: TEXT, border: `1px solid hsl(${TEAL} / 0.2)` }}>
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-5">
              <Check size={18} style={{ color: `hsl(${TEAL})` }} />
              <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${TEAL})` }}>Already digitized. Already approved.</p>
            </div>
            <p className="mt-2" style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>
              But none of it is queryable by your AI copilots in a governed way.
            </p>
          </div>
          <div className="w-[340px] shrink-0 border-y-2 flex flex-col items-center justify-center relative"
            style={{ borderColor: `hsl(${WARM} / 0.3)`, background: `hsl(${WARM} / 0.04)` }}>
            <div className="absolute left-0 top-8 bottom-8 w-px" style={{ borderLeft: `2px dashed hsl(${WARM} / 0.2)` }} />
            <div className="absolute right-0 top-8 bottom-8 w-px" style={{ borderRight: `2px dashed hsl(${WARM} / 0.2)` }} />
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
              style={{ background: `hsl(${WARM} / 0.12)`, border: `2px solid hsl(${WARM} / 0.3)` }}>
              <span className="font-black" style={{ fontSize: 44, color: `hsl(${WARM})` }}>?</span>
            </div>
            <p className="font-black text-center mb-2" style={{ fontSize: 24, color: `hsl(${WARM})` }}>
              No System of<br />Brand &amp; Conduct
            </p>
            <p className="text-center px-5" style={{ fontSize: 15, color: MUTED, lineHeight: 1.55 }}>
              AI can write fast, but it can't apply your brand voice, product rules, or regulator-safe wording.
            </p>
            <p className="font-semibold text-center mt-4 px-4" style={{ fontSize: 14, color: TEXT }}>
              Result: marketing, legal, and compliance redo AI's work instead of scaling their own.
            </p>
          </div>
          <div className="flex-1 rounded-r-2xl border-2 p-8 flex flex-col justify-center"
            style={{ borderColor: `hsl(${GREEN} / 0.3)`, background: `hsl(${GREEN} / 0.06)`, borderLeft: "none" }}>
            <p className="font-black tracking-[0.15em] uppercase mb-1" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Output Artifacts</p>
            <p className="font-bold mb-6" style={{ fontSize: 22, color: TEXT }}>What AI produces without guidance</p>
            <div className="flex flex-wrap gap-3">
              {outputs.map(item => (
                <span key={item} className="rounded-full px-5 py-2.5 font-bold"
                  style={{ fontSize: 16, background: `hsl(${GREEN} / 0.12)`, color: TEXT, border: `1px solid hsl(${GREEN} / 0.2)` }}>
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-5">
              <Check size={18} style={{ color: `hsl(${GREEN})` }} />
              <p className="font-semibold" style={{ fontSize: 15, color: `hsl(${GREEN})` }}>Already fast. Already cheap.</p>
            </div>
            <p className="mt-2" style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>
              But generic — and every market &amp; product team drifts a little further from the brand.
            </p>
          </div>
        </div>
        <div className="mt-8 rounded-xl px-10 py-5 text-center" style={{ background: `hsl(${WARM} / 0.08)`, border: `1.5px solid hsl(${WARM} / 0.25)` }}>
          <p className="font-black" style={{ fontSize: 26, color: TEXT }}>
            Whatever you don't define, <span style={{ color: `hsl(${WARM})` }}>AI invents — at scale, in your name.</span>
          </p>
        </div>
      </div>
      <SlideBar from={WARM} to={NAVY} />
    </div>
  );
}

/* ═══ SLIDE 03 — WHERE IT SHOWS UP IN RETAIL BANKING ═════════════════════ */
const BANKING_PAINS = [
  { area: "Brand & Campaign", pain: "Every campaign re-litigates compliance from scratch — same questions, same rewrites, every time.", cost: "30–50% of marketing cycle time" },
  { area: "Multi-country drift", pain: "Tone, claims, and disclaimers vary across CEE country units. Group brand drifts. Local legal patches it.", cost: "Brand consistency, regulator risk" },
  { area: "Complaints & Conduct", pain: "Adjudicators reinterpret conduct rules under pressure. Wording precedent lives in people's heads.", cost: "Consumer Duty exposure, redress cost" },
  { area: "KYC & Onboarding", pain: "Adverse-media adjudication is judgment-heavy. Copilots help — but only the seniors know the bank's standard.", cost: "Onboarding latency, AML risk" },
  { area: "Credit & Model Governance", pain: "Credit memos and ICAAP narratives need policy + prior precedent. AI drafts ignore both.", cost: "Rework, EBA model-risk findings" },
];

function Slide03() {
  return (
    <div className="w-full h-full relative px-28 py-14" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <SlideTag num="03" label="WHERE THE GAP SHOWS UP" />
        <h2 className="font-black mt-4 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          The same gap, <span style={{ color: `hsl(${NAVY})` }}>five painful places.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 22, color: MUTED, maxWidth: 1300, lineHeight: 1.4 }}>
          We start where pain is highest, volume is biggest, and feedback is fastest: marketing. The same memory layer extends into the rest.
        </p>
        <div className="flex-1 grid grid-cols-1 gap-3">
          {BANKING_PAINS.map((p, i) => (
            <div key={i} className="rounded-xl border p-5 flex items-center gap-6"
              style={{ borderColor: CHROME_BORDER, background: i === 0 ? `hsl(${TEAL} / 0.05)` : CARD_ALT }}>
              <div className="w-44 shrink-0">
                <div className="font-black" style={{ fontSize: 20, color: i === 0 ? `hsl(${TEAL})` : `hsl(${NAVY})` }}>
                  {p.area}
                </div>
                {i === 0 && (
                  <div className="mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-[0.15em]"
                    style={{ background: `hsl(${TEAL})`, color: "white" }}>WEDGE</div>
                )}
              </div>
              <div className="flex-1" style={{ fontSize: 18, color: TEXT, lineHeight: 1.4 }}>{p.pain}</div>
              <div className="w-72 shrink-0 text-right" style={{ fontSize: 16, color: `hsl(${WARM})`, fontWeight: 600 }}>
                {p.cost}
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

/* ═══ SLIDE 04 — WHAT IT COSTS ═══════════════════════════════════════════ */
function Slide04() {
  const stats = [
    { num: "30–50%", label: "of marketing cycle time", sub: "spent re-clearing compliance on every brief" },
    { num: "€2–5M", label: "annual cost of brand drift", sub: "for a Tier-1 retail bank with 5+ markets (modelled)" },
    { num: "9–18 mo", label: "to roll out a new product across CEE", sub: "most of it is local rewriting, not local strategy" },
    { num: "0", label: "platforms governing AI marketing output", sub: "across every regulator we've checked" },
  ];
  return (
    <div className="w-full h-full relative px-28 py-14" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <SlideTag num="04" label="WHAT THE GAP COSTS" />
        <h2 className="font-black mt-4 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          The cost of un-codified judgment <span style={{ color: `hsl(${WARM})` }}>compounds quietly.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1300, lineHeight: 1.4 }}>
          None of these line items show up under "AI" in the budget. They show up as marketing throughput, time-to-market, and conduct risk.
        </p>
        <div className="grid grid-cols-2 gap-6 flex-1">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl p-8 border-2 flex flex-col justify-center"
              style={{ borderColor: `hsl(${NAVY} / 0.15)`, background: CARD_ALT }}>
              <div className="font-black mb-2" style={{ fontSize: 84, lineHeight: 1, color: `hsl(${NAVY})` }}>{s.num}</div>
              <div className="font-bold mb-1" style={{ fontSize: 22, color: TEXT }}>{s.label}</div>
              <div style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

/* ═══ SLIDE 05 — WHY NOW ═════════════════════════════════════════════════ */
function Slide05() {
  const reasons = [
    { title: "Every bank now has copilots", desc: "Microsoft, Google, in-house. Each one drafts in your name with no governance layer above it." },
    { title: "DORA & Consumer Duty are live", desc: "Regulators now expect demonstrable governance over automated outputs — not just over models." },
    { title: "CEE is a strategic race", desc: "OTP, Erste, RBI, KBC are all rolling out group-wide AI. Whoever codifies first sets the standard." },
    { title: "No one has built it yet", desc: "Glean and peers index documents. None enforce brand, product, and conduct judgment on AI outputs." },
  ];
  return (
    <div className="w-full h-full relative px-28 py-14" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <SlideTag num="05" label="WHY NOW" />
        <h2 className="font-black mt-4 mb-10" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          Four forces converge <span style={{ color: `hsl(${NAVY})` }}>this year.</span>
        </h2>
        <div className="grid grid-cols-2 gap-6 flex-1">
          {reasons.map((r, i) => (
            <div key={i} className="rounded-2xl border-2 p-8 flex flex-col"
              style={{ borderColor: `hsl(${NAVY} / 0.15)`, background: CARD_ALT }}>
              <div className="font-black mb-3" style={{ fontSize: 28, color: `hsl(${NAVY})` }}>0{i + 1}</div>
              <div className="font-bold mb-2" style={{ fontSize: 24, color: TEXT }}>{r.title}</div>
              <div style={{ fontSize: 18, color: MUTED, lineHeight: 1.5 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

/* ═══ SLIDE 06 — THE CONTEXT LAYER ═══════════════════════════════════════ */
function Slide06() {
  const steps = [
    { num: "01", title: "Capture", desc: "Brand voice, product rules, regulator wording, and prior approvals become structured, queryable context." },
    { num: "02", title: "Govern", desc: "Every AI-generated brief, page, email, and disclosure is gated against the full context — by role, market, and product." },
    { num: "03", title: "Execute", desc: "Marketing, legal, compliance, and product work inside the same governed standard. Cycle time collapses." },
    { num: "04", title: "Learn", desc: "Approvals, exceptions, and winning variants feed back. The bank's brand &amp; conduct memory compounds." },
  ];
  return (
    <div className="w-full h-full relative px-28 py-14" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <SlideTag num="06" label="THE LIZA OS LOOP" />
        <h2 className="font-black mt-4 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          A four-step memory layer, <span style={{ color: `hsl(${TEAL})` }}>built for the bank.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1300, lineHeight: 1.4 }}>
          Your core banking, GRC, and Copilot stay yours. LIZA is the active intelligence layer above them.
        </p>
        <div className="grid grid-cols-4 gap-5 flex-1">
          {steps.map(s => (
            <div key={s.num} className="rounded-2xl border-2 p-7 flex flex-col"
              style={{ borderColor: `hsl(${NAVY} / 0.15)`, background: CARD_ALT }}>
              <div className="font-black tracking-[0.2em] mb-3" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>STEP {s.num}</div>
              <div className="font-black mb-3" style={{ fontSize: 30, color: `hsl(${NAVY})` }}>{s.title}</div>
              <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: s.desc }} />
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl px-8 py-5 text-center"
          style={{ background: `linear-gradient(135deg, hsl(${NAVY}), hsl(${TEAL}))` }}>
          <p className="font-black" style={{ fontSize: 24, color: "white" }}>
            Other tools give your AI your documents. We give your AI <em>your judgment</em>.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

/* ═══ SLIDE 07 — MARKETING WEDGE PILOT (30 days) ═════════════════════════ */
function Slide07() {
  const phases = [
    { week: "Week 1", title: "Encode", desc: "Brand book, product rules, top-3 regulator wordings, and 10 reference campaigns become structured context." },
    { week: "Week 2", title: "Wire", desc: "Plug into the bank's Copilot or marketing AI of choice. Define one workflow: campaign brief or landing page." },
    { week: "Week 3", title: "Pilot", desc: "Marketing + compliance run real briefs through the governed flow. Side-by-side vs. status quo." },
    { week: "Week 4", title: "Decide", desc: "Measure cycle time, rewrite cost, and brand consistency. Decide on rollout to 1 country / 1 product line." },
  ];
  return (
    <div className="w-full h-full relative px-28 py-14" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <SlideTag num="07" label="THE 30-DAY MARKETING PILOT" />
        <h2 className="font-black mt-4 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          Prove it in <span style={{ color: `hsl(${TEAL})` }}>one workflow,</span> in 30 days.
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1300, lineHeight: 1.4 }}>
          One marketing workflow. One product line. One country. Real briefs, real compliance reviewers, side-by-side baseline.
        </p>
        <div className="grid grid-cols-4 gap-5 flex-1">
          {phases.map((p, i) => (
            <div key={i} className="rounded-2xl border-2 p-7 flex flex-col relative"
              style={{ borderColor: `hsl(${TEAL} / 0.25)`, background: CARD_ALT }}>
              <div className="font-black tracking-[0.2em] mb-3" style={{ fontSize: 14, color: `hsl(${TEAL})` }}>{p.week}</div>
              <div className="font-black mb-3" style={{ fontSize: 30, color: `hsl(${NAVY})` }}>{p.title}</div>
              <div style={{ fontSize: 17, color: TEXT, lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { k: "Cycle time", v: "−40% target" },
            { k: "Compliance rewrites", v: "−60% target" },
            { k: "Brand consistency", v: "audit-grade" },
          ].map(m => (
            <div key={m.k} className="rounded-lg p-5 border" style={{ borderColor: CHROME_BORDER, background: BG }}>
              <div className="text-xs font-bold tracking-[0.2em] mb-1.5" style={{ color: `hsl(${NAVY})` }}>{m.k.toUpperCase()}</div>
              <div style={{ fontSize: 22, color: TEXT, fontWeight: 700 }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

/* ═══ SLIDE 08 — EXPANSION: THE BANK LIFECYCLE ═══════════════════════════ */
function Slide08() {
  const stages = [
    { icon: <ScrollText className="w-6 h-6" />, label: "Policy & Regulation" },
    { icon: <Megaphone className="w-6 h-6" />, label: "Brand & Campaign", active: true },
    { icon: <Users className="w-6 h-6" />, label: "Onboarding & KYC" },
    { icon: <Banknote className="w-6 h-6" />, label: "Underwriting" },
    { icon: <BarChart3 className="w-6 h-6" />, label: "Servicing & CX" },
    { icon: <ShieldCheck className="w-6 h-6" />, label: "Audit & Reporting" },
  ];
  return (
    <div className="w-full h-full relative px-28 py-14" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <SlideTag num="08" label="EXPANSION PATH" />
        <h2 className="font-black mt-4 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          From marketing wedge <span style={{ color: `hsl(${NAVY})` }}>to bank-wide memory layer.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 22, color: MUTED, maxWidth: 1300, lineHeight: 1.4 }}>
          One context layer, deployed stage by stage. Marketing proves the model; the same architecture extends across the bank.
        </p>
        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-6 gap-4">
            {stages.map(s => (
              <div key={s.label} className="rounded-xl border-2 p-5 flex flex-col items-center text-center" style={{
                borderColor: s.active ? `hsl(${TEAL})` : CHROME_BORDER,
                background: s.active ? `hsl(${TEAL} / 0.06)` : CARD_ALT,
              }}>
                <div className="mb-3" style={{ color: s.active ? `hsl(${TEAL})` : `hsl(${NAVY})` }}>{s.icon}</div>
                <div className="font-bold" style={{ fontSize: 16, color: TEXT, lineHeight: 1.3 }}>{s.label}</div>
                {s.active && (
                  <div className="mt-2 px-2 py-0.5 rounded text-[10px] font-bold tracking-[0.2em]"
                    style={{ background: `hsl(${TEAL})`, color: "white" }}>START HERE</div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6 mb-4" style={{ color: SUBTLE }}>
            <div className="text-2xl">▼ ▼ ▼ ▼ ▼ ▼</div>
          </div>
          <div className="rounded-xl p-6 border-2"
            style={{ background: `linear-gradient(135deg, hsl(${NAVY}), hsl(${TEAL}))`, borderColor: `hsl(${NAVY})` }}>
            <div className="flex items-center justify-between gap-8">
              <div>
                <div className="font-black" style={{ fontSize: 30, color: "white" }}>LIZA OS · The Bank's Memory Layer</div>
                <div style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
                  Brand · Product rules · Regulator wording · Prior approvals · Audit trail
                </div>
              </div>
              <div className="flex gap-3">
                {["Capture", "Govern", "Execute", "Learn"].map(p => (
                  <div key={p} className="px-3 py-1.5 rounded-md font-bold"
                    style={{ background: "rgba(255,255,255,0.18)", color: "white", fontSize: 16 }}>{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

/* ═══ SLIDE 09 — CATEGORY MOAT ═══════════════════════════════════════════ */
function Slide09() {
  const competitors = [
    { name: "Glean / Mem0", what: "Index documents. Retrieve passages.", gap: "No governance over the AI's outputs." },
    { name: "Microsoft Copilot", what: "General productivity assistant.", gap: "No bank-specific brand or conduct context." },
    { name: "MarTech AI suites", what: "Generate copy fast.", gap: "Don't enforce regulator wording or prior approvals." },
    { name: "GRC platforms", what: "Capture rules in PDFs.", gap: "Don't gate AI outputs at runtime." },
  ];
  return (
    <div className="w-full h-full relative px-28 py-14" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <SlideTag num="09" label="CATEGORY MOAT" />
        <h2 className="font-black mt-4 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          Adjacent — but <span style={{ color: `hsl(${NAVY})` }}>nobody is in this lane.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1300, lineHeight: 1.4 }}>
          Document tools index. Copilots write. GRC platforms store. None of them <em>govern AI outputs against the bank's judgment in real time.</em>
        </p>
        <div className="flex-1 grid grid-cols-1 gap-3">
          {competitors.map((c, i) => (
            <div key={i} className="rounded-xl border p-5 grid grid-cols-12 gap-6 items-center"
              style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <div className="col-span-3 font-black" style={{ fontSize: 22, color: `hsl(${NAVY})` }}>{c.name}</div>
              <div className="col-span-5" style={{ fontSize: 17, color: TEXT }}>{c.what}</div>
              <div className="col-span-4" style={{ fontSize: 17, color: `hsl(${WARM})`, fontWeight: 600 }}>{c.gap}</div>
            </div>
          ))}
          <div className="rounded-xl border-2 p-5 grid grid-cols-12 gap-6 items-center"
            style={{ borderColor: `hsl(${TEAL})`, background: `hsl(${TEAL} / 0.08)` }}>
            <div className="col-span-3 font-black" style={{ fontSize: 22, color: `hsl(${TEAL})` }}>LIZA OS</div>
            <div className="col-span-5" style={{ fontSize: 17, color: TEXT, fontWeight: 600 }}>
              Codifies bank judgment + governs every AI output against it at runtime.
            </div>
            <div className="col-span-4" style={{ fontSize: 17, color: `hsl(${GREEN})`, fontWeight: 700 }}>
              The lane no one is in — yet.
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

/* ═══ SLIDE 10 — WHAT'S BUILT ════════════════════════════════════════════ */
function Slide10() {
  const built = [
    { area: "Context Engine", status: "Live", desc: "Structured capture of judgment + rules, versioned and queryable." },
    { area: "Governance Layer", status: "Live", desc: "Role-, market-, product-scoped enforcement on AI outputs." },
    { area: "Copilot Integrations", status: "Live", desc: "Microsoft Copilot, OpenAI, Anthropic, Google — provider-agnostic." },
    { area: "Audit Trail", status: "Live", desc: "Every AI output traceable to its governing context, ready for regulator review." },
    { area: "Banking Templates", status: "In progress", desc: "Pre-built scaffolds for brand, product, conduct, and KYC. Co-built with first banking partner." },
  ];
  return (
    <div className="w-full h-full relative px-28 py-14" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <SlideTag num="10" label="WHAT'S ALREADY BUILT" />
        <h2 className="font-black mt-4 mb-10" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          Not a slideware promise. <span style={{ color: `hsl(${GREEN})` }}>A live platform.</span>
        </h2>
        <div className="flex-1 grid grid-cols-1 gap-3">
          {built.map((b, i) => (
            <div key={i} className="rounded-xl border p-5 flex items-center gap-6"
              style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <div className="w-56 font-black" style={{ fontSize: 22, color: `hsl(${NAVY})` }}>{b.area}</div>
              <div className="w-32 shrink-0">
                <span className="px-3 py-1 rounded-md text-xs font-bold tracking-[0.15em]" style={{
                  background: b.status === "Live" ? `hsl(${GREEN} / 0.15)` : `hsl(${GOLD} / 0.15)`,
                  color: b.status === "Live" ? `hsl(${GREEN})` : `hsl(${GOLD})`,
                }}>{b.status.toUpperCase()}</span>
              </div>
              <div className="flex-1" style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

/* ═══ SLIDE 11 — SHAPE OF THE COMPANY (banking framing) ══════════════════ */
function Slide11() {
  const verticals = [
    { label: "Banking", sub: "Brand · Conduct · KYC · Credit", active: true },
    { label: "Pharma", sub: "GxP · Deviations · CSRs", active: false },
    { label: "AEC", sub: "RFI · Submittals · Handover", active: false },
    { label: "Space / Satcom", sub: "Mission · Fleet memory", active: false },
  ];
  return (
    <div className="w-full h-full relative px-28 py-14" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <SlideTag num="11" label="SHAPE OF THE COMPANY" />
        <h2 className="font-black mt-4 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          One OS. <span style={{ color: `hsl(${TEAL})` }}>Banking is the spear.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1500, lineHeight: 1.4 }}>
          We build a single context layer and deploy it vertical-by-vertical. You are partnering on banking specifically — and benefiting from platform leverage already shipping into other regulated lifecycles.
        </p>
        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-4 gap-6 mb-0">
            {verticals.map(v => (
              <div key={v.label} className="rounded-xl border-2 p-6 relative" style={{
                borderColor: v.active ? `hsl(${TEAL})` : CHROME_BORDER,
                background: v.active ? `hsl(${TEAL} / 0.06)` : CARD_ALT,
              }}>
                {v.active && (
                  <div className="absolute -top-3 left-4 px-2 py-0.5 rounded text-xs font-bold tracking-[0.2em]"
                    style={{ background: `hsl(${TEAL})`, color: "white" }}>YOUR PARTNERSHIP</div>
                )}
                <div className="font-black mb-1" style={{ fontSize: 28, color: v.active ? `hsl(${TEAL})` : TEXT }}>{v.label}</div>
                <div style={{ fontSize: 16, color: MUTED }}>{v.sub}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center my-3" style={{ color: SUBTLE }}>
            <div className="text-3xl leading-none">▾ ▾ ▾ ▾</div>
          </div>
          <div className="rounded-xl p-7 border-2" style={{
            background: `linear-gradient(135deg, hsl(${NAVY}), hsl(${TEAL}))`,
            borderColor: `hsl(${NAVY})`,
          }}>
            <div className="flex items-center justify-between gap-8">
              <div>
                <div className="font-black" style={{ fontSize: 32, color: "white" }}>LIZA OS · The Context Layer</div>
                <div style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
                  Knowledge ingestion · Governance · Execution loop · Audit trail
                </div>
              </div>
              <div className="flex gap-3">
                {["Ingest", "Govern", "Execute", "Audit"].map(p => (
                  <div key={p} className="px-3 py-1.5 rounded-md font-bold"
                    style={{ background: "rgba(255,255,255,0.18)", color: "white", fontSize: 16 }}>{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

/* ═══ SLIDE 12 — TWO-DOOR CONVERSATION ═══════════════════════════════════ */
function Slide12() {
  return (
    <div className="w-full h-full relative px-28 py-14" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 h-full flex flex-col">
        <SlideTag num="12" label="WHERE WE GO FROM HERE" />
        <h2 className="font-black mt-4 mb-3" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT }}>
          Two doors. <span style={{ color: `hsl(${TEAL})` }}>Both are open.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1300, lineHeight: 1.4 }}>
          Pick the door that matches your remit. We're optimising for the customer relationship first; the strategic stake is optional.
        </p>
        <div className="flex-1 grid grid-cols-2 gap-8">
          <div className="rounded-2xl border-2 p-9 flex flex-col"
            style={{ borderColor: `hsl(${TEAL})`, background: `hsl(${TEAL} / 0.06)` }}>
            <div className="px-3 py-1 rounded-md text-xs font-bold tracking-[0.2em] inline-block self-start mb-4"
              style={{ background: `hsl(${TEAL})`, color: "white" }}>OPTION A · CUSTOMER</div>
            <div className="font-black mb-3" style={{ fontSize: 36, color: `hsl(${NAVY})` }}>
              Come on board as a customer
            </div>
            <div className="mb-5" style={{ fontSize: 19, color: TEXT, lineHeight: 1.5 }}>
              30-day pilot on one marketing workflow under your existing Copilot. Real briefs, real reviewers, side-by-side baseline. Decide on rollout based on hard metrics.
            </div>
            <ul className="space-y-2 mt-auto" style={{ fontSize: 17, color: TEXT }}>
              {["Fixed-scope 30-day pilot", "Marketing + compliance co-owned", "Decision: rollout to 1 country / 1 product", "No equity conversation required"].map(li => (
                <li key={li} className="flex items-start gap-2">
                  <Check size={18} style={{ color: `hsl(${TEAL})`, marginTop: 4 }} /> {li}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 p-9 flex flex-col"
            style={{ borderColor: `hsl(${GOLD} / 0.5)`, background: `hsl(${GOLD} / 0.05)` }}>
            <div className="px-3 py-1 rounded-md text-xs font-bold tracking-[0.2em] inline-block self-start mb-4"
              style={{ background: `hsl(${GOLD})`, color: "white" }}>OPTION B · CO-INVEST</div>
            <div className="font-black mb-3" style={{ fontSize: 36, color: `hsl(${NAVY})` }}>
              Co-invest in the category
            </div>
            <div className="mb-5" style={{ fontSize: 19, color: TEXT, lineHeight: 1.5 }}>
              Take a strategic stake to help define the CEE banking reference architecture with us. Lighthouse account status, roadmap influence, and category leadership.
            </div>
            <ul className="space-y-2 mt-auto" style={{ fontSize: 17, color: TEXT }}>
              {["Strategic minority stake", "Banking board observer", "Roadmap visibility on the vertical", "Lighthouse case across CEE"].map(li => (
                <li key={li} className="flex items-start gap-2">
                  <Check size={18} style={{ color: `hsl(${GOLD})`, marginTop: 4 }} /> {li}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 rounded-xl px-8 py-5 text-center"
          style={{ background: `linear-gradient(135deg, hsl(${NAVY}), hsl(${TEAL}))` }}>
          <p className="font-black" style={{ fontSize: 24, color: "white" }}>
            Become a customer first. Co-invest if you want to own the category with us.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

/* ─── Slide registry ─────────────────────────────────────────────────────── */
const SLIDES = [
  { id: 1, title: "Cover", component: <Slide01 /> },
  { id: 2, title: "The Context Gap · Banking", component: <Slide02 /> },
  { id: 3, title: "Where the Gap Shows Up", component: <Slide03 /> },
  { id: 4, title: "What the Gap Costs", component: <Slide04 /> },
  { id: 5, title: "Why Now", component: <Slide05 /> },
  { id: 6, title: "The LIZA OS Loop", component: <Slide06 /> },
  { id: 7, title: "30-Day Marketing Pilot", component: <Slide07 /> },
  { id: 8, title: "Expansion Path", component: <Slide08 /> },
  { id: 9, title: "Category Moat", component: <Slide09 /> },
  { id: 10, title: "What's Built", component: <Slide10 /> },
  { id: 11, title: "Shape of the Company", component: <Slide11 /> },
  { id: 12, title: "Two-Door Conversation", component: <Slide12 /> },
];

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function BankingInvestorDeck() {
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
              style={{ background: `hsl(${NAVY} / 0.1)`, border: `1px solid hsl(${NAVY} / 0.3)` }}>
              <Landmark size={32} style={{ color: `hsl(${NAVY})` }} />
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
          }} onClick={(e) => e.stopPropagation()}>
          <button onClick={prev} disabled={current === 0} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronLeft size={18} style={{ color: TEXT }} />
          </button>
          <span className="font-mono text-xs px-1" style={{ color: MUTED }}>{current + 1}/{SLIDES.length}</span>
          <button onClick={next} disabled={current === SLIDES.length - 1} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronRight size={18} style={{ color: TEXT }} />
          </button>
          <div className="w-px h-4" style={{ background: CHROME_BORDER }} />
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Banking-Investor-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg disabled:opacity-20">
              <ChevronLeft size={20} style={{ color: TEXT }} />
            </button>
            <span className="font-mono text-sm min-w-[60px] text-center" style={{ color: MUTED }}>
              {current + 1} / {SLIDES.length}
            </span>
            <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg disabled:opacity-20">
              <ChevronRight size={20} style={{ color: TEXT }} />
            </button>
            <div className="w-px h-5" style={{ background: CHROME_BORDER }} />
            <button onClick={() => document.exitFullscreen?.()} className="p-2 rounded-lg">
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
          <h2 className="font-bold" style={{ fontSize: 20, color: TEXT }}>LIZA OS · Banking Investor Deck</h2>
          <div className="flex items-center gap-3">
            <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Banking-Investor-Deck" slideCount={SLIDES.length} />
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
              style={{ borderColor: i === current ? `hsl(${NAVY})` : CHROME_BORDER, aspectRatio: "16/9" }}>
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
          <span className="font-bold" style={{ fontSize: 16, color: TEXT }}>LIZA OS · Banking Investor Deck</span>
          <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: CARD_ALT, color: MUTED }}>
            {current + 1} / {SLIDES.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Banking-Investor-Deck" slideCount={SLIDES.length} />
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
            style={{ background: i === current ? `hsl(${NAVY})` : `hsl(215 10% 80%)` }} />
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

/* unused-import sentinel kept for future visual extensions */
void BLUE; void RED;