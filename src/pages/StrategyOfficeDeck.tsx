import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobileViewport, useIsPortrait, useSwipe } from "@/hooks/use-mobile-presentation";
import {
  AlertTriangle, ArrowRight, BookMarked, Brain, Building2, Calendar,
  CheckCircle2, ChevronLeft, ChevronRight, Clock, Compass, Database,
  Eye, FileText, Globe, Grid3x3, Handshake, Layers, Mail, Maximize2,
  MessageSquare, Network, Route, ScrollText, Search, Sparkles, Target,
  Timer, TrendingUp, Users, X,
} from "lucide-react";
import { ExportMenu } from "@/components/ExportMenu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import kristofPhoto from "@/assets/kristof-eger.png";

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

// ─── Palette (white-theme presentation standard) ─────────────────────────────

const BG = "hsl(0 0% 100%)";
const TEXT = "hsl(222 20% 10%)";
const MUTED = "hsl(215 15% 42%)";
const SUBTLE = "hsl(215 10% 56%)";
const CARD_ALT = "hsl(220 15% 97%)";
const CARD_BORDER = "hsl(220 12% 90%)";
const CHROME_BG = "hsl(220 15% 97%)";
const CHROME_BORDER = "hsl(220 12% 90%)";

const NAVY = "220 65% 32%";   // primary brand
const TEAL = "200 75% 36%";   // secondary
const AMBER = "38 92% 50%";   // attention / friction
const RED = "0 72% 50%";      // pain / cost
const GREEN = "155 72% 38%";  // outcome / success
const SLATE = "215 20% 30%";  // neutral dark

// ─── Reusable bits ──────────────────────────────────────────────────────────

function PageNumber({ n }: { n: number }) {
  return (
    <div style={{
      position: "absolute", bottom: 32, right: 48,
      fontFamily: "monospace", fontSize: 14, color: SUBTLE, letterSpacing: 1,
    }}>{String(n).padStart(2, "0")} / 12</div>
  );
}

function Tag({ label, color = NAVY }: { label: string; color?: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "8px 16px", borderRadius: 999,
      background: `hsl(${color} / 0.08)`,
      border: `1px solid hsl(${color} / 0.2)`,
      color: `hsl(${color})`,
      fontSize: 14, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
    }}>{label}</span>
  );
}

function Watermark() {
  return (
    <div style={{
      position: "absolute", bottom: 32, left: 48,
      display: "flex", alignItems: "center", gap: 10,
      fontSize: 13, color: SUBTLE, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: 999, background: `hsl(${NAVY})` }} />
      LIZA · Strategy Office OS
    </div>
  );
}

// ─── 01 · Cover ──────────────────────────────────────────────────────────────

