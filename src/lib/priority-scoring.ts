import { differenceInDays, differenceInHours } from "date-fns";

export type FeedItemType = "task" | "session" | "delegation";

export interface ScoredFeedItem {
  id: string;
  type: FeedItemType;
  score: number; // 0-100
  title: string;
  workbookId: string;
  workbookTitle: string;
  status: string;
  priority?: string;
  updatedAt: string;
  dueDate?: string | null;
  driftScore?: number;
  // Session-specific
  currentStep?: string;
  totalSteps?: number;
  completedSteps?: number;
  sessionSummary?: string | null;
  // Delegation-specific
  assigneeName?: string | null;
  // Task-specific
  assignedTo?: string | null;
  createdBy?: string;
  parentTaskId?: string | null;
  executionId?: string;
  protocolTitle?: string;
}

export type StalenessLevel = "fresh" | "aging" | "stale";

export function getStaleness(updatedAt: string): StalenessLevel {
  const hours = differenceInHours(new Date(), new Date(updatedAt));
  if (hours < 24) return "fresh";
  if (hours < 72) return "aging";
  return "stale";
}

export function getStalenessColor(level: StalenessLevel): string {
  switch (level) {
    case "fresh": return "text-success";
    case "aging": return "text-warning";
    case "stale": return "text-destructive";
  }
}

export function computePriorityScore(item: {
  priority?: string;
  updatedAt: string;
  dueDate?: string | null;
  type: FeedItemType;
  status: string;
  driftScore?: number;
}): number {
  let score = 0;

  // Base priority weight
  if (item.priority === "critical") score += 40;
  else if (item.priority === "high") score += 25;
  else if (item.priority === "medium") score += 10;
  else score += 5;

  // Staleness boost
  const staleDays = Math.max(0, differenceInDays(new Date(), new Date(item.updatedAt)));
  score += Math.min(staleDays * 3, 20);

  // Due date urgency
  if (item.dueDate) {
    const daysUntilDue = differenceInDays(new Date(item.dueDate), new Date());
    if (daysUntilDue < 0) score += 30; // overdue
    else if (daysUntilDue < 2) score += 20;
    else if (daysUntilDue < 7) score += 10;
  }

  // Blocked tasks assigned to me → I'm the bottleneck
  if (item.type === "task" && item.status === "blocked") score += 15;

  // Delegated in-progress tasks are less urgent for me
  if (item.type === "delegation" && item.status === "in_progress") score -= 10;

  // Delegated done tasks need my review
  if (item.type === "delegation" && item.status === "done") score += 20;

  // Delegated blocked tasks need my help
  if (item.type === "delegation" && item.status === "blocked") score += 25;

  // Active sessions with drift
  if (item.type === "session" && (item.driftScore ?? 0) > 0.3) score += 15;

  return Math.max(0, Math.min(100, score));
}

export function sortByScore(items: ScoredFeedItem[]): ScoredFeedItem[] {
  return [...items].sort((a, b) => b.score - a.score);
}

export function groupByWorkbook(items: ScoredFeedItem[]): Record<string, ScoredFeedItem[]> {
  const groups: Record<string, ScoredFeedItem[]> = {};
  for (const item of items) {
    const key = item.workbookId;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  // Sort within each group by score
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => b.score - a.score);
  }
  return groups;
}
