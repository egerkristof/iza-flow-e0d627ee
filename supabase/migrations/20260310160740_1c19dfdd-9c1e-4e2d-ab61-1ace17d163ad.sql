CREATE TABLE public.diagnostic_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  archetype text NOT NULL,
  overall_score integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.diagnostic_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert diagnostic results"
  ON public.diagnostic_results
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
