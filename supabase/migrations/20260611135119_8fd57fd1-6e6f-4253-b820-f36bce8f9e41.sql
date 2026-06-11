CREATE TABLE public.factory_floor_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  promise text NOT NULL,
  workflow text NOT NULL,
  grading text NOT NULL,
  verdict jsonb,
  call_requested boolean NOT NULL DEFAULT false,
  name text,
  email text,
  company text,
  role text,
  user_agent text
);
GRANT SELECT, INSERT, UPDATE ON public.factory_floor_submissions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.factory_floor_submissions TO authenticated;
GRANT ALL ON public.factory_floor_submissions TO service_role;
ALTER TABLE public.factory_floor_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can insert factory submissions" ON public.factory_floor_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anyone can update factory submissions" ON public.factory_floor_submissions FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE INDEX factory_floor_submissions_created_at_idx ON public.factory_floor_submissions (created_at DESC);