function Slide01() {
  return (
    <div style={{ width: 1920, height: 1080, background: BG, position: "relative", overflow: "hidden", fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* soft gradient corner */}
      <div style={{
        position: "absolute", top: -200, right: -200, width: 800, height: 800,
        borderRadius: "50%",
        background: `radial-gradient(circle, hsl(${NAVY} / 0.08), transparent 70%)`,
      }} />
      <div style={{
        position: "absolute", bottom: -200, left: -200, width: 700, height: 700,
        borderRadius: "50%",
        background: `radial-gradient(circle, hsl(${TEAL} / 0.06), transparent 70%)`,
      }} />

      <div style={{ padding: "180px 140px", position: "relative", zIndex: 2 }}>
        <Tag label="Strategy Office OS · Sales pitch" />

        <h1 style={{
          marginTop: 56, fontSize: 124, fontWeight: 900, lineHeight: 1.02,
          color: TEXT, letterSpacing: -2, maxWidth: 1500,
        }}>
          The team that has to know everything.
          <br />
          <span style={{ color: `hsl(${NAVY})` }}>Without being expert at anything.</span>
        </h1>

        <p style={{ marginTop: 48, fontSize: 28, color: MUTED, maxWidth: 1100, lineHeight: 1.4 }}>
          A working playbook for strategy, corporate development, and business development teams
          that have to form a 360 view fast, get sharp answers from busy experts, and walk into
          the board meeting prepared every single Friday.
        </p>

        <div style={{
          marginTop: 96, display: "flex", alignItems: "center", gap: 24,
          paddingTop: 32, borderTop: `1px solid ${CARD_BORDER}`,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: `hsl(${NAVY} / 0.08)`, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Compass size={28} style={{ color: `hsl(${NAVY})` }} />
          </div>
          <div>
            <div style={{ fontSize: 16, color: SUBTLE, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700 }}>
              Built for
            </div>
            <div style={{ fontSize: 22, color: TEXT, fontWeight: 600, marginTop: 4 }}>
              Strategy · Corporate Development · Business Development · Group M&A
            </div>
          </div>
        </div>
      </div>

      <Watermark />
      <PageNumber n={1} />
    </div>
  );
}

// ─── 02 · A Monday in the strategy team ──────────────────────────────────────

function Slide02() {
  const moments = [
    {
      time: "08:42",
      title: "The brief lands",
      body: "Boss forwards an email. New operator wants a partnership conversation. Board reviews Friday.",
      icon: <Mail size={28} />,
      color: NAVY,
    },
    {
      time: "11:15",
      title: "Stitching the 360",
      body: "Five tabs open. Three PDFs from the website. An old deck from 2022 that nobody can find. The clock keeps moving.",
      icon: <Layers size={28} />,
      color: AMBER,
    },
    {
      time: "14:30",
      title: "The four people who know",
      body: "Fleet, finance, legal, regulatory. All on calls. All buried. Three Slack messages sent. None opened.",
      icon: <MessageSquare size={28} />,
      color: AMBER,
    },
    {
      time: "Friday",
      title: "Board still wants the answer",
      body: "Two of the four answers came back. The brief lands shallow. The recommendation gets hedged. Credibility costs a little more than it should.",
      icon: <AlertTriangle size={28} />,
      color: RED,
    },
  ];

  return (
    <div style={{ width: 1920, height: 1080, background: BG, position: "relative", padding: "100px 120px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Tag label="The reality" />
      <h2 style={{ marginTop: 28, fontSize: 76, fontWeight: 900, color: TEXT, letterSpacing: -1.5, maxWidth: 1400, lineHeight: 1.05 }}>
        A Monday in the strategy team.
      </h2>
      <p style={{ marginTop: 18, fontSize: 22, color: MUTED, maxWidth: 1200 }}>
        Same team, same week, same outcome. The work is hard not because the people are weak,
        but because the system gives them no leverage.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, marginTop: 64 }}>
        {moments.map((m, i) => (
          <div key={i} style={{
            background: BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 20,
            padding: 32, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 4,
              background: `hsl(${m.color})`,
            }} />
            <div style={{
              fontFamily: "monospace", fontSize: 18, color: `hsl(${m.color})`,
              fontWeight: 700, letterSpacing: 1, marginBottom: 20, marginTop: 6,
            }}>{m.time}</div>
            <div style={{
              width: 56, height: 56, borderRadius: 12,
              background: `hsl(${m.color} / 0.1)`, color: `hsl(${m.color})`,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
            }}>{m.icon}</div>
            <h3 style={{ fontSize: 26, fontWeight: 800, color: TEXT, marginBottom: 14, lineHeight: 1.2 }}>{m.title}</h3>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.5 }}>{m.body}</p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 56, padding: "24px 32px", borderRadius: 14,
        background: `hsl(${RED} / 0.06)`, border: `1px solid hsl(${RED} / 0.2)`,
        display: "flex", alignItems: "center", gap: 20,
      }}>
        <AlertTriangle size={28} style={{ color: `hsl(${RED})`, flexShrink: 0 }} />
        <p style={{ fontSize: 22, color: TEXT, fontWeight: 600 }}>
          This Monday repeats next Monday. And the one after. The strategy office runs on heroics, and heroics don't compound.
        </p>
      </div>

      <Watermark />
      <PageNumber n={2} />
    </div>
  );
}

// ─── 03 · Five frictions ─────────────────────────────────────────────────────

function Slide03() {
  const frictions = [
    {
      n: "01",
      title: "Every brief starts at zero",
      body: "PDFs, web tabs, old emails, three different drives. Last quarter's research on the same name is somewhere, but no one finds it in time.",
      icon: <FileText size={26} />,
    },
    {
      n: "02",
      title: "The four people who know are busy",
      body: "Fleet, finance, regulatory, engineering. They have day jobs. Strategic questions wait two to eight days for the paragraph that unlocks the recommendation.",
      icon: <Clock size={26} />,
    },
    {
      n: "03",
      title: "Last quarter's work is unfindable",
      body: "Half of the answer already exists in someone's deck. The team rebuilds it from scratch because nothing tells them it is there.",
      icon: <Search size={26} />,
    },
    {
      n: "04",
      title: "Senior memory walks out the door",
      body: "The senior partner remembers why the conversation with this operator stalled in 2019. When they leave, that context leaves with them.",
      icon: <Brain size={26} />,
    },
    {
      n: "05",
      title: "Friday comes either way",
      body: "The board doesn't move because experts are busy. The brief gets delivered with two of the four answers, and the recommendation is hedged accordingly.",
      icon: <Calendar size={26} />,
    },
  ];

  return (
    <div style={{ width: 1920, height: 1080, background: BG, position: "relative", padding: "100px 120px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Tag label="What slows every brief" color={AMBER} />
      <h2 style={{ marginTop: 28, fontSize: 76, fontWeight: 900, color: TEXT, letterSpacing: -1.5, maxWidth: 1500, lineHeight: 1.05 }}>
        Five frictions slowing every brief.
      </h2>
      <p style={{ marginTop: 18, fontSize: 22, color: MUTED, maxWidth: 1200 }}>
        Not one big problem. Five small ones, repeating, every week.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 22, marginTop: 64 }}>
        {frictions.map((f, i) => (
          <div key={i} style={{
            background: CARD_ALT, border: `1px solid ${CARD_BORDER}`, borderRadius: 18,
            padding: 28,
          }}>
            <div style={{
              fontFamily: "monospace", fontSize: 14, color: `hsl(${AMBER})`,
              fontWeight: 700, letterSpacing: 2, marginBottom: 20,
            }}>{f.n}</div>
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: BG, color: `hsl(${SLATE})`,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22,
              border: `1px solid ${CARD_BORDER}`,
            }}>{f.icon}</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: TEXT, marginBottom: 14, lineHeight: 1.2 }}>{f.title}</h3>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.5 }}>{f.body}</p>
          </div>
        ))}
      </div>

      <Watermark />
      <PageNumber n={3} />
    </div>
  );
}

// ─── 04 · What it costs ──────────────────────────────────────────────────────

