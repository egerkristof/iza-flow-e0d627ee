
-- Allow architects to SELECT diagnostic_results
CREATE POLICY "Architects can view diagnostic results"
ON public.diagnostic_results
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'architect'::app_role));

-- Allow architects to view all profiles (for member management)
CREATE POLICY "Architects can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'architect'::app_role));
