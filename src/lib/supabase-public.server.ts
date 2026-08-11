// Server-side Supabase client using the PUBLIC (publishable) key only.
// Safe to run in any host: no service-role credentials required.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Public project values (publishable key is safe to ship — RLS still applies).
const FALLBACK_URL = "https://ubsnwiccouvkdomdchhm.supabase.co";
const FALLBACK_KEY = "sb_publishable_J2QO-NC33skLFB_Ljg9dPQ_UIeiKg4Y";

export function createPublicServerClient() {
  const url =
    process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"] || FALLBACK_URL;
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    process.env["SUPABASE_ANON_KEY"] ||
    FALLBACK_KEY;

  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}
