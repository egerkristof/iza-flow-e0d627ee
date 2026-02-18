import { useState, useMemo, useCallback, useRef, forwardRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Search, X, Plus, Clock, Calendar, CalendarDays, Expand } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ── Types ──
interface GraphNode {
  id: string;
  label: string;
  type: "hub" | "horizon" | "task" | "session" | "delegation" | "plan_item";
  status?: string;
  priority?: string;
  horizon?: string;
  workbookId?: string;
  sourceId?: string;
  sourceType?: string;
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

// ── Color palette — brand-aligned ──
const NODE_STYLES: Record<string, { color: string; glow: string; radius: number }> = {
  hub:        { color: "hsl(200 90% 52%)",  glow: "hsl(200 90% 52% / 0.5)", radius: 30 },
  horizon:    { color: "hsl(215 30% 55%)",  glow: "hsl(215 30% 55% / 0.2)", radius: 20 },
  task:       { color: "hsl(200 90% 55%)",  glow: "hsl(200 90% 55% / 0.45)", radius: 13 },
  session:    { color: "hsl(155 72% 46%)",  glow: "hsl(155 72% 46% / 0.45)", radius: 13 },
  delegation: { color: "hsl(38 92% 50%)",   glow: "hsl(38 92% 50% / 0.4)",  radius: 12 },
  plan_item:  { color: "hsl(175 65% 48%)",  glow: "hsl(175 65% 48% / 0.4)", radius: 11 },
};

const STATUS_COLORS: Record<string, string> = {
  todo: "hsl(var(--muted-foreground))",
  in_progress: "hsl(200 90% 55%)",
  done: "hsl(155 72% 46%)",
  blocked: "hsl(0 70% 55%)",
  paused: "hsl(38 92% 50%)",
  not_started: "hsl(var(--muted-foreground) / 0.6)",
};

const PRIORITY_BOOST: Record<string, number> = {
  critical: 4,
  high: 2,
  standard: 0,
  low: -2,
};

const HORIZON_LABELS: Record<string, string> = {
  next_hour: "Next Hour",
  today: "Today",
  this_week: "This Week",
  unplanned: "Unplanned",
};

// ── Layout ──
function computeDashboardGraph(
  feedItems: any[],
  planItems: any[],
  centerX: number,
  centerY: number,
  sourceWorkbookMap?: Map<string, string>,
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

      const rawSourceId = isFromPlan ? item.source_id : item.id;
      const rawSourceType = isFromPlan ? (item.source_type || "task") : (item.type === "session" ? "session" : "task");

      nodes.push({
        id: isFromPlan ? `plan-${item.id}` : `feed-${item.id}`,
        label: item.title,
        type: nodeType,
        status,
        priority: isFromPlan ? undefined : item.priority,
        workbookId: isFromPlan ? (item.source_id ? sourceWorkbookMap?.get(item.source_id) : undefined) : item.workbook_id || item.workbookId,
        sourceId: rawSourceId || undefined,
        sourceType: rawSourceType,
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

// ── Edge component — brand neural aesthetic ──
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
  const perpX = -dy / dist * (dist * 0.08);
  const perpY = dx / dist * (dist * 0.08);
  const path = `M ${fromNode.x} ${fromNode.y} Q ${mx + perpX} ${my + perpY} ${toNode.x} ${toNode.y}`;
  const isHubEdge = from === "hub";

  return (
    <g>
      <path d={path} fill="none" stroke={isHubEdge ? "hsl(200 90% 52% / 0.12)" : "hsl(var(--muted-foreground) / 0.1)"} strokeWidth={isHubEdge ? 1.5 : 1} />
      <path d={path} fill="none" stroke={toNode.color} strokeWidth={isHubEdge ? 1.2 : 0.8} opacity={0.35} strokeDasharray="5 9" className="animate-neural-pulse" />
      <circle r={isHubEdge ? 2.5 : 1.8} fill={toNode.color} opacity={0.9}>
        <animateMotion dur={`${2.5 + Math.random() * 2}s`} repeatCount="indefinite" path={path} />
      </circle>
    </g>
  );
}

// ── Node component — illuminated brand aesthetic ──
function GraphNodeEl({
  node, isSelected, onSelect, onHover, onNavigate,
}: {
  node: GraphNode;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onNavigate?: (node: GraphNode) => void;
}) {
  const isHub = node.type === "hub";
  const isHorizon = node.type === "horizon";

  return (
    <g
      className="cursor-pointer"
      onClick={() => onSelect(isSelected ? null : node.id)}
      onDoubleClick={() => { if (node.workbookId) onNavigate?.(node); }}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Outer glow halo */}
      <circle cx={node.x} cy={node.y} r={node.radius + (isSelected ? 14 : isHub ? 10 : 7)} fill={node.glowColor} opacity={isSelected ? 0.35 : isHub ? 0.2 : 0.12} />
      {/* Pulsing selection ring */}
      {isSelected && (
        <circle cx={node.x} cy={node.y} r={node.radius + 6} fill="none" stroke={node.color} strokeWidth={1.5} opacity={0.7} className="animate-pulse" />
      )}
      {/* Orbital ring */}
      <circle cx={node.x} cy={node.y} r={node.radius + 3} fill="none" stroke={node.color} strokeWidth={isHub ? 1.2 : 0.8} opacity={isSelected ? 0.5 : 0.18} />
      {/* Core node */}
      <circle cx={node.x} cy={node.y} r={node.radius} fill={node.color} opacity={isHub ? 1 : 0.88} />
      {/* Hub green overlay (brand two-tone) */}
      {isHub && <circle cx={node.x} cy={node.y} r={node.radius * 0.6} fill="hsl(155 72% 46%)" opacity={0.35} />}
      {/* Specular highlight */}
      <circle cx={node.x - node.radius * 0.28} cy={node.y - node.radius * 0.28} r={node.radius * 0.32} fill="white" opacity={isHub ? 0.25 : 0.12} />
      {/* Label */}
      <text x={node.x} y={node.y + node.radius + 13} textAnchor="middle" fill="hsl(var(--foreground))" fontSize={isHub ? 10 : isHorizon ? 9 : 8} fontWeight={isHub ? 700 : isHorizon ? 500 : 400} opacity={0.9} letterSpacing={isHorizon ? "0.06em" : "0"}>
        {node.label.length > 22 ? node.label.slice(0, 20) + "…" : node.label}
      </text>
      {node.status && (
        <text x={node.x} y={node.y + node.radius + 23} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={7} opacity={0.6}>
          {node.status.replace("_", " ")}
        </text>
      )}
    </g>
  );
}


// ── Main Component ──
export function PriorityGraph() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [graphSearch, setGraphSearch] = useState("");
  const [addHorizon, setAddHorizon] = useState<string>("today");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch saved plan preferences
  const { data: savedPrefs = [] } = useQuery({
    queryKey: ["plan-prefs-all", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("working_preferences")
        .select("preference_key, preference_value")
        .eq("user_id", user!.id)
        .eq("scope_type", "personal")
        .like("preference_key", "plan_priorities_%");
      if (error) throw error;
      return data ?? [];
    },
  });

  const parsedPrefs = useMemo(() => {
    const map: Record<string, { focusMode: string; priorityWeight: string; maxItems: number }> = {};
    savedPrefs.forEach(p => {
      const horizon = p.preference_key.replace("plan_priorities_", "");
      try { map[horizon] = JSON.parse(p.preference_value); } catch {}
    });
    return map;
  }, [savedPrefs]);

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

  const sourceWorkbookMap = useMemo(() => {
    const map = new Map<string, string>();
    myTasks.forEach(t => map.set(t.id, t.workbook_id));
    mySessions.forEach(s => map.set(s.id, s.workbook_id));
    return map;
  }, [myTasks, mySessions]);

  const { nodes, edges } = useMemo(
    () => computeDashboardGraph(feedItems, planItems, centerX, centerY, sourceWorkbookMap),
    [feedItems, planItems, sourceWorkbookMap]
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

  // Add unplanned item to selected horizon
  const addToPlan = useMutation({
    mutationFn: async ({ node, horizon }: { node: GraphNode; horizon: string }) => {
      if (!user) throw new Error("Not authenticated");
      const sourceId = node.id.startsWith("feed-") ? node.id.slice(5) : null;
      const sourceType = node.type === "session" ? "session" : "task";
      const { error } = await supabase.from("operator_plan_items").insert({
        user_id: user.id,
        title: node.label,
        source_type: sourceType,
        source_id: sourceId,
        time_horizon: horizon,
        planned_date: new Date().toISOString().split("T")[0],
        sort_order: 0,
        ai_suggested: false,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operator-plan"] });
      queryClient.invalidateQueries({ queryKey: ["priority-graph-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plan-feed-tasks"] });
      setSelectedNode(null);
      const labels: Record<string, string> = { next_hour: "Next Hour", today: "Today", this_week: "This Week" };
      toast({ title: `Added to ${labels[addHorizon] || addHorizon}` });
    },
  });

  // Check if selected node is an unplanned feed item (addable)
  const isAddable = selectedInfo
    && selectedInfo.id.startsWith("feed-")
    && selectedInfo.type !== "hub"
    && selectedInfo.type !== "horizon";

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground tracking-wide">Priority Map</h3>
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
          
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsFullscreen(true)} title="Fullscreen"><Expand className="h-3.5 w-3.5" /></Button>
        </div>
      </div>

      {/* Legend + Saved Preferences */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.task.color }} /> Task</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.session.color }} /> Session</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.delegation.color }} /> Delegation</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.plan_item.color }} /> Planned</span>
        </div>
        {Object.keys(parsedPrefs).length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Priorities:</span>
            {Object.entries(parsedPrefs).map(([h, p]) => (
              <Badge key={h} variant="outline" className="text-[8px] gap-0.5 capitalize">
                {h.replace("_", " ")}: {p.focusMode.replace("_", " ")} · {p.priorityWeight === "urgency" ? "Urgent" : p.priorityWeight === "impact" ? "Impact" : "Bal."}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div
        ref={containerRef}
        className="relative rounded-xl border border-border/40 overflow-hidden select-none"
        style={{
          height: 420,
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, hsl(200 90% 52% / 0.04) 0%, hsl(155 72% 46% / 0.02) 40%, hsl(222 20% 4%) 100%)",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg width="100%" height="100%" viewBox="0 0 800 640" className="cursor-grab active:cursor-grabbing">
          <defs>
            <radialGradient id="priority-hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(200 90% 52% / 0.08)" />
              <stop offset="60%" stopColor="hsl(155 72% 46% / 0.03)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="priority-node-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            {/* Dot grid pattern */}
            <pattern id="dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="hsl(var(--foreground) / 0.06)" />
            </pattern>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Dot grid */}
            <rect width="800" height="640" fill="url(#dot-grid)" />
            {/* Radial hub glow */}
            <rect width="800" height="640" fill="url(#priority-hub-glow)" />
            {/* Orbit rings */}
            <circle cx={centerX} cy={centerY} r={140} fill="none" stroke="hsl(200 90% 52% / 0.08)" strokeWidth={0.8} strokeDasharray="3 7" />
            <circle cx={centerX} cy={centerY} r={260} fill="none" stroke="hsl(155 72% 46% / 0.06)" strokeWidth={0.6} strokeDasharray="3 7" />

            {edges.map(edge => (
              <NeuralEdge key={`${edge.from}-${edge.to}`} from={edge.from} to={edge.to} nodes={nodes} />
            ))}

            {nodes.map(node => (
              <g key={node.id} opacity={matchingNodeIds && !matchingNodeIds.has(node.id) ? 0.15 : 1}>
                <GraphNodeEl node={node} isSelected={selectedNode === node.id} onSelect={setSelectedNode} onHover={setHoveredNode} onNavigate={(n) => {
                  const tab = n.sourceType === "session" ? "sessions" : "tasks";
                  const params = n.sourceId ? `?tab=${tab}&focusId=${n.sourceId}` : "";
                  navigate(`/workbooks/${n.workbookId}${params}`);
                }} />
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
                {isAddable && (
                  <div className="flex items-center gap-1">
                    <Select value={addHorizon} onValueChange={setAddHorizon}>
                      <SelectTrigger className="h-6 text-[10px] w-[110px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="next_hour" className="text-xs"><span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Next Hour</span></SelectItem>
                        <SelectItem value="today" className="text-xs"><span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Today</span></SelectItem>
                        <SelectItem value="this_week" className="text-xs"><span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> This Week</span></SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-6 text-[10px] gap-1"
                      disabled={addToPlan.isPending}
                      onClick={() => addToPlan.mutate({ node: selectedInfo, horizon: addHorizon })}
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>
                )}
                {selectedInfo.workbookId && (
                  <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={() => {
                    const tab = selectedInfo.sourceType === "session" ? "sessions" : "tasks";
                    const params = selectedInfo.sourceId ? `?tab=${tab}&focusId=${selectedInfo.sourceId}` : "";
                    navigate(`/workbooks/${selectedInfo.workbookId}${params}`);
                  }}>
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
      {/* Fullscreen Modal */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] p-0 overflow-hidden flex flex-col">
          {/* Fullscreen header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">🧠 Priority Map</h3>
              <Badge variant="outline" className="text-[9px] gap-1">
                {nodes.length} nodes · {edges.length} connections
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input placeholder="Search…" value={graphSearch} onChange={e => setGraphSearch(e.target.value)} className="pl-7 h-7 w-40 text-xs" />
                {graphSearch && (
                  <button onClick={() => setGraphSearch("")} className="absolute right-1.5 top-1/2 -translate-y-1/2">
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(3, z + 0.2))}><ZoomIn className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(0.3, z - 0.2))}><ZoomOut className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetView}><Minimize2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>

          {/* Fullscreen legend */}
          <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border/30 flex-wrap">
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.task.color }} /> Task</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.session.color }} /> Session</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.delegation.color }} /> Delegation</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.plan_item.color }} /> Planned</span>
            </div>
            {Object.keys(parsedPrefs).length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">Priorities:</span>
                {Object.entries(parsedPrefs).map(([h, p]) => (
                  <Badge key={h} variant="outline" className="text-[8px] gap-0.5 capitalize">
                    {h.replace("_", " ")}: {p.focusMode.replace("_", " ")} · {p.priorityWeight === "urgency" ? "Urgent" : p.priorityWeight === "impact" ? "Impact" : "Bal."}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen SVG */}
          <div
            className="flex-1 relative bg-card/50 overflow-hidden select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <svg width="100%" height="100%" viewBox="0 0 800 640" preserveAspectRatio="xMidYMid meet" className="cursor-grab active:cursor-grabbing">
              <defs>
                <radialGradient id="priority-bg-gradient-fs" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--primary) / 0.03)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <filter id="priority-node-glow-fs" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                <rect width="800" height="640" fill="url(#priority-bg-gradient-fs)" />
                <circle cx={centerX} cy={centerY} r={140} fill="none" stroke="hsl(var(--border) / 0.15)" strokeWidth={0.5} strokeDasharray="4 6" />
                <circle cx={centerX} cy={centerY} r={260} fill="none" stroke="hsl(var(--border) / 0.1)" strokeWidth={0.5} strokeDasharray="4 6" />

                {edges.map(edge => (
                  <NeuralEdge key={`fs-${edge.from}-${edge.to}`} from={edge.from} to={edge.to} nodes={nodes} />
                ))}

                {nodes.map(node => (
                  <g key={`fs-${node.id}`} opacity={matchingNodeIds && !matchingNodeIds.has(node.id) ? 0.15 : 1}>
                    <GraphNodeEl node={node} isSelected={selectedNode === node.id} onSelect={setSelectedNode} onHover={setHoveredNode} onNavigate={(n) => {
                      const tab = n.sourceType === "session" ? "sessions" : "tasks";
                      const params = n.sourceId ? `?tab=${tab}&focusId=${n.sourceId}` : "";
                      navigate(`/workbooks/${n.workbookId}${params}`);
                    }} />
                  </g>
                ))}
              </g>
            </svg>

            {/* Hover tooltip in fullscreen */}
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

            {/* Selected detail panel in fullscreen */}
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
                    {isAddable && (
                      <div className="flex items-center gap-1">
                        <Select value={addHorizon} onValueChange={setAddHorizon}>
                          <SelectTrigger className="h-6 text-[10px] w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="next_hour" className="text-xs"><span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Next Hour</span></SelectItem>
                            <SelectItem value="today" className="text-xs"><span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Today</span></SelectItem>
                            <SelectItem value="this_week" className="text-xs"><span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> This Week</span></SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="default"
                          size="sm"
                          className="h-6 text-[10px] gap-1"
                          disabled={addToPlan.isPending}
                          onClick={() => addToPlan.mutate({ node: selectedInfo, horizon: addHorizon })}
                        >
                          <Plus className="h-3 w-3" />
                          Add
                        </Button>
                      </div>
                    )}
                    {selectedInfo.workbookId && (
                      <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={() => {
                        const tab = selectedInfo.sourceType === "session" ? "sessions" : "tasks";
                        const params = selectedInfo.sourceId ? `?tab=${tab}&focusId=${selectedInfo.sourceId}` : "";
                        navigate(`/workbooks/${selectedInfo.workbookId}${params}`);
                      }}>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
