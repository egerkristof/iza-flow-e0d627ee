import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, Info } from "lucide-react";

// ── Types ──
interface GraphNode {
  id: string;
  label: string;
  type: "workbook" | "task" | "subtask" | "chat";
  status?: string;
  priority?: string;
  parentId: string | null;
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
const NODE_STYLES = {
  workbook: { color: "hsl(var(--primary))", glow: "hsl(var(--primary) / 0.4)", radius: 28 },
  task: { color: "hsl(200, 80%, 55%)", glow: "hsl(200, 80%, 55% / 0.3)", radius: 16 },
  subtask: { color: "hsl(260, 70%, 60%)", glow: "hsl(260, 70%, 60% / 0.3)", radius: 10 },
  chat: { color: "hsl(150, 70%, 50%)", glow: "hsl(150, 70%, 50% / 0.3)", radius: 14 },
};

const STATUS_COLORS: Record<string, string> = {
  todo: "hsl(var(--muted-foreground))",
  in_progress: "hsl(200, 80%, 55%)",
  done: "hsl(150, 70%, 50%)",
  blocked: "hsl(0, 70%, 55%)",
  cancelled: "hsl(var(--muted-foreground) / 0.4)",
};

// ── Radial layout algorithm ──
function computeRadialLayout(
  workbookId: string,
  workbookTitle: string,
  tasks: any[],
  chats: any[],
  centerX: number,
  centerY: number,
): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Central workbook node
  nodes.push({
    id: workbookId,
    label: workbookTitle,
    type: "workbook",
    parentId: null,
    x: centerX,
    y: centerY,
    radius: NODE_STYLES.workbook.radius,
    color: NODE_STYLES.workbook.color,
    glowColor: NODE_STYLES.workbook.glow,
  });

  // Separate top-level tasks and chats
  const topTasks = tasks.filter(t => !t.parent_task_id);
  const subtaskMap = new Map<string, any[]>();
  tasks.forEach(t => {
    if (t.parent_task_id) {
      const list = subtaskMap.get(t.parent_task_id) || [];
      list.push(t);
      subtaskMap.set(t.parent_task_id, list);
    }
  });

  const totalTopLevel = topTasks.length + chats.length;
  if (totalTopLevel === 0) return { nodes, edges };

  const ringRadius1 = 160; // Tasks + chats ring
  const ringRadius2 = 280; // Subtasks ring

  // Place top-level items in a ring
  let idx = 0;
  const angleStep = (2 * Math.PI) / totalTopLevel;
  const startAngle = -Math.PI / 2; // Start from top

  // Tasks
  topTasks.forEach(task => {
    const angle = startAngle + idx * angleStep;
    const x = centerX + ringRadius1 * Math.cos(angle);
    const y = centerY + ringRadius1 * Math.sin(angle);

    nodes.push({
      id: task.id,
      label: task.title,
      type: "task",
      status: task.status,
      priority: task.priority,
      parentId: workbookId,
      x, y,
      radius: NODE_STYLES.task.radius,
      color: STATUS_COLORS[task.status] || NODE_STYLES.task.color,
      glowColor: NODE_STYLES.task.glow,
    });
    edges.push({ from: workbookId, to: task.id });

    // Subtasks
    const subs = subtaskMap.get(task.id) || [];
    if (subs.length > 0) {
      const subAngleSpread = angleStep * 0.7;
      const subAngleStart = angle - subAngleSpread / 2;
      const subAngleStep = subs.length > 1 ? subAngleSpread / (subs.length - 1) : 0;

      subs.forEach((sub, si) => {
        const subAngle = subs.length === 1 ? angle : subAngleStart + si * subAngleStep;
        const sx = centerX + ringRadius2 * Math.cos(subAngle);
        const sy = centerY + ringRadius2 * Math.sin(subAngle);

        nodes.push({
          id: sub.id,
          label: sub.title,
          type: "subtask",
          status: sub.status,
          priority: sub.priority,
          parentId: task.id,
          x: sx, y: sy,
          radius: NODE_STYLES.subtask.radius,
          color: STATUS_COLORS[sub.status] || NODE_STYLES.subtask.color,
          glowColor: NODE_STYLES.subtask.glow,
        });
        edges.push({ from: task.id, to: sub.id });
      });
    }

    idx++;
  });

