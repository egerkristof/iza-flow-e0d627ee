import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";
import {
  Users, Brain, Zap, Target,
  Shield, CheckCircle2, Globe, Layers, Award,
  Loader2, Workflow, Eye, Lightbulb, BookOpen,
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
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
const DARK_BG = "hsl(222 25% 8%)";
const DARK_TEXT = "hsl(0 0% 95%)";
const DARK_MUTED = "hsl(215 15% 60%)";
const DARK_SUBTLE = "hsl(215 10% 45%)";
const DARK_CARD = "hsl(222 20% 13%)";

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
      backgroundImage: `linear-gradient(hsl(215 15% 25%) 1px, transparent 1px), linear-gradient(90deg, hsl(215 15% 25%) 1px, transparent 1px)`,
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

function DarkTag({ label, color = ACCENT }: { label: string; color?: string }) {
  return (
    <p className="font-semibold tracking-[0.25em] uppercase mb-5"
      style={{ fontSize: 28, color: `hsl(${color} / 0.8)` }}>{label}</p>
  );
}

// ─── Slide 01 — Cover ────────────────────────────────────────────────────────

function Slide01Cover() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style={{ background: `radial-gradient(circle, hsl(${GREEN}), transparent 70%)` }} />

      <div className="relative z-10 flex flex-col items-center text-center px-32">
        <div className="flex items-center gap-3 mb-12 px-7 py-3 rounded-full border"
          style={{ borderColor: `hsl(${GREEN} / 0.35)`, background: `hsl(${GREEN} / 0.1)` }}>
          <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: `hsl(${GREEN})` }} />
          <span className="font-bold tracking-[0.3em] uppercase" style={{ fontSize: 28, color: `hsl(${GREEN})` }}>LIZA OS · Pre-Seed</span>
        </div>

        <h1 className="font-black mb-10" style={{ fontSize: 100, lineHeight: 1.0, color: DARK_TEXT }}>
          The Operating System for<br />
          <span style={{ background: `linear-gradient(135deg, hsl(${ACCENT}), hsl(${GREEN}))`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI-Native Organizations.
          </span>
        </h1>

        <p style={{ fontSize: 36, color: DARK_MUTED, maxWidth: 1200, lineHeight: 1.55 }}>
          Every team uses AI. No one manages how.<br />
          We're raising €300K to prove that organizational<br />
          knowledge is the next infrastructure layer.
        </p>

        <div className="mt-20 flex items-center gap-20">
          {[
            ["€300K", "Pre-seed to validate & close first paying customers"],
            ["Live", "Product in market with enterprise validation"],
            ["12 mo", "Runway to Series Seed milestones"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col items-center gap-2 max-w-[320px]">
              <span className="font-black" style={{ fontSize: 48, color: DARK_TEXT }}>{k}</span>
              <span className="text-center" style={{ fontSize: 22, color: DARK_SUBTLE }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── Slide 02 — The End of SaaS Thesis ───────────────────────────────────────

function Slide02Thesis() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <DarkTag label="The Investment Thesis" color={GOLD} />
        <h2 className="font-black mb-14" style={{ fontSize: 78, color: DARK_TEXT, lineHeight: 1.05 }}>
          Every AI startup is building<br />
          <span style={{ color: `hsl(${GOLD})` }}>the same thing.</span>
        </h2>

        <div className="grid grid-cols-3 gap-8 mb-10">
          {[
            { icon: "💬", label: "Chats", desc: "Every tool has a conversation interface with an LLM." },
            { icon: "🤖", label: "Agents", desc: "Every tool lets you build autonomous workflows." },
            { icon: "📄", label: "Context", desc: "Every tool offers RAG, memory, and document grounding." },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="rounded-2xl border p-8 text-center"
              style={{ borderColor: "hsl(0 0% 100% / 0.08)", background: DARK_CARD }}>
              <p style={{ fontSize: 56 }}>{icon}</p>
              <p className="font-bold mt-4 mb-2" style={{ fontSize: 32, color: DARK_TEXT }}>{label}</p>
              <p style={{ fontSize: 22, color: DARK_MUTED, lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border p-10 flex-1 flex flex-col justify-center"
          style={{ borderColor: `hsl(${GOLD} / 0.25)`, background: `hsl(${GOLD} / 0.06)` }}>
          <p className="font-black mb-4" style={{ fontSize: 40, color: DARK_TEXT }}>
            These features are commoditizing in real-time.
          </p>
          <p style={{ fontSize: 28, color: DARK_MUTED, lineHeight: 1.6 }}>
            The defensible layer isn't the tool. It's the <strong style={{ color: `hsl(${GOLD})` }}>organizational knowledge</strong> that makes the tool work consistently.
            LIZA is the infrastructure that captures, governs, and operationalizes that knowledge.
            We're not building a better SaaS product. We're building the <strong style={{ color: `hsl(${GOLD})` }}>management layer underneath all of them.</strong>
          </p>
        </div>
      </div>
      <SlideBar from={GOLD} to={ACCENT} />
    </div>
  );
}

// ─── Slide 03 — Problem ──────────────────────────────────────────────────────

function Slide02Problem() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-20 pb-16">
        <Tag label="The Problem" color={RED} />
        <h2 className="font-bold mb-14" style={{ fontSize: 76, color: TEXT, lineHeight: 1.1 }}>
          Same prompt. Same tool. Five people.<br />
          <span style={{ color: `hsl(${RED})` }}>Five different outputs.</span>
        </h2>

        <div className="grid grid-cols-3 gap-8 flex-1">
          {[
            {
              icon: <Layers size={56} />, color: RED,
              title: "No coordination layer",
              body: "Every team picks their own AI tools, prompts, and workflows. Zero shared intelligence. Zero standards."
            },
            {
              icon: <Users size={56} />, color: "38 92% 42%",
              title: "Knowledge stays in heads",
              body: "Your best people's judgment never becomes organizational capability. Every resignation is a knowledge loss event."
            },
            {
              icon: <Zap size={56} />, color: RED,
              title: "AI amplifies chaos",
              body: "Generic AI gives everyone content generation with zero organizational context. Teams get faster at producing inconsistent outputs."
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

// ─── Slide 03 — Solution ─────────────────────────────────────────────────────

function Slide03Solution() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.04]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />

      <div className="relative z-10 px-28 w-full">
        <div className="text-center mb-14">
          <Tag label="The Solution" color={ACCENT} />
          <h2 className="font-black" style={{ fontSize: 88, color: TEXT, lineHeight: 1.05 }}>
            LIZA OS
          </h2>
          <p className="mt-4" style={{ fontSize: 34, color: MUTED }}>
            The Management Layer for AI-Native Teams
          </p>
        </div>

        <div className="flex gap-10 justify-center mb-10">
          {[
            {
              icon: <BookOpen size={52} />, color: ACCENT, step: "01",
              title: "Standards",
              desc: "Encode how your best people think. Playbooks, guardrails, cultural principles become executable knowledge.",
            },
            {
              icon: <Target size={52} />, color: GREEN, step: "02",
              title: "Execution",
              desc: "AI follows your standards in every interaction, across every team. Protocol-driven workflows replace blank-page guessing.",
            },
            {
              icon: <Brain size={52} />, color: GOLD, step: "03",
              title: "Learning",
              desc: "When a senior corrects the AI, that correction becomes organizational knowledge. The loop compounds.",
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

        <div className="flex items-center justify-center gap-3 px-10 py-6 rounded-xl border"
          style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.04)` }}>
          <Brain size={32} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
          <p style={{ fontSize: 26, color: MUTED }}>
            Built on the <strong style={{ color: TEXT }}>SECI model</strong> (Nonaka & Takeuchi): a 40-year proven theory of organizational learning,
            operationalized for the first time through LLMs.
          </p>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 04 — Early Validation ─────────────────────────────────────────────

function Slide04Validation() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Early Validation" color={GREEN} />
        <h2 className="font-bold mb-10" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
          Not theoretical demand.<br />
          <span style={{ color: `hsl(${GREEN})` }}>Real-world signal across verticals.</span>
        </h2>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {[
            {
              title: "Enterprise A — Global AEC Software (€6B Group)",
              color: ACCENT,
              stats: "200+ employees · 16 attendees · 107-min first session",
              points: [
                "Design partnership: post-merger integration across 4 departments (Strategy, HR, R&D, Change Mgmt)",
                "AI learned governance rules in real-time during the first engagement session",
                "VP Product now serves as Strategic Advisor",
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
              color: ACCENT,
              stats: "SaaS company · Sales team pilot",
              points: [
                "Top seller's deal qualification judgment encoded for entire team",
                "Competitive positioning playbooks updated from live deal feedback",
                "Validated sales playbook use case",
              ],
            },
          ].map(({ title, color, stats, points }) => (
            <div key={title} className="rounded-2xl border p-8"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
              <p className="font-bold mb-1" style={{ fontSize: 26, color: TEXT }}>{title}</p>
              <p className="mb-4" style={{ fontSize: 19, color: `hsl(${color})` }}>{stats}</p>
              {points.map((p, i) => (
                <p key={i} className="flex items-start gap-2.5 mb-1.5" style={{ fontSize: 21, color: MUTED }}>
                  <span className="font-bold shrink-0" style={{ color: `hsl(${color})` }}>→</span> {p}
                </p>
              ))}
            </div>
          ))}
        </div>

        <div className="rounded-xl border px-8 py-5 flex items-center gap-6"
          style={{ borderColor: `hsl(${GOLD} / 0.2)`, background: `hsl(${GOLD} / 0.04)` }}>
          <Award size={36} style={{ color: `hsl(${GOLD})`, flexShrink: 0 }} />
          <p style={{ fontSize: 24, color: MUTED }}>
            <strong style={{ color: TEXT }}>Same core problem validated in every vertical:</strong> scaling senior judgment beyond the individuals who carry it.
          </p>
        </div>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── Slide 05 — Product Status ───────────────────────────────────────────────

function Slide05Product() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="What's Already Built" color={ACCENT} />
        <h2 className="font-bold mb-10" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
          This isn't a slide deck.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>The product is live.</span>
        </h2>

        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          {[
            {
              layer: "Knowledge Graph", color: ACCENT,
              icon: <Layers size={40} />,
              desc: "Living organizational memory. Standards, playbooks, cultural principles. Versioned, auditable, propagated in real-time.",
            },
            {
              layer: "Context Engine (AACE v3.1)", color: GREEN,
              icon: <Workflow size={40} />,
              desc: "Proprietary specification. Intent-locking ensures AI stays on-task. Hierarchical knowledge injection at the right step.",
            },
            {
              layer: "Protocol-Driven Workbooks", color: GOLD,
              icon: <Target size={40} />,
              desc: "Model-agnostic execution (GPT, Gemini, Claude). Group collaboration with AI and humans in the same workspace.",
            },
            {
              layer: "Governance & Learning Loop", color: ACCENT,
              icon: <Eye size={40} />,
              desc: "Drift detection, compliance scoring, after-action synthesis. Every execution feeds the knowledge graph.",
            },
          ].map(({ layer, color, icon, desc }) => (
            <div key={layer} className="flex gap-5 rounded-2xl border p-8"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
              <div className="shrink-0" style={{ color: `hsl(${color})` }}>{icon}</div>
              <div>
                <p className="font-bold mb-2" style={{ fontSize: 28, color: TEXT }}>{layer}</p>
                <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6 mt-6">
          {[
            { label: "AI Standards Diagnostic", desc: "Live lead-gen tool. Teams self-assess AI maturity across 5 dimensions.", color: GOLD },
            { label: "Marketing Website + Use Cases", desc: "7 compounding use cases. Full positioning live at liza-os.com.", color: ACCENT },
          ].map(({ label, desc, color }) => (
            <div key={label} className="flex-1 rounded-xl border px-7 py-5 flex items-center gap-5"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
              <Lightbulb size={28} style={{ color: `hsl(${color})`, flexShrink: 0 }} />
              <div>
                <p className="font-bold" style={{ fontSize: 24, color: TEXT }}>{label}</p>
                <p style={{ fontSize: 20, color: MUTED }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 06 — Category Map ─────────────────────────────────────────────────

function Slide06Category() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Category Creation" color={ACCENT} />
        <h2 className="font-bold mb-10" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
          We're not competing with these tools.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>We're the layer underneath.</span>
        </h2>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative" style={{ width: 580, height: 580 }}>
            <svg width="580" height="580" viewBox="0 0 580 580">
              <circle cx="290" cy="290" r="280" fill={`hsl(${RED} / 0.04)`} stroke={`hsl(${RED} / 0.18)`} strokeWidth="2" />
              <circle cx="290" cy="290" r="185" fill={`hsl(${GOLD} / 0.06)`} stroke={`hsl(${GOLD} / 0.22)`} strokeWidth="2" />
              <circle cx="290" cy="290" r="95" fill="url(#lizaGradSeed)" stroke={`hsl(${ACCENT} / 0.4)`} strokeWidth="3" />
              <defs>
                <radialGradient id="lizaGradSeed">
                  <stop offset="0%" stopColor={`hsl(${ACCENT} / 0.14)`} />
                  <stop offset="100%" stopColor={`hsl(${GREEN} / 0.1)`} />
                </radialGradient>
              </defs>
              <text x="290" y="282" textAnchor="middle" fill={`hsl(${ACCENT})`} fontSize="28" fontWeight="900">LIZA OS</text>
              <text x="290" y="306" textAnchor="middle" fill={MUTED} fontSize="13">Management</text>
              <text x="290" y="322" textAnchor="middle" fill={MUTED} fontSize="13">Layer</text>

              <text x="290" y="28" textAnchor="middle" fill={`hsl(${RED})`} fontSize="18" fontWeight="700">AI Tools</text>
              <text x="290" y="122" textAnchor="middle" fill={`hsl(${GOLD})`} fontSize="16" fontWeight="700">Document / RAG Platforms</text>

              <text x="65" y="150" fill={`hsl(${RED} / 0.6)`} fontSize="17" fontWeight="600">ChatGPT</text>
              <text x="440" y="150" fill={`hsl(${RED} / 0.6)`} fontSize="17" fontWeight="600">Copilot</text>
              <text x="65" y="455" fill={`hsl(${RED} / 0.6)`} fontSize="17" fontWeight="600">Gemini</text>
              <text x="445" y="455" fill={`hsl(${RED} / 0.6)`} fontSize="17" fontWeight="600">Claude</text>

              <text x="155" y="250" fill={`hsl(${GOLD} / 0.7)`} fontSize="16" fontWeight="600">Notion</text>
              <text x="375" y="250" fill={`hsl(${GOLD} / 0.7)`} fontSize="16" fontWeight="600">Confluence</text>
              <text x="160" y="348" fill={`hsl(${GOLD} / 0.7)`} fontSize="16" fontWeight="600">Guru</text>
              <text x="400" y="348" fill={`hsl(${GOLD} / 0.7)`} fontSize="16" fontWeight="600">Glean</text>
            </svg>
          </div>

          <div className="flex flex-col gap-6 ml-14 max-w-[520px]">
            {[
              { ring: "AI Tools", desc: "Generate text, code, images. No organizational context. No governance.", color: RED },
              { ring: "Document / RAG Platforms", desc: "Store documents and search them. Static. Don't drive execution.", color: GOLD },
              { ring: "LIZA OS", desc: "Makes organizational knowledge executable. Governs AI usage. Learns from every interaction. Compounds over time.", color: ACCENT },
            ].map(({ ring, desc, color }) => (
              <div key={ring} className="flex gap-4">
                <div className="w-4 h-4 rounded-full mt-1.5 shrink-0" style={{ background: `hsl(${color})` }} />
                <div>
                  <p className="font-bold" style={{ fontSize: 24, color: TEXT }}>{ring}</p>
                  <p style={{ fontSize: 20, color: MUTED, lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}

            <div className="rounded-xl border p-5 mt-2"
              style={{ borderColor: `hsl(${GREEN} / 0.2)`, background: `hsl(${GREEN} / 0.04)` }}>
              <p className="font-bold mb-1" style={{ fontSize: 22, color: TEXT }}>Why this isn't another SaaS tool</p>
              <p style={{ fontSize: 19, color: MUTED, lineHeight: 1.5 }}>
                SaaS features commoditize in weeks. The knowledge graph underneath is the defensible asset.
                The longer teams use LIZA, the deeper the moat.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SlideBar />
    </div>
  );
}

// ─── Slide 07 — Team ─────────────────────────────────────────────────────────

function Slide07Team() {
  const founders = [
    { name: "István Boscha", role: "Product Vision & Capital-Efficient CEO", bio: "Founder of Aliz.ai, a Google Cloud Professional Services Partner. 15 years in AI transformation globally.", photo: istvanPhoto, initials: "IB", color: ACCENT },
    { name: "Kristóf Éger", role: "Enterprise Narrative & Go-to-Market", bio: "AI-driven business strategist, embedding AI into decision-making workflows.", photo: kristofPhoto, initials: "KÉ", color: GREEN },
    { name: "Zoltán Kauker", role: "Scalable AI Architecture & Enterprise Security", bio: "Deep-tech AI and data engineering expert, leading AI-driven decision systems.", photo: zoltanPhoto, initials: "ZK", color: GOLD },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Team" color={ACCENT} />
        <h2 className="font-bold mb-8" style={{ fontSize: 68, color: TEXT, lineHeight: 1.1 }}>
          Built by practitioners.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Not first-time founders.</span>
        </h2>

        <div className="grid grid-cols-3 gap-7 mb-10">
          {founders.map(f => (
            <div key={f.name} className="flex flex-col gap-4 rounded-2xl border p-8"
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

        <div className="grid grid-cols-2 gap-7">
          {[
            { label: "Advisory Board", desc: "Chairman of Aliz.ai (Founding CEO, EdgeCore Data Centers). VP Product at a global AEC software company (€6B group) as customer-advisor.", color: GOLD },
            { label: "Capital Efficiency", desc: "Built the entire product, marketing site, diagnostic tool, and enterprise demo pipeline with near-zero burn. Founders are operators, not pitch artists.", color: GREEN },
          ].map(({ label, desc, color }) => (
            <div key={label} className="rounded-2xl border p-8"
              style={{ borderColor: `hsl(${color} / 0.18)`, background: `hsl(${color} / 0.04)` }}>
              <p className="font-bold mb-3" style={{ fontSize: 28, color: TEXT }}>{label}</p>
              <p style={{ fontSize: 22, color: MUTED, lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={ACCENT} to={GOLD} />
    </div>
  );
}

// ─── Slide 08 — Use of Funds ─────────────────────────────────────────────────

function Slide08UseOfFunds() {
  const allocations = [
    { label: "First Paying Customers", pct: 40, amt: "€120k", desc: "Close 3–5 pilot customers via diagnostic-to-pilot funnel. Convert enterprise validation into revenue. Prove retention.", color: ACCENT },
    { label: "Product Hardening", pct: 30, amt: "€90k", desc: "Stabilize core platform. Complete SECI flywheel (after-action synthesis, smart ingestion). Production-grade deployment.", color: GREEN },
    { label: "GTM Foundation", pct: 20, amt: "€60k", desc: "Case study production. Diagnostic funnel optimization. First channel partner conversations.", color: GOLD },
    { label: "Operations", pct: 10, amt: "€30k", desc: "Legal, IP protection, EU AI Act groundwork, financial management.", color: MUTED },
  ];

  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="Use of Funds" color={ACCENT} />
        <h2 className="font-bold mb-12" style={{ fontSize: 76, color: TEXT, lineHeight: 1.1 }}>
          €300K. 12-month runway.<br />
          <span style={{ color: `hsl(${ACCENT})` }}>Proof points for Series Seed.</span>
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
              <text x="160" y="152" textAnchor="middle" fill={TEXT} fontSize="34" fontWeight="900">€300K</text>
              <text x="160" y="180" textAnchor="middle" fill={MUTED} fontSize="20">Pre-Seed</text>
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

// ─── Slide 09 — Milestones ───────────────────────────────────────────────────

function Slide09Milestones() {
  return (
    <div className="w-full h-full flex flex-col relative" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 flex flex-col h-full px-28 pt-16 pb-12">
        <Tag label="12-Month Milestones" color={GREEN} />
        <h2 className="font-bold mb-12" style={{ fontSize: 72, color: TEXT, lineHeight: 1.1 }}>
          What this €300K unlocks.<br />
          <span style={{ color: `hsl(${GREEN})` }}>Series Seed readiness.</span>
        </h2>

        <div className="grid grid-cols-3 gap-8 mb-10">
          {[
            {
              month: "Month 1–4", color: ACCENT,
              title: "First Revenue",
              milestones: [
                "Close 2–3 paying pilot customers from existing pipeline",
                "Diagnostic-to-pilot conversion funnel live",
                "First customer case study published",
              ],
              metric: "€50–80K ARR",
            },
            {
              month: "Month 5–8", color: GREEN,
              title: "Product-Market Fit Signals",
              milestones: [
                "5 paying customers across 2+ verticals",
                "Net retention >100% (teams expanding within accounts)",
                "SECI flywheel complete: after-action synthesis live",
              ],
              metric: "€120–180K ARR",
            },
            {
              month: "Month 9–12", color: GOLD,
              title: "Series Seed Ready",
              milestones: [
                "8–10 paying customers",
                "Channel partner program started",
                "AACE v3.2 spec published",
                "Raise €1–1.5M Seed with proof, not projections",
              ],
              metric: "€200–300K ARR",
            },
          ].map(({ month, color, title, milestones, metric }) => (
            <div key={month} className="rounded-2xl border p-8 flex flex-col"
              style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.04)` }}>
              <p className="font-semibold mb-1" style={{ fontSize: 20, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{month}</p>
              <p className="font-bold mb-4" style={{ fontSize: 30, color: TEXT }}>{title}</p>
              <div className="flex flex-col gap-2 flex-1 mb-6">
                {milestones.map((m, i) => (
                  <p key={i} className="flex items-start gap-2.5" style={{ fontSize: 21, color: MUTED }}>
                    <CheckCircle2 size={18} style={{ color: `hsl(${color})`, flexShrink: 0, marginTop: 3 }} /> {m}
                  </p>
                ))}
              </div>
              <div className="rounded-xl border px-5 py-4 text-center"
                style={{ borderColor: `hsl(${color} / 0.2)`, background: `hsl(${color} / 0.08)` }}>
                <p className="font-black" style={{ fontSize: 36, color: `hsl(${color})`, lineHeight: 1 }}>{metric}</p>
                <p style={{ fontSize: 16, color: MUTED }}>Target ARR</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border px-8 py-5 flex items-center gap-6"
          style={{ borderColor: `hsl(${ACCENT} / 0.2)`, background: `hsl(${ACCENT} / 0.04)` }}>
          <Shield size={32} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
          <p style={{ fontSize: 24, color: MUTED }}>
            <strong style={{ color: TEXT }}>Risk mitigation:</strong> We're not asking you to fund product development.
            The product is built. This funds the commercial proof that de-risks a larger raise.
          </p>
        </div>
      </div>
      <SlideBar from={GREEN} to={GOLD} />
    </div>
  );
}

// ─── Slide 10 — The Ask ──────────────────────────────────────────────────────

function Slide10TheAsk() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: DARK_BG }}>
      <DarkGrid />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, hsl(${ACCENT}), transparent 70%)` }} />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{ background: `radial-gradient(circle, hsl(${GREEN}), transparent 70%)` }} />

      <div className="relative z-10 w-full px-28">
        <div className="text-center mb-14">
          <DarkTag label="The Ask" color={GREEN} />
          <h2 className="font-black" style={{ fontSize: 96, color: DARK_TEXT, lineHeight: 1.0 }}>
            €300K Pre-Seed
          </h2>
          <p style={{ fontSize: 34, color: DARK_MUTED, marginTop: 16 }}>
            12-month runway &nbsp;·&nbsp; Revenue validation &nbsp;·&nbsp; Series Seed at month 12
          </p>
        </div>

        <div className="grid grid-cols-3 gap-10 mb-14">
          {[
            { label: "Structure", val: "SAFE", sub: "Standard post-money SAFE. Clean, fast, founder-friendly.", color: GREEN },
            { label: "What We Need", val: "Smart Capital", sub: "Investors who understand that the next platform company won't look like a SaaS tool.", color: ACCENT },
            { label: "What You Get", val: "Ground Floor", sub: "The management layer for AI-native organizations. Pre-revenue valuation. Maximum upside.", color: GOLD },
          ].map(({ label, val, sub, color }) => (
            <div key={label} className="rounded-2xl border p-10 flex flex-col gap-4"
              style={{ borderColor: `hsl(${color} / 0.25)`, background: `hsl(${color} / 0.08)` }}>
              <p className="font-semibold" style={{ fontSize: 22, color: `hsl(${color})`, letterSpacing: "0.1em" }}>{label}</p>
              <p className="font-black" style={{ fontSize: 44, color: DARK_TEXT, lineHeight: 1.1 }}>{val}</p>
              <p style={{ fontSize: 22, color: DARK_MUTED, lineHeight: 1.45 }}>{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border p-10 flex items-center gap-10"
          style={{ borderColor: `hsl(${ACCENT} / 0.25)`, background: `hsl(${ACCENT} / 0.06)` }}>
          <Globe size={52} style={{ color: `hsl(${ACCENT})`, flexShrink: 0 }} />
          <div>
            <p className="font-bold mb-3" style={{ fontSize: 30, color: DARK_TEXT }}>Why this is a safer long-term bet</p>
            <p style={{ fontSize: 24, color: DARK_MUTED, lineHeight: 1.55 }}>
              SaaS features commoditize. Infrastructure compounds. LIZA is not another AI tool competing for attention.
              It is the management layer that <strong style={{ color: `hsl(${ACCENT})` }}>every organization with 50+ people will need</strong> as
              AI becomes the default way teams work. You're investing in the infrastructure layer, not the tool layer.
            </p>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={ACCENT} />
    </div>
  );
}

// ─── Slides Array ────────────────────────────────────────────────────────────

const SLIDES = [
  { id: "cover", title: "Cover", component: <Slide01Cover /> },
  { id: "thesis", title: "End of SaaS", component: <Slide02Thesis /> },
  { id: "problem", title: "Problem", component: <Slide02Problem /> },
  { id: "solution", title: "Solution", component: <Slide03Solution /> },
  { id: "validation", title: "Early Validation", component: <Slide04Validation /> },
  { id: "product", title: "What's Built", component: <Slide05Product /> },
  { id: "category", title: "Category Map", component: <Slide06Category /> },
  { id: "team", title: "Team", component: <Slide07Team /> },
  { id: "funds", title: "Use of Funds", component: <Slide08UseOfFunds /> },
  { id: "milestones", title: "12-Month Plan", component: <Slide09Milestones /> },
  { id: "ask", title: "The Ask", component: <Slide10TheAsk /> },
];

// ─── Deck shell ──────────────────────────────────────────────────────────────

export default function SeedInvestorDeck() {
  const [current, setCurrent] = useState(0);
  const [showGrid, setShowGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobileViewport();
  const isPortrait = useIsPortrait();
  

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, SLIDES.length - 1)), []);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);
  const goTo = useCallback((i: number) => { setCurrent(i); setShowGrid(false); }, []);

  // Export handled by ExportMenu component

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
              style={{ background: `hsl(${ACCENT} / 0.1)`, border: `1px solid hsl(${ACCENT} / 0.3)` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`hsl(${ACCENT})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <button onClick={handleExportPdf} disabled={exporting} className="p-1.5 rounded-lg disabled:opacity-50">
            {exporting ? <Loader2 size={16} className="animate-spin" style={{ color: MUTED }} /> : <Download size={16} style={{ color: MUTED }} />}
          </button>
        </div>

        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, visibility: exporting ? 'visible' : 'hidden', pointerEvents: 'none' }}>
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA OS — Pre-Seed Deck</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GREEN} / 0.1)`, color: `hsl(${GREEN})` }}>
            Pre-Seed · {SLIDES.length} slides
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-OS-Pre-Seed-Deck" slideCount={SLIDES.length} variant="desktop" />
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

          {!showGrid && (
            <div className="flex items-center justify-between px-8 py-3 border-t shrink-0"
              style={{ borderColor: CHROME_BORDER, background: CHROME_BG }}>
              <div className="flex gap-2">
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

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, visibility: exporting ? 'visible' : 'hidden', pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
        ))}
      </div>
    </div>
  );
}
