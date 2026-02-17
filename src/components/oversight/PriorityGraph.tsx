import { useState, useMemo, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ZoomIn, ZoomOut, Maximize2, Search, X } from "lucide-react";

// ── Types ──
interface GraphNode {
  id: string;
  label: string;
  type: "hub" | "horizon" | "task" | "session" | "delegation" | "plan_item";
  status?: string;
  priority?: string;
  horizon?: string;
  workbookId?: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  glowColor: string;
}

interface GraphEdge {
  from: string;
  to: string;
}

// ── Color palette ──
const NODE_STYLES: Record<string, { color: string; glow: string; radius: number }> = {
  hub:        { color: "hsl(var(--primary))",    glow: "hsl(var(--primary) / 0.4)", radius: 30 },
  horizon:    { color: "hsl(var(--accent-foreground) / 0.6)", glow: "hsl(var(--accent-foreground) / 0.15)", radius: 20 },
  task:       { color: "hsl(200, 80%, 55%)",     glow: "hsl(200, 80%, 55% / 0.3)", radius: 13 },
  session:    { color: "hsl(150, 70%, 50%)",     glow: "hsl(150, 70%, 50% / 0.3)", radius: 13 },
  delegation: { color: "hsl(38, 92%, 50%)",      glow: "hsl(38, 92%, 50% / 0.3)",  radius: 12 },
  plan_item:  { color: "hsl(260, 70%, 60%)",     glow: "hsl(260, 70%, 60% / 0.3)", radius: 11 },
};

const STATUS_COLORS: Record<string, string> = {
  todo: "hsl(var(--muted-foreground))",
  in_progress: "hsl(200, 80%, 55%)",
  done: "hsl(150, 70%, 50%)",
  blocked: "hsl(0, 70%, 55%)",
  paused: "hsl(38, 92%, 50%)",
  not_started: "hsl(var(--muted-foreground) / 0.6)",
};

const PRIORITY_BOOST: Record<string, number> = {
  critical: 4,
  high: 2,
  standard: 0,
  low: -2,
};

const HORIZON_LABELS: Record<string, string> = {
  next_hour: "⏱ Next Hour",
  today: "📅 Today",
  this_week: "📆 This Week",
  unplanned: "📋 Unplanned",
};