  // Chats
  chats.forEach(chat => {
    const angle = startAngle + idx * angleStep;
    const x = centerX + ringRadius1 * Math.cos(angle);
    const y = centerY + ringRadius1 * Math.sin(angle);

    nodes.push({
      id: chat.id,
      label: chat.title || "Untitled Chat",
      type: "chat",
      parentId: workbookId,
      x, y,
      radius: NODE_STYLES.chat.radius,
      color: NODE_STYLES.chat.color,
      glowColor: NODE_STYLES.chat.glow,
    });
    edges.push({ from: workbookId, to: chat.id });
    idx++;
  });

  return { nodes, edges };
}

// ── Animated neural path ──
function NeuralEdge({ from, to, nodes }: { from: string; to: string; nodes: GraphNode[] }) {
  const fromNode = nodes.find(n => n.id === from);
  const toNode = nodes.find(n => n.id === to);
  if (!fromNode || !toNode) return null;

  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Control point for curved path
  const mx = (fromNode.x + toNode.x) / 2;
  const my = (fromNode.y + toNode.y) / 2;
  const perpX = -dy / dist * (dist * 0.1);
  const perpY = dx / dist * (dist * 0.1);

  const path = `M ${fromNode.x} ${fromNode.y} Q ${mx + perpX} ${my + perpY} ${toNode.x} ${toNode.y}`;
  const id = `pulse-${from}-${to}`;

  return (
    <g>
      {/* Base path */}
      <path
        d={path}
        fill="none"
        stroke="hsl(var(--muted-foreground) / 0.15)"
        strokeWidth={1.5}
      />
      {/* Animated glow path */}
      <path
        d={path}
        fill="none"
        stroke={toNode.color}
        strokeWidth={1}
        opacity={0.4}
        strokeDasharray="6 8"
        className="animate-neural-pulse"
      />
      {/* Traveling pulse */}
      <circle r={2.5} fill={toNode.color} opacity={0.8}>
        <animateMotion dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" path={path} />
      </circle>
    </g>
  );
}

// ── Graph Node ──
function GraphNodeElement({
  node,
  isSelected,
  onSelect,
  onHover,
}: {
  node: GraphNode;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}) {
  return (
    <g
      className="cursor-pointer transition-transform"
      onClick={() => onSelect(isSelected ? null : node.id)}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Outer glow */}
      <circle
        cx={node.x}
        cy={node.y}
        r={node.radius + (isSelected ? 8 : 4)}
        fill="none"
        stroke={node.color}
        strokeWidth={isSelected ? 2 : 1}
        opacity={isSelected ? 0.6 : 0.2}
        className={isSelected ? "animate-pulse" : ""}
      />
      {/* Ambient glow */}
      <circle
        cx={node.x}
        cy={node.y}
        r={node.radius + 12}
        fill={node.glowColor}
        opacity={isSelected ? 0.15 : 0.05}
      />
      {/* Core node */}
      <circle
        cx={node.x}
        cy={node.y}
        r={node.radius}
        fill={`${node.color}`}
        opacity={0.9}
        stroke={isSelected ? "hsl(var(--foreground))" : "transparent"}
        strokeWidth={isSelected ? 2 : 0}
      />
      {/* Inner highlight */}
      <circle
        cx={node.x - node.radius * 0.25}
        cy={node.y - node.radius * 0.25}
        r={node.radius * 0.35}
        fill="white"
        opacity={0.15}
      />
      {/* Type icon text */}
      <text
        x={node.x}
        y={node.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize={node.type === "workbook" ? 14 : node.type === "subtask" ? 8 : 10}
        fontWeight="bold"
      >
        {node.type === "workbook" ? "⬡" : node.type === "task" ? "◆" : node.type === "chat" ? "💬" : "◇"}
      </text>
      {/* Label */}
      <text
        x={node.x}
        y={node.y + node.radius + 14}
        textAnchor="middle"
        fill="hsl(var(--foreground))"
        fontSize={node.type === "workbook" ? 12 : 10}
        fontWeight={node.type === "workbook" ? 600 : 400}
        opacity={0.85}
      >
        {node.label.length > 20 ? node.label.slice(0, 18) + "…" : node.label}
      </text>
      {/* Status indicator for tasks */}
      {node.status && (
        <text
          x={node.x}
          y={node.y + node.radius + 26}
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize={8}
          opacity={0.7}
        >
          {node.status.replace("_", " ")}
        </text>
      )}
    </g>
  );
}