function Slide04() {
  const stats = [
    {
      big: "2 to 8",
      unit: "days",
      label: "Waiting on the one paragraph from the busy expert that the recommendation depends on.",
      color: RED,
    },
    {
      big: "~60%",
      unit: "of brief time",
      label: "Spent restitching context, finding old work, and rewriting summaries that already exist somewhere in the company.",
      color: AMBER,
    },
    {
      big: "1 in 3",
      unit: "briefs",
      label: "Land shallow because the senior partner with the prior context wasn't reachable in time.",
      color: RED,
    },
  ];

  return (
    <div style={{ width: 1920, height: 1080, background: BG, position: "relative", padding: "100px 120px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Tag label="The cost" color={RED} />
      <h2 style={{ marginTop: 28, fontSize: 76, fontWeight: 900, color: TEXT, letterSpacing: -1.5, maxWidth: 1500, lineHeight: 1.05 }}>
        What this is actually costing the team.
      </h2>
      <p style={{ marginTop: 18, fontSize: 22, color: MUTED, maxWidth: 1200 }}>
        Not in software licenses. In the only currency that matters: decision quality, decision speed, and the credibility of the team making the recommendation.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 36, marginTop: 80 }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 24,
            padding: 48, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, bottom: 0, width: 6,
              background: `hsl(${s.color})`,
            }} />
            <div style={{
              fontSize: 140, fontWeight: 900, color: `hsl(${s.color})`,
              lineHeight: 0.95, letterSpacing: -4,
            }}>{s.big}</div>
            <div style={{
              fontSize: 20, color: `hsl(${s.color})`, fontWeight: 700, marginTop: 8,
              letterSpacing: 1, textTransform: "uppercase",
            }}>{s.unit}</div>
            <div style={{
              marginTop: 32, paddingTop: 24,
              borderTop: `1px solid ${CARD_BORDER}`,
              fontSize: 19, color: MUTED, lineHeight: 1.5,
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      <p style={{
        marginTop: 56, fontSize: 18, color: SUBTLE, textAlign: "center",
        fontStyle: "italic", maxWidth: 1200, marginLeft: "auto", marginRight: "auto",
      }}>
        Indicative ranges from working with strategy and corp dev teams in regulated, expert-heavy industries.
        Your team's exact numbers will be measured in the first week of pilot.
      </p>

      <Watermark />
      <PageNumber n={4} />
    </div>
  );
}

// ─── 05 · Why it stays broken ────────────────────────────────────────────────

function Slide05() {
  const reasons = [
    {
      title: "Experts can't drop their day job",
      body: "Fleet runs satellites. Finance closes books. Legal reviews contracts. Strategic questions are real, but they always lose to operational fires.",
      whyItMatters: "Trying harder doesn't change the queue. The queue is the system.",
    },
    {
      title: "Knowledge lives in heads, not systems",
      body: "The CRM has contacts. The SharePoint has files. Neither has the reasoning behind why a deal moved or stalled. That sits with three people.",
      whyItMatters: "Tools store documents. They don't store why.",
    },
    {
      title: "No system rewards capture",
      body: "Answering a strategy question by email is one-and-done. The expert gets no credit for the next analyst who needs the same answer six months later.",
      whyItMatters: "Capture is unpaid work. Unpaid work doesn't happen.",
    },
  ];

  return (
    <div style={{ width: 1920, height: 1080, background: BG, position: "relative", padding: "100px 120px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Tag label="Why it stays broken" color={SLATE} />
      <h2 style={{ marginTop: 28, fontSize: 76, fontWeight: 900, color: TEXT, letterSpacing: -1.5, maxWidth: 1500, lineHeight: 1.05 }}>
        This is structural. Not effort.
      </h2>
      <p style={{ marginTop: 18, fontSize: 22, color: MUTED, maxWidth: 1200 }}>
        Three reasons no amount of "try harder" will move. Solve them and the strategy office stops running on heroics.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginTop: 64 }}>
        {reasons.map((r, i) => (
          <div key={i} style={{
            background: CARD_ALT, border: `1px solid ${CARD_BORDER}`, borderRadius: 20,
            padding: 36,
          }}>
            <div style={{
              fontFamily: "monospace", fontSize: 16, color: `hsl(${NAVY})`,
              fontWeight: 700, letterSpacing: 2, marginBottom: 20,
            }}>0{i + 1}</div>
            <h3 style={{ fontSize: 28, fontWeight: 800, color: TEXT, marginBottom: 18, lineHeight: 1.2 }}>{r.title}</h3>
            <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.5, marginBottom: 28 }}>{r.body}</p>
            <div style={{
              padding: "16px 20px", borderRadius: 12,
              background: BG, border: `1px solid ${CARD_BORDER}`,
              fontSize: 17, color: TEXT, fontWeight: 600, lineHeight: 1.4,
            }}>
              <span style={{ color: `hsl(${NAVY})`, fontWeight: 800, marginRight: 8 }}>Why it matters:</span>
              {r.whyItMatters}
            </div>
          </div>
        ))}
      </div>

      <Watermark />
      <PageNumber n={5} />
    </div>
  );
}

// ─── 06 · The shift ──────────────────────────────────────────────────────────

