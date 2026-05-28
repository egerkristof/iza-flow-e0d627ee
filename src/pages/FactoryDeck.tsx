import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  Factory, Cpu, Building2, Users,
  Workflow, Coins, Sparkles, Mail, CheckCircle2, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";
import {
  ScaledSlide, SlideGrid, DarkGrid, SlideBar, Tag, PageNumber, Footer,
  SlideIndexProvider,
  BG, TEXT, MUTED, SUBTLE, CARD_ALT, CHROME_BG, CHROME_BORDER,
  ACCENT, GREEN, GOLD, RED, PURPLE, DARK_BG, DARK_TEXT, DARK_MUTED,
  S03GovernanceLoop, S04ProductionSystem, S07bUnique, S07cFunnel,
  S07eAaceNotRag, S07dOrgLoop, S07fInstrument, S09bAugmentationMechanics,
  S10UnitEconomics, S13LoopClosed,
} from "@/pages/TechDDDeck";

// ═════════════════════════════════════════════════════════════════════════════
// FACTORY DECK — Production-system spine
// Toyota named ONCE on F02. The rest of the deck demonstrates the factory
// without naming it. Lead with the math, anchor with the machine-without-a-factory
// frame, then walk investors station by station through the floor.
// ═════════════════════════════════════════════════════════════════════════════

