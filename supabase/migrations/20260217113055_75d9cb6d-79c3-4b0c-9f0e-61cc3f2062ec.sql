
-- Create domains table
CREATE TABLE public.domains (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  tag text NOT NULL,
  icon text DEFAULT 'Folder',
  color text DEFAULT 'blue',
  is_default boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own domains"
  ON public.domains FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own domains"
  ON public.domains FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own domains"
  ON public.domains FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own domains"
  ON public.domains FOR DELETE
  USING (auth.uid() = owner_id);

CREATE POLICY "Architects can view all domains"
  ON public.domains FOR SELECT
  USING (has_role(auth.uid(), 'architect'::app_role));

-- Updated_at trigger
CREATE TRIGGER update_domains_updated_at
  BEFORE UPDATE ON public.domains
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed function
CREATE OR REPLACE FUNCTION public.seed_default_domains(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only seed if user has no domains
  IF NOT EXISTS (SELECT 1 FROM public.domains WHERE owner_id = p_user_id) THEN
    INSERT INTO public.domains (owner_id, title, description, tag, icon, color, is_default, sort_order) VALUES
      (p_user_id, 'Org-Wide', 'Organization-wide items and bundles', 'GLOBAL', 'Globe', 'slate', true, 0),
      (p_user_id, 'Sales & Marketing', 'Revenue generation, lead management, and brand strategy', 'sales', 'TrendingUp', 'blue', true, 1),
      (p_user_id, 'Operations', 'Process management, logistics, and operational excellence', 'operations', 'Settings', 'amber', true, 2),
      (p_user_id, 'Finance', 'Financial planning, accounting, and budget management', 'finance', 'DollarSign', 'emerald', true, 3),
      (p_user_id, 'People (HR)', 'Talent acquisition, culture, and employee development', 'hr', 'Users', 'violet', true, 4),
      (p_user_id, 'Product & Engineering', 'Product development, technology, and innovation', 'engineering', 'Code', 'cyan', true, 5),
      (p_user_id, 'Customer Success', 'Client retention, satisfaction, and relationship management', 'cs', 'HeartHandshake', 'rose', true, 6),
      (p_user_id, 'Legal & Compliance', 'Regulatory compliance, contracts, and risk management', 'compliance', 'Shield', 'orange', true, 7),
      (p_user_id, 'Strategy', 'Vision, strategic planning, and organizational direction', 'strategy', 'Target', 'indigo', true, 8);
  END IF;
END;
$$;
