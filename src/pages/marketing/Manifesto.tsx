import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ArrowRight } from "lucide-react";
import { KnowledgeParadoxDiagram, SECIFlywheelDiagram } from "@/components/marketing/ManifestoDiagrams";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";

const CAL_URL = "https://calendar.app.google/3v8jevUcsgRQnLyL9";

/* ─── Typography helpers ─── */

function GradientText({ children }: { children: React.ReactNode }) {
  return <span className="brand-gradient-text">{children}</span>;
}

function Pull({ children }: { children: React.ReactNode }) {
  return (
    <ScrollReveal>
      <blockquote
        className="relative my-14 py-2 pl-0 text-center"
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-px"
          style={{ background: "hsl(var(--primary) / 0.3)" }}
        />
        <p
          className="text-2xl md:text-3xl font-black leading-snug italic px-4"
          style={{ color: "hsl(var(--foreground))" }}
        >
          {children}
        </p>
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-16 h-px"
          style={{ background: "hsl(var(--primary) / 0.3)" }}
        />
      </blockquote>
    </ScrollReveal>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <ScrollReveal>
      <h2 className="text-3xl md:text-4xl font-black mt-24 mb-8 leading-tight">{children}</h2>
    </ScrollReveal>
  );
}

function Para({ children, dropcap }: { children: React.ReactNode; dropcap?: boolean }) {
  return (
    <ScrollReveal>
      <p
        className={`text-base md:text-lg leading-[1.85] mb-6 ${dropcap ? "manifesto-dropcap" : ""}`}
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        {children}
      </p>
    </ScrollReveal>
  );
}

function Attribution({ name, year, insight }: { name: string; year: string; insight: string }) {
  return (
    <ScrollReveal delay={50}>
      <div className="flex gap-3 py-3">
        <div
          className="w-1 rounded-full flex-shrink-0"
          style={{ background: "hsl(var(--primary) / 0.3)" }}
        />
        <div>
          <span className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>
            {name}
          </span>
          <span className="text-xs ml-1.5" style={{ color: "hsl(var(--muted-foreground))" }}>
            ({year})
          </span>
          <p className="text-sm mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
            {insight}
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center my-16" aria-hidden>
      <div className="h-px w-8" style={{ background: "hsl(var(--primary) / 0.15)" }} />
      <div
        className="w-1.5 h-1.5 rounded-full mx-3"
        style={{ background: "hsl(var(--primary) / 0.3)" }}
      />
      <div className="h-px w-8" style={{ background: "hsl(var(--primary) / 0.15)" }} />
    </div>
  );
}

/* ─── Page ─── */

