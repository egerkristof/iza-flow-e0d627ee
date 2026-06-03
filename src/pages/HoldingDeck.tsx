import { ArrowRight, Factory, Layers, Library, Compass, Building2, ShieldCheck, Workflow, HelpCircle, AlertTriangle } from "lucide-react";

// ─── Tokens ──────────────────────────────────────────────────────────────────
const BG = "hsl(0 0% 100%)";
const TEXT = "hsl(222 20% 10%)";
const MUTED = "hsl(215 15% 38%)";
const SUBTLE = "hsl(215 10% 56%)";
const CARD = "hsl(220 15% 97%)";
const BORDER = "hsl(220 12% 88%)";
const ACCENT = "hsl(200 90% 38%)";
const GREEN = "hsl(155 72% 34%)";
const GOLD = "hsl(45 95% 38%)";
const RED = "hsl(0 72% 46%)";
const PURPLE = "hsl(265 60% 48%)";

const SERIF = "'Instrument Serif', Georgia, serif";
const SANS = "'Inter', system-ui, sans-serif";
const MONO = "'JetBrains Mono', monospace";

// ─── Chrome ──────────────────────────────────────────────────────────────────
function Badges() {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", padding: "5px 12px", borderRadius: 4, background: "hsl(45 95% 42% / 0.15)", color: "hsl(38 90% 24%)", border: "1.5px solid hsl(45 95% 42% / 0.55)" }}>DRAFT</span>
      <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", padding: "5px 12px", borderRadius: 4, background: "hsl(0 72% 50% / 0.12)", color: "hsl(0 72% 34%)", border: "1.5px solid hsl(0 72% 50% / 0.55)" }}>COUNCIL ONLY</span>
      <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 800, letterSpacing: "0.18em", padding: "5px 12px", borderRadius: 4, background: "hsl(265 60% 52% / 0.12)", color: "hsl(265 60% 36%)", border: "1.5px solid hsl(265 60% 52% / 0.55)" }}>v0.1</span>
    </div>
  );
}

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
      <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: SUBTLE, letterSpacing: "0.22em" }}>{n}</span>
      <span style={{ height: 1, flex: 1, background: BORDER }} />
      <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, color: SUBTLE, letterSpacing: "0.22em" }}>{label}</span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: SERIF, fontSize: 56, lineHeight: 1.05, letterSpacing: "-0.02em", color: TEXT, margin: "0 0 22px 0", fontWeight: 400 }}>{children}</h2>;
}
function Lead({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: SANS, fontSize: 22, lineHeight: 1.45, color: MUTED, maxWidth: 880, margin: "0 0 22px 0" }}>{children}</p>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.6, color: TEXT, maxWidth: 880, margin: "0 0 16px 0" }}>{children}</p>;
}
function Card({ icon, title, body, accent = ACCENT }: { icon?: React.ReactNode; title: string; body: React.ReactNode; accent?: string }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${accent}`, borderRadius: 10, padding: "22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        {icon && <span style={{ color: accent }}>{icon}</span>}
        <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 700, color: TEXT, letterSpacing: "-0.01em" }}>{title}</div>
      </div>
      <div style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.55, color: MUTED }}>{body}</div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HoldingDeck() {
  return (
    <div style={{ background: BG, minHeight: "100vh", color: TEXT }}>
      {/* Sticky header */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "hsl(0 0% 100% / 0.92)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: SUBTLE }}>LIZA GROUP · HOLDING THESIS</div>
          <Badges />
        </div>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 32px 120px" }}>

        {/* COVER */}
        <section style={{ padding: "40px 0 80px", borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.22em", color: SUBTLE, marginBottom: 28 }}>A WORKING BRIEF FOR THE EXPERT COUNCIL</div>
          <h1 style={{ fontFamily: SERIF, fontSize: 96, lineHeight: 1.0, letterSpacing: "-0.035em", margin: "0 0 28px 0", fontWeight: 400 }}>
            The compounding instantiation machine.
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 26, lineHeight: 1.4, color: MUTED, maxWidth: 880, margin: 0 }}>
            LIZA is a foundry that manufactures one primitive — <em style={{ color: TEXT, fontStyle: "italic" }}>governed just-in-time operator moments</em> — and rents it to whoever needs an instantiation. Every instantiation makes the foundry sharper. This brief asks the council whether that is the right way to read what we are building.
          </p>
          <div style={{ marginTop: 40, fontFamily: MONO, fontSize: 12, color: SUBTLE }}>Prepared for: the LIZA Group expert council · v0.1 · For discussion, not commitment.</div>
        </section>

        {/* 01 · WHY WE ARE ASKING */}
        <section style={{ padding: "80px 0" }}>
          <SectionLabel n="01" label="WHY WE ARE ASKING" />
          <H2>The B2B thesis is funded by one logic. A second logic is showing up uninvited.</H2>
          <Lead>
            Our current investor narrative says: LIZA is the operating system for AI-native organizations. We sell the foundry to enterprises. That story is intact, fundable, and where the round goes.
          </Lead>
          <P>
            But every time we talk to a market that <em>can't</em> buy the foundry directly — a real estate agency, a small brokerage, an aesthetic clinic — the same shape appears. The buyer doesn't want a platform. They want one thing: the right next action, with full governance around it, delivered at the moment a decision is being made. They will pay for that as a service, a subscription, a per-deal fee, a per-lead fee — whatever fits their economics.
          </P>
          <P>
            That is not a separate company. That is the same primitive, instantiated downstream. The question we need the council to help us answer is whether we should name that pattern now, design for it now, and decide consciously when to launch the first speedboat — or keep ignoring it until the B2B round closes.
          </P>
        </section>

        {/* 02 · THE PRIMITIVE */}
        <section style={{ padding: "80px 0", borderTop: `1px solid ${BORDER}` }}>
          <SectionLabel n="02" label="THE PRIMITIVE" />
          <H2>Governed just-in-time operator moments.</H2>
          <Lead>
            The unit of value LIZA produces is not "the right knowledge". It is the right knowledge delivered to the right operator at the exact moment of decision, with the full governance envelope already wrapped around it.
          </Lead>
          <P>
            "Governance envelope" is the part that gets dropped when people describe what we do. It is what separates a chatbot from an operating system. It includes at least:
          </P>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "20px 0 28px" }}>
            <Card icon={<Workflow size={18} />} title="The knowledge itself" accent={ACCENT} body="Tied to a standard, a workflow step, a customer record. Not generic. Versioned." />
            <Card icon={<ShieldCheck size={18} />} title="Data governance" accent={GREEN} body="Who can see this, where it can leave to, what is redacted, what is logged. Decided before the prompt." />
            <Card icon={<Layers size={18} />} title="Token / cost efficiency" accent={GOLD} body="Only the slice that matters reaches the model. Every call carries a budget and a P&L line." />
            <Card icon={<Compass size={18} />} title="Lineage and receipts" accent={PURPLE} body="Why this answer, from which source, under which standard, signed by which operator." />
          </div>
          <P>
            <strong>This matters for the investor deck too.</strong> "Right knowledge at the right moment" sounds like RAG. <em>Governed</em> just-in-time operator moments is the actual product, and it is what makes the B2B story defensible. The primitive belongs on the investor deck — the speedboats do not, yet.
          </P>
        </section>

        {/* 03 · THE FOUNDRY */}
        <section style={{ padding: "80px 0", borderTop: `1px solid ${BORDER}` }}>
          <SectionLabel n="03" label="THE FOUNDRY" />
          <H2>The B2B platform manufactures the primitive at industrial scale.</H2>
          <Lead>
            Everything we are building inside enterprises — AACE, the context layer, the governance loop, value-based metering, the standards corpus — exists to produce that one primitive, repeatedly, in production, with receipts.
          </Lead>
          <P>
            Inside a regulated enterprise, the foundry runs against high-stakes workflows: a deviation closing in pharma, a bid going out in space, an underwriting decision in insurance. Each governed moment carries a clear P&L value (€23 of displaced labour, an avoided rework, a faster cycle), which is why enterprises pay platform fees.
          </P>
          <P>
            The foundry is a real business. It is the round we are raising. Nothing about the speedboat thesis changes that.
          </P>
        </section>

        {/* 04 · THE SPEEDBOATS */}
        <section style={{ padding: "80px 0", borderTop: `1px solid ${BORDER}` }}>
          <SectionLabel n="04" label="THE SPEEDBOATS" />
          <H2>Same primitive. Different market shape.</H2>
          <Lead>
            A speedboat is not a new company. It is an instantiation of the same primitive in a market where the buyer can't or won't buy the foundry directly.
          </Lead>
          <P>
            A real estate agent will never buy LIZA OS. They will buy "the system that tells me which dormant buyer to call this morning, what to say, and why, with the brokerage's compliance rules already baked in." Same primitive. Different wrapper. Different price tag. Different distribution.
          </P>
          <P>
            Every speedboat does two things:
          </P>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "16px 0 8px" }}>
            <Card icon={<Factory size={18} />} title="It monetizes the primitive downstream" accent={GREEN} body="In a market the enterprise sales motion can't reach. Operator-level ARPU, subscription or per-deal." />
            <Card icon={<Library size={18} />} title="It teaches the foundry a new shape" accent={ACCENT} body="What 'governed operator moment' looks like in that vertical: triggers, data flows, decision rhythm, regulatory drag." />
          </div>
        </section>

        {/* 05 · THE COMPOUNDING LIBRARY */}
        <section style={{ padding: "80px 0", borderTop: `1px solid ${BORDER}` }}>
          <SectionLabel n="05" label="THE COMPOUNDING LIBRARY" />
          <H2>The world's largest library of just-in-time operator moments.</H2>
          <Lead>
            This is the concept behind the concept. LIZA's long-term defensibility is not the platform, not the metering, not the standards engine. It is the cross-vertical pattern library of <em>decision × operator × context × trigger</em>, instantiated under governance, with receipts.
          </Lead>
          <P>
            Speedboat N+1 is cheaper, faster, and more accurate than speedboat N — not because of process, but because the underlying engine has learned the shape of "tacit knowledge meets operator moment" across more surfaces. The B2B platform discovers these patterns inside enterprises. The speedboats discover them in markets enterprises can't serve. The library compounds across both.
          </P>
          <P>
            In one sentence: <strong>LIZA is building the world's largest library of just-in-time operator moments, and renting it to whoever needs an instantiation.</strong>
          </P>
        </section>

        {/* 06 · WORKED EXAMPLE */}
        <section style={{ padding: "80px 0", borderTop: `1px solid ${BORDER}` }}>
          <SectionLabel n="06" label="WORKED EXAMPLE · REAL ESTATE" />
          <H2>Dormant-buyer reactivation, as the first speedboat.</H2>
          <Lead>
            From the November conversation with the Hungarian agency: agents stop following up with serious buyers after roughly thirty days. The relationship dies in the CRM. The agent's next commission lives in their own buried database. Nobody is awake at the moment the buyer is ready again.
          </Lead>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, margin: "12px 0 24px" }}>
            <Card icon={<HelpCircle size={18} />} title="The trigger" accent={GOLD} body="A dormant buyer's behaviour, a market event, a price drop on a saved search, a calendar date. Not the agent remembering." />
            <Card icon={<Workflow size={18} />} title="The governed moment" accent={ACCENT} body="The right next action, the right message, the right context on this buyer — under the brokerage's compliance and tone rules, with full lineage." />
            <Card icon={<Building2 size={18} />} title="The operator" accent={PURPLE} body="A semi-professional agent who will not configure software, will not write prompts, will not read a dashboard. Just acts on the moment." />
          </div>
          <P>
            Unit economics from the original thread: ~35,000 HUF / agent / month, ~200 agents in a beachhead deployment, ~78-140M HUF ARR per agency. That number behaves like a franchise royalty, not a SaaS subscription. SaaS comps trade at 4-6× revenue. Franchise networks trade at 12-20×.
          </P>
          <P>
            What the foundry learns from this one speedboat: how to encode a long-tail relationship book as governed context; how to design triggers that fire at the operator moment, not on a CRM schedule; how to deliver one-screen, one-action UX to a non-technical operator. All of that is reusable in insurance brokerages, wealth advisors, aesthetic clinics, private tutors, boutique fitness — every market where the operator is semi-professional and the customer relationship is too high-stakes for a portal.
          </P>
        </section>

        {/* 07 · VERTICAL FILTER */}
        <section style={{ padding: "80px 0", borderTop: `1px solid ${BORDER}` }}>
          <SectionLabel n="07" label="VERTICAL SELECTION FILTER" />
          <H2>Not every market gets a speedboat.</H2>
          <Lead>A vertical qualifies only when four conditions hold at the same time:</Lead>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "16px 0 24px" }}>
            <Card title="1 · Tacit workflow" body="The job lives in operator judgment. Cannot be reduced to a form." accent={ACCENT} />
            <Card title="2 · Semi-professional operator" body="Not a clerk, not a CTO. A licensed individual who books their own time." accent={GREEN} />
            <Card title="3 · Recurring, high-ticket relationship" body="The customer relationship is worth defending. Per-transaction value is high." accent={GOLD} />
            <Card title="4 · Fragmented market" body="No dominant SaaS incumbent. Long tail of small operators. No portal solved it." accent={PURPLE} />
          </div>
          <P>
            Ranked first-pass candidates: real estate (beachhead, in motion), independent insurance brokerages, wealth advisors, aesthetic clinics, private tutoring, boutique fitness, funeral homes, travel advisors, boutique law. Holding should run no more than three verticals at a time. MLM and any financial-licensing vertical get a separately branded subsidiary or do not run at all — flagged for counsel.
          </P>
        </section>

        {/* 08 · HOLDING ARCHITECTURE */}
        <section style={{ padding: "80px 0", borderTop: `1px solid ${BORDER}` }}>
          <SectionLabel n="08" label="HOLDING ARCHITECTURE" />
          <H2>L0 Foundation · L1 Studios · L2 Operators.</H2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, margin: "8px 0 24px" }}>
            <Card icon={<Library size={18} />} title="L0 · Foundation" accent={ACCENT} body="The foundry. Owns the primitive, the engine, the cross-vertical pattern library, the metering substrate, the IP and the brand standards. Licenses to L1 under a fixed template." />
            <Card icon={<Factory size={18} />} title="L1 · Vertical Studios" accent={GREEN} body="One studio per vertical. Owns the vertical playbook, the operator UX, the GTM. Pays L0 a tech-and-IP royalty. Build or acquire. ≤ 3 active at any time." />
            <Card icon={<Building2 size={18} />} title="L2 · Local Operators" accent={GOLD} body="The agency, the brokerage, the clinic. Buys the instantiation as a service or under franchise terms. Pays the L1 studio. Data flows back, de-identified, to L0." />
          </div>
          <P>
            The contract that matters is L0 → L1: the license template that lets us spin up vertical studios in 90 days without re-litigating IP every time. That template is the real artifact we need to write. The legal shell (Hungarian / Estonian / Dutch holding NV with an IP-Co beneath) is downstream of getting the L0/L1 contract right.
          </P>
        </section>

        {/* 09 · INVESTOR PLAY */}
        <section style={{ padding: "80px 0", borderTop: `1px solid ${BORDER}` }}>
          <SectionLabel n="09" label="RELATIONSHIP TO THE CURRENT INVESTOR PLAY" />
          <H2>Foundry on the deck. Speedboats off the deck. Primitive on both.</H2>
          <Lead>
            The current /investor deck stays a foundry story. Investors are pattern-matching against enterprise infrastructure. Adding "and we will also franchise vertical micro-products" muddies the thesis and invites the wrong comps.
          </Lead>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, margin: "16px 0 24px" }}>
            <Card icon={<ArrowRight size={18} />} title="What goes on the investor deck now" accent={GREEN} body="The governed just-in-time operator moment as the unit of value. The foundry that manufactures it at scale. The standards corpus and metering as the moat. Same deck shape as today, sharpened around the primitive." />
            <Card icon={<AlertTriangle size={18} />} title="What stays off the deck — for now" accent={RED} body="The holding structure. The franchise comps. The vertical speedboats by name. These come back in once a speedboat is in revenue, as proof the foundry compounds across markets — a Series A slide, not a Seed slide." />
          </div>
          <P>
            Practical consequence: we can run the real estate speedboat as a parallel track inside LIZA Group without exposing it in the current round. If it works, it becomes the strongest validation of the foundry thesis we could possibly bring to a Series A.
          </P>
        </section>

        {/* 10 · WHAT WE NEED FROM THE COUNCIL */}
        <section style={{ padding: "80px 0", borderTop: `1px solid ${BORDER}` }}>
          <SectionLabel n="10" label="WHAT WE NEED FROM THE COUNCIL" />
          <H2>Five decisions, not a discussion.</H2>
          <ol style={{ fontFamily: SANS, fontSize: 17, lineHeight: 1.6, color: TEXT, paddingLeft: 20, maxWidth: 880, margin: "8px 0 0" }}>
            <li style={{ marginBottom: 14 }}>Is "governed just-in-time operator moment" the right way to name the primitive? If not, what is the sharper name?</li>
            <li style={{ marginBottom: 14 }}>Should the real estate speedboat run in parallel with the Seed round, or wait until the round closes? Arguments both ways are real.</li>
            <li style={{ marginBottom: 14 }}>Is the L0 / L1 / L2 structure the right scaffolding, or are we recreating a franchise model that has obvious failure modes we should design around now?</li>
            <li style={{ marginBottom: 14 }}>Which legal shell (Hungarian, Estonian, Dutch holding NV with IP-Co) gives us the cleanest setup for cross-border vertical studios and downstream operator royalties?</li>
            <li style={{ marginBottom: 14 }}>What is the explicit kill-criterion that ends the speedboat track and refocuses everything on the foundry? We want it written down before we start.</li>
          </ol>
        </section>

        {/* CLOSE */}
        <section style={{ padding: "80px 0 0", borderTop: `1px solid ${BORDER}` }}>
          <p style={{ fontFamily: SERIF, fontSize: 40, lineHeight: 1.2, letterSpacing: "-0.02em", color: TEXT, maxWidth: 880 }}>
            If the council agrees on the primitive, the rest is just sequencing.
          </p>
          <p style={{ fontFamily: SANS, fontSize: 14, color: SUBTLE, marginTop: 28 }}>End of v0.1 · Council working brief · Do not circulate.</p>
        </section>
      </div>
    </div>
  );
}