
-- Create session_reviews table for After-Action Reviews
CREATE TABLE public.session_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  execution_id UUID NOT NULL REFERENCES public.protocol_executions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  what_worked TEXT NOT NULL DEFAULT '',
  what_didnt TEXT NOT NULL DEFAULT '',
  would_do_differently TEXT NOT NULL DEFAULT '',
  ai_synthesis TEXT NULL,
  synthesis_generated_at TIMESTAMP WITH TIME ZONE NULL,
  promoted_capture_ids UUID[] NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_reviews ENABLE ROW LEVEL SECURITY;

-- Operators can create their own reviews
CREATE POLICY "Users can create own session reviews"
  ON public.session_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Operators can view their own reviews
CREATE POLICY "Users can view own session reviews"
  ON public.session_reviews FOR SELECT
  USING (auth.uid() = user_id);

-- Operators can update their own reviews
CREATE POLICY "Users can update own session reviews"
  ON public.session_reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Leaders and Process Owners can view all reviews (oversight)
CREATE POLICY "Leaders can view all session reviews"
  ON public.session_reviews FOR SELECT
  USING (
    has_role(auth.uid(), 'manager'::app_role) OR
    has_role(auth.uid(), 'architect'::app_role)
  );

-- Workbook owners can see reviews for their workbooks
CREATE POLICY "Workbook owners can view session reviews"
  ON public.session_reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.protocol_executions pe
      WHERE pe.id = session_reviews.execution_id
        AND is_workbook_owner(auth.uid(), pe.workbook_id)
    )
  );

-- Updated_at trigger
CREATE TRIGGER update_session_reviews_updated_at
  BEFORE UPDATE ON public.session_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