// ── Layout ──
function computeDashboardGraph(
  feedItems: any[],
  planItems: any[],
  centerX: number,
  centerY: number,
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Central hub
  nodes.push({
    id: "hub",
    label: "My Focus",
    type: "hub",
    x: centerX,
    y: centerY,
    radius: NODE_STYLES.hub.radius,
    color: NODE_STYLES.hub.color,
    glowColor: NODE_STYLES.hub.glow,
  });

  // Group plan items by horizon
  const planByHorizon: Record<string, any[]> = {};
  planItems.forEach(p => {
    const h = p.time_horizon || "today";
    if (!planByHorizon[h]) planByHorizon[h] = [];
    planByHorizon[h].push(p);
  });

  // Determine active horizons (ones with plan items)
  const horizons = ["next_hour", "today", "this_week"].filter(h => planByHorizon[h]?.length > 0);

  // Unplanned feed items (not in any plan)
  const plannedSourceIds = new Set(planItems.map(p => p.source_id).filter(Boolean));
  const unplannedFeed = feedItems.filter(f => !plannedSourceIds.has(f.id));

  // If we have unplanned items, add that sector
  const allSectors = [...horizons];
  if (unplannedFeed.length > 0) allSectors.push("unplanned");

  if (allSectors.length === 0 && feedItems.length === 0) return { nodes, edges };

  // If no sectors but have feed items, show them all as unplanned
  if (allSectors.length === 0 && feedItems.length > 0) {
    allSectors.push("unplanned");
  }

  const ringRadius1 = 140; // Horizon nodes
  const ringRadius2 = 260; // Leaf items

  const sectorAngle = (2 * Math.PI) / Math.max(allSectors.length, 1);
  const startAngle = -Math.PI / 2;

  allSectors.forEach((horizon, hi) => {
    const angle = startAngle + hi * sectorAngle;
    const hx = centerX + ringRadius1 * Math.cos(angle);
    const hy = centerY + ringRadius1 * Math.sin(angle);

    const horizonId = `horizon-${horizon}`;
    const items = horizon === "unplanned"
      ? unplannedFeed
      : (planByHorizon[horizon] || []);

    nodes.push({
      id: horizonId,
      label: HORIZON_LABELS[horizon] || horizon,
      type: "horizon",
      horizon,
      x: hx,
      y: hy,
      radius: NODE_STYLES.horizon.radius,
      color: NODE_STYLES.horizon.color,
      glowColor: NODE_STYLES.horizon.glow,
    });
    edges.push({ from: "hub", to: horizonId });

    // Place children around this horizon node
    const childCount = items.length;
    if (childCount === 0) return;

    const spreadAngle = sectorAngle * 0.8;
    const childStartAngle = angle - spreadAngle / 2;
    const childStep = childCount > 1 ? spreadAngle / (childCount - 1) : 0;

    items.forEach((item: any, ci: number) => {
      const childAngle = childCount === 1 ? angle : childStartAngle + ci * childStep;
      const cx = centerX + ringRadius2 * Math.cos(childAngle);
      const cy = centerY + ringRadius2 * Math.sin(childAngle);

      const isFromPlan = horizon !== "unplanned";
      const nodeType = isFromPlan
        ? (item.source_type === "session" ? "session" : item.source_type === "delegation" ? "delegation" : "plan_item")
        : (item.type === "session" ? "session" : item.type === "delegation" ? "delegation" : "task");

      const status = isFromPlan ? undefined : item.status;
      const style = NODE_STYLES[nodeType] || NODE_STYLES.task;

      nodes.push({
        id: isFromPlan ? `plan-${item.id}` : `feed-${item.id}`,
        label: item.title,
        type: nodeType,
        status,
        priority: isFromPlan ? undefined : item.priority,
        workbookId: isFromPlan ? undefined : item.workbook_id || item.workbookId,
        x: cx,
        y: cy,
        radius: style.radius,
        color: status ? (STATUS_COLORS[status] || style.color) : style.color,
        glowColor: style.glow,
      });
      edges.push({ from: horizonId, to: isFromPlan ? `plan-${item.id}` : `feed-${item.id}` });
    });
  });

  return { nodes, edges };
}

// ── Edge component ──
function NeuralEdge({ from, to, nodes }: { from: string; to: string; nodes: GraphNode[] }) {
  const fromNode = nodes.find(n => n.id === from);
  const toNode = nodes.find(n => n.id === to);
  if (!fromNode || !toNode) return null;

  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return null;

  const mx = (fromNode.x + toNode.x) / 2;
  const my = (fromNode.y + toNode.y) / 2;
  const perpX = -dy / dist * (dist * 0.1);
  const perpY = dx / dist * (dist * 0.1);

  const path = `M ${fromNode.x} ${fromNode.y} Q ${mx + perpX} ${my + perpY} ${toNode.x} ${toNode.y}`;

  return (
    <g>
      <path d={path} fill="none" stroke="hsl(var(--muted-foreground) / 0.15)" strokeWidth={1.5} />
      <path d={path} fill="none" stroke={toNode.color} strokeWidth={1} opacity={0.4} strokeDasharray="6 8" className="animate-neural-pulse" />
      <circle r={2.5} fill={toNode.color} opacity={0.8}>
        <animateMotion dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" path={path} />
      </circle>
    </g>
  );
}

