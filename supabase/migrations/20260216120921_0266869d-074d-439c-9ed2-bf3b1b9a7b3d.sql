-- Allow architects to view all junction rows (mirrors context_items policy)
CREATE POLICY "Architects can view all item bundles"
ON public.context_item_bundles
FOR SELECT
USING (public.has_role(auth.uid(), 'architect'::app_role));

-- Also allow viewing junction rows for items in bundles the user owns
CREATE POLICY "Users can view item bundles for accessible bundles"
ON public.context_item_bundles
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM bundles b
  WHERE b.id = context_item_bundles.bundle_id
  AND b.owner_id = auth.uid()
));