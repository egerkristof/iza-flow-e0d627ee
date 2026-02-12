
-- Workbook members (who belongs to a workbook and their role within it)
CREATE TABLE public.workbook_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workbook_id uuid NOT NULL REFERENCES public.workbooks(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member', -- 'owner', 'editor', 'member', 'viewer'
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(workbook_id, user_id)
);

ALTER TABLE public.workbook_members ENABLE ROW LEVEL SECURITY;

-- Members can see other members in workbooks they belong to
CREATE POLICY "Members can view workbook members"
  ON public.workbook_members FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.workbook_members wm WHERE wm.workbook_id = workbook_members.workbook_id AND wm.user_id = auth.uid())
    OR has_role(auth.uid(), 'manager'::app_role)
    OR has_role(auth.uid(), 'architect'::app_role)
  );

CREATE POLICY "Owners/architects can add members"
  ON public.workbook_members FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.workbooks w WHERE w.id = workbook_id AND w.owner_id = auth.uid())
    OR has_role(auth.uid(), 'architect'::app_role)
  );

CREATE POLICY "Owners/architects can remove members"
  ON public.workbook_members FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.workbooks w WHERE w.id = workbook_id AND w.owner_id = auth.uid())
    OR has_role(auth.uid(), 'architect'::app_role)
    OR user_id = auth.uid() -- can leave
  );

-- Workbook chats (private & group threads, separate from protocol execution)
CREATE TABLE public.workbook_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workbook_id uuid NOT NULL REFERENCES public.workbooks(id) ON DELETE CASCADE,
  chat_type text NOT NULL DEFAULT 'private', -- 'private', 'group'
  title text, -- null for private (auto-generated from participants)
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.workbook_chats ENABLE ROW LEVEL SECURITY;

-- Chat messages
CREATE TABLE public.workbook_chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.workbook_chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.workbook_chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat participants (for both private and group)
CREATE TABLE public.workbook_chat_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES public.workbook_chats(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(chat_id, user_id)
);

ALTER TABLE public.workbook_chat_participants ENABLE ROW LEVEL SECURITY;

-- Chat RLS: only participants can see/send
CREATE POLICY "Participants can view chats"
  ON public.workbook_chats FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.workbook_chat_participants p WHERE p.chat_id = id AND p.user_id = auth.uid())
    OR has_role(auth.uid(), 'architect'::app_role)
  );

CREATE POLICY "Members can create chats"
  ON public.workbook_chats FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Participants can view messages"
  ON public.workbook_chat_messages FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.workbook_chat_participants p WHERE p.chat_id = chat_id AND p.user_id = auth.uid())
  );

CREATE POLICY "Participants can send messages"
  ON public.workbook_chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (SELECT 1 FROM public.workbook_chat_participants p WHERE p.chat_id = chat_id AND p.user_id = auth.uid())
  );

CREATE POLICY "Participants can view participants"
  ON public.workbook_chat_participants FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.workbook_chat_participants p2 WHERE p2.chat_id = chat_id AND p2.user_id = auth.uid())
  );

CREATE POLICY "Chat creators can add participants"
  ON public.workbook_chat_participants FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.workbook_chats c WHERE c.id = chat_id AND c.created_by = auth.uid())
    OR auth.uid() = user_id -- joining yourself
  );

-- Workbook agent/LLM configuration
CREATE TABLE public.workbook_agent_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workbook_id uuid NOT NULL REFERENCES public.workbooks(id) ON DELETE CASCADE,
  model_id text NOT NULL, -- e.g. 'google/gemini-2.5-flash', 'openai/gpt-5'
  is_enabled boolean NOT NULL DEFAULT true,
  max_tokens integer DEFAULT 4096,
  temperature numeric DEFAULT 0.7,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(workbook_id, model_id)
);

ALTER TABLE public.workbook_agent_config ENABLE ROW LEVEL SECURITY;

-- Members can view agent config
CREATE POLICY "Members can view agent config"
  ON public.workbook_agent_config FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.workbook_members wm WHERE wm.workbook_id = workbook_agent_config.workbook_id AND wm.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.workbooks w WHERE w.id = workbook_id AND w.owner_id = auth.uid())
    OR has_role(auth.uid(), 'architect'::app_role)
  );

-- Only owners/architects can configure
CREATE POLICY "Owners can manage agent config"
  ON public.workbook_agent_config FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.workbooks w WHERE w.id = workbook_id AND w.owner_id = auth.uid())
    OR has_role(auth.uid(), 'architect'::app_role)
  );

CREATE POLICY "Owners can update agent config"
  ON public.workbook_agent_config FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.workbooks w WHERE w.id = workbook_id AND w.owner_id = auth.uid())
    OR has_role(auth.uid(), 'architect'::app_role)
  );

CREATE POLICY "Owners can delete agent config"
  ON public.workbook_agent_config FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.workbooks w WHERE w.id = workbook_id AND w.owner_id = auth.uid())
    OR has_role(auth.uid(), 'architect'::app_role)
  );

-- Triggers for updated_at
CREATE TRIGGER update_workbook_chats_updated_at
  BEFORE UPDATE ON public.workbook_chats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workbook_agent_config_updated_at
  BEFORE UPDATE ON public.workbook_agent_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.workbook_chat_messages;
