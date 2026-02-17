
# Operator Work Management System — 4-Phase Plan

## Problem Statement

Operators using AI-assisted workflows will have **many parallel sessions** running across multiple workbooks, tasks assigned/delegated, mentions in chats, and shifting priorities. The current Oversight page is leader-oriented (board/grid view of workbooks) and doesn't help operators **resume, prioritize, or track** their fragmented work.

---

## Phase 1: Operator Nerve Center (Oversight Rewrite)

**Goal:** Transform the Oversight page for operators into a priority-ranked **activity feed** that answers: "What should I work on next?"

### UI Components

#### 1.1 `NerveCenterFeed` (new: `src/components/oversight/NerveCenterFeed.tsx`)
- Replaces the current "My Tasks" tab for operators
- Shows a **unified, priority-scored feed** mixing:
  - Tasks assigned to me (from `workbook_tasks`)
  - Active sessions I'm executing (from `protocol_executions`)
  - Tasks I delegated that are blocked/done (from `workbook_tasks` where `created_by = me`)
- Each item is a `FeedItem` card with:
  - Priority score badge (computed client-side)
  - Workbook context label
  - Staleness indicator (time since last activity)
  - One-click "Resume" action → navigates to workbook/session
- **Grouping toggle**: "By Priority" (default) vs "By Workbook"
- **Filters**: Status (active/blocked/stale), Priority (critical/high/medium/low)

#### 1.2 `SessionResumeCard` (new: `src/components/oversight/SessionResumeCard.tsx`)
- Compact card for each `protocol_execution` the operator is running
- Shows: session title, workbook name, current step (e.g. "Step 3/5"), last activity time
- Visual staleness: green (<1d), amber (1-3d), red (>3d) based on `updated_at`
- Click → navigates to `/workbooks/:id` with session auto-opened

#### 1.3 `DelegationTracker` (new: `src/components/oversight/DelegationTracker.tsx`)
- Section showing tasks where `created_by = user.id AND assigned_to != user.id`
- Grouped by status: Blocked (needs my attention), Done (needs my review), In Progress
- Each row shows assignee name (from `profiles`), workbook, staleness

#### 1.4 Priority Scoring Logic (`src/lib/priority-scoring.ts`)
```typescript
interface ScoredItem {
  id: string;
  type: "task" | "session" | "delegation";
  score: number;       // 0-100, higher = more urgent
  sourceId: string;    // workbook_id
  title: string;
  metadata: Record<string, any>;
}

function computePriorityScore(item): number {
  let score = 0;
  
  // Base priority weight
  if (item.priority === "critical") score += 40;
  else if (item.priority === "high") score += 25;
  else if (item.priority === "medium") score += 10;
  
  // Staleness boost (days since last update)
  const staleDays = daysSince(item.updated_at);
  score += Math.min(staleDays * 3, 20);  // max +20
  
  // Due date urgency
  if (item.due_date) {
    const daysUntilDue = daysUntil(item.due_date);
    if (daysUntilDue < 0) score += 30;       // overdue
    else if (daysUntilDue < 2) score += 20;   // due soon
    else if (daysUntilDue < 7) score += 10;
  }
  
  // Blocked items delegated TO others get lower score (not my action)
  if (item.type === "delegation" && item.status === "in_progress") score -= 10;
  
  // Blocked tasks assigned to me get boost (I'm the bottleneck)
  if (item.type === "task" && item.status === "blocked") score += 15;
  
  // Active sessions with drift get boost
  if (item.type === "session" && item.driftScore > 0.3) score += 15;
  
  return Math.max(0, Math.min(100, score));
}
```

### Data Sources (No Schema Changes)
- `workbook_tasks` — tasks assigned_to or created_by the operator
- `protocol_executions` — sessions where executed_by = operator
- `protocol_steps` + `step_executions` — for step progress display
- `workbooks` — for workbook title/context
- `profiles` — for assignee display names

### Changes to Existing Files
- `src/pages/Oversight.tsx` — Refactor: operator role renders `<NerveCenterFeed />` instead of current tabs
- Leader/Process Owner views remain unchanged (board/grid/hierarchy)

---

## Phase 2: Notifications Infrastructure

**Goal:** Create a notification system for @mentions, task assignments, status changes, and session events so operators have a persistent awareness layer.

