CREATE POLICY "Anyone can view diagnostic results by id"
ON public.diagnostic_results
FOR SELECT
TO anon, authenticated
USING (true);