// ── Node component ──
function GraphNodeEl({
  node, isSelected, onSelect, onHover,
}: {
  node: GraphNode;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}) {
  const icon = node.type === "hub" ? "⚡" : node.type === "horizon" ? "◉"
    : node.type === "task" ? "◆" : node.type === "session" ? "▶"
    : node.type === "delegation" ? "↗" : "◇";

  return (
    <g
      className="cursor-pointer"
      onClick={() => onSelect(isSelected ? null : node.id)}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      <circle cx={node.x} cy={node.y} r={node.radius + (isSelected ? 8 : 4)} fill="none" stroke={node.color} strokeWidth={isSelected ? 2 : 1} opacity={isSelected ? 0.6 : 0.2} className={isSelected ? "animate-pulse" : ""} />
      <circle cx={node.x} cy={node.y} r={node.radius + 12} fill={node.glowColor} opacity={isSelected ? 0.15 : 0.05} />
      <circle cx={node.x} cy={node.y} r={node.radius} fill={node.color} opacity={0.9} stroke={isSelected ? "hsl(var(--foreground))" : "transparent"} strokeWidth={isSelected ? 2 : 0} />
      <circle cx={node.x - node.radius * 0.25} cy={node.y - node.radius * 0.25} r={node.radius * 0.35} fill="white" opacity={0.15} />
      <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" fill="white" fontSize={node.type === "hub" ? 14 : node.type === "horizon" ? 11 : 9} fontWeight="bold">
        {icon}
      </text>
      <text x={node.x} y={node.y + node.radius + 14} textAnchor="middle" fill="hsl(var(--foreground))" fontSize={node.type === "hub" ? 11 : 9} fontWeight={node.type === "hub" ? 600 : 400} opacity={0.85}>
        {node.label.length > 22 ? node.label.slice(0, 20) + "…" : node.label}
      </text>
      {node.status && (
        <text x={node.x} y={node.y + node.radius + 25} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={7} opacity={0.7}>
          {node.status.replace("_", " ")}
        </text>
      )}
    </g>
  );
}