### Schema Changes

#### 2.1 New Table: `notifications`
```sql
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,            -- recipient
  type TEXT NOT NULL,                -- 'mention', 'task_assigned', 'task_status_change', 'session_event', 'mandate_published'
  title TEXT NOT NULL,               -- short display text
  body TEXT,                         -- optional detail
  source_type TEXT NOT NULL,         -- 'task', 'chat_message', 'session', 'mandate'
  source_id UUID NOT NULL,           -- ID of the source entity
  workbook_id UUID,                  -- for navigation context
  actor_id UUID,                     -- who triggered it (null for system)
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- System/triggers insert notifications (service role or SECURITY DEFINER function)
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);  -- controlled via SECURITY DEFINER functions

CREATE INDEX idx_notifications_user_unread 
  ON public.notifications (user_id, is_read, created_at DESC);

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
```

#### 2.2 Trigger Functions (SECURITY DEFINER)

**Task Assignment Trigger:**
```sql
CREATE OR REPLACE FUNCTION public.notify_task_assignment()
RETURNS TRIGGER AS $$
BEGIN
  -- When assigned_to changes and is not null
  IF (NEW.assigned_to IS NOT NULL AND (OLD.assigned_to IS DISTINCT FROM NEW.assigned_to)) THEN
    INSERT INTO public.notifications (user_id, type, title, source_type, source_id, workbook_id, actor_id)
    VALUES (
      NEW.assigned_to,
      'task_assigned',
      'Task assigned: ' || NEW.title,
      'task',
      NEW.id,
      NEW.workbook_id,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_task_assignment
  AFTER UPDATE ON public.workbook_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_task_assignment();
```

**Task Status Change Trigger (notify creator when delegated task changes):**
```sql
CREATE OR REPLACE FUNCTION public.notify_task_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status) 
     AND (NEW.created_by != NEW.assigned_to)
     AND (NEW.created_by IS NOT NULL) THEN
    INSERT INTO public.notifications (user_id, type, title, body, source_type, source_id, workbook_id, actor_id)
    VALUES (
      NEW.created_by,
      'task_status_change',
      'Task status → ' || NEW.status || ': ' || NEW.title,
      NULL,
      'task',
      NEW.id,
      NEW.workbook_id,
      NEW.assigned_to
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_task_status_change
  AFTER UPDATE ON public.workbook_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_task_status_change();
```

### UI Components

#### 2.3 `NotificationBell` (new: `src/components/notifications/NotificationBell.tsx`)
- Lives in AppSidebar footer or top bar
- Shows unread count badge (realtime via Supabase channel)
- Click opens a dropdown/sheet with notification list
- Each notification: icon by type, title, relative time, "Mark read" action
- "Mark all read" button
- Click notification → navigate to source (workbook/task/session)

#### 2.4 `NotificationPanel` (new: `src/components/notifications/NotificationPanel.tsx`)
- Sheet/dropdown content with scrollable notification list
- Grouped by: Today, Yesterday, Earlier
- Filter tabs: All | Mentions | Tasks | Sessions

#### 2.5 Integration with NerveCenterFeed
- Unread notifications surface as a highlight badge on relevant feed items
- "New since last visit" separator in the feed

---

## Phase 3: AI-Powered Session Summaries & Context Recall

**Goal:** Help operators recall "where they left off" with AI-generated session summaries and contextual hints.

### Schema Changes

#### 3.1 Add columns to `protocol_executions`
```sql
ALTER TABLE public.protocol_executions
  ADD COLUMN IF NOT EXISTS session_summary TEXT,
  ADD COLUMN IF NOT EXISTS summary_generated_at TIMESTAMP WITH TIME ZONE;
```

### Edge Function

#### 3.2 `summarize-session` (new: `supabase/functions/summarize-session/index.ts`)
- Triggered on-demand when operator views NerveCenterFeed or resumes a session
- Inputs: execution_id
- Gathers: step execution notes, chat messages, task statuses, captures
- Uses Lovable AI (google/gemini-2.5-flash) to generate a 2-3 sentence summary:
  - What was accomplished
  - What's pending/blocked
  - Suggested next action
- Stores result in `protocol_executions.session_summary`
- Cached: only regenerates if `updated_at > summary_generated_at`

### UI Components

