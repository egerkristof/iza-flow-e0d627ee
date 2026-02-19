import { Link } from "react-router-dom";
import {
  Brain, Target, Zap, BookOpen, TrendingUp, CheckCircle2,
  ArrowRight, AlertTriangle, Clock, Users, Shield, BarChart3,
  Layers, Shuffle, Lock, Award, Lightbulb, FileText
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

function SectionTag({ label }: { label: string }) {
  return (
    <p className="font-bold tracking-[0.2em] uppercase mb-4 text-sm"
      style={{ color: `hsl(${PRI})` }}>{label}</p>
  );
}

function Divider() {
  return (
    <div className="w-full h-px my-2" style={{ background: `hsl(${PRI} / 0.08)` }} />
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b"
      style={{ background: "hsl(222 22% 4% / 0.95)", borderColor: "hsl(222 18% 10%)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: `hsl(${PRI})`, color: "hsl(222 22% 5%)" }}>L</div>
            <span className="font-bold text-lg tracking-tight" style={{ color: `hsl(${C})` }}>LIZA <span style={{ color: `hsl(${MUT})`, fontWeight: 400 }}>OS</span></span>
          </Link>
        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ background: `hsl(${PRI})`, color: "hsl(222 22% 5%)" }}
        >
          Book a scoping call <ArrowRight size={14} />
        </a>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden" style={{ background: BG }}>
      {/* subtle grid */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: `linear-gradient(hsl(${PRI}) 1px, transparent 1px), linear-gradient(90deg, hsl(${PRI}) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />
      {/* glow */}
      <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, hsl(${PRI} / 0.08), transparent 70%)`, transform: "translate(30%, -30%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold"
            style={{ borderColor: `hsl(${PRI} / 0.35)`, background: `hsl(${PRI} / 0.07)`, color: `hsl(${PRI})` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: `hsl(${PRI})` }} />
            AI Operating Model · Enterprise Teams
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <h1 className="font-black leading-[1.05] mb-6" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", color: `hsl(${C})` }}>
              Your teams are using AI.{" "}
              <span style={{
                background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>Nobody governs how.</span>
            </h1>
            <p className="text-lg mb-8" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
              We work with your teams to map how work actually happens — and turn it into a shared AI operating model your organisation keeps.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold"
                style={{ borderColor: `hsl(${PRI} / 0.35)`, background: `hsl(${PRI} / 0.07)`, color: `hsl(${PRI})` }}>
                <Users size={14} /> Team-level engagement
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold"
                style={{ borderColor: `hsl(${GRN} / 0.35)`, background: `hsl(${GRN} / 0.07)`, color: `hsl(${GRN})` }}>
                <FileText size={14} /> Infrastructure you keep
              </span>
            </div>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
              style={{
                background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
                color: "hsl(222 22% 5%)",
                boxShadow: `0 0 40px -8px hsl(${PRI} / 0.4)`,
              }}
            >
              Book a scoping call <ArrowRight size={20} />
            </a>
            <p className="mt-4 text-sm" style={{ color: `hsl(${MUT})` }}>30 minutes. No commitments.</p>
          </div>

          {/* Right — stats */}
          <div className="flex flex-col gap-4">
            {[
              { stat: "78%", label: "Using unapproved AI tools", col: RED },
              { stat: "14×", label: "Output variance with no shared standard", col: AMB },
              { stat: "0%", label: "Feeds back into institutional knowledge", col: PRI },
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

      {/* bottom rule */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, hsl(${PRI}), hsl(${GRN}))` }} />
    </section>
  );
}

// ─── Problem ─────────────────────────────────────────────────────────────────
function Problem() {
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag label="What's Actually Happening" />
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          AI adoption happened.{" "}
          <span style={{ color: `hsl(${RED})` }}>AI alignment didn't.</span>
        </h2>
        <p className="text-lg mb-14 max-w-3xl" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          Licences got bought. Tools got rolled out. Now every team member prompts their own way, with no shared standards, no institutional context, and no visibility for the people responsible for outcomes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Shuffle size={28} />, title: "No shared standard", desc: "Same task, wildly different outputs. Who you ask determines what you get. That's not a capability gap — it's a governance gap.", col: RED },
            { icon: <Brain size={28} />, title: "AI with no context", desc: "Your standards, methodology, brand voice, compliance requirements — none of it reaches the model. Teams get generic when they need specific.", col: AMB },
            { icon: <BarChart3 size={28} />, title: "Zero visibility", desc: "Managers can see deliverables. Not how they were made. Not what AI contributed. Not where the risk is. Oversight is blind.", col: PRI },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl p-8 border relative overflow-hidden"
              style={{ background: `hsl(${c.col} / 0.05)`, borderColor: `hsl(${c.col} / 0.22)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${c.col})` }} />
              <div className="mb-4" style={{ color: `hsl(${c.col})` }}>{c.icon}</div>
              <h3 className="font-bold mb-2 text-lg" style={{ color: `hsl(${C})` }}>{c.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: `hsl(${MUT})` }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Signals / Quotes ─────────────────────────────────────────────────────────
function Signals() {
  const quotes = [
    { q: "We all use AI, but we get completely different results for the same brief.", role: "Head of Strategy, Financial Services" },
    { q: "I've got no idea what our AI outputs are actually based on. That scares me.", role: "Chief Compliance Officer, 1,200-person firm" },
    { q: "We bought Copilot for everyone. Three months later, adoption is 20% and quality is patchy.", role: "COO, Professional Services Group" },
    { q: "My team uses AI constantly but I don't know if it's making us better or just faster at being inconsistent.", role: "Managing Director, Internal Consulting" },
  ];

  return (
    <section className="py-24" style={{ background: BG2 }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag label="Sound Familiar?" />
        <h2 className="font-black mb-4" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          These conversations are already happening in your org.
        </h2>
        <p className="text-lg mb-12 max-w-2xl" style={{ color: `hsl(${MUT})` }}>
          Everyone's using it differently — and nobody has a clear answer when the exec asks "how are we governing this?"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quotes.map((s, i) => (
            <div key={i} className="rounded-2xl p-7 border" style={{ background: BG, borderColor: `hsl(${PRI} / 0.12)` }}>
              <p className="font-semibold mb-3 text-base leading-relaxed" style={{ color: `hsl(${C})` }}>"{s.q}"</p>
              <p className="font-bold tracking-widest uppercase text-xs" style={{ color: `hsl(${PRI})` }}>{s.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Training Doesn't Work ────────────────────────────────────────────────
function WhyTraining() {
  const tried = [
    { label: "Prompt engineering courses", why: "Individual skill. No shared standard. Back to 23 different styles by Monday." },
    { label: "AI tool rollouts (Copilot, ChatGPT Teams)", why: "Access without architecture. Licences ≠ alignment." },
    { label: "Internal AI champions / CoE", why: "Siloed. Slow. Becomes a bottleneck, not a multiplier." },
    { label: "Policy documents & usage guidelines", why: "Compliance theatre. No enforcement at the point of use." },
    { label: "One-off awareness workshops", why: "Awareness without operating model. Excitement fades in 2 weeks." },
  ];

  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag label="Why Previous Efforts Didn't Stick" />
        <h2 className="font-black mb-3" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          Awareness isn't an operating model.
        </h2>
        <p className="text-lg mb-10 max-w-2xl" style={{ color: `hsl(${MUT})` }}>
          Every approach to date has built skill in individuals. None have built a shared system for teams.
        </p>

        <div className="flex flex-col gap-3 mb-8">
          {tried.map((t, i) => (
            <div key={i} className="flex items-start gap-6 px-6 py-5 rounded-xl border"
              style={{ background: BG2, borderColor: `hsl(${RED} / 0.1)` }}>
              <AlertTriangle className="shrink-0 mt-0.5" size={20} style={{ color: `hsl(${RED} / 0.55)` }} />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 flex-1">
                <p className="font-bold text-base shrink-0 sm:w-72" style={{ color: `hsl(${C})` }}>{t.label}</p>
                <p className="text-sm" style={{ color: `hsl(${MUT})` }}>→ {t.why}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-2xl border" style={{ background: `hsl(${PRI} / 0.06)`, borderColor: `hsl(${PRI} / 0.3)` }}>
          <p className="text-base" style={{ color: `hsl(${C})`, lineHeight: 1.65 }}>
            <strong style={{ color: `hsl(${PRI})` }}>The missing piece:</strong>{" "}
            A shared operating model — agreed standards, defined workflows, and the infrastructure to make them stick.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── The Programme ────────────────────────────────────────────────────────────
function TheProgramme() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: BG2 }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full"
          style={{ background: `radial-gradient(circle, hsl(${PRI} / 0.06), transparent 70%)` }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <SectionTag label="The Offer" />
        <h2 className="font-black mb-4 mx-auto" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          The AI Operating Model{" "}
          <span style={{
            background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>Programme</span>
        </h2>
        <p className="text-lg mb-14 mx-auto max-w-2xl" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          Multi-session. Embedded. We map how your teams work and turn it into a governed operating model for AI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { icon: <Target size={28} />, label: "Surface", desc: "Map real workflows — the tacit logic, judgment calls, and quality standards that live only in people's heads.", color: RED },
            { icon: <Lightbulb size={28} />, label: "Structure", desc: "Externalise what we find into agreed standards and protocols — co-authored by the people who use them.", color: PRI },
            { icon: <Zap size={28} />, label: "Embed", desc: "The model goes live in LIZA OS. Knowledge compounds. New hires onboard to a standard, not tribal habits.", color: GRN },
          ].map(({ icon, label, desc, color }, i) => (
            <div key={i} className="flex flex-col rounded-2xl border p-8 relative overflow-hidden"
              style={{ background: `hsl(${color} / 0.06)`, borderColor: `hsl(${color} / 0.25)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${color})` }} />
              <div className="mb-4" style={{ color: `hsl(${color})` }}>{icon}</div>
              <p className="font-black text-2xl mb-2" style={{ color: `hsl(${C})` }}>{label}</p>
              <p className="text-sm leading-relaxed" style={{ color: `hsl(${MUT})` }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Programme Structure ──────────────────────────────────────────────────────
function ProgrammeStructure() {
  const phases = [
    { n: "Phase 1", title: "Workflow Discovery", desc: "We embed with your teams to observe how work is done and surface the undocumented judgment calls. Make the invisible visible.", col: RED },
    { n: "Phase 2", title: "Knowledge Mapping", desc: "Structured workshops to externalise what we found — decision logic, quality standards, and operating principles articulated by the people who hold them.", col: AMB },
    { n: "Phase 3", title: "Operating Model Design", desc: "Those insights become usable artefacts: workflow protocols, AI usage standards, governance checkpoints, and a shared vocabulary.", col: PRI },
    { n: "Phase 4", title: "Embed & Activate", desc: "The model goes live in LIZA OS. Teams run protocols. Knowledge compounds. The operating model becomes how work happens — not a document.", col: GRN },
  ];

  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag label="Programme Structure" />
        <h2 className="font-black mb-14" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          Four phases. One coherent system.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {phases.map(({ n, title, desc, col }) => (
            <div key={title} className="rounded-2xl p-8 border relative overflow-hidden"
              style={{ background: `hsl(${col} / 0.05)`, borderColor: `hsl(${col} / 0.22)` }}>
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `hsl(${col})` }} />
              <p className="font-bold tracking-widest uppercase text-xs mb-3" style={{ color: `hsl(${col})` }}>{n}</p>
              <h3 className="font-black text-2xl mb-3" style={{ color: `hsl(${C})` }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: `hsl(${MUT})` }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Deliverables ─────────────────────────────────────────────────────────────
function Deliverables() {
  const items = [
    { icon: <FileText size={22} />, title: "Workflow maps", desc: "Documented maps of how work actually happens — the real sequence, decision points, and where AI fits in each.", col: PRI },
    { icon: <BookOpen size={22} />, title: "Executable protocol library", desc: "Your most critical workflows converted into structured protocols inside LIZA OS — ready to run, not just reference.", col: GRN },
    { icon: <Brain size={22} />, title: "Codified judgment layer", desc: "The heuristics, quality standards, and decision logic senior team members carry — externalised and usable by everyone.", col: PRI },
    { icon: <Shield size={22} />, title: "AI governance framework", desc: "Clarity on what's appropriate, what's risky, and who decides — with escalation paths your team actually understands.", col: GRN },
    { icon: <TrendingUp size={22} />, title: "Knowledge capture loop", desc: "A feedback mechanism so every execution makes the system smarter — learnings flow back into the operating model.", col: PRI },
    { icon: <Users size={22} />, title: "Team ownership", desc: "A model built by the people who use it. Shared language. Shared standards. Designed to outlast any individual.", col: GRN },
  ];

  return (
    <section className="py-24" style={{ background: BG2 }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag label="What You Get" />
        <h2 className="font-black mb-14" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          Not a report. A working system.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-2xl border px-6 py-6"
              style={{ background: BG, borderColor: `hsl(${item.col} / 0.2)` }}>
              <div style={{ color: `hsl(${item.col})` }}>{item.icon}</div>
              <p className="font-bold text-base" style={{ color: `hsl(${C})` }}>{item.title}</p>
              <p className="text-sm leading-relaxed" style={{ color: `hsl(${MUT})` }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Who It's For ─────────────────────────────────────────────────────────────
function WhoFor() {
  const personas = [
    { role: "Heads of Function", context: "Strategy, Operations, Finance, Legal, Marketing", fit: "You set the standards. This session operationalises them for an AI-augmented team.", col: PRI },
    { role: "COOs & Chiefs of Staff", context: "Responsible for cross-functional execution quality", fit: "You need visibility and consistency. This builds the infrastructure for both.", col: GRN },
    { role: "Managing Directors & Practice Leads", context: "Professional services, consulting, advisory divisions", fit: "Your team's judgment is the product. This session protects and scales it.", col: PRI },
    { role: "Transformation & Change Leads", context: "Running AI adoption programmes across the org", fit: "You need a model that sticks beyond the rollout. This is the missing layer.", col: GRN },
  ];

  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionTag label="Who This Is For" />
            <h2 className="font-black mb-6" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
              Managers who own the output quality{" "}
              <span style={{ color: `hsl(${PRI})` }}>of their teams.</span>
            </h2>
            <p className="text-lg" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
              This isn't a session for IT or innovation teams. It's for the people responsible for delivery quality — who need their function to operate with consistent standards, regardless of which tools their team uses.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {personas.map((item, i) => (
              <div key={i} className="rounded-2xl px-6 py-5 border"
                style={{ background: `hsl(${item.col} / 0.05)`, borderColor: `hsl(${item.col} / 0.2)` }}>
                <p className="font-bold text-base mb-0.5" style={{ color: `hsl(${C})` }}>{item.role}</p>
                <p className="text-xs mb-2 font-semibold" style={{ color: `hsl(${item.col})` }}>{item.context}</p>
                <p className="text-sm leading-relaxed" style={{ color: `hsl(${MUT})` }}>{item.fit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Before / After ───────────────────────────────────────────────────────────
function BeforeAfter() {
  const items = [
    { before: "Everyone prompts their own way", after: "Shared workflow standards across the function", icon: <Shuffle size={18} /> },
    { before: "AI operating on generic public data", after: "Context-loaded with your standards and methodology", icon: <Brain size={18} /> },
    { before: "No visibility for managers", after: "A governance model you can explain to any exec", icon: <BarChart3 size={18} /> },
    { before: "Knowledge evaporating after every session", after: "Structured capture baked into the workflow", icon: <TrendingUp size={18} /> },
    { before: "New hires take months to reach team standard", after: "Onboarding to a defined operating model, not tribal habits", icon: <Clock size={18} /> },
    { before: '"How are we governing AI?" has no clear answer', after: "A framework you own, authored by your own leads", icon: <Shield size={18} /> },
  ];

  return (
    <section className="py-24" style={{ background: BG2 }}>
      <div className="max-w-6xl mx-auto px-6">
        <SectionTag label="The Shift" />
        <h2 className="font-black mb-14" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          Structured engagement. Lasting change.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <div key={i} className="flex gap-4 items-start rounded-xl border px-6 py-5"
              style={{ background: BG, borderColor: `hsl(${PRI} / 0.1)` }}>
              <div className="shrink-0 mt-0.5" style={{ color: `hsl(${PRI})` }}>{item.icon}</div>
              <div>
                <p className="text-sm mb-1.5" style={{ color: `hsl(${RED} / 0.6)`, textDecoration: "line-through" }}>{item.before}</p>
                <p className="font-semibold text-sm flex items-center gap-2" style={{ color: `hsl(${C})` }}>
                  <CheckCircle2 size={14} style={{ color: `hsl(${GRN})`, flexShrink: 0 }} />
                  {item.after}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Us ───────────────────────────────────────────────────────────────────
function WhyUs() {
  const points = [
    { icon: <Award size={22} />, title: "Demand-first, not tool-first", desc: "We start with what your organisation actually needs, not a product demo. The operating model you build works regardless of which AI tools you use.", col: PRI },
    { icon: <Layers size={22} />, title: "Built around your context", desc: "Every engagement is tailored to your work types, your governance constraints, and your team's existing habits — not a generic template.", col: GRN },
    { icon: <Lock size={22} />, title: "Artefacts you own", desc: "Everything produced is yours. We don't lock deliverables to a platform or subscription.", col: PRI },
    { icon: <TrendingUp size={22} />, title: "Infrastructure if you want it", desc: "For teams that want to go further, LIZA OS provides the technical layer to operationalise the model at scale.", col: GRN },
  ];

  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionTag label="Why Us" />
            <h2 className="font-black mb-6" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
              We built the infrastructure{" "}
              <span style={{ color: `hsl(${PRI})` }}>this programme runs on.</span>
            </h2>
            <p className="text-lg mb-4" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
              LIZA OS is an operating system built for knowledge-intensive organisations — designed to solve inconsistent AI usage, missing institutional context, and knowledge that never gets captured.
            </p>
            <p className="text-lg" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
              We don't teach generic AI skills. We build the governance layer that makes AI work at the team level.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {points.map((item, i) => (
              <div key={i} className="flex items-start gap-5 rounded-2xl px-6 py-5 border"
                style={{ background: `hsl(${item.col} / 0.05)`, borderColor: `hsl(${item.col} / 0.2)` }}>
                <div style={{ color: `hsl(${item.col})`, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
                <div>
                  <p className="font-bold text-base mb-1" style={{ color: `hsl(${C})` }}>{item.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: `hsl(${MUT})` }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: BG2 }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(ellipse, hsl(${PRI} / 0.07), transparent 65%)` }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-8"
          style={{ borderColor: `hsl(${PRI} / 0.35)`, background: `hsl(${PRI} / 0.07)`, color: `hsl(${PRI})` }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: `hsl(${PRI})` }} />
          Start the Engagement
        </span>

        <h2 className="font-black mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", color: `hsl(${C})`, lineHeight: 1.1 }}>
          Your team's knowledge is already there.{" "}
          <span style={{
            background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
          }}>Let's build with it.</span>
        </h2>

        <p className="text-lg mb-10" style={{ color: `hsl(${MUT})`, lineHeight: 1.65 }}>
          30 minutes. We map your needs and scope the right engagement. No commitments.
        </p>

        {/* Logistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Format", value: "Multi-session, embedded" },
            { label: "Who", value: "Teams + managers" },
            { label: "Location", value: "On-site or remote" },
            { label: "Output", value: "A live system" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-1 rounded-xl border px-4 py-4"
              style={{ background: BG, borderColor: `hsl(${PRI} / 0.15)` }}>
              <p className="font-bold tracking-widest uppercase text-xs" style={{ color: `hsl(${PRI})` }}>{item.label}</p>
              <p className="font-semibold text-sm" style={{ color: `hsl(${C})` }}>{item.value}</p>
            </div>
          ))}
        </div>

        <a
          href={CAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-xl font-bold text-lg transition-opacity hover:opacity-90"
          style={{
            background: `linear-gradient(135deg, hsl(${PRI}), hsl(${GRN}))`,
            color: "hsl(222 22% 5%)",
            boxShadow: `0 0 48px -8px hsl(${PRI} / 0.45)`,
          }}
        >
          Book a scoping call
          <ArrowRight size={22} />
        </a>
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
      <Hero />
      <Problem />
      <Signals />
      <WhyTraining />
      <TheProgramme />
      <ProgrammeStructure />
      <Deliverables />
      <WhoFor />
      <BeforeAfter />
      <WhyUs />
      <CTA />
      <Footer />
    </div>
  );
}
