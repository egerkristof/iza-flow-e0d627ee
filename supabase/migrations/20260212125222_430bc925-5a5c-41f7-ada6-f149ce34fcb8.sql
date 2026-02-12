
-- Add RESEARCH to context_category enum
ALTER TYPE public.context_category ADD VALUE IF NOT EXISTS 'RESEARCH';

-- Create workbook_resources table
CREATE TABLE public.workbook_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workbook_id UUID NOT NULL REFERENCES public.workbooks(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL DEFAULT 'text', -- text, file, link
  content TEXT, -- for text/link resources
  file_path TEXT, -- for file resources stored in storage
  file_name TEXT,
  file_type TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workbook_resources ENABLE ROW LEVEL SECURITY;

-- Members and owners can view resources
CREATE POLICY "Members can view workbook resources"
ON public.workbook_resources FOR SELECT
USING (
  EXISTS (SELECT 1 FROM workbook_members wm WHERE wm.workbook_id = workbook_resources.workbook_id AND wm.user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM workbooks w WHERE w.id = workbook_resources.workbook_id AND w.owner_id = auth.uid())
  OR has_role(auth.uid(), 'architect'::app_role)
);

-- Members can create resources
CREATE POLICY "Members can create workbook resources"
ON public.workbook_resources FOR INSERT
WITH CHECK (
  auth.uid() = created_by
  AND (
    EXISTS (SELECT 1 FROM workbook_members wm WHERE wm.workbook_id = workbook_resources.workbook_id AND wm.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM workbooks w WHERE w.id = workbook_resources.workbook_id AND w.owner_id = auth.uid())
  )
);

-- Creators can update their resources
CREATE POLICY "Creators can update own resources"
ON public.workbook_resources FOR UPDATE
USING (auth.uid() = created_by);

-- Creators and owners can delete resources
CREATE POLICY "Creators can delete own resources"
ON public.workbook_resources FOR DELETE
USING (
  auth.uid() = created_by
  OR EXISTS (SELECT 1 FROM workbooks w WHERE w.id = workbook_resources.workbook_id AND w.owner_id = auth.uid())
);

-- Timestamp trigger
CREATE TRIGGER update_workbook_resources_updated_at
BEFORE UPDATE ON public.workbook_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for resources
ALTER PUBLICATION supabase_realtime ADD TABLE public.workbook_resources;
