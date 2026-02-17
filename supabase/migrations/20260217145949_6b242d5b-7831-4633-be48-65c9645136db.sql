
-- Sync history log for the canonical document view
CREATE TABLE public.document_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  document_snapshot TEXT NOT NULL,
  changeset JSONB NOT NULL DEFAULT '{}',
  summary TEXT,
  items_created INTEGER NOT NULL DEFAULT 0,
  items_updated INTEGER NOT NULL DEFAULT 0,
  items_deleted INTEGER NOT NULL DEFAULT 0,
  errors JSONB DEFAULT '[]'
);

-- Enable RLS
ALTER TABLE public.document_sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sync logs"
  ON public.document_sync_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sync logs"
  ON public.document_sync_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Index for fast lookup by bundle
CREATE INDEX idx_document_sync_logs_bundle ON public.document_sync_logs(bundle_id, synced_at DESC);
