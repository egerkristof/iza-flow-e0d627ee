import { Radar, Scale, Workflow as WorkflowIcon, Share2, FileText, Mail, MessagesSquare, Database, ShieldCheck, CheckCircle2, Bot, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionTag, GradientText } from "@/components/marketing/home/shared";

const TOKEN_PILL = "hsl(var(--primary) / 0.1)";
const PRIMARY = "hsl(var(--primary))";
const GREEN = "hsl(var(--brand-green))";

/* ---------- Tiny per-move visuals ---------- */

function SenseVisual() {
  // Scattered signals on the left, funneling into one structured node on the right
  const sources = [
    { icon: <FileText className="w-3 h-3" />, y: 8 },
    { icon: <Mail className="w-3 h-3" />, y: 32 },
    { icon: <MessagesSquare className="w-3 h-3" />, y: 56 },
    { icon: <Database className="w-3 h-3" />, y: 80 },
  ];
  return (
    <svg viewBox="0 0 180 100" className="w-full h-full">
      {sources.map((s, i) => (
        <line key={i} x1="32" y1={s.y + 8} x2="138" y2="50"
          stroke={PRIMARY} strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="2 3" />
      ))}
      {sources.map((s, i) => (
        <foreignObject key={i} x="10" y={s.y} width="22" height="16">
          <div className="w-full h-full flex items-center justify-center rounded border"
            style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))", color: PRIMARY }}>
            {s.icon}
          </div>
        </foreignObject>
      ))}
      <foreignObject x="138" y="38" width="34" height="24">
        <div className="w-full h-full rounded-md flex items-center justify-center text-[8px] font-black tracking-widest uppercase"
          style={{ background: PRIMARY + "1f", color: PRIMARY, border: `1px solid ${PRIMARY}55` }}>
          context
        </div>
      </foreignObject>
    </svg>
  );
}

function DecideVisual() {
  // An AI request passes through a stack of standard checks
  const checks = ["Mandate", "Playbook", "Policy"];
  return (
    <svg viewBox="0 0 180 100" className="w-full h-full">
      <foreignObject x="6" y="38" width="36" height="24">
        <div className="w-full h-full rounded-md flex items-center justify-center text-[8px] font-black tracking-widest uppercase"
          style={{ background: "hsl(var(--background))", color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }}>
          request
        </div>
      </foreignObject>
      <line x1="42" y1="50" x2="62" y2="50" stroke={PRIMARY} strokeWidth="1" strokeOpacity="0.6" />
      {checks.map((c, i) => (
        <foreignObject key={c} x={62 + i * 36} y={28 + (i % 2) * 24} width="32" height="20">
          <div className="w-full h-full rounded flex items-center justify-center gap-1 text-[8px] font-bold"
            style={{ background: PRIMARY + "14", color: PRIMARY, border: `1px solid ${PRIMARY}40` }}>
            <ShieldCheck className="w-2.5 h-2.5" />{c}
          </div>
        </foreignObject>
      ))}
      <foreignObject x="138" y="38" width="36" height="24">
        <div className="w-full h-full rounded-md flex items-center justify-center gap-1 text-[8px] font-black uppercase tracking-widest"
          style={{ background: GREEN + "1f", color: GREEN, border: `1px solid ${GREEN}55` }}>
          <CheckCircle2 className="w-2.5 h-2.5" /> pass
        </div>
      </foreignObject>
    </svg>
  );
}

