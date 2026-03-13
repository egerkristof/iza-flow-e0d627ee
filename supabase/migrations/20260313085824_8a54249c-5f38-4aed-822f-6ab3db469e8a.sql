
CREATE TABLE public.insights_research (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'execution_stack_shifts',
  dimension_focus TEXT,
  query TEXT NOT NULL,
  result_content TEXT NOT NULL DEFAULT '',
  citations JSONB DEFAULT '[]'::jsonb,
  aggregate_snapshot JSONB DEFAULT '{}'::jsonb,
  submission_count INTEGER NOT NULL DEFAULT 0,
  triggered_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.insights_research ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Architects can read insights research"
  ON public.insights_research FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'architect'));

CREATE POLICY "Architects can insert insights research"
  ON public.insights_research FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'architect'));

CREATE POLICY "Architects can delete insights research"
  ON public.insights_research FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'architect'));
