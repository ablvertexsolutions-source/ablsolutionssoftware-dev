CREATE TABLE public.demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  full_name text NOT NULL,
  work_email text NOT NULL,
  company text,
  phone text,
  country text,
  subject text,
  system_interest text,
  message text,
  status text NOT NULL DEFAULT 'NEW',
  notes text
);

GRANT ALL ON public.demo_requests TO service_role;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.admin_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.admin_settings TO service_role;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER demo_requests_updated_at BEFORE UPDATE ON public.demo_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX demo_requests_created_at_idx ON public.demo_requests (created_at DESC);