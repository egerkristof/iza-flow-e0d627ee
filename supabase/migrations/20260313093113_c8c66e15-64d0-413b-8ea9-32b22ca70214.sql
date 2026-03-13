
-- Add session_id for deduplication (one record per browser session)
ALTER TABLE public.diagnostic_results 
  ADD COLUMN IF NOT EXISTS session_id text;

-- Create unique index on session_id to prevent duplicate inserts
CREATE UNIQUE INDEX IF NOT EXISTS idx_diagnostic_results_session_id 
  ON public.diagnostic_results (session_id) 
  WHERE session_id IS NOT NULL;

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_diagnostic_results_email 
  ON public.diagnostic_results (email) 
  WHERE email IS NOT NULL;
