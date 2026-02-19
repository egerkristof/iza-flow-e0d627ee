import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { ArrowRight } from "lucide-react";

const CAL_URL = "https://cal.com/lizaos/discovery";

function GradientText({ children }: { children: React.ReactNode }) {
  return <span className="brand-gradient-text">{children}</span>;
}

function Pull({ children }: { children: React.ReactNode }) {
  return (
    <blockquote
      className="relative pl-6 my-10 text-xl font-semibold leading-relaxed"
      style={{ borderLeft: "3px solid hsl(var(--primary))", color: "hsl(var(--foreground))" }}
    >
      {children}
    </blockquote>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl md:text-4xl font-black mt-20 mb-6 leading-tight">{children}</h2>;
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base md:text-lg leading-relaxed mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
      {children}
    </p>
  );
}

export default function ManifestoPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative py-32 px-6 text-center overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, hsl(200 90% 52% / 0.06) 0%, transparent 65%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p
            className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-8"
            style={{ color: "hsl(var(--primary))", borderColor: "hsl(var(--primary) / 0.25)", background: "hsl(var(--primary) / 0.06)" }}
          >
            Our Manifesto
          </p>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-[1.0]">
            <GradientText>The Judgment Gap</GradientText>
          </h1>
          <p className="text-lg" style={{ color: "hsl(var(--muted-foreground))" }}>
            Why the knowledge economy needs a new kind of infrastructure.
          </p>
        </div>
      </section>

      {/* Body */}
      <article className="max-w-2xl mx-auto px-6 pb-32">
        <P>
          We are living through the fastest compression of expertise value in history. The tools that took decades to build — the frameworks, the methodologies, the strategy decks — are now generated in seconds by anyone with a subscription to ChatGPT.
        </P>

        <P>
          If your value proposition is the document you produce, you're already in a race you can't win.
        </P>

        <Pull>
          "Most AI tools make you faster at the wrong things."
        </Pull>

        <H2>What AI Already Has</H2>

        <P>
          Every knowledge worker in your space is loading the same things into their AI: their SOPs, their frameworks, their playbooks. The explicit layer — the knowledge that was written down, documented, and formalised — is now a commodity. It lives in public models trained on the entire internet.
        </P>

        <P>
          This is what we call the Explicit Layer. It's valuable. It's organisable. It's also exactly what your competitors have too.
        </P>

        <H2>What AI Can't Copy</H2>

        <P>
          There is a second layer. It's the knowledge that was never written down.
        </P>

        <P>
          The pattern recognition of a senior partner who's seen 200 deals and knows which ones don't survive the first difficult conversation. The contextual judgment of the strategist who can feel when a client's brief is really asking for something else entirely. The heuristics of the practitioner who knows the three signals that always appear before a project goes off the rails.
        </P>

        <P>
          This is what we call the Tacit Layer. It's the reason clients pay senior rates. It's the reason firms can't be easily replicated. It's your moat.
        </P>

        <Pull>
          "The tacit layer is your only defensible asset. And it was never designed to be captured."
        </Pull>

        <H2>The Institutional Memory Crisis</H2>

        <P>
          Here's what makes this urgent: the tacit layer walks out the door.
        </P>

        <P>
          Every time a senior practitioner leaves — retires, moves on, burns out — decades of compounded judgment evaporates. The documentation they leave behind captures the what. It never captures the why. The junior who inherits their desk gets the framework. They don't get the wisdom.
        </P>

        <P>
          Most firms have experienced this. They know it's a problem. They've tried to solve it with knowledge bases, wikis, better documentation. These tools organise information. They don't transfer judgment.
        </P>

        <H2>The New Infrastructure</H2>

        <P>
          We built LIZA OS because we believe the knowledge economy needs a different kind of infrastructure — one designed not for storing information, but for making expertise executable.
        </P>

        <P>
          The distinction matters. Information answers "what." Executable expertise answers "what to do next, given these specific conditions, knowing what we know."
        </P>

        <P>
          That's a protocol, not a document. It's a structured set of heuristics, decision gates, and contextual cues that run inside an AI execution environment — carrying your senior judgment into every interaction, every deliverable, every client engagement.
        </P>

        <Pull>
          "Judgment isn't lost when people leave. It's lost because we never built the infrastructure to capture it."
        </Pull>

        <H2>The SECI Flywheel</H2>

        <P>
          The Japanese organisational theorist Ikujiro Nonaka described four modes of knowledge creation: Socialisation, Externalisation, Combination, and Internalisation — the SECI model. The insight was simple: organisations that learn don't just store knowledge. They convert it.
        </P>

        <P>
          Tacit knowledge becomes explicit. Explicit knowledge gets combined into new forms. New forms get internalised and create new tacit knowledge. The loop compounds.
        </P>

        <P>
          LIZA OS is built on this principle. Every execution is a learning event. Every learning event feeds the encoding layer. The system gets smarter every time your team uses it. The institutional memory doesn't just persist — it grows.
        </P>

        <H2>What We Believe</H2>

        <P>
          We believe the most valuable firms of the next decade won't be the ones with the best AI tools. They'll be the ones that figured out how to encode their expertise before the window closed.
        </P>

        <P>
          We believe judgment can be captured, structured, and made executable — without losing the nuance that makes it valuable.
        </P>

        <P>
          We believe the tacit layer is not a bug in knowledge management. It's the feature. It's the moat. And it deserves infrastructure worthy of its value.
        </P>

        <Pull>
          "Turn judgment into infrastructure. That's the mandate."
        </Pull>

        {/* CTA */}
        <div
          className="relative mt-16 rounded-2xl p-10 border text-center overflow-hidden"
          style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--primary) / 0.2)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "var(--gradient-brand)" }} />
          <h3 className="text-2xl font-black mb-4">Ready to close your Judgment Gap?</h3>
          <p className="text-sm mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
            Start with a 30-minute discovery call — or explore the platform.
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
      </article>
    </MarketingLayout>
  );
}