function ExecuteVisual() {
  // Mini workspace: tabs + agents working
  const agents = [
    { name: "Copilot", icon: <Sparkles className="w-2.5 h-2.5" /> },
    { name: "Claude", icon: <Bot className="w-2.5 h-2.5" /> },
    { name: "Agent", icon: <Bot className="w-2.5 h-2.5" /> },
  ];
  return (
    <div className="w-full h-full rounded-md border overflow-hidden flex flex-col"
      style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}>
      <div className="flex items-center gap-1 px-1.5 py-1 border-b"
        style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: PRIMARY + "66" }} />
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN + "66" }} />
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--muted-foreground) / 0.4)" }} />
        <span className="ml-2 text-[7px] tracking-widest uppercase font-black text-muted-foreground">workbook</span>
      </div>
      <div className="flex-1 p-1.5 grid grid-cols-3 gap-1">
        {agents.map((a) => (
          <div key={a.name} className="rounded flex flex-col items-center justify-center gap-0.5 py-1"
            style={{ background: PRIMARY + "10", border: `1px solid ${PRIMARY}30`, color: PRIMARY }}>
            {a.icon}
            <span className="text-[7px] font-bold">{a.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PropagateVisual() {
  // One node changes, ripple updates downstream nodes
  const nodes = [
    { x: 50, y: 25 }, { x: 50, y: 75 },
    { x: 95, y: 50 },
    { x: 140, y: 25 }, { x: 140, y: 75 },
  ];
  return (
    <svg viewBox="0 0 180 100" className="w-full h-full">
      {/* Source */}
      <circle cx="20" cy="50" r="8" fill={PRIMARY} fillOpacity="0.18" stroke={PRIMARY} strokeWidth="1.2" />
      <motion.circle cx="20" cy="50" r="8" fill="none" stroke={PRIMARY} strokeWidth="1"
        animate={{ r: [8, 18, 8], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
      />
      {/* Edges */}
      {nodes.map((n, i) => (
        <line key={`e1-${i}`} x1="28" y1="50" x2={n.x} y2={n.y} stroke={GREEN} strokeWidth="0.8" strokeOpacity="0.45" strokeDasharray="2 3" />
      ))}
      {/* Downstream nodes */}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="5" fill={GREEN} fillOpacity="0.18" stroke={GREEN} strokeWidth="1" />
          <motion.circle cx={n.x} cy={n.y} r="5" fill={GREEN}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.4] }}
            transition={{ duration: 1.4, delay: 0.4 + i * 0.18, repeat: Infinity, repeatDelay: 1 }}
          />
        </g>
      ))}
    </svg>
  );
}

const MOVES = [
  {
    icon: <Radar className="w-5 h-5" />,
    title: "Sense",
    body: "Pull context from docs, email, chat, and systems of record. Tacit judgment becomes one structured surface.",
    visual: <SenseVisual />,
  },
  {
    icon: <Scale className="w-5 h-5" />,
    title: "Decide",
    body: "Every AI request is checked against your standards, mandates, and playbooks before it runs.",
    visual: <DecideVisual />,
  },
  {
    icon: <WorkflowIcon className="w-5 h-5" />,
    title: "Execute with AI",
    body: "Copilot, Claude, and your own agents all run inside one governed workbook, bound to the same standard.",
    visual: <ExecuteVisual />,
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: "Propagate",
    body: "When a standard or upstream artifact changes, every dependent output is updated downstream. Nothing drifts.",
    visual: <PropagateVisual />,
  },
];

export function FourMovesStrip() {
  return (
    <section className="py-16 md:py-20 px-6" style={{ background: "hsl(var(--card))" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <SectionTag label="What the system actually does" />
          <h2 className="text-3xl md:text-4xl font-black">
            Four moves. <GradientText>Run continuously.</GradientText>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            One closed loop. The diagram below is this loop, made interactive for your industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOVES.map((m, i) => (
            <div
              key={m.title}
              className="relative rounded-2xl border p-5 flex flex-col"
              style={{ background: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: TOKEN_PILL, color: PRIMARY }}
                >
                  {m.icon}
                </div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
                  0{i + 1}
                </span>
                {i < MOVES.length - 1 && (
                  <ArrowRight className="hidden lg:block w-3.5 h-3.5 ml-auto text-muted-foreground/40" />
                )}
              </div>
              <h3 className="text-lg font-black mb-2">{m.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">{m.body}</p>
              <div
                className="mt-auto rounded-lg border h-[88px] p-2"
                style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
              >
                {m.visual}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
