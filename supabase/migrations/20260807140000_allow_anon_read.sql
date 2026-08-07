-- Fix for Admin Customer Logs when Vercel is using the publishable (anon) key
-- Vercel requires SELECT permissions on these tables to read them since it lacks the service_role key

-- Grant SELECT on demo_requests to anon
GRANT SELECT ON public.demo_requests TO anon;

DROP POLICY IF EXISTS "anon_can_read_demo_requests" ON public.demo_requests;
CREATE POLICY "anon_can_read_demo_requests"
  ON public.demo_requests
  FOR SELECT
  TO anon
  USING (true);

-- Grant SELECT on admin_settings to anon so login configuration can be read
GRANT SELECT ON public.admin_settings TO anon;

DROP POLICY IF EXISTS "anon_can_read_admin_settings" ON public.admin_settings;
CREATE POLICY "anon_can_read_admin_settings"
  ON public.admin_settings
  FOR SELECT
  TO anon
  USING (true);
