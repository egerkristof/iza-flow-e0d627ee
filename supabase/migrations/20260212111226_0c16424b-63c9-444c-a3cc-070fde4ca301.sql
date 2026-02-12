
-- Task status enum
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'blocked', 'done', 'cancelled');

-- Task priority enum  
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Workbook Tasks table with hierarchy support
CREATE TABLE public.workbook_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workbook_id UUID NOT NULL REFERENCES public.workbooks(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES public.workbook_tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status public.task_status NOT NULL DEFAULT 'todo',
  priority public.task_priority NOT NULL DEFAULT 'medium',
  assigned_to UUID,
  created_by UUID NOT NULL,
  source_protocol_id TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  context_config JSONB NOT NULL DEFAULT '{"inherit_preferences": true, "inherit_intents": true, "inherit_history_summary": true, "depth_limit": 3}'::jsonb,
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workbook_tasks ENABLE ROW LEVEL SECURITY;

-- Operators: see tasks assigned to them or created by them
CREATE POLICY "Users can view own tasks"
ON public.workbook_tasks FOR SELECT
USING (auth.uid() = assigned_to OR auth.uid() = created_by);

-- Leaders (managers): can view all tasks for oversight
CREATE POLICY "Managers can view all tasks"
ON public.workbook_tasks FOR SELECT
USING (has_role(auth.uid(), 'manager'::app_role));

-- Architects: can view all tasks
CREATE POLICY "Architects can view all tasks"
ON public.workbook_tasks FOR SELECT
USING (has_role(auth.uid(), 'architect'::app_role));

-- Users can create tasks
CREATE POLICY "Users can create tasks"
ON public.workbook_tasks FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Users can update tasks they created or are assigned to
CREATE POLICY "Users can update own tasks"
ON public.workbook_tasks FOR UPDATE
USING (auth.uid() = created_by OR auth.uid() = assigned_to);

-- Users can delete tasks they created
CREATE POLICY "Users can delete own tasks"
ON public.workbook_tasks FOR DELETE
USING (auth.uid() = created_by);

-- Indexes
CREATE INDEX idx_workbook_tasks_workbook ON public.workbook_tasks(workbook_id);
CREATE INDEX idx_workbook_tasks_parent ON public.workbook_tasks(parent_task_id);
CREATE INDEX idx_workbook_tasks_assigned ON public.workbook_tasks(assigned_to);
CREATE INDEX idx_workbook_tasks_status ON public.workbook_tasks(status);

-- Timestamp trigger
CREATE TRIGGER update_workbook_tasks_updated_at
BEFORE UPDATE ON public.workbook_tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
