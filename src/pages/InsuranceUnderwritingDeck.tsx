import { Fragment, useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Maximize2, X, Grid3x3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportMenu } from "@/components/ExportMenu";
import { cn } from "@/lib/utils";
import { useIsMobileViewport, useIsPortrait } from "@/hooks/use-mobile-presentation";

// ─── Scaled slide container with confidentiality badge ───────────────────────
function ScaledSlide({ children, isCover = false }: { children: React.ReactNode; isCover?: boolean }) {
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
        <div style={{ position: "absolute", top: 32, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 14, zIndex: 50, pointerEvents: "none" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 800, letterSpacing: "0.18em", padding: "10px 20px", borderRadius: 6, background: "hsl(0 72% 50% / 0.15)", color: "hsl(0 72% 36%)", border: "2px solid hsl(0 72% 50% / 0.6)" }}>DRAFT · HIGHLY CONFIDENTIAL</span>
        </div>
        {isCover && (
          <div style={{ position: "absolute", inset: 0, zIndex: 40, pointerEvents: "none", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              transform: "rotate(-22deg)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 160, fontWeight: 900, letterSpacing: "0.12em",
              color: "hsl(0 72% 50% / 0.12)",
              textShadow: "0 0 1px hsl(0 72% 50% / 0.18)",
              whiteSpace: "nowrap", lineHeight: 1, textAlign: "center",
            }}>
              DRAFT
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tokens (mirror InsuranceDeck) ───────────────────────────────────────────
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
const PURPLE = "265 60% 52%";

function SlideGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.06]" style={{
      backgroundImage: `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`,
      backgroundSize: "80px 80px"
    }} />
  );
}
function SlideBar({ from = GREEN, to = ACCENT }: { from?: string; to?: string }) {
  return <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(90deg, hsl(${from}), hsl(${to}))` }} />;
}
function Tag({ label, color = GREEN }: { label: string; color?: string }) {
  return <p className="font-semibold tracking-[0.25em] uppercase mb-5" style={{ fontSize: 22, color: `hsl(${color})` }}>{label}</p>;
}
function PhaseChip({ phase, color = GREEN }: { phase: string; color?: string }) {
  return (
    <div className="absolute top-10 right-12 flex items-center gap-2 px-4 py-2 rounded-full"
      style={{ background: `hsl(${color} / 0.08)`, border: `1px solid hsl(${color} / 0.25)` }}>
      <span className="font-mono tracking-[0.15em] uppercase font-semibold" style={{ fontSize: 13, color: `hsl(${color})` }}>{phase}</span>
    </div>
  );
}
function PageNumber({ n, total }: { n: number; total: number }) {
  return (
    <div className="absolute top-10 left-12 font-mono" style={{ fontSize: 14, color: SUBTLE, letterSpacing: "0.15em" }}>
      {String(n).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </div>
  );
}
function Footer({ text }: { text: string }) {
  return (
    <div className="absolute left-28 right-28 bottom-7 flex items-center gap-3"
      style={{ color: SUBTLE, fontSize: 14, letterSpacing: "0.02em" }}>
      <span style={{ width: 32, height: 1, background: CHROME_BORDER }} />
      <span>{text}</span>
    </div>
  );
}

const TOTAL = 8;

// ═════════════════════════════════════════════════════════════════════════════
// 01 · COVER
// ═════════════════════════════════════════════════════════════════════════════
function S01Cover() {
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-20 flex flex-col justify-center" style={{ background: BG }}>
      <SlideGrid />
      <div className="relative z-10 max-w-[1600px]">
        <p className="font-mono uppercase tracking-[0.3em] font-bold mb-8" style={{ fontSize: 18, color: `hsl(${ACCENT})` }}>
          Prepared for the proxy partner · UAE carrier underwriting modernization
        </p>
        <h1 className="font-bold leading-[1.02] mb-10" style={{ fontSize: 96, color: TEXT, letterSpacing: "-0.03em" }}>
          Agentic underwriting,<br/>
          <span style={{ color: `hsl(${GREEN})` }}>without the 12-month engineering build.</span>
        </h1>
        <p style={{ fontSize: 28, color: MUTED, lineHeight: 1.4, maxWidth: 1500 }}>
          A working brief on how the underwriting loop can be designed by your team, deployed on a proven execution layer, and put in front of the CRO inside two weeks rather than twelve months.
        </p>
        <div className="mt-12 flex gap-4">
          <span className="font-mono uppercase tracking-[0.2em] px-4 py-2 rounded" style={{ fontSize: 14, background: `hsl(${ACCENT} / 0.1)`, color: `hsl(${ACCENT})` }}>SME Commercial Property</span>
          <span className="font-mono uppercase tracking-[0.2em] px-4 py-2 rounded" style={{ fontSize: 14, background: `hsl(${GOLD} / 0.1)`, color: `hsl(${GOLD})` }}>Motor</span>
          <span className="font-mono uppercase tracking-[0.2em] px-4 py-2 rounded" style={{ fontSize: 14, background: `hsl(${GREEN} / 0.1)`, color: `hsl(${GREEN})` }}>CBUAE audit-ready</span>
        </div>
      </div>
      <Footer text="Editable working draft · for partner-led discussion · not for external distribution" />
      <SlideBar />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 02 · THE UNDERWRITING TRAP — side-by-side Property + Motor
// ═════════════════════════════════════════════════════════════════════════════
function S02Trap() {
  const steps = [
    {
      n: "01", t: "Intake & triage",
      p: "Broker emails a 50-page PDF submission plus a messy schedule. Junior underwriter reads it manually to test risk appetite.",
      m: "Aggregator feed or dealer portal dumps thousands of quotes. Triage rules are static and silently drift behind the actual book.",
    },
    {
      n: "02", t: "Data extraction & verification",
      p: "Hours typing values from PDFs into the policy admin system. Sanctions and AML checks run in a separate tool.",
      m: "Telematics, vehicle data, and KYC pulled from three different systems. Mismatches resolved by hand.",
    },
    {
      n: "03", t: "Risk evaluation",
      p: "Underwriter applies a static PDF guideline. Two underwriters price the same risk differently. Tacit knowledge stays in heads.",
      m: "Pricing model is updated quarterly. Loss-ratio surprises show up six months later in the actuarial review.",
    },
    {
      n: "04", t: "Exception routing",
      p: "Complex risks emailed to a senior partner. Context lost in the email chain. Approval logic never written down.",
      m: "High-value or modified vehicles escalated by exception. Authority limits enforced by trust, not by system.",
    },
    {
      n: "05", t: "Bind & audit",
      p: "Policy bound. If CBUAE asks 'why was this priced this way' eighteen months later, the answer sits in a deleted thread.",
      m: "Bind log captures the price, not the reasoning. Conduct-of-business audit becomes a reconstruction exercise.",
    },
  ];
  return (
    <div className="w-full h-full relative px-20 pt-24 pb-16" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={2} total={TOTAL} />
      <PhaseChip phase="Where the cost actually sits" color={RED} />
      <div className="relative z-10">
        <Tag label="The current underwriting trap" color={RED} />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 48, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Five steps. Two lines of business. <span style={{ color: `hsl(${RED})` }}>The same structural failure at every stage.</span>
        </h2>
        <p className="mb-7" style={{ fontSize: 19, color: MUTED, lineHeight: 1.4, maxWidth: 1700 }}>
          The diagnosis below is the same whether the carrier writes SME Commercial Property or Motor at volume. The friction is not the underwriter and not the system. It is the missing layer between them.
        </p>

        <div className="grid grid-cols-[110px_1fr_1fr] gap-4 max-w-[1780px]">
          <div />
          <div className="px-5 py-3 rounded-lg font-mono uppercase tracking-[0.18em] font-bold text-center" style={{ fontSize: 14, background: `hsl(${ACCENT} / 0.1)`, color: `hsl(${ACCENT})` }}>SME Commercial Property</div>
          <div className="px-5 py-3 rounded-lg font-mono uppercase tracking-[0.18em] font-bold text-center" style={{ fontSize: 14, background: `hsl(${GOLD} / 0.1)`, color: `hsl(${GOLD})` }}>Motor</div>
          {steps.map(s => (
            <Fragment key={s.n}>
              <div className="rounded-xl border p-3 flex flex-col items-center justify-center" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
                <span className="font-mono font-bold" style={{ fontSize: 22, color: `hsl(${RED})` }}>{s.n}</span>
                <span className="font-bold text-center mt-1" style={{ fontSize: 14, color: TEXT, lineHeight: 1.15 }}>{s.t}</span>
              </div>
              <div className="rounded-xl border p-4" style={{ borderColor: `hsl(${ACCENT} / 0.25)`, background: `hsl(${ACCENT} / 0.04)` }}>
                <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.35 }}>{s.p}</p>
              </div>
              <div className="rounded-xl border p-4" style={{ borderColor: `hsl(${GOLD} / 0.3)`, background: `hsl(${GOLD} / 0.05)` }}>
                <p style={{ fontSize: 15, color: TEXT, lineHeight: 1.35 }}>{s.m}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <SlideBar from={RED} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 03 · WHY THE INTERNAL $1.2M BUILD FAILS — cost breakdown + year-2 maintenance
// ═════════════════════════════════════════════════════════════════════════════
function S03BuildFails() {
  const buckets = [
    { n: "~$400k", t: "Document ingestion & retrieval plumbing", s: "Parsing broker PDFs, schedules, telematics dumps. Embeddings, vector stores, retrieval tuning. Six engineers, three months, before a single underwriter sees a result." },
    { n: "~$350k", t: "Guardrails & evaluation harness", s: "Test sets, hallucination detection, scenario coverage. Built from scratch by a team that has never shipped a regulated AI system." },
    { n: "~$250k", t: "Audit & rationale logging", s: "Immutable trail tying each decision to inputs, rules and operator. The part the CBUAE conduct-of-business team will read first." },
    { n: "~$200k", t: "MLOps, model routing, ongoing ops", s: "Versioning, monitoring, fallback paths. The boring 40% of any production AI system that the proposal slide always understates." },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-16" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={3} total={TOTAL} />
      <PhaseChip phase="Why the $1.2M build fails" color={RED} />
      <div className="relative z-10">
        <Tag label="The internal build path" color={RED} />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 48, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          The $1.2M is not the risk. <span style={{ color: `hsl(${RED})` }}>Year two is the risk.</span>
        </h2>
        <p className="mb-7" style={{ fontSize: 19, color: MUTED, lineHeight: 1.4, maxWidth: 1700 }}>
          A 1.2M USD internal program will deliver a working prototype. It will also build, in commodity infrastructure, the same four layers every regulated AI deployment needs. Below is the honest breakdown of where the money actually goes.
        </p>

        <div className="grid grid-cols-4 gap-4 max-w-[1780px] mb-8">
          {buckets.map(b => (
            <div key={b.n} className="rounded-2xl border-2 p-5" style={{ borderColor: `hsl(${RED} / 0.35)`, background: CARD_ALT, minHeight: 280 }}>
              <p className="font-mono font-bold mb-2" style={{ fontSize: 28, color: `hsl(${RED})`, letterSpacing: "-0.01em" }}>{b.n}</p>
              <p className="font-bold mb-2" style={{ fontSize: 18, color: TEXT, lineHeight: 1.2 }}>{b.t}</p>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>{b.s}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5 max-w-[1780px]">
          <div className="rounded-2xl border-2 p-6" style={{ borderColor: `hsl(${RED} / 0.45)`, background: `hsl(${RED} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 13, color: `hsl(${RED})` }}>The year-two trap</p>
            <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.45 }}>
              An internal team will spend another <span className="font-bold">700k to 900k USD in year two</span> maintaining what they built. Model drift, guardrail erosion, regulator change, key-engineer attrition. A custom stack is a permanent line item, not a project.
            </p>
          </div>
          <div className="rounded-2xl border-2 p-6" style={{ borderColor: `hsl(${GREEN} / 0.45)`, background: `hsl(${GREEN} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>What LIZA ships as commodity</p>
            <p style={{ fontSize: 18, color: TEXT, lineHeight: 1.45 }}>
              All four buckets above are platform commodity. The internal team is freed to spend on what actually differentiates the carrier: <span className="font-bold">the underwriting playbook itself</span>, captured directly from the senior partner, not via a data-scientist intermediary.
            </p>
          </div>
        </div>
      </div>
      <SlideBar from={RED} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 04 · THE AGENTIC LOOP — 4 steps + feedback edge
// ═════════════════════════════════════════════════════════════════════════════
function S04Loop() {
  const steps = [
    { n: "01", t: "Sense & classify", s: "Agent reads the broker email, PDF submission and schedule. Intent is classified (e.g. SME Property new business). The agent is locked to the matching underwriting playbook." },
    { n: "02", t: "Governed evaluation", s: "Submission is evaluated against the playbook's risk appetite, referral triggers, sanctions and treaty constraints. The agent is bounded to the playbook's decision space. Out-of-policy moves are blocked, not generated." },
    { n: "03", t: "Human judgment", s: "Score plus the two or three specific anomalies surface in the carrier's UI. The senior underwriter reviews, overrides where needed, and makes the bind call. Their override is the asset being captured." },
    { n: "04", t: "Bind & rationale log", s: "Policy bound. An immutable, queryable rationale log records: which agent extracted which data, which playbook version applied, which clause fired, which operator decided. CBUAE-ready on day one of production." },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-16" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={4} total={TOTAL} />
      <PhaseChip phase="How it actually runs" color={GREEN} />
      <div className="relative z-10">
        <Tag label="The agentic loop" color={GREEN} />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 48, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Four steps. <span style={{ color: `hsl(${GREEN})` }}>One feedback edge that the internal build will not capture.</span>
        </h2>
        <p className="mb-7" style={{ fontSize: 19, color: MUTED, lineHeight: 1.4, maxWidth: 1700 }}>
          The proxy designs the playbook and the UX. LIZA runs the execution layer underneath. The senior underwriter's overrides feed back into playbook drift detection so that the playbook itself improves with every decision.
        </p>

        <div className="grid grid-cols-4 gap-4 max-w-[1780px] mb-6">
          {steps.map((s, i) => (
            <div key={s.n} className="rounded-2xl border-2 p-5 relative" style={{ borderColor: `hsl(${[GREEN, ACCENT, GOLD, PURPLE][i]} / 0.45)`, background: CARD_ALT, minHeight: 300 }}>
              <p className="font-mono font-bold mb-2" style={{ fontSize: 22, color: `hsl(${[GREEN, ACCENT, GOLD, PURPLE][i]})` }}>{s.n}</p>
              <p className="font-bold mb-2" style={{ fontSize: 20, color: TEXT, lineHeight: 1.15 }}>{s.t}</p>
              <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.4 }}>{s.s}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border-2 p-5 max-w-[1780px]" style={{ borderColor: `hsl(${PURPLE} / 0.45)`, background: `hsl(${PURPLE} / 0.05)` }}>
          <div className="flex items-start gap-5">
            <span className="font-mono uppercase tracking-[0.18em] font-bold px-3 py-1.5 rounded shrink-0" style={{ fontSize: 13, background: `hsl(${PURPLE} / 0.15)`, color: `hsl(${PURPLE})` }}>Feedback edge</span>
            <p style={{ fontSize: 17, color: TEXT, lineHeight: 1.45 }}>
              Every senior-underwriter override is logged as a playbook-drift candidate. The proxy reviews drift weekly and decides which overrides become the next playbook version. <span className="font-bold">The carrier's tacit underwriting knowledge stops walking out the door.</span> This is the part a from-scratch internal build does not deliver inside twelve months.
            </p>
          </div>
        </div>
      </div>
      <SlideBar from={GREEN} to={PURPLE} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 05 · WHO OWNS WHAT
// ═════════════════════════════════════════════════════════════════════════════
function S05Boundary() {
  const cols = [
    {
      name: "The proxy partner", color: ACCENT, role: "Designs the intelligence",
      items: [
        "Underwriting playbook, designed with the carrier's senior partner",
        "Risk-appetite matrix, referral triggers, sanctions and AML rules",
        "The carrier-facing UI and underwriter workflow",
        "Change management and the client relationship",
      ],
    },
    {
      name: "LIZA", color: GREEN, role: "Runs the execution layer",
      items: [
        "Playbook execution and state-locking engine",
        "Document ingestion, retrieval, guardrails and evaluation",
        "Immutable rationale log and audit-ready evidence chain",
        "Model routing, MLOps, monitoring and fallback paths",
      ],
    },
    {
      name: "The carrier", color: GOLD, role: "Owns the decision",
      items: [
        "All submission, policy and claims data, in their environment",
        "Risk appetite, pricing authority and treaty constraints",
        "Final bind decisions and the senior underwriter's authority limits",
        "Audit-ready evidence aligned to CBUAE standards",
      ],
    },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-16" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={5} total={TOTAL} />
      <PhaseChip phase="The boundary" color={ACCENT} />
      <div className="relative z-10">
        <Tag label="Who owns what" color={ACCENT} />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 48, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          Three roles. <span style={{ color: `hsl(${ACCENT})` }}>Written down before the engagement starts.</span>
        </h2>
        <p className="mb-8" style={{ fontSize: 19, color: MUTED, lineHeight: 1.4, maxWidth: 1700 }}>
          The proxy stays the client-facing partner and the design authority. LIZA stays underneath as the execution layer. The carrier keeps full ownership of data, decisions and risk appetite. No disintermediation, no lock-in, no surprise about who shows up at the CRO readout.
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-[1780px]">
          {cols.map(c => (
            <div key={c.name} className="rounded-2xl border-2 p-6 flex flex-col" style={{ borderColor: `hsl(${c.color} / 0.45)`, background: CARD_ALT, minHeight: 480 }}>
              <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 13, color: `hsl(${c.color})` }}>{c.role}</p>
              <p className="font-bold mb-5" style={{ fontSize: 32, color: TEXT, lineHeight: 1.05, letterSpacing: "-0.02em" }}>{c.name}</p>
              <ul className="space-y-3">
                {c.items.map((it, i) => (
                  <li key={i} className="flex gap-3" style={{ fontSize: 17, color: TEXT, lineHeight: 1.4 }}>
                    <span className="font-bold shrink-0" style={{ color: `hsl(${c.color})` }}>›</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <SlideBar from={ACCENT} to={GOLD} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 06 · REFERENCES — Generali / Prudential / MSIG (carried from /insurance S09)
// ═════════════════════════════════════════════════════════════════════════════
function S06References() {
  const carriers = [
    {
      name: "Generali", region: "Hungary / Europe", color: ACCENT,
      tag: "Governance · Context grounding",
      lesson: "Custom agents and Agentspace workshops made it clear: giving employees LLM access is not enough. They needed a central control layer for secure data grounding and enterprise governance.",
    },
    {
      name: "Prudential", region: "Taiwan", color: GREEN,
      tag: "Claims AI · Data governance",
      lesson: "Built the Unified Data Platform and Master Data Management foundations, with ClaimAI and product recommender on the roadmap. Hit the wall of strict data governance, metadata tagging and compliance encryption at every step.",
    },
    {
      name: "MSIG Life", region: "Indonesia", color: GOLD,
      tag: "Regulated AI infrastructure",
      lesson: "Expanded data and AI infrastructure inside one of APAC's most demanding regulatory environments. Same friction surfaced again: compliance, residency and audit had to be architected, not bolted on.",
    },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-16" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={6} total={TOTAL} />
      <PhaseChip phase="Why us · the scars are real" color={PURPLE} />
      <div className="relative z-10">
        <Tag label="Built from the inside of insurance" color={PURPLE} />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 48, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1750 }}>
          We did not design this platform in a vacuum. We built it from <span style={{ color: `hsl(${GREEN})` }}>the scars of deploying AI for major insurers</span>.
        </h2>
        <p className="mb-7" style={{ fontSize: 19, color: MUTED, lineHeight: 1.4, maxWidth: 1700 }}>
          Each of these engagements asked us to custom-build the same governance, context and compliance layer from scratch. LIZA is that layer.
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-[1780px] mb-6">
          {carriers.map(c => (
            <div key={c.name} className="rounded-2xl border-2 p-6 flex flex-col" style={{ borderColor: `hsl(${c.color} / 0.4)`, background: CARD_ALT, minHeight: 320 }}>
              <p className="font-mono uppercase tracking-[0.18em] font-bold mb-3" style={{ fontSize: 13, color: `hsl(${c.color})` }}>{c.tag}</p>
              <p className="font-bold" style={{ fontSize: 30, color: TEXT, lineHeight: 1.1 }}>{c.name}</p>
              <p className="font-semibold mb-4" style={{ fontSize: 14, color: SUBTLE, letterSpacing: "0.08em", textTransform: "uppercase" }}>{c.region}</p>
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.45 }}>{c.lesson}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border-2 p-5 max-w-[1780px]" style={{ borderColor: `hsl(${ACCENT} / 0.4)`, background: `hsl(${ACCENT} / 0.05)` }}>
          <p className="font-mono uppercase tracking-[0.18em] font-bold mb-2" style={{ fontSize: 13, color: `hsl(${ACCENT})` }}>Where these relationships stand today</p>
          <p style={{ fontSize: 17, color: TEXT, lineHeight: 1.45 }}>
            We are in active conversations with each of these carriers about applying LIZA to the same problems we first met inside their walls. No LIZA deployment has gone live at any of them yet. The trust is earned, the doors are open, and the timing is the only variable. The underwriting loop on the previous pages is the next, productized version of what we built by hand for them.
          </p>
        </div>
      </div>
      <SlideBar from={PURPLE} to={GREEN} />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 07 · THE 2-WEEK SHAPE
// ═════════════════════════════════════════════════════════════════════════════
function S07TwoWeek() {
  const days = [
    { d: "Day 0-2",  t: "Pick one playbook, one pod", s: "SME Commercial Property or Motor. We agree the owner, the baseline metrics, and the success bar with the carrier's underwriting lead and CRO." },
    { d: "Day 3-7",  t: "Capture the playbook",     s: "Two working sessions with the senior underwriter. The proxy structures the playbook. LIZA loads it. The carrier signs off the risk-appetite, referral and authority rules." },
    { d: "Day 8-12", t: "Shadow run on real files",   s: "AI runs alongside the team on 20 historical bind decisions. Every output carries its rationale. Nothing customer-facing. Deltas measured against the carrier's baseline." },
    { d: "Day 13-14",t: "Readout to the CRO",        s: "Time saved, consistency versus senior review, % of files with a defensible rationale chain, audit-readiness against CBUAE evidence requirements. Clear go or no-go to expand." },
  ];
  return (
    <div className="w-full h-full relative px-24 pt-24 pb-16" style={{ background: BG }}>
      <SlideGrid />
      <PageNumber n={7} total={TOTAL} />
      <PhaseChip phase="What gets bought first" color={GOLD} />
      <div className="relative z-10">
        <Tag label="The two-week shape" color={GOLD} />
        <h2 className="font-bold leading-[1.05] mb-3" style={{ fontSize: 48, color: TEXT, letterSpacing: "-0.025em", maxWidth: 1700 }}>
          One playbook. One pod. Two weeks. <span style={{ color: `hsl(${GREEN})` }}>A measured readout in the CRO's calendar.</span>
        </h2>
        <p className="mb-7" style={{ fontSize: 19, color: MUTED, lineHeight: 1.4, maxWidth: 1700 }}>
          The carrier's internal team does not need to wait twelve months to see whether agentic underwriting is real. The shape below produces a CRO-grade readout in two weeks, on real files, with no customer exposure. It either earns the right to the larger program or it does not.
        </p>

        <div className="space-y-3 max-w-[1780px] mb-7">
          {days.map(d => (
            <div key={d.d} className="rounded-xl border p-4 grid grid-cols-[140px_1fr_2.4fr] gap-5 items-center" style={{ borderColor: CHROME_BORDER, background: CARD_ALT }}>
              <span className="font-mono font-bold" style={{ fontSize: 17, color: `hsl(${GREEN})` }}>{d.d}</span>
              <p className="font-bold" style={{ fontSize: 19, color: TEXT }}>{d.t}</p>
              <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.4 }}>{d.s}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5 max-w-[1780px]">
          <div className="rounded-2xl border-2 p-5" style={{ borderColor: `hsl(${ACCENT} / 0.45)`, background: `hsl(${ACCENT} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-2" style={{ fontSize: 13, color: `hsl(${ACCENT})` }}>What the proxy walks in with</p>
            <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.4 }}>A working two-week plan, a co-designed playbook, and the execution layer underneath already proven inside major insurers. The proxy is the design and delivery partner of record. LIZA stays underneath.</p>
          </div>
          <div className="rounded-2xl border-2 p-5" style={{ borderColor: `hsl(${GREEN} / 0.45)`, background: `hsl(${GREEN} / 0.05)` }}>
            <p className="font-mono uppercase tracking-[0.18em] font-bold mb-2" style={{ fontSize: 13, color: `hsl(${GREEN})` }}>What the carrier walks out with</p>
            <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.4 }}>A measured readout the CRO can take to the board, an audit-ready rationale log on 20 real bind decisions, and a clear decision on whether to redirect the 1.2M USD program toward something faster, cheaper, and CBUAE-defensible.</p>
          </div>
        </div>
      </div>
      <SlideBar from={GOLD} to={GREEN} />
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────
const SLIDES = [
  { id: "cover",       title: "Cover · Agentic underwriting brief",   component: <S01Cover /> },
  { id: "trap",        title: "The underwriting trap (Property + Motor)", component: <S02Trap /> },
  { id: "build-fails", title: "Why the $1.2M internal build fails",   component: <S03BuildFails /> },
  { id: "loop",        title: "The agentic loop with feedback edge",  component: <S04Loop /> },
  { id: "boundary",    title: "Who owns what (Proxy / LIZA / Carrier)", component: <S05Boundary /> },
  { id: "references",  title: "References · built from real carriers",  component: <S06References /> },
  { id: "two-week",    title: "The two-week shape",                   component: <S07TwoWeek /> },
];

