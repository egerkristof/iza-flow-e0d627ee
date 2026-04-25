import { Link } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { motion } from "framer-motion";

/**
 * /space-brief — Mobile-first one-page summary of the Space Strategic Deck.
 * Designed to be opened on a phone by a CEO with 30 seconds. Single CTA
 * deep-links into the full deck at /space.
 *
 * Visual system mirrors SpaceDeck: white background, near-black ink,
 * teal accent, generous whitespace, editorial typography.
 */

const TEAL = "174 97% 28%";
const MINT = "160 96% 39%";

const loop = [
  { step: "Encode", desc: "Turn procedures into executable checks." },
  { step: "Govern", desc: "Gate AI outputs against standards." },
  { step: "Execute", desc: "Automate tasks within governed bounds." },
  { step: "Evolve", desc: "Learn from builds. Update knowledge." },
];

const proofs = [
  { label: "Standards Lock", claim: "Encodes ECSS and MAIT as automated gates." },
  { label: "Hallucination Guard", claim: "Instruction gates prevent AI making things up." },
  { label: "Heritage Capture", claim: "Bottles senior judgment for repeatable builds." },
];

export default function SpaceBrief() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b border-border">
        <div className="mx-auto max-w-3xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="block w-7 h-1 rounded-full" style={{ background: `hsl(${TEAL})` }} />
            <span className="font-bold tracking-tight text-sm">LIZA OS</span>
          </div>
          <span className="text-[11px] tracking-widest uppercase text-muted-foreground">
            Space · Brief
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pt-10 pb-32">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase mb-5"
          style={{ color: `hsl(${TEAL})` }}
        >
          Mission Memory for Space
        </motion.p>

        {/* Hero */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="font-black tracking-tight leading-[1.02] text-[40px] sm:text-6xl"
        >
          Stop rework.<br />
          Ship missions <span className="whitespace-nowrap">AI cannot derail.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="mt-5 text-lg sm:text-xl font-bold"
          style={{ color: `hsl(${TEAL})` }}
        >
          The Mission Memory Layer for AI-Native Space.
        </motion.p>

        {/* Hero stat + stakes */}
        <section className="mt-10 grid gap-4 sm:grid-cols-5">
          <div className="sm:col-span-2 rounded-2xl bg-muted/50 p-6">
            <div
              className="text-6xl sm:text-7xl font-black leading-none"
              style={{ color: `hsl(${TEAL})` }}
            >
              40%
            </div>
            <p className="mt-3 text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
              Productivity lost to rework
            </p>
            <p className="mt-1 text-[11px] italic text-muted-foreground/80">
              Source: LIZA OS field engagements
            </p>
          </div>

          <div className="sm:col-span-3 rounded-2xl border border-border p-6 grid grid-cols-2 gap-5">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/80 mb-1.5">
                Today
              </p>
              <p className="font-bold text-base">Best Effort AI</p>
              <p className="mt-1 text-sm text-muted-foreground leading-snug">
                Copilots guess. Standards drift. Rework soars.
              </p>
            </div>
            <div>
              <p
                className="text-[10px] font-bold tracking-widest uppercase mb-1.5"
                style={{ color: `hsl(${TEAL})` }}
              >
                With LIZA OS
              </p>
              <p className="font-bold text-base" style={{ color: `hsl(${TEAL})` }}>
                Instruction Layer
              </p>
              <p className="mt-1 text-sm text-muted-foreground leading-snug">
                LIZA OS executes only compliant, proven instructions.
              </p>
            </div>
          </div>
        </section>

        {/* Loop */}
        <section className="mt-12">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
            The Loop
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {loop.map((s, i) => (
              <div key={s.step} className="rounded-xl border border-border p-4">
                <p className="text-xs font-bold mb-1" style={{ color: `hsl(${TEAL})` }}>
                  0{i + 1}
                </p>
                <p className="font-bold text-base">{s.step}</p>
                <p className="mt-1 text-xs text-muted-foreground leading-snug">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Proof points */}
        <section className="mt-12">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
            Why It Works
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {proofs.map((p) => (
              <div key={p.label}>
                <div className="w-6 h-0.5 mb-3" style={{ background: `hsl(${TEAL})` }} />
                <p className="font-bold text-sm tracking-wide uppercase">{p.label}</p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.claim}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pilot */}
        <section
          className="mt-12 rounded-2xl border-2 p-6"
          style={{ borderColor: `hsl(${TEAL})`, background: `hsl(${MINT} / 0.06)` }}
        >
          <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: `hsl(${TEAL})` }}>
            30-Day MAIT Pilot
          </p>
          <p className="font-black text-2xl sm:text-3xl tracking-tight">
            Codify · Govern · Prove
          </p>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-snug">
            Quantified rework reduction and a governed MAIT thread you can audit.
          </p>
        </section>

        {/* Ask */}
        <section className="mt-12">
          <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-4">
            The Ask
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-foreground text-background p-6">
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: `hsl(${MINT})` }}>
                Door 1
              </p>
              <p className="font-bold text-lg">Pilot Customer</p>
              <p className="mt-2 text-sm opacity-80 leading-snug">
                Run MAIT with LIZA OS. Pay only if proven.
              </p>
            </div>
            <div
              className="rounded-2xl p-6 text-white"
              style={{ background: `hsl(${TEAL})` }}
            >
              <p className="text-[10px] font-bold tracking-widest uppercase mb-2 text-white/70">
                Door 2
              </p>
              <p className="font-bold text-lg">Sovereign Partner</p>
              <p className="mt-2 text-sm text-white/85 leading-snug">
                Take a strategic stake. Anchor governance for national missions.
              </p>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="mt-14">
          <Link
            to="/space"
            className="group flex items-center justify-between gap-4 rounded-2xl px-6 py-5 font-bold text-lg transition-all hover:opacity-95 hover:translate-y-[-1px]"
            style={{ background: `hsl(${TEAL})`, color: "white" }}
          >
            <span>View the full deck</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <a
            href="/downloads/liza-os-space-onepager.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-between gap-4 rounded-2xl border-2 border-border px-6 py-4 font-bold text-base text-foreground hover:border-foreground/40 transition-colors"
          >
            <span>Download one-pager (PDF)</span>
            <Download className="w-5 h-5" />
          </a>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="font-bold text-foreground">Governed AI for Space Missions</span>
          <span>lizaos.ai/space</span>
        </footer>
      </main>
    </div>
  );
}
