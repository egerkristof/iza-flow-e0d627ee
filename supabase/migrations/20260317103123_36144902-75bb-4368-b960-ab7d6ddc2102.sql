-- Add refined industry classification and role tier columns
ALTER TABLE public.diagnostic_results
  ADD COLUMN IF NOT EXISTS industry_refined text,
  ADD COLUMN IF NOT EXISTS role_tier text;

-- Backfill role_tier for existing records based on respondent_role
UPDATE public.diagnostic_results SET role_tier = CASE
  WHEN respondent_role ILIKE '%ceo%' OR respondent_role ILIKE '%cto%' OR respondent_role ILIKE '%cro%' OR respondent_role ILIKE '%cfo%' OR respondent_role ILIKE '%chief%' OR respondent_role ILIKE '%founder%' OR respondent_role ILIKE '%co-founder%' THEN 'C-Level'
  WHEN respondent_role ILIKE '%vp%' OR respondent_role ILIKE '%vice president%' OR respondent_role ILIKE '%director%' OR respondent_role ILIKE '%head of%' THEN 'VP / Director'
  WHEN respondent_role ILIKE '%manager%' OR respondent_role ILIKE '%team lead%' OR respondent_role ILIKE '%lead%' THEN 'Manager / Lead'
  WHEN respondent_role IS NOT NULL AND respondent_role != '' THEN 'Individual Contributor'
  ELSE NULL
END
WHERE role_tier IS NULL AND respondent_role IS NOT NULL;