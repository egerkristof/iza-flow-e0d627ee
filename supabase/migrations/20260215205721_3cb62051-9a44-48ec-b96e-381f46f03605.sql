-- Allow users to update their own item-bundle junction rows (for sort_order, parent_playbook_id changes)
CREATE POLICY "Users can update own item bundles"
ON public.context_item_bundles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM context_items ci
    WHERE ci.id = context_item_bundles.context_item_id
    AND ci.owner_id = auth.uid()
  )
);