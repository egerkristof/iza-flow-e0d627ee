
-- ═══════════════════════════════════════════════
-- Phase 2: Notifications table + triggers
-- Phase 3: session_summary columns on protocol_executions
-- ═══════════════════════════════════════════════

-- ── Notifications table ──
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  source_type TEXT NOT NULL,
  source_id UUID NOT NULL,
  workbook_id UUID,
  actor_id UUID,
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

CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_notifications_user_unread
  ON public.notifications (user_id, is_read, created_at DESC);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ── Task assignment notification trigger ──
CREATE OR REPLACE FUNCTION public.notify_task_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.assigned_to IS NOT NULL AND (OLD.assigned_to IS DISTINCT FROM NEW.assigned_to)) THEN
    INSERT INTO public.notifications (user_id, type, title, source_type, source_id, workbook_id, actor_id)
    VALUES (
      NEW.assigned_to,
      'task_assigned',
      'Task assigned: ' || LEFT(NEW.title, 100),
      'task',
      NEW.id,
      NEW.workbook_id,
      COALESCE(auth.uid(), NEW.created_by)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_task_assignment
  AFTER UPDATE ON public.workbook_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_task_assignment();

-- ── Task status change notification (notify creator when delegated task changes) ──
CREATE OR REPLACE FUNCTION public.notify_task_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status)
     AND (NEW.created_by IS NOT NULL)
     AND (NEW.assigned_to IS NOT NULL)
     AND (NEW.created_by != NEW.assigned_to) THEN
    INSERT INTO public.notifications (user_id, type, title, body, source_type, source_id, workbook_id, actor_id)
    VALUES (
      NEW.created_by,
      'task_status_change',
      'Task ' || NEW.status || ': ' || LEFT(NEW.title, 100),
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

-- ── Task creation notification (when a task is assigned to someone on insert) ──
CREATE OR REPLACE FUNCTION public.notify_task_created_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.assigned_to IS NOT NULL AND NEW.assigned_to != NEW.created_by) THEN
    INSERT INTO public.notifications (user_id, type, title, source_type, source_id, workbook_id, actor_id)
    VALUES (
      NEW.assigned_to,
      'task_assigned',
      'New task assigned: ' || LEFT(NEW.title, 100),
      'task',
      NEW.id,
      NEW.workbook_id,
      NEW.created_by
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_task_created_assignment
  AFTER INSERT ON public.workbook_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_task_created_assignment();

-- ═══════════════════════════════════════════════
-- Phase 3: Add session_summary columns
-- ═══════════════════════════════════════════════
ALTER TABLE public.protocol_executions
  ADD COLUMN IF NOT EXISTS session_summary TEXT,
  ADD COLUMN IF NOT EXISTS summary_generated_at TIMESTAMP WITH TIME ZONE;
