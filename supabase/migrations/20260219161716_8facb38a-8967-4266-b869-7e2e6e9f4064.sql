CREATE TABLE IF NOT EXISTS public.beta_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  role_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.beta_signups ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public signup form)
CREATE POLICY "Anyone can sign up for beta"
ON public.beta_signups
FOR INSERT
WITH CHECK (true);

-- Only authenticated users can read signups
CREATE POLICY "Authenticated users can view signups"
ON public.beta_signups
FOR SELECT
USING (auth.role() = 'authenticated');
