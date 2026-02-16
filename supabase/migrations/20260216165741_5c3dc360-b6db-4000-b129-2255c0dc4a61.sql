
-- Version history for workbook resources (drafts)
CREATE TABLE public.workbook_resource_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID NOT NULL REFERENCES public.workbook_resources(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  content TEXT,
  file_path TEXT,
  file_name TEXT,
  file_type TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  change_note TEXT
);

-- Index for fast lookups
CREATE INDEX idx_resource_versions_resource_id ON public.workbook_resource_versions(resource_id);
CREATE INDEX idx_resource_versions_created_at ON public.workbook_resource_versions(resource_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.workbook_resource_versions ENABLE ROW LEVEL SECURITY;

-- Policies: same access as the parent resource
CREATE POLICY "Members can view resource versions"
ON public.workbook_resource_versions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workbook_resources wr
    WHERE wr.id = workbook_resource_versions.resource_id
    AND (
      wr.workbook_id IN (SELECT user_accessible_workbook_ids(auth.uid()))
      OR has_role(auth.uid(), 'architect'::app_role)
    )
  )
);

CREATE POLICY "Members can create resource versions"
ON public.workbook_resource_versions
FOR INSERT
WITH CHECK (
  auth.uid() = created_by
  AND EXISTS (
    SELECT 1 FROM public.workbook_resources wr
    WHERE wr.id = workbook_resource_versions.resource_id
    AND wr.workbook_id IN (SELECT user_accessible_workbook_ids(auth.uid()))
  )
);

CREATE POLICY "Creators can delete resource versions"
ON public.workbook_resource_versions
FOR DELETE
USING (
  auth.uid() = created_by
  OR EXISTS (
    SELECT 1 FROM public.workbook_resources wr
    JOIN public.workbooks w ON w.id = wr.workbook_id
    WHERE wr.id = workbook_resource_versions.resource_id
    AND w.owner_id = auth.uid()
  )
);
