import { useState } from "react";
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

const NODE_POSITIONS: Record<ContextCategory, { x: number; y: number }> = {
  PLAYBOOK:   { x: 350, y: 80 },
  PROCEDURE:  { x: 560, y: 180 },
  DIRECTIVE:  { x: 540, y: 340 },
  KNOWLEDGE:  { x: 350, y: 420 },
  RESEARCH:   { x: 160, y: 340 },
  PRINCIPLE:  { x: 140, y: 180 },
  PREFERENCE: { x: 350, y: 250 },
};

/** Color per category for highlighted edges */
const EDGE_HIGHLIGHT_COLORS: Record<ContextCategory, string> = {
  DIRECTIVE: "hsl(45, 93%, 58%)",
  KNOWLEDGE: "hsl(217, 91%, 60%)",
  PROCEDURE: "hsl(187, 72%, 55%)",
  PLAYBOOK: "hsl(25, 95%, 53%)",
  PREFERENCE: "hsl(330, 81%, 60%)",
  RESEARCH: "hsl(160, 60%, 45%)",
  PRINCIPLE: "hsl(270, 67%, 60%)",
};

interface TaxonomyDiagramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaxonomyDiagramDialog({ open, onOpenChange }: TaxonomyDiagramDialogProps) {
  const [hoveredCat, setHoveredCat] = useState<ContextCategory | null>(null);

  /** Check if an edge is connected to hovered category */
  const isEdgeConnected = (from: ContextCategory, to: ContextCategory) => {
    if (!hoveredCat) return false;
    return from === hoveredCat || to === hoveredCat;
  };