function Slide06() {
  const before = [
    "Brief starts on a blank page",
    "40 vague questions get fired into the experts",
    "Two-week wait for half the answers",
    "Recommendation hedged because context is shallow",
    "Internally seen as the team that only takes",
  ];
  const after = [
    "Brief starts at 60 percent, pre-assembled",
    "4 sharp questions, in the expert's preferred channel",
    "Answers come back in hours, not days",
    "Recommendation lands with full prior context",
    "Internally seen as the team that walks in with answers",
  ];

  return (
    <div style={{ width: 1920, height: 1080, background: BG, position: "relative", padding: "100px 120px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Tag label="The shift" color={GREEN} />
      <h2 style={{ marginTop: 28, fontSize: 76, fontWeight: 900, color: TEXT, letterSpacing: -1.5, maxWidth: 1500, lineHeight: 1.05 }}>
        From asker to synthesiser.
      </h2>
      <p style={{ marginTop: 18, fontSize: 22, color: MUTED, maxWidth: 1200 }}>
        The team that walks in with the 360 view and the four sharp questions is treated very differently
        than the team that walks in with forty vague ones.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: 24, marginTop: 80, alignItems: "stretch" }}>
        {/* BEFORE */}
        <div style={{
          background: CARD_ALT, border: `1px solid ${CARD_BORDER}`, borderRadius: 24, padding: 44,
        }}>
          <div style={{
            display: "inline-flex", padding: "6px 14px", borderRadius: 999,
            background: `hsl(${RED} / 0.1)`, color: `hsl(${RED})`,
            fontSize: 14, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
            marginBottom: 28,
          }}>Today</div>
          <h3 style={{ fontSize: 32, fontWeight: 800, color: TEXT, marginBottom: 28 }}>The asker</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {before.map((b, i) => (
              <li key={i} style={{
                display: "flex", gap: 14, padding: "16px 0",
                borderTop: i > 0 ? `1px solid ${CARD_BORDER}` : "none",
                fontSize: 19, color: MUTED, lineHeight: 1.4,
              }}>
                <X size={22} style={{ color: `hsl(${RED})`, flexShrink: 0, marginTop: 2 }} />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* arrow */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 999,
            background: `hsl(${NAVY})`, color: BG,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 12px 40px hsl(${NAVY} / 0.3)`,
          }}>
            <ArrowRight size={28} />
          </div>
        </div>

        {/* AFTER */}
        <div style={{
          background: BG, border: `2px solid hsl(${GREEN} / 0.3)`, borderRadius: 24, padding: 44,
          boxShadow: `0 24px 60px hsl(${GREEN} / 0.08)`,
        }}>
          <div style={{
            display: "inline-flex", padding: "6px 14px", borderRadius: 999,
            background: `hsl(${GREEN} / 0.12)`, color: `hsl(${GREEN})`,
            fontSize: 14, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
            marginBottom: 28,
          }}>With a working strategy office</div>
          <h3 style={{ fontSize: 32, fontWeight: 800, color: TEXT, marginBottom: 28 }}>The synthesiser</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {after.map((a, i) => (
              <li key={i} style={{
                display: "flex", gap: 14, padding: "16px 0",
                borderTop: i > 0 ? `1px solid ${CARD_BORDER}` : "none",
                fontSize: 19, color: TEXT, lineHeight: 1.4, fontWeight: 500,
              }}>
                <CheckCircle2 size={22} style={{ color: `hsl(${GREEN})`, flexShrink: 0, marginTop: 2 }} />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Watermark />
      <PageNumber n={6} />
    </div>
  );
}

// ─── 07 · What a working strategy office looks like ──────────────────────────

function Slide07() {
  const caps = [
    { icon: <Eye size={28} />, label: "Standing 360 view", body: "Briefs on every relevant target, partner, competitor, and sector are already half-built before they are requested." },
    { icon: <Route size={28} />, label: "Routing rail experts opt into", body: "Sharp questions delivered in the expert's preferred channel and format. They answer once, never re-explain." },
    { icon: <Database size={28} />, label: "Captured answers, reusable forever", body: "Every answer is filed against the entity it belongs to. The next analyst gets it in seconds." },
    { icon: <Brain size={28} />, label: "Senior memory preserved", body: "The reasoning behind why a deal moved or stalled lives in the system, not just in three heads." },
    { icon: <ScrollText size={28} />, label: "Board-ready every Friday", body: "Recommendation lands with full prior context, full sector posture, and the four expert paragraphs that matter." },
  ];

  return (
    <div style={{ width: 1920, height: 1080, background: BG, position: "relative", padding: "100px 120px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Tag label="What working looks like" color={NAVY} />
      <h2 style={{ marginTop: 28, fontSize: 76, fontWeight: 900, color: TEXT, letterSpacing: -1.5, maxWidth: 1500, lineHeight: 1.05 }}>
        Five capabilities. One outcome.
      </h2>
      <p style={{ marginTop: 18, fontSize: 22, color: MUTED, maxWidth: 1200 }}>
        Not a dashboard. Not a wiki. A working operating model for the strategy team.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 22, marginTop: 64 }}>
        {caps.map((c, i) => (
          <div key={i} style={{
            background: BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 18,
            padding: 32, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 4,
              background: `hsl(${NAVY})`,
            }} />
            <div style={{
              width: 56, height: 56, borderRadius: 12, marginTop: 8,
              background: `hsl(${NAVY} / 0.08)`, color: `hsl(${NAVY})`,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
            }}>{c.icon}</div>
            <h3 style={{ fontSize: 21, fontWeight: 800, color: TEXT, marginBottom: 14, lineHeight: 1.2 }}>{c.label}</h3>
            <p style={{ fontSize: 16, color: MUTED, lineHeight: 1.5 }}>{c.body}</p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 64, padding: "28px 36px", borderRadius: 16,
        background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.2)`,
        display: "flex", alignItems: "center", gap: 24,
      }}>
        <CheckCircle2 size={36} style={{ color: `hsl(${GREEN})`, flexShrink: 0 }} />
        <p style={{ fontSize: 24, color: TEXT, fontWeight: 600, lineHeight: 1.4 }}>
          The strategy team becomes the team that gives back. Experts answer once and see their answer reused.
          The credibility loop reverses.
        </p>
      </div>

      <Watermark />
      <PageNumber n={7} />
    </div>
  );
}

// ─── 08 · Memory + routing layer (LIZA introduced, secondary) ────────────────

function Slide08() {
  return (
    <div style={{ width: 1920, height: 1080, background: BG, position: "relative", padding: "100px 120px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Tag label="The how" color={TEAL} />
      <h2 style={{ marginTop: 28, fontSize: 76, fontWeight: 900, color: TEXT, letterSpacing: -1.5, maxWidth: 1500, lineHeight: 1.05 }}>
        A memory and routing layer that sits between the brief and the experts.
      </h2>
      <p style={{ marginTop: 18, fontSize: 22, color: MUTED, maxWidth: 1300 }}>
        We don't replace your experts. We make every conversation with them count twice. LIZA is the working surface for the strategy team and the queue manager for everyone else.
      </p>

      {/* Diagram */}
      <div style={{
        marginTop: 80, background: CARD_ALT, border: `1px solid ${CARD_BORDER}`, borderRadius: 24,
        padding: 60, display: "grid", gridTemplateColumns: "1fr 80px 1.4fr 80px 1fr", alignItems: "center", gap: 0,
      }}>
        {/* Brief */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 100, height: 100, borderRadius: 24, background: BG,
            border: `2px solid ${CARD_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <FileText size={44} style={{ color: `hsl(${NAVY})` }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: TEXT }}>Strategy team</div>
          <div style={{ fontSize: 16, color: MUTED, marginTop: 8, lineHeight: 1.4 }}>
            Drops in a brief, target, or partner name
          </div>
        </div>

        <ArrowRight size={36} style={{ color: `hsl(${NAVY})`, justifySelf: "center" }} />

        {/* LIZA layer */}
        <div style={{
          background: BG, border: `2px solid hsl(${NAVY} / 0.3)`, borderRadius: 24,
          padding: 40, position: "relative", boxShadow: `0 24px 60px hsl(${NAVY} / 0.1)`,
        }}>
          <div style={{
            position: "absolute", top: -16, left: 32,
            background: `hsl(${NAVY})`, color: BG,
            padding: "6px 14px", borderRadius: 999,
            fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
          }}>LIZA</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 12 }}>
            <div style={{ padding: 20, background: CARD_ALT, borderRadius: 14 }}>
              <Database size={26} style={{ color: `hsl(${NAVY})`, marginBottom: 12 }} />
              <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginBottom: 6 }}>Memory layer</div>
              <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>Pre-assembles the 360, surfaces prior work, holds senior takes.</div>
            </div>
            <div style={{ padding: 20, background: CARD_ALT, borderRadius: 14 }}>
              <Route size={26} style={{ color: `hsl(${TEAL})`, marginBottom: 12 }} />
              <div style={{ fontSize: 18, fontWeight: 800, color: TEXT, marginBottom: 6 }}>Routing layer</div>
              <div style={{ fontSize: 14, color: MUTED, lineHeight: 1.4 }}>Sends the four sharp questions to the right expert, in their channel.</div>
            </div>
          </div>
        </div>

        <ArrowRight size={36} style={{ color: `hsl(${TEAL})`, justifySelf: "center" }} />

        {/* Experts */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 100, height: 100, borderRadius: 24, background: BG,
            border: `2px solid ${CARD_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <Users size={44} style={{ color: `hsl(${TEAL})` }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: TEXT }}>Busy experts</div>
          <div style={{ fontSize: 16, color: MUTED, marginTop: 8, lineHeight: 1.4 }}>
            Fleet, finance, legal, regulatory. Answer once, in their channel.
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 40, display: "flex", alignItems: "center", gap: 16, justifyContent: "center",
      }}>
        <div style={{
          padding: "12px 24px", borderRadius: 999,
          background: `hsl(${GREEN} / 0.08)`, color: `hsl(${GREEN})`,
          fontSize: 18, fontWeight: 700, letterSpacing: 0.5,
          border: `1px solid hsl(${GREEN} / 0.2)`,
        }}>
          Every answer flows back into memory. The next brief starts at 60 percent.
        </div>
      </div>

      <Watermark />
      <PageNumber n={8} />
    </div>
  );
}

// ─── 09 · Three live motions ─────────────────────────────────────────────────

function Slide09() {
  const motions = [
    {
      icon: <Handshake size={28} />,
      title: "Inbound Partnership Evaluation",
      before: "Three weeks of stitching plus chasing experts.",
      after: "360 view in two days. Four routed questions answered in 48 hours. Recommendation lands Friday.",
    },
    {
      icon: <Target size={28} />,
      title: "Competitor Move Brief",
      before: "Restart from web search. Senior partner not asked because they are travelling.",
      after: "Prior take auto-surfaced. Brief flags what is genuinely new versus already known internally.",
    },
    {
      icon: <Globe size={28} />,
      title: "Sector Landscape on Demand",
      before: "Three analysts, ten days, half a deck of named players.",
      after: "Current landscape with ownership chains, regulatory posture, and every internal conversation attached.",
    },
  ];

  return (
    <div style={{ width: 1920, height: 1080, background: BG, position: "relative", padding: "100px 120px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Tag label="Three live motions" color={NAVY} />
      <h2 style={{ marginTop: 28, fontSize: 76, fontWeight: 900, color: TEXT, letterSpacing: -1.5, maxWidth: 1500, lineHeight: 1.05 }}>
        Same workflow. Different jacket.
      </h2>
      <p style={{ marginTop: 18, fontSize: 22, color: MUTED, maxWidth: 1200 }}>
        Three motions every strategy office already runs. Each one compounds the next.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, marginTop: 64 }}>
        {motions.map((m, i) => (
          <div key={i} style={{
            background: BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 20,
            padding: 36,
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: 14,
              background: `hsl(${NAVY} / 0.08)`, color: `hsl(${NAVY})`,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
            }}>{m.icon}</div>
            <h3 style={{ fontSize: 26, fontWeight: 800, color: TEXT, marginBottom: 28, lineHeight: 1.2 }}>{m.title}</h3>

            <div style={{
              padding: 20, borderRadius: 12,
              background: `hsl(${RED} / 0.05)`, border: `1px solid hsl(${RED} / 0.15)`,
              marginBottom: 14,
            }}>
              <div style={{
                fontSize: 12, color: `hsl(${RED})`, fontWeight: 800, letterSpacing: 1.5,
                textTransform: "uppercase", marginBottom: 8,
              }}>Today</div>
              <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.45 }}>{m.before}</p>
            </div>

            <div style={{
              padding: 20, borderRadius: 12,
              background: `hsl(${GREEN} / 0.06)`, border: `1px solid hsl(${GREEN} / 0.2)`,
            }}>
              <div style={{
                fontSize: 12, color: `hsl(${GREEN})`, fontWeight: 800, letterSpacing: 1.5,
                textTransform: "uppercase", marginBottom: 8,
              }}>With LIZA</div>
              <p style={{ fontSize: 16, color: TEXT, lineHeight: 1.45 }}>{m.after}</p>
            </div>
          </div>
        ))}
      </div>

      <Watermark />
      <PageNumber n={9} />
    </div>
  );
}

