
-- Copilot conversation sessions
CREATE TABLE public.copilot_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Chat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.copilot_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON public.copilot_conversations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own conversations" ON public.copilot_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON public.copilot_conversations
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON public.copilot_conversations
  FOR DELETE USING (auth.uid() = user_id);

-- Copilot messages
CREATE TABLE public.copilot_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.copilot_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.copilot_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON public.copilot_messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.copilot_conversations c WHERE c.id = copilot_messages.conversation_id AND c.user_id = auth.uid()
  ));
CREATE POLICY "Users can insert own messages" ON public.copilot_messages
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.copilot_conversations c WHERE c.id = copilot_messages.conversation_id AND c.user_id = auth.uid()
  ));
CREATE POLICY "Users can delete own messages" ON public.copilot_messages
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.copilot_conversations c WHERE c.id = copilot_messages.conversation_id AND c.user_id = auth.uid()
  ));

-- Index for fast lookups
CREATE INDEX idx_copilot_messages_conversation ON public.copilot_messages(conversation_id, created_at);
CREATE INDEX idx_copilot_conversations_user ON public.copilot_conversations(user_id, updated_at DESC);

-- Updated_at trigger
CREATE TRIGGER update_copilot_conversations_updated_at
  BEFORE UPDATE ON public.copilot_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
