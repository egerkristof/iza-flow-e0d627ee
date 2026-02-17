
-- Operator planner: persisted time-boxed plans
CREATE TABLE public.operator_plan_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'task', -- 'task', 'session', 'custom'
  source_id UUID, -- references workbook_tasks.id or protocol_executions.id
  title TEXT NOT NULL,
  description TEXT,
  time_horizon TEXT NOT NULL DEFAULT 'today', -- 'next_hour', 'today', 'this_week'
  planned_date DATE, -- for weekly view, which day
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  ai_suggested BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.operator_plan_items ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own plan items
CREATE POLICY "Users can view own plan items"
  ON public.operator_plan_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own plan items"
  ON public.operator_plan_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plan items"
  ON public.operator_plan_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plan items"
  ON public.operator_plan_items FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update timestamp
CREATE TRIGGER update_operator_plan_items_updated_at
  BEFORE UPDATE ON public.operator_plan_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for fast lookups
CREATE INDEX idx_operator_plan_items_user_horizon ON public.operator_plan_items(user_id, time_horizon);
CREATE INDEX idx_operator_plan_items_user_date ON public.operator_plan_items(user_id, planned_date);
