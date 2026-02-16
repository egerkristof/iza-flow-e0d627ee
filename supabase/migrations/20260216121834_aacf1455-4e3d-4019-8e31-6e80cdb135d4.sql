
-- Allow architects to delete any context items
CREATE POLICY "Architects can delete all context items"
ON public.context_items
FOR DELETE
USING (public.has_role(auth.uid(), 'architect'::app_role));

-- Allow architects to delete any bundles
CREATE POLICY "Architects can delete all bundles"
ON public.bundles
FOR DELETE
USING (public.has_role(auth.uid(), 'architect'::app_role));

-- Allow architects to delete any junction rows
CREATE POLICY "Architects can delete all item bundles"
ON public.context_item_bundles
FOR DELETE
USING (public.has_role(auth.uid(), 'architect'::app_role));
