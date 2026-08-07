-- Fix RLS: Allow anonymous inserts into demo_requests for the public Request Demo form
-- Drop old incorrect policy if it was applied
DROP POLICY IF EXISTS "Allow public insert" ON public.demo_requests;

-- Allow anon role (publishable key / public API) to INSERT demo requests
CREATE POLICY "anon_can_insert_demo_requests"
  ON public.demo_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service_role full access for admin operations
DROP POLICY IF EXISTS "Allow service_role full access" ON public.demo_requests;
CREATE POLICY "service_role_full_access_demo_requests"
  ON public.demo_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
