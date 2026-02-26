import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
  TrendingUp, Users, Brain, Zap, Target, BarChart3,
  DollarSign, Shield, CheckCircle2, ArrowRight, Globe, Layers, Award, Briefcase,
  Download, Loader2
} from "lucide-react";
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

// ─── Shared layout helpers ───────────────────────────────────────────────────

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

function SlideGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.06]" style={{
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
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{ background: `radial-gradient(circle, hsl(${GREEN}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <div className="flex items-center gap-3 mb-12 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${ACCENT} / 0.35)`, background: `hsl(${ACCENT} / 0.07)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${ACCENT})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>LIZA OS · Series Seed</span>
        </div>

        <h1 className="font-black mb-10" style={{ fontSize: 110, lineHeight: 1.0, color: TEXT }}>
          Standardise Senior Judgment<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Across Every Team.
          </span>
        </h1>

        <p style={{ fontSize: 38, color: MUTED, maxWidth: 1200, lineHeight: 1.55 }}>
          We extract senior expertise and turn it into executable protocols
          your entire organisation can run on. Consistently.
        </p>

        <div className="mt-20 flex items-center gap-16">
          {[
            ["Seed Round", "€1.5M target"],
            ["Market", "$47B TAM"],
            ["Model", "SaaS + Usage"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col items-center gap-2">
              <span className="font-bold" style={{ fontSize: 42, color: TEXT }}>{v}</span>
              <span style={{ fontSize: 24, color: SUBTLE }}>{k}</span>
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
        <h2 className="font-bold mb-16" style={{ fontSize: 82, color: TEXT, lineHeight: 1.1 }}>
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
              icon: <Target size={56} />, color: "38 92% 42%",
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
              style={{ background: `hsl(${color} / 0.04)`, borderColor: `hsl(${color} / 0.2)` }}>
              <div style={{ color: `hsl(${color})` }}>{icon}</div>
              <p className="font-bold" style={{ fontSize: 34, color: TEXT }}>{title}</p>
              <p style={{ fontSize: 24, color: MUTED, lineHeight: 1.55 }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={RED} to="38 92% 42%" />
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
          <h2 className="font-bold" style={{ fontSize: 80, color: TEXT, lineHeight: 1.1 }}>
            A $47B market hiding in plain sight.
          </h2>
        </div>

        <div className="flex items-end justify-center gap-20">
          {[
            { label: "TAM", size: 580, amt: "$47B", sub: "Global knowledge management + enterprise AI software market", color: ACCENT, opacity: "0.08" },
            { label: "SAM", size: 420, amt: "$12B", sub: "Professional services firms 50–5000 people in EU + US", color: GREEN, opacity: "0.1" },
            { label: "SOM", size: 280, amt: "$800M", sub: "Reachable via direct + channel GTM in 3 years", color: GOLD, opacity: "0.12" },
          ].map(({ label, size, amt, sub, color, opacity }) => (
            <div key={label} className="flex flex-col items-center gap-6">
              <div className="rounded-full flex items-center justify-center border-2"
                style={{ width: size, height: size, background: `hsl(${color} / ${opacity})`, borderColor: `hsl(${color} / 0.25)` }}>
                <div className="flex flex-col items-center">
                  <span className="font-black" style={{ fontSize: size * 0.18, color: `hsl(${color})`, lineHeight: 1 }}>{amt}</span>
                  <span className="font-bold mt-1" style={{ fontSize: size * 0.09, color: `hsl(${color} / 0.7)` }}>{label}</span>
                </div>
              </div>
              <p className="text-center" style={{ fontSize: 22, color: MUTED, maxWidth: size + 60, lineHeight: 1.5 }}>{sub}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-12" style={{ fontSize: 26, color: SUBTLE }}>
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.04]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <div className="relative z-10 px-28 w-full">
        <div className="text-center mb-14">
          <Tag label="The Solution" color={ACCENT} />
          <h2 className="font-black" style={{ fontSize: 92, color: TEXT, lineHeight: 1.05 }}>
            LIZA OS
          </h2>
          <p className="mt-4" style={{ fontSize: 36, color: MUTED }}>
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
              desc: "Approved learnings flow back into the knowledge graph, making every future execution smarter. The organisation compounds with each project.",
            },
          ].map(({ icon, color, step, title, desc }) => (
            <div key={title} className="flex-1 rounded-2xl border p-10 flex flex-col gap-6"
              style={{ background: `hsl(${color} / 0.04)`, borderColor: `hsl(${color} / 0.2)` }}>
              <div className="flex items-center gap-5">
                <span className="font-black" style={{ fontSize: 64, color: `hsl(${color} / 0.15)`, lineHeight: 1 }}>{step}</span>
                <div style={{ color: `hsl(${color})` }}>{icon}</div>
              </div>
              <p className="font-bold" style={{ fontSize: 42, color: TEXT }}>{title}</p>
              <p style={{ fontSize: 25, color: MUTED, lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 px-10 py-6 rounded-xl border"
          style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.04)` }}>
          <Brain size={32} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
          <p style={{ fontSize: 26, color: MUTED }}>
            Grounded in the <strong style={{ color: TEXT }}>SECI model</strong> (Nonaka & Takeuchi): the proven mechanism behind every learning organization.
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
  return (
    <div className="w-full h-full flex relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex h-full w-full px-20 pt-14 pb-10 gap-12">
        {/* Left — screenshots */}
        <div className="w-[55%] flex flex-col gap-4">
          <Tag label="Product" color={ACCENT} />
          <h2 className="font-bold mb-4" style={{ fontSize: 52, color: TEXT, lineHeight: 1.1 }}>
            Three operating modes.<br />
            <span style={{ color: `hsl(${ACCENT})` }}>One system.</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-0">
            {[
              { src: "/images/product-domains.png", label: "Design — Domain Playbooks" },
              { src: "/images/product-playbooks.png", label: "Design — Protocol Builder" },
              { src: "/images/product-oversight.png", label: "Oversee — Board View" },
              { src: "/images/product-workbook.png", label: "Execute — Workbook Launchpad" },
            ].map(({ src, label }) => (
              <div key={label} className="rounded-xl border overflow-hidden flex flex-col"
                style={{ borderColor: `hsl(${ACCENT} / 0.2)` }}>
                <img src={src} alt={label} className="w-full flex-1 object-cover object-top" style={{ minHeight: 0 }} />
                <p className="px-3 py-2 font-semibold" style={{ fontSize: 16, color: `hsl(${ACCENT})`, background: CARD_ALT }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — modes + capabilities */}
        <div className="w-[45%] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-4 mb-4">
            {[
              { role: "The Launchpad", persona: "Frontline / Operator", color: ACCENT, icon: <Target size={26} /> },
              { role: "The Process Studio", persona: "Expert / Architect", color: GREEN, icon: <Brain size={26} /> },
              { role: "The Command Center", persona: "Manager / Leader", color: GOLD, icon: <BarChart3 size={26} /> },
            ].map(({ role, persona, color, icon }) => (
              <div key={role} className="flex items-center gap-4 rounded-xl border p-5"
                style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
                <div style={{ color: `hsl(${color})` }}>{icon}</div>
                <div>
                  <p className="font-bold" style={{ fontSize: 24, color: TEXT }}>{role}</p>
                  <p style={{ fontSize: 18, color: MUTED }}>{persona}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="font-semibold mb-2" style={{ fontSize: 18, color: SUBTLE, letterSpacing: "0.2em", textTransform: "uppercase" }}>Core Capabilities</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Action Grid", desc: "Protocol-mapped action cards", color: ACCENT },
              { label: "Intent Lock", desc: "AI aligned to each step", color: GREEN },
              { label: "Knowledge Bundles", desc: "Org → Team → Workbook", color: ACCENT },
              { label: "Drift Detection", desc: "Real-time deviation scoring", color: GREEN },
              { label: "Smart Ingestion", desc: "Drag-drop → Playbook extraction", color: ACCENT },
              { label: "After-Action Synthesis", desc: "Session → knowledge updates", color: GREEN },
            ].map(({ label, desc, color }) => (
              <div key={label} className="rounded-lg border px-4 py-3 flex items-center gap-2"
                style={{ borderColor: `hsl(${color} / 0.15)`, background: `hsl(${color} / 0.04)` }}>
                <CheckCircle2 size={18} style={{ color: `hsl(${color})`, flexShrink: 0 }} />
                <div>
                  <p className="font-bold" style={{ fontSize: 18, color: TEXT }}>{label}</p>
                  <p style={{ fontSize: 14, color: MUTED }}>{desc}</p>
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

// ─── Slide 06 — Traction ─────────────────────────────────────────────────────

function Slide06Traction() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Traction & Validation" color={GREEN} />
        <h2 className="font-bold mb-14" style={{ fontSize: 76, color: TEXT, lineHeight: 1.1 }}>
          Built on real-world signal.
        </h2>

        <div className="grid grid-cols-4 gap-7 mb-10">
          {[
            { stat: "Multi-Vertical", sub: "Validated across executive search, professional services, sales operations, architecture, and marketing product companies.", color: ACCENT },
            { stat: "Cross-Industry Signal", sub: "Every vertical validated the same core pain point: scaling senior judgment beyond the individuals who carry it.", color: GREEN },
            { stat: "Live Product", sub: "Functional platform with AI edge functions, role-based operating modes, and protocol execution engine.", color: ACCENT },
            { stat: "AACE v3.1", sub: "Proprietary AI context architecture. Intent-locking, hierarchical knowledge injection, and drift detection.", color: GREEN },
          ].map(({ stat, sub, color }) => (
            <div key={stat} className="rounded-2xl border p-8 flex flex-col gap-4"
              style={{ background: `hsl(${color} / 0.04)`, borderColor: `hsl(${color} / 0.18)` }}>
              <p className="font-black" style={{ fontSize: 38, color: `hsl(${color})`, lineHeight: 1.1 }}>{stat}</p>
              <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.5 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-8 flex-1">
          <div className="flex-1 rounded-2xl border p-10"
            style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.04)` }}>
            <Award size={44} style={{ color: `hsl(${GOLD})` }} className="mb-5" />
            <p className="font-bold mb-4" style={{ fontSize: 34, color: TEXT }}>Industry Validation</p>
            <p style={{ fontSize: 24, color: MUTED, lineHeight: 1.55 }}>
              The "knowledge rot" problem is publicly recognized as a top-3 operational risk in professional services. 
              McKinsey, Deloitte, and EY have all published reports citing institutional memory loss as a strategic liability.
            </p>
          </div>
          <div className="flex-1 rounded-2xl border p-10"
            style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.04)` }}>
            <Layers size={44} style={{ color: `hsl(${ACCENT})` }} className="mb-5" />
            <p className="font-bold mb-4" style={{ fontSize: 34, color: TEXT }}>Technical Foundation</p>
            <p style={{ fontSize: 24, color: MUTED, lineHeight: 1.55 }}>
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
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-10">
        <Tag label="Business Model — Product-Led Sales" color={ACCENT} />
        <h2 className="font-bold mb-6" style={{ fontSize: 64, color: TEXT, lineHeight: 1.1 }}>
          Product-Led Sales + usage-based AI.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Land with one team. Expand org-wide.</span>
        </h2>

        <div className="grid grid-cols-3 gap-6 mb-6 flex-1 min-h-0">
          {[
            {
              tier: "Team", price: "€40k/yr", seats: "Single team",
              desc: "Core workbooks, action grid, protocol execution. Product-led entry — one team adopts, others follow.", color: MUTED,
              features: ["Unlimited workbooks", "Action Grid + Protocols", "Basic knowledge bundles"],
            },
            {
              tier: "Process", price: "€150k/yr", seats: "Multi-team",
              desc: "Full SECI flywheel: smart ingestion, drift detection, after-action synthesis. Includes deployment.", color: ACCENT,
              features: ["Everything in Team", "Smart document ingestion", "Drift scoring + alerts", "After-action AI synthesis", "Deployment services"],
            },
            {
              tier: "Transform", price: "€250k/yr", seats: "Organisation-wide",
              desc: "White-glove onboarding, custom playbook library, SSO, full organisational rollout.", color: GOLD,
              features: ["Everything in Process", "Custom playbook authoring", "SSO + SCIM provisioning", "Dedicated CSM + SLA"],
            },
          ].map(({ tier, price, seats, desc, color, features }) => (
            <div key={tier} className="flex flex-col rounded-2xl border overflow-hidden"
              style={{ borderColor: `hsl(${color} / 0.25)`, background: `hsl(${color} / 0.04)` }}>
              <div className="px-7 py-5 border-b" style={{ borderColor: `hsl(${color} / 0.15)` }}>
                <p className="font-bold mb-1" style={{ fontSize: 26, color: `hsl(${color})` }}>{tier}</p>
                <p className="font-black" style={{ fontSize: 40, color: TEXT, lineHeight: 1 }}>{price}</p>
                <p style={{ fontSize: 19, color: MUTED }}>{seats}</p>
              </div>
              <div className="px-7 py-5 flex flex-col gap-2 flex-1">
                <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.45, marginBottom: 4 }}>{desc}</p>
                {features.map(f => (
                  <p key={f} className="flex items-center gap-2.5" style={{ fontSize: 19, color: "hsl(222 15% 30%)" }}>
                    <CheckCircle2 size={16} style={{ color: `hsl(${color})`, flexShrink: 0 }} /> {f}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          {[
            { label: "AI Usage Layer", desc: "+€0.10 per AI call above tier limit. Usage expands ARR naturally.", color: GREEN },
            { label: "Template Marketplace", desc: "Partners (e.g. MEDDIC, ESG frameworks) sell playbooks. 30% rev share.", color: ACCENT },
          ].map(({ label, desc, color }) => (
            <div key={label} className="flex-1 rounded-xl border px-6 py-5 flex items-center gap-5"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
              <DollarSign size={30} style={{ color: `hsl(${color})`, flexShrink: 0 }} />
              <div>
                <p className="font-bold" style={{ fontSize: 24, color: TEXT }}>{label}</p>
                <p style={{ fontSize: 19, color: MUTED }}>{desc}</p>
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
      <div className="relative z-10 flex flex-col h-full px-28 pt-14 pb-10">
        <Tag label="Go-To-Market" color={ACCENT} />
        <h2 className="font-bold mb-8" style={{ fontSize: 68, color: TEXT, lineHeight: 1.1 }}>
          Enter with one team's pain.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Expand across the organisation.</span>
        </h2>

        <div className="flex gap-8 flex-1 min-h-0">
          {/* Phases */}
          <div className="w-3/5 flex flex-col gap-4">
            {[
              {
                phase: "Phase 1: 0–12 months", color: ACCENT,
                headline: "Product-led sales launch",
                points: ["Target: EU professional services firms 50–500 people", "Product-led sales with pre-built playbook templates", "Expert-driven onboarding: seniors build playbooks in the platform", "CAC target: €2,000 | LTV target: €85,000+"],
              },
              {
                phase: "Phase 2: 12–30 months", color: GREEN,
                headline: "Template marketplace + channel partners",
                points: ["Partner with framework owners: MEDDIC, ESG, RACI specialists", "Distribution via HR tech and professional services ecosystems", "Template marketplace enables passive ARR expansion"],
              },
              {
                phase: "Phase 3: 30+ months", color: GOLD,
                headline: "Platform + API layer",
                points: ["AACE as a service: enterprise workflows plug into the context engine", "White-label for firms to deploy under their own brand"],
              },
            ].map(({ phase, color, headline, points }) => (
              <div key={phase} className="rounded-xl border p-5"
                style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
                <p className="font-semibold mb-0.5" style={{ fontSize: 20, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{phase}</p>
                <p className="font-bold mb-2" style={{ fontSize: 27, color: TEXT }}>{headline}</p>
                <div className="flex flex-col gap-1">
                  {points.map(p => (
                    <p key={p} style={{ fontSize: 20, color: MUTED }}>→ {p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Key metrics */}
          <div className="w-2/5 flex flex-col gap-4">
            <p className="font-semibold" style={{ fontSize: 24, color: SUBTLE, letterSpacing: "0.2em", textTransform: "uppercase" }}>Target Metrics — Year 3</p>
            {[
              { label: "ARR", val: "€8M+", color: ACCENT },
              { label: "Customers", val: "65", color: GREEN },
              { label: "NRR", val: ">120%", color: ACCENT },
              { label: "Gross Margin", val: "78%", color: GREEN },
              { label: "CAC Payback", val: "<12 mo", color: ACCENT },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center justify-between rounded-xl border px-7 py-5"
                style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
                <span style={{ fontSize: 26, color: MUTED }}>{label}</span>
                <span className="font-black" style={{ fontSize: 38, color: `hsl(${color})` }}>{val}</span>
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
        <h2 className="font-bold mb-10" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
          We are building a new category.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Nobody else is doing this.</span>
        </h2>

        <div className="flex-1 rounded-2xl border overflow-hidden" style={{ borderColor: CHROME_BORDER }}>
          <table className="w-full h-full">
            <thead>
              <tr style={{ background: CARD_ALT }}>
                <th className="text-left px-8 py-5 font-medium" style={{ fontSize: 22, color: MUTED, width: "34%" }}>Capability</th>
                {[
                  { name: "LIZA OS", h: true }, { name: "Notion AI", h: false },
                  { name: "M365 Copilot", h: false }, { name: "Glean", h: false }, { name: "Guru", h: false }
                ].map(({ name, h }) => (
                  <th key={name} className="px-5 py-5 font-bold text-center" style={{ fontSize: 22, color: h ? `hsl(${ACCENT})` : MUTED }}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ cap, liza, notion, copilot, glean, guru }, i) => (
                <tr key={cap} style={{ background: i % 2 === 0 ? "transparent" : CARD_ALT }}>
                  <td className="px-8 py-4" style={{ fontSize: 22, color: "hsl(222 15% 30%)" }}>{cap}</td>
                  {[
                    { v: liza, h: true }, { v: notion, h: false }, { v: copilot, h: false }, { v: glean, h: false }, { v: guru, h: false }
                  ].map(({ v, h }, j) => (
                    <td key={j} className="px-5 py-4 text-center">
                      {v
                        ? <CheckCircle2 size={26} className="mx-auto" style={{ color: h ? `hsl(${GREEN})` : "hsl(215 10% 60%)" }} />
                        : <X size={26} className="mx-auto" style={{ color: "hsl(215 10% 82%)" }} />
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6" style={{ fontSize: 24, color: SUBTLE }}>
          The AACE v3.1 specification creates a technical moat. Competitors would need 18–24 months to replicate the context architecture alone.
        </p>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 10 — Team ─────────────────────────────────────────────────────────

function Slide10Team() {
  const founders = [
    { name: "István Boscha", role: "Product Vision & Capital-Efficient CEO", bio: "Founder of Aliz.ai, a Google Cloud Professional Services Partner. 15 years in AI transformation globally.", photo: istvanPhoto, initials: "IB", color: ACCENT },
    { name: "Kristóf Éger", role: "Enterprise Narrative & Go-to-Market", bio: "AI-driven business strategist, embedding AI into decision-making workflows.", photo: kristofPhoto, initials: "KÉ", color: GREEN },
    { name: "Zoltán Kauker", role: "Scalable AI Architecture & Enterprise Security", bio: "Deep-tech AI and data engineering expert, leading AI-driven decision systems.", photo: zoltanPhoto, initials: "ZK", color: GOLD },
  ];
  const advisors = [
    { name: "Tom Ray", role: "Chairman, Aliz.ai; Founding CEO, EdgeCore Data Centers", bio: "Leader in scaling global tech service companies and building enterprise infrastructure." },
    { name: "Sylwester Pawluk", role: "VP Product Management, GRAPHISOFT", bio: "15+ years driving product strategy across GE Healthcare & GRAPHISOFT. Oxford CS graduate. AI & data advocate scaling product portfolios globally." },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Team" color={ACCENT} />
        <h2 className="font-bold mb-6" style={{ fontSize: 68, color: TEXT, lineHeight: 1.1 }}>
          Built by Experts, Guided by<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Industry Leaders.</span>
        </h2>

        <p className="font-semibold mb-5" style={{ fontSize: 22, color: `hsl(${ACCENT})`, letterSpacing: "0.15em", textTransform: "uppercase" }}>Founding Team</p>
        <div className="grid grid-cols-3 gap-7 mb-8">
          {founders.map(f => (
            <div key={f.name} className="flex flex-col gap-4 rounded-2xl border p-7"
              style={{ borderColor: `hsl(${f.color} / 0.2)`, background: `hsl(${f.color} / 0.04)` }}>
              <div className="flex items-center gap-4">
                {f.photo ? (
                  <img src={f.photo} alt={f.name} className="w-16 h-16 rounded-full object-cover shrink-0"
                    style={{ border: `2px solid hsl(${f.color} / 0.4)` }} />
                ) : (
                  <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl shrink-0"
                    style={{ background: `hsl(${f.color} / 0.15)`, color: `hsl(${f.color})`, border: `2px solid hsl(${f.color} / 0.4)` }}>
                    {f.initials}
                  </div>
                )}
                <div>
                  <p className="font-bold" style={{ fontSize: 26, color: TEXT }}>{f.name}</p>
                  <p style={{ fontSize: 18, color: `hsl(${f.color})` }}>{f.role}</p>
                </div>
              </div>
              <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>{f.bio}</p>
            </div>
          ))}
        </div>

        <p className="font-semibold mb-5" style={{ fontSize: 22, color: `hsl(${GOLD})`, letterSpacing: "0.15em", textTransform: "uppercase" }}>Strategic Advisory Board</p>
        <div className="grid grid-cols-2 gap-7">
          {advisors.map(a => (
            <div key={a.name} className="rounded-2xl border p-7"
              style={{ borderColor: `hsl(${GOLD} / 0.18)`, background: `hsl(${GOLD} / 0.04)` }}>
              <p className="font-bold mb-1" style={{ fontSize: 26, color: TEXT }}>{a.name}</p>
              <p className="mb-3" style={{ fontSize: 18, color: `hsl(${GOLD})` }}>{a.role}</p>
              <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>{a.bio}</p>
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
  const arr = [0, 80, 220, 500, 900, 1500, 2200, 3500, 4400, 5600, 6800, 8200];
  const maxArr = Math.max(...arr);

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Financial Projections" color={ACCENT} />
        <h2 className="font-bold mb-10" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
          Path to €8M ARR in 36 months.
        </h2>

        {/* Bar chart */}
        <div className="flex-1 flex items-end gap-3 relative px-4">
          <div className="absolute left-0 top-0 bottom-10 flex flex-col justify-between">
            {[10000, 8000, 6000, 4000, 2000, 1000, 0].map(v => (
              <span key={v} style={{ fontSize: 20, color: SUBTLE, fontFamily: "monospace" }}>
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
                  <span style={{ fontSize: 20, color: SUBTLE }}>{q}</span>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-8 left-16 right-0 flex" style={{ height: 4, opacity: 0.3 }}>
            <div className="flex-1" style={{ background: `hsl(${ACCENT})` }} />
            <div className="flex-1" style={{ background: `hsl(${GREEN})` }} />
            <div className="flex-1" style={{ background: `hsl(${GOLD})` }} />
          </div>
        </div>

        <div className="flex gap-8 mt-6">
          {[
            { phase: "Phase 1 (Q1–Q4)", goal: "€500k ARR", note: "6 customers, mostly Team tier. Direct product-led sales. Prove retention + expansion.", color: ACCENT },
            { phase: "Phase 2 (Q5–Q8)", goal: "€3.5M ARR", note: "30 customers. Channel partners live. Series A at month 18.", color: GREEN },
            { phase: "Phase 3 (Q9–Q12)", goal: "€8.2M ARR", note: "65 customers. NRR >120%. Platform API + white-label.", color: GOLD },
          ].map(({ phase, goal, note, color }) => (
            <div key={phase} className="flex-1 rounded-xl border p-6"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
              <p style={{ fontSize: 20, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{phase}</p>
              <p className="font-black" style={{ fontSize: 36, color: TEXT }}>{goal}</p>
              <p style={{ fontSize: 20, color: MUTED }}>{note}</p>
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
    { label: "Product & Engineering", pct: 45, amt: "€675k", desc: "Core team (2 senior engineers + 1 AI specialist). Complete the SECI flywheel: after-action synthesis, smart ingestion, drift detection.", color: ACCENT },
    { label: "Sales & GTM", pct: 30, amt: "€450k", desc: "First 2 enterprise sales hires + marketing. Channel partner program development. Template marketplace.", color: GREEN },
    { label: "Research & AI Infrastructure", pct: 15, amt: "€225k", desc: "AACE v4 spec + LLM inference costs. Academic partnership on SECI-AI validation.", color: GOLD },
    { label: "Operations & Legal", pct: 10, amt: "€150k", desc: "EU data compliance, IP protection, financial runway management.", color: MUTED },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Use of Funds" color={ACCENT} />
        <h2 className="font-bold mb-12" style={{ fontSize: 76, color: TEXT, lineHeight: 1.1 }}>
          €1.5M seed. 18-month runway.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Series A ready by month 18.</span>
        </h2>

        <div className="flex gap-12 flex-1">
          {/* Donut visual */}
          <div className="flex flex-col items-center justify-center w-[380px] shrink-0">
            <svg width="340" height="340" viewBox="0 0 340 340">
              {(() => {
                const total = 100; let startAngle = -90;
                const colors = [`hsl(${ACCENT})`, `hsl(${GREEN})`, `hsl(${GOLD})`, "hsl(215 10% 65%)"];
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
                  startAngle = endAngle;
                  return <path key={label} d={d} fill={colors[i]} opacity={0.8} />;
                });
              })()}
              <text x="170" y="162" textAnchor="middle" fill={TEXT} fontSize="36" fontWeight="900">€1.5M</text>
              <text x="170" y="192" textAnchor="middle" fill={MUTED} fontSize="22">Seed Round</text>
            </svg>
            <div className="flex flex-col gap-2 mt-2">
              {allocations.map(({ label, pct, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full" style={{ background: `hsl(${color})` }} />
                  <span style={{ fontSize: 20, color: MUTED }}>{pct}% {label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation details */}
          <div className="flex flex-col gap-6 flex-1">
            {allocations.map(({ label, pct, amt, desc, color }) => (
              <div key={label} className="flex gap-6 rounded-xl border p-7"
                style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
                <div className="shrink-0 flex flex-col items-center gap-1 w-24">
                  <span className="font-black" style={{ fontSize: 38, color: `hsl(${color})`, lineHeight: 1 }}>{pct}%</span>
                  <span className="font-bold" style={{ fontSize: 24, color: `hsl(${color} / 0.7)` }}>{amt}</span>
                </div>
                <div>
                  <p className="font-bold mb-2" style={{ fontSize: 28, color: TEXT }}>{label}</p>
                  <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.5 }}>{desc}</p>
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-[0.04]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <div className="relative z-10 w-full px-28">
        <div className="text-center mb-16">
          <Tag label="The Ask" color={GOLD} />
          <h2 className="font-black" style={{ fontSize: 96, color: TEXT, lineHeight: 1.0 }}>
            €1.5M Seed Round
          </h2>
          <p style={{ fontSize: 36, color: MUTED, marginTop: 16 }}>
            Target close: Q3 2026 &nbsp;·&nbsp; 18-month runway &nbsp;·&nbsp; Series A at 18 months
          </p>
        </div>

        <div className="grid grid-cols-3 gap-10 mb-14">
          {[
            { label: "Round Structure", val: "€1.5M Seed", sub: "SAFE or priced round. Flexible to lead investor preference.", color: GOLD },
            { label: "What We're Looking For", val: "Strategic LP", sub: "Investors with professional services network and SaaS operational experience", color: ACCENT },
            { label: "Milestones Unlocked", val: "Series A Ready", sub: "€1.5M ARR, 15 customers, NRR>110%. Reached at month 18 per operating model.", color: GREEN },
          ].map(({ label, val, sub, color }) => (
            <div key={label} className="rounded-2xl border p-10 flex flex-col gap-4"
              style={{ borderColor: `hsl(${color} / 0.25)`, background: `hsl(${color} / 0.05)` }}>
              <p className="font-semibold" style={{ fontSize: 24, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{label}</p>
              <p className="font-black" style={{ fontSize: 44, color: TEXT, lineHeight: 1.1 }}>{val}</p>
              <p style={{ fontSize: 23, color: MUTED, lineHeight: 1.45 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border p-10 flex items-center gap-10"
          style={{ borderColor: `hsl(${ACCENT} / 0.25)`, background: `hsl(${ACCENT} / 0.04)` }}>
          <Globe size={52} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
          <div>
            <p className="font-bold mb-3" style={{ fontSize: 32, color: TEXT }}>Why now?</p>
            <p style={{ fontSize: 26, color: MUTED, lineHeight: 1.55 }}>
              The convergence of GenAI commoditization and workforce mobility has created a $47B gap in the market.
              Generic AI tools are accelerating the problem: they make teams faster at producing outputs with no organizational context.
              <strong style={{ color: "hsl(222 15% 25%)" }}> LIZA is the infrastructure layer that makes organizational knowledge the competitive advantage.</strong>
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
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.03]"
        style={{ background: `radial-gradient(circle, hsl(${GREEN}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <div className="mb-12 px-8 py-3.5 rounded-full border flex items-center gap-3"
          style={{ borderColor: `hsl(${ACCENT} / 0.35)`, background: `hsl(${ACCENT} / 0.07)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${ACCENT})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 26, color: `hsl(${ACCENT})` }}>LIZA OS</span>
        </div>

        <h2 className="font-black mb-10" style={{ fontSize: 96, color: TEXT, lineHeight: 1.0 }}>
          The best organizations don't<br />just hire experts.
          <br />
          <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            They build systems that think.
          </span>
        </h2>

        <p style={{ fontSize: 34, color: MUTED, maxWidth: 1100, lineHeight: 1.6, marginBottom: 56 }}>
          LIZA is the platform that makes institutional intelligence
          a compounding asset, not a human-dependent liability.
        </p>

        <div className="flex gap-10">
          <div className="flex flex-col items-center gap-3 px-14 py-8 rounded-2xl"
            style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))` }}>
            <Briefcase size={36} style={{ color: "white" }} />
            <span className="font-bold" style={{ fontSize: 28, color: "white" }}>Schedule a Founder Call</span>
          </div>
          <div className="flex flex-col items-center gap-3 px-14 py-8 rounded-2xl border"
            style={{ borderColor: `hsl(${ACCENT} / 0.35)`, background: `hsl(${ACCENT} / 0.06)` }}>
            <Shield size={36} style={{ color: `hsl(${ACCENT})` }} />
            <span className="font-bold" style={{ fontSize: 28, color: `hsl(${ACCENT})` }}>Request Data Room</span>
          </div>
        </div>

        <p className="mt-14" style={{ fontSize: 26, color: SUBTLE }}>
          lizaos.ai &nbsp;·&nbsp; kristof.eger@lizaos.ai &nbsp;·&nbsp; Confidential · Not for distribution
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
  const [exporting, setExporting] = useState(false);
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

  const handleExportPdf = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 200));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(undefined))));
    await new Promise(r => setTimeout(r, 300));
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const container = exportRef.current;
      if (!container) return;
      const slideEls = Array.from(container.children) as HTMLElement[];
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1920, 1080] });
      for (let i = 0; i < slideEls.length; i++) {
        if (i > 0) pdf.addPage([1920, 1080], 'landscape');
        const gradientEls = slideEls[i].querySelectorAll<HTMLElement>('span');
        const origStyles: string[] = [];
        const affected: HTMLElement[] = [];
        gradientEls.forEach((el) => {
          const cs = el.style.cssText;
          if (cs.includes('background-clip') || cs.includes('BackgroundClip') || cs.includes('text-fill-color') || cs.includes('TextFillColor')) {
            origStyles.push(cs);
            affected.push(el);
            el.style.cssText = `color: hsl(${ACCENT}); font: inherit;`;
          }
        });
        const canvas = await html2canvas(slideEls[i], { width: 1920, height: 1080, scale: 2, useCORS: true, backgroundColor: null });
        affected.forEach((el, j) => { el.style.cssText = origStyles[j]; });
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 1920, 1080);
      }
      pdf.save('LIZA-OS-Investor-Deck.pdf');
    } finally {
      setExporting(false);
    }
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

  // ─── Mobile: auto-hide controls ─────────────────────────────────────────────
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

  // ─── Mobile: clean present mode ─────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999]" style={{ background: BG }}
        onClick={() => { if (!isPortrait) showMobileControls(); }}>
        {isPortrait && (
          <div className="absolute inset-0 z-[10000] flex flex-col items-center justify-center gap-4 px-8"
            style={{ background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(8px)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `hsl(${ACCENT} / 0.1)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`hsl(${ACCENT})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="2" width="16" height="20" rx="2" />
                <path d="M12 18h.01" />
              </svg>
            </div>
            <p className="text-center font-semibold" style={{ fontSize: 18, color: TEXT }}>
              Rotate your device to landscape
            </p>
            <p className="text-center" style={{ fontSize: 14, color: MUTED }}>
              for the best viewing experience
            </p>
          </div>
        )}

        <ScaledSlide>{slide.component}</ScaledSlide>

        {/* Landscape tap-zone arrows */}
        {!isPortrait && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); showMobileControls(); }}
              disabled={current === 0}
              className="absolute left-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-start pl-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(90deg, hsl(0 0% 0% / 0.06), transparent)" }}
              aria-label="Previous slide"
            >
              <ChevronLeft size={32} style={{ color: `hsl(215 15% 42% / 0.5)` }} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); showMobileControls(); }}
              disabled={current === SLIDES.length - 1}
              className="absolute right-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-end pr-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(270deg, hsl(0 0% 0% / 0.06), transparent)" }}
              aria-label="Next slide"
            >
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
          <span className="font-mono text-xs px-1" style={{ color: MUTED }}>
            {current + 1}/{SLIDES.length}
          </span>
          <button onClick={next} disabled={current === SLIDES.length - 1} className="p-1.5 rounded-lg disabled:opacity-20">
            <ChevronRight size={18} style={{ color: TEXT }} />
          </button>
          <div className="w-px h-4" style={{ background: CHROME_BORDER }} />
          <button onClick={handleExportPdf} disabled={exporting} className="p-1.5 rounded-lg disabled:opacity-50">
            {exporting ? <Loader2 size={16} className="animate-spin" style={{ color: MUTED }} /> : <Download size={16} style={{ color: MUTED }} />}
          </button>
        </div>

        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, visibility: exporting ? 'visible' : 'hidden', pointerEvents: 'none' }}>
          {SLIDES.map(s => (
            <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>
              {s.component}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Desktop: full chrome ───────────────────────────────────────────────────
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
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b shrink-0"
        style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: `hsl(${GOLD})` }} />
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS — Investor Deck</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GOLD} / 0.1)`, color: `hsl(${GOLD})` }}>
            Series Seed · {SLIDES.length} slides
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
          <Button size="sm" variant="ghost" onClick={handleExportPdf} disabled={exporting}>
            {exporting ? <Loader2 size={15} className="mr-1.5 animate-spin" /> : <Download size={15} className="mr-1.5" />}
            {exporting ? "Exporting..." : "PDF"}
          </Button>
          <Button size="sm" variant="ghost" onClick={enterFullscreen}>
            <Maximize2 size={15} className="mr-1.5" /> Present
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnail sidebar */}
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
                    <p className="text-xs px-2 pb-2" style={{ color: MUTED }}>
                      <span className="font-mono">{String(i + 1).padStart(2, "0")}</span> — {s.title}
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

          {/* Bottom nav */}
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

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, visibility: exporting ? 'visible' : 'hidden', pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>
            {s.component}
          </div>
        ))}
      </div>
    </div>
  );
}
