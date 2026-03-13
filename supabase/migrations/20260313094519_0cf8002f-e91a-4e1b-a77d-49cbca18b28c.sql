
ALTER TABLE public.diagnostic_results
  ADD COLUMN IF NOT EXISTS respondent_role text,
  ADD COLUMN IF NOT EXISTS team_size text,
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS industry text;
