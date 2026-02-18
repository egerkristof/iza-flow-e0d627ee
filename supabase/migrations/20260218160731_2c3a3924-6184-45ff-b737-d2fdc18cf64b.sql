-- Phase 2 SECI Socialization: Step Annotations + Task Coaching Notes

-- 1. Annotation type enum
CREATE TYPE public.annotation_type AS ENUM ('tip', 'warning', 'example', 'context');

-- 2. Step annotations table — process owners attach coaching notes to protocol steps
CREATE TABLE public.step_annotations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step_id uuid NOT NULL REFERENCES public.protocol_steps(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  annotation_type public.annotation_type NOT NULL DEFAULT 'tip',
  content text NOT NULL,
  is_visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.step_annotations ENABLE ROW LEVEL SECURITY;

-- Authors (architects) can manage their own annotations
CREATE POLICY "Authors can insert step annotations"
ON public.step_annotations FOR INSERT
WITH CHECK (
  auth.uid() = author_id AND has_role(auth.uid(), 'architect'::app_role)
);

CREATE POLICY "Authors can update own step annotations"
ON public.step_annotations FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own step annotations"
ON public.step_annotations FOR DELETE
USING (auth.uid() = author_id);

-- All workbook members (executors) can read annotations for steps in their accessible workbooks
CREATE POLICY "Members can view step annotations"
ON public.step_annotations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.protocol_steps ps
    JOIN public.workbook_protocols wp ON wp.id = ps.protocol_id
    WHERE ps.id = step_annotations.step_id
    AND (
      wp.workbook_id IN (SELECT user_accessible_workbook_ids(auth.uid()))
      OR has_role(auth.uid(), 'architect'::app_role)
    )
  )
);

-- Updated_at trigger
CREATE TRIGGER update_step_annotations_updated_at
BEFORE UPDATE ON public.step_annotations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Add coaching_notes column to workbook_tasks
ALTER TABLE public.workbook_tasks
ADD COLUMN coaching_notes text DEFAULT NULL;
