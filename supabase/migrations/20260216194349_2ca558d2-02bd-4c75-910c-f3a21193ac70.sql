-- Allow chat creators to delete their own chats
CREATE POLICY "Creators can delete own chats"
ON public.workbook_chats
FOR DELETE
USING (auth.uid() = created_by);

-- Allow chat creators to update their own chats (needed for updated_at)
CREATE POLICY "Creators can update own chats"
ON public.workbook_chats
FOR UPDATE
USING (auth.uid() = created_by);

-- Allow deleting chat participants when chat is deleted (cascade cleanup)
CREATE POLICY "Chat creators can delete participants"
ON public.workbook_chat_participants
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM workbook_chats c
    WHERE c.id = workbook_chat_participants.chat_id AND c.created_by = auth.uid()
  )
);

-- Allow deleting chat messages when chat is deleted
CREATE POLICY "Chat creators can delete messages"
ON public.workbook_chat_messages
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM workbook_chats c
    WHERE c.id = workbook_chat_messages.chat_id AND c.created_by = auth.uid()
  )
);