#### 3.3 Enhanced `SessionResumeCard`
- Shows AI summary below the progress bar (lazy-loaded)
- "Refresh summary" button
- Summary appears as an italic, muted text block

#### 3.4 `WhereYouLeftOff` banner (new: `src/components/oversight/WhereYouLeftOff.tsx`)
- Shown at top of NerveCenterFeed
- Highlights the single most important item to resume
- Uses priority score + recency to pick the "hero" item
- Shows: session title, AI summary snippet, "Resume →" CTA

---

## Phase 4: Operator Dashboard Widgets & Personalization

**Goal:** Give operators a personalized dashboard landing with widgets for their work patterns, goals integration, and quick actions.

### UI Components

#### 4.1 `OperatorDashboard` (replaces Index.tsx content for operator role)
- **Hero widget**: `WhereYouLeftOff` (from Phase 3)
- **My Week strip**: 
  - Tasks completed this week vs last week
  - Active sessions count
  - Hours estimate from task `estimated_minutes` aggregation
- **Quick Actions row**:
  - "New Free Session" → creates a free session in most recent active workbook
  - "View All Tasks" → navigates to Oversight
  - "My Delegations" → navigates to Oversight with delegation filter
- **Goals Progress**: compact view of `personal_goals` with progress bars
- **Mandate Alerts**: any unacknowledged mandates affecting operator's workbooks

#### 4.2 `WeeklyProgressWidget` (new: `src/components/oversight/WeeklyProgressWidget.tsx`)
- Queries `workbook_tasks` where `completed_at` is within current/previous week
- Simple bar chart or counter comparison
- Uses existing recharts dependency

#### 4.3 `QuickActionsBar` (new: `src/components/oversight/QuickActionsBar.tsx`)
- Row of action buttons with icons
- Context-aware: only shows "Resume Session" if there are stale sessions

### Personalization (Future)
- Drag-to-reorder widgets (store layout in `working_preferences`)
- Pin/unpin workbooks to dashboard
- Custom filters saved per operator

---

## File Architecture Summary

```
src/
├── lib/
│   └── priority-scoring.ts                    # Phase 1
├── components/
│   ├── oversight/
│   │   ├── NerveCenterFeed.tsx                # Phase 1
│   │   ├── FeedItem.tsx                       # Phase 1
│   │   ├── SessionResumeCard.tsx              # Phase 1, enhanced Phase 3
│   │   ├── DelegationTracker.tsx              # Phase 1
│   │   ├── WhereYouLeftOff.tsx                # Phase 3
│   │   ├── WeeklyProgressWidget.tsx           # Phase 4
│   │   └── QuickActionsBar.tsx                # Phase 4
│   └── notifications/
│       ├── NotificationBell.tsx               # Phase 2
│       └── NotificationPanel.tsx              # Phase 2
├── pages/
│   ├── Oversight.tsx                          # Refactored Phase 1
│   └── Index.tsx                              # Enhanced Phase 4
supabase/
└── functions/
    └── summarize-session/
        └── index.ts                           # Phase 3
```

## Schema Changes Summary

| Phase | Table | Change Type | Details |
|-------|-------|-------------|---------|
| 1 | — | None | Uses existing tables only |
| 2 | `notifications` | NEW TABLE | user_id, type, title, source_type, source_id, workbook_id, is_read |
| 2 | `workbook_tasks` | NEW TRIGGERS | `notify_task_assignment`, `notify_task_status_change` |
| 3 | `protocol_executions` | ALTER | Add `session_summary TEXT`, `summary_generated_at TIMESTAMPTZ` |

## Implementation Order

1. **Phase 1** (no schema changes) — Can start immediately
2. **Phase 2** (schema + triggers) — Independent of Phase 1, can run in parallel
3. **Phase 3** (schema + edge function) — Depends on Phase 1 UI being in place
4. **Phase 4** (UI only) — Depends on Phases 1 & 3 for data

## Design Principles

- **Operator-first**: Every pixel on the operator's screen should answer "what do I do next?"
- **Zero-config prioritization**: Priority scoring is automatic, no manual triage needed
- **Context preservation**: AI summaries + visual staleness indicators prevent "cold start" when resuming work
- **Progressive disclosure**: Feed shows essentials; click to expand into full workbook/session context
- **Realtime**: Notifications and feed updates arrive via Supabase realtime channels