export default function ManifestoPage() {
  return (
    <MarketingLayout>
      {/* Dropcap CSS */}
      <style>{`
        .manifesto-dropcap::first-letter {
          float: left;
          font-size: 3.5em;
          line-height: 0.8;
          padding-right: 0.12em;
          padding-top: 0.06em;
          font-weight: 900;
          color: hsl(var(--foreground));
        }
      `}</style>

      {/* Hero */}
      <section className="relative py-32 md:py-40 px-6 text-center overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, hsl(200 90% 52% / 0.06) 0%, transparent 65%)" }}
        />
        <ScrollReveal className="relative z-10 max-w-2xl mx-auto">
          <p
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-8"
            style={{ color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.25)", background: "hsl(var(--primary) / 0.06)" }}
          >
            Our Manifesto
          </p>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.0]">
            <GradientText>The Judgment Gap</GradientText>
          </h1>
          <p className="text-lg md:text-xl" style={{ color: "hsl(var(--muted-foreground))" }}>
            On the nature of human expertise, and why it deserves infrastructure.
          </p>
        </ScrollReveal>
      </section>

      {/* Body */}
      <article className="max-w-2xl mx-auto px-6 pb-32">

        {/* --- 1. The Compression --- */}
        <Para dropcap>
          We are living through the fastest compression of expertise value in history. The frameworks, the methodologies, the strategy decks that took decades to build are now generated in seconds by anyone with a subscription to ChatGPT.
        </Para>

        <Para>
          The explicit layer, the knowledge that was written down, documented, and formalised, is now a commodity. It lives in public models trained on the entire internet. If your value proposition is the document you produce, you are already in a race you cannot win.
        </Para>

        <Pull>
          "Most AI tools make you faster at the wrong things."
        </Pull>

        <SectionDivider />

        {/* --- 2. We Know More Than We Can Say --- */}
        <SectionTitle>We Know More Than We Can Say</SectionTitle>

        <Para dropcap>
          There is a deeper layer. It is the knowledge that was never written down, because it was never possible to write it down. The pattern recognition of the senior partner who has seen two hundred deals and knows which ones won't survive the first difficult conversation. The contextual judgment of the strategist who can feel when a brief is really asking for something else entirely.
        </Para>

        <Para>
          This is tacit knowledge: the things we know but cannot articulate. It is not a deficiency to be fixed. It is the very source of human value.
        </Para>

        <Para>
          For over half a century, thinkers across disciplines have converged on the same insight:
        </Para>

        <div className="my-8 space-y-1">
          <Attribution
            name="Michael Polanyi"
            year="1966"
            insight='"We can know more than we can tell." Tacit knowledge is not a gap in documentation. It is the foundation of all expertise.'
          />
          <Attribution
            name="Hubert Dreyfus"
            year="1972-2001"
            insight="True expertise is embodied skill that resists formalisation. AI divorced from human context hits a ceiling that no amount of data can breach."
          />
          <Attribution
            name="Ben Shneiderman"
            year="2022"
            insight="Human-centered AI must amplify human capability, not replace it. The goal is not automation. It is augmentation."
          />
        </div>

        <Para>
          The question was never whether tacit knowledge matters. The question was whether we could build infrastructure worthy of it.
        </Para>

        <SectionDivider />

        {/* --- 3. What Judgment Actually Is --- */}
        <SectionTitle>What Judgment Actually Is</SectionTitle>

        <Para dropcap>
          Judgment is what happens in the gap between stimulus and response. It requires both good thinking and good character. It is our way of deciding, in the moment, considering all circumstantial factors, what is right, and what is the right next thing to do.
        </Para>

        <Para>
          Judgment cannot be reduced to optimisation. Optimisation, in its traditional sense, aims at more efficient use of existing information. Judgment aims at something fundamentally different: it creates new futures. It presupposes that we do not yet know everything we need to know, and therefore must proactively research, experiment, and discover.
        </Para>

        <Para>
          For judgment to have any meaning, it requires two components. First, <strong style={{ color: "hsl(var(--foreground))" }}>experimentation</strong>: the willingness to take risks and run scenarios, to treat the path forward as sequential but never linear. Second, a <strong style={{ color: "hsl(var(--foreground))" }}>theory of truth</strong>: a North Star that gives those experiments direction and meaning. Without the North Star, experiments are random. Without experiments, the North Star is just a wish.
        </Para>

        <Para>
          In practical terms, the North Star is what organisations have always struggled to define well: genuine goals and meaningful KPIs. Not vanity metrics. Not quarterly targets disconnected from purpose. The real commitments that tell a team where it is going and why. In an age where AI accelerates execution to unprecedented speed, getting this right matters more than ever. Without a true North Star, teams drift faster. And this is the deeper reason most AI adoption stays shallow. Without clear goals worth fighting for, people default to using AI for surface-level daily task fulfilment rather than the harder, more valuable work of building scenarios, running experiments, and synthesising new insight. The North Star is what turns AI from a productivity shortcut into a navigation instrument.
        </Para>

        <Pull>
          "Judgment doesn't aim for perfection. It aims for the North Star, through continuous experiments."
        </Pull>

        <SectionDivider />

        {/* --- 4. The Paradox of Teams --- */}
        <SectionTitle>The Paradox of Teams</SectionTitle>

        <Para dropcap>
          Here is where tacit knowledge becomes truly powerful, and truly difficult. Real knowledge creation is not a solo act. It happens in the friction between people who share a fierce, almost non-negotiable belief about the future, but who think differently about how to get there.
        </Para>

        <Para>
          Two things must coexist:
        </Para>

        <Para>
          <strong style={{ color: "hsl(var(--foreground))" }}>Unified vision.</strong> A shared conviction about where the future should go. Values that are black and white. A North Star the team would almost die for. This is exclusionary by design. It filters for alignment.
        </Para>

        <Para>
          <strong style={{ color: "hsl(var(--foreground))" }}>Diverse paths.</strong> The route to that future is never straight. It requires scenarios, sounding boards, and people who bring genuinely different perspectives. The more diverse the paths, the richer the experimentation.
        </Para>

        <Para>
          Knowledge creation happens in the friction zone between these poles. Not in documents. Not in databases. In relationships, where people rub ideas off each other, externalise what they couldn't previously articulate, and internalise new capabilities from each other.
        </Para>

        {/* Knowledge Creation Paradox Diagram */}
        <ScrollReveal>
          <KnowledgeParadoxDiagram />
        </ScrollReveal>

        <Para>
          The organisational theorist Ikujiro Nonaka described exactly this dynamic. His SECI model (Socialisation, Externalisation, Combination, Internalisation) is not academic theory. It is the description of what great teams already do. They share tacit knowledge through working together. They externalise it into shared language. They combine it into new forms. They internalise new capabilities. The loop compounds.
        </Para>

        {/* SECI Flywheel Diagram */}
        <ScrollReveal>
          <SECIFlywheelDiagram />
        </ScrollReveal>

        <SectionDivider />

        {/* --- 5. The Business Problem --- */}
        <SectionTitle>The Business Problem</SectionTitle>

        <Para dropcap>
          In most organisations, there is barely enough time to hear what people <em>are</em> saying, let alone take the time to discover what they haven't been able to articulate.
        </Para>

        <Para>
          When a senior practitioner leaves, the documentation captures the what. It never captures the why. The junior inherits the framework. They do not inherit the judgment. Decades of compounded insight evaporate.
        </Para>

        <Para>
          Most firms know this. They have tried wikis, knowledge bases, better documentation. These tools organise information. They do not transfer judgment.
        </Para>

        <Para>
          And here is the danger of the AI age: used brainlessly, AI automates the things that were said hastily, the surface layer. It makes the explicit faster. It leaves the tacit untouched. Worse, it creates the illusion that the knowledge problem has been solved, when in fact the most valuable layer has been ignored entirely.
        </Para>

        <Pull>
          "The tacit layer is your only defensible asset. And it was never designed to be captured."
        </Pull>

        <SectionDivider />

        {/* --- 6. The Opportunity --- */}
        <SectionTitle>The Opportunity</SectionTitle>

        <Para dropcap>
          AI used <em>well</em>, with governance, with structure, with a deep understanding of how teams actually create knowledge, is the first technology in history that can make it economical to express what was previously too expensive to articulate.
        </Para>

        <Para>
          For the first time, we have a technology that understands human language and can therefore help people surface what they know but haven't said. It can make it practical for a team to access more of its own knowledge, to combine it in new ways, to compound it across engagements, to transfer it without losing the nuance.
        </Para>

        <Para>
          This is not about freeing people from work. People will work just as hard, perhaps harder, because they will be able to bring forth more of themselves. This is about freeing people <em>into</em> more meaningful work: the creative freedom to give more of themselves, in service of their vision and their values.
        </Para>

        <Pull>
          "The goal is not less work. It's deeper work, at a scale that was never before possible."
        </Pull>

        <SectionDivider />

        {/* --- 7. What We Built --- */}
        <SectionTitle>What We Built</SectionTitle>

        <Para dropcap>
          LIZA OS is the infrastructure for this vision. It is built on a simple premise: expertise should be executable, not stored.
        </Para>

        <Para>
          Protocols, not documents. Structured heuristics, decision gates, and contextual cues that run inside an AI execution environment, carrying your senior judgment into every interaction, every deliverable, every engagement.
        </Para>

        <Para>
          A system designed not just to preserve what your team knows, but to create the conditions for new knowledge to emerge. Through the SECI flywheel, through structured team execution, through governance loops that ensure alignment without killing autonomy.
        </Para>

        <Para>
          Every execution is a learning event. Every learning event feeds the encoding layer. The institutional memory doesn't just persist. It grows.
        </Para>

        <SectionDivider />

        {/* --- 8. What We Believe --- */}
        <SectionTitle>What We Believe</SectionTitle>

        <Para dropcap>
          We believe only humans can innovate. The optimistic belief that we can shape the future, that we can create things that serve our purpose rather than merely optimise the status quo, is the foundation of all scientific discovery and all meaningful work.
        </Para>

        <Para>
          We believe judgment can be captured, structured, and made executable, without losing the nuance that makes it valuable.
        </Para>

        <Para>
          We believe the most valuable organisations of the next decade will not be the ones with the best AI tools. They will be the ones that figured out how to encode their expertise before the window closed.
        </Para>

        <Para>
          We believe human dignity sits at the core of every AI-driven decision. The best-run organisations won't just execute faster. They will create the conditions where their people do their best work.
        </Para>

        <Pull>
          "Turn intentions into outcomes. Create the space where human potential truly comes to life."
        </Pull>

        {/* CTA */}
        <ScrollReveal>
          <div
            className="relative mt-16 rounded-2xl p-10 border text-center overflow-hidden"
            style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--primary) / 0.2)" }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
            <h3 className="text-2xl font-black mb-4">Ready to close your Judgment Gap?</h3>
            <p className="text-sm mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
              Book a discovery call. Or explore LIZA OS.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={CAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "var(--gradient-brand-btn)",
                  color: "hsl(var(--primary-foreground))",
                  boxShadow: "0 0 24px -4px hsl(200 90% 52% / 0.4)",
                }}
              >
                Book a Discovery Call <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/platform"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-medium border"
                style={{ color: "hsl(var(--muted-foreground))", borderColor: "hsl(var(--border))" }}
              >
                Explore LIZA OS <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </article>
    </MarketingLayout>
  );
}