// ─── F01 · COVER ─────────────────────────────────────────────────────────────
function F01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 text-center px-32 max-w-[1500px]">
        <p className="font-mono uppercase tracking-[0.4em] mb-10" style={{ fontSize: 16, color: `hsl(${GREEN})` }}>
          LIZA OS · Seed Round · Confidential
        </p>
        <h1 className="font-black tracking-tight mb-8" style={{ fontSize: 96, lineHeight: 1.02, color: DARK_TEXT, letterSpacing: "-0.04em" }}>
          AI is the machine.<br />
          <span style={{ color: `hsl(${GREEN})` }}>LIZA is the production system.</span>
        </h1>
        <p className="mx-auto mb-14" style={{ fontSize: 30, lineHeight: 1.35, color: DARK_MUTED, maxWidth: 1180 }}>
          Every enterprise bought the machine. Nobody built the factory. That is why pilots stall, hallucinations multiply, and AI spend has no anchor.
        </p>
        <div className="flex items-center justify-center gap-12">
          {[
            { v: "$0.40", l: "per governed decision" },
            { v: "95%", l: "platform gross margin" },
            { v: "€23", l: "displaced labour cost / decision" },
          ].map((s) => (
            <div key={s.l} className="flex flex-col items-center">
              <span className="font-black" style={{ fontSize: 64, color: DARK_TEXT, letterSpacing: "-0.03em" }}>{s.v}</span>
              <span className="font-mono uppercase tracking-[0.18em] mt-2" style={{ fontSize: 14, color: DARK_MUTED }}>{s.l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono uppercase tracking-[0.3em]" style={{ fontSize: 13, color: `hsl(0 0% 100% / 0.35)` }}>
        €2M Seed · The Factory Floor for AI
      </div>
    </div>
  );
}

// ─── F02 · MACHINE WITHOUT A FACTORY (Toyota named once) ─────────────────────
function F02MachineWithoutFactory() {
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-32 pb-24 flex flex-col">
        <Tag label="The Problem" color={RED} />
        <h2 className="font-black mb-10" style={{ fontSize: 76, lineHeight: 1.04, color: TEXT, letterSpacing: "-0.035em" }}>
          Enterprises bought the machine.<br />
          <span style={{ color: `hsl(${RED})` }}>Nobody built the factory.</span>
        </h2>
        <div className="grid grid-cols-2 gap-12 mt-4 flex-1">
          <div className="rounded-2xl p-10 border" style={{ background: CARD_ALT, borderColor: CHROME_BORDER }}>
            <div className="flex items-center gap-3 mb-6">
              <Cpu size={28} style={{ color: `hsl(${RED})` }} />
              <span className="font-mono uppercase tracking-[0.2em] font-bold" style={{ fontSize: 18, color: `hsl(${RED})` }}>The machine, alone</span>
            </div>
            <p className="font-bold mb-6" style={{ fontSize: 32, color: TEXT, lineHeight: 1.2 }}>
              Copilot, Claude, ChatGPT, agents.
            </p>
            <ul className="space-y-3" style={{ fontSize: 22, color: MUTED, lineHeight: 1.4 }}>
              <li>· Drift between teams. Same prompt, different answer.</li>
              <li>· No standard enforced. No audit trail.</li>
              <li>· Every token unanchored from outcome.</li>
              <li>· Pilots stall. Trust erodes. Budget questioned.</li>
            </ul>
          </div>
          <div className="rounded-2xl p-10 border-2" style={{ background: `hsl(${GREEN} / 0.04)`, borderColor: `hsl(${GREEN} / 0.4)` }}>
            <div className="flex items-center gap-3 mb-6">
              <Factory size={28} style={{ color: `hsl(${GREEN})` }} />
              <span className="font-mono uppercase tracking-[0.2em] font-bold" style={{ fontSize: 18, color: `hsl(${GREEN})` }}>The factory around it</span>
            </div>
            <p className="font-bold mb-6" style={{ fontSize: 32, color: TEXT, lineHeight: 1.2 }}>
              Standards. Stations. Stop-the-line. Takt.
            </p>
            <ul className="space-y-3" style={{ fontSize: 22, color: MUTED, lineHeight: 1.4 }}>
              <li>· Every prompt compiled against a standard.</li>
              <li>· Every decision logged with rationale.</li>
              <li>· Every token tied to a named outcome.</li>
              <li>· Compounds. The machine depreciates; the factory does not.</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 px-8 py-5 rounded-xl border-l-4" style={{ background: CARD_ALT, borderColor: `hsl(${ACCENT})` }}>
          <p style={{ fontSize: 22, color: TEXT, fontStyle: "italic", lineHeight: 1.5 }}>
            Toyota did not win because of the engine. It won because of the production system around it. AI is the same shape of problem at a new scale.
          </p>
        </div>
      </div>
      <Footer text="The machine is now commodity. The production system is the moat." />
      <SlideBar from={RED} to={GREEN} />
    </div>
  );
}

// ─── F03 · ANNOTATED AI EMAIL (the moment of failure) ────────────────────────
function F03AnnotatedEmail() {
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-32 pb-24 flex flex-col">
        <Tag label="The Moment of Failure" color={RED} />
        <h2 className="font-black mb-4" style={{ fontSize: 56, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.03em" }}>
          One ungoverned prompt. <span style={{ color: `hsl(${RED})` }}>Six hidden defects.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 22, color: MUTED, maxWidth: 1100, lineHeight: 1.4 }}>
          A senior consultant asks AI to draft a client update. Nothing stops the line. Every defect ships.
        </p>
        <div className="grid grid-cols-[1.1fr_1fr] gap-8 flex-1">
          <div className="rounded-2xl border p-8 relative font-serif" style={{ background: "white", borderColor: CHROME_BORDER }}>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b" style={{ borderColor: CHROME_BORDER }}>
              <Mail size={18} style={{ color: SUBTLE }} />
              <span className="font-mono" style={{ fontSize: 14, color: SUBTLE }}>To: client · Re: Q3 update · Drafted by AI</span>
            </div>
            <div style={{ fontSize: 22, color: TEXT, lineHeight: 1.55 }}>
              <p className="mb-3">Dear <mark style={{ background: `hsl(${RED} / 0.15)`, padding: "2px 4px" }}>Mr. Tanaka</mark>,</p>
              <p className="mb-3">
                We are pleased to share that engagement <mark style={{ background: `hsl(${RED} / 0.15)`, padding: "2px 4px" }}>delivery is on track for the original September timeline</mark>.
                Our methodology aligns with <mark style={{ background: `hsl(${RED} / 0.15)`, padding: "2px 4px" }}>best-in-class industry frameworks</mark> and we anticipate
                <mark style={{ background: `hsl(${RED} / 0.15)`, padding: "2px 4px" }}> savings of approximately 30%</mark>.
              </p>
              <p className="mb-3">
                Attached please find the <mark style={{ background: `hsl(${RED} / 0.15)`, padding: "2px 4px" }}>detailed cost breakdown</mark>.
                We remain committed to delivering against the <mark style={{ background: `hsl(${RED} / 0.15)`, padding: "2px 4px" }}>SLA agreed in our master agreement</mark>.
              </p>
              <p>Kind regards,<br />The team</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { d: "Wrong honorific", w: "Client switched to Ms. last quarter. CRM has it. AI did not." },
              { d: "Stale timeline", w: "Engagement re-baselined to October. Memo not in training data." },
              { d: "Vague claim", w: "\"Best-in-class\" violates the firm's no-superlatives policy." },
              { d: "Fabricated number", w: "30% has no source. AI hallucinated a plausible figure." },
              { d: "Missing attachment", w: "AI cannot attach files but wrote as if it could." },
              { d: "Wrong SLA reference", w: "MSA was amended in May. AI cited the original." },
            ].map((x, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border" style={{ background: `hsl(${RED} / 0.04)`, borderColor: `hsl(${RED} / 0.25)` }}>
                <span className="font-mono font-black mt-0.5" style={{ fontSize: 14, color: `hsl(${RED})` }}>0{i + 1}</span>
                <div>
                  <p className="font-bold" style={{ fontSize: 18, color: TEXT, lineHeight: 1.2 }}>{x.d}</p>
                  <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.35 }}>{x.w}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer text="A factory floor would have caught all six. Without one, all six ship to the client." />
      <SlideBar from={RED} to={ACCENT} />
    </div>
  );
}

