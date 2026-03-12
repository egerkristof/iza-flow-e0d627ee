CREATE POLICY "Anyone can update diagnostic results email"
ON public.diagnostic_results
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);