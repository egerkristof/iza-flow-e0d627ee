-- Fix 1: Create a SECURITY DEFINER function that returns workbook IDs
-- a user can access (as owner or member), bypassing RLS entirely.
CREATE OR REPLACE FUNCTION public.user_accessible_workbook_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.workbooks WHERE owner_id = _user_id
  UNION
  SELECT workbook_id FROM public.workbook_members WHERE user_id = _user_id
$$;

-- Fix 2: Create a SECURITY DEFINER function that checks chat participation
-- without triggering RLS on workbook_chat_participants
CREATE OR REPLACE FUNCTION public.is_chat_participant(_user_id uuid, _chat_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workbook_chat_participants
    WHERE user_id = _user_id AND chat_id = _chat_id
  )
$$;

-- ═══ Fix workbook_resources policies ═══
DROP POLICY IF EXISTS "Members can view workbook resources" ON public.workbook_resources;
CREATE POLICY "Members can view workbook resources"
  ON public.workbook_resources FOR SELECT
  USING (
    workbook_id IN (SELECT user_accessible_workbook_ids(auth.uid()))
    OR has_role(auth.uid(), 'architect'::app_role)
  );

DROP POLICY IF EXISTS "Members can create workbook resources" ON public.workbook_resources;
CREATE POLICY "Members can create workbook resources"
  ON public.workbook_resources FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND workbook_id IN (SELECT user_accessible_workbook_ids(auth.uid()))
  );

DROP POLICY IF EXISTS "Creators can update own resources" ON public.workbook_resources;
CREATE POLICY "Creators can update own resources"
  ON public.workbook_resources FOR UPDATE
  USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Creators can delete own resources" ON public.workbook_resources;
CREATE POLICY "Creators can delete own resources"
  ON public.workbook_resources FOR DELETE
  USING (
    auth.uid() = created_by
    OR workbook_id IN (SELECT id FROM public.workbooks WHERE owner_id = auth.uid())
  );

-- ═══ Fix workbook_chat_participants (self-referential recursion) ═══
DROP POLICY IF EXISTS "Participants can view participants" ON public.workbook_chat_participants;
CREATE POLICY "Participants can view participants"
  ON public.workbook_chat_participants FOR SELECT
  USING (is_chat_participant(auth.uid(), chat_id));

-- ═══ Fix workbook_chat_messages (cross-table recursion) ═══
DROP POLICY IF EXISTS "Participants can view messages" ON public.workbook_chat_messages;
CREATE POLICY "Participants can view messages"
  ON public.workbook_chat_messages FOR SELECT
  USING (is_chat_participant(auth.uid(), chat_id));

DROP POLICY IF EXISTS "Participants can send messages" ON public.workbook_chat_messages;
CREATE POLICY "Participants can send messages"
  ON public.workbook_chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND is_chat_participant(auth.uid(), chat_id)
  );

-- ═══ Fix workbook_chats (was using p.chat_id = p.id which is wrong) ═══
DROP POLICY IF EXISTS "Participants can view chats" ON public.workbook_chats;
CREATE POLICY "Participants can view chats"
  ON public.workbook_chats FOR SELECT
  USING (
    is_chat_participant(auth.uid(), id)
    OR has_role(auth.uid(), 'architect'::app_role)
  );