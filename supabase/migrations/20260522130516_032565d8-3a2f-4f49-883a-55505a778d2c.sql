CREATE TABLE public.briefs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  inputs JSONB NOT NULL,
  output JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a brief"
  ON public.briefs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can read a brief by id"
  ON public.briefs FOR SELECT
  USING (true);