// ─── F04 · THE MATH (€550K → $2.6B) ──────────────────────────────────────────
function F04Math() {
  const rows = [
    { label: "Senior knowledge worker", count: "100", waste: "€5.5K", total: "€550K / yr", grow: false },
    { label: "× 500-person knowledge org", count: "500", waste: "€5.5K", total: "€2.75M / yr", grow: false },
    { label: "× 10,000-person enterprise", count: "10,000", waste: "€5.5K", total: "€55M / yr", grow: true },
    { label: "Global knowledge economy (TAM proxy)", count: "~470M", waste: "€5.5K", total: "$2.6B SAM", grow: true },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-32 pb-24 flex flex-col">
        <Tag label="The Math" color={ACCENT} />
        <h2 className="font-black mb-3" style={{ fontSize: 62, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.03em" }}>
          The Context Gap Tax: <span style={{ color: `hsl(${GOLD})` }}>€5,500 per knowledge worker per year</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 22, color: MUTED, maxWidth: 1200, lineHeight: 1.4 }}>
          Rework, hallucination-checking, lost senior judgment, audit overhead. Below the line on every budget today. Above the line by 2027 when AI spend is metered.
        </p>
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: CHROME_BORDER }}>
          <div className="grid grid-cols-[2fr_1fr_1fr_1.2fr] px-8 py-4 font-mono uppercase tracking-[0.15em] font-bold" style={{ background: CARD_ALT, fontSize: 14, color: MUTED }}>
            <span>Scope</span>
            <span>Workers</span>
            <span>Tax / worker</span>
            <span className="text-right">Annual waste</span>
          </div>
          {rows.map((r, i) => (
            <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1.2fr] px-8 py-6 items-center border-t"
                 style={{ borderColor: CHROME_BORDER, background: r.grow ? `hsl(${GOLD} / 0.06)` : "white" }}>
              <span className="font-semibold" style={{ fontSize: 24, color: TEXT }}>{r.label}</span>
              <span className="font-mono" style={{ fontSize: 22, color: MUTED }}>{r.count}</span>
              <span className="font-mono" style={{ fontSize: 22, color: MUTED }}>{r.waste}</span>
              <span className="font-black text-right" style={{ fontSize: 28, color: r.grow ? `hsl(${GOLD})` : TEXT, letterSpacing: "-0.02em" }}>{r.total}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-3 gap-6">
          {[
            { k: "Capture rate", v: "5–8%", d: "of the tax = €2.75M ACV at 500 ppl" },
            { k: "Platform GM", v: "95%", d: "every token tied to a standard" },
            { k: "Payback", v: "< 6 mo", d: "rework displaced > license cost" },
          ].map((s) => (
            <div key={s.k} className="rounded-xl border p-6" style={{ background: CARD_ALT, borderColor: CHROME_BORDER }}>
              <p className="font-mono uppercase tracking-[0.18em] mb-2" style={{ fontSize: 13, color: SUBTLE }}>{s.k}</p>
              <p className="font-black mb-1" style={{ fontSize: 38, color: `hsl(${GREEN})`, letterSpacing: "-0.02em" }}>{s.v}</p>
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.35 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer text="Tax estimate: Aliz internal study · 100 knowledge workers · cross-validated with HBR and McKinsey 2024 rework data." />
      <SlideBar from={ACCENT} to={GOLD} />
    </div>
  );
}

// ─── F13 · THE INSTALL (30-day → metered → self-serve) ───────────────────────
function F13Install() {
  const lanes = [
    {
      n: "01", d: "Days 0–30",
      t: "Install the production line",
      desc: "Co-build sprint. We deploy with you. Standards captured, surfaces wired, first 3 workflows live by day 30.",
      tag: "€15K Sprint", color: ACCENT,
    },
    {
      n: "02", d: "Day 31 onwards",
      t: "Metered. Every token tied to a standard.",
      desc: "Production. The line runs. You pay per governed decision, not per seat. 95% platform GM.",
      tag: "Metered", color: GREEN,
    },
    {
      n: "03", d: "Quarter 2 onwards",
      t: "Self-serve install (post-Seed)",
      desc: "The 30-day install itself becomes a guided self-serve wizard. PLG motion compounds the wedge.",
      tag: "Funded by this round", color: GOLD,
    },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-32 pb-24 flex flex-col">
        <Tag label="Go-to-Market" color={ACCENT} />
        <h2 className="font-black mb-3" style={{ fontSize: 62, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.03em" }}>
          30-day install. <span style={{ color: `hsl(${GREEN})` }}>Metered from day 31.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1200, lineHeight: 1.4 }}>
          A factory is installed once and runs forever. We install the line in 30 days. The Seed round turns the install itself into a self-serve product.
        </p>
        <div className="space-y-5 flex-1">
          {lanes.map((l) => (
            <div key={l.n} className="grid grid-cols-[80px_180px_1fr_auto] gap-6 items-center rounded-2xl border p-7"
                 style={{ background: CARD_ALT, borderColor: CHROME_BORDER }}>
              <span className="font-mono font-black" style={{ fontSize: 36, color: `hsl(${l.color})` }}>{l.n}</span>
              <span className="font-mono uppercase tracking-[0.18em] font-bold" style={{ fontSize: 15, color: MUTED }}>{l.d}</span>
              <div>
                <p className="font-bold mb-1" style={{ fontSize: 28, color: TEXT, lineHeight: 1.15 }}>{l.t}</p>
                <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.4 }}>{l.desc}</p>
              </div>
              <span className="px-4 py-2 rounded-full font-mono uppercase tracking-[0.15em] font-bold whitespace-nowrap"
                    style={{ fontSize: 13, background: `hsl(${l.color} / 0.12)`, color: `hsl(${l.color})`, border: `1px solid hsl(${l.color} / 0.3)` }}>
                {l.tag}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-8 px-8 py-5 rounded-xl border-l-4" style={{ background: `hsl(${GREEN} / 0.05)`, borderColor: `hsl(${GREEN})` }}>
          <p style={{ fontSize: 22, color: TEXT, lineHeight: 1.45 }}>
            <span className="font-bold" style={{ color: `hsl(${GREEN})` }}>By 2027,</span> AI pricing shifts from flat seats to metered tokens. Microsoft Copilot pay-as-you-go (GA 2025), Anthropic usage-based enterprise tiers, AWS Bedrock per-token billing. Every token becomes a P&L line. We are the layer that makes those tokens defensible.
          </p>
        </div>
      </div>
      <Footer text="Sources: Microsoft Copilot metered messages (announced 2024, GA 2025) · Anthropic enterprise usage tiers · AWS Bedrock per-token pricing." />
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ─── F14 · HERO VERTICAL: AEC (and the pattern repeats) ──────────────────────
function F14Vertical() {
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-32 pb-24 flex flex-col">
        <Tag label="Hero Vertical · Pattern Repeats" color={ACCENT} />
        <h2 className="font-black mb-3" style={{ fontSize: 62, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.03em" }}>
          AEC is the first floor. <span style={{ color: `hsl(${ACCENT})` }}>The factory pattern is universal.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1200, lineHeight: 1.4 }}>
          We picked AEC because the artifact is concrete (drawings, specs, BIM models), the regulator is unforgiving, and the partner is a global incumbent. Once the line runs there, the same line runs everywhere.
        </p>
        <div className="grid grid-cols-[1.3fr_1fr] gap-8 flex-1">
          <div className="rounded-2xl border-2 p-9" style={{ background: `hsl(${ACCENT} / 0.04)`, borderColor: `hsl(${ACCENT} / 0.4)` }}>
            <div className="flex items-center gap-3 mb-5">
              <Building2 size={26} style={{ color: `hsl(${ACCENT})` }} />
              <span className="font-mono uppercase tracking-[0.2em] font-bold" style={{ fontSize: 16, color: `hsl(${ACCENT})` }}>AEC · Live deployment</span>
            </div>
            <p className="font-bold mb-6" style={{ fontSize: 32, color: TEXT, lineHeight: 1.2 }}>
              CTO-sponsored SaaS deployment at a global AEC software leader. Partnership in motion with Nemetschek-scale incumbent.
            </p>
            <div className="grid grid-cols-3 gap-5 mb-6">
              {[
                { k: "Standards encoded", v: "127" },
                { k: "Decisions / month", v: "3,400+" },
                { k: "Time-to-spec drop", v: "62%" },
              ].map((s) => (
                <div key={s.k} className="text-center p-4 rounded-xl bg-white border" style={{ borderColor: CHROME_BORDER }}>
                  <p className="font-black mb-1" style={{ fontSize: 32, color: `hsl(${ACCENT})`, letterSpacing: "-0.02em" }}>{s.v}</p>
                  <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: 11, color: SUBTLE }}>{s.k}</p>
                </div>
              ))}
            </div>
            <ul className="space-y-2" style={{ fontSize: 18, color: TEXT, lineHeight: 1.45 }}>
              <li>· Drawing review standards enforced at every prompt.</li>
              <li>· Specification compounding into a portable bundle.</li>
              <li>· Rationale log audited by partner QA, not by us.</li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="font-mono uppercase tracking-[0.2em] font-bold mb-3" style={{ fontSize: 14, color: MUTED }}>The pattern repeats in</p>
            {[
              { i: <Workflow size={20} />, t: "Professional Services", d: "Engagement methodology, deliverable quality bar, knowledge harvest." },
              { i: <Layers size={20} />, t: "Pharma & Life Sciences", d: "GxP procedures, lab governance, regulatory submissions." },
              { i: <CheckCircle2 size={20} />, t: "Insurance Underwriting", d: "Risk standards, loss-history checks, audit lineage." },
              { i: <Sparkles size={20} />, t: "Banking & Compliance", d: "KYC, AML, model validation, second-line review." },
            ].map((v) => (
              <div key={v.t} className="flex items-start gap-4 p-5 rounded-xl border" style={{ background: CARD_ALT, borderColor: CHROME_BORDER }}>
                <div className="p-2 rounded-lg" style={{ background: `hsl(${ACCENT} / 0.1)`, color: `hsl(${ACCENT})` }}>{v.i}</div>
                <div>
                  <p className="font-bold mb-0.5" style={{ fontSize: 19, color: TEXT, lineHeight: 1.2 }}>{v.t}</p>
                  <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.35 }}>{v.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer text="One floor proves the architecture. Every regulated artifact vertical reuses the same line." />
      <SlideBar from={ACCENT} to={GREEN} />
    </div>
  );
}

// ─── F16 · TEAM (data/AI architecture in production) ─────────────────────────
function F16Team() {
  const team = [
    {
      name: "Founding team",
      role: "Architects of data and AI systems in production",
      bio: "15+ years building enterprise data platforms, knowledge architectures, and AI systems that had to ship and survive regulators. Pre-LLM, the same work was called \"semantic layer\" and \"master data\". The factory is the natural next layer.",
    },
    {
      name: "Delivery network",
      role: "Partner consultancies with operations DNA",
      bio: "200+ enterprise engagements through partner delivery. Pharma QA, AEC delivery teams, automotive R&D, financial controls. Operations credibility comes through the partner stack; we build the line they run on.",
    },
    {
      name: "Advisory bench",
      role: "Regulated-industry CTOs and Chief AI Officers",
      bio: "Active advisors from AEC software incumbents, pharma compliance, and tier-one consulting. The buyers of the next 18 months sit on our advisory bench, not in our pipeline.",
    },
  ];
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber />
      <div className="absolute inset-0 px-28 pt-32 pb-24 flex flex-col">
        <Tag label="Team" color={PURPLE} />
        <h2 className="font-black mb-3" style={{ fontSize: 62, lineHeight: 1.05, color: TEXT, letterSpacing: "-0.03em" }}>
          We have built <span style={{ color: `hsl(${PURPLE})` }}>data and AI architectures in production for 15 years.</span>
        </h2>
        <p className="mb-10" style={{ fontSize: 22, color: MUTED, maxWidth: 1200, lineHeight: 1.4 }}>
          The factory floor is not a metaphor we discovered. It is the natural next layer on top of the work we have done since before LLMs existed.
        </p>
        <div className="grid grid-cols-3 gap-6 flex-1">
          {team.map((t) => (
            <div key={t.name} className="rounded-2xl border p-8 flex flex-col" style={{ background: CARD_ALT, borderColor: CHROME_BORDER }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                   style={{ background: `hsl(${PURPLE} / 0.12)`, color: `hsl(${PURPLE})` }}>
                <Users size={26} />
              </div>
              <p className="font-bold mb-1" style={{ fontSize: 24, color: TEXT, lineHeight: 1.2 }}>{t.name}</p>
              <p className="font-mono uppercase tracking-[0.15em] mb-4" style={{ fontSize: 13, color: `hsl(${PURPLE})` }}>{t.role}</p>
              <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.45 }}>{t.bio}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer text="Operations credibility ships through the partner network. We build the line the operators run on." />
      <SlideBar from={PURPLE} to={ACCENT} />
    </div>
  );
}

// ─── F17 · THE ASK ───────────────────────────────────────────────────────────
function F17Ask() {
  return (
    <div className="w-full h-full relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-10 left-12 font-mono" style={{ fontSize: 14, color: DARK_MUTED, letterSpacing: "0.15em" }}>
        <PageNumber dark />
      </div>
      <div className="absolute inset-0 px-28 pt-32 pb-24 flex flex-col">
        <p className="font-mono uppercase tracking-[0.3em] mb-8" style={{ fontSize: 18, color: `hsl(${GREEN})` }}>The Ask</p>
        <h2 className="font-black mb-4" style={{ fontSize: 84, lineHeight: 1.04, color: DARK_TEXT, letterSpacing: "-0.035em" }}>
          €2M Seed.<br />
          <span style={{ color: `hsl(${GREEN})` }}>This round funds the factory floor.</span>
        </h2>
        <p className="mb-12" style={{ fontSize: 26, color: DARK_MUTED, maxWidth: 1300, lineHeight: 1.4 }}>
          We are live in production with paying customers. The round productises the install, scales the partner network, and locks the metered pricing model before AI consumption pricing becomes the default.
        </p>
        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { k: "Self-serve install", v: "60%", d: "of €2M · the 30-day install becomes a guided wizard. Removes the human bottleneck in onboarding." },
            { k: "Vertical depth", v: "25%", d: "of €2M · AEC pattern fully dressed, two adjacent verticals validated through partners." },
            { k: "Metered economics", v: "15%", d: "of €2M · the billing, telemetry and standards engine that makes per-decision pricing defensible at audit." },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl p-7 border" style={{ background: "hsl(0 0% 100% / 0.04)", borderColor: "hsl(0 0% 100% / 0.12)" }}>
              <p className="font-mono uppercase tracking-[0.15em] mb-3" style={{ fontSize: 13, color: DARK_MUTED }}>{s.k}</p>
              <p className="font-black mb-3" style={{ fontSize: 56, color: `hsl(${GREEN})`, letterSpacing: "-0.03em" }}>{s.v}</p>
              <p style={{ fontSize: 17, color: DARK_MUTED, lineHeight: 1.45 }}>{s.d}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-8 border-2" style={{ background: `hsl(${GREEN} / 0.06)`, borderColor: `hsl(${GREEN} / 0.35)` }}>
          <div className="grid grid-cols-3 gap-8 items-center">
            <div>
              <p className="font-mono uppercase tracking-[0.18em] mb-2" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Milestone at month 18</p>
              <p className="font-bold" style={{ fontSize: 26, color: DARK_TEXT, lineHeight: 1.2 }}>€3M ARR, 50% self-serve.</p>
            </div>
            <div>
              <p className="font-mono uppercase tracking-[0.18em] mb-2" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>Setup for Series A</p>
              <p className="font-bold" style={{ fontSize: 26, color: DARK_TEXT, lineHeight: 1.2 }}>Metered economics proven. Vertical pattern repeatable.</p>
            </div>
            <div>
              <p className="font-mono uppercase tracking-[0.18em] mb-2" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>The bet</p>
              <p className="font-bold" style={{ fontSize: 26, color: DARK_TEXT, lineHeight: 1.2 }}>Models commoditise. Factories compound.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-7 left-28 right-28 flex items-center gap-3" style={{ color: DARK_MUTED, fontSize: 15 }}>
        <span style={{ width: 32, height: 1, background: "hsl(0 0% 100% / 0.2)" }} />
        <span>The machine is now commodity. The production system is the moat.</span>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// DECK COMPOSITION
// ═════════════════════════════════════════════════════════════════════════════
const RAW_SLIDES = [
  { id: "cover", title: "Cover · AI is the machine. LIZA is the production system.", component: <F01Cover /> },
  { id: "machine-without-factory", title: "The Machine Without a Factory", component: <F02MachineWithoutFactory /> },
  { id: "annotated-email", title: "The Moment of Failure · Annotated", component: <F03AnnotatedEmail /> },
  { id: "math", title: "The Math · €550K → $2.6B", component: <F04Math /> },
  { id: "governance-loop", title: "The Governance Loop · Stop the Line", component: <S03GovernanceLoop /> },
  { id: "production-system", title: "The Production System · The Full Floor", component: <S04ProductionSystem /> },
  { id: "moment-of-work", title: "The Moment of Work · Five Stations", component: <S07bUnique /> },
  { id: "prompt-is-compile", title: "Every Prompt Is a Compile · The Atom", component: <S07cFunnel /> },
  { id: "aace-not-rag", title: "This Is AACE, Not RAG · The Defence", component: <S07eAaceNotRag /> },
  { id: "org-loop", title: "Every Commit Compounds · The Network", component: <S07dOrgLoop /> },
  { id: "instrument-panel", title: "The Instrument Panel · Compounding View", component: <S07fInstrument /> },
  { id: "augmentation", title: "Human Stays in the Loop · Augmentation Mechanics", component: <S09bAugmentationMechanics /> },
  { id: "install", title: "30-Day Install · Metered from Day 31", component: <F13Install /> },
  { id: "vertical", title: "Hero Vertical · AEC · Pattern Repeats", component: <F14Vertical /> },
  { id: "unit-economics", title: "Unit Economics · 95% Platform GM", component: <S10UnitEconomics /> },
  { id: "team", title: "Team · Data & AI Architecture in Production", component: <F16Team /> },
  { id: "ask", title: "The Ask · €2M Seed", component: <F17Ask /> },
  { id: "closer", title: "The Loop, Closed", component: <S13LoopClosed /> },
];
const SLIDES = RAW_SLIDES.map((s, i) => ({
  ...s,
  component: <SlideIndexProvider index={i} total={RAW_SLIDES.length}>{s.component}</SlideIndexProvider>,
}));

// ─── Deck shell (same pattern as TechDDDeck) ─────────────────────────────────
export default function FactoryDeck() {
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Factory-Deck" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
          <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${GREEN})` }} />
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS · Factory Deck</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})` }}>
            Production-system spine · {SLIDES.length} slides
          </span>
          <span className="text-xs px-2 py-0.5 rounded ml-1"
            style={{ background: "hsl(0 72% 50% / 0.08)", color: "hsl(0 72% 50%)" }}>
            Confidential · Seed
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Factory-Deck" slideCount={SLIDES.length} variant="desktop" />
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
              <div className="flex gap-2 flex-wrap max-w-[60%]">
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === current ? 32 : 8,
                      background: i === current ? `hsl(${GREEN})` : CHROME_BORDER,
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