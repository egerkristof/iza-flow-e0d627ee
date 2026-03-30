CREATE POLICY "Architects can update diagnostic results"
ON public.diagnostic_results
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'architect'));