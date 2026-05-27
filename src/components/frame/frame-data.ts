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
    state: "No value standard attached",
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
    status: "partial",
    state: "1 playbook attached — Sales Outreach v3",
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
    state: "No regime bound",
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
    status: "partial",
    state: "2 sources reachable — CRM (read), Web (read)",
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
    state: "Not linked to a goal or KPI",
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