
-- Allow users to delete their own bundles
CREATE POLICY "Users can delete own bundles"
ON public.bundles FOR DELETE
USING (auth.uid() = owner_id);
