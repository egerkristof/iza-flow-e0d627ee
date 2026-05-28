
-- 1. beta_signups: architect-only SELECT
DROP POLICY IF EXISTS "Authenticated users can view signups" ON public.beta_signups;
CREATE POLICY "Architects can view beta signups"
  ON public.beta_signups
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'architect'::app_role));

-- 2. extraction_trials: architect-only SELECT
DROP POLICY IF EXISTS "Authenticated users can view trials" ON public.extraction_trials;
CREATE POLICY "Architects can view extraction trials"
  ON public.extraction_trials
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'architect'::app_role));

-- 3. diagnostic_results: remove public SELECT + permissive anon UPDATE.
-- Architect SELECT/UPDATE policies already exist and are kept.
DROP POLICY IF EXISTS "Anyone can view diagnostic results by id" ON public.diagnostic_results;
DROP POLICY IF EXISTS "Anyone can update diagnostic results to add email" ON public.diagnostic_results;

-- Safe public read helpers (no PII columns)
CREATE OR REPLACE FUNCTION public.get_diagnostic_result_public(result_id uuid)
RETURNS TABLE (
  id uuid,
  answers jsonb,
  scores jsonb,
  archetype text,
  overall_score integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, answers, scores, archetype, overall_score
  FROM public.diagnostic_results
  WHERE id = result_id
$$;

REVOKE EXECUTE ON FUNCTION public.get_diagnostic_result_public(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_diagnostic_result_public(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_diagnostic_submission_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*) FROM public.diagnostic_results
$$;

REVOKE EXECUTE ON FUNCTION public.get_diagnostic_submission_count() FROM public;
GRANT EXECUTE ON FUNCTION public.get_diagnostic_submission_count() TO anon, authenticated;

-- 4. calculator_sessions: only updatable until a lead email is captured
DROP POLICY IF EXISTS "Anyone can update calculator sessions" ON public.calculator_sessions;
CREATE POLICY "Sessions updatable until lead is captured"
  ON public.calculator_sessions
  FOR UPDATE TO anon, authenticated
  USING (email IS NULL OR email_captured_at IS NULL)
  WITH CHECK (true);

-- 5. profiles: restrict directory to authenticated users
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles
  FOR SELECT TO authenticated
  USING (true);