// ─── 10 · 30-day pilot ───────────────────────────────────────────────────────

function Slide10() {
  const weeks = [
    { wk: "Week 1", title: "Pick one live workstream", body: "One real partnership, competitor, or sector brief currently on the team's desk. No new tools for experts. We baseline today's time-to-brief." },
    { wk: "Week 2", title: "360 view assembled", body: "Standing entity profile lands. Prior internal work surfaces. The team starts the brief at 60 percent, not zero." },
    { wk: "Week 3", title: "Routing rail live", body: "Three named experts opt in. Sharp questions get routed in their preferred channel. First captured answers land in memory." },
    { wk: "Week 4", title: "First compounded reuse", body: "A second related brief starts. Half its answers are already in memory. The team measures time-to-brief and reuse rate against the baseline." },
  ];

  return (
    <div style={{ width: 1920, height: 1080, background: BG, position: "relative", padding: "100px 120px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Tag label="The 30-day pilot" color={GREEN} />
      <h2 style={{ marginTop: 28, fontSize: 76, fontWeight: 900, color: TEXT, letterSpacing: -1.5, maxWidth: 1500, lineHeight: 1.05 }}>
        One live workstream. Four weeks. Measured outcomes.
      </h2>
      <p style={{ marginTop: 18, fontSize: 22, color: MUTED, maxWidth: 1300 }}>
        No new tools forced on experts. No replacement of the strategy team's existing stack. We sit on top, prove the loop, and walk away with measured deltas.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 64 }}>
        {weeks.map((w, i) => (
          <div key={i} style={{
            background: BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 20,
            padding: 32, position: "relative",
          }}>
            <div style={{
              position: "absolute", top: -14, left: 24,
              padding: "6px 14px", borderRadius: 999,
              background: `hsl(${NAVY})`, color: BG,
              fontSize: 13, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase",
            }}>{w.wk}</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, color: TEXT, marginBottom: 18, marginTop: 16, lineHeight: 1.2 }}>{w.title}</h3>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.5 }}>{w.body}</p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 60, padding: "28px 36px", borderRadius: 16,
        background: CARD_ALT, border: `1px solid ${CARD_BORDER}`,
        display: "flex", alignItems: "center", gap: 24,
      }}>
        <Sparkles size={32} style={{ color: `hsl(${NAVY})`, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: TEXT, marginBottom: 6 }}>What you keep at day 30</div>
          <p style={{ fontSize: 18, color: MUTED, lineHeight: 1.5 }}>
            Working memory layer for the chosen workstream. Routing rail for the three pilot experts. Measured baseline and delta. A clear, no-pressure answer to whether to scale.
          </p>
        </div>
      </div>

      <Watermark />
      <PageNumber n={10} />
    </div>
  );
}

