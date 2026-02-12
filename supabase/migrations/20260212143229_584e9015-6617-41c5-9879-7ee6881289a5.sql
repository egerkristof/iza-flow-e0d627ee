
-- Add capture tracking fields to context_items
ALTER TABLE public.context_items
  ADD COLUMN IF NOT EXISTS source_workbook_id uuid REFERENCES public.workbooks(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source_chat_id uuid REFERENCES public.workbook_chats(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS capture_status text NOT NULL DEFAULT 'accepted';

-- Add index for efficient inbox queries
CREATE INDEX IF NOT EXISTS idx_context_items_capture_status ON public.context_items (capture_status) WHERE capture_status = 'draft';
CREATE INDEX IF NOT EXISTS idx_context_items_source_workbook ON public.context_items (source_workbook_id) WHERE source_workbook_id IS NOT NULL;
