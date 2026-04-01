
CREATE TABLE public.platform_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT,
  email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  team_size TEXT,
  primary_interest TEXT,
  additional_notes TEXT
);

ALTER TABLE public.platform_signups ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Anyone can insert platform signups"
  ON public.platform_signups FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only architects can read
CREATE POLICY "Architects can read platform signups"
  ON public.platform_signups FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'architect'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.platform_signups;
