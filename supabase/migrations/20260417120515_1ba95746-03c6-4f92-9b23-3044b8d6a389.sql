-- Calculator sessions: tracks anonymous usage of the Instruction Gap calculator
CREATE TABLE public.calculator_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  team_size integer NOT NULL,
  department text NOT NULL,
  hourly_cost integer NOT NULL,
  rework_annual numeric NOT NULL,
  total_gap numeric NOT NULL,
  recoverable numeric NOT NULL,
  email text,
  name text,
  company text,
  email_captured_at timestamptz,
  referrer text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- One row per session_id; we upsert as the user tweaks values
CREATE UNIQUE INDEX calculator_sessions_session_id_idx
  ON public.calculator_sessions (session_id);

CREATE INDEX calculator_sessions_created_at_idx
  ON public.calculator_sessions (created_at DESC);

CREATE INDEX calculator_sessions_email_idx
  ON public.calculator_sessions (email)
  WHERE email IS NOT NULL;

ALTER TABLE public.calculator_sessions ENABLE ROW LEVEL SECURITY;

-- Anyone (anon) can insert a session row after meaningful engagement
CREATE POLICY "Anyone can insert calculator sessions"
  ON public.calculator_sessions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone (anon) can update their own row by session_id (to refine values + add email)
CREATE POLICY "Anyone can update calculator sessions"
  ON public.calculator_sessions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Only architects can read sessions
CREATE POLICY "Architects can view calculator sessions"
  ON public.calculator_sessions
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'architect'::app_role));

-- Auto-bump updated_at
CREATE TRIGGER calculator_sessions_set_updated_at
  BEFORE UPDATE ON public.calculator_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();