// ─── Deck shell (mirrors InsuranceDeck) ──────────────────────────────────────
export default function InsuranceUnderwritingDeck() {
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
        <ScaledSlide isCover={slide.id === "cover"}>{slide.component}</ScaledSlide>
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
          <ExportMenu exportRef={exportRef} fileName="LIZA-Insurance-Underwriting-Brief" slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
        <ScaledSlide isCover={slide.id === "cover"}>{slide.component}</ScaledSlide>
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
          <span className="text-sm font-semibold" style={{ color: TEXT }}>LIZA · UAE Agentic Underwriting Brief</span>
          <span className="text-xs px-2 py-0.5 rounded"
            style={{ background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})` }}>
            Property + Motor · {SLIDES.length} slides
          </span>
          <span className="text-xs px-2 py-0.5 rounded ml-1"
            style={{ background: "hsl(0 72% 50% / 0.08)", color: "hsl(0 72% 50%)" }}>
            Draft · Highly Confidential
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setShowGrid(v => !v)} className={cn(showGrid && "bg-accent")}>
            <Grid3x3 size={15} className="mr-1.5" /> Grid
          </Button>
          <ExportMenu exportRef={exportRef} fileName="LIZA-Insurance-Underwriting-Brief" slideCount={SLIDES.length} variant="desktop" />
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
                <ScaledSlide isCover={s.id === "cover"}>{s.component}</ScaledSlide>
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
                      <ScaledSlide isCover={s.id === "cover"}>{s.component}</ScaledSlide>
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
                <ScaledSlide isCover={slide.id === "cover"}>{slide.component}</ScaledSlide>
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

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
        ))}
      </div>
    </div>
  );
}