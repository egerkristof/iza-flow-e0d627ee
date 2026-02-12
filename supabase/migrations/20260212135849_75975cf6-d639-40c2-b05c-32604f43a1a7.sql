
-- Create a security definer function to check workbook membership
CREATE OR REPLACE FUNCTION public.is_workbook_member(_user_id uuid, _workbook_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workbook_members
    WHERE user_id = _user_id AND workbook_id = _workbook_id
  )
$$;

-- Create a security definer function to check workbook ownership
CREATE OR REPLACE FUNCTION public.is_workbook_owner(_user_id uuid, _workbook_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workbooks
    WHERE id = _workbook_id AND owner_id = _user_id
  )
$$;

-- Fix workbook_members SELECT policy (was self-referencing)
DROP POLICY IF EXISTS "Members can view workbook members" ON public.workbook_members;
CREATE POLICY "Members can view workbook members"
ON public.workbook_members
FOR SELECT
USING (
  user_id = auth.uid()
  OR is_workbook_owner(auth.uid(), workbook_id)
  OR has_role(auth.uid(), 'manager'::app_role)
  OR has_role(auth.uid(), 'architect'::app_role)
);

-- Fix workbook_resources SELECT policy to use new functions
DROP POLICY IF EXISTS "Members can view workbook resources" ON public.workbook_resources;
CREATE POLICY "Members can view workbook resources"
ON public.workbook_resources
FOR SELECT
USING (
  is_workbook_member(auth.uid(), workbook_id)
  OR is_workbook_owner(auth.uid(), workbook_id)
  OR has_role(auth.uid(), 'architect'::app_role)
);

-- Fix workbook_resources INSERT policy
DROP POLICY IF EXISTS "Members can create workbook resources" ON public.workbook_resources;
CREATE POLICY "Members can create workbook resources"
ON public.workbook_resources
FOR INSERT
WITH CHECK (
  auth.uid() = created_by
  AND (
    is_workbook_member(auth.uid(), workbook_id)
    OR is_workbook_owner(auth.uid(), workbook_id)
  )
);

-- Fix workbook_resources DELETE policy
DROP POLICY IF EXISTS "Creators can delete own resources" ON public.workbook_resources;
CREATE POLICY "Creators can delete own resources"
ON public.workbook_resources
FOR DELETE
USING (
  auth.uid() = created_by
  OR is_workbook_owner(auth.uid(), workbook_id)
);

-- Fix workbook_agent_config SELECT policy
DROP POLICY IF EXISTS "Members can view agent config" ON public.workbook_agent_config;
CREATE POLICY "Members can view agent config"
ON public.workbook_agent_config
FOR SELECT
USING (
  is_workbook_member(auth.uid(), workbook_id)
  OR is_workbook_owner(auth.uid(), workbook_id)
  OR has_role(auth.uid(), 'architect'::app_role)
);
