// Server-side Supabase client with service role key - bypasses RLS.
// Use this for admin operations in server functions and server routes only.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function createSupabaseAdminClient() {
  const SUPABASE_URL = 
    (typeof process !== 'undefined' ? process.env['SUPABASE_URL'] : undefined) || 
    (typeof process !== 'undefined' ? process.env['VITE_SUPABASE_URL'] : undefined) ||
    import.meta.env.VITE_SUPABASE_URL ||
    (typeof process !== 'undefined' && process.env['SUPABASE_PROJECT_ID'] ? `https://${process.env['SUPABASE_PROJECT_ID']}.supabase.co` : undefined) ||
    (typeof process !== 'undefined' && process.env['VITE_SUPABASE_PROJECT_ID'] ? `https://${process.env['VITE_SUPABASE_PROJECT_ID']}.supabase.co` : undefined) ||
    (import.meta.env.VITE_SUPABASE_PROJECT_ID && `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co`) ||
    'https://jupbwlxoelkskbqhiyol.supabase.co';

  const SUPABASE_SERVICE_ROLE_KEY =
    (typeof process !== 'undefined' ? process.env['SUPABASE_SERVICE_ROLE_KEY'] : undefined) ||
    (typeof process !== 'undefined' ? process.env['SUPABASE_SECRET_KEY'] : undefined) ||
    (typeof process !== 'undefined' ? process.env['SUPABASE_SERVICE_KEY'] : undefined) ||
    (typeof process !== 'undefined' ? process.env['ABLVERTEX'] : undefined) ||
    (typeof process !== 'undefined' ? process.env['ablvertex'] : undefined) ||
    (typeof process !== 'undefined' ? process.env['SUPABASE_PUBLISHABLE_KEY'] : undefined) ||
    (typeof process !== 'undefined' ? process.env['VITE_SUPABASE_PUBLISHABLE_KEY'] : undefined) ||
    (typeof process !== 'undefined' ? process.env['SUPABASE_ANON_KEY'] : undefined) ||
    (typeof process !== 'undefined' ? process.env['VITE_SUPABASE_ANON_KEY'] : undefined) ||
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    'sb_publishable_YfIAnkE91sQEIlWvbQ9rLg_nnGeftVP';

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
      ...(!SUPABASE_SERVICE_ROLE_KEY ? ['SUPABASE_SERVICE_ROLE_KEY / SUPABASE_PUBLISHABLE_KEY'] : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(', ')}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY),
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});

let _tablesEnsured = false;

export async function ensureTables(): Promise<void> {
  if (_tablesEnsured) return;
  _tablesEnsured = true;

  try {
    const client = supabaseAdmin;
    const { error: checkError } = await client
      .from('demo_requests')
      .select('id')
      .limit(1);

    if (checkError?.code !== 'PGRST205') {
      return;
    }

    console.log('[supabase] Tables missing — attempting to create via exec_sql RPC...');

    const sql = `
      CREATE TABLE IF NOT EXISTS public.demo_requests (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        full_name text NOT NULL,
        work_email text NOT NULL,
        company text,
        phone text,
        country text,
        country_code text,
        subject text,
        system_interest text,
        message text,
        status text NOT NULL DEFAULT 'NEW',
        notes text
      );
      GRANT ALL ON public.demo_requests TO service_role;
      ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

      CREATE TABLE IF NOT EXISTS public.admin_settings (
        key text PRIMARY KEY,
        value text,
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      GRANT ALL ON public.admin_settings TO service_role;
      ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

      CREATE OR REPLACE FUNCTION public.set_updated_at()
      RETURNS TRIGGER AS $fn$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $fn$
      LANGUAGE plpgsql SET search_path = public;

      CREATE INDEX IF NOT EXISTS demo_requests_created_at_idx ON public.demo_requests (created_at DESC);
    `;

    const { error: rpcError } = await client.rpc('exec_sql', { sql });
    if (rpcError) {
      console.warn('[supabase] exec_sql RPC notice:', rpcError.message);
      _tablesEnsured = false;
    }
  } catch (e) {
    console.warn('[supabase] ensureTables warning:', e);
    _tablesEnsured = false;
  }
}