// ── Main Component ──
export function WorkbookGraph({ workbookId, workbookTitle }: { workbookId: string; workbookTitle: string }) {
  const { user } = useAuth();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Fetch tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ["workbook-tasks-graph", workbookId],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_tasks")
        .select("id, title, status, priority, parent_task_id")
        .eq("workbook_id", workbookId)
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  // Fetch chats
  const { data: chats = [] } = useQuery({
    queryKey: ["workbook-chats-graph", workbookId],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workbook_chats")
        .select("id, title, chat_type")
        .eq("workbook_id", workbookId);
      if (error) throw error;
      return data ?? [];
    },
  });

  const centerX = 400;
  const centerY = 350;

  const { nodes, edges } = useMemo(
    () => computeRadialLayout(workbookId, workbookTitle, tasks, chats, centerX, centerY),
    [workbookId, workbookTitle, tasks, chats]
  );

  const selectedInfo = nodes.find(n => n.id === selectedNode);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(3, z - e.deltaY * 0.001)));
  }, []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-3">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">Nervous System View</h3>
          <Badge variant="outline" className="text-[9px] gap-1">
            {nodes.length} nodes · {edges.length} connections
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.min(3, z + 0.2))}>
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(z => Math.max(0.3, z - 0.2))}>
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetView}>
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.workbook.color }} /> Workbook
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.task.color }} /> Task
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.subtask.color }} /> Subtask
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: NODE_STYLES.chat.color }} /> Chat
        </span>
      </div>

      {/* SVG Canvas */}
      <div
        ref={containerRef}
        className="relative rounded-xl border border-border/50 bg-card/50 overflow-hidden select-none"
        style={{ height: 500 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 800 700"
          className="cursor-grab active:cursor-grabbing"
        >
          <defs>
            {/* Background radial gradient */}
            <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--primary) / 0.03)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            {/* Glow filter */}
            <filter id="node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Background */}
            <rect width="800" height="700" fill="url(#bg-gradient)" />

            {/* Concentric ring guides */}
            <circle cx={centerX} cy={centerY} r={160} fill="none" stroke="hsl(var(--border) / 0.15)" strokeWidth={0.5} strokeDasharray="4 6" />
            <circle cx={centerX} cy={centerY} r={280} fill="none" stroke="hsl(var(--border) / 0.1)" strokeWidth={0.5} strokeDasharray="4 6" />

            {/* Edges */}
            {edges.map(edge => (
              <NeuralEdge key={`${edge.from}-${edge.to}`} from={edge.from} to={edge.to} nodes={nodes} />
            ))}

            {/* Nodes */}
            {nodes.map(node => (
              <GraphNodeElement
                key={node.id}
                node={node}
                isSelected={selectedNode === node.id}
                onSelect={setSelectedNode}
                onHover={setHoveredNode}
              />
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
                top: `${(n.y * zoom + pan.y) / 700 * 100 - 8}%`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="font-medium">{n.label}</div>
              <div className="text-muted-foreground capitalize">{n.type}{n.status ? ` · ${n.status.replace("_", " ")}` : ""}</div>
            </div>
          );
        })()}

        {/* Selected node detail panel */}
        {selectedInfo && (
          <div className="absolute bottom-3 left-3 right-3 bg-popover/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ background: selectedInfo.color }} />
                <span className="text-sm font-medium">{selectedInfo.label}</span>
                <Badge variant="outline" className="text-[9px] capitalize">{selectedInfo.type}</Badge>
                {selectedInfo.status && (
                  <Badge variant="secondary" className="text-[9px] capitalize">{selectedInfo.status.replace("_", " ")}</Badge>
                )}
                {selectedInfo.priority && (
                  <Badge variant="secondary" className="text-[9px] capitalize">{selectedInfo.priority}</Badge>
                )}
              </div>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setSelectedNode(null)}>
                <Info className="h-3 w-3" />
              </Button>
            </div>
            <div className="mt-1.5 text-[10px] text-muted-foreground">
              {edges.filter(e => e.from === selectedInfo.id).length} children · {edges.filter(e => e.to === selectedInfo.id).length} parent connections
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
