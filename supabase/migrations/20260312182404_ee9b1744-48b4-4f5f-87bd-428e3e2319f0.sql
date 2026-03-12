DROP POLICY "Anyone can update diagnostic results email" ON public.diagnostic_results;

CREATE POLICY "Anyone can update diagnostic results to add email"
ON public.diagnostic_results
FOR UPDATE
TO anon, authenticated
USING (email IS NULL)
WITH CHECK (true);