// ── Main Component ──
export function PriorityGraph() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [graphSearch, setGraphSearch] = useState("");

  // Fetch plan items
  const { data: planItems = [] } = useQuery({
    queryKey: ["priority-graph-plans", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("operator_plan_items")
        .select("id, title, source_type, source_id, time_horizon, is_completed, sort_order")
        .eq("user_id", user!.id)
        .eq("is_completed", false)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  // Fetch feed items (tasks + sessions)
  const { data: myTasks = [] } = useQuery({
    queryKey: ["priority-graph-tasks", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_tasks")
        .select("id, workbook_id, title, status, priority, assigned_to, created_by")
        .or(`assigned_to.eq.${user!.id},created_by.eq.${user!.id}`)
        .not("status", "in", '("done","cancelled")');
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: mySessions = [] } = useQuery({
    queryKey: ["priority-graph-sessions", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("protocol_executions")
        .select("id, workbook_id, status, workbook_protocols(title)")
        .eq("executed_by", user!.id)
        .in("status", ["in_progress", "paused", "not_started"]);
      if (error) throw error;
      return (data ?? []).map(s => ({
        id: s.id,
        workbook_id: s.workbook_id,
        title: (s as any).workbook_protocols?.title ?? "Session",
        status: s.status,
        type: "session" as const,
      }));
    },
  });

  const feedItems = useMemo(() => {
    const items: any[] = [];
    myTasks.filter(t => t.assigned_to === user?.id).forEach(t => {
      items.push({ ...t, type: t.created_by !== user?.id || t.assigned_to === user?.id ? "task" : "delegation" });
    });
    // Delegations
    myTasks.filter(t => t.created_by === user?.id && t.assigned_to && t.assigned_to !== user?.id).forEach(t => {
      items.push({ ...t, type: "delegation" });
    });
    mySessions.forEach(s => items.push(s));
    return items;
  }, [myTasks, mySessions, user?.id]);

  const centerX = 400;
  const centerY = 320;

  const { nodes, edges } = useMemo(
    () => computeDashboardGraph(feedItems, planItems, centerX, centerY),
    [feedItems, planItems]
  );

  const matchingNodeIds = useMemo(() => {
    if (!graphSearch) return null;
    const q = graphSearch.toLowerCase();
    return new Set(nodes.filter(n => n.label.toLowerCase().includes(q)).map(n => n.id));
  }, [nodes, graphSearch]);

  const selectedInfo = nodes.find(n => n.id === selectedNode);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(3, z - e.deltaY * 0.001)));
  }, []);

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">🧠 Priority Map</h3>
          <Badge variant="outline" className="text-[9px] gap-1">
            {nodes.length} nodes · {edges.length} connections
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input placeholder="Search…" value={graphSearch} onChange={e => setGraphSearch(e.target.value)} className="pl-7 h-7 w-32 text-xs" />
            {graphSearch && (
              <button onClick={() => setGraphSearch("")} className="absolute right-1.5 top-1/2 -translate-y-1/2">
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(3, z + 0.2))}><ZoomIn className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(0.3, z - 0.2))}><ZoomOut className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetView}><Maximize2 className="h-3.5 w-3.5" /></Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground flex-wrap">
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.task.color }} /> Task</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.session.color }} /> Session</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.delegation.color }} /> Delegation</span>
        <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.plan_item.color }} /> Planned</span>
      </div>

      {/* SVG Canvas */}
      <div
        ref={containerRef}
        className="relative rounded-xl border border-border/50 bg-card/50 overflow-hidden select-none"
        style={{ height: 420 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg width="100%" height="100%" viewBox="0 0 800 640" className="cursor-grab active:cursor-grabbing">
          <defs>
            <radialGradient id="priority-bg-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.03)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="priority-node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            <rect width="800" height="640" fill="url(#priority-bg-gradient)" />
            <circle cx={centerX} cy={centerY} r={140} fill="none" stroke="hsl(var(--border) / 0.15)" strokeWidth={0.5} strokeDasharray="4 6" />
            <circle cx={centerX} cy={centerY} r={260} fill="none" stroke="hsl(var(--border) / 0.1)" strokeWidth={0.5} strokeDasharray="4 6" />

            {edges.map(edge => (
              <NeuralEdge key={`${edge.from}-${edge.to}`} from={edge.from} to={edge.to} nodes={nodes} />
            ))}

            {nodes.map(node => (
              <g key={node.id} opacity={matchingNodeIds && !matchingNodeIds.has(node.id) ? 0.15 : 1}>
                <GraphNodeEl node={node} isSelected={selectedNode === node.id} onSelect={setSelectedNode} onHover={setHoveredNode} />
              </g>
            ))}
          </g>
        </svg>

        {/* Hover tooltip */}
        {hoveredNode && hoveredNode !== selectedNode && (() => {
          const n = nodes.find(nd => nd.id === hoveredNode);
          if (!n) return null;
          return (
            <div
              className="absolute pointer-events-none bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs z-10"
              style={{
                left: `${(n.x * zoom + pan.x) / 800 * 100}%`,
                top: `${(n.y * zoom + pan.y) / 640 * 100 - 6}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="font-medium">{n.label}</div>
              <div className="text-muted-foreground capitalize">{n.type.replace("_", " ")}{n.status ? ` · ${n.status.replace("_", " ")}` : ""}{n.horizon ? ` · ${n.horizon.replace("_", " ")}` : ""}</div>
            </div>
          );
        })()}

        {/* Selected detail panel */}
        {selectedInfo && selectedInfo.type !== "hub" && (
          <div className="absolute bottom-3 left-3 right-3 bg-popover/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ background: selectedInfo.color }} />
                <span className="text-sm font-medium">{selectedInfo.label}</span>
                <Badge variant="outline" className="text-[9px] capitalize">{selectedInfo.type.replace("_", " ")}</Badge>
                {selectedInfo.status && <Badge variant="secondary" className="text-[9px] capitalize">{selectedInfo.status.replace("_", " ")}</Badge>}
                {selectedInfo.priority && <Badge variant="secondary" className="text-[9px] capitalize">{selectedInfo.priority}</Badge>}
              </div>
              <div className="flex items-center gap-1">
                {selectedInfo.workbookId && (
                  <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={() => navigate(`/workbooks/${selectedInfo.workbookId}`)}>
                    Open Workbook →
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setSelectedNode(null)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