// ─── 11 · What changes in 30 days ────────────────────────────────────────────

function Slide11() {
  const deltas = [
    {
      metric: "Time to brief",
      from: "5 to 10 working days",
      to: "1 to 3 working days",
      icon: <Timer size={32} />,
    },
    {
      metric: "Expert response time",
      from: "2 to 8 days, often partial",
      to: "Hours, in the expert's channel",
      icon: <MessageSquare size={32} />,
    },
    {
      metric: "Reuse rate on similar briefs",
      from: "Effectively zero",
      to: "40 percent and rising",
      icon: <TrendingUp size={32} />,
    },
  ];

  return (
    <div style={{ width: 1920, height: 1080, background: BG, position: "relative", padding: "100px 120px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <Tag label="The deltas" color={GREEN} />
      <h2 style={{ marginTop: 28, fontSize: 76, fontWeight: 900, color: TEXT, letterSpacing: -1.5, maxWidth: 1500, lineHeight: 1.05 }}>
        What measurably changes in 30 days.
      </h2>
      <p style={{ marginTop: 18, fontSize: 22, color: MUTED, maxWidth: 1200 }}>
        Three numbers move. Each one shifts how the strategy office is perceived internally and how decisions land at the board.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, marginTop: 80 }}>
        {deltas.map((d, i) => (
          <div key={i} style={{
            background: BG, border: `1px solid ${CARD_BORDER}`, borderRadius: 24,
            padding: 44,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 14,
              background: `hsl(${GREEN} / 0.08)`, color: `hsl(${GREEN})`,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28,
            }}>{d.icon}</div>
            <div style={{
              fontSize: 16, color: SUBTLE, letterSpacing: 1.5, textTransform: "uppercase",
              fontWeight: 700, marginBottom: 16,
            }}>{d.metric}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16, marginTop: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: `hsl(${RED})`, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Today</div>
                <div style={{ fontSize: 20, color: TEXT, fontWeight: 700, lineHeight: 1.3 }}>{d.from}</div>
              </div>
              <ArrowRight size={24} style={{ color: `hsl(${GREEN})` }} />
              <div>
                <div style={{ fontSize: 12, color: `hsl(${GREEN})`, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>Day 30</div>
                <div style={{ fontSize: 20, color: TEXT, fontWeight: 700, lineHeight: 1.3 }}>{d.to}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p style={{
        marginTop: 56, fontSize: 18, color: SUBTLE, textAlign: "center",
        fontStyle: "italic", maxWidth: 1100, marginLeft: "auto", marginRight: "auto",
      }}>
        Targets are conservative for an opt-in pilot with three experts on one workstream. Compounding accelerates from month two onward.
      </p>

      <Watermark />
      <PageNumber n={11} />
    </div>
  );
}

// ─── 12 · Talk to us ─────────────────────────────────────────────────────────

function Slide12() {
  return (
    <div style={{ width: 1920, height: 1080, background: BG, position: "relative", overflow: "hidden", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{
        position: "absolute", top: -200, right: -200, width: 800, height: 800,
        borderRadius: "50%",
        background: `radial-gradient(circle, hsl(${NAVY} / 0.08), transparent 70%)`,
      }} />

      <div style={{ padding: "180px 140px", position: "relative", zIndex: 2 }}>
        <Tag label="Next step" color={NAVY} />

        <h1 style={{
          marginTop: 56, fontSize: 110, fontWeight: 900, lineHeight: 1.02,
          color: TEXT, letterSpacing: -2, maxWidth: 1500,
        }}>
          Pick the workstream.
          <br />
          <span style={{ color: `hsl(${NAVY})` }}>We'll handle the loop.</span>
        </h1>

        <p style={{ marginTop: 40, fontSize: 26, color: MUTED, maxWidth: 1200, lineHeight: 1.4 }}>
          One real brief on the team's desk this week. Four weeks. Measured deltas.
          No new tools forced on the experts. A clear answer at day 30 on whether to scale.
        </p>

        <div style={{
          marginTop: 80, display: "flex", alignItems: "center", gap: 32,
          padding: "32px 40px", borderRadius: 20,
          background: CARD_ALT, border: `1px solid ${CARD_BORDER}`, maxWidth: 880,
        }}>
          <img src={kristofPhoto} alt="Kristóf Éger" style={{ width: 96, height: 96, borderRadius: 999, objectFit: "cover" }} />
          <div>
            <div style={{ fontSize: 14, color: SUBTLE, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>
              Talk to
            </div>
            <div style={{ fontSize: 30, color: TEXT, fontWeight: 800, marginBottom: 8 }}>
              Kristóf Éger
            </div>
            <div style={{ fontSize: 18, color: MUTED }}>
              Founder · LIZA OS
            </div>
            <div style={{ fontSize: 16, color: `hsl(${NAVY})`, marginTop: 12, fontWeight: 600 }}>
              kristof@lizaos.ai
            </div>
          </div>
        </div>
      </div>

      <Watermark />
      <PageNumber n={12} />
    </div>
  );
}

// ─── Slide registry ──────────────────────────────────────────────────────────

const SLIDES = [
  { id: 1, title: "Cover", component: <Slide01 /> },
  { id: 2, title: "A Monday in the strategy team", component: <Slide02 /> },
  { id: 3, title: "Five frictions slowing every brief", component: <Slide03 /> },
  { id: 4, title: "What it costs the team", component: <Slide04 /> },
  { id: 5, title: "Why this stays broken", component: <Slide05 /> },
  { id: 6, title: "From asker to synthesiser", component: <Slide06 /> },
  { id: 7, title: "Five capabilities, one outcome", component: <Slide07 /> },
  { id: 8, title: "Memory and routing layer", component: <Slide08 /> },
  { id: 9, title: "Three live motions", component: <Slide09 /> },
  { id: 10, title: "30-day pilot", component: <Slide10 /> },
  { id: 11, title: "What changes in 30 days", component: <Slide11 /> },
  { id: 12, title: "Talk to us", component: <Slide12 /> },
];

const DECK_TITLE = "LIZA · Strategy Office OS";
const FILE_NAME = "LIZA-Strategy-Office-OS";

// ─── Main page ───────────────────────────────────────────────────────────────

export default function StrategyOfficeDeck() {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showNav, setShowNav] = useState(true);
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

  const enterFullscreen = useCallback(() => {
    document.documentElement.requestFullscreen?.();
    setIsFullscreen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "g" || e.key === "G") setShowGrid((v) => !v);
      else if (e.key === "f" || e.key === "F") enterFullscreen();
      else if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, enterFullscreen, isFullscreen]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      setShowNav(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowNav(false), 2500);
    };
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
              style={{ background: `hsl(${NAVY} / 0.1)`, border: `1px solid hsl(${NAVY} / 0.3)` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={`hsl(${NAVY})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              style={{ background: "linear-gradient(90deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Previous">
              <ChevronLeft size={32} style={{ color: `hsl(215 15% 42% / 0.5)` }} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); showMobileControls(); }} disabled={current === SLIDES.length - 1}
              className="absolute right-0 top-0 h-full w-[15%] z-[10001] flex items-center justify-end pr-4 disabled:opacity-0 transition-opacity"
              style={{ background: "linear-gradient(270deg, hsl(0 0% 0% / 0.06), transparent)" }} aria-label="Next">
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
          <ExportMenu exportRef={exportRef} fileName={FILE_NAME} slideCount={SLIDES.length} variant="mobile" iconColor={MUTED} />
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
        <ScaledSlide>{slide.component}</ScaledSlide>
        {showNav && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full shadow-lg"
            style={{ background: "hsl(0 0% 100% / 0.95)", border: `1px solid ${CHROME_BORDER}` }}>
            <button onClick={prev} disabled={current === 0} className="p-2 rounded-lg disabled:opacity-20">
              <ChevronLeft size={20} style={{ color: TEXT }} />
            </button>
            <span className="font-mono text-sm min-w-[60px] text-center" style={{ color: MUTED }}>
              {current + 1} / {SLIDES.length}
            </span>
            <button onClick={next} disabled={current === SLIDES.length - 1} className="p-2 rounded-lg disabled:opacity-20">
              <ChevronRight size={20} style={{ color: TEXT }} />
            </button>
            <div className="w-px h-5" style={{ background: CHROME_BORDER }} />
            <button onClick={() => document.exitFullscreen?.()} className="p-2 rounded-lg">
              <X size={18} style={{ color: MUTED }} />
            </button>
          </div>
        )}
        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
          {SLIDES.map(s => (
            <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
          ))}
        </div>
      </div>
    );
  }

  if (showGrid) {
    return (
      <div className="fixed inset-0 z-[9999] overflow-auto" style={{ background: CHROME_BG }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: CHROME_BORDER, background: BG }}>
          <h2 className="font-bold" style={{ fontSize: 20, color: TEXT }}>{DECK_TITLE}</h2>
          <div className="flex items-center gap-3">
            <ExportMenu exportRef={exportRef} fileName={FILE_NAME} slideCount={SLIDES.length} />
            <Button variant="outline" size="sm" onClick={() => setShowGrid(false)}>
              <X size={16} className="mr-1.5" /> Close
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-5 p-6">
          {SLIDES.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)}
              className={cn("rounded-xl overflow-hidden border-2 transition-all hover:shadow-lg text-left",
                i === current ? "ring-2 ring-offset-2" : "")}
              style={{ borderColor: i === current ? `hsl(${NAVY})` : CHROME_BORDER, aspectRatio: "16/9" }}>
              <div className="w-full h-full relative">
                <ScaledSlide>{s.component}</ScaledSlide>
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2" style={{ background: "hsl(0 0% 100% / 0.9)" }}>
                  <p className="font-semibold truncate" style={{ fontSize: 13, color: TEXT }}>
                    {i + 1}. {s.title}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
          {SLIDES.map(s => (
            <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: CHROME_BG }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: CHROME_BORDER, background: BG }}>
        <div className="flex items-center gap-4">
          <span className="font-bold" style={{ fontSize: 16, color: TEXT }}>{DECK_TITLE}</span>
          <span className="font-mono text-xs px-2 py-1 rounded" style={{ background: CARD_ALT, color: MUTED }}>
            {current + 1} / {SLIDES.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu exportRef={exportRef} fileName={FILE_NAME} slideCount={SLIDES.length} />
          <Button variant="ghost" size="sm" onClick={() => setShowGrid(true)}>
            <Grid3x3 size={16} className="mr-1.5" /> Grid
          </Button>
          <Button variant="ghost" size="sm" onClick={enterFullscreen}>
            <Maximize2 size={16} className="mr-1.5" /> Present
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        <button onClick={prev} disabled={current === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full disabled:opacity-10 hover:bg-white/80 transition-opacity z-10">
          <ChevronLeft size={24} style={{ color: MUTED }} />
        </button>

        <div className="w-full h-full max-w-[1200px] rounded-xl overflow-hidden shadow-lg border" style={{ borderColor: CHROME_BORDER, aspectRatio: "16/9" }}>
          <ScaledSlide>{slide.component}</ScaledSlide>
        </div>

        <button onClick={next} disabled={current === SLIDES.length - 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full disabled:opacity-10 hover:bg-white/80 transition-opacity z-10">
          <ChevronRight size={24} style={{ color: MUTED }} />
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 pb-4">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{ background: i === current ? `hsl(${NAVY})` : `hsl(215 10% 80%)` }} />
        ))}
      </div>

      <div ref={exportRef} style={{ position: 'fixed', left: '-9999px', top: 0, width: 1920, pointerEvents: 'none' }}>
        {SLIDES.map(s => (
          <div key={s.id} style={{ width: 1920, height: 1080, overflow: 'hidden', position: 'relative' }}>{s.component}</div>
        ))}
      </div>
    </div>
  );
}
