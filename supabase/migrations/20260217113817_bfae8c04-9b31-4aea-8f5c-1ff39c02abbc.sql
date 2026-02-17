
-- Junction table for bundle-to-domain many-to-many relationship
CREATE TABLE public.bundle_domains (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id uuid NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
  domain_id uuid NOT NULL REFERENCES public.domains(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(bundle_id, domain_id)
);

-- Enable RLS
ALTER TABLE public.bundle_domains ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view bundle_domains for their own bundles
CREATE POLICY "Users can view own bundle domains"
ON public.bundle_domains FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.bundles b WHERE b.id = bundle_domains.bundle_id AND b.owner_id = auth.uid()
));

-- Architects can view all
CREATE POLICY "Architects can view all bundle domains"
ON public.bundle_domains FOR SELECT
USING (has_role(auth.uid(), 'architect'::app_role));

-- Users can insert for their own bundles
CREATE POLICY "Users can insert own bundle domains"
ON public.bundle_domains FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.bundles b WHERE b.id = bundle_domains.bundle_id AND b.owner_id = auth.uid()
));

-- Users can delete their own bundle domains
CREATE POLICY "Users can delete own bundle domains"
ON public.bundle_domains FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.bundles b WHERE b.id = bundle_domains.bundle_id AND b.owner_id = auth.uid()
));

-- Architects can delete all
CREATE POLICY "Architects can delete all bundle domains"
ON public.bundle_domains FOR DELETE
USING (has_role(auth.uid(), 'architect'::app_role));

-- Index for fast lookups
CREATE INDEX idx_bundle_domains_bundle_id ON public.bundle_domains(bundle_id);
CREATE INDEX idx_bundle_domains_domain_id ON public.bundle_domains(domain_id);