  /** Check if a node is connected to hovered category */
  const isNodeConnected = (cat: ContextCategory) => {
    if (!hoveredCat) return false;
    if (cat === hoveredCat) return true;
    return EDGES.some(([from, to]) =>
      (from === hoveredCat && to === cat) || (to === hoveredCat && from === cat)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-base">Category Taxonomy</DialogTitle>
          <p className="text-xs text-muted-foreground">
            Hover over a category to highlight its connections.
          </p>
        </DialogHeader>
        <div className="relative w-full" style={{ height: 500 }}>
          <svg
            viewBox="0 0 700 500"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            onMouseLeave={() => setHoveredCat(null)}
          >
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6" fill="hsl(var(--muted-foreground))" opacity="0.4" />
              </marker>
              <marker id="arrow-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <path d="M0,0 L8,3 L0,6" fill="hsl(var(--primary))" opacity="0.9" />
              </marker>
              {/* Per-category colored arrow markers */}
              {(Object.keys(NODE_POSITIONS) as ContextCategory[]).map((cat) => (
                <marker key={cat} id={`arrow-${cat}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill={EDGE_HIGHLIGHT_COLORS[cat]} opacity="0.9" />
                </marker>
              ))}
              {/* Glow filter for hovered node */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {EDGES.map(([from, to, label], i) => {
              const f = NODE_POSITIONS[from];
              const t = NODE_POSITIONS[to];
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
              const perpX = -(ey - sy) * 0.08;
              const perpY = (ex - sx) * 0.08;

              const connected = isEdgeConnected(from, to);
              const dimmed = hoveredCat && !connected;
              const highlightColor = hoveredCat ? EDGE_HIGHLIGHT_COLORS[hoveredCat] : undefined;

              return (
                <g key={i} style={{ transition: "opacity 0.2s ease" }} opacity={dimmed ? 0.08 : 1}>
                  <path
                    d={`M${sx},${sy} Q${mx + perpX},${my + perpY} ${ex},${ey}`}
                    fill="none"
                    stroke={connected && highlightColor ? highlightColor : "hsl(var(--muted-foreground))"}
                    strokeWidth={connected ? 2.5 : 1}
                    opacity={connected ? 0.85 : 0.25}
                    markerEnd={connected && hoveredCat ? `url(#arrow-${hoveredCat})` : "url(#arrow)"}
                    style={{ transition: "stroke-width 0.2s ease, opacity 0.2s ease, stroke 0.2s ease" }}
                  />
                  <text
                    x={mx + perpX}
                    y={my + perpY - 4}
                    textAnchor="middle"
                    fill={connected && highlightColor ? highlightColor : undefined}
                    className={connected ? "" : "fill-muted-foreground"}
                    fontSize={connected ? "10" : "9"}
                    fontWeight={connected ? "600" : "400"}
                    opacity={connected ? 0.95 : 0.5}
                    style={{ transition: "opacity 0.2s ease, font-size 0.2s ease" }}
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
                const isHovered = hoveredCat === cat;
                const connected = isNodeConnected(cat);
                const dimmed = hoveredCat && !connected;

                return (
                  <g
                    key={cat}
                    onMouseEnter={() => setHoveredCat(cat)}
                    style={{
                      cursor: "pointer",
                      transition: "opacity 0.2s ease",
                      opacity: dimmed ? 0.2 : 1,
                    }}
                  >
                    {/* Highlight ring for hovered node */}
                    {isHovered && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r="40"
                        fill="none"
                        stroke={EDGE_HIGHLIGHT_COLORS[cat]}
                        strokeWidth="2"
                        opacity="0.5"
                        filter="url(#glow)"
                      >
                        <animate attributeName="r" from="38" to="42" dur="1.5s" repeatCount="indefinite" values="38;42;38" />
                        <animate attributeName="opacity" from="0.5" to="0.2" dur="1.5s" repeatCount="indefinite" values="0.5;0.2;0.5" />
                      </circle>
                    )}
                    {/* Outer glow */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="34"
                      className="fill-muted/30"
                      style={{ transition: "r 0.2s ease" }}
                    />
                    {/* Inner circle */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isHovered ? 30 : 28}
                      className="fill-card"
                      stroke={isHovered ? EDGE_HIGHLIGHT_COLORS[cat] : "hsl(var(--border))"}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      style={{ transition: "r 0.2s ease, stroke-width 0.2s ease, stroke 0.2s ease" }}
                    />
                    {/* First letter */}
                    <text
                      x={pos.x}
                      y={pos.y - 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="fill-foreground"
                      fontSize={isHovered ? 16 : 14}
                      fontWeight="600"
                      style={{ transition: "font-size 0.2s ease" }}
                    >
                      {label.charAt(0)}
                    </text>
                    {/* Label */}
                    <text
                      x={pos.x}
                      y={pos.y + 46}
                      textAnchor="middle"
                      fill={isHovered ? EDGE_HIGHLIGHT_COLORS[cat] : undefined}
                      className={isHovered ? "" : "fill-foreground"}
                      fontSize={isHovered ? 12 : 11}
                      fontWeight={isHovered ? "700" : "600"}
                      style={{ transition: "font-size 0.2s ease" }}
                    >
                      {label}
                    </text>
                    {/* Short description */}
                    <foreignObject x={pos.x - 70} y={pos.y + 52} width="140" height="30">
                      <p className="text-[8px] text-muted-foreground text-center leading-tight" style={{ transition: "opacity 0.2s ease", opacity: dimmed ? 0.3 : 1 }}>
                        {desc.length > 50 ? desc.slice(0, 50) + "…" : desc}
                      </p>
                    </foreignObject>
                  </g>
                );
              }
            )}
          </svg>
        </div>

        {/* Legend table */}
        <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto">
          {(Object.keys(NODE_POSITIONS) as ContextCategory[]).map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            const color = CATEGORY_COLORS[cat];
            const isHighlighted = hoveredCat === cat;
            return (
              <div
                key={cat}
                className={cn(
                  "flex items-start gap-2 rounded-md px-3 py-1.5 transition-colors duration-200 cursor-pointer",
                  isHighlighted ? "bg-primary/10 ring-1 ring-primary/30" : "bg-muted/20 hover:bg-muted/40"
                )}
                onMouseEnter={() => setHoveredCat(cat)}
                onMouseLeave={() => setHoveredCat(null)}
              >
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
