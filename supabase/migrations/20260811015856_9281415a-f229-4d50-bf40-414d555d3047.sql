GRANT INSERT ON public.demo_requests TO anon;
GRANT INSERT ON public.demo_requests TO authenticated;
DROP POLICY IF EXISTS "Public can submit demo requests" ON public.demo_requests;
CREATE POLICY "Public can submit demo requests"
ON public.demo_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);