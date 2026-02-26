
CREATE TABLE public.extraction_trials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  name text,
  company text,
  source_type text NOT NULL DEFAULT 'sample',
  content_preview text,
  result_summary jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.extraction_trials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create trials"
  ON public.extraction_trials FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view trials"
  ON public.extraction_trials FOR SELECT
  TO authenticated
  USING (true);
