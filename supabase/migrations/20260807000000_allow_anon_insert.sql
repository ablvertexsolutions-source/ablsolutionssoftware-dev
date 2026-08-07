-- Allow anonymous (public API) inserts into demo_requests
-- This enables the Request Demo form to submit without requiring service role auth
DO $$
BEGIN
  -- Drop existing policy if it exists (idempotent)
  DROP POLICY IF EXISTS "Allow public insert" ON public.demo_requests;
  DROP POLICY IF EXISTS "Allow anon insert" ON public.demo_requests;
  DROP POLICY IF EXISTS "Allow service_role full access" ON public.demo_requests;
END $$;

-- Allow anyone (anon/public) to INSERT a demo request
CREATE POLICY "Allow anon insert"
  ON public.demo_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service_role full access (admin operations)
CREATE POLICY "Allow service_role full access"
  ON public.demo_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
