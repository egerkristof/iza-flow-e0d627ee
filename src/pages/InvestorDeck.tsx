import { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  TrendingUp, Users, Brain, Zap, Target, BarChart3,
  DollarSign, Shield, CheckCircle2, ArrowRight, Globe, Layers, Award, Briefcase
} from "lucide-react";
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
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Shared layout helpers ───────────────────────────────────────────────────

const BG = "hsl(224 22% 3%)";
const GRID_LINE = "hsl(200 80% 50%)";
const ACCENT = "200 90% 52%";
const GREEN = "155 72% 46%";
const GOLD = "45 95% 55%";
const RED = "0 72% 63%";

function SlideGrid({ color = ACCENT }: { color?: string }) {
  return (
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}

function SlideBar({ from = ACCENT, to = GREEN }: { from?: string; to?: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1.5"
      style={{ background: `linear-gradient(90deg, hsl(${from}), hsl(${to}))` }} />
  );
}

function Tag({ label, color = ACCENT }: { label: string; color?: string }) {
  return (
    <p className="font-semibold tracking-[0.25em] uppercase mb-5"
      style={{ fontSize: 28, color: `hsl(${color})` }}>{label}</p>
  );
}

// ─── Slide 01 — Cover ────────────────────────────────────────────────────────

function Slide01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${GREEN}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <div className="flex items-center gap-3 mb-12 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${ACCENT} / 0.35)`, background: `hsl(${ACCENT} / 0.07)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${ACCENT})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>LIZA OS — Series Seed</span>
        </div>

        <h1 className="font-black mb-10" style={{ fontSize: 110, lineHeight: 1.0, color: "hsl(210 18% 94%)" }}>
          Standardise Senior Judgment<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Across Every Team.
          </span>
        </h1>

        <p style={{ fontSize: 38, color: "hsl(215 10% 52%)", maxWidth: 1200, lineHeight: 1.55 }}>
          We extract senior expertise and turn it into executable protocols
          your entire organisation can run on — consistently.
        </p>

        <div className="mt-20 flex items-center gap-16">
          {[
            ["Seed Round", "€1.5M target"],
            ["Market", "$47B TAM"],
            ["Model", "SaaS + Usage"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col items-center gap-2">
              <span className="font-bold" style={{ fontSize: 42, color: "hsl(210 18% 92%)" }}>{v}</span>
              <span style={{ fontSize: 24, color: "hsl(215 10% 40%)" }}>{k}</span>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 02 — Problem ──────────────────────────────────────────────────────

function Slide02Problem() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="The Problem" color={RED} />
        <h2 className="font-bold mb-16" style={{ fontSize: 82, color: "hsl(210 18% 92%)", lineHeight: 1.1 }}>
          Professional firms scale headcount.<br />
          <span style={{ color: `hsl(${RED})` }}>Not capability.</span>
        </h2>

        <div className="grid grid-cols-3 gap-8 flex-1">
          {[
            {
              icon: <Users size={56} />, color: RED,
              title: "Knowledge walks out the door",
              body: "Your best people carry your methodology in their heads. Every resignation is a knowledge loss event. Remove three seniors and quality collapses overnight."
            },
            {
              icon: <Target size={56} />, color: "38 92% 50%",
              title: "Execution is inconsistent",
              body: "Same brief, 14 different outputs. Junior work ranges from excellent to embarrassing depending on who supervises. No shared standard exists."
            },
            {
              icon: <BarChart3 size={56} />, color: RED,
              title: "AI accelerates the problem",
              body: "Generic AI gives everyone content generation — with zero organisational context. Teams get faster at producing the wrong thing, confidently."
            },
          ].map(({ icon, color, title, body }) => (
            <div key={title} className="flex flex-col gap-6 rounded-2xl border p-10"
              style={{ background: `hsl(${color} / 0.05)`, borderColor: `hsl(${color} / 0.2)` }}>
              <div style={{ color: `hsl(${color})` }}>{icon}</div>
              <p className="font-bold" style={{ fontSize: 34, color: "hsl(210 18% 92%)" }}>{title}</p>
              <p style={{ fontSize: 24, color: "hsl(215 10% 50%)", lineHeight: 1.55 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={RED} to="38 92% 50%" />
    </div>
  );
}

// ─── Slide 03 — Market Size ──────────────────────────────────────────────────

function Slide03Market() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 px-28 w-full">
        <div className="text-center mb-16">
          <Tag label="Market Opportunity" color={ACCENT} />
          <h2 className="font-bold" style={{ fontSize: 80, color: "hsl(210 18% 92%)", lineHeight: 1.1 }}>
            A $47B market hiding in plain sight.
          </h2>
        </div>

        <div className="flex items-end justify-center gap-20">
          {/* TAM / SAM / SOM visual */}
          {[
            { label: "TAM", size: 580, amt: "$47B", sub: "Global knowledge management + enterprise AI software market", color: ACCENT, opacity: "0.1" },
            { label: "SAM", size: 420, amt: "$12B", sub: "Professional services firms 50–5000 people in EU + US", color: GREEN, opacity: "0.13" },
            { label: "SOM", size: 280, amt: "$800M", sub: "Reachable via direct + channel GTM in 3 years", color: GOLD, opacity: "0.18" },
          ].map(({ label, size, amt, sub, color, opacity }) => (
            <div key={label} className="flex flex-col items-center gap-6">
              <div className="rounded-full flex items-center justify-center border-2"
                style={{ width: size, height: size, background: `hsl(${color} / ${opacity})`, borderColor: `hsl(${color} / 0.3)` }}>
                <div className="flex flex-col items-center">
                  <span className="font-black" style={{ fontSize: size * 0.18, color: `hsl(${color})`, lineHeight: 1 }}>{amt}</span>
                  <span className="font-bold mt-1" style={{ fontSize: size * 0.09, color: `hsl(${color} / 0.7)` }}>{label}</span>
                </div>
              </div>
              <p className="text-center" style={{ fontSize: 22, color: "hsl(215 10% 45%)", maxWidth: size + 60, lineHeight: 1.5 }}>{sub}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-12" style={{ fontSize: 26, color: "hsl(215 10% 40%)" }}>
          The knowledge management market is growing at 23% CAGR driven by AI adoption pressure and workforce mobility
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 04 — Solution ─────────────────────────────────────────────────────

function Slide04Solution() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <div className="relative z-10 px-28 w-full">
        <div className="text-center mb-14">
          <Tag label="The Solution" color={ACCENT} />
          <h2 className="font-black" style={{ fontSize: 92, color: "hsl(210 18% 92%)", lineHeight: 1.05 }}>
            LIZA OS
          </h2>
          <p className="mt-4" style={{ fontSize: 36, color: "hsl(215 10% 50%)" }}>
            Knowledge-Activated Execution Engine
          </p>
        </div>

        <div className="flex gap-10 justify-center">
          {[
            {
              icon: <Target size={52} />, color: ACCENT, step: "01",
              title: "Execute",
              desc: "Protocol-driven workflows replace blank-page guessing. Every team member runs your best methodology, with AI adapting guidance at each step.",
            },
            {
              icon: <Brain size={52} />, color: GREEN, step: "02",
              title: "Learn",
              desc: "After every session, the system captures decisions, deviations, and insights. Structured reviews synthesise patterns into institutional knowledge.",
            },
            {
              icon: <Zap size={52} />, color: ACCENT, step: "03",
              title: "Encode",
              desc: "Approved learnings flow back into the knowledge graph — making every future execution smarter. The organisation compounds with each project.",
            },
          ].map(({ icon, color, step, title, desc }) => (
            <div key={title} className="flex-1 rounded-2xl border p-10 flex flex-col gap-6"
              style={{ background: `hsl(${color} / 0.06)`, borderColor: `hsl(${color} / 0.25)` }}>
              <div className="flex items-center gap-5">
                <span className="font-black" style={{ fontSize: 64, color: `hsl(${color} / 0.2)`, lineHeight: 1 }}>{step}</span>
                <div style={{ color: `hsl(${color})` }}>{icon}</div>
              </div>
              <p className="font-bold" style={{ fontSize: 42, color: "hsl(210 18% 92%)" }}>{title}</p>
              <p style={{ fontSize: 25, color: "hsl(215 10% 50%)", lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 px-10 py-6 rounded-xl border"
          style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.05)` }}>
          <Brain size={32} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
          <p style={{ fontSize: 26, color: "hsl(215 10% 60%)" }}>
            Grounded in the <strong style={{ color: "hsl(210 18% 85%)" }}>SECI model</strong> (Nonaka & Takeuchi) — the proven mechanism behind every learning organization.
            LIZA operationalizes this at software speed.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 05 — Product ──────────────────────────────────────────────────────

function Slide05Product() {
  const features = [
    { label: "Action Grid", desc: "Replaces blank chat with protocol-mapped action cards", color: ACCENT },
    { label: "Intent Lock", desc: "Activates full AI alignment to the current protocol step", color: GREEN },
    { label: "Knowledge Bundles", desc: "Structured context inheritance from Org → Team → Workbook", color: ACCENT },
    { label: "Drift Detection", desc: "Real-time deviation scoring against locked playbooks", color: GREEN },
    { label: "Smart Ingestion", desc: "Drag-and-drop docs → instant candidate Playbook extraction", color: ACCENT },
    { label: "After-Action Synthesis", desc: "AI-powered session review → knowledge graph updates", color: GREEN },
  ];

  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <SlideGrid />

      <div className="relative z-10 flex h-full w-full px-28 pt-16 pb-12 gap-16">
        {/* Left */}
        <div className="flex flex-col justify-center w-2/5">
          <Tag label="Product" color={ACCENT} />
          <h2 className="font-bold mb-10" style={{ fontSize: 68, color: "hsl(210 18% 92%)", lineHeight: 1.1 }}>
            Three operating modes.<br />
            <span style={{ color: `hsl(${ACCENT})` }}>One system.</span>
          </h2>
          <div className="flex flex-col gap-6">
            {[
              { role: "The Launchpad", persona: "Frontline / Operator", color: ACCENT, icon: <Target size={28} /> },
              { role: "The Process Studio", persona: "Expert / Architect", color: GREEN, icon: <Brain size={28} /> },
              { role: "The Command Center", persona: "Manager / Leader", color: GOLD, icon: <BarChart3 size={28} /> },
            ].map(({ role, persona, color, icon }) => (
              <div key={role} className="flex items-center gap-5 rounded-xl border p-6"
                style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.05)` }}>
                <div style={{ color: `hsl(${color})` }}>{icon}</div>
                <div>
                  <p className="font-bold" style={{ fontSize: 28, color: "hsl(210 18% 92%)" }}>{role}</p>
                  <p style={{ fontSize: 22, color: "hsl(215 10% 45%)" }}>{persona}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col justify-center w-3/5">
          <p className="font-semibold mb-8" style={{ fontSize: 26, color: "hsl(215 10% 40%)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Core Capabilities</p>
          <div className="grid grid-cols-2 gap-6">
            {features.map(({ label, desc, color }) => (
              <div key={label} className="rounded-xl border p-7 flex flex-col gap-3"
                style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.05)` }}>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={24} style={{ color: `hsl(${color})` }} />
                  <p className="font-bold" style={{ fontSize: 28, color: "hsl(210 18% 92%)" }}>{label}</p>
                </div>
                <p style={{ fontSize: 21, color: "hsl(215 10% 50%)", lineHeight: 1.45 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 06 — Traction ─────────────────────────────────────────────────────

function Slide06Traction() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Traction & Validation" color={GREEN} />
        <h2 className="font-bold mb-14" style={{ fontSize: 76, color: "hsl(210 18% 92%)", lineHeight: 1.1 }}>
          Built on real-world signal.
        </h2>

        <div className="grid grid-cols-4 gap-7 mb-10">
          {[
            { stat: "Egon Zehnder", sub: "Origin client — global executive search firm. Platform born from solving their knowledge consistency challenge.", color: ACCENT },
            { stat: "3 Verticals", sub: "Executive search, management consulting, and legal advisory — all validated the same core pain: scaling senior judgment.", color: GREEN },
            { stat: "Live Product", sub: "Functional platform with AI edge functions, role-based operating modes, and protocol execution engine.", color: ACCENT },
            { stat: "AACE v3.1", sub: "Proprietary AI context architecture. Intent-locking, hierarchical knowledge injection, and drift detection.", color: GREEN },
          ].map(({ stat, sub, color }) => (
            <div key={stat} className="rounded-2xl border p-8 flex flex-col gap-4"
              style={{ background: `hsl(${color} / 0.06)`, borderColor: `hsl(${color} / 0.22)` }}>
              <p className="font-black" style={{ fontSize: 38, color: `hsl(${color})`, lineHeight: 1.1 }}>{stat}</p>
              <p style={{ fontSize: 22, color: "hsl(215 10% 50%)", lineHeight: 1.5 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-8 flex-1">
          <div className="flex-1 rounded-2xl border p-10"
            style={{ borderColor: `hsl(${GOLD} / 0.25)`, background: `hsl(${GOLD} / 0.05)` }}>
            <Award size={44} style={{ color: `hsl(${GOLD})` }} className="mb-5" />
            <p className="font-bold mb-4" style={{ fontSize: 34, color: "hsl(210 18% 92%)" }}>Industry Validation</p>
            <p style={{ fontSize: 24, color: "hsl(215 10% 50%)", lineHeight: 1.55 }}>
              The "knowledge rot" problem is publicly recognized as a top-3 operational risk in professional services. 
              McKinsey, Deloitte, and EY have all published reports citing institutional memory loss as a strategic liability.
            </p>
          </div>
          <div className="flex-1 rounded-2xl border p-10"
            style={{ borderColor: `hsl(${ACCENT} / 0.25)`, background: `hsl(${ACCENT} / 0.05)` }}>
            <Layers size={44} style={{ color: `hsl(${ACCENT})` }} className="mb-5" />
            <p className="font-bold mb-4" style={{ fontSize: 34, color: "hsl(210 18% 92%)" }}>Technical Foundation</p>
            <p style={{ fontSize: 24, color: "hsl(215 10% 50%)", lineHeight: 1.55 }}>
              AACE (AI-Assisted Context Engine) v3.1 is a proprietary specification combining intent-locking,
              hierarchical knowledge injection, and drift detection. This is the IP moat competitors cannot replicate quickly.
            </p>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── Slide 07 — Business Model ───────────────────────────────────────────────

function Slide07BusinessModel() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Business Model" color={ACCENT} />
        <h2 className="font-bold mb-12" style={{ fontSize: 76, color: "hsl(210 18% 92%)", lineHeight: 1.1 }}>
          Platform SaaS + usage-based AI.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Expanding with each project.</span>
        </h2>

        <div className="grid grid-cols-3 gap-8 mb-10">
          {[
            {
              tier: "Starter", price: "€499/mo", seats: "Up to 10 seats",
              desc: "Core workbooks, action grid, basic protocols. Entry hook for SMEs.", color: "215 10% 45%",
              features: ["Unlimited workbooks", "Action Grid + Protocol execution", "Basic knowledge bundles"],
            },
            {
              tier: "Professional", price: "€2,200/mo", seats: "Up to 50 seats",
              desc: "Full SECI flywheel — smart ingestion, drift detection, after-action synthesis.", color: ACCENT,
              features: ["Everything in Starter", "Smart document ingestion", "Drift scoring + alerts", "After-action AI synthesis"],
            },
            {
              tier: "Enterprise", price: "Custom", seats: "Unlimited seats",
              desc: "White-glove onboarding, custom playbook library, SSO, audit logs.", color: GOLD,
              features: ["Everything in Professional", "Custom playbook authoring", "SSO + SCIM provisioning", "Dedicated CSM + SLA"],
            },
          ].map(({ tier, price, seats, desc, color, features }) => (
            <div key={tier} className="flex flex-col rounded-2xl border overflow-hidden"
              style={{ borderColor: `hsl(${color} / 0.3)`, background: `hsl(${color} / 0.05)` }}>
              <div className="p-8 border-b" style={{ borderColor: `hsl(${color} / 0.2)` }}>
                <p className="font-bold mb-1" style={{ fontSize: 30, color: `hsl(${color})` }}>{tier}</p>
                <p className="font-black" style={{ fontSize: 48, color: "hsl(210 18% 92%)", lineHeight: 1 }}>{price}</p>
                <p style={{ fontSize: 22, color: "hsl(215 10% 45%)" }}>{seats}</p>
              </div>
              <div className="p-8 flex flex-col gap-3 flex-1">
                <p style={{ fontSize: 23, color: "hsl(215 10% 50%)", lineHeight: 1.5, marginBottom: 8 }}>{desc}</p>
                {features.map(f => (
                  <p key={f} className="flex items-center gap-3" style={{ fontSize: 22, color: "hsl(210 18% 75%)" }}>
                    <CheckCircle2 size={18} style={{ color: `hsl(${color})`, flexShrink: 0 }} /> {f}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-8">
          {[
            { label: "AI Usage Layer", desc: "+€0.08 per AI call above tier limit — usage expands ARR naturally", color: GREEN },
            { label: "Template Marketplace", desc: "Partners (e.g. MEDDIC, ESG frameworks) sell playbooks. 30% revenue share.", color: ACCENT },
          ].map(({ label, desc, color }) => (
            <div key={label} className="flex-1 rounded-xl border p-7 flex items-center gap-6"
              style={{ borderColor: `hsl(${color} / 0.22)`, background: `hsl(${color} / 0.05)` }}>
              <DollarSign size={36} style={{ color: `hsl(${color})`, flexShrink: 0 }} />
              <div>
                <p className="font-bold" style={{ fontSize: 28, color: "hsl(210 18% 92%)" }}>{label}</p>
                <p style={{ fontSize: 22, color: "hsl(215 10% 50%)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 08 — GTM ──────────────────────────────────────────────────────────

function Slide08GTM() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Go-To-Market" color={ACCENT} />
        <h2 className="font-bold mb-12" style={{ fontSize: 76, color: "hsl(210 18% 92%)", lineHeight: 1.1 }}>
          Sell Level 1 pain.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Deliver Level 4 value.</span>
        </h2>

        <div className="flex gap-10 flex-1">
          {/* Phases */}
          <div className="w-3/5 flex flex-col gap-6">
            {[
              {
                phase: "Phase 1 — 0–12 months", color: ACCENT,
                headline: "AI Operating Model Programme — direct sales",
                points: ["Target: EU professional services firms 50–500 people", "Entry hook: 5-day Protocol Sprint → codify senior judgment", "Proof of value: Onboarding acceleration (months → weeks)", "CAC target: €8,000 | LTV target: €85,000+"],
              },
              {
                phase: "Phase 2 — 12–30 months", color: GREEN,
                headline: "Channel partners + methodology licensing",
                points: ["Partner with framework owners: MEDDIC, ESG, RACI specialists", "Distribution via HR tech and consulting tool ecosystems", "Template marketplace goes live — passive ARR expansion"],
              },
              {
                phase: "Phase 3 — 30+ months", color: GOLD,
                headline: "Platform + API layer",
                points: ["AACE as a service: enterprise workflows plug into our context engine", "White-label for consulting firms to sell to their own clients"],
              },
            ].map(({ phase, color, headline, points }) => (
              <div key={phase} className="rounded-xl border p-7"
                style={{ borderColor: `hsl(${color} / 0.22)`, background: `hsl(${color} / 0.05)` }}>
                <p className="font-semibold mb-1" style={{ fontSize: 22, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{phase}</p>
                <p className="font-bold mb-4" style={{ fontSize: 30, color: "hsl(210 18% 92%)" }}>{headline}</p>
                <div className="flex flex-col gap-1.5">
                  {points.map(p => (
                    <p key={p} style={{ fontSize: 22, color: "hsl(215 10% 50%)" }}>→ {p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Key metrics */}
          <div className="w-2/5 flex flex-col gap-6">
            <p className="font-semibold" style={{ fontSize: 26, color: "hsl(215 10% 40%)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Target Metrics — Year 3</p>
            {[
              { label: "ARR", val: "€8M", color: ACCENT },
              { label: "Customers", val: "180+", color: GREEN },
              { label: "NRR", val: ">120%", color: ACCENT },
              { label: "Gross Margin", val: "78%", color: GREEN },
              { label: "CAC Payback", val: "<12 mo", color: ACCENT },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center justify-between rounded-xl border px-8 py-6"
                style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.05)` }}>
                <span style={{ fontSize: 28, color: "hsl(215 10% 55%)" }}>{label}</span>
                <span className="font-black" style={{ fontSize: 42, color: `hsl(${color})` }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 09 — Competitive Moat ─────────────────────────────────────────────

function Slide09Moat() {
  const rows = [
    { cap: "Protocol-driven execution workflow", liza: true, notion: false, copilot: false, glean: false, guru: false },
    { cap: "Intent-locking + step-aware AI", liza: true, notion: false, copilot: false, glean: false, guru: false },
    { cap: "After-action synthesis → knowledge graph", liza: true, notion: false, copilot: false, glean: false, guru: false },
    { cap: "Role-based operating modes (3 personas)", liza: true, notion: false, copilot: false, glean: false, guru: false },
    { cap: "Hierarchical context inheritance", liza: true, notion: false, copilot: false, glean: false, guru: false },
    { cap: "Drift detection + impact simulation", liza: true, notion: false, copilot: false, glean: false, guru: false },
    { cap: "AI document synthesis / search", liza: true, notion: true, copilot: true, glean: true, guru: false },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Competitive Moat" color={ACCENT} />
        <h2 className="font-bold mb-10" style={{ fontSize: 72, color: "hsl(210 18% 92%)", lineHeight: 1.1 }}>
          We are building a new category.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Nobody else is doing this.</span>
        </h2>

        <div className="flex-1 rounded-2xl border overflow-hidden" style={{ borderColor: "hsl(222 14% 12%)" }}>
          <table className="w-full h-full">
            <thead>
              <tr style={{ background: "hsl(222 18% 6%)" }}>
                <th className="text-left px-8 py-5 font-medium" style={{ fontSize: 22, color: "hsl(215 10% 45%)", width: "34%" }}>Capability</th>
                {[
                  { name: "LIZA OS", h: true }, { name: "Notion AI", h: false },
                  { name: "M365 Copilot", h: false }, { name: "Glean", h: false }, { name: "Guru", h: false }
                ].map(({ name, h }) => (
                  <th key={name} className="px-5 py-5 font-bold text-center" style={{ fontSize: 22, color: h ? `hsl(${ACCENT})` : "hsl(215 10% 45%)" }}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ cap, liza, notion, copilot, glean, guru }, i) => (
                <tr key={cap} style={{ background: i % 2 === 0 ? "transparent" : "hsl(222 18% 5%)" }}>
                  <td className="px-8 py-4" style={{ fontSize: 22, color: "hsl(210 18% 72%)" }}>{cap}</td>
                  {[
                    { v: liza, h: true }, { v: notion, h: false }, { v: copilot, h: false }, { v: glean, h: false }, { v: guru, h: false }
                  ].map(({ v, h }, j) => (
                    <td key={j} className="px-5 py-4 text-center">
                      {v
                        ? <CheckCircle2 size={26} className="mx-auto" style={{ color: h ? `hsl(${GREEN})` : "hsl(215 10% 36%)" }} />
                        : <X size={26} className="mx-auto" style={{ color: "hsl(222 14% 18%)" }} />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6" style={{ fontSize: 24, color: "hsl(215 10% 40%)" }}>
          The AACE v3.1 specification creates a technical moat — competitors would need 18–24 months to replicate the context architecture alone.
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 10 — Team ─────────────────────────────────────────────────────────

function Slide10Team() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Team" color={ACCENT} />
        <h2 className="font-bold mb-14" style={{ fontSize: 76, color: "hsl(210 18% 92%)", lineHeight: 1.1 }}>
          Domain expertise meets<br />
          <span style={{ color: `hsl(${ACCENT})` }}>technical execution.</span>
        </h2>

        <div className="grid grid-cols-3 gap-10 flex-1">
          {[
            {
              name: "Founder / CEO", color: ACCENT,
              bg: "KH",
              strengths: ["Deep Egon Zehnder domain knowledge", "Proprietary SECI-to-product translation", "Client-zero relationship + feedback loop", "GTM strategy and enterprise sales"],
              why: "The problem was lived, not theorized. Built from the inside of one of the world's most knowledge-intensive firms."
            },
            {
              name: "CTO / Co-Founder", color: GREEN,
              bg: "Tech",
              strengths: ["AI systems architecture (AACE v3.1)", "Full-stack product execution", "Edge function + knowledge graph design", "Supabase-native, production-grade"],
              why: "Technical co-founder who shipped the AACE architecture and the entire LIZA OS platform in parallel with validation."
            },
            {
              name: "Advisory Board", color: GOLD,
              bg: "ADV",
              strengths: ["Professional services GTM expertise", "AI/ML academic validation (SECI research)", "SaaS CFO / unit economics advisory", "Enterprise legal + compliance counsel"],
              why: "Building out a board that covers the three vectors: distribution, academic credibility, and financial scale."
            },
          ].map(({ name, color, bg, strengths, why }) => (
            <div key={name} className="flex flex-col rounded-2xl border overflow-hidden"
              style={{ borderColor: `hsl(${color} / 0.25)`, background: `hsl(${color} / 0.05)` }}>
              <div className="p-8 border-b flex items-center gap-6" style={{ borderColor: `hsl(${color} / 0.18)` }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl"
                  style={{ background: `hsl(${color} / 0.2)`, color: `hsl(${color})`, border: `2px solid hsl(${color} / 0.4)` }}>
                  {bg}
                </div>
                <div>
                  <p className="font-bold" style={{ fontSize: 30, color: "hsl(210 18% 92%)" }}>{name}</p>
                  <p style={{ fontSize: 22, color: `hsl(${color})` }}>LIZA OS</p>
                </div>
              </div>
              <div className="p-8 flex flex-col gap-4 flex-1">
                <div className="flex flex-col gap-2">
                  {strengths.map(s => (
                    <p key={s} className="flex items-start gap-3" style={{ fontSize: 21, color: "hsl(215 10% 60%)" }}>
                      <CheckCircle2 size={18} style={{ color: `hsl(${color})`, flexShrink: 0, marginTop: 3 }} />{s}
                    </p>
                  ))}
                </div>
                <div className="mt-auto pt-4 border-t" style={{ borderColor: `hsl(${color} / 0.15)` }}>
                  <p style={{ fontSize: 20, color: "hsl(215 10% 45%)", lineHeight: 1.5, fontStyle: "italic" }}>"{why}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 11 — Financials ───────────────────────────────────────────────────

function Slide11Financials() {
  const quarters = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Q12"];
  const arr = [0, 15, 45, 120, 280, 480, 720, 1050, 1500, 2200, 3100, 4200]; // €k
  const maxArr = Math.max(...arr);
  const barW = 1400 / quarters.length;

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Financial Projections" color={ACCENT} />
        <h2 className="font-bold mb-10" style={{ fontSize: 72, color: "hsl(210 18% 92%)", lineHeight: 1.1 }}>
          Path to €4M ARR in 36 months.
        </h2>

        {/* Bar chart */}
        <div className="flex-1 flex items-end gap-3 relative px-4">
          {/* Y-axis label */}
          <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between">
            {[4200, 3100, 2200, 1500, 1000, 500, 0].map(v => (
              <span key={v} style={{ fontSize: 20, color: "hsl(215 10% 35%)", fontFamily: "monospace" }}>
                €{v > 0 ? (v >= 1000 ? (v / 1000).toFixed(1) + "M" : v + "k") : "0"}
              </span>
            ))}
          </div>

          <div className="flex-1 flex items-end gap-2 pl-16 pb-8">
            {quarters.map((q, i) => {
              const h = (arr[i] / maxArr) * 320;
              const color = i < 4 ? `hsl(${ACCENT} / 0.7)` : i < 8 ? `hsl(${GREEN} / 0.8)` : `hsl(${GOLD} / 0.9)`;
              return (
                <div key={q} className="flex flex-col items-center gap-2 flex-1">
                  <span style={{ fontSize: 18, color: `hsl(${ACCENT})`, fontFamily: "monospace" }}>
                    {arr[i] > 0 ? "€" + (arr[i] >= 1000 ? (arr[i] / 1000).toFixed(1) + "M" : arr[i] + "k") : ""}
                  </span>
                  <div className="w-full rounded-t-lg" style={{ height: Math.max(h, 4), background: color, minWidth: 60 }} />
                  <span style={{ fontSize: 20, color: "hsl(215 10% 40%)" }}>{q}</span>
                </div>
              );
            })}
          </div>

          {/* Phase bands */}
          <div className="absolute bottom-8 left-16 right-0 flex" style={{ height: 4, opacity: 0.3 }}>
            <div className="flex-1" style={{ background: `hsl(${ACCENT})` }} />
            <div className="flex-1" style={{ background: `hsl(${GREEN})` }} />
            <div className="flex-1" style={{ background: `hsl(${GOLD})` }} />
          </div>
        </div>

        <div className="flex gap-8 mt-6">
          {[
            { phase: "Phase 1 (Q1–Q4)", goal: "€120k ARR", note: "First 10 customers. Direct sales. Prove retention.", color: ACCENT },
            { phase: "Phase 2 (Q5–Q8)", goal: "€1.05M ARR", note: "Channel partners live. Template marketplace. Series A prep.", color: GREEN },
            { phase: "Phase 3 (Q9–Q12)", goal: "€4.2M ARR", note: "Platform API + white-label. NRR >120%.", color: GOLD },
          ].map(({ phase, goal, note, color }) => (
            <div key={phase} className="flex-1 rounded-xl border p-6"
              style={{ borderColor: `hsl(${color} / 0.22)`, background: `hsl(${color} / 0.05)` }}>
              <p style={{ fontSize: 20, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{phase}</p>
              <p className="font-black" style={{ fontSize: 36, color: "hsl(210 18% 92%)" }}>{goal}</p>
              <p style={{ fontSize: 20, color: "hsl(215 10% 45%)" }}>{note}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 12 — Use of Funds ─────────────────────────────────────────────────

function Slide12UseOfFunds() {
  const allocations = [
    { label: "Product & Engineering", pct: 45, amt: "€675k", desc: "Core team (2 senior engineers + 1 AI specialist). Complete the SECI flywheel — after-action synthesis, smart ingestion, drift detection.", color: ACCENT },
    { label: "Sales & GTM", pct: 30, amt: "€450k", desc: "First 2 enterprise sales hires + marketing. Channel partner program development. Template marketplace.", color: GREEN },
    { label: "Research & AI Infrastructure", pct: 15, amt: "€225k", desc: "AACE v4 spec + LLM inference costs. Academic partnership on SECI-AI validation.", color: GOLD },
    { label: "Operations & Legal", pct: 10, amt: "€150k", desc: "EU data compliance, IP protection, financial runway management.", color: "215 10% 45%" },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Use of Funds" color={ACCENT} />
        <h2 className="font-bold mb-12" style={{ fontSize: 76, color: "hsl(210 18% 92%)", lineHeight: 1.1 }}>
          €1.5M seed. 18-month runway.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Series A ready by month 18.</span>
        </h2>

        <div className="flex gap-12 flex-1">
          {/* Donut visual */}
          <div className="flex flex-col items-center justify-center w-[380px] shrink-0">
            <svg width="340" height="340" viewBox="0 0 340 340">
              {(() => {
                const total = 100; let startAngle = -90;
                const colors = [`hsl(${ACCENT})`, `hsl(${GREEN})`, `hsl(${GOLD})`, "hsl(215 10% 35%)"];
                return allocations.map(({ pct, label }, i) => {
                  const angle = (pct / total) * 360;
                  const endAngle = startAngle + angle;
                  const r = 150; const cx = 170; const cy = 170; const inner = 90;
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
                  const prevAngle = startAngle;
                  startAngle = endAngle;
                  return <path key={label} d={d} fill={colors[i]} opacity={0.8} />;
                });
              })()}
              <text x="170" y="162" textAnchor="middle" fill="hsl(210 18% 92%)" fontSize="36" fontWeight="900">€1.5M</text>
              <text x="170" y="192" textAnchor="middle" fill="hsl(215 10% 45%)" fontSize="22">Seed Round</text>
            </svg>
            <div className="flex flex-col gap-2 mt-2">
              {allocations.map(({ label, pct, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${color})` }} />
                  <span style={{ fontSize: 20, color: "hsl(215 10% 55%)" }}>{pct}% {label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation details */}
          <div className="flex flex-col gap-6 flex-1">
            {allocations.map(({ label, pct, amt, desc, color }) => (
              <div key={label} className="flex gap-6 rounded-xl border p-7"
                style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.05)` }}>
                <div className="shrink-0 flex flex-col items-center gap-1 w-24">
                  <span className="font-black" style={{ fontSize: 38, color: `hsl(${color})`, lineHeight: 1 }}>{pct}%</span>
                  <span className="font-bold" style={{ fontSize: 24, color: `hsl(${color} / 0.7)` }}>{amt}</span>
                </div>
                <div>
                  <p className="font-bold mb-2" style={{ fontSize: 28, color: "hsl(210 18% 92%)" }}>{label}</p>
                  <p style={{ fontSize: 22, color: "hsl(215 10% 50%)", lineHeight: 1.5 }}>{desc}</p>
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

// ─── Slide 13 — The Ask ──────────────────────────────────────────────────────

function Slide13TheAsk() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <div className="relative z-10 w-full px-28">
        <div className="text-center mb-16">
          <Tag label="The Ask" color={GOLD} />
          <h2 className="font-black" style={{ fontSize: 96, color: "hsl(210 18% 92%)", lineHeight: 1.0 }}>
            €1.5M Seed Round
          </h2>
          <p style={{ fontSize: 36, color: "hsl(215 10% 50%)", marginTop: 16 }}>
            Target close: Q3 2026 &nbsp;·&nbsp; 18-month runway &nbsp;·&nbsp; Series A at 18 months
          </p>
        </div>

        <div className="grid grid-cols-3 gap-10 mb-14">
          {[
            { label: "Round Structure", val: "€1.5M Seed", sub: "SAFE or priced round — flexible to lead investor preference", color: GOLD },
            { label: "What We're Looking For", val: "Strategic LP", sub: "Investors with professional services network and SaaS operational experience", color: ACCENT },
            { label: "Milestones Unlocked", val: "Series A Ready", sub: "€120k ARR, 10 proven customers, NRR>110% before raising next round", color: GREEN },
          ].map(({ label, val, sub, color }) => (
            <div key={label} className="rounded-2xl border p-10 flex flex-col gap-4"
              style={{ borderColor: `hsl(${color} / 0.3)`, background: `hsl(${color} / 0.07)` }}>
              <p className="font-semibold" style={{ fontSize: 24, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{label}</p>
              <p className="font-black" style={{ fontSize: 44, color: "hsl(210 18% 92%)", lineHeight: 1.1 }}>{val}</p>
              <p style={{ fontSize: 23, color: "hsl(215 10% 50%)", lineHeight: 1.45 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border p-10 flex items-center gap-10"
          style={{ borderColor: `hsl(${ACCENT} / 0.3)`, background: `hsl(${ACCENT} / 0.06)` }}>
          <Globe size={52} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
          <div>
            <p className="font-bold mb-3" style={{ fontSize: 32, color: "hsl(210 18% 92%)" }}>Why now?</p>
            <p style={{ fontSize: 26, color: "hsl(215 10% 55%)", lineHeight: 1.55 }}>
              The convergence of GenAI commoditization and workforce mobility has created a $47B gap in the market.
              Generic AI tools are accelerating the problem — they make teams faster at producing outputs with no organizational context.
              <strong style={{ color: "hsl(210 18% 80%)" }}> LIZA is the infrastructure layer that makes organizational knowledge the competitive advantage.</strong>
            </p>
          </div>
        </div>
      </div>
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ─── Slide 14 — Closing ──────────────────────────────────────────────────────

function Slide14Closing() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.07]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(circle, hsl(${GREEN}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <div className="mb-12 px-8 py-3.5 rounded-full border flex items-center gap-3"
          style={{ borderColor: `hsl(${ACCENT} / 0.35)`, background: `hsl(${ACCENT} / 0.07)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${ACCENT})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 26, color: `hsl(${ACCENT})` }}>LIZA OS</span>
        </div>

        <h2 className="font-black mb-10" style={{ fontSize: 96, color: "hsl(210 18% 92%)", lineHeight: 1.0 }}>
          The best organizations don't<br />just hire experts.
          <br />
          <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            They build systems that think.
          </span>
        </h2>

        <p style={{ fontSize: 34, color: "hsl(215 10% 50%)", maxWidth: 1100, lineHeight: 1.6, marginBottom: 56 }}>
          LIZA is the platform that makes institutional intelligence
          a compounding asset — not a human-dependent liability.
        </p>

        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-3 px-14 py-8 rounded-2xl"
            style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))` }}>
            <Briefcase size={36} style={{ color: BG }} />
            <span className="font-bold" style={{ fontSize: 28, color: BG }}>Schedule a Founder Call</span>
          </div>
          <div className="flex flex-col items-center gap-3 px-14 py-8 rounded-2xl border"
            style={{ borderColor: `hsl(${ACCENT} / 0.35)`, background: `hsl(${ACCENT} / 0.06)` }}>
            <Shield size={36} style={{ color: `hsl(${ACCENT})` }} />
            <span className="font-bold" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>Request Data Room</span>
          </div>
        </div>

        <p className="mt-14" style={{ fontSize: 26, color: "hsl(215 10% 30%)" }}>
          lizaos.ai &nbsp;·&nbsp; kristof.eger@lizaos.ai &nbsp;·&nbsp; Confidential — Not for distribution
        </p>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, title: "Cover", component: <Slide01Cover /> },
  { id: 2, title: "The Problem", component: <Slide02Problem /> },
  { id: 3, title: "Market Size", component: <Slide03Market /> },
  { id: 4, title: "The Solution", component: <Slide04Solution /> },
  { id: 5, title: "Product", component: <Slide05Product /> },
  { id: 6, title: "Traction", component: <Slide06Traction /> },
  { id: 7, title: "Business Model", component: <Slide07BusinessModel /> },
  { id: 8, title: "Go-To-Market", component: <Slide08GTM /> },
  { id: 9, title: "Competitive Moat", component: <Slide09Moat /> },
  { id: 10, title: "Team", component: <Slide10Team /> },
  { id: 11, title: "Financials", component: <Slide11Financials /> },
  { id: 12, title: "Use of Funds", component: <Slide12UseOfFunds /> },
  { id: 13, title: "The Ask", component: <Slide13TheAsk /> },
  { id: 14, title: "Closing", component: <Slide14Closing /> },
];

// ─── Main page ───────────────────────────────────────────────────────────────

export default function InvestorDeck() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showNav, setShowNav] = useState(true);

  const goTo = useCallback((idx: number) => {
    setCurrent(Math.max(0, Math.min(SLIDES.length - 1, idx)));
    setShowGrid(false);
  }, []);

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

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

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-[9999]" style={{ cursor: showNav ? "default" : "none" }}>
        <ScaledSlide>{slide.component}</ScaledSlide>
        {showNav && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full"
            style={{ background: "hsl(222 20% 4% / 0.9)", border: "1px solid hsl(222 14% 18%)" }}>
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30">
              <ChevronLeft size={20} style={{ color: "hsl(210 18% 92%)" }} />
            </button>
            <span className="text-sm font-mono px-2" style={{ color: "hsl(215 10% 50%)" }}>{current + 1} / {SLIDES.length}</span>
            <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30">
              <ChevronRight size={20} style={{ color: "hsl(210 18% 92%)" }} />
            </button>
            <button onClick={() => { document.exitFullscreen?.(); setIsFullscreen(false); }} className="p-2 rounded-lg hover:bg-white/10 ml-2">
              <X size={20} style={{ color: "hsl(215 10% 50%)" }} />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: BG }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ borderColor: "hsl(222 14% 10%)", background: "hsl(222 22% 3%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${GOLD})` }} />
          <span className="text-sm font-semibold" style={{ color: "hsl(210 18% 92%)" }}>LIZA OS — Investor Deck</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GOLD} / 0.12)`, color: `hsl(${GOLD})` }}>
            Series Seed · {SLIDES.length} slides
          </span>
          <span className="text-xs px-2 py-0.5 rounded ml-1"
            style={{ background: "hsl(0 72% 63% / 0.1)", color: "hsl(0 72% 63%)" }}>
            Confidential
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <Button size="sm" variant="ghost" onClick={enterFullscreen}>
            <Maximize2 size={15} className="mr-1.5" /> Present
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnail sidebar */}
        <div className="w-44 flex flex-col gap-2 p-3 overflow-y-auto border-r shrink-0"
          style={{ borderColor: "hsl(222 14% 10%)", background: "hsl(222 22% 3%)" }}>
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)}
              className={cn("w-full rounded-lg overflow-hidden border-2 transition-all text-left shrink-0 flex flex-col",
                i === current ? "border-primary" : "border-transparent opacity-60 hover:opacity-90"
              )}>
              <div className="w-full" style={{ aspectRatio: "16/9", pointerEvents: "none" }}>
                <ScaledSlide>{s.component}</ScaledSlide>
              </div>
              <p className="text-[10px] px-1.5 py-1" style={{ color: "hsl(215 10% 40%)" }}>
                {String(i + 1).padStart(2, "0")} {s.title}
              </p>
            </button>
          ))}
        </div>

        {/* Main canvas */}
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
                    <p className="text-xs px-2 pb-2" style={{ color: "hsl(215 10% 50%)" }}>
                      <span className="font-mono">{String(i + 1).padStart(2, "0")}</span> — {s.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden p-6">
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border"
                style={{ borderColor: "hsl(222 14% 13%)" }}>
                <ScaledSlide>{slide.component}</ScaledSlide>
              </div>
            </div>
          )}

          {/* Bottom nav */}
          {!showGrid && (
            <div className="flex items-center justify-between px-8 py-3 border-t shrink-0"
              style={{ borderColor: "hsl(222 14% 10%)", background: "hsl(222 22% 3%)" }}>
              <div className="flex gap-2">
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: i === current ? 32 : 8,
                      background: i === current ? `hsl(${GOLD})` : "hsl(222 14% 18%)",
                    }} />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Button size="sm" variant="outline" onClick={prev} disabled={current === 0}>
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-xs font-mono" style={{ color: "hsl(215 10% 45%)" }}>
                  {current + 1} / {SLIDES.length}
                </span>
                <Button size="sm" variant="outline" onClick={next} disabled={current === SLIDES.length - 1}>
                  <ChevronRight size={16} />
                </Button>
              </div>
              <p className="text-xs" style={{ color: "hsl(215 10% 30%)" }}>← → navigate &nbsp; G grid &nbsp; F present</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
