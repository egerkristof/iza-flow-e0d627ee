import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_DESCRIPTIONS, CATEGORY_RELATIONSHIPS, type ContextCategory } from "@/lib/knowledge-schema";
import { cn } from "@/lib/utils";
import {
  Gavel, BookOpen, ListChecks, Map, SlidersHorizontal,
  FlaskConical, Compass,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, typeof BookOpen> = {
  DIRECTIVE: Gavel,
  KNOWLEDGE: BookOpen,
  PROCEDURE: ListChecks,
  PLAYBOOK: Map,
  PREFERENCE: SlidersHorizontal,
  RESEARCH: FlaskConical,
  PRINCIPLE: Compass,
};

/**
 * Edges between categories — describes "flows into / informs / enforces" relationships.
 * Each edge: [from, to, label]
 */
const EDGES: [ContextCategory, ContextCategory, string][] = [
  ["PRINCIPLE", "DIRECTIVE", "guides"],
  ["PRINCIPLE", "PLAYBOOK", "shapes"],
  ["PRINCIPLE", "PREFERENCE", "shapes"],
  ["RESEARCH", "KNOWLEDGE", "feeds into"],
  ["RESEARCH", "DIRECTIVE", "informs"],
  ["RESEARCH", "PLAYBOOK", "informs"],
  ["KNOWLEDGE", "PROCEDURE", "used by"],
  ["KNOWLEDGE", "PLAYBOOK", "referenced by"],
  ["KNOWLEDGE", "DIRECTIVE", "referenced by"],
  ["DIRECTIVE", "PLAYBOOK", "enforced in"],
  ["DIRECTIVE", "PROCEDURE", "enforced in"],
  ["PROCEDURE", "PLAYBOOK", "part of"],
  ["PREFERENCE", "PROCEDURE", "shapes execution"],
  ["PREFERENCE", "PLAYBOOK", "shapes execution"],
];

/** Node positions in a circle layout — hand-tuned for visual clarity */
const NODE_POSITIONS: Record<ContextCategory, { x: number; y: number }> = {
  PLAYBOOK:   { x: 350, y: 80 },
  PROCEDURE:  { x: 560, y: 180 },
  DIRECTIVE:  { x: 540, y: 340 },
  KNOWLEDGE:  { x: 350, y: 420 },
  RESEARCH:   { x: 160, y: 340 },
  PRINCIPLE:  { x: 140, y: 180 },
  PREFERENCE: { x: 350, y: 250 },
};

interface TaxonomyDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaxonomyDiagramDialog({ open, onOpenChange }: TaxonomyDiagramDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-base">Category Taxonomy</DialogTitle>
          <p className="text-xs text-muted-foreground">How the 7 knowledge categories relate to each other in the AACE framework.</p>
        </DialogHeader>
        <div className="relative w-full" style={{ height: 500 }}>
          <svg viewBox="0 0 700 500" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6" fill="hsl(var(--muted-foreground))" opacity="0.4" />
              </marker>
            </defs>

            {/* Edges */}
            {EDGES.map(([from, to, label], i) => {
              const f = NODE_POSITIONS[from];
              const t = NODE_POSITIONS[to];
              // Offset to avoid overlapping the node circles
              const dx = t.x - f.x;
              const dy = t.y - f.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const nodeR = 36;
              const sx = f.x + (dx / dist) * nodeR;
              const sy = f.y + (dy / dist) * nodeR;
              const ex = t.x - (dx / dist) * nodeR;
              const ey = t.y - (dy / dist) * nodeR;
              const mx = (sx + ex) / 2;
              const my = (sy + ey) / 2;
              // Slight curve for overlapping paths
              const perpX = -(ey - sy) * 0.08;
              const perpY = (ex - sx) * 0.08;

              return (
                <g key={i}>
                  <path
                    d={`M${sx},${sy} Q${mx + perpX},${my + perpY} ${ex},${ey}`}
                    fill="none"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth="1"
                    opacity="0.25"
                    markerEnd="url(#arrow)"
                  />
                  <text
                    x={mx + perpX}
                    y={my + perpY - 4}
                    textAnchor="middle"
                    className="fill-muted-foreground"
                    fontSize="9"
                    opacity="0.5"
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {(Object.entries(NODE_POSITIONS) as [ContextCategory, { x: number; y: number }][]).map(
              ([cat, pos]) => {
                const label = CATEGORY_LABELS[cat];
                const desc = CATEGORY_DESCRIPTIONS[cat];
                const rel = CATEGORY_RELATIONSHIPS[cat];

                return (
                  <g key={cat}>
                    {/* Outer glow */}
                    <circle cx={pos.x} cy={pos.y} r="34" className="fill-muted/30" />
                    {/* Inner circle */}
                    <circle cx={pos.x} cy={pos.y} r="28" className="fill-card stroke-border" strokeWidth="1.5" />
                    {/* Icon placeholder — using first letter as fallback since SVG can't render React icons */}
                    <text
                      x={pos.x}
                      y={pos.y - 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-foreground"
                      fontSize="14"
                      fontWeight="600"
                    >
                      {label.charAt(0)}
                    </text>
                    {/* Label */}
                    <text
                      x={pos.x}
                      y={pos.y + 46}
                      textAnchor="middle"
                      className="fill-foreground"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {label}
                    </text>
                    {/* Short description */}
                    <foreignObject x={pos.x - 70} y={pos.y + 52} width="140" height="30">
                      <p className="text-[8px] text-muted-foreground text-center leading-tight">
                        {desc.length > 50 ? desc.slice(0, 50) + "…" : desc}
                      </p>
                    </foreignObject>
                  </g>
                );
              }
            )}
          </svg>
        </div>

        {/* Legend table below */}
        <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto">
          {(Object.keys(NODE_POSITIONS) as ContextCategory[]).map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            const color = CATEGORY_COLORS[cat];
            return (
              <div key={cat} className="flex items-start gap-2 rounded-md px-3 py-1.5 bg-muted/20">
                <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium shrink-0 mt-0.5", color)}>
                  <Icon className="h-3 w-3" />
                  {CATEGORY_LABELS[cat]}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] text-foreground">{CATEGORY_DESCRIPTIONS[cat]}</p>
                  <p className="text-[10px] text-muted-foreground">🔗 {CATEGORY_RELATIONSHIPS[cat]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
