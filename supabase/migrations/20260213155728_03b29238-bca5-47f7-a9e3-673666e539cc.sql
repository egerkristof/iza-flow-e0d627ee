
-- Junction table for multi-bundle assignment on context items
CREATE TABLE public.context_item_bundles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  context_item_id uuid NOT NULL REFERENCES public.context_items(id) ON DELETE CASCADE,
  bundle_id uuid NOT NULL REFERENCES public.bundles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(context_item_id, bundle_id)
);

ALTER TABLE public.context_item_bundles ENABLE ROW LEVEL SECURITY;

-- RLS: scoped to the context item's owner
CREATE POLICY "Users can view own item bundles"
ON public.context_item_bundles FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.context_items ci WHERE ci.id = context_item_id AND ci.owner_id = auth.uid()
));

CREATE POLICY "Users can insert own item bundles"
ON public.context_item_bundles FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.context_items ci WHERE ci.id = context_item_id AND ci.owner_id = auth.uid()
));

CREATE POLICY "Users can delete own item bundles"
ON public.context_item_bundles FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.context_items ci WHERE ci.id = context_item_id AND ci.owner_id = auth.uid()
));

-- Backfill: seed junction table from existing bundle_id column
INSERT INTO public.context_item_bundles (context_item_id, bundle_id)
SELECT id, bundle_id FROM public.context_items
WHERE bundle_id IS NOT NULL
ON CONFLICT DO NOTHING;
