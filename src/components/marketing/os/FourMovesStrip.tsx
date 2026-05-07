import { Radar, Scale, Workflow as WorkflowIcon, Share2 } from "lucide-react";
import { SectionTag, GradientText } from "@/components/marketing/home/shared";

const MOVES = [
  {
    icon: <Radar className="w-5 h-5" />,
    title: "Sense",
    body: "Capture context that was never written down. Tacit judgment, SOPs, and live operational data become one structured surface.",
  },
  {
    icon: <Scale className="w-5 h-5" />,
    title: "Decide",
    body: "Standards, mandates, and playbooks become a runtime check that every AI request must pass. Inspectable, auditable, versioned.",
  },
  {
    icon: <WorkflowIcon className="w-5 h-5" />,
    title: "Execute",
    body: "Copilot, Claude, internal agents, and your people all operate inside the same governed workbook. Bound to the same standard.",
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: "Propagate",
    body: "When a standard or upstream artifact changes, every dependent output is regenerated. Contradictions resolve across the chain.",
  },
];

const TOKEN_PILL = "hsl(var(--primary) / 0.1)";
const PRIMARY = "hsl(var(--primary))";

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
              className="rounded-2xl border p-5 flex flex-col"
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
              </div>
              <h3 className="text-lg font-black mb-2">{m.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
