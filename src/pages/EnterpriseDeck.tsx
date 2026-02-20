import { Link } from "react-router-dom";
import {
  Brain, Target, Zap, BookOpen, TrendingUp, CheckCircle2,
  ArrowRight, AlertTriangle, Clock, Users, Shield, BarChart3,
  Layers, Lock, Award, Lightbulb, FileText, Map, Compass,
  XCircle, Star, ChevronRight
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG   = "hsl(222 22% 5%)";
const BG2  = "hsl(222 18% 8%)";
const C    = "210 18% 92%";
const MUT  = "215 10% 50%";
const PRI  = "200 90% 52%";
const GRN  = "155 72% 46%";
const RED  = "0 72% 63%";
const AMB  = "38 92% 55%";

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

function SectionTag({ label, color }: { label: string; color?: string }) {
  return (
    <p className="font-bold tracking-[0.2em] uppercase mb-4 text-sm"
      style={{ color: color ? `hsl(${color})` : `hsl(${PRI})` }}>{label}</p>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b"
      style={{ background: "hsl(222 22% 4% / 0.95)", borderColor: "hsl(222 18% 10%)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{ background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`, color: "hsl(222 22% 5%)" }}>L</div>
          <span className="font-bold text-lg tracking-tight" style={{ color: `hsl(${C})` }}>LIZA <span style={{ color: `hsl(${MUT})`, fontWeight: 400 }}>OS</span></span>
        </Link>
        <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ background: `hsl(${PRI})`, color: "hsl(222 22% 5%)" }}>
          Book a scoping call <ArrowRight size={14} />
        </a>
      </div>
    </header>
  );
}

// ─── STEP 1: CHARACTER ─────────────────────────────────────────────────────────
// The hero is the customer. Name their goal clearly.
function Character() {
  return (
    <section className="relative overflow-hidden" style={{ background: BG }}>
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `linear-gradient(hsl(${PRI}) 1px, transparent 1px), linear-gradient(90deg, hsl(${PRI}) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />
      <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, hsl(${PRI} / 0.08), transparent 70%)`, transform: "translate(30%, -30%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-24">
        {/* StoryBrand label */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold"
            style={{ borderColor: `hsl(${PRI} / 0.35)`, background: `hsl(${PRI} / 0.07)`, color: `hsl(${PRI})` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: `hsl(${PRI})` }} />
            For COOs, Heads of Function & Managing Directors
          </span>
        </div>

        <div className="max-w-4xl">
          <h1 className="font-black leading-[1.05] mb-6" style={{ fontSize: "clamp(2.75rem, 5.5vw, 4.5rem)", color: `hsl(${C})` }}>
            You want your team to use AI{" "}
            <span style={{
              background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              consistently and confidently.
            </span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl" style={{ color: `hsl(${MUT})`, lineHeight: 1.7 }}>
            You're responsible for delivery quality. You want AI to make your function faster, sharper, and more consistent — not a source of invisible risk.
          </p>
          <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-9 py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
              color: "hsl(222 22% 5%)",
              boxShadow: `0 0 40px -8px hsl(${PRI} / 0.45)`,
            }}>
            Book a scoping call <ArrowRight size={20} />
          </a>
          <p className="mt-4 text-sm" style={{ color: `hsl(${MUT})` }}>30 minutes. No commitments.</p>
        </div>
      </div>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, hsl(${PRI}), hsl(${GRN}))` }} />
    </section>
  );
}

// ─── STEP 2: PROBLEM ──────────────────────────────────────────────────────────
// Villain (external), internal frustration, philosophical wrong
function Problem() {
  return (
    <section className="py-24" style={{ background: BG2 }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag label="Step 2 · The Problem" color={RED} />
        <h2 className="font-black mb-3" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          But here's what's actually happening.
        </h2>
        <p className="text-lg mb-14 max-w-2xl" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          AI adoption happened fast. Governance didn't follow. Now you're dealing with three problems at once.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              type: "External",
              title: "Uncontrolled AI usage",
              desc: "Every team member prompts differently. Same brief, wildly different outputs. No shared standard. No visibility into what the AI is drawing on.",
              col: RED,
              icon: <BarChart3 size={26} />,
            },
            {
              type: "Internal",
              title: "You feel responsible — but powerless",
              desc: "You're accountable for quality. But you can't see what AI is contributing. You don't know if your team is getting better or just faster at being inconsistent.",
              col: AMB,
              icon: <Brain size={26} />,
            },
            {
              type: "Philosophical",
              title: "This shouldn't be this hard",
              desc: "Your organisation paid for AI tools. Your team is using them. And yet, somehow, nobody can answer the question: 'How are we governing this?'",
              col: PRI,
              icon: <AlertTriangle size={26} />,
            },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl p-8 border relative overflow-hidden"
              style={{ background: `hsl(${c.col} / 0.05)`, borderColor: `hsl(${c.col} / 0.25)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${c.col})` }} />
              <p className="font-bold tracking-widest uppercase text-xs mb-3" style={{ color: `hsl(${c.col})` }}>{c.type} Problem</p>
              <div className="mb-4" style={{ color: `hsl(${c.col})` }}>{c.icon}</div>
              <h3 className="font-bold mb-2 text-lg" style={{ color: `hsl(${C})` }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: `hsl(${MUT})` }}>{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Voice-of-customer quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { q: "We all use AI, but we get completely different results for the same brief.", role: "Head of Strategy, Financial Services" },
            { q: "I've got no idea what our AI outputs are based on. That scares me.", role: "Chief Compliance Officer, 1,200-person firm" },
            { q: "We bought Copilot for everyone. Three months later, adoption is 20% and quality is patchy.", role: "COO, Professional Services Group" },
            { q: "My team uses AI constantly but I don't know if it's making us better or just faster at being inconsistent.", role: "Managing Director, Internal Consulting" },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl p-7 border" style={{ background: BG, borderColor: `hsl(${RED} / 0.12)` }}>
              <p className="font-semibold mb-3 text-base leading-relaxed" style={{ color: `hsl(${C})` }}>"{s.q}"</p>
              <p className="font-bold tracking-widest uppercase text-xs" style={{ color: `hsl(${RED})` }}>{s.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── STEP 3: GUIDE ────────────────────────────────────────────────────────────
// We are the guide. Empathy + authority. NOT the hero.
function Guide() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: BG }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(circle, hsl(${PRI} / 0.05), transparent 70%)` }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <SectionTag label="Step 3 · The Guide" color={PRI} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-black mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
              We've been here before.{" "}
              <span style={{ color: `hsl(${PRI})` }}>We built the answer.</span>
            </h2>
            <p className="text-lg mb-6" style={{ color: `hsl(${MUT})`, lineHeight: 1.7 }}>
              We understand the pressure of being accountable for outcomes in an environment where every individual is improvising their AI usage. We've worked inside those organisations.
            </p>
            <p className="text-lg mb-8" style={{ color: `hsl(${MUT})`, lineHeight: 1.7 }}>
              That's why we built LIZA OS — not as another AI tool, but as the governance infrastructure that makes AI work at the team level. And we've packaged everything we know into a structured engagement that gets your operating model built.
            </p>

            {/* Credibility signals */}
            <div className="flex flex-col gap-3">
              {[
                { label: "Built for knowledge-intensive teams", icon: <Award size={16} /> },
                { label: "Every engagement tailored to your workflows", icon: <Layers size={16} /> },
                { label: "Infrastructure you own — not locked to us", icon: <Lock size={16} /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div style={{ color: `hsl(${GRN})` }}>{item.icon}</div>
                  <p className="font-semibold text-sm" style={{ color: `hsl(${C})` }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Empathy stats */}
          <div className="flex flex-col gap-4">
            {[
              { stat: "78%", label: "of employees are using unapproved AI tools right now", col: RED },
              { stat: "14×", label: "output variance when there's no shared standard", col: AMB },
              { stat: "0%", label: "of AI sessions feed back into institutional knowledge", col: PRI },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl px-7 py-5 border flex items-center gap-6"
                style={{ background: BG2, borderColor: `hsl(${item.col} / 0.2)` }}>
                <p className="font-black shrink-0 w-24 text-right" style={{ fontSize: "2.5rem", color: `hsl(${item.col})`, lineHeight: 1 }}>{item.stat}</p>
                <div className="w-px self-stretch" style={{ background: `hsl(${item.col} / 0.2)` }} />
                <p className="font-semibold text-base" style={{ color: `hsl(${MUT})` }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STEP 4: THE PLAN ─────────────────────────────────────────────────────────
// A simple, clear 3-step plan. Remove confusion, create confidence.
function Plan() {
  const steps = [
    {
      n: "1",
      label: "Surface",
      title: "We map how your team actually works",
      steps: [
        "Embed with your teams — not to audit, but to observe",
        "Surface tacit knowledge: the shortcuts, the judgment calls, the unwritten rules",
        "Name where inconsistency lives and where AI risk is invisible",
      ],
      col: RED,
    },
    {
      n: "2",
      label: "Structure",
      title: "We turn it into a governed operating model",
      steps: [
        "Structured sessions with your senior leads to externalise expert judgment",
        "Design agreed workflow protocols and AI usage standards — co-authored by your people",
        "Build the governance layer: what's appropriate, what's risky, who decides",
      ],
      col: PRI,
    },
    {
      n: "3",
      label: "Embed",
      title: "The model goes live and compounds",
      steps: [
        "Protocols activate in LIZA OS — teams execute against shared standards",
        "Every session feeds back in. Knowledge compounds.",
        "New hires onboard to a defined standard, not tribal habits",
      ],
      col: GRN,
    },
  ];

  return (
    <section className="py-24" style={{ background: BG2 }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag label="Step 4 · The Plan" color={GRN} />
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          Here's exactly how it works.
        </h2>
        <p className="text-lg mb-14 max-w-2xl" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          Three phases. No guesswork. At the end, your team has an operating model they built and actually use.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((s, i) => (
            <div key={i} className="rounded-2xl border relative overflow-hidden flex flex-col"
              style={{ background: `hsl(${s.col} / 0.05)`, borderColor: `hsl(${s.col} / 0.25)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${s.col})` }} />
              <div className="p-8 flex-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl"
                    style={{ background: `hsl(${s.col} / 0.15)`, color: `hsl(${s.col})` }}>{s.n}</div>
                  <span className="font-bold tracking-widest uppercase text-xs" style={{ color: `hsl(${s.col})` }}>{s.label}</span>
                </div>
                <h3 className="font-black text-xl mb-5" style={{ color: `hsl(${C})` }}>{s.title}</h3>
                <ul className="flex flex-col gap-3">
                  {s.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm" style={{ color: `hsl(${MUT})` }}>
                      <ChevronRight size={14} className="shrink-0 mt-0.5" style={{ color: `hsl(${s.col})` }} />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Connector arrows */}
        <div className="hidden md:flex items-center justify-center gap-4 -mt-6 mb-8">
          <div className="flex-1 h-px" style={{ background: `hsl(${RED} / 0.25)` }} />
          <ArrowRight size={18} style={{ color: `hsl(${MUT})` }} />
          <div className="flex-1 h-px" style={{ background: `hsl(${PRI} / 0.25)` }} />
          <ArrowRight size={18} style={{ color: `hsl(${MUT})` }} />
          <div className="flex-1 h-px" style={{ background: `hsl(${GRN} / 0.25)` }} />
        </div>

        {/* What you get */}
        <div className="rounded-2xl border p-8" style={{ background: BG, borderColor: `hsl(${GRN} / 0.2)` }}>
          <p className="font-bold tracking-widest uppercase text-xs mb-5" style={{ color: `hsl(${GRN})` }}>What you walk away with</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <Map size={18} />, label: "Workflow maps of how work actually happens" },
              { icon: <BookOpen size={18} />, label: "Executable protocol library inside LIZA OS" },
              { icon: <Brain size={18} />, label: "Codified judgment layer from your senior leads" },
              { icon: <Shield size={18} />, label: "AI governance framework your execs can explain" },
              { icon: <TrendingUp size={18} />, label: "A knowledge capture loop that compounds" },
              { icon: <Users size={18} />, label: "A model built by the people who use it" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div style={{ color: `hsl(${GRN})`, flexShrink: 0 }}>{item.icon}</div>
                <p className="font-semibold text-sm" style={{ color: `hsl(${C})` }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STEP 5: CALL TO ACTION ───────────────────────────────────────────────────
// Direct + transitional CTA
function CallToAction() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: BG }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] rounded-full"
          style={{ background: `radial-gradient(ellipse, hsl(${PRI} / 0.07), transparent 65%)` }} />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <SectionTag label="Step 5 · Take Action" color={PRI} />
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          Ready to build your operating model?
        </h2>
        <p className="text-lg mb-10" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          Start with a 30-minute scoping call. We map your situation, understand your team's workflows, and scope the right engagement. No pitch deck. No commitments.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
              color: "hsl(222 22% 5%)",
              boxShadow: `0 0 40px -10px hsl(${PRI} / 0.5)`,
            }}>
            Book a scoping call <ArrowRight size={20} />
          </a>
        </div>
        <p className="text-sm" style={{ color: `hsl(${MUT})` }}>Or keep reading to see what's at stake.</p>
      </div>
    </section>
  );
}

// ─── STEP 6: AVOID FAILURE ────────────────────────────────────────────────────
// Paint a clear picture of what happens if they don't act
function AvoidFailure() {
  const risks = [
    { label: "AI inconsistency becomes a compliance liability", icon: <Shield size={20} />, col: RED },
    { label: "Your best people carry knowledge that evaporates when they leave", icon: <Users size={20} />, col: RED },
    { label: "Competitors who govern AI well start outperforming you structurally", icon: <TrendingUp size={20} />, col: AMB },
    { label: "AI tools get banned or restricted after an embarrassing incident", icon: <Lock size={20} />, col: RED },
    { label: "You remain unable to answer the exec's question: 'How are we governing this?'", icon: <AlertTriangle size={20} />, col: AMB },
    { label: "Every new AI tool rollout hits the same wall — adoption without alignment", icon: <Layers size={20} />, col: RED },
  ];

  return (
    <section className="py-24" style={{ background: BG2 }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag label="Step 6 · What's at Stake" color={RED} />
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          What happens if nothing changes.
        </h2>
        <p className="text-lg mb-12 max-w-2xl" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          Ungoverned AI doesn't stay still. The gap between your best and worst performers widens. The risk compounds quietly — until it doesn't.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {risks.map((item, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border px-6 py-5"
              style={{ background: BG, borderColor: `hsl(${item.col} / 0.15)` }}>
              <XCircle size={18} className="shrink-0" style={{ color: `hsl(${item.col} / 0.65)` }} />
              <p className="font-semibold text-sm" style={{ color: `hsl(${C} / 0.85)` }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* Previous failed attempts */}
        <div className="rounded-2xl border p-8" style={{ background: `hsl(${RED} / 0.04)`, borderColor: `hsl(${RED} / 0.18)` }}>
          <p className="font-bold tracking-widest uppercase text-xs mb-5" style={{ color: `hsl(${RED})` }}>Why other approaches haven't worked</p>
          <div className="flex flex-col gap-3">
            {[
              { label: "Prompt engineering courses", why: "Individual skill. No shared standard. Back to 23 different styles by Monday." },
              { label: "AI tool rollouts (Copilot, ChatGPT Teams)", why: "Access without architecture. Licences ≠ alignment." },
              { label: "Internal AI champions / CoE", why: "Siloed. Slow. Becomes a bottleneck, not a multiplier." },
              { label: "Policy documents & usage guidelines", why: "Compliance theatre. No enforcement at the point of use." },
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-5 py-3 border-b last:border-0"
                style={{ borderColor: `hsl(${RED} / 0.1)` }}>
                <AlertTriangle className="shrink-0 mt-0.5" size={16} style={{ color: `hsl(${RED} / 0.5)` }} />
                <div className="flex flex-col sm:flex-row sm:gap-6 flex-1">
                  <p className="font-bold text-sm shrink-0 sm:w-64" style={{ color: `hsl(${C})` }}>{t.label}</p>
                  <p className="text-sm" style={{ color: `hsl(${MUT})` }}>→ {t.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STEP 7: SUCCESS ──────────────────────────────────────────────────────────
// Paint a vivid picture of the transformation
function Success() {
  const after = [
    { before: "Everyone prompts their own way", after: "Shared workflow standards across the function" },
    { before: "AI operating on generic public data", after: "Context-loaded with your standards and methodology" },
    { before: "No visibility for managers", after: "A governance model you can explain to any exec" },
    { before: "Knowledge evaporating after every session", after: "Structured capture baked into the workflow" },
    { before: "New hires take months to reach standard", after: "Onboarding to a defined operating model, not tribal habits" },
    { before: '"How are we governing AI?" has no clear answer', after: "A framework your team owns, authored by your own leads" },
  ];

  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag label="Step 7 · The Success State" color={GRN} />
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          Here's what your function looks like{" "}
          <span style={{ color: `hsl(${GRN})` }}>on the other side.</span>
        </h2>
        <p className="text-lg mb-14 max-w-2xl" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          Not a better-trained team. A structurally different one. A function that gets more consistent and more capable with every use — regardless of which AI tools come next.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {after.map((item, i) => (
            <div key={i} className="flex gap-4 items-start rounded-xl border px-6 py-5"
              style={{ background: BG2, borderColor: `hsl(${GRN} / 0.1)` }}>
              <div className="flex flex-col gap-2 flex-1">
                <p className="text-sm" style={{ color: `hsl(${RED} / 0.55)`, textDecoration: "line-through" }}>{item.before}</p>
                <p className="font-semibold text-sm flex items-center gap-2" style={{ color: `hsl(${C})` }}>
                  <CheckCircle2 size={14} style={{ color: `hsl(${GRN})`, flexShrink: 0 }} />
                  {item.after}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Who it's for */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div>
            <p className="font-bold tracking-widest uppercase text-xs mb-4" style={{ color: `hsl(${PRI})` }}>This is for you if you are…</p>
            <div className="flex flex-col gap-3">
              {[
                { role: "Head of Function", context: "Strategy, Operations, Finance, Legal, Marketing — you set the standards. This operationalises them." },
                { role: "COO or Chief of Staff", context: "Responsible for cross-functional execution quality. This builds the infrastructure for consistency and visibility." },
                { role: "Managing Director or Practice Lead", context: "Your team's judgment is the product. This protects and scales it." },
                { role: "Transformation or Change Lead", context: "Running AI adoption programmes across the org. This is the governance layer that makes them stick." },
              ].map((item, i) => (
                <div key={i} className="rounded-xl px-5 py-4 border"
                  style={{ background: BG2, borderColor: `hsl(${PRI} / 0.12)` }}>
                  <p className="font-bold text-sm mb-1" style={{ color: `hsl(${C})` }}>{item.role}</p>
                  <p className="text-sm leading-relaxed" style={{ color: `hsl(${MUT})` }}>{item.context}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA block */}
          <div className="rounded-2xl border p-10 flex flex-col items-center text-center relative overflow-hidden"
            style={{ background: `hsl(${PRI} / 0.06)`, borderColor: `hsl(${PRI} / 0.3)` }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${PRI} / 0.1), transparent 60%)` }} />
            <div className="relative z-10">
              <Star size={32} className="mx-auto mb-4" style={{ color: `hsl(${PRI})` }} />
              <h3 className="font-black text-2xl mb-3" style={{ color: `hsl(${C})`, lineHeight: 1.1 }}>
                Your team's knowledge is already there.{" "}
                <span style={{ color: `hsl(${PRI})` }}>Let's build with it.</span>
              </h3>
              <p className="text-base mb-8" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
                30 minutes. We scope the right engagement for your team's size and complexity.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8 text-left">
                {[
                  { label: "Format", value: "Multi-session, embedded" },
                  { label: "Who", value: "Teams + managers" },
                  { label: "Location", value: "On-site or remote" },
                  { label: "Output", value: "A live operating system" },
                ].map((item, i) => (
                  <div key={i} className="rounded-lg border px-3 py-3"
                    style={{ background: BG, borderColor: `hsl(${PRI} / 0.15)` }}>
                    <p className="font-bold tracking-widest uppercase text-[10px]" style={{ color: `hsl(${PRI})` }}>{item.label}</p>
                    <p className="font-semibold text-sm mt-0.5" style={{ color: `hsl(${C})` }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base transition-opacity hover:opacity-90 w-full justify-center"
                style={{
                  background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
                  color: "hsl(222 22% 5%)",
                  boxShadow: `0 0 32px -8px hsl(${PRI} / 0.4)`,
                }}>
                Book a scoping call <ArrowRight size={18} />
              </a>
              <p className="text-xs mt-3" style={{ color: `hsl(${MUT})` }}>No commitments. No pitch deck.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 border-t" style={{ background: BG, borderColor: "hsl(222 18% 10%)" }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-black tracking-widest text-sm" style={{ color: `hsl(${PRI})` }}>LIZA OS</span>
        <p className="text-xs" style={{ color: `hsl(${MUT})` }}>AI Operating Model Programme · Enterprise</p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EnterpriseDeck() {
  return (
    <div style={{ background: BG }}>
      <Nav />
      <Character />
      <Problem />
      <Guide />
      <Plan />
      <CallToAction />
      <AvoidFailure />
      <Success />
      <Footer />
    </div>
  );
}
