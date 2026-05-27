import { DollarSign, BookOpen, ShieldCheck, Database, Target, LucideIcon } from "lucide-react";

export type TileStatus = "empty" | "partial" | "ready";

export interface ConditionTile {
  id: "economics" | "standards" | "compliance" | "access" | "intent";
  label: string;
  persona: string;
  icon: LucideIcon;
  status: TileStatus;
  state: string;
  detail: string;
  cta: string;
  conditionsPath: string;
}

export const INITIAL_TILES: ConditionTile[] = [
  {
    id: "economics",
    label: "Unit Economics",
    persona: "CFO",
    icon: DollarSign,
    status: "empty",
    state: "Watching. Nothing detected yet.",
    detail:
      "This chat is consuming tokens with no attributed standard or value benchmark. Cost per outcome is unknown. The CFO cannot defend this spend at budget review.",
    cta: "Attach a value standard",
    conditionsPath: "/conditions?tab=economics",
  },
  {
    id: "standards",
    label: "Standards",
    persona: "Business",
    icon: BookOpen,
    status: "empty",
    state: "Watching. Nothing detected yet.",
    detail:
      "One operator playbook is governing this chat. No quality rubric is attached, so outputs cannot be scored or compared across teams.",
    cta: "Attach a quality rubric",
    conditionsPath: "/conditions?tab=standards",
  },
  {
    id: "compliance",
    label: "Compliance Binding",
    persona: "Legal / Risk",
    icon: ShieldCheck,
    status: "empty",
    state: "Watching. Nothing detected yet.",
    detail:
      "This chat is not bound to any compliance regime (EU AI Act, DORA, internal model risk policy). Outputs cannot be audited and cannot be promoted to a sanctioned workflow.",
    cta: "Bind a compliance regime",
    conditionsPath: "/conditions?tab=compliance",
  },
  {
    id: "access",
    label: "Access Scope",
    persona: "IT",
    icon: Database,
    status: "empty",
    state: "Watching. Nothing detected yet.",
    detail:
      "Chat can read CRM and the open web. No write access. No internal knowledge base, no email, no document repository attached.",
    cta: "Scope data and tools",
    conditionsPath: "/conditions?tab=access",
  },
  {
    id: "intent",
    label: "Strategic Intent",
    persona: "Strategy",
    icon: Target,
    status: "empty",
    state: "Watching. Nothing detected yet.",
    detail:
      "This chat is not linked to an organizational goal or KPI. Outcomes cannot be rolled up into board reporting or compared to prior workflows that addressed the same intent.",
    cta: "Link to a goal",
    conditionsPath: "/conditions?tab=intent",
  },
];

export function statusScore(s: TileStatus): number {
  return s === "ready" ? 20 : s === "partial" ? 10 : 0;
}

export function frameScore(tiles: ConditionTile[]): number {
  return tiles.reduce((sum, t) => sum + statusScore(t.status), 0);
}

export function nextStatus(s: TileStatus): TileStatus {
  return s === "empty" ? "partial" : s === "partial" ? "ready" : "ready";
}

// ===== Shared copilot observer =====

export type TileId = ConditionTile["id"];

export interface CopilotSignal {
  id: string;
  ts: string;
  tone: "observe" | "offer" | "warn";
  text: string;
  offerCta?: string;
}

interface MessageLike {
  id: string;
  text: string;
  ts: string;
  role: "user" | "ai" | "teammate";
}

const KEYWORDS: Record<TileId, RegExp> = {
  economics: /\b(cost|price|pricing|budget|roi|revenue|margin|spend|deal)\b/i,
  standards: /\b(draft|template|playbook|outbound|campaign|email|brief|format)\b/i,
  compliance: /\b(legal|risk|gdpr|eu ai act|dora|disclosure|compliance|audit|policy|cfo|customer|client)\b/i,
  access: /\b(crm|transcript|knowledge base|salesforce|notion|drive|database|file|repo)\b/i,
  intent: /\b(goal|kpi|target|objective|okr|north star|quarter|q[1-4])\b/i,
};

const EMPTY_OFFER: Record<TileId, { observe: string; offer: string; cta: string }> = {
  economics: {
    observe: "No cost-related language detected yet.",
    offer: "Attach a value standard so spend can be tied to an outcome.",
    cta: "Attach a value standard",
  },
  standards: {
    observe: "No standards or playbooks referenced in this chat.",
    offer: "Define a standard so outputs are reusable across teams.",
    cta: "Define a standard",
  },
  compliance: {
    observe: "No regulated audience or content flagged yet.",
    offer: "Bind a compliance regime before sensitive outputs ship.",
    cta: "Bind a regime",
  },
  access: {
    observe: "No data sources or tools referenced.",
    offer: "Scope which sources this chat can read so observations are grounded.",
    cta: "Scope sources",
  },
  intent: {
    observe: "No goal or KPI mentioned in this chat.",
    offer: "Link this chat to a goal so its outcome can be measured.",
    cta: "Link to a goal",
  },
};

export function deriveSignals(id: TileId, messages: MessageLike[]): CopilotSignal[] {
  const signals: CopilotSignal[] = [];
  const re = KEYWORDS[id];
  for (const m of messages) {
    if (re.test(m.text)) {
      const matched = (m.text.match(re) ?? [""])[0];
      signals.push({
        id: `${id}-${m.id}-obs`,
        ts: m.ts,
        tone: "observe",
        text: `Picked up "${matched}" in the conversation.`,
      });
    }
  }
  if (signals.length > 0) {
    const tail = signals[signals.length - 1];
    signals.push({
      id: `${id}-${tail.id}-offer`,
      ts: tail.ts,
      tone: "offer",
      text: EMPTY_OFFER[id].offer,
      offerCta: EMPTY_OFFER[id].cta,
    });
  }
  return signals;
}

export function emptyObservationLine(id: TileId): string {
  return EMPTY_OFFER[id].observe;
}